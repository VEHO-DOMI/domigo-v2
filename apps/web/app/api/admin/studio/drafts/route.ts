export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// publish does the sandbox setup + npm install synchronously (~20–40s) before
// the solve runs DETACHED; give the function room for that setup.
export const maxDuration = 60;

/**
 * S-2 · Studio full-item CRUD mutations (teacher-gated). One POST, actions:
 * save draft / publish / poll / revert. The publish action is the HARD BLOCK: a
 * created/replaced item goes live ONLY after
 *   (a) the free pre-gate — zod + frameability + key-solvability, AND
 *   (b) the sandbox blind-solve gate (S-2b) — a capable model solves the item
 *       BLIND in a Vercel Sandbox (authed by the operator's Claude subscription
 *       OAuth token), and its answer grades "correct" through @domigo/engine.
 * The blind-solve is ASYNC (a sandbox outlives a serverless function): publish
 * kicks it off + returns { status: "checking", runId }; the client polls the
 * `poll` action until the run reaches a terminal state. journal-then-flip: the
 * check is recorded BEFORE the draft flips (in the poll's grade step). A
 * "remove" draft skips the solve gate — there is nothing to solve.
 *
 * The client is never trusted: canon-membership coherence (create ⇒ new id,
 * replace/remove ⇒ existing id), id↔unit coherence, and the full schema are
 * enforced HERE, server-side, at save AND re-checked at publish.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSolveRun, deleteDraft, getDb, loadDraft, recordCheck, saveDraft, setDraftStatus, type DraftAction } from "@domigo/db";
import { loadUnit, normalizePatchColumn, validateFullItem, type ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { getTeacher } from "@/lib/teacher";
import { preGate } from "@/lib/studio-gate";
import { startSolveRun, pollSolveRun } from "@/lib/studio-solve-sandbox";
import { DEFAULT_STUDIO_SOLVER_MODEL, isStudioSolverModel } from "@/lib/studio-solver-models";

const SaveBody = z.object({
  action: z.literal("save"),
  itemId: z.string().min(1),
  unitSlug: z.string().min(1),
  kind: z.enum(["vocab", "grammar"]),
  draftAction: z.enum(["create", "replace", "remove"]),
  item: z.unknown(), // full item (create/replace); null/ignored for remove
});
const PublishBody = z.object({ action: z.literal("publish"), itemId: z.string().min(1), model: z.string().optional() });
const PollBody = z.object({ action: z.literal("poll"), runId: z.string().min(1) });
const RevertBody = z.object({ action: z.literal("revert"), itemId: z.string().min(1) });
// WS-AUTH B · Studio preview: run the FREE pre-gate (zod → frameability →
// key-solvability) on an in-progress item WITHOUT saving or publishing, so a
// teacher gets instant "is this sound + is my key solvable" feedback. Same
// preGate the publish path runs (one brain); read-only, no DB.
const PregateBody = z.object({ action: z.literal("pregate"), kind: z.enum(["vocab", "grammar"]), item: z.unknown() });
const Body = z.discriminatedUnion("action", [SaveBody, PublishBody, PollBody, RevertBody, PregateBody]);

/** "g2u03.w.foo" / "g2u03.gi.key.mc.001" → "g2-u03" (the unit slug). */
function unitOfId(itemId: string): string | null {
  const m = /^(g[1-4])u(\d{2})\./.exec(itemId);
  return m ? `${m[1]}-u${m[2]}` : null;
}

/** Is `itemId` an item that already exists in the canon corpus (+ git overlay)? */
function canonHas(unitSlug: string, kind: ItemKind, itemId: string): boolean {
  try {
    const unit = loadUnit(unitSlug);
    const list = kind === "vocab" ? unit.vocab : unit.grammar;
    return list.some((it) => it.id === itemId);
  } catch {
    return false;
  }
}

function bad(errors: string[], status = 400): Response {
  return NextResponse.json({ ok: false, error: "invalid", errors }, { status });
}

/** A DB write/read failed. Always log it server-side; surface the real reason to
 *  the client ONLY on non-production (preview/dev) — never leak DB detail to prod. */
