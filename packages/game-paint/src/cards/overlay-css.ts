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
// ── PK-R6 · H1 · WHAT THE ROUND-1 CRITIC SAW (blind screenshot judging) ─────
// Five of the ten findings were about THIS file, and they were all one defect
// wearing five coats: the overlay was drawn as app UI laid over a painting
// instead of as another painted surface, and its motion beats had no picture at
// any single frame. Fixed here, finding by finding:
//
//  · „the ink iris shows no iris — just a uniform darken". True: the blob went
//    opaque edge to edge at its peak, which is a dim, not a wipe. It now carries
//    a real APERTURE — a clear ink-rimmed opening over the being the card is
//    about — so a mid-wipe frame reads as an iris closing on that being.
//  · „the quiz card and buttons are generic flat app UI". True: a cream
//    rectangle with a 14 px radius. The card is now painted parchment with a
//    deckled edge and a hand-inked inner rule (100 % code, zero assets — B14),
//    and it lives HERE rather than in two inline copies, so the task card and
//    the ceremony panels can no longer drift apart.
//  · „the letter-fly frame is washed out and illegible". True: every letter was
//    invisible until its own turn, so mid-stagger frames were fragments. Each
//    letter now flies into a CHALK GHOST of itself — the word is legible from
//    the first frame and the flight inks it in.
//  · „the card landing shows no landing". True: it eased in and stopped. It now
//    overshoots, settles, and blooms a contact shadow under itself.
//  · „the panel floats on one edge with no link to what it interrupts". The
//    panel may NOT move to the centre (PB-F1/F2-20: a card is put down away from
//    the being it talks about, because the centred panel used to cover exactly
//    the thing it says to look at) — so the LINK is built instead: the veil's
//    light and the iris aperture both sit over the being, and an ink thread
//    reaches from the card toward it.
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
 *  the world comes back. Short — it is a nod, not a ceremony.
 *
 *  PK-R6 · H1: the beat now has to carry a seal being stamped, a ray flash and
 *  a spark ring (finding 7 — „the celebration has no juice"), so it runs long
 *  enough for that flourish to be SEEN. Still a nod: 720 ms is under a second. */
export const VERDICT_MS = 720;
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

/** PK-R6 · H1 · WHERE THE MOMENT IS, as a percentage of the canvas width.
 *  The card is always put down AWAY from the being it talks about (PB-F1/F2-20),
 *  so its `align` already names which side the being is on — and that is the one
 *  fact the veil's light, the iris aperture and the ink thread all need. One
 *  value, three readers, no chance of them disagreeing about where to look. */
export const focusPctFor = (align: "left" | "center" | "right"): string =>
  align === "right" ? "28%" : align === "left" ? "72%" : "50%";

export const PAINT_OVERLAY_CSS = `
/* ── the ink-wash veil ─────────────────────────────────────────────────── */
/* PK-R6 · H1 (finding 9): the veil's LIGHT sits over the being the card is
   about — »--pb-focus«, set by the shell from the card's own align. A dim
   centred on the middle of the screen while the action is at the left edge is
   a composition that ignores its own subject.
   And it arrives in TWO STAGES on purpose (finding 1): the contact burst is
   thrown into the world at the instant the card opens, so a veil that reached
   full ink in one ramp buried the impact it was supposed to punctuate. The
   world therefore stays legible for the first ~110 ms — the burst's brightest
   moment — and the ink closes over it after. */
@keyframes pb-veil-in {
  from { opacity: 0; }
  36%  { opacity: 0.3; }
}
.pb-veil {
  background:
    radial-gradient(120% 90% at var(--pb-focus, 50%) 45%, rgba(30,24,12,0.06), rgba(30,24,12,0.56)) !important;
  /* the bloom below is bigger than the canvas — clip it to the page */
  overflow: hidden;
  animation: pb-veil-in 300ms ease-out;
}

/* ── the world behind the card, out of focus ───────────────────────────────
   PK-R6 · H2 (round-2 finding 6): „the card sits right-of-center, cutting a
   floating shelf/platform in half at the frame edge behind it" — the strip of
   world left showing beside the card read as a framing mistake rather than as a
   backdrop.
   The card may NOT be centred to fix that: it is put down AWAY from the being it
   talks about (PB-F1/F2-20), and centring it would park it over the very thing
   step 1 asks the child to look at. So the fixDirection's other half is taken —
   the exposed strip is pushed out of focus, which is what turns a cut-off
   classroom into a background.
   It is its own layer and not a filter on the veil, because the CARD is a child
   of the veil: a mask there would eat the card with the world.
   And the mask is the whole care in it — the blur is absent over »--pb-focus«
   and full at the frame's edges, so the being the card is about stays sharp.
   The restore-hold exists precisely so the child can WATCH the colour come back
   to that being; a blur over it would undo the payoff this whole beat was built
   for. Where a browser has neither backdrop-filter nor masks, nothing is drawn
   and the veil's ink does exactly what it did before. */
.pb-defocus {
  position: absolute;
  inset: 0;
  pointer-events: none;
  backdrop-filter: blur(2.6px) saturate(0.86);
  -webkit-backdrop-filter: blur(2.6px) saturate(0.86);
  mask-image: radial-gradient(46% 52% at var(--pb-focus, 50%) 48%,
    rgba(0,0,0,0) 0 30%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,1) 100%);
  -webkit-mask-image: radial-gradient(46% 52% at var(--pb-focus, 50%) 48%,
    rgba(0,0,0,0) 0 30%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,1) 100%);
}

/* ── THE INK IRIS that wipes the world before the card lands ───────────────
   doc 44 §3.1.1, ported from the v0 build's »dg-bs-swirl« with its timings
   verbatim: the blob's own curve (0 → 42 % → 58 % → 100 %, rotating 0/16/20/−12°),
   its 700 ms on cubic-bezier(0.6, 0, 0.4, 1), and the SECOND blob 60 ms behind
   it over 640 ms with the mirrored border-radius. Two blobs is the whole trick:
   one border-radius blob swelling from the centre reads as a circle, two
   offset ones read as ink running over the page. 100 % CSS, zero assets (B14).

   PK-R6 · H1 (finding 2 — „no iris shape at all, just a uniform darken"): the
   blob was opaque from edge to edge at its peak, so its whole middle third of
   a second was a flat screen-dim with a rotation nobody could see. It now
   carries an APERTURE: a clear, ink-rimmed opening at the blob's own centre,
   and the blob is centred on the BEING (»--pb-focus«) rather than on the
   canvas. So the peak frame — the one the harness caught — is an ink iris
   closed around the creature that just spoke, with the burst still visible
   inside it. The two blobs' apertures sit a little apart, which is what keeps
   the opening an ink blot rather than a lens flare.
   The aperture rides the blob's own centre so the 20° swing rotates the ink
   AROUND the opening instead of dragging the opening off the being. */
@keyframes pb-wipe {
  0%   { transform: translate(-50%, -50%) scale(0)    rotate(0deg); }
  42%  { transform: translate(-50%, -50%) scale(1.06) rotate(16deg); }
  58%  { transform: translate(-50%, -50%) scale(1.06) rotate(20deg); }
  100% { transform: translate(-50%, -50%) scale(0)    rotate(-12deg); }
}
/* PK-R6 · H2 (round-2 finding 5 — „the iris edge is a perfectly smooth radial
   Gaussian blur with no irregular or brushed boundary; it reads as a generic
   digital spotlight rather than as part of the painted world"). Fair, and the
   cause was one line: the aperture was ONE radial-gradient, and a radial
   gradient's edge is a mathematically perfect circle with a perfectly even
   falloff — the one boundary nothing in a painted book has.

   It is now built the way ink actually behaves on paper, in three moves and
   still with zero assets (B14):
    · the falloff is STEPPED rather than smooth — five stops at uneven distances,
      so the wash pools and breaks the way a brush leaves it instead of ramping
      like a lens;
    · four DRIPS bite into the rim from four different angles, each its own
      squashed ellipse at its own distance, so the opening is nowhere circular;
    · two SPATTERS sit outside it, because a blot that landed threw something.
   The drips are listed BEFORE the field on purpose: CSS paints background
   layers front to back, so a drip listed after the field would be hidden behind
   the very ink it is supposed to be biting into. */
.pb-wipe {
  position: absolute;
  left: var(--pb-focus, 50%);
  top: 50%;
  width: 165%;
  height: 165%;
  border-radius: 43% 57% 52% 48% / 46% 49% 51% 54%;
  background:
    radial-gradient(ellipse 2.6% 1.5% at 44.5% 41.5%, #17100a 0 62%, rgba(23,16,9,0) 100%),
    radial-gradient(ellipse 1.7% 2.9% at 55.5% 44%, #17100a 0 58%, rgba(23,16,9,0) 100%),
    radial-gradient(ellipse 3.1% 1.3% at 52% 53.5%, #1a120b 0 60%, rgba(26,18,11,0) 100%),
    radial-gradient(ellipse 1.4% 2.2% at 46% 52%, #1a120b 0 56%, rgba(26,18,11,0) 100%),
    radial-gradient(ellipse 0.7% 0.7% at 41% 47%, #17100a 0 70%, rgba(23,16,9,0) 100%),
    radial-gradient(ellipse 0.5% 0.6% at 58% 51%, #17100a 0 70%, rgba(23,16,9,0) 100%),
    radial-gradient(ellipse 8% 8% at 50% 47%,
      rgba(23,16,9,0) 0 52%,
      rgba(23,16,9,0.14) 61%,
      rgba(23,16,9,0.2) 66%,
      rgba(23,16,9,0.72) 79%,
      #17100a 96%,
      #4a3a22 210%,
      #2a2216 560%);
  opacity: 0.9;
  pointer-events: none;
  /* END STATE: gone. With animations off there is no wipe at all. */
  transform: translate(-50%, -50%) scale(0);
  animation: pb-wipe ${IRIS_MS}ms cubic-bezier(0.6, 0, 0.4, 1) forwards;
}
/* the second blob — same keyframes, mirrored radius, a beat behind (v0
   ».dg-bs-swirl-blob-b«, verbatim). It declares no »animation« shorthand of
   its own on purpose: it rides ».pb-wipe«'s, so the reduced-motion kill list
   covers both by covering one. Its aperture sits a little down and across from
   the first one — the offset IS the ink. */
.pb-wipe-b {
  left: calc(var(--pb-focus, 50%) + 2.6%);
  top: 53%;
  border-radius: 57% 43% 48% 52% / 51% 54% 46% 49%;
  background:
    radial-gradient(ellipse 2.2% 1.4% at 56% 42.5%, #1a120b 0 60%, rgba(26,18,11,0) 100%),
    radial-gradient(ellipse 1.3% 2.6% at 45% 46%, #1a120b 0 56%, rgba(26,18,11,0) 100%),
    radial-gradient(ellipse 2.8% 1.2% at 49% 54%, #241d13 0 58%, rgba(36,29,19,0) 100%),
    radial-gradient(ellipse 0.6% 0.7% at 60% 45%, #1a120b 0 70%, rgba(26,18,11,0) 100%),
    radial-gradient(ellipse 9% 8.4% at 50% 47%,
      rgba(23,16,9,0) 0 50%,
      rgba(23,16,9,0.12) 60%,
      rgba(23,16,9,0.18) 65%,
      rgba(23,16,9,0.66) 78%,
      #1a120b 96%,
      #3f3320 205%,
      #241d13 540%);
  opacity: 0.72;
  animation-delay: ${IRIS_B_DELAY_MS}ms;
  animation-duration: ${IRIS_B_MS}ms;
}

/* ── the card is a PAGE OF THE BOOK, and it lands ──────────────────────────
   PK-R6 · H1, findings 3 and 10. Two things were wrong and they had the same
   root: the card was styled inline, twice (the task card and the ceremony
   panels each carried their own copy of „cream box, 2 px amber, radius 14"),
   and neither copy was painted. Both are now THIS rule — one painted surface
   both surfaces wear, so the book's card can never again be two cards.

   The paper is layered gradients, no image: a warm sheet, a lit top-left
   corner, a shaded bottom-right, two faint blooms where the wash pooled, and
   two crossing fibre grains. The edge is deckled (an irregular border-radius,
   the way a torn book page is never a rounded rectangle), and the ::before rule
   below draws the hand-inked border a printed page carries inside its trim.

   THE LANDING (finding 10): it used to ease from 16 px below to rest, which
   is an appearance, not an arrival. It now overshoots a hair past its size,
   settles back, and blooms its contact shadow from nothing to deep and back —
   so the frame the harness catches has weight in it. The mined 420 ms / 260 ms
   are untouched; only the curve inside them is now a landing. */
@keyframes pb-card-in {
  0%   { opacity: 0; transform: translateY(18px) scale(0.93); box-shadow: 0 2px 7px rgba(26,17,8,0.12); }
  62%  { opacity: 1; transform: translateY(-3px) scale(1.028); box-shadow: 0 26px 62px rgba(26,17,8,0.5); }
}
.pb-card {
  position: relative;
  padding: 18px 22px;
  text-align: center;
  color: #3b3122;
  /* doc 42 §5 · B19: the three faces are already loaded app-wide — the overlays
     simply start using them (prompts → body, headlines → display, chips → label) */
  font-family: var(--font-body, system-ui, sans-serif);
  background-color: #ffeec4;
  background-image:
    radial-gradient(120% 85% at 14% 4%, rgba(255,253,244,0.95), rgba(255,253,244,0) 58%),
    radial-gradient(85% 70% at 92% 98%, rgba(186,152,96,0.34), rgba(186,152,96,0) 62%),
    radial-gradient(34% 26% at 68% 30%, rgba(170,138,84,0.16), rgba(170,138,84,0) 74%),
    radial-gradient(26% 34% at 22% 74%, rgba(170,138,84,0.13), rgba(170,138,84,0) 76%),
    radial-gradient(18% 46% at 46% 58%, rgba(176,142,88,0.1), rgba(176,142,88,0) 78%),
    radial-gradient(52% 16% at 76% 62%, rgba(255,253,244,0.5), rgba(255,253,244,0) 72%),
    /* ONE fibre direction, long period, barely there. Two crossing grains at
       7 px read as squared exercise paper rather than as a sheet — caught in
       the render, which is why the render happens before the commit. */
    repeating-linear-gradient(97deg, rgba(146,114,64,0.035) 0 1px, rgba(146,114,64,0) 1px 23px);
  border: 3.5px solid #8a5a2b;
  border-radius: 17px 23px 15px 21px / 21px 15px 23px 17px;
  box-shadow:
    /* the sheets under this one: the card is the top page of a book, not a
       rectangle in mid-air (blind critic on the exemplar) */
    5px 6px 0 -2px rgba(255,238,196,0.95),
    6px 7px 0 -1px rgba(138,90,43,0.55),
    10px 12px 0 -4px rgba(255,238,196,0.85),
    11px 13px 0 -3px rgba(138,90,43,0.4),
    0 12px 34px rgba(26,17,8,0.42),
    inset 0 0 0 1px rgba(255,251,238,0.7),
    inset 0 0 30px rgba(150,116,64,0.2);
  animation: pb-card-in ${CARD_ENTER_MS}ms ${CARD_ENTER_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}
/* R5-W1 · D1 — THE PAGE, not a panel. Blind critic on the exemplar: „a
   drop-shadowed rectangle … a floating modal". Two marks fix that, both free:
   the SHEETS UNDER IT (two offset paper edges, so the card is the top page of
   a book rather than one rectangle in mid-air) and the TURNED CORNER at the
   bottom right, where a page you are about to turn lifts off the one beneath.
   Pointer-transparent, so neither ever eats a tap. */
.pb-card::after {
  content: "";
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 34px;
  height: 34px;
  pointer-events: none;
  border-bottom-right-radius: 20px;
  background:
    linear-gradient(315deg, #e6d5ac 0%, #f3e8ce 42%, rgba(243,232,206,0) 43%),
    linear-gradient(315deg, rgba(120,92,50,0.34) 0%, rgba(120,92,50,0) 46%);
  box-shadow: -2px -2px 5px rgba(70,52,26,0.16);
}
/* the hand-inked rule inside the trim — the mark that makes a sheet of paper
   read as a PAGE. Pointer-transparent, so it never eats a tap. */
.pb-card::before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 2px solid rgba(138,90,43,0.5);
  border-radius: 13px 18px 11px 16px / 16px 11px 18px 13px;
  pointer-events: none;
}

/* ── every control on the card is a painted chip ───────────────────────────
   Finding 3's second half: the answer buttons were web-form buttons — flat
   fill, 9 px radius, one hairline. A chip now carries the same paper as the
   card it sits on, an ink edge that is not quite straight, and a lifted lip
   that presses in under the finger. The inline styles that build these buttons
   keep only their LAYOUT, so this is the single place their look lives. */
.pb-card button, .pb-card .pb-chip {
  background-color: #fff6d8;
  background-image:
    radial-gradient(120% 100% at 28% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 68%),
    radial-gradient(70% 60% at 84% 100%, rgba(176,142,88,0.16), rgba(176,142,88,0) 70%),
    repeating-linear-gradient(97deg, rgba(146,114,64,0.035) 0 1px, rgba(146,114,64,0) 1px 19px);
  border: 2.5px solid #8a5a2b;
  border-radius: 11px 8px 12px 9px / 9px 12px 8px 11px;
  box-shadow:
    0 3px 0 rgba(138,90,43,0.55),
    0 3px 9px rgba(40,28,12,0.16),
    inset 0 1px 0 rgba(255,253,244,0.9);
  color: #3d3122;
  transition: transform 90ms ease-out, box-shadow 90ms ease-out;
}
.pb-card button:active:not(:disabled) {
  /* the tilt rides along, or a pressed chip would snap square under the finger
     (see THE CROOKED CHIPS below) */
  transform: translateY(2px) rotate(var(--pb-tilt, 0deg));
  box-shadow: 0 0 0 rgba(138,90,43,0.55), 0 1px 4px rgba(40,28,12,0.18), inset 0 1px 3px rgba(120,92,50,0.28);
}
.pb-card button:disabled { opacity: 0.55; box-shadow: inset 0 1px 4px rgba(120,92,50,0.24); }

/* ── R5-W1 · D2 · THE CROOKED CHIPS (Kokis Tor G2: „Grad 1 mit schiefen Chips
   aus Grad 2") ──────────────────────────────────────────────────────────────
   Koki's own words for the look he wants: „it can be a bit messy — think of
   naive design". So the ANSWER chips are laid on by hand: no two at the same
   angle, none of them quite straight. It is deliberately only the answers —
   the ceremony's own „Los geht's!" and „Weiter" stay square, because a page's
   one forward step is not a scrap of paper somebody dropped on the desk.

   The angle rides in a custom property rather than in the transform itself,
   so pressing a chip can add its dip without straightening it out. */
.pb-card [data-chips] > button { transform: rotate(var(--pb-tilt, 0deg)); }
/* Every angle at least a degree, and every one the other way from its
   neighbour: the first cut used 0.7° and 0.8° for two of the four, and a blind
   critic read the row as „only 2 of 4 tilted — a bug, not a style". A crooked
   thing has to be crooked ENOUGH to be on purpose. */
.pb-card [data-chips] > button:nth-child(4n+1) { --pb-tilt: -1.4deg; }
.pb-card [data-chips] > button:nth-child(4n+2) { --pb-tilt: 1.2deg; }
.pb-card [data-chips] > button:nth-child(4n+3) { --pb-tilt: 1deg; }
.pb-card [data-chips] > button:nth-child(4n+4) { --pb-tilt: -1.1deg; }

/* ── the ink thread from the card to the being it interrupts ───────────────
   PK-R6 · H1, finding 9. The panel may not move to the middle — PB-F1/F2-20
   put it on this side precisely so it would stop covering the thing it tells
   the child to look at. So instead of moving the card, the composition is
   given the link it was missing: a brush stroke leaving the card's world-facing
   edge, thinning as it goes, with a warm bead at its tip pointing at the being.
   It arrives with the card and then simply IS the picture (no loop), so the
   reduced-motion end state is a finished thread rather than a stub. */
@keyframes pb-thread-in { from { opacity: 0; transform: scaleX(0.15); } }
.pb-tether {
  position: absolute;
  top: 44%;
  width: 108px;
  height: 5px;
  pointer-events: none;
  border-radius: 5px;
  filter: drop-shadow(0 0 6px rgba(226,186,110,0.45));
  animation: pb-thread-in 460ms 300ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}
.pb-tether::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,247,220,0.98), rgba(226,186,110,0.7) 48%, rgba(226,186,110,0) 100%);
  box-shadow: 0 0 16px rgba(244,212,142,0.85);
}
.pb-tether-l {
  right: 100%;
  transform-origin: right center;
  background: linear-gradient(to left, rgba(226,186,110,0.92) 0%, rgba(198,156,88,0.6) 40%, rgba(180,140,78,0.18) 76%, rgba(180,140,78,0) 100%);
}
.pb-tether-l::after { right: -6px; margin-top: -6.5px; }
.pb-tether-r {
  left: 100%;
  transform-origin: left center;
  background: linear-gradient(to right, rgba(226,186,110,0.92) 0%, rgba(198,156,88,0.6) 40%, rgba(180,140,78,0.18) 76%, rgba(180,140,78,0) 100%);
}
.pb-tether-r::after { left: -6px; margin-top: -6.5px; }

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
  border-radius: 14px 11px 15px 12px / 12px 15px 11px 14px;
  border: 2px solid #b78d51;
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
   whole instead — »dg-bs-word-glide«, 560 ms after 140 ms.

   PK-R6 · H1, finding 4 („almost entirely washed out and illegible"). The
   critic was right and the cause was structural, not a colour: every letter sat
   at opacity 0 until its own delay elapsed, so at ANY instant mid-stagger the
   word on screen was a fragment plus a few half-faded glyphs in the air. Two
   fixes, both keeping the mined numbers:
     · every letter flies into a CHALK GHOST of itself (»pb-slot«), so the whole
       word is readable from the first frame and the flight INKS it in — which
       is also the truer picture: the word was always there, the child gave it
       back.
     · the letter reaches full ink by 38 % of its flight instead of 60 %, and
       travels a shorter, tighter arc, so it reads as one word arriving rather
       than as loose glyphs drifting.

   PK-R6 · H2, finding 3 („a second, smaller, misaligned »w« floats above the
   word between the »o« and the real »wn«, and the settled letters are three
   different colours"). Both halves were real and both were arithmetic:
     · THE DOUBLE. H1's chalk ghost fixed the legibility, and the flight's own
       −24 px / 0.58× arc then lifted the flying glyph completely CLEAR of the
       ghost it was landing into — so through the first third of every letter's
       flight the word carried that character twice, once pale in the line and
       once small in the air above it. The arc is now short enough (−9 px,
       0.86×) that a glyph always overlaps its own ghost: one letter, with a
       tail, instead of two letters. The mined 460 ms and the 55 ms stagger are
       untouched; only the distance inside them changed.
     · THE THREE COLOURS. The ghost was a warm brown (rgba(122,96,52)) under an
       ink-brown letter (#33291a), so a word mid-stagger showed settled ink,
       half-inked blend and warm ghost — three hues, which is what the critic
       counted. The ghost is now the SAME ink at a lower strength, so the word
       is one colour filling in rather than three inks arriving. */
@keyframes pb-letter-fly {
  from { opacity: 0; transform: translateY(-6px) scale(0.9) rotate(-4deg); }
  26%  { opacity: 1; }
  64%  { transform: translateY(1.5px) scale(1.05) rotate(1deg); }
}
.pb-letter { animation: pb-letter-fly ${LETTER_FLY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@keyframes pb-word-glide { from { opacity: 0; transform: translateY(-9px) scale(0.9); } 34% { opacity: 1; } }
.pb-word { animation: pb-word-glide ${WORD_GLIDE_MS}ms ${WORD_GLIDE_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
/* the chalk ghost the flying letter lands into — the same character, drawn
   faintly underneath in the same slot. Unanimated: it is the still picture the
   flight arrives at, which is exactly what the end-states law asks a base
   style to be. */
.pb-slot { position: relative; display: inline-block; }
.pb-slot::before {
  content: attr(data-ch);
  position: absolute;
  left: 0;
  top: 0;
  color: rgba(51, 41, 26, 0.28);
  pointer-events: none;
}

/* ── THE RESOLUTION BEAT · 2 · the card gets out of the way ─────────────────
   THE RESTORE-HOLD (doc 42 §3): the world's change is the thing to watch, so
   the veil and the card leave before it plays and the celebration waits until
   it has finished. The exit is quicker than the entrance on purpose — a card
   taking its time to leave would compete with the change it is uncovering.
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
  0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  45%  { opacity: 1; transform: scale(1.14) rotate(3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
.pb-verdict { animation: pb-verdict-in 260ms cubic-bezier(0.2, 0.9, 0.25, 1.2); }

/* ── THE FLOURISH the celebration was missing ──────────────────────────────
   PK-R6 · H1, finding 7: „no confetti, particles, light, screen response or
   character reaction — a static bubble and a flat checkmark". The world's own
   half of this (sparks and a ray flash ON the freed thing) is in PaintScene;
   this is the card's half, drawn in CSS with no assets (B14): a warm ray fan
   opening behind the seal, and a ring of chalk-and-amber motes thrown outward.
   Both END at nothing, which is what makes them safe to kill: a reduced-motion
   child sees the seal alone, and the seal is the whole message. */
@keyframes pb-rays-in {
  from { opacity: 0; transform: scale(0.35) rotate(-16deg); }
  45%  { opacity: 0.9; }
  to   { opacity: 0; transform: scale(1.55) rotate(12deg); }
}
.pb-rays {
  opacity: 0;
  pointer-events: none;
  /* soft and blurred on purpose: hard-edged wedges read as a pinwheel, which is
     what the first render of this actually looked like — light has no edges */
  background: conic-gradient(from 0deg,
    rgba(255,236,178,0.55) 0deg 7deg, rgba(255,236,178,0) 7deg 45deg,
    rgba(255,236,178,0.4) 45deg 51deg, rgba(255,236,178,0) 51deg 90deg,
    rgba(255,236,178,0.55) 90deg 97deg, rgba(255,236,178,0) 97deg 135deg,
    rgba(255,236,178,0.4) 135deg 141deg, rgba(255,236,178,0) 141deg 180deg,
    rgba(255,236,178,0.55) 180deg 187deg, rgba(255,236,178,0) 187deg 225deg,
    rgba(255,236,178,0.4) 225deg 231deg, rgba(255,236,178,0) 231deg 270deg,
    rgba(255,236,178,0.55) 270deg 277deg, rgba(255,236,178,0) 277deg 315deg,
    rgba(255,236,178,0.4) 315deg 321deg, rgba(255,236,178,0) 321deg 360deg);
  filter: blur(3px);
  mask-image: radial-gradient(circle, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.85) 44%, rgba(0,0,0,0) 72%);
  -webkit-mask-image: radial-gradient(circle, rgba(0,0,0,0.1) 22%, rgba(0,0,0,0.85) 44%, rgba(0,0,0,0) 72%);
  animation: pb-rays-in 620ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes pb-spark-out {
  from { opacity: 0; transform: translate(0, 0) scale(0.2); }
  28%  { opacity: 1; }
  to   { opacity: 0; transform: translate(var(--pb-dx, 0px), var(--pb-dy, 0px)) scale(0.85); }
}
.pb-spark {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  border-radius: 50%;
  animation: pb-spark-out 640ms cubic-bezier(0.18, 0.7, 0.3, 1) forwards;
}

/* ── PK-R6 · H1 · THE CEREMONY SURFACES (round-1 critique, the ceremonies set)
   Five findings, one root: the goal card, the score page and the door out are
   the three moments the chapter STOPS for, and all three were dressed as web
   modals over a painting. What follows is their paint. The task card is not
   touched — it has its own packet and its own critic. ────────────────────── */

/* THE SCRIM (finding 7: „hooks, towels, idle character and props remain sharp
   and high-contrast behind the modal"). The task card's veil deliberately keeps
   the world bright where the BEING is, because the card is talking about that
   being. A ceremony talks to the CHILD: there is nothing behind it to look at,
   and doc 44 §3.1.2's own words are „radial veil to near-black, world faintly
   visible". At 0.06 alpha in the middle the world was neither. So a ceremony
   wears a deeper wash and pushes the world out of focus behind it — the blur is
   what turns a busy classroom wall into a backdrop, and where a browser has no
   backdrop-filter the wash alone still does the job. */
.pb-veil.pb-veil-deep {
  background:
    radial-gradient(125% 95% at 50% 46%, rgba(26,19,9,0.5), rgba(20,15,7,0.85)) !important;
  backdrop-filter: blur(3px) saturate(0.82);
  -webkit-backdrop-filter: blur(3px) saturate(0.82);
}

/* THE ACTION HIERARCHY (finding 8: „every ceremony button uses identical
   styling regardless of action weight"). „Los geht's!" starts the chapter and
   „← Zurück" leaves it, and they were the same white pill. The primary action
   is now the warm one — amber paper, a deeper lip, the ink edge a shade
   stronger — and the way out is the quiet one. Both keep the painted chip
   underneath (they are the same object, differently lit), so this is a
   hierarchy inside the book's materials rather than two unrelated buttons. */
.pb-card button.pb-btn-primary, .pb-card a.pb-btn-primary {
  background-color: #f0c473;
  background-image:
    radial-gradient(120% 100% at 26% 0%, rgba(255,248,224,0.92), rgba(255,248,224,0) 66%),
    radial-gradient(80% 70% at 86% 100%, rgba(150,104,38,0.3), rgba(150,104,38,0) 72%),
    repeating-linear-gradient(97deg, rgba(122,86,34,0.05) 0 1px, rgba(122,86,34,0) 1px 17px);
  border-color: #9a6a28;
  color: #402d10;
  box-shadow:
    0 3px 0 rgba(122,86,34,0.5),
    0 5px 14px rgba(52,34,10,0.26),
    inset 0 1px 0 rgba(255,252,236,0.85);
}
.pb-card button.pb-btn-primary:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 0 0 rgba(122,86,34,0.5), 0 1px 5px rgba(52,34,10,0.22), inset 0 1px 4px rgba(120,80,26,0.3);
}
.pb-card .pb-btn-ghost {
  background-color: rgba(253,246,228,0.62);
  background-image: none;
  border-color: rgba(160,124,70,0.5);
  color: #6b5c40;
  box-shadow: inset 0 0 0 1px rgba(255,253,244,0.55);
}

/* THE TALLY (finding 4's count-up half). Digits that change every frame must
   not shove the line around while they do it — a number that jitters as it
   counts reads as a glitch, not as a fanfare. */
.pb-count { font-variant-numeric: tabular-nums; }

/* …and the line each tally is written on: a brush stroke that thins out at both
   ends, not the 1 px dashed border a form uses to separate its fields. */
.pb-score-row { position: relative; }
.pb-score-row::after {
  content: "";
  position: absolute;
  left: 2px;
  right: 2px;
  bottom: 0;
  height: 1.6px;
  border-radius: 2px;
  background: linear-gradient(90deg,
    rgba(150,116,64,0) 0%, rgba(150,116,64,0.5) 7%, rgba(150,116,64,0.26) 48%,
    rgba(150,116,64,0.46) 86%, rgba(150,116,64,0) 100%);
  pointer-events: none;
}

/* THE CHILD ARRIVES (findings 4 + 6: „character idle in the corner, no effects"
   / „consistently tiny and pushed to a frame corner"). He comes UP onto the
   page — a hop that overshoots and settles, so the score card opens on somebody
   jumping rather than on a checklist. END STATE: standing on the page in his
   cheer, which is the finished picture this beat exists to show. */
/* PK-R6 · H2 · a score row ARRIVES — the page writes itself line by line
   (round-2 ceremonies finding 6). Base styles are the finished state (the
   reduced-motion law): the animation runs FROM the offset, and \`backwards\`
   holds that offset through each row's stagger delay. */
@keyframes pb-row-in {
  from { opacity: 0; transform: translateY(7px); }
}
.pb-row-in { animation: pb-row-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

/* …and the light behind the door out: a painterly bloom, breathing — radial
   falloff only, no edge anywhere (the beam law, applied to the UI). Its base
   state is the lit resting glow, so killing the animation leaves warm light,
   not darkness. */
@keyframes pb-door-bloom {
  50% { opacity: 0.85; transform: scale(1.045); }
}
.pb-door-bloom {
  position: absolute; inset: -7% -9%;
  background: radial-gradient(ellipse 60% 55% at 50% 46%, rgba(255, 232, 168, 0.55), rgba(255, 232, 168, 0.22) 55%, rgba(255, 232, 168, 0) 78%);
  opacity: 0.65; pointer-events: none;
  animation: pb-door-bloom 3600ms ease-in-out infinite;
}

@keyframes pb-hero-in {
  0%   { opacity: 0; transform: translateY(30px) scale(0.84); }
  58%  { opacity: 1; transform: translateY(-7px) scale(1.05); }
}
.pb-hero-in { animation: pb-hero-in 520ms 300ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

/* THE HUD CHIPS (finding 1: „plain cream rounded-rect … sitting directly on top
   of gorgeous watercolor"). The counters live OUTSIDE the canvas, on the page,
   which is exactly why they were the flattest thing on screen: a 999 px pill
   with a hairline border is a web badge. They now wear the card's own paper,
   its ink edge and its four different corners — the bar belongs to the book. */
.pb-hud-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 4px;
  white-space: nowrap;
  color: #5f5334;
  background-color: #fbf3dd;
  background-image:
    radial-gradient(120% 100% at 22% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 64%),
    radial-gradient(70% 60% at 88% 100%, rgba(176,142,88,0.2), rgba(176,142,88,0) 70%),
    repeating-linear-gradient(97deg, rgba(146,114,64,0.04) 0 1px, rgba(146,114,64,0) 1px 19px);
  border: 1.5px solid #b78d51;
  border-radius: 12px 8px 13px 9px / 9px 13px 8px 12px;
  box-shadow:
    0 2px 0 rgba(150,116,64,0.3),
    0 3px 8px rgba(40,28,12,0.16),
    inset 0 1px 0 rgba(255,253,244,0.9);
}

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

/* ══ R5-W1 · D1 · THE GLANCE GRAMMAR ═══════════════════════════════════════
   Koki, replay of 11 August: „man hängt im Lesen fest". The card was four
   equal lines of type with a small picture on top and the ENGLISH — the thing
   the game teaches — set smaller than everything else, inside the buttons.
   Nothing was marked, so a six-year-old had to read all of it to find the one
   line that says what to do.

   The fix is one hierarchy, applied to every card kind and every ceremony:
   PLATE (a picture) → KEY (one marked line) → QUIET (the rest, one step back)
   → ACT (big painted targets) → HELP (folded until earned). The sentences are
   untouched — they were already capped at 56 characters by the kurzweilig law
   (MAX_LINE_DE); what changes is which of them leads. */

/* THE PLATE — the picture a card leads with. Bigger than the old 88–130 px
   portrait slot, because doc 44 §3.1 rules that the asker's presence IS the
   card and a bare text card is not a legitimate surface. Deckled like every
   other painted thing in the book, so it reads as pasted-in rather than as an
   image element. */
/* the plate and whatever is pressed onto its corner travel together; the plate
   itself keeps clipping its picture, so the stamp lives in this wrapper rather
   than inside the frame it hangs off */
.pb-plate-wrap {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 8px;
}
.pb-plate {
  position: relative;
  width: fit-content;
  max-width: 100%;
  border: 3px solid #8a5a2b;
  border-radius: 15px 10px 16px 11px / 11px 16px 10px 15px;
  box-shadow: inset 0 2px 10px rgba(120,92,50,0.22), 0 3px 10px rgba(40,28,12,0.18);
  background-color: #fdf6e4;
  overflow: hidden;
  line-height: 0;
}
.pb-plate img { display: block; max-width: 100%; height: auto; }

/* R5-W1 · D2 · THE SCENE CUT — the plate as a WINDOW into the room the child is
   standing in, with the boy in it. The wash over the backdrop is what lets a
   painted figure read against a painted room: without it the two compete at the
   same value and the eye finds neither. */
.pb-scene {
  overflow: hidden;
  line-height: 0;
}
.pb-scene::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255,244,214,0.42), rgba(255,238,196,0.1) 45%, rgba(120,86,40,0.22)),
    radial-gradient(120% 80% at 50% 108%, rgba(70,48,20,0.3), rgba(70,48,20,0) 62%);
}
/* the figures paint over the wash, never under it */
.pb-scene > div { position: absolute; z-index: 1; }

/* THE KEY — the ONE marked line on a card, and the only emphasis device in
   the whole overlay (cards/emphasis.test.ts holds that: bold and <strong> may
   not be built by hand any more). Display face, because doc 42 §5 gives
   headlines to Fredoka; a chalk stroke under it, because a highlighter band
   would be app UI and this book marks things with a brush. */
.pb-key {
  position: relative;
  display: block;
  margin: 0 0 4px;
  padding: 0 2px 7px;
  font-family: var(--font-display, inherit);
  font-weight: 800;
  font-size: 23px;
  line-height: 1.16;
  color: #2a2114;
  text-wrap: balance;
}
/* the stroke: laid on by hand, so it is not quite level, thins at both ends
   and does not run the whole width of the line */
.pb-key::after {
  content: "";
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 0;
  height: 5px;
  border-radius: 5px;
  transform: rotate(-0.7deg);
  background: linear-gradient(90deg, rgba(200,110,40,0), #c86e28 22%, #8a5a2b 58%, rgba(138,90,43,0) 100%);
  pointer-events: none;
}
/* A LINE TOO LONG TO BE AN ASK leads without shouting: same face, less weight,
   less size, and no stroke. Blind critic, first full round: marking a whole
   ceremony sentence „bolds the whole paragraph indiscriminately". The
   threshold is the card law's own 56 characters (MAX_LINE_DE). */
.pb-key-long {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  padding-bottom: 0;
}
.pb-key-long::after { display: none; }

/* the English ask carries the book's own accent, so the lesson is also the
   warmest thing on the card rather than the smallest */
.pb-key-en { color: #a8541a; }

/* the inline half of the device: the one word or number inside a line that
   carries it. No stroke — a stroke under a fragment mid-sentence reads as a
   correction mark rather than as emphasis. */
.pb-key-bit {
  font-family: var(--font-display, inherit);
  font-weight: 800;
  color: #33291a;
}

/* THE QUIET LAYER — the fiction line and the story line, one step back: same
   ink, less of it. They are not hidden (a first-reader needs their German),
   they simply stop competing with the ask. */
.pb-quiet {
  margin: 0 0 3px;
  font-size: 12.5px;
  line-height: 1.35;
  color: #8a7a58;
}
.pb-quiet-i { font-style: italic; }

/* R5-W2 · I1 · THE READING CARD (cards/RulePage.tsx).
   Three static classes — no @keyframes, no transition — so the reduced-motion
   kill list stays exactly as long as the animated set it mirrors. The find beat
   gets its light from a painted gradient, not from movement: a page that pulses
   under a child who is trying to read is a page nobody reads. */
.pb-eyebrow {
  font-family: var(--font-label, inherit);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #a8926a;
  margin: 0 0 2px;
}
.pb-treasure {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6px 0 10px;
  min-height: 132px;
}
/* the warm pool the page was lying in, carried into the card so the find looks
   the same on both sides of the pickup */
.pb-treasure-glow {
  position: absolute;
  inset: -12% -18%;
  background: radial-gradient(ellipse at 50% 52%, rgba(255, 227, 164, 0.55) 0%, rgba(255, 227, 164, 0.22) 38%, rgba(255, 227, 164, 0) 72%);
  pointer-events: none;
}

/* THE VERB, STAMPED ON THE PICTURE. It was tried beside the ask first and read
   as a stray control floating at the card's left edge; pressed into the corner
   of the thing it acts on it is a seal, and it costs the card no height. */
.pb-stamp {
  position: absolute;
  right: -8px;
  bottom: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: #6f5a34;
  transform: rotate(-5deg);
  border-radius: 15px 12px 16px 13px / 13px 16px 12px 15px;
  background-color: #ffe1a4;
  background-image: radial-gradient(120% 100% at 26% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 66%);
  box-shadow: inset 0 0 0 2.5px rgba(138,90,43,0.9), 0 2px 7px rgba(40,28,12,0.3);
}

/* THE HELP FOLD — the hint ladder, folded until the child has earned a rung
   (cards/glance.ts owns when). Open, it is one short line per rung with its
   own painted mark; shut, it is a tab. It transitions, it never ANIMATES: an
   animated fold would need an entry in the end-states kill list, and a thing a
   child taps open is not part of the card's entrance. */
.pb-help { margin: 10px 0 0; text-align: left; }
.pb-card button.pb-help-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px 5px;
  font-size: 12.5px;
  font-family: var(--font-label, inherit);
  font-weight: 700;
  color: #8a5a2b;
}
.pb-help-body {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 180ms ease-out, opacity 140ms ease-out;
}
.pb-help[data-open="1"] .pb-help-body { max-height: 220px; opacity: 1; }
.pb-help-row {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 7px 2px 0;
  font-size: 13px;
  line-height: 1.4;
  color: #8a5a2b;
  font-family: var(--font-label, inherit);
}

/* ── THE END-STATES LAW: every animated class above, killed ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .pb-veil, .pb-wipe, .pb-card, .pb-ring, .pb-verdict, .pb-page, .pb-world-in,
  .pb-letter, .pb-word, .pb-doff, .pb-tether, .pb-rays, .pb-spark, .pb-hero-in,
  .pb-row-in, .pb-door-bloom {
    animation: none !important;
  }
}
`;
