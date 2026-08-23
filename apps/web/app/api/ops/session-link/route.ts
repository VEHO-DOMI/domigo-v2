/**
 * K2b · /api/ops/session-link — consume a one-time ops sign-in link.
 *
 * GET ?token=… → signs in the ops-class student the token names and redirects.
 *
 * This is the ONE endpoint in the namespace that carries no bearer header, and
 * deliberately so: a BROWSER opens it. The signed token IS the credential; it is
 * minted only by the token-guarded POST next door, it expires in ten minutes, and
 * it dies on use. Everything it can do, it can do to one student of one class
 * (apps/web/auth.ts, verifyOpsLink).
 *
 * WHY IT REDIRECTS RATHER THAN RETURNING JSON: the whole point is to land a
 * browser on a SIGNED-IN student surface. A JSON body would leave the caller
 * holding a cookie and no page.
 *
 * `next` is clamped to a same-site path, twice, by two different means. An open
 * redirector that also mints a session is exactly the shape of an account-takeover
 * primitive, and this endpoint is unauthenticated by construction — so the
 * character rules (lib/ops.ts, which encode what we believe about the URL parser)
 * are followed by asking the parser itself.
 */
import { NextResponse, type NextRequest } from "next/server";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import {
  OPS_DEFAULT_LANDING,
  OPS_SESSION_LINK_PROVIDER,
  isSameOriginRedirect,
  opsLandingFor,
} from "@/lib/ops";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return Response.json({ error: "token query param required" }, { status: 400 });
  }

  const clamped = opsLandingFor(req.nextUrl.searchParams.get("next"));
  const redirectTo = isSameOriginRedirect(clamped, req.nextUrl.origin) ? clamped : OPS_DEFAULT_LANDING;

  try {
    await signIn(OPS_SESSION_LINK_PROVIDER, { token, redirect: false });
  } catch (err) {
    // ONE indistinguishable refusal for every failed gate — expired, replayed,
    // wrong signature, out of scope, register missing. A caller learns that the
    // link did not work, never which check refused it.
    if (err instanceof AuthError) {
      return Response.json(
        { error: "ops: sign-in link rejected (expired, already used, or out of scope)" },
        { status: 401 },
      );
    }
    throw err;
  }

  // 303: the browser must follow with GET however it arrived. NextResponse, not
  // the global Response, so the session cookie Auth.js just wrote into the
  // request-scoped cookie store rides along — with the global Response the
  // caller would be redirected while still signed out.
  return NextResponse.redirect(new URL(redirectTo, req.nextUrl.origin), 303);
}
