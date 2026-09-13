// CODEX DRAFT — NOT CANON
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GameTasksFileV2 } from "@domigo/content-schema";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import type { PaintLevel } from "./level.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { newChapterLearning } from "./learning.ts";
import { requestedTask } from "./cards/routing.ts";
import { autoSolve } from "./cards/machines.ts";
import { decodePads, maskToPad } from "./tape.ts";

const read = (suffix: string) => JSON.parse(readFileSync(new URL(`../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.${suffix}.json`, import.meta.url), "utf8"));
const level = read("level") as PaintLevel;
const tasks = GameTasksFileV2.parse(read("tasks.v2")).items;
const places = [
  ["p1", "p1-eraser", "eraser.k1", "eraser.r1", "eraser.k2"],
  ["p2", "p2-pen", "pen.k1", "pen.r1", "pen.k2"],
  ["p3", "p3-heft", "heft.n1", "heft.r1", "heft.n2"],
] as const;
const id = (suffix: string) => `g1.paint.ch01.enc.${suffix}`;
const request = (events: SimEvent[]) => events.find((e): e is Extract<SimEvent, { type: "task" }> => e.type === "task")?.req;
const config = (phaseId: string, learning = newChapterLearning()) => ({ level, tasks, phaseId, learningProgress: learning, grantedAbilities: () => ["jump", "run"], freedCageIds: () => [], cageHintShown: () => true });
const entity = (sim: Sim, name: string) => sim.world.entities.find(e => e.id === name)!;
type EntityRequest = TaskRequest & { ctx: Extract<TaskRequest["ctx"], { type: "entity" }> };
function approach(sim: Sim, name: string): EntityRequest {
  const e = entity(sim, name);
  // Access shortcut only: every request and answer uses the real Sim/↑ path.
  sim.warp(e.x / SUBS / TILE - .5, e.y / SUBS / TILE - 1);
  let found = request(sim.step(IDLE_PAD));
  for (let t = 0; t < 30 && !found; t++) found = request(sim.step({ ...IDLE_PAD, up: t % 2 === 0 }));
  expect(found, `real ↑ request at ${name}`).toBeDefined();
  expect(found!.ctx).toMatchObject({ id: name });
  if (!found || found.ctx.type !== "entity") throw new Error(`Expected entity task at ${name}`);
  return { ...found, ctx: found.ctx };
}
function answer(sim: Sim, req: TaskRequest) {
  const task = requestedTask(tasks, req, sim.phase.id)!;
  expect(autoSolve(task)).toBe("correct");
  return sim.solveTask(req.ctx);
}

describe("ch01 hostile objects owe their actual colour restoration", () => {
  it.each(places)("%s %s stays colourless and askable after the first action, including a serialized room trip", (phase, name, first, restore, variant) => {
    const learning = newChapterLearning();
    let sim = new Sim(config(phase, learning));
    const grammar = approach(sim, name);
    expect(grammar.ctx.taskId).toBe(id(first));
    expect(requestedTask(tasks, grammar, phase)?.kind).toBe("choice");
    // Neither a forged final answer nor a replay of the first answer may skip a step.
    expect(sim.solveTask({ ...grammar.ctx, taskId: id(restore) })).toEqual([]);
    expect(sim.solvedTaskIds.size).toBe(0);
    const firstEvents = answer(sim, grammar);
    expect(firstEvents.filter(e => e.type === "entityResolved")).toHaveLength(0);
    expect(entity(sim, name)).toMatchObject({ friendly: true, redeemed: false });
    expect(sim.completedSequences.has(name)).toBe(false);
    expect(sim.solveTask(grammar.ctx)).toEqual([]);
    const colour = approach(sim, name);
    expect(colour.ctx.taskId).toBe(id(restore));
    expect(requestedTask(tasks, colour, phase)?.kind).toBe("restore");
    sim.dismissTask(colour.ctx);
    expect(entity(sim, name).redeemed).toBe(false);
    new Sim(config("p9", learning)).step(IDLE_PAD);
    sim = new Sim(config(phase, JSON.parse(JSON.stringify(learning))));
    expect(entity(sim, name)).toMatchObject({ friendly: true, redeemed: false });
    const retry = approach(sim, name);
    expect(retry.ctx.taskId).toBe(id(restore));
    const restored = answer(sim, retry);
    expect(restored.filter(e => e.type === "entityResolved" && e.id === name)).toHaveLength(1);
    expect(entity(sim, name).redeemed).toBe(true);
    expect(sim.completedSequences.has(name)).toBe(true);
    expect(sim.solveTask(retry.ctx)).toEqual([]);
    for (let round = 0; round < 2; round++) {
      const review = approach(sim, name);
      expect(review.ctx).toMatchObject({ taskId: id(variant), optionalSlotId: `variant:${id(variant)}` });
      expect(answer(sim, review).some(e => e.type === "entityResolved")).toBe(false);
    }
  });

  it.each(places)("%s input tape actually reaches both required tasks at %s without teleporting", (phase, name, first, restore) => {
    const sim = new Sim(config(phase));
    const observed: string[] = [];
    const handle = (events: SimEvent[]): void => {
      for (const event of events) {
        if (event.type === "task") {
          if (event.req.ctx.type === "entity" && event.req.ctx.id === name) observed.push(event.req.ctx.taskId ?? "unbound");
          handle(sim.solveTask(event.req.ctx));
        } else if (["tip", "cageHint", "arenaBrief", "powerup", "cageFreed"].includes(event.type)) sim.setOverlay(false);
      }
    };
    for (const mask of decodePads(read("proof").phases[phase].pads)) handle(sim.step(maskToPad(mask)));
    expect(observed.slice(0, 2)).toEqual([id(first), id(restore)]);
    expect(entity(sim, name).redeemed).toBe(true);
  });
});
