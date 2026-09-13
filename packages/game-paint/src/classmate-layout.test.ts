// CODEX DRAFT — NOT CANON. Real question snapshots and shared image geometry.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ClassmatePresentation, ZooSourceRect } from "../../content-schema/src/paint-zoo.ts";
import { GameTasksFileV2 } from "../../content-schema/src/game-tasks.ts";
import { classmateOwnerPresentation } from "./classmate-presentation.ts";
import { sceneDrawItems, sceneImagePlacement, type SceneSnapshot } from "./scene-v2.ts";
import { replayPhaseTape, worldAssertionErrors, type PhaseTape } from "./tape.ts";
import type { PaintLevel } from "./level.ts";

const read = (name: string) => JSON.parse(fs.readFileSync(new URL(`../../../content/corpus/stories/g1.st.lost-pages/paint/${name}`, import.meta.url), "utf8"));
const level = read("ch02.level.json") as PaintLevel;
const tasks = GameTasksFileV2.parse(read("ch02.tasks.v2.json")).items;
const tape = read("ch02.proof.json").phases.p2 as PhaseTape;
const spec = level.phases[1]!.entities.find(e => e.id === "p2-fenn")!.params!.classmatePresentation!;

describe("optional illustrated classmate layout", () => {
  it("keeps six real answer poses and saved actor sizes while drawing the authored hand/pass layout", () => {
    const snapshots: SceneSnapshot[] = [];
    const result = replayPhaseTape(level, "p2", tape, [], {
      tasks, cageHintShown: false, arenaBriefShown: false, pickedUp: [],
      onTask: req => { if (req.sceneSnapshot?.entityId === "p2-fenn") snapshots.push(req.sceneSnapshot); },
    });
    expect(result.exited).toBe(true);
    expect(worldAssertionErrors(tape.expect, result.world)).toEqual([]);
    expect(snapshots).toHaveLength(6);
    const poses = ["awake_name", "awake_happy", "awake_from", "awake_year", "awake_group", "awake_reunited"];
    snapshots.forEach((snapshot, i) => {
      const before = structuredClone(snapshot);
      const items = sceneDrawItems(snapshot);
      expect(snapshot.actors[0]!.cell).toBe(poses[i]);
      expect(snapshot.actors[0]!.displayHeightPx).toBe(30);
      expect(items.filter(item => item.kind === "actor")).toHaveLength(i === 5 ? 4 : 1);
      expect(items.find(item => item.id === "p2-fenn:0")!.h).toBe(i === 5 ? 30 : 58);
      expect(items.filter(item => item.sourceRect)).toHaveLength(i === 5 ? 0 : i === 4 ? 3 : 2);
      expect(snapshot).toEqual(before);
    });
  });

  it("places all four cropped image edges at the target rectangle regardless of source resolution", () => {
    const item = { id: "pass", stem: "paper", kind: "prop" as const, depth: 1, x: 120, y: 90, w: 90, h: 48,
      sourceRect: { x: .125, y: .25, width: .5, height: .375 } };
    for (const [sourceWidth, sourceHeight] of [[512, 512], [1568, 1003]]) {
      const p = sceneImagePlacement(item, sourceWidth!, sourceHeight!);
      expect(p.crop).toBeDefined();
      const left = p.x - p.w / 2 + p.crop!.x / sourceWidth! * p.w;
      const top = p.y - p.h + p.crop!.y / sourceHeight! * p.h;
      expect(left).toBeCloseTo(75, 10);
      expect(top).toBeCloseTo(42, 10);
      expect(left + p.crop!.width / sourceWidth! * p.w).toBeCloseTo(165, 10);
      expect(top + p.crop!.height / sourceHeight! * p.h).toBeCloseTo(90, 10);
    }
    expect(sceneImagePlacement({ ...item, sourceRect: undefined }, 512, 512)).toEqual({ x: 120, y: 90, w: 90, h: 48 });
  });

  it("requires an explicit task binding and clones it before freezing a question", () => {
    expect(classmateOwnerPresentation(undefined, "g1.paint.ch02.b12", "p2-fenn")).toEqual({});
    expect(classmateOwnerPresentation(spec, "unknown", "p2-fenn")).toEqual({});
    const before = structuredClone(spec);
    const result = classmateOwnerPresentation(spec, "g1.paint.ch02.b12", "p2-fenn");
    result.ownerPresentation!.rect!.anchor.x = 0;
    expect(spec).toEqual(before);
  });

  it("rejects empty and out-of-image crops and invalid owner sizes", () => {
    for (const rect of [
      { x: .8, y: 0, width: .4, height: .5 }, { x: 0, y: .9, width: .5, height: .2 },
      { x: 0, y: 0, width: 0, height: 1 }, { x: -.1, y: 0, width: .5, height: 1 },
    ]) expect(ZooSourceRect.safeParse(rect).success).toBe(false);
    expect(ClassmatePresentation.safeParse(spec).success).toBe(true);
    const bad = structuredClone(spec);
    bad.views[0]!.ownerRect!.displayHeightPx = 0;
    expect(ClassmatePresentation.safeParse(bad).success).toBe(false);
  });
});
