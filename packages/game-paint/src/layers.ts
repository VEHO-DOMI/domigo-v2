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
import { LOGICAL_H, LOGICAL_W } from "./paint.ts";

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
 * THE COVER LAW (doc 36 §3). An object at world span [a0,a1] with scroll
 * factor p renders at screen a − cam·p. To cover the viewport for EVERY
 * camera position in [0, maxCam] it must satisfy BOTH ends:
 *   a0 ≤ 0                    (covers at cam = 0)
 *   a1 ≥ view + maxCam·p      (still covers at cam = maxCam)
 * The pre-C1 plateCover used (1 − p) instead of p AND centred the image on the
 * world, so its left edge drifted right of the camera on short levels — that
 * is exactly the p4 cream void (Build-D finding F-6).
 */
export const coversAxis = (a0: number, a1: number, p: number, view: number, maxCam: number): boolean =>
  a0 <= 0 && a1 >= view + maxCam * p;

/** The span a full-bleed piece must occupy to satisfy the cover law. */
export const coverSpan = (
  worldWpx: number,
  worldHpx: number,
  p: number,
  pY: number,
): { w: number; h: number } => {
  const { maxCamX, maxCamY } = travelBox(worldWpx, worldHpx);
  return { w: LOGICAL_W + maxCamX * p, h: Math.max(worldHpx, LOGICAL_H + maxCamY * pY) };
};

/**
 * Cover-fit a full-bleed image: scaled UP (never down, never letterboxed) to
 * cover the camera's travel box, anchored bottom-left at the world floor.
 * Returns the display box with origin (0, 0) — top-left in world coordinates.
 */
export const coverFit = (
  src: SrcSize,
  worldWpx: number,
  worldHpx: number,
  p: number,
  pY: number,
): { x: number; y: number; w: number; h: number } => {
  const need = coverSpan(worldWpx, worldHpx, p, pY);
  const scale = Math.max(need.w / src.w, need.h / src.h);
  const w = src.w * scale;
  const h = src.h * scale;
  return { x: 0, y: worldHpx - h, w, h }; // bottom-anchored on the world floor
};

/** How many world px a plane must span horizontally to satisfy the cover law. */
export const planeNeedW = (worldWpx: number, p: number): number =>
  LOGICAL_W + travelBox(worldWpx, 0).maxCamX * p;

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
  const h = resolveMeasure(shell.height, worldHpx);
  const bottom = resolveMeasure(shell.bottom, worldHpx) - (shell.lift ?? 0);
  const y = bottom - h;
  const needW = planeNeedW(worldWpx, p);

  if (shell.loop === true) {
    // a seamless loop band: ONE tileSprite spanning the whole requirement
    const stem = shell.segments[0];
    if (stem === undefined || srcSize(stem) === null) return out;
    out.push({ kind: "loop", plane, stem, x: 0, y, w: needW, h, parallax: p, parallaxY: pY, tint: shell.tint, alpha: shell.alpha, depth });
    return out;
  }

  // discrete segments, alternating in order — each tiles with itself and with
  // its sibling, so A,B,A,B… reads as one continuous wall (AF group 1 law)
  const sized = shell.segments.map((s) => ({ stem: s, src: srcSize(s) })).filter((s): s is { stem: string; src: SrcSize } => s.src !== null);
  if (sized.length === 0) return out;
  let x = 0;
  let i = 0;
  // guard: a degenerate source (w or h ≤ 0) must never spin this loop
  while (x < needW && i < 512) {
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
  const need = coverSpan(worldWpx, worldHpx, p, p); // h is already ≥ worldHpx
  const w = Math.max(need.w, worldWpx);
  return {
    kind: "wash", plane: "L0",
    colors: spec.wash.colors,
    x: 0, y: worldHpx - need.h, w, h: need.h,
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
  if (!coversAxis(x0, x1, p, LOGICAL_W, maxCamX)) return false;
  if (axis === "x") return true;
  const y0 = Math.min(...pieces.map((q) => q.y));
  const yEnd = Math.max(...pieces.map((q) => q.y + q.h));
  return coversAxis(y0, yEnd, pY, LOGICAL_H, maxCamY);
};
