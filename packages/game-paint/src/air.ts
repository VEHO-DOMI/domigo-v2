// PK-R6 · H1 · THE AIR — doc 36's missing middle, drawn in code (doc 44 B14).
//
// WHY THIS EXISTS. Round 1 of the quality harness returned two majors that are
// one defect: „scenes read as a single flat plane with no atmospheric depth
// layering … panels collapse to flat solid-color rectangles under the squint
// test", and „compositions are top-heavy with large dead space above a cramped
// gameplay band". Both describe the gap between L1 (the far shell) and L2 (the
// furniture): there is nothing in it, so a frame holds two value bands where the
// reference holds four, and the upper two thirds hold nothing at all.
//
// WHY IN CODE RATHER THAN IN ART. doc 36 §1 already provides for the plane that
// would do this job (L4 FOREGROUND) and it is deliberately unwired — Batch AF
// commissions no foreground art, and shipping a stamped placeholder in front of
// the player is worse than shipping no foreground (composition.test.ts holds
// that as law). doc 44 B14 makes fully-coded effects legitimate, and atmosphere
// is the one thing code draws better than a sheet: it has to follow the camera,
// the world box and the phase's own key, none of which a painted tile knows.
//
// THE RULES THIS FILE KEEPS.
//  · PURE. Everything here is arithmetic over the manifest and the world box, so
//    the audits can run it headlessly — a WebGL canvas cannot be read back
//    (Build-D banked that false negative), so composition is proven by
//    arithmetic, never by sampling the screen.
//  · DETERMINISTIC. Positions come from an index through a multiplicative hash
//    and motion comes from the sim's own tick — no Math.random anywhere, so a
//    replayed tape paints the same air twice.
//  · IT NEVER ENTERS THE GAMEPLAY BAND. Every piece is clamped to the phase's
//    declared `band` (a fraction of world height measured from the top). The
//    critique asked for the DEAD space to be populated, not the live one, and a
//    beam of light across a hostile is a readability defect, not a fix for one.

import { type AirSpec } from "./composition.ts";
import { K_X, K_Y, coverBox, visibleWindow } from "./layers.ts";
import { hash01 } from "./mass.ts";
import { LOGICAL_H, LOGICAL_W } from "./paint.ts";

/**
 * Render depths — the air sits BETWEEN the painted planes it separates.
 * (L0 wash −20 · L1 far −18 · L2 mid −9 · L3 play 1…11 · L4 fg 12.)
 */
export const AIR_DEPTH = {
  /** over the far shell, under the furniture: this is aerial perspective. */
  haze: -12,
  /** over the furniture, so a beam falls in FRONT of the lockers it lights. */
  shaft: -8.8,
  /** over both, under every play object: the room's shadow, not the child's. */
  vignette: -8.5,
  /** in the room's own air — in front of terrain, behind every being (7). */
  mote: 6.4,
} as const;

/** What each ingredient rides at. The haze belongs to the far shell, the beams
 *  to the furniture plane (a beam pinned to the wall reads as painted ON it),
 *  the motes to the play plane, because they are in the room WITH the child. */
export const AIR_PARALLAX = {
  haze: 0.25, hazeY: 0.12,
  shaft: 0.5, shaftY: 0.9,
  mote: 1, moteY: 1,
} as const;

/** How far a mote wanders from its resting place, in world px. */
export const MOTE_DRIFT_X = 5;
export const MOTE_DRIFT_Y = 3.5;
/** Ticks per full drift cycle — long, so the air breathes rather than fizzes. */
export const MOTE_PERIOD = 190;

/** A low-discrepancy spread over 0…1: golden-ratio stepping, so three beams in a
 *  64-tile hall never land on the same rhythm as the L1 segments behind them. */
const PHI = 0.618033988749895;
export const spreadAt = (i: number): number => ((i + 0.5) * PHI) % 1;

export interface HazePiece {
  kind: "haze";
  x: number; y: number; w: number; h: number;
  colour: number;
  /** opacity at the piece's top edge; it reaches 0 at its bottom edge. */
  alphaTop: number;
  parallax: number; parallaxY: number;
  depth: number;
}

