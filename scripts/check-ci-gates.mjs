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
// ── R5-W7 · W6 · D-511: DAS TOR MUSS DIE DATEI OEFFNEN, UEBER DIE ES URTEILT ─
//
// Beim D-510-Fix machte ein UNZITIERTER Schritt-Name mit »: « die Datei fuer
// GitHub unlesbar: der Lauf war rot ohne Log, NULL Jobs starteten — und dieses
// Tor blieb gruen, weil es `ci.yml` nur ZEILENWEISE als Text liest. Das ist
// P-65 in neuem Gewand: ein Tor, das die Artefakt-Klasse, ueber die es urteilt,
// gar nicht oeffnet. Die Datei wird jetzt zusaetzlich als YAML GELADEN
// (Ladefehler = rot) und auf das Minimum geprueft, das GitHub braucht:
// mindestens ein Job, und jeder Job mit Schritten. Die zeilenweise Lesung
// BLEIBT — sie ist es, die Selbsttest-Zeile und echte Zeile auseinanderhaelt.
//
// ── R5-W7 · W6 · C10/R187c: DIE IMPORTEURE WAREN UNBEWACHT ──────────────────
//
// Das Gesetz »jeder `docs/art/import-batch-*.mjs` mit `--selftest` bekommt im
// selben PR seine ci.yml-Zeile« stand seit R187c im RAHMEN und wurde von
// NICHTS geprueft: dieses Tor liest ausschliesslich `scripts/check-*.mjs`.
// Auf main war es prompt verletzt. Die Menge wird jetzt gegen die Menge
// gehalten, in beide Richtungen — mit derselben Ratsche, die SEAM_ALLOW traegt:
// eine Ausnahme darf eine bekannte Luecke dulden, sie darf sie nie ueberleben.
//
// Run: node scripts/check-ci-gates.mjs            (exit 1 on any gap)
//      node scripts/check-ci-gates.mjs --selftest (proves the red light works)

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const R = process.cwd();
const CI = path.join(R, ".github/workflows/ci.yml");
const SCRIPTS = path.join(R, "scripts");
const ART = path.join(R, "docs/art");
const PKG = path.join(R, "package.json");

/** R5-W7 · W6 · C10/R187c · DIE EINZIGE ERLAUBTE LUECKE, DATIERT UND BENANNT.
 *
 *  Ein Importeur mit `--selftest` ohne ci.yml-Zeile ist ein Selbsttest, den
 *  niemand faehrt. Genau eine solche Luecke steht heute auf main offen, und sie
 *  gehoert einer anderen Bahn (A8, R187c) — diese Bahn traegt die Zeile nach.
 *  Die Ausnahme ist deshalb DEKLARIERT statt geduldet, und sie ist eine
 *  RATSCHE: sobald die Zeile da ist, wird der Eintrag SCHAL und faerbt dieses
 *  Tor rot, bis ihn jemand entfernt. Eine Ausnahme darf eine bekannte Luecke
 *  tolerieren; sie darf sie nie ueberleben. */
const IMPORTER_WITHOUT_CI_LINE = {
  "import-batch-as.mjs": {
    // ⚠ W6 hat den Selbsttest GEFAHREN, bevor sie diese Ausnahme geschrieben
    // hat — und dabei den eigentlichen Grund gefunden. Er liest ein
    // GELIEFERTES Blatt aus dem Codex-Labor:
    //     ✗ selftest cannot run: …/codex-art-lab/batch-as3/mass_edges_p1.png is missing
    // Der Ordner liegt auf diesem Rechner nicht (R204: das Labor des ersten Macs
    // ist verloren), und in CI liegt er per KONSTRUKTION nie (CP-15: Lieferungen
    // gehoeren nicht ins Repo). Eine ci.yml-Zeile fuer diesen Selbsttest waere
    // also nicht die Erfuellung von C10, sondern ein Schritt, der in JEDEM Lauf
    // rot ist.
    // Der Fix ist deshalb NICHT »Zeile anhaengen«, sondern »der Selbsttest baut
    // sich seine Fixture selbst« — genau den Weg ist `measure-residue` gegangen,
    // aus genau diesem Grund (siehe SELFTEST_ONLY dort). Das ist A8s Posten;
    // W6 fasst `import-batch-as.mjs` nicht an (Eigentums-Karte).
    //
    // ★ NACHTRAG, gleicher Tag: A8 hat denselben Befund UNABHAENGIG gemacht
    //   und ihn in #342 bereits behoben — der Selbsttest baut sein Pruefblatt
    //   jetzt aus acht angenommenen p1-Blaettern der Platte, die ci.yml-Zeile
    //   steht, A8s CI ist gruen. Dieser Eintrag ist damit eine Ausnahme mit
    //   bekanntem Verfallsdatum: beim Schluss-Rebase ueber A8 wird er SCHAL
    //   und faerbt dieses Tor rot, bis W6 ihn entfernt. Genau dafuer ist die
    //   Ratsche da — sie erinnert, statt dass jemand daran denken muss.
    reason: "der Selbsttest liest eine LIEFERUNG aus dem Codex-Labor (batch-as3/mass_edges_p1.png), die per CP-15 nie im Repo liegt und auf diesem Rechner seit R204 auch nicht mehr — eine ci.yml-Zeile waere in jedem Lauf rot. A8 baut die Fixture in den Selbsttest hinein (Muster: measure-residue), DANN kommt die Zeile. Gemessen von W6 am 22.08.: Exit 1, »selftest cannot run«",
    until: "2026-09-30",
  },
};

