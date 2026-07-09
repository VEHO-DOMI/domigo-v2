/**
 * Procedural player avatar — a 48×48 top-down character (chibi proportions, big
 * head), deterministic from a seed (hair/shirt vary). Outlined + shaded for the
 * crisp GBA look, with a soft ground shadow. Keeps the A1-3 walk cycle: a neutral
 * frame per facing plus two foot-lift step frames whose only difference from the
 * neutral is in the leg rows. Emits IndexedImages (no canvas).
 */
import { TILE, grid, outline, put, rect, roundRect, type IndexedImage } from "./image.ts";
import { darken } from "./color.ts";
import { mulberry32, pick } from "./rng.ts";

export type Facing = "down" | "up" | "left" | "right";
export const FACINGS: Facing[] = ["down", "up", "left", "right"];

/** Walk-cycle step: 0 = neutral (both feet down), 1 = right foot up, 2 = left foot up. */
export type WalkStep = 0 | 1 | 2;

const HAIR = ["#3b2f2f", "#6b4423", "#1f2937", "#8d5524", "#4a2f1a"] as const;
const SHIRT = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#d97706", "#0891b2"] as const;

export interface PlayerSprite {
  palette: string[];
  /** Neutral (resting) frame per Facing (FACINGS order). */
  frames: IndexedImage[];
  /** A1-3: the two walk-cycle step frames per facing (leg-only diff from neutral). */
  walk: Record<Facing, [IndexedImage, IndexedImage]>;
}

// palette indices
const INK = 1, SKIN = 2, SKIN2 = 3, HAIRC = 4, HAIRC2 = 5, SHIRTC = 6, SHIRTC2 = 7, PANTS = 8, PANTS2 = 9, EYE = 10, SHOE = 11, SHADOW = 12;

function palette(hair: string, shirt: string): string[] {
  return [
    "#00000000", "#20242e", "#f2c690", "#d8a566", hair, darken(hair, 0.30),
    shirt, darken(shirt, 0.26), "#3a4252", "#2a3040", "#1b1f28", "#4a3626", "#0000002e",
  ];
}

const LEG_TOP = 34; // walk steps only ever change pixels at or below this row

/** One frame. `step` lifts a foot (shortens that leg) — step 0 is the resting pose. */
function paintFacing(facing: Facing, hair: string, shirt: string, step: WalkStep = 0): IndexedImage {
  const P = palette(hair, shirt);
  const px = grid(TILE, TILE, 0);

  // ── legs (drawn first, behind the torso) ──
  const leftUp = step === 2, rightUp = step === 1;
  rect(px, TILE, TILE, 18, LEG_TOP, 5, leftUp ? 7 : 10, PANTS);   // left leg
  rect(px, TILE, TILE, 25, LEG_TOP, 5, rightUp ? 7 : 10, PANTS);  // right leg
  rect(px, TILE, TILE, 18, leftUp ? 39 : 42, 5, 2, SHOE);         // left shoe
  rect(px, TILE, TILE, 25, rightUp ? 39 : 42, 5, 2, SHOE);        // right shoe

  // ── torso + arms ──
  roundRect(px, TILE, TILE, 14, 23, 20, 13, SHIRTC, 2);           // shirt
  rect(px, TILE, TILE, 12, 25, 3, 9, SHIRTC);                     // left sleeve
  rect(px, TILE, TILE, 33, 25, 3, 9, SHIRTC);                     // right sleeve
  rect(px, TILE, TILE, 12, 33, 3, 3, SKIN);                       // hands
  rect(px, TILE, TILE, 33, 33, 3, 3, SKIN);

  // ── head + hair ──
  roundRect(px, TILE, TILE, 15, 8, 18, 16, SKIN, 3);              // face/head
  roundRect(px, TILE, TILE, 14, 4, 20, 10, HAIRC, 3);            // hair crown
  rect(px, TILE, TILE, 14, 11, 3, 5, HAIRC);                      // side bangs
  rect(px, TILE, TILE, 31, 11, 3, 5, HAIRC);

  // ── facing cues ──
  if (facing === "down") {
    rect(px, TILE, TILE, 19, 15, 2, 3, EYE); rect(px, TILE, TILE, 27, 15, 2, 3, EYE);
  } else if (facing === "up") {
    roundRect(px, TILE, TILE, 15, 8, 18, 14, HAIRC, 3);           // back of head = all hair
    rect(px, TILE, TILE, 14, 11, 4, 8, HAIRC); rect(px, TILE, TILE, 30, 11, 4, 8, HAIRC);
  } else if (facing === "left") {
    rect(px, TILE, TILE, 18, 15, 2, 3, EYE);                      // one eye, swept hair
    rect(px, TILE, TILE, 29, 8, 4, 10, HAIRC);
  } else {
    rect(px, TILE, TILE, 28, 15, 2, 3, EYE);
    rect(px, TILE, TILE, 15, 8, 4, 10, HAIRC);
  }

  // ── directional shade: darken the right edge of each surface (light from top-left) ──
  for (let y = 0; y < TILE; y++) {
    for (let x = 30; x < TILE; x++) {
      const i = y * TILE + x, v = px[i];
      if (v === SKIN) px[i] = SKIN2; else if (v === HAIRC) px[i] = HAIRC2;
      else if (v === SHIRTC) px[i] = SHIRTC2; else if (v === PANTS) px[i] = PANTS2;
    }
  }

  outline(px, TILE, TILE, INK);

  // ── soft ground shadow, only where still transparent (behind the feet) ──
  for (let y = 41; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      const nx = (x + 0.5 - 24) / 13, ny = (y + 0.5 - 45) / 3.5;
      if (nx * nx + ny * ny <= 1 && px[y * TILE + x] === 0) put(px, TILE, TILE, x, y, SHADOW);
    }
  }
  return { width: TILE, height: TILE, palette: P, pixels: px };
}

export function paintPlayerSprite(seed: number): PlayerSprite {
  const rng = mulberry32(seed);
  const hair = pick(rng, HAIR);
  const shirt = pick(rng, SHIRT);
  const frames = FACINGS.map((f) => paintFacing(f, hair, shirt));
  const walk = Object.fromEntries(
    FACINGS.map((f) => [f, [paintFacing(f, hair, shirt, 1), paintFacing(f, hair, shirt, 2)]]),
  ) as Record<Facing, [IndexedImage, IndexedImage]>;
  return { palette: frames[0]!.palette, frames, walk };
}
