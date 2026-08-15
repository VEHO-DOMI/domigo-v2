#!/usr/bin/env node
// PB-C1 · THE COMPOSITION GATE — doc 36 §4's four audits, in one command.
//
//   1 LAYER-VALUE   each plane's measured value/saturation + the depth ramp
//                   and the L2↔L3 separation law
//   2 COVERAGE      L0 + L1 cover the camera's travel box at BOTH extremes
//   3 NO-NAKED-FILL a kit-present phase renders zero engine fill rectangles
//   4 GLYPH         every trail letter renders its OWN character
//   5 AIR           every phase declares atmosphere, its haze covers the travel
//                   box, and nothing atmospheric enters the gameplay band
//   6 NO-METRONOME  no walk-course run repeats on a short cycle
//   7 ZONE PALETTE  every room is furnished out of its own box, that box can
//                   cover the ledge widths the room's own grid demands, and no
//                   single object furnishes more than two of a chapter's rooms
//   8 MIDDLE DIST.  every room with a furniture plane also has one BEHIND it,
//                   and that row's RENDERED value lands between the two planes
//   9 CHILD'S EDGE  the contour he carries separates him from his own room
//  11 EDGE COHERENCE  every joint of a carved mass — course, flank, body,
//                   corners — is one material: saturation and hue in family,
//                   the cut edge inside its signed carve window
//
// Everything is measured from the SOURCE PNGs and the pure planners, never
// from a rendered canvas: a WebGL canvas without preserveDrawingBuffer reads
// back all-black, so canvas sampling produces confident false negatives
// (Build-D banked exactly that). Arithmetic over the plan cannot lie the same
// way, runs in CI without a browser, and stays deterministic.
//
// Run: node scripts/check-composition.mjs   (exit 1 on any audit failure)

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { COMPOSITION, MARKER_H, MARKER_VISIBLE_MIN, heroEdgeFor, markerEdgeFor, markerPlacementFor, markerVisibleFraction, nearPlaneTint } from "../packages/game-paint/src/composition.ts";
import { HERO2_SRC_SCALE } from "../packages/game-paint/src/rigSpec.ts";
import { planLayers, planeCovers } from "../packages/game-paint/src/layers.ts";
import {
  BODY_DEEP_SHADE,
  BODY_HANDOVER_PAINTED,
  MIN_GRID_LOCK_DISTANCE,
  MIN_PAINT_PERIOD_CELLS,
  NO_METRONOME_MIN_PERIOD,
  TRIM_SHADE,
  claimedPlatformCells,
  crustGrain,
  floatingPlatformRuns,
  massGrain,
  nakedFills,
  paintScaleOf,
  planMass,
  shortestPeriod,
  surfaceSignature,
  tileAnchorFor,
  tileScaleFor,
  uncoveredSolids,
} from "../packages/game-paint/src/mass.ts";
import {
  SHAFT_EDGE_MAX,
  SHAFT_RINGS,
  SHAFT_SLICES,
  airFloor,
  hazeCovers,
  planBandShade,
  planHaze,
  planLife,
  planMotes,
  planShafts,
  shaftQuads,
} from "../packages/game-paint/src/air.ts";
import { letterGlyphs } from "../packages/game-paint/src/letters.ts";
import { TILE } from "../packages/game-paint/src/paint.ts";

const R = process.cwd();
const ART = path.join(R, "apps/web/public/art/g1/paint");
const CONTENT = path.join(R, "content/corpus/stories");

let failures = 0;
const fail = (audit, msg) => { failures++; console.error(`  ✗ [${audit}] ${msg}`); };
const note = (msg) => console.log(`    ${msg}`);

// ── art lookup ───────────────────────────────────────────────────────────────
const artFiles = new Map();
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) artFiles.set(e.name.replace(/\.png$/, ""), path.join(dir, e.name));
  }
};
walk(ART);

const pngCache = new Map();
const readPng = (stem) => {
  if (pngCache.has(stem)) return pngCache.get(stem);
  const file = artFiles.get(stem);
  const png = file ? PNG.sync.read(fs.readFileSync(file)) : null;
  pngCache.set(stem, png);
  return png;
};
const srcSize = (stem) => {
  const png = readPng(stem);
  return png ? { w: png.width, h: png.height } : null;
};

// ── the measure: relative luminance + HSV saturation over VISIBLE pixels ─────
const lumOf = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const satOf = (r, g, b) => {
  const max = Math.max(r, g, b);
  return max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
};
const measureStems = (stems) => {
  let n = 0;
  let lum = 0;
  let sat = 0;
  for (const stem of stems) {
    const png = readPng(stem);
    if (!png) return null;
    for (let y = 0; y < png.height; y += 3) {
      for (let x = 0; x < png.width; x += 3) {
        const i = (png.width * y + x) << 2;
        if (png.data[i + 3] < 128) continue;
        lum += lumOf(png.data[i], png.data[i + 1], png.data[i + 2]);
        sat += satOf(png.data[i], png.data[i + 1], png.data[i + 2]);
        n++;
      }
    }
  }
  return n === 0 ? null : { lum: (lum / n) * 100, sat: (sat / n) * 100, samples: n };
};
const measureColors = (colors) => {
  const lum = colors.reduce((s, c) => s + lumOf((c >> 16) & 255, (c >> 8) & 255, c & 255), 0) / colors.length;
  const sat = colors.reduce((s, c) => s + satOf((c >> 16) & 255, (c >> 8) & 255, c & 255), 0) / colors.length;
  return { lum: lum * 100, sat: sat * 100, samples: colors.length };
};

/**
 * doc 36 §1 **v1.1** — ARMED. The bands are multiples of the phase's declared
 * KEY (the luminance of its air), so one law governs a sunlit hall and an
 * ink-black dream; at K=88 they reproduce v1.0's absolute numbers exactly.
 * L3 is K-exempt (lit figures against a dark room are the point), and the
 * L2↔L3 separation stays ABSOLUTE — readability never scales down.
 * Saturation caps stay absolute as tabled.
 */
const bandsFor = (K) => ({
  L0: [0.93 * K, Math.min(1.08 * K, 96), 20],
  L1: [0.80 * K, 1.00 * K, 35],
  L2: [0.50 * K, 0.75 * K, 50],
  L4: [0, 0.45 * K, 45],
});

/**
 * R5-W4 · A6 · THE COHERENCE LIMITS, and where each number comes from.
 *
 * Calibrated the way loop 3 calibrates anything: against the ONE kit in this
 * chapter that is commissioned, delivered, gated and accepted art — p1's, after
 * today's AS3 edge import — and stated with its margin, not fitted to it.
 * Every figure below is a measurement this audit prints, not an estimate.
 *
 *                      p1 (delivered art)   placeholder rooms      limit
 *   ΔS  worst joint          22.4            22.5 · 24.3 · 36.7     25
 *   ΔH  worst joint           15°            137° · 138° · 140°     25°
 *   carve (trim − body)   +8.4 / +8.2       −1.9 / −2.0          +2…+14
 *   ΔL under one light       ≤10             ≤10                    10
 *
 * ΔS carries the widest margin and it is the one that needs explaining: of p1's
 * 22.4 on crust↔body, roughly twelve points are `nearPlaneTint` rather than the
 * paint — multiplying a warm colour by (0.586, 0.640, 0.784) compresses its
 * red-to-blue spread, so the walk course is drawn greyer than it was painted.
 * That is a side effect of a declared law, not a fault of the kit, and a limit
 * tighter than 25 would fail commissioned art for the engine's own doing. It is
 * filed rather than fixed: the doc says the near plane is "cooler than it is
 * dark", and it is also flatter, which nobody wrote down.
 *
 * What the limits still catch, with room to spare, is the entire shipped
 * placeholder set: 137–140° of hue between a warm cream trim and a violet walk
 * course, and a carve of −2.0 — a cut edge drawn DARKER than the face it is cut
 * into, which is a groove, not an edge. That is Koki's sentence in numbers.
 */
const COHERENCE_MAX = { ds: 25, dh: 25, dlSameLight: 10, carve: [2, 14] };

/**
 * ── ★ A HOLE THIS LAW HAS, STATED RATHER THAN PAPERED OVER ──────────────────
 * This audit judges MEANS, plus hue and saturation. It passed p1's freshly
 * imported trims at carve +8.4 — and a blind critic then found that the same
 * flank drew (255, 255, 254) at the walking-surface row, "brighter than the
 * sunlit window behind it". The defect lived at the top of the histogram:
 *
 *            mean     p95      max
 *   body     46.01   84.27    87.1
 *   trim     55.09   92.74   100.0
 *
 * A 95th-percentile rule was written to catch it and then DELETED, because its
 * own selftest proved it could not discriminate: a trim legitimately sitting +8
 * in the mean carries its whole distribution up by +8, so its p95 gap is the
 * same as a blown one's (+9.7 in both fixtures). The quantity that separates
 * them is not a gap — it is CLIPPING, the sheet reaching pure white and ceasing
 * to hold material.
 *
 * Shipping a check that fires on good art is worse than an honest gap, so the
 * finding is filed (D-190) and the guard that actually caught it is named for
 * what it is: a fresh pair of eyes with the frame in front of them.
 */

