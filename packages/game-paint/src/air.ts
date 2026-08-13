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

import { type AirSpec, type ShellSpec, resolveMeasure } from "./composition.ts";
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
  /** PK-R6 · H2 · the shadow gathering at the furniture's own foot (round-2
   *  finding 9) — over the band, under everything that lives in front of it. */
  bandShade: -8.95,
  /** PK-R6 · H2 · what turns over in the scenery (round-2 finding 13). In front
   *  of the furniture band and its shade, and still a whole plane behind the
   *  nearest gameplay object, which is the entire reason it may live this low. */
  life: -8.9,
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

/** …and what the leaves ride: the furniture plane's own factors, because that is
 *  the plane they are turning over (see AirSpec.life). */
export const LIFE_PARALLAX = { x: 0.5, y: 0.9 } as const;

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

/**
 * PK-R6 · H2 · WHERE THE LIGHT COMES FROM (round-2 finding 9: „unmotivated
 * diagonal glare overlay across every frame … reads as a leftover render
 * artifact rather than deliberate atmosphere").
 *
 * The beams were always meant to be motivated — this file's own header calls
 * them „where that light comes FROM" — and p4's spec has said „two stage lamps"
 * in a comment since the day it was written. A comment is not a picture. On a
 * stage the fixture is part of the set: you see the lamp, and THEN you accept
 * the shaft. So the source is drawn, at the beam's own mouth, in the beam's own
 * colour, on the beam's own plane — one housing, one hot lens, one bloom.
 *
 * The critique offered removal as the alternative. Removing would have been the
 * wrong repair: the haze/shaft/vignette trio is what put a fourth value band
 * into a two-band frame (round 1's finding), so deleting the beams would trade a
 * named minor for a named major. What was missing was never the light. It was
 * the lamp.
 */
