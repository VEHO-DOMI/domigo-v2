/**
 * Quest clear-derivation. A zone's "cleared" state is DERIVED from the attempts
 * ledger (Law 2 — never a stored boolean), so this is a pure function over inputs
 * the SERVER computes from practice_attempts / review_queue / story progress.
 */
import type { Tier } from "@domigo/engine";
import type { Quest } from "@domigo/content-schema";

const TIER_RANK: Record<Tier, number> = { wrong: 0, close: 1, partial: 2, correct: 3 };

/** Does tier `t` meet the bar `min`? (correct > partial > close > wrong). */
export function tierAtLeast(t: Tier, min: Tier): boolean {
  return TIER_RANK[t] >= TIER_RANK[min];
}

/** Pure inputs the server derives from the ledger — no persisted "done" flag. */
export interface ClearState {
  /** Best tier achieved per encounter id (absent → never cleared). */
  encounterBestTier: Record<string, Tier | undefined>;
  /** Items still DUE in the quest's scope (for due-drained). */
  dueCountInScope: number;
  /** Whether the quest's story chapter was played end-to-end. */
  chapterCompleted: boolean;
}

/** Is the zone cleared? Derived from `state`; matches the quest's `clear` recipe. */
export function isZoneCleared(quest: Quest, state: ClearState): boolean {
  const c = quest.clear;
  if (c.kind === "encounters-cleared") {
    return c.encounterIds.every((id) => {
      const best = state.encounterBestTier[id];
      return best !== undefined && tierAtLeast(best, c.minTier);
    });
  }
  if (c.kind === "due-drained") return state.dueCountInScope <= 0;
  return state.chapterCompleted; // story-chapter
}
