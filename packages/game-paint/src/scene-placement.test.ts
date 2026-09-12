// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { spawnEntities } from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import { solveStage, stepStage } from "./stage-v2.ts";
import {
  beginSceneBeat, createSceneState, sceneDrawItems, snapshotScene, stepSceneBeat,
  type SceneActor, type SceneSnapshot,
} from "./scene-v2.ts";
import type { PaintLevel } from "./level.ts";

const level = readZooJson("ch02.level.json") as PaintLevel;
const entity = (id: string) => level.phases.flatMap((phase) => phase.entities).find((e) => e.id === id)!;
const viewAt = (x: number, y: number): SceneSnapshot["view"] => ({
  x: x / SUBS - 80, y: y / SUBS - 120, width: 160, height: 120,
});
const position = (actor: SceneActor, view: SceneSnapshot["view"]) => ({
  x: actor.worldX ?? view.x + actor.x * view.width,
  y: actor.worldY ?? view.y + actor.y * view.height,
});
const request = (events: SimEvent[]) => events.find((e) => e.type === "task");

function arrivedDog() {
  const isolated = structuredClone(level);
  isolated.phases.find((phase) => phase.id === "p2")!.entities =
    isolated.phases.find((phase) => phase.id === "p2")!.entities.filter((e) =>
      ["p2-hund", "p2-buehne-bus"].includes(e.id));
  const sim = new Sim({
    level: isolated, phaseId: "p2", grantedAbilities: () => ["jump", "hang", "run", "punch"],
    freedCageIds: () => [],
  });
  sim.warp(18, 17);
  let first = request(sim.step(IDLE_PAD));
  first ??= request(sim.step({ ...IDLE_PAD, up: true }));
  expect(first?.req.ctx).toMatchObject({ id: "p2-hund", taskId: "g1.paint.ch02.b05" });
  sim.solveTask(first!.req.ctx);
  const arrivals: SimEvent[] = [];
  for (let tick = 0; tick < 600 && !sim.arrivalFlags.has("dogHome"); tick++) {
    arrivals.push(...sim.step(IDLE_PAD).filter((e) => e.type === "homeArrival"));
  }
  expect(arrivals).toEqual([{ type: "homeArrival", entityId: "p2-buehne-bus", actorId: "dog" }]);
  const bus = sim.world.entities.find((e) => e.id === "p2-buehne-bus")!;
  const dog = bus.stageRuntime!.scene.actors.find((a) => a.id === "dog")!;
  expect(sim.world.entities.find((e) => e.id === "p2-hund")!.hidden).toBe(true);
  expect(position(dog, viewAt(bus.homeX, bus.homeY))).toEqual({ x: 32.5 * TILE, y: 22 * TILE });
  return { sim, bus, dog };
}

