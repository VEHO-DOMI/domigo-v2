#!/usr/bin/env node
// R5-W3 · K1 · DAS TOR ÜBER DEN REGISTERN.
//
// Drei Sessions haben an dasselbe Schulden-Register angehängt und dabei je neu
// zu zählen begonnen: 73 Zeilen, 61 verschiedene Nummern, `D-33` dreimal. Eine
// Registernummer ist aber eine ADRESSE — sie steht in Code-Kommentaren, in
// Import-Skripten und in den Passovers anderer Sessions. Doppelt vergeben heißt:
// jeder Verweis darauf ist mehrdeutig, und zwei Verweise zeigten nachweislich
// auf die falsche Zeile. Dieselbe Klasse hatte gleichzeitig das Fallen-Register
// erwischt (G1 und H1 benutzten beide P-61…P-66).
//
// Und die Dossiers verwiesen 20-mal in der Form `datei.ts:123` auf Code. Alle
// 20 Zeilen existierten noch — KEINE zeigte mehr auf die gemeinte Stelle. Eine
// Bereichsprüfung („gibt es die Zeile?") sieht das nie; deshalb verbietet dieses
// Tor die Form und verlangt `datei#symbol`, das mit seiner Zeile mitwandert.
//
// Vier Gesetze:
//   1 · Jede D-Nummer im Schulden-Register ist genau einmal vergeben.
//   2 · Jede PB-Nummer im Fallen-Register ist genau einmal vergeben, lückenlos ab 1.
//   3 · Jeder `datei#anker`-Verweis in den beobachteten Dokumenten löst auf:
//       Datei existiert UND der Anker steht wörtlich darin.
//   4 · Die Form `datei.ts:123` ist in den beobachteten Dokumenten verboten.
//
// ── R5-W5 · W4 · D-242: ZWEI KLASSEN, DIE DIESES TOR NICHT SEHEN KONNTE ─────
//
// (a) Das Schulden-Register stand SELBST nicht in `WATCHED` — ausgerechnet die
//     Datei mit den meisten Zeilennummern-Zitaten. Die Gesetze 3 und 4 haben
//     sie nie angesehen. Sie aufzunehmen ist nicht gratis: sie trägt heute 43
//     Verweise der verbotenen Form, und einer davon ist `datei.ts:123` im Text
//     von D-242 selbst — die Nennung der verbotenen Form. Die Zitate zu heben
//     heißt, in fremden Register-Abschnitten zu schreiben, was dieser Bahn
//     verboten ist. Also: aufgenommen MIT einer datierten Ausnahmeliste, die
//     als RATSCHE läuft — genau die Mechanik, die #310 für `SEAM_ALLOW`
//     ratifiziert hat (R106). Ein NEUER Verweis der alten Form ist rot; ein
//     Eintrag, dessen Verweis verschwunden ist, ist schal und ebenfalls rot.
//     Eine Ausnahme darf einen bekannten Rest dulden, nie einen neuen aufnehmen.
//
// (b) Gesetz 1 erkannte eine D-Nummer nur als Tabellenzeile `| D-nn |`. Zwei
//     Folgen, beide gemessen:
//       · Eine GESCHLOSSENE Zeile ist durchgestrichen (`| ~~D-52~~ |`) und war
//         damit unsichtbar — ihre Nummer hätte neu vergeben werden können.
//       · Die zweite, widersprechende Nennung von D-45 stand in PROSA und blieb
//         deshalb jahrelang grün (die Klasse, die D-165 gemeldet hat).
//     Jetzt zählt das Tor auch die Prosa: jede genannte Nummer muss eine Zeile
//     haben („erwähnt ohne Zeile" ist eine tote Adresse), und eine Nennung in
//     DEFINITIONSFORM außerhalb einer Tabellenzeile gilt als zweite Vergabe.
//     Bereichs-Angaben (`Reserviert: D-330…D-339`) sind Blöcke, keine Verweise —
//     ohne diese Unterscheidung wären 28 Nummern am ersten Tag falsch rot.
//     Am echten Register gemessen: 247 Zeilen, keine tote Adresse, keine
//     Prosa-Definition. Das Gesetz greift also ohne eine einzige Ausnahme.
//
// Run: node scripts/check-registers.mjs            (exit 1 bei jedem Verstoß)
//      node scripts/check-registers.mjs --selftest (beweist, dass das rote Licht geht)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const DEBT = "docs/design/g1/paint/DEBT_REGISTER.md";
const PITFALLS = "docs/handover/46_pitfall_register.md";

