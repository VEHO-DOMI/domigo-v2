import { describe, expect, it } from "vitest";
import {
  glyphAt,
  groundSurfaceAt,
  isHazard,
  isOneWay,
  isSlope,
  isSolid,
  isUTurn,
  isWall,
  ledgeGrabAt,
  moveBody,
  type MoveResult,
  slopeSurfaceYPx,
} from "./collide.ts";
import { SUBS, TILE } from "./paint.ts";

const px = (n: number) => n * SUBS;

/** Run the mover N ticks with constant intent, threading state through. */
const run = (
  grid: readonly string[],
  start: { x: number; y: number; vx: number; vy: number; grounded: boolean },
  ticks: number,
): MoveResult => {
  let st: MoveResult = {
    xSubs: px(start.x),
    ySubs: px(start.y),
    vxSubs: px(start.vx),
    vySubs: px(start.vy),
    grounded: start.grounded,
    surfaceGlyph: null,
    hitWall: 0,
    hitCeiling: false,
    onIce: false,
    hazard: null,
    inVine: false,
    onSpring: false,
    ejected: false,
  };
  const vx = px(start.vx);
  const vy = px(start.vy);
  for (let t = 0; t < ticks; t++) {
    st = moveBody(grid, st.xSubs, st.ySubs, st.hitWall !== 0 ? 0 : vx, st.grounded ? (start.grounded ? vy : 0) : vy, st.grounded);
  }
  return st;
};

describe("glyph classification", () => {
  it("classifies the vocabulary", () => {
    expect(isSolid("#")).toBe(true);
    expect(isSolid("~")).toBe(true); // ice is solid…
    expect(isWall("~")).toBe(true);
    expect(isWall("=")).toBe(false); // …one-ways never wall
    expect(isOneWay("=")).toBe(true);
    expect(isSlope("/")).toBe(true);
    expect(isSlope("\\")).toBe(true);
    expect(["1", "2", "3", "4"].every(isSlope)).toBe(true);
    expect(isHazard("^")).toBe(true);
    expect(isHazard("w")).toBe(true);
    expect(isUTurn("U")).toBe(true);
    expect(isSolid(".")).toBe(false);
  });

  it("treats the world edge as solid", () => {
    const grid = ["..", ".."];
    expect(glyphAt(grid, -1, 0)).toBe("#");
    expect(glyphAt(grid, 0, -1)).toBe("#");
    expect(glyphAt(grid, 2, 0)).toBe("#");
    expect(glyphAt(grid, 0, 2)).toBe("#");
  });
});

describe("slope surfaces (px Y at world x; smaller = higher)", () => {
  // tile at c=2, r=5: x∈[32,48), top=80, bottom=96
  it("45° rise `/` runs bottom-left → top-right", () => {
    expect(slopeSurfaceYPx("/", 2, 5, 32)).toBe(96);
    expect(slopeSurfaceYPx("/", 2, 5, 40)).toBe(88);
    expect(slopeSurfaceYPx("/", 2, 5, 48)).toBe(80);
  });
  it("45° fall `\\` runs top-left → bottom-right", () => {
    expect(slopeSurfaceYPx("\\", 2, 5, 32)).toBe(80);
    expect(slopeSurfaceYPx("\\", 2, 5, 40)).toBe(88);
    expect(slopeSurfaceYPx("\\", 2, 5, 48)).toBe(96);
  });
  it("30° rise pair `1`,`2` covers a half-tile each", () => {
    expect(slopeSurfaceYPx("1", 2, 5, 32)).toBe(96);
    expect(slopeSurfaceYPx("1", 2, 5, 48)).toBe(88);
    expect(slopeSurfaceYPx("2", 2, 5, 32)).toBe(88);
    expect(slopeSurfaceYPx("2", 2, 5, 48)).toBe(80);
  });
  it("30° fall pair `3`,`4` mirrors the rise pair", () => {
    expect(slopeSurfaceYPx("3", 2, 5, 32)).toBe(80);
    expect(slopeSurfaceYPx("3", 2, 5, 48)).toBe(88);
    expect(slopeSurfaceYPx("4", 2, 5, 32)).toBe(88);
    expect(slopeSurfaceYPx("4", 2, 5, 48)).toBe(96);
  });
});

