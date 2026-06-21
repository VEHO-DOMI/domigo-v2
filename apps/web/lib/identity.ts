/**
 * Resolves the acting user for attempt recording. Real NextAuth session first;
 * a non-prod env/header fallback remains for CI + the verification scripts.
 * Downstream only consumes `{userId, classId}`.
 */
import { auth } from "@/auth";

export interface ActingUser {
  userId: string;
  classId: string;
}

export async function getActingUser(req: Request): Promise<ActingUser | null> {
  // Signed-in STUDENT (teachers have classId=null → they don't record practice attempts).
  const session = await auth();
  if (session?.user?.id && session.user.classId) {
    return { userId: session.user.id, classId: session.user.classId };
  }

  // Dev fallback — non-prod only (the backdoor must never resolve in production).
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = req.headers.get("x-dev-user-id") ?? process.env.DEV_USER_ID ?? "";
  const classId = req.headers.get("x-dev-class-id") ?? process.env.DEV_CLASS_ID ?? "";
  if (!userId || !classId) return null;
  return { userId, classId };
}

/**
 * Server-COMPONENT identity (no Request to read headers from): NextAuth session
 * first, then a non-prod env fallback (DEV_USER_ID/DEV_CLASS_ID) so a page like
 * the game route renders under the dev server without a login. Never resolves the
 * fallback in production.
 */
export async function getActingUserForPage(): Promise<ActingUser | null> {
  const session = await auth();
  if (session?.user?.id && session.user.classId) {
    return { userId: session.user.id, classId: session.user.classId };
  }
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = process.env.DEV_USER_ID ?? "";
  const classId = process.env.DEV_CLASS_ID ?? "";
  if (!userId || !classId) return null;
  return { userId, classId };
}
