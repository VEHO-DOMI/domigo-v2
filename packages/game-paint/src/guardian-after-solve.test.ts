// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import type { PaintLevel } from "./level.ts";
import { newChapterLearning } from "./learning.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { zooSnapshot, restoredZooUsesHomeView } from "./guardian-zoo.ts";
import { sceneDrawItems } from "./scene-v2.ts";
import { replayPhaseTape, worldAssertionErrors } from "./tape.ts";
import { PaintProof, GameTasksFileV2 } from "@domigo/content-schema";
import { StageV2 } from "../../content-schema/src/paint-zoo.ts";

const base = readZooJson("ch02.level.json") as PaintLevel;
const task = (n: number) => `g1.paint.ch02.d${String(n).padStart(2, "0")}`;
const question = (events: SimEvent[]) => events.find((e): e is Extract<SimEvent, { type: "task" }> => e.type === "task")?.req;
const lion = (s: Sim) => s.world.entities.find(e => e.params.guardian?.mode === "zoo-lion")!;
const actor = (s: Sim, id: string) => lion(s).zoo!.scene.actors.find(a => a.id === id)!;
const picture = (s: Sim) => zooSnapshot(lion(s));
const draw = (s: Sim) => sceneDrawItems(picture(s));
const config = (level: PaintLevel, learning = newChapterLearning()) => ({ level, phaseId: "p4", learningProgress: learning,
  grantedAbilities: () => ["jump", "run", "punch", "hang"], freedCageIds: () => [] });
// Same bounded physical input fixture as guardian-zoo.test.ts: return the real
// active plate by a fist at its position. No fabricated rounds or solved IDs.
const tick = (sim: Sim): SimEvent[] => {
  sim.player.iframes = 999;
  const plate = sim.world.projectiles.find(p => p.kind === "plate" && !p.deflected && (!p.groundReturn || p.grounded));
  if (plate) sim.fist = { active: true, x: plate.x, y: plate.y, dir: 1, vSubs: 0, travelLeftSubs: 999999, returning: false, charge: 0 };
  return sim.step(IDLE_PAD);
};
const reach = (sim: Sim, target: string): TaskRequest => {
  for (let t = 0; t < 6500; t++) {
    const req = question(tick(sim));
    if (!req) continue;
    if ("taskId" in req.ctx && req.ctx.taskId === target) return req;
    expect(sim.solveTask(req.ctx).some(e => e.type === "taskSolved")).toBe(true);
  }
  throw new Error(`No actual question ${target}`);
};
const levelWithViews = (): PaintLevel => {
  const l = structuredClone(base);
  const params = l.arena!.entities.find(e => e.params?.guardian)!.params!;
  params.guardian!.playAfterSolvePaths = true;
  const stage = params.stageV2!;
  // Illustration-free presentation contract: the guide exists in the world,
  // but D06 cannot expose his identity until the child has asked the question.
  stage.view = { actorIds: stage.actors.map(a => a.id), propIds: ["loewenschild"] };
  stage.beats.find(b => b.id === "d02")!.view = { actorIds: ["parrot"], propIds: [] };
  stage.beats.find(b => b.id === "d06")!.view = { actorIds: ["lion"], propIds: [] };
  stage.beats.find(b => b.id === "d09")!.view = { actorIds: ["lion"], propIds: [] };
  expect(StageV2.parse(stage)).toEqual(stage);
  return l;
};

