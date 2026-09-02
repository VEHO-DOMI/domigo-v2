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
import os from "node:os";
import { PNG } from "pngjs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { importerWouldDelete } from "../../scripts/key-fringe.mjs";

// D-69 (vor der K1-Entdopplung: D-33) asked for exactly this one line: the lab root is overridable, so the
// import can be pointed at a fixture copy and TAMPER-TESTED without anyone
// editing the delivered batch in place.
const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");

const TOL = 40;
const read = (p) => PNG.sync.read(fs.readFileSync(p));
const isMagenta = (r, g, b, tol = TOL) => Math.hypot(r - 255, g, b - 255) < tol;
/**
 * The importer's own fringe rule — the one that erases painted pixels.
 *
 * ── ONE INSTRUMENT, NOT TWO (R5-W6 · A7) ─────────────────────────────────────
 * This file used to carry its own copy: `r > 120 && b > 120 && r - g > 55 &&
 * b - g > 55`. `scripts/key-fringe.mjs#importerWouldDelete` is that predicate
 * character for character, and it is what the seam guard
 * (`check-png-seams.mjs`) counts with. Two copies of one rule is a drift the
 * next edit pays for, and W4's report named this importer's conversion to the
 * shared module as its own follow-up. So the copy is gone and the guard's
 * function is imported: gate and guard can no longer disagree about what
 * "the importer would delete this pixel" means.
 *
 * This round's whole finding is that instrument, one level up: the delivery's
 * own validator measures the SAME seam profile as this file and normalises it
 * against a different denominator (its "texture step" for `mass_body_p2` Z0 is
 * 22.25, this file measures 0.21 — a factor of 106). Both are right about the
 * profile; the gate goes red anyway. A measuring chain works only when maker
 * and gate hold the same ruler.
 */
const isFringe = importerWouldDelete;

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
 * ── AND THE DENOMINATOR HAS TO BE REAL (R5-W6 · A7) ──────────────────────────
 * `SEAM_OVER_TEXTURE` judges a join against the painting's own texture, which is
 * exactly right while there IS one. Batch AS5b has almost none: its cells measure
 * a mean neighbour-to-neighbour step of 0.05–0.82, so the limit they are held to
 * is 0.08–1.2 out of 255 and any residual gradient reads as a seam. A ratio stops
 * meaning anything when its denominator approaches zero — and a mass sheet with
 * no texture is the more basic defect anyway: it is a colour field, not paint.
 *
 * So the floor is MEASURED FROM BOTH SIDES rather than chosen. Every opaque tile
 * stem the game draws today (34 of them, the list `check-png-seams` derives from
 * the composition) was run through this same metric:
 *
 *   shipping art          1.740 … 6.901
 *   its lowest            `mass_sediment` at 1.740 — and that is the darkest
 *                         sheet in the set (4.81 % luminance), where little
 *                         texture is honest
 *   every AS5b cell       0.05 … 0.82
 *
 * The two sets do not overlap; the gap is a factor of 2.1. 1.5 sits inside it —
 * under every sheet the game already draws, over every cell of this delivery. A
 * threshold that separates accepted art from a rejected delivery on measured
 * numbers is a law; one picked for roundness is a preference. (Re-derive with
 * the probe in the A7 report before moving it.)
 *
 * SCOPE: judged only where a seam is asked for. This is the quantity the seam
 * ratio divides by, and a sheet nobody tiles — a corner, a cap — is stretched,
 * not repeated. The texture step is PRINTED for every piece regardless, so
 * flatness stays visible where it was never load-bearing.
 */
const MIN_TEXTURE = 1.5;

/**
 * ── R5-W7 · A8 · WHAT `tex` CANNOT SEE: A COMPUTED FIELD (D-340's next form) ──
 *
 * `MIN_TEXTURE` asks „does this paint carry a neighbour-to-neighbour step?" and
 * AS5b failed it flat (0.05–0.82 against a shipping 1.74–6.90). AS5c answered
 * the question and not the request: it put a DETERMINISTIC DOT GRID over the
 * cell. Measured in the Wareneingang of 19.08., that grid — `((x·17 + y·31) mod
 * 11) − 5` — laid over an EMPTY surface measures `tex = 5.455`, i.e. mid-range
 * for shipping art, on a picture that contains nothing at all. A floor a
 * generator can clear by generating is not a floor; it is a target.
 *
 * So two more quantities, and they are deliberately not one: a cheat that beats
 * either alone is easy, a cheat that beats both while still looking like paint
 * is the thing we actually want.
 *
 *  · BAND3 — how much of the step distribution sits in its densest three
 *    consecutive integer bins. A generator draws from a tiny set of values, so
 *    its steps pile up; a brush spreads them. (Wareneingang: 64.6 % of the AS5c
 *    grid's steps sit in the 3-point band 8–10, against 7.1 % for the accepted
 *    `mass_body_p1_a`.)
 *  · ROUGH — each pixel's distance from the mean of its own 3×3 neighbourhood,
 *    divided by the sheet's own spread. This is LOCAL SMOOTHNESS, normalised, so
 *    it cannot be gamed by scaling contrast: paint is locally smooth against its
 *    own range, noise and grids are not. (Wareneingang: shipping p1 0.083 ·
 *    AS5c 0.110 · pure noise 0.94 · the grid 1.11.)
 *  · N1 — the share of horizontally adjacent pairs that are EXACTLY equal. Zero
 *    is as suspicious as a lot: real paint has flat passages (R201d asked for
 *    this line by name, because the mass gate measures neither IoU, N1 nor Z and
 *    those are the three quantities AS5e actually failed on).
 *
 * ⚠ EVERY THRESHOLD BELOW IS MEASURED, NOT CHOSEN, and re-measurable at any
 * time with `--calibrate` — which reads the ACCEPTED sheets on the plate
 * (`apps/web/public/art/g1/paint/ch01`), not a remembered table. The numbers
 * that seeded this round came from batches that no longer exist (R204, the lost
 * lab), so a gate that could only quote them would be a gate standing on
 * hearsay.
 */
const paintStats = (png) => {
  const { width: W, height: H, data } = png;
  const at = (x, y, o) => data[(y * W + x) * 4 + o];
  const on = (x, y) => data[(y * W + x) * 4 + 3] >= OPAQUE_ENOUGH;
  /** the pixel's own value: the mean of its three channels, so one number per px */
  const val = (x, y) => (at(x, y, 0) + at(x, y, 1) + at(x, y, 2)) / 3;

  // ── N1 + the step histogram, both over horizontally adjacent OPAQUE pairs ──
  const bins = new Array(256).fill(0);
  let pairs = 0, same = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 1; x < W; x++) {
      if (!on(x, y) || !on(x - 1, y)) continue;
      pairs++;
      let step = 0, eq = true;
      for (let o = 0; o < 3; o++) {
        const d = Math.abs(at(x, y, o) - at(x - 1, y, o));
        if (d !== 0) eq = false;
        step += d;
      }
      if (eq) same++;
      bins[Math.min(255, Math.round(step / 3))]++;
    }
  }
  let band3 = 0, band3At = 0;
  if (pairs > 0) {
    for (let i = 0; i + 2 < bins.length; i++) {
      const share = (bins[i] + bins[i + 1] + bins[i + 2]) / pairs;
      if (share > band3) { band3 = share; band3At = i; }
    }
  }

  // ── ROUGH: |px − mean(3×3)| ÷ the sheet's own standard deviation ───────────
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!on(x, y)) continue;
    const v = val(x, y);
    sum += v; sum2 += v * v; n++;
  }
  const spread = n === 0 ? 0 : Math.sqrt(Math.max(0, sum2 / n - (sum / n) ** 2));
  let dev = 0, devN = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (!on(x, y)) continue;
      let m = 0, k = 0, whole = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!on(x + dx, y + dy)) { whole = false; break; }
        m += val(x + dx, y + dy); k++;
      }
      // only pixels whose whole 3×3 window carries paint — a window that runs
      // off the key would report the key's own edge as texture
      if (!whole || k !== 9) continue;
      dev += Math.abs(val(x, y) - m / 9);
      devN++;
    }
  }
  // ── HOW MANY DISTINCT STEPS THE PICTURE ACTUALLY USES ─────────────────────
  // The share in the densest band turns out NOT to separate a brush from a
  // generator, and that is worth writing down rather than quietly dropping:
  // measured over the plate, accepted paint puts 47–86 % of its steps in its own
  // densest three bins too — because paint peaks at ZERO (most neighbours are
  // nearly equal) and decays. The grid's 64.6 % sat at bins 8–10 instead, but a
  // grid can be tuned to peak anywhere. What a generator cannot fake cheaply is
  // the SUPPORT: `((x·17 + y·31) mod 11) − 5` can only ever produce a handful of
  // distinct steps, while a painted surface produces a continuum.
  let acc = 0, bins90 = 0, support = 0;
  const order = bins.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  for (const [v] of order) {
    if (pairs === 0) break;
    if (acc < 0.9 * pairs) { acc += v; bins90++; }
  }
  for (const v of bins) if (pairs > 0 && v / pairs >= 0.001) support++;

  return {
    band3, band3At, bins90, support,
    n1: pairs === 0 ? 0 : same / pairs,
    rough: devN === 0 || spread === 0 ? 0 : (dev / devN) / spread,
    pairs, spread,
  };
};

/**
 * The windows the three quantities are held to.
 *
 * MEASURED on 2026-08-22 over the 24 accepted, opaque, TILING mass sheets on the
 * plate (`--calibrate`, output in REPORT_A8 §3) — the same set `MIN_TEXTURE` was
 * derived from. Each window is the measured range widened to the nearest round
 * step, so accepted art sits inside it with air on both sides and the rejected
 * deliveries sit outside; the exact figures and the margins are printed by
 * `--calibrate` so the next round re-derives instead of quoting.
 */
