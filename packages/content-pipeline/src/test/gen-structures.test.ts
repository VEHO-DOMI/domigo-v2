import assert from "node:assert/strict";
import { test } from "node:test";
import { v1DifficultyToV2 } from "@domigo/content-schema";
import type { StructureIdsLock } from "../gen-structures.ts";
import { diffV1Floor, mintStructureIds } from "../gen-structures.ts";

test("mintStructureIds: fresh mint, re-mint idempotence, tombstones", () => {
  const drafts = [
    { key: "should", unit: 3 },
    { key: "past-simple-questions", unit: 2 },
  ];
  const first = mintStructureIds(2, drafts, null, "aaaaaaaaaaaa");
  assert.equal(first.ids.get("should"), "g2u03.s.should");
  assert.equal(first.ids.get("past-simple-questions"), "g2u02.s.past-simple-questions");
  assert.equal(first.lockChanged, true);
  assert.deepEqual(first.remints, []);

  // unchanged draft + same lock → byte-identical lock, no change
  const second = mintStructureIds(2, drafts, first.lock, "bbbbbbbbbbbb");
  assert.equal(second.lockChanged, false);
  assert.deepEqual(second.lock, first.lock);

  // removed key → tombstoned
  const third = mintStructureIds(2, [drafts[0]!], first.lock, "cccccccccccc");
  assert.equal(third.lockChanged, true);
  assert.ok(!("past-simple-questions" in third.lock.structures));
  assert.ok(
    third.lock.tombstones.some(
      (t) => t.key === "past-simple-questions" && t.id === "g2u02.s.past-simple-questions" && t.removedWith === "cccccccccccc",
    ),
  );
});

test("mintStructureIds: unit move tombstones the old id and re-mints loudly", () => {
  const lock: StructureIdsLock = {
    schema: "structure-ids-lock@1",
    grade: 2,
    structures: { should: "g2u03.s.should" },
    tombstones: [],
  };
  const moved = mintStructureIds(2, [{ key: "should", unit: 4 }], lock, "dddddddddddd");
  assert.equal(moved.ids.get("should"), "g2u04.s.should");
  assert.deepEqual(moved.remints, ["should"]);
  assert.ok(moved.lock.tombstones.some((t) => t.id === "g2u03.s.should" && t.key === "should"));
});

test("diffV1Floor: mapped / fresh / waived partition + red cases", () => {
  const v1Ids = ["m2-u3-should", "m2-u4-comparatives", "m2-u4-superlatives"];

  const ok = diffV1Floor(
    [
      { key: "should", seedV1: ["m2-u3-should"] },
      { key: "comparison", seedV1: ["m2-u4-comparatives", "m2-u4-superlatives"] },
      { key: "brand-new", seedV1: [] },
    ],
    [],
    v1Ids,
  );
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.mapped.length, 3);
  assert.deepEqual(ok.fresh, ["brand-new"]);

  const missing = diffV1Floor([{ key: "should", seedV1: ["m2-u3-should"] }], [], v1Ids);
  assert.equal(missing.errors.length, 2); // two unmapped, unwaived v1 ids

  const waived = diffV1Floor(
    [{ key: "should", seedV1: ["m2-u3-should"] }],
    [
      { v1Id: "m2-u4-comparatives", note: "merged into comparison next round" },
      { v1Id: "m2-u4-superlatives", note: "merged into comparison next round" },
    ],
    v1Ids,
  );
  assert.deepEqual(waived.errors, []);

  const double = diffV1Floor(
    [
      { key: "a", seedV1: ["m2-u3-should"] },
      { key: "b", seedV1: ["m2-u3-should"] },
    ],
    [{ v1Id: "m2-u4-comparatives", note: "x" }, { v1Id: "m2-u4-superlatives", note: "x" }],
    v1Ids,
  );
  assert.ok(double.errors.some((e) => e.includes("mapped by both")));

  const mappedAndWaived = diffV1Floor(
    [{ key: "should", seedV1: ["m2-u3-should"] }],
    [
      { v1Id: "m2-u3-should", note: "also waived" },
      { v1Id: "m2-u4-comparatives", note: "x" },
      { v1Id: "m2-u4-superlatives", note: "x" },
    ],
    v1Ids,
  );
  assert.ok(mappedAndWaived.errors.some((e) => e.includes("both mapped and waived")));

  const unknown = diffV1Floor(
    [{ key: "should", seedV1: ["m2-u99-nope"] }],
    [{ v1Id: "m2-u98-nope", note: "x" }],
    v1Ids,
  );
  assert.ok(unknown.errors.some((e) => e.includes("unknown v1 id m2-u99-nope")));
  assert.ok(unknown.errors.some((e) => e.includes("unknown v1 id m2-u98-nope")));
});

test("v1DifficultyToV2 seed map", () => {
  assert.equal(v1DifficultyToV2(1), 1);
  assert.equal(v1DifficultyToV2(2), 1);
  assert.equal(v1DifficultyToV2(3), 2);
  assert.equal(v1DifficultyToV2(4), 3);
  assert.equal(v1DifficultyToV2(5), 3);
});
