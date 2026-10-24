import type { VocabItem } from "@domigo/content-schema";
import type { Tier, VocabPool } from "./index.ts";

/** Observed assistance, not a claim that the learner understood or used it. */
export type VocabularyHelp = "hint" | "retry-hint" | "gloss" | "word-bank" | "first-letter-mask";
export interface VocabularyCheck {
  reportedTier: Tier;
  helpShown: VocabularyHelp[];
}
export interface VocabularyCompletionObservation {
  schema: "vocabulary-completion@1";
  visitId?: string;
  itemRevision: number;
  /** Internal only: the sender hashes this; neither payload nor ledger stores it. */
  contentSnapshot: string;
  maxChecks: 1 | 3;
  checks: VocabularyCheck[];
}

/** Stable across object insertion order; includes effective overlays and answer keys.
 * A revision number alone is insufficient: current prose overlays do not bump rev.
 * This identifies content, not its intended meaning or first teaching chapter. */
export function vocabularyContentSnapshot(item: VocabItem): string {
  const sorted = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sorted);
    if (value !== null && typeof value === "object") return Object.fromEntries(
      Object.entries(value).filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
        .map(([key, child]) => [key, sorted(child)]),
    );
    return value;
  };
  return JSON.stringify(sorted(item));
}

/** Include mode/presentation in a React key so old answers cannot cross a change. */
export function vocabularyPresentationKey(item: VocabItem, pool: VocabPool, options: unknown): string {
  return JSON.stringify([vocabularyContentSnapshot(item), pool, options]);
}
