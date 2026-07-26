#!/usr/bin/env node
/**
 * import-batch-af — THE COMPOSITION KIT (PK-C2, doc 36).
 * Imports the 19 accepted Batch-AF sheets into
 * apps/web/public/art/g1/paint/ch01/<stem>.png.
 *
 *   node docs/art/import-batch-af.mjs
 *
 * Same laws as import-batch-ac (tol-40 chroma key → 3-pass defringe → alpha
 * audit; exit 1 on any failure) with ONE addition this batch forces: a third
 * write mode, because AF's cell geometry is not AC's.
 *
 *   "plate"  — copied as-is. The L1 far-shell segments are commissioned
 *              UNKEYED and fully opaque (measured: 0.00 % magenta, 100 %
 *              opaque), and the four mass_body cells are the interior fill
 *              whose whole point is 100 % opacity. Keying or trimming either
 *              would be destructive.
 *   "band"   — key → defringe → crop VERTICALLY to content, full width kept.
 *              The crust loops/caps and the L2 furniture bands are painted as
 *              a horizontal band inside a taller cell (crust_p1's art occupies
 *              y 144–356 of 512; l2_p1's y 101–333 of 384). The renderer
 *              derives their scale from SOURCE HEIGHT, so an untrimmed cell
 *              renders the art at ~40 % of its slot with transparent gaps
 *              above and below. Cropping vertically makes the band fill its
 *              slot; keeping full width preserves the tiling period.
 *              ONE shared crop per sheet — the four crust cells must stay
 *              aligned with each other or the caps float off the loop.
 *   "sprite" — key → defringe → full content trim. Discrete objects the
 *              renderer positions by its own box: edges, corners, ramps, the
 *              slide's under-strut, and the platform objects.
 *
 * The slide's top/mid/foot ride ONE diagonal and must share a coordinate
 * frame, so they are "band"; only the under-strut is trimmed.
 */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = "/Users/veho/Code/codex-art-lab/batch-af";
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");

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

const alphaShare = (png) => {
  let on = 0;
  for (let i = 3; i < png.data.length; i += 4) if (png.data[i] > 8) on++;
  return on / (png.width * png.height);
};

const failures = [];

// ── the sheets ───────────────────────────────────────────────────────────────
// cols/rows = the cell grid. Each piece is [fromCell, toCell, stem, mode?] in
// ROW-MAJOR cell indices; a piece may span several cells of ONE row (the AF
// platform objects are painted 2 cells wide). Layout verified by measuring
// every cell's content box before this table was written — see doc 35 PK-C2.
const SHEETS = [
  // GROUP 1 · L1 far-shell segments: 2048×1260 = two 1024-wide tiling segments
  { file: "l1/l1_p1_hall.png", cols: 2, rows: 1, mode: "plate", pieces: [[0, 1, "l1_p1_a"], [1, 2, "l1_p1_b"]] },
  { file: "l1/l1_p2_night.png", cols: 2, rows: 1, mode: "plate", pieces: [[0, 1, "l1_p2_a"], [1, 2, "l1_p2_b"]] },
  { file: "l1/l1_p3_yard.png", cols: 2, rows: 1, mode: "plate", pieces: [[0, 1, "l1_p3_a"], [1, 2, "l1_p3_b"]] },
  { file: "l1/l1_p4_stage.png", cols: 2, rows: 1, mode: "plate", pieces: [[0, 1, "l1_p4_a"], [1, 2, "l1_p4_b"]] },
  { file: "l1/l1_p9_ink.png", cols: 2, rows: 1, mode: "plate", pieces: [[0, 1, "l1_p9_a"], [1, 2, "l1_p9_b"]] },

  // GROUP 2 · L2 mid-furniture bands: one keyed 2048×384 seamless loop each
  { file: "l2/l2_p1_hall.png", cols: 1, rows: 1, mode: "band", pieces: [[0, 1, "l2_p1"]] },
  { file: "l2/l2_p2_night.png", cols: 1, rows: 1, mode: "band", pieces: [[0, 1, "l2_p2"]] },
  { file: "l2/l2_p3_yard.png", cols: 1, rows: 1, mode: "band", pieces: [[0, 1, "l2_p3"]] },
  { file: "l2/l2_p4_stage.png", cols: 1, rows: 1, mode: "band", pieces: [[0, 1, "l2_p4"]] },

  // GROUP 3 · the mass kits
  {
    file: "mass/mass_body.png", cols: 4, rows: 1, mode: "plate",
    pieces: [[0, 1, "mass_body_a"], [1, 2, "mass_body_b"], [2, 3, "mass_fade"], [3, 4, "mass_sediment"]],
  },
  ...["p1", "p2", "p3", "p4", "p9"].map((ph) => ({
    file: `mass/crust_${ph}.png`, cols: 4, rows: 1, mode: "band",
    pieces: [[0, 1, `crust_${ph}_a`], [1, 2, `crust_${ph}_b`], [2, 3, `crust_${ph}_cap_l`], [3, 4, `crust_${ph}_cap_r`]],
  })),
  {
    file: "mass/edges_corners.png", cols: 4, rows: 2, mode: "sprite",
    pieces: [
      [0, 1, "mass_edge_l"], [1, 2, "mass_edge_r"], [2, 3, "mass_corner_bl"], [3, 4, "mass_corner_br"],
      [4, 5, "mass_incorner_l"], [5, 6, "mass_incorner_r"], [6, 7, "mass_ramp_up"], [7, 8, "mass_ramp_down"],
    ],
  },

  // GROUP 4 · the chalk slide: four 1024×512 modules (2 cols × 2 rows)
  {
    file: "slide/chalk_slide.png", cols: 2, rows: 2, mode: "band",
    pieces: [[0, 1, "slide_top"], [1, 2, "slide_mid"], [2, 3, "slide_foot"], [3, 4, "slide_under", "sprite"]],
  },

  // GROUP 5 · floating platform OBJECTS (the 2-cell ones are painted 2 wide)
  {
    file: "platforms/plat_a.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, 2, "plat_bench_2"], [2, 3, "plat_shelf_1"], [3, 4, "plat_column_1"]],
  },
  {
    file: "platforms/plat_b.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, 2, "plat_plank_2"], [2, 3, "plat_column2_1"], [3, 4, "plat_bundle_1"]],
  },
];

