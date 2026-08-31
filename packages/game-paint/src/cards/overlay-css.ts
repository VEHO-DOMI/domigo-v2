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

/* ── R5-W4 · D3 · F-30 · R52 · THE FOCUS MODE ──────────────────────────────
   Koki, 15 August, pointing at his own Keen run-mode: „alles ausgeblendet, nur
   die Aufgabe — gutes UI/UX; unsere schöne Karte sollte so getriggert werden,
   dass man sich voll darauf konzentriert und alles andere ausgeblendet ist."

   That reference is not another game — it is this repo's arcade lane
   (packages/game-2d/src/ArcadeGame.tsx), which puts its task on
   »radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.55), 0.9)« over a
   world it has taken almost to black. Read as a measurement, not copied as a
   style: the naive look stays exactly as J1 built it. (No backticks anywhere in
   this file: the whole stylesheet is one template literal and a backtick ends
   it — the rule is written at the bottom of the file and it caught this comment
   on the first typecheck.)

   The ink here is deep enough that the world reads as NIGHT rather than as
   dimmed — the target is a mean luminance of 15 % or less outside the card and
   the focus hole. What it may NOT do is put the world out entirely: the card
   is always ABOUT something standing over there (PB-F1/F2-20), the ink thread
   points at it, and a child who cannot see the thing being asked about has
   been given a quiz instead of a story. So the light stays over »--pb-focus«,
   which is still derived from the side the card was NOT put down on.

   »!important« for the same reason the base rule carries one: the wrapper
   writes a flat background inline, and this must win over both. */
