// LOOK-2 — prep/QA pass over a generation DROP folder, run BEFORE sync-art.mjs.
// Mechanizes the art loop's QA step: names, formats, dimensions, transparency.
//
//   node docs/art/prep-art.mjs "<drop folder>" [--lib <manifest.json>] [--resize]
//
// Checks per image (against the manifest's stem classes):
//   - filename resolves to a library stem (same longest-suffix rule as sync)
//   - PNG for anything transparent (tiles may be png/jpg; characters MUST be png)
//   - square tiles; warns when not an exact 48px multiple (the engine displays
//     at 48×48 either way, but crisp pixels want exact sizes)
//   - player_sheet aspect 3:4 (3 cols × 4 rows)
// --resize (macOS `sips`) normalizes square tiles to 48×48 IN PLACE in the drop
// folder. Everything else is report-only; nothing here touches the repo.
//
// Exit code 1 when any REQUIRED-class stem present fails a check — so the art
// loop can gate on it.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  if (i === -1) return dflt;
  if (name === "--resize") { args.splice(i, 1); return true; }
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const RESIZE = flag("--resize", false) === true;
const LIB = flag("--lib", "g1-art-files.json");
const SRC = args[0];
if (!SRC || !existsSync(SRC)) { console.error("usage: node docs/art/prep-art.mjs <drop folder> [--lib m.json] [--resize]"); process.exit(1); }

const lib = JSON.parse(readFileSync(join(HERE, LIB), "utf8"));
const stems = lib.stems.map((s) => s.stem).sort((a, b) => b.length - a.length);
const classOf = new Map(lib.stems.map((s) => [s.stem, s.class ?? "tile"]));

function dims(p) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", p], { encoding: "utf8" });
  const w = Number(/pixelWidth: (\d+)/.exec(out)?.[1]);
  const h = Number(/pixelHeight: (\d+)/.exec(out)?.[1]);
  return { w, h };
}

const IMG = /\.(png|jpe?g|webp)$/i;
let fails = 0;
const seen = new Set();
const rows = [];
for (const f of readdirSync(SRC)) {
  if (!IMG.test(f)) continue;
  const base = basename(f, extname(f)).trim();
  const stem = stems.find((s) => base === s || base.endsWith(s));
  const p = join(SRC, f);
  if (!stem) { rows.push(`  ? ${f} — matches no library stem (rename so it ENDS with the stem)`); continue; }
  seen.add(stem);
  const cls = classOf.get(stem);
  const problems = [];
  const isPng = /\.png$/i.test(f);
  if ((cls === "character" || cls === "character-HOLD" || stem === "sparkle") && !isPng) problems.push("must be PNG (needs transparency)");
  const { w, h } = dims(p);
  if (stem === "player_sheet") {
    if (Math.abs(w / h - 3 / 4) > 0.02) problems.push(`sheet aspect ${w}×${h} — want 3:4 (3 cols × 4 rows)`);
  } else if (cls === "tile" || cls === "character" || cls === "character-HOLD") {
    if (w !== h) problems.push(`not square (${w}×${h})`);
    else if (w % 48 !== 0) {
      if (RESIZE && isPng) { execFileSync("sips", ["-z", "48", "48", p]); problems.push(`resized ${w}→48`); }
      else problems.push(`${w}px — not a 48 multiple (use --resize or regenerate)`);
    }
  }
  const bad = problems.some((x) => !x.startsWith("resized"));
  // HOLD-class stems are skipped by sync anyway — report, don't gate.
  if (bad && !String(cls).endsWith("-HOLD")) fails++;
  rows.push(`  ${bad ? "✗" : "✓"} ${f} → ${stem} (${cls}${problems.length ? ": " + problems.join("; ") : ""})`);
}
const missing = lib.stems.filter((s) => !seen.has(s.stem) && !(s.class ?? "").endsWith("-HOLD") && s.class !== "ui-optional");
console.log(`── prep-art (${LIB}) ──\ndrop: ${SRC}`);
for (const r of rows) console.log(r);
console.log(`\nstill to generate (${missing.length}):`);
for (const m of missing) console.log(`  - ${m.stem} (${m.class})`);
if (fails > 0) { console.error(`\n✗ ${fails} image(s) failed QA`); process.exit(1); }
console.log("\n✓ drop folder passes QA — run sync-art.mjs next");
