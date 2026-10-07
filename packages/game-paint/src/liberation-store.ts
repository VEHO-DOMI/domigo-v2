// CODEX DRAFT — NOT CANON · B1 prototype progress, local to this account/device.
export type LiberationProgress = Record<string, "named" | "coloured" | "peaceful">;
const key = (player: string, chapter: string) => `paint-liberation-v1:${encodeURIComponent(player)}:${chapter}`;
export function cleanLiberation(raw: unknown, allowed: readonly string[]): LiberationProgress {
  const result: LiberationProgress = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;
  for (const id of allowed) {
    const value = (raw as Record<string, unknown>)[id];
    if (value === "named" || value === "coloured" || value === "peaceful") result[id] = value;
  }
  return result;
}
export function readLiberation(player: string, chapter: string, allowed: readonly string[]): LiberationProgress {
  try { return cleanLiberation(JSON.parse(localStorage.getItem(key(player, chapter)) ?? "{}"), allowed); }
  catch { return {}; }
}
export function saveLiberation(player: string, chapter: string, allowed: readonly string[], progress: LiberationProgress): boolean {
  try { localStorage.setItem(key(player, chapter), JSON.stringify(cleanLiberation(progress, allowed))); return true; }
  catch { return false; }
}
