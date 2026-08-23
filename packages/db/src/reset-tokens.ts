/**
 * K2a · RECOVERY TOKENS — the one-shot link behind "PIN vergessen".
 *
 * THE TABLE STORES A HASH, NEVER A TOKEN. Everything else here follows from that
 * one decision. A stolen copy of `teacher_reset_tokens` is a list of hashes, not a
 * list of live links; the plaintext exists exactly once, in the mail, and cannot be
 * recovered from the database by anyone — us included. (That is also why a lane
 * proving this flow cannot "read the link out of the row": there is no link in the
 * row. The dev-only console transport in apps/web/lib/mailer.ts exists for exactly
 * that reason.)
 *
 * DOMAIN SEPARATION. The hashed string is "domigo-reset:<token>", not the token, so
 * the same random bytes hashed for some other purpose can never be made to match an
 * entry here.
 *
 * NO TOKEN IS EVER COMPARED. Lookup happens BY the hash — a primary-key probe — so
 * no code path holds two token strings next to each other and the comparison is
 * constant-time by construction rather than by discipline.
 *
 * CONSUMPTION IS ONE GUARDED STATEMENT. Neon HTTP has no multi-statement
 * transactions, so read-then-write would be precisely the double-click race this
 * table exists to prevent. Instead a single UPDATE carries all three conditions
 * (right hash · not yet consumed · not expired) and THE NUMBER OF RETURNED ROWS is
 * the verdict — never a driver rowCount (house rule, cf. teacher-claim.ts).
 *
 * TIME COMES FROM THE DATABASE. `now()` on both sides, never a JS clock: the token
 * is minted by one serverless instance and spent by another, and their clocks are
 * not the same clock.
 */
import { randomBytes, createHash } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2TeacherResetTokens } from "./schema.ts";
import { isMissingDbObject } from "./teacher-events.ts";

/** How long a recovery link lives. Long enough to walk to a laptop, short enough to matter. */
export const RESET_TOKEN_TTL_MINUTES = 60;

/** The domain-separated hash that is stored. Never call this on anything but a fresh token. */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(`domigo-reset:${token}`, "utf8").digest("hex");
}

/** A fresh token: 32 random bytes, URL-safe, minted here so no caller can weaken it. */
export function newResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export type MintResult =
  | { ok: true; token: string }
  | { ok: false; reason: "no_table" };

export type PeekResult = { ok: true } | { ok: false; reason: "invalid" | "no_table" };

export type ConsumeResult =
  | { ok: true; teacherId: string }
  | { ok: false; reason: "invalid" | "no_table" };

/**
 * Mint a link for this teacher and store ONLY its hash. The returned plaintext is
 * the caller's single copy — it belongs in the mail and nowhere else, never in a
 * log, a screenshot or a report.
 */
export async function mintResetToken(
  db: Db,
  teacherId: string,
  ttlMinutes: number = RESET_TOKEN_TTL_MINUTES,
): Promise<MintResult> {
  const token = newResetToken();
  try {
    await db.insert(v2TeacherResetTokens).values({
      tokenHash: hashResetToken(token),
      teacherId,
      expiresAt: sql`now() + make_interval(mins => ${ttlMinutes}::int)`,
    });
    return { ok: true, token };
  } catch (err) {
    if (isMissingDbObject(err)) return { ok: false, reason: "no_table" };
    throw err;
  }
}

/**
 * Spend a link. One statement decides the race: the second click on the same link
 * matches zero rows, and so does an expired one — both are "invalid", deliberately
 * indistinguishable to the visitor.
 */
export async function consumeResetToken(db: Db, token: string): Promise<ConsumeResult> {
  try {
    const rows = await db
      .update(v2TeacherResetTokens)
      .set({ consumedAt: sql`now()` })
      .where(
        and(
          eq(v2TeacherResetTokens.tokenHash, hashResetToken(token)),
          isNull(v2TeacherResetTokens.consumedAt),
          sql`${v2TeacherResetTokens.expiresAt} > now()`,
        ),
      )
      .returning({ teacherId: v2TeacherResetTokens.teacherId });
    // The ROW COUNT is the verdict — one winner, or nobody.
    const won = rows[0];
    return won ? { ok: true, teacherId: won.teacherId } : { ok: false, reason: "invalid" };
  } catch (err) {
    if (isMissingDbObject(err)) return { ok: false, reason: "no_table" };
    throw err;
  }
}

/**
 * Is this link still worth showing a form for? A READ-ONLY probe with exactly the
 * conditions `consumeResetToken` will apply, so a dead link earns its neutral error
 * page immediately instead of after the visitor has typed a new PIN twice.
 *
 * It is a courtesy, never a decision: the row could still be spent by a parallel
 * click a millisecond later. The authority is the guarded UPDATE, always.
 */
export async function peekResetToken(db: Db, token: string): Promise<PeekResult> {
  try {
    const rows = await db
      .select({ teacherId: v2TeacherResetTokens.teacherId })
      .from(v2TeacherResetTokens)
      .where(
        and(
          eq(v2TeacherResetTokens.tokenHash, hashResetToken(token)),
          isNull(v2TeacherResetTokens.consumedAt),
          sql`${v2TeacherResetTokens.expiresAt} > now()`,
        ),
      )
      .limit(1);
    return rows.length > 0 ? { ok: true } : { ok: false, reason: "invalid" };
  } catch (err) {
    if (isMissingDbObject(err)) return { ok: false, reason: "no_table" };
    throw err;
  }
}
