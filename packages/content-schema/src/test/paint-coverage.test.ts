import { test } from "node:test";
import assert from "node:assert/strict";
import { readZooJson, readZooSource } from "../../../game-paint/src/test-fixtures/zoo/read-fixture.ts";
import { checkPaintCoverage, PaintCoveragePolicy, PaintCoveragePlan, coverageAnswerWords } from "../paint-coverage.ts";
import type { PaintCoverageInput, CoverageEntity } from "../paint-coverage.ts";
import type { GameTaskV2 } from "../game-tasks.ts";
const card = (id: string, answer = "A tree."): GameTaskV2 => ({
  id, kind: "choice", form: "name-it", use: "encounter", skins: ["tree-speaker"], phases: ["p1"],
  stimulus: { type: "entity", showsDe: "Eine Figur steht vor dir." }, storyDe: "Nenne die Figur.",
  options: [answer, "A bus.", "A dog."], answer,
});
const fixture = (): PaintCoverageInput => {
  const wordbank = [{ id: "g1u02.w.tree", en: "tree", forms: ["tree", "trees"] }];
  return {
    chapter: "ch02", policy: { minDistinctAnsweredCards: 2, requireCompleteRoute: true, requireWorldEvidence: true },
    wordbank, sources: { "wordbank.json": JSON.stringify({ entries: wordbank }) },
    plan: {
      schema: "paintCoverage@1", chapter: "ch02", targets: [{
        id: "g1u02.w.tree", term: "tree", kind: "wordbank",
        requiredTaskIds: ["a", "b"], source: { kind: "wordbank", path: "wordbank.json", entryId: "g1u02.w.tree" }
      }]
    },
    items: [card("a"), card("b")],
    phases: [{
      id: "p1", rows: [".....", "#####"], entities: [{
        id: "speaker", role: "gunner", skin: "tree-speaker", c: 1, r: 0,
        params: { taskSequenceV2: { requiredIds: ["a", "b"], variantIds: ["optional"], reserveSlots: [{ taskId: "a", countsAsRequired: false }] } }
      }]
    }],
    played: [{ phaseId: "p1", solvedTaskIds: ["a", "b"], sceneBeatsSeen: [], exited: true }],
    usesForEntity: e => e.role === "gunner" ? ["encounter"] : [],
  };
};
const errors = (input: PaintCoverageInput): string[] => checkPaintCoverage(input).errors;
const planOf = (input: PaintCoverageInput) => PaintCoveragePlan.parse(input.plan);
test("coverage opt-in and plan survive JSON/schema roundtrip; malformed policy is rejected", () => {
  const input = fixture();
  assert.deepEqual(PaintCoveragePolicy.parse(JSON.parse(JSON.stringify(input.policy))), input.policy);
  assert.deepEqual(PaintCoveragePlan.parse(JSON.parse(JSON.stringify(input.plan))), input.plan);
  assert.deepEqual(errors(input), []);
  assert.equal(PaintCoveragePolicy.safeParse({ minDistinctAnsweredCards: 1, requireCompleteRoute: true, requireWorldEvidence: true }).success, false);
  assert.equal(PaintCoveragePolicy.safeParse({ minDistinctAnsweredCards: 2, requireCompleteRoute: "true", requireWorldEvidence: true }).success, false);
  assert.deepEqual(errors({ ...input, policy: undefined, plan: null, played: [] }), []);
});
test("tamper: one card, two tokens and a repeated replay ID never count as two", () => {
  const input = fixture(), plan = planOf(input);
  plan.targets[0]!.requiredTaskIds = ["a", "a"];
  input.plan = plan;
  input.items = [card("a", "A tree and two trees.")];
  input.phases[0]!.entities[0]!.params!.taskSequenceV2!.requiredIds = ["a"];
  input.played = [{ phaseId: "p1", solvedTaskIds: ["a", "a"], sceneBeatsSeen: [], exited: true }];
  assert.match(errors(input).join("\n"), /1\/2 distinct required answer cards/);
  assert.deepEqual(checkPaintCoverage(input).targets[0]!.answered, ["a"]);
});
test("tamper: distractors and exercises declarations are not accepted answers", () => {
  const input = fixture(), wrong = card("b", "A bus.");
  if (wrong.kind !== "choice")
    throw new Error("fixture");
  wrong.options = ["A tree.", "A bus.", "A dog."];
  wrong.exercises = ["g1u02.w.tree"];
  input.items = [card("a"), wrong];
  assert.match(errors(input).join("\n"), /absent from b's accepted answer surface/);
});
test("tamper: optional and reserve slots cannot satisfy a required application", () => {
  const input = fixture();
  input.phases[0]!.entities[0]!.params!.taskSequenceV2 = { requiredIds: ["a"], variantIds: ["b"], reserveSlots: [{ taskId: "b", countsAsRequired: false }] };
  assert.match(errors(input).join("\n"), /counts optional\/reserve\/unbound b as required/);
});
test("tamper: wrong speaker use or phase makes an apparently answered card unservable", () => {
  const input = fixture();
  input.items[1]!.use = "boss";
  assert.match(errors(input).join("\n"), /required task b is not servable/);
  input.items[1]!.use = "encounter";
  input.items[1]!.phases = ["p2"];
  assert.match(errors(input).join("\n"), /required task b is not servable/);
});
test("tamper: planned IDs and a completed exit are not evidence that a card was solved", () => {
  const input = fixture();
  input.played = [{ phaseId: "p1", solvedTaskIds: ["a"], sceneBeatsSeen: [], exited: true }];
  assert.match(errors(input).join("\n"), /required task b was not solved/);
  assert.match(errors(input).join("\n"), /1\/2 distinct solved answer cards/);
});
test("tamper: missing world actor or missing seen snapshot fails even with two solved IDs", () => {
  const input = fixture(), e = input.phases[0]!.entities[0]!;
  e.params!.stageV2 = {
    actors: [{ id: "tree", skin: "tree" }], props: [], beats: [
      { id: "tree-b", viewId: "tree-view", taskIds: ["b"], targetPositions: [{ actorId: "tree", x: .5, y: .8 }], relations: [] },
    ]
  };
  input.items[1]!.sceneRef = { entityId: "speaker", station: 0, beatId: "tree-b", viewId: "tree-view" };
  assert.match(errors(input).join("\n"), /scene snapshot was never seen/);
  input.played[0]!.sceneBeatsSeen = ["speaker:tree-b:tree-view"];
  assert.deepEqual(errors(input), []);
  e.params!.stageV2.actors = [];
  assert.match(errors(input).join("\n"), /scene has no built actors\/beat/);
});
test("tamper: showsDe without a world speaker cannot buy evidence", () => {
  const input = fixture();
  input.phases[0]!.entities[0]!.c = 100;
  assert.match(errors(input).join("\n"), /speaker lies outside the world/);
});
test("tamper: only accepted wordbank forms count for Let us out", () => {
  const input = fixture(), plan = planOf(input), word = { id: "g1u02.w.to-let-somebody-out", en: "to let somebody out", forms: ["let us out"] };
  input.wordbank = [word];
  input.sources = { "wordbank.json": JSON.stringify({ entries: [word] }) };
  plan.targets[0] = { id: word.id, term: word.en, kind: "wordbank", requiredTaskIds: ["a", "b"], source: { kind: "wordbank", path: "wordbank.json", entryId: word.id } };
  input.plan = plan;
  input.items = [card("a", "Let us out!"), card("b", "Let us out!")];
  assert.deepEqual(errors(input), []);
  word.forms = [];
  input.sources = { "wordbank.json": JSON.stringify({ entries: [word] }) };
  assert.match(errors(input).join("\n"), /absent from a's accepted answer surface/);
});
test("semantic goals need exact printed source and exclude wrong senses", () => {
  const input = fixture(), plan = planOf(input);
  input.wordbank = [];
  input.sources = { "book.txt": "Page 17\nSee a lion.\n[Image description: See a tiger.]" };
  plan.targets = [{
    id: "semantic:see", term: "see", forms: ["see"], kind: "semantic", requiredTaskIds: ["a", "b"],
    source: { kind: "quotation", path: "book.txt", quote: "See a lion." }, excludePhrases: ["let me see"]
  }];
  input.plan = plan;
  input.items = [card("a", "I can see a tree."), card("b", "I can see a lion.")];
  assert.deepEqual(errors(input), []);
  input.items = [input.items[0]!, card("b", "Let me see.")];
  assert.match(errors(input).join("\n"), /absent from b's accepted answer surface/);
  plan.targets[0]!.source = { kind: "quotation", path: "book.txt", quote: "See a tiger." };
  assert.match(errors(input).join("\n"), /printed source does not support semantic:see/);
});
test("full wordbank is required, including separately identified duplicate entries", () => {
  const input = fixture();
  input.wordbank = [...input.wordbank, { id: "g1u02.w.tree-2", en: "tree", forms: ["tree"] }];
  assert.match(errors(input).join("\n"), /wordbank target g1u02.w.tree-2 is missing/);
});
test("repair cards count the corrected sign, and punctuation chips keep a complete question", () => {
  const common = { use: "boss" as const, stimulus: { type: "entity" as const, showsDe: "Das Schild und seine Tiere." }, skins: ["lion"], storyDe: "Prüfe das Schild." };
  const repair: GameTaskV2 = { ...common, id: "repair", kind: "mistake", sentence: ["There", "is", "two", "monkeys", "."], errorIndex: 1, fix: { mode: "replace", correction: "are" } };
  assert.deepEqual(coverageAnswerWords(repair), ["There are two monkeys ."]);
  repair.fix = { mode: "remove" };
  assert.deepEqual(coverageAnswerWords(repair), ["There two monkeys ."]);
  repair.fix = { mode: "add", correction: "not", insertAfter: 1 };
  assert.deepEqual(coverageAnswerWords(repair), ["There is not two monkeys ."]);
});
test("frozen W2-R2 answer/source/binding contract covers 63 targets; this is a static fixture, not a route proof", () => {
  const read = readZooJson;
  const dir = "content/corpus/stories/g1.st.lost-pages/paint/";
  const plan = PaintCoveragePlan.parse(read("docs/design/g1/paint/ch02-dossiers-v2/coverage.json"));
  const level = read(dir + "ch02.level.json");
  const phases = [...level.phases, level.arena, level.bonus] as PaintCoverageInput["phases"];
  const items = read(dir + "ch02.tasks.v2.json").items as GameTaskV2[];
  const sources = Object.fromEntries(plan.targets.map(t => [t.source.path, readZooSource(t.source.path)]));
  const uses = (e: CoverageEntity): string[] => e.role === "guardian" ? ["boss", "finale"]
    : e.role === "scene.stage" ? ["quickfire"] : ["cage", "classmate"].includes(e.role) ? ["rescue"]
      : e.role === "door.trigger" ? ["door"] : ["encounter"];
  // No played IDs are fabricated: disable the played/world requirements only
  // in this explicitly named static test. The CLI always uses the actual policy.
  const checked = checkPaintCoverage({
    chapter: "ch02", policy: { ...read(dir + "ch02.policy.json").coverage, requireCompleteRoute: false, requireWorldEvidence: false },
    plan, wordbank: read("content/corpus/units/g1-u02/wordbank.json").entries, items, phases, played: [], sources, usesForEntity: uses
  });
  assert.deepEqual(checked.errors, []);
  assert.equal(checked.targets.length, 63);
  assert.equal(checked.requiredTaskIds.length, 56);
  assert.equal(checked.targets.filter(t => t.served.length === 2).length, 63);
  assert.equal(checked.targets.flatMap(t => t.answered).length, 0);
});