export interface ShaftPiece {
  kind: "shaft";
  /** the beam as a quad, mouth first: [topL, topR, footR, footL]. */
  points: readonly [number, number][];
  colour: number;
  alphaTop: number;
  parallax: number; parallaxY: number;
  depth: number;
}

export interface MotePiece {
  kind: "mote";
  x: number; y: number; r: number;
  colour: number;
  alpha: number;
  parallax: number; parallaxY: number;
  depth: number;
}

export type AirPiece = HazePiece | ShaftPiece | MotePiece;

/** The world-y the air band stops at — below it, the gameplay band. */
export const airFloor = (air: AirSpec, worldHpx: number): number => air.band * worldHpx;

/**
 * THE HAZE. One rectangle of the room's own light over the far shell, opaque at
 * the top of the band and gone at its foot. Sized by the SAME cover law the far
 * shell obeys (doc 36 §3) so it can never run out mid-travel and leave a hard
 * edge where the wash suddenly stops being hazy.
 */
export const planHaze = (air: AirSpec, worldWpx: number, worldHpx: number): HazePiece => {
  const box = coverBox(worldWpx, worldHpx, AIR_PARALLAX.haze, AIR_PARALLAX.hazeY);
  // it reaches one band deeper than the shafts do: aerial perspective has no
  // edge in a real room, and a haze that stopped where the beams stop would
  // draw a horizon line nobody asked for
  const h = Math.max(box.h * air.band + box.h * 0.25, 1);
  return {
    kind: "haze",
    x: box.x, y: box.y, w: box.w, h,
    colour: air.hazeColour,
    alphaTop: air.haze,
    parallax: AIR_PARALLAX.haze, parallaxY: AIR_PARALLAX.hazeY,
    depth: AIR_DEPTH.haze,
  };
};

/**
 * THE SHAFTS. Beams leaning `tilt` radians off vertical, dropped across the
 * plane's visible span at golden-ratio intervals and stopping at the air floor.
 * The quad narrows as it falls (light spreads out and thins), which is what
 * makes a flat-alpha polygon read as a beam rather than as a stripe.
 */
export const planShafts = (air: AirSpec, worldWpx: number, worldHpx: number): ShaftPiece[] => {
  const s = air.shafts;
  if (!s || s.count <= 0) return [];
  const box = coverBox(worldWpx, worldHpx, AIR_PARALLAX.shaft, AIR_PARALLAX.shaftY);
  const top = box.y;
  const len = Math.max(airFloor(air, worldHpx) - top, 8);
  const out: ShaftPiece[] = [];
  for (let i = 0; i < s.count; i++) {
    const cx = box.x + spreadAt(i) * box.w;
    const half = s.width / 2;
    const drop = Math.tan(s.tilt) * len;
    // the foot is 1.6× the mouth: the beam opens as it falls
    const footHalf = half * 1.6;
    out.push({
      kind: "shaft",
      points: [
        [cx - half, top],
        [cx + half, top],
        [cx + drop + footHalf, top + len],
        [cx + drop - footHalf, top + len],
      ],
      colour: s.colour,
      alphaTop: s.alpha,
      parallax: AIR_PARALLAX.shaft, parallaxY: AIR_PARALLAX.shaftY,
      depth: AIR_DEPTH.shaft,
    });
  }
  return out;
};

/**
 * THE MOTES, at one tick. Each one has a resting place derived from its index
 * and drifts around it on a long sine — so a still frame shows dust hanging in
 * the light (the reduced-motion end-states law: the base state is the finished
 * one, and motionless air is complete, never stuck) and a running frame shows
 * it moving. `tick` 0 IS that base state.
 */
