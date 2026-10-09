import { auth, KONTO_PROVIDER } from "@/auth";
import { scopedClassIds } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { ClassSettingsForbiddenError, getDb, inScope } from "@domigo/db";
import { setClassLeaderboardSettings } from "@/lib/leaderboard";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "teacher") return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if ((session.user.via === KONTO_PROVIDER && session.user.goTeacher !== true)
    || req.headers.get("origin") !== new URL(req.url).origin) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "bad_request" }, { status: 400 }); }
  if (!body || typeof body !== "object" || !("classId" in body) || !("leaderboard" in body) || !("gradeBoardOptIn" in body)
    || typeof body.classId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.classId)
    || typeof body.leaderboard !== "boolean" || typeof body.gradeBoardOptIn !== "boolean" || (!body.leaderboard && body.gradeBoardOptIn)) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  try {
    const classScope = await scopedClassIds();
    const classId = body.classId.toLowerCase();
    if (!inScope(classScope, classId)) throw new ClassSettingsForbiddenError();
    await setClassLeaderboardSettings(getDb(), classScope, classId, session.user.id, { leaderboard: body.leaderboard, gradeBoardOptIn: body.gradeBoardOptIn }, isGrandmaster(session.user.id));
    // Operational journal, no names, account ids, class ids or error payloads.
    console.info("[class-leaderboard] settings_saved", { leaderboard: body.leaderboard, gradeBoardOptIn: body.gradeBoardOptIn });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const forbidden = error instanceof ClassSettingsForbiddenError;
    return Response.json({ ok: false, error: forbidden ? "forbidden" : "unavailable" }, { status: forbidden ? 403 : 503 });
  }
}
