import "server-only";
import { getDb } from "@domigo/db";
import { getLeaderboard, unavailableLeaderboard, type Leaderboard } from "../../../packages/db/src/leaderboard-service.ts";
import type { StudentView } from "./student-view";
export { getClassLeaderboardSettings, setClassLeaderboardSettings } from "@domigo/db";
export type { ClassLeaderboardSettings } from "@domigo/db";
export type { Leaderboard, LeaderboardRow } from "../../../packages/db/src/leaderboard-service.ts";

/** The preview returns BEFORE even acquiring a database handle. */
export async function readLeaderboard(view: StudentView): Promise<Leaderboard> {
  const example = view.grades[0] === 1 ? "Beispiel" : "Example";
  if (view.kind === "preview") return {
    enabled: true, unavailable: false, gradeOptIn: true, className: example, week: "", weeklyXp: 0, totalXp: 0, target: 5000,
    rows: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `${example} ${i + 1}`, avatar: i + 1,
      className: example, ownClass: true, me: i === 0, vocabXp: 0, totalXp: 0, weeklyXp: 0, streak: 0, dailyCorrect: 0, dailyTotal: 0 })),
  };
  try { return await getLeaderboard(getDb(), view.player.classScope, view.player.userId); }
  catch { return unavailableLeaderboard(); }
}
