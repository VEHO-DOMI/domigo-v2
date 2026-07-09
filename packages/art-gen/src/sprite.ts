/**
 * Procedural player avatar — a blocky 16x16 character with a 4-direction frame
 * set (down/up/left/right). Deterministic from a seed (shirt/hair colors vary).
 * A1-3 adds a 2-step walk cycle per facing (alternating foot-lift): the neutral
 * pose (`frames`) is byte-identical to before, and `walk[facing]` carries the
 * two step frames that differ ONLY in the leg rows. Emits IndexedImages (no canvas).
 */
import { TILE, grid, put, rect, type IndexedImage } from "./image.ts";
import { mulberry32, pick } from "./rng.ts";

export type Facing = "down" | "up" | "left" | "right";
export const FACINGS: Facing[] = ["down", "up", "left", "right"];

/** Walk-cycle step: 0 = neutral (both feet down), 1 = right foot up, 2 = left foot up. */
export type WalkStep = 0 | 1 | 2;

const HAIR = ["#3b2f2f", "#6b4423", "#1f2937", "#8d5524"] as const;
const SHIRT = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#d97706"] as const;

export interface PlayerSprite {
  palette: string[];
  /** Neutral (resting) frame per Facing (FACINGS order) — unchanged since A1-1. */
  frames: IndexedImage[];
  /** A1-3: the two walk-cycle step frames per facing. The animation cycles
   *  neutral → step 1 → neutral → step 2; frame 0 stays the neutral `frames`. */
  walk: Record<Facing, [IndexedImage, IndexedImage]>;
}

/** palette: 0 transparent, 1 outline, 2 skin, 3 hair, 4 shirt, 5 pants, 6 eye.
 *  `step` lifts one foot (draws its leg 1px shorter) — step 0 is the resting pose. */
function paintFacing(facing: Facing, hair: string, shirt: string, step: WalkStep = 0): IndexedImage {
  const palette = ["#00000000", "#1f2937", "#f1c27d", hair, shirt, "#374151", "#0b1020"];
  const px = grid(TILE, TILE, 0);
  // head (rows 2..6), torso (7..11), legs (12..14), centered ~x4..11
  rect(px, TILE, TILE, 5, 2, 6, 5, 2); // head skin
  rect(px, TILE, TILE, 5, 1, 6, 2, 3); // hair top
  rect(px, TILE, TILE, 4, 7, 8, 5, 4); // torso shirt
  // legs — a lifted foot (h=2) reads as mid-stride; step 0 keeps both planted (h=3)
  const leftH = step === 2 ? 2 : 3;
  const rightH = step === 1 ? 2 : 3;
  rect(px, TILE, TILE, 5, 12, 2, leftH, 5); // left leg
  rect(px, TILE, TILE, 9, 12, 2, rightH, 5); // right leg
  // facing cues
  if (facing === "down") {
    put(px, TILE, TILE, 6, 4, 6); put(px, TILE, TILE, 9, 4, 6); // both eyes
  } else if (facing === "up") {
    rect(px, TILE, TILE, 5, 1, 6, 3, 3); // more hair, no eyes (back of head)
  } else if (facing === "left") {
    put(px, TILE, TILE, 6, 4, 6); // one eye, body shifted hint
    rect(px, TILE, TILE, 4, 7, 6, 5, 4);
  } else {
    put(px, TILE, TILE, 9, 4, 6); // one eye on the right
    rect(px, TILE, TILE, 6, 7, 6, 5, 4);
  }
  return { width: TILE, height: TILE, palette, pixels: px };
}

export function paintPlayerSprite(seed: number): PlayerSprite {
  const rng = mulberry32(seed);
  const hair = pick(rng, HAIR);
  const shirt = pick(rng, SHIRT);
  const frames = FACINGS.map((f) => paintFacing(f, hair, shirt));
  const walk = Object.fromEntries(
    FACINGS.map((f) => [f, [paintFacing(f, hair, shirt, 1), paintFacing(f, hair, shirt, 2)]]),
  ) as Record<Facing, [IndexedImage, IndexedImage]>;
  // All frames share an identical palette → expose it once.
  return { palette: frames[0]!.palette, frames, walk };
}
