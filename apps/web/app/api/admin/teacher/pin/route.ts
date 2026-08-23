/**
 * POST /api/admin/teacher/pin — a teacher changes their OWN PIN (WS-AUTH Phase A).
 *
 * Retires the "edit public.users on the production DB" ritual. Flow:
 *   1. authorize the acting teacher (session role "teacher", or the dev fallback);
 *   2. verify the CURRENT pin against the dual-read identity (v2 if already
 *      promoted, else the read-only v1 mirror) — the lookup returns the hash;
 *   3. write the NEW hash to the WRITABLE v2 identity, REUSING the teacher's id so
 *      their classes/assignments stay attached (first change promotes v1→v2; the
 *      ordered dual-read then prefers the v2 row). public.* is never written.
 *
 * The route hashes here (bcrypt stays out of @domigo/db). A wrong current pin is a
 * 400 (not 500) so the UI can say "that's not your current PIN".
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  bumpAndCheck,
  clearThrottle,
  getDb,
  lookupTeacherAuthById,
  SIGNIN_POLICY,
  teacherThrottleKey,
  upsertTeacherIdentity,
  writeTeacherEvent,
} from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { hashPin, TEACHER_PIN_PATTERN, verifyPin } from "@/lib/pin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  currentPin: z.string(),
  newPin: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { currentPin, newPin } = parsed.data;

  // The new PIN must be a valid teacher PIN (4–6 digits) before we touch anything.
  if (!TEACHER_PIN_PATTERN.test(newPin)) {
    return NextResponse.json({ ok: false, error: "invalid_new_pin" }, { status: 400 });
  }

  try {
    // Who is the teacher today, and what's their current hash? (v2 or v1 mirror.)
    const current = await lookupTeacherAuthById(getDb(), teacher.userId);
    if (!current) return NextResponse.json({ ok: false, error: "wrong_current_pin" }, { status: 400 });

    // K2a · THE BRAKE. This endpoint answers "is this her PIN — yes or no" as fast as
    // bcrypt can run, which makes it the most convenient guessing oracle in the product.
    // It shares its counter with the sign-in door on purpose: both ask about the same
    // secret, so eight failures anywhere are eight failures. She IS signed in, so unlike
    // the sign-in page this surface may say plainly what happened.
    const key = teacherThrottleKey(current.displayName);
    if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) {
      return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
    }
    if (!(await verifyPin(currentPin, current.pinHash))) {
      return NextResponse.json({ ok: false, error: "wrong_current_pin" }, { status: 400 });
    }
    await clearThrottle(getDb(), key); // she proved it — the slate is wiped

    // Journal-then-apply (the house order): the intent lands BEFORE the change, so a
    // crash between the two leaves a harmless orphan entry, never an unrecorded PIN.
    // Her own hand, hence actor = herself. K2a closes the gap this route sat in.
    const pinHash = await hashPin(newPin);
    await writeTeacherEvent(getDb(), {
      teacherId: teacher.userId,
      kind: "pin_change",
      actorId: teacher.userId,
      payload: { via: "settings" },
    });
    // Write the new hash to the writable v2 identity (promote-or-update, id reused).
    // `email` is deliberately NOT passed — omitting the key leaves a stored address
    // untouched (teacher-identity.ts), and a PIN change has no business erasing one.
    await upsertTeacherIdentity(getDb(), { id: teacher.userId, displayName: current.displayName, pinHash });
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Surface the real cause server-side (non-prod) — an opaque persist_failed cost
    // real debugging time during the Studio launch.
    console.error("[teacher/pin] change failed:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
