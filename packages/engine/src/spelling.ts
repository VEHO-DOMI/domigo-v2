/** Original trainer phrase scaffolding, owned by the shared engine.
 * Fixed fragments stay visible; the submitted answer retains them so that
 * gradeVocab evaluates the authored phrase, with the existing typo tiers.
 */
export interface SpellingSlot { text: string; fixed: boolean }
export function spellingLayout(answer: string): SpellingSlot[] {
  const fixed = /^(?:to|a|an|the)\s+|\([^)]*\)|\b(?:sth\.?|sb\.?|s\.o\.?|s\.th\.?)(?=\s|$)|[^a-zA-Z]/gi;
  const slots: SpellingSlot[] = [];
  let end = 0;
  for (const match of answer.matchAll(fixed)) {
    for (const text of answer.slice(end, match.index)) slots.push({ text, fixed: false });
    slots.push({ text: match[0], fixed: true });
    end = match.index + match[0].length;
  }
  for (const text of answer.slice(end)) slots.push({ text, fixed: false });
  return slots;
}
/** Never correct, truncate or replace typed letters, including excess input. */
export function spellingAnswer(layout: readonly SpellingSlot[], letters: string): string {
  const input = [...letters.replace(/\s/g, "")];
  let index = 0;
  return layout.map((slot) => slot.fixed ? slot.text : input[index++] ?? "").join("") + input.slice(index).join("");
}
