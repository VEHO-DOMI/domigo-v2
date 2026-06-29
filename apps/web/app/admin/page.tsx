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

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Hi, {session.user.name}</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Teacher dashboard — class management &amp; per-class flags are coming soon.
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>G2 “The Wrong Name” — mastery by unit</h2>
        {mastery.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 14 }}>No game attempts yet.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: "6px 8px" }}>Unit</th>
                <th style={{ padding: "6px 8px" }}>Attempts</th>
                <th style={{ padding: "6px 8px" }}>Items solved</th>
                <th style={{ padding: "6px 8px" }}>Correct</th>
              </tr>
            </thead>
            <tbody>
              {mastery.map((m) => (
                <tr key={m.unitSlug} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{m.unitSlug}</td>
                  <td style={{ padding: "6px 8px" }}>{m.attempts}</td>
                  <td style={{ padding: "6px 8px" }}>{m.itemsSolved}</td>
                  <td style={{ padding: "6px 8px", color: m.correctRate >= 0.7 ? "#15803d" : m.correctRate >= 0.4 ? "#b45309" : "#b91c1c", fontWeight: 600 }}>{Math.round(m.correctRate * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
