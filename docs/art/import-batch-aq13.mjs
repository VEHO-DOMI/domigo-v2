// ── R5-W4b · H3 · AQ13 — DIE VOLLGEKRITZELTE TAFEL ──────────────────────────
//
// Codex AQ13 liefert die gemalten Kritzel-Schichten, die H2 prozedural
// vorgebaut hat (`PaintScene.paintScribbleLayer`, viermal überarbeitet und am
// Ende immer noch ein Platzhalter). Drei Blätter, je 2048×512 in vier
// 512er-Zellen, Freistell-Schlüssel `#FF00FF`.
//
// ── WAS DER DRAFT-MARKER GEKOSTET HAT (R91) ─────────────────────────────────
// Die Lieferung trägt „CODEX DRAFT — NOT CANON" im Kopf; aufgelöst wird der
// Marker durch einen BLINDEN Blatt-Prüfer VOR dem Import, nicht durch den
// Lieferschein. Der Prüfer sah nur die PNGs, die Zellordnung und die
// Bestands-Sprites — nicht den Lieferschein, nicht diese Datei:
//
//   Blatt 1 (`tafel_scribble`)      ANGENOMMEN
//   Blatt 2 (`tafel_wipe`)          ANGENOMMEN
//   Blatt 3 (`tafel_faces_scribbled`) ZURÜCKGEWIESEN
//
// Blatt 3 wird deshalb hier NICHT importiert, und das ist eine Messung, keine
// Meinung. Die vier Karten-Porträts sind über Silhouetten-IoU gegen jeden
// Bestands-Körper geprüft worden:
//
//   Zelle 1 → `tafel_a`         IoU 0,991   (der FLIEGENDE Körper)
//   Zelle 2 → `tafel_telegraph` IoU 0,997   ← zurückgezogener Staffelei-Körper
//   Zelle 3 → `tafel_stagger`   IoU 0,987   ← zurückgezogener Staffelei-Körper
//   Zelle 4 → `tafel_sad`       IoU 0,997   ← zurückgezogener Staffelei-Körper
//
// `anim.ts#GUARDIAN_GROUNDED_CELLS` nennt genau diese drei (plus `dazed`) als
// den Körper, den sie NIE tragen darf, solange sie fliegt — der PB-F1-
// Identitätsfehler, gegen den `guardian-flight.test.ts` die ganze Zustands-
// maschine durchfährt. Und die eine Zelle auf einem gültigen Körper sitzt auf
// dem falschen: eine Karte erscheint, während sie GELANDET ist (`land1`), nicht
// im Flug. Null von vier Porträts zeigen den Körper des Kartenmoments. Die
// Karten behalten deshalb ihr heutiges Porträt (`tafel_land1`), und die
// Nachbestellung AQ13b steht als Mess-Tabelle im Report.
//
// ── DIE EINE ABWEICHUNG VOM MUSTER (`import-batch-aq7.mjs`) ─────────────────
// aq7 schneidet jede Zelle auf ihre EIGENE Inhaltsbox. Für ein freistehendes
// Blatt ist das richtig; für ein ÜBERLAGERUNGS-Blatt wirft es genau die
// Information weg, die es transportiert. Die drei Schichten haben drei
// verschiedene Inhaltsboxen (132×128 · 145×133 · 171×184) — auf sich selbst
// getrimmt lägen sie später übereinander statt an ihrem Platz auf der Tafel.
//
// Geschnitten wird deshalb auf EIN gemeinsames Fenster, und zwar auf die
// SCHIEFERTAFEL des Bezugs-Sprites: das Roh-PNG liegt 1:1 zentriert in der
// 512er-Zelle (`(512−w)//2, (512−h)//2`), und innerhalb davon ist die grüne
// Schreibfläche das, worauf gekritzelt wird.
//
//   `tafel_a`    331×397 → Zell-Offset (90,57)  → Schiefertafel (215,125) 181×212
//   `tafel_rest` 304×381 → Zell-Offset (104,65) → Schiefertafel (156,139) 210×207
//
// Damit ist das importierte Blatt DIE Tafelfläche, und die Szene setzt es
// einfach in das Rechteck, das `PaintScene.boardAnchor` ohnehin schon für jede
// Zelle ausrechnet — ohne Fudge-Faktoren, weil Bild und Rechteck dasselbe
// Ding sind.
//
// Zwei Tore laufen je Zelle mit, beide als ZAHL im Protokoll:
//   · Registrierung — kein gemaltes Pixel darf außerhalb des Fensters liegen,
//     und die Pixel außerhalb der grünen MASKE (3 px Toleranz für den
//     Weichzeichner-Saum) bekommen ein Budget statt Vertrauen.
//   · Schlüssel-Abstand ≥ 150 euklidisch, wie in aq7 — mit dem Hinweis, dass
//     die Lieferung ihn mit 0,05–0,52 Marge besteht (ein Clamp bei exakt 150,
//     nicht organischer Abstand). Reißt er nach meinem Schnitt, ist das ein
//     Befund für AQ13b, kein stiller Fix.
//
// Aufruf:  node docs/art/import-batch-aq13.mjs [--dry]

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