describe("guardian post-answer scene paths", () => {
  it("serves the beat's D02 view and restores the ordinary world before the animal home path", () => {
    const sim = new Sim(config(levelWithViews())); sim.warp(12, 17);
    const req = reach(sim, task(2));
    expect(req.sceneSnapshot?.actors.map(a => a.id)).toEqual(["parrot"]);
    expect(req.sceneSnapshot?.props).toEqual([]);
    expect(sim.solveTask(req.ctx).filter(e => e.type === "taskSolved")).toHaveLength(1);
    expect(lion(sim).state).toBe("release");
    expect(picture(sim).actors.map(a => a.id)).toContain("guide");
    expect(picture(sim).props.map(p => p.id)).toEqual(["loewenschild"]);
    expect(req.sceneSnapshot?.actors.map(a => a.id)).toEqual(["parrot"]); // frozen request
  });

  it("executes D05's actual path before serving D06; no early second card or duplicate credit", () => {
    const sim = new Sim(config(levelWithViews())); sim.warp(12, 17);
    const req = reach(sim, task(5)); const before = actor(sim, "monkeys").x;
    expect(sim.solveTask(req.ctx).filter(e => e.type === "taskSolved")).toHaveLength(1);
    expect(lion(sim).state).toBe("after-solve");
    expect(lion(sim).zoo!.card).toBe(0);
    expect(sim.solveTask(req.ctx)).toEqual([]);
    for (let t = 1; t < 60; t++) {
      expect(question(tick(sim))).toBeUndefined();
      expect(actor(sim, "monkeys").x).toBeCloseTo(before + (.3 - before) * t / 60);
      expect(lion(sim).zoo!.card).toBe(0);
    }
    expect(question(tick(sim))).toBeUndefined();
    expect(actor(sim, "monkeys").x).toBe(.3);
    expect(lion(sim).zoo!.scene.beatId).toBe("d06");
    expect(lion(sim).zoo!.card).toBe(1);
    expect(sim.solvedTaskIds.size).toBe(5);
    const next = reach(sim, task(6));
    expect(next.sceneSnapshot?.actors.map(a => a.id)).not.toContain("guide");
    expect(actor(sim, "guide").hidden).not.toBe(true); // presentation, not progress mutation
  });

  it("reveals and moves the guide after real D06, survives actual Sim serialization, then completes all four homes and the original welcome", () => {
    const l = levelWithViews(), learning = newChapterLearning();
    let sim = new Sim(config(l, learning)); sim.warp(12, 17);
    const req = reach(sim, task(6));
    expect(req.sceneSnapshot?.actors.map(a => a.id)).not.toContain("guide");
    expect(draw(sim).some(a => a.id === "guide:0")).toBe(false);
    const knots = sim.world.guardianKnots;
    sim.solveTask(req.ctx);
    expect(sim.solvedTaskIds.size).toBe(6);
    expect(draw(sim).some(a => a.id === "guide:0")).toBe(true);
    for (let t = 1; t <= 30; t++) {
      expect(question(tick(sim))).toBeUndefined();
      expect(actor(sim, "guide").x).toBeCloseTo(.22 + .08 * t / 60);
      expect(sim.world.guardianKnots).toBe(knots);
    }
    const saved = JSON.parse(JSON.stringify(learning));
    saved.entities[lion(sim).id].zoo.scene.returning = false; // legacy presentation flag
    delete l.arena!.entities.find(e => e.params?.guardian)!.params!.guardian!.playAfterSolvePaths;
    sim = new Sim(config(l, saved)); sim.warp(12, 17);
    expect(lion(sim).state).toBe("after-solve");
    expect(lion(sim).zoo!.scene.returnTicks).toBe(30);
    expect(draw(sim).some(a => a.id === "guide:0")).toBe(true);
    expect(sim.solveTask(req.ctx)).toEqual([]);
    for (let t = 31; t <= 60; t++) {
      expect(question(tick(sim))).toBeUndefined();
      expect(actor(sim, "guide").x).toBeCloseTo(.22 + .08 * t / 60);
    }
    expect(actor(sim, "guide").x).toBe(.3);
    expect(lion(sim).state).toBe("release");
    expect(lion(sim).zoo!.card).toBe(2);
    expect(sim.world.guardianKnots).toBe(knots);
    expect(req.sceneSnapshot?.actors.map(a => a.id)).not.toContain("guide");
    const finale = reach(sim, task(9));
    expect(lion(sim).zoo!.homes).toEqual(["parrot", "monkeys", "penguin", "giraffe"]);
    expect(lion(sim).zoo!.deflects).toBe(4);
    expect(picture(sim).actors.find(a => a.id === "lion")?.cell).toMatch(/^lonely[01]$/);
    sim.solveTask(finale.ctx);
    expect(lion(sim).state).toBe("welcomed");
    expect(picture(sim).actors.map(a => a.id)).toContain("guide");
    expect(sim.completedSequences.has(lion(sim).id)).toBe(true);
    let victory = 0;
    for (let t = 0; t < 90; t++) victory += tick(sim).filter(e => e.type === "guardianDown").length;
    expect(victory).toBe(1);
    expect(lion(sim).state).toBe("done");
    expect(lion(sim).x).toBe(22.5 * TILE * SUBS);
    expect(lion(sim).y).toBe(18 * TILE * SUBS);
    expect(sim.solvedTaskIds.size).toBe(9);
    for (let t = 0; t < 30; t++) expect(tick(sim).filter(e => e.type === "guardianDown")).toEqual([]);
  });

  it("keeps D08's authored sad pose during its settled observation and report without moving the real feet", () => {
    const sim = new Sim(config(levelWithViews())); sim.warp(12, 17);
    const d7 = reach(sim, task(7)); sim.solveTask(d7.ctx);
    for (let t = 0; t < 61; t++) expect(question(tick(sim))).toBeUndefined();
    const g = lion(sim);
    expect(g.state).toBe("observe");
    const body = { x: g.x, y: g.y };
    expect(picture(sim).actors.find(a => a.id === "lion")).toMatchObject({ cell: "lonely0", emotion: "sad", worldX: body.x / SUBS, worldY: body.y / SUBS });
    const d8 = reach(sim, task(8));
    expect(d8.sceneSnapshot?.actors.find(a => a.id === "lion")).toMatchObject({ cell: "lonely0", emotion: "sad", worldX: g.x / SUBS, worldY: g.y / SUBS });
    expect(g.y).toBe(18 * TILE * SUBS);
    expect({ x: g.x, y: g.y }).toEqual(body);
  });
});


