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
  claimOpsLinkUse,
  clearThrottle,
  findOpsClassStudent,
  getDb,
  lookupStudentForAuth,
  lookupTeacherForAuth,
  SIGNIN_POLICY,
  studentThrottleKey,
  teacherThrottleKey,
} from "@domigo/db";
import { normalizeInviteCode } from "@/lib/invite-code";
import { opsClassCode, opsLinkUseRow, parseOpsSessionLinkToken } from "@/lib/ops";
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

/**
 * K2b · Consume a one-time OPS sign-in link.
 *
 * This is deliberately NOT a general magic-link provider. It exists for exactly
 * one job: letting an agent session reach a signed-in STUDENT surface of the ops
 * test class without anyone typing a PIN into a form (Masterblatt rule 3). Every
 * property that keeps it narrow is a gate below, and all four must pass:
 *
 *   1. SECRET + SIGNATURE + CLOCK — parseOpsSessionLinkToken (lib/ops.ts), which
 *      fails closed when DOMIGO_OPS_TOKEN is unset or below the 24-character
 *      floor. No token, no surface. The clock has a ceiling as well as a floor.
 *   2. CLASS SCOPE — the student is resolved INSIDE the ops class by a WHERE
 *      clause. A real student's id in a validly signed token resolves to nothing;
 *      there is no code path here that can reach one.
 *   3. SINGLE USE — the register (domigo_v2.ops_link_uses, migration 0017). The
 *      claim is a write, not a read-then-write, so it IS the enforcement and not
 *      its bookkeeping: the primary key decides the race.
 *   4. FAIL CLOSED — a lost claim, a missing register table and a database hiccup
 *      all refuse. A link that cannot be RETIRED is a link that must not be honoured.
 *
 * Every failure returns plain `null`, which Auth.js turns into one
 * indistinguishable CredentialsSignin — a caller learns that the link did not
 * work, never which gate refused it.
 *
 * ⚠ lib/ops.ts uses Web-Crypto, not node:crypto, and that is load-bearing: this
 * file is imported by middleware.ts, which runs on the Edge. See the header there
 * and the K2a note at the bottom of packages/db/src/index.ts.
 */
async function verifyOpsLink(token: string) {
  const parsed = await parseOpsSessionLinkToken(token);
  if (!parsed.ok) return null;

  try {
    const student = await findOpsClassStudent(getDb(), opsClassCode(), parsed.payload.userId);
    if (!student) return null;

    const claim = await claimOpsLinkUse(getDb(), await opsLinkUseRow(parsed.payload));
    if (claim !== "claimed") return null;

    return {
      id: student.id,
      name: student.displayName,
      role: "student" as const,
      classId: student.classId,
    };
  } catch {
    // A database hiccup must not become an unretirable link (gate 4).
    return null;
  }
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
    Credentials({
      // K2b · the ops sign-in link. ONE credential, because the signed token IS
      // the credential — see verifyOpsLink above for the four gates it passes.
      id: "ops-link",
      name: "Ops link",
      credentials: { token: {} },
      authorize: (raw) => verifyOpsLink(String(raw?.token ?? "")),
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
