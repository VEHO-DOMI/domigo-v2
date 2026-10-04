/**
 * Class lookups as an ORDERED DUAL-READ. v2-native (domigo_v2.classes,
 * writable) is queried FIRST; if it has no row we fall through to v1's
 * read-only mirror (public.classes). NEVER writes `public.*`. Keeps drizzle
 * out of the web app.
 */
import { eq } from "drizzle-orm";
import { v1Classes } from "./v1.ts";
import { v2Classes } from "./schema.ts";
import { pickIdentity } from "./identity.ts";
import type { Db } from "./index.ts";

// dach-167 · Die PIN-Anmeldung ist seit dach-108 entfernt; mit ihr gingen
// lookupStudentForAuth, lookupTeacherForAuth, lookupTeacherAuthById und
// allocateClassCode (alle ohne Aufrufer, PR 480). Uebrig bleibt die eine
// Doppel-Lesung, die noch jemand braucht: die Stufe einer Klasse.

/**
 * Run the v2-native half of a dual-read, degrading to `fallback` if the
 * domigo_v2 tables are unreachable (e.g. migrations not yet applied to this
 * deployment's database). The v1 mirror path must keep working REGARDLESS of
 * v2's state — 2026-07-12 incident: migration 0006 was merged but never applied
 * to prod, these queries threw before the v1 fallback could run, and every
 * sign-in (student AND teacher) on production died with "invalid credentials".
 * Deliberately one-sided: v1 queries stay unguarded — if the v1 mirror itself
 * is down, that's a real outage and MUST surface, not degrade.
 */
async function v2Safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(
      "[auth] v2 identity query failed — falling back to the v1 mirror:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
    return fallback;
  }
}

/**
 * Grade (1–4) of a class by id — for grade-aware surfaces (the session carries
 * classId, not grade). Dual-read: v2-native class first, then the v1 mirror.
 * Null if the class is absent in both.
 */
export async function getClassGrade(db: Db, classId: string): Promise<number | null> {
  const v2Rows = await v2Safe(
    () => db.select({ grade: v2Classes.grade }).from(v2Classes).where(eq(v2Classes.id, classId)).limit(1),
    [],
  );
  const v2Grade = v2Rows[0]?.grade ?? null;
  if (v2Grade != null) return v2Grade; // != null (not truthiness) so a 0 grade wouldn't fall through
  const rows = await db
    .select({ grade: v1Classes.grade })
    .from(v1Classes)
    .where(eq(v1Classes.id, classId))
    .limit(1);
  return pickIdentity(v2Grade, rows[0]?.grade ?? null);
}

