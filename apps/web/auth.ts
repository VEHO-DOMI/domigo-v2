// NextAuth v5 (Auth.js) — sign-in happens at the account service (dach-018).
// Its address is never written here: check-umbrella-tokens keeps every tool
// address in app/le-werkzeuge.json alone, so lib/konto/basis.ts reads it.
//
// Since Koki's decision of 19.09. (E-3, »Tabula rasa«) DomiGo checks no password
// of its own and knows no switch-over date: the PIN providers `student` and
// `teacher` are gone, and a cookie they (or anything before the konto
// handoff) minted is no session (lib/konto/regeln.ts, sitzungsRegel).
//
// What survives, and why, is written down in konto-local-login-allowlist.json —
// one entry per leftover, none with an end date: `ops-link` is the machine lane
// for the test bank; the DEV_* fallbacks live in middleware.ts and
// lib/identity.ts and can never run in production.
//
// Still true, and still load-bearing: middleware.ts imports this file, so
// everything it imports rides into the EDGE bundle. lib/konto/{basis,claims,
// reste,regeln}.ts are fetch-and-strings only for exactly that reason.
// lib/konto/anmeldung.ts (bcrypt, @domigo/db) is reached only from inside
// `authorize`, which NextAuth serves from /api/auth/[...nextauth] with
// `runtime = "nodejs"`.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { claimOpsLinkUse, findOpsClassStudent, getDb } from "@domigo/db";
import { opsClassCode, opsLinkUseRow, parseOpsSessionLinkToken } from "@/lib/ops";
import { fetchClaims, istLehrkraftFuerGo, meldeAppLink } from "@/lib/konto/claims";
import { handoffAnmelden } from "@/lib/konto/anmeldung";
import { restZulaessig } from "@/lib/konto/reste";
import { sitzungsRegel } from "@/lib/konto/regeln";

export type Role = "student" | "teacher";

/** The provider name the whole adapter keys on. */
export const KONTO_PROVIDER = "konto-handoff";
/** The machine lane, a declared leftover in the allowlist. */
export const OPS_PROVIDER = "ops-link";
/** How often a live session asks konto whether it still exists (SPEC §4.6). */
export const CLAIMS_INTERVALL_MS = 60_000;

declare module "next-auth" {
  interface User {
    role: Role;
    classId?: string | null;
    /** konto session id — present only for a session built from a handoff. */
    kontoSid?: string | null;
    /** The class ids this session may see (SPEC §5 L3). */
    scope?: string[];
    /** Holds {area:"go", role:"teacher"} at konto — the area gate (SPEC §5 L2). */
    goTeacher?: boolean;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role: Role;
      classId?: string | null;
      /** Which door this session came through. Never absent on a live session. */
      via?: string | null;
      /** The class wall, carried from the claims. Empty means: nothing. */
      scope?: string[];
      /** May this session open the teacher surface at all (SPEC §5 L2)? */
      goTeacher?: boolean;
    };
  }
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
      // The machine lane sees exactly the one class it was minted for.
      scope: student.classId ? [student.classId] : [],
      goTeacher: false,
      kontoSid: null,
    };
  } catch {
    // A database hiccup must not become an unretirable link (gate 4).
    return null;
  }
}

/**
 * The handoff. ONE credential, because the signed one-time token IS the
 * credential — the same shape as the ops link above, and for the same reason.
 * Everything it decides lives in lib/konto/anmeldung.ts; every refusal comes
 * back as plain `null`, so the page shows one message and a caller learns
 * nothing about which check said no.
 */
