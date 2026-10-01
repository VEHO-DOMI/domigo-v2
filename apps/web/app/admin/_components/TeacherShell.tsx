import Link from "next/link";
import type { ReactNode } from "react";
import { helpNavigation, teacherNavigation, type TeacherArea } from "../_lib/navigation";

export function TeacherShell({ area, children }: { area: TeacherArea; children: ReactNode }) {
  return (
    <main className="teacher-page" lang="de">
      <a className="teacher-skip" href="#lehrerinhalt">Zum Inhalt</a>
      <div className="teacher-sheet">
        <nav className="teacher-nav" aria-label="Lehrerbereich">
          <ul>
            {teacherNavigation.map((item) => (
              <li key={item.id}>
                <Link href={item.href} aria-current={item.id === area ? "page" : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <Link href={helpNavigation.href} className="teacher-help">{helpNavigation.label}</Link>
        </nav>
        <div id="lehrerinhalt" className="teacher-content" tabIndex={-1}>{children}</div>
      </div>
    </main>
  );
}

export function TeacherHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="teacher-heading">
      <p className="teacher-eyebrow">DomiGo · Lehrerbereich</p>
      <h1>{title}</h1>
      <p className="teacher-intro">{children}</p>
    </header>
  );
}

export function ClassesLoading() {
  return <p className="teacher-notice" role="status">Klassen werden geladen …</p>;
}