describe("falling & landing", () => {
  const floor = ["....", "....", "....", "####"]; // floor top y=48

  it("lands EXACTLY on a solid top, kills vy, reports the glyph", () => {
    const st = run(floor, { x: 32, y: 30, vx: 0, vy: 4, grounded: false }, 6);
    expect(st.ySubs).toBe(px(48));
    expect(st.grounded).toBe(true);
    expect(st.vySubs).toBe(0);
    expect(st.surfaceGlyph).toBe("#");
  });

  it("lands on a one-way only when crossing from above", () => {
    const oneWay = ["....", "....", ".==.", "....", "####"]; // '=' top=32, floor top=64
    const fromAbove = run(oneWay, { x: 24, y: 20, vx: 0, vy: 4, grounded: false }, 5);
    expect(fromAbove.ySubs).toBe(px(32));
    expect(fromAbove.surfaceGlyph).toBe("=");
    const fromBelow = run(oneWay, { x: 24, y: 40, vx: 0, vy: 4, grounded: false }, 8);
    expect(fromBelow.ySubs).toBe(px(64)); // fell straight past the platform
    expect(fromBelow.surfaceGlyph).toBe("#");
  });

  it("clamps under a solid ceiling while rising and reports hitCeiling", () => {
    const capped = ["####", "....", "....", "....", "####"];
    let st = run(capped, { x: 32, y: 60, vx: 0, vy: -5, grounded: false }, 1);
    let sawCeiling = st.hitCeiling;
    for (let t = 0; t < 5 && !sawCeiling; t++) {
      st = moveBody(capped, st.xSubs, st.ySubs, 0, px(-5), false);
      sawCeiling = st.hitCeiling;
    }
    expect(sawCeiling).toBe(true);
    expect(st.vySubs).toBe(0);
    // head flush under the ceiling: feet = ceilingBottom + BODY_H = 16 + 30
    expect(st.ySubs).toBe(px(46));
  });
});

describe("walls & walking", () => {
  it("stops flush against a wall and zeroes vx", () => {
    const walled = ["....#", "....#", "....#", "#####"];
    let st = run(walled, { x: 40, y: 48, vx: 3, vy: 0, grounded: true }, 1);
    let sawWall: -1 | 0 | 1 = st.hitWall;
    for (let t = 0; t < 10; t++) {
      st = moveBody(walled, st.xSubs, st.ySubs, st.hitWall !== 0 ? 0 : px(3), 0, st.grounded);
      if (st.hitWall !== 0) sawWall = st.hitWall;
    }
    expect(sawWall).toBe(1);
    expect(st.xSubs).toBe(px(58)); // right edge (x+6) flush at the wall face x=64
    expect(st.grounded).toBe(true);
  });

  it("walks horizontally THROUGH a one-way at body height (never a wall)", () => {
    const through = ["....", "....", ".==.", "....", "####"];
    let st = run(through, { x: 8, y: 64, vx: 3, vy: 0, grounded: true }, 1);
    for (let t = 0; t < 12; t++) {
      st = moveBody(through, st.xSubs, st.ySubs, px(3), 0, st.grounded);
      expect(st.hitWall).toBe(0);
    }
    expect(st.xSubs).toBeGreaterThan(px(40));
  });

  it("walks off a ledge into the air (coyote is the player brain's job)", () => {
    const ledge = ["......", "......", "##...."]; // floor c0-1 only, top=32
    let st = run(ledge, { x: 8, y: 32, vx: 3, vy: 0, grounded: true }, 1);
    for (let t = 0; t < 12 && st.grounded; t++) {
      st = moveBody(ledge, st.xSubs, st.ySubs, px(3), 0, st.grounded);
    }
    expect(st.grounded).toBe(false);
  });

  it("accumulates a half-pixel walk with zero drift", () => {
    const flat = ["....", "....", "####"];
    let st = run(flat, { x: 8, y: 32, vx: 0, vy: 0, grounded: true }, 1);
    const startX = st.xSubs;
    for (let t = 0; t < 64; t++) {
      st = moveBody(flat, st.xSubs, st.ySubs, 128, 0, st.grounded); // 0.5 px/t
    }
    expect(st.xSubs - startX).toBe(64 * 128); // exactly 32px
    expect(st.grounded).toBe(true);
  });
});