/**
 * ── THE COHERENCE WAIVERS ARE A SEPARATE TABLE, AND THEIR EXPIRY IS REAL ─────
 * Two laws, two tables: `SEPARATION_WAIVERS` stays empty, as A5 left it. This
 * one is its own, because a room can be perfectly readable (that law) and still
 * be assembled out of mismatched parts (this one), and a single table would let
 * an exception bought for one buy silence on the other.
 *
 * The difference that matters is in the `until` field. `SEPARATION_WAIVERS`
 * carried its expiry in prose — "until the F2 l2_p4 touch-up" — and nothing
 * could check it; A5 had to notice by hand that it was spent. Here the date is a
 * date, `waiverExpired` reads it, and the audit turns red on the day. The house
 * already has this pattern where it matters: `composition.ts#PLACEHOLDER_UNTIL`,
 * enforced in `check-paint-art.mjs`.
 *
 * AND THE EXCEPTION BUYS A STRICTER DUTY, not a quiet pass: every room named
 * here must appear in `SPEC_MASSEN_KIT.md` §10 with its cells, its measurements
 * and its colour family — the commission that will end it. A waiver without an
 * order behind it is just the defect with paperwork.
 */
const COHERENCE_WAIVERS = {
  // ── THE FOUR UNPAINTED ROOMS ───────────────────────────────────────────────
  // After Koki's ruling of 2026-08-15 the shared trims wear a derived colour
  // (`mass.ts#TRIM_SHADE`) instead of a grey multiply, and it moved every number
  // a tint can move: p2's worst saturation gap fell 22.9 → 3.5, p4's 36.7 → 15.5,
  // and the carve went from −1.9 (a groove) to +8.3 in all four rooms.
  //
  // What is left is identical in all four and is the reason each waiver exists:
  // the walk course is painted for its room and THE BODY UNDER IT IS NOT. p2 and
  // p9 draw a violet course over the shared warm book paper — 138° and 139° of
  // hue — p4 a stage-red one at 56°, and p3 a course 40.8 points flatter than
  // the paper it lies on. No trim tint reaches a body sheet. Only AS5 does.
  //
  // The order that ends these is SPEC_MASSEN_KIT §10, written this session with
  // the measurements below in it. That is what the exception buys: not silence,
  // a commission.
  "ch01/p2": { until: "2026-09-30", why: "Nachtklassenraum zieht den geteilten warmen Buchkörper unter einem violetten Laufkurs — AS5 §10 malt ihm seinen eigenen" },
  "ch01/p3": { until: "2026-09-30", why: "Hof-Laufkurs ist 40,8 Punkte flacher gesättigt als das geteilte Papier darunter — AS5 §10" },
  "ch01/p4": { until: "2026-09-30", why: "Bühnen-Laufkurs steht 56° vom geteilten Körper ab — AS5 §10" },
  "ch01/p9": { until: "2026-09-30", why: "Kleckskammer zieht denselben warmen Körper unter einem tintigen Laufkurs — AS5 §10" },
};

/** an expiry that is a DATE, not a sentence */
const waiverExpired = (w) => {
  const until = Date.parse(`${w.until}T23:59:59Z`);
  return Number.isNaN(until) || Date.now() > until;
};

// ── the levels under audit ───────────────────────────────────────────────────
const phases = [];
for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
  const dir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".level.json"))) {
    const level = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (level.draft === true) continue;
    const all = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
    for (const ph of all) {
      const spec = COMPOSITION[level.chapter]?.[ph.id] ?? null;
      phases.push({ label: `${level.chapter}/${ph.id}`, ph, spec });
    }
  }
}
const withSpec = phases.filter((p) => p.spec !== null);
if (withSpec.length === 0) fail("setup", "no phase carries a composition manifest — the audits would pass vacuously");

// ── 1 · LAYER-VALUE ──────────────────────────────────────────────────────────
console.log("1 · layer-value audit (doc 36 §1)");
for (const { label, ph, spec } of withSpec) {
  // L3 per the law's own definition: "terrain masses, entities, interactive
  // props — the ONLY full-contrast plane". Terrain alone would understate it.
  const entityStems = [...new Set(ph.entities.map((e) => `${e.skin}_a`))].filter((s) => artFiles.has(s));
  // R5-A3 · L3 IS MEASURED AS IT SHIPS, NOT AS IT WAS PAINTED.
  //
  // The walk course now wears the near-plane push in every room (PaintScene,
  // NEAR_PLANE_KINDS) — that is the repair for B1's „keine materielle Trennung
  // zwischen dem, worauf man stehen kann, und dem, was nur gemalt ist". Measured
  // off the source PNGs alone, L3 would keep reporting the UNPUSHED course, and
  // the L2↔L3 separation — the one absolute readability law in this file — would
  // go on passing on a number the build no longer draws.
  //
  // So the course's contribution is weighted by the push it actually wears, and
  // the rest of L3 (the mass below the standing line, and the beings, neither of
  // which is pushed) is left alone. Sample-count weighting keeps it exact.
  const nearPush = lumOf(
    (nearPlaneTint(spec.key) >> 16) & 255,
    (nearPlaneTint(spec.key) >> 8) & 255,
    nearPlaneTint(spec.key) & 255,
  );
  const course = measureStems([...spec.mass.crust]);
  const rest = measureStems([...spec.mass.body, ...(spec.mass.bodyDeep ?? []), ...spec.mass.fade, spec.mass.sediment, ...entityStems]);
  const L3 = course && rest
    ? {
      lum: (course.lum * nearPush * course.samples + rest.lum * rest.samples) / (course.samples + rest.samples),
      sat: (course.sat * course.samples + rest.sat * rest.samples) / (course.samples + rest.samples),
      samples: course.samples + rest.samples,
    }
    : measureStems([...spec.mass.crust, ...spec.mass.body, ...(spec.mass.bodyDeep ?? []), ...spec.mass.fade, spec.mass.sediment, ...entityStems]);
  const planes = {
    L0: measureColors([...spec.wash.colors]),
    L1: measureStems(spec.far.segments),
    L2: spec.mid ? measureStems(spec.mid.segments) : null,
    L3,
    L4: spec.fg ? measureStems(spec.fg.segments) : null,
  };
  const K = spec.key;
  // R5-W3 · A5 · THE ARENA'S WAIVER IS SPENT — the table is empty on purpose.
//
// Fable, PK-C2b, granted one: „the arena is a single-screen stage whose only
// hostile is the high-contrast guardian; l2_p4 gets a one-sheet darken in the
// F2 art touch-up, then this entry is deleted and the law re-arms." The darken
// happened — not on l2_p4 but on the sheet that took its place at the front of
// the room, `band_p4_audience` (R15, `scripts/set-plane-value.mjs`) — and the
// arena now clears the law on its own numbers: 12.7 points against the 12 it
// asks for. So the entry is gone and ch01/p4 is guarded like every other room.
//
// It stays a table rather than becoming a boolean because the shape is the
// point: a waiver is a named room with a written reason and an expiry, never a
// quiet `if`. The next one that is needed will be visible here.
const SEPARATION_WAIVERS = {};

const BANDS = bandsFor(K);
  for (const [name, m] of Object.entries(planes)) {
    if (m === null && (name === "L0" || name === "L1" || name === "L3")) {
      fail("layer-value", `${label} ${name}: art missing — cannot measure`);
      continue;
    }
    if (m === null) continue;
    const band = BANDS[name];
    if (!band) { note(`${label} ${name}: lum ${m.lum.toFixed(1)}% · sat ${m.sat.toFixed(1)}%  [K-exempt]`); continue; }
    const [lo, hi, satCap] = band;
    const lumOk = m.lum >= lo - 0.05 && m.lum <= hi + 0.05;
    const satOk = m.sat <= satCap + 0.05;
    const tag = `[v1.1 @K=${K}: ${lo.toFixed(1)}–${hi.toFixed(1)}%, sat ≤${satCap}%]`;
    if (!lumOk) fail("layer-value", `${label} ${name}: lum ${m.lum.toFixed(1)}% is OUTSIDE its band ${tag}`);
    else note(`${label} ${name}: lum ${m.lum.toFixed(1)}% · sat ${m.sat.toFixed(1)}%  ${tag} lum in band${satOk ? "" : " — SATURATION OVER CAP (reported)"}`);
  }
  // ARMED: the depth ramp — v1.1 makes the L1↔L2 gap relative to the key,
  // because atmospheric dark phases may separate by silhouette instead
  if (planes.L1 && planes.L2) {
    const gap = planes.L1.lum - planes.L2.lum;
    if (gap < 0.10 * K) {
      fail("layer-value", `${label}: L1↔L2 gap ${gap.toFixed(1)}% < the law's 0.10·K (${(0.10 * K).toFixed(1)}%) — the far shell must stay lifted above the furniture`);
    }
  }
  // ARMED and ABSOLUTE: enemies must never camouflage against furniture
  if (planes.L2 && planes.L3) {
    const dLum = Math.abs(planes.L2.lum - planes.L3.lum);
    const dSat = Math.abs(planes.L2.sat - planes.L3.sat);
    if (dLum < 12 && dSat < 25) {
      if (SEPARATION_WAIVERS[label]) { note(`${label}: L2-L3 separation WAIVED: ${SEPARATION_WAIVERS[label]}`); } else fail("layer-value", `${label}: L2↔L3 separation ${dLum.toFixed(1)}% lum / ${dSat.toFixed(1)}% sat — the law needs ≥12% or ≥25% (ABSOLUTE; readability never scales down)`);
    } else {
      note(`${label} L2↔L3 separation: ${dLum.toFixed(1)}% lum · ${dSat.toFixed(1)}% sat — PASS`);
    }
  }
  // R5-N3 · A4 · THE DEEP ROW IS A MEASUREMENT, NOT A PREFERENCE.
  // `BODY_DEEP_SHADE` divides the depth multiply so the composed fall stays
  // smooth while the darkness moves into pigment. That only holds while the
  // shipped deep row really is that much darker than the body — so the constant
  // is re-derived from the art here. Repaint the deep row and this says so,
  // instead of the ramp quietly double-darkening a whole band.
  if (spec.mass.bodyDeep) {
    const shallow = measureStems([...spec.mass.body]);
    const deep = measureStems([...spec.mass.bodyDeep]);
    const paper = measureStems([...spec.mass.fade]);
    if (shallow && deep) {
      const ratio = deep.lum / shallow.lum;
      const drift = Math.abs(ratio - BODY_DEEP_SHADE);
      if (drift > 0.03) {
        fail("layer-value", `${label}: the painted deep row is ${(ratio * 100).toFixed(1)}% of the body, but BODY_DEEP_SHADE says ${(BODY_DEEP_SHADE * 100).toFixed(1)}% — the depth ramp would ${ratio < BODY_DEEP_SHADE ? "double-darken" : "under-darken"} the lower body band`);
      } else {
        note(`${label} deep-row pigment: ${(ratio * 100).toFixed(1)}% of body (constant ${(BODY_DEEP_SHADE * 100).toFixed(1)}%, drift ${(drift * 100).toFixed(1)} pts) — PASS`);
      }
    }
    // …and where that band has to ARRIVE: on the fade paper's own value. The
    // handover is art, not a universal constant (D-50) — so it is re-derived
    // here, and a repaint that moves either sheet reopens the seam loudly.
    if (deep && paper) {
      const want = BODY_DEEP_SHADE * (paper.lum / deep.lum);
      const drift = Math.abs(want - BODY_HANDOVER_PAINTED);
      if (drift > 0.02) {
        fail("layer-value", `${label}: the body band should hand over at ${want.toFixed(3)} to land on its own fade paper (${paper.lum.toFixed(2)}%), but BODY_HANDOVER_PAINTED says ${BODY_HANDOVER_PAINTED} — the band change would show as an edge`);
      } else {
        note(`${label} body→fade handover: ${want.toFixed(3)} derived from the art (constant ${BODY_HANDOVER_PAINTED}, drift ${drift.toFixed(3)}) — PASS`);
      }
    }
  }
}