.pb-veil.pb-veil-focus {
  background:
    radial-gradient(112% 88% at var(--pb-focus, 50%) 45%,
      rgba(26,19,9,0.58) 0%,
      rgba(22,16,7,0.92) 40%,
      rgba(16,11,5,0.965) 100%) !important;
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
/* R5-W4 · D3 · F-30 · in focus the sharp window closes in a little: with the
   world this dark, a wide clear patch reads as a hole in the ink rather than as
   the one thing still lit. The stops keep their shape (clear centre → full at
   the frame), so the focus-hole law and its test are untouched. */
.pb-veil-focus .pb-defocus {
  mask-image: radial-gradient(40% 46% at var(--pb-focus, 50%) 48%,
    rgba(0,0,0,0) 0 30%, rgba(0,0,0,0.5) 62%, rgba(0,0,0,1) 100%);
  -webkit-mask-image: radial-gradient(40% 46% at var(--pb-focus, 50%) 48%,
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
/* R5-W2 · J1-A: the landing carries THE LEAN. These keyframes overwrite
   »transform« wholesale, so a rotation that lived only in the base rule would
   fly in square and jerk crooked over the last frames — a snap no screenshot at
   rest can catch. The fallback is not decoration: an unresolvable var()
   invalidates the whole declaration, and a card with »transform: none« mid
   flight is a regression that a still image also cannot see. */
@keyframes pb-card-in {
  0%   { opacity: 0; transform: translateY(18px) scale(0.93) rotate(var(--pb-card-tilt, -1.1deg)); box-shadow: 0 2px 7px rgba(26,17,8,0.12); }
  62%  { opacity: 1; transform: translateY(-3px) scale(1.028) rotate(var(--pb-card-tilt, -1.1deg)); box-shadow: 0 26px 62px rgba(26,17,8,0.5); }
}
.pb-card {
  /* ── R5-W2 · J1-A · THE NAIVE KNOBS (doc 45 §G2, Kokis Wahl aus drei Mustern)
     Koki ruled the look from pictures, not from adjectives: »schief gesetzt,
     Wachsmalstift-Kanten, gestrichelte Innenlinie, dickere Knöpfe«. These are
     the numbers that picture was made of, and every one of them carries its
     reason in AUFTAKT_UND_NAIV_LOOK.md — changing the look later is this block,
     not a hunt through a thousand lines.

     THEY LIVE HERE AND NOT ON A ROOT, and that is the scope wall doing its work
     mechanically instead of by discipline: every surface that wears this look —
     chip, inner rule, plate, seal, key stroke — is a DESCENDANT of the card, so
     the HUD outside the veil and the platform outside the game cannot inherit
     what they are not inside. Doc 45 §G2 defers the platform to its own round;
     this block is why that deferral costs nothing. */
  --pb-paper: #fff2cd;
  /* R5-W6b · D4: hier stand »--pb-paper-lit: #fffaea«, das belichtete Papier. Es
     wurde im ganzen Quelltext nie gelesen — kein einziges »var(...)« darauf, seit
     D1. Ein Farbton, den niemand benutzt, ist keine Reserve, sondern die Drift,
     gegen die der Rest dieses Blocks verteidigt: die naechste Hand haette ihn fuer
     eine gueltige zweite Papierfarbe gehalten. Gestrichen; wenn eine Karte je
     »belichtet« aussehen soll, ist das eine Entscheidung mit einem Bild daneben,
     nicht ein Token, das schon einmal vorsorglich dasteht. */
  /* ── R5-W4b · D3b · D-210 · R89 · THE ANSWER BUTTON GETS ITS OWN PAPER ──────
     Two blind critics on D3a's card independently named the same biggest fault:
     the answer chips are a shade of the paper they lie on, so they hang on their
     ink edge and their lip alone. Measured on the tokens: #fffaea on #fff2cd is
     1,068 : 1.

     The direction the old chip was reaching for cannot get there. Pure WHITE on
     this paper is 1,115 : 1 — so no lighter chip can ever meet Koki's 1,3 : 1,
     and the fix is not a brighter chip but a chip made of a DARKER sheet. This
     one is 1,349 : 1 against the paper and still carries the card's ink at
     8,4 : 1, i.e. the text got no harder to read while the shape got findable.

     Its own name rather than a shade of the paper family: a button is not lit
     paper, and the next hand to brighten that family should not silently un-fix
     this. (Der Ton »--pb-paper-lit«, gegen den dieser Absatz ursprünglich
     argumentierte, ist in R5-W6b gestrichen worden — er wurde nie gelesen.) */
  --pb-btn-face: #e9ca80;
  --pb-seal: #ffd98a;
  /* R5-W9 · N1: dieselbe Farbe ein zweites Mal geschrieben, für die eine
     Fläche, die sie in einem Verlauf mit Deckkraft braucht (.pb-en-mark, der
     Pinselwisch unter dem Schlüssel-Englisch). Genau das Muster, das
     --pb-ink-rgb schon fährt, samt seines Preises: ein zweiter Name ist ein
     Drift-Risiko, deshalb hält overlay-css.test.ts die beiden aneinander. */
  --pb-seal-rgb: 255, 217, 138;
  --pb-ink: #6b3f18;
  /* the same pen as channels, for the two surfaces that need it at a strength
     of their own. A second name for one colour is a drift risk, and it is paid
     for by a law in overlay-css.test.ts that re-derives these three numbers
     from --pb-ink and fails if they ever disagree. */
  --pb-ink-rgb: 107, 63, 24;
  --pb-ink-cast: rgba(107,63,24,0.9);
  --pb-ink-line: rgba(107,63,24,0.45);
  --pb-ink-w: 4px;
  --pb-ink-w-chip: 3px;
  --pb-text: #3a2410;
  --pb-accent: #b0461a;
  --pb-accent-lit: #d66a2a;
  --pb-quiet-ink: #7a5c33;
  --pb-card-r: 26px 14px 30px 16px / 16px 30px 14px 26px;
  /* R5-W8 · D6: dieses Token wird seit dem Umbau der Innenlinie nicht mehr von
     einer CSS-Regel GELESEN — die vier Radien stecken jetzt in den Bogen des
     eingebetteten Strichs (».pb-card::before«). Es bleibt trotzdem stehen, und
     zwar als die eine lesbare Stelle, an der diese vier Zahlen benannt sind:
     »legende.test.ts« vergleicht die Bogen des SVG maschinell dagegen, damit
     dieselben vier Zahlen an zwei Stellen keine Drift-Klasse werden. */
  --pb-card-r-in: 22px 12px 26px 14px / 14px 26px 12px 22px;
  --pb-chip-r: 18px 9px 20px 11px / 11px 20px 9px 18px;
  /* NOTHING IS QUITE SQUARE — four angles, one block. Raising the card tilt
     costs viewport room on both axes: the rotated bounding box grows by
     height x sin(a) across and width x sin(a) down, and .pb-veil clips. */
  --pb-card-tilt: -1.1deg;
  --pb-plate-tilt: 1deg;
  --pb-stamp-tilt: -11deg;
  --pb-key-tilt: -1.6deg;

  /* R5-W4 · D3 · R62 · the pages under the top one: a sliver of paper and the
     ink line that ends it. Slightly duller and slightly darker than the card's
     own paper and ink, because a page below the top one is a page in shade. */
  --pb-sheet-face: #f6e6bf;
  --pb-sheet-edge: #c19a5e;

  /* ── R5-W4 · D3 · R63 · THE SLOT FOR A PAINTED EDGE (Codex AQ11) ──────────
     J2 stopped after three rounds at the same criterion and said why: three
     blind critics agreed that a border whose four sides each have a different
     but EVEN weight is still an even border, and that the wobble ALONG a line
     is the thing a CSS border cannot draw. The answer is a painted edge as an
     image, which is an art commission, not a stylesheet round.

     This is where it lands. While the token is »none« the rule below is inert
     and the hand-weighted border above is what draws — so this ships today
     changing nothing, and the day the sheet arrives it is one token.

     ── R5-W4b · D3b · DAS BLATT IST DA, DER SCHALTER BLEIBT AUS ──────────────
     AQ11 liegt importiert und geprüft im Repo (»art/g1/cards/card_edge_a.png«,
     Variante b: ihr dunkelster Punkt trifft #6b3f18). Eingeschaltet wird sie
     trotzdem nicht — ein blinder Kritiker hat die eingebaute Kante gegen die
     heutige Tuschekante gestellt und die TUSCHEKANTE gewählt, mit Fundstellen:
     die gekachelte Wachslinie liest sich als »dicht wiederholtes Rillenmuster
     mit sichtbarer Nahtstelle«, während die Tuschekante an allen vier Ecken
     bündig schließt. Drei Anläufe, drei Messungen, ein ehrlicher Halt.

     WAS DIE DREI ANLÄUFE GEMESSEN HABEN — damit der nächste nicht bei null
     anfängt, sondern bei diesen Zahlen:
      · Die Wachslinie läuft MITTIG im 96-px-Streifen (y = 46…51, 6 px dick).
        Ohne Überstand landet sie 48 px INNEN, mit Überstand 48 px liegt sie auf
        der Kante — deckt dann aber den Schatten-Stapel der Karte auf, was am
        Schirm wie abgebrochene Ecken aussieht.
      · Der Importeur schneidet deshalb 44 px ringsum ab; die Linie sitzt danach
        am äußeren Rand ihres Streifens, Slice und Breite sind 52, Überstand 0.
      · Was BLEIBT und nicht durch Zahlen zu heilen ist: der wiederholbare
        Streifen trägt seine Wachs-Lücke an einer FESTEN Stelle, also kehrt sie
        bei jeder Kachel wieder — ein Stempel, kein Zufall. Das ist eine
        Eigenschaft des Blattes und gehört in die Nachbestellung (AQ11b), nicht
        in dieses Stylesheet.

     Bis dahin zeichnet die von Hand gewichtete Tuschekante oben, und dieser
     Block ist wieder das, was er in D3a war: ein Steckplatz mit einem Token —
     nur dass die drei Zahlen daneben jetzt gemessen sind statt geraten. */
  --pb-edge-image: none;
  --pb-edge-slice: 52;
  --pb-edge-w: 52px;
  --pb-edge-out: 0px;

  position: relative;
  /* ── R5-W3 · J2 · D-52 · THE CARD NEVER OUTGROWS ITS VEIL ─────────────────
     Measured on the real page at 375 x 812 (never on the card bench: that is a
     fixed 1056 x 672 stage and invents a crop the page does not have). The veil
     is 555,5 px tall there and clips with align-items: center, so a taller card
     loses the SAME amount off the top and the bottom at once. Two of the four
     opening beats did: »Was geschehen ist« by 18,1 px each end, »Dein Auftrag«
     by 81,9 px each end — 23 % of that card, its eyebrow sliced through and its
     »Zurueck blaettern« cut in half.

     The cap is on the CARD, the scrolling is on the sheet inside it (below), and
     that split is the whole design: the frame, the hand-inked rule, the turned
     corner and the lean stay put while the writing moves under them. Subtracting
     24px leaves room for what reaches PAST the border box — the lean adds
     width x sin(1,1 deg) to the bounding box, and the hard cast falls 9 px below
     it; both would otherwise be shaved by the veil. */
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 24px);
  padding: 18px 22px;
  text-align: center;
  color: #3b3122;
  /* doc 42 §5 · B19: the three faces are already loaded app-wide — the overlays
     simply start using them (prompts → body, headlines → display, chips → label) */
  font-family: var(--font-body, system-ui, sans-serif);
  background-color: var(--pb-paper);
  /* ── R5-W6b · D4 · R155 (Kokis Tor T6 = c) · DAS PAPIER IST JETZT GEMALT ───
     Koki hat entschieden, dass die Kartenkante Code bleibt und das Geld ins
     MATERIAL geht. AQ17 hat dafür ein Blatt geliefert, und es ist an der Datei
     nachgemessen: 512×512, voll deckend, beidachsig kachelbar (Naht waagrecht
     1,01× · senkrecht 1,00× der eigenen Textur — ein Sprung unter dem eigenen
     Rauschen ist keine Naht), Mittelwert rgb(254, 242, 205) und damit ein Punkt
     neben dem --pb-paper, das seit D1 unter der Karte liegt.

     WAS BLEIBT UND WAS GEHT. Die zwei LICHT-Verläufe bleiben: ein Blatt Papier
     ist flach, eine Karte im Buch liegt in einem Licht, und dieses Licht kommt
     von links oben und wärmt rechts unten nach. Was GEHT, ist die künstliche
     Faser (»repeating-linear-gradient(97deg …)«) und die drei blassen Flecken:
     genau das trägt das gemalte Blatt jetzt selbst, und zwei Papiersprachen
     übereinander sind der Fehler, den J2 hier schon einmal gemessen hat (zwei
     gekreuzte Fasern lasen sich als Rechenpapier).

     DIE KACHELGRÖSSE ist die Größe, in der das Blatt gemalt wurde: 512 px. Die
     Karte ist ~460 px breit, es steht also höchstens EINE Kachel im Bild und
     die geprüfte Naht kommt am Schirm gar nicht vor. Halb so groß (256) wäre
     auf einem 2×-Schirm punktgenau, aber es wäre auch die doppelte Körnung —
     eine Entscheidung über das Aussehen, die dem Maler gehört, nicht dem
     Stylesheet. Die Datei liegt unter art/g1/cards/ und nicht im Kunstbaum:
     »check-paint-art« zählt dort jedes Blatt, das die Engine nicht lädt, als
     tote Kunst — und dieses hier lädt der BROWSER (siehe import-batch-aq17). */
  /* ── R5-W8 · D6 · P7 §3 · DER NACHZUG AUF DER AUSSENKANTE ─────────────────
     Beide Prüfer lasen auch die dunkle Außenkante als »vom Rechner«: eine
     Strichstärke je Seite, EINE flache Farbe über den ganzen Lauf, und Ecken,
     die eine Formel zeichnet.

     Was hier NICHT passiert: die Kante wird nicht ersetzt. Das ist das
     Ergebnis eines bezahlten Versuchs — D3b hat einem blinden Kritiker die
     GEMALTE Kante (»card_edge_a.png«, über den border-image-Steckplatz) gegen
     genau diese Tuschekante gestellt, und er wählte die TUSCHEKANTE. Die
     Silhouette der Karte hat einen Blindvergleich gewonnen; sie wegzuwerfen,
     um denselben Befund anders zu bedienen, wäre ein Rückschritt mit
     Begründung.

     Was stattdessen passiert, ist das, was eine Hand tut, wenn eine Linie ihr
     zu dünn ist: sie fährt sie NOCH EINMAL nach — und trifft dabei nicht
     überall. Der Nachzug liegt als oberste Hintergrund-Lage auf dem
     Rahmenkasten, in vier Zügen mit vier Gewichten (dieselbe R21-Familie), mit
     langen Strichen und wenigen Lücken, und in einem Ton, der etwas dunkler
     ist als die Kante selbst. Er nimmt nichts weg; er macht die eine flache
     Farbe zu zwei Farben, die einander nicht ganz decken.

     Deterministisch wie die Innenlinie: alle Zahlen stehen als Literale hier.
     Und ehrlich begrenzt: auch das ist Linderung. Die Kategorie schließt erst
     mit dem gemalten Blatt (AQ17E und Folge) — so steht es im Register.

     »background-origin: border-box« ist der Grund, warum das überhaupt geht:
     ohne sie beginnt jede Lage am Polsterkasten, also INNERHALB der Kante, und
     der Nachzug läge fünf Bildpunkte zu weit innen. Die Papierkachel verschiebt
     sich dadurch um dieselben fünf Punkte — bei einer beidachsig kachelbaren
     Textur ist das kein Unterschied, den ein Auge findet. */
  background-image:
    radial-gradient(120% 85% at 14% 4%, rgba(255,253,244,0.95), rgba(255,253,244,0) 58%),
    radial-gradient(85% 70% at 92% 98%, rgba(186,152,96,0.34), rgba(186,152,96,0) 62%),
    radial-gradient(52% 16% at 76% 62%, rgba(255,253,244,0.5), rgba(255,253,244,0) 72%),
    url("/art/g1/cards/card_paper.png");
  background-repeat: repeat;
  background-size: auto, auto, auto, 512px 512px;
  /* ── R5-W3 · J2 · R21 · THE HAND ─────────────────────────────────────────
     Two blind look critics, order swapped between them, independently reported
     the same thing: under the paper texture this is still a regular vector
     construction kit. One uniform stroke on all four sides is the largest part
     of why — a crayon drawn along a page never lays down the same weight twice.

     So the four sides disagree, by ONE number set the whole family shares:

         1,25   0,80   0,75   1,20      (top · right · bottom · left)

     Two properties make it safe rather than merely different. Opposite pairs sum
     to exactly 2 (1,25 + 0,75 · 0,80 + 1,20), so the hand REDISTRIBUTES weight
     and adds none: the box grows by zero on both axes, which matters because the
     card already spends 4,3 px of its 14 px side clearance on the lean. And any
     cyclic rotation of the set keeps that property — so the plate, the inner rule
     and the rule band each wear a DIFFERENT rotation of the same hand. One hand
     everywhere would read as a systematic bias, which is the original complaint
     moved up one level rather than answered.

     Spread is 1,67 : 1, deliberately tighter than the corner spread already
     shipping (30 : 14 = 2,14 : 1): a stroke reads as a mistake more easily than
     a corner does.

     THE SHORTHAND IS GONE ON PURPOSE. »border:« takes one width for four sides,
     so four widths need the three longhands — and a later »border:« in this rule
     would silently flatten all four again, which is why the test now forbids one
     here rather than merely checking for the longhands. */
  border-style: solid;
  border-color: var(--pb-ink);
  border-width: calc(var(--pb-ink-w) * 1.25) calc(var(--pb-ink-w) * 0.8)
                calc(var(--pb-ink-w) * 0.75) calc(var(--pb-ink-w) * 1.2);
  border-radius: var(--pb-card-r);
  /* THE LEAN. A book is laid down crooked; a dialog box is not. It is STATIC,
     therefore it is a picture and not motion — which is why it is deliberately
     absent from the reduced-motion kill list below. A child who asked for less
     movement asked for less movement, not for a straightened book. */
  transform: rotate(var(--pb-card-tilt));
  /* declared, not inherited from the default: the whole 375-px safety argument
     is that the overhang is SYMMETRIC, and that is only true about the centre */
  transform-origin: center;
  /* ── R5-W4 · D3 · R62 · THE SHEETS UNDER IT, PUT BACK AND LOUDER ─────────
     J1-A spent this stack and left the note that restoring it was two lines if
     a critic asked. One did: J2's critic, the only one who ever saw both
     versions filling the frame, picked the offset paper edges — »reads as the
     top page of a stack« — and then called them »zu zaghaft«. Koki ruled R62:
     build them, one step stronger.

     Stronger here is OFFSET and EDGE, not opacity: what makes a stack legible
     is that you can count the sheets, so each one shows a sliver of its own
     paper AND its own ink line, at a spacing wide enough to survive the card
     bench's downscale. They ride the border box, so the deckled corners and the
     lean carry through them for free — a stack of pages that are all cut the
     same way and all lie the same way, which is what a book is.

     Order matters: earlier layers paint OVER later ones, so the sheets sit
     between the card and its cast, and the cast moves out past the stack it now
     belongs to rather than to the top page alone. */
  box-shadow:
    5px 6px 0 -2px var(--pb-sheet-face),
    5px 6px 0 -1px var(--pb-sheet-edge),
    11px 13px 0 -4px var(--pb-sheet-face),
    11px 13px 0 -3px var(--pb-sheet-edge),
    14px 17px 0 -3px var(--pb-ink-cast),
    0 16px 32px rgba(26,17,8,0.42);
  animation: pb-card-in ${CARD_ENTER_MS}ms ${CARD_ENTER_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}
/* R5-W4 · D3 · R63 · …and the rule that spends it. A »border-image-source« of
   »none« is a no-op by specification, so this whole block is dead weight until
   the painted sheet exists — and on the day it does, nothing else has to move:
   the widths, the radii and the lean are all already right. »fill« is
   deliberately absent (the paper is a gradient, not part of the sheet), and
   »border-image-repeat: round« is what keeps a hand-drawn wobble from being
   stretched into a smear on a wide card. */
.pb-card {
  border-image-source: var(--pb-edge-image);
  border-image-slice: var(--pb-edge-slice);
  border-image-width: var(--pb-edge-w);
  border-image-repeat: round;
  /* Die gemalte Kante liegt AUF dem Rahmenkasten, also greift sie über das
     Papier hinaus nach innen. »border-image-outset« bleibt bewusst bei 0: die
     Karte hat eine gemessene Höhenkappe (D-52), und eine Kante, die nach außen
     tritt, würde sie am Schleier beschneiden. */
  border-image-outset: var(--pb-edge-out);
}

/* ── R5-W4b · D3b · DIE PAPIERKANTE ALS RÜCKFALL ──────────────────────────────
   Zugesagt war ein Rückfall für Kinder, die auf einer teuren Leitung spielen —
   »prefers-reduced-data« ist die Bitte des Browsers, keine Bytes zu holen, die
   nicht sein müssen. Ein 58-kB-Blatt für eine Zierkante ist genau so ein Byte.
   Der Token geht zurück auf »none«, und weil das gesamte Aussehen der Kante an
   diesem einen Token hängt, zeichnet dann wieder die von Hand gewichtete
   Tuschekante von D3a — dieselbe Karte, nur ohne Wachs.
   Die Regel steht VOR dem reduced-motion-Block am Dateiende (P-78: nie ein
   zweiter solcher Block, und keine Regel dahinter). */
@media (prefers-reduced-data: reduce) {
  .pb-card {
    --pb-edge-image: none;
  }
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
  /* R5-W2 · J1-A: »inherit«, not a number. The card's bottom-right corner went
     from 15px/23px to 30px/14px, and a 20 px flap on a 30 px corner detaches
     visibly. Reading the parent's computed corner means this can never drift
     again, whatever the tilt block is set to next. */
  border-bottom-right-radius: inherit;
  background:
    linear-gradient(315deg, #e6d5ac 0%, #f3e8ce 42%, rgba(243,232,206,0) 43%),
    /* R5-W2 · J1-A: the fold's own shading, one step deeper now that it works
       alone — see the box-shadow note below. */
    linear-gradient(315deg, rgba(120,92,50,0.42) 0%, rgba(120,92,50,0) 46%);
  /* NO box-shadow. TWO BLIND CRITICS, ORDER SWAPPED, INDEPENDENTLY REPORTED THE
     SAME THING (2026-08-13, 80 % and 90 % confidence): »a hard-edged,
     axis-aligned rectangular ghost sits behind the paper corner-fold — it reads
     as a mis-registered art layer, not a shadow cast by the curled paper«.
     They were right, and the cause is geometric. This element is a 34 × 34
     SQUARE; only its GRADIENT is triangular (it goes transparent at 43 %). A
     box-shadow is cast by the box, not by the paint — so the fold was a triangle
     throwing a square shadow.
     Painting the depth into the gradient instead means the shading can only ever
     follow the shape that is actually visible. (clip-path would also work and
     was rejected: it clips the inherited corner radius too, which would square
     off the one corner this whole element exists to round.) */
}
/* the hand-inked rule inside the trim — the mark that makes a sheet of paper
   read as a PAGE. Pointer-transparent, so it never eats a tap. */
.pb-card::before {
  content: "";
  position: absolute;
  /* ── R5-W8 · D6 · WARUM DIESER KASTEN JETZT NACH AUSSEN GREIFT ────────────
     Hier stand »inset: 6px«, und das reichte, solange dieses Element nur die
     Innenlinie trug. Der Nachzug auf der AUSSENKANTE muss aber ÜBER dem Rahmen
     liegen: ein Hintergrund wird immer unter den Rahmen gemalt, und der Rahmen
     dieser Karte deckt. Der erste Anlauf legte den Nachzug in den Hintergrund
     der Karte — am Schirm nachgesehen war er unsichtbar, weil genau das
     passierte.

     Der Kasten eines absolut gesetzten Kindes ist der POLSTERkasten, also der
     Bereich INNERHALB des Rahmens. Die vier negativen Werte holen ihn auf den
     Rahmenkasten zurück, und sie sind genau die vier Rahmenbreiten, in
     derselben R21-Familie geschrieben (1,25 · 0,80 · 0,75 · 1,20) — dieselbe
     Zahl an zwei Stellen wäre eine Drift-Klasse. Das SVG darin rechnet in
     Rahmenkasten-Koordinaten und legt die Innenlinie dort wieder 6 px innerhalb
     des Polsterkastens ab, wo sie vorher lag. */
  inset: calc(var(--pb-ink-w) * -1.25) calc(var(--pb-ink-w) * -0.8)
         calc(var(--pb-ink-w) * -0.75) calc(var(--pb-ink-w) * -1.2);
  /* R5-W2 · J1-A: DASHED. In the judged picture this is the mark that reads as
     drawn-by-hand rather than printed — a ruled line a child could have made
     with a crayon along the inside of the page. */
  /* R5-W3 · J2 · R21: the hand, rotated twice (0,75 · 1,20 · 1,25 · 0,80) and
     written as literals, because 2,5 px is one of the four widths doc §1 keeps
     deliberately off the knob board — tying it to --pb-ink-w would make one dial
     move five things at five scales. Pairs still sum to 5,0, so the inner rule
     sits where it sat. A bonus the dashes give for free: dash length scales with
     border width, so four weights draw four rhythms on one closed line — which
     is what a hand does and a ruler cannot. */
  /* ── R5-W8 · D6 · P7 §3 · DIE INNENLINIE IST JETZT EIN STRICH, KEINE REGEL ──
     Zwei frische Prüfer, Reihenfolgen getauscht, lasen die Kartenoberfläche
     2 : 0 als »zerfällt in zwei«: Bild GEMALT, alles andere VOM RECHNER — und
     die gestrichelte Innenlinie stand namentlich auf beiden Listen. Der Grund
     ist mit CSS allein nicht zu beheben: »border-style: dashed« legt je Seite
     EINE Strichlänge in EINEM Rhythmus, und vier Seiten mit vier Breiten sind
     vier Regelmäßigkeiten, nicht eine Hand.

     WAS HIER NICHT GEMACHT WIRD, UND WARUM NICHT (die teuerste Zeile dieses
     Blocks): der naheliegende Weg wäre der Steckplatz »--pb-edge-image« oben.
     Der ist verbrannt — D3b hat einen blinden Kritiker die gekachelte Kante
     gegen die heutige Tuschekante stellen lassen, und er wählte die
     TUSCHEKANTE, mit Fundstelle: ein gekachelter Streifen trägt seine Lücke an
     einer FESTEN Stelle und wiederholt sie, »ein Stempel, kein Zufall«.
     Dieselbe Mechanik mit einem gezeichneten statt einem gemalten Blatt zu
     füttern, hieße dasselbe Experiment ein zweites Mal zu verlieren.

     Deshalb: EIN Strich, EINMAL, über die ganze Karte gezogen und auf ihre
     Größe GESTRECKT statt gekachelt — es gibt keine Naht, weil es keine
     Wiederholung gibt. Der Rhythmus der Lücken ist unregelmäßig und läuft über
     zehn Werte, bevor er sich wiederholt, die vier Ecken tragen die vier
     ungleichen Radien der Karte, und die geraden Stücke laufen über Kurven
     statt über Geraden: die Linie zittert um bis zu 1,3 px um ihre Bahn, so wie
     eine Kreide es tut, die an einer Kante entlanggeführt wird.

     DIE VIER SEITEN BLEIBEN UNGLEICH SCHWER. Das ist NICHT neu und darf nicht
     verlorengehen: R21 hat den vier Rändern dieses Hauses das Zahlenpaar
     1,25 · 0,80 · 0,75 · 1,20 gegeben, weil eine Kreide nie zweimal dasselbe
     Gewicht ablegt. Der Strich ist deshalb in VIER Züge geteilt, einer je
     Seite, jeder mit seinem Gewicht (1,9 · 3,0 · 3,1 · 2,0 px) und seinem
     eigenen Lückenrhythmus. Der erste Anlauf war EIN Zug mit EINER Stärke — am
     Schirm nachgesehen war das eine neue Regelmäßigkeit an der Stelle der
     alten, also der Befund eine Ebene höher statt beantwortet.

     DETERMINISTISCH (Kokis Auflage 1, 22.08.): der Pfad steht als Literal im
     Quelltext. Keine Zufallszahl, keine Uhr — zwei Läufe müssen dasselbe Bild
     ergeben, sonst beurteilt der nächste Prüfer die Kamera.

     »vector-effect: non-scaling-stroke« ist das, was die Streckung erträglich
     macht: Strichstärke UND Lückenrhythmus bleiben in Bildpunkten, egal wie
     breit die Karte gerade ist. Gestreckt wird nur die BAHN.

     EHRLICHE GRENZE: das ist Linderung, kein Beweis von Malerei. Die Kategorie,
     die P7 gemessen hat, schließt erst mit dem gemalten Blatt (AQ17E und
     Folge) — die Schuld bleibt mit diesem Wortlaut offen im Register stehen. */
  border: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 450 542' preserveAspectRatio='none'%3E%3Cpath d='M28 2C92.96 0.8 172.13 3.1 231 1.4C289.87 2.9 369.04 0.8 434 2A14 30 0 0 1 448 32' fill='none' stroke='rgba(48,27,9,0.42)' stroke-width='2.2' stroke-linecap='round' stroke-dasharray='64 5 96 8 48 6' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M448 32C449 111.04 446.7 207.37 448.7 279C447.2 350.63 449 446.96 448 526A30 14 0 0 1 418 540' fill='none' stroke='rgba(48,27,9,0.42)' stroke-width='1.5' stroke-linecap='round' stroke-dasharray='88 7 52 5 130 9' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M418 540C354 540.8 276 538.9 218 541.2C160 539.3 82 540.8 18 540A16 26 0 0 1 2 514' fill='none' stroke='rgba(48,27,9,0.42)' stroke-width='1.4' stroke-linecap='round' stroke-dasharray='44 6 118 8 70 5' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M2 514C1.1 434.64 3.2 337.92 1 266C2.6 194.08 1.1 97.36 2 18A26 16 0 0 1 28 2' fill='none' stroke='rgba(48,27,9,0.42)' stroke-width='2.1' stroke-linecap='round' stroke-dasharray='106 8 60 5 84 7' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M32.8 11C96.16 11.9 173.38 9.7 230.8 11.5C288.22 10.2 365.44 11.9 428.8 11A12 26 0 0 1 440.8 37' fill='none' stroke='rgba(107,63,24,0.45)' stroke-width='1.9' stroke-linecap='round' stroke-dasharray='13 8 21 7 11 13 17 9 26 8' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M440.8 37C439.7 114.44 441.8 208.82 440.1 279C442 349.18 439.7 443.56 440.8 521A26 12 0 0 1 414.8 533' fill='none' stroke='rgba(107,63,24,0.45)' stroke-width='3.0' stroke-linecap='round' stroke-dasharray='19 9 12 7 24 8 15 11 9 8' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M414.8 533C352.4 532.4 276.35 534.3 219.8 532.1C163.25 533.8 87.2 532.4 24.8 533A14 22 0 0 1 10.8 511' fill='none' stroke='rgba(107,63,24,0.45)' stroke-width='3.1' stroke-linecap='round' stroke-dasharray='11 7 25 9 16 8 20 12 13 7' vector-effect='non-scaling-stroke'/%3E%3Cpath d='M10.8 511C12 433.24 9.9 338.47 11.9 268C10.3 197.53 12 102.76 10.8 25A22 14 0 0 1 32.8 11' fill='none' stroke='rgba(107,63,24,0.45)' stroke-width='2.0' stroke-linecap='round' stroke-dasharray='22 8 14 10 18 7 12 9 26 8' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
}

/* ── R5-W3 · J2 · D-52 · THE SHEET INSIDE THE CARD ─────────────────────────
   The scroll lives HERE and not on .pb-card, and that is not a preference: an
   element with »overflow« clips every descendant whose containing block is
   inside it. The wax seal hangs 8 px past the corner and the tether that ties a
   card to the being it is about sits ENTIRELY outside the card (»right: 100%«,
   108 px of it) — scrolling the card itself would have erased both. This
   wrapper is position: static, so their containing block stays .pb-card and
   they are not clipped. Proven in the browser before it was written, not
   assumed from the spec.

   »min-height: 0« is the flex rule that makes it work at all: a flex item's
   floor is its content, so without this the sheet refuses to shrink and the cap
   above does nothing.

   It scrolls only when it must — a card that fits is untouched, and two of the
   four opening beats fit. */
.pb-card-scroll {
  min-height: 0;
  /* ── R5-W8 · D6 · D-529 · DIE GRENZE STEHT JETZT AUCH AM BLATT ────────────
     Die Kappe der KARTE (»max-height: calc(100% - 24px)«, oben) reicht heute,
     weil das Blatt ein Flex-Kind in einer Spalte ist und dadurch mitschrumpft.
     Das ist wahr und unsichtbar: nimmt eine künftige Karte das Blatt aus dieser
     Spalte heraus, fällt die Grenze lautlos weg und der Inhalt wird wieder
     beschnitten statt geblättert — genau die Klasse, die D-529 gemeldet hat.
     Die Grenze steht deshalb ein zweites Mal HIER, an dem Element, das rollt,
     und bemisst sich am Schleier (100 % = der Kasten der Karte, der selbst am
     Schleier hängt). Sie ändert am heutigen Bild NICHTS — gemessen, nicht
     angenommen: Karte 450 × 537 vor wie nach. */
  max-height: 100%;
  overflow-y: auto;
  /* ⚠ NOT optional, and not tidiness. CSS says that if ONE axis is not
     »visible«, the other computes to »auto« — so »overflow-y: auto« alone hands
     the sheet a horizontal scrollbar too, and a line one sub-pixel wider than
     its box is enough to draw it. Measured on the real page: scrollWidth 265
     against clientWidth 264, and the result was a dark bar straight across the
     card under the button. The card is a page: it is read downwards and never
     sideways. */
  overflow-x: hidden;
  /* a child dragging the last task line must not drag the page underneath */
  overscroll-behavior: contain;
}
/* ── R5-W8 · D6 · DIE GEMALTE ROLLLEISTE WAR ABGESCHALTET ──────────────────
   Hier stand »scrollbar-width: thin« zusammen mit dem gemalten Balken darunter,
   und beides zusammen ergibt NICHTS: sobald die STANDARD-Eigenschaft gesetzt
   ist, wirft der Browser den ganzen »::-webkit-scrollbar«-Block weg und
   zeichnet seine eigene, auf dem Mac eine ÜBERLAGERNDE Leiste, die im Ruhezu-
   stand unsichtbar ist. Gemessen an der lebenden Karte bei 760 × 700 (ein
   Fenster, in dem das Blatt wirklich rollt): mit »scrollbar-width« belegt die
   Leiste 0 px und ist nicht zu sehen, ohne sie 7 px und sie steht da. Die
   Karte trug also eine von Hand getuschte Rollleiste, die nie jemand gesehen
   hat — und ein Kind bekam bei kleinem Fenster keinen einzigen Hinweis, dass
   unter der Kante noch etwas steht.

   Die Standard-Eigenschaften bleiben trotzdem im Blatt, aber NUR für Browser
   ohne den gemalten Balken (Firefox): dort ist »thin« das Beste, was zu haben
   ist. Wo der Balken gezeichnet werden kann, wird er gezeichnet — sichtbar,
   Platz belegend, in der Tinte des Buches, mit den vier uneinigen Ecken, die
   hier alles trägt, was eine Hand angefasst hat. */
.pb-card-scroll::-webkit-scrollbar { width: 7px; }
.pb-card-scroll::-webkit-scrollbar-track { background: transparent; }
.pb-card-scroll::-webkit-scrollbar-thumb {
  background: var(--pb-ink-line);
  border-radius: 6px 4px 7px 5px / 5px 7px 4px 6px;
}
@supports not selector(::-webkit-scrollbar) {
  .pb-card-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--pb-ink-line) transparent;
  }
}

/* ── R5-W8 · D6 · P7 §2.4 · DER WEG NACH VORN GEHT NICHT UNTER DIE KANTE ────
   Der eigentliche Schaden, den die Höhen-Messung gefunden hat, sind nicht die
   drei Wörter: bei 760 × 700 lag auch der »Weiter«-Knopf unter der Kante
   (gemessen: Blattinhalt 484 gegen 406 sichtbare Punkte, Knopf bei y 553 in
   einem Blatt, das bei y 523 endet). Ein Kind sah eine Karte mit abge-
   schnittener Liste und ohne einen einzigen sichtbaren Weg weiter.

   WELCHE KARTEN DIESE ZEILE TRAGEN, UND WARUM NICHT ALLE. Sie gilt für die
   Karten, deren EINZIGE Vorwärts-Bedienung ganz unten sitzt: die vier Auftakt-
   Takte und die zwei Arena-Takte. Auf einer Aufgaben-Karte ist die Vorwärts-
   Bedienung die Antwort in der Mitte; dort klebte eine Fußzeile nur den
   Rückzieher »Später« fest und nähme dem Text Platz weg. Das ist eine
   Unterscheidung nach BAUART, keine Ausnahme für eine einzelne Karte.

   Der Streifen bekommt das Papier der Karte mit, sonst liefe die Schrift beim
   Rollen sichtbar hinter ihm durch; und darüber steht ein weicher Auslauf statt
   einer Kante, weil eine harte Linie quer über die Seite genau der Balken wäre,
   den D-104 hier schon einmal entfernt hat. */
.pb-card-foot {
  /* Sie steht NEBEN dem Blatt in derselben Flex-Spalte: das Blatt nimmt, was
     übrig bleibt, diese Zeile behält ihre Höhe. Kein eigener Papierton und
     keine Kante — sie liegt auf dem Papier der Karte, wie sie es vorher tat.
     (Der erste Anlauf war »position: sticky« INNERHALB des Blattes. Am Schirm
     nachgesehen: der Streifen legte sich über die erste Legenden-Zeile. Alles
     war erreichbar, aber es LAS sich als Fehler — deshalb dieser Weg.) */
  flex: 0 0 auto;
}

/* ── every control on the card is a painted chip ───────────────────────────
   Finding 3's second half: the answer buttons were web-form buttons — flat
   fill, 9 px radius, one hairline. A chip now carries the same paper as the
   card it sits on, an ink edge that is not quite straight, and a lifted lip
   that presses in under the finger. The inline styles that build these buttons
   keep only their LAYOUT, so this is the single place their look lives. */
.pb-card button, .pb-card .pb-chip {
  background-color: var(--pb-btn-face);
  background-image:
    /* R5-W4b · D3b · D-210: the white wash that lights the top-left corner used
       to run at 0,9 — nearly opaque white over most of the chip's face, which is
       how a chip made of paper one shade off the card ended up reading as the
       card. It is a HIGHLIGHT now, not a coat: the corner still catches, the
       body keeps the darker sheet the contrast is measured on. */
    radial-gradient(120% 100% at 28% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 62%),
    radial-gradient(70% 60% at 84% 100%, rgba(176,142,88,0.16), rgba(176,142,88,0) 70%),
    /* ── R5-W7 · D5 · DIE GEMALTE PLAKETTE (AQ17C Z0/Z1, R132 zellweise) ────
       Hier stand die dritte Lage: »repeating-linear-gradient(97deg, …)«, eine
       gerechnete Faser aus lauter gleichen Strichen im Abstand von 19 px. Sie
       geht denselben Weg wie der Faser-Streifen der Karte in D4 — das gemalte
       Blatt ersetzt sie. Die zwei LICHT-Verläufe darüber bleiben, weil eine
       Plakette flach ist und eine Karte im Buch in einem Licht liegt (dieselbe
       Begründung, mit der das Kartenpapier importiert wurde).

       DAS BLATT trägt zwei Kästen à 346×161 nebeneinander: in Ruhe, dann
       gedrückt. Deshalb »200 % 100 %« und ein Sprung der Position von 0 auf
       100 % im Druck — EIN Blatt, also ist der gedrückte Zustand schon geladen,
       wenn der Finger kommt (die Rechnung ist dieselbe, die das Knopfblatt seit
       D4 fährt, nur ohne dessen Kasten-Prozente: der Importeur schneidet die
       Plakette auf ihren Kasten zu, also IST das Blatt die Plakette).

       Die Tuschekante bleibt: die Plakette liegt UNTER ihr, nicht an ihrer
       Stelle. Das ist kein Zögern, sondern ein Gesetz — overlay-css.test.ts
       verlangt wörtlich »border: var(--pb-ink-w-chip) solid var(--pb-ink)«, und
       der 1 px dünne Rand des Blattes wäre kein Ersatz für eine Kante, deren
       Kontrast gemessen ist. Was das Blatt beisteuert, ist die FLÄCHE.

       Warum die vier gemalten Eckradien trotzdem zählen, obwohl der CSS-Radius
       sie überdeckt: sie sind der Beweis, dass der Maler diesen Chip gemalt hat
       und nicht irgendein Rechteck — der Importeur weist eine Plakette mit
       einem einheitlichen Radius zurück —, und sie sorgen dafür, dass die
       durchsichtigen Ecken des Blattes genau dort liegen, wo der Radius
       ohnehin schneidet. Kein Zipfel Farbe steht über. */
    url("/art/g1/cards/card_plaques.png");
  background-repeat: no-repeat;
  background-size: auto, auto, 200% 100%;
  background-position: 0 0, 0 0, 0 0;
  border: var(--pb-ink-w-chip) solid var(--pb-ink);
  border-radius: var(--pb-chip-r);
  /* R5-W2 · J1-A: one crayon lip, as judged. The ambient blur and the inset
     highlight went with it — a naive chip is a shape with an edge, not a
     rendered surface. */
  box-shadow: 0 4px 0 var(--pb-ink-cast);
  color: #3d3122;
  transition: transform 90ms ease-out, box-shadow 90ms ease-out;
}
.pb-card button:active:not(:disabled) {
  /* the tilt rides along, or a pressed chip would snap square under the finger
     (see THE CROOKED CHIPS below).
     R5-W2 · J1-A: the press is 4 px because the LIP is now 4 px. A 2 px press
     against a 4 px lip leaves the chip floating on half a shadow — the seam a
     flat colour override never shows, because nobody photographs a held finger. */
  transform: translateY(4px) rotate(var(--pb-tilt, 0deg));
  box-shadow: 0 0 0 var(--pb-ink-cast), inset 0 1px 3px rgba(120,92,50,0.28);
  /* R5-W7 · D5: und die zweite Plakette. Dieselbe Datei, andere Hälfte — der
     dunklere Kasten (1,671 : 1 gegen das Papier statt 1,463 : 1). */
  background-position: 0 0, 0 0, 100% 0;
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

/* ── THE PORTRAIT · REMOVED (R5-W3 · J2 · R21) ──────────────────────────────
   ».pb-portrait« and ».pb-portrait img« are gone. They were dead: R5-W1 · D1
   promoted the picture from a slot to THE PLATE (cards/Glance.tsx), and no TSX
   in this repo has applied the class since — verified by grep across packages,
   apps, scripts and docs, and by confirming that no class name here is ever
   BUILT at runtime (every className is a literal; the only interpolated »pb-«
   strings in the codebase are Phaser TEXTURE keys, a different namespace).

   R21 named it one of four open surfaces that should join the look family. It
   could not: dressing a rule nothing renders would have turned the consistency
   table green on a change no child and no critic can see. Deleting it is the
   honest half of the same ruling, and it also removes a trap — the comment that
   stood here announced this as the live portrait, 300 lines above the rule that
   actually is one. */

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
  /* die AMBER-Fläche bleibt als Untergrund: sie ist der Kontrast, auf dem die
     Handlungs-Hierarchie beruht (overlay-css.test.ts prüft ihn), und sie ist
     zugleich das, was ein Kind sieht, falls das gemalte Blatt einmal nicht
     ausgeliefert wird — ein Knopf ohne Bild ist dann blass, nie unsichtbar */
  background-color: #f0c473;
  /* ── R5-W7 · D5 · P6/M2 · DIE LIPPE FOLGT JETZT DEM GEMALTEN KNOPF ────────
     M2 hat »einen rechteckigen dunklen Rest unten rechts am Knopf, der die
     Rundung nicht mitmacht« gemeldet; P6 nannte ihn sichtbar, aber nicht
     beweisbar — die Messung konnte ihn nicht von der gemalten Knopfkante
     trennen. Nachgemessen ist er beweisbar, und er ist NICHT die Kante: der
     Keil misst rgb(119, 78, 40), und das ist auf den Punkt --pb-ink-cast
     (rgba(107, 63, 24, 0.9)) über dem Kartenpapier rgb(255, 242, 205) —
     also die LIPPE (»box-shadow 0 4px 0«) und nicht das Blatt.

     Warum sie hervorschaut: die Lippe wird auf den CSS-Kasten gezeichnet, und
     der trug --pb-chip-r — feste Pixel-Radien, gemacht für einen Chip, der
     seine Ecke selbst zeichnet. Der gemalte Knopf zeichnet sie aber im Blatt,
     mit anderen Rundungen, und die Lippe schaut überall dort hervor, wo die
     beiden nicht übereinstimmen.

     PROZENTE statt Pixel, weil der Knopf mitwächst: der gemalte Kasten ist
     378×176, seine Ecken liegen bei 19–32 px, also 6–8,5 % der Breite und
     11–13 % der Höhe. Ein Verhältnis trifft sie bei JEDER Knopfbreite, eine
     Pixelzahl nur bei einer. Die Werte hier liegen bewusst darüber, damit die
     Lippe hinter dem gemalten Knopf bleibt statt an seiner Ecke vorbeizuschauen
     — und sie sind vier verschiedene, weil in diesem Haus nichts ganz gerade
     ist. Der Radius ist hier ohnehin unsichtbar: die Kante ist gemalt, der
     CSS-Rand steht auf durchsichtig, und beschnitten wird nur die Amber-Fläche,
     die als Rückfall darunter liegt. */
  border-radius: 15% 13% 16% 14% / 28% 25% 29% 26%;
  /* ── R5-W6b · D4 · DER GEMALTE KNOPF (AQ17, Zellen 0 · 1 · 2) ─────────────
     Das Blatt ist 2048×512 und trägt vier 512er Zellen: Ruhe · gedrückt · Ghost
     · Reserve. Die Reserve bleibt mit Absicht unbenutzt — ein Blatt darf mehr
     können als die Runde braucht.

     DIE RECHNUNG, und warum sie hier ausgeschrieben steht statt geraten zu sein.
     Der gemalte Knopf füllt seine Zelle nicht aus: gemessen (import-batch-aq17
     misst es bei jedem Lauf nach) liegt er bei x 67–444, y 165–340, also
     378×176 Bildpunkte in einer 512er Zelle. Damit GENAU dieser Kasten auf dem
     Knopf landet und nicht die Zelle, wird das Blatt auf
         Breite  2048 / 378 = 541,80 %
         Höhe     512 / 176 = 290,91 %
     der Knopffläche gezogen, und die Verschiebung ist der Kastenanfang, in
     Prozent der Differenz Fläche−Bild:
         waagrecht  (67 + 512 · Zelle) / (2048 − 378)
         senkrecht   165 / (512 − 176)
     Die gedrückte Zelle ist dieselbe Zeichnung 4 px tiefer im Blatt; ihre
     Verschiebung ist deshalb 169/336 statt 165/336 — sie holt die 4 px zurück,
     denn den Druck macht weiterhin »transform: translateY(4px)« gegen die 4 px
     Lippe (J1-A). Sonst sänke der Knopf um 8.

     »background-origin: border-box«, weil das Blatt seine EIGENE Tuschekante
     mitbringt — deshalb ist der CSS-Rand hier durchsichtig statt in --pb-ink — zwei
     Kanten übereinander wären eine doppelte Linie, und die gemalte ist die, für
     die Koki bezahlt hat. Die Rand-BREITE bleibt stehen, damit sich am Layout
     nichts verschiebt. */
  background-image: url("/art/g1/cards/card_buttons.png");
  background-repeat: no-repeat;
  background-origin: border-box;
  background-size: 541.80% 290.91%;
  background-position: 4.012% 49.107%;
  border-color: transparent;
  color: #402d10;
  box-shadow:
    0 4px 0 var(--pb-ink-cast),
    0 5px 14px rgba(52,34,10,0.26);
  /* ── R5-W6b · D4 · DER KNOPF, DER SEINE SCHRIFT ABSCHNITT ──────────────
     P5 hat »Ins Buch kleben« am Schirm als »ns Buch kleben« gelesen, zweimal in
     Folge gemeldet. Es war nie die Schrift und nie der Text: die Basisregel
     ».pb-card button« oben gibt Farbe, Rand und Radius — aber KEIN Polster, KEINE
     Schriftgröße, KEINE Schriftfamilie. Jeder andere Primärknopf im Spiel bekommt
     die drei Zahlen inline mit (PaintGame#btn, skins.tsx#cardBtn); genau die drei
     Regel-Seiten-Knöpfe (RulePage »Seite aufschlagen« · »Ins Buch kleben« ·
     »Weiterspielen«) setzen nur die Klasse. Sie erbten deshalb die Vorgaben des
     Browsers — rund 6 px waagrechtes Polster und 13 px Systemschrift — und lagen
     damit unter einem 4 px starken Tuscherand mit ungleichem Eckradius
     (--pb-chip-r, die 18/9/20/11). Der Radius frisst bei 6 px Polster den ersten und
     letzten Buchstaben; das ist das abgeschnittene »I«.

     Die drei Zahlen stehen deshalb JETZT in der Regel, und zwar dieselben, die
     CardShell#cardBtn seit Kokis Ruling vom 14.08. trägt. Das ist ein Klassen-Fix,
     kein Instanz-Fix: er trifft jeden Knopf, der die Klasse trägt und sein Polster
     nicht selbst mitbringt — und an den inline gesetzten ändert er nichts, weil
     Inline die Regel schlägt. Ein Gesetz in overlay-css.test.ts hält die Zahlen
     fest, damit die nächste Hand sie nicht wieder wegkommentiert. */
  padding: 11px 18px;
  font-size: 18px;
  min-height: 46px;
  font-family: var(--font-label, inherit);
  font-weight: 600;
}
.pb-card button.pb-btn-primary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--pb-ink-cast), inset 0 1px 4px rgba(120,80,26,0.3);
  /* Zelle 1 (gedrückt), um ihre eigenen 4 px zurückgeholt — siehe die Rechnung oben */
  background-position: 34.671% 50.298%;
}
/* ── R5-W7 · D5 · DER STILLE AUSGANG, ALS REGEL STATT ALS DREI ZAHLEN ───────
   »Später ↩« will laut seinem eigenen Kommentar in CardShell »dasselbe Papier
   wie jeder andere Chip, flach gedrückt« sein — und war das bis heute mit einer
   halbdurchsichtigen Hintergrund-FARBE. Das ging, solange hinter dem Chip nur
   Verläufe lagen: das Kartenpapier schien durch, und der Knopf war von selbst
   blass.

   Seit die gemalte Plakette darunter liegt, geht es nicht mehr — und zwar aus
   einem Grund, der sich nicht durch eine größere Zahl beheben lässt: eine
   »background-color« ist in CSS die UNTERSTE Lage. Ein deckendes Bild darüber
   verdeckt sie vollständig. Gemessen am Bank-Foto: mit Deckkraft 0,5 wie mit
   0,83 blieb die Fläche bei exakt rgb(240, 197, 121) — die Wäsche malte
   hinter einem Vorhang.

   Also liegt die Wäsche jetzt OBEN, als Verlauf aus einer einzigen Farbe (die
   einzige Bauform, die im Lagen-Stapel über ein Bild kommt), und der ganze
   stille Zustand steht hier statt inline an der Aufrufstelle — dieselbe
   Klassen-statt-Instanz-Bewegung, die D4 für das Knopf-Polster gemacht hat.
   0,72 ist gemessen und nicht gewählt: die Fläche liegt damit rund 44
   Helligkeitspunkte über der Antwort-Plakette, genau so weit wie vorher über
   dem Verlauf (vorher 229 gegen 185). */
