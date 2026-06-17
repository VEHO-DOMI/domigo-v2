import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>DomiGo v2</h1>
      <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.5, marginTop: 0 }}>
        Foundation harness — the approved corpus (57 units, grades 1–4) loaded, rendered, and graded
        through the shared content loader, item renderer, and grading engine.
      </p>
      <Link
        href="/practice"
        style={{
          display: "inline-block", marginTop: 18, background: "#111827", color: "#fff",
          padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontSize: 16,
        }}
      >
        Open Practice →
      </Link>
    </main>
  );
}
