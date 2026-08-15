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
 * ── THE EDGE SHEET, AND THE FINDING THAT RELEASED IT (R5-W4 · A6) ────────────
 * `mass_edges_p1.png` was held for two rounds on this reading, recorded in the
 * version of this header that stood until today:
 *
 *   1. "THE SIDE EDGES DO NOT TILE VERTICALLY … their paint runs y 46..483
 *      inside a 512 cell — 46 px of key above, 28 px below."
 *   2. "THE MOTIFS ARE OFFSET LEFT OF THEIR CELLS."
 *
 * Finding 2 is true and is exactly what `opt.box` is for. **Finding 1 is not a
 * property of this sheet.** y 46..483 is where AS2 painted its side edges. AS3
 * paints them y 0..511, and every measurement in that sentence was taken by
 * applying AS2's window to AS3's picture. Cut at its own box, the left edge joins
 * top-to-bottom at 2.63 against a texture step of 12.96 — an eighth of the limit
 * — and the right edge at 2.60. Cut at the inherited box, the same sheet joins at
 * 63.35 and 56.85, which is D-47 to the decimal. The seam was in the table, not
 * in the paint. (`--selftest` pins both halves of that comparison.)
 *
 * The delivery's own verification sheet reaches the opposite verdict — it reports
 * `"state": "FAIL"` — for one reason: it measures whole 512 cells. This sheet has
 * wide bands of generator smear between the motifs, and three of its four
 * findings are that smear being averaged in.
 *
 * WHAT THE SHEET REALLY DOES NOT CARRY, measured here and re-ordered as AS5:
 *   · the two UNDERSIDE cells cannot tile left↔right — 75.73 / 75.40 against a
 *     texture step of 5.58 — and no sub-window of any width at any offset does
 *     either. They are one-shot pieces. See the note at cells 2/3.
 *   · RAMPS were never ordered on this sheet; §5's eight cells are all spoken
 *     for. `mass_ramp_up/_down` stay shared placeholders in every room.
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

/**
 * ── WHY THE MEASURES SKIP TRANSPARENT PIXELS (R5-W4 · A6) ────────────────────
 * Until this round every sheet this importer touched was fully opaque, so
 * "average over all pixels" and "average over the painting" were the same
 * number. The edge sheet is KEYED, and on it the two diverge violently: its
 * eight boxes are 21–99 % paint, so a flat average measures mostly magenta.
 *
 * That is not a hypothetical. The delivery's own verification sheet
 * (`batch-as3/AS3_VERIFICATION.json`) reports `"state": "FAIL"` with four
 * findings, and three of them are this mistake: it measured whole 512 cells,
 * including the key and the generator's smear between the motifs. Measured on
 * the painted pixels inside each declared box, those three findings evaporate
 * (corner luminance 47.4 → 54.3, 50.6 → 52.8, 49.6 → 52.3).
 *
 * Opaque sheets are unaffected — every pixel passes the alpha test — so the
 * numbers this importer has printed for the body and deep sheets do not move.
 */
const OPAQUE_ENOUGH = 128;

/** photometric luminance of the PAINTING, 0–100 %. Same weighting as check-composition. */
const luma = (png) => {
  let sum = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < OPAQUE_ENOUGH) continue;
    sum += 0.2126 * png.data[i] + 0.7152 * png.data[i + 1] + 0.0722 * png.data[i + 2];
    n++;
  }
  return n === 0 ? 0 : (sum / n / 255) * 100;
};

