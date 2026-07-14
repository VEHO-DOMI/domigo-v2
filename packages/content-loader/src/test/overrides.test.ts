import assert from "node:assert/strict";
import { test } from "node:test";
import { listApprovedUnits, loadUnit } from "../index.ts";
import { applyStudioOverlay, fieldsChanged, normalizePatchColumn, validatePatch, type GrammarPatch, type VocabPatch } from "../overrides.ts";

// Real items as bases — the allowlist must hold against actual corpus shapes.
const unit = loadUnit("g2-u03");
const vocab = unit.vocab[0]!;
const grammar = unit.grammar[0]!;

test("PASSTHROUGH INVARIANT: empty overlay is deep-equal for EVERY item in ALL units", () => {
  const units = listApprovedUnits();
  assert.ok(units.length >= 40, `expected the full corpus, got ${units.length} units`);
  let items = 0;
  for (const slug of units) {
    const unit = loadUnit(slug);
    for (const v of unit.vocab) {
      assert.deepEqual(applyStudioOverlay("vocab", v, {}), v, `vocab ${v.id} not passthrough`);
      assert.deepEqual(applyStudioOverlay("vocab", v, null), v);
      items += 1;
    }
    for (const g of unit.grammar) {
      assert.deepEqual(applyStudioOverlay("grammar", g, {}), g, `grammar ${g.id} not passthrough`);
      assert.deepEqual(applyStudioOverlay("grammar", g, null), g);
      items += 1;
    }
  }
  assert.ok(items > 1000, `expected the full item set, got ${items}`);
});

test("applyStudioOverlay: empty/null patch is a byte-identical passthrough", () => {
  assert.deepEqual(applyStudioOverlay("vocab", vocab, null), vocab);
  assert.deepEqual(applyStudioOverlay("vocab", vocab, {}), vocab);
  assert.deepEqual(applyStudioOverlay("grammar", grammar, null), grammar);
  assert.deepEqual(applyStudioOverlay("grammar", grammar, {}), grammar);
  // and it never mutates the base
  applyStudioOverlay("vocab", vocab, { hintDe: "changed" });
  assert.notEqual(vocab.hintDe, "changed");
});

test("applyStudioOverlay: a prose edit applies, everything else identical", () => {
  const out = applyStudioOverlay("vocab", vocab, { hintDe: "Ein neuer Hinweis." });
  assert.equal(out.hintDe, "Ein neuer Hinweis.");
  assert.deepEqual({ ...out, hintDe: vocab.hintDe }, vocab); // only hintDe moved

  const g = applyStudioOverlay("grammar", grammar, { prompt: { text: grammar.prompt.text } });
  assert.deepEqual(g, grammar); // same text → identical (incl. lang/blanks preserved)
});

test("applyStudioOverlay: grammar prompt keeps lang + blanks, only text moves", () => {
  const newText = grammar.prompt.text + " Also this."; // same blank count (0)
  const g = applyStudioOverlay("grammar", grammar, { prompt: { text: newText } });
  assert.equal(g.prompt.text, newText);
  assert.equal(g.prompt.lang, grammar.prompt.lang);
  assert.equal(g.prompt.blanks, grammar.prompt.blanks);
});

test("allowlist FUZZ: every grading key is rejected (vocab)", () => {
  for (const bad of [
    { g: "hacked" },
    { w: "hacked" },
    { translation: { deToEn: [{ text: "x", tier: "full" }], enToDe: [{ text: "y", tier: "full" }] } },
    { sAnswers: [{ text: "x", tier: "full" }] },
    { dAnswers: [{ text: "x", tier: "full" }] },
    { mc: ["a", "b", "c"] },
    { id: "g2u03.w.evil" },
    { difficulty: 1 },
    { presentation: {} },
  ] as unknown[]) {
    const r = validatePatch("vocab", bad, vocab);
    assert.equal(r.ok, false, `expected reject: ${JSON.stringify(bad)}`);
    assert.ok(r.errors.length > 0);
  }
});

