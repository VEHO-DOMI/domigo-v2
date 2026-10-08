import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, getClassPurposes, listClassesForTeacher, listClassRegistrationCountsForTeacher, listAssignmentsByCreator } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { isGrandmaster } from "@/lib/grandmaster";
import { kontoBaseUrl } from "@/lib/konto/basis";
import { listPaintChapters } from "@/lib/paint-content";
import { readStart } from "@/lib/teacher-start";
import { abmelden } from "../le/konto-aktion";
import KlassenKarten from "./KlassenKarten";

export const dynamic = "force-dynamic";

const doors = [
  { title: "Story world", description: "Open or park story worlds by grade. View story mastery.", href: "/admin/story-worlds", label: "Story world settings" },
  { title: "Schüleransicht", description: "Üben, Lernpfad, Hören, Tests und Geschichten in der Kinderansicht öffnen.", href: "/admin/explorer", label: "Schüleransicht öffnen" },
  { title: "Aufgaben", description: "Eigene Aufgaben zusammenstellen, zuweisen und ihre Ergebnisse ansehen.", href: "/admin/assignments", label: "Aufgaben öffnen" },
  { title: "Studio", description: "Aufgaben bearbeiten, eigene Aufgaben entwerfen und ausprobieren.", href: "/admin/studio", label: "Studio öffnen" },
  { title: "Kurzanleitung", description: "Von der Klasse bis zu den Ergebnissen — die Schritte auf einer Seite zum Ausdrucken.", href: "/admin/hilfe", label: "Kurzanleitung öffnen" },
  { title: "Konto", description: "Dein Konto ansehen. Anmeldung und Passwort verwaltest du bei Lauter Einser.", href: "/admin/settings", label: "Kontoeinstellungen öffnen" },
];

export default async function AdminPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  // Own active classes, even for the grandmaster. Every read carries BOTH walls:
  // the account session's class scope and this teacher's ownership/creator id.
  const [classes, registrations, assignments] = await Promise.all([
    readStart(() => listClassesForTeacher(getDb(), teacher.classScope, teacher.userId)),
    readStart(() => listClassRegistrationCountsForTeacher(getDb(), teacher.classScope, teacher.userId)),
    readStart(() => listAssignmentsByCreator(getDb(), teacher.classScope, teacher.userId)),
  ]);
  const purposes = classes.ok
    ? await getClassPurposes(getDb(), teacher.classScope, classes.value.map((cls) => cls.id))
    : new Map();
  const paintChapters = listPaintChapters("g1.st.lost-pages");
  const lehrerraumUrl = `${kontoBaseUrl()}/lehrerraum/lehrgruppen`;

  // Existing account sign-out, unchanged; no new write action on the dashboard.
  async function doSignOut() {
    "use server";
    await abmelden();
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Deine Klassen</h1>
      <p style={{ color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.5 }}>Öffne eine Klasse, weise eine Aufgabe zu oder sieh dir das Üben aus Kindersicht an.</p>

      {!classes.ok ? (
        <section className="dg-card" role="status">
          <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Klassen gerade nicht verfügbar</h2>
          <p>Die Klassen konnten nicht geladen werden. Lade die Seite in einem Moment erneut.</p>
          <Link href="/admin/classes">Zur Klassenübersicht</Link>
        </section>
      ) : classes.value.length === 0 ? (
        <section className="dg-card">
          <h2 style={{ fontSize: 22, margin: "0 0 8px", fontFamily: "var(--font-display)" }}>Noch keine Klasse</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Deine Klassen legst du im Lehrer-Raum von Lauter Einser an. Hier findest du danach ihren Fortschritt und ihre Aufgaben.</p>
          <a href={lehrerraumUrl} className="dg-btn" style={{ display: "inline-block" }}>Zum Lehrer-Raum</a>
        </section>
      ) : (
        <>
          <KlassenKarten purposes={purposes} classes={classes.value} registrations={registrations} assignments={assignments} now={new Date()} />
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "14px 0 0" }}>
            Die Kinderzahlen beziehen sich auf die DomiGo-Liste. „Angemeldet“ zählt die bereits aktivierten Zugänge.
            Offene Aufgaben sind deine nicht archivierten Aufgaben ohne abgelaufene Frist, unabhängig von den Abgaben der Kinder.
            Bei „Aufgabe zuweisen“ wählst du die Klasse im nächsten Schritt. „Als Kind ansehen“ öffnet eine Vorschau ohne Speicherung.
          </p>
        </>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: 16, fontSize: 14, fontWeight: 600 }}>
        <Link href="/admin/classes">Klassenübersicht und Archiv</Link>
        <a href={lehrerraumUrl}>Klassen im Lehrer-Raum verwalten</a>
      </div>

      {/* The class wall already rolls up ALL practice modes by Chapter, with
          honest failure states. Keep progress there, next to its own class. */}
      <h2 style={{ fontSize: 22, margin: "32px 0 12px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Weitere Wege</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
        {doors.map((door) => (
          <section key={door.href} className="dg-card" style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h3 style={{ fontSize: 18, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>{door.title}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 14px", lineHeight: 1.5 }}>{door.description}</p>
            <Link href={door.href} style={{ marginTop: "auto", fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>{door.label} →</Link>
          </section>
        ))}
        <section className="dg-card" style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 18, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Das gemalte Buch</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 14px", lineHeight: 1.5 }}>Child access follows Story world. Draft Chapters are teacher-only. Preview existing Chapters here; your progress stays on this device.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {paintChapters.map((ch) => (
              <Link key={ch} href={`/play/1/buch/${ch}`} className="dg-chip" style={{ fontSize: 14, padding: "6px 10px" }}>Chapter {Number(ch.slice(2))} →</Link>
            ))}
          </div>
        </section>
      </div>

      {isGrandmaster(teacher.userId) && (
        <section className="dg-card" style={{ marginTop: 16, border: "2px solid var(--accent)" }}>
          <h2 style={{ fontSize: 18, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Großmeister — alle Klassen</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>Alle Klassen der Plattform, ihre Namenslisten und ihr Fortschritt.</p>
          <Link href="/admin/grandmaster" className="dg-btn" style={{ display: "inline-block" }}>Alle Klassen ansehen →</Link>
        </section>
      )}

      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)" }}>Abmelden</button>
      </form>
    </main>
  );
}
