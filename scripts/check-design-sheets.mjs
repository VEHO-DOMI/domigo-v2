// Production-sheet truth checker (doc 28 §9): every corpus id referenced in
// docs/design/g1/*.md must exist — scene anchors, task item ids, structure ids,
// vocab words. Run: node scripts/check-design-sheets.mjs   (exit 1 on drift)
import fs from "node:fs";
import path from "node:path";

const R = path.resolve(process.cwd());
const story = JSON.parse(fs.readFileSync(`${R}/content/corpus/stories/g1.st.lost-pages/story.json`));
const sheetsDir = `${R}/docs/design/g1`;

const sceneIds = new Set();
for (const ch of story.chapters) for (const s of ch.scenes) sceneIds.add(s.id); // full ids
const chapters = new Map(story.chapters.map((c) => [c.id.split(".").pop(), c]));

let failures = 0;
const fail = (file, msg) => { failures += 1; console.error(`✗ ${file}: ${msg}`); };

// ── R5-W5 · W4 · D-278 · DAS REGISTER-GESETZ, EINMAL UND MIT WORTGRENZE ─────
//
// Die Liste der verbotenen Wörter stand ZWEIMAL im selben Skript — dieselbe
// Klasse, die diese Runde in `key-fringe.mjs` aufgeräumt hat: zwei Kopien einer
// Regel driften, sobald jemand nur eine anfasst.
//
// Und `"schrei"` wurde als nackte Teilkette gesucht. Es trifft damit
// „schreibt", „beschreibt", „Beschreibung" — Wörter, die in einem Design-Blatt
// ständig vorkommen und mit einem Schrei nichts zu tun haben. Heute löst es
// noch kein Blatt aus (nachgesehen: kein Treffer im Bestand), also ist es eine
// FALLE, die erst zuschnappt, wenn jemand einen ganz normalen Satz schreibt.
// Ein Tor, das für die richtige Klasse rot wird, aber aus dem falschen Grund,
// verliert genau dann sein Ansehen, wenn man es braucht.
//
// Die Stämme bleiben Stämme („böse" soll auch „böser" treffen); nur `schrei`
// bekommt die Grenze, die es braucht, und `tot` eine echte statt der von Hand
// angehängten Leerstelle.
const REGISTER_BANNED = [
  { wort: "Monster", muster: /Monster/ },
  { wort: "Geist", muster: /Geist/ },
  { wort: "Blut", muster: /Blut/ },
  { wort: "böse", muster: /böse/ },
  { wort: "Bösewicht", muster: /Bösewicht/ },
  // schrei/Schrei/schreit/schreien — aber NICHT schreib…/beschreib…
  { wort: "schrei", muster: /schrei(?!b)/i },
  { wort: "sterben", muster: /sterben/ },
  { wort: "tot", muster: /\btot\b/ },
];

/**
 * ── R5-W6b · W5 · D-424 · DIE BENANNTEN KANON-BEGRIFFE ──────────────────────
 *
 * Die Liste oben schützt Kinder vor Angst-Wörtern: Monster, Blut, böse,
 * sterben. »Geist« steht mit gutem Grund dabei — und trifft dabei
 * **Tinten-Geister**, den kanonischen Namen der harmlosen Ambiente-Wesen des
 * Kapitels (doc 44 §1.6 und §2, dort fett). K5 ist in dieser Falle gestanden:
 * ein Kapitel-Blatt konnte die eigenen Wesen des Kapitels nicht benennen und
 * musste sie zu »Tinten-Wesen« umschreiben, damit das Tor grün wird.
 *
 * Ein Tor, das den eigenen Kanon verbietet, wird nicht respektiert, sondern
 * umgangen — und das ist teurer als die Lücke. Also wird die REGEL geschärft
 * statt das Wort gestrichen: der zusammengesetzte Kanon-Begriff ist erlaubt,
 * das nackte Wort bleibt verboten. Dieselbe Bauform, mit der W4 »schreit« von
 * »schreibt« getrennt hat (D-278) — dort war die Wortgrenze das Problem, hier
 * ist es das Wort selbst.
 *
 * Jede Ausnahme ist BENANNT und trägt ihren Beleg. Eine Ausnahme ohne Fundort
 * im Kanon ist eine Aufweichung.
 */
const KANON_AUSNAHMEN = [
  { begriff: /Tinten-Geist(er|ern|es)?\b/g, warum: "Kanon-Name der harmlosen Ambiente-Wesen, doc 44 §1.6 + §2 (dort fett) — sie sind das Gegenteil einer Drohung: das Kind läuft an ihnen vorbei" },
];

/** Der Text, wie ihn die Verbotsliste zu lesen bekommt: die Kanon-Begriffe
 *  ausgeschnitten, alles andere unverändert. Ausgeschnitten und nicht ersetzt,
 *  damit die Regel für den REST der Zeile scharf bleibt — »die Tinten-Geister
 *  und ein Geist im Flur« muss weiter rot werden. */
