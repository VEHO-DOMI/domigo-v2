/**
 * Resolves the acting user for attempt recording. Real NextAuth session first;
 * a non-prod env/header fallback remains for CI + the verification scripts.
 * Downstream only consumes `{userId, classId}`.
 */
import { auth } from "@/auth";
import { getPreviewStudent } from "@/lib/sandbox-preview";

export interface ActingUser {
  userId: string;
  classId: string;
}

export async function getActingUser(req: Request): Promise<ActingUser | null> {
  const preview = getPreviewStudent(req);
  if (preview) return { userId: preview.userId, classId: preview.classId };
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

export interface ActingTeacher {
  userId: string;
  name: string;
}

/**
 * Teacher identity for the /admin surface — a real teacher session (role
 * "teacher", classId null) first, then a non-prod `DEV_TEACHER_ID` fallback so
 * the mock-test builder renders under the dev server without a live login (the
 * teacher analog of DEV_USER_ID; never resolves in production).
 */
export async function getTeacherForPage(): Promise<ActingTeacher | null> {
  const session = await auth();
  if (session?.user?.id && session.user.role === "teacher") {
    return { userId: session.user.id, name: session.user.name ?? "Teacher" };
  }
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = process.env.DEV_TEACHER_ID ?? "";
  if (!userId) return null;
  return { userId, name: process.env.DEV_TEACHER_NAME ?? "Dev Teacher" };
}
