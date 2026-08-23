/**
 * POST /api/admin/teacher-pin/reset — the grandmaster sets a TRANSITIONAL PIN for
 * a colleague who is locked out (K1b, pulled forward from K2).
 *
 * WHY NOT THE STUDENT PATTERN. A locked-out student is reset to provisional (hash
 * emptied) and re-claims through the join link. A teacher has no such way back in:
 * the P2 invite link only lists EMPTY classes, and hers has children in it. An
 * emptied hash would therefore not be a reset but a lock-out. So the operator sets
 * a PIN, tells her, and she changes it herself under Einstellungen.
 *
 * ⚠ THE TRAP THIS ROUTE IS BUILT AROUND. `upsertTeacherIdentity` needs a
 * `displayName`, and for a teacher that name IS the handle she types to sign in.
 * On her FIRST promotion from the v1 mirror into domigo_v2, whatever we pass
 * becomes that handle — so a placeholder ("unbekannt", or the class list's
 * display label) would silently rename her out of her own account. The real handle
 * is therefore read server-side through the ordered dual-read
 * (`lookupTeacherAuthById`, the same source the sign-in uses) and, when it cannot
 * be resolved, the route REFUSES. Never a guess.
 *
 * That lookup is also the role gate: it filters `role='teacher'` in both registers,
 * so a student id resolves to nothing here and this endpoint cannot touch a child's
 * PIN however it is called.
 *
 * NO JOURNAL, and that is declared rather than forgotten: `roster_events.class_id`
 * is NOT NULL and a teacher belongs to no class. The teacher-side audit journal is
 * the known Phase-C gap (teacher-identity.ts:20-24) — the same gap the existing
 * self-service PIN change sits in. It closes in K2, not by widening a class-scoped
 * table here.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, lookupTeacherAuthById, upsertTeacherIdentity } from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { isGrandmaster } from "@/lib/grandmaster";
import { hashPin, TEACHER_PIN_PATTERN } from "@/lib/pin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  teacherId: z.string().min(1),
  newPin: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  const caller = await getTeacher(req);
  if (!caller) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  // Fail closed, before any query.
  if (!isGrandmaster(caller.userId)) return NextResponse.json({ ok: false, error: "not_grandmaster" }, { status: 403 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { teacherId, newPin } = parsed.data;
  if (!TEACHER_PIN_PATTERN.test(newPin)) {
    return NextResponse.json({ ok: false, error: "invalid_new_pin" }, { status: 400 });
  }

  try {
    // The handle she signs in with — read, never assumed. Also the role gate.
    const target = await lookupTeacherAuthById(getDb(), teacherId);
    if (!target) return NextResponse.json({ ok: false, error: "teacher_not_found" }, { status: 404 });

    const pinHash = await hashPin(newPin);
    await upsertTeacherIdentity(getDb(), { id: teacherId, displayName: target.displayName, pinHash });
    return NextResponse.json({ ok: true, displayName: target.displayName });
  } catch (e) {
    console.error("[teacher-pin/reset] failed:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
