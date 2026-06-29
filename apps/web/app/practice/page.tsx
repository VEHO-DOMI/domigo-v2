import Link from "next/link";
import { listApprovedUnits } from "@domigo/content-loader";

// Reads the corpus via fs at request time — never statically pre-rendered.
export const dynamic = "force-dynamic";

export default function PracticeIndex() {
  const units = listApprovedUnits();
  const grades = [1, 2, 3, 4] as const;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Practice</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {units.length} approved units — load any to render and grade its real items.
      </p>
      {grades.map((g) => {
        const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
        if (inGrade.length === 0) return null;
        return (
          <section key={g} data-grade={g} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Grade {g}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {inGrade.map((slug) => (
                <Link key={slug} href={`/practice/${slug}`} className="dg-chip" style={{ fontSize: 14, padding: "8px 14px", color: "var(--text)", textDecoration: "none" }}>
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
