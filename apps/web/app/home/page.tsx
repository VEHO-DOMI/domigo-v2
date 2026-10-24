import { TrainerText } from "@/lib/trainer/preferences";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listOpenStories } from "@/lib/story-world";
import { getDailyChallengeCount, getDb } from "@domigo/db";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { wortDesTages, viennaDateKey } from "@/lib/wort-des-tages";
import { STORY_UI, DEFAULT_STORY_UI } from "@/lib/stories";
import { loadDailyChallenge } from "../practice/load-practice";
import TrainerShell from "./TrainerShell";
import PlayerCard from "./PlayerCard";
import { readTrainerProfile } from "./trainer-data";
import { ModeStart } from "./ModeSwitch";
import { showArenaCard } from "@/lib/arena/server";
import "./home.css";

export const dynamic = "force-dynamic";
export default async function HomePage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> } = { searchParams: Promise.resolve({}) }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) return <main lang="de">Dein Jahrgang konnte gerade nicht geladen werden. Bitte lade die Seite erneut.</main>;
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const text = (de: string, en: string) => <TrainerText grade={grade} de={de} en={en} />;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const day = viennaDateKey();
  const [profile, word, challenge, arena] = await Promise.all([
    readTrainerProfile(view), wortDesTages(grade, day), loadDailyChallenge(view, grade, day).catch(() => null),
    showArenaCard(view),
  ]);
  const done = acting && challenge ? await getDailyChallengeCount(getDb(), acting.classScope, acting.classId, acting.userId, grade, day, challenge.words.map((item) => item.id)).catch(() => null) : null;
  const story = (await listOpenStories()).find((entry) => entry.grade === grade);
  const storyUi = STORY_UI[grade] ?? DEFAULT_STORY_UI;
  return <TrainerShell grade={grade} preview={preview}>
    <main className="og-screen">
      <PlayerCard profile={profile} grade={grade} preview={preview} />
      <ModeStart grade={grade} preview={preview} />
      <Link className="og-nav-card" href={`/woerterbuch${suffix}`}><span className="og-nav-icon">📖</span><span><strong>{text("Wörterbuch", "Dictionary")}</strong><small>{text("Alle Wörter nachschlagen", "Browse your full vocabulary library")}</small></span><span className="og-arrow">→</span></Link>
      {story && <Link className="og-nav-card" href={`/play/${grade}${suffix}`}><span className="og-nav-icon">{storyUi.icon}</span><span><strong>Story Mode</strong><small>{story.titleEn}</small></span><span className="og-arrow">→</span></Link>}
      <Link className="og-nav-card" href={`/activity${suffix}`}><span className="og-nav-icon">🎯</span><span><strong>Activity Game</strong><small>{text("Zeichnen, zeigen, erklären — Klassenspiel", "Draw, show, explain — classroom game")}</small></span><span className="og-arrow">→</span></Link>
      {arena && <Link className="og-nav-card" href={`/arena${suffix}`}><span className="og-nav-icon">⚔️</span><span><strong>Battle Arena</strong><small>{text("Word Duel und Verlauf", "Word Duel & battle history")}</small></span><span className="og-arrow">→</span></Link>}
      <div className="og-action-row og-action-row--3"><Link href={`/fortschritt${suffix}`} className="og-action-card"><span>📊</span><strong>{text("Fortschritt", "Progress")}</strong></Link><Link href={`/bestenliste${suffix}`} className="og-action-card"><span>🏆</span><strong>{text("Bestenliste", "Leaderboard")}</strong></Link><Link href={`/profil${suffix}`} className="og-action-card"><span>👤</span><strong>{text("Profil", "Profile")}</strong></Link></div>
      <section className="og-today">
        {word && <div className="og-today-section"><div className="og-today-heading"><h2>📝 {text("Wort des Tages", "Word of the Day")}</h2><span>Chapter {word.chapter}</span></div><div className="og-word"><strong>{word.word}</strong><span>{word.german}</span></div><p className="og-definition">{word.example}</p></div>}
        <div className="og-today-section"><div className="og-today-heading"><h2>⚡ {text("Tägliche Challenge", "Daily Challenge")}</h2><span>{text(new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "short", timeZone: "Europe/Vienna" }).format(new Date(`${day}T12:00:00Z`)), new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Vienna" }).format(new Date(`${day}T12:00:00Z`)))}</span></div>
          <p>{text("10 Wörter · heute für alle gleich", "10 words · same for everyone today")}</p>
          {done !== null && <p className="og-daily-count">{text("Heute geschafft", "Done today")}: {done}/10 ({done * 10}%)</p>}
          {acting && done === null && <p>{text("Der Tagesstand konnte gerade nicht geladen werden.", "Today’s progress could not be loaded right now.")}</p>}
          {acting && challenge && challenge.blockedCount > 0 && <p>{text("Heute gesperrt", "Blocked today")}: {challenge.blockedCount}/10 · {text("Diese Wörter werden übersprungen.", "These words are skipped.")}</p>}
          {challenge?.words.length === 10 && challenge.availableWords.length > 0 ? <Link className="og-primary" href={`/practice?mode=daily${preview ? `&jahrgang=${grade}` : ""}`}>{text("Challenge starten", "Start Challenge")}</Link> : <p>{challenge?.blockedCount === 10 ? text("Alle Wörter der heutigen Challenge sind gesperrt.", "All words in today’s challenge are blocked.") : text("Die Challenge ist gerade nicht verfügbar.", "The challenge is currently unavailable.")}</p>}
        </div>
      </section>
    </main>
  </TrainerShell>;
}
