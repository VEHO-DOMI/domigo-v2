import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { VocabItem } from "@domigo/content-schema";
import { loadUnit, listApprovedUnits } from "@domigo/content-loader";
import { gradeVocab } from "@domigo/engine";
import { dailySeed, selectDailyChallenge } from "./daily-challenge.ts";
import "../app/woerterbuch/studio-test-fixture.mjs";
const { viennaDateKey } = await import("./wort-des-tages.ts");
import { multipleChoiceBank, practiceDirection, practiceMode, selectedChapters, sprintWords } from "../app/practice/options.ts";

const corpus = (grade: number) => listApprovedUnits().filter((s) => s.startsWith(`g${grade}-`)).flatMap((s) => loadUnit(s).vocab);
describe("daily selection", () => {
  for (const grade of [1, 2, 3, 4]) it(`year ${grade}: ten unique current-year words, same for shuffled corpus and repeated calls`, () => {
    const items = corpus(grade), a = selectDailyChallenge(items, grade, "2026-10-08");
    assert.equal(a.length, 10); assert.equal(new Set(a.map((x) => x.w.toLowerCase())).size, 10);
    assert.ok(a.every((x) => x.id.startsWith(`g${grade}u`)));
    assert.deepEqual(selectDailyChallenge([...items].reverse(), grade, "2026-10-08"), a);
    assert.deepEqual(selectDailyChallenge([...items, ...items], grade, "2026-10-08"), a);
    assert.notDeepEqual(selectDailyChallenge(items, grade, "2026-10-09"), a);
  });
  it("date and grade are both seed inputs; invalid inputs fail", () => {
    assert.notEqual(dailySeed(1, "2026-10-08"), dailySeed(2, "2026-10-08"));
    for (const date of ["2026-02-30", "2026-13-01", "bad"]) assert.throws(() => dailySeed(1, date));
    assert.throws(() => dailySeed(5, "2026-10-08"));
  });
  it("Vienna midnight and winter/summer time determine the day", () => {
    assert.equal(viennaDateKey(new Date("2026-10-08T22:00:00Z")), "2026-10-09");
    assert.equal(viennaDateKey(new Date("2026-01-08T22:30:00Z")), "2026-01-08");
  });
  it("does not borrow from another grade when fewer than ten are available", () => {
    assert.equal(selectDailyChallenge(corpus(2), 1, "2026-10-08").length, 0);
  });
});
describe("practice parameter contract", () => {
  it("forged modes, directions and chapters cannot cross the approved set", () => {
    assert.equal(practiceMode("speed"), "full"); assert.equal(practiceDirection("anything"), "auto");
    assert.deepEqual(selectedChapters("g2-u01,g3-u01,g2-u01", ["g2-u01"]), ["g2-u01"]);
    assert.deepEqual(selectedChapters("g3-u01", ["g2-u01"]), []);
  });
  it("sprint samples ten without replacement or input mutation", () => {
    const items = corpus(1).slice(0, 20), before = [...items];
    const sprint = sprintWords(items, () => .3);
    assert.equal(sprint.length, 10); assert.equal(new Set(sprint.map((x) => x.id)).size, 10);
    assert.deepEqual(items, before); assert.notDeepEqual(sprint, items.slice(0, 10));
  });
  it("MC has four authored options and exactly one headword answer throughout the corpus", () => {
    for (const grade of [1, 2, 3, 4]) for (const item of corpus(grade)) {
      const bank = multipleChoiceBank(item as VocabItem);
      assert.equal(bank.length, 4, item.id); assert.equal(new Set(bank.map((x) => x.toLowerCase())).size, 4, item.id);
      assert.equal(bank.filter((x) => gradeVocab(item, x, "definition").tier === "correct").length, 1, item.id);
    }
  });
});
