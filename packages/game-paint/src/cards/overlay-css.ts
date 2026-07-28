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
/** The Lost-Pages choreography delay: the wipe goes first, the card lands after
 *  it (doc 42 §1). Kept in sync with the `pb-card` animation-delay below. */
export const CARD_ENTER_DELAY_MS = 240;

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

/* ── the ink bloom that wipes the world before the card lands ──────────── */
@keyframes pb-wipe {
  0%   { transform: translate(-50%, -50%) scale(0)    rotate(0deg); }
  44%  { transform: translate(-50%, -50%) scale(1.06) rotate(13deg); }
  60%  { transform: translate(-50%, -50%) scale(1.06) rotate(17deg); }
  100% { transform: translate(-50%, -50%) scale(0)    rotate(-9deg); }
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
  animation: pb-wipe 640ms cubic-bezier(0.6, 0, 0.4, 1) forwards;
}

/* ── the card springs in a beat after the wipe ─────────────────────────── */
@keyframes pb-card-in { from { opacity: 0; transform: translateY(16px) scale(0.94); } }
.pb-card { animation: pb-card-in 300ms 240ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

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
  animation: pb-ring-erase var(--pb-ring-s, 20s) linear forwards;
}

/* ── the verdict beat ──────────────────────────────────────────────────── */
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
  .pb-veil, .pb-wipe, .pb-card, .pb-ring, .pb-verdict, .pb-page, .pb-world-in {
    animation: none !important;
  }
}
`;
