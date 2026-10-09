/** cgo-111 · Confirmed learning only. One SQL snapshot carries consent AND roster.
 * The caller supplies the authenticated user, never a requested class id.
 * Own scope anchors the viewer; the sole extension is the explicit double opt-in.
 */
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { Db } from "./index.ts";
import { classSettings, practiceAttempts, studentProfile, userProgress, v2Classes, v2IdentityUsers } from "./schema.ts";
import type { ClassScope } from "./scope.ts";
import { isStreakActive, viennaDayString } from "./streak.ts";

export interface LeaderboardRow {
  id: string; name: string; avatar: number; className: string; ownClass: boolean; me: boolean;
  totalXp: number; weeklyXp: number; streak: number; dailyCorrect: number; dailyTotal: number;
}
export interface Leaderboard {
  enabled: boolean; gradeOptIn: boolean; className: string; week: string;
  rows: LeaderboardRow[]; weeklyXp: number; totalXp: number; target: number;
}
export const WEEKLY_GOAL = 5000;

/** Calendar arithmetic, not elapsed hours: correct across both Vienna DST switches. */
export function viennaMonday(at: Date): string {
  const calendar = new Date(`${viennaDayString(at)}T12:00:00Z`);
  calendar.setUTCDate(calendar.getUTCDate() - (calendar.getUTCDay() + 6) % 7);
  return calendar.toISOString().slice(0, 10);
}

/** Koki 04.10.: given name (nickname), omit a duplicate or absent given name.
 * No account directory lookup: only the already authorized roster's local mirror.
 */
export function leaderboardName(givenName: string | null, nickname: string): string {
  const given = givenName?.trim();
  return given && given !== nickname.trim() ? `${given} (${nickname})` : given || nickname;
}

export function sortLeaderboard(rows: readonly LeaderboardRow[], order: "week" | "total"): LeaderboardRow[] {
  const key = order === "week" ? "weeklyXp" : "totalXp";
  return [...rows].sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name, "de") || a.id.localeCompare(b.id));
}

export async function getLeaderboard(db: Db, classScope: ClassScope, userId: string, at = new Date()): Promise<Leaderboard> {
  const week = viennaMonday(at);
  const off: Leaderboard = { enabled: false, gradeOptIn: false, className: "", week, rows: [], weeklyXp: 0, totalXp: 0, target: WEEKLY_GOAL };
  if (!userId || classScope.length === 0) return off;
  // Missing migration 0023 or unavailable settings => all off, no identity logs.
  try {
    const viewer = alias(v2IdentityUsers, "board_viewer");
    const own = alias(v2Classes, "board_own");
    const ownSettings = alias(classSettings, "board_own_settings");
    // Correlated sums use BOTH roster id and current class. Assignment/checkup
    // writers already award zero; excluding their modes also protects old imports.
    const weekly = sql<number>`coalesce((select sum(${practiceAttempts.xpAwarded}) from ${practiceAttempts}
      where ${practiceAttempts.userId} = ${v2IdentityUsers.id} and ${practiceAttempts.classId} = ${v2Classes.id}
      and ${practiceAttempts.createdAt} >= (${week}::date::timestamp at time zone 'Europe/Vienna')
      and ${practiceAttempts.createdAt} <= ${at.toISOString()}::timestamptz
      and ${practiceAttempts.mode} not in ('assignment', 'checkup')
      and ${practiceAttempts.mode} not like 'assign:%'), 0)`;
    const daily = (correct: boolean) => sql<number>`(select count(*) from ${practiceAttempts}
      where ${practiceAttempts.userId} = ${v2IdentityUsers.id} and ${practiceAttempts.classId} = ${own.id}
      and ${practiceAttempts.mode} = 'daily'
      and ${practiceAttempts.createdAt} >= (${viennaDayString(at)}::date::timestamp at time zone 'Europe/Vienna')
      and ${practiceAttempts.createdAt} <= ${at.toISOString()}::timestamptz
      ${correct ? sql`and ${practiceAttempts.correct} = true` : sql``})`;
    const result = await db.select({
      ownId: own.id, ownName: own.name, optIn: ownSettings.gradeBoardOptIn,
      id: v2IdentityUsers.id, givenName: v2IdentityUsers.givenName, nickname: v2IdentityUsers.displayName,
      classId: v2Classes.id, className: v2Classes.name, avatar: studentProfile.avatar,
      xp: userProgress.xp, grammarXp: userProgress.grammarXp, streak: userProgress.streak, lastDate: userProgress.lastSessionDate,
      weeklyXp: weekly, dailyCorrect: daily(true), dailyTotal: daily(false),
    }).from(viewer)
      .innerJoin(own, eq(own.id, viewer.classId))
      .innerJoin(ownSettings, eq(ownSettings.classId, own.id))
      .innerJoin(v2Classes, and(eq(v2Classes.grade, own.grade), isNull(v2Classes.archivedAt)))
      .innerJoin(classSettings, and(eq(classSettings.classId, v2Classes.id), eq(classSettings.purpose, "regular"), eq(classSettings.leaderboard, true),
        or(eq(v2Classes.id, own.id), and(eq(ownSettings.gradeBoardOptIn, true), eq(classSettings.gradeBoardOptIn, true)))))
      .leftJoin(v2IdentityUsers, and(eq(v2IdentityUsers.classId, v2Classes.id), eq(v2IdentityUsers.role, "student")))
      .leftJoin(userProgress, eq(userProgress.userId, v2IdentityUsers.id))
      .leftJoin(studentProfile, eq(studentProfile.userId, v2IdentityUsers.id))
      .where(and(inArray(viewer.classId, [...classScope]), eq(viewer.id, userId), eq(viewer.role, "student"),
        isNull(own.archivedAt), eq(ownSettings.purpose, "regular"), eq(ownSettings.leaderboard, true)));
    const first = result[0];
    if (!first) return off;
    const rows: LeaderboardRow[] = result.flatMap((r) => r.id === null ? [] : [{
      id: r.id, name: leaderboardName(r.givenName, r.nickname ?? ""),
      avatar: r.avatar && r.avatar >= 1 && r.avatar <= 50 ? r.avatar : 1,
      className: r.className ?? "", ownClass: r.classId === r.ownId, me: r.id === userId,
      totalXp: Number(r.xp ?? 0) + Number(r.grammarXp ?? 0), weeklyXp: Number(r.weeklyXp),
      streak: isStreakActive(r.lastDate, at) ? Number(r.streak ?? 0) : 0,
      dailyCorrect: r.classId === r.ownId ? Number(r.dailyCorrect) : 0,
      dailyTotal: r.classId === r.ownId ? Number(r.dailyTotal) : 0,
    }]);
    const ownRows = rows.filter((r) => r.ownClass);
    return { ...off, enabled: true, gradeOptIn: first.optIn, className: first.ownName, rows: sortLeaderboard(rows, "week"),
      weeklyXp: ownRows.reduce((sum, r) => sum + r.weeklyXp, 0), totalXp: ownRows.reduce((sum, r) => sum + r.totalXp, 0) };
  } catch { return off; }
}
