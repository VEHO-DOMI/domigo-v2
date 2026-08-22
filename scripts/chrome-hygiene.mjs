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
 * ⚠ R5-W8 · W7 · WAS HIER MIT EINEM PRAEFIX NICHT GEHT. `raeumeVerwaisteProfile`
 * oben nimmt bewusst den PRAEFIX: es sucht Leichen VORIGER Laeufe, und die
 * heissen anders als dieser. Beim WARTEN ist derselbe Praefix falsch — er trifft
 * auch den Browser einer FREMDEN Sitzung, die gerade mit demselben Werkzeug
 * misst. GEMESSEN am 22.08.: eine Nachbarbahn mass parallel, und dieser Schritt
 * wartete die vollen 10 s auf einen Prozess, der niemals ihm gehoerte — und
 * meldete danach »1 eigener Chrome steht noch«, was eine Falschaussage ueber die
 * eigene Umgebung ist (dieselbe Verwechslung, die W6 fuer das TOETEN schon
 * bezahlt hat).
 *
 * Deshalb: der Aufrufer uebergibt hier sein EIGENES Profil-VERZEICHNIS, nicht
 * den Praefix. Das Verzeichnis kommt aus `mkdtempSync` und ist je Lauf einmalig;
 * ein fremder Browser kann es per Bauart nicht tragen.
 *
 * @param {string} eigenesProfil der volle Pfad aus mkdtempSync (nicht der Praefix!)
 * @returns {Promise<{gewartetMs:number, restend:number}>}
 */
export const wartenBisChromeWegIst = async (child, chromeBin, eigenesProfil, timeoutMs = 10_000) => {
  const profilePrefix = eigenesProfil;
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
  const browser = [];
  let gesamt = 0;
  for (const praefix of MESS_PRAEFIXE) {
    for (const p of eigeneChromesJetzt(chromeBin, praefix)) {
      gesamt++;
      const sichtbar = !p.cmd.includes("--headless=new");
      browser.push({ praefix, pid: p.pid, ppid: p.ppid, verwaist: verwaist(p), sichtbar });
      zeilen.push(`  · ${praefix}  pid ${p.pid} ← ${p.ppid}  ${verwaist(p) ? "VERWAIST" : "laeuft"}`
        + `  ${sichtbar ? "SICHTBAR (pgrep -f headless=new sieht ihn NICHT)" : "kopflos"}`);
    }
  }
  return { gesamt, zeilen, browser };
};

// ── R5-W8 · W7 · P7 §12.9 · DIE MASCHINE GEHOERT IN DEN BEIPACKZETTEL ──────
//
// P7 hat zwei Laeufe DESSELBEN Baus gemessen, die 32 % auseinanderlagen. Das
// Perf-Rezept nagelt seit W6 den BAU fest (`Bau: … · Quelle: …`), aber nicht die
// MASCHINE: Lastmittel, fremde Mess-Browser und fremde Dev-Server standen in
// W6s Report, weil W6 sie von Hand hineingeschrieben hat. Hand-Arbeit, die
// niemand erzwingt, faellt in der ersten Sitzung aus, die es eilig hat.
//
// Ab hier misst das Werkzeug sie selbst — und ein Lauf unter Last traegt seinen
// Makel im eigenen Zettel, statt dass die naechste Sitzung raet, warum zwei
// Zahlen nicht zusammenpassen.

/** Das Lastmittel der letzten 1/5/15 Minuten, als drei Zahlen. `null`, wenn die
 *  Maschine es nicht hergibt — eine erfundene Null waere schlimmer als nichts. */
export const lastmittel = () => {
  try {
    const roh = execFileSync("sysctl", ["-n", "vm.loadavg"], { encoding: "utf8" }).trim();
    const zahlen = (roh.match(/[\d.]+/g) ?? []).map(Number).filter((n) => Number.isFinite(n));
    return zahlen.length >= 3 ? { roh, m1: zahlen[0], m5: zahlen[1], m15: zahlen[2] } : { roh, m1: null, m5: null, m15: null };
  } catch {
    return null;
  }
};

/** Das Band, in dem in diesem Haus gemessen wird: 3200–3399 (Dev-Server 32xx,
 *  Produktionsbauten 33xx — so vergeben es die Rahmen-Blaetter seit Welle 4). */
export const MESS_PORT_VON = 3200;
export const MESS_PORT_BIS = 3399;

