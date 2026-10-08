import { NextResponse } from "next/server";
import { getActingUser } from "@/lib/identity";
import { startSpeedSession } from "@/lib/modi/speed-session";

export const dynamic = "force-dynamic";
export async function GET(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });
  try {
    return NextResponse.json({ speedSession: startSpeedSession(acting.userId), serverNow: Date.now() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "start_unavailable" }, { status: 503 });
  }
}
