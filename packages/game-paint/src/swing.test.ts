import { describe, expect, it } from "vitest";
import { PAINT, SUBS } from "./paint.ts";
import { attachSwing, releaseSwing, stepSwing, swingPos, swingStep, type SwingState } from "./swing.ts";

const ANCHOR_X = 200 * SUBS;
const ANCHOR_Y = 50 * SUBS;

describe("the pendulum", () => {
  it("is fastest at the arc bottom and slowest at the extremes (D shape)", () => {
    expect(swingStep(256)).toBe(5); // bottom
    expect(swingStep(128)).toBe(1); // extreme
    expect(swingStep(384)).toBe(1);
    expect(swingStep(340)).toBeLessThan(swingStep(256)); // across speed bands
  });

  it("hangs straight down at the bottom of the arc", () => {
    const s: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0 };
    const pos = swingPos(s);
    expect(pos.xSubs).toBe(ANCHOR_X);
    expect(pos.ySubs).toBe(ANCHOR_Y + (PAINT.swingRopePx + 22) * SUBS);
  });

  it("oscillates forever inside [128, 384] with dwells at the extremes", () => {
    let s = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X - 40 * SUBS);
    expect(s.angle).toBeLessThan(256); // grabbed from the left
    expect(s.dir).toBe(1);
    let hitMax = false;
    let hitMin = false;
    let dwellRun = 0;
    let maxDwellRun = 0;
    let prevAngle = s.angle;
    for (let t = 0; t < 400; t++) {
      s = stepSwing(s).swing;
      expect(s.angle).toBeGreaterThanOrEqual(128);
      expect(s.angle).toBeLessThanOrEqual(384);
      if (s.angle === 384) hitMax = true;
      if (s.angle === 128) hitMin = true;
      if (s.angle === prevAngle) dwellRun++;
      else dwellRun = 0;
      maxDwellRun = Math.max(maxDwellRun, dwellRun);
      prevAngle = s.angle;
    }
    expect(hitMax).toBe(true);
    expect(hitMin).toBe(true);
    expect(maxDwellRun).toBe(PAINT.swingDwellTicks); // the studied 5-tick hold
  });

  it("is fully deterministic", () => {
    let a = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 30 * SUBS);
    let b = attachSwing(ANCHOR_X, ANCHOR_Y, ANCHOR_X + 30 * SUBS);
    for (let t = 0; t < 100; t++) {
      const ra = stepSwing(a);
      const rb = stepSwing(b);
      a = ra.swing;
      b = rb.swing;
      expect(ra.xSubs).toBe(rb.xSubs);
      expect(ra.ySubs).toBe(rb.ySubs);
    }
  });

  it("releases the tangential speed as a jump (+ the studied −2 lift)", () => {
    const bottom: SwingState = { anchorX: ANCHOR_X, anchorY: ANCHOR_Y, angle: 256, dir: 1, dwell: 0 };
    const rel = releaseSwing(bottom);
    expect(rel.vxSubs).toBe(5 * SUBS); // max speed at the bottom, rightward
    expect(rel.vySubs).toBe(-2 * SUBS);
    const extreme: SwingState = { ...bottom, angle: 384, dir: -1 };
    expect(Math.abs(releaseSwing(extreme).vxSubs)).toBe(1 * SUBS); // slowest at the top
  });
});
