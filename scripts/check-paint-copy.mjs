// R5-C1 · THE PAINTED BOOK'S COPY GATE
// (run: node --experimental-strip-types scripts/check-paint-copy.mjs; exit 1 on
//  any violation; CI-runnable.)
//
// WHY THIS EXISTS. „OSWINs Tinte hat dem Schulhaus die Farben genommen…" was the
// first sentence of chapter 1's objective screen. It shipped, survived four
// packets, and was found by a human replaying the deployed build — because the
// name sat in the one authored surface no gate in this repo read. The task files
// have `check-game-tasks`. The Regel-Seiten have `tip-honesty`. The chapter's own
// German, and every German line hard-coded in the game shell, had nothing.
//
// Three laws over player-visible German:
//   1. THE CLOAK (doc 31 §6) — the antagonist is not named before ch15. In the
//      SHELL that means never at all: its copy serves all fifteen chapters.
//   2. THE REGISTER (doc 41) — the banned-word list, same one the task gate uses.
//   3. THE QUOTE LAW — a German „ closed with an ASCII " . Cosmetic on a page,
//      a syntax error waiting to happen in a string literal (P-registry).
//
// The hard part is deciding what a child can SEE in a .tsx file. Nothing here
// parses TypeScript; it strips comments the way `cards/PaintedIcons.test.ts`
// already trusts — but quote-aware, because the naive regex form eats everything
// after a `//` INSIDE a string literal, which fails OPEN on exactly this law.
// The stripper is itself tested below (see VACUITY): a comment-stripper nobody
// checks is a gate that can quietly strip the whole file and stay green.
import fs from "node:fs";
import path from "node:path";
import { cloakErrorsDe, registerErrorsDe } from "../packages/content-schema/src/game-tasks.ts";

let failures = 0;
const fail = (where, msg) => { failures += 1; console.error(`✗ ${where}: ${msg}`); };

// ── the stripper ─────────────────────────────────────────────────────────────
/** Everything in `src` that is NOT a comment, line by line (blank where a
 *  comment stood, so line numbers survive for the error messages). */
export function codeOnly(src) {
  const out = [];
  let inBlock = false;
  for (const line of src.split("\n")) {
    let kept = "";
    let quote = null; // "'" | '"' | "`" | null
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
      if (c === "/" && next === "/") break;              // line comment
      if (c === "/" && next === "*") { inBlock = true; i++; continue; }
      kept += c;
    }
    out.push(kept);
  }
  return out;
}

// ── 1 · THE SHELL ────────────────────────────────────────────────────────────
const SHELL_ROOT = "packages/game-paint/src";
const shellFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) shellFiles.push(full);
  }
};
walk(SHELL_ROOT);

// The German quote law: a „ closed by an ASCII " with no proper “ in between.
const ASCII_CLOSER = /„[^„“]*"/;

for (const file of shellFiles) {
  const lines = codeOnly(fs.readFileSync(file, "utf8"));
  // The quote law is about what a CHILD reads, so it runs on the render layer
  // only. `level.ts` and `sim.ts` quote German inside law-failure messages
  // („two Regel-Seiten carry the topic „x"…") — those are read by whoever broke
  // a gate, never by a player, and they carry no syntax hazard inside template
  // literals. Policing them would be policing the letter of the rule against
  // its own reason.
  const rendersToChildren = file.endsWith(".tsx");
  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`;
    // No chapter argument: the shell is chapter-less and may never name him.
    for (const err of cloakErrorsDe(line)) fail(where, err);
    if (rendersToChildren && ASCII_CLOSER.test(line)) {
      fail(where, `quote-law: a German „ closed with an ASCII " — use “ (or »…«) — ${line.trim()}`);
    }
  });
}

// ── 2 · THE CONTENT ──────────────────────────────────────────────────────────
// A second belt over the same law the engine's `chapter-copy` enforces, so the
// gate still fails if that law is ever deleted. Walks every German string in the
// paint content, whatever key it hides under.
const STORIES = "content/corpus/stories";
const paintFiles = [];
if (fs.existsSync(STORIES)) {
  for (const story of fs.readdirSync(STORIES)) {
    const dir = path.join(STORIES, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".level.json") || f.endsWith(".tasks.v2.json")) paintFiles.push(path.join(dir, f));
    }
  }
}

/** Every string in a JSON tree, with the dotted path it sits at. */
const strings = function* (node, at = "") {
  if (typeof node === "string") { yield [at, node]; return; }
  if (Array.isArray(node)) { for (const [i, v] of node.entries()) yield* strings(v, `${at}[${i}]`); return; }
  if (node !== null && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) yield* strings(v, at === "" ? k : `${at}.${k}`);
  }
};

