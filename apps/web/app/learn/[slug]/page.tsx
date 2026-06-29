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
  const grade = slug.match(/^g(\d)/)?.[1];

  return (
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>{slug}</h1>
        <Link href="/learn" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Study Path</Link>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {views.map((n) => (
          <NodeRow key={n.id} slug={slug} node={n} />
        ))}
      </ol>
      <p style={{ marginTop: 18 }}>
        <Link href="/review" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>Review due items →</Link>
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
      className={locked ? "dg-tile--locked" : "dg-tile"}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", opacity: locked ? 0.7 : 1 }}
    >
      <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: locked ? "var(--muted)" : "var(--ink)" }}>{node.title}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: locked ? "var(--muted)" : node.status === "available" ? "var(--accent)" : "var(--accent-deep)" }}>{meta}</span>
    </div>
  );
  return <li>{locked ? inner : <Link href={`/learn/${slug}/${node.id}`} style={{ textDecoration: "none" }}>{inner}</Link>}</li>;
}
