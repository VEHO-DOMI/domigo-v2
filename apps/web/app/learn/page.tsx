import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";
import { getDb, getPathSummary } from "@domigo/db";
import { listApprovedUnits } from "@domigo/content-loader";

export const dynamic = "force-dynamic";

export default async function LearnIndex({ searchParams }: { searchParams: Promise<{ jahrgang?: string | string[] }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  const grades = view.grades;

  const units = listApprovedUnits();
  // Index reads only the per-unit summary (no per-unit content load) — fast at ~58 units.
  let summary = new Map<string, { completedNodes: number; totalStars: number }>();
  try {
    summary = acting ? await getPathSummary(getDb(), acting.userId) : new Map();
  } catch {
    /* keep empty — never 500 the landing */
  }

  return (
    <>
      {preview && <PreviewBanner grade={grades.length === 1 ? grades[0] : undefined} />}
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Study Path</h1>
        <Link href={preview ? "/admin/explorer" : "/home"} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>{preview ? "← Zur Schüleransicht" : "← Home"}</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Work through each Chapter: learn the words and grammar, practise step by step, then pass the checkpoint.
      </p>
      {grades.map((g) => {
        const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
        if (inGrade.length === 0) return null;
        return (
          <section key={g} data-grade={g} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Grade {g}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {inGrade.map((slug) => {
                const s = summary.get(slug);
                const label = preview ? "Vorschau · alle Schritte offen" : s ? `${s.completedNodes} done · ★ ${s.totalStars}` : "Not started";
                return (
                  <Link key={slug} href={`/learn/${slug}`} className="dg-tile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "13px 16px" }}>
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Chapter {Number(slug.slice(-2))}</span>
                    <span style={{ fontSize: 13, color: s ? "var(--accent-deep)" : "var(--muted)", fontWeight: 600 }}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
    </>
  );
}
