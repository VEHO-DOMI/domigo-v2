import { listApprovedUnits } from "@domigo/content-loader";
import { loadUnitWithOverrides } from "./content-service.ts";

/** Only display fields travel to the browser: no answer sets or learner state. */
export interface DictionaryEntry {
  id: string;
  slug: string;
  grade: number;
  chapter: number;
  word: string;
  german: string;
  example: string;
}

/** Published Studio corrections on approved Chapters only. On correction-read
 * failure, loadUnitWithOverrides falls back to the corpus (or the last readable
 * correction layer). No learner state is read, and nothing is written. */
export async function loadDictionary(grades: readonly number[]): Promise<DictionaryEntry[]> {
  const slugs = listApprovedUnits().filter((slug) => grades.includes(Number(slug[1])));
  const units = await Promise.all(slugs.map((slug) => loadUnitWithOverrides(slug)));
  return units
    .flatMap(({ slug, vocab }) => vocab.map((item) => ({
      id: item.id,
      slug,
      grade: Number(slug[1]),
      chapter: Number(slug.slice(-2)),
      word: item.w,
      german: item.g,
      // The headword can contain optional parts or an infinitive. The approved
      // full answer is the form that actually fits this particular sentence.
      example: item.s.replace(/___/g, () => item.sAnswers.find((a) => a.tier === "full")?.text ?? item.w),
    })))
    .sort((a, b) => a.word.localeCompare(b.word, "en", { sensitivity: "base" }) || a.slug.localeCompare(b.slug) || a.id.localeCompare(b.id));
}
