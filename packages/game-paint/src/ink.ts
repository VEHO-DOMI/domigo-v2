// R5-W1 · A2 · THE INK IS AN OBJECT — the pure part.
//
// B1's critic, on the shipped build: „die Tinte bewegt sich in 45 Ticks um KEIN
// EINZIGES PIXEL und ist halbtransparent — man sieht in p2 die Wandkarte durch
// den See." He filed it under the sentence this module exists to retire:
// the ink was reading as *a different category of object* from everything else
// in the frame — a flat blue rectangle laid over the painting rather than a
// thing in the world.
//
// Three properties make a liquid read as a liquid, and the old ink had none:
//
//  · IT HIDES WHAT IS BEHIND IT. The body was drawn at alpha 0.92 — enough to
//    see the classroom's wall map straight through the lake. Ink is the one
//    substance in this chapter that must be OPAQUE: the whole fiction is that
//    it swallows things.
//  · IT HAS A SURFACE. Not a 2-px lighter band: a crown with a lit lip and a
//    dark line under it, so the eye reads a boundary between two materials
//    rather than a change of fill colour.
//  · IT MOVES, ALWAYS. Not when touched — always, whether or not the child is
//    looking. That is what separates a pool from a painted rectangle.
//
// Everything here is a pure function of the SIM TICK, so the surface is exactly
// as deterministic as the physics (no Math.random, no Date.now — the standing
// wall), a replay draws the same water it drew last time, and the wave can be
// asserted in a headless test instead of squinted at in a screenshot.

/** How far the ink's own texture drifts per tick, in world px. Slow: a school
 *  ink pool is thick. 0.09 px/tick ≈ 5.4 px/second, so a 44-px wave crest takes
 *  about eight seconds to cross itself — movement you notice without it ever
 *  becoming a river. */
export const INK_SCROLL_PX_PER_TICK = 0.09;

/** The crown's rise and fall, in world px. Deliberately under half a cell: the
 *  standing line the collision uses is flat, and a surface that swung further
 *  than this would draw a lie about where the ink actually is. */
export const INK_WAVE_AMPL_PX = 1.3;

/** The wave's length along the pool, in world px — a bit under three cells, so
 *  a short pool still shows a whole crest and a long one never looks like a
 *  repeating stamp of the same bump. */
export const INK_WAVE_LEN_PX = 43;

/** Ticks for one full up-and-down. 150 at 60 Hz = 2.5 s — a swell, not a ripple. */
export const INK_WAVE_TICKS = 150;

/** A second, slower crest laid over the first. One sine reads as a machine;
 *  two that never divide evenly read as water. (150 and 97 are coprime, so the
 *  pair only repeats every ~4 minutes — longer than any pool is ever on screen.) */
export const INK_WAVE2_TICKS = 97;
export const INK_WAVE2_LEN_PX = 71;
export const INK_WAVE2_SHARE = 0.42;

/**
 * The ink's own pigment — and R5-N3 · A4 moved it, because a blind critic
 * measured that it was not one (D-43).
 *
 * The old value `0x2c3a58` sits at hue 220.9°. The wall behind the p2 lake —
 * `l1_p2_b.png`, the far shell — measures 227.4°, and the room's engine-drawn
 * wash runs 229–234°. So the chapter's one lethal substance was within seven
 * degrees of its own backdrop: the danger and the air it hangs in were the same
 * colour, separated only by value. A child reads hue before value.
 *
 * Ink is not sky-blue. It is indigo going black, the colour a nib leaves when it
 * pools — so the pigment moves to ~255°, a clear 21–28° off every stop of the
 * room, at the same luminance it had before (nothing about the depth ramp or the
 * readability of the hazard changes; only its hue does).
 */
export const INK_BODY = 0x3e2e6c;
/**
 * The lit lip of the crown, and the dark line that sits under it. Two lines,
 * not one band: a boundary between materials is what the eye reads as a
 * surface, and a single lighter strip only ever read as a change of fill.
 *
 * The lit lip came down with the pigment. At `0xa8c0ee` it was 74.6 % luminance
 * against a 22 % body — a 52-point jump, which is why the same critic called the
 * highlights "gilded metal" rather than an oily shimmer. Ink is glossy, not
 * polished: the lip keeps its hue family and loses half the jump.
 */
export const INK_CROWN_LIT = 0x9282c8;
export const INK_CROWN_DARK = 0x1a1534;
/** How many rows down the ink keeps losing light before it bottoms out.
 *
 *  CRITIC ROUND 2 (blind, measuring pixels): "the body fill is flat — 2 unique
 *  RGB values across 63,000 sampled pixels … the client's original complaint
 *  relocated one layer down, now hiding under a nicer rim." Fair, and the cause
 *  was arithmetic: the ramp was spread over six rows while ch01's ink is four
 *  rows deep, so the pool only ever reached the first third of its own falloff.
 *  The ramp now completes INSIDE a real pool. */
