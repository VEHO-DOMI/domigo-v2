import LearningShell, { LearningText } from "@/lib/trainer/LearningShell";
import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveStudentView } from "@/lib/student-view";
import { loadDictionary } from "@/lib/woerterbuch";
import { viennaDateKey, selectDailyWord } from "@/lib/wort-des-tages";
import PreviewBanner from "@/app/PreviewBanner";
import Dictionary from "./Dictionary";
import WordOfTheDay from "./WordOfTheDay";

export const dynamic = "force-dynamic";

export default async function DictionaryPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string | string[] }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  // The shared resolver falls back to all years on a grade-lookup error.
  // A dictionary must never broaden a child's year, even during that outage.
  const grades = view.kind === "student" && view.grades.length !== 1 ? [] : view.grades;
  const preview = view.kind === "preview";
  const entries = await loadDictionary(grades);
  const dateKey = viennaDateKey();
  return (
    <LearningShell preview={preview} grade={grades.length === 1 ? grades[0] : null}>
      {preview && <PreviewBanner grade={grades.length === 1 ? grades[0] : undefined} />}
      <main data-grade={grades.length === 1 ? grades[0] : undefined} style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
        {!preview && <Link href="/home" style={{ color: "var(--ink)", fontWeight: 600 }}><LearningText de="← Startseite" en="← Home" /></Link>}
        <h1 style={{ fontSize: 30, margin: "18px 0 6px", fontFamily: "var(--font-display)", color: "var(--ink)" }}><LearningText de="Wörterbuch" en="Dictionary" /></h1>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}><LearningText de={grades.length === 1 ? `Wörter aus Jahrgang ${grades[0]}` : "Wörter nach Jahrgang und Chapter"} en={grades.length === 1 ? `Words from Grade ${grades[0]}` : "Words by grade and Chapter"} /></p>
        {preview && grades.map((grade) => {
          const entry = selectDailyWord(entries, grade, dateKey);
          return entry ? <WordOfTheDay key={grade} entry={entry} preview /> : null;
        })}
        {entries.length > 0 ? <Dictionary key={grades.join("-")} entries={entries} showGrade={grades.length !== 1} /> : <p style={{ marginTop: 24 }}><LearningText de="Für deinen Jahrgang sind noch keine Wörter verfügbar." en="No words are available for your grade yet." /></p>}
      </main>
    </LearningShell>
  );
}
