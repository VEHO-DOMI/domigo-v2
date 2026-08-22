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

// ── R5-W7 · W6 · R183 · ZWEI GLEICHE BAU-COMMITS SIND KEINE VORHER/NACHHER ──
//
// `perf-visible` schrieb in seinen Beipackzettel den HEAD des SKRIPT-Verzeichnisses
// und nannte ihn `commit`. B5s und D4s Vorher/Nachher-JSON trugen deshalb
// DENSELBEN Hash, obwohl zwischen beiden Messungen gemergt worden war — eine
// Vorher/Nachher-Tabelle, deren zwei Hälften nachweislich am selben Bau
// gemessen wurden, sagt über die Änderung nichts. Das Werkzeug sagt jetzt, WAS
// es gemessen hat; hier wird der Satz gelesen.
//
// Die Zeile, die `perf-visible` druckt und die in den PR gehört:
//     Bau: <commit oder Label> · Quelle: <woher die Angabe kommt>
//
// GEPRÜFT WIRD DIE BEHAUPTUNG, NICHT IHR FEHLEN — heute. Zwei oder mehr
// Bau-Zeilen mit demselben Wert sind ROT. Fehlt die Zeile ganz, ist das eine
// gedruckte ANMERKUNG und kein rotes Licht: der Zwang gehört in denselben PR
// wie das Rezept in jeder Bahn, sonst färbt dieses Tor die PRs fremder Bahnen
// rot für etwas, das ihr Rezept noch gar nicht kennt (Register D-514).
const BUILD_LINE = /^\s*Bau:\s*([^\n·]+?)\s*(?:·|$)/gim;

/** Die Bau-Angaben aus einem PR-Text, in der Reihenfolge ihres Auftretens. */
export const buildStamps = (body) => {
  const out = [];
  for (const m of String(body).matchAll(BUILD_LINE)) out.push(m[1].trim());
  return out;
};

/** Das Urteil über die Provenienz. Rein, damit der Selbsttest beide
 *  Richtungen sehen kann. */
export const provenanceVerdict = (body) => {
  const stamps = buildStamps(body);
  if (stamps.length === 0) return { ok: true, stamps, note: "keine Bau-Angabe im PR-Text — dieser PR kann nicht sagen, welche zwei Bauten die Tabelle vergleicht (R183). Rezept: docs/PERF_WAECHTER.md" };
  if (stamps.length === 1) return { ok: true, stamps, note: `nur EINE Bau-Angabe (${stamps[0]}) — vorher und nachher sind daran nicht zu unterscheiden` };
  const einzig = new Set(stamps.map((x) => x.toLowerCase()));
  if (einzig.size === 1) {
    return {
      ok: false,
      stamps,
      note: `alle ${stamps.length} Bau-Angaben sind IDENTISCH (${stamps[0]}) — vorher und nachher wurden am `
        + "SELBEN Bau gemessen. Die Tabelle vergleicht dann diesen Lauf mit jenem Lauf, nicht die Änderung "
        + "mit ihrem Vorzustand (R183, gemessen an B5 und D4).",
    };
  }
  return { ok: true, stamps, note: `${einzig.size} verschiedene Bau-Angaben — vorher und nachher sind unterscheidbar` };
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
  // ── R5-W7 · W6 · R183 · die Provenienz, beide Richtungen ─────────────────
  const P = [
    ["zwei GLEICHE Bau-Commits (der B5/D4-Fall)",
      "Bau: 0d50d10a1 · Quelle: --worktree x\n…\nBau: 0d50d10a1 · Quelle: --worktree x", false],
    ["zwei VERSCHIEDENE Bau-Commits",
      "Bau: 0d50d10a1 · Quelle: /api/version\n…\nBau: 66b02b414 · Quelle: /api/version", true],
    ["drei Angaben, alle gleich", "Bau: abc · Quelle: q\nBau: abc · Quelle: q\nBau: abc · Quelle: q", false],
    ["gar keine Bau-Angabe — Anmerkung, kein rotes Licht", "Ich habe etwas geändert.", true],
    ["nur eine Angabe — Anmerkung, kein rotes Licht", "Bau: abc · Quelle: --build-label", true],
    ["Gross-/Kleinschreibung trennt nicht zwei Bauten",
      "Bau: ABC123 · Quelle: q\nBau: abc123 · Quelle: q", false],
  ];
  for (const [name, body, wantOk] of P) {
    const v = provenanceVerdict(body);
    const ok = v.ok === wantOk;
    if (!ok) bad++;
    console.log(`${ok ? "✓" : "✗"} ${name}: ok=${v.ok}, erwartet=${wantOk} — ${v.note}`);
  }

  if (bad > 0) {
    console.error("✗ check-perf-table selftest: the detector does not discriminate");
    process.exit(1);
  }
  console.log("✓ selftest: the detector tells a filled table from a blank one and from a missing row; "
    + "und zwei identische Bau-Angaben werden als das erkannt, was sie sind (R183).");
  process.exit(0);
}

const body = process.env.PR_BODY ?? "";
const changed = (process.env.CHANGED_FILES ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

// ── R5-W7 · W6 · DIE LEERE LISTE IST KEINE UNSCHULD ─────────────────────────
// Bis hierher hiess eine leere Dateiliste »kein pull_request-Lauf, nichts zu
// tun« — Exit 0. Der W6-Tamper (R187d, Lauf 32556081051) hat gemessen, dass das
// Tor HEUTE wirklich misst: `origin/main` steht auf dem Runner, die Drei-Punkt-
// Basis ist exakt dieser Commit, die Liste kam mit zwei Dateien an. Aber der
// Weg dorthin ist eine Zeile Shell in ci.yml, und ein einziges `|| true` an
// ihrem `git diff` machte aus einem roten Tor ein gruenes, das nichts geprueft
// hat. Wenn die Umgebung sagt, dass dies ein PR-Lauf IST, ist eine leere Liste
// deshalb rot: ein PR ohne eine einzige geaenderte Datei gibt es nicht.
const istPrLauf = process.env.GITHUB_EVENT_NAME === "pull_request";
if (changed.length === 0) {
  if (istPrLauf) {
    console.error("✗ check-perf-table: die Liste der geaenderten Dateien ist LEER, obwohl dies ein\n"
      + "   pull_request-Lauf ist. Einen PR ohne eine einzige geaenderte Datei gibt es nicht — also hat\n"
      + "   der Schritt, der die Liste baut, nichts geliefert (ci.yml: `git diff --name-only\n"
      + "   origin/$BASE...HEAD`), und dieses Tor wuerde gruen melden, ohne etwas geprueft zu haben.\n"
      + "   Erst die Liste reparieren, dann dem gruenen Licht glauben (W5/D-455, W6/R187d).");
    process.exit(1);
  }
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
// ── R5-W7 · W6 · R183 · und WELCHE zwei Bauten vergleicht die Tabelle? ──────
const prov = provenanceVerdict(body);
if (!prov.ok) {
  console.error(`✗ ${prov.note}\n`
    + `   Gefundene Bau-Angaben: ${prov.stamps.join(" | ")}\n`
    + "   Rezept: docs/PERF_WAECHTER.md — der Dev-Server wird mit VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD)\n"
    + "   gestartet, dann schreibt scripts/perf-visible.mjs die Zeile »Bau: … · Quelle: …« selbst.");
  process.exit(1);
}
console.log(`  ℹ Provenienz: ${prov.note}`);
console.log(`check-perf-table: OK — ${touched.length} betroffene Datei(en), Tabelle ausgefüllt.`);
