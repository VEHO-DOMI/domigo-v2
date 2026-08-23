// NextAuth v5 (Auth.js) — two Credentials providers, ported from v1 lib/auth.ts.
// Pseudonymous classroom auth: students = class code + nickname + 6-digit PIN;
// teachers = nickname + PIN. Reuses the EXISTING Neon accounts (reads
// public.users/classes via @domigo/db's read-only mirrors) and NEVER writes
// public.* — so v1's lastSeenAt bump + onboardedAt writes are dropped and the
// callbacks are pure.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
import { normalizeInviteCode } from "@/lib/invite-code";
import { verifyPin } from "@/lib/pin";

export type Role = "student" | "teacher";

declare module "next-auth" {
  interface User {
    role: Role;
    classId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role: Role;
      classId?: string | null;
    };
  }
}

// K2a · THE BRAKE SITS HERE, and not on the sign-in pages, because these two
// functions are the floor BOTH doors stand on: the server actions on /signin and
// /admin/signin, and the raw POST to /api/auth/callback/{student,teacher} that
// NextAuth exposes and that no page code can guard. Counting an attempt before
// bcrypt runs is also the point — a refusal must be cheap, and it must not tell
// the caller by its timing whether the account exists.
//
// Both functions still return plain `null` on refusal, exactly like a wrong PIN, so
// the sign-in page's message stays generic and a guesser learns nothing from being
// stopped. And the brake is fail-open (auth-throttle.ts): if it cannot count, the
// attempt proceeds.

async function verifyStudent(classCode: string, nickname: string, pin: string) {
  const code = normalizeInviteCode(classCode);
  const nick = nickname.trim();
  if (!code || !nick || !pin) return null;
  const key = studentThrottleKey(code, nick);
  if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) return null;
  const row = await lookupStudentForAuth(getDb(), code, nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
  await clearThrottle(getDb(), key); // she got in — the slate is wiped
  return { id: row.id, name: row.displayName, role: "student" as const, classId: row.classId };
}

async function verifyTeacher(nickname: string, pin: string) {
  const nick = nickname.trim();
  if (!nick || !pin) return null;
  const key = teacherThrottleKey(nick);
  if (!(await bumpAndCheck(getDb(), key, SIGNIN_POLICY))) return null;
  const row = await lookupTeacherForAuth(getDb(), nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
  await clearThrottle(getDb(), key);
  return { id: row.id, name: row.displayName, role: "teacher" as const, classId: null };
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/signin" },
  trustHost: true,
  providers: [
    Credentials({
      id: "student",
      name: "Student",
      credentials: { classCode: {}, nickname: {}, pin: {} },
      authorize: (raw) =>
        verifyStudent(String(raw?.classCode ?? ""), String(raw?.nickname ?? ""), String(raw?.pin ?? "")),
    }),
    Credentials({
      id: "teacher",
      name: "Teacher",
      credentials: { nickname: {}, pin: {} },
      authorize: (raw) => verifyTeacher(String(raw?.nickname ?? ""), String(raw?.pin ?? "")),
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.classId = (user as { classId?: string | null }).classId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = token.role as Role;
      session.user.classId = (token.classId as string | null | undefined) ?? null;
      return session;
    },
  },
});
