import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listTestUnits } from "@domigo/content-loader";
import { isSlugAllowed, resolveVisibleGrades } from "@/lib/grade-scope";

export const dynamic = "force-dynamic";

export default async function TestsIndex() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  const units = listTestUnits();
  // P1 (P-R1.5): a child sees only its own class's school year. The viewer here
  // is always a student (no session → /signin, teacher → /admin, both above), so
  // the class's grade decides; an unresolvable grade degrades to all four years.
  const grades = await resolveVisibleGrades(session.user.classId);
  // Both corpora are still g2-only (2/57 units), so a child of another year now
  // has nothing here — a grade-aware empty state, not a bare page.
  const inScope = units.filter((s) => isSlugAllowed(s, grades));
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Mock Tests</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Sit a practice test like a real Schularbeit.</p>
      {inScope.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No mock tests for your school year yet.</p>
      ) : (
        grades.map((g) => {
          const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
          if (inGrade.length === 0) return null;
          return (
            <section key={g} data-grade={g} style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Grade {g}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {inGrade.map((slug) => (
                  <Link key={slug} href={`/tests/${slug}`} className="dg-chip" style={{ fontSize: 14, padding: "8px 14px", color: "var(--text)", textDecoration: "none" }}>{slug}</Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