const PAINT_WINDOWS = {
  /** distinct step bins carrying ≥ 0.1 % of the pairs — a generator's support is tiny */
  supportMin: 12,
  /** local smoothness against the sheet's own spread */
  rough: [0.06, 0.45],
  /** exactly-equal horizontal neighbours */
  n1: [0.015, 0.095],
};

/**
 * ── ★ THE ORDERED THRESHOLD »band3 ≤ 20 %« IS REFUTED, AND HERE IS THE PROOF ─
 *
 * The A8 brief ordered a histogram law: „share in the densest 3-point band
 * ≤ 20 %", citing the Wareneingang's pair of numbers — 64.6 % for the AS5c grid
 * against 7.1 % for `mass_body_p1_a`. Measured at the plate with `--calibrate`
 * before anything was wired, that threshold fails EVERY accepted sheet the game
 * draws: the range is 47.4 % (`mass_body_p1_c`) to 86.1 % (`mass_sediment`).
 *
 * The reason is structural, not a mis-measurement. Painted art peaks at ZERO —
 * most neighbours are nearly equal — and decays; so its densest three bins are
 * bins 0–2 and they hold half the distribution. The 7.1 % in the passover is
 * the share of THAT ONE BAND (8–10), where the grid happened to pile up. As a
 * law it would only ever catch a generator that chose those particular values.
 *
 * So the INTENT is built and the number is not. What a generator cannot cheaply
 * fake is how MANY distinct steps its picture contains, and how smooth it is
 * locally against its own spread. Measured, with both controls manufactured in
 * the same run (`--calibrate`, full table in REPORT_A8 §3):
 *
 *                       21 accepted sheets   AS5c grid   pure noise   AS5e (100)
 *   tex  (today's law)        1.74 … 6.35        5.45        3.39      ← catches NEITHER
 *   band3                    47.4 … 86.1 %      100.0 %     48.2 %     ← printed, not judged
 *   support                     16 … 47             2          11        15 … 43
 *   rough                    0.104 … 0.232       0.984       0.797     0.226 … 0.399
 *   N1                       1.89 … 8.32 %        0.00 %      9.44 %    1.00 … 10.18 %
 *
 * Read that last column before moving any of these numbers: on `support` and
 * `rough` the AS5e delivery OVERLAPS accepted art, so neither window may be
 * placed to separate them — both are placed against the controls, and they
 * catch the delivery only at its tails. Only `N1` has its window derived from
 * accepted art on both sides, and it is the one that catches this delivery on
 * its own merits.
 *
 * `band3` is still PRINTED on every row, because the shape of the distribution
 * is a fact about the paint and the next round may want it. It is not judged,
 * because no threshold on it separates the two sets.
 *
 * ── ★ WHERE THE ROUGHNESS CEILING SITS, AND THE MISTAKE IT NEARLY WAS ───────
 * First placement: 0.35, then 0.30 — „the middle of the gap" between accepted
 * art (max 0.232) and AS5e's eight walk-course cells (0.360–0.399). Then the
 * whole delivery was measured instead of its worst eight cells, and the gap is
 * not there:
 *
 *   21 accepted sheets   0.104 … 0.232
 *   AS5e, all 100 cells  0.226 … 0.399   (median 0.284)
 *
 * The delivery's BEST cell (0.226) is smoother than our own worst (0.232). The
 * two sets OVERLAP, so on this quantity there is no line between them — and a
 * ceiling at 0.30 would have rejected 86 of 100 cells on a number where the
 * delivery is, at its best, indistinguishable from the art we ship. That is a
 * threshold fitted to a delivery, which is a preference wearing a measurement.
 *
 * So the ceiling is placed where a real gap exists: against the CONTROLS. From
 * 0.232 (highest accepted) to 0.797 (pure noise) is a factor of 3.4, and 0.45
 * sits inside it with 0.218 of room above our own art and a factor of 1.8 below
 * the nearest control. AS5e's crust cells at 0.360–0.399 therefore PASS this
 * law, and that is the correct outcome: they are caught, where they are caught,
 * by support and N1 — and by the seam and luminance laws that already existed.
 *
 * ⚠ The FLOOR (0.06) has no rejected specimen behind it. AS5b — the delivery
 * that was flat rather than noisy — is gone with the first Mac (R204), so the
 * lower half of this window rests on accepted art and the synthetic controls
 * alone. Stated, not implied.
 *
 * Which control each law catches is stated deliberately: N1's ceiling does NOT
 * catch pure noise (9.44 % against a 9.5 % ceiling — it passes by six
 * hundredths). The trio catches it; N1 alone does not. A gate whose owner
 * cannot say which of its lines is load-bearing for which defect is a gate
 * nobody can maintain.
 */

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
  /**
   * ── WHY NOTHING FROM AS5 IS IMPORTED HERE (R5-W4b · A6b) ───────────────────
   * Batch AS5 delivered 94 cells. Run through this file's own gate
   * (`--verify`), 24 pass — sixteen corners and eight ramps — and every one of
   * the 64 cells that carries a tiling duty fails the same way: a join of
   * exactly 0.00 with a 5–57× jump one row behind a duplicated boundary. Not one
   * exception in 64.
   *
   * Of the 24 that pass, none ships, for two different reasons:
   *
   *   CORNERS — a corner's job is to carry the flank around the turn. A painted
   *   corner against an unpainted flank is Koki's "Lego-Blöcke nebeneinander",
   *   built on purpose. Corners ship with their edges.
   *
   *   RAMPS — p3's was measured correct against the body it would really lie on
   *   (+7.76 over the shared paper, +8.9 over its own) and WAS imported and
   *   wired, then removed: ch01 contains ZERO slope glyphs on any of its five
   *   surfaces, so `planMass` never plans a ramp piece and no ramp sheet is ever
   *   drawn. Painted ramps are texture memory for a picture that cannot appear.
   *   Do not re-order ramps until a surface actually carries `/ \ 1 2 3 4`.
   *
   * `opt.anchorStems` below stays: it is what made the ramp judgement machine-
   * made rather than a sentence, and AS5b's trims will need it.
   */
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
  // R5-W4b · A6b: was `/^mass_body_p1_/`. Generalised to any phase so `--verify`
  // can anchor p2/p3/p4/p9's trims to THEIR OWN body instead of p1's paper. The
  // live import is unaffected — `SHEETS` still carries p1 alone — but the moment
  // a second phase lands, "the body" has to mean that phase's body.
  if (!/^mass_body_p\d+_/.test(stem)) return;
  bodyRef.lumas.push(L);
  bodyRef.mean = bodyRef.lumas.reduce((a, b) => a + b, 0) / bodyRef.lumas.length;
  bodyRef.spread = Math.max(...bodyRef.lumas) - Math.min(...bodyRef.lumas);
};

/** start a fresh body anchor — one per phase when several are measured in a run */
const resetBody = () => { bodyRef.lumas = []; bodyRef.mean = 0; bodyRef.spread = 0; };

/**
 * ── A TRIM IS A CLAIM ABOUT THE SURFACE IT IS CUT INTO (R5-W4b · A6b) ────────
 * `bodyWindow` anchors on the body imported in the same run, which is right when
 * the kit arrives whole. AS5 does not: its ramps pass, its bodies do not, so a
 * ramp shipped from AS5 will lie against the SHARED book paper for as long as
 * that lasts — and +8 over a body nobody can see is not a carve, it is a
 * coincidence. So a piece may name the stems it will actually sit against and
 * have its window measured off those, on disk.
 *
 * Measured consequence: p3's ramp is +8.9 over its own delivered body and +7.76
 * over the shared paper — inside the window either way, which is why it is the
 * only ramp that ships. p2/p4/p9 read +6.6…+8.4 against their own bodies and
 * +3.3…+4.8 against the paper that is really there. They wait for AS5b.
 */
