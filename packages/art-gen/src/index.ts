/**
 * @domigo/art-gen — deterministic procedural assets (seed → IndexedImage data).
 * Pure + DOM-free: no canvas, no external art packs. game-2d rasterizes the data
 * to textures; this package owns map@1's `render.generator` outputs.
 */
export * from "./image.ts";
export * from "./color.ts";
export * from "./rng.ts";
export * from "./tileset.ts";
export * from "./theme.ts";
export * from "./sprite.ts";
export * from "./platform.ts";
