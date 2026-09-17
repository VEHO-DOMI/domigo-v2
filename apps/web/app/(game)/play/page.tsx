/**
 * /play — the story index. A signed-in student lands straight on THEIR grade's
 * hub; when the grade can't be resolved (DB hiccup, dev identity) — or their
 * grade's story isn't released yet — render the chooser of released stories.
 * The list is DERIVED from the corpus (listReleasedStories), so a new grade's
 * game appears here the moment its release.json ships and an unreleased grade
 * never renders a dead tile (Law 9: no dead toggles).
 *
 * K1b · GRADE SCOPE. This chooser was the LAST child-facing surface where a
 * second-year could open all four school years: P1 bound the four practice lists
 * and stopped at the game (drift D10, ruling P-R1.5 "a registered child only has
 * access to the class it was created in"). The decision is not re-invented here —
 * `visibleGradesFor` (lib/grade-scope.ts) is THE one, and `resolveVisibleGrades`
 * is its DB wrapper, the same pair /practice and /learn already use. Its `null`
 * degradation is kept WORD FOR WORD: an unresolvable grade opens all four years,
 * because showing too much is a cosmetic miss and showing nothing would be a dead
 * page for a child who did nothing wrong.
 *
 * K2b · TEACHERS GET IN (Rider C, a K1b finding). This page resolved only a
 * STUDENT, so a signed-in teacher was bounced to /signin from the one surface the
 * whole game hangs off — while the hub one level down, /play/[grade], has let her
 * in since 2026-07-17 under the preview law. The fix is that hub's own pattern,
 * not a new one: the student is resolved FIRST (only a student is grade-bound),
 * and the teacher falls out of `getPlayerForPage`, which deliberately answers for
 * both. Student behaviour is byte-identical — the grade scope still hangs on the
 * student, so a second-year still lands straight on year two.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { listReleasedStories } from "@domigo/content-loader";
import { getActingUserForPage, getPlayerForPage } from "@/lib/identity";
import { resolveVisibleGrades } from "@/lib/grade-scope";
import { DEFAULT_STORY_UI, STORY_UI } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function PlayIndexPage() {
  const student = await getActingUserForPage();
  const acting = student ?? (await getPlayerForPage());
  if (!acting) redirect("/signin");

  // The years this child may see. resolveVisibleGrades swallows a DB hiccup itself
  // and lands on all four — so this never 500s and never renders an empty page for
  // a reason the child has nothing to do with. (redirect() throws by design in
  // Next, so it stays outside anything that catches.)
  //
  // A TEACHER is not grade-bound: she passes null and sees every released year,
  // which is the same preview she already gets on /play/[grade].
  const grades = await resolveVisibleGrades(student ? student.classId : null);
  const stories = listReleasedStories().filter((s) => grades.includes(s.grade));

  // Fast path: exactly one year in scope and a story released for it. Only a
  // STUDENT is sent straight through — a teacher who lands here wants the list.
  if (student && grades.length === 1 && stories.some((s) => s.grade === grades[0])) {
    redirect(`/play/${grades[0]}`);
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Story Mode</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Pick a story world — every chapter runs on the words you learn.</p>

      {stories.length === 0 && (
        // The honest empty state. Before K1b this branch could not happen — the
        // list was every released story — and an empty <div> would read as a
        // broken page rather than as "not yet".
        <p style={{ color: "var(--muted)", marginTop: 20 }}>
          Nothing here yet for your school year — it appears as soon as your story is released.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {stories.map((s) => {
          const ui = STORY_UI[s.grade] ?? DEFAULT_STORY_UI;
          return (
            <Link key={s.storyId} href={`/play/${s.grade}`} data-grade={s.grade} className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
              <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1, flex: "0 0 auto" }}>{ui.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{s.titleEn}</span>
                <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}>Grade {s.grade} — {ui.blurb}</span>
              </span>
              <span aria-hidden="true" style={{ flex: "0 0 auto", color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>→</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
