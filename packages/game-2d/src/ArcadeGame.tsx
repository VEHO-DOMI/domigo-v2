"use client";
/**
 * KA-1 · the arcade React mount — HUD, the QUICKFIRE overlay, and the run's
 * book-ends (game over / level complete). One grading brain holds: a chip tap
 * grades through @domigo/engine (gradeVocab / gradeGrammar choice input) and
 * posts through the SAME injected onAttempt pipe as every other game surface —
 * this file never invents grading. Sound stays default-OFF (game-feel).
 */
import Phaser from "phaser";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { gradeGrammar, gradeVocab } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { ArcadeScene, type ArcadePad } from "./ArcadeScene.ts";
import { parseArcadeLevel, quickfireFor, TINTENLAUF_ROWS, type Quickfire } from "./arcade.ts";
import type { AttemptFn } from "./PhaserGame.tsx";

export interface ArcadeGameProps {
  seed: number;
  playerSeed?: number;
  /** Attempt mode ("game:g2") — quickfire answers are REAL graded attempts. */
  mode: string;
  /** The quickfire item pool (server-resolved, choice-friendly formats). */
  items: ResolvedItem[];
  onAttempt: AttemptFn;
  hubHref: string;
}

const QF_SECONDS = 6;

type Phase = { kind: "run" } | { kind: "quickfire"; qf: Quickfire; deadline: number } | { kind: "verdict"; correct: boolean; answer: string } | { kind: "gameover" } | { kind: "done"; stats: { ms: number; maxCombo: number; letters: number; words: number } };

