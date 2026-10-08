export const dynamic = "force-dynamic";

/**
 * cgo-047 · SCHÜLERANSICHT — die Tür der Lehrkraft in die echte Kinderseite.
 *
 * Kokis Auftrag 02.10.: die Lehrkraft erreicht den gesamten Inhalt auch »through a
 * student POV«. Diese Seite ist der Einstieg dazu, je Klasse 1–4: die freigegebene
 * Geschichte (/play/N) und alle Einheiten zum Üben (/practice?jahrgang=N), beide in
 * der echten Schülerdarstellung und als Vorschau (lib/student-view.ts): es wird
 * nichts gespeichert, Klassenstatistik und Kinderfortschritt bleiben unberührt.
 *
 * Klasse 1 (Koki 02.10.): die alte Oberwelt »Die verlorenen Seiten« und alles zu
 * Commander Keen sind sunset; gebaut wird das gemalte Buch. Darum steht dort keine
 * alte Oberwelt. Die Story-Kachel folgt dem Laufzeitschalter; die Buch-Vorschau
 * bleibt als Lehrer-Tür erreichbar.
 *
 * Lernpfad, Hören, Tests, Wiederholung und eigene Aufgaben sind ebenfalls
 * speicherfreie Schüleransichten. Fehlender Inhalt steht als Text da. Die Zahlen
 * kommen aus den Korpus-Listen; Aufgaben aus der bestehenden Klassenwand.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { listApprovedUnits, listListeningUnits, listTestUnits, loadReleasedChapters } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";
import { listPreviewAssignments } from "@/app/assignments/preview";
import { listOpenStories } from "@/lib/story-world";
import { listPaintChapters, loadPaintLevel } from "@/lib/paint-content";

const GRADES = [1, 2, 3, 4] as const;

/** Die Lehrer-Türen, die es schon vor der Vorschau gab — ehrlich beschriftet. */
const TEACHER_DOORS: Record<number, Array<{ href: string; label: string; note: string }>> = {
  1: [
    { href: "/play/1/buch/ch01", label: "Gemaltes Buch — das Spiel für Klasse 1", note: "Child access follows Story world. Draft Chapters are teacher-only." },
  ],
  2: [{ href: "/play/2/school", label: "Schulhaus-Kapitel", note: "nur Lehrkräfte, solange nicht freigegeben" }],
};

export default async function ExplorerPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const units = listApprovedUnits();
  const stories = await listOpenStories();
  const listening = listListeningUnits();
  const tests = listTestUnits();
  const assignments = await listPreviewAssignments(teacher, [...GRADES]);

  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Schüleransicht</h1>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <Link href="/admin/studio" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Studio</Link>
          <Link href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Verwaltung</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Öffne die Kinderseite so, wie ein Kind sie sieht. Das ist eine <strong>Vorschau</strong>: Antworten werden bewertet, aber nichts wird gespeichert — kein Versuch, kein Spielstand, keine Wiederholung. Klassenstatistik und Fortschritt der Kinder bleiben unberührt. Die Lehrer-Türen (gemaltes Buch Klasse 1, Schulhaus Klasse 2) merken sich deinen Stand auf diesem Gerät.
      </p>

      {GRADES.map((grade) => {
        const story = stories.find((s) => s.grade === grade && s.role === "canonical");
        const released = !story ? 0 : grade === 1
          ? listPaintChapters(story.storyId).filter((chapter) => loadPaintLevel(story.storyId, chapter).draft !== true).length
          : loadReleasedChapters(story.storyId).length;
        const gradeUnits = units.filter((u) => u.startsWith(`g${grade}-`)).length;
        const doors = TEACHER_DOORS[grade] ?? [];
        return (
          <section key={grade} className="dg-card" data-grade={grade} style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 16, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Klasse {grade}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
              {story ? (
                <Link href={`/play/${grade}`} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                  <span style={{ fontWeight: 700 }}>Geschichte · {story.titleEn}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{released} Kapitel freigegeben</span>
                </Link>
              ) : (
                <span className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", color: "var(--muted)" }}>
                  <span style={{ fontWeight: 700 }}>Geschichte</span>
                  <span style={{ fontSize: 12 }}>keine Geschichte freigegeben</span>
                </span>
              )}
              <Link href={`/practice?jahrgang=${grade}`} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                <span style={{ fontWeight: 700 }}>Üben · Wortschatz und Grammatik</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{gradeUnits} Chapters</span>
              </Link>
              {[
                { href: `/learn?jahrgang=${grade}`, label: "Lernpfad", count: gradeUnits },
                { href: `/listening?jahrgang=${grade}`, label: "Hören", count: listening.filter((s) => s.startsWith(`g${grade}-`)).length },
                { href: `/tests?jahrgang=${grade}`, label: "Tests", count: tests.filter((s) => s.startsWith(`g${grade}-`)).length },
                { href: `/review?jahrgang=${grade}`, label: "Wiederholung", count: gradeUnits },
              ].map((door) => door.count > 0 ? (
                <Link key={door.href} href={door.href} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                  <span style={{ fontWeight: 700 }}>{door.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{door.count} Chapters</span>
                </Link>
              ) : (
                <span key={door.href} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", color: "var(--muted)" }}>
                  <span style={{ fontWeight: 700 }}>{door.label}</span>
                  <span style={{ fontSize: 12 }}>Noch keine Chapters vorhanden</span>
                </span>
              ))}
              {doors.map((d) => (
                <Link key={d.href} href={d.href} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                  <span style={{ fontWeight: 700 }}>{d.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{d.note}</span>
                </Link>
              ))}
            </div>
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Chapter-Übungen ansehen und zuweisen</summary>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Wortschatz und Grammatik werden in die bestehende Aufgabenerstellung übernommen. Dort wählst du eine eigene Klasse und bestätigst die Zuweisung.</p>
              {units.filter((u) => u.startsWith(`g${grade}-`)).map((unit) => (
                <div key={unit} style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", padding: "8px 0" }}>
                  <strong>Chapter {Number(unit.slice(-2))}</strong>
                  <Link href={`/practice/${unit}`}>Schüleransicht öffnen</Link>
                  <Link href={`/admin/assignments/new?source=unit&grade=${grade}&unit=${unit}`}>Übungen zuweisen →</Link>
                </div>
              ))}
            </details>
          </section>
        );
      })}

      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Aufgabe als Kind</h2>
        {assignments.length === 0 ? (
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>Noch keine offenen Aufgaben in deinen Klassen.</p>
        ) : assignments.map((assignment) => (
          <Link key={assignment.id} href={`/assignments/${assignment.id}`} className="dg-tile" style={{ display: "block", marginTop: 8, padding: "12px 14px", overflowWrap: "anywhere" }}>
            <strong>{assignment.title}</strong>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {assignment.className} · {assignment.mode === "mock_test" ? "Test" : assignment.mode === "checkup" ? "Check-up" : "Üben"}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
