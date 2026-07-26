// PB-C1 · THE LAYER COMPOSITOR — doc 36 §1 as a PURE planner.
//
// The scene used to hang ONE full-bleed painting behind the play space and one
// full-contrast band in front of it; that can never read as a room you are IN
// (doc 36 §0). The world is now FIVE planes separated by parallax and a value
// ramp: L0 air (engine-drawn wash) · L1 far shell · L2 mid furniture ·
// L3 play (the existing world) · L4 foreground occluders.
//
// Everything here is pure geometry so it can be UNIT-TESTED and AUDITED
// headlessly — a WebGL canvas cannot be read back (Build-D banked that false
// negative the hard way), so "did the planes cover?" is answered by arithmetic
// over the manifest, not by sampling pixels off the screen.

import { type CompositionSpec, type ShellSpec, resolveMeasure } from "./composition.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE } from "./paint.ts";

/** Render depths per plane (L3 play keeps 1..10; see PaintScene). */
export const PLANE_DEPTH = { wash: -20, far: -18, mid: -9, fg: 12 } as const;

export interface LayerPiece {
  /** wash = engine-drawn gradient · segment/anchor = Image · loop = tileSprite */
  kind: "wash" | "segment" | "anchor" | "loop";
  plane: "L0" | "L1" | "L2" | "L4";
  stem?: string;
  /** gradient stops, top→bottom (wash only) */
  colors?: readonly number[];
  x: number;
  y: number;
  w: number;
  h: number;
  parallax: number;
  parallaxY: number;
  tint?: number;
  alpha?: number;
  depth: number;
}

export interface SrcSize {
  w: number;
  h: number;
}

/** The camera's scroll range — camera.ts clamps scroll to exactly this box. */
export const travelBox = (worldWpx: number, worldHpx: number): { maxCamX: number; maxCamY: number } => ({
  maxCamX: Math.max(worldWpx - LOGICAL_W, 0),
  maxCamY: Math.max(worldHpx - LOGICAL_H, 0),
});

/**
 * THE PARALLAX WINDOW — mirrored from the renderer, not approximated (P-18).
 *
 * PaintScene points the camera with `centerOn()`, and Phaser's `centerOn`
 * divides by the camera's PIXEL width while `scrollX` is in world units. Under
 * zoom = RENDER_SCALE that leaves a constant offset: scrollX = camX − K. The
 * consequence is easy to get wrong and invisible to a unit test that invents
 * its own model — a plane at factor p does NOT see [camX, camX+view]; it sees
 * that window pulled toward K. PB-C1 measured it in the browser (camX = 0 →
 * scrollX = −352 → the far shell's window was [264, 616], not [0, 352]), which
 * is why an early L1 stopped 44 px short of the right edge with every audit
 * green. K is derived here from the same constants the scene uses.
 */
export const K_X = (LOGICAL_W * (RENDER_SCALE - 1)) / 2;
export const K_Y = (LOGICAL_H * (RENDER_SCALE - 1)) / 2;

/** The world-coordinate window a plane at factor `p` shows for a given cam. */
export const visibleWindow = (cam: number, p: number, view: number, K: number): { lo: number; hi: number } => {
  const lo = (cam - K) * p + K;
  return { lo, hi: lo + view };
};

/**
 * THE COVER LAW (doc 36 §3): the piece must fill its plane's window at EVERY
 * camera position in [0, maxCam]. The left bound is tightest at cam = 0, the
 * right bound at cam = maxCam.
 */
export const coversAxis = (a0: number, a1: number, p: number, view: number, maxCam: number, K: number): boolean => {
  const at0 = visibleWindow(0, p, view, K);
  const atMax = visibleWindow(maxCam, p, view, K);
  const EPS = 1e-6;
  return a0 <= at0.lo + EPS && a1 >= atMax.hi - EPS;
};

/**
 * The EXACT world box a plane is ever seen through — its visible envelope,
 * from the first camera position to the last.
 *
 * It must be exact, not merely sufficient. A slow plane's window barely moves
 * (the far shell's vertical window shifts ~11 px across a whole level), so a
 * box padded out to the world's own bounds makes the plane far taller than it
 * is ever seen — and since a segment's WIDTH is derived from its height, the
 * art then renders oversized with its painted content pushed out of frame.
 * PK-C2 hit exactly that: p1's commissioned window bay and coat rail sat above
 * the top of the screen and the wall read as empty plaster.
 */
export const coverBox = (
  worldWpx: number,
  worldHpx: number,
  p: number,
  pY: number,
): { x: number; y: number; w: number; h: number } => {
  const { maxCamX, maxCamY } = travelBox(worldWpx, worldHpx);
  const x0 = visibleWindow(0, p, LOGICAL_W, K_X).lo;
  const x1 = visibleWindow(maxCamX, p, LOGICAL_W, K_X).hi;
  const y0 = visibleWindow(0, pY, LOGICAL_H, K_Y).lo;
  const y1 = visibleWindow(maxCamY, pY, LOGICAL_H, K_Y).hi;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};

/**
 * Cover-fit a full-bleed image: scaled UP (never down, never letterboxed) to
 * cover its plane's box, anchored on the box's bottom edge. Returns a display
 * box with origin (0, 0) — top-left in world coordinates.
 */
export const coverFit = (
  src: SrcSize,
  worldWpx: number,
  worldHpx: number,
  p: number,
  pY: number,
): { x: number; y: number; w: number; h: number } => {
  const box = coverBox(worldWpx, worldHpx, p, pY);
  const scale = Math.max(box.w / src.w, box.h / src.h);
  const w = src.w * scale;
  const h = src.h * scale;
  return { x: box.x, y: box.y + box.h - h, w, h };
};

