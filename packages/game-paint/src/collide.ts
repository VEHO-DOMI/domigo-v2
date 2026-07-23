// THE PAINTED BOOK — the glyph-grid collision core (pure, Phaser-free).
// The world is rows of 16px-tile glyphs (paintLevel@1, doc 31 §5):
//   .  air            #  solid          =  one-way (land from above only)
//   /  45° rise-right \  45° fall-right
//   1 2  30° rise-right pair (two tiles per ramp: lower half, upper half)
//   3 4  30° fall-right pair (upper half, lower half)
//   ~  flat ice (solid + slippery)      ^  ink-nib spikes (hazard → encounter)
//   w  water/ink pool (hazard)          V  vine column (climbable)
//   s  spring         U  enemy U-turn marker
//   o  swing ring · * collectible · S start · C checkpoint · X exit · B boss
//   (o * S C X B are entity/marker glyphs — air to collision)
//
// Bodies are feet-anchored: x = horizontal CENTER, y = the FEET line; both in
// integer SUBS (256/px). The mover resolves horizontal walls, grounded
// surface-following (incl. slopes), landings, and ceilings, and reports
// contact flags — it never mutates game state beyond position/velocity.

import { BODY_H, BODY_W, SUBS, TILE } from "./paint.ts";

export type Grid = readonly string[];

const SOLID = new Set(["#", "~"]);
const SLOPES = new Set(["/", "\\", "1", "2", "3", "4"]);
const HAZARDS = new Set(["^", "w"]);

export const glyphAt = (grid: Grid, c: number, r: number): string => {
  if (r < 0 || r >= grid.length || c < 0 || c >= (grid[0]?.length ?? 0)) return "#"; // world edge is solid
  return grid[r]?.[c] ?? "#";
};

export const isSolid = (g: string): boolean => SOLID.has(g);
export const isSlope = (g: string): boolean => SLOPES.has(g);
export const isOneWay = (g: string): boolean => g === "=";
export const isHazard = (g: string): boolean => HAZARDS.has(g);
export const isVine = (g: string): boolean => g === "V";
export const isSpring = (g: string): boolean => g === "s";
export const isIce = (g: string): boolean => g === "~";
export const isUTurn = (g: string): boolean => g === "U";

/** A wall stops horizontal motion; slopes and one-ways never do. */
export const isWall = (g: string): boolean => SOLID.has(g);

/**
 * Surface Y (in px, smaller = higher) of a slope glyph at world-x px.
 * 45°: full-tile rise/fall. 30°: half-tile rise/fall per tile of the pair.
 */
export const slopeSurfaceYPx = (g: string, c: number, r: number, xPx: number): number => {
  const xin = Math.min(Math.max(xPx - c * TILE, 0), TILE);
  const top = r * TILE;
  const bottom = top + TILE;
  switch (g) {
    case "/": return bottom - xin; // rises to the right
    case "\\": return top + xin; // falls to the right
    case "1": return bottom - xin / 2; // rise, lower half (16→8)
    case "2": return bottom - TILE / 2 - xin / 2; // rise, upper half (8→0)
    case "3": return top + xin / 2; // fall, upper half (0→8)
    case "4": return top + TILE / 2 + xin / 2; // fall, lower half (8→16)
    default: return bottom;
  }
};

/**
 * The standing surface at world-x px, searching rows from `fromRow` downward
 * up to `maxRows`. Returns the surface's px Y + its glyph, or null.
 * Slope surfaces win inside their tile; solids and one-ways land on tile top.
 */
export const groundSurfaceAt = (
  grid: Grid,
  xPx: number,
  fromRow: number,
  maxRows: number,
): { yPx: number; glyph: string } | null => {
  const c = Math.floor(xPx / TILE);
  for (let r = Math.max(fromRow, 0); r < Math.min(fromRow + maxRows, grid.length); r++) {
    const g = glyphAt(grid, c, r);
    if (isSlope(g)) return { yPx: slopeSurfaceYPx(g, c, r, xPx), glyph: g };
    if (isSolid(g) || isOneWay(g)) return { yPx: r * TILE, glyph: g };
  }
  return null;
};

