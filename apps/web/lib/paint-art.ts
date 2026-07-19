import "server-only";
/**
 * paint-art — the only-present resolver for THE PAINTED BOOK's art tree
 * (apps/web/public/art/g1/paint/**): every PNG that EXISTS becomes a
 * stem → url entry; every missing stem keeps its procedural fallback inside
 * the scene (the keen-art law — art lands incrementally, batch by batch,
 * and the game never breaks on a missing file).
 */
import fs from "node:fs";
import path from "node:path";

const ART_DIRS = ["hero", "ch01"] as const;

let cache: Record<string, string> | null = null;

export const resolvePaintArt = (): Record<string, string> => {
  if (cache) return cache;
  const out: Record<string, string> = {};
  const root = path.join(process.cwd(), "public", "art", "g1", "paint");
  for (const dir of ART_DIRS) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((x) => x.endsWith(".png"))) {
      out[f.replace(/\.png$/, "")] = `/art/g1/paint/${dir}/${f}`;
    }
  }
  cache = out;
  return out;
};
