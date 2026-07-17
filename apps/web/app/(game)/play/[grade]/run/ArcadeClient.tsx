"use client";
/**
 * KA-1 · client boundary for the Tintenlauf arcade mock. Quickfire answers are
 * REAL graded attempts: they ride the A4 offline outbox with the grade's game
 * mode, exactly like the overworld — the server re-grades every one. No
 * cosmetic save (a run is a run; W-2+ decides arcade persistence).
 */
import dynamic from "next/dynamic";
import type { GameAttempt } from "@domigo/game-2d";
import type { ResolvedItem } from "@domigo/game-core";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const ArcadeGame = dynamic(() => import("@domigo/game-2d").then((m) => m.ArcadeGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Die Tinte steigt…</p>,
});

export default function ArcadeClient(props: {
  seed: number;
  playerSeed?: number;
  mode: string;
  items: ResolvedItem[];
  storyTasks?: import("@domigo/game-2d/arcade").StoryTaskPack;
  hubHref: string;
  title: string;
  levelId?: string;
  tier?: "E" | "M" | "S";
  /** v2.1: a content-authored chapter level (+ its guardian + return link). */
  level?: import("@domigo/game-2d/arcade").ArcadeLevel;
  boss?: import("@domigo/game-2d/boss").BossScript;
  /** doc 28 §5: generated-art stem→URL map (chapter + hero). */
  art?: Record<string, string>;
  doneHref?: string;
}) {
  useOutboxFlush();
  const onAttempt = (a: GameAttempt) =>
    sendAttempt({ clientAttemptId: a.clientAttemptId, itemId: a.itemId, mode: a.mode, input: a.input, latencyMs: a.latencyMs, hintUsed: a.hintUsed });
  // Glühwörter → Hinweis-Funken: bank ONCE at run end (server clamps ≤8);
  // fire-and-forget — a failed bank never blocks the completion screen
  const onDone = (stats: { gluehwoerter: number }) => {
    if (stats.gluehwoerter > 0) {
      void fetch("/api/funken", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ earned: stats.gluehwoerter }) }).catch(() => undefined);
    }
  };
  return (
    <main style={{ padding: "16px 12px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", maxWidth: 720, margin: "0 auto 10px" }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{props.title}</h1>
        <a href={props.hubHref} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>{props.level ? "← Zur Weltkarte" : "← Alle Räume"}</a>
      </div>
      <ArcadeGame seed={props.seed} playerSeed={props.playerSeed} mode={props.mode} items={props.items} storyTasks={props.storyTasks} onAttempt={onAttempt} hubHref={props.hubHref} levelId={props.levelId} tier={props.tier} level={props.level} boss={props.boss} art={props.art} doneHref={props.doneHref} onDone={onDone} />
    </main>
  );
}
