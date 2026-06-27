"use client";
/**
 * Client boundary for the G2 detective game (DOM+SVG, ssr:false). Same two
 * persistence paths as GameClient: graded answers → the offline attempt outbox
 * (the DetectiveGame builds mode:"game:g2"); cosmetic saves → localStorage +
 * debounced PUT /api/game-save (clientRev LWW). Carries no progression (Law 2).
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@domigo/content-schema";
import type { GameAttempt, DetectiveSave } from "@domigo/game-detective";
import type { ResolvedItem } from "@domigo/game-core";
import { sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const DetectiveGame = dynamic(() => import("@domigo/game-detective").then((m) => m.DetectiveGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Opening the case…</p>,
});

interface SavePayload { clientRev: number; state: DetectiveSave }

export default function DetectiveClient(props: {
  gameMode: string;
  caseTitle: string;
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  serverSave: SavePayload | null;
}) {
  useOutboxFlush();
  const { gameMode, serverSave } = props;
  const lsKey = `domigo:gamesave:${gameMode}`;

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

  const onSave = (state: DetectiveSave) => {
    revRef.current += 1;
    const payload: SavePayload = { clientRev: revRef.current, state };
    try { localStorage.setItem(lsKey, JSON.stringify(payload)); } catch { /* quota/private mode */ }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => put(payload), 1500);
  };

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
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
    return () => window.removeEventListener("pagehide", flush);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKey]);

  const onAttempt = (a: GameAttempt) =>
    sendAttempt({ clientAttemptId: a.clientAttemptId, itemId: a.itemId, mode: a.mode, input: a.input, latencyMs: a.latencyMs, hintUsed: a.hintUsed });

  return (
    <DetectiveGame
      caseTitle={props.caseTitle}
      chapter={props.chapter}
      castNames={props.castNames}
      storyItems={props.storyItems}
      onAttempt={onAttempt}
      initialSave={initial?.state ?? null}
      onSave={onSave}
    />
  );
}
