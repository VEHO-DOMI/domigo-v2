/**
 * Request-scoped teacher identity for the /api/admin/* routes — a real teacher
 * session (role "teacher") first, then the non-prod DEV_TEACHER_ID fallback (the
 * teacher analog of getActingUser's DEV_USER_ID). Never resolves in production.
 *
 * dach-018 · it now also carries the CLASS SCOPE, built in the one place a scope
 * may be built (lib/identity.ts). Every /api/admin route hands it straight to the
 * service it calls, so an admin endpoint cannot reach a class the session may not
 * see — the WHERE clause decides, not the route.
 */
import type { ClassScope } from "@domigo/db";
import { auth } from "@/auth";
import { scopedClassIdsForRequest } from "@/lib/identity";

export interface ActingTeacher {
  userId: string;
  /** The classes this teacher may touch (SPEC konto V1.1-FINAL §5 L3). */
  classScope: ClassScope;
}

export async function getTeacher(req: Request): Promise<ActingTeacher | null> {
  const session = await auth();
  if (session?.user?.id && session.user.role === "teacher") {
    return { userId: session.user.id, classScope: await scopedClassIdsForRequest(req) };
  }

  if (process.env.VERCEL_ENV === "production") return null;
  const userId = req.headers.get("x-dev-teacher-id") ?? process.env.DEV_TEACHER_ID ?? "";
  return userId ? { userId, classScope: await scopedClassIdsForRequest(req) } : null;
}
