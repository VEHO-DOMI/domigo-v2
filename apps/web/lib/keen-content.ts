import "server-only";
/**
 * keen-content — loaders for the Keen world bundle
 * (content/corpus/stories/<storyId>/keen/): the town overworld (world.json),
 * per-chapter arcade levels (chNN.level.json) and boss scripts (chNN.boss.json).
 *
 * These are BUILD-TIME-AUTHORED files, so every loader throws LOUD on a missing
 * file or schema error (loud beats tolerant — a bad file must fail the page,
 * never serve a half-world). Shape gate ONLY: glyph/law validation
 * (rectangularity, reachability, exactly-one-exit …) lives in game-2d's
 * parsers, which is also why level headers stay loosely typed here (plain
 * strings; the game casts to its ArcadeHeader/BossScript contracts at the
 * boundary). Root resolution + module-scope caching mirror
 * @domigo/content-loader (the corpus is immutable at deploy time).
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "@domigo/content-loader";

// Mirrors content-loader's guards (its STORY_ID regex is not exported).
const STORY_ID = /^g[1-4]\.st\.[a-z0-9-]+$/;
const CHAPTER_ID = /^ch\d{2}$/;

// ── world.json — keen-world@1 ─────────────────────────────────────────────────

// Legend entries, shaped like content-schema's ZoneLayout legend (same field
// names: prop/solid for props, door for doors) plus the Keen-only `enter`
// building marker.
const KeenLegendEnter = z.object({ enter: z.string(), label: z.string() });
const KeenLegendProp = z.object({ prop: z.string(), solid: z.boolean(), clearedBy: z.string().optional() });
const KeenLegendDoor = z.object({ door: z.string() });
const KeenLegendEntry = z.union([KeenLegendEnter, KeenLegendProp, KeenLegendDoor]);

/** A building's footprint on the town grid (tile coords). */
const KeenGround = z.object({
  c: z.number().int(),
  r: z.number().int(),
  w: z.number().int(),
  h: z.number().int(),
});

const KeenWorld = z.object({
  schema: z.literal("keen-world@1"),
  layout: z.object({
    // ≥11 rows = the overworld viewport minimum (ZoneLayout's floor).
    rows: z.array(z.string()).min(11),
    legend: z.record(z.string().length(1), KeenLegendEntry),
  }),
  buildings: z.record(
    z.string(),
    z.object({
      chapter: z.string(),
      label: z.string(),
      labelEn: z.string().optional(),
      ground: KeenGround,
    }),
  ),
  beats: z.record(z.string(), z.object({ door: z.string(), restore: z.string() })),
  notes: z.array(
    z.object({
      c: z.number().int(),
      r: z.number().int(),
      text: z.string(),
      from: z.string().optional(),
    }),
  ),
});
export type KeenWorld = z.infer<typeof KeenWorld>;

// ── chNN.level.json — ArcadeHeader + glyph rows ───────────────────────────────

/** Difficulty tier axis — mirrors game-2d's Tier ("E" | "M" | "S"). */
const KeenTier = z.enum(["E", "M", "S"]);

// Shape-mirrors game-2d's ArcadeHeader (arcade.ts) WITHOUT importing it:
// `kind` etc. stay plain strings here; parseArcadeLevel owns glyph/law checks.
const KeenLevelHeader = z.object({
  id: z.string(),
  name: z.string(),
  fragment: z.string(),
  theme: z.string().optional(),
  chapter: z.string().optional(),
  placements: z.array(z.object({ kind: z.string(), c: z.number().int(), r: z.number().int(), tier: KeenTier })),
  seals: z.array(z.object({ c: z.number().int(), r: z.number().int(), guard: z.number().int().nullable() })),
  helpers: z.array(z.object({ c: z.number().int(), r: z.number().int(), w: z.number().int(), maxTier: KeenTier })),
});

const KeenLevelFile = z.object({
  header: KeenLevelHeader,
  rows: z.array(z.string()),
});
export type KeenLevelFile = z.infer<typeof KeenLevelFile>;

// ── chNN.boss.json — BossScript ───────────────────────────────────────────────

/** Per-tier timing table (Record<Tier, number> in game-2d's BossScript). */
const KeenTierMs = z.object({ E: z.number().int(), M: z.number().int(), S: z.number().int() });

const KeenBoss = z.object({
  id: z.string(),
  name: z.string(),
  intro: z.string(),
  outro: z.string(),
  knots: z.number().int(),
  pattern: z.array(z.number().int()),
  telegraphMs: KeenTierMs,
  attackMs: z.number().int(),
  windowSeconds: KeenTierMs,
  taunts: z.array(z.string()),
  inversion: z.boolean().optional(),
});
export type KeenBoss = z.infer<typeof KeenBoss>;

// ── loaders ───────────────────────────────────────────────────────────────────

// Cached at module scope like content-loader's registry: parsed once per
// (storyId, file) — the corpus never changes under a running deploy.
const keenCache = new Map<string, unknown>();

function loadKeenJson<T>(storyId: string, file: string, parse: (raw: unknown) => T): T {
  if (!STORY_ID.test(storyId)) throw new Error(`keen-content: bad story id "${storyId}"`);
  const key = `${storyId}/${file}`;
  const hit = keenCache.get(key);
  if (hit !== undefined) return hit as T;
  const p = path.join(REPO_ROOT, "content", "corpus", "stories", storyId, "keen", file);
  if (!fs.existsSync(p)) throw new Error(`keen-content: missing ${key} (${p})`);
  const parsed = parse(JSON.parse(fs.readFileSync(p, "utf8")));
  keenCache.set(key, parsed);
  return parsed;
}

function chapterFile(chapter: string, suffix: string): string {
  if (!CHAPTER_ID.test(chapter)) throw new Error(`keen-content: bad chapter id "${chapter}"`);
  return `${chapter}.${suffix}.json`;
}

/** The town overworld (world.json). Throws on missing/invalid file. */
export function loadKeenWorld(storyId: string): KeenWorld {
  return loadKeenJson(storyId, "world.json", (raw) => KeenWorld.parse(raw));
}

/** A chapter's arcade level (chNN.level.json). Throws on missing/invalid file. */
export function loadKeenLevel(storyId: string, chapter: string): KeenLevelFile {
  return loadKeenJson(storyId, chapterFile(chapter, "level"), (raw) => KeenLevelFile.parse(raw));
}

/** A chapter's guardian boss script (chNN.boss.json). Throws on missing/invalid file. */
export function loadKeenBoss(storyId: string, chapter: string): KeenBoss {
  return loadKeenJson(storyId, chapterFile(chapter, "boss"), (raw) => KeenBoss.parse(raw));
}