/**
 * Ledge-grab probe: moving in `dir` (+1 right / −1 left), can a hand grab the
 * top edge of tile (c, r)? Requires: (c,r) solid, air above it, and a clear
 * approach column (the two cells the body occupies beside it).
 */
export const ledgeGrabAt = (grid: Grid, c: number, r: number, dir: 1 | -1): boolean => {
  if (!isSolid(glyphAt(grid, c, r))) return false;
  if (isSolid(glyphAt(grid, c, r - 1)) || isSlope(glyphAt(grid, c, r - 1))) return false;
  const ac = c - dir; // approach column
  if (isSolid(glyphAt(grid, ac, r)) || isSolid(glyphAt(grid, ac, r - 1))) return false;
  return true;
};

export interface MoveResult {
  xSubs: number;
  ySubs: number;
  vxSubs: number;
  vySubs: number;
  grounded: boolean;
  surfaceGlyph: string | null;
  hitWall: -1 | 0 | 1;
  hitCeiling: boolean;
  onIce: boolean;
  hazard: string | null;
  inVine: boolean;
  onSpring: boolean;
  /** PB-T1: true iff the eject invariant had to correct this tick (telemetry
   *  for tests/harness — a shipped level should never need corrections). */
  ejected: boolean;
}

/**
 * PB-T1 · THE ENTITY GROUND CONTRACT: what a walking creature sees one probe
 * ahead. Unlike groundSurfaceAt (the player's forgiving snap probe), this is
 * strict about edges: a drop deeper than `maxDropTiles`, a rise taller than
 * one step, a slope, or a one-way reads as "no ground" unless the role opts
 * in — pencils patrol table-tops; they do not wander down ramps or off
 * cliffs (the playtest's "walking off where he was standing" class).
 */
export const walkSurfaceAhead = (
  grid: Grid,
  xPx: number,
  feetPx: number,
  opts: { maxDropTiles?: number; acceptSlopes?: boolean; acceptOneWays?: boolean } = {},
): { yPx: number; glyph: string } | null => {
  const maxDrop = opts.maxDropTiles ?? 1;
  const fromRow = Math.max(Math.floor(feetPx / TILE) - 1, 0);
  const s = groundSurfaceAt(grid, xPx, fromRow, maxDrop + 2);
  if (s === null) return null;
  if (!opts.acceptSlopes && isSlope(s.glyph)) return null;
  if (!opts.acceptOneWays && isOneWay(s.glyph)) return null;
  if (s.yPx - feetPx > maxDrop * TILE) return null; // cliff ahead
  if (feetPx - s.yPx > TILE) return null; // wall ahead (≥2-tile rise)
  return s;
};

const GROUND_SNAP_PX = 6; // T: grounded surface-follow snap range (slopes, steps)

/** PB-T1: the BODY-WIDTH ground probe — the surface under any of the three
 *  foot samples (left edge, center, right edge), highest wins. A body whose
 *  center is past a lip but whose edge is still on the shelf IS standing
 *  (the v1 center-only probe un-grounded it: the "looks like standing but
 *  isn't solid" playtest class). */
const bodyGroundSurfaceAt = (
  grid: Grid,
  xPx: number,
  fromRow: number,
  maxRows: number,
): { yPx: number; glyph: string } | null => {
  // center wins when present (slope fidelity: feet track the ramp under the
  // hips, not the leading edge); the edge samples only RESCUE a body whose
  // center is past a lip while a foot is still on the shelf
  const center = groundSurfaceAt(grid, xPx, fromRow, maxRows);
  if (center !== null) return center;
  let best: { yPx: number; glyph: string } | null = null;
  for (const sx of [xPx - BODY_W / 2, xPx + BODY_W / 2 - 0.001]) {
    const s = groundSurfaceAt(grid, sx, fromRow, maxRows);
    if (s !== null && (best === null || s.yPx < best.yPx)) best = s;
  }
  return best;
};

