// THE PAINTED BOOK — warm.ts — WHICH texture to hand the graphics card, and WHEN.
//
// R5-N3 · E4. The defect this exists to remove, measured by E3 and confirmed by
// Koki from the other side ("ruckelig, vor allem am Anfang des Levels" — and the
// boss arena, whose first frame is seven times cheaper, "extrem flüssig"):
//
//   A field phase's FIRST frame costs ~224 ms against the arena's ~31.9 ms.
//   Phaser calls gl.texImage2D when a file finishes loading, but the driver
//   only realises the upload when the texture is first SAMPLED BY A DRAW. Every
//   texture the opening screen touches is therefore realised inside one frame —
//   the first one, the one the child is looking at.
//
// The cure is not to do less work; it is to do the same work while the child is
// already waiting for the download anyway. That makes ORDER and PACE the whole
// design, and both are decided here — as pure functions over plain numbers, so
// they are provable under `vitest` without a browser, a canvas or a GPU.
//
// Nothing in this file touches Phaser. The scene supplies rectangles and sizes;
// it gets back an order and a count. (Determinism law: no Math.random, no
// Date.now — the same inputs always produce the same plan.)

/** An axis-aligned rectangle in world pixels. */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/** One drawn object, reduced to what the plan needs: its texture and where it sits. */
export interface WarmCandidate extends Rect {
  /** the Phaser texture key, e.g. `pb-tile_floor` */
  readonly key: string;
}

export interface WarmPlan {
  /** textures the opening screen samples — these must be warm BEFORE frame one */
  readonly first: readonly string[];
  /** everything else, nearest-first: what is about to scroll in is warmed first */
  readonly rest: readonly string[];
}

/**
 * Gap between two rectangles in world pixels; 0 when they touch or overlap.
 *
 * Deliberately the gap and not the centre distance: a background plate wider
 * than the level has its centre far away and is on screen the whole time. Centre
 * distance would sort it last and it would be the one thing that hitches.
 */
export const rectGap = (a: Rect, b: Rect): number => {
  const dx = Math.max(0, a.x - (b.x + b.w), b.x - (a.x + a.w));
  const dy = Math.max(0, a.y - (b.y + b.h), b.y - (a.y + a.h));
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Split every texture in the scene into "the opening screen needs it" and "the
 * rest, nearest first".
 *
 * A texture is judged by its CLOSEST object: one floor tile drawn a hundred
 * times is `first` if any single one of them is on screen. The insertion order
 * of `candidates` breaks distance ties, so the plan is stable across runs.
 */
export const warmOrder = (candidates: readonly WarmCandidate[], view: Rect): WarmPlan => {
  const nearest = new Map<string, number>();
  for (const c of candidates) {
    const gap = rectGap(c, view);
    const seen = nearest.get(c.key);
    if (seen === undefined || gap < seen) nearest.set(c.key, gap);
  }
  const first: string[] = [];
  const rest: Array<{ key: string; gap: number; seq: number }> = [];
  let seq = 0;
  for (const [key, gap] of nearest) {
    if (gap === 0) first.push(key);
    else rest.push({ key, gap, seq });
    seq++;
  }
  rest.sort((a, b) => a.gap - b.gap || a.seq - b.seq);
  return { first, rest: rest.map((r) => r.key) };
};

// ── the ration ──────────────────────────────────────────────────────────────

/** One queued texture, and the only property that predicts its cost. */
export interface WarmItem {
  readonly key: string;
  /** megapixels — width × height ÷ 1e6 */
  readonly mpx: number;
}

/**
 * MEGAPIXELS PER FRAME, and the reason the unit is not milliseconds.
 *
 * The first version of this file rationed warming by measured wall-clock, and
 * the measurement said 0.43 ms per megapixel — so the planner cheerfully took
 * enormous slices. It was measuring the wrong thing: handing a texture over is
 * GPU work, and the CPU only queues the command. The same megapixel that costs
 * 0.43 ms of CPU costs roughly 3.5 ms of GPU (derived from the dose ladder:
 * p1's ~19.7 Mpx accounted for ~68 ms of first-frame GPU time). Rationing by a
 * clock that cannot see the cost is how a warmer becomes the stutter it was
 * written to prevent — measured on p2 at 257 ms against a 159 ms control.
 *
 * Megapixels are what the card is actually being asked for, so megapixels are
 * what gets rationed. 0.5 Mpx ≈ 1.8 ms of GPU: real progress, and far enough
 * inside a 16.67 ms frame that it cannot be the thing that breaks one.
 */
export const WARM_MPX_PER_FRAME = 0.5;

/**
 * How many textures to take from the front of the queue without exceeding the
 * ration.
 *
 * THE OVERSHOOT LAW, stated out loud because it is a real property and not a
 * bug: a texture cannot be half-warmed. If the very next one is bigger than the
 * whole ration — `plate_yard` is 2.58 Mpx, five rations by itself — this still
 * returns 1. Making progress and overshooting beats stalling forever.
 */
export const warmTake = (queue: readonly WarmItem[], budgetMpx: number, maxPerFrame = 64): number => {
  if (queue.length === 0 || budgetMpx <= 0) return 0;
  let spent = 0;
  let taken = 0;
  const cap = Math.min(maxPerFrame, queue.length);
  while (taken < cap) {
    const item = queue[taken];
    if (item === undefined) break;
    if (taken > 0 && spent + item.mpx > budgetMpx) break;
    spent += item.mpx;
    taken++;
  }
  // `taken > 0` above IS the overshoot law: the first item is never rejected on
  // price. Do not "guard" this with Math.max(1, taken) — it can never fire, and
  // where it could (maxPerFrame: 0) it would take a texture the caller forbade.
  return taken;
};
