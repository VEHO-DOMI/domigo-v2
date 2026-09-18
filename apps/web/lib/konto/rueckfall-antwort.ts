/**
 * dach-074 · THE ONE ANSWER a local class writer gives once the day has come.
 *
 * Until the switch-over day a PIN teacher still creates, renames, archives and
 * unarchives classes and imports class lists here, exactly as on main. From
 * 00:00 Vienna that day every one of those routes answers 405 with the address
 * of the Lehrer-Raum — the adapter branch's answer — because from then on the
 * account service is the ONE writer of a class's name, grade, owner and
 * archive state (SPEC §10 E1), and a list imported here would create doubles
 * of children konto already knows.
 *
 * Its own file (the web-standard Response + strings — no next/server, no
 * next-auth, like the /api/konto routes) so the route tests can
 * load it under plain `node --test`; the routes call it BEFORE the session is
 * read, so the answer is the same for everyone.
 */
import { kontoBaseUrl } from "./basis.ts";
import { GESCHLOSSEN_SATZ, rueckfallOffen } from "./rueckfall.ts";

export function lokalesSchreibenZu(now: Date = new Date()): Response | null {
  if (rueckfallOffen(now)) return null;
  return Response.json(
    { ok: false, error: "moved", satz: GESCHLOSSEN_SATZ, lehrerraum: `${kontoBaseUrl()}/lehrerraum/lehrgruppen` },
    { status: 405 },
  );
}