const diskAnchor = (stems) => {
  const ls = stems
    .map((s) => path.join(OUT, `${s}.png`))
    .filter((p) => fs.existsSync(p))
    .map((p) => luma(read(p)));
  if (ls.length === 0) return null;
  return { mean: ls.reduce((a, b) => a + b, 0) / ls.length, spread: Math.max(...ls) - Math.min(...ls) };
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
 * `L` is `null`, never 0, when the cell was rejected before it could be
 * measured. A cell that failed its key check has no luminance yet; printing
 * "0.00 %" for it puts a number in a table that no one measured, and tables get
 * quoted. (`--verify` printed exactly that for 30 of AS5b's 84 cells.)
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
      return { img: null, faults: [`${stem}: box [${opt.box.join(", ")}] falls outside the ${png.width}×${png.height} sheet`], L: null, S: null, seam: null, key: null };
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
    if (faults.length > 0) return { img: null, faults, L: null, S: null, seam: null, key };
    chromaKey(img);
    defringe(img);
    // A BAND is the sheet's shared vertical content window, derived ONCE across
    // all of its cells (`sheetBand`) and handed in here. Cropped after the key,
    // because the window is a property of the painting, not of the cell — and
    // shared, because the four crust cells must keep one coordinate frame or the
    // caps float off the loop (`import-batch-af.mjs`, mode `band`).
    if (opt.band !== undefined) {
      img = crop(img, 0, opt.band[0], img.width, opt.band[1] - opt.band[0] + 1);
    }
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
  if (faults.length > 0) return { img: null, faults, L: null, S: null, seam: null, key };

  let tone = null;
  if (opt.toneLike !== undefined) {
    const target = measured.get(opt.toneLike);
    if (target === undefined) {
      return { img: null, faults: [`${stem}: toneLike names "${opt.toneLike}", which has not been imported before it`], L: null, S: null, seam: null, key, tone: null };
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
  const anchor = opt.anchorStems === undefined ? null : diskAnchor(opt.anchorStems);
  const window = opt.luma
    ?? (opt.aboveBody === undefined
      ? undefined
      : anchor === null
        ? bodyWindow(opt.aboveBody)
        : [anchor.mean + opt.aboveBody[0] - anchor.spread / 2, anchor.mean + opt.aboveBody[1] + anchor.spread / 2]);
  if (window !== undefined) {
    const [lo, hi] = window;
    if (L < lo || L > hi) {
      const waived = LUMA_EXCEPTIONS[stem];
      const where = opt.aboveBody === undefined
        ? "spec window"
        : anchor === null
          ? `window derived from this kit's own body`
          : `window derived from ${opt.anchorStems.join("+")} on disk — the body this trim is actually cut into (${anchor.mean.toFixed(2)} %)`;
      const msg = `luminance ${L.toFixed(2)} % (${(L - bodyRef.mean).toFixed(2)} above the body), ${where} ${lo.toFixed(2)}–${hi.toFixed(2)} %`;
      if (waived === undefined) faults.push(`${stem}: ${msg} (audit 1 measures L3 from this file)`);
      else notes.push(`⚠ ${stem}: ${msg} — DECLARED EXCEPTION: ${waived}`);
    }
  }
  // Measured for every piece — the table prints a texture step even where no
  // seam is owed, because flatness is a fact about the paint, not about tiling.
  const seam = selfTile(img);
  // …and the three quantities `tex` cannot see. Measured for every piece so the
  // table can print them, judged only where a seam is owed — the same scope
  // `MIN_TEXTURE` states for itself: a corner or a cap is stretched once, not
  // repeated, so a computed field in one is a different (smaller) problem.
  const paint = paintStats(img);
  const axes = seamAxes(opt.tiles);
  if (axes.length > 0) {
    // ── R5-W7 · A8 · IS THIS PAINT, OR A TEXTURE FUNCTION? ──────────────────
    if (paint.support < PAINT_WINDOWS.supportMin) {
      faults.push(`${stem}: the paint uses only ${paint.support} distinct neighbour-step values (floor ${PAINT_WINDOWS.supportMin}; the 21 accepted sheets on the plate use 16–47, the AS5c generator grid uses 2). A picture drawn from a handful of values is a texture FUNCTION, not a painting — and it can clear the texture floor while doing it (that grid measures tex 5.455 on an empty surface).`);
    }
    if (paint.rough < PAINT_WINDOWS.rough[0] || paint.rough > PAINT_WINDOWS.rough[1]) {
      faults.push(`${stem}: local roughness ${paint.rough.toFixed(3)} is outside ${PAINT_WINDOWS.rough[0]}–${PAINT_WINDOWS.rough[1]} (accepted art measures 0.104–0.232; the AS5c grid 0.984, pure noise 0.797). This is each pixel's distance from its own 3×3 mean divided by the sheet's spread, so it cannot be fixed by scaling contrast: too high is noise, too low is a gradient with nothing painted on it.`);
    }
    if (paint.n1 < PAINT_WINDOWS.n1[0] || paint.n1 > PAINT_WINDOWS.n1[1]) {
      faults.push(`${stem}: ${(paint.n1 * 100).toFixed(2)} % of horizontally adjacent pixels are EXACTLY equal, outside ${(PAINT_WINDOWS.n1[0] * 100).toFixed(1)}–${(PAINT_WINDOWS.n1[1] * 100).toFixed(1)} % (accepted art 1.89–8.32 %; the AS5c grid 0.00 %). Real paint has flat passages and a generator that dithers every pixel has none — R201 asked for this line by name, because this gate measures neither IoU, N1 nor Z, and those are the three quantities AS5e actually failed on.`);
    }
    if (seam.inner < MIN_TEXTURE) {
      faults.push(`${stem}: the paint carries almost no texture — mean neighbour step ${seam.inner.toFixed(2)}, floor ${MIN_TEXTURE.toFixed(1)} (every tile the game draws today measures 1.74–6.90). A tiling sheet without texture is a colour field, and the seam ratio below divides by this number.`);
    }
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
  return { img, faults, L, S, seam, key, tone, paint };
};

/**
 * ── `--verify`: RUN THE GATE WITHOUT IMPORTING (R5-W4b · A6b) ────────────────
 *
 * AS5 arrived with a Lieferschein that reports every seam as `0.0`. It is not
 * lying and it is not right: it measures the join the naive way — last row
 * against first — which is the exact cheat `selfTile`'s profile exists to
 * defeat. Its own proof image, `tile_proof_p1.png`, shows a hard dark bar at
 * every junction it scores 0.0.
 *
 * So the answer is not a paragraph in a report telling the lab what the gate
 * wants. It is the gate, runnable:
 *
 *   node docs/art/import-batch-as.mjs --verify            # every phase
 *   node docs/art/import-batch-as.mjs --verify --phase=p3
 *   CODEX_LAB=/somewhere node … --verify --batch=batch-as5b
 *
 * It writes NOTHING. Every cell goes through `cutPiece` — the shipping cut, the
 * shipping key health, the shipping windows, the shipping seam profile — and the
 * verdict printed is the verdict an import would reach. A delivery can therefore
 * be judged before it is accepted, and a re-order can prove itself before it is
 * sent.
 *
 * The boxes below are the LIEFERSCHEIN's own declared bounding boxes, not boxes
 * re-derived here. That is deliberate: §10.4 makes the delivery name its boxes,
 * and this is where that claim gets tested (`boxFaults` fails a box that carries
 * key on any side). Measuring our own box instead would silently repair the one
 * thing the supplier is contractually responsible for.
 */
const AS5_EDGE_BOXES = {
  p1: { edgeL: [0, 0, 134, 511], edgeR: [890, 0, 1023, 511], edgeD_l: [1024, 366, 1535, 511], edgeD_r: [1536, 366, 2047, 511], cornerBL: [0, 512, 255, 1023], cornerBR: [768, 512, 1023, 1023], inCornerL: [1024, 762, 1279, 1023], inCornerR: [1792, 762, 2047, 1023] },
  p2: { edgeL: [0, 0, 134, 511], edgeR: [890, 0, 1023, 511], edgeD_l: [1024, 366, 1535, 511], edgeD_r: [1536, 366, 2047, 511], cornerBL: [0, 512, 255, 1023], cornerBR: [768, 512, 1023, 1023], inCornerL: [1024, 762, 1279, 1023], inCornerR: [1792, 762, 2047, 1023] },
  p3: { edgeL: [0, 0, 264, 511], edgeR: [850, 0, 1023, 511], edgeD_l: [1024, 354, 1535, 511], edgeD_r: [1536, 357, 2047, 511], cornerBL: [0, 512, 384, 1023], cornerBR: [728, 512, 1023, 1023], inCornerL: [1024, 752, 1390, 1023], inCornerR: [1756, 752, 2047, 1023] },
  p4: { edgeL: [0, 0, 134, 511], edgeR: [890, 0, 1023, 511], edgeD_l: [1024, 362, 1535, 511], edgeD_r: [1536, 362, 2047, 511], cornerBL: [0, 512, 255, 1023], cornerBR: [768, 512, 1023, 1023], inCornerL: [1024, 757, 1279, 1023], inCornerR: [1792, 757, 2047, 1023] },
  p9: { edgeL: [0, 0, 136, 511], edgeR: [887, 0, 1023, 511], edgeD_l: [1024, 361, 1535, 511], edgeD_r: [1536, 361, 2047, 511], cornerBL: [0, 512, 259, 1023], cornerBR: [764, 512, 1023, 1023], inCornerL: [1024, 756, 1283, 1023], inCornerR: [1788, 756, 2047, 1023] },
};
/** cell → stem suffix, seam axis, and how much of the box may legally be key */
const AS5_EDGE_CELLS = [
  [0, "edge", "_l", "v", 0.90], [1, "edge", "_r", "v", 0.90],
  [2, "edgeD", "_l", "h", 0.90], [3, "edgeD", "_r", "h", 0.90],
  [4, "corner", "_bl", null, 0.55], [5, "corner", "_br", null, 0.55],
  [6, "incorner", "_l", null, 0.55], [7, "incorner", "_r", null, 0.55],
];

/**
 * ── THE CRUST IS A BAND INSIDE A TALLER CELL, AND ITS HEIGHT IS LOAD-BEARING ──
 *
 * The walk course is painted as a horizontal band inside a 512² cell and cut to
 * that band on import (`import-batch-af.mjs`, mode `band`), because the renderer
 * derives a tile's scale from its SOURCE HEIGHT: an untrimmed cell draws the art
 * at ~40 % of its slot with transparent gaps above and below.
 *
 * These are therefore not preferences, they are the heights the engine is
 * already built around — measured off the stems on disk, one per room:
 */
const AS5_CRUST_BANDS = { p2: 211, p3: 262, p4: 237, p9: 246 };

/**
 * The sheet's shared vertical content window, keyed first. Shared and not
 * per-cell: the four cells of a crust sheet are one run of material, and a cap
 * cut at its own window sits at a different height from the loop it closes.
 */
const sheetBand = (png, sheet) => {
  const cw = png.width / sheet.cols, ch = png.height / sheet.rows;
  let y0 = ch, y1 = -1;
  for (let pos = 0; pos < sheet.cols * sheet.rows; pos++) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);
    chromaKey(img);
    defringe(img);
    const cb = contentBox(img);
    if (cb === null) continue;
    y0 = Math.min(y0, cb.y0);
    y1 = Math.max(y1, cb.y1);
  }
  return y1 < 0 ? null : [y0, y1];
};

/**
 * ── FOUR CELLS, OR ONE CELL FOUR TIMES (R5-W6 · A7) ──────────────────────────
 * Every window in this file measures ONE cell against a number. None of them can
 * see the defect where two cells are the same cell — and AS5b ships it three
 * times: `crust_p4` cell 2 is byte-identical to cell 0 and cell 3 to cell 1, and
 * `crust_p3` cell 3 to cell 1. A cap closes a run; it is not the middle tile
 * again. Every crust sheet already on disk carries four distinct cells, in all
 * five rooms — so this is the delivery departing from the house's own art, and
 * every luminance, saturation and seam number it prints for those cells is
 * "PASS" by construction.
 *
 * Byte identity, deliberately, not a statistical likeness: `crust_p1_cap_l` and
 * `_cap_r` measure the same texture step and the same luminance to two decimals
 * because they are MIRRORED — which is what a left and a right cap should be.
 * Only an exact copy is the defect.
 *
 * Applied to every sheet, not only the crusts, and the widening earned itself
 * immediately: `mass_edges_p3` and `mass_edges_p4` deliver ONE underside twice
 * (cell 3 = cell 2). Measured against the batches around it, distinctness is the
 * house norm and this delivery is the exception — AS3's accepted edge sheet, AS5,
 * AS5b's own p1/p2/p9 edge sheets and all four of its body sheets carry eight
 * distinct cells each. Five cells of AS5b are copies.
 */
const duplicateCells = (png, sheet) => {
  const cw = png.width / sheet.cols, ch = png.height / sheet.rows;
  const seen = new Map();
  const dup = new Map();
  for (let pos = 0; pos < sheet.cols * sheet.rows; pos++) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * ch, cw, ch);
    const fp = createHash("sha1").update(img.data).digest("hex");
    if (seen.has(fp)) dup.set(pos, seen.get(fp));
    else seen.set(fp, pos);
  }
  return dup;
};