// Authoring notes are not player-visible: they are where a designer writes ABOUT
// the chapter, and the ch01 task file's own header note is one. Skipping them is
// deliberate and narrow — anything not on this list is treated as visible.
const NOT_VISIBLE = /(^|\.)(note|grounding|schema|id|chapter|unit)$/;

for (const file of paintFiles) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const chapter = typeof json.chapter === "string" ? json.chapter : undefined;
  for (const [at, text] of strings(json)) {
    if (NOT_VISIBLE.test(at)) continue;
    for (const err of cloakErrorsDe(text, chapter)) fail(`${file} ${at}`, err);
    for (const err of registerErrorsDe(text)) fail(`${file} ${at}`, err);
    if (ASCII_CLOSER.test(text)) {
      fail(`${file} ${at}`, `quote-law: a German „ closed with an ASCII " — use “ — "${text}"`);
    }
  }
}

// ── 2c · THE REGEL-SEITEN EXAMPLE LAW (R5-W2 · I1, doc 45 E2) ────────────────
// Koki read the three rule pages and called them „ein Alibi". The reason no gate
// caught that is structural: `tip-honesty` (level.ts) is a PURE module — it can
// count, cap and register-check a string, but it cannot open the textbook. So
// the claim „this is what your book says" was, until here, only ever a promise.
//
// Two laws, and the split between them is the point:
//   ATTESTATION — the example must appear VERBATIM in the MORE! 1 transcripts.
//     This is the quotes-not-claims rule: a validator that checks the SHAPE of a
//     citation and never the source passes a fabricated one every time.
//   GROUNDING — every token of it must be in the unit's own lexicon, the same
//     list `check-story-grounding` and `check-game-tasks` hold cards to. The
//     example is the one field a child reads as English, so it obeys the English
//     law; the German Merksatz cannot (it is mixed — „How are you? fragt, wie es
//     geht" — and no tokenizer can split that honestly). That is exactly WHY the
//     example lives in its own English-only field instead of inside the Merksatz.
//
// Attestation runs over the whole MORE! 1 corpus rather than a chapter→unit slice
// (no level file declares its unit), and the matching file is PRINTED — so a
// quote pulled from the wrong unit is visible rather than silently green. The
// lexicon is what keeps the example inside the child's own unit.
const TRANSCRIPTS = "content/build/transcripts/g1";
const LEXICON = "docs/design/g1/grounding/u01-lexicon.json";
const corpus = [];
if (fs.existsSync(TRANSCRIPTS)) {
  for (const sub of ["sb", "wb"]) {
    const dir = path.join(TRANSCRIPTS, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".txt")) corpus.push({ file: path.join(sub, f), text: fs.readFileSync(path.join(dir, f), "utf8") });
    }
  }
}
const lex = fs.existsSync(LEXICON) ? JSON.parse(fs.readFileSync(LEXICON, "utf8")) : { words: [], phrases: [], properNouns: [] };
const lexWords = new Set(lex.words.map((w) => w.toLowerCase()));
const lexProper = new Set(lex.properNouns.map((w) => w.toLowerCase()));
const lexPhrases = lex.phrases.map((p) => p.toLowerCase());
// The tokenizer and the crude lemmatizer are check-story-grounding's, verbatim —
// one grounding law with one implementation, or the two gates drift apart.
const enTokens = (en) => (en.toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
const EN_FREE = new Set(["oh", "ssh", "psst", "brrr", "puh", "miaow", "wow", "hey", "but", "now", "do", "too"]);
const enGrounded = (tok, extra) =>
  lexWords.has(tok) || lexProper.has(tok) || extra.has(tok)
  || (tok.endsWith("ies") && lexWords.has(`${tok.slice(0, -3)}y`))
  || (tok.endsWith("es") && lexWords.has(tok.slice(0, -2)))
  || (tok.endsWith("s") && (lexWords.has(tok.slice(0, -1)) || lexProper.has(tok.slice(0, -1))));

let examplesSeen = 0;
for (const file of paintFiles) {
  if (!file.endsWith(".level.json")) continue;
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [at, text] of strings(json)) {
    if (!/(^|\.)beispielEn$/.test(at)) continue;
    examplesSeen += 1;
    const hit = corpus.find((c) => c.text.includes(text));
    if (!hit) {
      fail(`${file} ${at}`, `example-law: „${text}" steht NICHT wörtlich in den MORE!-1-Transkripten — eine Regel-Seite zitiert das Buch oder sie zitiert nichts`);
    } else {
      console.log(`  ✓ ${at}: „${text}" — belegt in ${hit.file}`);
    }
    const extra = new Set();
    const low = text.toLowerCase();
    for (const p of lexPhrases) if (low.includes(p)) for (const t of enTokens(p)) extra.add(t);
    for (const t of enTokens(text)) {
      if (!EN_FREE.has(t) && !enGrounded(t, extra)) {
        fail(`${file} ${at}`, `grounding: EN token not in the unit lexicon: "${t}" (line: "${text}")`);
      }
    }
  }
}

