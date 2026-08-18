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
// ── R5-W5 · W4 · D-257: PRESENT IN CI IS NOT THE SAME AS RUNNING ────────────
//
// The law above was satisfied by a SUBSTRING. `covered()` asked whether the
// string `scripts/<file>` appeared anywhere in ci.yml and said "verdrahtet" the
// moment it did — so a line that runs nothing but `--selftest` counted as a
// wired gate. W3 found six of them: measure-presence, frame-sink, measure-motion,
// measure-veil, check-png-identity and shoot-card-bench proved their own red
// light on every CI run and never looked at a single real file. Five of them
// need a browser, which CI has not got; one of them (check-png-identity) had no
// excuse at all.
//
// A self-test proves the INSTRUMENT. Only a real run proves the WORK. This file
// now tells the two apart and demands one of three things per script:
//   · a real run in ci.yml, or
//   · an entry in SELFTEST_ONLY („Werkzeug, kein Tor") with a reason, or
//   · an entry in NOT_A_GATE, for a gate CI does not mention at all.
// And every declaration is checked against reality: one that is no longer
// needed goes STALE and turns this check red, the same ratchet SEAM_ALLOW
// carries. An exception may tolerate a known gap; it may never outlive it.
//
// Run: node scripts/check-ci-gates.mjs            (exit 1 on any gap)
//      node scripts/check-ci-gates.mjs --selftest (proves the red light works)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const CI = path.join(R, ".github/workflows/ci.yml");
const SCRIPTS = path.join(R, "scripts");
const PKG = path.join(R, "package.json");

/** Scripts that are deliberately NOT CI gates at all. Reason is mandatory. */
const NOT_A_GATE = {
  "check-level-candidate.mjs":
    "authoring harness — takes a candidate phase file as an argument and swaps it into ch01; there is nothing for CI to run",
};

/** D-257 · „Werkzeug, kein Tor": scripts whose CI line is deliberately only
 *  `--selftest`. The self-test keeps the INSTRUMENT honest; the real run needs
 *  something CI has not got (a browser, a screen, a live dev server) and
 *  therefore belongs in a session, next to the pictures it produces.
 *
 *  Reason is mandatory, and the entry is checked BOTH ways: a script that is
 *  not in ci.yml at all, or one that turns out to have a real run after all,
 *  is reported as STALE. */
const SELFTEST_ONLY = {
  "measure-presence.mjs":
    "misst Kontrast an einem SCHIRM-Bild (Chrome + Dev-Server); der Selbsttest sichert das Werkzeug, der Lauf gehört in die Session",
  "frame-sink.mjs":
    "nimmt Bilder aus einem laufenden Browser entgegen; ohne Chrome gibt es nichts entgegenzunehmen — der Selbsttest beweist, dass die Kamera lebt",
  "measure-motion.mjs":
    "misst eine BILDREIHE, die shoot-world.mjs erst aus einem sichtbaren Chrome schießt; der Selbsttest prüft die Rechnung an synthetischen Bildern",
  "measure-veil.mjs":
    "misst, wie dunkel die Welt hinter einer offenen Karte ist — dafür muss die Karte offen sein, also braucht es das laufende Spiel",
  "shoot-card-bench.mjs":
    "startet einen eigenen Chrome und fotografiert die Kartenbank; der Selbsttest prüft die Ausschnitt-Rechnung (D-102) ohne Browser",
  // E6/R115 (beim Post-Zug-Merge dazugekommen): E6 hat sein Rezept-Skript als
  // sechstes Werkzeug angehaengt. Wortlaut aus E6s eigener ci.yml-Zeile.
  "perf-visible.mjs":
    "misst die Perf-Tabelle aus SICHTBAREM Chrome gegen einen laufenden Server — in CI laeuft kein Chrome; der Selbsttest prueft nur, dass die Kontrollschwelle (Kontrollseite unter 58 fps ⇒ Abbruch) ihr rotes Licht erreichen kann",
  "shoot-world.mjs":
    "schießt Bildreihen aus einem eigenen Chrome gegen einen laufenden Dev-Server; der Selbsttest prüft ohne Browser, was ohne Browser prüfbar ist — die Kampf-Abtastrate gegen die Takt-Konstanten aus entities.ts und den Beipackzettel (D-259)",
};

const selftest = process.argv.includes("--selftest");

const ciOnDisk = fs.readFileSync(CI, "utf8");
const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const pkgScripts = pkg.scripts ?? {};

const gatesOnDisk = fs
  .readdirSync(SCRIPTS)
  .filter((f) => f.startsWith("check-") && f.endsWith(".mjs"))
  .sort();

