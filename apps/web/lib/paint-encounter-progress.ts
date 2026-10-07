import type { PaintEncounter } from "@domigo/content-schema";
import { freshEncounterProgress, type EncounterProgress, type EncounterReply } from "../../../packages/game-paint/src/encounter/runtime.ts";

export interface EncounterStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export interface EncounterProgressContext {
  playerKey: string;
  encounter: PaintEncounter;
  preview: boolean;
  storage?: EncounterStorage | null;
}
const keyFor = (ctx: EncounterProgressContext): string | null =>
  !ctx.preview && ctx.playerKey.trim() && ctx.playerKey.length <= 256 && /^ch\d{2}$/.test(ctx.encounter.chapter)
    ? `domigo:paint-encounter:v1:${encodeURIComponent(ctx.playerKey)}:${ctx.encounter.chapter}` : null;
const storageFor = (ctx: EncounterProgressContext): EncounterStorage | null => {
  if (ctx.preview) return null;
  if (ctx.storage !== undefined) return ctx.storage;
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
};
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const tiers = new Set(["correct", "close", "partial", "wrong"]);
const validReply = (r: unknown): r is EncounterReply => isObject(r) && typeof r.ok === "boolean" && typeof r.queued === "boolean"
  && (r.tier === undefined || tiers.has(String(r.tier)))
  && (r.xpAwarded === undefined || typeof r.xpAwarded === "number" && Number.isFinite(r.xpAwarded) && r.xpAwarded >= 0);

/** Browser progress is a draft, never learning credit. Reject stale or mismatched
 * pending payloads instead of sending a different item under a recovered UUID. */
export function readPaintEncounterProgress(ctx: EncounterProgressContext): EncounterProgress {
  const fresh = freshEncounterProgress(ctx.encounter.revision);
  const key = keyFor(ctx);
  if (!key) return fresh;
  try {
    const raw: unknown = JSON.parse(storageFor(ctx)?.getItem(key) ?? "null");
    if (!isObject(raw) || raw.version !== 1 || raw.revision !== ctx.encounter.revision
      || !Number.isInteger(raw.cursor) || Number(raw.cursor) < -4 || Number(raw.cursor) > ctx.encounter.tasks.length
      || typeof raw.lastInput !== "string" || raw.lastInput.length > 32 || typeof raw.hintUsed !== "boolean"
      || !Array.isArray(raw.worldEffects) || raw.worldEffects.some(x => x !== "recover_book" && x !== "pack_book")) return fresh;
    const task = ctx.encounter.tasks[Number(raw.cursor)];
    const pending = raw.pendingAttempt;
    if (pending !== null) {
      if (!task || !isObject(pending) || pending.clientAttemptId !== raw.pendingAttemptId
        || typeof pending.clientAttemptId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pending.clientAttemptId)
        || pending.itemId !== task.corpusItem || pending.mode !== "game:g1" || !isObject(pending.input)
        || pending.input.kind !== (task.kind === "choice" ? "choice" : "text")
        || pending.input.value !== raw.lastInput.trim() || typeof pending.hintUsed !== "boolean"
        || !(pending.latencyMs === null || typeof pending.latencyMs === "number" && Number.isFinite(pending.latencyMs) && pending.latencyMs >= 0)) return fresh;
    } else if (raw.pendingAttemptId !== null) return fresh;
    if (raw.confirmed !== null && (!task || !isObject(raw.confirmed)
      || !tiers.has(String(raw.confirmed.localTier)) || !validReply(raw.confirmed.reply))) return fresh;
    return { ...(raw as unknown as EncounterProgress), worldEffects: [...new Set(raw.worldEffects as string[])] };
  } catch { return fresh; }
}

export function savePaintEncounterProgress(ctx: EncounterProgressContext, progress: EncounterProgress): boolean {
  // Preview is genuinely memory-only: even reading another player's draft is forbidden.
  if (ctx.preview) return true;
  const key = keyFor(ctx);
  const storage = storageFor(ctx);
  if (!key || !storage || progress.revision !== ctx.encounter.revision) return false;
  try { storage.setItem(key, JSON.stringify(progress)); return true; } catch { return false; }
}
