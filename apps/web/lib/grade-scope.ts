/**
 * P1 · GRADE SCOPING — which school years a viewer may see (Koki's ruling
 * P-R1.5: "a registered child only has access to the class it was created in").
 * Before this, /practice, /learn, /listening and /tests each hard-coded
 * `[1, 2, 3, 4]` and showed every child all four years (drift D10).
 *
 * The decision is a PURE function (`visibleGradesFor`) so it is unit-testable
 * without a DB; `resolveVisibleGrades` is the thin DB wrapper around it.
 *
 * ONE rule, one meaning for `null` — and dach-018 CHANGED it. Until the switch
 * to the account service, no resolvable class meant ALL four years: showing too
 * much was a cosmetic miss, while showing nothing would have been a dead page
 * for a child who did nothing wrong (P-R1.5). That reasoning is spent. A session
 * that reaches this code now always came through konto, and a child without a
 * class never gets a session at all — they see the access card instead
 * (app/zugriff-fehlt). So no class now means NO year, not every year: the one
 * case the old fallback protected cannot occur any more, and what remains of it
 * would be a hole in the class wall rather than a kindness.
 *
 * A DB hiccup while resolving a KNOWN class still degrades to all four years:
 * that is a different case, and there the old argument still holds.
 *
 * Deliberately free of `@/…` path aliases: apps/web's suite runs under plain
 * `node --test`, which resolves real packages (@domigo/db, cf. lib/checkup.ts)
 * but NOT Next's tsconfig aliases.
 */
import { getClassGrade, getDb, type ClassScope } from "@domigo/db";

/** The Austrian AHS lower cycle — the full, unscoped view. */
export const ALL_GRADES = [1, 2, 3, 4] as const;

/**
 * The school year a unit slug belongs to ("g4-u01" → 4), or null when the slug
 * carries no year. Every corpus surface (practice/learn/listening/tests) names
 * its units this way; the list pages already filter with the same `g<n>-` prefix.
 */
export function gradeOfSlug(slug: string): number | null {
  const m = /^g([1-4])-/.exec(slug);
  return m ? Number(m[1]) : null;
}

/**
 * THE decision. A resolved class year narrows the view to exactly that year;
 * `null` (teacher / no player / unresolvable) opens all four. Returns a fresh
 * array so a caller can never mutate ALL_GRADES.
 */
export function visibleGradesFor(classGrade: number | null): number[] {
  if (classGrade === null) return [...ALL_GRADES];
  return [classGrade];
}

/**
 * May this slug be opened under `grades`? A slug with NO year (a hypothetical
 * un-numbered unit) is always allowed — the scope hides other YEARS, it must
 * never hide content it cannot classify.
 */
export function isSlugAllowed(slug: string, grades: readonly number[]): boolean {
  const g = gradeOfSlug(slug);
  return g === null || grades.includes(g);
}

/**
 * The years this viewer may see. `classId` comes from the session (or the
 * non-prod dev identity); a teacher carries none. Every failure path — no
 * class, class absent in v1 AND v2, DB unreachable — lands on ALL_GRADES, so
 * this function cannot produce an empty page.
 */
export async function resolveVisibleGrades(classScope: ClassScope, classId: string | null | undefined): Promise<number[]> {
  // dach-018 · no class is no longer ALL four years (see the header).
  if (!classId) return [];
  let grade: number | null = null;
  try {
    grade = await getClassGrade(getDb(), classScope, classId);
  } catch {
    /* DB hiccup — degrade to the full view, never to an empty one */
  }
  return visibleGradesFor(grade);
}
