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
import { loadUnit } from "@domigo/content-loader";
import { getDb, getDueRefs } from "@domigo/db";
import { resolveEncounterTasks } from "@domigo/game-core";
import { getActingUserForPage } from "@/lib/identity";
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
  if (process.env.VERCEL_ENV === "production") redirect(`/play/${grade}`);

  const acting = await getActingUserForPage();
  if (!acting) redirect("/signin");

  const slug = `g${grade}-u01`;
  const unit = loadUnit(slug);
  const due = await getDueRefs(getDb(), acting.userId, { kind: "unit", slug }, 24).catch(() => []);
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
      hubHref={`/play/${grade}`}
      title="Tintenlauf"
      levelId={levelId}
      tier={tier === "E" || tier === "M" || tier === "S" ? tier : undefined}
    />
  );
}
