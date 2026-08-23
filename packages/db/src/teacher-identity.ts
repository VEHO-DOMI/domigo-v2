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
 * (no partial state), so unlike the roster mutations it needs no journal-then-flip.
 * This primitive stays journal-FREE on purpose: since K2a the teacher journal exists
 * (teacher-events.ts), but it is written by the ROUTES, which know whose hand pulled
 * the lever — a fact this function is not told and must not guess. Writes land ONLY
 * in `domigo_v2`; v1's `public` is never touched.
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
  /**
   * K2a · her recovery address. OMIT the key to leave whatever is stored untouched;
   * pass null to clear it. The distinction is the whole point: most callers (every
   * PIN change) know nothing about the address and must not be able to erase it by
   * simply not mentioning it. See the conditional spread below.
   */
  email?: string | null;
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
      // Conditional on BOTH sides of the upsert, and for the same hard reason: until
      // migration 0016 is applied by hand, naming this column at all makes the whole
      // statement fail. A PIN change knows nothing about addresses and must keep
      // working through that window, so it never mentions the column.
      ...("email" in input ? { email: input.email ?? null } : {}),
      claimedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: v2IdentityUsers.id,
      // `email` joins the SET clause only when the caller actually passed the key.
      // Spreading `{ email: input.email }` unconditionally would write NULL on every
      // PIN change — "undefined overwrites" is the exact bug this shape prevents, and
      // it is also what keeps the statement legal before 0016 is applied (see above).
      // `displayName` is absent for the older sibling reason: it is her sign-in handle,
      // and a rename hidden inside a PIN change would lock her out (the K1b trap).
      set: { pinHash: input.pinHash, ...("email" in input ? { email: input.email ?? null } : {}) },
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

/**
 * K2a · Her recovery address, read on its own.
 *
 * WHY THIS IS NOT PART OF THE AUTH PROJECTION (auth.ts says the same thing from the
 * other end): a sign-in read that names `users.email` fails outright until migration
 * 0016 is applied by hand, and the dual-read would then quietly serve the v1 mirror —
 * meaning a teacher who ever changed her PIN would be authenticated against her old
 * hash. So the column is read HERE, by a query nothing security-critical depends on,
 * and every failure returns null: "no address stored" is both the honest answer and
 * the safe one, because it sends the surface down the human fallback path.
 *
 * Scoped to `role='teacher'`: no student row has, or will ever have, an address.
 */
export async function getTeacherEmail(db: Db, id: string): Promise<string | null> {
  try {
    const rows = await db
      .select({ email: v2IdentityUsers.email })
      .from(v2IdentityUsers)
      .where(and(eq(v2IdentityUsers.id, id), eq(v2IdentityUsers.role, "teacher")))
      .limit(1);
    return rows[0]?.email ?? null;
  } catch (err) {
    console.error(
      "[teacher-identity] could not read the recovery address (migration 0016 not applied?):",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
    return null;
  }
}