export const ohneKanon = (text) =>
  KANON_AUSNAHMEN.reduce((t, a) => t.replace(a.begriff, ""), text);

/** Welche verbotenen Wörter stehen in diesem Text? */
const registerHits = (text) => {
  const gelesen = ohneKanon(text);
  return REGISTER_BANNED.filter((b) => b.muster.test(gelesen)).map((b) => b.wort);
};

// ── Selbsttest (W4/D-278) ───────────────────────────────────────────────────
// Der Fall, an dem RICHTIG und PLAUSIBEL-FALSCH auseinandergehen: „schreibt"
// gegen „schreit". Eine Teilketten-Suche beantwortet beide gleich; nur eine mit
// Wortgrenze trennt sie. Deshalb steht hier BEIDES — ein rotes Licht und ein
// grünes, denn ein Selbsttest, der nur rote Lichter zeigt, kann ein Tor, das
// auf alles anschlägt, nicht von einem funktionierenden unterscheiden.
if (process.argv.includes("--selftest")) {
  const faelle = [
    ["ein Schrei ist verboten", "Die Tafel schreit auf.", ["schrei"]],
    ["…auch groß geschrieben", "Ein Schrei hallt.", ["schrei"]],
    ["NICHT-TAMPER: »schreibt« ist ein normales Wort", "Das Kind schreibt das Wort.", []],
    ["NICHT-TAMPER: »beschreibt« auch", "Der Absatz beschreibt die Bühne.", []],
    ["NICHT-TAMPER: »Beschreibung« auch", "Siehe die Beschreibung oben.", []],
    ["»tot« als eigenes Wort ist verboten", "Der Baum ist tot.", ["tot"]],
    ["NICHT-TAMPER: »total« ist kein »tot«", "Das ist total in Ordnung.", []],
    ["die Stämme bleiben Stämme", "ein böser Blick", ["böse"]],
    // ── D-424 · der Kanon-Begriff gegen das nackte Wort ────────────────────
    // Hier gehen richtig und plausibel-falsch auseinander: eine Teilketten-
    // Suche beantwortet beide Zeilen gleich (rot), und eine zu grosszuegige
    // Ausnahme beantwortet beide gleich (grün). Nur eine Ausnahme, die GENAU
    // den zusammengesetzten Begriff ausschneidet, trennt sie.
    ["NICHT-TAMPER: der Kanon-Begriff ist erlaubt", "Die Tinten-Geister ziehen durch den Flur.", []],
    ["NICHT-TAMPER: auch im Singular", "Ein Tinten-Geist sitzt auf dem Pult.", []],
    ["das nackte Wort bleibt verboten", "Ein Geist sitzt auf dem Pult.", ["Geist"]],
    ["…und die Ausnahme schaltet die Regel nicht für den REST der Zeile ab",
      "Die Tinten-Geister und ein Geist im Flur.", ["Geist"]],
  ];
  let bad = 0;
  for (const [name, text, erwartet] of faelle) {
    const got = registerHits(text);
    if (JSON.stringify(got) === JSON.stringify(erwartet)) console.log(`  \u2713 ${name}`);
    else { bad++; console.error(`  \u2717 ${name} — erwartet [${erwartet}], bekommen [${got}]`); }
  }
  if (bad > 0) { console.error("check-design-sheets --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-design-sheets --selftest: OK — ${faelle.length} F\u00e4lle, `
    + "der Schrei wird gefunden und das Schreiben in Ruhe gelassen (D-278)");
  process.exit(0);
}

const isSheet = (x) => /^ch\d+\.md$/.test(x); // chapter sheets only — templates/notes in this dir are not sheets
for (const f of fs.readdirSync(sheetsDir).filter(isSheet)) {
  const chId = f.replace(".md", "");
  const text = fs.readFileSync(`${sheetsDir}/${f}`, "utf8");
  const ch = chapters.get(chId);
  if (!ch) { fail(f, `no story chapter ${chId}`); continue; }
  const unitNum = String(ch.unit).padStart(2, "0");
  const unitDir = `${R}/content/corpus/units/g1-u${unitNum}`;

  // scene anchors like s001 (scoped to this chapter)
  const chScenes = new Set(ch.scenes.map((s) => s.id.split(".").pop()));
  for (const m of text.matchAll(/`(s\d{3})`/g)) {
    if (!chScenes.has(m[1])) fail(f, `scene anchor ${m[1]} not in ${chId} (has ${[...chScenes].at(0)}…${[...chScenes].at(-1)})`);
  }

  // structure ids g1uNN.s.*
  let structures = new Set();
  let vocabIds = new Set();
  let grammarIds = new Set();
  let compIds = new Set();
  try {
    const g = JSON.parse(fs.readFileSync(`${unitDir}/grammar.json`));
    for (const it of g.items) { structures.add(it.structureId); grammarIds.add(it.id); }
    const v = JSON.parse(fs.readFileSync(`${unitDir}/vocab.json`));
    for (const it of v.items) vocabIds.add(it.id);
  } catch { fail(f, `unit corpus missing at ${unitDir}`); continue; }
  try {
    const c = JSON.parse(fs.readFileSync(`${unitDir}/comprehension.json`));
    for (const it of c.items ?? []) compIds.add(it.id);
  } catch { /* comprehension ids are validated via story taskSlots below instead */ }

  // every scene's ACTUAL taskSlot ids double as ground truth for beat rows
  const beatTaskIds = new Set();
  for (const s of ch.scenes) for (const t of s.taskSlots ?? []) beatTaskIds.add(typeof t.itemId === "string" ? t.itemId : JSON.stringify(t.itemId));

  for (const m of text.matchAll(/`(g1u\d{2}\.[a-z]+\.[A-Za-z0-9.\-]+)`/g)) {
    const id = m[1];
    const ok =
      structures.has(id) || vocabIds.has(id) || grammarIds.has(id) || compIds.has(id) ||
      beatTaskIds.has(id) || [...beatTaskIds].some((b) => b.includes(id));
    if (!ok) fail(f, `corpus id not found: ${id}`);
  }

  // section skeleton (the frozen format)
  for (const sec of ["## 1 · Identity", "## 2 · Story spine", "## 3 · CLT block", "## 4 · Level design", "## 5 ·", "## 6 · Assets", "## 7 · Beats staging", "Warum-Zeile"]) {
    if (!text.includes(sec)) fail(f, `missing section marker "${sec}"`);
  }

  // register law (German threat-word ban) — check German-looking lines only
  for (const hit of registerHits(text)) fail(f, `register-law violation: "${hit}"`);
}

// ── PAINT sheets (docs/design/g1/paint/chNN.md, sheet v4) ────────────────────
// Same corpus-id truth + register law; NO scene anchors (Keen-story artifacts)
// and the v4 section skeleton instead of the Keen one.
const paintDir = `${sheetsDir}/paint`;
if (fs.existsSync(paintDir)) {
  for (const f of fs.readdirSync(paintDir).filter(isSheet)) {
    const chId = f.replace(".md", "");
    const text = fs.readFileSync(`${paintDir}/${f}`, "utf8");
    const ch = chapters.get(chId);
    if (!ch) { fail(`paint/${f}`, `no story chapter ${chId}`); continue; }
    const unitNum = String(ch.unit).padStart(2, "0");
    const unitDir = `${R}/content/corpus/units/g1-u${unitNum}`;
    let ids = new Set();
    try {
      const g = JSON.parse(fs.readFileSync(`${unitDir}/grammar.json`));
      for (const it of g.items) { ids.add(it.structureId); ids.add(it.id); }
      const v = JSON.parse(fs.readFileSync(`${unitDir}/vocab.json`));
      for (const it of v.items) ids.add(it.id);
    } catch { fail(`paint/${f}`, `unit corpus missing at ${unitDir}`); continue; }
    try {
      const c = JSON.parse(fs.readFileSync(`${unitDir}/comprehension.json`));
      for (const it of c.items ?? []) ids.add(it.id);
    } catch { /* optional */ }
    for (const m of text.matchAll(/`(g1u\d{2}\.[a-z]+\.[A-Za-z0-9.\-]+)`/g)) {
      if (![...ids].some((k) => k === m[1] || k.startsWith(m[1]) || m[1].startsWith(k))) fail(`paint/${f}`, `corpus id not found: ${m[1]}`);
    }
    for (const sec of ["## §1 · Identity + palette card", "## §2 · Unit audit", "## §3 · Bewitchment concept", "## §4 · Role casting table", "## §5 · Phase-chain layout", "## §6 · Guardian", "## §7 · Task set", "## §8 · Asset list + gates", "goalDe", "whyDe"]) {
      if (!text.includes(sec)) fail(`paint/${f}`, `missing v4 section marker "${sec}"`);
    }
    for (const hit of registerHits(text)) fail(`paint/${f}`, `register-law violation: "${hit}"`);
  }
}

const paintCount = fs.existsSync(paintDir) ? fs.readdirSync(paintDir).filter(isSheet).length : 0;
if (failures === 0) console.log(`check-design-sheets: OK — ${fs.readdirSync(sheetsDir).filter(isSheet).length} keen + ${paintCount} paint sheets, all corpus ids + sections + register green`);
else { console.error(`check-design-sheets: ${failures} failure(s)`); process.exit(1); }
