/**
 * Request-scoped teacher identity for the /api/admin/* routes — a real teacher
 * session (role "teacher") first, then the non-prod DEV_TEACHER_ID fallback (the
 * teacher analog of getActingUser's DEV_USER_ID). Never resolves in production.
 */
import { auth } from "@/auth";

export interface ActingTeacher {
  userId: string;
}

export async function getTeacher(req: Request): Promise<ActingTeacher | null> {
  const session = await auth();
  if (session?.user?.id && session.user.role === "teacher") return { userId: session.user.id };

  if (process.env.VERCEL_ENV === "production") return null;
  const userId = req.headers.get("x-dev-teacher-id") ?? process.env.DEV_TEACHER_ID ?? "";
  return userId ? { userId } : null;
}