/**
 * Welche fremden Server im Mess-Band lauschen. Rein, damit der Selbsttest ihr
 * eine echte `lsof`-Ausgabe reichen kann.
 *
 * EINE Lesung der Lauschliste, nicht 200 Verbindungsversuche: ein Werkzeug, das
 * sich zum Messen erst 200-mal selbst verbindet, ist die Last, die es sucht.
 *
 * ★ R5-W8 · W7 (Schluss-Pass) · WARUM ES `weitereEigene` GIBT. Ein Vorher/
 * Nachher braucht ZWEI Server desselben Hauses — einen je Bau. Diese Lesung
 * kann »mein zweiter Server« und »der Server des Nachbarn« nicht unterscheiden,
 * und tut es deshalb nicht heimlich: der Aufrufer ERKLAERT seine weiteren
 * Ports, sie stehen namentlich im Beipackzettel, und alles Uebrige bleibt
 * fremd. Eine stille Ausnahme haette den Makel wertlos gemacht; eine erklaerte
 * macht ihn erst brauchbar.
 *
 * @param {string} lsofOut Zeilen von `lsof -iTCP -sTCP:LISTEN -P -n`
 * @param {number} eigenerPort der Port, den dieser Lauf selbst misst
 * @param {ReadonlyArray<number>} weitereEigene ERKLAERTE weitere eigene Ports
 */
export const fremdeMessServer = (lsofOut, eigenerPort, weitereEigene = []) => {
  const eigene = new Set([Number(eigenerPort), ...weitereEigene.map(Number)]);
  const gefunden = new Map();
  for (const line of String(lsofOut).split("\n")) {
    const m = line.match(/^(\S+)\s+(\d+)\s.*:(\d+)\s+\(LISTEN\)/);
    if (m === null) continue;
    const [, befehl, pid, portRoh] = m;
    const port = Number(portRoh);
    if (port < MESS_PORT_VON || port > MESS_PORT_BIS) continue;
    if (eigene.has(port)) continue;                     // eigene Server sind keine fremden
    if (!gefunden.has(port)) gefunden.set(port, { port, befehl, pid: Number(pid) });
  }
  return [...gefunden.values()].sort((a, b) => a.port - b.port);
};

