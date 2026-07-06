/**
 * @domigo/content-schema — the pipeline ↔ app contract.
 *
 * Everything the content pipeline emits and the app consumes is validated
 * against the schemas in this package. See docs/handover/07_task_formats.md
 * (format catalog) and the approved kickoff plan for field semantics.
 *
 * Covers the stage-1/2 artifacts (word banks, unit state, sources lock),
 * the review-round artifacts (stage 3), the item layer (stages 4–8:
 * grammar-structures@1, vocab@1, grammar@1 + shared presentation/gameMeta
 * primitives), and the story@1 narrative contract (schema only — story
 * tooling lands with Track C). quest@1/map@1/encounter@1 freeze in Track
 * C's G0 contracts step, not here.
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
  /** Absent = parsed from the master list. Set for review-recovered entries. */
  origin: z.enum(["v1-recovery"]).optional(),
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
  "wordbank_review",
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

/**
 * State-log scope: a unit slug, or a grade-scope log (the per-grade grammar
 * structures catalog, slug `g{n}-structures`). Additive widening — every
 * committed unit state.json stays valid.
 */
export const StateScopeSlug = z.union([
  UnitSlug,
  z.string().regex(/^g[1-4]-structures$/),
]);
export type StateScopeSlug = z.infer<typeof StateScopeSlug>;

/** Append-only transition log; the last entry is the current state. */
export const UnitStateLog = z.object({
  schema: z.literal("unit-state@1"),
  slug: StateScopeSlug,
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

// ---------------------------------------------------------------------------
// v1 parity snapshot (content/build/v1/)
// ---------------------------------------------------------------------------

export const V1Lock = z.object({
  schema: z.literal("v1-lock@1"),
  base: z.string(),
  sources: z.array(
    z.object({
      relPath: z.string(),
      sha256: z.string().regex(/^[0-9a-f]{64}$/),
      bytes: z.number().int().nonnegative(),
      mtime: z.string(),
      /** null for whole-corpus sources (grammar index). */
      grade: z
        .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
        .nullable(),
      /** null for per-grade/whole-corpus sources (grammar modules, index). */
      unit: z.number().int().min(1).max(15).nullable(),
      role: z.enum(["vocab-unit", "grammar-module", "grammar-index"]),
    }),
  ),
});
export type V1Lock = z.infer<typeof V1Lock>;

// ---------------------------------------------------------------------------
// Review round artifacts (wordbank review — authored by Fable, audited)
// ---------------------------------------------------------------------------

export const ParseFixes = z.record(
  UnitSlug,
  z.object({
    drop: z.array(z.string()).optional(),
    patch: z.record(z.string(), WordBankEntry.partial()).optional(),
    add: z.array(WordBankEntry).optional(),
  }),
);
export type ParseFixes = z.infer<typeof ParseFixes>;

export const FLAG_KINDS = [
  "de-split-suspect",
  "ascii-umlaut-suspect",
  "duplicate-headword",
  "not-in-transcript",
  "no-transcript",
  "v1-missing",
  "v1-unit-mismatch",
  "forms-suspect",
  "changed-since-review",
] as const;
export const FlagKind = z.enum(FLAG_KINDS);
export type FlagKind = z.infer<typeof FlagKind>;

export const FLAG_VERDICTS = ["ok", "drop", "fix", "add"] as const;
export const FlagVerdict = z.enum(FLAG_VERDICTS);
export type FlagVerdict = z.infer<typeof FlagVerdict>;

export const WordbankReviewFlags = z.object({
  schema: z.literal("wordbank-flags@1"),
  slug: UnitSlug,
  round: z.number().int().min(1),
  bankHash: z.string(),
  reviewedBy: z.string(),
  flags: z.array(
    z.object({
      key: z.string(), // durable: `${kind}:${entryId or "unit"}`
      kind: FlagKind,
      entryId: z.string().nullable(),
      verdict: FlagVerdict,
      note: z.string(),
    }),
  ),
  unit: z.object({ verdict: z.enum(["ok", "changes"]), note: z.string() }),
});
export type WordbankReviewFlags = z.infer<typeof WordbankReviewFlags>;

/** Per-row content hashes at review time — round-2 docs collapse reviewed rows. */
export const ReviewedRows = z.object({
  schema: z.literal("wordbank-reviewed@1"),
  slug: UnitSlug,
  round: z.number().int().min(1),
  rows: z.record(z.string(), z.string()), // ref → row content hash
});
export type ReviewedRows = z.infer<typeof ReviewedRows>;

/** Closed-class tokens assumed known at every level (the V5 escape list). */
export const CoreAllowlist = z.object({
  schema: z.literal("core-allowlist@1"),
  reviewedBy: z.string(),
  tokens: z.array(
    z.object({
      token: z.string().min(1),
      category: z.string(),
      note: z.string().nullable(),
    }),
  ),
});
export type CoreAllowlist = z.infer<typeof CoreAllowlist>;

// ---------------------------------------------------------------------------
// Shared item primitives (stages 4–8) — see docs/handover/07_task_formats.md
// and docs/handover/10_game_layer.md §"Items serve both worlds".
// ---------------------------------------------------------------------------

/** Shared grade schema for the item layer. */
export const GradeZ = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

/** v2 difficulty — REQUIRED on every item (encounter scaling + path graduation). */
export const Difficulty = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type Difficulty = z.infer<typeof Difficulty>;

/** v1 difficulty (1–5) → v2 (1–3). Seed HINT only — v1 is an untrusted seed. */
export function v1DifficultyToV2(d: number): Difficulty {
  return d <= 2 ? 1 : d === 3 ? 2 : 3;
}

export const AnswerTier = z.enum(["full", "partial"]);
export type AnswerTier = z.infer<typeof AnswerTier>;

/**
 * One accepted answer. `full` grades correct (full XP); `partial` grades the
 * partial tier (half XP). The `close` tier is computed by the grader
 * (Levenshtein), never authored. Multi-blank prompts encode per-blank fills
 * pipe-joined in one text ("did | go", blank order); renderers split.
 */
export const TieredAnswer = z.object({
  text: z.string().min(1),
  tier: AnswerTier,
});
export type TieredAnswer = z.infer<typeof TieredAnswer>;

/** Inline gloss `word (= deutsches Wort)` for an above-level word (guardrail 3). */
export const Gloss = z.object({
  /** The above-level EN word/phrase exactly as it appears in the carrier. */
  word: z.string().min(1),
  de: z.string().min(1),
  /** Field it applies to ("s" | "d" | "prompt" | a variant key | null = all). */
  scope: z.string().nullable(),
});
export type Gloss = z.infer<typeof Gloss>;

export const Provenance = z.object({
  /** Author: "fable" | agent name | "pipeline". */
  by: z.string().min(1),
  /** Transcript evidence ref, e.g. "g2/sb/More 2 SB Unit 3.txt#grammar-1". */
  sbRef: z.string().nullable(),
  /** v1 item/structure id this was seeded from (untrusted seed), if any. */
  seedV1: z.string().nullable(),
  /** Narrative lock — set on storyItems minted by story production. */
  narrative: z
    .object({ storyId: z.string(), chapterId: z.string() })
    .nullable(),
  note: z.string().nullable(),
});
export type Provenance = z.infer<typeof Provenance>;

/** Game-encounter metadata (10_game_layer.md). In-bank-ness = validator V-17. */
export const GameMeta = z.object({
  /** Extra wrong options for game encounters (≥4, all in cumulative bank). */
  distractorPool: z.array(z.string().min(1)).min(4),
  /** Max chips a chip-input renderer may show (answer chips included). */
  chipBudget: z.number().int().min(2).max(12).nullable(),
  /** Minimum options a game must render (mc-style encounters). */
  minOptions: z.number().int().min(2).max(6).nullable(),
});
export type GameMeta = z.infer<typeof GameMeta>;

/** RESERVED — schema only; nothing emits audio yet (TTS rides the Blob plan). */
export const AudioRef = z.object({
  script: z.string().min(1),
  voice: z.string().nullable(),
  /** Content-addressed asset path once rendered (audio/<sha256>.mp3). */
  file: z.string().nullable(),
});
export type AudioRef = z.infer<typeof AudioRef>;

/** Blank marker = a run of ≥3 underscores. */
export function countBlanks(s: string): number {
  return s.match(/_{3,}/g)?.length ?? 0;
}

/**
 * A presentation variant re-frames the SAME item for a context (story scene,
 * game encounter). It can change ONLY carrier/framing text — it structurally
 * cannot carry answers, distractors or direction. Whether the original
 * answers still fit the new carrier is validator V-16's semantic check.
 * Variants are minted on demand by story production — empty until then.
 */
export const Variant = z.object({
  /** Stable key, e.g. "watson.ch03.diary" (story production mints these). */
  key: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/),
  /** Replacement carrier (vocab: replaces `s`; grammar: replaces `prompt.text`). */
  prompt: z.object({ text: z.string().min(1), lang: z.enum(["en", "de"]) }),
  /** Extra glosses the new carrier needs (level gate runs per variant). */
  glosses: z.array(Gloss),
  audio: AudioRef.nullable(), // reserved
  provenance: Provenance,
});
export type Variant = z.infer<typeof Variant>;

export const ItemPresentation = z.object({
  variants: z.array(Variant),
  gameMeta: GameMeta.nullable(),
  audio: AudioRef.nullable(), // reserved (base-carrier audio)
});
export type ItemPresentation = z.infer<typeof ItemPresentation>;

/**
 * Hand-authored story-production INPUT — the carriers a story wants minted onto
 * its task items. `content story variants` validates each (resolves the itemId,
 * keeps the base blank count, level-gates the carrier at the item's unit) and
 * upserts it into the item's `presentation.variants`, then re-stamps the unit.
 * Lives at content/corpus/stories/<id>/variants.json.
 */
export const VariantSpec = z.object({
  /** Stable, unique-within-item key (e.g. "wrong-name.ch04.compare"). */
  key: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/),
  /** The task item this re-frames (must resolve in its unit). */
  itemId: z.string().min(1),
  /** Where it attaches (cross-checked: this scene's slot must use itemId). */
  scene: z.string().min(1),
  slot: z.string().min(1),
  /** Replacement carrier (grammar: prompt.text; vocab: s). Same blank count. */
  prompt: z.object({ text: z.string().min(1), lang: z.enum(["en", "de"]) }),
  /** Glosses the new carrier needs (the per-variant level gate honors these). */
  glosses: z.array(z.object({ word: z.string().min(1), de: z.string().min(1) })),
});
export type VariantSpec = z.infer<typeof VariantSpec>;

