import { describe, expect, it } from "vitest";
import { cameraTargetX, cameraTargetY, clampScroll, stepCameraAxis, stepCameraY } from "./camera.ts";
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
