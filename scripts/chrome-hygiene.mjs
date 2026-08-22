#!/usr/bin/env node
// R5-W7 · W6 · D-438 + W5-Falle 1 · DER EIGENE BROWSER, SAUBER BEENDET.
//
// Zwei Vorfälle, dieselbe Wurzel — ein Chrome, den sein Erzeuger nicht mehr im
// Blick hat:
//
//   D-438 (E7). Die LASTLESUNG am Ende eines Perf-Laufs zählte den eigenen,
//     GERADE beendeten Browser mit: `pgrep -f headless=new` meldete erst 2,
//     dann 0. `chrome.kill()` schickt ein Signal und kehrt zurück; das Ende des
//     Prozesses passiert danach. Wer unmittelbar darauf die Last liest, misst
//     sich selbst und schreibt die Zahl in einen Beipackzettel.
//
//   W5-Falle 1. Ein abgebrochener Vordergrund-Lauf (7-Minuten-Zeitlimit) ließ
//     seinen Chrome AM LEBEN — Profil `shoot-world-chrome-…`, Fernsteuer-Port
//     9380 —, und der Folgelauf kam nie zurück. Das ist D-339 in dritter
//     Gestalt: nicht ein fremder Browser vom Vortag, nicht das eigene nicht
//     beendete oxipng, sondern der eigene abgewürgte Browser aus derselben
//     Sitzung.
//
// Die Antwort auf beides steht hier, EINMAL, für beide Werkzeuge.
//
// WARUM NICHT `pgrep -f`. W5s Falle 2 (art-recompress) hat es teuer gemacht:
// ein Muster über die ganze Kommandozeile trifft auch den, der gerade sucht.
// Gelesen wird deshalb die PROZESSTABELLE (`ps -axo pid=,command=`) und
// gefiltert wird auf zwei Dinge zugleich: die Zeile muss mit dem Chrome-Programm
// beginnen UND ein `--user-data-dir` mit UNSEREM Präfix tragen. Ein fremder
// Browser hat kein Profil mit unserem Präfix, und ein Node-Prozess beginnt nicht
// mit dem Chrome-Pfad. Fremde Browser werden NIE angefasst — sie sind Last, die
// gemeldet gehört (D-339), aber sie gehören jemand anderem.
//
// Run: node scripts/chrome-hygiene.mjs --selftest

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/**
 * Aus einer `ps -axo pid=,command=`-Ausgabe: die eigenen Chrome-Prozesse.
 * Rein, damit der Selbsttest ihr eine echte Tabelle mit einem eingebauten
 * Fremdling reichen kann.
 *
 * @param {string} psOut Zeilen der Form "  1234 /pfad/zum/programm --flag …"
 * @param {string} chromeBin der Programmpfad, mit dem eine eigene Zeile beginnt
 * @param {string} profilePrefix z. B. "perf-visible-chrome-"
 */
export const eigeneChromes = (psOut, chromeBin, profilePrefix) => {
  const treffer = [];
  for (const line of String(psOut).split("\n")) {
    const m = line.match(/^\s*(\d+)\s+(.*)$/);
    if (m === null) continue;
    const [, pid, cmd] = m;
    if (!cmd.startsWith(chromeBin)) continue;               // fremdes Programm
    if (!cmd.includes(`--user-data-dir=`)) continue;        // ohne Profil: nicht unserer
    if (!cmd.includes(profilePrefix)) continue;             // fremdes Profil
    treffer.push({ pid: Number(pid), cmd });
  }
  return treffer;
};

