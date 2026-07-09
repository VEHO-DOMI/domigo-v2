import { NextResponse } from "next/server";
import { auth } from "@/auth";

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

  if (pathname.startsWith("/admin") && session.user.role !== "teacher") {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
});

// Everything else (the public landing, /signin, the /api/auth handlers) is unguarded.
export const config = {
  matcher: ["/home", "/practice", "/practice/:path*", "/review", "/review/:path*", "/learn", "/learn/:path*", "/listening", "/listening/:path*", "/tests", "/tests/:path*", "/assignments", "/assignments/:path*", "/admin", "/admin/:path*"],
};
