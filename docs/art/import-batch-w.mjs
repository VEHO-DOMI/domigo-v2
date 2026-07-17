#!/usr/bin/env node
/**
 * import-batch-w — the ONE deterministic pipeline for Batch W (v5 HD-pixel):
 * slice every sheet → chroma-key → defringe (magenta edge-erosion) → optional
 * content-trim (props only) → RENAME v3 stems onto their legacy engine slots →
 * write into apps/web/public/art/g1/keen/**.
 *
 * WHY one script: batch T/V chained slice-art + defringe + prep + sync by hand;
 * that produced order mistakes twice. This is re-runnable and self-checking
 * (exits 1 if any expected stem is missing at the end).
 *
 * RENAME LAW (v5): where a v3 stem upgrades an EXISTING engine slot, it is
 * written UNDER THE LEGACY NAME (hero3_* → hero2_*, st_X3_* → st_X_*, …) so
 * the engine needs zero changes for those slots and git shows a clean art
 * diff. Genuinely NEW slots (terrain3, swarm cloud, worldmap_painted,
 * dec_*, prop_door3) keep their v3 names — PR-M wires them.
 * DELIBERATELY NOT SYNCED: prop_pole3 (a full pencil; the engine tiles poles
 * from a 48px SEGMENT texture — the batch T/V segment art stays).
 *
 *   node docs/art/import-batch-w.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab", "batch-w");
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
        // edge = touches a transparent neighbor
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

/** Magenta DESPILL: soft glows/edges that blended with the magenta background
 *  key out as PINK halos (seen on the Glühbuchstabe's golden glow). Classic
 *  spill suppression: where a pixel is magenta-tinted (r AND b both above g),
 *  clamp blue down toward green — gold/warm glows recover their hue, while
 *  genuinely blue/purple art (Tintengeist, ghost: r < g or b-dominant-cool)
 *  is untouched by the r > g guard. */
function despill(png) {
  const { data } = png;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > g + 20 && b > g + 20) data[i + 2] = g + Math.round((b - g) * 0.25);
  }
  return png;
}

/** Content-trim to the opaque bbox + pad (props only — sprites keep full cells). */
function trim(png, pad = 2) {
  const { width: W, height: H, data } = png;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) return png; // fully transparent — leave as-is (caught by the audit)
  const x0 = Math.max(0, minX - pad), y0 = Math.max(0, minY - pad);
  return crop(png, x0, y0, Math.min(W, maxX + pad + 1) - x0, Math.min(H, maxY + pad + 1) - y0);
}

// ── the sheet plans ──────────────────────────────────────────────────────────
// kind: "sprite" = chroma+defringe, full cell kept · "prop" = + content-trim
//        "opaque" = plain crop (ground tiles) · cell order is row-major.
const SHEETS = [
  { file: "hero/hero3_sheet.png", cols: 4, rows: 4, kind: "sprite", dest: "hero",
    cells: ["hero2_stand", "hero2_run1", "hero2_run2", "hero2_run3", "hero2_run4", "hero2_jump", "hero2_fall", "hero2_pogo1", "hero2_pogo2", "hero2_climb1", "hero2_climb2", "hero2_hang", "hero2_idle", "hero2_lookup", "hero2_lookdown", "hero2_sit"] },
  { file: "ch01/st_a3_sheet.png", cols: 4, rows: 3, kind: "sprite", dest: "ch01",
    cells: ["st_pencil_wild", "st_pencil_free", "st_pen_wild", "st_pen_free", "st_rubber_wild", "st_rubber_free", "st_ruler_wild", "st_ruler_free", "st_scissors_wild", "st_scissors_free", "st_glue_stick_wild", "st_glue_stick_free"] },
  { file: "ch01/st_b3_sheet.png", cols: 4, rows: 3, kind: "sprite", dest: "ch01",
    cells: ["st_pencil_case_wild", "st_pencil_case_free", "st_exercise_book_wild", "st_exercise_book_free", "st_watercolours_wild", "st_watercolours_free", "st_paintbrush_wild", "st_paintbrush_free", "st_pencil_sharpener_wild", "st_pencil_sharpener_free", "st_book_wild", "st_book_free"] },
  { file: "ch01/boss3_sheet.png", cols: 2, rows: 2, kind: "sprite", dest: "ch01",
    cells: ["boss2_head_idle", "boss2_head_tell", "boss2_card", "boss2_burst"] },
  { file: "ch01/ghost3_sheet.png", cols: 4, rows: 2, kind: "sprite", dest: "ch01",
    cells: ["gs_sing", "gs_stand", "gs_write", "gs_window", "gs_speak", "gs_books", "gs_friendly", "gs_sad"] },
  { file: "ch01/swarm3_sheet.png", cols: 4, rows: 2, kind: "sprite", dest: "ch01",
    cells: ["digit3_orb", "digit3_glow", "cloud3_a", "cloud3_b", "cloud3_c", "cloud3_d", "swirl3_a", "swirl3_b"] },
  { file: "ch01/classroom3_sheet.png", cols: 4, rows: 3, kind: "sprite", dest: "ch01",
    cells: ["cr_chair_grey", "cr_chair_color", "cr_desk_grey", "cr_desk_color", "cr_board_grey", "cr_board_color", "cr_door_grey", "cr_door_color", "cr_window_grey", "cr_window_color", "cr_school_bag_grey", "cr_school_bag_color"] },
  { file: "map/buildings3_sheet.png", cols: 4, rows: 3, kind: "sprite", dest: "map",
    cells: ["bld_ch01", "bldx_ch01", "bld_ch02", "bldx_ch02", "bld_ch03", "bldx_ch03", "bld_ch04", "bldx_ch04", "bld_ch05", "bldx_ch05", "bld_locked", null] },
  { file: "ch01/decor3_sheet.png", cols: 4, rows: 2, kind: "prop", dest: "ch01",
    // cell 1 is the full-pencil pole — NOT synced onto prop_pole (see header)
    cells: ["prop_pole3_full", "prop_gluehwort", "prop_seal", "prop_spikes", "dec_fence3", "dec_tree3", "dec_bush3", "prop_door3"] },
  { file: "cast/portraits3_sheet.png", cols: 4, rows: 2, kind: "sprite", dest: "cast",
    cells: ["p2_finn", "p2_pixel", "p2_berger", "p2_tintengeist", "p2_jona", "p2_ghost", null, null] },
];

