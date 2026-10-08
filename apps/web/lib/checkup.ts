/**
 * C-1 · Checkup composition (server-only — content-loader uses node:fs).
 * The binding spec is docs/handover/21_checkup_presets.md: §4 GRADE_STRUCTURES
 * (verbatim, with the §8-② picture deferral applied as the active default),
 * §5 composition rules, §8 recorded decisions. The pure jsonb/scoring spine
 * lives in @domigo/db (packages/db/src/checkup.ts); this file only ASSEMBLES —
 * grading stays in @domigo/engine end to end (one brain).
 */
import { loadUnit, validateFullItem, type UnitContent } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { buildEngineInput, frameGrammarItem, type Frame } from "@domigo/content-pipeline/blind-solve";
import { gradeGrammar, gradeVocab, vocabAnswers, type Tier, type VocabPool } from "@domigo/engine";
import { vocabPrompt } from "@domigo/task-ui/vocab-pool";
import { firstLetterMaskText } from "../../../packages/task-ui/src/mask.ts";
import { parseItemRef } from "./itemRef.ts";
import {
  checkupSectionKind,
  checkupVocabPool,
  CHECKUP_TOTAL,
  type CheckupSectionConfig,
} from "@domigo/db";

// ── §5.2 grammar format allowlist (what appears on paper; no tactile/game formats) ──
export const CHECKUP_GRAMMAR_FORMATS: ReadonlySet<string> = new Set([
  "gap-fill",
  "multiple-choice",
  "context-picker",
  "translation",
  "transformation",
  "question-formation",
  "error-correction",
]);
// Excluded by the same rule: anagram, sentence-building, matching,
// matching-pairs, group-sort, free-form.

/** One preset section: the persisted config + compose-time hints. */
export interface CheckupPresetSection extends CheckupSectionConfig {
  /** grammar sampling preference (g3 §IV is transformation/rewrite-weighted) */
  prefer?: readonly string[];
  /** builder label note (rendered as a hint, never persisted) */
  note?: string;
}

/**
 * §4 GRADE_STRUCTURES — the per-grade /20 presets (DEFAULTS; the teacher edits
 * everything in the builder, the server enforces only Σ=20). Section order =
 * rendered order (one page). The picture-mc rows are DEFERRED per §8-②
 * ("real images preferred, no emojis; deferring is fine") — each grade's
 * fallback (+points to the named section) is applied as the ACTIVE default and
 * the picture row is kept below as the spec'd future shape.
 */
export const GRADE_STRUCTURES: Record<1 | 2 | 3 | 4, CheckupPresetSection[]> = {
  // Grade 1 — DERIVED preset, provisional until G1-CANON (§8-④).
  // Spec'd shape: A words-phrases 6 · B translations 5 · C grammar 6 · D picture-mc 3.
  // Deferral (§4): picture-mc 3 ⇒ +3 to translations.
  1: [
    { checkupKind: "words-phrases", points: 6, mask: "first-letter" },
    { checkupKind: "translations", points: 8, direction: "mixed", note: "En→De-leaning acceptable" },
    { checkupKind: "grammar", points: 6, note: "unit's taught point" },
    // { checkupKind: "picture-mc", points: 3 }, // pending §8-② (real image assets)
  ],
  // Grade 2 — modeled on the real 2A papers (e.g. U6: 3+5+6+6).
  // Spec'd shape: A picture-mc 3 · B words-phrases 5 · C grammar 6 · D translations 6.
  // Deferral (§4): picture-mc 3 ⇒ +3 to words-phrases.
  2: [
    // { checkupKind: "picture-mc", points: 3 }, // pending §8-② (real image assets)
    { checkupKind: "words-phrases", points: 8, mask: "first-letter" },
    { checkupKind: "grammar", points: 6, note: "unit's taught point" },
    { checkupKind: "translations", points: 6, direction: "mixed" },
  ],
  // Grade 3 — modeled on the real 3AW papers (gap-fill-heavy, two grammar blocks).
  3: [
    { checkupKind: "words-phrases", points: 8, mask: "first-letter", note: "multi-word masks appear here" },
    { checkupKind: "translations", points: 4, direction: "mixed" },
    { checkupKind: "grammar", points: 5, note: "unit's taught point" },
    {
      checkupKind: "grammar",
      points: 3,
      prefer: ["transformation", "error-correction", "question-formation"],
      note: "transformation/rewrite-weighted (type 9)",
    },
  ],
  // Grade 4 — modeled on the real 4B papers (five sections, definitions enter).
  4: [
    { checkupKind: "words-phrases", points: 6, mask: "first-letter" },
    { checkupKind: "translations", points: 4, direction: "mixed" },
    { checkupKind: "definitions", points: 4, note: "mask off (type 7)" },
    { checkupKind: "grammar", points: 4, note: "unit's taught point" },
    { checkupKind: "grammar", points: 2, note: "second point / linking words where the unit has one" },
  ],
};

