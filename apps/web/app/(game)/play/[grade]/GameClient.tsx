"use client";
/**
 * Client boundary for the game route — mounts the Phaser overworld (ssr:false so
 * Phaser never runs on the server) and owns the TWO persistence paths:
 *  - graded answers → the A4 offline attempt outbox (mode:"game:g1");
 *  - COSMETIC saves → localStorage (instant resume) + a debounced PUT to
 *    /api/game-save (clientRev last-write-wins). The save carries no progression
 *    (XP/streak/unlocks derive from attempts) — losing it costs only position.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@domigo/content-schema";
import type { GameAttempt, GameSaveState } from "@domigo/game-2d";
import type { ResolvedItem } from "@domigo/game-core";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const PhaserGame = dynamic(() => import("@domigo/game-2d").then((m) => m.PhaserGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading the world…</p>,
});

interface SavePayload { clientRev: number; state: GameSaveState }

export default function GameClient(props: {
  seed: number;
  /** A1-4: stable per-student avatar seed (from the userId) — decoupled from the zone seed. */
  playerSeed?: number;
  gameMode: string; // "game:g1".."game:g4"
  zoneId: string;
  generator: string;
  zoneTitle: string;
  hubHref: string;
  encounters: ResolvedItem[];
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  serverSave: SavePayload | null;
}) {
  useOutboxFlush();
  const { gameMode, serverSave } = props;
  const lsKey = `domigo:gamesave:${gameMode}`;

  // Resolve the resume state client-side (localStorage may be fresher than the
  // server copy after offline play). Gate the canvas until resolved so the scene
  // boots with the right position. localStorage is unavailable during SSR, so
  // this must run in an effect, not render.
  // Resolve resume state once, at first render. localStorage may be fresher than
  // the server copy (offline play) → take the higher clientRev. SSR-guarded
  // (localStorage is client-only); PhaserGame is ssr:false so this only matters
  // on the client where the canvas actually mounts.
  const [initial] = useState<SavePayload | null>(() => {
    if (typeof window === "undefined") return serverSave;
    let local: SavePayload | null = null;
    try {
      const raw = localStorage.getItem(lsKey);
      if (raw) local = JSON.parse(raw) as SavePayload;
    } catch { /* ignore */ }
    return local && (!serverSave || local.clientRev > serverSave.clientRev) ? local : serverSave;
  });
  const revRef = useRef(initial?.clientRev ?? 0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const put = (payload: SavePayload) => {
    void fetch("/api/game-save", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ gameMode, schemaVersion: 1, clientRev: payload.clientRev, state: payload.state }),
    }).catch(() => { /* cosmetic, best-effort */ });
  };

  const onSave = (state: GameSaveState) => {
    revRef.current += 1;
    const payload: SavePayload = { clientRev: revRef.current, state };
    try { localStorage.setItem(lsKey, JSON.stringify(payload)); } catch { /* quota/private mode */ }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => put(payload), 1500); // ≤90s checkpoint (Law 9), debounced
  };

  // Flush a pending save when the tab is hidden/closed.
  useEffect(() => {
    const flush = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) put(JSON.parse(raw) as SavePayload);
      } catch { /* ignore */ }
    };
    // A1-2: the visibilitychange handler must be NAMED so cleanup can remove it —
    // the previous inline arrow leaked one listener per mount (game route churn).
    const onHidden = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKey]);

  const onAttempt = (a: GameAttempt) =>
    sendAttempt({ clientAttemptId: a.clientAttemptId, itemId: a.itemId, mode: a.mode, input: a.input, latencyMs: a.latencyMs, hintUsed: a.hintUsed });

  return (
    <main style={{ padding: "16px 12px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", maxWidth: 720, margin: "0 auto 10px" }}>
        <h1 style={{ fontSize: 21, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{props.zoneTitle}</h1>
        <a href={props.hubHref} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Zones</a>
      </div>
      <PhaserGame
        seed={props.seed}
        playerSeed={props.playerSeed}
        zoneId={props.zoneId}
        generator={props.generator}
        encounters={props.encounters}
        chapter={props.chapter}
        castNames={props.castNames}
        storyItems={props.storyItems}
        onAttempt={onAttempt}
        initialSave={initial?.state ?? null}
        onSave={onSave}
      />
    </main>
  );
}
