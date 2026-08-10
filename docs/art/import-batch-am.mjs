#!/usr/bin/env node
/**
 * import-batch-am — PK-R6 G · THE CHAPTER-1 REBUILD ART.
 * Imports the reviewed batches AM / AM2 / AL / AF3 into
 * apps/web/public/art/g1/paint/ch01/<stem>.png.
 *
 *   node docs/art/import-batch-am.mjs
 *
 * Same laws as import-batch-ac/af (tol-40 chroma key → 3-pass defringe →
 * content trim → alpha audit; exit 1 on any failure) with TWO additions this
 * round forces, both measured from the pixels before they were written down:
 *
 * 1. "figure" MODE + PER-CELL SOURCE WINDOWS.
 *    Merle's two sheets (batch-al/cast_merle, batch-am/merle_awakening) paint a
 *    child TALLER than her 512 px cell, so figures straddle the row boundary:
 *    on cast_merle the idle row's shoes finish 46 px INSIDE the walk row, and
 *    the joy row's braids start 23 px ABOVE it. Slicing on the rigid grid
 *    therefore cuts every idle shoe in half AND drops a foreign shoe fragment
 *    into every walk cell. So each figure cell declares the window its figure
 *    actually occupies (measured per column via the sheet's non-key scanline
 *    bands — see the tables below); the x range stays the cell's own.
 *    The boss sheet and the chalk sheet were measured too and need NO windows:
 *    every band there sits inside its row.
 *
 * 2. THE TUFT STRIP (owner's ruling, 2026-08-02). The detached floating hair
 *    tuft is HERO-ONLY; classmates wear attached hair. On every Merle cell the
 *    tuft is a small connected component riding above her head, so it is
 *    removed by component analysis rather than by hand. A component is the
 *    tuft when it is not the main component, is small relative to it (< 15 %),
 *    and lies entirely inside the TOP QUARTER of the figure's own vertical
 *    extent; only the topmost such candidate is removed, because she has
 *    exactly one tuft. Two framings were tried against the pixels and REJECTED
 *    (see stripTuft): "fully above the main component" both misses the tuft in
 *    the joy cells (her braids reach the cell's top edge, so nothing is above
 *    the main box) and, in `act_scribble1`, deletes her right floating hand
 *    (the largest component there is the DESK, so her hand rides above it).
 *    The four AM2 fix cells are painted tuft-free by contract and are imported
 *    in plain "sprite" mode; they are never strip-processed.
 *
 * A per-piece `tol` overrides the house tol-40 key where the ART ITSELF is
 * painted in the key's colour family: `act_window0/1` paint the window glass a
 * vivid violet, and at tol-40 the keyer punched ragged holes clean through the
 * panes (and defringe then ate outward from each hole). Measured on the source
 * cell: 68.7 % of it is EXACTLY #FF00FF with only 0.7 % of pixels between
 * distance 10 and 39, so the background separates cleanly at tol-12 and the
 * glass survives. Defringe still runs and still clears the anti-alias halo.
 *
 * Cell→content contracts come from the lab's own commission packets
 * (CODEX_MASTER_PROMPT_AM_CH01R / AM2_FIXES / AL_CAST / AF3_CAGES) and every
 * one was verified against the decoded pixels before this table was written.
 */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = path.join(process.env.HOME, "Code", "codex-art-lab");
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

function chromaKey(png, tol = TOL) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (isMagenta(png.data[i], png.data[i + 1], png.data[i + 2], tol)) png.data[i + 3] = 0;
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

