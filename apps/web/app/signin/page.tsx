/**
 * dach-018 · /signin — one button, and for fourteen days an explanation.
 *
 * Until the switch-over this page carried a class code, a nickname and a
 * six-digit PIN. All three are gone: DomiGo verifies no password any more, and
 * the account service does the asking. What is left is the button, the notice
 * that says where the old form went, and the bridge for a printed class code —
 * which now leads to the join page at konto instead of one here.
 *
 * The notice runs until UMSTIEGSTAG + 14 days and then disappears by itself
 * (SPEC §6, F10). Its wording is fixed; it is not reworded per page.
 *
 * dach-074 · UNTIL the switch-over day the old form is still here, as a dated
 * fallback (lib/konto/rueckfall.ts): main's class code + nickname + PIN form
 * beside the button, and a printed class code still leads to /join here. From
 * 00:00 Vienna that day the form stops rendering, its server action refuses,
 * the "student" provider refuses, and the page is the button + the notice.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { CALLBACK_PFAD, eigeneBasis, kontoBeitrittUrl, kontoLoginUrl } from "@/lib/konto/basis";
import { hinweisFaellig } from "@/lib/konto/umstieg";
import { assertRueckfallOffen, rueckfallOffen } from "@/lib/konto/rueckfall";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/home";
  const error = sp.error;
  const pinOffen = rueckfallOffen();

  // A printed class code still has to lead somewhere. Until the switch-over day
  // it leads to /join here, as on main; from that day to konto: the list is
  // there, the nickname and the PIN are chosen there.
  async function goToJoin(formData: FormData) {
    "use server";
    const code = String(formData.get("joinCode") ?? "").trim().toUpperCase();
    if (!code) redirect("/signin");
    redirect(rueckfallOffen() ? `/join/${encodeURIComponent(code)}` : kontoBeitrittUrl(code));
  }

  // dach-074 · main's PIN sign-in, until the switch-over day only.
  async function studentSignIn(formData: FormData) {
    "use server";
    assertRueckfallOffen(); // a tab left open across midnight must not still sign in
    const classCode = String(formData.get("classCode") ?? "");
    const nickname = String(formData.get("nickname") ?? "");
    const pin = String(formData.get("pin") ?? "");
    const dest = String(formData.get("from") ?? "/home");
    try {
      await signIn("student", { classCode, nickname, pin, redirect: true, redirectTo: dest || "/home" });
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
      redirect(`/signin?error=invalid&from=${encodeURIComponent(dest)}`);
    }
  }

  const label = { display: "flex", flexDirection: "column", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--ink-soft)", fontFamily: "var(--font-body)" } as const;

  const rueckkehr = new URL(CALLBACK_PFAD, eigeneBasis() || "https://example.invalid");
  if (from !== "/home") rueckkehr.searchParams.set("from", from);
  const anmelden = kontoLoginUrl(rueckkehr.toString());

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Sign in</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {pinOffen ? "Use your class code, nickname and PIN." : "DomiGo uses your Lauter Einser account."}
      </p>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          {pinOffen && error === "invalid" ? "That class code, nickname, or PIN didn't match. Try again." : "That sign-in did not work. Try again."}
        </p>
      )}
      {pinOffen && (
        <form action={studentSignIn} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <input type="hidden" name="from" value={from} />
          <label style={label}>
            Class code
            <input name="classCode" required maxLength={32} autoCapitalize="characters" autoComplete="off" placeholder="e.g. ABC-D2F" className="dg-input" />
          </label>
          <label style={label}>
            Nickname
            <input name="nickname" required maxLength={32} autoComplete="off" className="dg-input" />
          </label>
          <label style={label}>
            PIN
            <input name="pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} type="password" autoComplete="off" placeholder="6 digits" className="dg-input" />
          </label>
          <button type="submit" className="dg-btn" style={{ marginTop: 4, padding: "12px 16px" }}>Sign in</button>
        </form>
      )}
      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {!pinOffen && hinweisFaellig() && (
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
            Signing in now works through your Lauter Einser account. Your nickname and PIN still work there.
          </p>
        )}
        <a href={anmelden} className="dg-btn" style={{ padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
          Sign in with Lauter Einser
        </a>
      </div>
      <form action={goToJoin} className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Neu hier? · New here?</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
          Erster Besuch? Gib den Beitritts-Code deiner Klasse ein und such dich aus der Liste aus — dort wählst du
          deinen Spitznamen und deine PIN.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            name="joinCode"
            maxLength={32}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="Beitritts-Code, z.B. 78QVDZ"
            className="dg-input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="dg-btn" style={{ padding: "10px 16px" }}>Beitreten →</button>
        </div>
      </form>
      <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Teacher? <Link href="/admin/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in here</Link>.
      </p>
      <p style={{ marginTop: 8, fontSize: 13 }}>
        <Link href="/datenschutz" style={{ color: "var(--text-secondary)" }}>Datenschutz</Link>
      </p>
    </main>
  );
}
