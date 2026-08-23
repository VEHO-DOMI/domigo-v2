import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, getTeacherEmail } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import ChangePinForm from "./ChangePinForm";
import SetEmailForm from "./SetEmailForm";

export const dynamic = "force-dynamic";

/**
 * Teacher account settings (WS-AUTH Phase A). Today: change your own PIN — no more
 * asking for a database edit. The first time you change it, your account quietly
 * moves to the platform's writable accounts system (your classes and assignments
 * come with it). More account controls land here as Phase C ships.
 *
 * Teacher-only via getTeacherForPage (a real session or the non-prod dev fallback),
 * the same guard the class/assignment/Studio pages use.
 */
export default async function TeacherSettingsPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  // Tolerant by construction: before migration 0016 is applied this returns null and
  // the section simply reads "nothing yet" — the page never falls over for it.
  const email = await getTeacherEmail(getDb(), teacher.userId);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Link href="/admin" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to admin</Link>
      <h1 style={{ fontSize: 28, margin: "8px 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Account settings</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Signed in as <strong>{teacher.name}</strong>.
      </p>

      <section className="dg-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Change your PIN</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 16px" }}>
          Enter your current PIN, then choose a new one (4–6 digits). You’ll sign in with the new PIN from now on.
        </p>
        <ChangePinForm />
      </section>

      {/* K2a · the address that makes "PIN vergessen" work without asking a human.
          It is optional on purpose: without one, the operator's transitional PIN
          (K1b) is still the way back in — the same way it is today. */}
      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Recovery email</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 16px" }}>
          Store an address and you can reset a forgotten PIN yourself, from the sign-in page. We only ever send a
          one-time link to it — never your PIN.
        </p>
        <SetEmailForm initialEmail={email} />
      </section>

      {/* P3 · self-service for the grandmaster rank. The rank is granted by an env
          allowlist of account ids (GRANDMASTER_TEACHER_IDS) — and without this line
          there is no way to read one's OWN id on production short of opening the
          database. Shown to every teacher: an account id is not a secret (it is the
          session's own id), and it is useless without access to the deployment's
          environment variables. */}
      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Deine Konto-Kennung</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 10px" }}>
          Für die Großmeister-Freischaltung (Umgebungsvariable <code>GRANDMASTER_TEACHER_IDS</code>).
        </p>
        <code
          data-testid="account-id"
          style={{ display: "inline-block", userSelect: "all", background: "var(--bg-sunken)", border: "1px solid var(--card-border)", borderRadius: 8, padding: "7px 10px", fontSize: 14, wordBreak: "break-all" }}
        >
          {teacher.userId}
        </code>
      </section>
    </main>
  );
}
