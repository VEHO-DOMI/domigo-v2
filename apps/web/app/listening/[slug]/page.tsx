import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listListeningUnits, loadListening } from "@domigo/content-loader";
import { isSlugAllowed, resolveVisibleGrades } from "@/lib/grade-scope";
import ListeningSession from "./ListeningSession";

export const dynamic = "force-dynamic";

export default async function ListeningUnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listListeningUnits().includes(slug)) notFound(); // unknown unit stays a 404, not a redirect

  // P1 (P-R1.5): the deep-link half of the grade scope — a foreign year's unit
  // sends the child back to its own list. (Teachers already went to /admin above.)
  if (!isSlugAllowed(slug, await resolveVisibleGrades(session.user.classId))) redirect("/listening");

  const file = loadListening(slug);
  if (!file) notFound();
  // Strip the hidden transcript before handing tasks to the client (it's the answer key).
  const tasks = file.tasks.map((t) => ({ id: t.id, key: t.key, titleDe: t.titleDe, audio: t.audio, items: t.items }));
  return <ListeningSession slug={slug} tasks={tasks} />;
}
