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
import { PerfProbe, type PerfReport, type WeakEstimate } from "./perf.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { LOGICAL_H, LOGICAL_W, RENDER_SCALE, airModelByName } from "./paint.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";
import type { GameTaskV2 } from "@domigo/content-schema";
import { CardHost } from "./cards/CardHost.tsx";
import { answerTextOf } from "./cards/resolution.ts";
import { InkWipe, PaintedCage, type CardAlign, alignedWrap } from "./cards/CardShell.tsx";
import { PAINT_OVERLAY_CSS } from "./cards/overlay-css.ts";
import { PaintedIcon, type PaintedIconName } from "./cards/PaintedIcons.tsx";
import { CeremonyBurst, PaintedHero, useCeremonyClock } from "./cards/CeremonyStage.tsx";
import { COUNT_UP_STAGGER_MS, countUpAt, countUpTotalMs, heroArtPresent, runCompletion } from "./cards/ceremony.ts";
import { initRoute, nextTask, orderedTask, type RouteState, type ServeCtx } from "./cards/routing.ts";

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
  /** R5-A6: draw the collision grid over the world (teacher door, ?grid=1). */
  debugGrid?: boolean;
  /** R5-W1 · E1: attach the measuring instrument (teacher door, ?perf=1).
   *  Off ⇒ the probe is never constructed and nothing is wrapped. */
  debugPerf?: boolean;
}

interface HarnessApi {
  press: (p: Partial<Pad>) => void;
  step: (ms?: number) => void;
  rafStep: (t?: number) => void;
  state: () => unknown;
  /** dev-only: the resolution beat's own bookkeeping (PK-R6 · C) */
  beat: () => { hold: boolean; changed: boolean; queued: string | null; overlay: string | null };
  phase: () => string;
  warp: (c: number, r: number) => void;
  task: () => { id: string; kind: string } | null;
  solveTask: () => boolean;
  /** dev-only: typing-guard probes (the game-2d harness precedent) */
  game: Phaser.Game;
  /** R5-W1 · E1: the measuring instrument, or null unless ?perf=1 is on. */
  perf: PerfApi | null;
}

/** R5-W1 · E1: the instrument's read seam. Present only behind the teacher
 *  door (?perf=1), in every build — see the gating note at its install site. */
export interface PerfApi {
  read: () => PerfReport;
  reset: () => void;
  /** waits on the browser's frame clock — needs a VISIBLE tab */
  sample: (frames?: number) => Promise<PerfReport>;
  /** hand-steps the engine — works in a hidden/automated tab */
  drive: (frames?: number, deltaMs?: number) => Promise<PerfReport>;
  /** nudge the loader queue (the ~96 % stall) */
  pump: () => void;
  /** loader progress + scene readiness, for "is there anything to measure yet?" */
  status: () => Array<{ key: string; status: number; progress: number; toLoad: number; done: number; children: number }>;
  /** the raw engine — the dev harness exposes it too; this door is the
   *  production-build twin, so an experiment does not need a rebuild. */
  game: Phaser.Game;
  sweep: (factor?: number) => Promise<WeakEstimate>;
}

declare global {
  interface Window {
    __domigoPaint?: HarnessApi;
    __domigoPaintPerf?: PerfApi;
  }
}

interface OverlayState {
  req: TaskRequest;
  item: GameTaskItem | null; // null = a card without a task (powerup/pay/ceremony)
  card: "task" | "finale" | "grant" | "bonuspay" | "ceremony" | "console" | "bonusend" | "cagehint" | "goal"
    | "tip" | "score" | "out";
  attempts: number;
  typed: string;
  /** PB-F1/F2-20: which side of the canvas the card sits on — always AWAY from
   *  the being it is about, so „schau sie an" is physically possible. */
  align: CardAlign;
  ceremony?: { skin: string; classmate?: string; first: boolean };
  bonusend?: { got: number; total: number; timeout: boolean };
  /** bonuspay: what THIS door costs, read from its own params (PB-R1 · R3-2). */
  price?: number;
  /** tip: the Regel-Seite's own rule, carried from the level (PK-R3b · R3-16). */
  tip?: { topicDe: string; merksatzDe: string };
  /** PK-R6 · D: which round of a reawakening this card is („Runde 3/6", doc 44
   *  §3.3). Present only on the ceremony's own cards — an ordinary encounter
   *  has no place in a sequence and must not pretend to. */
  round?: { n: number; of: number };
  /** PK-R6 · C: how drained the ASKER is at the moment it asks (0…WASH_ALPHA),
   *  so the card's portrait is exactly as grey as the being in the world. */
  wash?: number;
}

/** PK-R3b · M-B · THE CHAPTER'S BILANZ (doc 41 §5, beat 2). Every number the
 *  score page writes, gathered in one place — and every one of them COUNTED
 *  from the level or the run, never authored. The score page is the last thing
 *  a child reads about their own play, so a wrong number there is the most
 *  expensive wrong number in the chapter. */
interface Bilanz {
  /** PK-R6 · C: CLASSMATES freed, and how many the chapter holds — counted from
   *  the cages that actually declare one. Under the old cage law every cage was
   *  a classmate, so „Klassenkinder befreit" over the cage count was true by
   *  accident; doc 44 §2.3 keeps exactly ONE person-cage and frees the unit's
   *  other beings however its fiction asks, which makes that line a lie the
   *  moment a chapter has a second cage. Counted, not assumed. */
  kids: number; kidsTotal: number;
  freed: number; freedTotal: number;
  tips: number; tipsTotal: number;
  letters: number; lettersTotal: number;
  books: number; booksTotal: number;
}

/** The skin of the being a request is about (a shell ceremony is about none). */
const skinOfCtx = (ctx: TaskRequest["ctx"]): string | undefined => (ctx.type === "ceremony" ? undefined : ctx.skin);
/** The entity id a request is about, when it has one. */
const idOfCtx = (ctx: TaskRequest["ctx"]): string | null => (ctx.type === "ceremony" ? null : ctx.id);