// ── 2b · THE RETIRED PHRASES ─────────────────────────────────────────────────
// Koki's replay named these one by one. Each was a line the world does not back:
// a camp that doc 44 §1.4 abolished, a letter-being that exists as no entity,
// sprite or animation, a book-being this chapter never introduces, „jemand" over
// a cage holding a sound system. Removing them once is a fix; keeping them out
// is a law — and the two cards that carry two of them (the score page and the
// boss console beat) are the ones a browser run cannot reach cheaply, which is
// exactly why they need a check that does not depend on being played.
const RETIRED = [
  [/Lager am Rand der Seite/i, "the camp was abolished (doc 44 §1.4) — the freed stay where they were freed"],
  [/ins Lager/i, "the camp again — nothing in any level ever went there"],
  [/Buchstaben-Wesen/i, "no letter-being exists as entity, sprite or animation (doc 45, Koki 07:26:41)"],
  [/\bFibel\b/, "a book-being this chapter never introduces (doc 45 C8)"],
  // »…« here, not „…" — an ASCII closer inside this very string is what the
  // quote law above exists to catch, and it terminated this line on first run.
  [/Da steckt jemand fest/i, "»jemand« over a cage that holds a thing (doc 45, Koki 07:26:19)"],
];
for (const file of shellFiles) {
  const lines = codeOnly(fs.readFileSync(file, "utf8"));
  lines.forEach((line, i) => {
    for (const [re, why] of RETIRED) {
      if (re.test(line)) fail(`${file}:${i + 1}`, `retired-phrase: ${re} — ${why}`);
    }
  });
}

// ── 3 · VACUITY — the gate proves it can still see ───────────────────────────
// Every check above runs on the stripper's output, so a stripper that returned
// nothing would report a clean repo forever. These three assertions are what
// stop that: a real player-visible line must survive, a real comment must not,
// and the file must not have been gutted.
const PROBE_FILE = "packages/game-paint/src/PaintGame.tsx";
const probeSrc = fs.readFileSync(PROBE_FILE, "utf8");
const probe = codeOnly(probeSrc).join("\n");
if (!probe.includes("Los geht's!")) {
  fail("VACUITY", `the stripper ate a player-visible line („Los geht's!") out of ${PROBE_FILE} — every check above is blind`);
}
if (probe.includes("THE DESATURATION LAW")) {
  fail("VACUITY", `the stripper kept a COMMENT ("THE DESATURATION LAW") — comments would be reported as player copy`);
}
if (probe.length < probeSrc.length * 0.4) {
  fail("VACUITY", `the stripper kept only ${Math.round((probe.length / probeSrc.length) * 100)}% of ${PROBE_FILE} — that is not a comment strip, that is a hole`);
}
// …and the same proof for the example law (2c). All three of its inputs can go
// missing WITHOUT any assertion firing — an empty corpus finds no quote to
// refute, an empty lexicon grounds nothing, and a renamed field is simply never
// scanned. Each of those failures reads as a green gate, which is the worst
// possible way for a citation check to break.
if (corpus.length < 10) {
  fail("VACUITY", `only ${corpus.length} MORE! 1 transcript files loaded from ${TRANSCRIPTS} — the example law cannot attest anything`);
}
if (lexWords.size < 100) {
  fail("VACUITY", `the unit lexicon holds ${lexWords.size} words — ${LEXICON} did not load, so grounding passes everything`);
}
if (examplesSeen === 0) {
  fail("VACUITY", "no `beispielEn` was scanned in any paint level — either the field was renamed or the walk missed it; the example law is asleep");
}
// The corpus must be able to REFUTE, not only to confirm: a `.includes()` over a
// string that swallowed the whole book would attest any sentence at all.
if (corpus.some((c) => c.text.includes("It's magenta and invisible."))) {
  fail("VACUITY", "the transcript corpus attests a sentence that is not in the book — the attestation test is not discriminating");
}

// ── the verdict ──────────────────────────────────────────────────────────────
const scanned = `${shellFiles.length} shell files · ${paintFiles.length} content files`;
if (failures > 0) {
  console.error(`\n✗ check-paint-copy: ${failures} violation(s) over ${scanned}`);
  process.exit(1);
}
console.log(`OK — check-paint-copy: cloak, register and quote laws hold over ${scanned}`);
