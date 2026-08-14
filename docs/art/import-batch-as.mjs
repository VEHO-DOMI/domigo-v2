#!/usr/bin/env node
/**
 * import-batch-as — R5-NACHSTEUER-3 · A4 · THE MASS KIT LANDS.
 * Imports batch AS2 (the p1 calibration of the Massen-Kit) into
 * apps/web/public/art/g1/paint/ch01/.
 *
 *   node docs/art/import-batch-as.mjs
 *
 * Same shape as import-batch-aq, plus ONE new mode this round.
 *
 * ── WHY `opaque` HAD TO EXIST ────────────────────────────────────────────────
 * Every importer before this one assumed painted art arrives on a #FF00FF key
 * and leaves as a cut-out sprite: chroma key → defringe → content trim. The
 * interior mass is the opposite kind of object. SPEC_MASSEN_KIT §7:
 *
 *   "UNGEKEYT heißt: voll deckend, kein Alpha. Innenmassen sind immer ungekeyt;
 *    ein durchscheinendes Innenpixel lässt die Wäsche durch den Boden sehen und
 *    Audit 3 fällt."
 *
 * Run through the sprite path, an opaque sheet would be silently mangled twice:
 * `chromaKey(tol=40)` punches holes wherever the paint's own violet/indigo
 * strays within 40 of magenta, and `contentBox` then trims the sheet to whatever
 * survived — and a tiling surface that has been trimmed is no longer the size
 * the renderer derives its scale from (the exact class of defect A3 measured in
 * the `_loop` sheets: `trim-loop-margins.mjs`, D-40).
 *
 * So `opaque` does none of those things. It slices on the rigid grid, asserts
 * the cell is fully opaque and carries NO key-coloured pixel at all, and writes
 * it unchanged. The contract that was previously only a sentence in a doc is now
 * a gate that hard-fails.
 *
 * ── WHY THE VALUE LAW IS CHECKED HERE ────────────────────────────────────────
 * The spec's per-cell luminance targets are not decoration: audit 1's L2↔L3
 * separation is the file's one ABSOLUTE readability law, and it measures L3
 * straight out of these PNGs. A sheet that drifts out of band is not a look
 * problem to be found later in a screenshot — it is a gate failure waiting for
 * the next phase to trip it. So each piece declares its expected photometric
 * luminance window and the import refuses art outside it.
 *
 * ── WHAT IS DELIBERATELY NOT IMPORTED ────────────────────────────────────────
 * `mass_edges_p1.png` is HELD this round. Two measured defects, neither of them
 * fixable by an importer:
 *
 * 1. THE SIDE EDGES DO NOT TILE VERTICALLY. Cells 0/1 are the left/right edge,
 *    and the spec requires them "senkrecht nahtlos kachelbar". Their paint runs
 *    y 46..483 inside a 512 cell — 46 px of key above, 28 px below — so tiling
 *    at cell height leaves a 74 px hole, and trimming to content does not save
 *    them either: the top content row and the bottom content row differ by a
 *    mean of 102.6 (edgeL) and 126.7 (edgeR) per channel. They do not join.
 *    (This is the same class as D-40: a sheet whose NAME says it repeats and
 *    whose PIXELS say it does not.)
 * 2. THE MOTIFS ARE OFFSET LEFT OF THEIR CELLS. Measured on the rigid grid, the
 *    underside slab of cell 2 spans x 946..1394 — 78 px of it sits in cell 1 —
 *    and cell 3's spans 1473..1920. Row 2's corners are offset the same way.
 *    This one IS importable by declaring each piece's true `box` (the mechanism
 *    already exists), and the boxes are recorded in HELD_EDGE_BOXES below so the
 *    next round does not have to re-measure them.
 *
 * Defect 2 alone would have been imported around. Defect 1 is a re-order, and
 * shipping half a kit whose edges cannot meet its body is worse than shipping
 * the body alone — so the trims stay on today's shared sheets until AS3 lands.
 *
 * `mass_deep_p1` cell 3 is the spec's declared reserve/transition variant
 * (measured 10.56 %); it has no engine consumer yet and is not imported, so it
 * cannot become dead art in the audit-B count.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

// D-69 (vor der K1-Entdopplung: D-33) asked for exactly this one line: the lab root is overridable, so the
// import can be pointed at a fixture copy and TAMPER-TESTED without anyone
// editing the delivered batch in place.
const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");

const TOL = 40;
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;
/** the importer's own fringe rule — the one that erases painted pixels */
const isFringe = (r, g, b) => r > 120 && b > 120 && r - g > 55 && b - g > 55;

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

