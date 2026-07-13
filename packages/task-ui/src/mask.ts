/**
 * C-1 · First-letter mask — the paper checkup's signature scaffold, ported as
 * PRESENTATION ONLY (doc 21 §6). The mask is derived from a section's primary
 * full answer and rendered as one bold first letter per word followed by a
 * FIXED-length blank — never answer-length-proportional, so the blank can never
 * leak how long the word is. Grading input is the untouched full answer through
 * @domigo/engine; nothing here touches keys or answers.
 *
 * No React: pure + unit-testable (vitest, no DOM), like vocab-pool.ts.
 */

/** One masked word: its bold first letter + the fixed blank that follows. */
export interface MaskSegment {
  /** the word's first character (empty for a degenerate empty word) */
  first: string;
  /** the FIXED blank — identical for every word regardless of answer length */
  blank: string;
}

/** The fixed blank width (doc 21 §6: "blank length is FIXED — no length leak"). */
export const MASK_BLANK = "____";

/**
 * Mask one answer to first letters: `"working hours"` → w____ h____.
 * Split on whitespace; each word contributes its first character + the fixed
 * blank. Whitespace-only input yields no segments (callers hide the mask).
 */
export function firstLetterMask(answer: string): MaskSegment[] {
  return answer
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => ({ first: w[0]!, blank: MASK_BLANK }));
}

/** Plain-text form ("w____ h____") — for previews, logs, and the verify script. */
export function firstLetterMaskText(answer: string): string {
  return firstLetterMask(answer)
    .map((s) => `${s.first}${s.blank}`)
    .join(" ");
}
