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
import { ARCADE, displayChips, gradeStoryAnswer, quickfireFor, rescuePlan, rescueScaffold, type ArcadeLevel, type GameTaskHints, type Quickfire, type RescueTask, type StoryTaskPack, type Tier } from "./arcade.ts";
import { bindTypingGuard } from "@domigo/game-feel/typing-guard";
import { requestGameFullscreen } from "./fullscreen.ts";
import { BossScene } from "./BossScene.ts";
import { bossPlan, type BossScript } from "./boss.ts";
import { DEFAULT_LEVEL_ID, LEVELS } from "./levels.ts";
import type { AttemptFn } from "./PhaserGame.tsx";

export interface ArcadeGameProps {
  seed: number;
  playerSeed?: number;
  /** Attempt mode ("game:g1") — quickfire + rescue answers are REAL attempts. */
  mode: string;
  items: ResolvedItem[];
  /** THE STORY-TASK LAW (doc 29 §4): when present, ALL in-run tasks come from
   *  this hand-authored pack — the imported unit pool is never touched. */
  storyTasks?: StoryTaskPack;
  onAttempt: AttemptFn;
  hubHref: string;
  /** Level + tier (dev knobs; production picks per SRS mastery later). */
  levelId?: string;
  tier?: Tier;
  /** v2.1: a content-loaded level overrides the built-in LEVELS registry. */
  level?: ArcadeLevel;
  /** v2.1: the chapter guardian — present ⇒ the level's 'B' door hands over
   *  to the duel (bible 27 §2b). */
  boss?: BossScript;
  /** where the done overlay links (defaults to hubHref) — the world map
   *  passes ?done=chNN to trigger the restoration beat. */
  doneHref?: string;
  /** v5.3 teacher preview: boot straight into the guardian duel — the page
   *  only sets this for TEACHER sessions (never reachable by students). */
  bossOnly?: boolean;
  /** doc 28 §5: generated-art stem→URL map (chapter + hero + accessories);
   *  every missing stem keeps its procedural fallback. */
  art?: Record<string, string>;
  /** fires ONCE when the run ends — the client banks Glühwörter → Funken. */
  onDone?: (stats: { gluehwoerter: number; letters: number; seals: number; deaths: number; bossWon: boolean }) => void;
}

type RescueState = {
  tasks: RescueTask[];
  at: number;
  solved: number;
  /** typed input value for the current task */
  value: string;
  verdict: "none" | "right" | "wrong";
};

type DoneStats = { ms: number; maxCombo: number; letters: number; words: number; seals: number; deaths: number; gluehwoerter: number; bossWon: boolean };

type Phase =
  | { kind: "run" }
  | { kind: "quickfire"; qf: Quickfire; deadline: number }
  | { kind: "sealTask"; task: RescueTask; value: string; verdict: "none" | "wrong" | "right"; solve: () => void; cancel: () => void }
  | { kind: "battle"; task: RescueTask; value: string; verdict: "none" | "wrong" | "right"; scaffolded: boolean }
  | { kind: "swarm"; chain: Quickfire[]; at: number; solved: number; verdict: "none" | "wrong" | "right"; solve: () => void }
  | { kind: "colorroom"; task: RescueTask; stage: "name" | "colour"; value: string; verdict: "none" | "wrong" | "right"; solve: () => void; cancel: () => void }
  | { kind: "duelRound"; at: number; verdict: "none" | "wrong" | "right"; solve: () => void; cancel: () => void }
  | { kind: "finale"; at: number; verdict: "none" | "wrong" | "right"; stats: DoneStats }
  | { kind: "verdict"; correct: boolean; answer: string }
  | { kind: "rescue"; rescue: RescueState }
  | { kind: "bossIntro" }
  | { kind: "bossWindow"; task: RescueTask; deadline: number; value: string; verdict: "none" | "right" | "wrong" }
  | { kind: "done"; stats: DoneStats };

/** Story-task scaffold-down: typed → chips built from sibling answers. */
function storyScaffold(task: RescueTask, siblings: RescueTask[]): RescueTask {
  const others = siblings.map((s) => s.answer).filter((a) => a !== task.answer).slice(0, 2);
  const chips = [task.answer, ...others].sort((a, b) => (a + task.itemId < b + task.itemId ? -1 : 1));
  return { ...task, presentation: "chips", chips };
}

/** THE HINT LADDER (WS-HINT, doc 29 §4.5): staged reveals — typed tasks walk
 *  first letter → length → German description → German word; choice tasks the
 *  last two. Rendered only on story tasks (they carry `hints`). */
function HintLadder({ hints, typed, sparks, onSpendSpark, onPrefill }: { hints: GameTaskHints; typed: boolean; sparks?: number; onSpendSpark?: () => void; onPrefill?: (v: string) => void }) {
  const [step, setStep] = useState(0);
  // v5.2 (Koki's spec): tip 1 on a TYPED task puts the first letter INTO the
  // input field and shows one BIG readable pattern line ("s _ _ _ _") — the
  // old cramped "S the book"-style lines were unreadable.
  const pattern = typed && hints.firstLetter !== undefined && hints.length !== undefined
    ? `${hints.firstLetter} ${Array.from({ length: Math.max(0, hints.length - 1) }, () => "_").join(" ")}`
    : null;
  const steps: Array<{ text: string; big?: boolean; act?: () => void }> = typed
    ? [
        { text: pattern ?? hints.deDesc, big: pattern !== null, act: () => { if (hints.firstLetter !== undefined) onPrefill?.(hints.firstLetter); } },
        { text: hints.deDesc },
        { text: `Auf Deutsch: ${hints.deWord}` },
      ]
    : [{ text: hints.deDesc }, { text: `Auf Deutsch: ${hints.deWord}` }];
  return (
    <div style={{ marginTop: 10 }}>
      {steps.slice(0, step).map((s, i) => (
        s.big === true
          ? <div key={i} style={{ fontFamily: "ui-monospace, monospace", fontSize: 24, fontWeight: 800, letterSpacing: "0.2em", color: "#ffe082", margin: "6px 0" }}>{s.text}</div>
          : <div key={i} style={{ fontSize: 14, color: "var(--text-secondary)", margin: "3px 0" }}>💡 {s.text}</div>
      ))}
      {step < steps.length && (() => {
        // v5 W0: the first tip is free; every further one SPENDS a collected
        // Glühbuchstabe when there is one (never blocks — pedagogy first)
        const willSpend = step >= 1 && (sparks ?? 0) > 0 && onSpendSpark !== undefined;
        return (
          <button type="button" className="dg-btn-secondary" style={{ fontSize: 13, padding: "4px 12px" }} onClick={() => { if (willSpend) onSpendSpark(); steps[step]?.act?.(); setStep(step + 1); }}>
            Tipp {step + 1}/{steps.length}{willSpend ? " · ✺" : ""}
          </button>
        );
      })()}
    </div>
  );
}

/** v5.1 DAS ZAHLEN-RAD (Koki's spec: the iPhone-alarm dial) — the swarm's
 *  answer is picked by SCROLLING a wheel of all the unit's numbers (digits or
 *  words, matching what the task asks for) and locking it in. The right
 *  answer sits at its natural position on the dial, never at a fixed slot. */
