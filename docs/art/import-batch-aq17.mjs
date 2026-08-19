#!/usr/bin/env node
/**
 * import-batch-aq17 — R5-W6b · D4 · R155 (Kokis Tor T6 = c) · DAS GEMALTE
 * KARTEN-MATERIAL: das Papier der Karte und die Knopf-Zellen.
 * Imports batch AQ17 into apps/web/public/art/g1/cards/.
 *
 *   node docs/art/import-batch-aq17.mjs [--dry]
 *
 * ── WARUM DIESE BLÄTTER NICHT UNTER art/g1/paint/ LANDEN ─────────────────────
 * Dieselbe Begründung wie bei AQ11 (import-batch-aq11.mjs): `check-paint-art`
 * zählt jedes PNG unter `paint/**`, das weder Phaser noch `artScope.domArtStems`
 * lädt, als TOTE Kunst. Ein Karten-Untergrund lädt aber der BROWSER über
 * `background-image`, nicht die Engine — er wäre also auf ewig eine tote Zeile
 * in einer Liste, die genau dann nützlich ist, wenn sie stimmt. Deshalb der
 * eigene Ordner neben dem Kunstbaum, in dem schon `card_edge_a.png` liegt.
 * Die Decke DEAD_ART_CEILING bleibt davon unberührt: 53 vorher, 53 nachher.
 *
 * ── WAS AUS DIESER LIEFERUNG KOMMT UND WAS NICHT (Wareneingang R168) ─────────
 * Fable hat die sieben Blätter am Bild gemessen. Zwei sind importfähig, drei
 * gehen zurück (AQ17b), zwei sind Beweisbilder:
 *
 *   ANGENOMMEN  card_paper.png    beidachsig kachelbar, undurchsichtig
 *   ANGENOMMEN  card_buttons.png  vier 512er Zellen: Ruhe · gedrückt · Ghost · Reserve
 *   ZURÜCK      card_frame.png / card_frame_inner.png — der Wiederhol-Streifen
 *               trägt seine Lücke an EINER festen Stelle, also kehrt sie bei
 *               jeder Kachel wieder (8,59× statt ≤ 1,5×). Das ist derselbe
 *               Kernfehler wie bei AQ11, und er ist nicht durch Zahlen im
 *               Stylesheet zu heilen. Die Kartenkante bleibt Code.
 *   ZURÜCK      card_plaques.png — ein einheitlicher Eckradius, wo die Karte
 *               vier verschiedene trägt (--pb-chip-r: 18/9/20/11).
 *   BEWEISBILD  card_frame_seam_test.png / card_paper_seam_test.png
 *
 * ── WAS DIESE DATEI NACHMISST STATT ES ZU GLAUBEN ────────────────────────────
 * Der Lieferschein nennt Zahlen; ein Lieferschein ist keine Messung. Geprüft
 * wird hier alles, worauf das Stylesheet sich verlässt: Format, Undurchsichtig-
 * keit des Papiers, die Kachelgrenzen in BEIDEN Achsen, die vier Zellenkästen
 * des Knopfblattes (aus denen die Hintergrund-Rechnung im CSS entsteht) und der
 * Kontrast Knopf gegen Papier. Ein Blatt, das hier durchfällt, wird nicht
 * importiert — auch nicht »vorläufig«.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/cards");
const DRY = process.argv.includes("--dry");

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const at = (png, x, y) => {
  const i = (y * png.width + x) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
};

/** relative Helligkeit nach WCAG — dieselbe Rechnung wie in den Farb-Toren */
const lum = ([r, g, b]) => {
  const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = lum(a) >= lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};

/** mittlere Farbe eines Rechtecks, nur über SICHTBARE Punkte */
const meanOf = (png, x0, y0, x1, y1) => {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const [pr, pg, pb, pa] = at(png, x, y);
      if (pa <= 8) continue;
      r += pr; g += pg; b += pb; n++;
    }
  }
  return n === 0 ? null : [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
};

/** Mittlerer Farbabstand zweier Bildpunkt-Reihen. An der Kachelgrenze steht
 *  der Sprung von der letzten zur ersten Spalte gegen den Sprung, den die
 *  Textur mit sich selbst macht — eine Naht ist nur dann eine, wenn sie
 *  DEUTLICHER ist als das eigene Rauschen. */