/** Dokumente, deren Code-Verweise geprüft werden (Gesetze 3 und 4).
 *  Bewusst eng: hier wurde die Klasse gefunden und aufgeräumt. Wer ein weiteres
 *  Dokument sauber hat, trägt es hier ein — dann hält das Tor es sauber. */
// L0 · D10: JEDER Dossier-Ordner, nicht nur der von Kapitel 1. Ein Kapitel, das
// hier nicht steht, darf tote D-Nummern und erfundene Symbol-Verweise tragen —
// und niemand sieht es. Ordner, die es (noch) nicht gibt, fallen still weg;
// die Liste der wirklich gelesenen Ordner steht unten in der OK-Zeile, damit
// »geprüft« eine Zahl hat und keine Annahme ist.
const DOSSIER_ROOT = path.join(R, "docs/design/g1/paint");
const DOSSIER_DIRS = (fs.existsSync(DOSSIER_ROOT) ? fs.readdirSync(DOSSIER_ROOT) : [])
  .filter((d) => /^ch\d{2}-dossiers-v2$/.test(d) && fs.statSync(path.join(DOSSIER_ROOT, d)).isDirectory())
  .sort();
const WATCHED = [
  ...DOSSIER_DIRS.flatMap((d) => fs.readdirSync(path.join(DOSSIER_ROOT, d))
    .filter((f) => f.endsWith(".md"))
    .map((f) => `docs/design/g1/paint/${d}/${f}`)),
  "docs/design/g1/paint/SPEC_MASSEN_KIT.md",
  DEBT, // W4/D-242(a) — mit der Ausnahmeliste unten
];

/** D-242(a) · Die Zeilennummern-Verweise, die am 2026-08-17 im Schulden-Register
 *  standen, als es unter Gesetz 4 gestellt wurde. Sie sind GEDULDET, nicht
 *  erlaubt: die Liste ist eine Ratsche. Ein Verweis, der hier nicht steht, ist
 *  rot. Mehr Vorkommen eines gelisteten Verweises als deklariert: rot. Ein
 *  Eintrag, dessen Verweis verschwunden ist: schal, also auch rot.
 *
 *  Das Heben auf `datei#symbol` gehört der Kanon-Bahn (K4) — diese Bahn darf in
 *  fremden Register-Abschnitten nicht schreiben. Läuft das Datum ab, ohne dass
 *  die Liste geschrumpft ist, braucht es einen ausdrücklichen Beschluss, keine
 *  stille Verlängerung (R106). */
