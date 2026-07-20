"use client";
// THE PAINTED BOOK — the React shell: mounts the Phaser game, owns EVERY
// scene handoff (the P-49 law: transitions happen outside the game step via
// setTimeout(0) + a watchdog + the always-on fatal banner), renders the HUD,
// the touch pad, and the dev harness (`window.__domigoPaint`, REPLACE-pad
// semantics — the P-46 lesson).

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import type { PaintLevel } from "./level.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE } from "./paint.ts";
import { PaintScene } from "./PaintScene.ts";

export interface PaintGameProps {
  level: PaintLevel;
  art: Record<string, string>;
  hubHref: string;
  buildSha?: string;
  startPhase?: string; // teacher debug door
}

interface HarnessApi {
  press: (p: Partial<Pad>) => void;
  step: (ms?: number) => void;
  rafStep: () => void;
  state: () => unknown;
  phase: () => string;
  warp: (c: number, r: number) => void;
}

declare global {
  interface Window {
    __domigoPaint?: HarnessApi;
  }
}

export default function PaintGame({ level, art, hubHref, buildSha, startPhase }: PaintGameProps): React.ReactElement {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<PaintScene | null>(null);
  const padRef = useRef<Pad>({ ...IDLE_PAD });
  const firstPhase = startPhase ?? level.phases[0]?.id ?? "p1";
  const [phaseId, setPhaseId] = useState(firstPhase);
  const [phaseName, setPhaseName] = useState("");
  const [letters, setLetters] = useState({ got: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCoarse(window.matchMedia("(pointer: coarse)").matches || new URLSearchParams(window.location.search).has("dpad"));

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host,
      width: LOGICAL_W * RENDER_SCALE,
      height: LOGICAL_H * RENDER_SCALE,
      backgroundColor: "#f6ecd4",
      // the painted contract: LINEAR everywhere, sub-pixel motion allowed
      pixelArt: false,
      antialias: true,
      roundPixels: false,
      fps: { target: 60, min: 30 },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;

    const mountPhase = (pid: string): void => {
      const scene = new PaintScene({
        level,
        phaseId: pid,
        art,
        pad: padRef.current,
        reducedMotion,
        callbacks: {
          onExit: (next) => handoff(next),
          onLetters: (got, total) => setLetters({ got, total }),
          onEncounter: () => undefined, // PR ⑤ opens the task overlay here
        },
      });
      sceneRef.current = scene;
      const name = level.phases.find((p) => p.id === pid)?.nameDe ?? pid;
      setPhaseName(name);
      setPhaseId(pid);
      game.scene.add("paint", scene, true);
    };

    const handoff = (next: string): void => {
      // P-49: NEVER from inside a step — defer, swap, and watchdog the swap.
      window.setTimeout(() => {
        if (next === "done" || next === "boss") {
          game.scene.stop("paint");
          setDone(true);
          return;
        }
        game.scene.stop("paint");
        game.scene.remove("paint");
        mountPhase(next);
        window.setTimeout(() => {
          if (!game.scene.isActive("paint")) {
            setFatal(`Phasen-Wechsel nach ${next} hängt (Szene nie gestartet) — bitte neu laden.`);
          }
        }, 2500);
      }, 0);
    };

    mountPhase(firstPhase);

    if (process.env.NODE_ENV !== "production") {
      window.__domigoPaint = {
        press: (p) => {
          // REPLACE semantics (P-46): unnamed keys go FALSE, never latch
          const pad = padRef.current;
          pad.left = p.left === true;
          pad.right = p.right === true;
          pad.up = p.up === true;
          pad.down = p.down === true;
          pad.jump = p.jump === true;
          pad.punch = p.punch === true;
        },
        step: (ms = 1000 / 60) => {
          game.loop.wake();
          sceneRef.current?.sys.step(performance.now(), ms);
        },
        rafStep: () => {
          game.loop.step(performance.now());
        },
        state: () => sceneRef.current?.getState(),
        phase: () => sceneRef.current?.getState().phase ?? "",
        warp: (c, r) => sceneRef.current?.warp(c, r),
      };
    }

    return () => {
      if (process.env.NODE_ENV !== "production") delete window.__domigoPaint;
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one game per mount
  }, []);

  const restart = (): void => window.location.reload();

  return (
    <div style={{ maxWidth: LOGICAL_W * RENDER_SCALE, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 2px" }}>
        <strong style={{ fontSize: 15 }}>🖌 {phaseName}</strong>
        <span style={{ fontSize: 14 }}>✨ {level.collectNounDe}: {letters.got}/{letters.total}</span>
      </div>
      {fatal !== null && (
        <div style={{ background: "#c0392b", color: "#fff", padding: "8px 12px", borderRadius: 8, marginBottom: 6 }}>⚠ {fatal}</div>
      )}
      <div ref={hostRef} style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 14px rgba(30,20,10,0.25)" }} />
      {done && (
        <div style={{ background: "#fdf7e6", border: "2px solid #e0a92a", borderRadius: 10, padding: 14, marginTop: 8, textAlign: "center" }}>
          <p style={{ fontSize: 17, margin: "2px 0 8px" }}>🎉 Wiese geschafft! {letters.got} von {letters.total} {level.collectNounDe} gefunden.</p>
          <button onClick={restart} style={btn}>↻ Noch einmal</button>
          <a href={hubHref} style={{ ...btn, marginLeft: 10, textDecoration: "none", display: "inline-block" }}>← Zurück</a>
        </div>
      )}
      {coarse && !done && <TouchPad pad={padRef.current} />}
      <p style={{ fontSize: 12, color: "#8a8066", textAlign: "center", marginTop: 6 }}>
        ←→ laufen · SPACE springen (halten = höher, in der Luft = schweben; am Griff = hochspringen) · X Faust (halten = laden) · ↑↓ klettern
        {buildSha ? ` · Build ${buildSha.slice(0, 7)}` : ""}
      </p>
    </div>
  );
}

const btn: React.CSSProperties = {
  fontSize: 15,
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #c9a36a",
  background: "#fff",
  cursor: "pointer",
};

/** Pointer-capture touch buttons writing straight into the shared pad. */
function TouchPad({ pad }: { pad: Pad }): React.ReactElement {
  const bind = (key: keyof Pad) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      pad[key] = true;
      // the P-93 lesson: state BEFORE capture; capture may throw on synthetic pointers
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* synthetic pointer */
      }
    },
    onPointerUp: () => {
      pad[key] = false;
    },
    onPointerCancel: () => {
      pad[key] = false;
    },
  });
  const zone: React.CSSProperties = {
    fontSize: 24,
    width: 64,
    height: 64,
    borderRadius: 16,
    border: "1px solid #c9a36a",
    background: "#fffdf5",
    touchAction: "none",
    userSelect: "none",
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <button aria-label="links" style={zone} {...bind("left")}>←</button>
        <button aria-label="rechts" style={zone} {...bind("right")}>→</button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button aria-label="hochziehen" style={zone} {...bind("up")}>↑</button>
        <button aria-label="Faust" style={zone} {...bind("punch")}>✊</button>
        <button aria-label="springen / schweben" style={{ ...zone, width: 84 }} {...bind("jump")}>⤒</button>
      </div>
    </div>
  );
}
