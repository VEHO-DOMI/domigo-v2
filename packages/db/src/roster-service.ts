/**
 * P-2 · Roster import + student self-claim (Neon, server-only) over the v2-native
 * identity tables. Two audiences share this file:
 *   • TEACHERS import a class list and manage it (rename / reset-PIN / remove).
 *     Every teacher call is scoped by `teacherId` — the authorization IS the WHERE
 *     clause (a class the teacher doesn't own updates zero rows), exactly like
 *     class-service.ts.
 *   • STUDENTS self-claim a provisional row on the PUBLIC /join page. Those reads
 *     expose ONLY a privacy label (first name + last initial) and never a PIN,
 *     hash, or another student's data.
 *
 * A PROVISIONAL (unclaimed) student is a `v2IdentityUsers` row with `pinHash=''`
 * (the empty-string sentinel — verifyPin returns false for an empty hash, so a
 * provisional student physically CANNOT log in), `givenName` = the roster name,
 * `displayName` = that same name (a placeholder so the teacher's roster shows the
 * real name), and `claimedAt=null`. Claiming flips it live: a chosen nickname
 * into `displayName`, a real `pinHash`, and `claimedAt=now`.
 *
 * journal-then-flip (Neon HTTP has NO multi-statement transactions — see the
 * roster_events schema note): EVERY mutation appends a `v2RosterEvents` row FIRST,
 * then performs the users insert/update/delete. A crash between the two leaves a
 * harmless orphan journal row, never an unhistoried live change. Writes land ONLY
 * in `domigo_v2`; v1's `public` is never touched.
 *
 * Pure helpers (`parseRoster`, `claimLabel`) are DB-free and unit-tested in
 * roster-service.test.ts, so the endpoint and the service share one gate.
 */
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2Classes, v2IdentityUsers, v2RosterEvents } from "./schema.ts";

// ── Pure helpers (DB-free, unit-tested) ───────────────────────────────────────

/**
 * Normalize one pasted cell into a clean name: trim, strip a one-column-CSV
 * trailing comma, then strip a surrounding pair of double quotes (a spreadsheet
 * paste often yields `"Anna",`). Returns "" for a blank cell so the caller drops it.
 */
function cleanCell(raw: string): string {
  let s = raw.trim();
  if (s.endsWith(",")) s = s.slice(0, -1).trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
  return s;
}

/**
 * Clean a list of cells: drop blanks and dedupe case-insensitively while
 * PRESERVING the first casing seen ("Anna" then "anna" ⇒ just "Anna"). Shared by
 * `parseRoster` (after a newline split) and `importRoster` (already-separate
 * strings) so both apply the identical rule.
 */