describe("scene placement across vehicle layers and world paths", () => {
  it.each([
    ["p1-buehne-papagei", "a08", "parrot", "auto_interior", "auto_front"],
    ["p2-buehne-bus", "b06", "penguins", "bus_interior", "bus_front"],
  ])("puts the real %s/%s actor inside the vehicle", (id, beatId, actorId, interior, front) => {
    const def = entity(id), spec = def.params!.stageV2!;
    const beat = spec.beats.find((b) => b.id === beatId)!;
    const scene = createSceneState(spec);
    const x = (def.c + 0.5) * TILE * SUBS, y = (def.r + 1) * TILE * SUBS;
    beginSceneBeat(scene, beat, viewAt(x, y));
    for (let tick = 0; tick < beat.moveTicks; tick++) stepSceneBeat(scene, spec, beat);
    const picture = snapshotScene(id, x, y, scene, spec);
    expect(picture.relations).toContainEqual({ actorId, propId: id.includes("papagei") ? "car" : "bus", relation: "in" });
    const items = sceneDrawItems(picture);
    const body = items.find((item) => item.id === `${actorId}:0`)!;
    const inside = items.find((item) => item.stem === interior)!;
    const outside = items.find((item) => item.stem === front)!;
    expect(body.depth).toBeGreaterThan(inside.depth);
    expect(body.depth).toBeLessThan(outside.depth);
    expect(items.indexOf(body)).toBeGreaterThan(items.indexOf(inside));
    expect(items.indexOf(body)).toBeLessThan(items.indexOf(outside));
  });

  it("continues the real dog transfer into B07 from the observed arrival position", () => {
    const { sim, bus, dog } = arrivedDog();
    sim.warp(19, 10);
    let roof: ReturnType<typeof request>;
    for (let tick = 0; tick < 500 && !roof; tick++) roof = request(sim.step(IDLE_PAD));
    expect(roof?.req.ctx).toMatchObject({ id: bus.id, taskId: "g1.paint.ch02.b06" });
    sim.solveTask(roof!.req.ctx);
    for (let tick = 0; tick < 600 && !sim.arrivalFlags.has("bus-roof"); tick++) sim.step(IDLE_PAD);
    expect(sim.arrivalFlags.has("bus-roof")).toBe(true);
    const view = viewAt(bus.homeX, bus.homeY), before = position(dog, view);
    const beat = bus.params.stageV2!.beats.find((b) => b.id === "b07")!;
    const target = beat.targetPositions.find((p) => p.actorId === "dog")!;
    sim.warp(33, 21);
    for (let tick = 0; tick < 60 && bus.stageRuntime!.scene.beatId !== "b07"; tick++) sim.step(IDLE_PAD);
    expect(bus.stageRuntime!.scene.beatId).toBe("b07");
    expect(bus.stageRuntime!.scene.ticks).toBe(1);
    const after = position(dog, view);
    expect(after.x).toBeCloseTo(before.x + (view.x + target.x * view.width - before.x) / beat.moveTicks, 8);
    expect(after.y).toBeCloseTo(before.y + (view.y + target.y * view.height - before.y) / beat.moveTicks, 8);
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(3);
  });

  it("rejects starting a transferred actor without its scene view", () => {
    const { bus } = arrivedDog();
    const beat = bus.params.stageV2!.beats.find((b) => b.id === "b07")!;
    expect(() => beginSceneBeat(structuredClone(bus.stageRuntime!.scene), beat)).toThrow(/world-positioned actor.*scene view/i);
  });

  it("starts a later beat continuously after the real giraffe world home path", () => {
    const def = entity("p3-buehne-giraffe");
    const giraffe = spawnEntities([structuredClone(def)], []).entities[0]!;
    const spec = giraffe.params.stageV2!;
    const homeBeat = spec.beats.find((b) => b.id === "c06")!;
    const laterBeat = spec.beats.find((b) => b.id === "c05")!;
    const input = { visible: true, grounded: true, engage: false, ownerAvailable: true,
      playerX: 32.5 * TILE * SUBS, playerY: 11 * TILE * SUBS, flags: new Set<string>() };
    let asked = false;
    for (let tick = 0; tick < 300 && !asked; tick++) {
      asked = stepStage(giraffe, homeBeat.taskIds[0], input).some((e) => e.type === "question");
    }
    expect(asked).toBe(true);
    solveStage(giraffe);
    const arrivals = [];
    for (let tick = 0; tick < homeBeat.afterSolve[0]!.ticks; tick++) {
      arrivals.push(...stepStage(giraffe, undefined, input).filter((e) => e.type === "home"));
    }
    expect(arrivals).toEqual([{ type: "home", actorId: "giraffe", flag: "giraffeHome" }]);
    const actor = giraffe.stageRuntime!.scene.actors.find((a) => a.id === "giraffe")!;
    const view = viewAt(giraffe.homeX, giraffe.homeY), before = position(actor, view);
    expect(before).toEqual({ x: 56.5 * TILE, y: 18 * TILE });
    // C06 is the chapter's last giraffe beat. Exercise a subsequent beat at
    // the reusable stage boundary; this does not claim a current C05 replay slot.
    stepStage(giraffe, laterBeat.taskIds[0], input);
    expect(giraffe.stageRuntime!.scene.ticks).toBe(1);
    const target = laterBeat.targetPositions[0]!, after = position(actor, view);
    expect(after.x).toBeCloseTo(before.x + (view.x + target.x * view.width - before.x) / laterBeat.moveTicks, 8);
    expect(after.y).toBeCloseTo(before.y + (view.y + target.y * view.height - before.y) / laterBeat.moveTicks, 8);
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(7);
  });
});
