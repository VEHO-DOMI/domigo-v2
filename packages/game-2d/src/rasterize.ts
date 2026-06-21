/**
 * Rasterize an art-gen IndexedImage (palette + index grid) to an HTMLCanvasElement
 * at an integer scale — fed to Phaser as a canvas texture. Client-only (uses the
 * DOM). Index 0 is transparent (left unpainted).
 */
import type { IndexedImage } from "@domigo/art-gen";

export function rasterize(img: IndexedImage, scale = 1): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext("2d");
  if (ctx === null) return canvas;
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      const idx = img.pixels[y * img.width + x] ?? 0;
      if (idx === 0) continue; // transparent
      ctx.fillStyle = img.palette[idx] ?? "#000";
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return canvas;
}