/**
 * Everything a sheet must answer BEFORE its cells are judged one by one: which
 * cells are copies of each other, and where its shared band lies. Shared by
 * `--verify` and the import so the two can never drift — that identity is the
 * entire promise `--verify` makes to the lab.
 */
const prepSheet = (png, sheet) => {
  const dup = duplicateCells(png, sheet);
  const faults = [];
  let bandRows = null;
  if (sheet.band !== undefined) {
    bandRows = sheetBand(png, sheet);
    if (bandRows === null) {
      faults.push(`${sheet.file}: every cell keys to nothing — there is no band to cut`);
    } else {
      const h = bandRows[1] - bandRows[0] + 1;
      if (h !== sheet.band) {
        faults.push(`${sheet.file}: its shared band is ${h} px (y ${bandRows[0]}..${bandRows[1]}); the stems this replaces are ${sheet.band} px. The renderer scales a crust tile from its SOURCE HEIGHT, so a band of the wrong height draws the course at the wrong size.`);
      }
    }
  }
  return { dup, bandRows, faults };
};

const as5Sheets = (phase, batch) => {
  const boxes = AS5_EDGE_BOXES[phase];
  const out = [];
  // p1's interior is already imported and accepted; AS5 re-delivers only its
  // trims. Its body anchor therefore comes off disk, not off this batch.
  if (phase !== "p1") {
    out.push({
      file: `${batch}/mass_body_${phase}.png`, cols: 4, rows: 2, mode: "opaque",
      pieces: [
        ...["a", "b", "c", "d"].map((c, i) => [i, `mass_body_${phase}_${c}`, { luma: [42, 50], tiles: true }]),
        ...["a", "b", "c", "d"].map((c, i) => [i + 4, `mass_bodydeep_${phase}_${c}`, { luma: [26, 38], tiles: true }]),
      ],
    });
    out.push({
      file: `${batch}/mass_deep_${phase}.png`, cols: 4, rows: 1, mode: "opaque",
      pieces: [
        [0, `mass_fade_${phase}_a`, { luma: [12, 18], tiles: true }],
        [1, `mass_fade_${phase}_b`, { luma: [12, 18], tiles: true }],
        [2, `mass_sediment_${phase}`, { luma: [7, 10], sat: 12, tiles: true }],
        // cell 3 is the declared reserve — no engine consumer, so not measured
      ],
    });
  }
  out.push({
    file: `${batch}/mass_edges_${phase}.png`, cols: 4, rows: 2, mode: "keyed",
    pieces: AS5_EDGE_CELLS.map(([pos, cls, suf, axis, alpha]) => [
      pos, `mass_${cls}_${phase}${suf}`,
      { box: boxes[["edgeL", "edgeR", "edgeD_l", "edgeD_r", "cornerBL", "cornerBR", "inCornerL", "inCornerR"][pos]], aboveBody: [6, 12], alpha, ...(axis === null ? {} : { tiles: axis }) },
    ]),
  });
  // ── NO RAMP SHEET IS EXPECTED, AND THAT IS NOT AN OMISSION (R109, R5-W6 · A7) ─
  // This function used to append `mass_ramps_<phase>.png` for every phase, so
  // `--verify` reported five sheets "MISSING" on a delivery that was correct to
  // ask for none. ch01 carries ZERO slope glyphs (`/ \ 1 2 3 4`) across all five
  // surfaces, so `planMass` never plans a ramp piece; R109 struck the ramps from
  // the commission, E6 took them out of `massStems`, and the two placeholder PNGs
  // are deleted. A gate that demands art the specification withdrew teaches the
  // lab the wrong lesson and buries the real findings under five false ones.
  // The moment a surface carries a slope, the ramps come back — as a re-order,
  // with `composition.test.ts`'s law (slope glyph ⇒ ramp sheets on the plate)
  // holding the engine side of it.

  // ── THE WALK COURSE (D-199's repair) ───────────────────────────────────────
  // `crust_<phase>.png`: four cells, keyed, cut to one shared band (mode `band`
  // in `import-batch-af.mjs`). No luminance window is declared here on purpose —
  // the course's value is not a per-sheet number but a RELATION to the body it
  // lies on, and that relation already has a law with better instruments:
  // `check-composition` audit 11 (ΔH ≤ 25°, ΔS ≤ 25, carve +2…+14). Inventing a
  // second window here would give the same question two answers.
  //
  // What IS checked: the band height (the renderer scales from source height),
  // the horizontal seam on the two loop cells, the texture floor, cell
  // distinctness — and, through the keyed path's own `wouldErase` test, that no
  // painted pixel matches the seam guard's deletion rule. That last one IS
  // D-199: today's four sheets fail it (838–2670 px), and only a dated exception
  // in `check-png-seams.mjs` keeps main green.
  if (AS5_CRUST_BANDS[phase] !== undefined) {
    out.push({
      file: `${batch}/crust_${phase}.png`, cols: 4, rows: 1, mode: "keyed",
      band: AS5_CRUST_BANDS[phase],
      pieces: [
        // the loop repeats along the platform top; the caps close it and are
        // drawn once, so no seam is owed of them (`planMass` §crust run).
        [0, `crust_${phase}_a`, { tiles: "h" }],
        [1, `crust_${phase}_b`, { tiles: "h" }],
        [2, `crust_${phase}_cap_l`, {}],
        [3, `crust_${phase}_cap_r`, {}],
      ],
    });
  }
  return out;
};

/** seed the body anchor from art already on disk — p1's paper is canon, not a delivery */
const seedBodyFromDisk = (phase) => {
  resetBody();
  for (const c of ["a", "b", "c", "d"]) {
    const p = path.join(OUT, `mass_body_${phase}_${c}.png`);
    if (fs.existsSync(p)) rememberBody(`mass_body_${phase}_${c}`, luma(read(p)));
  }
  return bodyRef.lumas.length;
};

/**
 * ── `--calibrate`: DERIVE THE WINDOWS FROM THE PLATE, NEVER FROM A TABLE ─────
 *
 *   node docs/art/import-batch-as.mjs --calibrate
 *
 * Reads the ACCEPTED sheets the game draws today and prints, per sheet, the
 * three quantities `PAINT_WINDOWS` holds a delivery to — plus the min/max the
 * windows would have to contain and the margin each window actually has.
 *
 * It exists because of R204: the numbers that seeded these thresholds were
 * measured on `batch-as5c` and `batch-as5b`, and both batches are gone with the
 * first Mac. A threshold whose only evidence is a sentence in a passover is a
 * preference wearing a number. This one can be re-derived on any machine, from
 * files that are in the repository.
 *
 * SCOPE — the sheets that must REPEAT, which is the same rule `MIN_TEXTURE`
 * already states for itself: bodies, deep bodies, fades, sediment and the walk
 * courses. Deliberately NOT the corners and caps (they are stretched once, not
 * repeated) and NOT `mass_edge_l/r` — those two are the SHARED PLACEHOLDER
 * strips every unpainted room still draws, and calibrating an art gate against
 * a placeholder is how a placeholder becomes the standard.
 */
// A sheet is in scope iff it is one the engine REPEATS. Written as one pattern
// so the rule is readable and cannot drift into a hand-kept list:
//   crust_<phase>_a|b        the walk course's loop cells — NOT `_cap_l/_cap_r`,
//                            which are drawn once at the end of a run
//   mass_body|bodydeep|fade_<phase>_<v>   the interior continuum
//   mass_sediment            the one shared sheet that genuinely tiles
// Excluded on purpose: `mass_body_a`, `mass_body_b`, `mass_fade`, `mass_edge_l`,
// `mass_edge_r` — the SHARED PLACEHOLDERS every unpainted room still draws.
// Calibrating an art gate against a placeholder is how a placeholder quietly
// becomes the standard.
const CALIBRATION_RE = /^(crust_p\d+_[ab]|mass_(?:body|bodydeep|fade)_p\d+_[a-z]|mass_sediment)$/;
const calibrationSheets = () => {
  if (!fs.existsSync(OUT)) return [];
  return fs.readdirSync(OUT)
    .filter((f) => f.endsWith(".png"))
    .map((f) => ({ stem: f.replace(/\.png$/, ""), file: path.join(OUT, f) }))
    .filter((x) => CALIBRATION_RE.test(x.stem))
    .sort((a, b) => a.stem.localeCompare(b.stem));
};

