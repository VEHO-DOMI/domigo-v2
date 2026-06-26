import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listListeningUnits, loadListening } from "@domigo/content-loader";
import ListeningSession from "./ListeningSession";

export const dynamic = "force-dynamic";

export default async function ListeningUnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "teacher") redirect("/admin");
  if (!listListeningUnits().includes(slug)) notFound();

  const file = loadListening(slug);
  if (!file) notFound();
  // Strip the hidden transcript before handing tasks to the client (it's the answer key).
  const tasks = file.tasks.map((t) => ({ id: t.id, key: t.key, titleDe: t.titleDe, audio: t.audio, items: t.items }));
  return <ListeningSession slug={slug} tasks={tasks} />;
}
