import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, getUnitMastery, listStoryWorldGrades } from "@domigo/db";
import { getTeacherForPage } from "@/lib/identity";
import { readStoryWorlds } from "@/lib/story-world";
import StoryWorldControls from "../StoryWorldControls";

export const dynamic = "force-dynamic";

export default async function StoryWorldPage() {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");

  // Story mastery follows the same runtime visibility as the student surfaces.
  // Hiding a grade skips its read; it never changes the attempts ledger.
  // Each query is wrapped: one grade's DB hiccup must never blank the whole view.
  const worlds = await readStoryWorlds();
  const stories = worlds.stories;
  const klassen = teacher.classScope;
  const allowedGrades = await listStoryWorldGrades(getDb(), klassen).catch(() => null);
  const mastery = await Promise.all(stories.map((s) => getUnitMastery(getDb(), klassen, s.grade).catch(() => [])));
  const th = { padding: "7px 8px", fontFamily: "var(--font-label)", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", fontSize: 12 } as const;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 28, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Story world</h1>
      <Link href="/admin">Back to admin</Link>

      <StoryWorldControls grades={worlds.grades} allowedGrades={allowedGrades ?? []} available={worlds.available && allowedGrades !== null} />

      {stories.map((s, idx) => {
        const rows = mastery[idx] ?? [];
        return (
          <section key={s.storyId} className="dg-card" data-grade={s.grade} style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 17, margin: "0 0 10px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              G{s.grade} “{s.titleEn}” — mastery by unit
            </h2>
            {rows.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>No game attempts yet.</p>
            ) : (
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                    <th style={th}>Unit</th>
                    <th style={th}>Attempts</th>
                    <th style={th}>Items solved</th>
                    <th style={th}>Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.unitSlug} style={{ borderTop: "1px solid var(--card-border)" }}>
                      <td style={{ padding: "7px 8px", fontWeight: 700 }}>{m.unitSlug}</td>
                      <td style={{ padding: "7px 8px" }}>{m.attempts}</td>
                      <td style={{ padding: "7px 8px" }}>{m.itemsSolved}</td>
                      <td style={{ padding: "7px 8px", color: m.correctRate >= 0.7 ? "var(--correct)" : m.correctRate >= 0.4 ? "var(--partial)" : "var(--incorrect)", fontWeight: 700 }}>{Math.round(m.correctRate * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      })}

    </main>
  );
}
