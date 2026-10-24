import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { readDuel } from "@/lib/arena/server";
import { arenaCopy, arenaMessage } from "@/lib/arena/copy";
import TrainerShell from "../../../home/TrainerShell";
import DuelScreen from "../../DuelScreen";
import "../../arena.css";
export const dynamic = "force-dynamic";
export default async function DuelPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview", id = (await params).id;
  let data;
  try { data = await readDuel(view, id); }
  catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "arena_unavailable";
    return <TrainerShell grade={grade} preview={preview} screen="arena"><main className="og-screen arena-screen"><Link className="og-back" href={`/arena${preview ? `?jahrgang=${grade}` : ""}`}>← {arenaCopy(grade).back}</Link><p className="arena-notice" role="status">{arenaMessage(code, grade)}</p></main></TrainerShell>;
  }
  const ownerId = view.kind === "student" ? view.player.userId : null;
  return <TrainerShell grade={grade} preview={preview} screen="arena"><DuelScreen key={`${ownerId ?? "preview"}-${grade}-${id}-${data.duel.next?.round}-${data.duel.next?.question}-${data.duel.rounds.length}-${data.duel.status}`} data={data} grade={grade} preview={preview} ownerId={ownerId} /></TrainerShell>;
}