export const VariantsFile = z.object({
  schema: z.literal("variants@1"),
  storyId: z.string().min(1),
  variants: z.array(VariantSpec),
});
export type VariantsFile = z.infer<typeof VariantsFile>;

/** Fields shared by every graded item — spread into VocabItem/GrammarItem. */
const gradedCore = {
  /** Bumped on any content change; ids never reused (tombstones). */
  rev: z.number().int().min(1),
  difficulty: Difficulty,
  presentation: ItemPresentation,
  provenance: Provenance,
} as const;

// ---------------------------------------------------------------------------
// Vocab items — vocab@1 (one item per word-bank entry; id == word id)
// ---------------------------------------------------------------------------

export const WordId = z.string().regex(/^g[1-4]u\d{2}\.w\.[a-z0-9-]+$/);

/** Where a carrier sentence comes from. Textbook sentences FIRST; invention last. */
export const SentenceSource = z.enum(["masterlist", "sb", "wb", "invented"]);
export type SentenceSource = z.infer<typeof SentenceSource>;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const VocabItem = z
  .object({
    /** == the word-bank entry id (1:1 with the bank; no separate minting). */
    id: WordId,
    ...gradedCore,
    /** EN headword as practiced (bank `en`). */
    w: z.string().min(1),
    /** Primary German translation (bank `de[0]`, post-review). */
    g: z.string().min(1),
    /** EN definition — must not leak the headword (lemma-aware leak = V-8). */
    d: z.string().min(1),
    /** Carrier sentence with exactly one ___ blank. */
    s: z.string().min(1),
    sSource: SentenceSource,
    /** Accepted fills for the `s` blank. */
    sAnswers: z.array(TieredAnswer).min(1),
    /** Accepted answers for definition→word. */
    dAnswers: z.array(TieredAnswer).min(1),
    translation: z.object({
      deToEn: z.array(TieredAnswer).min(1),
      enToDe: z.array(TieredAnswer).min(1),
    }),
    gloss: z.array(Gloss),
    /** Exactly 3 distractors, all in the cumulative bank (V-9). */
    mc: z.array(z.string().min(1)).length(3),
    /** German hint, du-form (du-form enforcement = V-12). */
    hintDe: z.string().min(1),
  })
  .superRefine((v, ctx) => {
    const wLower = v.w.toLowerCase();
    if (
      new RegExp(`(?<![a-z])${escapeRegExp(wLower)}(?![a-z])`).test(
        v.d.toLowerCase(),
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["d"],
        message: `definition leaks the headword "${v.w}"`,
      });
    }
    if (countBlanks(v.s) !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["s"],
        message: "carrier sentence needs exactly one ___ blank",
      });
    }
    const answerSets: Array<[string, TieredAnswer[]]> = [
      ["sAnswers", v.sAnswers],
      ["dAnswers", v.dAnswers],
      ["translation", v.translation.deToEn],
      ["translation", v.translation.enToDe],
    ];
    for (const [pathKey, set] of answerSets) {
      if (!set.some((a) => a.tier === "full")) {
        ctx.addIssue({
          code: "custom",
          path: [pathKey],
          message: "needs ≥1 tier=full answer",
        });
      }
    }
    const seenMc = new Set<string>();
    for (const m of v.mc) {
      const lower = m.toLowerCase();
      if (lower === wLower) {
        ctx.addIssue({
          code: "custom",
          path: ["mc"],
          message: "distractor equals the headword",
        });
      }
      if (seenMc.has(lower)) {
        ctx.addIssue({
          code: "custom",
          path: ["mc"],
          message: `duplicate distractor "${m}"`,
        });
      }
      seenMc.add(lower);
    }
    for (const [i, va] of v.presentation.variants.entries()) {
      if (countBlanks(va.prompt.text) !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["presentation", "variants", i, "prompt"],
          message:
            "variant must keep exactly one ___ blank (variants only re-frame carrier text)",
        });
      }
    }
  });
