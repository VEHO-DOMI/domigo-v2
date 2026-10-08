import Link from "next/link";
import type { AssignmentRow, ClassSummary } from "@domigo/db";
import { deadlineLabel, summarizeAssignments, type StartRead } from "@/lib/teacher-start";

export default function KlassenKarten({ classes, registrations, assignments, now }: {
  classes: readonly ClassSummary[];
  registrations: StartRead<{ classId: string; claimedCount: number }[]>;
  assignments: StartRead<AssignmentRow[]>;
  now: Date;
}) {
  const claimed = new Map(registrations.ok ? registrations.value.map((row) => [row.classId, row.claimedCount]) : []);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 16 }}>
      {classes.map((cls) => {
        const tasks = assignments.ok ? summarizeAssignments(assignments.value, cls.id, now) : null;
        return (
          <article key={cls.id} className="dg-card" data-class-card={cls.id} data-grade={cls.grade} style={{ minWidth: 0, overflowWrap: "anywhere", display: "flex", flexDirection: "column" }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>Jahrgang {cls.grade}</p>
            <h2 style={{ margin: 0, fontSize: 23, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{cls.name}</h2>
            <dl style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, margin: "20px 0 12px" }}>
              {[
                { label: "Auf der Liste", value: cls.studentCount },
                { label: "Angemeldet", value: registrations.ok ? claimed.get(cls.id) ?? 0 : "—" },
                { label: "Offene Aufgaben", value: tasks?.open ?? "—" },
              ].map((metric) => (
                <div key={metric.label} style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "flex-end", gap: 4 }}>
                  <dt style={{ fontSize: 13, color: "var(--text-secondary)" }}>{metric.label}</dt>
                  <dd style={{ margin: 0, fontSize: 28, lineHeight: 1.2, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>{metric.value}</dd>
                </div>
              ))}
            </dl>
            {!registrations.ok && <p role="status" style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px" }}>Anmeldezahl gerade nicht verfügbar.</p>}
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 18px", lineHeight: 1.5 }}>
              {tasks === null ? "Aufgabenzahlen gerade nicht verfügbar." : <>
                {tasks.nextDue ? <>Nächste Fälligkeit: <time dateTime={tasks.nextDue.toISOString()}>{deadlineLabel(tasks.nextDue)}</time> Uhr.</> : tasks.open > 0 ? "Offene Aufgaben ohne Abgabefrist." : "Keine offenen Aufgaben."}
                {tasks.overdue > 0 && <> {tasks.overdue} {tasks.overdue === 1 ? "Aufgabe mit abgelaufener Frist" : "Aufgaben mit abgelaufener Frist"}.</>}
              </>}
            </p>
            <nav aria-label={`Wege für ${cls.name}`} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 16px", marginTop: "auto", fontSize: 14 }}>
              <Link href={`/admin/classes/${cls.id}`} className="dg-btn" style={{ padding: "10px 14px" }}>Klasse öffnen</Link>
              <Link href="/admin/assignments/new" style={{ fontWeight: 700, color: "var(--accent)" }}>Aufgabe zuweisen</Link>
              <Link href={`/practice?jahrgang=${cls.grade}`} style={{ fontWeight: 700, color: "var(--accent)" }}>Als Kind ansehen</Link>
            </nav>
          </article>
        );
      })}
    </div>
  );
}
