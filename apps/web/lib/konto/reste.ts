/**
 * dach-018 · THE DECLARED LEFTOVERS — read, never remembered.
 *
 * SPEC §6 allows a named few local sign-in paths to outlive the switch-over,
 * each with a FIXED end date computed from the switch-over day. The list lives
 * in one JSON file so that the gate (scripts/check-no-local-login.mjs), the
 * session callback and a human reading the repo all consult the same sentence.
 * The date is not derived here on purpose: a leftover whose expiry silently
 * moved with a constant would never expire.
 *
 * Edge-safe (JSON import + strings): auth.ts reads this, middleware imports
 * auth.ts. `with { type: "json" }` is what plain `node --test` requires — the
 * same reason lib/le-werkzeuge.ts does it.
 */
import liste from "../../konto-local-login-allowlist.json" with { type: "json" };
import { wienerTag } from "./umstieg.ts";

export type Rest = {
  provider: string;
  grund: string;
  ablauf: string;
  dateien: string[];
  /**
   * dach-074 · a FALLBACK entry (student, teacher) ends ON its date, not after
   * it: `ablauf` is the switch-over day itself, and at 00:00 Vienna that day
   * the PIN is over. The 90-day leftovers keep their inclusive last day.
   */
  rueckfall?: boolean;
};

export const RESTE: Rest[] = liste.reste as Rest[];
export const ALLOWLIST_UMSTIEGSTAG: string = liste.umstiegstag;

export function rest(provider: string): Rest | null {
  return RESTE.find((r) => r.provider === provider) ?? null;
}

/**
 * May a session from this provider still exist? Unknown providers are NOT
 * leftovers — SPEC §4.6 ends with "everything else: return null", and this is
 * the function that says so.
 */
export function restGueltig(provider: string, now: Date = new Date()): boolean {
  const r = rest(provider);
  if (!r) return false;
  return r.rueckfall === true ? wienerTag(now) < r.ablauf : wienerTag(now) <= r.ablauf;
}
