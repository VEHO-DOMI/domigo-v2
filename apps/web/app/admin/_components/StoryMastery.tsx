import Link from "next/link";
import { listReleasedStories } from "@domigo/content-loader";
import { getDb, getUnitMastery } from "@domigo/db";
import type { ActingTeacher } from "@/lib/identity";
import { readResult } from "../_lib/teacher-classes";
import { TeacherHeading } from "./TeacherShell";
import ReadError from "./ReadError";

export default async function StoryMastery({ teacher }: { teacher: ActingTeacher }) {
  const stories = listReleasedStories();
  const mastery = await Promise.all(stories.map((story) => readResult(() => getUnitMastery(getDb(), teacher.classScope, story.grade))));
  return (
    <>
      <Link className="teacher-text-link" href="/admin?bereich=verwaltung">← Verwaltung</Link>
      <TeacherHeading title="Spielstand nach Chapter">Die bisherige Spielübersicht über die Klassen, für die du Zugriff hast.</TeacherHeading>
      {stories.map((story, index) => {
        const result = mastery[index];
        return <section key={story.storyId} className="teacher-secondary">
          <h2>Jahrgang {story.grade} · {story.titleEn}</h2>
          {!result || result.status === "error" ? <ReadError label={`Spielstände für Jahrgang ${story.grade}`} retryHref="/admin?bereich=spielstand" />
            : result.value.length === 0 ? <p>Noch keine Spielversuche vorhanden.</p>
            : <div className="teacher-table-wrap" role="region" aria-label={`Spielstand Jahrgang ${story.grade}`} tabIndex={0}>
              <table><thead><tr><th>Chapter</th><th>Versuche</th><th>Gelöste Aufgaben</th><th>Richtig</th></tr></thead>
                <tbody>{result.value.map((row) => <tr key={row.unitSlug}>
                  <th scope="row">{chapterLabel(row.unitSlug)}</th><td>{row.attempts}</td><td>{row.itemsSolved}</td><td>{row.attempts > 0 ? `${Math.round(row.correctRate * 100)} %` : "—"}</td>
                </tr>)}</tbody>
              </table>
            </div>}
        </section>;
      })}
    </>
  );
}

function chapterLabel(slug: string): string {
  const match = /^g[1-4]-u(\d+)$/.exec(slug);
  return match ? `Chapter ${Number(match[1])}` : "Chapter nicht zugeordnet";
}
