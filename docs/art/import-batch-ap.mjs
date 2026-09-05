#!/usr/bin/env node
/**
 * import-batch-ap — PK-R6 H3 · THE ART ROUND.
 * Imports the reviewed batches AP + AM3 into apps/web/public/art/g1/paint/ch01/.
 *
 *   node --experimental-strip-types docs/art/import-batch-ap.mjs
 *
 * (Die Strip-Types-Flagge kam mit L0c: das Ziel jeder Zelle wird aus
 *  `ALWAYS_STEMS` abgeleitet, und die Liste wohnt in einer .ts-Datei.)
 *
 * Same laws as import-batch-am (tol-40 chroma key → 3-pass defringe → content
 * trim → alpha audit; exit 1 on any failure), with THREE additions this round
 * forces, all measured from the pixels before they were written down:
 *
 * 1. PER-CELL X WINDOWS. The hero-v2 sheet paints running strides WIDER than
 *    their 512 px cells: run0's front foot finishes 33 px inside run1's column,
 *    and the landing squash reaches 335 px below its own row. Full-sheet
 *    component clustering (centroid → owning cell) measured every figure's true
 *    box; the windows below are those measurements, and they are mutually
 *    disjoint — no figure steals a neighbour's paint.
 *
 * 2. THE LEDGE CUT (import ruling, 2026-08-10). The two teeter cells carry a
 *    painted rock ledge under the shoes — world geometry inside a character
 *    cell, which would render as a floating rock wherever the hero teeters.
 *    Measured: the rock band starts at sheet y=1801 in both cells (widths >200
 *    px from there down; the soles rest at ≈1800). The window ends at y=1800:
 *    the figure stays whole, the world stays in the world.
 *
 * 3. "keyplate" + "band" MODES. The ceremony plates are painted with soft
 *    washes that FADE toward the key (unlike the full-bleed goal plate), so
 *    they are keyed + defringed but NEVER trimmed — the 1024×768 framing is
 *    the CSS aspect contract. The armchair band replaces l2_p4 and must stay
 *    exactly 2048×384 with its seam intact, so it is keyed, defringed,
 *    untrimmed, and size-asserted.
 *
 * NOT IMPORTED, deliberately: `batch-ap/sharpener_repaint.png`. The gate
 * stopped it — the only sharpener in ch01 is the drained PROP whose restore
 * card keys "yellow" (measured hue 43°), and the repaint is red-bodied; no
 * sharpener CREATURE exists in the level. The critics' "metal armadillo" is
 * some other being — identifying it and commissioning ITS repaint is filed.
 */

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { ALWAYS_STEMS } from "../../packages/game-paint/src/artScope.ts";

const LAB = path.join(process.env.HOME, "Code", "codex-art-lab");
const ART_ROOT = path.join(process.cwd(), "apps/web/public/art/g1/paint");
// Diese Lieferung ist die ch01-Runde; ihre Zellenliste unten IST der ch01-Kit.
const KAPITEL = "ch01";