export function ArcadeGame(props: ArcadeGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ArcadeScene | null>(null);
  const padRef = useRef<ArcadePad>({ left: false, right: false, jump: false });
  const [phase, setPhase] = useState<Phase>({ kind: "run" });
  const [hearts, setHearts] = useState(3);
  const [letters, setLetters] = useState(0);
  const [words, setWords] = useState(0);
  const [combo, setCombo] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const level = useMemo(() => parseArcadeLevel(TINTENLAUF_ROWS), []);
  const wordsNeeded = Math.min(5, level.enemies.length);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const { width, height } = ArcadeScene.dimensions();
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).get("motion") === "reduce";
    setReducedMotion(reduced);
    const scene = new ArcadeScene({
      level,
      seed: props.seed,
      playerSeed: props.playerSeed,
      reducedMotion: reduced,
      pad: padRef.current,
      wordsNeeded,
      onQuickfire: (contactIdx) => {
        const qf = quickfireFor(props.items, contactIdx);
        if (!qf) {
          // thin pool: the enemy just pops — a stalled quiz would kill the run's flow
          scene.resolveQuickfire(true);
          return;
        }
        setPhase({ kind: "quickfire", qf, deadline: Date.now() + QF_SECONDS * 1000 });
      },
      onLetters: setLetters,
      onHearts: setHearts,
      onCombo: (streak) => setCombo(streak),
      onWords: setWords,
      onGameOver: () => setPhase({ kind: "gameover" }),
      onComplete: (stats) => setPhase({ kind: "done", stats }),
    });
    sceneRef.current = scene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current ?? undefined,
      width,
      height,
      pixelArt: true,
      backgroundColor: "#141221",
      fps: { target: 60, min: 30 },
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene,
    });
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>)["__domigoArcade"] = {
        state: () => scene.debugState(),
        press: (p: Partial<ArcadePad>) => Object.assign(padRef.current, p),
      };
    }
    return () => {
      if (process.env.NODE_ENV !== "production") delete (window as unknown as Record<string, unknown>)["__domigoArcade"];
      game.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the quickfire countdown — timeout counts as a wrong tap (the run continues)
  useEffect(() => {
    if (phase.kind !== "quickfire") return;
    timerRef.current = window.setTimeout(() => answer(null), Math.max(phase.deadline - Date.now(), 0));
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /** ONE brain: grade the tapped chip through the engine, post the attempt,
   *  flash the verdict, resume the run. `chip === null` = the clock ran out. */
  const answer = (chip: string | null) => {
    if (phase.kind !== "quickfire") return;
    const { qf } = phase;
    const item = props.items.find((r) => r.item.id === qf.itemId);
    let correct = false;
    if (chip !== null && item) {
      if (qf.kind === "vocab") {
        correct = gradeVocab(item.item as VocabItem, chip, qf.pool ?? "carrier").tier !== "wrong";
        void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: qf.itemId, mode: props.mode, input: { kind: "vocab", value: chip, pool: qf.pool ?? "carrier" }, latencyMs: null, hintUsed: false });
      } else {
        correct = gradeGrammar(item.item as GrammarItem, { kind: "choice", value: chip }).tier !== "wrong";
        void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: qf.itemId, mode: props.mode, input: { kind: "choice", value: chip }, latencyMs: null, hintUsed: false });
      }
    }
    setPhase({ kind: "verdict", correct, answer: qf.answer });
    window.setTimeout(() => {
      sceneRef.current?.resolveQuickfire(correct);
      setPhase({ kind: "run" });
    }, reducedMotion ? 500 : 750);
  };

  const restart = () => {
    sceneRef.current?.restartRun();
    setPhase({ kind: "run" });
  };

  const hudChip: CSSProperties = { background: "rgba(20,18,33,0.82)", color: "#e8e6f5", borderRadius: 999, padding: "6px 12px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-label)" };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <div ref={hostRef} data-testid="arcade-canvas" style={{ width: "100%", aspectRatio: "15 / 11", background: "#141221", borderRadius: 8, overflow: "hidden" }} />

        {/* HUD */}
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", pointerEvents: "none", zIndex: 5 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={hudChip}>{"❤".repeat(Math.max(hearts, 0))}{"♡".repeat(Math.max(3 - hearts, 0))}</span>
            <span style={hudChip}>✦ {letters}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {combo >= 2 && <span className="dg-qf-combo" style={{ ...hudChip, background: "#8b7cf5", color: "#141221" }}>×{combo}</span>}
            <span style={hudChip}>Wörter {words}/{wordsNeeded}</span>
          </div>
        </div>

        {/* QUICKFIRE — one word, three chips, one tap */}
        {phase.kind === "quickfire" && (
          <div className="dg-qf-veil" style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.55) 0%, rgba(20,18,33,0.86) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(480px, 96%)", textAlign: "center" }}>
              <div className="dg-qf-ring" style={{ ["--qf-s" as string]: `${QF_SECONDS}s` }} aria-hidden="true" />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 4 }}>{phase.qf.ask || "Schnell!"}</div>
              <div style={{ fontSize: phase.qf.prompt.length > 26 ? 20 : 30, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 14, lineHeight: 1.25 }}>{phase.qf.prompt}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {phase.qf.chips.map((chip) => (
                  <button key={chip} type="button" className="dg-qf-chip" onClick={() => answer(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* verdict flash */}
        {phase.kind === "verdict" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div className="dg-qf-verdict" style={{ background: phase.correct ? "#16a34a" : "#1e293b", color: "#fff", borderRadius: 16, padding: "14px 26px", fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
              {phase.correct ? "Stark!" : `→ ${phase.answer}`}
            </div>
          </div>
        )}

        {/* game over / complete */}
        {(phase.kind === "gameover" || phase.kind === "done") && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,18,33,0.88)", padding: 16 }}>
            <div style={{ background: "var(--card)", color: "var(--text)", borderRadius: 20, padding: "22px 26px", textAlign: "center", maxWidth: 380, width: "100%", border: "2px solid #8b7cf5" }}>
              {phase.kind === "done" ? (
                <>
                  <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)" }}>Lauf geschafft! 🏁</div>
                  <p style={{ fontSize: 15, margin: "10px 0 4px" }}>
                    {phase.stats.words} Wörter zurückgeholt · ✦ {phase.stats.letters} Buchstaben · beste Serie ×{phase.stats.maxCombo}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{Math.round(phase.stats.ms / 1000)}s</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>Die Tinte war schneller …</div>
                  <p style={{ fontSize: 14, margin: "8px 0 0", color: "var(--muted)" }}>Deine Wörter und ✦ bleiben dir — gleich nochmal!</p>
                </>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                {phase.kind === "gameover" && (
                  <button className="dg-btn" onClick={restart}>Nochmal! ↻</button>
                )}
                <a className="dg-btn-secondary" href={props.hubHref} style={{ textDecoration: "none" }}>Zur Schule →</a>
              </div>
            </div>
          </div>
        )}

        {/* touch controls (coarse pointers) */}
        <TouchControls pad={padRef.current} hidden={phase.kind !== "run"} />
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
        Pfeiltasten/WASD laufen · ↑/Leertaste springen · berühre einen Klecks und tippe schnell das richtige Wort
      </p>
    </div>
  );
}

/** Left/right/jump buttons for touch play (≥48px targets, pointer-capture safe). */
function TouchControls({ pad, hidden }: { pad: ArcadePad; hidden: boolean }) {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).has("dpad");
    setCoarse(forced || window.matchMedia("(pointer: coarse)").matches);
  }, []);
  if (!coarse || hidden) return null;
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
      <div style={{ position: "absolute", left: 10, bottom: 10, display: "flex", gap: 8, zIndex: 6, touchAction: "none" }}>
        {btn("Move left", "◀", "left", {})}
        {btn("Move right", "▶", "right", {})}
      </div>
      <div style={{ position: "absolute", right: 10, bottom: 10, zIndex: 6, touchAction: "none" }}>
        {btn("Jump", "⤒", "jump", {})}
      </div>
    </>
  );
}
