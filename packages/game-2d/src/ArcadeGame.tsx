"use client";
/**
 * K-3 · the arcade React mount — HUD, the QUICKFIRE overlay, and the
 * RETTUNGSAUFGABE (bible §5.3): losing the last heart opens a calm rescue —
 * 2 fuller tasks (typed carrier production first; a miss scaffolds DOWN to
 * chips) earn re-entry at the checkpoint with 2 hearts. One grading brain
 * holds everywhere: chips and typed answers grade through @domigo/engine and
 * post through the SAME injected onAttempt pipe as every other game surface.
 */
import Phaser from "phaser";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { gradeGrammar, gradeVocab } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { ArcadeScene, type ArcadePad } from "./ArcadeScene.ts";
import { ARCADE, quickfireFor, rescuePlan, rescueScaffold, type Quickfire, type RescueTask, type Tier } from "./arcade.ts";
import { DEFAULT_LEVEL_ID, LEVELS } from "./levels.ts";
import type { AttemptFn } from "./PhaserGame.tsx";

export interface ArcadeGameProps {
  seed: number;
  playerSeed?: number;
  /** Attempt mode ("game:g2") — quickfire + rescue answers are REAL attempts. */
  mode: string;
  items: ResolvedItem[];
  onAttempt: AttemptFn;
  hubHref: string;
  /** Level + tier (dev knobs; production picks per SRS mastery later). */
  levelId?: string;
  tier?: Tier;
}

type RescueState = {
  tasks: RescueTask[];
  at: number;
  solved: number;
  /** typed input value for the current task */
  value: string;
  verdict: "none" | "right" | "wrong";
};

type Phase =
  | { kind: "run" }
  | { kind: "quickfire"; qf: Quickfire; deadline: number }
  | { kind: "verdict"; correct: boolean; answer: string }
  | { kind: "rescue"; rescue: RescueState }
  | { kind: "done"; stats: { ms: number; maxCombo: number; letters: number; words: number; seals: number; deaths: number } };

