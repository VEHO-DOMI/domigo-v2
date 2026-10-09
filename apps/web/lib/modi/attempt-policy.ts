import { TRAINER_MODES } from "./catalog.ts";

/** Audited senders: practice, review, listening, TestSession and game adapters.
 * Assignments (practice/mock_test/checkup) use /api/assignments/attempt and its
 * server-only assign:<id> tag, never this XP-awarding endpoint.
 */
export const ATTEMPT_MODES = [
  "practice", "daily", "review", "listening", "grammar",
  "test:vocab", "test:grammar", "test:listening", "test:reading",
  "game:g1", "game:g2", "game:g3", "game:g4",
  ...TRAINER_MODES,
] as const;

export function knownAttemptMode(mode: string): boolean {
  return (ATTEMPT_MODES as readonly string[]).includes(mode)
    || /^study:(?:(?:vocab|grammar)-practice-[1-3]|checkpoint)$/.test(mode)
    || /^journey:g[1-4]-u\d{2}:[a-z0-9][a-z0-9-]*$/.test(mode)
    || /^duel:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(mode);
}

/** Established modes keep their input contracts. Trainer modes are vocab-only. */
export function validModeInput(mode: string, itemId: string, input: { kind: string; pool?: string }): boolean {
  if (!knownAttemptMode(mode)) return false;
  if (mode.startsWith("duel:")) return /^g[1-4]u\d{2}\.w\./.test(itemId) && input.kind === "choice";
  if (mode === "grammar") return /^g[1-4]u\d{2}\.gi\./.test(itemId) && ["text", "choice", "matching", "groupSort"].includes(input.kind);
  if (!(TRAINER_MODES as readonly string[]).includes(mode)) return true;
  if (!/^g[1-4]u\d+\.w\./.test(itemId)) return false;
  if (mode === "memory" || mode === "wordhunt") return input.kind === "choice";
  return input.kind === "vocab" && (mode === "speed" ? ["carrier", "definition", "deToEn", "enToDe"].includes(input.pool ?? "") : mode === "flashcards" ? ["deToEn", "enToDe"].includes(input.pool ?? "") : input.pool === "deToEn");
}
