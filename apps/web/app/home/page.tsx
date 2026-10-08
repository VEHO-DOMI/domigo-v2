import Link from "next/link";
import { redirect } from "next/navigation";
import { listReleasedStories } from "@domigo/content-loader";
import { getDailyChallengeCount, getDb } from "@domigo/db";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { wortDesTages, viennaDateKey } from "@/lib/wort-des-tages";
import { STORY_UI, DEFAULT_STORY_UI } from "@/lib/stories";
import { loadDailyChallenge } from "../practice/load-practice";
import TrainerShell from "./TrainerShell";
import PlayerCard from "./PlayerCard";
import { readTrainerProfile } from "./trainer-data";

export const dynamic = "force-dynamic";
export default async function HomePage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) return <main lang="de">Dein Jahrgang konnte gerade nicht geladen werden. Bitte lade die Seite erneut.</main>;
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const day = viennaDateKey();
  const [profile, word, challenge] = await Promise.all([
    readTrainerProfile(view), wortDesTages(grade, day), loadDailyChallenge(view, grade, day).catch(() => null),
  ]);
  const done = acting && challenge ? await getDailyChallengeCount(getDb(), acting.classScope, acting.classId, acting.userId, grade, day, challenge.words.map((item) => item.id)).catch(() => null) : null;
  const story = listReleasedStories().find((entry) => entry.grade === grade);
  const storyUi = STORY_UI[grade] ?? DEFAULT_STORY_UI;
  return <TrainerShell grade={grade} preview={preview}>
    <main className="og-screen">
      <PlayerCard profile={profile} grade={grade} preview={preview} />
      <Link href={`/modi${suffix}`} className="og-primary og-start"><span>🎯 Start Practice</span><span className="og-start-sub">{grade === 1 ? "Chapter und Übungsformat auswählen" : "Choose Chapters and exercise type"}</span></Link>
      <Link className="og-nav-card" href={`/woerterbuch${suffix}`}><span className="og-nav-icon">📖</span><span><strong>Dictionary &amp; Flashcards</strong><small>{grade === 1 ? "Wörter im Wörterbuch nachschlagen" : "Browse your full vocabulary library"}</small></span><span className="og-arrow">→</span></Link>
      {story && <Link className="og-nav-card" href={`/play/${grade}${suffix}`}><span className="og-nav-icon">{storyUi.icon}</span><span><strong>Story Mode</strong><small>{story.titleEn}</small></span><span className="og-arrow">→</span></Link>}
      <div className="og-action-row"><Link href={`/fortschritt${suffix}`} className="og-action-card"><span>📊</span><strong>Fortschritt</strong></Link><Link href={`/profil${suffix}`} className="og-action-card"><span>👤</span><strong>Profil</strong></Link></div>
      <section className="og-today">
        {word && <div className="og-today-section"><div className="og-today-heading"><h2>📝 Word of the Day</h2><span>Chapter {word.chapter}</span></div><div className="og-word"><strong>{word.word}</strong><span>{word.german}</span></div><p className="og-definition">{word.example}</p></div>}
        <div className="og-today-section"><div className="og-today-heading"><h2>⚡ Daily Challenge</h2><span>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Vienna" }).format(new Date())}</span></div>
          <p>{grade === 1 ? "10 Wörter · heute für alle gleich" : "10 words · same for everyone today"}</p>
          {done !== null && <p className="og-daily-count">Done today: {done}/10 ({done * 10}%)</p>}
          {acting && done === null && <p lang="de">Der Tagesstand konnte gerade nicht geladen werden.</p>}
          {challenge?.words.length === 10 ? <Link className="og-primary" href={`/practice?mode=daily${preview ? `&jahrgang=${grade}` : ""}`}>{grade === 1 ? "Challenge starten" : "Start Challenge"}</Link> : <p lang="de">Die Challenge ist gerade nicht verfügbar.</p>}
        </div>
      </section>
    </main>
  </TrainerShell>;
}
