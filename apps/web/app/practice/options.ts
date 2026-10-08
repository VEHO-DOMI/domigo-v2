import type { VocabItem } from "@domigo/content-schema";
import { vocabAnswers, type VocabPool } from "@domigo/engine";

export type PracticeMode = "full" | "sprint" | "mc" | "grammar" | "daily";
export type Direction = "auto" | VocabPool;
export function practiceMode(raw: unknown): PracticeMode {
  return raw === "sprint" || raw === "mc" || raw === "grammar" || raw === "daily" ? raw : "full";
}
export function practiceDirection(raw: unknown): Direction {
  return raw === "carrier" || raw === "definition" || raw === "deToEn" || raw === "enToDe" ? raw : "auto";
}
export function selectedChapters(raw: unknown, available: readonly string[]): string[] {
  if (typeof raw !== "string") return [...available];
  return [...new Set(raw.split(","))].filter((slug) => available.includes(slug));
}
export function sprintWords(items: readonly VocabItem[], random: () => number = Math.random): VocabItem[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, 10);
}
/** MC uses authored English headword distractors, never generated text. */
export function multipleChoiceBank(item: VocabItem): string[] {
  const correct = vocabAnswers(item, "definition").find((a) => a.tier === "full")!.text;
  const options = [correct, ...item.mc];
  const offset = [...item.id].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 4;
  return [...options.slice(offset), ...options.slice(0, offset)];
}
