#!/usr/bin/env node
/**
 * R6 · DAS SILHOUETTEN-TOR — hält ein Körper-Gemälde seinen Zell-Vertrag?
 *
 * Drei Gesetze, alle am PNG selbst gemessen (nie an einer Selbstauskunft):
 *   1 · KERN-DECKUNG   — das innere 80 %-Fenster jeder Masken-Zelle ist ≥98 % opak.
 *   2 · ALPHA-EHRLICHKEIT — außerhalb von Maske+Overpaint(+Fransen-Gürtel 16 px)
 *       ist ≤0,5 % opak: nichts darf begehbar AUSSEHEN, was es nicht ist.
 *   3 · LAUF-LINIE     — über jeder Steh-Zelle beginnt die Malerei im Fenster
 *       [Zellkante−8 px, Zellkante+2 px]: die gemalte Kante IST die Kollision.
 *
 * Aufrufe:
 *   node scripts/check-body-silhouette.mjs                      # alle CH01_BODIES
 *   node scripts/check-body-silhouette.mjs --sheet <png> --exemplar   # Wareneingang
 *   node scripts/check-body-silhouette.mjs --selftest           # drei Tamper
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { CH01_BODIES, P2_EXEMPLAR_BODY, bodyCells } from "../packages/game-paint/src/visualBodies.ts";
import { glyphAt, isSolid } from "../packages/game-paint/src/collide.ts";

const ART_DIR = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const LEVEL = path.join(process.cwd(), "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const OPAQUE = 128;   // Alpha-Schwelle „sichtbar deckend"
const FAINT = 16;     // Alpha-Schwelle „überhaupt vorhanden" (Gesetz 2)
const FRINGE_PX = 16; // Fransen-Gürtel um Masken-Zellen (K6 erlaubt Überhänge)

const gridOf = (phaseIdx) => JSON.parse(fs.readFileSync(LEVEL, "utf8")).phases[phaseIdx].rows;
const PHASE_INDEX = { p1: 0, p2: 1, p3: 2, p4: 3, p9: 4 };

/** Misst die drei Gesetze eines Körpers an einem PNG. Gibt Fehlerzeilen zurück. */
export const measureBody = (body, png, grid) => {
  const errors = [];
  const px = body.pxPerCell;
  const wantW = Math.max(...body.rows.map((r) => r.length), 1) * px + body.overpaint.l + body.overpaint.r;
  const wantH = body.rows.length * px + body.overpaint.t + body.overpaint.b;
  if (png.width !== wantW || png.height !== wantH) {
    errors.push(`Blattmaß ${png.width}×${png.height}, Vertrag ${wantW}×${wantH}`);
    return errors; // ohne Maß stimmt keine weitere Geometrie
  }
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= png.width || y >= png.height)
    ? 0 : (png.data[(y * png.width + x) * 4 + 3] ?? 0);
  const inMask = new Set();
  body.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) if (row[dc] === "#") inMask.add(`${dc},${dr}`);
  });

  // Gesetz 1 · Kern-Deckung
  for (const key of inMask) {
    const [dc, dr] = key.split(",").map(Number);
    const x0 = body.overpaint.l + dc * px, y0 = body.overpaint.t + dr * px;
    const m = Math.round(px * 0.1);
    let opaque = 0, total = 0;
    for (let y = y0 + m; y < y0 + px - m; y++) {
      for (let x = x0 + m; x < x0 + px - m; x++) { total++; if (alphaAt(x, y) >= OPAQUE) opaque++; }
    }
    if (opaque / total < 0.98) {
      errors.push(`Kern-Deckung Zelle (${body.c0 + dc},${body.r0 + dr}): ${(100 * opaque / total).toFixed(1)} % < 98 %`);
    }
  }

  // Gesetz 2 · Alpha-Ehrlichkeit (mit Fransen-Gürtel um Masken-Zellen)
  const nearMask = (x, y) => {
    const dc = Math.floor((x - body.overpaint.l) / px), dr = Math.floor((y - body.overpaint.t) / px);
    for (let a = dr - 1; a <= dr + 1; a++) {
      for (let b = dc - 1; b <= dc + 1; b++) {
        if (!inMask.has(`${b},${a}`)) continue;
        const cx0 = body.overpaint.l + b * px - FRINGE_PX, cy0 = body.overpaint.t + a * px - FRINGE_PX;
        if (x >= cx0 && x < cx0 + px + 2 * FRINGE_PX && y >= cy0 && y < cy0 + px + 2 * FRINGE_PX) return true;
      }
    }
    return false;
  };
  let outsideTotal = 0, outsideInk = 0;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (nearMask(x, y)) continue;
      outsideTotal++;
      if (alphaAt(x, y) >= FAINT) outsideInk++;
    }
  }
  if (outsideTotal > 0 && outsideInk / outsideTotal > 0.005) {
    errors.push(`Alpha außerhalb Maske+Gürtel: ${(100 * outsideInk / outsideTotal).toFixed(2)} % > 0,50 %`);
  }

  // Gesetz 3 · Lauf-Linie über jeder Steh-Zelle (Zelle im Körper, darüber keine Grid-Masse)
  for (const key of inMask) {
    const [dc, dr] = key.split(",").map(Number);
    const c = body.c0 + dc, r = body.r0 + dr;
    if (grid !== null && isSolid(glyphAt(grid, c, r - 1))) continue; // verdeckt
    if (inMask.has(`${dc},${dr - 1}`)) continue;
    const x0 = body.overpaint.l + dc * px, cellTop = body.overpaint.t + dr * px;
    let first = null;
    for (let y = Math.max(0, cellTop - px); y < cellTop + px && first === null; y++) {
      for (let x = x0 + 2; x < x0 + px - 2; x++) {
        if (alphaAt(x, y) >= OPAQUE) { first = y; break; }
      }
    }
    if (first === null || first < cellTop - 8 || first > cellTop + 2) {
      errors.push(`Lauf-Linie (${c},${r}): erste opake Zeile ${first ?? "—"}, Fenster [${cellTop - 8}, ${cellTop + 2}]`);
    }
  }
  return errors;
};