/** Der Saum-Schnitt des Importeurs, wörtlich aus `import-batch-aq7.mjs:85-108`
 *  übernommen — dieselbe Regel, damit Tor und Werkzeug nicht zwei Definitionen
 *  desselben Defekts führen (`scripts/key-fringe.mjs:224-227`). */
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

/** Euklidisch, wie in aq7 — die Metrik, für die die 150 geschrieben wurde. */
const keyDistance = (png) => {
  let euclid = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const e = Math.hypot(png.data[i] - 255, png.data[i + 1], png.data[i + 2] - 255);
    if (e < euclid) euclid = e;
  }
  return euclid;
};

/** Die grüne Schreibfläche eines Bestands-Sprites — dieselbe Regel, mit der
 *  die Lieferung ihre eigene Registrierung geprüft hat, damit unsere und ihre
 *  Zahl vergleichbar sind (g deutlich über r und b, nicht dunkel, nicht warm). */
const slateMaskOf = (png) => {
  const { width: W, height: H, data } = png;
  const m = new Uint8Array(W * H);
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a > 200 && g > r * 1.10 && g > b * 1.05 && g > 30 && r < 130) {
        m[y * W + x] = 1;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { m, W, H, box: { x0, y0, x1, y1 } };
};

/** Liegt (x,y) höchstens `tol` px neben der Maske? (Der Weichzeichner-Saum
 *  eines gemalten Strichs kappt sonst eine völlig gesunde Lieferung.) */
const nearMask = (mask, x, y, tol) => {
  for (let dy = -tol; dy <= tol; dy++) {
    for (let dx = -tol; dx <= tol; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= mask.W || ny >= mask.H) continue;
      if (mask.m[ny * mask.W + nx] === 1) return true;
    }
  }
  return false;
};

// ── die Blätter ──────────────────────────────────────────────────────────────
//
// `ref` ist das Bestands-Sprite, gegen das die Zelle registriert ist; das
// Schnittfenster wird daraus GERECHNET (Zentrierung + Schiefertafel), nie
// getippt. `pieces` ist [Zellindex, Stem].
const SHEETS = [
  {
    file: "batch-aq13/tafel_scribble.png",
    cols: 4, rows: 1,
    ref: "tafel_a",
    pieces: [
      [0, "tafel_scribble1"], // die leichte Schicht — ein paar Striche und 2+2
      [1, "tafel_scribble2"], // ABC, NO mit Durchstreichung, Kreisel
      [2, "tafel_scribble3"], // die volle, lange nicht gewischte Tafel
      [3, "tafel_scribble3b"], // dieselbe, um (3,−2) versetzt: das Zittern im Ausholen
    ],
  },
  {
    file: "batch-aq13/tafel_wipe.png",
    cols: 4, rows: 1,
    ref: "tafel_rest",
    // Zellen 0–2 (die drei Wisch-Zwischenbilder) werden NICHT importiert: sie
    // zeigen die volle Schicht 3 mit einem von links wachsenden Loch, gelten
    // also nur für die ERSTE der drei Schichten. Die Engine wischt jede Schicht
    // mit demselben Schnitt (`setCrop`, links→rechts, stufenlos) — drei
    // Standbilder, die nur bei hp = 3 stimmen, wären ein Schwamm, der beim
    // zweiten Wischen verschwindet. Die Bestellung dafür steht in AQ13b:
    // Zwischenbilder JE SCHICHT oder ein Schwamm als eigenes, freies Motiv.
    pieces: [
      [3, "tafel_clean"], // frisch gewischt: feuchter Glanz auf der Ruhe-Zelle
    ],
    held: [0, 1, 2],
  },
];

