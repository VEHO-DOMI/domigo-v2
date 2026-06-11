import assert from "node:assert/strict";
import { test } from "node:test";
import { applyBoxesOverlay, extractGrammarBoxes } from "../grammar-boxes.ts";

const REF = "g2/sb/More 2 SB Unit 3.txt";

test("bare GRAMMAR heading: title = next non-empty line", () => {
  const text = [
    "Some exercise text.",
    "GRAMMAR",
    "should / shouldn't",
    "▶️ Lies die Beispielsätze.",
    "We should go home – it's late.",
    "We shouldn't go in there – it's dangerous.",
    "",
    "SPEAKING",
    "Talk to a partner.",
  ].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0]!.title, "should / shouldn't");
  assert.equal(boxes[0]!.ref, `${REF}#grammar-1`);
  assert.ok(boxes[0]!.lines.some((l) => l.includes("We should go home")));
  assert.ok(!boxes[0]!.lines.some((l) => l.includes("Talk to a partner")));
});

test("inline GRAMMAR: <title> heading", () => {
  const text = [
    "GRAMMAR: Present perfect with already / yet",
    "I have already done my homework.",
    "Have you finished yet?",
  ].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0]!.title, "Present perfect with already / yet");
  assert.equal(boxes[0]!.lines.length, 2);
});

test("GRAMMAR CHANT is not a box and terminates a body", () => {
  const text = [
    "GRAMMAR",
    "should / shouldn't",
    "We should go home.",
    "GRAMMAR CHANT: It's late!",
    "chant line one",
  ].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  assert.equal(boxes.length, 1);
  assert.ok(!boxes[0]!.lines.some((l) => l.includes("chant line")));
});

test("verbatim-duplicated passage dedupes to one box; ordinals stable", () => {
  const box = ["GRAMMAR", "should / shouldn't", "We should go home – it's late.", "What should I do?"];
  // first occurrence absorbs extra trailing text before its terminator (real
  // transcript shape) — prefix dedupe must still fire on the second copy
  const text = [...box, "Other text between.", ...box, "GRAMMAR", "Past simple", "I walked home."].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  assert.equal(boxes.length, 2);
  assert.equal(boxes[0]!.title, "should / shouldn't");
  assert.equal(boxes[1]!.title, "Past simple");
  assert.equal(boxes[1]!.ref, `${REF}#grammar-2`);
});

test("terminators: next GRAMMAR, page marker, short all-caps section, 60-line cap", () => {
  const long = Array.from({ length: 80 }, (_, i) => `line ${i}`);
  const text = [
    "GRAMMAR",
    "Box one",
    "body a",
    "Page 28–29",
    "GRAMMAR",
    "Box two",
    "body b",
    "MORE FUN WITH FIDO!",
    "GRAMMAR",
    "Box three",
    ...long,
  ].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  assert.equal(boxes.length, 3);
  assert.deepEqual(boxes[0]!.lines, ["body a"]);
  assert.deepEqual(boxes[1]!.lines, ["body b"]);
  assert.equal(boxes[2]!.lines.length, 60);
});

test("overlay: drop keeps remaining ordinals; add continues numbering", () => {
  const text = ["GRAMMAR", "One", "a", "GRAMMAR", "Two", "b"].join("\n");
  const boxes = extractGrammarBoxes(text, REF);
  const out = applyBoxesOverlay(boxes, REF, {
    [REF]: { drop: [1], add: [{ title: "Manual", lines: ["added"] }] },
  });
  assert.equal(out.length, 2);
  assert.equal(out[0]!.ordinal, 2); // ref stability: ordinal 2 survives the drop unchanged
  assert.equal(out[0]!.ref, `${REF}#grammar-2`);
  assert.equal(out[1]!.ordinal, 3);
  assert.equal(out[1]!.title, "Manual");
  // no overlay for the file → untouched
  assert.deepEqual(applyBoxesOverlay(boxes, REF, null), boxes);
  assert.deepEqual(applyBoxesOverlay(boxes, REF, { other: { drop: [1] } }), boxes);
});
