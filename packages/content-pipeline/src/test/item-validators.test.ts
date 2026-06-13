/** One targeted red-team case per deterministic item validator. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAllowedMatcher } from "../cumulative-bank.ts";
import {
  definitionLeakErrors,
  distractorErrors,
  gameMetaErrors,
  germanOrthographyErrors,
  glossErrors,
  levelGateErrors,
  metaTalkErrors,
  renderShapeErrors,
  sieRule,
  substitutionErrors,
  translationSanity,
  variantErrors,
} from "../validate-items.ts";
import { grammarItem, prov, vocabItem } from "./item-fixtures.ts";

const SLUG = "g2-u03";
const matcher = buildAllowedMatcher(SLUG);
const noGrammar = { grammar: [] as never[] };

test("V-5 level gate: unglossed above-level token in any EN field", () => {
  const errs = levelGateErrors(SLUG, { vocab: [vocabItem({ s: "The ___ sang carols loudly." })], ...noGrammar }, matcher);
  assert.ok(errs.some((e) => e.includes('"carols"') && e.includes(".s")));
  // gloss rescues exactly that token, scoped to the field
  const glossed = levelGateErrors(
    SLUG,
    { vocab: [vocabItem({ s: "The ___ sang carols (= Weihnachtslieder) loudly.", gloss: [{ word: "carols", de: "Weihnachtslieder", scope: "s" }] })], ...noGrammar },
    matcher,
  );
  assert.ok(!glossed.some((e) => e.includes('"carols"')));
  // grammar prompts are gated too
  const g = levelGateErrors(SLUG, { vocab: [], grammar: [grammarItem({ prompt: { text: "You ___ obey the regulations.", lang: "en", blanks: 1 } })] }, matcher);
  assert.ok(g.some((e) => e.includes('"obey"') || e.includes('"regulations"')));
  // a MULTIWORD headword teaches its own component word: "part" is not a standalone
  // bank single, but it IS the answer to "to be part of" — in-level within this item
  const ownHead = levelGateErrors(
    SLUG,
    { vocab: [vocabItem({ w: "to be part of", s: "I want to be ___ of the team.", sAnswers: [{ text: "part", tier: "full" }], d: "Inside a bigger group and not alone." })], ...noGrammar },
    matcher,
  );
  assert.ok(!ownHead.some((e) => e.includes('"part"')), ownHead.join("\n"));
  // control: the same token in an UNRELATED item (headword "witch") still flags
  const foreign = levelGateErrors(SLUG, { vocab: [vocabItem({ s: "She did her ___ of the work." , sAnswers: [{ text: "part", tier: "full" }] })], ...noGrammar }, matcher);
  assert.ok(foreign.some((e) => e.includes('"part"')), foreign.join("\n"));
});

test("V-6 gloss correctness: stale gloss + gloss-unneeded", () => {
  const stale = glossErrors(SLUG, { vocab: [vocabItem({ gloss: [{ word: "pumpkin", de: "Kürbis", scope: "s" }] })], ...noGrammar }, matcher);
  assert.ok(stale.some((e) => e.includes("does not occur")));
  const unneeded = glossErrors(
    SLUG,
    { vocab: [vocabItem({ s: "The ___ is a Halloween (= Halloween) thing.", gloss: [{ word: "Halloween", de: "Halloween", scope: "s" }] })], ...noGrammar },
    matcher,
  );
  assert.ok(unneeded.some((e) => e.includes("TAUGHT word")));
});

test("V-7 substitution sanity: a/an, pipe arity, casing warns", () => {
  const an = substitutionErrors(SLUG, { vocab: [vocabItem({ s: "She saw an ___ in the garden.", sAnswers: [{ text: "witch", tier: "full" }] })], ...noGrammar });
  assert.ok(an.errors.some((e) => e.includes("an ___")));
  const arity = substitutionErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({ prompt: { text: "___ you ___ home?", lang: "en", blanks: 2 }, answers: [{ text: "should", tier: "full" }] })],
  });
  assert.ok(arity.errors.some((e) => e.includes("pipe segment")));
  const casing = substitutionErrors(SLUG, { vocab: [vocabItem({ s: "___ is a scary night.", sAnswers: [{ text: "halloween", tier: "full" }] })], ...noGrammar });
  assert.ok(casing.warns.some((w) => w.note.includes("sentence-initial")));
});

test("V-8 definition leak is lemma-aware", () => {
  const errs = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ d: "Witches are women who can do magic" })], ...noGrammar },
    { entries: [{ id: "g2u03.w.witch", en: "witch", forms: ["witch"] }] } as never,
  );
  assert.ok(errs.some((e) => e.includes('"witches"')));
  // closed-class connectors in a multiword headword are not "leaks"
  const conn = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ id: "g2u03.w.fish-and-chips", w: "fish and chips", d: "A hot meal of potatoes and a sea animal you eat." })], ...noGrammar },
    { entries: [{ id: "g2u03.w.fish-and-chips", en: "fish and chips", forms: ["fish and chips"] }] } as never,
  );
  assert.ok(!conn.some((e) => e.includes('"and"')), conn.join("\n"));
  // the copula in a "to be …" headword is a function word, not leaked content
  const copula = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ id: "g2u03.w.to-be-part-of", w: "to be part of", d: "To be inside a bigger group and not alone." })], ...noGrammar },
    { entries: [{ id: "g2u03.w.to-be-part-of", en: "to be part of", forms: ["to be part of"] }] } as never,
  );
  assert.ok(!copula.some((e) => e.includes('"be"')), copula.join("\n"));
  // but a real content token of the headword still leaks ("part" in the definition)
  const realLeak = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ id: "g2u03.w.to-be-part-of", w: "to be part of", d: "When you are part of something bigger." })], ...noGrammar },
    { entries: [{ id: "g2u03.w.to-be-part-of", en: "to be part of", forms: ["to be part of"] }] } as never,
  );
  assert.ok(realLeak.some((e) => e.includes('"part"')), realLeak.join("\n"));
  // glue tokens (the motion verb "go", prepositions, quantifiers) are not leaks in
  // a multiword headword — the distinctive word is what's left (past, straight, time)
  const glue = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ id: "g2u03.w.to-go-past", w: "to go past", d: "To come near a place and keep on, most of the time not stopping." })], ...noGrammar },
    { entries: [{ id: "g2u03.w.to-go-past", en: "to go past", forms: ["to go past"] }] } as never,
  );
  assert.ok(!glue.some((e) => e.includes('"go"') || e.includes('"most"') || e.includes('"on"')), glue.join("\n"));
  // but a distinctive content token of a phrase headword still leaks ("bus" in "bus stop")
  const phraseLeak = definitionLeakErrors(
    SLUG,
    { vocab: [vocabItem({ id: "g2u03.w.bus-stop", w: "bus stop", d: "A place where you wait for the bus." })], ...noGrammar },
    { entries: [{ id: "g2u03.w.bus-stop", en: "bus stop", forms: ["bus stop"] }] } as never,
  );
  assert.ok(phraseLeak.some((e) => e.includes('"bus"')), phraseLeak.join("\n"));
});

test("V-9 distractor discipline: out-of-bank + lemma clash + duplicates", () => {
  const outOfBank = distractorErrors(SLUG, { vocab: [vocabItem({ mc: ["wizard", "ghost", "monster"] })], ...noGrammar }, matcher);
  assert.ok(outOfBank.some((e) => e.includes('"wizard"')));
  const clash = distractorErrors(SLUG, { vocab: [vocabItem({ mc: ["witches", "ghost", "monster"] })], ...noGrammar }, matcher);
  assert.ok(clash.some((e) => e.includes("lemma-matches")));
  const dup = distractorErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({ format: "multiple-choice", id: "g2u03.gi.should.mc.001", prompt: { text: "You ___ sleep.", lang: "en", blanks: 1 }, distractors: ["can", "can", "must"], presentation: { variants: [], gameMeta: { distractorPool: ["can", "must", "may", "could"], chipBudget: null, minOptions: 4 }, audio: null } })],
  }, matcher);
  assert.ok(dup.some((e) => e.includes("duplicate distractor")));
  // a granted structure token ("should") is a legitimate VOCAB mc distractor (taught via the structure)
  const grantedVocab = distractorErrors(SLUG, { vocab: [vocabItem({ mc: ["should", "shouldn't", "monster"] })], ...noGrammar }, matcher);
  assert.ok(!grantedVocab.some((e) => e.includes('"should"') && e.includes("cumulative bank")), grantedVocab.join("\n"));
  // phrase-aware: a distractor containing a multiword bank entry passes — the bare
  // token "front" is not a single, but the phrase "in front of" is in-bank
  const phraseAware = distractorErrors(SLUG, { vocab: [], grammar: [grammarItem({ format: "multiple-choice", id: "g2u03.gi.should.mc.003", prompt: { text: "x", lang: "en", blanks: 0 }, answers: [{ text: "next to me", tier: "full" }], distractors: ["in front of me"], presentation: { variants: [], gameMeta: { distractorPool: ["in front of me", "next to me", "behind me", "under me"], chipBudget: null, minOptions: 4 }, audio: null } })] }, matcher);
  assert.ok(!phraseAware.some((e) => e.includes("cumulative bank")), phraseAware.join("\n"));
});

test("V-9/V-17 polarity twins + granted structure tokens are legal", () => {
  // should vs shouldn't IS the discrimination — the twin is a contrast, not
  // the answer in disguise; "should"/"shouldn't" pass pools via the audited
  // unit-wide level grants (the unit's grammar-structure tokens)
  const polarity = distractorErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({
      format: "multiple-choice",
      id: "g2u03.gi.should.mc.001",
      prompt: { text: "Lara is sick. She ___ eat more sweets.", lang: "en", blanks: 1 },
      answers: [{ text: "shouldn't", tier: "full" }],
      distractors: ["should", "must", "can"],
      presentation: { variants: [], gameMeta: { distractorPool: ["should", "must", "can", "couldn't"], chipBudget: null, minOptions: 4 }, audio: null },
    })],
  }, matcher);
  assert.ok(!polarity.some((e) => e.includes("duplicate") || e.includes("disguise")), polarity.join("\n"));
  assert.ok(!polarity.some((e) => e.includes("not in the cumulative bank")), polarity.join("\n"));

  // grammar items TEST form: a wrong inflection of the answer ("study" for
  // "studies") is a legitimate distractor and must NOT be flagged…
  const inflection = distractorErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({
      format: "multiple-choice",
      id: "g2u03.gi.should.mc.002",
      prompt: { text: "She ___ hard for the test.", lang: "en", blanks: 1 },
      answers: [{ text: "should study", tier: "full" }],
      distractors: ["should studies", "must study", "can study"],
      presentation: { variants: [], gameMeta: { distractorPool: ["should studies", "must study", "can study", "could study"], chipBudget: null, minOptions: 4 }, audio: null },
    })],
  }, matcher);
  assert.ok(!inflection.some((e) => e.includes("duplicate")), inflection.join("\n"));
  // …but an EXACT duplicate of an accepted answer IS a bug
  const exactDup = distractorErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({
      format: "multiple-choice",
      id: "g2u03.gi.should.mc.003",
      prompt: { text: "We ___ go now.", lang: "en", blanks: 1 },
      answers: [{ text: "should", tier: "full" }],
      distractors: ["should", "must", "can"],
      presentation: { variants: [], gameMeta: { distractorPool: ["should", "must", "can", "may"], chipBudget: null, minOptions: 4 }, audio: null },
    })],
  }, matcher);
  assert.ok(exactDup.some((e) => e.includes("duplicates an accepted answer")));

  // vocab keeps the stricter lemma guard (an inflection of the headword is a giveaway)
  const realClash = distractorErrors(SLUG, {
    vocab: [vocabItem({ mc: ["witches", "ghost", "monster"] })],
    grammar: [],
  }, matcher);
  assert.ok(realClash.some((e) => e.includes("lemma-matches")));
});

test("V-10 translation sanity: strong language mismatch red, weak warn", () => {
  const red = translationSanity(SLUG, { vocab: [vocabItem({ translation: { deToEn: [{ text: "witch", tier: "full" }], enToDe: [{ text: "the witch is here", tier: "full" }] } })], ...noGrammar });
  assert.ok(red.errors.some((e) => e.includes("enToDe")));
  const dir = translationSanity(SLUG, {
    vocab: [],
    grammar: [grammarItem({ format: "translation", id: "g2u03.gi.should.tr.001", direction: "deToEn", prompt: { text: "Wir sollten nach Hause gehen.", lang: "en", blanks: 0 }, answers: [{ text: "We should go home.", tier: "full" }] })],
  });
  assert.ok(dir.errors.some((e) => e.includes("prompt.lang")));
});

test("V-12 Sie-rule: mid-sentence red, sentence-initial warn", () => {
  const red = sieRule(SLUG, { vocab: [vocabItem({ hintDe: "Denk daran, was Sie tun sollten." })], ...noGrammar });
  assert.ok(red.errors.some((e) => e.includes('"Sie"')));
  const warn = sieRule(SLUG, { vocab: [vocabItem({ hintDe: "Sie fliegt auf einem Besen." })], ...noGrammar });
  assert.equal(warn.errors.length, 0);
  assert.ok(warn.warns.some((w) => w.note.includes("sentence-initial")));
});

test("V-13 meta-talk: jargon vs tense-names vs DE terms", () => {
  // abstract mechanism jargon banned everywhere — even in hints
  const en = metaTalkErrors(SLUG, { vocab: [], grammar: [grammarItem({ hintDe: "Nimm das modal verb should." })] });
  assert.ok(en.some((e) => e.includes("modal verb")));
  // DE pedagogy in hints is ALLOWED (Koki decision)
  const deHint = metaTalkErrors(SLUG, { vocab: [], grammar: [grammarItem({ explainDe: "Nach should kommt die Grundform." })] });
  assert.equal(deHint.length, 0);
  // a DE grammar term in a CARRIER is red
  const deCarrier = metaTalkErrors(SLUG, { vocab: [], grammar: [grammarItem({ prompt: { text: "Write the Grundform of go.", lang: "en", blanks: 0 }, answers: [{ text: "go", tier: "full" }], format: "free-form", id: "g2u03.gi.should.ff.001" })] });
  assert.ok(deCarrier.some((e) => e.includes("grundform") && e.includes("carrier")));
  // English tense NAMES (the textbook's labels): allowed in hints, banned in carriers
  const tenseHint = metaTalkErrors(SLUG, { vocab: [], grammar: [grammarItem({ explainDe: "Im Present simple steht das Verb in der Grundform." })] });
  assert.equal(tenseHint.length, 0);
  const tenseCarrier = metaTalkErrors(SLUG, { vocab: [], grammar: [grammarItem({ prompt: { text: "Use the present simple here.", lang: "en", blanks: 0 }, answers: [{ text: "go", tier: "full" }], format: "free-form", id: "g2u03.gi.should.ff.002" })] });
  assert.ok(tenseCarrier.some((e) => e.includes("present simple") && e.includes("carrier")));
  // bare "going to" is everyday English (movement / informal future), NOT a tense name
  const goingMove = metaTalkErrors(SLUG, { vocab: [vocabItem({ s: "Going to the zoo for the first time was really ___!" })], ...noGrammar });
  assert.equal(goingMove.length, 0, goingMove.join("\n"));
  const goingFut = metaTalkErrors(SLUG, { vocab: [vocabItem({ d: "You tell somebody you are going to do a thing for them." })], ...noGrammar });
  assert.equal(goingFut.length, 0, goingFut.join("\n"));
});

test("V-14 German orthography: ASCII umlauts, English-quote + morpheme-boundary exceptions", () => {
  const errs = germanOrthographyErrors(SLUG, { vocab: [vocabItem({ hintDe: "Sie ist muede." })], ...noGrammar }, matcher);
  assert.ok(errs.some((e) => e.includes("ASCII umlaut")));
  // legitimate "ue" across a morpheme boundary
  assert.equal(germanOrthographyErrors(SLUG, { vocab: [vocabItem({ hintDe: "Zuerst kommt should, dann das Verb." })], ...noGrammar }, matcher).length, 0);
  // English structure words quoted in a German hint must not trip the digraph heuristic
  assert.equal(germanOrthographyErrors(SLUG, { vocab: [], grammar: [grammarItem({ explainDe: "Verneinung mit doesn't, und er goes wird zu does." })] }, matcher).length, 0);
});

test("V-15 render shapes: pair duplicates, chip budget", () => {
  const pairDup = renderShapeErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({ format: "matching", id: "g2u03.gi.should.mt.001", prompt: { text: "should / shouldn't", lang: "en", blanks: 0 }, answers: [], pairs: [
      { left: "We should", right: "go home." },
      { left: "We should", right: "sleep." },
      { left: "You shouldn't", right: "shout." },
    ] })],
  });
  assert.ok(pairDup.some((e) => e.includes("duplicate pair left")));
  const chips = renderShapeErrors(SLUG, {
    vocab: [],
    grammar: [grammarItem({ format: "sentence-building", id: "g2u03.gi.should.sb.001", prompt: { text: "home / we / should / go", lang: "en", blanks: 0 }, answers: [{ text: "We really should go home now and sleep very well tonight", tier: "full" }], distractors: ["never", "always", "cat"], presentation: { variants: [], gameMeta: { distractorPool: ["never", "always", "cat", "dog"], chipBudget: 8, minOptions: null }, audio: null } })],
  });
  assert.ok(chips.some((e) => e.includes("chip budget")));
});

test("V-16/V-17: duplicate variant keys; gameMeta required where it matters", () => {
  const dupVar = variantErrors(SLUG, {
    vocab: [vocabItem({ presentation: { variants: [
      { key: "watson.ch01", prompt: { text: "A ___ here.", lang: "en" }, glosses: [], audio: null, provenance: prov() },
      { key: "watson.ch01", prompt: { text: "A ___ there.", lang: "en" }, glosses: [], audio: null, provenance: prov() },
    ], gameMeta: { distractorPool: ["ghost", "monster", "spider", "zombie"], chipBudget: null, minOptions: 4 }, audio: null } })],
    ...noGrammar,
  });
  assert.ok(dupVar.some((e) => e.includes("duplicate variant key")));
  const missing = gameMetaErrors(SLUG, {
    vocab: [vocabItem({ presentation: { variants: [], gameMeta: null, audio: null } })],
    grammar: [grammarItem({ format: "multiple-choice", id: "g2u03.gi.should.mc.001", prompt: { text: "You ___ sleep.", lang: "en", blanks: 1 }, distractors: ["can", "must", "may"] })],
  });
  assert.ok(missing.some((e) => e.includes("vocab items require gameMeta")));
  assert.ok(missing.some((e) => e.includes("multiple-choice requires gameMeta")));
});
