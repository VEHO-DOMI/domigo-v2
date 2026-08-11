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
import { COMPOSITION, heroEdgeFor } from "../packages/game-paint/src/composition.ts";
import { planLayers, planeCovers } from "../packages/game-paint/src/layers.ts";
import {
  MIN_GRID_LOCK_DISTANCE,
  MIN_PAINT_PERIOD_CELLS,
  NO_METRONOME_MIN_PERIOD,
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
  const planes = {
    L0: measureColors([...spec.wash.colors]),
    L1: measureStems(spec.far.segments),
    L2: spec.mid ? measureStems(spec.mid.segments) : null,
    L3: measureStems([...spec.mass.crust, ...spec.mass.body, spec.mass.fade, spec.mass.sediment, ...entityStems]),
    L4: spec.fg ? measureStems(spec.fg.segments) : null,
  };
  const K = spec.key;
  // Fable, PK-C2b review: documented separation waiver — the arena is a single-screen
// stage whose only hostile is the high-contrast guardian; l2_p4 gets a one-sheet
// darken in the F2 art touch-up, then this entry is deleted and the law re-arms.
const SEPARATION_WAIVERS = { "ch01/p4": "until the F2 l2_p4 touch-up (doc 37)" };

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
  const missing = [...spec.mass.crust.slice(0, 1), spec.mass.body[0], spec.mass.fade, spec.mass.sediment].filter((s) => !artFiles.has(s));
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
const courseLocks = new Set();
for (const { label, ph, spec } of withSpec) {
  const plan = planMass(ph.rows, spec.mass, srcSize);
  const want = paintScaleOf(spec.mass, srcSize);
  const offScale = new Map(); // stem → the reading furthest from the course
  for (const p of plan) {
    if (p.tile !== true || p.stem === null) continue;
    const src = srcSize(p.stem);
    if (!src) continue;
    const s = tileScaleFor(p, src);
    // 10a · SCALE PARITY — one painted world means one painted scale. The
    // vertical axis carries it; a trim may fit its own width across, because an
    // 8 px trim is 8 px wide for anatomical reasons — but that is DECLARED
    // (srcScaleX), never a side effect of the box it happened to fill.
    if (Math.abs(s.y - want) > want * SCALE_PARITY_TOL) {
      const cur = offScale.get(p.stem);
      if (cur === undefined || Math.abs(s.y - want) > Math.abs(cur - want)) offScale.set(p.stem, s.y);
      continue;
    }
    if (p.srcScaleX !== undefined) continue; // an anatomical width, audited above
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
    fail("painted-scale", `${label}: ${stem} draws ${got.toFixed(4)} world px per source px, the walk course draws ${want.toFixed(4)} — the same painting at two scales is two materials`);
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

// ── verdict ──────────────────────────────────────────────────────────────────
console.log(
  "\nBands ARMED at doc 36 §1 v1.1 (relative to each phase's declared key). L3 is K-exempt;\n"
  + "the L2\u2194L3 separation stays absolute. Saturation caps are measured and reported.",
);
if (failures === 0) {
  console.log(`\ncheck-composition: OK — 10 audits green over ${withSpec.length} phase(s)`);
} else {
  console.error(`\ncheck-composition: ${failures} failure(s)`);
  process.exit(1);
}