const failures = [];
const written = [];
const notes = [];

notes.push("· Blatt 3 (`tafel_faces_scribbled`) ist NICHT Teil dieses Imports — blinder Prüfer: ZURÜCKGEWIESEN, 0 von 4 Porträts auf dem Körper des Kartenmoments (Kopf dieser Datei).");

for (const sheet of SHEETS) {
  const src = path.join(LAB, sheet.file);
  if (!fs.existsSync(src)) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const png = read(src);
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }

  // ── das Fenster, GERECHNET aus dem Bezugs-Sprite ───────────────────────────
  const refPng = read(path.join(OUT, `${sheet.ref}.png`));
  const slate = slateMaskOf(refPng);
  const offX = Math.floor((cw - refPng.width) / 2);
  const offY = Math.floor((chh - refPng.height) / 2);
  const win = {
    x: offX + slate.box.x0,
    y: offY + slate.box.y0,
    w: slate.box.x1 - slate.box.x0 + 1,
    h: slate.box.y1 - slate.box.y0 + 1,
  };
  notes.push(
    `· ${sheet.file}: Fenster aus ${sheet.ref} (${refPng.width}×${refPng.height}, zentriert bei ${offX},${offY}) `
    + `→ Schiefertafel (${win.x},${win.y}) ${win.w}×${win.h}`,
  );

  for (const h of sheet.held ?? []) notes.push(`· ZURÜCKGEHALTEN: ${sheet.file} Zelle ${h} — siehe Kopf`);

  for (const [pos, stem] of sheet.pieces) {
    const cellX = (pos % sheet.cols) * cw;
    const cellY = Math.floor(pos / sheet.cols) * chh;
    const cell = chromaKey(crop(png, cellX, cellY, cw, chh));

    // 1 · Registrierung: nichts Gemaltes darf außerhalb des Fensters liegen.
    const cb = contentBox(cell);
    if (cb === null) { failures.push(`${stem}: keyed to nothing`); continue; }
    const outside = cb.x0 < win.x || cb.y0 < win.y || cb.x1 >= win.x + win.w || cb.y1 >= win.y + win.h;
    if (outside) {
      failures.push(
        `${stem}: Malerei außerhalb der Schiefertafel — Inhalt (${cb.x0},${cb.y0})-(${cb.x1},${cb.y1}), `
        + `Fenster (${win.x},${win.y})-(${win.x + win.w - 1},${win.y + win.h - 1}). Die Schicht läge auf Rahmen oder Luft.`,
      );
      continue;
    }

    // 2 · …und wie viel davon liegt neben der grünen MASKE? Zahl, kein Vertrauen.
    let offMask = 0, firstOff = null;
    for (let y = 0; y < chh; y++) {
      for (let x = 0; x < cw; x++) {
        if (cell.data[(y * cw + x) * 4 + 3] <= 8) continue;
        const rx = x - offX, ry = y - offY;
        if (rx < 0 || ry < 0 || rx >= slate.W || ry >= slate.H || !nearMask(slate, rx, ry, 3)) {
          offMask++;
          if (firstOff === null) firstOff = `${x},${y}`;
        }
      }
    }
    const painted = (() => { let n = 0; for (let i = 3; i < cell.data.length; i += 4) if (cell.data[i] > 8) n++; return n; })();
    if (offMask > 40) {
      failures.push(
        `${stem}: ${offMask} gemalte Pixel liegen mehr als 3 px neben der grünen Fläche (zuerst bei ${firstOff}) — `
        + `das Blatt ist gegen ein anderes Sprite registriert als ${sheet.ref}`,
      );
      continue;
    }

    const out = crop(cell, win.x, win.y, win.w, win.h);
    const killed = defringe(out);

    const dist = keyDistance(out);
    if (dist < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
      continue;
    }

    const dest = path.join(OUT, `${stem}.png`);
    const existed = fs.existsSync(dest);
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(
      `${existed ? "overwrote" : "wrote    "} ${stem}.png`.padEnd(34)
      + `${out.width}×${out.height}`.padEnd(10)
      + `${painted} px gemalt`.padEnd(18)
      + `${offMask} px neben der Fläche`.padEnd(26)
      + `${killed} px Saum entfernt`.padEnd(24)
      + `Schlüssel-Abstand ${dist.toFixed(2)}`,
    );
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq13: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq13: OK — ${written.length} stem(s)`);
