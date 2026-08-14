#!/usr/bin/env node
/**
 * R5-W3 · A5 · BATCH AQ6 — THE FOUR CAPTIVES, CUT OUT FROM BEHIND THEIR BARS.
 *
 * Run: node docs/art/import-batch-aq6.mjs [--dry]
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────────────
 * Four cages in ch01 hold four different things — the sound system, the tablet,
 * the chair, the class photo — and every one of them was the same shape on the
 * screen. D-48 measured why: `entTargetH` drew them 22 px tall, and at 22 px a
 * 347×480 painting keeps its outline and loses everything inside it. Three art
 * rounds were commissioned for something nobody could see. The ruling raised the
 * cage to 34 px (`anim.ts` CAGE_DISPLAY_H); this brings in the paint that makes
 * the extra pixels say something.
 *
 * ── WHY THE SHELL IS SUBTRACTED RATHER THAN IMPORTED WHOLE ───────────────────
 * Each delivered cell is the WHOLE cage: the unaltered `satchel_a` shell with an
 * occupant painted into it. Importing that whole cell as a per-captive skin
 * would be simpler for exactly one frame and wrong for every other: the cage
 * also has a `_shake` and a `_burst` cell, and a per-captive skin would need
 * four copies of each, four copies of the shell in texture memory, and a re-cut
 * of all twelve every time the cage is repainted.
 *
 * So the shell is subtracted and only the OCCUPANT is written out, as its own
 * small sheet drawn BEHIND the unchanged cage. Measured, not assumed: per cell
 * the occupant paints 7 500–12 200 px where the shell is transparent and
 * 4 400–9 000 px where the shell is opaque. Both belong in the layer — the
 * second set is simply hidden by the bars in front of it, which is what „behind
 * the bars" means. Drawing it in front would put the captive on top of its own
 * cage.
 *
 * Alignment is STRUCTURAL, not tuned: every occupant is cut on the shell's own
 * box inside the cell — (82,16) 347×480, the exact dimensions of
 * `satchel_a.png` — so `syncOverlay` alone lines them up, and no number here has
 * to be kept in step with a number over there.
 *
 * ── WHY THE IMPORTER RE-CHECKS THE DELIVERY NOTE ─────────────────────────────
 * A delivery note is a claim, and an importer is the last cheap place a claim
 * can still be checked — the REJECTED predecessor sheet also reported
 * „Format PASS". Every assertion below is a claim this note makes, re-derived
 * from the pixels. One of them fails (see NOTE_ARITHMETIC).
 *
 * ── WHY AQ4 IS NOT HERE ──────────────────────────────────────────────────────
 * `batch-aq4/satchel_silhouettes.png` is the same commission, delivered first,
 * and it is NOT imported — not on taste, on measurement. Its four cells sit
 * 41.32 / 41.35 / 43.20 / 44.11 from the key colour, against the ≥150 this
 * importer requires and the 164.46 AQ6 delivers in all four. At that distance
 * `defringe` eats the occupant's own edge. It was pulled into the lab with
 * `gen/pull_from_codex.py aq4 --write` so the sandbox stops being a shadow
 * delivery, and it is superseded there.
 *
 * Row 2 of `cage_insassen` — Codex's four INVENTED cages, wicker baskets with
 * padlocks (D-71, vor K1s Entdopplung D-35) — is not in this file and never will be: wiring it would
 * replace ch01's cage design in silence, and the cage design is a Koki gate.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const LAB = process.env.CODEX_LAB ?? path.join(process.env.HOME, "Code", "codex-art-lab");
const OUT = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const DRY = process.argv.includes("--dry");

const SHEET = path.join(LAB, "batch-aq6/satchel_silhouettes_ohne_tasche.png");
/** The shell the delivery was built from, pinned by content. It is the PRE-heal
 *  master: D-51's three specks are still in it, so subtracting against it takes
 *  them out of every occupant layer by construction, whichever order the heal
 *  and this import happen to run in. */
const SHELL_REF = path.join(LAB, "batch-aq6/.work/raw/satchel_a_reference.png");
const SHELL_REF_MD5 = "9a942bb83f07f70c1fe20ec3bcf0f7bd";

