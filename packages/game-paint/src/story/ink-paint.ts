/** Complete painted-liquid coverage; only geometry, no generated raster art. */
import { planInkColumns, inkScrollAt } from "../ink.ts";
import { TILE } from "../paint.ts";

export function paintedInkRects(grid: readonly string[]): Array<{ x: number; y: number; width: number; height: number }> {
  const rects: Array<{ x: number; y: number; width: number; height: number }> = [];
  for (const col of planInkColumns(grid)) {
    const x = col.c * TILE, y = col.r0 * TILE, height = (col.r1 - col.r0 + 1) * TILE;
    const adjacent = rects.find(rect => rect.x + rect.width === x && rect.y === y && rect.height === height);
    if (adjacent) adjacent.width += TILE;
    else rects.push({ x, y, width: TILE, height });
  }
  return rects;
}

/** All strips sample one world-anchored sheet, including after paused frames. */
export function paintedInkOffset(x: number, y: number, scale: number, tick: number, reducedMotion: boolean): { x: number; y: number } {
  return { x: (x + (reducedMotion ? 0 : inkScrollAt(tick))) / scale, y: y / scale };
}