const planeOf = (which: "far" | "mid" | "fg"): "L1" | "L2" | "L4" =>
  which === "far" ? "L1" : which === "mid" ? "L2" : "L4";

/** Lay one shell plane: repeat its segments left→right until the cover law holds. */
const planShell = (
  shell: ShellSpec,
  which: "far" | "mid" | "fg",
  worldWpx: number,
  worldHpx: number,
  srcSize: (stem: string) => SrcSize | null,
): LayerPiece[] => {
  const out: LayerPiece[] = [];
  const plane = planeOf(which);
  const depth = PLANE_DEPTH[which];
  const p = shell.parallax;
  const pY = shell.parallaxY ?? p;
  const box = coverBox(worldWpx, worldHpx, p, pY);
  // A COVER plane (the far shell) is sized by the cover law; a BAND (mid
  // furniture, foreground fringe) keeps its declared height and horizon line
  // but still spans the box horizontally, or it visibly runs out.
  const h = shell.cover === true ? box.h : resolveMeasure(shell.height, worldHpx);
  const y = shell.cover === true ? box.y : resolveMeasure(shell.bottom, worldHpx) - (shell.lift ?? 0) - h;

  if (shell.loop === true) {
    // a seamless loop band: ONE tileSprite spanning the whole requirement
    const stem = shell.segments[0];
    if (stem === undefined || srcSize(stem) === null) return out;
    out.push({ kind: "loop", plane, stem, x: box.x, y, w: box.w, h, parallax: p, parallaxY: pY, tint: shell.tint, alpha: shell.alpha, depth });
    return out;
  }

  // discrete segments, alternating in order — each tiles with itself and with
  // its sibling, so A,B,A,B… reads as one continuous wall (AF group 1 law)
  const sized = shell.segments.map((s) => ({ stem: s, src: srcSize(s) })).filter((s): s is { stem: string; src: SrcSize } => s.src !== null);
  if (sized.length === 0) return out;
  let x = box.x;
  let i = 0;
  // guard: a degenerate source (w or h ≤ 0) must never spin this loop
  while (x < box.x + box.w && i < 512) {
    const seg = sized[i % sized.length];
    if (seg === undefined) break;
    const w = (seg.src.w * h) / seg.src.h;
    if (!(w > 0)) break;
    out.push({ kind: "segment", plane, stem: seg.stem, x, y, w, h, parallax: p, parallaxY: pY, tint: shell.tint, alpha: shell.alpha, depth });
    x += w;
    i++;
  }
  if (shell.anchor) {
    const src = srcSize(shell.anchor.stem);
    if (src !== null) {
      const aw = (src.w * h) / src.h;
      out.push({
        kind: "anchor", plane, stem: shell.anchor.stem,
        x: Math.max(0, shell.anchor.at * Math.max(x - aw, 0)), y, w: aw, h,
        parallax: p, parallaxY: pY, tint: shell.tint, alpha: shell.alpha, depth: depth + 0.1,
      });
    }
  }
  return out;
};

/** L0: the room's light. Engine-drawn, so it covers the travel box BY LAW. */
const planWash = (spec: CompositionSpec, worldWpx: number, worldHpx: number): LayerPiece => {
  const p = 0.05;
  const box = coverBox(worldWpx, worldHpx, p, p);
  return {
    kind: "wash", plane: "L0",
    colors: spec.wash.colors,
    x: box.x, y: box.y, w: box.w, h: box.h,
    parallax: p, parallaxY: p, depth: PLANE_DEPTH.wash,
  };
};

/** The whole backdrop for one phase, back to front. */
export const planLayers = (
  spec: CompositionSpec,
  worldWpx: number,
  worldHpx: number,
  srcSize: (stem: string) => SrcSize | null,
): LayerPiece[] => [
  planWash(spec, worldWpx, worldHpx),
  ...planShell(spec.far, "far", worldWpx, worldHpx, srcSize),
  ...(spec.mid ? planShell(spec.mid, "mid", worldWpx, worldHpx, srcSize) : []),
  ...(spec.fg ? planShell(spec.fg, "fg", worldWpx, worldHpx, srcSize) : []),
];

/** Does a plane's pieces, taken together, cover the camera's travel box? */
export const planeCovers = (
  pieces: readonly LayerPiece[],
  worldWpx: number,
  worldHpx: number,
  axis: "x" | "both",
): boolean => {
  if (pieces.length === 0) return false;
  const { maxCamX, maxCamY } = travelBox(worldWpx, worldHpx);
  const p = pieces[0]?.parallax ?? 1;
  const pY = pieces[0]?.parallaxY ?? 1;
  // contiguity: sorted pieces must butt up (a gap between segments is a hole)
  const sorted = [...pieces].sort((a, b) => a.x - b.x);
  let x1 = sorted[0]?.x ?? 0;
  for (const piece of sorted) {
    if (piece.x > x1 + 0.001) return false; // gap
    x1 = Math.max(x1, piece.x + piece.w);
  }
  const x0 = sorted[0]?.x ?? 0;
  if (!coversAxis(x0, x1, p, LOGICAL_W, maxCamX, K_X)) return false;
  if (axis === "x") return true;
  const y0 = Math.min(...pieces.map((q) => q.y));
  const yEnd = Math.max(...pieces.map((q) => q.y + q.h));
  return coversAxis(y0, yEnd, pY, LOGICAL_H, maxCamY, K_Y);
};
