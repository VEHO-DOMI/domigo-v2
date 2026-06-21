// NextAuth v5 (Auth.js) — two Credentials providers, ported from v1 lib/auth.ts.
// Pseudonymous classroom auth: students = class code + nickname + 6-digit PIN;
// teachers = nickname + PIN. Reuses the EXISTING Neon accounts (reads
// public.users/classes via @domigo/db's read-only mirrors) and NEVER writes
// public.* — so v1's lastSeenAt bump + onboardedAt writes are dropped and the
// callbacks are pure.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb, lookupStudentForAuth, lookupTeacherForAuth } from "@domigo/db";
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
async function verifyStudent(classCode: string, nickname: string, pin: string) {
  const code = normalizeInviteCode(classCode);
  const nick = nickname.trim();
  if (!code || !nick || !pin) return null;
  const row = await lookupStudentForAuth(getDb(), code, nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
  return { id: row.id, name: row.displayName, role: "student" as const, classId: row.classId };
}

async function verifyTeacher(nickname: string, pin: string) {
  const nick = nickname.trim();
  if (!nick || !pin) return null;
  const row = await lookupTeacherForAuth(getDb(), nick);
  if (!row || !(await verifyPin(pin, row.pinHash))) return null;
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
