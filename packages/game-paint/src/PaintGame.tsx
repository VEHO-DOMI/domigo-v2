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
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE, airModelByName } from "./paint.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";
import type { GameTaskV2 } from "@domigo/content-schema";
import { CardHost } from "./cards/CardHost.tsx";
import { type CardAlign, alignedWrap } from "./cards/CardShell.tsx";
import { initRoute, nextTask, type RouteState, type ServeCtx } from "./cards/routing.ts";

/** The in-game task item — gameTasks@2 (the card kit). Content lives in
 *  chNN.tasks.v2.json; the card renderer is packages/game-paint/src/cards. */
export type GameTaskItem = GameTaskV2;

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
  task: () => { id: string; kind: string } | null;
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
  card: "task" | "finale" | "grant" | "bonuspay" | "ceremony" | "console" | "bonusend";
  attempts: number;
  typed: string;
  /** PB-F1/F2-20: which side of the canvas the card sits on — always AWAY from
   *  the being it is about, so „schau sie an" is physically possible. */
  align: CardAlign;
  ceremony?: { skin: string; classmate?: string };
  bonusend?: { got: number; total: number; timeout: boolean };
}

/** The skin of the being a request is about (a hazard is about no being). */
const skinOfCtx = (ctx: TaskRequest["ctx"]): string | undefined => (ctx.type === "hazard" ? undefined : ctx.skin);
/** The entity id a request is about, when it has one. */
const idOfCtx = (ctx: TaskRequest["ctx"]): string | null => (ctx.type === "hazard" ? null : ctx.id);

