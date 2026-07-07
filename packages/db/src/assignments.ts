/**
 * M-1 · Mock-test / assignment scoring — PURE and DB-free so it unit-tests
 * without Neon (like streak.ts). This is the erase-the-teacher heart of the
 * M-wave: the Note a student sees on a Schularbeit rehearsal must be provably
 * exact, so every number here is computed, boundary-tested, and never rounded
 * before the Note is decided.
 *
 * The scoring pipeline the M-3 runner composes at submit time:
 *   attempts ──firstAttemptTiers──▶ per-item tiers
 *            ──scoreSection────────▶ a %/section (auto kinds)
 *   (writing % comes from the teacher rubric — a manual section %)
 *            ──combineSectionPercents──▶ weighted overall %
 *            ──noteForPercent──────────▶ Note 1..5
 *
 * K-5 POLICY (default, flagged for Koki's sign-off): a first-attempt tier is
 * worth correct = 1 · partial = 0.5 · close = 0.5 · wrong = 0. Change only
 * TIER_POINTS below and every downstream number follows.
 */
import type { Tier } from "@domigo/engine";

export type Note = 1 | 2 | 3 | 4 | 5;

/**
 * Notenschlüssel = the MINIMUM percent for each of Notes 1–4; Note 5 is the
 * implicit floor. Stored as jsonb ({ "1":90, … }); numeric keys serialize to
 * strings, so this shape round-trips cleanly.
 */
export interface NotenSchluessel {
  1: number;
  2: number;
  3: number;
  4: number;
}

/** The Austrian AHS default when an assignment sets no custom schedule. */
export const AHS_DEFAULT_NOTENSCHLUESSEL: NotenSchluessel = { 1: 90, 2: 80, 3: 65, 4: 50 };

/** K-5 tier→points policy. Unknown strings score 0 (a corrupt tier never inflates a grade). */
export const TIER_POINTS: Record<Tier, number> = {
  correct: 1,
  partial: 0.5,
  close: 0.5,
  wrong: 0,
};

export function tierPoints(tier: Tier): number {
  return TIER_POINTS[tier] ?? 0;
}

/** A recorded attempt, reduced to just what scoring needs. */
export interface ScorableAttempt {
  itemId: string;
  tier: Tier;
  createdAt: Date;
}

/**
 * The FIRST attempt's tier per item — a mock grade never rewards retrying (a
 * real Schularbeit doesn't). Deterministic: earliest createdAt wins; exact ties
 * keep the earliest-seen (stable). Returns itemId → tier.
 */
export function firstAttemptTiers(attempts: ScorableAttempt[]): Map<string, Tier> {
  const firstAt = new Map<string, number>();
  const tierOf = new Map<string, Tier>();
  for (const a of attempts) {
    const t = a.createdAt.getTime();
    const seen = firstAt.get(a.itemId);
    if (seen === undefined || t < seen) {
      firstAt.set(a.itemId, t);
      tierOf.set(a.itemId, a.tier);
    }
  }
  return tierOf;
}

export interface SectionScore {
  /** Σ tier points over the section's items. */
  points: number;
  /** items counted (the section's authored item count, not attempts). */
  itemCount: number;
  /** points / itemCount × 100, exact (never pre-rounded). 0 for an empty section. */
  pct: number;
}

/**
 * An auto-graded section's percent from its per-item tiers. `itemCount` defaults
 * to `tiers.length`; pass it explicitly when a student left items unanswered so
 * the blanks score 0 against the full section (the honest Schularbeit measure).
 */
export function scoreSection(tiers: Tier[], itemCount: number = tiers.length): SectionScore {
  const points = tiers.reduce((s, t) => s + tierPoints(t), 0);
  const pct = itemCount > 0 ? (points / itemCount) * 100 : 0;
  return { points, itemCount, pct };
}

/** One section's contribution to the overall grade: its weight and its percent. */
export interface WeightedSection {
  weightPct: number;
  pct: number;
}

/**
 * The weighted overall percent (exact). Divides by the ACTUAL sum of weights, so
 * it is correct for any weighting; a mock test's weights sum to 100 (endpoint-
 * enforced) but this never assumes it. Returns 0 when total weight is 0.
 */
export function combineSectionPercents(sections: WeightedSection[]): number {
  const totalWeight = sections.reduce((s, x) => s + x.weightPct, 0);
  if (totalWeight <= 0) return 0;
  const weighted = sections.reduce((s, x) => s + x.pct * x.weightPct, 0);
  return weighted / totalWeight;
}

/**
 * The Note for an EXACT percent (1..5). Cutoffs are inclusive minimums:
 * pct ≥ ns[1] ⇒ 1, … , pct ≥ ns[4] ⇒ 4, else 5. Call with the exact percent —
 * never a value already rounded for display, or a 89.6 → 90 rounding could steal
 * a Note.
 */
export function noteForPercent(pct: number, ns: NotenSchluessel = AHS_DEFAULT_NOTENSCHLUESSEL): Note {
  if (pct >= ns[1]) return 1;
  if (pct >= ns[2]) return 2;
  if (pct >= ns[3]) return 3;
  if (pct >= ns[4]) return 4;
  return 5;
}

/** A well-formed schedule is strictly descending and within [0,100]. */
export function isValidNotenschluessel(ns: NotenSchluessel): boolean {
  const { 1: a, 2: b, 3: c, 4: d } = ns;
  return (
    [a, b, c, d].every((n) => Number.isFinite(n) && n >= 0 && n <= 100) &&
    a > b && b > c && c > d
  );
}

export interface AssignmentGrade {
  /** exact weighted overall percent */
  pct: number;
  /** pct rounded to 2 dp — for DISPLAY / storage only, never for the Note */
  displayPct: number;
  note: Note;
}

/**
 * Grade a whole mock test from its already-percented sections. The Note is
 * computed from the EXACT percent; displayPct is the roundable companion the
 * runner stores in `assignment_sessions.score_pct`.
 */
export function gradeMockTest(
  sections: WeightedSection[],
  ns: NotenSchluessel = AHS_DEFAULT_NOTENSCHLUESSEL,
): AssignmentGrade {
  const pct = combineSectionPercents(sections);
  return { pct, displayPct: Math.round(pct * 100) / 100, note: noteForPercent(pct, ns) };
}

/** Mock-test section weights must sum to exactly 100. */
export function sectionWeightsValid(weights: number[]): boolean {
  return weights.reduce((s, w) => s + w, 0) === 100;
}
