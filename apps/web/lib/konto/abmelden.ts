/**
 * dach-074 · WHERE "Sign out" leads — the decision, without the session.
 *
 * Ending only DomiGo's own session leaves konto's standing: on a shared device
 * the next child presses "Sign in with Lauter Einser" and is in the previous
 * child's account without typing anything. A session that came through konto
 * (via = konto-handoff) therefore goes on to konto's /logout, which ends the
 * konto session, calls the back-channels and sends the browser back here.
 * PIN sessions — and every cookie from before the adapter — stay as they were:
 * they end here and land on the start page. Model: srdp #577 lib/konto/signout.ts.
 *
 * konto accepts as `return` only the exact host of one of its apps; ours is the
 * `eng-us` entry of app/le-werkzeuge.json — read, never typed (the gate
 * check-umbrella-tokens forbids the address anywhere else).
 *
 * Its own file, free of next-auth, so the tests load it under plain node; the
 * server action in app/le/konto-aktion.ts calls it after signOut.
 */
import { werkzeugeFuer, EIGENES_WERKZEUG } from "../le-werkzeuge.ts";
import { kontoBaseUrl } from "./basis.ts";

/** Must equal KONTO_PROVIDER in auth.ts (which next-auth keeps out of the tests); rueckfall.test.ts compares the two. */
export const KONTO_VIA = "konto-handoff";

/** DomiGo's own public address, as konto knows it — with the trailing slash. */
export function eigeneAdresse(): string {
  const eigen = werkzeugeFuer("student").find((w) => w.id === EIGENES_WERKZEUG);
  if (!eigen) throw new Error(`[konto] no \`${EIGENES_WERKZEUG}\` entry in le-werkzeuge.json`);
  return `${eigen.adresse.replace(/\/+$/, "")}/`;
}

export function abmeldeZiel(
  via: string | null | undefined,
  basis: string = kontoBaseUrl(),
  rueckkehr: string = eigeneAdresse(),
): string {
  if (via !== KONTO_VIA) return "/";
  const u = new URL(`${basis.replace(/\/+$/, "")}/logout`);
  u.searchParams.set("return", rueckkehr);
  return u.toString();
}
