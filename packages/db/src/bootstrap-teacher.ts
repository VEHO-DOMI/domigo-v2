/**
 * One-time v2-native teacher bootstrap (the lock-out recovery path, 2026-07-12).
 *
 * WHY THIS EXISTS: the platform's only teacher sign-in reads (v2 users first,
 * then the frozen v1 mirror), but v2 had no teacher row and the v1 PIN was lost
 * — with no in-app reset, the owner was locked out of his own admin surface,
 * and resetting via raw SQL proved hazardous (multiple look-alike Neon copies;
 * only the APP is guaranteed to be connected to the real production database).
 * So the app itself creates the account: right database by construction, right
 * hash scheme by construction (the caller hashes with the app's own hashPin),
 * and the new v2-native row OUTRANKS the old v1 one via the ordered dual-read.
 *
 * Safety model (defense in depth, enforced by the /bootstrap page + here):
 *   1. token gate — the page requires TEACHER_BOOTSTRAP_TOKEN (a Vercel env var
 *      only the owner can set); unset ⇒ the surface is dead.
 *   2. one-shot — refuses whenever ANY v2-native teacher already exists, so the
 *      page is inert forever after first use, even if the token leaks.
 *   3. v2-only writes — inserts into domigo_v2.users and re-points
 *      domigo_v2.assignments.created_by; NEVER touches public/v1.
 */
import { eq, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { assignments, v2IdentityUsers } from "./schema.ts";

/** True when any v2-native teacher exists — the one-shot guard. */
export async function hasV2Teacher(db: Db): Promise<boolean> {
  const rows = await db
    .select({ id: v2IdentityUsers.id })
    .from(v2IdentityUsers)
    .where(eq(v2IdentityUsers.role, "teacher"))
    .limit(1);
  return rows.length > 0;
}

/**
 * Create the v2-native teacher. `pinHash` is ALREADY hashed by the caller with
 * the app's own hashPin (bcrypt cost 12) — this module never sees a raw PIN.
 * `claimedAt` is set so the row reads as a fully active account (the
 * provisional/unclaimed semantics belong to roster students only).
 */
export async function createV2Teacher(
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
 * Re-point every existing assignment to the new teacher so the admin surface
 * shows them again (they were keyed to the old v1 teacher uuid; this is a
 * single-teacher platform, so "all assignments" is exactly "his assignments").
 * domigo_v2.assignments is v2-owned — this is a legal v2 write, not a v1 touch.
 */
export async function adoptAssignments(db: Db, newTeacherId: string): Promise<number> {
  const rows = await db
    .update(assignments)
    .set({ createdBy: newTeacherId })
    .where(sql`${assignments.createdBy} != ${newTeacherId}`)
    .returning({ id: assignments.id });
  return rows.length;
}
