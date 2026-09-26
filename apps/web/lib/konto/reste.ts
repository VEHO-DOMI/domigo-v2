/**
 * dach-018 / dach-108 · THE DECLARED LEFTOVERS — read, never remembered.
 *
 * SPEC §6 allows a named few local sign-in paths beside konto. The list lives in
 * one JSON file so that the gate (scripts/check-no-local-login.mjs), the session
 * callback and a human reading the repo all consult the same sentence. Since
 * Koki's decision of 19.09. (E-8) no entry carries an end date: a leftover stays
 * until someone removes it from the list, never because a day has come.
 *
 * Edge-safe (JSON import + strings): auth.ts reads this, middleware imports
 * auth.ts. `with { type: "json" }` is what plain `node --test` requires — the
 * same reason lib/le-werkzeuge.ts does it.
 */
import liste from "../../konto-local-login-allowlist.json" with { type: "json" };

export type Rest = {
  provider: string;
  grund: string;
  dateien: string[];
};

export const RESTE: Rest[] = liste.reste as Rest[];

export function rest(provider: string): Rest | null {
  return RESTE.find((r) => r.provider === provider) ?? null;
}

/**
 * May a session from this provider exist? Only a declared leftover — SPEC §4.6
 * ends with "everything else: return null", and this is the function that says so.
 */
export function restZulaessig(provider: string): boolean {
  return rest(provider) !== null;
}
