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

/** Source tile resolution. 48px (1:1 with the 48px display tile) → crisp, room
 *  to shade properly. Bumped from 16px (which upscaled 3× into chunky blocks). */
export const TILE = 48;

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

/** Rectangle with rounded corners (clips the 4 corner pixels for a softer object). */
export function roundRect(px: number[], width: number, height: number, x0: number, y0: number, w: number, h: number, idx: number, r = 1): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const dx = Math.min(x - x0, x0 + w - 1 - x);
      const dy = Math.min(y - y0, y0 + h - 1 - y);
      if (dx + dy < r) continue; // shave the corner
      put(px, width, height, x, y, idx);
    }
  }
}

/** Horizontal run of pixels. */
export function hline(px: number[], width: number, height: number, x0: number, y: number, w: number, idx: number): void {
  for (let x = x0; x < x0 + w; x++) put(px, width, height, x, y, idx);
}

/** Filled ellipse centred at (cx,cy) with radii (rx,ry) — shadows, glows, heads. */
export function disc(px: number[], width: number, height: number, cx: number, cy: number, rx: number, ry: number, idx: number): void {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx;
      const ny = (y + 0.5 - cy) / ry;
      if (nx * nx + ny * ny <= 1) put(px, width, height, x, y, idx);
    }
  }
}

/** Wrap the drawn silhouette in a 1px dark outline: every TRANSPARENT pixel that
 *  touches a drawn one becomes `idx`. Gives sprites the crisp GBA edge. */
export function outline(px: number[], width: number, height: number, idx: number): void {
  const src = [...px];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (src[y * width + x] !== 0) continue; // only fill transparent pixels
      const touches =
        (src[y * width + (x - 1)] ?? 0) !== 0 || (src[y * width + (x + 1)] ?? 0) !== 0 ||
        (src[(y - 1) * width + x] ?? 0) !== 0 || (src[(y + 1) * width + x] ?? 0) !== 0;
      if (touches) put(px, width, height, x, y, idx);
    }
  }
}

/** 1px border around the whole grid. */
export function border(px: number[], width: number, height: number, idx: number): void {
  for (let x = 0; x < width; x++) { put(px, width, height, x, 0, idx); put(px, width, height, x, height - 1, idx); }
  for (let y = 0; y < height; y++) { put(px, width, height, 0, y, idx); put(px, width, height, width - 1, y, idx); }
}
