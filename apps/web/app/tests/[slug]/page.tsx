import { notFound, redirect } from "next/navigation";
import type { AudioRef, GrammarItem, ListeningItem, VocabItem } from "@domigo/content-schema";
import { listTestUnits, loadListening, loadTest } from "@domigo/content-loader";
import { isSlugAllowed } from "@/lib/grade-scope";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { ohneSprechtextFuersKind } from "@/lib/hoeren";
import TestSession, { type ResolvedSection } from "./TestSession";

export const dynamic = "force-dynamic";

export default async function TestPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ jahrgang?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  if (!listTestUnits().includes(slug)) notFound();
  // A child cannot open another year's Chapter; the teacher previews without a child.
  if (!preview && !isSlugAllowed(slug, view.grades)) redirect("/tests");

  const file = loadTest(slug);
  if (!file) notFound();
  const unit = await loadUnitWithOverrides(slug);
  const listening = loadListening(slug);

  // listening item id → {item, its task's audio} (a listening test section needs the clip).
  const liMap = new Map<string, { item: ListeningItem; audio: AudioRef }>();
  if (listening) {
    for (const task of listening.tasks) for (const it of task.items) liMap.set(it.id, { item: it, audio: task.audio });
  }

  // Resolve reference sections to full items server-side; embed reading/writing as-is.
  const sections: ResolvedSection[] = file.test.sections.map((sec): ResolvedSection => {
    if (sec.kind === "vocab") {
      return {
        kind: "vocab",
        titleDe: sec.titleDe,
        items: sec.itemIds.map((id) => unit.vocab.find((v) => v.id === id)).filter((v): v is VocabItem => v !== undefined),
      };
    }
    if (sec.kind === "grammar") {
      return {
        kind: "grammar",
        titleDe: sec.titleDe,
        items: sec.itemIds.map((id) => unit.grammar.find((g) => g.id === id)).filter((g): g is GrammarItem => g !== undefined),
      };
    }
    if (sec.kind === "listening") {
      const r = sec.itemIds
        .map((id) => liMap.get(id))
        .filter((x): x is { item: ListeningItem; audio: AudioRef } => x !== undefined);
      return {
        kind: "listening",
        titleDe: sec.titleDe,
        // K12: derselbe Loesungstext-Fund wie auf der Uebungsseite — hier in
        // einer PRUEFUNG. Ohne Abschnitts-Tonspur bleibt der leere Platzhalter.
        audio: r[0] ? ohneSprechtextFuersKind(r[0].audio) : { script: null, voice: null, file: null },
        items: r.map((x) => x.item),
      };
    }
    if (sec.kind === "reading") {
      return { kind: "reading", titleDe: sec.titleDe, passage: sec.passage, passageGloss: sec.passageGloss, items: sec.items };
    }
    if (sec.kind === "writing") {
      return {
        kind: "writing",
        titleDe: sec.titleDe,
        promptId: sec.promptId,
        promptDe: sec.promptDe,
        taskEn: sec.taskEn,
        minWords: sec.minWords,
        maxWords: sec.maxWords,
      };
    }
    throw new Error("unknown test section kind");
  });

  return (
    <>
      {preview && <PreviewBanner grade={Number(slug.match(/^g(\d)/)?.[1]) || undefined} />}
      <TestSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} preview={preview} slug={slug} testId={file.test.id} sections={sections} />
    </>
  );
}
