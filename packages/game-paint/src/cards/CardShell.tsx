// THE CARD SHELL (PB-T8 / Build-B-skins) — the painted overlay frame every
// task card lives in: stimulus + story line + prompt, the child interaction
// (the skin, passed as children), the F18 hint ladder, and the „Später"
// dismiss (the anti-softlock law). Pure presentation; the machine lives in
// CardHost.
//
// PK-R3a · R3-8 — the frame is now GAME UI rather than a dialog box: an ink-wash
// veil, an ink bloom that wipes the world, a card that springs in a beat later,
// the chalk-erase countdown on quickfire cards, and a verdict beat before the
// world comes back (doc 42 §1, re-skinned). The animations live in overlay-css;
// every base style here is the finished picture, so a reduced-motion child sees
// a complete card (the end-states law).
//
// PK-R6 · C · OVERLAY 2.0 (doc 44 §3.1) closes two of the gap list's items here:
//  · THE PORTRAIT (§3.1.5) — the asker's own painted art INSIDE the card, so a
//    card is a being talking to you rather than a text box quoting one. Falls
//    back to the shipped text placeholder wherever no art exists, because art
//    lands batch by batch and a card must never break on a missing file.
//  · THE RESOLUTION BEAT (§3.1.7) — the answer flies home letter by letter,
//    then the card DOFFS so the world's change can be watched (the restore-hold).
import React from "react";
import type { GameTaskV2 } from "@domigo/content-schema";
import { captiveStem, classmateFreeStem, classmateStem } from "../artManifest.ts";
import { gapLevelFor, renderGapHint } from "./hint.ts";
import { QUICKFIRE_MS, focusPctFor } from "./overlay-css.ts";
import { LETTER_LEAD_MS, LETTER_STAGGER_MS, lettersFor } from "./resolution.ts";
import {
  ActPlate, HelpFold, HintMark, Key, PictureMark, Plate, Quiet, WordMark,
} from "./Glance.tsx";
import { FOLD_START, actMarkFor, foldFor, foldToggled, hintRungsAt, keyLineOf } from "./glance.ts";

/** Which side of the canvas a card sits on. PB-F1/F2-20: a card is always put
 *  DOWN AWAY from the being it talks about, because the boss card says „schau
 *  auf ihre Tafel" and the centred panel used to cover exactly that. */
export type CardAlign = "left" | "center" | "right";

export const alignedWrap = (align: CardAlign): React.CSSProperties => ({
  position: "absolute", inset: 0, display: "flex", alignItems: "center",
  justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
  padding: align === "center" ? 0 : "0 14px",
  background: "rgba(30, 24, 12, 0.35)", zIndex: 10,
  // PK-R6 · H1 (round-1 critique, finding 9): the card's side already says
  // where the being is — it was put down AWAY from it. Publishing that as one
  // custom property here means the veil's light, the ink iris's aperture and
  // the card's thread all point at the same place, because they all read the
  // same value rather than each guessing.
  ["--pb-focus" as string]: focusPctFor(align),
} as React.CSSProperties);

/**
 * R5-W4 · D3 · F-30 · R52 · THE FOCUS WRAP.
 *
 * The focus mode puts the card in the MIDDLE, which looks at first like a
 * repeal of PB-F1/F2-20 („a card is put down away from the being it talks
 * about") — and is not. That law exists so the child can still see what is
 * being asked about, and it is served here by the two things that actually
 * point: the veil's light and the ink thread, both still derived from `align`,
 * i.e. from the side the being is on. Only the LAYOUT moves.
 *
 * So `--pb-focus` and the tether keep reading the original side, while the
 * flex box centres. The padding stays, because a centred card at a modest
 * width must still not touch the frame on a 375 px phone.
 */
export const focusedWrap = (align: CardAlign): React.CSSProperties => ({
  ...alignedWrap(align),
  justifyContent: "center",
  padding: "0 14px",
});

export const cardWrap: React.CSSProperties = alignedWrap("center");
/** PK-R6 · H1 (round-1 critique, finding 3): the card's LOOK moved out of here
 *  and into the „pb-card" rule in overlay-css — painted parchment, deckled edge,
 *  hand-inked inner rule. What is left is layout, because the look was written
 *  twice (here and in PaintGame's ceremony panels) and two copies of a surface
 *  are two surfaces waiting to disagree. */
export const cardBox: React.CSSProperties = { maxWidth: 460, width: "90%" };
/** …and the same for the controls: the paint is „pb-card button" in the
 *  stylesheet, so every skin's chips wear one painted chip. Inline styles beat
 *  a stylesheet, so anything the skins still need to vary (a picked tile's
 *  colour) is set as `backgroundColor`, which leaves the paper grain intact. */
export const cardBtn: React.CSSProperties = {
  // R5-W1 · D1: a chip is a TARGET a six-year-old hits with a finger, and it
  // carries the English word the card is teaching — so it is the second-biggest
  // type on the card now, and 46 px tall (the touch floor the item asked for).
  //
  // R5-W3 · J2 · 18, and it is a RULE now, not a scattering. The judged naive
  // sample carried »font-size: 18px« on chips; J1 declined to build it as a look
  // knob for a good reason (nearly every chip sets its size inline, so a
  // stylesheet rule would have reached only the three rule-page buttons and made
  // an exception exactly there) and handed the number here instead. Koki ruled 18
  // on 2026-08-14. This is the one place the answer chips get their size.
  fontSize: 18, padding: "11px 18px", minHeight: 46, cursor: "pointer",
  fontFamily: "var(--font-label, inherit)", fontWeight: 600,
};

