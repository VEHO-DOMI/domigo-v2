"use client";
/**
 * PaintGame — the React shell around PaintScene: mounts Phaser, owns phase
 * HANDOFFS (P-49: scene switches never happen inside a game step), owns the
 * TASK OVERLAY (the learning layer — the world freezes while a task is up),
 * owns chapter state that must outlive phase mounts (granted abilities, freed
 * cages, the bonus-room return), and exposes the dev harness.
 */
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { bindTypingGuard } from "@domigo/game-feel/typing-guard";
import { PaintScene, type TaskRequest } from "./PaintScene.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE } from "./paint.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";

/** gameTasks@1 item (the proven shape; content lives in chNN.tasks.json). */
export interface GameTaskItem {
  id: string;
  use: string;
  kind: "choice" | "typed";
  storyDe: string;
  promptEn: string;
  options?: string[];
  answer: string;
  hints: { deDesc?: string; deWord?: string; firstLetter?: string; length?: number };
  grounding?: string;
}

export interface PaintGameProps {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: GameTaskItem[];
  hubHref: string;
  buildSha?: string;
  startPhase?: string;
}

interface HarnessApi {
  press: (p: Partial<Pad>) => void;
  step: (ms?: number) => void;
  rafStep: (t?: number) => void;
  state: () => unknown;
  phase: () => string;
  warp: (c: number, r: number) => void;
  task: () => { id: string; answer: string } | null;
  solveTask: () => boolean;
  /** dev-only: typing-guard probes (the game-2d harness precedent) */
  game: Phaser.Game;
}

declare global {
  interface Window {
    __domigoPaint?: HarnessApi;
  }
}

interface OverlayState {
  req: TaskRequest;
  item: GameTaskItem | null; // null = a card without a task (powerup/pay/ceremony)
  card: "task" | "grant" | "bonuspay" | "ceremony" | "console" | "bonusend";
  attempts: number;
  typed: string;
  ceremony?: { skin: string; classmate?: string };
  bonusend?: { got: number; total: number; timeout: boolean };
}

