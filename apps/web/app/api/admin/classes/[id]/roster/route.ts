/**
 * POST /api/admin/classes/[id]/roster — import a pasted roster into the teacher's
 * own class. Accepts either { text } (the paste box, one name per line) or a
 * pre-split { names }. Teacher-only; the service scopes the write by (classId AND
 * teacherId), so importing into a class the teacher doesn't own inserts nothing.
 * journal-then-flip lives in the service (a roster_event is written before the rows).
 *
 * P3 · GRANDMASTER BRANCH: the platform operator may import into ANY class. He does
 * not get a wider WHERE clause — the owning teacher is resolved server-side and the
 * unchanged, owner-scoped service runs with HER id — but the journal records HIM
 * (actorId). Gated on isGrandmaster before the class is looked up at all.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getClassForGrandmaster, getDb, importRoster, parseRoster } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";

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
    // Whose authorization the import runs under: the caller's own, unless he is the
    // grandmaster reaching into someone else's class. When he owns it, the resolved
    // owner IS the caller — one path, no special case.
    let ownerTeacherId = teacher.userId;
    if (isGrandmaster(teacher.userId)) {
      const cls = await getClassForGrandmaster(getDb(), id);
      if (cls) ownerTeacherId = cls.teacherId;
    }
    const imported = await importRoster(getDb(), {
      classId: id,
      teacherId: ownerTeacherId,
      names,
      actorId: teacher.userId, // the journal names the HAND, not the authorization
    });
    return NextResponse.json({ ok: true, imported });
  } catch {
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
