/**
 * dach-018 · a teacher door that is no longer here.
 *
 * The invite link, the forgotten-PIN request, the reset page and the one-time
 * bootstrap each created or changed a DomiGo password. After the switch-over
 * DomiGo has no passwords to create or change — konto does (SPEC §6).
 *
 * A permanent redirect to the sign-in at konto, with no database read and no
 * token inspection: the token in an old link must not be answered, only
 * retired. Old bookmarks keep working, they just arrive somewhere else.
 */
import { NextResponse, type NextRequest } from "next/server";
import { kontoBaseUrl } from "@/lib/konto/basis";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  return NextResponse.redirect(`${kontoBaseUrl()}/login?app=go`, 308);
}
