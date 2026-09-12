import { glyphAt, isSolid, type Grid } from "./collide.ts";
import { TILE } from "./paint.ts";

/** A surface-strip run may end against a taller wall; that is not an exposed cap edge. */
export const groundCapVisible = (grid: Grid, adjacentColumn: number, row: number): boolean =>
  !isSolid(glyphAt(grid, adjacentColumn, row));

/** Decorative cap stays inside the run; two caps can occupy at most one half each. */
export const groundCapPlacement = (
  grid: Grid, firstColumn: number, lastColumn: number, row: number,
  side: "left" | "right", sourceWidth: number, tileScale: number,
): { x: number; y: number; originX: 0 | 1; width: number } | null => {
  const runWidth = (lastColumn - firstColumn + 1) * TILE;
  const width = sourceWidth * tileScale;
  const adjacent = side === "left" ? firstColumn - 1 : lastColumn + 1;
  if (!groundCapVisible(grid, adjacent, row) || width > runWidth / 2) return null;
  return {
    x: (side === "left" ? firstColumn : lastColumn + 1) * TILE,
    y: row * TILE - 7,
    originX: side === "left" ? 0 : 1,
    width,
  };
};
