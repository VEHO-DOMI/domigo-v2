/**
 * dach-074 · THE FALLBACK — the old way in stays open until the switch-over day.
 *
 * On 18.09. the adapter was merged by mistake (#448). It REMOVED the PIN sign-in,
 * and because nobody had a konto account linked to DomiGo yet, nobody could sign
 * in for two hours (revert #450). A merge must never lock anyone out again.
 *
 * So the konto button is there from the merge on, and everything the old way
 * needs stays beside it — hanging on ONE date. At 00:00 Vienna on UMSTIEGSTAG
 * all of it closes at once: the two PIN providers refuse, sessions DomiGo
 * minted itself (student, teacher, and every cookie from before this PR, which
 * carries no `via` at all) stop being sessions, the forms stop rendering, the
 * five old doors redirect (307) to konto, and the local class writers refuse.
 * From that minute on everything behaves exactly like the adapter branch.
 * Nobody has to remember to remove anything, and nothing can be forgotten
 * half-removed. Model: srdp-practice lib/konto/rueckfall.ts.
 *
 * The cut is EXCLUSIVE: the 12th is the last fallback day; on the 13th at
 * 00:01 the PIN no longer works. (`restGueltig` counts the 90-day leftovers
 * inclusively; the two fallback entries carry `rueckfall: true` for that
 * reason — see lib/konto/reste.ts.)
 *
 * Edge-safe (strings + the Intl clock): auth.ts reads this, middleware imports
 * auth.ts. Every function takes `now`, so the tests set the clock instead of
 * waiting for October.
 */
import { UMSTIEGSTAG, wienerTag } from "./umstieg.ts";
import { kontoBaseUrl, kontoBeitrittUrl } from "./basis.ts";

/** The two providers of the fallback — declared in konto-local-login-allowlist.json. */
export const RUECKFALL_PROVIDER = ["student", "teacher"] as const;

/** The sentence every local class/roster writer answers with once the day has come. */
export const GESCHLOSSEN_SATZ =
  "Klassen und Klassenlisten pflegst du im Lehrerzimmer von Lauter Einser.";

/** True while the old PIN sign-in and the local class writers still work. */
export function rueckfallOffen(now: Date = new Date()): boolean {
  return wienerTag(now) < UMSTIEGSTAG;
}

/**
 * For the server actions and routes that write locally. They are reachable by
 * anyone with the form, so the date is checked on the SERVER, not only by
 * hiding the form: a tab left open across midnight must not still write.
 */
export function assertRueckfallOffen(now: Date = new Date()): void {
  if (!rueckfallOffen(now)) throw new Error(GESCHLOSSEN_SATZ);
}

/**
 * What the jwt callback does with a session, by the door it came through:
 *   konto  — the handoff session: konto is asked every minute (unchanged).
 *   rest   — let it live; the provider's own limits apply.
 *   tot    — return null: this cookie is no longer a session.
 *
 * `via` is null on every cookie minted before this PR. Until the day those
 * cookies ARE PIN sessions (the incident of 18.09. was exactly them being
 * thrown out); from the day on they are nothing, as on the adapter branch.
 */
export function sitzungsRegel(
  via: string | null,
  now: Date,
  kontoProvider: string,
  restGueltig: (provider: string, now: Date) => boolean,
): "konto" | "rest" | "tot" {
  if (via === kontoProvider) return "konto";
  if (via === null) return rueckfallOffen(now) ? "rest" : "tot";
  return restGueltig(via, now) ? "rest" : "tot";
}

/**
 * Does this session need a scope built from the database instead of from konto
 * claims? Only a PIN session (student/teacher provider, or a pre-adapter cookie
 * without `via`) while the fallback is open. A konto session, the ops machine
 * lane and — after the day — everything else keep the claims-only rule.
 */
export function pinScopeArt(
  via: string | null,
  role: string,
  now: Date = new Date(),
): "kind" | "lehrkraft" | null {
  if (!rueckfallOffen(now)) return null;
  if (via !== null && via !== "student" && via !== "teacher") return null;
  return role === "teacher" ? "lehrkraft" : "kind";
}

/** The five old doors that took a PIN (scripts/check-no-local-login.mjs, TUEREN). */
export type Tuer = "join" | "lehrkraft" | "pin-reset" | "pin-vergessen" | "bootstrap";

/**
 * Where an old door leads. `null` before the day: the page renders exactly as
 * on main. From the day on: konto — the page answers with `redirect()`, a 307.
 * NEVER 308: a browser remembers a permanent redirect for good, and a
 * remembered jump would outlive any fallback we might ever need again.
 */
export function tuerZiel(tuer: Tuer, code: string, now: Date = new Date()): string | null {
  if (rueckfallOffen(now)) return null;
  if (tuer === "join") return kontoBeitrittUrl(code);
  return `${kontoBaseUrl()}/login?app=go`;
}
