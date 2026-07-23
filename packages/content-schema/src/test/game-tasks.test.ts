import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  GameTaskV2,
  GameTasksFileV2,
  deriveGapHints,
  renderTaskText,
  seededShuffle,
  taskInvariantErrors,
} from "../game-tasks.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}

// a valid task per kind (spread `over` to mutate for red cases)
const CH = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "text" }, storyDe: "Frag.", kind: "choice", options: ["a", "b", "c"], answer: "a", ...over });
const WH = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "entity", showsDe: "zeigt 3" }, storyDe: "Ruf.", kind: "wheel", variant: "digit-to-word", shown: "3", values: ["two", "three", "four"], answer: "three", ...over });
const SP = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "text" }, storyDe: "Buchstabiere.", kind: "spell", answer: "pen", extraLetters: "ta", ...over });
const OR = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "rescue", stimulus: { type: "text" }, storyDe: "Bau.", kind: "order", orderedChips: ["This", "is", "my", "book"], ...over });
const OD = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "encounter", stimulus: { type: "text" }, storyDe: "Was passt nicht?", kind: "oddone", select: "odd", items: ["pen", "pencil", "chair"], correct: ["chair"], ...over });
const MI = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "image", stem: "vocab_ruler", altDe: "ein Lineal" }, storyDe: "Fehler?", kind: "mistake", sentence: ["This", "is", "a", "rubber"], errorIndex: 3, fix: { mode: "replace", correction: "ruler" }, correctionOptions: ["ruler", "pen", "book"], ...over });
const ME = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "text" }, storyDe: "Paare.", kind: "memory", pairs: [{ a: "3", b: "three" }, { a: "7", b: "seven" }, { a: "9", b: "nine" }], ...over });
const TY = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "text" }, storyDe: "Grüße.", kind: "typed", answer: "hello", ...over });

test("gameTasks@2 — every kind's valid shape parses", () => {
  for (const t of [CH(), WH(), SP(), OR(), OD(), MI(), ME(), TY()]) {
    const r = GameTaskV2.safeParse(t);
    assert.equal(r.success, true, `${(t as { kind: string }).kind} should parse: ${r.success ? "" : JSON.stringify(r.error.issues)}`);
  }
});

test("gameTasks@2 — cross-field invariants fire (red-first tamper block)", () => {
  // these MUST fail — each was verified red before taskInvariantErrors existed
  red(GameTaskV2.safeParse(CH({ answer: "z" })), "choice answer not among options");
  red(GameTaskV2.safeParse(CH({ options: ["a", "a", "b"] })), "duplicate option");
  red(GameTaskV2.safeParse(WH({ answer: "nine" })), "wheel answer not on the wheel");
  red(GameTaskV2.safeParse(SP({ answer: "school book" })), "spell answer with a space");
  red(GameTaskV2.safeParse(SP({ extraLetters: "" })), "spell without distractor letters");
  red(GameTaskV2.safeParse(OR({ orderedChips: ["a", "a"] })), "order needs 2 distinct chips");
  red(GameTaskV2.safeParse(OD({ correct: ["desk"] })), "oddone correct not among items");
  red(GameTaskV2.safeParse(OD({ correct: ["pen", "chair"] })), "odd select needs exactly one correct");
  red(GameTaskV2.safeParse(MI({ errorIndex: 9 })), "mistake errorIndex out of range");
  red(GameTaskV2.safeParse(MI({ fix: { mode: "replace" } })), "mistake replace without correction");
  red(GameTaskV2.safeParse(MI({ fix: { mode: "remove", correction: "x" } })), "mistake remove with a stray correction");
  red(GameTaskV2.safeParse(ME({ pairs: [{ a: "3", b: "three" }, { a: "3", b: "seven" }, { a: "9", b: "nine" }] })), "memory duplicate on a");
});

test("gameTasks@2 — a missing stimulus is rejected (F22/G10 law)", () => {
  const noStim = CH();
  delete (noStim as Record<string, unknown>).stimulus;
  red(GameTaskV2.safeParse(noStim), "stimulus is required");
});

test("gameTasks@2 — the file wrapper catches duplicate ids", () => {
  const file = { schema: "gameTasks@2", chapter: "ch01", unit: "g1-u01", items: [CH({ id: "dup" }), TY({ id: "dup" })] };
  red(GameTasksFileV2.safeParse(file), "duplicate task id");
});

test("deriveGapHints — first letter + per-word letter counts (F18 ladder data)", () => {
  assert.deepEqual(deriveGapHints("hello"), { firstLetter: "h", words: [5], letters: 5 });
  assert.deepEqual(deriveGapHints("Come in!"), { firstLetter: "C", words: [4, 2], letters: 6 });
  assert.deepEqual(deriveGapHints("  a  "), { firstLetter: "a", words: [1], letters: 1 });
});

test("seededShuffle — deterministic permutation (no Math.random)", () => {
  const a = ["1", "2", "3", "4", "5"];
  assert.deepEqual(seededShuffle(a, "seed"), seededShuffle(a, "seed"), "same seed → same order");
  assert.notDeepEqual(seededShuffle(a, "seed"), seededShuffle(a, "other"), "different seed → different order (this input)");
  assert.deepEqual([...seededShuffle(a, "seed")].sort(), [...a].sort(), "it is a permutation");
  assert.deepEqual(a, ["1", "2", "3", "4", "5"], "input is not mutated");
});

test("renderTaskText — the projection shows the student's surface, per kind", () => {
  assert.match(renderTaskText(GameTaskV2.parse(CH())), /Optionen: /);
  assert.match(renderTaskText(GameTaskV2.parse(WH())), /Rad zeigt „3"/);
  assert.match(renderTaskText(GameTaskV2.parse(SP())), /Buchstaben: /);
  assert.match(renderTaskText(GameTaskV2.parse(OR())), /Chips: /);
  assert.match(renderTaskText(GameTaskV2.parse(OD())), /Was passt NICHT\?/);
  assert.match(renderTaskText(GameTaskV2.parse(MI())), /Satz: 0:This/);
  assert.match(renderTaskText(GameTaskV2.parse(ME())), /Paare/);
  assert.match(renderTaskText(GameTaskV2.parse(TY())), /Grüße\./);
  // stimulus surfaces in the projection
  assert.match(renderTaskText(GameTaskV2.parse(MI())), /\[Bild: ein Lineal\]/);
  assert.match(renderTaskText(GameTaskV2.parse(WH())), /\[zeigt 3\]/);
});

test("gameTasks@2 — the ch01 calibration exemplars all parse + cover every kind", () => {
  const url = new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url);
  const raw = JSON.parse(fs.readFileSync(fileURLToPath(url), "utf8"));
  const r = GameTasksFileV2.safeParse(raw);
  assert.equal(r.success, true, `exemplars must parse: ${r.success ? "" : JSON.stringify(r.error.issues)}`);
  if (!r.success) return;
  const kinds = new Set(r.data.items.map((i) => i.kind));
  for (const k of ["choice", "wheel", "spell", "order", "oddone", "mistake", "memory", "typed"]) {
    assert.ok(kinds.has(k as never), `exemplar set must include a ${k}`);
  }
  // every exemplar is invariant-clean (belt and braces beside the superRefine)
  for (const it of r.data.items) assert.deepEqual(taskInvariantErrors(it), [], `${it.id} invariants`);
});
