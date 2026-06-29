import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getDb, getDueCounts, getUserProgress, isStreakActive } from "@domigo/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  // Due-count badge for the Review card. Wrapped: a DB hiccup must never 500 the post-login landing.
  let dueLabel = "Spaced review of past items";
  let dueBadge: string | null = null;
  try {
    const c = await getDueCounts(getDb(), session.user.id);
    if (c.total > 0) { dueLabel = "Spaced review of past items"; dueBadge = `${c.total} due now`; }
  } catch {
    /* keep default */
  }

  // Daily-streak badge. Wrapped like the due count so a DB hiccup never 500s the landing.
  let streakLabel: string | null = null;
  try {
    const p = await getUserProgress(getDb(), session.user.id);
    if (p && p.streak > 0 && isStreakActive(p.lastSessionDate)) streakLabel = `🔥 ${p.streak}-day streak`;
  } catch {
    /* no streak badge on failure */
  }

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const items: { href: string; icon: string; title: string; sub: string; badge?: string | null }[] = [
    { href: "/practice", icon: "📚", title: "Practice", sub: "Vocabulary & grammar by unit" },
    { href: "/review", icon: "🔁", title: "Review", sub: dueLabel, badge: dueBadge },
    { href: "/learn", icon: "🗺️", title: "Study Path", sub: "Guided units with checkpoints" },
    { href: "/listening", icon: "🎧", title: "Listening", sub: "Audio comprehension by unit" },
    { href: "/tests", icon: "📝", title: "Mock Test", sub: "Practice a Schularbeit" },
  ];

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <h1 style={{ fontSize: 30, margin: "0 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Hi, {session.user.name} 👋</h1>
      {streakLabel && (
        <span style={{ display: "inline-flex", alignItems: "center", background: "rgba(234,88,12,0.12)", color: "#c2410c", fontWeight: 700, fontSize: 13, padding: "4px 12px", borderRadius: 999, fontFamily: "var(--font-label)" }}>{streakLabel}</span>
      )}
      <p style={{ color: "var(--text-secondary)", margin: streakLabel ? "10px 0 0" : "0" }}>What would you like to do?</p>

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
