// CODEX DRAFT — NOT CANON
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { describe, it, expect } from "vitest";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { newChapterLearning } from "./learning.ts";
import { requestedTask } from "./cards/routing.ts";
import { optionalSequenceSlots } from "./sequences.ts";
import { GameTaskV2, renderTaskText, SceneSnapshot } from "@domigo/content-schema";
import { TaskSequenceV2 } from "../../content-schema/src/paint-zoo.ts";
import type { PaintLevel } from "./level.ts";
const level = readZooJson("ch02.level.json") as PaintLevel;
const tasks = readZooJson("ch02.tasks.v2.json").items as GameTaskV2[];
const reqOf = (events: SimEvent[]) => events.find((e): e is Extract<SimEvent, {
  type: "task";
}> => e.type === "task")?.req;
const isolated = (id: string) => {
  const l = structuredClone(level); for (const ph of l.phases)
    ph.entities = ph.entities.filter(e => e.id === id); return l;
};
const config = (l: PaintLevel, phaseId = "p1", learning = newChapterLearning()) => ({ level: l, phaseId, tasks, learningProgress: learning, grantedAbilities: () => ["jump", "run", "hang", "punch"], freedCageIds: () => [], cageHintShown: () => true });
describe("M-2 exact, persistent task places", () => {
  it("keeps a half-open cage over dismissal, ink return and a serialized bonus trip; duplicates cannot skip a card", () => {
    const learning = newChapterLearning(), l = isolated("p1-cage2");
    let sim = new Sim(config(l, "p1", learning));
    sim.warp(11, 10);
    sim.step(IDLE_PAD);
    const first = reqOf(sim.step({ ...IDLE_PAD, up: true }))!;
    expect(first.ctx).toMatchObject({ taskId: "g1.paint.ch02.a15" });
    sim.solveTask({ ...first.ctx, taskId: "g1.paint.ch02.a16" } as TaskRequest["ctx"]);
    expect(sim.solvedTaskIds.size).toBe(0);
    const second = reqOf(sim.solveTask(first.ctx))!;
    expect(second.ctx).toMatchObject({ taskId: "g1.paint.ch02.a16" });
    expect(sim.completedSequences.size).toBe(0);
    expect(sim.solveTask(first.ctx)).toEqual([]);
    sim.dismissTask(second.ctx);
    sim.warp(2, 17);
    sim.step(IDLE_PAD);
    new Sim(config(l, "p9", learning)).step(IDLE_PAD);
    sim = new Sim(config(l, "p1", JSON.parse(JSON.stringify(learning))));
    sim.warp(11, 10);
    sim.step(IDLE_PAD);
    const again = reqOf(sim.step({ ...IDLE_PAD, up: true }))!;
    expect(again.ctx).toMatchObject({ taskId: "g1.paint.ch02.a16" });
    expect(sim.solveTask(again.ctx).filter(e => e.type === "cageFreed")).toHaveLength(1);
    expect(sim.solveTask(again.ctx)).toEqual([]);
    expect(sim.completedSequences.has("p1-cage2")).toBe(true);
  });
  it("refuses a forged completion at the exit and names a waiting figure", () => {
    const sim = new Sim(config(level));
    for (const id of (sim.phase.exitRequires!.sequences ?? []))
      sim.completedSequences.add(id);
    for (const id of (sim.phase.exitRequires!.rides ?? []))
      sim.completedRides.add(id);
    for (const e of sim.world.entities)
      if (e.role === "powerup")
        e.redeemed = true;
    for (const e of sim.world.entities)
      if (e.role === "door.trigger")
        sim.doorSolved.add(e.id);
    sim.warp(61, 17);
    const ev = Array.from({ length: 8 }, () => sim.step(IDLE_PAD)).flat();
    expect(ev.some(e => e.type === "exit")).toBe(false);
    expect(ev.some(e => e.type === "toast" && e.msg === "Im Käfig braucht dich noch jemand.")).toBe(true);
  });
  it("actually serves all sixteen variants by ↑ through the same bound router; optional slots never create required places", () => {
    const served: string[] = [];
    for (const ph of level.phases)
      for (const spec of ph.entities) {
        const seq = spec.params?.taskSequenceV2;
        if (!seq)
          continue;
        expect(TaskSequenceV2.parse(seq)).toEqual(seq);
        for (const variant of seq.variantIds) {
          const learning = newChapterLearning();
          learning.solvedTaskIds = [...seq.requiredIds];
          learning.completedSequences = [spec.id];
          learning.flags = [...new Set(ph.entities.flatMap(e => e.params?.stageV2?.groups.flatMap(g => [g.id, ...g.requires]) ?? []))];
          learning.optionalCursors[spec.id] = optionalSequenceSlots(seq).findIndex(s => s.taskId === variant);
          const sim = new Sim(config(isolated(spec.id), ph.id, learning)), e = sim.world.entities[0]!;
          e.hidden = false;
          e.redeemed = true;
          e.friendly = true;
          e.state = e.stageRuntime ? "complete" : "rest";
          const beat = e.params.stageV2?.beats.find(b => b.taskIds.includes(variant));
          const observer = beat ? e.params.stageV2!.groups.find(g => g.id === beat.groupId)!.observer : e.params.encounterObserver ?? spec;
          sim.warp(observer.c, observer.r);
          sim.step(IDLE_PAD);
          let req = reqOf(sim.step({ ...IDLE_PAD, up: true }));
          for (let i = 0; i < 450 && !req; i++)
            req = reqOf(sim.step(IDLE_PAD));
          expect(req, variant).toBeDefined();
          expect(requestedTask(tasks, req!, ph.id)?.id).toBe(variant);
          expect(req!.ctx).toMatchObject({ optionalSlotId: `variant:${variant}` });
          sim.solveTask(req!.ctx);
          expect(seq.requiredIds).not.toContain(variant);
          served.push(variant);
        }
      }
    expect(new Set(served).size).toBe(16);
  });
  it("roundtrips a frozen view; card, projection and router reject missing or exchanged scene data", () => {
    const l = isolated("p1-buehne-papagei"), sim = new Sim(config(l));
    sim.world.entities[0]!.hidden = false;
    sim.warp(14, 10);
    let req: TaskRequest | undefined;
    for (let i = 0; i < 250 && !req; i++)
      req = reqOf(sim.step(IDLE_PAD));
    const task = requestedTask(tasks, req!, "p1")!, snapshot = req!.sceneSnapshot!;
    expect(SceneSnapshot.parse(snapshot)).toEqual(snapshot);
    const scene = GameTaskV2.parse({ ...task, stimulus: { type: "scene", altDe: "Die eben beobachtete Szene.", viewId: snapshot.viewId } });
    expect(renderTaskText(scene, snapshot)).toContain(snapshot.actors[0]!.skin);
    expect(() => renderTaskText(scene)).toThrow(/snapshot/);
    expect(() => requestedTask(tasks, { ...req!, sceneSnapshot: { ...snapshot, beatId: "wrong" } }, "p1")).toThrow(/matching/);
    const x = sim.activeTask!.sceneSnapshot!.actors[0]!.x;
    snapshot.actors[0]!.x = 999;
    expect(sim.activeTask!.sceneSnapshot!.actors[0]!.x).toBe(x);
    expect(GameTaskV2.safeParse({ ...scene, sceneRef: { ...scene.sceneRef, viewId: "wrong" } }).success).toBe(false);
  });
});
