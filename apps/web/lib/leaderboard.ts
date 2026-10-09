import "server-only";
import { getDb } from "@domigo/db";
import { getLeaderboard, type Leaderboard } from "../../../packages/db/src/leaderboard-service.ts";
import type { StudentView } from "./student-view";
export { getClassLeaderboardSettings, setClassLeaderboardSettings } from "../../../packages/db/src/class-settings-service.ts";
export type { ClassLeaderboardSettings } from "../../../packages/db/src/class-settings-service.ts";
export type { Leaderboard, LeaderboardRow } from "../../../packages/db/src/leaderboard-service.ts";

/** The preview returns BEFORE even acquiring a database handle. */
export async function readLeaderboard(view: StudentView): Promise<Leaderboard> {
  if (view.kind === "preview") return {
    enabled: true, gradeOptIn: true, className: "Beispiel", week: "", weeklyXp: 0, totalXp: 0, target: 5000,
    rows: Array.from({ length: 5 }, (_, i) => ({ id: `example-${i + 1}`, name: `Beispiel ${i + 1}`, avatar: i + 1,
      className: "Beispiel", ownClass: true, me: i === 0, totalXp: 0, weeklyXp: 0, streak: 0, dailyCorrect: 0, dailyTotal: 0 })),
  };
  return getLeaderboard(getDb(), view.player.classScope, view.player.userId);
}
