#!/usr/bin/env node
/**
 * import-batch-aa — THE PAINTED BOOK's first import: the toy kit (doc 31 M2,
 * PR ④). Slices the strict-grid hero rig + props, chroma-keys the strips,
 * copies the far plate, and writes into the NEW paint art tree:
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
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-aa");
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

// ── the hero rig: 5×4 strict grid, 384px cells, NEVER trimmed ────────────────
const RIG_STEMS = [
  "head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate",
  "body_idle", "body_lean", "body_crouch", "hand_open", "hand_fist",
  "hand_grip", "shoe_neutral", "shoe_tucked", "hair_still", "hair_wind",
  "satchel", "rotor_a", "rotor_b", "rotor_c", null, // cell 20 is empty
];
const rig = read(path.join(LAB, "hero", "hero_parts_strict.png"));
if (rig.width !== 1920 || rig.height !== 1536) failures.push(`hero_parts_strict is ${rig.width}×${rig.height}, expected 1920×1536`);
RIG_STEMS.forEach((stem, i) => {
  if (stem === null) return;
  const cell = defringe(chromaKey(crop(rig, (i % 5) * 384, Math.floor(i / 5) * 384, 384, 384)));
  audit(stem, cell);
  write(path.join(OUT, "hero", `${stem}.png`), cell);
});

// ── props: 5×1 strict grid, content-trimmed ──────────────────────────────────
const PROP_STEMS = ["prop_ring", "prop_letter", "prop_exit", "prop_spring", "prop_vine"];
const props = read(path.join(LAB, "ch01", "props_toy_sheet.png"));
PROP_STEMS.forEach((stem, i) => {
  const cell = trim(defringe(chromaKey(crop(props, i * 384, 0, 384, 384))));
  audit(stem, cell);
  write(path.join(OUT, "ch01", `${stem}.png`), cell);
});

// ── strips: whole-image key (loopables seam-checked), caps sliced 2×1 ────────
const seamCheck = (stem, png) => {
  let delta = 0;
  let n = 0;
  for (let y = 0; y < png.height; y++) {
    const li = (y * png.width) * 4;
    const ri = (y * png.width + png.width - 1) * 4;
    if (png.data[li + 3] === 0 && png.data[ri + 3] === 0) continue;
    delta += Math.abs(png.data[li] - png.data[ri]) + Math.abs(png.data[li + 1] - png.data[ri + 1]) + Math.abs(png.data[li + 2] - png.data[ri + 2]);
    n++;
  }
  const avg = n > 0 ? delta / n : 0;
  if (avg > 90) failures.push(`${stem}: loop seam ΔRGB ${avg.toFixed(0)} (edges do not continue)`);
};

for (const [file, stem] of [["strip_ground_loop.png", "strip_ground_loop"], ["strip_mid_loop.png", "strip_mid_loop"]]) {
  const png = defringe(chromaKey(read(path.join(LAB, "ch01", file))));
  audit(stem, png, 0.1);
  seamCheck(stem, png);
  write(path.join(OUT, "ch01", `${stem}.png`), png);
}
const caps = read(path.join(LAB, "ch01", "strip_ground_caps.png"));
for (const [i, stem] of [["0", "strip_cap_l"], ["1", "strip_cap_r"]].map(([i, s]) => [Number(i), s])) {
  const cell = defringe(chromaKey(crop(caps, i * 512, 0, 512, 384)));
  audit(stem, cell, 0.05);
  write(path.join(OUT, "ch01", `${stem}.png`), cell);
}

// ── the far plate: full-bleed copy ───────────────────────────────────────────
fs.mkdirSync(path.join(OUT, "ch01"), { recursive: true });
fs.copyFileSync(path.join(LAB, "ch01", "plate_far.png"), path.join(OUT, "ch01", "plate_far.png"));

if (failures.length > 0) {
  console.error("import-batch-aa FAILED:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`import-batch-aa OK: ${RIG_STEMS.filter(Boolean).length} rig parts + ${PROP_STEMS.length} props + 4 strips + 1 plate → ${OUT}`);
