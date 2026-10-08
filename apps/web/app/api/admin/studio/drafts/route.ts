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
import { getDb, recordCheck, type DraftAction } from "@domigo/db";
import { loadUnit, loadUnitStructures, normalizePatchColumn, validateFullItem, type ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { getTeacher } from "@/lib/teacher";
import { preGate } from "@/lib/studio-gate";
import { checkStudioContent } from "@/lib/studio-content-check";
import { deleteCheckedStudioDraft, loadCheckedStudioDraft, saveCheckedStudioDraft, setCheckedStudioStatus } from "../../../../../../../packages/db/src/content-check-journal.ts";
import { DEFAULT_STUDIO_SOLVER_MODEL } from "@/lib/studio-solver-models";

const SaveBody = z.object({
  action: z.literal("save"),
  itemId: z.string().min(1),
  unitSlug: z.string().min(1),
  kind: z.enum(["vocab", "grammar"]),
  draftAction: z.enum(["create", "replace", "remove"]),
  draftId: z.uuid().optional(),
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

  const classId = teacher.classScope[0];
  if (!classId) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  const access = { scope: teacher.classScope, classId, teacherId: teacher.userId };

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
      if (kind === "grammar" && !loadUnitStructures(body.unitSlug).some((structure) => structure.id === (item as GrammarItem).structureId)) return bad(["Die Grammatik-Struktur gehört nicht zu dieser Unit."]);
    }

    try {
      const previous = await loadCheckedStudioDraft(getDb(), access, body.itemId);
      if (previous && previous.updatedBy !== teacher.userId) return bad(["Dieser Entwurf gehört einer anderen Lehrkraft."], 403);
      if (previous?.status === "checking") return bad(["Die Prüfung läuft noch. Warte auf das Urteil, bevor du den Entwurf änderst."], 409);
      if (body.draftId && previous?.id !== body.draftId) return bad(["Der gespeicherte Entwurf wurde geändert. Lade die Seite neu."], 409);
      if (!(await saveCheckedStudioDraft(getDb(), access, { itemId: body.itemId, unitSlug: body.unitSlug, kind, item, action: draftAction }, body.draftId))) {
        return bad(["Der Entwurf wird bereits geprüft oder gehört einer anderen Lehrkraft."], 409);
      }
    } catch (e) {
      return persistFailed("save", e);
    }
    const saved = await loadCheckedStudioDraft(getDb(), access, body.itemId);
    if (!saved) return bad(["Der gespeicherte Entwurf konnte nicht bestätigt werden."], 503);
    return NextResponse.json({ ok: true, status: "draft", draftId: saved.id });
  }

  // ── publish (the hard block) ──
  if (body.action === "publish") {
    let row;
    try {
      row = await loadCheckedStudioDraft(getDb(), access, body.itemId);
    } catch (e) {
      return persistFailed("loadDraft", e, "read_failed");
    }
    if (!row) return bad(["Kein eigener Entwurf zum Veröffentlichen gefunden."], 403);
    if (row.updatedBy !== teacher.userId) return bad(["Dieser Entwurf gehört einer anderen Lehrkraft."], 403);
    const kind: ItemKind = row.kind === "grammar" ? "grammar" : "vocab";

    // remove: nothing to solve — record the (trivial) check, then flip.
    if (row.action === "remove") {
      if (!canonHas(row.unitSlug, kind, body.itemId)) return bad(["the item to remove no longer exists in the corpus"]);
      try {
        await recordCheck(getDb(), { draftId: row.id, checkKind: "zod", verdict: "remove", evidence: { note: "remove drafts skip the solve gate" } });
        if (!(await setCheckedStudioStatus(getDb(), access, body.itemId, normalizePatchColumn(row.item), "published"))) return bad(["Der Entwurf wurde während der Prüfung geändert."], 409);
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
      await setCheckedStudioStatus(getDb(), access, body.itemId, item, "check_failed");
      return NextResponse.json({ ok: false, error: "gate_failed", stage: pre.stage, errors: pre.errors }, { status: 400 });
    }

    // Exact-byte journal claim first: concurrent/repeated publish requests
    // share one subscription run. The model and thinking cannot be weakened by
    // a client picker. Publication follows the persisted verdict only.
    try {
      if (!(await setCheckedStudioStatus(getDb(), access, body.itemId, item, "checking"))) return bad(["Der Entwurf wurde geändert."], 409);
      const gate = await checkStudioContent(access, kind, item, row.unitSlug);
      if (gate.status === "passed") {
        if (!(await setCheckedStudioStatus(getDb(), access, body.itemId, normalizePatchColumn(row.item), "published"))) return bad(["Der Entwurf wurde während der Prüfung geändert."], 409);
        return NextResponse.json({ ok: true, status: "published" });
      }
      await setCheckedStudioStatus(getDb(), access, body.itemId, item, gate.status === "checking" ? "checking" : "check_failed");
      if (gate.status === "blocked") return bad(gate.errors, 422);
      return NextResponse.json({ ok: true, status: "checking", runId: gate.runId, model: DEFAULT_STUDIO_SOLVER_MODEL });
    } catch {
      return NextResponse.json({ ok: false, error: "content_check_failed", errors: ["Die Prüfung konnte nicht bestätigt werden."] }, { status: 503 });
    }
  }

  if (body.action === "poll") {
    const match = /^studio:([0-9a-f-]{36}):(.+)$/.exec(body.runId);
    if (!match) return bad(["Dieser Prüflauf kann nicht fortgesetzt werden. Öffne den Entwurf und prüfe ihn erneut."], 422);
    try {
      const row = await loadCheckedStudioDraft(getDb(), access, match[2]!);
      if (!row || row.updatedBy !== teacher.userId) return bad(["Dieser Entwurf gehört nicht zu deinem Konto."], 403);
      const item = normalizePatchColumn(row.item) as VocabItem | GrammarItem;
      const gate = await checkStudioContent(access, row.kind === "grammar" ? "grammar" : "vocab", item, row.unitSlug, match[1]);
      if (gate.status !== "checking" && !(await setCheckedStudioStatus(getDb(), access, row.itemId, item, gate.status === "passed" ? "published" : "check_failed"))) return bad(["Der Entwurf wurde geändert."], 409);
      return NextResponse.json({ ok: true, kind: gate.status === "checking" ? "running" : gate.status, note: gate.errors.join("; ") || undefined });
    } catch {
      return NextResponse.json({ ok: false, error: "content_check_failed" }, { status: 503 });
    }
  }

  // ── revert (discard the draft → back to canon) ──
  try {
    const row = await loadCheckedStudioDraft(getDb(), access, body.itemId);
    if (!row || row.updatedBy !== teacher.userId) return bad(["Dieser Entwurf gehört einer anderen Lehrkraft."], 403);
    if (row?.status === "checking") return bad(["Die Prüfung läuft noch."], 409);
    if (!(await deleteCheckedStudioDraft(getDb(), access, body.itemId, row.id))) return bad(["Der Entwurf wird bereits geprüft oder wurde geändert."], 409);
  } catch (e) {
    return persistFailed("revert", e);
  }
  return NextResponse.json({ ok: true, status: "reverted" });
}
