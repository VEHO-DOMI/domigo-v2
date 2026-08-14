#!/usr/bin/env node
// R5-W2 · J1-E · DOES THE PRIZE SEPARATE FROM ITS GROUND?
//
// Run:  node scripts/measure-presence.mjs <framesDir> [--json]
//       node scripts/measure-presence.mjs --selftest
//
// Two blind critics, order swapped, judged our sunlit hall against real Rayman
// frames and lost DECISIVELY on one criterion: „gold pickups in a gold room is
// the base error — the highest-contrast element in the composition is a hazard,
// not the prize." They measured our rule page at mean luminance 204 against a
// 207 local ground: the prize was DARKER than the wall. The engine backing took
// that to +9,2. Their target is +50. This is round 2 of a maximum of three.
//
// ── WHY A SCRIPT AND NOT AN EYE ──────────────────────────────────────────────
// Because round 1's number was disputed, and a disputed number is worth less
// than no number. So this tool is built to be citable:
//
//  · ONE luminance formula, the same three coefficients check-composition.mjs
//    uses (0.2126 / 0.7152 / 0.0722). One measure, two tools, no drift.
//  · IT HARD-FAILS on the factor-3 trap. LOGICAL_W is 352 and a snapshot is
//    1056 — measuring in logical coordinates against an image in render pixels
//    samples the wrong place entirely, and it does so silently. The frame must
//    be LOGICAL_W × RENDER_SCALE wide or nothing is measured.
//  · IT PRINTS the scale and the derived rectangle on every run. A measurement
//    whose frame you cannot reconstruct is an anecdote.
//  · --selftest synthesises a square of known luminance on a ground of known
//    luminance and asserts the answer to ±0,1. AN UNVERIFIED MEASURING TOOL IS
//    HOW A ROUND SHIPS A NUMBER NOBODY CAN DEFEND.
//
// ── AND WHY ΔL ALONE IS NOT ENOUGH ───────────────────────────────────────────
// Three companion numbers ride along, because a contrast win can be bought
// cheaply and each of these catches one of the ways:
//   clip%  — object pixels at or above 250 in any channel. A page made brighter
//            by blowing out its paper is not a page any more.
//   p95    — the object's 95th-percentile luminance. Catches a ΔL carried by a
//            single hot specular pixel rather than by the paper.
//   ΔH     — mean hue distance, object against ring. THE CRITICS' ACTUAL
//            COMPLAINT was gold-on-gold. A brightness win with ΔH ≈ 0 has not
//            fixed what they saw.
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LOGICAL_W = 352;
const RENDER_SCALE = 3;
const EXPECT_W = LOGICAL_W * RENDER_SCALE; // 1056

// ── R28 (Fable, 2026-08-14): DER RADIUS IST DIE KANTE ───────────────────────
// Runde 2 zeigte, dass die Zahl fast vollständig davon abhängt, WO man misst:
// an der Kante +46,5 · zwei Objekthöhen weiter draußen +13,2. Die Unterlage
// reicht bis ~1,81 Objekthöhen und kann außerhalb davon naturgemäß nichts
// bewirken — ein Ziel, das sich auf einen anderen Ring bezieht als die Messung,
// ist kein Ziel. Also ist der KANTEN-Ring ab jetzt das Maß (dort trennt ein
// Kind), und der ferne Ring läuft als Begleitspalte mit, damit niemand einen
// Kantensieg mit einer verdunkelten Wand verwechselt.
export const EDGE_RING = { inner: 0.8, outer: 1.2 };
export const WALL_RING = { inner: 2.0, outer: 3.2 };
export const TARGET_DL = 50; // die Zahl der blinden Kritiker, AM KANTEN-RING

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Hue in degrees, or null for a pixel with no chroma to speak of. */
const hue = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 8) return null;
  let h;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  return (h + 360) % 360;
};

const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/** The measurement itself: the object's box against an ANNULUS around it.
 *
 *  DEFAULT = THE EDGE (0.8–1.2·h), by R28. That is where a child separates a
 *  thing from its ground, and it is where the backing can act at all. The far
 *  ring (2.0–3.2·h) is still measurable — pass WALL_RING — and the CLI prints
 *  it alongside, because a win at the edge bought by darkening the whole wall
 *  would be a different, worse change. The shaft column is NOT excluded: if a
 *  beam brightens the wall above the page, that is a real cost and belongs in
 *  the number. */