.pb-card button.pb-btn-quiet {
  background-image:
    linear-gradient(rgba(252,247,232,0.72), rgba(252,247,232,0.72)),
    url("/art/g1/cards/card_plaques.png");
  background-size: auto, 200% 100%;
  background-position: 0 0, 0 0;
  border-color: var(--pb-ink-line);
  color: #8a7a58;
  box-shadow: none;
}
.pb-card button.pb-btn-quiet:active:not(:disabled) {
  background-position: 0 0, 100% 0;
}

.pb-card .pb-btn-ghost {
  background-color: rgba(253,246,228,0.62);
  /* Zelle 2: dasselbe Blatt, der stille Zustand. Der Ghost ist der Weg HINAUS,
     und er ist gemalt wie der Weg hinein — dieselbe Hand, weniger Farbe
     (gemessen 1,56 : 1 gegen das Papier, der Primärknopf 1,42 : 1). */
  background-image: url("/art/g1/cards/card_buttons.png");
  background-repeat: no-repeat;
  background-origin: border-box;
  background-size: 541.80% 290.91%;
  background-position: 65.329% 49.107%;
  border-color: transparent;
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
  /* R5-W3 · J2 · R21: joins the family. Its own comment calls this a brush
     stroke, and it was painted in an ink no other surface on the card uses. It
     is the same pen now — at 1/1,4 of the old alpha, because --pb-ink is that
     much darker against the paper (deltas 105,126,141 vs 148,179,181), so the
     hue changes and the perceived weight does not. A tally rule that outshouts
     the number it separates is a worse card, not a more consistent one. */
  background: linear-gradient(90deg,
    rgba(var(--pb-ink-rgb),0) 0%, rgba(var(--pb-ink-rgb),0.36) 7%, rgba(var(--pb-ink-rgb),0.19) 48%,
    rgba(var(--pb-ink-rgb),0.33) 86%, rgba(var(--pb-ink-rgb),0) 100%);
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
  /* R5-W2 · J1-A: the lean sits on the WRAPPER, not on the plate. The judged
     sample rotated the plate alone, which slides .pb-stamp (pinned at
     right:-8px; bottom:-8px) off the corner it is pressed into — this wrapper
     exists precisely so the plate and its seal travel together (see above). */
  transform: rotate(var(--pb-plate-tilt));
}
.pb-plate {
  position: relative;
  width: fit-content;
  max-width: 100%;
  /* R5-W3 · J2 · R21: the hand, rotated once (1,20 · 1,25 · 0,80 · 0,75) — NOT
     the card's rotation, so the two ruled edges on one card are not crooked the
     same way. Pairs sum to 2, so the plate's outer size is unchanged and the
     seal pressed into its corner does not move. */
  border-style: solid;
  border-color: var(--pb-ink);
  border-width: calc(var(--pb-ink-w) * 1.2) calc(var(--pb-ink-w) * 1.25)
                calc(var(--pb-ink-w) * 0.8) calc(var(--pb-ink-w) * 0.75);
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
  color: var(--pb-text);
  letter-spacing: 0.2px;
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
  /* R5-W2 · J1-A: a wax crayon, not a fineliner — thicker, rounder, more
     off-level. ⚠ The zero-alpha ends are rgba() and not »transparent« on
     purpose: »transparent« is rgba(0,0,0,0) and would fringe the stroke grey
     as it fades. */
  height: 6px;
  border-radius: 6px;
  transform: rotate(var(--pb-key-tilt));
  background: linear-gradient(90deg, rgba(214,106,42,0), var(--pb-accent-lit) 20%, var(--pb-accent) 55%, rgba(176,70,26,0) 100%);
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
.pb-key-en { color: var(--pb-accent); }

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
  color: var(--pb-quiet-ink);
}
.pb-quiet-i { font-style: italic; }

