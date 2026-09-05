// R5-C1 · THE PAINTED BOOK'S COPY GATE
// (run: node --experimental-strip-types scripts/check-paint-copy.mjs; exit 1 on
//  any violation; CI-runnable.
//  node --experimental-strip-types scripts/check-paint-copy.mjs --selftest
//  proves the red light works.)
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
//
// ── R5-W7 · W6 · D-454: DAS TOR KANN JETZT SEIN ROTES LICHT ZEIGEN ──────────
// Die VACUITY-Prüfungen unten sind das Beste, was ein Tor ohne Selbsttest haben
// kann: sie fangen die Klasse »das Messgerät sieht gar nichts mehr«. Was sie
// NICHT können, ist zeigen, dass die drei Gesetze selbst noch feuern.
// Das Urteil ist deshalb eine REINE FUNKTION über die geladenen Quellen
// geworden; der Selbsttest reicht ihr die ECHTEN Dateien mit genau EINER
// Verfälschung herein (P-71: Tamper gegen den Messwert, nie gegen eine
// erfundene Konfiguration) und prüft, dass GENAU der eingespeiste Fehler
// gemeldet wird (E5-Lehre). Der letzte Fall ist der wichtigste: der ECHTE
// Stand muss grün sein.
import fs from "node:fs";
import path from "node:path";
import { cloakErrorsDe, registerErrorsDe } from "../packages/content-schema/src/game-tasks.ts";
import { paintChapters, skipLedger } from "./paint-chapters.mjs";

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

const SHELL_ROOT = "packages/game-paint/src";
const STORIES = "content/corpus/stories";
const TRANSCRIPTS = "content/build/transcripts/g1";
// L0 · N4 (D-900): DAS LEXIKON GEHOERT DEM KAPITEL, NICHT DIESER ZEILE.
//
// Hier stand ein fester u01-Pfad. Fuer ein Buch mit einem Kapitel war das
// richtig; fuer ch02 waere jedes englische Beispielwort gegen den Wortschatz
// von Unit 1 geerdet worden — und das ist schlimmer als gar keine Erdung, weil
// das Tor dabei gruen bleibt und behauptet, es habe geprueft.
//
// Und KUMULATIV, nicht ersetzend (die L4-Lehre): ein Kapitel darf jedes Wort
// benutzen, das seine Unit ODER eine frueher gelehrte Unit bringt. `purple`
// steht in keinem u01-Blatt und ist ab u03 legal — waere das Lexikon ein
// Austausch statt einer Summe, verloere ch03 den ganzen Wortschatz von ch01.
const GROUNDING = "docs/design/g1/grounding";
const PROBE_FILE = "packages/game-paint/src/PaintGame.tsx";

// The German quote law: a „ closed by an ASCII " with no proper “ in between.
const ASCII_CLOSER = /„[^„“]*"/;

// Authoring notes are not player-visible: they are where a designer writes ABOUT
// the chapter, and the ch01 task file's own header note is one. Skipping them is
// deliberate and narrow — anything not on this list is treated as visible.
const NOT_VISIBLE = /(^|\.)(note|grounding|schema|id|chapter|unit)$/;

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

/** Every string in a JSON tree, with the dotted path it sits at. */
const strings = function* (node, at = "") {
  if (typeof node === "string") { yield [at, node]; return; }
  if (Array.isArray(node)) { for (const [i, v] of node.entries()) yield* strings(v, `${at}[${i}]`); return; }
  if (node !== null && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) yield* strings(v, at === "" ? k : `${at}.${k}`);
  }
};

/**
 * Das ganze Urteil als reine Funktion der GELESENEN Quellen. Rein, damit der
 * Selbsttest ihr echte Quellen mit genau einer Verfälschung reichen kann.
 *
 * @param {{shell:{file:string,src:string}[], content:{file:string,json:object}[],
 *          corpus:{file:string,text:string}[], lexika:Record<number,object>,
 *          kapitel:object[], probeSrc:string}} welt
 */