const allPhasesOf = (level: PaintLevel): PhaseSpec[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

/** PB-R1 · R3-2: what a door costs, from the DOOR — never a constant. The
 *  `door-price` law guarantees every bonus door declares a payable price. */
const priceOfDoor = (level: PaintLevel, id: string | null): number => {
  if (id === null) return 0;
  const e = allPhasesOf(level).flatMap((p) => p.entities).find((x) => x.id === id);
  return Number(e?.params?.price ?? 0);
};

/** How many letters the bonus room actually holds — counted from its grid, so
 *  the card can never promise a number the level does not contain (P-14). */
const bonusLetterTotal = (level: PaintLevel): number =>
  level.bonus ? level.bonus.rows.join("").split("*").length - 1 : 0;

/** PK-R3b · M-B: the CHAPTER's letter total — the three phases plus the arena,
 *  deliberately NOT the Kleckskammer. Klecks' room has its own end card with its
 *  own count, and folding its twelve letters into the chapter's line would tell
 *  a child who never paid the door that they missed twelve of them. */
const chapterLetterTotal = (level: PaintLevel): number =>
  [...level.phases, ...(level.arena ? [level.arena] : [])]
    .reduce((n, p) => n + p.rows.join("").split("*").length - 1, 0);

/** How many beings of a role the chapter holds, counted across every phase the
 *  child plays (the bonus room excluded, for the reason above). */
const chapterRoleCount = (level: PaintLevel, role: string): number =>
  [...level.phases, ...(level.arena ? [level.arena] : [])]
    .reduce((n, p) => n + p.entities.filter((e) => e.role === role).length, 0);

/** PK-R6 · C · how many CLASSMATES the chapter holds — the cages that declare
 *  one (doc 44 §2.3's person-cage). The level law already guarantees exactly
 *  one; this counts rather than assumes it, so the score page keeps telling the
 *  truth in a chapter that frees other beings from cages too. */
const chapterClassmateCount = (level: PaintLevel): number =>
  [...level.phases, ...(level.arena ? [level.arena] : [])]
    .reduce((n, p) => n + p.entities.filter((e) => e.role === "cage" && e.params?.classmate !== undefined).length, 0);

export default function PaintGame({ level, art, tasks, hubHref, buildSha, startPhase, debugGrid, debugPerf }: PaintGameProps): React.ReactElement {
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
  // R3-8 · THE BOOT CEREMONY (doc 42 §3). The child never spawns mid-noise:
  // the chapter opens on a painted book page that names the Auftrag, the
  // chapter, the *Warum* and what there is to collect, over a frozen world.
  // It is the FIRST thing rendered, so the freeze exists before the first tick.
  const [overlay, setOverlay] = useState<OverlayState | null>({
    req: { use: "quickfire", ctx: { type: "ceremony", beat: "goal" } },
    item: null, card: "goal", attempts: 0, typed: "", align: "center",
  });
  /** has the goal card been put down? (the world fades up once, at that beat) */
  const [booted, setBooted] = useState(false);
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
  /** PK-R6 · C: of those, the ones that held a CLASSMATE (doc 44 §2.3). */
  const freedKidsRef = useRef<string[]>([]);
  /** R5-A2: where the Kleckskammer trip left from — phase, door cell, purse
   *  and found-count. The remount consumes it: the child returns to the spot
   *  (and wallet) they left with, not to the phase start with an empty hand. */
  const bonusReturnRef = useRef<{ phaseId: string; spawn: { c: number; r: number }; purse: number; found: number } | null>(null);
  /** R5-A2: letter CELLS consumed per phase — a remount must not respawn them
   *  into double-collectability. Same outlives-a-mount contract as the refs
   *  below. */
  const lettersTakenRef = useRef(new Map<string, string[]>());
  /** PB-F3: the cage hint is a once-per-chapter teacher, not a nag. */
  const cageHintShownRef = useRef(false);
  const [freedCount, setFreedCount] = useState(0);
  const [freedKids, setFreedKids] = useState(0);
  // ── PK-R3b · R3-16/17 · the collectibles that OUTLIVE a phase mount ────────
  // Coming back from the Kleckskammer remounts the phase you left, so anything
  // the chapter counts has to be remembered out here — exactly like freed cages.
  /** ids taken this chapter, kept apart because the HUD counts them apart. */
  const tipsTakenRef = useRef<string[]>([]);
  const booksTakenRef = useRef<string[]>([]);
  const [tipsCount, setTipsCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  /** letters FOUND this chapter: banked from finished phases + this phase's own
   *  running count. Found, not held — see Sim.lettersCollected. */
  const bankedLettersRef = useRef(0);
  const phaseLettersRef = useRef(0);
  const overlayRef = useRef<OverlayState | null>(null);
  overlayRef.current = overlay;
  /** R5-W1 · E1 · EVERY PENDING TIMER THIS COMPONENT OWNS.
   *  Four window.setTimeout calls used to be fired and forgotten — including a
   *  2.5 s swap watchdog that could raise a crash banner into a tree React had
   *  already unmounted. A set beats remembering: `later()` is the only way to
   *  schedule, and the effect's cleanup empties it. */
  const timersRef = useRef<Set<number>>(new Set());

  /** setTimeout that cannot outlive the component. */
  const later = (fn: () => void, ms: number): number => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  };
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
  //
  // PK-R6 · C · THE RESTORE-HOLD (doc 44 §3.1.7 · doc 42 §3) splits what used to
  // be one step into two, because the ORDER was wrong: the card celebrated and
  // vanished, and only then did the world change — off screen, unwatched. Now
  // the card hands over at `onWorldChange`, the world's change plays while the
  // card is doffed, and `onResolve` closes the beat afterwards.
  //
  // That inversion creates one hazard and this is its guard: resolveTask can
  // synchronously raise a FOLLOW-UP card (a freed cage's ceremony, the fallen
  // guardian's console beat) — and during the hold there is still a card on
  // screen for it to clobber. So while the hold runs, every card opening is
  // QUEUED instead, and the queue is flushed when the beat ends.
  /** is a world change being watched right now? (⇒ queue, do not open) */
  const holdRef = useRef(false);
  /** the card the hold owes the child once the beat is over */
  const queuedRef = useRef<OverlayState | null>(null);
  /** has THIS card's world change already been applied? (the dev harness and
   *  reduced motion both jump straight to onResolve — the change must happen
   *  exactly once either way) */
  const changedRef = useRef(false);

  /** The one door every card comes through, so the hold can hold it. */
  const openCard = (next: OverlayState): void => {
    if (holdRef.current) { queuedRef.current = next; return; }
    changedRef.current = false;
    setOverlay(next);
  };

  /** Beat 2: the world changes, and is watched. */
  const applyWorldChange = (o: OverlayState, written = ""): void => {
    if (changedRef.current) return;
    changedRef.current = true;
    holdRef.current = true;
    sceneRef.current?.clearEvidence(); // R3-12: the board wipes itself
    sceneRef.current?.resolveTask(o.req.ctx);
    // PK-R6 · H1 (round-1 critique, finding 1) · THE PAYOFF IS PLAYED, NOT TOLD.
    // The console beat that follows says „Jetzt steht dein Wort da — und die
    // Tafel blüht sonnengelb auf", and until now nothing of the kind happened on
    // the board: every frame after the finale showed a plain green slate. The
    // child's own word is chalked onto her here — in beat 2, while the card is
    // doffed and the world is being WATCHED — and it never wipes.
    if (o.card === "finale") {
      const id = idOfCtx(o.req.ctx);
      if (id !== null) sceneRef.current?.chalkTheGift(id, written);
    }
    // solveTask hands the world back the moment it resolves; the restore-hold
    // needs it held ONE BEAT LONGER, or the child walks away mid-colour-flood
    // from the change their own answer just made.
    sceneRef.current?.setOverlay(true);
    // PK-R6 · H1 (round-1 critique, finding 5) · …and the world it holds has to
    // BE RUNNING. `setOverlay(true)` stops the sim on its first line, and the
    // colour flood, the settle and the joy lap are all driven by the timers that
    // stop with it — so the beat that exists to be watched was 600 ms of a still
    // frame, and the payoff was only ever the card's text. The hold now runs the
    // freed beings and nothing else (Sim.setHold).
    sceneRef.current?.setHold(true);
    // the finale is the last ACT of the chapter: writing HELLO is what earns
    // the console beat, so that card opens only once the child has done it
    // …and the console beat is told WHICH word went up, so its copy can name the
    // thing that is now visibly on the board instead of promising it blind. A
    // finale the child put down („Später") carries no word and gets copy that
    // does not claim one.
    if (o.card === "finale") queuedRef.current = { ...o, item: null, card: "console", typed: written };
  };

  /** Beat 3 is over: close, and hand on whatever the change raised. */
  const resolveCorrect = (o: OverlayState, written = ""): void => {
    // idempotent — a path that skipped the beat still changes the world. The
    // paths that come straight here (reduced motion, the dev harness) never saw
    // the child type, so the answer key stands in for their word: it is the only
    // text those paths can honestly claim was written.
    applyWorldChange(o, written !== "" ? written : o.item ? answerTextOf(o.item) : "");
    holdRef.current = false;
    changedRef.current = false;
    sceneRef.current?.setHold(false);
    const queued = queuedRef.current;
    queuedRef.current = null;
    if (queued) { setOverlay(queued); return; }
    sceneRef.current?.setOverlay(false);
    setOverlay(null);
  };

  const dismissCard = (o: OverlayState): void => {
    // PK-R6 · C · the anti-softlock law (PB-T1) applied to the new beat: a hold
    // that never ends would queue every future card forever, so ANY way out of
    // a card clears it. („Später" cannot fire mid-hold — the card is doffed and
    // CardHost has already ended — so this drops nothing; it is the guard that
    // makes that reasoning unnecessary.)
    holdRef.current = false;
    changedRef.current = false;
    sceneRef.current?.setHold(false);
    if (o.card === "finale") {
      // „Später" on the finale must not eat the chapter's payoff
      setOverlay({ ...o, item: null, card: "console" });
      return;
    }
    if (o.card === "task") {
      // the anti-softlock law (PB-T1): every task card can be put down —
      // dismissal resumes the world with no reward and no redeem
      setOverlay(null);
      sceneRef.current?.clearEvidence(); // R3-12
      sceneRef.current?.dismissTask(o.req.ctx);
      return;
    }
    if (o.card === "goal") setBooted(true);
    // M-B beat 2 → beat 3: the score page taps forward to the door out. Both
    // live inside the canvas, so the chapter never ends off screen.
    if (o.card === "score") {
      setOverlay({ ...o, card: "out", req: { use: "quickfire", ctx: { type: "ceremony", beat: "out" } } });
      return;
    }
    sceneRef.current?.setOverlay(false);
    setOverlay(null);
  };

  // R3-8 · THE BATTLE FRAMING (doc 42 §1). A card up ⇒ the world freezes AND
  // the book leans in on whoever is asking; a card gone ⇒ it eases back out.
  // One effect owns both halves, so a card can never freeze without focusing or
  // focus without freezing — the pairing that broke ch01 once already.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (overlay === null) { scene.clearFocus(); return; }
    scene.setOverlay(true);
    const id = idOfCtx(overlay.req.ctx);
    if (id !== null) scene.focusOn(id);
    else scene.clearFocus();
  }, [overlay]);

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
      // R5-W1 · A1: the painted mass sheets are 512² and are drawn minified.
      // Without mipmaps WebGL takes ONE bilinear tap per screen pixel of an
      // 11-book-row painting, so the same fixed alias noise is stamped over the
      // whole floor — half of what read as "mechanical" was the filter, not the
      // paint. All four mass sheets are power-of-two, which is what mipmapping
      // requires. (F.3, adversarial design review.)
      mipmapFilter: "LINEAR_MIPMAP_LINEAR",
      roundPixels: false,
      fps: { target: 60, min: 30 },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;
    // THE TYPING-MODE LAW (shared, game-feel): while a task card's input has
    // focus, Phaser's window-level key capture is released so W/A/S/D/SPACE
    // reach the field instead of steering the hero (the "school book" softlock)
    const unbindTyping = bindTypingGuard(game);

    // R5-W1 · E1 · THE MEASURING INSTRUMENT (teacher door, ?perf=1).
    // Constructed only when asked for, and it attaches by WRAPPING
    // PaintScene.prototype rather than by editing the render loop — see
    // perf.ts. Off ⇒ not one wrapper exists and the game is byte-identical.
    // Gated on the teacher door ALONE, not on NODE_ENV — deliberately, and for
    // the same reason ?grid=1 is: a development build measures the wrong thing
    // (unminified React, no production optimisation), so an instrument that
    // only exists in dev cannot answer "why does the shipped game stutter?".
    // The server hands debugPerf=true only to a signed-in teacher who asked for
    // it by name, so the exposure is identical to the grid door's.
    const probe =
      debugPerf === true
        ? new PerfProbe({
            game,
            scene: () => sceneRef.current,
            phase: () => sceneRef.current?.getState()?.phase ?? "",
            scope: () => sceneRef.current?.artScope() ?? null,
            artKeys: () => new Set(Object.keys(art)),
          })
        : null;
    probe?.install(PaintScene.prototype);
    // Its own read handle, because __domigoPaint below is dev-only and the
    // numbers that matter come from a production build.
    if (probe !== null) {
      window.__domigoPaintPerf = {
        read: () => probe.read(),
        reset: () => probe.reset(),
        sample: (frames) => probe.sample(frames),
        drive: (frames, deltaMs) => probe.drive(frames, deltaMs),
        pump: () => probe.pump(),
        status: () => probe.status(),
        game,
        sweep: (factor) => probe.sweep(factor),
      };
    }

    const mountPhase = (pid: string): void => {
      mountPhaseRef.current = mountPhase;
      const phase = allPhasesOf(level).find((p) => p.id === pid);
      // R5-A2: consume the Kleckskammer return ticket — only the phase the
      // trip left from spawns at the door with the saved wallet; every other
      // mount is fresh (and the taken-cells ledger applies to ANY remount).
      const ret = bonusReturnRef.current;
      const fromBonus = ret !== null && ret.phaseId === pid;
      if (fromBonus) bonusReturnRef.current = null;
      const scene = new PaintScene({
        level,
        phaseId: pid,
        art,
        pad: padRef.current,
        reducedMotion,
        grantedAbilities: () => abilitiesRef.current,
        freedCageIds: () => freedRef.current,
        cageHintShown: () => cageHintShownRef.current,
        collectedPickupIds: () => [...tipsTakenRef.current, ...booksTakenRef.current],
        airModel,
        spawnCell: fromBonus ? ret.spawn : undefined,
        debugGrid,
        letterLedger: () => ({
          takenCells: lettersTakenRef.current.get(pid) ?? [],
          purse: fromBonus ? ret.purse : 0,
          found: fromBonus ? ret.found : 0,
        }),
        callbacks: {
          onExit: (next) => handoff(next),
          onLetterTaken: (c, r) => {
            const cellKey = `${c},${r}`;
            const cur = lettersTakenRef.current.get(pid) ?? [];
            if (!cur.includes(cellKey)) lettersTakenRef.current.set(pid, [...cur, cellKey]);
          },
          onLetters: (got, total) => {
            setLetters({ got, total });
            // the Bilanz counts what was FOUND, so it reads the monotone counter
            // rather than this purse (paying Klecks must not un-find letters)
            phaseLettersRef.current = sceneRef.current?.getState()?.lettersCollected ?? 0;
          },
          onTip: (id, topicDe, merksatzDe) => {
            if (!tipsTakenRef.current.includes(id)) tipsTakenRef.current = [...tipsTakenRef.current, id];
            setTipsCount(tipsTakenRef.current.length);
            openCard({
              req: { use: "quickfire", ctx: { type: "ceremony", beat: "tip" } },
              item: null, card: "tip", attempts: 0, typed: "", align: "center",
              tip: { topicDe, merksatzDe },
            });
          },
          onBook: (id) => {
            if (!booksTakenRef.current.includes(id)) booksTakenRef.current = [...booksTakenRef.current, id];
            setBooksCount(booksTakenRef.current.length);
          },
          onTask: (req) => {
            const align = alignAwayFrom(idOfCtx(req.ctx));
            if (req.use === "bonuspay") {
              openCard({ req, item: null, card: "bonuspay", attempts: 0, typed: "", align, price: priceOfDoor(level, idOfCtx(req.ctx)) });
              return;
            }
            // ── PK-R6 · D · A REAWAKENING ROUND (doc 44 §3.3) ──────────────
            // The one card the router may not pick: the ceremony is ORDERED, so
            // the round comes out of the pool BY INDEX (cards/routing
            // orderedTask), and the pose the card declares is struck by the
            // being in the world before the card lands — the picture in the
            // card and the girl standing next to the child are one declaration.
            if (req.ctx.type === "classmate") {
              const ctx = req.ctx;
              const round = orderedTask(tasks, req.use, { phase: pid, skin: ctx.skin }, ctx.round - 1);
              if (!round) { sceneRef.current?.resolveTask(ctx); return; } // never softlock
              if (round.stimulus.type === "entity" && round.stimulus.art !== undefined) {
                sceneRef.current?.setActingPose(ctx.id, round.stimulus.art);
              }
              sceneRef.current?.contactSpark(ctx.id);
              openCard({
                req, item: round, card: "task", attempts: 0, typed: "", align,
                wash: sceneRef.current?.washOf(ctx.id) ?? 0,
                round: { n: ctx.round, of: ctx.rounds },
              });
              return;
            }
            // the serve context: this phase, and the being that triggered it
            const item = pickTask(req.use, { phase: pid, skin: skinOfCtx(req.ctx) });
            if (!item) { sceneRef.current?.resolveTask(req.ctx); return; } // no pool: never softlock
            // R3-12 · THE BOSS-EVIDENCE BEAT (doc 41 §4): a card that asks about
            // written material may not open before that material is ON the being.
            // Koki's 11.48.59 and 11.50.26 asked about a blank board; now the
            // guardian writes first and the card follows a beat later.
            const askerId = idOfCtx(req.ctx);
            // PK-R6 · C · beat 1 of the entry choreography (doc 44 §3.1.1): the
            // being BURSTS at the touch point. It fires HERE, at contact, not
            // when the card lands — an evidence card lands a beat later and a
            // spark that waited for it would be a burst with no impact behind it.
            // The freeze + camera lean (1.18×/160 ms, camera.ts) follows from
            // the overlay effect below, and the ink iris wipes over both.
            if (askerId !== null) sceneRef.current?.contactSpark(askerId);
            const wash = askerId !== null ? (sceneRef.current?.washOf(askerId) ?? 0) : 0;
            const beatMs = item.evidence && askerId !== null
              ? (sceneRef.current?.writeEvidence(askerId, item.evidence) ?? 0)
              : 0;
            if (beatMs > 0) {
              later(() => openCard({ req, item, card: "task", attempts: 0, typed: "", align, wash }), beatMs);
              return;
            }
            openCard({ req, item, card: "task", attempts: 0, typed: "", align, wash });
          },
          onPowerup: (grants) => {
            if (!abilitiesRef.current.includes(grants)) abilitiesRef.current = [...abilitiesRef.current, grants];
            openCard({ req: { use: "quickfire", ctx: { type: "ceremony", beat: "grant" } }, item: null, card: "grant", attempts: 0, typed: "", align: "center" });
          },
          onCageHint: () => {
            // PB-F3 · F2-8: the first time the child stands next to a cage the
            // fist can open, say so — once per chapter, never again.
            // PB-R1 · R3-1: the sim now asks before it freezes (cageHintShown),
            // so this branch should be unreachable. It stays as the second half
            // of the freeze pairing law: a shell that declines a card ALWAYS
            // resumes the world. Declining silently is what froze ch01.
            if (cageHintShownRef.current) { sceneRef.current?.setOverlay(false); return; }
            cageHintShownRef.current = true;
            openCard({ req: { use: "quickfire", ctx: { type: "ceremony", beat: "cagehint" } }, item: null, card: "cagehint", attempts: 0, typed: "", align: "center" });
          },
          onCageFreed: (id, skin, classmate, count) => {
            freedRef.current = [...freedRef.current, id];
            // PK-R6 · C · the score page counts CLASSMATES, so the run has to
            // know which freed cages held one (doc 44 §2.3: one person-cage per
            // chapter, the others are whatever the unit's fiction asks).
            if (classmate !== undefined) freedKidsRef.current = [...freedKidsRef.current, id];
            setFreedCount(count);
            setFreedKids(freedKidsRef.current.length);
            openCard({ req: { use: "rescue", ctx: { type: "cage", id, skin, classmate } }, item: null, card: "ceremony", attempts: 0, typed: "", align: "center", ceremony: { skin, classmate, first: count === 1 } });
          },
          onGuardianDown: (id, skin) => {
            // F2-24: the chapter's climax is PLAYED, not narrated. The finale
            // card (the child writes HELLO on the board) runs first; its
            // resolution opens the console beat. No finale card in the set ⇒
            // straight to the console — the beat can never softlock.
            // R3-11: the Namens-Konsole is a SEEABLE asker (doc 41 §3) and is
            // typed as one now; it was only ever mis-filed as a hazard.
            const consoleReq: TaskRequest = { use: "boss", ctx: { type: "console", id, skin } };
            const align = alignAwayFrom(id);
            const item = pickTask("finale", { phase: pid, skin });
            if (!item) { openCard({ req: consoleReq, item: null, card: "console", attempts: 0, typed: "", align }); return; }
            openCard({ req: consoleReq, item, card: "finale", attempts: 0, typed: "", align, wash: sceneRef.current?.washOf(id) ?? 0 });
          },
        },
      });
      sceneRef.current = scene;
      // R3-8: a scene born UNDER an open card starts frozen (the boot ceremony
      // is on screen before the first tick, and a phase can be remounted while
      // a panel is up). The focus effect only sees LATER changes to `overlay`,
      // so the freeze is asserted here, at the moment the scene exists.
      if (overlayRef.current !== null) scene.setOverlay(true);
      const name = phase?.nameDe ?? pid;
      setPhaseName(name);
      setPhaseId(pid);
      game.scene.add("paint", scene, true);
    };

    const handoff = (next: string): void => {
      // P-49: NEVER from inside a step — defer, swap, and watchdog the swap.
      later(() => {
        let target = next;
        // PK-R3b · M-B: bank the phase we are LEAVING before its Sim is thrown
        // away. The Kleckskammer is excluded on purpose (chapterLetterTotal),
        // so a bonus run neither adds to the Bilanz nor is missed from it.
        // R5-A2: the zeroing moved INSIDE the branch — leaving the bonus room
        // neither banks nor zeroes; the host phase is still running and its
        // found-count comes back through the letter ledger on the remount.
        if (level.bonus === undefined || sceneRef.current?.getState()?.phase !== level.bonus.id) {
          bankedLettersRef.current += phaseLettersRef.current;
          phaseLettersRef.current = 0;
        }
        if (next === "boss") target = level.arena?.id ?? "done";
        if (next === "bonus-timeout" || (level.bonus && next === level.bonus.exit.to && sceneRef.current?.getState()?.phase === level.bonus.id)) {
          // leaving the Kleckskammer (timeout or its exit): show the end card, return
          const bs = sceneRef.current?.bonusState();
          openCard({
            req: { use: "bonus", ctx: { type: "ceremony", beat: "bonus" } }, item: null, card: "bonusend",
            attempts: 0, typed: "", align: "center", bonusend: { got: bs?.got ?? 0, total: bs?.total ?? 12, timeout: next === "bonus-timeout" },
          });
          // R5-A2: mountPhase consumes the return ticket (spawn + wallet)
          target = bonusReturnRef.current?.phaseId ?? level.phases[0]!.id;
        }
        if (target === "done") {
          // PK-R3b · M-B · THE CHAPTER-END SEQUENCE (doc 41 §5, beat 2 → 3).
          // The congratulation used to render UNDER the canvas. In Koki's window
          // the game fills the viewport, so a chapter that ended put its payoff
          // below the fold and read as a hang — the exact frame R3-1 spent a
          // packet on. The sequence now resolves INSIDE the canvas, over the
          // last frame of the world the child just finished, which is where it
          // belonged anyway: the book writes the Bilanz on its own page.
          game.scene.stop("paint");
          setDone(true);
          openCard({
            req: { use: "quickfire", ctx: { type: "ceremony", beat: "score" } },
            item: null, card: "score", attempts: 0, typed: "", align: "center",
          });
          return;
        }
        game.scene.stop("paint");
        game.scene.remove("paint");
        mountPhase(target);
        // R5-W1 · E1 · THE WATCHDOG MUST NOT MISTAKE LOADING FOR HANGING.
        // `isActive` is `status === RUNNING`, and a scene that is LOADING is
        // not RUNNING. Until per-phase scoping landed this never mattered —
        // every texture was already in the manager, so a phase change queued
        // nothing and finished inside one tick. Now phase two genuinely fetches
        // its own art, and on a school connection that is easily longer than
        // 2.5 s: the child would have been shown a crash banner for a game that
        // was merely loading. So the deadline only counts while NO progress is
        // being made, and it is checked repeatedly instead of once.
        const swapStart = performance.now();
        let lastProgress = -1;
        let lastMoveAt = swapStart;
        const watchdog = window.setInterval(() => {
          const sc = game.scene.getScene("paint") as PaintScene | null;
          if (sc !== null && game.scene.isActive("paint")) {
            window.clearInterval(watchdog);
            timersRef.current.delete(watchdog);
            return;
          }
          const progress = sc?.load?.progress ?? -1;
          if (progress !== lastProgress) {
            lastProgress = progress;
            lastMoveAt = performance.now();
          }
          if (performance.now() - lastMoveAt > 8000) {
            window.clearInterval(watchdog);
            timersRef.current.delete(watchdog);
            setFatal(`Phasen-Wechsel nach ${target} hängt (Szene nie gestartet) — bitte neu laden.`);
          }
        }, 500);
        timersRef.current.add(watchdog);
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
        perf: window.__domigoPaintPerf ?? null,
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
        // PK-R6 · C: the restore-hold's own state, so a swallowed card can be
        // told apart from a card that was never raised (dev-only, like the rest
        // of this harness).
        beat: () => ({ hold: holdRef.current, changed: changedRef.current, queued: queuedRef.current?.card ?? null, overlay: overlayRef.current?.card ?? null }),
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
      // R5-W1 · E1: nothing this component scheduled may fire into a torn-down
      // tree — the swap watchdog in particular used to call setFatal() there.
      for (const id of timersRef.current) window.clearTimeout(id);
      for (const id of timersRef.current) window.clearInterval(id);
      timersRef.current.clear();
      probe?.uninstall();
      delete window.__domigoPaintPerf;
      unbindTyping();
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one game per mount
  }, []);

  const payBonus = (price: number): void => {
    const scene = sceneRef.current;
    const game = gameRef.current;
    if (!scene || !game || !level.bonus) return;
    if (!scene.spendLetters(price)) return;
    // R5-A2: the return ticket — the purse AFTER paying, the Bilanz
    // found-count, and the DOOR'S OWN cell (critic finding: the frozen player
    // can hang mid-air over the door; an airborne spawn cell missed the
    // cooldown seed and landing re-fired the pay card).
    const st = scene.getState();
    const door = st?.entities
      .filter((e) => e.role === "door.trigger")
      .sort((a, b) => Math.abs(a.x - st.x) - Math.abs(b.x - st.x))[0];
    const at = door ?? { x: st?.x ?? 40, y: st?.y ?? 48 };
    bonusReturnRef.current = {
      phaseId,
      spawn: { c: Math.round((at.x - 8) / 16), r: Math.round(at.y / 16) - 1 },
      purse: st?.letters ?? 0,
      found: st?.lettersCollected ?? 0,
    };
    setOverlay(null);
    // P-49: enter the Kleckskammer through the same deferred swap as any handoff
    later(() => {
      game.scene.stop("paint");
      game.scene.remove("paint");
      mountPhaseRef.current?.(level.bonus!.id);
    }, 0);
  };

  // task grading now lives in the card machines (cards/) — CardHost calls
  // resolveCorrect on a correct answer and dismissCard on „Später".
  const restart = (): void => window.location.reload();
  const inBonus = level.bonus !== undefined && phaseId === level.bonus.id;
  // R3-16/17 · every denominator on screen is COUNTED from the level, never
  // typed into the copy. The HUD said „/6" while the chapter actually holds
  // seven cages (the arena's is the seventh), which is precisely the class of
  // drift the letter-honesty law exists to stop — so the number now comes from
  // the world it describes and cannot go stale again.
  const cageTotal = chapterRoleCount(level, "cage");
  const kidsTotal = chapterClassmateCount(level);
  const tipTotal = level.tipsTotal ?? chapterRoleCount(level, "tip");
  const bilanz: Bilanz = {
    kids: freedKids, kidsTotal,
    freed: freedCount, freedTotal: cageTotal,
    tips: tipsCount, tipsTotal: tipTotal,
    letters: bankedLettersRef.current + phaseLettersRef.current,
    lettersTotal: chapterLetterTotal(level),
    books: booksCount, booksTotal: chapterRoleCount(level, "book"),
  };

  return (
    <div style={{ maxWidth: LOGICAL_W * RENDER_SCALE, margin: "0 auto", fontFamily: "var(--font-body, system-ui, sans-serif)", position: "relative" }}>
      {/* R3-8: the overlay stylesheet. game-paint ships raw TS/TSX with no CSS
          build step, so the painted layer's animations ride in with the game
          they belong to — and travel with the package, not the app. */}
      <style>{PAINT_OVERLAY_CSS}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 2px", gap: 8 }}>
        <strong style={{ fontSize: 15, fontFamily: "var(--font-display, inherit)", display: "inline-flex", alignItems: "center", gap: 7 }}>
          {/* PK-R6 · H1: the bar's own mark was 🖌 — a platform emoji at the top
              of a hand-painted game. It is the book's brush now, with paint on it. */}
          <PaintedIcon name="brush" size={19} />
          {phaseName}
        </strong>
        {/* R3-17 · THE PAINTED CHIPS (doc 41 §5, presentation mined per doc 42
            §5). The bar used to be a run of plain text on the page background;
            each counter is now a chip in the book's own materials — gouache
            cream, an amber contour, the label face — so the HUD belongs to the
            game rather than to the web page around it.
            F2-33 stands unchanged: every chip says what it counts, and a chip
            with nothing to count is not drawn (the arena collects no letters,
            and the Regel-Seiten chip waits until the chapter hides some). */}
        <span style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
          {freedCount > 0 && <Chip icon="cage" label="Befreit" value={`${freedCount}/${cageTotal}`} art={art} />}
          {tipTotal > 0 && <Chip icon="rule" label="Regel-Seiten" value={`${tipsCount}/${tipTotal}`} art={art} />}
          {booksCount > 0 && <Chip icon="book" label="Bonus-Bücher" value={`${booksCount}`} art={art} />}
          {knots > 0 && <Chip icon="knot" label="Knoten" value={`${knots}`} art={art} />}
          {inBonus && bonusLeft >= 0 && <Chip icon="inkwell" label="Tinte" value={`${Math.ceil(bonusLeft / 60)}s`} art={art} />}
          {letters.total > 0 && <Chip icon="spark" label={level.collectNounDe} value={`${letters.got}/${letters.total}`} art={art} />}
        </span>
      </div>
      {fatal !== null && (
        <div style={{ background: "#c0392b", color: "#fff", padding: "8px 12px", borderRadius: 8, marginBottom: 6 }}>⚠ {fatal}</div>
      )}
      <div style={{ position: "relative" }}>
        <div
          ref={hostRef}
          className={booted ? "pb-world-in" : undefined}
          style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 14px rgba(30,20,10,0.25)" }}
        />
        {overlay && (
          <Overlay
            o={overlay} level={level} art={art}
            onResolve={resolveCorrect} onWorldChange={applyWorldChange} onDismiss={dismissCard} onPay={payBonus}
            letters={letters.got} bonusTotal={bonusLetterTotal(level)}
            bilanz={bilanz} hubHref={hubHref} onRestart={restart}
          />
        )}
      </div>
      {coarse && !done && <TouchPad pad={padRef.current} canPunch={abilitiesRef.current.includes("punch")} />}
      {/* PB-F3 (the rest of F2-34): the bar only offers verbs you actually have —
          advertising the fist before Fibel gives it is what made the rattling
          cage in the entrance hall read as broken instead of as a promise. */}
      <p style={{ fontSize: 12, color: "#8a8066", textAlign: "center", marginTop: 6 }}>
        ←→ laufen · SPACE springen (halten = höher)
        {abilitiesRef.current.includes("punch") ? " · X Faust (halten = laden)" : ""} · ↑ hingehen &amp; klettern
        {buildSha ? ` · Build ${buildSha.slice(0, 7)}` : ""}
      </p>
    </div>
  );
}

