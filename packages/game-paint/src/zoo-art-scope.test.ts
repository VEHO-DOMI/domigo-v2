import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { phaseArtScope, phaseRequiredStems, allScopePhases } from "./artScope.ts";
import { replayPhaseTape } from "./tape.ts";
import { sceneDrawItems } from "./scene-v2.ts";

const folder = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint");
const level = JSON.parse(fs.readFileSync(path.join(folder, "ch02.level.json"), "utf8"));
const proof = JSON.parse(fs.readFileSync(path.join(folder, "ch02.proof.json"), "utf8"));
const tasks = JSON.parse(fs.readFileSync(path.join(folder, "ch02.tasks.v2.json"), "utf8")).items;

describe("registered zoo world textures", () => {
  it("retains every required registered cell even when a same-prefix illustration exists", () => {
    const present = ["zookaefig_a", "zookaefig_a01", "papagei_auto_crouch", "papagei_auto_card", "loewe_watch"];
    for (const phase of allScopePhases(level)) {
      const scope = phaseArtScope(level, phase.id, present);
      for (const stem of phaseRequiredStems(level, phase.id).keys()) expect(scope.has(stem), stem).toBe(true);
      expect(scope.has("zookaefig_a01")).toBe(false);
      expect(scope.has("papagei_auto_card")).toBe(false);
    }
  });

  it("keeps the same-prefix future-cell contract for a legacy entity", () => {
    const legacy = { chapter: "test", phases: [{ id: "p1", rows: [], entities: [{ skin: "zookaefig", role: "cage" }] }] };
    expect(phaseArtScope(legacy, "p1", ["zookaefig_future_pose"]).has("zookaefig_future_pose")).toBe(true);
  });

  it("loads the crouching cell actually requested by the current P1 proof", () => {
    const observed = new Set<string>();
    const result = replayPhaseTape(level, "p1", proof.phases.p1, [], {
      tasks, cageHintShown: false, arenaBriefShown: false, pickedUp: [],
      onTask: request => {
        if (request.sceneSnapshot) for (const item of sceneDrawItems(request.sceneSnapshot)) observed.add(item.stem);
      },
    });
    expect(result.exited).toBe(true);
    expect(observed.has("papagei_auto_crouch")).toBe(true);
    const scope = phaseArtScope(level, "p1", observed);
    expect([...observed].filter(stem => !scope.has(stem))).toEqual([]);
  });
});
