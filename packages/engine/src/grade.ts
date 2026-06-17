/**
 * Per-format grader — ports v1's grading rules (the work this engine's index.ts
 * header reserved for "P3"). Pure: no React/Next/DOM. Returns a 4-tier outcome
 * for one attempt; XP/combo live in index.ts.
 *
 * Rules (docs/handover/07_task_formats.md + 02_architecture_and_data_model.md):
 *   - canonicalize (lowercase, strip punctuation, collapse spaces; keep umlauts + "|").
 *   - close = Levenshtein within budget min(2, max(len>=4?2:1, floor(len*ratio)))
 *     — ratio 0.15 grammar / 0.20 vocab.
 *   - text inputs: exact(full) -> correct · exact(partial) -> partial · close -> close ·
 *     partial-match fallback (>=2 shared words, >=40% of the answer's words) -> partial.
 *   - button/MC + context-picker: exact-only (no close, no partial).
 *   - sentence-building: exact + close, NO partial.
 *   - anagram: exact + close (+ partial tier), no partial-match fallback.
 *   - matching / matching-pairs / group-sort: all-or-nothing.
 *   - multi-blank answers are pipe-joined ("did | go"); graded per blank.
 */
import type { GrammarItem, TieredAnswer, VocabItem } from "@domigo/content-schema";
import type { Tier } from "./index.ts";

const GRAMMAR_RATIO = 0.15;
const VOCAB_RATIO = 0.2;

/** Lowercase, NFC, strip punctuation, collapse whitespace. Keeps umlauts/ß and "|". */
export function canonical(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/['’`.,!?;:"“”()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
    }
    prev = curr;
  }
  return prev[b.length]!;
}

function closeBudget(len: number, ratio: number): number {
  return Math.min(2, Math.max(len >= 4 ? 2 : 1, Math.floor(len * ratio)));
}

/** Split a (possibly multi-blank, pipe-joined) string into canonical parts. */
function parts(s: string): string[] {
  return s.split("|").map(canonical);
}

function exactMatch(input: string, answer: string): boolean {
  const a = parts(answer);
  const i = parts(input);
  return a.length === i.length && a.every((p, k) => p === i[k]);
}

function closeMatch(input: string, answer: string, ratio: number): boolean {
  const a = parts(answer);
  const i = parts(input);
  if (a.length !== i.length) return false;
  return a.every((p, k) => {
    const d = levenshtein(i[k]!, p);
    return d > 0 ? d <= closeBudget(p.length, ratio) : true;
  });
}

/** v1 partial-match fallback: input shares >=2 words and >=40% of the answer's words. */
function partialContains(input: string, answer: string): boolean {
  const iWords = new Set(canonical(input).split(" ").filter(Boolean));
  const aWords = canonical(answer.replace(/\|/g, " ")).split(" ").filter(Boolean);
  if (aWords.length < 2) return false;
  const common = aWords.filter((w) => iWords.has(w));
  return common.length >= 2 && common.length / aWords.length >= 0.4;
}

interface TextOpts {
  ratio: number;
  partialTier: boolean;
  partialFallback: boolean;
}

function gradeText(input: string, answers: TieredAnswer[], opts: TextOpts): Tier {
  if (canonical(input) === "") return "wrong";
  const fulls = answers.filter((a) => a.tier === "full");
  const partials = answers.filter((a) => a.tier === "partial");
  if (fulls.some((a) => exactMatch(input, a.text))) return "correct";
  if (opts.partialTier && partials.some((a) => exactMatch(input, a.text))) return "partial";
  if (fulls.some((a) => closeMatch(input, a.text, opts.ratio))) return "close";
  if (opts.partialFallback && fulls.some((a) => partialContains(input, a.text))) return "partial";
  return "wrong";
}

function gradeChoice(selected: string, answers: TieredAnswer[]): Tier {
  const c = canonical(selected);
  return answers.some((a) => a.tier === "full" && canonical(a.text) === c) ? "correct" : "wrong";
}

/** matching / matching-pairs: a left->right map; all pairs correct, all-or-nothing. */
function gradeMatching(map: Record<string, string>, pairs: GrammarItem["pairs"]): Tier {
  if (pairs.length === 0) return "wrong";
  if (Object.keys(map).length !== pairs.length) return "wrong";
  return pairs.every((p) => canonical(map[p.left] ?? "") === canonical(p.right)) ? "correct" : "wrong";
}

/** group-sort: a member->label map; every member in its group, all-or-nothing. */
function gradeGroupSort(map: Record<string, string>, groups: GrammarItem["groups"]): Tier {
  const total = groups.reduce((n, g) => n + g.members.length, 0);
  if (total === 0 || Object.keys(map).length !== total) return "wrong";
  return groups.every((g) => g.members.every((m) => canonical(map[m] ?? "") === canonical(g.label)))
    ? "correct"
    : "wrong";
}

/** The user's answer for a grammar item, shaped per render mode. */
export type GrammarInput =
  | { kind: "text"; value: string }
  | { kind: "choice"; value: string }
  | { kind: "matching"; value: Record<string, string> }
  | { kind: "groupSort"; value: Record<string, string> };

export interface GradeResult {
  tier: Tier;
}

const PARTIAL_FALLBACK_FORMATS = new Set([
  "gap-fill",
  "translation",
  "transformation",
  "error-correction",
  "question-formation",
  "free-form",
]);

export function gradeGrammar(item: GrammarItem, input: GrammarInput): GradeResult {
  switch (item.format) {
    case "multiple-choice":
    case "context-picker":
      return { tier: input.kind === "choice" ? gradeChoice(input.value, item.answers) : "wrong" };
    case "matching":
    case "matching-pairs":
      return { tier: input.kind === "matching" ? gradeMatching(input.value, item.pairs) : "wrong" };
    case "group-sort":
      return { tier: input.kind === "groupSort" ? gradeGroupSort(input.value, item.groups) : "wrong" };
    case "sentence-building":
      return {
        tier:
          input.kind === "text"
            ? gradeText(input.value, item.answers, {
                ratio: GRAMMAR_RATIO,
                partialTier: false,
                partialFallback: false,
              })
            : "wrong",
      };
    case "anagram":
      return {
        tier:
          input.kind === "text"
            ? gradeText(input.value, item.answers, {
                ratio: GRAMMAR_RATIO,
                partialTier: true,
                partialFallback: false,
              })
            : "wrong",
      };
    default:
      return {
        tier:
          input.kind === "text"
            ? gradeText(input.value, item.answers, {
                ratio: GRAMMAR_RATIO,
                partialTier: true,
                partialFallback: PARTIAL_FALLBACK_FORMATS.has(item.format),
              })
            : "wrong",
      };
  }
}

/** Vocab trainer: the user fills the carrier blank; graded vs sAnswers. */
export function gradeVocab(item: VocabItem, input: string): GradeResult {
  return {
    tier: gradeText(input, item.sAnswers, {
      ratio: VOCAB_RATIO,
      partialTier: true,
      partialFallback: true,
    }),
  };
}
