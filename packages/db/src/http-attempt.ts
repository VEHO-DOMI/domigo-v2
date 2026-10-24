/** cgo-154: completed ordinary exercises use one atomic HTTP statement.
 * The database function writes booked_at last; failures roll back the whole
 * call. Duels/live keep their existing transaction and bonus settlement. */
import { sql } from "drizzle-orm";
import type { Tier } from "@domigo/engine";
import type { Db } from "./index.ts";
import type { RecordAttemptInput, RecordAttemptResult } from "./persist.ts";
import { BOX_INTERVAL_MS, LEITNER_MAX_BOX, isStoryReviewItemId } from "./review.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";
import { viennaDayBefore, viennaDayString } from "./streak.ts";

export interface HttpAttemptResult extends RecordAttemptResult {
  receipt: { tier: Tier; xpAwarded: number };
}

export async function recordHttpAttempt(
  db: Db, scope: ClassScope, a: RecordAttemptInput, now = new Date(),
): Promise<HttpAttemptResult> {
  assertWritableScope(scope, "recordHttpAttempt");
  if (!inScope(scope, a.classId)) throw new Error("attempt_scope_denied");
  if (a.mode.startsWith("duel:") || a.mode.startsWith("live:") || a.mode === "vocabulary-check") {
    throw new Error("attempt_booking_invalid");
  }
  const review = (a.kind === "vocab" || a.kind === "grammar")
    && (a.reviewContext !== "story" || (a.kind === "grammar" && isStoryReviewItemId(a.itemId)));
  // Explicit fields keep client context from setting the trusted booking marker.
  const payload = {
    user_id: a.userId, class_id: a.classId, item_id: a.itemId, kind: a.kind,
    unit_slug: a.unitSlug, grade: a.grade, mode: a.mode, tier: a.tier,
    xp_awarded: a.xpAwarded, latency_ms: a.latencyMs ?? null,
    hint_used: a.hintUsed ?? false, context: a.context ?? null,
    client_attempt_id: a.clientAttemptId,
  };
  const result = await db.execute(sql`select * from domigo_v2.book_http_attempt(
    ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify([...scope])}::jsonb)::uuid), ${JSON.stringify(payload)}::jsonb, ${review}::boolean,
    ${now.toISOString()}::timestamptz, ${viennaDayString(now)}::text,
    ${viennaDayBefore(now)}::text, ${JSON.stringify(BOX_INTERVAL_MS)}::jsonb, ${LEITNER_MAX_BOX}::integer
  )`);
  const row = result.rows[0] as { duplicate: boolean; box: number; due_at: string | Date; streak: number; tier: Tier; xp_awarded: number } | undefined;
  if (!row || !["correct", "partial", "close", "wrong"].includes(row.tier)
    || !Number.isInteger(row.xp_awarded) || row.xp_awarded < 0) throw new Error("attempt_receipt_unavailable");
  return { duplicate: row.duplicate, box: row.box, dueAt: new Date(row.due_at), streak: row.streak,
    receipt: { tier: row.tier, xpAwarded: row.xp_awarded } };
}
