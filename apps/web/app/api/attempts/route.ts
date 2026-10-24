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
import { loadListening, loadStoryComprehension, loadTest, storyIdForGrade } from "@domigo/content-loader";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { classifyWrong, gradeGrammar, gradeVocab, vocabAnswers, xpForTier } from "@domigo/engine";
import type { ClassifiableItem, GrammarInput, Tier } from "@domigo/engine";
import { getDb, recordAttempt, getPracticeReceipt, getClassGrade, inScope, listReservedForClass, practiceItemDenial } from "@domigo/db";
import { getActingUser } from "@/lib/identity";
import { parseItemRef } from "@/lib/itemRef";
import { parseListeningRef } from "@/lib/listeningRef";
import { parseTestRef } from "@/lib/testRef";
import { parseComprehensionRef } from "@/lib/comprehensionRef";
import { speedSessionValid } from "@/lib/modi/speed-session";
import { validModeInput } from "@/lib/modi/attempt-policy";
import { VocabularyHistoryInput, supportsVocabularyHistory, vocabularyHistoryContext } from "@/lib/vocabulary-history";
import { arenaError, checkDuelAttempt, writeDuelAnswer } from "@/lib/arena/server";

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
  ownerId: z.string().min(1).max(256).optional(),
  clientAttemptId: z.string().regex(UUID),
  itemId: z.union([ItemRef, ListeningRef, TestRef, StoryComprehensionRef]).optional(),
  mode: z.string().min(1).max(41).regex(/^[a-z0-9:_-]+$/i),
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
  vocabularyHistory: VocabularyHistoryInput.optional(),
  context: z.unknown().optional(),
});

/** Arena services recheck their reserve under a write lock. Keep those later
 * refusals on the same public 403 contract as the shared pre-grading check. */
function reservationRefusal(error: unknown): Response | null {
  if (!(error instanceof Error) || !("code" in error)
    || !["duel_question_reserved", "live_question_reserved"].includes(String(error.code))) return null;
  console.warn("[attempts] denied: item_reserved");
  return NextResponse.json({ ok: false, error: "item_reserved" }, { status: 403 });
}

