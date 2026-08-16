#!/usr/bin/env node
/**
 * R5-W4b · C3 · IMPORT BATCH AQ15 — die richtige Merle im Käfig.
 *
 * Koki hat im Federpennal-Käfig »das alte Mädchen« gesehen. Die Vermutung war,
 * die Insassen-Zellen `merle_caged0/1` zeigten eine ältere Figur. Codex hat beim
 * Bauen von AQ15 nachgesehen und das WIDERLEGT: die beiden Zellen zeigen längst
 * Merle mit Zöpfen und grünem Kleid — das alte dunkelhaarige Gesicht steckt in
 * `pencilcase_a.png`, hinter das Gitter GEMALT, als Teil der Käfig-Kunst (R93).
 * Nicht der Insasse ist alt; das Fenster des Pennals malt einen.
 *
 * Dieser Import bringt daher NUR die gedämpften Gefangenen-Zellen. Das Leeren des
 * Fensters (AQ15b) ist durchgefallen — siehe unten.
 *
 *   · `merle_caged0` ← AQ15 `merle_caged_v2.png` Zelle 1 (Bestandsmaß 268×383)
 *   · `merle_caged1` ← AQ15 `merle_caged_v2.png` Zelle 2 (Bestandsmaß 265×389)
 *
 * NICHT importiert:
 *   · Zelle 3 (»halb wach«, ein Auge offen) und `merle_hop.png` (Absprung,
 *     Scheitel, Landung, Nachfedern). Beides ist Animation und Feel, also
 *     F-Lane-Arbeit (RAHMEN §5) — F6 in Welle 5. Ein importiertes Blatt, das
 *     nichts lädt, wäre totes Gewicht, das die Kunst-Prüfung mitschleppt
 *     (DEAD_ART steht bei 57/61 und die Decke gehört W3, R90). Geliefert und
 *     unverdrahtet, im Report benannt. D-226.
 *
 *   · `pencilcase_a` und `pencilcase_shake` ← AQ15b, BEIDE DURCHGEFALLEN.
 *     Ein blinder Prüfer hat bei acht- bis zehnfacher Vergrößerung beide Zellen
 *     als defekt gelesen, und eine eigene Nachprüfung bei dreifacher
 *     Vergrößerung bestätigt es: der obere Querstab franst zu einer gepunkteten
 *     1-Pixel-Spur aus und verschwindet vor dem rechten Fensterrand, der untere
 *     Querstab fehlt ganz, vereinzelte dunkle Sprenkel schweben in der leeren
 *     Fläche, und die Innenkante des Rahmens ist ausgefranst.
 *
 *     Messtechnisch war die Lieferung sonst tadellos — außerhalb des Fensters
 *     weicht Zelle 1 in ZWEI Pixeln vom Bestand ab, und es wurde KEIN einziger
 *     Pixel hinzugemalt (nur 24 424 im Fenster entfernt). Der Fehler liegt allein
 *     darin, WAS mitentfernt wurde: Codex hat nach FARBE geschlüsselt, und die
 *     Stäbe sind im Bestand fast reines Schwarz — genau wie Teile der alten
 *     Gesichtskontur. Eine Farbauswahl kann die beiden nicht trennen.
 *
 *     ★ LEHRE, die den Prüf-Aufbau selbst betrifft: diese Session hatte Zelle 1
 *     zunächst als sauber durchgewunken — geprüft auf BLATTGRÖSSE (2048×512),
 *     wo das Pennal 480×275 misst und ein einen Pixel breiter, ausgefranster Stab
 *     schlicht nicht darstellbar ist. Der blinde Prüfer hat am Ausschnitt
 *     gearbeitet und behielt recht. Ein Kritiker kann nur beurteilen, was das
 *     Bild bei beurteilbarer Größe hergibt. AQ15c ist mit beiden Zellen und mit
 *     einer Stab-Vollständigkeitsprüfung neu bestellt. D-224, D-225.
 *
 * ── DER BLINDE BLATT-PRÜFER (R91) ────────────────────────────────────────────
 *   MERLE — ANGENOMMEN. »A und B zeigen dieselbe Person in derselben Pose, nur
 *   anders eingefärbt — JA.« Der Prüfer bekam die neue und die alte Zelle ohne zu
 *   wissen, welche welche ist, und beschrieb beide unabhängig als dasselbe
 *   Mädchen: »zwei braune Zöpfe mit Pony, dasselbe olivgrüne Kleid mit
 *   cremefarbenem Kragen und goldenem Medaillon, dieselbe müde-besorgte Mimik,
 *   dieselben weißen Handschuhe, dasselbe bunte Armband in der linken Hand,
 *   dieselben braunen Schnürschuhe.« Silhouette deckungsgleich bis auf 16
 *   Randpixel Antialiasing. Und er hat die verlangte Dämpfung unabhängig
 *   GEMESSEN, an jeder Fläche gleich gerichtet — Kleid 67 % → 38 % Sättigung,
 *   Haar 82 % → 55 %, Haut 94 % → 57 %, Schuh 79–87 % → 53–59 %: »ein
 *   gleichmäßiger, globaler Dämpfungs-Effekt über die ganze Figur … bewusste
 *   Gestaltung, nicht ein Fehler.«
 *
 *   Das ist der Grund, warum die Insassen-Schicht (R103) ohne eine einzige Zeile
 *   Abdunkelungs-Code auskommt: die Dämpfung steckt im Blatt, so wie sie bei den
 *   `captive_*`-Blättern auch im Blatt steckt.
 *
 * Maschinerie und Begründungen der Zusatzprüfungen: siehe `import-batch-aq12.mjs`
 * (Größen-Vertrag von der Platte, Bestands-Schablone gegen Alpha-Geister,
 * Schlüssel-Reinheit, defringe-Prädikat wörtlich wie aq7).
 *
 * ⚠ KEIN gemeinsamer Zuschnittkasten. `merle_caged0` (268×383) und
 *   `merle_caged1` (265×389) sind NICHT maßgleich und haben keinen
 *   Kongruenz-Vertrag — anders als ein Kreuzblend-Paar. Jede Zelle wird auf
 *   ihrem eigenen Inhaltskasten getrimmt und einzeln gegen ihr Bestandsmaß
 *   gehalten. Der gemeinsame Kasten aus aq7 wäre hier ein Fehler.
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

/** VERBATIM aus aq7 — das Prädikat liegt als Kopie in `scripts/key-fringe.mjs`. */
function defringe(png, passes = 3) {
  const { width: W, height: H, data } = png;
  let killed = 0;
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
    killed += kill.length;
    if (kill.length === 0) break;
  }
  return killed;
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

