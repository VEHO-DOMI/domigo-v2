/**
 * GET /api/admin/catalog?grade=N — the compact item pick-list for the mock-test
 * builder, resolved from the corpus (no DB). Teacher-only. The builder fetches
 * this when the teacher picks a class so the initial page stays light.
 */
import { NextResponse } from "next/server";
import { getDb, listReservedForClass } from "@domigo/db";
import { catalogForGrade } from "@/lib/assignment-catalog";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const grade = Number(new URL(req.url).searchParams.get("grade"));
  if (![1, 2, 3, 4].includes(grade)) return NextResponse.json({ ok: false, error: "bad_grade" }, { status: 400 });

  const classId = new URL(req.url).searchParams.get("classId");
  let reserved = new Set<string>();
  if (classId) {
    reserved = await listReservedForClass(getDb(), classId).catch(() => new Set<string>());
  }

  const units = catalogForGrade(grade, reserved);
  return NextResponse.json({ ok: true, grade, units });
}
