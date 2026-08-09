#!/usr/bin/env node
// PK-R6 · H1 · THE FRINGE REPAIR TOOL. Removes the magenta colour-key skin the
// Batch-AF cut-out left on the TRAVERSAL SURFACES — the crust course, its caps
// and trims, the interior bands, the ramps, the slide, and the floating
// platform objects (composition.ts `massStems`). Those are the stems that TILE,
// so their defects repeat under the player's feet for a whole chapter.
//
// Run:  node --experimental-strip-types scripts/strip-key-fringe.mjs [--dry]
// The matching gate is in check-paint-art.mjs, so a re-import that brings the
// fringe back fails CI instead of shipping.
//
// Idempotent by construction: a healed pixel is no longer key-coloured, so a
// second run finds nothing.

import fs from "node:fs";
import path from "node:path";
import { COMPOSITION, massStems } from "../packages/game-paint/src/composition.ts";
import { CHALK_PROJECTILE_STEMS } from "../packages/game-paint/src/entities.ts";
import { keyFringe, readPng, stripKeyFringe, writePng } from "./key-fringe.mjs";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const dry = process.argv.includes("--dry");

const files = new Map(); // stem → absolute path
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) files.set(e.name.replace(/\.png$/, ""), path.join(dir, e.name));
  }
};
walk(ART_ROOT);

const stems = new Set();
for (const phases of Object.values(COMPOSITION)) {
  for (const spec of Object.values(phases)) for (const stem of massStems(spec.mass)) stems.add(stem);
}
// …and the chalk the boss throws (PK-R6 · H1, round-1 critique finding 5) —
// same key, same repair, and the gate keeps both clean from here on.
for (const stem of CHALK_PROJECTILE_STEMS) stems.add(stem);

let touched = 0;
let pixels = 0;
for (const stem of [...stems].sort()) {
  const file = files.get(stem);
  if (!file) continue; // the presence gate owns "missing", not this tool
  const img = readPng(file);
  if (dry) {
    const hits = keyFringe(img);
    if (hits.length > 0) { touched++; pixels += hits.length; console.log(`  ${stem}: ${hits.length} fringe px`); }
    continue;
  }
  const res = stripKeyFringe(img);
  if (res.total === 0) continue;
  writePng(file, img);
  touched++;
  pixels += res.total;
  console.log(`  ${stem}: ${res.total} fringe px (${res.healed} healed, ${res.cut} loose strands cut)`);
}

console.log(
  dry
    ? `strip-key-fringe --dry: ${pixels} fringe px across ${touched}/${stems.size} traversal stems`
    : `strip-key-fringe: repaired ${pixels} px across ${touched}/${stems.size} traversal stems`,
);
