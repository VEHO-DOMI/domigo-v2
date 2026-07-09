/**
 * /admin/assignments/[id] — the teacher results roster. For each student in the
 * class: their latest submitted sitting, RE-SCORED from its attempts via the same
 * pure scorer the runner + M-1 use (so the roster reconciles by construction),
 * plus a class summary (average, Note distribution, hardest section). Teacher-
 * only; a teacher sees only their own assignments.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getAssignmentWithSections,
  getDb,
  getSessionAttempts,
  isSessionLive,
  listSessionsForAssignment,
  listStudentsForClass,
  pickRosterSession,
  rosterStatus,
  scoreSubmittedSession,
  summarizeRoster,
  type AssignmentMode,
  type NotenSchluessel,
  type RosterRow,
  type SectionSpec,
} from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";

export const dynamic = "force-dynamic";

const NOTE_LABEL: Record<number, string> = { 1: "Sehr gut", 2: "Gut", 3: "Befriedigend", 4: "Genügend", 5: "Nicht genügend" };
const pctColor = (p: number) => (p >= 80 ? "var(--correct)" : p >= 50 ? "var(--partial)" : "var(--incorrect)");
const th = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 11, color: "var(--muted)", textAlign: "left" } as const;
const td = { padding: "7px 8px", fontSize: 14, borderTop: "1px solid var(--card-border)" } as const;

export default async function AssignmentResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const view = await getAssignmentWithSections(getDb(), id).catch(() => null);
  if (!view || view.assignment.createdBy !== teacher.userId) redirect("/admin/assignments");
  const { assignment, sections } = view;
  const mode = assignment.mode as AssignmentMode;

  const [students, allSessions] = await Promise.all([
    listStudentsForClass(getDb(), assignment.classId).catch(() => []),
    listSessionsForAssignment(getDb(), id).catch(() => []),
  ]);

  const specs: SectionSpec[] = sections.map((s) => ({
    position: s.position,
    kind: s.kind as SectionSpec["kind"],
    itemIds: (s.itemIds as string[] | null) ?? [],
    weightPct: s.weightPct,
  }));
  const ns = (assignment.notenSchluessel as NotenSchluessel | null) ?? null;
  const now = new Date();

  // One roster row per student, the DONE ones re-scored from their attempts.
  const rows: RosterRow[] = await Promise.all(
    students.map(async (stu): Promise<RosterRow> => {
      const mine = allSessions.filter((s) => s.userId === stu.id);
      const hasLive = mine.some((s) => isSessionLive({ expiresAt: s.expiresAt, submittedAt: s.submittedAt }, now));
      const status = rosterStatus(mine, hasLive);
      const submittedCount = mine.filter((s) => s.submittedAt !== null).length;
      const roster = pickRosterSession(mine);
      if (status !== "done" || !roster) {
        return { userId: stu.id, name: stu.name, status, attempts: submittedCount, overallPct: null, note: null, perSection: [] };
      }
      const attempts = await getSessionAttempts(getDb(), stu.id, id, roster.id).catch(() => []);
      const score = scoreSubmittedSession({ mode, sections: specs, attempts, notenSchluessel: ns });
      return {
        userId: stu.id, name: stu.name, status, attempts: submittedCount,
        overallPct: score.overallPct, note: score.note,
        perSection: score.perSection.map((p) => ({ position: p.position, pct: p.pct })),
      };
    }),
  );
  rows.sort((a, b) => a.name.localeCompare(b.name, "de"));

  const positions = specs.map((s) => s.position);
  const summary = summarizeRoster(rows, positions);
  const hardest = mode === "mock_test" && summary.done > 0
    ? [...summary.sectionAvgPct].sort((a, b) => a.avgPct - b.avgPct)[0]
    : undefined;
  const noteMax = Math.max(1, ...Object.values(summary.noteHistogram));

  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{assignment.title}</h1>
        <Link href="/admin/assignments" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Assignments</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {mode === "mock_test" ? "Mock test" : "Practice"} · {summary.done}/{summary.students} abgegeben
        {summary.inProgress > 0 ? ` · ${summary.inProgress} gerade dran` : ""}
        {summary.classAvgPct !== null ? ` · Ø ${Math.round(summary.classAvgPct)}%` : ""}
      </p>

      {/* class summary */}
      {mode === "mock_test" && summary.done > 0 && (
        <div className="dg-card" style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={th}>Notenverteilung</div>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ width: 14, fontWeight: 700 }}>{n}</span>
                <span style={{ flex: 1, height: 12, background: "var(--bg-sunken)", borderRadius: 6, overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${(summary.noteHistogram[n] / noteMax) * 100}%`, background: n <= 2 ? "var(--correct)" : n <= 4 ? "var(--partial)" : "var(--incorrect)" }} />
                </span>
                <span style={{ width: 18, textAlign: "right", color: "var(--text-secondary)" }}>{summary.noteHistogram[n]}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={th}>Ø pro Teil</div>
            {summary.sectionAvgPct.map((s) => (
              <div key={s.position} style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 14 }}>
                <span>Teil {s.position + 1}{hardest && hardest.position === s.position ? " 🔻" : ""}</span>
                <span style={{ fontWeight: 700, color: pctColor(s.avgPct) }}>{Math.round(s.avgPct)}%</span>
              </div>
            ))}
            {hardest && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>🔻 schwierigster Teil für die Klasse</p>}
          </div>
        </div>
      )}

      {/* roster */}
      <div style={{ overflowX: "auto", marginTop: 16 }}>
        {rows.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Keine Schüler:innen in dieser Klasse gefunden.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
            <thead>
              <tr>
                <th style={th}>Schüler:in</th>
                {mode === "mock_test" && specs.map((s) => <th key={s.position} style={{ ...th, textAlign: "right" }}>T{s.position + 1}</th>)}
                <th style={{ ...th, textAlign: "right" }}>Gesamt</th>
                {mode === "mock_test" && <th style={{ ...th, textAlign: "right" }}>Note</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.userId}>
                  <td style={{ ...td, fontWeight: 700 }}>
                    {r.name}
                    {r.attempts > 1 ? <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}> · {r.attempts} Versuche</span> : ""}
                  </td>
                  {mode === "mock_test" && specs.map((s) => {
                    const p = r.perSection.find((x) => x.position === s.position);
                    return <td key={s.position} style={{ ...td, textAlign: "right", color: p ? pctColor(p.pct) : "var(--muted)" }}>{p ? `${Math.round(p.pct)}%` : "—"}</td>;
                  })}
                  <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>
                    {r.status === "done" ? `${Math.round(r.overallPct ?? 0)}%` : r.status === "in_progress" ? <span style={{ color: "var(--accent)", fontWeight: 600 }}>läuft…</span> : <span style={{ color: "var(--muted)", fontWeight: 400 }}>—</span>}
                  </td>
                  {mode === "mock_test" && (
                    <td style={{ ...td, textAlign: "right" }}>
                      {r.note ? <span style={{ fontWeight: 800, color: r.note <= 2 ? "var(--correct)" : r.note <= 4 ? "var(--partial)" : "var(--incorrect)" }} title={NOTE_LABEL[r.note]}>{r.note}</span> : ""}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
