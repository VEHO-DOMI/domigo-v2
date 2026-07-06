/**
 * POST /api/attempts — idempotent, server-graded attempt recording.
 *
 * The client sends the RAW user answer; the server re-grades through the one
 * grading brain (@domigo/engine), records the attempt, updates the Leitner review
 * queue (vocab/grammar only — listening + reading skip it), and bumps the v2 XP
 * pool (all via @domigo/db `recordAttempt`). Best-effort persistence: grading
 * always returns even if the DB write fails. Failure never subtracts XP (Law 3).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { ItemRef, ListeningRef, StoryComprehensionRef, TestRef } from "@domigo/content-schema";
import type { GrammarItem } from "@domigo/content-schema";
import { loadListening, loadStoryComprehension, loadTest, loadUnit, storyIdForGrade } from "@domigo/content-loader";
import { gradeGrammar, gradeVocab, xpForTier } from "@domigo/engine";
import type { GrammarInput, Tier } from "@domigo/engine";
import { getDb, recordAttempt } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { parseItemRef } from "@/lib/itemRef";
import { parseListeningRef } from "@/lib/listeningRef";
import { parseTestRef } from "@/lib/testRef";
import { parseComprehensionRef } from "@/lib/comprehensionRef";

export const runtime = "nodejs"; // content-loader uses node:fs → not edge
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// `.ci.` ids carry the grade but not the story; the one-story-per-grade map is
// DERIVED from the corpus (`storyIdForGrade`) — a hardcoded copy here can go
// stale when a new grade's story ships and 400 its comprehension attempts.

const GrammarInputSchema = z.union([
  z.object({ kind: z.literal("text"), value: z.string() }),
  z.object({ kind: z.literal("choice"), value: z.string() }),
  z.object({ kind: z.literal("matching"), value: z.record(z.string(), z.string()) }),
  z.object({ kind: z.literal("groupSort"), value: z.record(z.string(), z.string()) }),
]);

const Body = z.object({
  clientAttemptId: z.string().regex(UUID),
  itemId: z.union([ItemRef, ListeningRef, TestRef, StoryComprehensionRef]),
  mode: z.string().min(1).max(40).regex(/^[a-z0-9:_-]+$/i),
  input: z.union([
    GrammarInputSchema,
    z.object({
      kind: z.literal("vocab"),
      value: z.string(),
      // Which authored answer pool the exercise asked for (direction-aware for
      // translation modes). Server-validated so a client can never grade a
      // German prompt against the German pool. Default: the carrier gap-fill.
      pool: z.enum(["carrier", "definition", "deToEn", "enToDe"]).optional(),
    }),
  ]),
  latencyMs: z.number().int().nonnegative().nullable().optional(),
  hintUsed: z.boolean().optional(),
  context: z.unknown().optional(),
});

export async function POST(req: Request): Promise<Response> {
  // 1. Identity.
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  // 2. Validate body.
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { clientAttemptId, itemId, mode, input, latencyMs, hintUsed, context } = parsed.data;

  // 3. Derive coordinates from the id (never trust client slug/grade). vocab/grammar
  //    → parseItemRef; listening → parseListeningRef; reading → parseTestRef.
  const ref = parseItemRef(itemId);
  const lref = ref ? null : parseListeningRef(itemId);
  const tref = ref || lref ? null : parseTestRef(itemId);
  const cref = ref || lref || tref ? null : parseComprehensionRef(itemId);
  if (!ref && !lref && !tref && !cref) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // 4–6. Load + re-grade + compute XP (wrong → 0; never subtract).
  let tier: Tier;
  let xpAwarded: number;
  let kind: "vocab" | "grammar" | "listening" | "reading";
  let unitSlug: string;
  let grade: number;
  try {
    if (ref) {
      kind = ref.kind;
      unitSlug = ref.unitSlug;
      grade = ref.grade;
      const unit = loadUnit(ref.unitSlug);
      if (ref.kind === "vocab") {
        const item = unit.vocab.find((v) => v.id === itemId);
        if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
        const value = "value" in input && typeof input.value === "string" ? input.value : "";
        const pool = input.kind === "vocab" ? input.pool : undefined;
        tier = gradeVocab(item, value, pool).tier;
        xpAwarded = xpForTier(item.difficulty * 10, tier);
      } else {
        const item = unit.grammar.find((g) => g.id === itemId);
        if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
        tier = gradeGrammar(item, input as GrammarInput).tier;
        xpAwarded = xpForTier(item.difficulty * 10, tier);
      }
    } else if (lref) {
      kind = "listening";
      unitSlug = lref.unitSlug;
      grade = lref.grade;
      const file = loadListening(lref.unitSlug);
      const item = file?.tasks.flatMap((t) => t.items).find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      tier = gradeGrammar(item as unknown as GrammarItem, input as GrammarInput).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
    } else if (tref) {
      kind = "reading";
      unitSlug = tref.unitSlug;
      grade = tref.grade;
      const file = loadTest(tref.unitSlug);
      const item = file?.test.sections
        .flatMap((s) => (s.kind === "reading" ? s.items : []))
        .find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      tier = gradeGrammar(item as unknown as GrammarItem, input as GrammarInput).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
    } else {
      // story comprehension (`.ci.`): a receptive sibling — graded like reading,
      // queue-skipped. cref is non-null (the guard above returned otherwise).
      const cr = cref!;
      kind = "reading";
      unitSlug = cr.unitSlug;
      grade = cr.grade;
      const storyId = storyIdForGrade(cr.grade);
      const item = (storyId ? loadStoryComprehension(storyId) : null)?.items.find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      tier = gradeGrammar(item as unknown as GrammarItem, input as GrammarInput).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
    }
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // 7. Best-effort persist (idempotent; side-effects gated on first insert).
  try {
    const { duplicate, box, dueAt, streak } = await recordAttempt(getDb(), {
      userId: acting.userId,
      classId: acting.classId,
      itemId,
      kind,
      unitSlug,
      grade,
      mode,
      tier,
      xpAwarded,
      latencyMs: latencyMs ?? null,
      hintUsed: hintUsed ?? false,
      context,
      clientAttemptId,
    });
    return NextResponse.json({ ok: true, tier, xpAwarded, box, dueAt: dueAt.toISOString(), duplicate, streak });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed", tier, xpAwarded });
  }
}
