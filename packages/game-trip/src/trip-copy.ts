/**
 * G4 "Lost for Words" UI text bank — the Trip-Journal economy (BLUEPRINT III.4
 * transposition ledger; Law 5: re-label the ONE hidden XP, never a new pool).
 * The student is writing the week down as it happens: solving a task = a line
 * that made it into the journal; hidden XP shows as "+N lines"; the streak is
 * "the words are coming" (finding your feet in English); each chapter seals a
 * stamped day. Register: A2+ for 14-year-olds — simple English, glossed once,
 * warmer and drier than G3's channel voice, never babyish.
 */
import type { Tier } from "@domigo/engine";

export const COPY = {
  deShow: "Auf Deutsch?",
  deHide: "Hide German",
  continue: "Next →",
  next: "Next →",
  finishChapter: "Close the day →",
  journalProgress: "Journal lines",
  // glossed-on-use brand word (Law 1): shown once near the progress bar
  linesGloss: "lines (= Zeilen in deinem Reisetagebuch)",
  backToJournal: "← Back to your journal",
} as const;

/**
 * The task label for a slot. G4 slots are diegetic writing/speaking moments —
 * journal entries, the record correction, saying it right to an adult. Prefix
 * families let content opt in per chapter without code changes.
 */
export function slotPrompt(slot: string): string {
  if (/^recap(-|$)/.test(slot)) return "🤔 Did you follow the day?"; // .ci. comprehension check
  if (/(^|-)journal|^plane-journal|^chronicle|^timeline/.test(slot)) {
    return "✍️ Your journal — write the line in English.";
  }
  if (/^fix-record/.test(slot)) return "📋 Fix the record — exact words matter."; // ch03 reported speech
  if (/^report-q|^tell-/.test(slot)) return "🗣️ Say it right — she is listening."; // reported questions
  if (/^recook/.test(slot)) return "🍳 Get the order of events right.";
  return "✏️ Find the words.";
}

/** Themed result line by tier. `lines` = the XP that was awarded. */
export function resultLine(tier: Tier, lines: number): { text: string; good: boolean } {
  if (tier === "wrong") return { text: "Not this time — read the right line once. It comes back.", good: false };
  if (tier === "close") return { text: `Nearly — one letter off. +${lines} lines`, good: true };
  const lead = tier === "partial" ? "Good — half the line is there. " : "";
  return { text: `${lead}Into the journal! +${lines} lines`, good: true };
}

/** Streak label — the week's own metaphor: language arriving. */
export function trailLabel(trail: number): string | null {
  if (trail >= 10) return "🖋️ You're writing in English now!";
  if (trail >= 5) return "🖋️ The words are coming!";
  if (trail >= 3) return "🖋️ Finding the words…";
  return null;
}

/** Day-stamp lines for the chapter-seal ceremony (chapter ≠ calendar day;
 *  the journal stamps chapters — the printed itinerary keeps time legible). */
export const DAY_STAMP: Record<string, string> = {
  "g4.st.lost-for-words.ch01": "Day one. You said hello with your hands — and then with words.",
  "g4.st.lost-for-words.ch02": "The box was empty. You wrote down what had happened — in order.",
  "g4.st.lost-for-words.ch03": "Words drifted today. You fixed the record.",
  "g4.st.lost-for-words.ch04": "Ms Blake asked. You answered. That took something.",
  "g4.st.lost-for-words.ch05": "Dinner, again. Some things need a second try — that's how they work.",
};
