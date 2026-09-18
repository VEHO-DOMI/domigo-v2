/**
 * Attempt persistence — the one entry point the app calls. Encapsulates the
 * idempotent insert + Leitner upsert + XP bump so callers never touch drizzle.
 */
import { and, eq, sql } from "drizzle-orm";
import type { Tier } from "@domigo/engine";
import { practiceAttempts, reviewQueue, userProgress, writingSubmissions } from "./schema.ts";
import { updateReviewQueue, type ReviewRef } from "./review.ts";
import { computeNextStreak, viennaDayBefore, viennaDayString } from "./streak.ts";
import type { Db } from "./index.ts";

export interface RecordAttemptInput {
  userId: string;
  classId: string;
  itemId: string;
  kind: "vocab" | "grammar" | "listening" | "reading";
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
  /** The user's daily streak after this attempt (Vienna-day; see streak.ts). */
  streak: number;
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
  let streak = 0;
  if (!duplicate) {
    // Listening items can't be re-rendered in /review (they need their audio), so they
    // earn XP + streak but never enter the Leitner queue. vocab/grammar always queue.
    if (a.kind === "vocab" || a.kind === "grammar") {
      const ref: ReviewRef = { itemId: a.itemId, kind: a.kind, unitSlug: a.unitSlug, grade: a.grade };
      await updateReviewQueue(db, a.userId, ref, a.tier);
    }

    // Streak + XP in one upsert. The streak advances on the FIRST attempt of each
    // Vienna day regardless of correctness (a wrong answer still counts as showing
    // up); XP is added only when earned (wrong → 0, never subtracted — Law 3).
    const now = new Date();
    const prog = await db
      .select({ streak: userProgress.streak, lastSessionDate: userProgress.lastSessionDate })
      .from(userProgress)
      .where(eq(userProgress.userId, a.userId))
      .limit(1);
    const next = computeNextStreak({
      lastSessionDate: prog[0]?.lastSessionDate ?? null,
      currentStreak: prog[0]?.streak ?? 0,
      today: viennaDayString(now),
      yesterday: viennaDayBefore(now),
    });
    streak = next.newStreak;
    const isVocab = a.kind === "vocab";
    const vocabXp = isVocab ? a.xpAwarded : 0;
    const grammarXp = isVocab ? 0 : a.xpAwarded;
    await db
      .insert(userProgress)
      .values({
        userId: a.userId,
        xp: vocabXp,
        grammarXp,
        streak: next.newStreak,
        lastSessionDate: next.newLastSessionDate,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: {
          xp: sql`${userProgress.xp} + ${vocabXp}`,
          grammarXp: sql`${userProgress.grammarXp} + ${grammarXp}`,
          streak: next.newStreak,
          lastSessionDate: next.newLastSessionDate,
          updatedAt: now,
        },
      });
  } else {
    const prog = await db
      .select({ streak: userProgress.streak })
      .from(userProgress)
      .where(eq(userProgress.userId, a.userId))
      .limit(1);
    streak = prog[0]?.streak ?? 0;
  }

  const q = await db
    .select({ box: reviewQueue.box, dueAt: reviewQueue.dueAt })
    .from(reviewQueue)
    .where(and(eq(reviewQueue.userId, a.userId), eq(reviewQueue.itemId, a.itemId)))
    .limit(1);

  return { duplicate, box: q[0]?.box ?? 1, dueAt: q[0]?.dueAt ?? new Date(), streak };
}

export interface UserProgressRow {
  xp: number;
  grammarXp: number;
  streak: number;
  lastSessionDate: string | null;
}

/** Read a user's v2 progression (XP pool + daily streak). Null if no row exists yet. */
export async function getUserProgress(db: Db, userId: string): Promise<UserProgressRow | null> {
  const rows = await db
    .select({
      xp: userProgress.xp,
      grammarXp: userProgress.grammarXp,
      streak: userProgress.streak,
      lastSessionDate: userProgress.lastSessionDate,
    })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export interface RecordWritingInput {
  userId: string;
  classId: string;
  unitSlug: string;
  testId: string;
  promptId: string;
  text: string;
  wordCount: number;
}

/** Append-only capture of a mock-test writing submission (teacher-graded later, B2b). */
export async function recordWritingSubmission(db: Db, w: RecordWritingInput): Promise<void> {
  await db.insert(writingSubmissions).values({
    userId: w.userId,
    classId: w.classId,
    unitSlug: w.unitSlug,
    testId: w.testId,
    promptId: w.promptId,
    text: w.text,
    wordCount: w.wordCount,
  });
}

