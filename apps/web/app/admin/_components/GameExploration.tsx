import Link from "next/link";
import { loadKeenBoss, loadKeenLevel } from "@/lib/keen-content";
import { listPaintChapters } from "@/lib/paint-content";
import { TeacherHeading } from "./TeacherShell";

/** Retain the old corpus-derived destinations, isolated from everyday class work. */
export default function GameExploration() {
  const bossChapters: string[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const ch = `ch${String(i).padStart(2, "0")}`;
    try {
      loadKeenLevel("g1.st.lost-pages", ch);
      loadKeenBoss("g1.st.lost-pages", ch);
      bossChapters.push(ch);
    } catch {
      // Preserve the existing rule: no door for an unauthored chapter.
    }
  }
  const paintChapters = listPaintChapters("g1.st.lost-pages");
  return (
    <>
      <Link className="teacher-text-link" href="/admin?bereich=verwaltung">← Verwaltung</Link>
      <TeacherHeading title="Spiele erproben">Vorhandene Entwicklungsstände für Lehrkräfte öffnen.</TeacherHeading>
      <p className="teacher-notice">Du spielst hier mit deinem Lehrerzugang. Diese Spiele können deinen eigenen Spielstand speichern. Das ist keine Schüleransicht ohne Speicherung.</p>
      <section className="teacher-secondary">
        <h2>Story-Spiel · Jahrgang 1</h2>
        <Link className="teacher-text-link" href="/play/1/world">Weltkarte öffnen <span aria-hidden="true">↗</span></Link>
      </section>
      {bossChapters.length > 0 && <section className="teacher-secondary"><h2>Wächter-Duelle</h2><ul className="teacher-chapter-links">
        {bossChapters.map((ch) => <li key={ch}><Link href={`/play/1/run?level=g1-${ch}&boss=1`}>Chapter {Number(ch.slice(2))}</Link></li>)}
      </ul></section>}
      {paintChapters.length > 0 && <section className="teacher-secondary"><h2>Das gemalte Buch</h2><ul className="teacher-chapter-links">
        {paintChapters.map((ch) => <li key={ch}><Link href={`/play/1/buch/${ch}`}>Chapter {Number(ch.slice(2))}</Link></li>)}
      </ul></section>}
    </>
  );
}
