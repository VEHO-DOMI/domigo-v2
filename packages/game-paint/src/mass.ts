// PB-C1 · THE TERRAIN MASS MODEL — doc 36 §2 as a PURE planner.
//
// Retired: strips-over-fill (a thin painted strip laid over a flat tan box,
// caps floating detached beside platforms, SOIL below every floor). Terrain is
// now a CARVED MASS with painted anatomy — crust + flush caps on every exposed
// top, edge trims on every exposed side, corners at every turn, a seamless
// body, a fade band at depth, ink-dark paper sediment below. Floating
// platforms are COMPLETE OBJECTS. The `z` slide is its own object.
//
// The planner is pure so the audits can run in CI without a browser: it takes
// a grid + a kit and returns WHERE every piece goes. `fallbackFill` is the one
// kind that means "no kit — the scene draws a flat rectangle here"; the
// no-naked-fill audit asserts a kit-present plan contains ZERO of them.

import { type MassKit } from "./composition.ts";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { TILE } from "./paint.ts";

// ── the anatomy's dimensions (world px) ──────────────────────────────────────
/** doc 36 §1's scale law: "a crust course ~0.5 H thick". H ≈ 34 px drawn. */
export const CRUST_H = 17;
/** the painted board surface IS the standing line, so the lip is only a hint */
export const CRUST_LIP = 2;
/** carved side trim: mostly inside the mass, 2 px proud of it */
export const EDGE_W = 8;
export const EDGE_OUT = 2;
export const CORNER = 12;
/** doc 36 §2: the slide's drawn surface is 2 cells wide so the `z` line reads */
export const SLIDE_BAND_PX = 2 * TILE;
export const SLIDE_ABOVE_FRAC = 0.22;
/** the depth ramp: body → fade → sediment (doc 36 §2, "below ~3 cells deep") */
export const FADE_DEPTH = 3;
export const SEDIMENT_DEPTH = 4;
/** floating platform = an isolated run this wide or narrower with air below */
export const MAX_PLATFORM_CELLS = 4;

/**
 * PK-R6 · H1 · THE COURSE-VARIATION LAW (round-1 critique, finding 1).
 *
 * A crust run used to be ONE tileSprite carrying ONE painted variant, so the
 * ch01 hall floor looped a single 41-px course about twenty-six times across the
 * screen and hundreds of times across the level — a metronome under the child's
 * feet for the whole traversal band, which is what the critique called
 * „mechanically obvious". The kit has always shipped two painted variants of
 * every course; only one was ever reaching the floor.
 *
 * So a run is now laid as SEGMENTS that alternate the variants. The lengths are
 * coprime-ish and irregular on purpose: a fixed segment length would just move
 * the metronome up one level (A-B-A-B every 2n cells), whereas walking this
 * table shifts the boundaries as the run goes on. Everything is derived from the
 * run's own cell coordinates, so it is deterministic — the same level always
 * paints the same floor, and the audits can assert it without a browser.
 *
 * The segments share the WORLD-space tile anchor (PaintScene.placeMassPiece), so
 * two neighbouring segments of the same variant are seamless and a change of
 * variant lands exactly on a cell boundary, where the course already draws a
 * plank joint.
 */
export const CRUST_SEGMENT_CELLS = [5, 3, 7, 4, 6] as const;