export type VocabItem = z.infer<typeof VocabItem>;

export const VocabFile = z
  .object({
    schema: z.literal("vocab@1"),
    grade: GradeZ,
    unit: z.number().int().min(1).max(15),
    slug: UnitSlug,
    items: z.array(VocabItem).min(1),
  })
  .superRefine((f, ctx) => {
    const prefix = unitIdPrefix(f.grade, f.unit);
    const seen = new Set<string>();
    for (const [i, it] of f.items.entries()) {
      if (!it.id.startsWith(`${prefix}.w.`)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", i, "id"],
          message: `id lacks unit prefix ${prefix}`,
        });
      }
      if (seen.has(it.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", i, "id"],
          message: `duplicate id ${it.id}`,
        });
      }
      seen.add(it.id);
    }
  });
export type VocabFile = z.infer<typeof VocabFile>;

// ---------------------------------------------------------------------------
// Grammar structures — grammar-structures@1 (per-grade catalog, stage 4)
// ---------------------------------------------------------------------------

export const GRAMMAR_FORMATS = [
  "gap-fill",
  "multiple-choice",
  "context-picker",
  "translation",
  "error-correction",
  "transformation",
  "question-formation",
  "free-form",
  "sentence-building",
  "matching",
  "anagram",
  "group-sort",
  "matching-pairs",
] as const; // v1's formats minus verb-table (07_task_formats.md drops it)
export const GrammarFormat = z.enum(GRAMMAR_FORMATS);
export type GrammarFormat = z.infer<typeof GrammarFormat>;

/** Two-letter id codes embedded in grammar item ids (`…gi.<key>.<code>.NNN`). */
export const FORMAT_CODES = {
  "gap-fill": "gf",
  "multiple-choice": "mc",
  "context-picker": "cp",
  translation: "tr",
  "error-correction": "ec",
  transformation: "tf",
  "question-formation": "qf",
  "free-form": "ff",
  "sentence-building": "sb",
  matching: "mt",
  anagram: "ag",
  "group-sort": "gs",
  "matching-pairs": "mp",
} as const satisfies Record<GrammarFormat, string>;

/** Format classes (shape rules + V-4). */
export const TEXT_ANSWER_FORMATS = new Set<GrammarFormat>([
  "gap-fill",
  "translation",
  "error-correction",
  "transformation",
  "question-formation",
  "free-form",
  "sentence-building",
  "anagram",
]);
export const CHOICE_FORMATS = new Set<GrammarFormat>([
  "multiple-choice",
  "context-picker",
]);
export const PAIR_FORMATS = new Set<GrammarFormat>([
  "matching",
  "matching-pairs",
]);

/** Exactly the v1 category set (verified across m1–m4); "other" is the escape. */
export const STRUCTURE_CATEGORIES = [
  "articles",
  "comparison",
  "conditionals",
  "connectors",
  "modals",
  "other",
  "passive",
  "prepositions",
  "pronouns",
  "reported-speech",
  "tenses",
  "word-formation",
] as const;
export const StructureCategory = z.enum(STRUCTURE_CATEGORIES);
export type StructureCategory = z.infer<typeof StructureCategory>;

/** `g2u03.s.<key>` — unit prefix = introducing (gate) unit. */
export const StructureId = z.string().regex(/^g[1-4]u\d{2}\.s\.[a-z0-9-]+$/);

/** A teachable rule of the structure (grammar intro cards). */
export const GrammarRule = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  en: z.string().min(1),
  de: z.string().min(1),
  examples: z.array(z.object({ en: z.string().min(1), de: z.string().min(1) })),
});
export type GrammarRule = z.infer<typeof GrammarRule>;

export const GrammarStructure = z
  .object({
    id: StructureId,
    /** Short key reused inside item ids (`g2u03.gi.<key>.gf.001`); grade-unique. */
    key: z.string().regex(/^[a-z0-9-]+$/),
    unit: z.number().int().min(1).max(15),
    /** Teacher-facing only — students never see grammar names. */
    name: z.string().min(1),
    nameDe: z.string().min(1),
    category: StructureCategory,
    description: z.string().min(1),
    /** Teaching content, authored from the SB box (v1 `rules` as seed). */
    rules: z.array(GrammarRule).min(1),
    commonErrors: z.array(
      z.object({
        description: z.string().min(1),
        wrong: z.string().min(1),
        correct: z.string().min(1),
      }),
    ),
    /** Same-grade units where the structure recurs (revision boxes). */
    recursIn: z.array(z.number().int().min(1).max(15)),
    /** Transcript evidence refs, e.g. "g2/sb/More 2 SB Unit 3.txt#grammar-1". */
    sbRefs: z.array(z.string().min(1)),
    /** v1 structure ids this covers (many-to-one allowed; empty = NEW). */
    seedV1: z.array(z.string().min(1)),
    provenance: Provenance,
  })
  .superRefine((s, ctx) => {
    const m = /^g([1-4])u(\d{2})\.s\.([a-z0-9-]+)$/.exec(s.id);
    if (m === null) return;
    if (parseInt(m[2]!, 10) !== s.unit) {
      ctx.addIssue({
        code: "custom",
        path: ["unit"],
        message: `id says unit ${m[2]!}, field says ${s.unit}`,
      });
    }
    if (m[3] !== s.key) {
      ctx.addIssue({
        code: "custom",
        path: ["key"],
        message: `id key "${m[3]!}" ≠ key "${s.key}"`,
      });
    }
    if (s.recursIn.some((u) => u <= s.unit)) {
      ctx.addIssue({
        code: "custom",
        path: ["recursIn"],
        message: "recursIn units must be after the introducing unit",
      });
    }
  });
export type GrammarStructure = z.infer<typeof GrammarStructure>;

export const GrammarStructuresFile = z
  .object({
    schema: z.literal("grammar-structures@1"),
    grade: GradeZ,
    structures: z.array(GrammarStructure).min(1),
    /** v1 structures intentionally NOT carried (each needs a reasoned note). */
    v1Waivers: z.array(
      z.object({ v1Id: z.string().min(1), note: z.string().min(1) }),
    ),
  })
  .superRefine((f, ctx) => {
    const ids = new Set<string>();
    const keys = new Set<string>();
    const mapped = new Set<string>();
    for (const [i, s] of f.structures.entries()) {
      if (!s.id.startsWith(`g${f.grade}u`)) {
        ctx.addIssue({
          code: "custom",
          path: ["structures", i, "id"],
          message: "grade prefix mismatch",
        });
      }
      if (ids.has(s.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["structures", i, "id"],
          message: `duplicate id ${s.id}`,
        });
      }
      if (keys.has(s.key)) {
        ctx.addIssue({
          code: "custom",
          path: ["structures", i, "key"],
          message: `duplicate key ${s.key} (keys are grade-unique — item ids embed them)`,
        });
      }
      ids.add(s.id);
      keys.add(s.key);
      for (const v of s.seedV1) mapped.add(v);
    }
    for (const [i, w] of f.v1Waivers.entries()) {
      if (mapped.has(w.v1Id)) {
        ctx.addIssue({
          code: "custom",
          path: ["v1Waivers", i],
          message: `${w.v1Id} both mapped and waived`,
        });
      }
    }
  });
export type GrammarStructuresFile = z.infer<typeof GrammarStructuresFile>;

