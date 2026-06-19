/**
 * Attempt persistence — the one entry point the app calls. Encapsulates the
 * idempotent insert + Leitner upsert + XP bump so callers never touch drizzle.
 */
import { and, eq, sql } from "drizzle-orm";
import type { Tier } from "@domigo/engine";
import { practiceAttempts, reviewQueue, userProgress } from "./schema.ts";
import { updateReviewQueue, type ReviewRef } from "./review.ts";
import type { Db } from "./index.ts";

export interface RecordAttemptInput {
  userId: string;
  classId: string;
  itemId: string;
  kind: "vocab" | "grammar";
  unitSlug: string;
  grade: number;
  mode: string;
  tier: Tier;
  xpAwarded: number;
  latencyMs?: number | null;
  hintUsed?: boolean;
  context?: unknown;
  clientAttemptId: string;
}

export interface RecordAttemptResult {
  duplicate: boolean;
  box: number;
  dueAt: Date;
}

/**
 * Idempotent on `(userId, clientAttemptId)`. Side effects (queue upsert, XP bump)
 * are gated on the FIRST insert, so a replay can't double-count.
 */
export async function recordAttempt(db: Db, a: RecordAttemptInput): Promise<RecordAttemptResult> {
  const inserted = await db
    .insert(practiceAttempts)
    .values({
      userId: a.userId,
      classId: a.classId,
      itemId: a.itemId,
      kind: a.kind,
      unitSlug: a.unitSlug,
      grade: a.grade,
      mode: a.mode,
      tier: a.tier,
      correct: a.tier === "correct",
      xpAwarded: a.xpAwarded,
      latencyMs: a.latencyMs ?? null,
      hintUsed: a.hintUsed ?? false,
      context: a.context ?? null,
      clientAttemptId: a.clientAttemptId,
    })
    .onConflictDoNothing({ target: [practiceAttempts.userId, practiceAttempts.clientAttemptId] })
    .returning({ id: practiceAttempts.id });

  const duplicate = inserted.length === 0;
  if (!duplicate) {
    const ref: ReviewRef = { itemId: a.itemId, kind: a.kind, unitSlug: a.unitSlug, grade: a.grade };
    await updateReviewQueue(db, a.userId, ref, a.tier);
    if (a.xpAwarded > 0) {
      const isVocab = a.kind === "vocab";
      await db
        .insert(userProgress)
        .values({ userId: a.userId, xp: isVocab ? a.xpAwarded : 0, grammarXp: isVocab ? 0 : a.xpAwarded })
        .onConflictDoUpdate({
          target: userProgress.userId,
          set: isVocab
            ? { xp: sql`${userProgress.xp} + ${a.xpAwarded}`, updatedAt: new Date() }
            : { grammarXp: sql`${userProgress.grammarXp} + ${a.xpAwarded}`, updatedAt: new Date() },
        });
    }
  }

  const q = await db
    .select({ box: reviewQueue.box, dueAt: reviewQueue.dueAt })
    .from(reviewQueue)
    .where(and(eq(reviewQueue.userId, a.userId), eq(reviewQueue.itemId, a.itemId)))
    .limit(1);

  return { duplicate, box: q[0]?.box ?? 1, dueAt: q[0]?.dueAt ?? new Date() };
}