/**
 * PK-R6 · H1 · THE NO-METRONOME LAW (round-1 critique, finding 1 — CRITICAL,
 * round 2 of the same defect).
 *
 * Round 1 said the ch01 floor „repeats identically with a hard seam every few
 * units, reading as a wallpaper tile rather than hand-painted ground", and the
 * fix that round was the segment table above: two painted variants instead of
 * one. That halved the beat; it did not remove it, for two measured reasons.
 *
 *  · The pattern still CYCLES. The segment lengths walk a 5-long table and the
 *    variants a 2-long list, so the whole course repeats exactly every 10
 *    segments — 50 cells, 800 px (measured, composition.test.ts asserts the 50).
 *  · Worse, and invisible to any cycle test on a shorter floor: the run only
 *    ever holds TWO different cells. ch01's longest hall floor is 41 cells, so
 *    it never completes that 50-cell cycle and looks aperiodic to arithmetic
 *    while giving the eye exactly two things to look at.
 *
 * Two more ingredients kill both, and both are code (doc 44 B14) because the
 * kit is what it is and no more painted variants are coming this round:
 *
 *  1 · VALUE. Each segment is laid at one of five near-white tints — a ±5 %
 *      value jitter over the painted course. This is the critique's own first
 *      instruction („repaint the ground strip with irregular value … variation"),
 *      done to the light rather than to the pigment, so the painting survives.
 *  2 · GRAIN. Scuffs and shine marks scattered along the walk surface at
 *      irregular intervals — the critique's „scattered highlights, occasional
 *      gaps", drawn rather than commissioned. They are the one ingredient whose
 *      spacing owes nothing to the tile size, so they are what actually breaks
 *      the eye's lock on the loop.
 *
 * Both are keyed to the cell's OWN coordinates through a multiplicative hash, so
 * a level always paints the same floor and the audits can assert it headlessly.
 * The law they make checkable is stated once here and enforced in
 * scripts/check-composition.mjs (audit 6), in the two halves the two failures
 * above demand: **no crust run repeats with a period of NO_METRONOME_MIN_PERIOD
 * cells or less, AND a run holds at least one different-looking cell per five of
 * its length (never fewer than three).** Tamper-proven in both directions —
 * flattening the tint and the grain turns all ten shipped runs red on the
 * variety half while every one of them still passes the cycle half.
 */
export const NO_METRONOME_MIN_PERIOD = 9;

/** Knuth's multiplicative hash over two cell coordinates plus a salt, in 0…1.
 *  One source of determinism for every scattered thing the renderer draws. */
export const hash01 = (n: number): number => (Math.imul(n | 0, 2654435761) >>> 8) / 0x1000000;
export const hash2 = (c: number, r: number, salt: number): number =>
  hash01(Math.imul(c + 0x9e37, 0x85eb) ^ Math.imul(r + 0x79b9, 0xc2b2) ^ Math.imul(salt + 0x165667, 0x27d4));

/**
 * THE INTERIOR SEGMENTS. Seen in the running build (browser proof, p1): the
 * course above was already varying while the MASS BELOW it — which is four times
 * as much of the frame — was one tileSprite 656 px wide carrying ONE variant.
 * That is the „stacked books floor strip repeats identically" the critique was
 * actually looking at: a grid of identical book spines under the whole hall.
 *
 * So the interior is laid in segments too, and the table is deliberately NOT the
 * crust's: if the two layers changed variant at the same columns, their seams
 * would stack into one visible vertical joint through the whole floor instead of
 * cancelling each other out.
 */
export const BODY_SEGMENT_CELLS = [6, 4, 9, 5, 7] as const;

/**
 * The five lights a segment may be laid in. Near-white on purpose: these
 * MULTIPLY the painted stem, so they change its value and never its material.
 */
export const CRUST_TINTS = [0xffffff, 0xf3ede2, 0xfdf8ef, 0xe9e2d6, 0xf7f1e6] as const;

/** Which of them this segment wears — from the segment's own start cell, so two
 *  neighbouring runs of the same variant still differ in value. `salt` keeps the
 *  course and the mass under it on different sequences. */
export const courseTintAt = (c: number, r: number, k: number, salt = 3): number =>
  CRUST_TINTS[Math.floor(hash2(c, r, k * 17 + salt) * CRUST_TINTS.length) % CRUST_TINTS.length] ?? 0xffffff;
export const crustTintAt = (c: number, r: number, k: number): number => courseTintAt(c, r, k, 3);

/** A drawn mark on a laid surface: a dark scuff or a light shine. The scene
 *  picks the two colours from the phase's key (a scuff on a night floor is not
 *  the scuff on a morning one); the plan owns only where they go. */
export interface SurfaceMark {
  kind: "scuff" | "shine";
  c: number;
  r: number;
  x: number;
  y: number;
  w: number;
  h: number;
  alpha: number;
}

/** Above the course (2) and below its caps (2.3) — grain is IN the wood. */
export const CRUST_MARK_DEPTH = 2.15;
/** …and just above the interior bands (1), under everything laid on them. */
export const MASS_MARK_DEPTH = 1.4;
/** Roughly how often a walk-surface cell carries a mark. Under a half: the floor
 *  is being grained, not gravelled. */
export const CRUST_MARK_RATE = 0.44;
/** The interior takes MORE, and fainter: it is four times as much of the frame
 *  as the course is, it is the surface the critique was actually reading, and
 *  patina over a book-spine wall has to be nearly subliminal to stay a wall. */
