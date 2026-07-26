#!/usr/bin/env node
// PB-C1 · THE PLACEHOLDER KIT — a DEV TOOL, not production art.
//
// Doc 36's geometry laws (five planes, carved mass anatomy, flush caps, the
// slide, complete platform objects) all have to be PROVEN before Batch AF
// exists. This generator emits one labelled flat-tone PNG per kit piece and
// per manifest slot, at the EXACT geometry the AF commission specifies, so
// PK-C2 is a drop-in re-point rather than a re-fit.
//
// Two properties make these more than coloured boxes:
//   1. every piece is STAMPED with its own stem name, so a screenshot answers
//      "is the cap flush?" / "did the corner land?" by reading the picture;
//   2. every piece is generated AT ITS LAW-MANDATED VALUE (doc 36 §1 bands),
//      so scripts/check-composition.mjs can arm its real thresholds NOW
//      instead of waiting for paint — the audit is red-capable from day one.
//
//   node scripts/gen-placeholder-kit.mjs            (writes + reports)
//   node scripts/gen-placeholder-kit.mjs --check    (verify on-disk == fresh)
//
// PK-C2 deletes the PNGs and re-points the manifest; this script stays.

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const CHECK = process.argv.includes("--check");

// ── a 5×7 bitmap font (stamping the stem name onto every piece) ──────────────
const FONT = {
  A: "01110 10001 10001 11111 10001 10001 10001", B: "11110 10001 11110 10001 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110", D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 11110 10000 10000 10000 11111", F: "11111 10000 11110 10000 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01110", H: "10001 10001 11111 10001 10001 10001 10001",
  I: "11111 00100 00100 00100 00100 00100 11111", J: "00111 00010 00010 00010 10010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001", L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001", N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110", P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101", R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110", T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110", V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001", X: "10001 01010 00100 00100 00100 01010 10001",
  Y: "10001 01010 00100 00100 00100 00100 00100", Z: "11111 00001 00010 00100 01000 10000 11111",
  0: "01110 10011 10101 10101 10101 11001 01110", 1: "00100 01100 00100 00100 00100 00100 01110",
  2: "01110 10001 00001 00110 01000 10000 11111", 3: "11110 00001 00001 01110 00001 00001 11110",
  4: "00010 00110 01010 10010 11111 00010 00010", 5: "11111 10000 11110 00001 00001 10001 01110",
  9: "01110 10001 10001 01111 00001 00001 01110",
  _: "00000 00000 00000 00000 00000 00000 11111", "-": "00000 00000 00000 11111 00000 00000 00000",
  " ": "00000 00000 00000 00000 00000 00000 00000",
};

// ── colour: pick RGB that lands on a TARGET RELATIVE LUMINANCE ───────────────
// The audit measures mean relative luminance (0.2126R+0.7152G+0.0722B over raw
// sRGB bytes) and HSV saturation. Generating against the same measure is what
// lets the thresholds be armed for real rather than waved through.
const hsv = (h, s, v) => {
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const [r, g, b] = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i];
  return [r, g, b];
};
const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** RGB at hue/saturation whose relative luminance is `targetPct` % of white. */
const toneAt = (hue, satPct, targetPct) => {
  let s = satPct / 100;
  for (let guard = 0; guard < 24; guard++) {
    const [r1, g1, b1] = hsv(hue, s, 1);
    const y1 = lum(r1 * 255, g1 * 255, b1 * 255);
    const v = targetPct / 100 / y1;
    if (v <= 1) {
      const [r, g, b] = hsv(hue, s, v);
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    s = Math.max(0, s - 0.05); // too dark at this saturation — desaturate
  }
  const t = Math.round((targetPct / 100) * 255);
  return [t, t, t];
};

const shade = ([r, g, b], f) => [
  Math.max(0, Math.min(255, Math.round(r * f))),
  Math.max(0, Math.min(255, Math.round(g * f))),
  Math.max(0, Math.min(255, Math.round(b * f))),
];

// ── the tiny raster ──────────────────────────────────────────────────────────
const make = (w, h) => {
  const png = new PNG({ width: w, height: h });
  png.data.fill(0);
  return png;
};
const px = (png, x, y, [r, g, b], a = 255) => {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const i = (png.width * (y | 0) + (x | 0)) << 2;
  png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = a;
};
const rect = (png, x0, y0, w, h, col, a = 255) => {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px(png, x, y, col, a);
};
/** keep = (x,y) → boolean; clears everything else to transparent */
const mask = (png, keep) => {
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (!keep(x, y)) png.data[((png.width * y + x) << 2) + 3] = 0;
    }
  }
};
const text = (png, str, x0, y0, scale, col) => {
  let x = x0;
  for (const ch of str.toUpperCase()) {
    const rows = (FONT[ch] ?? FONT[" "]).split(" ");
    rows.forEach((row, ry) => {
      [...row].forEach((bit, rx) => {
        if (bit === "1") rect(png, x + rx * scale, y0 + ry * scale, scale, scale, col);
      });
    });
    x += 6 * scale;
  }
};
/** Stamp the stem name (and PLACEHOLDER) so a screenshot is self-describing. */
const stamp = (png, name, col) => {
  const scale = Math.max(1, Math.round(Math.min(png.width / 5, png.height * 2) / 90));
  const label = name.replace(/^ph_/, "");
  const tw = label.length * 6 * scale;
  text(png, label, Math.max(2, (png.width - tw) / 2), Math.max(2, png.height / 2 - 4 * scale), scale, col);
  const s2 = Math.max(1, Math.round(scale * 0.6));
  text(png, "PLACEHOLDER", Math.max(2, (png.width - 11 * 6 * s2) / 2), Math.max(2, png.height / 2 + 6 * scale), s2, col);
};

