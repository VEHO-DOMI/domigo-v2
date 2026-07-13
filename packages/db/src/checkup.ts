/**
 * C-1 · Checkup mode — the PURE spine (types, validation, /20 scoring), DB-free
 * so it unit-tests without Neon (like assignments.ts / assignment-session.ts).
 * The binding spec is docs/handover/21_checkup_presets.md (§3 section_config,
 * §4b display_config, §5 composition rules, §7 scoring, §8 recorded decisions).
 *
 * The invariant that names the feature: EVERY checkup is exactly /20.
 *
 * Split of responsibilities:
 *   - this file: jsonb shapes + their tolerant parsers, the Σ=20 draft gate,
 *     the per-item vocab-pool policy, and the pure /20 scorer.
 *   - apps/web/lib/checkup.ts: GRADE_STRUCTURES presets + composeCheckup
 *     (needs @domigo/content-loader, which the db package must not import).
 */
import type { VocabPool } from "@domigo/engine";
import { firstAttemptTiers, tierPoints, type ScorableAttempt } from "./assignments.ts";

// ── section_config (assignment_sections.section_config, migration 0008) ──────

/** The five paper-derived section kinds (doc 21 §2). `picture-mc` is DEFERRED
 *  in v1 (§8-② — real images preferred, no emojis; the +points fallback keeps
 *  /20 meanwhile), so validation rejects it until assets exist. */
export type CheckupKind = "words-phrases" | "translations" | "definitions" | "grammar" | "picture-mc";

export const CHECKUP_KINDS: readonly CheckupKind[] = [
  "words-phrases",
  "translations",
  "definitions",
  "grammar",
  "picture-mc",
];

/** Kinds a v1 checkup may actually contain (picture-mc pending §8-②). */
export const ACTIVE_CHECKUP_KINDS: readonly CheckupKind[] = [
  "words-phrases",
  "translations",
  "definitions",
  "grammar",
];

/** The invariant: Σ section points of a checkup — always. */
export const CHECKUP_TOTAL = 20;

export type CheckupMask = "first-letter" | null;
export type TranslationDirection = "mixed" | "deToEn" | "enToDe";

/** One section's jsonb config (doc 21 §3). Null on non-checkup sections. */
export interface CheckupSectionConfig {
  checkupKind: CheckupKind;
  /** integer ≥1; all of a checkup's sections sum to EXACTLY 20 (server-gated) */
  points: number;
  /** words-phrases default ON; definitions default OFF; never affects grading */
  mask?: CheckupMask;
  /** translations only; 'mixed' = half/half, De→En gets the odd one */
  direction?: TranslationDirection;
}

/** The DB `kind` a checkup section persists under (existing section machinery). */
export function checkupSectionKind(k: CheckupKind): "vocab" | "grammar" {
  return k === "grammar" ? "grammar" : "vocab";
}

/** Tolerant jsonb reader — never throws on a malformed row, returns null. */
export function parseCheckupSectionConfig(raw: unknown): CheckupSectionConfig | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.checkupKind !== "string" || !(CHECKUP_KINDS as readonly string[]).includes(o.checkupKind)) return null;
  if (typeof o.points !== "number" || !Number.isInteger(o.points) || o.points < 1) return null;
  const cfg: CheckupSectionConfig = { checkupKind: o.checkupKind as CheckupKind, points: o.points };
  if (o.mask === "first-letter") cfg.mask = "first-letter";
  if (o.direction === "mixed" || o.direction === "deToEn" || o.direction === "enToDe") {
    cfg.direction = o.direction;
  }
  return cfg;
}

// ── display_config (assignments.display_config, same migration) ──────────────

/** When the student sees verdicts/points (doc 21 §4b). 'immediate' = practice-
 *  like per-item verdicts; 'on-submit' = everything appears when the paper is
 *  handed in (checkup default); 'on-release' = nothing until the teacher
 *  releases results (v1: the submit screen shows only "Abgegeben ✓"). */
export type FeedbackMode = "immediate" | "on-submit" | "on-release";
export type ScoreVisibility = "on-submit" | "on-release";

export interface DisplayConfig {
  feedback: FeedbackMode;
  showScore?: ScoreVisibility;
}

/** The checkup default: verdicts + points appear when the paper is submitted. */
export const CHECKUP_DEFAULT_DISPLAY: DisplayConfig = { feedback: "on-submit", showScore: "on-submit" };

export function parseDisplayConfig(raw: unknown): DisplayConfig | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (o.feedback !== "immediate" && o.feedback !== "on-submit" && o.feedback !== "on-release") return null;
  const cfg: DisplayConfig = { feedback: o.feedback };
  if (o.showScore === "on-submit" || o.showScore === "on-release") cfg.showScore = o.showScore;
  return cfg;
}

// ── per-item vocab-pool policy ────────────────────────────────────────────────
// One brain holds: these only pick WHICH authored pool grades an item — the
// grading itself stays in @domigo/engine, identical to practice.

/**
 * Which translation direction the item at `index` (0-based, section order) gets.
 * 'mixed' splits half/half with De→En taking the odd one (doc 21 §3) — for 5
 * items: 3× deToEn then 2× enToDe. Deterministic in section order, so the
 * server render, the client grade, and the submit-time regrade always agree.
 */