/* R5-W4 · D3 · THE PICTURE'S CAPTION — Koki, 15 August: „der deutsche Satz ist
   winzig klein". It was riding the quiet layer at 12.5 px, which made the one
   line that says WHAT THE PICTURE IS the smallest type on the card. It keeps
   the quiet layer's ink (measured 5.53 : 1 on the paper, well over the 4.5 : 1
   the guideline asks of body type) and its italic restraint, and takes a size a
   six-year-old reads without leaning in. It is its own class rather than a
   bigger .pb-quiet on purpose: the hint lines under a dial („zieh am Rad") are
   quiet BY DESIGN, and growing them with the caption would flatten the glance
   grammar D1 built. */
.pb-cap {
  margin: 0 0 5px;
  font-size: 15.5px;
  line-height: 1.35;
  font-style: italic;
  color: var(--pb-quiet-ink);
}

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
  /* R5-W3 · J2 · R21: joins the family — and it is a legibility fix, not only a
     rename. Measured against --pb-paper (#fff2cd): #a8926a is 2,70 : 1, which
     fails AA at this size; --pb-quiet-ink is 5,53 : 1. Doc §2 lets the look widen
     the gap to the paper and never narrow it. */
  color: var(--pb-quiet-ink);
  margin: 0 0 2px;
}
.pb-treasure {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6px 0 10px;
  height: 156px;
}
/* the warm pool the page was lying in, carried into the card so the find looks
   the same on both sides of the pickup */
