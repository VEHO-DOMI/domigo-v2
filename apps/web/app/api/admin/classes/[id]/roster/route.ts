/**
 * POST /api/admin/classes/[id]/roster — import a pasted class list.
 *
 * dach-108 · answers 405 with the address of the Lehrer-Raum, always
 * (lib/konto/klassen-antwort.ts), before any session is read: the children come
 * from konto (Schulliste → Lehrgruppe), and a list imported here would create a
 * second, unlinked copy of every child.
 */
import { lokalesSchreibenZu } from "@/lib/konto/klassen-antwort";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(): Response {
  return lokalesSchreibenZu();
}