/**
 * The two CONTROLS, manufactured in the same run so the gap is shown and not
 * asserted (the Wareneingang of 19.08. measured both on an empty surface):
 *  · the AS5c generator grid, verbatim — `((x·17 + y·31) mod 11) − 5`
 *  · pure per-pixel noise, the other way to have „texture" without a picture
 */
const controlSheet = (kind, size = 512) => {
  const png = new PNG({ width: size, height: size });
  let seed = 20260822;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const d = kind === "grid" ? ((x * 17 + y * 31) % 11) - 5 : Math.round((rnd() - 0.5) * 10);
    const v = Math.max(0, Math.min(255, 128 + d));
    png.data[i] = v; png.data[i + 1] = v; png.data[i + 2] = v; png.data[i + 3] = 255;
  }
  return png;
};

if (process.argv.includes("--calibrate")) {
  const sheets = calibrationSheets();
  if (sheets.length === 0) {
    console.error(`✗ calibrate: no accepted mass sheets under ${OUT} — there is nothing to derive a window from.`);
    process.exit(1);
  }
  console.log(`\nCALIBRATE — the windows in PAINT_WINDOWS, re-derived from ${sheets.length} accepted sheets on the plate.`);
  console.log(`  source: ${OUT}`);
  console.log(`  band3 = share of the neighbour-step distribution in its densest 3 integer bins (a generator piles up, a brush spreads)`);
  console.log(`  rough = |px − mean(3×3)| ÷ the sheet's own spread (local smoothness, normalised)`);
  console.log(`  N1    = share of horizontally adjacent pairs that are EXACTLY equal\n`);
  const line = (label, png) => {
    const st = paintStats(png);
    const seam = selfTile(png);
    console.log(
      `  ${label.padEnd(24)} ${`${png.width}×${png.height}`.padStart(10)}  ${seam.inner.toFixed(2).padStart(6)}`
      + `  ${(st.band3 * 100).toFixed(1).padStart(6)}% ${String(st.band3At).padStart(4)}`
      + `  ${String(st.bins90).padStart(6)}  ${String(st.support).padStart(7)}  ${st.rough.toFixed(3).padStart(6)}  ${(st.n1 * 100).toFixed(2).padStart(5)}%`,
    );
    return { stem: label, ...st, tex: seam.inner };
  };
  console.log(`  ${"stem".padEnd(24)} ${"px".padStart(10)}  ${"tex".padStart(6)}  ${"band3".padStart(7)} @bin  ${"bins90".padStart(6)}  ${"support".padStart(7)}  ${"rough".padStart(6)}  ${"N1".padStart(6)}`);
  const rows = [];
  for (const { stem, file } of sheets) rows.push(line(stem, read(file)));
  console.log(`\n  ── CONTROLS, built in this run (an empty surface + a texture) ──`);
  const ctrlGrid = line("[control] AS5c grid", controlSheet("grid"));
  const ctrlNoise = line("[control] pure noise", controlSheet("noise"));
  const span = (k) => {
    const xs = rows.map((r) => r[k]).sort((a, b) => a - b);
    return { lo: xs[0], hi: xs[xs.length - 1] };
  };
  const b = span("band3"), r = span("rough"), n = span("n1"), sp = span("support");
  console.log(`\n  ${"─".repeat(78)}`);
  console.log(`  measured over ${rows.length} accepted sheets — window · margin to the nearest accepted sheet:`);
  console.log(`    support  ${sp.lo} … ${sp.hi}          · ≥ ${PAINT_WINDOWS.supportMin}        → ${sp.lo - PAINT_WINDOWS.supportMin} bins of room  (grid ${ctrlGrid.support}, noise ${ctrlNoise.support})`);
  console.log(`    rough    ${r.lo.toFixed(3)} … ${r.hi.toFixed(3)}  · ${PAINT_WINDOWS.rough[0]}–${PAINT_WINDOWS.rough[1]}  → ${(r.lo - PAINT_WINDOWS.rough[0]).toFixed(3)} below, ${(PAINT_WINDOWS.rough[1] - r.hi).toFixed(3)} above  (grid ${ctrlGrid.rough.toFixed(3)}, noise ${ctrlNoise.rough.toFixed(3)})`);
  console.log(`    N1       ${(n.lo * 100).toFixed(2)} … ${(n.hi * 100).toFixed(2)} %  · ${(PAINT_WINDOWS.n1[0] * 100).toFixed(1)}–${(PAINT_WINDOWS.n1[1] * 100).toFixed(1)} % → ${((n.lo - PAINT_WINDOWS.n1[0]) * 100).toFixed(2)} below, ${((PAINT_WINDOWS.n1[1] - n.hi) * 100).toFixed(2)} above  (grid ${(ctrlGrid.n1 * 100).toFixed(2)} %, noise ${(ctrlNoise.n1 * 100).toFixed(2)} %)`);
  console.log(`    band3    ${(b.lo * 100).toFixed(1)} … ${(b.hi * 100).toFixed(1)} %  · NOT JUDGED — the ordered ≤ 20 % would fail all ${rows.length} (see the note on PAINT_WINDOWS)`);
  const breaks = (x) => x.support < PAINT_WINDOWS.supportMin
    || x.rough < PAINT_WINDOWS.rough[0] || x.rough > PAINT_WINDOWS.rough[1]
    || x.n1 < PAINT_WINDOWS.n1[0] || x.n1 > PAINT_WINDOWS.n1[1];
  const outside = rows.filter(breaks);
  if (outside.length > 0) {
    console.error(`\n✗ ${outside.length} ACCEPTED sheet(s) fall outside the declared windows — then the windows are wrong, not the art:`);
    for (const x of outside) console.error(`    ${x.stem}: support ${x.support} · rough ${x.rough.toFixed(3)} · N1 ${(x.n1 * 100).toFixed(2)} %`);
    process.exit(1);
  }
  // …and the controls must be OUTSIDE, or the windows are decoration.
  for (const c of [ctrlGrid, ctrlNoise]) {
    if (!breaks(c)) {
      console.error(`\n✗ the control "${c.stem}" PASSES these windows — an empty surface with a texture function would be accepted as paint.`);
      process.exit(1);
    }
  }
  console.log(`\n  ✓ all ${rows.length} accepted sheets sit INSIDE the windows, and BOTH controls sit outside.\n`);
  process.exit(0);
}

if (process.argv.includes("--verify")) {
  const arg = (name, dflt) => (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `--${name}=${dflt}`).split("=")[1];
  const batch = arg("batch", "batch-as5");
  const only = process.argv.some((a) => a.startsWith("--phase=")) ? [arg("phase", "p1")] : ["p1", "p2", "p3", "p4", "p9"];
  const tally = { pass: 0, fail: 0, missing: 0 };
  const orders = [];

  console.log(`\nVERIFY — ${batch} against the gate an import would apply. Nothing is written.`);
  console.log(`  L = luminance of the PAINTED pixels (— = the cell failed before it could be measured, which is not the same as 0)`);
  console.log(`  tex = mean neighbour-to-neighbour step, the painting's own texture — floor ${MIN_TEXTURE.toFixed(1)}, shipping art measures 1.74–6.90`);
  console.log(`  seam = join ÷ tex, and the largest jump within ${PROFILE_DEPTH} px behind it ÷ tex — both must stay under ${SEAM_OVER_TEXTURE}×`);
  console.log(`  sup/rgh/N1 = distinct step values · local roughness · exactly-equal neighbours — is this PAINT or a texture function?`);
  console.log(`               windows ≥${PAINT_WINDOWS.supportMin} · ${PAINT_WINDOWS.rough[0]}–${PAINT_WINDOWS.rough[1]} · ${(PAINT_WINDOWS.n1[0] * 100).toFixed(1)}–${(PAINT_WINDOWS.n1[1] * 100).toFixed(1)} %, all three measured at the plate (--calibrate); judged only where a seam is owed\n`);
  for (const phase of only) {
    const seeded = phase === "p1" ? seedBodyFromDisk("p1") : (resetBody(), 0);
    console.log(`\n── ${phase} ${"─".repeat(72)}`);
    if (seeded > 0) console.log(`   body anchor from disk: ${bodyRef.mean.toFixed(2)} % over ${seeded} variants (spread ${bodyRef.spread.toFixed(2)})`);
    for (const sheet of as5Sheets(phase, batch)) {
      const src = path.join(LAB, sheet.file);
      if (!fs.existsSync(src)) { console.log(`   ✗ MISSING  ${sheet.file}`); tally.missing++; continue; }
      const png = read(src);
      const prep = prepSheet(png, sheet);
      console.log(`\n   ${sheet.file}  ${png.width}×${png.height}  ${sheet.mode}`
        + (prep.bandRows === null ? "" : `  band y ${prep.bandRows[0]}..${prep.bandRows[1]} = ${prep.bandRows[1] - prep.bandRows[0] + 1} px (stems on disk: ${sheet.band})`));
      for (const f of prep.faults) { tally.fail++; orders.push(f); console.log(`     ✗ SHEET  ${f}`); }
      for (const [pos, stem, opt = {}] of sheet.pieces) {
        const o = prep.bandRows === null ? opt : { ...opt, band: prep.bandRows };
        const cut = cutPiece(png, sheet, pos, stem, o);
        if (cut.img !== null) { rememberBody(stem, cut.L); measured.set(stem, cut.L); }
        const faults = [...cut.faults];
        if (prep.dup.has(pos)) {
          faults.unshift(`${stem}: cell ${pos} of this sheet is a byte-identical copy of cell ${prep.dup.get(pos)} — the same picture twice, so every number printed on this row is really that cell's. A sheet's cells are separate pieces of material: AS3's accepted edge sheet, AS5's, and AS5b's own p1/p2/p9 edge sheets and all four body sheets carry only distinct cells.`);
        }
        const axes = seamAxes(opt.tiles);
        const seam = cut.seam === null || axes.length === 0
          ? "—"
          : axes.map((ax) => `${ax} ${(cut.seam[ax] / cut.seam.inner).toFixed(2)}× climb ${(cut.seam[`${ax}Jump`] / cut.seam.inner).toFixed(2)}×`).join(" ");
        const win = opt.luma ?? (opt.aboveBody === undefined ? null : bodyWindow(opt.aboveBody));
        const ok = faults.length === 0;
        if (ok) tally.pass++; else { tally.fail++; orders.push(`${stem}: ${faults[0]}`); }
        const pp = cut.paint ?? null;
        console.log(
          `     Z${pos} ${stem.padEnd(24)} L ${cut.L === null ? "     —" : `${cut.L.toFixed(2).padStart(6)}%`}` +
          `  ${(win === null ? "—" : `${win[0].toFixed(1)}–${win[1].toFixed(1)}`).padStart(13)}` +
          `  tex ${(cut.seam === null ? "—" : cut.seam.inner.toFixed(2)).padStart(5)}` +
          `  ${pp === null ? "sup   — rgh     — N1     —" : `sup ${String(pp.support).padStart(3)} rgh ${pp.rough.toFixed(3).padStart(5)} N1 ${(pp.n1 * 100).toFixed(2).padStart(5)}%`}` +
          `  ${seam.padEnd(38)} ${ok ? "✓" : "✗"}`,
        );
        for (const f of faults) console.log(`          ↳ ${f}`);
      }
    }
  }
  console.log(`\n${"═".repeat(84)}`);
  console.log(`  ${tally.pass} cell(s) PASS · ${tally.fail} FAIL · ${tally.missing} sheet(s) missing`);
  console.log(`\n  A cell that fails here would fail the import. The list above IS the re-order.\n`);
  process.exit(tally.fail > 0 || tally.missing > 0 ? 1 : 0);
}