/** The ink iris that wipes the world before a card lands (doc 42 §1, doc 44
 *  §3.1.1). TWO blobs: one border-radius blob swelling from the centre reads as
 *  a circle, two offset ones read as ink running over the page. They animate
 *  themselves away and leave nothing behind. */
export const InkWipe = (): React.ReactElement => (
  <>
    <div className="pb-wipe" aria-hidden />
    <div className="pb-wipe pb-wipe-b" aria-hidden />
  </>
);

/** PK-R6 · H1 · THE INK THREAD (round-1 critique, finding 9: „composed off to
 *  one side with no visual link to the character it interrupts").
 *
 *  The critic's own first suggestion — centre the panel — is the one move this
 *  card may not make: PB-F1/F2-20 put it on this side precisely BECAUSE the
 *  centred panel covered the thing the card tells the child to look at („schau
 *  auf ihre Tafel" over a hidden Tafel). So the composition gets the link it was
 *  actually missing instead: a brush stroke leaving the card's world-facing edge
 *  with a warm bead at its tip, pointing back at the being. Null for a centred
 *  card, which has no being to point at (a ceremony talks to the child). */
/**
 * R5-W4 · D3 · R56 · WHAT THE COUNTER COUNTS.
 *
 * Koki, replay of 15 August: „‚Runde 1 von 6' — warum Runde? Vielleicht
 * ‚Frage 1 von 6'." He is right about the word: a round is something you last,
 * a question is something you answer, and this counter counts the second. And
 * the slash went with it — „1/6" is a score, „1 von 6" is a place in a line.
 *
 * The two words live here as constants, not inline, so ch02 and everything
 * after it inherit the ruling instead of re-deciding it. They are the ONLY
 * German strings this packet is allowed to write; every other line on every
 * card belongs to the copy lane.
 */
const ROUND_LABEL_DE = "Frage";
const ROUND_OF_DE = "von";

/**
 * R5-W4 · D3 · F-14 · R54 · A CAGE NAMES EITHER A THING OR A PERSON.
 *
 * The world already makes this distinction, and it makes it in the DATA: a
 * thing-cage declares `params.captive`, the chapter's one person-cage declares
 * `params.classmate`. The naming law itself is imported rather than retyped —
 * two copies of a stem convention are two conventions waiting to disagree.
 *
 * L0 · D7 · WARUM EIN FLAG UND KEIN NAMENSTEST. Bis zur Level-Welle stand hier
 * `isCaptiveKey(name)`, und das ging gut, solange die Insassen-Schlüssel eine
 * geschlossene Vierer-Liste aus Kapitel 1 waren: »merle« stand nicht darin,
 * also war »merle« eine Person. Seit die Liste jedem Kapitel offensteht, ist der
 * Name kein Unterscheider mehr — »merle« und »tablet« haben dieselbe Form. Der
 * Aufrufer weiss ohnehin, aus welchem Feld sein Name kam, und sagt es jetzt.
 *
 * R5-W5 · C4 · D-228: …and the person half is imported now too. It stood here as
 * a bare `${name}_caged0` template, which made this file the ONLY written source
 * of a convention the scene needs as soon as the person-cage grows its occupant
 * layer. Both halves now come from artManifest; `portrait.test.ts` reddens if a
 * `_caged0` literal ever grows back in this file.
 *
 * Returns a STEM, never a url: whether the sheet has actually landed is the
 * art map's question, and the keen-art law wants that asked at the last moment.
 */
export const cageCellFor = (name: string | undefined, person = false): string | undefined => {
  if (name === undefined || name === "") return undefined;
  return person ? classmateStem(name) : captiveStem(name);
};

/**
 * R5-W4b · D3b · R54 · …AND THE SAME OCCUPANT, OUT.
 *
 * Koki, replay of 15 August: „Merle-Erfolgskarte: altes Bild, sie sitzt noch im
 * Käfig — wir haben sie doch befreit." The ceremony is the beat where the cage
 * is GONE, so it may not show the shell: a thing steps out as its own painted
 * object, and a classmate stands in her free cell rather than her caged one.
 *
 * The mapping is the mirror of `cageCellFor`, one key, two directions:
 *
 *   captive key  →  caged: `captive_<key>`   free: `obj_<key>`
 *   classmate    →  caged: `<name>_caged0`   free: `<name>_a`
 *
 * It returns an ORDERED list rather than one stem, because the class photo has
 * two answers and which one is right depends on what has landed:
 *
 *   · `klassenfoto_a` — the DOM-side sheet ordered as AQ14. Named first so that
 *     the day it lands it is simply used, with no code change here.
 *   · `obj_picture` — the photo the chapter already has. It is the WORLD's
 *     sheet (H2's victory tract hangs it in the cage once the board is clean),
 *     and a card drawing it costs nothing: the art map holds every painting, and
 *     one more claim on an already-claimed stem adds no bytes to any phase.
 *
 * AQ14 went back to the painter this session (a blind sheet check found figures
 * without bodies, a glare across a face and a selection path left in the
 * artwork), so today the second answer is the one that draws. The list is the
 * keen-art law spelled out: ask for the best cell, take the best that exists.
 */
