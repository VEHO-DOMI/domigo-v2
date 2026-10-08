import type { VocabItem } from "@domigo/content-schema";

export const DAILY_WORDS = 10;

/** Stable 32-bit seed; no account, browser clock or random source. */
export function dailySeed(grade: number, day: string): number {
  const stamp = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isInteger(grade) || grade < 1 || grade > 4 || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== day) throw new Error("invalid_daily_seed");
  let h = 0x811c9dc5;
  for (const c of `${day}|${grade}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

/** Stable input order and unique headwords: repetitions in other Chapters do
 * not occupy two places. Callers supply only the grade's unreserved corpus.
 */
export function selectDailyChallenge(items: readonly VocabItem[], grade: number, day: string): VocabItem[] {
  let state = dailySeed(grade, day);
  const seen = new Set<string>();
  const words = [...items].filter((item) => item.id.startsWith(`g${grade}u`)).sort((a, b) => a.id.localeCompare(b.id)).filter((item) => {
    const word = item.w.trim().toLocaleLowerCase("en");
    if (seen.has(word)) return false;
    seen.add(word); return true;
  });
  for (let i = words.length - 1; i > 0; i--) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [words[i], words[j]] = [words[j]!, words[i]!];
  }
  return words.slice(0, DAILY_WORDS);
}
