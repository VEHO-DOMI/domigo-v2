/**
 * dach-018 · /admin/signin — the teacher's door, now at konto.
 *
 * The nickname-and-PIN form is gone, and so is the "PIN vergessen?" link: a
 * forgotten password is konto's business now (/lehrkraft/pin-vergessen answers
 * 308 and points there).
 *
 * This page stays reachable WITHOUT a session — middleware.ts exempts it
 * explicitly, or a teacher who is signed out could never reach the button.
 */
import Link from "next/link";
import { CALLBACK_PFAD, eigeneBasis, kontoLoginUrl } from "@/lib/konto/basis";
import { hinweisFaellig } from "@/lib/konto/umstieg";

export const dynamic = "force-dynamic";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/admin";
  const error = sp.error;

  const rueckkehr = new URL(CALLBACK_PFAD, eigeneBasis() || "https://example.invalid");
  rueckkehr.searchParams.set("from", from);
  const anmelden = kontoLoginUrl(rueckkehr.toString());

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Teacher sign in</h1>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          That sign-in did not work. Try again.
        </p>
      )}
      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {hinweisFaellig() && (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
            Signing in now works through your Lauter Einser account (short code + password). For your first
            sign-in there, your previous nickname and PIN still work.
          </p>
        )}
        <a href={anmelden} className="dg-btn" style={{ padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
          Sign in with Lauter Einser
        </a>
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
        Student? <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
    </main>
  );
}
