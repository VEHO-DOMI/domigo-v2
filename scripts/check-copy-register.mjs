#!/usr/bin/env node
// R5-W4 · C2 · THE REGISTER GATE — every German line the child reads is Austrian.
//
// WHY THIS EXISTS. Koki replayed the chapter on 2026-08-15 and read the copy out
// loud: „Der Füller ist eher deutsch, Füllfeder sagt man in Österreich — ALLE
// Beschreibungen österreichisch." He was reading a chapter written for children
// in Vienna, in words from a German dictionary — and nothing in this repo held
// an opinion about that, because there WAS no Austrian lexicon (0 hits for
// „Füllfeder", 0 for „Uhu" across the whole tree before this session).
//
// `check-paint-copy` already polices three things over the same German: the
// cloak (no antagonist name), the register ban list (no Monster/Blut/böse…) and
// the quote law. This gate is the fourth belt and the one nobody had: WHICH
// WORD, out of several that all mean the thing, does this book use.
//
// Run: node scripts/check-copy-register.mjs            (exit 1 on any violation)
//      node scripts/check-copy-register.mjs --selftest (proves the red light works)
//
// ── THE THREE SURFACES ───────────────────────────────────────────────────────
// Exactly the places a child reads German, and nothing else:
//   1. the cards      — ch01.tasks.v2.json: showsDe · storyDe · colourAskDe · hints
//   2. the level      — ch01.level.json: name · goalDe · whyDe · hintsDe ·
//                       captiveDe · topicDe · merksatzDe · erklaerungDe
//   3. the shell      — packages/game-paint/src/**/*.ts(x), comments stripped
//
// The CORPUS (content/corpus/units/**) is deliberately OUT. There the wordbank
// carries the translation gloss (pencil case → Federmäppchen) and that belongs
// to the vocabulary lane, not to this one. A gate that policed both lists with
// one rule would force one of the two lanes to lie.
//
// ── WHY THE NOUNS ARE MATCHED CASE-SENSITIVELY ───────────────────────────────
// „Ranzen" is a banned word; `ranzen` is the school bag's SKIN NAME and appears
// in the level, the cards and half the render code. A German noun is capitalised
// in a sentence and an identifier is not, so case is the discriminator — and it
// is a real one, not a convenience: with a case-insensitive match this gate
// would report fourteen false hits on its first run and be switched off by the
// second session that met it.
//
// ── WHY THE LIST LIVES IN A JSON AND NOT IN THIS FILE ────────────────────────
// Two reasons, and the second is the one that matters. First, the list is data
// a human argues with — Koki reads it, K2 owns the prose. Second, EVERY entry
// carries `belegt`: `live` means the class was derived from a line this session
// actually fixed, `lexikon` means it came from K2's list and has not been hit
// yet. That distinction is what keeps a ban list from growing into folklore:
// anyone can ask which rules have ever caught anything.

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const LEXICON = "scripts/lexikon-at.json";
const TASKS = "content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json";
const LEVEL = "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json";
const SHELL_ROOT = "packages/game-paint/src";
const selftest = process.argv.includes("--selftest");

let failures = 0;
const reported = [];
const fail = (where, msg) => { failures++; reported.push(`${where}: ${msg}`); console.error(`✗ ${where}: ${msg}`); };

