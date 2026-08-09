// PK-R3a · R3-8 — THE PAINTED OVERLAY (doc 42 §1/§3/§5, re-skinned to
// STYLE_PAINT_V1). Mined from the two parked builds, re-drawn in gouache:
//
//   Keen (doc 42 §1) → the veil, the spring-in card, the countdown ring.
//   Lost-Pages (doc 42 §1) → the enter/exit CHOREOGRAPHY (wipe in → the card
//     lands a beat later → verdict beat) and the end-states law.
//   Keen (doc 42 §3) → the boot ceremony's page turn.
//
// THE MINING LAW: mechanics, timings and structure come over; every visual is
// re-skinned. So the veil is an ink wash rather than Keen's radial neon dim,
// the entrance is an ink bloom rather than Lost-Pages' glass ink, and the
// countdown is a chalk line being ERASED rather than a violet progress bar.
//
// ── THE END-STATES LAW (standing, doc 42 §1) ────────────────────────────────
// EVERY keyframe below animates FROM an offset TO the natural state, and every
// base style is the FINISHED picture. A child whose system asks for reduced
// motion therefore sees a card that is COMPLETE, never one frozen mid-flight.
// The kill list at the bottom is exhaustive by construction: it names every
// class this file animates, and the classes are all `pb-` prefixed (a prefix
// no other stylesheet in the app claims).
//
// Delivered as a string rendered into a <style> tag by PaintOverlayStyles,
// because game-paint ships raw TS/TSX with no CSS build step of its own.
import { LETTER_FLY_MS, WORD_GLIDE_DELAY_MS, WORD_GLIDE_MS } from "./resolution.ts";

/** How long the chalk-erase ring takes to run out on a quickfire card. Read as
 *  a CSS custom property so the ring and the timer that closes the card can
 *  never disagree about the clock (a ring that empties early would be a
 *  countdown to nothing — the exact class of lie this program hunts).
 *
 *  FABLE REVIEW AMENDMENT (2026-07-28, PR #243): 20 s closed a card mid-read
 *  on an ADULT — for a 6–7-year-old first-reader the mid-read close is the
 *  wrong class entirely. Raised to 45 s so the clock can no longer bite a
 *  reading child; whether it survives AT ALL is Koki's Replay-3 call, and the
 *  pedagogically right inversion (reward FAST answers — streak sparkle —
 *  never punish slow reading; time pressure stays bonus-room-only) is filed
 *  as an R3b design note. */
export const QUICKFIRE_MS = 45_000;
/** The verdict beat: how long a solved card is allowed to say „richtig" before
 *  the world comes back. Short — it is a nod, not a ceremony. */
export const VERDICT_MS = 420;
/** The Lost-Pages choreography delay: the ink-iris goes first, the card lands
 *  after it (doc 42 §1 · doc 44 §3.1.1). VERBATIM from the v0 build:
 *  `.dg-bs-card { animation: dg-bs-card-in 420ms 260ms … }` — 260 ms late, over
 *  420 ms. PK-R3a shipped 240/300, which was a re-tune nobody recorded; this
 *  packet puts the mined numbers back and keeps the constant and the CSS in
 *  lockstep (the overlay-css test asserts they agree). */
export const CARD_ENTER_DELAY_MS = 260;
/** How long the card takes to land once it starts (v0, verbatim). */
export const CARD_ENTER_MS = 420;
/** The ink-iris: one blob swells over the world and retracts (v0 `dg-bs-swirl`,
 *  700 ms), with a second blob 60 ms behind it over 640 ms — two blobs, because
 *  ONE border-radius blob reads as a circle and two read as ink. */
export const IRIS_MS = 700;
export const IRIS_B_DELAY_MS = 60;
export const IRIS_B_MS = 640;

