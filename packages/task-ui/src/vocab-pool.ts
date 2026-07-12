/**
 * Vocab exercise pools (A-6 / P-10). Every approved vocab item carries FOUR
 * authored answer sets — schema-guaranteed non-empty, each with ≥1 tier=full
 * (content-schema `VocabItem`): the carrier gap-fill plus three recall
 * directions. This module is the pure PRESENTATION policy: which authored field
 * to show as the prompt for each pool (leak-safe by construction), plus a
 * deterministic per-(item, day) rotation so /practice varies the direction
 * without RNG. Grading itself stays in @domigo/engine (`gradeVocab` /
 * `vocabAnswers`) — nothing here re-implements answer logic.
 *
 * No React: kept pure so it is unit-testable under vitest without a DOM, and so
 * the server (practice page) and the client (VocabItemView) share one policy.
 */
import type { VocabItem } from "@domigo/content-schema";
import type { VocabPool } from "@domigo/engine";

/** Rotation order = the four pools; index 0 (carrier) is the historical default. */
export const VOCAB_POOLS: readonly VocabPool[] = ["carrier", "definition", "deToEn", "enToDe"] as const;

/** Short direction tag for the mode chips / the meta label. */
export const VOCAB_POOL_LABEL: Record<VocabPool, string> = {
  carrier: "Gap-fill",
  definition: "Definition",
  deToEn: "De→En",
  enToDe: "En→De",
};

/** What the student SEES before answering, resolved per pool. */
export interface VocabPrompt {
  /** One-line instruction above the prompt (empty for carrier — the sentence speaks for itself). */
  instruction: string;
  /** The question text. */
  text: string;
  /** Carrier only: the English definition shown as context above the sentence (null otherwise). */
  context: string | null;
  /** Whether to show the carrier scaffolds (gloss row + German hint). Carrier-only — a German hint
   *  would spell the German answer in enToDe, so scaffolding cannot cross into the recall pools. */
  scaffold: boolean;
}

/**
 * The leak-safety invariant: every non-carrier prompt is in the OPPOSITE
 * language from its answer, so the prompt can never contain the answer.
 *   carrier    → the `___` carrier sentence   (answer hides in the blank; grades sAnswers)
 *   definition → the English definition `d`   (answer = the English word; `d` is schema-forbidden
 *                                              from containing the headword — V-8 — so it cannot leak)
 *   deToEn     → the German word `g`          (answer = English; grades translation.deToEn)
 *   enToDe     → the English word `w`         (answer = German;  grades translation.enToDe)
 */
export function vocabPrompt(item: VocabItem, pool: VocabPool): VocabPrompt {
  switch (pool) {
    case "definition":
      return { instruction: "Which word fits this definition?", text: item.d, context: null, scaffold: false };
    case "deToEn":
      return { instruction: "Translate into English:", text: item.g, context: null, scaffold: false };
    case "enToDe":
      return { instruction: "Translate into German:", text: item.w, context: null, scaffold: false };
    default:
      return { instruction: "", text: item.s, context: item.d, scaffold: true };
  }
}

/**
 * Deterministic pool for one item on one Vienna-day: stable within the day,
 * varied across items, cycling day-to-day. FNV-1a/32 over `itemId|day` → pool
 * index — a pure function (no Date, no RNG) so a server render and its hydration
 * always agree. `day` is a YYYY-MM-DD string the caller derives in Europe/Vienna.
 */
export function rotateVocabPool(itemId: string, day: string): VocabPool {
  const key = `${itemId}|${day}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return VOCAB_POOLS[(h >>> 0) % VOCAB_POOLS.length]!;
}