describe("slope walking (grounded surface-follow)", () => {
  // floor r6 (top=96) for c0-1 → `/` at c2 r5 → solid shelf c3-5 r5 (top=80)
  const ramp = [
    "......",
    "......",
    "......",
    "......",
    "......",
    "../###",
    "##....",
  ];

  it("climbs a 45° rise smoothly onto the upper shelf", () => {
    let st = run(ramp, { x: 8, y: 96, vx: 3, vy: 0, grounded: true }, 1);
    let prevFeet = st.ySubs;
    for (let t = 0; t < 18; t++) {
      st = moveBody(ramp, st.xSubs, st.ySubs, px(3), 0, st.grounded);
      expect(st.grounded).toBe(true); // never pops off mid-ramp
      expect(st.ySubs).toBeLessThanOrEqual(prevFeet); // monotonically climbing
      prevFeet = st.ySubs;
    }
    expect(st.ySubs).toBe(px(80)); // standing on the shelf
    expect(st.surfaceGlyph).toBe("#");
  });

  it("tracks the slope surface mid-ramp", () => {
    let st = run(ramp, { x: 8, y: 96, vx: 3, vy: 0, grounded: true }, 1);
    for (let t = 0; t < 10; t++) st = moveBody(ramp, st.xSubs, st.ySubs, px(3), 0, st.grounded);
    const xPx = st.xSubs / SUBS;
    expect(xPx).toBeGreaterThan(32); // the probe must actually be ON the ramp
    expect(xPx).toBeLessThan(48);
    if (xPx > 32 && xPx < 48) {
      const expected = Math.round((96 - (xPx - 32)) * SUBS);
      expect(Math.abs(st.ySubs - expected)).toBeLessThanOrEqual(1);
      expect(st.surfaceGlyph).toBe("/");
    }
  });
});

describe("contact flags (state reported, never resolved here)", () => {
  it("reports spikes as a hazard flag — not a death, not a mutation", () => {
    const spiky = ["....", "....", ".^..", "####"];
    const st = run(spiky, { x: 24, y: 48, vx: 0, vy: 0, grounded: true }, 1);
    expect(st.hazard).toBe("^");
    expect(st.grounded).toBe(true); // still standing; the player brain decides
  });

  it("reports ink pools (`w`) as the other hazard", () => {
    const pool = ["....", "....", ".w..", "####"];
    const st = run(pool, { x: 24, y: 48, vx: 0, vy: 0, grounded: true }, 1);
    expect(st.hazard).toBe("w");
  });

  it("reports a vine when the body overlaps the column", () => {
    const viney = ["....", ".V..", ".V..", "####"];
    const st = run(viney, { x: 24, y: 48, vx: 0, vy: 0, grounded: true }, 1);
    expect(st.inVine).toBe(true);
  });

  it("reports a spring underfoot", () => {
    const sprung = ["....", "....", ".s..", "####"];
    const st = run(sprung, { x: 24, y: 48, vx: 0, vy: 0, grounded: true }, 1);
    expect(st.onSpring).toBe(true);
  });

  it("flags ice underfoot", () => {
    const icy = ["....", "....", "~~~~"];
    const st = run(icy, { x: 24, y: 32, vx: 0, vy: 0, grounded: true }, 1);
    expect(st.onIce).toBe(true);
    expect(st.surfaceGlyph).toBe("~");
  });
});

