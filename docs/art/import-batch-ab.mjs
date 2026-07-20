#!/usr/bin/env node
/**
 * import-batch-ab — chapter 1 production art (M3): the six enemy rigs, the
 * cast (Fibel/Klecks/Krakel/Merle), both cage pairs, the blackboard guardian
 * parts, doors + pickups + FX, and the two full-bleed backdrop plates.
 * Writes into apps/web/public/art/g1/paint/ch01/<stem>.png.
 *
 * Same laws as import-batch-aa2 (tol-40 chroma key → 3-pass defringe; cells
 * content-trimmed here — entities anchor by feet-center via setOrigin, not by
 * cell registration; ≥1% alpha audit per required cell; exit 1 on failure).
 *
 *   node docs/art/import-batch-ab.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-ab");
const OUT = path.join(REPO, "apps", "web", "public", "art", "g1", "paint", "ch01");

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

function trim(png) {
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
  if (x1 < 0) return png;
  return crop(png, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}

const alphaShare = (png) => {
  let on = 0;
  for (let i = 3; i < png.data.length; i += 4) if (png.data[i] > 8) on++;
  return on / (png.width * png.height);
};

const failures = [];
const audit = (stem, png, min = 0.01) => {
  if (alphaShare(png) < min) failures.push(`${stem}: nearly empty (alpha ${(alphaShare(png) * 100).toFixed(2)}%)`);
};

// ── the sheets: file → per-cell stems (null = skip that cell) ───────────────
// Renderer contract (PaintScene.entTex): pb-<skin>_<state> with fallback to
// pb-<skin>_a — so every skin needs at least its `_a` cell.
const SHEETS = [
  { file: "ch01/enemy_pencil.png", stems: ["pencil_a", "pencil_b", "pencil_act", "pencil_dazed"] },
  { file: "ch01/enemy_pen.png", stems: ["pen_a", "pen_b", "pen_act", "pen_dazed"] },
  { file: "ch01/enemy_paintbox.png", stems: ["paintbox_a", "paintbox_telegraph", "paintbox_act", "paintbox_dazed"] },
  { file: "ch01/enemy_heft.png", stems: ["heft_a", "heft_b", "heft_act", "heft_dazed"] },
  { file: "ch01/enemy_eraser.png", stems: ["eraser_a", "eraser_b", "eraser_act", "eraser_dazed"] },
  { file: "ch01/enemy_ranzen.png", stems: ["ranzen_telegraph", "ranzen_act", "ranzen_a", "ranzen_dazed"] },
  { file: "ch01/swarm_moths.png", stems: ["moths_a", "moths_b"] },
  { file: "ch01/fx_sheet.png", stems: ["fx_chalk", "fx_blob", "fx_letterburst", "fx_heart"] },
  { file: "ch01/being_fibel.png", stems: ["fibel_a", "fibel_gift"] },
  { file: "ch01/being_klecks.png", stems: ["klecksdoor_a", "klecksdoor_b"] },
  { file: "ch01/being_krakel.png", stems: ["krakel_a", "krakel_b"] },
  { file: "ch01/cage_pencilcase.png", stems: ["pencilcase_a", "pencilcase_shake", "pencilcase_burst"] },
  { file: "ch01/kid_merle.png", stems: ["merle_a", "merle_b"] },
  { file: "ch01/cage_satchel.png", stems: ["satchel_a", "satchel_shake", "satchel_burst"] },
  { file: "ch01/guardian_tafel.png", stems: ["tafel_a", "tafel_hand", "tafel_telegraph", "tafel_sad", "tafel_dazed", "tafel_chalk"] },
  { file: "ch01/prop_door.png", stems: ["door_a", "door_open"] },
  { file: "ch01/prop_pickups.png", stems: ["pickup_fist", "medallion_frame", "seal_sticker"] },
];

let count = 0;
for (const sheet of SHEETS) {
  const src = read(path.join(LAB, sheet.file));
  const n = sheet.stems.length;
  const cellW = Math.floor(src.width / n);
  for (let i = 0; i < n; i++) {
    const stem = sheet.stems[i];
    if (!stem) continue;
    const cell = trim(defringe(chromaKey(crop(src, i * cellW, 0, cellW, src.height))));
    audit(stem, cell);
    write(path.join(OUT, `${stem}.png`), cell);
    count++;
  }
}

// full-bleed plates: copied as-is
for (const plate of ["plate_classroom", "plate_yard"]) {
  const src = read(path.join(LAB, "ch01", `${plate}.png`));
  audit(plate, src, 0.5);
  write(path.join(OUT, `${plate}.png`), src);
  count++;
}

if (failures.length) {
  console.error("import-batch-ab FAILURES:");
  for (const f of failures) console.error(` ✗ ${f}`);
  process.exit(1);
}
console.log(`import-batch-ab OK: ${count} stems written to ${path.relative(REPO, OUT)}`);