describe("guardian explicit opt-in and old save presentation", () => {
  it.each([undefined, false])("retains the unmodified 2742-tick p4 proof when opt-in is %s", flag => {
    const level = structuredClone(base);
    const g = level.arena!.entities.find(e => e.params?.guardian)!.params!.guardian!;
    expect(g.playAfterSolvePaths).toBeUndefined();
    if (flag !== undefined) g.playAfterSolvePaths = flag;
    const proof = PaintProof.parse(readZooJson("ch02.proof.json"));
    const tasks = GameTasksFileV2.parse(readZooJson("ch02.tasks.v2.json")).items;
    const tape = proof.phases.p4!;
    const result = replayPhaseTape(level, "p4", tape, [], { tasks, cageHintShown: false, arenaBriefShown: false, pickedUp: [] });
    expect(result.exited).toBe(true);
    expect(result.ticksUsed).toBe(2742);
    expect(worldAssertionErrors(tape.expect, result.world)).toEqual([]);
  });

  it("normalizes stale legacy release/home/prowl views in an actual reconstructed Sim without restarting movement", () => {
    const level = levelWithViews(), learning = newChapterLearning();
    let sim = new Sim(config(level, learning)); sim.warp(12, 17);
    const d2 = reach(sim, task(2)); sim.solveTask(d2.ctx);
    for (const target of ["release", "home", "prowl"]) {
      for (let n = 0; lion(sim).state !== target && n < 200; n++) tick(sim);
      expect(lion(sim).state).toBe(target);
      if (target === "home") for (let n = 0; n < 20; n++) tick(sim);
      const before = structuredClone(lion(sim));
      const saved = JSON.parse(JSON.stringify(sim.learning));
      saved.entities[before.id].zoo.scene.returning = false;
      sim = new Sim(config(level, saved)); sim.warp(12, 17);
      const restored = lion(sim);
      expect(restored.state).toBe(before.state);
      expect(restored.timer).toBe(before.timer);
      expect(restored.zoo!.homes).toEqual(before.zoo!.homes);
      expect(restored.zoo!.scene.actors).toEqual(before.zoo!.scene.actors);
      expect(restored.zoo!.scene.returning).toBe(true);
      expect(picture(sim).actors.map(a => a.id)).toContain("guide");
    }
  });

  it("chooses lifecycle evidence over stale flags and rejects unrelated completed beats", () => {
    const sim = new Sim(config(levelWithViews())); sim.warp(12, 17);
    reach(sim, task(2)); const e = lion(sim), z = structuredClone(e.zoo!);
    const read = (state: string) => restoredZooUsesHomeView(state, z, e.params.stageV2!, e.params.guardian!);
    z.scene.returning = false;
    for (const state of ["release", "home", "welcomed", "done", "after-solve", "review-return"]) expect(read(state), state).toBe(true);
    z.scene.returning = true;
    for (const state of ["observe", "report", "lonely", "finale", "review-observe", "review-report"]) expect(read(state), state).toBe(false);
    z.scene.returning = false; z.card = 1; // D01 done, retained D02 is still unanswered.
    for (const state of ["prowl", "mark", "cast", "returned"]) expect(read(state), state).toBe(false);
    z.round = 1; z.card = 0; // Retained D02 now belongs to the completed round.
    for (const state of ["prowl", "mark", "cast", "returned"]) expect(read(state), state).toBe(true);
  });

  it("restores a real optional review's question and saved finished-world view independently", () => {
    const level = levelWithViews(); let sim = new Sim(config(level)); sim.warp(12, 17);
    sim.solveTask(reach(sim, task(9)).ctx);
    for (let t = 0; t < 90; t++) tick(sim);
    expect(lion(sim).state).toBe("done");
    sim.warp(22, 17);
    sim.step({ ...IDLE_PAD, up: true });
    expect(lion(sim).state).toBe("review-observe");
    let req: TaskRequest | undefined;
    for (let n = 0; n < 150 && !req; n++) req = question(sim.step(IDLE_PAD));
    expect(req && "optionalSlotId" in req.ctx && req.ctx.optionalSlotId).toBeTruthy();
    const before = structuredClone(lion(sim));
    const saved = JSON.parse(JSON.stringify(sim.learning));
    saved.entities[before.id].zoo.scene.returning = true;
    saved.entities[before.id].zoo.review.savedScene.returning = false;
    sim = new Sim(config(level, saved)); sim.warp(22, 17);
    expect(lion(sim).state).toBe("review-report");
    expect(lion(sim).zoo!.scene.returning).toBe(false);
    expect(lion(sim).zoo!.review!.savedScene.returning).toBe(true);
    expect(lion(sim).zoo!.review!.savedScene.actors).toEqual(before.zoo!.review!.savedScene.actors);
    const resumed = question(sim.step({ ...IDLE_PAD, up: true }));
    expect(resumed && "optionalSlotId" in resumed.ctx && resumed.ctx.optionalSlotId).toBe(req && "optionalSlotId" in req.ctx && req.ctx.optionalSlotId);
    sim.solveTask(resumed!.ctx);
    expect(lion(sim).state).toBe("review-return");
    expect(lion(sim).zoo!.scene.returning).toBe(true);
    for (let n = 0; n < 90; n++) sim.step(IDLE_PAD);
    expect(lion(sim).state).toBe("done");
    expect(lion(sim).zoo!.review).toBeUndefined();
    expect(lion(sim).zoo!.scene.returning).toBe(true);
  });
});
