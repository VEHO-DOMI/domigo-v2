/**
 * Procedural overworld tileset (the G1 "School & Classroom" theme). Deterministic
 * from a seed; emits IndexedImages (no canvas). ~6 tiles is the slice floor:
 * floor, wall, path, two accents, and an encounter-node marker.
 */
import { TILE, border, grid, put, rect, type IndexedImage } from "./image.ts";
import { mulberry32 } from "./rng.ts";

export type TileKind = "floor" | "wall" | "path" | "accent" | "accent2" | "encounter";
export const TILE_KINDS: TileKind[] = ["floor", "wall", "path", "accent", "accent2", "encounter"];

/** Shared indexed palette (index 0 transparent). School-warm wood + slate. */
const PALETTE = [
  "#00000000", // 0 transparent
  "#cdb89a", // 1 floor wood
  "#b9a079", // 2 floor speckle
  "#6b7280", // 3 wall slate
  "#434a55", // 4 wall border
  "#9ca3af", // 5 path stone
  "#d6c7a8", // 6 accent light
  "#b45309", // 7 accent2 (desk wood)
  "#22c55e", // 8 encounter glow
  "#166534", // 9 encounter ring
] as const;

function speckle(px: number[], rng: () => number, baseIdx: number, speckleIdx: number, p: number): void {
  for (let i = 0; i < px.length; i++) if (px[i] === baseIdx && rng() < p) px[i] = speckleIdx;
}

function paintTile(kind: TileKind, seed: number): IndexedImage {
  const rng = mulberry32(seed);
  const px = grid(TILE, TILE, 1);
  switch (kind) {
    case "floor":
      speckle(px, rng, 1, 2, 0.12);
      break;
    case "wall":
      rect(px, TILE, TILE, 0, 0, TILE, TILE, 3);
      speckle(px, rng, 3, 4, 0.1);
      border(px, TILE, TILE, 4);
      break;
    case "path":
      rect(px, TILE, TILE, 0, 0, TILE, TILE, 5);
      speckle(px, rng, 5, 6, 0.14);
      break;
    case "accent":
      speckle(px, rng, 1, 6, 0.2);
      break;
    case "accent2":
      rect(px, TILE, TILE, 2, 4, 12, 8, 7); // a desk block on floor
      speckle(px, rng, 7, 6, 0.1);
      break;
    case "encounter": {
      // a glowing node marker on floor: filled green diamond + ring.
      const c = TILE / 2;
      for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
        const d = Math.abs(x - c + 0.5) + Math.abs(y - c + 0.5);
        if (d < 4) put(px, TILE, TILE, x, y, 8);
        else if (d < 5.5) put(px, TILE, TILE, x, y, 9);
      }
      break;
    }
  }
  return { width: TILE, height: TILE, palette: [...PALETTE], pixels: px };
}

export interface Tileset {
  palette: string[];
  tiles: Record<TileKind, IndexedImage>;
}

/** Deterministic tileset for a zone seed (each tile varies its speckle from seed). */
export function paintTileset(seed: number): Tileset {
  const tiles = {} as Record<TileKind, IndexedImage>;
  TILE_KINDS.forEach((k, i) => {
    tiles[k] = paintTile(k, seed * 131 + i * 17 + 1);
  });
  return { palette: [...PALETTE], tiles };
}