/** A composed section, ready to drop into the assignment draft. */
export interface ComposedCheckupSection {
  position: number;
  kind: "vocab" | "grammar";
  itemIds: string[];
  sectionConfig: CheckupSectionConfig;
}

export type ComposeCheckupResult =
  | { ok: true; sections: ComposedCheckupSection[] }
  | { ok: false; errors: string[] };

export interface ComposeCheckupOpts {
  /** active reserved item ids for the class — EXCLUDED (§5.1 / J-1: the mock
   *  vault stays fresh; reserve semantics are ITEM-level, §8 addendum). */
  reservedIds?: ReadonlySet<string>;
  /** override the grade preset (teacher-edited points) — defaults to §4 */
  presets?: CheckupPresetSection[];
}

/** FNV-1a/32 — the house deterministic hash (task-ui vocab-pool.ts pattern).
 *  No Math.random, no Date: the same seed composes identically forever. */
function fnv(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** ≥1 authored full-tier answer — the pool is actually gradeable (§5.1). */
function hasFull(answers: ReadonlyArray<{ tier: string }>): boolean {
  return answers.some((a) => a.tier === "full");
}

/** §5.1 pool-answer availability per checkup kind (schema guarantees these are
 *  non-empty for approved items; checked anyway — compose must never assume). */
function vocabEligible(item: VocabItem, cfg: CheckupSectionConfig): boolean {
  switch (cfg.checkupKind) {
    case "definitions":
      return hasFull(item.dAnswers);
    case "translations": {
      const dir = cfg.direction ?? "mixed";
      if (dir === "deToEn") return hasFull(item.translation.deToEn);
      if (dir === "enToDe") return hasFull(item.translation.enToDe);
      return hasFull(item.translation.deToEn) && hasFull(item.translation.enToDe);
    }
    default:
      // words-phrases = the carrier gap-fill
      return hasFull(item.sAnswers);
  }
}

/**
 * §5 · Compose one checkup from a unit, deterministically.
 *
 * Eligibility, in order: unit items only (level-gate holds by construction) →
 * reserved EXCLUDED → per-kind format/pool filters → not already picked by an
 * earlier section (one item = one point, never reused on the same paper).
 *
 * Sampling: items ranked by FNV-1a over `seed|itemId` (stable hash order).
 * Least-seen-in-practice preference is deliberately SKIPPED in v1: it needs
 * per-class attempt aggregates (a DB read), and compose stays pure/DB-free so
 * it verifies offline; freshness pressure is low because checkups draw from
 * the whole unit with the reserve excluded. Revisit with Group A/B (v1.1, §9).
 *
 * Validation (hard-fail): Σ points = CHECKUP_TOTAL and every section fillable —
 * a shortfall returns ok:false LISTING the missing counts per section (§5.4,
 * "never silently thinner").
 */
export function composeCheckup(
  unitSlug: string,
  grade: 1 | 2 | 3 | 4,
  seed: string,
  opts: ComposeCheckupOpts = {},
): ComposeCheckupResult {
  const presets = opts.presets ?? GRADE_STRUCTURES[grade];
  const reserved = opts.reservedIds ?? new Set<string>();
  const errors: string[] = [];

  const total = presets.reduce((s, p) => s + p.points, 0);
  if (total !== CHECKUP_TOTAL) {
    errors.push(`Preset points sum to ${total}, not ${CHECKUP_TOTAL}.`);
  }
  if (presets.some((p) => p.checkupKind === "picture-mc")) {
    errors.push("picture-mc sections are deferred in v1 (no image assets yet).");
  }

  let unit: ReturnType<typeof loadUnit>;
  try {
    unit = loadUnit(unitSlug);
  } catch {
    return { ok: false, errors: [`Unit ${unitSlug} could not be loaded.`] };
  }

  const rank = (id: string) => fnv(`${seed}|${id}`);
  const byHash = (a: { id: string }, b: { id: string }) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id);

  const used = new Set<string>();
  const sections: ComposedCheckupSection[] = [];

  for (const [i, preset] of presets.entries()) {
    const where = `Section ${i + 1} (${preset.checkupKind})`;
    const cfg: CheckupSectionConfig = { checkupKind: preset.checkupKind, points: preset.points };
    if (preset.mask === "first-letter") cfg.mask = "first-letter";
    if (preset.direction) cfg.direction = preset.direction;

    let picked: string[];
    if (preset.checkupKind === "grammar") {
      const eligible = unit.grammar.filter(
        (g: GrammarItem) => CHECKUP_GRAMMAR_FORMATS.has(g.format) && !reserved.has(g.id) && !used.has(g.id),
      );
      // Preference tiers (g3 §IV): preferred formats first, each tier in hash order.
      const preferred = new Set(preset.prefer ?? []);
      const tierA = eligible.filter((g) => preferred.has(g.format)).sort(byHash);
      const tierB = eligible.filter((g) => !preferred.has(g.format)).sort(byHash);
      picked = [...tierA, ...tierB].slice(0, preset.points).map((g) => g.id);
    } else {
      const eligible = unit.vocab
        .filter((v: VocabItem) => !reserved.has(v.id) && !used.has(v.id) && vocabEligible(v, cfg))
        .sort(byHash);
      picked = eligible.slice(0, preset.points).map((v) => v.id);
    }

    if (picked.length < preset.points) {
      errors.push(`${where}: needs ${preset.points} item(s), only ${picked.length} eligible in ${unitSlug}.`);
    }
    for (const id of picked) used.add(id);
    sections.push({ position: i, kind: checkupSectionKind(preset.checkupKind), itemIds: picked, sectionConfig: cfg });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, sections };
}

