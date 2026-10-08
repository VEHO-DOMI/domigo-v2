import type { DictionaryEntry } from "@/lib/woerterbuch";

export function dictionaryResults(entries: readonly DictionaryEntry[], query: string) {
  const needle = query.trim().normalize("NFC").toLocaleLowerCase("de");
  const searching = [...needle].length >= 2;
  const matches = searching ? entries.filter((entry) =>
    [entry.word, entry.german].some((text) => text.normalize("NFC").toLocaleLowerCase("de").includes(needle)),
  ) : [...entries];
  if (!searching) return { searching, matches, groups: [] };
  const chapters = new Map<string, DictionaryEntry[]>();
  for (const entry of matches) chapters.set(entry.slug, [...(chapters.get(entry.slug) ?? []), entry]);
  const groups = [...chapters.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([slug, words]) => ({ slug, words }));
  return { searching, matches, groups };
}
