import assert from "node:assert/strict";
import { test } from "node:test";
import { loadUnit } from "../index.ts";
import { mergeDrafts, validateFullItem, type DraftApply } from "../drafts.ts";

const unit = loadUnit("g2-u03");
const vocab = unit.vocab[0]!;
const grammar = unit.grammar[0]!;

test("validateFullItem: a real corpus item passes its schema", () => {
  assert.equal(validateFullItem("vocab", vocab).ok, true);
  assert.equal(validateFullItem("grammar", grammar).ok, true);
});

test("validateFullItem: broken items are rejected with field errors", () => {
  // bad id
  assert.equal(validateFullItem("vocab", { ...vocab, id: "NOT_AN_ID" }).ok, false);
  // carrier without a blank (superRefine)
  assert.equal(validateFullItem("vocab", { ...vocab, s: "no blank here" }).ok, false);
  // definition leaking the headword (V-8)
  const leak = validateFullItem("vocab", { ...vocab, d: `all about ${vocab.w} indeed` });
  assert.equal(leak.ok, false);
  assert.ok(leak.errors.some((e) => e.includes("d")));
  // grammar with a blank-count mismatch
  assert.equal(validateFullItem("grammar", { ...grammar, prompt: { ...grammar.prompt, text: "___ ___", blanks: 0 } }).ok, false);
  // garbage
  assert.equal(validateFullItem("vocab", {}).ok, false);
});

test("mergeDrafts: no drafts is a passthrough (same arrays)", () => {
  const r = mergeDrafts(unit.vocab, unit.grammar, []);
  assert.deepEqual(r.vocab, unit.vocab);
  assert.deepEqual(r.grammar, unit.grammar);
});

test("mergeDrafts: replace supersedes an item by id", () => {
  const replaced = { ...vocab, hintDe: "REPLACED VIA DRAFT" };
  const d: DraftApply = { itemId: vocab.id, kind: "vocab", action: "replace", item: replaced };
  const r = mergeDrafts(unit.vocab, unit.grammar, [d]);
  assert.equal(r.vocab.length, unit.vocab.length); // same count
  assert.equal(r.vocab.find((v) => v.id === vocab.id)!.hintDe, "REPLACED VIA DRAFT");
});

test("mergeDrafts: create adds a new item", () => {
  const created = { ...vocab, id: "g2u03.w.brand-new" };
  const d: DraftApply = { itemId: created.id, kind: "vocab", action: "create", item: created };
  const r = mergeDrafts(unit.vocab, unit.grammar, [d]);
  assert.equal(r.vocab.length, unit.vocab.length + 1);
  assert.ok(r.vocab.some((v) => v.id === "g2u03.w.brand-new"));
});

test("mergeDrafts: remove drops an item by id", () => {
  const d: DraftApply = { itemId: vocab.id, kind: "vocab", action: "remove", item: null };
  const r = mergeDrafts(unit.vocab, unit.grammar, [d]);
  assert.equal(r.vocab.length, unit.vocab.length - 1);
  assert.ok(!r.vocab.some((v) => v.id === vocab.id));
});

test("mergeDrafts: grammar drafts only touch grammar", () => {
  const g2 = { ...grammar, hintDe: "G-REPLACED" };
  const r = mergeDrafts(unit.vocab, unit.grammar, [{ itemId: grammar.id, kind: "grammar", action: "replace", item: g2 }]);
  assert.deepEqual(r.vocab, unit.vocab); // vocab untouched
  assert.equal(r.grammar.find((g) => g.id === grammar.id)!.hintDe, "G-REPLACED");
});
