#!/usr/bin/env node
/**
 * import-batch-aq — R5-W1 · A2 · THE ART WIRING ROUND.
 * Imports the reviewed batches AQ + AQ2 into apps/web/public/art/g1/paint/ch01/.
 *
 *   node docs/art/import-batch-aq.mjs
 *
 * Same laws as import-batch-ap (tol-40 chroma key → 3-pass defringe → content
 * trim → alpha audit; exit 1 on any failure). Three IMPORT RULINGS this round,
 * each measured before it was written down:
 *
 * 1. `_a` IS THE RESTORED CELL, NEVER THE DRAINED ONE. The commission asked
 *    for a drained pose per being, and Codex painted one (schere_wesen cell 0:
 *    grey, lying down). It is NOT imported. The engine drains at RUNTIME — a
 *    grey wash laid over the being's own sheet, floodingaway when the restore
 *    card is answered (anim.washAlphaFor / WASH_ALPHA). Importing a pre-greyed
 *    cell as `_a` would drain it twice: grey art under a grey wash is a being
 *    that can never come back to colour, and the restore card's whole payoff is
 *    that it does. The debt register's own wording agrees — D-13 asks for "das
 *    Wesen-Paar (>=a/b)", which is the two RESTORED poses.
 *
 * 2. A BEING WITH STATE CELLS IS NOT REPAINTED ONE CELL AT A TIME. D-14 asked
 *    for colour separations and says "Stem-Austausch, IDs unverändert" — but
 *    four of the seven beings it repaints carry a full state set painted in an
 *    EARLIER batch, in the OLD colours:
 *      pencil  _a _act _b _dazed _run        (5 cells)
 *      eraser  _a _act _b _dazed _squash     (5)
 *      ranzen  _a _act _dazed _stomp _telegraph (5)
 *      satchel _a _burst _shake              (3)
 *    Replacing only `_a` would make a runner whose idle frame is a different
 *    colour from its own running frame — a being that changes colour when it
 *    moves. So only the three beings whose sheet IS one cell are replaced here
 *    (gluestick · sharpener · schoolbag), and the other four are FILED for a
 *    full-state repaint. This is a gap in the commission, not in the delivery.
 *
 * 3. THE CAGED-INMATE ROW IS NOT WIRED. cage_insassen row 2 was commissioned as
 *    "die GRAU-SILHOUETTE hinter Gittern (für die satchel-Hülle)" — a silhouette
 *    layer to sit inside the EXISTING cage skin. Codex painted four complete
 *    NEW cages instead (a wicker basket with a padlock), and farb_audit cell 2
 *    repeats the same invented cage. Wiring them would silently replace ch01's
 *    cage design, which the cage law and the B20 portrait law both make a Koki
 *    gate. Row 1 (the four inmate portraits) imports; row 2 is filed for the
 *    architect with the deviation named.
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

// ── the sheets ───────────────────────────────────────────────────────────────
// `box` = [x0, y0, x1, y1] inclusive SHEET coordinates (the measured figure
// window). Cells without a box slice on the rigid grid.

const SHEETS = [
  {
    // THE TREASURE PICKUPS — AQ Blatt 4 (D-15). The two stems that have been
    // ENGINE-DRAWN allowlist fallbacks since PK-R3b finally have paint, which
    // is the one place this round can prove itself in a number: the allowlist
    // goes from two entries to zero.
    // Cell 1 is the opened page for the reading card; it lands on disk now so
    // the card lane can wire it without a second import round.
    file: "batch-aq/schatz_pickups.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, "regelseite_a"], [1, "regelseite_open"], [2, "bonusbuch_a"]],
    spares: [3],
  },
  {
    // THE SCISSORS — AQ Blatt 2 (D-13). p2's restore find has been running on
    // an obj_pencil placeholder, which made the phase carry two identical
    // pencils. Cell 0 (drained) is deliberately NOT imported — see ruling 1.
    file: "batch-aq/schere_wesen.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[1, "obj_scissors_a"], [2, "obj_scissors_b"]],
    spares: [3],
  },
  {
    // THE COLOUR AUDIT — AQ Blatt 3 (D-14), Koki's "nicht alles braun".
    // Only the single-cell beings are swapped here; see ruling 2 for the four
    // that are not, and why swapping them would be worse than leaving them.
    file: "batch-aq/farb_audit.png", cols: 4, rows: 2, mode: "sprite",
    pieces: [[0, "obj_gluestick_a"], [1, "obj_sharpener_a"], [4, "obj_schoolbag_a"]],
    spares: [7],
  },
  {
    // THE CAGE INMATES — AQ Blatt 1 (D-18/D-19/D-21), row 1 only (ruling 3).
    // These are portraits for the rescue cards, not world beings; they land on
    // disk so the B20 wiring is a one-line change whenever Koki opens that gate.
    file: "batch-aq/cage_insassen.png", cols: 4, rows: 2, mode: "sprite",
    pieces: [[0, "obj_soundsystem"], [1, "obj_tablet"], [2, "obj_chair"], [3, "obj_picture"]],
  },
];

const MIN_ALPHA = { sprite: 0.05, keyplate: 0.5, band: 0.1 };
const SPARE_MAX_ALPHA = 0.001;

// ── run ──────────────────────────────────────────────────────────────────────
const failures = [];
const written = [];
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

  for (const s of sheet.spares ?? []) {
    const img = crop(png, (s % sheet.cols) * cw, Math.floor(s / sheet.cols) * ch, cw, ch);
    chromaKey(img);
    const share = alphaShare(img);
    if (share > SPARE_MAX_ALPHA) failures.push(`${sheet.file}: spare cell ${s} is NOT pure key (alpha ${(share * 100).toFixed(3)}%)`);
    spareLog.push({ file: sheet.file, cell: s, share });
  }

  for (const [pos, stem, opt = {}] of sheet.pieces) {
    const mode = sheet.mode;
    let img;
    if (opt.box) {
      const [bx0, by0, bx1, by1] = opt.box;
      img = crop(png, bx0, by0, bx1 - bx0 + 1, by1 - by0 + 1);
    } else {
      img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);
    }

    chromaKey(img, opt.tol ?? TOL);
    defringe(img);
    if (sheet.darken !== undefined) {
      for (let i = 0; i < img.data.length; i += 4) {
        if (img.data[i + 3] > 8) {
          img.data[i] = Math.round(img.data[i] * sheet.darken);
          img.data[i + 1] = Math.round(img.data[i + 1] * sheet.darken);
          img.data[i + 2] = Math.round(img.data[i + 2] * sheet.darken);
        }
      }
    }
    if (mode === "sprite") {
      const box = contentBox(img);
      if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
      img = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);
    }
    if (sheet.assertSize) {
      const [aw, ah] = sheet.assertSize;
      if (img.width !== aw || img.height !== ah) {
        failures.push(`${stem}: ${img.width}×${img.height}, contract demands ${aw}×${ah}`);
        continue;
      }
    }

    const share = alphaShare(img);
    if (share < MIN_ALPHA[mode]) {
      failures.push(`${stem}: nearly empty (alpha ${(share * 100).toFixed(2)}%, need ≥${MIN_ALPHA[mode] * 100}%)`);
      continue;
    }
    fs.writeFileSync(path.join(OUT, `${stem}.png`), PNG.sync.write(img));
    written.push({ stem, mode, w: img.width, h: img.height, alpha: share, from: sheet.file });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
for (const w of written) {
  console.log(`  ${w.stem.padEnd(22)} ${String(w.w).padStart(4)}×${String(w.h).padEnd(4)} ${w.mode.padEnd(8)} alpha ${(w.alpha * 100).toFixed(1).padStart(5)}%  ← ${w.from}`);
}
if (spareLog.length > 0) {
  console.log(`\ncontract spares (must be pure key):`);
  for (const s of spareLog) console.log(`  ${s.file} cell ${s.cell}: alpha ${(s.share * 100).toFixed(3)}%`);
}
if (failures.length > 0) {
  console.error(`\nimport-batch-aq: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-aq: OK — ${written.length} stems from ${SHEETS.length} sheets`);
