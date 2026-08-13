#!/usr/bin/env node
/**
 * import-batch-aq7 — R5-W2 · J1-C · THE RULE-PAGE TREASURE AND THE CHAPTER OPENING.
 * Imports batches AQ7 and AQ8 into apps/web/public/art/g1/paint/ch01/.
 *
 *   node docs/art/import-batch-aq7.mjs [--dry]
 *
 * Same shape as import-batch-aq (chroma key → defringe → content trim), plus
 * TWO new assertions this round. Both exist because a delivery note is a claim
 * and an importer is the last place a claim can still be cheaply checked — the
 * REJECTED predecessor sheet also reported »Format PASS«.
 *
 * ── ASSERTION 1 · THE DUPLICATE (AQ7) ────────────────────────────────────────
 * `tip_treasure.png` cell 0 and `regelseite_a.png` report identical statistics
 * in the delivery's own verification file (foreground 117129, key distance
 * 184.71). Measured here before writing a line of import: they are PIXEL
 * IDENTICAL — max channel difference 0 over all 512×512.
 *
 * So the page is imported ONCE, from the dedicated sheet, and this importer
 * ASSERTS the identity rather than assuming it. If a future re-render makes the
 * two diverge, that is a real fact about the art (two different page states
 * shipped under one name) and it must stop the import, not slip through as
 * whichever cell happened to be written last.
 *
 * ── ASSERTION 2 · THE SCHOOLHOUSE MUST STAY CONGRUENT (AQ8) ──────────────────
 * `schulhaus_ch01.png` cells 0 and 1 are the real school in colour and the same
 * school drained to grey. The engine CROSS-FADES between them when the colour
 * comes back, so they must occupy the same pixels — a silhouette that shifts by
 * two pixels reads as the building jumping, not as the colour returning.
 *
 * The delivery asserts »identical silhouette mask«. Sprite mode trims each cell
 * to its OWN content box, which would silently break exactly this property if
 * the masks ever differed. So the two cells are keyed, their masks compared, and
 * they are trimmed on a SHARED box — and a mask mismatch is a hard failure.
 *
 * ── WHAT THIS ROUND DELIBERATELY DOES NOT IMPORT ─────────────────────────────
 * `tip_treasure` cell 2 (the painted light shaft) is HELD. The engine already
 * draws a shaft (cue.ts `treasureCue` / air.ts `shaftQuads`), and the drawn one
 * is anchored to the floor the page stands on — it STOPS at the page's standing
 * line, which a sprite with one aspect ratio cannot know. Whether the painted
 * one replaces it, overlays it, or is dropped is a MEASURED decision (J1-E's
 * instrument), not an import-time guess. Until that measurement exists the cell
 * stays in the lab, because an imported stem that nothing loads is dead weight
 * the art audit has to carry (45.2 MB of it already).
 *
 * `regelseite_a` OVERWRITES the stem imported by import-batch-aq: that is the
 * point of the round. The old one carried a painted pink glow seam that fell
 * apart into a contour at 18 px and that two blind critics independently read as
 * an editor's selection marquee (D-40). The new one has no seam.
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

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

/** The mask a cross-fade pair must share: which pixels are painted at all. */
const maskOf = (png) => {
  const m = new Uint8Array(png.width * png.height);
  for (let i = 0, p = 0; i < png.data.length; i += 4, p++) m[p] = png.data[i + 3] > 8 ? 1 : 0;
  return m;
};

/** How far the nearest painted pixel stays from the import colour. Under 150 a
 *  tolerant key eats paint — that is how `tip_treasure` was rejected once and how
 *  `regelseite_a` carried its seam until AQ7.
 *
 *  ⚠ TWO METRICS EXIST AND THEY DISAGREE BY ~55 %, which is worth writing down
 *  because both are in circulation and neither is wrong:
 *    · EUCLIDEAN — the straight-line distance in RGB space. The delivery's own
 *      verification file uses it (AQ7: 184.71–206.74 · AQ8: 170.95–208.21), and
 *      it is the metric the ≥150 threshold was written for.
 *    · MANHATTAN — the sum of the three channel gaps. Session I1 used it, so the
 *      J1 passover's table (243–295) is in this metric.
 *  For `hud_rule` the SAME pixel is 190.60 Euclidean and 295 Manhattan. The two
 *  tables that looked like they contradicted each other are the same measurement.
 *
 *  Manhattan is always ≥ Euclidean, so gating on Manhattan ≥ 150 would be a
 *  LOOSER test than the threshold promises — a gate that is weaker than it reads
 *  is the defect class this program exists to remove. The gate is therefore
 *  EUCLIDEAN; the Manhattan value is reported alongside so the number stays
 *  comparable with I1's and the passover's tables. */
