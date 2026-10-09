/** cgo-094 · Local class purpose, independent of the account-owned class mirror.
 * Changes aggregation only: attempts, XP and the test class's own wall stay intact.
 * Future leaderboards (cgo-068) must use the same regular-class restriction.
 */
import { and, eq, inArray, sql } from "drizzle-orm";
import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Db } from "./index.ts";
import { classSettings, v2, v2Classes } from "./schema.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

// A projection of the existing table, NOT another database table. Drizzle's
// INSERT SELECT requires every declared column. Keep the pre-0023 purpose writer
// on its original three columns so it still works before the additive migration.
const purposeSettings = v2.table("class_settings", {
  classId: uuid("class_id").primaryKey(),
  purpose: text("purpose").notNull().default("regular"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ClassPurpose = "regular" | "test";
export class ClassSettingsForbiddenError extends Error {
  constructor() { super("class_settings_forbidden"); }
}

/** Scope first, including the defaults: never return even a default for foreign ids.
 * Compatibility fallback required by cgo-094: unreadable/not-yet-migrated settings
 * mean all regular, exactly as before deployment. This is NOT an authorization
 * fallback; the session scope and ownership walls never degrade. No error details
 * or identities are logged, and an ordinary dashboard read stays successful.
 */
export async function getClassPurposes(db: Db, classScope: ClassScope, classIds: readonly string[]): Promise<Map<string, ClassPurpose>> {
  const ids = [...new Set(classIds.filter((id) => inScope(classScope, id)))];
  const purposes = new Map<string, ClassPurpose>(ids.map((id) => [id, "regular"]));
  if (ids.length === 0) return purposes;
  try {
    const rows = await db.select({ classId: classSettings.classId, purpose: classSettings.purpose })
      .from(classSettings)
      .where(and(inArray(classSettings.classId, [...classScope]), inArray(classSettings.classId, ids)));
    for (const row of rows) if (purposes.has(row.classId) && row.purpose === "test") purposes.set(row.classId, "test");
  } catch {
    // Before migration 0021 (or during a read outage): retain the regular defaults.
  }
  return purposes;
}

/** Grandmaster status is a server decision, never a field from the request body.
 * INSERT … SELECT keeps scope + owner authorization and the upsert in ONE SQL
 * statement, including repeated toggles. No class row or learning data is written.
 * Failed writes throw; a missing migration can never be reported as saved.
 */
export async function setClassPurpose(db: Db, classScope: ClassScope, classId: string, teacherId: string, purpose: ClassPurpose, grandmaster = false): Promise<void> {
  assertWritableScope(classScope, "setClassPurpose");
  if (!inScope(classScope, classId) || !teacherId) throw new ClassSettingsForbiddenError();
  if (purpose !== "regular" && purpose !== "test") throw new TypeError("invalid_class_purpose");
  const changed = await db.insert(purposeSettings).select(
    db.select({ classId: v2Classes.id, purpose: sql<string>`${purpose}`.as("purpose"), updatedAt: sql<Date>`now()`.as("updated_at") })
      .from(v2Classes)
      .where(and(inArray(v2Classes.id, [...classScope]), eq(v2Classes.id, classId), grandmaster ? undefined : eq(v2Classes.teacherId, teacherId))),
  ).onConflictDoUpdate({ target: purposeSettings.classId, set: { purpose, updatedAt: new Date() } })
    .returning({ classId: purposeSettings.classId });
  if (changed.length === 0) throw new ClassSettingsForbiddenError();
}

export interface ClassLeaderboardSettings { leaderboard: boolean; gradeBoardOptIn: boolean }

/** Fail closed before 0023. Even defaults are restricted to the session's classes. */
export async function getClassLeaderboardSettings(db: Db, classScope: ClassScope, classId: string): Promise<ClassLeaderboardSettings> {
  const off = { leaderboard: false, gradeBoardOptIn: false };
  if (!inScope(classScope, classId)) return off;
  try {
    const [row] = await db.select({ leaderboard: classSettings.leaderboard, gradeBoardOptIn: classSettings.gradeBoardOptIn })
      .from(classSettings).where(and(inArray(classSettings.classId, [...classScope]), eq(classSettings.classId, classId)));
    return row ?? off;
  } catch { return off; }
}

/** One owner+scope+purpose guarded SQL. A off also revokes B. No student writer. */
export async function setClassLeaderboardSettings(db: Db, classScope: ClassScope, classId: string, teacherId: string, settings: ClassLeaderboardSettings, grandmaster = false): Promise<void> {
  assertWritableScope(classScope, "setClassLeaderboardSettings");
  if (!inScope(classScope, classId) || !teacherId) throw new ClassSettingsForbiddenError();
  if (typeof settings.leaderboard !== "boolean" || typeof settings.gradeBoardOptIn !== "boolean"
    || (!settings.leaderboard && settings.gradeBoardOptIn)) throw new TypeError("invalid_leaderboard_settings");
  const { leaderboard, gradeBoardOptIn } = settings;
  const changed = await db.insert(classSettings).select(
    db.select({ classId: v2Classes.id, purpose: sql<string>`'regular'`.as("purpose"),
      leaderboard: sql<boolean>`${leaderboard}`.as("leaderboard"), gradeBoardOptIn: sql<boolean>`${gradeBoardOptIn}`.as("grade_board_opt_in"), updatedAt: sql<Date>`now()`.as("updated_at") })
      .from(v2Classes).leftJoin(classSettings, eq(classSettings.classId, v2Classes.id))
      .where(and(inArray(v2Classes.id, [...classScope]), eq(v2Classes.id, classId), grandmaster ? undefined : eq(v2Classes.teacherId, teacherId),
        sql`${v2Classes.archivedAt} is null`, sql`coalesce(${classSettings.purpose}, 'regular') = 'regular'`)),
  ).onConflictDoUpdate({ target: classSettings.classId, set: { leaderboard, gradeBoardOptIn, updatedAt: new Date() },
    setWhere: eq(classSettings.purpose, "regular") }).returning({ classId: classSettings.classId });
  if (changed.length === 0) throw new ClassSettingsForbiddenError();
}