const rowStep = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (Math.abs(a[i][0] - b[i][0]) + Math.abs(a[i][1] - b[i][1]) + Math.abs(a[i][2] - b[i][2])) / 3;
  return s / a.length;
};

const failures = [];
const notes = [];
const SEAM_MAX = 1.5; // Naht darf höchstens 1,5× so laut sein wie die Textur selbst

const src = (f) => {
  const p = path.join(LAB, "batch-aq17", f);
  if (!fs.existsSync(p)) { console.error(`✗ Quellblatt fehlt: ${p}`); process.exit(1); }
  return p;
};

// ── DAS PAPIER ───────────────────────────────────────────────────────────────
const paper = read(src("card_paper.png"));
if (paper.width !== 512 || paper.height !== 512) {
  failures.push(`card_paper.png: ${paper.width}×${paper.height} statt 512×512`);
}
{
  let clear = 0, magenta = 0;
  for (let i = 0; i < paper.data.length; i += 4) {
    const [r, g, b, a] = [paper.data[i], paper.data[i + 1], paper.data[i + 2], paper.data[i + 3]];
    if (a < 255) clear++;
    if (a > 8 && r > 200 && b > 200 && g < 60) magenta++;
  }
  if (clear > 0) failures.push(`card_paper.png: ${clear} Punkte sind nicht voll deckend — der Untergrund einer Karte muss decken`);
  else notes.push("✓ Papier deckt vollständig (kein einziger halbdurchsichtiger Punkt)");
  if (magenta > 0) failures.push(`card_paper.png: ${magenta} sichtbare Magenta-Punkte — Schlüsselfarbe im fertigen Blatt`);
  else notes.push("✓ kein sichtbares Magenta im Papier");
}
{
  const col = (x) => Array.from({ length: paper.height }, (_, y) => at(paper, x, y));
  const row = (y) => Array.from({ length: paper.width }, (_, x) => at(paper, x, y));
  const hSeam = rowStep(col(paper.width - 1), col(0));
  const hOwn = rowStep(col(0), col(1));
  const vSeam = rowStep(row(paper.height - 1), row(0));
  const vOwn = rowStep(row(0), row(1));
  const hR = hSeam / hOwn, vR = vSeam / vOwn;
  if (hR > SEAM_MAX || vR > SEAM_MAX) {
    failures.push(`card_paper.png: Kachelgrenze sichtbar — waagrecht ${hR.toFixed(2)}×, senkrecht ${vR.toFixed(2)}× (erlaubt ≤ ${SEAM_MAX}×)`);
  } else {
    notes.push(`✓ Kachelgrenzen: waagrecht ${hR.toFixed(2)}× · senkrecht ${vR.toFixed(2)}× der eigenen Textur (≤ ${SEAM_MAX}×)`);
  }
  const mean = meanOf(paper, 0, 0, paper.width - 1, paper.height - 1);
  notes.push(`· Papier-Mittel: rgb(${mean.join(", ")}) — das Stylesheet-Papier --pb-paper ist #fff2cd = rgb(255, 242, 205)`);
}

