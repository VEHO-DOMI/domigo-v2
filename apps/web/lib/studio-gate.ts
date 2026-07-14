/**
 * S-2 · the Studio publish PRE-GATE — the free, deterministic half of the
 * publish hard block on teacher-created/replaced tasks. No API key, no DB, no
 * secrets (so it is unit-testable under node --test, and could even run
 * client-side for instant editor feedback). The live blind-solve half lives in
 * ./studio-solve.ts (server-only, needs ANTHROPIC_API_KEY).
 *
 * Koki's directive: "publishable only after an AI has solved the new task
 * correctly through the real grading engine (a hard block)." Two layers,
 * cheapest first (fable-method §2; doc 21 §5.5 two-layer gate):
 *
 *   preGate (here) —
 *     1. ZOD: the whole item passes @domigo/content-schema (ids, answer sets,
 *        blank counts, distractor rules, definition-leak). Structural soundness.
 *     2. FRAMEABILITY: the item can be shown to a blind solver as a student
 *        sees it. Grammar formats whose affordances are BUILT FROM the answer
 *        (matching / anagram / group-sort / sentence-building / matching-pairs)
 *        cannot be text-framed without leaking the key — UN-GATEABLE, so they
 *        cannot publish. Vocab always frames.
 *     3. KEY-SOLVABILITY: every authored full answer, fed back through the
 *        frame's input shape and the REAL engine, MUST grade "correct". A key
 *        that doesn't is an unreachable answer — the DomiGo v1 defect class
 *        (nine repair PRs). Caught here for FREE, before any API spend. An item
 *        with nothing keyed correct (no full answer) also fails here.
 *
 *   solveGate (./studio-solve.ts) — a capable model solves the framed item
 *     blind and it publishes IFF the answer it would submit grades "correct".
 *
 * One brain: the frame builder + engine here are the identical modules the
 * offline audit (scripts/audit/blind-solve.ts) uses — never a second projector
 * of "what the student sees". `gradeAnswer` is exported so the live solver
 * grades through the exact same mapping.
 */
import {
  buildEngineInput,
  cannedCandidates,
  frameGrammarItem,
  frameVocabItem,
  type Frame,
  type Tier,
} from "@domigo/content-pipeline/blind-solve";
import { validateFullItem, type ItemKind } from "@domigo/content-loader";
import { gradeGrammar, gradeVocab } from "@domigo/engine";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";

// ---------------------------------------------------------------------------
// the vocab/grammar grade mapping (identical to the audit CLI's gradeCandidate)
// ---------------------------------------------------------------------------

/** Grade one candidate answer through the frame's input shape and the real
 *  engine — the SINGLE grade path shared by the pre-gate and the live solver. */
export function gradeAnswer(kind: ItemKind, item: VocabItem | GrammarItem, frame: Frame, answer: string): Tier {
  if (kind === "vocab") return gradeVocab(item as VocabItem, answer).tier;
  return gradeGrammar(item as GrammarItem, buildEngineInput(frame, answer)).tier;
}

/** The authored full answers for the frame's input shape — carrier `sAnswers`
 *  for vocab, `answers` for grammar (mirrors the audit's `collectEntries`). */
export function fullAnswersFor(kind: ItemKind, item: VocabItem | GrammarItem): string[] {
  if (kind === "vocab") return (item as VocabItem).sAnswers.filter((a) => a.tier === "full").map((a) => a.text);
  return (item as GrammarItem).answers.filter((a) => a.tier === "full").map((a) => a.text);
}

// ---------------------------------------------------------------------------
// pre-gate (free, deterministic)
// ---------------------------------------------------------------------------

export type GateStage = "schema" | "un-gateable" | "key-defect" | "no-solver" | "blind-solve" | "passed";

export interface KeyCheck {
  answer: string;
  tier: Tier;
}

export interface PreGateResult {
  ok: boolean;
  stage: GateStage; // "passed" when all three layers pass
  errors: string[];
  /** the student-view frame (null when schema-invalid or un-gateable). */
  frame: Frame | null;
  fullAnswers: string[];
  keyChecks: KeyCheck[];
}

/** Layers 1–3: zod → frameability → key-solvability. No API, no DB. */
export function preGate(kind: ItemKind, item: unknown): PreGateResult {
  // 1 · zod
  const v = validateFullItem(kind, item);
  if (!v.ok) return { ok: false, stage: "schema", errors: v.errors, frame: null, fullAnswers: [], keyChecks: [] };
  const typed = item as VocabItem | GrammarItem;

  // 2 · frameability (vocab always frames; grammar returns null for skipped formats)
  const frame = kind === "vocab" ? frameVocabItem(typed as VocabItem) : frameGrammarItem(typed as GrammarItem);
  if (frame === null) {
    const fmt = (typed as GrammarItem).format;
    return {
      ok: false,
      stage: "un-gateable",
      errors: [`format "${fmt}" cannot be blind-solved (its affordances are built from the answer) — not publishable via Studio`],
      frame: null,
      fullAnswers: [],
      keyChecks: [],
    };
  }

  // 3 · key-solvability: every authored full answer must grade "correct"
  const fullAnswers = fullAnswersFor(kind, typed);
  const keyChecks: KeyCheck[] = cannedCandidates(fullAnswers).map((c) => ({
    answer: c.answer,
    tier: gradeAnswer(kind, typed, frame, c.answer),
  }));
  const broken = keyChecks.filter((k) => k.tier !== "correct");
  if (fullAnswers.length === 0 || broken.length > 0) {
    const errors =
      fullAnswers.length === 0
        ? ["the item has no full answer to grade — nothing is keyed as correct"]
        : broken.map((k) => `authored answer "${k.answer}" grades "${k.tier}", not "correct" (unreachable key)`);
    return { ok: false, stage: "key-defect", errors, frame, fullAnswers, keyChecks };
  }

  return { ok: true, stage: "passed", errors: [], frame, fullAnswers, keyChecks };
}
