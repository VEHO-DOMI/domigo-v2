import "server-only";
import { listApprovedUnits } from "@domigo/content-loader";
import { getDb, listReservedForClass } from "@domigo/db";
import type { RecordAttemptInput } from "@domigo/db";
import { auth } from "@/auth";
import { loadUnitWithOverrides } from "@/lib/content-service";
import type { ActingUser } from "@/lib/identity";
import type { StudentView } from "@/lib/student-view";
import { trainerGrade } from "@/lib/student-view";
import { arenaEnabled, createDuel, duelContext, DuelError, emptyArena, getDuel, listDuels, openRound, recordAnswer, runDuelTransaction, selectDuelQuestions, validateDuelAnswer,
  type ArenaData, type DuelContext, type DuelView } from "../../../../packages/db/src/duel-service.ts";
export type { ArenaData, DuelView, DuelSummary } from "../../../../packages/db/src/duel-service.ts";

export function arenaError(error: unknown): Response {
  console.warn("[arena] write_failed");
  const known = error instanceof DuelError;
  return Response.json({ ok: false, error: known ? error.code : "arena_unavailable" }, { status: known ? error.status : 503, headers: { "Cache-Control": "no-store" } });
}
/** Preview has no database handle, content answers, child reads or write route. */
export function exampleDuel(grade: number): DuelView {
  const label = grade === 1 ? "Beispiel" : "Example";
  return { id: "example", opponent: `${label} 2`, me: `${label} 1`, avatar: 2, myAvatar: 1, mode: "vocab", status: "active", myTurn: true,
    myScore: 0, theirScore: 0, result: null, date: "", xp: 0, rounds: [{ chapter: 1, mine: [], theirs: [] }], grade, canOpen: false, next: null };
}
export async function readArena(view: StudentView): Promise<ArenaData> {
  if (view.kind === "preview") {
    const grade = trainerGrade(view) ?? 1, label = grade === 1 ? "Beispiel" : "Example";
    return { ...emptyArena(), enabled: true, peers: Array.from({ length: 3 }, (_, i) => ({ number: i + 1, name: `${label} ${i + 2}`, avatar: i + 2 })), active: [exampleDuel(grade)], waiting: 1 };
  }
  try { return await listDuels(getDb(), view.player.classScope, view.player.userId); }
  catch { console.warn("[arena] read_failed"); return emptyArena(true); }
}

export async function arenaPool(grade: number) {
  const slugs = listApprovedUnits().filter(slug => slug.startsWith(`g${grade}-`));
  return (await Promise.all(slugs.map(loadUnitWithOverrides))).flatMap(unit => unit.vocab);
}
export async function showArenaCard(view: StudentView): Promise<boolean> {
  if (view.kind === "preview") return true;
  try { return await arenaEnabled(getDb(), view.player.classScope, view.player.userId); }
  catch { console.warn("[arena] read_failed"); return false; }
}
async function promptFor(itemId: string): Promise<string> {
  const ref = itemId.match(/^g([1-4])u(\d{2})\.w\./);
  if (!ref) throw new DuelError(409, "duel_question_closed");
  const unit = await loadUnitWithOverrides(`g${ref[1]}-u${ref[2]}`);
  const prompt = unit.vocab.find(item => item.id === itemId)?.g;
  if (!prompt) throw new DuelError(409, "duel_question_closed");
  return prompt;
}
export interface DuelScreenData { duel: DuelView; chapters: { key: string; chapter: number }[] }
export async function readDuel(view: StudentView, id: string): Promise<DuelScreenData> {
  if (view.kind === "preview") return { duel: exampleDuel(trainerGrade(view) ?? 1), chapters: [] };
  try {
  const player = view.player;
  const duel = await getDuel(getDb(), player.classScope, player.userId, id, promptFor);
  const chapters: DuelScreenData["chapters"] = [];
  if (duel.canOpen) {
    const pool = await arenaPool(duel.grade);
    const reserved = await listReservedForClass(getDb(), player.classScope, player.classId);
    for (const key of listApprovedUnits().filter(slug => slug.startsWith(`g${duel.grade}-`))) {
      const chapter = Number(key.slice(-2));
      if (duel.rounds.some(round => round.chapter === chapter)) continue;
      try { selectDuelQuestions(pool, duel.grade, key, `${id}:${duel.rounds.length}`, reserved); chapters.push({ key, chapter }); }
      catch (error) { if (!(error instanceof DuelError && error.code === "duel_chapter_empty")) throw error; }
    }
  }
  return { duel, chapters };
  } catch (error) { console.warn("[arena] read_failed"); throw error; }
}
export async function startDuel(player: ActingUser, number: number, version: string) {
  return runDuelTransaction(tx => createDuel(tx, player.classScope, player.userId, number, version));
}
export async function startRound(player: ActingUser, id: string, unitKey: string) {
  const detail = await getDuel(getDb(), player.classScope, player.userId, id, promptFor);
  const pool = await arenaPool(detail.grade);
  return runDuelTransaction(tx => openRound(tx, player.classScope, player.userId, id, unitKey, pool));
}
export async function checkDuelAttempt(req: Request, player: ActingUser, mode: string, context: unknown, choice: string): Promise<{ coordinates: DuelContext; itemId: string }> {
  const session = await auth();
  if (session?.user?.role !== "student" || req.headers.get("origin") !== new URL(req.url).origin) throw new DuelError(403, "duel_forbidden");
  const coordinates = duelContext(mode, context);
  const { itemId } = await validateDuelAnswer(getDb(), player.classScope, player.userId, coordinates, choice);
  return { coordinates, itemId };
}
export async function writeDuelAnswer(player: ActingUser, attempt: RecordAttemptInput, coordinates: DuelContext, choice: string) {
  return runDuelTransaction(tx => recordAnswer(tx, player.classScope, attempt, coordinates, choice));
}
