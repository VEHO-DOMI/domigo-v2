/**
 * Procedural art is pure DATA, not pixels-on-a-canvas: an `IndexedImage` is a
 * palette + a row-major index grid. game-2d rasterizes it to a Phaser texture;
 * here it stays DOM-free so generators are deterministic + Node-testable.
 * Convention: palette index 0 is transparent.
 */
export interface IndexedImage {
  width: number;
  height: number;
  /** Hex colors ("#rrggbb" or "#rrggbbaa"); index 0 is transparent. */
  palette: string[];
  /** length = width*height; palette indices, row-major (y*width + x). */
  pixels: number[];
}

export const TILE = 16;

/** A new index grid filled with `fill` (default 0 = transparent). */
export function grid(width: number, height: number, fill = 0): number[] {
  return new Array(width * height).fill(fill);
}

/** Set a pixel if in-bounds (guards noUncheckedIndexedAccess + edges). */
export function put(px: number[], width: number, height: number, x: number, y: number, idx: number): void {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  px[y * width + x] = idx;
}

/** Filled axis-aligned rectangle. */
export function rect(px: number[], width: number, height: number, x0: number, y0: number, w: number, h: number, idx: number): void {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(px, width, height, x, y, idx);
}

/** 1px border around the whole grid. */
export function border(px: number[], width: number, height: number, idx: number): void {
  for (let x = 0; x < width; x++) { put(px, width, height, x, 0, idx); put(px, width, height, x, height - 1, idx); }
  for (let y = 0; y < height; y++) { put(px, width, height, 0, y, idx); put(px, width, height, width - 1, y, idx); }
}
