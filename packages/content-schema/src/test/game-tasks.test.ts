import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  GameTaskV2,
  GameTasksFileV2,
  deriveGapHints,
  renderTaskText,
  fixedFormOf,
  seededShuffle,
  taskInvariantErrors,
} from "../game-tasks.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}
function ok(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, true, msg);
}

// a valid task per kind (spread `over` to mutate for red cases)
const CH = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "text" }, storyDe: "Frag.", kind: "choice", options: ["a", "b", "c"], answer: "a", ...over });
const WH = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "entity", showsDe: "zeigt 3" }, skins: ["moths"], storyDe: "Ruf.", kind: "wheel", variant: "digit-to-word", shown: "3", values: ["two", "three", "four"], answer: "three", ...over });
const SP = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "quickfire", stimulus: { type: "text" }, storyDe: "Buchstabiere.", kind: "spell", answer: "pen", extraLetters: "ta", ...over });
const OR = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "rescue", stimulus: { type: "text" }, storyDe: "Bau.", kind: "order", orderedChips: ["This", "is", "my", "book"], ...over });
const OD = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "encounter", stimulus: { type: "text" }, storyDe: "Was passt nicht?", kind: "oddone", select: "odd", items: ["pen", "pencil", "chair"], correct: ["chair"], ...over });
const MI = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "entity", showsDe: "schreibt einen Satz" }, skins: ["tafel"], evidence: ["This is a rubber"], storyDe: "Fehler?", kind: "mistake", sentence: ["This", "is", "a", "rubber"], errorIndex: 3, fix: { mode: "replace", correction: "ruler" }, correctionOptions: ["ruler", "pen", "book"], ...over });
const ME = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "entity", showsDe: "schreibt drei Zahlen" }, skins: ["tafel"], evidence: ["3", "7", "9"], storyDe: "Paare.", kind: "memory", pairs: [{ a: "3", b: "three" }, { a: "7", b: "seven" }, { a: "9", b: "nine" }], ...over });
const TY = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "boss", stimulus: { type: "text" }, storyDe: "Grüße.", kind: "typed", answer: "hello", ...over });

/** L2-M-a: die Zuordnungs-Karte. Zwei OFFENE Spalten, 2-4 Paare. */
const MA = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "encounter", form: "match-it", stimulus: { type: "entity", showsDe: "Sie halten Schilder hoch" }, skins: ["erdmaennchen"], storyDe: "Bring die Schilder zurück!", kind: "match", pairs: [{ left: "The monkey", right: "in the tree" }, { left: "The penguin", right: "in the water" }], ...over });

