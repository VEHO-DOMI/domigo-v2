import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, resetTestWorld } from "@domigo/db";
import { getPreviewTeacher, sandboxEnabled, SANDBOX_PROFILES, SANDBOX_WORLD_ID } from "@/lib/sandbox-preview";

const Body = z.object({ profileKey: z.enum(["fresh", "midway", "complete"]) });
export async function POST(req: Request, { params }: { params: Promise<{ worldId: string }> }): Promise<Response> {
  if (!sandboxEnabled()) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  if (!getPreviewTeacher(req)) return NextResponse.json({ ok: false, error: "no_teacher" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success || (await params).worldId !== SANDBOX_WORLD_ID) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  try { await resetTestWorld(getDb(), { userId: SANDBOX_PROFILES[parsed.data.profileKey].userId, worldId: SANDBOX_WORLD_ID }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ ok: false, error: "reset_rejected" }, { status: 400 }); }
}
