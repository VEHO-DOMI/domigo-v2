/** cgo-094 · Local class purpose, independent of the account-owned class mirror.
 * Changes aggregation only: attempts, XP and the test class's own wall stay intact.
 * Future leaderboards (cgo-068) must use the same regular-class restriction.
 */
import { and, eq, inArray, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { classSettings, v2Classes } from "./schema.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

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
  const changed = await db.insert(classSettings).select(
    db.select({ classId: v2Classes.id, purpose: sql<string>`${purpose}`.as("purpose"), updatedAt: sql<Date>`now()`.as("updated_at") })
      .from(v2Classes)
      .where(and(inArray(v2Classes.id, [...classScope]), eq(v2Classes.id, classId), grandmaster ? undefined : eq(v2Classes.teacherId, teacherId))),
  ).onConflictDoUpdate({ target: classSettings.classId, set: { purpose, updatedAt: new Date() } })
    .returning({ classId: classSettings.classId });
  if (changed.length === 0) throw new ClassSettingsForbiddenError();
}