const MIN_ALPHA = { plate: 0.5, band: 0.2, sprite: 0.08 };

// ── run ──────────────────────────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true });
const written = [];

for (const sheet of SHEETS) {
  const src = path.join(LAB, sheet.file);
  if (!fs.existsSync(src)) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const png = read(src);
  const cw = png.width / sheet.cols;
  const ch = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(ch)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows} cells`);
    continue;
  }

  // cut + key every piece first; "band" pieces then share ONE vertical crop
  const cut = [];
  for (const [from, to, stem, modeOverride] of sheet.pieces) {
    const mode = modeOverride ?? sheet.mode;
    const row = Math.floor(from / sheet.cols);
    if (Math.floor((to - 1) / sheet.cols) !== row) { failures.push(`${stem}: piece spans rows`); continue; }
    const col = from % sheet.cols;
    let img = crop(png, col * cw, row * ch, (to - from) * cw, ch);
    if (mode !== "plate") { chromaKey(img); defringe(img); }
    cut.push({ stem, mode, img });
  }

  const bandPieces = cut.filter((c) => c.mode === "band");
  if (bandPieces.length > 0) {
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const b of bandPieces) {
      const box = contentBox(b.img);
      if (!box) { failures.push(`${b.stem}: keyed to nothing`); continue; }
      y0 = Math.min(y0, box.y0);
      y1 = Math.max(y1, box.y1);
    }
    if (y1 >= y0) for (const b of bandPieces) b.img = crop(b.img, 0, y0, b.img.width, y1 - y0 + 1);
  }
  for (const c of cut) {
    if (c.mode !== "sprite") continue;
    const box = contentBox(c.img);
    if (!box) { failures.push(`${c.stem}: keyed to nothing`); continue; }
    c.img = crop(c.img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
  }

  for (const c of cut) {
    const share = alphaShare(c.img);
    if (share < MIN_ALPHA[c.mode]) {
      failures.push(`${c.stem}: nearly empty (alpha ${(share * 100).toFixed(2)}%, need ≥${MIN_ALPHA[c.mode] * 100}%)`);
      continue;
    }
    fs.writeFileSync(path.join(OUT, `${c.stem}.png`), PNG.sync.write(c.img));
    written.push({ stem: c.stem, mode: c.mode, w: c.img.width, h: c.img.height, alpha: share, from: sheet.file });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
for (const w of written) {
  console.log(`  ${w.stem.padEnd(20)} ${String(w.w).padStart(5)}×${String(w.h).padEnd(5)} ${w.mode.padEnd(7)} alpha ${(w.alpha * 100).toFixed(1).padStart(5)}%  ← ${w.from}`);
}
if (failures.length > 0) {
  console.error(`\nimport-batch-af: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-af: OK — ${written.length} stems written from ${SHEETS.length} sheets`);