const allPhasesOf = (level: PaintLevel): PhaseSpec[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

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

  // ── task routing (scoped playlists: phase → skin → unbound; cards/routing) ──
  const routeRef = useRef<RouteState>(initRoute());
  const pickTask = (use: string, ctx: ServeCtx): GameTaskItem | null => {
    let r = nextTask(tasks, use, ctx, routeRef.current);
    // empty pool → the generic quickfire pool, IN THE SAME SCOPE (a fallback may
    // not smuggle another phase's cards in through the back door). resolvePool
    // already drops to the unbound cards when the skin has none of its own.
    if (!r.task) r = nextTask(tasks, "quickfire", ctx, routeRef.current);
    routeRef.current = r.next;
    return r.task;
  };

  /** F2-20: put the card on the far side of the being it is about. A being on
   *  the left half ⇒ the card docks right, and vice versa; no being (a hazard,
   *  or one already off-screen) ⇒ centred, as before. */
  const alignAwayFrom = (id: string | null): CardAlign => {
    if (id === null) return "center";
    const frac = sceneRef.current?.screenFracOf(id);
    if (frac === undefined || frac === null) return "center";
    return frac < 0.5 ? "right" : "left";
  };

  // ── overlay resolution (defined before the mount effect: the dev harness's
  //    solveTask closes over these, so the finale rule lives in ONE place) ──
  const resolveCorrect = (o: OverlayState): void => {
    // close FIRST: resolveTask may open a follow-up card (ceremony/console)
    // synchronously — a trailing setOverlay(null) would clobber it
    setOverlay(null);
    sceneRef.current?.resolveTask(o.req.ctx);
    // the finale is the last ACT of the chapter: writing HELLO is what earns
    // the console beat, so that card opens only once the child has done it
    if (o.card === "finale") setOverlay({ ...o, item: null, card: "console" });
  };

  const dismissCard = (o: OverlayState): void => {
    if (o.card === "finale") {
      // „Später" on the finale must not eat the chapter's payoff
      setOverlay({ ...o, item: null, card: "console" });
      return;
    }
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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCoarse(window.matchMedia("(pointer: coarse)").matches || new URLSearchParams(window.location.search).has("dpad"));

    // PB-F2 (Fable ruling 1): `?phase=` is the teacher's START door, not a
    // position. Leaving it in the bar made the address contradict the header on
    // film and invited mid-chapter bookmarks that always restart that phase.
    // Keep the entrance, drop the sign once you are through it.
    // PB-F2 (dev only): `?air=<candidate>` runs a jump-feel prototype so the
    // traces in doc 35 can be reproduced by hand. Read BEFORE the param strip.
    const airModel = process.env.NODE_ENV !== "production"
      ? airModelByName(new URLSearchParams(window.location.search).get("air"))
      : undefined;

    const url = new URL(window.location.href);
    if (url.searchParams.has("phase")) {
      url.searchParams.delete("phase");
      window.history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
    }

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
        airModel,
        callbacks: {
          onExit: (next) => handoff(next),
          onLetters: (got, total) => setLetters({ got, total }),
          onTask: (req) => {
            const align = alignAwayFrom(idOfCtx(req.ctx));
            if (req.use === "bonuspay") {
              setOverlay({ req, item: null, card: "bonuspay", attempts: 0, typed: "", align });
              return;
            }
            // the serve context: this phase, and the being that triggered it
            const item = pickTask(req.use, { phase: pid, skin: skinOfCtx(req.ctx) });
            if (!item) { sceneRef.current?.resolveTask(req.ctx); return; } // no pool: never softlock
            setOverlay({ req, item, card: "task", attempts: 0, typed: "", align });
          },
          onPowerup: (grants) => {
            if (!abilitiesRef.current.includes(grants)) abilitiesRef.current = [...abilitiesRef.current, grants];
            setOverlay({ req: { use: "quickfire", ctx: { type: "hazard", hazard: "grant" } }, item: null, card: "grant", attempts: 0, typed: "", align: "center" });
          },
          onCageFreed: (id, skin, classmate, count) => {
            freedRef.current = [...freedRef.current, id];
            setFreedCount(count);
            setOverlay({ req: { use: "rescue", ctx: { type: "cage", id, skin, classmate } }, item: null, card: "ceremony", attempts: 0, typed: "", align: "center", ceremony: { skin, classmate } });
          },
          onGuardianDown: (id, skin) => {
            // F2-24: the chapter's climax is PLAYED, not narrated. The finale
            // card (the child writes HELLO on the board) runs first; its
            // resolution opens the console beat. No finale card in the set ⇒
            // straight to the console — the beat can never softlock.
            const consoleReq: TaskRequest = { use: "boss", ctx: { type: "hazard", hazard: "console" } };
            const align = alignAwayFrom(id);
            const item = pickTask("finale", { phase: pid, skin });
            if (!item) { setOverlay({ req: consoleReq, item: null, card: "console", attempts: 0, typed: "", align }); return; }
            setOverlay({ req: consoleReq, item, card: "finale", attempts: 0, typed: "", align });
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
            attempts: 0, typed: "", align: "center", bonusend: { got: bs?.got ?? 0, total: bs?.total ?? 12, timeout: next === "bonus-timeout" },
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
          return o?.item ? { id: o.item.id, kind: o.item.kind } : null;
        },
        solveTask: () => {
          const o = overlayRef.current;
          if (!o) return false;
          if ((o.card === "task" || o.card === "finale") && o.item) { resolveCorrect(o); return true; }
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

  // task grading now lives in the card machines (cards/) — CardHost calls
  // resolveCorrect on a correct answer and dismissCard on „Später".
  const restart = (): void => window.location.reload();
  const inBonus = level.bonus !== undefined && phaseId === level.bonus.id;

  return (
    <div style={{ maxWidth: LOGICAL_W * RENDER_SCALE, margin: "0 auto", fontFamily: "system-ui, sans-serif", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 2px" }}>
        <strong style={{ fontSize: 15 }}>🖌 {phaseName}</strong>
        {/* F2-33: every number on this bar says what it counts, and a counter
            with nothing to count (the arena collects no letters) is not shown */}
        <span style={{ fontSize: 14 }}>
          {freedCount > 0 && <span style={{ marginRight: 12 }}>🔓 Befreit: {freedCount}/6</span>}
          {knots > 0 && <span style={{ marginRight: 12 }}>🪢 Knoten: {knots}</span>}
          {inBonus && bonusLeft >= 0 && <span style={{ marginRight: 12 }}>⏱ {Math.ceil(bonusLeft / 60)}s</span>}
          {letters.total > 0 && <span>✨ {level.collectNounDe}: {letters.got}/{letters.total}</span>}
        </span>
      </div>
      {fatal !== null && (
        <div style={{ background: "#c0392b", color: "#fff", padding: "8px 12px", borderRadius: 8, marginBottom: 6 }}>⚠ {fatal}</div>
      )}
      <div style={{ position: "relative" }}>
        <div ref={hostRef} style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 14px rgba(30,20,10,0.25)" }} />
        {overlay && <Overlay o={overlay} onResolve={resolveCorrect} onDismiss={dismissCard} onPay={payBonus} letters={letters.got} />}
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
  o, onResolve, onDismiss, onPay, letters,
}: {
  o: OverlayState;
  onResolve: (o: OverlayState) => void;
  onDismiss: (o: OverlayState) => void;
  onPay: () => void;
  letters: number;
}): React.ReactElement {
  const wrap: React.CSSProperties = { ...alignedWrap(o.align), background: "rgba(30, 24, 12, 0.35)" };
  const card: React.CSSProperties = {
    background: "#fdf7e6", border: "2px solid #c9a36a", borderRadius: 14, padding: "18px 22px",
    maxWidth: 440, width: o.align === "center" ? "88%" : "46%", minWidth: 300,
    boxShadow: "0 6px 30px rgba(30,20,10,0.35)", textAlign: "center",
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
        {/* F2-24: the child WROTE the word on the finale card — this beat now
            answers that act instead of narrating it in their place */}
        <p style={{ fontSize: 16, margin: "0 0 4px" }}>Niemand hat je etwas <em>Nettes</em> auf sie geschrieben.</p>
        <p style={{ fontSize: 16, margin: "0 0 10px" }}>Jetzt steht dein Wort da — und die Tafel blüht sonnengelb auf. Sie kommt mit ins Lager!</p>
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

  // ── the task card — the v2 card kit (machines + painted skins) ──
  // key by task id so CardHost re-mounts (fresh machine state) per task.
  return <CardHost key={o.item!.id} task={o.item!} align={o.align} onResolve={() => onResolve(o)} onDismiss={() => onDismiss(o)} />;
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
