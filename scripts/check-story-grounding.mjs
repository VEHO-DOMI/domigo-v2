// THE GROUNDING CHECKER (doc 29 §6) — story-mode English truth + giveaway law + register law.
// Run: node scripts/check-story-grounding.mjs   (exit 1 on any violation; CI-runnable)
//
// A) Every English token in the prologue (ch00), the new ch01 beat scenes (s011+), and every
//    game task (keen/chNN.tasks.json) must be grounded: in the MORE! 1 Unit-1 lexicon
//    (docs/design/g1/grounding/u01-lexicon.json), a scene/task gloss, or a proper noun.
// B) Giveaway law (§4.3): a task's answer token never appears in its own promptEn or storyDe.
// C) Register law v2 (§1.1): banned German on all story-mode German fields.
import fs from "node:fs";

const BASE = "content/corpus/stories/g1.st.lost-pages";
const lex = JSON.parse(fs.readFileSync("docs/design/g1/grounding/u01-lexicon.json", "utf8"));
const story = JSON.parse(fs.readFileSync(`${BASE}/story.json`, "utf8"));
const level = JSON.parse(fs.readFileSync(`${BASE}/keen/ch01.level.json`, "utf8"));
const boss = JSON.parse(fs.readFileSync(`${BASE}/keen/ch01.boss.json`, "utf8"));

let failures = 0;
const fail = (where, msg) => { failures += 1; console.error(`✗ ${where}: ${msg}`); };

