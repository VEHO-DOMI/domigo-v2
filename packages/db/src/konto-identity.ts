/**
 * dach-018 · THE LOCAL PERSON BEHIND A konto ACCOUNT.
 *
 * konto owns who someone is; DomiGo owns what they did. The bridge between the
 * two is `app_links`, which konto keeps: it maps an account to ONE DomiGo user
 * id per app (unique(account_id, app), SPEC §3). So a claim arrives carrying
 * `app_user_id` — this repo's own `users.id` — or carrying null, which means
 * konto has never seen a DomiGo user for this person and we are about to make
 * one.
 *
 * The lookup is the house dual-read (P-1a): the v2-native row first, the v1
 * mirror second, exactly as `pickIdentity` prescribes — so every account that
 * came out of the switch-over import still finds its old row and its old
 * progress, and nobody is created twice. The v2 half is wrapped the way
 * auth.ts wraps its own (`v2Safe`): an unapplied migration must degrade to v1,
 * never take sign-in down.
 *
 * This module never sees a raw PIN (same rule as roster-service.ts and
 * teacher-identity.ts) — and after the switch-over DomiGo verifies no PIN at
 * all; the column stays NOT NULL, so the caller stores a hash of something
 * nobody knows.
 */
import { and, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { pickIdentity } from "./identity.ts";
import { v2Classes, v2IdentityUsers } from "./schema.ts";
import { v1Users } from "./v1.ts";

export type KontoIdentity = {
  id: string;
  displayName: string;
  role: "student" | "teacher";
  classId: string | null;
  /** Which half of the dual-read answered — reported, never guessed. */
  quelle: "v2" | "v1";
};

async function v2Safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(
      "[konto-identity] v2 query failed — falling back to the v1 mirror:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
    return fallback;
  }
}

/**
 * The DomiGo user konto points at. v2 first, then the v1 mirror; null when the
 * id is known to neither, which is how a stale `app_links` row announces
 * itself.
 */
export async function findKontoIdentity(db: Db, appUserId: string): Promise<KontoIdentity | null> {
  const v2Rows = await v2Safe(
    () =>
      db
        .select({
          id: v2IdentityUsers.id,
          displayName: v2IdentityUsers.displayName,
          role: v2IdentityUsers.role,
          classId: v2IdentityUsers.classId,
        })
        .from(v2IdentityUsers)
        .where(eq(v2IdentityUsers.id, appUserId))
        .limit(1),
    [],
  );
  const v2Row = v2Rows[0] ?? null;
  if (v2Row) return { ...v2Row, role: v2Row.role === "teacher" ? "teacher" : "student", quelle: "v2" };

  const v1Rows = await db
    .select({ id: v1Users.id, displayName: v1Users.displayName, role: v1Users.role, classId: v1Users.classId })
    .from(v1Users)
    .where(eq(v1Users.id, appUserId))
    .limit(1);
  const v1Row = pickIdentity(null, v1Rows[0] ?? null);
  if (!v1Row) return null;
  return { ...v1Row, role: v1Row.role === "teacher" ? "teacher" : "student", quelle: "v1" };
}

/**
 * The child a class link produced in konto. `classId` is DomiGo's own class id,
 * which konto carries as `app_class_id`; without it there is no child to make
 * (the caller shows the access card instead).
 *
 * `claimedAt` is set: an account that exists in konto is not provisional here.
 * No given name is stored — real names live in konto and are shown on teacher
 * surfaces there (DATEN-7 I-6).
 */
export async function createKontoStudent(
  db: Db,
  input: { displayName: string; classId: string; pinHash: string },
): Promise<string> {
  const rows = await db
    .insert(v2IdentityUsers)
    .values({
      role: "student",
      displayName: input.displayName.trim(),
      givenName: null,
      classId: input.classId,
      pinHash: input.pinHash,
      claimedAt: new Date(),
    })
    .returning({ id: v2IdentityUsers.id });
  return rows[0]!.id;
}

/** The teacher behind a konto account. Name is the short code konto keeps (I-11). */
export async function createKontoTeacher(
  db: Db,
  input: { displayName: string; pinHash: string },
): Promise<string> {
  const rows = await db
    .insert(v2IdentityUsers)
    .values({
      role: "teacher",
      displayName: input.displayName.trim(),
      givenName: null,
      classId: null,
      pinHash: input.pinHash,
      claimedAt: new Date(),
    })
    .returning({ id: v2IdentityUsers.id });
  return rows[0]!.id;
}

/**
 * Follow a child who changed class in konto.
 *
 * Not in the brief, and built anyway, because without it the primary flow is
 * broken in a way nobody would see until a lesson: the teacher's roster reads
 * `users.classId` (roster-service.ts listRoster), while the session reads the
 * class out of the claim. Let those two drift and a child who moved class signs
 * in perfectly and is invisible on the register. One idempotent UPDATE at
 * sign-in, only when the two actually disagree, only for children, and only for
 * v2-native rows — the v1 mirror is read-only, always (v1.ts).
 */
export async function syncKontoStudentClass(db: Db, userId: string, classId: string): Promise<boolean> {
  const rows = await db
    .update(v2IdentityUsers)
    .set({ classId })
    .where(and(eq(v2IdentityUsers.id, userId), eq(v2IdentityUsers.role, "student")))
    .returning({ id: v2IdentityUsers.id });
  return rows.length > 0;
}

/** Does this class exist in DomiGo? The bridge konto believes in may be stale. */
export async function klasseExistiert(db: Db, classId: string): Promise<boolean> {
  const rows = await v2Safe(
    () => db.select({ id: v2Classes.id }).from(v2Classes).where(eq(v2Classes.id, classId)).limit(1),
    [],
  );
  return rows.length > 0;
}