// ── DAS KNOPFBLATT ───────────────────────────────────────────────────────────
const buttons = read(src("card_buttons.png"));
const CELL = 512;
if (buttons.width !== 4 * CELL || buttons.height !== CELL) {
  failures.push(`card_buttons.png: ${buttons.width}×${buttons.height} statt ${4 * CELL}×${CELL} — die Zellenrechnung im CSS gilt dann nicht mehr`);
}
const boxes = [];
if (buttons.width === 4 * CELL && buttons.height === CELL) {
  for (let c = 0; c < 4; c++) {
    let x0 = CELL, x1 = -1, y0 = CELL, y1 = -1;
    for (let y = 0; y < CELL; y++) {
      for (let x = 0; x < CELL; x++) {
        if (at(buttons, c * CELL + x, y)[3] <= 8) continue;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < 0) { failures.push(`card_buttons.png: Zelle ${c} ist vollständig leer`); continue; }
    boxes.push({ c, x0, x1, y0, y1 });
    notes.push(`· Zelle ${c}: gemalter Kasten x ${x0}–${x1} · y ${y0}–${y1} (${x1 - x0 + 1}×${y1 - y0 + 1})`);
  }
  // Der Rand JEDER Zelle muss leer sein, sonst laufen zwei Zellen ineinander,
  // sobald das Blatt im Hintergrund verschoben wird.
  for (const b of boxes) {
    if (b.x0 < 8 || b.x1 > CELL - 9) failures.push(`card_buttons.png: Zelle ${b.c} reicht bis an ihren Zellenrand (x ${b.x0}–${b.x1}) — beim Verschieben blutet die Nachbarzelle herein`);
  }
  // Die drei benutzten Zellen müssen dieselbe BREITE haben: das CSS rechnet mit
  // EINEM Kasten für alle Zustände, ein breiterer Ghost würde springen.
  const used = boxes.filter((b) => b.c < 3);
  const widths = used.map((b) => b.x1 - b.x0 + 1);
  if (Math.max(...widths) - Math.min(...widths) > 4) {
    failures.push(`card_buttons.png: die drei Zustände sind verschieden breit (${widths.join(" / ")}) — der Knopf würde beim Drücken die Breite wechseln`);
  } else {
    notes.push(`✓ die drei Zustände sind gleich breit (${widths.join(" / ")} px, Abweichung ≤ 4)`);
  }
  // …und der Kontrast gegen das Papier, auf dem sie liegen (Kokis 1,3 : 1).
  const paperMean = meanOf(paper, 0, 0, paper.width - 1, paper.height - 1);
  for (const b of used) {
    const inner = meanOf(buttons, b.c * CELL + b.x0 + 40, b.y0 + 40, b.c * CELL + b.x1 - 40, b.y1 - 40);
    const k = contrast(inner, paperMean);
    if (k < 1.3) failures.push(`card_buttons.png: Zelle ${b.c} steht nur ${k.toFixed(3)} : 1 gegen das Papier (gefordert ≥ 1,3 : 1)`);
    else notes.push(`✓ Zelle ${b.c} gegen Papier: ${k.toFixed(3)} : 1 — rgb(${inner.join(", ")})`);
  }
}
{
  let magenta = 0;
  for (let i = 0; i < buttons.data.length; i += 4) {
    const [r, g, b, a] = [buttons.data[i], buttons.data[i + 1], buttons.data[i + 2], buttons.data[i + 3]];
    if (a > 8 && r > 200 && b > 200 && g < 60) magenta++;
  }
  if (magenta > 0) failures.push(`card_buttons.png: ${magenta} sichtbare Magenta-Punkte`);
  else notes.push("✓ kein sichtbares Magenta im Knopfblatt");
}

const HELD = [
  ["card_frame.png", "Rahmen — die Wiederhol-Naht des Kantenstücks springt bei »border-image-repeat: round« auf das 8,59-fache der eigenen Textur (genau EINE feste Lücke je Seite, der Kernfehler von AQ11); zurück als AQ17b"],
  ["card_frame_inner.png", "Innenlinie zum obigen Rahmen — dieselbe Lieferung, dieselbe Naht"],
  ["card_plaques.png", "Plaketten — einheitlicher Eckradius, wo die Karte vier verschiedene trägt (--pb-chip-r); zurück als AQ17b"],
  ["card_frame_seam_test.png", "Nahttest des Rahmens — Beweisbild der Lieferung, kein Importgut"],
  ["card_paper_seam_test.png", "Nahttest des Papiers — Beweisbild der Lieferung, kein Importgut"],
];
for (const [f, why] of HELD) notes.push(`· IM LABOR GEHALTEN: batch-aq17/${f} — ${why}`);

for (const n of notes) console.log(n);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq17: ${failures.length} Befund(e) — nichts aus dieser Lieferung wird angenommen`);
  process.exit(1);
}

if (!DRY) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.copyFileSync(src("card_paper.png"), path.join(OUT, "card_paper.png"));
  fs.copyFileSync(src("card_buttons.png"), path.join(OUT, "card_buttons.png"));
}
console.log(`  ${DRY ? "[trocken] " : ""}batch-aq17/card_paper.png    →  art/g1/cards/card_paper.png     ${paper.width}×${paper.height}`);
console.log(`  ${DRY ? "[trocken] " : ""}batch-aq17/card_buttons.png  →  art/g1/cards/card_buttons.png   ${buttons.width}×${buttons.height} (4 × ${CELL}²)`);
console.log(`import-batch-aq17: OK — 2 Blätter${DRY ? " (Trockenlauf, nichts geschrieben)" : ""}, 5 im Labor gehalten`);
