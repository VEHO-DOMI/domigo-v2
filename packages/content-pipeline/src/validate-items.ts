/**
 * Stage 7 — deterministic item validators V-1…V-23, wired into
 * `content validate` (CI) for every unit that has item artifacts.
 *
 *  V-1  vocab@1/grammar@1 schema validity (incl. all schema refinements)
 *  V-2  id/lock conformance (vocab ids == bank ids; grammar ids pinned)
 *  V-3  refs resolve (structureId in the grade catalog)
 *  V-4  per-format required fields beyond schema (gameMeta presence)
 *  V-5  THE LEVEL GATE — unknown unglossed token in any student-facing EN
 *       field (greedy phrase match over the cumulative bank ∪ allowlist ∪
 *       proper nouns ∪ numbers ∪ own gloss ∪ audited level grants)
 *  V-6  gloss correctness (occurs in field; genuinely out-of-bank; scoped)
 *  V-7  gap-fill substitution sanity (a/an heuristic, arity, casing)
 *  V-8  definition must not leak the headword (lemma-aware)
 *  V-9  distractor discipline (≠ answers lemma-wise, unique, IN-BANK)
 *  V-10 translation direction + conservative language sanity
 *  V-11 ≥1 full-tier answer (schema; re-checked for translation surfaces)
 *  V-12 Sie-rule (mid-sentence red; sentence-initial → warn for review)
 *  V-13 meta-talk (EN jargon everywhere; DE terms outside hints/explains)
 *  V-14 German orthography (ASCII umlauts, NFC)
 *  V-15 render-shape (pair/group uniqueness, chip budgets, anagram length)
 *  V-16 variant integrity (unique keys; variants pass V-5/V-6 themselves)
 *  V-17 gameMeta (required for vocab + choice/chip grammar; pool in-bank)
 *  V-18 difficulty in 1..3 (schema; spread is V-21)
 *  V-19 per-unit floors (vocab ≥ v1 entries; grammar ≥ mapped v1 items)
 *  V-20 bank coverage (every bank word has exactly its vocab item)
 *  V-21 structure coverage (≥1 item, ≥3 formats, ≥2 difficulties)
 *  V-22 gate integrity (state-hash drift, verify freshness, review-flag
 *       completeness, review-doc byte-regen, item-fixes landed, harvest
 *       drift, grant orphans)
 *  V-23 translation answer-pool consistency (PER-ANSWER, direction-aware —
 *       V-10 checks the concatenated pool, which dilutes one stray
 *       wrong-language answer)
 */
import fs from "node:fs";
import path from "node:path";
import type {
  Grade,
  GrammarItem as GrammarItemT,
  GrammarStructuresFile as GrammarStructuresFileT,
  TieredAnswer as TieredAnswerT,
  VocabItem as VocabItemT,
  WordBank as WordBankT,
} from "@domigo/content-schema";
import { GrammarFile, VocabFile, countBlanks } from "@domigo/content-schema";
import type { AllowedMatcher } from "./cumulative-bank.ts";
import { buildAllowedMatcher, grantsForUnit, LEVEL_GRANTS_PATH, PROPER_NOUNS_PATH, type LevelGrantsFile, type ProperNounsFile } from "./cumulative-bank.ts";
import { ITEM_FIXES_PATH, itemsContentHash, loadStructuresCatalog, type ItemFixes, type UnitItems } from "./gen-items.ts";
import { asciiUmlautSuspect } from "./german.ts";
import { buildHarvest } from "./harvest-nouns.ts";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR, V1_GRAMMAR_SNAPSHOT_DIR } from "./paths.ts";
import { readStateLog } from "./state.ts";
import { loadV1GrammarModule, v1ItemsByStructure } from "./v1grammar.ts";
import { inflectionFamily, tokenMatches, wordTokens } from "./tokenize.ts";
import type { VerifyMerged } from "./verify-items.ts";

export interface ValidatorWarn {
  key: string; // `${kind}:${itemId}` — review doc renders these as flag blocks
  kind: "validator-warn";
  itemId: string;
  note: string;
}

export interface ItemValidation {
  errors: string[];
  warns: ValidatorWarn[];
  infos: string[];
}

// ---------------------------------------------------------------------------
// field walkers — every student-facing ENGLISH string, labeled
// ---------------------------------------------------------------------------

interface EnField {
  itemId: string;
  field: string;
  text: string;
  /** Gloss scope keys that apply to this field. */
  scopes: string[];
  /** Field-local gloss words — a presentation variant carries its OWN glosses. */
  glossWords?: string[];
}

function fullsAndPartials(answers: TieredAnswerT[]): string {
  return answers.map((a) => a.text).join(" ");
}

/** Only tier=full answers are displayed as "the correction" — V-5 gates those.
 *  Partial-tier answers are grading GENEROSITY (near-miss acceptance); gating
 *  them would force stricter grading — the v1 disease. */
function fullsOnly(answers: TieredAnswerT[]): string {
  return answers.filter((a) => a.tier === "full").map((a) => a.text).join(" ");
}

/** EN fields gated by V-5. mc/distractors/pool are V-9's (no gloss escape there). */
export function vocabEnFields(it: VocabItemT): EnField[] {
  const fields: EnField[] = [
    { itemId: it.id, field: "d", text: it.d, scopes: ["d"] },
    { itemId: it.id, field: "s", text: it.s, scopes: ["s"] },
    { itemId: it.id, field: "sAnswers", text: fullsOnly(it.sAnswers), scopes: ["s"] },
    { itemId: it.id, field: "dAnswers", text: fullsOnly(it.dAnswers), scopes: ["d"] },
    { itemId: it.id, field: "translation.deToEn", text: fullsOnly(it.translation.deToEn), scopes: [] },
  ];
  for (const v of it.presentation.variants) {
    if (v.prompt.lang === "en") {
      fields.push({ itemId: it.id, field: `variant:${v.key}`, text: v.prompt.text, scopes: [v.key], glossWords: v.glosses.map((g) => g.word) });
    }
  }
  return fields;
}

