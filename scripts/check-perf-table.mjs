#!/usr/bin/env node
// R5-W3 · E5 · KEIN PR OHNE DIE WÄCHTER-TABELLE.
//
// docs/PERF_WAECHTER.md §1 says it plainly: every session that touches
// rendering, assets, entities or the card DOM writes the ?perf=1 numbers for
// all five phases, before and after, into its PR. That was a sentence in a
// document, which means it held exactly as long as everyone remembered it.
//
// This turns it into a check. It runs ONLY in the pull_request context, where
// GitHub hands us the PR body and the changed files; everywhere else it exits 0
// and says why, so nobody has to special-case it locally.
//
// Inputs (set by the workflow):
//   PR_BODY        the pull request description
//   CHANGED_FILES  newline-separated list of paths in the PR
//
// Run: node scripts/check-perf-table.mjs
//      node scripts/check-perf-table.mjs --selftest  (proves the red light works)

const WATCHED = [
  /^packages\/game-paint\//,
  /^packages\/game-2d\//,
  /^packages\/game-core\//,
  /^apps\/web\/public\/art\//,
  /^apps\/web\/app\/\(game\)\//,
];

/** The table is present if every phase has a row and a number lands in it. */
const looksLikeTheTable = (body) => {
  const phases = ["p1", "p2", "p3", "p4", "p9"];
  const rows = body.split("\n").filter((l) => l.trim().startsWith("|"));
  return phases.every((p) => {
    const row = rows.find((l) => new RegExp(`\\|\\s*${p}\\b`).test(l));
    // a row with nothing but pipes and whitespace is the template, not a measurement
    return row !== undefined && /\d/.test(row.replace(new RegExp(p, "g"), ""));
  });
};

const selftest = process.argv.includes("--selftest");

if (selftest) {
  const filled = [
    "| Phase | laden | bau+aufbau | Erstbild | eingeschwungen | fps |",
    "| p1 vorher / nachher | 2719 | 462 | 11.7 | 1.9 | 60 |",
    "| p2 vorher / nachher | 2768 | 427 | 11.7 | 1.9 | 60 |",
    "| p3 vorher / nachher | 2265 | 330 | 11.7 | 1.9 | 60 |",
    "| p4 vorher / nachher | 2603 | 127 | 11.7 | 1.9 | 60 |",
    "| p9 vorher / nachher | 1712 | 193 | 11.7 | 1.9 | 60 |",
  ].join("\n");
  const empty = filled.replace(/\d+(\.\d+)?/g, " ").replace(/p(\d) /g, "p$1 ");
  const missingOneRow = filled.split("\n").filter((l) => !l.includes("| p3")).join("\n");

  const cases = [
    ["a filled table", filled, true],
    ["the blank template", empty, false],
    ["a table missing p3", missingOneRow, false],
    ["no table at all", "Ich habe ein bisschen was geändert.", false],
  ];
  let bad = 0;
  for (const [name, body, want] of cases) {
    const got = looksLikeTheTable(body);
    const ok = got === want;
    if (!ok) bad++;
    console.log(`${ok ? "✓" : "✗"} ${name}: erkannt=${got}, erwartet=${want}`);
  }
  if (bad > 0) {
    console.error("✗ check-perf-table selftest: the detector does not discriminate");
    process.exit(1);
  }
  console.log("✓ selftest: the detector tells a filled table from a blank one and from a missing row.");
  process.exit(0);
}

const body = process.env.PR_BODY ?? "";
const changed = (process.env.CHANGED_FILES ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

if (changed.length === 0) {
  console.log("check-perf-table: no changed-file list (not a pull_request run) — nothing to police.");
  process.exit(0);
}

const touched = changed.filter((f) => WATCHED.some((re) => re.test(f)));
if (touched.length === 0) {
  console.log(`check-perf-table: OK — this PR touches no rendering, asset, entity or card path (${changed.length} files).`);
  process.exit(0);
}

if (!looksLikeTheTable(body)) {
  console.error(
    "✗ Dieser PR fasst Rendering/Assets/Entities/Karten an, trägt aber keine ausgefüllte PERF-WÄCHTER-Tabelle.\n" +
      `   Betroffen (${touched.length}): ${touched.slice(0, 8).join(", ")}${touched.length > 8 ? " …" : ""}\n` +
      "   Vorlage: .github/pull_request_template.md · Regel und Messrezept: docs/PERF_WAECHTER.md\n" +
      "   Kokis Regel dahinter: Performance ist paramount — eine Änderung am Bild ohne ihre Zahlen\n" +
      "   ist eine Änderung, deren Preis niemand kennt.",
  );
  process.exit(1);
}
console.log(`check-perf-table: OK — ${touched.length} betroffene Datei(en), Tabelle ausgefüllt.`);