test("allowlist FUZZ: every grading key is rejected (grammar)", () => {
  for (const bad of [
    { answers: [{ text: "x", tier: "full" }] },
    { distractors: ["a", "b"] },
    { pairs: [{ left: "a", right: "b" }] },
    { groups: [{ label: "x", members: ["a", "b"] }] },
    { format: "gap-fill" },
    { direction: "deToEn" },
    { strict: false },
    { id: "evil" },
    { structureId: "g2u03.s.evil" },
    { prompt: { text: "ok", blanks: 9 } }, // prompt.blanks is locked even inside prompt
    { prompt: { text: "ok", lang: "de" } }, // prompt.lang locked
  ] as unknown[]) {
    const r = validatePatch("grammar", bad, grammar);
    assert.equal(r.ok, false, `expected reject: ${JSON.stringify(bad)}`);
    assert.ok(r.errors.length > 0);
  }
});

test("blank-count guard: vocab carrier must keep exactly one blank", () => {
  assert.equal(validatePatch("vocab", { s: "No blank here." }, vocab).ok, false);
  assert.equal(validatePatch("vocab", { s: "Two ___ blanks ___ here." }, vocab).ok, false);
  assert.equal(validatePatch("vocab", { s: "One ___ blank is fine." }, vocab).ok, true);
});

test("blank-count guard: grammar prompt.text must match the base blank count", () => {
  const blanks = grammar.prompt.blanks;
  // a text with the WRONG number of blanks is rejected
  const wrong = blanks === 0 ? "Now with a ___ blank." : "No blanks at all.";
  assert.equal(validatePatch("grammar", { prompt: { text: wrong } }, grammar).ok, false);
  // a text with the SAME blank count as the base validates ok (0 or 1 case)
  if (blanks <= 1) {
    const right = blanks === 0 ? "A rewritten prompt with no blanks." : "A rewritten ___ prompt.";
    assert.equal(validatePatch("grammar", { prompt: { text: right } }, grammar).ok, true);
  }
});

test("leak guard: a definition containing the headword is rejected", () => {
  assert.equal(validatePatch("vocab", { d: `This is about ${vocab.w} really.` }, vocab).ok, false);
  assert.equal(validatePatch("vocab", { d: "A clean definition with no leak." }, vocab).ok, true);
});

test("defensive apply: a non-allowlist key present in a patch is never written", () => {
  // even if validation were bypassed, applyStudioOverlay iterates the allowlist
  const sneaky = { g: "HACKED", hintDe: "legit hint" } as unknown as VocabPatch;
  const out = applyStudioOverlay("vocab", vocab, sneaky);
  assert.equal(out.g, vocab.g); // grading key untouched
  assert.equal(out.hintDe, "legit hint"); // prose applied

  const sneakyG = { answers: [{ text: "HACK", tier: "full" }], hintDe: "legit" } as unknown as GrammarPatch;
  const gout = applyStudioOverlay("grammar", grammar, sneakyG);
  assert.deepEqual(gout.answers, grammar.answers); // answer key untouched
  assert.equal(gout.hintDe, "legit");
});

test("gloss validation: shape enforced, extra keys rejected", () => {
  assert.equal(validatePatch("vocab", { gloss: [{ word: "water", de: "Wasser", scope: "d" }] }, vocab).ok, true);
  assert.equal(validatePatch("vocab", { gloss: [{ word: "water", de: "Wasser", scope: null }] }, vocab).ok, true);
  assert.equal(validatePatch("vocab", { gloss: [{ word: "water", de: "Wasser", evil: 1 }] }, vocab).ok, false);
  assert.equal(validatePatch("vocab", { gloss: "not an array" }, vocab).ok, false);
});

test("normalizePatchColumn: object passthrough, JSON string parsed, garbage → {}", () => {
  assert.deepEqual(normalizePatchColumn({ hintDe: "x" }), { hintDe: "x" });
  assert.deepEqual(normalizePatchColumn('{"hintDe":"x"}'), { hintDe: "x" });
  assert.deepEqual(normalizePatchColumn(""), {});
  assert.deepEqual(normalizePatchColumn("not json"), {});
  assert.deepEqual(normalizePatchColumn(null), {});
  assert.deepEqual(normalizePatchColumn([1, 2]), {});
});

test("fieldsChanged: order-stable prose labels", () => {
  assert.deepEqual(fieldsChanged({ hintDe: "x", d: "y" } as VocabPatch), ["d", "hintDe"]);
  assert.deepEqual(fieldsChanged({}), []);
  assert.deepEqual(fieldsChanged(null), []);
});
