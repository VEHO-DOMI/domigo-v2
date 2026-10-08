import Link from "next/link";
import { redirect } from "next/navigation";
import { listListeningUnits } from "@domigo/content-loader";
import { isSlugAllowed } from "@/lib/grade-scope";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";

export const dynamic = "force-dynamic";

export default async function ListeningIndex({ searchParams }: {
  searchParams: Promise<{ jahrgang?: string | string[] }>;
}) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const preview = view.kind === "preview";
  const grades = view.grades;
  const units = listListeningUnits();
  const inScope = units.filter((s) => isSlugAllowed(s, grades));
  return (
    <>
      {preview && <PreviewBanner grade={grades.length === 1 ? grades[0] : undefined} />}
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Listening</h1>
        <Link href={preview ? "/admin/explorer" : "/home"} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>{preview ? "← Zur Schüleransicht" : "← Home"}</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Play a clip and answer the questions.</p>
      {inScope.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No listening tasks for your school year yet.</p>
      ) : (
        grades.map((g) => {
          const inGrade = units.filter((s) => s.startsWith(`g${g}-`));
          if (inGrade.length === 0) return null;
          return (
            <section key={g} data-grade={g} style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Grade {g}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {inGrade.map((slug) => (
                  <Link key={slug} href={`/listening/${slug}${preview ? `?jahrgang=${g}` : ""}`} className="dg-chip" style={{ fontSize: 14, padding: "8px 14px", color: "var(--text)", textDecoration: "none" }}>Chapter {Number(slug.match(/-u(\d+)/)?.[1])}</Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
    </>
  );
}
