import { ActivityTeacherDecisions, type VocabItem } from "@domigo/content-schema";
import categories from "./categories.json" with { type: "json" };
import decisionRecords from "./teacher-decisions.json" with { type: "json" };
import type { ActivityMode, ActivityWord } from "./game";
const decisions = new Map(ActivityTeacherDecisions.parse(decisionRecords).map(row => [row.taskId, row]));
type Classification = { word: string; mode: string };
const originals: Readonly<Record<string, Classification>> = categories.entries;
/** Teacher decision > supplied saved classification > original map. The current
 * server has no separate saved override store, so the default is the original
 * map. Neither audit prose nor a spelling match can create a classification.
 * Display words still come only from approved, reserve-filtered caller items.
 */
export function activityDeck(items: Pick<VocabItem, "id" | "w" | "g">[], grade: number,
  saved: Readonly<Record<string, Classification>> = originals): ActivityWord[] {
  const seen = new Set<string>();
  return items.flatMap(item => {
    const match = /^g([1-4])u(\d{2})\.w\./.exec(item.id), teacher = decisions.get(item.id);
    if (!match || Number(match[1]) !== grade) return [];
    // An existing but stale teacher decision is a hold, not fallback authority.
    if (teacher && (teacher.word !== item.w || teacher.german !== item.g)) return [];
    const valid = (entry: Classification | undefined) => entry?.word === item.w && ["draw", "show", "explain"].includes(entry.mode) ? entry.mode : undefined;
    const mode = teacher?.mode ?? valid(saved[item.id]) ?? valid(originals[item.id]);
    if (!mode) return [];
    const chapter = Number(match[2]), key = item.id;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ id: item.id, chapter, word: item.w, german: item.g, mode: mode as ActivityMode }];
  });
}