export function grammarEnFields(it: GrammarItemT): EnField[] {
  const fields: EnField[] = [];
  const promptIsEn = it.prompt.lang === "en";
  if (promptIsEn) fields.push({ itemId: it.id, field: "prompt", text: it.prompt.text, scopes: ["prompt"] });
  const answersAreEn = it.format !== "translation" || it.direction === "deToEn";
  if (answersAreEn && it.answers.length > 0) {
    fields.push({ itemId: it.id, field: "answers", text: fullsOnly(it.answers), scopes: ["prompt"] });
  }
  for (const [i, p] of it.pairs.entries()) {
    fields.push({ itemId: it.id, field: `pairs[${i}]`, text: `${p.left} ${p.right}`, scopes: [] });
  }
  for (const [i, g] of it.groups.entries()) {
    fields.push({ itemId: it.id, field: `groups[${i}]`, text: `${g.label} ${g.members.join(" ")}`, scopes: [] });
  }
  for (const v of it.presentation.variants) {
    if (v.prompt.lang === "en") {
      fields.push({ itemId: it.id, field: `variant:${v.key}`, text: v.prompt.text, scopes: [v.key], glossWords: v.glosses.map((g) => g.word) });
    }
  }
  return fields;
}

/** German fields for V-12/V-13/V-14. */
function germanFields(it: VocabItemT | GrammarItemT): Array<{ field: string; text: string }> {
  const out: Array<{ field: string; text: string }> = [];
  if ("w" in it) {
    out.push({ field: "g", text: it.g }, { field: "hintDe", text: it.hintDe });
    out.push({ field: "translation.enToDe", text: fullsAndPartials(it.translation.enToDe) });
    for (const g of it.gloss) out.push({ field: `gloss(${g.word})`, text: g.de });
  } else {
    out.push({ field: "hintDe", text: it.hintDe }, { field: "explainDe", text: it.explainDe });
    if (it.prompt.lang === "de") out.push({ field: "prompt", text: it.prompt.text });
    if (it.format === "translation" && it.direction === "enToDe") {
      out.push({ field: "answers", text: fullsAndPartials(it.answers) });
    }
    for (const g of it.gloss) out.push({ field: `gloss(${g.word})`, text: g.de });
  }
  return out;
}

// ---------------------------------------------------------------------------
// individual checks (exported for the calibration suite)
// ---------------------------------------------------------------------------

export function levelGateErrors(
  slug: string,
  items: UnitItems,
  matcher: AllowedMatcher,
): string[] {
  const errors: string[] = [];
  const grants = grantsForUnit(slug);
  const check = (
    fields: EnField[],
    gloss: Array<{ word: string; scope: string | null }>,
    ownTokens: string[] = [],
  ): void => {
    for (const f of fields) {
      const applicable = gloss
        .filter((g) => g.scope === null || f.scopes.includes(g.scope))
        .map((g) => g.word);
      // A vocab item teaches its OWN headword — for a multiword entry ("to be
      // part of", "what's the matter") the carrier blanks a component word, so
      // that word is the answer and naturally sits in the item's own fields.
      // Its tokens are in-level WITHIN this item (the definition is still guarded
      // against leaks by V-8). Single-word headwords already ride the bank.
      const extraPhrases = [...applicable, ...(f.glossWords ?? []), ...ownTokens];
      const granted = new Set([...grants.unitWide, ...(grants.byItem.get(f.itemId) ?? [])]);
      for (const token of matcher.unknownTokens(f.text, { extraPhrases, grantedTokens: granted })) {
        errors.push(`${slug}: V-5 — "${token}" in ${f.itemId}.${f.field} is above level and unglossed`);
      }
    }
  };
  for (const it of items.vocab) check(vocabEnFields(it), it.gloss, wordTokens(it.w));
  for (const it of items.grammar) check(grammarEnFields(it), it.gloss);
  return errors;
}

export function glossErrors(slug: string, items: UnitItems, matcher: AllowedMatcher): string[] {
  const errors: string[] = [];
  const check = (it: VocabItemT | GrammarItemT, fields: EnField[]): void => {
    for (const g of it.gloss) {
      const scoped = fields.filter((f) => g.scope === null || f.scopes.includes(g.scope));
      const occurs = scoped.some((f) =>
        wordTokens(f.text).join(" ").includes(wordTokens(g.word).join(" ")),
      );
      if (!occurs) {
        errors.push(`${slug}: V-6 — gloss "${g.word}" on ${it.id} does not occur in its field${g.scope !== null ? ` (scope ${g.scope})` : ""}`);
      }
      if (matcher.hasPhrase(g.word)) {
        errors.push(`${slug}: V-6 — gloss "${g.word}" on ${it.id} targets a TAUGHT word (gloss-unneeded teaches mistrust of glosses)`);
      }
    }
  };
  for (const it of items.vocab) check(it, vocabEnFields(it));
  for (const it of items.grammar) check(it, grammarEnFields(it));
  return errors;
}

const AN_EXCEPTIONS = new Set(["hour", "hours", "honest", "heir", "heirs", "honour", "honor"]);
const A_EXCEPTIONS = new Set([
  "one", "once", "university", "uniform", "unit", "united", "unique", "used", "useful", "user", "europe", "european", "ufo", "u",
]);

function anViolation(article: "a" | "an", answer: string): boolean {
  const first = wordTokens(answer)[0];
  if (first === undefined) return false;
  const vowelStart = /^[aeiou]/.test(first);
  const wantsAn = AN_EXCEPTIONS.has(first) || (vowelStart && !A_EXCEPTIONS.has(first));
  return article === "a" ? wantsAn : !wantsAn;
}

