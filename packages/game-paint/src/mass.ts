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
      for (let k = run.c0; k <= run.c1; k++) claimed.add(`${k},${run.r}`);
    }
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
      const stem = variants[(c + r) % variants.length] ?? variants[0] ?? kit.fade;
      out.push({
        kind: band, stem, c, r, x: c * TILE, y: r * TILE, w: (c1 - c + 1) * TILE, h: TILE,
        tile: true, depth: DEPTH.body,
      });
      c = c1 + 1;
    }
  }
  if (kit === null) return out;

  // ── 3 · crust runs + FLUSH end caps on every exposed top ───────────────────
  const wearsCrust = (c: number, r: number): boolean => {
    const g = glyphAt(grid, c, r);
    if (!isMass(g) || g === "~" || claimed.has(`${c},${r}`)) return false;
    if (isMass(glyphAt(grid, c, r - 1))) return false; // buried
    return !isSlope(glyphAt(grid, c, r - 1)); // a ramp sits on it — it carries the crust
  };
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!wearsCrust(c, r)) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && wearsCrust(c1 + 1, r)) c1++;
      const x = c * TILE;
      const runW = (c1 - c + 1) * TILE;
      const y = r * TILE - CRUST_LIP;
      // the course, laid in alternating segments (CRUST_SEGMENT_CELLS)
      let seg = c;
      for (let k = 0; seg <= c1; k++) {
        const want = CRUST_SEGMENT_CELLS[(c + r + k) % CRUST_SEGMENT_CELLS.length] ?? 4;
        const segEnd = Math.min(seg + want - 1, c1);
        const stem = kit.crust[(c + r + k) % kit.crust.length] ?? kit.crust[0] ?? "";
        out.push({
          kind: "crust", stem, c: seg, r, x: seg * TILE, y,
          w: (segEnd - seg + 1) * TILE, h: CRUST_H, tile: true, depth: DEPTH.crust,
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
      c = c1 + 1;
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
