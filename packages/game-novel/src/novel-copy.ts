/**
 * FOURTEEN copy and authored audience curve. Learning rewards come from the
 * existing server attempt ledger (displayed as Writing), never from this table.
 * Views/likes/shares/comments/subscribers describe the fictional channel.
 * The comment tone follows the authored arc; mistakes never change the plot.
 */
import type { Tier } from "@domigo/engine";

export const COPY = {
  taskPrompt: "✏️ Help write the script — get it right before it goes live",
  fixPrompt: "✏️ Fix Ben's line before the video goes live",
  deShow: "Auf Deutsch?",
  deHide: "Hide German",
  continue: "Next →",
  finishEpisode: "Finish this episode →",
  next: "Next →",
  channelProgress: "Your part in the story",
  // glossed-on-use brand words (Law 1): shown once near the channel bar
  viewsGloss: "views (= Aufrufe)",
};

/**
 * The task label for a slot. The channel/"goes live" framing belongs to the
 * exploitation arc (ep01-11). Once Ben stops being performed (ep12-14), the
 * scripting/fix framing would be grotesque — the redemption slots carry neutral,
 * story-true labels instead (and never trigger the comment beat; see isFixSlot).
 */
export function slotPrompt(slot: string, unit?: number): string {
  if (unit === 11 && /^script(-|$)/.test(slot)) return "✍️ Put what happened into words.";
  if (/^fix(-|$)/.test(slot)) return COPY.fixPrompt;            // ep01-11: fix Ben's on-camera line
  if (/^script(-|$)/.test(slot)) return COPY.taskPrompt;        // ep01-11: write the script
  if (/^truth(-|$)/.test(slot)) return "✍️ Finish the report — the way it really happened.";  // ep12 passive
  if (/^regret(-|$)/.test(slot)) return "💭 What would you do?";        // ep13 2nd conditional
  if (/^promise(-|$)/.test(slot)) return "🎤 What happens next?";        // ep14 going-to
  if (/^reply(-|$)/.test(slot)) return "💬 Write back to the comments.";   // ep01 exemplar: write back to viewers
  if (/^recap(-|$)/.test(slot)) return "🤔 Did you follow the story?";                          // .ci. comprehension check
  return COPY.taskPrompt;
}

/** Short, optional help for the framing, without revealing a task answer. */
export function slotHelp(slot: string, unit: number): string {
  if (/^fix(-|$)/.test(slot)) return "Verbessere Bens Satz, bevor das Video veröffentlicht wird.";
  if (/^script(-|$)/.test(slot)) return unit === 11 ? "Beschreibe, was passiert ist." : "Hilf beim Text für das Video, bevor es veröffentlicht wird.";
  if (/^truth(-|$)/.test(slot)) return "Halte fest, was wirklich passiert ist.";
  if (/^regret(-|$)/.test(slot)) return "Was würdest du jetzt tun?";
  if (/^promise(-|$)/.test(slot)) return "Was passiert gleich?";
  if (/^reply(-|$)/.test(slot)) return "Antworte auf die Kommentare.";
  return "Was ist in der Geschichte passiert?";
}

/** Acknowledged learning points, never invented audience views. */
export function resultLine(kind: "grammar" | "vocab", tier: Tier, points?: number): { text: string; good: boolean } {
  const reward = points === undefined ? "" : ` Writing +${points}.`;
  if (tier === "wrong") return { text: "Read the answer. You can try this line again.", good: false };
  if (tier === "close") return { text: `Almost there. Read the small change.${reward}`, good: true };
  if (tier === "partial") return { text: `Part of it is right. Read the full answer.${reward}`, good: true };
  return { text: `${kind === "vocab" ? "That word fits." : "That line works."}${reward}`, good: true };
}

/** "Trending" label for a run of consecutive non-combo-breaking answers. */
export function trailLabel(trail: number): string | null {
  if (trail >= 10) return "🔥 Going viral!";
  if (trail >= 5) return "🔥 Trending!";
  if (trail >= 3) return "🔥 Picking up!";
  return null;
}

/**
 * The audience curve (welle-049). ONE source: content/corpus/stories/g3.st.fourteen/economy.json
 * (economy@1), loaded server-side and passed in. Every audience number a child sees — the
 * scene prose ("{{views}} views!") and the upload screen — is filled from that table, so the
 * story and the screen can never disagree. Story numbers, identical for every child: the
 * player's performance never moves the curve (VISION 3, band ceiling untouched).
 * Law + tamper: scripts/check-g3-economy.mjs.
 */
export interface EpisodeStats {
  chapterId: string;
  views: number;
  likeRate: number;
  subscribers: number;
  /** Authored story counts, not live analytics or player rewards. */
  shares?: number;
  comments?: number;
}

/** The placeholders a scene line may carry; anything else is a gate failure. */
export const STAT_PLACEHOLDERS = ["views", "likes", "subscribers"] as const;

/** Likes are display-only: round(views × likeRate) — never a pool, never stored. */
export function likesFor(row: EpisodeStats): number {
  return Math.round(row.views * row.likeRate);
}

