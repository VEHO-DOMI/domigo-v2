import Link from "next/link";
import { redirect } from "next/navigation";
import { getTeacherForPage } from "@/lib/identity";

export const dynamic = "force-dynamic";

/**
 * Teacher account settings. dach-108 · the PIN and the recovery email are gone with
 * DomiGo's own sign-in (Koki 19.09., E-3): password and account live at Lauter
 * Einser, and one fixed sentence here says so. What stays is the account id.
 *
 * Teacher-only via getTeacherForPage (a real session or the non-prod dev fallback),
 * the same guard the class/assignment/Studio pages use.
 */
export default async function TeacherSettingsPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Link href="/admin" style={{ color: "var(--muted)", fontSize: 14, textDecoration: "none" }}>← Back to admin</Link>
      <h1 style={{ fontSize: 28, margin: "8px 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Account settings</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Signed in as <strong>{teacher.name}</strong>.
      </p>

      <section className="dg-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Password</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
          DomiGo uses your Lauter Einser account. Your password is changed and reset there.
        </p>
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
