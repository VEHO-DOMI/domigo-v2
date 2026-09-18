/**
 * PATCH/POST/DELETE /api/admin/roster/[studentId] — manage one roster student.
 *   • PATCH  { givenName }        → correct the student's real name
 *   • POST   { action:"reset_pin" } → reset to provisional (student must re-claim)
 *   • DELETE                       → remove the student from the roster
 * Teacher-only; each service call is authz'd by teacherId (the student's class must
 * belong to the acting teacher, else a silent no-op). journal-then-flip is enforced
 * inside the service (a roster_event is written before every flip).
 *
 * P3 · GRANDMASTER BRANCH: the platform operator may manage a student in ANY class.
 * The authorization is NOT widened — the owning teacher is resolved server-side and
 * the unchanged, owner-scoped services run with HER id — while the journal records
 * HIM. These endpoints only ever see a student id, never a class, which is why the
 * owner is resolved through the student (getOwnerIdForStudentForGrandmaster).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, getOwnerIdForStudentForGrandmaster, removeStudent, renameStudentGiven, resetStudentPin } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Whose authorization a roster mutation on `studentId` runs under. The caller's own
 * id unless he is the grandmaster, in which case it is the owner of the student's
 * class — and when the grandmaster owns that class himself, the two are the same id,
 * so there is exactly ONE path here and no special case to keep in sync. An
 * unresolvable student falls back to the caller's own id, i.e. the pre-P3 behaviour:
 * the owner-scoped service then simply updates zero rows.
 */
async function authorizingTeacherId(callerId: string, studentId: string): Promise<string> {
  if (!isGrandmaster(callerId)) return callerId;
  const ownerId = await getOwnerIdForStudentForGrandmaster(getDb(), studentId);
  return ownerId ?? callerId;
}

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
    const ownerId = await authorizingTeacherId(teacher.userId, studentId);
    await renameStudentGiven(getDb(), studentId, ownerId, parsed.data.givenName, teacher.userId);
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
    const ownerId = await authorizingTeacherId(teacher.userId, studentId);
    await resetStudentPin(getDb(), studentId, ownerId, teacher.userId);
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
    const ownerId = await authorizingTeacherId(teacher.userId, studentId);
    await removeStudent(getDb(), studentId, ownerId, teacher.userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
