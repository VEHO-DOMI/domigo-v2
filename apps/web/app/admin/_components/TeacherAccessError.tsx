import Link from "next/link";
import { TeacherHeading } from "./TeacherShell";

export default function TeacherAccessError({ retryHref }: { retryHref: string }) {
  return (
    <>
      <TeacherHeading title="Lehrerbereich">Deine Klassen und Aufgaben.</TeacherHeading>
      <div className="teacher-notice teacher-notice--error" role="alert">
        <p><strong>Dein Lehrerzugang konnte nicht geladen werden.</strong></p>
        <p>Bitte lade die Seite erneut. Deine Klassen sind derzeit nicht verfügbar.</p>
        <a href={retryHref} className="teacher-text-link">Erneut laden</a>
        <Link href="/admin/hilfe" className="teacher-text-link">Hilfe öffnen</Link>
      </div>
    </>
  );
}
