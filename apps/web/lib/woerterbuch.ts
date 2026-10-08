import { listApprovedUnits, loadUnit } from "@domigo/content-loader";

/** Only display fields travel to the browser: no answer sets or learner state. */
export interface DictionaryEntry {
  id: string;
  slug: string;
  grade: number;
  chapter: number;
  word: string;
  german: string;
  definition: string;
  example: string;
}

/** Committed corpus + reviewed corrections, deliberately without Studio DB reads. */
export function loadDictionary(grades: readonly number[]): DictionaryEntry[] {
  return listApprovedUnits()
    .filter((slug) => grades.includes(Number(slug[1])))
    .flatMap((slug) => loadUnit(slug).vocab.map((item) => ({
      id: item.id,
      slug,
      grade: Number(slug[1]),
      chapter: Number(slug.slice(-2)),
      word: item.w,
      german: item.g,
      definition: item.d,
      // The headword can contain optional parts or an infinitive. The approved
      // full answer is the form that actually fits this particular sentence.
      example: item.s.replace(/___/g, () => item.sAnswers.find((a) => a.tier === "full")?.text ?? item.w),
    })))
    .sort((a, b) => a.word.localeCompare(b.word, "en", { sensitivity: "base" }) || a.slug.localeCompare(b.slug) || a.id.localeCompare(b.id));
}