/** mean HSV-style saturation of the PAINTING, 0–100 %. Sediment must keep a hue (spec §4). */
const saturation = (png) => {
  let sum = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < OPAQUE_ENOUGH) continue;
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    sum += mx === 0 ? 0 : (mx - mn) / mx;
    n++;
  }
  return n === 0 ? 0 : (sum / n) * 100;
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
  const on = (x, y) => data[(y * W + x) * 4 + 3] >= OPAQUE_ENOUGH;
  // A pair is only evidence where BOTH sides carry paint: on a keyed trim the
  // key area would otherwise compare magenta against magenta and report a
  // perfect 0.00 for the very rows that hold nothing.
  const rowDiff = (a, b) => {
    let s = 0, n = 0;
    for (let x = 0; x < W; x++) {
      if (!on(x, a) || !on(x, b)) continue;
      for (let o = 0; o < 3; o++) s += Math.abs(at(x, a, o) - at(x, b, o));
      n++;
    }
    return n === 0 ? 0 : s / (n * 3);
  };
  const colDiff = (a, b) => {
    let s = 0, n = 0;
    for (let y = 0; y < H; y++) {
      if (!on(a, y) || !on(b, y)) continue;
      for (let o = 0; o < 3; o++) s += Math.abs(at(a, y, o) - at(b, y, o));
      n++;
    }
    return n === 0 ? 0 : s / (n * 3);
  };
  let inner = 0, innerN = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 1; x < W; x++) {
      if (!on(x, y) || !on(x - 1, y)) continue;
      for (let o = 0; o < 3; o++) inner += Math.abs(at(x, y, o) - at(x - 1, y, o));
      innerN++;
    }
  }
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
    inner: innerN === 0 ? 0 : inner / (innerN * 3),
  };
};
const SEAM_OVER_TEXTURE = 1.5;

/**
 * ── WHY THE SEAM CHECK NEEDED AN AXIS (R5-W4 · A6) ───────────────────────────
 * `tiles: true` judges `max(lr, tb)` — both axes at once. That is right for an
 * interior cell, which the engine lays out in both directions. It is WRONG for a
 * trim: `planMass` repeats a side edge only DOWNWARDS (`tileAnchor: "xy"` over a
 * one-cell-wide strip) and an underside edge only SIDEWAYS. A side edge has a
 * painted outer face and a cut inner face; demanding that those two join is
 * demanding that a wall be a tube.
 *
 * Measured on the delivered sheet, that is not a nicety: `mass_edge_p1_l` joins
 * vertically at 2.63 against a limit of 21.11 (it tiles, eightfold) and
 * horizontally at 108.67 (it does not, and must not).
 *
 *   tiles: "v"   top↔bottom must close   (side edges)
 *   tiles: "h"   left↔right must close   (underside edges)
 *   tiles: true  both                    (interior cells)
 */
const seamAxes = (want) => (want === true ? ["lr", "tb"] : want === "h" ? ["lr"] : want === "v" ? ["tb"] : []);
const AXIS_NAME = { lr: "left↔right", tb: "top↔bottom" };

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

// ── the keyed path (R5-W4 · A6) ──────────────────────────────────────────────
// Lifted verbatim from `import-batch-ap.mjs:66-118`, which is the file that
// already cuts keyed art out of declared boxes. Copied rather than imported
// because every importer in this folder carries its own copy by house habit —
// the one shared image module is `scripts/key-fringe.mjs`, and it is the GATE's
// half of the pair, not the importer's.
//
// What is DELIBERATELY not lifted: `contentBox`-trimming. A trimmed tiling sheet
// is no longer the size the renderer derives its scale from (D-40, and this
// file's own header). Here the declared box IS the content window, measured; the
// import PROVES that rather than re-deriving it (see `boxFaults`).
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
        if (isFringe(data[i], data[i + 1], data[i + 2])) kill.push(i);
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

/**
 * ── WHAT A DECLARED BOX HAS TO EARN ──────────────────────────────────────────
 * A box is a claim about where a motif sits. The claim can be wrong in two
 * directions, and only one of them is visible later:
 *
 *   TOO SMALL — the motif is clipped. Loud: the picture is missing.
 *   TOO BIG   — the box carries key on one side. SILENT, and fatal for a tiling
 *               trim: the strip repeats a transparent gutter down the flank, and
 *               nothing in the pipeline says so, because the sheet is keyed and a
 *               keyed gutter is legal everywhere else.
 *
 * So the box must be exactly the paint: content has to reach every declared edge.
 * That is also the check that would have caught the boxes this round inherited —
 * `HELD_EDGE_BOXES` was measured on the AS2 sheet, and on AS3 the two side edges
 * paint their full cell (y 0..511, not y 46..483). Applied unchanged, the old
 * y-range leaves 74 px of gutter and the vertical join reads 65.09 instead of
 * 2.63. That is D-47 exactly, and it was never in the painting.
 */