export const measure = (png, box, { inner = EDGE_RING.inner, outer = EDGE_RING.outer } = {}) => {
  const { width: W, height: H, data } = png;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const rIn = inner * box.h;
  const rOut = outer * box.h;

  const objL = [];
  const objHue = [];
  let clipped = 0;
  for (let y = Math.max(0, box.y); y < Math.min(H, box.y + box.h); y++) {
    for (let x = Math.max(0, box.x); x < Math.min(W, box.x + box.w); x++) {
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      objL.push(lum(r, g, b));
      const hh = hue(r, g, b);
      if (hh !== null) objHue.push(hh);
      if (r >= 250 || g >= 250 || b >= 250) clipped++;
    }
  }

  const ringL = [];
  const ringHue = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.hypot(dx, dy);
      if (d < rIn || d > rOut) continue;
      const i = (y * W + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      ringL.push(lum(r, g, b));
      const hh = hue(r, g, b);
      if (hh !== null) ringHue.push(hh);
    }
  }

  if (objL.length === 0) throw new Error("the object box is empty — it fell outside the frame");
  if (ringL.length < 200) throw new Error(`the ring holds only ${ringL.length} px — too few to be a ground (needs ≥200)`);

  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) * p)];
  const meanHue = (a) => (a.length === 0 ? null : mean(a));

  const oh = meanHue(objHue), rh = meanHue(ringHue);
  return {
    lObj: mean(objL),
    lRing: mean(ringL),
    dL: mean(objL) - mean(ringL),
    p95: pct(objL, 0.95),
    clipPct: (100 * clipped) / objL.length,
    dH: oh === null || rh === null ? null : hueGap(oh, rh),
    objPx: objL.length,
    ringPx: ringL.length,
    rect: { ...box, rIn: Math.round(rIn), rOut: Math.round(rOut) },
  };
};

// ── the self-test: the part that makes the instrument citable ────────────────
const selftest = () => {
  const W = EXPECT_W, H = 672;
  const png = new PNG({ width: W, height: H });
  // ground: mid grey, luminance exactly 100 by construction
  const G = 100, O = 180;
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = G; png.data[i + 1] = G; png.data[i + 2] = G; png.data[i + 3] = 255;
  }
  const box = { x: 500, y: 300, w: 40, h: 40 };
  for (let y = box.y; y < box.y + box.h; y++) {
    for (let x = box.x; x < box.x + box.w; x++) {
      const i = (y * W + x) * 4;
      png.data[i] = O; png.data[i + 1] = O; png.data[i + 2] = O;
    }
  }
  const m = measure(png, box);
  const fails = [];
  // grey has lum == its own channel value, so the analytic answers are exact
  if (Math.abs(m.lObj - O) > 0.1) fails.push(`object luminance ${m.lObj.toFixed(3)} ≠ ${O}`);
  if (Math.abs(m.lRing - G) > 0.1) fails.push(`ring luminance ${m.lRing.toFixed(3)} ≠ ${G}`);
  if (Math.abs(m.dL - (O - G)) > 0.1) fails.push(`ΔL ${m.dL.toFixed(3)} ≠ ${O - G}`);
  if (m.clipPct !== 0) fails.push(`clip% ${m.clipPct} ≠ 0 on a 180-grey square`);
  if (m.dH !== null) fails.push(`ΔH ${m.dH} is not null on a fully desaturated frame`);

  // ── THE COLOUR CASE, and it exists because the grey case above proved less
  //    than it looked. Tampering the luminance formula down to a plain channel
  //    mean left every grey assertion GREEN: on r=g=b the weighted and the
  //    unweighted formula agree exactly, so the one thing this measure is FOR —
  //    that green reads far brighter than blue at the same numeric value — was
  //    untested. Pure green on pure blue separates them violently:
  //      weighted  0.7152·255 − 0.0722·255 = +164.2
  //      flat mean 85 − 85                 =    0.0
  {
    const png2 = new PNG({ width: W, height: H });
    for (let i = 0; i < png2.data.length; i += 4) {
      png2.data[i] = 0; png2.data[i + 1] = 0; png2.data[i + 2] = 255; png2.data[i + 3] = 255; // blue ground
    }
    for (let y = box.y; y < box.y + box.h; y++) {
      for (let x = box.x; x < box.x + box.w; x++) {
        const i = (y * W + x) * 4;
        png2.data[i] = 0; png2.data[i + 1] = 255; png2.data[i + 2] = 0; // green object
      }
    }
    const c = measure(png2, box);
    const want = 0.7152 * 255 - 0.0722 * 255;
    if (Math.abs(c.dL - want) > 0.1) {
      fails.push(`green-on-blue ΔL ${c.dL.toFixed(2)} ≠ ${want.toFixed(2)} — the luminance formula is not weighted, and a flat channel mean would score this 0`);
    }
    // …and while we are here: two opposite hues must read as far apart
    if (c.dH === null || c.dH < 100) {
      fails.push(`green against blue reports ΔH ${c.dH} — the hue measure is not separating opposite hues`);
    }
  }

  // …and it must REFUSE a frame at the wrong scale, or the factor-3 trap is open
  const wrong = new PNG({ width: LOGICAL_W, height: 224 });
  let refused = false;
  try { assertScale(wrong); } catch { refused = true; }
  if (!refused) fails.push("a 352-wide frame was accepted — the factor-3 trap is open");

  if (fails.length > 0) {
    for (const f of fails) console.error(`✗ ${f}`);
    console.error("\nmeasure-presence --selftest: FAILED — do not trust any number this tool prints");
    process.exit(1);
  }
  console.log(`measure-presence --selftest: OK`);
  console.log(`  object ${m.lObj.toFixed(2)} · ring ${m.lRing.toFixed(2)} · ΔL ${m.dL.toFixed(2)} (analytic ${O - G})`);
  console.log(`  ring sampled ${m.ringPx} px · a wrong-scale frame is refused`);
};

