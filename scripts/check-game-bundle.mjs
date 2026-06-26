#!/usr/bin/env node
/**
 * Bundle-size gate for the G1 game slice (Track C, Law 9 perf budget).
 *
 * The invariant: Phaser (~1 MB) must stay in ONE lazy chunk (the ssr:false game
 * import) and never bloat the chunks every other route loads. Turbopack uses
 * opaque hashed chunk names, so this checks by CONTENT + size, not filename:
 *   1. Exactly one client chunk contains Phaser (no duplication / no merge into
 *      a shared chunk).
 *   2. That chunk's gzipped size ≤ PHASER_BUDGET.
 *   3. Every OTHER client chunk ≤ OTHER_BUDGET (so a leak that pulled Phaser
 *      into a commonly-loaded chunk would trip this even with hashed names).
 *
 * Run AFTER `pnpm build`. Wired into CI's build job.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const PHASER_BUDGET = 400 * 1024; // gz; Phaser core ≈ 310 KB gz today
const OTHER_BUDGET = 150 * 1024; // gz; biggest non-Phaser chunk ≈ 69 KB today
const MARKER = "phaser.io"; // Phaser's banner URL survives minification

const CHUNKS_DIR = path.resolve(process.cwd(), "apps/web/.next/static/chunks");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".js")) out.push(p);
  }
  return out;
}

if (!existsSync(CHUNKS_DIR)) {
  console.error(`check-game-bundle: ${CHUNKS_DIR} not found — run \`pnpm build\` first.`);
  process.exit(1);
}

const chunks = walk(CHUNKS_DIR);
const kb = (n) => `${Math.round(n / 1024)} KB`;
const errors = [];

let phaserCount = 0;
let phaserGz = 0;
let worstOther = { name: "", gz: 0 };

for (const p of chunks) {
  const buf = readFileSync(p);
  const gz = gzipSync(buf).length;
  if (buf.includes(MARKER)) {
    phaserCount += 1;
    phaserGz += gz;
    if (gz > PHASER_BUDGET) errors.push(`Phaser chunk ${path.basename(p)} is ${kb(gz)} gz (budget ${kb(PHASER_BUDGET)})`);
  } else if (gz > worstOther.gz) {
    worstOther = { name: path.basename(p), gz };
  }
}

if (phaserCount === 0) errors.push("No client chunk contains Phaser — did the game route build? (marker missing)");
if (phaserCount > 1) errors.push(`Phaser is split across ${phaserCount} chunks (expected 1 lazy chunk; possible leak/duplication)`);
if (worstOther.gz > OTHER_BUDGET) {
  errors.push(`Non-Phaser chunk ${worstOther.name} is ${kb(worstOther.gz)} gz (budget ${kb(OTHER_BUDGET)}) — Phaser may have leaked into a shared chunk`);
}

console.log(`check-game-bundle: ${chunks.length} client chunks · Phaser in ${phaserCount} chunk (${kb(phaserGz)} gz) · largest non-Phaser ${kb(worstOther.gz)} (${worstOther.name})`);
if (errors.length > 0) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("check-game-bundle: OK — Phaser is isolated in one lazy chunk under budget; no shared-chunk leak.");
