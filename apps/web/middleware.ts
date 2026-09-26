import { NextResponse } from "next/server";
import { auth, KONTO_PROVIDER } from "@/auth";

// Auth-aware middleware (ported from v1, onboarding gate dropped — reused accounts):
//  1. Redirect un-authenticated requests for protected paths → /signin (or /admin/signin).
//  2. Forbid students from teacher-only paths (/admin/*).
export default auth((req) => {
  const session = req.auth;
  const { pathname, search } = req.nextUrl;

  // /admin/signin must be reachable without a session, or teachers redirect-loop.
  if (pathname === "/admin/signin") {
    if (!session) return NextResponse.next();
    return NextResponse.redirect(
      new URL(session.user.role === "teacher" ? "/admin" : "/home", req.nextUrl),
    );
  }

  if (!session) {
    // The documented dev-identity fallbacks (lib/identity.ts) also pass the
    // middleware, non-prod only (never in production, same guard): DEV_USER_ID
    // renders student pages; DEV_TEACHER_ID renders the /admin surface. This is
    // the ONLY way /admin opens without a session, and it's dev-gated.
    const nonProd = process.env.VERCEL_ENV !== "production";
    const isAdmin = pathname.startsWith("/admin");
    const devPass = nonProd && (isAdmin ? !!process.env.DEV_TEACHER_ID : !!process.env.DEV_USER_ID);
    if (devPass) return NextResponse.next();
    const signinPath = isAdmin ? "/admin/signin" : "/signin";
    const url = new URL(signinPath, req.nextUrl);
    url.searchParams.set("from", pathname + (search ?? ""));
    return NextResponse.redirect(url);
  }

  // dach-018 · THE AREA GATE (SPEC konto V1.1-FINAL §5 L2). Two different
  // refusals, because they are two different situations:
  //   · a CHILD on /admin is not being refused — they are simply somewhere that
  //     is not theirs, and /home is where they belong. Unchanged.
  //   · a TEACHER without the role `teacher` in the area `go` IS being refused,
  //     and sending them to /home would be a lie: the answer is not "your page is
  //     over there" but "this access is granted centrally, and you do not have
  //     it". That is the access card.
  // The role is re-read from konto every minute (auth.ts), so a withdrawal closes
  // this door within the same minute it closes the session.
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "teacher") return NextResponse.redirect(new URL("/home", req.nextUrl));
    if (session.user.via === KONTO_PROVIDER && session.user.goTeacher !== true) {
      return NextResponse.redirect(new URL("/zugriff-fehlt", req.nextUrl));
    }
  }

  return NextResponse.next();
});

// Everything else (the public landing, /signin, the /api/auth handlers) is unguarded.
// welle-076: "/play/:grade" (one segment — the four years the landing page links
// to) so a signed-out child goes to /signin WITH `from`, and comes back to that year
// (lib/konto/callback.ts decides which `from` counts). Deeper /play paths still
// redirect on their own, as before.
export const config = {
  matcher: ["/home", "/play/:grade", "/practice", "/practice/:path*", "/review", "/review/:path*", "/learn", "/learn/:path*", "/listening", "/listening/:path*", "/tests", "/tests/:path*", "/assignments", "/assignments/:path*", "/admin", "/admin/:path*"],
};