/** The occupants, in the sheet's own left-to-right order (the note's table). */
const CAPTIVES = ["soundsystem", "tablet", "chair", "picture"];
/** Where the shell sits inside each 512² cell — derived by exact-match search,
 *  not read off the note, and asserted below. */
const SHELL_AT = { x: 82, y: 16 };

/** The note's own numbers, entered as constants so they can be CHECKED. */
const NOTE = { totalShellPx: 372360, perCellShellPx: 92865, cells: 4, keyDistMin: 150 };

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const md5 = (p) => crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
const keyDist = (r, g, b) => Math.hypot(r - 255, g, b - 255);
/** the importers' own deletion predicate, verbatim (import-batch-as.mjs:81) */
const isFringe = (r, g, b) => r > 120 && b > 120 && r - g > 55 && b - g > 55;

const failures = [];
const note = (m) => console.log(`    ${m}`);
const fail = (m) => { failures.push(m); console.error(`  ✗ ${m}`); };

for (const p of [SHEET, SHELL_REF]) {
  if (!fs.existsSync(p)) { fail(`source missing: ${p}`); }
}
if (failures.length > 0) process.exit(1);

// ── 1 · provenance ───────────────────────────────────────────────────────────
const gotMd5 = md5(SHELL_REF);
if (gotMd5 !== SHELL_REF_MD5) {
  fail(`the pinned shell reference changed: ${gotMd5} ≠ ${SHELL_REF_MD5} — the subtraction below is only valid against the shell the delivery was built from`);
}
const shell = read(SHELL_REF);
const sheet = read(SHEET);
note(`shell reference ${shell.width}×${shell.height} md5 ${gotMd5.slice(0, 12)}…`);

// ── 2 · format, as the note claims it ────────────────────────────────────────
if (sheet.width !== 2048 || sheet.height !== 512) fail(`sheet is ${sheet.width}×${sheet.height}, the note claims 2048×512`);
const CW = sheet.width / NOTE.cells;
if (!Number.isInteger(CW)) fail(`${sheet.width} does not divide into ${NOTE.cells} cells`);
if (SHELL_AT.x + shell.width > CW || SHELL_AT.y + shell.height > sheet.height) {
  fail(`the shell box (${SHELL_AT.x},${SHELL_AT.y})+${shell.width}×${shell.height} does not fit a ${CW}×${sheet.height} cell`);
}

// ── 3 · the note's arithmetic, checked before its conclusions are trusted ────
//
// DECLARED EXCEPTION, dated 2026-08-14 (the NOT_A_GATE idiom): this check FAILS
// on this delivery and the import proceeds anyway, because the failure is in the
// note's prose and not in its pixels. It claims „372.360 … (92.865 pro Zelle)"
// and 4 × 92 865 = 371 460. The total is right; the per-cell figure is 225 low.
// Measured below, per cell, and the measurement is what the import uses. A DEBT
// row opens against the note rather than the paint.
if (NOTE.perCellShellPx * NOTE.cells !== NOTE.totalShellPx) {
  note(`⚠ the delivery note does not add up: ${NOTE.perCellShellPx} × ${NOTE.cells} = ${NOTE.perCellShellPx * NOTE.cells}, but it claims ${NOTE.totalShellPx}. Declared exception — the measured per-cell count below is authoritative.`);
}

