/**
 * P1 · GRADE SCOPING — which school years a viewer may see (Koki's ruling
 * P-R1.5: "a registered child only has access to the class it was created in").
 * Before this, /practice, /learn, /listening and /tests each hard-coded
 * `[1, 2, 3, 4]` and showed every child all four years (drift D10).
 *
 * The decision is a PURE function (`visibleGradesFor`) so it is unit-testable
 * without a DB; `resolveVisibleGrades` is the thin DB wrapper around it.
 *
 * ONE rule, one meaning for `null`: teacher, no player, or a grade we could not
 * resolve (a DB hiccup) ⇒ ALL four years. That is a DELIBERATE degradation —
 * showing too much is a cosmetic miss, showing NOTHING would be a dead page for
 * a child who did nothing wrong. Sign-in itself is not this file's job: the
 * middleware owns the session gate (apps/web/middleware.ts), so a list page
 * never redirects on a missing session.
 *
 * Deliberately free of `@/…` path aliases: apps/web's suite runs under plain
 * `node --test`, which resolves real packages (@domigo/db, cf. lib/checkup.ts)
 * but NOT Next's tsconfig aliases.
 */
import { getClassGrade, getDb } from "@domigo/db";

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
export async function resolveVisibleGrades(classId: string | null | undefined): Promise<number[]> {
  if (!classId) return visibleGradesFor(null);
  let grade: number | null = null;
  try {
    grade = await getClassGrade(getDb(), classId);
  } catch {
    /* DB hiccup — degrade to the full view, never to an empty one */
  }
  return visibleGradesFor(grade);
}