export const KLASSENFOTO_STEM = "klassenfoto_a";

export const freeCellsFor = (name: string | undefined, person = false): readonly string[] => {
  if (name === undefined || name === "") return [];
  if (person) return [classmateFreeStem(name)];
  return name === "picture" ? [KLASSENFOTO_STEM, "obj_picture"] : [`obj_${name}`];
};

const Tether = ({ align }: { align: CardAlign }): React.ReactElement | null =>
  align === "center" ? null : <span className={`pb-tether pb-tether-${align === "right" ? "l" : "r"}`} aria-hidden />;

/** The chalk-erase countdown — only where the timer policy allows a clock at
 *  all (cards/timer.ts, doc 44 §2.9); CardHost owns the timer behind it.
 *
 *  R5-W2 · H1 · DIE STEH-UHR (Kokis Ruling, 14.08.2026). Vorher lief sie ab dem
 *  Einblenden, also lief sie beim LESEN — und ein Erstleser braucht die halbe
 *  Karte allein dafür. Jetzt steht sie voll und still, bis das Kind die Karte
 *  zum ersten Mal berührt, und beginnt bei JEDER weiteren Berührung von vorn.
 *
 *  Der Neustart ist der `key`: ein neuer Schlüssel hängt das Element neu ein,
 *  und eine CSS-Animation beginnt beim Einhängen. Derselbe Zähler treibt drüben
 *  den echten Wecker (CardHost), also können Bild und Maschine nicht
 *  auseinanderlaufen — die häufigste Art, wie eine Uhr lügt.
 *
 *  `armed === false` heisst: keine Animation, volle Breite. Das ist zugleich der
 *  Ruhezustand, den das Gesetz der reduzierten Bewegung ohnehin verlangt. */
export const ChalkClock = ({ ms, armCount = 0 }: { ms: number; armCount?: number }): React.ReactElement => (
  <div className="pb-ring-track" aria-hidden>
    <div
      key={armCount}
      className="pb-ring"
      style={{
        ["--pb-ring-s" as string]: `${ms}ms`,
        ...(armCount === 0 ? { animationName: "none" } : {}),
      } as React.CSSProperties}
    />
  </div>
);

/** PK-R6 · C · THE PORTRAIT SLOT (doc 44 §3.1.5) — R5-W1 · D1 promoted it from
 *  a slot to THE PLATE (cards/Glance.tsx): the picture a card leads with, and
 *  the first thing a six-year-old can act on without reading. The desaturation
 *  law rides along in `wash` (doc 41 §2): a being the ink drained renders GREY
 *  in the world until the child gives its colour back, so its portrait must be
 *  exactly as grey — a full-colour face over a grey desk would hand a restore
 *  card's second step away for free. */

/** PK-R6 · C · THE ANSWER COMES HOME (doc 44 §3.1.7). „Zurück im Buch!" over the
 *  child's own answer, flying in per character on the mined 55 ms stagger — or
 *  gliding back whole when it is too long to read as letters.
 *
 *  R5-W6b · D4 · R160 · DAS WORT KOMMT AUS DEM RICHTIGEN BUCH. Die Zeile hiess
 *  bis heute „Zurückgeholt!" und war ein Rest aus Lost Pages: sie sagt, dass
 *  etwas zurück ist, aber nicht WOHIN. Dieses Kapitel hat ein Buch, aus dem die
 *  Seiten gerissen wurden — die Auflösung sagt deshalb, dass die Seite wieder
 *  drin ist. P5 hat „Befreit!" vorgeschlagen; das Wort ist zweimal vergeben (der
 *  Käfig-Zähler im HUD, PaintGame#Chip label=»Befreit«, und das Arcade-Verdikt),
 *  und ein Wort für zwei Dinge ist keins.
 *
 *  PK-R6 · H1 (round-1 critique, finding 4 — „almost entirely washed out and
 *  illegible"). Every character now sits in a SLOT that already carries a chalk
 *  ghost of itself, and the flying letter inks that ghost in. Three things that
 *  buys, none of them cosmetic:
 *   · the word is legible in EVERY frame of the beat, including the first — the
 *     old version showed nothing at all through the 120 ms lead and fragments
 *     after, which is exactly the frame the harness photographed;
 *   · the flight reads as one word arriving rather than as loose glyphs
 *     drifting, because now the glyphs have visible destinations to arrive at;
 *   · it is the truer picture of the fiction: the word was on the page all
 *     along, drained like everything else OSWIN rained on, and the child's
 *     answer is what puts the ink back into it.
 *  The panel behind it is near-opaque parchment instead of a 0.92 wash, so the
 *  ink has something solid to be dark against. */
