import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { loadActivity } from "@/lib/activity/server";
import ActivityScreen from "./ActivityScreen";
import TrainerShell from "../home/TrainerShell";
import "./activity.css";
export const dynamic = "force-dynamic";
export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview", data = await loadActivity(view);
  return <TrainerShell grade={grade} preview={preview} screen="activity" wordmark={false}>
    <ActivityScreen key={`${view.kind === "student" ? view.player.userId : "preview"}-${grade}`} grade={grade} preview={preview} {...data} />
  </TrainerShell>;
}
