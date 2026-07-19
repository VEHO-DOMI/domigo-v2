import { describe, expect, it } from "vitest";
import {
  BODY_H,
  BODY_W,
  fistDamage,
  fistLaunchSpeed,
  fistSpeedTier,
  fistTravelPx,
  fromSubs,
  groundDecay,
  LOGICAL_H,
  LOGICAL_W,
  MAX_TICKS_PER_FRAME,
  PAINT,
  RENDER_SCALE,
  SUBS,
  TILE,
  tileOfPx,
  tileOfSubs,
  toSubs,
} from "./paint.ts";

describe("the D-value lock (dossier constants — drift here must be deliberate)", () => {
  it("locks the studied 1995 constants verbatim", () => {
    expect(TILE).toBe(16);
    expect(SUBS).toBe(256);
    expect(PAINT.jumpVy).toBe(-5 * 256);
    expect(PAINT.hangJumpVy).toBe(-3 * 256);
    expect(PAINT.jumpHoldTicks).toBe(12);
    expect(PAINT.lateNudgeTick).toBe(23);
    expect(PAINT.gravity).toBe(256);
    expect(PAINT.fallCap).toBe(4 * 256);
    expect(PAINT.riseCap).toBe(-10 * 256);
    expect(PAINT.hoverTicks).toBe(50);
    expect(PAINT.hoverFallCap).toBe(256);
    expect(PAINT.chargeMax).toBe(63);
    expect(PAINT.airCharge).toBe(32);
    expect(PAINT.fistSpeeds).toEqual([5 * 256, 8 * 256, 11 * 256]);
    expect(PAINT.fistRunBoostCap).toBe(16 * 256);
    expect(PAINT.swingRopePx).toBe(96);
    expect(PAINT.swingCircle).toBe(512);
    expect(PAINT.swingDwellTicks).toBe(5);
    expect(PAINT.knockVx).toBe(2 * 256);
    expect(PAINT.knockVy).toBe(-3 * 256);
    expect(PAINT.knockFastVx).toBe(5 * 256);
    expect(PAINT.knockFastVy).toBe(-6 * 256);
    expect(PAINT.iframeTicks).toBe(120);
    expect(PAINT.bouncerVy).toBe(-5 * 256);
    expect(PAINT.bouncerRiddenVy).toBe(-3 * 256);
    expect(PAINT.frictionNormal).toBe(6);
    expect(PAINT.frictionSlippery).toBe(3);
    expect(PAINT.camEaseDiv).toBe(4);
    expect(PAINT.activationMarginPx).toBe(60);
  });

  it("locks the viewport contract (doc 31 §2)", () => {
    expect(LOGICAL_W).toBe(352);
    expect(LOGICAL_H).toBe(224);
    expect(RENDER_SCALE).toBe(3);
    expect(MAX_TICKS_PER_FRAME).toBe(4);
    expect(BODY_W).toBeLessThan(TILE); // hitbox narrower than a tile
    expect(BODY_H).toBeLessThan(3 * TILE);
  });

  it("keeps the slippery world slower to decay than the normal one (the studied inversion)", () => {
    // friction 3 (slippery) must decay LESS per tick than friction 6 (normal)
    const fromWalk = PAINT.walkMax;
    const normal = fromWalk - groundDecay(fromWalk, false);
    const slippery = fromWalk - groundDecay(fromWalk, true);
    expect(slippery).toBeLessThan(normal);
    expect(normal).toBe(PAINT.frictionNormal * PAINT.frictionBase);
    expect(slippery).toBe(PAINT.frictionSlippery * PAINT.frictionBase);
  });
});

describe("unit helpers", () => {
  it("round-trips px↔subs and floors consistently for negatives", () => {
    expect(toSubs(1.5)).toBe(384);
    expect(fromSubs(384)).toBe(1);
    expect(fromSubs(255)).toBe(0);
    expect(fromSubs(-1)).toBe(-1); // floor, not trunc — grid math stays monotonic
    expect(tileOfPx(15.9)).toBe(0);
    expect(tileOfPx(16)).toBe(1);
    expect(tileOfSubs(16 * 256)).toBe(1);
    expect(tileOfSubs(16 * 256 - 1)).toBe(0);
  });

  it("accumulates half-pixel walking with zero drift", () => {
    let x = 0;
    for (let t = 0; t < 60; t++) x += 128; // 0.5 px/tick
    expect(x).toBe(30 * 256); // exactly 30px after a second
  });
});

describe("the fist math", () => {
  it("hits the damage tier boundaries exactly ((charge>>4)+1)", () => {
    expect(fistDamage(0)).toBe(1);
    expect(fistDamage(15)).toBe(1);
    expect(fistDamage(16)).toBe(2);
    expect(fistDamage(31)).toBe(2);
    expect(fistDamage(32)).toBe(3);
    expect(fistDamage(47)).toBe(3);
    expect(fistDamage(48)).toBe(4);
    expect(fistDamage(63)).toBe(4);
    expect(fistDamage(99)).toBe(4); // clamped at chargeMax
  });

  it("selects speed tiers at the T boundaries with D speeds", () => {
    expect(fistSpeedTier(PAINT.fistTier1Max)).toBe(0);
    expect(fistSpeedTier(PAINT.fistTier1Max + 1)).toBe(1);
    expect(fistSpeedTier(PAINT.fistTier2Max)).toBe(1);
    expect(fistSpeedTier(PAINT.fistTier2Max + 1)).toBe(2);
  });

  it("adds the run boost above 5 px/t and caps the total at 16 px/t", () => {
    expect(fistLaunchSpeed(63, 0)).toBe(11 * 256);
    expect(fistLaunchSpeed(63, 5 * 256)).toBe(11 * 256); // boost starts past 5
    expect(fistLaunchSpeed(63, 8 * 256)).toBe(11 * 256 + 3 * 256); // 14 px/t
    expect(fistLaunchSpeed(63, 20 * 256)).toBe(16 * 256); // hard cap
  });

  it("scales travel with charge", () => {
    expect(fistTravelPx(0)).toBe(4 * TILE);
    expect(fistTravelPx(63)).toBe(Math.round((4 + 63 / 8) * TILE));
    expect(fistTravelPx(63)).toBeGreaterThan(fistTravelPx(PAINT.airCharge));
  });
});

describe("ground decay", () => {
  it("decays toward zero and clamps at zero (both directions)", () => {
    expect(groundDecay(320, false)).toBe(272);
    expect(groundDecay(-320, false)).toBe(-272);
    expect(groundDecay(30, false)).toBe(0); // never overshoots past rest
    expect(groundDecay(-30, false)).toBe(0);
    expect(groundDecay(0, false)).toBe(0);
    expect(groundDecay(320, true)).toBe(296); // slippery: half the step
  });
});

describe("encounter timers", () => {
  it("keeps the platform quickfire law E6/M5/S4", () => {
    expect(PAINT.quickfireSeconds.E).toBe(6);
    expect(PAINT.quickfireSeconds.M).toBe(5);
    expect(PAINT.quickfireSeconds.S).toBe(4);
  });
});