export const MASS_MARK_RATE = 0.62;

export type MassKind =
  | "body" | "fade" | "sediment"
  | "crust" | "capL" | "capR"
  | "edgeL" | "edgeR" | "cornerBL" | "cornerBR" | "inCornerL" | "inCornerR"
  | "ramp" | "platform"
  | "slideUnder" | "slideTop" | "slideMid" | "slideFoot"
  | "fallbackFill";

/** Source pixel size of a stem — the plan reads real art geometry through this. */
export type SrcSizeLookup = (stem: string) => { w: number; h: number } | null;

export interface MassPiece {
  kind: MassKind;
  /** null ⇒ engine-drawn (fallbackFill only) */
  stem: string | null;
  c: number;
  r: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** radians — the slide modules ride the 45° diagonal */
  rot?: number;
  /** anchor within the piece; default (0,0) = x/y is its top-left corner.
   *  Rotated pieces anchor ON the diagonal, so they need an explicit origin. */
  originX?: number;
  originY?: number;
  /** true ⇒ a tileSprite (seamless run); false ⇒ one Image */
  tile?: boolean;
  /** a MULTIPLY tint (near-white) — the value jitter of the no-metronome law */
  tint?: number;
  depth: number;
}

const DEPTH = {
  body: 1, ramp: 1.5, crust: 2, trim: 2.2, cap: 2.3, platform: 2.5, slide: 2.6,
} as const;

const gridSize = (grid: readonly string[]): { w: number; h: number } => ({
  w: grid[0]?.length ?? 0,
  h: grid.length,
});

/** mass = anything the player stands on or bumps into. Ice keeps its own dressing. */
const isMass = (g: string): boolean => isSolid(g);

/** How many contiguous mass cells sit directly above (0 = the exposed top). */
const depthAt = (grid: readonly string[], c: number, r: number): number => {
  let d = 0;
  while (d < 64 && isMass(glyphAt(grid, c, r - 1 - d))) d++;
  return d;
};

/**
 * An isolated horizontal run with air above AND below, ≤4 cells: a floating
 * platform. Doc 36: these are drawn as COMPLETE OBJECTS with their own
 * silhouette and underside — never a crust laid on a filler box.
 * (glyphAt treats outside-the-grid as solid, so a run touching the world edge
 * is anchored terrain, not a platform.)
 */
export const floatingPlatformRuns = (grid: readonly string[]): Array<{ c0: number; c1: number; r: number }> => {
  const { w, h } = gridSize(grid);
  const runs: Array<{ c0: number; c1: number; r: number }> = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!isMass(glyphAt(grid, c, r))) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && isMass(glyphAt(grid, c1 + 1, r))) c1++;
      const width = c1 - c + 1;
      let airAround = width <= MAX_PLATFORM_CELLS
        && !isMass(glyphAt(grid, c - 1, r))
        && !isMass(glyphAt(grid, c1 + 1, r));
      for (let k = c; airAround && k <= c1; k++) {
        if (isMass(glyphAt(grid, k, r - 1)) || isMass(glyphAt(grid, k, r + 1))) airAround = false;
        if (isSlope(glyphAt(grid, k, r - 1)) || isSlope(glyphAt(grid, k, r + 1))) airAround = false;
      }
      if (airAround) runs.push({ c0: c, c1, r });
      c = c1 + 1;
    }
  }
  return runs;
};

/** Diagonal runs of the slide glyph `z` (each step goes one right, one down). */
export const slideRuns = (grid: readonly string[]): Array<{ c: number; r: number; n: number }> => {
  const { w, h } = gridSize(grid);
  const seen = new Set<string>();
  const runs: Array<{ c: number; r: number; n: number }> = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (glyphAt(grid, c, r) !== "z" || seen.has(`${c},${r}`)) continue;
      if (glyphAt(grid, c - 1, r - 1) === "z") continue; // not the head of the run
      let n = 0;
      while (glyphAt(grid, c + n, r + n) === "z") { seen.add(`${c + n},${r + n}`); n++; }
      runs.push({ c, r, n });
    }
  }
  return runs;
};

/**
 * The cells a floating platform object owns outright. Exported so the audits ask
 * the SAME question the planner does instead of re-deriving it — a second copy
 * of a rule is a second rule.
 */
