/**
 * K1a · THE TEACHER'S CLASS VIEW — the readers the classId columns have been
 * waiting for since June.
 *
 * `practice_attempts.class_id` and `study_path_progress.class_id` are written on
 * every write path and were read by none; schema.ts says so in as many words
 * ("classId denormalized (like practice_attempts) for a future teacher view").
 * These are that view.
 *
 * TWO deliberate differences from the /admin dashboard's getUnitMastery
 * (game-progress.ts), which is the only mastery surface that existed before:
 *   1. CLASS-scoped, not grade-wide — a teacher asks about HER class, and the
 *      grade-wide number silently averages in every other class in the school.
 *   2. ALL modes, not just `game:g<n>` — the dashboard measures the story game
 *      alone, which is its documented weakness. A child who only ever practises
 *      is invisible there and must not be invisible here.
 *
 * Everything below reads domigo_v2 tables only; `public` (v1) is never touched,
 * so no person column of the legacy register can leak through this file.
 */
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { practiceAttempts, reviewQueue, studyPathProgress, userProgress } from "./schema.ts";
import type { Db } from "./index.ts";

/** One student's attempt-ledger roll-up. `lastActiveAt` null ⇒ never practised. */
export interface StudentProgressRow {
  userId: string;
  attempts: number;
  /** Distinct items answered better than `wrong` at least once (correct|partial|close). */
  itemsSolved: number;
  /** Share of attempts graded fully `correct` (0..1). */
  correctRate: number;
  lastActiveAt: Date | null;
}

/**
 * Per-student attempt numbers for ONE class. Grouped in SQL, ratio computed in JS
 * with a zero-guard (house shape, cf. getUnitMastery). A student with no rows at
 * all simply does not appear — the caller pairs this with the roster and renders
 * the missing ones as "—", which is the honest reading of "no attempt yet".
 */
export async function listStudentProgress(db: Db, classId: string): Promise<StudentProgressRow[]> {
  const rows = await db
    .select({
      userId: practiceAttempts.userId,
      attempts: sql<number>`count(*)::int`,
      itemsSolved: sql<number>`count(distinct ${practiceAttempts.itemId}) filter (where ${practiceAttempts.tier} <> 'wrong')::int`,
      correct: sql<number>`count(*) filter (where ${practiceAttempts.tier} = 'correct')::int`,
      lastActiveAt: sql<Date | null>`max(${practiceAttempts.createdAt})`,
    })
    .from(practiceAttempts)
    .where(eq(practiceAttempts.classId, classId))
    .groupBy(practiceAttempts.userId);
  return rows.map((r) => ({
    userId: r.userId,
    attempts: Number(r.attempts),
    itemsSolved: Number(r.itemsSolved),
    correctRate: Number(r.attempts) > 0 ? Number(r.correct) / Number(r.attempts) : 0,
    lastActiveAt: r.lastActiveAt === null ? null : new Date(r.lastActiveAt),
  }));
}

/** One student's study-path roll-up (B1 nodes). */
export interface StudentPathSummary {
  completedNodes: number;
  totalStars: number;
}

/**
 * The class_id sister of studypath.ts:getPathSummary — same aggregate, grouped
 * per STUDENT instead of per unit, so one query covers the whole class. Returns a
 * Map keyed by userId (the shape its per-user sibling already uses).
 */
export async function listStudentPathSummary(db: Db, classId: string): Promise<Map<string, StudentPathSummary>> {
  const rows = await db
    .select({
      userId: studyPathProgress.userId,
      completed: sql<number>`count(*)::int`,
      stars: sql<number>`coalesce(sum(${studyPathProgress.stars}),0)::int`,
    })
    .from(studyPathProgress)
    .where(eq(studyPathProgress.classId, classId))
    .groupBy(studyPathProgress.userId);
  const m = new Map<string, StudentPathSummary>();
  for (const r of rows) m.set(r.userId, { completedNodes: Number(r.completed), totalStars: Number(r.stars) });
  return m;
}

/** XP pool + streak + how many review cards are due right now. */
export interface StudentMeta {
  xp: number;
  grammarXp: number;
  streak: number;
  /** Leitner cards whose due_at has passed. */
  dueCount: number;
}

/**
 * The two tables that carry NO class_id — `user_progress` and `review_queue` are
 * keyed by user alone. The class scope therefore arrives as the roster's id list,
 * which is itself owner-authorized upstream (listRoster runs behind the class's
 * WHERE clause), so this function never widens anyone's reach.
 *
 * An EMPTY list short-circuits before any query: `inArray` with no values renders
 * `IN ()`, which is a syntax error, and a class whose roster is still empty is an
 * ordinary state, not a failure.
 */
