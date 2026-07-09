/**
 * /assignments — "Deine Aufgaben": the student's assigned practice sets + mock
 * tests for their class. Each links to its runner. Student-only (the acting-user
 * identity — real session or the non-prod dev fallback).
 */
import { redirect } from "next/navigation";
import { getDb, listAssignmentsForStudent } from "@domigo/db";
import { getActingUserForPage } from "@/lib/identity";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const rows = await listAssignmentsForStudent(getDb(), acting.classId, new Date()).catch(() => []);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Deine Aufgaben</h1>
        <a href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</a>
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
                  {a.mode === "mock_test" ? "📝 Schularbeit-Übung" : "✏️ Übung"}
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
  );
}
