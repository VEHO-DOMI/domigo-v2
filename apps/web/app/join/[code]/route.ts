/**
 * dach-018 · /join/<code> — a printed class code still leads somewhere.
 *
 * Until the switch-over this route WAS the onboarding: it read the class by its
 * invite code, listed the children who had not signed up yet, and let one of
 * them pick a nickname and a six-digit PIN. All of that moved to konto, where
 * the class list lives (SPEC §4.2, Koki's ruling steu-010).
 *
 * What remains is a permanent redirect, and deliberately nothing else: NO
 * database read. A code that no longer exists, or belongs to an archived group,
 * must not be answerable from here — konto owns that judgement now, and a 404
 * from this route would leak which codes are real to anyone typing them.
 *
 * 308, not 302: the code on a printed sheet or a sticker is permanent, and the
 * browser should remember where it now goes.
 */
import { NextResponse, type NextRequest } from "next/server";
import { kontoBeitrittUrl } from "@/lib/konto/basis";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  return NextResponse.redirect(kontoBeitrittUrl(code), 308);
}