function persistFailed(where: string, e: unknown, code = "persist_failed"): Response {
  console.error(`[studio/drafts] ${where} ${code}:`, e);
  const detail = process.env.VERCEL_ENV !== "production" ? [`${where}: ${String(e instanceof Error ? e.message : e).slice(0, 400)}`] : undefined;
  return NextResponse.json({ ok: false, error: code, errors: detail }, { status: 500 });
}

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const body = parsed.data;

  // ── pregate (dry run) · WS-AUTH B ──
  // The FREE pre-gate on an in-progress item — no save, no publish, no DB. Lets a
  // teacher confirm the task is structurally sound and the answer key is solvable
  // before the real (slower, AI) publish gate. Identical preGate the publish runs.
  if (body.action === "pregate") {
    const pre = preGate(body.kind as ItemKind, body.item);
    return NextResponse.json({ ok: pre.ok, stage: pre.stage, errors: pre.errors, keyChecks: pre.keyChecks });
  }

  // ── save draft ──
  if (body.action === "save") {
    const kind = body.kind as ItemKind;
    const draftAction = body.draftAction as DraftAction;

    // id ↔ unit coherence
    const unitOf = unitOfId(body.itemId);
    if (unitOf !== body.unitSlug) return bad([`item id "${body.itemId}" does not belong to unit "${body.unitSlug}"`]);

    // canon-membership coherence — create must be NEW, replace/remove must EXIST
    const exists = canonHas(body.unitSlug, kind, body.itemId);
    if (draftAction === "create" && exists) return bad([`"${body.itemId}" already exists — use replace, not create`]);
    if ((draftAction === "replace" || draftAction === "remove") && !exists) {
      return bad([`"${body.itemId}" is not in the corpus — nothing to ${draftAction}`]);
    }

    // full-item schema (create/replace only; remove carries no item)
    let item: unknown = null;
    if (draftAction !== "remove") {
      item = body.item;
      const asId = (item as { id?: unknown } | null)?.id;
      if (asId !== body.itemId) return bad([`the item's own id must equal "${body.itemId}"`]);
      const v = validateFullItem(kind, item);
      if (!v.ok) return NextResponse.json({ ok: false, error: "invalid", errors: v.errors }, { status: 400 });
    }

    try {
      await saveDraft(getDb(), { itemId: body.itemId, unitSlug: body.unitSlug, kind, item, action: draftAction, updatedBy: teacher.userId });
    } catch (e) {
      return persistFailed("save", e);
    }
    return NextResponse.json({ ok: true, status: "draft" });
  }

  // ── publish (the hard block) ──
  if (body.action === "publish") {
    let row;
    try {
      row = await loadDraft(getDb(), body.itemId);
    } catch (e) {
      return persistFailed("loadDraft", e, "read_failed");
    }
    if (!row) return bad(["nothing to publish (no draft saved)"]);
    const kind: ItemKind = row.kind === "grammar" ? "grammar" : "vocab";

    // remove: nothing to solve — record the (trivial) check, then flip.
    if (row.action === "remove") {
      if (!canonHas(row.unitSlug, kind, body.itemId)) return bad(["the item to remove no longer exists in the corpus"]);
      try {
        await recordCheck(getDb(), { draftId: row.id, checkKind: "zod", verdict: "remove", evidence: { note: "remove drafts skip the solve gate" } });
        await setDraftStatus(getDb(), body.itemId, "published");
      } catch (e) {
        return persistFailed("remove-publish", e);
      }
      return NextResponse.json({ ok: true, status: "published" });
    }

    const item = normalizePatchColumn(row.item) as VocabItem | GrammarItem;

    // layer 1–3 · free pre-gate
    const pre = preGate(kind, item);
    try {
      await recordCheck(getDb(), { draftId: row.id, checkKind: "zod", verdict: pre.ok ? "pass" : "fail", evidence: { stage: pre.stage, errors: pre.errors, keyChecks: pre.keyChecks } });
    } catch (e) {
      return persistFailed("record-check", e);
    }
    if (!pre.ok) {
      await setDraftStatus(getDb(), body.itemId, "check_failed").catch(() => {});
      return NextResponse.json({ ok: false, error: "gate_failed", stage: pre.stage, errors: pre.errors }, { status: 400 });
    }

    // layer 4 · ASYNC sandbox blind-solve (subscription OAuth). Create the run
    // row, spin up + kick off the detached sandbox, and hand back a runId; the
    // client polls until it reaches a terminal state (the poll grades + flips).
    const model = body.model && isStudioSolverModel(body.model) ? body.model : DEFAULT_STUDIO_SOLVER_MODEL;
    await setDraftStatus(getDb(), body.itemId, "checking").catch(() => {});
    let runId: string;
    try {
      runId = await createSolveRun(getDb(), { itemId: body.itemId, unitSlug: row.unitSlug, kind, model, triggeredBy: teacher.userId });
    } catch (e) {
      return persistFailed("create-run", e);
    }
    try {
      await startSolveRun(runId); // startSolveRun marks the run failed on setup error
    } catch (err) {
      await setDraftStatus(getDb(), body.itemId, "check_failed").catch(() => {});
      return NextResponse.json({ ok: false, error: "solve_start_failed", errors: [err instanceof Error ? err.message : String(err)] }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "checking", runId, model });
  }

  // ── poll a running solve (grade + flip happens here when it finishes) ──
  if (body.action === "poll") {
    const result = await pollSolveRun(body.runId);
    return NextResponse.json({ ok: true, ...result });
  }

  // ── revert (discard the draft → back to canon) ──
  try {
    await deleteDraft(getDb(), body.itemId);
  } catch (e) {
    return persistFailed("revert", e);
  }
  return NextResponse.json({ ok: true, status: "reverted" });
}
