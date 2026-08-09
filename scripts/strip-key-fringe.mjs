#!/usr/bin/env node
// PK-R6 · H1/H2 · THE FRINGE REPAIR TOOL. Removes the magenta colour-key skin
// the Batch-AF cut-out left on EVERY sheet in the paint kit — H1 repaired the
// traversal surfaces (the stems that tile under the child's feet); H2 widened it
// to the whole delivery after round 2 read the same pink skin on the foliage and
// the window mullion of a still frame. See the block above `stems` below.
//
// Run:  node --experimental-strip-types scripts/strip-key-fringe.mjs [--dry]
// The matching gate is in check-paint-art.mjs, so a re-import that brings the
// fringe back fails CI instead of shipping.
//
// Idempotent by construction: a healed pixel is no longer key-coloured, so a
// second run finds nothing.

import fs from "node:fs";
import path from "node:path";
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

// PK-R6 · H2 (round-2 finding 2: „visible magenta cutout-fringe halos around
// the foliage/window-post edges"). H1 repaired the stems that TILE and left the
// rest, because a repeated defect is the one a child stares at. True, and not
// the whole truth: the key was on the WHOLE delivery, so any still frame that
// put a cut leaf or a window mullion against a bright wall showed the same pink
// skin. The tool now repairs every sheet in the kit, and check-paint-art gates
// every sheet in the kit — the class, not the instance.
const stems = new Set(files.keys());

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
    ? `strip-key-fringe --dry: ${pixels} fringe px across ${touched}/${stems.size} painted stems`
    : `strip-key-fringe: repaired ${pixels} px across ${touched}/${stems.size} painted stems`,
);
