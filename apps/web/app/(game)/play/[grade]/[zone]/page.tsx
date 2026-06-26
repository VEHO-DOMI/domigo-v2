/**
 * /play/[grade]/[zone] — one G1 overworld zone (a map@1 zone → its released
 * story chapter). Server resolves identity, the zone's chapter + taskSlot items,
 * the wandering encounters (getDueRefs → game-core), and the cosmetic save. A
 * locked/unknown zone bounces back to the hub.
 */
import { redirect } from "next/navigation";
import { Encounter, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import { loadGameMap, loadReleasedChapters, loadStory, loadStoryCast, loadUnit } from "@domigo/content-loader";
import { getDb, getDueRefs, getGameSave } from "@domigo/db";
import { resolveEncounterTasks, type ResolvedItem } from "@domigo/game-core";
import type { GameSaveState } from "@domigo/game-2d";
import { getActingUserForPage } from "@/lib/identity";
import GameClient from "../GameClient";

export const dynamic = "force-dynamic";

const STORY_BY_GRADE: Record<number, string> = { 1: "g1.st.lost-pages" };

export default async function ZonePage({ params }: { params: Promise<{ grade: string; zone: string }> }) {
  const { grade: gradeStr, zone } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const storyId = STORY_BY_GRADE[grade];
  const hubHref = `/play/${grade}`;
  if (!storyId) redirect("/home");

  const map = loadGameMap(storyId);
  const story = loadStory(storyId);
  const released = loadReleasedChapters(storyId);
  const mapZone = map?.zones.find((z) => z.id.endsWith(`.${zone}`));
  const chapter = mapZone && story ? story.chapters.find((c) => c.unit === mapZone.unit && released.includes(c.id)) : undefined;
  if (!mapZone || !chapter) redirect(hubHref); // unknown or locked → hub

  const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
  const unit = loadUnit(slug);

  const due = await getDueRefs(getDb(), acting.userId, { kind: "unit", slug }, 8).catch(() => []);
  const enc = Encounter.parse({
    schema: "encounter@1",
    id: `g${grade}.enc.${storyId.split(".").pop()}-${zone}`,
    grade,
    source: { kind: "due", scope: { kind: "unit", slug }, count: 4 },
    formatAllow: null,
    fallback: "scope-random",
  });
  const encounters = resolveEncounterTasks(enc, { due, pool: { vocab: unit.vocab, grammar: unit.grammar } });

  const storyItems: Record<string, ResolvedItem> = {};
  for (const sc of chapter.scenes) {
    for (const ts of sc.taskSlots) {
      const v = unit.vocab.find((x: VocabItem) => x.id === ts.itemId);
      if (v) { storyItems[ts.itemId] = { kind: "vocab", item: v }; continue; }
      const g = unit.grammar.find((x: GrammarItem) => x.id === ts.itemId);
      if (g) storyItems[ts.itemId] = { kind: "grammar", item: g };
    }
  }

  const cast = loadStoryCast(storyId);
  const castNames = Object.fromEntries((cast?.members ?? []).map((m) => [m.id, m.nameEn]));
  const seed = mapZone.render?.seed ?? grade * 100 + chapter.unit;

  const gameMode = `game:g${grade}`;
  const saved = await getGameSave(getDb(), acting.userId, gameMode).catch(() => null);
  const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as GameSaveState } : null;

  return (
    <GameClient
      seed={seed}
      gameMode={gameMode}
      zoneId={mapZone.id}
      zoneTitle={mapZone.titleEn}
      hubHref={hubHref}
      encounters={encounters}
      chapter={chapter}
      castNames={castNames}
      storyItems={storyItems}
      serverSave={serverSave}
    />
  );
}