// ── R5-W7 · K6 · R195 · DIE VERLÄNGERUNG, SCHRIFTLICH ───────────────────────
//
// Diese Ausnahmeliste wäre am 1. Oktober 2026 von selbst rot geworden — nicht
// als Vermutung: P6 hat am 2026-08-19 dieses Tor kopiert, NUR das Datum
// getauscht und beide Fassungen laufen lassen. Heute Exit 0 ("49 Verweise,
// davon 49 geduldet, 0 neu"), mit der Uhr auf dem 01.10.2026 Exit 1 ("Die
// Ausnahmeliste des Schulden-Registers ist am 2026-09-30 abgelaufen"). Beide
// Ausgaben liegen in `REPORTS/REPORT_P6_2026-08-19/messung/`.
//
// Ein `main`, das an einem Mittwoch von selbst rot wird, ist niemandes Arbeit
// (H6/R147) — und die Liste ist nicht geschrumpft, weil die Zitate in FREMDEN
// Register-Abschnitten stehen, in denen diese Bahn nicht schreiben darf.
//
// BESCHLUSS (Ruling R195, ratifiziert mit dem Merge dieses PRs):
//   · neues Datum   2026-11-30 — dasselbe wie SEAM_ALLOW und COHERENCE_WAIVERS,
//                   damit die datierten Ausnahmen dieses Projekts an EINEM Tag
//                   zur Entscheidung kommen und nicht an dreien;
//   · Eigentümer    "K-Bahn" statt "K4 / Kanon-Bahn" — die Bahn K4 gibt es nicht
//                   mehr, und eine Ausnahme ohne lebenden Eigentümer ist eine
//                   ohne Eigentümer (D-423, dieselbe Klasse);
//   · Grund         das Heben auf `datei#symbol` ist echte Arbeit in fremden
//                   Abschnitten und braucht eine eigene kleine Bahn. Ihre GRÖSSE
//                   steht ausgeschrieben im Schulden-Register (K6s Abschnitt).
//
// Die Verlängerung ist kein Freibrief: die Ratsche bleibt scharf. Ein NEUER
// Verweis der alten Form ist rot, ein gelisteter Verweis, der öfter dasteht als
// geduldet, ist rot, und ein Eintrag, dessen Verweis verschwunden ist, ist schal
// und ebenfalls rot. Verlängert wird die Frist, nicht die Erlaubnis.
//
// Diese Bahn hat beim Sweep gehoben, was sie ohnehin angefasst hat — gemessen
// waren das NULL der 49 Verweise: keiner liegt in einer Zeile, die K6 anfassen
// darf (die Zahl steht im Report, statt als Vorsatz behauptet zu werden).
const LINE_REF_UNTIL = "2026-11-30";
const LINE_REF_OWNER = "K-Bahn";
const LINE_REF_ALLOW = [
  // Der einzige Eintrag, der niemals fällt: D-242 nennt die verbotene Form beim Namen.
  { ref: "datei.ts:123", n: 1, why: "D-242 zitiert die verbotene Form selbst — sie MUSS dort stehen" },
  // ── Beim Post-Zug-Merge dazugekommen (2026-08-18). Dieses Tor stand waehrend
  // der Welle 5 noch nicht auf main, also konnten G4, B4b und F6 die alte Form
  // nicht sehen. Geduldet wie der Rest, mit ihrem EIGENTUEMER benannt — nicht
  // von dieser Bahn in fremden Abschnitten umgeschrieben.
  { ref: "level.ts:1556", n: 1, lane: "G4 (D-295)" },
  { ref: "entities.ts:100", n: 1, lane: "B4b (D-302)" },
  { ref: "PaintScene.ts:5265", n: 2, lane: "B4b (D-305)" },
  { ref: "ch01-dossiers-v2/README.md:72", n: 1, lane: "B4b (D-307)" },
  { ref: "anim.ts:579", n: 1, lane: "F6 (D-317)" },
  { ref: "46_pitfall_register.md:172", n: 1 },
  { ref: "CONTRIBUTING.md:79", n: 1 },
  { ref: "CardGallery.tsx:113", n: 1 },
  { ref: "CeremonyStage.tsx:53", n: 1 },
  { ref: "STATUS_AND_ROADMAP.md:5", n: 1 },
  // ── 2026-08-21 · K6 · R195(a) · GEHOBEN, deshalb entfernt ───────────────────
  // `UNIFORM_SAMMELN_DESIGN.md:542` stand hier als geduldeter Rest. Der Verweis
  // war schon vorher TOT — er zeigte auf eine Tabellenzeile ueber die
  // Punkte-Karte, nicht auf die Blaetter-Zahl, die D-254 meint (die steht 16
  // Zeilen weiter) — und K6s eigene Aenderungen an derselben Datei haetten ihn
  // ein zweites Mal verschoben. Genau die Klasse, fuer die Gesetz 4 existiert.
  // D-254 zitiert jetzt `UNIFORM_SAMMELN_DESIGN.md#DEAD_ART_CEILING`.
  // Damit sind es 48 geduldete Verweise statt 49 — die Ratsche dreht sich.
  { ref: "apps/web/app/fonts/LICENSE.md:19", n: 1 },
  { ref: "apps/web/app/layout.tsx:10", n: 1 },
  { ref: "apps/web/lib/paint-content.ts:203", n: 1 },
  { ref: "artManifest.ts:26", n: 1 },
  { ref: "artScope.ts:82", n: 1 },
  { ref: "artScope.ts:95", n: 1 },
  { ref: "cards/Glance.tsx:313", n: 1 },
  { ref: "ch01-dossiers-v2/arena.md:435", n: 1 },
  { ref: "ch01-dossiers-v2/p1.md:113", n: 1 },
  { ref: "ch02.md:62", n: 1 },
  { ref: "ch03.md:59", n: 1 },
  { ref: "ch04.md:66", n: 1 },
  { ref: "check-paint-art.mjs:109", n: 1 },
  { ref: "check-story-grounding.mjs:115", n: 1 },
  { ref: "check-story-grounding.mjs:50", n: 1 },
  { ref: "checkpoint-silence.test.ts:177", n: 1 },
  { ref: "content-schema/src/game-tasks.ts:427", n: 1 },
  { ref: "docs/design/g1/paint/README.md:20", n: 1 },
  { ref: "entities.ts:870", n: 1 },
  { ref: "import-batch-as.mjs:81", n: 1 },
  { ref: "key-fringe.mjs:224", n: 1 },
  { ref: "loader.test.ts:24", n: 1 },
  { ref: "p2.md:267", n: 1 },
  { ref: "p2.md:87", n: 1 },
  { ref: "p3.md:127", n: 1 },
  { ref: "packages/content-schema/src/game-tasks.ts:427", n: 1 },
  { ref: "perfBudget.ts:118", n: 1 },
  { ref: "scripts/check-fonts.mjs:2", n: 1 },
  { ref: "scripts/check-story-grounding.mjs:50", n: 1 },
  { ref: "shoot-card-bench.mjs:26", n: 2 },
  { ref: "shoot-world.mjs:61", n: 1 },
  { ref: "sim.ts:75", n: 1 },
  { ref: "variety.ts:287", n: 1 },
  { ref: "variety.ts:620", n: 1 },
  { ref: "wordbank.ts:460", n: 1 },
];