/* THE RULE LINE. Quiet ink and quiet weight, so the one key phrase inside it
   and the English example below both outrank it — but a size of its own,
   because this is the sentence the child is actually here to read and the
   ordinary quiet line (12.5px) is a caption size, not a reading size. */
.pb-rule-line {
  font-size: 15px;
  line-height: 1.45;
  margin: 0 0 8px;
}

/* ══ R5-W9 · N1 · DIE REGEL-SEITE, NEU GESETZT ═══════════════════════════════
   Kokis Durchspiel-Review vom 31.08. (Befund D-770) an zwei Belegen: der TITEL
   war die unauffälligste Zeile der Karte, das Schlüssel-Englisch gar nicht
   hervorgehoben, die Beispiele alle im selben Rotbraun (»Sit down!« und »Don't
   sit down!« sahen identisch aus, obwohl sie das Gegenteil sagen), und am
   Merksatz sass ein Zitat-Balken — »KI-Optik«, nicht die eines bemalten Buchs.

   Alle Farbwerte hier sind Token dieser Datei, kein neuer Hex. Jede
   Vordergrund/Hintergrund-Paarung ist gegen --pb-paper (#fff2cd) GEMESSEN und
   steht mit ihrer Zahl an ihrer Klasse — Doku §2: der Abstand zum Papier darf
   sich nur vergrössern.

   Alles hier ist STATISCH: keine @keyframes, kein transition. Die
   Reduced-Motion-Abschussliste spiegelt genau die animierte Menge, und eine
   Regel-Seite, die unter einem lesenden Kind pulsiert, ist eine Seite, die
   niemand liest (dasselbe Argument wie beim Fund-Takt). */

