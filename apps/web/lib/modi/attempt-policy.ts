import { TRAINER_MODES } from "./catalog.ts";

/** Other established modes retain their contract. New modes are vocab-only. */
export function validModeInput(mode: string, itemId: string, input: { kind: string; pool?: string }): boolean {
  if (!(TRAINER_MODES as readonly string[]).includes(mode)) return true;
  if (!/^g[1-4]u\d+\.w\./.test(itemId)) return false;
  if (mode === "memory" || mode === "wordhunt") return input.kind === "choice";
  return input.kind === "vocab" && (mode === "flashcards" ? ["deToEn", "enToDe"].includes(input.pool ?? "") : input.pool === "deToEn");
}
