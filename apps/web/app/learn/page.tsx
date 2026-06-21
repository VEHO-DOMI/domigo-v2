import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb, getPathSummary } from "@domigo/db";
import { listApprovedUnits } from "@domigo/content-loader";

export const dynamic = "force-dynamic";

export default async function LearnIndex() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  const units = listApprovedUnits();
  // Index reads only the per-unit summary (no per-unit content load) — fast at ~58 units.
  let summary = new Map<string, { completedNodes: number; totalStars: number }>();
  try {
    summary = await getPathSummary(getDb(), session.user.id);
  } catch {
    /* keep empty — never 500 the landing */
  }

  const grades = [1, 2, 3, 4] as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Study Path</h1>
        <Link href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</Link>
      </div>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Work through each unit: learn the words and grammar, practise step by step, then pass the checkpoint.
      </p>
      {grades.map((g) => {
        const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
        if (inGrade.length === 0) return null;
        return (
          <section key={g} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 18, color: "#334155" }}>Grade {g}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {inGrade.map((slug) => {
                const s = summary.get(slug);
                const label = s ? `${s.completedNodes} done · ★ ${s.totalStars}` : "Not started";
                return (
                  <Link key={slug} href={`/learn/${slug}`} style={unitCard}>
                    <span style={{ fontWeight: 600 }}>{slug}</span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}

const unitCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "12px 16px",
  textDecoration: "none",
  color: "#0f172a",
  background: "#f8fafc",
} as const;
