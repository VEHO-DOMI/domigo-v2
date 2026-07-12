/**
 * POST /api/admin/classes/[id]/roster — import a pasted roster into the teacher's
 * own class. Accepts either { text } (the paste box, one name per line) or a
 * pre-split { names }. Teacher-only; the service scopes the write by (classId AND
 * teacherId), so importing into a class the teacher doesn't own inserts nothing.
 * journal-then-flip lives in the service (a roster_event is written before the rows).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, importRoster, parseRoster } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ImportSchema = z.object({
  text: z.string().optional(),
  names: z.array(z.string()).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const parsed = ImportSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });

  // Prefer the pasted text (cleaned by the shared parser); fall back to a names array.
  const names = parsed.data.text != null ? parseRoster(parsed.data.text) : parsed.data.names ?? [];
  if (names.length === 0) return NextResponse.json({ ok: false, error: "no_names" }, { status: 400 });

  try {
    const imported = await importRoster(getDb(), { classId: id, teacherId: teacher.userId, names });
    return NextResponse.json({ ok: true, imported });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
