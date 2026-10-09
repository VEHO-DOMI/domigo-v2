import { redirect } from "next/navigation";
import { listApprovedUnits, loadUnitStructures } from "@domigo/content-loader";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { grammarTopics } from "@/lib/modi/grammar";
import { selectedChapters } from "../../practice/options";
import { loadPracticeWords } from "../../practice/load-practice";
import TrainerShell from "../../home/TrainerShell";
import PlayerCard from "../../home/PlayerCard";
import { readTrainerProfile } from "../../home/trainer-data";
import GrammarSession from "./GrammarSession";
import "../modes.css";
import "./grammar.css";

export const dynamic = "force-dynamic";
export default async function GrammarPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string; chapters?: string; memory?: string }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const chapters = selectedChapters(query.chapters, listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`)));
  const { grammar } = await loadPracticeWords(view, grade, chapters);
  const topics = grammarTopics(grammar, chapters.flatMap(loadUnitStructures));
  const profile = await readTrainerProfile(view);
  return <TrainerShell grade={grade} preview={preview} screen="modi/grammar" wordmark={false}>
    <GrammarSession key={acting?.userId ?? `preview-${grade}`} ownerId={acting?.userId ?? null} preview={preview} grade={grade}
      items={grammar} topics={topics} initialMemory={grade === 1 && query.memory === "1"}
      playerCard={<PlayerCard profile={profile} grade={grade} preview={preview} mode="grammar" />} />
  </TrainerShell>;
}
