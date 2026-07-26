// W4 · the entity POSE hook — batch AC gave four motion cells (pencil_run,
// eraser_squash, ranzen_stomp, heft_bank) that entStateCell could never select.
// These tests pin the signal each pose keys off, and TAMPER each one (invert
// the signal, or push it just under the threshold) so a green light here has
// been seen to turn red.

import { describe, expect, it } from "vitest";
import { BANK_X, RUN_VX, SQUASH_VY, type EntPoseInput, entPoseCell } from "./anim.ts";
import { BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX } from "./entities.ts";
import { SUBS } from "./paint.ts";

const ent = (over: Partial<EntPoseInput>): EntPoseInput => ({
  role: "chaser",
  state: "patrol",
  timer: 0,
  redeemed: false,
  vx: 0,
  vy: 0,
  x: 0,
  homeX: 0,
  ...over,
});

describe("entPoseCell — the four motion poses", () => {
  it("a walker at patrol speed runs; stopped at an edge turn it idles (TAMPER)", () => {
    expect(entPoseCell(ent({ vx: ENEMY_WALK }))).toBe("run");
    expect(entPoseCell(ent({ vx: -ENEMY_WALK }))).toBe("run"); // direction-blind
    // the sim zeroes vx at an edge/ramp turn — that must NOT read as running
    expect(entPoseCell(ent({ vx: 0 }))).toBe("a");
    // just under the threshold falls back to the idle cycle
    expect(entPoseCell(ent({ vx: RUN_VX - 1 }))).toBe("a");
    expect(entPoseCell(ent({ vx: RUN_VX }))).toBe("run");
  });

  it("a bouncer squashes on the fast part of its arc, not at the apex (TAMPER)", () => {
    expect(entPoseCell(ent({ role: "bouncer", vy: -BOUNCE_UP }))).toBe("squash"); // just launched
    expect(entPoseCell(ent({ role: "bouncer", vy: BOUNCE_UP }))).toBe("squash"); // falling in
    expect(entPoseCell(ent({ role: "bouncer", vy: 0 }))).toBe("a"); // apex — hanging, not squashed
    expect(entPoseCell(ent({ role: "bouncer", vy: SQUASH_VY - 1 }))).toBe("a");
    // the same vy on a NON-bouncer is not a squash
    expect(entPoseCell(ent({ role: "chaser", vy: -BOUNCE_UP }))).toBe("a");
  });

  it("a crusher's slam shows the stomp cell; other roles keep plain `act` (TAMPER)", () => {
    expect(entPoseCell(ent({ role: "crusher", state: "act" }))).toBe("stomp");
    expect(entPoseCell(ent({ role: "chaser", state: "act" }))).toBe("act");
    expect(entPoseCell(ent({ role: "crusher", state: "patrol" }))).toBe("a"); // resting high
  });

  it("a flyer banks near the extremes of its sweep, not at the middle (TAMPER)", () => {
    const amp = FLYER_SWEEP_PX * SUBS;
    expect(entPoseCell(ent({ role: "flyer", x: amp, homeX: 0 }))).toBe("bank");
    expect(entPoseCell(ent({ role: "flyer", x: -amp, homeX: 0 }))).toBe("bank"); // both extremes
    expect(entPoseCell(ent({ role: "flyer", x: 0, homeX: 0 }))).toBe("a"); // mid-sweep, level
    expect(entPoseCell(ent({ role: "flyer", x: BANK_X - 1, homeX: 0 }))).toBe("a");
    // the bank is measured from HOME, not from the origin
    expect(entPoseCell(ent({ role: "flyer", x: 5000 + amp, homeX: 5000 }))).toBe("bank");
  });
});

describe("entPoseCell — the old behaviour it must not disturb", () => {
  it("keeps the FSM cells ahead of any motion pose", () => {
    expect(entPoseCell(ent({ state: "telegraph", vx: ENEMY_WALK }))).toBe("telegraph");
    expect(entPoseCell(ent({ state: "burst" }))).toBe("burst");
    expect(entPoseCell(ent({ state: "shaking" }))).toBe("shake");
    for (const state of ["dazed", "consoled", "shooed"]) {
      expect(entPoseCell(ent({ state, vx: ENEMY_WALK }))).toBe("dazed");
    }
    expect(entPoseCell(ent({ redeemed: true, vx: ENEMY_WALK }))).toBe("dazed");
  });

  it("still alternates a/b every 12 ticks when nothing else fires", () => {
    expect(entPoseCell(ent({ timer: 0 }))).toBe("a");
    expect(entPoseCell(ent({ timer: 11 }))).toBe("a");
    expect(entPoseCell(ent({ timer: 12 }))).toBe("b");
    expect(entPoseCell(ent({ timer: 24 }))).toBe("a");
  });

  it("does not read a moving platform's ride delta as a gait", () => {
    // platform.move/.swing write a per-tick position delta into vx; that is the
    // ride contract, not a walk — a platform must never ask for a `_run` cell
    expect(entPoseCell(ent({ role: "platform.move", vx: ENEMY_WALK * 4 }))).toBe("a");
    expect(entPoseCell(ent({ role: "platform.swing", vx: -ENEMY_WALK * 4 }))).toBe("a");
  });
});
