import { TrainerText } from "@/lib/trainer/preferences";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";
import { getDb, getStudentChapterProgress } from "@domigo/db";
import { resolveStudentView, trainerGrade } from "@/lib/student-view";
import { LEVEL_XP, levelFor, vocabTitle, registerFor, formatXp, overallLevelFor } from "@/lib/levels";
import TrainerShell from "../home/TrainerShell";
import { readTrainerProfile } from "../home/trainer-data";

import { readLeaderboard } from "@/lib/leaderboard";
import WeeklyGoal from "../bestenliste/WeeklyGoal";
import "../bestenliste/leaderboard.css";

export const dynamic = "force-dynamic";
export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ jahrgang?: string }> }) {
  const view = await resolveStudentView((await searchParams).jahrgang);
  if (!view) redirect("/signin");
  const grade = trainerGrade(view);
  if (grade === null) redirect("/home");
  const text = (de: string, en: string) => <TrainerText grade={grade} de={de} en={en} />;
  const preview = view.kind === "preview";
  const acting = view.kind === "student" ? view.player : null;
  const suffix = preview ? `?jahrgang=${grade}` : "";
  const profile = await readTrainerProfile(view);
  const progress = acting ? await getStudentChapterProgress(getDb(), acting.classScope, acting.classId, acting.userId, grade).catch(() => null) : null;
  const chapters = listApprovedUnits().filter((slug) => slug.startsWith(`g${grade}-`)).map((slug) => ({ slug, unit: loadUnit(slug) }));
  const vocabRows = progress?.chapters.filter((row) => row.kind === "vocab") ?? [];
  const total = chapters.reduce((n, chapter) => n + chapter.unit.vocab.length, 0);
  const practiced = vocabRows.reduce((n, row) => n + row.practiced, 0);
  const correct = vocabRows.reduce((n, row) => n + row.correct, 0);
  const pct = total ? Math.min(100, Math.round(correct / total * 100)) : 0;
  const level = levelFor(profile.xp ?? 0);
  const board = await readLeaderboard(view);
  const combinedXp = profile.xp !== null && profile.grammarXp !== null ? profile.xp + profile.grammarXp : null;
  const overall = overallLevelFor(combinedXp ?? 0);
  return <TrainerShell grade={grade} preview={preview} screen="fortschritt">
    <main className="og-screen og-progress">
      <Link className="og-back" href={`/home${suffix}`}>← {text("Zurück", "Back")}</Link>
      <h1 className="og-sr-only">{text("Fortschritt", "Progress")}</h1>
      <div className="og-rings" role="img" aria-labelledby="progress-summary">
        <span id="progress-summary" className="og-sr-only">{progress ? text(`${correct} richtig, ${practiced} geübt`, `${correct} correct, ${practiced} practiced`) : "Vorschau ohne Lernstand"}</span>
        <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true">
          {([[68, "#22c55e", correct], [52, "#3b82f6", practiced], [36, "#ef4444", Math.max(0, practiced - correct)]] as const).map(([radius, colour, count]) => {
            const length = 2 * Math.PI * radius;
            const fraction = progress && total ? Math.min(1, count / total) : 0;
            return <g key={radius}><circle cx="80" cy="80" r={radius} stroke={colour} strokeOpacity="0.14" strokeWidth="12" fill="none" /><circle cx="80" cy="80" r={radius} stroke={colour} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - fraction)} transform="rotate(-90 80 80)" /></g>;
          })}
        </svg><div><strong>{progress ? `${pct}%` : "—"}</strong><span>{text("richtig", "correct")}</span></div>
      </div>
      <div className="og-progress-stats">
        {[[total, "Wörter insgesamt", "Total words"], [progress ? correct : "—", "Richtig", "Correct"], [progress ? practiced : "—", "Geübt", "Practiced"], [progress ? Math.max(0, practiced - correct) : "—", "Noch nicht richtig", "Not yet correct"], [progress ? Math.max(0, total - practiced) : "—", "Noch nicht geübt", "Not yet practiced"]].map(([value, de, en]) => <div key={en}><strong>{value}</strong><span>{text(String(de), String(en))}</span></div>)}
      </div>
      {preview ? <p lang="de">Vorschau ohne persönlichen Lernstand.</p> : !progress ? <p>{text("Dein Lernstand konnte gerade nicht geladen werden.", "Your progress could not be loaded right now.")}</p> : <p className="og-progress-note">{text("Richtig: mindestens einmal vollständig richtig beantwortet.", "Correct: answered fully correctly at least once.")} · 🔥 {text("Serie", "Streak")}: {profile.streak ?? "—"}</p>}
      <section className="og-card lb-overall"><h2>{text("Gesamt-Level", "Overall level")}</h2><p><span>{text("Wortschatz + Grammatik", "Vocabulary + Grammar")}</span><strong>{combinedXp === null ? "—" : formatXp(combinedXp)} XP</strong></p>{combinedXp !== null && <p><span>Level {overall.level}</span><span className={`og-rank zone-${overall.zone}`}>{overall.name}</span></p>}</section>
      {board.enabled && <WeeklyGoal weeklyXp={board.weeklyXp} totalXp={board.totalXp} target={board.target} grade={grade} />}
      <section className="og-card og-roadmap"><h2>{text("Level-Übersicht", "Level Roadmap")}</h2>{LEVEL_XP.map((threshold, i) => {
        const reached = profile.xp !== null && i + 1 <= level.level;
        const title = vocabTitle(i + 1, 0, registerFor(grade));
        return <div key={threshold} className={i + 1 === level.level ? "og-current-level" : ""}><span>{i + 1}</span><span>{reached ? "✓" : "🔒"}</span><div><strong>{reached ? title.name : "?? ??"}</strong>{reached && <small>{title.vibe}</small>}</div><span>{i + 1 === level.level ? text("DU", "YOU") : threshold ? `${formatXp(threshold)} XP` : "Start"}</span></div>;
      })}</section>
      <section className="og-card"><h2>Chapters</h2>{chapters.map(({ slug, unit }) => <div className="og-chapter-progress" key={slug}><h3>Chapter {Number(slug.slice(-2))}</h3>{(["vocab", "grammar"] as const).map((kind) => {
        const row = progress?.chapters.find((entry) => entry.unitSlug === slug && entry.kind === kind);
        const count = unit[kind].length;
        const answered = Math.min(count, row?.correct ?? 0);
        return <div key={kind}><div className="og-progress-label"><span>{kind === "vocab" ? text("Wortschatz", "Vocabulary") : text("Grammatik", "Grammar")}</span><span>{progress ? `${answered}/${count}` : "—"}</span></div><progress max={Math.max(1, count)} value={progress ? answered : 0} aria-label={`${slug} ${kind}`} /></div>;
      })}</div>)}</section>
      <section className="og-card"><h2>{text("XP-Verlauf", "XP history")}</h2>{progress && progress.days.length ? <ol className="og-xp-history">{progress.days.map((day) => <li key={day.day}><time dateTime={day.day}>{day.day}</time><strong>+{formatXp(day.xp)} XP</strong></li>)}</ol> : <p>{preview ? "Vorschau ohne persönlichen XP-Verlauf." : progress ? text("Noch keine Versuche gespeichert.", "No attempts saved yet.") : text("Der XP-Verlauf ist gerade nicht verfügbar.", "XP history is currently unavailable.")}</p>}</section>
    </main>
  </TrainerShell>;
}