/** Every `scripts/<file>` mention in a blob of shell/YAML, split by whether
 *  that particular invocation carries `--selftest`. Line by line on purpose:
 *  the perf-contract job runs its real check inside a `run: |` block, one
 *  command per line, and a whole-file regex would lose which is which. */
const SCRIPT_REF = /scripts\/([A-Za-z0-9._-]+\.(?:mjs|ts))/g;

const scanUsage = (ciText, invoked) => {
  const usage = new Map(); // file -> { real: n, selftest: n, how: string }
  const note = (file, isSelftest, how) => {
    const u = usage.get(file) ?? { real: 0, selftest: 0, how };
    if (isSelftest) u.selftest++;
    else u.real++;
    usage.set(file, u);
  };
  for (const line of ciText.split("\n")) {
    for (const m of line.matchAll(SCRIPT_REF)) note(m[1], line.includes("--selftest"), "direkt");
  }
  // …and the same again through package.json, for the scripts CI runs as `pnpm <name>`.
  for (const name of invoked) {
    const cmd = pkgScripts[name];
    if (typeof cmd !== "string") continue;
    for (const m of cmd.matchAll(SCRIPT_REF)) note(m[1], cmd.includes("--selftest"), `pnpm ${name}`);
  }
  return usage;
};

/** Which package.json scripts does CI actually invoke? (`- run: pnpm <name>`) */
const scanInvoked = (ciText) => {
  const invoked = new Set();
  for (const m of ciText.matchAll(/^\s*-?\s*run:\s*pnpm\s+([A-Za-z0-9:_-]+)/gm)) invoked.add(m[1]);
  return invoked;
};

/**
 * The whole judgement, as a pure function of (ci.yml text, the gates on disk,
 * the two declaration lists). Pure so the self-test can hand it a TAMPERED
 * ci.yml — the real one, with one line taken out — instead of a made-up
 * configuration. P-71: tamper against the measurement, never against the config.
 */
