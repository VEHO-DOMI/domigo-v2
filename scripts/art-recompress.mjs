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
//
// Wiederholbar: das Ergebnis hängt nur an der Eingabedatei. Wenn eine parallele
// Kunst-Sitzung ein Blatt neu malt, ist der Konflikt mechanisch aufzulösen —
// ihre Datei nehmen, dieses Skript einmal laufen lassen, fertig.

import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dir = args.includes("--dir") ? args[args.indexOf("--dir") + 1] : "apps/web/public/art";
const dry = args.includes("--dry");

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
