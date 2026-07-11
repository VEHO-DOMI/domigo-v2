import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditGrammarItem,
  auditVocabItem,
  expandContractions,
  hasAmbiguousContraction,
} from "../audit-variants.ts";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";

// ── fixtures ─────────────────────────────────────────────────────────────────

const ta = (text: string, tier: "full" | "partial" = "full") => ({ text, tier }) as const;

function vocab(over: Partial<VocabItem> = {}): VocabItem {
  return {
    id: "g2u01.w.test", rev: 1, difficulty: 1,
    presentation: {}, provenance: {},
    w: "to test", g: "testen", d: "to try something out", s: "This is a ___ sentence.", sSource: "invented",
    sAnswers: [ta("test")], dAnswers: [ta("test")],
    translation: { deToEn: [ta("test")], enToDe: [ta("testen")] },
    gloss: [], mc: [], hintDe: null,
    ...over,
  } as unknown as VocabItem;
}

function grammar(over: Partial<GrammarItem> = {}): GrammarItem {
  return {
    id: "g2u01.gi.past-simple.gf.001", structureId: "past-simple", format: "gap-fill",
    rev: 1, difficulty: 1, presentation: {}, provenance: {},
    prompt: { text: "Yesterday I ___ to school.", lang: "en", blanks: 1 },
    answers: [ta("went")], direction: null,
    distractors: [], pairs: [], groups: [], gloss: [],
    hintDe: null, hintEn: null, explainDe: null, explainEn: null, strict: false,
    ...over,
  } as unknown as GrammarItem;
}

// ── contraction helpers ──────────────────────────────────────────────────────

test("expandContractions: unambiguous pairs incl. the won't irregular", () => {
  assert.equal(expandContractions("I don't know."), "i do not know.");
  assert.equal(expandContractions("We're late."), "we are late.");
  assert.equal(expandContractions("It won't rain."), "it will not rain.");
  assert.equal(expandContractions("plain text"), "plain text");
});

test("hasAmbiguousContraction: 's/'d flagged, plain possessive-free text not", () => {
  assert.ok(hasAmbiguousContraction("She's gone home."));
  assert.ok(hasAmbiguousContraction("I'd rather stay."));
  assert.ok(!hasAmbiguousContraction("They are here."));
});

// ── R1 ───────────────────────────────────────────────────────────────────────

test("R1: article form without bare noun (and vice versa) is critical; both present is clean", () => {
  const onlyArticle = vocab({ translation: { deToEn: [ta("dog")], enToDe: [ta("der Hund")] } });
  const f1 = auditVocabItem("g2-u01", onlyArticle).filter((f) => f.rule === "R1");
  assert.equal(f1.length, 1);
  assert.equal(f1[0]!.severity, "critical");
  assert.match(f1[0]!.evidence, /no bare noun/);

  const onlyBare = vocab({ g: "Hund", translation: { deToEn: [ta("dog")], enToDe: [ta("Hund")] } });
  const f2 = auditVocabItem("g2-u01", onlyBare).filter((f) => f.rule === "R1");
  assert.equal(f2.length, 1);
  assert.match(f2[0]!.evidence, /no der\/die\/das/);

  const both = vocab({ g: "Hund", translation: { deToEn: [ta("dog")], enToDe: [ta("Hund"), ta("der Hund")] } });
  assert.deepEqual(auditVocabItem("g2-u01", both).filter((f) => f.rule === "R1"), []);
});

test("R1: phrase glosses and non-noun pools stay out of scope (conservative)", () => {
  const phrase = vocab({ g: "der gleichen Meinung sein", translation: { deToEn: [ta("agree")], enToDe: [ta("der gleichen Meinung sein")] } });
  assert.deepEqual(auditVocabItem("g2-u01", phrase).filter((f) => f.rule === "R1"), []);
  const verb = vocab({ g: "entlang", translation: { deToEn: [ta("along")], enToDe: [ta("entlang")] } });
  assert.deepEqual(auditVocabItem("g2-u01", verb).filter((f) => f.rule === "R1"), []);
});

// ── R2 ───────────────────────────────────────────────────────────────────────