export const claimedPlatformCells = (grid: readonly string[]): Set<string> => {
  const out = new Set<string>();
  for (const run of floatingPlatformRuns(grid)) {
    for (let k = run.c0; k <= run.c1; k++) out.add(`${k},${run.r}`);
  }
  return out;
};

/**
 * THE WALK COURSE, as runs. Extracted from `planMass` because three things now
 * need exactly this definition and may never drift apart: the course itself, the
 * grain scattered over it, and the audit that proves the pair aperiodic. (The
 * method's own rule: hand the check the SOURCE, never a second copy of it.)
 *
 * `claimed` = cells a floating platform object owns outright; a platform draws
 * its own top, so it never wears a crust.
 */
export const crustRuns = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): Array<{ c: number; c1: number; r: number }> => {
  const { w, h } = gridSize(grid);
  const wears = (c: number, r: number): boolean => {
    const g = glyphAt(grid, c, r);
    if (!isMass(g) || g === "~" || claimed.has(`${c},${r}`)) return false;
    if (isMass(glyphAt(grid, c, r - 1))) return false; // buried
    return !isSlope(glyphAt(grid, c, r - 1)); // a ramp sits on it — it carries the crust
  };
  const runs: Array<{ c: number; c1: number; r: number }> = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!wears(c, r)) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && wears(c1 + 1, r)) c1++;
      runs.push({ c, c1, r });
      c = c1 + 1;
    }
  }
  return runs;
};

/**
 * THE GRAIN — scuffs and shine marks over the walk surface (the no-metronome
 * law, ingredient 2). Everything about a mark comes out of its own cell's hash:
 * whether it exists at all, which kind it is, how long it is, and where in the
 * cell it sits. Nothing here knows the tile size, which is the point — this is
 * the layer whose rhythm owes the loop nothing.
 */
export const crustGrain = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): SurfaceMark[] => {
  const out: SurfaceMark[] = [];
  for (const { c, c1, r } of crustRuns(grid, claimed)) {
    for (let cc = c; cc <= c1; cc++) {
      if (hash2(cc, r, 1) >= CRUST_MARK_RATE) continue;
      const shine = hash2(cc, r, 2) < 0.38;
      const len = 4 + hash2(cc, r, 3) * 9; // 4…13 px — under a cell, always
      const thick = shine ? 0.8 + hash2(cc, r, 6) * 0.7 : 1.1 + hash2(cc, r, 6) * 1.3;
      out.push({
        kind: shine ? "shine" : "scuff",
        c: cc,
        r,
        x: cc * TILE + hash2(cc, r, 4) * Math.max(TILE - len, 1),
        // inside the course, never on its lip: a mark on the very edge reads as
        // a chipped floor rather than as wear
        y: r * TILE - CRUST_LIP + 2 + hash2(cc, r, 5) * (CRUST_H - 5),
        w: len,
        h: thick,
        alpha: shine ? 0.07 + hash2(cc, r, 7) * 0.07 : 0.08 + hash2(cc, r, 7) * 0.09,
      });
    }
  }
  return out;
};

/**
 * THE PATINA on the mass below the course — the second half of the same law, and
 * the one the browser proof said was missing. Softer, broader and fainter than
 * the course's grain: this surface is a WALL of book spines and it has to stay
 * one, so its variation works by damp patches and worn light rather than by
 * scratches. Marks may overhang their cell (up to half a cell either side): a
 * patch that stops exactly on a cell boundary would draw the very grid it exists
 * to break.
 */