const selftest = process.argv.includes("--selftest");
let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };

const read = (rel) => fs.readFileSync(path.join(R, rel), "utf8");

// ── Auflösung eines Verweis-Pfades auf eine echte Datei ──────────────────────
// Die Dossiers schreiben mal `sim.ts`, mal `cards/machines.test.ts`, mal den
// vollen Pfad. Gesucht wird zuerst wörtlich, dann als Suffix im Baum.
let TREE = null;
const tree = () => {
  if (TREE !== null) return TREE;
  TREE = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === ".next") continue;
      const rel = dir === "." ? e.name : `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel);
      else TREE.push(rel);
    }
  };
  walk(".");
  return TREE;
};
/** Steht dieser Anker in der Datei?
 *
 *  Ein Anker ist meist EIN Symbol (`stepRedeemed`), aber die Dossiers schreiben
 *  auch Gliedpfade: `PhaseSpec.checkpointSide` heißt „das Feld checkpointSide
 *  des Typs PhaseSpec". Diese Form steht so NIE im Quelltext — die Schnittstelle
 *  deklariert oben `PhaseSpec` und weiter unten `checkpointSide?: …`. Ein
 *  wörtlicher Vergleich meldet sie deshalb als fehlend, obwohl beide Teile da
 *  sind: ein falsches rotes Licht auf einen völlig richtigen Verweis (gemessen
 *  am B4b-Eintrag D-306, 2026-08-18).
 *
 *  Also: erst wörtlich, dann gliedweise — und JEDES Glied muss vorkommen. Das
 *  bleibt eine echte Prüfung: ein Symbol, das es nicht gibt, hat kein Glied im
 *  Text, und ein einteiliger Anker wird unverändert wörtlich gesucht. */
const anchorIn = (text, anchor) => {
  if (text.includes(anchor)) return true;
  const teile = anchor.split(".").filter(Boolean);
  return teile.length > 1 && teile.every((t) => text.includes(t));
};

const resolveRef = (ref) => {
  if (fs.existsSync(path.join(R, ref))) return ref;
  const hits = tree().filter((f) => f === ref || f.endsWith(`/${ref}`));
  return hits.length === 1 ? hits[0] : hits.length > 1 ? hits : null;
};

// ── Gesetz 1 + 2 · Eindeutige Registernummern ───────────────────────────────
// W4/D-242(b): auch die DURCHGESTRICHENE Zeile einer geschlossenen Schuld ist
// eine vergebene Nummer. `| ~~D-52~~ |` war für die alte Form unsichtbar — und
// eine unsichtbare Vergabe ist eine, die jemand ein zweites Mal vergibt.
// Die Doppelgänger-Tabelle (`| D-28 (2.) | **D-74** |`) ist ausdrücklich KEINE
// Vergabe: sie hält fest, welche zweite Nennung auf welche neue Nummer gehoben
// wurde. Deshalb endet das Muster hart nach der Nummer.
const rowIds = (text, prefix) =>
  text.split("\n")
    .map((l) => l.match(new RegExp(`^\\| *(?:~~)?\\*{0,2}${prefix}-(\\d+)\\*{0,2}(?:~~)? *\\|`)))
    .filter(Boolean)
    .map((m) => Number(m[1]));

/** Eine Bereichs-Angabe (`D-330…D-339`, `D-130…139`) deklariert einen BLOCK.
 *  Ihre Endpunkte sind keine Verweise auf einzelne Einträge — ohne diese
 *  Unterscheidung wären die zehn reservierten Blöcke aus PR #311 (und die
 *  Abschnitts-Überschriften) 28 falsche rote Lichter am ersten Tag. */
const RANGE = /D-(\d+)\s*(?:…|\.\.\.|–|—|-{1,2})\s*(?:D-)?(\d+)/g;

/** Eine Nennung in DEFINITIONSFORM außerhalb einer Tabellenzeile: `**D-45** · …`
 *  oder `- D-45 — …`. Das ist die Form, in der D-45s zweite, widersprechende
 *  Beschreibung stand. Ein Querverweis mitten im Satz („geschlossen: D-45 (…)")
 *  trifft sie nicht. */
const PROSE_DEF = /^\s*(?:[*-]\s+)?(?:\*\*)?D-(\d+)(?:\*\*)?\s*(?:·|—|:)/;

/** W4/D-242(b) · Was das Schulden-Register über seine Nummern sagt, wenn man
 *  nicht nur seine Tabellenzeilen liest. */
export const debtMentions = (text) => {
  const rows = new Set(rowIds(text, "D"));
  const dangling = [];
  const proseDefs = [];
  text.split("\n").forEach((line, i) => {
    const isRow = /^\| *(?:~~)?\*{0,2}D-\d+/.test(line);
    if (!isRow) {
      const d = line.match(PROSE_DEF);
      if (d !== null) proseDefs.push({ n: Number(d[1]), line: i + 1 });
    }
    // Bereiche vor dem Zählen herausnehmen: ihre Endpunkte sind Blockgrenzen.
    for (const m of line.replace(RANGE, "").matchAll(/\bD-(\d+)\b/g)) {
      const n = Number(m[1]);
      if (!rows.has(n)) dangling.push({ n, line: i + 1 });
    }
  });
  return { rows, dangling, proseDefs };
};

const entryIds = (text, prefix) =>
  [...text.matchAll(new RegExp(`^\\*\\*${prefix}-(\\d+) · `, "gm"))].map((m) => Number(m[1]));

const uniqueLaw = (label, ids, { gapless = false } = {}) => {
  const seen = new Map();
  for (const n of ids) seen.set(n, (seen.get(n) ?? 0) + 1);
  const dupes = [...seen.entries()].filter(([, c]) => c > 1).map(([n, c]) => `${n} (${c}×)`);
  if (dupes.length > 0) fail(`${label}: doppelt vergebene Nummern — ${dupes.join(", ")}`);
  if (gapless && ids.length > 0) {
    const max = Math.max(...ids);
    const missing = [];
    for (let i = 1; i <= max; i++) if (!seen.has(i)) missing.push(i);
    if (missing.length > 0) {
      const shown = missing.slice(0, 8).join(", ");
      fail(`${label}: ${missing.length} Lücke(n) in der Nummernfolge — ${shown}`
        + (missing.length > 8 ? ` … (+${missing.length - 8} weitere)` : ""));
    }
  }
  return { count: ids.length, unique: seen.size };
};

const debtText = read(DEBT);
const debt = uniqueLaw("Schulden-Register (D-nn)", rowIds(debtText, "D"));
const pit = uniqueLaw("Fallen-Register (PB-nn)", entryIds(read(PITFALLS), "PB"), { gapless: true });

// ── Gesetz 1b · W4/D-242: die Prosa zählt mit ───────────────────────────────
const mentions = debtMentions(debtText);
for (const { n, line } of mentions.dangling) {
  fail(`${DEBT}:${line} — D-${n} ist ERWÄHNT OHNE ZEILE: die Nummer ist eine Adresse, `
    + "und diese zeigt ins Leere. Zeile anlegen, Nummer korrigieren, oder als Bereich schreiben (D-a…D-b)");
}
for (const { n, line } of mentions.proseDefs) {
  fail(`${DEBT}:${line} — D-${n} steht hier in DEFINITIONSFORM außerhalb der Tabelle. `
    + "Genau so stand D-45 ein zweites Mal da und blieb jahrelang grün: eine Schuld wird in EINER Tabellenzeile "
    + "beschrieben, sonst nirgends. Als Querverweis mitten im Satz schreiben oder in die Tabelle heben");
}

// ── Gesetz 3 · `datei#anker` löst auf ───────────────────────────────────────
const ANCHOR = /`([A-Za-z0-9_./ -]+\.(?:ts|tsx|mjs|js|json|md))#([^`]+)`/g;
const LINE_REF = /`([A-Za-z0-9_./-]+\.(?:ts|tsx|mjs|js|json|md)):(\d+)`/g;

/** Gesetz 4 über EINEN Text, rein — damit der Selbsttest gegen den ECHTEN
 *  Registertext tampern kann statt gegen eine erfundene Konfiguration (P-71). */
export const lineRefLaw = (text, allow, label = "dok") => {
  const failures = [];
  const allowedSeen = new Map();
  let found = 0;
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(LINE_REF)) {
      found++;
      const key = `${m[1]}:${m[2]}`;
      const listed = allow.get(key);
      if (listed !== undefined) {
        const n = (allowedSeen.get(key) ?? 0) + 1;
        allowedSeen.set(key, n);
        if (n > listed.n) {
          failures.push(`${label}:${i + 1} — Ausnahme GESPRENGT: \`${key}\` steht jetzt ${n}× da, `
            + `geduldet sind ${listed.n}. Eine Ausnahme darf einen bekannten Rest dulden, nie einen neuen aufnehmen`);
        }
        continue;
      }
      failures.push(`${label}:${i + 1} — Zeilennummern-Verweis \`${key}\` verboten (er altert still). `
        + `Stattdessen \`${m[1]}#<symbol>\` schreiben.`);
    }
  });
  return { failures, allowedSeen, found };
};

