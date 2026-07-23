// PB-T6 · THE gameTasks@2 AUTHORING GATE (run: node --experimental-strip-types
// scripts/check-game-tasks.mjs; exit 1 on any violation; CI-runnable).
//
// Three layers over every content/corpus/stories/*/paint/*.tasks.v2.json:
//   1. SCHEMA + cross-field invariants — GameTasksFileV2 (content-schema).
//   2. GROUNDING — every student-visible English token is in the unit lexicon.
//   3. GIVEAWAY + REGISTER — an answer token never leaks into its own prompt/
//      story; German fields carry no threat vocabulary.
// The grounding/register helpers mirror scripts/check-story-grounding.mjs
// (same lexicon, same law) — kept compact and local on purpose.
import fs from "node:fs";
import path from "node:path";
import { GameTasksFileV2 } from "../packages/content-schema/src/game-tasks.ts";

const STORIES = "content/corpus/stories";
const lex = JSON.parse(fs.readFileSync("docs/design/g1/grounding/u01-lexicon.json", "utf8"));

let failures = 0;
const fail = (where, msg) => { failures += 1; console.error(`✗ ${where}: ${msg}`); };

// ── grounding vocabulary (mirrors check-story-grounding.mjs) ──
const words = new Set(lex.words.map((w) => w.toLowerCase()));
const phrases = lex.phrases.map((p) => p.toLowerCase());
const proper = new Set(lex.properNouns.map((w) => w.toLowerCase()));
const FREE = new Set(["oh", "ssh", "psst", "wow", "hey", "but", "now", "do", "too", "yes", "no"]);
const tokens = (en) => (String(en).toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
function grounded(tokRaw, extra) {
  const tok = tokRaw.toLowerCase();
  if (words.has(tok) || proper.has(tok) || extra.has(tok)) return true;
  if (tok.endsWith("ies") && words.has(tok.slice(0, -3) + "y")) return true;
  if (tok.endsWith("es") && words.has(tok.slice(0, -2))) return true;
  if (tok.endsWith("s") && (words.has(tok.slice(0, -1)) || proper.has(tok.slice(0, -1)))) return true;
  return false;
}
function checkEn(where, en) {
  if (!en) return;
  const extra = new Set();
  const enLow = String(en).toLowerCase();
  for (const p of phrases) if (enLow.includes(p)) for (const t of tokens(p)) extra.add(t);
  for (const t of tokens(en)) if (!FREE.has(t) && !grounded(t, extra)) fail(where, `EN token not in MORE! 1 Unit 1: "${t}" (in "${en}")`);
}
// register bans as patterns — "schrei" is boundary-aware so it catches
// schreien/Schrei (scream) but NOT schreib*/Schreiber (to write / writer),
// which are core school vocabulary (the naive-substring pitfall).
const BANNED_DE = [/Monster/, /Blut/, /böse/, /Bösewicht/, /schrei(?!b)/, /sterben/, /tot /];
function checkDe(where, de) {
  for (const re of BANNED_DE) if (re.test(de ?? "")) fail(where, `register-law: ${re} in "${de}"`);
}
// giveaway: a content answer-token must not appear in the task's own prompt/story
function checkGiveaway(where, answer, ...deenFields) {
  const ansToks = new Set(tokens(answer).filter((t) => t.length > 2 && !FREE.has(t)));
  for (const f of deenFields) for (const t of tokens(f)) if (ansToks.has(t)) fail(where, `giveaway: answer token "${t}" appears in a prompt/story field`);
}

// ── the English + German surface of each kind ──
function checkItem(chId, t) {
  const w = `${chId}:${t.id}`;
  // German fields (all kinds)
  checkDe(w, t.storyDe);
  checkDe(w, t.hints?.deDesc);
  checkDe(w, t.hints?.deWord);
  if (t.stimulus?.type === "image") checkDe(w, t.stimulus.altDe);
  if (t.stimulus?.type === "entity") checkDe(w, t.stimulus.showsDe);
  // English surface + giveaway, per kind
  checkEn(w, t.promptEn);
  switch (t.kind) {
    case "choice": t.options.forEach((o) => checkEn(w, o)); checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "typed": checkEn(w, t.answer); (t.accept ?? []).forEach((a) => checkEn(w, a)); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "spell": checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "wheel": t.values.forEach((v) => checkEn(w, v)); checkEn(w, t.answer); checkGiveaway(w, t.answer, t.promptEn, t.storyDe); break;
    case "order": t.orderedChips.forEach((c) => checkEn(w, c)); break;
    case "oddone": t.items.forEach((i) => checkEn(w, i)); break;
    case "mistake": t.sentence.forEach((s) => checkEn(w, s)); checkEn(w, t.fix.correction); (t.correctionOptions ?? []).forEach((o) => checkEn(w, o)); break;
    case "memory": t.pairs.forEach((p) => checkEn(w, p.b)); break;
  }
}

// ── walk every *.tasks.v2.json ──
const files = [];
if (fs.existsSync(STORIES)) {
  for (const story of fs.readdirSync(STORIES)) {
    const dir = path.join(STORIES, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tasks.v2.json"))) files.push(path.join(dir, f));
  }
}
if (files.length === 0) { console.log("check-game-tasks: no gameTasks@2 files yet — nothing to check"); process.exit(0); }

let itemCount = 0;
for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const parsed = GameTasksFileV2.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fail(file, `schema: ${issue.path.join(".")} — ${issue.message}`);
    continue;
  }
  for (const t of parsed.data.items) { checkItem(parsed.data.chapter, t); itemCount++; }
}

if (failures === 0) console.log(`check-game-tasks: OK — ${itemCount} tasks across ${files.length} file(s): schema, grounding, giveaway, register all green`);
else { console.error(`check-game-tasks: ${failures} failure(s)`); process.exit(1); }
