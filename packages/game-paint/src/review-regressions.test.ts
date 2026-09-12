// CODEX DRAFT — NOT CANON · independent findings reproduced through real actions.
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { describe, it, expect } from "vitest";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { newChapterLearning } from "./learning.ts";
import { IDLE_PAD } from "./player.ts";
import { decodePads, maskToPad } from "./tape.ts";
import { sceneDrawItems, worldSceneSnapshot } from "./scene-v2.ts";
import { checkLevelLaws, type PaintLevel } from "./level.ts";
import { SUBS, TILE } from "./paint.ts";
import { requestedTask } from "./cards/routing.ts";
import type { GameTaskV2 } from "@domigo/content-schema";
const level = readZooJson("ch02.level.json") as PaintLevel;
const tasks = readZooJson("ch02.tasks.v2.json").items as GameTaskV2[];
const proof = readZooJson("ch02.proof.json");
const cfg = (l: PaintLevel, p: string, learning = newChapterLearning()) => ({ level: l, phaseId: p, tasks, learningProgress: learning, grantedAbilities: () => ["jump", "run", "hang", "punch"], freedCageIds: () => [], cageHintShown: () => true, arenaBriefShown: () => true });
const reqOf = (events: SimEvent[]) => events.find((e): e is Extract<SimEvent, {
  type: "task";
}> => e.type === "task")?.req;
const runHandler = (sim: Sim, requests: TaskRequest[]) => {
  const handle = (events: SimEvent[]) => {
    for (const ev of events) {
      if (ev.type === "task") {
        requestedTask(tasks, ev.req, sim.phase.id);
        requests.push(ev.req);
        handle(sim.solveTask(ev.req.ctx));
      }
      else if (["cageHint", "tip", "arenaBrief"].includes(ev.type))
        sim.setOverlay(false);
    }
  };
  return handle;
};
describe("R1b independent-review regressions", () => {
  it("serves all five door variants after the actual required conversation, without fabricated redemption", () => {
    for (const phase of level.phases)
      for (const door of phase.entities.filter(e => e.role === "door.trigger" && e.params?.taskSequenceV2)) {
        const l = structuredClone(level);
        l.phases.find(p => p.id === phase.id)!.entities = [structuredClone(door)];
        const sim = new Sim(cfg(l, phase.id)), requests: TaskRequest[] = [], handle = runHandler(sim, requests);
        sim.warp(door.c, door.r);
        handle(sim.step(IDLE_PAD));
        for (let i = 0; i < 240 && !sim.completedSequences.has(door.id); i++)
          handle(sim.step({ ...IDLE_PAD, up: i % 30 === 0 }));
        expect(sim.completedSequences.has(door.id)).toBe(true);
        for (let i = 0; i < 300; i++)
          handle(sim.step({ ...IDLE_PAD, up: i % 30 === 0 }));
        for (const id of door.params!.taskSequenceV2!.variantIds)
          expect(requests.some(r => "taskId" in r.ctx && r.ctx.taskId === id), id).toBe(true);
      }
  });
  it("uses Fenn's exact observed bodies at grounded feet in all six questions", () => {
    const l = structuredClone(level);
    l.phases[1]!.entities = l.phases[1]!.entities.filter(e => e.id === "p2-fenn" || e.id === "p2-cage-fenn");
    const sim = new Sim(cfg(l, "p2")), requests: TaskRequest[] = [], fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
    const handle = (evs: SimEvent[]) => {
      for (const ev of evs)
        if (ev.type === "task") {
          requests.push(ev.req);
          expect(ev.req.sceneSnapshot).toEqual(fenn.classmateScene);
          const bodies = sceneDrawItems(ev.req.sceneSnapshot!).filter(i => i.kind === "actor");
          expect(bodies.length).toBe(requests.length >= 5 ? 4 : 1);
          expect(bodies.every(b => b.y === fenn.y / SUBS)).toBe(true);
          handle(sim.solveTask(ev.req.ctx));
        }
    };
    sim.warp(50, 17);
    for (let i = 0; i < 200 && requests.length < 6; i++)
      handle(sim.step({ ...IDLE_PAD, up: i % 30 === 0 }));
    expect(requests).toHaveLength(6);
    expect(fenn.awakenStep).toBe(6);
    expect(fenn.redeemed).toBe(true);
  });
  it("retains the lion's physical feet in every card, restores the remaining plates, and serves reserves after victory", () => {
    const learning = newChapterLearning();
    let sim = new Sim(cfg(level, "p4", learning));
    const requests: TaskRequest[] = [];
    let checkedRestore = false;
    for (const mask of decodePads(proof.phases.p4.pads)) {
      const handle = (evs: SimEvent[]) => {
        for (const ev of evs) {
          if (ev.type === "task") {
            const lion = sim.world.entities.find(e => e.zoo)!;
            const drawn = sceneDrawItems(ev.req.sceneSnapshot!).find(i => i.id === "lion:0")!;
            expect(drawn.x).toBe(lion.x / SUBS);
            expect(drawn.y).toBe(lion.y / SUBS);
            requests.push(ev.req);
            handle(sim.solveTask(ev.req.ctx));
          }
          else if (ev.type === "arenaBrief")
            sim.setOverlay(false);
        }
      };
      handle(sim.step(maskToPad(mask)));
      if (!checkedRestore && sim.world.entities.find(e => e.zoo)?.zoo?.homes.length === 2) {
        const reloaded = new Sim(cfg(level, "p4", JSON.parse(JSON.stringify(learning))));
        expect(reloaded.world.guardianKnots).toBe(2);
        checkedRestore = true;
      }
    }
    expect(checkedRestore).toBe(true);
    expect(sim.guardianDefeated).toBe(true);
    expect(requests).toHaveLength(9);
    sim = new Sim(cfg(level, "p4", JSON.parse(JSON.stringify(learning))));
    expect(sim.guardianDefeated).toBe(true);
    expect(sim.world.guardianKnots).toBe(0);
    const lion = sim.world.entities.find(e => e.zoo)!, before = structuredClone(lion.zoo!.homes), extra: TaskRequest[] = [];
    sim.warp(lion.x / SUBS / TILE - .5, lion.y / SUBS / TILE - 1);
    const handle = runHandler(sim, extra);
    for (let i = 0; i < 700; i++)
      handle(sim.step({ ...IDLE_PAD, up: i % 30 === 0 }));
    expect(extra.slice(0, 3).map(r => "optionalSlotId" in r.ctx ? r.ctx.optionalSlotId : null)).toEqual(["r-tree", "r-under", "r-under-2"]);
    expect(lion.zoo!.homes).toEqual(before);
    expect(sim.world.guardianKnots).toBe(0);
  });
  it("keeps an arrived actor visible before the first target beat", () => {
    const l = structuredClone(level);
    l.phases[0]!.entities = l.phases[0]!.entities.filter(e => ["p1-pinguin", "p1-buehne-buddy"].includes(e.id));
    const sim = new Sim(cfg(l, "p1"));
    sim.warp(48, 17);
    sim.step(IDLE_PAD);
    const req = reqOf(sim.step({ ...IDLE_PAD, up: true }))!;
    sim.solveTask(req.ctx);
    sim.warp(2, 17);
    for (let i = 0; i < 220; i++)
      sim.step(IDLE_PAD);
    const buddy = sim.world.entities.find(e => e.id === "p1-buehne-buddy")!;
    expect(buddy.stageRuntime!.scene.beatId).toBe(null);
    const view = worldSceneSnapshot(buddy.id, buddy.homeX, buddy.homeY, buddy.stageRuntime!.scene, buddy.params.stageV2!);
    expect(sceneDrawItems(view).some(i => i.id === "penguinHome:0")).toBe(true);
  });
  it("tests local ramp floors under a ceiling and a bridge; a genuinely pointless ramp remains red", () => {
    const l = structuredClone(level), p = l.phases[1]!;
    l.phases = [p];
    delete l.arena;
    delete l.bonus;
    p.entities = [];
    p.links = [];
    delete p.exitRequires;
    p.rows = ["#".repeat(24), ...Array.from({ length: 18 }, () => ".".repeat(24)), "#".repeat(24)];
    p.rows[18] = ".S....................X.";
    const put = (c: number, r: number, g: string) => p.rows[r] = p.rows[r]!.slice(0, c) + g + p.rows[r]!.slice(c + 1);
    // Local comparison around c20/r18, independent of the required ceiling/bridge above.
    put(19, 18, ".");
    put(20, 18, "/");
    put(21, 18, "#");
    put(19, 19, "#");
    put(20, 19, "#");
    put(20, 13, "=");
    expect(checkLevelLaws(l).filter(e => e.law === "slope-purpose" && e.detail.includes("(20,18)"))).toEqual([]);
    put(21, 18, ".");
    put(21, 19, "#");
    expect(checkLevelLaws(l).some(e => e.law === "slope-purpose" && e.detail.includes("(20,18)"))).toBe(true);
  });
  it("lands on the dry floor beneath a falling sign and cannot be dragged or reattached through it", () => {
    const l = structuredClone(level), p = l.phases[2]!;
    p.entities = [{ id: "fall", role: "platform.fall", skin: "schild", c: 40, r: 13, tier: "E", params: {} }];
    const sim = new Sim(cfg(l, "p3"));
    sim.warp(40, 10);
    let boarded = false, landed = false;
    for (let i = 0; i < 230; i++) {
      sim.step(IDLE_PAD);
      boarded ||= sim.ridingId === "fall";
      if (boarded && sim.ridingId === null && sim.player.grounded) {
        landed = true;
        expect(sim.player.y).toBe(18 * TILE * SUBS);
      }
      if (landed)
        expect(sim.ridingId).toBe(null);
    }
    expect(boarded).toBe(true);
    expect(landed).toBe(true);
  });
});

