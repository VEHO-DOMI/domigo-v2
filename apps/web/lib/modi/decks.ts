import type { VocabItem } from "@domigo/content-schema";
import { canonical, spellingLayout, vocabAnswers, type VocabPool } from "@domigo/engine";

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
export function fullAnswer(item: VocabItem, pool: VocabPool = "carrier"): string {
  return vocabAnswers(item, pool).find((answer) => answer.tier === "full")?.text ?? "";
}
export const chapterOf = (item: VocabItem): number => Number(item.id.match(/^g\du(\d+)\./)?.[1]);
export function distinctWords(words: readonly VocabItem[]): VocabItem[] {
  const english = new Set<string>(), german = new Set<string>();
  return words.filter((item) => {
    const en = canonical(item.w), de = canonical(item.g);
    if (!en || !de || english.has(en) || german.has(de)) return false;
    english.add(en); german.add(de); return true;
  });
}
export function spellingWords(words: readonly VocabItem[]): VocabItem[] {
  return distinctWords(words).filter((item) => {
    const layout = spellingLayout(fullAnswer(item, "deToEn"));
    const count = layout.filter((slot) => !slot.fixed).length;
    return count >= 3 && count <= 30;
  }).slice(0, 18);
}
export interface HuntTile { word: string; item: VocabItem | null }
export interface HuntRound { chapter: number; tiles: HuntTile[] }
/**
 * The question is Chapter membership. An authored carrier answer is the raw
 * choice sent to the unchanged grader. A target word uses its own reference.
 * Distractors have no persistence reference: a wrong Chapter choice must not
 * change an unrelated word's Leitner status. Construction follows the reserve
 * filter; only selected targets can become assessed word attempts.
 */
export function huntRounds(words: readonly VocabItem[], random: () => number = Math.random): HuntRound[] {
  const unique = distinctWords(words).filter((item) => canonical(fullAnswer(item)) === canonical(item.w));
  const chapters = [...new Set(unique.map(chapterOf))];
  if (chapters.length < 2) return [];
  const rounds: HuntRound[] = [];
  for (let i = 0; i < 8; i++) {
    const chapter = chapters[i % chapters.length]!;
    const targets = shuffle(unique.filter((item) => chapterOf(item) === chapter), random).slice(0, 5);
    if (targets.length < 3) continue;
    const targetNames = new Set(words.filter((item) => chapterOf(item) === chapter).map((item) => canonical(item.w)));
    const decoys = shuffle(unique.filter((item) => chapterOf(item) !== chapter && !targetNames.has(canonical(item.w))), random)
      .slice(0, 10 - targets.length).map((candidate) => ({ word: candidate.w, item: null }));
    if (targets.length + decoys.length < 8) continue;
    rounds.push({ chapter, tiles: shuffle([...targets.map((item) => ({ word: item.w, item })), ...decoys], random) });
  }
  return rounds.length === 8 ? rounds : [];
}