/** photometric luminance, 0–100 %. The same weighting check-composition uses. */
const luma = (png) => {
  let sum = 0;
  const n = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    sum += 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
  }
  return (sum / n / 255) * 100;
};

/** mean HSV-style saturation, 0–100 %. Sediment must keep a hue (spec §4). */
const saturation = (png) => {
  let sum = 0;
  const n = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    sum += mx === 0 ? 0 : (mx - mn) / mx;
  }
  return (sum / n) * 100;
};

/**
 * Does this cell tile with ITSELF? SPEC_MASSEN_KIT §3: "Nahtlos heißt hier:
 * links↔rechts UND oben↔unten mit sich selbst UND mit den drei Geschwistern."
 *
 * The trap this check exists for: a join is only a SEAM if it is bigger than the
 * painting's own texture. A wall of book spines changes by ~6–7 per column all
 * by itself, so an absolute threshold would either pass everything or fail
 * everything. What the eye picks out is a step that stands OUT of the noise — so
 * the join is measured against the cell's own mean column-to-column step.
 *
 * ── AND THE CHEAT IT HAS TO DEFEAT ───────────────────────────────────────────
 * Measuring the join as "last row against first row" is not enough, because a
 * sheet can pass that test by DUPLICATING its boundary row: the metric reads a
 * perfect 0.00 while the picture steps hard one row further in. Batch AS2 does
 * exactly this on both axes of all eight cells — its worst horizontal join,
 * 32.11, sits in the cell whose naive score is 0.07.
 *
 * ── AND WHY "ONE PIXEL IN" IS ALSO NOT ENOUGH ────────────────────────────────
 * Stepping one column in defeats a one-column duplicate and nothing more. Worse,
 * it cannot tell a cheat from the CORRECT technique, because both begin the same
 * way: a properly blended tile also has identical pixels at its join. The two
 * only separate in what happens NEXT.
 *
 * So the join is measured as a PROFILE — |col k − col (W−1−k)| for k = 0…8 — and
 * what is judged is its shape:
 *
 *   AS3 (a real cross-fade)   0.00 · 0.00 · 0.00 · 1.64 · 3.39 · 5.17 · 6.93 …
 *   AS2 (a pasted column)    13.72 · 45.17 · 49.72 · 55.40 · 61.16 · 69.71 …
 *
 * A blended seam climbs out of its join no faster than the painting's own
 * texture. A hidden one JUMPS — because the pixels behind the duplicate belong
 * to a different part of the picture. Both are measured here: the join itself,
 * and the largest single step in the profile.
 */
const PROFILE_DEPTH = 8;
const selfTile = (png) => {
  const { width: W, height: H, data } = png;
  const at = (x, y, o) => data[(y * W + x) * 4 + o];
  const rowDiff = (a, b) => {
    let s = 0;
    for (let x = 0; x < W; x++) for (let o = 0; o < 3; o++) s += Math.abs(at(x, a, o) - at(x, b, o));
    return s / (W * 3);
  };
  const colDiff = (a, b) => {
    let s = 0;
    for (let y = 0; y < H; y++) for (let o = 0; o < 3; o++) s += Math.abs(at(a, y, o) - at(b, y, o));
    return s / (H * 3);
  };
  let inner = 0;
  for (let y = 0; y < H; y++) for (let x = 1; x < W; x++) for (let o = 0; o < 3; o++) inner += Math.abs(at(x, y, o) - at(x - 1, y, o));
  const jump = (profile) => {
    let worst = 0;
    for (let i = 1; i < profile.length; i++) worst = Math.max(worst, profile[i] - profile[i - 1]);
    return worst;
  };
  const lrProfile = [], tbProfile = [];
  for (let k = 0; k <= PROFILE_DEPTH; k++) {
    lrProfile.push(colDiff(k, W - 1 - k));
    tbProfile.push(rowDiff(k, H - 1 - k));
  }
  return {
    lr: lrProfile[0], tb: tbProfile[0],
    lrJump: jump(lrProfile), tbJump: jump(tbProfile),
    inner: inner / ((W - 1) * H * 3),
  };
};
const SEAM_OVER_TEXTURE = 1.5;

