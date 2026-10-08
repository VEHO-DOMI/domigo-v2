import assert from "node:assert/strict";
import { test } from "node:test";
import { loadDictionary } from "./woerterbuch.ts";
import { viennaDateKey, wortDesTages } from "./wort-des-tages.ts";

test("daily word is identical for a year and day, changes tomorrow, and is approved", () => {
  for (const grade of [1, 2, 3, 4]) {
    const entries = loadDictionary([grade]);
    const today = wortDesTages(grade, "2026-10-08")!;
    assert.deepEqual(today, wortDesTages(grade, "2026-10-08"));
    assert.ok(entries.some((e) => e.id === today.id));
    assert.equal(today.grade, grade);
    for (const [a, b] of [["2026-10-08", "2026-10-09"], ["2026-12-31", "2027-01-01"], ["2028-02-28", "2028-02-29"]]) {
      assert.notEqual(wortDesTages(grade, a!)!.word.toLowerCase(), wortDesTages(grade, b!)!.word.toLowerCase());
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

test("invalid days are rejected and a year without approved words has no daily word", () => {
  for (const day of ["2026-02-30", "2026-13-01", "today", "2026-1-1"]) assert.throws(() => wortDesTages(1, day));
  assert.equal(wortDesTages(9, "2026-10-08"), null);
});