// ---------------------------------------------------------------------------
// Grammar items — grammar@1 (per unit; ids fingerprint-pinned in items.lock)
// ---------------------------------------------------------------------------

export const GrammarItemId = z
  .string()
  .regex(
    /^g[1-4]u\d{2}\.gi\.[a-z0-9-]+\.(gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp)\.\d{3}$/,
  );

export const TranslationDirection = z.enum(["deToEn", "enToDe"]);
export type TranslationDirection = z.infer<typeof TranslationDirection>;

export const GrammarItem = z
  .object({
    id: GrammarItemId,
    /** Must resolve in the grade's structures catalog (cross-file: V-3). */
    structureId: StructureId,
    format: GrammarFormat,
    ...gradedCore,
    /** Instruction text lives in RENDERERS, never here (no meta-talk). */
    prompt: z.object({
      text: z.string().min(1),
      lang: z.enum(["en", "de"]),
      blanks: z.number().int().min(0).max(4),
    }),
    answers: z.array(TieredAnswer),
    /** REQUIRED iff format === "translation"; null otherwise. */
    direction: TranslationDirection.nullable(),
    distractors: z.array(z.string().min(1)),
    /** matching / matching-pairs — graded with per-pair credit. */
    pairs: z.array(
      z.object({ left: z.string().min(1), right: z.string().min(1) }),
    ),
    /** group-sort buckets. */
    groups: z.array(
      z.object({
        label: z.string().min(1),
        members: z.array(z.string().min(1)).min(2),
      }),
    ),
    /** Inline glosses for above-level words in the carrier (level-gate escape). */
    gloss: z.array(Gloss),
    hintDe: z.string().min(1),
    hintEn: z.string().nullable(),
    explainDe: z.string().min(1),
    explainEn: z.string().nullable(),
    /** Exact-match grading only (disables the close tier). */
    strict: z.boolean(),
  })
  .superRefine((it, ctx) => {
    // id ↔ structureId ↔ format coherence (pure-string, no cross-file lookups)
    const idm = /^(g[1-4]u\d{2})\.gi\.([a-z0-9-]+)\.([a-z]{2})\.\d{3}$/.exec(
      it.id,
    );
    const sm = /^(g[1-4]u\d{2})\.s\.([a-z0-9-]+)$/.exec(it.structureId);
    if (idm !== null && sm !== null) {
      if (idm[1] !== sm[1]) {
        ctx.addIssue({
          code: "custom",
          path: ["structureId"],
          message: `item unit ${idm[1]!} ≠ structure unit ${sm[1]!}`,
        });
      }
      if (idm[2] !== sm[2]) {
        ctx.addIssue({
          code: "custom",
          path: ["structureId"],
          message: `item embeds key "${idm[2]!}" but structureId says "${sm[2]!}"`,
        });
      }
      if (idm[3] !== FORMAT_CODES[it.format]) {
        ctx.addIssue({
          code: "custom",
          path: ["format"],
          message: `id code "${idm[3]!}" ≠ format "${it.format}" (${FORMAT_CODES[it.format]})`,
        });
      }
    }
    // translation direction
    if (it.format === "translation" && it.direction === null) {
      ctx.addIssue({
        code: "custom",
        path: ["direction"],
        message: "translation REQUIRES direction",
      });
    }
    if (it.format !== "translation" && it.direction !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["direction"],
        message: "direction is translation-only",
      });
    }
    // blanks: marker count must equal declared count
    if (countBlanks(it.prompt.text) !== it.prompt.blanks) {
      ctx.addIssue({
        code: "custom",
        path: ["prompt", "blanks"],
        message: "___ marker count ≠ blanks",
      });
    }
    if (it.format === "gap-fill" && it.prompt.blanks < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["prompt", "blanks"],
        message: "gap-fill needs ≥1 blank",
      });
    }
    // format classes
    if (TEXT_ANSWER_FORMATS.has(it.format) || CHOICE_FORMATS.has(it.format)) {
      if (!it.answers.some((a) => a.tier === "full")) {
        ctx.addIssue({
          code: "custom",
          path: ["answers"],
          message: "needs ≥1 tier=full answer",
        });
      }
      if (it.pairs.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["pairs"],
          message: `${it.format} must not carry pairs`,
        });
      }
      if (it.groups.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["groups"],
          message: `${it.format} must not carry groups`,
        });
      }
    }
    if (CHOICE_FORMATS.has(it.format) && it.distractors.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["distractors"],
        message: `${it.format} needs ≥3 distractors`,
      });
    }
    if (it.format === "matching" && (it.pairs.length < 3 || it.pairs.length > 6)) {
      ctx.addIssue({
        code: "custom",
        path: ["pairs"],
        message: "matching needs 3–6 pairs",
      });
    }
    if (
      it.format === "matching-pairs" &&
      (it.pairs.length < 4 || it.pairs.length > 8)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["pairs"],
        message: "matching-pairs needs 4–8 pairs",
      });
    }
    if (PAIR_FORMATS.has(it.format)) {
      if (it.answers.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["answers"],
          message: "pair formats grade from pairs; answers must be empty",
        });
      }
      if (it.groups.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["groups"],
          message: `${it.format} must not carry groups`,
        });
      }
    }
    if (it.format === "group-sort") {
      if (it.groups.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["groups"],
          message: "group-sort needs ≥2 groups",
        });
      }
      if (it.answers.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["answers"],
          message: "group-sort grades from groups; answers must be empty",
        });
      }
      if (it.pairs.length > 0) {
        ctx.addIssue({
          code: "custom",
          path: ["pairs"],
          message: "group-sort must not carry pairs",
        });
      }
    }
    if (it.format === "anagram") {
      const single =
        it.answers.length === 1 &&
        it.answers[0]!.tier === "full" &&
        !/\s/.test(it.answers[0]!.text);
      if (!single) {
        ctx.addIssue({
          code: "custom",
          path: ["answers"],
          message: "anagram needs exactly one single-token full answer",
        });
      }
    }
    // THE schema-checkable variant invariant: blank count cannot change
    for (const [i, va] of it.presentation.variants.entries()) {
      if (countBlanks(va.prompt.text) !== it.prompt.blanks) {
        ctx.addIssue({
          code: "custom",
          path: ["presentation", "variants", i, "prompt"],
          message:
            "variant changes the blank count — variants may only re-frame carrier text",
        });
      }
    }
  });
export type GrammarItem = z.infer<typeof GrammarItem>;

export const GrammarFile = z
  .object({
    schema: z.literal("grammar@1"),
    grade: GradeZ,
    unit: z.number().int().min(1).max(15),
    slug: UnitSlug,
    items: z.array(GrammarItem).min(1),
  })
  .superRefine((f, ctx) => {
    const prefix = unitIdPrefix(f.grade, f.unit);
    const seen = new Set<string>();
    for (const [i, it] of f.items.entries()) {
      if (!it.id.startsWith(`${prefix}.gi.`)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", i, "id"],
          message: `id lacks unit prefix ${prefix}`,
        });
      }
      if (seen.has(it.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", i, "id"],
          message: `duplicate id ${it.id}`,
        });
      }
      seen.add(it.id);
    }
  });
export type GrammarFile = z.infer<typeof GrammarFile>;

