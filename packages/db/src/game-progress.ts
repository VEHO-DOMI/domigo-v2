/**
 * Game completion derivation (Law 2): which game items a student has SOLVED.
 * Reads the authoritative practice_attempts ledger — NOT the cosmetic, wipeable
 * game_saves — so a reset save never loses progress. "Solved" = at least one
 * non-wrong (tier <> 'wrong') graded attempt for the item in the grade's game
 * mode. Powers the persistent hub Evidence Board (and the Phase-6 finale).
 */
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { practiceAttempts } from "./schema.ts";
import type { Db } from "./index.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

/** The attempt `mode` string for a grade's game surface (matches DetectiveGame's "game:g2"). */
export function gameModeFor(grade: number): string {
  return `game:g${grade}`;
}

/**
 * Distinct item ids the user has solved (tier <> 'wrong') in this grade's game
 * mode. The caller does set membership; empty set when there are no rows.
 */
export async function getSolvedGameItemIds(db: Db, userId: string, grade: number): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ itemId: practiceAttempts.itemId })
    .from(practiceAttempts)
    .where(
      and(
        eq(practiceAttempts.userId, userId),
        eq(practiceAttempts.grade, grade),
        eq(practiceAttempts.mode, gameModeFor(grade)),
        ne(practiceAttempts.tier, "wrong"),
      ),
    );
  return new Set(rows.map((r) => r.itemId));
}

export interface UnitMastery {
  unitSlug: string;
  attempts: number;
  /** Distinct items the cohort got right at least once. */
  itemsSolved: number;
  /** Share of attempts graded correct (0..1). */
  correctRate: number;
}

/**
 * Phase 7 — teacher mastery view. Rolls up a grade's game attempts into per-unit
 * numbers (attempts, distinct items solved, correct rate).
 *
 * dach-018 · it used to roll up the WHOLE COHORT, on the stated grounds that "the
 * teacher session is not class-scoped". It is now. What leaks here is statistics
 * rather than names, which is exactly why it would have been waved through: the
 * class wall applies to counts as much as to rows.
 */
export async function getUnitMastery(db: Db, classScope: ClassScope, grade: number): Promise<UnitMastery[]> {
  const rows = await db
    .select({
      unitSlug: practiceAttempts.unitSlug,
      attempts: sql<number>`count(*)::int`,
      itemsSolved: sql<number>`count(distinct ${practiceAttempts.itemId}) filter (where ${practiceAttempts.tier} <> 'wrong')::int`,
      correct: sql<number>`count(*) filter (where ${practiceAttempts.tier} = 'correct')::int`,
    })
    .from(practiceAttempts)
    .where(and(inArray(practiceAttempts.classId, [...classScope]), eq(practiceAttempts.grade, grade), eq(practiceAttempts.mode, gameModeFor(grade))))
    .groupBy(practiceAttempts.unitSlug);
  return rows
    .map((r) => ({ unitSlug: r.unitSlug, attempts: r.attempts, itemsSolved: r.itemsSolved, correctRate: r.attempts > 0 ? r.correct / r.attempts : 0 }))
    .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug));
}