export const planMotes = (air: AirSpec, worldWpx: number, worldHpx: number, tick: number): MotePiece[] => {
  const m = air.motes;
  if (!m || m.count <= 0) return [];
  const floor = airFloor(air, worldHpx);
  const out: MotePiece[] = [];
  for (let i = 0; i < m.count; i++) {
    const restX = spreadAt(i) * worldWpx;
    const restY = 6 + hash01(i * 2654 + 7) * Math.max(floor - 12, 1);
    const phase = hash01(i * 977 + 31) * Math.PI * 2;
    const t = (tick / MOTE_PERIOD) * Math.PI * 2;
    const x = restX + Math.cos(t * 0.62 + phase) * MOTE_DRIFT_X;
    const y = restY + Math.sin(t + phase) * MOTE_DRIFT_Y;
    out.push({
      kind: "mote",
      x,
      // clamped, so no amount of drift can push a mote into the play band
      y: Math.min(y, floor),
      r: m.radius * (0.6 + hash01(i * 31 + 5) * 0.7),
      colour: m.colour,
      // they twinkle by a third, keyed to their own phase, never to the clock
      alpha: m.alpha * (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.7 + phase))),
      parallax: AIR_PARALLAX.mote, parallaxY: AIR_PARALLAX.moteY,
      depth: AIR_DEPTH.mote,
    });
  }
  return out;
};

/** The whole atmosphere for one phase at one tick, back to front. */
export const planAir = (
  air: AirSpec | undefined,
  worldWpx: number,
  worldHpx: number,
  tick = 0,
): AirPiece[] =>
  air === undefined
    ? []
    : [planHaze(air, worldWpx, worldHpx), ...planShafts(air, worldWpx, worldHpx), ...planMotes(air, worldWpx, worldHpx, tick)];

/**
 * THE VIGNETTE, in camera space. Four bands closing the frame's edges in the
 * room's own shadow — the answer to „blank wall/chalkboard fills roughly half
 * the frame": the back wall stops being one lit rectangle corner to corner, so
 * a squint finds a value ramp where it used to find a solid.
 *
 * Drawn per frame from the camera's own rect (the scene knows camX/camY exactly)
 * rather than with a scroll factor of 0, because a zoomed Phaser camera maps a
 * scroll-free object through an offset that is easy to get wrong and invisible
 * to a unit test — the same class of error the K_X window banked in PB-C1.
 */
export interface VignetteBand {
  x: number; y: number; w: number; h: number;
  /** which edge this band closes — the gradient runs from it inward. */
  edge: "top" | "bottom" | "left" | "right";
  alpha: number;
}

/** How deep each edge band reaches into the frame, as a fraction of the view. */
export const VIGNETTE_DEPTH = { y: 0.34, x: 0.26 } as const;

export const vignetteBands = (
  camX: number,
  camY: number,
  strength: number,
): VignetteBand[] => {
  if (strength <= 0) return [];
  const hY = LOGICAL_H * VIGNETTE_DEPTH.y;
  const hX = LOGICAL_W * VIGNETTE_DEPTH.x;
  return [
    // the top band carries most of it: that is where the dead space is
    { x: camX, y: camY, w: LOGICAL_W, h: hY, edge: "top", alpha: strength },
    { x: camX, y: camY + LOGICAL_H - hY * 0.55, w: LOGICAL_W, h: hY * 0.55, edge: "bottom", alpha: strength * 0.45 },
    { x: camX, y: camY, w: hX, h: LOGICAL_H, edge: "left", alpha: strength * 0.7 },
    { x: camX + LOGICAL_W - hX, y: camY, w: hX, h: LOGICAL_H, edge: "right", alpha: strength * 0.7 },
  ];
};

/**
 * Does the haze cover the camera's travel box, exactly as L0 and L1 must
 * (doc 36 §4.2)? A haze with a visible right edge is worse than no haze: it
 * would draw a vertical seam down the wall halfway through the level.
 */
export const hazeCovers = (piece: HazePiece, worldWpx: number, worldHpx: number): boolean => {
  const maxCamX = Math.max(worldWpx - LOGICAL_W, 0);
  const at0 = visibleWindow(0, piece.parallax, LOGICAL_W, K_X);
  const atMax = visibleWindow(maxCamX, piece.parallax, LOGICAL_W, K_X);
  const EPS = 1e-6;
  if (!(piece.x <= at0.lo + EPS && piece.x + piece.w >= atMax.hi - EPS)) return false;
  // vertically it only owes the TOP of the frame — it is atmosphere, not a plane
  const topAt0 = visibleWindow(0, piece.parallaxY, LOGICAL_H, K_Y).lo;
  return piece.y <= topAt0 + EPS;
};
