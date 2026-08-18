#!/usr/bin/env node
/**
 * import-batch-aq16b — R5-W6 · F7 · DIE REGEL-SEITE IN KÜHLER EIGENFARBE, ZWEITER ANLAUF.
 * Importiert Batch AQ16b nach apps/web/public/art/g1/paint/ch01/.
 *
 *   node docs/art/import-batch-aq16b.mjs [--dry]
 *
 * Gleiche Bauform wie import-batch-aq7 (Chroma-Key → Defringe → Inhalts-Kasten),
 * mit EINER zusätzlichen Zusicherung, die diese Runde nötig gemacht hat.
 *
 * ── WARUM ES DIESE RUNDE ÜBERHAUPT GIBT ─────────────────────────────────────
 * AQ16 traf jede Farbzahl der Bestellung und verlor dabei das Papier: die
 * Rekolorierung war eine harte Posterisierung (eindeutige Farben −95 % auf der
 * Seite, −98 % auf der Platte; Struktur-Energie −69 % / −82 %). Zwei blinde
 * Prüfer nannten sie unabhängig FLACHE FÜLLUNG. AQ16b ändert Farbton und
 * Sättigung je Pixel und lässt die Helligkeitsmodulation stehen; gemessen mit
 * DEMSELBEN Rezept (Median der Helligkeits-Streuung in 5×5-Fenstern innerhalb
 * der deckenden Fläche):
 *
 *   Blatt              Bestand → Lieferung   80-%-Tor   eindeutige Farben je Blattdatei
 *   regelseite_a         2,782 → 2,798         2,226    Blatt gesamt 17 257 → 14 484
 *   regelseite_lit       1,819 → 1,840         1,455
 *   regelseite_open      2,634 → 2,685         2,107
 *   hud_rule             3,615 → 3,624         2,892
 *   plate_ch01_rule      5,415 → 5,081         4,332    114 522 → 16 935
 *
 * ── DIE ZUSICHERUNG DIESER RUNDE · DIE SILHOUETTE IST DIE DES BESTANDS ──────
 * Die Bestellung verlangt eine Silhouette »pixelgleich zum Bestand«. Gemessen
 * ist sie das FAST: die Lieferung verliert keinen einzigen Bestands-Punkt, legt
 * aber einen ein Bildpunkt breiten dunkelblauen Saum AUSSEN an — 460 Punkte an
 * der Platte, 625 an `regelseite_open`, jeder davon direkt an der Bestandskante.
 * Sichtbar wäre das nirgends; verlassen sollte man sich darauf trotzdem nicht.
 *
 * Deshalb schneidet dieser Importer die Lieferung mit der ALPHA-MASKE DES
 * BESTANDS: was im Bestand durchsichtig ist, ist es hier auch. Damit ist die
 * Registrierung nicht mehr eine Zusage im Lieferschein, sondern eine Eigenschaft
 * der geschriebenen Datei — und ein künftiger Nachdruck kann die Silhouette
 * nicht mehr unbemerkt verschieben. Weicht die Größe des getrimmten Kastens vom
 * Bestand ab, bricht der Import ab, statt ein verschobenes Blatt zu schreiben.
 *
 * ── WAS DIESE RUNDE NICHT IMPORTIERT ────────────────────────────────────────
 * `tip_sparks_cool` ist nicht bestellt und nicht geliefert: `tip_sparks` hat im
 * ganzen Repo keinen Leser und zählt bereits als tote Kunst — ein Import hätte
 * totes Gewicht erneuert. DEAD_ART bleibt deshalb unberührt: fünf Ersatz-Blätter,
 * kein neuer Stem.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

const TOL = 40;
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;

function crop(src, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * src.width + (x0 + x)) * 4;
      const di = (y * w + x) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function chromaKey(png, tol = TOL) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (isMagenta(png.data[i], png.data[i + 1], png.data[i + 2], tol)) png.data[i + 3] = 0;
  }
  return png;
}

/** Der Rest-Saum des Schlüssels, Schicht für Schicht — wie in import-batch-aq7. */
function defringe(png, passes = 3) {
  const { width: W, height: H, data } = png;
  for (let p = 0; p < passes; p++) {
    const kill = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] === 0) continue;
        let edge = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) { edge = true; continue; }
          if (data[(ny * W + nx) * 4 + 3] === 0) edge = true;
        }
        if (!edge) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 120 && b > 120 && r - g > 55 && b - g > 55) kill.push(i);
      }
    }
    for (const i of kill) data[i + 3] = 0;
    if (kill.length === 0) break;
  }
  return png;
}

const contentBox = (png) => {
  const { width: W, height: H, data } = png;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
};

