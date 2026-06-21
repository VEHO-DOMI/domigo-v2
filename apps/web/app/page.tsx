import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>DomiGo</h1>
      <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.5, marginTop: 0 }}>
        Vocabulary &amp; grammar practice for grades 1–4.
      </p>
      <Link
        href="/signin"
        style={{
          display: "inline-block", marginTop: 18, background: "#111827", color: "#fff",
          padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontSize: 16,
        }}
      >
        Sign in →
      </Link>
    </main>
  );
}
