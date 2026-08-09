// PK-R6 · C · THE RESOLUTION BEAT (doc 44 §3.1.7), as a headless brain.
//
// doc 42 §1 mines two things from Lost-Pages that belong together: the
// enter/exit CHOREOGRAPHY, and „the headless presentation-brain pattern
// (decisions unit-tested outside the DOM)". This module is the second one
// applied to the first: every decision the resolution makes — what comes home,
// whether it flies letter by letter or glides whole, how long each beat runs —
// is a pure function here, and CardHost only plays them.
//
// THE ORDER IS THE POINT (doc 44 §3.1.7 + doc 42 §3's restore-hold):
//
//   1. LETTERS   the answer flies home, per char, „Zurückgeholt!"
//   2. HOLD      the world's change PLAYS and is watched — the colour flood,
//                the joy lap, the cage opening. The card is out of the way.
//   3. CHEER     only now does the card celebrate.
//
// Before this packet the ✓ played FIRST and the world changed after the card
// had already vanished, so the child never saw their own answer land in the
// world — the exact inversion doc 42 §3 mined the Keen restore-beat to fix.
import type { GameTaskV2 } from "@domigo/content-schema";
import { COLOUR_FLOOD_TICKS } from "../anim.ts";
import { TICK_MS } from "../paint.ts";

// ── the mined timings (v0 `dg-bs-letter-fly` / `dg-bs-word-glide`, verbatim) ──
/** Per-char stagger of the letter flight (v0: `120 + i * 55`). */
export const LETTER_STAGGER_MS = 55;
/** The lead-in before the first letter leaves (v0: the `120` in that same
 *  expression) — the beat that lets the eye arrive before the word does. */
export const LETTER_LEAD_MS = 120;
/** One letter's flight (v0 `.dg-bs-letter`: 460 ms). */
export const LETTER_FLY_MS = 460;
/** A long answer glides home whole instead (v0 `.dg-bs-word-whole`: 560 ms
 *  after a 140 ms delay) — 30 staggered spans of a sentence read as noise. */
export const WORD_GLIDE_MS = 560;
export const WORD_GLIDE_DELAY_MS = 140;
/** Above this many characters the answer stops being letters and becomes a
 *  word (v0 `lettersFor`, verbatim). */
export const LETTER_MAX_CHARS = 14;

/** THE RESTORE-HOLD (doc 42 §3): the celebration waits until the world has
 *  visibly finished changing. DERIVED, not typed: the change being waited for
 *  is the colour flood, whose length is a sim constant (`COLOUR_FLOOD_TICKS`),
 *  so a re-tune of the flood moves the hold with it and the beat can never
 *  drift into either dead air or a celebration over a still-grey being.
 *  (Keen held 1800 ms — but that number is the CHAPTER-END flag, doc 42 §3's
 *  other half; a per-card hold three times longer than the change it waits for
 *  would be dead air, so the pattern comes over and the number is re-derived.) */
export const RESTORE_HOLD_MS = Math.round(COLOUR_FLOOD_TICKS * TICK_MS);

/** Which resolution beat is on screen. `ask` = the card is still being played. */
export type ResolutionBeat = "ask" | "letters" | "hold" | "cheer";

/** How the answer comes home: char by char, or as one whole word. Ported
 *  verbatim from the v0 build's `lettersFor` (game-2d/src/battle.ts). */
export const lettersFor = (
  answer: string,
): { kind: "letters"; chars: string[] } | { kind: "whole"; text: string } => {
  const text = answer.replaceAll(" | ", ", ").replaceAll("|", ", ").trim();
  if (text.length === 0 || text.length > LETTER_MAX_CHARS) return { kind: "whole", text };
  return { kind: "letters", chars: [...text] };
};

/** How long the flight beat lasts for `n` characters — the last letter's
 *  delay plus its own flight, so the beat ends when the word is actually home
 *  (a beat that ends early would cut the word in half mid-air). */
export const letterFlyMs = (n: number): number =>
  n <= 0 ? 0 : LETTER_LEAD_MS + (n - 1) * LETTER_STAGGER_MS + LETTER_FLY_MS;

/** The whole letters beat for an answer, either shape. 0 = there is nothing to
 *  fly home, and the resolution goes straight to the world's change. */
export const flightMs = (answer: string): number => {
  if (answer.trim().length === 0) return 0;
  const l = lettersFor(answer);
  return l.kind === "letters" ? letterFlyMs(l.chars.length) : WORD_GLIDE_DELAY_MS + WORD_GLIDE_MS;
};

/** WHAT comes home when this card is solved — the thing the child gave back,
 *  in the child's own answer. Empty string = this kind has no single spoken
 *  answer (a memory board's payoff is the board itself), and the beat is
 *  skipped rather than faked: a letter flight of an invented word would be the
 *  projection lie (P-18) with wings. */
export function answerTextOf(t: GameTaskV2): string {
  switch (t.kind) {
    case "choice":
    case "typed":
    case "spell":
    case "wheel":
      return t.answer;
    // the two-step card ends on the COLOUR, and the colour is what the world
    // then floods with — the word and the change are one beat
    case "restore":
      return t.colour;
    case "order":
      return t.orderedChips.join(" ");
    case "oddone":
      return t.correct.join(", ");
    case "mistake": {
      // the repaired sentence — the mistake card's payoff is the line made
      // right, so the line made right is what flies home
      const out = [...t.sentence];
      if (t.fix.mode === "replace" && t.fix.correction !== undefined) out[t.errorIndex] = t.fix.correction;
      else if (t.fix.mode === "remove") out.splice(t.errorIndex, 1);
      else if (t.fix.mode === "add" && t.fix.correction !== undefined) {
        out.splice((t.fix.insertAfter ?? t.errorIndex) + 1, 0, t.fix.correction);
      }
      return out.join(" ");
    }
    case "memory":
      return "";
  }
}