export const AnswerHome = ({ answer }: { answer: string }): React.ReactElement => {
  const l = lettersFor(answer);
  return (
    <div
      className="pb-verdict"
      role="status"
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 6,
        background: "#fbf3dd radial-gradient(120% 90% at 50% 8%, rgba(255,253,244,0.95), rgba(233,214,170,0.5))",
        borderRadius: 15, pointerEvents: "none", padding: "0 14px",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3f6329", fontFamily: "var(--font-label, inherit)" }}>
        Zurück im Buch!
      </span>
      <span
        aria-hidden
        style={{ width: 46, height: 2, borderRadius: 2, background: "linear-gradient(90deg, rgba(79,122,52,0), #4f7a34 40%, rgba(79,122,52,0))" }}
      />
      <span style={{ fontSize: 26, fontWeight: 800, color: "#33291a", fontFamily: "var(--font-display, inherit)", lineHeight: 1.2, textAlign: "center" }}>
        {l.kind === "letters"
          ? l.chars.map((ch, i) => (
              <span key={i} className="pb-slot" data-ch={ch === " " ? " " : ch}>
                <span
                  className="pb-letter"
                  style={{ display: "inline-block", animationDelay: `${LETTER_LEAD_MS + i * LETTER_STAGGER_MS}ms` }}
                >
                  {ch === " " ? " " : ch}
                </span>
              </span>
            ))
          : (
            <span className="pb-slot" data-ch={l.text}>
              <span className="pb-word" style={{ display: "inline-block" }}>{l.text}</span>
            </span>
          )}
      </span>
    </div>
  );
};

/** PK-R6 · H1 · THE PAINTED SEAL (round-1 critique, finding 5 — „a generic flat
 *  white-circle Material icon dropped onto painted art"). The critic was exactly
 *  right, and it was the worst place in the chapter to be right about: a ✓ glyph
 *  in a white disc is an app's success toast, and it was the ONLY thing on
 *  screen at the moment the game pays the child for the work.
 *
 *  The payoff is a SEAL now: a torn-edged parchment disc with a green ink ring
 *  pressed into it and a brush-drawn check that is fat through the turn and
 *  tapers off the tail, the way a nib empties. One inline SVG — no asset, no
 *  font glyph — under the same „full-code animation is legitimate" clause the
 *  ink creature rides (doc 44 B14), so it carries the book's palette by
 *  construction and scales without a second file to commission. */
const PaintedSeal = ({ size = 96 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="richtig">
    <defs>
      <radialGradient id="pb-seal-face" cx="36%" cy="24%" r="80%">
        <stop offset="0%" stopColor="#fffdf3" />
        <stop offset="58%" stopColor="#f4e9cd" />
        <stop offset="100%" stopColor="#e0cda1" />
      </radialGradient>
    </defs>
    {/* pressed by a hand, so it does not sit square to the page */}
    <g transform="rotate(-6 50 50)">
      {/* the disc: no two quadrants the same, and no quadrant a true arc */}
      <path
        d="M50 3 C65 2 78 8 86 18 C95 28 98 41 96 53 C93 66 85 79 73 87 C62 94 48 97 36 93 C24 89 13 79 7 67 C2 55 3 39 11 27 C19 15 33 4 50 3 Z"
        fill="url(#pb-seal-face)"
        stroke="#b78d51"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* where the wash pooled while the paper dried */}
      <ellipse cx="64" cy="70" rx="21" ry="13" fill="rgba(176,142,88,0.16)" />
      <ellipse cx="33" cy="30" rx="16" ry="11" fill="rgba(255,253,244,0.5)" />
      {/* the impressed ring, BROKEN — a stamp never bites the whole way round */}
      <path d="M20 22 C29 13 40 10 52 11 C63 12 73 17 80 25" fill="none" stroke="rgba(79,122,52,0.4)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M88 44 C89 57 84 69 74 78" fill="none" stroke="rgba(79,122,52,0.34)" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M46 88 C34 87 23 80 16 70" fill="none" stroke="rgba(79,122,52,0.3)" strokeWidth="1.9" strokeLinecap="round" />
      {/* the brush check: thin off the tail, fat through the turn, lifting at
          the tip — the shape a nib actually leaves, drawn as an outline rather
          than as a stroked polyline, which is what made the old one an icon */}
      <path
        d="M21 52.5 C24 49.5 28.5 50 30.5 53 L45.5 69.5 L70 24.8 C71.2 22.6 74 22.8 74.6 25.2 C75 27 74.4 28.4 73.6 29.8 L50.6 75.2 C48.6 78.6 44.6 78.6 42.4 75.4 L23.6 55.6 C21.8 54.4 20.4 53.6 21 52.5 Z"
        fill="#4f7a34"
      />
      {/* the flick the brush threw coming off the page */}
      <circle cx="79" cy="20" r="1.7" fill="rgba(79,122,52,0.8)" />
      <circle cx="83.5" cy="24" r="1" fill="rgba(79,122,52,0.55)" />
      {/* the gouache sheen every painted surface in this book carries top-left */}
      <path d="M19 24 C27 14 39 10 51 11" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  </svg>
);