const lsof = () => {
  try {
    return execFileSync("lsof", ["-iTCP", "-sTCP:LISTEN", "-P", "-n"], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  } catch {
    return "";                                          // keine Liste: dann wird nichts behauptet
  }
};

/** Ab wann ein Lauf seinen Makel traegt. GEMESSEN, nicht gesetzt: W6 las auf
 *  einer freien Maschine 3,91 und mit einer zweiten messenden Sitzung 33,7
 *  (Report W6 §Lastlesung). 8 liegt mit Abstand ueber dem freien Wert und weit
 *  unter dem belegten — die Schwelle sagt »hier misst noch jemand«, nicht
 *  »diese Maschine ist beschaeftigt«. */
export const LAST_MAKEL_AB = 8;

/**
 * Das Urteil ueber die Maschine. Rein — der Selbsttest muss BEIDE Richtungen
 * sehen koennen, sonst ist der Makel Dekoration.
 */
export const maschinenUrteil = ({ browser = [], last = null, fremdeServer = [] }, schwelle = LAST_MAKEL_AB) => {
  const gruende = [];
  const fremdeBrowser = browser.filter((b) => !b.verwaist);
  if (fremdeBrowser.length > 0) {
    gruende.push(`${fremdeBrowser.length} Mess-Browser laufen (PID ${fremdeBrowser.map((b) => b.pid).join(", ")}) `
      + "— eine andere Sitzung misst gerade");
  }
  if (last !== null && typeof last.m1 === "number" && last.m1 >= schwelle) {
    gruende.push(`Lastmittel ${last.m1} liegt auf oder ueber ${schwelle}`);
  }
  if (fremdeServer.length > 0) {
    gruende.push(`fremde Server im Mess-Band: ${fremdeServer.map((s) => `${s.port} (${s.befehl})`).join(", ")}`);
  }
  return {
    makel: gruende.length > 0,
    gruende,
    satz: gruende.length === 0
      ? "Die Maschine war frei, als diese Zahlen entstanden."
      : "⚠ MAKEL: diese Zahlen beschreiben zum Teil die MASCHINE und nicht den Code — "
        + `${gruende.join(" · ")}. (R115/D-339/A7; P7 §12.9 mass 32 % Streuung an DEMSELBEN Bau.)`,
  };
};

/** Die volle Lesung: Browser, Last, fremde Server, Urteil. Das ist es, was in
 *  den Beipackzettel jeder Perf-Zahl gehoert. */
export const maschinenlesung = (
  eigenerPort,
  chromeBin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  weitereEigene = [],
) => {
  const { gesamt, zeilen, browser } = lastlesung(chromeBin);
  const last = lastmittel();
  const fremdeServer = fremdeMessServer(lsof(), eigenerPort, weitereEigene);
  return {
    messBrowser: gesamt, browser, zeilen, last, fremdeServer,
    // Was der Aufrufer als eigen ERKLAERT hat, steht mit im Zettel — sonst
    // waere die Ausnahme unsichtbar und damit ungeprueft.
    eigenePorts: [Number(eigenerPort), ...weitereEigene.map(Number)],
    urteil: maschinenUrteil({ browser, last, fremdeServer }),
  };
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
  // ── R5-W8 · W7 · DAS EIGENE PROFIL TRENNT, DER PRAEFIX NICHT ─────────────
  // Genau der Fall vom 22.08.: zwei Sitzungen, dasselbe Werkzeug, derselbe
  // Praefix. Beim WARTEN muss das eigene Verzeichnis zaehlen und sonst nichts.
  {
    const meins = `/var/folders/x/${PRAEFIX}abc123`;
    const fremd = `/var/folders/x/${PRAEFIX}xyz789`;
    const nachPraefix = eigeneChromes(tabelle, BIN, PRAEFIX).map((g) => g.pid).sort();
    const nachProfil = eigeneChromes(tabelle, BIN, meins).map((g) => g.pid).sort();
    pruefe("der PRAEFIX findet beide — eigenen UND fremden Lauf",
      nachPraefix.includes(90001) && nachPraefix.includes(90005), `gefunden: ${nachPraefix.join(", ")}`);
    pruefe("★ das eigene PROFIL findet nur den eigenen",
      nachProfil.includes(90001) && !nachProfil.includes(90005), `gefunden: ${nachProfil.join(", ")}`);
    pruefe("…und das fremde Profil nur den fremden",
      eigeneChromes(tabelle, BIN, fremd).map((g) => g.pid).join() === "90005",
      `gefunden: ${eigeneChromes(tabelle, BIN, fremd).map((g) => g.pid).join(", ")}`);
    pruefe("TAMPER sass: die zwei Suchen liefern wirklich Verschiedenes",
      nachPraefix.length !== nachProfil.length, "beide Suchen fanden dasselbe — der Fall ist nicht gebaut");
  }

  pruefe("an der ECHTEN Prozesstabelle allein wird nichts Eigenes erfunden",
    eigeneChromes(echt, BIN, PRAEFIX).every((g) => g.cmd.includes(PRAEFIX)),
    "eine Zeile ohne unser Präfix wurde als eigene gezählt");

  // ── R5-W8 · W7 · DIE MASCHINEN-LESUNG (P7 §12.9) ─────────────────────────
  // Die `lsof`-Ausgabe ist ECHT (P-71) und bekommt vier Zeilen angehaengt: der
  // eigene Server, ein fremder im Band, einer knapp DANEBEN und einer, der die
  // Portnummer nur in einer anderen Spalte traegt.
  {
    const echtLsof = (() => {
      try { return execFileSync("lsof", ["-iTCP", "-sTCP:LISTEN", "-P", "-n"], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }); }
      catch { return "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\n"; }
    })();
    const tabelle = [
      echtLsof.trimEnd(),
      "node      4711 veho   21u  IPv6 0x1  0t0  TCP *:3287 (LISTEN)",          // der eigene
      "node      4712 veho   22u  IPv6 0x2  0t0  TCP 127.0.0.1:3285 (LISTEN)",  // ein fremder im Band
      "node      4713 veho   23u  IPv6 0x3  0t0  TCP *:3199 (LISTEN)",          // knapp darunter
      "node      4714 veho   24u  IPv6 0x4  0t0  TCP *:3400 (LISTEN)",          // knapp darueber
    ].join("\n");
    const gefunden = fremdeMessServer(tabelle, 3287);
    const ports = gefunden.map((g) => g.port);
    pruefe("ein fremder Server im Mess-Band wird gefunden", ports.includes(3285), `gefunden: ${ports.join(", ")}`);
    pruefe("★ der EIGENE Port zaehlt nicht als fremder", !ports.includes(3287),
      "der Lauf haette sich selbst als Stoerung gemeldet");
    pruefe("3199 liegt unter dem Band und zaehlt nicht", !ports.includes(3199), `gefunden: ${ports.join(", ")}`);
    pruefe("3400 liegt ueber dem Band und zaehlt nicht", !ports.includes(3400), `gefunden: ${ports.join(", ")}`);
    // ★ der ERKLAERTE zweite eigene Server (Vorher/Nachher braucht zwei)
    const mitErklaerung = fremdeMessServer(tabelle, 3287, [3285]).map((g) => g.port);
    pruefe("★ ein ERKLAERTER weiterer eigener Port ist kein fremder", !mitErklaerung.includes(3285),
      `gefunden: ${mitErklaerung.join(", ")}`);
    pruefe("TAMPER sass: OHNE die Erklaerung ist derselbe Port fremd", ports.includes(3285),
      "der Port war schon vorher unsichtbar — die Ausnahme beweist nichts");

    // Das Urteil, BEIDE Richtungen — ein Makel, der nie angeht, ist Dekoration,
    // und einer, der nie ausgeht, ist Rauschen.
    const frei = maschinenUrteil({ browser: [], last: { m1: 1.2 }, fremdeServer: [] });
    pruefe("eine freie Maschine traegt keinen Makel", frei.makel === false, frei.satz);
    pruefe("…und sagt das in einem Satz", /frei/i.test(frei.satz), frei.satz);
    const unterLast = maschinenUrteil({ browser: [], last: { m1: 33.7 }, fremdeServer: [] });
    pruefe("das Lastmittel, das W6 mit einer zweiten Sitzung gemessen hat (33,7), macht den Makel an",
      unterLast.makel === true, unterLast.satz);
    const fremderBrowser = maschinenUrteil({ browser: [{ pid: 9, verwaist: false }], last: { m1: 0.5 }, fremdeServer: [] });
    pruefe("ein LAUFENDER fremder Mess-Browser macht den Makel an", fremderBrowser.makel === true, fremderBrowser.satz);
    const leiche = maschinenUrteil({ browser: [{ pid: 9, verwaist: true }], last: { m1: 0.5 }, fremdeServer: [] });
    pruefe("★ ein VERWAISTER (also toter) Browser macht ihn NICHT an — er misst nichts mehr",
      leiche.makel === false, leiche.satz);
    const fremderServer = maschinenUrteil({ browser: [], last: { m1: 0.5 }, fremdeServer: [{ port: 3285, befehl: "node" }] });
    pruefe("ein fremder Server im Band macht den Makel an", fremderServer.makel === true, fremderServer.satz);
    pruefe("…und der Grund nennt den Port", /3285/.test(fremderServer.satz), fremderServer.satz);
    // TAMPER gegen den MESSWERT (P-71): dieselbe freie Messung, die Schwelle
    // unter den Wert gebogen. Der Makel MUSS danach angehen — sonst ist der
    // rote Zweig bei keinem denkbaren Messwert erreichbar.
    const gebogen = maschinenUrteil({ browser: [], last: { m1: 1.2 }, fremdeServer: [] }, 1.0);
    pruefe("TAMPER: dieselbe Messung, Schwelle unter den Messwert gebogen ⇒ Makel",
      gebogen.makel === true && frei.makel === false, "der Makel ist an dieser Zahl nicht erreichbar");
  }

  if (bad > 0) { console.error("chrome-hygiene --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("chrome-hygiene --selftest: OK — VERWAISTE eigene Profile werden beendet, "
    + "eine LAUFENDE fremde Messung mit demselben Präfix nie, fremde Browser nie, "
    + "und die pgrep -f-Selbstfindung ist ausgeschlossen. Dazu die Maschinen-Lesung (P7 §12.9): "
    + "fremde Server im Band 3200–3399 werden gefunden, der eigene Port nicht, und der Makel geht an "
    + "und aus (Last · fremder Browser · fremder Server), mit einer an den Messwert gebogenen Schwelle "
    + "als Beweis, dass sein rotes Licht erreichbar ist.");
  process.exit(0);
}