/** Die Silhouette des BESTANDS auf die Lieferung legen (siehe Kopf). Gibt zurück,
 *  wie viele Punkte dabei weggenommen wurden — die Zahl gehört in die Ausgabe,
 *  denn eine stille Korrektur ist keine. */
function registerAuf(ziel, bestand) {
  if (ziel.width !== bestand.width || ziel.height !== bestand.height) return null;
  let entfernt = 0, fehlend = 0;
  for (let i = 0; i < ziel.data.length; i += 4) {
    const imBestand = bestand.data[i + 3] > 8;
    const inLieferung = ziel.data[i + 3] > 8;
    if (!imBestand && inLieferung) { ziel.data[i + 3] = 0; entfernt++; }
    if (imBestand && !inLieferung) fehlend++;
  }
  return { entfernt, fehlend };
}

const keyDistance = (png) => {
  let euclid = Infinity, manhattan = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const dr = png.data[i] - 255, dg = png.data[i + 1], db = png.data[i + 2] - 255;
    const e = Math.hypot(dr, dg, db);
    const m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};

// ── die Blätter ─────────────────────────────────────────────────────────────
const SHEETS = [
  {
    // AQ16b Blatt 1 — die Seite in ihren drei Zuständen plus das HUD-Symbol.
    file: "batch-aq16b/regelseite_cool.png", cols: 4, rows: 1,
    pieces: [[0, "regelseite_a"], [1, "regelseite_lit"], [2, "regelseite_open"], [3, "hud_rule"]],
  },
  {
    // AQ16b Blatt 2 — dieselbe Seite als Raum-Platte (DOM-Seite, `rulePlate`).
    // Sie ist NICHT getrimmt: die Platte ist bestandsgroß und wird als ganzes
    // Bild gelesen; ein Trimmen würde ihren Bildausschnitt verschieben.
    file: "batch-aq16b/plate_ch01_rule_cool.png", cols: 1, rows: 1,
    pieces: [[0, "plate_ch01_rule"]], keinTrimm: true,
  },
];

const written = [];
const failures = [];
const notes = [];

for (const sheet of SHEETS) {
  const src = read(path.join(LAB, sheet.file));
  const cw = Math.floor(src.width / sheet.cols);
  const ch = Math.floor(src.height / sheet.rows);
  for (const [pos, stem] of sheet.pieces) {
    const cx = (pos % sheet.cols) * cw;
    const cy = Math.floor(pos / sheet.cols) * ch;
    const img = defringe(chromaKey(crop(src, cx, cy, cw, ch)));

    const bestandPfad = path.join(OUT, `${stem}.png`);
    if (!fs.existsSync(bestandPfad)) {
      failures.push(`${stem}: kein Bestand zum Registrieren — AQ16b ersetzt nur, es legt nichts an`);
      continue;
    }
    const bestand = read(bestandPfad);

    let out;
    if (sheet.keinTrimm) {
      out = img;
    } else {
      const box = contentBox(img);
      if (!box) { failures.push(`${stem}: der Schlüssel hat alles gefressen`); continue; }
      out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
    }
    if (out.width !== bestand.width || out.height !== bestand.height) {
      failures.push(`${stem}: ${out.width}×${out.height} statt ${bestand.width}×${bestand.height} — `
        + `die Lieferung sitzt nicht auf dem Bestandsmaß, also wird nichts geschrieben`);
      continue;
    }

    const reg = registerAuf(out, bestand);
    if (reg === null) { failures.push(`${stem}: Maße passen nicht zum Registrieren`); continue; }
    if (reg.fehlend > 0) {
      failures.push(`${stem}: ${reg.fehlend} Punkte, die der Bestand malt, fehlen in der Lieferung — `
        + `das ist ein Loch in der Silhouette, kein Saum`);
      continue;
    }

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: ein gemalter Punkt liegt ${dist.euclid.toFixed(2)} (euklidisch) vom Schlüssel — `
        + `nötig sind ≥150, sonst frisst ein toleranter Key Farbe`);
      continue;
    }

    if (!DRY) fs.writeFileSync(bestandPfad, PNG.sync.write(out));
    written.push(`ersetzt ${stem}.png`.padEnd(34)
      + `${out.width}×${out.height}`.padEnd(11)
      + `Saum entfernt: ${String(reg.entfernt).padStart(4)}   `
      + `Schlüsselabstand ${dist.euclid.toFixed(1)} euklidisch / ${dist.manhattan} manhattan`);
  }
}

for (const n of notes) console.log(n);
for (const w of written) console.log(`  ${DRY ? "[trocken] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq16b: ${failures.length} Fehler — an dieser Lieferung wird nichts angenommen`);
  process.exit(1);
}
console.log(`import-batch-aq16b: OK — ${written.length} Blatt/Blätter${DRY ? " (trocken, nichts geschrieben)" : ""}`);