// ---------------------------------------------------------------------------
// Story — story@1 (narrative through the SAME pipeline; 10_game_layer.md).
// Schema only — story tooling (import, VS-1..VS-10 validators, review) is
// Track C. quest@1/map@1/encounter@1 freeze in Track C's G0, not here.
// ---------------------------------------------------------------------------

export const StoryId = z.string().regex(/^g[1-4]\.st\.[a-z0-9-]+$/);
export const ChapterId = z
  .string()
  .regex(/^g[1-4]\.st\.[a-z0-9-]+\.ch\d{2}$/);
export const SceneId = z
  .string()
  .regex(/^g[1-4]\.st\.[a-z0-9-]+\.ch\d{2}\.s\d{3}$/);
/** Story-local cast member id. */
export const CastId = z.string().regex(/^[a-z0-9-]+$/);

/** Any practicable item id — a vocab card or a grammar item. NEVER copies content. */
export const ItemRef = z
  .string()
  .regex(
    /^g[1-4]u\d{2}\.(?:w\.[a-z0-9-]+|gi\.[a-z0-9-]+\.(?:gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp)\.\d{3})$/,
  );

/** `g2u04.ci.<key>.<fmt>.<NNN>` — a story-comprehension item id (sibling to ItemRef;
 *  the gradeable schema lives lower, near ReadingItem). Tests the SCENE, not grammar. */
export const StoryComprehensionRef = z
  .string()
  .regex(/^g[1-4]u\d{2}\.ci\.[a-z0-9-]+\.(?:gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp)\.\d{3}$/);

/** A narrative branch option. Choices are never graded (no fake choices). */
/** Narrative flag id: `w04.said` — chapter-scoped consequence state (flags@1). */
export const FlagId = z.string().regex(/^w\d{2}\.[a-z0-9-]+$/);

export const Choice = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), // scene-local
  textEn: z.string().min(1),
  scaffoldDe: z.string().nullable(),
  next: SceneId,
  /** Flags this choice sets (persisted in the cosmetic save; VS-13 enforces that
   *  every set flag is declared and consumed — a choice that changes nothing
   *  fails CI). Flags gate flavor and scene selection, never items/XP (Law 2). */
  sets: z.array(FlagId).optional(),
});
export type Choice = z.infer<typeof Choice>;

/** Flag-conditioned routing: `then` when the flag is set, `else` otherwise.
 *  The else-path is the authored NEUTRAL default (wiped-save doctrine). */
export const FlagGate = z.object({
  kind: z.literal("flag"),
  flag: FlagId,
  then: SceneId,
  else: SceneId,
});
export type FlagGate = z.infer<typeof FlagGate>;

export const TaskSlot = z.object({
  /** Scene-local slot key. */
  slot: z.string().regex(/^[a-z0-9-]+$/),
  /** Resolves ≤ the chapter's gate unit — VS-4 validator (Track C). A `.ci.` ref
   *  points at a scene-comprehension item (story-bundle comprehension.json). */
  itemId: z.union([ItemRef, StoryComprehensionRef]),
  /** Which presentation variant renders here (null = base carrier). */
  variantKey: z.string().nullable(),
});
export type TaskSlot = z.infer<typeof TaskSlot>;

export const Scene = z.object({
  id: SceneId,
  /** Resolves against cast.json — VS-6 validator (Track C). */
  speaker: CastId,
  /** Level gate via tokenize.ts — VS-2 validator (Track C). */
  textEn: z.string().min(1),
  /** Du-form German scaffold — VS-3 validator (Track C), NOT schema. */
  scaffoldDe: z.string().nullable(),
  glosses: z.array(Gloss),
  audio: AudioRef.nullable(), // reserved
  taskSlots: z.array(TaskSlot),
  /** Linear next scene, a branch (≥2 choices), or null = chapter end. */
  next: z.union([SceneId, z.array(Choice).min(2), FlagGate, z.null()]),
  /** Flag-keyed line overrides (choice callbacks). Full VS-2/VS-3/VS-7 line
   *  checks apply — no student-facing string ever escapes to code. */
  flagLines: z
    .array(
      z.object({
        flag: FlagId,
        textEn: z.string().min(1),
        scaffoldDe: z.string().nullable(),
        glosses: z.array(Gloss),
      }),
    )
    .optional(),
});
export type Scene = z.infer<typeof Scene>;

export const Chapter = z
  .object({
    id: ChapterId,
    /** Gate unit: chapter N requires units ≤ N released (release gating). */
    unit: z.number().int().min(1).max(15),
    titleEn: z.string().min(1),
    titleDe: z.string().nullable(),
    scenes: z.array(Scene).min(1),
  })
  .superRefine((c, ctx) => {
    const ids = new Set<string>();
    for (const [i, s] of c.scenes.entries()) {
      if (!s.id.startsWith(`${c.id}.`)) {
        ctx.addIssue({
          code: "custom",
          path: ["scenes", i, "id"],
          message: "scene id outside chapter",
        });
      }
      if (ids.has(s.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["scenes", i, "id"],
          message: "duplicate scene id",
        });
      }
      ids.add(s.id);
    }
    // In-file resolution (cheap). REACHABILITY/no-dead-ends is VS-5, not schema.
    for (const [i, s] of c.scenes.entries()) {
      const targets =
        typeof s.next === "string"
          ? [s.next]
          : Array.isArray(s.next)
            ? s.next.map((x) => x.next)
            : [];
      for (const t of targets) {
        if (!ids.has(t)) {
          ctx.addIssue({
            code: "custom",
            path: ["scenes", i, "next"],
            message: `next → ${t} not in this chapter (chapters are the gating boundary)`,
          });
        }
      }
      if (Array.isArray(s.next)) {
        const choiceIds = new Set<string>();
        for (const ch of s.next) {
          if (choiceIds.has(ch.id)) {
            ctx.addIssue({
              code: "custom",
              path: ["scenes", i, "next"],
              message: `duplicate choice id "${ch.id}"`,
            });
          }
          choiceIds.add(ch.id);
        }
      }
      const slots = new Set<string>();
      for (const ts of s.taskSlots) {
        if (slots.has(ts.slot)) {
          ctx.addIssue({
            code: "custom",
            path: ["scenes", i, "taskSlots"],
            message: `duplicate task slot "${ts.slot}"`,
          });
        }
        slots.add(ts.slot);
      }
    }
  });
export type Chapter = z.infer<typeof Chapter>;

export const Story = z
  .object({
    schema: z.literal("story@1"),
    id: StoryId,
    grade: GradeZ,
    title: z.object({ en: z.string().min(1), de: z.string().nullable() }),
    chapters: z.array(Chapter).min(1),
  })
  .superRefine((st, ctx) => {
    const ids = new Set<string>();
    let prevUnit = 0;
    for (const [i, c] of st.chapters.entries()) {
      if (!c.id.startsWith(`${st.id}.`)) {
        ctx.addIssue({
          code: "custom",
          path: ["chapters", i, "id"],
          message: "chapter id outside story",
        });
      }
      if (ids.has(c.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["chapters", i, "id"],
          message: "duplicate chapter id",
        });
      }
      ids.add(c.id);
      if (c.unit < prevUnit) {
        ctx.addIssue({
          code: "custom",
          path: ["chapters", i, "unit"],
          message: "chapter gate units must be non-decreasing",
        });
      }
      prevUnit = c.unit;
    }
  });