// ── selftest ─────────────────────────────────────────────────────────────────
// The red light this import must be able to show is not hypothetical — it is the
// exact mistake the round inherited. So the selftest cuts the DELIVERED sheet
// twice through the SHIPPING code path: once with the stale AS2 y-range and once
// with the re-measured one, and it passes only if the first is rejected and the
// second is accepted. A tamper that changes nothing has proven nothing; this one
// changes four numbers and flips the verdict.
// ── selftest ─────────────────────────────────────────────────────────────────
//
// ── ★ R5-W7 · A8: THIS SELFTEST NOW RUNS ANYWHERE, AND HERE IS WHY IT HAD TO ─
//
// It used to cut ONE file — `LAB/batch-as3/mass_edges_p1.png` — and every one of
// its eight assertions hung off it. That file died with the first Mac (R204) and
// was never in the repository, so on this machine, and on any CI runner, the
// whole check exited 1 before its first assertion. The C10 line this round owes
// `ci.yml` would have been red from its first minute.
//
// So the fixture comes from the PLATE instead: the eight accepted p1 interior
// sheets the game draws today, 512² each, assembled here into the 4 × 2 sheet
// this importer expects. That is real, accepted, painted material under every
// „must stay green" half, and every „must go red" half is manufactured out of
// it in this file — which is the only way a tamper proves anything.
//
// TWO STAGES, and the second one is CONDITIONAL rather than deleted (Koki's
// ruling of 2026-08-22):
//   1 · the plate stage — always, including CI.
//   2 · the AS3 box stage — the two assertions that need the lost sheet's own
//       geometry. They stay in the file and run BY THEMSELVES the moment that
//       sheet is at the expected path again. When it is not, the run says so out
//       loud, names the file and the reason, and prints the reduced count — a
//       smaller number of checks must never look like the same number.
//       And the skip is itself under test: a corrupt sheet at that path has to
//       go RED, not SKIPPED. A stage that skips in every state checks nothing.
if (process.argv.includes("--selftest")) {
  let bad = 0;
  let ran = 0, skipped = 0;
  const claim = (ok, good, why) => { ran++; if (ok) console.log(`✓ ${good}`); else { bad++; console.error(`✗ ${why}`); } };

  // ── the fixture: eight ACCEPTED paintings, laid out as one 4 × 2 sheet ─────
  const PLATE_CELLS = [
    "mass_body_p1_a", "mass_body_p1_b", "mass_body_p1_c", "mass_body_p1_d",
    "mass_bodydeep_p1_a", "mass_bodydeep_p1_b", "mass_bodydeep_p1_c", "mass_bodydeep_p1_d",
  ];
  const missing = PLATE_CELLS.filter((s) => !fs.existsSync(path.join(OUT, `${s}.png`)));
  // ── N7A1 · DIE PLATTE KANN JETZT LEGITIM FEHLEN ──────────────────────────
  //
  // Diese Wache stand auf einer Annahme, die bis heute stimmte: die acht Blätter
  // sind eingecheckt und können nur durch einen Unfall verschwinden. Der
  // Ein-Block-Cutover hat sie ABSICHTLICH zurückgezogen — p1 wird als EIN Gemälde
  // ausgeliefert und lädt sein Massen-Kit nicht mehr. Ein Tor, das darauf mit
  // „das Repository ist kaputt" antwortet, meldet eine Entscheidung als Defekt.
  //
  // Der Unterschied, auf den es ankommt, ist ALLE gegen EINIGE: ist die ganze
  // Platte weg, ist das ein Rückzug; fehlen einzelne Blätter, ist es genau der
  // Unfall, für den diese Wache gebaut wurde — und der bleibt rot. Das
  // Überspringen folgt dem Muster, das diese Datei für die AS3-Stufe schon
  // benutzt: laut, mit Namen, mit Grund, und es läuft von selbst wieder, sobald
  // die Blätter an ihrem Pfad liegen.
  if (missing.length > 0 && missing.length < PLATE_CELLS.length) {
    console.error(`✗ selftest cannot run: ${missing.length} of the plate's own sheets are missing under ${OUT} — ${missing.join(", ")}.`);
    console.error("  Only SOME are gone — that is an accident, not a retirement: the repository is broken, not this check.");
    process.exit(1);
  }
  if (missing.length === PLATE_CELLS.length) {
    console.log(`⚠ import-batch-as --selftest ÜBERSPRUNGEN: alle ${PLATE_CELLS.length} Blätter der Prüf-Platte sind zurückgezogen`);
    console.log(`  (${PLATE_CELLS.join(", ")})`);
    console.log("  p1 ist seit N7A1 eine Ein-Block-Welt und lädt sein Massen-Kit nicht mehr. 0 von sonst ~20 Prüfungen gefahren.");
    process.exit(0);
  }
  const CELL = 512;
  const plate = new PNG({ width: CELL * 4, height: CELL * 2 });
  for (let pos = 0; pos < PLATE_CELLS.length; pos++) {
    const cell = read(path.join(OUT, `${PLATE_CELLS[pos]}.png`));
    const ox = (pos % 4) * CELL, oy = Math.floor(pos / 4) * CELL;
    for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) {
      const si = ((y % cell.height) * cell.width + (x % cell.width)) * 4;
      const di = ((oy + y) * plate.width + (ox + x)) * 4;
      for (let o = 0; o < 4; o++) plate.data[di + o] = cell.data[si + o];
    }
  }
  const sheet = { file: "selftest-plate", cols: 4, rows: 2, mode: "opaque" };
  const cut = (png, pos, name, opt) => cutPiece(png, sheet, pos, name, opt);

  // ── 0 · THE DIRECTION EVERYONE FORGETS: accepted art must stay GREEN ───────
  // A check that fires on good art is worse than none. This is also the guard
  // that keeps the three new windows honest: they were derived from these very
  // sheets, so if a later round moves a threshold past them, this goes red here
  // rather than silently in a delivery.
  {
    const bads = [];
    for (let pos = 0; pos < 8; pos++) {
      const r = cut(plate, pos, PLATE_CELLS[pos], { tiles: true });
      if (r.faults.length > 0) bads.push(`${PLATE_CELLS[pos]}: ${r.faults[0]}`);
    }
    claim(bads.length === 0,
      `the plate: all eight accepted p1 sheets pass every law this gate applies (texture, seam, support, roughness, N1)`,
      `the plate: ${bads.length} ACCEPTED sheet(s) were rejected by our own gate — ${bads[0]}`);
  }

  // A cell with a REAL vertical seam, built from accepted paint plus one declared
  // distortion: a 90-level ramp down the cell. It leaves the left↔right join
  // untouched and destroys the top↔bottom one — which is what both the hidden-
  // seam case and the axis case need, and neither could get from the plate
  // itself. The plate's own sheets are seamless on BOTH axes (they are the
  // interior continuum), so „duplicate the boundary row" has nothing to hide
  // there; the first draft of this selftest asserted otherwise and said so.
  const ramped = crop(plate, 0, 0, plate.width, plate.height);
  for (let y = 0; y < CELL; y++) {
    const d = Math.round((y / CELL) * 90) - 45;
    for (let x = 0; x < CELL; x++) {
      const i = (y * ramped.width + x) * 4;
      for (let o = 0; o < 3; o++) ramped.data[i + o] = Math.max(0, Math.min(255, ramped.data[i + o] + d));
    }
  }
  const CELL_BOX = [0, 0, CELL - 1, CELL - 1];

  // ── 1 · A HIDDEN SEAM (the AS5 cheat) ─────────────────────────────────────
  // Duplicating the boundary row makes the naive „last row against first" score
  // a perfect 0.00 while the picture still steps hard one row in. Without the
  // profile check this case passes; that is the whole reason it exists.
  const dupBoundaryRow = (src, box) => {
    const [bx0, by0, bx1, by1] = box;
    const copy = crop(src, 0, 0, src.width, src.height);
    for (let x = bx0; x <= bx1; x++) {
      const from = (by0 * copy.width + x) * 4, to = (by1 * copy.width + x) * 4;
      for (let o = 0; o < 4; o++) copy.data[to + o] = copy.data[from + o];
    }
    return copy;
  };
  {
    const box = CELL_BOX;
    const honest = cut(ramped, 0, "cheat_before", { box, tiles: "v" });
    const cheat = cut(dupBoundaryRow(ramped, box), 0, "cheat_after", { box, tiles: "v" });
    assert(honest.seam.tb > 10, `tamper fixture is wrong: the ramped cell was expected to join badly, it joins at ${honest.seam.tb.toFixed(2)}`);
    assert(cheat.seam.tb < 0.01, `the tamper did not take: the duplicated row still joins at ${cheat.seam.tb.toFixed(2)}, so this case tests nothing`);
    claim(cheat.faults.some((f) => f.includes("HIDDEN")),
      `hidden seam: duplicating the boundary row turns a ${honest.seam.tb.toFixed(2)} join into ${cheat.seam.tb.toFixed(2)} — and it is still REJECTED, because the picture jumps ${cheat.seam.tbJump.toFixed(2)} behind the duplicate`,
      `hidden seam: a join of ${cheat.seam.tb.toFixed(2)} with a ${cheat.seam.tbJump.toFixed(2)} jump behind it was ACCEPTED — the profile check is decoration`);
  }

  // ── 2 · A FLATTENED PAINTING, where the seam RATIO provably cannot see it ──
  const flatten = (src, k) => {
    const copy = crop(src, 0, 0, src.width, src.height);
    let n = 0, m = [0, 0, 0];
    for (let i = 0; i < copy.data.length; i += 4) {
      for (let o = 0; o < 3; o++) m[o] += copy.data[i + o];
      n++;
    }
    m = m.map((v) => v / n);
    for (let i = 0; i < copy.data.length; i += 4) {
      for (let o = 0; o < 3; o++) copy.data[i + o] = Math.max(0, Math.min(255, Math.round(m[o] + (copy.data[i + o] - m[o]) * k)));
    }
    return copy;
  };
  {
    const box = CELL_BOX;
    const sharp = cut(plate, 0, "texture_before", { box, tiles: "h" });
    const flat = cut(flatten(plate, 0.05), 0, "texture_after", { box, tiles: "h" });
    assert(sharp.seam.inner > MIN_TEXTURE, `texture fixture is wrong: the accepted sheet was expected to carry texture, it measures ${sharp.seam.inner.toFixed(2)}`);
    assert(flat.seam.inner < MIN_TEXTURE, `the flattening did not take: texture is still ${flat.seam.inner.toFixed(2)}`);
    assert(sharp.faults.length === 0, `texture fixture is wrong: the untouched piece already fails — ${sharp.faults.join(" · ")}`);
    const seamFired = flat.faults.filter((f) => f.includes("tile with itself") || f.includes("HIDDEN"));
    claim(seamFired.length === 0 && flat.faults.some((f) => f.includes("almost no texture")),
      `texture: flattening the same painting from a ${sharp.seam.inner.toFixed(2)} step to ${flat.seam.inner.toFixed(2)} is REJECTED, and the SEAM law does not fire on it — so the floor catches what the ratio cannot`,
      seamFired.length > 0
        ? `texture: the flattened piece was caught by the SEAM law (${seamFired[0]}) — this case no longer isolates flatness`
        : `texture: a piece flattened from ${sharp.seam.inner.toFixed(2)} to ${flat.seam.inner.toFixed(2)} was ACCEPTED — the texture floor is decoration`);
  }

  // ── 3 · ONE CELL TWICE, and a clean sheet that must stay silent ───────────
  const pasteCell = (src, from, to, cols, rows) => {
    const copy = crop(src, 0, 0, src.width, src.height);
    const cw = src.width / cols, ch = src.height / rows;
    const fx = (from % cols) * cw, fy = Math.floor(from / cols) * ch;
    const tx = (to % cols) * cw, ty = Math.floor(to / cols) * ch;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const si = ((fy + y) * src.width + (fx + x)) * 4, di = ((ty + y) * src.width + (tx + x)) * 4;
      for (let o = 0; o < 4; o++) copy.data[di + o] = copy.data[si + o];
    }
    return copy;
  };
  {
    const clean = duplicateCells(plate, { cols: 4, rows: 2 });
    const pasted = duplicateCells(pasteCell(plate, 2, 3, 4, 2), { cols: 4, rows: 2 });
    assert(pasted.get(3) === 2, `the paste did not take: cell 3 is not reported as a copy of cell 2 (${[...pasted].join(", ") || "no duplicates at all"})`);
    claim(clean.size === 0,
      "distinctness: eight accepted sheets read as eight distinct cells, and the same sheet with cell 2 pasted over cell 3 is caught",
      `distinctness: the ACCEPTED plate was reported as carrying copies (${[...clean].map(([a, b]) => `Z${a}=Z${b}`).join(", ")}) — a check that fires on good art is worse than none`);
  }

  // ── 4 · A BAND OF THE WRONG HEIGHT ────────────────────────────────────────
  // The renderer scales a crust tile from its SOURCE HEIGHT, so the declared
  // band height is load-bearing geometry. Built here by keying the top and
  // bottom of the plate, which is what a band sheet physically is.
  {
    const keyed = crop(plate, 0, 0, plate.width, plate.height);
    const pad = 90;
    for (let y = 0; y < keyed.height; y++) {
      const inBand = (y % CELL) >= pad && (y % CELL) < CELL - pad;
      if (inBand) continue;
      for (let x = 0; x < keyed.width; x++) {
        const i = (y * keyed.width + x) * 4;
        keyed.data[i] = 255; keyed.data[i + 1] = 0; keyed.data[i + 2] = 255; keyed.data[i + 3] = 255;
      }
    }
    const bandSheet = (h) => ({ file: "selftest-band", cols: 4, rows: 2, mode: "keyed", band: h });
    const measured = sheetBand(keyed, bandSheet(0));
    assert(measured !== null, "band fixture is wrong: the keyed sheet keys to nothing");
    const trueH = measured[1] - measured[0] + 1;
    assert(trueH === CELL - 2 * pad, `band fixture is wrong: expected a ${CELL - 2 * pad} px band, measured ${trueH}`);
    const right = prepSheet(keyed, bandSheet(trueH));
    const wrong = prepSheet(keyed, bandSheet(trueH - 1));
    claim(right.faults.length === 0 && wrong.faults.some((f) => f.includes("shared band")),
      `band: the sheet's own measured height ${trueH} px passes and ${trueH - 1} px is refused — a crust cannot be cut to a height the renderer does not scale from`,
      right.faults.length > 0
        ? `band: the sheet's OWN measured height ${trueH} was rejected — ${right.faults[0]}`
        : `band: a declared height of ${trueH - 1} against a measured ${trueH} was ACCEPTED — the band check is decoration`);
  }

  // ── 5 · THE AXES MUST BE TOLD APART ───────────────────────────────────────
  // A strip that tiles one way and not the other, built from accepted paint: a
  // strong vertical ramp laid over one cell leaves its left↔right join intact
  // and destroys its top↔bottom one. If asking for the wrong axis passed, the
  // `tiles` option would be decoration.
  {
    const alongX = cut(ramped, 0, "axis_h", { box: CELL_BOX, tiles: "h" });
    const alongY = cut(ramped, 0, "axis_v", { box: CELL_BOX, tiles: "v" });
    claim(alongX.faults.length === 0 && alongY.faults.some((f) => f.includes("top↔bottom")),
      `axis: a vertically ramped strip passes left↔right (join ${alongX.seam.lr.toFixed(2)}) and fails top↔bottom (join ${alongY.seam.tb.toFixed(2)}) — the axes are told apart`,
      alongX.faults.length > 0
        ? `axis: the ramped strip failed the axis it DOES tile on — ${alongX.faults[0]}`
        : `axis: a strip with a 90-level vertical ramp passed a TOP↔BOTTOM tiling demand — the axis option is not doing anything`);
  }

  // ── 6 · IS IT PAINT, OR A TEXTURE FUNCTION? (the three new laws) ──────────
  // The controls are built here, from nothing, exactly as `--calibrate` builds
  // them — and the point of the first assertion is that the OLD gate lets both
  // of them through. A floor a generator can clear by generating is a target.
  {
    const wrap = (png) => {
      const s = new PNG({ width: CELL * 4, height: CELL * 2 });
      for (let y = 0; y < s.height; y++) for (let x = 0; x < s.width; x++) {
        const si = ((y % png.height) * png.width + (x % png.width)) * 4;
        const di = (y * s.width + x) * 4;
        for (let o = 0; o < 4; o++) s.data[di + o] = png.data[si + o];
      }
      return s;
    };
    const box = CELL_BOX;
    const grid = cut(wrap(controlSheet("grid")), 0, "control_grid", { box, tiles: true });
    const noise = cut(wrap(controlSheet("noise")), 0, "control_noise", { box, tiles: true });
    const real = cut(plate, 0, "control_real", { box, tiles: true });

    claim(grid.seam.inner > MIN_TEXTURE && noise.seam.inner > MIN_TEXTURE,
      `the gap this round exists for: an EMPTY surface with the AS5c grid on it measures tex ${grid.seam.inner.toFixed(2)} and pure noise ${noise.seam.inner.toFixed(2)} — both clear the ${MIN_TEXTURE.toFixed(1)} floor, so the texture law alone cannot see either of them`,
      `the controls no longer clear MIN_TEXTURE (grid ${grid.seam.inner.toFixed(2)}, noise ${noise.seam.inner.toFixed(2)}) — this case no longer shows why the new laws are needed`);

    claim(grid.faults.some((f) => f.includes("distinct neighbour-step")),
      `support: the generator grid uses ${grid.paint.support} distinct step values against a floor of ${PAINT_WINDOWS.supportMin} (accepted art: ${real.paint.support} on this cell) — REJECTED`,
      `support: the AS5c generator grid (support ${grid.paint.support}) was ACCEPTED — the support floor is decoration`);

    claim(grid.faults.some((f) => f.includes("roughness")) && noise.faults.some((f) => f.includes("roughness")),
      `roughness: the grid measures ${grid.paint.rough.toFixed(3)} and pure noise ${noise.paint.rough.toFixed(3)} against a window of ${PAINT_WINDOWS.rough[0]}–${PAINT_WINDOWS.rough[1]} (this accepted cell: ${real.paint.rough.toFixed(3)}) — both REJECTED`,
      `roughness: grid ${grid.paint.rough.toFixed(3)} / noise ${noise.paint.rough.toFixed(3)} — at least one was ACCEPTED, so the roughness window is decoration`);

    claim(grid.faults.some((f) => f.includes("EXACTLY equal")),
      `N1: the grid dithers every single pixel (${(grid.paint.n1 * 100).toFixed(2)} % exactly-equal neighbours against a floor of ${(PAINT_WINDOWS.n1[0] * 100).toFixed(1)} %; this accepted cell: ${(real.paint.n1 * 100).toFixed(2)} %) — REJECTED`,
      `N1: a picture with ${(grid.paint.n1 * 100).toFixed(2)} % exactly-equal neighbours was ACCEPTED — the N1 floor is decoration`);

    // …and the honest half: N1's CEILING does not catch the noise control. Said
    // out loud, because a gate whose owner cannot name which line carries which
    // defect is a gate nobody can maintain.
    claim(noise.paint.n1 <= PAINT_WINDOWS.n1[1] || noise.faults.some((f) => f.includes("EXACTLY equal")),
      `…and stated rather than implied: pure noise measures ${(noise.paint.n1 * 100).toFixed(2)} % on N1 against a ${(PAINT_WINDOWS.n1[1] * 100).toFixed(1)} % ceiling — N1 alone does NOT catch it; roughness does`,
      "the N1 note is stale — re-derive it");

    // the tamper: widen each window and the same control walks straight through
    const wouldPass = grid.paint.support >= 2 && grid.paint.rough <= 1.5 && grid.paint.n1 >= 0;
    claim(wouldPass,
      "the tamper: with the support floor at 2, the roughness ceiling at 1.5 and the N1 floor at 0, this same grid PASSES every one of the three — the windows, not the metrics, are what reject it",
      "the tamper is broken: the grid fails even with the windows opened, so these three assertions are not testing the thresholds");
  }

  // ── STAGE 2 · the AS3 box assertions — conditional, loud, and under test ───
  //
  // These two need `mass_edges_p1.png` from batch AS3: the sheet whose STALE
  // AS2 y-range hides a 74 px gutter. Nothing on the plate can stand in for it,
  // because what is under test is a BOX measured against the wrong sheet.
  //
  // UNPARKING (the architect decides, not this lane): the next mass-kit delivery
  // that PASSES its Wareneingang can be anchored here as the stage-2 fixture —
  // AS5F is the open candidate, and as of 2026-08-22 it is not accepted (its own
  // Lieferschein reports `pass: false · status: INCOMPLETE`, R202). Until then
  // this stage stays parked, and the same condition is written in A8's register
  // block so it is not only in a comment.
  const AS3_FIXTURE = path.join(LAB, "batch-as3/mass_edges_p1.png");
  const stageTwo = (file, label, quiet = false) => {
    const src = read(file);
    if (src.width < 1024 || src.height < 1024) {
      bad++; ran++;
      const msg = `stage 2 (${label}): ${file} is ${src.width}×${src.height} — the AS3 edge sheet is 2048×1024. A file at this path that is not that sheet is a BROKEN fixture, not an absent one.`;
      // `quiet` is ONLY for the tamper below, where this red light is the
      // expected outcome. A run that prints ✗ while ending green teaches its
      // reader to ignore ✗, which is how a real one gets past.
      if (quiet) console.log(`  · (tamper, expected) ${msg}`);
      else console.error(`✗ ${msg}`);
      return;
    }
    const s2 = { file: "selftest-as3", cols: 4, rows: 2, mode: "keyed" };
    for (const [name, pos] of [["edgeL", 0], ["edgeR", 1]]) {
      const stale = cutPiece(src, s2, pos, `stale_${name}`, { box: STALE_SIDE_BOXES[name], tiles: "v" });
      const fresh = cutPiece(src, s2, pos, `fresh_${name}`, { box: EDGE_BOXES[name], tiles: "v" });
      claim(stale.faults.some((f) => f.includes("does not tile")),
        `stage 2 ${name}: the stale AS2 box y ${STALE_SIDE_BOXES[name][1]}..${STALE_SIDE_BOXES[name][3]} is REJECTED — join ${stale.seam?.tb.toFixed(2)} against a texture step of ${stale.seam?.inner.toFixed(2)}`,
        `stage 2 ${name}: the STALE AS2 box was accepted — this check cannot see a 74 px gutter, so it proves nothing`);
      claim(fresh.faults.length === 0,
        `stage 2 ${name}: the re-measured box y ${EDGE_BOXES[name][1]}..${EDGE_BOXES[name][3]} is ACCEPTED`,
        `stage 2 ${name}: the re-measured box was rejected: ${fresh.faults.join(" · ")}`);
    }
  };

  if (fs.existsSync(AS3_FIXTURE)) {
    console.log(`  · stage 2 fixture found at ${AS3_FIXTURE} — running the AS3 box assertions.`);
    stageTwo(AS3_FIXTURE, "AS3");
  } else {
    skipped += 4;
    console.log(`  ⚠ STAGE 2 SKIPPED — 4 assertions not run.`);
    console.log(`    missing file : ${AS3_FIXTURE}`);
    console.log(`    reason       : the R5 lab of the first Mac is not reachable (Ruling R204, 2026-08-21); batch AS3 was never in the repository.`);
    console.log(`    what is lost : the two box assertions (a box measured against the WRONG sheet must go red, the re-measured one green).`);
    console.log(`    unparking    : the architect anchors the next mass-kit delivery that passes its Wareneingang as the fixture here (A8 register block).`);
  }

  // …and the skip logic is itself under test (Koki, 2026-08-22): a stage that
  // skips in every state checks nothing. A file that EXISTS at that path but is
  // not the sheet must go RED, never SKIPPED — the failure mode of a
  // conditional fixture is not absence, it is a wrong file quietly accepted.
  {
    const tmp = path.join(os.tmpdir(), `as-selftest-corrupt-${process.pid}.png`);
    const junk = new PNG({ width: 64, height: 64 });
    for (let i = 0; i < junk.data.length; i += 4) { junk.data[i + 3] = 255; }
    fs.writeFileSync(tmp, PNG.sync.write(junk));
    const before = bad, ranBefore = ran;
    stageTwo(tmp, "corrupt", true);
    fs.rmSync(tmp, { force: true });
    const caught = bad > before;
    bad = before; ran = ranBefore; // this red light is the EXPECTED outcome, not a failure
    claim(caught,
      "skip logic: a wrong file at the stage-2 path goes RED, not SKIPPED — the stage cannot be neutralised by putting something, anything, where the fixture belongs",
      "skip logic: a 64×64 junk PNG at the stage-2 path was treated as a fixture — this stage would skip or pass in every state, which is the same as not existing");
  }

  console.log(`\n  ${ran} assertion(s) run · ${skipped} skipped · ${bad} failed`);
  if (bad > 0) { console.error("✗ import-batch-as selftest: FAILED"); process.exit(1); }
  console.log("✓ selftest: accepted art stays green; a hidden seam, a flattened painting, a copied cell, a band of the\n"
    + "  wrong height and the wrong tiling axis all go red; a generator grid and pure noise both clear the texture\n"
    + "  floor and are caught by support, roughness and N1 instead; and the parked stage cannot be neutralised.");
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
  // (A band sheet is 512×512 at SOURCE too — the band is cut out of the cell
  //  after the key, so the grid law above still holds for it.)

  // The same two sheet-level laws `--verify` applies, applied here — the promise
  // that file makes to the lab is that the two paths are ONE gate, and a law that
  // only the preview runs is a law an import can walk past.
  const prep = prepSheet(png, sheet);
  failures.push(...prep.faults);
  for (const [pos, stem, opt = {}] of sheet.pieces) {
    if (prep.dup.has(pos)) {
      failures.push(`${stem}: cell ${pos} of ${sheet.file} is a byte-identical copy of cell ${prep.dup.get(pos)} — the same picture written to two stems`);
      continue;
    }
    const o = prep.bandRows === null ? opt : { ...opt, band: prep.bandRows };
    const cut = cutPiece(png, sheet, pos, stem, o);
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