// ── L0c · P15 · D-793 · DAS ZIEL KOMMT AUS DEM STEM, NICHT AUS DIESER ZEILE ──
//
// Hier stand EIN fester Zielordner (`…/paint/ch01`), und jede Lieferung ging
// dorthin — auch die der FIGUR. So sind die vierzehn `hero2_*`-Zellen in
// `ch01/` gelandet, und genau daraus wurde R263: der Aufloeser gibt jedem
// Kapitel nur `["hero", chapter]` (`apps/web/lib/paint-art.ts#artDirsFor`),
// also fand ch02–ch06 die Figur nicht und zeichnete still den alten
// Teile-Baukasten. Ohne diese Zeilen kaeme die naechste Figuren-Lieferung
// wieder falsch an.
//
// Die Regel hat zwei Leser und eine Quelle: `ALWAYS_STEMS` (die Blaetter, die
// JEDES Kapitel laedt) plus die Namensform `hero…_`. Der Praefix steht daneben,
// weil die Listen in `artManifest.ts` und `rigSpec.ts` schon einmal
// auseinandergelaufen sind (D-173) — ein neues Helden-Blatt darf nicht davon
// abhaengen, dass jemand die Liste nachgezogen hat.
//
// Und der dritte Fall ist der wichtigste: ein Stem, der zu KEINEM passt, haelt
// das Werkzeug an. Raten ist genau das, was D-793 gekostet hat.
//
// IN DIESER DATEI kann dieser dritte Zweig nicht feuern: `KAPITEL` ist eine
// Konstante (diese Lieferung IST die ch01-Runde), also ist `kapitel` nie null.
// Er steht trotzdem hier, weil beide Werkzeuge dieselbe Form tragen sollen —
// im allgemeinen Werkzeug (`scripts/import-codex-sheet.mjs`, ohne `--chapter`)
// ist er der Zweig, der wirklich anhaelt. Vom blinden Leser benannt, damit
// niemand ihn fuer eine hier wirksame Sicherung haelt.
const istHeldenStem = (stem) => ALWAYS_STEMS.includes(stem) || /^hero\d*_/.test(stem);
const zielFuer = (stem, kapitel) => {
  if (istHeldenStem(stem)) return path.join(ART_ROOT, "hero");
  if (kapitel === null) {
    console.error(`✗ "${stem}" ist kein Helden-Blatt (weder in ALWAYS_STEMS noch in der Form hero…_), `
      + "und dieser Lauf nennt kein Kapitel (--chapter chNN). Ein Ziel wird hier nicht geraten (D-793).");
    process.exit(2);
  }
  return path.join(ART_ROOT, kapitel);
};


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
    // THE CLEAN FLIGHT RIG — batch-am3. Identical 20-cell contract to the wired
    // batch-am2 sheet (poses, faces, easel unchanged BY CONTRACT), minus the
    // baked golden trail wisps whose key-blended tips read as a pink crescent
    // in the running game (stage E's filed finding 2). The code trail from
    // stage E is the only trail now. Same stem names ⇒ direct replacement.
    file: "batch-am3/tafel_flight_clean.png", cols: 4, rows: 5, mode: "sprite",
    pieces: [
      [0, "tafel_a"], [1, "tafel_b"], [2, "tafel_c"], [3, "tafel_d"],
      [4, "tafel_roll"], [5, "tafel_bank_l1"], [6, "tafel_bank_r0"], [7, "tafel_bank_r1"],
      [8, "tafel_spiral0"], [9, "tafel_spiral1"], [10, "tafel_spiral2"], [11, "tafel_spiral3"],
      [12, "tafel_windup0"], [13, "tafel_windup1"], [14, "tafel_windup"], [15, "tafel_throw"],
      [16, "tafel_land0"], [17, "tafel_land1"], [18, "tafel_rest"], [19, "tafel_win"],
    ],
  },
  {
    // THE PENCILCASE STATES — batch-am3. shake + burst finally match the af3
    // person-cage identity (the old cells still showed the pre-af3 case with no
    // face — stage G's filed finding 3). Cell 2 is the continuity control (a
    // verbatim pencilcase_a copy, audited byte-similar in the lab) and is NOT
    // imported; cell 3 is the contract spare.
    file: "batch-am3/pencilcase_states.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, "pencilcase_shake"], [1, "pencilcase_burst"]],
    spares: [3],
  },
  {
    // THE RED CHALK, dust repaired — batch-am3 cell 0 replaces chalk_red whole:
    // the AM2 fix stick's dust read as cold white sparkle beside its five warm
    // powder siblings (stage G's report item 4). Same stick, warm dust.
    file: "batch-am3/chalk_red_dust.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, "chalk_red"]],
    spares: [1, 2, 3],
  },
  {
    // THE HERO, VERSION 2 — batch-ap. Full-body authored poses replacing the
    // composed part-rig for the core locomotion states (the override layer in
    // rigSpec.heroFullCell): a run cycle with real leg extension, a jump arc
    // that ends in a painted landing squash, per-state faces, and the ledge
    // teeter. Boxes are the measured figure windows (see header note 1);
    // the two teeter windows end at the ledge cut (header note 2).
    file: "batch-ap/hero_rig_v2.png", cols: 4, rows: 4, mode: "sprite",
    pieces: [
      [0, "hero2_run0", { box: [81, 54, 545, 495] }],
      [1, "hero2_run1", { box: [655, 83, 987, 491] }],
      [2, "hero2_run2", { box: [1103, 69, 1533, 494] }],
      [3, "hero2_run3", { box: [1584, 65, 1974, 464] }],
      [4, "hero2_jump", { box: [100, 574, 431, 1053] }],
      [5, "hero2_apex", { box: [567, 558, 994, 971] }],
      [6, "hero2_fall", { box: [1072, 599, 1471, 1033] }],
      [7, "hero2_land", { box: [1531, 765, 1979, 1057] }],
      [8, "hero2_idle", { box: [63, 1095, 459, 1517] }],
      [9, "hero2_det", { box: [561, 1098, 956, 1517] }], // determined face — imported, unwired (the run cells already carry determination)
      [10, "hero2_hit", { box: [1054, 1096, 1439, 1517] }],
      [11, "hero2_cheer", { box: [1544, 1098, 1957, 1517] }],
      [12, "hero2_teeter0", { box: [75, 1557, 483, 1800] }], // ledge cut at y=1800
      [13, "hero2_teeter1", { box: [623, 1564, 1023, 1800] }],
    ],
    spares: [14, 15],
  },
  {
    // THE CEREMONY PLATES — batch-ap. Door out (the chapter's biggest payoff,
    // finally its biggest picture), the score treasures, the rule pages
    // (imported as a spare for the Regel-Seiten lane; NOT declared anywhere
    // yet). Keyed but never trimmed: 1024×768 is the CSS aspect contract.
    file: "batch-ap/ceremony_plates.png", cols: 2, rows: 2, mode: "keyplate",
    pieces: [[0, "plate_ch01_door"], [1, "plate_ch01_score"], [2, "plate_ch01_rule"]],
    spares: [3],
  },
  {
    // THE PAINTED HUD MINIATURES — batch-ap. Consumed by PaintedIcon's
    // `hud_<name>` override: spark (the torn-paper letter — ch01's collectible
    // chip + legend icon), book, cage (standing open), knot. Three more are
    // imported but UNMAPPED, honestly: the star (no hint-chip call site yet),
    // the ink arrow (the world's ↑ cue is already hand-painted in code,
    // a2a7228), and the chalk clock (the "inkwell" icon's fiction is Klecks'
    // INK clock — a chalk ring would tell the wrong story). They wait for
    // call sites that read true.
    file: "batch-ap/hud_painted_set.png", cols: 4, rows: 2, mode: "sprite",
    pieces: [
      [0, "hud_spark"], [1, "hud_book"], [2, "hud_star"], [3, "hud_cage"],
      [4, "hud_knot"], [5, "hud_arrow"], [6, "hud_clock"],
    ],
    spares: [7],
  },
  {
    // THE ARMCHAIR BAND — batch-ap replaces l2_p4 whole: ten individually
    // painted chairs instead of one looped triple (round-1 boss finding,
    // routed to the art lane). Seam verified in the lab (wrap edge matches
    // row-for-row); size-asserted here; the L2 value-band audit re-judges it
    // the moment check-composition runs.
    file: "batch-ap/armchair_band_v2.png", cols: 1, rows: 1, mode: "band",
    pieces: [[0, "l2_p4"]],
    assertSize: [2048, 384],
    // MEASURED at first import: the new paint reads lum 21.3 % against L2's
    // machine-enforced window [14.0–21.0] — 0.3 points too bright. A uniform
    // 3 % darken (k=0.97) is import QA, not design change: same painting,
    // same chairs, landing at ≈20.7 % inside its own band. The band law is
    // parked-for-re-derivation by the architect; until then the band obeys it.
    darken: 0.97,
  },
  {
    // THE OPEN CAGE — batch-ap. The freed pencilcase's persistent state
    // (anim.ts renders open0 once the classmate is out); open1/open2 are the
    // opening flourish, imported for the overlay lane's beats.
    file: "batch-ap/cage_climax.png", cols: 4, rows: 1, mode: "sprite",
    pieces: [[0, "pencilcase_open0"], [1, "pencilcase_open1"], [2, "pencilcase_open2"]],
    spares: [3],
  },
];

const MIN_ALPHA = { sprite: 0.05, keyplate: 0.5, band: 0.1 };
const SPARE_MAX_ALPHA = 0.001;

// ── run ──────────────────────────────────────────────────────────────────────
const failures = [];
const written = [];
const spareLog = [];
fs.mkdirSync(path.join(ART_ROOT, KAPITEL), { recursive: true });
fs.mkdirSync(path.join(ART_ROOT, "hero"), { recursive: true });

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
    const ziel = zielFuer(stem, KAPITEL);
    fs.mkdirSync(ziel, { recursive: true });
    fs.writeFileSync(path.join(ziel, `${stem}.png`), PNG.sync.write(img));
    written.push({ stem, mode, w: img.width, h: img.height, alpha: share, from: sheet.file, ziel: path.basename(ziel) });
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
  console.error(`\nimport-batch-ap: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nimport-batch-ap: OK — ${written.length} stems from ${SHEETS.length} sheets`);