// ── doc 36 §1 value bands: [hue, saturation %, luminance %] per role ─────────
const BAND = {
  l1: { sat: 22, lum: 79 },      // far shell: 70–88 % lum, ≤35 % sat
  l2: { sat: 38, lum: 55 },      // mid furniture: 45–65 % lum, ≤50 % sat
  fg: { sat: 30, lum: 27 },      // foreground: 15–40 % lum, ≤45 % sat
  crust: { sat: 55, lum: 52 },   // L3 play: full range, crisp
  body: { sat: 45, lum: 36 },
  fade: { sat: 40, lum: 21 },
  sediment: { sat: 32, lum: 11 },
  trim: { sat: 50, lum: 30 },
  slide: { sat: 46, lum: 44 },
  plat: { sat: 52, lum: 47 },
};
/** one hue per phase (the AF palette card), one per anatomy role */
const PHASE_HUE = { p1: 38, p2: 248, p3: 74, p4: 300, p9: 226 };
const ROLE_HUE = { body: 28, fade: 18, sediment: 232, edge: 12, corner: 350, incorner: 320, ramp: 96, slide: 152, plat: 196 };

const written = [];
const emit = (name, png) => {
  const buf = PNG.sync.write(png);
  const file = path.join(OUT, `${name}.png`);
  if (CHECK) {
    const same = fs.existsSync(file) && Buffer.compare(fs.readFileSync(file), buf) === 0;
    written.push({ name, ok: same });
    return;
  }
  fs.writeFileSync(file, buf);
  written.push({ name, ok: true });
};

// ── L1 · far-shell segments (AF: 1024×1260, UNKEYED, fully opaque) ───────────
for (const [phase, hue] of Object.entries(PHASE_HUE)) {
  for (const [i, tag] of ["a", "b"].entries()) {
    const png = make(1024, 1260);
    const base = toneAt(hue, BAND.l1.sat, BAND.l1.lum);
    rect(png, 0, 0, 1024, 1260, base);
    // big calm architecture fields — flat-on, no perspective (doc 36 §1)
    for (let k = 0; k < 4; k++) {
      rect(png, 60 + k * 240, 120 + i * 60, 170, 620, shade(base, 1.06));
      rect(png, 60 + k * 240, 740 + i * 40, 170, 40, shade(base, 0.9));
    }
    rect(png, 0, 980, 1024, 24, shade(base, 0.88)); // the high rail line
    rect(png, 0, 1240, 1024, 20, shade(base, 0.94)); // wainscot base
    stamp(png, `l1_${phase}_${tag}`, shade(base, 0.62));
    emit(`ph_l1_${phase}_${tag}`, png);
  }
}

