import { describe, expect, it } from "vitest";
import { FOCUS_ZOOM, cameraTargetX, cameraTargetY, clampScroll, focusView, stepCameraAxis, stepCameraY } from "./camera.ts";
import { LOGICAL_H, LOGICAL_W, PAINT, SUBS, TILE } from "./paint.ts";

describe("the look-ahead camera", () => {
  it("seats the player a third off-center, ahead of the facing", () => {
    const x = 500 * SUBS;
    const right = cameraTargetX(x, 1);
    const left = cameraTargetX(x, -1);
    // facing right: more world visible to the right → smaller scroll offset
    expect(x - right).toBe((LOGICAL_W / 2 - PAINT.camAheadTiles * TILE) * SUBS);
    expect(x - left).toBe((LOGICAL_W / 2 + PAINT.camAheadTiles * TILE) * SUBS);
  });

  it("eases /4 toward the target, honors the min speed, never overshoots", () => {
    // big gap: /4 easing
    expect(stepCameraAxis(0, 400 * SUBS)).toBe(100 * SUBS);
    // small gap: min-speed floor
    expect(stepCameraAxis(0, 8 * SUBS)).toBe(PAINT.camMinSpeed);
    // tiny gap: lands exactly, no overshoot
    expect(stepCameraAxis(0, 2 * SUBS)).toBe(2 * SUBS);
    expect(stepCameraAxis(5 * SUBS, 5 * SUBS)).toBe(5 * SUBS);
    // converges fully
    let s = 0;
    const target = 1000 * SUBS;
    for (let t = 0; t < 200; t++) s = stepCameraAxis(s, target);
    expect(s).toBe(target);
  });

  it("holds the vertical inside the comfort band, follows outside it", () => {
    const feet = 300 * SUBS;
    const rest = cameraTargetY(feet);
    // inside the ±1-tile band: no movement
    expect(stepCameraY(rest + (TILE - 1) * SUBS, feet)).toBe(rest + (TILE - 1) * SUBS);
    // outside: eases toward the rest line
    const far = rest + 5 * TILE * SUBS;
    expect(stepCameraY(far, feet)).toBeLessThan(far);
  });

  it("keeps the rest line at ~57% of the view height (D)", () => {
    const feet = 1000 * SUBS;
    const scroll = cameraTargetY(feet);
    const screenY = (feet - scroll) / SUBS;
    expect(screenY).toBe(Math.floor((LOGICAL_H * PAINT.camVertBandPct) / 100));
  });

  it("clamps to the world", () => {
    expect(clampScroll(-50 * SUBS, 2000, LOGICAL_W)).toBe(0);
    expect(clampScroll(5000 * SUBS, 2000, LOGICAL_W)).toBe((2000 - LOGICAL_W) * SUBS);
  });
});

// ── PK-R3a · R3-8 — the battle framing (doc 42 §1) ──────────────────────────
describe("focusView (the lean-in on the asker)", () => {
  const W = 2000; // a wide world, so the clamp is not what we are measuring
  const H = 1000;

  it("t = 0 reproduces the plain follow shot exactly", () => {
    const v = focusView(400, 200, 1500, 900, 0, W, H);
    expect(v.zoom).toBe(1);
    expect(v.cx).toBe(400 + LOGICAL_W / 2);
    expect(v.cy).toBe(200 + LOGICAL_H / 2);
  });

  it("t = 1 pushes in to 1.18× and leans 60 % of the way to the asker", () => {
    const scrollX = 400;
    const askerX = scrollX + LOGICAL_W / 2 + 100; // 100 px right of centre
    const v = focusView(scrollX, 200, askerX, 200 + LOGICAL_H / 2, 1, W, H);
    expect(v.zoom).toBeCloseTo(FOCUS_ZOOM, 6);
    expect(v.cx).toBeCloseTo(scrollX + LOGICAL_W / 2 + 60, 6);
  });

  it("is monotonic: the lean only ever grows with t", () => {
    const at = (t: number) => focusView(400, 200, 900, 200, t, W, H);
    const a = at(0), b = at(0.5), c = at(1);
    expect(b.zoom).toBeGreaterThan(a.zoom);
    expect(c.zoom).toBeGreaterThan(b.zoom);
    expect(b.cx).toBeGreaterThan(a.cx);
    expect(c.cx).toBeGreaterThan(b.cx);
  });

  it("never shows outside the world, however hard it leans", () => {
    const seenW = LOGICAL_W / FOCUS_ZOOM;
    const v = focusView(0, 0, -500, -500, 1, W, H); // an asker off the left edge
    expect(v.cx).toBeGreaterThanOrEqual(seenW / 2);
    const far = focusView(W - LOGICAL_W, 0, W + 500, 0, 1, W, H);
    expect(far.cx).toBeLessThanOrEqual(W - seenW / 2);
  });

  it("centres a world smaller than the view instead of clamping it off-centre", () => {
    const v = focusView(0, 0, 10, 10, 1, 100, 80, 320, 240);
    expect(v.cx).toBe(50);
    expect(v.cy).toBe(40);
  });

  it("clamps a t outside 0…1 rather than overshooting", () => {
    expect(focusView(0, 0, 900, 0, 5, W, H).zoom).toBeCloseTo(FOCUS_ZOOM, 6);
    expect(focusView(0, 0, 900, 0, -3, W, H).zoom).toBe(1);
  });
});