// ── the stripper ─────────────────────────────────────────────────────────────
// COPIED, with its reason, from scripts/check-paint-copy.mjs (`codeOnly`). It is
// exported there, but that file runs its whole gate at import time and calls
// process.exit — importing it would run I2's checks inside this one. Extracting
// it into a shared module is the right end state and is filed for wave 5; it is
// not done here because check-paint-copy.mjs belongs to lane I2 this wave and a
// class fix that crosses an ownership wall is a finding, not an action.
//
// Quote-aware on purpose: the naive regex form eats everything after a `//`
// INSIDE a string literal, which fails OPEN on exactly this kind of law.
export function codeOnly(src) {
  const out = [];
  let inBlock = false;
  for (const line of src.split("\n")) {
    let kept = "";
    let quote = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      const next = line[i + 1];
      if (inBlock) {
        if (c === "*" && next === "/") { inBlock = false; i++; }
        continue;
      }
      if (quote !== null) {
        kept += c;
        if (c === "\\") { kept += next ?? ""; i++; continue; }
        if (c === quote) quote = null;
        continue;
      }
      if (c === "'" || c === '"' || c === "`") { quote = c; kept += c; continue; }
      if (c === "/" && next === "/") break;
      if (c === "/" && next === "*") { inBlock = true; i++; continue; }
      kept += c;
    }
    out.push(kept);
  }
  return out;
}

// ── the lexicon ──────────────────────────────────────────────────────────────
const lex = JSON.parse(fs.readFileSync(LEXICON, "utf8"));
const entries = lex.eintraege ?? [];
const patterns = (lex.muster ?? []).map((m) => ({ ...m, rx: new RegExp(m.re, m.felder?.includes("*") ? "" : "") }));