// ── L2 · mid furniture bands (AF: 2048×384, KEYED, seamless loop) ────────────
for (const [phase, hue] of Object.entries(PHASE_HUE)) {
  if (phase === "p9") continue; // p9 carries no furniture band by design
  const png = make(2048, 384);
  const base = toneAt(hue, BAND.l2.sat, BAND.l2.lum);
  // silhouette-first furniture: shapes only, no black outlines (doc 36 §1)
  for (let k = 0; k < 8; k++) {
    const x = k * 256;
    const top = 96 + (k % 2) * 40;
    rect(png, x + 12, top, 232, 384 - top, base);
    rect(png, x + 12, top, 232, 10, shade(base, 1.22)); // one soft top rim-light
    rect(png, x + 104, top + 40, 48, 384 - top - 40, shade(base, 0.88));
  }
  stamp(png, `l2_${phase}`, shade(base, 1.5));
  emit(`ph_l2_${phase}`, png);
}

// ── L4 · the foreground fringe (sparse occluders only) ───────────────────────
{
  const png = make(2048, 384);
  const base = toneAt(120, BAND.fg.sat, BAND.fg.lum);
  for (let k = 0; k < 16; k++) {
    const x = k * 128;
    rect(png, x + 10, 384 - 150 - (k % 3) * 40, 46, 150 + (k % 3) * 40, base);
    rect(png, x + 70, 384 - 90, 30, 90, shade(base, 1.3));
  }
  stamp(png, "fg_fringe", shade(base, 2.1));
  emit("ph_fg_fringe", png);
}

// ── L3 · the shared interior: body ×2, fade, sediment (100 % OPAQUE) ─────────
for (const [name, band, hue, jitter] of [
  ["ph_mass_body_a", BAND.body, ROLE_HUE.body, 1],
  ["ph_mass_body_b", BAND.body, ROLE_HUE.body, 2],
  ["ph_mass_fade", BAND.fade, ROLE_HUE.fade, 1],
  ["ph_mass_sediment", BAND.sediment, ROLE_HUE.sediment, 1],
]) {
  const png = make(512, 512);
  const base = toneAt(hue, band.sat, band.lum);
  rect(png, 0, 0, 512, 512, base);
  // page/spine strata — tiles seamlessly in BOTH axes (no edge features)
  for (let y = 0; y < 512; y += 64) rect(png, 0, y + jitter * 8, 512, 6, shade(base, 0.84));
  for (let x = 0; x < 512; x += 128) rect(png, x + jitter * 12, 0, 5, 512, shade(base, 1.14));
  stamp(png, name, shade(base, 1.7));
  emit(name, png);
}

// ── L3 · per-phase crusts: loop A/B + FLUSH end caps (AF group 3) ────────────
for (const [phase, hue] of Object.entries(PHASE_HUE)) {
  const base = toneAt(hue, BAND.crust.sat, BAND.crust.lum);
  for (const tag of ["a", "b"]) {
    const png = make(512, 512);
    rect(png, 0, 0, 512, 512, base);
    rect(png, 0, 0, 512, 60, shade(base, 1.25)); // the lit walk course
    rect(png, 0, 440, 512, 72, shade(base, 0.7)); // where it meets the body
    if (tag === "b") rect(png, 180, 90, 150, 300, shade(base, 0.9));
    stamp(png, `crust_${phase}_${tag}`, shade(base, 0.55));
    emit(`ph_crust_${phase}_${tag}`, png);
  }
  for (const side of ["l", "r"]) {
    const png = make(512, 512);
    rect(png, 0, 0, 512, 512, base);
    rect(png, 0, 0, 512, 60, shade(base, 1.25));
    // the OUTER corner falls away; the INNER edge stays flush with the loop
    mask(png, (x, y) => (side === "l" ? x * 1.15 >= 512 - y : (512 - x) * 1.15 >= 512 - y));
    stamp(png, `cap_${side}`, shade(base, 0.55));
    emit(`ph_crust_${phase}_cap_${side}`, png);
  }
}

