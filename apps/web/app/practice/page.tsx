import Link from "next/link";
import { listApprovedUnits } from "@domigo/content-loader";
import { isSlugAllowed, resolveVisibleGrades } from "@/lib/grade-scope";
import { getActingUserForPage } from "@/lib/identity";

// Reads the corpus via fs at request time — never statically pre-rendered.
export const dynamic = "force-dynamic";

export default async function PracticeIndex() {
  const units = listApprovedUnits();
  // P1 (P-R1.5): a child sees only its own class's school year. Unlike the other
  // three list pages this one carries no session gate of its own — the middleware
  // owns that — so a missing identity must NOT redirect here; it degrades to all
  // four years (as does a teacher, who has no classId). Never an empty page.
  const acting = await getActingUserForPage();
  const grades = await resolveVisibleGrades(acting?.classId);
  const inScope = units.filter((s) => isSlugAllowed(s, grades));
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Practice</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {inScope.length} approved units — load any to render and grade its real items.
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
