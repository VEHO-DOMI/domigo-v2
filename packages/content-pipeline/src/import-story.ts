/**
 * `content story import [--grade N]` — STAGE 1 of the story pipeline.
 * Deterministically parses the legacy campaign data (g1: the standalone
 * 1st-grade-vocab-trainer `campaignLevels = [...]`) into a `story-draft@1`
 * artifact: the legacy scene/dialogue/task STRUCTURE, captured for the gen stage.
 * It copies NO graded content — legacy tasks become sizing hints; the gen stage
 * (LLM) rewrites every line to in-bank-or-glossed and maps tasks to REAL approved
 * item ids. Reads the read-only iCloud source (like `extract`); CI never needs it.
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade } from "@domigo/content-schema";
import { sha256OfString, writeJson } from "./json.ts";
import { storyDir, type DraftChapter, type StoryDraft } from "./story-common.ts";

/** Legacy "Lost Pages" source (override via DOMIGO_LEGACY_G1). */
export const LEGACY_G1 =
  process.env["DOMIGO_LEGACY_G1"] ??
  path.join(
    process.env["HOME"] ?? "~",
    "Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Claude/Cowork Space/Claude Code/1st-grade-vocab-trainer/index.html",
  );

/** Per-grade story ids + their legacy sources. Only g1 is wired in PR-4. */
const STORY_SOURCES: Partial<Record<Grade, { storyId: string; file: string }>> = {
  1: { storyId: "g1.st.lost-pages", file: LEGACY_G1 },
};

interface LegacyDialogue {
  speaker?: string;
  text?: string;
  textDe?: string;
  emotion?: string;
}
interface LegacyTask {
  name?: string;
  type?: string;
  context?: string;
  contextDe?: string;
  items?: unknown[];
  questions?: unknown[];
}
interface LegacyLevel {
  levelId?: string;
  levelName?: string;
  topic?: string;
  grammar?: string;
  cameo?: { name?: string; emoji?: string };
  storyA?: LegacyDialogue[];
  storyB?: LegacyDialogue[];
  completion?: LegacyDialogue[];
  tasks?: LegacyTask[];
}

/**
 * Extract a single `[...]` literal starting at `open`, string/comment-aware so
 * brackets inside strings ("[1]") or the legacy `// ===` comments don't miscount.
 */
export function extractArrayLiteral(src: string, open: number): string {
  let depth = 0;
  let inStr: string | null = null;
  let inLine = false;
  let inBlock = false;
  for (let i = open; i < src.length; i += 1) {
    const c = src[i]!;
    const n = src[i + 1];
    if (inLine) {
      if (c === "\n") inLine = false;
      continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") { inBlock = false; i += 1; }
      continue;
    }
    if (inStr !== null) {
      if (c === "\\") { i += 1; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "/" && n === "/") { inLine = true; i += 1; continue; }
    if (c === "/" && n === "*") { inBlock = true; i += 1; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "[") depth += 1;
    else if (c === "]") {
      depth -= 1;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error("unbalanced array literal");
}

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Pure: legacy `campaignLevels` array literal text → draft chapters. */
export function parseLegacyCampaign(arrayLiteralText: string, storyId: string): DraftChapter[] {
  // The literal is static data (objects/arrays/strings/numbers + comments) from
  // our own read-only file — eval it in strict mode to get the JS array.
  const levels = new Function(`"use strict"; return (${arrayLiteralText});`)() as LegacyLevel[];
  return levels.map((lv, idx): DraftChapter => {
    const unit = idx + 1;
    const dialogue = [...(lv.storyA ?? []), ...(lv.storyB ?? []), ...(lv.completion ?? [])];
    return {
      chapterId: `${storyId}.ch${pad2(unit)}`,
      unit,
      titleEn: lv.levelName ?? `Chapter ${unit}`,
      topic: lv.topic ?? "",
      grammar: lv.grammar ?? "",
      cameo: lv.cameo?.name ? { name: lv.cameo.name, emoji: lv.cameo.emoji ?? null } : null,
      scenes: dialogue.map((d) => ({
        speaker: d.speaker ?? "narrator",
        textEn: d.text ?? "",
        textDe: d.textDe ?? null,
        emotion: d.emotion ?? null,
      })),
      tasks: (lv.tasks ?? []).map((t) => ({
        name: t.name ?? "",
        type: t.type ?? "",
        contextEn: t.context ?? "",
        contextDe: t.contextDe ?? null,
        legacyItemCount: (t.items?.length ?? 0) + (t.questions?.length ?? 0),
      })),
    };
  });
}

export function runStoryImport(grade: Grade): void {
  const source = STORY_SOURCES[grade];
  if (source === undefined) {
    console.error(`story import: grade ${grade} has no legacy source wired yet (only g1 in PR-4)`);
    process.exitCode = 2;
    return;
  }
  if (!fs.existsSync(source.file)) {
    console.error(`story import: legacy source not found (read-only iCloud): ${source.file}`);
    process.exitCode = 1;
    return;
  }
  const src = fs.readFileSync(source.file, "utf8");
  const m = /campaignLevels\s*=\s*\[/.exec(src);
  if (m === null) {
    console.error(`story import: no "campaignLevels = [" assignment in ${source.file}`);
    process.exitCode = 1;
    return;
  }
  const arrayText = extractArrayLiteral(src, m.index + m[0].length - 1);
  const chapters = parseLegacyCampaign(arrayText, source.storyId);
  const draft: StoryDraft = {
    schema: "story-draft@1",
    storyId: source.storyId,
    grade,
    source: { file: path.basename(source.file), sha256: sha256OfString(arrayText) },
    chapters,
  };
  const out = path.join(storyDir(source.storyId), "draft.json");
  writeJson(out, draft);
  const scenes = chapters.reduce((s, c) => s + c.scenes.length, 0);
  const tasks = chapters.reduce((s, c) => s + c.tasks.length, 0);
  console.log(
    `story import: ${source.storyId} — ${chapters.length} chapters, ${scenes} scenes, ${tasks} legacy tasks → ${path.relative(process.cwd(), out)}`,
  );
}
