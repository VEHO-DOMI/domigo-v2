/**
 * dach-074 · THE PIN SIGN-IN, as a dated fallback — the two checks from main
 * (apps/web/auth.ts before the adapter), unchanged except for the first line.
 *
 * Until the switch-over day a child still signs in with class code + nickname +
 * PIN and a teacher with nickname + PIN, beside the konto button. From 00:00
 * Vienna on that day both answer `null` BEFORE any database access — a form is
 * not a wall, and the raw POST to /api/auth/callback/{student,teacher} that
 * NextAuth exposes is reachable without any page. See lib/konto/rueckfall.ts.
 *
 * K2a · the brake (auth-throttle) sits here, not on the pages, because these
 * two functions are the floor both doors stand on. Counting an attempt before
 * bcrypt runs keeps a refusal cheap and says nothing, by its timing, about
 * whether the account exists. Every refusal is plain `null`, like a wrong PIN.
 *
 * Reached only from inside `authorize` (runtime nodejs), like anmeldung.ts —
 * bcrypt and the database never ride into the Edge bundle of middleware.ts.
 */
import {
  bumpAndCheck,
  clearThrottle,
  getDb,
  lookupStudentForAuth,
  lookupTeacherForAuth,
  SIGNIN_POLICY,
  studentThrottleKey,
  teacherThrottleKey,
} from "@domigo/db";
import { normalizeInviteCode } from "../invite-code.ts";
import { verifyPin } from "../pin.ts";
import { rueckfallOffen } from "./rueckfall.ts";

export type PinNutzer = {
  id: string;
  name: string;
  role: "student" | "teacher";
  classId: string | null;
  kontoSid: null;
  scope: string[];
  goTeacher: false;
};

export async function verifyStudent(
  classCode: string,
  nickname: string,
  pin: string,
  now: Date = new Date(),
): Promise<PinNutzer | null> {
  if (!rueckfallOffen(now)) return null;
  const code = normalizeInviteCode(classCode);
  const nick = nickname.trim();
  if (!code || !nick || !pin) return null;
  const key = studentThrottleKey(code, nick);
  if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) return null;
  const row = await lookupStudentForAuth(getDb(), code, nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
  await clearThrottle(getDb(), key); // she got in — the slate is wiped
  return {
    id: row.id,
    name: row.displayName,
    role: "student",
    classId: row.classId,
    kontoSid: null,
    scope: row.classId ? [row.classId] : [],
    goTeacher: false,
  };
}

export async function verifyTeacher(
  nickname: string,
  pin: string,
  now: Date = new Date(),
): Promise<PinNutzer | null> {
  if (!rueckfallOffen(now)) return null;
  const nick = nickname.trim();
  if (!nick || !pin) return null;
  const key = teacherThrottleKey(nick);
  if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) return null;
  const row = await lookupTeacherForAuth(getDb(), nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
  await clearThrottle(getDb(), key);
  // The scope of a PIN teacher is built per request in lib/identity.ts (their
  // own classes), so a class created after sign-in is visible at once.
  return { id: row.id, name: row.displayName, role: "teacher", classId: null, kontoSid: null, scope: [], goTeacher: false };
}
