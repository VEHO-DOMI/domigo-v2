"use client";
import { useTrainerLanguage } from "@/lib/trainer/preferences";
import { formatXp } from "@/lib/levels";
import { classLevelFor } from "@/lib/leaderboard-model";
export default function WeeklyGoal({ weeklyXp, totalXp, target, grade }: { weeklyXp: number; totalXp: number; target: number; grade: number }) {
  const de = useTrainerLanguage(grade) === "de";
  const level = classLevelFor(totalXp);
  return <section className="og-card lb-goal">
    <h2>{de ? "🏆 Wochenziel" : "🏆 Weekly goal"}</h2>
    <p className="lb-goal-total"><strong>{formatXp(weeklyXp)}</strong> / {formatXp(target)} XP</p>
    <progress value={Math.min(weeklyXp, target)} max={target} aria-label={de ? "Wochenziel der Klasse" : "Class weekly goal"} />
    <p>{de ? "Gemeinsam seit Montag" : "Together since Monday"}</p>
    <div className="lb-class-level"><span>Level {level.level} · <strong>{level.name}</strong></span><span>{formatXp(totalXp)} XP</span></div>
  </section>;
}
