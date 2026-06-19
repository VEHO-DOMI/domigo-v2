/**
 * POST /api/attempts — idempotent, server-graded attempt recording.
 *
 * The client sends the RAW user answer; the server re-grades through the one
 * grading brain (@domigo/engine), records the attempt, updates the Leitner
 * review queue, and bumps the v2 XP pool (all via @domigo/db `recordAttempt`).
 * Best-effort persistence: grading always returns even if the DB write fails
 * (the UI stays correct). Failure never subtracts XP (10_game_layer Law 3).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { ItemRef } from "@domigo/content-schema";
import { loadUnit } from "@domigo/content-loader";
import { gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";
import type { GrammarInput, Tier } from "@domigo/engine";
import { getDb, recordAttempt } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { parseItemRef } from "@/lib/itemRef";

export const runtime = "nodejs"; // content-loader uses node:fs → not edge
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const GrammarInputSchema = z.union([
  z.object({ kind: z.literal("text"), value: z.string() }),
  z.object({ kind: z.literal("choice"), value: z.string() }),
  z.object({ kind: z.literal("matching"), value: z.record(z.string(), z.string()) }),
  z.object({ kind: z.literal("groupSort"), value: z.record(z.string(), z.string()) }),
]);

const Body = z.object({
  clientAttemptId: z.string().regex(UUID),
  itemId: ItemRef,
  mode: z.string().min(1).max(40).regex(/^[a-z0-9:_-]+$/i),
  input: z.union([GrammarInputSchema, z.object({ kind: z.literal("vocab"), value: z.string() })]),
  latencyMs: z.number().int().nonnegative().nullable().optional(),
  hintUsed: z.boolean().optional(),
  context: z.unknown().optional(),
});

export async function POST(req: Request): Promise<Response> {
  // 1. Identity (dev now; auth() later).
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  // 2. Validate body.
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { clientAttemptId, itemId, mode, input, latencyMs, hintUsed, context } = parsed.data;

  // 3. Derive coordinates from the id (never trust client slug/grade).
  const ref = parseItemRef(itemId);
  if (!ref) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // 4–6. Load the unit, find the item, re-grade, compute XP (wrong → 0; never subtract).
  let tier: Tier;
  let xpAwarded: number;
  try {
    const unit = loadUnit(ref.unitSlug);
    if (ref.kind === "vocab") {
      const item = unit.vocab.find((v) => v.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      const value = "value" in input && typeof input.value === "string" ? input.value : "";
      tier = gradeVocab(item, value).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
    } else {
      const item = unit.grammar.find((g) => g.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      tier = gradeGrammar(item, input as GrammarInput).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
    }
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // 7. Best-effort persist (idempotent; side-effects gated on first insert).
  try {
    const { duplicate, box, dueAt } = await recordAttempt(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      itemId,
      kind: ref.kind,
      unitSlug: ref.unitSlug,
      grade: ref.grade,
      mode,
      tier,
      xpAwarded,
      latencyMs: latencyMs ?? null,
      hintUsed: hintUsed ?? false,
      context,
      clientAttemptId,
    });
    return NextResponse.json({ ok: true, tier, xpAwarded, box, dueAt: dueAt.toISOString(), duplicate });
  } catch {
    // Graded fine, DB failed → graceful, non-blocking (no 500).
    return NextResponse.json({ ok: false, error: "persist_failed", tier, xpAwarded });
  }
}