// ── the overlay card ──────────────────────────────────────────────────────────

function Overlay({
  o, level, art, onResolve, onWorldChange, onDismiss, onPay, letters, bonusTotal, bilanz, hubHref, onRestart,
}: {
  o: OverlayState;
  level: PaintLevel;
  /** the level's only-present art map (stem → url): the card portraits and the
   *  goal card's painted title plate both read it */
  art: Record<string, string>;
  onResolve: (o: OverlayState) => void;
  onWorldChange: (o: OverlayState, written?: string) => void;
  onDismiss: (o: OverlayState) => void;
  onPay: (price: number) => void;
  letters: number;
  bonusTotal: number;
  bilanz: Bilanz;
  hubHref: string;
  onRestart: () => void;
}): React.ReactElement {
  const wrap: React.CSSProperties = { ...alignedWrap(o.align), background: "rgba(30, 24, 12, 0.35)" };
  // PK-R6 · H1 (round-1 critique, finding 3): the ceremony panels used to carry
  // their OWN copy of „cream box, 2 px amber, radius 14" — the same surface
  // written twice, in two files, free to drift. The paint now lives once, in the
  // „pb-card" rule (overlay-css), and what stays here is this panel's size.
  const card: React.CSSProperties = { maxWidth: 440, width: o.align === "center" ? "88%" : "46%", minWidth: 300 };
  /** R3-8: every panel wears the same painted staging as a task card — the veil
   *  washes in, the ink bloom wipes, the panel lands a beat later.
   *
   *  PK-R6 · H1 (round-1 critique, ceremonies findings 1 + 7): TWO changes.
   *  · The veil is the DEEP one. A task card's veil keeps the world bright where
   *    the being is, because the card is about that being; a ceremony is about
   *    the child, so the world recedes properly behind it (doc 44 §3.1.2's
   *    „radial veil to near-black, world faintly visible" — at 0.06 alpha in the
   *    middle the classroom wall was neither).
   *  · Every ceremony panel now comes through HERE. Six of them used to inline
   *    their own copy of this markup, which is how a fix like the one above
   *    lands on four cards out of ten and the critic finds the other six. */
  const staged = (children: React.ReactNode, extraClass = ""): React.ReactElement => (
    <div className="pb-veil pb-veil-deep" style={wrap}>
      <InkWipe />
      <div className={`pb-card ${extraClass}`.trim()} style={card}>{children}</div>
    </div>
  );

  if (o.card === "goal") {
    // THE OBJECTIVE SCREEN (doc 44 §2.6, promoted to law from doc 42 §3's GOAL
    // CARD grammar) — the chapter never starts mid-noise: „Dein Auftrag" → the
    // chapter's PAINTED TITLE PLATE, the name set into its lower band → what is
    // bewitched and what freeing looks like → the *Warum* → the collectible
    // legend → „Los geht's!", over a frozen world that fades up behind it.
    //
    // PK-R6 · C: the plate is new here, and so is the legend being COUNTED. The
    // page used to promise „Buchstaben sammeln · Klassenkinder befreien" with no
    // numbers at all, which is the one thing an objective screen may not do —
    // it is the chapter's contract with the child, so every number in it comes
    // from the world (the letter-honesty law, doc 41 §7, applied to the promise
    // rather than to the HUD).
    const plate = level.goalPlate !== undefined ? art[level.goalPlate] : undefined;
    const drained = chapterRoleCount(level, "drained");
    const legend: React.ReactElement[] = [];
    // PK-R6 · H1 (round-1 critique, ceremonies finding 2): these four lines were
    // marked with ✨ 🎨 🔓 📜 — the reader's own operating-system emoji, drawn by
    // a font nobody in this project chose, on the chapter's opening page. They
    // are painted now (cards/PaintedIcons), and the row is a hanging indent so a
    // line that wraps no longer runs back under its own picture.
    const item = (key: string, icon: PaintedIconName, text: React.ReactNode): React.ReactElement => (
      <span key={key} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ display: "flex", marginTop: 1 }}><PaintedIcon name={icon} size={19} art={art} /></span>
        <span>{text}</span>
      </span>
    );
    if (bilanz.lettersTotal > 0) {
      legend.push(item("letters", "spark", <><strong>{bilanz.lettersTotal} {level.collectNounDe}</strong> liegen verstreut — sammle sie ein</>));
    }
    if (drained > 0) {
      legend.push(item("drained", "palette", <><strong>{drained} graue Dinge</strong> warten — sag, was sie sind, dann kommt die Farbe zurück</>));
    }
    if (bilanz.kidsTotal > 0) {
      legend.push(item("kids", "cage", (
        <>
          <strong>{bilanz.kidsTotal === 1 ? "Ein Klassenkind" : `${bilanz.kidsTotal} Klassenkinder`}</strong>
          {" "}steckt fest — finde {bilanz.kidsTotal === 1 ? "es" : "sie"}
        </>
      )));
    }
    if (bilanz.tipsTotal > 0) {
      legend.push(item("tips", "rule", <><strong>{bilanz.tipsTotal} Regel-Seiten</strong> sind aus dem Buch gerissen</>));
    }
    return staged(
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px", fontFamily: "var(--font-label, inherit)" }}>
          Dein Auftrag
        </p>
        {plate !== undefined ? (
          // the painted plate IS the title: the piece is composed with an empty
          // lower band for exactly this, so the chapter's name is set INTO the
          // picture rather than typed above it
          <div style={{ ...plateMount, aspectRatio: "2048 / 1260", margin: "0 0 10px" }}>
            <img src={plate} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <h2
              style={{
                position: "absolute", left: 0, right: 0, bottom: "6%", margin: 0, padding: "0 6%",
                textAlign: "center", fontSize: 19, lineHeight: 1.15,
                color: "#3a2f1c", fontFamily: "var(--font-display, inherit)",
              }}
            >
              {level.name}
            </h2>
          </div>
        ) : (
          <h2 style={{ fontSize: 21, lineHeight: 1.15, margin: "0 0 8px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
            {level.name}
          </h2>
        )}
        <p style={{ fontSize: 15, margin: "0 0 8px", color: "#4a4030", lineHeight: 1.4 }}>{level.goalDe}</p>
        <p style={{ fontSize: 14, margin: "0 0 12px", color: "#7a6a4a", fontStyle: "italic", lineHeight: 1.4 }}>{level.whyDe}</p>
        <div style={{ display: "grid", gap: 5, fontSize: 13.5, color: "#4a4030", margin: "0 0 14px", lineHeight: 1.35 }}>
          {legend}
        </div>
        {/* PK-R6 · H1 (finding 8): starting the chapter is the one thing this
            page wants — it is the warm button now, not a white pill like every
            other control in the game. */}
        <button className="pb-btn-primary" style={{ ...btn, fontSize: 16 }} onClick={() => onDismiss(o)}>Los geht's!</button>
      </div>,
      "pb-page",
    );
  }
  if (o.card === "tip") {
    // R3-16 · A REGEL-SEITE (doc 41 §5). OSWIN tore the unit's rule pages out of
    // the book and scattered them; finding one puts it back. The page shows the
    // rule and nothing else — no question, no score, no „weiter so": it is the
    // one moment in the chapter that is purely a gift.
    return staged(
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 2px", fontFamily: "var(--font-label, inherit)" }}>
          Regel-Seite gefunden
        </p>
        <h2 style={{ fontSize: 19, lineHeight: 1.15, margin: "0 0 10px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)", display: "flex", gap: 9, alignItems: "center" }}>
          {/* the torn page itself, painted — it was an emoji scroll, which is
              the one picture a card about a page out of THIS book may not use */}
          <PaintedIcon name="rule" size={26} art={art} />
          <span>{o.tip?.topicDe}</span>
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.45, margin: "0 0 14px", color: "#4a4030" }}>{o.tip?.merksatzDe}</p>
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Ins Buch kleben</button>
      </div>,
      "pb-page",
    );
  }
  if (o.card === "score") {
    // M-B · beat 2 — THE SCORE PAGE (doc 41 §5), and the beat the round-1 critic
    // called „the clearest juice failure". Its own component, because the
    // celebration needs a clock and a hook may not live behind an `if`.
    return staged(<ScorePage level={level} art={art} bilanz={bilanz} onNext={() => onDismiss(o)} />, "pb-page");
  }
  if (o.card === "out") {
    // M-B · beat 3 — THE DOOR OUT. Inside the canvas, like the two beats before
    // it: the chapter's last frame is never below the fold (the PK-R1 rider).
    //
    // PK-R6 · H1 (findings 2, 6, 8): „🚪✨" was two platform emoji — on Koki's
    // Mac the door renders as a flat brown slab a child reads as a book. It is a
    // painted door standing ajar now, with the boy beside it looking at the way
    // out, and the two buttons stopped being twins: the way ONWARD is the map
    // (this is beat 3 of the chapter-end sequence — „the door out / map return"),
    // so „Zurück" carries the warm treatment and „Noch einmal", which is a
    // retry, is the quiet one. The critic's own hierarchy rule, applied.
    // PK-R6 · H2 (round-2 findings 3 + 4): the door was 76 px of code-drawn icon
    // sharing the score page's staging — „tiny, flat and inert for what should
    // be the game's biggest payoff". The ceremony now has its OWN stage: when
    // the chapter declares a doorPlate (the reviewed batch-ap painting — a full
    // schoolhouse doorway with the light pouring through), the plate IS the
    // scene, with a soft painterly bloom breathing behind it; the code-drawn
    // pair below stays the fallback until the import lands the pixels.
    const door = level.doorPlate !== undefined ? art[level.doorPlate] : undefined;
    return staged(
      <>
        {door !== undefined ? (
          <div style={{ position: "relative", margin: "0 0 10px" }}>
            <div className="pb-door-bloom" aria-hidden />
            <div style={{ ...plateMount, aspectRatio: "1024 / 768" }}>
              <img src={door} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ position: "absolute", left: "6%", bottom: "4%", display: "flex", alignItems: "flex-end" }}>
              <PaintedHero art={art} height={72} pose="stand" />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, margin: "0 0 8px", minHeight: 88 }}>
            <PaintedHero art={art} height={84} pose="stand" />
            <PaintedIcon name="door" size={76} art={art} />
          </div>
        )}
        <p style={{ fontSize: 17, margin: "0 0 12px" }}>
          Die Buchstaben fliegen zurück auf die Tafel — und die Tür zum nächsten Kapitel geht auf.
        </p>
        <a href={hubHref} className="pb-chip pb-btn-primary" style={{ ...btn, textDecoration: "none", display: "inline-block" }}>← Zurück</a>
        <button onClick={onRestart} className="pb-btn-ghost" style={{ ...btn, marginLeft: 10 }}>↻ Noch einmal</button>
      </>,
    );
  }
  if (o.card === "grant") {
    return staged(
      <>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, margin: "0 0 6px" }}>
          <PaintedIcon name="book" size={40} />
          <PaintedIcon name="spark" size={26} />
        </div>
        <p style={{ fontSize: 17, margin: "0 0 4px" }}><strong>Fibel</strong> schenkt dir die <strong>FAUST</strong>!</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Halte <strong>X</strong> zum Laden — wirf sie auf Knoten und Kreide!</p>
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }
  if (o.card === "cagehint") {
    // PK-R6 · D — FOUND HERE, NOT LOOKED FOR: this card still taught the FIST.
    // Stage C2 made ↑ the verb that opens a cage precisely because ch01 grants
    // no fist any more (doc 44 §4), and the sim's hint gate was widened with
    // it — but the card the gate opens kept telling a six-year-old to press X
    // for a button this chapter never gives them, in front of the one cage
    // every child must open. ↑ is the true instruction in EVERY chapter (a
    // press opens a cage whether or not a fist was granted), so it is what the
    // one teaching moment says.
    // PK-R6 · H1 (round-1 critique, finding 4): …and it was teaching it with a
    // system emoji. The one card that says „this shape means somebody is caged"
    // now SHOWS the shape — bars, a shut latch, a warm light behind them — so
    // the child learns the silhouette they then have to spot in the world.
    return staged(
      <>
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 2px" }}><PaintedCage /></div>
        <p style={{ fontSize: 17, margin: "0 0 4px" }}>Da steckt jemand fest!</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Stell dich davor und drück <strong>↑</strong> — dann geht sie auf.</p>
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Alles klar!</button>
      </>,
    );
  }
  if (o.card === "bonuspay") {
    // PB-R1 · R3-2: every number here is READ — the door's own price and the
    // bonus room's own letter count. A card may never state a number the data
    // does not: „10" against a phase carrying 8 is how Klecks became unpayable.
    const price = o.price ?? 0;
    const can = letters >= price;
    return staged(
      <>
        {/* Klecks himself, painted: the emoji here was 🖤 — a black heart, which
            is not an ink imp in any font on any machine */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 6px" }}><PaintedIcon name="blot" size={38} /></div>
        <p style={{ fontSize: 16, margin: "0 0 4px" }}><strong>Klecks</strong> grinst: „{price} Buchstaben, und die Tür ist deine. Drinnen warten {bonusTotal} — schaffst du alle, bevor die Tinte trocknet?"</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>
          Du hast {letters} <PaintedIcon name="spark" size={16} /> — {can ? "bezahlen?" : `sammle erst ${price}!`}
        </p>
        {can && <button className="pb-btn-primary" style={btn} onClick={() => onPay(price)}>{price} zahlen &amp; rein</button>}
        <button className="pb-btn-ghost" style={{ ...btn, marginLeft: can ? 10 : 0 }} onClick={() => onDismiss(o)}>Später</button>
      </>,
    );
  }
  if (o.card === "ceremony") {
    // W6 · R3-14 · CONTEXTUALIZATION (doc 41). Two fixes from Koki's replay:
    //  · Merle is a classmate the child already KNOWS. „Nice to meet you" was
    //    the wrong frame for a rescue, so that card is gone from the set (it is
    //    a restore card now) and she simply greets a friend here.
    //  · „Richtung Lager" was said as if the camp had ever been introduced. The
    //    FIRST rescue now names it — after that the phrase has a referent, and
    //    every „zum Lager" in the chapter reads.
    const merle = o.ceremony?.classmate === "merle";
    return staged(
      <>
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 6px" }}>
          <PaintedIcon name={merle ? "palette" : "wisp"} size={38} />
        </div>
        {merle ? (
          // PK-R6 · D: this beat comes at the END of the six rounds now, not at
          // the latch — so the copy says what the child just watched happen
          // (the colour flooding back) instead of announcing a hop out of a
          // pencil case they saw six rounds ago. And she STAYS: doc 44 §1's
          // „redemption changes state, never presence" was contradicted by the
          // old line, which sent her off to the camp while the world kept her
          // standing at her cage waving. The world was right; the card was not.
          <>
            <p style={{ fontSize: 17, margin: "0 0 2px" }}>Die Farbe strömt zurück — <strong>Merle</strong> ist wieder da!</p>
            <p style={{ fontSize: 16, margin: "0 0 2px" }}>„Hello! I'm Merle. Thanks!“</p>
            <p style={{ fontSize: 13, color: "#6b6250", margin: "0 0 10px" }}>(Hallo! Ich bin Merle. Danke!) — Sie bleibt in der Klasse und winkt dir zu.</p>
          </>
        ) : (
          <p style={{ fontSize: 16, margin: "0 0 10px" }}>
            Ein Buchstaben-Wesen flattert frei und dreht eine Freudenrunde! <PaintedIcon name="spark" size={17} />
          </p>
        )}
        {o.ceremony?.first === true && (
          <p style={{ fontSize: 14, color: "#7a6a4a", fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.45 }}>
            Das Buch flüstert: „Bring alle, die du befreist, zum <strong>Lager am Rand der Seite</strong> — dort wartet die Klasse.“
          </p>
        )}
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }
  if (o.card === "console") {
    return staged(
      <>
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 6px" }}><PaintedIcon name="slate" size={40} /></div>
        {/* F2-24: the child WROTE the word on the finale card — this beat now
            answers that act instead of narrating it in their place */}
        <p style={{ fontSize: 16, margin: "0 0 4px" }}>Niemand hat je etwas <em>Nettes</em> auf sie geschrieben.</p>
        {/* PK-R6 · H1 (round-1 critique, finding 1): the copy points AT the
            board, which now really does carry the child's word in chalk and
            really does bloom (PaintScene.chalkTheGift). A finale that was put
            down wrote nothing, so that line is not offered — the card never
            describes a picture the child cannot see. */}
        {o.typed.trim() !== "" ? (
          <p style={{ fontSize: 16, margin: "0 0 10px" }}>
            Schau auf die Tafel: Da steht dein <strong>{o.typed.trim()}</strong> in Kreide — und sie blüht sonnengelb auf. Sie kommt mit ins Lager!
          </p>
        ) : (
          <p style={{ fontSize: 16, margin: "0 0 10px" }}>Sie ist müde und ganz still. Sie kommt trotzdem mit ins Lager!</p>
        )}
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }
  if (o.card === "bonusend") {
    const b = o.bonusend!;
    const perfect = b.got >= b.total;
    return staged(
      <>
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 6px" }}>
          <PaintedIcon name={perfect ? "rosette" : "blot"} size={40} />
        </div>
        <p style={{ fontSize: 16, margin: "0 0 10px" }}>
          {perfect
            ? `PERFEKT! Alle ${b.total} Buchstaben — Klecks stempelt dir einen Sticker auf die Karte!`
            : b.timeout
              ? `Die Tinte ist getrocknet — ${b.got} von ${b.total}. Klecks zwinkert: „Komm wieder!"`
              : `${b.got} von ${b.total} — Klecks zwinkert: „Fast! Komm wieder!"`}
        </p>
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }

  // ── the task card — the v2 card kit (machines + painted skins) ──
  // key by task id so CardHost re-mounts (fresh machine state) per task.
  return (
    <CardHost
      key={o.item!.id}
      task={o.item!}
      align={o.align}
      art={art}
      portraitWash={o.wash}
      round={o.round}
      // doc 44 §2.9: the timer class comes from the pool the WORLD asked for
      servedUse={o.req.use}
      onWorldChange={(written) => onWorldChange(o, written)}
      onResolve={() => onResolve(o)}
      onDismiss={() => onDismiss(o)}
    />
  );
}

/** PK-R6 · H1 · M-B beat 2 — THE SCORE PAGE, WITH ITS FANFARE.
 *
 *  THE ROUND-1 VERDICT, verbatim: „a chapter-completion moment rendered as a
 *  static ‚0 von X' checklist with no count-up, no particles, no character
 *  reaction — the emotional payoff Rayman-tier games always sell with a fanfare
 *  beat is simply absent here." Three things were missing and all three are
 *  here now, in the order a child meets them:
 *
 *   1 THE CHILD. He hops up onto the page in the leap pose — the one whose own
 *     dossier note is „both hands rise above shoulder line, open, fingers spread
 *     wide — the silhouette FLARES" — wearing `head_celebrate`, a painted face
 *     that had been sitting on disk unused since the rig landed. Not a new
 *     drawing: the SHIPPED rig, composed by cards/ceremony's pure layout, so the
 *     figure celebrating is the boy the child has been playing.
 *   2 THE BURST, thrown around him, as big as the run earned (never nothing —
 *     reaching this page IS the chapter; never full unless everything was found,
 *     because confetti over a 0/32 run is mockery).
 *   3 THE TALLIES, counting themselves up line by line instead of appearing
 *     already finished. Every number still comes from the run (see Bilanz) and
 *     the count-up provably never overshoots it (cards/ceremony.test).
 *
 *  Reduced motion gets all three as finished pictures: the clock starts at
 *  Infinity, so every line reads its final number on the first frame and the
 *  CSS kills the hop and the motes (the end-states law).
 */
function ScorePage({
  level, art, bilanz, onNext,
}: {
  level: PaintLevel;
  art: Record<string, string>;
  bilanz: Bilanz;
  onNext: () => void;
}): React.ReactElement {
  // PK-R6 · C: the classmates line counts CLASSMATES. It used to count every
  // cage under that label — true only while every cage held one, which the new
  // cage law (doc 44 §2.3) ends. Beings freed from the unit's other cages get
  // their own line, and it is not drawn when the chapter has none (the same
  // rule the Regel-Seiten chip obeys).
  const rows: Array<{ icon: PaintedIconName; labelDe: string; got: number; total: number }> = [
    { icon: "cage", labelDe: "Klassenkinder befreit", got: bilanz.kids, total: bilanz.kidsTotal },
  ];
  if (bilanz.freedTotal > bilanz.kidsTotal) {
    rows.push({ icon: "wisp", labelDe: "Wesen befreit", got: bilanz.freed - bilanz.kids, total: bilanz.freedTotal - bilanz.kidsTotal });
  }
  if (bilanz.tipsTotal > 0) rows.push({ icon: "rule", labelDe: "Regel-Seiten gefunden", got: bilanz.tips, total: bilanz.tipsTotal });
  rows.push({ icon: "spark", labelDe: `${level.collectNounDe} gesammelt`, got: bilanz.letters, total: bilanz.lettersTotal });
  if (bilanz.booksTotal > 0) rows.push({ icon: "book", labelDe: "Bonus-Bücher", got: bilanz.books, total: bilanz.booksTotal });

  const ms = useCeremonyClock(countUpTotalMs(rows.length));
  const completion = runCompletion(rows);
  const hero = heroArtPresent(art);
  const alle = bilanz.freed >= bilanz.freedTotal;

  // PK-R6 · H2 (round-2 finding 3): the score page gets its OWN painted plate
  // once the reviewed batch-ap treasures painting is imported and declared —
  // until then the hero + burst carry the stage alone (the fallback proof).
  const scorePlate = level.scorePlate !== undefined ? art[level.scorePlate] : undefined;
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 2px", fontFamily: "var(--font-label, inherit)" }}>
        Das Buch schreibt mit
      </p>
      {scorePlate !== undefined && (
        <div style={{ ...plateMount, aspectRatio: "1024 / 768", margin: "0 0 8px" }}>
          <img src={scorePlate} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      {/* the stage is AUTO height on purpose: the rig's cells carry generous
          transparent margins, so a fixed box either crops his flare or leaves a
          hole under his shoes. The negative margins pull the label and the title
          back in against that transparent padding. */}
      <div style={{
        position: "relative", display: "flex", justifyContent: "center",
        margin: hero ? "-14px 0 -18px" : "0 0 2px", minHeight: hero ? 0 : 30,
      }}>
        <CeremonyBurst completion={completion} />
        <PaintedHero art={art} height={104} className="pb-hero-in" />
      </div>
      <h2 style={{ fontSize: 21, lineHeight: 1.15, margin: "0 0 8px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)", textAlign: "center" }}>
        {level.name}
      </h2>
      {rows.map((r, i) => (
        <div
          key={r.labelDe}
          className="pb-score-row pb-row-in"
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "6px 0",
            // PK-R6 · H2 (round-2 finding 6, „a static settings list"): the rows
            // ENTER the page in sequence, each arriving just before its own
            // count-up starts — the page writes itself line by line. The delay
            // mirrors the count-up stagger so entrance and tally stay one beat.
            animationDelay: `${i * COUNT_UP_STAGGER_MS}ms`,
          }}
        >
          <span style={{ fontSize: 15, color: "#4a4030", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <PaintedIcon name={r.icon} size={20} art={art} />
            {r.labelDe}
          </span>
          <strong className="pb-count" style={{ fontSize: 17, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)", whiteSpace: "nowrap" }}>
            {countUpAt(r.got, ms, i)} von {r.total}
          </strong>
        </div>
      ))}
      <p style={{ fontSize: 15, margin: "14px 0 14px", color: "#7a6a4a", fontStyle: "italic", lineHeight: 1.45 }}>
        {alle
          ? "»Du hast uns alle gefunden!«, sagt Fibel. »Die Seite ist wieder voll.«"
          : "»Danke!«, ruft die Klasse aus dem Lager. »Ein paar von uns warten noch.«"}
      </p>
      <button className="pb-btn-primary" style={{ ...btn, fontSize: 16 }} onClick={onNext}>Seite umblättern</button>
    </div>
  );
}

/** PK-R3b · R3-17 · ONE HUD CHIP (doc 41 §5, presentation per doc 42 §5). A
 *  counter painted in the book's own materials rather than typed onto the page:
 *  gouache cream, an amber contour, the label face. The label is spelled out —
 *  F2-33's law that every number says what it counts survives the re-skin.
 *
 *  PK-R6 · H1 (round-1 critique, ceremonies findings 1 + 2): it was not painted,
 *  it was a WEB BADGE — a flat fill, a 999 px pill, one hairline, and a platform
 *  emoji for a picture. The chips sit above the canvas on the page, which is
 *  precisely why they were the flattest surface in the frame. The paper, the ink
 *  edge and the four disagreeing corners are now the `pb-hud-chip` rule, and the
 *  picture is painted (cards/PaintedIcons) — so the bar belongs to the book. */
/** PK-R6 · H2 · THE PLATE MOUNT, shared. H1 mounted the goal plate „in the
 *  book's own materials" — but its crisp 1-px inner light ring is exactly what
 *  the round-2 critic read as „a digital glow overlay over the painted door".
 *  The ring is gone: the mount keeps the disagreeing corners, the amber
 *  contour and a SOFT inset shade only — paper holds a picture with shadow,
 *  not with rim light. One object, three ceremonies (goal · score · door),
 *  so the next reviewer changes it in one place. */
const plateMount: React.CSSProperties = {
  position: "relative", width: "100%",
  borderRadius: "15px 10px 16px 11px / 11px 16px 10px 15px",
  overflow: "hidden", border: "2px solid #b78d51",
  boxShadow: "inset 0 2px 10px rgba(120, 96, 52, 0.28), 0 2px 10px rgba(40,28,12,0.18)",
};

function Chip({ icon, label, value, art }: { icon: PaintedIconName; label: string; value: string; art?: Record<string, string> }): React.ReactElement {
  return (
    <span className="pb-hud-chip" style={{ fontFamily: "var(--font-label, inherit)", fontSize: 13 }}>
      <PaintedIcon name={icon} size={17} art={art} />
      {label}
      <strong style={{ fontSize: 15, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>{value}</strong>
    </span>
  );
}

/** PK-R6 · H1 (round-1 critique, finding 3): a ceremony's chip was a WHITE
 *  rectangle with an 8 px radius — the single flattest thing on a painted page,
 *  and it sat on the objective screen the chapter opens with. Its paint is now
 *  the „pb-card button" rule in overlay-css, the same one the task cards' chips
 *  wear; what stays here is size and face. */
const btn: React.CSSProperties = {
  fontSize: 15,
  padding: "8px 16px",
  cursor: "pointer",
  fontFamily: "var(--font-label, inherit)",
  fontWeight: 600,
};

/** Pointer-capture touch buttons writing straight into the shared pad.
 *
 *  PK-R6 · C2: the touch pad now obeys the same law the keyboard bar below it
 *  has obeyed since PB-F3 — it only offers verbs the child actually has. ch01
 *  grants no fist at all (doc 44 §4), so a permanent ✊ that does nothing would
 *  be exactly the „reads as broken" defect F2-34 removed from the hint line,
 *  and worse on a tablet, where the button is the only thing telling a
 *  six-year-old what they can do. */
function TouchPad({ pad, canPunch }: { pad: Pad; canPunch: boolean }): React.ReactElement {
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
        {/* PK-R6 · C1: ↑ is no longer only a climb — it is the verb that
            reaches a drained thing (entities.ENGAGEABLE_ROLES), which is what
            the ↑ cue in the world is pointing at. */}
        <button aria-label="hingehen und klettern" style={zone} {...bind("up")}>↑</button>
        {canPunch && <button aria-label="Faust" style={zone} {...bind("punch")}>✊</button>}
        <button aria-label="springen" style={{ ...zone, width: 84 }} {...bind("jump")}>⤒</button>
      </div>
    </div>
  );
}
