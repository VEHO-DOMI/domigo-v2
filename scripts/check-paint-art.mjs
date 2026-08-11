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
import { PLACEHOLDER_UNTIL, isPlaceholderStem } from "../packages/game-paint/src/composition.ts";
// R5-W1 · E1: the required set and the LOADED set are derived by ONE module,
// so the gate can no longer demand a stem the loader would never fetch (and
// vice versa) — Audit A below is that assertion.
import { allScopePhases, domArtStems, levelRequiredStems, phaseArtScope, phaseRequiredStems } from "../packages/game-paint/src/artScope.ts";
import { keyFringe, readPng } from "./key-fringe.mjs";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const ALLOW_PATH = path.join(R, "scripts/paint-art-allowlist.json");
const CONTENT = path.join(R, "content/corpus/stories");

// gather every present stem (any depth under the paint art root)
const present = new Set();
const fileOf = new Map(); // stem → absolute path, for the pixel checks below
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) {
      present.add(e.name.replace(/\.png$/, ""));
      fileOf.set(e.name.replace(/\.png$/, ""), path.join(dir, e.name));
    }
  }
};
walk(ART_ROOT);

const allow = fs.existsSync(ALLOW_PATH) ? JSON.parse(fs.readFileSync(ALLOW_PATH, "utf8")) : [];
const allowByStem = new Map(allow.map((a) => [a.stem, a]));
const today = new Date().toISOString().slice(0, 10);

let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };

// collect required stems from every non-draft level (derivation: artScope.ts)
const required = new Map(); // stem → where it's needed
const levels = []; // the parsed non-draft levels, kept for the scope audits
for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
  const paintDir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(paintDir)) continue;
  for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
    const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8"));
    if (level.draft === true) continue;
    levels.push({ file: f, level });
    for (const [stem, where] of levelRequiredStems(level, f)) if (!required.has(stem)) required.set(stem, where);
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

// ── R5-W1 · E1 · AUDIT A · THE GATE AND THE LOADER MUST AGREE ───────────────
// Per-phase loading can fail in a way NO existing check can see: PaintScene.tex()
// answers a missing stem with a procedural blob, so an under-scoped phase ships
// grey shapes with every gate green. This audit is the structural answer — every
// stem this gate demands must be a stem the phase's loader would actually fetch.
// Floor ⊆ ceiling, asserted per phase, by machine.
for (const { file, level } of levels) {
  for (const ph of allScopePhases(level)) {
    const scope = phaseArtScope(level, ph.id, present);
    for (const [stem, where] of phaseRequiredStems(level, ph.id, file)) {
      if (!scope.has(stem)) fail(`SCOPE HOLE: "${stem}" is required (${where}) but phase ${ph.id} would never load it — it would render as a procedural fallback with every gate green`);
    }
  }
}

// ── R5-W1 · E1 · AUDIT B · ART NOTHING LOADS ────────────────────────────────
// A warning, never a failure: the keen-art law lets a batch land before its
// wiring does. But silence let 45.9 MB accumulate that no phase and no card
// ever asks for, so the number is now said out loud on every run.
{
  const claimed = new Set();
  for (const { level } of levels) {
    for (const ph of allScopePhases(level)) for (const s of phaseArtScope(level, ph.id, present)) claimed.add(s);
    for (const s of domArtStems(level)) claimed.add(s);
  }
  const dead = [...present].filter((s) => !claimed.has(s));
  if (dead.length > 0) {
    let bytes = 0;
    for (const s of dead) { const f = fileOf.get(s); if (f) bytes += fs.statSync(f).size; }
    console.warn(`⚠ ${dead.length} painted stems are loaded by nothing (${(bytes / 1048576).toFixed(1)} MB): ${dead.slice(0, 8).join(", ")}${dead.length > 8 ? ", …" : ""}`);
  }
}

// PB-C1 · THE PLACEHOLDER GUARD. The composition kit currently points at
// generated flat-tone stand-ins so the geometry laws could be proven before
// Batch AF exists. They are stamped PLACEHOLDER on the piece and they must not
// outlive the art: past the deadline this HARD-FAILS, so "we'll swap it later"
// cannot quietly become "we shipped it".
const placeholders = [...required.keys()].filter(isPlaceholderStem);
if (placeholders.length > 0) {
  if (today > PLACEHOLDER_UNTIL) {
    fail(`${placeholders.length} PLACEHOLDER stems are still wired (deadline ${PLACEHOLDER_UNTIL} passed) — land Batch AF and re-point the composition manifest`);
  } else {
    console.warn(`check-paint-art: ⚠ ${placeholders.length} placeholder stems wired (PK-C2 replaces them; hard deadline ${PLACEHOLDER_UNTIL})`);
  }
}

// PK-R6 · H1 · THE TILED-SURFACE FRINGE GATE. Batch AF was delivered over a
// magenta colour key and cut out against it, leaving a one-pixel skin of the key
// on every alpha boundary. On a prop that is invisible; on the TRAVERSAL
// SURFACES it is a defect the child stares at, because those stems TILE — eleven
// stray pixels in the ch01 crust's top row printed a magenta dot every 41 px
// along the walkable band, in every frame of the round-1 capture set.
// Repaired by scripts/strip-key-fringe.mjs; kept repaired here, so a re-import
// that brings the key back fails CI instead of shipping.
//
// PK-R6 · H2 · …AND IT WAS NEVER ONLY THE FLOOR (round-2 finding 2: „visible
// magenta cutout-fringe halos around the foliage/window-post edges in the
// ‚restored' shot"). H1 scoped this gate to the stems that TILE, on the argument
// that a repeated defect is the one a child stares at. The argument was right
// and the scope was wrong: the key was on the whole delivery, so the moment a
// still frame put a leaf or a window mullion in front of a bright wall, the same
// pink skin was there to be seen — and a critic saw it. Measured when this scope
// was widened: 179 of the shipped sheets carried fringe, the hall band alone
// 14 065 px.
//
// The gate is therefore the CLASS, not the instance: every PNG under the paint
// art root, tiling or not, prop or hero cell. There is no stem in this kit whose
// cut edge is allowed to keep the colour it was cut against.
const fringeStems = new Set(present);
let fringeTotal = 0;
for (const stem of [...fringeStems].sort()) {
  const file = fileOf.get(stem);
  if (!file) continue; // "missing" is the presence gate's business, above
  const hits = keyFringe(readPng(file));
  if (hits.length === 0) continue;
  fringeTotal += hits.length;
  const at = hits[0];
  fail(`colour-key fringe on "${stem}": ${hits.length} magenta px on its cut edge (first at ${at.x},${at.y}) — run: node --experimental-strip-types scripts/strip-key-fringe.mjs`);
}

if (failures === 0) {
  console.log(`check-paint-art: OK — ${required.size} required stems all present or explicitly allowlisted (${present.size} painted stems on disk); all ${fringeStems.size} painted stems clean of colour-key fringe`);
} else {
  console.error(`check-paint-art: ${failures} failure(s)`);
  process.exit(1);
}
