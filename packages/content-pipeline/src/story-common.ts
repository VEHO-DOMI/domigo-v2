/**
 * Shared types + paths for the story pipeline (Track C). A story bundle lives at
 * content/corpus/stories/<storyId>/ :
 *   draft.json        — `content story import` output (legacy structure; gen input)
 *   story.json        — story@1   (gen output, content-schema validated)
 *   cast.json         — cast@1
 *   names.json        — names@1   (proper-noun level-gate escape)
 *   story-items.json  — story-items@1 (narrative-locked items; optional)
 *   release.json      — story-release@1 (which chapters are live)
 *
 * The deterministic stages (import, validate) are pure; the `gen` rewrite +
 * 4 narrative lenses are LLM-authoring (a content wave, like the items wave).
 */
import path from "node:path";
import type { Grade } from "@domigo/content-schema";
import { CONTENT_DIR } from "./paths.ts";

export const STORIES_DIR = path.join(CONTENT_DIR, "corpus", "stories");

export function storyDir(storyId: string): string {
  return path.join(STORIES_DIR, storyId);
}

// ── import draft (legacy structure captured for the gen stage) ───────────────

export interface DraftDialogue {
  /** Legacy speaker key ("finn" | "cameo" | …) — gen maps to a cast id. */
  speaker: string;
  textEn: string;
  textDe: string | null;
  emotion: string | null;
}

export interface DraftTask {
  /** Legacy task title (a hint for what items the gen stage should reference). */
  name: string;
  /** Legacy type: image-matching | mc | reading | chat-sim | … (not a v2 format). */
  type: string;
  contextEn: string;
  contextDe: string | null;
  /** How many legacy items this task carried (sizing hint; content NOT copied). */
  legacyItemCount: number;
}

export interface DraftChapter {
  chapterId: string; // g{grade}.st.<slug>.ch{NN}
  unit: number;
  titleEn: string;
  topic: string;
  grammar: string;
  cameo: { name: string; emoji: string | null } | null;
  scenes: DraftDialogue[];
  tasks: DraftTask[];
}

export interface StoryDraft {
  schema: "story-draft@1";
  storyId: string; // g{grade}.st.<slug>
  grade: Grade;
  source: { file: string; sha256: string };
  chapters: DraftChapter[];
}

// ── release gating ──────────────────────────────────────────────────────────

export interface ReleaseFile {
  schema: "story-release@1";
  storyId: string;
  /** Chapter ids that are live. Chapter N requires units ≤ N approved (VS gate). */
  releasedChapters: string[];
}

// ── id helpers ──────────────────────────────────────────────────────────────

/** `g2u03.w.door` / `g2u03.gi.x.gf.001` → { grade, unit, slug } (or null). */
export function itemRefUnit(itemId: string): { grade: Grade; unit: number; slug: string } | null {
  const m = /^g([1-4])u(\d{2})\./.exec(itemId);
  if (m === null) return null;
  const grade = Number(m[1]) as Grade;
  const unit = parseInt(m[2]!, 10);
  return { grade, unit, slug: `g${grade}-u${String(unit).padStart(2, "0")}` };
}

/** `g2.st.watson.ch03` → 3 (the chapter ordinal), or null. */
export function chapterOrdinal(chapterId: string): number | null {
  const m = /\.ch(\d{2})$/.exec(chapterId);
  return m === null ? null : parseInt(m[1]!, 10);
}
