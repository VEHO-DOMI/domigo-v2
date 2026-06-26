import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listTestUnits } from "@domigo/content-loader";

export const dynamic = "force-dynamic";

export default async function TestsIndex() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  const units = listTestUnits();
  const grades = [1, 2, 3, 4] as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Mock Tests</h1>
        <Link href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</Link>
      </div>
      <p style={{ color: "#64748b", marginTop: 0 }}>Sit a practice test like a real Schularbeit.</p>
      {units.length === 0 ? (
        <p style={{ color: "#64748b" }}>No mock tests yet.</p>
      ) : (
        grades.map((g) => {
          const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
          if (inGrade.length === 0) return null;
          return (
            <section key={g} style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 18, color: "#334155" }}>Grade {g}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {inGrade.map((slug) => (
                  <Link key={slug} href={`/tests/${slug}`} style={chip}>{slug}</Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}

const chip = {
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "6px 12px",
  textDecoration: "none",
  color: "#0f172a",
  background: "#f8fafc",
  fontSize: 14,
} as const;
