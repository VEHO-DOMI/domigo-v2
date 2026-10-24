/** R2 diagnostic evidence, never a pedagogical release or proof of first teaching. */
import type { VocabItem } from "@domigo/content-schema";
import type { VocabularyCases } from "./vocabulary-cases.ts";

const tokens = (text: string) => [...text.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/gu)].map(m => ({ text: m[0], start: m.index, end: m.index + m[0].length }));
const order = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const key = (text: string) => text.toLowerCase().replaceAll("’", "'");
type Occurrence = VocabularyCases["cases"][number]["source"];
export type Exposure = { occurrenceId: string; grade: number; unit: number | null; referenceKind: string; headword: string; gloss: string; lookup: "literal-headword" | "citation-to" };
export function prerequisiteLexicon(sources: Occurrence[]) {
  const lexicon = new Map<string, Exposure[]>();
  for (const source of sources) {
    if (source.disposition === "excluded") continue;
    const { en, de, reference } = source.entry;
    const add = (word: string, lookup: Exposure["lookup"]) => {
      // Whole headword only. Components of a phrase do not teach each component's meaning.
      if (!/^[A-Za-z]+(?:['’][A-Za-z]+)*$/u.test(word)) return;
      const k = key(word), rows = lexicon.get(k) ?? [];
      rows.push({ occurrenceId: source.id, grade: reference.grade, unit: reference.unit, referenceKind: reference.kind, headword: en, gloss: de, lookup });
      lexicon.set(k, rows);
    };
    add(en, "literal-headword");
    if (en.startsWith("to ")) add(en.slice(3), "citation-to");
  }
  for (const rows of lexicon.values()) rows.sort((a, b) => order(a.occurrenceId, b.occurrenceId));
  return lexicon;
}

export function supportLanguageEvidence(fields: Record<string, string>, target: string, grade: number, unit: number, lexicon: ReturnType<typeof prerequisiteLexicon>, targetSpans: Record<string, Array<{ start: number; end: number }>> = {}) {
  const inventory = new Map<string, { surface: string; occurrences: Array<{ field: string; start: number; end: number; text: string; role: "support" | "inserted-target" }> }>();
  for (const [field, text] of Object.entries(fields)) {
    // Only the explicit target-prompt field is exempt, not all words in a multiword target.
    if (field === "en-to-de-target" && text === target) continue;
    for (const token of tokens(text)) {
      const k = key(token.text), row = inventory.get(k) ?? { surface: k, occurrences: [] };
      const role = (targetSpans[field] ?? []).some(span => token.start >= span.start && token.end <= span.end) ? "inserted-target" as const : "support" as const;
      row.occurrences.push({ field, ...token, role });inventory.set(k, row);
    }
  }
  return [...inventory.values()].sort((a,b)=>order(a.surface,b.surface)).map(row => {
    const candidates = lexicon.get(row.surface) ?? [];
    const earlier = candidates.filter(c => c.grade < grade || c.grade === grade && c.unit !== null && c.unit <= unit);
    const later = candidates.filter(c => c.grade > grade || c.grade === grade && c.unit !== null && c.unit > unit);
    const status = row.occurrences.every(o=>o.role==="inserted-target") ? "current-target-only" : earlier.length ? "at-or-before-reference-candidate" : later.length ? "later-reference-only" : candidates.length ? "unlocated-reference" : "no-headword-evidence";
    // Resolve candidates through the report's shared lexicon. Repeating the same
    // source quotation for every token would obscure the actual per-task review.
    return { ...row, status, lexiconKey: row.surface, candidateCounts: { total: candidates.length, atOrBefore: earlier.length, later: later.length }, verifiedUse: false as const, firstTaught: null };
  });
}

/** A narrow negative check. Passing it is not R2 approval: word senses, phrases,
 * constructions, body-text exposure and instructional scaffolding need review. */
export function assertSupportWordsLocated(inventory: ReturnType<typeof supportLanguageEvidence>): void {
  const unresolved = inventory.filter(row => !["at-or-before-reference-candidate", "current-target-only"].includes(row.status));
  if (unresolved.length) throw Error(`unlocated or later support words: ${unresolved.map(r=>r.surface).join(", ")}`);
}

export function taskPrerequisites(item: VocabItem, grade: number, unit: number, lexicon: ReturnType<typeof prerequisiteLexicon>) {
  const fields: Record<string, string> = { definition: item.d, context: item.s, "en-to-de-target": item.w };
  const targetSpans: Record<string, Array<{ start: number; end: number }>> = {};
  item.sAnswers.forEach((answer, i) => {
    const field = `placed-context:${i}:${answer.tier}`, parts = item.s.split("___"), spans: Array<{ start: number; end: number }> = [];
    let placed = parts[0]!;
    for (const part of parts.slice(1)) { const start = placed.length;placed += answer.text;spans.push({start,end:placed.length});placed += part; }
    fields[field] = placed;targetSpans[field] = spans;
  });
  item.mc?.forEach((text, i) => { fields[`choice:${i}`] = text; });
  item.gloss?.forEach((gloss, i) => { fields[`gloss-english:${i}`] = gloss.word; });
  item.presentation?.gameMeta?.distractorPool?.forEach((text, i) => { fields[`game-choice:${i}`] = text; });
  item.presentation?.variants.forEach((variant, i) => {
    if (variant.prompt.lang === "en") fields[`variant:${i}`] = variant.prompt.text;
    variant.glosses.forEach((gloss, j) => { fields[`variant-gloss:${i}:${j}`] = gloss.word; });
  });
  const lexicalInventory = supportLanguageEvidence(fields, item.w, grade, unit, lexicon, targetSpans);
  return {
    status: "not-approved" as const,
    method: "Whole-source-headword occurrence candidates, plus explicitly labelled citation-to lookup; no stopword allowlist, inflection guess, phrase-component permission, gloss exemption or meaning approval.",
    target: { word: item.w, promptField: "en-to-de-target", inference: "current learning target, not a grant for its component words in support language" },
    lexicalInventory,
    lexicalCheck: { status: lexicalInventory.some(x=>!["at-or-before-reference-candidate", "current-target-only"].includes(x.status)) ? "needs-source-or-scaffold-review" : "occurrence-candidates-only", approved: false },
    // Every complete English field stays visible. A token sweep cannot certify syntax.
    constructionReview: { status: "unreviewed", fields: Object.entries(fields).map(([field,text])=>({field,text})), approved: false },
    germanScaffold: { applicable: grade === 1, hint: item.hintDe ?? null, glosses: item.gloss ?? [], status: "adequacy-and-answer-leakage-unreviewed", englishSpansInGermanHint: "not-inferred; explicit span review required" },
    limitations: ["Appendix reference is not first teaching or mastery.", "Earlier body-text exposure can resolve a lexical warning only with a separately checked source.", "Matching spelling does not verify the selected sense or grammatical construction.", "No task receives release approval from this diagnostic."],
  };
}
