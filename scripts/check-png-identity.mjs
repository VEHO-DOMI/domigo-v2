#!/usr/bin/env node
// R5-W3 · E5 · „GAR KEIN QUALITÄTSVERLUST" — BEWIESEN, NICHT BEHAUPTET.
//
// Kokis Weisung vom 11.08. steht wörtlich: vor jeder Komprimierung erst alles
// verifizieren, KEIN Qualitätsverlust. Verlustfreie Nachverdichtung erfüllt das
// — aber „verlustfrei" ist die Behauptung des Werkzeugs über sich selbst, und
// ein Selbstbericht ist kein Beweis (die Lehre der I1-Sitzung, zwei Minuten
// Nachmessen).
//
// Also wird es nachgemessen: für JEDE geänderte PNG-Datei wird die Fassung aus
// git und die Fassung auf der Platte dekodiert und Bildpunkt für Bildpunkt
// verglichen — Breite, Höhe und alle vier Kanäle. Eine einzige Abweichung ist
// ein Abbruch. Verglichen werden die BILDPUNKTE, nicht die Bytes: eine kleinere
// Datei mit identischen Bildpunkten ist genau das Ziel.
//
// Run: node scripts/check-png-identity.mjs [--ref <git-ref>]
//      node scripts/check-png-identity.mjs --selftest   (proves the red light works)
//
// Ohne --ref wird gegen HEAD verglichen, also gegen den letzten Commit.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const ref = args.includes("--ref") ? args[args.indexOf("--ref") + 1] : "HEAD";
const selftest = args.includes("--selftest");

/** decode a PNG buffer to {w,h,data} — throws on anything that is not one */
const decode = (buf) => {
  const png = PNG.sync.read(buf);
  return { w: png.width, h: png.height, data: png.data };
};

/** the first pixel where two decoded images differ, or null if they are identical */
const firstDifference = (a, b) => {
  if (a.w !== b.w || a.h !== b.h) return { kind: "size", was: `${a.w}×${a.h}`, now: `${b.w}×${b.h}` };
  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) {
      const px = Math.floor(i / 4);
      const ch = ["R", "G", "B", "A"][i % 4];
      return { kind: "pixel", x: px % a.w, y: Math.floor(px / a.w), channel: ch, was: a.data[i], now: b.data[i] };
    }
  }
  return null;
};

if (selftest) {
  // THE CHECK MUST BE ABLE TO GO RED. Build two images that differ in exactly
  // one channel of one pixel — the smallest defect a recompressor could
  // possibly introduce — and prove the comparison finds it and names it.
  const make = (tweak) => {
    const p = new PNG({ width: 4, height: 4 });
    for (let i = 0; i < p.data.length; i += 4) {
      p.data[i] = 10; p.data[i + 1] = 20; p.data[i + 2] = 30; p.data[i + 3] = 255;
    }
    if (tweak) p.data[4 * (4 * 2 + 1) + 1] = 21; // one green channel, pixel (1,2)
    return decode(PNG.sync.write(p));
  };
  const same = firstDifference(make(false), make(false));
  const diff = firstDifference(make(false), make(true));
  let bad = 0;
  if (same !== null) { bad++; console.error("✗ identical images reported as different:", same); }
  if (diff === null) { bad++; console.error("✗ a one-channel difference went UNDETECTED — this check proves nothing"); }
  else if (!(diff.x === 1 && diff.y === 2 && diff.channel === "G" && diff.was === 20 && diff.now === 21)) {
    bad++; console.error("✗ the difference was found but misdescribed:", diff);
  }
  // and a size change must be caught too, not silently compared channel-wise
  const small = decode(PNG.sync.write(new PNG({ width: 2, height: 2 })));
  if (firstDifference(make(false), small)?.kind !== "size") { bad++; console.error("✗ a size change went undetected"); }
  if (bad > 0) { console.error("check-png-identity selftest: FAILED"); process.exit(1); }
  console.log("✓ selftest: one changed channel in one pixel is found and named; a size change is found; identical images pass.");
  process.exit(0);
}

const changed = execFileSync("git", ["diff", "--name-only", "--diff-filter=M", ref, "--", "*.png"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

if (changed.length === 0) {
  console.log(`check-png-identity: no modified PNGs against ${ref} — nothing to prove.`);
  process.exit(0);
}

let failures = 0;
let bytesBefore = 0;
let bytesAfter = 0;
for (const file of changed) {
  let before;
  try {
    before = execFileSync("git", ["show", `${ref}:${file}`], { maxBuffer: 64 * 1024 * 1024 });
  } catch {
    console.error(`✗ ${file}: cannot read the ${ref} version`);
    failures++;
    continue;
  }
  const after = fs.readFileSync(path.resolve(file));
  bytesBefore += before.length;
  bytesAfter += after.length;
  const d = firstDifference(decode(before), decode(after));
  if (d !== null) {
    failures++;
    console.error(
      d.kind === "size"
        ? `✗ ${file}: the image CHANGED SIZE ${d.was} → ${d.now}`
        : `✗ ${file}: pixel (${d.x},${d.y}) channel ${d.channel} was ${d.was}, is now ${d.now} — this is not a lossless recompression`,
    );
  }
}

const MB = 1048576;
if (failures > 0) {
  console.error(`check-png-identity: ${failures} of ${changed.length} file(s) changed their pixels`);
  process.exit(1);
}
console.log(
  `check-png-identity: OK — ${changed.length} PNG(s) re-encoded, every pixel identical to ${ref}. ` +
    `${(bytesBefore / MB).toFixed(1)} MB → ${(bytesAfter / MB).toFixed(1)} MB ` +
    `(−${(((bytesBefore - bytesAfter) / bytesBefore) * 100).toFixed(1)} %).`,
);
