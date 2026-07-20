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
}

const GROUND_SNAP_PX = 6; // T: grounded surface-follow snap range (slopes, steps)

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
    const found = groundSurfaceAt(grid, x / SUBS, fromRow, 3);
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
      const fromRow = Math.floor(oldFeet / TILE) - 1;
      const rowsToScan = Math.floor(newFeet / TILE) - fromRow + 2;
      let landed = false;
      for (let r = Math.max(fromRow, 0); r < Math.min(fromRow + rowsToScan, grid.length); r++) {
        const c = Math.floor(xPx / TILE);
        const g = glyphAt(grid, c, r);
        let surfY: number | null = null;
        if (isSlope(g)) surfY = slopeSurfaceYPx(g, c, r, xPx);
        else if (isSolid(g)) surfY = r * TILE;
        else if (isOneWay(g)) surfY = oldFeet <= r * TILE ? r * TILE : null; // from above only
        if (surfY !== null && oldFeet <= surfY && newFeet >= surfY) {
          y = Math.round(surfY * SUBS);
          vy = 0;
          grounded = true;
          freshLanding = true;
          surfaceGlyph = g;
          landed = true;
          break;
        }
      }
      if (!landed) y = ny;
    } else if (vy < 0) {
      const headPx = ny / SUBS - BODY_H;
      const r = Math.floor(headPx / TILE);
      const c = Math.floor(x / SUBS / TILE);
      if (isSolid(glyphAt(grid, c, r))) {
        y = Math.round(((r + 1) * TILE + BODY_H) * SUBS);
        vy = 0;
        hitCeiling = true;
      } else {
        y = ny;
      }
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
    const found = groundSurfaceAt(grid, nx / SUBS, Math.floor((feetPx - GROUND_SNAP_PX) / TILE), 3);
    if (found && Math.abs(found.yPx - feetPx) <= GROUND_SNAP_PX + Math.abs(vxSubs) / SUBS) {
      y = Math.round(found.yPx * SUBS);
      surfaceGlyph = found.glyph;
    } else {
      grounded = false;
      surfaceGlyph = null;
    }
  }

  // ── THE EJECT INVARIANT (the original's recale/expel law): a body may
  // never END a tick inside a solid — snap up to the offending tile's top ──
  for (let tries = 0; tries < 3; tries++) {
    const feetPx = y / SUBS;
    const c = Math.floor(nx / SUBS / TILE);
    const r = Math.floor((feetPx - 1) / TILE);
    if (!isSolid(glyphAt(grid, c, r))) break;
    y = r * TILE * SUBS;
    vy = 0;
    grounded = true;
    surfaceGlyph = glyphAt(grid, c, r + 1) !== "." ? glyphAt(grid, c, r) : surfaceGlyph;
  }

  return finish(grid, nx, y, vx, vy, grounded, surfaceGlyph, hitWall, hitCeiling);
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
  };
};
