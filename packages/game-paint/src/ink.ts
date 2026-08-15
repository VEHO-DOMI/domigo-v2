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
 * ── R5-W4 · A6 · THE CROWN BECOMES A MENISCUS ────────────────────────────────
 * Koki, 2026-08-15: „Was ist dieser violette Bogen über der Tinte? Wenn man
 * reinfällt, muss klar sein, worin man gefallen ist."
 *
 * The crown he is looking at was two polylines of CONSTANT width — 1.6 px dark,
 * 1.4 px lit, a fixed 2.2 px apart — riding a ±1.3 px sine. Everything about
 * that description is a drawn line and nothing about it is a liquid. Three
 * measurements say why it could not read as one:
 *
 *  1 · IT WAS THE WRONG COLOUR, AND SO WAS ITS NEIGHBOUR. `INK_CROWN_LIT`
 *      measured 54.3 % against a 21.1 % body — a 33-point jump, still the
 *      "gilded metal" note one round later — while the painted surface strip
 *      under it (`pool_ink_loop.png`) is a neutral grey-green (51, 55, 52). So
 *      the pool was three colour families stacked: a violet body, a grey-green
 *      painting, and a light violet line on top. The only actual PAINT in the
 *      thing was the one part that did not belong to it.
 *  2 · CONSTANT WIDTH IS THE TELL. Surface tension makes a liquid's edge THICK
 *      where the surface dips and thin where it lifts; a band of unvarying
 *      thickness is a contour, which is exactly the word he used.
 *  3 · IT WAS ONE UNBROKEN ARC across the whole pool. Real gloss is broken —
 *      it catches on some crests and not others.
 *
 * What replaces it: a filled band in the ink's OWN pigment, darker and more
 * saturated than the body (that is what the lip of a dark liquid does — it is
 * the deepest part of the pool you can see, not the brightest), whose thickness
 * swells in the troughs; and above it a narrow, BROKEN sheen at less than
 * two-thirds of the old jump.
 *
 * The motion is untouched, and that is a measurement too, not an omission: at
 * three sample points the surface moves 0.58–0.96 px over 45 ticks and its
 * texture drifts 4.05 px. The complaint was never that it stood still (that was
 * B1's, and A2 fixed it) — it was that a moving line is still a line.
 */
export const INK_MENISCUS = 0x2a1a5c;
/** the narrow, broken gloss — same family, and it no longer shouts */
export const INK_SHEEN = 0x7565b0;
/** kept: the deep line under the lip, which is the only part that worked */
export const INK_CROWN_DARK = 0x1a1534;

/** Base thickness of the meniscus band, world px, at a crest. */
export const INK_LIP_MIN_PX = 1.3;
/** How much thicker it gets in a trough. A dip holds more ink than a lift. */
export const INK_LIP_SWELL_PX = 2.4;
/**
 * ── THE PAINTED SURFACE JOINS ITS OWN POOL ───────────────────────────────────
 * `pool_ink_loop.png` — the one piece of real painting in the whole pool — is a
 * neutral grey-green: mean (51.2, 55.1, 52.2), 21.2 % luminance, and its hue is
 * 90° of nothing in particular. `INK_BODY` under it is (62, 46, 108) at 21.1 %
 * and hue 255.5°. Identical value, unrelated family: the exact recipe for two
 * objects instead of one substance, and the reason the pool needed a line drawn
 * around it to read at all.
 *
 * Multiplying by the ink's own direction fixes the family. Taken all the way
 * (0x9567ff) it matches the hue exactly and costs 11 points of luminance;
 * at 0.8 of the way it costs 8.8 and still lands 1.7° from the body:
 *
 *   blend  tint       drawn mean         L        ΔH      S
 *   0.6    0xc0a4ff   (38.4,35.4,52.2)   14.6 %    4.6°   32.2 %
 *   0.8    0xaa85ff   (34.2,28.8,52.2)   12.4 %    1.7°   44.8 %
 *   1.0    0x9567ff   (29.9,22.2,52.2)   10.2 %    0.0°   57.4 %
 *
 * 0.8 is taken. It clears the family law the crown already lives under (within
 * 12° of the body) with room, keeps the surface readable as its own band rather
 * than a black hole, and — the part that matters for the read — carries the
 * sheet's PAINTED highlights with it: a cream fleck at (220, 215, 200) lands at
 * (147, 112, 200), a violet gleam at 49 % instead of a grey one. That is the
 * oily shimmer the D-43 critic asked for, and it comes from the painting rather
 * than from a line laid on top of it.
 */
export const INK_SURFACE_TINT = 0xaa85ff;

/** Sheen dashes are drawn only on the upper `INK_SHEEN_SHARE` of the swell —
 *  so the gloss catches some crests and skips others, instead of ringing the
 *  whole pool like a drawn outline. */
export const INK_SHEEN_SHARE = 0.38;
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

/**
 * How thick the lip is at world x, in world px.
 *
 * Surface tension is the whole idea: where the surface dips, more of the pool's
 * own depth is turned towards the camera and the dark lip fattens; where it
 * lifts, the lip thins to almost nothing. That relationship — thickness moving
 * WITH the wave — is the difference between a liquid edge and a drawn one, and
 * it is the property the old constant-width pair could not have at any colour.
 *
 * Pure in (x, tick), like everything else here: a replayed tape draws the same
 * lip twice.
 */
export const inkLipThicknessAt = (x: number, tick: number): number => {
  const dip = (inkCrownOffsetAt(x, tick) + INK_WAVE_AMPL_PX) / (2 * INK_WAVE_AMPL_PX);
  return INK_LIP_MIN_PX + INK_LIP_SWELL_PX * Math.min(1, Math.max(0, dip));
};

/**
 * ── THE SPLASH (Koki: „wenn man reinfällt, muss klar sein, worin man gefallen
 *    ist") ────────────────────────────────────────────────────────────────────
 * Falling into the ink produced no picture at all. `sim.ts` answers a hazard
 * with a toast („Platsch!"), a knockback and an instant warp to the last
 * checkpoint — correct, and completely invisible: the child is somewhere else
 * before anything can happen where they fell.
 *
 * So the pool draws its own answer, in its own pigment, at the place the entry
 * happened. Deterministic like everything else here: a drop's position is a pure
 * function of (index, age in ticks), so a replayed tape throws the same drops.
 *
 * Deliberately NOT `fx_blob.png`. That sheet exists, is paid for and is unwired
 * (`DEAD_ART_2026-08-14.md` lists it for deletion), and it was the obvious
 * candidate — but measured it is TEAL, mean (50, 143, 140) at 48.2 % luminance,
 * and the only multiply that would carry it into the ink's family is 0xff429e,
 * which is a repaint by another name. Filed for the architect, not forced.
 */
export const INK_SPLASH_TICKS = 26;
export const INK_SPLASH_DROPS = 7;

/** One drop of a splash, `age` ticks after it began, in world px relative to the
 *  entry point. `null` once the splash is spent. */
export const inkSplashDropAt = (
  i: number,
  age: number,
): { x: number; y: number; r: number; alpha: number } | null => {
  if (age < 0 || age >= INK_SPLASH_TICKS) return null;
  const t = age / INK_SPLASH_TICKS;
  // a fan, no two drops on the same arc, and no randomness anywhere
  const spread = ((i / (INK_SPLASH_DROPS - 1)) * 2 - 1) * 13;
  const lift = 9 + (i % 3) * 3;
  return {
    x: spread * t * 1.6,
    // Up fast, then down: the parabola every thrown thing draws. Normalised so
    // `lift` is the height actually reached — `2t − 2.6t²` peaks at 5/13 of its
    // own coefficient, so an un-normalised version threw drops 3.5 px when it
    // said 9, which the test caught.
    y: -lift * (5.2 * t - 6.76 * t * t),
    r: 1.9 - 0.9 * t + (i % 2) * 0.35,
    alpha: Math.max(0, 0.9 * (1 - t * t)),
  };
};

/**
 * The x-runs where the sheen catches, on this tick — the broken half of the
 * gloss law.
 *
 * A highlight that follows the entire surface is an outline with a lighter
 * colour; it was the second half of why the old crown read as a drawn arc. Gloss
 * only appears where the surface is turned towards the light, so a dash exists
 * only over the LIFTED part of the swell (`INK_SHEEN_SHARE` of it), which the
 * two coprime sines break into uneven pieces that travel — never the same
 * pattern twice inside a pool's time on screen, and never a full ring.
 */
export const inkSheenRuns = (
  x0: number,
  x1: number,
  tick: number,
  step = 4,
): Array<{ x0: number; x1: number }> => {
  const lit = (x: number): boolean =>
    inkCrownOffsetAt(x, tick) < -INK_WAVE_AMPL_PX * (1 - 2 * INK_SHEEN_SHARE);
  const runs: Array<{ x0: number; x1: number }> = [];
  let start: number | null = null;
  for (let x = x0; x <= x1; x += step) {
    if (lit(x)) { if (start === null) start = x; continue; }
    if (start !== null) { runs.push({ x0: start, x1: x - step }); start = null; }
  }
  if (start !== null) runs.push({ x0: start, x1 });
  // a one-sample dash is a dot, and a dotted pool reads as noise
  return runs.filter((r) => r.x1 - r.x0 >= step);
};
