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
    const signinPath = pathname.startsWith("/admin") ? "/admin/signin" : "/signin";
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
  matcher: ["/home", "/practice", "/practice/:path*", "/review", "/review/:path*", "/learn", "/learn/:path*", "/listening", "/listening/:path*", "/tests", "/tests/:path*", "/admin", "/admin/:path*"],
};
