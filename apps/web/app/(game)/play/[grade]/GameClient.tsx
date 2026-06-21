"use client";
/**
 * Client boundary for the game route — mounts the Phaser overworld (ssr:false so
 * Phaser never runs on the server) and injects the one persistence path: the A4
 * offline attempt outbox. The world layer (game-2d) stays app-agnostic; the app
 * supplies `onAttempt` (mode:"game:g1") + the outbox flush.
 */
import dynamic from "next/dynamic";
import type { Chapter } from "@domigo/content-schema";
import type { GameAttempt } from "@domigo/game-2d";
import type { ResolvedItem } from "@domigo/game-core";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const PhaserGame = dynamic(() => import("@domigo/game-2d").then((m) => m.PhaserGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Loading the world…</p>,
});

export default function GameClient(props: {
  seed: number;
  encounters: ResolvedItem[];
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
}) {
  useOutboxFlush();
  const onAttempt = (a: GameAttempt) =>
    sendAttempt({
      clientAttemptId: a.clientAttemptId,
      itemId: a.itemId,
      mode: a.mode,
      input: a.input,
      latencyMs: a.latencyMs,
      hintUsed: a.hintUsed,
    });

  return (
    <main style={{ padding: "16px 12px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 720, margin: "0 auto 10px" }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>The Lost Pages</h1>
        <a href="/home" style={{ fontSize: 14, color: "#2563eb" }}>← Home</a>
      </div>
      <PhaserGame
        seed={props.seed}
        encounters={props.encounters}
        chapter={props.chapter}
        castNames={props.castNames}
        storyItems={props.storyItems}
        onAttempt={onAttempt}
      />
    </main>
  );
}
