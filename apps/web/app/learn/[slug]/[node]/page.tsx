import { notFound, redirect } from "next/navigation";
import { itemsInPool, listApprovedUnits, loadJourney, loadUnitStructures, loadWordbank } from "@domigo/content-loader";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { getActingUserForPage } from "@/lib/identity";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { bestTierPerItem, buildUnitNodes, deriveJourneyProgress, getDb, getDueRefs, getJourneyAttempts, getUnitPathProgress, journeyModeFor, listReservedForClass, nodeItemIds, withProgress } from "@domigo/db";
import TeachingNode from "./TeachingNode";
import PathPracticeNode from "./PathPracticeNode";

export const dynamic = "force-dynamic";

type Resolved = { kind: "vocab" | "grammar"; item: VocabItem | GrammarItem };

export default async function NodeRunnerPage({ params }: { params: Promise<{ slug: string; node: string }> }) {
  const { slug, node: nodeId } = await params;
  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");
  if (!listApprovedUnits().includes(slug)) notFound();

  // J-1: an authored journey runs its own node; else fall through to the legacy
  // Study Path below (F10). Progress is DERIVED from the attempt ledger (no table).
  const journey = loadJourney(slug);
  if (journey) {
    const jnode = journey.nodes.find((n) => n.id === nodeId);
    if (!jnode) notFound();
    // game nodes deep-link into the campaign — they never run inside /learn.
    if (jnode.kind === "game") redirect(jnode.gamePointer ? `/play/${journey.grade}/${jnode.gamePointer.zoneOrChapter}` : `/learn/${slug}`);

    const classId = acting.classId;
    const junit = await loadUnitWithOverrides(slug);
    const itemIds = [...junit.vocab.map((v) => v.id), ...junit.grammar.map((g) => g.id)];
    const reserved = await listReservedForClass(getDb(), classId).catch(() => new Set<string>());
    const nodeItems = new Map<string, readonly string[]>();
    for (const n of journey.nodes) {
      if ((n.kind === "practice" || n.kind === "side-quest") && n.itemPool) {
        nodeItems.set(n.id, itemsInPool(itemIds, n.itemPool, reserved, journey.poolOverrides));
      }
    }
    const jattempts = await getJourneyAttempts(getDb(), acting.userId, slug).catch(() => []);
    const jview = deriveJourneyProgress(journey.nodes, nodeItems, bestTierPerItem(jattempts)).find((v) => v.id === nodeId);
    if (jview?.status === "locked") redirect(`/learn/${slug}`); // server unlock gate

    // lesson → the unit's new words (teaching card).
    if (jnode.kind === "lesson") {
      return <TeachingNode unitSlug={slug} nodeId={nodeId} kind="vocab-intro" wordbank={loadWordbank(slug)} />;
    }

    // practice / side-quest → the node's pool slice; review → the live due set (mock excluded).
    let ids: string[];
    if (jnode.kind === "review") {
      const due = await getDueRefs(getDb(), acting.userId, classId, { kind: "unit", slug }, 20).catch(() => []);
      ids = due.map((r) => r.itemId);
    } else {
      ids = [...(nodeItems.get(nodeId) ?? [])];
    }
    const jbyId = new Map<string, Resolved>();
    for (const v of junit.vocab) jbyId.set(v.id, { kind: "vocab", item: v });
    for (const g of junit.grammar) jbyId.set(g.id, { kind: "grammar", item: g });
    const jitems = ids.map((id) => jbyId.get(id)).filter((x): x is Resolved => x !== undefined);
    if (jitems.length === 0) redirect(`/learn/${slug}`);

    // attempts write mode='journey:<unit>:<node>' → the derivation reads them back.
    return <PathPracticeNode unitSlug={slug} nodeId={nodeId} isCheckpoint={false} items={jitems} attemptMode={journeyModeFor(slug, nodeId)} />;
  }

  const unit = await loadUnitWithOverrides(slug);
  const nodes = buildUnitNodes(unit.vocab, unit.grammar);
  const def = nodes.find((n) => n.id === nodeId);
  if (!def) notFound();

  // Server-side unlock gate: a directly-typed locked-node URL bounces to the map.
  let completed = new Map<string, { stars: number }>();
  try {
    completed = await getUnitPathProgress(getDb(), acting.userId, slug);
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