const BOX_SLACK_PX = 2;
const boxFaults = (png, stem, box) => {
  const bad = [];
  const cb = contentBox(png);
  if (cb === null) { bad.push(`${stem}: the declared box keys to nothing`); return bad; }
  const W = png.width, H = png.height;
  const gaps = { left: cb.x0, top: cb.y0, right: W - 1 - cb.x1, bottom: H - 1 - cb.y1 };
  const loose = Object.entries(gaps).filter(([, g]) => g > BOX_SLACK_PX);
  if (loose.length > 0) {
    bad.push(
      `${stem}: the declared box [${box.join(", ")}] is bigger than its painting — ` +
        loose.map(([side, g]) => `${g} px of key on the ${side}`).join(", ") +
        `. A tiling trim repeats that gutter; measure the box at the sheet you are importing.`,
    );
  }
  return bad;
};

/**
 * The two mechanisms that can eat a painted pixel on a keyed import, measured
 * rather than assumed — see the header note on the ≥150 rule.
 */
const keyHealth = (png) => {
  let nearest = Infinity, impure = 0, keyed = 0, wouldErase = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (isMagenta(r, g, b)) {
      keyed++;
      if (!(r === 255 && g === 0 && b === 255)) impure++;
      continue;
    }
    nearest = Math.min(nearest, Math.hypot(r - 255, g, b - 255));
    if (isFringe(r, g, b)) wouldErase++;
  }
  return { nearest, impure, keyed, wouldErase };
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

/**
 * ── THE EDGE BOXES, RE-MEASURED AT THE SHEET BEING IMPORTED (D-95 / D-96) ─────
 *
 * `HELD_EDGE_BOXES` — the name this table carried while the sheet was held — was
 * measured on batch AS2. AS3 is a different picture. Every one of the eight was
 * re-measured against `batch-as3/mass_edges_p1.png` before it was used here, and
 * the outcome is smaller and sharper than D-96 feared:
 *
 *   SIX ARE CORRECT to within a pixel. The underside slabs, both outer corners
 *   and both inner corners sit exactly where AS2 put them — including the offsets
 *   that straddle a cell boundary (cell 2's slab really does begin at x 946, 78 px
 *   inside cell 1), which is why boxes were needed at all.
 *
 *   TWO ARE STALE, and only in y. AS2 painted its side edges y 46..483 inside the
 *   512 cell; AS3 paints them y 0..511. Two numbers, and they are the whole of
 *   D-47:
 *
 *     box                      vertical join    the sheet's own texture step
 *     edgeL [70, 46, 182, 483]     65.09        limit 21.20   ✗ 3.1× — a seam
 *     edgeL [70,  0, 182, 511]      2.63        limit 21.11   ✓ 0.12× — invisible
 *     edgeR [665, 46, 777, 483]    58.69        limit 20.69   ✗
 *     edgeR [665,  0, 777, 511]     2.60        limit 20.56   ✓
 *
 * The defect was never in the painting. It was in a table that outlived the
 * sheet it described — and the header of this very file still carries the
 * conclusion drawn from it ("THE SIDE EDGES DO NOT TILE VERTICALLY"), measured
 * honestly, at the wrong picture. `--selftest` pins both rows of that table so
 * the mistake cannot be made silently again.
 *
 * [x0, y0, x1, y1] inclusive, sheet coordinates.
 */
const EDGE_BOXES = {
  edgeL: [70, 0, 182, 511], edgeR: [665, 0, 777, 511],
  edgeD_l: [946, 180, 1394, 359], edgeD_r: [1473, 180, 1920, 359],
  cornerBL: [69, 578, 365, 934], cornerBR: [481, 578, 778, 934],
  inCornerL: [1004, 593, 1372, 939], inCornerR: [1497, 593, 1869, 939],
};
/** the stale y-range, kept as a fixture so the selftest can prove it goes red */
const STALE_SIDE_BOXES = { edgeL: [70, 46, 182, 483], edgeR: [665, 46, 777, 483] };

/**
 * DECLARED EXCEPTIONS to the per-piece luminance window — the NOT_A_GATE idiom
 * from `import-batch-aq6.mjs`. Named piece, measured number, written reason.
 * An exception here still PRINTS, loudly, every run; what it buys is that the
 * import proceeds while the question is open. Empty is the healthy state.
 */
