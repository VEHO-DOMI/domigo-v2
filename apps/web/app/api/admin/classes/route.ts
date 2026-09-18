/**
 * GET/POST /api/admin/classes — the teacher's own classes.
 * GET lists them (with roster counts); POST creates one, minting its invite code.
 * Teacher-only; every row is scoped to the acting teacher in the service, so a
 * teacher only ever reads or writes their own classes. The body is re-validated
 * server-side with the same pure rule the service enforces (never trust the client).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClass, getDb, listClassesForTeacher, validateClassName, validateGrade } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  name: z.string(),
  grade: z.number().int(),
});

export async function GET(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const classes = await listClassesForTeacher(getDb(), teacher.userId);
    return NextResponse.json({ ok: true, classes });
  } catch {
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = CreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  const errors: string[] = [];
  const nameError = validateClassName(parsed.data.name);
  if (nameError) errors.push(nameError);
  if (!validateGrade(parsed.data.grade)) errors.push("Choose a grade from 1 to 4.");
  if (errors.length > 0) return NextResponse.json({ ok: false, error: "invalid", errors }, { status: 400 });

  try {
    const created = await createClass(getDb(), { name: parsed.data.name, grade: parsed.data.grade, teacherId: teacher.userId });
    return NextResponse.json({ ok: true, class: created }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
