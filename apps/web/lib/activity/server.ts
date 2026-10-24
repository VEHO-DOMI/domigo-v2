import "server-only";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { loadPracticeWords } from "@/app/practice/load-practice";
import { trainerGrade, type StudentView } from "@/lib/student-view";
import { activityDeck } from "./catalog";
import type { ActivityWord } from "./game";
export async function loadActivity(view: StudentView): Promise<{ words: ActivityWord[]; unavailable: boolean }> {
  const grade = trainerGrade(view);
  if (grade === null) return { words: [], unavailable: true };
  try {
    // Preview reads the local approved corpus, never a class, roster or DB.
    const vocab = view.kind === "preview"
      ? listApprovedUnits().filter(slug => slug.startsWith(`g${grade}-`)).flatMap(slug => loadUnit(slug).vocab)
      : (await loadPracticeWords(view, grade)).vocab;
    return { words: activityDeck(vocab, grade), unavailable: false };
  } catch {
    // Reserve failure must close the game instead of exposing held-out words.
    return { words: [], unavailable: true };
  }
}