/** PK-R6 · H1 · THE PAINTED CAGE (round-1 critique, finding 4 — „a player has no
 *  way to recognize this shape as ‚something caged is here', which fails the
 *  telegraph-fairness bar for a stated core mechanic").
 *
 *  This is the ONE card in the chapter that teaches what a cage is, and it was
 *  teaching it with „🎒↑" — a system emoji, in the reader's own font, over
 *  painted art. So the teaching moment now shows the thing: a woven vessel with
 *  BARS across its mouth, a latch on the front, and a warm light behind the bars
 *  that is the someone inside. The ↑ the copy asks for is drawn rising out of
 *  it, so the shape and the verb arrive as one picture.
 *
 *  One inline SVG — no asset, no glyph — under doc 44 B14's „full-code
 *  animation is legitimate" clause, the same clause the seal above rides. It
 *  carries the book's palette by construction and needs no commission to ship.
 */
export const PaintedCage = ({ size = 128 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="ein Käfig mit jemandem darin">
    <defs>
      <radialGradient id="pb-cage-halo" cx="50%" cy="62%" r="50%">
        <stop offset="0%" stopColor="#ffdd93" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffdd93" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pb-cage-glow" cx="50%" cy="46%" r="62%">
        <stop offset="0%" stopColor="#fff4d2" stopOpacity="0.98" />
        <stop offset="46%" stopColor="#ffd98d" stopOpacity="0.82" />
        <stop offset="100%" stopColor="#e8a94b" stopOpacity="0.12" />
      </radialGradient>
      <linearGradient id="pb-cage-body" x1="18%" y1="10%" x2="82%" y2="96%">
        <stop offset="0%" stopColor="#a8c46a" />
        <stop offset="52%" stopColor="#7d9f4a" />
        <stop offset="100%" stopColor="#5a7734" />
      </linearGradient>
      {/* everything „inside" is clipped to the vessel, so the light and the
          captive can only ever be seen THROUGH the bars */}
      <clipPath id="pb-cage-inside">
        <path d="M18 46 C17 40 24 36 32 35 C42 34 60 34 70 36 C78 37 84 41 83 47 L79 76 C78 84 70 89 60 90 L42 90 C31 89 23 84 22 76 Z" />
      </clipPath>
    </defs>
    {/* the soft painterly halo: warmth leaking out of a shut thing */}
    <ellipse cx="50" cy="62" rx="42" ry="34" fill="url(#pb-cage-halo)" />
    <g transform="rotate(-4 50 60)">
      {/* the vessel — no two sides the same, the way a painted thing never is */}
      <path
        d="M18 46 C17 40 24 36 32 35 C42 34 60 34 70 36 C78 37 84 41 83 47 L79 76 C78 84 70 89 60 90 L42 90 C31 89 23 84 22 76 Z"
        fill="url(#pb-cage-body)"
        stroke="#3d5220"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* SOMEBODY IS IN THERE — drawn inside the vessel, under the bars: a lit
          hollow and a small head-and-shoulders against it. Not a face: a captive
          you can read the expression of is a captive who is already out, and
          this card comes before the child has met her. */}
      <g clipPath="url(#pb-cage-inside)">
        <ellipse cx="50" cy="63" rx="29" ry="23" fill="url(#pb-cage-glow)" />
        <path
          d="M50 47 C55 47 58.5 50.5 58.5 55 C58.5 58 57 60.4 54.6 61.8 C61 63.6 65 68 66 74 L66 90 L34 90 L34 74 C35 68 39 63.6 45.4 61.8 C43 60.4 41.5 58 41.5 55 C41.5 50.5 45 47 50 47 Z"
          fill="#8a6534"
          opacity="0.62"
        />
      </g>
      {/* THE BARS — the one feature that makes the shape a cage */}
      <g stroke="#f3ead2" strokeWidth="3.1" strokeLinecap="round" opacity="0.94">
        <path d="M33 40 L31 86" />
        <path d="M43 38.5 L42 88" />
        <path d="M53 38 L53 89" />
        <path d="M63 38.5 L65 88" />
        <path d="M72 40 L75 84" />
      </g>
      <path d="M20 50 C38 46 64 46 82 50" fill="none" stroke="#f3ead2" strokeWidth="3.1" strokeLinecap="round" opacity="0.9" />
      <path d="M22 72 C40 68 62 68 80 72" fill="none" stroke="#f3ead2" strokeWidth="2.8" strokeLinecap="round" opacity="0.82" />
      {/* the latch: shut, and the only thing between the child and the friend.
          It hangs on the vessel's FRONT, below the captive's head — a padlock
          across somebody's face reads as a mask rather than as a lock */}
      <rect x="43.5" y="70" width="14" height="11" rx="2.5" fill="#e7b357" stroke="#8a5f1f" strokeWidth="2.2" />
      <path d="M47.2 70 L47.2 65.5 C47.2 62 53.8 62 53.8 65.5 L53.8 70" fill="none" stroke="#8a5f1f" strokeWidth="2.4" strokeLinecap="round" />
      {/* the gouache sheen the book leaves in every top-left */}
      <path d="M24 44 C33 39 44 37 55 37" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.6" strokeLinecap="round" />
    </g>
    {/* the verb, rising out of the thing it acts on */}
    <g transform="translate(50 17)">
      <path d="M0 -11 L10 4 L4 4 L4 14 L-4 14 L-4 4 L-10 4 Z" fill="#f6f2e8" stroke="#243048" strokeWidth="2" strokeLinejoin="round" />
    </g>
  </svg>
);

