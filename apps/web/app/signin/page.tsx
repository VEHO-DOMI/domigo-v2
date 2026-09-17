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
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { CALLBACK_PFAD, eigeneBasis, kontoBeitrittUrl, kontoLoginUrl } from "@/lib/konto/basis";
import { hinweisFaellig } from "@/lib/konto/umstieg";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const from = sp.from && sp.from.startsWith("/") ? sp.from : "/home";
  const error = sp.error;

  // A printed class code still has to lead somewhere. It leads to konto now:
  // the list is there, the nickname and the PIN are chosen there.
  async function goToJoin(formData: FormData) {
    "use server";
    const code = String(formData.get("joinCode") ?? "").trim().toUpperCase();
    if (!code) redirect("/signin");
    redirect(kontoBeitrittUrl(code));
  }

  const rueckkehr = new URL(CALLBACK_PFAD, eigeneBasis() || "https://example.invalid");
  if (from !== "/home") rueckkehr.searchParams.set("from", from);
  const anmelden = kontoLoginUrl(rueckkehr.toString());

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Sign in</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>DomiGo uses your Lauter Einser account.</p>
      {error && (
        <p style={{ background: "var(--incorrect-soft)", color: "var(--incorrect)", padding: "9px 13px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
          That sign-in did not work. Try again.
        </p>
      )}
      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {hinweisFaellig() && (
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
