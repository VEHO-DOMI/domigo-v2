import assert from "node:assert/strict";
import { test } from "node:test";
import { FORMAT_CODES, GRAMMAR_FORMATS, GrammarItem, GrammarItemId, nextGrammarItemId } from "../index.ts";
import { grammarItem } from "./fixtures.ts";

test("Studio grammar ids preserve structure, unit and format for every schema format", () => {
  for (const format of GRAMMAR_FORMATS) {
    const id = nextGrammarItemId("g2u03.s.should", format, []);
    assert.equal(id, `g2u03.gi.should.${FORMAT_CODES[format]}.001`);
    assert.equal(GrammarItem.safeParse(grammarItem(format, { id })).success, true);
  }
});

test("Studio grammar id allocation reserves corpus and draft ids and never crosses format", () => {
  const occupied = ["g2u03.gi.should.mc.001", "g2u03.gi.should.mc.002", "g2u03.gi.should.gf.003"];
  assert.equal(nextGrammarItemId("g2u03.s.should", "multiple-choice", occupied), "g2u03.gi.should.mc.003");
  assert.equal(GrammarItemId.safeParse(nextGrammarItemId("g2u03.s.should", "gap-fill", occupied)).success, true);
});

test("Studio grammar ids reject malformed structures and an exhausted sequence", () => {
  assert.throws(() => nextGrammarItemId("g2-u03.s.should", "multiple-choice", []));
  assert.throws(() => nextGrammarItemId("g2u03.s.should", "bogus" as never, []));
  const occupied = Array.from({ length: 999 }, (_, i) => `g2u03.gi.should.mc.${String(i + 1).padStart(3, "0")}`);
  assert.throws(() => nextGrammarItemId("g2u03.s.should", "multiple-choice", occupied), /alle Aufgabennummern/);
});
