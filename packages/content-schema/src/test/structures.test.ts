import assert from "node:assert/strict";
import { test } from "node:test";
import { GrammarStructure, GrammarStructuresFile } from "../index.ts";
import { structure, structuresFile } from "./fixtures.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}

test("catalog with mapped + new structure + waiver parses", () => {
  const file = structuresFile(
    [
      structure(), // mapped (seedV1: m2-u3-should)
      structure({
        id: "g2u01.s.past-simple-revision",
        key: "past-simple-revision",
        unit: 1,
        name: "Past simple (revision)",
        nameDe: "Past simple (Wiederholung)",
        category: "tenses",
        recursIn: [9],
        seedV1: [], // NEW structure (no v1 ancestor)
      }),
    ],
    { v1Waivers: [{ v1Id: "m2-u15-conditionals-advanced", note: "moved to g3 scope; see v1-diff" }] },
  );
  const parsed = GrammarStructuresFile.parse(file);
  assert.equal(parsed.structures.length, 2);
  const reparsed = GrammarStructuresFile.parse(JSON.parse(JSON.stringify(parsed)));
  assert.deepEqual(reparsed, parsed);
});

test("structure red cases", () => {
  red(GrammarStructure.safeParse(structure({ unit: 4 })), "id unit ≠ unit field");
  red(GrammarStructure.safeParse(structure({ key: "shouldnt" })), "id key ≠ key field");
  red(GrammarStructure.safeParse(structure({ recursIn: [3] })), "recursIn == introducing unit");
  red(GrammarStructure.safeParse(structure({ recursIn: [2] })), "recursIn before introducing unit");
  red(GrammarStructure.safeParse(structure({ rules: [] })), "empty rules");
  red(GrammarStructure.safeParse(structure({ category: "verbs" })), "unknown category");
});

test("file red cases", () => {
  red(
    GrammarStructuresFile.safeParse(
      structuresFile([
        structure(),
        structure({ id: "g2u05.s.should", unit: 5 }),
      ]),
    ),
    "duplicate key across units (keys are grade-unique)",
  );
  red(
    GrammarStructuresFile.safeParse(
      structuresFile([structure()], {
        v1Waivers: [{ v1Id: "m2-u3-should", note: "also mapped" }],
      }),
    ),
    "v1 id both mapped and waived",
  );
  red(
    GrammarStructuresFile.safeParse(
      structuresFile([structure({ id: "g3u03.s.should" })]),
    ),
    "grade prefix mismatch",
  );
});