// ── L3 · edges, corners, ramps (AF: edges_corners.png, 8 cells) ──────────────
const trimTone = (hue) => toneAt(hue, BAND.trim.sat, BAND.trim.lum);
for (const side of ["l", "r"]) {
  const png = make(512, 512);
  const base = trimTone(ROLE_HUE.edge);
  rect(png, 0, 0, 512, 512, base);
  rect(png, side === "l" ? 0 : 400, 0, 112, 512, shade(base, 1.3));
  stamp(png, `edge_${side}`, shade(base, 1.9));
  emit(`ph_mass_edge_${side}`, png);
}
for (const side of ["bl", "br"]) {
  const png = make(512, 512);
  const base = trimTone(ROLE_HUE.corner);
  rect(png, 0, 0, 512, 512, base);
  const R = 512;
  mask(png, (x, y) => {
    const dx = side === "bl" ? x : R - x;
    const dy = R - y;
    return dx * dx + dy * dy <= R * R; // carved quarter round
  });
  stamp(png, side, shade(base, 1.9));
  emit(`ph_mass_corner_${side}`, png);
}
for (const side of ["l", "r"]) {
  const png = make(512, 512);
  const base = trimTone(ROLE_HUE.incorner);
  rect(png, 0, 0, 512, 512, base);
  mask(png, (x, y) => (side === "l" ? x + y <= 700 : 512 - x + y <= 700));
  stamp(png, `in_${side}`, shade(base, 1.9));
  emit(`ph_mass_incorner_${side}`, png);
}
for (const dir of ["up", "down"]) {
  const png = make(512, 512);
  const base = trimTone(ROLE_HUE.ramp);
  rect(png, 0, 0, 512, 512, base);
  rect(png, 0, 0, 512, 512, shade(base, 1.25));
  // the crust runs diagonally over a carved wedge
  mask(png, (x, y) => (dir === "up" ? y >= 512 - x : y >= x));
  for (let i = 0; i < 512; i++) {
    const y = dir === "up" ? 512 - i : i;
    for (let t = 0; t < 56; t++) px(png, i, y + t, shade(base, 0.72));
  }
  stamp(png, `ramp_${dir}`, shade(base, 0.5));
  emit(`ph_mass_ramp_${dir}`, png);
}

// ── L3 · the chalk slide (AF group 4: four 1024×512 modules) ─────────────────
for (const part of ["top", "mid", "foot"]) {
  const png = make(1024, 512);
  const base = toneAt(ROLE_HUE.slide, BAND.slide.sat, BAND.slide.lum);
  rect(png, 0, 0, 1024, 512, base);
  rect(png, 0, 0, 1024, 70, shade(base, 1.45)); // the glossy travel lip
  for (let k = 0; k < 12; k++) rect(png, k * 88 + 20, 150, 54, 12, shade(base, 1.6)); // chalk streaks
  rect(png, 0, 470, 1024, 42, shade(base, 0.72));
  if (part === "top") mask(png, (x, y) => y > 60 || x > 120);
  if (part === "foot") mask(png, (x, y) => y < 440 || x < 900);
  stamp(png, `slide_${part}`, shade(base, 0.45));
  emit(`ph_slide_${part}`, png);
}
{
  const png = make(512, 512);
  const base = toneAt(ROLE_HUE.slide, BAND.slide.sat, BAND.slide.lum * 0.62);
  rect(png, 0, 0, 512, 512, base);
  mask(png, (x, y) => y >= x); // the carved wedge beneath the chute
  stamp(png, "slide_under", shade(base, 2.0));
  emit("ph_slide_under", png);
}

// ── L3 · floating platform OBJECTS with drawn undersides (AF group 5) ────────
for (const [name, cells] of [["ph_plat_1", 1], ["ph_plat_2", 2]]) {
  const w = cells * 512;
  const png = make(w, 512);
  const base = toneAt(ROLE_HUE.plat, BAND.plat.sat, BAND.plat.lum);
  rect(png, 0, 96, w, 416, base);
  rect(png, 0, 96, w, 74, shade(base, 1.3)); // the standing top
  rect(png, 0, 430, w, 82, shade(base, 0.62)); // the drawn underside
  rect(png, 40, 512 - 30, 90, 30, shade(base, 0.5)); // a dangling corner
  rect(png, w - 130, 512 - 30, 90, 30, shade(base, 0.5));
  mask(png, (x, y) => y >= 96);
  stamp(png, name, shade(base, 0.45));
  emit(name, png);
}

// ── report ───────────────────────────────────────────────────────────────────
const bad = written.filter((f) => !f.ok);
if (CHECK) {
  if (bad.length > 0) {
    console.error(`gen-placeholder-kit --check: ${bad.length} file(s) DIFFER or are missing:`);
    for (const f of bad) console.error(`  ✗ ${f.name}`);
    process.exit(1);
  }
  console.log(`gen-placeholder-kit --check: OK — all ${written.length} placeholder pieces byte-identical to a fresh run`);
} else {
  console.log(`gen-placeholder-kit: wrote ${written.length} placeholder pieces → ${path.relative(process.cwd(), OUT)}`);
}