const allPhasesOf = (level: PaintLevel): PhaseSpec[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/** deterministic option shuffle (no Math.random — the repo law). */
const shuffled = (opts: string[], seed: string): string[] => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  const out = [...opts];
  for (let i = out.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

export default function PaintGame({ level, art, tasks, hubHref, buildSha, startPhase }: PaintGameProps): React.ReactElement {
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
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [bonusLeft, setBonusLeft] = useState(-1);
  const [knots, setKnots] = useState(-1);

  // ── chapter state that OUTLIVES phase mounts (refs: read by scene closures) ──
  const grantSet = new Set(
    allPhasesOf(level).flatMap((p) => p.entities.filter((e) => e.role === "powerup").map((e) => String(e.params?.grants ?? ""))),
  );
  // normal play: grant-gated abilities wait for their powerup; the teacher
  // debug door (startPhase) mounts mid-chapter, so it starts fully granted
  const abilitiesRef = useRef<string[]>(
    startPhase !== undefined ? [...level.abilities] : level.abilities.filter((a) => !grantSet.has(a)),
  );
  const freedRef = useRef<string[]>([]);
  const bonusReturnRef = useRef<string | null>(null);
  const [freedCount, setFreedCount] = useState(0);
  const overlayRef = useRef<OverlayState | null>(null);
  overlayRef.current = overlay;
  const mountPhaseRef = useRef<((pid: string) => void) | null>(null);

  // ── task pools with per-use rotation (no immediate repeats) ──
  const poolIdx = useRef<Record<string, number>>({});
  const pickTask = (use: string): GameTaskItem | null => {
    const pool = tasks.filter((t) => t.use === use);
    if (pool.length === 0) return null;
    const i = poolIdx.current[use] ?? 0;
    poolIdx.current[use] = i + 1;
    return pool[i % pool.length]!;
  };

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
      pixelArt: false,
      antialias: true,
      roundPixels: false,
      fps: { target: 60, min: 30 },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;
    // THE TYPING-MODE LAW (shared, game-feel): while a task card's input has
    // focus, Phaser's window-level key capture is released so W/A/S/D/SPACE
    // reach the field instead of steering the hero (the "school book" softlock)
    const unbindTyping = bindTypingGuard(game);

    const mountPhase = (pid: string): void => {
      mountPhaseRef.current = mountPhase;
      const phase = allPhasesOf(level).find((p) => p.id === pid);
      const scene = new PaintScene({
        level,
        phaseId: pid,
        art,
        pad: padRef.current,
        reducedMotion,
        grantedAbilities: () => abilitiesRef.current,
        freedCageIds: () => freedRef.current,
        callbacks: {
          onExit: (next) => handoff(next),
          onLetters: (got, total) => setLetters({ got, total }),
          onTask: (req) => {
            if (req.use === "bonuspay") {
              setOverlay({ req, item: null, card: "bonuspay", attempts: 0, typed: "" });
              return;
            }
            const item = pickTask(req.use) ?? pickTask("quickfire");
            if (!item) { sceneRef.current?.resolveTask(req.ctx); return; } // no pool: never softlock
            setOverlay({ req, item, card: "task", attempts: 0, typed: "" });
          },
          onPowerup: (grants) => {
            if (!abilitiesRef.current.includes(grants)) abilitiesRef.current = [...abilitiesRef.current, grants];
            setOverlay({ req: { use: "quickfire", ctx: { type: "hazard", hazard: "grant" } }, item: null, card: "grant", attempts: 0, typed: "" });
          },
          onCageFreed: (id, skin, classmate, count) => {
            freedRef.current = [...freedRef.current, id];
            setFreedCount(count);
            setOverlay({ req: { use: "rescue", ctx: { type: "cage", id, skin, classmate } }, item: null, card: "ceremony", attempts: 0, typed: "", ceremony: { skin, classmate } });
          },
          onGuardianDown: () => {
            setOverlay({ req: { use: "boss", ctx: { type: "hazard", hazard: "console" } }, item: null, card: "console", attempts: 0, typed: "" });
          },
        },
      });
      sceneRef.current = scene;
      const name = phase?.nameDe ?? pid;
      setPhaseName(name);
      setPhaseId(pid);
      game.scene.add("paint", scene, true);
    };

    const handoff = (next: string): void => {
      // P-49: NEVER from inside a step — defer, swap, and watchdog the swap.
      window.setTimeout(() => {
        let target = next;
        if (next === "boss") target = level.arena?.id ?? "done";
        if (next === "bonus-timeout" || (level.bonus && next === level.bonus.exit.to && sceneRef.current?.getState()?.phase === level.bonus.id)) {
          // leaving the Kleckskammer (timeout or its exit): show the end card, return
          const bs = sceneRef.current?.bonusState();
          setOverlay({
            req: { use: "bonus", ctx: { type: "hazard", hazard: "bonus" } }, item: null, card: "bonusend",
            attempts: 0, typed: "", bonusend: { got: bs?.got ?? 0, total: bs?.total ?? 12, timeout: next === "bonus-timeout" },
          });
          target = bonusReturnRef.current ?? level.phases[0]!.id;
          bonusReturnRef.current = null;
        }
        if (target === "done") {
          game.scene.stop("paint");
          setDone(true);
          return;
        }
        game.scene.stop("paint");
        game.scene.remove("paint");
        mountPhase(target);
        window.setTimeout(() => {
          if (!game.scene.isActive("paint")) {
            setFatal(`Phasen-Wechsel nach ${target} hängt (Szene nie gestartet) — bitte neu laden.`);
          }
        }, 2500);
      }, 0);
    };

    mountPhaseRef.current = mountPhase;
    mountPhase(firstPhase);

    const poll = window.setInterval(() => {
      const st = sceneRef.current?.getState();
      if (!st) return;
      setBonusLeft(st.bonusLeft);
      setKnots(st.knots);
    }, 250);

    if (process.env.NODE_ENV !== "production") {
      window.__domigoPaint = {
        game, // dev-only: typing-guard probes
        press: (p) => {
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
        phase: () => sceneRef.current?.getState()?.phase ?? "",
        warp: (c, r) => sceneRef.current?.warp(c, r),
        task: () => {
          const o = overlayRef.current;
          return o?.item ? { id: o.item.id, answer: o.item.answer } : null;
        },
        solveTask: () => {
          const o = overlayRef.current;
          if (!o) return false;
          if (o.card === "task" && o.item) { setOverlay(null); sceneRef.current?.resolveTask(o.req.ctx); return true; }
          if (o.card === "bonuspay") { sceneRef.current?.setOverlay(false); setOverlay(null); return true; }
          sceneRef.current?.setOverlay(false);
          setOverlay(null);
          return true;
        },
      };
    }

    return () => {
      if (process.env.NODE_ENV !== "production") delete window.__domigoPaint;
      window.clearInterval(poll);
      unbindTyping();
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one game per mount
  }, []);

  // ── overlay resolution ──
  const resolveCorrect = (o: OverlayState): void => {
    // close FIRST: resolveTask may open a follow-up card (ceremony/console)
    // synchronously — a trailing setOverlay(null) would clobber it
    setOverlay(null);
    sceneRef.current?.resolveTask(o.req.ctx);
  };

  const dismissCard = (o: OverlayState): void => {
    if (o.card === "task") {
      // the anti-softlock law (PB-T1): every task card can be put down —
      // dismissal resumes the world with no reward and no redeem
      setOverlay(null);
      sceneRef.current?.dismissTask(o.req.ctx);
      return;
    }
    sceneRef.current?.setOverlay(false);
    setOverlay(null);
  };

  const payBonus = (): void => {
    const scene = sceneRef.current;
    const game = gameRef.current;
    if (!scene || !game || !level.bonus) return;
    if (!scene.spendLetters(10)) return;
    bonusReturnRef.current = phaseId;
    setOverlay(null);
    // P-49: enter the Kleckskammer through the same deferred swap as any handoff
    window.setTimeout(() => {
      game.scene.stop("paint");
      game.scene.remove("paint");
      mountPhaseRef.current?.(level.bonus!.id);
    }, 0);
  };

  const submitChoice = (o: OverlayState, choice: string): void => {
    if (!o.item) return;
    if (choice === o.item.answer) resolveCorrect(o);
    else setOverlay({ ...o, attempts: o.attempts + 1 });
  };

  // the blind-solve class fix: a child typing "schoolbag" or "a pencil" is
  // RIGHT — normalize articles and spacing on both sides before comparing
  const normTyped = (v: string): string =>
    v.trim().toLowerCase().replace(/^(a|an|the)\s+/, "").replace(/\s+/g, "");

  const submitTyped = (o: OverlayState): void => {
    if (!o.item) return;
    if (normTyped(o.typed) === normTyped(o.item.answer)) resolveCorrect(o);
    else setOverlay({ ...o, attempts: o.attempts + 1, typed: "" });
  };

  const restart = (): void => window.location.reload();
  const inBonus = level.bonus !== undefined && phaseId === level.bonus.id;

  return (
    <div style={{ maxWidth: LOGICAL_W * RENDER_SCALE, margin: "0 auto", fontFamily: "system-ui, sans-serif", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 2px" }}>
        <strong style={{ fontSize: 15 }}>🖌 {phaseName}</strong>
        <span style={{ fontSize: 14 }}>
          {freedCount > 0 && <span style={{ marginRight: 12 }}>🔓 {freedCount}/6</span>}
          {knots > 0 && <span style={{ marginRight: 12 }}>🪢 {knots}</span>}
          {inBonus && bonusLeft >= 0 && <span style={{ marginRight: 12 }}>⏱ {Math.ceil(bonusLeft / 60)}s</span>}
          ✨ {level.collectNounDe}: {letters.got}/{letters.total}
        </span>
      </div>
      {fatal !== null && (
        <div style={{ background: "#c0392b", color: "#fff", padding: "8px 12px", borderRadius: 8, marginBottom: 6 }}>⚠ {fatal}</div>
      )}
      <div style={{ position: "relative" }}>
        <div ref={hostRef} style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 14px rgba(30,20,10,0.25)" }} />
        {overlay && <Overlay o={overlay} onChoice={submitChoice} onTyped={submitTyped} onType={(v) => setOverlay({ ...overlay, typed: v })} onDismiss={dismissCard} onPay={payBonus} letters={letters.got} />}
      </div>
      {done && (
        <div style={{ background: "#fdf7e6", border: "2px solid #e0a92a", borderRadius: 10, padding: 14, marginTop: 8, textAlign: "center" }}>
          <p style={{ fontSize: 17, margin: "2px 0 8px" }}>
            🎉 Kapitel 1 geschafft! Die Buchstaben fliegen zurück auf die Tafel — und {freedCount} von 6 Käfigen sind offen.
          </p>
          <button onClick={restart} style={btn}>↻ Noch einmal</button>
          <a href={hubHref} style={{ ...btn, marginLeft: 10, textDecoration: "none", display: "inline-block" }}>← Zurück</a>
        </div>
      )}
      {coarse && !done && <TouchPad pad={padRef.current} />}
      <p style={{ fontSize: 12, color: "#8a8066", textAlign: "center", marginTop: 6 }}>
        ←→ laufen · SPACE springen (halten = höher) · X Faust (halten = laden) · ↑↓ klettern
        {buildSha ? ` · Build ${buildSha.slice(0, 7)}` : ""}
      </p>
    </div>
  );
}

// ── the overlay card ──────────────────────────────────────────────────────────

function Overlay({
  o, onChoice, onTyped, onType, onDismiss, onPay, letters,
}: {
  o: OverlayState;
  onChoice: (o: OverlayState, choice: string) => void;
  onTyped: (o: OverlayState) => void;
  onType: (v: string) => void;
  onDismiss: (o: OverlayState) => void;
  onPay: () => void;
  letters: number;
}): React.ReactElement {
  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(30, 24, 12, 0.35)", zIndex: 10,
  };
  const card: React.CSSProperties = {
    background: "#fdf7e6", border: "2px solid #c9a36a", borderRadius: 14, padding: "18px 22px",
    maxWidth: 440, width: "88%", boxShadow: "0 6px 30px rgba(30,20,10,0.35)", textAlign: "center",
  };

  if (o.card === "grant") {
    return (
      <div style={wrap}><div style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>📖✨</p>
        <p style={{ fontSize: 17, margin: "0 0 4px" }}><strong>Fibel</strong> schenkt dir die <strong>FAUST</strong>!</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Halte <strong>X</strong> zum Laden — wirf sie auf Knoten und Kreide!</p>
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }
  if (o.card === "bonuspay") {
    const can = letters >= 10;
    return (
      <div style={wrap}><div style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>🖤</p>
        <p style={{ fontSize: 16, margin: "0 0 4px" }}><strong>Klecks</strong> grinst: „10 Buchstaben, und die Tür ist deine. Drinnen warten 12 — schaffst du alle, bevor die Tinte trocknet?"</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Du hast {letters} ✨ — {can ? "bezahlen?" : "sammle erst 10!"}</p>
        {can && <button style={btn} onClick={onPay}>10 zahlen & rein</button>}
        <button style={{ ...btn, marginLeft: can ? 10 : 0 }} onClick={() => onDismiss(o)}>Später</button>
      </div></div>
    );
  }
  if (o.card === "ceremony") {
    const merle = o.ceremony?.classmate === "merle";
    return (
      <div style={wrap}><div style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>{merle ? "🎒" : "🔤"}</p>
        {merle ? (
          <>
            <p style={{ fontSize: 17, margin: "0 0 2px" }}><strong>Merle</strong> hüpft aus der Federtasche!</p>
            <p style={{ fontSize: 16, margin: "0 0 2px" }}>„Hello! I'm Merle. Thanks!"</p>
            <p style={{ fontSize: 13, color: "#6b6250", margin: "0 0 10px" }}>(Hallo! Ich bin Merle. Danke!) — Sie läuft schon Richtung Lager.</p>
          </>
        ) : (
          <p style={{ fontSize: 16, margin: "0 0 10px" }}>Ein Buchstaben-Wesen flattert frei und dreht eine Freudenrunde! ✨</p>
        )}
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }
  if (o.card === "console") {
    return (
      <div style={wrap}><div style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>🖼</p>
        <p style={{ fontSize: 16, margin: "0 0 4px" }}>Die Tafel weint Kreide-Tränen… niemand hat je etwas <em>Nettes</em> auf sie geschrieben.</p>
        <p style={{ fontSize: 16, margin: "0 0 10px" }}>Du schreibst: <strong style={{ color: "#c9a12a" }}>HELLO :)</strong> — und die Tafel blüht sonnengelb auf. Sie kommt mit ins Lager!</p>
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }
  if (o.card === "bonusend") {
    const b = o.bonusend!;
    const perfect = b.got >= b.total;
    return (
      <div style={wrap}><div style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>{perfect ? "🏵" : "🖤"}</p>
        <p style={{ fontSize: 16, margin: "0 0 10px" }}>
          {perfect
            ? `PERFEKT! Alle ${b.total} Buchstaben — Klecks stempelt dir einen Sticker auf die Karte!`
            : b.timeout
              ? `Die Tinte ist getrocknet — ${b.got} von ${b.total}. Klecks zwinkert: „Komm wieder!"`
              : `${b.got} von ${b.total} — Klecks zwinkert: „Fast! Komm wieder!"`}
        </p>
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }

  // ── the task card ──
  const item = o.item!;
  const showDesc = o.attempts >= 1 && item.hints.deDesc;
  const showWord = o.attempts >= 2 && item.hints.deWord;
  return (
    <div style={wrap}><div style={card}>
      <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 6px" }}>{item.storyDe}</p>
      <p style={{ fontSize: 19, fontWeight: 700, margin: "0 0 12px" }}>{item.promptEn}</p>
      {item.kind === "choice" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {shuffled(item.options ?? [], item.id).map((opt) => (
            <button key={opt} style={{ ...btn, fontSize: 16 }} onClick={() => onChoice(o, opt)}>{opt}</button>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <input
            autoFocus
            value={o.typed}
            onChange={(e) => onType(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onTyped(o); }}
            style={{ fontSize: 16, padding: "8px 10px", borderRadius: 8, border: "1px solid #c9a36a", width: 180 }}
            placeholder={item.hints.firstLetter ? `${item.hints.firstLetter}…` : "…"}
          />
          <button style={btn} onClick={() => onTyped(o)}>OK</button>
        </div>
      )}
      {o.attempts > 0 && (
        <p style={{ fontSize: 13, color: "#8a5a2b", margin: "10px 0 0" }}>
          {showDesc && <>💡 {item.hints.deDesc}<br /></>}
          {showWord && <>📖 {item.hints.deWord}</>}
          {item.kind === "typed" && o.attempts >= 2 && item.hints.length !== undefined && (
            <> · {item.hints.firstLetter?.toUpperCase()}… ({item.hints.length} Buchstaben)</>
          )}
        </p>
      )}
      <button
        style={{ ...btn, marginTop: 14, fontSize: 13, background: "transparent", border: "1px solid #d8c9a0", color: "#8a7a58" }}
        onClick={() => onDismiss(o)}
      >
        Später ↩
      </button>
    </div></div>
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
        <button aria-label="klettern" style={zone} {...bind("up")}>↑</button>
        <button aria-label="Faust" style={zone} {...bind("punch")}>✊</button>
        <button aria-label="springen" style={{ ...zone, width: 84 }} {...bind("jump")}>⤒</button>
      </div>
    </div>
  );
}