export const INK_DEPTH_ROWS = 3;
/** The multiply the deepest ink wears — dark, never black (the same law the
 *  terrain's depth ramp keeps: the darkest dark still holds its hue). */
export const INK_DEPTH_FLOOR = 0.42;

/** The multiply tint for ink this many rows below its own surface. */
export const inkDepthTint = (rows: number): number => {
  const s = 1 - (1 - INK_DEPTH_FLOOR) * Math.min(Math.max(rows, 0), INK_DEPTH_ROWS) / INK_DEPTH_ROWS;
  const ch = Math.max(0, Math.min(255, Math.round(255 * s)));
  return (ch << 16) | (ch << 8) | ch;
};

/** A vertical run of ink in ONE column — the unit a gradient can be poured into. */
export interface InkColumn {
  c: number;
  /** first and last ink row of the run, inclusive */
  r0: number;
  r1: number;
  /** depth at the run's TOP edge and at its BOTTOM edge, in rows */
  dTop: number;
  dBot: number;
}

/**
 * R5-N3 · A4 · WHY THE POOL IS PLANNED IN COLUMNS (D-42).
 *
 * The ink used to be drawn one flat rect per grid cell, tinted from an INTEGER
 * row count. That is a staircase by construction and no amount of tuning could
 * make it anything else: four stops, 16-px risers, and in p2 a bottom half that
 * is one single flat value. The blind critic measured it as "2 unique RGB values
 * across 63 000 sampled pixels".
 *
 * A gradient cannot be poured into a cell, because a cell only has one value. So
 * the pool is planned as vertical RUNS instead, and each run is filled once with
 * a top-to-bottom gradient. The depth ramp then works per PIXEL rather than per
 * row, and the risers disappear — the same move `planBandShade` already makes
 * for the room's own shadow.
 *
 * Pure and grid-derived: no clock, no randomness, so a recorded run paints the
 * same water twice.
 */
export const planInkColumns = (grid: readonly string[]): readonly InkColumn[] => {
  const out: InkColumn[] = [];
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  for (let c = 0; c < w; c++) {
    let r = 0;
    while (r < h) {
      if (grid[r]?.[c] !== "w") { r++; continue; }
      const r0 = r;
      while (r + 1 < h && grid[r + 1]?.[c] === "w") r++;
      // the BOTTOM edge is one row deeper than the last ink cell, so a run that
      // continues below the screen keeps falling instead of flattening early
      out.push({ c, r0, r1: r, dTop: inkDepthAt(grid, c, r0), dBot: inkDepthAt(grid, c, r) + 1 });
      r++;
    }
  }
  return out;
};

/** How many contiguous ink cells sit directly above this one (0 = the surface).
 *  Bounded at the grid's top edge for the same reason the terrain's walk is —
 *  outside the grid is not deeper ink. */
export const inkDepthAt = (grid: readonly string[], c: number, r: number): number => {
  let d = 0;
  while (d < 64 && r - 1 - d >= 0 && grid[r - 1 - d]?.[c] === "w") d++;
  return d;
};

const TAU = Math.PI * 2;

/** How far the ink's texture has drifted by this tick, in world px. */
export const inkScrollAt = (tick: number): number => tick * INK_SCROLL_PX_PER_TICK;

/**
 * The surface height at world x on this tick, in world px, measured DOWN from
 * the pool's flat top edge — so 0 is the collision line and positive is below
 * it. The two crests are summed and normalised, so the result never leaves
 * ±INK_WAVE_AMPL_PX no matter how the parts are tuned.
 */
export const inkCrownOffsetAt = (x: number, tick: number): number => {
  const a = Math.sin(TAU * (x / INK_WAVE_LEN_PX - tick / INK_WAVE_TICKS));
  const b = Math.sin(TAU * (x / INK_WAVE2_LEN_PX + tick / INK_WAVE2_TICKS));
  return INK_WAVE_AMPL_PX * (a * (1 - INK_WAVE2_SHARE) + b * INK_WAVE2_SHARE);
};

/**
 * The crown, sampled across a run — the shape the scene strokes. `step` is the
 * sampling interval in world px; 4 is fine at this wavelength and keeps the
 * point count small even on a 40-cell pool.
 */
export const inkCrownPoints = (
  x0: number,
  x1: number,
  tick: number,
  step = 4,
): Array<{ x: number; y: number }> => {
  const out: Array<{ x: number; y: number }> = [];
  for (let x = x0; x <= x1; x += step) out.push({ x, y: inkCrownOffsetAt(x, tick) });
  if (out[out.length - 1]?.x !== x1) out.push({ x: x1, y: inkCrownOffsetAt(x1, tick) });
  return out;
};
