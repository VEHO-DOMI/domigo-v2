import { redirect } from "next/navigation";
import { listApprovedUnits } from "@domigo/content-loader";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { viennaDateKey } from "@/lib/wort-des-tages";
import PreviewBanner from "@/app/PreviewBanner";
import PracticeSession from "./[slug]/PracticeSession";
import { loadDailyChallenge, loadPracticeWords } from "./load-practice";
import { practiceMode, practiceDirection, selectedChapters, sprintWords } from "./options";

export const dynamic = "force-dynamic";
export default async function PracticeIndex({ searchParams }: { searchParams: Promise<{ jahrgang?: string; mode?: string; direction?: string; chapters?: string }> }) {
  const query = await searchParams;
  const view = await resolveStudentView(query.jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  if (!query.mode) redirect(`/modi${preview ? `?jahrgang=${grade}` : ""}`);
  const mode = practiceMode(query.mode);
  const chapters = selectedChapters(query.chapters, listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`)));
  const today = viennaDateKey();
  const challenge = mode === "daily" ? await loadDailyChallenge(view, grade, today) : null;
  const loaded = challenge
    ? { vocab: challenge.availableWords, grammar: [] }
    : await loadPracticeWords(view, grade, chapters);
  const vocab = mode === "sprint" ? sprintWords(loaded.vocab) : loaded.vocab;
  return <>
    {preview && <PreviewBanner grade={grade} />}
    {challenge && challenge.blockedCount > 0 && <p lang="de">Heute gesperrt: {challenge.blockedCount}/10 · Diese Wörter werden übersprungen.</p>}
    <PracticeSession key={acting?.userId ?? "preview"} ownerId={acting?.userId ?? null} slug={`g${grade}-u01`} vocab={vocab} grammar={loaded.grammar} today={today} runMode={mode} direction={practiceDirection(query.direction)} preview={preview} />
  </>;
}