export const massGrain = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): SurfaceMark[] => {
  const { w, h } = gridSize(grid);
  const out: SurfaceMark[] = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!isMass(glyphAt(grid, c, r)) || claimed.has(`${c},${r}`)) continue;
      if (hash2(c, r, 21) >= MASS_MARK_RATE) continue;
      const shine = hash2(c, r, 22) < 0.42;
      // a patch may spill into a NEIGHBOURING cell of the same mass, and only
      // there: a smudge hanging in the air beside a ledge would read as a
      // rendering fault, not as wear.
      // The bounds check is not optional — glyphAt calls everything OUTSIDE the
      // grid SOLID, so without it every mark on column 0 spills off the world
      // (the same trap that grew phantom inner corners on every ground run
      // starting at column 0, caught then in the browser and here by the
      // containment battery in composition.test.ts).
      // …and it spills along ONE axis only. Two axes at once reach the DIAGONAL
      // cell, which the four straight neighbours say nothing about — a patch on
      // an inside corner then hangs off the terrain's step (caught by the
      // containment battery in composition.test.ts, at cell 5,3 of a stair
      // fixture). One axis makes containment true by construction.
      const open = (cc: number, rr: number): boolean =>
        cc >= 0 && cc < w && rr >= 0 && rr < h && isMass(glyphAt(grid, cc, rr)) && !claimed.has(`${cc},${rr}`);
      const wide = hash2(c, r, 29) < 0.6; // most patches lie along the course
      const spillL = wide && open(c - 1, r) ? TILE * 0.5 : 0;
      const spillR = wide && open(c + 1, r) ? TILE * 0.5 : 0;
      const spillU = !wide && open(c, r - 1) ? TILE * 0.35 : 0;
      const spillD = !wide && open(c, r + 1) ? TILE * 0.5 : 0;
      const mw = Math.min(TILE * (0.5 + hash2(c, r, 23) * 1.1), TILE + spillL + spillR);
      const mh = Math.min(TILE * (0.32 + hash2(c, r, 24) * 0.55), TILE + spillU + spillD);
      const x0 = c * TILE - spillL;
      const y0 = r * TILE - spillU;
      out.push({
        kind: shine ? "shine" : "scuff",
        c,
        r,
        x: x0 + hash2(c, r, 25) * Math.max(TILE + spillL + spillR - mw, 0),
        y: y0 + hash2(c, r, 26) * Math.max(TILE + spillU + spillD - mh, 0),
        w: mw,
        h: mh,
        alpha: shine ? 0.035 + hash2(c, r, 27) * 0.045 : 0.045 + hash2(c, r, 28) * 0.055,
      });
    }
  }
  return out;
};

/**
 * THE FINGERPRINT of a laid surface, cell by cell: which painted stem it wears,
 * at which value, carrying how much grain. Two cells with the same fingerprint
 * draw the same picture; a run whose fingerprints repeat on a short cycle IS the
 * wallpaper the critique saw.
 *
 * Read off the PLAN the renderer places rather than re-derived from the grid.
 * That matters: a second copy of the segmentation rule is a second rule, and the
 * one thing an audit may never do is measure a model of the thing instead of the
 * thing (the browser proof of p1 caught exactly this — the crust was varying and
 * the mass under it was not, because only one of them had been given the law).
 *
 * Returns one entry per contiguous row-run, keyed by its first cell.
 */
export const surfaceSignature = (
  pieces: readonly MassPiece[],
  kinds: readonly MassKind[],
  grain: readonly SurfaceMark[] = [],
): Map<string, string[]> => {
  // A mark's KIND and its rough SIZE both change what the cell looks like, so
  // both belong in the fingerprint; its exact pixel offset does not, and folding
  // that in would make every cell trivially unique and the audit worthless.
  const marks = new Map<string, string>();
  for (const m of grain) {
    const token = `${m.kind[0] ?? "?"}${Math.round((m.w / TILE) * 2)}`;
    const at = `${m.c},${m.r}`;
    marks.set(at, [...(marks.get(at) ?? "").split("+").filter(Boolean), token].sort().join("+"));
  }
  const want = new Set(kinds);
  /** row → column → the look drawn there */
  const byRow = new Map<number, Map<number, string>>();
  for (const p of pieces) {
    if (!want.has(p.kind)) continue;
    const cells = Math.max(1, Math.round(p.w / TILE));
    for (let k = 0; k < cells; k++) {
      const c = p.c + k;
      const row = byRow.get(p.r) ?? new Map<number, string>();
      row.set(c, `${p.stem ?? "-"}:${(p.tint ?? 0xffffff).toString(16)}:${marks.get(`${c},${p.r}`) ?? "-"}`);
      byRow.set(p.r, row);
    }
  }
  const out = new Map<string, string[]>();
  for (const [r, row] of byRow) {
    const cols = [...row.keys()].sort((a, b) => a - b);
    let start = null as number | null;
    let sig: string[] = [];
    let prev = -99;
    for (const c of cols) {
      if (start === null || c !== prev + 1) {
        if (start !== null) out.set(`${start},${r}`, sig);
        start = c;
        sig = [];
      }
      sig.push(row.get(c) ?? "");
      prev = c;
    }
    if (start !== null) out.set(`${start},${r}`, sig);
  }
  return out;
};