const LUMA_EXCEPTIONS = {};

/** non-fatal remarks, printed after the table */
const notes = [];

/**
 * ── THE TRIM WINDOW IS DERIVED, NOT COPIED (R5-W4 · A6) ──────────────────────
 * Spec §5 gives the side edges an absolute target, "52 – 58 %", and says in the
 * same breath what it MEANS: "also 6 – 12 Punkte über dem Körper, nicht 25". The
 * absolute number is arithmetic on a body that measured 46.2 % in July. Copying
 * it forward makes every future phase's trim window a claim about p1's paper.
 *
 * So the window is computed from the body variants imported in this very run.
 * And it carries the body's OWN spread as its tolerance, because the body is not
 * one number: p1's four variants measure 46.51 · 44.77 · 45.97 · 46.79, a spread
 * of 2.02 points. A law expressed relative to "the body" cannot be sharper than
 * the body is. Half that spread is the tolerance; nothing else is.
 *
 * Measured consequence on this delivery: `mass_incorner_p1_r` sits 5.91 points
 * above the body — 0.09 under a hard 6 — and passes, correctly, because the
 * quantity it is being compared against is itself ±1.01. `mass_edge_p1_r` sits
 * 14.21 above and still fails, correctly. The tolerance moved the boundary case
 * and left the real finding standing.
 */
/** every piece's measured luminance, by stem — so a sibling can be matched to it */
const measured = new Map();

const bodyRef = { lumas: [], mean: 0, spread: 0 };
const bodyWindow = ([lo, hi]) => {
  if (bodyRef.lumas.length === 0) return [lo, hi]; // no body imported yet — fall back to raw points
  const tol = bodyRef.spread / 2;
  return [bodyRef.mean + lo - tol, bodyRef.mean + hi + tol];
};
/**
 * ── ONE DECLARED CORRECTION, AND WHY IT IS NOT A FILTER (R5-W4 · A6) ─────────
 * The delivered right edge measures 60.22 % — 14.21 points above the body, where
 * §5 asks for 6–12 — while the left edge measures 54.88 %, 8.87 above. Both are
 * the same material on the same platform, and a side-scroller shows both flanks
 * of a block at once with an unbroken body between them, so the 5.34-point gap
 * does not read as light falling from one side. It reads as Koki's own sentence:
 * "die Schattierungen der Blöcke sind uneinheitlich".
 *
 * So the right edge is brought to the left edge's own offset. The move is
 * A5's (`scripts/set-plane-value.mjs`, R15): ONE multiplicative pass, hue and
 * saturation untouched — the same painting in a different key, not a filter over
 * it. It happens here rather than in a separate script so that it is re-derived
 * on every import and can never drift away from the number that justified it.
 *
 * TWO RULES THIS OBEYS, both encoded below:
 *   · Only DOWNWARDS. Multiplying a painting up clips its highlights and invents
 *     material that was never painted. A piece that is too DARK is a re-order.
 *   · Never far. A correction beyond 15 % is not a key change, it is the wrong
 *     art, and it fails instead of quietly rescuing the delivery.
 *
 * The delivered value stays in the log line every run, so the artist's number is
 * never lost behind ours. If the panel reads the asymmetry as light after all,
 * deleting one option restores the delivery exactly.
 */
const TONE_MAX_CORRECTION = 0.15;
const toneTo = (png, target) => {
  const before = luma(png);
  if (before <= 0) return { before, after: before, factor: 1 };
  const factor = target / before;
  if (factor >= 1 || factor < 1 - TONE_MAX_CORRECTION) return { before, after: before, factor, refused: true };
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < OPAQUE_ENOUGH) continue;
    png.data[i] = Math.round(png.data[i] * factor);
    png.data[i + 1] = Math.round(png.data[i + 1] * factor);
    png.data[i + 2] = Math.round(png.data[i + 2] * factor);
  }
  return { before, after: luma(png), factor };
};

const rememberBody = (stem, L) => {
  if (!/^mass_body_p1_/.test(stem)) return;
  bodyRef.lumas.push(L);
  bodyRef.mean = bodyRef.lumas.reduce((a, b) => a + b, 0) / bodyRef.lumas.length;
  bodyRef.spread = Math.max(...bodyRef.lumas) - Math.min(...bodyRef.lumas);
};

