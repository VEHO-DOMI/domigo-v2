import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, recordWorldInteraction } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { sandboxEnabled, sandboxWorld } from "@/lib/sandbox-preview";

const Body = z.object({ interactionId: z.string().min(1) });
export async function POST(req: Request, { params }: { params: Promise<{ worldId: string }> }): Promise<Response> {
  if (!sandboxEnabled()) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const world = sandboxWorld();
  if ((await params).worldId !== world.id) return NextResponse.json({ ok: false, error: "unknown_world" }, { status: 404 });
  try { return NextResponse.json({ ok: true, state: await recordWorldInteraction(getDb(), { ...acting, world, interactionId: parsed.data.interactionId }) }); }
  catch { return NextResponse.json({ ok: false, error: "interaction_rejected" }, { status: 400 }); }
}
