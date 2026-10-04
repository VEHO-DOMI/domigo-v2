import { notFound, redirect } from "next/navigation";
import { assignPool, listApprovedUnits } from "@domigo/content-loader";
import { getDb, listReservedForClass } from "@domigo/db";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { isSlugAllowed } from "@/lib/grade-scope";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";
import PracticeSession from "./PracticeSession";

export const dynamic = "force-dynamic";

export default async function UnitPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!listApprovedUnits().includes(slug)) notFound(); // unknown unit stays a 404, not a redirect
  // P1 (P-R1.5): the deep-link half of the grade scope — a child that reached a
  // FOREIGN year's unit by URL goes back to its own list. cgo-047: a teacher
  // previews any unit (lib/student-view.ts); no viewer at all sees none.
  const view = await resolveStudentView();
  const acting = view?.kind === "student" ? view.player : null;
  const preview = view?.kind === "preview";
  if (!preview && !isSlugAllowed(slug, view?.grades ?? [])) redirect("/practice");

  const unit = await loadUnitWithOverrides(slug);

  // J-1 (F2): free practice EXCLUDES the class's reserved items (the `mock` pool),
  // so a teacher's held-out assessment items never surface in self-study — the
  // same reserve integrity Smart Review + game encounters enforce. The teacher
  // preview has no class, so it shows the reserved items too — the banner says so.
  const reserved = acting ? await listReservedForClass(getDb(), acting.classScope, acting.classId).catch(() => new Set<string>()) : new Set<string>();
  const vocab = unit.vocab.filter((v) => assignPool(v.id, reserved) !== "mock");
  const grammar = unit.grammar.filter((g) => assignPool(g.id, reserved) !== "mock");

  // Vienna-day (YYYY-MM-DD) computed server-side so the deterministic vocab-pool
  // rotation is identical across SSR + hydration (no client Date, no mismatch).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(new Date());
  return (
    <>
      {preview && <PreviewBanner grade={Number(slug.match(/^g(\d)/)?.[1]) || undefined} note="auch für Prüfungen zurückgehaltene Aufgaben sind sichtbar" />}
      <PracticeSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} slug={slug} vocab={vocab} grammar={grammar} today={today} preview={preview} />
    </>
  );
}
