#!/usr/bin/env node
// R5-W3 · E5 · KLEINERE DATEIEN, IDENTISCHE BILDER.
//
// E4 hat die verlustfreie Nachverdichtung bewusst liegen gelassen, weil drei
// Kunst-Spuren gleichzeitig an denselben Dateien arbeiteten, und sie dem
// Architekten als Empfehlung übergeben: sie löst die Ladezeit UND das
// Phasen-Budget in einem Zug, ohne einen einzigen Bildpunkt zu ändern.
//
// DER HEBEL, gemessen statt vermutet (2026-08-14): die zehn größten Blätter des
// Kapitels — 36,4 MB — sind VOLLSTÄNDIG UNDURCHSICHTIG und liegen trotzdem als
// RGBA auf der Platte. Ein Viertel jeder dieser Dateien ist ein Alpha-Kanal, der
// überall 255 ist. Ihn wegzulassen ist nachweisbar verlustfrei: dekodiert ergibt
// ein RGB-PNG exakt dieselben RGBA-Werte, weil der fehlende Kanal als 255 liest.
// Dazu kommt bessere Deflate-Kompression. `oxipng` prüft jede Reduktion selbst.
//
// KEINE ZUSATZ-BLÖCKE WERDEN ENTFERNT (`--strip none`). Heute trägt keine dieser
// Dateien ein Farbprofil — nachgesehen, nicht angenommen — aber ein Blatt, das
// morgen eines trägt, darf nicht still anders aussehen. Die Regel steht hier,
// damit sie auch dann gilt, wenn niemand mehr nachsieht.
//
// DER BEWEIS IST EIN EIGENES SKRIPT: `check-png-identity.mjs` dekodiert vorher
// und nachher und vergleicht Bildpunkt für Bildpunkt. Dieses Skript hier ändert
// Dateien; jenes beweist, dass es nichts verändert hat. Beide laufen, immer.
//
// Run: node scripts/art-recompress.mjs [--dir apps/web/public/art] [--dry]
//      node scripts/art-recompress.mjs --selftest   (prüft die Doppellauf-Sperre)
//
// Wiederholbar: das Ergebnis hängt nur an der Eingabedatei. Wenn eine parallele
// Kunst-Sitzung ein Blatt neu malt, ist der Konflikt mechanisch aufzulösen —
// ihre Datei nehmen, dieses Skript einmal laufen lassen, fertig.
//
// ── R5-W6b · W5 · DIE SPERRE, UND WAS SIE GEKOSTET HAT (G5, D-339) ──────────
//
// Wiederholbar heißt nicht gleichzeitig. Am 18.08. lief ein Lauf, der beim
// Zeitüberschreiten im Vordergrund nicht beendet wurde, im Hintergrund weiter;
// der zweite Lauf traf also auf den ersten, die Systemlast stieg auf 114, und
// ein Tor-Lauf wurde abgewürgt. Zwei `oxipng`-Läufe auf denselben Dateien sind
// dabei nicht nur langsam: sie schreiben dieselben Dateien, und wer dabei
// zusieht, misst die Maschine statt der Arbeit (das ist D-339 in seiner ersten
// Gestalt — ein fremder Browser, der eine Perf-Messung verdreifachte).
//
// Also eine Sperre, und zwar mit den zwei Lehren, die sie gekostet hat:
//
//  1 · `pgrep -x`, NIE `pgrep -f`. Eine Suche über die ganze Befehlszeile
//      findet die eigene Schleife, die danach sucht (S2s Falle, zweiter
//      Vorfall in einer Woche). `-x` vergleicht den Prozessnamen exakt.
//  2 · Eine Sperrdatei, die einen TOTEN Lauf einsperrt, ist schlimmer als
//      keine: sie blockiert für immer und wird dann von Hand gelöscht, womit
//      sie ihren Zweck verloren hat. Diese hier trägt die PID, und wenn die
//      nicht mehr lebt, wird sie ÜBERNOMMEN — mit Meldung, nie stillschweigend.
//
// Und abgeräumt wird sie auf jedem Weg hinaus (Ende, Ctrl-C, TERM), damit
// nicht genau der Vorfall, der sie nötig gemacht hat, sie wieder auslöst.

import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const dir = args.includes("--dir") ? args[args.indexOf("--dir") + 1] : "apps/web/public/art";
const dry = args.includes("--dry");

const LOCK = path.join(os.tmpdir(), "domigo-art-recompress.lock");

