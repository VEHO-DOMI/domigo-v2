import { redirect } from "next/navigation";
import { getDb, getUnitMastery } from "@domigo/db";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/signin");
  if (session.user.role !== "teacher") redirect("/home");

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  // Phase 7 — teacher mastery view: the cohort's G2 detective game, rolled up per unit.
  const mastery = await getUnitMastery(getDb(), 2).catch(() => []);
  const th = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 12 } as const;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Hi, {session.user.name}</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Teacher dashboard — class management &amp; per-class flags are coming soon.
      </p>

      <section className="dg-card" data-grade={2} style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>G2 “The Wrong Name” — mastery by unit</h2>
        {mastery.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No game attempts yet.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                <th style={th}>Unit</th>
                <th style={th}>Attempts</th>
                <th style={th}>Items solved</th>
                <th style={th}>Correct</th>
              </tr>
            </thead>
            <tbody>
              {mastery.map((m) => (
                <tr key={m.unitSlug} style={{ borderTop: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "7px 8px", fontWeight: 700 }}>{m.unitSlug}</td>
                  <td style={{ padding: "7px 8px" }}>{m.attempts}</td>
                  <td style={{ padding: "7px 8px" }}>{m.itemsSolved}</td>
                  <td style={{ padding: "7px 8px", color: m.correctRate >= 0.7 ? "var(--correct)" : m.correctRate >= 0.4 ? "var(--partial)" : "var(--incorrect)", fontWeight: 700 }}>{Math.round(m.correctRate * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