test("R2: contraction without expanded twin is critical; twin present is clean", () => {
  const missing = grammar({ answers: [ta("I don't know.")] });
  const f = auditGrammarItem("g2-u01", missing).filter((x) => x.rule === "R2" && x.severity === "critical");
  assert.equal(f.length, 1);
  assert.match(f[0]!.suggestion, /i do not know/);

  const twinned = grammar({ answers: [ta("I don't know."), ta("I do not know.")] });
  assert.deepEqual(auditGrammarItem("g2-u01", twinned).filter((x) => x.rule === "R2" && x.severity === "critical"), []);
});

test("R2: long form without contracted twin is critical; ambiguous 's is advisory only", () => {
  const long = grammar({ answers: [ta("She does not play.")] });
  const f = auditGrammarItem("g2-u01", long).filter((x) => x.rule === "R2");
  assert.equal(f.length, 1);
  assert.equal(f[0]!.severity, "critical");
  assert.match(f[0]!.evidence, /no contracted twin/);

  const amb = grammar({ answers: [ta("She's been here.")] });
  const fa = auditGrammarItem("g2-u01", amb).filter((x) => x.rule === "R2");
  assert.ok(fa.every((x) => x.severity === "advisory"));
  assert.ok(fa.length >= 1);
});

test("R2: chip/tile formats are out of scope", () => {
  const sb = grammar({ format: "sentence-building", prompt: { text: "I / don't / know", lang: "en", blanks: 0 }, answers: [ta("I don't know.")] });
  assert.deepEqual(auditGrammarItem("g2-u01", sb).filter((x) => x.rule === "R2"), []);
});

// ── R3 ───────────────────────────────────────────────────────────────────────

test("R3: single-answer question-formation is advisory; strict or multi-answer is clean", () => {
  const single = grammar({ format: "question-formation", prompt: { text: "He plays football.", lang: "en", blanks: 0 }, answers: [ta("Does he play football?")] });
  const f = auditGrammarItem("g2-u01", single).filter((x) => x.rule === "R3");
  assert.equal(f.length, 1);
  assert.equal(f[0]!.severity, "advisory");

  const strict = grammar({ format: "question-formation", strict: true, prompt: { text: "He plays football.", lang: "en", blanks: 0 }, answers: [ta("Does he play football?")] });
  assert.deepEqual(auditGrammarItem("g2-u01", strict).filter((x) => x.rule === "R3"), []);

  const multi = grammar({ format: "question-formation", prompt: { text: "He plays football.", lang: "en", blanks: 0 }, answers: [ta("Does he play football?"), ta("Does he play?")] });
  assert.deepEqual(auditGrammarItem("g2-u01", multi).filter((x) => x.rule === "R3"), []);
});

// ── R4 ───────────────────────────────────────────────────────────────────────

test("R4: pipe-segment mismatch on any tier is critical (grammar + vocab carrier)", () => {
  const two = grammar({ prompt: { text: "___ you ___ football?", lang: "en", blanks: 2 }, answers: [ta("Do|play"), ta("Do you play", "partial")] });
  const f = auditGrammarItem("g2-u01", two).filter((x) => x.rule === "R4");
  assert.equal(f.length, 1); // only the partial answer mismatches
  assert.match(f[0]!.evidence, /partial answer/);

  const vBad = vocab({ s: "A ___ and a ___.", sAnswers: [ta("one")] });
  const fv = auditVocabItem("g2-u01", vBad).filter((x) => x.rule === "R4");
  assert.equal(fv.length, 1);
});

// ── R5 ───────────────────────────────────────────────────────────────────────

test("R5: a German-reading answer in the deToEn pool is advisory (any tier)", () => {
  const bad = vocab({ translation: { deToEn: [ta("go"), ta("wir gehen mit der Mutter", "partial")], enToDe: [ta("gehen")] } });
  const f = auditVocabItem("g2-u01", bad).filter((x) => x.rule === "R5");
  assert.equal(f.length, 1);
  assert.equal(f[0]!.severity, "advisory");
  assert.match(f[0]!.evidence, /reads like German/);
});

test("a clean pair of items yields zero findings", () => {
  assert.deepEqual(auditVocabItem("g2-u01", vocab()), []);
  assert.deepEqual(auditGrammarItem("g2-u01", grammar({ answers: [ta("went")] })), []);
});
