import type { VocabItem } from "@domigo/content-schema";
import categories from "./categories.json" with { type: "json" };
import type { ActivityMode, ActivityWord } from "./game";
/** Original activity classifications only; display words/translations always come
 * from the current approved, reserve-filtered corpus. Changed/new words wait for
 * an explicit classification instead of silently becoming arbitrary activities.
 */
export function activityDeck(items: Pick<VocabItem, "id" | "w" | "g">[], grade: number): ActivityWord[] {
  const entries: Record<string, { word: string; mode: string }> = categories.entries;
  const seen = new Set<string>();
  return items.flatMap(item => {
    const match = /^g([1-4])u(\d{2})\.w\./.exec(item.id), entry = entries[item.id];
    if (!match || Number(match[1]) !== grade || !entry || entry.word !== item.w || !["draw", "show", "explain"].includes(entry.mode)) return [];
    const chapter = Number(match[2]), key = `${chapter}:${item.w.trim().toLocaleLowerCase("en")}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ id: item.id, chapter, word: item.w, german: item.g, mode: entry.mode as ActivityMode }];
  });
}
