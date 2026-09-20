/**
 * dach-108 · THE ONE ANSWER a local class writer gives — always.
 *
 * Classes and class lists are kept at Lauter Einser (konto) alone: it is the one
 * writer of a class's name, grade, owner and archive state (SPEC §10 E1), and a
 * list imported here would create doubles of children konto already knows. So
 * every create, rename, archive, unarchive and roster import route answers 405
 * with the sentence and the address of the Lehrer-Raum.
 *
 * Its own file (the web-standard Response + strings — no next/server, no
 * next-auth, like the /api/konto routes) so the tests can load it under plain
 * `node --test`.
 */
import { kontoBaseUrl } from "./basis.ts";
import { GESCHLOSSEN_SATZ } from "./regeln.ts";

export function lokalesSchreibenZu(): Response {
  return Response.json(
    { ok: false, error: "moved", satz: GESCHLOSSEN_SATZ, lehrerraum: `${kontoBaseUrl()}/lehrerraum/lehrgruppen` },
    { status: 405 },
  );
}
