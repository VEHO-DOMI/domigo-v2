import "server-only";
/**
 * paint-content — loaders for THE PAINTED BOOK bundle
 * (content/corpus/stories/<storyId>/paint/): per-chapter levels
 * (chNN.level.json; later chNN.boss.json + chNN.tasks.json).
 *
 * Same laws as keen-content: BUILD-TIME-AUTHORED files, so every loader throws
 * LOUD on a missing file or shape error (loud beats tolerant — a bad file must
 * fail the page, never serve a half-level). Shape gate ONLY: the semantic laws
 * (glyph legality, exit chains, reachability, cage rules) live in
 * @domigo/game-paint's parsePaintLevel/checkLevelLaws, which the page runs at
 * the boundary. Root resolution + module-scope caching mirror content-loader.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GameTasksFileV2, type GameTaskV2 } from "@domigo/content-schema";
import { REPO_ROOT } from "@domigo/content-loader";

const STORY_ID = /^g[1-4]\.st\.[a-z0-9-]+$/;
const CHAPTER_ID = /^ch\d{2}$/;

const PaintEntity = z.object({
  id: z.string().min(1),
  role: z.enum([
    "chaser", "gunner", "flyer", "bouncer", "crusher", "swarm",
    "platform.move", "platform.fall", "platform.swing",
    "cage", "powerup", "door.trigger", "guardian",
  ]),
  skin: z.string().min(1),
  c: z.number().int().nonnegative(),
  r: z.number().int().nonnegative(),
  tier: z.enum(["E", "M", "S"]),
  params: z.record(z.string(), z.unknown()).optional(),
});

const PaintLink = z.object({
  trigger: z.string().min(1),
  on: z.enum(["redeemed", "opened", "collected", "pressed"]),
  action: z.enum(["spawn", "open", "reveal"]),
  targets: z.array(z.string().min(1)).min(1),
});

const PaintPhase = z.object({
  id: z.string().regex(/^p\d$/),
  nameDe: z.string().min(1),
  surface: z.enum(["normal", "slippery"]),
  plates: z
    .object({
      sky: z.string().optional(),
      far: z.string().optional(),
      mid: z.string().optional(),
      near: z.string().optional(),
      fg: z.string().optional(),
    })
    .default({}),
  rows: z.array(z.string().min(8)).min(8),
  entities: z.array(PaintEntity).default([]),
  links: z.array(PaintLink).default([]),
  exit: z.object({ to: z.string().min(1) }),
});

const PaintLevelFile = z.object({
  schema: z.literal("paintLevel@1"),
  id: z.string().min(1),
  chapter: z.string().regex(CHAPTER_ID),
  draft: z.boolean().optional(),
  name: z.string().min(1),
  goalDe: z.string().min(1),
  whyDe: z.string().min(1),
  hintsDe: z.array(z.string().min(1)),
  collectNounDe: z.string().min(1),
  abilities: z.array(z.enum(["jump", "punch", "hang", "swing", "hover", "run"])),
  phases: z.array(PaintPhase).min(1),
  arena: PaintPhase.optional(),
  bonus: PaintPhase.optional(),
});

export type PaintLevelFileT = z.infer<typeof PaintLevelFile>;

const paintDir = (storyId: string): string => {
  if (!STORY_ID.test(storyId)) throw new Error(`paint-content: bad story id ${storyId}`);
  return path.join(REPO_ROOT, "content", "corpus", "stories", storyId, "paint");
};

const levelCache = new Map<string, PaintLevelFileT>();

/** Loud loader: a missing or malformed level fails the page. */
export const loadPaintLevel = (storyId: string, chapter: string): PaintLevelFileT => {
  if (!CHAPTER_ID.test(chapter)) throw new Error(`paint-content: bad chapter ${chapter}`);
  const cacheKey = `${storyId}/${chapter}`;
  const hit = levelCache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.level.json`);
  const parsed = PaintLevelFile.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  levelCache.set(cacheKey, parsed);
  return parsed;
};

const GameTask = z.object({
  id: z.string().min(1),
  use: z.enum(["quickfire", "encounter", "door", "rescue", "boss", "bonus"]),
  kind: z.enum(["choice", "typed"]),
  storyDe: z.string().min(1),
  promptEn: z.string().min(1),
  options: z.array(z.string().min(1)).length(3).optional(),
  answer: z.string().min(1),
  hints: z.object({
    deDesc: z.string().optional(),
    deWord: z.string().optional(),
    firstLetter: z.string().optional(),
    length: z.number().int().optional(),
  }),
  grounding: z.string().optional(),
});

const GameTasksFile = z.object({
  schema: z.literal("gameTasks@1"),
  chapter: z.string().regex(CHAPTER_ID),
  unit: z.string().min(1),
  note: z.string().optional(),
  items: z.array(GameTask).min(1),
});

export type GameTaskT = z.infer<typeof GameTask>;

const tasksCache = new Map<string, GameTaskT[]>();

/** Loud loader for the chapter task set (choice items must carry the answer). */
export const loadPaintTasks = (storyId: string, chapter: string): GameTaskT[] => {
  const cacheKey = `${storyId}/${chapter}/tasks`;
  const hit = tasksCache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.tasks.json`);
  const parsed = GameTasksFile.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  for (const t of parsed.items) {
    if (t.kind === "choice" && !(t.options ?? []).includes(t.answer)) {
      throw new Error(`paint-content: ${t.id} answer not among its options`);
    }
  }
  tasksCache.set(cacheKey, parsed.items);
  return parsed.items;
};

// ── gameTasks@2 (PB-T8): the card-kit task set; validated by the shared schema ──
const tasksV2Cache = new Map<string, GameTaskV2[]>();

/** Loud loader for the chNN.tasks.v2.json set (schema + cross-field invariants
 *  run in GameTasksFileV2). Falls the page on any shape/law error. */
export const loadPaintTasksV2 = (storyId: string, chapter: string): GameTaskV2[] => {
  const cacheKey = `${storyId}/${chapter}/v2`;
  const hit = tasksV2Cache.get(cacheKey);
  if (hit) return hit;
  const file = path.join(paintDir(storyId), `${chapter}.tasks.v2.json`);
  const parsed = GameTasksFileV2.parse(JSON.parse(fs.readFileSync(file, "utf8")));
  tasksV2Cache.set(cacheKey, parsed.items);
  return parsed.items;
};

/** Which chapters have an authored paint level (the admin auto-list probe). */
export const listPaintChapters = (storyId: string): string[] => {
  const dir = paintDir(storyId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^ch\d{2}\.level\.json$/.test(f))
    .map((f) => f.slice(0, 4))
    .sort();
};