const ps = () => {
  try {
    return execFileSync("ps", ["-axo", "pid=,command="], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  } catch {
    return ""; // keine Prozesstabelle: dann gibt es auch nichts zu räumen
  }
};

/** Die eigenen Chrome-Prozesse, LIVE gelesen. */
export const eigeneChromesJetzt = (chromeBin, profilePrefix) =>
  eigeneChromes(ps(), chromeBin, profilePrefix);

/**
 * Beim START: verwaiste EIGENE Profile wegräumen — und es SAGEN. Ein stilles
 * Aufräumen wäre der zweite Fehler: wer nicht erfährt, dass ein Vorlauf
 * abgestürzt ist, misst weiter gegen eine Umgebung, die er nicht kennt.
 *
 * @returns {number} wie viele geräumt wurden
 */
export const raeumeVerwaisteProfile = (chromeBin, profilePrefix, ausserPid = process.pid) => {
  const offen = eigeneChromesJetzt(chromeBin, profilePrefix).filter((p) => p.pid !== ausserPid);
  if (offen.length === 0) return 0;
  console.warn(`⚠ ${offen.length} verwaiste(r) EIGENE(r) Chrome aus einem früheren Lauf gefunden `
    + `(Profil-Präfix ${profilePrefix}) — das ist W5s Falle 1, und der nächste Lauf würde daran hängen. `
    + `Wird beendet: PID ${offen.map((p) => p.pid).join(", ")}`);
  for (const p of offen) {
    try { process.kill(p.pid, "SIGTERM"); } catch { /* schon weg */ }
  }
  return offen.length;
};

/**
 * Beim ENDE: auf das wirkliche PROZESS-ENDE warten, nicht auf eine Uhr (D-438).
 * Erst das `exit`-Ereignis des eigenen Kindes, dann — als zweite, unabhängige
 * Quelle — die Prozesstabelle, bis kein Prozess mit unserem Profil mehr steht.
 *
 * @returns {Promise<{gewartetMs:number, restend:number}>}
 */
export const wartenBisChromeWegIst = async (child, chromeBin, profilePrefix, timeoutMs = 10_000) => {
  const t0 = Date.now();
  await new Promise((fertig) => {
    if (child === null || child === undefined || child.exitCode !== null || child.killed === false && child.pid === undefined) return fertig();
    let erledigt = false;
    const einmal = () => { if (!erledigt) { erledigt = true; fertig(); } };
    child.once("exit", einmal);
    child.once("close", einmal);
    setTimeout(einmal, timeoutMs).unref?.();
  });
  // …und die zweite Quelle: das Kind ist das WURZEL-Verfahren, Chrome startet
  // Hilfsprozesse. Erst wenn keiner mit unserem Profil mehr steht, ist die
  // Lastlesung wieder eine Aussage über die Maschine und nicht über uns.
  while (Date.now() - t0 < timeoutMs) {
    if (eigeneChromesJetzt(chromeBin, profilePrefix).length === 0) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  return { gewartetMs: Date.now() - t0, restend: eigeneChromesJetzt(chromeBin, profilePrefix).length };
};

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// R5-W7 · W6, sofort bezahlt: dies ist eine BIBLIOTHEK, kein Werkzeug. Ein
// `process.argv.includes("--selftest")` auf oberster Ebene feuert auch dann,
// wenn ein IMPORTEUR mit diesem Flag gestartet wurde — `perf-visible --selftest`
// hat prompt diesen Selbsttest gefahren und den eigenen nie erreicht. Geprüft
// wird deshalb zusätzlich, ob diese Datei das EINSTIEGSMODUL ist.
const istEinstieg = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;
if (istEinstieg && process.argv.includes("--selftest")) {
  const BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  // Die Prozesstabelle ist ECHT (P-71: gemessen, nicht erfunden); die Zeilen,
  // die es zu unterscheiden gilt, werden ihr ANGEHÄNGT — eine eigene, ein
  // fremder Browser mit fremdem Profil, ein fremder ohne Profil und ein
  // Node-Prozess, dessen Kommandozeile das Präfix ERWÄHNT (genau die Klasse,
  // an der ein `pgrep -f` scheitert).
  const echt = ps();
  const PRAEFIX = "perf-visible-chrome-";
  const tabelle = [
    echt.trimEnd(),
    `  90001 ${BIN} --headless=new --user-data-dir=/var/folders/x/${PRAEFIX}abc123 --remote-debugging-port=0`,
    `  90002 ${BIN} --user-data-dir=/Users/jemand/Library/Application Support/Google/Chrome`,
    `  90003 ${BIN}`,
    `  90004 /opt/homebrew/bin/node scripts/perf-visible.mjs --profil ${PRAEFIX}abc123`,
  ].join("\n");

  const gefunden = eigeneChromes(tabelle, BIN, PRAEFIX);
  const pids = gefunden.map((g) => g.pid).sort();
  let bad = 0;
  const pruefe = (name, ok, was) => {
    if (ok) console.log(`  ✓ ${name}`);
    else { bad++; console.error(`  ✗ ${name} — ${was}`); }
  };
  pruefe("der eigene Chrome wird gefunden", pids.includes(90001), `gefunden: ${pids.join(", ")}`);
  pruefe("ein fremder Chrome mit fremdem Profil bleibt unangetastet", !pids.includes(90002), "er wurde als eigener gezählt");
  pruefe("ein fremder Chrome ohne Profil bleibt unangetastet", !pids.includes(90003), "er wurde als eigener gezählt");
  pruefe("ein NODE-Prozess, der das Präfix nur ERWÄHNT, zählt nicht (die pgrep -f-Falle)",
    !pids.includes(90004), "die Suche hat sich selbst gefunden");
  pruefe("an der ECHTEN Prozesstabelle allein wird nichts Eigenes erfunden",
    eigeneChromes(echt, BIN, PRAEFIX).every((g) => g.cmd.includes(PRAEFIX)),
    "eine Zeile ohne unser Präfix wurde als eigene gezählt");

  if (bad > 0) { console.error("chrome-hygiene --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("chrome-hygiene --selftest: OK — 5 Fälle; eigene Profile werden erkannt, "
    + "fremde Browser nie, und die pgrep -f-Selbstfindung ist ausgeschlossen");
  process.exit(0);
}
