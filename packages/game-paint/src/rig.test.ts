import { describe, expect, it } from "vitest";
import { bobFrame, sheetFrame } from "./anim.ts";
import { PAINT, SUBS } from "./paint.ts";
import { RIG, type RigInput, rigPose, withFistAway } from "./rig.ts";
import type { PlayerPose } from "./player.ts";

const input = (over: Partial<RigInput>): RigInput => ({
  pose: "stand",
  walkTime: 0,
  tick: 0,
  vxSubs: 0,
  vySubs: 0,
  charge: -1,
  landedAgo: 99,
  ...over,
});

describe("the rig (animation principles as tick math)", () => {
  it("is deterministic: same inputs, same pose", () => {
    const a = rigPose(input({ pose: "run", walkTime: 7, tick: 31, vxSubs: PAINT.runMax }));
    const b = rigPose(input({ pose: "run", walkTime: 7, tick: 31, vxSubs: PAINT.runMax }));
    expect(a).toEqual(b);
  });

  it("alternates the feet on opposite phases of the run cycle (arcs, not slides)", () => {
    const quarter = rigPose(input({ pose: "run", walkTime: RIG.runCycleTicks / 4, vxSubs: PAINT.runMax }));
    // front foot lifted at its phase peak; back foot planted
    expect(quarter.footF.dy).toBeLessThan(12);
    expect(quarter.footB.dy).toBe(12);
    const threeQ = rigPose(input({ pose: "run", walkTime: (RIG.runCycleTicks * 3) / 4, vxSubs: PAINT.runMax }));
    expect(threeQ.footB.dy).toBeLessThan(12);
    expect(threeQ.footF.dy).toBe(12);
  });

  it("squashes on landing and recovers elastically", () => {
    const impactTick = rigPose(input({ pose: "stand", landedAgo: 0 }));
    expect(impactTick.scaleY).toBeLessThan(0.9);
    expect(impactTick.scaleX).toBeGreaterThan(1.05);
    const recovered = rigPose(input({ pose: "stand", landedAgo: RIG.landRecoverTicks }));
    expect(Math.abs(recovered.scaleY - 1)).toBeLessThan(0.02);
  });

  it("stretches on the fast rise of a jump", () => {
    const rising = rigPose(input({ pose: "jump", vySubs: PAINT.jumpVy }));
    expect(rising.scaleY).toBeGreaterThan(1);
    expect(rising.scaleX).toBeLessThan(1);
  });

  it("spins the rotor only while hovering, cycling its 3 frames", () => {
    for (const t of [0, 1, 2, 3]) {
      const p = rigPose(input({ pose: "hover", tick: t }));
      expect(p.rotor.hidden).toBe(false);
      expect(p.rotor.frame).toBe(t % 3);
    }
    expect(rigPose(input({ pose: "run" })).rotor.hidden).toBe(true);
    expect(rigPose(input({ pose: "fall" })).rotor.hidden).toBe(true);
  });

  it("orbits the fist hand faster as the charge grows (anticipation)", () => {
    const slow = rigPose(input({ pose: "charge", charge: 0, tick: 3 }));
    const fast = rigPose(input({ pose: "charge", charge: PAINT.chargeMax, tick: 3 }));
    // both orbit off the rest position; the fast orbit has moved further round
    expect(slow.handF.dx).not.toBe(5); // 5 = the rest dx
    expect(fast.handF).not.toEqual(slow.handF);
  });

  it("hides the flying hand during a throw", () => {
    const p = withFistAway(rigPose(input({ pose: "fall" })));
    expect(p.handF.hidden).toBe(true);
    expect(p.handB.hidden).toBeUndefined();
  });

  it("lags the hair behind the body (secondary motion)", () => {
    const a = rigPose(input({ pose: "run", walkTime: 4, vxSubs: PAINT.runMax }));
    const b = rigPose(input({ pose: "run", walkTime: 4 + RIG.hairLagTicks, vxSubs: PAINT.runMax }));
    // the hair at t reflects the body's phase from hairLagTicks earlier
    expect(b.hair.rot).not.toBe(a.hair.rot);
  });

  it("collapses every oscillation under reduced motion", () => {
    const p = rigPose(input({ pose: "run", walkTime: 5, tick: 33, vxSubs: PAINT.runMax, reducedMotion: true }));
    expect(p.body.dy).toBe(0);
    expect(p.hair.rot).toBe(0);
    const idle = rigPose(input({ pose: "stand", tick: 17, reducedMotion: true }));
    expect(idle.body.dy).toBe(0);
    const land = rigPose(input({ pose: "stand", landedAgo: 0, reducedMotion: true }));
    expect(land.scaleY).toBe(1); // no squash either
  });

  it("never produces NaN across the full pose × time sweep", () => {
    const poses: PlayerPose[] = ["stand", "walk", "run", "jump", "fall", "hover", "charge", "hang", "vine", "swing", "hit"];
    for (const pose of poses) {
      for (let t = 0; t < 40; t += 7) {
        const p = rigPose(input({ pose, tick: t, walkTime: t, vxSubs: PAINT.walkMax, vySubs: -2 * SUBS, charge: 20, landedAgo: t % 9 }));
        for (const part of [p.body, p.head, p.handF, p.handB, p.footF, p.footB, p.hair, p.rotor]) {
          expect(Number.isFinite(part.dx)).toBe(true);
          expect(Number.isFinite(part.dy)).toBe(true);
          expect(Number.isFinite(part.rot)).toBe(true);
        }
        expect(Number.isFinite(p.scaleX)).toBe(true);
        expect(Number.isFinite(p.scaleY)).toBe(true);
      }
    }
  });
});

describe("sheet frames (deterministic walk-time animation)", () => {
  it("cycles frames on ticks, never wall-clock", () => {
    expect(sheetFrame(0, 4, 8)).toBe(0);
    expect(sheetFrame(8, 4, 8)).toBe(1);
    expect(sheetFrame(31, 4, 8)).toBe(3);
    expect(sheetFrame(32, 4, 8)).toBe(0);
    expect(sheetFrame(100, 1, 8)).toBe(0);
    expect(bobFrame(0)).toBe(0);
    expect(bobFrame(24)).toBe(1);
    expect(bobFrame(48)).toBe(0);
  });
});