/* 1 · DER TITEL FÜHRT.
   Er lief bis heute auf .pb-merk-topic — 11,5 px, gesperrte VERSALIEN, stille
   Tinte: die Überschrift war die kleinste Type auf der Karte. Jetzt die
   Auszeichnungsschrift des Hauses in voller Tinte. Die Versalien fallen
   ausdrücklich weg, und zwar nicht nur aus Rang-Gründen: text-transform macht
   aus »Begrüssen« ein SS (auf Kokis Beleg 07.22.42 zu sehen) — eine
   Rechtschreibänderung durch ein Stilmittel.
   Gemessen: --pb-text auf --pb-paper = 13,08 : 1. */
.pb-rule-titel {
  font-family: var(--font-display, inherit);
  font-weight: 800;
  font-size: 21px;
  line-height: 1.16;
  color: var(--pb-text);
  margin: 2px 0 7px;
  text-wrap: balance;
}
/* im Archiv-Fach und am Hub-Brett steht derselbe Titel eine Stufe kleiner: es
   ist eine LISTE von Seiten, nicht die eine aufgeschlagene */
.pb-merk-slot .pb-rule-titel { font-size: 17px; margin: 0 0 5px; }

/* 2 · DIE MARKE FÜR SCHLÜSSEL-ENGLISCH — ein Mittel, überall dasselbe.
   Markiert werden genau die Formen aus »lehrtEn«, also das, was die Seite zu
   lehren VERSPRICHT und was »tip-honesty« ohnehin gegen die Beispiele prüft.

   UMKEHRUNG GEGENÜBER HEUTE, und sie ist der eigentliche Fix: bisher trug JEDE
   englische Zeile den Akzent (.pb-key-en) — wenn alles der wärmste Ton ist, ist
   nichts hervorgehoben. Die Zeilen stehen jetzt in der dunklen Buch-Tinte, und
   nur die gelehrte Form trägt Akzent plus Wisch.

   KEIN TEXTMARKER-BALKEN: die Marke ist ein Pinselstrich, der an beiden Enden
   ausläuft — dasselbe Argument, mit dem .pb-key seinen Kreidestrich statt eines
   Bandes bekam (»a highlighter band would be app UI«). Als eigener Hintergrund
   des Wortes gezeichnet, nicht als ::before mit negativem z-index: ein
   Pseudo-Element hinter der eigenen Zeile rutscht auf gefiltertem Grund hinter
   das Kartenpapier.
   Gemessen an der STÄRKSTEN Stelle des Wischs (--pb-seal bei 0,44): auf dem
   Kartenpapier #fff2cd ergibt das #ffe7b0 und --pb-accent darauf 4,63 : 1; auf
   dem helleren Papier des Hub-Bretts (#f7edd6, wo dieselbe Marke von Hand
   nachgebaut ist) 4,51 : 1. Die Spitze steht auf dem WENIGER günstigen der
   beiden Gründe — eine Marke, die nur auf einer der zwei Flächen AA hält, ist
   keine gemeinsame Marke. */
