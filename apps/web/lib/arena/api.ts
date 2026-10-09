import "server-only";
import { auth } from "@/auth";
import { getActingUser } from "@/lib/identity";
import { z } from "zod";
import { arenaError, startDuel, startRound } from "./server";
const ID = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
const Challenge = z.object({ peer: z.number().int().positive(), rosterVersion: z.string().regex(/^[0-9a-f]{64}$/) }).strict();
const Round = z.object({ duelId: ID, unitKey: z.string().regex(/^g[1-4]-u\d{2}$/) }).strict();
export async function arenaAction(req: Request, action: "challenge" | "round") {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ ok: false, error: "no_identity" }, { status: 401 });
  if (session.user.role !== "student" || req.headers.get("origin") !== new URL(req.url).origin) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  const player = await getActingUser(req);
  if (!player) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  const body: unknown = await req.json().catch(() => null);
  try {
    if (action === "challenge") {
      const parsed = Challenge.safeParse(body);
      if (!parsed.success) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
      const id = await startDuel(player, parsed.data.peer, parsed.data.rosterVersion);
      return Response.json({ ok: true, id }, { headers: { "Cache-Control": "no-store" } });
    }
    const parsed = Round.safeParse(body);
    if (!parsed.success) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
    await startRound(player, parsed.data.duelId, parsed.data.unitKey);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return arenaError(error); }
}
