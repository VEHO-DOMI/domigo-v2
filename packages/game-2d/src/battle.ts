/**
 * Pure battle-plan logic for the Word-Battle (G-A1). Everything here is
 * deterministic and DOM-free (the anim.ts/path.ts pattern): the BattleStage
 * renders whatever this module decides, so the decisions are unit-testable
 * without a browser. Grading is untouched — these are PRESENTATION choices
 * (which vocab pool a node asks, whether a word-bank chip row scaffolds the
 * input, whether multiple-choice renders as a dropdown cloze). One node ≠ the
 * next by construction: rotation is keyed to the node index.
 */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { vocabAnswers, type VocabPool } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";

/** FNV-1a/32 — the repo's standing seed hash (tactile.ts / useShuffled use the same). */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic Fisher-Yates via an LCG seeded from the id — same algorithm
 *  family as task-ui's seededShuffle; local so this module stays import-light. */
function shuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let s = hash32(seed) || 1;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Node-order pool rotation: the classic carrier opens a zone, then the recall
 *  directions rotate in. All four pools are schema-guaranteed on every approved
 *  vocab item (content-schema min(1) + ≥1 full tier), so no support-filtering. */
const POOL_ROTATION: readonly VocabPool[] = ["carrier", "deToEn", "enToDe", "definition"];

/** Text formats whose single blank can take a word-bank chip row. sentence-
 *  building/anagram are excluded — their tactile trays own that slot. */
const BANK_FORMATS = new Set(["gap-fill", "translation", "transformation", "error-correction", "question-formation"]);

export interface BattlePresentation {
  /** Vocab nodes: the authored answer pool this battle asks (null for grammar). */
  pool: VocabPool | null;
  /** Word-bank chip row (the stolen word hiding among decoys) — null = none. */
  bank: string[] | null;
  /** Render multiple-choice / context-picker as an inline dropdown cloze. */
  dropdown: boolean;
}

/** The primary full-tier answer this node's battle is fought over. */
export function primaryAnswer(r: ResolvedItem, pool: VocabPool | null): string {
  const answers = r.kind === "vocab"
    ? vocabAnswers(r.item as VocabItem, pool ?? "carrier")
    : (r.item as GrammarItem).answers;
  return answers.find((a) => a.tier === "full")?.text ?? "";
}

/**
 * The word-bank chip row for one node: the correct answer + up to 4 decoys,
 * seeded-shuffled. Decoys keep the ANSWER's language by construction: the
 * enToDe pool (German answers) draws only from sibling vocab items' enToDe
 * answers; every English-answer pool may also borrow cross-kind English words
 * (grammar answers + authored distractors — real confusables first). Only
 * single-blank, bank-friendly items get a bank; fewer than 2 decoys ⇒ null
 * (a two-chip "bank" is a coin flip, not a scaffold).
 */
export function battleBank(items: ResolvedItem[], idx: number, pool: VocabPool | null): string[] | null {
  const r = items[idx];
  if (!r) return null;
  const answer = primaryAnswer(r, pool);
  if (answer === "" || answer.includes("|")) return null; // multi-blank: no single word to hide

  if (r.kind === "grammar") {
    const g = r.item as GrammarItem;
    if (!BANK_FORMATS.has(g.format)) return null;
  }

  const german = pool === "enToDe"; // the one non-English answer language in scope
  const seen = new Set([answer.toLowerCase()]);
  const decoys: string[] = [];
  const push = (t: string) => {
    const clean = t.trim();
    if (clean === "" || clean.includes("|") || clean.length > 24) return;
    const k = clean.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    decoys.push(clean);
  };

  // Priority 1: the item's own authored distractors (the real confusables).
  if (r.kind === "grammar") for (const d of (r.item as GrammarItem).distractors) push(d);
  // Priority 2: same-kind siblings' answers in the SAME pool (language match).
  for (let i = 0; i < items.length && decoys.length < 4; i += 1) {
    if (i === idx) continue;
    const sib = items[i]!;
    if (sib.kind !== r.kind) continue;
    push(primaryAnswer(sib, sib.kind === "vocab" ? pool : null));
  }
  // Priority 3 (English answers only): cross-kind English words — grammar
  // answers/distractors are English, so they can pad a vocab bank and vice versa.
  if (!german) {
    for (let i = 0; i < items.length && decoys.length < 4; i += 1) {
      if (i === idx) continue;
      const sib = items[i]!;
      if (sib.kind === r.kind) continue;
      push(primaryAnswer(sib, sib.kind === "vocab" ? "carrier" : null));
      if (sib.kind === "grammar") for (const d of (sib.item as GrammarItem).distractors) { if (decoys.length >= 4) break; push(d); }
    }
  }

  if (decoys.length < 2) return null;
  return shuffle([answer, ...decoys.slice(0, 4)], r.item.id);
}

/**
 * One presentation per encounter node — the "no two consecutive battles feel
 * identical" rule, made deterministic: vocab pools rotate through the four
 * authored directions by node order; the word bank scaffolds every second
 * node; multiple-choice alternates buttons ↔ dropdown cloze.
 */
export function battlePlan(items: ResolvedItem[]): BattlePresentation[] {
  return items.map((r, idx) => {
    const pool = r.kind === "vocab" ? POOL_ROTATION[idx % POOL_ROTATION.length]! : null;
    const wantsBank = idx % 2 === 1;
    const isChoice = r.kind === "grammar" && ((r.item as GrammarItem).format === "multiple-choice" || (r.item as GrammarItem).format === "context-picker");
    return {
      pool,
      bank: wantsBank && !isChoice ? battleBank(items, idx, pool) : null,
      dropdown: isChoice && idx % 2 === 1,
    };
  });
}

/**
 * How the recovered word returns on victory: short answers fly home letter by
 * letter; long ones (or multi-blank pipe answers) glide back whole — 30 staggered
 * spans of a full sentence would read as noise, not a word coming home.
 */
export function lettersFor(answer: string): { kind: "letters"; chars: string[] } | { kind: "whole"; text: string } {
  const text = answer.replaceAll(" | ", ", ").replaceAll("|", ", ").trim();
  if (text.length === 0 || text.length > 14 || answer.includes("|")) return { kind: "whole", text };
  return { kind: "letters", chars: [...text] };
}

/** The drained-world veil at full strength (0 words recovered). */
export const DRAIN_MAX = 0.44;

/**
 * Veil alpha from recovery progress: strongest before the first win, zero when
 * every node is cleared. Clamped so stale saves (cleared indices beyond today's
 * node count) or an empty zone can never overshoot or divide by zero.
 */
export function drainAlpha(done: number, total: number): number {
  if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0) return 0;
  const remaining = 1 - Math.min(Math.max(done / total, 0), 1);
  return Math.round(DRAIN_MAX * remaining * 1000) / 1000;
}
