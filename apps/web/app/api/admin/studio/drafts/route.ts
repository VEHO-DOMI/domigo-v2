export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * S-2 · Studio full-item CRUD mutations (teacher-gated). One POST, three
 * actions (save draft / publish / revert). The publish action is the HARD
 * BLOCK: a created/replaced item goes live ONLY after
 *   (a) the free pre-gate — zod + frameability + key-solvability, AND
 *   (b) the live blind-solve gate — a capable model solves it and its answer
 *       grades "correct" through the real engine.
 * Both checks are journaled to content_checks BEFORE the status flip
 * (journal-then-flip: Neon HTTP has no transactions, so a crash must leave a
 * recorded check with an un-flipped draft, never a published draft with no
 * check). A "remove" draft skips the solve gate — there is nothing to solve.
 *
 * The client is never trusted: canon-membership coherence (create ⇒ new id,
 * replace/remove ⇒ existing id), id↔unit coherence, and the full schema are
 * enforced HERE, server-side, at save AND re-checked at publish.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteDraft, getDb, loadDraft, recordCheck, saveDraft, setDraftStatus, type DraftAction } from "@domigo/db";
import { loadUnit, normalizePatchColumn, validateFullItem, type ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { getTeacher } from "@/lib/teacher";
import { preGate } from "@/lib/studio-gate";
import { solveGate } from "@/lib/studio-solve";

const SaveBody = z.object({
  action: z.literal("save"),
  itemId: z.string().min(1),
  unitSlug: z.string().min(1),
  kind: z.enum(["vocab", "grammar"]),
  draftAction: z.enum(["create", "replace", "remove"]),
  item: z.unknown(), // full item (create/replace); null/ignored for remove
});
const PublishBody = z.object({ action: z.literal("publish"), itemId: z.string().min(1) });
const RevertBody = z.object({ action: z.literal("revert"), itemId: z.string().min(1) });
const Body = z.discriminatedUnion("action", [SaveBody, PublishBody, RevertBody]);

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

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const body = parsed.data;

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
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "draft" });
  }

  // ── publish (the hard block) ──
  if (body.action === "publish") {
    let row;
    try {
      row = await loadDraft(getDb(), body.itemId);
    } catch {
      return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 });
    }
    if (!row) return bad(["nothing to publish (no draft saved)"]);
    const kind: ItemKind = row.kind === "grammar" ? "grammar" : "vocab";

    // remove: nothing to solve — record the (trivial) check, then flip.
    if (row.action === "remove") {
      if (!canonHas(row.unitSlug, kind, body.itemId)) return bad(["the item to remove no longer exists in the corpus"]);
      try {
        await recordCheck(getDb(), { draftId: row.id, checkKind: "zod", verdict: "remove", evidence: { note: "remove drafts skip the solve gate" } });
        await setDraftStatus(getDb(), body.itemId, "published");
      } catch {
        return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
      }
      return NextResponse.json({ ok: true, status: "published" });
    }

    const item = normalizePatchColumn(row.item) as VocabItem | GrammarItem;

    // layer 1–3 · free pre-gate
    const pre = preGate(kind, item);
    try {
      await recordCheck(getDb(), { draftId: row.id, checkKind: "zod", verdict: pre.ok ? "pass" : "fail", evidence: { stage: pre.stage, errors: pre.errors, keyChecks: pre.keyChecks } });
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    if (!pre.ok) {
      await setDraftStatus(getDb(), body.itemId, "check_failed").catch(() => {});
      return NextResponse.json({ ok: false, error: "gate_failed", stage: pre.stage, errors: pre.errors }, { status: 400 });
    }

    // layer 4 · live blind-solve
    await setDraftStatus(getDb(), body.itemId, "checking").catch(() => {});
    const solve = await solveGate({ kind, item, frame: pre.frame!, grade: row.unitSlug });
    try {
      await recordCheck(getDb(), {
        draftId: row.id,
        checkKind: "blind_solve",
        verdict: solve.ok ? "pass" : "fail",
        evidence: { stage: solve.stage, model: solve.model, effort: solve.effort, candidates: solve.candidates, top: solve.top, usage: solve.usage, note: solve.note },
      });
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    if (!solve.ok) {
      await setDraftStatus(getDb(), body.itemId, "check_failed").catch(() => {});
      return NextResponse.json({ ok: false, error: "gate_failed", stage: solve.stage, errors: solve.note ? [solve.note] : [], candidates: solve.candidates }, { status: 400 });
    }

    // journal-then-flip: the passing checks are already recorded — now flip live.
    try {
      await setDraftStatus(getDb(), body.itemId, "published");
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "published", solvedBy: solve.model });
  }

  // ── revert (discard the draft → back to canon) ──
  try {
    await deleteDraft(getDb(), body.itemId);
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: "reverted" });
}