/** 4-neighbour connected components over the opaque mask. */
function components(png, minSize = 30) {
  const { width: W, height: H, data } = png;
  const lab = new Int32Array(W * H).fill(-1);
  const out = [];
  const stack = [];
  for (let p = 0; p < W * H; p++) {
    if (data[p * 4 + 3] <= 8 || lab[p] !== -1) continue;
    const id = out.length;
    let size = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
    const px = [];
    stack.push(p);
    lab[p] = id;
    while (stack.length) {
      const q = stack.pop();
      const qx = q % W, qy = (q / W) | 0;
      size++;
      px.push(q);
      if (qx < x0) x0 = qx;
      if (qx > x1) x1 = qx;
      if (qy < y0) y0 = qy;
      if (qy > y1) y1 = qy;
      if (qx > 0 && data[(q - 1) * 4 + 3] > 8 && lab[q - 1] === -1) { lab[q - 1] = id; stack.push(q - 1); }
      if (qx < W - 1 && data[(q + 1) * 4 + 3] > 8 && lab[q + 1] === -1) { lab[q + 1] = id; stack.push(q + 1); }
      if (qy > 0 && data[(q - W) * 4 + 3] > 8 && lab[q - W] === -1) { lab[q - W] = id; stack.push(q - W); }
      if (qy < H - 1 && data[(q + W) * 4 + 3] > 8 && lab[q + W] === -1) { lab[q + W] = id; stack.push(q + W); }
    }
    out.push({ size, x0, y0, x1, y1, px });
  }
  return out.filter((c) => c.size >= minSize);
}

const TUFT_MAX_SHARE = 0.15; // of the main component
const TUFT_TOP_QUARTER = 0.25; // of the figure's own vertical extent

/** Remove the detached hair tuft. Returns the report row for the run log.
 *
 *  The tuft is the small component lying inside the TOP QUARTER of the
 *  figure's own vertical extent. An earlier version of this rule also accepted
 *  "sits entirely above the main component", and that clause was WRONG: in
 *  `act_scribble1` the largest component is the DESK, so Merle's right
 *  floating hand sits above it and was deleted as hair. Extent, not the main
 *  component, is the frame that holds — the hand is at 47 % of the figure's
 *  height, the tuft at 12 %. The size guard stays as the second lock, and only
 *  the single topmost candidate is ever removed: she has exactly one tuft. */
function stripTuft(png) {
  const comps = components(png);
  if (comps.length === 0) return { before: 0, after: 0, removed: [], extra: 0 };
  const main = [...comps].sort((a, b) => b.size - a.size)[0];
  const figTop = Math.min(...comps.map((c) => c.y0));
  const figBot = Math.max(...comps.map((c) => c.y1));
  const quarter = figTop + (figBot - figTop) * TUFT_TOP_QUARTER;
  const candidates = comps
    .filter((c) => c !== main && c.size < main.size * TUFT_MAX_SHARE && c.y1 <= quarter)
    .sort((a, b) => a.y0 - b.y0);
  const removed = [];
  if (candidates.length > 0) {
    const tuft = candidates[0];
    for (const q of tuft.px) png.data[q * 4 + 3] = 0;
    removed.push({ size: tuft.size, y0: tuft.y0, y1: tuft.y1, quarter: Math.round(quarter) });
  }
  return { before: comps.length, after: comps.length - removed.length, removed, extra: candidates.length - removed.length };
}