// ── 2 · COVERAGE ─────────────────────────────────────────────────────────────
console.log("2 · coverage audit (doc 36 §4.2)");
for (const { label, ph, spec } of withSpec) {
  const worldW = (ph.rows[0]?.length ?? 0) * TILE;
  const worldH = ph.rows.length * TILE;
  const pieces = planLayers(spec, worldW, worldH, srcSize);
  for (const plane of ["L0", "L1"]) {
    const own = pieces.filter((p) => p.plane === plane);
    if (own.length === 0) { fail("coverage", `${label} ${plane}: nothing planned`); continue; }
    if (!planeCovers(own, worldW, worldH, "both")) {
      fail("coverage", `${label} ${plane}: does NOT cover the camera travel box — the page shows through`);
    }
  }
  note(`${label}: ${pieces.length} plane pieces over a ${worldW}×${worldH} px world — covered`);
}

// ── 3 · NO-NAKED-FILL ────────────────────────────────────────────────────────
console.log("3 · no-naked-fill audit (doc 36 §4.3)");
for (const { label, ph, spec } of withSpec) {
  const missing = [...spec.mass.crust.slice(0, 1), spec.mass.body[0], spec.mass.fade[0], spec.mass.sediment].filter((s) => !artFiles.has(s));
  if (missing.length > 0) { fail("no-naked-fill", `${label}: mass kit art missing (${missing.join(", ")}) — the phase would fall back to flat fills`); continue; }
  const plan = planMass(ph.rows, spec.mass, srcSize);
  const naked = nakedFills(plan);
  const holes = uncoveredSolids(ph.rows, plan);
  if (naked.length > 0) fail("no-naked-fill", `${label}: ${naked.length} naked fill cell(s), first at (${naked[0].c},${naked[0].r})`);
  if (holes.length > 0) fail("no-naked-fill", `${label}: ${holes.length} solid cell(s) with NO mass covering them, first at (${holes[0].c},${holes[0].r}) — the wash shows through the ground`);
  if (naked.length === 0 && holes.length === 0) {
    const solids = ph.rows.join("").split("").filter((g) => g === "#" || g === "~").length;
    note(`${label}: 0 naked fills, 0 uncovered solids across all ${solids} solid cells (full world, not one screen)`);
  }
}

// ── 4 · GLYPH ────────────────────────────────────────────────────────────────
console.log("4 · glyph audit (doc 36 §4.4)");
for (const { label, ph, spec } of withSpec) {
  const glyphs = letterGlyphs(ph.rows, spec.words);
  const cells = ph.rows.join("").split("*").length - 1;
  if (glyphs.length !== cells) { fail("glyph", `${label}: ${cells} letter cells but ${glyphs.length} glyphs planned`); continue; }
  if (cells === 0) { note(`${label}: no trail letters`); continue; }
  // R5-P1: the trail must spell its word COMPLETELY — letterGlyphs truncates
  // silently, so 10 word-letters over 9 cells shipped "DESKPENCI" with no red
  // (found live in H2: the p2 cells wore stale faces).
  const word = (spec.words ?? []).join("").toUpperCase();
  if (word && word.length !== cells) { fail("glyph", `${label}: trail word "${word}" has ${word.length} letters but the phase carries ${cells} cells — the trail would spell a truncated or padded word`); continue; }
  const bad = glyphs.filter((g) => !/^[A-Z]$/.test(g.char));
  if (bad.length > 0) { fail("glyph", `${label}: ${bad.length} letter(s) render no real character`); continue; }
  const distinct = new Set(glyphs.map((g) => g.char)).size;
  if (cells > 1 && distinct < 2) fail("glyph", `${label}: all ${cells} letters render the SAME character — the pre-C1 "everything is an A" defect`);
  else note(`${label}: ${cells} letters, ${distinct} distinct characters (${glyphs.map((g) => g.char).join("")})`);
}

