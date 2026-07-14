import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb, getDueRefs } from "@domigo/db";
import { loadUnitWithOverrides, type UnitContent } from "@/lib/content-service";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import ReviewSession from "./ReviewSession";

export const dynamic = "force-dynamic";

export default async function ReviewSessionPage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");

  // Refs are soonest-due first across all of the student's units (a student only has their grade's items).
  const refs = await getDueRefs(getDb(), session.user.id, { kind: "all" }, 20);

  // Load each unique unit ONCE, WITH the Studio prose overlay applied. Cache a
  // miss so a stale/un-approved slug is attempted only once and never 500s.
  const unitCache = new Map<string, UnitContent | null>();
  for (const ref of refs) {
    if (!unitCache.has(ref.unitSlug)) {
      try {
        unitCache.set(ref.unitSlug, await loadUnitWithOverrides(ref.unitSlug));
      } catch {
        unitCache.set(ref.unitSlug, null);
      }
    }
  }

  // Walk refs in due-order; match each to its item by id; skip any that's missing (e.g. dropped by an overlay).
  const items: Array<{ kind: "vocab" | "grammar"; item: VocabItem | GrammarItem }> = [];
  for (const ref of refs) {
    const unit = unitCache.get(ref.unitSlug);
    if (!unit) continue;
    const found =
      ref.kind === "vocab"
        ? unit.vocab.find((v) => v.id === ref.itemId)
        : unit.grammar.find((g) => g.id === ref.itemId);
    if (!found) continue;
    items.push({ kind: ref.kind, item: found });
  }

  if (items.length === 0) redirect("/review");

  return <ReviewSession items={items} />;
}
