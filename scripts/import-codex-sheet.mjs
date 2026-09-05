#!/usr/bin/env node
// R5-F4 · DER BLATT-IMPORT — aus einer Codex-Lieferung werden Spiel-Zellen.
//
// Codex liefert nach der Liefer-Konvention BLÄTTER: ein Raster aus 512×512-
// Zellen, die Figuren opak über einem einfarbigen Magenta-Schlüssel (#FF00FF).
// Das Spiel will das Gegenteil: EINE Datei je Zelle, freigestellt (Alpha) und
// auf den belegten Kasten getrimmt — `eraser_a.png` ist 382×159, nicht 512².
//
// Zwischen beidem lag bisher Handarbeit. Das ist der Grund, warum es dieses
// Skript gibt: der Schnitt ist der Schritt, bei dem der berüchtigte Rosa-Saum
// entsteht (siehe key-fringe.mjs — ein Schlüssel-Rest an jeder Alpha-Kante, der
// sich auf gekachelten Flächen zu einem wandernden Punkt aufsummiert hat). Ein
// Skript schneidet jedes Mal gleich; eine Hand nicht.
//
// Die Kette, die eine Lieferung durchläuft:
//   1. dieses Skript  — Zellen schneiden, Schlüssel entfernen, trimmen
//   2. strip-key-fringe.mjs — den Rest-Saum heilen (idempotent)
//   3. check-paint-art.mjs  — das Tor, das beides bewacht
//
// Aufruf:
//   node --experimental-strip-types scripts/import-codex-sheet.mjs \
//     --sheet ~/Code/codex-art-lab/batch-aq5/hero2_flight_cycle.png \
//     --cells hero2_jump,hero2_jump2,hero2_apex,hero2_fall \
//     [--chapter ch01] [--dest <ordner>] [--dry]
//
// `--dest` erzwingt EINEN Ordner fuer alle Zellen (der alte Weg, jetzt
// ausdruecklich getippt statt stillschweigend). Ohne ihn entscheidet der STEM:
// ein Helden-Blatt geht nach `hero/`, ein Kapitel-Blatt nach `<chapter>/`.
//
// `--cells` benennt die Zellen VON LINKS NACH RECHTS, dann zeilenweise nach
// unten. Ein Name `-` überspringt eine Zelle (Reservefelder der Lieferung).
// Ohne `--dry` werden bestehende Dateien überschrieben — das ist der Zweck,
// aber es steht absichtlich hier, weil `eraser_b.png` Produktionsmaterial ist.

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { ALWAYS_STEMS } from "../packages/game-paint/src/artScope.ts";

const CELL = 512;
/** Wie weit eine Farbe vom reinen Schlüssel abweichen darf und trotzdem
 *  Hintergrund ist. Der Schlüssel ist einfarbig geliefert, aber ein Blatt kann
 *  resampelt worden sein — dann franst #ff00ff zu #fe02fd aus. Großzügig genug
 *  für den Rand, weit weg von allem, was in dieser Palette gemalt wird
 *  (die Figuren tragen kein Magenta; der Saum-Heiler räumt den Rest). */
const KEY_TOL = 40;
/** Ab dieser Magenta-Nähe zählt ein Pixel als halb-Schlüssel und wird
 *  weggeblendet statt hart geschnitten — das ist es, was den harten Saum
 *  überhaupt erst mildert. */