// ── 5 · AIR (PK-R6 · H1, round-1 critique findings 2 · 4 · 5) ────────────────
// The engine-drawn depth between the painted planes (air.ts). Three things can
// go wrong and all three are silent in a screenshot: a phase forgets to declare
// any atmosphere at all and reads flat again; the haze is sized to one screen
// and draws a vertical seam down the wall halfway through the level (Build-D's
// F-6, one plane over); or a beam or a mote drifts down into the gameplay band
// and sits on top of a hostile — which turns a readability fix into a
// readability defect.
console.log("5 · air audit (doc 36 §1 + doc 44 B14)");
/** a full mote drift cycle, sampled — a clamp that only holds at tick 0 is no clamp */
const AIR_TICKS = [0, 31, 63, 95, 127, 159, 189, 601];
for (const { label, ph, spec } of withSpec) {
  const worldW = (ph.rows[0]?.length ?? 0) * TILE;
  const worldH = ph.rows.length * TILE;
  if (!spec.air) { fail("air", `${label}: declares no atmosphere — the phase reads as one flat plane (doc 36 §1)`); continue; }
  const air = spec.air;
  const haze = planHaze(air, worldW, worldH);
  if (!hazeCovers(haze, worldW, worldH)) {
    fail("air", `${label}: the haze does NOT cover the camera's travel box — it would draw a seam down the wall`);
  }
  const floor = airFloor(air, worldH);
  if (!(floor > 0 && floor < worldH)) fail("air", `${label}: air band ${air.band} is not a fraction of the world`);
  let below = 0;
  for (const s of planShafts(air, worldW, worldH)) {
    for (const [, y] of s.points) if (y > floor + 0.001) below++;
  }
  let moteCount = 0;
  for (const t of AIR_TICKS) {
    for (const m of planMotes(air, worldW, worldH, t)) {
      moteCount++;
      if (m.y > floor + 0.001) below++;
    }
  }
  if (below > 0) fail("air", `${label}: ${below} atmospheric point(s) reach INTO the gameplay band (below y=${floor.toFixed(0)})`);
  if (air.vignette > 0.5) fail("air", `${label}: vignette ${air.vignette} closes more than half the frame`);
  // PK-R6 · H2 (round-2 finding 5): a beam may have NO visible edge — not at its
  // sides and not at its foot. Both are measured on the pieces the renderer
  // actually fills, and both were legible before this round: the old drawing put
  // 0.034 on p4's outermost lateral step and ended the beam at full strength.
  for (const s of planShafts(air, worldW, worldH)) {
    const quads = shaftQuads(s);
    if (quads.length !== SHAFT_RINGS * SHAFT_SLICES) {
      fail("air", `${label}: a beam draws ${quads.length} pieces, not ${SHAFT_RINGS}×${SHAFT_SLICES}`);
      continue;
    }
    // the rim is ONE piece (nothing is drawn outside ring 0, so what the eye
    // meets there is that piece's own opacity) — but the foot is the whole STACK:
    // every ring overlaps at the beam's centre, so the accumulated alpha is what
    // draws the horizontal cut. Reading one piece there passed a beam with no
    // length falloff at all (tamper-proven, PK-R6 H2).
    const rim = Math.max(...quads.filter((q) => q.ring === 0).map((q) => q.alpha));
    const foot = quads.filter((q) => q.slice === SHAFT_SLICES - 1).reduce((t, q) => t + q.alpha, 0);
    if (rim > SHAFT_EDGE_MAX) fail("air", `${label}: a beam's outer edge is ${rim.toFixed(3)} opaque (> ${SHAFT_EDGE_MAX}) — that is a visible straight edge`);
    if (foot > SHAFT_EDGE_MAX) fail("air", `${label}: a beam ENDS at ${foot.toFixed(3)} opacity (> ${SHAFT_EDGE_MAX}) — light does not stop, it runs out`);
    // and no subdivision may leave the quad the plan clamped into the air band
    for (const q of quads) for (const [, y] of q.points) if (y > floor + 0.001) below++;
  }
  // …the leaves, which live BELOW the air band on purpose, and must stay inside
  // the band they declare and behind the whole gameplay layer
  if (air.life) {
    const [lo, hi] = air.life.band;
    if (!(lo > air.band && hi <= 1)) {
      fail("air", `${label}: life band [${lo}, ${hi}] must start below the air band (${air.band}) and end inside the world`);
    }
    let stray = 0;
    for (const t of AIR_TICKS) {
      for (const l of planLife(air, worldW, worldH, t)) {
        if (l.y < lo * worldH - 12 || l.y > hi * worldH + 12) stray++;
        if (l.depth >= 0) stray++; // a leaf in front of the play plane is a defect
      }
    }
    if (stray > 0) fail("air", `${label}: ${stray} leaf/leaves left their band or their plane`);
    else note(`${label}: ${air.life.count} leaves in [${lo}, ${hi}] of the world, all behind the play plane`);
  }
  // …and the shadow at the furniture's foot: inside its own band, never below it
  const shade = planBandShade(spec.mid, worldW, worldH);
  if (spec.mid && shade === null) fail("air", `${label}: a furniture band with no shadow at its foot (finding 9)`);
  if (shade !== null) {
    const bandBottom = worldH - (spec.mid.lift ?? 0);
    if (Math.abs(shade.y + shade.h - bandBottom) > 0.001) {
      fail("air", `${label}: the band shade ends at ${(shade.y + shade.h).toFixed(1)}, its band at ${bandBottom.toFixed(1)}`);
    }
  }
  const shafts = planShafts(air, worldW, worldH).length;
  note(`${label}: haze ${(air.haze * 100).toFixed(0)}% · ${shafts} shaft(s) · ${moteCount / AIR_TICKS.length} motes · vignette ${(air.vignette * 100).toFixed(0)}% — all above y=${floor.toFixed(0)} of ${worldH}`);
}

// ── 6 · NO-METRONOME (round-1 critique, finding 1 — CRITICAL) ────────────────
// „The 'stacked books' floor strip repeats identically with a hard seam every
// few units, reading as a wallpaper tile rather than hand-painted ground."
//
// Measured over the REAL grids, in two questions, because either one alone can
// be satisfied by a floor that still reads as wallpaper:
//   · CYCLE — does the run's per-cell fingerprint (painted variant · value ·
//     grain) repeat on a cycle short enough to see? This catches the original
//     defect, where one tileSprite printed one identical cell forever (period 1).
//   · VARIETY — how many DIFFERENT cells does the run actually hold? This is the
//     question the cycle test cannot answer on a short run: alternating two
//     variants over a 41-cell hall never repeats exactly, and still gives the eye
//     only two things to look at. A run must offer roughly one new look every
//     five cells, and never fewer than three in total.
//
// Both surfaces are audited, not just the walkable one. The browser proof of p1
// is why: the COURSE was already varying while the mass below it — four times as
// much of the frame — was a single 656-px tileSprite of one variant. An audit
// that only looked where the fix had been applied would have called that green.
console.log("6 · no-metronome audit (mass.ts NO_METRONOME_MIN_PERIOD)");
for (const { label, ph, spec } of withSpec) {
  const claimed = claimedPlatformCells(ph.rows);
  const plan = planMass(ph.rows, spec.mass, srcSize);
  const surfaces = [
    ["course", surfaceSignature(plan, ["crust"], crustGrain(ph.rows, claimed))],
    ["mass", surfaceSignature(plan, ["body", "fade", "sediment"], massGrain(ph.rows, claimed))],
  ];
  for (const [what, sigs] of surfaces) {
    let worst = Infinity;
    let worstAt = "";
    let leanest = Infinity;
    let audited = 0;
    for (const [at, sig] of sigs) {
      if (sig.length <= NO_METRONOME_MIN_PERIOD) continue; // too short to hold a beat
      audited++;
      const p = shortestPeriod(sig);
      if (p < worst) { worst = p; worstAt = `${at} (${sig.length} cells)`; }
      if (p <= NO_METRONOME_MIN_PERIOD) {
        fail("no-metronome", `${label}: the ${what} at ${at} repeats every ${p} cell(s) — that is wallpaper, not ground`);
      }
      const distinct = new Set(sig).size;
      const want = Math.max(3, Math.ceil(sig.length / 5));
      leanest = Math.min(leanest, distinct - want);
      if (distinct < want) {
        fail("no-metronome", `${label}: the ${what} at ${at} draws only ${distinct} different cell(s) over ${sig.length} — the eye needs ≥ ${want}`);
      }
    }
    if (audited === 0) note(`${label} ${what}: no run long enough to hold a beat`);
    else note(`${label} ${what}: ${audited} long run(s) · shortest repeat cycle ${worst} cells at ${worstAt} (law: > ${NO_METRONOME_MIN_PERIOD}) · leanest variety +${leanest}`);
  }
}

// ── 7 · ZONE PALETTE (round-1 critique, finding 8) ───────────────────────────
// „The same book-stack shelf silhouette and proportions appear in both the
// entrance hall and classroom." Two questions, both checkable: does each room
// draw its own set, and can that set actually cover the ledge widths its own
// grid asks for? (A palette missing a 1-cell object turns every 3-cell ledge
// into an object hanging a cell over the edge.)
console.log("7 · zone-palette audit (doc 36 §2 · complete objects)");
const paletteSeen = new Map();
for (const { label, ph, spec } of withSpec) {
  const widths = new Set(spec.mass.platObjects.map((p) => p.cells));
  const runWidths = new Set(floatingPlatformRuns(ph.rows).map((r) => r.c1 - r.c0 + 1));
  for (const need of runWidths) {
    // widest-first cover: a run is coverable iff every remainder can be met
    let left = need;
    let guard = 0;
    while (left > 0 && guard++ < 32) {
      const pick = [...widths].filter((x) => x <= left).sort((a, b) => b - a)[0];
      if (pick === undefined) break;
      left -= pick;
    }
    if (left !== 0) fail("zone-palette", `${label}: its palette cannot cover a ${need}-cell ledge exactly (widths ${[...widths].join("/")})`);
  }
  const fingerprint = [...spec.mass.platObjects.map((p) => p.stem)].sort().join("|");
  const twin = paletteSeen.get(fingerprint);
  if (twin !== undefined) fail("zone-palette", `${label} and ${twin} are furnished out of the identical box — each space must read as designed for what happens in it`);
  else paletteSeen.set(fingerprint, label);
  note(`${label}: ${spec.mass.platObjects.length} object(s) for ledge widths ${[...runWidths].sort().join("/") || "none"}`);
}