/** The pool each item of a composed/persisted section grades against, in
 *  section order — shared by the runner page (render) and any verify path. */
export function sectionItemPools(cfg: CheckupSectionConfig, itemCount: number) {
  return Array.from({ length: itemCount }, (_, i) => checkupVocabPool(cfg, i, itemCount));
}

/** A server-resolved task, before any paid solve. Only `frame` may be sent to
 * the blind solver; `item` includes keys and stays on the grading side. */
export interface PreparedCheckupTask {
  itemId: string;
  unitSlug: string;
  kind: "vocab" | "grammar";
  revision: number;
  item: VocabItem | GrammarItem;
  frame: Frame;
  pool: VocabPool | null;
  sectionPosition: number;
  itemPosition: number;
}

export type PrepareCheckupResult =
  | { ok: true; tasks: PreparedCheckupTask[] }
  | { ok: false; errors: string[] };

export type CheckupTaskUnits = ReadonlyMap<string, Pick<UnitContent, "vocab" | "grammar">>;

/** Same question, input shape and answer pool as CheckupRunner. A mask changes
 * the visible prompt only; it never replaces the full answer when grading. */
export function gradeCheckupCandidate(task: PreparedCheckupTask, answer: string): Tier {
  return task.kind === "vocab"
    ? gradeVocab(task.item as VocabItem, answer, task.pool ?? "carrier").tier
    : gradeGrammar(task.item as GrammarItem, buildEngineInput(task.frame, answer)).tier;
}

