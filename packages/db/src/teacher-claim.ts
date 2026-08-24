/**
 * P2 · TEACHER SELF-JOIN — a colleague claims a class that was set up for her.
 *
 * The shape is the student self-claim (roster-service.ts) one storey up: the
 * operator pre-creates the 2026/27 classes, every colleague opens ONE shared
 * invite link, picks her own class from a list, chooses a name + PIN, and the
 * class becomes hers. Afterwards she is an ordinary teacher — no special path
 * anywhere else in the platform (authorization stays the WHERE clause).
 *
 * WHY THE OWNER LIST IS A PARAMETER: the grandmaster allowlist lives in an env
 * var read by the web app (apps/web/lib/grandmaster.ts) — no application write
 * path can reach it, which is the whole security argument of the rank. This
 * package must not (and cannot) import from the web app, so `ownerIds` is handed
 * IN by the caller. The rank therefore has exactly one source of truth, and this
 * file stays a pure, testable decision layer.
 *
 * journal-then-flip, as everywhere in v2: Neon HTTP has no multi-statement
 * transaction, so the `roster_events` row that records the handover is written
 * BEFORE the class flips owner. A crash between the two leaves a harmless orphan
 * journal row, never an unhistoried change.
 */
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { isUniqueViolation } from "./roster-service.ts";
import { v1Users } from "./v1.ts";
import { writeRosterEvent } from "./roster-events.ts";
import { v2Classes, v2IdentityUsers } from "./schema.ts";

// ── Pure ──────────────────────────────────────────────────────────────────────

/**
 * Does the token in the URL match the configured one? PURE, and deliberately
 * FAIL CLOSED: an unset or empty `expected` matches NOTHING, so a deployment that
 * forgot the variable has a dead route rather than an open door — the same rule
 * grandmasterIds() applies to an empty allowlist. An exact string comparison, never
 * a prefix: a `startsWith` check would let `DEV…` in on `D`.
 *
 * Not constant-time on purpose: this token gates a list of empty class names, not
 * a credential, and the URL it rides in is pasted into staff chats anyway. Revoking
 * it means changing the value and redeploying.
 */
export function inviteTokenMatches(provided: string | null | undefined, expected: string | null | undefined): boolean {
  const want = (expected ?? "").trim();
  if (want === "") return false;
  return (provided ?? "") === want;
}

/** Normalize an id list for comparison — uuids are case-insensitive, a rank must not hang on a paste's casing. */
function normalizeIds(ids: readonly string[]): string[] {
  return ids.map((id) => id.trim().toLowerCase()).filter((id) => id !== "");
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** One class a colleague may take over — name and grade only; no invite code, no person. */
export interface ClaimableClass {
  id: string;
  name: string;
  grade: number;
}

/** claimClassAsTeacher outcome: taken over / that name is already in use / the class is no longer free. */
export type TeacherClaimResult = "ok" | "taken" | "gone";

// ── Reads ─────────────────────────────────────────────────────────────────────

/**
 * The classes a colleague may claim. A class is claimable EXACTLY WHEN
 *   (a) it is still owned by someone on `ownerIds` (the operator's pre-created stock),
 *   (b) it is not archived, and
 *   (c) its roster is EMPTY.
 *
 * (c) is what makes this safe without a migration and without a naming convention:
 * every class that is already in use — the operator's own test class, the July
 * experiments, anything a colleague has already filled — carries at least one
 * student row and therefore drops out of this list by itself.
 *
 * Two queries joined in JS, exactly like listClassesForTeacher: Neon HTTP has no
 * cheap correlated count here. Only students carry a classId (teachers are null,
 * see schema), so counting by classId IS the roster size.
 */
export async function listClaimableClasses(db: Db, ownerIds: readonly string[]): Promise<ClaimableClass[]> {
  const owners = normalizeIds(ownerIds);
  if (owners.length === 0) return []; // fail closed: no operator ⇒ nothing on offer

  const classes = await db
    .select({ id: v2Classes.id, name: v2Classes.name, grade: v2Classes.grade })
    .from(v2Classes)
    .where(and(inArray(v2Classes.teacherId, owners), isNull(v2Classes.archivedAt)))
    .orderBy(v2Classes.grade, v2Classes.name);
  if (classes.length === 0) return [];

  const counts = await db
    .select({ classId: v2IdentityUsers.classId, n: sql<number>`count(*)::int` })
    .from(v2IdentityUsers)
    .where(inArray(v2IdentityUsers.classId, classes.map((c) => c.id)))
    .groupBy(v2IdentityUsers.classId);
  const byClass = new Map(counts.map((r) => [r.classId, r.n]));

  return classes.filter((c) => (byClass.get(c.id) ?? 0) === 0);
}

/**
 * Is this teacher name already in use — in EITHER register, case-insensitively?
 *
 * This is an AUTH check, not a cosmetic one. lookupTeacherForAuth (auth.ts) matches
 * `lower(display_name)`, v2 first, `limit 1`: a second teacher with the same handle
 * would SILENTLY SHADOW the existing account at sign-in. Hence both registers — the
 * v2-native teachers and the v1 mirror, whose teachers can still sign in and are only
 * promoted into v2 when they first change their PIN.
 *
 * Deliberately UNGUARDED (unlike the cosmetic name lookups in class-service): if this
 * query cannot run we must not conclude "the name is free". A failure throws and the
 * claim is refused.
 *
 * Reads ONLY `display_name` of `role = 'teacher'` rows — the login handle of a member
 * of staff. No student column is ever selected from `public`.
 */
export async function teacherNameTaken(db: Db, displayName: string): Promise<boolean> {
  const name = displayName.trim();
  if (name === "") return true; // an empty handle is never available

  const v2Rows = await db
    .select({ id: v2IdentityUsers.id })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.role, "teacher"), sql`lower(${v2IdentityUsers.displayName}) = lower(${name})`))
    .limit(1);
  if (v2Rows[0]) return true;

  const v1Rows = await db
    .select({ displayName: v1Users.displayName })
    .from(v1Users)
    .where(and(eq(v1Users.role, "teacher"), sql`lower(${v1Users.displayName}) = lower(${name})`))
    .limit(1);
  return !!v1Rows[0];
}

