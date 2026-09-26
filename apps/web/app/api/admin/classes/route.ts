/**
 * GET/POST /api/admin/classes — the teacher's own classes.
 * GET lists them (with roster counts, inside the class wall).
 *
 * dach-108 · POST answers 405 with the address of the Lehrer-Raum, always
 * (lib/konto/klassen-antwort.ts): `classes.name` and `classes.grade` have exactly
 * ONE writer, the account service (SPEC §10 E1) — a class made here would be a
 * class konto does not know, and a rename would be undone by the nightly sync.
 */
import { NextResponse } from "next/server";
import { getDb, listClassesForTeacher } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { lokalesSchreibenZu } from "@/lib/konto/klassen-antwort";

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

export function POST(): Response {
  return lokalesSchreibenZu();
}
