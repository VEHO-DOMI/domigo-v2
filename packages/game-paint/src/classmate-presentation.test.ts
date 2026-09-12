// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { ClassmatePresentation, type ClassmatePresentationSpec } from "../../content-schema/src/paint-zoo.ts";
import { classmatePresentationProps } from "./classmate-presentation.ts";
import { stageV2LawErrors } from "./stage-v2-laws.ts";
import { phaseArtScope, phaseRequiredStems } from "./artScope.ts";
import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { newChapterLearning } from "./learning.ts";
import { sceneDrawItems } from "./scene-v2.ts";
import { replayPhaseTape, worldAssertionErrors } from "./tape.ts";
import { SUBS } from "./paint.ts";
import type { PaintLevel } from "./level.ts";
import type { GameTaskV2 } from "../../content-schema/src/game-tasks.ts";

const original = readZooJson("ch02.level.json") as PaintLevel;
const tasks = readZooJson("ch02.tasks.v2.json").items as GameTaskV2[];
const contract = (): ClassmatePresentationSpec => ({
  props: [
    { id: "pass", skin: "fenn_pass", anchor: { x: .5, y: .8 }, canvas: { widthPx: 144, heightPx: 92 } },
    { id: "group-photo", skin: "fenn_pass_gruppenfoto", anchor: { x: .5, y: .8 }, canvas: { widthPx: 144, heightPx: 92 } },
    { id: "bubble", skin: "fenn_gruppensprechblase", anchor: { x: .5, y: .8 }, canvas: { widthPx: 144, heightPx: 92 } },
  ],
  views: [
    ...[12, 13, 14, 15].map(n => ({ taskId: `g1.paint.ch02.b${n}`, propIds: ["pass"] })),
    { taskId: "g1.paint.ch02.b16", propIds: ["pass", "group-photo"] },
    { taskId: "g1.paint.ch02.b17", propIds: ["bubble"] },
  ],
  homePropIds: [],
});
const withContract = (spec = contract()) => {
  const level = structuredClone(original);
  level.phases.find(p => p.id === "p2")!.entities.find(e => e.id === "p2-fenn")!.params!.classmatePresentation = spec;
  return level;
};
const isolated = () => {
  const level = withContract();
  level.phases.find(p => p.id === "p2")!.entities = level.phases.find(p => p.id === "p2")!.entities.filter(e => ["p2-fenn", "p2-cage-fenn"].includes(e.id));
  return level;
};
const config = (level: PaintLevel, learning = newChapterLearning()) => ({
  level, phaseId: "p2", tasks, learningProgress: learning,
  grantedAbilities: () => ["jump", "hang", "run", "punch"], freedCageIds: () => [], cageHintShown: () => true,
});
const reqOf = (events: SimEvent[]) => events.find(e => e.type === "task")?.req;
const enterQuestion = (sim: Sim): TaskRequest => {
  sim.warp(50, 17);
  for (let tick = 0; tick < 240; tick++) {
    const req = reqOf(sim.step({ ...IDLE_PAD, up: tick % 30 === 0 }));
    if (req) return req;
  }
  throw new Error("Fenn did not offer his next real question");
};

