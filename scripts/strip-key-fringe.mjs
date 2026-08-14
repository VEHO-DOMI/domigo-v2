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
// R5-W3 · A5 · D-51: it repairs BOTH classes now — the cut-edge fringe and the
// isolated speck the importer's own deletion rule would erase. The register
// prescribed this tool for D-51 and it found nothing, because the three pixels
// in `satchel_a.png` are interior and the fringe detector only looks at cut
// edges. Two defects, one repair, one tool — see key-fringe.mjs.
import { keyFringe, keySpecks, readPng, stripKeyFringe, stripKeySpecks, writePng } from "./key-fringe.mjs";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const dry = process.argv.includes("--dry");

// ── R5-W3 · A5 · D-51 · WHY THE SPECK PASS IS OPT-IN ─────────────────────────
//
// The fringe pass is a repair: a cut edge has no business carrying the key, in
// any sheet, ever. The SPECK pass is not automatically that. Censused over the
// shipped kit it finds **1334 px across 74 of 330 stems** — chalk sprites,
// crust caps, plank platforms, the night classroom's band. Some of those are
// leftovers; some are the darkest pixel of a genuinely violet material that
// happens to clear the importer's predicate. Healing 74 sheets that nobody has
// looked at is an ART decision, and this tool does not get to make it.
//
// So: `--specks` opts in, `--only <prefix>` scopes it. D-51's own three pixels
// are healed with `--specks --only satchel`; the rest of the census is a
// register row, not a silent repaint.
const doSpecks = process.argv.includes("--specks");
const onlyAt = process.argv.indexOf("--only");
const only = onlyAt >= 0 ? process.argv[onlyAt + 1] : null;

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
let specks = 0;
const inScope = (stem) => only === null || stem.startsWith(only);
for (const stem of [...stems].sort()) {
  const file = files.get(stem);
  if (!file) continue; // the presence gate owns "missing", not this tool
  if (!inScope(stem)) continue;
  const img = readPng(file);
  if (dry) {
    const hits = keyFringe(img);
    const spx = doSpecks ? keySpecks(img) : [];
    if (hits.length + spx.length > 0) {
      touched++;
      pixels += hits.length;
      specks += spx.length;
      const where = spx.length > 0 ? ` (first speck at ${spx[0].x},${spx[0].y})` : "";
      console.log(`  ${stem}: ${hits.length} fringe px · ${spx.length} speck px${where}`);
    }
    continue;
  }
  const res = stripKeyFringe(img);
  const sres = doSpecks ? stripKeySpecks(img) : { healed: 0, cut: 0, total: 0 };
  if (res.total + sres.total === 0) continue;
  writePng(file, img);
  touched++;
  pixels += res.total;
  specks += sres.total;
  console.log(`  ${stem}: ${res.total} fringe px, ${sres.total} speck px (${res.healed + sres.healed} healed, ${res.cut + sres.cut} loose strands cut)`);
}

const scope = `${only === null ? "" : ` · scope "${only}*"`}${doSpecks ? "" : " · specks NOT scanned (pass --specks)"}`;
console.log(
  dry
    ? `strip-key-fringe --dry: ${pixels} fringe px + ${specks} speck px across ${touched}/${stems.size} painted stems${scope}`
    : `strip-key-fringe: repaired ${pixels} fringe px + ${specks} speck px across ${touched}/${stems.size} painted stems${scope}`,
);