export function substitutionErrors(slug: string, items: UnitItems): { errors: string[]; warns: ValidatorWarn[] } {
  const errors: string[] = [];
  const warns: ValidatorWarn[] = [];
  const checkCarrier = (itemId: string, carrier: string, answers: TieredAnswerT[], blanks: number): void => {
    const fulls = answers.filter((a) => a.tier === "full");
    // per-blank pipe arity
    if (blanks > 1) {
      for (const a of fulls) {
        const segs = a.text.split("|").map((x) => x.trim());
        if (segs.length !== blanks) {
          errors.push(`${slug}: V-7 — ${itemId}: answer "${a.text}" has ${segs.length} pipe segment(s) for ${blanks} blanks`);
        }
      }
    }
    // a/an heuristic — red only when EVERY full answer violates
    const articleMatch = /\b(a|an)\s+_{3,}/i.exec(carrier);
    if (articleMatch !== null && fulls.length > 0) {
      const article = articleMatch[1]!.toLowerCase() as "a" | "an";
      const violations = fulls.filter((a) => anViolation(article, a.text.split("|")[0] ?? a.text));
      if (violations.length === fulls.length) {
        errors.push(`${slug}: V-7 — ${itemId}: "${article} ___" disagrees with every full answer (${fulls.map((a) => a.text).join(", ")})`);
      } else if (violations.length > 0) {
        warns.push({ key: `validator-warn:${itemId}`, kind: "validator-warn", itemId, note: `a/an heuristic: "${article} ___" fits some but not all full answers` });
      }
    }
    // sentence-initial blank + all-lowercase answers
    if (/^_{3,}/.test(carrier.trim()) && fulls.length > 0 && fulls.every((a) => /^[a-z]/.test(a.text))) {
      warns.push({ key: `validator-warn:${itemId}`, kind: "validator-warn", itemId, note: "sentence-initial blank but every full answer is lowercase — check capitalization policy" });
    }
  };
  for (const it of items.vocab) checkCarrier(it.id, it.s, it.sAnswers, 1);
  for (const it of items.grammar) {
    if (it.prompt.blanks > 0) checkCarrier(it.id, it.prompt.text, it.answers, it.prompt.blanks);
  }
  return { errors, warns };
}

/** Tokens that are GLUE in a multiword headword, not the leaked content (V-8). */
const HEADWORD_GLUE = new Set<string>([
  "a", "an", "the", "and", "or", "to", "of", // articles/connectors
  "be", "am", "is", "are", "was", "were", "been", "being", // copula
  "on", "in", "at", "up", "down", "out", "off", "by", "for", "with", "into", "over", "from", "about", // prepositions/particles
  "most", "more", "all", "some", "one", "two", // quantifiers/numerals
  "go", "goes", "going", "went", "gone", // the ubiquitous motion verb of direction phrases
  "do", "does", "did", "doing", "done", // the light/pro-verb of activity phrases (DO nothing, DO the shopping, DO your homework)
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", // pronouns (glue in "poor YOU", "thank YOU", "tell ME")
  "my", "your", "his", "its", "our", "their", // possessives
  "this", "that", "these", "those", // demonstratives (glue in "in THAT case", "at THIS time")
]);

export function definitionLeakErrors(slug: string, items: UnitItems, bank: WordBankT): string[] {
  const errors: string[] = [];
  const bankById = new Map(bank.entries.map((e) => [e.id, e]));
  for (const it of items.vocab) {
    const entry = bankById.get(it.id);
    const headTokens = new Set<string>();
    for (const form of [it.w, ...(entry?.forms ?? [])]) {
      for (const t of wordTokens(form)) {
        // Glue tokens in a multiword headword are not the content a definition
        // "leaks": closed-class connectors/prepositions ("design AND technology",
        // "round THE corner", "go straight ON"), the copula ("to BE part of"),
        // quantifiers ("MOST of the time") and the ubiquitous motion verb GO
        // ("GO past", "GO straight ahead") — in a phrase headword the distinctive
        // word is what's left (past, straight, corner, trains), never "go"/"on".
        if (!HEADWORD_GLUE.has(t)) headTokens.add(t);
      }
    }
    for (const dTok of wordTokens(it.d)) {
      for (const h of headTokens) {
        if (tokenMatches(dTok, h)) {
          errors.push(`${slug}: V-8 — ${it.id}: definition leaks "${dTok}" (headword token "${h}")`);
        }
      }
    }
  }
  return errors;
}

