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
// ⚠ WAS BEIM ERSTEN ANLAUF FALSCH WAR, UND WIE ES AUFFLOG (W6, 22.08.).
// Die erste Fassung hielt jeden Chrome mit UNSEREM Profil-Praefix fuer einen
// eigenen verwaisten und haette ihn beendet. Waehrend dieser Sitzung mass eine
// ZWEITE Sitzung (E8) auf demselben Rechner mit demselben Skript — also mit
// demselben Praefix `perf-visible-chrome-`. Ein Start von `perf-visible` haette
// ihr die laufende Messung abgeschossen. Der Praefix sagt, WELCHES WERKZEUG den
// Browser gestartet hat, nie WER ihn gestartet hat; das ist ein Unterschied,
// und er kostet eine fremde Messung.
// Das Gesetz heisst deshalb woertlich, was es meint: VERWAIST ist ein Browser,
// dessen ERZEUGER WEG IST. Ein Kindprozess, dessen Elternprozess stirbt, wird
// von launchd/init adoptiert und traegt danach `ppid = 1` — das ist die
// Definition, nicht ein Indiz. Ein fremder Lauf, der GERADE MISST, hat einen
// lebenden Elternprozess und wird nie angefasst.
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
// ── R5-W7 · W6 · UND DIE LASTLESUNG SELBST WAR BLIND ────────────────────────
//
// `PERF_WAECHTER.md` §3b schreibt vor jeder Zahl drei Zeilen vor, und die erste
// ist `pgrep -fl "headless=new"`. Die kann einen SICHTBAREN Lauf nicht sehen:
// `shoot-world --visible` laesst genau dieses Flag weg. Seit F8s Falle 2 wird
// jeder gemeldete Stillstand mit `--visible` wiederholt — sichtbare Laeufe sind
// also nicht die Ausnahme, sondern Alltag, und die vorgeschriebene Lastlesung
// ist gegen sie blind.
// GEMESSEN am 22.08.: `pgrep -f headless=new` meldete 2 (beides eigene
// zsh-Warteschleifen, deren Kommandozeile das Wort enthielt — die pgrep-Falle
// ein zweites Mal), waehrend eine FREMDE Sitzung einen sichtbaren
// `shoot-world`-Chrome fuhr. Die Zahl war doppelt falsch: sie zaehlte, was
// keiner war, und sah nicht, was einer war.
//
// `--lastlesung` druckt deshalb, was wirklich laeuft: jeder Mess-Browser, egal
// ob sichtbar oder kopflos, mit Erzeuger und Urteil.
//
// Run: node scripts/chrome-hygiene.mjs --selftest
//      node scripts/chrome-hygiene.mjs --lastlesung   (was misst gerade auf dieser Maschine?)

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
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+(.*)$/);
    if (m === null) continue;
    const [, pid, ppid, cmd] = m;
    if (!cmd.startsWith(chromeBin)) continue;               // fremdes Programm
    if (!cmd.includes(`--user-data-dir=`)) continue;        // ohne Profil: nicht unserer
    if (!cmd.includes(profilePrefix)) continue;             // fremdes Profil
    treffer.push({ pid: Number(pid), ppid: Number(ppid), cmd });
  }
  return treffer;
};

/** VERWAIST heisst: der Erzeuger ist weg. Ein Kindprozess, dessen Elternprozess
 *  stirbt, wird adoptiert und traegt danach `ppid = 1`. Ein fremder Lauf, der
 *  gerade misst, hat einen lebenden Elternprozess — und wird nie angefasst. */
export const verwaist = (p) => p.ppid === 1;

