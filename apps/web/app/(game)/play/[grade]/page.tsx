/**
 * /play/[grade] — the G1 overworld RPG slice (Track C). Server component:
 * resolves identity, loads the released story chapter + its taskSlot items, and
 * resolves the wandering encounters (getDueRefs → game-core, falling back to
 * in-scope items so a fresh student is never in a dead zone). Phaser itself is
 * client-only (GameClient mounts it via next/dynamic ssr:false).
 */
import { redirect } from "next/navigation";
import { Encounter, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import { loadReleasedChapters, loadStory, loadStoryCast, loadUnit } from "@domigo/content-loader";
import { getDb, getDueRefs } from "@domigo/db";
import { resolveEncounterTasks, type ResolvedItem } from "@domigo/game-core";
import { getActingUserForPage } from "@/lib/identity";
import GameClient from "./GameClient";

export const dynamic = "force-dynamic";

const STORY_BY_GRADE: Record<number, string> = { 1: "g1.st.lost-pages" };

function notReady(message: string) {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22 }}>The game world is still waking up…</h1>
      <p style={{ color: "#475569" }}>{message}</p>
      <a href="/home" style={{ color: "#2563eb" }}>← Home</a>
    </main>
  );
}

export default async function PlayPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeStr } = await params;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const storyId = STORY_BY_GRADE[grade];
  if (!storyId) return notReady(`Grade ${grade} doesn't have a game world yet.`);

  const story = loadStory(storyId);
  const released = loadReleasedChapters(storyId);
  const chapter = story?.chapters.find((c) => released.includes(c.id));
  if (!story || !chapter) return notReady("No released chapter for this grade yet.");

  const slug = `g${grade}-u${String(chapter.unit).padStart(2, "0")}`;
  const unit = loadUnit(slug);

  // wandering encounters: due items first, topped up from in-scope (Law 6).
  const due = await getDueRefs(getDb(), acting.userId, { kind: "unit", slug }, 8).catch(() => []);
  const enc = Encounter.parse({
    schema: "encounter@1",
    id: `g${grade}.enc.${storyId.split(".").pop()}-z01`,
    grade,
    source: { kind: "due", scope: { kind: "unit", slug }, count: 4 },
    formatAllow: null,
    fallback: "scope-random",
  });
  const encounters = resolveEncounterTasks(enc, { due, pool: { vocab: unit.vocab, grammar: unit.grammar } });

  // resolve the chapter's taskSlot item ids → items for the dialogue overlay.
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
  const seed = grade * 100 + chapter.unit;

  return (
    <GameClient
      seed={seed}
      encounters={encounters}
      chapter={chapter}
      castNames={castNames}
      storyItems={storyItems}
    />
  );
}
