import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { listReleasedStories } from "@domigo/content-loader";
import { getClassGrade, getDb, getDueCounts, getUserProgress, isStreakActive } from "@domigo/db";
import { registerFor } from "@/lib/levels";
import { DEFAULT_STORY_UI, STORY_UI } from "@/lib/stories";
import ProfileCard from "./ProfileCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  // Due-count badge for the Review card. Wrapped: a DB hiccup must never 500 the post-login landing.
  let dueLabel = "Spaced review of past items";
  let dueBadge: string | null = null;
  try {
    const c = await getDueCounts(getDb(), session.user.id, session.user.classId ?? "");
    if (c.total > 0) { dueLabel = "Spaced review of past items"; dueBadge = `${c.total} due now`; }
  } catch {
    /* keep default */
  }

  // K7a · The profile card's numbers: the two XP pools plus the daily streak,
  // which used to be a badge of its own and is now a cell in the card's stats
  // row (the OG composition, design-study-og-trainers.md:503-518). Wrapped like
  // the due count: a DB hiccup costs the CARD, never the landing page.
  let progress: { xp: number; grammarXp: number; streak: number | null } | null = null;
  try {
    const p = await getUserProgress(getDb(), session.user.id);
    if (p) {
      progress = {
        xp: p.xp,
        grammarXp: p.grammarXp,
        streak: p.streak > 0 && isStreakActive(p.lastSessionDate) ? p.streak : null,
      };
    }
  } catch {
    /* no card on failure */
  }

  // Story tile — the grade's game, first on the landing (the story modes are the
  // app's engagement heart and must be one tap from sign-in). The grade→story map
  // is derived from the corpus; the lookup is wrapped like the badges: a DB hiccup
  // degrades to the /play chooser, never a dead link and never a 500.
  // The grade is read ONCE and serves two readers: the story tile below and the
  // profile card's title register (1st grade reads the gentle ladder, 2nd-4th
  // the gamer one). A failed read leaves it null — the chooser fallback here,
  // the gamer register there. Both are cosmetic misses, never a dead page.
  let grade: number | null = null;
  let storyTile = { href: "/play", icon: DEFAULT_STORY_UI.icon, title: "Story", sub: "Story adventures by grade" };
  try {
    grade = session.user.classId ? await getClassGrade(getDb(), session.user.classId) : null;
    const story = grade === null ? undefined : listReleasedStories().find((s) => s.grade === grade);
    if (story) {
      const ui = STORY_UI[story.grade] ?? DEFAULT_STORY_UI;
      storyTile = { href: `/play/${story.grade}`, icon: ui.icon, title: "Story", sub: `${story.titleEn} — ${ui.blurb}` };
    }
  } catch {
    /* keep the chooser fallback */
  }

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const items: { href: string; icon: string; title: string; sub: string; badge?: string | null }[] = [
    storyTile,
    { href: "/practice", icon: "📚", title: "Practice", sub: "Vocabulary & grammar by unit" },
    { href: "/review", icon: "🔁", title: "Review", sub: dueLabel, badge: dueBadge },
    { href: "/learn", icon: "🗺️", title: "Study Path", sub: "Guided units with checkpoints" },
    { href: "/listening", icon: "🎧", title: "Listening", sub: "Audio comprehension by unit" },
    { href: "/tests", icon: "📝", title: "Mock Test", sub: "Practice a Schularbeit" },
    { href: "/assignments", icon: "🗂️", title: "Aufgaben", sub: "Assigned by your teacher" },
  ];

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 30, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Hi, {session.user.name} 👋</h1>
      {progress && (
        <ProfileCard xp={progress.xp} grammarXp={progress.grammarXp} streak={progress.streak} register={registerFor(grade)} />
      )}
      <p style={{ color: "var(--text-secondary)", margin: progress ? "18px 0 0" : "0" }}>What would you like to do?</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
            <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1, flex: "0 0 auto" }}>{it.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{it.title}</span>
              <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}>{it.sub}</span>
            </span>
            {it.badge && (
              <span style={{ flex: "0 0 auto", background: "var(--accent-soft)", color: "var(--accent-deep)", fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 999, fontFamily: "var(--font-label)" }}>{it.badge}</span>
            )}
            <span aria-hidden="true" style={{ flex: "0 0 auto", color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>→</span>
          </Link>
        ))}
      </div>

      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14, cursor: "pointer", textDecoration: "underline", fontFamily: "var(--font-body)" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
