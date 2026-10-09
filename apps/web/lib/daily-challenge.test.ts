import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRequire } from "node:module";
import type { VocabItem } from "@domigo/content-schema";
import type { StudentView } from "./student-view.ts";
import { loadUnit, listApprovedUnits } from "@domigo/content-loader";
import { gradeVocab } from "@domigo/engine";
import { dailySeed, selectDailyChallenge } from "./daily-challenge.ts";
import "../app/woerterbuch/studio-test-fixture.mjs";
const { viennaDateKey } = await import("./wort-des-tages.ts");
import { multipleChoiceBank, practiceDirection, practiceMode, selectedChapters, sprintWords } from "../app/practice/options.ts";

// Exercise the production daily loader and content overlays, replacing only DB reads.
const reserveFixture = { byClass: new Map<string, Set<string>>(), reads: [] as string[], fail: false };
(globalThis as unknown as { __dailyReserveFixture: typeof reserveFixture }).__dailyReserveFixture = reserveFixture;
const fixtureDbURL = import.meta.resolve("@domigo/db");
type ResolveResult = { url: string; shortCircuit?: boolean };
const { registerHooks } = createRequire(import.meta.url)("node:module") as {
  registerHooks(hooks: { resolve(specifier: string, context: unknown, nextResolve: (specifier: string, context: unknown) => ResolveResult): ResolveResult }): void;
};
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier !== "@domigo/db") return nextResolve(specifier, context);
  const source = `export * from ${JSON.stringify(fixtureDbURL)};
    export const listReservedForClass = async (_db, _scope, classId) => {
      const f = globalThis.__dailyReserveFixture; f.reads.push(classId);
      if (f.fail) throw new Error('synthetic reserve failure');
      return f.byClass.get(classId) ?? new Set();
    };`;
  return { url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true };
} });
const { loadDailyChallenge } = await import("../app/practice/load-practice.ts");
const child = (grade: number, classId: string) => ({ kind: "student", grades: [grade], player: { userId: "test-child", classId, classScope: {} } }) as StudentView;

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
  for (const grade of [1, 2, 3, 4]) it(`year ${grade}: two classes with different reserves keep the same daily set`, async () => {
    const day = "2026-10-08", expected = selectDailyChallenge(corpus(grade), grade, day);
    reserveFixture.byClass.set("test-class-a", new Set([expected[0]!.id]));
    reserveFixture.byClass.set("test-class-b", new Set([expected[1]!.id, expected[2]!.id]));
    const a = await loadDailyChallenge(child(grade, "test-class-a"), grade, day);
    const b = await loadDailyChallenge(child(grade, "test-class-b"), grade, day);
    assert.deepEqual(a.words, expected); assert.deepEqual(b.words, expected);
    assert.deepEqual(a.availableWords, expected.slice(1));
    assert.deepEqual(b.availableWords, expected.filter((_, i) => i !== 1 && i !== 2));
    assert.equal(a.blockedCount, 1); assert.equal(b.blockedCount, 2);
    reserveFixture.byClass.set("test-class-all", new Set(expected.map((word) => word.id)));
    const all = await loadDailyChallenge(child(grade, "test-class-all"), grade, day);
    assert.deepEqual(all.words, expected); assert.deepEqual(all.availableWords, []); assert.equal(all.blockedCount, 10);
  });
  it("daily preview reads no class reserve; a child reserve outage fails closed", async () => {
    reserveFixture.reads.length = 0;
    reserveFixture.fail = true;
    try {
      const preview = await loadDailyChallenge({ kind: "preview", grades: [2], teacher: {} } as StudentView, 2, "2026-10-08");
      assert.equal(preview.words.length, 10); assert.equal(preview.availableWords.length, 10); assert.equal(preview.blockedCount, 0);
      assert.deepEqual(reserveFixture.reads, []);
      await assert.rejects(loadDailyChallenge(child(2, "test-class-a"), 2, "2026-10-08"), /synthetic reserve failure/);
    } finally { reserveFixture.fail = false; }
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