export async function listStudentMeta(db: Db, userIds: readonly string[]): Promise<Map<string, StudentMeta>> {
  const out = new Map<string, StudentMeta>();
  const ids = [...new Set(userIds.filter((id) => id))];
  if (ids.length === 0) return out;

  const progress = await db
    .select({
      userId: userProgress.userId,
      xp: userProgress.xp,
      grammarXp: userProgress.grammarXp,
      streak: userProgress.streak,
    })
    .from(userProgress)
    .where(inArray(userProgress.userId, ids));
  for (const r of progress) {
    out.set(r.userId, { xp: r.xp, grammarXp: r.grammarXp, streak: r.streak, dueCount: 0 });
  }

  const due = await db
    .select({ userId: reviewQueue.userId, due: sql<number>`count(*)::int` })
    .from(reviewQueue)
    .where(and(inArray(reviewQueue.userId, ids), sql`${reviewQueue.dueAt} <= now()`))
    .groupBy(reviewQueue.userId);
  for (const r of due) {
    const prev = out.get(r.userId) ?? { xp: 0, grammarXp: 0, streak: 0, dueCount: 0 };
    out.set(r.userId, { ...prev, dueCount: Number(r.due) });
  }
  return out;
}

/** The class aggregate for one unit — same columns getUnitMastery prints. */
export interface ClassUnitProgress {
  unitSlug: string;
  attempts: number;
  itemsSolved: number;
  correctRate: number;
}

/**
 * Per-unit roll-up for ONE class, across EVERY mode (practice, review, study
 * path, game). Deliberately without a `mode` filter — see the file header.
 */
export async function listClassUnitProgress(db: Db, classId: string): Promise<ClassUnitProgress[]> {
  const rows = await db
    .select({
      unitSlug: practiceAttempts.unitSlug,
      attempts: sql<number>`count(*)::int`,
      itemsSolved: sql<number>`count(distinct ${practiceAttempts.itemId}) filter (where ${practiceAttempts.tier} <> 'wrong')::int`,
      correct: sql<number>`count(*) filter (where ${practiceAttempts.tier} = 'correct')::int`,
    })
    .from(practiceAttempts)
    .where(eq(practiceAttempts.classId, classId))
    .groupBy(practiceAttempts.unitSlug);
  return rows
    .map((r) => ({
      unitSlug: r.unitSlug,
      attempts: Number(r.attempts),
      itemsSolved: Number(r.itemsSolved),
      correctRate: Number(r.attempts) > 0 ? Number(r.correct) / Number(r.attempts) : 0,
    }))
    .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug));
}

/** How often one named trap (trap-registry@1 id) was hit in this class. */
export interface ClassTrapCount {
  trapId: string;
  count: number;
}

/**
 * The class's most frequent named mistakes. The trap id is written into the
 * attempt's `context` jsonb by /api/attempts (D-2), so this reads what the
 * grading path already recorded rather than re-classifying anything.
 *
 * Defensive by construction: `context` may hold ANY json (the assignment path
 * writes `{sessionId}`, a future caller may write something else). In Postgres
 * `->>` on a non-object yields NULL, and the IS NOT NULL filter drops it — so a
 * foreign shape can never become a trap row.
 */
export async function listClassTraps(db: Db, classId: string, limit = 5): Promise<ClassTrapCount[]> {
  const trapId = sql<string>`${practiceAttempts.context}->>'trap'`;
  const rows = await db
    .select({ trapId, count: sql<number>`count(*)::int` })
    .from(practiceAttempts)
    .where(
      and(
        eq(practiceAttempts.classId, classId),
        eq(practiceAttempts.tier, "wrong"),
        sql`${practiceAttempts.context}->>'trap' is not null`,
      ),
    )
    .groupBy(trapId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
  return rows.map((r) => ({ trapId: r.trapId, count: Number(r.count) }));
}

/** What a teacher-facing surface needs to print for one trap. */
export interface TrapLabel {
  nameDe: string;
  icon: string | null;
  oneLinerDe: string | null;
  /** False when the id was not in the registry — the caller may say so. */
  known: boolean;
}

/**
 * Resolve a trap id against the registry, TOLERANTLY. An id the registry does not
 * know renders as its own raw text and never throws: the registry is content and
 * the ledger is history, so a trap renamed or retired tomorrow must not turn a
 * teacher's page into an error today.
 *
 * Takes a plain Map rather than the registry type on purpose — this package stays
 * free of a dependency on @domigo/content-schema, and the caller already builds
 * exactly this projection (app/layout.tsx does it for the student surfaces).
 */
export function trapLabel(
  known: ReadonlyMap<string, { nameDe: string; icon: string; oneLinerDe: string }>,
  id: string,
): TrapLabel {
  const hit = known.get(id);
  if (!hit) return { nameDe: id, icon: null, oneLinerDe: null, known: false };
  return { nameDe: hit.nameDe, icon: hit.icon, oneLinerDe: hit.oneLinerDe, known: true };
}
