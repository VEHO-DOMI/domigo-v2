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

  // ── PK-R6 · H1 · the round-1 critique's finding 2, as a law ────────────────
  // „the boy keeps the identical arms-clutched-to-chest silhouette in idle,
  // running, jump apex, landing and the magnet pull — only the legs shift a
  // little, so no single pose tells you what state he's in."
  // The study dossier's own law (level-anatomy.md Part C) is that every pose
  // must read at silhouette level through HAND POSITION alone. So: the four
  // limbs' places ARE the signature, and any two states a child can be in must
  // differ in it by more than a mitt's width.
  const silhouette = (p: ReturnType<typeof rigPose>): number[] =>
    [p.handF.dx, p.handF.dy, p.handB.dx, p.handB.dy, p.footF.dx, p.footF.dy, p.footB.dx, p.footB.dy];
  const apart = (a: number[], b: number[]): number =>
    a.reduce((sum, v, i) => sum + Math.abs(v - (b[i] ?? 0)), 0);

  it("gives every locomotion state its own silhouette (hands + feet)", () => {
    // `walk` is deliberately absent: walk and run are ONE gait at two speeds
    // (bodyStemFor hands them the same painted torso), and the child reads them
    // apart by how fast the world goes by, not by a different drawing.
    const states: Record<string, RigInput> = {
      stand: input({ pose: "stand", tick: 9 }),
      run: input({ pose: "run", walkTime: 4, vxSubs: PAINT.runMax }),
      jump: input({ pose: "jump", vySubs: PAINT.jumpVy }),
      fall: input({ pose: "fall", tick: 3, vySubs: 2 * SUBS }),
      land: input({ pose: "stand", landedAgo: 0 }),
    };
    const sigs = Object.fromEntries(Object.entries(states).map(([k, v]) => [k, silhouette(rigPose(v))]));
    const names = Object.keys(sigs);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = names[i]!;
        const b = names[j]!;
        const d = apart(sigs[a]!, sigs[b]!);
        const widest = Math.max(...sigs[a]!.map((v, k) => Math.abs(v - (sigs[b]![k] ?? 0))));
        // 14 px of limb travel = a torso-width of daylight between the two
        // drawings, and at least one limb has to carry 4 px of it on its own —
        // a difference smeared a pixel at a time over eight numbers is a
        // difference nobody sees. The retired tucked jump scored exactly 14 / 6
        // against idle, which is what „only the legs shift a little" measured as.
        expect(d, `${a} vs ${b} are the same silhouette (${d.toFixed(1)} px)`).toBeGreaterThan(14);
        expect(widest, `${a} vs ${b} differ only in smear`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it("flares the leap and drifts the fall — the two air states are not one picture", () => {
    const jump = rigPose(input({ pose: "jump", vySubs: PAINT.jumpVy }));
    // both hands above the shoulder line, out to the sides (dossier Part C)
    expect(jump.handF.dy).toBeLessThan(-12);
    expect(jump.handB.dy).toBeLessThan(-12);
    expect(jump.handF.dx - jump.handB.dx).toBeGreaterThan(14); // the flare is wide
    const fall = rigPose(input({ pose: "fall", tick: 0, vySubs: 2 * SUBS }));
    expect(fall.handB.dy).toBeGreaterThan(0); // the anchor fist stays low — asymmetric, never jazz hands
    expect(apart(silhouette(jump), silhouette(fall))).toBeGreaterThan(20);
  });

  it("absorbs a landing with a wide stance and balancing arms, then settles", () => {
    const impact = rigPose(input({ pose: "stand", landedAgo: 0 }));
    const settled = rigPose(input({ pose: "stand", landedAgo: RIG.landStanceTicks }));
    // feet apart and hands out at contact…
    expect(impact.footF.dx - impact.footB.dx).toBeGreaterThan(settled.footF.dx - settled.footB.dx + 6);
    expect(impact.handF.dx - impact.handB.dx).toBeGreaterThan(settled.handF.dx - settled.handB.dx + 6);
    expect(impact.handF.dy).toBeLessThan(settled.handF.dy);
    // …and gone again once the absorb is over
    expect(settled.footF.dx).toBeCloseTo(rigPose(input({ pose: "stand", landedAgo: 99 })).footF.dx, 5);
    // reduced motion keeps the end state, not the absorb
    expect(rigPose(input({ pose: "stand", landedAgo: 0, reducedMotion: true })).footF.dx).toBe(4);
  });

  it("reaches the lead hand out for a letter the magnet is pulling in", () => {
    const idle = rigPose(input({ pose: "stand", tick: 5 }));
    const pulling = rigPose(input({ pose: "stand", tick: 5, reach: 1 }));
    expect(pulling.handF.dx).toBeGreaterThan(idle.handF.dx + 5);
    expect(pulling.handF.dy).toBeLessThan(idle.handF.dy - 3);
    // half a pull is half a reach — the gesture tracks the sim, it is not a flag
    const half = rigPose(input({ pose: "stand", tick: 5, reach: 0.5 }));
    expect(half.handF.dx).toBeCloseTo((idle.handF.dx + pulling.handF.dx) / 2, 5);
    // a hand that is holding on never lets go for a collectible
    for (const pose of ["hang", "vine", "swing"] as PlayerPose[]) {
      expect(rigPose(input({ pose, reach: 1 })).handF).toEqual(rigPose(input({ pose })).handF);
    }
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
    // doc 40 §2: the idle CYCLE is 400 ms (24 t) whatever the cell count —
    // 2 cells dwell 12 t, 4 cells dwell 6 t, and both wrap on the same beat.
    expect(bobFrame(0)).toBe(0);
    expect(bobFrame(12)).toBe(1);
    expect(bobFrame(24)).toBe(0);
    expect(bobFrame(0, 4)).toBe(0);
    expect(bobFrame(6, 4)).toBe(1);
    expect(bobFrame(18, 4)).toBe(3);
    expect(bobFrame(24, 4)).toBe(0); // same 24-tick wrap as the 2-cell idle
  });
});