/** 60000 → "60,000" (en) / "60.000" (de). */
export function formatCount(n: number, lang: "en" | "de"): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "de" ? "." : ",");
}

/** Fill {{views}} · {{likes}} · {{subscribers}} in a scene line from the episode's row. */
export function fillStats(text: string, row: EpisodeStats, lang: "en" | "de"): string {
  return text.replace(/\{\{(views|likes|subscribers)\}\}/g, (_m, key: string) =>
    formatCount(key === "likes" ? likesFor(row) : key === "views" ? row.views : row.subscribers, lang));
}

/** Fill every scene line (English + German scaffold) of a chapter from its own row. */
export function fillChapterStats<C extends { id: string; scenes: readonly { textEn: string; scaffoldDe: string | null }[] }>(
  chapter: C,
  episodes: readonly EpisodeStats[],
): C {
  const row = episodes.find((e) => e.chapterId === chapter.id);
  if (!row) return chapter;
  return {
    ...chapter,
    scenes: chapter.scenes.map((s) => ({
      ...s,
      textEn: fillStats(s.textEn, row, "en"),
      scaffoldDe: s.scaffoldDe === null ? null : fillStats(s.scaffoldDe, row, "de"),
    })),
  };
}

/**
 * The upload screen's numbers for one episode. ep01–10 bank a milestone ("the channel just
 * hit N subscribers") only when subscribers ROSE. A dip (ep09 backlash) and everything from
 * the reckoning on (ep11–14) get a quiet statistics line instead — after ep11 a triumphant
 * boast would be obscene (g3.md), but the falling curve must still be visible.
 */
export function uploadStats(episodes: readonly EpisodeStats[], chapterId: string): {
  statsLine: string;
  milestone: string | null;
  quietLine: string | null;
} | null {
  const i = episodes.findIndex((e) => e.chapterId === chapterId);
  const row = episodes[i];
  if (!row) return null;
  const prev = i > 0 ? episodes[i - 1]!.subscribers : 0;
  const delta = row.subscribers - prev;
  const epNo = i + 1;
  const statsLine = `${formatCount(row.views, "en")} views · ${formatCount(likesFor(row), "en")} likes`;
  if (epNo <= 10 && delta > 0) {
    return { statsLine, milestone: formatCount(row.subscribers, "en"), quietLine: null };
  }
  const sign = delta < 0 ? "−" : "+";
  return { statsLine, milestone: null, quietLine: `Subscribers: ${formatCount(row.subscribers, "en")} · ${sign}${formatCount(Math.abs(delta), "en")}` };
}

/** A rendered comment under the video. `tone` drives its colour/voice. */
export interface Comment {
  author: string;
  text: string;
  tone: "kind" | "tease" | "cruel";
  helpDe?: string;
}

/** The authored emotional band of an episode — the ceiling the consequence works within. */
export type CommentBand = "warm" | "tense" | "reckoning";

// Content-praise comments (shown when the player kept Ben's script clean).
const KIND: Comment[] = [
  { author: "musicfan_07", text: "Ben reads it so well! 🎸", tone: "kind" },
  { author: "lena_b", text: "This helped me with my homework. Subscribed!", tone: "kind" },
  { author: "mr_keller", text: "Great video. Keep going! 👏", tone: "kind" },
];
// WARM band: if an error airs, the internet finds Ben charming (L01–02 "hilarious"), not cruel.
const TEASE_WARM: Comment[] = [
  { author: "haha_no", text: "one wrong word 😅 still charming", tone: "tease" },
  { author: "smiley22", text: "his little mistakes are kind of cute tbh", tone: "tease" },
];
// TENSE band (L06–10): the channel is now KNOWN for Ben's slip-ups — the laughs turn
// pitying, then pointed. Not yet cruel (that's the reckoning band, L11+).
const TEASE_TENSE: Comment[] = [
  { author: "lol_marco", text: "Poor Ben 😬 we only watch for the fails now", tone: "tease" },
  { author: "study_girl", text: "the mistakes guy again 😅", tone: "tease" },
  { author: "anon_42", text: "do they laugh WITH him or AT him?", tone: "kind" },
];
// RECKONING band (L11, the compilation): the cruelty is structural now — a clean take
// can't undo it. This is the gut-punch the whole comment arc has been building to.
const CRUEL: Comment[] = [
  { author: "clip_farm", text: "made a compilation of all his fails 💀", tone: "cruel", helpDe: "made = gemacht; compilation = Zusammenschnitt; fails = Reinfälle" },
  { author: "h8r_x", text: "this kid is so dumb lol", tone: "cruel", helpDe: "kid = Kind; dumb = dumm; lol = laughing out loud, laut lachen" },
  { author: "noname_99", text: "they're all laughing AT him", tone: "cruel", helpDe: "laughing at him = ihn auslachen" },
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
  return { comments: CRUEL, clean, line: "Those clips are from earlier videos. One line today cannot change what the group did to Ben." };
}
