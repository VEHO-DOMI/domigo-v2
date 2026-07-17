/**
 * VS · /play/[grade]/world — the book's world map (the Keen hub, bible 27
 * §2–§3). Dev-only like /run: NOT a student surface yet — no hub link points
 * here and production redirects to the hub (release.json rules don't cover
 * the slice, so the environment does). Server resolves identity, the Keen
 * world bundle, the ch01 chapter + its taskSlot items (the beats' inline
 * tasks are REAL graded attempts), and the `game:g1:keen` save slot.
 */
import { redirect } from "next/navigation";
import type { Chapter, ComprehensionItem, GrammarItem, VocabItem } from "@domigo/content-schema";
import { loadStory, loadStoryCast, loadStoryComprehension } from "@domigo/content-loader";
import { getDb, getGameSave } from "@domigo/db";
import { storyItemKey, type ResolvedItem } from "@domigo/game-core";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { getActingUserForPage, getTeacherForPage } from "@/lib/identity";
import { loadKeenWorld } from "@/lib/keen-content";
import { resolveKeenArt } from "@/lib/keen-art";
import { worldCopyFor } from "@/lib/world-copy";
import WorldClient from "./WorldClient";

/** Stable per-student sprite seed (run/page.tsx's fnv1a32, same constants). */
function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The [zone]/page.tsx taskSlot resolution, replicated verbatim: itemId (+
 *  variantKey re-framing) → the resolved vocab/grammar/comprehension item. */
function storyItemsFor(
  chapter: Chapter,
  unit: { vocab: VocabItem[]; grammar: GrammarItem[] },
  comprehension: ComprehensionItem[] = [],
): Record<string, ResolvedItem> {
  const out: Record<string, ResolvedItem> = {};
  for (const sc of chapter.scenes) {
    for (const ts of sc.taskSlots) {
      const ci = comprehension.find((x) => x.id === ts.itemId);
      if (ci) { out[storyItemKey(ts.itemId, ts.variantKey)] = { kind: "grammar", item: ci as unknown as GrammarItem }; continue; }
      const v = unit.vocab.find((x) => x.id === ts.itemId);
      if (v) {
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

export default async function WorldMapPage({ params, searchParams }: { params: Promise<{ grade: string }>; searchParams: Promise<{ done?: string }> }) {
  const { grade: gradeStr } = await params;
  const { done } = await searchParams;
  if (gradeStr !== "1") redirect("/play/1/world"); // the slice is G1-only
  // Pre-release gate: students never see the Keen build on prod, but the
  // TEACHER plays it live anywhere (Koki 2026-07-17 — no dev server needed).
  if (process.env.VERCEL_ENV === "production" && (await getTeacherForPage()) === null) redirect("/play/1");

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const storyId = "g1.st.lost-pages";
  const world = loadKeenWorld(storyId);
  const story = loadStory(storyId);
  const chapter = story?.chapters.find((c) => c.id.endsWith("ch01"));
  if (!chapter) redirect("/play/1");

  const unit = await loadUnitWithOverrides("g1-u01");
  // the prologue (ch00, doc 28 §3) shares g1-u01 — its items merge in
  const prologue = story?.chapters.find((c) => c.id.endsWith("ch00")) ?? null;
  const comp = loadStoryComprehension(storyId)?.items ?? [];
  const storyItems = {
    ...storyItemsFor(chapter, unit, comp),
    ...(prologue ? storyItemsFor(prologue, unit, comp) : {}),
  };
  const cast = loadStoryCast(storyId);
  const castNames = Object.fromEntries((cast?.members ?? []).map((m) => [m.id, m.nameEn]));
  const keenArt = resolveKeenArt(1);
  const saved = await getGameSave(getDb(), acting.userId, "game:g1:keen").catch(() => null);

  // keen-content's shape gate strips buildings.cell (its zod object doesn't
  // carry the field) — re-derive each building's door cell from its layout
  // glyph (the legend entry whose `enter` names the chapter). Loud on a
  // mismatch: a building without a door is an authoring error, never a
  // half-world (the keen-content posture).
  const cellByChapter = new Map<string, { c: number; r: number }>();
  world.layout.rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c += 1) {
      const glyph = row[c] ?? "";
      const entry = world.layout.legend[glyph];
      if (entry !== undefined && "enter" in entry) cellByChapter.set(entry.enter, { c, r });
    }
  });
  const buildings = Object.fromEntries(
    Object.entries(world.buildings).map(([key, b]) => {
      const cell = cellByChapter.get(b.chapter);
      if (!cell) throw new Error(`world.json: no layout entrance glyph for ${b.chapter}`);
      return [key, { chapter: b.chapter, cell, label: b.label, ground: b.ground }];
    }),
  );
  // Normalize the legend union to the map contract's optional-field shape
  // (keen-content also allows `{door}` entries — no map meaning; they render
  // as plain floor, exactly like an unknown glyph).
  const legend = Object.fromEntries(
    Object.entries(world.layout.legend).map(([glyph, entry]) => [
      glyph,
      "enter" in entry
        ? { enter: entry.enter, label: entry.label }
        : "prop" in entry
          ? { prop: entry.prop, solid: entry.solid, ...(entry.clearedBy !== undefined ? { clearedBy: entry.clearedBy } : {}) }
          : {},
    ]),
  );

  return (
    <WorldClient
      seed={1007}
      playerSeed={fnv1a32(acting.userId)}
      mode="game:g1"
      copy={worldCopyFor(storyId, "z01")}
      world={{
        rows: world.layout.rows,
        legend,
        buildings,
        notes: world.notes.map((n) => ({ c: n.c, r: n.r, text: n.text })),
      }}
      beats={world.beats}
      chapter={chapter}
      prologue={prologue}
      castNames={castNames}
      storyItems={storyItems}
      castArt={keenArt.cast}
      beatArt={keenArt.beats}
      mapArt={keenArt.map}
      serverSave={saved ? { clientRev: saved.clientRev, state: saved.state as unknown } : null}
      done={typeof done === "string" ? done : undefined}
    />
  );
}
