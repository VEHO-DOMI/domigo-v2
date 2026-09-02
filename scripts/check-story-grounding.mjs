// THE GROUNDING CHECKER (doc 29 §6) — story-mode English truth + giveaway law + register law.
// Run: node --experimental-strip-types scripts/check-story-grounding.mjs
//      node --experimental-strip-types scripts/check-story-grounding.mjs --selftest
//      (exit 1 on any violation; CI-runnable. The flag is required since D-123: the
//       register law is imported from packages/content-schema/src/game-tasks.ts.)
//
// A) Every English token in the prologue (ch00), the new ch01 beat scenes (s011+), and every
//    game task (keen/chNN.tasks.json) must be grounded: in the MORE! 1 Unit-1 lexicon
//    (docs/design/g1/grounding/u01-lexicon.json), a scene/task gloss, or a proper noun.
// B) Giveaway law (§4.3): a task's answer token never appears in its own promptEn or storyDe.
// C) Register law v2 (§1.1): banned German on all story-mode German fields.
//
// ── R5-W7 · W6 · D-454: DAS TOR KANN JETZT ZEIGEN, DASS ES NOCH MISST ────────
// Bis heute konnte dieses Tor nur gruen. Das Urteil ist deshalb eine REINE
// FUNKTION ueber die geladenen Daten geworden; der Selbsttest reicht ihr die
// ECHTEN Korpus-Daten mit genau EINER Verfaelschung herein (P-71: Tamper gegen
// den Messwert, nie gegen eine erfundene Konfiguration) und prueft, dass GENAU
// der eingespeiste Fehler gemeldet wird — ein Selbsttest, der irgendein rotes
// Licht sieht, beweist nichts (E5-Lehre). Der letzte Fall ist der wichtigste:
// der ECHTE Stand muss gruen sein.
import fs from "node:fs";
import { BANNED_DE as BANNED_DE_SHARED } from "../packages/content-schema/src/game-tasks.ts";

const BASE = "content/corpus/stories/g1.st.lost-pages";

// ── register bans (German story fields) ──
// R5-W4b · W3 · D-123. This list used to be TYPED OUT here as well as exported from
// content-schema, and a rule with two copies is a rule with one enforced copy — the
// same argument check-game-tasks.mjs:65-69 already makes about its variety tables.
// The shared law is now imported, so a word added there reddens BOTH gates.
//
// R5-W5 · C4 · D-251 CLOSED. W3 measured that the two lists had already drifted: this
// copy carried an eighth pattern, /verhedder/, that the shared list never had, and
// left it here as a named local addition for the copy lane to rule on. The copy lane
// ADOPTED it — the pattern now lives in content-schema's BANNED_DE with its reason, so
// there is one list again and this file holds no rule of its own.
const BANNED_DE = BANNED_DE_SHARED;

/**
 * Das ganze Urteil als reine Funktion der geladenen Daten. Rein, damit der
 * Selbsttest ihr echte Daten mit genau einer Verfaelschung reichen kann.
 *
 * @param {{lex:object, story:object, level:object, boss:object,
 *          keenPacks:{file:string,pack:object}[], paint:{tasks:object,level:object}|{error:string}}} welt
 */
