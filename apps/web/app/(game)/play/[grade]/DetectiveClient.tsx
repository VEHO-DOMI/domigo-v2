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
import type { GameAttempt, DetectiveSave, DetectiveArt, EvidencePiece } from "@domigo/game-detective";
import type { ResolvedItem } from "@domigo/game-core";
import { flushOutbox, sendAttempt } from "@/lib/attempt-outbox";
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
  reviewItems: ResolvedItem[];
  finalePieces: EvidencePiece[];
  serverSave: SavePayload | null;
  detectiveArt: DetectiveArt | null;
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
  const [paused, setPaused] = useState(false); // pause-on-blur veil (Law 9 — classroom tablets)

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
    const flushSave = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) put(JSON.parse(raw) as SavePayload);
      } catch { /* ignore */ }
    };
    // Backgrounded (tab switch / app hidden): persist everything we have, then
    // raise the paused veil so the student deliberately resumes on return (Law 9).
    const onHidden = () => {
      if (document.visibilityState !== "hidden") return;
      flushSave();
      void flushOutbox(); // drain any pending graded attempts while we still can
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
      <DetectiveGame
        caseTitle={props.caseTitle}
        chapter={props.chapter}
        castNames={props.castNames}
        storyItems={props.storyItems}
        reviewItems={props.reviewItems}
        finalePieces={props.finalePieces}
        onAttempt={onAttempt}
        initialSave={initial?.state ?? null}
        onSave={onSave}
        art={props.detectiveArt}
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
          <div style={{ color: "#cbd5e1", fontSize: 14 }}>Your case is saved.</div>
          <button
            autoFocus
            onClick={() => setPaused(false)}
            style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 17, fontWeight: 600, cursor: "pointer" }}
          >
            ▶ Continue
          </button>
        </div>
      )}
    </>
  );
}