/** A banned noun, matched as a whole capitalised word. */
const bannedHits = (text) => {
  const hits = [];
  for (const e of entries) {
    for (const bad of e.verboten ?? []) {
      if (new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${bad}([^A-Za-zÄÖÜäöüß]|$)`).test(text)) {
        hits.push({ bad, want: e.at, why: e.bemerkung, belegt: e.belegt });
      }
    }
  }
  return hits;
};

/** A pattern hit. `field` decides which patterns apply: a rule scoped to
 *  `colourAskDe` must not fire on a line that is not one. */
const patternHits = (text, field) => {
  const hits = [];
  for (const m of patterns) {
    const scoped = (m.felder ?? ["*"]).includes("*") || (m.felder ?? []).includes(field);
    if (!scoped) continue;
    if (m.rx.test(text)) hits.push(m);
  }
  return hits;
};

/** Everything both laws have to say about one line. Returned rather than
 *  printed, so the selftest can run the REAL laws over a prepared traitor. */
export function registerFailures(text, field) {
  const out = [];
  for (const h of bannedHits(text)) {
    out.push({ law: "lexikon", detail: `„${h.bad}" ist die deutsche Variante — dieses Buch sagt ${h.want}. ${h.why}` });
  }
  for (const m of patternHits(text, field)) {
    out.push({ law: m.id, detail: `${m.id}: ${m.warum}` });
  }
  return out;
}

// ── the coupling to K2's prose ───────────────────────────────────────────────
// The JSON mirrors LEXIKON_AT.md. A mirror nobody compares is two documents.
const PROSE = lex.prosaQuelle;
let proseState;
if (PROSE && fs.existsSync(PROSE)) {
  const prose = fs.readFileSync(PROSE, "utf8");
  const missing = entries.map((e) => e.kern).filter((k) => !prose.includes(k));
  if (missing.length > 0) {
    fail(LEXICON, `spiegelt ${PROSE}, aber diese Begriffe stehen dort nicht: ${missing.join(" · ")} — eine der beiden Fassungen ist veraltet`);
  }
  proseState = `gekoppelt an ${PROSE} (${entries.length} Begriffe, alle belegt)`;
} else {
  // NOT silent: K2 merges before C2 and the file will appear. Until it does the
  // gate says so on every run, so nobody reads the missing coupling as a pass.
  proseState = `⚠ ${PROSE} liegt noch nicht auf main (K2 mergt davor) — die Spiegel-Prüfung schläft bis dahin; dieses JSON ist heute die einzige Fassung`;
}

// ── the selftest ─────────────────────────────────────────────────────────────
if (selftest) {
  const cases = [
    // Every traitor below is a line that REALLY STOOD in the chapter this
    // morning — the tamper is worth most when it is the defect that shipped.
    ["der Füller, wie er dreimal im Kapitel stand",
      registerFailures("Der Füller steht grau da, die Spitze blass", "showsDe"),
      (f) => f.some((x) => x.law === "lexikon" && x.detail.includes("Füllfeder"))],
    ["die Federtasche, wie sie in zwei Zeilen stand",
      registerFailures("Was gehört NICHT in die Federtasche?", "storyDe"),
      (f) => f.some((x) => x.law === "lexikon" && x.detail.includes("Federpennal"))],
    ["das Epitheton statt des Nomens",
      registerFailures("Ein kleiner Kasten liegt grau im Hof", "showsDe"),
      (f) => f.some((x) => x.law === "epitheton-statt-nomen")],
    ["das Gleichnis in der Farbzeile (R47)",
      registerFailures("„Ich war rot wie ein Apfel!“, seufzt es.", "colourAskDe"),
      (f) => f.some((x) => x.law === "gleichnis-in-der-farbzeile")],
    // The form the narrow first draft of this pattern missed: an adjective
    // where it expected an article. Two of the nine lines R47 retired looked
    // exactly like this, so the rule matched 7 of 9 and read as complete.
    ["…und das artikellose Gleichnis, das die erste Fassung der Regel durchließ",
      registerFailures("„Ich war braun wie warmes Holz!“, brummt er.", "colourAskDe"),
      (f) => f.some((x) => x.law === "gleichnis-in-der-farbzeile")],
    ["die Schweizer ss-Form",
      registerFailures("Auf Deutsch: Wie heisst du?", "hints.deWord"),
      (f) => f.some((x) => x.law === "schweizer-ss")],
    // ── and the cases that must stay GREEN, because a ban list that fires on
    //    everything is switched off by the next session that meets it ──
    ["NON-TAMPER · die reparierten Zeilen sagen nichts",
      [...registerFailures("Die Füllfeder steht grau da.", "showsDe"),
        ...registerFailures("Der Spitzer war blau.", "colourAskDe"),
        ...registerFailures("Was gehört NICHT ins Federpennal?", "storyDe"),
        ...registerFailures("Auf Deutsch: Wie heißt du?", "hints.deWord")],
      (f) => f.length === 0],
    ["NON-TAMPER · der interne Skin-Name `ranzen` ist kein Nomen",
      registerFailures('const skin = "ranzen";', "shell"), (f) => f.length === 0],
    ["…und »Ranzen« als deutsches Wort schlägt sehr wohl an",
      registerFailures("Der Ranzen hängt am Spind.", "showsDe"),
      (f) => f.some((x) => x.law === "lexikon" && x.detail.includes("Schultasche"))],
    ["NON-TAMPER · korrekte ss-Wörter sind keine Schweizer Formen",
      registerFailures("Du musst das nicht, dass ist klar.", "storyDe"), (f) => f.length === 0],
    ["NON-TAMPER · ein Gleichnis-Muster außerhalb der Farbzeile ist erlaubt",
      registerFailures("Er hält drei Sätze wie ein Fächer hoch.", "showsDe"), (f) => f.length === 0],
    // ── and the stripper, which every shell check rides on ──
    ["VACUITY · der Stripper behält eine sichtbare Zeile",
      codeOnly('const s = "Los geht\'s!"; // Der Füller').join("\n"),
      (s) => s.includes("Los geht") && !s.includes("Der Füller")],
  ];

  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify(got)}`}`);
  }
  if (bad > 0) { console.error(`check-copy-register --selftest: ${bad} case(s) did NOT bite — this gate cannot be trusted`); process.exit(1); }
  console.log(`check-copy-register --selftest: OK — ${cases.length} cases, every red light seen and every green case still green`);
  process.exit(0);
}

