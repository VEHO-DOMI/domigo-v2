/**
 * Game completion derivation (Law 2): which game items a student has SOLVED.
 * Reads the authoritative practice_attempts ledger — NOT the cosmetic, wipeable
 * game_saves — so a reset save never loses progress. "Solved" = at least one
 * non-wrong (tier <> 'wrong') graded attempt for the item in the grade's game
 * mode. Powers the persistent hub Evidence Board (and the Phase-6 finale).
 */
import { and, eq, ne } from "drizzle-orm";
import { practiceAttempts } from "./schema.ts";
import type { Db } from "./index.ts";

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