/** The assignment answer endpoint still grades canon. Until that separate
 * contract changes, reject displayed replacements whose grading differs.
 * Prose-only changes are safe except where the engine's prompt-echo guard
 * uses the prompt itself to distinguish a correction from copying. */
export function checkupGradingCompatible(canonical: VocabItem | GrammarItem, displayed: VocabItem | GrammarItem, kind: "vocab" | "grammar"): boolean {
  const shape = (item: VocabItem | GrammarItem) => {
    if (kind === "vocab") {
      const vocab = item as VocabItem;
      return [vocab.sAnswers, vocab.dAnswers, vocab.translation.deToEn, vocab.translation.enToDe];
    }
    const grammar = item as GrammarItem;
    const echo = ["translation", "transformation", "error-correction", "question-formation"].includes(grammar.format);
    return [grammar.format, grammar.answers, grammar.strict === true, grammar.direction, grammar.pairs, grammar.groups, echo ? grammar.prompt.text : null];
  };
  return JSON.stringify(shape(canonical)) === JSON.stringify(shape(displayed));
}

/** Free key-solvability proof, also exercised with deliberately broken keys
 * in tests. Every authored full answer must round-trip in this exact pool. */
export function checkCheckupTaskKeys(task: PreparedCheckupTask): string[] {
  const answers = task.kind === "vocab" ? vocabAnswers(task.item as VocabItem, task.pool ?? "carrier") : (task.item as GrammarItem).answers;
  const fullAnswers = answers.filter((answer) => answer.tier === "full");
  if (!fullAnswers.length || fullAnswers.some((answer) => gradeCheckupCandidate(task, answer.text) !== "correct")) {
    return [`${task.itemId}: Der Lösungsschlüssel wird im angezeigten Antwortformat nicht vollständig als richtig bewertet. Aufgabe tauschen oder korrigieren.`];
  }
  return [];
}

function frameCheckupVocab(item: VocabItem, pool: VocabPool, masked: boolean): Frame {
  // Reuse the renderer's leak-safe pool selection and fixed-width mask; the
  // definition/translation pools must never inherit the carrier's glosses.
  const ask = vocabPrompt(item, pool);
  const full = vocabAnswers(item, pool).find((answer) => answer.tier === "full");
  const mask = masked ? firstLetterMaskText(full?.text ?? "") : "";
  const blank = /_{2,}/.exec(ask.text);
  const question = mask && blank
    ? ask.text.slice(0, blank.index) + mask + ask.text.slice(blank.index + blank[0].length)
    : ask.text;
  return {
    itemId: item.id,
    kind: "vocab",
    format: pool === "carrier" ? "vocab-carrier" : pool === "definition" ? "vocab-definition" : "translation",
    lines: [
      ...(ask.context === null ? [] : [ask.context]),
      ...(ask.instruction ? [ask.instruction] : []),
      question,
      ...(mask && !blank ? [mask] : []),
    ],
    input: { kind: "text", blanks: 1 },
    // CheckupRunner hides hints. Gloss rows, where present, start collapsed:
    // solve the student's first unassisted view, never pre-reveal word help.
    glosses: [],
    direction: pool === "deToEn" || pool === "enToDe" ? pool : null,
    structure: null,
  };
}

/** §5.4's deterministic gate, in the exact section order and answer pools the
 * child receives. Runtime supplies the same published overlay map as the
 * assignment page; offline callers default to the canonical loader. A supplied
 * map is authoritative: missing units fail closed instead of falling back to
 * different bytes. No DB, account or model call occurs in this function. */