// PK-R6 · H2 (round-2 finding 12): „the same book-stack desk/bench silhouette
// appears in 01, 02 and 03, differing only by colour grading." H1's identical-box
// test could not catch that — the boxes DIFFERED, they merely overlapped, and an
// object standing in three of five rooms is a template whatever the other slots
// hold. A motif may be quoted once. Twice is furniture. Three times is a stamp.
const ROOM_REUSE_MAX = 2;
const stemRooms = new Map();
for (const { label, spec } of withSpec) {
  for (const o of spec.mass.platObjects) {
    if (!stemRooms.has(o.stem)) stemRooms.set(o.stem, []);
    stemRooms.get(o.stem).push(label);
  }
}
for (const [stem, rooms] of [...stemRooms].sort()) {
  if (rooms.length > ROOM_REUSE_MAX) {
    fail("zone-palette", `${stem} furnishes ${rooms.length} rooms (${rooms.join(", ")}) — the law allows ${ROOM_REUSE_MAX}`);
  }
}
note(`reuse: ${[...stemRooms].filter(([, r]) => r.length > 1).map(([s, r]) => `${s}×${r.length}`).join(" · ") || "every object stands in exactly one room"}`);

// ── 8 · MIDDLE DISTANCE (round-2 finding 8) ──────────────────────────────────
// „All four scenes are built from essentially two flat planes … with no softened
// midground layer anywhere, so depth reads as a stage backdrop rather than a
// world." The third plane is the same furniture standing further back, and the
// only thing that makes that read as DEPTH rather than as a small second band is
// its rendered value — so that is what is measured, through the blend the
// renderer actually performs: alpha·row + (1−alpha)·the lit shell behind it.
console.log("8 · middle-distance audit (doc 36 §1, PK-R6 H2 amendment)");
for (const { label, spec } of withSpec) {
  if (!spec.mid) { note(`${label}: no furniture plane — none owed (p9's own AF sheet: „atmosphere, not architecture")`); continue; }
  const far = spec.midFar;
  if (!far) { fail("middle-distance", `${label}: a furniture plane with nothing behind it — two planes is a backdrop, not a world`); continue; }
  if (!(far.parallax > spec.far.parallax && far.parallax < spec.mid.parallax)) {
    fail("middle-distance", `${label}: parallax ${far.parallax} is not between the shell (${spec.far.parallax}) and the furniture (${spec.mid.parallax})`);
  }
  const nearH = Number(spec.mid.height);
  const farH = Number(far.height);
  if (!(farH < nearH)) fail("middle-distance", `${label}: the further row (${farH}px) is not smaller than the near one (${nearH}px)`);
  if (!((far.lift ?? 0) >= (spec.mid.lift ?? 0) + nearH)) {
    fail("middle-distance", `${label}: the further row is not clear of the near row's top edge — they would read as one silhouette`);
  }
  const a = far.alpha ?? 1;
  if (!(a > 0 && a < 1)) fail("middle-distance", `${label}: the further row must be GHOSTED (doc 36 §1 affordance quarantine), alpha is ${a}`);
  const L1 = measureStems(spec.far.segments);
  const L2 = measureStems(spec.mid.segments);
  const own = measureStems(far.segments);
  if (!L1 || !L2 || !own) { fail("middle-distance", `${label}: art missing — cannot measure the middle distance`); continue; }
  const rendered = a * own.lum + (1 - a) * L1.lum;
  const step = 0.04 * spec.key;
  if (!(rendered < L1.lum - step && rendered > L2.lum + step)) {
    fail("middle-distance", `${label}: renders at ${rendered.toFixed(1)}% — it must sit ≥${step.toFixed(1)} points inside both L1 (${L1.lum.toFixed(1)}%) and L2 (${L2.lum.toFixed(1)}%)`);
  } else {
    note(`${label}: L1 ${L1.lum.toFixed(1)}% → L2b ${rendered.toFixed(1)}% → L2 ${L2.lum.toFixed(1)}%  (three bands, law ≥${step.toFixed(1)} apart)`);
  }
}

// ── 9 · THE CHILD'S EDGE (round-2 finding 1, CRITICAL) ───────────────────────
// „At a 25 % squint the boy's figure collapses into the pale yellow wall." He is
// 34.0 % luminance against a 78 % wall, so what fails is his MASS, not his hue —
// and the repair is the contour his own shadow copy now draws. What can be
// checked without a browser is that the contour exists in every room and that it
// is a real value STEP against both planes he is ever seen against.
console.log("9 · child's-edge audit (PK-R6 H2, finding 1)");
const HERO_EDGE_MIN_STEP = 25;
for (const { label, spec } of withSpec) {
  const edge = heroEdgeFor(spec.key);
  if (!(edge.swell > 0)) { fail("child's-edge", `${label}: the contour has no swell — an un-swollen copy is a cast shadow, not an outline`); continue; }
  const lum = lumOf((edge.tint >> 16) & 255, (edge.tint >> 8) & 255, edge.tint & 255) * 100;
  const against = [["L1", measureStems(spec.far.segments)], ["L2", spec.mid ? measureStems(spec.mid.segments) : null]];
  let worst = Infinity;
  for (const [name, m] of against) {
    if (!m) continue;
    const step = Math.abs(lum - m.lum);
    worst = Math.min(worst, step);
    if (step < HERO_EDGE_MIN_STEP) {
      fail("child's-edge", `${label}: his contour (${lum.toFixed(1)}%) is only ${step.toFixed(1)} points from ${name} (${m.lum.toFixed(1)}%) — the law needs ${HERO_EDGE_MIN_STEP}`);
    }
  }
  note(`${label}: contour ${lum.toFixed(1)}% · swell ${(edge.swell * 100).toFixed(0)}% · nearest plane ${worst.toFixed(1)} points away`);
}

// ── 9b · THE CHECKPOINT'S EDGE AND ITS CLEARANCE (R5-W3 · A5 · D-45) ─────────
// Audit 9 gives the child a contour and measures it. The one prop whose entire
// job is to be spotted from across the room had none, and nothing measured it,
// because audit 9 only ever looked at him. B1's critic saw both halves at once:
// „kein Eigenkontrast in den hellen Leveln" and „beim Banking in p1 vom Spieler
// komplett verdeckt". This is those two sentences as numbers.
console.log("9b · checkpoint-edge audit (R5-W3 · A5 · D-45)");
const MARKER_STEM = "krakel_a";
let markersSeen = 0;
for (const { label, ph, spec } of withSpec) {
  const cells = [];
  ph.rows.forEach((row, r) => { [...row].forEach((g, c) => { if (g === "C") cells.push({ c, r }); }); });
  if (cells.length === 0) { note(`${label}: no checkpoint`); continue; }
  markersSeen += cells.length;
  const own = measureStems([MARKER_STEM]);
  if (!own) { fail("marker-edge", `${label}: ${MARKER_STEM} is missing — cannot measure the marker`); continue; }
  const edge = markerEdgeFor(spec.key);
  const edgeLum = lumOf((edge.tint >> 16) & 255, (edge.tint >> 8) & 255, edge.tint & 255) * 100;
  // 1 · an un-swollen copy is a cast shadow, not an outline (audit 9's own rule)
  if (!(edge.swell > 0)) fail("marker-edge", `${label}: the marker's contour has no swell`);
  // 2 · …and it is a real value STEP against the marker AND against the planes
  //     the marker is seen against. Without it, p3 leaves 2.3 points.
  for (const [name, m] of [["the marker itself", own], ["L1", measureStems(spec.far.segments)], ["L2", spec.mid ? measureStems(spec.mid.segments) : null]]) {
    if (!m) continue;
    const step = Math.abs(edgeLum - m.lum);
    if (step < HERO_EDGE_MIN_STEP) fail("marker-edge", `${label}: the marker's contour (${edgeLum.toFixed(1)}%) is only ${step.toFixed(1)} points from ${name} (${m.lum.toFixed(1)}%) — the law needs ${HERO_EDGE_MIN_STEP}`);
  }
  // 3 · …and the marker is not standing behind the child who is banking at it
  const markerSrc = srcSize(MARKER_STEM);
  const heroSrc = srcSize("hero2_idle");
  if (!markerSrc || !heroSrc) { fail("marker-edge", `${label}: cannot measure the boxes (marker or hero sheet missing)`); continue; }
  // both widths derived from the REAL sheets through the engine's own scale —
  // the 52-vs-68 lesson: a check that types its own number checks its own number
  const markerW = MARKER_H * (markerSrc.w / markerSrc.h);
  const heroW = heroSrc.w * HERO2_SRC_SCALE;
  for (const { c, r } of cells) {
    const place = markerPlacementFor(ph.rows, c, r);
    const vis = markerVisibleFraction(markerW, heroW, place.dx);
    if (vis < MARKER_VISIBLE_MIN) {
      fail("marker-edge", `${label} c${c}: only ${(vis * 100).toFixed(0)} % of the checkpoint clears the child banking at it (law ${(MARKER_VISIBLE_MIN * 100).toFixed(0)} %) — ${place.why}`);
    } else {
      note(`${label} c${c}: ${place.why} (${place.dx} px) · ${(vis * 100).toFixed(0)} % clear · contour ${edgeLum.toFixed(1)}% vs marker ${own.lum.toFixed(1)}%`);
    }
  }
}
if (markersSeen === 0) fail("marker-edge", "no phase carries a checkpoint — this audit would pass vacuously");

