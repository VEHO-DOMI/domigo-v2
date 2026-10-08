import "server-only";
import { auth } from "@/auth";
import { getDb, getStudentAvatar, getUserProgress, isStreakActive } from "@domigo/db";
import type { StudentView } from "@/lib/student-view";

export interface TrainerProfile { name: string; avatar: number; xp: number | null; grammarXp: number | null; streak: number | null }

export async function readTrainerProfile(view: StudentView): Promise<TrainerProfile> {
  if (view.kind === "preview") return { name: "Test · Beispiel", avatar: 1, xp: 0, grammarXp: 0, streak: 0 };
  const acting = view.player;
  const session = await auth();
  const name = session?.user.id === acting.userId ? session.user.name ?? "" : "Test";
  const [avatar, progress] = await Promise.all([
    getStudentAvatar(getDb(), acting.classScope, acting.classId, acting.userId).catch(() => null),
    getUserProgress(getDb(), acting.userId).then((p) => p ?? { xp: 0, grammarXp: 0, streak: 0, lastSessionDate: null }).catch(() => null),
  ]);
  return { name, avatar: avatar ?? 1, xp: progress?.xp ?? null, grammarXp: progress?.grammarXp ?? null,
    streak: progress ? progress.streak > 0 && isStreakActive(progress.lastSessionDate) ? progress.streak : 0 : null };
}