// ── 1 · the cards ────────────────────────────────────────────────────────────
const CARD_FIELDS = ["showsDe", "storyDe", "colourAskDe"];
let cardLines = 0;
const tasks = JSON.parse(fs.readFileSync(TASKS, "utf8"));
for (const t of tasks.items ?? []) {
  const lines = [];
  if (t.stimulus?.type === "entity" && t.stimulus.showsDe) lines.push(["showsDe", t.stimulus.showsDe]);
  for (const f of CARD_FIELDS) if (typeof t[f] === "string") lines.push([f, t[f]]);
  for (const [k, v] of Object.entries(t.hints ?? {})) if (typeof v === "string") lines.push([`hints.${k}`, v]);
  for (const [field, text] of lines) {
    cardLines++;
    for (const e of registerFailures(text, field)) fail(`${TASKS} ${t.id} ${field}`, `${e.detail} — „${text}"`);
  }
}

// ── 2 · the level ────────────────────────────────────────────────────────────
const LEVEL_FIELDS = /(^|\.)(name|goalDe|whyDe|hintsDe|captiveDe|topicDe|merksatzDe|erklaerungDe)(\[\d+\])?$/;
const strings = function* (node, at = "") {
  if (typeof node === "string") { yield [at, node]; return; }
  if (Array.isArray(node)) { for (const [i, v] of node.entries()) yield* strings(v, `${at}[${i}]`); return; }
  if (node !== null && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) yield* strings(v, at === "" ? k : `${at}.${k}`);
  }
};
let levelLines = 0;
const level = JSON.parse(fs.readFileSync(LEVEL, "utf8"));
for (const [at, text] of strings(level)) {
  if (!LEVEL_FIELDS.test(at)) continue;
  levelLines++;
  for (const e of registerFailures(text, at.split(".").pop().replace(/\[\d+\]$/, ""))) fail(`${LEVEL} ${at}`, `${e.detail} — „${text}"`);
}

// ── 3 · the shell ────────────────────────────────────────────────────────────
const shellFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) shellFiles.push(full);
  }
};
walk(SHELL_ROOT);
let shellLines = 0;
for (const file of shellFiles) {
  const lines = codeOnly(fs.readFileSync(file, "utf8"));
  lines.forEach((line, i) => {
    if (line.trim().length === 0) return;
    shellLines++;
    for (const e of registerFailures(line, "shell")) fail(`${file}:${i + 1}`, `${e.detail} — ${line.trim()}`);
  });
}

// ── VACUITY — the gate proves it still sees ──────────────────────────────────
// Each of the three walks can silently find nothing: a renamed field, a moved
// file, a lexicon that failed to parse into an empty list. Every one of those
// reads as a green gate.
if (entries.length === 0) fail("VACUITY", `${LEXICON} carries no entries — every lexicon rule is asleep`);
if (patterns.length === 0) fail("VACUITY", `${LEXICON} carries no patterns — the epithet and simile rules are asleep`);
if (cardLines < 100) fail("VACUITY", `only ${cardLines} German card lines were scanned — the card walk missed the fields`);
if (levelLines < 4) fail("VACUITY", `only ${levelLines} German level lines were scanned — the level walk missed the fields`);
if (shellLines < 500) fail("VACUITY", `only ${shellLines} shell lines survived the stripper — that is not a comment strip, that is a hole`);
// …and the laws must be able to REFUTE, not only to confirm. A matcher that
// matched nothing at all would report a clean repo forever.
if (registerFailures("Der Füller steht grau da", "showsDe").length === 0) {
  fail("VACUITY", "the lexicon law does not fire on a line that is a known violation — it is not discriminating and every verdict above is noise");
}

console.log(`  ${proseState}`);
if (failures > 0) {
  console.error(`\ncheck-copy-register: ${failures} violation(s) over ${cardLines} card lines · ${levelLines} level lines · ${shellLines} shell lines`);
  process.exit(1);
}
console.log(`check-copy-register: OK — ${cardLines} card lines, ${levelLines} level lines and ${shellLines} shell lines are all in the Austrian register (${entries.length} Begriffe, ${patterns.length} Muster)`);
