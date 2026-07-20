#!/usr/bin/env node
/**
 * import-batch-aa2 — the VISUAL-STANDARD KIT (plan PR A): slopes, planks,
 * canopy fringe, easel, pit soil, ink pool, nib spikes, ice strip, near +
 * sky planes — replaces every remaining procedural surface. Writes into:
 *   apps/web/public/art/g1/paint/{hero,ch01}/<stem>.png
 *
 * Laws carried from import-batch-w/x: tol-40 chroma key → 3-pass defringe;
 * RIG CELLS ARE NEVER TRIMMED (uniform 384px cells ARE the registration the
 * rig compositor's pivot spec relies on — packages/game-paint/src/rigSpec.ts);
 * props are content-trimmed (they anchor by content). Self-audits (≥1% alpha
 * per required slice; loopable strip edge seam ΔRGB) and exits 1 on failure.
 *
 *   node docs/art/import-batch-aa.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-aa2");
const OUT = path.join(REPO, "apps", "web", "public", "art", "g1", "paint");

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


// ── strict-grid sheets → cells ───────────────────────────────────────────────
const SHEETS = [
  { file: "ch01/slopes_sheet.png", cellW: 512, cellH: 512, trimCells: false,
    stems: ["slope45_up", "slope45_down", "slope30_up", "slope30_down"] },
  { file: "ch01/plank_caps.png", cellW: 512, cellH: 192, trimCells: true,
    stems: ["plank_cap_l", "plank_cap_r"] },
];
for (const sh of SHEETS) {
  const png = read(path.join(LAB, sh.file));
  sh.stems.forEach((stem, i) => {
    let cell = defringe(chromaKey(crop(png, i * sh.cellW, 0, sh.cellW, sh.cellH)));
    if (sh.trimCells) cell = trim(cell);
    audit(stem, cell);
    write(path.join(OUT, "ch01", `${stem}.png`), cell);
  });
}

// ── whole-image chroma pieces (loopables seam-checked) ──────────────────────
const seamCheck = (stem, png) => {
  let delta = 0, n = 0;
  for (let y = 0; y < png.height; y++) {
    const li = (y * png.width) * 4;
    const ri = (y * png.width + png.width - 1) * 4;
    if (png.data[li + 3] === 0 && png.data[ri + 3] === 0) continue;
    delta += Math.abs(png.data[li] - png.data[ri]) + Math.abs(png.data[li + 1] - png.data[ri + 1]) + Math.abs(png.data[li + 2] - png.data[ri + 2]);
    n++;
  }
  const avg = n > 0 ? delta / n : 0;
  if (avg > 90) failures.push(`${stem}: loop seam ΔRGB ${avg.toFixed(0)}`);
};
const WHOLE = [
  ["plank_loop.png", "plank_loop", true],
  ["canopy_fringe_loop.png", "canopy_fringe_loop", true],
  ["pool_ink_loop.png", "pool_ink_loop", true],
  ["spikes_nibs_loop.png", "spikes_nibs_loop", true],
  ["strip_ice_loop.png", "strip_ice_loop", true],
  ["plate_near_loop.png", "plate_near_loop", true],
  ["checkpoint_easel.png", "checkpoint_easel", false],
];
for (const [file, stem, loop] of WHOLE) {
  let png = defringe(chromaKey(read(path.join(LAB, "ch01", file))));
  if (stem === "checkpoint_easel") png = trim(png);
  audit(stem, png, 0.05);
  if (loop) seamCheck(stem, png);
  write(path.join(OUT, "ch01", `${stem}.png`), png);
}

// ── full-bleed copies ───────────────────────────────────────────────────────
for (const f of ["pit_inner_tile.png", "plate_sky.png"]) {
  fs.copyFileSync(path.join(LAB, "ch01", f), path.join(OUT, "ch01", f));
}

if (failures.length > 0) {
  console.error("import-batch-aa2 FAILED:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`import-batch-aa2 OK: 6 cells + 7 wholes + 2 plates → ${OUT}/ch01`);
