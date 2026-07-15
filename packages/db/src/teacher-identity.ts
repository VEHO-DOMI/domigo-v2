/**
 * Teacher self-service identity (WS-AUTH Phase A).
 *
 * WHY THIS EXISTS: the platform's only teacher-PIN reset was a manual
 * `UPDATE public.users SET pin_hash=…` against the production DB — a workaround,
 * not a system. This module lets a signed-in teacher change their own PIN
 * natively. It works by PROMOTING the teacher from the read-only v1 mirror
 * (`public.users`) to the writable v2 identity (`domigo_v2.users`): the ordered
 * dual-read (auth.ts) then prefers the v2 row, so the new PIN takes over while the
 * v1 row is left untouched (deleting the v2 row cleanly reverts to v1).
 *
 * The promotion REUSES the teacher's existing id (their live session id). Every
 * teacher-owned row keys on that id — `classes.teacherId`, `assignments.created_by`
 * — so reusing it keeps them all attached with ZERO adoption. (The `/bootstrap`
 * break-glass minted a NEW id and had to re-point assignments; it still missed
 * `classes.teacherId`. Reusing the id avoids that whole class of bug.)
 *
 * `pinHash` is ALREADY hashed by the caller with the app's own hashPin (bcrypt
 * cost 12) — @domigo/db never sees a raw PIN (same contract as roster-service.ts
 * and bootstrap-teacher.ts). A single INSERT … ON CONFLICT DO UPDATE is atomic
 * (no partial state), so unlike the roster mutations it needs no journal-then-flip;
 * the teacher-audit journal is a Phase-C item (roster_events is class-scoped and a
 * teacher has no class). Writes land ONLY in `domigo_v2`; v1's `public` is never
 * touched.
 */
import { and, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2IdentityUsers } from "./schema.ts";

export interface TeacherIdentityInput {
  /** The teacher's live session id — REUSED as the v2 row id so owned rows stay attached. */
  id: string;
  /** The teacher's nickname (auth handle) — set on first promotion, never overwritten. */
  displayName: string;
  /** Already hashed by the caller (bcrypt cost 12) — this module never sees a raw PIN. */
  pinHash: string;
}

/**
 * Promote-or-update the teacher's writable v2 identity. The first call INSERTs the
 * row (id reused, displayName set, `claimedAt=now` = a fully active account); a
 * later call with the same id UPDATEs ONLY the pinHash (a PIN change never renames
 * the teacher). This is the single write behind both "promote" and "change PIN".
 */
export async function upsertTeacherIdentity(db: Db, input: TeacherIdentityInput): Promise<void> {
  await db
    .insert(v2IdentityUsers)
    .values({
      id: input.id,
      role: "teacher",
      displayName: input.displayName.trim(),
      givenName: null,
      classId: null,
      pinHash: input.pinHash,
      claimedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: v2IdentityUsers.id,
      set: { pinHash: input.pinHash },
    });
}

/**
 * Remove a teacher's writable v2 identity by id — the inverse of a promotion.
 * With the v2 row gone the ordered dual-read falls back to the v1 mirror, so this
 * is the clean "undo a promotion" path (and the primitive a Phase-C admin
 * remove-teacher will build on). Scoped to `role='teacher'` so it can never touch a
 * student row. Returns whether a row was removed. Never touches `public.*`.
 */
export async function deleteTeacherIdentity(db: Db, id: string): Promise<boolean> {
  const rows = await db
    .delete(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.id, id), eq(v2IdentityUsers.role, "teacher")))
    .returning({ id: v2IdentityUsers.id });
  return rows.length > 0;
}
