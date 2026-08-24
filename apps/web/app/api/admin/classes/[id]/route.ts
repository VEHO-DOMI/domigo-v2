/**
 * PATCH/POST/DELETE /api/admin/classes/[id] — edit one of the teacher's own classes.
 * PATCH renames it ({ name }); DELETE soft-archives it; POST { action:"unarchive" }
 * brings an archived one back. All pass the acting teacher's id to the service, which
 * scopes the write by (id AND teacherId) — so a teacher editing a class they don't own
 * updates zero rows, never another teacher's class. Teacher-only.
 *
 * K9b · GRANDMASTER BRANCH on unarchive only, mirroring the roster route: the operator
 * does NOT get a wider WHERE clause — the owning teacher is resolved server-side and
 * the unchanged, owner-scoped service runs with HER id — but the journal records HIM.
 * Archiving deliberately has no such branch (see archiveClass's own note): the rank
 * reaches into the correcting direction, never the retiring one.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveClass, getClassForGrandmaster, getDb, renameClass, unarchiveClass, validateClassName } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RenameSchema = z.object({ name: z.string() });
const ActionSchema = z.object({ action: z.literal("unarchive") });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const parsed = RenameSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const nameError = validateClassName(parsed.data.name);
  if (nameError) return NextResponse.json({ ok: false, error: "invalid", errors: [nameError] }, { status: 400 });

  try {
    await renameClass(getDb(), id, teacher.userId, parsed.data.name);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const parsed = ActionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  try {
    // Whose authorization the un-archive runs under: the caller's own, unless he is
    // the grandmaster reaching into someone else's class. When he owns it, the
    // resolved owner IS the caller — one path, no special case.
    let ownerTeacherId = teacher.userId;
    if (isGrandmaster(teacher.userId)) {
      const cls = await getClassForGrandmaster(getDb(), id);
      if (cls) ownerTeacherId = cls.teacherId;
    }
    const restored = await unarchiveClass(getDb(), id, ownerTeacherId, teacher.userId);
    // Zero rows is an honest state, not a crash: the class is someone else's, gone, or
    // was never archived. Saying "ok" there would report a restore that never happened.
    if (!restored) return NextResponse.json({ ok: false, error: "not_archived" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { id } = await params;
  try {
    await archiveClass(getDb(), id, teacher.userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
