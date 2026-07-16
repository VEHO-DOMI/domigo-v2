/**
 * Hinweis-Funken — the Keen game's hint currency. Glühwörter collected in a
 * level become sparks; sparks buy hints. SERVER-AUTHORITATIVE: the balance
 * lives on user_progress (drizzle/0012), never in the wipeable cosmetic game
 * save, and the upsert clamps the result ≥0 in-statement so a spend can never
 * go negative. Unlike the `(db, …args)` services these are self-contained and
 * swallow errors IN-BAND (get → 0, add → -1): the game must keep playing when
 * the DB is down — including a missing DATABASE_URL, which is why getDb()
 * lives inside the try, not with the caller.
 */
import { eq, sql } from "drizzle-orm";
import { userProgress } from "./schema.ts";
import { getDb } from "./index.ts";

/** Current spark balance for a user; 0 on ANY error (no row, DB down, no env). */
export async function getHintSparks(userId: string): Promise<number> {
  try {
    const rows = await getDb()
      .select({ sparks: userProgress.hintSparks })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    return rows[0]?.sparks ?? 0;
  } catch {
    return 0; // degraded: the HUD just shows an empty spark pouch
  }
}

/**
 * Add `delta` sparks (negative = spend a hint) and return the NEW balance.
 * The result is clamped ≥0 in-statement (GREATEST — race-safe, single round
 * trip); the row is created on first touch, mirroring recordAttempt's
 * user_progress upsert. Returns -1 on any error — the caller treats that as
 * degraded (never a 500 to the game).
 */
export async function addHintSparks(userId: string, delta: number): Promise<number> {
  try {
    const now = new Date();
    const rows = await getDb()
      .insert(userProgress)
      .values({ userId, hintSparks: Math.max(0, delta), updatedAt: now })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: {
          hintSparks: sql`GREATEST(0, ${userProgress.hintSparks} + ${delta})`,
          updatedAt: now,
        },
      })
      .returning({ sparks: userProgress.hintSparks });
    return rows[0]?.sparks ?? -1;
  } catch {
    return -1;
  }
}