const assertScale = (png) => {
  if (png.width !== EXPECT_W) {
    throw new Error(
      `frame is ${png.width}px wide, expected ${EXPECT_W} (LOGICAL_W ${LOGICAL_W} × RENDER_SCALE ${RENDER_SCALE}).\n`
      + `  A frame at the wrong scale samples the wrong place and says nothing about it.`,
    );
  }
};

// ── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes("--selftest")) { selftest(); process.exit(0); }

const dir = args[0];
if (!dir) {
  console.error("usage: node scripts/measure-presence.mjs <framesDir> [--json]\n       node scripts/measure-presence.mjs --selftest");
  process.exit(1);
}
const asJson = args.includes("--json");
const role = args.indexOf("--role") === -1 ? "tip" : args[args.indexOf("--role") + 1];

const rows = [];
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".png")).sort()) {
  const stem = f.replace(/\.png$/, "");
  const sidecar = path.join(dir, `${stem}.meta.json`);
  if (!fs.existsSync(sidecar)) {
    console.error(`✗ ${stem}: no ${stem}.meta.json — a frame without its object box cannot be measured`);
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(sidecar, "utf8"));
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, f)));
  assertScale(png);
  if (meta.scale !== undefined && meta.scale !== RENDER_SCALE) {
    console.error(`✗ ${stem}: sidecar says scale ${meta.scale}, this tool measures at ${RENDER_SCALE}`);
    process.exit(1);
  }
  // R5-W3 · W1: die Box darf aus dem Zettel kommen, den `shoot-world.mjs`
  // schreibt — der Zeichenort meldet die Bildschirm-Lage selbst. Von Hand
  // getippte Boxen waren die letzte weiche Stelle in dieser Messkette.
  const box = meta.box ?? (() => {
    const ent = (meta.entities ?? []).find((e) => e.role === role && e.breath?.scr);
    if (!ent) return null;
    const s = ent.breath.scr;
    return { x: Math.round(s.x), y: Math.round(s.y), w: Math.round(s.w), h: Math.round(s.h) };
  })();
  if (box === null) {
    console.error(`✗ ${stem}: weder meta.box noch ein »${role}« mit gezeichneter Bildschirm-Lage im Zettel`);
    process.exit(1);
  }
  const m = measure(png, box);
  const wall = measure(png, box, WALL_RING);
  rows.push({
    frame: stem,
    object: meta.object ?? (meta.entities ?? []).find((e) => e.role === role)?.id ?? "?",
    ...m,
    dLWall: wall.dL,
  });
}

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`scale ${RENDER_SCALE}× · frames ${EXPECT_W}px wide`);
  console.log(`ring = THE EDGE ${EDGE_RING.inner}–${EDGE_RING.outer} × object height (R28) · wall ring ${WALL_RING.inner}–${WALL_RING.outer} alongside\n`);
  console.log("frame                 object                  L_obj  L_ring     ΔL  ΔL_wall    p95  clip%     ΔH");
  for (const r of rows) {
    console.log(
      `${r.frame.padEnd(21)} ${String(r.object).padEnd(22)} `
      + `${r.lObj.toFixed(1).padStart(6)} ${r.lRing.toFixed(1).padStart(7)} `
      + `${(r.dL >= 0 ? "+" : "") + r.dL.toFixed(1)}`.padStart(7)
      + ` ${((r.dLWall >= 0 ? "+" : "") + r.dLWall.toFixed(1)).padStart(8)}`
      + ` ${r.p95.toFixed(0).padStart(6)} ${r.clipPct.toFixed(1).padStart(6)} `
      + `${r.dH === null ? "   n/a" : r.dH.toFixed(0).padStart(6)}`,
    );
  }
  const best = Math.max(...rows.map((r) => r.dL));
  console.log(`\n(target: ΔL ≥ +${TARGET_DL} AT THE EDGE — the blind critics' number, given its radius by R28)`);
  console.log(`  best in this set: ${(best >= 0 ? "+" : "") + best.toFixed(1)} → ${best >= TARGET_DL ? "TARGET MET" : `${(TARGET_DL - best).toFixed(1)} short`}`);
}
