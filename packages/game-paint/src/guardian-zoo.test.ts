// CODEX DRAFT — NOT CANON
import { describe, it, expect } from "vitest";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { spawnEntities, stepEntities, type WorldInput } from "./entities.ts";
import { solveZooTask } from "./guardian-zoo.ts";
import { ZooGuardian, StageV2 } from "../../content-schema/src/paint-zoo.ts";
import { zooEvidenceRect, ZOO_LION_CELLS } from "./zoo-art.ts";
import { guardianSkinStems } from "./artManifest.ts";
import type { PaintLevel } from "./level.ts";
const level = readZooJson("ch02.level.json") as PaintLevel;
const phase = level.arena!;
const def = phase.entities.find(e => e.role === "guardian")!;
const inp = (more: Partial<WorldInput> = {}): WorldInput => ({ playerX: 12 * TILE * SUBS, playerY: 18 * TILE * SUBS, playerIframes: 999, playerOverlayOpen: false, fist: null, ...more });
describe("M-3 grounded zoo lion", () => {
  it("executes four real plate returns, two ordered windows per release, four arrivals and one invitation", () => {
    const w = spawnEntities([structuredClone(def)], []);
    const g = w.entities[0]!;
    const tasks: string[] = [], homes: string[] = [], rounds: number[] = [], deflects: number[] = [];
    const states = new Set<string>();
    let victory = 0;
    let groundedReturn = false;
    for (let t = 0; t < 5000 && !victory; t++) {
      states.add(g.state);
      const plate = w.projectiles.find(p => p.kind === "plate" && !p.deflected && (!p.groundReturn || p.grounded));
      if (plate?.grounded)
        groundedReturn = true;
      const evs = stepEntities(w, phase.rows, inp({ fist: plate ? { active: true, x: plate.x, y: plate.y } : null }));
      expect(g.y).toBe(18 * TILE * SUBS);
      for (const ev of evs) {
        if (ev.type === "projectileDeflected")
          deflects.push(ev.id);
        if (ev.type === "zooRound")
          rounds.push(ev.round);
        if (ev.type === "zooHome")
          homes.push(ev.actorId);
        if (ev.type === "guardianDown")
          victory++;
        if (ev.type === "zooQuestion") {
          expect(g.zoo!.scene.ticks).toBeGreaterThanOrEqual(90);
          const before = w.guardianKnots;
          expect(solveZooTask(g, "wrong-card")).toBe(false); // tamper: no card substitution
          expect(solveZooTask(g, ev.taskId)).toBe(true);
          expect(solveZooTask(g, ev.taskId)).toBe(false); // tamper: duplicate success
          expect(w.guardianKnots).toBe(before); // neither answer itself releases the plate
          tasks.push(ev.taskId);
        }
      }
    }
    expect(tasks).toEqual(def.params!.taskSequenceV2!.requiredIds);
    expect(homes).toEqual(["parrot", "monkeys", "penguin", "giraffe"]);
    expect(rounds).toEqual([1, 2, 3, 4]);
    expect(deflects).toHaveLength(4);
    expect(groundedReturn).toBe(true);
    expect(victory).toBe(1);
    expect([...states]).toEqual(expect.arrayContaining(["prowl", "mark", "cast", "returned", "observe", "release", "home", "lonely", "welcomed"]));
    for (let t = 0; t < 200; t++)
      expect(stepEntities(w, phase.rows, inp()).filter(e => e.type === "guardianDown")).toEqual([]);
  });
  it("does not accept a chalk return, contact, a single answer, or a fabricated finale as victory", () => {
    const w = spawnEntities([structuredClone(def)], []);
    const g = w.entities[0]!;
    stepEntities(w, phase.rows, inp());
    expect(solveZooTask(g, def.params!.guardian!.finaleTaskId)).toBe(false);
    w.projectiles.push({ id: 99, kind: "chalk", x: g.x, y: g.y - 20 * SUBS, vx: 0, vy: 0, deflected: true, fromId: g.id, dead: false, age: 0, colour: "red" });
    stepEntities(w, phase.rows, inp());
    expect(g.state).toBe("prowl");
    expect(g.zoo!.deflects).toBe(0);
    expect(g.zoo!.homes).toEqual([]);
  });
  it("routes a real Sim question with a frozen picture and preserves its window on dismissal", () => {
    const sim = new Sim({ level, phaseId: "p4", grantedAbilities: () => ["jump", "run", "punch", "hang"], freedCageIds: () => [] });
    sim.warp(12, 17);
    let req: TaskRequest | undefined;
    for (let t = 0; t < 1000 && !req; t++) {
      const p = sim.world.projectiles.find(p => p.kind === "plate" && !p.deflected);
      if (p)
        sim.fist = { active: true, x: p.x, y: p.y, dir: 1, vSubs: 0, travelLeftSubs: 999999, returning: false, charge: 0 };
      const events = sim.step(IDLE_PAD);
      req = events.find((e): e is Extract<SimEvent, {
        type: "task";
      }> => e.type === "task")?.req;
    }
    expect(req?.ctx.type).toBe("guardian");
    expect(req?.sceneSnapshot?.beatId).toBe("d01");
    const before = structuredClone(req!.sceneSnapshot);
    sim.dismissTask(req!.ctx);
    expect(sim.solvedTaskIds.size).toBe(0);
    sim.step({ ...IDLE_PAD, up: true });
    const result = sim.solveTask(req!.ctx);
    expect(result.some(e => e.type === "taskSolved")).toBe(true);
    sim.solveTask(req!.ctx);
    expect(sim.solvedTaskIds.size).toBe(1);
    expect(req!.sceneSnapshot).toEqual(before);
  });
  it("roundtrips the complete contract and rejects shortened warnings or a missing second card", () => {
    expect(ZooGuardian.parse(def.params!.guardian)).toEqual(def.params!.guardian);
    expect(StageV2.parse(def.params!.stageV2)).toEqual(def.params!.stageV2);
    const broken = structuredClone(def.params!.guardian!);
    broken.telegraphTicks[1] = 1;
    expect(ZooGuardian.safeParse(broken).success).toBe(false);
    expect(ZooGuardian.safeParse({ ...def.params!.guardian, rounds: [{ ...def.params!.guardian!.rounds[0], taskIds: ["only-one"] }, ...def.params!.guardian!.rounds.slice(1)] }).success).toBe(false);
    expect(guardianSkinStems("loewe", "zoo-lion")).toEqual(ZOO_LION_CELLS.map(c => `loewe_${c}`));
  });
  it("moves evidence with the sign's registered rectangle, never with the lion body", () => {
    const stage = structuredClone(def.params!.stageV2!);
    const g = def.params!.guardian!;
    const before = zooEvidenceRect(g, stage);
    stage.props.find(p => p.id === g.evidencePropId)!.worldAnchor!.c += 3;
    expect(zooEvidenceRect(g, stage).x).toBe(before.x + 3 * TILE);
  });
});
