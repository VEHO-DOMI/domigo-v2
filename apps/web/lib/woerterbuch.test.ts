import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { resetStudioFixture, studioFixture } from "../app/woerterbuch/studio-test-fixture.mjs";
import { dictionaryResults } from "../app/woerterbuch/search.ts";
const { loadDictionary } = await import("./woerterbuch.ts");
const { wortDesTages } = await import("./wort-des-tages.ts");

beforeEach(resetStudioFixture);

test("dictionary covers exactly the approved vocabulary of each requested year", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const source = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
    const entries = await loadDictionary([grade]);
    assert.ok(entries.length > 0);
    assert.deepEqual(entries.map((e) => e.id).sort(), source.flatMap((slug) => loadUnit(slug).vocab.map((v) => v.id)).sort());
    assert.ok(entries.every((e) => e.grade === grade && source.includes(e.slug) && e.chapter === Number(e.slug.slice(-2))));
  }
  assert.deepEqual(await loadDictionary([]), []);
  assert.deepEqual(await loadDictionary([9]), []);
});

test("dictionary examples use the approved full sentence fill, including inflections", async () => {
  const entries = await loadDictionary([1, 2, 3, 4]);
  const byId = new Map(entries.map((e) => [e.id, e]));
  for (const slug of listApprovedUnits()) for (const item of loadUnit(slug).vocab) {
    const entry = byId.get(item.id)!;
    const fill = item.sAnswers.find((answer) => answer.tier === "full")!.text;
    assert.equal(entry.example, item.s.replace(/___/g, () => fill));
    assert.doesNotMatch(entry.example, /___/);
    assert.equal(entry.word, item.w);
    assert.equal(entry.german, item.g);
  }
  assert.equal(byId.get("g1u01.w.address")!.example, "What is your email address? Can you spell it, please?");
});

test("dictionary sends only display fields and keeps the alphabetic fallback", async () => {
  const entries = await loadDictionary([1, 3]);
  for (const entry of entries) assert.deepEqual(Object.keys(entry).sort(), ["chapter", "example", "german", "grade", "id", "slug", "word"]);
  for (let i = 1; i < entries.length; i++) assert.ok(entries[i - 1]!.word.localeCompare(entries[i]!.word, "en", { sensitivity: "base" }) <= 0);
  for (const query of ["", "s", " s "]) {
    const result = dictionaryResults(entries, query);
    assert.equal(result.searching, false);
    assert.deepEqual(result.matches, entries);
  }
});

test("local search matches English and German from two characters, grouped by Chapter", async () => {
  const entries = await loadDictionary([1]);
  for (const query of ["sch", " SCHOOL ", "BÜ"]) {
    const expected = entries.filter((e) => [e.word, e.german].some((s) => s.toLocaleLowerCase("de").includes(query.trim().toLocaleLowerCase("de"))));
    const result = dictionaryResults(entries, query);
    assert.equal(result.searching, true);
    assert.ok(result.matches.length > 0);
    assert.deepEqual(result.matches, expected);
    assert.deepEqual(result.groups.map((g) => g.slug), [...new Set(expected.map((e) => e.slug))].sort());
    for (const group of result.groups) assert.deepEqual(group.words, expected.filter((e) => e.slug === group.slug));
  }
  assert.equal(dictionaryResults(entries, "zzzznichtvorhanden").matches.length, 0);
});

function correctedFixture() {
  const base = loadUnit("g1-u01");
  const item = base.vocab[0]!;
  studioFixture.approved = ["g1-u01"];
  studioFixture.units.set("g1-u01", { ...base, vocab: [item] });
  // This Chapter exists in the fixture and has a published correction, but has
  // not been approved. Its content and its corrections must not even be read.
  studioFixture.units.set("g1-u02", { ...base, slug: "g1-u02", vocab: [{ ...item, id: "g1u02.w.hidden" }] });
  const corrected = { ...item, g: "E-Mail-Adresse", s: "Please write your ___ here." };
  studioFixture.drafts.set("g1-u01", [{ itemId: item.id, kind: "vocab", action: "replace", item: corrected }]);
  studioFixture.drafts.set("g1-u02", [{ itemId: "g1u02.w.hidden", kind: "vocab", action: "replace", item: { ...corrected, id: "g1u02.w.hidden" } }]);
  return item;
}

test("published Studio translation and sentence reach dictionary and daily word; unapproved Chapter stays unread", async () => {
  const item = correctedFixture();
  const entries = await loadDictionary([1]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.german, "E-Mail-Adresse");
  assert.equal(entries[0]!.example, "Please write your address here.");
  assert.equal(entries[0]!.id, item.id);
  assert.deepEqual(await wortDesTages(1, "2026-10-08"), entries[0]);
  assert.ok(studioFixture.reads.includes("drafts:g1-u01"));
  assert.ok(studioFixture.reads.every((read) => read.endsWith("g1-u01")));
  assert.ok(studioFixture.unitsRead.every((slug) => slug === "g1-u01"));
});

test("published prose sentence reaches both views through the real overlay rules", async () => {
  const item = correctedFixture();
  studioFixture.drafts.clear();
  studioFixture.prose.set("g1-u01", [{ itemId: item.id, kind: "vocab", patch: { s: "Please check your ___ again." } }]);
  const [entry] = await loadDictionary([1]);
  assert.equal(entry!.example, "Please check your address again.");
  assert.deepEqual(await wortDesTages(1, "2026-10-08"), entry);
});

test("correction read failure returns corpus data in dictionary and daily word", async () => {
  const item = correctedFixture();
  for (const layer of ["prose", "drafts"]) {
    studioFixture.fail = layer;
    const [entry] = await loadDictionary([1]);
    assert.equal(entry!.german, item.g);
    assert.equal(entry!.example, "What is your email address? Can you spell it, please?");
    assert.deepEqual(await wortDesTages(1, "2026-10-08"), entry);
    assert.ok(studioFixture.reads.includes(`${layer}:g1-u01`));
  }
});
