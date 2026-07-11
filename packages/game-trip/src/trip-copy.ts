/**
 * Per-story UI text banks for the shared @domigo/game-trip runtime (B-3). The
 * runtime engine (Choice.sets / FlagGate / flagLines / the hidden XP economy) is
 * identical across trip stories; only the *skin* differs, so every story-specific
 * string lives in a `TripCopy` pack chosen by `tripCopyFor(storyId)`. Law 5: the
 * economy re-labels the ONE hidden XP (`xpForTier`), never a new pool.
 *
 *   g4.st.lost-for-words  → the Trip Journal (writing the week down; "lines")
 *   g4.st.fourteen-live   → the newsroom Rundown (cutting the show; "takes")
 */
import type { Tier } from "@domigo/engine";

export interface TripCopy {
  /** the story this pack skins */
  storyId: string;
  /** in-game header title (uppercase brand). */
  title: string;
  /** small back link in the game header + the two end-screen links. */
  backLink: string;
  backToBoard: string;
  /** buttons. */
  continue: string;
  next: string;
  finishChapter: string;
  /** progress bar: label + the countable noun (`N/M lines` | `N/M takes`). */
  progressLabel: string;
  economyNoun: string;
  /** chapter-seal ceremony. */
  doneTitle: string;
  doneTitleAlt: string;
  savedSuffix: string;
  wroteCount: (n: number) => string;
  /** dynamic copy (functions — client-only, never crosses the RSC boundary). */
  slotPrompt: (slot: string) => string;
  resultLine: (tier: Tier, n: number) => { text: string; good: boolean };
  trailLabel: (trail: number) => string | null;
  dayStamp: Record<string, string>;
  /** hub-side (the /play/[grade] board). */
  hubNoun: string;
  hubTagline: string;
  boardLabel: string;
  boardStampedWord: string;
}

// ─────────────────────────────────────── g4.st.lost-for-words (parked) ────
// The student is writing the week down as it happens: a solved task = a line
// that made the journal; the streak is "the words are coming"; each chapter
// seals a stamped day. Register: A2+, simple English, warmer/drier than G3.
const LOST_FOR_WORDS: TripCopy = {
  storyId: "g4.st.lost-for-words",
  title: "LOST FOR WORDS",
  backLink: "← Journal",
  backToBoard: "← Back to your journal",
  continue: "Next →",
  next: "Next →",
  finishChapter: "Close the day →",
  progressLabel: "Journal lines",
  economyNoun: "lines",
  doneTitle: "Day stamped! 🖋️",
  doneTitleAlt: "Day complete! 🖋️",
  savedSuffix: "is in your journal.",
  wroteCount: (n) => `You wrote ${n} line${n === 1 ? "" : "s"} today.`,
  slotPrompt: (slot) => {
    if (/^recap(-|$)/.test(slot)) return "🤔 Did you follow the day?";
    if (/(^|-)journal|^plane-journal|^chronicle|^timeline/.test(slot)) return "✍️ Your journal — write the line in English.";
    if (/^fix-record/.test(slot)) return "📋 Fix the record — exact words matter.";
    if (/^report-q|^tell-/.test(slot)) return "🗣️ Say it right — she is listening.";
    if (/^recook/.test(slot)) return "🍳 Get the order of events right.";
    return "✏️ Find the words.";
  },
  resultLine: (tier, lines) => {
    if (tier === "wrong") return { text: "Not this time — read the right line once. It comes back.", good: false };
    if (tier === "close") return { text: `Nearly — one letter off. +${lines} lines`, good: true };
    const lead = tier === "partial" ? "Good — half the line is there. " : "";
    return { text: `${lead}Into the journal! +${lines} lines`, good: true };
  },
  trailLabel: (trail) => {
    if (trail >= 10) return "🖋️ You're writing in English now!";
    if (trail >= 5) return "🖋️ The words are coming!";
    if (trail >= 3) return "🖋️ Finding the words…";
    return null;
  },
  dayStamp: {
    "g4.st.lost-for-words.ch01": "Day one. You said hello with your hands — and then with words.",
    "g4.st.lost-for-words.ch02": "The box was empty. You wrote down what had happened — in order.",
    "g4.st.lost-for-words.ch03": "Words drifted today. You fixed the record.",
    "g4.st.lost-for-words.ch04": "Ms Blake asked. You answered. That took something.",
    "g4.st.lost-for-words.ch05": "Dinner, again. Some things need a second try — that's how they work.",
  },
  hubNoun: "Day",
  hubTagline: "One week in England — write it down as it happens. New days open as you learn more.",
  boardLabel: "Your trip journal (= Reisetagebuch)",
  boardStampedWord: "stamped",
};

