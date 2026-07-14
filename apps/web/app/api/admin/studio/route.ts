export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * S-1 · Studio content-overlay mutations (teacher-gated). One POST, three
 * actions (save draft / publish / revert). The allowlist is enforced HERE,
 * server-side, against a FRESH base — twice: at save, and again at publish (so
 * a draft that no longer fits its item after a corpus change cannot go live).
 * The client is never trusted; the editor simply never offers a locked field.
 * Publish/revert are journal-then-flip in the db layer.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { loadOverrideRow, publishOverride, revertOverride, saveOverrideDraft } from "@domigo/db";
import { getDb } from "@domigo/db";
import { loadUnit, normalizePatchColumn, validatePatch, type ItemKind } from "@domigo/content-loader";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { getTeacher } from "@/lib/teacher";

const SaveBody = z.object({
  action: z.literal("save"),
  itemId: z.string().min(1),
  unitSlug: z.string().min(1),
  kind: z.enum(["vocab", "grammar"]),
  patch: z.record(z.string(), z.unknown()),
});
const PublishBody = z.object({ action: z.literal("publish"), itemId: z.string().min(1) });
const RevertBody = z.object({ action: z.literal("revert"), itemId: z.string().min(1) });
const Body = z.discriminatedUnion("action", [SaveBody, PublishBody, RevertBody]);

/** Fresh base item from the corpus (canon + git overlay), or null if gone. */
function freshBase(unitSlug: string, kind: ItemKind, itemId: string): VocabItem | GrammarItem | null {
  try {
    const unit = loadUnit(unitSlug);
    const found = kind === "vocab" ? unit.vocab.find((v) => v.id === itemId) : unit.grammar.find((g) => g.id === itemId);
    return found ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const body = parsed.data;

  // ── save draft ──
  if (body.action === "save") {
    const base = freshBase(body.unitSlug, body.kind, body.itemId);
    if (!base) return NextResponse.json({ ok: false, error: "invalid", errors: [`item ${body.itemId} not found in ${body.unitSlug}`] }, { status: 400 });
    const { ok, errors } = validatePatch(body.kind, body.patch, base);
    if (!ok) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 400 });
    try {
      await saveOverrideDraft(getDb(), { itemId: body.itemId, unitSlug: body.unitSlug, kind: body.kind, patch: body.patch, updatedBy: teacher.userId });
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "draft" });
  }

  // ── publish (re-validate the stored patch against a fresh base first) ──
  if (body.action === "publish") {
    let row;
    try {
      row = await loadOverrideRow(getDb(), body.itemId);
    } catch {
      return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 });
    }
    if (!row) return NextResponse.json({ ok: false, error: "invalid", errors: ["nothing to publish (no draft saved)"] }, { status: 400 });
    const kind: ItemKind = row.kind === "grammar" ? "grammar" : "vocab";
    const base = freshBase(row.unitSlug, kind, body.itemId);
    if (!base) return NextResponse.json({ ok: false, error: "invalid", errors: ["the item no longer exists in the corpus"] }, { status: 400 });
    const { ok, errors } = validatePatch(kind, normalizePatchColumn(row.patch), base);
    if (!ok) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 400 });
    try {
      await publishOverride(getDb(), { itemId: body.itemId, actorId: teacher.userId });
    } catch {
      return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "published" });
  }

  // ── revert to canon ──
  try {
    await revertOverride(getDb(), { itemId: body.itemId, actorId: teacher.userId });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: "reverted" });
}
