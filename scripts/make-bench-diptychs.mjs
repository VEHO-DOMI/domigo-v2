#!/usr/bin/env node
/**
 * make-bench-diptychs — pair each before-shot with its after-shot into ONE
 * image, so a reviewer sees the change instead of two browser tabs (R5-W1 · D1).
 *
 * Usage: node scripts/make-bench-diptychs.mjs <vorherDir> <nachherDir> <outDir>
 *
 * The bench shoots at 2× for the critics' eyes; a review gallery of 2 MB frames
 * is a gallery nobody opens, so each side is box-averaged back down to 1× —
 * which is exactly the size a child's screen shows. `pngjs` is the repo's own
 * declared dev dependency; `sharp` is only a transitive one and a script that
 * reaches for it works until the day it does not.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const [beforeDir, afterDir, outDir] = process.argv.slice(2);
if (!beforeDir || !afterDir || !outDir) {
  console.error("usage: node scripts/make-bench-diptychs.mjs <vorherDir> <nachherDir> <outDir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

/** average each 2×2 block — a 2× capture back to the size it is played at */
const halve = (src) => {
  const w = Math.floor(src.width / 2);
  const h = Math.floor(src.height / 2);
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 4; c++) {
        const at = (yy, xx) => src.data[((src.width * yy + xx) << 2) + c];
        out.data[((w * y + x) << 2) + c] =
          (at(y * 2, x * 2) + at(y * 2, x * 2 + 1) + at(y * 2 + 1, x * 2) + at(y * 2 + 1, x * 2 + 1)) >> 2;
      }
    }
  }
  return out;
};

const GAP = 8;
const BG = [23, 19, 16, 255];

const ids = readdirSync(afterDir).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)).sort();
let made = 0;
for (const id of ids) {
  const bPath = path.join(beforeDir, `${id}.png`);
  const aPath = path.join(afterDir, `${id}.png`);
  if (!existsSync(bPath)) { console.log(`  – ${id} (kein Vorher-Bild)`); continue; }
  // one halving = the size the game is played at; two = a review thumbnail
  // that a repository can carry without becoming an image host
  const times = process.argv.includes("--thumb") ? 2 : 1;
  let b = PNG.sync.read(readFileSync(bPath));
  let a = PNG.sync.read(readFileSync(aPath));
  for (let i = 0; i < times; i++) { b = halve(b); a = halve(a); }
  const W = b.width + GAP + a.width;
  const H = Math.max(b.height, a.height);
  const out = new PNG({ width: W, height: H });
  for (let i = 0; i < W * H; i++) for (let c = 0; c < 4; c++) out.data[(i << 2) + c] = BG[c];
  const blit = (img, dx) => {
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        for (let c = 0; c < 4; c++) {
          out.data[((W * y + x + dx) << 2) + c] = img.data[((img.width * y + x) << 2) + c];
        }
      }
    }
  };
  blit(b, 0);
  blit(a, b.width + GAP);
  writeFileSync(path.join(outDir, `${id}.png`), PNG.sync.write(out, { deflateLevel: 9 }));
  made += 1;
  console.log(`  ✓ ${id}  (links VORHER · rechts NACHHER)`);
}
console.log(`make-bench-diptychs: ${made} Vorher|Nachher-Paar(e) → ${outDir}`);
