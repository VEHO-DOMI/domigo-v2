// One-shot importer for the Grade-3 images generated for the OLD single-file app.
//
//   node docs/art/import-g3-legacy.mjs            → dry run, reports exactly what it would do
//   node docs/art/import-g3-legacy.mjs --write    → copies + compresses into public/art/g3/
//
// Why this exists instead of sync-art.mjs: that tool matches a file to a stem by the stem
// appearing at the END of the filename. These filenames defeat it twice over — they carry
// the OLD app's names, not this one's ("g3-ch09-scene-storyB"), and they trail off into
// prose ("… g3-ch01-social-youtube-upload.jpg -- alongside Story B or Completion.png").
// The mapping is semantic, so it is written out by hand in g3-legacy-map.json and applied
// here. sync-art.mjs is left untouched and remains the tool for FUTURE drops, where the
// files are saved under the exact stem the prompt page tells you to use.
//
// Compression is not optional: the source folder is ~133 MB for 98 files (~1.4 MB each).
// The ceiling below is calibrated against what this repo already ships — the G1 paint art
// is 93 MB across 207 files with single plates over 4 MB — so 400 KB per story image is
// comfortably conservative, not stingy. Each class has a width ceiling from the prompt
// library (`maxPx`), everything is re-encoded as JPEG, and wide slots are cropped to 16:9.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const WRITE = process.argv.includes("--write");
const DEST = join(REPO, "apps", "web", "public", "art", "g3");
const SRC_ROOT = join(homedir(),
  "Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Claude/Grammar trainer Grades 1 to 4/CAMPAIGN-IMAGES/grade 3");
const SUBFOLDERS = ["Already implemented", "to be added to grade 3"];
const MAX_BYTES = 400_000;

const { map, drop } = JSON.parse(readFileSync(join(HERE, "g3-legacy-map.json"), "utf8"));
const lib = JSON.parse(readFileSync(join(HERE, "g3-art-files.json"), "utf8"));
const maxPx = new Map(lib.stems.map((s) => [s.stem, s.maxPx]));
const clsOf = new Map(lib.stems.map((s) => [s.stem, s.class]));

/** Pixel dimensions of an image, via sips. */
function dims(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const w = Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const h = Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return [w, h];
}

if (!existsSync(SRC_ROOT)) {
  console.error(`✗ source folder not found (iCloud may have evicted it — open it in Finder once):\n  ${SRC_ROOT}`);
  process.exit(1);
}

// token → the file that carries it. The token is the old app's name, embedded anywhere in
// the filename; note the capital A/B of storyA/storyB, which a lowercase-only match loses.
const byToken = new Map();
for (const sub of SUBFOLDERS) {
  const dir = join(SRC_ROOT, sub);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (f.startsWith(".") || !/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const m = f.match(/g3-[a-zA-Z0-9-]+/);
    if (m) byToken.set(m[0], join(dir, f));
  }
}

const plan = [];
const missing = [];
for (const [stem, token] of Object.entries(map)) {
  if (!maxPx.has(stem)) {
    missing.push(`${stem}: not a stem in the prompt library (renamed or removed?)`);
    continue;
  }
  const src = byToken.get(token);
  if (!src) {
    missing.push(`${stem}: source "${token}" not found in the iCloud folder`);
    continue;
  }
  plan.push({ stem, token, src, width: maxPx.get(stem), cls: clsOf.get(stem) });
}

console.log(`── import-g3-legacy ──`);
console.log(`source: ${SRC_ROOT}`);
console.log(`dest:   ${DEST}`);
console.log(`mapped: ${plan.length} · dropped by design: ${Object.keys(drop).length}`);

if (missing.length) {
  console.error(`\n✗ ${missing.length} mapping(s) could not be resolved — the map is out of date:`);
  for (const m of missing) console.error("  - " + m);
  process.exit(1);
}

if (!WRITE) {
  for (const p of plan) {
    const kb = Math.round(statSync(p.src).size / 1024);
    console.log(`  ${p.stem.padEnd(22)} ← ${p.token.padEnd(30)} (${kb} KB → ≤${p.width}px, ≤${MAX_BYTES / 1000} KB)`);
  }
  console.log(`\nDry run. Re-run with --write to import ${plan.length} image(s).`);
  process.exit(0);
}

mkdirSync(DEST, { recursive: true });
let bytesIn = 0, bytesOut = 0, oversize = 0;
for (const p of plan) {
  const out = join(DEST, `${p.stem}.jpg`);
  bytesIn += statSync(p.src).size;
  copyFileSync(p.src, out);
  try {
    // The old library was generated SQUARE, but every wide slot renders in a 16:9 box
    // with `object-fit: cover` — so the browser throws that extra height away on every
    // paint anyway. Cropping to 16:9 here is visually identical and cuts ~40% of the
    // bytes. Portraits stay square: they are shown as circles.
    const args = ["-s", "format", "jpeg", "-s", "formatOptions", "72"];
    if (p.cls !== "portrait") {
      const [w, h] = dims(p.src);
      if (w / h < 16 / 9) args.unshift("-c", String(Math.round(w * 9 / 16)), String(w));
    }
    // `sips` -Z scales the LONGEST side, preserving aspect.
    execFileSync("sips", [...args, "-Z", String(p.width), out, "--out", out], { stdio: "pipe" });
  } catch (e) {
    console.warn(`  ⚠ ${p.stem}: could not compress (${e.message.split("\n")[0]}) — copied at full size`);
  }
  const size = statSync(out).size;
  bytesOut += size;
  if (size > MAX_BYTES) {
    oversize++;
    console.warn(`  ⚠ ${p.stem}: still ${Math.round(size / 1024)} KB after compression`);
  }
  console.log(`  ✓ ${basename(out)}  ${Math.round(size / 1024)} KB`);
}
console.log(`\n✓ imported ${plan.length} image(s): ${Math.round(bytesIn / 1e6)} MB in → `
  + `${Math.round(bytesOut / 1e6 * 10) / 10} MB out`);
if (oversize) console.warn(`⚠ ${oversize} file(s) are over ${MAX_BYTES / 1000} KB — check before committing.`);
console.log(`Reload /play/3/ch01 — the resolver re-reads this folder on every request, so no rebuild is needed.`);
