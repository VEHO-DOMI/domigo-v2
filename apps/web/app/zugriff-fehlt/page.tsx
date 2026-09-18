/**
 * dach-018 · THE ACCESS CARD (SPEC konto V1.1-FINAL §5 L2).
 *
 * Where a sign-in through konto ends when the account is real but this tool is
 * not open to it: a teacher without the role `teacher` in the area `go`, or a
 * child whose class has never been created in DomiGo.
 *
 * ENGLISH, because DomiGo's product surface is English (nachtrag N-14; both
 * sign-in pages are measured English). The roof's own pages are German — this
 * is not one of them.
 *
 * ONE CARD FOR BOTH CASES, on purpose. The refusal that sends people here
 * cannot say which check refused (every failed gate in the provider returns the
 * same `null`), and the two remedies are the same anyway: ask the person who
 * grants access. Naming both truths is kinder than a shrug and leaks nothing
 * the reader does not already know about themselves.
 *
 * Public by construction: middleware.ts's matcher is a POSITIVE list and this
 * route is not in it — someone whose session was just refused must be able to
 * read the card.
 */
import Link from "next/link";
import { kontoBaseUrl } from "@/lib/konto/basis";

export const dynamic = "force-dynamic";
export const metadata = { title: "No access · DomiGo" };

const HUB = "https://lautereinser.at";

export default function ZugriffFehltPage() {
  const konto = kontoBaseUrl();
  const kontoHost = new URL(konto).host;

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>No access</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Your Lauter Einser account works — DomiGo just is not open to it yet.
      </p>

      <div className="dg-card" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Teachers:</strong> this area needs the role <code>teacher</code> in the area <code>go</code>.
          Access is granted centrally only: {kontoHost} → Benutzerverwaltung.
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Students:</strong> your class is not set up in DomiGo yet. Your teacher can do that
          in the Lehrer-Raum.
        </p>
        <a href={HUB} className="dg-btn" style={{ marginTop: 4, padding: "12px 16px", textAlign: "center", textDecoration: "none" }}>
          Back to Lauter Einser
        </a>
      </div>

      <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600 }}>Try signing in again</Link>
      </p>
      <p style={{ marginTop: 8, fontSize: 13 }}>
        <Link href="/datenschutz" style={{ color: "var(--text-secondary)" }}>Datenschutz</Link>
      </p>
    </main>
  );
}