// ─────────────────────────────────── g4.st.fourteen-live (Season 2) ────────
// The crew is cutting a live news show: a solved task = a take that made the
// cut; the streak is the story coming together on air; each chapter is a
// segment that gets recorded. Register: 14-year-old, quick and a little dry.
const FOURTEEN_LIVE: TripCopy = {
  storyId: "g4.st.fourteen-live",
  title: "FOURTEEN: LIVE",
  backLink: "← Rundown",
  backToBoard: "← Back to the rundown",
  continue: "Next →",
  next: "Next →",
  finishChapter: "That's a wrap →",
  progressLabel: "Show takes",
  economyNoun: "takes",
  doneTitle: "Segment recorded! 🎬",
  doneTitleAlt: "Segment done! 🎬",
  savedSuffix: "made the cut.",
  wroteCount: (n) => `You logged ${n} take${n === 1 ? "" : "s"} on this segment.`,
  slotPrompt: (slot) => {
    if (/^recap(-|$)/.test(slot)) return "🤔 Did you follow the story?";
    if (/^name-it(-|$)/.test(slot)) return "✍️ Name it for the report.";
    if (/^fix-it(-|$)/.test(slot)) return "📋 Fix the line — get it right on the record.";
    return "✏️ Find the words.";
  },
  resultLine: (tier, takes) => {
    if (tier === "wrong") return { text: "Not this time — watch the right take once. It comes back.", good: false };
    if (tier === "close") return { text: `Nearly — one letter off. +${takes} takes`, good: true };
    const lead = tier === "partial" ? "Good — half the take is there. " : "";
    return { text: `${lead}That's a take! +${takes} takes`, good: true };
  },
  trailLabel: (trail) => {
    if (trail >= 10) return "🎬 You're live now!";
    if (trail >= 5) return "🎬 The story's coming together!";
    if (trail >= 3) return "🎬 Rolling…";
    return null;
  },
  dayStamp: {
    "g4.st.fourteen-live.ch01": "One year on, and you're live again — then Leo's camera caught a poster it shouldn't have.",
    "g4.st.fourteen-live.ch02": "Motive, opportunity, evidence. The homework became the method.",
    "g4.st.fourteen-live.ch03": "The 'random' lists weren't random. Patterns have makers.",
    "g4.st.fourteen-live.ch04": "Two sources for every fact. Novak handed you the rules — and the story.",
    "g4.st.fourteen-live.ch05": "Free pizza with a sponsor's logo. Not an accident — a budget.",
    "g4.st.fourteen-live.ch06": "Amelie asked the sharp question. You chose how to answer it.",
    "g4.st.fourteen-live.ch07": "Only one city was ever for sale. The file wrote itself.",
    "g4.st.fourteen-live.ch08": "The story almost owned you. You deleted the clip. You are not the story.",
    "g4.st.fourteen-live.ch09": "Breathe in four. Every question on its own card. Then send.",
    "g4.st.fourteen-live.ch10": "True and unfair, in one sentence. You chose how to face him.",
    "g4.st.fourteen-live.ch11": "Eight years ago someone stopped this story. You inherited the unfinished one.",
    "g4.st.fourteen-live.ch12": "Under fake stars, the whole room. Monday, her office, bring everything.",
    "g4.st.fourteen-live.ch13": "You told all four layers. Same city, different school — that's the whole story.",
  },
  hubNoun: "Segment",
  hubTagline: "Cover the story as it breaks — segment by segment. New segments open as you learn more.",
  boardLabel: "The rundown (= Sendeablauf)",
  boardStampedWord: "recorded",
};

const PACKS: Record<string, TripCopy> = {
  [LOST_FOR_WORDS.storyId]: LOST_FOR_WORDS,
  [FOURTEEN_LIVE.storyId]: FOURTEEN_LIVE,
};

/** The copy pack for a trip story (default: Lost for Words, the original skin). */
export function tripCopyFor(storyId: string): TripCopy {
  return PACKS[storyId] ?? LOST_FOR_WORDS;
}
