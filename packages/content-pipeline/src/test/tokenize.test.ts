import assert from "node:assert/strict";
import { test } from "node:test";
import { inflectionFamily, phraseExact, tokenizeText, traceForms, wordTokens } from "../tokenize.ts";

test("wordTokens: hyphens are separators, curly apostrophes normalize", () => {
  assert.deepEqual(wordTokens("Trick-or-treat!"), ["trick", "or", "treat"]);
  assert.deepEqual(wordTokens("people’s doors"), ["people's", "doors"]);
});

test("inflectionFamily: regular rules", () => {
  assert.ok(inflectionFamily("cry").has("cries"));
  assert.ok(inflectionFamily("cry").has("cried"));
  assert.ok(inflectionFamily("make").has("making"));
  assert.ok(inflectionFamily("stop").has("stopped"));
  assert.ok(inflectionFamily("big").has("bigger"));
  assert.ok(inflectionFamily("watch").has("watches"));
  assert.ok(inflectionFamily("dog").has("dog's"));
});

test("phraseExact: contiguous in-order with per-token inflection", () => {
  const text = tokenizeText("We knocked on people's doors and said trick or treat.");
  assert.ok(phraseExact(text, "knock on people's doors"));
  assert.ok(phraseExact(text, "trick-or-treat"));
  assert.ok(!phraseExact(text, "knock on windows"));
});

test("traceForms: exact beats loose beats miss", () => {
  const text = tokenizeText("My favourite tradition is carving pumpkins in October.");
  assert.equal(traceForms(text, ["tradition"]), "exact");
  assert.equal(traceForms(text, ["carve a pumpkin"]), "loose"); // all tokens present, not contiguous
  assert.equal(traceForms(text, ["ghost story"]), "miss");
});