const SOFT_TOL = 110;

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const dry = process.argv.includes("--dry");
const sheetPath = arg("sheet");
const cellNames = (arg("cells") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const ART_ROOT = "apps/web/public/art/g1/paint";
const kapitelArg = arg("chapter");
const destArg = arg("dest");

// ── L0c · P15 · D-793 · DAS ZIEL KOMMT AUS DEM STEM, NICHT AUS DIESER ZEILE ──
//
// Hier stand EIN Zielordner als Standardwert (`…/paint/ch01`), und jede
// Lieferung ging dorthin — auch die der FIGUR. So sind die vierzehn
// `hero2_*`-Zellen in `ch01/` gelandet, und genau daraus wurde R263: der
// Aufloeser gibt jedem Kapitel nur `["hero", chapter]`
// (`apps/web/lib/paint-art.ts#artDirsFor`), also fand ch02–ch06 die Figur nicht
// und zeichnete still den alten Teile-Baukasten. Ohne diese Zeilen kaeme die
// naechste Figuren-Lieferung wieder falsch an.
//
// Die Regel hat zwei Leser und eine Quelle: `ALWAYS_STEMS` (die Blaetter, die
// JEDES Kapitel laedt) plus die Namensform `hero…_`. Der Praefix steht daneben,
// weil die Listen in `artManifest.ts` und `rigSpec.ts` schon einmal
// auseinandergelaufen sind (D-173) — ein neues Helden-Blatt darf nicht davon
// abhaengen, dass jemand die Liste nachgezogen hat.
//
// Und der dritte Fall ist der wichtigste: ein Stem, der zu KEINEM passt, haelt
// das Werkzeug an. Raten ist genau das, was D-793 gekostet hat.
const istHeldenStem = (stem) => ALWAYS_STEMS.includes(stem) || /^hero\d*_/.test(stem);
const zielFuer = (stem, kapitel) => {
  if (istHeldenStem(stem)) return path.join(ART_ROOT, "hero");
  if (kapitel === null) {
    console.error(`✗ "${stem}" ist kein Helden-Blatt (weder in ALWAYS_STEMS noch in der Form hero…_), `
      + "und dieser Lauf nennt kein Kapitel (--chapter chNN). Ein Ziel wird hier nicht geraten (D-793).");
    process.exit(2);
  }
  return path.join(ART_ROOT, kapitel);
};

/** `--dest` schlaegt die Ableitung — aber nur, wenn jemand sie ausdruecklich tippt. */
const zielVon = (stem) => (destArg !== null ? destArg : zielFuer(stem, kapitelArg));
const zieleGeschrieben = new Set();

if (!sheetPath || cellNames.length === 0) {
  console.error("brauche --sheet <datei.png> und --cells <name,name,…>");
  process.exit(2);
}

const sheet = PNG.sync.read(fs.readFileSync(sheetPath));
const cols = Math.floor(sheet.width / CELL);
const rows = Math.floor(sheet.height / CELL);
if (cols * rows < cellNames.length) {
  console.error(`Blatt hat ${cols}×${rows} = ${cols * rows} Zellen, ${cellNames.length} Namen genannt`);
  process.exit(2);
}

/** Wie „Schlüssel" ein Pixel ist: 0 = gar nicht, 1 = reiner #ff00ff. */
const keyness = (r, g, b) => {
  const d = Math.hypot(r - 255, g - 0, b - 255);
  if (d <= KEY_TOL) return 1;
  if (d >= SOFT_TOL) return 0;
  return 1 - (d - KEY_TOL) / (SOFT_TOL - KEY_TOL);
};

let wrote = 0;
for (let i = 0; i < cellNames.length; i++) {
  const name = cellNames[i];
  if (name === "-") continue;
  const cx = (i % cols) * CELL;
  const cy = Math.floor(i / cols) * CELL;

  // ── 1 · Zelle schneiden und den Schlüssel zu Alpha machen ──
  const cell = new PNG({ width: CELL, height: CELL });
  let minX = CELL, minY = CELL, maxX = -1, maxY = -1;
  for (let y = 0; y < CELL; y++) {
    for (let x = 0; x < CELL; x++) {
      const s = ((cy + y) * sheet.width + (cx + x)) << 2;
      const d = (y * CELL + x) << 2;
      const r = sheet.data[s], g = sheet.data[s + 1], b = sheet.data[s + 2], a = sheet.data[s + 3];
      const k = keyness(r, g, b);
      const alpha = Math.round(a * (1 - k));
      cell.data[d] = r; cell.data[d + 1] = g; cell.data[d + 2] = b; cell.data[d + 3] = alpha;
      if (alpha > 16) { // derselbe Schnitt-Schwellwert wie key-fringe.CUT_ALPHA
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) { console.log(`  ${name}: LEER (nur Schlüssel) — übersprungen`); continue; }

  // ── 2 · auf den belegten Kasten trimmen (das Spiel skaliert nach Höhe) ──
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((minY + y) * CELL + (minX + x)) << 2;
      const d = (y * w + x) << 2;
      out.data[d] = cell.data[s]; out.data[d + 1] = cell.data[s + 1];
      out.data[d + 2] = cell.data[s + 2]; out.data[d + 3] = cell.data[s + 3];
    }
  }
  const ziel = zielVon(name);
  zieleGeschrieben.add(ziel);
  const file = path.join(ziel, `${name}.png`);
  const gab = fs.existsSync(file);
  // Der Ordner steht MIT in der Zeile: dass niemand ihn sah, ist die halbe
  // Geschichte von D-793 — vierzehn Zellen gingen falsch, und der Lauf sagte
  // nur »14 Zelle(n) geschrieben«.
  console.log(`  ${name} → ${path.basename(ziel)}/: ${w}×${h} (Verhältnis ${(w / h).toFixed(2)})${gab ? " — ERSETZT" : " — neu"}${dry ? " [dry]" : ""}`);
  if (!dry) {
    fs.mkdirSync(ziel, { recursive: true });
    fs.writeFileSync(file, PNG.sync.write(out));
    wrote++;
  }
}
console.log(dry
  ? `dry-run, nichts geschrieben (Ziele waeren: ${[...zieleGeschrieben].join(", ") || "keine"})`
  : `${wrote} Zelle(n) geschrieben nach ${[...zieleGeschrieben].join(", ")}`);
console.log("→ jetzt: node --experimental-strip-types scripts/strip-key-fringe.mjs && pnpm check:paint-art");
