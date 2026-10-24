import { expect, it } from "vitest";
import type { VocabItem } from "@domigo/content-schema";
import { vocabularyContentSnapshot, vocabularyPresentationKey } from "./vocabulary-history.ts";
const item = { id: "g1u01.w.synthetic", rev: 1, s: "A ___ here.", hintDe: "synthetic hint", translation: { deToEn: [{ text: "one", tier: "full" }], enToDe: [{ text: "eins", tier: "full" }] } } as VocabItem;
it("same content has stable identity regardless of object insertion order", () => {
  expect(vocabularyContentSnapshot(item)).toBe(vocabularyContentSnapshot({ ...item, translation: { enToDe: item.translation.enToDe, deToEn: item.translation.deToEn } }));
});
for (const patch of [{ s: "A changed ___ context." }, { hintDe: "A changed hint" }, { rev: 2 }, { translation: { ...item.translation, deToEn: [{ text: "other", tier: "full" as const }] } }]) it(`detects ${Object.keys(patch)} changes even when an overlay keeps rev`, () => {
  expect(vocabularyContentSnapshot({ ...item, ...patch })).not.toBe(vocabularyContentSnapshot(item));
});
it("answer direction and offered assistance create separate card observations", () => {
  const key = vocabularyPresentationKey(item, "carrier", [false, false, null, null]);
  expect(vocabularyPresentationKey(item, "definition", [false, false, null, null])).not.toBe(key);
  expect(vocabularyPresentationKey(item, "carrier", [true, false, null, null])).not.toBe(key);
  expect(vocabularyPresentationKey(item, "carrier", [false, false, null, ["one", "two"]])).not.toBe(key);
});
