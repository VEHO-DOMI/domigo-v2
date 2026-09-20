// CODEX DRAFT — NOT CANON
// User playthrough contract: real Sim and shipped input tapes, without UI stubs.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GameTasksFileV2, PaintProof } from "@domigo/content-schema";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { type PaintLevel } from "./level.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { companionPointSafe } from "./companion.ts";
import { decodePads, maskToPad } from "./tape.ts";
import { solveTapeCard } from "./tape-evidence.ts";

const read = (suffix: string) => JSON.parse(readFileSync(new URL(`../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.${suffix}.json`, import.meta.url), "utf8"));
const level = read("level") as PaintLevel;
const tasks = GameTasksFileV2.parse(read("tasks.v2")).items;
const proof = PaintProof.parse(read("proof"));
const merle = (sim: Sim) => sim.world.entities.find(e => e.role === "classmate" && e.skin === "merle");
const ledger = () => ({ freed: [] as string[], pickups: [] as string[] });

function driver(phaseId: string, remembered = ledger()) {
  const sim = new Sim({ level, tasks, phaseId, grantedAbilities: () => ["jump", "run"],
    freedCageIds: () => remembered.freed, collectedPickupIds: () => remembered.pickups });
  const requests: TaskRequest[] = [], events: SimEvent[] = [];
  let awaitLanding = false;
  const handle = (batch: SimEvent[]): void => {
    for (const e of batch) {
      events.push(e);
      if (e.type === "task") {
        requests.push(e.req);
        solveTapeCard(tasks, e.req, phaseId);
        handle(sim.solveTask(e.req.ctx));
      } else if (e.type === "cageFreed") {
        if (!remembered.freed.includes(e.id)) remembered.freed.push(e.id);
        sim.setOverlay(false);
      } else if (e.type === "tip" || e.type === "book" || e.type === "cloth") {
        if (!remembered.pickups.includes(e.id)) remembered.pickups.push(e.id);
        if (e.type === "tip") sim.setOverlay(false);
      } else if (e.type === "arenaBrief" || e.type === "cageHint" || e.type === "powerup") sim.setOverlay(false);
      else if (e.type === "guardianDown") awaitLanding = true;
    }
  };
  const tick = (pad: Pad = IDLE_PAD) => {
    const batch = sim.step(pad);
    const hit = sim.player.stun > 0;
    if (hit) expect(batch.filter(e => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.skin === "tafel")).toEqual([]);
    handle(batch);
    if (awaitLanding && sim.holdTicks === 0) { awaitLanding = false; sim.setOverlay(false); }
    const mate = merle(sim);
    if (mate?.companion) expect(companionPointSafe(sim.grid, mate.companion.point), `${phaseId} companion point is physically safe`).toBe(true);
    return { batch, hit };
  };
  return { sim, remembered, requests, events, tick };
}
function play(d: ReturnType<typeof driver>, phaseId: string) {
  let moving = 0, jumps = 0, hits = 0;
  for (const mask of decodePads(proof.phases[phaseId]!.pads)) {
    const result = d.tick(maskToPad(mask));
    if (result.hit) hits++;
    if (merle(d.sim)?.companion?.pose === "walk") moving++;
    if (merle(d.sim)?.companion?.pose === "jump") jumps++;
  }
  expect(d.events.some(e => e.type === "exit"), `${phaseId} actual tape exits`).toBe(true);
  return { moving, jumps, hits };
}
function freedChapter() {
  const d = driver("p2");
  play(d, "p2");
  expect(d.remembered.freed).toContain("p2-cage-merle");
  return d;
}

