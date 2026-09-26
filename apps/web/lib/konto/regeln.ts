/**
 * dach-108 · THE FIXED RULES of sign-in — no date, no switch-over.
 *
 * Koki 19.09. (E-3, »Tabula rasa«): DomiGo signs nobody in itself any more.
 * The only way in is the account at Lauter Einser (konto); the machine lane
 * `ops-link` and the dev identities are the declared leftovers in
 * konto-local-login-allowlist.json. Until this PR everything below hung on one
 * date and flipped at midnight; now the state that date would have produced is
 * simply how it is. Nothing here reads a clock.
 *
 * Edge-safe (strings only): auth.ts reads this, middleware imports auth.ts.
 */
import { kontoBaseUrl, kontoBeitrittUrl } from "./basis.ts";

/** The sentence every local class/roster writer answers with (lib/konto/klassen-antwort.ts). */
export const GESCHLOSSEN_SATZ =
  "Klassen und Klassenlisten pflegst du im Lehrerzimmer von Lauter Einser.";

/**
 * What the jwt callback does with a session, by the door it came through:
 *   konto  — the handoff session: konto is asked every minute.
 *   rest   — a declared leftover (allowlist); that provider's own limits apply.
 *   tot    — return null: this cookie is no session.
 *
 * A cookie without `via` was minted by DomiGo's own PIN sign-in, which no
 * longer exists — it is no session. So is every provider the allowlist does
 * not name (`student`, `teacher`, anything invented).
 */
export function sitzungsRegel(
  via: string | null,
  kontoProvider: string,
  zulaessig: (provider: string) => boolean,
): "konto" | "rest" | "tot" {
  if (via === kontoProvider) return "konto";
  if (via === null) return "tot";
  return zulaessig(via) ? "rest" : "tot";
}

/** Where /lehrkraft/<token> leads: app/lehrkraft/umgezogen/page.tsx. */
export const EINLADUNG_UMGEZOGEN = "/lehrkraft/umgezogen";

/** The five old doors that took a PIN (scripts/check-no-local-login.mjs, TUEREN). */
export type Tuer = "join" | "lehrkraft" | "pin-reset" | "pin-vergessen" | "bootstrap";

/**
 * Where an old door leads — always. The page answers with `redirect()`, a 307.
 * NEVER 308: a browser remembers a permanent redirect for good, and a
 * remembered jump would outlive any address konto might ever move to.
 */
export function tuerZiel(tuer: Tuer, code: string): string {
  if (tuer === "join") return kontoBeitrittUrl(code);
  // An old teacher invitation names a class that konto does not know by this
  // token; landing on konto's sign-in without a word left teachers guessing
  // (GG 19.09., NEBEN-3). Our own page says why, then offers the sign-in.
  if (tuer === "lehrkraft") return EINLADUNG_UMGEZOGEN;
  return `${kontoBaseUrl()}/login?app=go`;
}