const WHEEL_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five"];
const WHEEL_ITEM_H = 44;

function NumberWheel({ options, onLock }: { options: string[]; onLock: (v: string) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(Math.floor(options.length / 2));
  // The highlight is IMPERATIVE (native scroll listener + direct styles):
  // React's synthetic onScroll proved unreliable inside the game overlay, and
  // fast dial-spinning shouldn't re-render React 25× a second anyway.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const paint = (): void => {
      const i = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / WHEEL_ITEM_H)));
      idxRef.current = i;
      for (let k = 0; k < el.children.length; k += 1) {
        const d = el.children[k] as HTMLElement;
        d.style.fontSize = k === i ? "27px" : "18px";
        d.style.color = k === i ? "#ffe066" : "#8f8ab0";
      }
    };
    el.scrollTop = idxRef.current * WHEEL_ITEM_H;
    paint();
    el.addEventListener("scroll", paint, { passive: true });
    return () => el.removeEventListener("scroll", paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", height: WHEEL_ITEM_H * 5, width: 230, overflow: "hidden", borderRadius: 14, background: "#141221", border: "2px solid #3a3654" }}>
        <div ref={listRef} data-testid="number-wheel" style={{ height: "100%", overflowY: "scroll", scrollSnapType: "y mandatory", paddingTop: WHEEL_ITEM_H * 2, paddingBottom: WHEEL_ITEM_H * 2, scrollbarWidth: "none" }}>
          {options.map((o, i) => (
            <div
              key={o}
              onClick={() => listRef.current?.scrollTo({ top: i * WHEEL_ITEM_H, behavior: "smooth" })}
              style={{ height: WHEEL_ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", scrollSnapAlign: "center", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#8f8ab0", transition: "font-size 120ms, color 120ms" }}
            >
              {o}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", top: WHEEL_ITEM_H * 2, left: 8, right: 8, height: WHEEL_ITEM_H, border: "2px solid #8b7cf5", borderRadius: 10, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: WHEEL_ITEM_H * 1.6, background: "linear-gradient(#141221, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: WHEEL_ITEM_H * 1.6, background: "linear-gradient(transparent, #141221)", pointerEvents: "none" }} />
      </div>
      <button type="button" className="dg-btn" data-testid="wheel-lock" onClick={() => { const v = options[idxRef.current]; if (v !== undefined) onLock(v); }}>
        Einloggen!
      </button>
    </div>
  );
}

export function ArcadeGame(props: ArcadeGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ArcadeScene | null>(null);
  const bossRef = useRef<BossScene | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const bossActiveRef = useRef(false);
  const bossTasksRef = useRef<RescueTask[]>([]);
  const bossAtRef = useRef(0);
  const bossDeathsRef = useRef(0);
  const carryRef = useRef<{ hearts: number; letters: number; gluehwoerter: number; words: number; maxCombo: number; seals: number; deaths: number; ms: number } | null>(null);
  const doneSentRef = useRef(false);
  const padRef = useRef<ArcadePad>({ left: false, right: false, up: false, down: false, jump: false, pogo: false, swing: false });
  const [phase, setPhase] = useState<Phase>({ kind: "run" });
  const phaseRef = useRef<Phase>({ kind: "run" });
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  const [hearts, setHearts] = useState(3);
  const [letters, setLetters] = useState(0);
  const [gluehwoerter, setGluehwoerter] = useState(0);
  // v5 W0: "+1 Gratis-Tipp" toast — the pickup must SAY what it just gave
  const [tipToastAt, setTipToastAt] = useState<number | null>(null);
  useEffect(() => {
    if (tipToastAt === null) return;
    const t = window.setTimeout(() => setTipToastAt(null), 1900);
    return () => window.clearTimeout(t);
  }, [tipToastAt]);
  const [combo, setCombo] = useState(0);
  const [seals, setSeals] = useState<[number, number]>([0, 0]);
  const [knots, setKnots] = useState<[number, number] | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  // v2.2: the goal card — every level opens by SAYING what to do (the
  // "take the student by the hand" law); the world stands still behind it
  const [goalOpen, setGoalOpen] = useState(true);
  // v5.2: ALWAYS-ON crash banner — Koki's prod boss-handoff black screen gave
  // ZERO signal because this was dev-gated. A visible one-line error beats a
  // silent black canvas on every surface, prod included (teacher-preview only
  // reaches this route pre-release anyway).
  const [fatal, setFatal] = useState<string | null>(null);
  useEffect(() => {
    const onErr = (e: ErrorEvent) => setFatal(`${e.message} @ ${e.filename?.split("/").pop()}:${e.lineno}`);
    const onRej = (e: PromiseRejectionEvent) => setFatal(String(e.reason));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => { window.removeEventListener("error", onErr); window.removeEventListener("unhandledrejection", onRej); };
  }, []);
  const entry = LEVELS[props.levelId ?? DEFAULT_LEVEL_ID] ?? LEVELS[DEFAULT_LEVEL_ID]!;
  const level = props.level ?? entry.level;
  const tier: Tier = props.tier ?? entry.defaultTier;
  const qfSeconds = ARCADE.quickfireSeconds[tier];
  const artUrl = (stem?: string): string | undefined => (stem !== undefined ? props.art?.[stem] : undefined);
  const sealNoun = level.header.sealNounDe ?? "Siegel"; // per-unit lock naming (doc 30 §5)
  const timerRef = useRef<number | null>(null);
  const fragment = level.header.fragment;

  const finish = (stats: DoneStats): void => {
    // v4 (doc 30 §3): the dialogue finale is the unit's communicative wrap-up —
    // it plays between the won duel and the done overlay
    if (stats.bossWon && (props.storyTasks?.finale.length ?? 0) > 0) {
      setPhase({ kind: "finale", at: 0, verdict: "none", stats });
    } else {
      setPhase({ kind: "done", stats });
    }
    if (!doneSentRef.current) {
      doneSentRef.current = true;
      props.onDone?.({ gluehwoerter: stats.gluehwoerter, letters: stats.letters, seals: stats.seals, deaths: stats.deaths, bossWon: stats.bossWon });
    }
  };

  /** The next unsolved counter-window task (retries stay in place, §2b). */
  const currentBossTask = (): RescueTask => {
    const t = bossTasksRef.current[bossAtRef.current];
    if (t) return t;
    bossAtRef.current = 0; // more windows than tasks: wrap (thin pools)
    return bossTasksRef.current[0]!;
  };

  /** The 'B' door opened — swap the level scene for the duel arena. */
  const enterBoss = (carry: NonNullable<typeof carryRef.current>): void => {
    const script = props.boss;
    const game = gameRef.current;
    if (!script || !game) return;
    carryRef.current = carry;
    bossActiveRef.current = true;
    const st = props.storyTasks;
    if (st && st.boss.length > 0) {
      // v5.3 (Koki's verdict): boss windows are NEVER carbon copies of the
      // level pools — the hand-authored boss set (the Schlinger's own knots,
      // lies and gaps) is the PRIMARY source, in authored order. The modality
      // composition below stays as the fallback for chapters without one.
      bossTasksRef.current = Array.from({ length: script.knots * 2 }, (_, i) => st.boss[i % st.boss.length]!);
    } else if (st && (st.battle.length + st.swarm.length + st.colorroom.length + st.duel.length) > 0) {
      // v4 COMPOSITION (doc 30 §3): each counter-window plays a DIFFERENT
      // modality of the level — battle name, swarm pair, colour, command
      const comp: RescueTask[] = [];
      const toChips = (qf: Quickfire): RescueTask => ({ itemId: qf.itemId, kind: "vocab", presentation: "chips", ask: qf.ask, prompt: qf.prompt, pool: null, chips: qf.chips, answer: qf.answer, hints: qf.hints, art: qf.art });
      const colourAsk = (r: RescueTask): RescueTask => r.colour ? { ...r, presentation: "chips", prompt: r.colour.promptEn, chips: r.colour.options, answer: r.colour.answer, art: r.art !== undefined ? `${r.art}_color` : undefined } : r;
      for (let i = 0; i < script.knots * 2; i += 1) {
        const lane = i % 4;
        if (lane === 0 && st.battle.length > 0) { const b = st.battle[(i >> 2) % st.battle.length]!; comp.push({ ...b, art: b.art !== undefined ? `${b.art}_wild` : undefined }); }
        else if (lane === 1 && st.swarm.length > 0) comp.push(toChips(st.swarm[(i >> 2) % st.swarm.length]!));
        else if (lane === 2 && st.colorroom.length > 0) comp.push(colourAsk(st.colorroom[(i >> 2) % st.colorroom.length]!));
        else if (st.duel.length > 0) comp.push(st.duel[(i >> 2) % st.duel.length]!);
        else if (st.boss.length > 0) comp.push(st.boss[i % st.boss.length]!);
      }
      bossTasksRef.current = comp.length > 0 ? comp : (st.boss.length > 0 ? Array.from({ length: script.knots * 2 }, (_, i) => st.boss[i % st.boss.length]!) : bossPlan(props.items, script.knots, props.seed));
    } else {
      bossTasksRef.current = st && st.boss.length > 0
        ? Array.from({ length: script.knots * 2 }, (_, i) => st.boss[i % st.boss.length]!)
        : bossPlan(props.items, script.knots, props.seed);
    }
    bossAtRef.current = 0;
    const boss = new BossScene({
      script,
      art: props.art,
      tier,
      hearts: carry.hearts,
      seed: props.seed,
      playerSeed: props.playerSeed,
      reducedMotion,
      pad: padRef.current,
      onHearts: setHearts,
      onKnots: (left, total) => setKnots([left, total]),
      onWindow: () => {
        const task = currentBossTask();
        setPhase({ kind: "bossWindow", task, deadline: Date.now() + script.windowSeconds[tier] * 1000, value: "", verdict: "none" });
      },
      onRescue: () => {
        bossDeathsRef.current += 1;
        const tasks = rescuePlan(props.items, bossDeathsRef.current + (carryRef.current?.deaths ?? 0));
        if (tasks.length === 0) {
          bossRef.current?.resetDuel();
          return;
        }
        setPhase({ kind: "rescue", rescue: { tasks, at: 0, solved: 0, value: "", verdict: "none" } });
      },
      onBeaten: () => {
        const c = carryRef.current!;
        finish({ ms: c.ms, maxCombo: c.maxCombo, letters: c.letters, words: c.words, seals: c.seals, deaths: c.deaths + bossDeathsRef.current, gluehwoerter: c.gluehwoerter, bossWon: true });
      },
    });
    bossRef.current = boss;
    // v5.2.2 THE REAL BLACK-SCREEN ROOT (P-49): the door overlap fires
    // MID-FRAME. While the SceneManager is processing a frame, add() parks the
    // new scene in its _pending "holding pattern" and returns null — start()
    // then warns "Scene key not found" and does NOTHING. The arcade had
    // already faded to black and been stopped: a silent, eternal black
    // screen on every real-RAF browser. (The step-harness drives
    // scene.sys.step() directly, so isProcessing was never set — dev runs
    // never showed it.) The whole switch must happen OUTSIDE the frame.
    window.setTimeout(() => {
      if (gameRef.current !== game) return; // page unmounted meanwhile
      // v5.2: the boss lays out at its own 720×528 stage; the shared canvas
      // must match it or floor/player/lane 3 render off-canvas (the crop).
      const bd = BossScene.dimensions();
      game.scale.resize(bd.width, bd.height);
      game.scene.add("boss", boss, false);
      game.scene.stop("arcade");
      game.scene.start("boss");
      // the watchdog: a failed handoff must never be silent again — surface
      // it in the fatal banner instead of a black screen
      window.setTimeout(() => {
        if (gameRef.current !== game) return;
        const sys = bossRef.current?.sys;
        const alive = sys !== undefined && sys.settings.status >= Phaser.Scenes.START && sys.settings.status <= Phaser.Scenes.RUNNING;
        if (!alive) setFatal("Boss-Übergang fehlgeschlagen (Szene nicht gestartet) — bitte neu laden und Koki den Screenshot schicken");
      }, 2500);
    }, 0);
    setPhase({ kind: "bossIntro" });
    window.setTimeout(() => setPhase((p) => (p.kind === "bossIntro" ? { kind: "run" } : p)), reducedMotion ? 900 : 2400);
  };

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
      art: props.art,
      startFrozen: true, // the goal card releases the world
      pad: padRef.current,
      onQuickfire: (contactIdx) => {
        const st = props.storyTasks;
        const qf = st && st.quickfire.length > 0
          ? st.quickfire[contactIdx % st.quickfire.length]!
          : quickfireFor(props.items, contactIdx);
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
      // doc 29 §4: the seal posts hold TYPED tasks with the hint ladder —
      // the scene freezes, this card resolves, then the seal releases
      onSealTask: (sealIdx, solve, cancel) => {
        const st = props.storyTasks;
        if (!st || st.seal.length === 0) return false;
        const task = st.seal[sealIdx % st.seal.length]!;
        setPhase({ kind: "sealTask", task, value: "", verdict: "none", solve, cancel });
        return true;
      },
      // ── v4 modality callbacks (doc 30 §3) ──
      onBattle: (battleIdx) => {
        const pool = props.storyTasks?.battle ?? [];
        if (pool.length === 0) return false;
        setPhase({ kind: "battle", task: pool[battleIdx % pool.length]!, value: "", verdict: "none", scaffolded: false });
        return true;
      },
      onSwarm: (_swarmIdx, solve) => {
        const pool = props.storyTasks?.swarm ?? [];
        if (pool.length === 0) return false;
        const chain = Array.from({ length: Math.min(6, pool.length) }, (_, i) => pool[i]!);
        setPhase({ kind: "swarm", chain, at: 0, solved: 0, verdict: "none", solve });
        return true;
      },
      onRestoreObject: (_objIdx, stem, solve, cancel) => {
        const pool = props.storyTasks?.colorroom ?? [];
        const task = pool.find((x) => x.itemId.includes(stem.replace(/_/g, ""))) ?? pool.find((x) => x.art === `cr_${stem}`) ?? null;
        if (!task) return false;
        setPhase({ kind: "colorroom", task, stage: "name", value: "", verdict: "none", solve, cancel });
        return true;
      },
      onDuel: (solve, cancel) => {
        const pool = props.storyTasks?.duel ?? [];
        if (pool.length === 0) return false;
        setPhase({ kind: "duelRound", at: 0, verdict: "none", solve, cancel });
        return true;
      },
      onRescue: (deathCount) => {
        const st = props.storyTasks;
        const tasks = st && st.rescue.length > 0
          ? [st.rescue[(deathCount - 1) % st.rescue.length]!, st.rescue[deathCount % st.rescue.length]!]
          : rescuePlan(props.items, deathCount - 1);
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
      onGluehwoerter: (n: number) => setGluehwoerter((prev) => { if (n > prev) setTipToastAt(Date.now()); return n; }),
      onBossDoor: (carry) => enterBoss(carry),
      battleSkins: (props.storyTasks?.battle ?? []).map((b) => (b.art ?? "").replace(/^st_/, "")),
      onComplete: (stats) => finish({ ...stats, bossWon: false }),
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
    gameRef.current = game;
    // W0 typing-mode law: DOM text focus releases the game keyboard entirely
    const unbindTyping = bindTypingGuard(game);
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>)["__domigoArcade"] = {
        game, // dev-only: typing-guard probes
        bossPeek: () => ({ at: bossAtRef.current, answers: bossTasksRef.current.map((x) => x.answer) }), // dev-only: full-run harness
        winBoss: () => bossRef.current?.debugWin(), // dev-only: proves the win→finale transition
        phasePeek: () => phaseRef.current?.kind, // dev-only
        state: () => (bossActiveRef.current && bossRef.current ? bossRef.current.debugState() : scene.debugState()),
        // v5 W3: REPLACE semantics — press({}) releases everything. The old
        // Object.assign(current, p) merge never released keys, which latched
        // jumpHeld and silently blocked every ↑-interaction in harness runs
        // (the whole P-46 pitfall class was this one line).
        press: (p: Partial<ArcadePad>) => Object.assign(padRef.current, { left: false, right: false, up: false, down: false, jump: false, pogo: false, swing: false }, p),
        // playtest-only: open the seal gate so the boss handoff is drivable
        unseal: () => scene.debugUnseal(),
        warp: (c: number, r: number) => scene.debugWarp(c, r),
        // playtest-only: step the active scene when the tab is hidden and
        // Phaser has slept the loop (P-37b) — no OS focus needed.
        step: (ms: number) => {
          game.loop.wake();
          const active = bossActiveRef.current && bossRef.current ? bossRef.current : scene;
          active.sys.step(performance.now(), ms);
        },
      };
    }
    // v5.3 teacher preview: skip the level entirely and walk straight into
    // the guardian duel once the arcade scene has finished create() (the
    // enterBoss handoff stops it a frame later — P-49-safe, outside the step).
    let bossOnlyIv: number | null = null;
    if (props.bossOnly === true && props.boss) {
      bossOnlyIv = window.setInterval(() => {
        if (gameRef.current !== game) { if (bossOnlyIv !== null) window.clearInterval(bossOnlyIv); return; }
        if (!game.scene.isActive("arcade")) return;
        if (bossOnlyIv !== null) window.clearInterval(bossOnlyIv);
        enterBoss({ hearts: 3, letters: 0, gluehwoerter: 2, words: 0, maxCombo: 0, seals: 0, deaths: 0, ms: 0 });
      }, 150);
    }
    return () => {
      if (bossOnlyIv !== null) window.clearInterval(bossOnlyIv);
      if (process.env.NODE_ENV !== "production") {
        delete (window as unknown as Record<string, unknown>)["__domigoArcade"];
        delete (window as unknown as Record<string, unknown>)["__domigoArcadeQf"];
        delete (window as unknown as Record<string, unknown>)["__domigoArcadeRescue"];
      }
      unbindTyping();
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

  // boss counter-window countdown — timing out just closes the window; the
  // pattern repeats and the SAME task returns on the next dodge (§2b)
  useEffect(() => {
    if (phase.kind !== "bossWindow") return;
    const t = window.setTimeout(() => answerBossWindow(null), Math.max(phase.deadline - Date.now(), 0));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.kind === "bossWindow" ? phase.deadline : 0]);

  /** The counter window: one brain grades, the FSM resumes. Wrong answers
   *  scaffold the SAME task down (typed → chips) for the next window. */
  const answerBossWindow = (input: string | null): void => {
    if (phase.kind !== "bossWindow") return;
    const task = phase.task;
    let correct = false;
    if (input !== null && task.itemId.startsWith("g1.game.")) {
      // story task: grade locally against the authored answer (doc 29 §4)
      correct = gradeStoryAnswer(task.answer, input);
      void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
    } else if (input !== null) {
      const item = props.items.find((r) => r.item.id === task.itemId);
      if (item) {
        if (task.kind === "vocab") {
          correct = gradeVocab(item.item as VocabItem, input, task.pool ?? "carrier").tier !== "wrong";
          void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "vocab", value: input, pool: task.pool ?? "carrier" }, latencyMs: null, hintUsed: false });
        } else {
          correct = gradeGrammar(item.item as GrammarItem, { kind: "choice", value: input }).tier !== "wrong";
          void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
        }
      }
    }
    if (correct) {
      bossAtRef.current += 1;
      setPhase({ ...phase, verdict: "right" });
    } else if (input !== null) {
      // scaffold down in place for the next window
      bossTasksRef.current[bossAtRef.current] = task.itemId.startsWith("g1.game.")
        ? storyScaffold(task, props.storyTasks?.boss ?? [])
        : rescueScaffold(task, props.items);
      setPhase({ ...phase, value: "", verdict: "wrong" });
    }
    window.setTimeout(() => {
      bossRef.current?.resolveWindow(correct);
      setPhase((p) => (p.kind === "bossWindow" ? { kind: "run" } : p));
    }, correct ? (reducedMotion ? 300 : 650) : input === null ? 0 : (reducedMotion ? 400 : 800));
  };

  /** ONE brain: grade through the engine, post the attempt, resume. */
  const answerQuickfire = (chip: string | null) => {
    if (phase.kind !== "quickfire") return;
    const { qf } = phase;
    const item = props.items.find((r) => r.item.id === qf.itemId);
    let correct = false;
    if (chip !== null && qf.itemId.startsWith("g1.game.")) {
      correct = gradeStoryAnswer(qf.answer, chip);
      void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: qf.itemId, mode: props.mode, input: { kind: "choice", value: chip }, latencyMs: null, hintUsed: false });
    } else if (chip !== null && item) {
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
      // resolveQuickfire may OPEN a new phase (a stunned guard releases its
      // seal → the sealTask card) — never stomp it (Koki's softlock 2026-07-17)
      sceneRef.current?.resolveQuickfire(correct);
      setPhase((p) => (p.kind === "verdict" ? { kind: "run" } : p));
    }, reducedMotion ? 500 : 750);
  };

  /** v4 object-battle: name the bewitched thing; wrong scaffolds typed→chips. */
  const answerBattle = (input: string): void => {
    if (phase.kind !== "battle") return;
    const correct = gradeStoryAnswer(phase.task.answer, input);
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: phase.task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
    if (correct) {
      setPhase({ ...phase, verdict: "right" });
      window.setTimeout(() => { sceneRef.current?.resolveBattle(true); setPhase((p) => (p.kind === "battle" ? { kind: "run" } : p)); }, reducedMotion ? 400 : 700);
    } else if (!phase.scaffolded) {
      setPhase({ ...phase, value: "", verdict: "wrong", scaffolded: true }); // typed → chips
    } else {
      setPhase({ ...phase, verdict: "wrong" });
      window.setTimeout(() => { sceneRef.current?.resolveBattle(false); setPhase((p) => (p.kind === "battle" ? { kind: "run" } : p)); }, reducedMotion ? 400 : 700);
    }
  };

  /** v4 swarm chain: rapid answers; a miss recycles the item to the chain's end. */
  const answerSwarm = (choice: string): void => {
    if (phase.kind !== "swarm") return;
    const qf = phase.chain[phase.at]!;
    const correct = gradeStoryAnswer(qf.answer, choice);
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: qf.itemId, mode: props.mode, input: { kind: "choice", value: choice }, latencyMs: null, hintUsed: false });
    if (correct) {
      const solved = phase.solved + 1;
      if (solved >= phase.chain.length) {
        setPhase({ ...phase, solved, verdict: "right" });
        window.setTimeout(() => { phase.solve(); setPhase((p) => (p.kind === "swarm" ? { kind: "run" } : p)); }, reducedMotion ? 350 : 600);
      } else {
        setPhase({ ...phase, at: phase.at + 1, solved, verdict: "none" });
      }
    } else {
      // recycle to the end (doc 30 §3) — the chain only clears when every number sits right
      const chain = [...phase.chain];
      const missed = chain.splice(phase.at, 1)[0]!;
      chain.push(missed);
      setPhase({ ...phase, chain, verdict: "wrong" });
      window.setTimeout(() => setPhase((p) => (p.kind === "swarm" ? { ...p, verdict: "none" } : p)), 450);
    }
  };

  /** v4 colorroom: stage 1 name (typed), stage 2 colour (chips). */
  const answerColorroom = (input: string): void => {
    if (phase.kind !== "colorroom") return;
    if (phase.stage === "name") {
      const correct = gradeStoryAnswer(phase.task.answer, input);
      void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: phase.task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
      if (correct) setPhase({ ...phase, stage: "colour", value: "", verdict: "none" });
      else setPhase({ ...phase, value: "", verdict: "wrong" });
      return;
    }
    const col = phase.task.colour;
    const correct = col !== undefined && gradeStoryAnswer(col.answer, input);
    if (correct) {
      setPhase({ ...phase, verdict: "right" });
      window.setTimeout(() => { phase.solve(); setPhase((p) => (p.kind === "colorroom" ? { kind: "run" } : p)); }, reducedMotion ? 350 : 650);
    } else setPhase({ ...phase, verdict: "wrong" });
  };

  /** v4 command duel: right command = next antic; all rounds → friendly. */
  const answerDuel = (choice: string): void => {
    if (phase.kind !== "duelRound") return;
    const pool = props.storyTasks?.duel ?? [];
    const task = pool[phase.at]!;
    const correct = gradeStoryAnswer(task.answer, choice);
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: choice }, latencyMs: null, hintUsed: false });
    if (correct) {
      if (phase.at + 1 >= pool.length) {
        setPhase({ ...phase, verdict: "right" });
        window.setTimeout(() => { phase.solve(); setPhase((p) => (p.kind === "duelRound" ? { kind: "run" } : p)); }, reducedMotion ? 400 : 800);
      } else {
        setPhase({ ...phase, at: phase.at + 1, verdict: "none" });
      }
    } else {
      setPhase({ ...phase, verdict: "wrong" });
      window.setTimeout(() => setPhase((p) => (p.kind === "duelRound" ? { ...p, verdict: "none" } : p)), 500);
    }
  };

  /** v4 dialogue finale: the freed student's Q&A; then the done overlay. */
  const answerFinale = (choice: string): void => {
    if (phase.kind !== "finale") return;
    const pool = props.storyTasks?.finale ?? [];
    const task = pool[phase.at]!;
    const correct = gradeStoryAnswer(task.answer, choice);
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: choice }, latencyMs: null, hintUsed: false });
    if (correct) {
      if (phase.at + 1 >= pool.length) {
        setPhase({ ...phase, verdict: "right" });
        window.setTimeout(() => setPhase({ kind: "done", stats: phase.stats }), reducedMotion ? 400 : 800);
      } else setPhase({ ...phase, at: phase.at + 1, verdict: "none" });
    } else {
      setPhase({ ...phase, verdict: "wrong" });
      window.setTimeout(() => setPhase((p) => (p.kind === "finale" ? { ...p, verdict: "none" } : p)), 500);
    }
  };

  /** Seal post (doc 29 §4): a typed task with the full hint ladder, no timer.
   *  Right → the seal releases; "Später" walks away (retry any time). */
  const answerSealTask = (input: string): void => {
    if (phase.kind !== "sealTask") return;
    const correct = gradeStoryAnswer(phase.task.answer, input);
    void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: phase.task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
    if (correct) {
      setPhase({ ...phase, verdict: "right" });
      window.setTimeout(() => { phase.solve(); setPhase({ kind: "run" }); }, reducedMotion ? 300 : 650);
    } else {
      setPhase({ ...phase, value: "", verdict: "wrong" });
    }
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
    if (task.itemId.startsWith("g1.game.")) {
      correct = gradeStoryAnswer(task.answer, input);
      void props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: task.itemId, mode: props.mode, input: { kind: "choice", value: input }, latencyMs: null, hintUsed: false });
    } else if (item) {
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
          // in the duel the rescue restarts the fight at the door (§2b);
          // in the level it returns to the last checkpoint flag
          if (bossActiveRef.current) bossRef.current?.resetDuel();
          else sceneRef.current?.respawn();
          setPhase((p) => (p.kind === "rescue" ? { kind: "run" } : p));
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

  // v2.2: dismiss the goal card (button or any key) → the world starts
  const startRun = (): void => {
    setGoalOpen(false);
    sceneRef.current?.setRunning(true);
    requestGameFullscreen(); // v4 W0: immersion — the goal-card click is the gesture
  };
  useEffect(() => {
    if (!goalOpen) return;
    const onKey = (): void => startRun();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalOpen]);

  const hudChip: CSSProperties = { background: "rgba(20,18,33,0.82)", color: "#e8e6f5", borderRadius: 999, padding: "6px 12px", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-label)" };
  const sealsDone = seals[1] > 0 && seals[0] >= seals[1];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <div ref={hostRef} data-testid="arcade-canvas" style={{ width: "100%", aspectRatio: "15 / 11", background: "#141221", borderRadius: 8, overflow: "hidden" }} />

        {/* HUD */}
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", pointerEvents: "none", zIndex: 5 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={hudChip}>{"❤".repeat(Math.max(hearts, 0))}{"♡".repeat(Math.max(3 - hearts, 0))}</span>
            <span style={hudChip}>✦ {letters}</span>
            {gluehwoerter > 0 && <span style={{ ...hudChip, color: "#ffe082" }}>✺ {gluehwoerter}</span>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {combo >= 2 && <span className="dg-qf-combo" style={{ ...hudChip, background: "#8b7cf5", color: "#141221" }}>×{combo}</span>}
            {knots !== null ? (
              <span style={hudChip}>Knoten {knots[0]}/{knots[1]}</span>
            ) : sealsDone ? (
              <span className="dg-qf-combo" style={{ ...hudChip, background: "#ffe066", color: "#141221" }}>→ Zur Tür!</span>
            ) : (
              <span style={hudChip}>⬧ {sealNoun} {seals[0]}/{seals[1]}</span>
            )}
          </div>
        </div>

        {/* v5 W0: the Glühbuchstaben pickup announces its gift */}
        {tipToastAt !== null && (
          <div key={tipToastAt} className="dg-qf-verdict" style={{ position: "absolute", top: 52, left: "50%", transform: "translateX(-50%)", zIndex: 6, pointerEvents: "none", background: "rgba(20,18,33,0.9)", color: "#ffe082", borderRadius: 999, padding: "6px 16px", fontSize: 14, fontWeight: 800 }}>
            ✺ Glühbuchstabe! +1 Gratis-Tipp
          </div>
        )}

        {/* dev-only crash banner — a broken game must never be a silent black box */}
        {fatal !== null && (
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", zIndex: 40, background: "#7f1d1d", color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 13, maxWidth: "92%", fontFamily: "monospace" }}>
            ⚠ Spielfehler: {fatal}
          </div>
        )}

        {/* v2.2 GOAL CARD — the level SAYS what to do before it starts */}
        {goalOpen && phase.kind === "run" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 11, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,13,26,0.82)", padding: 14 }}>
            <div style={{ width: "min(460px, 96%)", background: "var(--card, #1b1930)", color: "var(--text, #f3f1ff)", borderRadius: 20, padding: "20px 22px", border: "2px solid #8b7cf5", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7cf5" }}>Dein Auftrag</div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", margin: "4px 0 8px" }}>{level.header.name}</div>
              {level.header.whyDe !== undefined && (
                // the CLT Warum-Zeile (doc 28 §1.2): WHY this matters, before the what
                <p style={{ fontSize: 15, lineHeight: 1.45, margin: "0 0 8px", color: "var(--muted, #c9c4e4)", fontStyle: "italic" }}>{level.header.whyDe}</p>
              )}
              <p style={{ fontSize: 16, lineHeight: 1.45, margin: "0 0 12px" }}>
                {level.header.goalDe ?? `Befreie die ${seals[1]} Siegel von ihren Wächtern – dann öffnet sich die Tür des Kapitelwächters!`}
              </p>
              <div style={{ display: "grid", gap: 6, justifyContent: "center", fontSize: 13.5, color: "var(--muted, #c9c4e4)", textAlign: "left", marginBottom: 14 }}>
                {level.header.hintsDe !== undefined ? (
                  // doc 30 §1.2: the explainer speaks THIS unit's fiction
                  level.header.hintsDe.map((h) => <span key={h}>{h}</span>)
                ) : (
                  <>
                    <span>⬧ {sealNoun} — hol sie zurück, dann öffnet sich die große Tür</span>
                    {level.letters.length > 0 && <span>✦ Buchstaben — einsammeln, sie zählen für dich</span>}
                    {level.gluehwoerter.length > 0 && <span style={{ color: "#ffe082" }}>✺ Glühbuchstaben leuchten gelb — jeder schenkt dir einen Extra-Tipp</span>}
                  </>
                )}
              </div>
              <button type="button" className="dg-btn" onClick={startRun} data-testid="goal-start">Los geht&apos;s!</button>
              <p style={{ fontSize: 12, color: "var(--muted, #8f8ab0)", margin: "8px 0 0" }}>… oder drück eine Taste</p>
            </div>
          </div>
        )}

        {/* the guardian arrives — the duel's intro card */}
        {phase.kind === "bossIntro" && props.boss && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,13,26,0.72)", padding: 14, pointerEvents: "none" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b7cf5" }}>Der Kapitelwächter</div>
              <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-display)", color: "#f3f1ff", margin: "6px 0" }}>{props.boss.name}</div>
              <p style={{ fontSize: 15, color: "#c9c4e4", margin: 0, maxWidth: 420 }}>{props.boss.intro}</p>
              <p style={{ fontSize: 13, color: "#8f8ab0", marginTop: 10 }}>Weich aus — und wenn er sich verknotet: schreib!</p>
            </div>
          </div>
        )}

        {/* the COUNTER WINDOW — dodge earned it; production answers unravel a knot */}
        {phase.kind === "bossWindow" && props.boss && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,13,26,0.9)", padding: 14 }}>
            <div className="dg-qf-card" style={{ width: "min(520px, 96%)", textAlign: "center" }}>
              <div className="dg-qf-ring" style={{ ["--qf-s" as string]: `${props.boss.windowSeconds[tier]}s` }} aria-hidden="true" />
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 2, color: "#f3f1ff" }}>Er verknotet sich — jetzt!</div>
              {artUrl(phase.task.art) !== undefined && (
                <img src={artUrl(phase.task.art)} alt="" style={{ width: 88, height: 88, imageRendering: "pixelated", margin: "4px auto", display: "block" }} />
              )}
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", margin: "8px 0 6px" }}>{phase.task.ask}</div>
              <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 14, color: "#f3f1ff" }}>{phase.task.prompt}</div>
              {phase.task.presentation === "typed" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (phase.value.trim() !== "") answerBossWindow(phase.value.trim());
                  }}
                  style={{ display: "flex", gap: 8, justifyContent: "center" }}
                >
                  <input
                    autoFocus
                    value={phase.value}
                    onChange={(e) => setPhase({ ...phase, value: e.target.value })}
                    placeholder="Schreib die Antwort …"
                    data-testid="boss-input"
                    style={{ flex: 1, maxWidth: 280, fontSize: 18, padding: "10px 14px", borderRadius: 12, border: "2px solid #3a3654", background: "#1b1930", color: "#f3f1ff" }}
                  />
                  <button type="submit" className="dg-btn">Konter!</button>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {displayChips(phase.task.chips, phase.task.itemId).map((chip) => (
                    <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerBossWindow(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              {phase.task.hints !== undefined && <HintLadder hints={phase.task.hints} typed={phase.task.presentation === "typed"} onPrefill={(v) => setPhase({ ...phase, value: v })} />}
              {phase.verdict === "wrong" && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Er windet sich frei! Gleich kommt die nächste Chance — dann mit Auswahl.</p>}
              {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Ein Knoten löst sich! ✶</p>}
            </div>
          </div>
        )}

        {/* QUICKFIRE — one word, three chips, one tap */}
        {phase.kind === "quickfire" && (
          <div className="dg-qf-veil" style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.55) 0%, rgba(20,18,33,0.86) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(480px, 96%)", textAlign: "center" }}>
              <div className="dg-qf-ring" style={{ ["--qf-s" as string]: `${qfSeconds}s` }} aria-hidden="true" />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 4 }}>{phase.qf.ask || "Schnell!"}</div>
              <div style={{ fontSize: phase.qf.prompt.length > 26 ? 20 : 30, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 14, lineHeight: 1.25 }}>{phase.qf.prompt}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayChips(phase.qf.chips, phase.qf.itemId).map((chip) => (
                  <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerQuickfire(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
              {phase.qf.hints !== undefined && <HintLadder hints={phase.qf.hints} typed={false} sparks={gluehwoerter} onSpendSpark={() => void sceneRef.current?.spendGluehwort()} />}
            </div>
          </div>
        )}

        {/* SEAL POST (doc 29 §4) — typed, laddered, no timer; "Später" walks away */}
        {phase.kind === "sealTask" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.6) 0%, rgba(20,18,33,0.9) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(520px, 96%)", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#ffe066", marginBottom: 6 }}>✶ Eine verknotete Seite!</div>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.45 }}>{phase.task.ask}</p>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 12, lineHeight: 1.3 }}>{phase.task.prompt}</div>
              <form
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
                onSubmit={(e) => { e.preventDefault(); if (phase.value.trim() !== "") answerSealTask(phase.value.trim()); }}
              >
                <input
                  autoFocus
                  value={phase.value}
                  onChange={(e) => setPhase({ ...phase, value: e.target.value })}
                  placeholder="Schreib das Wort …"
                  data-testid="seal-input"
                  style={{ flex: 1, maxWidth: 280, fontSize: 18, padding: "10px 14px", borderRadius: 12, border: "2px solid #3a3654", background: "#1b1930", color: "#f3f1ff" }}
                />
                <button type="submit" className="dg-btn">Befreien!</button>
              </form>
              {phase.task.hints !== undefined && <HintLadder hints={phase.task.hints} typed sparks={gluehwoerter} onSpendSpark={() => void sceneRef.current?.spendGluehwort()} onPrefill={(v) => setPhase({ ...phase, value: v })} />}
              {phase.verdict === "wrong" && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Noch nicht — nimm einen Tipp und versuch es gleich nochmal!</p>}
              {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Die Seite ist frei! ✶</p>}
              <div style={{ marginTop: 12 }}>
                <button type="button" className="dg-btn-secondary" style={{ fontSize: 13 }} onClick={() => { phase.cancel(); setPhase({ kind: "run" }); }}>Später</button>
              </div>
            </div>
          </div>
        )}


        {/* v4 OBJECT-BATTLE (doc 30 §3) — the bewitched school thing's art IS the prompt */}
        {phase.kind === "battle" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.6) 0%, rgba(20,18,33,0.9) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(500px, 96%)", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 6 }}>{phase.task.ask}</div>
              {artUrl(`${phase.task.art}_wild`) !== undefined && (
                <img src={artUrl(`${phase.task.art}_wild`)} alt="" style={{ width: 120, height: 120, imageRendering: "pixelated", margin: "0 auto 8px", display: "block" }} />
              )}
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 12 }}>{phase.task.prompt}</div>
              {!phase.scaffolded ? (
                <form style={{ display: "flex", gap: 8, justifyContent: "center" }} onSubmit={(e) => { e.preventDefault(); if (phase.value.trim() !== "") answerBattle(phase.value.trim()); }}>
                  <input autoFocus value={phase.value} onChange={(e) => setPhase({ ...phase, value: e.target.value })} placeholder="Schreib das Wort …" data-testid="battle-input" style={{ flex: 1, maxWidth: 260, fontSize: 18, padding: "10px 14px", borderRadius: 12, border: "2px solid #3a3654", background: "#1b1930", color: "#f3f1ff" }} />
                  <button type="submit" className="dg-btn">Befreien!</button>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {displayChips(phase.task.chips, phase.task.itemId).map((chip) => (
                    <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerBattle(chip)}>{chip}</button>
                  ))}
                </div>
              )}
              {phase.task.hints !== undefined && <HintLadder hints={phase.task.hints} typed={!phase.scaffolded} sparks={gluehwoerter} onSpendSpark={() => void sceneRef.current?.spendGluehwort()} onPrefill={(v) => setPhase({ ...phase, value: v })} />}
              {phase.verdict === "wrong" && !phase.scaffolded && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Fast! Jetzt mit Auswahl:</p>}
              {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Befreit! ✶</p>}
            </div>
          </div>
        )}

        {/* v4 NUMBER-SWARM chain — rapid, misses recycle */}
        {phase.kind === "swarm" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.6) 0%, rgba(20,18,33,0.9) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(460px, 96%)", textAlign: "center", borderColor: phase.verdict === "wrong" ? "#fca5a5" : undefined }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 4 }}>{phase.chain[phase.at]?.ask} · {phase.solved}/{phase.chain.length}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 12, lineHeight: 1.1 }}>{phase.chain[phase.at]?.prompt}</div>
              {(() => {
                // v5.1 (Koki's spec): the swarm answers on the ZAHLEN-RAD —
                // scroll the full 1–25 dial (digits or words, whichever the
                // task asks for) and lock in. Chips stay as the fallback for
                // non-numeric answers.
                const answer = phase.chain[phase.at]?.answer ?? "";
                const isDigit = /^\d+$/.test(answer);
                const isWord = WHEEL_WORDS.includes(answer.toLowerCase());
                if (isDigit || isWord) {
                  const options = isDigit ? Array.from({ length: 25 }, (_, i) => String(i + 1)) : WHEEL_WORDS;
                  return <NumberWheel key={`${phase.chain[phase.at]?.itemId}-${phase.at}`} options={options} onLock={answerSwarm} />;
                }
                return (
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {displayChips(phase.chain[phase.at]?.chips, phase.chain[phase.at]?.itemId ?? String(phase.at)).map((chip) => (
                      <button key={chip} type="button" className="dg-qf-chip" style={{ fontSize: 22, minWidth: 90 }} onClick={() => answerSwarm(chip)}>{chip}</button>
                    ))}
                  </div>
                );
              })()}
              {phase.verdict === "wrong" && <p style={{ fontSize: 13, color: "#fca5a5", margin: "10px 0 0" }}>Die Zahl wirbelt zurück in den Schwarm!</p>}
              {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "10px 0 0" }}>Der Schwarm ordnet sich! ✶</p>}
            </div>
          </div>
        )}

        {/* v4 RESTORATION ROOM — name it, then give its colour back */}
        {phase.kind === "colorroom" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.6) 0%, rgba(20,18,33,0.9) 80%)", padding: 12 }}>
            <div className="dg-qf-card" style={{ width: "min(500px, 96%)", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 6 }}>{phase.task.ask}</div>
              {artUrl(`${phase.task.art}_${phase.stage === "name" ? "grey" : "color"}`) !== undefined && (
                <img src={artUrl(`${phase.task.art}_${phase.stage === "name" ? "grey" : "color"}`)} alt="" style={{ width: 120, height: 120, imageRendering: "pixelated", margin: "0 auto 8px", display: "block" }} />
              )}
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 12 }}>{phase.stage === "name" ? phase.task.prompt : phase.task.colour?.promptEn}</div>
              {phase.stage === "name" ? (
                <form style={{ display: "flex", gap: 8, justifyContent: "center" }} onSubmit={(e) => { e.preventDefault(); if (phase.value.trim() !== "") answerColorroom(phase.value.trim()); }}>
                  <input autoFocus value={phase.value} onChange={(e) => setPhase({ ...phase, value: e.target.value })} placeholder="Schreib das Wort …" data-testid="colorroom-input" style={{ flex: 1, maxWidth: 260, fontSize: 18, padding: "10px 14px", borderRadius: 12, border: "2px solid #3a3654", background: "#1b1930", color: "#f3f1ff" }} />
                  <button type="submit" className="dg-btn">Benennen!</button>
                </form>
              ) : (
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {displayChips(phase.task.colour?.options, `${phase.task.itemId}#colour`).map((chip) => (
                    <button key={chip} type="button" className="dg-qf-chip" style={{ minWidth: 100 }} onClick={() => answerColorroom(chip)}>{chip}</button>
                  ))}
                </div>
              )}
              {phase.task.hints !== undefined && phase.stage === "name" && <HintLadder hints={phase.task.hints} typed sparks={gluehwoerter} onSpendSpark={() => void sceneRef.current?.spendGluehwort()} onPrefill={(v) => setPhase({ ...phase, value: v })} />}
              {phase.verdict === "wrong" && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Noch nicht — probier's nochmal!</p>}
              {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Es leuchtet wieder! ✶</p>}
              <div style={{ marginTop: 12 }}>
                <button type="button" className="dg-btn-secondary" style={{ fontSize: 13 }} onClick={() => { phase.cancel(); setPhase({ kind: "run" }); }}>Später</button>
              </div>
            </div>
          </div>
        )}

        {/* v4 COMMAND DUEL — the ghost-student's antic IS the prompt */}
        {phase.kind === "duelRound" && (() => {
          const pool = props.storyTasks?.duel ?? [];
          const task = pool[phase.at];
          if (!task) return null;
          return (
            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,18,33,0.6) 0%, rgba(20,18,33,0.9) 80%)", padding: 12 }}>
              <div className="dg-qf-card" style={{ width: "min(520px, 96%)", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8b7cf5", marginBottom: 4 }}>Runde {phase.at + 1}/{pool.length}</div>
                {artUrl(task.art) !== undefined && (
                  <img src={artUrl(task.art)} alt="" style={{ width: 130, height: 130, imageRendering: "pixelated", margin: "0 auto 6px", display: "block" }} />
                )}
                <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: "0 0 8px" }}>{task.ask}</p>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f3f1ff", fontFamily: "var(--font-display)", marginBottom: 12 }}>{task.prompt}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {displayChips(task.chips, task.itemId).map((chip) => (
                    <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerDuel(chip)}>{chip}</button>
                  ))}
                </div>
                {phase.verdict === "wrong" && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Er macht weiter … welcher Befehl stoppt DAS?</p>}
                {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Er hört auf dich! ✶</p>}
                <div style={{ marginTop: 12 }}>
                  <button type="button" className="dg-btn-secondary" style={{ fontSize: 13 }} onClick={() => { phase.cancel(); setPhase({ kind: "run" }); }}>Später</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* v4 DIALOGUE FINALE — the freed student, meeting & greeting */}
        {phase.kind === "finale" && (() => {
          const pool = props.storyTasks?.finale ?? [];
          const task = pool[phase.at];
          if (!task) return null;
          return (
            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(12,10,22,0.92)", padding: 12 }}>
              <div className="dg-qf-card" style={{ width: "min(520px, 96%)", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {artUrl("p2_ghost") !== undefined && <img src={artUrl("p2_ghost")} alt="" style={{ width: 44, height: 44, borderRadius: 12, imageRendering: "pixelated" }} />}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#8b7cf5" }}>Der befreite Schüler</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{task.ask}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#6f6a8e" }}>{phase.at + 1} / {pool.length}</span>
                </div>
                <div style={{ background: "#1b1930", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontSize: 19, fontWeight: 700, color: "#f3f1ff", marginBottom: 12 }}>{task.prompt}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {displayChips(task.chips, task.itemId).map((chip) => (
                    <button key={chip} type="button" className="dg-qf-chip" style={{ textAlign: "right" }} onClick={() => answerFinale(chip)}>{chip}</button>
                  ))}
                </div>
                {phase.verdict === "wrong" && <p style={{ fontSize: 14, color: "#fca5a5", margin: "12px 0 0" }}>Hm, das passt nicht … was sagt man da?</p>}
                {phase.verdict === "right" && <p style={{ fontSize: 14, color: "#86efac", margin: "12px 0 0" }}>Ihr versteht euch! ✶</p>}
              </div>
            </div>
          );
        })()}

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
                {/* v5 W0 copy law: ONE kid-clear frame, nothing doubled — who
                    grabbed you, what to do, what happens after. */}
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 2 }}>Der Tintengeist hat dich erwischt!</div>
                <p style={{ fontSize: 14, color: "var(--muted)", margin: "2px 0 14px" }}>
                  Keine Angst: Antworte ruhig, dann muss er dich loslassen — und du stehst wieder an deiner Fahne. Aufgabe {Math.min(phase.rescue.solved + 1, n)} von {n}.
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
                    {displayChips(task.chips, task.itemId).map((chip) => (
                      <button key={chip} type="button" className="dg-qf-chip" onClick={() => answerRescue(chip)}>
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                {(() => { const rt = phase.rescue.tasks[phase.rescue.at]; return rt?.hints !== undefined ? <HintLadder key={rt.itemId + phase.rescue.at} hints={rt.hints} typed={rt.presentation === "typed"} sparks={gluehwoerter} onSpendSpark={() => void sceneRef.current?.spendGluehwort()} onPrefill={(v) => setPhase({ kind: "rescue", rescue: { ...phase.rescue, value: v } })} /> : null; })()}
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
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8b7cf5" }}>
                {phase.stats.bossWon ? "Kapitel wiederhergestellt" : "Fragment gefunden"}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", margin: "6px 0 2px" }}>{fragment}</div>
              {phase.stats.bossWon && props.boss && <p style={{ fontSize: 14, color: "var(--muted)", margin: "2px 0 6px" }}>{props.boss.outro}</p>}
              <p style={{ fontSize: 15, margin: "10px 0 4px" }}>
                ⬧ {phase.stats.seals} {sealNoun} · ✦ {phase.stats.letters} Buchstaben{phase.stats.gluehwoerter > 0 ? ` · ✺ ${phase.stats.gluehwoerter} Glühbuchstaben` : ""} · beste Serie ×{phase.stats.maxCombo}
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                {Math.round(phase.stats.ms / 1000)}s{phase.stats.deaths > 0 ? ` · ${phase.stats.deaths}× gerettet` : " · ohne Rettung!"}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                <a className="dg-btn-secondary" href={props.doneHref ?? props.hubHref} style={{ textDecoration: "none" }}>
                  {phase.stats.bossWon ? "Zurück ins Buch →" : "Zur Schule →"}
                </a>
              </div>
            </div>
          </div>
        )}

        <TouchControls pad={padRef.current} hidden={phase.kind !== "run" || goalOpen} />
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
        Pfeiltasten laufen · ↑/Leertaste springen (halten = höher) · X = Federstab-Schwung (verscheucht kurz) · C = Pogo · ↓+Sprung fällt durch Plattformen · ↑ an Stange/Tür = klettern/durchgehen
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
        {btn("Federstab", "✒", "swing", {})}
        {btn("Jump", "⤒", "jump", {})}
      </div>
    </>
  );
}
