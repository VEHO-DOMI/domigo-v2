/**
 * GET/PUT /api/game-save — Track C cosmetic game-save persistence.
 *
 * Saves carry NO authoritative progression (XP/streak/unlocks/zone-clear derive
 * from practice_attempts) — only cursor position / visited zones / cosmetics, so
 * a clobbered save costs nothing real. PUT is last-write-wins on `clientRev`
 * (resolved in-statement) and capped at 64 KB. Best-effort persistence (never
 * 500). Mirrors /api/writing-submission + /api/study-path.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_GAME_SAVE_BYTES, gameSaveStateBytes, getDb, getGameSave, upsertGameSave } from "@domigo/db";
import { getActingUser } from "@/lib/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// B-2: `:bonus` = a grade's extra released story's COSMETIC slot (the detective
// game after the school overworld takes `game:g2`). Attempt modes are unaffected.
const GameMode = z.string().regex(/^game:g[1-4](:bonus)?$/);

const PutBody = z.object({
  gameMode: GameMode,
  schemaVersion: z.number().int().min(1).max(1000),
  clientRev: z.number().int().min(0),
  state: z.record(z.string(), z.unknown()),
});

export async function GET(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const mode = new URL(req.url).searchParams.get("mode") ?? "";
  if (!GameMode.safeParse(mode).success) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const save = await getGameSave(getDb(), acting.userId, mode);
    return NextResponse.json({ ok: true, save });
  } catch {
    return NextResponse.json({ ok: false, error: "read_failed" });
  }
}

export async function PUT(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = PutBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { gameMode, schemaVersion, clientRev, state } = parsed.data;

  if (gameSaveStateBytes(state) > MAX_GAME_SAVE_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  try {
    const save = await upsertGameSave(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      gameMode,
      schemaVersion,
      clientRev,
      state,
    });
    return NextResponse.json({ ok: true, save });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" });
  }
}
