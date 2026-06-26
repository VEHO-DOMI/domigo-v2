import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { buildUnitNodes, getDb, getUnitPathProgress, withProgress } from "@domigo/db";
import type { NodeView } from "@domigo/db";

export const dynamic = "force-dynamic";

export default async function UnitPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listApprovedUnits().includes(slug)) notFound();

  const unit = loadUnit(slug);
  const nodes = buildUnitNodes(unit.vocab, unit.grammar);
  let completed = new Map<string, { stars: number }>();
  try {
    completed = await getUnitPathProgress(getDb(), session.user.id, slug);
  } catch {
    /* empty — render the path as all-unstarted */
  }
  const views = withProgress(nodes, completed);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{slug}</h1>
        <Link href="/learn" style={{ fontSize: 14, color: "#2563eb" }}>← Study Path</Link>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {views.map((n) => (
          <NodeRow key={n.id} slug={slug} node={n} />
        ))}
      </ol>
      <p style={{ marginTop: 18 }}>
        <Link href="/review" style={{ fontSize: 14, color: "#2563eb" }}>Review due items →</Link>
      </p>
    </main>
  );
}

function NodeRow({ slug, node }: { slug: string; node: NodeView }) {
  const locked = node.status === "locked";
  const meta =
    node.status === "completed"
      ? node.graded
        ? "★".repeat(node.stars) + "☆".repeat(3 - node.stars)
        : "✓ done"
      : node.status === "available"
        ? "Start →"
        : "🔒 Locked";
  const inner = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "12px 16px",
        background: locked ? "#f8fafc" : "#fff",
        opacity: locked ? 0.55 : 1,
      }}
    >
      <span style={{ fontWeight: 600, color: locked ? "#94a3b8" : "#0f172a" }}>{node.title}</span>
      <span style={{ fontSize: 13, color: locked ? "#94a3b8" : "#64748b" }}>{meta}</span>
    </div>
  );
  return <li>{locked ? inner : <Link href={`/learn/${slug}/${node.id}`} style={{ textDecoration: "none" }}>{inner}</Link>}</li>;
}
