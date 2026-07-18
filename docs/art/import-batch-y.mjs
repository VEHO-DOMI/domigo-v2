#!/usr/bin/env node
/**
 * import-batch-y — the deterministic pipeline for Batch Y (the book-colour
 * classroom, ONE sheet). Same laws as import-batch-w.mjs: slice → chroma-key →
 * defringe → ringDespill → RENAME onto the legacy cr_* slots → self-audit.
 * Full 256px cells kept (sprite kind — the colour room scales per object).
 *
 *   node docs/art/import-batch-y.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-y");
const OUT = path.join(REPO, "apps", "web", "public", "art", "g1", "keen");

const TOL = 40;

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

const CELLS = ["cr_chair_grey", "cr_chair_color", "cr_desk_grey", "cr_desk_color", "cr_board_grey", "cr_board_color", "cr_door_grey", "cr_door_color", "cr_window_grey", "cr_window_color", "cr_school_bag_grey", "cr_school_bag_color"];

const src = read(path.join(LAB, "ch01", "classroom4_sheet.png"));
const cw = src.width / 4, ch = src.height / 3;
const produced = [];
CELLS.forEach((stem, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const cell = crop(src, col * cw, row * ch, cw, ch);
  chromaKey(cell);
  defringe(cell);
  ringDespill(cell);
  write(path.join(OUT, "ch01", `${stem}.png`), cell);
  produced.push(`ch01/${stem}`);
});

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
console.log(`imported ${produced.length} stems from batch-y → ${OUT}${fail ? ` — ${fail} FAILURES` : " — all audited OK"}`);
process.exit(fail ? 1 : 0);