const synthSheet = (body, mutate) => {
  const px = body.pxPerCell;
  const w = Math.max(...body.rows.map((r) => r.length), 1) * px + body.overpaint.l + body.overpaint.r;
  const h = body.rows.length * px + body.overpaint.t + body.overpaint.b;
  const png = new PNG({ width: w, height: h });
  body.rows.forEach((row, dr) => {
    for (let dc = 0; dc < row.length; dc++) {
      if (row[dc] !== "#") continue;
      for (let y = body.overpaint.t + dr * px; y < body.overpaint.t + (dr + 1) * px; y++) {
        for (let x = body.overpaint.l + dc * px; x < body.overpaint.l + (dc + 1) * px; x++) {
          const i = (y * w + x) * 4;
          png.data[i] = 90; png.data[i + 1] = 70; png.data[i + 2] = 120; png.data[i + 3] = 255;
        }
      }
    }
  });
  mutate?.(png, w, h);
  return png;
};

const selftest = () => {
  // L-Form mit 64er-Zellen: der leere Quadrant (oben rechts) hat jenseits des
  // 16-px-Fransen-Gürtels echtes »Außen«-Territorium für Gesetz 2.
  const body = { id: "st", stem: "st", c0: 1, r0: 1, rows: ["#.", "##"], pxPerCell: 64, overpaint: { l: 0, r: 0, t: 8, b: 8 } };
  const grid = ["....", ".#..", ".##.", "...."];
  const clean = measureBody(body, synthSheet(body), grid);
  if (clean.length !== 0) { console.error("Selbsttest: sauberes Blatt fällt durch:", clean); return 1; }
  const tampers = [
    ["Kern-Loch", (png, w) => { for (let d = 0; d < 40; d++) for (let e = 0; e < 40; e++) png.data[(((8 + 76 + d) * w + 12 + e) * 4) + 3] = 0; }],
    // Geister-Blob mitten im leeren Quadranten (Zelle dc1/dr0), >16 px von jeder Masken-Zelle
    ["Geister-Fläche", (png, w) => { for (let d = 0; d < 28; d++) for (let e = 0; e < 28; e++) { const i = (((8 + 18 + d) * w + 64 + 18 + e) * 4); png.data[i + 3] = 255; png.data[i] = 200; } }],
    ["Lauf-Linie versackt", (png, w) => { for (let x = 0; x < 64; x++) for (let y = 8; y < 8 + 14; y++) png.data[(y * w + x) * 4 + 3] = 0; }],
  ];
  for (const [name, mutate] of tampers) {
    const errors = measureBody(body, synthSheet(body, mutate), grid);
    if (errors.length === 0) { console.error(`Selbsttest-TAMPER "${name}" blieb GRÜN`); return 1; }
  }
  console.log("check-body-silhouette: Selbsttest OK — 1 sauber + 3 Tamper rot");
  return 0;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  const jobs = [];
  if (args.includes("--exemplar")) {
    const sheetIdx = args.indexOf("--sheet");
    const sheet = sheetIdx >= 0 ? args[sheetIdx + 1] : null;
    if (sheet === null) { console.error("--exemplar braucht --sheet <png>"); return 1; }
    jobs.push({ body: P2_EXEMPLAR_BODY, file: sheet, phase: "p2" });
  } else {
    for (const [phase, bodies] of Object.entries(CH01_BODIES)) {
      for (const body of bodies) {
        jobs.push({ body, file: path.join(ART_DIR, `${body.stem}.png`), phase });
      }
    }
  }
  if (jobs.length === 0) { console.log("check-body-silhouette: 0 Körper deklariert — nichts zu messen"); return 0; }
  let failed = 0;
  for (const { body, file, phase } of jobs) {
    if (!fs.existsSync(file)) { console.error(`✗ ${body.id}: Blatt fehlt (${file})`); failed++; continue; }
    const png = PNG.sync.read(fs.readFileSync(file));
    const grid = gridOf(PHASE_INDEX[phase] ?? 0);
    const errors = measureBody(body, png, grid);
    if (errors.length === 0) {
      console.log(`✓ ${body.id} (${bodyCells(body).length} Zellen): alle drei Gesetze halten`);
    } else {
      failed++;
      console.error(`✗ ${body.id}:`);
      for (const e of errors) console.error(`    ${e}`);
    }
  }
  return failed === 0 ? 0 : 1;
};

process.exit(main());
