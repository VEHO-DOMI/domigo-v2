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
const WATCHED = [
  ...fs.readdirSync(path.join(R, "docs/design/g1/paint/ch01-dossiers-v2"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => `docs/design/g1/paint/ch01-dossiers-v2/${f}`),
  "docs/design/g1/paint/SPEC_MASSEN_KIT.md",
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
const resolveRef = (ref) => {
  if (fs.existsSync(path.join(R, ref))) return ref;
  const hits = tree().filter((f) => f === ref || f.endsWith(`/${ref}`));
  return hits.length === 1 ? hits[0] : hits.length > 1 ? hits : null;
};

// ── Gesetz 1 + 2 · Eindeutige Registernummern ───────────────────────────────
const rowIds = (text, prefix) =>
  text.split("\n")
    .map((l) => l.match(new RegExp(`^\\| \\*{0,2}${prefix}-(\\d+)\\*{0,2} \\|`)))
    .filter(Boolean)
    .map((m) => Number(m[1]));

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

const debt = uniqueLaw("Schulden-Register (D-nn)", rowIds(read(DEBT), "D"));
const pit = uniqueLaw("Fallen-Register (PB-nn)", entryIds(read(PITFALLS), "PB"), { gapless: true });

// ── Gesetz 3 · `datei#anker` löst auf ───────────────────────────────────────
const ANCHOR = /`([A-Za-z0-9_./ -]+\.(?:ts|tsx|mjs|js|json|md))#([^`]+)`/g;
const LINE_REF = /`([A-Za-z0-9_./-]+\.(?:ts|tsx|mjs|js|json|md)):(\d+)`/g;

let anchors = 0;
let lineRefs = 0;
for (const doc of WATCHED) {
  const lines = read(doc).split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(ANCHOR)) {
      anchors++;
      const [, ref, anchor] = m;
      const hit = resolveRef(ref);
      if (hit === null) { fail(`${doc}:${i + 1} — Verweis auf eine Datei, die es nicht gibt: ${ref}`); continue; }
      if (Array.isArray(hit)) { fail(`${doc}:${i + 1} — ${ref} ist mehrdeutig (${hit.length} Treffer); vollen Pfad schreiben`); continue; }
      if (!fs.readFileSync(path.join(R, hit), "utf8").includes(anchor)) {
        fail(`${doc}:${i + 1} — Anker »${anchor}« steht nicht in ${hit}`);
      }
    }
    // ── Gesetz 4 · die verrottende Form ist verboten ────────────────────────
    for (const m of line.matchAll(LINE_REF)) {
      lineRefs++;
      fail(`${doc}:${i + 1} — Zeilennummern-Verweis \`${m[1]}:${m[2]}\` verboten (er altert still). `
        + `Stattdessen \`${m[1]}#<symbol>\` schreiben.`);
    }
  });
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
  ];
  let seen = 0;
  for (const [name, run] of cases) {
    const before = failures;
    run();
    if (failures > before) { console.log(`  ✓ ${name}`); seen++; }
    else console.error(`  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`);
  }
  failures = seen === cases.length ? 0 : 1;
  console.log(failures === 0
    ? `check-registers --selftest: OK — ${cases.length} Fälle, jedes rote Licht gesehen`
    : "check-registers --selftest: FEHLGESCHLAGEN");
  process.exit(failures);
}

if (failures > 0) {
  console.error(`\ncheck-registers: ${failures} Verstoß/Verstöße`);
  process.exit(1);
}
console.log(
  `check-registers: OK — ${debt.count} D-Nummern eindeutig · ${pit.count} PB-Nummern eindeutig und lückenlos · `
  + `${anchors} Symbol-Verweise aufgelöst über ${WATCHED.length} Dokumente · ${lineRefs} Zeilennummern-Verweise`,
);
