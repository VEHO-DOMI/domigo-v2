import { NextResponse } from "next/server";
import { getDb, loadStudentWorldState, reconcileWorldRewards } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { sandboxEnabled, sandboxWorld } from "@/lib/sandbox-preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ worldId: string }> }): Promise<Response> {
  if (!sandboxEnabled()) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });
  const { worldId } = await params;
  const world = sandboxWorld();
  if (worldId !== world.id) return NextResponse.json({ ok: false, error: "unknown_world" }, { status: 404 });
  try {
    const state = await reconcileWorldRewards(getDb(), { userId: acting.userId, classId: acting.classId, world });
    return NextResponse.json({ ok: true, state });
  } catch {
    try { return NextResponse.json({ ok: true, state: await loadStudentWorldState(getDb(), acting.userId, world), warning: "reconcile_failed" }); }
    catch { return NextResponse.json({ ok: false, error: "read_failed" }, { status: 503 }); }
  }
}
