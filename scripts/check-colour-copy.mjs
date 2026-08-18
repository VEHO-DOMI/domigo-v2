#!/usr/bin/env node
// R5-W5 · C4 · THE COLOUR-COPY GATE — the German on the card says the same
// colour as the card's own answer.
//
// Run: node scripts/check-colour-copy.mjs            (exit 1 on any violation)
//      node scripts/check-colour-copy.mjs --selftest (proves the red light works)
//
// WHY THIS EXISTS, and it is a found defect, not a hypothetical. `check-colour-
// truth` (C2, R41) closed the gap between the card's answer and the PNG: it
// opens the sheet, measures it, and holds `colour` to the measurement. Nothing
// held the GERMAN LINES to that same answer. C3 repainted the eraser blue → pink
// and flipped `colour`, `colourAskDe` and the options in one change — and left
// the hint behind:
//
//     colour: "pink" · colourAskDe: „Der Radiergummi war rosa."
//     hints.deWord: „Auf Deutsch: der Radiergummi — und Blau."     ← shipped
//
// So the one child who opens the hint — the child who is stuck, i.e. the child
// who most needs it — was told the wrong word by the help itself, while every
// gate in the repo stayed green. This gate closes that class: whatever German a
// restore card writes about colour must agree with the answer the same card
// keys. The measurement half stays where it belongs; this is the copy half.
//
// TWO LAWS, and the second is the one that catches the real defect:
//   A · the ASK names the answer. `colourAskDe` must contain the German word for
//       the keyed colour — otherwise the question is about a different colour
//       than the chips are.
//   B · no OTHER colour word anywhere in the card's German help. A hint may name
//       no colour at all (the glue stick's says „der Uhu-Stick", which is the
//       better hint) — but if it names one, it is the answer's.
//
// WHAT IT DELIBERATELY DOES NOT READ: `stimulus.showsDe`. That line describes
// the DRAINED world („Das Buch lehnt grau an der Wand."), where grey is the law
// of the chapter rather than a claim about the object — a gate that read it
// would redden on every card in the book for being right.
import fs from "node:fs";
import path from "node:path";

const STORIES = "content/corpus/stories";
const selftest = process.argv.includes("--selftest");

let failures = 0;
const fail = (where, msg) => { failures += 1; console.error(`✗ ${where}: ${msg}`); };

/** The book's ten colour words in German, with the inflections a card line can
 *  carry. Written as one table so the gate and any future card copy read the
 *  same list — the D-123/D-251 lesson: a second spelling is a second law. */
export const DE_COLOUR = {
  red: ["rot", "rote", "roter", "rotes", "roten", "rotem"],
  orange: ["orange", "orangen", "oranges", "orangem", "orangefarben", "orangefarbene"],
  yellow: ["gelb", "gelbe", "gelber", "gelbes", "gelben", "gelbem"],
  brown: ["braun", "braune", "brauner", "braunes", "braunen", "braunem"],
  green: ["grün", "grüne", "grüner", "grünes", "grünen", "grünem"],
  blue: ["blau", "blaue", "blauer", "blaues", "blauen", "blauem"],
  pink: ["rosa", "rosafarben", "rosafarbene", "pink", "pinke", "pinker", "pinkes"],
  white: ["weiß", "weiße", "weißer", "weißes", "weißen", "weißem"],
  black: ["schwarz", "schwarze", "schwarzer", "schwarzes", "schwarzen", "schwarzem"],
  grey: ["grau", "graue", "grauer", "graues", "grauen", "grauem"],
};

/** Which colour words a German line names. Word boundaries matter both ways:
 *  „Blaubeere" is not blue and „rote" is red — so the longest inflection wins
 *  and a match must stand alone as a word. */
export function coloursIn(line) {
  const found = new Set();
  if (typeof line !== "string") return found;
  const words = (line.toLowerCase().match(/[a-zäöüß]+/g) ?? []);
  for (const [colour, forms] of Object.entries(DE_COLOUR)) {
    if (words.some((w) => forms.includes(w))) found.add(colour);
  }
  return found;
}

