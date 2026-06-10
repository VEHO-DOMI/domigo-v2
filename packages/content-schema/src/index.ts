/**
 * @domigo/content-schema — the pipeline ↔ app contract.
 *
 * Everything the content pipeline emits and the app consumes is validated
 * against the schemas in this package. See docs/handover/07_task_formats.md
 * (format catalog) and the approved kickoff plan for field semantics.
 *
 * Currently covers the stage-1/2 artifacts (word banks, unit state,
 * sources lock). Vocab/grammar/arcade item schemas land with pipeline
 * stages 4–6.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

export const GRADES = [1, 2, 3, 4] as const;
export type Grade = (typeof GRADES)[number];

/** Vocab units per grade (MORE! 1–4). Grammar modules are cumulative. */
export const UNITS_PER_GRADE: Record<Grade, number> = { 1: 15, 2: 15, 3: 14, 4: 13 };

/** Canonical unit slug, e.g. `g2-u03`. */
export function unitSlug(grade: Grade, unit: number): string {
  return `g${grade}-u${String(unit).padStart(2, "0")}`;
}

/** Canonical id prefix for a unit, e.g. `g2u03`. */
export function unitIdPrefix(grade: Grade, unit: number): string {
  return `g${grade}u${String(unit).padStart(2, "0")}`;
}

export const UnitSlug = z.string().regex(/^g[1-4]-u\d{2}$/);

// ---------------------------------------------------------------------------
// Word bank (the cumulative level gate) — wordbank@1
// ---------------------------------------------------------------------------

export const WordBankEntry = z.object({
  /** `g2u03.w.<headword-slug>` — pinned in ids.lock.json at first parse. */
  id: z.string().regex(/^g[1-4]u\d{2}\.w\.[a-z0-9-]+$/),
  /** Which master-list table the entry comes from. */
  kind: z.enum(["wordfile", "phrase"]),
  /** Word File theme heading (e.g. "School Subjects"), when present. */
  theme: z.string().nullable(),
  /** English headword / phrase, verbatim from the master list. */
  en: z.string().min(1),
  /** German translation(s) — `deRaw` split on alternative separators. */
  de: z.array(z.string().min(1)).min(1),
  /** German cell verbatim (the splitting is lossy by design; keep the source). */
  deRaw: z.string().min(1),
  /** Example sentence, verbatim from the master list (phrases table only). */
  exampleSb: z.string().nullable(),
  /** Citation form when `en` is a "to …" verb (e.g. "stay at home"). */
  cf: z.string().nullable(),
  /**
   * Inflection family for the level-gate tokenizer (V5). Seeded from the
   * headword (+ cf, + parenthesised plurals like "knife (pl knives)");
   * enriched in later pipeline stages.
   */
  forms: z.array(z.string().min(1)).min(1),
  /** True if the SB transcript glosses this word inline (harvested later). */
  taughtGloss: z.boolean(),
});
export type WordBankEntry = z.infer<typeof WordBankEntry>;

export const WordBank = z.object({
  schema: z.literal("wordbank@1"),
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  unit: z.number().int().min(1).max(15),
  slug: UnitSlug,
  /** Unit title from the SB transcript (filled in stage 4+; null in drafts). */
  title: z.object({ en: z.string().nullable() }),
  source: z.object({
    /** Master-list docx path (iCloud) this bank was parsed from. */
    masterList: z.string(),
    /** sha256 of that docx at parse time (drift detection). */
    sha256: z.string().regex(/^[0-9a-f]{64}$/),
  }),
  entries: z.array(WordBankEntry).min(1),
});
export type WordBank = z.infer<typeof WordBank>;

// ---------------------------------------------------------------------------
// Per-unit audit state machine (state.json)
// ---------------------------------------------------------------------------

export const UNIT_STATES = [
  "extracted",
  "wordbank_draft",
  "wordbank_approved",
  "generated",
  "verified",
  "validated",
  "review_ready",
  "changes_requested",
  "approved",
  "released",
  "superseded",
] as const;
export const UnitState = z.enum(UNIT_STATES);
export type UnitState = z.infer<typeof UnitState>;

export const StateTransition = z.object({
  state: UnitState,
  at: z.string(), // ISO timestamp
  by: z.string(), // "pipeline" | "koki" | agent name
  contentHash: z.string().nullable(),
  note: z.string().nullable(),
});
export type StateTransition = z.infer<typeof StateTransition>;

/** Append-only transition log; the last entry is the current state. */
export const UnitStateLog = z.object({
  schema: z.literal("unit-state@1"),
  slug: UnitSlug,
  transitions: z.array(StateTransition).min(1),
});
export type UnitStateLog = z.infer<typeof UnitStateLog>;

// ---------------------------------------------------------------------------
// Sources lock (stage-1 provenance)
// ---------------------------------------------------------------------------

export const SourceLockEntry = z.object({
  /** Path relative to the iCloud source base (kept stable across machines). */
  relPath: z.string(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  bytes: z.number().int().nonnegative(),
  mtime: z.string(),
  /** What the pipeline uses this source as. */
  role: z.enum(["master-list", "sb-transcript", "wb-transcript", "other"]),
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});
export type SourceLockEntry = z.infer<typeof SourceLockEntry>;

export const SourcesLock = z.object({
  schema: z.literal("sources-lock@1"),
  base: z.string(),
  extractedAt: z.string(),
  sources: z.array(SourceLockEntry),
});
export type SourcesLock = z.infer<typeof SourcesLock>;