/**
 * Advance a feet-anchored body one tick through the grid.
 * Order: horizontal (wall-clamped) → grounded surface-follow (snap to the
 * surface under the new x, else airborne) → airborne vertical (land on the
 * first surface crossed while falling; clamp under ceilings while rising).
 */
export const moveBody = (
  grid: Grid,
  xSubs: number,
  ySubs: number,
  vxSubs: number,
  vySubs: number,
  wasGrounded: boolean,
): MoveResult => {
  const halfW = (BODY_W / 2) * SUBS;
  let hitWall: -1 | 0 | 1 = 0;
  let hitCeiling = false;
  let vx = vxSubs;
  let vy = vySubs;
  let x = xSubs;
  let y = ySubs;
  let grounded = false;
  let freshLanding = false;
  let surfaceGlyph: string | null = null;

  // ── VERTICAL FIRST, at the current x (the canonical order — resolving X
  // first let a diagonal fall step off the edge column before the floor
  // check ran there: the feel-gate clip-through) ──
  if (wasGrounded && vy >= 0) {
    const feetPx = y / SUBS;
    const fromRow = Math.floor((feetPx - GROUND_SNAP_PX) / TILE);
    const found = bodyGroundSurfaceAt(grid, x / SUBS, fromRow, 3);
    if (found && Math.abs(found.yPx - feetPx) <= GROUND_SNAP_PX + Math.abs(vx) / SUBS) {
      y = Math.round(found.yPx * SUBS);
      vy = 0;
      grounded = true;
      surfaceGlyph = found.glyph;
    }
  }
  if (!grounded) {
    const ny = y + vy;
    if (vy > 0) {
      const oldFeet = y / SUBS;
      const newFeet = ny / SUBS;
      const xPx = x / SUBS;
      // PB-T1: sample the BODY WIDTH, not just the center column — a landing
      // where only an edge is over the shelf/ramp must still stick (the v1
      // center-only scan let straddling bodies fall through the lip). The
      // HIGHEST surface crossed in the swept band wins.
      const sampleXs = [xPx - BODY_W / 2, xPx, xPx + BODY_W / 2 - 0.001];
      const fromRow = Math.floor(oldFeet / TILE) - 1;
      const rowsToScan = Math.floor(newFeet / TILE) - fromRow + 2;
      let best: { yPx: number; glyph: string } | null = null;
      for (let r = Math.max(fromRow, 0); r < Math.min(fromRow + rowsToScan, grid.length); r++) {
        for (const sx of sampleXs) {
          const c = Math.floor(sx / TILE);
          const g = glyphAt(grid, c, r);
          let surfY: number | null = null;
          if (isSlope(g)) surfY = slopeSurfaceYPx(g, c, r, sx);
          else if (isSolid(g)) surfY = r * TILE;
          else if (isOneWay(g)) surfY = oldFeet <= r * TILE ? r * TILE : null; // from above only
          if (surfY !== null && oldFeet <= surfY && newFeet >= surfY && (best === null || surfY < best.yPx)) {
            best = { yPx: surfY, glyph: g };
          }
        }
      }
      if (best !== null) {
        y = Math.round(best.yPx * SUBS);
        vy = 0;
        grounded = true;
        freshLanding = true;
        surfaceGlyph = best.glyph;
      } else {
        y = ny;
      }
    } else if (vy < 0) {
      // clamp at the FIRST solid the head actually crosses while rising (the
      // old target-row-only check tunneled past intermediate rows). A body
      // whose head STARTS inside a solid is an embedding, not a ceiling —
      // rise freely and let the eject invariant resolve it.
      const oldHeadRow = Math.floor((y / SUBS - BODY_H) / TILE);
      const newHeadRow = Math.floor((ny / SUBS - BODY_H) / TILE);
      const c = Math.floor(x / SUBS / TILE);
      let clamped = false;
      if (!isSolid(glyphAt(grid, c, oldHeadRow))) {
        for (let r = oldHeadRow; r >= newHeadRow; r--) {
          if (isSolid(glyphAt(grid, c, r))) {
            y = Math.round(((r + 1) * TILE + BODY_H) * SUBS);
            vy = 0;
            hitCeiling = true;
            clamped = true;
            break;
          }
        }
      }
      if (!clamped) y = ny;
    }
  }

  // ── HORIZONTAL SECOND, at the resolved y ──
  let nx = x + vx;
  if (vx !== 0) {
    const dir = vx > 0 ? 1 : -1;
    const edgeSubs = nx + dir * halfW;
    const edgePx = edgeSubs / SUBS;
    const c = Math.floor((dir > 0 ? Math.ceil(edgePx) - 0.001 : Math.floor(edgePx)) / TILE);
    const feetPx = y / SUBS;
    const headRow = Math.floor((feetPx - BODY_H + 1) / TILE);
    // Grounded movers keep the step-up allowance (a surface top within snap
    // range is a STEP for the follow pass, never a wall).
    const feetProbePx = (wasGrounded || grounded) ? feetPx - GROUND_SNAP_PX - 1 : feetPx - 1;
    const feetRow = Math.floor(feetProbePx / TILE);
    for (let r = headRow; r <= feetRow; r++) {
      if (isWall(glyphAt(grid, c, r))) {
        const flushPx = dir > 0 ? c * TILE : (c + 1) * TILE;
        nx = toFlush(flushPx, dir, halfW);
        vx = 0;
        hitWall = dir as -1 | 1;
        break;
      }
    }
  }

  // continuing ground movement re-follows the surface at the new x (slopes,
  // steps, walk-offs). A FRESH landing this tick keeps its grounded state —
  // the next tick's follow decides about the edge (that beat is what feeds
  // the coyote window instead of a phantom slide-past).
  if (grounded && !freshLanding) {
    const feetPx = y / SUBS;
    const found = bodyGroundSurfaceAt(grid, nx / SUBS, Math.floor((feetPx - GROUND_SNAP_PX) / TILE), 3);
    if (found && Math.abs(found.yPx - feetPx) <= GROUND_SNAP_PX + Math.abs(vxSubs) / SUBS) {
      y = Math.round(found.yPx * SUBS);
      surfaceGlyph = found.glyph;
    } else {
      grounded = false;
      surfaceGlyph = null;
    }
  }

  // ── THE EJECT INVARIANT v2 (PB-T1, the original's recale/expel law made
  // body-honest): a body may never END a tick overlapping a solid ANYWHERE in
  // its box — v1 sampled one cell under the feet-center and let corner
  // overlaps rest inside walls. Per pass: support (feet in a floor ≤ half a
  // tile → snap up) → ceiling (head in a solid ≤ half a tile → snap down) →
  // horizontal (push along the smaller penetration). Grounded bodies keep the
  // step-up allowance: the bottom GROUND_SNAP_PX+1 px belong to the follow
  // pass (soft step region), never to the eject. Slopes get the same support
  // backstop (feet sunk below the surface snap up) without becoming walls. ──
  let ejected = false;
  for (let tries = 0; tries < 4; tries++) {
    const feetPx = y / SUBS;
    const xPx = nx / SUBS;
    const left = xPx - BODY_W / 2;
    const right = xPx + BODY_W / 2 - 0.001;
    const bottomPx = grounded ? feetPx - GROUND_SNAP_PX - 1 : feetPx - 1;
    const topPx = feetPx - BODY_H + 1;
    const c0 = Math.floor(left / TILE);
    const c1 = Math.floor(right / TILE);
    const r0 = Math.floor(topPx / TILE);
    const r1 = Math.floor(bottomPx / TILE);
    let hit: { c: number; r: number } | null = null;
    for (let r = r0; r <= r1 && !hit; r++) {
      for (let c = c0; c <= c1; c++) {
        if (isSolid(glyphAt(grid, c, r))) { hit = { c, r }; break; }
      }
    }
    if (!hit) {
      // slope support backstop: feet sunk below the slope surface in its tile
      const fc = Math.floor(xPx / TILE);
      const fr = Math.floor((feetPx - 0.001) / TILE);
      const fg = glyphAt(grid, fc, fr);
      if (isSlope(fg)) {
        const surf = slopeSurfaceYPx(fg, fc, fr, xPx);
        if (feetPx - surf > 0.5 && feetPx - surf <= TILE / 2) {
          y = Math.round(surf * SUBS);
          if (vy > 0) vy = 0;
          grounded = true;
          surfaceGlyph = fg;
          ejected = true;
          continue;
        }
      }
      break; // clean box — the invariant holds
    }
    ejected = true;
    const tileTop = hit.r * TILE;
    const tileBot = (hit.r + 1) * TILE;
    const feetPen = feetPx - tileTop;
    const headPen = tileBot - (feetPx - BODY_H);
    // ceiling push-down is only legal when the space below is verifiably
    // clear — otherwise it digs an embedded body DEEPER (the pillar class);
    // everything unresolved falls through to the horizontal push.
    const belowRow = Math.floor(tileBot / TILE);
    const belowClear = !isSolid(glyphAt(grid, c0, belowRow)) && !isSolid(glyphAt(grid, c1, belowRow));
    if (hit.r === r1 && feetPen > 0 && feetPen <= TILE / 2) {
      y = Math.round(tileTop * SUBS); // support: stand on the tile
      if (vy > 0) vy = 0;
      grounded = true;
      surfaceGlyph = glyphAt(grid, hit.c, hit.r);
    } else if (hit.r === r0 && !grounded && headPen > 0 && belowClear) {
      y = Math.round((tileBot + BODY_H) * SUBS); // ceiling: clamp below
      if (vy < 0) vy = 0;
      hitCeiling = true;
    } else {
      // horizontal: push out the nearer face of the offending tile
      const penLeft = right - hit.c * TILE; // distance to clear moving left
      const penRight = (hit.c + 1) * TILE - left; // distance to clear moving right
      const dir: -1 | 1 = penLeft <= penRight ? -1 : 1;
      const shift = (dir === -1 ? penLeft : penRight) + 0.001;
      nx = Math.round((xPx + dir * shift) * SUBS);
      vx = 0;
      hitWall = dir;
    }
  }

  return finish(grid, nx, y, vx, vy, grounded, surfaceGlyph, hitWall, hitCeiling, ejected);
};

