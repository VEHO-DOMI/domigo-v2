#!/usr/bin/env node
// R5-W3 · E5 · THE PERF BUDGETS ARE A MACHINE, NOT A MEMO.
//
// Koki's rule is that performance is paramount, and it lived in a document in
// iCloud. E2 already paid for that shape once: two gates claimed in their own
// file headers to be standing gates while no workflow ran them, and every local
// run was green. A rule nobody can execute is a habit.
//
// So this checks four things, and every one of them can go red:
//   1. every budget declared in perfBudget.ts appears, with its number, in the
//      guard document — the doc and the code cannot drift apart
//   2. every budget names a file that exists and that actually mentions it —
//      no ceiling may be decorative
//   3. the statically derivable budgets are RE-DERIVED here from the repo, so
//      the number is checked against reality and not just against itself
//   4. every budget declares HOW it is enforced, and the ones that claim "ci"
//      really are reachable from CI
//
// Run: node scripts/check-perf-budget.mjs            (exit 1 on any failure)
//      node scripts/check-perf-budget.mjs --selftest (proves the red light works)

import fs from "node:fs";
import path from "node:path";
import { BUDGETS } from "../packages/game-paint/src/perfBudget.ts";
import { allScopePhases, domArtStems, phaseArtScope } from "../packages/game-paint/src/artScope.ts";

const R = process.cwd();
const DOC = path.join(R, "docs/PERF_WAECHTER.md");
const CI = path.join(R, ".github/workflows/ci.yml");
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const CONTENT = path.join(R, "content/corpus/stories");
const MB = 1048576;

const selftest = process.argv.includes("--selftest");
let failures = 0;
const reported = [];
const fail = (msg) => {
  failures++;
  reported.push(msg);
  console.error(`✗ ${msg}`);
};

// SELFTEST: bend one budget out of step with the document and prove we notice.
// (A tamper that changes nothing has proven nothing — so the bent value is the
// one the document quotes, and the checker must name exactly that budget.)
//
// R5-W4b · W3 · ZWEITER BIEGE-FALL (R90). Der erste bog ein Budget gegen das
// DOKUMENT — er beweist die Zitat-Prüfung, nicht den Vergleich mit der Wirklichkeit.
// Für die Tot-Kunst-Decke ist aber genau der Vergleich das Gesetz. Also wird sie um
// EINS gesenkt: dann liegt der wirklich gemessene Stapel um ein Blatt darüber, und
// `dead.length > deadLimit` MUSS anschlagen. Ein Selbsttest, der nur die eine Hälfte
// des Tores kitzelt, lässt die andere blind.
const budgets = selftest
  ? BUDGETS.map((b) => {
    if (b.key === "PHASE_ART_MB") return { ...b, limit: b.limit + 7 };
    if (b.key === "DEAD_ART_CEILING") return { ...b, limit: b.limit - 1 };
    return b;
  })
  : BUDGETS;

const doc = fs.readFileSync(DOC, "utf8");
const pkgScripts = JSON.parse(fs.readFileSync(path.join(R, "package.json"), "utf8")).scripts ?? {};
const ci = fs.readFileSync(CI, "utf8");

/**
 * R5-W4b · W3 — WARUM DAS HIER KEIN `includes` MEHR IST.
 *
 * Diese Prüfung stand als `doc.includes(String(b.limit))`: die Ziffernfolge musste
 * IRGENDWO im Dokument vorkommen. Beim Senken der Tot-Kunst-Decke ist aufgefallen,
 * was das wert ist — `PERF_WAECHTER.md` enthält den Text „(P-56/P-57)". Hätte ich die
 * Decke auf 57 gesetzt und die Tabellenzeile vergessen, wäre `doc.includes("57")`
 * über den Fallen-Namen P-57 wahr gewesen und dieses Tor GRÜN geblieben, während Code
 * und Dokument auseinanderlaufen. Dasselbe gilt für 53, 56, 59 und 60.
 *
 * Die Zahl muss jetzt dort stehen, wo sie etwas bedeutet: als Grenzwert in der
 * Budget-Tabelle, hinter dem `≤`. Alle sieben Budgets stehen dort so.
 */
const quotedAsLimit = (text, limit) => new RegExp(`≤\\s*${limit}\\b`).test(text);

// ── 1 + 2 + 4 · every budget is quoted, enforced, and honest about how ──────
for (const b of budgets) {
  if (!quotedAsLimit(doc, b.limit)) {
    fail(`${b.key}: the guard document never quotes ≤ ${b.limit} as a limit — `
      + "docs/PERF_WAECHTER.md and perfBudget.ts disagree (die Ziffern irgendwo im Text zählen nicht)");
  }
  const abs = path.join(R, b.enforcedIn);
  if (!fs.existsSync(abs)) {
    fail(`${b.key}: names ${b.enforcedIn} as its enforcer, which does not exist`);
    continue;
  }
  const text = fs.readFileSync(abs, "utf8");
  if (b.enforcedIn.endsWith(".md")) {
    if (!text.includes(String(b.limit))) fail(`${b.key}: ${b.enforcedIn} does not carry the number ${b.limit}`);
  } else if (!text.includes(b.key)) {
    fail(`${b.key}: ${b.enforcedIn} never reads it — a ceiling nothing consults is decoration`);
  }
  if (b.because.trim().length < 40) {
    fail(`${b.key}: every ceiling states its evidence; this one's \`because\` is too thin to be one`);
  }
  if (b.enforcement === "ci") {
    // reachable directly by path, through a package.json script CI invokes, or
    // as a test file (`pnpm test` runs the whole workspace) — the same three
    // routes check-ci-gates.mjs already recognises
    const file = path.basename(b.enforcedIn);
    const viaScript = Object.entries(pkgScripts).some(
      ([name, cmd]) => cmd.includes(file) && ci.includes(`pnpm ${name}`),
    );
    const reachable = ci.includes(file) || viaScript || file.endsWith(".test.ts");
    if (!reachable) fail(`${b.key}: claims enforcement "ci" but ${b.enforcedIn} is not reachable from ci.yml`);
  }
}