export const analyse = ({ ciText, gates, notAGate, selftestOnly }) => {
  const failures = [];
  const rows = [];
  const fail = (msg) => failures.push(msg);

  const invoked = scanInvoked(ciText);
  const usage = scanUsage(ciText, invoked);

  // ── Gesetz 1 · every gate on disk is reachable from CI ─────────────────────
  for (const file of gates) {
    const excuse = notAGate[file];
    const u = usage.get(file);
    if (excuse !== undefined) {
      if (u !== undefined) {
        fail(`${file} steht in NOT_A_GATE, aber CI ruft es doch auf (${u.how}) — Eintrag entfernen`);
      } else {
        rows.push(`  – ${file} — bewusst kein CI-Tor: ${excuse}`);
      }
      continue;
    }
    if (u === undefined) {
      fail(`${file} ist ein Tor auf der Platte, aber NICHTS in .github/workflows/ci.yml ruft es auf `
        + "— verdrahten, oder mit Grund in NOT_A_GATE eintragen");
    }
  }

  // ── Gesetz 2 · D-257: a CI line that only self-tests is not a run ──────────
  for (const [file, u] of [...usage.entries()].sort()) {
    const excuse = selftestOnly[file];
    if (u.real > 0) {
      if (excuse !== undefined) continue; // stale — reported by Gesetz 3
      rows.push(`  ✓ ${file} — echter Lauf (${u.how})${u.selftest > 0 ? " + Selbsttest" : ""}`);
      continue;
    }
    if (excuse !== undefined) {
      rows.push(`  ○ ${file} — Werkzeug, kein Tor: ${excuse}`);
      continue;
    }
    fail(`${file} läuft in CI NUR als --selftest (${u.selftest}×) und nie an einer echten Datei `
      + "— einen echten Lauf verdrahten, oder mit Grund in SELFTEST_ONLY eintragen (D-257)");
  }

  // ── Gesetz 3 · keine schale Ausnahme ──────────────────────────────────────
  for (const [file, reason] of Object.entries(selftestOnly)) {
    const u = usage.get(file);
    if (u === undefined) {
      fail(`SELFTEST_ONLY nennt ${file}, aber ci.yml erwähnt die Datei überhaupt nicht `
        + "— Ausnahme SCHAL, Eintrag entfernen");
      continue;
    }
    if (u.real > 0) {
      fail(`SELFTEST_ONLY nennt ${file}, aber CI fährt inzwischen einen echten Lauf (${u.how}) `
        + "— Ausnahme SCHAL, Eintrag entfernen");
      continue;
    }
    if (!reason || reason.length < 20) fail(`SELFTEST_ONLY-Eintrag für ${file} braucht einen echten Grund`);
  }
  for (const file of Object.keys(notAGate)) {
    if (!gates.includes(file)) {
      fail(`NOT_A_GATE nennt ${file}, aber die Datei liegt nicht (mehr) in scripts/ — Eintrag SCHAL`);
    }
  }

  // ── Gesetz 4 · von der anderen Seite: ein check:-Skript, das CI nie ruft ───
  for (const [name, cmd] of Object.entries(pkgScripts)) {
    if (!name.startsWith("check:")) continue;
    if (invoked.has(name)) continue;
    const m = SCRIPT_REF.exec(String(cmd));
    SCRIPT_REF.lastIndex = 0;
    const file = m?.[1];
    if (file !== undefined && ciText.includes(`scripts/${file}`)) continue; // CI ruft die Datei direkt
    fail(`package.json definiert "${name}", aber CI ruft es nie auf `
      + `(weder als \`pnpm ${name}\` noch über seinen Skript-Pfad)`);
  }

  return { failures, rows };
};

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// Five cases, and the fifth is the one that matters most: the REAL, untampered
// configuration must come out GREEN. A self-test that only ever proves red
// lights cannot tell a working gate from one that fails on everything.
if (selftest) {
  const cases = [
    ["ein Tor verschwindet aus CI", () => analyse({
      ciText: ciOnDisk.replace(/scripts\/check-paint-art\.mjs/g, "scripts/__weg.mjs"),
      gates: gatesOnDisk, notAGate: NOT_A_GATE, selftestOnly: SELFTEST_ONLY,
    }), true],
    ["ein Tor läuft nur noch als Selbsttest (D-257)", () => analyse({
      // genau die Zeile herausnehmen, die diese Session verdrahtet hat
      ciText: ciOnDisk.split("\n").filter((l) => !(l.includes("scripts/check-png-identity.mjs") && !l.includes("--selftest"))).join("\n"),
      gates: gatesOnDisk, notAGate: NOT_A_GATE, selftestOnly: SELFTEST_ONLY,
    }), true],
    ["schale Ausnahme: das Werkzeug läuft doch echt", () => analyse({
      ciText: ciOnDisk, gates: gatesOnDisk, notAGate: NOT_A_GATE,
      selftestOnly: { ...SELFTEST_ONLY, "check-fonts.mjs": "erfunden, damit dieser Fall ein rotes Licht zeigt" },
    }), true],
    ["schale Ausnahme: ci.yml kennt die Datei gar nicht", () => analyse({
      ciText: ciOnDisk, gates: gatesOnDisk, notAGate: NOT_A_GATE,
      selftestOnly: { ...SELFTEST_ONLY, "gibt-es-nicht.mjs": "erfunden, damit dieser Fall ein rotes Licht zeigt" },
    }), true],
    ["NICHT-TAMPER: der echte Stand ist grün", () => analyse({
      ciText: ciOnDisk, gates: gatesOnDisk, notAGate: NOT_A_GATE, selftestOnly: SELFTEST_ONLY,
    }), false],
  ];
  let bad = 0;
  for (const [name, run, expectRed] of cases) {
    const { failures } = run();
    const red = failures.length > 0;
    if (red === expectRed) {
      console.log(`  ✓ ${name}${expectRed ? ` — rot (${failures.length})` : " — grün"}`);
    } else {
      bad++;
      console.error(expectRed
        ? `  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`
        : `  ✗ ${name} — der echte Stand ist rot: ${failures.join(" | ")}`);
    }
  }
  if (bad > 0) { console.error("check-ci-gates --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-ci-gates --selftest: OK — ${cases.length} Fälle, vier rote Lichter gesehen, der echte Stand grün`);
  process.exit(0);
}

const { failures, rows } = analyse({
  ciText: ciOnDisk, gates: gatesOnDisk, notAGate: NOT_A_GATE, selftestOnly: SELFTEST_ONLY,
});

console.log(rows.join("\n"));
for (const f of failures) console.error(`✗ ${f}`);
if (failures.length > 0) {
  console.error(`\ncheck-ci-gates: ${failures.length} Lücke(n)`);
  process.exit(1);
}
const real = rows.filter((r) => r.startsWith("  ✓")).length;
const tools = Object.keys(SELFTEST_ONLY).length;
console.log(`\ncheck-ci-gates: OK — ${real} Tore laufen in CI an echten Dateien · `
  + `${tools} Werkzeuge fahren dort bewusst nur ihren Selbsttest · `
  + `${Object.keys(NOT_A_GATE).length} Skript(e) sind bewusst kein CI-Tor`);
