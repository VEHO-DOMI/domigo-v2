export const dynamic = "force-dynamic";

/**
 * S-1 · Studio LIST — every unit, with a chip counting its live/draft prose
 * overrides. Teacher-gated. Links to the per-unit editor. Reads are direct
 * (server component), like /admin/classes.
 */
import Link from "next/link";
import { listApprovedUnits } from "@domigo/content-loader";
import { getDb, loadOverrideStatuses } from "@domigo/db";
import { redirect } from "next/navigation";
import { getTeacherForPage } from "@/lib/identity";

export default async function StudioListPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const units = listApprovedUnits();
  const statuses = await loadOverrideStatuses(getDb()).catch(() => []);
  const byUnit = new Map<string, { published: number; draft: number }>();
  for (const s of statuses) {
    const e = byUnit.get(s.unitSlug) ?? { published: 0, draft: 0 };
    if (s.status === "published") e.published += 1;
    else e.draft += 1;
    byUnit.set(s.unitSlug, e);
  }

  const grades = [1, 2, 3, 4] as const;
  const totalPublished = statuses.filter((s) => s.status === "published").length;

  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Studio</h1>
        <Link href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Verwaltung</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Bearbeite den <strong>Text</strong> einer Aufgabe — Hinweise, Erklärungen, Definitionen, Beispielsätze. Die Lösungen (Übersetzungen, Antworten) bleiben gesperrt.
        {totalPublished > 0 ? ` · ${totalPublished} veröffentlichte Änderung${totalPublished === 1 ? "" : "en"}.` : ""}
      </p>

      {grades.map((grade) => {
        const gradeUnits = units.filter((u) => u.startsWith(`g${grade}-`));
        if (gradeUnits.length === 0) return null;
        return (
          <section key={grade} className="dg-card" data-grade={grade} style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 16, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Klasse {grade}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {gradeUnits.map((slug) => {
                const counts = byUnit.get(slug);
                const n = slug.slice(slug.indexOf("-u") + 2);
                return (
                  <Link key={slug} href={`/admin/studio/${slug}`} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                    <span style={{ fontWeight: 700 }}>Einheit {Number(n)}</span>
                    {counts ? (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {counts.published > 0 ? `✅ ${counts.published} live` : ""}
                        {counts.published > 0 && counts.draft > 0 ? " · " : ""}
                        {counts.draft > 0 ? `✏️ ${counts.draft} Entwurf` : ""}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>—</span>
                    )}
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
