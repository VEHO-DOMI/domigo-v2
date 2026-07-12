/**
 * PATCH/DELETE /api/admin/classes/[id] — edit one of the teacher's own classes.
 * PATCH renames it ({ name }); DELETE soft-archives it. Both pass the acting
 * teacher's id to the service, which scopes the write by (id AND teacherId) — so
 * a teacher editing a class they don't own updates zero rows (a silent no-op),
 * never another teacher's class. Teacher-only.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { archiveClass, getDb, renameClass, validateClassName } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RenameSchema = z.object({ name: z.string() });

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
