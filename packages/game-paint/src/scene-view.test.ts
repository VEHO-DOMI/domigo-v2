// CODEX DRAFT — NOT CANON · presentation changes must preserve witnessed movement.
import { describe, expect, it } from "vitest";
import { StageV2, type StageV2Spec } from "../../content-schema/src/paint-zoo.ts";
import { spawnEntities } from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import type { PaintLevel } from "./level.ts";
import { restoredStageUsesHomeView, solveStage, stepStage, type StageResult } from "./stage-v2.ts";
import { beginSceneBeat, createSceneState, sceneDrawItems, sceneView, snapshotScene, worldSceneSnapshot } from "./scene-v2.ts";

const level = readZooJson("ch02.level.json") as PaintLevel;
const giraffeDef = level.phases.flatMap(p => p.entities).find(e => e.id === "p3-buehne-giraffe")!;
const original = (): StageV2Spec => structuredClone(giraffeDef.params!.stageV2!);
const illustrated = (): StageV2Spec => {
  const spec = original();
  spec.props.push({ id: "comparison", skin: "tree_comparison", anchor: { x: .5, y: .8 }, canvas: { widthPx: 160, heightPx: 120 } });
  spec.view = { propIds: ["tree"] };
  spec.beats.find(b => b.id === "c06")!.view = { actorIds: [], propIds: ["comparison"] };
  return spec;
};
const homeBeat = (spec: StageV2Spec) => spec.beats.find(b => b.id === "c06")!;
const present = (spec: StageV2Spec) => {
  const scene = createSceneState(spec);
  beginSceneBeat(scene, homeBeat(spec));
  return { scene, shot: () => snapshotScene("giraffe-stage", 0, 0, scene, spec) };
};

describe("scene presentation contracts", () => {
  it("roundtrips every unchanged zoo stage and preserves its complete observation and home snapshots", () => {
    for (const phase of [...level.phases, ...level.arena ? [level.arena] : [], ...level.bonus ? [level.bonus] : []]) {
      for (const e of phase.entities) {
        const spec = e.params?.stageV2;
        if (!spec) continue;
        expect(StageV2.parse(spec)).toEqual(spec);
        for (const beat of spec.beats) {
          const scene = createSceneState(spec);
          beginSceneBeat(scene, beat);
          for (const returning of [false, true]) {
            scene.returning = returning;
            expect(snapshotScene(e.id, 0, 0, scene, spec)).toEqual({
              entityId: e.id, beatId: beat.id, viewId: beat.viewId, round: 0,
              view: sceneView(0, 0), actors: scene.actors, props: spec.props, relations: beat.relations,
            });
          }
        }
      }
    }
  });

  it("inherits each field independently, preserves [] and uses authored draw order", () => {
    const spec = illustrated(), beat = homeBeat(spec);
    spec.actors.push({ id: "child", skin: "besucherkind", displayHeightPx: 30, anchor: { x: .2, y: .8 } });
    spec.view = { actorIds: ["child", "giraffe"], propIds: ["tree"] };
    beat.view = { actorIds: [] };
    const { shot } = present(spec);
    expect(shot().actors).toEqual([]);
    expect(shot().props.map(p => p.id)).toEqual(["tree"]);
    beat.view = { propIds: [] };
    expect(shot().actors.map(a => a.id)).toEqual(["giraffe", "child"]);
    expect(shot().props).toEqual([]);
    beat.view = {};
    expect(shot().props.map(p => p.id)).toEqual(["tree"]);
    delete beat.view;
    expect(shot().actors.map(a => a.id)).toEqual(["giraffe", "child"]);
  });

  it("selects initial stage props and isolates the frozen picture from live state and authored data", () => {
    const spec = illustrated(), scene = createSceneState(spec);
    const before = structuredClone({ spec, scene });
    const waiting = worldSceneSnapshot("g", 0, 0, scene, spec);
    expect(waiting.actors.map(a => a.id)).toEqual(["giraffe"]);
    expect(waiting.props.map(p => p.id)).toEqual(["tree"]);
    waiting.actors[0]!.x = 99; waiting.props[0]!.skin = "changed";
    expect({ spec, scene }).toEqual(before);
    beginSceneBeat(scene, homeBeat(spec));
    const observed = snapshotScene("g", 0, 0, scene, spec);
    expect(observed.actors).toEqual([]);
    expect(observed.props.map(p => p.id)).toEqual(["comparison"]);
    expect(worldSceneSnapshot("g", 0, 0, scene, spec)).toEqual(observed);
    observed.props[0]!.canvas!.widthPx = 999;
    expect(spec.props[1]!.canvas!.widthPx).toBe(160);
    expect(scene.actors.map(a => a.id)).toEqual(["giraffe"]);
  });

  it("never resurrects a hidden actor and drops relations with undrawn endpoints", () => {
    const spec = illustrated(), beat = homeBeat(spec);
    beat.view = { actorIds: ["giraffe"], propIds: [] };
    beat.relations = [{ actorId: "giraffe", propId: "tree", relation: "behind" }];
    const { scene, shot } = present(spec);
    scene.actors[0]!.hidden = true;
    expect(sceneDrawItems(shot())).toEqual([]);
    expect(shot().relations).toEqual([]);
    expect(scene.actors[0]!.hidden).toBe(true);
    expect(beat.relations).toHaveLength(1);
  });

  it.each(["stage", "beat"] as const)("accepts empty lists in the %s view", (where) => {
    const spec = illustrated();
    if (where === "stage") spec.view = { actorIds: [], propIds: [] };
    else homeBeat(spec).view = { actorIds: [], propIds: [] };
    expect(StageV2.parse(spec)).toEqual(spec);
  });

  it.each([
    ["stage", "actorIds", ["missing"], "unknown visible actor"],
    ["stage", "propIds", ["missing"], "unknown visible prop"],
    ["beat", "actorIds", ["tree"], "unknown visible actor"],
    ["beat", "propIds", ["giraffe"], "unknown visible prop"],
    ["stage", "actorIds", ["giraffe", "giraffe"], "duplicate visible identity"],
    ["stage", "propIds", ["tree", "tree"], "duplicate visible identity"],
    ["beat", "actorIds", ["giraffe", "giraffe"], "duplicate visible identity"],
    ["beat", "propIds", ["tree", "tree"], "duplicate visible identity"],
  ] as const)("rejects %s %s %j", (where, field, ids, message) => {
    const spec = illustrated();
    const view = { [field]: [...ids] };
    if (where === "stage") spec.view = view;
    else homeBeat(spec).view = view;
    const result = StageV2.safeParse(spec);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes(message))).toBe(true);
      expect(result.error.issues.some(i => i.path.includes(field))).toBe(true);
    }
  });
});