/** an interior sheet must be FULLY opaque and carry no key colour whatsoever */
const opaqueFaults = (png, stem) => {
  const bad = [];
  let translucent = 0, keyed = 0, fringe = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] !== 255) translucent++;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (isMagenta(r, g, b)) keyed++;
    else if (isFringe(r, g, b)) fringe++;
  }
  if (translucent > 0) bad.push(`${stem}: ${translucent} px are not fully opaque — an interior sheet must be UNGEKEYT (spec §7; audit 3 falls)`);
  if (keyed > 0) bad.push(`${stem}: ${keyed} px are key-coloured — an opaque interior may not contain #FF00FF`);
  if (fringe > 0) bad.push(`${stem}: ${fringe} px match the importer's own fringe rule and would be erased by any keyed path`);
  return bad;
};

// ── the sheets ───────────────────────────────────────────────────────────────
// Naming: `<class>_<phase>_<cell>`, the convention the crust already uses
// (`crust_p1_a`). SPEC_MASSEN_KIT names sheets and cells but no stems — this is
// where the spec's paint meets the engine's stem table, and the mapping is:
//
//   mass_body_p1  row 1 → body variants        (the room's paper, 46 %)
//   mass_body_p1  row 2 → the SAME four, one stop deeper — the lower half of the
//                         body band draws PIGMENT instead of wearing a multiply
//   mass_deep_p1  0,1   → fade variants        (12–18 %)
//   mass_deep_p1  2     → sediment             (7–10 %, saturation ≥ 12 %)
//   mass_deep_p1  3     → reserve, not imported

const SHEETS = [
  {
    file: "batch-as3/mass_body_p1.png", cols: 4, rows: 2, mode: "opaque",
    pieces: [
      [0, "mass_body_p1_a", { luma: [42, 50], tiles: true }],
      [1, "mass_body_p1_b", { luma: [42, 50], tiles: true }],
      [2, "mass_body_p1_c", { luma: [42, 50], tiles: true }],
      [3, "mass_body_p1_d", { luma: [42, 50], tiles: true }],
      // row 2 — "eine Blende tiefer" (spec §3). No band of its own: it is the
      // deep half of the body band, so the fall stops being a filter.
      [4, "mass_bodydeep_p1_a", { luma: [26, 38], tiles: true }],
      [5, "mass_bodydeep_p1_b", { luma: [26, 38], tiles: true }],
      [6, "mass_bodydeep_p1_c", { luma: [26, 38], tiles: true }],
      [7, "mass_bodydeep_p1_d", { luma: [26, 38], tiles: true }],
    ],
  },
  {
    file: "batch-as3/mass_deep_p1.png", cols: 4, rows: 1, mode: "opaque",
    pieces: [
      [0, "mass_fade_p1_a", { luma: [12, 18], tiles: true }],
      [1, "mass_fade_p1_b", { luma: [12, 18], tiles: true }],
      // Cell 2 IS the sediment and it now passes every check (8.25 %,
      // saturation 56.7 %, seam clean) — and it is still NOT imported, for the
      // same measured reason as last round: `BAND_HANDOVER.fade` was tuned to
      // meet a near-black floor, so against a lightened one the drawn chain
      // steps back UP (13.84 × 0.55 = 7.61, then 8.25) and "never brightens as
      // it deepens" is a law. p1 draws ZERO sediment pieces (only p2 reaches it),
      // so importing it here would buy nothing visible and cost a law. It lands
      // with p2's kit, together with making the handover kit-derived. See D-50.
    ],
  },
];

/** Measured true boxes of the HELD edge sheet, so AS3 need not re-derive them.
 *  [x0, y0, x1, y1] inclusive, sheet coordinates. */
