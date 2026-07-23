#!/usr/bin/env node
// PB-T2 · the RENDERER HONESTY GATE: every stem a shipped paint level needs
// (per packages/game-paint/src/artManifest.ts) must exist as a PNG under
// apps/web/public/art/g1/paint/** — or sit on the EXPLICIT allowlist
// (scripts/paint-art-allowlist.json: [{stem, reason, until}]). Silent
// procedural placeholders shipping to students was the playtest's F13 class.
// Allowlist hygiene is enforced both ways: an entry whose art now exists
// fails (stale), and an entry past its `until` date fails (expired).
// Run: node scripts/check-paint-art.mjs   (exit 1 on any failure)

import fs from "node:fs";
import path from "node:path";
import { GLYPH_STEMS, HERO_STEMS, entitySkinStems } from "../packages/game-paint/src/artManifest.ts";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const ALLOW_PATH = path.join(R, "scripts/paint-art-allowlist.json");
const CONTENT = path.join(R, "content/corpus/stories");

// gather every present stem (any depth under the paint art root)
const present = new Set();
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) present.add(e.name.replace(/\.png$/, ""));
  }
};
walk(ART_ROOT);

const allow = fs.existsSync(ALLOW_PATH) ? JSON.parse(fs.readFileSync(ALLOW_PATH, "utf8")) : [];
const allowByStem = new Map(allow.map((a) => [a.stem, a]));
const today = new Date().toISOString().slice(0, 10);

let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };

// collect required stems from every non-draft level
const required = new Map(); // stem → where it's needed
const need = (stem, where) => { if (!required.has(stem)) required.set(stem, where); };
for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
  const paintDir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(paintDir)) continue;
  for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
    const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8"));
    if (level.draft === true) continue;
    const phases = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
    for (const ph of phases) {
      const glyphs = new Set(ph.rows.join(""));
      for (const g of glyphs) for (const stem of GLYPH_STEMS[g] ?? []) need(stem, `${f} ${ph.id} glyph '${g}'`);
      for (const e of ph.entities) for (const stem of entitySkinStems(e.skin)) need(stem, `${f} ${ph.id} entity ${e.id}`);
      for (const plate of Object.values(ph.plates ?? {})) need(String(plate), `${f} ${ph.id} plate`);
    }
    for (const stem of HERO_STEMS) need(stem, "hero rig");
  }
}

for (const [stem, where] of required) {
  const listed = allowByStem.get(stem);
  if (present.has(stem)) {
    if (listed) fail(`allowlist STALE: ${stem} exists now — remove its entry`);
    continue;
  }
  if (!listed) { fail(`missing stem "${stem}" (needed by ${where}) — paint it or allowlist it with a reason+until`); continue; }
  if (!listed.reason || !listed.until) { fail(`allowlist entry for ${stem} needs reason AND until`); continue; }
  if (listed.until < today) fail(`allowlist EXPIRED for ${stem} (until ${listed.until}) — paint it or extend with a new reason`);
}
for (const a of allow) {
  if (!required.has(a.stem) && !present.has(a.stem)) fail(`allowlist entry ${a.stem} is needed by nothing — remove it`);
}

if (failures === 0) {
  console.log(`check-paint-art: OK — ${required.size} required stems all present or explicitly allowlisted (${present.size} painted stems on disk)`);
} else {
  console.error(`check-paint-art: ${failures} failure(s)`);
  process.exit(1);
}