/** The smallest p ≥ 1 the sequence repeats on, or its length when it never does. */
export const shortestPeriod = (sig: readonly string[]): number => {
  for (let p = 1; p < sig.length; p++) {
    let ok = true;
    for (let i = 0; i + p < sig.length && ok; i++) if (sig[i] !== sig[i + p]) ok = false;
    if (ok) return p;
  }
  return sig.length;
};

/**
 * Cover a run of `cells` with COMPLETE objects, widest first (never stretched).
 * Where the palette offers several objects of the same width, `seed` picks
 * between them deterministically, so a level of 2-cell ledges is not a level
 * of identical benches.
 */
type PlatObject = { stem: string; cells: number; deck?: number };
const coverWithObjects = (
  cells: number,
  palette: readonly PlatObject[],
  seed: number,
): PlatObject[] => {
  const sorted = [...palette].filter((p) => p.cells >= 1).sort((a, b) => b.cells - a.cells);
  const out: PlatObject[] = [];
  let left = cells;
  let guard = 0;
  while (left > 0 && guard++ < 32) {
    const widest = sorted.find((p) => p.cells <= left)?.cells ?? sorted[sorted.length - 1]?.cells;
    if (widest === undefined) break;
    const sameWidth = sorted.filter((p) => p.cells === widest);
    const pick = sameWidth[(seed + out.length) % sameWidth.length];
    if (pick === undefined) break;
    out.push(pick);
    left -= pick.cells;
  }
  return out;
};

/**
 * THE PLAN. Every solid cell gets interior mass; every exposed face gets its
 * carved trim; every exposed top gets a crust RUN with flush end caps.
 * A null kit reproduces the old behaviour as `fallbackFill` pieces.
 */
