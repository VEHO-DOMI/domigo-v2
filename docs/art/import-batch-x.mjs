#!/usr/bin/env node
/**
 * import-batch-x — the deterministic pipeline for Batch X (v5.1 leftovers:
 * pole-free climb, rig-aligned accessories, HD map hero, HD alphabet, hazard
 * strip, flag + door arch). Same laws as import-batch-w.mjs: slice → chroma-
 * key → defringe → ringDespill → (despill / trim where flagged) → RENAME onto
 * the legacy engine slots → self-audit.
 *
 * RENAME LAW: every Batch X stem OVERWRITES an existing engine slot — the
 * engine needs zero art-key changes (hero2_climb1/2, acc_cap, acc_scarf,
 * mh_*, alpha_a…z, prop_spikes, prop_flag, prop_door_open).
 *
 * NOT trimmed: hero + accessory + map-hero cells (uniform cells keep the rig
 * registration — the accessory overlays the player's cell 1:1). Trimmed:
 * alphabet discs (146×192 cells would squash to the square display size),
 * hazard strip, flag, door arch (props anchor by content).
 *
 *   node docs/art/import-batch-x.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-x");
const OUT = path.join(REPO, "apps", "web", "public", "art", "g1", "keen");

const TOL = 40; // the batch T/V chroma tolerance law

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const write = (p, png) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, PNG.sync.write(png)); };

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

function chromaKey(png) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (isMagenta(png.data[i], png.data[i + 1], png.data[i + 2])) png.data[i + 3] = 0;
  }
  return png;
}

/** The batch T/V defringe law: erode magenta-tinted edge pixels, 3 passes. */
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

/** Magenta despill for warm soft glows (see import-batch-w.mjs). */
function despill(png) {
  const { data } = png;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > g + 20 && b > g + 20) data[i + 2] = g + Math.round((b - g) * 0.25);
  }
  return png;
}

/** v5.1 ring despill: purple edge crumbs on anti-aliased sprite rims. */
function ringDespill(png, passes = 2) {
  const { width: W, height: H, data } = png;
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] === 0) continue;
        let edge = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H || data[(ny * W + nx) * 4 + 3] === 0) { edge = true; break; }
        }
        if (!edge) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > g + 24 && b > g + 24) {
          data[i + 3] = 0;
        } else if (r > g + 8 && b > g + 8) {
          data[i] = g + Math.round((r - g) * 0.35);
          data[i + 2] = g + Math.round((b - g) * 0.35);
        }
      }
    }
  }
  return png;
}

/** Content-trim to the opaque bbox + pad (props only). */
function trim(png, pad = 2) {
  const { width: W, height: H, data } = png;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) return png;
  const x0 = Math.max(0, minX - pad), y0 = Math.max(0, minY - pad);
  return crop(png, x0, y0, Math.min(W, maxX + pad + 1) - x0, Math.min(H, maxY + pad + 1) - y0);
}

// ── the sheet plans ──────────────────────────────────────────────────────────
// kind: "sprite" = full cell kept (rig registration) · "prop" = + content-trim.
// Cells slice on PROPORTIONAL bounds (round(i·W/cols)) — matches the format
// verifier's own grid on the 1024/7 alphabet sheet.
const alpha = Array.from({ length: 26 }, (_, i) => `alpha_${String.fromCharCode(97 + i)}`);
const SHEETS = [
  { file: "hero/climb_nopole_sheet.png", cols: 2, rows: 1, kind: "sprite", dest: "hero",
    cells: ["hero2_climb1", "hero2_climb2"] },
  { file: "hero/acc3_sheet.png", cols: 2, rows: 1, kind: "sprite", dest: "hero",
    cells: ["acc_cap", "acc_scarf"] },
  { file: "map/maphero3_sheet.png", cols: 3, rows: 2, kind: "sprite", dest: "map",
    cells: ["mh_down1", "mh_down2", "mh_up1", "mh_up2", "mh_side1", "mh_side2"] },
  { file: "ch01/alphabet3_sheet.png", cols: 7, rows: 4, kind: "prop", dest: "ch01",
    cells: [...alpha, null, null] },
  { file: "ch01/hazard3_strip.png", cols: 1, rows: 1, kind: "prop", dest: "ch01",
    cells: ["prop_spikes"] },
  { file: "ch01/levelprops3_sheet.png", cols: 2, rows: 1, kind: "prop", dest: "ch01",
    cells: ["prop_flag", "prop_door_open"] },
];

// warm golden rim-glows pick up magenta spill (the Glühwort lesson); the
// letters' blue-black ink is r<g-guarded, so despill can't touch it
const DESPILL_STEMS = new Set(alpha);

const produced = [];
for (const sheet of SHEETS) {
  const src = read(path.join(LAB, sheet.file));
  sheet.cells.forEach((stem, i) => {
    if (stem === null) return;
    const col = i % sheet.cols, row = Math.floor(i / sheet.cols);
    const x0 = Math.round((col * src.width) / sheet.cols);
    const x1 = Math.round(((col + 1) * src.width) / sheet.cols);
    const y0 = Math.round((row * src.height) / sheet.rows);
    const y1 = Math.round(((row + 1) * src.height) / sheet.rows);
    let cell = crop(src, x0, y0, x1 - x0, y1 - y0);
    chromaKey(cell);
    defringe(cell);
    ringDespill(cell);
    if (DESPILL_STEMS.has(stem)) despill(cell);
    if (sheet.kind === "prop") cell = trim(cell);
    write(path.join(OUT, sheet.dest, `${stem}.png`), cell);
    produced.push(`${sheet.dest}/${stem}`);
  });
}

// ── the audit ────────────────────────────────────────────────────────────────
let fail = 0;
for (const rel of produced) {
  const p = path.join(OUT, `${rel}.png`);
  try {
    const png = read(p);
    let opaque = 0;
    for (let i = 3; i < png.data.length; i += 4) if (png.data[i] > 8) opaque++;
    const share = opaque / (png.width * png.height);
    if (share < 0.02) { console.error(`✗ ${rel}: only ${(share * 100).toFixed(1)}% opaque — slice bug?`); fail++; }
  } catch (e) { console.error(`✗ ${rel}: unreadable (${e.message})`); fail++; }
}
console.log(`imported ${produced.length} stems from batch-x → ${OUT}${fail ? ` — ${fail} FAILURES` : " — all audited OK"}`);
process.exit(fail ? 1 : 0);