const input = () => ({ visible: true, grounded: true, engage: false, ownerAvailable: true,
  playerX: 32.5 * TILE * SUBS, playerY: 11 * TILE * SUBS, flags: new Set<string>() });
const spawn = (spec: StageV2Spec) => {
  const def = structuredClone(giraffeDef);
  def.params!.stageV2 = spec;
  return spawnEntities([def], []).entities[0]!;
};
const picture = (e: ReturnType<typeof spawn>) => worldSceneSnapshot(e.id, e.homeX, e.homeY, e.stageRuntime!.scene, e.params.stageV2!);
const reload = (e: ReturnType<typeof spawn>) => {
  const loaded = JSON.parse(JSON.stringify(e)) as typeof e;
  loaded.stageRuntime!.scene.returning = restoredStageUsesHomeView(loaded.state, loaded.stageRuntime!);
  return loaded;
};

describe("real giraffe return with a prop-only observation", () => {
  it("keeps retry, serialized return, 180-tick arrival and later movement intact", () => {
    let e = spawn(illustrated());
    const baseline = spawn(original()), liveInput = input(), baselineInput = input();
    const task = homeBeat(e.params.stageV2!).taskIds[0]!;
    let question: Extract<StageResult, { type: "question" }> | undefined;
    let askedAt = 0;
    for (let t = 1; t <= 150 && !question; t++) {
      const events = stepStage(e, task, liveInput);
      const oldEvents = stepStage(baseline, task, baselineInput);
      expect(events.map(ev => ev.type)).toEqual(oldEvents.map(ev => ev.type));
      question = events.find((ev): ev is Extract<StageResult, { type: "question" }> => ev.type === "question");
      askedAt = t;
    }
    expect(askedAt).toBe(105);
    expect(question?.snapshot.actors).toEqual([]);
    expect(question?.snapshot.props.map(p => p.id)).toEqual(["comparison"]);
    expect(picture(e)).toEqual(question!.snapshot);
    const motionAtAsk = structuredClone(e.stageRuntime!.scene.actors);
    e = reload(e); e.stageRuntime!.retry = true;
    expect(e.stageRuntime!.scene.returning).toBe(false);
    expect(stepStage(e, task, liveInput)).toEqual([]);
    const retry = stepStage(e, task, { ...liveInput, engage: true });
    expect(retry).toEqual([question]);
    expect(e.stageRuntime!.scene.actors).toEqual(motionAtAsk);
    solveStage(e); solveStage(baseline);
    expect(picture(e).actors.map(a => a.id)).toEqual(["giraffe"]);
    expect(picture(e).props.map(p => p.id)).toEqual(["tree"]);
    expect(e.stageRuntime!.scene.returning).toBe(true);
    const arrivals: { tick: number; event: StageResult }[] = [];
    for (let tick = 1; tick <= 180; tick++) {
      const events = stepStage(e, undefined, liveInput);
      const oldEvents = stepStage(baseline, undefined, baselineInput);
      expect(events).toEqual(oldEvents);
      expect(e.stageRuntime!.scene.actors).toEqual(baseline.stageRuntime!.scene.actors);
      const drawn = sceneDrawItems(picture(e)).find(p => p.id === "giraffe:0")!;
      const actor = e.stageRuntime!.scene.actors[0]!;
      expect(drawn).toBeDefined();
      expect({ x: drawn.x, y: drawn.y }).toEqual({ x: actor.worldX, y: actor.worldY });
      arrivals.push(...events.filter(ev => ev.type === "home").map(event => ({ tick, event })));
      if (tick === 90) e = reload(e);
    }
    expect(arrivals).toEqual([{ tick: 180, event: { type: "home", actorId: "giraffe", flag: "giraffeHome" } }]);
    expect(e.state).toBe("waiting");
    e = reload(e);
    expect(e.stageRuntime!.scene.returning).toBe(true);
    expect(sceneDrawItems(picture(e)).find(p => p.id === "giraffe:0")).toMatchObject({ x: 56.5 * TILE, y: 18 * TILE });
    expect(stepStage(e, undefined, liveInput)).toEqual([{ type: "complete" }]);
    e = reload(e);
    expect(picture(e).actors.map(a => a.id)).toEqual(["giraffe"]);
    const before = { x: e.stageRuntime!.scene.actors[0]!.worldX!, y: e.stageRuntime!.scene.actors[0]!.worldY! };
    // Reusable next-beat boundary, not a claim that C05 is a current replay slot.
    const later = e.params.stageV2!.beats.find(b => b.id === "c05")!;
    later.view = { propIds: [] };
    stepStage(e, later.taskIds[0], liveInput);
    expect(e.stageRuntime!.scene.returning).toBe(false);
    expect(e.stageRuntime!.scene.ticks).toBe(1);
    expect(picture(e).props).toEqual([]);
    const after = sceneDrawItems(picture(e)).find(p => p.id === "giraffe:0")!;
    const target = later.targetPositions[0]!, view = sceneView(e.homeX, e.homeY);
    expect(after.x).toBeCloseTo(before.x + (view.x + target.x * view.width - before.x) / later.moveTicks, 8);
    expect(after.y).toBeCloseTo(before.y + (view.y + target.y * view.height - before.y) / later.moveTicks, 8);
  });

  it("normalizes legacy saves from lifecycle evidence without mutating their data", () => {
    const e = spawn(illustrated());
    stepStage(e, homeBeat(e.params.stageV2!).taskIds[0], input());
    const r = e.stageRuntime!;
    r.scene.returning = false;
    for (const state of ["returning", "complete"]) expect(restoredStageUsesHomeView(state, r)).toBe(true);
    expect(restoredStageUsesHomeView("waiting", r)).toBe(false);
    r.scene.returnTicks = 1;
    expect(restoredStageUsesHomeView("waiting", r)).toBe(true);
    r.scene.returnTicks = 0; r.completedBeats.push("c06");
    expect(restoredStageUsesHomeView("waiting", r)).toBe(true);
    r.scene.returning = true;
    const saved = structuredClone(r);
    for (const state of ["moving", "observing", "asking"]) expect(restoredStageUsesHomeView(state, r)).toBe(false);
    expect(r).toEqual(saved);
    r.completedBeats = ["unrelated-old-beat"]; r.scene.returning = false;
    expect(restoredStageUsesHomeView("waiting", r)).toBe(false);
  });
});
