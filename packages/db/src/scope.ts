/**
 * dach-018 · THE CLASS SCOPE — the first wall in front of every class query.
 *
 * Until the switch to the account service, DomiGo had no class wall at all: a
 * teacher's reads were narrowed by her own `teacherId`, and four grandmaster
 * functions were narrowed by nothing. The account service now issues, per
 * session, the list of class ids that session may see (SPEC konto V1.1-FINAL §5
 * L3). This module is the type that list travels in.
 *
 * WHY A BRAND, HONESTLY. `ClassScope` cannot prove where its ids came from —
 * `classScope([params.id])` type-checks and is exactly the hole this card
 * exists to close. What the brand buys is that `classScope(` becomes a FINITE,
 * GREPPABLE construction site, so scripts/check-claim-filter.mjs can enforce the
 * provenance rule (`classScope(` may appear in apps/web only inside
 * lib/identity.ts). Brand and sweep are one control in two halves; neither is
 * worth much alone.
 *
 * WHY FALSY IDS ARE DROPPED. Several call sites read `session.user.classId ?? ""`
 * (e.g. apps/web/app/home/page.tsx). Passed through naively that would build a
 * scope of `[""]` — non-empty, therefore NOT the fail-closed path, and the
 * emptiest session in the system would look like a legitimate one. Same reflex as
 * apps/web/lib/grandmaster.ts, which fails closed on a blank userId.
 *
 * WHY AN EMPTY SCOPE NEEDS NO GUARD CLAUSE. Measured on drizzle-orm 0.45.2
 * (dach-018, 2026-09-17): `inArray(col, [])` compiles to the literal `false` —
 * `where (false and "…"."user_id" = $1)` — for select, update AND delete. So
 * "empty scope ⇒ empty result" is true by SQL construction, not by convention.
 * Two consequences the gate enforces:
 *   · the wall is NEVER written in negative form: `notInArray(col, [])` compiles
 *     to `true`, which turns an empty scope into see-everything;
 *   · a WRITE reached with an empty scope is a programming error, not a no-op —
 *     `where false` changes zero rows and every one of these functions reports
 *     that as success. Write paths call `assertWritableScope` and throw.
 * (The comment at class-progress.ts:100-107 — "inArray with no values renders
 * IN (), which is a syntax error" — is stale; it described an older drizzle.)
 */

declare const CLASS_SCOPE: unique symbol;

/** The class ids a session may see. Built only by apps/web/lib/identity.ts. */
export type ClassScope = readonly string[] & { readonly [CLASS_SCOPE]: true };

/**
 * The one constructor. Drops blank ids (see header) and de-duplicates, so a
 * scope is always a clean set and `scope.length === 0` means exactly one thing:
 * this session may see nothing.
 */
export function classScope(ids: readonly (string | null | undefined)[]): ClassScope {
  const clean = [...new Set(ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0))];
  return clean as unknown as ClassScope;
}

/** No class at all. The honest answer for a session without a resolved class. */
export const EMPTY_SCOPE: ClassScope = classScope([]);

/** True when this scope contains the class — for guards outside a query. */
export function inScope(scope: ClassScope, classId: string | null | undefined): boolean {
  return typeof classId === "string" && scope.includes(classId);
}

/**
 * Write paths call this first. A write under an empty scope would silently
 * change zero rows and return a tidy success object — the defect class
 * writing-review.ts:236-239 names: "a programming error that returns a tidy
 * result object is a programming error nobody finds."
 */
export function assertWritableScope(scope: ClassScope, was: string): void {
  if (scope.length === 0) {
    throw new Error(`[@domigo/db] ${was}: refused — this session has no class scope (dach-018)`);
  }
}