// ── 3 · re-derive the static budgets from the repository itself ─────────────
const present = new Set();
const fileOf = new Map();
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) {
      const stem = e.name.replace(/\.png$/, "");
      present.add(stem);
      fileOf.set(stem, path.join(dir, e.name));
    }
  }
};
walk(ART_ROOT);

const levels = [];
for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
  const paintDir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(paintDir)) continue;
  for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
    const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8"));
    if (level.draft !== true) levels.push({ file: f, level });
  }
}

const phaseMbLimit = budgets.find((b) => b.key === "PHASE_ART_MB")?.limit ?? Infinity;
const worst = { id: "—", mb: 0 };
for (const { level } of levels) {
  for (const ph of allScopePhases(level)) {
    let bytes = 0;
    for (const s of phaseArtScope(level, ph.id, present)) {
      const f = fileOf.get(s);
      if (f !== undefined) bytes += fs.statSync(f).size;
    }
    const mb = bytes / MB;
    if (mb > worst.mb) {
      worst.mb = mb;
      worst.id = ph.id;
    }
    if (mb > phaseMbLimit) fail(`phase ${ph.id} loads ${mb.toFixed(1)} MB of art, over the ${phaseMbLimit} MB ceiling`);
  }
}

const deadLimit = budgets.find((b) => b.key === "DEAD_ART_CEILING")?.limit ?? Infinity;
const claimed = new Set();
for (const { level } of levels) {
  for (const ph of allScopePhases(level)) for (const s of phaseArtScope(level, ph.id, present)) claimed.add(s);
  for (const s of domArtStems(level)) claimed.add(s);
}
const dead = [...present].filter((s) => !claimed.has(s));
// R90 · W3: die Decke gehört EINEM Eigentümer und steht auf dem Messwert, ohne Luft.
// Luft ist der Defekt, den D-193 beschreibt: eine Decke ÜBER der Wirklichkeit verliert
// genau die Warnung, für die sie gebaut wurde. Sie wird deshalb bei jedem Lauf
// AUSGESPROCHEN — wer Kunst verdrahtet oder löscht, sieht sofort, dass er die Decke im
// selben PR nachziehen muss. (Hart rot wird die Luft NICHT: zwischen dem Merge einer
// löschenden Bahn und dem Nachziehen der Decke wäre main sonst rot. Der Vorschlag,
// daraus eine Ratsche zu machen, liegt als D-253 bei der Perf-Spur.)
if (dead.length < deadLimit) {
  console.warn(`⚠ die Tot-Kunst-Decke hat ${deadLimit - dead.length} Blatt/Blätter Luft `
    + `(Decke ${deadLimit}, gemessen ${dead.length}) — R90: auf den Messwert senken, im selben PR.`);
}
if (dead.length > deadLimit) {
  fail(
    `${dead.length} painted stems are loaded by nothing, over the ceiling of ${deadLimit}. ` +
      `Art may land before its wiring — the pile may not grow unnoticed. Wire it, delete it, or raise the ceiling WITH a reason.`,
  );
}

// The selftest bent TWO budgets on purpose, in two different directions, and it
// passes only when BOTH red lights were seen — the quote check (PHASE_ART_MB against
// the guard document) and the reality check (DEAD_ART_CEILING against the pile that
// is actually on disk). (House convention, check-ci-gates.mjs: a selftest EXITS 0
// when it has seen its own red light. Anything else fails the CI step that runs it.)
if (selftest) {
  const sawQuote = reported.some((m) => m.startsWith("PHASE_ART_MB:"));
  const sawDead = reported.some((m) => m.includes("painted stems are loaded by nothing"));
  if (sawQuote && sawDead) {
    console.log(`check-perf-budget SELFTEST: OK — beide roten Lichter brennen (${failures} failure(s): `
      + "ein Budget gegen das Dokument verstellt, die Tot-Kunst-Decke unter den echten Stapel gesenkt)");
    process.exit(0);
  }
  if (!sawQuote) {
    console.error("✗ SELFTEST FAILED: PHASE_ART_MB was bent out of step with the guard document and this check stayed silent about it");
  }
  if (!sawDead) {
    console.error("✗ SELFTEST FAILED: die Tot-Kunst-Decke wurde unter den wirklich gemessenen Stapel gesenkt "
      + "und dieses Tor hat nichts gesagt — der Vergleich mit der Wirklichkeit ist blind");
  }
  process.exit(1);
}

if (failures > 0) {
  console.error(`check-perf-budget: ${failures} failure(s)`);
  process.exit(1);
}
console.log(
  `check-perf-budget: OK — ${budgets.length} budgets, all quoted in the guard and enforced somewhere. ` +
    `Heaviest phase ${worst.id} at ${worst.mb.toFixed(1)}/${phaseMbLimit} MB · dead art ${dead.length}/${deadLimit} stems.`,
);
