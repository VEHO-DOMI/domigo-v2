/**
 * PATCH/POST/DELETE /api/admin/classes/[id] — rename, un-archive, archive a class.
 *
 * dach-108 · all three answer 405 with the address of the Lehrer-Raum, always
 * (lib/konto/klassen-antwort.ts), before any session is read: `classes.name` and
 * `classes.archived_at` have ONE writer, the account service (SPEC §10 E1, B1-5).
 * Archiving here alone would lock the class in DomiGo while konto kept signing
 * the children in; a rename would be undone by the nightly sync.
 */
import { lokalesSchreibenZu } from "@/lib/konto/klassen-antwort";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function PATCH(): Response {
  return lokalesSchreibenZu();
}

export function POST(): Response {
  return lokalesSchreibenZu();
}

export function DELETE(): Response {
  return lokalesSchreibenZu();
}