describe("optional classmate picture bindings", () => {
  it("selects cloned props only, preserving declaration order and adding no text", () => {
    const spec = contract();
    spec.views[4]!.propIds.reverse(); // Selection is not a second drawing-order contract.
    const props = classmatePresentationProps(spec, "g1.paint.ch02.b16");
    expect(props).toEqual(spec.props.slice(0, 2));
    expect(Object.keys(props[0]!).sort()).toEqual(["anchor", "canvas", "id", "skin"]);
    props[0]!.anchor!.x = 0;
    props[0]!.canvas!.widthPx = 1;
    expect(spec.props[0]!.anchor!.x).toBe(.5);
    expect(spec.props[0]!.canvas!.widthPx).toBe(144);
    expect(classmatePresentationProps(spec, "missing-task")).toEqual([]);
    expect(classmatePresentationProps(spec, "home")).toEqual([]);
    spec.homePropIds = ["pass"];
    expect(classmatePresentationProps(spec, "home")).toEqual([spec.props[0]]);
    expect(classmatePresentationProps(undefined, "g1.paint.ch02.b12")).toEqual([]);
  });

  it.each<[string, (spec: ClassmatePresentationSpec) => void]>([
    ["duplicate prop", s => s.props.push(structuredClone(s.props[0]!))],
    ["duplicate task", s => s.views.push(structuredClone(s.views[0]!))],
    ["duplicate view selection", s => s.views[0]!.propIds.push("pass")],
    ["foreign view prop", s => s.views[0]!.propIds.push("somebody-elses-pass")],
    ["duplicate home selection", s => { s.homePropIds = ["pass", "pass"]; }],
    ["foreign home prop", s => { s.homePropIds = ["somebody-elses-pass"]; }],
  ])("rejects %s through the shared schema and real level-law entry point", (_label, change) => {
    const spec = contract(); change(spec);
    expect(ClassmatePresentation.safeParse(spec).success).toBe(false);
    expect(stageV2LawErrors(withContract(spec)).some(e => e.detail.includes("classmatePresentation"))).toBe(true);
  });

  it("requires a classmate owner and task IDs from its own sequence", () => {
    expect(stageV2LawErrors(withContract())).toEqual(stageV2LawErrors(original));
    const wrongOwner = withContract();
    wrongOwner.phases[1]!.entities.find(e => e.id === "p2-fenn")!.role = "drained";
    expect(stageV2LawErrors(wrongOwner).some(e => e.detail.includes("requires a classmate owner"))).toBe(true);
    const foreign = contract(); foreign.views[0]!.taskId = "g1.paint.ch02.a01";
    expect(ClassmatePresentation.safeParse(foreign).success).toBe(true); // Cross-entity ownership is the level law's job.
    expect(stageV2LawErrors(withContract(foreign)).some(e => e.detail.includes("outside its sequence"))).toBe(true);
  });

  it("accepts a card owned only by a reserve slot and rejects it once that ownership is removed", () => {
    const level = withContract();
    const fenn = level.phases[1]!.entities.find(e => e.id === "p2-fenn")!;
    const taskId = "g1.paint.ch02.fenn-pass-review";
    fenn.params!.taskSequenceV2!.reserveSlots = [{
      slotId: "fenn-pass-review", target: "g1u02.s.to-be", taskId,
      when: "optional-after-sequence", countsAsRequired: false,
    }];
    fenn.params!.classmatePresentation!.views[0]!.taskId = taskId;
    expect(fenn.params!.taskSequenceV2!.requiredIds).not.toContain(taskId);
    expect(fenn.params!.taskSequenceV2!.variantIds).not.toContain(taskId);
    expect(stageV2LawErrors(level)).toEqual(stageV2LawErrors(original));
    fenn.params!.taskSequenceV2!.reserveSlots = [];
    expect(stageV2LawErrors(level).some(e => e.detail.includes(taskId) && e.detail.includes("outside its sequence"))).toBe(true);
  });

  it("serves the actual six rounds, restores a dismissed pass question, then uses the home view while roaming", () => {
    const level = isolated();
    let sim = new Sim(config(level));
    let req = enterQuestion(sim);
    const cells = ["awake_name", "awake_happy", "awake_from", "awake_year", "awake_group", "awake_reunited"];
    const selected = [["pass"], ["pass"], ["pass"], ["pass"], ["pass", "group-photo"], ["bubble"]];
    const solved: string[] = [];
    let savedQuestion: NonNullable<TaskRequest["sceneSnapshot"]> | undefined;
    for (let index = 0; index < 6; index++) {
      let fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
      expect(req.ctx).toMatchObject({ type: "classmate", id: "p2-fenn", taskId: `g1.paint.ch02.b${12 + index}`, round: index + 1 });
      expect(req.sceneSnapshot).toEqual(fenn.classmateScene);
      expect(req.sceneSnapshot!.props.map(p => p.id)).toEqual(selected[index]);
      expect(req.sceneSnapshot!.actors[0]!.cell).toBe(cells[index]);
      const bodies = sceneDrawItems(req.sceneSnapshot!).filter(i => i.kind === "actor");
      expect(bodies).toHaveLength(index >= 4 ? 4 : 1);
      expect(bodies.every(b => b.y === fenn.y / SUBS && b.h === 30)).toBe(true);
      if (index === 2) {
        const observed = structuredClone(req.sceneSnapshot!);
        sim.dismissTask(req.ctx);
        sim = new Sim(config(level, JSON.parse(JSON.stringify(sim.learning))));
        req = enterQuestion(sim);
        fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
        expect(req.ctx).toMatchObject({ taskId: "g1.paint.ch02.b14", round: 3 });
        expect(req.sceneSnapshot!.props).toEqual(observed.props);
        expect(req.sceneSnapshot!.actors).toEqual(observed.actors);
        expect(fenn.awakenStep).toBe(2);
      }
      if (index === 5) savedQuestion = structuredClone(req.sceneSnapshot!);
      const events = sim.solveTask(req.ctx);
      solved.push(...events.filter(e => e.type === "taskSolved").map(e => e.taskId));
      if (index < 5) {
        const next = reqOf(events); expect(next).toBeDefined(); req = next!;
      } else {
        expect(events.filter(e => e.type === "cageFreed")).toHaveLength(1);
        sim.setOverlay(false);
      }
    }
    expect(solved).toEqual(Array.from({ length: 6 }, (_,i) => `g1.paint.ch02.b${12+i}`));
    let fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
    expect(fenn.awakenStep).toBe(6);
    expect(fenn.redeemed).toBe(true);
    for (let tick = 0; tick < 1200 && fenn.state !== "roam"; tick++) sim.step(IDLE_PAD);
    expect(fenn.state).toBe("roam");
    // This exact pure selector is used on the cloned world view by PaintScene.
    expect(classmatePresentationProps(fenn.params.classmatePresentation, "home")).toEqual([]);
    expect(fenn.classmateScene!.props.map(p => p.id)).toEqual(["bubble"]); // The observed question stays frozen.
    expect(savedQuestion!.props.map(p => p.id)).toEqual(["bubble"]);
    const save = JSON.parse(JSON.stringify(sim.learning));
    sim = new Sim(config(level, save));
    fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
    expect(fenn.redeemed).toBe(true);
    expect(classmatePresentationProps(fenn.params.classmatePresentation, "home")).toEqual([]);
    expect(fenn.classmateScene!.actors).toHaveLength(4);
  });

  it("freezes question props independently of the source contract and external event object", () => {
    const level = isolated(), sim = new Sim(config(level)), req = enterQuestion(sim);
    const fenn = sim.world.entities.find(e => e.id === "p2-fenn")!;
    fenn.params.classmatePresentation!.props[0]!.anchor!.x = .1;
    expect(req.sceneSnapshot!.props[0]!.anchor!.x).toBe(.5);
    req.sceneSnapshot!.props[0]!.anchor!.x = .2;
    expect(fenn.classmateScene!.props[0]!.anchor!.x).toBe(.5);
    expect(sim.activeTask!.sceneSnapshot!.props[0]!.anchor!.x).toBe(.5);
  });

  it("requires all authored props and dynamic friend cells with an empty art inventory", () => {
    const level = isolated();
    const required = phaseRequiredStems(level, "p2"), scoped = phaseArtScope(level, "p2", []);
    for (const stem of ["fenn_pass_a", "fenn_pass_gruppenfoto_a", "fenn_gruppensprechblase_a", "besucherkinder_wave_a", "besucherkinder_walk0"]) {
      expect(required.has(stem), stem).toBe(true);
      expect(scoped.has(stem), stem).toBe(true);
    }
    delete level.phases[1]!.entities.find(e => e.id === "p2-fenn")!.params!.classmatePresentation;
    for (const stem of ["fenn_pass_a", "fenn_pass_gruppenfoto_a", "fenn_gruppensprechblase_a"]) {
      expect(phaseRequiredStems(level, "p2").has(stem)).toBe(false);
      expect(phaseArtScope(level, "p2", []).has(stem)).toBe(false);
    }
  });

  it("preserves the original p2 proof and empty classmate props when no contract is authored", () => {
    const proof = readZooJson("ch02.proof.json");
    const observed: TaskRequest[] = [];
    const result = replayPhaseTape(original, "p2", proof.phases.p2, [], {
      tasks, cageHintShown: false, arenaBriefShown: false, pickedUp: [],
      onTask: req => { if (req.ctx.type === "classmate") observed.push(req); },
    });
    expect(result.exited).toBe(true);
    expect(worldAssertionErrors(proof.phases.p2.expect, result.world)).toEqual([]);
    expect(observed).toHaveLength(6);
    expect(observed.every(req => req.sceneSnapshot!.props.length === 0)).toBe(true);
  });
});
