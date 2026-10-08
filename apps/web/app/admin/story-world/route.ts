import { auth } from "@/auth";
import { scopedClassIds } from "@/lib/identity";
import { getDb, setStoryWorld, StoryWorldForbiddenError } from "@domigo/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "teacher") {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  // This is a same-origin JSON endpoint; a foreign site cannot submit a form to it.
  if (req.headers.get("origin") !== new URL(req.url).origin) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  let body: unknown;
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (body === null || typeof body !== "object" || !("grade" in body) || !("isOpen" in body)
    || !Number.isInteger(body.grade) || Number(body.grade) < 1 || Number(body.grade) > 4
    || typeof body.isOpen !== "boolean") {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  try {
    await setStoryWorld(getDb(), await scopedClassIds(), session.user.role, Number(body.grade), body.isOpen);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof StoryWorldForbiddenError ? "forbidden" : "unavailable" },
      { status: error instanceof StoryWorldForbiddenError ? 403 : 503 });
  }
}