const toFlush = (flushPx: number, dir: number, halfW: number): number =>
  Math.round(flushPx * SUBS) - dir * halfW;

const finish = (
  grid: Grid,
  xSubs: number,
  ySubs: number,
  vxSubs: number,
  vySubs: number,
  grounded: boolean,
  surfaceGlyph: string | null,
  hitWall: -1 | 0 | 1,
  hitCeiling: boolean,
  ejected: boolean,
): MoveResult => {
  // contact scan over the body rect (hazards, vines, springs)
  const xPx = xSubs / SUBS;
  const feetPx = ySubs / SUBS;
  const c0 = Math.floor((xPx - BODY_W / 2) / TILE);
  const c1 = Math.floor((xPx + BODY_W / 2 - 0.001) / TILE);
  const r0 = Math.floor((feetPx - BODY_H + 1) / TILE);
  const r1 = Math.floor((feetPx - 1) / TILE);
  let hazard: string | null = null;
  let inVine = false;
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const g = glyphAt(grid, c, r);
      if (isHazard(g) && hazard === null) hazard = g;
      if (isVine(g)) inVine = true;
    }
  }
  const under = glyphAt(grid, Math.floor(xPx / TILE), Math.floor(feetPx / TILE));
  const onSpring = grounded && (isSpring(under) || isSpring(glyphAt(grid, Math.floor(xPx / TILE), Math.floor(feetPx / TILE) - 1)));
  return {
    xSubs,
    ySubs,
    vxSubs,
    vySubs,
    grounded,
    surfaceGlyph,
    hitWall,
    hitCeiling,
    onIce: grounded && surfaceGlyph === "~",
    hazard,
    inVine,
    onSpring,
    ejected,
  };
};