/** PK-R6 · H1 · THE MOTES (finding 7 — „no confetti, particles, light, screen
 *  response or character reaction"). Ten of them thrown off the seal along a
 *  ring the index alone decides: no randomness anywhere, so the celebration a
 *  replayed tape plays is the celebration the child saw. Chalk and amber
 *  alternate — the book's own two-colour dust (PaintScene's puff). */
const CHEER_MOTES = 10;
const Motes = (): React.ReactElement => (
  <>
    {Array.from({ length: CHEER_MOTES }, (_, i) => {
      const ang = (i / CHEER_MOTES) * Math.PI * 2 + (i % 3) * 0.19;
      const dist = 54 + (i % 4) * 13;
      // sized against the RENDER, not against a guess: at 2.4–4.6 px they read
      // as dust on the lens rather than as a celebration
      const r = 3.6 + (i % 3) * 1.5;
      return (
        <span
          key={i}
          className="pb-spark"
          aria-hidden
          style={{
            width: r * 2, height: r * 2,
            background: i % 2 === 0 ? "#f6f2e8" : "#e8c07a",
            boxShadow: i % 2 === 0 ? "0 0 7px rgba(246,242,232,0.9)" : "0 0 9px rgba(232,192,122,0.85)",
            animationDelay: `${60 + (i % 5) * 26}ms`,
            ["--pb-dx" as string]: `${Math.round(Math.cos(ang) * dist)}px`,
            ["--pb-dy" as string]: `${Math.round(Math.sin(ang) * dist)}px`,
          } as React.CSSProperties}
        />
      );
    })}
  </>
);

/** PK-R6 · C · beat 3 of the resolution (doc 44 §3.1.7): the celebration, held
 *  until the world has visibly finished changing — and staged OVER that changed
 *  world rather than inside the card, because the card is what just got out of
 *  its way. This is the old in-card verdict beat, moved to where the order now
 *  puts it: last.
 *
 *  PK-R6 · H1 (finding 7): it is now a BEAT rather than an icon swap — a warm
 *  ray fan opens behind the seal, ten motes are thrown outward, and the seal
 *  itself stamps down with the verdict's own overshoot. The world's half of the
 *  same flourish (sparks and a light flash ON the thing the child just freed)
 *  is in PaintScene.redeemFlourish; this is the card's half, and the two play
 *  together because both hang off the same restore-hold. */
export const Cheer = ({ align = "center" }: { align?: CardAlign }): React.ReactElement => (
  <div style={{ ...alignedWrap(align), background: "transparent", pointerEvents: "none" }}>
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 96, height: 96 }}>
      <div className="pb-rays" aria-hidden style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%" }} />
      <Motes />
      <div className="pb-verdict" style={{ filter: "drop-shadow(0 4px 14px rgba(30,20,10,0.34))" }}>
        <PaintedSeal />
      </div>
    </div>
  </div>
);

const hasAnswer = (t: GameTaskV2): t is Extract<GameTaskV2, { kind: "typed" | "spell" }> =>
  t.kind === "typed" || t.kind === "spell";