.pb-en-mark {
  font-family: var(--font-display, inherit);
  font-weight: 800;
  color: var(--pb-accent);
  /* ⚠ AM EIGENEN BILD GEFUNDEN: die Polsterung schob das Satzzeichen weg, und
     die Karte las »Sit down !« und »twenty-five .«. Ein Wisch ist Farbe, kein
     Kasten — er darf breiter sein als die Buchstaben, ohne die Zeile
     auseinanderzuziehen. Der negative Rand nimmt den Vorschub wieder heraus;
     was bleibt, sind die 0,08em, die den Pinselrand über die Glyphen hinaus
     stehen lassen. */
  padding: 0.04em 0.2em 0.1em;
  margin: 0 -0.12em;
  border-radius: 8px 4px 9px 5px / 5px 9px 4px 8px;
  background-image: linear-gradient(96deg,
    rgba(var(--pb-seal-rgb),0) 0%, rgba(var(--pb-seal-rgb),0.40) 7%, rgba(var(--pb-seal-rgb),0.44) 52%,
    rgba(var(--pb-seal-rgb),0.37) 92%, rgba(var(--pb-seal-rgb),0) 100%);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* 3 · DER MERKZETTEL — und warum der Balken geht.
   Der Merksatz hing an einem 3px-Balken links (border-left), also an der Optik
   eines Blockzitats: Koki las genau das als »KI-Optik«. Ein Buch zitiert sich
   nicht selbst — es klebt einen Zettel hinein. Also das Papier der Blätter
   UNTER dem obersten (--pb-sheet-face, schon Token) mit vier ungleichen Ecken.
   Gemessen: --pb-text auf --pb-sheet-face = 11,80 : 1. */
.pb-rule-zettel {
  background: var(--pb-sheet-face);
  border-radius: 13px 7px 15px 8px / 8px 15px 7px 13px;
  padding: 8px 12px 9px;
  margin: 0 0 11px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 0 rgba(var(--pb-ink-rgb),0.13);
}
.pb-rule-zettel .pb-rule-line { margin: 0; color: var(--pb-text); }

/* 4 · DIE BEISPIELE, JE NACH LESE-FORM (»beispielMuster« im Level).
   Eine Liste gleich gesetzter Zeilen kann einen Wandel nicht von einem
   Gegensatz unterscheiden — das war Kokis dritter Punkt. Die Grundzeile ist
   überall dieselbe; was sich ändert, ist die Anordnung. */
.pb-bsp {
  list-style: none;
  margin: 0 0 2px;
  padding: 0;
  display: grid;
  gap: 7px;
  font-family: var(--font-display, inherit);
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
  color: var(--pb-text);
}

/* WANDEL — links die Ausgangsform, rechts die gelehrte. Der Pfeil steht in der
   Mitte und trägt die Aussage »wird zu«; links geht die Tinte einen Schritt
   zurück, damit das Auge rechts landet. */
.pb-bsp-wandel > li { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 6px; }
.pb-bsp-von { color: var(--pb-quiet-ink); }
.pb-bsp-pfeil { display: flex; color: var(--pb-ink-line); }

/* DIALOG — die Frage steht, die Antwort rückt ein und antwortet ihr. Kein
   Sprechblasen-Kasten: das ist Anwendungs-Oberfläche, nicht Buch. */
.pb-bsp-dialog > li { display: grid; gap: 1px; }
.pb-bsp-frage { color: var(--pb-text); }
.pb-bsp-antwort { margin-left: 18px; color: var(--pb-quiet-ink); }

/* GEGENSATZ — zwei Spalten, beide richtiges Englisch.
   ⚠ NIE als richtig/falsch: Koki hat die durchgestrichene Falschform am
   15.08. abgeschafft (»Wir wollen KEINE Fehler zeigen«). Es gibt deshalb kein
   Kreuz, keinen Strich und kein Rot/Grün — die Spalten tragen zwei Etiketten
   und die Buch-eigenen Tinten, und die Trennung ist ein Papierfalz. */
.pb-bsp-gegensatz { grid-template-columns: 1fr 1fr; column-gap: 14px; row-gap: 7px; }
.pb-bsp-etikett {
  font-family: var(--font-label, inherit);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pb-quiet-ink);
  margin: 0 0 -2px;
}
.pb-bsp-gegensatz > li:nth-child(2n) { border-left: 1px solid var(--pb-ink-line); padding-left: 13px; }

/* EINZELN — ein vollständiger Satz je Zeile; die Marke tut die ganze Arbeit. */
.pb-bsp-einzeln > li { display: block; }

/* beat 1: the found page leans, the way a loose sheet does — a page laid out
   perfectly square reads as a UI asset rather than as something picked up */
.pb-treasure-tilt {
  position: relative;
  z-index: 1;
  display: block;
  transform: rotate(-4deg);
}

/* beat 2: the painted open book as a band across the top of the rule */
.pb-rule-band {
  position: relative;
  height: 78px;
  overflow: hidden;
  border-radius: 13px 9px 14px 10px / 10px 14px 9px 13px;
  /* R5-W3 · J2 · R21: joins the family. »#b78d51« was the last pre-family contour
     left INSIDE the veil — one amber hairline in a house of crayon edges.
     ⚠ CORRECTED IN THE SAME ROUND, by a blind critic who was right: the first
     attempt used --pb-ink-line (whisper strength) and that flattened the
     hierarchy — »the gold line does a job: it says this rectangle is special,
     look inside it«, and against the dashes at the same weight the picture frame
     stopped announcing itself. Joining the family was correct; joining it at a
     WHISPER was not. Full-strength ink keeps the frame loud AND in the family.
     The hand, rotated three
     times (0,80 · 0,75 · 1,20 · 1,25) as literals on a 2 px base; pairs sum to
     4,0, so the band's outer height is unchanged and the book art centred inside
     it does not shift. */
  border-style: solid;
  border-color: var(--pb-ink);
  border-width: 1.6px 1.5px 2.4px 2.5px;
  box-shadow: inset 0 2px 10px rgba(120, 96, 52, 0.28);
  margin: 0 0 10px;
  /* wie weit das Blatt über sein Fenster hinausragt — die Begründung steht bei
     der Bild-Regel darunter, die den Wert benutzt */
  --pb-rule-band-zoom: 118%;
}
.pb-rule-band img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%);
  /* R5-W7 · D5 · P6/R196 · DAS FENSTER ZEIGT DIE SEITEN, NICHT DEN BUCHDECKEL.
     Beide Material-Kritiker der P6-Runde nannten unabhängig dieselbe Stelle:
     »zwei harte schwarze Streifen mit exakt senkrechten, pixelscharfen Kanten«
     links und rechts im Buch-Fenster. Nachgemessen am Bank-Foto: je acht
     Bildpunkte mit rgb(2, 6, 8), während die 660 Spalten dazwischen im Mittel
     bei 131 liegen.

     GEMESSEN, nicht vermutet — und die erste Vermutung war falsch. Ein Blatt,
     das sein Fenster nicht ausfüllt, war es NICHT: eine Probe mit rot
     eingefärbtem Bandhintergrund zeigt die Streifen unverändert schwarz, sie
     sind also DECKEND. Es ist der gemalte BUCHDECKEL selbst. In dem Streifen,
     den dieses Band zeigt (Quellzeilen 230–475 von 768), endet die fast
     schwarze Deckelkante links bei Spalte 59 und beginnt rechts wieder bei
     Spalte 969 — bei Breite 100 % liegen genau diese beiden Kanten bündig an
     der Tuschekante und lesen sich als zwei Balken statt als ein Buch.

     118 % schneidet 78 Quellspalten je Seite weg (sichtbar bleiben 78–946):
     19 Spalten Luft links, 23 rechts, und beide Ränder liegen im DECKENDEN
     Teil des Blattes, also entsteht auch kein Papierspalt. Das Fenster rahmt
     damit die aufgeschlagenen SEITEN — was ein Bilderrahmen in diesem Buch
     tun soll. Der Wert ist ein Messwert, kein Geschmack: cards/rule-band.test.ts
     rechnet ihn gegen das Blatt nach und wird rot, sobald er wieder auf 100 %
     steht oder ein neues Blatt seine dunkle Kante weiter innen trägt. */
  width: var(--pb-rule-band-zoom, 118%);
  /* ⚠ OHNE DIESE ZEILE PASSIERT GAR NICHTS. Die App setzt global »img
     max-width 100 %«, und diese Schranke schlägt jede Breite über 100 % still
     ab: mit 118 % rechnete der Browser weiter 100 % und das Bild blieb Pixel
     für Pixel dasselbe (gemessen: 384,5 px statt 453,7 px, Bank-Foto vorher
     und nachher bytegleich). Ein Bild, das absichtlich über sein Fenster
     hinausragen soll, muss die Schranke ausdrücklich aufheben. */
  max-width: none;
  height: auto;
}

