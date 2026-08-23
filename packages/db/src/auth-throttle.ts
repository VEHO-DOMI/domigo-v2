/**
 * K2a · THE SIGN-IN BRAKE — guessing a PIN stops being worth the effort.
 *
 * Until this file, nothing in DomiGo slowed a guesser down: not `/admin/signin`,
 * not the children's sign-in, and not the `currentPin` check under Einstellungen,
 * which will happily answer "right / wrong" as fast as bcrypt can run. Six digits
 * are 10^6 tries; unthrottled, that is an afternoon.
 *
 * ONE TABLE FOR ALL THREE SURFACES. The shape is identical everywhere — a counter
 * per identity per rolling window — and three separate tables would be three
 * chances to forget one. The `key` names both the surface and the identity, always
 * lower-cased by its builder below, because a brake a different capitalisation
 * walks around is not a brake.
 *
 * ONE STATEMENT, NOT THREE. Neon HTTP has no multi-statement transactions, so
 * read → decide → write would let two parallel attempts each act on a stale count.
 * Instead a single upsert turns the window and the counter together: if the stored
 * window is older than the policy, the row resets to 1 and starts a new window;
 * otherwise it increments in place. The RETURNED count is the decision.
 *
 * FAIL-OPEN, DELIBERATELY AND ABSOLUTELY. Every failure here — a missing table in
 * the window before migration 0016 is applied by hand, a timeout, anything — allows
 * the attempt. A brake that jams shut locks a classroom out of its own lesson, and
 * that is a far worse failure than a guesser getting a few more tries. This is the
 * one module in the lane whose catch block swallows everything on purpose.
 *
 * THE POLICY IS COUNTED IN FAILURES, NOT ATTEMPTS: a successful sign-in clears the
 * key (see clearThrottle), so a child who mistypes twice and then gets it right
 * starts tomorrow from zero.
 */
import { eq, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2AuthThrottle } from "./schema.ts";

export interface ThrottlePolicy {
  /** How many failures a window tolerates. The NEXT one is refused. */
  limit: number;
  windowMinutes: number;
}

/**
 * Sign-in and the PIN oracle: eight failures inside ten minutes are fine, the ninth
 * is refused (Koki's ruling, 2026-08-23). Eight is generous for a child typing six
 * digits, and a teacher can always reset a forgotten student PIN from the roster —
 * so the brake never leaves anyone without a way back into the lesson.
 */
export const SIGNIN_POLICY: ThrottlePolicy = { limit: 8, windowMinutes: 10 };

/**
 * Recovery mails are a different risk: not guessing, but using our mailer to pester
 * a colleague's inbox. Three per name per hour.
 */
export const RESET_REQUEST_POLICY: ThrottlePolicy = { limit: 3, windowMinutes: 60 };

/** Lower-cased, exactly like the sign-in lookups these keys shadow. */
export function teacherThrottleKey(nickname: string): string {
  return `teacher:${nickname.trim().toLowerCase()}`;
}

export function studentThrottleKey(classCode: string, nickname: string): string {
  return `student:${classCode.trim().toLowerCase()}:${nickname.trim().toLowerCase()}`;
}

export function resetThrottleKey(nickname: string): string {
  return `reset:${nickname.trim().toLowerCase()}`;
}

/**
 * Count this attempt and say whether it may proceed. Call BEFORE the expensive and
 * revealing part (bcrypt, the mail) — the point is to refuse without doing work.
 *
 * @returns true = allowed. Any failure returns true; see the header.
 */
export async function bumpAndCheck(db: Db, key: string, policy: ThrottlePolicy): Promise<boolean> {
  try {
    const rows = await db
      .insert(v2AuthThrottle)
      .values({ key, windowStart: sql`now()`, count: 1 })
      .onConflictDoUpdate({
        target: v2AuthThrottle.key,
        set: {
          // Window expired ⇒ this attempt is the first of a new one; otherwise add to it.
          count: sql`case when ${v2AuthThrottle.windowStart} < now() - make_interval(mins => ${policy.windowMinutes}::int) then 1 else ${v2AuthThrottle.count} + 1 end`,
          windowStart: sql`case when ${v2AuthThrottle.windowStart} < now() - make_interval(mins => ${policy.windowMinutes}::int) then now() else ${v2AuthThrottle.windowStart} end`,
        },
      })
      .returning({ count: v2AuthThrottle.count });
    const count = rows[0]?.count;
    if (typeof count !== "number") return true; // nothing came back — do not invent a refusal
    return count <= policy.limit;
  } catch (err) {
    console.error(
      "[auth-throttle] brake unavailable — allowing the attempt:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
    return true;
  }
}

/** Success wipes the slate. Failures to wipe it are logged, never surfaced. */
export async function clearThrottle(db: Db, key: string): Promise<void> {
  try {
    await db.delete(v2AuthThrottle).where(eq(v2AuthThrottle.key, key));
  } catch (err) {
    console.error(
      "[auth-throttle] could not clear the counter:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
  }
}
