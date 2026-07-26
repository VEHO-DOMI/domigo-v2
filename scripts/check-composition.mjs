#!/usr/bin/env node
// PB-C1 · THE COMPOSITION GATE — doc 36 §4's four audits, in one command.
//
//   1 LAYER-VALUE   each plane's measured value/saturation + the depth ramp
//                   and the L2↔L3 separation law
//   2 COVERAGE      L0 + L1 cover the camera's travel box at BOTH extremes
//   3 NO-NAKED-FILL a kit-present phase renders zero engine fill rectangles
//   4 GLYPH         every trail letter renders its OWN character
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
import { COMPOSITION } from "../packages/game-paint/src/composition.ts";
import { planLayers, planeCovers } from "../packages/game-paint/src/layers.ts";
import { nakedFills, planMass, uncoveredSolids } from "../packages/game-paint/src/mass.ts";
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

/** doc 36 §1 — REPORTED, not armed: see the day/night note at the bottom. */
const BANDS = { L0: [82, 95, 20], L1: [70, 88, 35], L2: [45, 65, 50], L4: [15, 40, 45] };

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
for (const { label, spec } of withSpec) {
  const planes = {
    L0: measureColors([...spec.wash.colors]),
    L1: measureStems(spec.far.segments),
    L2: spec.mid ? measureStems(spec.mid.segments) : null,
    L3: measureStems([...spec.mass.crust, ...spec.mass.body, spec.mass.fade, spec.mass.sediment]),
    L4: spec.fg ? measureStems(spec.fg.segments) : null,
  };
  for (const [name, m] of Object.entries(planes)) {
    if (m === null && (name === "L0" || name === "L1" || name === "L3")) {
      fail("layer-value", `${label} ${name}: art missing — cannot measure`);
      continue;
    }
    if (m === null) continue;
    const band = BANDS[name];
    const inBand = band ? m.lum >= band[0] && m.lum <= band[1] && m.sat <= band[2] : true;
    note(`${label} ${name}: lum ${m.lum.toFixed(1)}% · sat ${m.sat.toFixed(1)}%${band ? `  [law ${band[0]}–${band[1]}%, sat ≤${band[2]}%] ${inBand ? "in band" : "OUT OF BAND (reported, not armed — see note)"}` : ""}`);
  }
  // ARMED: the depth ramp direction — the far shell is lifted above the mid
  if (planes.L1 && planes.L2 && planes.L1.lum <= planes.L2.lum) {
    fail("layer-value", `${label}: no depth ramp — L1 (${planes.L1.lum.toFixed(1)}%) must be lifted above L2 (${planes.L2.lum.toFixed(1)}%)`);
  }
  // ARMED: the separation law — enemies must never camouflage against furniture
  if (planes.L2 && planes.L3) {
    const dLum = Math.abs(planes.L2.lum - planes.L3.lum);
    const dSat = Math.abs(planes.L2.sat - planes.L3.sat);
    if (dLum < 12 && dSat < 25) {
      fail("layer-value", `${label}: L2↔L3 separation ${dLum.toFixed(1)}% lum / ${dSat.toFixed(1)}% sat — the law needs ≥12% or ≥25%`);
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
  const plan = planMass(ph.rows, spec.mass);
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
  const bad = glyphs.filter((g) => !/^[A-Z]$/.test(g.char));
  if (bad.length > 0) { fail("glyph", `${label}: ${bad.length} letter(s) render no real character`); continue; }
  const distinct = new Set(glyphs.map((g) => g.char)).size;
  if (cells > 1 && distinct < 2) fail("glyph", `${label}: all ${cells} letters render the SAME character — the pre-C1 "everything is an A" defect`);
  else note(`${label}: ${cells} letters, ${distinct} distinct characters (${glyphs.map((g) => g.char).join("")})`);
}

// ── verdict ──────────────────────────────────────────────────────────────────
console.log(
  "\nNOTE (PK-C1, for Fable): the doc 36 §1 ABSOLUTE value bands are printed but NOT armed.\n"
  + "They describe a day-lit room, and the AF palette card commissions p2 as \"deep blue-violet air\",\n"
  + "p4 as \"stage-dusk\" and p9 as \"indigo-black\" — no night phase can sit at 82–95% lightness.\n"
  + "Armed instead: the ramp direction (L1 lifted above L2) and the L2↔L3 separation law, both of\n"
  + "which are key-independent. Deciding how the bands read for a night key is a law call, not mine.",
);
if (failures === 0) {
  console.log(`\ncheck-composition: OK — 4 audits green over ${withSpec.length} phase(s)`);
} else {
  console.error(`\ncheck-composition: ${failures} failure(s)`);
  process.exit(1);
}
