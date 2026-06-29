import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "56px 20px", fontFamily: "var(--font-body)", color: "var(--text)", textAlign: "center" }}>
      <h1 className="brand-wordmark" style={{ fontSize: 52, margin: "0 0 6px", lineHeight: 1 }}>DomiGo</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.5, marginTop: 0 }}>
        Vocabulary &amp; grammar practice for grades 1–4.
      </p>
      <Link href="/signin" className="dg-btn" style={{ marginTop: 20, padding: "12px 24px", fontSize: 16 }}>
        Sign in →
      </Link>
    </main>
  );
}
