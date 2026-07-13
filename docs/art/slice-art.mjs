#!/usr/bin/env node
/**
 * ART-2 · slice-art — turn ONE generated sheet image into N true-alpha tiles.
 *
 * WHY (Koki, 2026-07-14): generating tiles one-by-one is tedious, and image
 * generators keep FAKING transparency (painting a checkerboard INTO the pixels).
 * So the pipeline stops trusting them: sheets are generated on a SOLID chroma
 * background (magenta #FF00FF by default), and THIS tool crops each cell and
 * chroma-keys the background to real alpha. Transparency is enforced here,
 * never hoped for from the generator.
 *
 * Usage:
 *   node docs/art/slice-art.mjs --sheet <sheet.png> --manifest <sheet.manifest.json> [--out <dir>]
 *   node docs/art/slice-art.mjs --self-test
 *
 * Sheet manifest shape (one per sheet, lives next to the prompt library):
 *   {
 *     "keyColor": "#FF00FF",     // the solid background the prompt demands
 *     "tolerance": 90,            // Euclidean RGB distance treated as background
 *     "cols": 4, "rows": 3,      // the grid the prompt demands
 *     "cells": [                  // row-major; omit cells that are padding
 *       { "stem": "floor",      "col": 0, "row": 0, "opaque": true  },
 *       { "stem": "soup_pot",   "col": 1, "row": 0 },                 // transparent prop
 *       { "stem": "npc_down",   "col": 2, "row": 0 }
 *     ]
 *   }
 * Cell size = imageWidth/cols × imageHeight/rows (the prompt pins the grid, the
 * image pins the pixels — no hardcoded dimensions to drift). `opaque: true`
 * cells (ground/wall tiles are seamless-opaque by design) skip the chroma-key.
 * Downstream sizing stays in prep-art.mjs (`--resize`); this tool only slices
 * and keys. Output: <out>/<stem>.png (default: alongside the sheet).
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

function parseArgs(argv) {
  const a = { sheet: null, manifest: null, out: null, selfTest: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === "--sheet") a.sheet = v();
    else if (k === "--manifest") a.manifest = v();
    else if (k === "--out") a.out = v();
    else if (k === "--self-test") a.selfTest = true;
    else throw new Error(`unknown flag ${k}`);
  }
  return a;
}

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`bad keyColor ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Crop one cell out of the sheet. */
function crop(sheet, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * sheet.width + (x0 + x)) << 2;
      const di = (y * w + x) << 2;
      out.data[di] = sheet.data[si];
      out.data[di + 1] = sheet.data[si + 1];
      out.data[di + 2] = sheet.data[si + 2];
      out.data[di + 3] = sheet.data[si + 3];
    }
  }
  return out;
}

/** Chroma-key: every pixel within `tol` RGB distance of key → fully transparent. */
function chromaKey(png, key, tol) {
  let keyed = 0;
  const tol2 = tol * tol;
  for (let i = 0; i < png.data.length; i += 4) {
    const dr = png.data[i] - key.r;
    const dg = png.data[i + 1] - key.g;
    const db = png.data[i + 2] - key.b;
    if (dr * dr + dg * dg + db * db <= tol2) {
      png.data[i + 3] = 0;
      keyed++;
    }
  }
  return keyed;
}

