/**
 * GET/POST /api/admin/classes — the teacher's own classes.
 * GET lists them (with roster counts, inside the class wall); POST creates one,
 * minting its invite code.
 *
 * dach-074 · POST is a dated fallback. Until the switch-over day it works as on
 * main, so a PIN teacher can still set up a class. From 00:00 Vienna that day it
 * answers 405 with the address of the Lehrer-Raum (lib/konto/rueckfall-antwort.ts):
 * after the switch-over `classes.name` and `classes.grade` have exactly ONE
 * writer, the account service (SPEC §10 E1) — a class renamed here would be
 * renamed back by the next nightly sync, and nobody would understand why.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClass, getDb, listClassesForTeacher, validateClassName, validateGrade } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { lokalesSchreibenZu } from "@/lib/konto/rueckfall-antwort";

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
    const classes = await listClassesForTeacher(getDb(), teacher.classScope, teacher.userId);
    return NextResponse.json({ ok: true, classes });
  } catch {
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  const zu = lokalesSchreibenZu();
  if (zu) return zu;
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
