import { NextResponse } from "next/server";
import { getDb, setStudentAvatar, StudentProfileForbiddenError, validAvatar } from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });
  if (req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ ok: false, error: "wrong_origin" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body || !validAvatar(body.avatar) || body.ownerId !== acting.userId) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  try {
    await setStudentAvatar(getDb(), acting.classScope, acting.classId, acting.userId, body.avatar);
    return NextResponse.json({ ok: true, avatar: body.avatar });
  } catch (error) {
    const forbidden = error instanceof StudentProfileForbiddenError;
    return NextResponse.json({ ok: false, error: forbidden ? "forbidden" : "not_saved" }, { status: forbidden ? 403 : 503 });
  }
}
