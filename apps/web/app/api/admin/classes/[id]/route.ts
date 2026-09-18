/**
 * GET-less route for one class — since dach-018 it only says where the buttons went.
 *
 * PATCH renamed a class, DELETE archived it, POST { action: "unarchive" } brought
 * it back. All three wrote `classes.name` or `classes.archived_at`, and after the
 * switch-over those columns have exactly ONE writer: the account service, through
 * /api/konto/class-term (SPEC §10 E1, B1-5). Archiving in DomiGo alone would have
 * been the worst of the three — it would have locked the class here while the
 * account service happily kept signing the children in.
 *
 * Each method answers 405 with the address of the Lehrer-Raum, so a stale tab
 * learns where to go instead of appearing to work.
 */
import { NextResponse } from "next/server";
import { kontoBaseUrl } from "@/lib/konto/basis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function umgezogen(): Response {
  return NextResponse.json(
    { ok: false, error: "moved", lehrerraum: `${kontoBaseUrl()}/lehrerraum/lehrgruppen` },
    { status: 405 },
  );
}

export async function PATCH(): Promise<Response> {
  return umgezogen();
}

export async function POST(): Promise<Response> {
  return umgezogen();
}

export async function DELETE(): Promise<Response> {
  return umgezogen();
}
