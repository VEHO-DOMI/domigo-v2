import Link from "next/link";
import { notFound } from "next/navigation";
import type { GrammarItem } from "@domigo/content-schema";
import { loadStoryComprehension, loadUnit } from "@domigo/content-loader";
import { getDb, loadStudentWorldState } from "@domigo/db";
import { emptyWorldState, type ResolvedItem } from "@domigo/game-core";
import { SANDBOX_PROFILES, sandboxEnabled, sandboxWorld, signStudentPreview, type SandboxProfileKey } from "@/lib/sandbox-preview";
import WorldPreviewClient from "../WorldPreviewClient";

export const dynamic = "force-dynamic";

function playerSeed(value: string): number { let hash = 2166136261; for (let index = 0; index < value.length; index++) { hash ^= value.charCodeAt(index); hash = Math.imul(hash, 16777619); } return hash >>> 0; }

function worldItems(): Record<string, ResolvedItem> {
  const unit = loadUnit("g1-u01");
  const reading = loadStoryComprehension("g1.st.lost-pages")?.items ?? [];
  const items: Record<string, ResolvedItem> = {};
  for (const item of unit.vocab) items[item.id] = { kind: "vocab", item };
  for (const item of unit.grammar) items[item.id] = { kind: "grammar", item };
  for (const item of reading) items[item.id] = { kind: "grammar", item: item as unknown as GrammarItem };
  return items;
}

export default async function GameProfilePreview({ params }: { params: Promise<{ profile: string }> }) {
  if (!sandboxEnabled()) notFound();
  const { profile: rawProfile } = await params;
  if (!(rawProfile in SANDBOX_PROFILES)) notFound();
  const profileKey = rawProfile as SandboxProfileKey;
  const profile = SANDBOX_PROFILES[profileKey];
  const world = sandboxWorld();
  let initialState = emptyWorldState(world);
  let persistenceAvailable = false;
  try { initialState = await loadStudentWorldState(getDb(), profile.userId, world); persistenceAvailable = true; } catch { /* The calibration renderer can still be reviewed while the isolated Neon slot is pending. */ }
  const requiredItems = new Set(world.encounters.flatMap((encounter) => encounter.taskRefs));
  const items = Object.fromEntries(Object.entries(worldItems()).filter(([id]) => requiredItems.has(id)));
  return <main data-grade="1" style={{ minHeight: "100vh", padding: "14px 10px 30px", background: "linear-gradient(160deg,#eaf4df,#fff8df 62%,#ddc28a)" }}>
    <div style={{ maxWidth: 760, margin: "0 auto 8px", display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}><Link href="/dev/game-preview" style={{ color: "#31583f", fontWeight: 800 }}>← Testprofile</Link>{!persistenceAvailable && <span role="status" style={{ color: "#8a4b21", fontSize: 12, fontWeight: 700 }}>Database branch pending · local calibration mode</span>}</div>
    <WorldPreviewClient world={world} initialState={initialState} items={items} profileName={profile.displayName} previewToken={signStudentPreview(profileKey)} playerSeed={playerSeed(profile.userId)} persistenceAvailable={persistenceAvailable} />
  </main>;
}
