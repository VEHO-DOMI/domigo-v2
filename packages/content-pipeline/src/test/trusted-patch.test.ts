import assert from "node:assert/strict";
import { test } from "node:test";
import { analyzeTrustedPatch, ANSWER_POOL_FIELDS } from "../trusted-patch.ts";
import type { UnitItems } from "../gen-items.ts";

// A minimal committed unit: one grammar item (answers pool) + one vocab item
// (translation pool). Only the fields analyzeTrustedPatch reads are populated.
const items = {
  vocab: [
    {
      id: "g1u01.w.apple",
      d: "a round fruit",
      hintDe: "die Frucht",
      translation: {
        deToEn: [{ text: "apple", tier: "full" }],
        enToDe: [{ text: "Apfel", tier: "full" }],
      },
    },
  ],
  grammar: [
    {
      id: "g1u01.gi.can.tf.001",
      answers: [{ text: "Can | play", tier: "full" }],
      prompt: { text: "___ x ___?", lang: "en", blanks: 2 },
      hintDe: "tip",
    },
  ],
} as unknown as UnitItems;

const fix = (patch: Record<string, Record<string, unknown>>) => ({ patch });

test("answer-pool change → touched, no violations", () => {
  const a = analyzeTrustedPatch(
    fix({ "g1u01.gi.can.tf.001": { answers: [{ text: "Can | play", tier: "full" }, { text: "Could | play", tier: "partial" }] } }),
    items,
  );
  assert.deepEqual(a.touched, ["g1u01.gi.can.tf.001"]);
  assert.equal(a.proseViolations.length, 0);
  assert.equal(a.missingIds.length, 0);
});

test("prose change → violation, even alongside a legit answer change", () => {
  const a = analyzeTrustedPatch(
    fix({ "g1u01.gi.can.tf.001": { hintDe: "a new hint", answers: [{ text: "Can | play", tier: "full" }, { text: "x | y", tier: "partial" }] } }),
    items,
  );
  assert.equal(a.proseViolations.length, 1);
  assert.equal(a.proseViolations[0]!.field, "hintDe");
});

test("already-materialized field (equals corpus) → ignored (no-op)", () => {
  const a = analyzeTrustedPatch(fix({ "g1u01.gi.can.tf.001": { answers: [{ text: "Can | play", tier: "full" }] } }), items);
  assert.equal(a.touched.length, 0);
  assert.equal(a.proseViolations.length, 0);
});

test("vocab translation change → answer-pool, allowed", () => {
  const a = analyzeTrustedPatch(
    fix({ "g1u01.w.apple": { translation: { deToEn: [{ text: "apple", tier: "full" }], enToDe: [{ text: "Apfel", tier: "full" }, { text: "der Apfel", tier: "full" }] } } }),
    items,
  );
  assert.deepEqual(a.touched, ["g1u01.w.apple"]);
  assert.equal(a.proseViolations.length, 0);
});

test("vocab prose (d) change → violation", () => {
  const a = analyzeTrustedPatch(fix({ "g1u01.w.apple": { d: "a different definition" } }), items);
  assert.equal(a.proseViolations.length, 1);
  assert.equal(a.proseViolations[0]!.field, "d");
});

test("unknown id → missingIds, not touched or violation", () => {
  const a = analyzeTrustedPatch(fix({ "g1u01.gi.nope.tf.099": { answers: [{ text: "x", tier: "full" }] } }), items);
  assert.deepEqual(a.missingIds, ["g1u01.gi.nope.tf.099"]);
  assert.equal(a.touched.length, 0);
  assert.equal(a.proseViolations.length, 0);
});

test("ANSWER_POOL_FIELDS is exactly the four authored answer pools", () => {
  for (const f of ["answers", "sAnswers", "dAnswers", "translation"]) assert.ok(ANSWER_POOL_FIELDS.has(f), `${f} allowed`);
  for (const f of ["d", "s", "prompt", "gloss", "hintDe", "mc"]) assert.ok(!ANSWER_POOL_FIELDS.has(f), `${f} refused`);
});
