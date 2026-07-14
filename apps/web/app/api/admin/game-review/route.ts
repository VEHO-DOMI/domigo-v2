import { NextResponse } from "next/server";
import { getDb, getWorldReview } from "@domigo/db";
import { getPreviewTeacher, sandboxEnabled, SANDBOX_WORLD_ID } from "@/lib/sandbox-preview";

export async function GET(req: Request): Promise<Response> {
  if (!sandboxEnabled()) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  if (!getPreviewTeacher(req)) return NextResponse.json({ ok: false, error: "no_teacher" }, { status: 401 });
  try { return NextResponse.json({ ok: true, profiles: await getWorldReview(getDb(), SANDBOX_WORLD_ID) }); }
  catch { return NextResponse.json({ ok: false, error: "read_failed" }, { status: 503 }); }
}
