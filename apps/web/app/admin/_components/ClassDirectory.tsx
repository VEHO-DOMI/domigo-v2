import Link from "next/link";
import { classPath, gradeLabel, type TeacherClass, type TeacherClassLists } from "../_lib/teacher-classes";
import CopyClassCode from "./CopyClassCode";
import ReadError from "./ReadError";

type Mode = "home" | "manage" | "writing";

function ClassCard({ cls, mode, nested = false }: { cls: TeacherClass; mode: Mode; nested?: boolean }) {
  const writing = mode === "writing";
  const Heading = nested ? "h3" : "h2";
  return (
    <li className="teacher-class" data-grade={cls.grade}>
      <div className="teacher-class-heading">
        <span className="teacher-grade" aria-hidden="true">{cls.grade >= 1 && cls.grade <= 4 ? cls.grade : "–"}</span>
        <div>
          <p className="teacher-class-meta">{gradeLabel(cls.grade)}{cls.schoolYear ? ` · Schuljahr ${cls.schoolYear}` : ""}</p>
          <Heading><Link href={classPath(cls.id, writing ? "writing" : "open")}>{cls.name}</Link></Heading>
          {cls.testStatus === "test" && <p className="teacher-test-label">Testklasse</p>}
        </div>
      </div>
      <Link className="teacher-class-open" href={classPath(cls.id, writing ? "writing" : "open")} aria-label={`${writing ? "Schreibabgaben" : "Klasse öffnen"}: ${cls.name}`}>
        {writing ? "Schreibabgaben" : "Klasse öffnen"}<span aria-hidden="true"> ↗</span>
      </Link>
      <nav className="teacher-class-links" aria-label={`Weitere Wege für ${cls.name}`}>
        {writing
          ? <Link href={classPath(cls.id)}>Fortschritt</Link>
          : <Link href={classPath(cls.id, "writing")}>Schreiben</Link>}
        <Link href={classPath(cls.id, "listening")}>Hören</Link>
        <Link href={classPath(cls.id, "roster")}>Klassenliste</Link>
      </nav>
      {mode === "manage" && <CopyClassCode code={cls.inviteCode} name={cls.name} />}
      {cls.archivedAt && <p className="teacher-archive-date">Archiviert am {new Date(cls.archivedAt).toLocaleDateString("de-AT", { timeZone: "Europe/Vienna" })}</p>}
    </li>
  );
}

function ClassList({ rows, mode, nested = false }: { rows: TeacherClass[]; mode: Mode; nested?: boolean }) {
  return <ul className="teacher-class-list">{rows.map((cls) => <ClassCard key={cls.id} cls={cls} mode={mode} nested={nested} />)}</ul>;
}

export default function ClassDirectory({ lists, mode = "home", lehrerraumUrl }: {
  lists: TeacherClassLists;
  mode?: Mode;
  lehrerraumUrl: string;
}) {
  const retryHref = mode === "manage" ? "/admin/classes" : mode === "writing" ? "/admin?bereich=schreiben" : "/admin";
  const active = lists.active.status === "ready" ? lists.active.value.filter((cls) => cls.testStatus !== "test") : [];
  const tests = lists.active.status === "ready" ? lists.active.value.filter((cls) => cls.testStatus === "test") : [];
  return (
    <div className="teacher-directory">
      <section aria-label="Aktive Klassen">
        {lists.active.status === "error" ? <ReadError label="Aktive Klassen" retryHref={retryHref} /> : (
          active.length > 0 ? <ClassList rows={active} mode={mode} /> : tests.length === 0 ? (
            <div className="teacher-empty">
              <h2>Keine aktive Klasse</h2>
              <p>Deine Lehrgruppen verwaltest du im Lehrerzimmer von Lauter Einser.</p>
              <a className="teacher-text-link" href={lehrerraumUrl}>Zum Lehrerzimmer <span aria-hidden="true">↗</span></a>
            </div>
          ) : null
        )}
      </section>
      {tests.length > 0 && (
        <section className="teacher-secondary" aria-labelledby="testklassen">
          <h2 id="testklassen">Testklassen</h2>
          <ClassList rows={tests} mode={mode} nested />
        </section>
      )}
      <section className="teacher-secondary" aria-label="Archivierte Klassen">
        {lists.archived.status === "error" ? <ReadError label="Archivierte Klassen" retryHref={retryHref} /> : (
          <details className="teacher-archive">
            <summary>Archivierte Klassen</summary>
            {lists.archived.value.length > 0
              ? <ClassList rows={lists.archived.value} mode={mode} />
              : <p>Keine archivierte Klasse vorhanden.</p>}
          </details>
        )}
      </section>
    </div>
  );
}