it("returns the lion home after a voluntary review without freezing or teleporting the player", () => {
  const learning = newChapterLearning();
  let sim = new Sim(cfg(level, "p4", learning));
  const requests: TaskRequest[] = [];
  const handle = runHandler(sim, requests);
  for (const mask of decodePads(proof.phases.p4.pads)) handle(sim.step(maskToPad(mask)));
  expect(sim.guardianDefeated).toBe(true);
  let lion = sim.world.entities.find(e => e.zoo)!;
  const home = { x: lion.x, y: lion.y, dir: lion.dir, scene: structuredClone(lion.zoo!.scene) };
  const required = [...sim.solvedTaskIds];
  sim.warp(lion.x / SUBS / TILE - .5, lion.y / SUBS / TILE - 1);
  sim.step(IDLE_PAD);
  let request: TaskRequest | undefined;
  for (let tick = 0; tick < 400 && !request; tick++) request = reqOf(sim.step({ ...IDLE_PAD, up: tick === 0 }));
  expect(request?.ctx).toMatchObject({ type: "guardian", optionalSlotId: "r-tree" });
  expect(lion.x).not.toBe(home.x);
  const questionX = lion.x;
  sim.solveTask(request!.ctx);
  expect(sim.overlayOpen).toBe(false);
  expect(lion.x).toBe(questionX);
  expect(lion.state).toBe("review-return");
  expect(sim.solveTask(request!.ctx).filter(e => e.type === "taskSolved")).toEqual([]);
  const playerX = sim.player.x;
  for (let tick = 0; tick < 45; tick++) {
    const before = lion.x;
    expect(sim.step({ ...IDLE_PAD, right: true }).some(e => e.type === "guardianDown")).toBe(false);
    expect(Math.abs(lion.x - before)).toBeLessThanOrEqual(Math.ceil(Math.abs(home.x - questionX) / 90));
  }
  expect(sim.player.x).not.toBe(playerX);
  const midpoint = lion.x;
  sim = new Sim(cfg(level, "p4", JSON.parse(JSON.stringify(learning))));
  lion = sim.world.entities.find(e => e.zoo)!;
  expect(lion.x).toBe(midpoint);
  sim.warp(2, 17);
  for (let tick = 0; tick < 45; tick++) expect(sim.step(IDLE_PAD).some(e => e.type === "guardianDown")).toBe(false);
  expect({ x: lion.x, y: lion.y, dir: lion.dir, scene: lion.zoo!.scene }).toEqual(home);
  expect(lion.state).toBe("done");
  expect(lion.zoo!.review).toBeUndefined();
  expect(sim.world.guardianKnots).toBe(0);
  expect([...sim.solvedTaskIds]).toEqual(required);
  expect(sim.learning.optionalCursors[lion.id]).toBe(1);
});