// ── 10 · THE PAINTED SCALE (R5-W1 · A1) ──────────────────────────────────────
// Koki, replaying the build: „Lego, das nicht zusammenpasst."
//
// The cause was a SCALE, and every audit in this file was green on it. A tiled
// surface took its texture scale from the PIECE it filled — and the interior is
// planned one grid row tall, so a 512² painting was squeezed into a 16×16 box.
// The world anchor then landed on an exact multiple of the source width, so
// every solid cell in the world drew the byte-identical stamp: not a painting
// that repeats — ONE stamp, 550 times, at a 1024:1 area reduction.
//
// Audit 6 could never see it. Its fingerprint is `stem : tint : grain`, which
// carries no scale and no tile phase, so two cells that draw identical pixels
// score as variety the moment their tints differ. That is why the wallpaper
// survived two rounds of a law written to kill it, and it is why this audit
// measures the drawn SCALE instead of the plan's labels.
//
// The walk course is the reference: it is the one surface whose scale is pinned
// by its own anatomy (CRUST_H), and the one that never had the defect.
console.log("10 · painted-scale audit (mass.ts paintScaleOf — R5-W1 · A1)");
const SCALE_PARITY_TOL = 0.15;
/** Below this a declared window is a hairline, not an anatomy (R5-A5 · R3). */
const MIN_WINDOW_SRC_PX = 24;
const courseLocks = new Set();
const windowsSeen = new Set();
for (const { label, ph, spec } of withSpec) {
  const plan = planMass(ph.rows, spec.mass, srcSize);
  const want = paintScaleOf(spec.mass, srcSize);
  const offScale = new Map(); // stem → the reading furthest from the course
  for (const p of plan) {
    if (p.tile !== true || p.stem === null) continue;
    const src = srcSize(p.stem);
    if (!src) continue;
    const s = tileScaleFor(p, src);
    // 10a · SCALE PARITY — one painted world means one painted scale, on BOTH
    // axes.
    //
    // R5-W3 · A5 · R3: this used to measure the vertical axis and then `continue`
    // past anything declaring a horizontal override, on the argument that such a
    // width is „anatomical … audited above". It was audited nowhere. Measured
    // when that exemption was finally opened: the carved trims drew 0.0323 world
    // px per source px across against 0.0802 down — every side trim in the
    // chapter squashed 2.49×, under a comment promising the opposite, with this
    // audit green because the exemption was the thing that hid it.
    //
    // A declared width is not a licence to leave the scale; it is a licence to
    // show LESS of the painting. So both axes are held to the same number, and
    // the declaration itself is checked against the sheet below.
    for (const axis of ["y", "x"]) {
      if (Math.abs(s[axis] - want) > want * SCALE_PARITY_TOL) {
        const key = `${p.stem}.${axis}`;
        const cur = offScale.get(key);
        if (cur === undefined || Math.abs(s[axis] - want) > Math.abs(cur - want)) offScale.set(key, s[axis]);
      }
    }
    if (Math.abs(s.y - want) > want * SCALE_PARITY_TOL) continue;
    // 10a′ · THE DECLARED WINDOW AGAINST THE SHEET'S REAL ANATOMY. You cannot
    // show more of a painting than exists, and a hairline of one is not a
    // material — both are red, and the share is REPORTED either way so a trim
    // that shows a tenth of its sheet is a number somebody can act on.
    if (p.srcW !== undefined) {
      if (!(p.srcW > 0 && p.srcW <= src.w + 0.5)) {
        fail("painted-scale", `${label}: ${p.stem} shows ${p.srcW.toFixed(1)} source px across a ${src.w}-px sheet — you cannot window more of a painting than exists`);
      } else if (p.srcW < MIN_WINDOW_SRC_PX) {
        fail("painted-scale", `${label}: ${p.stem}'s window is ${p.srcW.toFixed(1)} source px — that is a hairline of paint, not an anatomy`);
      } else if (!windowsSeen.has(p.stem)) {
        windowsSeen.add(p.stem);
        note(`${label}: ${p.stem} shows ${((p.srcW / src.w) * 100).toFixed(0)} % of its ${src.w}-px sheet (${p.w.toFixed(1)} world px at ${s.x.toFixed(4)} — the world's own ${want.toFixed(4)})`);
      }
      continue; // a windowed piece has no horizontal repeat to lock
    }
    // 10b · NO GRID LOCK — a period under two cells is the defect; a period ON
    // a whole number of cells is the SAME defect one octave up, permanently in
    // phase with the cell grid, the plank joints and the trims.
    //
    // The COURSE is exempt from the hard fail and reported instead, because its
    // scale is not the renderer's to choose: a course band is one course tall
    // and must fit CRUST_H exactly, so its period is dictated by the height its
    // sheet was cut to. A locked course is therefore an ART finding (it is
    // fixed by re-cutting the sheet, and it is written into SPEC_MASSEN_KIT
    // §2 + the debt register), never something this build can repair. The
    // interior, whose scale IS free, is de-locked by mass.bodyScaleOf and stays
    // a hard failure here.
    const period = (src.w * s.x) / TILE;
    const isCourse = p.kind === "crust";
    if (period < MIN_PAINT_PERIOD_CELLS && !isCourse) {
      fail("painted-scale", `${label}: ${p.stem} repeats every ${period.toFixed(2)} cells — the law needs ${MIN_PAINT_PERIOD_CELLS}; at 1 cell the painting IS the grid`);
      break;
    }
    let locked = 0;
    for (let n = 1; n <= 8; n++) if (Math.abs(period - n) <= MIN_GRID_LOCK_DISTANCE) locked = n;
    if (locked > 0) {
      if (isCourse) {
        if (!courseLocks.has(p.stem)) {
          courseLocks.add(p.stem);
          note(`${label}: ⚠ course ${p.stem} repeats every ${period.toFixed(2)} cells — locked to the ${locked}-cell grid. Its scale is pinned by CRUST_H, so this is an ART finding (re-cut the sheet's height) — filed, see SPEC_MASSEN_KIT §2 / DEBT_REGISTER`);
        }
      } else {
        fail("painted-scale", `${label}: ${p.stem} repeats every ${period.toFixed(2)} cells — locked to the ${locked}-cell grid, a metronome the no-metronome audit cannot see`);
        break;
      }
    }
  }
  for (const [stem, got] of offScale) {
    const [bare, axis] = stem.split(".");
    fail("painted-scale", `${label}: ${bare} draws ${got.toFixed(4)} world px per source px on ${axis}, the walk course draws ${want.toFixed(4)} — the same painting at two scales is two materials`);
  }
  if (offScale.size === 0) {
    note(`${label}: every tiled mass surface at ${want.toFixed(4)} world px/source px — a 512-wide painting every ${((512 * want) / TILE).toFixed(2)} cells`);
  }
}

// 10c · ANCHOR HONESTY — the renderer and this audit must ask the SAME function.
// Not belt-and-braces: the scene was calling `planMass(this.grid, kit)` with no
// `srcSize` while every audit and every test passed the real PNG geometry, so
// the shipped build drew 17 px crust caps where the audit measured 41, admitted
// caps on runs the audit calls too short to carry them, and sized every floating
// platform by its width alone (a 946×259 bench rendered 32×32 instead of 32×9).
// Three visible defects, and not one gate in this file could report them.
{
  const scene = fs.readFileSync(path.join(R, "packages/game-paint/src/PaintScene.ts"), "utf8");
  if (!scene.includes("tileScaleFor(") || !scene.includes("tileAnchorFor(")) {
    fail("painted-scale", "PaintScene no longer takes its tile scale from mass.ts — a second copy of that arithmetic is how the build and its gates came to disagree");
  }
  // …scoped to the MASS path. The background planes legitimately scale a band by
  // its own height (a shell segment IS its band); it is the carved mass, whose
  // pieces are one grid row tall, where that rule produces the 16 px stamp.
  const massFn = scene.slice(scene.indexOf("private placeMassPiece"));
  const massBody = massFn.slice(0, massFn.indexOf("\n  private "));
  if (/p\.h\s*\/\s*src\.height/.test(massBody)) {
    fail("painted-scale", "placeMassPiece still scales a tiled piece by its own height — that IS the Lego defect");
  }
  if (/planMass\(\s*this\.grid\s*,\s*kit\s*\)/.test(scene)) {
    fail("painted-scale", "PaintScene plans terrain WITHOUT srcSize — the audits would measure a plan the renderer never draws");
  }
  // …and the anchor stays continuous in world space, or the seam the scale fix
  // removed comes straight back at every segment boundary
  const kit0 = withSpec[0]?.spec.mass;
  const body0 = kit0 ? srcSize(kit0.body[0]) : null;
  if (kit0 && body0) {
    const s = paintScaleOf(kit0, srcSize);
    const period = body0.w * s;
    const uAt = (x) => {
      const a = tileAnchorFor({ x, y: 0, srcScale: s, tileAnchor: "xy" }, { x: s, y: s }).x;
      return ((a % body0.w) / body0.w + 1) % 1;
    };
    const worstDrift = [16, 48, 96, 240].reduce((m, dx) => {
      const want2 = ((dx / period) % 1 + 1) % 1;
      const got = ((uAt(dx) - uAt(0)) % 1 + 1) % 1;
      const d = Math.abs(got - want2);
      return Math.max(m, Math.min(d, 1 - d));
    }, 0);
    if (worstDrift > 1e-9) fail("painted-scale", `the world anchor drifts ${worstDrift.toExponential(2)} of a period — neighbouring runs would not be seamless`);
    else note("anchor honesty: scene and audit share tileScaleFor/tileAnchorFor; the anchor is exact in world space over 16/48/96/240 px");
  }
}