export function ArcadeGame(props: ArcadeGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ArcadeScene | null>(null);
  const padRef = useRef<ArcadePad>({ left: false, right: false, up: false, down: false, jump: false, pogo: false });
  const [phase, setPhase] = useState<Phase>({ kind: "run" });
  const [hearts, setHearts] = useState(3);
  const [letters, setLetters] = useState(0);
  const [combo, setCombo] = useState(0);
  const [seals, setSeals] = useState<[number, number]>([0, 0]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const entry = LEVELS[props.levelId ?? DEFAULT_LEVEL_ID] ?? LEVELS[DEFAULT_LEVEL_ID]!;
  const level = entry.level;
  const tier: Tier = props.tier ?? entry.defaultTier;
  const qfSeconds = ARCADE.quickfireSeconds[tier];
  const timerRef = useRef<number | null>(null);
  const fragment = level.header.fragment;

  useEffect(() => {
    const { width, height } = ArcadeScene.dimensions();
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).get("motion") === "reduce";
    setReducedMotion(reduced);
    const scene = new ArcadeScene({
      level,
      tier,
      seed: props.seed,
      playerSeed: props.playerSeed,
      reducedMotion: reduced,
      pad: padRef.current,
      onQuickfire: (contactIdx) => {
        const qf = quickfireFor(props.items, contactIdx);
        if (!qf) {
          scene.resolveQuickfire(true); // thin pool: the creature just freezes
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          (window as unknown as Record<string, unknown>)["__domigoArcadeQf"] = qf;
        }
        setPhase({ kind: "quickfire", qf, deadline: Date.now() + qfSeconds * 1000 });
      },
      onLetters: setLetters,
      onHearts: setHearts,
      onCombo: (streak) => setCombo(streak),
      onSeals: (got, total) => setSeals([got, total]),
      onRescue: (deathCount) => {
        const tasks = rescuePlan(props.items, deathCount - 1);
        if (tasks.length === 0) {
          // no rescuable pool → straight respawn (never a locked door)
          scene.respawn();
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          (window as unknown as Record<string, unknown>)["__domigoArcadeRescue"] = tasks;
        }
        setPhase({ kind: "rescue", rescue: { tasks, at: 0, solved: 0, value: "", verdict: "none" } });
      },
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
      // the fixed 60Hz simulation step (bible §2.0) — arcade physics fixedStep
      fps: { target: 60, min: 30 },
      audio: { noAudio: true },
      physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, fps: 60, fixedStep: true } },
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
      if (process.env.NODE_ENV !== "production") {
        delete (window as unknown as Record<string, unknown>)["__domigoArcade"];
        delete (window as unknown as Record<string, unknown>)["__domigoArcadeQf"];
        delete (window as unknown as Record<string, unknown>)["__domigoArcadeRescue"];
      }
      game.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // quickfire countdown — timeout counts as a wrong tap (the run continues)
  useEffect(() => {
    if (phase.kind !== "quickfire") return;
    timerRef.current = window.setTimeout(() => answerQuickfire(null), Math.max(phase.deadline - Date.now(), 0));
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /** ONE brain: grade through the engine, post the attempt, resume. */
  const answerQuickfire = (chip: string | null) => {
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

  /** The rescue: grade the current task; right → next/respawn; wrong on a
   *  typed task → the SAME item scaffolds down to chips (§5.3 — the loop
   *  always exits upward; failure recycles into practice, never a wall). */
  const answerRescue = (input: string) => {
    if (phase.kind !== "rescue") return;
    const { rescue } = phase;
    const task = rescue.tasks[rescue.at]!;
    const item = props.items.find((r) => r.item.id === task.itemId);
    let correct = false;
    if (item) {
      if (task.kind === "vocab") {
        correct = gradeVocab(item.item as VocabItem, input, task.pool ?? "carrier").tier !== "wrong";
        void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "vocab", value: input, pool: task.pool ?? "carrier" }, latencyMs: null, hintUsed: false });
      } else {
        correct = gradeGrammar(item.item as GrammarItem, { kind: "choice", value: input }).tier !== "wrong";
        void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
      }
    }
    if (correct) {
      const solved = rescue.solved + 1;
      if (solved >= rescue.tasks.length) {
        setPhase({ kind: "rescue", rescue: { ...rescue, solved, verdict: "right" } });
        window.setTimeout(() => {
          sceneRef.current?.respawn();
          setPhase({ kind: "run" });
        }, reducedMotion ? 400 : 700);
      } else {
        setPhase({ kind: "rescue", rescue: { ...rescue, at: rescue.at + 1, solved, value: "", verdict: "right" } });
        window.setTimeout(() => {
          setPhase((p) => (p.kind === "rescue" ? { kind: "rescue", rescue: { ...p.rescue, verdict: "none" } } : p));
        }, 600);
      }
    } else {
      // scaffold DOWN in place: typed becomes chips; chips just retry
      const tasks = [...rescue.tasks];
      tasks[rescue.at] = rescueScaffold(task, props.items);
      setPhase({ kind: "rescue", rescue: { ...rescue, tasks, value: "", verdict: "wrong" } });
      window.setTimeout(() => {
        setPhase((p) => (p.kind === "rescue" ? { kind: "rescue", rescue: { ...p.rescue, verdict: "none" } } : p));
      }, 800);
    }
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
            <span style={hudChip}>⬧ {seals[0]}/{seals[1]}</span>
          </div>
        </div>

        {/* QUICKFIRE — one word, three chips, one tap */}
        {phase.kind === "quickfire" && (
          <div className="dg-qf-veil" style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.55) 0%, rgba(20,18,33,0.86) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(480px, 96%)", textAlign: "center" }}>
              <div className="dg-qf-ring" style={{ ["--qf-s" as string]: `${qfSeconds}s` }} aria-hidden="true" />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 4 }}>{phase.qf.ask || "Schnell!"}</div>
              <div style={{ fontSize: phase.qf.prompt.length > 26 ? 20 : 30, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 14, lineHeight: 1.25 }}>{phase.qf.prompt}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {phase.qf.chips.map((chip) => (
                  <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerQuickfire(chip)}>
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
              {phase.correct ? "Gebannt! ✶" : `Entwischt … → ${phase.answer}`}
            </div>
          </div>
        )}

        {/* DIE RETTUNGSAUFGABE — the calm room behind the last heart (§5.3) */}
        {phase.kind === "rescue" && (() => {
          const task = phase.rescue.tasks[phase.rescue.at]!;
          const n = phase.rescue.tasks.length;
          return (
            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,13,26,0.94)", padding: 14 }}>
              <div style={{ width: "min(520px, 96%)", background: "var(--card)", color: "var(--text)", borderRadius: 20, padding: "22px 24px", border: "2px solid #8b7cf5", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 2 }}>Der Tintengeist hält dich fest …</div>
                <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 14px" }}>
                  Löse {n} Aufgaben in Ruhe — dann bringt er dich zur letzten Fahne zurück. ({Math.min(phase.rescue.solved + 1, n)}/{n})
                </p>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 6 }}>{task.ask}</div>
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 14 }}>{task.prompt}</div>
                {task.presentation === "typed" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (phase.rescue.value.trim() !== "") answerRescue(phase.rescue.value.trim());
                    }}
                    style={{ display: "flex", gap: 8, justifyContent: "center" }}
                  >
                    <input
                      autoFocus
                      value={phase.rescue.value}
                      onChange={(e) => setPhase({ kind: "rescue", rescue: { ...phase.rescue, value: e.target.value } })}
                      placeholder="Schreib das Wort …"
                      data-testid="rescue-input"
                      style={{ flex: 1, maxWidth: 280, fontSize: 18, padding: "10px 14px", borderRadius: 12, border: "2px solid var(--line, #3a3654)", background: "var(--bg, #1b1930)", color: "var(--text)" }}
                    />
                    <button type="submit" className="dg-btn">OK</button>
                  </form>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(task.chips ?? []).map((chip) => (
                      <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerRescue(chip)}>
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                {phase.rescue.verdict === "wrong" && (
                  <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Fast! Probier's gleich nochmal — jetzt mit Auswahl.</p>
                )}
                {phase.rescue.verdict === "right" && (
                  <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Genau! ✶</p>
                )}
              </div>
            </div>
          );
        })()}

        {/* level complete — the fragment returns to the page */}
        {phase.kind === "done" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,18,33,0.9)", padding: 16 }}>
            <div style={{ background: "var(--card)", color: "var(--text)", borderRadius: 20, padding: "22px 26px", textAlign: "center", maxWidth: 400, width: "100%", border: "2px solid #8b7cf5" }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8b7cf5" }}>Fragment gefunden</div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", margin: "6px 0 2px" }}>{fragment}</div>
              <p style={{ fontSize: 15, margin: "10px 0 4px" }}>
                ⬧ {phase.stats.seals} Siegel · ✦ {phase.stats.letters} Buchstaben · {phase.stats.words} Wörter · beste Serie ×{phase.stats.maxCombo}
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                {Math.round(phase.stats.ms / 1000)}s{phase.stats.deaths > 0 ? ` · ${phase.stats.deaths}× gerettet` : " · ohne Rettung!"}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                <a className="dg-btn-secondary" href={props.hubHref} style={{ textDecoration: "none" }}>Zur Schule →</a>
              </div>
            </div>
          </div>
        )}

        <TouchControls pad={padRef.current} hidden={phase.kind !== "run"} />
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
        Pfeiltasten laufen · ↑/Leertaste springen (halten = höher) · X = Federstab · ↓+Sprung fällt durch Plattformen · Kante im Fallen festhalten = Griff
      </p>
    </div>
  );
}

/** Touch controls: run/jump/pogo/down (≥48px targets, pointer-capture safe). */
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
        {btn("Down", "▼", "down", {})}
      </div>
      <div style={{ position: "absolute", right: 10, bottom: 10, display: "flex", gap: 8, zIndex: 6, touchAction: "none" }}>
        {btn("Pogo", "⟠", "pogo", {})}
        {btn("Jump", "⤒", "jump", {})}
      </div>
    </>
  );
}