export function distractorErrors(slug: string, items: UnitItems, matcher: AllowedMatcher): string[] {
  const errors: string[] = [];
  const grants = grantsForUnit(slug);
  /** Every token in-level — bank (phrase-aware), audited unit-wide grant, or own
   *  gloss. Phrase-aware via unknownTokens, so a distractor SENTENCE containing a
   *  multiword bank entry ("…at the traffic lights") is covered (the bare token
   *  "traffic" is not a single, but the phrase "traffic lights" is in-bank). */
  const inBankOrGranted = (s: string): boolean =>
    matcher.unknownTokens(s, { grantedTokens: grants.unitWide }).length === 0;
  const lemmaClash = (candidate: string, accepted: string[]): boolean => {
    const cTokens = wordTokens(candidate);
    return accepted.some((a) => {
      const aTokens = wordTokens(a);
      if (cTokens.length !== aTokens.length) return false;
      return cTokens.every((t, i) => {
        const other = aTokens[i]!;
        // a polarity pair (X vs Xn't) is a CONTRAST, not the answer in
        // disguise — exactly what minimal-pair mc items must offer
        if (t.endsWith("n't") !== other.endsWith("n't")) return false;
        return tokenMatches(t, other);
      });
    });
  };
  for (const it of items.vocab) {
    const accepted = [it.w, ...it.sAnswers.map((a) => a.text), ...it.dAnswers.map((a) => a.text)];
    for (const m of it.mc) {
      // a granted token (e.g. the unit's structure word "turn") is taught, so it
      // is a legitimate distractor — honor grants here exactly as the grammar branch does
      if (!inBankOrGranted(m)) errors.push(`${slug}: V-9 — ${it.id}: mc distractor "${m}" is not in the cumulative bank (or granted)`);
      if (lemmaClash(m, accepted)) errors.push(`${slug}: V-9 — ${it.id}: mc distractor "${m}" lemma-matches an accepted answer`);
    }
    const pool = it.presentation.gameMeta?.distractorPool ?? [];
    for (const m of pool) {
      if (!inBankOrGranted(m)) errors.push(`${slug}: V-17 — ${it.id}: distractorPool "${m}" is not in the cumulative bank (or granted)`);
      if (lemmaClash(m, accepted)) errors.push(`${slug}: V-17 — ${it.id}: distractorPool "${m}" lemma-matches an accepted answer`);
    }
  }
  for (const it of items.grammar) {
    const accepted = it.answers.map((a) => a.text);
    const seen = new Set<string>();
    const granted = new Set([...grants.unitWide, ...(grants.byItem.get(it.id) ?? [])]);
    const acceptedSurface = new Set(accepted.map((a) => wordTokens(a).join(" ")));
    for (const m of it.distractors) {
      const lower = m.toLowerCase();
      if (seen.has(lower)) errors.push(`${slug}: V-9 — ${it.id}: duplicate distractor "${m}"`);
      seen.add(lower);
      // Grammar items TEST form, so a wrong inflection of the answer ("study"
      // for "studies", "walk" for "walked") is a legitimate distractor — only
      // an EXACT duplicate of an accepted answer is a bug here. (A "secretly
      // correct synonym" distractor is the stage-6 answers lens's job.)
      if (it.format !== "context-picker" && acceptedSurface.has(wordTokens(m).join(" "))) {
        errors.push(`${slug}: V-9 — ${it.id}: distractor "${m}" duplicates an accepted answer`);
      }
      if (it.format === "context-picker") {
        if (accepted.some((a) => wordTokens(a).join(" ") === wordTokens(m).join(" "))) {
          errors.push(`${slug}: V-9 — ${it.id}: context-picker distractor equals the correct sentence`);
        }
        // sentence distractors are student-facing text — gate their tokens
        for (const token of matcher.unknownTokens(m, { grantedTokens: granted })) {
          errors.push(`${slug}: V-9 — ${it.id}: "${token}" in a context-picker distractor is above level and unglossed`);
        }
      } else if (!inBankOrGranted(m)) {
        errors.push(`${slug}: V-9 — ${it.id}: distractor "${m}" is not in the cumulative bank (or granted)`);
      }
    }
    const pool = it.presentation.gameMeta?.distractorPool ?? [];
    for (const m of pool) {
      if (it.format === "context-picker") {
        for (const token of matcher.unknownTokens(m, { grantedTokens: granted })) {
          errors.push(`${slug}: V-17 — ${it.id}: "${token}" in a pool sentence is above level and unglossed`);
        }
      } else if (!inBankOrGranted(m)) {
        errors.push(`${slug}: V-17 — ${it.id}: distractorPool "${m}" is not in the cumulative bank (or granted)`);
      }
    }
  }
  return errors;
}

const DE_STOPS = new Set(["der", "die", "das", "und", "ist", "nicht", "ein", "eine", "ich", "du", "er", "wir", "ihr", "mit", "auf", "für", "nach", "zu", "im", "am", "sollte", "sollten", "sollst"]);
const EN_STOPS = new Set(["the", "a", "an", "is", "are", "not", "and", "i", "you", "he", "she", "we", "they", "to", "with", "for", "in", "on", "at", "should", "shouldn't"]);

export function langEvidence(text: string): { de: number; en: number } {
  let de = /[äöüß]/.test(text.toLowerCase()) ? 2 : 0;
  let en = 0;
  for (const t of wordTokens(text)) {
    if (DE_STOPS.has(t)) de += 1;
    if (EN_STOPS.has(t)) en += 1;
  }
  return { de, en };
}

export function translationSanity(slug: string, items: UnitItems): { errors: string[]; warns: ValidatorWarn[] } {
  const errors: string[] = [];
  const warns: ValidatorWarn[] = [];
  const checkSide = (itemId: string, label: string, text: string, want: "de" | "en"): void => {
    const ev = langEvidence(text);
    const right = want === "de" ? ev.de : ev.en;
    const wrong = want === "de" ? ev.en : ev.de;
    if (right === 0 && wrong >= 2) {
      errors.push(`${slug}: V-10 — ${itemId}: ${label} should be ${want.toUpperCase()} but reads like ${want === "de" ? "English" : "German"} (${JSON.stringify(text.slice(0, 60))})`);
    } else if (right === 0 && wrong === 1) {
      warns.push({ key: `validator-warn:${itemId}`, kind: "validator-warn", itemId, note: `${label}: weak language evidence for ${want.toUpperCase()} (${JSON.stringify(text.slice(0, 40))})` });
    }
  };
  for (const it of items.vocab) {
    checkSide(it.id, "translation.enToDe answers", fullsAndPartials(it.translation.enToDe), "de");
    checkSide(it.id, "translation.deToEn answers", fullsAndPartials(it.translation.deToEn), "en");
  }
  for (const it of items.grammar) {
    if (it.format !== "translation") continue;
    const promptWant = it.direction === "deToEn" ? "de" : "en";
    const answersWant = it.direction === "deToEn" ? "en" : "de";
    if ((it.prompt.lang === "de") !== (promptWant === "de")) {
      errors.push(`${slug}: V-10 — ${it.id}: direction ${it.direction} but prompt.lang is ${it.prompt.lang}`);
    }
    checkSide(it.id, "prompt", it.prompt.text, promptWant);
    checkSide(it.id, "answers", fullsAndPartials(it.answers), answersWant);
  }
  // V-23 — per-answer pool consistency. V-10 checks the CONCATENATED answer pool,
  // which dilutes a single wrong-language answer inside an otherwise-correct pool;
  // one such stray answer lets a student "translate" the source language with
  // itself (the engine grades against the whole pool, direction-blind).
  const checkEach = (itemId: string, label: string, answers: TieredAnswerT[], want: "de" | "en"): void => {
    for (const a of answers) {
      if (a.tier !== "full") continue;
      const ev = langEvidence(a.text);
      const right = want === "de" ? ev.de : ev.en;
      const wrong = want === "de" ? ev.en : ev.de;
      if (right === 0 && wrong >= 2) {
        errors.push(`${slug}: V-23 — ${itemId}: ${label} answer ${JSON.stringify(a.text.slice(0, 60))} reads like ${want === "de" ? "English" : "German"} in a ${want.toUpperCase()} pool`);
      }
    }
  };
  for (const it of items.vocab) {
    checkEach(it.id, "translation.enToDe", it.translation.enToDe, "de");
    checkEach(it.id, "translation.deToEn", it.translation.deToEn, "en");
  }
  for (const it of items.grammar) {
    if (it.format !== "translation") continue;
    checkEach(it.id, "answers", it.answers, it.direction === "deToEn" ? "en" : "de");
  }
  return { errors, warns };
}