function dedupeClean(cells: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cell of cells) {
    const name = cleanCell(cell);
    if (name === "") continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

/**
 * Parse a pasted roster — one student name per line (a single CSV column pastes
 * the same way). Splits on newlines only (a name may contain spaces or an internal
 * comma), trims each, drops blanks, and dedupes case-insensitively. PURE.
 */
export function parseRoster(text: string): string[] {
  return dedupeClean(text.split(/\r?\n/));
}

/**
 * The PUBLIC claim label: reduce a real name to first name + last initial
 * ("Anna Müller" ⇒ "Anna M.") so the /join list never exposes a full surname.
 * A single-word name is returned as-is; a middle name is ignored (first token +
 * the LAST token's initial). PURE — the privacy rule in one tested place.
 */
export function claimLabel(givenName: string): string {
  const parts = givenName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** One roster row for the TEACHER view (the real↔display mapping is theirs to see). */
export interface RosterEntry {
  id: string;
  givenName: string | null;
  displayName: string;
  claimed: boolean;
}

/** One PUBLIC claim candidate — only an opaque id + the privacy label, nothing else. */
export interface ClaimCandidate {
  id: string;
  label: string;
}

/** The active class behind an invite code (public claim page needs its name/grade). */
export interface ActiveClass {
  id: string;
  name: string;
  grade: number;
}

/** claimStudent outcome: claimed OK / that nickname is taken / the row is gone or already claimed. */
export type ClaimResult = "ok" | "taken" | "gone";

// ── Teacher-owned helpers (authz by teacherId) ────────────────────────────────

/**
 * Resolve a student ONLY IF their class is owned by `teacherId` — the shared
 * authorization primitive for reset/rename/remove. An inner join on
 * (users.classId = classes.id) with classes.teacherId = teacherId means a null
 * classId or another teacher's class simply yields no row. Returns the student's
 * classId + claimedAt (rename needs to know whether the row is still provisional),
 * or null when not owned.
 */
async function ownedStudent(
  db: Db,
  studentId: string,
  teacherId: string,
): Promise<{ classId: string; claimedAt: Date | null } | null> {
  const rows = await db
    .select({ classId: v2Classes.id, claimedAt: v2IdentityUsers.claimedAt })
    .from(v2IdentityUsers)
    .innerJoin(v2Classes, eq(v2IdentityUsers.classId, v2Classes.id))
    .where(and(eq(v2IdentityUsers.id, studentId), eq(v2Classes.teacherId, teacherId)))
    .limit(1);
  return rows[0] ?? null;
}

// ── Roster reads/writes ───────────────────────────────────────────────────────

/**
 * Import a pasted roster into `classId` as provisional students. Verifies the
 * class is the teacher's (returns 0 if not), cleans + dedupes the names, and SKIPS
 * any name already present by givenName (case-insensitive) so a re-paste is
 * idempotent. journal-then-flip: writes the 'import' event FIRST, then bulk-inserts
 * one provisional row per new name. Returns the number actually inserted.
 */
export async function importRoster(
  db: Db,
  input: { classId: string; teacherId: string; names: string[] },
): Promise<number> {
  const { classId, teacherId } = input;

  // Authz: the class must belong to this teacher.
  const owned = await db
    .select({ id: v2Classes.id })
    .from(v2Classes)
    .where(and(eq(v2Classes.id, classId), eq(v2Classes.teacherId, teacherId)))
    .limit(1);
  if (!owned[0]) return 0;

  const cleaned = dedupeClean(input.names);
  if (cleaned.length === 0) return 0;

  // Skip names already on the roster (by givenName, case-insensitive).
  const existing = await db
    .select({ givenName: v2IdentityUsers.givenName })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.role, "student")));
  const taken = new Set(existing.map((r) => (r.givenName ?? "").toLowerCase()).filter((k) => k !== ""));
  const toInsert = cleaned.filter((name) => !taken.has(name.toLowerCase()));
  if (toInsert.length === 0) return 0;

  // journal-then-flip: the intent lands FIRST …
  await db.insert(v2RosterEvents).values({
    classId,
    kind: "import",
    actorId: teacherId,
    payload: { names: toInsert },
  });
  // … then the provisional rows (pinHash='' ⇒ cannot log in until claimed).
  await db.insert(v2IdentityUsers).values(
    toInsert.map((name) => ({
      role: "student",
      displayName: name, // placeholder so the roster shows the real name pre-claim
      givenName: name,
      classId,
      pinHash: "",
      claimedAt: null,
    })),
  );
  return toInsert.length;
}

/**
 * The class's students for the TEACHER roster view — authz'd by teacherId via the
 * class (a class they don't own returns []). Each row carries the real givenName,
 * the chosen (or placeholder) displayName, and a `claimed` flag. Ordered by
 * givenName for a stable, scannable roster.
 */
export async function listRoster(db: Db, classId: string, teacherId: string): Promise<RosterEntry[]> {
  const owned = await db
    .select({ id: v2Classes.id })
    .from(v2Classes)
    .where(and(eq(v2Classes.id, classId), eq(v2Classes.teacherId, teacherId)))
    .limit(1);
  if (!owned[0]) return [];

  const rows = await db
    .select({
      id: v2IdentityUsers.id,
      givenName: v2IdentityUsers.givenName,
      displayName: v2IdentityUsers.displayName,
      claimedAt: v2IdentityUsers.claimedAt,
    })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.role, "student")))
    .orderBy(v2IdentityUsers.givenName);

  return rows.map((r) => ({
    id: r.id,
    givenName: r.givenName,
    displayName: r.displayName,
    claimed: r.claimedAt != null,
  }));
}

/**
 * The active class behind an invite code (null if absent or archived). A public,
 * read-only lookup — exposes only the class's name + grade, never any student data.
 */
