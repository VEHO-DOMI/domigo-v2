#!/usr/bin/env node
// R5-W4 · D3 · F-30 · HOW DARK IS THE WORLD BEHIND THE CARD?
//
// Run:  node scripts/measure-veil.mjs <beforeDir> <afterDir> [--json]
//       node scripts/measure-veil.mjs --selftest
//
// Koki, 15 August, on the task mode of his own Keen run: „alles ausgeblendet,
// nur die Aufgabe … man konzentriert sich voll darauf." R52 turned that into a
// ruling. A ruling about how dark something is needs a number, or the next
// round argues about adjectives — J2's whole geometry round was lost to exactly
// that, and its lesson (a critic's claim is a specification, the number is
// yours to measure) is the reason this file exists.
//
// WHAT IT MEASURES. The mean relative luminance of the WORLD — every pixel of
// the stage that is neither the card nor the lit focus hole. The card is found
// by its own paper, not by a hand-typed rectangle: card pixels are the bright
// warm ones (the parchment runs about 0.85 luminance against a veiled world an
// order of magnitude below it), so the split is a property of the picture and
// not of my guess about where the card was that day.
//
//  · ONE luminance formula, the same three coefficients check-composition.mjs
//    and measure-presence.mjs use (0.2126 / 0.7152 / 0.0722). One measure,
//    three tools, no drift.
//  · IT PRINTS the pixel counts it split on. A mean over an unknown population
//    is an anecdote, and „15 %" of nothing is not a measurement.
//  · --selftest builds two frames of KNOWN luminance and asserts the answer to
//    ±0,5 percentage points, including the case that matters most: a frame
//    where the card is large enough that including it would flip the verdict.
//    AN UNVERIFIED MEASURING TOOL IS HOW A ROUND SHIPS A NUMBER NOBODY CAN
//    DEFEND (measure-presence's own words, and it was right).
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

/** the house luminance, 0…1 */
const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** A pixel belongs to the CARD (or its lit hole) rather than to the veiled
 *  world when it is bright. The veil takes the world to a small fraction; the
 *  parchment does not go there. 0.42 sits in the empty valley between them. */
const CARD_FLOOR = 0.42;

export const veilOf = (png) => {
  let world = 0, worldSum = 0, card = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const l = lum(png.data[i], png.data[i + 1], png.data[i + 2]);
    if (l >= CARD_FLOOR) { card++; continue; }
    world++; worldSum += l;
  }
  return { meanWorld: world ? worldSum / world : 0, worldPx: world, cardPx: card };
};

const readDir = (dir) =>
  fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort()
    .map((f) => ({ f, png: PNG.sync.read(fs.readFileSync(path.join(dir, f))) }));

const pct = (x) => `${(x * 100).toFixed(1)} %`;

const selftest = () => {
  const make = (worldL, cardL, cardFrac) => {
    const W = 200, H = 100;
    const png = new PNG({ width: W, height: H });
    const cardCols = Math.round(W * cardFrac);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const v = Math.round((x < cardCols ? cardL : worldL) * 255);
        png.data[i] = v; png.data[i + 1] = v; png.data[i + 2] = v; png.data[i + 3] = 255;
      }
    }
    return png;
  };
  let ok = true;
  const near = (got, want, why) => {
    if (Math.abs(got - want) > 0.005) { ok = false; console.error(`  ✗ ${why}: ${pct(got)} vs ${pct(want)}`); }
    else console.log(`  ✓ ${why}: ${pct(got)}`);
  };
  // a grey world with no card at all
  near(veilOf(make(0.30, 0.30, 0)).meanWorld, 0.30, "flat world reads its own value");
  // THE CASE THAT MATTERS: half the frame is bright card. A tool that averaged
  // the whole picture would report ~0.47 here and call a dark world a bright
  // one — this is the discriminating case, not a rounder of the first.
  const half = veilOf(make(0.08, 0.86, 0.5));
  near(half.meanWorld, 0.08, "a big bright card does not lift the world's mean");
  if (half.cardPx !== half.worldPx) { ok = false; console.error(`  ✗ split is wrong: ${half.cardPx} card vs ${half.worldPx} world`); }
  else console.log(`  ✓ split counted both halves: ${half.cardPx} / ${half.worldPx}`);
  // and the floor itself: a mid pixel just under it is world, just over is card
  near(veilOf(make(CARD_FLOOR - 0.02, 0, 0)).meanWorld, CARD_FLOOR - 0.02, "just under the floor is world");
  if (veilOf(make(0, CARD_FLOOR + 0.02, 1)).worldPx !== 0) { ok = false; console.error("  ✗ just over the floor is not card"); }
  else console.log("  ✓ just over the floor is card");
  console.log(ok ? "measure-veil --selftest: OK" : "measure-veil --selftest: FAILED — do not trust any number this tool prints");
  process.exit(ok ? 0 : 1);
};

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) selftest();

const [beforeDir, afterDir] = argv.filter((a) => !a.startsWith("--"));
if (!beforeDir || !afterDir) {
  console.error("usage: measure-veil.mjs <beforeDir> <afterDir> [--json] | --selftest");
  process.exit(2);
}
const before = new Map(readDir(beforeDir).map((x) => [x.f, veilOf(x.png)]));
const after = new Map(readDir(afterDir).map((x) => [x.f, veilOf(x.png)]));
const rows = [...after.keys()].filter((f) => before.has(f)).map((f) => ({
  surface: f.replace(/\.png$/, ""),
  before: before.get(f).meanWorld,
  after: after.get(f).meanWorld,
  worldPx: after.get(f).worldPx,
  cardPx: after.get(f).cardPx,
}));
if (argv.includes("--json")) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
console.log("surface            world before   world after   world px / card px");
for (const r of rows) {
  console.log(`${r.surface.padEnd(18)} ${pct(r.before).padStart(12)} ${pct(r.after).padStart(13)}   ${r.worldPx} / ${r.cardPx}`);
}
const worst = rows.reduce((a, b) => (b.after > a.after ? b : a), rows[0]);
console.log(`\nR52 target: the world outside card and hole at 15 % or less.`);
console.log(`darkest-case surface: ${worst.surface} at ${pct(worst.after)} — ${worst.after <= 0.15 ? "MET" : "NOT met"}`);
