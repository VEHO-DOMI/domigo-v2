/** E-4 blind-solve core — frame fidelity, leak guard, triage classes. */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildEngineInput,
  buildSolvePrompt,
  cannedCandidates,
  frameGrammarItem,
  frameVocabItem,
  shuffledOptions,
  triage,
  type GradedCandidate,
} from "../blind-solve.ts";
import { grammarItem, vocabItem } from "./item-fixtures.ts";

// ---------------------------------------------------------------------------
// frames
// ---------------------------------------------------------------------------

test("vocab frame shows d + s + glosses and one text box — never the answers", () => {
  const item = vocabItem({
    gloss: [{ word: "broom", de: "Besen", scope: "s" }],
    sAnswers: [
      { text: "witch", tier: "full" },
      { text: "the witch", tier: "partial" },
    ],
  });
  const frame = frameVocabItem(item);
  assert.equal(frame.format, "vocab-carrier");
  assert.deepEqual(frame.lines, [item.d, item.s]);
  assert.deepEqual(frame.input, { kind: "text", blanks: 1 });
  assert.deepEqual(frame.glosses, ["broom = Besen"]);
  // leak guard: the carrier blanks the headword; nothing in the frame or the
  // prompt built from it may contain an answer or the hint.
  const rendered = buildSolvePrompt(frame);
  for (const leak of ["witch", item.hintDe]) {
    assert.ok(!rendered.includes(leak), `frame leaks "${leak}"`);
  }
});

test("grammar text frame derives blank count from the first full answer (task-ui blankCount)", () => {
  const item = grammarItem({
    id: "g2u03.gi.past-simple.gf.001",
    structureId: "g2u03.s.past-simple",
    prompt: { text: "Yesterday we ___ to school and ___ our friends.", lang: "en", blanks: 2 },
    answers: [{ text: "went | met", tier: "full" }],
  });
  const frame = frameGrammarItem(item);
  assert.ok(frame !== null);
  assert.deepEqual(frame.input, { kind: "text", blanks: 2 });
  assert.equal(frame.structure, "past-simple");
  const rendered = buildSolvePrompt(frame);
  assert.ok(rendered.includes('join the blank fills with " | "'));
  assert.ok(!rendered.includes("went"), "frame leaks the key");
});

test("choice frame reproduces task-ui's seeded option order exactly", () => {
  const item = grammarItem({
    id: "g2u03.gi.should.mc.001",
    format: "multiple-choice",
    prompt: { text: "We ___ go home now.", lang: "en", blanks: 1 },
    answers: [{ text: "should", tier: "full" }],
    distractors: ["would", "did", "are"],
  });
  const frame = frameGrammarItem(item);
  assert.ok(frame !== null && frame.input.kind === "choice");
  const expected = shuffledOptions(["should", "would", "did", "are"], item.id);
  assert.deepEqual(frame.input.options, expected);
  // determinism + permutation (no option lost, none invented, no tier labels)
  assert.deepEqual([...frame.input.options].sort(), ["are", "did", "should", "would"]);
  assert.deepEqual(shuffledOptions(["should", "would", "did", "are"], item.id), expected);
});

test("out-of-scope formats frame to null", () => {
  const item = grammarItem({
    id: "g2u03.gi.should.mt.001",
    format: "matching",
    answers: [],
    pairs: [
      { left: "a", right: "b" },
      { left: "c", right: "d" },
      { left: "e", right: "f" },
    ],
  });
  assert.equal(frameGrammarItem(item), null);
});

test("translation frame carries direction into the task description", () => {
  const item = grammarItem({
    id: "g2u03.gi.should.tr.001",
    format: "translation",
    direction: "enToDe",
    prompt: { text: "We should go home now.", lang: "en", blanks: 0 },
    answers: [{ text: "Wir sollten jetzt nach Hause gehen.", tier: "full" }],
  });
  const frame = frameGrammarItem(item);
  assert.ok(frame !== null);
  assert.ok(buildSolvePrompt(frame).includes("into German"));
});

test("buildEngineInput maps frames onto engine input shapes", () => {
  const text = frameVocabItem(vocabItem());
  assert.deepEqual(buildEngineInput(text, "witch"), { kind: "text", value: "witch" });
  const mc = frameGrammarItem(
    grammarItem({
      id: "g2u03.gi.should.mc.001",
      format: "multiple-choice",
      distractors: ["would", "did", "are"],
    }),
  );
  assert.ok(mc !== null);
  assert.deepEqual(buildEngineInput(mc, "should"), { kind: "choice", value: "should" });
});

// ---------------------------------------------------------------------------
// canned solver
// ---------------------------------------------------------------------------

test("cannedCandidates feed back every authored key (and nothing for keyless items)", () => {
  assert.deepEqual(cannedCandidates(["went | met", "walked | met"]), [
    { answer: "went | met", confidence: 0.99 },
    { answer: "walked | met", confidence: 0.99 },
  ]);
  assert.deepEqual(cannedCandidates([]), []);
});

// ---------------------------------------------------------------------------
// triage classes
// ---------------------------------------------------------------------------

const g = (answer: string, confidence: number, tier: GradedCandidate["tier"]): GradedCandidate => ({
  answer,
  confidence,
  tier,
});

test("class (a): confident best answer graded wrong ⇒ missingVariant", () => {
  const r = triage([g("go home", 0.9, "wrong"), g("to go home", 0.4, "correct")], 2);
  assert.equal(r.missingVariant, true);
});

test("class (a) does not fire on low confidence or non-wrong tiers", () => {
  assert.equal(triage([g("goed", 0.5, "wrong")], 1).missingVariant, false);
  assert.equal(triage([g("go home", 0.9, "close")], 1).missingVariant, false);
});

test("class (b): single full answer + two defensible distinct candidates split correct/wrong ⇒ ambiguousCarrier", () => {
  const r = triage([g("bus", 0.8, "correct"), g("tram", 0.7, "wrong")], 1);
  assert.equal(r.ambiguousCarrier, true);
});

test("class (b) does not fire with multiple authored full answers, low confidence, or same-canon duplicates", () => {
  assert.equal(triage([g("bus", 0.8, "correct"), g("tram", 0.7, "wrong")], 2).ambiguousCarrier, false);
  assert.equal(triage([g("bus", 0.8, "correct"), g("tram", 0.4, "wrong")], 1).ambiguousCarrier, false);
  // "Bus." and "bus" are the same candidate — not two defensible answers
  assert.equal(triage([g("bus", 0.8, "correct"), g("Bus.", 0.7, "wrong")], 1).ambiguousCarrier, false);
});

test("class (c): a plain model miss triggers neither flag", () => {
  const r = triage([g("banana", 0.3, "wrong")], 1);
  assert.deepEqual(r, { missingVariant: false, ambiguousCarrier: false });
});
