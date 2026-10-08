/**
 * /assignments — "Deine Aufgaben": the student's assigned practice sets + mock
 * tests for their class. Teacher previews read definitions for their own classes,
 * without looking up a child or any results.
 */
import { redirect } from "next/navigation";
import { getDb, listAssignmentsForStudent } from "@domigo/db";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";
import { listPreviewAssignments } from "./preview";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string | string[] }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  const rows = view.kind === "preview"
    ? await listPreviewAssignments(view.teacher, view.grades)
    : await listAssignmentsForStudent(getDb(), acting!.classScope, acting!.classId, new Date()).catch(() => []);

  return (
    <>
      {preview && <PreviewBanner grade={view.grades.length === 1 ? view.grades[0] : undefined} />}
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Deine Aufgaben</h1>
        <a href={preview ? "/admin/explorer" : "/home"} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</a>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Aufgaben und Schularbeit-Übungen von deiner Lehrkraft.</p>

      {rows.length === 0 ? (
        <p style={{ color: "var(--muted)", marginTop: 24 }}>Gerade keine offenen Aufgaben. 🎉</p>
      ) : (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((a) => (
            <a key={a.id} href={`/assignments/${a.id}`} className="dg-tile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {a.mode === "mock_test" ? "📝 Schularbeit-Übung" : a.mode === "checkup" ? "✅ Check-up" : "✏️ Übung"}
                  {preview && "className" in a ? ` · ${a.className}` : ""}
                  {a.sessionDurationMinutes ? ` · ${a.sessionDurationMinutes} min` : ""}
                  {a.dueAt ? ` · bis ${new Date(a.dueAt).toLocaleDateString("de-AT")}` : ""}
                </div>
              </div>
              <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>Öffnen →</span>
            </a>
          ))}
        </div>
      )}
    </main>
    </>
  );
}
