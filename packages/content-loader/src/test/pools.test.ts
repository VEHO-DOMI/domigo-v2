import assert from "node:assert/strict";
import { test } from "node:test";
import { assignPool, partitionUnit, itemsInPool } from "../pools.ts";

const S = (arr: string[] = []) => new Set(arr);

test("assignPool — precedence reserved > override > default", () => {
  // reserved wins over EVERYTHING (even an authored override)
  assert.equal(assignPool("a", S(["a"]), { a: "arcade" }), "mock");
  // authored override when not reserved
  assert.equal(assignPool("a", S([]), { a: "homework" }), "homework");
  // default is practice
  assert.equal(assignPool("a", S([]), {}), "practice");
  assert.equal(assignPool("a", S([])), "practice");
});

test("partitionUnit — a TOTAL partition (every item in exactly one pool)", () => {
  const ids = ["a", "b", "c", "d"];
  const m = partitionUnit(ids, S(["a"]), { b: "arcade", c: "homework" });
  assert.equal(m.size, ids.length); // every id present…
  assert.ok([...m.values()].every((p) => p !== undefined)); // …with a pool
  assert.equal(m.get("a"), "mock"); // reserved
  assert.equal(m.get("b"), "arcade"); // override
  assert.equal(m.get("c"), "homework"); // override
  assert.equal(m.get("d"), "practice"); // default remainder
});

test("mock comes ONLY from reserved — an override can never mint mock", () => {
  // (the schema type forbids authoring 'mock', but assert the runtime too)
  const m = partitionUnit(["a", "b", "c"], S([]), { a: "practice", b: "arcade", c: "homework" });
  assert.ok(![...m.values()].includes("mock"), "no mock without reserved");
  // and reserved is exactly the mock set
  const m2 = partitionUnit(["a", "b"], S(["b"]));
  assert.deepEqual([...m2].filter(([, p]) => p === "mock").map(([id]) => id), ["b"]);
});

test("itemsInPool — a pool's items, corpus order preserved", () => {
  const ids = ["a", "b", "c", "d"];
  assert.deepEqual(itemsInPool(ids, "practice", S(["a"]), { c: "arcade" }), ["b", "d"]);
  assert.deepEqual(itemsInPool(ids, "arcade", S(["a"]), { c: "arcade" }), ["c"]);
  assert.deepEqual(itemsInPool(ids, "mock", S(["a"])), ["a"]);
});
