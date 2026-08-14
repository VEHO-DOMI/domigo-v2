#!/usr/bin/env node
// R5-W3 · A5 · A PLANE'S VALUE IS A NUMBER, SO CHANGING IT IS A SCRIPT.
//
// Koki, replaying the arena: „Ohrensessel statt Schulstühle." The empty school
// chairs are the room's whole premise — the story bible's „Reihen leerer Stühle
// … die Klasse fehlt, und das Loch ist die Erzählung" — and they were standing
// BEHIND the blue armchairs, because as the near furniture row they measured
// 22.26 % against a band that ends at 21.0 % (check-composition.mjs audit 1,
// `bandsFor(K)` at K = 28). H1 parked them in the far row rather than bend a
// measured law, and said so in composition.ts. This is the round that pays it.
//
// ── WHY A SCRIPT AND NOT AN EDITED PNG ───────────────────────────────────────
//  · REPRODUCIBLE. The target is DECLARED here, next to the reason. Anyone can
//    re-derive the shipped sheet instead of taking a binary diff on faith.
//  · REBASE-SAFE. Art bytes conflict badly, and E5's lossless recompression
//    lands before this branch. A conflict is resolved by re-running, not by
//    merging pixels.
//  · IDEMPOTENT. A sheet already inside tolerance is left untouched, byte for
//    byte, so running twice is running once.
//  · HONEST. The audits measure the SOURCE pixels, not the drawn result. A
//    runtime tint would move what the room looks like without moving what the
//    gate reads — the two would drift apart, which is the exact failure mode
//    audit 10c exists to prevent. So the sheet itself changes.
//
// ── THE OPERATION ────────────────────────────────────────────────────────────
// One multiplicative factor on R, G and B; alpha untouched. Chosen because
// relative luminance is LINEAR in the channels, so a factor k moves the mean
// by exactly k and nothing else has to be guessed — and because (max − min) /
// max is scale-invariant, HSV saturation comes out unchanged. This is a VALUE
// pass in the painter's sense: the same painting, at a different key. Hue and
// chroma stay the artist's.
//
// Run: node scripts/set-plane-value.mjs [--dry]
//      node scripts/set-plane-value.mjs --selftest
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const R = process.cwd();
const ART = path.join(R, "apps/web/public/art/g1/paint");

/**
 * The declared targets. `was` is documentation of the shipped value at the time
 * the target was set — the script never asserts it, because after the first run
 * it is no longer true. Git holds the original.
 */
const TARGETS = {
  band_p4_audience: {
    lum: 14.8,
    was: 22.26,
    why:
      "the arena's NEAR furniture row (R15). Two laws pin it: audit 1's L2 band "
      + "[14.0, 21.0] at K=28, and the ABSOLUTE L2↔L3 separation of 12 points "
      + "against an L3 of 27.5 % — which needs L2 ≤ 15.5. The window is therefore "
      + "[14.0, 15.5] and 14.8 sits in the middle of it, 0.8 from either wall. "
      + "Hitting it is what lets SEPARATION_WAIVERS drop ch01/p4 and the "
      + "readability law guard this room again.",
  },
};

/** Tolerance in luminance points. Tight enough to pin the sheet, loose enough
 *  that 8-bit rounding over ~20k samples is never the reason for a rewrite. */
const TOL = 0.05;

// The measure is check-composition.mjs's, character for character: same three
// coefficients, same 3-px stride, same alpha ≥ 128 visibility rule. One measure,
// two tools — a repair that measured differently from the gate would be a repair
// aimed at the wrong number.
const lumOf = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const meanLum = (png) => {
  let n = 0;
  let lum = 0;
  for (let y = 0; y < png.height; y += 3) {
    for (let x = 0; x < png.width; x += 3) {
      const i = (png.width * y + x) << 2;
      if (png.data[i + 3] < 128) continue;
      lum += lumOf(png.data[i], png.data[i + 1], png.data[i + 2]);
      n++;
    }
  }
  return n === 0 ? null : (lum / n) * 100;
};