const impureKey = (png) => {
  let n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (!isMagenta(r, g, b)) continue;
    if (r !== 255 || g !== 0 || b !== 255) n++;
  }
  return n;
};

function stencil(out, incumbent) {
  let ghosts = 0, holes = 0;
  for (let i = 0; i < out.data.length; i += 4) {
    const here = out.data[i + 3] > 8;
    const there = incumbent.data[i + 3] > 8;
    if (here && !there) { out.data[i + 3] = 0; ghosts++; }
    else if (!here && there) holes++;
  }
  return { ghosts, holes };
}

/** Wie stark ein Blatt entsättigt ist — die Zahl, an der die »Dämpfung« hängt.
 *  Sie wird gedruckt, weil R103 sich darauf verlässt, dass das BLATT die
 *  Dämpfung trägt und kein Code sie nachreichen muss. */
const meanSaturation = (png) => {
  let n = 0, s = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 200) continue;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    s += mx === 0 ? 0 : (mx - mn) / mx;
    n++;
  }
  return n === 0 ? 0 : s / n;
};

const SHEETS = [
  {
    file: "batch-aq15/merle_caged_v2.png", cols: 4, rows: 1,
    pieces: [[0, "merle_caged0"], [1, "merle_caged1"]],
    note: "MERLE gefangen, gedämpft · Prüfer: ANGENOMMEN · Zelle 3 (halb wach) + merle_hop bleiben für F6",
  },
];

const notes = [];
const written = [];
const failures = [];

const sheetOf = (rel) => {
  const p = path.join(LAB, rel);
  return fs.existsSync(p) ? read(p) : null;
};

for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (png === null) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }
  notes.push(`· ${sheet.note}`);

  for (const [pos, stem] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * chh, cw, chh);
    const impure = impureKey(img);
    chromaKey(img);
    const fringed = defringe(img);

    const box = contentBox(img);
    if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
    const out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);

    const dest = path.join(OUT, `${stem}.png`);
    if (!fs.existsSync(dest)) {
      failures.push(`${stem}: this import REPLACES an existing sheet, but ${dest} is not on disk`);
      continue;
    }
    const incumbent = read(dest);
    if (out.width !== incumbent.width || out.height !== incumbent.height) {
      failures.push(`${stem}: cut to ${out.width}×${out.height}, the sheet it replaces is ${incumbent.width}×${incumbent.height} — the card portrait and the world both anchor on this box`);
      continue;
    }

    const satBefore = meanSaturation(incumbent);
    const { ghosts, holes } = stencil(out, incumbent);
    const satAfter = meanSaturation(out);

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.euclid.toFixed(2)} (Euclidean) from the import colour — needs ≥150`);
      continue;
    }

    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(
      `overwrote ${stem}.png`.padEnd(30)
      + `${out.width}×${out.height}`.padEnd(10)
      + `key ${dist.euclid.toFixed(1)}e/${dist.manhattan}m`.padEnd(20)
      + `Saum ${String(fringed).padStart(4)}  unrein ${String(impure).padStart(4)}  `
      + `Geister ${String(ghosts).padStart(4)}  Löcher ${String(holes).padStart(4)}  `
      + `Sättigung ${satBefore.toFixed(3)} → ${satAfter.toFixed(3)}`,
    );
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
console.log("  Löcher = Pixel, die der Bestand malt und die Lieferung nicht — bei »pixelidentischer Silhouette« muss das 0 sein.");
console.log("  Sättigung = die Dämpfung, auf die sich R103 verlässt (das Blatt trägt sie, nicht der Code).");
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq15: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq15: OK — ${written.length} stem(s)${DRY ? " (dry run, nothing written)" : ""}`);
