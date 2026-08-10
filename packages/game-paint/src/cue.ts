// PK-R6 · H2 · THE ↑ CUE, HAND-DRAWN (round-2 finding 1).
//
// „The flat white/navy up-arrow glyph hovering over the boy's head is crisp
// vector geometry with hard edges and no texture, sitting directly on the soft
// watercolor background with zero visual integration."
//
// The old cue called itself a chalk arrow in its own comment and was drawn as
// `fillTriangle` + `fillRect` + a 1-px stroke: four straight machine edges, one
// flat fill, no falloff. Everything else in this book has a soft boundary,
// because everything else in it was painted — so the one shape the engine drew
// by hand was the one shape that read as a HUD sticker pasted over the page.
//
// Nothing here is new art. The arrow is still engine-drawn (doc 44 B14) and is
// still the same silhouette; what changed is HOW it is put down, in the three
// moves that separate chalk on paper from a vector glyph:
//
//  · ITS EDGE IS BUILT, NOT STROKED. The shape is filled four times — an ink
//    bleed widest and faintest underneath, then chalk, then a bright core — so
//    the boundary falls off over about a pixel and a half instead of ending at
//    a mathematically exact line. It is the same stacking `renderHostiles` uses
//    for the hazard halo, aimed at a silhouette instead of a disc.
//  · NO EDGE IS STRAIGHT. Every vertex carries a fixed sub-pixel offset taken
//    from a hash, so the shaft leans a hair and the head sits a hair off-square,
//    the way a hand puts a stroke down. Fixed, not per-frame: a jitter that
//    re-rolled every tick would boil, which is a different artefact and a worse
//    one.
//  · IT SHEDS. A soft warm halo behind it (the gilded light the collectible
//    letters already wear, so the affordances of this book share one glow), and
//    a few dust flecks around it, because chalk leaves powder — the same reason
//    `chalkDust` exists under the guardian's writing.
//
// Pure, deterministic and Phaser-free: the scene only fills what this returns,
// so „the cue has a soft edge and no straight line" is a unit test rather than
// a screenshot.

import { hash01 } from "./mass.ts";

export interface CuePt { x: number; y: number }
/** One fill pass of the arrow: a closed polygon at one colour and alpha. */
export interface CueBand { pts: readonly CuePt[]; colour: number; alpha: number }
/** One soft ring of the halo behind it. */
export interface CueRing { r: number; alpha: number }
/** One speck of shed chalk. */
export interface CueFleck { x: number; y: number; r: number; alpha: number }

export interface ChalkArrow {
  halo: readonly CueRing[];
  bands: readonly CueBand[];
  dust: readonly CueFleck[];
}

/** The book's chalk white and its ink contour — the two colours the Tafel, the
 *  projectiles and the written evidence are already drawn in. */
export const CUE_CHALK = 0xf6f2e8;
export const CUE_CORE = 0xfffdf6;
export const CUE_INK = 0x243048;
/** The gilded light the collectible letters wear (PaintScene LETTER_HALO_COLOUR
 *  is the same hue): one glow for every affordance in the book. */
export const CUE_HALO = 0xffe3a4;

/** The arrow at unit size, tip at the top — seven points, the classic
 *  shaft-and-head. y grows downward, as everywhere in this renderer. */
const UNIT: readonly CuePt[] = [
  { x: 0, y: -0.55 },
  { x: 0.45, y: -0.02 },
  { x: 0.17, y: -0.02 },
  { x: 0.17, y: 0.45 },
  { x: -0.17, y: 0.45 },
  { x: -0.17, y: -0.02 },
  { x: -0.45, y: -0.02 },
];

/** How far a vertex may wander from where a ruler would put it, in world px at
 *  the default size. Small on purpose: this is a hand's waver, not a wobble. */
export const CUE_JITTER_PX = 0.62;

/** The fill passes, outermost/faintest first: two ink bleeds, then chalk, then
 *  the core. `grow` is how far the pass sits outside the true silhouette in px —
 *  which is what makes the edge a ramp instead of a step. */
const BANDS: readonly { grow: number; colour: number; alpha: number }[] = [
  { grow: 1.5, colour: CUE_INK, alpha: 0.1 },
  { grow: 0.75, colour: CUE_INK, alpha: 0.16 },
  { grow: 0.2, colour: CUE_CHALK, alpha: 0.62 },
  { grow: -0.85, colour: CUE_CORE, alpha: 0.94 },
];

/**
 * The whole cue, in world px, centred on (x, y).
 *
 * `size` is the arrow's height; `seed` fixes the waver, so two cues on screen
 * are not identical twins and the same cue never changes between frames.
 */
export const chalkArrow = (x: number, y: number, size = 11, seed = 1): ChalkArrow => {
  const jit = (i: number, salt: number): number =>
    (hash01(seed * 7919 + i * 131 + salt) - 0.5) * 2 * CUE_JITTER_PX * (size / 11);
  // the silhouette, once, with its waver baked in
  const base = UNIT.map((p, i) => ({
    x: x + p.x * size + jit(i, 0),
    y: y + p.y * size + jit(i, 977),
  }));
  // …grown outward from the shape's own centre, one copy per pass
  const cx = base.reduce((s, p) => s + p.x, 0) / base.length;
  const cy = base.reduce((s, p) => s + p.y, 0) / base.length;
  const bands = BANDS.map((b) => ({
    colour: b.colour,
    alpha: b.alpha,
    pts: base.map((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      return { x: p.x + (dx / d) * b.grow, y: p.y + (dy / d) * b.grow };
    }),
  }));
  const halo: CueRing[] = [];
  for (let i = 0; i < 3; i++) {
    halo.push({ r: size * (0.85 + i * 0.42), alpha: 0.05 * (1 - i / 3) ** 1.2 + 0.012 });
  }
  const dust: CueFleck[] = [];
  for (let i = 0; i < 6; i++) {
    const a = hash01(seed * 331 + i * 71) * Math.PI * 2;
    const d = size * (0.5 + hash01(seed * 53 + i * 17) * 0.55);
    dust.push({
      x: x + Math.cos(a) * d,
      y: y + Math.sin(a) * d * 0.9,
      r: 0.28 + hash01(seed * 13 + i * 29) * 0.42,
      alpha: 0.18 + hash01(seed * 97 + i * 41) * 0.3,
    });
  }
  return { halo, bands, dust };
};

/** True when no two consecutive edges of a band are exactly axis-aligned or
 *  exactly mirrored — the machine-edge test the old cue would have failed on
 *  every one of its four edges. Exported for the test, and for any future cue
 *  that wants to prove the same thing about itself. */
export const hasNoStraightMachineEdge = (pts: readonly CuePt[]): boolean =>
  pts.every((p, i) => {
    const q = pts[(i + 1) % pts.length] as CuePt;
    return Math.abs(p.x - q.x) > 1e-6 && Math.abs(p.y - q.y) > 1e-6;
  });