export type Story = z.infer<typeof Story>;

export const Cast = z
  .object({
    schema: z.literal("cast@1"),
    storyId: StoryId,
    members: z
      .array(
        z.object({
          id: CastId,
          nameEn: z.string().min(1),
          descriptionDe: z.string().nullable(),
          voice: z.string().nullable(), // reserved (TTS)
          art: z.string().nullable(), // reserved (procedural art seed)
        }),
      )
      .min(1),
  })
  .superRefine((c, ctx) => {
    const ids = new Set<string>();
    for (const [i, m] of c.members.entries()) {
      if (ids.has(m.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["members", i, "id"],
          message: `duplicate cast id ${m.id}`,
        });
      }
      ids.add(m.id);
    }
  });
export type Cast = z.infer<typeof Cast>;

/** Per-story proper-noun level-gate escape — approved once, like the allowlist. */
export const StoryNames = z.object({
  schema: z.literal("names@1"),
  storyId: StoryId,
  reviewedBy: z.string(),
  names: z.array(
    z.object({ name: z.string().min(1), note: z.string().nullable() }),
  ),
});
export type StoryNames = z.infer<typeof StoryNames>;

/** flags@1 — the story's declared narrative flags (VS-13 hygiene manifest). */
export const StoryFlags = z.object({
  schema: z.literal("flags@1"),
  storyId: StoryId,
  flags: z
    .array(
      z.object({
        id: FlagId,
        label: z.string().min(1),
        setIn: ChapterId,
        /** Major flags select endings (VS-15 evaluates ending coverage per combination once endings exist). */
        major: z.boolean(),
      }),
    )
    .min(1),
});
export type StoryFlags = z.infer<typeof StoryFlags>;

/** Narrative-locked items — FULL item schema, same id space, same grading brain. */
export const StoryItems = z.object({
  schema: z.literal("story-items@1"),
  storyId: StoryId,
  vocabItems: z.array(VocabItem),
  grammarItems: z.array(GrammarItem),
});
export type StoryItems = z.infer<typeof StoryItems>;

// ---------------------------------------------------------------------------
// Listening — listening@1 (B3). Audio comprehension tasks. Defined INLINE here
// (not a sibling file) to avoid an ESM circular-eval hazard: a separate file
// importing these primitives while index re-exports it would hit them in TDZ.
//
// A ListeningItem is a SIBLING gradeable type, NOT a GrammarItem: a GrammarItem
// id must be `.gi.` and pass an id↔structureId coherence check, neither of which
// fits a listening item. It carries exactly the fields the grader + renderer read
// (format/prompt/answers/distractors/pairs/groups/gloss/difficulty/id), so it is
// cast to GrammarItem at the grade/render call (see /api/attempts, task-ui).
// Content method: the srdp-listening-comprehension skill, re-leveled to A1–A2.
// ---------------------------------------------------------------------------

/** `g2u03.li.<taskKey>.<fmt>.<NNN>` — sibling to ItemRef (which stays vocab/grammar only). */
export const ListeningRef = z
  .string()
  .regex(/^g[1-4]u\d{2}\.li\.[a-z0-9-]+\.(?:gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp)\.\d{3}$/);

/** A gradeable listening item — GrammarItem-shaped, minus id/structureId. */

/** Listening/reading strategy cue types (BLUEPRINT WS-D D-3): what the ear/eye
 *  must learn to catch. `gist`/`detail-fact` cover global items; the rest are
 *  the trainable micro-cues the clinics drill. */
export const CueType = z.enum([
  "number-time",
  "spelling",
  "signal-word",
  "list-intonation",
  "speaker-id",
  "place-prep",
  "gist",
  "detail-fact",
]);
export type CueTypeT = z.infer<typeof CueType>;

/** The strategy fields every NEW wave item carries (additive: the pilot era
 *  lacked them; validators enforce internal consistency when present and the
 *  runbook mandates them for wave authoring). `quote` must appear VERBATIM in
 *  the task transcript / reading passage (V-LC1) — the anti-hallucination lint. */
export const StrategyCue = z.object({
  type: CueType,
  quote: z.string().min(1),
  para: z.number().int().min(1).optional(),
});

/** Per-distractor lure metadata, parallel to `distractors` (V-LC3). */
export const DistractorMeta = z.object({
  whyDe: z.string().min(1),
  lure: z.enum(["echo", "near-number", "similar-name"]).optional(),
});

export const ListeningItem = z.object({
  id: ListeningRef,
  rev: z.number().int().min(1),
  difficulty: Difficulty,
  format: GrammarFormat,
  prompt: z.object({
    text: z.string().min(1),
    lang: z.enum(["en", "de"]),
    blanks: z.number().int().min(0).max(4),
  }),
  answers: z.array(TieredAnswer),
  direction: TranslationDirection.nullable(),
  distractors: z.array(z.string().min(1)),
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })),
  groups: z.array(z.object({ label: z.string().min(1), members: z.array(z.string().min(1)).min(2) })),
  gloss: z.array(Gloss),
  hintDe: z.string().min(1),
  hintEn: z.string().nullable(),
  explainDe: z.string().min(1),
  explainEn: z.string().nullable(),
  strict: z.boolean(),
  /** Strategy layer (wave-mandated; see StrategyCue). */
  cue: StrategyCue.optional(),
  phase: z.enum(["gist", "detail"]).optional(),
  /** The reusable move, du-form, <=12 words (word count enforced by V-LC4). */
  trickDe: z.string().min(1).optional(),
  distractorMeta: z.array(DistractorMeta).optional(),
});
export type ListeningItem = z.infer<typeof ListeningItem>;

/** One audio clip + its comprehension items. `transcript` is hidden (never rendered). */
export const ListeningTask = z
  .object({
    id: z.string().regex(/^g[1-4]u\d{2}\.lt\.[a-z0-9-]+$/),
    key: z.string().regex(/^[a-z0-9-]+$/),
    titleDe: z.string().min(1),
    audio: AudioRef,
    transcript: z.string().min(1),
    items: z.array(ListeningItem).min(1),
    /** Vorschau ritual: 3 German prediction chips shown BEFORE the first listen. */
    predictChips: z.array(z.string().min(1)).length(3).optional(),
  })
  .superRefine((t, ctx) => {
    const want = `.li.${t.key}.`;
    for (const [i, it] of t.items.entries()) {
      if (!it.id.includes(want)) {
        ctx.addIssue({ code: "custom", path: ["items", i, "id"], message: `item id must embed task key "${t.key}"` });
      }
    }
  });
export type ListeningTask = z.infer<typeof ListeningTask>;

export const ListeningFile = z
  .object({
    schema: z.literal("listening@1"),
    grade: GradeZ,
    unit: z.number().int().min(1).max(15),
    slug: UnitSlug,
    /** Re-leveling provenance (srdp-listening method, down to A1–A2). */
    level: z.enum(["A1", "A1+", "A2", "A2+"]),
    tasks: z.array(ListeningTask).min(1),
  })
  .superRefine((f, ctx) => {
    const seen = new Set<string>();
    for (const [i, t] of f.tasks.entries()) {
      if (!t.id.startsWith(`g${f.grade}u`)) {
        ctx.addIssue({ code: "custom", path: ["tasks", i, "id"], message: "grade prefix mismatch" });
      }
      for (const it of t.items) {
        if (seen.has(it.id)) {
          ctx.addIssue({ code: "custom", path: ["tasks", i], message: `duplicate item id ${it.id}` });
        }
        seen.add(it.id);
      }
    }
  });