/** …und die Gegenrichtung: ein Eintrag, dessen Verweis verschwunden ist. */
export const staleAllowLaw = (seen, allow) =>
  allow
    .filter((a) => (seen.get(a.ref) ?? 0) === 0)
    .map((a) => `LINE_REF_ALLOW nennt \`${a.ref}\`, aber der Verweis steht nicht mehr im Register `
      + "— Ausnahme SCHAL, Eintrag entfernen");

let anchors = 0;
let lineRefs = 0;
const today = new Date().toISOString().slice(0, 10);
const allowByRef = new Map(LINE_REF_ALLOW.map((a) => [a.ref, a]));
const seenAllowed = new Map();
for (const doc of WATCHED) {
  const lines = read(doc).split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(ANCHOR)) {
      anchors++;
      const [, ref, anchor] = m;
      const hit = resolveRef(ref);
      if (hit === null) { fail(`${doc}:${i + 1} — Verweis auf eine Datei, die es nicht gibt: ${ref}`); continue; }
      if (Array.isArray(hit)) {
        // W4: Mehrdeutigkeit ist erst dann eine, wenn der ANKER sie nicht auflöst.
        // Zwei Dateien heißen `content-levels.test.ts`; trägt genau eine das
        // Symbol, ist der Verweis eindeutig. Trägt es KEINE, ist die richtige
        // Meldung nicht »mehrdeutig«, sondern »dieses Symbol gibt es nicht« —
        // und die ist es, die den Leser zur Reparatur führt.
        const carrying = hit.filter((f) => anchorIn(fs.readFileSync(path.join(R, f), "utf8"), anchor));
        if (carrying.length === 1) continue;
        fail(carrying.length === 0
          ? `${doc}:${i + 1} — Anker »${anchor}« steht in KEINER der ${hit.length} Dateien namens ${ref} `
            + `(${hit.join(", ")}) — das Symbol gibt es nicht (mehr)`
          : `${doc}:${i + 1} — ${ref}#${anchor} ist mehrdeutig: ${carrying.length} Dateien tragen das Symbol `
            + `(${carrying.join(", ")}); vollen Pfad schreiben`);
        continue;
      }
      if (!anchorIn(fs.readFileSync(path.join(R, hit), "utf8"), anchor)) {
        fail(`${doc}:${i + 1} — Anker »${anchor}« steht nicht in ${hit}`);
      }
    }
  });
  // ── Gesetz 4 · die verrottende Form ist verboten ──────────────────────────
  const v = lineRefLaw(read(doc), doc === DEBT ? allowByRef : new Map(), doc);
  lineRefs += v.found;
  for (const [k, n] of v.allowedSeen) seenAllowed.set(k, (seenAllowed.get(k) ?? 0) + n);
  for (const msg of v.failures) fail(msg);
}

