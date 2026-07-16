/**
 * Keen-surface image resolver (doc 28 §5) — the only-present-stems law:
 * scans public/art/g1/keen/** at request time and returns URL maps for exactly
 * the PNGs that exist. A missing stem means the engine keeps its procedural
 * fallback — no 404s, no broken slots, fully incremental (drop one PNG and
 * only that slot changes). Mirrors lib/tile-art.ts for the retired overworld.
 *
 * Layout on disk (sync-art.mjs dest):
 *   public/art/g1/keen/map/      page_underlay.png building_ch01.png finn_map.png …
 *   public/art/g1/keen/cast/     portrait_finn.png portrait_pixel.png …
 *   public/art/g1/keen/hero/     hero_stand.png hero_run1.png … acc_<id>.png
 *   public/art/g1/keen/beats/    prologue_classroom.png ch02_beat_zoo.png …
 *   public/art/g1/keen/ch01/     bg_far.png bg_mid.png walker-0.png boss_head_idle.png …
 */
import fs from "node:fs";
import path from "node:path";

export interface KeenArt {
  /** world-map stems (page_underlay, building_chNN, finn_map, pixel_map, flag) */
  map: Record<string, string>;
  /** speaker id → portrait URL (portrait_<speaker>.png) */
  cast: Record<string, string>;
  /** hero pose + accessory stems (hero_<pose>, acc_<id>) */
  hero: Record<string, string>;
  /** beat illustrations by stem (prologue_*, chNN_beat_*) */
  beats: Record<string, string>;
  /** per-chapter level art (bg_far, bg_mid, <creature>-0/1, boss_head_idle, …) */
  chapters: Record<string, Record<string, string>>;
}

const ROOT = () => path.join(process.cwd(), "public", "art", "g1", "keen");

function scanDir(dir: string, urlBase: string): Record<string, string> {
  const out: Record<string, string> = {};
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return out; // no art yet — every slot stays procedural
  }
  for (const f of files) {
    if (!/\.(png|jpg|webp)$/i.test(f)) continue;
    const stem = f.replace(/\.(png|jpg|webp)$/i, "");
    if (stem.startsWith("_")) continue; // _style_key etc: synced, never rendered
    out[stem] = `${urlBase}/${f}`;
  }
  return out;
}

/** Server-side only (fs). Call from pages/route loaders and pass down. */
export function resolveKeenArt(grade: number): KeenArt {
  if (grade !== 1) return { map: {}, cast: {}, hero: {}, beats: {}, chapters: {} };
  const root = ROOT();
  const base = "/art/g1/keen";
  const art: KeenArt = {
    map: scanDir(path.join(root, "map"), `${base}/map`),
    cast: {},
    hero: scanDir(path.join(root, "hero"), `${base}/hero`),
    beats: scanDir(path.join(root, "beats"), `${base}/beats`),
    chapters: {},
  };
  // cast: portrait_<speaker>.png → { finn: url }
  for (const [stem, url] of Object.entries(scanDir(path.join(root, "cast"), `${base}/cast`))) {
    art.cast[stem.replace(/^portrait_/, "")] = url;
  }
  // chapters: any chNN subdir
  let subdirs: string[] = [];
  try {
    subdirs = fs.readdirSync(root).filter((d) => /^ch\d\d$/.test(d));
  } catch {
    /* no root yet */
  }
  for (const ch of subdirs) {
    art.chapters[ch] = scanDir(path.join(root, ch), `${base}/${ch}`);
  }
  return art;
}