// ── 11 · EDGE COHERENCE ──────────────────────────────────────────────────────
/**
 * R5-W4 · A6 · KOKI'S „LEGO", MADE A NUMBER.
 *
 *   „Die äußeren Kanten sind in diesem komischen Braun, und dann die vertikalen
 *    Kanten haben graue und braune Blöcke, die nicht zum Rest passen — wieder
 *    Lego-Blöcke nebeneinander. Es soll EIN kohärentes, schön gemaltes Ganzes
 *    sein, auf allen Seiten der Form, nicht nur oben."
 *
 * Every audit before this one measures a surface against a BAND — is L2 inside
 * its window, is the mass separated from the furniture. None of them measures
 * one surface against the surface it TOUCHES, and that is the only place the
 * defect he is describing lives: a warm cream trim beside a violet walk course
 * is two legal values and one broken object.
 *
 * ── WHAT IS MEASURED, AND WHY IT IS NOT THE SHEETS ───────────────────────────
 * The sheets are not what reaches the eye. `planMass` multiplies a walk course
 * by `nearPlaneTint(K)`, a trim by the kit's lay-back, and everything by the
 * depth ramp — so a comparison of raw PNGs would clear a joint the renderer then
 * breaks, and break one it then clears. This audit therefore applies the engine's
 * OWN pure functions to the pixels before comparing them, at the surface row
 * (depth bucket 0), which is the row a child stands on and looks at.
 *
 * ── AND WHY IT IS THE SEAM, NOT THE SHEET AVERAGE ────────────────────────────
 * A trim is 8 world px of a 16 px cell. What meets the body is its inner column,
 * not its average: a strip can average into the family and still butt a bright
 * cut face against the paper. So each surface is measured over the `SEAM_DEPTH`
 * pixels nearest the joint it actually forms, on the painted pixels only.
 *
 * ── THE THREE QUANTITIES ─────────────────────────────────────────────────────
 * Value alone would have passed the very frame Koki rejected: measured on the
 * shipped p2 kit, the trim is drawn 1.7 points BELOW its body — a perfect value
 * match — while sitting 226° away in hue from the course above it. Hue and
 * saturation are where „gehört nicht dazu" lives, so all three are law.
 *
 * Hue is skipped, loudly, where either side is under `HUE_MEANINGFUL_SAT`: the
 * hue of a grey is noise, and a law that reads noise is a law that fires at
 * random.
 */
console.log("11 · edge-coherence audit (R5-W4 · A6 — one painted body on ALL sides)");

/**
 * ── WHAT IS SAMPLED, AND THE TWO CUTS THAT WERE WRONG ────────────────────────
 * First cut: the eight pixels nearest each joint. It failed p1's freshly
 * delivered, accepted art at ΔL 50.6 on crust↔body. The measurement was right
 * and the law was wrong — the bottom rows of a walk course are a PAINTED
 * shadow, the transition the artist put there so the board reads as sitting on
 * the mass. A hairline sample measures that shadow and calls good work a defect,
 * which would push every future kit towards flat butt-joints.
 *
 * Second cut: the half facing the joint. Better, but it made the verdict depend
 * on which half of a strip happens to be lighter — noise, not law.
 *
 * What Koki named is MATERIAL — "graue Seiten neben brauner Krone", grey sides
 * beside a brown crown; „die Außenwand ist hässlich mit diesen Grautönen". A
 * material is what a surface is made of over its whole face, so that is what is
 * compared: the painted pixels of each piece, after the engine's own multiply.
 * Stable, scale-independent across sheets that differ 3× in height, and not
 * gameable by how a piece treats its own border.
 */
const HUE_MEANINGFUL_SAT = 10;

const stripPixels = (stem, _side, tint) => {
  const png = readPng(stem);
  if (png === null) return null;
  const { width: W, height: H, data } = png;
  const [x0, x1, y0, y1] = [0, W - 1, 0, H - 1];
  const tr = ((tint >> 16) & 255) / 255, tg = ((tint >> 8) & 255) / 255, tb = (tint & 255) / 255;
  const out = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * W + x) << 2;
      if (data[i + 3] < 128) continue;
      out.push([data[i] * tr, data[i + 1] * tg, data[i + 2] * tb]);
    }
  }
  return out.length === 0 ? null : out;
};

const seamStats = (px) => {
  let lum = 0, sat = 0, sx = 0, sy = 0, hueN = 0;
  for (const [r, g, b] of px) {
    lum += lumOf(r, g, b);
    const s = satOf(r, g, b);
    sat += s;
    if (s > HUE_MEANINGFUL_SAT / 100) {
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h = (h * 60 * Math.PI) / 180;
      sx += Math.cos(h); sy += Math.sin(h); hueN++;
    }
  }
  const lums = px.map(([r, g, b]) => lumOf(r, g, b)).sort((a, b) => a - b);
  return {
    lum: (lum / px.length) * 100,
    sat: (sat / px.length) * 100,
    hue: hueN === 0 ? null : ((Math.atan2(sy, sx) * 180) / Math.PI + 360) % 360,
    // the top of the histogram, where a blown highlight lives — see COHERENCE_MAX.peak
    p95: (lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.95))] ?? 0) * 100,
  };
};

