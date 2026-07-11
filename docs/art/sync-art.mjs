// Syncs Koki's generated images (messily named, e.g. "Mina — full-body reference
// mina_ref.jpeg", mixed .png/.jpeg) into apps/web/public/art/<dest>/<stem>.<ext>,
// so the runtime can serve them. Each drop file is matched to a library STEM by
// the stem appearing at the end of the filename (longest match wins). Re-runnable.
//
//   node docs/art/sync-art.mjs ["<source folder>"] [--lib <manifest.json>] [--dest <subdir>]
//
// Defaults preserve the original G2 behavior:
//   --lib  g2-art-files.json   --dest g2
// G1 school zone (LOOK-2):
//   node docs/art/sync-art.mjs "<iCloud drop>/g1-school" --lib g1-art-files.json --dest g1/school
//
// Run prep-art.mjs on the drop folder FIRST — it QAs dimensions/format and can
// normalize sizes; sync copies verbatim.

import { readdirSync, copyFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  if (i === -1) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const LIB = flag("--lib", "g2-art-files.json");
const DEST_SUB = flag("--dest", "g2");
const SRC = args[0] ?? join(HERE, "Domigo Grade 2 story mode generated images");
const DEST = join(REPO, "apps", "web", "public", "art", ...DEST_SUB.split("/"));

const lib = JSON.parse(readFileSync(join(HERE, LIB), "utf8"));
// longest stems first so "ben_ref" wins over a hypothetical "ben" prefix collision
const stems = lib.stems.map((s) => s.stem).sort((a, b) => b.length - a.length);
const holds = new Set(lib.stems.filter((s) => typeof s.class === "string" && s.class.endsWith("-HOLD")).map((s) => s.stem));

if (!existsSync(SRC)) { console.error(`✗ source folder not found: ${SRC}`); process.exit(1); }
mkdirSync(DEST, { recursive: true });

const IMG = /\.(png|jpe?g|webp)$/i;
let matched = 0;
const unmatched = [];
const skippedHold = [];
const used = new Map(); // stem → source basename (collision report)

for (const f of readdirSync(SRC)) {
  if (!IMG.test(f)) continue;
  const ext = extname(f).toLowerCase().replace(".jpeg", ".jpg");
  const base = basename(f, extname(f)).trim();
  const stem = stems.find((s) => base === s || base.endsWith(s));
  if (!stem) { unmatched.push(f); continue; }
  if (holds.has(stem)) { skippedHold.push(f); continue; } // LOOK-0: player identity decision pending
  if (used.has(stem)) console.warn(`  ⚠ ${stem}: "${f}" overwrites "${used.get(stem)}"`);
  used.set(stem, f);
  copyFileSync(join(SRC, f), join(DEST, `${stem}${ext}`));
  matched++;
}

console.log(`── sync-art ──\nlib:    ${LIB}\nsource: ${SRC}\ndest:   ${DEST}`);
console.log(`✓ synced ${matched} image(s) → ${DEST}`);
const have = used.size, total = stems.length - holds.size;
console.log(`coverage: ${have}/${total} syncable library stems present (${total - have} still to generate)`);
if (skippedHold.length) { console.warn(`\n⏸ ${skippedHold.length} file(s) skipped — stem is ON HOLD (player-identity decision, see LOOK-0):`); for (const s of skippedHold) console.warn("  - " + s); }
if (unmatched.length) { console.warn(`\n⚠ ${unmatched.length} file(s) matched no stem (skipped):`); for (const u of unmatched) console.warn("  - " + u); }
