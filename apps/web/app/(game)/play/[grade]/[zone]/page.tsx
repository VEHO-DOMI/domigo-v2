/**
 * /play/[grade]/[stop] — one playable "stop" of a grade's story, dispatched by
 * game type: g1 = a map@1 overworld zone (Phaser); g2 = a story chapter rendered
 * as a DOM+SVG detective case. Server resolves identity, the chapter + its
 * taskSlot items, and the cosmetic save; a locked/unknown stop bounces to the hub.
 */
import { redirect } from "next/navigation";
import { Encounter, type Chapter, type ComprehensionItem, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import { loadGameMap, loadReleasedChapters, loadStory, loadStoryCast, loadStoryComprehension, loadStoryFlags, loadUnit, storyIdForGrade } from "@domigo/content-loader";
import { getDb, getDueRefs, getGameSave, getSolvedGameItemIds } from "@domigo/db";
import { EVIDENCE, type EvidencePiece } from "@domigo/game-detective";
import { resolveEncounterTasks, storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { getActingUserForPage } from "@/lib/identity";
import { resolveTileArt } from "@/lib/tile-art";
import { resolveDetectiveArt, resolveNovelArt } from "@/lib/story-art";
import GameClient from "../GameClient";
import DetectiveClient from "../DetectiveClient";
import NovelClient from "../NovelClient";
import TripClient from "../TripClient";

export const dynamic = "force-dynamic";

const GAME_TYPE: Record<number, "overworld" | "detective" | "novel" | "trip"> = { 1: "overworld", 2: "detective", 3: "novel", 4: "trip" };

/** FNV-1a 32-bit — a stable numeric seed from a string (A1-4 avatar identity).
 *  Same family the games use for seeded shuffles; deterministic per user. */
function fnv1a32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function storyItemsFor(
  chapter: Chapter,
  unit: { vocab: VocabItem[]; grammar: GrammarItem[] },
  comprehension: ComprehensionItem[] = [],
): Record<string, ResolvedItem> {
  const out: Record<string, ResolvedItem> = {};
  for (const sc of chapter.scenes) {
    for (const ts of sc.taskSlots) {
      // Phase 3: a `.ci.` ref is a scene-comprehension item (story bundle) — cast to
      // GrammarItem so it renders/grades exactly like a grammar task (no structureId).
      const ci = comprehension.find((x) => x.id === ts.itemId);
      if (ci) { out[storyItemKey(ts.itemId, ts.variantKey)] = { kind: "grammar", item: ci as unknown as GrammarItem }; continue; }
      const v = unit.vocab.find((x) => x.id === ts.itemId);
      if (v) {
        // Scene-embedded carrier (Phase 2): a variantKey re-frames the carrier as
        // the in-fiction clue; answers/distractors are untouched so grading is identical.
        const variant = ts.variantKey ? v.presentation.variants.find((va) => va.key === ts.variantKey) : undefined;
        const item = variant ? { ...v, s: variant.prompt.text, gloss: variant.glosses } : v;
        out[storyItemKey(ts.itemId, ts.variantKey)] = { kind: "vocab", item };
        continue;
      }
      const g = unit.grammar.find((x) => x.id === ts.itemId);
      if (g) {
        const variant = ts.variantKey ? g.presentation.variants.find((va) => va.key === ts.variantKey) : undefined;
        const item = variant ? { ...g, prompt: { ...g.prompt, text: variant.prompt.text }, gloss: variant.glosses } : g;
        out[storyItemKey(ts.itemId, ts.variantKey)] = { kind: "grammar", item };
      }
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

  const storyId = storyIdForGrade(grade);
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
    const unit = loadUnit(slug);
    const storyItems = storyItemsFor(chapter, unit, loadStoryComprehension(storyId)?.items ?? []);
    // Phase 4: genuine spaced retrieval — resolve ONLY actually-due clues from this
    // unit (no scope-random filler), so the re-interview beat appears only when due.
    const dueRefs = await getDueRefs(getDb(), acting.userId, { kind: "unit", slug }, 3).catch(() => []);
    const reviewItems: ResolvedItem[] = dueRefs
      .map((ref): ResolvedItem | null => {
        const v = unit.vocab.find((x) => x.id === ref.itemId);
        if (v) return { kind: "vocab", item: v };
        const g = unit.grammar.find((x) => x.id === ref.itemId);
        return g ? { kind: "grammar", item: g } : null;
      })
      .filter((x): x is ResolvedItem => x !== null);
    const detectiveArt = resolveDetectiveArt(storyId, grade, chapter);
    // Phase 6 — "Solve the Case": on the LAST chapter, recap the collected Evidence
    // Pieces (same ledger derivation as the hub board) so the finale is evidence-driven.
    const isFinale = story !== null && story.chapters[story.chapters.length - 1]?.id === chapter.id;
    let finalePieces: EvidencePiece[] = [];
    if (isFinale && story) {
      const solved = await getSolvedGameItemIds(getDb(), acting.userId, grade).catch(() => new Set<string>());
      finalePieces = story.chapters.map((c, i): EvidencePiece => {
        const refs = c.scenes.flatMap((s) => s.taskSlots).map((ts) => ts.itemId);
        const unlocked = c.id === chapter.id || (refs.length > 0 && refs.every((ref) => solved.has(ref)));
        return { chapterId: c.id, caseNo: i + 1, label: EVIDENCE[c.id] ?? "a clue", img: undefined, unlocked };
      });
    }
    const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as import("@domigo/game-detective").DetectiveSave } : null;
    return (
      <DetectiveClient
        gameMode={gameMode}
        caseTitle={story?.title.en ?? "The case"}
        chapter={chapter}
        castNames={castNames}
        storyItems={storyItems}
        reviewItems={reviewItems}
        finalePieces={finalePieces}
        serverSave={serverSave}
        detectiveArt={detectiveArt}
      />
    );
  }

  // ── G3 "FOURTEEN": the stop is a story chapter rendered as a graphic-novel episode ──
  if (gameType === "novel") {
    const chapter = story?.chapters.find((c) => c.id.endsWith(`.${zone}`) && released.includes(c.id));
    if (!chapter) redirect(hubHref);
    const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
    const unit = loadUnit(slug);
    const storyItems = storyItemsFor(chapter, unit, loadStoryComprehension(storyId)?.items ?? []);
    const novelArt = resolveNovelArt(storyId, grade, chapter);
    const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as import("@domigo/game-novel").NovelSave } : null;
    return (
      <NovelClient
        gameMode={gameMode}
        episodeTitle={chapter.titleEn}
        chapter={chapter}
        castNames={castNames}
        storyItems={storyItems}
        reviewItems={[]}
        serverSave={serverSave}
        novelArt={novelArt}
      />
    );
  }

  // ── G4 "Lost for Words": the stop is a story chapter rendered as one day of
  //    the trip — the first FLAG-AWARE runtime (Choice.sets / FlagGate / flagLines
  //    resolve against the cosmetic save's story-scoped flags) ──
  if (gameType === "trip") {
    const chapter = story?.chapters.find((c) => c.id.endsWith(`.${zone}`) && released.includes(c.id));
    if (!chapter) redirect(hubHref);
    const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
    const unit = loadUnit(slug);
    const storyItems = storyItemsFor(chapter, unit, loadStoryComprehension(storyId)?.items ?? []);
    // resolveNovelArt is story-art@1-generic despite the name (same manifest shape).
    const tripArt = resolveNovelArt(storyId, grade, chapter);
    // B-0 flag-scope guard: pass THIS story's declared flags so a shared-slot save
    // from the other g4 campaign can't leak its flags into this story's gates.
    const storyFlags = loadStoryFlags(storyId)?.flags.map((f) => f.id) ?? [];
    const serverSave = saved ? { clientRev: saved.clientRev, state: saved.state as unknown as import("@domigo/game-trip").TripSave } : null;
    return (
      <TripClient
        gameMode={gameMode}
        dayTitle={chapter.titleEn}
        chapter={chapter}
        castNames={castNames}
        storyItems={storyItems}
        reviewItems={[]}
        serverSave={serverSave}
        tripArt={tripArt}
        storyFlags={storyFlags}
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
  const storyItems = storyItemsFor(chapter, unit, loadStoryComprehension(storyId)?.items ?? []);

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
      playerSeed={fnv1a32(acting.userId)}
      gameMode={gameMode}
      zoneId={mapZone.id}
      generator={mapZone.render?.generator ?? "school-room"}
      tileArt={resolveTileArt(grade, mapZone.render?.generator ?? "school-room")}
      zoneTitle={grade === 1 ? (mapZone.titleDe ?? mapZone.titleEn) : mapZone.titleEn}
      hubHref={hubHref}
      encounters={encounters}
      chapter={chapter}
      castNames={castNames}
      storyItems={storyItems}
      serverSave={serverSave}
    />
  );
}
