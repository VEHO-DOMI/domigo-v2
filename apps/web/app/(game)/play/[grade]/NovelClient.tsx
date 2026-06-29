"use client";
/**
 * Client boundary for the G3 "FOURTEEN" graphic novel (DOM+SVG, ssr:false). Same
 * two persistence paths as the other game clients: graded answers → the offline
 * attempt outbox (NovelGame builds mode:"game:g3"); cosmetic saves → localStorage +
 * debounced PUT /api/game-save (clientRev LWW). Carries no progression (Law 2).
 * Raises a pause-on-blur veil for classroom tablets (Law 9), like DetectiveClient.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@domigo/content-schema";
import type { GameAttempt, NovelSave, NovelArt } from "@domigo/game-novel";
import type { ResolvedItem } from "@domigo/game-core";
import { flushOutbox, sendAttempt } from "@/lib/attempt-outbox";
import { useOutboxFlush } from "@/lib/useOutboxFlush";

const NovelGame = dynamic(() => import("@domigo/game-novel").then((m) => m.NovelGame), {
  ssr: false,
  loading: () => <p style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading the episode…</p>,
});

interface SavePayload { clientRev: number; state: NovelSave }

export default function NovelClient(props: {
  gameMode: string;
  episodeTitle: string;
  chapter: Chapter;
  castNames: Record<string, string>;
  storyItems: Record<string, ResolvedItem>;
  reviewItems: ResolvedItem[];
  serverSave: SavePayload | null;
  novelArt: NovelArt | null;
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
  const [paused, setPaused] = useState(false);

  const put = (payload: SavePayload) => {
    void fetch("/api/game-save", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ gameMode, schemaVersion: 1, clientRev: payload.clientRev, state: payload.state }),
    }).catch(() => { /* cosmetic, best-effort */ });
  };

  const onSave = (state: NovelSave) => {
    revRef.current += 1;
    const payload: SavePayload = { clientRev: revRef.current, state };
    try { localStorage.setItem(lsKey, JSON.stringify(payload)); } catch { /* quota/private mode */ }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => put(payload), 1500);
  };

  useEffect(() => {
    const flushSave = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) put(JSON.parse(raw) as SavePayload);
      } catch { /* ignore */ }
    };
    const onHidden = () => {
      if (document.visibilityState !== "hidden") return;
      flushSave();
      void flushOutbox();
      setPaused(true);
    };
    window.addEventListener("pagehide", flushSave);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flushSave);
      document.removeEventListener("visibilitychange", onHidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKey]);

  const onAttempt = (a: GameAttempt) =>
    sendAttempt({ clientAttemptId: a.clientAttemptId, itemId: a.itemId, mode: a.mode, input: a.input, latencyMs: a.latencyMs, hintUsed: a.hintUsed });

  return (
    <>
      <NovelGame
        episodeTitle={props.episodeTitle}
        chapter={props.chapter}
        castNames={props.castNames}
        storyItems={props.storyItems}
        reviewItems={props.reviewItems}
        onAttempt={onAttempt}
        initialSave={initial?.state ?? null}
        onSave={onSave}
        art={props.novelArt}
      />
      {paused && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Paused"
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,.72)", backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "system-ui, sans-serif" }}
        >
          <div style={{ fontSize: 44 }} aria-hidden="true">⏸️</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Paused</div>
          <div style={{ color: "#cbd5e1", fontSize: 14 }}>Your episode is saved.</div>
          <button
            autoFocus
            onClick={() => setPaused(false)}
            style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 17, fontWeight: 600, cursor: "pointer" }}
          >
            ▶ Continue
          </button>
        </div>
      )}
    </>
  );
}