const hueGap = (a, b) => {
  if (a === null || b === null) return null;
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * The joints a carved mass actually forms (`mass.ts#planMass` section 4), and —
 * per joint — WHICH of the three quantities is this audit's business.
 *
 * ── THE LINE THIS AUDIT DOES NOT CROSS ───────────────────────────────────────
 * A walk course is drawn 25 points darker than the body it sits on, and that is
 * not a defect: `composition.ts#nearPlaneTint` pushes the nearest standable
 * plane back by up to 0.36, with a written rationale and a law behind it
 * (doc 36 §1 v1.1). An audit that failed that step would be overruling a
 * decision, not finding a fault. So wherever two pieces wear DIFFERENT declared
 * multiplies, their value difference is the engine's business and this audit
 * only reports it.
 *
 * What is left is exactly what is free, and it is exactly what Koki named:
 *   · SATURATION and HUE, everywhere. Nothing in the engine changes the family a
 *     surface belongs to, so a grey strip against coloured books, or a warm trim
 *     against a violet course, is the art's own doing. („graue Seiten neben
 *     brauner Krone", 226° apart on the shipped p2 kit.)
 *   · VALUE where both sides wear the SAME multiply — corner against edge. Two
 *     pieces of one trim set, lit identically, that do not match are
 *     „die Schattierungen der Blöcke sind uneinheitlich" in one number.
 *   · VALUE of a trim against the body it is cut into, as a SIGNED window. This
 *     one is not a difference-cap at all: SPEC_MASSEN_KIT §5 says a cut edge sits
 *     6–12 points ABOVE the face beside it, because that is what makes it read
 *     as carved. Below the body it is a groove; far above it is the rail the
 *     round-2 critics named twice. A cap alone cannot say that — only a signed
 *     window can, and it is the one number `trimShade` exists to hit.
 */
const JOINTS = [
  ["crust", "body", ["sat", "hue"]],
  ["crust", "edgeL", ["sat", "hue"]],
  ["crust", "edgeR", ["sat", "hue"]],
  ["edgeL", "body", ["sat", "hue", "carve"]],
  ["edgeR", "body", ["sat", "hue", "carve"]],
  ["cornerBL", "edgeL", ["sat", "hue", "lum"]],
  ["cornerBR", "edgeR", ["sat", "hue", "lum"]],
  ["inCornerL", "edgeL", ["sat", "hue", "lum"]],
  ["inCornerR", "edgeR", ["sat", "hue", "lum"]],
];

/** which classes wear which of the engine's multiplies, at the surface row */
const TRIM_CLASSES = new Set(["edgeL", "edgeR", "cornerBL", "cornerBR", "inCornerL", "inCornerR"]);
const NEAR_CLASSES = new Set(["crust"]);

/** Judge one kit's joints. Pure over the art + the engine's own multiplies, so
 *  the selftest below can hand it a made-up kit and get the shipping verdict. */
const judgeKit = (kit, key) => {
  const variantsOf = (cls) => (Array.isArray(kit[cls]) ? kit[cls] : [kit[cls]]).filter((s) => typeof s === "string");
  const tintOf = (cls) =>
    NEAR_CLASSES.has(cls) ? nearPlaneTint(key)
    : TRIM_CLASSES.has(cls) ? (kit.trimShade ?? TRIM_SHADE)
    : 0xffffff;

  const rows = [];
  for (const [ca, cb, laws] of JOINTS) {
    let pick = null;
    for (const sa of variantsOf(ca)) {
      for (const sb of variantsOf(cb)) {
        const pa = stripPixels(sa, null, tintOf(ca));
        const pb = stripPixels(sb, null, tintOf(cb));
        if (pa === null || pb === null) continue;
        const A = seamStats(pa), B = seamStats(pb);
        const broke = [];
        if (laws.includes("sat") && Math.abs(A.sat - B.sat) > COHERENCE_MAX.ds) broke.push(`ΔS ${Math.abs(A.sat - B.sat).toFixed(1)}>${COHERENCE_MAX.ds}`);
        const dh = hueGap(A.hue, B.hue);
        if (laws.includes("hue") && dh !== null && dh > COHERENCE_MAX.dh) broke.push(`ΔH ${dh.toFixed(0)}°>${COHERENCE_MAX.dh}°`);
        if (laws.includes("lum") && Math.abs(A.lum - B.lum) > COHERENCE_MAX.dlSameLight) broke.push(`ΔL ${Math.abs(A.lum - B.lum).toFixed(1)}>${COHERENCE_MAX.dlSameLight} under one light`);
        if (laws.includes("carve")) {
          const carve = A.lum - B.lum; // trim minus body — signed on purpose
          if (carve < COHERENCE_MAX.carve[0] || carve > COHERENCE_MAX.carve[1]) {
            broke.push(`carve ${carve >= 0 ? "+" : ""}${carve.toFixed(1)} outside ${COHERENCE_MAX.carve[0]}…+${COHERENCE_MAX.carve[1]}`);
          }
        }
        const cand = {
          joint: `${ca}↔${cb}`, sa, sb, broke,
          dl: A.lum - B.lum, ds: Math.abs(A.sat - B.sat), dh,
        };
        // the WORST pair of variants is the one a child can actually meet, so it
        // is the one the law judges — an average would hide the joint that shows
        if (pick === null || cand.broke.length > pick.broke.length
          || (cand.broke.length === pick.broke.length && cand.ds + (cand.dh ?? 0) / 4 > pick.ds + (pick.dh ?? 0) / 4)) pick = cand;
      }
    }
    if (pick !== null) rows.push(pick);
  }
  return rows;
};

// ── the selftest: this law must be able to go red, and to tell cases apart ────
// It runs the SHIPPING judge (`judgeKit`) over synthetic kits whose PNGs are
// injected into the same cache the real audit reads, so nothing here is a second
// implementation of the law. Exit code reflects THESE cases only; audits 1–10
// have already printed above and are not what is being proven.
if (process.argv.includes("--selftest")) {
  // A swatch is a gentle ramp around its colour, not a flat fill: a flat patch
  // has p95 === mean, which would make the peak law a duplicate of the carve law
  // and prove nothing. `hot` paints the top 3 % of it near-white — the shape of
  // a real trim sheet whose painted page-edges run to pure white while its
  // average sits perfectly in family.
  const swatch = (stem, [r, g, b], hot = false) => {
    const png = new PNG({ width: 20, height: 20 });
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const i = (y * 20 + x) << 2;
        const k = 0.82 + 0.36 * (y / 19); // ±18 % around the nominal colour
        const blown = hot && y === 0 && x < 12;
        png.data[i] = blown ? 252 : Math.min(255, Math.round(r * k));
        png.data[i + 1] = blown ? 250 : Math.min(255, Math.round(g * k));
        png.data[i + 2] = blown ? 246 : Math.min(255, Math.round(b * k));
        png.data[i + 3] = 255;
      }
    }
    pngCache.set(stem, png);
    artFiles.set(stem, `synthetic:${stem}`);
    return stem;
  };
  // A kit whose trims are the body's own colour at +8 luminance is the shape
  // every commission is asked for; the variants are the two failure modes.
  const kitOf = (trimRGB, trimShade, hot = false) => {
    const body = swatch(`st_body_${trimRGB.join("_")}_${hot}`, [156, 113, 66]);
    const crust = swatch(`st_crust_${hot}`, [143, 96, 52]);
    const trim = swatch(`st_trim_${trimRGB.join("_")}_${hot}`, trimRGB, hot);
    return {
      crust: [crust], crustCapL: crust, crustCapR: crust, body: [body], fade: [body], sediment: body,
      edgeL: trim, edgeR: trim, cornerBL: trim, cornerBR: trim, inCornerL: trim, inCornerR: trim,
      rampUp: trim, rampDown: trim, platObjects: [], trimShade,
    };
  };
  const broken = (kit) => judgeKit(kit, 88).filter((r) => r.broke.length > 0);
  const reasons = (kit) => broken(kit).flatMap((r) => r.broke).join(" ");

  const cases = [
    // [name, kit, must it break?, what the break has to be about]
    ["a trim of the body's own paint at +8", kitOf([182, 133, 77], 0xffffff), false, null],
    ["Koki's grey strip beside brown books", kitOf([170, 165, 160], 0xffffff), true, "ΔS"],
    ["a warm trim in a violet room", kitOf([90, 70, 150], 0xffffff), true, "ΔH"],
    ["a groove: the cut darker than the face", kitOf([182, 133, 77], 0x9e9e9e), true, "carve"],
    // the round-2 critics' complaint, as a number: a cut edge far brighter than
    // the face is the "pale stone pillar" they named twice. Same family, same
    // hue — only the carve window can catch it, which is why it is a window.
    ["a rail: the cut far brighter than the face", kitOf([230, 200, 150], 0xffffff), true, "carve"],
  ];
  let bad = 0;
  for (const [name, kit, mustBreak, about] of cases) {
    const rs = broken(kit);
    const why = reasons(kit);
    const ok = mustBreak ? rs.length > 0 && (about === null || why.includes(about)) : rs.length === 0;
    if (!ok) bad++;
    console.log(`${ok ? "✓" : "✗"} ${name}: ${rs.length === 0 ? "coherent" : why}${mustBreak && about !== null && !why.includes(about) ? `  ← expected a ${about} finding` : ""}`);
  }
  // …and the waiver's expiry must be a DATE that can actually pass, which is the
  // whole reason this table is not `SEPARATION_WAIVERS`.
  if (!waiverExpired({ until: "2020-01-01" })) { bad++; console.error("✗ a waiver dated 2020 was still considered live — the expiry is decorative"); }
  else if (waiverExpired({ until: "2999-01-01" })) { bad++; console.error("✗ a waiver dated 2999 was considered expired — the expiry misreads dates"); }
  else console.log("✓ waivers expire: a 2020 date is dead, a 2999 date is live, and the audit reads the difference");
  if (bad > 0) { console.error("✗ check-composition selftest: the edge-coherence law does not discriminate"); process.exit(1); }
  console.log("✓ selftest: the coherence law passes a kit cut from its own body, and names ΔS, ΔH and the carve window separately when they break.");
  process.exit(0);
}

for (const { label, spec } of withSpec) {
  const rows = judgeKit(spec.mass, spec.key);
  if (rows.length === 0) { fail("edge-coherence", `${label}: no mass joint could be measured — the audit would pass vacuously`); continue; }

  const waiver = COHERENCE_WAIVERS[label];
  const over = rows.filter((r) => r.broke.length > 0);
  const worstSat = Math.max(...rows.map((r) => r.ds));
  const worstHue = Math.max(...rows.map((r) => r.dh ?? 0));
  const worstLine = `${label}: ${rows.length} joints · worst ΔS ${worstSat.toFixed(1)} · worst ΔH ${worstHue.toFixed(0)}° · carve ${rows.filter((r) => r.joint.endsWith("↔body") && r.joint.startsWith("edge")).map((r) => `${r.dl >= 0 ? "+" : ""}${r.dl.toFixed(1)}`).join("/")}`;
  if (over.length === 0) {
    note(`${worstLine} — coherent`);
    if (waiver !== undefined) fail("edge-coherence", `${label}: carries a coherence waiver it no longer needs — delete it (${waiver.why})`);
    continue;
  }
  const detail = over.map((r) => `${r.joint} [${r.sa}|${r.sb}] ${r.broke.join(", ")}`).join(" · ");
  if (waiver === undefined) {
    fail("edge-coherence", `${worstLine} — ${over.length} joint(s) out of family: ${detail}`);
  } else if (waiverExpired(waiver)) {
    fail("edge-coherence", `${label}: its coherence waiver EXPIRED on ${waiver.until} — ${waiver.why}. Paint it, re-tint it, or have the architect re-date it. (${detail})`);
  } else {
    note(`${worstLine} — WAIVED until ${waiver.until}: ${waiver.why} (${detail})`);
  }
}

// ── verdict ──────────────────────────────────────────────────────────────────
console.log(
  "\nBands ARMED at doc 36 §1 v1.1 (relative to each phase's declared key). L3 is K-exempt;\n"
  + "the L2\u2194L3 separation stays absolute. Saturation caps are measured and reported.",
);
if (failures === 0) {
  console.log(`\ncheck-composition: OK — 11 audits green over ${withSpec.length} phase(s)`);
} else {
  console.error(`\ncheck-composition: ${failures} failure(s)`);
  process.exit(1);
}