test("gameTasks@2 — every kind's valid shape parses", () => {
  for (const t of [CH(), WH(), SP(), OR(), OD(), MI(), ME(), TY(), MA()]) {
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
  // L2-M-a: die zwei Invarianten der Zuordnungs-Karte. Ohne diese Zeilen waere
  // ein Tamper, der `taskInvariantErrors` die beiden `errs.push` nimmt, in der
  // ganzen Batterie GRUEN geblieben — der blinde Leser hat genau das gefunden.
  red(GameTaskV2.safeParse(MA({ pairs: [{ left: "The monkey", right: "in the tree" }, { left: "The monkey", right: "in the water" }] })), "match duplicate on the left");
  red(GameTaskV2.safeParse(MA({ pairs: [{ left: "The monkey", right: "in the tree" }, { left: "The penguin", right: "in the tree" }] })), "match duplicate on the right");
  red(GameTaskV2.safeParse(MA({ pairs: [{ left: "tree", right: "Tree" }, { left: "The penguin", right: "in the water" }] })), "a match pair that answers itself");
  red(GameTaskV2.safeParse(MA({ pairs: [{ left: "a", right: "b" }, { left: "c", right: "d" }, { left: "e", right: "f" }, { left: "g", right: "h" }, { left: "i", right: "j" }] })), "match with five pairs");
});

// a restore fixture, needed by the form law below (the shipped battery has nine
// of them and the kind's ask is fixed by its own machine)
const RE = (over: Record<string, unknown> = {}) => ({ id: "t1", use: "encounter", stimulus: { type: "entity", showsDe: "steht blass da" }, skins: ["obj_book"], storyDe: "Sag, was es ist!", kind: "restore", nameOptions: ["book", "pen", "desk", "hat"], name: "book", colourAskDe: "Ich war blau wie der Himmel!", colourOptions: ["blue", "red", "brown"], colour: "blue", ...over });

test("gameTasks@2 — THE FORM LAW (R5-W2 · G1): a declared ask its widget can carry", () => {
  // WHY THIS LAW: ch01's field palette is capped at four kinds on purpose (doc 41
  // §1), so `form` is the only axis variety can live on — and the variety laws
  // COMPUTE on it. A wrong `form` therefore buys a green check for a battery that
  // repeats itself, which is worse than declaring nothing. ONE table carries the
  // legality (FORM_KINDS: which widgets can express which ask); the kinds whose
  // ask is fixed by their own machine fall out of it, see fixedFormOf below.
  ok(GameTaskV2.safeParse(CH({ form: "command" })), "a choice card may ask a command");
  ok(GameTaskV2.safeParse(CH({ form: "pick-correct-form" })), "…or which rendering is right");
  ok(GameTaskV2.safeParse(WH({ form: "number-transcode" })), "a wheel transcodes numbers");
  ok(GameTaskV2.safeParse(RE({ form: "name-it" })), "a restore names its being");
  ok(GameTaskV2.safeParse(OD({ form: "belongs-or-not" })), "an oddone judges membership");
  // no form at all stays legal — the boss/finale battery is another session's
  ok(GameTaskV2.safeParse(MI()), "a boss card needs no form (the gate scopes the demand to the field)");

  red(GameTaskV2.safeParse(CH({ form: "belongs-or-not" })), "a 3-option choice cannot pose a set question");
  red(GameTaskV2.safeParse(CH({ form: "number-transcode" })), "only a wheel transcodes");
  red(GameTaskV2.safeParse(OD({ form: "name-it" })), "an oddone cannot ask for a label");
  red(GameTaskV2.safeParse(WH({ form: "count-it" })), "a wheel's ask is fixed by its machine");
  red(GameTaskV2.safeParse(RE({ form: "state-it" })), "a restore's ask is fixed by its machine");
  red(GameTaskV2.safeParse(CH({ exercises: ["g1u01.w.pen", "g1u01.w.pen"] })), "duplicate exercises id");

  // …and the same table answers "is this kind's ask the author's choice at all?".
  // Derived, not declared twice: the first draft of this law WAS a second table
  // with its own guard, and the tamper deleted the guard without turning a single
  // test red. FORM_KINDS was already doing the work.
  assert.equal(fixedFormOf("restore"), "name-it", "a restore can only name");
  assert.equal(fixedFormOf("wheel"), "number-transcode", "a wheel can only transcode");
  assert.equal(fixedFormOf("oddone"), "belongs-or-not", "an oddone can only judge membership");
  assert.equal(fixedFormOf("choice"), undefined, "a choice card's ask IS the author's choice");
  assert.equal(fixedFormOf("typed"), undefined, "so is a typed card's");
});

test("gameTasks@2 — THE BOSS-EVIDENCE LAW (R3-12): the card asks about the world", () => {
  // Koki's 11.48.59 / 11.50.26: the card said the Tafel had scribbled four words
  // and the board was blank. A boss card of an evidence kind must put its
  // material ON the guardian, and must ask about nothing else.
  const noEvidence = MI();
  delete (noEvidence as Record<string, unknown>).evidence;
  red(GameTaskV2.safeParse(noEvidence), "boss mistake card without evidence");
  red(GameTaskV2.safeParse(ME({ evidence: ["3", "7"] })), "evidence missing a number the card pairs");
  red(GameTaskV2.safeParse(MI({ evidence: ["Something else entirely"] })), "evidence that does not show the sentence");
  red(GameTaskV2.safeParse(CH({ evidence: ["a"] })), "a kind that asks about no written material");
  // an evidence kind OFF the boss needs none — the law is about the guardian
  ok(GameTaskV2.safeParse(OD()), "an encounter oddone needs no board");
  // …and the typed console card is exempt by kind, boss or not (passover W4)
  ok(GameTaskV2.safeParse(TY()), "the typed finale card carries no evidence");
});

test("gameTasks@2 — THE BINDING LAW (PB-F1): a card that claims a being must name it", () => {
  // an entity stimulus without skins is how a pencil came to ask about a rubber
  const unbound = WH();
  delete (unbound as Record<string, unknown>).skins;
  red(GameTaskV2.safeParse(unbound), "entity stimulus without skins");
  // …and the converse: a fallback card may not be bound to a being it never shows
  red(GameTaskV2.safeParse(CH({ skins: ["pencil"] })), "skins on a text stimulus");
  red(GameTaskV2.safeParse(WH({ skins: ["moths", "moths"] })), "duplicate skin");
  red(GameTaskV2.safeParse(WH({ phases: ["p1", "p1"] })), "duplicate phase");
  red(GameTaskV2.safeParse(WH({ skins: [] })), "empty skins list");
  // the bound shape parses, with and without a phase scope
  assert.equal(GameTaskV2.safeParse(WH({ skins: ["moths"], phases: ["p2"] })).success, true);
  assert.equal(GameTaskV2.safeParse(WH()).success, true);
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
  // R5-W3 · G2: the fix buttons are half the card — a projection without them
  // asks a blind solver to judge a task no child plays (skins.tsx renders them)
  assert.match(renderTaskText(GameTaskV2.parse(MI())), /Verbesserungen: /);
  assert.match(renderTaskText(GameTaskV2.parse(ME())), /Paare/);
  assert.match(renderTaskText(GameTaskV2.parse(TY())), /Grüße\./);
  // stimulus surfaces in the projection
  assert.match(renderTaskText(GameTaskV2.parse(MI())), /\[schreibt einen Satz\]/);
  // R3-12: the guardian's board is part of the student's surface
  assert.match(renderTaskText(GameTaskV2.parse(MI())), /\[auf der Tafel steht: This is a rubber\]/);
  assert.match(renderTaskText(GameTaskV2.parse(WH())), /\[zeigt 3\]/);
});

test("gameTasks@2 — the ch01 calibration exemplars all parse + cover every kind", () => {
  const url = new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json", import.meta.url);
  const raw = JSON.parse(fs.readFileSync(fileURLToPath(url), "utf8"));
  const r = GameTasksFileV2.safeParse(raw);
  assert.equal(r.success, true, `exemplars must parse: ${r.success ? "" : JSON.stringify(r.error.issues)}`);
  if (!r.success) return;
  const kinds = new Set(r.data.items.map((i) => i.kind));
  // PK-R3b · R3-13 — the DISTRIBUTION MAP (doc 41 §1) decides what ch01 carries,
  // so this list is the law rather than an inventory. ch01 is the tutorial: its
  // FIELD serves choice · wheel · restore · oddone, the boss keeps its scripted
  // ritual (mistake · order · memory) and the finale its typed word.
  // `spell` deliberately LEFT the chapter — it debuts in ch02's field — which is
  // why this assertion is written as an exact set: a kind quietly reappearing in
  // ch01 is as much a regression as one quietly vanishing.
  assert.deepEqual(
    [...kinds].sort(),
    ["choice", "memory", "mistake", "oddone", "order", "restore", "typed", "wheel"],
    "ch01 carries exactly the kinds doc 41 §1 allows it",
  );
  // every exemplar is invariant-clean (belt and braces beside the superRefine)
  for (const it of r.data.items) assert.deepEqual(taskInvariantErrors(it), [], `${it.id} invariants`);
});