const SIE_RE = /^(Sie|Ihnen|Ihr(?:e|em|en|er|es)?)$/;

export function sieRule(slug: string, items: UnitItems): { errors: string[]; warns: ValidatorWarn[] } {
  const errors: string[] = [];
  const warns: ValidatorWarn[] = [];
  const checkText = (itemId: string, field: string, text: string): void => {
    for (const sentence of text.split(/(?<=[.!?:…])\s+/)) {
      const tokens = sentence.match(/[A-Za-zÄÖÜäöüß']+/g) ?? [];
      for (let i = 0; i < tokens.length; i += 1) {
        if (!SIE_RE.test(tokens[i]!)) continue;
        // Carve-out: a register-variant slash-list gloss (e.g. "Wie geht es
        // dir/Ihnen/euch?") lists the du/Sie/ihr translations of a phrase — it
        // is NOT the app formally addressing the student. Real formal address is
        // space-flanked ("geht es Ihnen"); a register list is slash-flanked.
        if (new RegExp(`[/]\\s*${tokens[i]!}\\b|\\b${tokens[i]!}\\s*[/]`).test(text)) continue;
        // Broader register-list: slash-separated phrase alternatives that
        // include an informal du/ihr form (e.g. "Hast du / Habt ihr / Haben
        // Sie ...?") are register-variant glosses of a phrase, not formal
        // address of the student.
        if (text.includes("/") && /\b(du|dir|dich|dein\w*|euch|euer|eure\w*)\b/i.test(text)) continue;
        if (i === 0) {
          warns.push({ key: `validator-warn:${itemId}`, kind: "validator-warn", itemId, note: `sentence-initial "${tokens[i]!}" in ${field} — she/they or formal address? Human call.` });
        } else {
          errors.push(`${slug}: V-12 — ${itemId}: mid-sentence "${tokens[i]!}" in ${field} (formal address is banned; du-form only)`);
        }
      }
    }
  };
  for (const it of [...items.vocab, ...items.grammar]) {
    for (const f of germanFields(it)) checkText(it.id, f.field, f.text);
  }
  return { errors, warns };
}

/** EN grammar jargon — banned in EVERY student-facing field (incl. hints). */
/** Abstract grammar-mechanism jargon — banned EVERYWHERE (incl. hints). */
const EN_JARGON = [
  "modal verb", "auxiliary", "infinitive", "base form", "third person", "gerund",
  "passive voice", "reported speech", "conditional", "comparative", "superlative", "preposition",
  "conjunction", "adverb", "past participle", "question tag",
];
/**
 * English tense/structure NAMES — the MORE! textbook's own grammar-box labels
 * (students see "Present simple", "Past simple" in their book). Banned in
 * student-facing carriers, but allowed in hintDe/explainDe — the help text may
 * name the structure the way the book does, exactly like DE_TERMS.
 */
const EN_TENSE_NAMES = [
  "past simple", "simple past", "present perfect", "past continuous",
  "present simple", "present continuous", "will-future",
  // NB: bare "going to" is NOT here — it is everyday English ("going to the zoo",
  // "going to do it"), not a meta-label. The will-future label covers future meta-talk.
];
/** DE pedagogical terms — allowed ONLY in hintDe/explainDe (textbook precedent). */
const DE_TERMS = [
  "grundform", "zeitform", "hilfsverb", "vergangenheit", "verneinung", "subjekt", "objekt",
  "infinitiv", "signalwort", "mitvergangenheit", "steigerung", "modalverb", "personalform",
];

export function metaTalkErrors(slug: string, items: UnitItems): string[] {
  const errors: string[] = [];
  const hits = (text: string, terms: string[]): string[] => {
    const lower = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
    return terms.filter((t) => lower.includes(` ${t} `) || lower.includes(` ${t}.`) || lower.includes(` ${t},`));
  };
  const carrierFields = (it: VocabItemT | GrammarItemT): Array<{ field: string; text: string }> => {
    if ("w" in it) {
      return [
        { field: "d", text: it.d },
        { field: "s", text: it.s },
        { field: "mc", text: it.mc.join(" ") },
      ];
    }
    return [
      { field: "prompt", text: it.prompt.text },
      { field: "answers", text: fullsAndPartials(it.answers) },
      { field: "distractors", text: it.distractors.join(" ") },
      { field: "pairs", text: it.pairs.map((p) => `${p.left} ${p.right}`).join(" ") },
      { field: "groups", text: it.groups.map((g) => `${g.label} ${g.members.join(" ")}`).join(" ") },
    ];
  };
  const helpFields = (it: VocabItemT | GrammarItemT): Array<{ field: string; text: string }> => {
    if ("w" in it) return [{ field: "hintDe", text: it.hintDe }];
    return [
      { field: "hintDe", text: it.hintDe },
      { field: "hintEn", text: it.hintEn ?? "" },
      { field: "explainDe", text: it.explainDe },
      { field: "explainEn", text: it.explainEn ?? "" },
    ];
  };
  for (const it of [...items.vocab, ...items.grammar]) {
    for (const f of carrierFields(it)) {
      for (const t of hits(f.text, EN_JARGON)) errors.push(`${slug}: V-13 — ${it.id}: EN grammar jargon "${t}" in ${f.field}`);
      for (const t of hits(f.text, EN_TENSE_NAMES)) errors.push(`${slug}: V-13 — ${it.id}: tense name "${t}" in carrier field ${f.field} (allowed only in hints/explains)`);
      for (const t of hits(f.text, DE_TERMS)) errors.push(`${slug}: V-13 — ${it.id}: German grammar term "${t}" in carrier field ${f.field} (allowed only in hints/explains)`);
    }
    for (const f of helpFields(it)) {
      for (const t of hits(f.text, EN_JARGON)) errors.push(`${slug}: V-13 — ${it.id}: EN grammar jargon "${t}" in ${f.field} (banned everywhere, incl. hints)`);
    }
  }
  return errors;
}

/** Irregular English ae/oe/ue words the matcher's regular inflection misses
 *  but that legitimately appear (quoted) in German hints. */
const EN_DIGRAPH_OK = new Set(["goes", "does", "doesn't", "shoes", "toes", "canoe", "foes", "hoe", "oboe"]);

export function germanOrthographyErrors(slug: string, items: UnitItems, matcher: AllowedMatcher): string[] {
  const errors: string[] = [];
  for (const it of [...items.vocab, ...items.grammar]) {
    for (const f of germanFields(it)) {
      // ASCII-umlaut is a per-WORD property; checking word-by-word avoids
      // flagging English structure words quoted in a German hint ("Verneinung
      // mit doesn't + Grundform" — d+oe trips the digraph heuristic).
      for (const word of f.text.match(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß']*/g) ?? []) {
        if (!asciiUmlautSuspect(word)) continue;
        const lower = word.toLowerCase();
        if (matcher.has(lower) || EN_DIGRAPH_OK.has(lower)) continue; // taught/quoted English
        errors.push(`${slug}: V-14 — ${it.id}: possible ASCII umlaut "${word}" in ${f.field}`);
      }
      if (f.text !== f.text.normalize("NFC")) {
        errors.push(`${slug}: V-14 — ${it.id}: ${f.field} is not NFC-normalized`);
      }
    }
  }
  return errors;
}

export function renderShapeErrors(slug: string, items: UnitItems): string[] {
  const errors: string[] = [];
  for (const it of items.grammar) {
    if (it.pairs.length > 0) {
      const lefts = new Set<string>();
      const rights = new Set<string>();
      for (const p of it.pairs) {
        if (lefts.has(p.left.toLowerCase())) errors.push(`${slug}: V-15 — ${it.id}: duplicate pair left "${p.left}"`);
        if (rights.has(p.right.toLowerCase())) errors.push(`${slug}: V-15 — ${it.id}: duplicate pair right "${p.right}"`);
        lefts.add(p.left.toLowerCase());
        rights.add(p.right.toLowerCase());
      }
    }
    if (it.groups.length > 0) {
      const labels = new Set<string>();
      const members = new Set<string>();
      for (const g of it.groups) {
        if (labels.has(g.label.toLowerCase())) errors.push(`${slug}: V-15 — ${it.id}: duplicate group label "${g.label}"`);
        labels.add(g.label.toLowerCase());
        for (const m of g.members) {
          if (members.has(m.toLowerCase())) errors.push(`${slug}: V-15 — ${it.id}: member "${m}" appears in two groups`);
          members.add(m.toLowerCase());
        }
      }
    }
    if (it.format === "anagram") {
      const full = it.answers.find((a) => a.tier === "full");
      if (full !== undefined && full.text.length < 3) {
        errors.push(`${slug}: V-15 — ${it.id}: anagram answer "${full.text}" is too short (<3 letters)`);
      }
    }
    if (it.format === "sentence-building") {
      const budget = it.presentation.gameMeta?.chipBudget ?? 12;
      const longest = Math.max(0, ...it.answers.filter((a) => a.tier === "full").map((a) => wordTokens(a.text).length));
      if (longest + it.distractors.length > budget) {
        errors.push(`${slug}: V-15 — ${it.id}: ${longest} answer chips + ${it.distractors.length} distractor chips exceed the chip budget (${budget})`);
      }
    }
  }
  return errors;
}

export function variantErrors(slug: string, items: UnitItems): string[] {
  const errors: string[] = [];
  for (const it of [...items.vocab, ...items.grammar]) {
    const keys = new Set<string>();
    for (const v of it.presentation.variants) {
      if (keys.has(v.key)) errors.push(`${slug}: V-16 — ${it.id}: duplicate variant key "${v.key}"`);
      keys.add(v.key);
    }
  }
  return errors;
}

export function gameMetaErrors(slug: string, items: UnitItems): string[] {
  const errors: string[] = [];
  for (const it of items.vocab) {
    if (it.presentation.gameMeta === null) {
      errors.push(`${slug}: V-17 — ${it.id}: vocab items require gameMeta (distractor pool for encounters)`);
    }
  }
  for (const it of items.grammar) {
    const needs = it.format === "multiple-choice" || it.format === "context-picker" || it.format === "sentence-building";
    if (needs && it.presentation.gameMeta === null) {
      errors.push(`${slug}: V-17 — ${it.id}: ${it.format} requires gameMeta`);
    }
    const gm = it.presentation.gameMeta;
    if (gm !== null && gm.minOptions !== null && gm.minOptions > gm.distractorPool.length + 1) {
      errors.push(`${slug}: V-17 — ${it.id}: minOptions ${gm.minOptions} exceeds pool+answer (${gm.distractorPool.length + 1})`);
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// the per-unit orchestrator
// ---------------------------------------------------------------------------

interface V1VocabUnit {
  entries: unknown[];
}

export function validateUnitItems(
  slug: string,
  opts: { skipGateIntegrity?: boolean } = {},
): ItemValidation {
  const errors: string[] = [];
  const warns: ValidatorWarn[] = [];
  const infos: string[] = [];
  const unitDir = path.join(UNITS_DIR, slug);
  const m = /^g([1-4])-u(\d{2})$/.exec(slug);
  if (m === null) return { errors: [`bad slug ${slug}`], warns, infos };
  const grade = Number(m[1]) as Grade;
  const unit = parseInt(m[2]!, 10);

  // ---- V-1 schema
  const vocabRaw = readJsonIfExists<unknown>(path.join(unitDir, "vocab.json"));
  const grammarRaw = readJsonIfExists<unknown>(path.join(unitDir, "grammar.json"));
  if (vocabRaw === null && grammarRaw === null) return { errors, warns, infos };

  let vocabItems: VocabItemT[] = [];
  let grammarItems: GrammarItemT[] = [];
  if (vocabRaw !== null) {
    const parsed = VocabFile.safeParse(vocabRaw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues.slice(0, 10)) {
        errors.push(`${slug}: V-1 — vocab.json: ${issue.message} at ${issue.path.join(".")}`);
      }
    } else {
      if (parsed.data.slug !== slug) errors.push(`${slug}: V-1 — vocab.json slug says ${parsed.data.slug}`);
      vocabItems = parsed.data.items;
    }
  }
  if (grammarRaw !== null) {
    const parsed = GrammarFile.safeParse(grammarRaw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues.slice(0, 10)) {
        errors.push(`${slug}: V-1 — grammar.json: ${issue.message} at ${issue.path.join(".")}`);
      }
    } else {
      if (parsed.data.slug !== slug) errors.push(`${slug}: V-1 — grammar.json slug says ${parsed.data.slug}`);
      grammarItems = parsed.data.items;
    }
  }
  if (errors.length > 0) return { errors, warns, infos }; // downstream checks need valid shapes
  const items: UnitItems = { vocab: vocabItems, grammar: grammarItems };

  const bank = readJsonIfExists<WordBankT>(path.join(unitDir, "wordbank.json"));
  if (bank === null) {
    errors.push(`${slug}: V-2 — items exist but wordbank.json is missing`);
    return { errors, warns, infos };
  }

  // ---- V-2 ids/lock + V-20 bank coverage
  const bankIds = new Set(bank.entries.map((e) => e.id));
  const vocabIds = new Set(items.vocab.map((it) => it.id));
  for (const it of items.vocab) {
    if (!bankIds.has(it.id)) errors.push(`${slug}: V-2 — vocab item ${it.id} has no bank entry`);
  }
  for (const id of bankIds) {
    if (!vocabIds.has(id)) errors.push(`${slug}: V-20 — bank word ${id} has no vocab item`);
  }
  const lock = readJsonIfExists<{ items: Record<string, string> }>(path.join(unitDir, "items.lock.json"));
  if (items.grammar.length > 0) {
    if (lock === null) {
      errors.push(`${slug}: V-2 — grammar items exist but items.lock.json is missing`);
    } else {
      const pinned = new Set(Object.values(lock.items));
      for (const it of items.grammar) {
        if (!pinned.has(it.id)) errors.push(`${slug}: V-2 — grammar item ${it.id} is not pinned in items.lock.json`);
      }
    }
  }

  // ---- V-3 structure refs
  const catalog = loadStructuresCatalog(grade);
  const unitStructures = (catalog?.structures ?? []).filter((s) => s.unit === unit);
  const structureIds = new Set(unitStructures.map((s) => s.id));
  for (const it of items.grammar) {
    if (!structureIds.has(it.structureId)) {
      errors.push(`${slug}: V-3 — ${it.id}: structureId ${it.structureId} not in the g${grade} catalog for unit ${unit}`);
    }
  }

  // ---- V-5..V-17 content checks
  const matcher = buildAllowedMatcher(slug);
  errors.push(...levelGateErrors(slug, items, matcher));
  errors.push(...glossErrors(slug, items, matcher));
  const sub = substitutionErrors(slug, items);
  errors.push(...sub.errors);
  warns.push(...sub.warns);
  errors.push(...definitionLeakErrors(slug, items, bank));
  errors.push(...distractorErrors(slug, items, matcher));
  const trans = translationSanity(slug, items);
  errors.push(...trans.errors);
  warns.push(...trans.warns);
  const sie = sieRule(slug, items);
  errors.push(...sie.errors);
  warns.push(...sie.warns);
  errors.push(...metaTalkErrors(slug, items));
  errors.push(...germanOrthographyErrors(slug, items, matcher));
  errors.push(...renderShapeErrors(slug, items));
  errors.push(...variantErrors(slug, items));
  errors.push(...gameMetaErrors(slug, items));

  // ---- V-19 floors
  const v1Vocab = readJsonIfExists<V1VocabUnit>(
    path.join(UNITS_DIR, "..", "..", "build", "v1", "vocab", `g${grade}`, `unit-${String(unit).padStart(2, "0")}.json`),
  );
  if (v1Vocab !== null && items.vocab.length < v1Vocab.entries.length) {
    errors.push(`${slug}: V-19 — ${items.vocab.length} vocab item(s) < v1 floor ${v1Vocab.entries.length}`);
  }
  if (unitStructures.length > 0) {
    if (fs.existsSync(path.join(V1_GRAMMAR_SNAPSHOT_DIR, `m${grade}.json`))) {
      const v1 = loadV1GrammarModule(grade);
      const byStructure = v1ItemsByStructure(v1.module);
      let floor = 0;
      for (const s of unitStructures) {
        for (const v1Id of s.seedV1) floor += (byStructure.get(v1Id) ?? []).length;
      }
      if (items.grammar.length < floor) {
        errors.push(`${slug}: V-19 — ${items.grammar.length} grammar item(s) < v1 floor ${floor} (mapped structures)`);
      }
    } else {
      infos.push(`${slug}: V-19 grammar floor skipped — no v1 grammar snapshot`);
    }
  }

  // ---- V-21 structure coverage
  for (const s of unitStructures) {
    const its = items.grammar.filter((it) => it.structureId === s.id);
    if (its.length === 0) {
      errors.push(`${slug}: V-21 — structure ${s.id} has no items`);
      continue;
    }
    const formats = new Set(its.map((it) => it.format));
    if (formats.size < 3) errors.push(`${slug}: V-21 — structure ${s.id} has ${formats.size} format(s); ≥3 required`);
    const diffs = new Set(its.map((it) => it.difficulty));
    if (diffs.size < 2) errors.push(`${slug}: V-21 — structure ${s.id} items are all difficulty ${[...diffs][0]} (≥2 levels required)`);
    else if (diffs.size === 2) infos.push(`${slug}: structure ${s.id} covers 2 of 3 difficulty levels`);
  }

  // ---- V-22 gate integrity (per unit). Skipped by the ingest-review approve
  // re-validation, which only cares whether the EDITED items are content-valid
  // (V-1..V-21) — the gate-integrity bookkeeping is mid-flux during the approve
  // (the approved transition is appended right after this check).
  const log = readStateLog(unitDir);
  const currentHash = itemsContentHash(items);
  if (!opts.skipGateIntegrity) {
  // every item-stage state carries a contentHash over the item layer —
  // changes_requested too (the reviewer's inline edits land before it), so the
  // drift guard must anchor on it, not on the prior review_ready hash.
  const ITEM_STATES = new Set(["generated", "verified", "validated", "review_ready", "changes_requested", "approved"]);
  const lastItemState = [...(log?.transitions ?? [])].reverse().find((t) => ITEM_STATES.has(t.state));
  if (lastItemState !== undefined && lastItemState.contentHash !== currentHash) {
    errors.push(`${slug}: V-22 — recorded ${lastItemState.state} hash ${lastItemState.contentHash?.slice(0, 12)} ≠ current items ${currentHash.slice(0, 12)} (drifted)`);
  }
  const lastState = log?.transitions[log.transitions.length - 1]?.state;
  const merged = readJsonIfExists<VerifyMerged>(path.join(unitDir, "verify", "verify.merged.json"));
  if (lastState !== undefined && ["verified", "validated", "review_ready", "approved"].includes(lastState)) {
    if (merged === null) errors.push(`${slug}: V-22 — state ${lastState} but verify/verify.merged.json is missing`);
    else {
      // an approved unit's items may legitimately differ from the verify round —
      // the reviewer's audited cell edits post-date verify; the approved gate is
      // the review-flags completeness + the doc byte-regen below, not verify freshness.
      if (lastState !== "approved" && merged.itemsHash !== currentHash.slice(0, 12)) {
        errors.push(`${slug}: V-22 — verify.merged is for items ${merged.itemsHash}, current ${currentHash.slice(0, 12)}`);
      }
      const escalatedSet = new Set(merged.escalated);
      const unresolved = Object.values(merged.byItem).flat().filter((f) => f.severity === "fix" && !escalatedSet.has(f.key));
      if (unresolved.length > 0) {
        errors.push(`${slug}: V-22 — state ${lastState} with ${unresolved.length} non-escalated fix flag(s)`);
      }
    }
  }
  if (lastState === "approved") {
    const flags = readJsonIfExists<{ unit: { verdict: string }; flags: Array<{ key: string; verdict: string }> }>(
      path.join(unitDir, "review", "items.flags.json"),
    );
    if (flags === null) errors.push(`${slug}: V-22 — approved but review/items.flags.json is missing`);
    else {
      if (flags.unit.verdict !== "ok") errors.push(`${slug}: V-22 — approved but unit verdict is ${flags.unit.verdict}`);
      const unresolved = flags.flags.filter((f) => f.verdict === "fix" || f.verdict === "add" || f.verdict === "");
      if (unresolved.length > 0) errors.push(`${slug}: V-22 — approved with unresolved review flags: ${unresolved.map((f) => f.key).join(", ")}`);
    }
    if (readJsonIfExists<unknown>(path.join(unitDir, "review", "items.reviewed.json")) === null) {
      errors.push(`${slug}: V-22 — approved but review/items.reviewed.json is missing`);
    }
  }
  // item-fixes integrity
  const fixes = readJsonIfExists<ItemFixes>(ITEM_FIXES_PATH)?.[slug];
  if (fixes !== undefined) {
    const allIds = new Set([...items.vocab.map((i) => i.id), ...items.grammar.map((i) => i.id)]);
    for (const dropId of fixes.drop ?? []) {
      if (allIds.has(dropId)) errors.push(`${slug}: V-22 — item-fixes drop ${dropId} did not land`);
    }
    for (const [id, patch] of Object.entries(fixes.patch ?? {})) {
      if ((fixes.drop ?? []).includes(id)) continue;
      const item = [...items.vocab, ...items.grammar].find((i) => i.id === id);
      if (item === undefined) {
        errors.push(`${slug}: V-22 — item-fixes patch targets missing id ${id}`);
        continue;
      }
      for (const [field, value] of Object.entries(patch)) {
        if (JSON.stringify((item as unknown as Record<string, unknown>)[field]) !== JSON.stringify(value)) {
          errors.push(`${slug}: V-22 — item-fixes patch on ${id}.${field} did not land`);
        }
      }
    }
  }
  // grant orphans
  const grants = grantsForUnit(slug);
  for (const g of grants.all) {
    if (g.itemId !== null && ![...items.vocab, ...items.grammar].some((i) => i.id === g.itemId)) {
      errors.push(`${slug}: V-22 — level grant for missing item ${g.itemId}`);
    }
  }
  } // end gate-integrity (V-22)

  return { errors, warns, infos };
}

/** Corpus-global item checks (run once per validate). */
export function validateItemsGlobal(): { errors: string[]; infos: string[] } {
  const errors: string[] = [];
  const infos: string[] = [];
  const committed = readJsonIfExists<ProperNounsFile>(PROPER_NOUNS_PATH);
  if (committed !== null) {
    const recomputed = buildHarvest();
    if (JSON.stringify(committed) !== JSON.stringify(recomputed)) {
      errors.push("proper-nouns.json drifted from the deterministic harvest — run `content harvest-nouns`");
    }
  }
  const grantsFile = readJsonIfExists<LevelGrantsFile>(LEVEL_GRANTS_PATH);
  for (const g of grantsFile?.grants ?? []) {
    if (!fs.existsSync(path.join(UNITS_DIR, g.slug))) {
      errors.push(`level-grants: grant for unknown unit ${g.slug}`);
    }
  }
  return { errors, infos };
}
