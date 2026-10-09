import { TRAINER_MODES } from "./catalog.ts";

/** Other established modes retain their contract. New modes are vocab-only. */
export function validModeInput(mode: string, itemId: string, input: { kind: string; pool?: string }): boolean {
  if (mode === "grammar") return /^g[1-4]u\d{2}\.gi\./.test(itemId) && ["text", "choice", "matching", "groupSort"].includes(input.kind);
  if (!(TRAINER_MODES as readonly string[]).includes(mode)) return true;
  if (!/^g[1-4]u\d+\.w\./.test(itemId)) return false;
  if (mode === "memory" || mode === "wordhunt") return input.kind === "choice";
  return input.kind === "vocab" && (mode === "speed" ? ["carrier", "definition", "deToEn", "enToDe"].includes(input.pool ?? "") : mode === "flashcards" ? ["deToEn", "enToDe"].includes(input.pool ?? "") : input.pool === "deToEn");
}
