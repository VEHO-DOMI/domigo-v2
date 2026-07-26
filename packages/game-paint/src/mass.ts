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
/** the walk course: 5 px of lip above the standing line, 9 px into the mass */
export const CRUST_H = 14;
export const CRUST_LIP = 5;
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

export type MassKind =
  | "body" | "fade" | "sediment"
  | "crust" | "capL" | "capR"
  | "edgeL" | "edgeR" | "cornerBL" | "cornerBR" | "inCornerL" | "inCornerR"
  | "ramp" | "platform"
  | "slideUnder" | "slideTop" | "slideMid" | "slideFoot"
  | "fallbackFill";

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

/** Cover a run of `cells` with COMPLETE objects, widest first (never stretched). */
const coverWithObjects = (
  cells: number,
  palette: readonly { stem: string; cells: number }[],
): Array<{ stem: string; cells: number }> => {
  const sorted = [...palette].sort((a, b) => b.cells - a.cells).filter((p) => p.cells >= 1);
  const out: Array<{ stem: string; cells: number }> = [];
  let left = cells;
  let guard = 0;
  while (left > 0 && guard++ < 32) {
    const pick = sorted.find((p) => p.cells <= left) ?? sorted[sorted.length - 1];
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
export const planMass = (grid: readonly string[], kit: MassKit | null): MassPiece[] => {
  const { w, h } = gridSize(grid);
  const out: MassPiece[] = [];
  const claimed = new Set<string>(); // cells owned by a platform object

  // ── 1 · floating platforms (they own their cells outright) ─────────────────
  if (kit !== null) {
    for (const run of floatingPlatformRuns(grid)) {
      const width = run.c1 - run.c0 + 1;
      let x = run.c0 * TILE;
      for (const obj of coverWithObjects(width, kit.platObjects)) {
        out.push({
          kind: "platform", stem: obj.stem, c: Math.floor(x / TILE), r: run.r,
          x, y: run.r * TILE - CRUST_LIP, w: obj.cells * TILE, h: TILE + CRUST_LIP,
          depth: DEPTH.platform,
        });
        x += obj.cells * TILE;
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
      const stem = kit.crust[(c + r) % kit.crust.length] ?? kit.crust[0] ?? "";
      out.push({ kind: "crust", stem, c, r, x, y, w: runW, h: CRUST_H, tile: true, depth: DEPTH.crust });
      // caps CONNECT flush: right edge of capL == left edge of the run, and
      // vice versa. No cap where the run runs into the world edge.
      if (c > 0) out.push({ kind: "capL", stem: kit.crustCapL, c, r, x: x - CRUST_H, y, w: CRUST_H, h: CRUST_H, depth: DEPTH.cap });
      if (c1 < w - 1) out.push({ kind: "capR", stem: kit.crustCapR, c: c1, r, x: x + runW, y, w: CRUST_H, h: CRUST_H, depth: DEPTH.cap });
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
      // inner corners: where a wall rises out of the floor beside this cell
      if (airU && isMass(glyphAt(grid, c - 1, r - 1))) {
        out.push({ kind: "inCornerL", stem: kit.inCornerL, c, r, x, y: y - CORNER + EDGE_OUT, w: CORNER, h: CORNER, depth: DEPTH.trim });
      }
      if (airU && isMass(glyphAt(grid, c + 1, r - 1))) {
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

  // ── 6 · the chalk slide: under-structure + a continuous surface band ───────
  if (kit.slide) {
    const slide = kit.slide;
    for (const run of slideRuns(grid)) {
      for (let k = 0; k < run.n; k++) {
        out.push({
          kind: "slideUnder", stem: slide.under, c: run.c + k, r: run.r + k,
          x: (run.c + k) * TILE, y: (run.r + k) * TILE, w: TILE, h: TILE, depth: DEPTH.ramp,
        });
      }
      // the surface rides the diagonal from the run's top-left corner to the
      // last cell's bottom-right corner — ONE unbroken chute, never per-cell steps
      const len = Math.hypot(run.n * TILE, run.n * TILE);
      const modules = Math.max(2, Math.ceil(len / (SLIDE_BAND_PX * 2)));
      const step = len / modules;
      const rot = Math.PI / 4; // 45° down-right
      for (let i = 0; i < modules; i++) {
        const along = i * step;
        const x = run.c * TILE + (along * Math.SQRT1_2);
        const y = run.r * TILE + (along * Math.SQRT1_2);
        const stem = i === 0 ? slide.top : i === modules - 1 ? slide.foot : slide.mid;
        const kind = i === 0 ? "slideTop" : i === modules - 1 ? "slideFoot" : "slideMid";
        // anchored ON the travel line: the band straddles it, a lip above and
        // the rest sunk into the wedge below (rotation is around this anchor)
        out.push({
          kind, stem, c: run.c + Math.floor(along * Math.SQRT1_2 / TILE), r: run.r + Math.floor(along * Math.SQRT1_2 / TILE),
          x, y, w: step, h: SLIDE_BAND_PX,
          rot, originX: 0, originY: SLIDE_ABOVE_FRAC, depth: DEPTH.slide,
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
