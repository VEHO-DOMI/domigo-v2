/**
 * S-2 · the publish PRE-GATE against the REAL corpus (node --test, like
 * checkup.test.ts — apps/web has no vitest). Proves the three free layers:
 * zod → frameability → key-solvability. The live blind-solve half (solveGate)
 * needs an API key and is exercised by scripts/verify-studio-crud.mjs.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadUnit } from "@domigo/content-loader";
import type { GrammarItem } from "@domigo/content-schema";
import { preGate } from "./studio-gate.ts";

const unit = loadUnit("g4-u10");
const vocab = unit.vocab[0]!;
const byFormat = (fmt: string): GrammarItem => {
  const g = unit.grammar.find((x) => x.format === fmt);
  if (!g) throw new Error(`g4-u10 has no ${fmt} item`);
  return g;
};

describe("preGate · layer 3 pass — real corpus items are gateable & self-solvable", () => {
  it("a real vocab item passes all three layers", () => {
    const r = preGate("vocab", vocab);
    assert.equal(r.ok, true);
    assert.equal(r.stage, "passed");
    assert.ok(r.keyChecks.length >= 1);
    assert.ok(r.keyChecks.every((k) => k.tier === "correct")); // the authored key round-trips
  });

  it("a real gap-fill (text) grammar item passes", () => {
    const r = preGate("grammar", byFormat("gap-fill"));
    assert.equal(r.ok, true, r.errors.join("; "));
    assert.equal(r.stage, "passed");
  });

  it("a real multiple-choice grammar item passes (choice framing round-trips)", () => {
    const r = preGate("grammar", byFormat("multiple-choice"));
    assert.equal(r.ok, true, r.errors.join("; "));
    assert.equal(r.stage, "passed");
  });
});

describe("preGate · layer 1 — zod rejects the structurally/semantically broken", () => {
  it("garbage is rejected at the schema layer", () => {
    const r = preGate("vocab", {});
    assert.equal(r.ok, false);
    assert.equal(r.stage, "schema");
    assert.equal(r.frame, null);
  });

  it("a definition that leaks the headword is rejected at schema (V-8)", () => {
    const leak = { ...vocab, d: `all about the word ${vocab.w} indeed` };
    const r = preGate("vocab", leak);
    assert.equal(r.ok, false);
    assert.equal(r.stage, "schema");
    assert.ok(r.errors.some((e) => e.includes("d")));
  });
});

describe("preGate · layer 2 — un-gateable formats cannot publish", () => {
  it("a matching-format grammar item is blocked as un-gateable", () => {
    const r = preGate("grammar", byFormat("matching"));
    assert.equal(r.ok, false);
    assert.equal(r.stage, "un-gateable");
    assert.equal(r.frame, null);
    assert.ok(r.errors[0]!.includes("matching"));
  });
});

describe("preGate · layer 3 — an item with nothing keyed correct is blocked", () => {
  it("stripping the full answer blocks publish (at the schema OR key-defect guard)", () => {
    // A gap-fill with its full answer removed: either zod rejects it (no keyed
    // answer is structurally invalid) or the key-solvability layer catches it
    // (nothing grades correct). Both are correct hard blocks — assert the union
    // so the test is robust to WHERE the guard sits, and pin the actual stage.
    const gf = byFormat("gap-fill");
    const stripped = { ...gf, answers: gf.answers.filter((a) => a.tier !== "full") };
    const r = preGate("grammar", stripped);
    assert.equal(r.ok, false);
    assert.ok(r.stage === "schema" || r.stage === "key-defect", `unexpected stage: ${r.stage}`);
  });
});