/** Ein Importeur HAT einen Selbsttest, wenn er das Flag WIRKLICH LIEST.
 *  Geprueft wird der AUFRUF, nie die Datei als Text: W5s Falle 2 — ein
 *  Selbsttest, der seine eigene Quelldatei liest, scheitert sonst an seiner
 *  eigenen Prosa, und hier waere der Fehler umgekehrt (ein Kommentar, der das
 *  Flag nur ERWAEHNT, wuerde eine ci.yml-Zeile verlangen, die nichts faehrt). */
const READS_SELFTEST_FLAG = /includes\(\s*["']--selftest["']\s*\)/;

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
  // R5-W6b · W5 · zwei neue Werkzeuge, und beide aus demselben Grund: was sie
  // messen, liegt nicht im Repo.
  "measure-residue.mjs":
    "vergleicht ein Bestands-Blatt mit einer LIEFERUNG aus dem Codex-Labor; die Lieferung liegt per Konstruktion nicht im Repo (CP-15), also gibt es in CI kein Paar zu messen. Der Selbsttest baut sich seines und prüft beide Richtungen: Gold und Kontur bleiben stumm, der Flicken wird gefunden",
  // R5-W7 · W6: die Chrome-Hygiene ist eine BIBLIOTHEK mit eigenem Selbsttest
  // (D-438 + W5-Falle 1). Ein »echter Lauf« hiesse: die Prozesstabelle lesen und
  // verwaiste EIGENE Chrome-Profile beenden — in CI laeuft kein Chrome, es gaebe
  // also nichts zu finden und nichts zu beenden, und ein Lauf, der per
  // Konstruktion nichts sieht, ist kein Beweis. Der Selbsttest dagegen prueft
  // genau das, was schiefgehen kann: dass fremde Browser NICHT als eigene
  // gezaehlt werden und dass die Suche sich nicht selbst findet (die
  // pgrep -f-Falle). Damit steigt diese Liste von 9 auf 10 — das ist ein NEUES
  // Werkzeug, kein umdeklariertes Tor.
  "chrome-hygiene.mjs":
    "liest die Prozesstabelle und raeumt verwaiste EIGENE Chrome-Profile weg; in CI laeuft kein Chrome, ein echter Lauf faende per Konstruktion nichts. Der Selbsttest prueft die Unterscheidung eigen/fremd an einer ECHTEN Prozesstabelle mit angehaengten Fremd-Zeilen",
  "art-recompress.mjs":
    "SCHREIBT PNGs (verlustfreie Nachverdichtung) — ein echter Lauf in CI würde die Arbeitskopie verändern und den Beweis von check-png-identity aushebeln. Der Selbsttest prüft die Doppellauf-Sperre (D-339) ohne eine Datei anzufassen",
};

const selftest = process.argv.includes("--selftest");
const TODAY = new Date().toISOString().slice(0, 10);

const ciOnDisk = fs.readFileSync(CI, "utf8");
const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const pkgScripts = pkg.scripts ?? {};

const gatesOnDisk = fs
  .readdirSync(SCRIPTS)
  .filter((f) => f.startsWith("check-") && f.endsWith(".mjs"))
  .sort();

/** Jeder `docs/art/import-batch-*.mjs` mit der Angabe, ob er das Selbsttest-
 *  Flag wirklich LIEST. Die Quelle wird einmal gelesen, damit der Selbsttest
 *  dieselbe Liste verfaelschen kann, die der echte Lauf beurteilt. */
const importersOnDisk = fs
  .readdirSync(ART)
  .filter((f) => f.startsWith("import-batch-") && f.endsWith(".mjs"))
  .sort()
  .map((file) => ({
    file,
    hasSelftest: READS_SELFTEST_FLAG.test(fs.readFileSync(path.join(ART, file), "utf8")),
  }));

/** Every `scripts/<file>` mention in a blob of shell/YAML, split by whether
 *  that particular invocation carries `--selftest`. Line by line on purpose:
 *  the perf-contract job runs its real check inside a `run: |` block, one
 *  command per line, and a whole-file regex would lose which is which. */
const SCRIPT_REF = /scripts\/([A-Za-z0-9._-]+\.(?:mjs|ts))/g;
/** dasselbe fuer die Importeure — eigener Ausdruck, damit ein `scripts/`-Pfad
 *  nie als Importeur und ein `docs/art/`-Pfad nie als Tor gezaehlt wird. */
const ART_REF = /docs\/art\/(import-batch-[A-Za-z0-9._-]*\.mjs)/g;

/** Welche Importeure ruft ci.yml auf, und faehrt die Zeile den Selbsttest?
 *  Zeilenweise, aus demselben Grund wie oben: eine Zeile ohne `--selftest` ist
 *  ein anderer Vorgang als eine mit. */
const scanImporterUsage = (ciText) => {
  const usage = new Map(); // datei -> { selftest: n, real: n }
  for (const line of ciText.split("\n")) {
    for (const m of line.matchAll(ART_REF)) {
      const u = usage.get(m[1]) ?? { selftest: 0, real: 0 };
      if (line.includes("--selftest")) u.selftest++; else u.real++;
      usage.set(m[1], u);
    }
  }
  return usage;
};

/** Laedt `ci.yml` als YAML und prueft das Minimum, das GitHub braucht.
 *  D-511: ein Ladefehler ist rot — bis heute blieb das Tor an einer Datei
 *  gruen, die GitHub gar nicht lesen konnte. */
export const yamlVerdict = (ciText) => {
  let doc;
  try {
    doc = yaml.load(ciText);
  } catch (e) {
    return [`.github/workflows/ci.yml ist KEIN gueltiges YAML (${e.message.split("\n")[0]}) `
      + "— GitHub startet dann NULL Jobs und der Lauf ist rot ohne Log (D-511)"];
  }
  const fehler = [];
  const jobs = doc?.jobs;
  if (jobs === null || jobs === undefined || typeof jobs !== "object" || Object.keys(jobs).length === 0) {
    fehler.push("ci.yml laedt, nennt aber KEINEN einzigen Job — jeder Lauf waere leer und trotzdem gruen");
    return fehler;
  }
  for (const [name, job] of Object.entries(jobs)) {
    if (!Array.isArray(job?.steps) || job.steps.length === 0) {
      fehler.push(`Job »${name}« hat keine Schritte — er laeuft, misst nichts und meldet Erfolg`);
    }
  }
  return fehler;
};

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
export const analyse = ({ ciText, gates, notAGate, selftestOnly, importers, importerWaivers, today }) => {
  const failures = [];
  const rows = [];
  const fail = (msg) => failures.push(msg);

  // ── Gesetz 0 · D-511: die Datei muss ueberhaupt ladbar sein ────────────────
  // Zuerst, und mit Rueckgabe: an einer Datei, die GitHub nicht lesen kann,
  // sagt jede weitere Zeile dieses Tors etwas ueber einen Lauf aus, den es
  // nicht geben wird.
  const yamlFehler = yamlVerdict(ciText);
  if (yamlFehler.length > 0) {
    for (const f of yamlFehler) fail(f);
    return { failures, rows };
  }

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

  // ── Gesetz 5 · C10/R187c: jeder Importeur mit Selbsttest hat seine Zeile ───
  const impUsage = scanImporterUsage(ciText);
  for (const { file, hasSelftest } of importers) {
    const u = impUsage.get(file);
    const waiver = importerWaivers[file];
    if (!hasSelftest) {
      // …und die Gegenrichtung: eine Zeile, die einen Selbsttest faehrt, den es
      // nicht gibt, ist ein Schritt, der nichts prueft und trotzdem gruen wird.
      if (u !== undefined && u.selftest > 0) {
        fail(`ci.yml faehrt docs/art/${file} --selftest, aber das Skript LIEST das Flag nicht `
          + "— der Schritt prueft nichts und meldet Erfolg");
      }
      continue;
    }
    if (u !== undefined && u.selftest > 0) {
      if (waiver !== undefined) {
        fail(`IMPORTER_WITHOUT_CI_LINE nennt ${file}, aber die ci.yml-Zeile ist inzwischen da `
          + "— Ausnahme SCHAL, Eintrag entfernen");
        continue;
      }
      rows.push(`  ✓ docs/art/${file} — Selbsttest in CI verdrahtet (C10)`);
      continue;
    }
    if (waiver === undefined) {
      fail(`docs/art/${file} hat einen --selftest, aber NICHTS in .github/workflows/ci.yml faehrt ihn `
        + "— Zeile im selben PR anhaengen (C10/R187c), oder mit Grund + Frist in "
        + "IMPORTER_WITHOUT_CI_LINE eintragen");
      continue;
    }
    if (!waiver.reason || waiver.reason.length < 20 || !waiver.until) {
      fail(`IMPORTER_WITHOUT_CI_LINE-Eintrag fuer ${file} braucht einen echten Grund UND eine Frist`);
      continue;
    }
    if (waiver.until < today) {
      fail(`IMPORTER_WITHOUT_CI_LINE fuer ${file} ist ABGELAUFEN (bis ${waiver.until}) `
        + "— Zeile anhaengen oder die Frist mit neuem Grund verlaengern");
      continue;
    }
    rows.push(`  ○ docs/art/${file} — Selbsttest ohne CI-Zeile, befristet bis ${waiver.until}: ${waiver.reason}`);
  }
  // ── Gesetz 6 · keine schale Importeur-Ausnahme ─────────────────────────────
  for (const file of Object.keys(importerWaivers)) {
    const on = importers.find((i) => i.file === file);
    if (on === undefined) {
      fail(`IMPORTER_WITHOUT_CI_LINE nennt ${file}, aber die Datei liegt nicht (mehr) in docs/art/ `
        + "— Eintrag SCHAL");
    } else if (!on.hasSelftest) {
      fail(`IMPORTER_WITHOUT_CI_LINE nennt ${file}, aber das Skript hat gar keinen Selbsttest `
        + "— es braucht auch keine Zeile, Eintrag SCHAL");
    }
  }

  return { failures, rows };
};

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// Elf Fälle, und der letzte ist der wichtigste: die REALE, unverfälschte
// Konfiguration muss GRÜN herauskommen. Ein Selbsttest, der nur rote Lichter
// beweist, kann ein arbeitendes Tor nicht von einem unterscheiden, das auf
// alles rot geht.
//
// Die WELT steht einmal da und wird je Fall an GENAU EINER Stelle verfälscht
// (W5-Falle 4: ein Tamper, der zwei Größen bewegt, wird am falschen Gesetz rot
// und beweist über das gemeinte nichts).
const WELT = {
  ciText: ciOnDisk,
  gates: gatesOnDisk,
  notAGate: NOT_A_GATE,
  selftestOnly: SELFTEST_ONLY,
  importers: importersOnDisk,
  importerWaivers: IMPORTER_WITHOUT_CI_LINE,
  today: TODAY,
};

if (selftest) {
  const ohneZeile = (teil, nurEchte = false) => ciOnDisk.split("\n")
    .filter((l) => !(l.includes(teil) && (!nurEchte || !l.includes("--selftest")))).join("\n");

  /** D-511s Vorfall, nachgebaut: der ERSTE zitierte Schritt-Name wird entzitiert
   *  und bekommt ein »: « — genau die Form, die GitHub am 19.08. null Jobs
   *  starten liess. Der Anker ist ein MUSTER, kein abgeschriebener Wortlaut:
   *  eine Verfaelschung, die ins Leere greift, faerbt nichts und beweist nichts,
   *  also bricht sie hier laut ab (Fixture-Verrottung, in dieser Sitzung einmal
   *  passiert und vom Selbsttest selbst gefunden). */
  const unzitierterName = (text) => {
    const m = /^(\s*- name: )"([^"\n]+)"\s*$/m.exec(text);
    if (m === null) throw new Error("kein zitierter Schritt-Name in ci.yml — der D-511-Fall kann nicht gebaut werden");
    const kaputt = `${m[1]}${m[2].replace(/\s*—\s*/, " (Zeitgrenze: ")}`;
    const neu = text.replace(m[0], kaputt);
    if (neu === text) throw new Error("die D-511-Verfaelschung hat nichts veraendert");
    return neu;
  };

  const cases = [
    ["ein Tor verschwindet aus CI", () => analyse({
      ...WELT, ciText: ciOnDisk.replace(/scripts\/check-paint-art\.mjs/g, "scripts/__weg.mjs"),
    }), true],
    ["ein Tor läuft nur noch als Selbsttest (D-257)", () => analyse({
      // genau die Zeile herausnehmen, die den ECHTEN Lauf verdrahtet
      ...WELT, ciText: ohneZeile("scripts/check-png-identity.mjs", true),
    }), true],
    ["schale Ausnahme: das Werkzeug läuft doch echt", () => analyse({
      ...WELT, selftestOnly: { ...SELFTEST_ONLY, "check-fonts.mjs": "erfunden, damit dieser Fall ein rotes Licht zeigt" },
    }), true],
    ["schale Ausnahme: ci.yml kennt die Datei gar nicht", () => analyse({
      ...WELT, selftestOnly: { ...SELFTEST_ONLY, "gibt-es-nicht.mjs": "erfunden, damit dieser Fall ein rotes Licht zeigt" },
    }), true],

    // ── R5-W7 · W6 · D-511 · GENAU DER FALL, DER DAS TOR AUSTRICKSTE ────────
    // Ein Schritt-Name mit »: «, unzitiert. GitHub startete NULL Jobs, der Lauf
    // war rot ohne Log — und dieses Tor blieb grün, weil es die Datei nur
    // zeilenweise las. Der Wortlaut ist der echte Vorfall vom 19.08.
    ["D-511: ein unzitierter Schritt-Name mit »: « macht die Datei unlesbar", () => analyse({
      ...WELT, ciText: unzitierterName(ciOnDisk),
    }), true],
    ["gültiges YAML, aber kein einziger Job", () => analyse({
      ...WELT, ciText: "name: ci\non:\n  push:\n    branches: [main]\njobs: {}\n",
    }), true],
    ["ein Job ohne Schritte — läuft, misst nichts, meldet Erfolg", () => analyse({
      ...WELT, ciText: "name: ci\njobs:\n  leer:\n    runs-on: ubuntu-latest\n",
    }), true],

    // ── R5-W7 · W6 · C10/R187c · die Importeure ─────────────────────────────
    ["C10: ein Importeur-Selbsttest verschwindet aus CI", () => analyse({
      ...WELT, ciText: ohneZeile("docs/art/import-batch-aq12.mjs"),
    }), true],
    ["schale Importeur-Ausnahme: die Zeile ist doch da", () => analyse({
      ...WELT,
      importerWaivers: { ...IMPORTER_WITHOUT_CI_LINE, "import-batch-aq12.mjs": { reason: "erfunden, damit dieser Fall ein rotes Licht zeigt", until: "2099-01-01" } },
    }), true],
    ["abgelaufene Importeur-Ausnahme", () => analyse({
      ...WELT,
      importerWaivers: { "import-batch-as.mjs": { reason: "erfunden, damit dieser Fall ein rotes Licht zeigt", until: "2000-01-01" } },
    }), true],

    ["NICHT-TAMPER: der echte Stand ist grün", () => analyse(WELT), false],
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
  const rote = cases.filter(([, , want]) => want).length;
  console.log(`check-ci-gates --selftest: OK — ${cases.length} Fälle, ${rote} rote Lichter gesehen, der echte Stand grün`);
  process.exit(0);
}

const { failures, rows } = analyse(WELT);

console.log(rows.join("\n"));
for (const f of failures) console.error(`✗ ${f}`);
if (failures.length > 0) {
  console.error(`\ncheck-ci-gates: ${failures.length} Lücke(n)`);
  process.exit(1);
}
const real = rows.filter((r) => r.startsWith("  ✓") && !r.includes("docs/art/")).length;
const imps = rows.filter((r) => r.includes("docs/art/")).length;
const tools = Object.keys(SELFTEST_ONLY).length;
console.log(`\ncheck-ci-gates: OK — ${real} Tore laufen in CI an echten Dateien · `
  + `${tools} Werkzeuge fahren dort bewusst nur ihren Selbsttest · `
  + `${Object.keys(NOT_A_GATE).length} Skript(e) sind bewusst kein CI-Tor · `
  + `${imps} Importeur-Selbsttest(s) geprüft (C10)`);