export type ListeningFile = z.infer<typeof ListeningFile>;

// ---------------------------------------------------------------------------
// Mock tests — test@1 (B2). A test = ordered sections. REFERENCE sections point
// at existing vocab/grammar/listening ids (no content copy — story-schema rule).
// READING + WRITING sections embed test-only content. Reading items are a sibling
// gradeable schema like ListeningItem (own `.ri.` id, no structureId → cast to
// GrammarItem to grade). Writing is teacher-graded (not auto-scored), captured to
// the writing_submissions table. Content method: srdp-reading, re-leveled A1–A2.
// ---------------------------------------------------------------------------

/** `g2u03.ri.<key>.<fmt>.<NNN>` — a reading-comprehension item (sibling to ItemRef). */
export const TestRef = z
  .string()
  .regex(/^g[1-4]u\d{2}\.ri\.[a-z0-9-]+\.(?:gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp)\.\d{3}$/);

/** A gradeable reading item — same fields as ListeningItem, `.ri.` id, no structureId. */
export const ReadingItem = z.object({
  id: TestRef,
  rev: z.number().int().min(1),
  difficulty: Difficulty,
  format: GrammarFormat,
  prompt: z.object({
    text: z.string().min(1),
    lang: z.enum(["en", "de"]),
    blanks: z.number().int().min(0).max(4),
  }),
  answers: z.array(TieredAnswer),
  direction: TranslationDirection.nullable(),
  distractors: z.array(z.string().min(1)),
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })),
  groups: z.array(z.object({ label: z.string().min(1), members: z.array(z.string().min(1)).min(2) })),
  gloss: z.array(Gloss),
  hintDe: z.string().min(1),
  hintEn: z.string().nullable(),
  explainDe: z.string().min(1),
  explainEn: z.string().nullable(),
  strict: z.boolean(),
  /** Strategy layer (wave-mandated; see StrategyCue). */
  cue: StrategyCue.optional(),
  phase: z.enum(["gist", "detail"]).optional(),
  /** The reusable move, du-form, <=12 words (word count enforced by V-LC4). */
  trickDe: z.string().min(1).optional(),
  distractorMeta: z.array(DistractorMeta).optional(),
});
export type ReadingItem = z.infer<typeof ReadingItem>;

// ---------------------------------------------------------------------------
// Story comprehension — comprehension@1 (Track C, Phase 3). Per-story SCENE/plot
// checks ("Why is Max cleared?"), NOT abstract grammar. A ComprehensionItem is a
// SIBLING gradeable type (own `.ci.` id, no structureId) cast to GrammarItem to
// grade/render exactly like ListeningItem/ReadingItem. Lives at
// content/corpus/stories/<id>/comprehension.json; referenced by a taskSlot, placed
// right after the chapter's reveal (comprehension before production).
// ---------------------------------------------------------------------------

/** A gradeable comprehension item — same fields as ReadingItem, `.ci.` id. */
export const ComprehensionItem = z.object({
  id: StoryComprehensionRef,
  rev: z.number().int().min(1),
  difficulty: Difficulty,
  format: GrammarFormat,
  prompt: z.object({
    text: z.string().min(1),
    lang: z.enum(["en", "de"]),
    blanks: z.number().int().min(0).max(4),
  }),
  answers: z.array(TieredAnswer),
  direction: TranslationDirection.nullable(),
  distractors: z.array(z.string().min(1)),
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })),
  groups: z.array(z.object({ label: z.string().min(1), members: z.array(z.string().min(1)).min(2) })),
  gloss: z.array(Gloss),
  hintDe: z.string().min(1),
  hintEn: z.string().nullable(),
  explainDe: z.string().min(1),
  explainEn: z.string().nullable(),
  strict: z.boolean(),
});
export type ComprehensionItem = z.infer<typeof ComprehensionItem>;

export const StoryComprehensionFile = z
  .object({
    schema: z.literal("comprehension@1"),
    storyId: z.string().min(1),
    items: z.array(ComprehensionItem).min(1),
  })
  .superRefine((f, ctx) => {
    const seen = new Set<string>();
    for (const [i, it] of f.items.entries()) {
      if (seen.has(it.id)) ctx.addIssue({ code: "custom", path: ["items", i, "id"], message: `duplicate item id ${it.id}` });
      seen.add(it.id);
    }
  });
export type StoryComprehensionFile = z.infer<typeof StoryComprehensionFile>;

/** A section that REFERENCES already-graded items (vocab/grammar/listening). */
export const TestRefSection = z.object({
  kind: z.enum(["vocab", "grammar", "listening"]),
  titleDe: z.string().min(1),
  itemIds: z.array(z.union([ItemRef, ListeningRef])).min(1),
});

/** A reading section EMBEDS a passage + comprehension items. */
export const TestReadingSection = z.object({
  kind: z.literal("reading"),
  titleDe: z.string().min(1),
  passage: z.string().min(1),
  passageGloss: z.array(Gloss),
  items: z.array(ReadingItem).min(1),
});

/** A writing section EMBEDS a prompt; NOT auto-graded (captured for teacher review — B2b). */
export const TestWritingSection = z.object({
  kind: z.literal("writing"),
  titleDe: z.string().min(1),
  promptId: z.string().regex(/^g[1-4]u\d{2}\.ti\.wr\.\d{3}$/),
  promptDe: z.string().min(1),
  taskEn: z.string().min(1),
  minWords: z.number().int().min(10),
  maxWords: z.number().int().min(20),
  /** Reserved for B2b teacher grading; null for now. */
  rubric: z.array(z.object({ criterion: z.string().min(1), maxPoints: z.number().int().min(1) })).nullable(),
  /** Pre-submit self-check, du-form tap-questions (3-5). Never blocks submission. */
  checklistDe: z.array(z.string().min(1)).min(3).max(5).optional(),
  /** "So kann's aussehen" — unlocked AFTER first submission (anti-copy-priming).
   *  textEn must be fully in-bank at the unit (V-EX2: no gloss escape — a model
   *  answer the student can't fully read is not a model answer). */
  exemplar: z
    .object({
      textEn: z.string().min(1),
      calloutsDe: z.array(z.object({ quote: z.string().min(1), whyDe: z.string().min(1) })).min(1).max(3),
    })
    .optional(),
});

/** Plain union (the ref-section discriminator is a 3-value enum, not one literal). */
export const TestSection = z.union([TestRefSection, TestReadingSection, TestWritingSection]);
export type TestSection = z.infer<typeof TestSection>;

export const MockTest = z.object({
  id: z.string().regex(/^g[1-4]u\d{2}\.tt\.[a-z0-9-]+$/),
  titleDe: z.string().min(1),
  sections: z.array(TestSection).min(1),
});
export type MockTest = z.infer<typeof MockTest>;

export const TestFile = z.object({
  schema: z.literal("test@1"),
  grade: GradeZ,
  unit: z.number().int().min(1).max(15),
  slug: UnitSlug,
  level: z.enum(["A1", "A1+", "A2", "A2+"]),
  test: MockTest,
});
export type TestFile = z.infer<typeof TestFile>;

