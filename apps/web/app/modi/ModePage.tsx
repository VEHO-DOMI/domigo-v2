import type { StudentView } from "@/lib/student-view";
import { trainerGrade } from "@/lib/student-view";
import { redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { loadPracticeWords } from "../practice/load-practice";
import { selectedChapters, practiceDirection } from "../practice/options";
import { huntRounds } from "@/lib/modi/decks";
import type { TrainerMode } from "@/lib/modi/catalog";
import TrainerShell from "../home/TrainerShell";
import ModeSession from "./ModeSession";
import "./modes.css";

export async function renderModePage(view: StudentView | null, chaptersRaw: string | undefined, mode: TrainerMode, directionRaw?: string) {
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const chapters = selectedChapters(chaptersRaw, listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`)));
  const { vocab } = await loadPracticeWords(view, grade, chapters);
  const rounds = mode === "wordhunt" ? huntRounds(vocab) : [];
  return <TrainerShell grade={grade} preview={preview} screen={`modi/${mode}`} wordmark={false}>
    <ModeSession key={acting?.userId ?? `preview-${grade}`} ownerId={acting?.userId ?? null} preview={preview} grade={grade} mode={mode} words={vocab} rounds={rounds} direction={practiceDirection(directionRaw)} />
  </TrainerShell>;
}
