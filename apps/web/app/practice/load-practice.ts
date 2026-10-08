import "server-only";
import { assignPool, listApprovedUnits } from "@domigo/content-loader";
import { getDb, listReservedForClass } from "@domigo/db";
import { loadUnitWithOverrides } from "@/lib/content-service";
import type { StudentView } from "@/lib/student-view";
import { selectDailyChallenge } from "@/lib/daily-challenge";
import { viennaDateKey } from "@/lib/wort-des-tages";

export async function loadPracticeWords(view: StudentView, grade: number, chapters?: readonly string[]) {
  const available = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
  const selected = chapters ? available.filter((slug) => chapters.includes(slug)) : available;
  const acting = view.kind === "student" ? view.player : null;
  // A reserve outage must not disclose held-out assessment tasks.
  const reserved = acting ? await listReservedForClass(getDb(), acting.classScope, acting.classId) : new Set<string>();
  const units = await Promise.all(selected.map((slug) => loadUnitWithOverrides(slug)));
  return {
    vocab: units.flatMap((unit) => unit.vocab).filter((item) => assignPool(item.id, reserved) !== "mock"),
    grammar: units.flatMap((unit) => unit.grammar).filter((item) => assignPool(item.id, reserved) !== "mock"),
  };
}

export async function loadDailyChallenge(view: StudentView, grade: number, day = viennaDateKey()) {
  const slugs = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
  const units = await Promise.all(slugs.map((slug) => loadUnitWithOverrides(slug)));
  // Everyone in the grade gets this same ten-word set, even across classes.
  const words = selectDailyChallenge(units.flatMap((unit) => unit.vocab), grade, day);
  const acting = view.kind === "student" ? view.player : null;
  const reserved = acting ? await listReservedForClass(getDb(), acting.classScope, acting.classId) : new Set<string>();
  // Skip held-out words after selection; never replace them with other words.
  const availableWords = words.filter((item) => assignPool(item.id, reserved) !== "mock");
  return { day, words, availableWords, blockedCount: words.length - availableWords.length };
}