// ── HELD AGAIN, AND THIS TIME THE GEOMETRY IS PROVEN GOOD ────────────────────
// The block below imports cleanly: the boxes are re-measured, the sides tile
// vertically at 2.63 against a limit of 19.4, the key is exact, defringe eats
// nothing. It is commented out anyway, because two blind critics ranked the
// resulting flank LAST of four — below the placeholder it replaces — for a
// reason no check in this file can measure: the sheet paints book COVERS where
// a flank must paint the fore-edge, the cut through the material.
//
// It stays here rather than being deleted so the re-order is cheap: the boxes,
// the axis, and `--selftest` (which disproves D-47 for good) are all still live.
// Uncomment when AS5 re-cuts cells 0/1 to the motif now stated in
// SPEC_MASSEN_KIT §10.3. See composition.ts#PAINTED_TRIM_PHASES.
/*
SHEETS.push({
  // ── THE CARVED TRIMS, p1 (spec §5) ─────────────────────────────────────────
  // Keyed, not opaque: these are cut-outs, and `mass_edges_p1.png` carries
  // 1 209 297 key pixels, every one of them exactly #FF00FF.
  //
  // Cell → piece follows spec §5 in order (0/1 sides · 2/3 undersides ·
  // 4/5 outer corners · 6/7 inner corners). Stem names follow §9.1
  // `<class>_<phase>_<cell>`, which is why the sheet is `mass_edges_p1.png` and
  // the stems are `mass_edge_p1_l` — sheet name is not stem name (§9.1's trap).
  //
  // WHAT THIS SHEET DOES NOT CARRY: ramps. §5 never ordered them and all eight
  // cells are spoken for, so `mass_ramp_up/_down` stay on the shared placeholder
  // for every room including p1. That is the grey wedge in p3. It goes to AS5.
  file: "batch-as3/mass_edges_p1.png", cols: 4, rows: 2, mode: "keyed",
  pieces: [
    [0, "mass_edge_p1_l", { box: EDGE_BOXES.edgeL, tiles: "v", aboveBody: [6, 12], alpha: 0.90 }],
    // Delivered at 60.22 % — 14.21 above the body, past §5's 6–12 — while its
    // own left-hand twin sits at 8.87. Matched to the twin, one multiply, hue
    // and saturation untouched. See the note on `toneTo` above; the delivered
    // number is printed on every run.
    [1, "mass_edge_p1_r", { box: EDGE_BOXES.edgeR, tiles: "v", aboveBody: [6, 12], alpha: 0.90, toneLike: "mass_edge_p1_l" }],
    // ── CELLS 2/3 (the undersides) ARE NOT IMPORTED, and the reason is measured ─
    // §5 asks the undersides to be an edge like the sides — a strip the engine
    // repeats along a face. These two cannot be repeated. Cut at their declared
    // boxes and measured through this importer's own metric, they join
    // left↔right at 75.73 and 75.40 against a texture step of 5.58 — 13.6×.
    //
    // And it is not a matter of finding a better window inside them: every
    // horizontal sub-window from 120 px wide up to the full 449, at every offset,
    // was measured and NONE tiles. They are one-shot pieces with one finished end,
    // painted the way a cap is painted, not the way a band is.
    //
    // Tiling them anyway would put a hard seam every 449 source px — 36 world px,
    // 2.25 cells — under every overhang in the chapter: the Lego defect this whole
    // kit exists to end, one surface lower. Stretching them instead re-opens the
    // squash A5 measured (`srcW`, R3).
    //
    // So D-27 stays open, but no longer as "no sheet exists" — as a NUMBER and a
    // precise re-order (AS5 §10). And no `edgeD` hook is built in the engine this
    // round: SPEC_MASSEN_KIT §9.4's own rule is that a hook and its art travel
    // together, "sonst entsteht Kunst ohne Aufhänger" — here it would be the
    // mirror of that, a hook without art.
    //
    // Two cheap routes for the architect, both costing no commission, both filed:
    // mirror-repeat (alternate pieces flipped, seamless by construction, period
    // 5.6 cells) or an engine-drawn contact shadow (D-27's own alternative,
    // `planPlatformShadows` pattern).
    //
    // Corners and inner corners are drawn as stretched Images, never tiled
    // (`planMass` pushes them without `tile`), so no seam is asked of them —
    // which is the third of the four findings on the delivery's own verification
    // sheet, and it was asking a corner to be a wallpaper.
    [4, "mass_corner_p1_bl", { box: EDGE_BOXES.cornerBL, aboveBody: [6, 12], alpha: 0.55 }],
    [5, "mass_corner_p1_br", { box: EDGE_BOXES.cornerBR, aboveBody: [6, 12], alpha: 0.55 }],
    [6, "mass_incorner_p1_l", { box: EDGE_BOXES.inCornerL, aboveBody: [6, 12], alpha: 0.55 }],
    [7, "mass_incorner_p1_r", { box: EDGE_BOXES.inCornerR, aboveBody: [6, 12], alpha: 0.55 }],
  ],
});
*/

