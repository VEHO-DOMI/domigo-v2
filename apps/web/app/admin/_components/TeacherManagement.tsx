import Link from "next/link";
import { additionalNavigation, grandmasterNavigation, managementNavigation } from "../_lib/navigation";
import { TeacherHeading } from "./TeacherShell";

export default function TeacherManagement({ grandmaster, lehrerraumUrl }: { grandmaster: boolean; lehrerraumUrl: string }) {
  return (
    <>
      <TeacherHeading title="Verwaltung">Klassen organisieren, Aufgaben vorbereiten und deine Kontodaten ansehen.</TeacherHeading>
      <ul className="teacher-tools">
        {managementNavigation.map((item) => (
          <li key={item.id}><Link href={item.href}>{item.label} <span aria-hidden="true">↗</span></Link><p>{item.description}</p></li>
        ))}
        <li><a href={lehrerraumUrl}>Zum Lehrerzimmer <span aria-hidden="true">↗</span></a><p>Lehrgruppen und Klassenlisten zentral bei Lauter Einser pflegen.</p></li>
      </ul>
      <section className="teacher-secondary" aria-labelledby="weitere-werkzeuge">
        <h2 id="weitere-werkzeuge">Weitere Werkzeuge</h2>
        <ul className="teacher-simple-links">
          {additionalNavigation.map((item) => <li key={item.id}><Link href={item.href}>{item.label} <span aria-hidden="true">↗</span></Link></li>)}
        </ul>
      </section>
      {grandmaster && (
        <section className="teacher-operations" aria-label="Großmeisterzugang">
          <Link href={grandmasterNavigation.href}>{grandmasterNavigation.label} <span aria-hidden="true">↗</span></Link>
          <p>Die Klassen der gesamten Plattform mit ihren bestehenden Verwaltungswegen.</p>
        </section>
      )}
    </>
  );
}