// terrain3: labelled 52px-pitch grid at (24,24), fixed 48×48 boxes (measured).
const TERRAIN = {
  file: "ch01/terrain3_sheet.png", dest: "ch01", pitch: 52, x0: 24, y0: 24, size: 48,
  cells: ["earth3_a", "earth3_b", "earth3_c", "grass3_top", "grass3_tl", "grass3_tr", "edge3_l", "edge3_r", "slope3_up", "slope3_down", "earth3_inner", "ledge3"],
};

const produced = [];

// warm-glow props whose soft halo picks up magenta spill (NOT applied to
// genuinely pink/purple art — the eraser and watercolours keep their hues)
const DESPILL_STEMS = new Set(["prop_gluehwort", "prop_seal"]);

for (const sheet of SHEETS) {
  const src = read(path.join(LAB, sheet.file));
  const cw = src.width / sheet.cols, ch = src.height / sheet.rows;
  sheet.cells.forEach((stem, i) => {
    if (stem === null) return;
    const col = i % sheet.cols, row = Math.floor(i / sheet.cols);
    let cell = crop(src, col * cw, row * ch, cw, ch);
    chromaKey(cell);
    defringe(cell);
    if (DESPILL_STEMS.has(stem)) despill(cell);
    if (sheet.kind === "prop") cell = trim(cell);
    write(path.join(OUT, sheet.dest, `${stem}.png`), cell);
    produced.push(`${sheet.dest}/${stem}`);
  });
}

{
  const src = read(path.join(LAB, TERRAIN.file));
  TERRAIN.cells.forEach((stem, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const cell = chromaKey(crop(src, TERRAIN.x0 + col * TERRAIN.pitch, TERRAIN.y0 + row * TERRAIN.pitch, TERRAIN.size, TERRAIN.size));
    defringe(cell);
    write(path.join(OUT, TERRAIN.dest, `${stem}.png`), cell);
    produced.push(`${TERRAIN.dest}/${stem}`);
  });
}

// the painted world map — full-bleed copy
fs.copyFileSync(path.join(LAB, "map/worldmap_painted.png"), path.join(OUT, "map", "worldmap_painted.png"));
produced.push("map/worldmap_painted");
// the style key — synced for reference, never rendered
fs.copyFileSync(path.join(LAB, "_style_key_pixel3.png"), path.join(OUT, "_style_key_pixel3.png"));

// ── the audit: every produced file exists, is a readable PNG, and sprites
//    actually contain opaque pixels (an all-transparent slice = a slicing bug) ──
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
console.log(`imported ${produced.length} stems from batch-w → ${OUT}${fail ? ` — ${fail} FAILURES` : " — all audited OK"}`);
process.exit(fail ? 1 : 0);