export function CardShell({
  task, attempts, onDismiss, align = "center", clockMs, armCount = 0, onActivity, art, portraitWash, captive, captiveIsPerson, round, flight, doff = false,
  colourAskDe, actStep, children,
}: {
  task: GameTaskV2;
  attempts: number;
  onDismiss: () => void;
  align?: CardAlign;
  /** ms the chalk clock has to run, or 0 for no clock at all */
  clockMs?: number;
  /** R5-W2 · H1 · wie oft das Kind die Karte schon berührt hat. 0 = noch nie,
   *  und dann steht die Uhr voll und still da (Kokis Steh-Uhr). Jeder weitere
   *  Wert lässt sie von vorn laufen — der Wert IST der Neustart. */
  armCount?: number;
  /** R5-W2 · H1 · eine ROHE Berührung der Karte. Bewusst nicht `dispatch`: das
   *  Kreide-Rad meldet erst nach 180 ms Stillstand, ein Kind am Rad würde sonst
   *  mitten in der eigenen Antwort abgeschnitten. */
  onActivity?: () => void;
  /** the level's only-present art map (stem → url), for the portrait slot */
  art?: Record<string, string>;
  /** how drained the asker is right now (0…1) — the portrait matches the world */
  portraitWash?: number;
  /** R5-W4 · D3 · F-14 · R54 · WHO IS IN THE CAGE, on the card as in the world.
   *  All four object cages wear the one `satchel` shell, so until now the sound
   *  system, the tablet, the chair and the class photo were the same picture —
   *  Koki, 15 August: „beim Käfig zeigt das Bild immer noch die Schultasche,
   *  nicht die Musikanlage; das Bild soll zeigen, was drin ist."
   *  The key comes off the cage entity (`params.captive`), and the card draws
   *  the occupant's own cell BEHIND the shell, exactly as `PaintScene` does at
   *  depth 6.99 behind 7. A person-cage names her caged cell instead. */
  captive?: string;
  /** L0 · D7: ob `captive` den Namen eines KINDES trägt (Personen-Käfig) statt
   *  eines Ding-Schlüssels. Bis zur Level-Welle liess sich das am Namen ablesen,
   *  weil die Ding-Schlüssel eine geschlossene ch01-Liste waren; seit jedes
   *  Kapitel eigene Insassen hat, sagt es der Aufrufer, der es ohnehin weiss. */
  captiveIsPerson?: boolean;
  /** PK-R6 · D: the reawakening's own counter („Runde 3/6", doc 44 §3.3) */
  round?: { n: number; of: number };
  /** the answer flying home, or null while the card is still being played */
  flight?: string | null;
  /** the restore-hold: the card steps out of the way so the world can be seen */
  doff?: boolean;
  /** R5-W1 · D1: the restore card's SECOND question, while that half is open.
   *  It comes from the machine state (CardHost holds it), because while the
   *  colour step runs THAT is the line the child must read — the card's opening
   *  ask has already been answered. */
  colourAskDe?: string;
  /** R5-W1 · D1: which half of a two-step card is open, so the act mark says
   *  the verb the child is on rather than the one they finished. */
  actStep?: string;
  children: React.ReactNode;
}): React.ReactElement {
  const showDesc = attempts >= 1 && task.hints?.deDesc !== undefined;
  const showWord = attempts >= 2 && task.hints?.deWord !== undefined;
  // F18 gap ladder — only for single-string gap kinds, and only as high as the
  // kind's own face leaves room for (R3-10: a spell card already draws its
  // letter row; see gapLevelFor).
  const gap = hasAnswer(task) ? renderGapHint(task.answer, gapLevelFor(task.kind, attempts)) : "";
  // §3.1.5: the asker's painted face, when this card declares one AND it has
  // actually landed. Both halves matter — the declaration is the author's
  // (which cell of the being is talking), the presence is the disk's.
  const portrait = task.stimulus.type === "entity" && task.stimulus.art !== undefined
    ? art?.[task.stimulus.art]
    : undefined;
  // an image stimulus names a painted piece too; it used to be drawn as its
  // ALT TEXT beside an emoji frame, so the one card kind whose whole point is a
  // picture was the one kind that showed none
  const picture = task.stimulus.type === "image" ? art?.[task.stimulus.stem] : undefined;
  const hasPlate = portrait !== undefined || picture !== undefined;
  // R5-W4 · D3 · F-14 · the occupant's cell, when this card is about a cage and
  // the sheet has landed. Keen-art law: a missing cell leaves the shell exactly
  // as it was, so no card hangs on a file.
  const occupant = art?.[cageCellFor(captive, captiveIsPerson) ?? ""];

  // ── R5-W1 · D1 · THE GLANCE GRAMMAR ────────────────────────────────────────
  // plate → key → quiet → act → help. Which line is the KEY is decided in
  // glance.ts, never here, so the rule is unit-tested and identical on every
  // kind; no sentence is rewritten, only re-ranked.
  const key = keyLineOf(task, colourAskDe);
  const mark = actMarkFor(task.kind, actStep);
  const rungs = hintRungsAt(task, attempts, gap !== "");
  const [fold, setFold] = React.useState(FOLD_START);
  // derived-state pattern: a rung that just landed opens the fold in the same
  // render it appears in, so help a child has just earned is never hidden
  if (rungs !== fold.shownRungs) setFold(foldFor(fold, rungs));
  const helpRows = [
    ...(gap !== "" ? [{ key: "gap", mark: <HintMark />, text: <span style={{ letterSpacing: 1, fontFamily: "var(--font-display, inherit)" }}>{gap}</span> }] : []),
    ...(showDesc ? [{ key: "desc", mark: <HintMark />, text: task.hints!.deDesc }] : []),
    ...(showWord ? [{ key: "word", mark: <WordMark />, text: task.hints!.deWord }] : []),
  ];

  return (
    <div className={`pb-veil pb-veil-focus${doff ? " pb-doff" : ""}`} style={focusedWrap(align)}>
      {/* PK-R6 · H2 (round-2 finding 6): the world beside the card, pushed out
          of focus so its cut-off edges read as a backdrop rather than as a
          framing mistake — sharp over the being the card is about. Listed FIRST
          so the card, its wipe and everything else paint over it. */}
      <div className="pb-defocus" aria-hidden />
      <InkWipe />
      {/* R5-W2 · H1 · die Steh-Uhr hört auf ROHE Eingabe, in der Capture-Phase:
          jede Berührung der Karte zählt, egal welches Bedienteil sie fängt, und
          sie zählt BEVOR das Bedienteil sie verbraucht. Kartenart-blind mit
          Absicht — ein Rad, ein Chip und eine Tastatur sind für ein Kind
          derselbe Handgriff. */}
      <div
        className="pb-card"
        /* R5-W4 · D3 · F-30: in focus the card is centred, so its width is no
           longer a function of which half of the canvas it was pushed into. It
           takes a reading width instead — wide enough for the ask, narrow enough
           that the being it talks about is still there beside it on a desktop.
           `min()` rather than a percentage: 88 % of a 1280 px canvas is a
           billboard, and 460 px of a 375 px phone is an overflow. */
        style={{ ...cardBox, width: "min(460px, 88%)", minWidth: 0, maxWidth: "100%" }}
        onPointerDownCapture={onActivity}
        onKeyDownCapture={onActivity}
      >
        <Tether align={align} />
        {(clockMs ?? 0) > 0 && <ChalkClock ms={clockMs ?? QUICKFIRE_MS} armCount={armCount} />}

        {/* R5-W3 · J2 · D-52: the sheet that scrolls when a card outgrows the veil.
            The tether and the chalk clock stay OUTSIDE it on purpose — the tether
            lies entirely beyond the card's own edge, and the clock is the card's
            frame furniture, not its writing. */}
        <div className="pb-card-scroll">

        {/* PK-R6 · D · THE ROUND COUNTER (doc 44 §3.3). A ceremony a six-year-old
            can see the end of: six is a long way to be asked questions by a
            friend who is still grey, and the difference between a rite and an
            interrogation is knowing how far it runs. It is a LABEL, never a
            clock — the reawakening is calm by the timer policy (doc 44 §2.9)
            and no chalk ring ever runs beside it. */}
        {round !== undefined && (
          <p style={{ fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px", fontFamily: "var(--font-label, inherit)" }}>
            {ROUND_LABEL_DE} {round.n} {ROUND_OF_DE} {round.of}
          </p>
        )}

        {/* ZONE 1 · THE PLATE — a picture leads, always. A card with neither a
            portrait nor a painted piece leads with its own act mark instead:
            doc 44 §3.1 rules that a bare text card is not a legitimate card
            surface, and „nothing yet" is the state art batches leave behind. */}
        {portrait !== undefined ? (
          <Plate url={portrait} behindUrl={occupant} altDe={task.stimulus.type === "entity" ? task.stimulus.showsDe : ""} wash={portraitWash} mark={mark} />
        ) : picture !== undefined ? (
          <Plate url={picture} altDe={task.stimulus.type === "image" ? task.stimulus.altDe : ""} mark={mark} />
        ) : (
          // no painted piece has landed for this asker: the verb becomes the
          // plate, so the card still leads with a picture — and then it does
          // NOT repeat as a badge beside the ask
          <ActPlate mark={mark} />
        )}

        {/* R5-W4 · D3 · THE CAPTION IS THE CONTEXT, NOT THE SMALL PRINT.
            Koki, 15 August: „der deutsche Satz ist winzig klein." He was right
            and the measurement agrees — this line rode the quiet layer at
            12.5 px, the smallest type on the card, while it is the one sentence
            that says what the picture IS. It has its own class now: the ink and
            the restraint of the quiet layer, at a size a first-reader can hold.
            The quiet layer itself stays where it is, so the glance grammar
            (one key line leads, the rest steps back) does not flatten out. */}
        {task.stimulus.type === "entity" && <p className="pb-cap">{task.stimulus.showsDe}</p>}
        {task.stimulus.type === "image" && picture === undefined && (
          <p className="pb-cap"><span style={{ display: "inline-flex", verticalAlign: "-0.2em", marginRight: 5 }}><PictureMark /></span>{task.stimulus.altDe}</p>
        )}

        {/* ZONE 2 · THE ASK — the painted verb and the one marked line, as one
            object. Where a card has an English ask, THAT is the marked line:
            the lesson leads the card instead of hiding inside the buttons at
            16 px, which is where Koki found it on the 11th. */}
        <Key en={key.source === "en"}>{key.text}</Key>

        {/* ZONE 3 · THE QUIET LAYER — the German that is not the ask. Kept, in
            full, one step back: a first-reader needs it, but it stopped being
            the loudest thing on the card. */}
        {key.text !== task.storyDe && <Quiet>{task.storyDe}</Quiet>}

        {/* ZONE 4 · THE ACT — the controls the verb just named */}
        {children}

        {/* ZONE 5 · THE HELP — folded until the child earns a rung */}
        <HelpFold open={fold.open} onToggle={() => setFold(foldToggled(fold))} rows={helpRows} />

        <button
          // the quiet way out: the same paper as every other chip, pressed flat
          // — a secondary action should read as further back on the page, not
          // as a different material (round-1 critique, finding 3)
          // R5-W7 · D5: die vier Zahlen, die diesen Zustand ausmachten (Wäsche,
          // Randfarbe, Tinte, keine Lippe), stehen jetzt als »pb-btn-quiet« im
          // Stylesheet. Nicht aus Ordnungsliebe: die Wäsche war eine
          // Hintergrund-FARBE, und die ist in CSS die unterste Lage — seit die
          // gemalte Plakette unter jedem Chip liegt und DECKT, malte sie hinter
          // einem Vorhang (gemessen: rgb(240, 197, 121) mit 0,5 wie mit 0,83).
          // Oben im Stapel steht die Begründung samt Messung.
          className="pb-btn-quiet"
          style={{ ...cardBtn, marginTop: 16, fontSize: 13 }}
          onClick={onDismiss}
        >
          Später ↩
        </button>

        </div>

        {/* beat 1 of the resolution: the answer flies home over the card face.
            Outside the sheet: it flies ACROSS the whole card, not down its text. */}
        {flight !== null && flight !== undefined && flight.length > 0 && <AnswerHome answer={flight} />}
      </div>
    </div>
  );
}
