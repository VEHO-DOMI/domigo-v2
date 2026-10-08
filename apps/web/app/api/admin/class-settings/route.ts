import { auth, KONTO_PROVIDER } from "@/auth";
import { scopedClassIds } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { ClassSettingsForbiddenError, getDb, inScope, setClassPurpose } from "@domigo/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "teacher") {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if ((session.user.via === KONTO_PROVIDER && session.user.goTeacher !== true)
    || req.headers.get("origin") !== new URL(req.url).origin) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  let body: unknown;
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("classId" in body) || !("purpose" in body)
    || typeof body.classId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.classId)
    || (body.purpose !== "regular" && body.purpose !== "test")) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  try {
    const classScope = await scopedClassIds();
    const classId = body.classId.toLowerCase();
    if (!inScope(classScope, classId)) throw new ClassSettingsForbiddenError();
    await setClassPurpose(getDb(), classScope, classId, session.user.id, body.purpose, isGrandmaster(session.user.id));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const forbidden = error instanceof ClassSettingsForbiddenError;
    return Response.json({ ok: false, error: forbidden ? "forbidden" : "unavailable" }, { status: forbidden ? 403 : 503 });
  }
}
