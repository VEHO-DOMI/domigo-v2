// CODEX DRAFT — NOT CANON · no changes to simulation positions or authored card keys.
import React from "react";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { SceneCutout } from "./cards/SceneCutout.tsx";
import { sceneCutoutBounds } from "./scene-bounds.ts";
import { sceneDrawItems, createSceneState, beginSceneBeat, stepSceneBeat, snapshotScene, type SceneSnapshot } from "./scene-v2.ts";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import type { PaintLevel } from "./level.ts";
import { StageV2 } from "../../content-schema/src/paint-zoo.ts";
const { renderToStaticMarkup } = createRequire(new URL("../../../apps/web/package.json", import.meta.url))("react-dom/server") as {
  renderToStaticMarkup: (node: React.ReactNode) => string;
};
const base = readZooJson("ch02.level.json") as PaintLevel;
const markup = (snapshot: SceneSnapshot) => renderToStaticMarkup(React.createElement(SceneCutout, { snapshot }));
const renderedBounds = (snapshot: SceneSnapshot) => {
  const numbers = /viewBox="([^"]+)"/.exec(markup(snapshot))![1]!.split(" ").map(Number);
  return { x: numbers[0]!, y: numbers[1]!, width: numbers[2]!, height: numbers[3]! };
};
const expectContained = (snapshot: SceneSnapshot) => {
  const b = renderedBounds(snapshot);
  for (const p of sceneDrawItems(snapshot)) {
    expect(p.x - p.w / 2).toBeGreaterThanOrEqual(b.x + 16 - 1e-9);
    expect(p.x + p.w / 2).toBeLessThanOrEqual(b.x + b.width - 16 + 1e-9);
    expect(p.y - p.h).toBeGreaterThanOrEqual(b.y + 16 - 1e-9);
    expect(p.y).toBeLessThanOrEqual(b.y + b.height - 16 + 1e-9);
  }
};

function actualFinalePicture(): SceneSnapshot {
  const level = structuredClone(base);
  const stage = level.arena!.entities.find(e => e.params?.guardian)?.params!.stageV2!;
  stage.props.push({ id: "visitors", skin: "ch02_d09_visitors", worldAnchor: { c: 23, r: 17 }, canvas: { widthPx: 160, heightPx: 120 } });
  stage.beats.find(b => b.id === "d09")!.view = { actorIds: ["lion"], propIds: ["visitors"], fitContent: true };
  const sim = new Sim({ level, phaseId: "p4", grantedAbilities: () => ["jump", "run", "punch", "hang"], freedCageIds: () => [] });
  sim.warp(12, 17);
  // Existing guardian test input: return each real active plate with a fist at
  // its position. No fabricated rounds, homes or solved IDs; not a pupil run.
  for (let tick = 0; tick < 6500; tick++) {
    sim.player.iframes = 999;
    const plate = sim.world.projectiles.find(p => p.kind === "plate" && !p.deflected && (!p.groundReturn || p.grounded));
    if (plate) sim.fist = { active: true, x: plate.x, y: plate.y, dir: 1, vSubs: 0, travelLeftSubs: 999999, returning: false, charge: 0 };
    const req = sim.step(IDLE_PAD).find((e): e is Extract<SimEvent, { type: "task" }> => e.type === "task")?.req;
    if (!req) continue;
    if ("taskId" in req.ctx && req.ctx.taskId === "g1.paint.ch02.d09") return req.sceneSnapshot!;
    sim.solveTask(req.ctx);
  }
  throw new Error("No actual D09 request");
}

