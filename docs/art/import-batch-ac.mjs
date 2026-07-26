#!/usr/bin/env node
/**
 * import-batch-ac — THE PAINTED BOOK, chapter 1 world kit (Build-D / W1).
 * Imports the 31 accepted Codex sheets (batch AC + the 12 finish-unified AC2
 * re-runs) into apps/web/public/art/g1/paint/ch01/<stem>.png, per the frozen
 * cell→stem map in docs/handover/34_build_d_wiring_plan.md §2 as amended by
 * §0a (A-1, A-2, A-6, A-8).
 *
 *   node docs/art/import-batch-ac.mjs
 *
 * Same laws as import-batch-ab (tol-40 chroma key → 3-pass defringe → ≥1%
 * alpha audit; exit 1 on any failure) with ONE addition this batch needs:
 * a per-cell WRITE MODE, because the ch01 kit mixes three geometry contracts.
 *
 *   "sprite" — key → defringe → content-trim. Entities/props/vocab anchor by
 *              their own centre (setOrigin), so trimming is free and keeps
 *              texture memory down. This is the batch-ab behaviour.
 *   "keep"   — key → defringe, NO trim. Loop strips, caps, the pit tile and
 *              the parallax bands are drawn as tileSprites whose scale is
 *              derived from the SOURCE height (PaintScene: `tileScale =
 *              dispH / src.height`), and slopes are forced to cell size with
 *              setDisplaySize. Trimming any of them changes the tiling period
 *              or stretches the art — so their authored cell geometry is the
 *              contract and must survive the import untouched.
 *   "plate"  — copied as-is (crop only), NO key, audit 0.5. The four backdrop
 *              plates and the prologue triptych are full-bleed paintings with
 *              zero magenta (verified: 0.0% magenta pixels in all five files).
 *
 * DEFERRED CELLS (imported by nobody, listed loudly at the end of the run and
 * in docs/handover/35_build_d_command_log.md; per A-2 they are NEVER added to
 * scripts/paint-art-allowlist.json — the checker fails allowlist entries that
 * nothing needs):
 *   · A-8's nine per-phase ground cells (kit_p2_floor/kit_p3_paving/
 *     kit_p4_stage [0..2]) — their caps would clobber kit_p1_hall's canonical
 *     strip_cap_l/r. kit_p1_hall is the one canonical ground kit (§3.3 MVP).
 *   · kit_p3_paving[3] — §2 names no stem for it ("corner (prop)").
 *   · kit_p3_air[1] — §2 says "ruler→entity (skip)"; the ruler ships as an
 *     entity from ent_platforms.
 *   · the three cells §2 all labels `plank_loop` (kit_p1_steps[3],
 *     kit_p2_furniture[3], kit_p3_air[2]). One name, three sheets: writing any
 *     of them silently clobbers the shipped batch-AB plank, and `plank_loop`
 *     is not on the passover's intended-overwrite list. The grids-v2 phases
 *     use no `=` glyph at all, so nothing needs a plank today.
 *   · props_p1 / props_p1b / props_p2 / props_p3 (16 decor cells) — §2 gives
 *     them no stem names and §3.3 confirms no renderer placement path. Every
 *     PNG in the art dir is preloaded as a texture (PaintScene.preload over
 *     resolvePaintArt's scan), so importing unplaceable decor costs 16 real
 *     image loads and squats 16 names the decor-layer design has not chosen.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..", "..");
const LAB = path.join(process.env.HOME, "Code", "codex-art-lab");
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
const audit = (stem, png, min) => {
  const share = alphaShare(png);
  if (share < min) failures.push(`${stem}: nearly empty (alpha ${(share * 100).toFixed(2)}%, need ≥${min * 100}%)`);
  return share;
};

// ── the sheets ─────────────────────────────────────────────────────────────
// Each entry: file (relative to the lab), src batch, default mode, and the
// per-cell stems L→R. `null` = a cell this import deliberately does not write
// (see the DEFERRED list in the header). A stem may be given as
// [name, mode] to override the sheet's default mode for that one cell.
// Cell width = sheet width / stems.length, exactly as batch-ab does it — so a
// one-stem sheet keys the full sheet (the bands) and the 3072px triptych
// splits into three 1024px panels.
const SHEETS = [
  // Plates — full-bleed backdrops, copied as-is (doc 34 §2 "Plates")
  { file: "plates/plate_p1_entrancehall.png", src: "ac", mode: "plate", stems: ["plate_p1_entrancehall"] },
  { file: "plates/plate_p2_nightwall.png", src: "ac", mode: "plate", stems: ["plate_p2_nightwall"] },
  { file: "plates/plate_p3_yardwall.png", src: "ac", mode: "plate", stems: ["plate_p3_yardwall"] },
  { file: "plates/plate_p9_inkdream.png", src: "ac", mode: "plate", stems: ["plate_p9_inkdream"] },

  // Bands — per-phase mid-parallax tileSprites, keyed as ONE full sheet
  { file: "bands/band_p1_hallway.png", src: "ac", mode: "keep", stems: ["band_p1_hallway"] },
  { file: "bands/band_p2_furniture.png", src: "ac", mode: "keep", stems: ["band_p2_furniture"] },
  { file: "bands/band_p3_playground.png", src: "ac", mode: "keep", stems: ["band_p3_playground"] },
  { file: "bands/band_p4_audience.png", src: "ac", mode: "keep", stems: ["band_p4_audience"] },

  // Terrain — the canonical ground kit + slopes + hazards + placeable props
  { file: "terrain/kit_p1_hall.png", src: "ac2", mode: "keep", stems: ["strip_ground_loop", "strip_cap_l", "strip_cap_r", "pit_inner_tile"] },
  { file: "terrain/kit_p1_steps.png", src: "ac2", mode: "keep", stems: ["slope45_up", "slope45_down", ["plat_coatbench", "sprite"], null] },
  { file: "terrain/kit_p2_furniture.png", src: "ac2", mode: "sprite", stems: ["plat_desk", "plat_bookpile_s", "plat_bookpile_l", null] },
  { file: "terrain/kit_p3_air.png", src: "ac2", mode: "keep", stems: ["strip_ice_loop", null, null, ["plat_roofarrow", "sprite"]] },
  { file: "terrain/kit_hazards.png", src: "ac2", mode: "keep", stems: ["pool_ink_loop", "pool_ink_wide", "spikes_nibs_loop", ["fence_feather", "sprite"]] },
  { file: "terrain/kit_p2_floor.png", src: "ac2", mode: "sprite", stems: [null, null, null, "ledge_windowsill"] },
  { file: "terrain/kit_p4_stage.png", src: "ac2", mode: "sprite", stems: [null, null, null, "podium_chalkcrate"] },
  { file: "terrain/kit_p3_paving.png", src: "ac", mode: "sprite", stems: [null, null, null, null] },

  // Entities — the new pose cells, the moving platforms, the redesigned moths,
  // the guardian's motion states
  { file: "entities/ent_states_a.png", src: "ac2", mode: "sprite", stems: ["pencil_run", "eraser_squash", "ranzen_stomp", "heft_bank"] },
  { file: "entities/ent_platforms.png", src: "ac2", mode: "sprite", stems: ["satchelswing_a", "satchelswing_b", "ruler_a", "ruler_b"] },
  { file: "entities/ent_falter.png", src: "ac", mode: "sprite", stems: ["moths_a", "moths_b", "moths_rest", "moths_slate"] },
  { file: "entities/ent_tafel_motion.png", src: "ac", mode: "sprite", stems: ["tafel_roll", "tafel_windup", "tafel_stagger", "tafel_win"] },

  // Vocab — placeable prop stems (A-1: no card uses image stimuli today)
  { file: "tasks/vocab_objects_a.png", src: "ac2", mode: "sprite", stems: ["obj_pen", "obj_pencil", "obj_rubber", "obj_ruler"] },
  { file: "tasks/vocab_objects_b.png", src: "ac2", mode: "sprite", stems: ["obj_book", "obj_exercisebook", "obj_pencilcase", "obj_sharpener"] },
  { file: "tasks/vocab_objects_c.png", src: "ac2", mode: "sprite", stems: ["obj_gluestick", "obj_schoolbag", "obj_desk", "obj_chair"] },

  // Props — the readable checkpoint + the doors/exits
  { file: "props/checkpoint_station.png", src: "ac", mode: "sprite", stems: ["krakel_a", "krakel_active"] },
  { file: "props/props_gates.png", src: "ac", mode: "sprite", stems: ["door_open", "arenadoor_a", "window_exit", "klecksdoor_a"] },
  { file: "props/props_p1.png", src: "ac", mode: "sprite", stems: [null, null, null, null] },
  { file: "props/props_p1b.png", src: "ac", mode: "sprite", stems: [null, null, null, null] },
  { file: "props/props_p2.png", src: "ac", mode: "sprite", stems: [null, null, null, null] },
  { file: "props/props_p3.png", src: "ac", mode: "sprite", stems: [null, null, null, null] },

  // Story — A-5 descopes the plumbing to a follow-up PR; the stems are cheap,
  // so they land now and wire later. The triptych is full-bleed (no magenta).
  { file: "story/prolog_triptych.png", src: "ac", mode: "plate", stems: ["prologue_swallow", "prologue_ensemble", "prologue_caged"] },
  { file: "story/name_console.png", src: "ac", mode: "sprite", stems: ["nameconsole_empty", "nameconsole_line"] },
];

const written = [];
const deferred = [];

for (const sheet of SHEETS) {
  const abs = path.join(LAB, `batch-${sheet.src}`, sheet.file);
  if (!fs.existsSync(abs)) {
    failures.push(`source sheet MISSING: batch-${sheet.src}/${sheet.file}`);
    continue;
  }
  const src = read(abs);
  const n = sheet.stems.length;
  const cellW = Math.floor(src.width / n);
  for (let i = 0; i < n; i++) {
    const entry = sheet.stems[i];
    if (!entry) { deferred.push(`batch-${sheet.src}/${sheet.file}[${i}]`); continue; }
    const [stem, mode] = Array.isArray(entry) ? entry : [entry, sheet.mode];
    let cell = crop(src, i * cellW, 0, cellW, src.height);
    if (mode !== "plate") {
      cell = defringe(chromaKey(cell));
      if (mode === "sprite") cell = trim(cell);
    }
    const share = audit(stem, cell, mode === "plate" ? 0.5 : 0.01);
    write(path.join(OUT, `${stem}.png`), cell);
    written.push({ stem, mode, w: cell.width, h: cell.height, alpha: share, from: `batch-${sheet.src}/${sheet.file}[${i}]` });
  }
}

if (failures.length) {
  console.error("import-batch-ac FAILURES:");
  for (const f of failures) console.error(` ✗ ${f}`);
  process.exit(1);
}

for (const w of written) {
  console.log(`  ${w.stem.padEnd(24)} ${String(w.w).padStart(5)}x${String(w.h).padEnd(5)} ${w.mode.padEnd(6)} alpha ${(w.alpha * 100).toFixed(1).padStart(5)}%  ← ${w.from}`);
}
console.log(`\nDEFERRED (not imported — see the header; NEVER allowlist these): ${deferred.length} cells`);
for (const d of deferred) console.log(`  · ${d}`);
console.log(`\nimport-batch-ac OK: ${written.length} stems written to ${path.relative(REPO, OUT)}`);