export const analyse = (welt) => {
  const { lex, story, level, boss, keenPacks, paint } = welt;
  const failures = [];
  const fail = (where, msg) => { failures.push(`${where}: ${msg}`); };

  // ── the grounding vocabulary ──
  const words = new Set(lex.words.map((w) => w.toLowerCase()));
  const phrases = lex.phrases.map((p) => p.toLowerCase());
  const proper = new Set(lex.properNouns.map((w) => w.toLowerCase()));
  // crude plural/verb-form lemmatizer: books→book, babies→baby, sits→sit
  const grounded = (tokRaw, extra) => {
    const tok = tokRaw.toLowerCase();
    if (words.has(tok) || proper.has(tok) || extra.has(tok)) return true;
    if (tok.endsWith("ies") && words.has(tok.slice(0, -3) + "y")) return true;
    if (tok.endsWith("es") && words.has(tok.slice(0, -2))) return true;
    if (tok.endsWith("s") && (words.has(tok.slice(0, -1)) || proper.has(tok.slice(0, -1)))) return true;
    return false;
  };
  const tokens = (en) => (en.toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
  // interjections + closed-class function words carry no lexical load — allowed at any level
  const FREE = new Set(["oh", "ssh", "psst", "brrr", "puh", "miaow", "wow", "hey", "but", "now", "do", "too"]);
  const checkEn = (where, en, glosses) => {
    const extra = new Set();
    for (const gl of glosses ?? []) for (const t of tokens(gl.word)) extra.add(t);
    // phrases ground all their member tokens
    const enLow = en.toLowerCase();
    for (const p of phrases) if (enLow.includes(p)) for (const t of tokens(p)) extra.add(t);
    for (const t of tokens(en)) {
      if (!FREE.has(t) && !grounded(t, extra)) fail(where, `EN token not grounded in MORE! 1 Unit 1: "${t}" (line: "${en}")`);
    }
  };
  const checkDe = (where, de) => {
    for (const re of BANNED_DE) if (re.test(de ?? "")) fail(where, `register-law violation: ${re} in "${de}"`);
  };

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
  for (const { file, pack } of keenPacks) {
    const seen = new Set();
    for (const it of pack.items) {
      const where = `${file} ${it.id}`;
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

  // ── D) THE PAINTED BOOK: paint/ch01.tasks.json + paint level German fields ──
  if (paint.error !== undefined) {
    fail("paint", `paint bundle unreadable: ${paint.error}`);
  } else {
    for (const t of paint.tasks.items) {
      checkEn(`paint:${t.id}.promptEn`, t.promptEn, []);
      for (const opt of t.options ?? []) checkEn(`paint:${t.id}.option`, opt, []);
      checkEn(`paint:${t.id}.answer`, t.answer, []);
      checkDe(`paint:${t.id}.storyDe`, t.storyDe);
      // giveaway law, refined for phrase answers: closed-class tokens carry no
      // lexical load, and for CHOICE items a token shared with a distractor
      // cannot discriminate — only a DISTINCTIVE answer token leaking into the
      // prompt spoils the task. Typed answers stay strict.
      const CLOSED = new Set(["the", "a", "an", "is", "are", "it", "you", "your", "my", "to", "in", "on", "at", "and", "what", "i'm", "i"]);
      const distractorToks = new Set((t.options ?? []).filter((o) => o !== t.answer).flatMap((o) => tokens(o)));
      const ansToks = new Set(tokens(t.answer).filter((tk) => !CLOSED.has(tk)));
      for (const tk of tokens(t.promptEn)) {
        if (!ansToks.has(tk)) continue;
        if (t.kind === "choice" && distractorToks.has(tk)) continue; // shared with a distractor: non-spoiling
        fail(`paint:${t.id}`, `giveaway: answer token "${tk}" in promptEn`);
      }
      if (t.kind === "typed") {
        for (const tk of tokens(t.storyDe)) {
          if (ansToks.has(tk) && tk.length > 2) fail(`paint:${t.id}`, `giveaway: answer token "${tk}" in storyDe`);
        }
      }
    }
    checkDe("paint:level.goalDe", paint.level.goalDe);
    checkDe("paint:level.whyDe", paint.level.whyDe);
    for (const h of paint.level.hintsDe) checkDe("paint:level.hintsDe", h);
  }

  return { failures };
};

// ── DIE WELT VON DER PLATTE ──────────────────────────────────────────────────
// L0 · N4 (D-806): DAS LEXIKON FOLGT DEM KAPITEL.
//
// Hier stand ein fester `u01-lexicon.json`-Pfad — dieselbe Klasse wie in
// `check-game-tasks.mjs` und `check-paint-copy.mjs`. Dieses Tor prueft heute
// die Welt von ch01 (keen + paint v1), also ist u01 auch die richtige Antwort;
// falsch war nur, dass die Antwort GESETZT statt HERGELEITET war. Wer das Tor
// eines Tages auf ein anderes Kapitel richtet, bekommt jetzt dessen Wortschatz
// statt still den von Unit 1.
//
// KUMULATIV (die L4-Lehre): ein Kapitel darf jedes Wort seiner Unit und jeder
// frueheren benutzen. Fuer ch01 ist die Summe genau u01, also unveraendert.
const CHAPTER = (() => {
  const i = process.argv.indexOf("--chapter");
  const v = i === -1 ? "ch01" : process.argv[i + 1];
  if (!/^ch\d{2}$/.test(v ?? "")) { console.error(`check-story-grounding: --chapter braucht chNN, bekam "${v}"`); process.exit(2); }
  return v;
})();

/** Die Summe aller Unit-Lexika bis zu der Unit, die dieses Kapitel lehrt. */
const lexikonFuer = (storyJson, chapter) => {
  const dir = "docs/design/g1/grounding";
  const eintrag = (storyJson.chapters ?? []).find((c) => String(c.id).endsWith(`.${chapter}`));
  const bis = typeof eintrag?.unit === "number" ? eintrag.unit : Number(chapter.slice(2));
  const summe = { words: [], phrases: [], properNouns: [] };
  let gefunden = 0;
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
    const m = /^u(\d{2})-lexicon\.json$/.exec(f);
    if (!m || Number(m[1]) > bis) continue;
    const l = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8"));
    summe.words.push(...(l.words ?? []));
    summe.phrases.push(...(l.phrases ?? []));
    summe.properNouns.push(...(l.properNouns ?? []));
    gefunden++;
  }
  if (gefunden === 0) {
    // Anti-Leerlauf: ein Erdungs-Tor ohne Wortschatz laesst ALLES durch und
    // sieht dabei gruen aus. Das ist die eine Lage, in der es lauter sein muss
    // als sein eigener Befund.
    console.error(`check-story-grounding: kein Lexikon fuer ${chapter} (Unit ${bis}) unter ${dir} — die Erdung haette nichts zu pruefen`);
    process.exit(1);
  }
  return summe;
};

const laden = () => {
  const story = JSON.parse(fs.readFileSync(`${BASE}/story.json`, "utf8"));
  const lex = lexikonFuer(story, CHAPTER);
  const level = JSON.parse(fs.readFileSync(`${BASE}/keen/${CHAPTER}.level.json`, "utf8"));
  const boss = JSON.parse(fs.readFileSync(`${BASE}/keen/${CHAPTER}.boss.json`, "utf8"));
  const keenPacks = fs.readdirSync(`${BASE}/keen`).filter((x) => x.endsWith(".tasks.json"))
    .map((file) => ({ file, pack: JSON.parse(fs.readFileSync(`${BASE}/keen/${file}`, "utf8")) }));
  let paint;
  try {
    paint = {
      tasks: JSON.parse(fs.readFileSync(`${BASE}/paint/${CHAPTER}.tasks.json`, "utf8")),
      level: JSON.parse(fs.readFileSync(`${BASE}/paint/${CHAPTER}.level.json`, "utf8")),
    };
  } catch (e) {
    paint = { error: e.message };
  }
  return { lex, story, level, boss, keenPacks, paint };
};

const weltAufDerPlatte = laden();

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const klon = () => JSON.parse(JSON.stringify(weltAufDerPlatte));
  // eine ECHTE Aufgabe aus dem Korpus, keine erfundene: die erste, die eine
  // eindeutige Antwort und einen Prompt traegt.
  const ersteAufgabe = (welt) => {
    for (const p of welt.keenPacks) {
      for (const it of p.pack.items) {
        if (typeof it.promptEn === "string" && typeof it.answer === "string" && it.identityAnswer !== true) return it;
      }
    }
    throw new Error("keine geeignete Aufgabe im Korpus gefunden — der Selbsttest kann nicht bauen");
  };

  const faelle = [
    ["ein englisches Wort steht in keinem Wortschatz (Gesetz A)", () => {
      const w = klon();
      ersteAufgabe(w).promptEn += " zzzqux";
      return analyse(w);
    }, `EN token not grounded in MORE! 1 Unit 1: "zzzqux"`],

    ["ein verbotenes deutsches Wort im storyDe (Gesetz C, Register)", () => {
      const w = klon();
      ersteAufgabe(w).storyDe += " Monster";
      return analyse(w);
    }, `register-law violation: /Monster/`],

    ["die Antwort steht im eigenen Prompt (Gesetz B, Giveaway)", () => {
      const w = klon();
      const it = ersteAufgabe(w);
      const wort = (it.answer.toLowerCase().match(/[a-zäöüß'-]+/gi) ?? [])[0];
      it.promptEn += ` ${wort}`;
      return analyse(w);
    }, `appears in promptEn`],

    ["eine Zeremonie-Szene traegt eine Aufgabe (no-task-in-cutscene)", () => {
      const w = klon();
      const ch00 = w.story.chapters.find((c) => c.id.endsWith(".ch00"));
      ch00.scenes[0].taskSlots = ["g1.game.ch01.erfunden"];
      return analyse(w);
    }, `no-task-in-cutscene law`],

    ["NICHT-TAMPER: der echte Korpus ist gruen", () => analyse(weltAufDerPlatte), null],
  ];

  let schlecht = 0;
  for (const [name, lauf, muss] of faelle) {
    const { failures } = lauf();
    const rot = failures.length > 0;
    const sollRot = muss !== null;
    if (rot !== sollRot) {
      schlecht++;
      console.error(sollRot
        ? `  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`
        : `  ✗ ${name} — der echte Korpus ist rot: ${failures.slice(0, 3).join(" | ")}`);
      continue;
    }
    if (sollRot) {
      // E5-Lehre: GENAU der eingespeiste Fehler, nicht irgendeiner — und NUR er.
      const treffer = failures.filter((f) => f.includes(muss));
      if (treffer.length !== 1 || failures.length !== 1) {
        schlecht++;
        console.error(`  ✗ ${name} — rot, aber nicht sauber an der eingespeisten Stelle `
          + `(${treffer.length} passende von ${failures.length}); erwartet: ${muss}`);
        continue;
      }
      console.log(`  ✓ ${name} — rot, genau eine Meldung, und es ist die eingespeiste`);
    } else {
      console.log(`  ✓ ${name} — gruen`);
    }
  }
  if (schlecht > 0) { console.error("check-story-grounding --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-story-grounding --selftest: OK — ${faelle.length} Faelle, vier rote Lichter `
    + `an der eingespeisten Stelle, der echte Korpus gruen`);
  process.exit(0);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const { failures } = analyse(weltAufDerPlatte);
for (const f of failures) console.error(`✗ ${f}`);
if (failures.length === 0) console.log("check-story-grounding: OK — prologue, beat scenes, headers, boss and game tasks all grounded, giveaway-free, in register");
else { console.error(`check-story-grounding: ${failures.length} failure(s)`); process.exit(1); }