describe("the ledge-grab probe", () => {
  const wall = ["....", "..#.", "..#."];
  it("grabs a solid top edge with air above and a clear approach", () => {
    expect(ledgeGrabAt(wall, 2, 1, 1)).toBe(true);
  });
  it("refuses when there is no air above the ledge", () => {
    expect(ledgeGrabAt(wall, 2, 2, 1)).toBe(false);
  });
  it("refuses when the approach column is blocked", () => {
    const blocked = ["....", ".##.", ".##."];
    expect(ledgeGrabAt(blocked, 2, 1, 1)).toBe(false);
  });
  it("works symmetrically from the right", () => {
    const leftLedge = ["....", ".#..", ".#.."];
    expect(ledgeGrabAt(leftLedge, 1, 1, -1)).toBe(true);
  });
});

describe("groundSurfaceAt", () => {
  it("finds slope surfaces inside their tile and tops elsewhere", () => {
    const g = ["....", "../.", "####"];
    const onSlope = groundSurfaceAt(g, 40, 1, 2); // x=40 inside `/` at c2 r1
    expect(onSlope?.glyph).toBe("/");
    expect(onSlope?.yPx).toBe(24); // bottom(32) − xin(8)
    const onFloor = groundSurfaceAt(g, 8, 1, 2);
    expect(onFloor).toEqual({ yPx: 32, glyph: "#" });
  });
});

describe("W0 repros — the feel-gate collision defects (red before the fix)", () => {
  // his bug: fell THROUGH the floor at an edge and vanished
  it("F2a: a diagonal fall onto a floor edge lands ON the lip, never slides past it", () => {
    const edge = ["......", "......", "......", "#####.", "......", "......", "######"];
    // over the last floor column, falling fast while moving right across the edge
    let st = moveBody(edge, px(78), px(44), px(3), px(4), false);
    for (let t = 0; t < 3 && !st.grounded; t++) {
      st = moveBody(edge, st.xSubs, st.ySubs, px(3), px(4), st.grounded);
    }
    expect(st.grounded).toBe(true);
    expect(st.ySubs).toBe(px(48)); // ON the lip — not beside/below it
  });

  it("F2b: a body that ends up inside a solid is EJECTED to the surface", () => {
    const floor = ["....", "....", "....", "####"];
    // force the illegal state: feet 4px inside the floor
    const st = moveBody(floor, px(32), px(52), 0, 0, false);
    expect(st.ySubs).toBeLessThanOrEqual(px(48)); // pushed out, never inside
    expect(st.grounded).toBe(true);
  });
});

// ── PB-T1 · the trust round: body-box eject + body-width landings ────────────
// Red-first tamper block: every test here FAILED against the v1 mover
// (single-cell eject, center-column landing) before the fix landed.

/** True iff any SOLID cell overlaps the body box (the eject invariant). */
const overlapsSolid = (grid: readonly string[], st: MoveResult): boolean => {
  const xPx = st.xSubs / SUBS;
  const feetPx = st.ySubs / SUBS;
  const c0 = Math.floor((xPx - 6) / TILE);
  const c1 = Math.floor((xPx + 6 - 0.001) / TILE);
  const r0 = Math.floor((feetPx - 30 + 1) / TILE);
  const r1 = Math.floor((feetPx - 1) / TILE);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) if (isSolid(glyphAt(grid, c, r))) return true;
  }
  return false;
};

