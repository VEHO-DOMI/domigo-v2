import test from "node:test";
import assert from "node:assert/strict";
import type { GrammarItem, VariantSpec } from "@domigo/content-schema";
import { buildAllowedMatcher, grantsForUnit } from "../cumulative-bank.ts";
import { variantSpecErrors } from "../mint-variants.ts";

const matcher = buildAllowedMatcher("g2-u04");
const granted = grantsForUnit("g2-u04").unitWide;
// only prompt.text (blank count) is read for a grammar base item
const base = { prompt: { text: "An elephant is ___ (big) than a rhino." } } as unknown as GrammarItem;

function spec(over: Partial<VariantSpec> = {}): VariantSpec {
  return {
    key: "wrong-name.ch04.compare",
    itemId: "g2u04.gi.comparatives.gf.004",
    scene: "g2.st.wrong-name.ch04.s004",
    slot: "compare",
    prompt: { text: "9 is ___ (big) than 7.", lang: "en" },
    glosses: [],
    ...over,
  };
}

test("happy path: in-bank carrier, matching blank count → no errors", () => {
  assert.deepEqual(variantSpecErrors(spec(), "grammar", base, matcher, granted, new Set()), []);
});

test("blank-count mismatch is rejected", () => {
  const e = variantSpecErrors(spec({ prompt: { text: "9 is big than 7.", lang: "en" } }), "grammar", base, matcher, granted, new Set());
  assert.ok(e.some((m) => m.includes("blank count")));
});

test("above-level unglossed token is rejected", () => {
  const e = variantSpecErrors(spec({ prompt: { text: "The medal is ___ (big) than 7.", lang: "en" } }), "grammar", base, matcher, granted, new Set());
  assert.ok(e.some((m) => m.includes("medal")));
});

test("a gloss rescues an above-level word", () => {
  const e = variantSpecErrors(
    spec({ prompt: { text: "The medal is ___ (big) than 7.", lang: "en" }, glosses: [{ word: "medal", de: "Medaille" }] }),
    "grammar", base, matcher, granted, new Set(),
  );
  assert.deepEqual(e, []);
});

test("glossing an already-taught word is rejected", () => {
  const e = variantSpecErrors(spec({ glosses: [{ word: "big", de: "groß" }] }), "grammar", base, matcher, granted, new Set());
  assert.ok(e.some((m) => m.includes("already in-bank")));
});

test("a duplicate variant key is rejected", () => {
  const e = variantSpecErrors(spec({ key: "wrong-name.ch04.compare" }), "grammar", base, matcher, granted, new Set(["wrong-name.ch04.compare"]));
  assert.ok(e.some((m) => m.includes("duplicate")));
});

test("vocab variant must keep exactly one blank", () => {
  const e = variantSpecErrors(spec({ prompt: { text: "9 is big than 7.", lang: "en" } }), "vocab", base, matcher, granted, new Set());
  assert.ok(e.some((m) => m.includes("blank count")));
});