export async function findActiveClassByCode(db: Db, inviteCode: string): Promise<ActiveClass | null> {
  const rows = await db
    .select({ id: v2Classes.id, name: v2Classes.name, grade: v2Classes.grade })
    .from(v2Classes)
    .where(and(eq(v2Classes.inviteCode, inviteCode), isNull(v2Classes.archivedAt)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * PUBLIC claim list: the UNCLAIMED students of the active class behind `inviteCode`,
 * each as { id, label } where label is first name + last initial. Empty when the
 * class is absent/archived. PRIVACY: never returns full names, PINs, or hashes.
 */
export async function unclaimedForClaim(db: Db, inviteCode: string): Promise<ClaimCandidate[]> {
  const cls = await findActiveClassByCode(db, inviteCode);
  if (!cls) return [];

  const rows = await db
    .select({ id: v2IdentityUsers.id, givenName: v2IdentityUsers.givenName, displayName: v2IdentityUsers.displayName })
    .from(v2IdentityUsers)
    .where(
      and(
        eq(v2IdentityUsers.classId, cls.id),
        eq(v2IdentityUsers.role, "student"),
        isNull(v2IdentityUsers.claimedAt),
      ),
    )
    .orderBy(v2IdentityUsers.givenName);

  // Label from givenName (fall back to displayName only if a givenName is somehow null).
  return rows.map((r) => ({ id: r.id, label: claimLabel(r.givenName ?? r.displayName) }));
}

/**
 * Claim a provisional student (the student's own action on /join). Re-checks the
 * row exists, is still unclaimed, and has a class ('gone' otherwise — the roster
 * moved under them). Then enforces that NO OTHER student in the same class holds
 * that displayName (case-insensitive) → 'taken'; this keeps the auth handle unique
 * so login is never ambiguous. journal-then-flip: a 'claim' event FIRST, then the
 * live flip (chosen displayName + pinHash + claimedAt=now). The caller hashes the
 * PIN (bcrypt stays out of @domigo/db), and the hash is NEVER written to the journal.
 */
export async function claimStudent(
  db: Db,
  input: { studentId: string; displayName: string; pinHash: string },
): Promise<ClaimResult> {
  const { studentId, pinHash } = input;
  const displayName = input.displayName.trim();

  const rows = await db
    .select({ classId: v2IdentityUsers.classId, claimedAt: v2IdentityUsers.claimedAt })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.id, studentId), eq(v2IdentityUsers.role, "student")))
    .limit(1);
  const student = rows[0];
  if (!student || student.claimedAt != null || !student.classId) return "gone";
  const classId = student.classId;

  // Nickname must be unique within the class (case-insensitive), ignoring self.
  const clash = await db
    .select({ id: v2IdentityUsers.id })
    .from(v2IdentityUsers)
    .where(
      and(
        eq(v2IdentityUsers.classId, classId),
        eq(v2IdentityUsers.role, "student"),
        ne(v2IdentityUsers.id, studentId),
        sql`lower(${v2IdentityUsers.displayName}) = lower(${displayName})`,
      ),
    )
    .limit(1);
  if (clash[0]) return "taken";

  // journal-then-flip: the 'claim' intent (no secret in the payload) lands FIRST …
  await db.insert(v2RosterEvents).values({
    classId,
    kind: "claim",
    actorId: null, // self-serve student action — no teacher actor
    payload: { studentId, displayName },
  });
  // … then the live flip to an active, loggable student.
  await db
    .update(v2IdentityUsers)
    .set({ displayName, pinHash, claimedAt: new Date() })
    .where(eq(v2IdentityUsers.id, studentId));
  return "ok";
}

/**
 * Reset a student's PIN back to provisional (they must re-claim): pinHash='' +
 * claimedAt=null. Authz'd — the student's class must be the teacher's, else a
 * silent no-op. journal-then-flip: 'reset_pin' event FIRST, then the flip.
 */
export async function resetStudentPin(db: Db, studentId: string, teacherId: string): Promise<void> {
  const owned = await ownedStudent(db, studentId, teacherId);
  if (!owned) return;

  await db.insert(v2RosterEvents).values({
    classId: owned.classId,
    kind: "reset_pin",
    actorId: teacherId,
    payload: { studentId },
  });
  await db
    .update(v2IdentityUsers)
    .set({ pinHash: "", claimedAt: null })
    .where(eq(v2IdentityUsers.id, studentId));
}

/**
 * Correct a student's real given name. Authz'd (owner-scoped, else a no-op).
 * journal-then-flip: 'rename' event FIRST, then the flip. If the student is still
 * provisional (unclaimed), the placeholder displayName is kept in sync with the
 * given name; a CLAIMED student's chosen nickname is never overwritten.
 */
export async function renameStudentGiven(
  db: Db,
  studentId: string,
  teacherId: string,
  givenName: string,
): Promise<void> {
  const owned = await ownedStudent(db, studentId, teacherId);
  if (!owned) return;
  const trimmed = givenName.trim();
  if (trimmed === "") return;

  await db.insert(v2RosterEvents).values({
    classId: owned.classId,
    kind: "rename",
    actorId: teacherId,
    payload: { studentId, givenName: trimmed },
  });
  const patch =
    owned.claimedAt == null ? { givenName: trimmed, displayName: trimmed } : { givenName: trimmed };
  await db.update(v2IdentityUsers).set(patch).where(eq(v2IdentityUsers.id, studentId));
}

/**
 * Remove a student from the roster — a hard delete of the row (roster rows are the
 * one place a mistaken entry should truly vanish; the journal preserves the audit
 * trail). Authz'd (owner-scoped, else a no-op). journal-then-flip: 'remove' event
 * FIRST, then the delete.
 */
export async function removeStudent(db: Db, studentId: string, teacherId: string): Promise<void> {
  const owned = await ownedStudent(db, studentId, teacherId);
  if (!owned) return;

  await db.insert(v2RosterEvents).values({
    classId: owned.classId,
    kind: "remove",
    actorId: teacherId,
    payload: { studentId },
  });
  await db.delete(v2IdentityUsers).where(eq(v2IdentityUsers.id, studentId));
}
