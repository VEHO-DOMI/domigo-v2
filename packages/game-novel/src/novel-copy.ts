/**
 * G3 "FOURTEEN" UI text bank — the production-crew economy (Koki's "reward system
 * is solid" → we re-label the ONE hidden XP, Law 5, never a new pool). The student
 * is the channel's WRITER: solving a task = a clean take; hidden XP shows as
 * "+N views"; the streak is "trending"; each episode banks a Subscriber milestone.
 *
 * The signature mechanic lives here too: episodeComments() turns the player's
 * fix-Ben's-script accuracy into the comment section — high accuracy shields Ben
 * (the aired line is correct → kind comments), slips let his error air. The TONE
 * is bounded by the episode's authored BAND (warm early → tense → reckoning), so
 * accuracy modulates *how much you protected Ben*, never the plot (story-first).
 */
import type { Tier } from "@domigo/engine";

export const COPY = {
  taskPrompt: "✏️ Help write the script — get it right before it goes live",
  fixPrompt: "✏️ Fix Ben's line before the video goes live",
  deShow: "Auf Deutsch?",
  deHide: "Hide German",
  continue: "Next →",
  finishEpisode: "Upload the episode →",
  next: "Next →",
  channelProgress: "Episode views",
  // glossed-on-use brand words (Law 1): shown once near the channel bar
  viewsGloss: "views (= Aufrufe)",
};

/** Themed result line by item kind + grade tier. `views` = the XP that was awarded. */
export function resultLine(kind: "grammar" | "vocab", tier: Tier, views: number): { text: string; good: boolean } {
  if (tier === "wrong") return { text: "That line aired with a mistake. Check the answer.", good: false };
  if (tier === "close") return { text: `Almost — a rough take. +${views} views`, good: true };
  const lead = tier === "partial" ? "Good — nearly there. " : "";
  const win = kind === "vocab" ? "Word locked in!" : "Clean take!";
  return { text: `${lead}${win} +${views} views`, good: true };
}

/** "Trending" label for a run of consecutive non-combo-breaking answers. */
export function trailLabel(trail: number): string | null {
  if (trail >= 10) return "🔥 Going viral!";
  if (trail >= 5) return "🔥 Trending!";
  if (trail >= 3) return "🔥 Picking up!";
  return null;
}

/** The Subscriber milestone each episode banks (the legacy's per-level count). */
export const SUBSCRIBERS: Record<string, string> = {
  "g3.st.fourteen.ch01": "47",
};

/** A rendered comment under the video. `tone` drives its colour/voice. */
export interface Comment {
  author: string;
  text: string;
  tone: "kind" | "tease" | "cruel";
}

/** The authored emotional band of an episode — the ceiling the consequence works within. */
export type CommentBand = "warm" | "tense" | "reckoning";

// Content-praise comments (shown when the player kept Ben's script clean).
const KIND: Comment[] = [
  { author: "musicfan_07", text: "Ben explains it so well! 🎸", tone: "kind" },
  { author: "lena_b", text: "This helped me with my homework. Subscribed!", tone: "kind" },
  { author: "mr_keller", text: "Great first video. Keep going! 👏", tone: "kind" },
];
// WARM band: if an error airs, the internet finds Ben charming (L01–02 "hilarious"), not cruel.
const TEASE_WARM: Comment[] = [
  { author: "haha_no", text: "Ben said “the Beatles was” 😅", tone: "tease" },
  { author: "smiley22", text: "his little mistakes are kind of cute tbh", tone: "tease" },
];

/**
 * Build the comment section from the player's fix-Ben accuracy, bounded by band.
 * `correct`/`total` count the episode's error-correction ("fix Ben's line") tasks.
 * WARM is the only band wired for the ep01 slice; tense/reckoning land with their
 * episodes (the harsher banks reuse this seam — never invented at random, Law 9).
 */
export function episodeComments(correct: number, total: number, band: CommentBand): { comments: Comment[]; clean: boolean; line: string } {
  const clean = total === 0 || correct >= total;
  if (band === "warm") {
    if (clean) return { comments: KIND, clean, line: "Ben's lines read perfectly. The comments are kind." };
    return { comments: [KIND[0]!, KIND[1]!, TEASE_WARM[0]!], clean, line: "One mistake slipped through — but the internet finds Ben charming… for now." };
  }
  // tense / reckoning bands: authored with their episodes (PR content waves).
  return { comments: clean ? KIND : [TEASE_WARM[0]!, TEASE_WARM[1]!], clean, line: clean ? "Ben's lines read clean." : "His mistakes aired." };
}
