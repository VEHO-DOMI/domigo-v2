/**
 * LOOK-1 — server-side resolver for the OVERWORLD tileset art (the pixel-art
 * counterpart of story-art.ts, same only-present discipline).
 *
 * Koki generates FireRed-style PNGs from the prompt libraries (docs/art/
 * G1_SCHOOL_IMAGE_PROMPTS.html); sync-art.mjs lands them in
 * apps/web/public/art/g<grade>/<zoneDir>/<stem>.png. This resolver reads that
 * dir and returns ONLY the stems that actually exist, as URLs — the Phaser
 * scene preloads those and keeps art-gen's procedural paint as the per-kind
 * fallback. No broken images, no 404s, fully incremental: drop one PNG and
 * only that tile changes.
 *
 * Zone dir rule (matches the drop-folder naming "g1-school" and the art
 * PASSOVER doctrine `/art/g1/school/floor.png`): the map zone's
 * `render.generator` minus its "-room" suffix — "school-room" → "school".
 *
 * Stem → engine-texture mapping lives in the SCENE (packages/game-2d), not
 * here: this module knows the filesystem, the scene knows Phaser keys.
 */
import fs from "node:fs";
import path from "node:path";

/** "school-room" → "school" (the on-disk + drop-folder namespace). */
export function tileArtDir(generator: string): string {
  return generator.replace(/-room$/, "");
}

/** stem → public URL, for every image actually present (empty map if none yet). */
export function resolveTileArt(grade: number, generator: string): Record<string, string> {
  const sub = path.join("art", `g${grade}`, tileArtDir(generator));
  const dir = path.join(process.cwd(), "public", sub);
  if (!fs.existsSync(dir)) return {};
  const out: Record<string, string> = {};
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith(".") || !/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const stem = f.replace(/\.[a-z0-9]+$/i, "");
    if (out[stem] === undefined) out[stem] = `/${sub.split(path.sep).join("/")}/${f}`;
  }
  return out;
}