const ps = () => {
  try {
    return execFileSync("ps", ["-axo", "pid=,ppid=,command="], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
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
  const alle = eigeneChromesJetzt(chromeBin, profilePrefix).filter((p) => p.pid !== ausserPid);
  const tot = alle.filter(verwaist);
  const lebendig = alle.filter((p) => !verwaist(p));
  // Ein fremder LAUFENDER Lauf ist keine Leiche, sondern LAST — und Last gehört
  // gemeldet (D-339), damit die nächste Messung weiss, wogegen sie misst.
  if (lebendig.length > 0) {
    console.warn(`⚠ ${lebendig.length} Chrome mit dem Profil-Präfix ${profilePrefix} laufen mit LEBENDEM `
      + `Elternprozess — das ist eine ANDERE Sitzung, die gerade misst (PID ${lebendig.map((p) => `${p.pid}←${p.ppid}`).join(", ")}). `
      + "Sie werden NICHT angefasst. Für eine belastbare Perf-Zahl erst warten, bis sie fertig ist (R115/D-339).");
  }
  if (tot.length === 0) return 0;
  console.warn(`⚠ ${tot.length} VERWAISTE(R) Chrome aus einem abgebrochenen Lauf gefunden `
    + `(Profil-Präfix ${profilePrefix}, Elternprozess weg) — das ist W5s Falle 1, und der nächste Lauf `
    + `würde daran hängen. Wird beendet: PID ${tot.map((p) => p.pid).join(", ")}`);
  for (const p of tot) {
    try { process.kill(p.pid, "SIGTERM"); } catch { /* schon weg */ }
  }
  return tot.length;
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

/** Alle Profil-Praefixe, unter denen in diesem Repo gemessen wird. Eine Liste,
 *  weil jedes Werkzeug seinen eigenen Browser startet — und weil ein Praefix,
 *  der hier fehlt, eine Lastlesung still unvollstaendig macht. */
export const MESS_PRAEFIXE = ["perf-visible-chrome-", "shoot-world-chrome-", "bench-chrome-"];

/** Die ehrliche Lastlesung: was misst gerade auf dieser Maschine? */
export const lastlesung = (chromeBin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome") => {
  const zeilen = [];
  let gesamt = 0;
  for (const praefix of MESS_PRAEFIXE) {
    for (const p of eigeneChromesJetzt(chromeBin, praefix)) {
      gesamt++;
      const sichtbar = !p.cmd.includes("--headless=new");
      zeilen.push(`  · ${praefix}  pid ${p.pid} ← ${p.ppid}  ${verwaist(p) ? "VERWAIST" : "laeuft"}`
        + `  ${sichtbar ? "SICHTBAR (pgrep -f headless=new sieht ihn NICHT)" : "kopflos"}`);
    }
  }
  return { gesamt, zeilen };
};

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// R5-W7 · W6, sofort bezahlt: dies ist eine BIBLIOTHEK, kein Werkzeug. Ein
// `process.argv.includes("--selftest")` auf oberster Ebene feuert auch dann,
// wenn ein IMPORTEUR mit diesem Flag gestartet wurde — `perf-visible --selftest`
// hat prompt diesen Selbsttest gefahren und den eigenen nie erreicht. Geprüft
// wird deshalb zusätzlich, ob diese Datei das EINSTIEGSMODUL ist.
const istEinstieg = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;
if (istEinstieg && process.argv.includes("--lastlesung")) {
  const { gesamt, zeilen } = lastlesung();
  const last = execFileSync("sysctl", ["-n", "vm.loadavg"], { encoding: "utf8" }).trim();
  console.log(`Mess-Browser auf dieser Maschine: ${gesamt}`);
  for (const z of zeilen) console.log(z);
  console.log(`Lastmittel: ${last}`);
  console.log(gesamt === 0
    ? "⇒ frei. (Die Last kann trotzdem von etwas anderem kommen — die Zahl oben liest sie.)"
    : "⇒ NICHT frei: eine Perf-Zahl von jetzt beschreibt die Maschine, nicht den Code (R115/D-339/A7).");
  process.exit(0);
}

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
    // verwaist: der Erzeuger ist weg (ppid 1) — das ist W5s Falle 1
    `  90001     1 ${BIN} --headless=new --user-data-dir=/var/folders/x/${PRAEFIX}abc123 --remote-debugging-port=0`,
    // ⚠ DER FALL, DER DIESES GESETZ GEKOSTET HAT: dasselbe Werkzeug, dasselbe
    //   Praefix, ABER ein lebender Elternprozess — eine ANDERE Sitzung misst
    //   gerade (am 22.08. wirklich passiert: E8 auf demselben Rechner).
    `  90005 90004 ${BIN} --headless=new --user-data-dir=/var/folders/x/${PRAEFIX}xyz789 --remote-debugging-port=0`,
    `  90002     1 ${BIN} --user-data-dir=/Users/jemand/Library/Application Support/Google/Chrome`,
    `  90003     1 ${BIN}`,
    `  90004     1 /opt/homebrew/bin/node scripts/perf-visible.mjs --profil ${PRAEFIX}abc123`,
  ].join("\n");

  const gefunden = eigeneChromes(tabelle, BIN, PRAEFIX);
  const pids = gefunden.map((g) => g.pid).sort();
  const zuToeten = gefunden.filter(verwaist).map((g) => g.pid).sort();
  let bad = 0;
  const pruefe = (name, ok, was) => {
    if (ok) console.log(`  ✓ ${name}`);
    else { bad++; console.error(`  ✗ ${name} — ${was}`); }
  };
  pruefe("ein Chrome mit unserem Praefix wird gefunden", pids.includes(90001), `gefunden: ${pids.join(", ")}`);
  pruefe("VERWAIST (Elternprozess weg) wird beendet", zuToeten.includes(90001), `zu beenden: ${zuToeten.join(", ")}`);
  pruefe("★ ein FREMDER Lauf mit demselben Praefix und LEBENDEM Elternprozess wird NICHT beendet",
    pids.includes(90005) && !zuToeten.includes(90005),
    "eine laufende Messung einer anderen Sitzung waere abgeschossen worden — genau der Fall vom 22.08.");
  pruefe("ein fremder Chrome mit fremdem Profil bleibt unangetastet", !pids.includes(90002), "er wurde als eigener gezählt");
  pruefe("ein fremder Chrome ohne Profil bleibt unangetastet", !pids.includes(90003), "er wurde als eigener gezählt");
  pruefe("ein NODE-Prozess, der das Präfix nur ERWÄHNT, zählt nicht (die pgrep -f-Falle)",
    !pids.includes(90004), "die Suche hat sich selbst gefunden");
  pruefe("an der ECHTEN Prozesstabelle allein wird nichts Eigenes erfunden",
    eigeneChromes(echt, BIN, PRAEFIX).every((g) => g.cmd.includes(PRAEFIX)),
    "eine Zeile ohne unser Präfix wurde als eigene gezählt");

  if (bad > 0) { console.error("chrome-hygiene --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("chrome-hygiene --selftest: OK — 7 Fälle; VERWAISTE eigene Profile werden beendet, "
    + "eine LAUFENDE fremde Messung mit demselben Präfix nie, fremde Browser nie, "
    + "und die pgrep -f-Selbstfindung ist ausgeschlossen");
  process.exit(0);
}
