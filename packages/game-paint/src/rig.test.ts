import { describe, expect, it } from "vitest";
import { bobFrame, sheetFrame } from "./anim.ts";
import { PAINT, SUBS } from "./paint.ts";
import { RIG, type RigInput, rigPose, withBrace, withCheer, withFistAway } from "./rig.ts";
import { LAND_SKIN_TICKS, bodyStemFor, faceFor, handStemsFor } from "./rigSpec.ts";
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
    // PK-R6 · H2 · …and the hands go DOWN, not up. H1 threw them up, which is
    // the LEAP's gesture (both hands above the shoulder line) — so the two ends
    // of one jump wore one pose and round 2 read the landing as „nearly
    // identical to idle". A landing is weight arriving: the brace is downward.
    expect(impact.handF.dy).toBeGreaterThan(settled.handF.dy);
    expect(impact.handB.dy).toBeGreaterThan(settled.handB.dy);
    // …and gone again once the absorb is over
    expect(settled.footF.dx).toBeCloseTo(rigPose(input({ pose: "stand", landedAgo: 99 })).footF.dx, 5);
    // reduced motion keeps the end state, not the absorb
    expect(rigPose(input({ pose: "stand", landedAgo: 0, reducedMotion: true })).footF.dx).toBe(4);
  });

  // ── PK-R6 · H2 · the round-2 findings, as laws ─────────────────────────────

  it("SINKS on a landing: the centre of mass drops, not just the transform", () => {
    // Round 2: „no compressed/widened stance". H1 squashed the SCALE and left
    // the skeleton standing, and a painted torso hides a 16 % scale on its own.
    const impact = rigPose(input({ pose: "stand", landedAgo: 0 }));
    const settled = rigPose(input({ pose: "stand", landedAgo: RIG.landStanceTicks }));
    expect(impact.body.dy).toBeGreaterThan(settled.body.dy + 2);
    expect(impact.head.dy).toBeGreaterThan(settled.head.dy + 2);
    // the head sinks FURTHER than the chest — the neck compresses too
    expect(impact.head.dy - settled.head.dy).toBeGreaterThan(impact.body.dy - settled.body.dy);
    // TAMPER: half way through the absorb it is half gone, so this is a curve
    // and not a flag that could be stuck on for a whole chapter
    const half = rigPose(input({ pose: "stand", landedAgo: Math.round(RIG.landStanceTicks / 2) }));
    expect(half.body.dy).toBeLessThan(impact.body.dy);
    expect(half.body.dy).toBeGreaterThan(settled.body.dy);
    // …and it holds long enough to be SEEN: 16 ticks ≈ a quarter second, which
    // is what „the screenshot caught nothing" measured as at 9
    expect(RIG.landStanceTicks).toBeGreaterThanOrEqual(14);
  });

  it("counter-swings: the lead hand opposes the lead FOOT, all cycle long", () => {
    // Round 2: „let the free arm counter-swing". The lead hand rode the same
    // sign as the lead foot, so arm and leg went forward together — a wind-up
    // toy. Sampled across the whole cycle, never at one lucky phase.
    const cycle = Array.from({ length: RIG.runCycleTicks }, (_, t) =>
      rigPose(input({ pose: "run", walkTime: t, vxSubs: PAINT.runMax })));
    // the centre each limb swings about, taken from the poses themselves rather
    // than re-derived from the formula (a second copy of a rule is a second rule)
    const mean = (pick: (p: (typeof cycle)[number]) => number): number =>
      cycle.reduce((s, p) => s + pick(p), 0) / cycle.length;
    const handMid = mean((p) => p.handF.dx);
    const footMid = mean((p) => p.footF.dx);
    let opposed = 0;
    cycle.forEach((p, t) => {
      const foot = p.footF.dx - footMid;
      const hand = p.handF.dx - handMid;
      if (Math.abs(foot) < 0.5) return; // the crossing point: nothing to oppose
      expect(hand * foot, `tick ${t}: hand and foot swing together`).toBeLessThan(0);
      opposed++;
    });
    expect(opposed).toBeGreaterThan(RIG.runCycleTicks / 2); // most of the cycle, not one lucky phase
  });

  it("never draws the lead mitt into the middle of the torso (the »held ball«)", () => {
    // Round 2's headline: „the character holds a white ball at chest height in
    // idle, run, jump and landing". It was not a ball. It was his own hand,
    // parked at dx 5 — the exact centre of a torso that measures 16 px and
    // reaches 9.5 px to the lead side. Every grounded frame now clears it.
    const grounded: RigInput[] = [
      input({ pose: "stand", tick: 9 }),
      input({ pose: "stand", landedAgo: 0 }),
      input({ pose: "stand", landedAgo: 4 }),
      ...Array.from({ length: RIG.runCycleTicks }, (_, t) => input({ pose: "run", walkTime: t, vxSubs: PAINT.runMax })),
      ...Array.from({ length: RIG.runCycleTicks }, (_, t) => input({ pose: "walk", walkTime: t, vxSubs: PAINT.walkMax })),
    ];
    for (const inp of grounded) {
      const p = rigPose(inp);
      expect(
        p.handF.dx,
        `${inp.pose} @ ${inp.walkTime}/${inp.landedAgo}: the mitt is parked on the chest`,
      ).toBeGreaterThanOrEqual(RIG.handClearPx - 0.001);
    }
    // TAMPER: the retired rest position fails this by 4.5 px, which is what the
    // critique was looking at in all six frames.
    expect(5).toBeLessThan(RIG.handClearPx);
  });

  it("splits the feet by a whole shoe at the widest part of the stride", () => {
    // Round 2: „redraw the run mid-stride with real leg extension". A shoe is
    // 11.3 logical px wide; at H1's 6.5-px stride the widest split was 21 px
    // between two ANCHORS 11.3 px wide — the shoes still touched.
    let widest = 0;
    for (let t = 0; t < RIG.runCycleTicks; t++) {
      const p = rigPose(input({ pose: "run", walkTime: t, vxSubs: PAINT.runMax }));
      widest = Math.max(widest, p.footF.dx - p.footB.dx);
    }
    expect(widest).toBeGreaterThan(24);
    // …and the shoes ANGLE: the reaching foot toe-up, the pushing foot toe-down,
    // which is the only thing a legless rig can say about extension
    const mid = rigPose(input({ pose: "run", walkTime: 0, vxSubs: PAINT.runMax }));
    expect(Math.sign(mid.footF.rot)).toBe(-Math.sign(mid.footB.rot));
    expect(Math.abs(mid.footF.rot)).toBeGreaterThan(0.2);
    // a walk keeps its flat shuffle — the toe is scaled by speed
    expect(Math.abs(rigPose(input({ pose: "run", walkTime: 0, vxSubs: 0 })).footF.rot)).toBe(0);
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

// ── PK-R6 · H2 · THE SKIN, per state (round-2 findings 1, 3 and 4) ───────────
// „The same wide-open mouth and eyebrow shape appears in the idle, run,
// jump-apex and landing frames" — and the same torso, and the same two closed
// mitts. Five faces, three torsos and three hands were commissioned; a landing
// used none of them. The POSE moving is only half a state: the painted parts
// have to move with it or the boy is a puppet in one costume.
describe("the skin says which state he is in (findings 1, 3, 4)", () => {
  const face = (pose: PlayerPose, landedAgo = 99, tick = 40): string => faceFor(pose, tick, false, landedAgo);

  it("gives idle, run, the rise and the touchdown four different faces", () => {
    const four = [face("stand"), face("run"), face("jump"), face("stand", 0)];
    expect(new Set(four).size, `only ${new Set(four).size} faces across four states`).toBe(4);
    expect(face("stand", 0)).toBe("head_blink"); // eyes shut on impact
    expect(face("jump")).toBe("head_celebrate"); // the open-mouthed „whee"
    expect(face("run")).toBe("head_determined");
    expect(face("stand")).toBe("head_neutral");
    // the fall is NOT the rise: the two air halves differ in face as well
    expect(face("fall")).not.toBe(face("jump"));
    // the ceremony still outranks everything (its portrait must not change)
    expect(faceFor("stand", 0, true, 99)).toBe("head_celebrate");
    // …and being hurt outranks a landing, or a hit taken on touchdown would
    // read as a blink
    expect(face("hit", 0)).toBe("head_hurt");
  });

  it("wears the crouched torso and a braced open palm on the touchdown (TAMPER)", () => {
    expect(bodyStemFor("stand", 0)).toBe("body_crouch");
    expect(handStemsFor("stand", 0)).toEqual({ front: "hand_open", back: "hand_fist" });
    // …the run's pairing, inverted: the pumping hand becomes the bracing one
    expect(handStemsFor("run", 99)).toEqual({ front: "hand_fist", back: "hand_open" });
    // TAMPER: one tick past the window every one of them is back to standing —
    // a landing skin stuck on would repaint the whole chapter
    expect(bodyStemFor("stand", LAND_SKIN_TICKS)).toBe("body_idle");
    expect(handStemsFor("stand", LAND_SKIN_TICKS)).toEqual({ front: "hand_fist", back: "hand_fist" });
    expect(face("stand", LAND_SKIN_TICKS)).toBe("head_neutral");
    // …and the skin settles BEFORE the stance does (extremities finish last)
    expect(LAND_SKIN_TICKS).toBeLessThan(RIG.landStanceTicks);
    // a landing is a GROUNDED event: falling past a wall is not a touchdown
    expect(bodyStemFor("fall", 0)).toBe("body_idle");
    expect(face("fall", 0)).toBe("head_neutral");
    // …and a hand that is holding on never opens for one
    expect(handStemsFor("hang", 0)).toEqual({ front: "hand_grip", back: "hand_grip" });
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

// ── PK-R6 · H1 · THE BRACE (round-1 critique, finding 7) ─────────────────────
// „The boy is in the same static standing pose despite the boss winding up and
// throwing." ch01 grants no fist, so his body is his only answer — and a body
// that never answers is a cutout standing in its own boss fight.
describe("the brace: the child answers the boss (finding 7)", () => {
  const stand = rigPose(input({ pose: "stand" }));

  it("a full brace is a DIFFERENT picture from standing still (TAMPER)", () => {
    const braced = withBrace(stand, 1);
    expect(braced).not.toEqual(stand);
    // he drops his weight …
    expect(braced.body.dy).toBeGreaterThan(stand.body.dy);
    expect(braced.scaleY).toBeLessThan(stand.scaleY);
    // … brings the lead hand up and across …
    expect(braced.handF.dx).toBeLessThan(stand.handF.dx);
    expect(braced.handF.dy).toBeLessThan(stand.handF.dy);
    // … and looks UP at the thing about to throw
    expect(braced.head.rot).toBeLessThan(stand.head.rot);
    // TAMPER: t = 0 must be the untouched pose, or the brace would be stuck on
    // for the whole chapter (it is read off the boss every frame).
    expect(withBrace(stand, 0)).toEqual(stand);
  });

  it("ramps with the telegraph rather than snapping on", () => {
    const half = withBrace(stand, 0.5);
    const full = withBrace(stand, 1);
    expect(half.body.dy).toBeGreaterThan(stand.body.dy);
    expect(half.body.dy).toBeLessThan(full.body.dy);
    // clamped: a clock that overruns its telegraph must not fold him in half
    expect(withBrace(stand, 4)).toEqual(full);
    expect(withBrace(stand, -3)).toEqual(stand);
  });

  it("composes with the pose he is already in — he can brace while running", () => {
    const run = rigPose(input({ pose: "run", walkTime: 5, vxSubs: PAINT.runMax }));
    const braced = withBrace(run, 1);
    // the run's own footwork survives: a brace that replaced it would freeze him
    // mid-stride in the one moment he most needs to be moving
    expect(braced.footF).toEqual(run.footF);
    expect(braced.footB).toEqual(run.footB);
    expect(braced.body.dy).toBeGreaterThan(run.body.dy);
  });

  it("stacks with withFistAway without either undoing the other", () => {
    const both = withBrace(withFistAway(stand), 1);
    expect(both.handF.hidden).toBe(true); // the fist is still away …
    expect(both.body.dy).toBeGreaterThan(stand.body.dy); // … and he is still low
  });
});

// ── PK-R6 · H2 · THE CHEER (round-2 findings 4 and 9) ────────────────────────
// „The correct-answer cheer has no juice: the character's pose, expression and
// everything else in the frame is pixel-identical [to the hold frame]." It was,
// and the reason was one hard-coded argument: the world's compositor asked
// `faceFor(pose, tick, false)`, so `head_celebrate` — a commissioned cell — was
// unreachable in the running game. These lock both halves of the repair.
describe("PK-R6 · H2 · the cheer", () => {
  const stand = rigPose(input({ pose: "stand" }));

  it("is nothing at all when he is not cheering (no cost to every other frame)", () => {
    expect(withCheer(stand, 0)).toEqual(stand);
    expect(withCheer(stand, -2)).toEqual(stand);
  });

  it("puts BOTH hands above the shoulder line — the sanctioned symmetric flare", () => {
    const c = withCheer(stand, 1);
    // the head hangs at −14 and is about 11 px tall, so „above the shoulders"
    // means both mitts clear the top of the torso
    expect(c.handF.dy).toBeLessThan(stand.handF.dy - 8);
    expect(c.handB.dy).toBeLessThan(stand.handB.dy - 8);
    // …and they throw APART, so the silhouette opens rather than closing up
    expect(c.handF.dx).toBeGreaterThan(stand.handF.dx);
    expect(c.handB.dx).toBeLessThan(stand.handB.dx);
  });

  it("lifts him without moving him: the sim is frozen for the card", () => {
    const c = withCheer(stand, 1);
    expect(c.body.dy).toBeLessThan(stand.body.dy); // up on his toes
    expect(c.head.dy).toBeLessThan(c.body.dy); // …the head leads it
    expect(c.scaleY).toBeGreaterThan(stand.scaleY); // he stretches, he does not squat
    expect(c.footF).toEqual(stand.footF); // and his feet stay where they are
    expect(c.footB).toEqual(stand.footB);
  });

  it("ramps and clamps, like every other modifier", () => {
    const half = withCheer(stand, 0.5);
    const full = withCheer(stand, 1);
    expect(half.handF.dy).toBeGreaterThan(full.handF.dy);
    expect(half.handF.dy).toBeLessThan(stand.handF.dy);
    expect(withCheer(stand, 9)).toEqual(full);
  });

  it("reaches the celebrate FACE and two open hands — the payoff cells exist", () => {
    // the shipped defect, as a table: with `celebrating` false the boy wears his
    // near-neutral face at the one moment the game pays him for the work
    expect(faceFor("stand", 0, false)).not.toBe("head_celebrate");
    expect(faceFor("stand", 0, true)).toBe("head_celebrate");
    expect(handStemsFor("stand", 99, true)).toEqual({ front: "hand_open", back: "hand_open" });
    // …and nothing else changed: a non-cheering stand is exactly what it was
    expect(handStemsFor("stand", 99)).toEqual({ front: "hand_fist", back: "hand_fist" });
  });

  it("gives the CARD beat its own face too, and ranks it under the cheer", () => {
    // finding 9: „identical near-neutral face while receiving an item, saying
    // »Danke!« and winning". Three beats, three readings — and the ordering
    // matters: the answer landing outranks listening for it.
    expect(faceFor("stand", 40, false, 99, false)).toBe("head_neutral");
    expect(faceFor("stand", 40, false, 99, true)).toBe("head_determined");
    expect(faceFor("stand", 40, true, 99, true)).toBe("head_celebrate");
    // …and an event happening TO him still wins over both
    expect(faceFor("hit", 40, false, 99, true)).toBe("head_hurt");
  });
});
