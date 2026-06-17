import Link from "next/link";
import { listApprovedUnits } from "@domigo/content-loader";

// Reads the corpus via fs at request time — never statically pre-rendered.
export const dynamic = "force-dynamic";

export default function PracticeIndex() {
  const units = listApprovedUnits();
  const grades = [1, 2, 3, 4] as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Practice</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        {units.length} approved units — load any to render and grade its real items.
      </p>
      {grades.map((g) => {
        const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
        if (inGrade.length === 0) return null;
        return (
          <section key={g} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 18, color: "#334155" }}>Grade {g}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {inGrade.map((slug) => (
                <Link
                  key={slug}
                  href={`/practice/${slug}`}
                  style={{
                    border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px",
                    textDecoration: "none", color: "#0f172a", background: "#f8fafc", fontSize: 14,
                  }}
                >
                  {slug}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
