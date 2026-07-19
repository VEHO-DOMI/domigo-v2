import { describe, expect, it } from "vitest";
import { FIST_BOX_PX, fistRect, stepFist, throwFist } from "./fist.ts";
import { fistLaunchSpeed, fistTravelPx, PAINT, SUBS } from "./paint.ts";

const PLAYER_X = 100 * SUBS;
const PLAYER_FEET = 176 * SUBS;

describe("the thrown fist", () => {
  it("flies out its charge-scaled travel, U-turns, accelerates home, is caught", () => {
    let f = throwFist(PLAYER_X, PLAYER_FEET, 1, PAINT.chargeMax, fistLaunchSpeed(PAINT.chargeMax, 0));
    const launchX = f.x;
    let outTicks = 0;
    let maxX = f.x;
    let caught = false;
    for (let t = 0; t < 120 && !caught; t++) {
      const out = stepFist(f, PLAYER_X, PLAYER_FEET);
      f = out.fist;
      caught = out.caught;
      maxX = Math.max(maxX, f.x);
      if (!f.returning) outTicks++;
    }
    expect(caught).toBe(true);
    expect(f.active).toBe(false);
    // outbound distance ≈ the travel contract (within one tick of speed)
    const travelled = (maxX - launchX) / SUBS;
    expect(travelled).toBeGreaterThanOrEqual(fistTravelPx(PAINT.chargeMax) - 11);
    expect(travelled).toBeLessThanOrEqual(fistTravelPx(PAINT.chargeMax) + 11);
    expect(outTicks).toBeGreaterThan(10); // it really flew, then came back
  });

  it("returns immediately when the scene reports a hit (the bounce)", () => {
    let f = throwFist(PLAYER_X, PLAYER_FEET, 1, PAINT.airCharge, fistLaunchSpeed(PAINT.airCharge, 0));
    const r1 = stepFist(f, PLAYER_X, PLAYER_FEET, true);
    expect(r1.fist.returning).toBe(true);
  });

  it("accelerates on the way home up to the cap", () => {
    let f = throwFist(PLAYER_X, PLAYER_FEET, 1, 0, fistLaunchSpeed(0, 0));
    // force the turn, then watch speed grow
    let out = stepFist(f, PLAYER_X, PLAYER_FEET, true);
    const v0 = out.fist.vSubs;
    out = stepFist(out.fist, PLAYER_X, PLAYER_FEET);
    expect(out.fist.vSubs).toBe(Math.min(v0 + PAINT.fistReturnAccel, PAINT.fistRunBoostCap));
  });

  it("throws leftward symmetrically", () => {
    let f = throwFist(PLAYER_X, PLAYER_FEET, -1, PAINT.airCharge, fistLaunchSpeed(PAINT.airCharge, 0));
    const x0 = f.x;
    f = stepFist(f, PLAYER_X, PLAYER_FEET).fist;
    expect(f.x).toBeLessThan(x0);
  });

  it("exposes a scene-collision rect around its center", () => {
    const f = throwFist(PLAYER_X, PLAYER_FEET, 1, 0, fistLaunchSpeed(0, 0));
    const r = fistRect(f);
    expect(r.wPx).toBe(FIST_BOX_PX);
    expect(r.xPx + r.wPx / 2).toBeCloseTo(f.x / SUBS, 5);
  });
});