export const analyse = ({ shell, content, corpus, lexika, kapitel = [], probeSrc }) => {
  const failures = [];
  const notes = [];
  const fail = (where, msg) => { failures.push(`${where}: ${msg}`); };
  // L0c · P1: der NAMENTLICHE Skip kommt aus der geteilten Buchfuehrung, damit
  // dieses Tor dasselbe Etikett benutzt wie seine vier Nachbarn — und damit ein
  // FERTIGES Kapitel, dem eine Eingabe fehlt, als Luecke gilt und nicht als
  // Bauphase (`skipLedger` unterscheidet das, dieses Tor konnte es bisher gar
  // nicht: es kannte das Wort `draft` nicht).
  const ledger = skipLedger(kapitel);
  const entwurfVon = new Map(kapitel.map((c) => [c.chapter, c.draft === true]));

  // ── 1 · THE SHELL ──────────────────────────────────────────────────────────
  for (const { file, src } of shell) {
    const lines = codeOnly(src);
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
      for (const [re, why] of RETIRED) {
        if (re.test(line)) fail(where, `retired-phrase: ${re} — ${why}`);
      }
    });
  }

  // ── 2 · THE CONTENT ────────────────────────────────────────────────────────
  // A second belt over the same law the engine's `chapter-copy` enforces, so the
  // gate still fails if that law is ever deleted. Walks every German string in the
  // paint content, whatever key it hides under.
  for (const { file, json } of content) {
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

  // ── 2c · THE REGEL-SEITEN EXAMPLE LAW (R5-W4 · I2, Koki's ruling K-1) ──────
  // Koki read the three rule pages and called them „ein Alibi". I1's answer was an
  // ATTESTATION gate: every example had to appear verbatim in the MORE! 1
  // transcripts. On 2026-08-15 Koki retired it — „nicht die exakt selben sätze aus
  // dem buch (wir schreiben immer unsere eigenen beispiele – die natürlich aber
  // zum kontext und level passen)".
  //
  // That is not a loosening, and it is worth writing down why. Every OTHER piece
  // of English in this game — task prompts, scene lines, the boss console — has
  // always been ours, held to the unit lexicon by check-story-grounding.mjs §A.
  // The rule pages were the single exception. K-1 ends the exception.
  //
  // WHAT NOW HOLDS AN EXAMPLE HONEST, in three places rather than one:
  //   GROUNDING (here) — every token in the unit's own lexicon, the same list
  //     check-story-grounding and check-game-tasks hold every card to. This is the
  //     hard gate, and it is what keeps our own sentence inside the child's own
  //     week: „It isn't dark here." is legal, „It isn't correct." is not.
  //   COVERAGE + RELEVANCE (level.ts `lehrtEn`) — every form the page claims to
  //     teach appears in some example, and every example shows some claimed form.
  //     The attestation gate could never check either.
  //   THE READING (blind didactic critics, per page, in the session that authors
  //     them) — is the English natural and correct? That is the intelligence pass
  //     the house law demands of anything a child reads, and it is the half a
  //     grep was standing in for.
  //
  // The corpus grep survives as a PRINTED NOTE, not a verdict: if a sentence we
  // wrote happens to be word-for-word the book's, that is worth SEEING (it usually
  // means an author reached for the nearest line instead of writing one), but it
  // is no longer a failure — the question form „What's your email address?" cannot
  // be paraphrased without ceasing to be the rule.
  // L0 · N4: die KUMULATIVE Summe bis zur Unit eines Kapitels, einmal je Unit
  // gebaut und gemerkt. Ohne Kapitel-Angabe (oder wenn ein Kapitel seine Unit
  // nicht nennt) ist es die Summe ALLER vorhandenen Lexika — der weiteste
  // Zustand, in dem das Tor noch etwas sagt, statt stumm alles durchzulassen.
  const lexCache = new Map();
  const lexBis = (bisUnit) => {
    const key = bisUnit ?? "alle";
    const hit = lexCache.get(key);
    if (hit) return hit;
    const words = new Set(); const proper = new Set(); const phrases = [];
    for (const [n, l] of Object.entries(lexika ?? {})) {
      if (bisUnit !== undefined && Number(n) > bisUnit) continue;
      for (const w of l.words ?? []) words.add(String(w).toLowerCase());
      for (const w of l.properNouns ?? []) proper.add(String(w).toLowerCase());
      for (const p of l.phrases ?? []) phrases.push(String(p).toLowerCase());
    }
    const out = { words, proper, phrases };
    lexCache.set(key, out);
    return out;
  };
  // die Menge, die die Leerlauf-Probe unten misst: der Bestand insgesamt
  const alle = lexBis(undefined);
  const lexWords = alle.words;
  const lexProper = alle.proper;
  // The tokenizer and the crude lemmatizer are check-story-grounding's, verbatim —
  // one grounding law with one implementation, or the two gates drift apart.
  const enTokens = (en) => (en.toLowerCase().match(/[a-zäöüß'-]+/gi) ?? []).filter((t) => t.length > 0);
  const EN_FREE = new Set(["oh", "ssh", "psst", "brrr", "puh", "miaow", "wow", "hey", "but", "now", "do", "too"]);
  const enGrounded = (tok, extra, L) =>
    L.words.has(tok) || L.proper.has(tok) || extra.has(tok)
    || (tok.endsWith("ies") && L.words.has(`${tok.slice(0, -3)}y`))
    || (tok.endsWith("es") && L.words.has(tok.slice(0, -2)))
    || (tok.endsWith("s") && (L.words.has(tok.slice(0, -1)) || L.proper.has(tok.slice(0, -1))));

  let examplesSeen = 0;
  let erklaerungenSeen = 0;
  let lehrtSeen = 0;
  let liftedSeen = 0;
  // ── 2c-a · L0c · DIE UNIT EINER INHALTSDATEI IST BESTIMMBAR ODER ROT (R266b) ─
  // Hier stand ein Rueckfall: war die Unit nicht bestimmbar, galt die Summe
  // ALLER Lexika. Gemessen war das am 03.09. eine Erdung gegen 334 Woerter und
  // nach dem Merge-Zug gegen 913 — also ein Tor, das mit jedem neuen Kapitel
  // NACHSICHTIGER wird. Ein Rueckfall, der ein Tor lascher macht, ist ein
  // Defekt: die Datei sagt jetzt, welche Unit sie meint, oder das Tor sagt,
  // welche Datei es nicht einordnen konnte.
  const uDatei = (n) => `u${String(n).padStart(2, "0")}-lexicon.json`;
  const unitVon = (file, json) => {
    const chNum = /(?:^|\/)ch(\d{2})\.(?:level|tasks\.v2)\.json$/.exec(file)?.[1];
    if (chNum !== undefined) return Number(chNum);
    const ausFeld = typeof json.unit === "string" ? Number(/u(\d{2})$/.exec(json.unit)?.[1]) : Number.NaN;
    return Number.isFinite(ausFeld) ? ausFeld : null;
  };
  for (const { file, json } of content) {
    if (unitVon(file, json) === null) {
      fail(file, "unit: keine bestimmbare Unit — weder ein `unit`-Feld der Form g<n>-uNN noch die "
        + `Namensform chNN.level.json / chNN.tasks.v2.json. Ohne Unit fiele die Erdung auf die Summe `
        + `ALLER Lexika zurueck (${alle.words.size} Woerter statt der Summe bis zur eigenen Unit) — `
        + "ein Rueckfall, der dieses Tor LASCHER macht, ist ein Defekt (R266b)");
    }
  }

  for (const { file, json } of content) {
    if (!file.endsWith(".level.json")) continue;
    // L0 · N4: die Unit dieses Kapitels — aus der Kapitel-Nummer, die im Korpus
    // eins zu eins auf die Unit zeigt, sonst aus dem `unit`-Feld der Datei.
    // L0c: faellt beides aus, ist das oben gemeldet und hier nichts mehr zu tun.
    const chapter = /(?:^|\/)(ch\d{2})\.level\.json$/.exec(file)?.[1];
    const unitNum = unitVon(file, json);
    if (unitNum === null) continue;
    const uPfad = `${GROUNDING}/${uDatei(unitNum)}`;

    // L0c · P1 (D-875) · DIE ENTWURFS-SEMANTIK, die diesem Tor als einzigem
    // Inhalts-Tor noch fehlte. Ein Kapitel im Bau hat seine Regel-Seiten oft vor
    // dem Unit-Lexikon — die G-Bahn schreibt die Seiten, die T-Bahn das Lexikon.
    // Fehlt es im ENTWURF, wird das NAMENTLICH gemeldet und die Erdung dieses
    // Kapitels ausgelassen; fehlt es einem FERTIGEN Kapitel, ist es ein Loch.
    if (lexika?.[unitNum] === undefined) {
      if (chapter !== undefined && entwurfVon.get(chapter) === true) {
        ledger.skip(chapter, "paint-copy/erdung", `kein ${uPfad} — die T-Bahn dieses Kapitels liefert es`);
      } else {
        fail(file, `grounding: ${chapter ?? "dieses Kapitel"} lehrt Unit ${unitNum}, aber ${uPfad} liegt nicht `
          + "auf der Platte — ohne Lexikon prueft die Erdung nichts und bliebe trotzdem gruen");
      }
      continue;
    }

    // L0c · P16 (R266a) · DIE REIHE DARF KEINE LOECHER HABEN. Der Ordner-Scan
    // nimmt, was da ist; am 03.09. fehlte u04 zwischen u03 und u05 (es steckte in
    // einem PR), und kein Tor sagte es — die kumulative Summe war damit still um
    // eine ganze Unit zu klein, und jedes Beispiel, das ihre Woerter benutzt,
    // waere aus dem falschen Grund rot geworden.
    const loecher = [];
    for (let n = 1; n < unitNum; n += 1) if (lexika[n] === undefined) loecher.push(uDatei(n));
    if (loecher.length > 0) {
      fail(file, `grounding: die Lexikon-Reihe hat Loecher — ${chapter ?? "dieses Kapitel"} lehrt Unit `
        + `${unitNum} und erdet kumulativ gegen u01…${uDatei(unitNum).slice(0, 3)}, aber unter ${GROUNDING} `
        + `fehlt: ${loecher.join(", ")}. Die Summe waere still zu klein`);
      continue;
    }

    const L = lexBis(unitNum);
    const lexPhrases = L.phrases;
    for (const [at, text] of strings(json)) {
      if (/(^|\.)erklaerungDe$/.test(at)) erklaerungenSeen += 1;
      if (/(^|\.)lehrtEn\[\d+\]$/.test(at)) lehrtSeen += 1;
      // the array walker yields `…params.beispieleEn[0]`, so the index rides in
      // the path — matched explicitly rather than by a loose suffix, because a
      // regex that also matched the bare field name would silently scan nothing
      // if the field ever became a string again.
      if (!/(^|\.)beispieleEn\[\d+\]$/.test(at)) continue;
      examplesSeen += 1;
      const extra = new Set();
      const low = text.toLowerCase();
      for (const p of lexPhrases) if (low.includes(p)) for (const t of enTokens(p)) extra.add(t);
      let clean = true;
      for (const t of enTokens(text)) {
        if (!EN_FREE.has(t) && !enGrounded(t, extra, L)) {
          clean = false;
          fail(`${file} ${at}`, `grounding: EN token not in ${chapter ?? "this chapter"}'s cumulative unit `
            + `lexicon (u01…${uDatei(unitNum).slice(0, 3)}, ${uPfad}): "${t}" (line: "${text}")`);
        }
      }
      // …and the note, not a verdict (K-1). A sentence of ours that is also the
      // book's word for word is legal but worth seeing.
      const hit = corpus.find((c) => c.text.includes(text));
      if (hit) {
        liftedSeen += 1;
        notes.push(`  ℹ ${at}: „${text}" — steht 1:1 in ${hit.file}; erlaubt, aber prüfe, ob ein eigener Satz besser passt`);
      } else if (clean) {
        notes.push(`  ✓ ${at}: „${text}" — eigener Satz, jedes Wort im Wortschatz der Unit`);
      }
    }
  }

  // R5-W4 · I2 · J1-D's anchor law and trap law stood here. Both are gone with the
  // fields they policed (`ausspracheDe`/`ankerEn`, `falscheFormEn`/`richtigeFormEn`)
  // — see level.ts EntityParams for Koki's two reasons. Nothing replaced them:
  // they guarded lines the card no longer shows, and `tip-honesty`'s typo gate is
  // what stops the fields creeping back.

  // ── 3 · VACUITY — the gate proves it can still see ─────────────────────────
  // Every check above runs on the stripper's output, so a stripper that returned
  // nothing would report a clean repo forever. These three assertions are what
  // stop that: a real player-visible line must survive, a real comment must not,
  // and the file must not have been gutted.
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
    fail("VACUITY", `the unit lexicons hold ${lexWords.size} words in total — nothing under ${GROUNDING} loaded, so grounding passes everything`);
  }
  if (examplesSeen === 0) {
    fail("VACUITY", "no `beispieleEn[n]` was scanned in any paint level — either the field was renamed or the walk missed it; the grounding law is asleep");
  }
  // R5-W4 · I2: the same guard for the two fields that arrived with K-1. A law
  // that scans nothing reports OK, and an OK that means »I looked at zero things«
  // is the worst kind.
  if (erklaerungenSeen === 0) {
    fail("VACUITY", "no `erklaerungDe` was scanned — the Notion vanished from every rule page");
  }
  if (lehrtSeen === 0) {
    fail("VACUITY", "no `lehrtEn[n]` was scanned — nothing declares what a page teaches, so tip-honesty's coverage law has nothing to check against");
  }
  // The corpus must still be able to REFUTE. It no longer decides pass/fail, but
  // the 1:1 NOTE above is only worth reading if a `.includes()` over it cannot
  // match anything at all — a corpus that swallowed the whole book would flag
  // every sentence we write as lifted, and the note would be noise.
  if (corpus.some((c) => c.text.includes("It's magenta and invisible."))) {
    fail("VACUITY", "the transcript corpus attests a sentence that is not in the book — the 1:1 note is not discriminating");
  }
  if (liftedSeen > 0) {
    notes.push(`  … ${liftedSeen} von ${examplesSeen} Beispielen stehen 1:1 im Buch (erlaubt seit K-1, aber sichtbar)`);
  }

  // L0c · P1 · DIE BUCHFUEHRUNG STEHT VOR DEM URTEIL. L0 hat diese Klasse einmal
  // bezahlt: der Bericht ueber ausgelassene Gesetze stand HINTER `process.exit(1)`
  // und war im roten Lauf nie zu sehen — also genau dann nicht, wenn jemand
  // wissen muss, welches Gesetz mangels Eingaben gar nicht lief. `notes` wird vom
  // echten Lauf vor den Fehlern gedruckt, also gehoert er hierher.
  for (const r of ledger.rows()) notes.push(`  · ${r}`);
  // …und ein Etikett ohne Exit-Code ist eine Notiz, kein Tor (L0b · D-792): was
  // `skipLedger` als Luecke eines FERTIGEN Kapitels fuehrt, wird rot.
  for (const g of ledger.gaps()) fail("LUECKE", `${g} — dieses Kapitel traegt kein \`draft\`, das ist ein Loch, keine Bauphase`);

  return { failures, notes, scanned: `${shell.length} shell files · ${content.length} content files` };
};

// ── DIE WELT VON DER PLATTE ──────────────────────────────────────────────────
const laden = () => {
  const shell = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) {
        shell.push({ file: full, src: fs.readFileSync(full, "utf8") });
      }
    }
  };
  walk(SHELL_ROOT);

  const content = [];
  if (fs.existsSync(STORIES)) {
    for (const story of fs.readdirSync(STORIES)) {
      const dir = path.join(STORIES, story, "paint");
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".level.json") || f.endsWith(".tasks.v2.json")) {
          const file = path.join(dir, f);
          content.push({ file, json: JSON.parse(fs.readFileSync(file, "utf8")) });
        }
      }
    }
  }

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

  // Alle Unit-Lexika, die auf der Platte liegen — die Summe je Kapitel baut
  // `analyse` daraus (sie kennt die Kapitel der Inhalts-Dateien).
  const lexika = {};
  if (fs.existsSync(GROUNDING)) {
    for (const f of fs.readdirSync(GROUNDING)) {
      const m = /^u(\d{2})-lexicon\.json$/.exec(f);
      if (m) lexika[Number(m[1])] = JSON.parse(fs.readFileSync(path.join(GROUNDING, f), "utf8"));
    }
  }
  // L0c: die geteilte Kapitel-Aufloesung — dieselbe, die check-colour-truth,
  // check-copy-register, check-game-tasks und check-level-design fragen. Dieses
  // Tor war das letzte Inhalts-Tor, das sie nicht kannte, und deshalb das
  // letzte, das das Wort `draft` nicht buchstabieren konnte.
  return { shell, content, corpus, lexika, kapitel: paintChapters(), probeSrc: fs.readFileSync(PROBE_FILE, "utf8") };
};