const keyDistance = (png) => {
  let euclid = Infinity, manhattan = Infinity;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] <= 8) continue;
    const dr = png.data[i] - 255, dg = png.data[i + 1], db = png.data[i + 2] - 255;
    const e = Math.hypot(dr, dg, db);
    const m = Math.abs(dr) + Math.abs(dg) + Math.abs(db);
    if (e < euclid) euclid = e;
    if (m < manhattan) manhattan = m;
  }
  return { euclid, manhattan };
};

// ── the sheets ───────────────────────────────────────────────────────────────
const SHEETS = [
  {
    // AQ7 Blatt 4 — THE RULE PAGE WITHOUT THE SEAM (D-40). Overwrites the stem
    // import-batch-aq wrote; that is the repair this sheet was ordered for.
    file: "batch-aq7/regelseite_a.png", cols: 1, rows: 1,
    pieces: [[0, "regelseite_a"]],
  },
  {
    // AQ7 Blatt 1 — the page's two states plus its light, one cell each.
    // Cell 0 is the same picture as Blatt 4 (asserted below) and is NOT written.
    // Cell 2 (the painted shaft) is HELD pending J1-E's measurement.
    file: "batch-aq7/tip_treasure.png", cols: 4, rows: 1,
    pieces: [[1, "regelseite_lit"], [3, "tip_sparks"]],
    duplicateOf: { cell: 0, sheet: "batch-aq7/regelseite_a.png" },
    held: [2],
  },
  {
    // AQ7 Blatt 2 — the Merkseite archive: the double page with three empty
    // frames, the torn stump, the golden completion seal.
    file: "batch-aq7/merkseite_kit.png", cols: 3, rows: 1,
    pieces: [[0, "merkseite_page"], [1, "merkseite_stub"], [2, "merkseite_seal"]],
  },
  {
    // AQ7 Blatt 3 — the HUD counter's own torn page. The stem name is not a
    // choice: PaintedIcon's painted-override rung looks up `hud_<iconName>`, and
    // this counter's icon is `rule`. Named wrong, it would load as nothing and
    // the code-drawn glyph would keep rendering with every gate green.
    file: "batch-aq7/hud_rule.png", cols: 1, rows: 1,
    pieces: [[0, "hud_rule"]],
  },
  {
    // AQ8 Blatt 1 — THE CHAPTER OPENING'S FOUR BEATS.
    file: "batch-aq8/auftakt_ch01.png", cols: 4, rows: 1,
    pieces: [[0, "auftakt_ch01_a"], [1, "auftakt_ch01_b"], [2, "auftakt_ch01_c"], [3, "auftakt_ch01_d"]],
  },
  {
    // AQ8 Blatt 2 — the marks for beat 3's task lines. Three delivered, five
    // task rows: letters, cages and rule pages get paint; the drained things and
    // the bonus books keep their code-drawn mark. The mixture is deliberate and
    // is documented at the render site.
    file: "batch-aq8/auftakt_marken.png", cols: 3, rows: 1,
    pieces: [[0, "auftakt_mark_letters"], [1, "auftakt_mark_cages"], [2, "auftakt_mark_tips"]],
  },
  {
    // AQ8 Blatt 3 — THE REAL SCHOOL (doc GEBAEUDE_MOTIV, PR #276). Cells 0 and 1
    // are one building in two states and are trimmed on a SHARED box; cell 2 is
    // an independent architectural detail and trims on its own.
    file: "batch-aq8/schulhaus_ch01.png", cols: 3, rows: 1,
    pieces: [[0, "schulhaus_ch01_a"], [1, "schulhaus_ch01_b"], [2, "schulhaus_ch01_c"]],
    congruent: [0, 1],
  },
];

const failures = [];
const written = [];
const notes = [];

const sheetOf = (rel) => {
  const p = path.join(LAB, rel);
  return fs.existsSync(p) ? read(p) : null;
};

// ── assertion 1: the duplicate is still a duplicate ──────────────────────────
for (const sheet of SHEETS) {
  if (!sheet.duplicateOf) continue;
  const a = sheetOf(sheet.file);
  const b = sheetOf(sheet.duplicateOf.sheet);
  if (a === null || b === null) { failures.push(`duplicate check: a source sheet is missing`); continue; }
  const cw = a.width / sheet.cols, chh = a.height / sheet.rows;
  const cell = crop(a, sheet.duplicateOf.cell * cw, 0, cw, chh);
  if (cell.width !== b.width || cell.height !== b.height) {
    failures.push(`${sheet.file} cell ${sheet.duplicateOf.cell} is ${cell.width}×${cell.height}, the dedicated sheet is ${b.width}×${b.height} — they can no longer be the same page`);
  } else {
    let maxd = 0;
    for (let i = 0; i < cell.data.length; i += 4) {
      for (let k = 0; k < 3; k++) maxd = Math.max(maxd, Math.abs(cell.data[i + k] - b.data[i + k]));
    }
    if (maxd !== 0) {
      failures.push(`${sheet.file} cell ${sheet.duplicateOf.cell} and ${sheet.duplicateOf.sheet} DIVERGED (max channel diff ${maxd}) — they used to be one picture; decide which page state each is and give them separate stems`);
    } else {
      notes.push(`✓ duplicate holds: ${sheet.file} cell ${sheet.duplicateOf.cell} is pixel-identical to ${sheet.duplicateOf.sheet} — imported once, from the dedicated sheet`);
    }
  }
}

