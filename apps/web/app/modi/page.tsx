import { redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { listOpenStories } from "@/lib/story-world";
import { getDb, getDueCounts } from "@domigo/db";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import TrainerShell from "../home/TrainerShell";
import ModePicker from "./ModePicker";

export const dynamic = "force-dynamic";
export default async function ModesPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string; bereich?: string }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const acting = view.kind === "student" ? view.player : null;
  const preview = view.kind === "preview";
  const counts = acting ? await getDueCounts(getDb(), acting.userId, acting.classId).catch(() => null) : null;
  const chapters = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`));
  const story = (await listOpenStories()).find((entry) => entry.grade === grade);
  return <TrainerShell grade={grade} preview={preview} screen="modi" wordmark={false}>
    <ModePicker grade={grade} preview={preview} chapters={chapters} due={counts?.total ?? null} story={story ? { title: story.titleEn, href: `/play/${grade}` } : null} areas={query.bereich === "1"} />
  </TrainerShell>;
}