export async function POST(req: Request): Promise<Response> {
  const receivedAt = new Date(); // Trusted arrival time, before identity/content/database latency.
  // 1. Identity.
  const acting = await getActingUser(req);
  if (!acting) return NextResponse.json({ ok: false, error: "no_identity" }, { status: 401 });

  // 2. Validate body.
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { clientAttemptId, mode, input, latencyMs, hintUsed, context, vocabularyHistory: observation } = parsed.data;
  let itemId = parsed.data.itemId;

  // Old pages delete queued answers on permanent 4xx responses. Keep them
  // retryable until a reload upgrades the outbox and isolates ownerless rows.
  if (parsed.data.ownerId === undefined) {
    return NextResponse.json({ ok: false, error: "legacy_client" }, { status: 503, headers: { "Retry-After": "60" } });
  }
  // The client stamp is only a claim. Reject foreign owners before loading
  // content, grading or touching the ledger; never adopt an ownerless answer.
  if (parsed.data.ownerId !== acting.userId) {
    return NextResponse.json({ ok: false, error: "wrong_owner" }, { status: 409 });
  }

  if (!inScope(acting.classScope, acting.classId)) {
    console.warn("[attempts] denied: class_scope");
    return NextResponse.json({ ok: false, error: "class_forbidden" }, { status: 403 });
  }

  if (observation && (input.kind !== "vocab" || !supportsVocabularyHistory(mode))) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  if (!validModeInput(mode, itemId, input)) return NextResponse.json({ ok: false, error: "bad_mode_input" }, { status: 400 }); // cgo-109 MODE-TAG
  if (mode === "speed" && !speedSessionValid(context, acting.userId)) return NextResponse.json({ ok: false, error: "speed_expired" }, { status: 410 }); // cgo-109 SPEED-DEADLINE

  // A duel question is authorized before grading, then rechecked under its row
  // lock when recording. Neither replays nor forged participants can earn XP.
  let duelCoordinates: Awaited<ReturnType<typeof checkDuelAttempt>>["coordinates"] | null = null;
  if (mode.startsWith("duel:")) {
    try {
      const resolved = await checkDuelAttempt(req, acting, mode, context, input.kind === "choice" ? input.value : "");
      duelCoordinates = resolved.coordinates; itemId = resolved.itemId;
    }
    catch (error) { return reservationRefusal(error) ?? arenaError(error); }
  }
  // Load live-only dependencies lazily: other practice modes keep their route.
  let live: typeof import("@/lib/arena/live-server") | null = null;
  let liveResolved: Awaited<ReturnType<typeof import("@/lib/arena/live-server")["checkLiveAttempt"]>> | null = null;
  if (mode.startsWith("live:") || mode.startsWith("quiz:")) {
    live = await import("@/lib/arena/live-server");
    try {
      liveResolved = await live.checkLiveAttempt(req, acting, mode, context, typeof input.value === "string" ? input.value : "", receivedAt);
      itemId = liveResolved.itemId;
    } catch (error) { return reservationRefusal(error) ?? live.liveError(error); }
  }
  if (itemId === undefined) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // 3. Derive coordinates from the id (never trust client slug/grade). vocab/grammar
  //    → parseItemRef; listening → parseListeningRef; reading → parseTestRef.
  const ref = parseItemRef(itemId);
  const lref = ref ? null : parseListeningRef(itemId);
  const tref = ref || lref ? null : parseTestRef(itemId);
  const cref = ref || lref || tref ? null : parseComprehensionRef(itemId);
  if (!ref && !lref && !tref && !cref) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  if (observation && ref?.kind !== "vocab") return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // The mode and client metadata never grant a grade or reserve exception.
  // Read only the authenticated class, and refuse uncertainty before grading.
  try {
    const db = getDb();
    const classGrade = await getClassGrade(db, acting.classId);
    const reserved = await listReservedForClass(db, acting.classScope, acting.classId);
    const denial = practiceItemDenial(itemId, classGrade, reserved);
    if (denial) {
      // Fixed vocabulary only: no user/class IDs, names, answer or client context.
      console.warn(`[attempts] denied: ${denial}`);
      return NextResponse.json({ ok: false, error: denial }, { status: 403 });
    }
  } catch {
    console.warn("[attempts] eligibility_unavailable");
    return NextResponse.json({ ok: false, error: "eligibility_unavailable" }, { status: 503, headers: { "Retry-After": "30" } });
  }

  // 4–6. Load + re-grade + compute XP (wrong → 0; never subtract).
  let tier: Tier;
  let xpAwarded: number;
  let kind: "vocab" | "grammar" | "listening" | "reading";
  let unitSlug: string;
  let grade: number;
  // D-2 trap classification input: the graded item's full-answer view, plus the
  // typed text (choice/matching/groupSort never classify — their traps are
  // authored via distractorMeta).
  let classifiable: ClassifiableItem | null = null;
  let vocabularyHistory: ReturnType<typeof vocabularyHistoryContext> | undefined;
  const typedValue =
    (input.kind === "text" || input.kind === "vocab") && typeof input.value === "string" ? input.value : null;
  try {
    if (ref) {
      kind = ref.kind;
      unitSlug = ref.unitSlug;
      grade = ref.grade;
      // Draft-aware: grade the SAME effective item the student was shown
      // (canon + prose overlay + published full-item drafts) so created items
      // are gradable and replaced items grade against their NEW keys. Prose
      // overrides can't touch grading keys by construction, so this is safe;
      // degrades to canon on any DB error.
      const unit = await loadUnitWithOverrides(ref.unitSlug);
      if (ref.kind === "vocab") {
        const item = liveResolved?.item ?? unit.vocab.find((v) => v.id === itemId);
        if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
        const value = "value" in input && typeof input.value === "string" ? input.value : "";
        const pool = liveResolved ? liveResolved.pool : duelCoordinates ? "deToEn" : input.kind === "vocab" ? input.pool : undefined;
        tier = gradeVocab(item, value, pool).tier;
        if (supportsVocabularyHistory(mode)) vocabularyHistory = vocabularyHistoryContext(item, pool ?? "carrier", tier, observation);
        xpAwarded = xpForTier(item.difficulty * 10, tier);
        classifiable = { answers: vocabAnswers(item, pool ?? "carrier") };
      } else {
        const item = unit.grammar.find((g) => g.id === itemId);
        if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
        tier = gradeGrammar(item, input as GrammarInput).tier;
        xpAwarded = xpForTier(item.difficulty * 10, tier);
        classifiable = item;
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
      classifiable = item as unknown as ClassifiableItem;
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
      classifiable = item as unknown as ClassifiableItem;
    } else {
      // Story grammar uses the same grader and XP pool as unit grammar.
      // Persistence derives the original-scene review context from `.ci.`.
      const cr = cref!;
      kind = "reading";
      unitSlug = cr.unitSlug;
      grade = cr.grade;
      const storyId = storyIdForGrade(cr.grade);
      const item = (storyId ? loadStoryComprehension(storyId) : null)?.items.find((i) => i.id === itemId);
      if (!item) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
      if (item.structureId) {
        const unit = await loadUnitWithOverrides(cr.unitSlug);
        if (!unit.grammar.some((g) => g.structureId === item.structureId)) {
          return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
        }
        kind = "grammar";
      }
      tier = gradeGrammar(item as unknown as GrammarItem, input as GrammarInput).tier;
      xpAwarded = xpForTier(item.difficulty * 10, tier);
      classifiable = item as unknown as ClassifiableItem;
    }
  } catch (error) {
    if (liveResolved && live) return reservationRefusal(error) ?? live.liveError(error);
    if (duelCoordinates) return reservationRefusal(error) ?? arenaError(error);
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // 6b. D-2: name the KIND of wrong (trap-registry@1 id) into the attempt's
  // context jsonb — classification never changes the tier or the XP; a null
  // trap is the common case and writes nothing.
  if (mode === "flashcards") xpAwarded = 0; // cgo-109 FLASHCARDS-ZERO: self-report feeds review, earns no XP.
  const trap = tier === "wrong" && typedValue !== null && classifiable ? classifyWrong(classifiable, typedValue) : null;
  // This namespace is server-owned in EVERY mode, including modes that have
  // no vocabulary history adapter. Preserve their own coordinates/context.
  const clientContext = typeof context === "object" && context !== null && !Array.isArray(context)
    ? Object.fromEntries(Object.entries(context).filter(([key]) => key !== "vocabularyHistory"))
    : context;
  const baseContext = vocabularyHistory
    ? { ...(typeof clientContext === "object" && clientContext !== null && !Array.isArray(clientContext) ? clientContext : {}), vocabularyHistory }
    : clientContext;
  const contextWithTrap = trap
    ? { ...(typeof baseContext === "object" && baseContext !== null && !Array.isArray(baseContext) ? baseContext : {}), trap }
    : baseContext;

  // 7. Best-effort persist (idempotent; side-effects gated on first insert).
  try {
    const attempt = {
      userId: acting.userId,
      classId: acting.classId,
      itemId,
      kind,
      ...(cref && kind === "grammar" ? { reviewContext: "story" as const } : {}),
      unitSlug,
      grade,
      mode,
      tier,
      xpAwarded,
      latencyMs: latencyMs ?? null,
      hintUsed: vocabularyHistory?.helpShown !== null && vocabularyHistory?.helpShown !== undefined
        ? vocabularyHistory.helpShown.length > 0 : hintUsed ?? false,
      context: contextWithTrap,
      clientAttemptId,
    };
    const { duplicate, box, dueAt, streak } = duelCoordinates
      ? await writeDuelAnswer(acting, attempt, duelCoordinates, input.kind === "choice" ? input.value : "")
      : liveResolved && live ? await live.writeLiveAnswer(acting, attempt, liveResolved.coordinates, typeof input.value === "string" ? input.value : "", receivedAt)
      : await recordAttempt(getDb(), acting.classScope, attempt);
    // A round displays the original booking even when its first response was lost.
    // Keep the existing incremental reward fields for all other consumers.
    let receipt: { tier: string; xpAwarded: number } | undefined;
    if (mode === "practice" || mode === "daily") {
      const booked = duplicate ? await getPracticeReceipt(getDb(), acting.classScope, attempt) : { tier, xpAwarded };
      if (!booked) throw new Error("practice_receipt_unavailable");
      receipt = booked;
    }
    return NextResponse.json({
      ok: true,
      tier,
      xpAwarded,
      box,
      dueAt: dueAt.toISOString(),
      duplicate,
      ...(receipt ? { receipt } : {}),
      streak,
      ...(trap ? { trap } : {}),
    });
  } catch (error) {
    if (liveResolved && live) return reservationRefusal(error) ?? live.liveError(error);
    if (duelCoordinates) return reservationRefusal(error) ?? arenaError(error);
    return NextResponse.json({ ok: false, error: "persist_failed", tier, xpAwarded, ...(trap ? { trap } : {}) });
  }
}
