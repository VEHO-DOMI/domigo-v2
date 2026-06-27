// Syncs Koki's generated images (messily named, e.g. "Mina — full-body reference
// mina_ref.jpeg", mixed .png/.jpeg) into apps/web/public/art/g2/<stem>.<ext>, so
// the runtime can serve them. Each drop file is matched to a library STEM by the
// stem appearing at the end of the filename (longest match wins). Re-runnable.
//
//   node docs/art/sync-art.mjs ["<source folder>"]
//
// Default source = docs/art/Domigo Grade 2 story mode generated images/

import { readdirSync, copyFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, basename } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const SRC = process.argv[2] ?? join(HERE, "Domigo Grade 2 story mode generated images");
const DEST = join(REPO, "apps", "web", "public", "art", "g2");

const lib = JSON.parse(readFileSync(join(HERE, "g2-art-files.json"), "utf8"));
// longest stems first so "ben_ref" wins over a hypothetical "ben" prefix collision
const stems = lib.stems.map((s) => s.stem).sort((a, b) => b.length - a.length);

if (!existsSync(SRC)) { console.error(`✗ source folder not found: ${SRC}`); process.exit(1); }
mkdirSync(DEST, { recursive: true });

const IMG = /\.(png|jpe?g|webp)$/i;
let matched = 0;
const unmatched = [];
const used = new Map(); // stem → source basename (collision report)

for (const f of readdirSync(SRC)) {
  if (!IMG.test(f)) continue;
  const ext = extname(f).toLowerCase().replace(".jpeg", ".jpg");
  const base = basename(f, extname(f)).trim();
  const stem = stems.find((s) => base === s || base.endsWith(s));
  if (!stem) { unmatched.push(f); continue; }
  if (used.has(stem)) console.warn(`  ⚠ ${stem}: "${f}" overwrites "${used.get(stem)}"`);
  used.set(stem, f);
  copyFileSync(join(SRC, f), join(DEST, `${stem}${ext}`));
  matched++;
}

console.log(`── sync-art ──\nsource: ${SRC}\ndest:   ${DEST}`);
console.log(`✓ synced ${matched} image(s) → ${DEST}`);
const have = used.size, total = stems.length;
console.log(`coverage: ${have}/${total} library stems present (${total - have} still to generate)`);
if (unmatched.length) { console.warn(`\n⚠ ${unmatched.length} file(s) matched no stem (skipped):`); for (const u of unmatched) console.warn("  - " + u); }