export const planMass = (
  grid: readonly string[],
  kit: MassKit | null,
  srcSize?: SrcSizeLookup,
): MassPiece[] => {
  const { w, h } = gridSize(grid);
  const out: MassPiece[] = [];
  const claimed = new Set<string>(); // cells owned by a platform object
  /** width ÷ height of a stem's art, 1 when the art is not (yet) resolvable */
  const aspect = (stem: string): number => {
    const s = srcSize?.(stem) ?? null;
    return s !== null && s.h > 0 ? s.w / s.h : 1;
  };

  // ── 1 · floating platforms (they own their cells outright) ─────────────────
  if (kit !== null) {
    for (const run of floatingPlatformRuns(grid)) {
      const width = run.c1 - run.c0 + 1;
      let x = run.c0 * TILE;
      for (const obj of coverWithObjects(width, kit.platObjects, run.c0 + run.r)) {
        // sized by the span it fills; the height follows the PAINTED aspect so
        // a bench stays a bench instead of being stretched to the cell box
        const objW = obj.cells * TILE;
        const objH = Math.min(objW / Math.max(aspect(obj.stem), 0.05), TILE * 2);
        // anchored by its DECK, not its top edge: whatever the art draws above
        // the walk surface (the bench's backrest) rises above the standable
        // line instead of being buried in the floor
        out.push({
          kind: "platform", stem: obj.stem, c: Math.floor(x / TILE), r: run.r,
          x, y: run.r * TILE - (obj.deck ?? 0) * objH, w: objW, h: objH,
          depth: DEPTH.platform,
        });
        x += objW;
      }
    }
    for (const cell of claimedPlatformCells(grid)) claimed.add(cell);
  }

  // ── 2 · interior mass: body → fade → sediment, as seamless per-row runs ────
  const interiorStem = (d: number): "body" | "fade" | "sediment" =>
    d >= SEDIMENT_DEPTH ? "sediment" : d >= FADE_DEPTH ? "fade" : "body";
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      const g = glyphAt(grid, c, r);
      if (!isMass(g) || claimed.has(`${c},${r}`)) { c++; continue; }
      if (kit === null) {
        out.push({ kind: "fallbackFill", stem: null, c, r, x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.body });
        c++;
        continue;
      }
      const band = interiorStem(depthAt(grid, c, r));
      let c1 = c;
      while (
        c1 + 1 < w
        && isMass(glyphAt(grid, c1 + 1, r))
        && !claimed.has(`${c1 + 1},${r}`)
        && interiorStem(depthAt(grid, c1 + 1, r)) === band
      ) c1++;
      const variants = band === "body" ? kit.body : [band === "fade" ? kit.fade : kit.sediment];
      // …laid in SEGMENTS, like the course above it and on its own table, so the
      // mass under the hall stops being one 656-px tileSprite of one variant
      // (measured in the running p1 — the wallpaper the critique was reading)
      let seg = c;
      for (let k = 0; seg <= c1; k++) {
        const want = BODY_SEGMENT_CELLS[(c + r + k) % BODY_SEGMENT_CELLS.length] ?? 5;
        const segEnd = Math.min(seg + want - 1, c1);
        const stem = variants[(c + r + k) % variants.length] ?? variants[0] ?? kit.fade;
        out.push({
          kind: band, stem, c: seg, r, x: seg * TILE, y: r * TILE,
          w: (segEnd - seg + 1) * TILE, h: TILE,
          tile: true, tint: courseTintAt(c, r, k, 11), depth: DEPTH.body,
        });
        seg = segEnd + 1;
      }
      c = c1 + 1;
    }
  }
  if (kit === null) return out;

  // ── 3 · crust runs + FLUSH end caps on every exposed top ───────────────────
  for (const { c, c1, r } of crustRuns(grid, claimed)) {
    const x = c * TILE;
    const runW = (c1 - c + 1) * TILE;
    const y = r * TILE - CRUST_LIP;
    // the course, laid in alternating segments (CRUST_SEGMENT_CELLS) at
    // alternating values (CRUST_TINTS) — the no-metronome law
    let seg = c;
    for (let k = 0; seg <= c1; k++) {
      const want = CRUST_SEGMENT_CELLS[(c + r + k) % CRUST_SEGMENT_CELLS.length] ?? 4;
      const segEnd = Math.min(seg + want - 1, c1);
      const stem = kit.crust[(c + r + k) % kit.crust.length] ?? kit.crust[0] ?? "";
      out.push({
        kind: "crust", stem, c: seg, r, x: seg * TILE, y,
        w: (segEnd - seg + 1) * TILE, h: CRUST_H, tile: true,
        tint: crustTintAt(c, r, k), depth: DEPTH.crust,
      });
      seg = segEnd + 1;
    }
    // CAPS OVERLAP INWARD. The AF caps are painted as SEGMENT ENDS — a
    // rounded end followed by a stretch of the same course — not as outboard
    // bookends. So a cap is laid ON the run's last stretch with its outer
    // edge exactly at the run's outer edge: the rounded end lands on the
    // terrain boundary and the rest blends into the identical loop beneath.
    // (Hanging them outside is what made Build-D's caps read as floating.)
    const capW = CRUST_H * Math.max(aspect(kit.crustCapL), 0.2);
    const capsFit = runW >= 2 * capW; // a stub run gets edge trims instead
    if (capsFit && c > 0) {
      out.push({ kind: "capL", stem: kit.crustCapL, c, r, x, y, w: capW, h: CRUST_H, depth: DEPTH.cap });
    }
    if (capsFit && c1 < w - 1) {
      out.push({ kind: "capR", stem: kit.crustCapR, c: c1, r, x: x + runW - capW, y, w: capW, h: CRUST_H, depth: DEPTH.cap });
    }
  }

  // ── 4 · edges + corners wherever mass meets air ────────────────────────────
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!isMass(glyphAt(grid, c, r)) || claimed.has(`${c},${r}`)) continue;
      const x = c * TILE;
      const y = r * TILE;
      const airL = !isMass(glyphAt(grid, c - 1, r));
      const airR = !isMass(glyphAt(grid, c + 1, r));
      const airD = !isMass(glyphAt(grid, c, r + 1));
      const airU = !isMass(glyphAt(grid, c, r - 1));
      if (airL) out.push({ kind: "edgeL", stem: kit.edgeL, c, r, x: x - EDGE_OUT, y, w: EDGE_W, h: TILE, depth: DEPTH.trim });
      if (airR) out.push({ kind: "edgeR", stem: kit.edgeR, c, r, x: x + TILE + EDGE_OUT - EDGE_W, y, w: EDGE_W, h: TILE, depth: DEPTH.trim });
      if (airL && airD) out.push({ kind: "cornerBL", stem: kit.cornerBL, c, r, x: x - EDGE_OUT, y: y + TILE - CORNER + EDGE_OUT, w: CORNER, h: CORNER, depth: DEPTH.trim });
      if (airR && airD) out.push({ kind: "cornerBR", stem: kit.cornerBR, c, r, x: x + TILE + EDGE_OUT - CORNER, y: y + TILE - CORNER + EDGE_OUT, w: CORNER, h: CORNER, depth: DEPTH.trim });
      // inner corners: where a wall rises out of the floor beside this cell.
      // glyphAt reports OUTSIDE the grid as solid, so the diagonal probe has to
      // be bounds-checked or every ground run grows a phantom corner against
      // the world edge (seen in the p1 browser proof before this guard).
      const inGrid = (cc: number, rr: number): boolean => cc >= 0 && cc < w && rr >= 0 && rr < h;
      if (airU && inGrid(c - 1, r - 1) && isMass(glyphAt(grid, c - 1, r - 1))) {
        out.push({ kind: "inCornerL", stem: kit.inCornerL, c, r, x, y: y - CORNER + EDGE_OUT, w: CORNER, h: CORNER, depth: DEPTH.trim });
      }
      if (airU && inGrid(c + 1, r - 1) && isMass(glyphAt(grid, c + 1, r - 1))) {
        out.push({ kind: "inCornerR", stem: kit.inCornerR, c, r, x: x + TILE - CORNER, y: y - CORNER + EDGE_OUT, w: CORNER, h: CORNER, depth: DEPTH.trim });
      }
    }
  }

  // ── 5 · slopes as drawn ramp masses (the crust runs diagonally) ────────────
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const g = glyphAt(grid, c, r);
      if (g === "z" || !isSlope(g)) continue; // `z` is the slide, handled below
      const up = g === "/" || g === "1" || g === "2";
      const wide = g === "1" || g === "3"; // the 30° pairs span two cells
      out.push({
        kind: "ramp", stem: up ? kit.rampUp : kit.rampDown, c, r,
        x: c * TILE, y: r * TILE - CRUST_LIP, w: (wide ? 2 : 1) * TILE, h: TILE + CRUST_LIP,
        depth: DEPTH.ramp,
      });
    }
  }

  // ── 6 · the chalk slide: ONE module per `z` cell ───────────────────────────
  // Batch AF2 re-authored the slide as TRUE-45° CELLS — each module is drawn
  // corner-to-corner inside a 512² cell, and the under-strut is that cell's
  // triangular wedge. So the chute is assembled by the grid itself: no
  // rotation, no along-diagonal stepping, no seams to chase. (AF's earlier
  // sheet wanted a rotated band laid along the run; the art changed contract,
  // and the renderer follows the art.)
  if (kit.slide) {
    const slide = kit.slide;
    for (const run of slideRuns(grid)) {
      for (let k = 0; k < run.n; k++) {
        const c = run.c + k;
        const r = run.r + k;
        out.push({
          kind: "slideUnder", stem: slide.under, c, r,
          x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.ramp,
        });
        const first = k === 0;
        const last = k === run.n - 1;
        out.push({
          kind: first ? "slideTop" : last ? "slideFoot" : "slideMid",
          stem: first ? slide.top : last ? slide.foot : slide.mid,
          c, r, x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.slide,
        });
      }
    }
  }

  return out;
};

/** The audit's question: did anything render as a naked engine fill? */
export const nakedFills = (pieces: readonly MassPiece[]): MassPiece[] =>
  pieces.filter((p) => p.kind === "fallbackFill");

/**
 * The OTHER naked class, and the one only a kit can produce: a solid cell no
 * interior piece covers, so the wash shows straight through the ground. The
 * plan must account for every solid cell in the world — not every screen.
 */
export const uncoveredSolids = (
  grid: readonly string[],
  pieces: readonly MassPiece[],
): Array<{ c: number; r: number }> => {
  const covers: MassKind[] = ["body", "fade", "sediment", "platform", "fallbackFill"];
  const covered = new Set<string>();
  for (const p of pieces) {
    if (!covers.includes(p.kind)) continue;
    const cells = Math.max(1, Math.round(p.w / TILE));
    for (let k = 0; k < cells; k++) covered.add(`${p.c + k},${p.r}`);
  }
  const out: Array<{ c: number; r: number }> = [];
  const { w, h } = gridSize(grid);
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (isMass(glyphAt(grid, c, r)) && !covered.has(`${c},${r}`)) out.push({ c, r });
    }
  }
  return out;
};
