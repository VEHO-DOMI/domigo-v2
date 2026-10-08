import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { DictionaryEntry } from "./woerterbuch.ts";
import { resetStudioFixture } from "../app/woerterbuch/studio-test-fixture.mjs";
const { loadDictionary } = await import("./woerterbuch.ts");
const { viennaDateKey, wortDesTages, selectDailyWord } = await import("./wort-des-tages.ts");

beforeEach(resetStudioFixture);

test("daily word is identical for a year and day, changes tomorrow, and is approved", async () => {
  for (const grade of [1, 2, 3, 4]) {
    const entries = await loadDictionary([grade]);
    const today = (await wortDesTages(grade, "2026-10-08"))!;
    assert.deepEqual(today, await wortDesTages(grade, "2026-10-08"));
    assert.ok(entries.some((e) => e.id === today.id));
    assert.equal(today.grade, grade);
    for (const [a, b] of [["2026-10-08", "2026-10-09"], ["2026-12-31", "2027-01-01"], ["2028-02-28", "2028-02-29"]]) {
      assert.notEqual((await wortDesTages(grade, a!))!.word.toLowerCase(), (await wortDesTages(grade, b!))!.word.toLowerCase());
    }
  }
});

test("school day is Europe/Vienna at midnight and on both DST transitions", () => {
  for (const [instant, expected] of [
    ["2026-10-07T21:59:59Z", "2026-10-07"], ["2026-10-07T22:00:00Z", "2026-10-08"],
    ["2026-01-01T23:00:00Z", "2026-01-02"], ["2026-03-29T22:30:00Z", "2026-03-30"],
    ["2026-10-25T22:30:00Z", "2026-10-25"], ["2026-10-25T23:00:00Z", "2026-10-26"],
  ]) assert.equal(viennaDateKey(new Date(instant!)), expected);
});

test("invalid days are rejected and a year without approved words has no daily word", async () => {
  for (const day of ["2026-02-30", "2026-13-01", "today", "2026-1-1"]) await assert.rejects(() => wortDesTages(1, day));
  assert.equal(await wortDesTages(9, "2026-10-08"), null);
});

test("two Chapters with the same headword take exactly one place in the daily rotation", () => {
  const apple: DictionaryEntry = { id: "g1u01.w.apple", slug: "g1-u01", grade: 1, chapter: 1, word: "apple", german: "Apfel", example: "An apple." };
  const pear: DictionaryEntry = { ...apple, id: "g1u01.w.pear", word: "pear", german: "Birne", example: "A pear." };
  const duplicate = { ...apple, id: "g1u02.w.apple", slug: "g1-u02", chapter: 2 };
  const unique = [apple, pear];
  // A repeated word must not change the entire sequence or its two-day period;
  // merely checking that tomorrow differs would miss the extra rotation slot.
  for (const word of ["apple", "APPLE"]) {
    const repeated = [apple, { ...duplicate, word }, pear];
    for (let day = 1; day <= 6; day++) {
      const date = `2026-10-0${day}`;
      assert.deepEqual(selectDailyWord(repeated, 1, date), selectDailyWord(unique, 1, date));
      assert.deepEqual(selectDailyWord(repeated, 1, date), selectDailyWord(repeated, 1, `2026-10-0${day + 2}`));
    }
  }
  assert.equal(selectDailyWord([apple, duplicate], 1, "2026-10-08")!.id, apple.id);
});

test("preview selects only the requested year from a shared dictionary snapshot", () => {
  const entries: DictionaryEntry[] = [1, 2, 3, 4].map((grade) => ({
    id: `g${grade}u01.w.word`, slug: `g${grade}-u01`, grade, chapter: 1,
    word: `word ${grade}`, german: `Wort ${grade}`, example: "A word.",
  }));
  for (const grade of [1, 2, 3, 4]) {
    assert.deepEqual(selectDailyWord(entries, grade, "2026-10-08"), entries[grade - 1]);
  }
});
