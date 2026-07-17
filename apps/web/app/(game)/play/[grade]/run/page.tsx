/**
 * KA-1 · /play/[grade]/run — the "Tintenlauf" arcade mock (the KA-1 gate
 * artifact). NOT a student surface: no hub link points here, and production
 * redirects to the hub — this route exists for the design gate. The quickfire
 * pool is server-resolved from the grade's first unit through the SAME
 * encounter recipe as the overworld (choice-friendly formats only — a chip
 * row can't field a free-typed answer mid-jump).
 */
import { redirect } from "next/navigation";
import { Encounter } from "@domigo/content-schema";
import { loadUnitWithOverrides } from "@/lib/content-service";
import { getDb, getDueRefs } from "@domigo/db";
import { resolveEncounterTasks } from "@domigo/game-core";
import { parseArcadeLevel, type ArcadeLevel } from "@domigo/game-2d/arcade";
import type { BossScript } from "@domigo/game-2d/boss";
import { getPlayerForPage, getTeacherForPage } from "@/lib/identity";
import { loadKeenBoss, loadKeenLevel, loadKeenTasks, type KeenGameTask } from "@/lib/keen-content";
import { resolveKeenArt } from "@/lib/keen-art";
import ArcadeClient from "./ArcadeClient";

/** Stable per-student sprite seed (the zone page's fnv1a32, same constants). */
function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export default async function ArcadeRunPage({ params, searchParams }: { params: Promise<{ grade: string }>; searchParams: Promise<{ level?: string; tier?: string }> }) {
  const { grade: gradeStr } = await params;
  const { level: levelId, tier } = await searchParams;
  const grade = Number(gradeStr);
  if (![1, 2, 3, 4].includes(grade)) redirect("/home");
  // gate: a mock never reaches students (release.json rules don't cover it,
  // so the environment does — same posture as the DEV story overrides)
  // Pre-release gate with a teacher door (see world/page.tsx).
  if (process.env.VERCEL_ENV === "production" && (await getTeacherForPage()) === null) redirect(`/play/${grade}`);

  const acting = await getPlayerForPage(); // student OR teacher (preview law)
  if (!acting) redirect("/signin");

  // v2.1 (bible 27): `level=g1-chNN` loads a content-authored chapter level +
  // its guardian; the unit follows the CHAPTER (task content = that unit).
  const keenMatch = /^g1-(ch\d{2})$/.exec(levelId ?? "");
  let keenLevel: ArcadeLevel | undefined;
  let keenBoss: BossScript | undefined;
  let keenArt: Record<string, string> | undefined;
  let storyTasks: import("@domigo/game-2d/arcade").StoryTaskPack | undefined;
  let chapterNo = 1;
  if (keenMatch && grade === 1) {
    const ch = keenMatch[1]!;
    chapterNo = Number(ch.slice(2));
    const lvl = await loadKeenLevel("g1.st.lost-pages", ch);
    keenLevel = parseArcadeLevel(lvl.header as ArcadeLevel["header"], lvl.rows);
    keenBoss = (await loadKeenBoss("g1.st.lost-pages", ch)) as BossScript;
    const ka = resolveKeenArt(1);
    keenArt = { ...(ka.chapters[ch] ?? {}), ...ka.hero };
    // batch-T painted backdrops feed the scene's bg_far/bg_mid slots (theme-named stems)
    const far = ka.chapters[ch]?.[`bgp_schoolhouse_far`];
    const mid = ka.chapters[ch]?.[`bgp_schoolhouse_mid`];
    if (far !== undefined) keenArt["bg_far"] = far;
    if (mid !== undefined) keenArt["bg_mid"] = mid;
    // THE STORY-TASK LAW (doc 29 §4): the story mode plays its hand-authored
    // set — mapped into the game's native shapes; the unit pools stay for the
    // practice surfaces only.
    const gt = loadKeenTasks("g1.st.lost-pages", ch);
    if (gt) {
      const toQf = (x: KeenGameTask) => ({ itemId: x.id, kind: "vocab" as const, pool: null, ask: x.storyDe, prompt: x.promptEn, chips: x.options ?? [], answer: x.answer, hints: x.hints });
      const toR = (x: KeenGameTask, typed: boolean) => ({ itemId: x.id, kind: "vocab" as const, presentation: typed ? ("typed" as const) : ("chips" as const), ask: x.storyDe, prompt: x.promptEn, pool: null, chips: x.options ?? null, answer: x.answer, hints: x.hints });
      const withExtras = (r: ReturnType<typeof toR>, x: KeenGameTask) => ({ ...r, art: x.art, colour: x.colour });
      storyTasks = {
        quickfire: gt.filter((x) => x.use === "quickfire").map(toQf),
        rescue: gt.filter((x) => x.use === "rescue").map((x) => toR(x, false)),
        boss: gt.filter((x) => x.use === "boss").map((x) => toR(x, true)),
        seal: gt.filter((x) => x.use === "seal").map((x) => toR(x, true)),
        // v4 modality pools (doc 30 §3)
        battle: gt.filter((x) => x.use === "battle").map((x) => withExtras(toR(x, true), x)),
        swarm: gt.filter((x) => x.use === "swarm").map((x) => ({ ...toQf(x), art: x.art })),
        colorroom: gt.filter((x) => x.use === "colorroom").map((x) => withExtras(toR(x, true), x)),
        duel: gt.filter((x) => x.use === "duel").map((x) => withExtras(toR(x, false), x)),
        finale: gt.filter((x) => x.use === "finale").map((x) => toR(x, false)),
      };
    }
  }

  const slug = `g${grade}-u${String(chapterNo).padStart(2, "0")}`;
  const unit = await loadUnitWithOverrides(slug);
  const due = await getDueRefs(getDb(), acting.userId, acting.classId, { kind: "unit", slug }, 24).catch(() => []);
  const enc = Encounter.parse({
    schema: "encounter@1",
    id: `g${grade}.enc.tintenlauf`,
    grade,
    source: { kind: "due", scope: { kind: "unit", slug }, count: 10 },
    formatAllow: ["multiple-choice", "context-picker"],
    fallback: "scope-random",
  });
  const items = resolveEncounterTasks(enc, { due, pool: { vocab: unit.vocab, grammar: unit.grammar } });

  return (
    <ArcadeClient
      seed={grade * 1000 + 7}
      playerSeed={fnv1a32(acting.userId)}
      mode={`game:g${grade}`}
      items={items}
      storyTasks={storyTasks}
      hubHref={keenLevel ? `/play/${grade}/world` : `/play/${grade}`}
      title={keenLevel ? keenLevel.header.name : "Tintenlauf"}
      levelId={keenLevel ? undefined : levelId}
      level={keenLevel}
      boss={keenBoss}
      art={keenArt}
      doneHref={keenLevel ? `/play/${grade}/world?done=${keenMatch![1]}` : undefined}
      tier={tier === "E" || tier === "M" || tier === "S" ? tier : undefined}
    />
  );
}