/**
 * Cut and judge ONE piece. Returns `{ img, faults, L, S, seam, key }` — the
 * caller decides whether to write it.
 *
 * This is a function rather than the body of a loop for one reason: `--selftest`
 * has to exercise the SHIPPING code path. A selftest that re-implements the
 * cut proves that the copy works.
 */
const cutPiece = (png, sheet, pos, stem, opt = {}) => {
  const cw = png.width / sheet.cols;
  const ch = png.height / sheet.rows;
  const faults = [];
  let img;
  if (opt.box !== undefined) {
    const [bx0, by0, bx1, by1] = opt.box;
    if (bx0 < 0 || by0 < 0 || bx1 >= png.width || by1 >= png.height || bx1 < bx0 || by1 < by0) {
      return { img: null, faults: [`${stem}: box [${opt.box.join(", ")}] falls outside the ${png.width}×${png.height} sheet`], L: 0, S: null, seam: null, key: null };
    }
    img = crop(png, bx0, by0, bx1 - bx0 + 1, by1 - by0 + 1);
  } else {
    img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);
  }

  let key = null;
  if (sheet.mode === "keyed") {
    key = keyHealth(img);
    // The two mechanisms that can eat paint, checked directly instead of
    // through the ≥150 proxy — see the header.
    if (key.impure > 0) {
      faults.push(`${stem}: ${key.impure} key pixels are not exactly #FF00FF — a soft key halo is CP-9's defect, and a tolerant cut spreads it`);
    }
    if (key.wouldErase > 0) {
      faults.push(`${stem}: ${key.wouldErase} painted px match the importer's own fringe rule — defringe would eat the painting's edge`);
    }
    if (faults.length > 0) return { img: null, faults, L: 0, S: null, seam: null, key };
    chromaKey(img);
    defringe(img);
    if (opt.box !== undefined) faults.push(...boxFaults(img, stem, opt.box));
    const share = alphaShare(img);
    if (opt.alpha !== undefined && share < opt.alpha) {
      faults.push(`${stem}: only ${(share * 100).toFixed(1)} % of the declared box is paint, the piece needs ≥${(opt.alpha * 100).toFixed(0)} %`);
    }
    key.share = share;
  } else {
    // `opaque` writes what was painted: no key, no defringe, no content trim.
    faults.push(...opaqueFaults(img, stem));
  }
  if (faults.length > 0) return { img: null, faults, L: 0, S: null, seam: null, key };

  let tone = null;
  if (opt.toneLike !== undefined) {
    const target = measured.get(opt.toneLike);
    if (target === undefined) {
      return { img: null, faults: [`${stem}: toneLike names "${opt.toneLike}", which has not been imported before it`], L: 0, S: null, seam: null, key, tone: null };
    }
    tone = toneTo(img, target);
    if (tone.refused === true) {
      faults.push(
        tone.factor >= 1
          ? `${stem}: a tone correction may only darken — it measures ${tone.before.toFixed(2)} % and would have to be multiplied by ${tone.factor.toFixed(3)} to match ${opt.toneLike} at ${target.toFixed(2)} %. Brightening clips highlights; a piece painted too dark is a re-order, not a multiply.`
          : `${stem}: the tone correction needed is ${((1 - tone.factor) * 100).toFixed(1)} %, past the ${(TONE_MAX_CORRECTION * 100).toFixed(0)} % ceiling — at that distance it is the wrong art, not the wrong key.`,
      );
      return { img: null, faults, L: tone.before, S: null, seam: null, key, tone };
    }
  }

  const L = luma(img);
  const window = opt.luma ?? (opt.aboveBody === undefined ? undefined : bodyWindow(opt.aboveBody));
  if (window !== undefined) {
    const [lo, hi] = window;
    if (L < lo || L > hi) {
      const waived = LUMA_EXCEPTIONS[stem];
      const where = opt.aboveBody === undefined ? "spec window" : `window derived from this kit's own body`;
      const msg = `luminance ${L.toFixed(2)} % (${(L - bodyRef.mean).toFixed(2)} above the body), ${where} ${lo.toFixed(2)}–${hi.toFixed(2)} %`;
      if (waived === undefined) faults.push(`${stem}: ${msg} (audit 1 measures L3 from this file)`);
      else notes.push(`⚠ ${stem}: ${msg} — DECLARED EXCEPTION: ${waived}`);
    }
  }
  let seam = null;
  const axes = seamAxes(opt.tiles);
  if (axes.length > 0) {
    seam = selfTile(img);
    const limit = seam.inner * SEAM_OVER_TEXTURE;
    for (const ax of axes) {
      if (seam[ax] > limit) {
        faults.push(`${stem}: does not tile with itself ${AXIS_NAME[ax]} — join ${seam[ax].toFixed(2)} against its own mean step ${seam.inner.toFixed(2)} (${(seam[ax] / seam.inner).toFixed(1)}×, limit ${SEAM_OVER_TEXTURE}×)`);
        continue;
      }
      const climb = seam[`${ax}Jump`];
      if (climb > limit) {
        faults.push(`${stem}: its ${AXIS_NAME[ax]} seam is HIDDEN, not closed — the join reads ${seam[ax].toFixed(2)} but the picture jumps ${climb.toFixed(2)} within ${PROFILE_DEPTH} px of it, against a texture step of ${seam.inner.toFixed(2)}. A blended edge climbs out gently; a duplicated one hides a cut.`);
      }
    }
  }
  let S = null;
  if (opt.sat !== undefined) {
    S = saturation(img);
    if (S < opt.sat) {
      faults.push(`${stem}: saturation ${S.toFixed(2)} %, spec needs ≥${opt.sat} % — a floor without hue is an absence, not a shadow`);
    }
  }
  return { img, faults, L, S, seam, key, tone };
};

