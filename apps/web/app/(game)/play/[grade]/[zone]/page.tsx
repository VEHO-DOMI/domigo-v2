/**
 * /play/[grade]/[stop] — one playable "stop" of a grade's story, dispatched by
 * game type: g1 = a map@1 overworld zone (Phaser); g2 = a story chapter rendered
 * as a DOM+SVG detective case. Server resolves identity, the chapter + its
 * taskSlot items, and the cosmetic save; a locked/unknown stop bounces to the hub.
 */
import { redirect } from "next/navigation";
import { Encounter, type Chapter, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import { loadGameMap, loadReleasedChapters, loadStory, loadStoryCast, loadUnit } from "@domigo/content-loader";
import { getDb, getDueRefs, getGameSave } from "@domigo/db";
import { resolveEncounterTasks, type ResolvedItem } from "@domigo/game-core";
import { getActingUserForPage } from "@/lib/identity";
import GameClient from "../GameClient";
import DetectiveClient from "../DetectiveClient";

export const dynamic = "force-dynamic";

const STORY_BY_GRADE: Record<number, string> = { 1: "g1.st.lost-pages", 2: "g2.st.wrong-name" };
const GAME_TYPE: Record<number, "overworld" | "detective"> = { 1: "overworld", 2: "detective" };

function storyItemsFor(chapter: Chapter, unit: { vocab: VocabItem[]; grammar: GrammarItem[] }): Record<string, ResolvedItem> {
  const out: Record<string, ResolvedItem> = {};
  for (const sc of chapter.scenes) {
    for (const ts of sc.taskSlots) {
      const v = unit.vocab.find((x) => x.id === ts.itemId);
      if (v) { out[ts.itemId] = { kind: "vocab", item: v }; continue; }
      const g = unit.grammar.find((x) => x.id === ts.itemId);
      if (g) out[ts.itemId] = { kind: "grammar", item: g };
    }
  }
  return out;
}

export default async function ZonePage({ params }: { params: Promise<{ grade: string; zone: string }> }) {
  const { grade: gradeStr, zone } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const storyId = STORY_BY_GRADE[grade];
  const hubHref = `/play/${grade}`;
  if (!storyId) redirect("/home");

  const story = loadStory(storyId);
  const released = loadReleasedChapters(storyId);
  const gameType = GAME_TYPE[grade] ?? "overworld";
  const gameMode = `game:g${grade}`;

  const saved = await getGameSave(getDb(), acting.userId, gameMode).catch(() => null);
  const cast = loadStoryCast(storyId);
  const castNames = Object.fromEntries((cast?.members ?? []).map((m) => [m.id, m.nameEn]));

  // ── G2+ detective: the stop is a story chapter (no overworld map) ──
  if (gameType === "detective") {
    const chapter = story?.chapters.find((c) => c.id.endsWith(`.${zone}`) && released.includes(c.id));
    if (!chapter) redirect(hubHref);
    const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
    const storyItems = storyItemsFor(chapter, loadUnit(slug));
    const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as import("@domigo/game-detective").DetectiveSave } : null;
    return (
      <DetectiveClient
        gameMode={gameMode}
        caseTitle={story?.title.en ?? "The case"}
        chapter={chapter}
        castNames={castNames}
        storyItems={storyItems}
        serverSave={serverSave}
      />
    );
  }

  // ── G1 overworld: the stop is a map@1 zone → its released chapter ──
  const map = loadGameMap(storyId);
  const mapZone = map?.zones.find((z) => z.id.endsWith(`.${zone}`));
  const chapter = mapZone && story ? story.chapters.find((c) => c.unit === mapZone.unit && released.includes(c.id)) : undefined;
  if (!mapZone || !chapter) redirect(hubHref);

  const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
  const unit = loadUnit(slug);
  const storyItems = storyItemsFor(chapter, unit);

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
  const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as import("@domigo/game-2d").GameSaveState } : null;

  return (
    <GameClient
      seed={mapZone.render?.seed ?? grade * 100 + chapter.unit}
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
