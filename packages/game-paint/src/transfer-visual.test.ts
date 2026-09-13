// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { newChapterLearning } from "./learning.ts";
import { transferDrawItem } from "./transfer-visual.ts";
import { phaseArtScope, phaseRequiredStems } from "./artScope.ts";
import { sceneDrawItems, worldSceneSnapshot } from "./scene-v2.ts";
import type { PaintLevel } from "./level.ts";

const original = readZooJson("ch02.level.json") as PaintLevel;
const config = { grantedAbilities: () => ["jump", "hang", "run", "punch"], freedCageIds: () => [] };
const request = (events: SimEvent[]) => events.find(e => e.type === "task");

describe("painted transfers keep the real body's identity and route", () => {
  it("uses the penguin walk cell across save/resume and hands off once to the same home body", () => {
    const level = structuredClone(original);
    level.phases[0]!.entities = level.phases[0]!.entities.filter(e => ["p1-pinguin", "p1-buehne-buddy"].includes(e.id));
    let sim = new Sim({ ...config, level, phaseId: "p1", learningProgress: newChapterLearning() });
    sim.warp(48, 17);
    const task = request(sim.step(IDLE_PAD)) ?? request(sim.step({ ...IDLE_PAD, up: true }));
    expect(task?.req.ctx).toMatchObject({ id: "p1-pinguin" });
    sim.solveTask(task!.req.ctx);
    let transfer = sim.learning.transfers[0]!;
    let target = sim.world.entities.find(e => e.id === transfer.targetId)!;
    expect(transferDrawItem(transfer, target)).toBeNull();
    for (let n = 0; n < 200 && transfer.tick < 30; n++) sim.step(IDLE_PAD);
    expect(transfer.tick).toBe(30);
    const item = transferDrawItem(transfer, target)!;
    expect(item).toMatchObject({ stem: "pinguin_walk0", x: transfer.x, y: transfer.y });
    expect(item.h).toBe(target.stageRuntime!.scene.actors.find(a => a.id === transfer.actorId)!.displayHeightPx);
    expect(phaseRequiredStems(level, "p1").has(item.stem)).toBe(true);
    expect(phaseArtScope(level, "p1", []).has(item.stem)).toBe(true);
    expect(transferDrawItem(transfer, undefined)).toBeNull();
    const saved = JSON.parse(JSON.stringify(sim.learning));
    sim = new Sim({ ...config, level, phaseId: "p1", learningProgress: saved });
    sim.warp(48, 17);
    transfer = sim.learning.transfers[0]!;
    target = sim.world.entities.find(e => e.id === transfer.targetId)!;
    expect(transferDrawItem(transfer, target)).toEqual(item);
    let arrivals = 0;
    for (let n = 0; n < 80; n++) arrivals += sim.step(IDLE_PAD).filter(e => e.type === "homeArrival").length;
    expect(arrivals).toBe(1);
    expect(transferDrawItem(transfer, target)).toBeNull();
    const picture = worldSceneSnapshot(target.id, target.homeX, target.homeY, target.stageRuntime!.scene, target.params.stageV2!);
    const home = sceneDrawItems(picture).filter(i => i.id === "penguinHome:0");
    expect(home).toHaveLength(1);
    expect(home[0]).toMatchObject({ stem: "pinguin_a", x: transfer.x, y: transfer.y, h: item.h });
  });
});

// CODEX DRAFT — NOT CANON
// Append to codex-trial-transfer-visual.test.ts. Reuses its existing imports,
// original/config/request. These three imports are additional, not replacements.
import { entDisplayH } from "./anim.ts";
import { SUBS, TILE } from "./paint.ts";
import { zooEntityCell } from "./zoo-visuals.ts";

const transferIsolated = (phaseId: string, ids: string[]): PaintLevel => {
  const level = structuredClone(original);
  const phase = level.phases.find(p => p.id === phaseId)!;
  phase.entities = phase.entities.filter(e => ids.includes(e.id));
  return level;
};

