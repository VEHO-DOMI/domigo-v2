#!/usr/bin/env node
// R5-W2 · E2 · THE GATE THAT GUARDS THE GATES.
//
// Twice now, two sessions found INDEPENDENTLY that a standing gate was green
// on a laptop and absent from CI: check-composition.mjs said in its own header
// that it was "Teil der Standing Gates" while no workflow ever ran it, and
// check-paint-copy.mjs shipped with a package.json script and no CI line. A
// gate nobody runs is not a gate, it is a comment — and the failure is silent
// in the worst possible way, because every local run is green.
//
// So the rule stops being a habit and becomes a check: every scripts/check-*.mjs
// on disk must be reachable from .github/workflows/ci.yml — either by its own
// filename, or through a package.json script that CI invokes. Anything that is
// deliberately not a CI gate says so out loud, here, with a reason.
//
// Run: node scripts/check-ci-gates.mjs            (exit 1 on any gap)
//      node scripts/check-ci-gates.mjs --selftest (proves the red light works)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const CI = path.join(R, ".github/workflows/ci.yml");
const SCRIPTS = path.join(R, "scripts");
const PKG = path.join(R, "package.json");

/** Scripts that are deliberately NOT CI gates. Reason is mandatory. */
const NOT_A_GATE = {
  "check-level-candidate.mjs":
    "authoring harness — takes a candidate phase file as an argument and swaps it into ch01; there is nothing for CI to run",
};

const selftest = process.argv.includes("--selftest");

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`✗ ${msg}`);
};

const ci = fs.readFileSync(CI, "utf8");
const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const pkgScripts = pkg.scripts ?? {};

// Which package.json scripts does CI actually invoke? (`- run: pnpm <name>`)
const invoked = new Set();
for (const m of ci.matchAll(/^\s*-\s*run:\s*pnpm\s+([A-Za-z0-9:_-]+)/gm)) invoked.add(m[1]);

const gates = fs
  .readdirSync(SCRIPTS)
  .filter((f) => f.startsWith("check-") && f.endsWith(".mjs"))
  .sort();

// SELFTEST: pretend one real gate vanished from CI and prove we notice.
const ciText = selftest ? ci.replace("scripts/check-paint-art.mjs", "scripts/__selftest-removed.mjs") : ci;
const invokedText = selftest ? new Set([...invoked].filter((n) => n !== "check:paint-art")) : invoked;

const covered = (file) => {
  if (ciText.includes(`scripts/${file}`)) return "direkt";
  // …or via a package.json script that CI runs
  for (const name of invokedText) {
    const cmd = pkgScripts[name];
    if (typeof cmd === "string" && cmd.includes(`scripts/${file}`)) return `pnpm ${name}`;
  }
  return null;
};

const rows = [];
for (const file of gates) {
  const excuse = NOT_A_GATE[file];
  const how = covered(file);
  if (excuse !== undefined) {
    if (how !== null) fail(`${file} is listed as NOT_A_GATE but CI runs it anyway (${how}) — remove its entry`);
    else rows.push(`  – ${file} — bewusst kein CI-Tor: ${excuse}`);
    continue;
  }
  if (how === null) {
    fail(`${file} is a gate on disk but NOTHING in .github/workflows/ci.yml runs it — wire it in, or list it in NOT_A_GATE with a reason`);
  } else {
    rows.push(`  ✓ ${file} — ${how}`);
  }
}

// The same rule from the other end: a check: script in package.json that CI never calls.
for (const [name, cmd] of Object.entries(pkgScripts)) {
  if (!name.startsWith("check:")) continue;
  if (invokedText.has(name)) continue;
  const m = /scripts\/([a-z0-9-]+\.mjs)/.exec(String(cmd));
  const file = m?.[1];
  if (file !== undefined && ciText.includes(`scripts/${file}`)) continue; // CI calls the file directly
  fail(`package.json defines "${name}" but CI never runs it (neither as \`pnpm ${name}\` nor by its script path)`);
}

if (selftest) {
  if (failures > 0) {
    console.log(`check-ci-gates SELFTEST: OK — the red light works (${failures} gap(s) reported for a gate removed on purpose)`);
    process.exit(0);
  }
  console.error("✗ SELFTEST FAILED: a gate was removed from CI on purpose and this check stayed green");
  process.exit(1);
}

console.log(rows.join("\n"));
if (failures > 0) {
  console.error(`\ncheck-ci-gates: ${failures} gate(s) not wired into CI`);
  process.exit(1);
}
console.log(`\ncheck-ci-gates: OK — alle ${gates.length - Object.keys(NOT_A_GATE).length} Tore laufen in CI`);
