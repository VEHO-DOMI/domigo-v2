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

/**
 * PK-R3a · R3-10 — WHICH RUNG A KIND MAY CLIMB TO.
 *
 * A spell card already draws the answer's shape: exactly answer-length slots
 * above its tray. The ladder's level-2 rung („P _ _ · 3 Buchstaben") drew that
 * same row of underscores a second time, a few centimetres below the first, and
 * a six-year-old reading two rows of slots has to work out that they are one
 * word. So a spell ladder stops at level 1 — the FIRST LETTER, which the card's
 * own slots do not give away. A typed card has no slots and keeps both rungs.
 *
 * Lives here, beside the ladder it caps, so CardShell and its test read the
 * SAME rule (a test that re-states the rule proves only that it can copy).
 */
export const gapLevelFor = (kind: string, attempts: number): number =>
  (kind === "spell" ? Math.min(attempts, 1) : attempts);
