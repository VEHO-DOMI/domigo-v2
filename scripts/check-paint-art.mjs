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
import { captiveStem, isCaptiveKey } from "../packages/game-paint/src/artManifest.ts";
import { entDisplayH } from "../packages/game-paint/src/anim.ts";
import { keyFringe, readPng } from "./key-fringe.mjs";
import { DEAD_ART_CEILING } from "../packages/game-paint/src/perfBudget.ts";

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
    // R5-W3 · E5 · THE RATCHET. The warning above ran on every build for three
    // sessions while the pile went 53 → 57 → 59 → 61 stems, because a warning
    // costs nothing to ignore. (R5-W6b · W5 · D-271 — the story continues past
    // that line and this comment stopped telling it: the merge train of wave 4b
    // wired and deleted enough art to bring the pile back to 53, which is where
    // the ceiling was then set, with no headroom. So the row reads
    // 53 → 57 → 59 → 61 → 53, and 53 is the number as of 2026-08-19. Whoever
    // moves it next writes the next number here, with its date.) The keen-art freedom stays — art may land before
    // its wiring — but the pile may no longer grow in SILENCE: adding sheets
    // means raising the ceiling in the same PR, with a reason a reviewer reads.
    // The full annotated list, by group: docs/design/g1/paint/DEAD_ART_2026-08-14.md
    if (dead.length > DEAD_ART_CEILING) {
      fail(
        `${dead.length} painted stems are loaded by nothing — the ceiling is ${DEAD_ART_CEILING} (perfBudget.ts). ` +
          `Wire them, delete them, or raise DEAD_ART_CEILING in this same PR with a reason. New since the ceiling: ` +
          dead.slice(DEAD_ART_CEILING).join(", "),
      );
    }
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

// ── R5-W3 · A5 · D-48 · THE CAPTIVE MUST SURVIVE ITS OWN CAGE ────────────────
//
// The finding this closes: four cages, four different things inside them, and on
// the screen all four were the same picture. Three art rounds were commissioned
// before anybody measured why — `entTargetH` drew the cage 22 px tall, and the
// paint that tells a sound system from a tablet is smaller than that.
//
// So the ruling (34 px) gets a law, and the law is measured the way the finding
// was: take the two captives that look MOST alike, draw both at the height the
// engine actually uses, and count how many pixels on the screen separate them.
// Measured over the shipped sheets:
//
//     drawn height   closest pair differs by
//         18 px            3.2 px
//         22 px            4.7 px      ← what shipped, and what the blind
//         26 px            6.7 px        reviewer could not tell apart
//         30 px            8.7 px
//         34 px           11.3 px      ← the ruling
//         48 px           22.4 px
//
// The floor is 8. It is not a taste: it sits between the height a blind reviewer
// rejected and the height the same reviewer accepted („ab 34 px trennen sich
// Lautsprecher-Kegel und Tablet"), and it is what makes this check DISCRIMINATE —
// put the cage back to 22 and it goes red at 4.7. A law that could not fail
// would have proven nothing.
//
// What it does NOT claim: that a child can name them. No script can measure
// that; the blind critic does, and its verdict is the one that counts.
const CAPTIVE_MIN_SEPARATION_PX = 8;

/** Box-downscale a sheet's ALPHA to the drawn height — a silhouette's identity
 *  is its shape, and the shape is what the cage's size takes away. */
const maskAt = (png, H) => {
  const W = Math.max(1, Math.round((png.width / png.height) * H));
  const a = new Float64Array(W * H);
  for (let y = 0; y < H; y++) {
    const y0 = Math.floor((y * png.height) / H);
    const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * png.height) / H));
    for (let x = 0; x < W; x++) {
      const x0 = Math.floor((x * png.width) / W);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * png.width) / W));
      let s = 0;
      let n = 0;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) { s += png.data[((yy * png.width + xx) << 2) + 3]; n++; }
      a[y * W + x] = n === 0 ? 0 : s / n / 255;
    }
  }
  return { W, H, a };
};

const captiveCages = [];
for (const { level } of levels) {
  for (const ph of allScopePhases(level)) {
    for (const e of ph.entities) {
      if (e.role === "cage" && isCaptiveKey(e.params?.captive)) captiveCages.push({ phase: ph.id, id: e.id, key: e.params.captive });
    }
  }
}
if (captiveCages.length > 0) {
  const H = entDisplayH({ role: "cage", skin: "satchel" });
  const masks = new Map();
  for (const { key } of captiveCages) {
    if (masks.has(key)) continue;
    const file = fileOf.get(captiveStem(key));
    if (!file) { fail(`captive "${key}" is declared by a cage but ${captiveStem(key)}.png is not on disk`); continue; }
    masks.set(key, maskAt(readPng(file).png, H));
  }
  const keys = [...masks.keys()].sort();
  let worst = { d: Infinity, pair: "" };
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p = masks.get(keys[i]);
      const q = masks.get(keys[j]);
      let d = 0;
      for (let k = 0; k < p.a.length; k++) d += Math.abs(p.a[k] - q.a[k]);
      if (d < worst.d) worst = { d, pair: `${keys[i]}/${keys[j]}` };
    }
  }
  if (keys.length < 2) {
    console.log(`  captive legibility: only ${keys.length} captive declared — nothing to tell apart`);
  } else if (worst.d < CAPTIVE_MIN_SEPARATION_PX) {
    fail(`captive legibility: at the ${H}px the engine draws a cage, "${worst.pair}" differ by only ${worst.d.toFixed(1)} px on screen (law: ${CAPTIVE_MIN_SEPARATION_PX}) — the cage is too small for the paint inside it (D-48)`);
  } else {
    console.log(`  captive legibility: ${captiveCages.length} cages · ${keys.length} captives at ${H}px · closest pair "${worst.pair}" differs by ${worst.d.toFixed(1)} px (law: ${CAPTIVE_MIN_SEPARATION_PX})`);
  }
} else {
  console.log("  captive legibility: no cage declares a captive — nothing measured");
}

if (failures === 0) {
  console.log(`check-paint-art: OK — ${required.size} required stems all present or explicitly allowlisted (${present.size} painted stems on disk); all ${fringeStems.size} painted stems clean of colour-key fringe`);
} else {
  console.error(`check-paint-art: ${failures} failure(s)`);
  process.exit(1);
}