// ── Gesetz 4b · keine schale Ausnahme ───────────────────────────────────────
const geduldet = [...seenAllowed.values()].reduce((a, b) => a + b, 0);
for (const msg of staleAllowLaw(seenAllowed, LINE_REF_ALLOW)) fail(msg);
if (LINE_REF_ALLOW.length > 0 && LINE_REF_UNTIL < today) {
  fail(`Die Ausnahmeliste des Schulden-Registers ist am ${LINE_REF_UNTIL} abgelaufen `
    + `(${geduldet} Verweise, Eigentümer ${LINE_REF_OWNER}). Verlängerung nur als ausdrücklicher Beschluss, `
    + "nie still — die Zitate auf `datei#symbol` heben");
}

// ── Selbsttest: jedes rote Licht einmal wirklich gesehen ────────────────────
if (selftest) {
  const cases = [
    ["doppelte D-Nummer", () => uniqueLaw("x", [1, 2, 2, 3])],
    ["doppelte PB-Nummer", () => uniqueLaw("x", [1, 2, 2], { gapless: true })],
    ["Lücke in der PB-Folge", () => uniqueLaw("x", [1, 3], { gapless: true })],
    ["Anker steht nicht in der Datei", () => {
      const hit = resolveRef("package.json");
      if (typeof hit !== "string") throw new Error("Auflösung selbst kaputt");
      if (!fs.readFileSync(path.join(R, hit), "utf8").includes("__diesen-anker-gibt-es-nicht__")) fail("x");
    }],
    ["Datei existiert nicht", () => { if (resolveRef("gibtesnicht.ts") === null) fail("x"); }],
    ["Zeilennummern-Form", () => { if (/`sim\.ts:840`/.test("siehe `sim.ts:840` dort")) fail("x"); }],

    // ── W4/D-242 · getampert wird der ECHTE Registertext, nicht eine erfundene
    //    Konfiguration (P-71). Jeder Fall verändert genau eine Stelle.
    ["D-242(a) · ein NEUER Zeilennummern-Verweis im Register", () => {
      const t = `${debtText}\n| D-999 | siehe \`PaintScene.ts:4711\` | x | y | z | q |`;
      if (lineRefLaw(t, allowByRef).failures.length > 0) fail("x");
    }],
    ["D-242(a) · Ratsche: ein gelisteter Verweis steht öfter da als geduldet", () => {
      const t = `${debtText}\n… noch einmal \`perfBudget.ts:118\` …`;
      const v = lineRefLaw(t, allowByRef);
      if (v.failures.some((f) => f.includes("GESPRENGT"))) fail("x");
    }],
    ["D-242(a) · schale Ausnahme: der geduldete Verweis ist weg", () => {
      const t = debtText.replace("`perfBudget.ts:118`", "`perfBudget.ts#DEAD_ART_CEILING`");
      const v = lineRefLaw(t, allowByRef);
      if (staleAllowLaw(v.allowedSeen, LINE_REF_ALLOW).length > 0) fail("x");
    }],
    ["D-242(b) · eine Nummer ist erwähnt, hat aber keine Zeile", () => {
      // Die Prüf-Nummer wird BERECHNET, nie festgelegt: bis 2026-09-05 stand hier
      // fest D-901 - an dem Tag bekam D-901 seine Zeile (ch05-Block), und der
      // Tamper wurde blind, weil das Register ehrlicher wurde. Eine Nummer
      // oberhalb der hoechsten vergebenen hat per Bauart keine Zeile.
      const free = Math.max(...rowIds(debtText, "D")) + 1;
      const t = `${debtText}\n**Nebenbei:** D-${free} hängt daran.`;
      if (debtMentions(t).dangling.some((d) => d.n === free)) fail("x");
    }],
    ["D-242(b) · eine zweite Beschreibung in Prosa (die D-45-Klasse)", () => {
      const t = `${debtText}\n**D-45** · und hier steht dieselbe Nummer noch einmal, anders beschrieben.`;
      if (debtMentions(t).proseDefs.some((d) => d.n === 45)) fail("x");
    }],
    ["D-242(b) · eine DURCHGESTRICHENE Zeile ist trotzdem vergeben", () => {
      // Vorher unsichtbar: `| ~~D-52~~ |`. Wird sie ein zweites Mal vergeben,
      // muss Gesetz 1 das sehen.
      const t = `${debtText}\n| D-52 | zweite Vergabe derselben Nummer | x | y | z | q |`;
      const ids = rowIds(t, "D");
      if (ids.filter((n) => n === 52).length > 1) fail("x");
    }],
  ];
  let seen = 0;
  for (const [name, run] of cases) {
    const before = failures;
    run();
    if (failures > before) { console.log(`  ✓ ${name}`); seen++; }
    else console.error(`  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`);
  }
  // NICHT-TAMPER · der UNVERÄNDERTE Registertext muss durch die neuen Gesetze
  // grün gehen. Ein Selbsttest, der nur rote Lichter sieht, kann ein Tor, das
  // auf ALLES rot geht, nicht von einem funktionierenden unterscheiden.
  let gruen = 0;
  const echt = lineRefLaw(debtText, allowByRef, DEBT);
  const echtMentions = debtMentions(debtText);
  const nichtTamper = [
    ["der echte Registertext trägt keinen NEUEN Zeilennummern-Verweis", echt.failures.length === 0],
    ["…keine schale Ausnahme", staleAllowLaw(echt.allowedSeen, LINE_REF_ALLOW).length === 0],
    ["…keine tote Adresse (Bereiche wie »D-330…D-339« zählen nicht als Verweis)", echtMentions.dangling.length === 0],
    ["…keine zweite Beschreibung in Prosa", echtMentions.proseDefs.length === 0],
  ];
  for (const [name, ok] of nichtTamper) {
    if (ok) { console.log(`  ✓ NICHT-TAMPER · ${name}`); gruen++; }
    else console.error(`  ✗ NICHT-TAMPER · ${name} — das Tor ist am echten Stand rot`);
  }
  const alle = cases.length + nichtTamper.length;
  failures = seen === cases.length && gruen === nichtTamper.length ? 0 : 1;
  console.log(failures === 0
    ? `check-registers --selftest: OK — ${alle} Fälle: ${seen} rote Lichter gesehen, `
      + `${gruen}× der echte Stand grün`
    : "check-registers --selftest: FEHLGESCHLAGEN");
  process.exit(failures);
}

if (failures > 0) {
  console.error(`\ncheck-registers: ${failures} Verstoß/Verstöße`);
  process.exit(1);
}
console.log(
  `check-registers: OK — Dossiers [${DOSSIER_DIRS.join(", ") || "keine"}] · ${debt.count} D-Nummern eindeutig (Prosa mitgezählt: keine tote Adresse, `
  + `keine zweite Beschreibung) · ${pit.count} PB-Nummern eindeutig und lückenlos · `
  + `${anchors} Symbol-Verweise aufgelöst über ${WATCHED.length} Dokumente · `
  + `${lineRefs} Zeilennummern-Verweise, davon ${geduldet} im Schulden-Register geduldet bis ${LINE_REF_UNTIL} `
  + `(${LINE_REF_OWNER}), ${lineRefs - geduldet} neu`,
);