// ── 4 · per cell: key purity, key distance, shell identity, the occupant ─────
const written = [];
const identityCounts = [];
for (let cell = 0; cell < NOTE.cells; cell++) {
  const name = CAPTIVES[cell];
  const ox = cell * CW + SHELL_AT.x;
  const oy = SHELL_AT.y;

  // the occupant layer, cut on the SHELL's box so alignment needs no numbers
  const out = new PNG({ width: shell.width, height: shell.height });
  let identical = 0;
  let inHoles = 0;
  let behindBars = 0;
  let minKeyDist = Infinity;
  let impureKey = 0;
  let bx0 = shell.width, by0 = shell.height, bx1 = -1, by1 = -1;

  for (let y = 0; y < shell.height; y++) {
    for (let x = 0; x < shell.width; x++) {
      const ti = ((oy + y) * sheet.width + (ox + x)) * 4;
      const si = (y * shell.width + x) * 4;
      const di = (y * out.width + x) * 4;
      const r = sheet.data[ti], g = sheet.data[ti + 1], b = sheet.data[ti + 2];
      const d = keyDist(r, g, b);
      if (d < 40) {
        // a key pixel: the note claims these are EXACTLY #FF00FF
        if (!(r === 255 && g === 0 && b === 255)) impureKey++;
        out.data[di + 3] = 0;
        continue;
      }
      if (d < minKeyDist) minKeyDist = d;
      const shellOpaque = shell.data[si + 3] > 250;
      const same = shellOpaque && r === shell.data[si] && g === shell.data[si + 1] && b === shell.data[si + 2];
      if (same) { identical++; out.data[di + 3] = 0; continue; } // that pixel IS the cage
      // …everything else is the occupant, whether the bars will cover it or not
      out.data[di] = r; out.data[di + 1] = g; out.data[di + 2] = b; out.data[di + 3] = 255;
      if (shellOpaque) behindBars++; else inHoles++;
      if (x < bx0) bx0 = x;
      if (x > bx1) bx1 = x;
      if (y < by0) by0 = y;
      if (y > by1) by1 = y;
    }
  }

  identityCounts.push(identical);
  if (impureKey > 0) fail(`${name}: ${impureKey} key px are not exactly #FF00FF — the note claims „exakt #FF00FF"`);
  if (minKeyDist < NOTE.keyDistMin) {
    fail(`${name}: nearest paint sits ${minKeyDist.toFixed(2)} from the key (euclidean), the gate needs ≥${NOTE.keyDistMin} — defringe would eat the occupant's own edge`);
  }
  if (inHoles + behindBars === 0) fail(`${name}: the cell carries no occupant at all — it is the bare cage`);

  // an occupant that pokes outside its cage is not an occupant
  if (bx1 >= 0) {
    const inside = bx0 >= 0 && by0 >= 0 && bx1 < shell.width && by1 < shell.height;
    if (!inside) fail(`${name}: the occupant's box (${bx0},${by0})–(${bx1},${by1}) leaves the shell`);
  }

  // …and it must carry NOTHING the next import would silently erase
  let inherited = 0;
  for (let i = 0; i < out.data.length; i += 4) {
    if (out.data[i + 3] > 16 && isFringe(out.data[i], out.data[i + 1], out.data[i + 2])) inherited++;
  }
  if (inherited > 0) fail(`${name}: ${inherited} px in the occupant layer match the importer's own deletion rule (D-51 class) — they would vanish on the next round-trip`);

  note(`${name}: key ≥${minKeyDist.toFixed(2)} · shell identical ${identical} px · occupant ${inHoles} in holes + ${behindBars} behind bars · box (${bx0},${by0})–(${bx1},${by1}) · inherited specks ${inherited}`);
  if (!DRY) fs.writeFileSync(path.join(OUT, `captive_${name}.png`), PNG.sync.write(out));
  written.push(`captive_${name}`);
}

// ── 5 · the shell was stamped from ONE source, or the cells are not siblings ──
const allEqual = identityCounts.every((n) => n === identityCounts[0]);
if (!allEqual) fail(`the four cells reproduce different amounts of the shell (${identityCounts.join(", ")}) — they were not stamped from one master`);
else note(`shell identity ${identityCounts[0]} px in each of ${NOTE.cells} cells = ${identityCounts[0] * NOTE.cells} total (the note's total: ${NOTE.totalShellPx})`);
if (identityCounts[0] * NOTE.cells !== NOTE.totalShellPx) {
  note(`⚠ measured total ${identityCounts[0] * NOTE.cells} ≠ the note's ${NOTE.totalShellPx} — reported as a count, never as a share`);
}

console.log(DRY ? `\ndry run — ${written.length} occupant layer(s) would be written` : `\n${written.length} occupant layer(s) written: ${written.join(", ")}`);
if (failures.length > 0) { console.error(`\n${failures.length} failure(s) — nothing was trusted`); process.exit(1); }
