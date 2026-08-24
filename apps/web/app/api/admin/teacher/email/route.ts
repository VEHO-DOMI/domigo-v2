/**
 * POST /api/admin/teacher/email — the teacher stores (or clears) her recovery address.
 *
 * WHY THE CURRENT PIN IS REQUIRED. This address is the key to the account: whoever
 * can set it can have a reset link sent to themselves. A borrowed session on an
 * unlocked staffroom laptop is the realistic threat, so the same re-verification
 * that guards a PIN change guards this — and the brake counts a wrong answer here
 * exactly as it counts one at the door.
 *
 * IT ALSO SOLVES THE PROMOTION PROBLEM, for free. A teacher who still lives only in
 * the v1 mirror has no writable row to put an address in. `upsertTeacherIdentity`
 * promotes her — but it needs a `pinHash`, and the dual-read above has just handed
 * us her current one. So the existing hash moves across unchanged: nothing is
 * re-hashed, and her PIN keeps working because it is literally the same hash.
 *
 * THE HANDLE IS READ, NEVER GUESSED. `displayName` comes from the same ordered
 * dual-read the sign-in uses; on a first promotion whatever we pass BECOMES her
 * sign-in handle, so a placeholder would rename her out of her own account (the K1b
 * trap, paid for once).
 *
 * AN EMPTY STRING CLEARS THE ADDRESS. That is a real request — a colleague who
 * changes schools should be able to take her inbox out of our database — and it is
 * distinct from omitting the field, which leaves it untouched.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  bumpAndCheck,
  clearThrottle,
  getDb,
  isMissingDbObject,
  lookupTeacherAuthById,
  SIGNIN_POLICY,
  teacherThrottleKey,
  upsertTeacherIdentity,
  writeTeacherEvent,
} from "@domigo/db";
import { getTeacher } from "@/lib/teacher";
import { verifyPin } from "@/lib/pin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  // Bcrypt-Eingabe-Hygiene: die Rate-Bremse sitzt davor, das hier ist der Riegel dahinter.
  currentPin: z.string().max(64),
  /** "" clears the stored address; anything else must look like one. */
  email: z.string().max(254),
});

// Deliberately loose. The only real proof that an address works is a mail arriving
// at it, and a strict pattern's job here would mostly be to reject valid addresses.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request): Promise<Response> {
  const teacher = await getTeacher(req);
  if (!teacher) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const { currentPin } = parsed.data;
  const email = parsed.data.email.trim();
  if (email !== "" && !EMAIL_SHAPE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    const current = await lookupTeacherAuthById(getDb(), teacher.userId);
    if (!current) return NextResponse.json({ ok: false, error: "wrong_current_pin" }, { status: 400 });

    const key = teacherThrottleKey(current.displayName);
    if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) {
      return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
    }
    if (!(await verifyPin(currentPin, current.pinHash))) {
      return NextResponse.json({ ok: false, error: "wrong_current_pin" }, { status: 400 });
    }
    await clearThrottle(getDb(), key);

    // Journal-then-apply. The entry records THAT an address now exists, never which:
    // an audit trail that leaks the thing it audits is worse than none.
    await writeTeacherEvent(getDb(), {
      teacherId: teacher.userId,
      kind: "email_set",
      actorId: teacher.userId,
      payload: { emailSet: email !== "" },
    });
    await upsertTeacherIdentity(getDb(), {
      id: teacher.userId,
      displayName: current.displayName,
      pinHash: current.pinHash, // unchanged — she just proved it is hers
      email: email === "" ? null : email,
    });
    return NextResponse.json({ ok: true, email: email === "" ? null : email });
  } catch (e) {
    // The declared window: merged, deployed, migration 0016 not yet applied by hand.
    // That is a state of the installation, not a fault of hers — say so plainly
    // instead of a generic failure she would try to work around.
    if (isMissingDbObject(e)) {
      return NextResponse.json({ ok: false, error: "not_yet_available" }, { status: 503 });
    }
    console.error("[teacher/email] save failed:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
