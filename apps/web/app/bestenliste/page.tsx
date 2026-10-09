import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { readLeaderboard } from "@/lib/leaderboard";
import TrainerShell from "../home/TrainerShell";
import LeaderboardScreen from "./LeaderboardScreen";
import "./leaderboard.css";

export const dynamic = "force-dynamic";
export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview";
  const board = await readLeaderboard(view);
  return <TrainerShell grade={grade} preview={preview} screen="bestenliste">
    <LeaderboardScreen key={`${preview ? "preview" : "student"}-${grade}`} board={board} grade={grade} preview={preview} />
  </TrainerShell>;
}