// ── the grounding vocabulary ──
const words = new Set(lex.words.map((w) => w.toLowerCase()));
const phrases = lex.phrases.map((p) => p.toLowerCase());
const proper = new Set(lex.properNouns.map((w) => w.toLowerCase()));
// crude plural/verb-form lemmatizer: books→book, babies→baby, sits→sit
function grounded(tokRaw, extra) {
  const tok = tokRaw.toLowerCase();
  if (words.has(tok) || proper.has(tok) || extra.has(tok)) return true;
  if (tok.endsWith("ies") && words.has(tok.slice(0, -3) + "y")) return true;
  if (tok.endsWith("es") && words.has(tok.slice(0, -2))) return true;
  if (tok.endsWith("s") && (words.has(tok.slice(0, -1)) || proper.has(tok.slice(0, -1)))) return true;
  return false;
}
const tokens = (en) => (en.toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
// interjections + closed-class function words carry no lexical load — allowed at any level
const FREE = new Set(["oh", "ssh", "psst", "brrr", "puh", "miaow", "wow", "hey", "but", "now", "do", "too"]);
function checkEn(where, en, glosses) {
  const extra = new Set();
  for (const gl of glosses ?? []) for (const t of tokens(gl.word)) extra.add(t);
  // phrases ground all their member tokens
  const enLow = en.toLowerCase();
  for (const p of phrases) if (enLow.includes(p)) for (const t of tokens(p)) extra.add(t);
  for (const t of tokens(en)) {
    if (!FREE.has(t) && !grounded(t, extra)) fail(where, `EN token not grounded in MORE! 1 Unit 1: "${t}" (line: "${en}")`);
  }
}

// ── register bans (German story fields) ──
const BANNED_DE = ["verhedder", "Monster", "Blut", "böse", "Bösewicht", "schrei", "sterben", "tot "];
function checkDe(where, de) {
  for (const b of BANNED_DE) if ((de ?? "").includes(b)) fail(where, `register-law violation: "${b}" in "${de}"`);
}

// ── A+C on prologue + new ch01 beat scenes ──
const ch00 = story.chapters.find((c) => c.id.endsWith(".ch00"));
const ch01 = story.chapters.find((c) => c.id.endsWith(".ch01"));
const beatScenes = [...ch00.scenes, ...ch01.scenes.filter((s) => Number(s.id.split(".s").pop()) >= 11)];
for (const s of beatScenes) {
  const where = s.id.split(".").slice(-2).join(".");
  checkEn(where, s.textEn, s.glosses);
  checkDe(where, s.scaffoldDe);
  if ((s.taskSlots ?? []).length > 0) fail(where, "no-task-in-cutscene law: beat scene carries a taskSlot");
}
checkDe("ch01.level header", `${level.header.name} ${level.header.goalDe} ${level.header.whyDe}`);
checkDe("ch01.boss", `${boss.intro} ${boss.outro} ${(boss.taunts ?? []).join(" ")}`);

// ── A+B+C on game tasks ──
for (const f of fs.readdirSync(`${BASE}/keen`).filter((x) => x.endsWith(".tasks.json"))) {
  const pack = JSON.parse(fs.readFileSync(`${BASE}/keen/${f}`, "utf8"));
  const seen = new Set();
  for (const it of pack.items) {
    const where = `${f} ${it.id}`;
    if (seen.has(it.id)) fail(where, "duplicate task id");
    seen.add(it.id);
    if (!/^g1\.game\.ch\d{2}\.[a-z0-9]+$/.test(it.id)) fail(where, `bad id shape: ${it.id}`);
    if (!it.storyDe) fail(where, "story-task law: missing storyDe (a task without a story reason doesn't ship)");
    checkDe(where, it.storyDe);
    checkEn(where, it.promptEn, it.glosses);
    // the restoration room's colour stage grounds like any prompt (doc 30 §3)
    if (it.colour !== undefined) {
      checkEn(where, it.colour.promptEn, it.glosses);
      checkEn(where, it.colour.answer, it.glosses);
      if (!it.colour.options.includes(it.colour.answer)) fail(where, "colour answer not among colour options");
    }
    // only the ANSWER needs grounding — distractors may be deliberately malformed
    // forms (morphology tasks: "bookes"/"boks"); real-word distractors are the
    // author's call, the answer is the language students internalize.
    checkEn(where, it.answer, it.glosses);
    // giveaway law (§4.3): a giveaway is an UNINTENDED reveal. When the
    // repetition IS the pedagogy (identity plurals: "One fish, two fish"),
    // the author DECLARES it — identityAnswer: true + identityNote. The
    // declaration is policed: it only holds when the answer token really
    // appears in the prompt (no lazy blanket exemptions). (Koki 2026-07-17)
    const ansToks = new Set(tokens(it.answer));
    const inPrompt = tokens(it.promptEn).some((t) => ansToks.has(t));
    if (it.identityAnswer === true) {
      if (!inPrompt) fail(where, "identityAnswer declared but the answer never appears in the prompt — remove the flag");
      if (!it.identityNote) fail(where, "identityAnswer needs an identityNote (say WHY the repetition is the task)");
    } else {
      for (const t of tokens(it.promptEn)) if (ansToks.has(t)) fail(where, `giveaway: answer token "${t}" appears in promptEn (if the repetition IS the task, declare identityAnswer + identityNote)`);
    }
    for (const t of tokens(it.storyDe)) if (ansToks.has(t)) fail(where, `giveaway: answer token "${t}" appears in storyDe`);
    // hint ladder completeness (doc 29 §4.5)
    if (it.kind === "typed" && !(it.hints?.firstLetter && it.hints?.length && it.hints?.deDesc && it.hints?.deWord)) {
      fail(where, "typed task missing the 4-step hint ladder");
    }
    if (it.kind === "choice" && !(it.hints?.deDesc && it.hints?.deWord)) fail(where, "choice task missing hints (steps 3-4)");
    if (it.kind === "choice" && !(it.options ?? []).includes(it.answer)) fail(where, "answer not among options");
  }
}

if (failures === 0) console.log("check-story-grounding: OK — prologue, beat scenes, headers, boss and game tasks all grounded, giveaway-free, in register");
else { console.error(`check-story-grounding: ${failures} failure(s)`); process.exit(1); }
