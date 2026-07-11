/**
 * E-4 blind-solve core (A-4) — pure framing + triage for the harness at
 * scripts/audit/blind-solve.ts.
 *
 * The doctrine (docs/handover/17_curation_standard.md §"blind-solve"): a model
 * sees an item exactly as the STUDENT sees it — never the keys — answers it,
 * and every candidate is graded through the real engine. Divergence between a
 * competent solver and the authored answer set is the defect signal machine
 * validators cannot produce.
 *
 * This module is deliberately dependency-free (schema types only): no LLM, no
 * engine, no I/O. That keeps the frame builder and triage rules testable under
 * the pipeline's `node --test` suite; the CLI owns the SDK + engine imports.
 *
 * Frame fidelity contract (mirrors packages/task-ui/src/index.tsx):
 *   - vocab (carrier pool): the student sees `item.d` (small definition line),
 *     `item.s` (carrier with one ___ blank), the tap-reveal gloss row, and ONE
 *     text box. hintDe is deliberately EXCLUDED — the harness measures the
 *     first honest attempt, and hints exist to rescue wrong ones.
 *   - grammar text formats: the student sees `item.prompt.text` and N text
 *     boxes, where N = max(1, firstFullAnswer.split("|").length) — the same
 *     `blankCount` task-ui derives. No instruction text exists in the UI;
 *     the structure key (from structureId) stands in for the classroom
 *     context a real student has (the practice set is per-structure).
 *   - multiple-choice / context-picker: the option chips, in the EXACT order
 *     task-ui renders them (`useShuffled` seeded by item.id — ported below).
 *   - matching / matching-pairs / group-sort / sentence-building / anagram are
 *     out of scope in v1 (their affordances are built from the answer itself —
 *     tiles/chips — so a text frame cannot mirror them without leaking); the
 *     CLI counts them as skipped.
 */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";

// ---------------------------------------------------------------------------
// format scope
// ---------------------------------------------------------------------------

export const SOLVABLE_TEXT_FORMATS = new Set([
  "gap-fill",
  "translation",
  "transformation",
  "error-correction",
  "question-formation",
  "free-form",
]);

export const SOLVABLE_CHOICE_FORMATS = new Set(["multiple-choice", "context-picker"]);

export const SKIPPED_FORMATS = new Set([
  "matching",
  "matching-pairs",
  "group-sort",
  "sentence-building",
  "anagram",
]);

// ---------------------------------------------------------------------------
// task-ui shuffle port — choice frames must show the option order students see
// ---------------------------------------------------------------------------

