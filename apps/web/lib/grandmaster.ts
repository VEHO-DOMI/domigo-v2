/**
 * P3 · THE GRANDMASTER RANK — the platform operator's extra reach.
 *
 * DomiGo knows two roles ('student' | 'teacher') and authorization IS the WHERE
 * clause: every teacher read/write is scoped by `teacherId`, so one teacher can
 * never see another's class (class-service.ts / roster-service.ts). Koki runs the
 * platform from a distance without a class of his own, so he needs a THIRD reach:
 * see every class, and manage/test in any of them.
 *
 * The rank lives in an ENV VAR, not a database column, and that is the whole
 * security argument: no application write path can reach an env var. No bug and
 * no compromised endpoint can grant the rank — it is a guardrail by construction,
 * not a permission that has to be defended. It also needs no migration and can be
 * switched on in production by setting the variable and redeploying.
 *
 * A grandmaster IS role='teacher' (middleware and every existing surface stay
 * exactly as they were); the rank only UNLOCKS extra surfaces. Every one of them
 * checks `isGrandmaster` SERVER-SIDE BEFORE any database access — hiding a link in
 * the UI is convenience, never the security.
 *
 * Deliberately import-free (and free of `@/…` aliases): apps/web's suite runs under
 * plain `node --test`, which does not resolve Next's tsconfig aliases (cf. lib/grade-scope.ts).
 */

/** The env var carrying the allowlist — named once, so a typo is one place, not five. */
export const GRANDMASTER_ENV_VAR = "GRANDMASTER_TEACHER_IDS";

/**
 * The allowlisted teacher ids, parsed from a comma-separated list: entries are
 * trimmed, blanks dropped (so "a,,b" and a trailing comma are harmless) and
 * lower-cased — a uuid pasted in upper case is the SAME id, and a rank that
 * depended on the case of a paste would be a trap. Unset or empty ⇒ an EMPTY
 * list, i.e. nobody is a grandmaster (fail closed).
 */
export function grandmasterIds(): string[] {
  const raw = process.env[GRANDMASTER_ENV_VAR] ?? "";
  return raw
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter((id) => id !== "");
}

/**
 * Is this user the platform operator? Read FRESH on every call (never cached at
 * module load) so emptying the variable and restarting really does close the door —
 * a cached list would make that tamper pass by luck instead of by construction.
 *
 * An empty `userId` is never a grandmaster, whatever the list says: an unresolved
 * identity must not fall into the rank through a blank-matches-blank hole.
 */
export function isGrandmaster(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return grandmasterIds().includes(userId.trim().toLowerCase());
}