/* the one chip that is a door: same paint, plus the affordances a button owes
   a child — a pointer, a hover lift, and a focus ring that is not the browser's
   blue (this page has no blue in it anywhere else) */
.pb-hud-chip-btn {
  cursor: pointer;
  font: inherit;
  transition: transform 120ms ease-out, box-shadow 120ms ease-out;
}
.pb-hud-chip-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 9px rgba(60, 42, 16, 0.26); }
.pb-hud-chip-btn:focus-visible { outline: 3px solid #d99a3c; outline-offset: 2px; }

/* ── R5-W4b · D3b · D-209 · THE BAR STEPS BACK TOO ────────────────────────────
   Koki's words for the focus mode were „alles andere ausgeblendet", and D3a's
   veil only reached the STAGE: the counters live on the page above it, so a
   card opened into a darkened world with a bright row of chips still lit over
   it — the one bit of the screen the focus mode could not reach was the one bit
   made of numbers, which is exactly what pulls an eye.

   It is applied to the ROW, not to a chip: a chip that dimmed itself would
   still leave the phase name beside it burning, and every future chip would
   have to remember to opt in. Ink rather than opacity alone — a chip at low
   alpha over a light page turns into a pale smudge, while draining its colour
   first lets it read as „set down" rather than „half erased". */
.pb-hud-dim {
  opacity: 0.26;
  filter: grayscale(0.85) brightness(0.86);
  transition: opacity 260ms ease-out, filter 260ms ease-out;
}

/* DIE MERKSEITE — the collected rules, and the gaps where the rest still are */
.pb-merk-list { display: grid; gap: 9px; margin: 8px 0 4px; }
.pb-merk-slot {
  /* R5-W9 · N1: HIER STAND DERSELBE ZITAT-BALKEN wie am Merksatz (border-left,
     3 px) — und Kokis Urteil „KI-Optik" gilt einer KLASSE, nicht einer Stelle.
     Ein Archiv-Fach ist auch kein Zitat; es ist ein Blatt, das im Buch klebt.
     Getrennt wird jetzt durch Abstand und den Zettel im Fach, nicht durch eine
     Linie am Rand. (Die Fächer der noch fehlenden Seiten behalten ihre eigene
     Sprache über .pb-merk-gap.) */
  padding: 2px 0 6px;
}
/* ».pb-merk-topic« (die gesperrte Versalien-Zeile, die bis heute der TITEL einer
   Regel-Seite war) ENTFERNT in R5-W9 · N1 — dieselbe Behandlung wie
   ».pb-portrait« und ».pb-treasure-plate« vor ihr: keine TSX wendet sie mehr an.
   Sie WAR Kokis Befund D-770 Punkt 1: 11,5 px stille Tinte in Versalien für die
   wichtigste Zeile der Karte. Ihre Nachfolgerin ist .pb-rule-titel weiter oben.
   Das laut hinzuschreiben ist der Punkt — eine stillgelegte Regel, die stehen
   bleibt, wird beim nächsten Umbau versehentlich wieder angeschlossen. */
/* a slot that is still missing: the torn stub, greyed, and no text — what is on
   a page you have not found is not something you know */
.pb-merk-gap {
  display: flex;
  align-items: center;
  gap: 9px;
  /* R5-W3 · J2 · R21: the third way of saying »quieter« is gone. This slot already
     says it twice below, and a hard-coded hex was the drift the token block exists
     to end — the stub now inherits the family's pen and lets opacity do the work. */
  opacity: 0.62;
  filter: grayscale(0.7);
}
.pb-merk-done {
  font-family: var(--font-display, inherit);
  font-weight: 800;
  color: #a8541a;
  margin: 8px 0 0;
}

/* ».pb-treasure-plate« (the chapter's painted open book behind the found page)
   REMOVED in R5-W3 · J2 for the same reason as the portrait above: no TSX has
   ever applied it. Its live siblings below — the page, its glow and its lean —
   stay exactly as they are: they carry no ruled edge and no contour colour, so
   there is nothing on them for the family to join. Saying that out loud is the
   point; the alternative was to tokenise a colour that is read once, which is a
   second name for one number. */
/* the torn page rides OVER the book — it is the subject, the book is the stage */
.pb-treasure-page {
  position: relative;
  z-index: 1;
  display: block;
  filter: drop-shadow(0 3px 7px rgba(60, 42, 16, 0.38));
}
.pb-treasure-glow {
  position: absolute;
  inset: -12% -18%;
  background: radial-gradient(ellipse at 50% 52%, rgba(255, 227, 164, 0.55) 0%, rgba(255, 227, 164, 0.22) 38%, rgba(255, 227, 164, 0) 72%);
  pointer-events: none;
}

/* R5-W2 · J1-D · THE STRUCK-THROUGH WRONG FORM (cards/Glance.tsx). Not the
   browser's own line-through: that draws a hairline through the middle of the
   glyphs in the text's own colour, which on painted paper reads as a rendering
   fault rather than as a correction. This is one INK STROKE in the correction
   ink, laid across at a slight angle the way a teacher's pen does it, thinning
   at both ends. Static — a stroke that animates is a stroke a child watches
   instead of reads — so it is deliberately absent from the kill list below. */
.pb-struck {
  position: relative;
  white-space: nowrap;
  color: #8a7a58;
}
.pb-struck::after {
  content: "";
  position: absolute;
  left: -3%;
  right: -3%;
  top: 52%;
  height: 3px;
  border-radius: 3px;
  transform: rotate(-1.9deg);
  background: linear-gradient(90deg, rgba(176,70,26,0), var(--pb-accent) 18%, var(--pb-accent) 82%, rgba(176,70,26,0));
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
  /* R5-W2 · J1-A: pressed harder and more crookedly. Net angle against the room
     is -10deg, because the wrapper it hangs off now leans +1deg — one degree,
     under the noise floor, and deliberately NOT corrected with a fifth knob. */
  transform: rotate(var(--pb-stamp-tilt));
  border-radius: 15px 12px 16px 13px / 13px 16px 12px 15px;
  background-color: var(--pb-seal);
  background-image: radial-gradient(120% 100% at 26% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 66%);
  box-shadow: inset 0 0 0 3px var(--pb-ink-cast), 0 3px 8px rgba(40,28,12,0.35);
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
  /* R5-W3 · J2 · R21: joins the family. #8a5a2b is literally the ink this look
     REPLACED (doc §1, the --pb-ink row names it) — so this is a rename that was
     overdue, and it nudges contrast 5,26 → 5,53 : 1 on the way. */
  color: var(--pb-quiet-ink);
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
  /* R5-W3 · J2 · R21: joins the family. #8a5a2b is literally the ink this look
     REPLACED (doc §1, the --pb-ink row names it) — so this is a rename that was
     overdue, and it nudges contrast 5,26 → 5,53 : 1 on the way. */
  color: var(--pb-quiet-ink);
  font-family: var(--font-label, inherit);
}

/* ── R5-W3 · E5 · THE LOADING CARD ─────────────────────────────────────────
   Koki's standing trade: „lieber ein kleiner Ladebildschirm als je ein
   Stottern zur Laufzeit". Building a phase costs 127-448 ms of blocked main
   thread (measured 2026-08-14 per build step), and it runs in the same step
   that draws the first frame — so without this the child watches a frozen
   picture and reads it as the game hanging. With it, the wait has a face and a
   promise, which is what a wait is allowed to be.

   It is deliberately CHEAP: one paper panel, one line of type, one soft pulse.
   Nothing here may cost a frame, because the thing it exists to cover is
   already the most expensive moment in the level. */
@keyframes pb-building-breathe {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}
.pb-building {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: radial-gradient(120% 90% at 50% 45%, #fffaea, #f3e0b4);
}
.pb-building-panel {
  background: var(--pb-paper, #fff2cd);
  color: var(--pb-text, #3a2410);
  border: var(--pb-ink-w, 4px) solid var(--pb-ink, #6b3f18);
  border-radius: var(--pb-card-r, 26px 14px 30px 16px / 16px 30px 14px 26px);
  transform: rotate(var(--pb-card-tilt, -1.1deg));
  padding: 18px 26px;
  text-align: center;
  max-width: 78%;
  box-shadow: 0 3px 0 var(--pb-ink-cast, rgba(107,63,24,0.9));
}
.pb-building-title {
  font-family: var(--font-fredoka), system-ui, sans-serif;
  font-size: 20px;
  margin: 0;
}
.pb-building-quiet {
  color: var(--pb-quiet-ink, #7a5c33);
  font-size: 14px;
  margin: 6px 0 0;
  animation: pb-building-breathe 1600ms ease-in-out infinite;
}

/* ── THE END-STATES LAW: every animated class above, killed ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .pb-veil, .pb-wipe, .pb-card, .pb-ring, .pb-verdict, .pb-page, .pb-world-in,
  .pb-letter, .pb-word, .pb-doff, .pb-tether, .pb-rays, .pb-spark, .pb-hero-in,
  .pb-row-in, .pb-door-bloom, .pb-building-quiet {
    animation: none !important;
  }
  /* R5-W2 · I1 · …and the TRANSITIONS, which the kill list never covered because
     it only ever looked for the animation shorthand. »Reduced motion« means no
     motion, not no keyframes. Three of these four predate this packet and were
     moving under reduced motion the whole time — declared in the PR, not fixed
     quietly. (No backticks in here: this whole stylesheet is one template
     literal, and a backtick ends it.) */
  .pb-card button, .pb-card .pb-chip, .pb-hud-chip-btn, .pb-help-body, .pb-hud-dim {
    transition: none !important;
  }
}
`;