// ── the import ───────────────────────────────────────────────────────────────
for (const sheet of SHEETS) {
  const png = sheetOf(sheet.file);
  if (png === null) { failures.push(`source sheet MISSING: ${sheet.file}`); continue; }
  const cw = png.width / sheet.cols;
  const chh = png.height / sheet.rows;
  if (!Number.isInteger(cw) || !Number.isInteger(chh)) {
    failures.push(`${sheet.file}: ${png.width}×${png.height} does not divide into ${sheet.cols}×${sheet.rows}`);
    continue;
  }

  for (const h of sheet.held ?? []) notes.push(`· HELD in the lab: ${sheet.file} cell ${h} (see the header)`);

  // key + defringe every piece first, so a congruence check can compare masks
  const prepared = new Map();
  for (const [pos, stem] of sheet.pieces) {
    const img = crop(png, (pos % sheet.cols) * cw, Math.floor(pos / sheet.cols) * chh, cw, chh);
    chromaKey(img);
    defringe(img);
    prepared.set(pos, { stem, img });
  }

  // ── assertion 2: a cross-fade pair shares one silhouette and one box ───────
  let sharedBox = null;
  if (sheet.congruent) {
    const [pa, pb] = sheet.congruent;
    const A = prepared.get(pa), B = prepared.get(pb);
    if (!A || !B) {
      failures.push(`${sheet.file}: congruent pair ${pa}/${pb} is not both imported`);
    } else {
      const ma = maskOf(A.img), mb = maskOf(B.img);
      let differ = 0;
      for (let i = 0; i < ma.length; i++) if (ma[i] !== mb[i]) differ++;
      const share = differ / ma.length;
      if (share > 0.002) {
        failures.push(`${sheet.file}: ${A.stem} and ${B.stem} do not share a silhouette (${differ} px differ) — the engine cross-fades between them, so the building would JUMP instead of losing its colour`);
      } else {
        const ba = contentBox(A.img), bb = contentBox(B.img);
        sharedBox = {
          x0: Math.min(ba.x0, bb.x0), y0: Math.min(ba.y0, bb.y0),
          x1: Math.max(ba.x1, bb.x1), y1: Math.max(ba.y1, bb.y1),
        };
        // ⚠ THE COUNT, NOT THE PERCENTAGE. This line used to print a share, and
        // 1 differing pixel in 262 144 rounds to »100.000% identical« — a number
        // that rounds to perfect is how a check quietly stops meaning anything
        // (the same class the stylesheet's stale-kill-list law guards against).
        // The delivery note claims »identical silhouette mask PASS«; measured, it
        // is off by one pixel. Harmless in a cross-fade, and worth SEEING.
        notes.push(`✓ congruent: ${A.stem} / ${B.stem} differ in ${differ} silhouette px of ${ma.length} — trimmed on ONE box so the cross-fade cannot drift`);
      }
    }
  }

  for (const [pos, { stem, img }] of prepared) {
    const useShared = sheet.congruent?.includes(pos) && sharedBox !== null;
    const box = useShared ? sharedBox : contentBox(img);
    if (!box) { failures.push(`${stem}: keyed to nothing`); continue; }
    const out = crop(img, box.x0, box.y0, box.x1 - box.x0 + 1, box.y1 - box.y0 + 1);

    const dist = keyDistance(out);
    if (dist.euclid < 150) {
      failures.push(`${stem}: a painted pixel sits ${dist.euclid.toFixed(2)} (Euclidean) from the import colour — needs ≥150, or a tolerant key eats it`);
      continue;
    }

    const dest = path.join(OUT, `${stem}.png`);
    const existed = fs.existsSync(dest);
    if (!DRY) fs.writeFileSync(dest, PNG.sync.write(out));
    written.push(`${existed ? "overwrote" : "wrote    "} ${stem}.png`.padEnd(42)
      + `${out.width}×${out.height}`.padEnd(10)
      + `key-distance ${dist.euclid.toFixed(1)} euclid / ${dist.manhattan} manhattan`);
  }
}

for (const n of notes) console.log(n);
console.log("");
for (const w of written) console.log(`  ${DRY ? "[dry] " : ""}${w}`);
console.log("");
if (failures.length > 0) {
  for (const f of failures) console.error(`✗ ${f}`);
  console.error(`\nimport-batch-aq7: ${failures.length} failure(s) — nothing about this delivery is accepted`);
  process.exit(1);
}
console.log(`import-batch-aq7: OK — ${written.length} stem(s)${DRY ? " (dry run, nothing written)" : ""}`);
