/**
 * /play — the story index. A signed-in student lands straight on THEIR grade's
 * hub; when the grade can't be resolved (DB hiccup, dev identity) — or their
 * grade's story isn't released yet — render the chooser of released stories.
 * The list is DERIVED from the corpus (listReleasedStories), so a new grade's
 * game appears here the moment its release.json ships and an unreleased grade
 * never renders a dead tile (Law 9: no dead toggles).
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { listReleasedStories } from "@domigo/content-loader";
import { getClassGrade, getDb } from "@domigo/db";
import { getActingUserForPage } from "@/lib/identity";
import { DEFAULT_STORY_UI, STORY_UI } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function PlayIndexPage() {
  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const stories = listReleasedStories();

  // Fast path: the student's own grade. Wrapped — a DB hiccup must never 500
  // the index; it just falls through to the chooser. (redirect() throws by
  // design in Next, so it stays OUTSIDE the try.)
  let grade: number | null = null;
  try {
    grade = await getClassGrade(getDb(), acting.classId);
  } catch {
    /* chooser below */
  }
  if (grade !== null && stories.some((s) => s.grade === grade)) redirect(`/play/${grade}`);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Story Mode</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Pick a story world — every chapter runs on the words you learn.</p>

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
