import { formatXp } from "@/lib/levels";
import { classLevelFor } from "@/lib/leaderboard-model";
export default function WeeklyGoal({ weeklyXp, totalXp, target, grade }: { weeklyXp: number; totalXp: number; target: number; grade: number }) {
  const level = classLevelFor(totalXp);
  return <section className="og-card lb-goal">
    <h2>{grade === 1 ? "🏆 Wochenziel" : "🏆 Weekly goal"}</h2>
    <p className="lb-goal-total"><strong>{formatXp(weeklyXp)}</strong> / {formatXp(target)} XP</p>
    <progress value={Math.min(weeklyXp, target)} max={target} aria-label={grade === 1 ? "Wochenziel der Klasse" : "Class weekly goal"} />
    <p>{grade === 1 ? "Gemeinsam seit Montag" : "Together since Monday"}</p>
    <div className="lb-class-level"><span>Level {level.level} · <strong>{level.name}</strong></span><span>{formatXp(totalXp)} XP</span></div>
  </section>;
}