/**
 * Re-resolve a class as claimable and return its CURRENT owner — the id the
 * conditional handover UPDATE will guard on. Null when any of the three conditions
 * has stopped holding (someone else took it, it was archived, a roster appeared).
 */
async function claimableWithOwner(
  db: Db,
  classId: string,
  owners: readonly string[],
): Promise<{ teacherId: string } | null> {
  const rows = await db
    .select({ teacherId: v2Classes.teacherId })
    .from(v2Classes)
    .where(and(eq(v2Classes.id, classId), isNull(v2Classes.archivedAt)))
    .limit(1);
  const cls = rows[0];
  if (!cls || !owners.includes(cls.teacherId.trim().toLowerCase())) return null;

  const counts = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(v2IdentityUsers)
    .where(eq(v2IdentityUsers.classId, classId));
  if ((counts[0]?.n ?? 0) !== 0) return null;

  return cls;
}

// ── The handover ──────────────────────────────────────────────────────────────

/**
 * Hand one pre-created class over to a new teacher, and create her account in the
 * same act. Returns:
 *   'ok'    — she owns the class and can sign in with the name + PIN she chose;
 *   'taken' — that name is already a teacher handle somewhere (see teacherNameTaken);
 *   'gone'  — the class is no longer claimable (a colleague was faster, or it changed).
 *
 * Order, and why:
 *   1. re-check claimability — the list she saw is seconds old;
 *   2. re-check the name — the app-level half of the double lock;
 *   3. INSERT her account. A 23505 here is the DB-level half: the partial unique
 *      index on lower(display_name) WHERE role='teacher' (migration 0013) closes the
 *      race two colleagues typing the same name at the same second would win past
 *      step 2, because Neon has no transactions to serialize them;
 *   4. journal the handover, naming HER as the actor — the journal must never be
 *      able to lie about whose hand pulled the lever (the P3 rule);
 *   5. the CONDITIONAL flip: `WHERE id = … AND teacher_id = <the owner we just read>
 *      AND archived_at IS NULL`. Zero rows returned means a concurrent claim won the
 *      class between step 1 and here ⇒ 'gone', with a friendly reload.
 *
 * If the flip loses that race her `users` row stays behind, unreferenced: an account
 * with no class, which by construction can see nothing (every teacher read is scoped
 * by teacherId). It is deliberately NOT cleaned up here — a delete on this path could
 * only ever be a second way to go wrong, and the orphan is inert. She simply picks
 * another class; the row she left is a name that is now taken, nothing more.
 *
 * The caller hashes the PIN (bcrypt stays out of @domigo/db) and the hash NEVER
 * reaches the journal payload.
 */
export async function claimClassAsTeacher(
  db: Db,
  input: { classId: string; ownerIds: readonly string[]; displayName: string; pinHash: string },
): Promise<TeacherClaimResult> {
  const { classId, pinHash } = input;
  const displayName = input.displayName.trim();
  const owners = normalizeIds(input.ownerIds);
  if (displayName === "" || owners.length === 0) return "gone";

  const cls = await claimableWithOwner(db, classId, owners);
  if (!cls) return "gone";

  if (await teacherNameTaken(db, displayName)) return "taken";

  let teacherId: string;
  try {
    const inserted = await db
      .insert(v2IdentityUsers)
      .values({ role: "teacher", displayName, classId: null, pinHash, claimedAt: new Date() })
      .returning({ id: v2IdentityUsers.id });
    teacherId = inserted[0]!.id;
  } catch (err) {
    if (isUniqueViolation(err)) return "taken"; // the index caught the name race
    throw err;
  }

  // journal-then-flip: the intent lands FIRST, with HER as the actor …
  //
  // P-R8 · IDS ONLY, INCLUDING HERS. The payload used to carry her displayName,
  // and a name in a journal is a name in a file whichever side of the desk it
  // belongs to. `toTeacherId` points at the row that holds it, so a reader who
  // needs the name resolves it at read time — nothing is lost, and nothing is
  // duplicated into a table that outlives every rename.
  await writeRosterEvent(db, {
    classId,
    kind: "teacher_claim",
    actorId: teacherId,
    payload: { classId, fromTeacherId: cls.teacherId, toTeacherId: teacherId },
  });

  // … then the guarded flip. Measured by returned rows (createClass reads its write
  // the same way) rather than a driver-specific rowCount.
  const flipped = await db
    .update(v2Classes)
    .set({ teacherId })
    .where(and(eq(v2Classes.id, classId), eq(v2Classes.teacherId, cls.teacherId), isNull(v2Classes.archivedAt)))
    .returning({ id: v2Classes.id });
  if (flipped.length === 0) return "gone";

  return "ok";
}
