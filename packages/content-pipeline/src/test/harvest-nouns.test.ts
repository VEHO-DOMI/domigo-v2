import assert from "node:assert/strict";
import { test } from "node:test";
import { buildHarvest, countCapitalizedNonInitial } from "../harvest-nouns.ts";
import { PROPER_NOUNS_PATH, type ProperNounsFile } from "../cumulative-bank.ts";
import { readJsonIfExists } from "../json.ts";

test("countCapitalizedNonInitial: sentence starts excluded, possessives stripped", () => {
  const counts = countCapitalizedNonInitial([
    "Emily likes Halloween. Emily said hello.", // 1st Emily initial; Halloween counted; 2nd Emily initial
    "We met Emily at the party.", // Emily counted
    "Is Emily's cat black? Yes!", // Emily counted (possessive stripped)
  ]);
  assert.equal(counts.get("Emily"), 2);
  assert.equal(counts.get("Halloween"), 1);
  assert.equal(counts.get("We"), undefined); // line-initial
  assert.equal(counts.get("Yes"), undefined); // sentence-initial after ?
});

test("countCapitalizedNonInitial: ALL-CAPS and mixed tokens are not candidates", () => {
  const counts = countCapitalizedNonInitial(["We saw GRAMMAR and McDonald twice.", "And GRAMMAR and McDonald again."]);
  assert.equal(counts.get("GRAMMAR"), undefined);
  assert.equal(counts.get("McDonald"), undefined); // capital inside — fails [A-Z][a-z]+
});

test("committed proper-nouns.json equals the deterministic recomputation (drift gate)", () => {
  const committed = readJsonIfExists<ProperNounsFile>(PROPER_NOUNS_PATH);
  assert.ok(committed !== null, "run `pnpm content harvest-nouns` and commit the output");
  assert.deepEqual(buildHarvest(), committed);
});

test("harvest respects the rejects overlay and the ≥2 threshold", () => {
  const committed = readJsonIfExists<ProperNounsFile>(PROPER_NOUNS_PATH)!;
  for (const list of Object.values(committed.units)) {
    for (const n of list) {
      assert.ok(n.count >= 2, `${n.token} below threshold`);
      assert.notEqual(n.token, "Grundform", "rejected token leaked through");
    }
  }
  // the g2-u03 cast survived
  const u03 = (committed.units["g2-u03"] ?? []).map((n) => n.token);
  assert.ok(u03.includes("Halloween"));
  assert.ok(u03.includes("Emily"));
});
