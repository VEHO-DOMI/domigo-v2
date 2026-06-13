import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAllowedMatcher, cumulativeSlugs } from "../cumulative-bank.ts";

// These run against the real committed corpus (57 approved banks) — the
// repo's established self-calibration style.

test("cumulativeSlugs: lower grades fully, own grade up to the unit", () => {
  const slugs = cumulativeSlugs(2, 3);
  assert.equal(slugs.length, 15 + 3);
  assert.ok(slugs.includes("g1-u15"));
  assert.ok(slugs.includes("g2-u03"));
  assert.ok(!slugs.includes("g2-u04"));
  assert.ok(!slugs.includes("g3-u01"));
});

test("matcher: inflections, phrases, apostrophes, numbers", () => {
  const m = buildAllowedMatcher("g2-u03");
  assert.deepEqual(m.unknownTokens("The witches are scary at Halloween."), []);
  // hyphens ≡ spaces for taught phrases
  assert.deepEqual(m.unknownTokens("They like trick-or-treat very much."), []);
  // bare integers always pass
  assert.deepEqual(m.unknownTokens("It is 2026 and they are 14."), []);
  // negative-control tokens taught in g1 (the cumulative property)
  assert.deepEqual(m.unknownTokens("We live in the 21st century."), []);
  assert.ok(m.hasPhrase("hundred"));
});

test("matcher: above-level tokens are unknown; gloss + grants rescue them", () => {
  const m = buildAllowedMatcher("g2-u03");
  assert.deepEqual(m.unknownTokens("They like carols."), ["carols"]);
  // the item's own gloss list covers the word for that item's fields
  assert.deepEqual(
    m.unknownTokens("They like carols.", { extraPhrases: ["carols"] }),
    [],
  );
  assert.deepEqual(
    m.unknownTokens("They like carols.", { grantedTokens: new Set(["carols"]) }),
    [],
  );
  // greedy longest-first: a granted single that heads a multiword phrase must not
  // orphan the rest of the phrase ("left" granted, but "left hand" still matches)
  assert.deepEqual(
    m.unknownTokens("the left hand", { extraPhrases: ["left hand"], grantedTokens: new Set(["left"]) }),
    [],
  );
});

test("matcher: cumulative boundary — a later-unit word is unknown earlier", () => {
  const m03 = buildAllowedMatcher("g2-u03");
  const m04 = buildAllowedMatcher("g2-u04");
  // "mosquito" is taught in g2-u04 (animals unit) — unknown one unit earlier
  assert.ok(!m03.hasPhrase("mosquito"));
  assert.ok(m04.hasPhrase("mosquito"));
  // "century" is taught at or before g2-u03; "carols" never is (a v1 invention)
  assert.ok(m03.hasPhrase("century"));
  assert.ok(!buildAllowedMatcher("g2-u15").hasPhrase("carols"));
});

test("matcher: harvested proper nouns pass at their unit", () => {
  const m = buildAllowedMatcher("g2-u03");
  assert.deepEqual(m.unknownTokens("Emily and Ron are with Mrs White at Halloween."), []);
  // names license their possessives (family-expanded)
  assert.deepEqual(m.unknownTokens("Sarah's costume is scary."), []);
  const noNouns = buildAllowedMatcher("g2-u03", { nouns: false });
  assert.ok(noNouns.unknownTokens("Edwina laughed.").includes("edwina"));
});

test("matcher perf smoke: full build + 1k field checks stay fast", () => {
  const start = Date.now();
  const m = buildAllowedMatcher("g4-u13"); // largest cumulative bank (2,446 entries)
  for (let i = 0; i < 1000; i += 1) {
    m.unknownTokens("We should go home because it is late and the party is over.");
  }
  const ms = Date.now() - start;
  assert.ok(ms < 5000, `matcher too slow: ${ms}ms`);
});