const scaled = (png, k) => {
  const out = new PNG({ width: png.width, height: png.height });
  for (let i = 0; i < png.data.length; i += 4) {
    out.data[i] = Math.min(255, Math.round(png.data[i] * k));
    out.data[i + 1] = Math.min(255, Math.round(png.data[i + 1] * k));
    out.data[i + 2] = Math.min(255, Math.round(png.data[i + 2] * k));
    out.data[i + 3] = png.data[i + 3];
  }
  return out;
};

/** Solve for the factor that lands the mean on `target`. Rounding to 8 bits
 *  makes one division an estimate rather than an answer, so it is refined —
 *  always from the ORIGINAL pixels, never by stacking passes, because stacking
 *  would make the result depend on how many times the script had been run. */
const fitToTarget = (png, target) => {
  let k = target / meanLum(png);
  let best = null;
  for (let pass = 0; pass < 8; pass++) {
    const candidate = scaled(png, k);
    const got = meanLum(candidate);
    if (best === null || Math.abs(got - target) < Math.abs(best.got - target)) best = { png: candidate, got, k };
    if (Math.abs(got - target) <= TOL) break;
    k *= target / got;
  }
  return best;
};

const findStem = (stem) => {
  for (const dir of ["ch01", "hero"]) {
    const p = path.join(ART, dir, `${stem}.png`);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// ── selftest: the tool proves its own arithmetic before anyone trusts a number
// it printed. A repair tool that cannot demonstrate it hits a declared value is
// a repair tool nobody can defend (measure-presence.mjs's rule, borrowed).
if (process.argv.includes("--selftest")) {
  const png = new PNG({ width: 60, height: 60 });
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 200; png.data[i + 1] = 160; png.data[i + 2] = 120; png.data[i + 3] = 255;
  }
  const before = meanLum(png);
  const fitted = fitToTarget(png, before / 2);
  const drift = Math.abs(fitted.got - before / 2);
  console.log(`selftest: ${before.toFixed(3)} % → ${fitted.got.toFixed(3)} % (target ${(before / 2).toFixed(3)} %, drift ${drift.toFixed(4)})`);
  if (drift > TOL) { console.error(`✗ selftest: missed its own target by ${drift.toFixed(4)} points`); process.exit(1); }
  // …and saturation must survive the pass, or this stopped being a value pass.
  const satOf = (r, g, b) => (Math.max(r, g, b) === 0 ? 0 : (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b));
  const s0 = satOf(200, 160, 120);
  const s1 = satOf(fitted.png.data[0], fitted.png.data[1], fitted.png.data[2]);
  console.log(`selftest: saturation ${(s0 * 100).toFixed(2)} % → ${(s1 * 100).toFixed(2)} %`);
  if (Math.abs(s0 - s1) > 0.01) { console.error("✗ selftest: the pass moved saturation — it is not a value pass"); process.exit(1); }
  console.log("✓ selftest passed");
  process.exit(0);
}

const dry = process.argv.includes("--dry");
let failures = 0;
let wrote = 0;

for (const [stem, spec] of Object.entries(TARGETS)) {
  const file = findStem(stem);
  if (!file) { console.error(`✗ ${stem}: not on disk`); failures++; continue; }
  const png = PNG.sync.read(fs.readFileSync(file));
  const got = meanLum(png);
  if (got === null) { console.error(`✗ ${stem}: no visible pixels to measure`); failures++; continue; }

  if (Math.abs(got - spec.lum) <= TOL) {
    console.log(`  ${stem}: ${got.toFixed(2)} % — already at its declared ${spec.lum} % (±${TOL}), untouched`);
    continue;
  }

  const fitted = fitToTarget(png, spec.lum);
  if (Math.abs(fitted.got - spec.lum) > TOL) {
    console.error(`✗ ${stem}: could not reach ${spec.lum} % — closest ${fitted.got.toFixed(3)} % at k=${fitted.k.toFixed(5)}`);
    failures++;
    continue;
  }
  console.log(`  ${stem}: ${got.toFixed(2)} % → ${fitted.got.toFixed(2)} % (k = ${fitted.k.toFixed(4)})${dry ? "  [dry]" : ""}`);
  if (!dry) { fs.writeFileSync(file, PNG.sync.write(fitted.png)); wrote++; }
}

console.log(dry ? "\ndry run — nothing written" : `\n${wrote} sheet(s) written`);
process.exit(failures > 0 ? 1 : 0);
