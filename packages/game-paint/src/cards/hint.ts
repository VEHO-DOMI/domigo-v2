// THE HINT LADDER (PB-T7 / Build-B2) — Koki's F18 spec for gap answers (typed,
// spell): escalation 1 reveals the FIRST LETTER inside the gap; escalation 2
// adds the exact letter count with one underscore per remaining letter. Pure;
// the painted skin renders the returned string. deDesc/deWord (the German
// tips) are separate authored escalations shown alongside.
import { deriveGapHints } from "@domigo/content-schema";

/** The gap rendered with the first letter shown and every other letter as an
 *  underscore; punctuation kept; words spaced apart. "pen" → "P _ _". */
export function gapSlots(answer: string): string {
  let revealed = false;
  return answer
    .trim()
    .split(/\s+/)
    .map((w) =>
      [...w]
        .map((ch) => {
          if (!/\p{L}/u.test(ch)) return ch; // punctuation as-is
          if (!revealed) { revealed = true; return ch.toUpperCase(); }
          return "_";
        })
        .join(" "),
    )
    .join("   ");
}

/**
 * The gap-hint string for a wrong-attempt escalation level:
 *  0 → "" (no reveal — the German deDesc carries this level)
 *  1 → first letter + ellipsis ("P…")
 *  2 → the exact slots + the letter count ("P _ _ · 3 Buchstaben")
 */
export function renderGapHint(answer: string, level: number): string {
  if (level <= 0) return "";
  const { firstLetter, letters } = deriveGapHints(answer);
  if (level === 1) return `${firstLetter.toUpperCase()}…`;
  return `${gapSlots(answer)}  ·  ${letters} ${letters === 1 ? "Buchstabe" : "Buchstaben"}`;
}
