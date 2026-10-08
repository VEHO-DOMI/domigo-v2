import assert from "node:assert/strict";
import { test } from "node:test";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { loadDictionary } from "./woerterbuch.ts";
import { dictionaryResults } from "../app/woerterbuch/search.ts";

test("dictionary covers exactly the approved vocabulary of each requested year", () => {
  for (const grade of [1, 2, 3, 4]) {
    const source = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
    const entries = loadDictionary([grade]);
    assert.ok(entries.length > 0);
    assert.deepEqual(entries.map((e) => e.id).sort(), source.flatMap((slug) => loadUnit(slug).vocab.map((v) => v.id)).sort());
    assert.ok(entries.every((e) => e.grade === grade && source.includes(e.slug) && e.chapter === Number(e.slug.slice(-2))));
  }
  assert.deepEqual(loadDictionary([]), []);
  assert.deepEqual(loadDictionary([9]), []);
});

test("dictionary examples use the approved full sentence fill, including inflections", () => {
  const entries = loadDictionary([1, 2, 3, 4]);
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

test("dictionary sends only display fields and keeps the alphabetic fallback", () => {
  const entries = loadDictionary([1, 3]);
  for (const entry of entries) assert.deepEqual(Object.keys(entry).sort(), ["chapter", "definition", "example", "german", "grade", "id", "slug", "word"]);
  for (let i = 1; i < entries.length; i++) assert.ok(entries[i - 1]!.word.localeCompare(entries[i]!.word, "en", { sensitivity: "base" }) <= 0);
  for (const query of ["", "s", " s "]) {
    const result = dictionaryResults(entries, query);
    assert.equal(result.searching, false);
    assert.deepEqual(result.matches, entries);
  }
});

test("local search matches English and German from two characters, grouped by Chapter", () => {
  const entries = loadDictionary([1]);
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