export function prepareCheckupTasks(
  sections: readonly ComposedCheckupSection[],
  units?: CheckupTaskUnits,
): PrepareCheckupResult {
  const tasks: PreparedCheckupTask[] = [];
  const errors: string[] = [];
  const loaded = new Map<string, Pick<UnitContent, "vocab" | "grammar">>();
  for (const section of sections) {
    if (section.sectionConfig.checkupKind === "picture-mc" || checkupSectionKind(section.sectionConfig.checkupKind) !== section.kind) {
      errors.push(`Teil ${section.position + 1}: Aufgabenart und Checkup-Abschnitt passen nicht zusammen.`);
      continue;
    }
    for (const [itemPosition, itemId] of section.itemIds.entries()) {
      const ref = parseItemRef(itemId);
      if (!ref || ref.kind !== section.kind) {
        errors.push(`${itemId}: Die Aufgabenkennung passt nicht zum Abschnitt.`);
        continue;
      }
      let unit = units?.get(ref.unitSlug) ?? loaded.get(ref.unitSlug);
      if (!unit && units === undefined) {
        try {
          unit = loadUnit(ref.unitSlug);
          loaded.set(ref.unitSlug, unit);
        } catch { /* named failure below, never silently skip an item */ }
      }
      const item = section.kind === "vocab"
        ? unit?.vocab.find((candidate) => candidate.id === itemId)
        : unit?.grammar.find((candidate) => candidate.id === itemId);
      if (!item) {
        errors.push(`${itemId}: Die Aufgabe ist in ${ref.unitSlug} nicht verfügbar.`);
        continue;
      }
      const valid = validateFullItem(section.kind, item);
      if (!valid.ok) {
        errors.push(`${itemId}: ${valid.errors.join(" · ")}`);
        continue;
      }
      if (units !== undefined) {
        let canonicalUnit = loaded.get(ref.unitSlug);
        if (!canonicalUnit) {
          try {
            canonicalUnit = loadUnit(ref.unitSlug);
            loaded.set(ref.unitSlug, canonicalUnit);
          } catch { /* unavailable canon cannot prove grading equivalence */ }
        }
        const canonical = section.kind === "vocab"
          ? canonicalUnit?.vocab.find((candidate) => candidate.id === itemId)
          : canonicalUnit?.grammar.find((candidate) => candidate.id === itemId);
        if (!canonical || !checkupGradingCompatible(canonical, item, section.kind)) {
          errors.push(`${itemId}: Angezeigte Aufgabe und gespeicherte Bewertung stimmen nicht überein. Aufgabe tauschen oder korrigieren.`);
          continue;
        }
      }
      const pool = section.kind === "vocab" ? checkupVocabPool(section.sectionConfig, itemPosition, section.itemIds.length) : null;
      const framed = section.kind === "vocab"
        ? frameCheckupVocab(item as VocabItem, pool!, section.sectionConfig.mask === "first-letter")
        : CHECKUP_GRAMMAR_FORMATS.has((item as GrammarItem).format) ? frameGrammarItem(item as GrammarItem) : null;
      if (!framed) {
        errors.push(`${itemId}: Dieses Aufgabenformat kann im Checkup nicht blind geprüft werden.`);
        continue;
      }
      // Practice's structure context is not displayed on the paper runner.
      // Glosses are collapsed and hints/explanations unavailable before submit.
      const frame = { ...framed, glosses: [], structure: null };
      const task: PreparedCheckupTask = {
        itemId, unitSlug: ref.unitSlug, kind: section.kind, revision: item.rev,
        item, frame, pool, sectionPosition: section.position, itemPosition,
      };
      const keyErrors = checkCheckupTaskKeys(task);
      if (keyErrors.length) {
        errors.push(...keyErrors);
        continue;
      }
      tasks.push(task);
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, tasks };
}
