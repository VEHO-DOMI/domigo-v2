import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { itemsInPool, listApprovedUnits, loadJourney } from "@domigo/content-loader";
import type { Journey, JourneyNode } from "@domigo/content-schema";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { isSlugAllowed } from "@/lib/grade-scope";
import { resolveStudentView } from "@/lib/student-view";
import type { ActingUser } from "@/lib/identity";
import PreviewBanner from "@/app/PreviewBanner";
import { bestTierPerItem, buildUnitNodes, deriveJourneyProgress, getDb, getJourneyAttempts, getUnitPathProgress, listReservedForClass, withProgress } from "@domigo/db";
import type { JourneyNodeView, NodeView } from "@domigo/db";

export const dynamic = "force-dynamic";

export default async function UnitPathPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ jahrgang?: string | string[] }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  if (!listApprovedUnits().includes(slug)) notFound(); // unknown unit stays a 404, not a redirect

  // P1 (P-R1.5): the deep-link half of the grade scope — a foreign year's unit
  // sends the child back to its own Study Path list.
  if (!preview && !isSlugAllowed(slug, view.grades)) redirect("/learn");

  // J-1: an AUTHORED journey (J-2 ships them) re-renders /learn as the spine;
  // until a unit has one, the legacy derived Study Path below is the fallback (F10).
  const journey = loadJourney(slug);
  if (journey) return <JourneySpine slug={slug} journey={journey} acting={acting} preview={preview} />;

  const unit = await loadUnitWithOverrides(slug);
  const nodes = buildUnitNodes(unit.vocab, unit.grammar);
  let completed = new Map<string, { stars: number }>();
  try {
    completed = acting ? await getUnitPathProgress(getDb(), acting.userId, slug) : new Map();
  } catch {
    /* empty — render the path as all-unstarted */
  }
  const views = withProgress(nodes, completed).map((node) => preview ? { ...node, status: "available" as const } : node);
  const grade = slug.match(/^g(\d)/)?.[1];

  return (
    <>
      {preview && <PreviewBanner grade={Number(slug.charAt(1))} />}
    <main data-grade={grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Chapter {Number(slug.slice(-2))}</h1>
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
    </>
  );
}

// ── J-1 · the authored journey spine ─────────────────────────────────────────

async function JourneySpine({ slug, journey, acting, preview }: { slug: string; journey: Journey; acting: ActingUser | null; preview: boolean }) {
  const unit = await loadUnitWithOverrides(slug);
  const itemIds = [...unit.vocab.map((v) => v.id), ...unit.grammar.map((g) => g.id)];
  const reserved = acting ? await listReservedForClass(getDb(), acting.classScope, acting.classId).catch(() => new Set<string>()) : new Set<string>();

  // each gating node's items = its pool's slice of this unit (deterministic)
  const nodeItems = new Map<string, readonly string[]>();
  for (const n of journey.nodes) {
    if ((n.kind === "practice" || n.kind === "side-quest") && n.itemPool) {
      nodeItems.set(n.id, itemsInPool(itemIds, n.itemPool, reserved, journey.poolOverrides));
    }
  }
  const attempts = acting ? await getJourneyAttempts(getDb(), acting.userId, slug).catch(() => []) : [];
  const views = deriveJourneyProgress(journey.nodes, nodeItems, bestTierPerItem(attempts)).map((node) => preview ? { ...node, status: "available" as const } : node);

  return (
    <>
      {preview && <PreviewBanner grade={Number(slug.charAt(1))} />}
    <main data-grade={journey.grade} style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Chapter {Number(slug.slice(-2))}</h1>
        <Link href="/learn" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Lernpfad</Link>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {journey.nodes.map((n, i) => (
          <JourneyNodeRow key={n.id} slug={slug} node={n} view={views[i]!} grade={journey.grade} />
        ))}
      </ol>
    </main>
    </>
  );
}

const NODE_ICON: Record<JourneyNode["kind"], string> = {
  lesson: "📖",
  practice: "✏️",
  game: "🎮",
  review: "🔁",
  "side-quest": "⭐",
};

function JourneyNodeRow({ slug, node, view, grade }: { slug: string; node: JourneyNode; view: JourneyNodeView; grade: number }) {
  const locked = view.status === "locked";
  const isGame = node.kind === "game";
  // game nodes deep-link into the grade campaign; others enter the node runner.
  const href = isGame && node.gamePointer ? `/play/${grade}/${node.gamePointer.zoneOrChapter}` : `/learn/${slug}/${node.id}`;
  const meta =
    view.status === "complete"
      ? "★".repeat(view.stars) + "☆".repeat(3 - view.stars)
      : locked
        ? "🔒"
        : isGame
          ? "Spielen →"
          : "Los →";
  const inner = (
    <div
      className={locked ? "dg-tile--locked" : "dg-tile"}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "13px 16px", opacity: locked ? 0.7 : 1 }}
    >
      <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: locked ? "var(--muted)" : "var(--ink)" }}>
        {NODE_ICON[node.kind]} {node.titleDe}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap", color: locked ? "var(--muted)" : view.status === "available" ? "var(--accent)" : "var(--accent-deep)" }}>{meta}</span>
    </div>
  );
  return <li>{locked ? inner : <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>}</li>;
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