function slice({ sheetPath, manifestPath, outDir }) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const sheet = PNG.sync.read(fs.readFileSync(sheetPath));
  const key = hexToRgb(manifest.keyColor ?? "#FF00FF");
  const tol = manifest.tolerance ?? 90;
  const cellW = Math.floor(sheet.width / manifest.cols);
  const cellH = Math.floor(sheet.height / manifest.rows);
  const out = outDir ?? path.dirname(sheetPath);
  fs.mkdirSync(out, { recursive: true });

  const receipt = [];
  for (const cell of manifest.cells) {
    const png = crop(sheet, cell.col * cellW, cell.row * cellH, cellW, cellH);
    const keyed = cell.opaque ? 0 : chromaKey(png, key, tol);
    const file = path.join(out, `${cell.stem}.png`);
    fs.writeFileSync(file, PNG.sync.write(png));
    const total = cellW * cellH;
    receipt.push({ stem: cell.stem, file, keyedPct: Math.round((keyed / total) * 100), opaque: !!cell.opaque });
  }
  return { receipt, cellW, cellH };
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "slice-art-"));
  const key = { r: 255, g: 0, b: 255 };
  // Synthetic 2×2 sheet, 64px cells: each cell = a 24px colored square centered
  // on solid magenta (cells 0-2), cell 3 = fully colored (an "opaque" tile).
  const W = 128, H = 128, CELL = 64;
  const sheet = new PNG({ width: W, height: H });
  const colors = [ [255, 0, 0], [0, 200, 0], [0, 0, 255], [200, 180, 40] ];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) << 2;
    const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
    const c = colors[cy * 2 + cx];
    const inSquare = (x % CELL) >= 20 && (x % CELL) < 44 && (y % CELL) >= 20 && (y % CELL) < 44;
    const isOpaqueCell = cy === 1 && cx === 1;
    const [r, g, b] = isOpaqueCell || inSquare ? c : [key.r, key.g, key.b];
    sheet.data[i] = r; sheet.data[i + 1] = g; sheet.data[i + 2] = b; sheet.data[i + 3] = 255;
  }
  const sheetPath = path.join(tmp, "sheet.png");
  fs.writeFileSync(sheetPath, PNG.sync.write(sheet));
  const manifestPath = path.join(tmp, "sheet.manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify({
    keyColor: "#FF00FF", tolerance: 90, cols: 2, rows: 2,
    cells: [
      { stem: "prop_a", col: 0, row: 0 },
      { stem: "prop_b", col: 1, row: 0 },
      { stem: "prop_c", col: 0, row: 1 },
      { stem: "floor",  col: 1, row: 1, opaque: true },
    ],
  }));

  const { receipt } = slice({ sheetPath, manifestPath, outDir: tmp });
  const checks = [];
  const px = (png, x, y) => { const i = (y * png.width + x) << 2; return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]]; };
  for (const stem of ["prop_a", "prop_b", "prop_c"]) {
    const png = PNG.sync.read(fs.readFileSync(path.join(tmp, `${stem}.png`)));
    checks.push([`${stem}: 64×64`, png.width === 64 && png.height === 64]);
    checks.push([`${stem}: corner is TRUE alpha`, px(png, 2, 2)[3] === 0]);
    checks.push([`${stem}: center is opaque content`, px(png, 32, 32)[3] === 255]);
  }
  const floor = PNG.sync.read(fs.readFileSync(path.join(tmp, "floor.png")));
  checks.push(["floor (opaque tile): corner NOT keyed", px(floor, 2, 2)[3] === 255]);
  // tamper: run the keyer with the WRONG key color — nothing should be keyed
  const tamper = crop(sheet, 0, 0, 64, 64);
  checks.push(["tamper: wrong key keys nothing", chromaKey(tamper, { r: 0, g: 255, b: 255 }, 90) === 0]);

  let pass = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? "✓ PASS" : "✗ FAIL"}  ${name}`);
    if (ok) pass++;
  }
  console.log(`${pass}/${checks.length} checks · receipt: ${receipt.map((r) => `${r.stem}(${r.keyedPct}% keyed)`).join(" · ")}`);
  process.exit(pass === checks.length ? 0 : 1);
}

const args = parseArgs(process.argv.slice(2));
if (args.selfTest) selfTest();
else if (args.sheet && args.manifest) {
  const { receipt } = slice({ sheetPath: args.sheet, manifestPath: args.manifest, outDir: args.out });
  for (const r of receipt) console.log(`✓ ${r.stem} → ${r.file}${r.opaque ? " (opaque)" : ` (${r.keyedPct}% background keyed)`}`);
  console.log(`${receipt.length} tiles sliced. Next: node docs/art/prep-art.mjs (QA + resize), then sync-art.mjs.`);
} else {
  console.error("usage: slice-art.mjs --sheet <png> --manifest <json> [--out <dir>] | --self-test");
  process.exit(2);
}
