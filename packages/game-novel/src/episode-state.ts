import type { Chapter } from "@domigo/content-schema";
import type { Tier } from "@domigo/engine";
import type { EpisodeStats } from "./novel-copy.ts";

export const isFixSlot = (slot: string): boolean => /^fix(-|$)/.test(slot);
export const commentsAfter = (unit: number, slot: string): boolean => unit === 11 ? slot === "recap" : unit < 11 && isFixSlot(slot);
export const bandForUnit = (unit: number): "warm" | "tense" | "reckoning" => unit <= 5 ? "warm" : unit <= 10 ? "tense" : "reckoning";

/** Story progression and audience reveal are separate: no future channel numbers. */
export function audienceAt(chapter: Chapter, sceneId: string, done: boolean, economy: readonly EpisodeStats[]): EpisodeStats | null {
  const index = chapter.scenes.findIndex((s) => s.id === sceneId);
  const revealed = done || chapter.scenes.slice(0, index + 1).some((s) => /\{\{(?:views|likes|subscribers)\}\}/.test(s.textEn));
  const row = economy.findIndex((e) => e.chapterId === chapter.id);
  return (revealed ? economy[row] : economy[row - 1]) ?? null;
}

/** The final authored gut-line is never replaced by a generic victory screen. */
export function episodeEnding(unit: number): { title: string; action: string; note: string } {
  if (unit === 12) return { title: "Ben walks out.", action: "Stay with the story →", note: "No new video. The numbers cannot fix this." };
  if (unit === 13) return { title: "A call. Not a video.", action: "Make the call →", note: "The channel is still paused (= pausiert)." };
  if (unit === 14) return { title: "For real this time.", action: "See the ending →", note: "Live (= live). Honest (= ehrlich). Together." };
  if (unit === 11) return { title: "The clips are out there.", action: "Stay with the story →", note: "More views do not make this a win." };
  if (unit >= 6) return { title: "The episode is over.", action: "Finish this episode →", note: "The numbers have changed. What is happening to Ben?" };
  return { title: "The video is out.", action: "Finish this episode →", note: "One more part of the story is ready." };
}

export interface SavedTake { tier: Tier }
export function validTakes(chapter: Chapter, source: unknown): Record<string, SavedTake> {
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};
  const slots = new Set(chapter.scenes.flatMap((s) => s.taskSlots.map((t) => t.slot)));
  return Object.fromEntries(Object.entries(source).filter(([slot, value]) => slots.has(slot)
    && value && typeof value === "object" && "tier" in value
    && ["correct", "partial", "close", "wrong"].includes(String(value.tier)))) as Record<string, SavedTake>;
}