// ── the sheets ───────────────────────────────────────────────────────────────
// `cells` are SOURCE cell indices (row-major) unless a `from` says otherwise.
// `win` = [y0, y1] inclusive SHEET-y window replacing the cell's own y range,
// measured from the sheet's non-key scanline bands (figure sheets only).
const SHEETS = [
  {
    // BOSS RIG — batch-am2 regeneration. Measured: every band inside its row,
    // so no windows. Rows per CODEX_MASTER_PROMPT_AM2_FIXES sheet 1.
    // Engine binding (packages/game-paint/src/anim.ts entPoseCell, role
    // "guardian"): hover ⇒ the idle cycle `_a.._d` (idleFramesOf counts them,
    // so the hover becomes a 4-frame float); bank_l0 ⇒ `_roll`, the state the
    // guardian's `turn` already resolves to; windup2 ⇒ `_windup` (telegraph),
    // the biggest, most readable rear-back of the three; rest0 ⇒ `_rest`;
    // rest1 ⇒ `_win`, the terminal `consoled` beat (doc 44: she sinks to the
    // ground, exhausted, and the class writes the first lesson back on her).
    // The remaining cells keep their contract names — they are the flight art
    // the boss-fight stage wires when it builds the path lanes.
    file: "batch-am2/tafel_flight.png", cols: 4, rows: 5, mode: "sprite",
    pieces: [
      [0, "tafel_a"], [1, "tafel_b"], [2, "tafel_c"], [3, "tafel_d"],
      [4, "tafel_roll"], [5, "tafel_bank_l1"], [6, "tafel_bank_r0"], [7, "tafel_bank_r1"],
      [8, "tafel_spiral0"], [9, "tafel_spiral1"], [10, "tafel_spiral2"], [11, "tafel_spiral3"],
      [12, "tafel_windup0"], [13, "tafel_windup1"], [14, "tafel_windup"], [15, "tafel_throw"],
      [16, "tafel_land0"], [17, "tafel_land1"], [18, "tafel_rest"], [19, "tafel_win"],
    ],
  },
  {
    // THE COLOURED CHALK — batch-am, with ONE cell replaced: the AM red stick
    // carried black speckle contamination, so cell 2 is taken from the AM2
    // repair sheet instead. Cells 11, 14, 15 are contract spares (verified
    // pure key below, never written).
    file: "batch-am/chalk_projectiles.png", cols: 4, rows: 4, mode: "sprite",
    pieces: [
      [0, "chalk_white"], [1, "chalk_yellow"],
      [2, "chalk_red", { from: "batch-am2/chalk_red_fix.png", cols: 4, rows: 1, cell: 0 }],
      [3, "chalk_blue"],
      [4, "chalk_green"], [5, "chalk_orange"], [6, "chalk_shard_a"], [7, "chalk_shard_b"],
      [8, "chalk_dust0"], [9, "chalk_dust1"], [10, "chalk_dust2"],
      [12, "chalk_mark_a"], [13, "chalk_mark_b"],
    ],
    spares: [11, 14, 15],
  },
  {
    // MERLE'S SIX WRONG ACTIONS — batch-am, four cells replaced from the AM2
    // repair sheet (act_stand + act_leave did not read). The surviving ten
    // originals carry the tuft and are "figure" mode; the four fix cells are
    // painted tuft-free by contract and stay plain sprites.
    // Windows measured per column from the sheet's bands: the act_stand desk
    // overruns into the act_window row, and act_scribble + settle overrun the
    // row boundaries at y=1024 and y=1536.
    file: "batch-am/merle_awakening.png", cols: 4, rows: 4, mode: "figure",
    pieces: [
      [0, "merle_act_sing0", { win: [48, 506] }], [1, "merle_act_sing1", { win: [44, 506] }],
      [2, "merle_act_stand0", { from: "batch-am2/merle_awakening_fix.png", cols: 4, rows: 1, cell: 0, mode: "sprite" }],
      [3, "merle_act_stand1", { from: "batch-am2/merle_awakening_fix.png", cols: 4, rows: 1, cell: 1, mode: "sprite" }],
      [4, "merle_act_scribble0", { win: [542, 1044] }], [5, "merle_act_scribble1", { win: [537, 1044] }],
      [6, "merle_act_window0", { win: [578, 1015], tol: 12 }], [7, "merle_act_window1", { win: [580, 1016], tol: 12 }],
      [8, "merle_act_books0", { win: [1057, 1500] }], [9, "merle_act_books1", { win: [1055, 1517] }],
      [10, "merle_act_leave0", { from: "batch-am2/merle_awakening_fix.png", cols: 4, rows: 1, cell: 2, mode: "sprite" }],
      [11, "merle_act_leave1", { from: "batch-am2/merle_awakening_fix.png", cols: 4, rows: 1, cell: 3, mode: "sprite" }],
      [12, "merle_settle0", { win: [1520, 1999] }], [13, "merle_settle1", { win: [1520, 1995] }],
    ],
    spares: [14, 15],
  },
  {
    // MERLE'S RIG — batch-al exemplar, THE REMAP. She was painted under the AL
    // packet, whose card 5 puts `joy` and `wave` both in row 4; the later AL2
    // wave packet re-specified the layout (row 3 = caged pair + joy pair,
    // row 4 = wave pair + two spares) and that is the layout the whole cast
    // now follows. Her sheet is faithful to AL and non-conformant with AL2, so
    // the import maps SOURCE cells onto AL2 CONTRACT positions — a permutation
    // of the last six positions; everything above row 3 is identity.
    //   contract 10,11 (joy)   ← source 12,13
    //   contract 12,13 (wave)  ← source 14,15
    //   contract 14,15 (spare) ← source 10,11   (verified pure key)
    // Stems follow the engine's grammar where a state exists for the cell
    // (idle `_a.._d`, `_run`, `_joy`) and the contract's own name otherwise.
    file: "batch-al/cast_merle.png", cols: 4, rows: 4, mode: "figure",
    contractCells: 16,
    pieces: [
      [0, "merle_a", { win: [30, 570] }], [1, "merle_b", { win: [30, 570] }],
      [2, "merle_c", { win: [30, 570] }], [3, "merle_d", { win: [30, 570] }],
      [4, "merle_run", { win: [581, 1028] }], [5, "merle_walk1", { win: [581, 1028] }],
      [6, "merle_walk2", { win: [581, 1028] }], [7, "merle_walk3", { win: [581, 1028] }],
      [8, "merle_caged0", { win: [1056, 1510] }], [9, "merle_caged1", { win: [1056, 1510] }],
      [10, "merle_joy", { src: 12, win: [1511, 2011] }], [11, "merle_joy1", { src: 13, win: [1511, 2011] }],
      [12, "merle_wave0", { src: 14, win: [1532, 2021] }], [13, "merle_wave1", { src: 15, win: [1532, 2021] }],
    ],
    spares: [14, 15],
    spareSrc: { 14: 10, 15: 11 },
  },
  {
    // THE CHAPTER TITLE PLATE for the GOAL card. Full-bleed painting, measured
    // 0.000 % magenta — copied whole, unkeyed and unsliced, exactly as the AC
    // and AF plates are. Its lower third is the empty band the chapter's words
    // are printed into, so it must not be trimmed.
    file: "batch-am/ch01_plate.png", cols: 1, rows: 1, mode: "plate",
    pieces: [[0, "plate_ch01_goal"]],
  },
  {
    // THE CAGES — batch-af3. Imported because the skins it paints are exactly
    // the ones the shipped level references: `satchel` carries the six
    // anonymous cages, `pencilcase` is used by cage-merle ALONE, so the
    // person-cage with Merle's face behind the window grid lands only on the
    // chapter's one classmate cage.
    file: "batch-af3/ent_cages.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, "satchel_a"], [1, "satchel_shake"], [2, "satchel_burst"], [3, "pencilcase_a"]],
  },
];

