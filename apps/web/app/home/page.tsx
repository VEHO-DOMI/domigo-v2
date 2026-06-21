import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Hi, {session.user.name} 👋</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>What would you like to do?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <Link href="/practice" style={cardStyle}>
          <strong style={{ fontSize: 17 }}>Practice →</strong>
          <span style={{ color: "#64748b", fontSize: 14 }}>Vocabulary &amp; grammar by unit</span>
        </Link>
        <div style={{ ...cardStyle, opacity: 0.55, cursor: "default" }}>
          <strong style={{ fontSize: 17 }}>Review</strong>
          <span style={{ color: "#94a3b8", fontSize: 14 }}>Spaced review — coming soon</span>
        </div>
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