if (selftest) {
  const cases = [];
  const say = (name, got, ok) => cases.push([name, got, ok]);

  // 1 · the shipped defect: a pink answer whose hint says „Blau"
  say("a hint that names another colour than the answer is caught",
    coloursIn("Auf Deutsch: der Radiergummi — und Blau."),
    (f) => f.has("blue") && !f.has("pink"));
  // 2 · NON-TAMPER · the same hint, repaired, must be clean
  say("NON-TAMPER · the repaired hint names the answer and nothing else",
    coloursIn("Auf Deutsch: der Radiergummi — und Rosa."),
    (f) => f.size === 1 && f.has("pink"));
  // 3 · a hint may name NO colour — the glue stick's shape
  say("NON-TAMPER · a hint with no colour word at all is allowed",
    coloursIn("Auf Deutsch: der Klebestift — der Uhu-Stick."), (f) => f.size === 0);
  // 4 · the ask must be readable as naming its colour
  say("NON-TAMPER · the ask line names its colour", coloursIn("Die Schultasche war braun."),
    (f) => f.has("brown"));
  // 5 · inflections are the point: „braune" is brown, and only brown
  say("NON-TAMPER · an inflected form still counts", coloursIn("die braune Tasche"),
    (f) => f.size === 1 && f.has("brown"));
  // 6 · …and the boundary must hold in the direction that fails OPEN: a word
  //     that merely CONTAINS a colour is not that colour. Without this the gate
  //     would call „Blaubeere" blue and start reddening on true lines.
  say("NON-TAMPER · a word that only contains a colour is not that colour",
    coloursIn("Die Blaubeere und der Rotkohl."), (f) => f.size === 0);
  // 7 · …and the same boundary must not swallow the real word beside it
  say("a real colour word beside a compound is still found",
    coloursIn("Die Blaubeere ist blau."), (f) => f.size === 1 && f.has("blue"));
  // 8 · two different colour words in one line is exactly law B's target
  say("two colours in one line are both seen", coloursIn("erst blau, jetzt rosa"),
    (f) => f.size === 2 && f.has("blue") && f.has("pink"));

  let bad = 0;
  for (const [name, got, ok] of cases) {
    const pass = ok(got);
    if (!pass) bad += 1;
    console.log(`  ${pass ? "✓" : "✗"} ${name}${pass ? "" : ` → ${JSON.stringify([...got])}`}`);
  }
  if (bad > 0) {
    console.error(`check-colour-copy --selftest: ${bad} case(s) did NOT bite — this gate cannot be trusted`);
    process.exit(1);
  }
  console.log(`check-colour-copy --selftest: OK — ${cases.length} cases, every red light seen and every green case still green`);
  process.exit(0);
}

const files = [];
if (fs.existsSync(STORIES)) {
  for (const story of fs.readdirSync(STORIES)) {
    const dir = path.join(STORIES, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tasks.v2.json"))) files.push(path.join(dir, f));
  }
}

let checked = 0;
let linesRead = 0;
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const chapter = json.chapter;
  for (const t of json.items ?? []) {
    if (t.kind !== "restore") continue;
    const where = `${file} ${t.id.replace(`g1.paint.${chapter}.`, "")}`;
    const answer = t.colour;
    if (typeof answer !== "string" || DE_COLOUR[answer] === undefined) {
      fail(where, `the card keys »${answer}«, which is not one of this book's ten colour words — nothing to hold the German to`);
      continue;
    }
    checked += 1;

    // LAW A · the ask names the answer.
    const ask = t.colourAskDe;
    linesRead += 1;
    const inAsk = coloursIn(ask);
    if (!inAsk.has(answer)) {
      fail(where, `the ask »${ask}« does not name the keyed colour »${answer}« (${DE_COLOUR[answer][0]}) — the German question and the chips are about different colours`);
    }

    // LAW B · no other colour word in the ask or in the help.
    const lines = [["colourAskDe", ask], ["hints.deDesc", t.hints?.deDesc], ["hints.deWord", t.hints?.deWord]];
    for (const [field, line] of lines) {
      if (typeof line !== "string") continue;
      if (field !== "colourAskDe") linesRead += 1;
      for (const other of coloursIn(line)) {
        if (other === answer) continue;
        fail(where, `${field} names »${other}« while the card's answer is »${answer}«: „${line}" — the child who opens the help is the child who is stuck, and this line tells them the wrong word`);
      }
    }
  }
}

// ── VACUITY — a copy gate that reads nothing reports a clean repo forever ─────
if (checked === 0) fail("VACUITY", "no restore card was read — either the walk missed the task files or the kind was renamed; both laws above are asleep");
if (linesRead < checked) fail("VACUITY", `${checked} cards but only ${linesRead} German lines read — a card whose lines are all missing passes both laws by having nothing to say`);
// …and the reader itself must still be able to tell two colour words apart.
if (coloursIn("blau").has("pink") || !coloursIn("rosa").has("pink")) {
  fail("VACUITY", "the colour-word reader no longer distinguishes blue from pink — every verdict above is noise");
}

if (failures > 0) {
  console.error(`\ncheck-colour-copy: ${failures} violation(s) over ${checked} restore card(s)`);
  process.exit(1);
}
console.log(`check-colour-copy: OK — ${checked} restore card(s), ${linesRead} German line(s); every colour word the card writes is the colour the card keys`);
