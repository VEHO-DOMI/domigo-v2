// CODEX DRAFT — NOT CANON
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { describe, it, expect } from "vitest";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { stageV2LawErrors } from "./stage-v2-laws.ts";
import { newChapterLearning } from "./learning.ts";
import type { PaintLevel } from "./level.ts";
import { StageV2, SequenceTransfer } from "../../content-schema/src/paint-zoo.ts";
const level = readZooJson("ch02.level.json") as PaintLevel;
const isolated = structuredClone(level);
isolated.phases[0]!.entities = isolated.phases[0]!.entities.filter(e => e.id === "p1-buehne-papagei");
isolated.phases[0]!.entities[0]!.params!.hidden = false;
const cfg = (learning = newChapterLearning()) => ({ level: isolated, phaseId: "p1", grantedAbilities: () => ["jump", "hang", "run", "punch"], freedCageIds: () => [], learningProgress: learning });
const askEvents = (sim: Sim, n: number, solve = true): string[] => {
  const asked: string[] = [];
  const handle = (events: SimEvent[]) => {
    for (const e of events)
      if (e.type === "task") {
        if ("taskId" in e.req.ctx && e.req.ctx.taskId)
          asked.push(e.req.ctx.taskId);
        if (solve)
          handle(sim.solveTask(e.req.ctx));
      }
  };
  for (let i = 0; i < n; i++)
    handle(sim.step(IDLE_PAD));
  return asked;
};
describe("M-1 group-owned witnessed scenes", () => {
  it("does not advance before the observer; car west cannot start car east", () => {
    const sim = new Sim(cfg());
    const car = sim.world.entities.find(e => e.id === "p1-buehne-papagei")!;
    askEvents(sim, 180);
    expect(car.stageRuntime!.scene.ticks).toBe(0);
    sim.warp(14, 10);
    const first = askEvents(sim, 800);
    expect(first).toEqual(["g1.paint.ch02.a07", "g1.paint.ch02.a08", "g1.paint.ch02.a09"]);
    const stopped = car.stageRuntime!.scene.ticks;
    expect(askEvents(sim, 300)).toEqual([]);
    expect(car.stageRuntime!.scene.ticks).toBe(stopped);
    sim.warp(22, 10);
    expect(askEvents(sim, 650)).toEqual(["g1.paint.ch02.a10", "g1.paint.ch02.a12"]);
    expect(sim.completedSequences.has(car.id)).toBe(true);
  });
  it("pauses an unseen active beat and keeps a dismissed beat and chapter progress over remount", () => {
    const learning = newChapterLearning();
    let sim = new Sim(cfg(learning));
    sim.warp(14, 10);
    askEvents(sim, 30);
    const car = sim.world.entities.find(e => e.id === "p1-buehne-papagei")!;
    const ticks = car.stageRuntime!.scene.ticks;
    sim.warp(2, 17);
    askEvents(sim, 150);
    expect(car.stageRuntime!.scene.ticks).toBe(ticks);
    sim.warp(14, 10);
    askEvents(sim, 210, false);
    expect(sim.activeTask).not.toBe(null);
    sim.dismissTask(sim.activeTask!.ctx);
    const packed = JSON.parse(JSON.stringify(learning));
    sim = new Sim(cfg(packed));
    sim.warp(14, 10);
    const req = sim.step({ ...IDLE_PAD, up: true }).find((e): e is Extract<SimEvent, {
      type: "task";
    }> => e.type === "task");
    expect(req?.req.sceneSnapshot?.beatId).toBe("a07");
    expect(sim.solvedTaskIds.size).toBe(0);
  });
  it("roundtrips every scene/transfer; missing observer floor, actor and task binding fail even in draft", () => {
    for (const ph of [...level.phases, level.arena!])
      for (const e of ph.entities) {
        if (e.params?.stageV2)
          expect(StageV2.parse(e.params.stageV2)).toEqual(e.params.stageV2);
        if (e.params?.onSequenceComplete)
          expect(SequenceTransfer.parse(e.params.onSequenceComplete)).toEqual(e.params.onSequenceComplete);
      }
    expect(stageV2LawErrors(level)).toEqual([]);
    for (const tamper of ["floor", "actor", "card"]) {
      const broken = structuredClone(level), ph = broken.phases[0]!, car = ph.entities.find(e => e.id === "p1-buehne-papagei")!;
      if (tamper === "floor")
        ph.rows[11] = ph.rows[11]!.slice(0, 14) + "." + ph.rows[11]!.slice(15);
      if (tamper === "actor")
        car.params!.stageV2!.actors[0]!.id = "missing";
      if (tamper === "card")
        car.params!.stageV2!.beats[0]!.taskIds = ["wrong-task"];
      expect(stageV2LawErrors(broken).length, tamper).toBeGreaterThan(0);
    }
  });
  it("transfers one visible penguin, saves its route mid-walk and unlocks Buddy only on arrival", () => {
    const transferLevel = structuredClone(level);
    transferLevel.phases[0]!.entities = transferLevel.phases[0]!.entities.filter(e => ["p1-pinguin", "p1-buehne-buddy"].includes(e.id));
    const learning = newChapterLearning();
    let sim = new Sim({ ...cfg(learning), level: transferLevel });
    sim.warp(48, 17);
    sim.step(IDLE_PAD);
    const request = sim.step({ ...IDLE_PAD, up: true }).find((e): e is Extract<SimEvent, {
      type: "task";
    }> => e.type === "task")!;
    expect(request.req.ctx.type).toBe("entity");
    sim.solveTask(request.req.ctx);
    const source = sim.world.entities.find(e => e.id === "p1-pinguin")!;
    const x = source.x;
    for (let i = 0; i < 10; i++)
      sim.step(IDLE_PAD);
    expect(source.hidden).toBe(false);
    expect(source.x).toBe(x);
    expect(sim.arrivalFlags.has("penguinHome")).toBe(false);
    for (let i = 0; i < 200 && learning.transfers[0]!.tick < 30; i++)
      sim.step(IDLE_PAD);
    expect(source.hidden).toBe(true);
    const saved = JSON.parse(JSON.stringify(learning)), midpoint = saved.transfers[0].x;
    sim = new Sim({ ...cfg(saved), level: transferLevel });
    sim.warp(48, 17);
    expect(sim.learning.transfers[0]!.x).toBe(midpoint);
    let arrivals = 0;
    for (let i = 0; i < 80; i++)
      arrivals += sim.step(IDLE_PAD).filter(e => e.type === "homeArrival").length;
    expect(arrivals).toBe(1);
    expect(sim.arrivalFlags.has("penguinHome")).toBe(true);
    expect(sim.world.entities.find(e => e.id === "p1-pinguin")!.hidden).toBe(true);
    const buddy = sim.world.entities.find(e => e.id === "p1-buehne-buddy")!;
    expect(buddy.stageRuntime!.scene.actors.find(a => a.id === "penguinHome")!.hidden).toBe(false);
  });
});
