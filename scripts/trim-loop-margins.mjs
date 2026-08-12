#!/usr/bin/env node
// R5-A3 · DIE SCHLEIFEN-EHRLICHKEIT — ein Reparatur-Werkzeug, kein Gate.
//
// Gefunden beim Beweis der Tinte IM SPIEL: die Tintenfläche in p2 zeichnete
// nicht als Flüssigkeit, sondern als eine REIHE EINZELNER DUNKLER KLECKSE mit
// Lücken dazwischen. Die Ursache ist kein Renderer-Fehler und kein schlechtes
// Bild — es ist ein VERTRAGSBRUCH im Dateiformat:
//
//   `pool_ink_loop.png` ist 512×512, aber das Gemälde darin ist nur 397×160.
//   57 px Rand links, 58 rechts, 178 oben, 174 unten — 78 % der Fläche leer.
//
// Als Kachel gezeichnet werden aus den Seitenrändern LÜCKEN (deshalb die
// Kleckse), und aus dem oberen/unteren Rand wird ein winziges Motiv: bei 16 px
// Zeichenhöhe bleiben dem Gemälde ganze 5 px. Der Name sagt „loop", das Format
// sagt „Zelle" — und die Zelle hat gewonnen.
//
// Es ist eine KLASSE, nicht ein Fall. Von acht `*_loop`-Stems tragen vier
// Seitenränder, und alle vier sind 512er-Zellblätter; die vier ehrlichen sind
// allesamt 2048er-Bandblätter. Zwei der vier sind live (`pool_ink_loop`,
// `spikes_nibs_loop`), zwei bedienen den stillgelegten Strips-über-Füllung-Pfad.
//
// Dieses Skript schneidet die durchsichtigen Ränder weg — dieselbe Rolle, die
// `strip-key-fringe.mjs` für den Magenta-Saum spielt: das Bild wird repariert,
// nicht neu gemalt, der Stem-Name bleibt, das Manifest bleibt. Idempotent: ein
// zweiter Lauf findet nichts mehr. `--dry` misst nur.
//
// Was es NICHT kann: passende Enden erzeugen. Ein Blatt, dessen linke und
// rechte Kante verschiedene Bilder zeigen, hat nach dem Schnitt eine weiche
// Naht statt einer Lücke — besser, aber nicht gelöst. Das gehört in eine
// Kommission (CP-12), und der Gate in check-paint-art benennt es.

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const DRY = process.argv.includes("--dry");
const ART = path.join(process.cwd(), "apps/web/public/art/g1/paint");

const walk = (dir) => {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith("_loop.png")) out.push(p);
  }
  return out;
};

/** The opaque-enough bounding box. Alpha 8 is the same floor the importers use. */
const contentBox = (png) => {
  let x0 = png.width, y0 = png.height, x1 = -1, y1 = -1;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (png.data[(((y * png.width) + x) << 2) | 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};

let repaired = 0;
const rows = [];
for (const file of walk(ART)) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const box = contentBox(png);
  const stem = path.basename(file, ".png");
  if (box === null) { rows.push(`  ${stem.padEnd(22)} EMPTY — skipped`); continue; }
  const mL = box.x0;
  const mR = png.width - 1 - box.x1;
  const mT = box.y0;
  const mB = png.height - 1 - box.y1;
  // SIDE margins are the defect. A band sheet with a little air at top or
  // bottom is fine and must be left ALONE: the renderer derives its drawn scale
  // from the SOURCE HEIGHT (`ts = dh / srcH(stem)`), so trimming a healthy band
  // vertically silently resizes it — measured on the first run of this script,
  // which shrank four honest 2048-wide bands by 3-13 % before it was narrowed.
  // Where a sheet DOES have side margins it is a cell pretending to be a band,
  // and then both axes are framing rather than geometry, so both get cut.
  if (mL <= 0 && mR <= 0) {
    const note = mT > 0 || mB > 0 ? `edge-to-edge (T${mT} B${mB} left alone — band geometry)` : "already edge-to-edge";
    rows.push(`  ${stem.padEnd(22)} ${String(png.width).padStart(4)}×${String(png.height).padEnd(4)} ${note}`);
    continue;
  }
  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;
  rows.push(`  ${stem.padEnd(22)} ${String(png.width).padStart(4)}×${String(png.height).padEnd(4)} → ${w}×${h}   trimmed L${mL} R${mR} T${mT} B${mB}`);
  if (DRY) continue;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (((y + box.y0) * png.width) + (x + box.x0)) << 2;
      const d = ((y * w) + x) << 2;
      out.data[d] = png.data[s];
      out.data[d + 1] = png.data[s + 1];
      out.data[d + 2] = png.data[s + 2];
      out.data[d + 3] = png.data[s + 3];
    }
  }
  fs.writeFileSync(file, PNG.sync.write(out));
  repaired++;
}

console.log(`trim-loop-margins${DRY ? " (dry)" : ""}:`);
for (const r of rows) console.log(r);
console.log(`\n${DRY ? "would repair" : "repaired"} ${DRY ? rows.filter((r) => r.includes("trimmed")).length : repaired} of ${rows.length} loop stem(s)`);
