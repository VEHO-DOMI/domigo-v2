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
  try {
    const c = await getDueCounts(getDb(), session.user.id);
    if (c.total > 0) dueLabel = `${c.total} due now`;
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

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Hi, {session.user.name} 👋</h1>
      {streakLabel && (
        <p style={{ margin: "0 0 6px", color: "#ea580c", fontWeight: 600, fontSize: 15 }}>{streakLabel}</p>
      )}
      <p style={{ color: "#64748b", marginTop: 0 }}>What would you like to do?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <Link href="/practice" style={cardStyle}>
          <strong style={{ fontSize: 17 }}>Practice →</strong>
          <span style={{ color: "#64748b", fontSize: 14 }}>Vocabulary &amp; grammar by unit</span>
        </Link>
        <Link href="/review" style={cardStyle}>
          <strong style={{ fontSize: 17 }}>Review →</strong>
          <span style={{ color: "#64748b", fontSize: 14 }}>{dueLabel}</span>
        </Link>
      </div>
      <form action={doSignOut} style={{ marginTop: 28 }}>
        <button type="submit" style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "16px 18px",
  textDecoration: "none",
  color: "#0f172a",
  background: "#f8fafc",
} as const;
