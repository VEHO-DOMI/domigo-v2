/**
 * dach-018 · /api/auth/callback-konto — where konto lands after a sign-in.
 *
 * GET ?handoff=… → trades the one-time token for the claims (server to server),
 * builds DomiGo's own session and redirects into the app.
 *
 * WHY THE TOKEN LEAVES THE ADDRESS HERE: konto delivers the handoff in the
 * query string, which is the one place a URL gets copied, bookmarked, pasted
 * into a chat and written into a server log. The trade happens in this request
 * and the browser is sent on to a clean path, so the token never survives the
 * redirect. It is single-use at konto anyway — this is the second lock, not the
 * first.
 *
 * WHY EVERY REFUSAL LOOKS THE SAME: an expired token, a replayed one, a teacher
 * without the role, a child whose class has no bridge — all of them land on
 * /zugriff-fehlt. The card there explains what to do; the URL says nothing about
 * which check refused.
 *
 * `runtime = "nodejs"` because the trade reaches bcrypt when it has to create a
 * local user (lib/konto/anmeldung.ts).
 */
import { NextResponse, type NextRequest } from "next/server";
import { AuthError } from "next-auth";

import { KONTO_PROVIDER, signIn } from "@/auth";
import { RUECKKEHR_STATUS, zielNachRueckkehr } from "@/lib/konto/callback";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const handoff = req.nextUrl.searchParams.get("handoff");
  if (!handoff) {
    return NextResponse.redirect(new URL(zielNachRueckkehr(false), req.nextUrl.origin), RUECKKEHR_STATUS);
  }

  try {
    await signIn(KONTO_PROVIDER, { handoff, redirect: false });
  } catch (err) {
    // NUR eine AuthError wird geschluckt: das ist die Absage des Providers.
    // Alles andere ist ein Fehler dieser Anwendung und muss sichtbar bleiben —
    // eine Datenbank, die nicht antwortet, darf nicht wie eine abgelehnte
    // Anmeldung aussehen.
    if (err instanceof AuthError) {
      return NextResponse.redirect(new URL(zielNachRueckkehr(false), req.nextUrl.origin), RUECKKEHR_STATUS);
    }
    throw err;
  }

  // 303 and NextResponse, not the global Response: the session cookie Auth.js
  // just wrote into the request-scoped store has to ride along, or the browser
  // is redirected while still signed out (the same trap as
  // /api/ops/session-link).
  return NextResponse.redirect(new URL(zielNachRueckkehr(true), req.nextUrl.origin), RUECKKEHR_STATUS);
}
