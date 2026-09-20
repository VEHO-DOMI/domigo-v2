/**
 * Resolves the acting user for attempt recording — and, since dach-018, the
 * CLASS SCOPE that user is allowed to see.
 *
 * Real NextAuth session first; a non-prod env/header fallback remains for CI and
 * the verification scripts.
 *
 * ── THE ONE PLACE A SCOPE IS BUILT ───────────────────────────────────────────
 * `classScope(` is called in apps/web NOWHERE ELSE, and scripts/check-claim-filter.mjs
 * enforces exactly that. The type cannot prove where its ids came from — anyone
 * could write `classScope([params.id])` and hand a service the very id it was
 * meant to be checked against. What keeps the wall standing is that there is one
 * construction site, and a machine watches it.
 *
 * Where a scope comes from, per session:
 *   · child        — the one class in the claim (SPEC §5, Schuelerfall F6)
 *   · teacher      — the groups konto grants, verbatim; a group without a bridge
 *                    into DomiGo simply is not in the list (SPEC §5 L3)
 *   · grandmaster  — EVERY class. Koki decided on 2026-09-17 that the
 *                    administration access keeps its view; the honest way to give
 *                    one is a wide scope, so the wall stays total and the door has
 *                    a name (listAllClassIds, one line in the gate's allowlist).
 *   · ops machine  — the one test class its link was minted for
 *   · dev fallback — never in production; the same two builders, so a dev page
 *                    exercises the wall instead of tiptoeing around it.
 */
import { classScope, EMPTY_SCOPE, getDb, listAllClassIds, type ClassScope } from "@domigo/db";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { isGrandmaster } from "@/lib/grandmaster";

export interface ActingUser {
  userId: string;
  classId: string;
  /** The classes this session may read. Never widened downstream. */
  classScope: ClassScope;
}

/** The scope a live session carries. The grandmaster is the only widening. */
async function scopeAus(session: Session): Promise<ClassScope> {
  if (session.user.role === "teacher" && isGrandmaster(session.user.id)) {
    return classScope(await listAllClassIds(getDb()));
  }
  return classScope(session.user.scope ?? []);
}

/**
 * The class scope of the current session, for callers that need only the wall
 * (the teacher surfaces). An unresolved session sees nothing — an empty scope is
 * an ANSWER, not a failure, and every service below turns it into zero rows.
 */
export async function scopedClassIds(): Promise<ClassScope> {
  const session = await auth();
  if (session?.user?.id) return scopeAus(session);
  if (process.env.VERCEL_ENV === "production") return EMPTY_SCOPE;
  const devClass = process.env.DEV_CLASS_ID ?? "";
  if (devClass) return classScope([devClass]);
  return process.env.DEV_TEACHER_ID ? classScope(await listAllClassIds(getDb())) : EMPTY_SCOPE;
}

/**
 * The request-scoped twin of scopedClassIds, for the /api routes: the same
 * session rule, plus the non-prod dev headers those routes accept.
 */
export async function scopedClassIdsForRequest(req: Request): Promise<ClassScope> {
  const session = await auth();
  if (session?.user?.id) return scopeAus(session);
  if (process.env.VERCEL_ENV === "production") return EMPTY_SCOPE;
  const devClass = req.headers.get("x-dev-class-id") ?? process.env.DEV_CLASS_ID ?? "";
  if (devClass) return classScope([devClass]);
  const devTeacher = req.headers.get("x-dev-teacher-id") ?? process.env.DEV_TEACHER_ID ?? "";
  return devTeacher ? classScope(await listAllClassIds(getDb())) : EMPTY_SCOPE;
}

export async function getActingUser(req: Request): Promise<ActingUser | null> {
  // Signed-in STUDENT (teachers have classId=null → they don't record practice attempts).
  const session = await auth();
  if (session?.user?.id && session.user.classId) {
    return { userId: session.user.id, classId: session.user.classId, classScope: await scopeAus(session) };
  }

  // Dev fallback — non-prod only (the backdoor must never resolve in production).
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = req.headers.get("x-dev-user-id") ?? process.env.DEV_USER_ID ?? "";
  const classId = req.headers.get("x-dev-class-id") ?? process.env.DEV_CLASS_ID ?? "";
  if (!userId || !classId) return null;
  return { userId, classId, classScope: classScope([classId]) };
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
    return { userId: session.user.id, classId: session.user.classId, classScope: await scopeAus(session) };
  }
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = process.env.DEV_USER_ID ?? "";
  const classId = process.env.DEV_CLASS_ID ?? "";
  if (!userId || !classId) return null;
  return { userId, classId, classScope: classScope([classId]) };
}

export interface ActingTeacher {
  userId: string;
  name: string;
  /** Every class this teacher may touch. The wall, carried to every query. */
  classScope: ClassScope;
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
    return {
      userId: session.user.id,
      name: session.user.name ?? "Teacher",
      classScope: await scopeAus(session),
    };
  }
  if (process.env.VERCEL_ENV === "production") return null;
  const userId = process.env.DEV_TEACHER_ID ?? "";
  if (!userId) return null;
  return {
    userId,
    name: process.env.DEV_TEACHER_NAME ?? "Dev Teacher",
    classScope: classScope(await listAllClassIds(getDb())),
  };
}

/**
 * Player identity for the GAME surfaces (world map / level runner / save
 * endpoint): a student session first — real progress, real class stats. A
 * TEACHER session may also PLAY (the pre-release preview, Koki 2026-07-17):
 * their userId doubles as the denormalized classId on the save row (no FK on
 * game_saves), while /api/attempts keeps rejecting teachers — teacher play
 * never lands in class mastery.
 *
 * dach-018 · that synthetic classId is in NO real scope, so the preview's own
 * reads would come back empty under the class wall. The player scope therefore
 * carries the synthetic id alongside the teacher's real classes: it is the
 * teacher's OWN id, it names no child's class, and without it the preview
 * silently stops saving.
 */
export async function getPlayerForPage(): Promise<ActingUser | null> {
  const acting = await getActingUserForPage();
  if (acting) return acting;
  const teacher = await getTeacherForPage();
  return teacher
    ? { userId: teacher.userId, classId: teacher.userId, classScope: classScope([teacher.userId, ...teacher.classScope]) }
    : null;
}

/** Route-handler variant of getPlayerForPage (game-save GET/PUT). */
export async function getActingPlayer(req: Request): Promise<ActingUser | null> {
  const acting = await getActingUser(req);
  if (acting) return acting;
  const teacher = await getTeacherForPage();
  return teacher
    ? { userId: teacher.userId, classId: teacher.userId, classScope: classScope([teacher.userId, ...teacher.classScope]) }
    : null;
}
