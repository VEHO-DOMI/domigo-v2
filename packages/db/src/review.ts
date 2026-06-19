/**
 * Leitner 5-box spaced retrieval. The POLICY (nextBox / nextDueAt / intervals)
 * is pure and unit-testable without a DB; the DB functions (updateReviewQueue,
 * getDueRefs, getDueCounts) are the shared service that powers Smart Review AND
 * game encounters (10_game_layer Law 6).
 */
import { and, asc, eq, lte, sql } from "drizzle-orm";
import type { Tier } from "@domigo/engine";
import { reviewQueue } from "./schema.ts";
import type { Db } from "./index.ts";

export const LEITNER_MAX_BOX = 5;
const MIN = 60_000;
const DAY = 86_400_000;

/** Per-box spacing (box N → interval). box 1 ≈ same-session re-ask. */
export const BOX_INTERVAL_MS: Record<number, number> = {
  1: 10 * MIN,
  2: 1 * DAY,
  3: 3 * DAY,
  4: 7 * DAY,
  5: 21 * DAY,
};

/** correct → promote (cap 5); wrong → reset to 1 (re-queue, never XP loss); partial/close → hold. */
export function nextBox(box: number, tier: Tier): number {
  if (tier === "correct") return Math.min(box + 1, LEITNER_MAX_BOX);
  if (tier === "wrong") return 1;
  return Math.max(box, 1);
}

export function nextDueAt(box: number, now: Date = new Date()): Date {
  return new Date(now.getTime() + (BOX_INTERVAL_MS[box] ?? BOX_INTERVAL_MS[1]!));
}

export interface ReviewRef {
  itemId: string;
  kind: "vocab" | "grammar";
  unitSlug: string;
  grade: number;
}

/** Upsert one queue entry for (user,item) after a graded attempt — for EVERY attempt, any mode. */
export async function updateReviewQueue(
  db: Db,
  userId: string,
  ref: ReviewRef,
  tier: Tier,
  now: Date = new Date(),
): Promise<void> {
  const isLapse = tier === "wrong" ? 1 : 0;
  const seedBox = nextBox(1, tier);
  // Atomic box recompute on conflict; dueAt is set from the resulting box in a
  // follow-up update (neon-http has no interactive transactions — the sub-ms
  // window between the two statements is harmless for a study queue).
  const rows = await db
    .insert(reviewQueue)
    .values({
      userId,
      itemId: ref.itemId,
      kind: ref.kind,
      unitSlug: ref.unitSlug,
      grade: ref.grade,
      box: seedBox,
      dueAt: nextDueAt(seedBox, now),
      lastTier: tier,
      reps: 1,
      lapses: isLapse,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [reviewQueue.userId, reviewQueue.itemId],
      set: {
        box: sql`CASE
          WHEN ${tier} = 'correct' THEN LEAST(${reviewQueue.box} + 1, ${LEITNER_MAX_BOX})
          WHEN ${tier} = 'wrong'   THEN 1
          ELSE GREATEST(${reviewQueue.box}, 1) END`,
        lastTier: tier,
        reps: sql`${reviewQueue.reps} + 1`,
        lapses: sql`${reviewQueue.lapses} + ${isLapse}`,
        updatedAt: now,
      },
    })
    .returning({ id: reviewQueue.id, box: reviewQueue.box });
  const row = rows[0];
  if (row) {
    await db.update(reviewQueue).set({ dueAt: nextDueAt(row.box, now) }).where(eq(reviewQueue.id, row.id));
  }
}

export type DueScope =
  | { kind: "unit"; slug: string }
  | { kind: "grade"; grade: number }
  | { kind: "all" };

export interface DueRef {
  itemId: string;
  kind: "vocab" | "grammar";
  unitSlug: string;
  grade: number;
  box: number;
  dueAt: Date;
}

/** Due items for a user within a scope, soonest-due first. Returns refs, not items. */
export async function getDueRefs(
  db: Db,
  userId: string,
  scope: DueScope,
  limit = 20,
  now: Date = new Date(),
): Promise<DueRef[]> {
  const where = [eq(reviewQueue.userId, userId), lte(reviewQueue.dueAt, now)];
  if (scope.kind === "unit") where.push(eq(reviewQueue.unitSlug, scope.slug));
  if (scope.kind === "grade") where.push(eq(reviewQueue.grade, scope.grade));
  const rows = await db
    .select({
      itemId: reviewQueue.itemId,
      kind: reviewQueue.kind,
      unitSlug: reviewQueue.unitSlug,
      grade: reviewQueue.grade,
      box: reviewQueue.box,
      dueAt: reviewQueue.dueAt,
    })
    .from(reviewQueue)
    .where(and(...where))
    .orderBy(asc(reviewQueue.dueAt))
    .limit(Math.min(limit, 100));
  return rows as DueRef[];
}

export interface DueCounts {
  total: number;
  vocab: number;
  grammar: number;
  byGrade: Record<number, number>;
}

/** How many items are due now, bucketed by kind + grade. */
export async function getDueCounts(db: Db, userId: string, now: Date = new Date()): Promise<DueCounts> {
  const rows = await db
    .select({ kind: reviewQueue.kind, grade: reviewQueue.grade, n: sql<number>`count(*)::int` })
    .from(reviewQueue)
    .where(and(eq(reviewQueue.userId, userId), lte(reviewQueue.dueAt, now)))
    .groupBy(reviewQueue.kind, reviewQueue.grade);
  let vocab = 0;
  let grammar = 0;
  const byGrade: Record<number, number> = {};
  for (const r of rows) {
    const n = Number(r.n);
    if (r.kind === "vocab") vocab += n;
    else grammar += n;
    byGrade[r.grade] = (byGrade[r.grade] ?? 0) + n;
  }
  return { total: vocab + grammar, vocab, grammar, byGrade };
}