export interface SourcePiece {
  kind: "source";
  /** the mouth's centre and half-width, in the shaft plane's own coordinates. */
  x: number; y: number; halfW: number;
  /** how deep the fixture hangs below its mouth. */
  depthPx: number;
  colour: number;
  alpha: number;
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

export type AirPiece = HazePiece | ShaftPiece | MotePiece | SourcePiece;

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
  // PK-R6 · H2 · A BEAM WITH A FIXTURE STARTS WHERE THE FIXTURE CAN BE SEEN.
  // Measured in the running arena: the cover box puts the mouth at world y 22,
  // and this room's camera is pinned (a 20-row world under a 14-row view), so it
  // never shows anything above y 109 on this plane. A lamp drawn at the true
  // mouth is 86 px off the top of the frame — which is the finding restated,
  // not fixed. So a beam that OWES a fixture is shortened to start inside the
  // frame, and `planSources` reads its mouth: the two can never disagree.
  const top = s.source === undefined ? box.y : Math.max(box.y, sourceTopOf(worldHpx));
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
 * PK-R6 · H2 · THE BEAM LOSES ITS MACHINE EDGE (round-2 finding 5, major).
 *
 * „A lighter parallelogram-shaped patch sits across the bookshelf and stone
 * pillar with a crisp, unblended straight edge — reads as a compositing layer,
 * not in-world light." Cropped at 1.6× off the arena frame, that is exactly what
 * it is, and the cause is in the drawing rather than in the plan: the beam was
 * laid as THREE nested quads of flat alpha, so it had three visible lateral
 * boundaries and — worse — it stopped dead at the air floor, drawing a straight
 * horizontal cut across the bookshelf where the light simply ended.
 *
 * The geometry does not change (the clamp that keeps every beam out of the
 * gameplay band is the plan's, and it stays exactly where it was). What changes
 * is that the same quad is now filled as a GRID of thin pieces:
 *   · SIDEWAYS — `SHAFT_RINGS` nested rings each carrying one Rth of the beam's
 *     opacity, so the accumulated alpha ramps from the core to nothing at the
 *     rim. The outermost step is alphaTop/R ≈ 1 % — under the threshold at which
 *     an edge can be seen at all.
 *   · DOWNWARD — `SHAFT_SLICES` bands whose opacity falls off with the square
 *     root of distance cubed, reaching effectively zero at the foot. Light in a
 *     room does not end; it runs out.
 *
 * Pure, so the gate can assert both edges are invisible without a browser —
 * which is the only way to prove it, since a WebGL canvas reads back black.
 */
export const SHAFT_RINGS = 7;
export const SHAFT_SLICES = 6;
/** The opacity above which an edge becomes visible against painted art. Measured
 *  against the shipped beams: the failing version's outermost step was 0.034 for
 *  p4 (alphaTop 0.10 over three quads at 0.34 of it), and it is legible in a
 *  1.6× crop. Half of that is the ceiling every piece of a beam's rim must clear. */
export const SHAFT_EDGE_MAX = 0.017;

export interface ShaftQuad {
  points: readonly [number, number][];
  alpha: number;
  /** 0 = the outermost ring (the rim), RINGS−1 = the hot core. */
  ring: number;
  /** 0 = the mouth, SLICES−1 = the last band before the beam is gone. */
  slice: number;
}

/** The beam, subdivided. Bilinear over the planned quad, so a piece can never
 *  leave it — and therefore can never leave the air band the plan clamped it to.
 *
 *  R5-W2 · I1: the parameter is the two fields this actually reads rather than a
 *  whole `ShaftPiece`, so the treasure beam (cue.ts) can borrow the subdivision
 *  instead of re-deriving it. That matters: what makes a beam look like light
 *  and not like a translucent triangle is exactly this — the rim ring and the
 *  last slice both land under SHAFT_EDGE_MAX, so the beam has no visible edge
 *  and no visible foot. A second implementation would have to rediscover that.
 *  Every existing caller passes a full ShaftPiece and is unaffected. */
export const shaftQuads = (s: Pick<ShaftPiece, "points" | "alphaTop">): ShaftQuad[] => {
  const [tl, tr, fr, fl] = s.points;
  if (!tl || !tr || !fr || !fl) return [];
  const at = (u: number, v: number): [number, number] => {
    const topX = tl[0] + (tr[0] - tl[0]) * u;
    const topY = tl[1] + (tr[1] - tl[1]) * u;
    const botX = fl[0] + (fr[0] - fl[0]) * u;
    const botY = fl[1] + (fr[1] - fl[1]) * u;
    return [topX + (botX - topX) * v, topY + (botY - topY) * v];
  };
  const out: ShaftQuad[] = [];
  for (let ring = 0; ring < SHAFT_RINGS; ring++) {
    const inset = 0.5 * (ring / SHAFT_RINGS);
    for (let slice = 0; slice < SHAFT_SLICES; slice++) {
      const v0 = slice / SHAFT_SLICES;
      const v1 = (slice + 1) / SHAFT_SLICES;
      const fade = (1 - (v0 + v1) / 2) ** 1.5;
      out.push({
        points: [at(inset, v0), at(1 - inset, v0), at(1 - inset, v1), at(inset, v1)],
        alpha: (s.alphaTop / SHAFT_RINGS) * fade,
        ring, slice,
      });
    }
  }
  return out;
};

/** How far the fixture hangs below the mouth it lights, as a fraction of the
 *  beam's own half-width. A lamp shallower than its mouth reads as a smudge. */
export const SOURCE_DEPTH_FRAC = 0.72;
/** How far below the top of the frame a fixture hangs, in world px. Enough for
 *  the housing AND the bar it hangs from to clear the edge. */
export const SOURCE_INSET_PX = 22;

/**
 * The highest world-y on the SHAFT plane this room's camera can ever show, plus
 * the fixture's own clearance. Derived the way `hazeCovers` derives its x
 * window — from the camera's own travel, not from a number somebody measured
 * once — so a room with a taller world moves its lamps by itself.
 */
export const sourceTopOf = (worldHpx: number): number =>
  visibleWindow(Math.max(worldHpx - LOGICAL_H, 0), AIR_PARALLAX.shaftY, LOGICAL_H, K_Y).lo + SOURCE_INSET_PX;

/**
 * THE SOURCES — one fixture at the mouth of each shaft, or none when the phase
 * declares no `source` (a room whose light is simply the day outside owes no
 * lamp; p1–p3 keep exactly the air they had).
 *
 * Positions are READ OFF the shafts rather than recomputed, so a lamp can never
 * drift off the beam it is lighting — the defect this whole finding is about.
 */
export const planSources = (air: AirSpec, worldWpx: number, worldHpx: number): SourcePiece[] => {
  const s = air.shafts;
  if (!s || s.source === undefined) return [];
  return planShafts(air, worldWpx, worldHpx).map((beam) => {
    const [tl, tr] = beam.points;
    const x = ((tl?.[0] ?? 0) + (tr?.[0] ?? 0)) / 2;
    const halfW = Math.abs((tr?.[0] ?? 0) - (tl?.[0] ?? 0)) / 2;
    return {
      kind: "source" as const,
      x, y: tl?.[1] ?? 0, halfW,
      depthPx: halfW * SOURCE_DEPTH_FRAC,
      colour: s.colour,
      // the fixture is the one part of the atmosphere that is an OBJECT, so it
      // carries more than the beam it throws — a lamp as faint as its own light
      // is the invisible-source problem again, one step further along
      alpha: Math.min(1, s.alpha * 4.4),
      parallax: AIR_PARALLAX.shaft, parallaxY: AIR_PARALLAX.shaftY,
      depth: AIR_DEPTH.shaft,
    };
  });
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

/**
 * PK-R6 · H2 · THE SHADOW AT THE FURNITURE'S FOOT (round-2 finding 9, major).
 *
 * „The compositions collapse into near-uniform pale yellow/tan colour fields with
 * almost no dark anchor shapes to organise the eye." The furniture band is the
 * one horizontal that crosses every frame corner to corner, and it was drawn at
 * one value from its top edge to its bottom one — so the horizon, the line the
 * eye organises a picture around, carried no shadow at all.
 *
 * This is the room's own dark gathering where the furniture meets the ground: a
 * gradient over the band's lower third, nothing at all at its top edge, so the
 * band gains a value ramp instead of a second stripe. It is drawn ON the band's
 * own plane and at the band's own scroll factors, because it is that band's
 * shadow and must never slide against it.
 */
export const BAND_SHADE_FRAC = 0.34;
export const BAND_SHADE_ALPHA = 0.30;

export interface BandShadePiece {
  kind: "bandShade";
  x: number; y: number; w: number; h: number;
  /** 0 at the piece's top edge → this at its bottom edge. */
  alphaBottom: number;
  parallax: number; parallaxY: number;
  depth: number;
}

export const planBandShade = (
  band: ShellSpec | undefined,
  worldWpx: number,
  worldHpx: number,
): BandShadePiece | null => {
  if (!band || band.cover === true) return null;
  const p = band.parallax;
  const pY = band.parallaxY ?? p;
  const h = resolveMeasure(band.height, worldHpx);
  const bottom = resolveMeasure(band.bottom, worldHpx) - (band.lift ?? 0);
  const box = coverBox(worldWpx, worldHpx, p, pY);
  const shadeH = Math.max(h * BAND_SHADE_FRAC, 1);
  return {
    kind: "bandShade",
    x: box.x, y: bottom - shadeH, w: box.w, h: shadeH,
    alphaBottom: BAND_SHADE_ALPHA,
    parallax: p, parallaxY: pY,
    depth: AIR_DEPTH.bandShade,
  };
};

/** Ticks per full turn of a leaf. Long: scenery breathes, it does not flap. */
export const LIFE_PERIOD = 260;
export const LIFE_DRIFT_X = 8;
export const LIFE_DRIFT_Y = 5;

export interface LifePiece {
  kind: "life";
  x: number; y: number;
  /** the leaf's long half-axis, in world px. */
  r: number;
  /** how much of its face is turned toward the room, 0…1 (it turns over). */
  face: number;
  rot: number;
  colour: number;
  alpha: number;
  parallax: number; parallaxY: number;
  depth: number;
}

/**
 * THE LEAVES, at one tick. Same deterministic machinery as the motes — a
 * golden-ratio spread for the resting places, an index hash for the phase, the
 * sim's own tick for the motion — and the same end-state rule: tick 0 is a
 * complete picture of leaves hanging in a garden, not a frozen animation.
 *
 * A leaf turns as it drifts, which is what separates it from dust at 3 px: its
 * face swings edge-on and back, and it nearly vanishes when it is edge-on. That
 * is one line of arithmetic and it is the whole read.
 */
export const planLife = (
  air: AirSpec,
  worldWpx: number,
  worldHpx: number,
  tick: number,
): LifePiece[] => {
  const l = air.life;
  if (!l || l.count <= 0) return [];
  const [lo, hi] = l.band;
  const out: LifePiece[] = [];
  for (let i = 0; i < l.count; i++) {
    const phase = hash01(i * 1373 + 11) * Math.PI * 2;
    const t = (tick / LIFE_PERIOD) * Math.PI * 2;
    const restY = (lo + hash01(i * 811 + 3) * Math.max(hi - lo, 0)) * worldHpx;
    const rot = phase + tick / 47;
    const face = 0.28 + 0.72 * Math.abs(Math.sin(rot));
    out.push({
      kind: "life",
      x: spreadAt(i) * worldWpx + Math.sin(t * 0.83 + phase) * LIFE_DRIFT_X,
      y: restY + Math.cos(t + phase) * LIFE_DRIFT_Y,
      r: l.size * (0.7 + hash01(i * 59 + 17) * 0.6) * 0.5,
      face,
      rot,
      colour: l.colour,
      alpha: l.alpha * face,
      parallax: LIFE_PARALLAX.x, parallaxY: LIFE_PARALLAX.y,
      depth: AIR_DEPTH.life,
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
    : [
        planHaze(air, worldWpx, worldHpx),
        ...planShafts(air, worldWpx, worldHpx),
        ...planSources(air, worldWpx, worldHpx),
        ...planMotes(air, worldWpx, worldHpx, tick),
      ];

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
