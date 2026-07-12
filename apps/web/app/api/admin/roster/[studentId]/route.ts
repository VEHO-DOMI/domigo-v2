/**
 * PATCH/POST/DELETE /api/admin/roster/[studentId] — manage one roster student.
 *   • PATCH  { givenName }        → correct the student's real name
 *   • POST   { action:"reset_pin" } → reset to provisional (student must re-claim)
 *   • DELETE                       → remove the student from the roster
 * Teacher-only; each service call is authz'd by teacherId (the student's class must
 * belong to the acting teacher, else a silent no-op). journal-then-flip is enforced
 * inside the service (a roster_event is written before every flip).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, removeStudent, renameStudentGiven, resetStudentPin } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RenameSchema = z.object({ givenName: z.string() });
const PostSchema = z.object({ action: z.literal("reset_pin") });

export async function PATCH(req: Request, { params }: { params: Promise<{ studentId: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { studentId } = await params;
  const parsed = RenameSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  if (parsed.data.givenName.trim() === "") {
    return NextResponse.json({ ok: false, error: "invalid", errors: ["Give the student a name."] }, { status: 400 });
  }

  try {
    await renameStudentGiven(getDb(), studentId, teacher.userId, parsed.data.givenName);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ studentId: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { studentId } = await params;
  const parsed = PostSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  try {
    await resetStudentPin(getDb(), studentId, teacher.userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ studentId: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { studentId } = await params;
  try {
    await removeStudent(getDb(), studentId, teacher.userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
