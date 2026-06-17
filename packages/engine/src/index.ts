/**
 * @domigo/engine — pure grading + progression core.
 *
 * HARD RULE: no React/Next/DOM imports, ever. A future Story/RPG canvas route
 * must be able to import this engine unchanged.
 *
 * P3 ports v1's graders (Levenshtein budgets 0.15 grammar / 0.20 vocab,
 * canonicalization, partial-match fallback) and the XP/combo/streak/level
 * formulas with parity fixtures. For now this module pins the 4-tier
 * grading contract from docs/handover/07_task_formats.md.
 */

/** Grading outcome tiers (07_task_formats.md → "Engine requirements"). */
export type Tier = "correct" | "partial" | "close" | "wrong";

/** XP weight per tier: full / half / half / none. */
export const XP_WEIGHT: Record<Tier, number> = {
  correct: 1,
  partial: 0.5,
  close: 0.5,
  wrong: 0,
};

/** XP awarded for a base item value at a given tier (rounded, never negative). */
export function xpForTier(baseXp: number, tier: Tier): number {
  if (baseXp <= 0) return 0;
  return Math.round(baseXp * XP_WEIGHT[tier]);
}

/** Tiers that should reset a combo (close calls and misses break the chain). */
export function breaksCombo(tier: Tier): boolean {
  return tier === "close" || tier === "wrong";
}

// Per-format grader (canonicalize · Levenshtein-close · partial-match · all-or-nothing).
export * from "./grade.ts";