describe("train identity survives its real cage sequence and older saves", () => {
  it.each(["current", "train", "zug"])("draws a resumed %s transfer as the actual destination train", legacySkin => {
    const level = transferIsolated("p2", ["p2-cage-zug", "p2-zug"]);
    let sim = new Sim({ ...config, level, phaseId: "p2", learningProgress: newChapterLearning(), cageHintShown: () => true });
    sim.warp(32, 10);
    let first = request(sim.step(IDLE_PAD));
    first ??= request(sim.step({ ...IDLE_PAD, up: true }));
    expect(first?.req.ctx).toMatchObject({ type: "cage", id: "p2-cage-zug", taskId: "g1.paint.ch02.b18" });
    const second = request(sim.solveTask(first!.req.ctx));
    expect(second?.req.ctx).toMatchObject({ type: "cage", id: "p2-cage-zug", taskId: "g1.paint.ch02.b19" });
    expect(sim.learning.transfers).toHaveLength(0);
    expect(sim.solveTask(second!.req.ctx).filter(e => e.type === "cageFreed")).toHaveLength(1);
    expect(sim.completedSequences.has("p2-cage-zug")).toBe(true);
    expect(sim.learning.transfers).toHaveLength(1);
    let transfer = sim.learning.transfers[0]!;
    let target = sim.world.entities.find(e => e.id === "p2-zug")!;
    expect(transfer.skin).toBe("zoozug"); // Actual captive key is "train", destination skin is "zoozug".
    expect(transferDrawItem(transfer, target)).toBeNull();
    const frames = new Set<string>();
    for (let tick = 0; tick < 500 && transfer.tick < 90; tick++) {
      sim.step(IDLE_PAD);
      const item = transferDrawItem(transfer, target);
      if (item) frames.add(item.stem);
    }
    expect(transfer.tick).toBe(90);
    expect(frames).toEqual(new Set(["zoozug_a", "zoozug_b"]));
    expect(transferDrawItem(transfer, target)).toMatchObject({ x: 34 * TILE, y: 14.5 * TILE, w: 40, h: 10 });
    const saved = JSON.parse(JSON.stringify(sim.learning));
    // Model an actual pre-fix save, without changing the frozen fixture or forging task completion.
    if (legacySkin !== "current") saved.transfers[0].skin = legacySkin;
    sim = new Sim({ ...config, level, phaseId: "p2", learningProgress: saved, cageHintShown: () => true });
    sim.warp(32, 10);
    transfer = sim.learning.transfers[0]!;
    target = sim.world.entities.find(e => e.id === "p2-zug")!;
    const resumed = transferDrawItem(transfer, target)!;
    expect(resumed).toMatchObject({ x: 34 * TILE, y: 14.5 * TILE, w: 40, h: 10 });
    expect(resumed.stem).toMatch(/^zoozug_[ab]$/);
    expect(phaseRequiredStems(level, "p2").has(resumed.stem)).toBe(true);
    expect(phaseArtScope(level, "p2", []).has(resumed.stem)).toBe(true);
    let arrivals = 0;
    for (let tick = 0; tick < 150; tick++) {
      arrivals += sim.step(IDLE_PAD).filter(e => e.type === "homeArrival" && e.entityId === "p2-zug").length;
    }
    expect(arrivals).toBe(1);
    expect(sim.arrivalFlags.has("trainReady")).toBe(true);
    expect(transferDrawItem(transfer, target)).toBeNull();
    expect(target.hidden).toBe(false);
    expect({ x: target.x / SUBS, y: target.y / SUBS }).toEqual({ x: 58.5 * TILE, y: 18 * TILE });
    // These are the normal platform renderer's existing width/height, after the transfer ends.
    expect(entDisplayH(target)).toBe(resumed.h);
    expect(target.params.ride!.deckWidthPx).toBe(resumed.w);
    expect(`${target.skin}_${zooEntityCell(target)}`).toBe("zoozug_wait");
  });
});

