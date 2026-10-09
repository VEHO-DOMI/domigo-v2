import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { readArena } from "@/lib/arena/server";
import TrainerShell from "../home/TrainerShell";
import ArenaScreen from "./ArenaScreen";
import "./arena.css";
export const dynamic = "force-dynamic";
export default async function ArenaPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview", arena = await readArena(view);
  return <TrainerShell grade={grade} preview={preview} screen="arena"><ArenaScreen key={`${preview ? "preview" : view.player.userId}-${grade}`} arena={arena} grade={grade} preview={preview} /></TrainerShell>;
}