describe("ch01 story mechanics in the actual chapter", () => {
  it("follows spatially after rescuing Merle first, returning to the scissors, and entering the courtyard", () => {
    const d = driver("p2");
    for (const mask of decodePads(proof.phases.p2!.pads).slice(0, 720)) d.tick(maskToPad(mask));
    const run = (runs: Array<[number, number]>) => {
      for (const mask of decodePads(runs)) d.tick(maskToPad(mask));
    };
    // Jump over the still-cursed scissors, rescue Merle, then return on foot.
    run([[26, 18], [40, 2], [25, 0], [1, 4], [50, 0]]);
    expect(d.remembered.freed).toContain("p2-cage-merle");
    expect(d.sim.world.entities.find(e => e.id === "p2-obj-scissors")?.redeemed).toBe(false);
    run([[40, 1], [30, 0], [1, 4], [60, 0]]);
    expect(d.requests.some(r => r.ctx.type === "entity" && r.ctx.id === "p2-obj-scissors")).toBe(true);
    expect(d.sim.world.entities.find(e => e.id === "p2-obj-scissors")?.redeemed).toBe(true);
    const x = merle(d.sim)!.x;
    run([[35, 2], [14, 18], [30, 2], [180, 0]]);
    expect(merle(d.sim)!.x - x).toBeGreaterThan(8 * TILE * SUBS);
    expect([merle(d.sim)!.x, merle(d.sim)!.y]).toEqual([d.sim.player.x, d.sim.player.y]);
    const court = driver("p3", d.remembered);
    for (const mask of decodePads(proof.phases.p3!.pads).slice(0, 630)) court.tick(maskToPad(mask));
    expect(court.requests.some(r => r.ctx.type === "entity")).toBe(true);
    for (let t = 0; t < 180; t++) court.tick();
    expect(merle(court.sim)!.x).toBeGreaterThan(40 * TILE * SUBS);
    expect([merle(court.sim)!.x, merle(court.sim)!.y]).toEqual([court.sim.player.x, court.sim.player.y]);
  });

  it("earns all six Merle rounds, then follows beyond her old local roaming area", () => {
    const d = freedChapter(), mate = merle(d.sim)!;
    const rounds = d.requests.filter(r => r.ctx.type === "classmate").map(r => r.ctx.type === "classmate" ? r.ctx.round : -1);
    expect(rounds).toEqual([1, 2, 3, 4, 5, 6]);
    expect(mate).toMatchObject({ hidden: false, redeemed: true, awakenStep: 6, state: "follow" });
    expect(mate.companion?.phaseId).toBe("p2");
    expect(mate.x - mate.homeX).toBeGreaterThan(4 * TILE * SUBS);
    expect(d.events.filter(e => e.type === "cageFreed" && e.classmate === "merle")).toHaveLength(1);
  });

  it.each(["p3", "p4"])("carries the actually earned rescue into %s with one safe, moving, jumping Merle", phaseId => {
    const rescued = freedChapter();
    const d = driver(phaseId, rescued.remembered), mate = merle(d.sim)!;
    expect(d.sim.world.entities.filter(e => e.skin === "merle")).toHaveLength(1);
    expect(mate).toMatchObject({ hidden: false, redeemed: true, awakenStep: 6 });
    expect(mate.companion?.phaseId).toBe(phaseId);
    expect(mate.x).toBe(d.sim.player.x);
    expect(mate.y).toBe(d.sim.player.y);
    expect(companionPointSafe(d.sim.grid, mate.companion!.point)).toBe(true);
    const startX = mate.x, activity = play(d, phaseId);
    expect(activity.moving).toBeGreaterThan(20);
    expect(activity.jumps).toBeGreaterThan(0);
    expect(mate.x - startX).toBeGreaterThan(8 * TILE * SUBS);
    expect(d.requests.some(r => r.ctx.type === "classmate")).toBe(false);
    expect(d.events.some(e => e.type === "task" && e.req.ctx.type === "entity" && e.req.ctx.id === mate.id)).toBe(false);
  });

  it("does not invent a rescued companion when the Merle rescue was not earned", () => {
    for (const phaseId of ["p3", "p4"]) {
      expect(merle(driver(phaseId).sim)).toBeUndefined();
      expect(merle(driver(phaseId, { freed: ["p2-cage-tablet"], pickups: [] }).sim)).toBeUndefined();
    }
    expect(merle(driver("p2").sim)).toMatchObject({ hidden: true, redeemed: false });
    expect(merle(driver("p2").sim)?.companion).toBeUndefined();
  });

  it("freezes the follower and its route during a real overlay pause", () => {
    const rescued = freedChapter(), d = driver("p3", rescued.remembered);
    for (let t = 0; t < 40; t++) d.tick({ ...IDLE_PAD, right: true });
    expect(merle(d.sim)?.state).toBe("follow");
    d.sim.setOverlay(true);
    const before = structuredClone(merle(d.sim)), beforeTick = d.sim.tickCount;
    for (let t = 0; t < 90; t++) d.sim.step({ ...IDLE_PAD, right: true, jump: true });
    expect(merle(d.sim)).toEqual(before);
    expect(d.sim.tickCount).toBe(beforeTick);
    d.sim.setOverlay(false);
    const lastTick = merle(d.sim)?.companion?.lastTick;
    for (let t = 0; t < 30; t++) d.tick({ ...IDLE_PAD, right: true });
    expect(merle(d.sim)?.companion?.lastTick).toBeGreaterThan(lastTick!);
  });

  it("collects all nine clothing words, retains them on remount and suppresses their bonus twins", () => {
    expect(tasks).toHaveLength(61);
    expect(tasks.filter(t => t.use === "pickupset")).toEqual([]);
    const remembered = ledger(), words = new Set<string>();
    for (const phase of level.phases) {
      const d = driver(phase.id, remembered);
      for (const item of phase.entities.filter(e => e.role === "cloth")) {
        d.sim.warp(item.c, item.r);
        for (let t = 0; t < 3; t++) d.tick();
        expect(remembered.pickups).toContain(item.id);
      }
      for (const e of d.events) if (e.type === "cloth") words.add(e.wordEn);
      expect(d.requests.some(r => r.use === "pickupset")).toBe(false);
      const remount = driver(phase.id, remembered);
      for (const item of remount.sim.world.entities.filter(e => e.role === "cloth")) expect(item.redeemed).toBe(true);
    }
    expect([...words].sort()).toEqual(["hairband", "hat", "school tie", "shirt", "shoe", "skirt", "socks", "sunglasses", "sweater"]);
    const bonus = driver("p9", remembered);
    const twins = bonus.sim.world.entities.filter(e => e.role === "cloth" && e.params.repeatOf);
    expect(twins.length).toBeGreaterThan(0);
    for (const twin of twins) expect(twin.redeemed).toBe(true);
  });

  it("chalk hits cause knockback without a surprise task while the earned counter-windows remove all three layers", () => {
    const d = driver("p4"), activity = play(d, "p4");
    expect(activity.hits).toBeGreaterThan(0);
    expect(d.requests.filter(r => r.use === "boss" && r.ctx.type === "entity")).toEqual([]);
    expect(d.requests.filter(r => r.use === "boss" && r.ctx.type === "guardian")).toHaveLength(4);
    expect(d.events.filter(e => e.type === "guardianWipe").map(e => e.type === "guardianWipe" ? e.layersLeft : -1)).toEqual([2, 1, 0]);
    expect(d.sim.guardianDefeated).toBe(true);
    expect(d.events.some(e => e.type === "cageFreed")).toBe(true);
  });
});