// ── selftest ─────────────────────────────────────────────────────────────────
// The red light this import must be able to show is not hypothetical — it is the
// exact mistake the round inherited. So the selftest cuts the DELIVERED sheet
// twice through the SHIPPING code path: once with the stale AS2 y-range and once
// with the re-measured one, and it passes only if the first is rejected and the
// second is accepted. A tamper that changes nothing has proven nothing; this one
// changes four numbers and flips the verdict.
if (process.argv.includes("--selftest")) {
  const src = path.join(LAB, "batch-as3/mass_edges_p1.png");
  if (!fs.existsSync(src)) {
    console.error(`✗ selftest cannot run: ${src} is missing`);
    process.exit(1);
  }
  const png = read(src);
  const sheet = { file: "selftest", cols: 4, rows: 2, mode: "keyed" };
  let bad = 0;
  for (const [name, pos] of [["edgeL", 0], ["edgeR", 1]]) {
    const stale = cutPiece(png, sheet, pos, `stale_${name}`, { box: STALE_SIDE_BOXES[name], tiles: "v" });
    const fresh = cutPiece(png, sheet, pos, `fresh_${name}`, { box: EDGE_BOXES[name], tiles: "v" });
    const staleRed = stale.faults.some((f) => f.includes("does not tile"));
    const freshGreen = fresh.faults.length === 0;
    if (!staleRed) { bad++; console.error(`✗ ${name}: the STALE AS2 box was accepted — this check cannot see a 74 px gutter, so it proves nothing`); }
    else console.log(`✓ ${name}: the stale AS2 box y ${STALE_SIDE_BOXES[name][1]}..${STALE_SIDE_BOXES[name][3]} is REJECTED — join ${stale.seam.tb.toFixed(2)} against a texture step of ${stale.seam.inner.toFixed(2)}`);
    if (!freshGreen) { bad++; console.error(`✗ ${name}: the re-measured box was rejected: ${fresh.faults.join(" · ")}`); }
    else console.log(`✓ ${name}: the re-measured box y ${EDGE_BOXES[name][1]}..${EDGE_BOXES[name][3]} is ACCEPTED — join ${fresh.seam.tb.toFixed(2)} against a texture step of ${fresh.seam.inner.toFixed(2)}`);
  }
  // …and the axis must actually discriminate: a side edge does NOT tile
  // left↔right, so asking for the wrong axis has to fail. If it passed, the
  // axis option would be decoration.
  const wrongAxis = cutPiece(png, sheet, 0, "axis_edgeL", { box: EDGE_BOXES.edgeL, tiles: "h" });
  if (!wrongAxis.faults.some((f) => f.includes("left↔right"))) {
    bad++;
    console.error("✗ axis: a side edge passed a LEFT↔RIGHT tiling demand — the axis option is not doing anything");
  } else {
    console.log(`✓ axis: the same strip fails left↔right (${wrongAxis.seam.lr.toFixed(2)}) and passes top↔bottom (${wrongAxis.seam.tb.toFixed(2)}) — the axes are told apart`);
  }
  if (bad > 0) { console.error("✗ import-batch-as selftest: FAILED"); process.exit(1); }
  console.log("✓ selftest: a box measured at the wrong sheet is caught, the re-measured one passes, and the seam axes are distinguished.");
  process.exit(0);
}

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
    const cut = cutPiece(png, sheet, pos, stem, opt);
    if (cut.faults.length > 0) { failures.push(...cut.faults); continue; }
    rememberBody(stem, cut.L);
    measured.set(stem, cut.L);
    fs.writeFileSync(path.join(OUT, `${stem}.png`), PNG.sync.write(cut.img));
    written.push({ stem, w: cut.img.width, h: cut.img.height, luma: cut.L, sat: cut.S, seam: cut.seam, key: cut.key, tone: cut.tone, axes: seamAxes(opt.tiles), mode: sheet.mode, from: sheet.file });
  }
}