describe("card viewport contains the actual selected scene", () => {
  it("includes D09's right-hand visitors without moving the real lion or the welcome-place coordinates", () => {
    const snapshot = actualFinalePicture(), before = structuredClone(snapshot);
    const items = sceneDrawItems(snapshot);
    expect(items.find(p => p.id === "lion:0")).toMatchObject({ x: 296, y: 288, w: 41.6, h: 64 });
    expect(items.find(p => p.id === "visitors")).toMatchObject({ x: 376, y: 288, w: 160, h: 120 });
    expect(renderedBounds(snapshot)).toEqual({ x: 200, y: 152, width: 272, height: 152 });
    expectContained(snapshot);
    const bounds = renderedBounds(snapshot);
    // Group artwork is ordered at world x402–444; welcome endpoint stays360/288.
    expect(bounds.x + bounds.width - 16).toBeGreaterThanOrEqual(456);
    expect(360).toBeGreaterThan(bounds.x); expect(444).toBeLessThan(bounds.x + bounds.width);
    expect(snapshot).toEqual(before);
    expect(markup(snapshot)).toContain("max-height:240px");
    expect(markup(snapshot)).toContain("width:100%");
  });

  it.each([["p1-buehne-papagei", "a08"], ["p2-buehne-bus", "b06"]])("contains original %s actors and registered vehicle masks", (id, beatId) => {
    const def = base.phases.flatMap(p => p.entities).find(e => e.id === id)!;
    const spec = structuredClone(def.params!.stageV2!), beat = spec.beats.find(b => b.id === beatId)!;
    beat.view = { fitContent: true };
    const scene = createSceneState(spec); beginSceneBeat(scene, beat);
    for (let tick = 0; tick < beat.moveTicks; tick++) stepSceneBeat(scene, spec, beat);
    const snapshot = snapshotScene(id, 0, 0, scene, spec), before = structuredClone(snapshot);
    const masks = sceneDrawItems(snapshot).filter(p => p.kind === "prop");
    expect(masks.length).toBeGreaterThanOrEqual(3);
    expectContained(snapshot);
    expect(snapshot).toEqual(before);
  });

  it("does not expand for a deselected remote prop or a hidden actor, but does for a selected remote prop", () => {
    const def = base.phases.flatMap(p => p.entities).find(e => e.id === "p1-buehne-papagei")!;
    const spec = structuredClone(def.params!.stageV2!), beat = spec.beats.find(b => b.id === "a08")!;
    beat.view = { propIds: spec.props.map(p => p.id), fitContent: true };
    const scene = createSceneState(spec); beginSceneBeat(scene, beat);
    const shot = () => snapshotScene(def.id, 0, 0, scene, spec);
    const originalBounds = renderedBounds(shot());
    spec.props.push({ id: "remote", skin: "remote", worldAnchor: { c: 99, r: 99 } });
    scene.actors.push({ id: "hidden", skin: "giraffe", x: 0, y: 0, worldX: 5000, worldY: 5000,
      displayHeightPx: 100, cell: "a", count: 1, z: "front", hidden: true });
    expect(renderedBounds(shot())).toEqual(originalBounds);
    beat.view.propIds!.push("remote");
    expect(renderedBounds(shot()).width).toBeGreaterThan(originalBounds.width);
    expectContained(shot());
  });

  it("retains legacy bounds with far-home actors unless fitting is explicitly requested", () => {
    const snapshot: SceneSnapshot = { entityId: "legacy", beatId: "legacy", viewId: "legacy", round: 0,
      view: { x: 216, y: 168, width: 160, height: 120 }, props: [], relations: [],
      actors: [{ id: "home", skin: "pinguin", x: .5, y: .8, worldX: 1600, worldY: 288,
        displayHeightPx: 24, cell: "a", count: 1, z: "front" }] };
    const old = { x: 200, y: 152, width: 192, height: 152 };
    expect(renderedBounds(snapshot)).toEqual(old);
    snapshot.fitContent = false;
    expect(renderedBounds(snapshot)).toEqual(old);
    snapshot.fitContent = true;
    expect(renderedBounds(snapshot).width).toBeGreaterThan(1400);
    expectContained(snapshot);
    expect(snapshot.actors[0]!.worldX).toBe(1600);
  });

  it("inherits fitting per field, lets a beat opt out, and emits no new snapshot field for old content", () => {
    const spec = structuredClone(base.phases.flatMap(p => p.entities).find(e => e.id === "p1-buehne-papagei")!.params!.stageV2!);
    const beat = spec.beats[0]!, scene = createSceneState(spec); beginSceneBeat(scene, beat);
    const shot = () => snapshotScene("stage", 0, 0, scene, spec);
    expect(shot()).not.toHaveProperty("fitContent");
    spec.view = { fitContent: true };
    beat.view = { actorIds: [] };
    expect(shot().fitContent).toBe(true);
    beat.view.fitContent = false;
    expect(shot()).not.toHaveProperty("fitContent");
    scene.returning = true;
    expect(shot().fitContent).toBe(true); // home selects the stage view again
    expect(StageV2.parse(spec)).toEqual(spec);
    const bad = structuredClone(spec) as unknown as { view: { fitContent: unknown } };
    bad.view.fitContent = "yes";
    expect(StageV2.safeParse(bad).success).toBe(false);
  });

  it("retains the old padded base viewport when nothing is drawn", () => {
    const snapshot: SceneSnapshot = { entityId: "empty", beatId: "empty", viewId: "empty", round: 0,
      view: { x: 216, y: 168, width: 160, height: 120 }, actors: [], props: [], relations: [] };
    expect(renderedBounds(snapshot)).toEqual({ x: 200, y: 152, width: 192, height: 152 });
    expect(sceneCutoutBounds(snapshot, [])).toEqual(renderedBounds(snapshot));
  });
});