/** Lebt dieser Prozess noch? `kill 0` fragt, ohne zu töten. */
const lebt = (pid) => {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; }
};

/**
 * Das ganze Urteil als REINE Funktion — damit der Selbsttest es fahren kann,
 * ohne einen zweiten `oxipng` zu starten. Drei Antworten, und jede eine andere
 * Handlung:
 *   `frei`        niemand arbeitet, die Sperre wird gesetzt
 *   `uebernehmen` die Sperre gehört einem toten Lauf — übernehmen, MIT Meldung
 *   `belegt`      es läuft wirklich einer — abbrechen, MIT Meldung
 */
export const sperrUrteil = ({ lockInhalt, pidLebt, oxipngLaeuft }) => {
  if (oxipngLaeuft) {
    return { was: "belegt", warum: "es läuft bereits ein oxipng auf dieser Maschine (pgrep -x oxipng)" };
  }
  if (lockInhalt === null) return { was: "frei", warum: "keine Sperrdatei" };
  const pid = Number.parseInt(String(lockInhalt).trim().split(/\s+/)[0], 10);
  if (!Number.isInteger(pid)) {
    return { was: "uebernehmen", warum: "die Sperrdatei ist unlesbar (keine PID darin)" };
  }
  if (pidLebt) {
    return { was: "belegt", warum: `ein Lauf mit PID ${pid} hält die Sperre und lebt` };
  }
  return { was: "uebernehmen", warum: `die Sperre gehört PID ${pid}, die nicht mehr lebt` };
};