async function verifyKontoHandoff(handoff: string) {
  if (!handoff) return null;
  const r = await handoffAnmelden(handoff, meldeAppLink);
  if (!r.ok) {
    console.error(`[konto] sign-in refused: ${r.grund}`);
    return null;
  }
  const { nutzer } = r;
  return {
    id: nutzer.id,
    name: nutzer.name,
    role: nutzer.role,
    classId: nutzer.classId,
    kontoSid: nutzer.kontoSid,
    scope: nutzer.scope,
    goTeacher: nutzer.goTeacher,
  };
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/signin" },
  trustHost: true,
  providers: [
    Credentials({
      id: KONTO_PROVIDER,
      name: "Lauter Einser",
      credentials: { handoff: {} },
      authorize: (raw) => verifyKontoHandoff(String(raw?.handoff ?? "")),
    }),
    Credentials({
      // K2b · the ops sign-in link. ONE credential, because the signed token IS
      // the credential — see verifyOpsLink above for the four gates it passes.
      id: OPS_PROVIDER,
      name: "Ops link",
      credentials: { token: {} },
      authorize: (raw) => verifyOpsLink(String(raw?.token ?? "")),
    }),
  ],
  callbacks: {
    /**
     * SPEC §4.6 (R-F10) — decided by sitzungsRegel (lib/konto/regeln.ts), in
     * this order and no other, without any date:
     *
     *   via = konto-handoff  ⇒ a konto session id is mandatory; every 60 s the
     *                          app asks konto whether the session still exists
     *                          and what it may now see.
     *   via = a declared leftover (the allowlist: ops-link)
     *                        ⇒ no question is asked; that provider's own limits
     *                          apply.
     *   no via at all        ⇒ a cookie from DomiGo's old PIN sign-in — null.
     *   anything else        ⇒ null (`student`, `teacher` included).
     *
     * An UNREACHABLE konto is deliberately not a refusal. A revoked session and a
     * refused call both end the session; a network hiccup does not, or one slow
     * minute at konto would sign a whole class out mid-lesson. The check simply
     * has not happened, so it is not stamped, and the next request tries again.
     */
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.classId = (user as { classId?: string | null }).classId ?? null;
        token.scope = (user as { scope?: string[] }).scope ?? [];
        token.go_teacher = (user as { goTeacher?: boolean }).goTeacher ?? false;
        token.konto_sid = (user as { kontoSid?: string | null }).kontoSid ?? null;
        token.app_user_id = (user as { id?: string }).id ?? null;
      }
      if (account?.provider) token.via = account.provider;

      const via = typeof token.via === "string" ? token.via : null;
      const regel = sitzungsRegel(via, KONTO_PROVIDER, restZulaessig);

      if (regel === "konto") {
        const sid = typeof token.konto_sid === "string" ? token.konto_sid : null;
        if (!sid) return null;
        const zuletzt = typeof token.konto_checked_at === "number" ? token.konto_checked_at : 0;
        const jetzt = Date.now();
        if (jetzt - zuletzt >= CLAIMS_INTERVALL_MS) {
          const antwort = await fetchClaims(sid);
          if (antwort.status === "revoked") return null;
          if (antwort.status === "ok") {
            const c = antwort.claims;
            token.scope = c.scope.classes
              .map((k) => k.app_class_id)
              .filter((id): id is string => typeof id === "string" && id.length > 0);
            token.role = c.kind;
            // The area gate is re-asked every minute, not only at sign-in: a
            // role withdrawn at konto has to close the teacher surface here
            // within the same minute a revoked session would close it.
            token.go_teacher = istLehrkraftFuerGo(c);
            // The old field the 14 existing read sites still use. A child is one
            // class; a teacher is none, exactly as before the switch-over.
            token.classId = c.kind === "student" ? ((token.scope as string[])[0] ?? null) : null;
            token.konto_checked_at = jetzt;
          }
        }
        return token;
      }

      return regel === "rest" ? token : null;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      session.user.role = token.role as Role;
      session.user.classId = (token.classId as string | null | undefined) ?? null;
      session.user.via = (token.via as string | null | undefined) ?? null;
      session.user.scope = (token.scope as string[] | undefined) ?? [];
      session.user.goTeacher = token.go_teacher === true;
      return session;
    },
  },
});
