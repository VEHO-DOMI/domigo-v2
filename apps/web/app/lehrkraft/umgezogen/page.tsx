/**
 * dach-074 / dach-108 · /lehrkraft/umgezogen — where an old teacher invitation lands
 * (Befund GG 19.09., NEBEN-3).
 *
 * /lehrkraft/<token> answers 307 to here, always (lib/konto/regeln.ts, tuerZiel),
 * instead of dropping the teacher on konto's sign-in page without a word: one
 * sentence says why the link no longer works, and the button leads to the sign-in
 * that does. No database, no session — the token is not even read.
 */
import Link from "next/link";
import { CALLBACK_PFAD, eigeneBasis, kontoLoginUrl } from "@/lib/konto/basis";

export const dynamic = "force-dynamic";

export default function EinladungUmgezogenSeite() {
  const rueckkehr = new URL(CALLBACK_PFAD, eigeneBasis() || "https://example.invalid");
  rueckkehr.searchParams.set("from", "/admin");
  const anmelden = kontoLoginUrl(rueckkehr.toString());

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 26, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Einladung nicht mehr gültig</h1>
      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
          Dieser Einladungs-Link stammt aus der Zeit vor Lauter Einser. Lehrkräfte melden sich jetzt mit ihrem
          Lauter-Einser-Konto an; Klassen werden im Lehrerzimmer von Lauter Einser zugeteilt.
        </p>
        <a href={anmelden} className="dg-btn" style={{ padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
          Sign in with Lauter Einser
        </a>
      </div>
      <p style={{ marginTop: 16, fontSize: 13 }}>
        <Link href="/datenschutz" style={{ color: "var(--text-secondary)" }}>Datenschutz</Link>
      </p>
    </main>
  );
}
