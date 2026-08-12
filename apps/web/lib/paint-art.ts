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
import crypto from "node:crypto";

const ART_DIRS = ["hero", "ch01"] as const;

/**
 * R5-N3 · E4 · THE CACHE KEY IS THE FILE, NOT THE COMMIT.
 *
 * E1 made these files `immutable` for a year and hung the build's commit sha on
 * every URL so a repaint could not be trapped behind that cache. Correct, and it
 * had a consequence nobody costed: the sha changes on EVERY merge, so every
 * merge gave all 298 paintings new addresses and threw away a cache that was
 * still perfectly good. A phase is 17–29 MB of art. Koki plays right after each
 * merge, which is exactly the case that never gets a warm cache — and what he
 * reported was "das Laden braucht vergleichsweise um einiges länger".
 *
 * Fingerprinting each file by its CONTENT keeps E1's guarantee (changed art gets
 * a new address, so nothing is ever stale) and drops the collateral damage
 * (unchanged art keeps its address, so it is fetched once and then never again).
 * After a merge that repaints three files, a returning child downloads three
 * files instead of 298.
 *
 * Cost, measured on this machine: 228 ms to hash 118 MB, ONCE per server
 * instance — the result is cached below, so no request pays it twice. The commit
 * sha stays as the fallback for any file that cannot be read.
 */
const VERSION = process.env.VERCEL_GIT_COMMIT_SHA ?? "";

const fingerprint = (abs: string): string => {
  try {
    return crypto.createHash("sha1").update(fs.readFileSync(abs)).digest("hex").slice(0, 8);
  } catch {
    return VERSION;
  }
};

let cache: Record<string, string> | null = null;

export const resolvePaintArt = (): Record<string, string> => {
  if (cache) return cache;
  const out: Record<string, string> = {};
  const root = path.join(process.cwd(), "public", "art", "g1", "paint");
  for (const dir of ART_DIRS) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((x) => x.endsWith(".png"))) {
      const v = fingerprint(path.join(abs, f));
      out[f.replace(/\.png$/, "")] = `/art/g1/paint/${dir}/${f}${v ? `?v=${v}` : ""}`;
    }
  }
  cache = out;
  return out;
};
