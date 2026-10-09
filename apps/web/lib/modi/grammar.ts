import type { GrammarFormat, GrammarItem, GrammarStructure } from "@domigo/content-schema";
import { canonical } from "@domigo/engine";
import { shuffle } from "./decks.ts";

/** Exactly the formats supported by gradeGrammar and the grammar runner. */
export const GRAMMAR_FORMATS = ["gap-fill", "multiple-choice", "context-picker", "anagram", "error-correction", "sentence-building", "matching", "matching-pairs", "group-sort", "translation", "transformation", "question-formation", "free-form"] as const satisfies readonly GrammarFormat[];
export const FORMAT_NAMES: Record<GrammarFormat, { de: string; en: string }> = {
  "gap-fill": { de: "Lücken füllen", en: "Gap Fill" }, "multiple-choice": { de: "Antwort wählen", en: "Multiple Choice" },
  "context-picker": { de: "Passenden Satz wählen", en: "Context Picker" }, "anagram": { de: "Buchstaben ordnen", en: "Anagram" },
  "error-correction": { de: "Fehler verbessern", en: "Error Hunt" }, "sentence-building": { de: "Sätze bauen", en: "Sentence Builder" },
  "matching": { de: "Zuordnen", en: "Matching" }, "matching-pairs": { de: "Paare zuordnen", en: "Matching Pairs" },
  "group-sort": { de: "Gruppen bilden", en: "Group Sort" }, "translation": { de: "Übersetzen", en: "Translation" },
  "transformation": { de: "Sätze umformen", en: "Transform" }, "question-formation": { de: "Fragen bilden", en: "Questions" },
  "free-form": { de: "Antwort schreiben", en: "Write an answer" },
};
export interface GrammarTopic { id: string; chapter: number; name: string; nameDe: string; count: number; formats: GrammarFormat[]; memoryCount: number }
/** Unprompted vocabulary can reveal the answer, so it belongs to the hint. */
export function visibleGrammarGloss(item: GrammarItem, hintVisible: boolean): GrammarItem["gloss"] {
  const words = (value: string) => value.normalize("NFKC").toLowerCase().replaceAll("’", "'").match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu)?.join(" ") ?? "";
  const prompt = ` ${words(item.prompt.text)} `;
  return item.gloss.filter((entry) => hintVisible || item.format === "translation" || (words(entry.word).length > 0 && prompt.includes(` ${words(entry.word)} `)));
}
export function memoryEligible(item: GrammarItem): boolean {
  return item.format === "matching-pairs" && item.pairs.length >= 2 && item.pairs.length <= 8
    && new Set(item.pairs.map((p) => canonical(p.left))).size === item.pairs.length
    && new Set(item.pairs.map((p) => canonical(p.right))).size === item.pairs.length;
}
export function grammarTopics(items: readonly GrammarItem[], catalog: readonly GrammarStructure[]): GrammarTopic[] {
  const names = new Map(catalog.map((s) => [s.id, s]));
  return [...new Set(items.map((item) => item.structureId))].map((id) => {
    const group = items.filter((item) => item.structureId === id && GRAMMAR_FORMATS.includes(item.format));
    const chapter = Number(id.match(/^g\du(\d+)/)?.[1]);
    const source = names.get(id);
    const fallback = `Chapter ${chapter} · ${id.split(".s.")[1]}`;
    return { id, chapter, name: source?.name ?? fallback, nameDe: source?.nameDe ?? fallback, count: group.length,
      formats: GRAMMAR_FORMATS.filter((format) => group.some((item) => item.format === format)), memoryCount: group.filter(memoryEligible).length };
  }).filter((topic) => topic.count > 0).sort((a, b) => a.chapter - b.chapter || a.id.localeCompare(b.id));
}
export function grammarRound(items: readonly GrammarItem[], structureId: string, format: GrammarFormat | "mix", memory: boolean, random: () => number = Math.random): GrammarItem[] {
  return shuffle(items.filter((item) => item.structureId === structureId && GRAMMAR_FORMATS.includes(item.format)
    && (memory ? memoryEligible(item) : format === "mix" || item.format === format)), random).slice(0, memory ? 1 : 10);
}
