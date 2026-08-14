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
const budgets = selftest
  ? BUDGETS.map((b) => (b.key === "PHASE_ART_MB" ? { ...b, limit: b.limit + 7 } : b))
  : BUDGETS;

const doc = fs.readFileSync(DOC, "utf8");
const pkgScripts = JSON.parse(fs.readFileSync(path.join(R, "package.json"), "utf8")).scripts ?? {};
const ci = fs.readFileSync(CI, "utf8");

// ── 1 + 2 + 4 · every budget is quoted, enforced, and honest about how ──────
for (const b of budgets) {
  if (!doc.includes(String(b.limit))) {
    fail(`${b.key}: the guard document never mentions ${b.limit} — docs/PERF_WAECHTER.md and perfBudget.ts disagree`);
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
if (dead.length > deadLimit) {
  fail(
    `${dead.length} painted stems are loaded by nothing, over the ceiling of ${deadLimit}. ` +
      `Art may land before its wiring — the pile may not grow unnoticed. Wire it, delete it, or raise the ceiling WITH a reason.`,
  );
}

// The selftest bent PHASE_ART_MB out of step with the guard document on
// purpose. It passes when — and only when — that specific budget was named.
// (House convention, check-ci-gates.mjs: a selftest EXITS 0 when it has seen
// its own red light. Anything else fails the CI step that runs it.)
if (selftest) {
  const sawIt = reported.some((m) => m.startsWith("PHASE_ART_MB:"));
  if (sawIt) {
    console.log(`check-perf-budget SELFTEST: OK — the red light works (${failures} failure(s) for a budget bent on purpose)`);
    process.exit(0);
  }
  console.error("✗ SELFTEST FAILED: PHASE_ART_MB was bent out of step with the guard document and this check stayed silent about it");
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
