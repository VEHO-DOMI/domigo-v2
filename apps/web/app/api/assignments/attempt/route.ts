/**
 * POST /api/assignments/attempt — record ONE answer inside a live assignment
 * sitting, server-authoritatively. The timing wall (canRecordAssignAttempt)
 * runs BEFORE grading: no session, a submitted/expired session, or an item that
 * isn't on the assignment → rejected. The attempt is stamped with the sessionId
 * (context jsonb) so the submit endpoint can score exactly this sitting. Mock
 * runs post here directly (outbox OFF) so the clock is the server's.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { ItemRef } from "@domigo/content-schema";
import type { GrammarItem } from "@domigo/content-schema";
import { loadUnit } from "@domigo/content-loader";
import { gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";
import type { GrammarInput } from "@domigo/engine";
import { assignmentItemIds, canRecordAssignAttempt, getDb, getStudentAssignmentView, recordAttempt } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { parseItemRef } from "@/lib/itemRef";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const Body = z.object({
  clientAttemptId: z.string().regex(UUID),
  assignmentId: z.string().regex(UUID),
  sessionId: z.string().regex(UUID),
  itemId: ItemRef,
  input: z.union([
    z.object({ kind: z.literal("text"), value: z.string() }),
    z.object({ kind: z.literal("choice"), value: z.string() }),
    z.object({ kind: z.literal("matching"), value: z.record(z.string(), z.string()) }),
    z.object({ kind: z.literal("groupSort"), value: z.record(z.string(), z.string()) }),
    z.object({
      kind: z.literal("vocab"),
      value: z.string(),
      // C-1: which authored answer pool the exercise asked for (checkup
      // translations/definitions sections). Server-validated enum so a client
      // can never grade a German prompt against the German pool. Default:
      // carrier — exactly what practice/mock vocab sections render.
      pool: z.enum(["carrier", "definition", "deToEn", "enToDe"]).optional(),
    }),
  ]),
});

export async function POST(req: Request): Promise<Response> {
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { clientAttemptId, assignmentId, sessionId, itemId, input } = parsed.data;

  // Load the assignment (its item set) + this student's sessions.
  const view = await getStudentAssignmentView(getDb(), assignmentId, acting.userId).catch(() => null);
  if (!view || view.assignment.classId !== acting.classId) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const live = view.sessions.find((s) => s.id === sessionId && s.submittedAt === null) ?? null;
  const wall = canRecordAssignAttempt({
    session: live,
    allowedItemIds: assignmentItemIds(view.sections.map((s) => ({ itemIds: (s.itemIds as string[] | null) ?? [] }))),
    itemId,
    now: new Date(),
  });
  if (!wall.ok) return NextResponse.json({ ok: false, error: "wall", reason: wall.reason }, { status: 409 });

  // Grade (vocab/grammar only in M-3), re-resolving the item server-side.
  const ref = parseItemRef(itemId);
  if (!ref) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  let tier: import("@domigo/engine").Tier;
  let kind: "vocab" | "grammar";
  try {
    const unit = loadUnit(ref.unitSlug);
    if (ref.kind === "vocab") {
      const item = unit.vocab.find((v) => v.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      const value = "value" in input && typeof input.value === "string" ? input.value : "";
      const pool = input.kind === "vocab" ? input.pool : undefined;
      tier = gradeVocab(item, value, pool).tier;
      kind = "vocab";
    } else {
      const item = unit.grammar.find((g) => g.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      tier = gradeGrammar(item as GrammarItem, input as GrammarInput).tier;
      kind = "grammar";
    }
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Persist under mode assign:<id> + {sessionId} so the sitting is scorable.
  try {
    await recordAttempt(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      itemId,
      kind,
      unitSlug: ref.unitSlug,
      grade: ref.grade,
      mode: `assign:${assignmentId}`,
      tier,
      xpAwarded: xpForTier(0, tier), // assignments don't feed the XP pool (mock integrity)
      context: { sessionId },
      clientAttemptId,
    });
    return NextResponse.json({ ok: true, tier });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed", tier });
  }
}
