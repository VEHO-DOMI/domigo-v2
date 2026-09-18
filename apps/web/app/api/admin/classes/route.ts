/**
 * GET /api/admin/classes — the teacher's own classes.
 *
 * dach-018 · POST is gone. Creating a class wrote `classes.name` and
 * `classes.grade`, and after the switch-over those two columns have exactly ONE
 * writer: the account service, through /api/konto/classes and
 * /api/konto/class-term (SPEC §10 E1). Two writers for one field is the defect
 * the switch-over exists to remove — a class renamed here would be renamed back
 * by the next nightly sync, and nobody would understand why.
 *
 * The method answers 405 with the sentence the admin surface shows, so a stale
 * client learns where the button went instead of failing silently.
 */
import { NextResponse } from "next/server";
import { getDb, listClassesForTeacher } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { kontoBaseUrl } from "@/lib/konto/basis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function POST(): Promise<Response> {
  return NextResponse.json(
    { ok: false, error: "moved", lehrerraum: `${kontoBaseUrl()}/lehrerraum/lehrgruppen` },
    { status: 405 },
  );
}
