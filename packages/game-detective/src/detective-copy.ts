/**
 * G2 detective UI text bank — the "Clues / Evidence / Case" economy (Koki's model).
 * Student-facing, A1+/A2: hidden XP is shown as "clues"; wrong = "false clue";
 * the streak is a "hot trail"; each Case File (chapter) unlocks an Evidence Piece.
 * Kept to simple words + the story's already-glossed nouns (card/medal/map/key/
 * numbers/name); the few brand words (clue/case/evidence) are glossed once in-UI.
 */
import type { Tier } from "@domigo/engine";

export const COPY = {
  cluePrompt: "🔍 A clue — solve it to add it to your case file",
  deShow: "Auf Deutsch?",
  deHide: "Hide German",
  continue: "Continue →",
  finishChapter: "Close the case file →",
  next: "Next →",
  caseProgress: "Case Progress",
  // glossed-on-use brand words (Law 1): shown once near the board / completion
  evidenceGloss: "Evidence (= Beweis)",
  cluesGloss: "clues (= Hinweise)",
};

/** Themed result line by item kind + grade tier. `clues` = the XP that was awarded. */
export function resultLine(kind: "grammar" | "vocab", tier: Tier, clues: number): { text: string; good: boolean } {
  if (tier === "wrong") return { text: "False clue! Look at the answer, detective.", good: false };
  if (tier === "close") return { text: `Almost — a shaky clue. +${clues} clues`, good: true };
  const found = kind === "vocab" ? "Word clue found!" : "Sentence clue solved!";
  const lead = tier === "partial" ? "Good — nearly there. " : "";
  return { text: `${lead}${found} +${clues} clues`, good: true };
}

/** "Hot Trail" label for a run of consecutive non-combo-breaking answers. */
export function trailLabel(trail: number): string | null {
  if (trail >= 10) return "🔥 Super detective!";
  if (trail >= 5) return "🔥 Great detective!";
  if (trail >= 3) return "🔥 Hot trail!";
  return null;
}

/** The Evidence Piece each Case File (chapter) unlocks — the chapter's real clue,
 *  worded simply with the story's glossed nouns. */
export const EVIDENCE: Record<string, string> = {
  "g2.st.wrong-name.ch01": "the card",
  "g2.st.wrong-name.ch02": "Max's words",
  "g2.st.wrong-name.ch03": "the open door",
  "g2.st.wrong-name.ch04": "last year's numbers",
  "g2.st.wrong-name.ch05": "the map",
  "g2.st.wrong-name.ch06": "the back door",
  "g2.st.wrong-name.ch07": "Lena's secret",
  "g2.st.wrong-name.ch08": "the key",
  "g2.st.wrong-name.ch09": "the new medal",
  "g2.st.wrong-name.ch10": "Lena's machine",
  "g2.st.wrong-name.ch11": "the same name",
  "g2.st.wrong-name.ch12": "Ben's words",
  "g2.st.wrong-name.ch13": "Dani's words",
  "g2.st.wrong-name.ch14": "the right numbers",
  "g2.st.wrong-name.ch15": "the right name",
};
