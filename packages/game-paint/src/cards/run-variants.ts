import type { GameTaskV2 } from "@domigo/content-schema";
import { seededShuffle } from "../../../content-schema/src/game-tasks.ts";

/** Closed Unit 1 vocabulary; index + 1 is the corresponding digit. */
export const RUN_NUMBER_WORDS = [
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
  "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five",
] as const;
export type RunWheelTask = Extract<GameTaskV2, { kind: "wheel" }>;

/** encounterIndex is the authored encounter ordinal, never a render/retry count.
 * Each block of 25 visits every number once. Scope isolates independent corridors. */
export function runNumberAt(seed: string, scope: string, encounterIndex: number): number {
  if (!Number.isSafeInteger(encounterIndex) || encounterIndex < 0) throw new RangeError("Invalid number encounter index");
  const cycle = Math.floor(encounterIndex / RUN_NUMBER_WORDS.length);
  return seededShuffle(RUN_NUMBER_WORDS.map((_, i) => i + 1), JSON.stringify([seed, scope, cycle]))[encounterIndex % RUN_NUMBER_WORDS.length]!;
}

/** Expand an authored, number-neutral wheel family. Identity, story, art and
 * bindings remain authored; every numeric datum and hint is regenerated together.
 * Never use a template whose story/art/evidence embeds one particular number. */
export function numberWheelVariant(template: RunWheelTask, value: number): RunWheelTask {
  if (!Number.isInteger(value) || value < 1 || value > RUN_NUMBER_WORDS.length) throw new RangeError("Number must be between 1 and 25");
  const word = RUN_NUMBER_WORDS[value - 1]!;
  const toWord = template.variant === "digit-to-word";
  // Drop optional English prompt and evidence too: either may name the old number.
  const base = { ...template };
  delete base.promptEn;
  delete base.evidence;
  return {
    ...base,
    shown: toWord ? String(value) : word,
    answer: toWord ? word : String(value),
    values: toWord ? [...RUN_NUMBER_WORDS] : RUN_NUMBER_WORDS.map((_, i) => String(i + 1)),
    hints: { deDesc: toWord ? "Zähl auf Englisch bis zu dieser Zahl." : "Welche Zahl ist mit dem englischen Wort gemeint?" },
  };
}

/** A retry with the same seed/scope/ordinal yields the identical complete card.
 * The caller retains this card while the answer overlay is held. */
export const numberWheelForEncounter = (template: RunWheelTask, seed: string, scope: string, encounterIndex: number): RunWheelTask =>
  numberWheelVariant(template, runNumberAt(seed, scope, encounterIndex));
