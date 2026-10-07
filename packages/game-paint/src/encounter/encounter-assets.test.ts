import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { GrammarFile, PaintEncounter, type PaintEncounter as Encounter } from "@domigo/content-schema";
import { gradeGrammar } from "@domigo/engine";

const ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
const FILE = path.join(ROOT, "content/corpus/stories/g1.st.lost-pages/paint/ch02.encounter.json");
const raw = JSON.parse(fs.readFileSync(FILE, "utf8")) as Encounter;
const encounter = PaintEncounter.parse(raw);
const grammar = GrammarFile.parse(JSON.parse(fs.readFileSync(path.join(ROOT, "content/corpus/units/g1-u02/grammar.json"), "utf8")));

function assetErrors(svg: string): string[] {
  const errors: string[] = [];
  if (Buffer.byteLength(svg, "utf8") > 2048) errors.push("larger than 2 KB");
  if (/<script\b|\bon\w+\s*=|<foreignObject\b|(?:href|src)\s*=/i.test(svg)) errors.push("active or external SVG content");
  if (!/viewBox="0 0 440 300"/.test(svg)) errors.push("unexpected drawing dimensions");
  if (!/<title>[^<]+<\/title>/.test(svg)) errors.push("missing accessible title");
  return errors;
}

describe("the Chapter 2 encounter uses its actual scene assets and corpus", () => {
  it("contains the three models, nine scenes and six deliberately ordered tasks", () => {
    expect(encounter.models).toHaveLength(3);
    expect(encounter.scenes).toHaveLength(9);
    expect(encounter.tasks.map(task => task.id)).toEqual(["p01", "p02", "p03", "a01", "a02", "t01"]);
    expect(encounter.tasks.filter(task => task.worldEffects.length).map(task => [task.id, task.worldEffects]))
      .toEqual([["a02", ["recover_book", "pack_book"]]]);
  });

  for (const scene of encounter.scenes) {
    it(`${scene.id} exists, stays below 2 KB, has no active code and describes the same picture`, () => {
      const file = path.join(ROOT, "apps/web/public", scene.asset);
      expect(fs.existsSync(file)).toBe(true);
      const svg = fs.readFileSync(file, "utf8");
      expect(assetErrors(svg)).toEqual([]);
      expect(svg).toContain(`<title>${scene.altDe}</title>`);
    });
  }

  it("the asset guard rejects the actual source with a script or oversize payload", () => {
    const svg = fs.readFileSync(path.join(ROOT, "apps/web/public", encounter.scenes[0]!.asset), "utf8");
    expect(assetErrors(svg.replace("</svg>", "<script>alert(1)</script></svg>"))).toContain("active or external SVG content");
    expect(assetErrors(svg + " ".repeat(2049))).toContain("larger than 2 KB");
    expect(assetErrors(svg.replace("<svg ", '<svg onload="alert(1)" '))).toContain("active or external SVG content");
    expect(assetErrors(svg.replace(/<title>.*?<\/title>/, ""))).toContain("missing accessible title");
  });

  for (const task of encounter.tasks) {
    it(`${task.id} grades through the real corpus and rejects the other location words`, () => {
      const item = grammar.items.find(item => item.id === task.corpusItem);
      expect(item).toBeDefined();
      if (!item) throw new Error(`Missing corpus item ${task.corpusItem}`);
      expect(task.exercises).toEqual([item.structureId]);
      const actualAnswers = [...new Set([task.answer, ...(task.kind === "typed" ? task.accept : [])])].sort();
      expect(actualAnswers).toEqual(item.answers.filter(answer => answer.tier === "full").map(answer => answer.text).sort());
      const inputKind = task.kind === "choice" ? "choice" : "text";
      for (const value of ["in", "on", "under"]) {
        const tier = gradeGrammar(item, { kind: inputKind, value }).tier;
        if (value === task.answer) expect(tier).toBe("correct");
        else expect(tier).not.toBe("correct");
      }
      expect(gradeGrammar(item, { kind: inputKind, value: "bag" }).tier).not.toBe("correct");
    });
  }

  it("the schema rejects broken references, duplicate actions and private author fields", () => {
    const mutations: Array<(draft: Encounter) => void> = [
      draft => { draft.models[0]!.scene = "s99"; },
      draft => { draft.tasks[0]!.scene = "s99"; },
      draft => { draft.tasks[0]!.stimulus.stem = "s99"; },
      draft => { draft.tasks[0]!.stimulus.altDe = "Ein anderes Bild."; },
      draft => { draft.scenes[0]!.asset = "/art/g1/paint/ch03/encounter/s01.svg"; },
      draft => { draft.scenes[1]!.id = draft.scenes[0]!.id; },
      draft => { draft.tasks[1]!.id = draft.tasks[0]!.id; },
      draft => { draft.tasks[0]!.corpusItem = "g2u02.gi.prepositions-place.mc.001"; },
      draft => { draft.tasks[0]!.promptEn = "The book is here."; },
      draft => { draft.tasks[0]!.worldEffects = ["pack_book", "pack_book"]; },
      draft => { Object.assign(draft, { authorKey: "private" }); },
    ];
    for (const mutate of mutations) {
      const draft = structuredClone(raw);
      mutate(draft);
      expect(PaintEncounter.safeParse(draft).success).toBe(false);
    }
  });
});
