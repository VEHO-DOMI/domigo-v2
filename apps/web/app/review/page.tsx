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
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Review</h1>
        <Link href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</Link>
      </div>

      {counts.total === 0 ? (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "#0f172a", marginBottom: 4 }}>You&apos;re all caught up! 🎉</p>
          <p style={{ color: "#64748b", marginTop: 0 }}>Practice more to add items to your review.</p>
          <Link href="/practice" style={{ ...cardStyle, marginTop: 12 }}>
            <strong style={{ fontSize: 17 }}>Practice →</strong>
            <span style={{ color: "#64748b", fontSize: 14 }}>Vocabulary &amp; grammar by unit</span>
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 18, color: "#0f172a", marginBottom: 2 }}>
            {counts.total} item{counts.total === 1 ? "" : "s"} due
          </p>
          <p style={{ color: "#64748b", marginTop: 0 }}>
            {counts.vocab} vocab · {counts.grammar} grammar
          </p>
          <Link href="/review/session" style={{ ...cardStyle, marginTop: 12 }}>
            <strong style={{ fontSize: 17 }}>Start review →</strong>
            <span style={{ color: "#64748b", fontSize: 14 }}>Answer your due items</span>
          </Link>
        </div>
      )}
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
