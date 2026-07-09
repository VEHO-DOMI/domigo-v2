/**
 * /assignments/[id] — one assignment. If the student has a live sitting, this
 * renders the runner; otherwise it's the overview (details, past results, and a
 * "Begin" action that opens the next attempt, up to attemptsPerTest). The server
 * resolves each section's vocab/grammar items via the loaders — the stored
 * itemIds are never trusted for grading, they're re-resolved here.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { loadUnit } from "@domigo/content-loader";
import { getDb, getStudentAssignmentView, startOrResumeSession, isSessionLive } from "@domigo/db";
import { getActingUserForPage } from "@/lib/identity";
import { parseItemRef } from "@/lib/itemRef";
import AssignmentRunner, { type RunnerSection } from "./AssignmentRunner";

export const dynamic = "force-dynamic";

const NOTE_LABEL: Record<number, string> = { 1: "Sehr gut", 2: "Gut", 3: "Befriedigend", 4: "Genügend", 5: "Nicht genügend" };

/** Resolve a section's item ids to full items (cached loadUnit per slug). */
function resolveItems(itemIds: string[], cache: Map<string, ReturnType<typeof loadUnit>>): Array<VocabItem | GrammarItem> {
  const out: Array<VocabItem | GrammarItem> = [];
  for (const id of itemIds) {
    const ref = parseItemRef(id);
    if (!ref) continue;
    let unit = cache.get(ref.unitSlug);
    if (!unit) { unit = loadUnit(ref.unitSlug); cache.set(ref.unitSlug, unit); }
    const item = ref.kind === "vocab" ? unit.vocab.find((v) => v.id === id) : unit.grammar.find((g) => g.id === id);
    if (item) out.push(item);
  }
  return out;
}

export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const view = await getStudentAssignmentView(getDb(), id, acting.userId).catch(() => null);
  if (!view || view.assignment.classId !== acting.classId) redirect("/assignments");
  const { assignment, sections, sessions } = view;

  async function begin() {
    "use server";
    const a = await getStudentAssignmentView(getDb(), id, acting!.userId).catch(() => null);
    if (a && a.assignment.classId === acting!.classId) {
      await startOrResumeSession(getDb(), a.assignment, acting!.userId, new Date()).catch(() => null);
    }
    redirect(`/assignments/${id}`);
  }

  const live = sessions.find((s) => isSessionLive({ expiresAt: s.expiresAt, submittedAt: s.submittedAt }, new Date()));
  const submitted = [...sessions].filter((s) => s.submittedAt !== null).sort((a, b) => b.attemptNumber - a.attemptNumber);
  const attemptsUsed = sessions.length;
  const attemptsLeft = assignment.attemptsPerTest - attemptsUsed;

  // ── active sitting → the runner ──
  if (live) {
    const cache = new Map<string, ReturnType<typeof loadUnit>>();
    const runnerSections: RunnerSection[] = sections.map((s) => ({
      position: s.position,
      kind: s.kind as "vocab" | "grammar",
      titleDe: s.kind === "vocab" ? "Vokabel" : "Grammatik",
      items: resolveItems((s.itemIds as string[] | null) ?? [], cache),
    }));
    return (
      <AssignmentRunner
        assignmentId={id}
        sessionId={live.id}
        title={assignment.title}
        mode={assignment.mode as "practice" | "mock_test"}
        expiresAt={live.expiresAt ? live.expiresAt.toISOString() : null}
        sections={runnerSections}
      />
    );
  }

  // ── overview ──
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{assignment.title}</h1>
        <Link href="/assignments" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Aufgaben</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {assignment.mode === "mock_test" ? "📝 Schularbeit-Übung" : "✏️ Übung"}
        {assignment.sessionDurationMinutes ? ` · ${assignment.sessionDurationMinutes} Minuten` : " · ohne Zeitlimit"}
        {` · ${sections.length} Teile`}
      </p>

      {submitted.length > 0 && (
        <div className="dg-card" style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Deine Versuche</h2>
          {submitted.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--card-border)" }}>
              <span>Versuch {s.attemptNumber}</span>
              <span style={{ fontWeight: 700, color: (s.note ?? 5) <= 2 ? "var(--correct)" : (s.note ?? 5) <= 4 ? "var(--partial)" : "var(--incorrect)" }}>
                {s.scorePct != null ? `${Math.round(Number(s.scorePct))}%` : "—"}{s.note ? ` · Note ${s.note} (${NOTE_LABEL[s.note]})` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {attemptsLeft > 0 ? (
          <form action={begin}>
            <button type="submit" className="dg-btn">{attemptsUsed === 0 ? "Aufgabe starten" : `Nächster Versuch (${attemptsLeft} übrig)`}</button>
          </form>
        ) : (
          <p style={{ color: "var(--muted)" }}>Keine Versuche mehr übrig ({assignment.attemptsPerTest} von {assignment.attemptsPerTest} verwendet).</p>
        )}
      </div>
    </main>
  );
}
