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
 * Was die Vorschau noch nicht erreicht, steht als Text da, nicht als Knopf — keine
 * toten Aktionen. Die Zahlen kommen aus dem Korpus (listReleasedStories,
 * loadReleasedChapters, listApprovedUnits), nie von Hand gepflegt.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { listApprovedUnits, listReleasedStories, loadReleasedChapters } from "@domigo/content-loader";
import { getTeacherForPage } from "@/lib/identity";

const GRADES = [1, 2, 3, 4] as const;

/** Die Lehrer-Türen, die es schon vor der Vorschau gab — ehrlich beschriftet. */
const TEACHER_DOORS: Record<number, Array<{ href: string; label: string; note: string }>> = {
  1: [
    { href: "/play/1/buch/ch01", label: "Gemaltes Buch", note: "nur Lehrkräfte, Kapitel 2–6 im Entwurf" },
    { href: "/play/1/world", label: "Weltkarte (Keen)", note: "nur Lehrkräfte" },
  ],
  2: [{ href: "/play/2/school", label: "Schulhaus-Kapitel", note: "nur Lehrkräfte, solange nicht freigegeben" }],
};

export default async function ExplorerPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  const units = listApprovedUnits();
  const stories = listReleasedStories();

  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 25, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Schüleransicht</h1>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <Link href="/admin/studio" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Studio</Link>
          <Link href="/admin" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Verwaltung</Link>
        </div>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Öffne die Kinderseite so, wie ein Kind sie sieht. Das ist eine <strong>Vorschau</strong>: Antworten werden bewertet, aber nichts wird gespeichert — kein Versuch, kein Spielstand, keine Wiederholung. Klassenstatistik und Fortschritt der Kinder bleiben unberührt.
      </p>

      {GRADES.map((grade) => {
        const story = stories.find((s) => s.grade === grade && s.role === "canonical");
        const released = story ? loadReleasedChapters(story.storyId).length : 0;
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
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{gradeUnits} Einheiten</span>
              </Link>
              {doors.map((d) => (
                <Link key={d.href} href={d.href} className="dg-tile" style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px" }}>
                  <span style={{ fontWeight: 700 }}>{d.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{d.note}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="dg-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Noch nicht in der Schüleransicht</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>
          Lernpfad, Hören, Tests, Wiederholung und eine Aufgabe so, wie das Kind sie bekommt, folgen als Nächstes. Ranglisten gibt es noch nicht.
        </p>
      </section>
    </main>
  );
}
