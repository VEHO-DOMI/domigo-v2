import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { createRequire } from "node:module";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import type { StudentView } from "../student-view.ts";
import { resetStudioFixture } from "../../app/woerterbuch/studio-test-fixture.mjs";

// Keep the production practice loader, corpus, overlays and pool assignment.
// Only database reads are synthetic, as in the Daily reserve regression test.
const reserveFixture = { byClass: new Map<string, Set<string>>(), reads: [] as string[], fail: false };
(globalThis as unknown as { __grammarReserveFixture: typeof reserveFixture }).__grammarReserveFixture = reserveFixture;
const fixtureDbURL = import.meta.resolve("@domigo/db");
type ResolveResult = { url: string; shortCircuit?: boolean };
const { registerHooks } = createRequire(import.meta.url)("node:module") as {
  registerHooks(hooks: { resolve(specifier: string, context: unknown, nextResolve: (specifier: string, context: unknown) => ResolveResult): ResolveResult }): void;
};
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier !== "@domigo/db") return nextResolve(specifier, context);
  const source = `export * from ${JSON.stringify(fixtureDbURL)};
    export const listReservedForClass = async (_db, _scope, classId) => {
      const f = globalThis.__grammarReserveFixture; f.reads.push(classId);
      if (f.fail) throw new Error('synthetic grammar reserve failure');
      return f.byClass.get(classId) ?? new Set();
    };`;
  return { url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true };
} });
const { loadPracticeWords } = await import("../../app/practice/load-practice.ts");
const child = (grade: number, classId = "grammar-class-a-synthetic") => ({
  kind: "student", grades: [grade], player: { userId: "grammar-child-synthetic", classId, classScope: {} },
}) as StudentView;
const preview = (grade: number) => ({ kind: "preview", grades: [grade], teacher: {} }) as StudentView;
const chaptersFor = (grade: number) => listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
const grammarFor = (chapters: readonly string[]) => chapters.flatMap((slug) => loadUnit(slug).grammar);

beforeEach(() => {
  resetStudioFixture(); reserveFixture.byClass.clear(); reserveFixture.reads.length = 0; reserveFixture.fail = false;
});

describe("F3 grammar practice loader — real corpus with synthetic reserve DB", () => {
  for (const grade of [1, 2, 3, 4]) it(`F3 reserve: year ${grade} excludes only the current class's reserved grammar`, async () => {
    const expected = grammarFor(chaptersFor(grade));
    assert.ok(expected.length > 2, `year ${grade} needs real positive and negative controls`);
    const firstId = expected[0]!.id, secondId = expected[1]!.id;
    reserveFixture.byClass.set("grammar-class-a-synthetic", new Set([firstId]));
    reserveFixture.byClass.set("grammar-class-b-synthetic", new Set([secondId]));
    const a = await loadPracticeWords(child(grade), grade);
    const b = await loadPracticeWords(child(grade, "grammar-class-b-synthetic"), grade);
    assert.deepEqual(a.grammar, expected.filter((item) => item.id !== firstId));
    assert.deepEqual(b.grammar, expected.filter((item) => item.id !== secondId));
    assert.equal(a.grammar.some((item) => item.id === firstId), false, "held-out assessment item must be absent");
    assert.equal(a.grammar.some((item) => item.id === secondId), true, "another class's reserve must remain available");
    assert.deepEqual(reserveFixture.reads, ["grammar-class-a-synthetic", "grammar-class-b-synthetic"]);
  });

  it("F3 grade: year 2 stays within year 2, including forged foreign Chapter parameters", async () => {
    const expected = grammarFor(chaptersFor(2));
    assert.ok(expected.length > 0);
    const foreign = [...chaptersFor(1), ...chaptersFor(3)];
    assert.ok(foreign.length > 0);
    for (const chapters of [undefined, [...chaptersFor(2), ...foreign], listApprovedUnits()]) {
      const { grammar } = await loadPracticeWords(child(2), 2, chapters);
      assert.ok(grammar.every((item) => item.id.startsWith("g2u")), "year 2 must never load year 1, 3 or 4 grammar");
      assert.deepEqual(grammar, expected);
    }
    assert.deepEqual((await loadPracticeWords(child(2), 2, foreign)).grammar, []);
  });

  it("F3 chapters: exact approved subset, repeated/foreign parameters and empty selection", async () => {
    const own = chaptersFor(2), selected = own[0]!;
    assert.ok(own.length > 1, "subset test requires an unselected approved Chapter");
    const expected = grammarFor([selected]), reservedId = expected[0]!.id;
    reserveFixture.byClass.set("grammar-class-a-synthetic", new Set([reservedId]));
    const requested = [selected, selected, chaptersFor(1)[0]!, chaptersFor(3)[0]!, "g2-u99"];
    const result = (await loadPracticeWords(child(2), 2, requested)).grammar;
    assert.equal(result.length, expected.length - 1, "only the requested Chapter, minus its reserved item, belongs in the round");
    assert.deepEqual(result, expected.filter((item) => item.id !== reservedId));
    assert.deepEqual((await loadPracticeWords(child(2), 2, [])).grammar, []);
    assert.deepEqual((await loadPracticeWords(child(2), 2, ["g2-u99"])).grammar, []);
  });

  it("F3 outage: child reserve failure rejects; preview skips reserve reads and keeps the full grammar set", async () => {
    reserveFixture.fail = true;
    const selected = chaptersFor(2).slice(0, 1);
    const result = await loadPracticeWords(preview(2), 2, selected);
    assert.deepEqual(result.grammar, grammarFor(selected));
    assert.deepEqual(reserveFixture.reads, []);
    await assert.rejects(loadPracticeWords(child(2), 2, selected), /synthetic grammar reserve failure/);
    assert.deepEqual(reserveFixture.reads, ["grammar-class-a-synthetic"]);
  });
});