// ── report ───────────────────────────────────────────────────────────────────
for (const w of written) {
  const sat = w.sat === null ? "" : `  sat ${w.sat.toFixed(1)}%`;
  // report the axes that were ASKED for, not both — a side edge's left↔right
  // join is 95.09 and that is correct, so printing it as "the seam" is a lie
  // waiting to be quoted.
  const seam = w.seam === null || w.axes.length === 0
    ? ""
    : `  seam ${w.axes.map((ax) => `${AXIS_NAME[ax]} ${(w.seam[ax] / w.seam.inner).toFixed(2)}× · climb ${(w.seam[`${ax}Jump`] / w.seam.inner).toFixed(2)}×`).join(" | ")}`;
  const key = w.key === null || w.key === undefined ? "" : `  paint ${(w.key.share * 100).toFixed(0)}% · key gap ${w.key.nearest.toFixed(0)}`;
  if (w.tone !== null && w.tone !== undefined) {
    notes.push(`⚠ ${w.stem}: DELIVERED at ${w.tone.before.toFixed(2)} %, toned by ×${w.tone.factor.toFixed(3)} to ${w.tone.after.toFixed(2)} % — one multiplicative pass to match its own twin. Hue and saturation untouched. Delete \`toneLike\` to restore the delivery exactly.`);
  }
  console.log(`  ${w.stem.padEnd(22)} ${String(w.w).padStart(4)}×${String(w.h).padEnd(4)} ${w.mode.padEnd(6)}  luma ${w.luma.toFixed(2).padStart(6)}%${sat}${seam}${key}  ← ${w.from}`);
}
console.log(`\n  body reference: mean ${bodyRef.mean.toFixed(2)} % over ${bodyRef.lumas.length} variants, spread ${bodyRef.spread.toFixed(2)} ⇒ trim window ${bodyWindow([6, 12]).map((v) => v.toFixed(2)).join("–")} %`);
for (const n of notes) console.log(`\n${n}`);
if (failures.length > 0) {
  console.error(`\nimport-batch-as: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-as: OK — ${written.length} stems from ${SHEETS.length} sheets`);