export const PAINT_OVERLAY_CSS = `
/* ── the ink-wash veil ─────────────────────────────────────────────────── */
@keyframes pb-veil-in { from { opacity: 0; } }
.pb-veil {
  background:
    radial-gradient(120% 90% at 50% 45%, rgba(30,24,12,0.10), rgba(30,24,12,0.52)) !important;
  /* the bloom below is bigger than the canvas — clip it to the page */
  overflow: hidden;
  animation: pb-veil-in 160ms ease-out;
}

/* ── THE INK IRIS that wipes the world before the card lands ───────────────
   doc 44 §3.1.1, ported from the v0 build's »dg-bs-swirl« with its timings
   verbatim: the blob's own curve (0 → 42 % → 58 % → 100 %, rotating 0/16/20/−12°),
   its 700 ms on cubic-bezier(0.6, 0, 0.4, 1), and the SECOND blob 60 ms behind
   it over 640 ms with the mirrored border-radius. Two blobs is the whole trick:
   one border-radius blob swelling from the centre reads as a circle, two
   offset ones read as ink running over the page. 100 % CSS, zero assets (B14). */
@keyframes pb-wipe {
  0%   { transform: translate(-50%, -50%) scale(0)    rotate(0deg); }
  42%  { transform: translate(-50%, -50%) scale(1.06) rotate(16deg); }
  58%  { transform: translate(-50%, -50%) scale(1.06) rotate(20deg); }
  100% { transform: translate(-50%, -50%) scale(0)    rotate(-12deg); }
}
.pb-wipe {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 165%;
  height: 165%;
  border-radius: 43% 57% 52% 48% / 46% 49% 51% 54%;
  background: radial-gradient(circle at 42% 40%, #4a3a22, #2a2216 70%);
  opacity: 0.9;
  pointer-events: none;
  /* END STATE: gone. With animations off there is no wipe at all. */
  transform: translate(-50%, -50%) scale(0);
  animation: pb-wipe ${IRIS_MS}ms cubic-bezier(0.6, 0, 0.4, 1) forwards;
}
/* the second blob — same keyframes, mirrored radius, a beat behind (v0
   ».dg-bs-swirl-blob-b«, verbatim). It declares no »animation« shorthand of
   its own on purpose: it rides ».pb-wipe«'s, so the reduced-motion kill list
   covers both by covering one. */
.pb-wipe-b {
  border-radius: 57% 43% 48% 52% / 51% 54% 46% 49%;
  background: radial-gradient(circle at 58% 46%, #3f3320, #241d13 70%);
  opacity: 0.72;
  animation-delay: ${IRIS_B_DELAY_MS}ms;
  animation-duration: ${IRIS_B_MS}ms;
}

/* ── the card springs in a beat after the iris ─────────────────────────── */
@keyframes pb-card-in { from { opacity: 0; transform: translateY(16px) scale(0.94); } }
.pb-card { animation: pb-card-in ${CARD_ENTER_MS}ms ${CARD_ENTER_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

/* ── the chalk-erase countdown (quickfire only) ────────────────────────── */
@keyframes pb-ring-erase { from { width: 100%; } to { width: 0%; } }
.pb-ring-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(140, 122, 88, 0.22);
  overflow: hidden;
  margin: 0 auto 12px;
}
.pb-ring {
  height: 100%;
  border-radius: 999px;
  /* chalk laid on the board, being wiped away from the right */
  background: linear-gradient(90deg, #f6f2e8, #d9c9a3);
  box-shadow: 0 0 4px rgba(246, 242, 232, 0.7);
  /* END STATE: full. With animations off the chalk simply sits there and the
     card has no clock at all (the timer is skipped in the same breath). */
  width: 100%;
  animation: pb-ring-erase var(--pb-ring-s, ${QUICKFIRE_MS / 1000}s) linear forwards;
}

/* ── THE PORTRAIT (doc 44 §3.1.5) ───────────────────────────────────────────
   The asker's own painted art, inside the card, in the book's materials: the
   gouache cream field and amber contour every other painted surface in this
   overlay wears. Deliberately UNANIMATED — a portrait that flew in would fight
   the card it arrives inside, and an unanimated class needs no end-state
   clause because its base style is the only state it has. */
.pb-portrait {
  display: block;
  margin: 0 auto 8px;
  width: min(130px, 34%);
  min-width: 88px;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 2px solid #c9a36a;
  background: #fffdf5 radial-gradient(120% 100% at 50% 12%, rgba(255, 255, 255, 0.9), rgba(233, 219, 186, 0.55));
  box-shadow: inset 0 1px 6px rgba(120, 96, 52, 0.22), 0 2px 8px rgba(30, 20, 10, 0.16);
  overflow: hidden;
}
.pb-portrait img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 6px;
  box-sizing: border-box;
}

/* ── THE RESOLUTION BEAT · 1 · the answer flies home (doc 44 §3.1.7) ────────
   v0 »dg-bs-letter-fly«, verbatim: 460 ms per letter on the same curve, the
   per-char stagger applied inline (120 + i × 55 ms). Long answers glide back
   whole instead — »dg-bs-word-glide«, 560 ms after 140 ms. */
@keyframes pb-letter-fly {
  from { opacity: 0; transform: translateY(-46px) scale(0.4) rotate(-18deg); }
  60%  { opacity: 1; transform: translateY(4px) scale(1.08) rotate(3deg); }
}
.pb-letter { animation: pb-letter-fly ${LETTER_FLY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@keyframes pb-word-glide { from { opacity: 0; transform: translateY(-30px) scale(0.7); } }
.pb-word { animation: pb-word-glide ${WORD_GLIDE_MS}ms ${WORD_GLIDE_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

/* ── THE RESOLUTION BEAT · 2 · the card gets out of the way ─────────────────
   THE RESTORE-HOLD (doc 42 §3): the world's change is the thing to watch, so
   the veil and the card leave before it plays and the celebration waits until
   it has finished. The fade takes the veil's own 160 ms, run backwards.
   END STATE: gone — with animations killed the world is simply visible, which
   is the finished picture of this beat, not a stuck one. */
@keyframes pb-doff { from { opacity: 1; } }
.pb-doff {
  opacity: 0;
  pointer-events: none;
  animation: pb-doff 160ms ease-in;
}

/* ── the verdict beat — now the LAST beat, after the world has changed ───── */
@keyframes pb-verdict-in {
  0%   { opacity: 0; transform: scale(0.6); }
  45%  { opacity: 1; transform: scale(1.14); }
  100% { opacity: 1; transform: scale(1); }
}
.pb-verdict { animation: pb-verdict-in 260ms cubic-bezier(0.2, 0.9, 0.25, 1.2); }

/* ── the boot ceremony: a page of the book turning toward the reader ───── */
@keyframes pb-page-in {
  from { opacity: 0; transform: perspective(900px) rotateY(-26deg) translateX(-16px); }
}
.pb-page {
  transform-origin: left center;
  animation: pb-page-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}

/* ── the world fades up once the child says „Los geht's!" ──────────────── */
@keyframes pb-world-in { from { opacity: 0; } }
.pb-world-in { animation: pb-world-in 240ms ease-out; }

/* ── THE END-STATES LAW: every animated class above, killed ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .pb-veil, .pb-wipe, .pb-card, .pb-ring, .pb-verdict, .pb-page, .pb-world-in,
  .pb-letter, .pb-word, .pb-doff {
    animation: none !important;
  }
}
`;
