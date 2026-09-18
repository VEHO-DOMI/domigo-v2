/**
 * POST /api/admin/writing-review — a teacher marks one writing submission (K6a).
 *
 * THE GATE IS HERE, not in the page. The class page hides the form from anyone who
 * may not use it, but hiding a form is convenience; this route resolves the class
 * ITSELF and hands the service the owner's id, and the service's UPDATE carries the
 * ownership condition in its WHERE clause. A tampered body can therefore name any
 * pair it likes: the worst it achieves is zero rows.
 *
 * NOTHING THE CLIENT SAYS ABOUT WHO OWNS WHAT IS BELIEVED. The body names a class;
 * the server looks that class up (owner-scoped first, grandmaster-adopted second,
 * exactly as the page does) and derives the AUTHORIZING teacher from the database
 * row — never from the request.
 *
 * TWO IDS, AND THE DIFFERENCE IS THE POINT (the teacher-journal doctrine): the
 * authorizing teacher is WHOSE CLASSES may be reached, the acting teacher is WHOSE
 * HAND set the mark. On the ordinary path they are the same person; when the
 * grandmaster works in a colleague's class they are not, and the journal says so.
 *
 * ⚠ NOTHING OF THIS REACHES THE CHILD. There is no student-facing counterpart to
 * this route and none is planned here: the mark and the comment are a teacher
 * surface, pending the D-6 privacy gate and a design of its own (W-2). Anyone adding
 * a student read path is adding a new decision, not finishing this one.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  MAX_FEEDBACK_LENGTH,
  MAX_SCORE,
  MIN_SCORE,
  getClassForGrandmaster,
  getClassForTeacher,
  getDb,
  gradeSubmission,
} from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  submissionId: z.string().min(1),
  classId: z.string().min(1),
  score: z.number().int().min(MIN_SCORE).max(MAX_SCORE),
  // An empty comment is a legitimate answer ("points only"), so the field is
  // optional and blank-tolerant; the service turns blank into null.
  feedback: z.string().max(MAX_FEEDBACK_LENGTH).optional(),
});

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { submissionId, classId, score, feedback } = parsed.data;

  // WHOSE classes may be reached — read from the database, not from the body.
  // Owner first; only a grandmaster gets the un-scoped second look.
  let authorizingTeacherId: string | null = null;
  const eigen = await getClassForTeacher(getDb(), classId, teacher.userId).catch(() => null);
  if (eigen) {
    authorizingTeacherId = teacher.userId;
  } else if (isGrandmaster(teacher.userId)) {
    const fremd = await getClassForGrandmaster(getDb(), classId).catch(() => null);
    if (fremd) authorizingTeacherId = fremd.teacherId;
  }
  if (!authorizingTeacherId) {
    return NextResponse.json({ ok: false, error: "class_not_found" }, { status: 404 });
  }

  try {
    const res = await gradeSubmission(getDb(), {
      submissionId,
      score,
      feedback: feedback ?? null,
      teacherId: authorizingTeacherId,
      actorId: teacher.userId,
    });
    if (res.ok) return NextResponse.json({ ok: true, score });
    // "no such submission" and "not yours" are one answer on purpose — see the
    // service header: distinguishing them would confirm other teachers' rows by id.
    if (res.reason === "not_found") {
      return NextResponse.json({ ok: false, error: "submission_not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "no_grading_columns" }, { status: 503 });
  } catch (e) {
    // ⚠ The child's text and the teacher's words never enter a log line. Only the
    // failure does — the ids are enough to find the row again.
    console.error("[writing-review] failed:", e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