export function translationPoolFor(index: number, count: number, direction: TranslationDirection): "deToEn" | "enToDe" {
  if (direction === "deToEn" || direction === "enToDe") return direction;
  return index < Math.ceil(count / 2) ? "deToEn" : "enToDe";
}

/** The engine pool a checkup section's item grades against. */
export function checkupVocabPool(cfg: CheckupSectionConfig, index: number, itemCount: number): VocabPool {
  switch (cfg.checkupKind) {
    case "translations":
      return translationPoolFor(index, itemCount, cfg.direction ?? "mixed");
    case "definitions":
      return "definition";
    default:
      // words-phrases (and the deferred picture-mc fallback) = the carrier gap-fill
      return "carrier";
  }
}

// ── the Σ=20 draft gate (shared by builder feedback + the save endpoint) ─────

export interface CheckupDraftSection {
  kind: string;
  itemIds: string[];
  sectionConfig?: CheckupSectionConfig | null;
}

/**
 * Checkup-specific validation, run ON TOP of validateAssignmentDraft's generic
 * checks (title/class/reserved/dupes). Hard rules from doc 21 §3+§5.4:
 * every section carries a config with an ACTIVE kind matching its DB kind,
 * points are integers ≥1, one item = one point (itemIds.length === points),
 * and the sections sum to EXACTLY 20.
 */
export function validateCheckupSections(sections: CheckupDraftSection[]): string[] {
  const errors: string[] = [];
  if (sections.length === 0) return ["A checkup needs at least one section."];
  let total = 0;
  for (const [i, sec] of sections.entries()) {
    const where = `Section ${i + 1}`;
    const cfg = sec.sectionConfig ?? null;
    if (cfg === null) {
      errors.push(`${where}: checkup sections need a section config (kind + points).`);
      continue;
    }
    if (!(CHECKUP_KINDS as readonly string[]).includes(cfg.checkupKind)) {
      errors.push(`${where}: unknown checkup kind “${String(cfg.checkupKind)}”.`);
      continue;
    }
    if (cfg.checkupKind === "picture-mc") {
      errors.push(`${where}: picture sections are deferred in v1 (no image assets yet) — move its points to another section.`);
      continue;
    }
    if (!Number.isInteger(cfg.points) || cfg.points < 1) {
      errors.push(`${where}: points must be a whole number of at least 1.`);
      continue;
    }
    if (checkupSectionKind(cfg.checkupKind) !== sec.kind) {
      errors.push(`${where}: “${cfg.checkupKind}” must be a ${checkupSectionKind(cfg.checkupKind)} section.`);
    }
    if (sec.itemIds.length !== cfg.points) {
      errors.push(`${where}: has ${sec.itemIds.length} item(s) for ${cfg.points} point(s) — one item = one point.`);
    }
    total += cfg.points;
  }
  if (total !== CHECKUP_TOTAL) {
    errors.push(`A checkup is always exactly /${CHECKUP_TOTAL} — sections sum to ${total}.`);
  }
  return errors;
}

// ── /20 scoring (doc 21 §7) ───────────────────────────────────────────────────

export interface CheckupScoreSection {
  position: number;
  /** the section's authored item ids (its denominator — blanks score 0) */
  itemIds: string[];
  /** the section's points (= its item count under the one-item-one-point rule) */
  points: number;
}

export interface CheckupSectionScore {
  position: number;
  /** points earned in this section (half-credits possible) */
  points: number;
  outOf: number;
}

export interface CheckupScore {
  /** Σ earned points, exact except for a 2-dp float-noise clamp */
  points: number;
  /** Σ section points (20 for any valid checkup — computed, never assumed) */
  outOf: number;
  perSection: CheckupSectionScore[];
}

/** Kill float noise without losing half-credits (0.5 is exact in binary anyway). */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Score a submitted checkup sitting: first-attempt-per-item (no retry credit),
 * each item worth its section's points / item count (= 1 under the enforced
 * one-item-one-point rule; the general formula stays for defensive robustness),
 * tier factor from TIER_POINTS (correct 1 · partial 0.5 · close 0.5 · wrong 0),
 * an unanswered item scores 0 against the full section. Points-only — the Note
 * machinery is deliberately NOT involved (doc 21 §8-③).
 */
export function scoreCheckup(sections: CheckupScoreSection[], attempts: ScorableAttempt[]): CheckupScore {
  const tierOf = firstAttemptTiers(attempts);
  const perSection: CheckupSectionScore[] = sections.map((sec) => {
    const worth = sec.itemIds.length > 0 ? sec.points / sec.itemIds.length : 0;
    let earned = 0;
    for (const id of sec.itemIds) {
      const tier = tierOf.get(id);
      if (tier !== undefined) earned += tierPoints(tier) * worth;
    }
    return { position: sec.position, points: round2(earned), outOf: sec.points };
  });
  return {
    points: round2(perSection.reduce((s, x) => s + x.points, 0)),
    outOf: sections.reduce((s, x) => s + x.points, 0),
    perSection,
  };
}

/** Display form: "14.5" with at most one decimal (doc 21 §7), never "14.50". */
export function formatCheckupPoints(points: number): string {
  const oneDp = Math.round(points * 10) / 10;
  return Number.isInteger(oneDp) ? String(oneDp) : oneDp.toFixed(1);
}
