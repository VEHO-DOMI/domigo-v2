import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AudioRef, GrammarItem, ListeningItem, VocabItem } from "@domigo/content-schema";
import { listTestUnits, loadListening, loadTest } from "@domigo/content-loader";
import { loadUnitWithOverrides } from "@/lib/content-service";
import TestSession, { type ResolvedSection } from "./TestSession";

export const dynamic = "force-dynamic";

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listTestUnits().includes(slug)) notFound();

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
        audio: r[0]?.audio ?? { script: "", voice: null, file: null },
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

  return <TestSession slug={slug} testId={file.test.id} sections={sections} />;
}
