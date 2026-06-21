/**
 * Procedural player avatar — a blocky 16x16 character with a 4-direction frame
 * set (down/up/left/right). Deterministic from a seed (shirt/hair colors vary).
 * The "walk cycle" richness is layered later; this is the slice's directional
 * minimum. Emits IndexedImages (no canvas).
 */
import { TILE, grid, put, rect, type IndexedImage } from "./image.ts";
import { mulberry32, pick } from "./rng.ts";

export type Facing = "down" | "up" | "left" | "right";
export const FACINGS: Facing[] = ["down", "up", "left", "right"];

const HAIR = ["#3b2f2f", "#6b4423", "#1f2937", "#8d5524"] as const;
const SHIRT = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#d97706"] as const;

export interface PlayerSprite {
  palette: string[];
  /** One frame per Facing (FACINGS order). */
  frames: IndexedImage[];
}

/** palette: 0 transparent, 1 outline, 2 skin, 3 hair, 4 shirt, 5 pants, 6 eye. */
function paintFacing(facing: Facing, hair: string, shirt: string): IndexedImage {
  const palette = ["#00000000", "#1f2937", "#f1c27d", hair, shirt, "#374151", "#0b1020"];
  const px = grid(TILE, TILE, 0);
  // head (rows 2..6), torso (7..11), legs (12..14), centered ~x4..11
  rect(px, TILE, TILE, 5, 2, 6, 5, 2); // head skin
  rect(px, TILE, TILE, 5, 1, 6, 2, 3); // hair top
  rect(px, TILE, TILE, 4, 7, 8, 5, 4); // torso shirt
  rect(px, TILE, TILE, 5, 12, 2, 3, 5); // left leg
  rect(px, TILE, TILE, 9, 12, 2, 3, 5); // right leg
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
  // All frames share an identical palette → expose it once.
  return { palette: frames[0]!.palette, frames };
}
