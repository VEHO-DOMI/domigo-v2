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

/**
 * The task label for a slot. The channel/"goes live" framing belongs to the
 * exploitation arc (ep01-11). Once Ben stops being performed (ep12-14), the
 * scripting/fix framing would be grotesque — the redemption slots carry neutral,
 * story-true labels instead (and never trigger the comment beat; see isFixSlot).
 */
export function slotPrompt(slot: string): string {
  if (/^fix(-|$)/.test(slot)) return COPY.fixPrompt;            // ep01-11: fix Ben's on-camera line
  if (/^script(-|$)/.test(slot)) return COPY.taskPrompt;        // ep01-11: write the script
  if (/^truth(-|$)/.test(slot)) return "✍️ Finish the report — the way it really happened.";  // ep12 passive
  if (/^regret(-|$)/.test(slot)) return "💭 If you could go back — what would you do?";        // ep13 2nd conditional
  if (/^promise(-|$)/.test(slot)) return "🎤 Live and honest — help Ben get it right.";        // ep14 going-to
  if (/^recap(-|$)/.test(slot)) return "🤔 Did you follow the story?";                          // .ci. comprehension check
  return COPY.taskPrompt;
}

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
  "g3.st.fourteen.ch02": "3,200",
  "g3.st.fourteen.ch03": "11,000",
  "g3.st.fourteen.ch04": "28,000",
  "g3.st.fourteen.ch05": "45,000",
  "g3.st.fourteen.ch06": "55,000",
  "g3.st.fourteen.ch07": "60,000",
  "g3.st.fourteen.ch08": "80,000",
  // ch09 ("My Rules") deliberately has no milestone — it's the backlash episode
  // (Ben pushes back; the legacy count dips 80k→65k), so no triumphant "hit X" boast.
  "g3.st.fourteen.ch10": "70,000",
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
  { author: "mr_keller", text: "Great video. Keep going! 👏", tone: "kind" },
];
// WARM band: if an error airs, the internet finds Ben charming (L01–02 "hilarious"), not cruel.
const TEASE_WARM: Comment[] = [
  { author: "haha_no", text: "Ben said “the Beatles was” 😅", tone: "tease" },
  { author: "smiley22", text: "his little mistakes are kind of cute tbh", tone: "tease" },
];
// TENSE band (L06–10): the channel is now KNOWN for Ben's slip-ups — the laughs turn
// pitying, then pointed. Not yet cruel (that's the reckoning band, L11+).
const TEASE_TENSE: Comment[] = [
  { author: "lol_marco", text: "Poor Ben 😬 we only watch for the fails now", tone: "tease" },
  { author: "study_girl", text: "the Grammar Fix guy again 😅", tone: "tease" },
  { author: "anon_42", text: "do they laugh WITH him or AT him?", tone: "cruel" },
];
// RECKONING band (L11, the compilation): the cruelty is structural now — a clean take
// can't undo it. This is the gut-punch the whole comment arc has been building to.
const CRUEL: Comment[] = [
  { author: "clip_farm", text: "made a compilation of all his fails 💀", tone: "cruel" },
  { author: "h8r_x", text: "this kid is so dumb lol", tone: "cruel" },
  { author: "noname_99", text: "200k views and they're all laughing AT him", tone: "cruel" },
];

/**
 * Build the comment section from the player's fix-Ben accuracy, bounded by band.
 * `correct`/`total` count the episode's error-correction ("fix Ben's line") tasks.
 * WARM (L01–05) + TENSE (L06–10) + RECKONING (L11) are all wired. After L11 the
 * fix-Ben mechanic is retired (Ben stops being performed), so this only fires through L11.
 */
export function episodeComments(correct: number, total: number, band: CommentBand): { comments: Comment[]; clean: boolean; line: string } {
  const clean = total === 0 || correct >= total;
  if (band === "warm") {
    if (clean) return { comments: KIND, clean, line: "Ben's lines read perfectly. The comments are kind." };
    return { comments: [KIND[0]!, KIND[1]!, TEASE_WARM[0]!], clean, line: "One mistake slipped through — but the internet finds Ben charming… for now." };
  }
  if (band === "tense") {
    // Even a clean take can't undo the channel's reputation — one pitying voice creeps in.
    if (clean) return { comments: [KIND[0]!, KIND[1]!, TEASE_TENSE[0]!], clean, line: "Clean takes — but the channel is famous for Ben's slip-ups now." };
    return { comments: TEASE_TENSE, clean, line: "His mistake aired. The comments aren't laughing with him anymore." };
  }
  // RECKONING (L11): the cruelty is structural now — a compilation exists, made from old clips.
  // A clean take changes nothing; that futility IS the point. The comments are cruel regardless.
  return { comments: CRUEL, clean, line: "You kept this take clean. It doesn't matter — the cruelty has a life of its own now." };
}
