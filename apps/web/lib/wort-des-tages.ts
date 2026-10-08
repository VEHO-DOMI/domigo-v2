import { loadDictionary, type DictionaryEntry } from "./woerterbuch.ts";

/** The school's day, even when the server runs in UTC (including DST changes). */
export function viennaDateKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Pure selection from one loaded snapshot, shared with the dictionary preview. */
export function selectDailyWord(entries: readonly DictionaryEntry[], grade: number, dateKey: string): DictionaryEntry | null {
  const stamp = Date.parse(`${dateKey}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== dateKey) {
    throw new Error("Expected a calendar date in YYYY-MM-DD format");
  }
  // Repeated headwords remain in the dictionary under each Chapter, but do not
  // take several places in the daily rotation. Adjacent days differ.
  const seen = new Set<string>();
  const words = entries.filter((entry) => {
    if (entry.grade !== grade) return false;
    const key = entry.word.toLocaleLowerCase("en");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (words.length === 0) return null;
  const day = Math.floor(stamp / 86_400_000);
  const index = ((day + grade * 97) % words.length + words.length) % words.length;
  return words[index] ?? null;
}

/** Same published corrections and corpus fallback as the dictionary. No account,
 * random source or stored learner progress enters the daily selection. */
export async function wortDesTages(grade: number, dateKey: string): Promise<DictionaryEntry | null> {
  return selectDailyWord(await loadDictionary([grade]), grade, dateKey);
}
