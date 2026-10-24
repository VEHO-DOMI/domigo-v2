import LearningShell from "@/lib/trainer/LearningShell";
import { notFound, redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { loadPracticeWords } from "../load-practice";
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

  // The same fail-closed reserve filter as the mode pages and answer route.
  // A reserve outage must not reveal held-out assessment items on a deep link.
  const { vocab, grammar } = await loadPracticeWords(view!, Number(slug[1]), [slug]);

  // Vienna-day (YYYY-MM-DD) computed server-side so the deterministic vocab-pool
  // rotation is identical across SSR + hydration (no client Date, no mismatch).
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna" }).format(new Date());
  return (
    <LearningShell preview={preview} grade={Number(slug[1])}>
      {preview && <PreviewBanner grade={Number(slug.match(/^g(\d)/)?.[1]) || undefined} note="auch für Prüfungen zurückgehaltene Aufgaben sind sichtbar" />}
      <PracticeSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} slug={slug} vocab={vocab} grammar={grammar} today={today} preview={preview} />
    </LearningShell>
  );
}
