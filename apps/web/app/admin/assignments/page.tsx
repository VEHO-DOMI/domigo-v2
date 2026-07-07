/**
 * /admin/assignments — the teacher's assignments list. Newest first, each linking
 * to its (future M-4) results view; a "New assignment" button opens the builder.
 * Teacher-only (getTeacherForPage — real session or the non-prod dev fallback).
 */
import { redirect } from "next/navigation";
import { getDb, listAssignmentsByCreator, listClasses } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const [rows, classes] = await Promise.all([
    listAssignmentsByCreator(getDb(), teacher.userId).catch(() => []),
    listClasses(getDb()).catch(() => []),
  ]);
  const className = new Map(classes.map((c) => [c.id, c.name]));

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Assignments</h1>
        <a href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Teacher home</a>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Compose, time and assign your own practice sets and mock tests (Schularbeit rehearsal).
      </p>

      <a href="/admin/assignments/new" className="dg-btn" style={{ display: "inline-block", marginTop: 6 }}>+ New assignment</a>

      {rows.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>No assignments yet. Build your first one.</p>
      ) : (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((a) => (
            <div key={a.id} className="dg-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: a.archivedAt ? 0.55 : 1 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {a.mode === "mock_test" ? "Mock test" : "Practice"} · {className.get(a.classId) ?? "a class"}
                  {a.dueAt ? ` · due ${new Date(a.dueAt).toLocaleDateString("de-AT")}` : ""}
                  {a.archivedAt ? " · archived" : ""}
                </div>
              </div>
              <span style={{ fontSize: 12, fontFamily: "var(--font-label)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                {a.mode === "mock_test" ? "📝" : "✏️"}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
