/**
 * Track C game saves — cosmetic state persistence with last-write-wins on
 * `clientRev`. The save carries NO authoritative progression (XP/streak/unlocks/
 * zone-clear all derive from the attempts ledger), so a lost/clobbered save costs
 * only cursor position. The LWW resolution is a pure function (`resolveGameSave`)
 * so it unit-tests without Neon, mirroring streak.ts / studypath.ts.
 */
import { and, eq, sql } from "drizzle-orm";
import { gameSaves } from "./schema.ts";
import type { Db } from "./index.ts";

/** Cosmetic game state — opaque to the server, shape owned per grade by game-core. */
export type GameSaveState = Record<string, unknown>;

/** Hard cap enforced at the endpoint; keeps a runaway client from bloating the row. */
export const MAX_GAME_SAVE_BYTES = 64 * 1024;

export interface GameSaveRow {
  gameMode: string;
  schemaVersion: number;
  clientRev: number;
  state: GameSaveState;
}

export interface GameSaveInput {
  userId: string;
  classId: string;
  gameMode: string; // "game:g1".."game:g4"
  schemaVersion: number;
  clientRev: number;
  state: GameSaveState;
}

/**
 * Pure LWW: the incoming write wins iff its `clientRev` is >= the stored one
 * (ties favor the newer payload — same rev re-PUT is idempotent). Returns the
 * row that should be persisted/returned. `existing:null` → always take incoming.
 */
export function resolveGameSave(
  existing: GameSaveRow | null,
  incoming: { gameMode: string; schemaVersion: number; clientRev: number; state: GameSaveState },
): GameSaveRow {
  if (!existing) return { ...incoming };
  return incoming.clientRev >= existing.clientRev ? { ...incoming } : existing;
}

/** The serialized byte size of a candidate state (UTF-8) — for the endpoint cap. */
export function gameSaveStateBytes(state: GameSaveState): number {
  return Buffer.byteLength(JSON.stringify(state), "utf8");
}

/** Current save for (user, game), or null. */
export async function getGameSave(db: Db, userId: string, gameMode: string): Promise<GameSaveRow | null> {
  const rows = await db
    .select({
      gameMode: gameSaves.gameMode,
      schemaVersion: gameSaves.schemaVersion,
      clientRev: gameSaves.clientRev,
      state: gameSaves.state,
    })
    .from(gameSaves)
    .where(and(eq(gameSaves.userId, userId), eq(gameSaves.gameMode, gameMode)))
    .limit(1);
  const r = rows[0];
  return r ? { gameMode: r.gameMode, schemaVersion: r.schemaVersion, clientRev: r.clientRev, state: r.state as GameSaveState } : null;
}

/**
 * Upsert with clientRev LWW done in-statement (single round-trip, race-safe):
 * on conflict, only overwrite state/schemaVersion when the incoming rev is >=
 * the stored rev; clientRev becomes the max. Returns the resulting row, so a
 * stale write gets the authoritative state back to reconcile against.
 */
export async function upsertGameSave(db: Db, a: GameSaveInput): Promise<GameSaveRow> {
  const now = new Date();
  const rows = await db
    .insert(gameSaves)
    .values({
      userId: a.userId,
      classId: a.classId,
      gameMode: a.gameMode,
      schemaVersion: a.schemaVersion,
      clientRev: a.clientRev,
      state: a.state,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [gameSaves.userId, gameSaves.gameMode],
      set: {
        state: sql`CASE WHEN ${a.clientRev} >= ${gameSaves.clientRev} THEN ${JSON.stringify(a.state)}::jsonb ELSE ${gameSaves.state} END`,
        schemaVersion: sql`CASE WHEN ${a.clientRev} >= ${gameSaves.clientRev} THEN ${a.schemaVersion} ELSE ${gameSaves.schemaVersion} END`,
        clientRev: sql`GREATEST(${gameSaves.clientRev}, ${a.clientRev})`,
        updatedAt: now,
      },
    })
    .returning({
      gameMode: gameSaves.gameMode,
      schemaVersion: gameSaves.schemaVersion,
      clientRev: gameSaves.clientRev,
      state: gameSaves.state,
    });
  const r = rows[0]!;
  return { gameMode: r.gameMode, schemaVersion: r.schemaVersion, clientRev: r.clientRev, state: r.state as GameSaveState };
}
