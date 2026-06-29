/**
 * Server-side resolver for the decoupled story art manifest (story-art@1).
 *
 * The manifest (content/.../art.json) maps scenes/chapters/clues to image STEMS.
 * The actual files land in apps/web/public/art/g<grade>/ (synced from Koki's
 * messily-named drops by docs/art/sync-art.mjs). This resolver reads that dir and
 * returns ONLY the stems that actually exist as full URLs — so the runtime shows
 * an image when it's there and falls back to the procedural art otherwise (no
 * broken images, no 404s, fully incremental as images are generated).
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, loadStoryArt } from "@domigo/content-loader";
import type { Chapter, Story as StoryT } from "@domigo/content-schema";

export interface ResolvedDetectiveArt {
  base: string;
  backdrop: string | null;
  endCard: string | null;
  portraits: Record<string, string>; // sceneId → url
  beats: Record<string, string>; // sceneId → url
  clues: Record<string, string>; // slot → url
}

export interface ResolvedHubArt {
  cover: string | null;
  cards: Record<string, string>; // chapterId → url
}

/** stem → actual filename, from the synced public art dir (empty if none yet). */
function availMap(grade: number): Map<string, string> {
  const sub = path.join("art", `g${grade}`);
  const candidates = [
    path.join(process.cwd(), "public", sub),
    path.join(REPO_ROOT, "apps", "web", "public", sub),
  ];
  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    const m = new Map<string, string>();
    for (const f of fs.readdirSync(dir)) {
      if (f.startsWith(".")) continue;
      const stem = f.replace(/\.[a-z0-9]+$/i, "");
      if (!m.has(stem)) m.set(stem, f);
    }
    return m;
  }
  return new Map();
}

export function resolveDetectiveArt(storyId: string, grade: number, chapter: Chapter): ResolvedDetectiveArt | null {
  const art = loadStoryArt(storyId);
  if (!art) return null;
  const avail = availMap(grade);
  const url = (stem: string | undefined): string | null =>
    stem && avail.has(stem) ? `${art.base}/${avail.get(stem)}` : null;

  const portraits: Record<string, string> = {};
  const beats: Record<string, string> = {};
  const clues: Record<string, string> = {};
  for (const sc of chapter.scenes) {
    const pu = url(art.portraits[sc.id] ?? `${sc.speaker}_neutral`);
    if (pu) portraits[sc.id] = pu;
    const bu = url(art.beats[sc.id]);
    if (bu) beats[sc.id] = bu;
    for (const ts of sc.taskSlots) {
      const cu = url(art.clues[`${chapter.id}.${ts.slot}`]);
      if (cu) clues[ts.slot] = cu;
    }
  }
  return { base: art.base, backdrop: url(art.chapters[chapter.id]?.backdrop), endCard: url(art.endCard), portraits, beats, clues };
}

export interface ResolvedNovelArt {
  base: string;
  backdrop: string | null;
  endCard: string | null;
  portraits: Record<string, string>; // sceneId → url
  beats: Record<string, string>; // sceneId → url
  panels: Record<string, string>; // slot → url
}

/** G3 "FOURTEEN" graphic-novel art — same only-present discipline as the detective
 *  resolver (the `clues` manifest map doubles as per-slot panel art). */
export function resolveNovelArt(storyId: string, grade: number, chapter: Chapter): ResolvedNovelArt | null {
  const art = loadStoryArt(storyId);
  if (!art) return null;
  const avail = availMap(grade);
  const url = (stem: string | undefined): string | null =>
    stem && avail.has(stem) ? `${art.base}/${avail.get(stem)}` : null;

  const portraits: Record<string, string> = {};
  const beats: Record<string, string> = {};
  const panels: Record<string, string> = {};
  for (const sc of chapter.scenes) {
    const pu = url(art.portraits[sc.id] ?? `${sc.speaker}_neutral`);
    if (pu) portraits[sc.id] = pu;
    const bu = url(art.beats[sc.id]);
    if (bu) beats[sc.id] = bu;
    for (const ts of sc.taskSlots) {
      const cu = url(art.clues[`${chapter.id}.${ts.slot}`]);
      if (cu) panels[ts.slot] = cu;
    }
  }
  return { base: art.base, backdrop: url(art.chapters[chapter.id]?.backdrop), endCard: url(art.endCard), portraits, beats, panels };
}

export function resolveHubArt(storyId: string, grade: number): ResolvedHubArt | null {
  const art = loadStoryArt(storyId);
  if (!art) return null;
  const avail = availMap(grade);
  const url = (stem: string | undefined): string | null =>
    stem && avail.has(stem) ? `${art.base}/${avail.get(stem)}` : null;
  const cards: Record<string, string> = {};
  for (const [chId, c] of Object.entries(art.chapters)) {
    const u = url(c.card);
    if (u) cards[chId] = u;
  }
  return { cover: url(art.cover), cards };
}

/**
 * One representative clue thumbnail per chapter for the persistent hub Evidence
 * Board: the FIRST taskSlot (scene order) whose `${chapter.id}.${slot}` clue stem
 * exists on disk. Missing → omitted (the UI shows a procedural/locked fallback).
 * Same only-present discipline as resolveDetectiveArt.
 */
export function resolveEvidenceArt(storyId: string, grade: number, story: StoryT): Record<string, string> {
  const art = loadStoryArt(storyId);
  if (!art) return {};
  const avail = availMap(grade);
  const url = (stem: string | undefined): string | null =>
    stem && avail.has(stem) ? `${art.base}/${avail.get(stem)}` : null;

  const out: Record<string, string> = {};
  for (const ch of story.chapters) {
    let hit: string | null = null;
    for (const sc of ch.scenes) {
      for (const ts of sc.taskSlots) {
        const u = url(art.clues[`${ch.id}.${ts.slot}`]);
        if (u) {
          hit = u;
          break;
        }
      }
      if (hit) break;
    }
    if (hit) out[ch.id] = hit;
  }
  return out;
}