const weltAufDerPlatte = laden();

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  // Jede Verfälschung sitzt auf einer KOPIE der echten Quellen. Eine .tsx-Datei
  // aus der Schale und ein Inhalts-Blatt werden namentlich gesucht, nicht
  // geraten — sonst prüft der Selbsttest eines Tages eine Datei, die es nicht
  // mehr gibt, und meldet »blind«, wo nur der Fixture-Pfad verrottet ist.
  const kopie = (w) => ({
    ...w,
    shell: w.shell.map((s) => ({ ...s })),
    content: w.content.map((c) => ({ file: c.file, json: JSON.parse(JSON.stringify(c.json)) })),
  });
  const eineTsx = (w) => w.shell.find((s) => s.file.endsWith(".tsx"));
  const einLevel = (w) => w.content.find((c) => c.file.endsWith(".level.json"));

  const einSichtbaresFeld = (json) => {
    // der erste Pfad, den das Gesetz WIRKLICH liest (nicht NOT_VISIBLE)
    for (const [at, text] of strings(json)) {
      if (!NOT_VISIBLE.test(at) && typeof text === "string" && text.length > 3) return at;
    }
    throw new Error("kein sichtbares Feld im Level gefunden");
  };
  const setzeAn = (json, dottedPath, wert) => {
    const teile = dottedPath.replace(/\[(\d+)\]/g, ".$1").split(".");
    let n = json;
    for (const t of teile.slice(0, -1)) n = n[t];
    n[teile[teile.length - 1]] = wert;
  };
  const leseAn = (json, dottedPath) => {
    const teile = dottedPath.replace(/\[(\d+)\]/g, ".$1").split(".");
    let n = json;
    for (const t of teile) n = n[t];
    return n;
  };

  const faelle = [
    ["der Umhang faellt: der Name steht in der Schale (Gesetz 1)", () => {
      const w = kopie(weltAufDerPlatte);
      eineTsx(w).src += '\nconst x = "OSWIN war hier";\n';
      return analyse(w);
    }, "cloak-law"],

    ["ein deutsches Anfuehrungszeichen wird mit ASCII geschlossen (Gesetz 3)", () => {
      const w = kopie(weltAufDerPlatte);
      eineTsx(w).src += '\nconst y = `Sie sagte „hallo" leise`;\n';
      return analyse(w);
    }, "quote-law"],

    ["ein verbotenes Wort im Inhalt (Gesetz 2, Register)", () => {
      const w = kopie(weltAufDerPlatte);
      const c = einLevel(w);
      const at = einSichtbaresFeld(c.json);
      setzeAn(c.json, at, `${leseAn(c.json, at)} Monster`);
      return analyse(w);
    }, "register-law"],

    ["eine zurueckgezogene Wendung kommt zurueck (2b)", () => {
      const w = kopie(weltAufDerPlatte);
      eineTsx(w).src += '\nconst z = "Sie gehen ins Lager zurueck";\n';
      return analyse(w);
    }, "retired-phrase"],

    ["ein Beispiel benutzt ein Wort ausserhalb der Unit (2c, Grounding)", () => {
      const w = kopie(weltAufDerPlatte);
      const c = einLevel(w);
      let gesetzt = false;
      for (const [at, text] of strings(c.json)) {
        if (/(^|\.)beispieleEn\[\d+\]$/.test(at)) { setzeAn(c.json, at, `${text} zzzqux`); gesetzt = true; break; }
      }
      if (!gesetzt) throw new Error("kein beispieleEn im Level — der Fall kann nicht gebaut werden");
      return analyse(w);
    }, "grounding: EN token not in"],

    ["der Kommentar-Streifer frisst die Kopie (VACUITY)", () => {
      const w = kopie(weltAufDerPlatte);
      // genau die Klasse, gegen die VACUITY gebaut ist: die spielersichtbare
      // Zeile ist weg, der Rest steht
      w.probeSrc = w.probeSrc.replace(/Los geht's!/g, "LOS-GEHTS-WEG");
      return analyse(w);
    }, "VACUITY"],

    // L0c · P17 (R266b): eine Datei, die ihre Unit nicht nennt, faellt nicht mehr
    // auf die Summe aller Lexika zurueck, sondern wird namentlich rot.
    ["eine Inhaltsdatei ohne bestimmbare Unit (2c-a, R266b)", () => {
      const w = kopie(weltAufDerPlatte);
      w.content.push({
        file: `${STORIES}/g1.st.lost-pages/paint/fremd.tasks.v2.json`,
        json: { schema: "gameTasks@2", items: [] },
      });
      return analyse(w);
    }, "unit: keine bestimmbare Unit"],

    // L0c · P1 (D-875), die ROTE Haelfte: einem FERTIGEN Kapitel fehlt sein
    // Unit-Lexikon. Die gruene Haelfte (Entwurf ⇒ namentlicher Skip) steht als
    // eigene Probe unter der Fallliste — sie prueft eine NOTIZ, keinen Fehler.
    ["ein fertiges Kapitel ohne sein Unit-Lexikon (P1, D-875)", () => {
      const w = kopie(weltAufDerPlatte);
      w.content.push({
        file: `${STORIES}/g1.st.lost-pages/paint/ch09.level.json`,
        json: { schema: "paintLevel@2", chapter: "ch09" },
      });
      return analyse(w);
    }, "liegt nicht"],

    ["NICHT-TAMPER: der echte Stand ist gruen", () => analyse(weltAufDerPlatte), null],
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
        : `  ✗ ${name} — der echte Stand ist rot: ${failures.slice(0, 3).join(" | ")}`);
      continue;
    }
    if (sollRot) {
      // E5-Lehre: GENAU der eingespeiste Fehler, und NUR er.
      const treffer = failures.filter((f) => f.includes(muss));
      if (treffer.length !== 1 || failures.length !== 1) {
        schlecht++;
        console.error(`  ✗ ${name} — rot, aber nicht sauber an der eingespeisten Stelle `
          + `(${treffer.length} passende von ${failures.length}); erwartet: ${muss}`
          + `\n      ${failures.slice(0, 3).join("\n      ")}`);
        continue;
      }
      console.log(`  ✓ ${name} — rot, genau eine Meldung, und es ist die eingespeiste`);
    } else {
      console.log(`  ✓ ${name} — gruen`);
    }
  }
  // ── L0c · P1, die GRUENE Haelfte ────────────────────────────────────────────
  // Ein Entwurfs-Kapitel ohne Unit-Lexikon darf nicht rot werden — aber es darf
  // auch nicht SCHWEIGEN. Genau das ist der Unterschied, den dieses Tor bisher
  // nicht kannte, und ein Fall, der nur »gruen« prueft, wuerde ihn nicht sehen:
  // ein stiller Skip ist von einem defekten Tor nicht zu unterscheiden.
  {
    const w = kopie(weltAufDerPlatte);
    w.kapitel = [...w.kapitel, { chapter: "ch09", draft: true }];
    w.content.push({
      file: `${STORIES}/g1.st.lost-pages/paint/ch09.level.json`,
      json: { schema: "paintLevel@2", chapter: "ch09" },
    });
    const { failures, notes } = analyse(w);
    const genannt = notes.some((n) => n.includes("ch09") && n.includes("draft"));
    if (failures.length !== 0 || !genannt) {
      schlecht++;
      console.error("  ✗ ein ENTWURFS-Kapitel ohne Unit-Lexikon — erwartet: gruen UND namentlich gemeldet; "
        + `gemessen: ${failures.length} Fehler, Skip-Zeile ${genannt ? "da" : "FEHLT"}`);
    } else {
      console.log("  ✓ ein ENTWURFS-Kapitel ohne Unit-Lexikon — gruen, aber namentlich gemeldet (nie still)");
    }
  }

  if (schlecht > 0) { console.error("check-paint-copy --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-paint-copy --selftest: OK — ${faelle.length} Faelle + die Entwurfs-Probe: `
    + `${faelle.length - 1} rote Lichter an der eingespeisten Stelle, ein namentlicher Skip, der echte Stand gruen`);
  process.exit(0);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const { failures, notes, scanned } = analyse(weltAufDerPlatte);
for (const n of notes) console.log(n);
for (const f of failures) console.error(`✗ ${f}`);
if (failures.length > 0) {
  console.error(`\n✗ check-paint-copy: ${failures.length} violation(s) over ${scanned}`);
  process.exit(1);
}
console.log(`OK — check-paint-copy: cloak, register and quote laws hold over ${scanned}`);
