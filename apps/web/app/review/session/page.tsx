import { redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { resolveStudentView } from "@/lib/student-view";
import { isSlugAllowed } from "@/lib/grade-scope";
import PreviewBanner from "@/app/PreviewBanner";
import { getDb, getDueRefs } from "@domigo/db";
import { loadUnitWithOverrides, type UnitContent } from "@/lib/content-service";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import ReviewSession from "./ReviewSession";

export const dynamic = "force-dynamic";

export default async function ReviewSessionPage({ searchParams }: {
  searchParams: Promise<{ jahrgang?: string | string[]; chapter?: string | string[] }>;
}) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";

  // The teacher chooses corpus examples, never a child's Leitner queue. Query
  // parameters are ignored for a child, whose due-order remains unchanged.
  const chapters = preview ? listApprovedUnits().filter((slug) => isSlugAllowed(slug, view.grades)) : [];
  const requested = Array.isArray(query.chapter) ? query.chapter[0] : query.chapter;
  const previewSlug = preview ? chapters.find((slug) => slug === requested) ?? chapters[0] : undefined;
  const examples = previewSlug ? await loadUnitWithOverrides(previewSlug) : null;
  const refs = acting ? await getDueRefs(getDb(), acting.userId, acting.classId, { kind: "all" }, 20) : [];

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
  const items: Array<{ kind: "vocab" | "grammar"; item: VocabItem | GrammarItem }> = examples
    ? [...examples.vocab.map((item) => ({ kind: "vocab" as const, item })), ...examples.grammar.map((item) => ({ kind: "grammar" as const, item }))].slice(0, 20)
    : [];
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

  if (items.length === 0) redirect(preview && view.grades.length === 1 ? `/review?jahrgang=${view.grades[0]}` : "/review");

  return (
    <>
      {preview && <PreviewBanner grade={Number(previewSlug?.match(/^g(\d)/)?.[1]) || undefined} note={`Beispielaufgaben aus Chapter ${Number(previewSlug?.match(/-u(\d+)/)?.[1])}`} />}
      <ReviewSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} preview={preview} items={items} />
    </>
  );
}