describe("PB-T1 · eject invariant v2 (body-box, not center-cell)", () => {
  // 8 columns × 8 rows of air over a floor, one solid pillar at c=4, r∈[2..6]
  const pillar = [
    "........",
    "........",
    "....#...",
    "....#...",
    "....#...",
    "....#...",
    "....#...",
    "########",
  ];

  it("ejects a corner overlap the v1 center-cell probe never saw", () => {
    // center column c=3 (air), right body edge inside the pillar at mid-height:
    // v1 checked only (center, feet-1) → clean → body RESTED inside the wall
    const x = 4 * TILE - 3; // right edge reaches 3px into the pillar column
    const st = moveBody(pillar, px(x), px(5 * TILE), 0, 0, false);
    expect(overlapsSolid(pillar, st)).toBe(false);
    expect(st.ejected).toBe(true);
    expect(st.xSubs).toBeLessThan(px(x)); // pushed out the near (left) side
  });

  it("pushes toward the smaller penetration", () => {
    const xRight = 5 * TILE + 3; // left edge 3px into the pillar from the right
    const st = moveBody(pillar, px(xRight), px(5 * TILE), 0, 0, false);
    expect(overlapsSolid(pillar, st)).toBe(false);
    expect(st.xSubs).toBeGreaterThan(px(xRight)); // pushed out the right side
  });

  it("keeps the support snap for a shallow feet overlap (v1 behavior)", () => {
    const floor = ["........", "........", "........", "........", "........", "........", "........", "########"];
    const st = moveBody(floor, px(32), px(7 * TILE + 5), 0, 0, false); // feet 5px into the floor
    expect(st.ySubs).toBe(px(7 * TILE));
    expect(st.grounded).toBe(true);
  });

  it("never ends a tick overlapping a solid under a deterministic sweep", () => {
    // seeded LCG sweep over positions/velocities — the post-condition IS the law
    let seed = 42;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    for (let i = 0; i < 400; i++) {
      const x = 8 + rnd() * (8 * TILE - 16);
      const y = 16 + rnd() * (6 * TILE);
      const vx = (rnd() - 0.5) * 6;
      const vy = (rnd() - 0.5) * 8;
      const st = moveBody(pillar, px(x), px(y), px(vx), px(vy), rnd() > 0.5);
      expect(overlapsSolid(pillar, st)).toBe(false);
    }
  });
});

describe("PB-T1 · body-width landings (edges land, not just the center)", () => {
  // platform ####.... : the right edge of the platform is at x=64
  const shelf = [
    "........",
    "........",
    "........",
    "........",
    "####....",
    "........",
    "........",
    "########",
  ];

  it("lands when the center is past the lip but a body edge is still over it", () => {
    // center x=67 (air column c=4), left edge x=61 over the shelf → must land
    const st = run(shelf, { x: 67, y: 3 * TILE + 2, vx: 0, vy: 3, grounded: false }, 6);
    expect(st.grounded).toBe(true);
    expect(st.ySubs).toBe(px(4 * TILE));
  });

  it("still falls clean when NO part of the body is over the shelf", () => {
    const st = run(shelf, { x: 4 * TILE + 8, y: 3 * TILE + 2, vx: 0, vy: 3, grounded: false }, 8);
    expect(st.ySubs).toBeGreaterThan(px(4 * TILE)); // fell past the shelf row
  });

  // ramp carved into mass, base meeting the approach floor: floor top = 80px
  // (r5), the `/` at (c4, r4) rises 80→64, solid continues at r4 from c5
  const ramp = [
    "........",
    "........",
    "........",
    "........",
    "..../###",
    "########",
    "########",
    "########",
  ];

  it("a jump-landing onto a backed ramp sticks (regression: center on ramp)", () => {
    const st = run(ramp, { x: 4 * TILE + 8, y: 2 * TILE, vx: 0, vy: 3, grounded: false }, 16);
    expect(st.grounded).toBe(true);
    expect(st.surfaceGlyph).toBe("/");
  });

  it("a jump-landing with only the body EDGE over the ramp sticks (was red)", () => {
    // center in the air column left of the ramp; right edge over the `/` base
    const st = run(ramp, { x: 4 * TILE - 4, y: 2 * TILE, vx: 0, vy: 3, grounded: false }, 16);
    expect(st.grounded).toBe(true);
  });

  it("walking up a ramp into its solid continuation stays smooth (regression)", () => {
    const st = run(ramp, { x: 3 * TILE, y: 5 * TILE, vx: 1.5, vy: 0, grounded: true }, 30);
    expect(st.grounded).toBe(true);
    expect(overlapsSolid(ramp, st)).toBe(false);
    expect(st.ySubs).toBeLessThanOrEqual(px(4 * TILE)); // climbed onto the top run
  });
});
