import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listApprovedUnits, loadUnitStructures, loadWordbank } from "@domigo/content-loader";
import { loadUnitWithOverrides } from "@/lib/content-service";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { buildUnitNodes, getDb, getUnitPathProgress, nodeItemIds, withProgress } from "@domigo/db";
import TeachingNode from "./TeachingNode";
import PathPracticeNode from "./PathPracticeNode";

export const dynamic = "force-dynamic";

type Resolved = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

export default async function NodeRunnerPage({ params }: { params: Promise<{ slug: string; node: string }> }) {
  const { slug, node: nodeId } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listApprovedUnits().includes(slug)) notFound();

  const unit = await loadUnitWithOverrides(slug);
  const nodes = buildUnitNodes(unit.vocab, unit.grammar);
  const def = nodes.find((n) => n.id === nodeId);
  if (!def) notFound();

  // Server-side unlock gate: a directly-typed locked-node URL bounces to the map.
  let completed = new Map<string, { stars: number }>();
  try {
    completed = await getUnitPathProgress(getDb(), session.user.id, slug);
  } catch {
    /* empty */
  }
  const view = withProgress(nodes, completed).find((v) => v.id === nodeId);
  if (view?.status === "locked") redirect(`/learn/${slug}`);

  if (def.kind === "vocab-intro") {
    return <TeachingNode unitSlug={slug} nodeId={nodeId} kind={def.kind} wordbank={loadWordbank(slug)} />;
  }
  if (def.kind === "grammar-intro") {
    return <TeachingNode unitSlug={slug} nodeId={nodeId} kind={def.kind} structures={loadUnitStructures(slug)} />;
  }

  // practice / checkpoint — resolve the node's items server-side, in node order.
  const byId = new Map<string, Resolved>();
  for (const v of unit.vocab) byId.set(v.id, { kind: "vocab", item: v });
  for (const g of unit.grammar) byId.set(g.id, { kind: "grammar", item: g });
  const items = nodeItemIds(def, unit.vocab, unit.grammar)
    .map((id) => byId.get(id))
    .filter((x): x is Resolved => x !== undefined);
  if (items.length === 0) redirect(`/learn/${slug}`);

  return <PathPracticeNode unitSlug={slug} nodeId={nodeId} isCheckpoint={def.kind === "checkpoint"} items={items} />;
}