// ---------------------------------------------------------------------------
// Game layer — encounter@1 / map@1 / quest@1 (Track C G0). Schema only; the
// game runtime (game-core resolution, game-2d rendering) and the deferred
// runtime invariants are Track C, not the schema.
//
// THE KEYSTONE RULE (G0.1): these schemas reference item ids (via scope/ItemRef/
// TaskSlot) and NEVER embed graded item content. That is exactly what lets every
// grade reuse the ONE grading brain + /api/attempts unchanged. Difficulty / XP /
// distractors are DERIVED from the resolved item at runtime, never authored here.
// No enums (erasableSyntaxOnly) → string unions only.
// ---------------------------------------------------------------------------

/** Grade-scoped encounter id, e.g. "g1.enc.classroom-spawns". */
export const EncounterId = z.string().regex(/^g[1-4]\.enc\.[a-z0-9-]+$/);

/** Where a game pulls its tasks from. Mirrors getDueRefs scope (no "all" — a
 *  zone/encounter is always unit- or grade-scoped). Reused by quest clear. */
export const GameScope = z.union([
  z.object({ kind: z.literal("unit"), slug: UnitSlug }),
  z.object({ kind: z.literal("grade"), grade: GradeZ }),
]);
export type GameScope = z.infer<typeof GameScope>;

/** Mirror of engine's Tier — kept local so content-schema stays engine-free. */
export const GameTier = z.enum(["correct", "partial", "close", "wrong"]);
export type GameTier = z.infer<typeof GameTier>;

/**
 * encounter@1 — a RECIPE the runtime resolves, never baked items (so it stays
 * grade-agnostic and reuses getDueRefs). `source.kind:"due"` → getDueRefs;
 * empty queue → `fallback:"scope-random"` (Law 6: never a dead zone).
 * `formatAllow:null` = the battle-friendly default subset (mc / gap-fill /
 * anagram / context-picker), resolved by game-core.
 */
export const Encounter = z
  .object({
    schema: z.literal("encounter@1"),
    id: EncounterId,
    grade: GradeZ,
    source: z.object({
      kind: z.enum(["due", "scope-random"]),
      scope: GameScope,
      count: z.number().int().min(1).max(10),
    }),
    formatAllow: z.array(GrammarFormat).min(1).nullable(),
    fallback: z.literal("scope-random"),
  })
  .superRefine((e, ctx) => {
    if (!e.id.startsWith(`g${e.grade}.enc.`)) {
      ctx.addIssue({ code: "custom", path: ["id"], message: "encounter id grade prefix mismatch" });
    }
    // Keystone: an encounter never sources cross-grade.
    if (e.source.scope.kind === "grade" && e.source.scope.grade !== e.grade) {
      ctx.addIssue({ code: "custom", path: ["source", "scope", "grade"], message: "scope grade must equal encounter grade" });
    }
    if (e.source.scope.kind === "unit" && !e.source.scope.slug.startsWith(`g${e.grade}-u`)) {
      ctx.addIssue({ code: "custom", path: ["source", "scope", "slug"], message: "scope unit must be in the encounter's grade" });
    }
  });
export type Encounter = z.infer<typeof Encounter>;

/** Grade-scoped map / zone ids. */
export const MapId = z.string().regex(/^g[1-4]\.map\.[a-z0-9-]+$/);
export const ZoneId = z.string().regex(/^g[1-4]\.map\.[a-z0-9-]+\.z\d{2}$/);

/**
 * Render detail is DEFERRED — art-gen owns the atlas. The grid (width / height /
 * tileSize) is FROZEN: save positions are (zoneId, tileX, tileY) and must
 * survive art regeneration. `render:null` until a grade's art lands.
 */
export const ZoneRender = z.object({
  generator: z.string().min(1),
  seed: z.number().int(),
});
export type ZoneRender = z.infer<typeof ZoneRender>;

export const MapZone = z.object({
  id: ZoneId,
  /** Gate unit: zone N requires units ≤ N released (mirrors Chapter.unit). */
  unit: z.number().int().min(1).max(15),
  titleEn: z.string().min(1),
  titleDe: z.string().nullable(),
  width: z.number().int().min(1),
  height: z.number().int().min(1),
  tileSize: z.number().int().min(1),
  render: ZoneRender.nullable(),
});
export type MapZone = z.infer<typeof MapZone>;

/** map@1 — the addressable world skeleton (one zone per unit). */
export const GameMap = z
  .object({
    schema: z.literal("map@1"),
    id: MapId,
    grade: GradeZ,
    zones: z.array(MapZone).min(1),
  })
  .superRefine((m, ctx) => {
    if (!m.id.startsWith(`g${m.grade}.map.`)) {
      ctx.addIssue({ code: "custom", path: ["id"], message: "map id grade prefix mismatch" });
    }
    const ids = new Set<string>();
    for (const [i, zone] of m.zones.entries()) {
      if (!zone.id.startsWith(`${m.id}.z`)) {
        ctx.addIssue({ code: "custom", path: ["zones", i, "id"], message: "zone id outside map" });
      }
      if (ids.has(zone.id)) {
        ctx.addIssue({ code: "custom", path: ["zones", i, "id"], message: "duplicate zone id" });
      }
      ids.add(zone.id);
    }
  });
export type GameMap = z.infer<typeof GameMap>;

/** Grade-scoped quest id, e.g. "g1.q.lost-pages-ch01". */
export const QuestId = z.string().regex(/^g[1-4]\.q\.[a-z0-9-]+$/);

/**
 * quest@1 — the minimal zone-clear gate. Completion is DERIVED from the attempts
 * ledger (Law 2: never a stored "done" flag). `clear` is a discriminated `kind`
 * union → G2/G3/G4 add variants (doors / boss / branch trees) additively.
 */
export const QuestClear = z.union([
  z.object({
    kind: z.literal("encounters-cleared"),
    encounterIds: z.array(EncounterId).min(1),
    minTier: GameTier,
  }),
  z.object({ kind: z.literal("due-drained"), scope: GameScope }),
  z.object({ kind: z.literal("story-chapter"), chapterId: ChapterId }),
]);
export type QuestClear = z.infer<typeof QuestClear>;

export const Quest = z
  .object({
    schema: z.literal("quest@1"),
    id: QuestId,
    zoneId: ZoneId,
    clear: QuestClear,
  })
  .superRefine((q, ctx) => {
    const g = q.id.slice(1, 2); // "g{N}.q.…"
    if (!q.zoneId.startsWith(`g${g}.map.`)) {
      ctx.addIssue({ code: "custom", path: ["zoneId"], message: "zone grade must match quest grade" });
    }
    if (q.clear.kind === "story-chapter" && !q.clear.chapterId.startsWith(`g${g}.st.`)) {
      ctx.addIssue({ code: "custom", path: ["clear", "chapterId"], message: "chapter grade must match quest grade" });
    }
    if (q.clear.kind === "encounters-cleared") {
      for (const [i, eid] of q.clear.encounterIds.entries()) {
        if (!eid.startsWith(`g${g}.enc.`)) {
          ctx.addIssue({ code: "custom", path: ["clear", "encounterIds", i], message: "encounter grade must match quest grade" });
        }
      }
    }
  });
export type Quest = z.infer<typeof Quest>;
