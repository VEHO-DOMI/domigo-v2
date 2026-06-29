import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb, getDueCounts } from "@domigo/db";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  const counts = await getDueCounts(getDb(), session.user.id);

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Review</h1>
        <Link href="/home" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Home</Link>
      </div>

      {counts.total === 0 ? (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "var(--ink)", marginBottom: 4 }}>You&apos;re all caught up! 🎉</p>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Practice more to add items to your review.</p>
          <Link href="/practice" className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginTop: 12 }}>
            <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>📚</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Practice</span>
              <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}>Vocabulary &amp; grammar by unit</span>
            </span>
            <span aria-hidden="true" style={{ color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>→</span>
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "var(--ink)", marginBottom: 2 }}>
            {counts.total} item{counts.total === 1 ? "" : "s"} due
          </p>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
            {counts.vocab} vocab · {counts.grammar} grammar
          </p>
          <Link href="/review/session" className="dg-tile" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", marginTop: 12 }}>
            <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>🔁</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Start review</span>
              <span style={{ display: "block", fontSize: 14, color: "var(--text-secondary)" }}>Answer your due items</span>
            </span>
            <span aria-hidden="true" style={{ color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>→</span>
          </Link>
        </div>
      )}
    </main>
  );
}
