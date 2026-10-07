import { notFound, redirect } from "next/navigation";
import { listListeningUnits, loadListening } from "@domigo/content-loader";
import { isSlugAllowed } from "@/lib/grade-scope";
import { resolveStudentView } from "@/lib/student-view";
import PreviewBanner from "@/app/PreviewBanner";
import { ohneSprechtextFuersKind } from "@/lib/hoeren";
import ListeningSession from "./ListeningSession";

export const dynamic = "force-dynamic";

export default async function ListeningUnitPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ jahrgang?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  if (!listListeningUnits().includes(slug)) notFound();
  // A child cannot open another year's Chapter; the teacher previews without a child.
  if (!preview && !isSlugAllowed(slug, view.grades)) redirect("/listening");

  const file = loadListening(slug);
  if (!file) notFound();
  // Strip the hidden transcript before handing tasks to the client (it's the answer key).
  //
  // K12 · DAS REICHTE NICHT. Bis hierher wurde `transcript` entfernt und das
  // ganze `audio`-Objekt weitergereicht — in dem derselbe Text als `script`
  // steht (das Tor V-LC7 haelt beide wortgleich). Gemessen an dieser Seite:
  // drei Treffer der Wendung im ausgelieferten Text, angezeigt wurde sie nie.
  // `ohneSprechtextFuersKind` nimmt den Text heraus, sobald eine Aufnahme
  // existiert — ohne Aufnahme bleibt er drin, sonst waere die Aufgabe stumm.
  const tasks = file.tasks.map((t) => ({
    id: t.id,
    key: t.key,
    titleDe: t.titleDe,
    audio: ohneSprechtextFuersKind(t.audio),
    items: t.items,
  }));
  return (
    <>
      {preview && <PreviewBanner grade={Number(slug.match(/^g(\d)/)?.[1]) || undefined} />}
      <ListeningSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} preview={preview} slug={slug} tasks={tasks} />
    </>
  );
}
