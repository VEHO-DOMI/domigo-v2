"use client";
/**
 * VS · the world-map React mount — mirrors ArcadeGame.tsx's structure: ONE
 * Phaser.Game per mount, callbacks up, the shared pad object down. React owns
 * the DOM chrome (the entrance prompt chip + touch controls); MapScene owns
 * the walk. Mounted via next/dynamic({ssr:false}) only — never on the server.
 */
import Phaser from "phaser";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ArcadePad } from "./ArcadeScene.ts";
import { MapScene, type MapConfig, type MapEntrance } from "./MapScene.ts";
import { bindTypingGuard } from "@domigo/game-feel/typing-guard";

export interface MapGameProps {
  world: {
    rows: string[];
    legend: MapConfig["legend"];
    buildings: MapConfig["buildings"];
    notes: Array<{ c: number; r: number; text: string }>;
  };
  chaptersDone: string[];
  justDone?: string;
  startPos?: { c: number; r: number } | null;
  /** doc 28 §5: generated map art (stem→URL); missing = procedural. */
  art?: Record<string, string>;
  seed: number;
  playerSeed?: number;
  onEnter: (chapter: string) => void;
  onNote: (text: string) => void;
  onMove: (c: number, r: number) => void;
}

const hudChip: CSSProperties = { background: "rgba(20,18,33,0.82)", color: "#e8e6f5", borderRadius: 999, padding: "6px 12px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-label)" };

export function MapGame(props: MapGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<ArcadePad>({ left: false, right: false, up: false, down: false, jump: false, pogo: false, swing: false });
  const [prompt, setPrompt] = useState<MapEntrance | null>(null);
  const { width, height } = MapScene.dimensions(props.world.rows);

  // Topological unlock, mirrored for the DOM chip (the scene enforces it too):
  // unlocked = done, or the FIRST chapter not yet done ("ch01".."ch15" sorts).
  const chapters = Object.values(props.world.buildings).map((b) => b.chapter).sort();
  const firstOpen = chapters.find((c) => !props.chaptersDone.includes(c)) ?? null;
  const promptUnlocked = prompt !== null && (props.chaptersDone.includes(prompt.chapter) || prompt.chapter === firstOpen);

  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).get("motion") === "reduce";
    const scene = new MapScene({
      rows: props.world.rows,
      legend: props.world.legend,
      buildings: props.world.buildings,
      notes: props.world.notes,
      art: props.art,
      chaptersDone: props.chaptersDone,
      justDone: props.justDone,
      startPos: props.startPos ?? null,
      seed: props.seed,
      playerSeed: props.playerSeed,
      reducedMotion: reduced,
      pad: padRef.current,
      onPrompt: setPrompt,
      onEnter: props.onEnter,
      onNote: props.onNote,
      onMove: props.onMove,
    });
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current ?? undefined,
      width,
      height,
      pixelArt: true,
      backgroundColor: "#141221",
      fps: { target: 30, min: 20 },
      audio: { noAudio: true },
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene,
    });
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>)["__domigoMap"] = {
        state: () => scene.debugState(),
        press: (p: Partial<ArcadePad>) => Object.assign(padRef.current, p),
        // playtest-only: the game loop sleeps when the tab is hidden (Phaser
        // VisibilityHandler); this lets the automated harness wake + step it
        // without needing OS focus (P-37b). Never used in production.
        step: (ms: number) => { game.loop.wake(); scene.sys.step(performance.now(), ms); },
      };
    }
    const unbindTyping = bindTypingGuard(game); // W0 typing-mode law
    return () => {
      if (process.env.NODE_ENV !== "production") {
        delete (window as unknown as Record<string, unknown>)["__domigoMap"];
      }
      unbindTyping();
      game.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <div ref={hostRef} data-testid="map-canvas" style={{ width: "100%", aspectRatio: `${width} / ${height}`, background: "#141221", borderRadius: 8, overflow: "hidden" }} />

        {/* the door names its destination (Keen §1.5 + the S1 contextual-prompt pattern) */}
        {prompt !== null && (
          <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 6 }}>
            <div style={{ ...hudChip, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", pointerEvents: "auto" }}>
              <span>
                <strong>{prompt.label}</strong>
                {promptUnlocked ? " — Enter / Antippen" : " — noch versiegelt"}
              </span>
              {promptUnlocked && (
                <button type="button" className="dg-btn" style={{ fontSize: 13, padding: "6px 12px" }} onClick={() => props.onEnter(prompt.chapter)}>
                  Betreten →
                </button>
              )}
            </div>
          </div>
        )}

        <MapTouchControls pad={padRef.current} />
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
        Pfeiltasten / WASD laufen · Enter, Leertaste oder E betritt ein Kapitel
      </p>
    </div>
  );
}

/** Touch controls (the ArcadeGame pattern): walk d-pad + ONE confirm button. */
function MapTouchControls({ pad }: { pad: ArcadePad }) {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).has("dpad");
    setCoarse(forced || window.matchMedia("(pointer: coarse)").matches);
  }, []);
  if (!coarse) return null;
  const btn = (label: string, glyph: string, key: keyof ArcadePad, style: CSSProperties) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => { e.preventDefault(); pad[key] = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic */ } }}
      onPointerUp={() => { pad[key] = false; }}
      onPointerCancel={() => { pad[key] = false; }}
      onPointerLeave={() => { pad[key] = false; }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ...style, width: 56, height: 56, borderRadius: 14, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(20,18,33,0.5)", color: "#fff", fontSize: 22, touchAction: "none", cursor: "pointer" }}
    >
      {glyph}
    </button>
  );
  return (
    <>
      <div style={{ position: "absolute", left: 10, bottom: 10, display: "grid", gridTemplateColumns: "56px 56px 56px", gridTemplateRows: "56px 56px", gap: 4, zIndex: 6, touchAction: "none" }}>
        <span />
        {btn("Move up", "▲", "up", {})}
        <span />
        {btn("Move left", "◀", "left", {})}
        {btn("Move down", "▼", "down", {})}
        {btn("Move right", "▶", "right", {})}
      </div>
      <div style={{ position: "absolute", right: 10, bottom: 10, zIndex: 6, touchAction: "none" }}>
        {btn("Betreten", "⤒", "jump", {})}
      </div>
    </>
  );
}
