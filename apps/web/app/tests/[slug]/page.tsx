import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AudioRef, GrammarItem, ListeningItem, VocabItem } from "@domigo/content-schema";
import { listTestUnits, loadListening, loadTest } from "@domigo/content-loader";
import { isSlugAllowed, resolveVisibleGrades } from "@/lib/grade-scope";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { ohneSprechtextFuersKind } from "@/lib/hoeren";
import TestSession, { type ResolvedSection } from "./TestSession";

export const dynamic = "force-dynamic";

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listTestUnits().includes(slug)) notFound(); // unknown unit stays a 404, not a redirect

  // P1 (P-R1.5): the deep-link half of the grade scope — a foreign year's unit
  // sends the child back to its own list. (Teachers already went to /admin above.)
  if (!isSlugAllowed(slug, await resolveVisibleGrades(session.user.classId))) redirect("/tests");

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

  return <TestSession slug={slug} testId={file.test.id} sections={sections} />;
}
