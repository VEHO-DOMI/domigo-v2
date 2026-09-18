/**
 * dach-018 · /admin/signin — the teacher's door, now at konto.
 *
 * The nickname-and-PIN form is gone, and so is the "PIN vergessen?" link: a
 * forgotten password is konto's business now (/lehrkraft/pin-vergessen answers
 * 308 and points there).
 *
 * dach-074 · UNTIL the switch-over day both are still here, as a dated fallback
 * (lib/konto/rueckfall.ts): main's nickname + PIN form beside the button, and
 * the "PIN vergessen?" link. From 00:00 Vienna that day the form stops
 * rendering, its server action and the "teacher" provider refuse, and the page
 * is the button + the notice.
 *
 * This page stays reachable WITHOUT a session — middleware.ts exempts it
 * explicitly, or a teacher who is signed out could never reach the button.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { assertRueckfallOffen, rueckfallOffen } from "@/lib/konto/rueckfall";
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
  const pinOffen = rueckfallOffen();

  // dach-074 · main's PIN sign-in, until the switch-over day only.
  async function teacherSignIn(formData: FormData) {
    "use server";
    assertRueckfallOffen(); // a tab left open across midnight must not still sign in
    const nickname = String(formData.get("nickname") ?? "");
    const pin = String(formData.get("pin") ?? "");
    const dest = String(formData.get("from") ?? "/admin");
    try {
      await signIn("teacher", { nickname, pin, redirect: true, redirectTo: dest || "/admin" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect(`/admin/signin?error=invalid`);
    }
  }

  const label = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", fontFamily: "var(--font-body)" } as const;

  const rueckkehr = new URL(CALLBACK_PFAD, eigeneBasis() || "https://example.invalid");
  rueckkehr.searchParams.set("from", from);
  const anmelden = kontoLoginUrl(rueckkehr.toString());

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Teacher sign in</h1>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          {pinOffen && error === "invalid" ? "That nickname or PIN didn't match. Try again." : "That sign-in did not work. Try again."}
        </p>
      )}
      {pinOffen && (
        <form action={teacherSignIn} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <input type="hidden" name="from" value={from} />
          <label style={label}>
            Nickname
            <input name="nickname" required maxLength={64} autoComplete="off" className="dg-input" />
          </label>
          <label style={label}>
            PIN
            <input name="pin" required inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} type="password" autoComplete="off" className="dg-input" />
          </label>
          <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>Sign in</button>
        </form>
      )}
      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {!pinOffen && hinweisFaellig() && (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
            Signing in now works through your Lauter Einser account (short code + password). For your first
            sign-in there, your previous nickname and PIN still work.
          </p>
        )}
        <a href={anmelden} className="dg-btn" style={{ padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
          Sign in with Lauter Einser
        </a>
      </div>
      {pinOffen && (
        <p style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
          <Link href="/lehrkraft/pin-vergessen" style={{ color: "var(--accent)", fontWeight: 600 }}>PIN vergessen?</Link>
        </p>
      )}
      <p style={{ marginTop: pinOffen ? 8 : 16, fontSize: 13, color: "var(--muted)" }}>
        Student? <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
    </main>
  );
}
