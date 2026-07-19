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