if (args.includes("--selftest")) {
  // Der Fall, an dem richtig und plausibel-falsch auseinandergehen, ist NICHT
  // »Sperre da ⇒ abbrechen« (das kann auch eine kaputte Sperre), sondern die
  // TOTE Sperre: eine Fassung, die nur auf die Datei sieht, blockiert dort für
  // immer; eine, die nur auf den Prozess sieht, lässt zwei Läufe nebeneinander
  // laufen, sobald einer gerade zwischen zwei Stapeln steht.
  const faelle = [
    ["frei: keine Datei, kein Prozess", { lockInhalt: null, pidLebt: false, oxipngLaeuft: false }, "frei"],
    ["belegt: ein oxipng läuft wirklich", { lockInhalt: null, pidLebt: false, oxipngLaeuft: true }, "belegt"],
    ["belegt: die Sperre gehört einem LEBENDEN Lauf", { lockInhalt: "4711", pidLebt: true, oxipngLaeuft: false }, "belegt"],
    ["übernehmen: die Sperre gehört einem TOTEN Lauf", { lockInhalt: "4711", pidLebt: false, oxipngLaeuft: false }, "uebernehmen"],
    ["übernehmen: die Sperrdatei ist unlesbar", { lockInhalt: "kaputt", pidLebt: false, oxipngLaeuft: false }, "uebernehmen"],
    ["belegt schlägt alles: ein laufendes oxipng trotz toter Sperre", { lockInhalt: "4711", pidLebt: false, oxipngLaeuft: true }, "belegt"],
  ];
  let bad = 0;
  for (const [name, ein, soll] of faelle) {
    const u = sperrUrteil(ein);
    const ok = u.was === soll;
    if (!ok) bad++;
    console.log(`  ${ok ? "\u2713" : "\u2717"} ${name}${ok ? "" : ` → ${u.was} statt ${soll}`}`);
  }
  // …und die Suche selbst darf sich nicht selbst finden (S2s Falle). Geprüft
  // wird der AUFRUF, nicht die Prosa: dieser Kopf erklärt den Unterschied
  // zwischen -f und -x und darf ihn dafür beim Namen nennen. Die erste Fassung
  // dieser Zeile las die ganze Datei und wurde an ihrem eigenen Kommentar rot —
  // dieselbe Falle, nur eine Ebene höher.
  const eigenerQuelltext = fs.readFileSync(new URL(import.meta.url), "utf8");
  if (/exec\w*Sync\(\s*"pgrep -f/.test(eigenerQuelltext)) {
    bad++; console.error("\u2717 dieses Skript RUFT `pgrep -f` — das trifft die eigene Befehlszeile (S2)");
  }
  if (!/exec\w*Sync\(\s*"pgrep -x oxipng"/.test(eigenerQuelltext)) {
    bad++; console.error("\u2717 dieses Skript fragt gar nicht mehr nach einem laufenden oxipng — die Sperre ist zahnlos");
  }
  if (bad > 0) { console.error(`art-recompress --selftest: ${bad} Fall/Fälle haben NICHT gebissen`); process.exit(1); }
  console.log(`art-recompress --selftest: OK — ${faelle.length} Fälle: eine tote Sperre wird übernommen, eine lebende hält, und ein laufendes oxipng schlägt beides`);
  process.exit(0);
}

try {
  execSync("oxipng --version", { stdio: "ignore" });
} catch {
  console.error(
    "art-recompress: oxipng is not installed.\n" +
      "  brew install oxipng   (lossless, verifies every reduction itself)\n" +
      "Nothing was changed.",
  );
  process.exit(1);
}

// ── die Sperre, bevor irgendeine Datei angefasst wird ───────────────────────
let oxipngLaeuft = false;
try {
  execSync("pgrep -x oxipng", { stdio: "ignore" }); // Exit 0 = mindestens einer läuft
  oxipngLaeuft = true;
} catch { oxipngLaeuft = false; }

const lockInhalt = fs.existsSync(LOCK) ? fs.readFileSync(LOCK, "utf8") : null;
const pidAusLock = lockInhalt === null ? NaN : Number.parseInt(lockInhalt.trim().split(/\s+/)[0], 10);
const urteil = sperrUrteil({
  lockInhalt,
  pidLebt: Number.isInteger(pidAusLock) ? lebt(pidAusLock) : false,
  oxipngLaeuft,
});
if (urteil.was === "belegt") {
  console.error(
    `art-recompress: ABGEBROCHEN — ${urteil.warum}.\n`
    + "  Zwei Läufe schreiben dieselben Dateien und treiben die Systemlast so hoch, dass\n"
    + "  eine Messung daneben die Maschine misst statt der Arbeit (D-339).\n"
    + `  Warten, bis er fertig ist. Ist er es sicher nicht: ${LOCK} von Hand löschen.\n`
    + "  Nichts wurde geändert.",
  );
  process.exit(1);
}
if (urteil.was === "uebernehmen") console.warn(`art-recompress: alte Sperre übernommen — ${urteil.warum}.`);

if (!dry) {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()} ${dir}\n`);
  const abraeumen = () => { try { if (fs.readFileSync(LOCK, "utf8").startsWith(`${process.pid} `)) fs.unlinkSync(LOCK); } catch { /* schon weg */ } };
  process.on("exit", abraeumen);
  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => { abraeumen(); process.exit(130); });
}

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".png")) files.push(p);
  }
};
walk(path.resolve(dir));
files.sort();

const MB = 1048576;
const before = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`art-recompress: ${files.length} PNG(s), ${(before / MB).toFixed(1)} MB${dry ? " (dry run)" : ""}`);

if (dry) {
  process.exit(0);
}

// -o max: try every filter/strategy. --strip none: keep every ancillary chunk.
//
// ★ KEIN `-a`, und das ist der teuerste Satz in dieser Datei. oxipngs
// Alpha-Optimierung überschreibt die FARBWERTE vollständig durchsichtiger
// Bildpunkte, weil man sie nicht sieht — auf einem einzigen Blatt waren das
// 42 177 Bildpunkte. Gerendert ist das identisch. In diesem Repo ist es das
// nicht: `check-composition.mjs` und `key-fringe.mjs` lesen die Quell-PNGs
// roh und rechnen mit RGB, und die ganze Import-Konvention hängt an einem
// Farbschlüssel (#FF00FF), der genau in solchen Bereichen liegt. Ein Werkzeug,
// das „unsichtbar" mit „unverändert" verwechselt, hätte hier still die Zahlen
// von zwei Toren verschoben.
// Gefunden hat das der eigene Beweis (`check-png-identity.mjs`) beim ersten
// Lauf — nicht ein Review. Genau dafür ist er da.
//
// Batched, because one process per file would spend its life starting up.
const BATCH = 60;
for (let i = 0; i < files.length; i += BATCH) {
  const batch = files.slice(i, i + BATCH);
  execFileSync("oxipng", ["-o", "max", "--strip", "none", "-q", ...batch], { stdio: "inherit" });
  process.stdout.write(`  … ${Math.min(i + BATCH, files.length)}/${files.length}\n`);
}

const after = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(
  `art-recompress: ${(before / MB).toFixed(1)} MB → ${(after / MB).toFixed(1)} MB ` +
    `(−${(((before - after) / before) * 100).toFixed(1)} %). ` +
    `Jetzt den Beweis führen: node scripts/check-png-identity.mjs`,
);