describe("dog transport uses the actual lower route and arrival body", () => {
  it("keeps the travelled position over resume and hands the same body to the bus scene", () => {
    const level = transferIsolated("p2", ["p2-hund", "p2-buehne-bus"]);
    let sim = new Sim({ ...config, level, phaseId: "p2", learningProgress: newChapterLearning() });
    sim.warp(18, 17);
    let first = request(sim.step(IDLE_PAD));
    first ??= request(sim.step({ ...IDLE_PAD, up: true }));
    expect(first?.req.ctx).toMatchObject({ id: "p2-hund", taskId: "g1.paint.ch02.b05" });
    sim.solveTask(first!.req.ctx);
    let transfer = sim.learning.transfers[0]!;
    let target = sim.world.entities.find(e => e.id === transfer.targetId)!;
    for (let tick = 0; tick < 500 && transfer.tick < 90; tick++) sim.step(IDLE_PAD);
    expect(transfer.tick).toBe(90);
    const travelling = transferDrawItem(transfer, target)!;
    // The actual fixture route goes down to row 21 before travelling east.
    expect(travelling).toMatchObject({ x: 22 * TILE, y: 22 * TILE, h: 36 });
    expect(travelling.stem).toMatch(/^hund_walk[0-3]$/);
    expect(phaseRequiredStems(level, "p2").has(travelling.stem)).toBe(true);
    expect(phaseArtScope(level, "p2", []).has(travelling.stem)).toBe(true);
    const saved = JSON.parse(JSON.stringify(sim.learning));
    sim = new Sim({ ...config, level, phaseId: "p2", learningProgress: saved });
    sim.warp(18, 17);
    transfer = sim.learning.transfers[0]!;
    target = sim.world.entities.find(e => e.id === transfer.targetId)!;
    expect(transferDrawItem(transfer, target)).toEqual(travelling);
    let arrivals = 0;
    for (let tick = 0; tick < 80; tick++) {
      arrivals += sim.step(IDLE_PAD).filter(e => e.type === "homeArrival" && e.actorId === "dog").length;
    }
    expect(arrivals).toBe(1);
    expect(transferDrawItem(transfer, target)).toBeNull();
    const snapshot = worldSceneSnapshot(target.id, target.homeX, target.homeY, target.stageRuntime!.scene, target.params.stageV2!);
    const bodies = sceneDrawItems(snapshot).filter(item => item.id === "dog:0");
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ stem: "hund_a", x: 32.5 * TILE, y: 22 * TILE, h: travelling.h, w: travelling.w });
    // Source height is 24 in the unchanged fixture, destination 36. This existing
    // content mismatch is deliberately not hidden by altering fixture dimensions.
  });
});

describe("the dynamically created Fenn friends have mandatory loadable pictures", () => {
  it("requires and scopes both waiting and walking pictures even with an empty disk inventory", () => {
    const level = transferIsolated("p2", ["p2-fenn"]);
    expect(level.phases.find(p => p.id === "p2")!.entities).toHaveLength(1);
    for (const stem of ["besucherkinder_wave_a", "besucherkinder_walk0"]) {
      expect(phaseRequiredStems(level, "p2").has(stem), stem).toBe(true);
      expect(phaseArtScope(level, "p2", []).has(stem), stem).toBe(true);
    }
    // Control: the names must be required because of the classmate, not globally in every room.
    level.phases.find(p => p.id === "p2")!.entities = [];
    for (const stem of ["besucherkinder_wave_a", "besucherkinder_walk0"]) {
      expect(phaseRequiredStems(level, "p2").has(stem), stem).toBe(false);
      expect(phaseArtScope(level, "p2", []).has(stem), stem).toBe(false);
    }
  });
});