const HELD_EDGE_BOXES = {
  edgeL: [70, 46, 182, 483], edgeR: [665, 46, 777, 483],
  edgeD_l: [946, 180, 1394, 359], edgeD_r: [1473, 180, 1920, 359],
  cornerBL: [69, 578, 365, 934], cornerBR: [481, 578, 778, 934],
  inCornerL: [1004, 593, 1372, 939], inCornerR: [1497, 593, 1869, 939],
};

// ── run ──────────────────────────────────────────────────────────────────────
const failures = [];
const written = [];
fs.mkdirSync(OUT, { recursive: true });

for (const sheet of SHEETS) {
  const src = path.join(LAB, sheet.file);
  if (!fs.existsSync(src)) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const png = read(src);
  const cw = png.width / sheet.cols;
  const ch = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(ch)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }
  if (cw !== 512 || ch !== 512) {
    failures.push(`${sheet.file}: cells are ${cw}×${ch}; the mass kit is painted on 512×512 cells and bodyScaleOf reads that width`);
    continue;
  }

  for (const [pos, stem, opt = {}] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);

    // `opaque` writes what was painted: no key, no defringe, no content trim.
    const faults = opaqueFaults(img, stem);
    if (faults.length > 0) { failures.push(...faults); continue; }

    const L = luma(img);
    if (opt.luma !== undefined) {
      const [lo, hi] = opt.luma;
      if (L < lo || L > hi) {
        failures.push(`${stem}: luminance ${L.toFixed(2)} %, spec window ${lo}–${hi} % (audit 1 measures L3 from this file)`);
        continue;
      }
    }
    let seam = null;
    if (opt.tiles === true) {
      seam = selfTile(img);
      const worst = Math.max(seam.lr, seam.tb);
      const limit = seam.inner * SEAM_OVER_TEXTURE;
      if (worst > limit) {
        failures.push(`${stem}: does not tile with itself — join ${worst.toFixed(2)} against its own mean step ${seam.inner.toFixed(2)} (${(worst / seam.inner).toFixed(1)}×, limit ${SEAM_OVER_TEXTURE}×)`);
        continue;
      }
      const jump = Math.max(seam.lrJump, seam.tbJump);
      if (jump > limit) {
        failures.push(`${stem}: its seam is HIDDEN, not closed — the join reads ${worst.toFixed(2)} but the picture jumps ${jump.toFixed(2)} within ${PROFILE_DEPTH} px of it, against a texture step of ${seam.inner.toFixed(2)}. A blended edge climbs out gently; a duplicated one hides a cut.`);
        continue;
      }
    }
    let S = null;
    if (opt.sat !== undefined) {
      S = saturation(img);
      if (S < opt.sat) {
        failures.push(`${stem}: saturation ${S.toFixed(2)} %, spec needs ≥${opt.sat} % — a floor without hue is an absence, not a shadow`);
        continue;
      }
    }

    fs.writeFileSync(path.join(OUT, `${stem}.png`), PNG.sync.write(img));
    written.push({ stem, w: img.width, h: img.height, luma: L, sat: S, seam, from: sheet.file });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
for (const w of written) {
  const sat = w.sat === null ? "" : `  sat ${w.sat.toFixed(1)}%`;
  const seam = w.seam === null ? "" : `  seam ${(Math.max(w.seam.lr, w.seam.tb) / w.seam.inner).toFixed(2)}× · climb ${(Math.max(w.seam.lrJump, w.seam.tbJump) / w.seam.inner).toFixed(2)}×`;
  console.log(`  ${w.stem.padEnd(22)} ${String(w.w).padStart(4)}×${String(w.h).padEnd(4)} opaque  luma ${w.luma.toFixed(2).padStart(6)}%${sat}${seam}  ← ${w.from}`);
}
console.log(`\nHELD (not imported): batch-as3/mass_edges_p1.png — AS3 fixed the padding (both side edges now fill their full 512 cell) and edgeL joins at 0.59, but edgeR still joins at 16.43, and the underside/corner motifs still straddle their cell boundaries (cell 2's slab spans x 946..1394). ${Object.keys(HELD_EDGE_BOXES).length} measured boxes recorded in this file.`);
if (failures.length > 0) {
  console.error(`\nimport-batch-as: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-as: OK — ${written.length} stems from ${SHEETS.length} sheets`);
