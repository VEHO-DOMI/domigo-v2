/**
 * GET/POST /api/funken — Hinweis-Funken (hint-spark) balance for the Keen game.
 *
 * Sparks are the SERVER-AUTHORITATIVE hint currency (user_progress.hint_sparks,
 * drizzle/0012) — never part of the wipeable cosmetic game save. Best-effort
 * persistence (never 500), mirroring /api/game-save: the db helpers degrade
 * in-band (get → 0, add → -1) so the game keeps playing through a DB outage.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { addHintSparks, getHintSparks } from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Anti-cheat clamp: a level holds ≤4 Glühwörter, so no honest level exit can
// report more; 8 = headroom (level + boss bonuses), small enough that a forged
// request can't mint a meaningful balance in one call.
const PostBody = z.object({ earned: z.number().int().min(0).max(8) });

export async function GET(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const sparks = await getHintSparks(acting.userId); // 0 when degraded (DB down / no row)
  return NextResponse.json({ ok: true, sparks });
}

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = PostBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const sparks = await addHintSparks(acting.userId, parsed.data.earned);
  if (sparks < 0) return NextResponse.json({ ok: false, error: "persist_failed", sparks: -1 });
  return NextResponse.json({ ok: true, sparks });
}
