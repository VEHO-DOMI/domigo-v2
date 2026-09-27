/** Server projection contract. No answer key ever crosses the page boundary. */
import "server-only";
import { z } from "zod";
import { GrammarItem } from "@domigo/content-schema";
import { gradeGrammar } from "@domigo/engine";
import type { SchoolCard, SchoolView } from "@domigo/game-2d/school-types";
const Line = z.object({ speaker: z.string().nullable(), de: z.string().optional(), en: z.string().optional() });
export const SchoolBattery = z.object({
  schema: z.literal("storyBattery@1"), story: z.literal("g2.st.ink-ghost-goes-to-school"),
  chapter: z.literal("ch01"), unit: z.literal("g2-u01"), titleDe: z.string(),
  scenes: z.array(z.object({ id: z.string(), lines: z.array(Line) })),
  cards: z.array(z.object({ id: z.string(), station: z.string(), required: z.boolean(), placeDe: z.string(), situationDe: z.string(),
    before: z.array(Line), after: z.array(Line), revealEn: z.string().nullable(), item: GrammarItem })),
});
export type SchoolBatteryData = z.infer<typeof SchoolBattery>;
export const SCHOOL_STORY = "g2.st.ink-ghost-goes-to-school";
export const SCHOOL_CHAPTER = `${SCHOOL_STORY}.ch01`;
const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
function shuffle(values: string[], seed: string) { return values.map((value, i) => ({ value, n: hash(`${seed}/${i}/${value}`) })).sort((a, b) => a.n - b.n).map((x) => x.value); }
export function schoolCardView(c: SchoolBatteryData["cards"][number]): SchoolCard {
  const choice = ["multiple-choice", "context-picker"].includes(c.item.format);
  const chips = c.item.format === "sentence-building";
  const full = c.item.answers.filter((a) => a.tier === "full").map((a) => a.text);
  return {
    id: c.id, station: c.station, required: c.required, placeDe: c.placeDe, situationDe: c.situationDe,
    before: c.before.map((l) => ({ speaker: l.speaker, ...(l.de ? { de: l.de } : {}), ...(l.en ? { en: l.en } : {}) })),
    prompt: chips ? null : c.item.prompt.text,
    input: choice ? { kind: "choice", options: shuffle([...new Set([...full, ...c.item.distractors])], c.id) }
      : chips ? { kind: "chips", chips: shuffle(c.item.prompt.text.split(" / "), c.id) }
      : { kind: "text", blanks: Math.max(1, (full[0] ?? "").split("|").length) },
    glosses: c.item.gloss.map((g) => `${g.word} = ${g.de}`),
  };
}
export function schoolView(b: SchoolBatteryData, solved: string[], preview: boolean): SchoolView {
  const known = solved.filter((s) => b.cards.some((c) => c.station === s));
  return { titleDe: b.titleDe, cards: b.cards.map(schoolCardView), intro: b.scenes.find((s) => s.id === "vorfall")?.lines ?? [],
    // The ending contains no task answer but is still withheld until completion.
    ending: b.cards.filter((c) => c.required).every((c) => known.includes(c.station)) ? b.scenes.find((s) => s.id === "bilanz")?.lines ?? [] : [],
    solved: known, preview, recovered: Object.fromEntries(b.cards.filter((c) => known.includes(c.station)).map((c) => [c.station, { after: c.after, revealEn: c.revealEn }])) };
}
export function gradeSchoolCard(c: SchoolBatteryData["cards"][number], value: string) {
  const tier = gradeGrammar(c.item, { kind: ["multiple-choice", "context-picker"].includes(c.item.format) ? "choice" : "text", value }).tier;
  return { tier, explainDe: tier === "correct" ? c.item.explainDe ?? "" : c.item.hintDe ?? "",
    after: tier === "correct" ? c.after : [], revealEn: tier === "correct" ? c.revealEn : null };
}