const MIN_ALPHA = { plate: 0.5, sprite: 0.05, figure: 0.05 };
const SPARE_MAX_ALPHA = 0.001; // a contract spare must be pure key

// ── run ──────────────────────────────────────────────────────────────────────
const failures = [];
const written = [];
const tuftLog = [];
const spareLog = [];
fs.mkdirSync(OUT, { recursive: true });

const sheetCache = new Map();
const sheetOf = (rel) => {
  if (!sheetCache.has(rel)) {
    const p = path.join(LAB, rel);
    if (!fs.existsSync(p)) return null;
    sheetCache.set(rel, read(p));
  }
  return sheetCache.get(rel);
};

for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (png === null) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const cw = png.width / sheet.cols;
  const ch = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(ch)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }

  // the contract spares must be genuinely unpainted
  for (const s of sheet.spares ?? []) {
    const srcCell = sheet.spareSrc?.[s] ?? s;
    const img = crop(png, (srcCell % sheet.cols) * cw, Math.floor(srcCell / sheet.cols) * ch, cw, ch);
    chromaKey(img);
    const share = alphaShare(img);
    const note = srcCell === s ? `cell ${s}` : `contract ${s} ← source ${srcCell}`;
    if (share > SPARE_MAX_ALPHA) failures.push(`${sheet.file}: spare ${note} is NOT pure key (alpha ${(share * 100).toFixed(3)}%)`);
    spareLog.push({ file: sheet.file, note, share });
  }

  for (const [pos, stem, opt = {}] of sheet.pieces) {
    const mode = opt.mode ?? sheet.mode;
    let img;
    if (opt.from) {
      const alt = sheetOf(opt.from);
      if (alt === null) { failures.push(`replacement sheet MISSING: ${opt.from}`); continue; }
      const aw = alt.width / opt.cols, ah = alt.height / opt.rows;
      img = crop(alt, (opt.cell % opt.cols) * aw, Math.floor(opt.cell / opt.cols) * ah, aw, ah);
    } else {
      const srcCell = opt.src ?? pos;
      const col = srcCell % sheet.cols;
      const y0 = opt.win ? opt.win[0] : Math.floor(srcCell / sheet.cols) * ch;
      const h = opt.win ? opt.win[1] - opt.win[0] + 1 : ch;
      if (y0 < 0 || y0 + h > png.height) { failures.push(`${stem}: window [${y0},${y0 + h - 1}] leaves the sheet`); continue; }
      img = crop(png, col * cw, y0, cw, h);
    }

    if (mode !== "plate") { chromaKey(img, opt.tol ?? TOL); defringe(img); }
    if (mode === "figure") {
      const t = stripTuft(img);
      tuftLog.push({ stem, ...t });
      if (t.removed.length === 0) failures.push(`${stem}: no tuft component found — the strip rule did not fire`);
      if (t.extra > 0) failures.push(`${stem}: ${t.extra} EXTRA tuft candidate(s) beyond the one removed — inspect before trusting`);
    }
    if (mode !== "plate") {
      const box = contentBox(img);
      if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
      img = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
    }

    const share = alphaShare(img);
    if (share < MIN_ALPHA[mode]) {
      failures.push(`${stem}: nearly empty (alpha ${(share * 100).toFixed(2)}%, need ≥${MIN_ALPHA[mode] * 100}%)`);
      continue;
    }
    fs.writeFileSync(path.join(OUT, `${stem}.png`), PNG.sync.write(img));
    written.push({ stem, mode, w: img.width, h: img.height, alpha: share, from: opt.from ?? sheet.file, pos, src: opt.src ?? opt.cell ?? pos });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
for (const w of written) {
  const remap = w.src !== w.pos ? `  [contract ${w.pos} ← source ${w.src}]` : "";
  console.log(`  ${w.stem.padEnd(22)} ${String(w.w).padStart(4)}×${String(w.h).padEnd(4)} ${w.mode.padEnd(6)} alpha ${(w.alpha * 100).toFixed(1).padStart(5)}%  ← ${w.from}${remap}`);
}
if (tuftLog.length > 0) {
  console.log(`\ntuft strip (components before → after, removed tuft size@rows):`);
  for (const t of tuftLog) {
    const r = t.removed.map((x) => `${x.size}px@y${x.y0}-${x.y1} (top quarter ends y${x.quarter})`).join(" ");
    console.log(`  ${t.stem.padEnd(22)} ${t.before} → ${t.after}   ${r}`);
  }
}
if (spareLog.length > 0) {
  console.log(`\ncontract spares (must be pure key):`);
  for (const s of spareLog) console.log(`  ${s.file} ${s.note}: alpha ${(s.share * 100).toFixed(3)}%`);
}
if (failures.length > 0) {
  console.error(`\nimport-batch-am: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-am: OK — ${written.length} stems from ${SHEETS.length} sheets`);