/** FNV-1a — verbatim port of task-ui's `hash` (index.tsx). */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic seeded shuffle — verbatim port of task-ui's `useShuffled` body. */
export function shuffledOptions<T>(arr: T[], seed: string): T[] {
  let state = hash(seed) || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ---------------------------------------------------------------------------
// frames
// ---------------------------------------------------------------------------

export interface Frame {
  itemId: string;
  kind: "vocab" | "grammar";
  /** "vocab-carrier" or the grammar format. */
  format: string;
  /** What the student reads, in render order. */
  lines: string[];
  input:
    | { kind: "text"; blanks: number }
    | { kind: "choice"; options: string[] };
  /** Tap-reveal word help ("word = de"), visible on demand in the UI. */
  glosses: string[];
  /** translation only — the classroom knows the target language. */
  direction: "deToEn" | "enToDe" | null;
  /** grammar only — structure key from structureId (the practice-set context). */
  structure: string | null;
}

function glossLines(item: { gloss: Array<{ word: string; de: string }> }): string[] {
  return item.gloss.map((g) => `${g.word} = ${g.de}`);
}

export function frameVocabItem(item: VocabItem): Frame {
  return {
    itemId: item.id,
    kind: "vocab",
    format: "vocab-carrier",
    lines: [item.d, item.s],
    input: { kind: "text", blanks: 1 },
    glosses: glossLines(item),
    direction: null,
    structure: null,
  };
}

/** Structure key out of "g2u03.s.past-simple" → "past-simple". */
function structureKey(structureId: string): string | null {
  const m = /^g[1-4]u\d{2}\.s\.([a-z0-9-]+)$/.exec(structureId);
  return m?.[1] ?? null;
}

/** Returns null for out-of-scope formats (the CLI counts them as skipped). */
export function frameGrammarItem(item: GrammarItem): Frame | null {
  const fulls = item.answers.filter((a) => a.tier === "full").map((a) => a.text);
  if (SOLVABLE_CHOICE_FORMATS.has(item.format)) {
    // task-ui: useShuffled([...new Set([...fullAnswers, ...distractors])], item.id)
    const options = shuffledOptions([...new Set([...fulls, ...item.distractors])], item.id);
    return {
      itemId: item.id,
      kind: "grammar",
      format: item.format,
      lines: [item.prompt.text],
      input: { kind: "choice", options },
      glosses: glossLines(item),
      direction: item.direction,
      structure: structureKey(item.structureId),
    };
  }
  if (SOLVABLE_TEXT_FORMATS.has(item.format)) {
    // task-ui blankCount: from the first full answer's pipe shape, min 1.
    const blanks = Math.max(1, (fulls[0] ?? "").split("|").length);
    return {
      itemId: item.id,
      kind: "grammar",
      format: item.format,
      lines: [item.prompt.text],
      input: { kind: "text", blanks },
      glosses: glossLines(item),
      direction: item.direction,
      structure: structureKey(item.structureId),
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// prompt assembly (part of the frame contract — hashed for the cache)
// ---------------------------------------------------------------------------

/** Task description a student would know from the classroom — never the answer. */
export function taskDescription(frame: Frame): string {
  switch (frame.format) {
    case "vocab-carrier":
      return "Fill in the missing word in the sentence. The first line describes the word you need.";
    case "gap-fill":
      return "Fill in the blank(s) marked ___.";
    case "translation":
      return frame.direction === "enToDe"
        ? "Translate the sentence into German."
        : "Translate the sentence into English.";
    case "transformation":
      return "Rewrite the sentence using the grammar focus given.";
    case "error-correction":
      return "The sentence contains a mistake. Write the corrected sentence.";
    case "question-formation":
      return "Form the question the exercise asks for, using the grammar focus given.";
    case "free-form":
      return "Write your answer in English.";
    case "multiple-choice":
    case "context-picker":
      return "Choose the correct option.";
    default:
      return "Solve the exercise.";
  }
}

export function buildSolvePrompt(frame: Frame): string {
  const parts: string[] = [`Exercise type: ${frame.format} — ${taskDescription(frame)}`];
  if (frame.structure !== null) parts.push(`Grammar focus: ${frame.structure}`);
  parts.push("", ...frame.lines);
  if (frame.input.kind === "choice") {
    parts.push("", "Options:", ...frame.input.options.map((o) => `- ${o}`));
    parts.push("", "Answer with the exact text of ONE option.");
  } else {
    parts.push(
      "",
      frame.input.blanks > 1
        ? `Answer boxes: ${frame.input.blanks} — join the blank fills with " | " in order.`
        : "One answer box.",
    );
  }
  if (frame.glosses.length > 0) parts.push("", "Word help:", ...frame.glosses.map((g) => `- ${g}`));
  return parts.join("\n");
}

/** The engine input shape a candidate answer maps to for this frame. */
export function buildEngineInput(
  frame: Frame,
  answer: string,
): { kind: "text"; value: string } | { kind: "choice"; value: string } {
  return frame.input.kind === "choice"
    ? { kind: "choice", value: answer }
    : { kind: "text", value: answer };
}

// ---------------------------------------------------------------------------
// canned solver (--no-llm) — the key-solvability invariant
// ---------------------------------------------------------------------------

/**
 * Dry-run candidates: EVERY authored full answer. Feeding each key back
 * through the frame's input shape and the real engine MUST grade "correct" —
 * anything else is a key defect (unreachable answer), the same defect class
 * E-2's R4 catches statically. This makes --no-llm a real audit, not just
 * plumbing proof.
 */
export function cannedCandidates(fullAnswers: string[]): SolveCandidate[] {
  return fullAnswers.map((answer) => ({ answer, confidence: 0.99 }));
}

// ---------------------------------------------------------------------------
// triage
// ---------------------------------------------------------------------------

export interface SolveCandidate {
  answer: string;
  confidence: number;
}

export type Tier = "correct" | "partial" | "close" | "wrong";

export interface GradedCandidate extends SolveCandidate {
  tier: Tier;
}

export interface TriageResult {
  /** class (a): the solver's confident best answer grades wrong → missing variant
   *  (text formats) or too-plausible distractor / wrong key (choice formats). */
  missingVariant: boolean;
  /** class (b): single authored full answer, but ≥2 confident, distinct candidates
   *  split correct/wrong → the carrier admits more than one defensible answer. */
  ambiguousCarrier: boolean;
}

/** Loose canonical form for candidate DISTINCTNESS only (not grading). */
function canon(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/['’`.,!?;:"“”()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const CONFIDENT = 0.75;
export const DEFENSIBLE = 0.6;

export function triage(candidates: GradedCandidate[], fullAnswerCount: number): TriageResult {
  const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);
  const top = sorted[0];
  const missingVariant = top !== undefined && top.confidence >= CONFIDENT && top.tier === "wrong";

  let ambiguousCarrier = false;
  if (fullAnswerCount === 1) {
    const defensible: GradedCandidate[] = [];
    const seen = new Set<string>();
    for (const c of sorted) {
      if (c.confidence < DEFENSIBLE) continue;
      const k = canon(c.answer);
      if (k === "" || seen.has(k)) continue;
      seen.add(k);
      defensible.push(c);
    }
    ambiguousCarrier =
      defensible.length >= 2 &&
      defensible.filter((c) => c.tier === "correct").length === 1 &&
      defensible.some((c) => c.tier === "wrong");
  }
  return { missingVariant, ambiguousCarrier };
}
