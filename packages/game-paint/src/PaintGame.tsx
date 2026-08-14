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
import type { TipPayload } from "./sim.ts";
import { Merkseite, RuleFound, RuleRead } from "./cards/RulePage.tsx";
import { PerfProbe, type FirstFrameReport, type PerfReport, type WeakEstimate } from "./perf.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { LOGICAL_H, LOGICAL_W, LOOP_FPS, RENDER_SCALE, airModelByName } from "./paint.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";
import type { GameTaskV2 } from "@domigo/content-schema";
import { CardHost } from "./cards/CardHost.tsx";
import { Key, KeyBit } from "./cards/Glance.tsx";
import { type AuftaktCard, auftaktExit, auftaktPosition, auftaktStep, auftaktTasks } from "./cards/auftakt.ts";
import { type ArenaBeat, arenaExit, arenaLines, arenaPosition, arenaStep } from "./cards/arena.ts";
import { answerTextOf } from "./cards/resolution.ts";
import { tierOfAsker } from "./cards/serving.ts";
import { windowMsFor } from "./cards/timer.ts";
import { prefersReducedMotion } from "./cards/motion.ts";
import { askerIdOf } from "./sim.ts";
import { InkWipe, PaintedCage, type CardAlign, alignedWrap } from "./cards/CardShell.tsx";
import { PAINT_OVERLAY_CSS } from "./cards/overlay-css.ts";
import { PaintedIcon, type PaintedIconName } from "./cards/PaintedIcons.tsx";
import { CeremonyBurst, PaintedHero, SceneCut, useCeremonyClock } from "./cards/CeremonyStage.tsx";
import { COUNT_UP_STAGGER_MS, type PhraseSlot, countUpAt, countUpTotalMs, heroArtPresent, runCompletion } from "./cards/ceremony.ts";
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
  /** R5-N3 · E4 · teacher door `?warm=0`: run without the pre-warmer, so the
   *  fix can be measured against itself on one build. */
  noWarm?: boolean;
  /** R5-W1 · E1: attach the measuring instrument (teacher door, ?perf=1).
   *  Off ⇒ the probe is never constructed and nothing is wrapped. */
  debugPerf?: boolean;
  /** R5-W2 · I1 · a Regel-Seite was found. THE ONE SEAM out of this package.
   *
   *  `game-paint` writes nothing — no fetch, no storage — and that is a property
   *  worth keeping: it is why the proof tapes can replay the whole chapter in
   *  CI. So the chapter's own Merkseite is in-memory here, and the durable
   *  library (which outlives the run, and the chapter) is the APP's job. The
   *  game says what happened; the shell decides what to keep. */
  onTipCollected?: (tip: TipPayload) => void;
  /** R5-W2 · J1-B · has this child already read this chapter's opening?
   *
   *  Same seam as `onTipCollected`, for the same reason: the package asks no
   *  storage anything, the shell answers. Undefined ⇒ SHOW the opening — what
   *  every test fixture, the card bench and the proof tapes get for free, and
   *  the safe default in both directions (the worst case is a child seeing a
   *  good opening twice). */
  openingSeen?: boolean;
  /** …and the ear: fired once, when the last beat is put down. */
  onOpeningRead?: () => void;
}

/** R5-W1 · D1 · THE CARD BENCH (dev-only, `?karten=<id>`). It lives behind this
 *  module rather than beside it on purpose: `@domigo/game-paint/game` is the ONE
 *  chunk allowed to contain Phaser (scripts/check-game-bundle.mjs), so a bench
 *  imported through its own entry point would put a second copy there and fail
 *  the build. Entering here costs nothing — no scene is created, no game boots.
 *  The bench itself is loaded lazily, so its bytes never sit in the chunk the
 *  playing child downloads.
 *
 *  `Overlay` is handed DOWN rather than imported UP, which keeps the bench free
 *  of this module and this module free of a cycle. */
const CardGalleryLazy = React.lazy(() => import("./dev/CardGallery.tsx"));

export function PaintDevGallery(props: {
  level: PaintLevel;
  art: Record<string, string>;
  tasks: GameTaskItem[];
  which?: string;
}): React.ReactElement {
  return (
    <React.Suspense fallback={<p style={{ fontSize: 15 }}>Bench lädt …</p>}>
      <CardGalleryLazy {...props} Overlay={Overlay as never} />
    </React.Suspense>
  );
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
  /** R5-N3 · E4: the level start — the wait, the build, and the first drawn
   *  frame. Awaited, because GPU results arrive long after the frame does. */
  firstFrame: (settleMs?: number) => Promise<FirstFrameReport>;
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
  // R5-W2 · J1-B: the opening's four beats. `goal` is beat 1 — the value the boot
  // state writes, the ceremony beat sim.ts already carries, and the address the
  // card bench photographs. Their ORDER is deliberately NOT here: it lives in
  // cards/auftakt.ts, where a test can walk it from both ends without a DOM.
  card: AuftaktCard | ArenaBeat | "task" | "finale" | "grant" | "bonuspay" | "ceremony" | "console" | "bonusend"
    | "cagehint" | "tip" | "regel" | "merkseite" | "score" | "out";
  attempts: number;
  typed: string;
  /** R5-W2 · H1 · wie lang die Uhr dieser Karte läuft, in ms — 0 heisst „keine".
   *  Einmal in `openCard` gerechnet (die einzige Stelle, die Pool, Wesen und
   *  Level zugleich kennt) und dann getragen, nicht neu hergeleitet. */
  clockMs?: number;
  /** PB-F1/F2-20: which side of the canvas the card sits on — always AWAY from
   *  the being it is about, so „schau sie an" is physically possible. */
  align: CardAlign;
  /** R5-C1: `captiveDe` is WHAT was in there and `person` is whether it was a
   *  who. Both used to be missing, and the card guessed for all five cages at
   *  once — „Ein Buchstaben-Wesen flattert frei" over a tablet, a chair and a
   *  class photo. The skin cannot tell them apart: four of the five are the
   *  same satchel. */
  ceremony?: { skin: string; captiveDe: string; person: boolean; first: boolean };
  /** R5-C1: the one teaching card names the one cage it fired at. */
  cagehint?: { captiveDe: string };
  bonusend?: { got: number; total: number; timeout: boolean; secsLeft: number; phrase: PhraseSlot[][] };
  /** bonuspay: what THIS door costs, read from its own params (PB-R1 · R3-2). */
  price?: number;
  /** tip: the Regel-Seite's own rule, carried from the level (PK-R3b · R3-16).
   *  R5-W2 · I1: the whole payload now, because the reading card's second stage
   *  shows the example and its source, not only the Merksatz. */
  tip?: TipPayload;
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

/** R5-C1 · WHO OR WHAT IS IN THAT CAGE — from the cage, never from a table in
 *  here. Chapter 1 hangs four of its five cages on the same `satchel` shell, so
 *  the shell is not an identity; `captiveDe` is, and the `cage-captive` law
 *  guarantees every cage declares one. `person` keys off `classmate`, the field
 *  the cage laws already police, instead of the hardcoded „merle" the ceremony
 *  card used to compare against (which silently made every OTHER chapter's
 *  classmate a thing). */
const captiveOfCage = (level: PaintLevel, id: string): { captiveDe: string; person: boolean } => {
  const e = allPhasesOf(level).flatMap((p) => p.entities).find((x) => x.id === id);
  return {
    captiveDe: String(e?.params?.captiveDe ?? ""),
    person: e?.params?.classmate !== undefined,
  };
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

export default function PaintGame({ level, art, tasks, hubHref, buildSha, startPhase, debugGrid, debugPerf, noWarm, onTipCollected, openingSeen, onOpeningRead,}: PaintGameProps): React.ReactElement {
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
  /** R5-N3 · E4: the level-start readout, teacher door only. */
  const [startLine, setStartLine] = useState<string | null>(null);
  const [coarse, setCoarse] = useState(false);
  // R3-8 · THE BOOT CEREMONY (doc 42 §3). The child never spawns mid-noise:
  // the chapter opens on a painted book page that names the Auftrag, the
  // chapter, the *Warum* and what there is to collect, over a frozen world.
  // It is the FIRST thing rendered, so the freeze exists before the first tick.
  // R5-W2 · J1-B: …unless this child has read it before. Chosen in the STATE
  // INITIALISER, not in an effect — an effect would mount the opening and tear
  // it down a frame later, and a card that flashes is worse than one that stays.
  const [overlay, setOverlay] = useState<OverlayState | null>(() =>
    openingSeen === true ? null : {
      req: { use: "quickfire", ctx: { type: "ceremony", beat: "goal" } },
      item: null, card: "goal", attempts: 0, typed: "", align: "center",
    });
  /** has the opening been read to its end? (the world fades up once, at beat 4)
   *  R5-W2 · J1-B: a returner has no card to put down, so the world is already
   *  up — otherwise the skip would hand them a world that never fades in. */
  const [booted, setBooted] = useState(openingSeen === true);
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
  /** R5-W2 · H1 (Teil 3): die Arena-Anleitung, einmal je Kapitel. */
  const arenaBriefShownRef = useRef(false);
  const [freedCount, setFreedCount] = useState(0);
  const [freedKids, setFreedKids] = useState(0);
  // ── PK-R3b · R3-16/17 · the collectibles that OUTLIVE a phase mount ────────
  // Coming back from the Kleckskammer remounts the phase you left, so anything
  // the chapter counts has to be remembered out here — exactly like freed cages.
  /** R5-W2 · I1: the PAGES taken this chapter, not just their ids. The archive
   *  („die Merkseite") re-reads them after the world has already deleted the
   *  pickup, and a phase remount is the only other place the payload exists —
   *  so what is not banked here is gone. Kept apart from the books because the
   *  HUD counts them apart. */
  const tipsTakenRef = useRef<TipPayload[]>([]);
  const booksTakenRef = useRef<string[]>([]);
  const [tipsCount, setTipsCount] = useState(0);
  /** R5-W2 · I1: the same pages as a rendered value. The ref above is the one
   *  that survives a phase remount; this is what the Merkseite reads, because a
   *  component that re-renders on the COUNT would otherwise be handed the
   *  previous render's list. */
  const [collectedTips, setCollectedTips] = useState<readonly TipPayload[]>([]);
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

  /** R5-W2 · H1 · WIE LANG DIESE KARTE LÄUFT — an EINER Stelle entschieden.
   *
   *  `openCard` ist die einzige Stelle, die Pool, Wesen und Level gleichzeitig
   *  in der Hand hat, also wird die Zahl hier gerechnet und mitgeführt statt in
   *  der Karte noch einmal hergeleitet. Dasselbe Paar Funktionen rechnet sie im
   *  Tor nach, also können Spiel und Prüfung nicht auseinanderlaufen — sie
   *  taten es (Tor las den AUTORIERTEN Pool, die Laufzeit den SERVIERTEN). */
  const clockMsOf = (next: OverlayState): number =>
    next.item === null
      ? 0
      : windowMsFor(
        next.req.use,
        next.item.kind,
        tierOfAsker(level, sceneRef.current?.getState()?.phase ?? "", askerIdOf(next.req.ctx)),
        prefersReducedMotion(),
      );

  /** The one door every card comes through, so the hold can hold it. */
  const openCard = (next: OverlayState): void => {
    const withClock: OverlayState = { ...next, clockMs: clockMsOf(next) };
    if (holdRef.current) { queuedRef.current = withClock; return; }
    changedRef.current = false;
    setOverlay(withClock);
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
    // R5-W2 · J1-B · THE OPENING'S FOUR BEATS, on the same device the reading
    // card uses (`tip → regel`, below): hand over and return WITHOUT touching
    // the scene.
    //
    // `sceneRef.current?.setOverlay(false)` deliberately does NOT run here, and
    // the reason is stronger than for the rule page. On a rule page the world
    // would be un-frozen a beat too early; on the OPENING it has never been
    // un-frozen at all — the boot ceremony is the first thing rendered, so the
    // freeze exists before the first tick. Un-freezing between beat 2 and beat 3
    // would start the chapter running underneath a card the child is still
    // reading, which is the class pickups.test.ts's „a Regel-Seite FREEZES the
    // world" was written for.
    // R5-W2 · H1 (Teil 3) · DIE ARENA-ANLEITUNG, auf demselben Gerät.
    // Der Unterschied zum Auftakt ist der letzte Takt: hier MUSS die Welt
    // zurück, denn sie lief vorher schon — das Kind stand mitten im Spiel, als
    // die Karte kam. `arenaExit` sagt beides in einem Booleschen.
    const arena = arenaExit(o.card);
    if (arenaPosition(o.card) !== null) {
      if (arena.next !== null) { setOverlay({ ...o, card: arena.next }); return; }
      setOverlay(null);
      sceneRef.current?.setOverlay(false); // der Kampf darf jetzt losgehen
      return;
    }
    const auftakt = auftaktExit(o.card);
    if (auftakt.next !== null) {
      setOverlay({ ...o, card: auftakt.next });
      return;
    }
    // …and the LAST beat starts the chapter. `setBooted` moved here from `goal`:
    // the world fades up when the DOOR closes behind the opening, not when its
    // first page turns. Three beats in front of a still-black world is a bug
    // that looks like a design.
    if (auftakt.boot) { setBooted(true); onOpeningRead?.(); }
    // M-B beat 2 → beat 3: the score page taps forward to the door out. Both
    // live inside the canvas, so the chapter never ends off screen.
    if (o.card === "score") {
      setOverlay({ ...o, card: "out", req: { use: "quickfire", ctx: { type: "ceremony", beat: "out" } } });
      return;
    }
    // R5-W2 · I1 · the reading card's own two beats, on the same device: the
    // find hands over to the rule. `setOverlay(false)` deliberately does NOT run
    // here — the world stays frozen across BOTH beats, because a rule is read in
    // peace (sim.ts) and un-freezing under a card the child is still reading is
    // the exact class pickups.test.ts:„the freeze" was written for.
    if (o.card === "tip") {
      setOverlay({ ...o, card: "regel", req: { use: "quickfire", ctx: { type: "ceremony", beat: "tip" } } });
      return;
    }
    sceneRef.current?.setOverlay(false);
    setOverlay(null);
  };

  /** R5-W2 · J1-B · ONE BEAT BACK. The brief's rule: „ein Auftakt darf nicht
   *  schneller sein als das Lesen" — a child who wants beat 2 again comes back.
   *
   *  It stores NOTHING. A back-pointer on OverlayState would make the opening a
   *  graph (four beats, four remembered predecessors, four ways to be wrong);
   *  the index into AUFTAKT makes it the line it actually is. Termination is
   *  then arithmetic rather than a promise: the index strictly decreases and the
   *  chain answers null at its end, so „zurück" on beat 1 is not drawn AND could
   *  not fire if it were. Like the forward step it never touches the scene. */
  const backCard = (o: OverlayState): void => {
    const prev = auftaktStep(o.card, -1);
    if (prev === null) return;
    setOverlay({ ...o, card: prev });
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
      // R5-W2 · E3 · THE SLOW-MOTION FIX — why these three numbers.
      //
      // Koki: "laggy = Zeitlupe ab Levelstart, im Boss-Level normal". Measured,
      // it is not a frame-cost problem at all — it is Phaser's delta smoothing
      // lying to the simulation. `TimeStep.smoothDelta` does this:
      //
      //     if (delta > this._min) { delta = history[idx];
      //                              delta = Math.min(delta, this._min); }
      //     history[idx] = delta;                    // ← the clamped value
      //
      // With `min: 30` that is `_min = 33.3 ms`. Drive the loop at a real 50 ms
      // (20 fps) and the world is told **16.67 ms**, forever: the history only
      // ever receives clamped values, so it never recovers. The world then runs
      // at 16.67/50 = ONE THIRD speed for as long as frames stay under 30 fps —
      // smoothly, because the value is averaged over ten frames. That is not a
      // stutter, that is slow motion, and it is exactly what he saw.
      //
      // On top of that, `resetDelta()` (called on boot, on focus and on tab
      // resume) sets `_coolDown = panicMax = 120`, and during the cool-down the
      // clamp tightens to `_target` = 16.67 ms. So for the first ~2 seconds of
      // EVERY level, anything short of a full 60 fps produced slow motion —
      // "ab Levelstart". The Boss level escapes it because its first frame costs
      // 31.9 ms against the field phases' 224.0 ms (measured: 114 objects vs
      // 476, and 212 ms of that is the GPU taking the phase's textures).
      //
      //   min: 10      → `_min` = 100 ms, the SAME cap PaintScene.update already
      //                  applies to its accumulator. The two agree instead of
      //                  fighting: a 50 ms frame now reports 50 ms, so the world
      //                  keeps wall-clock time and a slow machine STUTTERS
      //                  instead of going quietly slow. Past 100 ms both clamp,
      //                  which is the spiral-of-death guard doing its job.
      //   panicMax: 8  → the boot/resume window shrinks from ~2 s to ~0.13 s,
      //                  still long enough to swallow the one huge delta after a
      //                  tab resume, far too short to be felt.
      //   target: 60   → unchanged.
      //
      // ⚠ FABLE-REVIEW: this deliberately trades "smooth but wrong" for "honest
      // but visibly rough" on weak devices, per the E3 brief §2. A slow machine
      // will now look choppy where it used to look sluggish. That is the point —
      // slow motion hides frame drops, and hidden drops never get fixed.
      fps: { ...LOOP_FPS },
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
            warmed: () => sceneRef.current?.warmReport() ?? null,
          })
        : null;
    probe?.install(PaintScene.prototype);
    // Re-read every few seconds so a phase change refreshes the line. `null`
    // columns are printed as "?" rather than hidden — a missing number is
    // information, and the one thing this must never do is invent one.
    const startTimer =
      probe === null
        ? null
        : window.setInterval(() => {
            void probe.firstFrame(2200).then((r) => {
              const ms = (v: number | null): string => (v === null ? "?" : v.toFixed(1));
              const w = r.warmed as { done?: number; queued?: number; pipelines?: boolean } | null;
              setStartLine(
                `${r.phase}  laden ${ms(r.loadMs)} ms (${r.filesQueued} Bilder)  ·  aufbau ${ms(r.createMs)} ms\n` +
                  `ERSTES BILD  GPU ${ms(r.firstGpuMs)} ms  ·  danach ${ms(r.settledGpuMs)} ms  ·  ${r.firstDrawCalls ?? "?"} Zeichenaufrufe\n` +
                  `vorgewärmt ${w?.done ?? "—"} (offen ${w?.queued ?? "—"}, Shader ${w?.pipelines === true ? "ja" : "nein"})`,
              );
            });
          }, 5000);
    // Its own read handle, because __domigoPaint below is dev-only and the
    // numbers that matter come from a production build.
    if (probe !== null) {
      window.__domigoPaintPerf = {
        read: () => probe.read(),
        reset: () => probe.reset(),
        sample: (frames) => probe.sample(frames),
        drive: (frames, deltaMs) => probe.drive(frames, deltaMs),
        firstFrame: (settleMs) => probe.firstFrame(settleMs),
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
        arenaBriefShown: () => arenaBriefShownRef.current,
        collectedPickupIds: () => [...tipsTakenRef.current.map((t) => t.id), ...booksTakenRef.current],
        airModel,
        spawnCell: fromBonus ? ret.spawn : undefined,
        debugGrid,
        noWarm,
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
          onTip: (tip) => {
            if (!tipsTakenRef.current.some((t) => t.id === tip.id)) tipsTakenRef.current = [...tipsTakenRef.current, tip];
            setTipsCount(tipsTakenRef.current.length);
            setCollectedTips(tipsTakenRef.current);
            onTipCollected?.(tip);
            openCard({
              req: { use: "quickfire", ctx: { type: "ceremony", beat: "tip" } },
              item: null, card: "tip", attempts: 0, typed: "", align: "center",
              tip,
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
          onCageHint: (cageId) => {
            // PB-F3 · F2-8: the first time the child stands next to a cage the
            // fist can open, say so — once per chapter, never again.
            // PB-R1 · R3-1: the sim now asks before it freezes (cageHintShown),
            // so this branch should be unreachable. It stays as the second half
            // of the freeze pairing law: a shell that declines a card ALWAYS
            // resumes the world. Declining silently is what froze ch01.
            if (cageHintShownRef.current) { sceneRef.current?.setOverlay(false); return; }
            cageHintShownRef.current = true;
            openCard({
              req: { use: "quickfire", ctx: { type: "ceremony", beat: "cagehint" } }, item: null, card: "cagehint",
              attempts: 0, typed: "", align: "center", cagehint: { captiveDe: captiveOfCage(level, cageId).captiveDe },
            });
          },
          onArenaBrief: () => {
            // R5-W2 · H1 (Teil 3) · DIE KNOTEN-ERKLÄRUNG (Kokis F1/F2).
            // Zweite Hälfte der Freeze-Paarung, wie am Käfig-Hinweis: der Sim
            // fragt vorher, dieser Zweig sollte also unerreichbar sein — aber
            // ein Shell, der eine Karte ablehnt, gibt IMMER die Welt zurück.
            if (arenaBriefShownRef.current) { sceneRef.current?.setOverlay(false); return; }
            arenaBriefShownRef.current = true;
            openCard({
              req: { use: "quickfire", ctx: { type: "ceremony", beat: "goal" } }, item: null, card: "wer",
              attempts: 0, typed: "", align: "center",
            });
          },
          onCageFreed: (id, skin, classmate, count) => {
            freedRef.current = [...freedRef.current, id];
            // PK-R6 · C · the score page counts CLASSMATES, so the run has to
            // know which freed cages held one (doc 44 §2.3: one person-cage per
            // chapter, the others are whatever the unit's fiction asks).
            if (classmate !== undefined) freedKidsRef.current = [...freedKidsRef.current, id];
            setFreedCount(count);
            setFreedKids(freedKidsRef.current.length);
            const captive = captiveOfCage(level, id);
            openCard({
              req: { use: "rescue", ctx: { type: "cage", id, skin, classmate } }, item: null, card: "ceremony",
              attempts: 0, typed: "", align: "center", ceremony: { skin, ...captive, first: count === 1 },
            });
          },
          onGuardianDown: (id, skin) => {
            // F2-24: the chapter's climax is PLAYED, not narrated. The finale
            // card (the child writes HELLO on the board) runs first; its
            // resolution opens the console beat. No finale card in the set ⇒
            // straight to the console — the beat can never softlock.
            // R3-11: the Namens-Konsole is a SEEABLE asker (doc 41 §3) and is
            // typed as one now; it was only ever mis-filed as a hazard.
            const consoleReq: TaskRequest = { use: "boss", ctx: { type: "console", id, skin } };
            // R5-W2 · H1 · DIE KLIMAX-KARTE FÄHRT IHREN EIGENEN POOL.
            // Sie wird aus dem „finale"-Pool gezogen, ritt aber auf einer
            // BOSS-Anfrage — und die Uhr liest den SERVIERTEN Pool. Über
            // `fin.t1`, wo ein Erstleser h-e-l-l-o TIPPT, lief damit die
            // Boss-Uhr, während `timer.test.ts` und Tor-Schicht 12 sie beide als
            // ruhig beglaubigten: die Karte, die sie prüften, gab es zur
            // Laufzeit nicht. Lief die Uhr ab, schob es das Kind an seiner
            // eigenen Auszahlung vorbei (`typed: ""` ⇒ `chalkTheGift` fiel aus).
            const finaleReq: TaskRequest = { use: "finale", ctx: { type: "console", id, skin } };
            const align = alignAwayFrom(id);
            const item = pickTask("finale", { phase: pid, skin });
            if (!item) { openCard({ req: consoleReq, item: null, card: "console", attempts: 0, typed: "", align }); return; }
            openCard({ req: finaleReq, item, card: "finale", attempts: 0, typed: "", align, wash: sceneRef.current?.washOf(id) ?? 0 });
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
            attempts: 0, typed: "", align: "center",
            bonusend: {
              got: bs?.got ?? 0,
              // R5-C1: this fallback was a hardcoded 12 on the one card whose
              // whole job is to state the room's real number.
              total: bs?.total ?? bonusLetterTotal(level),
              timeout: next === "bonus-timeout",
              // R5-C1: leftTicks was read here and thrown away.
              secsLeft: Math.max(0, Math.round((bs?.leftTicks ?? 0) / 60)),
              phrase: bs?.phrase ?? [],
            },
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
      if (startTimer !== null) window.clearInterval(startTimer);
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
      {/* R5-N3 · E4 · THE ONE LINE A HUMAN CAN READ.
          Every automation browser here keeps its tab hidden, and a hidden tab
          gets no frame clock — so the level-start cost can only be measured
          honestly on a real, visible screen. This prints it there. */}
      {startLine !== null && (
        <div
          style={{
            position: "fixed", left: 8, bottom: 8, zIndex: 9999, maxWidth: 520,
            background: "rgba(24,18,10,0.88)", color: "#f6ecd4", padding: "7px 10px",
            borderRadius: 8, font: "12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace",
            whiteSpace: "pre-wrap", pointerEvents: "none",
          }}
        >
          {startLine}
        </div>
      )}
      {/* R3-8: the overlay stylesheet. game-paint ships raw TS/TSX with no CSS
          build step, so the painted layer's animations ride in with the game
          they belong to — and travel with the package, not the app. */}
      <style>{PAINT_OVERLAY_CSS}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 2px", gap: 8 }}>
        <span className="pb-key-bit" style={{ fontSize: 15, display: "inline-flex", alignItems: "center", gap: 7 }}>
          {/* PK-R6 · H1: the bar's own mark was 🖌 — a platform emoji at the top
              of a hand-painted game. It is the book's brush now, with paint on it. */}
          <PaintedIcon name="brush" size={19} />
          {phaseName}
        </span>
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
          {/* R5-W2 · I1 · THE CHIP IS A DOOR. „Ins Buch kleben" has been the
              button on every rule page since R3-16, and the child could never
              open that book. Now the counter opens it — what has been collected
              stays lookup-able, which is the didactic condition Koki set. It is
              the only interactive element in the HUD, so it says so out loud
              (title + aria-label) rather than relying on a child noticing. */}
          {tipTotal > 0 && (
            <Chip
              icon="rule" label="Regel-Seiten" value={`${tipsCount}/${tipTotal}`} art={art}
              onClick={() => openCard({
                req: { use: "quickfire", ctx: { type: "ceremony", beat: "tip" } },
                item: null, card: "merkseite", attempts: 0, typed: "", align: "center",
              })}
              titleDe="Deine Merkseite öffnen"
            />
          )}
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
            o={overlay} level={level} art={art} phaseId={phaseId}
            onResolve={resolveCorrect} onWorldChange={applyWorldChange} onDismiss={dismissCard} onBack={backCard} onPay={payBonus}
            letters={letters.got} bonusTotal={bonusLetterTotal(level)}
            bilanz={bilanz} hubHref={hubHref} onRestart={restart}
            collectedTips={collectedTips}
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
  o, level, art, phaseId, onResolve, onWorldChange, onDismiss, onBack = () => {}, onPay, letters, bonusTotal, bilanz, hubHref, onRestart,
  collectedTips,
}: {
  o: OverlayState;
  level: PaintLevel;
  /** R5-W1 · D2: WHICH ROOM the ceremony happens in — the scene cut looks
   *  through the card at the phase's own painted layer, not at a stock one. */
  phaseId: string;
  /** the level's only-present art map (stem → url): the card portraits and the
   *  goal card's painted title plate both read it */
  art: Record<string, string>;
  onResolve: (o: OverlayState) => void;
  onWorldChange: (o: OverlayState, written?: string) => void;
  onDismiss: (o: OverlayState) => void;
  /** R5-W2 · J1-B: one beat back inside the opening. OPTIONAL and defaulted,
   *  because dev/CardGallery hands this component a structurally-typed prop bag
   *  — a required prop it forgets is not a type error, it is a runtime „onBack
   *  is not a function" the first time a bench surface is clicked. */
  onBack?: (o: OverlayState) => void;
  onPay: (price: number) => void;
  letters: number;
  bonusTotal: number;
  bilanz: Bilanz;
  hubHref: string;
  onRestart: () => void;
  /** R5-W2 · I1: the rule pages found so far, for the Merkseite. Passed in
   *  rather than read from a ref, because this component re-renders on the
   *  count — and a ref would hand it last render's list. */
  collectedTips: readonly TipPayload[];
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
  /** R5-W1 · D2: the room this ceremony happens in, as the scene cut's window.
   *  It is the phase's OWN far plate — A1 made each room one painted body, and
   *  that plate is what the child is looking at while the card interrupts them.
   *  (The first attempt reached for the old `l1_*` parallax layer and got a
   *  blank strip of wall: those stems still exist, but they are no longer the
   *  picture of the room. Found in the render, not in the types.) Falls back to
   *  the first room's plate, and the cut falls back to nothing — keen-art law. */
  const roomStem = allPhasesOf(level).find((p) => p.id === phaseId)?.plates?.far
    ?? level.phases[0]?.plates?.far;
  const staged = (children: React.ReactNode, extraClass = ""): React.ReactElement => (
    <div className="pb-veil pb-veil-deep" style={wrap}>
      <InkWipe />
      {/* R5-W2 · J1-B: KEYED BY THE BEAT. Every ceremony mounts the same element
          type, so React diffs it instead of remounting — and the `pb-page` page
          turn would play once and then just swap text underneath. Four beats
          would be one page whose words change, the opposite of what this packet
          is for. Safe for the other eleven ceremonies: `o.card` is constant for
          a card's whole life, so nothing that re-renders (a typed field, a tally
          clock) can earn a spurious remount from this. */}
      <div key={o.card} className={`pb-card ${extraClass}`.trim()} style={card}>{children}</div>
    </div>
  );

  /** R5-W2 · J1-B · THE FOOT EVERY BEAT WEARS.
   *
   *  One component, because four hand-built button rows is four chances to
   *  drift — and because the one promise this opening makes a child (»you may go
   *  back, and it is four pages long«) has to sit in the same place on every
   *  page, or it is not a promise.
   *
   *  The counter is COUNTED from the chain, like every number the book prints
   *  (doc 41 §7). „←" rather than an arrow emoji: the emphasis gate bans the
   *  emoji list and explicitly whitelists this glyph. */
  const auftaktFoot = (nextDe: string): React.ReactElement | null => {
    const pos = auftaktPosition(o.card);
    if (pos === null) return null;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button className="pb-btn-primary" style={{ ...btn, fontSize: 16 }} onClick={() => onDismiss(o)}>{nextDe}</button>
        {auftaktStep(o.card, -1) !== null && (
          // „Zurück" alone already means »back to the map« on the door card, and
          // one word with two meanings inside one chapter is ein-Ding-ein-Wort
          // broken in the shell. »blättern« is the book's own verb.
          <button className="pb-btn-ghost" style={btn} onClick={() => onBack(o)}>← Zurück blättern</button>
        )}
        <span className="pb-quiet" style={{ marginLeft: "auto" }}>{pos.at} von {pos.of}</span>
      </div>
    );
  };

  // ── R5-W2 · H1 (Teil 3) · DIE KNOTEN-ERKLÄRUNG, IN ZWEI TAKTEN ────────────
  //
  // Koki im Replay: „Why do we have knots? What is the idea again?" (doc 45 F1)
  // und „Klare Arena-Anleitung. Wie besiegt man den Boss?" (F2). Der Platz dafür
  // stand seit R5-P1 im Dossier deklariert und leer (`arena.md` §3, p4-objective:
  // „Slot hier DEKLARIERT, damit der Bau ihn verdrahtet"), samt gemalter Tafel.
  //
  // Erst WER SIE IST, dann WIE ES GEHT — die Reihenfolge ist die Aussage des
  // Kapitels: sie ist kein Gegner, sie ist verwunschen (doc 45 F6). Die Kette
  // liegt in `cards/arena.ts`, damit ein Test sie ohne DOM von beiden Enden
  // gehen kann; nur der letzte Takt gibt die Welt zurück.
  if (arenaPosition(o.card) !== null) {
    const beat = o.card as ArenaBeat;
    const lines = arenaLines(beat);
    const pos = arenaPosition(o.card)!;
    const plate = level.goalPlate !== undefined ? art[level.goalPlate] : undefined;
    return staged(
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px", fontFamily: "var(--font-label, inherit)" }}>
          {lines.titleDe}
        </p>
        {/* Nur der ERSTE Takt trägt das Bild. Takt 2 ist eine Anleitung, und ein
            zweites Mal dieselbe Tafel würde sagen »hier steht nichts Neues«. */}
        {beat === "wer" && plate !== undefined && (
          <div style={{ ...plateMount, aspectRatio: "2048 / 1260", margin: "0 0 10px" }}>
            <img src={plate} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
        <h2 style={{ fontSize: 19, lineHeight: 1.2, margin: "0 0 8px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
          {lines.showsDe}
        </h2>
        <Key>{lines.storyDe}</Key>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button className="pb-btn-primary" style={{ ...btn, fontSize: 16 }} onClick={() => onDismiss(o)}>
            {arenaStep(o.card, 1) === null ? "Los!" : "Weiter"}
          </button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#a8926a", fontFamily: "var(--font-label, inherit)" }}>
            {pos.at} / {pos.of}
          </span>
        </div>
      </div>,
      "pb-page",
    );
  }

  // ── R5-W2 · J1-B · THE CHAPTER OPENING, IN FOUR BEATS ─────────────────────
  //
  // Koki: „der level start sollte ein bisschen mehr story mode like eingeführt
  // werden mit mehreren visuellen cards und teasern und konkreter story
  // beschreibung und expliziter aufgaben (nicht nur eine simple karte mit allen
  // listungen)."
  //
  // One card becomes four beats: the book opens (1) → what happened (2) → what
  // you must do (3) → the door in (4). The chain lives in cards/auftakt.ts so a
  // test can walk it without a DOM; the world stays frozen across all four and
  // only beat 4 gives it back.
  if (auftaktPosition(o.card) !== null) {
    const plate = level.goalPlate !== undefined ? art[level.goalPlate] : undefined;
    const drained = chapterRoleCount(level, "drained");
    const kapitel = /^ch(\d{2})$/.exec(level.chapter)?.[1];

    /** The first painted stem that actually landed wins; if none did, the beat
     *  draws no picture rather than breaking. Art arrives batch by batch and a
     *  card may never depend on a file existing (the keen-art law). */
    const painted = (...stems: Array<string | undefined>): string | undefined => {
      for (const st of stems) if (st !== undefined && art[st] !== undefined) return art[st];
      return undefined;
    };
    /** R5-W2 · J1-B · Kritiker-Runde 1 (85 %): beat 4's door filled about a third
     *  of its frame with flat cream margins either side and read as »a small
     *  sticker in an empty box«, while beats 1 and 2 bleed to their edges. The
     *  cause was `contain` inside a forced square: a tall, narrow painting in a
     *  1:1 box IS mostly margin. The frame now takes the picture's own shape —
     *  a wide plate stays wide, a tall door stays tall — and fills it. */
    const scene = (url: string | undefined, ratio = "4 / 3"): React.ReactElement | null =>
      url === undefined ? null : (
        <div style={{ ...plateMount, aspectRatio: ratio, margin: "0 0 10px", maxHeight: 200 }}>
          <img src={url} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", display: "block" }} />
        </div>
      );
    const eyebrow = (text: string): React.ReactElement => (
      <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 6px", fontFamily: "var(--font-label, inherit)" }}>
        {text}
      </p>
    );

    // ── BEAT 1 · DAS BUCH SCHLÄGT AUF ────────────────────────────────────────
    // The painted title plate, and through a window IN the card the real room
    // behind it with the boy standing in it (SceneCut, R5-W1 · D2 — THE ROOM IS
    // THE ROOM, HE IS THE BOY THEY PLAY). The premise line leads: a child who
    // reads only this page has still read the one sentence the chapter is FOR.
    if (o.card === "goal") {
      return staged(
        <div style={{ textAlign: "left" }}>
          {eyebrow(kapitel !== undefined ? `Kapitel ${Number(kapitel)}` : "Dein Auftrag")}
          {plate !== undefined ? (
            <div style={{ ...plateMount, aspectRatio: "2048 / 1260", margin: "0 0 10px" }}>
              <img src={plate} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <h2 style={{ position: "absolute", left: 0, right: 0, bottom: "6%", margin: 0, padding: "0 6%", textAlign: "center", fontSize: 19, lineHeight: 1.15, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
                {level.name}
              </h2>
            </div>
          ) : (
            <h2 style={{ fontSize: 21, lineHeight: 1.15, margin: "0 0 8px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
              {level.name}
            </h2>
          )}
          <SceneCut art={art} backdrop={roomStem} pose="stand" heroHeight={80} height={124} />
          <Key>{level.whyDe}</Key>
          {auftaktFoot("Weiter")}
        </div>,
        "pb-page",
      );
    }

    // ── BEAT 2 · WAS GESCHEHEN IST ───────────────────────────────────────────
    // The story beat: a TEASER PICTURE with one line under it, not a paragraph.
    // ⚠ THE CLOAK LAW IS AT ITS SHARPEST HERE (cloakErrorsDe, check-paint-copy):
    // this beat is about the antagonist, and he has no name before ch15. He is
    // „der Tinten-Schatten" — a description of his ink, never a proper name.
    // STORY_SPINE_CH01.md is the authority for every word of it.
    if (o.card === "schatten") {
      return staged(
        <div style={{ textAlign: "left" }}>
          {eyebrow("Was geschehen ist")}
          {scene(painted("auftakt_ch01_b", "schulhaus_ch01_b", "schulhaus_ch01_a"), "4 / 3")
            ?? <SceneCut art={art} backdrop={roomStem} pose="stand" heroHeight={80} height={124} />}
          <Key>{level.goalDe}</Key>
          {auftaktFoot("Weiter")}
        </div>,
        "pb-page",
      );
    }

    // ── BEAT 3 · DEIN AUFTRAG ────────────────────────────────────────────────
    // The tasks EXPLICITLY, one line each with its OWN picture — Koki's „nicht
    // nur eine simple karte mit allen listungen". Every number is COUNTED from
    // the world (doc 41 §7): this page is the chapter's contract with the child,
    // and a typed number is the one thing a contract may not contain.
    if (o.card === "aufgaben") {
      // R5-W2 · J1-B: the LINES come from cards/auftakt.ts, where a test walks
      // them at n = 0, 1 and 2. This renderer only decides what a row LOOKS
      // like; what it says is the tested part, because German has a singular and
      // `Nimm 1 Bonus-Bücher mit` compiles perfectly.
      const tasks = auftaktTasks({
        letters: bilanz.lettersTotal, collectNounDe: level.collectNounDe,
        drained, cages: bilanz.freedTotal, kids: bilanz.kidsTotal,
        tips: bilanz.tipsTotal, books: bilanz.booksTotal,
      });
      /** Three rungs, so the beat is buildable today and better the day the rest
       *  of the paint lands: the beat's own mark → the painted HUD miniature →
       *  the code-drawn icon. AQ8 delivered three marks for five rows; the two
       *  without one keep their painted-code mark, and both draw at the SAME
       *  size in the SAME slot so the mixture reads as deliberate. */
      const rows = tasks.map((t) => {
        const url = t.mark !== undefined ? art[t.mark] : undefined;
        return (
          <div key={t.key} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ display: "flex", flex: "0 0 auto", width: 34, height: 34, alignItems: "center", justifyContent: "center" }}>
              {url !== undefined
                ? <img src={url} alt="" aria-hidden style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                : <PaintedIcon name={t.icon} size={30} art={art} />}
            </span>
            <span>
              <KeyBit>{t.askDe}</KeyBit>
              <span className="pb-quiet" style={{ display: "block" }}>{t.whyDe}</span>
            </span>
          </div>
        );
      });
      return staged(
        <div style={{ textAlign: "left" }}>
          {eyebrow("Dein Auftrag")}
          {/* R5-W2 · J1-B · Kritiker-Runde 1 (90 %, High): this beat shipped with
              no scene at all — »a label, five rows and two buttons … the one beat
              that reads as a plain checklist/settings dialog, not a story page«.
              The critic is right and it reverses my own call: I had dropped the
              note plate because its three painted rows do not match five task
              lines. They do not have to — it is the PAPER the tasks are written
              on, not a form to fill in, and the beat needs a picture more than it
              needs that correspondence. */}
          {scene(painted("auftakt_ch01_c"), "16 / 9")}
          <div style={{ display: "grid", gap: 11, fontSize: 14.5, color: "#4a4030", margin: "2px 0 0", lineHeight: 1.3 }}>
            {rows}
          </div>
          {auftaktFoot("Weiter")}
        </div>,
        "pb-page",
      );
    }

    // ── BEAT 4 · LOS GEHT'S ──────────────────────────────────────────────────
    // The door into the room. ⚠ The button text is the literal „Los geht's!" and
    // must stay so: check-paint-copy ends on a VACUITY probe that looks for this
    // exact string in this file, and without it every copy law above it goes
    // blind before it goes red.
    return staged(
      <div style={{ textAlign: "left" }}>
        {eyebrow("Los geht's")}
        {scene(painted("auftakt_ch01_d", level.doorPlate), "5 / 4")
          ?? <SceneCut art={art} backdrop={roomStem} pose="stand" heroHeight={80} height={124} />}
        <Key>Dein erster Raum: {level.phases[0]?.nameDe ?? level.name}.</Key>
        {auftaktFoot("Los geht's!")}
      </div>,
      "pb-page",
    );
  }
  if (o.card === "tip") {
    // R3-16 · A REGEL-SEITE (doc 41 §5), beat 1 of 2. OSWIN tore the unit's rule
    // pages out of the book and scattered them; finding one puts it back. This
    // beat is the FIND — the page and nothing else. No question, no score, no
    // „weiter so": it is the one moment in the chapter that is purely a gift.
    return staged(
      <RuleFound
        art={art}
        skin={o.tip?.skin ?? "regelseite"}
        topicDe={o.tip?.topicDe ?? ""}
        got={bilanz.tips}
        total={bilanz.tipsTotal}
        onNext={() => onDismiss(o)}
      />,
      "pb-page",
    );
  }
  if (o.card === "regel") {
    // …beat 2: the page is open and the rule is on it — the German lede with its
    // one accented phrase, the English the book itself prints, and which page of
    // the child's own book it came from.
    return staged(
      <RuleRead
        art={art}
        plateUrl={level.rulePlate !== undefined ? art[level.rulePlate] : undefined}
        skin={o.tip?.skin ?? "regelseite"}
        topicDe={o.tip?.topicDe ?? ""}
        merksatzDe={o.tip?.merksatzDe ?? ""}
        schluesselDe={o.tip?.schluesselDe ?? ""}
        beispielEn={o.tip?.beispielEn ?? ""}
        ausspracheDe={o.tip?.ausspracheDe ?? ""}
        falscheFormEn={o.tip?.falscheFormEn ?? ""}
        richtigeFormEn={o.tip?.richtigeFormEn ?? ""}
        belegDe={o.tip?.belegDe ?? ""}
        onDone={() => onDismiss(o)}
      />,
      "pb-page",
    );
  }
  if (o.card === "merkseite") {
    // …the same page, reachable at any time from the HUD. It is a LOOK, not a
    // beat: dismissing it returns the child to exactly where they were.
    return staged(
      <Merkseite
        art={art}
        plateUrl={level.rulePlate !== undefined ? art[level.rulePlate] : undefined}
        found={collectedTips}
        total={bilanz.tipsTotal}
        onClose={() => onDismiss(o)}
      />,
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
        {/* R5-C1 (Kritiker-Runde 2): „Die Buchstaben fliegen zurück auf die
            Tafel" told the child the letters were coming HOME to a board — an
            origin nothing in the chapter ever gave them. The beat that really
            just happened is the one the line names now.
            Rebase-Merge: C1s Satz in D1s Rang — die Zeile ist der Schlüssel
            dieser Karte, also <Key> statt eines 17-px-Absatzes. */}
        <Key>Die Tafel ist frei, die Seite ist geschafft — und die Tür zum nächsten Kapitel geht auf.</Key>
        <div style={{ height: 12 }} />
        <a href={hubHref} className="pb-chip pb-btn-primary" style={{ ...btn, textDecoration: "none", display: "inline-block" }}>← Zurück</a>
        <button onClick={onRestart} className="pb-btn-ghost" style={{ ...btn, marginLeft: 10 }}>↻ Noch einmal</button>
      </>,
    );
  }
  if (o.card === "grant") {
    return staged(
      <>
        {/* R5-W1 · D1 (blind critic: „a brand-new ability granted with pure
            text, no icon"): the giver is drawn at the size a gift deserves.
            A second round added the KNOT the fist is for, and the next blind
            critic read it as „ein unerklärtes Uhr-Icon" — a picture the copy
            never picks up is worse than no picture, so it came straight back
            out. What the fist is for is a job for the world (F1's lane), not
            for a glyph on a panel. */}
        {/* R5-W1 · D2: the gift happens IN the hall, with the boy already
            charging the fist he has just been given. */}
        <SceneCut
          art={art}
          backdrop={roomStem}
          pose="charge"
          subject={<span style={{ display: "inline-flex", alignItems: "flex-end", gap: 4, paddingBottom: 8 }}>
            <PaintedIcon name="book" size={58} />
            <PaintedIcon name="spark" size={26} />
          </span>}
        />
        {/* R5-C1: „Fibel schenkt dir die FAUST!" named a book-being the chapter
            never introduces (doc 45 C8) — and ch01 grants no fist at all since
            doc 44 §4 moved it to ch02, so nothing in the shipped game could ever
            reach this card to be confused by it. The card stays (it is the
            engine's grant beat for the chapter that DOES hand one over); the
            name goes, because no chapter has introduced her yet.
            Rebase-Merge: C1s Wortlaut (kein „Fibel") in D1s Rang — ein
            Schlüssel je Karte, der Rest leise. */}
        <Key>Das Buch schenkt dir die <KeyBit>FAUST</KeyBit>!</Key>
        <p className="pb-quiet" style={{ margin: "0 0 12px" }}>Halte <KeyBit>X</KeyBit> zum Laden — wirf sie auf Knoten und Kreide!</p>
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
    // R5-C1 (Koki's replay, 07:26:19): …and it said „jemand" — over a cage
    // holding a sound system. The one card that teaches what a cage IS was
    // teaching the wrong noun, in the phase where every child meets its first
    // one. It names what it is standing in front of now. (The pronoun was wrong
    // too: „dann geht SIE auf" for der Käfig.)
    return staged(
      <>
        {/* R5-W1 · D2: he is standing in front of the shut cage, which is the
            whole instruction — stell dich davor. */}
        <SceneCut art={art} backdrop={roomStem} pose="stand" heroHeight={88} height={162}
          subject={<PaintedCage size={104} />} />
        {/* Rebase-Merge: C1s Wortlaut (der genannte Insasse, „der Käfig") in
            D1s Rang — die Feststellung ist der Schlüssel, die Anleitung leise. */}
        <Key>Da steckt {o.cagehint?.captiveDe ?? "etwas"} fest!</Key>
        {/* R5-C1 (Kritiker-Runde 2): „dann geht ER auf" had no antecedent — the
            word „Käfig" is never spoken on this card, only drawn. The one card
            that teaches what a cage IS now says the word. */}
        <p className="pb-quiet" style={{ margin: "0 0 12px" }}>Stell dich davor und drück <KeyBit>↑</KeyBit> — dann geht der Käfig auf.</p>
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
        {/* R5-W1 · D1 (blind critic: a price named only in prose): the PRICE is
            the decision on this card, so it is drawn — the imp, the toll, and
            what the child is carrying — and the sentence Klecks says drops to
            the quiet layer where a quip belongs. */}
        {/* R5-W1 · D2: Klecks stands at his own door with the toll beside him,
            and the boy stands opposite — a bargain has two sides. */}
        <SceneCut
          art={art}
          backdrop={roomStem}
          pose="stand"
          subject={<span style={{ display: "inline-flex", alignItems: "flex-end", gap: 8, paddingBottom: 6 }}>
            <PaintedIcon name="blot" size={54} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <PaintedIcon name="spark" size={26} />
              <span className="pb-key-bit" style={{ fontSize: 26 }}>{price}</span>
            </span>
          </span>}
        />
        {/* the wording is untouched — copy is C1's lane; only its RANK moved */}
        <Key>Du hast {letters} <PaintedIcon name="spark" size={22} /> — {can ? "bezahlen?" : `sammle erst ${price}!`}</Key>
        <p className="pb-quiet" style={{ margin: "0 0 12px" }}>
          {/* Rebase-Merge: C1s typografischer Schluss („…“), nicht das
              ASCII-Zeichen — das Zitat-Gesetz in check-paint-copy prüft genau
              das, und C1 ist die Copy-Spur. */}
          <KeyBit>Klecks</KeyBit> grinst: „{price} Buchstaben, und die Tür ist deine. Drinnen warten {bonusTotal} — schaffst du alle, bevor die Tinte trocknet?“
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
    // R5-C1: the branch used to compare the classmate's NAME against „merle",
    // which made every other chapter's classmate fall through to the thing
    // branch. It asks whether the captive is a person now — the same field the
    // cage laws police.
    const person = o.ceremony?.person === true;
    const captiveDe = o.ceremony?.captiveDe ?? "";
    return staged(
      <>
        {/* R5-W1 · D2: the rescue happens in the room it happened in, and the
            boy is mid-cheer in it — this beat is the payoff of six rounds and
            it was a 58 px glyph on parchment.
            The MARK beside him keeps C1's condition and C1's choice: „wisp"
            would be the letter-being C1 struck out of the non-person line (the
            captive is a sound system, a tablet, a chair). A picture may not
            claim what the sentence beside it takes back. */}
        <SceneCut art={art} backdrop={roomStem} pose="jump"
          subject={
            // R5-W1 · D2 (blind critic: „the panel that is supposed to depict
            // ‚a captive freed' shows no captive"): the freed one STANDS there
            // now — its own painted cell, the same picture the child was just
            // looking at in the world. The mark stays as the fallback for a
            // skin whose cell has not landed (keen-art law).
            o.ceremony !== undefined && art[`${o.ceremony.skin}_a`] !== undefined ? (
              <img
                src={art[`${o.ceremony.skin}_a`]}
                alt=""
                aria-hidden
                style={{ height: 92, width: "auto", filter: "drop-shadow(0 7px 12px rgba(30,20,10,0.32))" }}
              />
            ) : (
              <span style={{ paddingBottom: 10 }}><PaintedIcon name={person ? "palette" : "spark"} size={54} /></span>
            )
          } />
        {person ? (
          // PK-R6 · D: this beat comes at the END of the six rounds now, not at
          // the latch — so the copy says what the child just watched happen
          // (the colour flooding back) instead of announcing a hop out of a
          // pencil case they saw six rounds ago. And she STAYS: doc 44 §1's
          // „redemption changes state, never presence" was contradicted by the
          // old line, which sent her off to the camp while the world kept her
          // standing at her cage waving. The world was right; the card was not.
          <>
            {/* R5-W1 · D1: what Merle SAYS is the English the child just earned,
                so it is the key line — it used to sit at 16 px between two
                German ones and was the smallest thing she does.
                Rebase-Merge: D1s Rangfolge, C1s Wörter — der Name kommt aus
                `captiveDe` (D1 hatte „Merle" fest eingetippt, was in jedem
                anderen Kapitel falsch wäre). */}
            <p className="pb-quiet" style={{ margin: "0 0 4px" }}>Die Farbe strömt zurück — <KeyBit>{captiveDe}</KeyBit> ist wieder da!</p>
            <Key en>„Hello! I'm Merle. Thanks!“</Key>
            <p className="pb-quiet" style={{ margin: "0 0 12px" }}>(Hallo! Ich bin Merle. Danke!) — Sie bleibt in der Klasse und winkt dir zu.</p>
          </>
        ) : (
          // R5-C1 (Koki's replay, 07:26:41): this said „Ein Buchstaben-Wesen
          // flattert frei und dreht eine Freudenrunde!" — for a sound system, a
          // tablet, a chair and a class photo. There is no letter-being in this
          // chapter: not an entity, not a sprite, not an animation. What the
          // child actually watches is the cage bursting open, so that is all
          // the card claims. NOT „und bekommt seine Farbe zurück": a caged
          // captive has no entity in the world and no colour flood plays — that
          // would be the same class of invented payoff this session is removing.
          // Rebase-Merge: C1s Satz (kein erfundenes Buchstaben-Wesen) in D1s
          // Rang — der eine Satz dieser Karte ist ihr Schlüssel.
          <Key>
            Der Käfig springt auf — <KeyBit>{captiveDe}</KeyBit> ist frei! <PaintedIcon name="spark" size={22} />
          </Key>
        )}
        {o.ceremony?.first === true && (
          // R5-C1 (Koki's replay, 07:26:41 + doc 45 C9): the whisper used to
          // send the freed to „das Lager am Rand der Seite", a place doc 44
          // §1.4 abolished and no level ever contained. The world already told
          // the truth — a freed being stays exactly where it was freed, and
          // Merle stands at her cage and waves — so the line says that.
          // Rebase-Merge: C1s Wortlaut in D1s leiser Klasse; das KeyBit sass
          // auf dem Lager, das es nicht mehr gibt, also fällt es hier weg.
          <p className="pb-quiet pb-quiet-i" style={{ margin: "8px 0 12px" }}>
            Das Buch flüstert: „Alle, die du frei machst, bleiben hier auf der Seite.“
          </p>
        )}
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }
  if (o.card === "console") {
    return staged(
      <>
        {/* R5-W1 · D2: he is at her board — the card points at it, so the card
            had better show him standing there. */}
        <SceneCut art={art} backdrop={roomStem} pose="stand"
          subject={<span style={{ paddingBottom: 6 }}><PaintedIcon name="slate" size={58} /></span>} />
        {/* F2-24: the child WROTE the word on the finale card — this beat now
            answers that act instead of narrating it in their place */}
        <p className="pb-quiet" style={{ margin: "0 0 4px" }}>Niemand hat je etwas <em>Nettes</em> auf sie geschrieben.</p>
        {/* PK-R6 · H1 (round-1 critique, finding 1): the copy points AT the
            board, which now really does carry the child's word in chalk and
            really does bloom (PaintScene.chalkTheGift). A finale that was put
            down wrote nothing, so that line is not offered — the card never
            describes a picture the child cannot see. */}
        {o.typed.trim() !== "" ? (
          // R5-C1: „Sie kommt mit ins Lager!" — the camp again (doc 45 C9), and
          // the world contradicted it twice over: nothing moves, and the Tafel
          // stays on her own stage. What the child does see is the bloom.
          // Rebase-Merge: C1s Sätze (ohne Lager) in D1s Rang.
          <Key>
            Schau auf die Tafel: Da steht dein <KeyBit>{o.typed.trim()}</KeyBit> in Kreide — und sie blüht sonnengelb auf.
          </Key>
        ) : (
          <Key>Sie ist müde und ganz still — aber sie ist frei.</Key>
        )}
        <div style={{ height: 12 }} />
        <button className="pb-btn-primary" style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </>,
    );
  }
  if (o.card === "bonusend") {
    const b = o.bonusend!;
    const perfect = b.got >= b.total;
    return staged(
      <>
        {/* R5-W1 · D1 (blind critic: „win bolds PERFEKT!, loss leaves 7 von 12
            as plain prose"): both outcomes are now told the same way — the
            count is drawn, the sentence is quiet. A child who missed three
            letters gets the same care as one who missed none. */}
        {/* R5-W1 · D2 · THE STICKER IS REAL NOW (DEBT D-20). The card said
            „Klecks stempelt dir einen Sticker auf die Karte" and then showed a
            code-drawn rosette — the painted `seal_sticker` had been sitting on
            disk unwired since p9. A card that promises a thing and shows a
            substitute is the letter-honesty law with a picture instead of a
            number. It falls back to the rosette wherever the piece has not
            landed (the keen-art law), so nothing breaks on a missing file. */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, margin: "0 0 6px" }}>
          {perfect && art.seal_sticker !== undefined ? (
            <img src={art.seal_sticker} alt="" aria-hidden style={{ height: 84, width: "auto", transform: "rotate(-7deg)" }} />
          ) : (
            <PaintedIcon name={perfect ? "rosette" : "blot"} size={60} />
          )}
          <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
            <span className="pb-key-bit" style={{ fontSize: 34 }}>{b.got}</span>
            <span className="pb-quiet" style={{ margin: 0, fontSize: 17 }}>/ {b.total}</span>
          </span>
        </div>
        {/* R5-C1 (p9.md §5/§10): the room's twelve letters SPELL something, and
            the card used to report them as a count — „Alle 12 Buchstaben" —
            which is the one reading that throws the room's whole idea away. The
            catches are laid out as the words now, so a run that missed one
            reads „SCHOO_ THINGS" and the child can see WHICH letter got away. */}
        <p style={{
          fontSize: 22, letterSpacing: "0.18em", margin: "0 0 8px", textAlign: "center",
          fontFamily: "var(--font-display, inherit)", color: "#3a2f1c",
        }}>
          {b.phrase.map((word, w) => (
            <React.Fragment key={w}>
              {/* a REAL space between the words, not only the margin: the gap
                  has to survive being read aloud, and „SCHOO_______" is not the
                  same word as „SCHOO_ ______" to a screen reader or to anything
                  that reads this card as text. */}
              {w > 0 ? " " : null}
              <span style={{ marginRight: w < b.phrase.length - 1 ? "0.35em" : 0, whiteSpace: "nowrap" }}>
                {word.map((slot, i) => (
                  <span key={i} style={{ color: slot.taken ? "#3a2f1c" : "#c8bda6" }}>
                    {slot.taken ? slot.char : "_"}
                  </span>
                ))}
              </span>
            </React.Fragment>
          ))}
        </p>
        {/* Rebase-Merge: C1s Phrasen-Zeile bleibt, der Satz darunter zieht in
            D1s <Key> — beides ist additiv, keins ersetzt das andere. */}
        <Key>
          {perfect
            // R5-C1 (B-p9-5): the seconds the child had left over — the room's
            // only bragging right, and it was sitting in `bonusState()` unused.
            ? `PERFEKT! Klecks stempelt dir einen Sticker auf die Karte — mit ${b.secsLeft} Sekunden übrig!`
            : b.timeout
              ? `Die Tinte ist getrocknet — ${b.got} von ${b.total}. Klecks zwinkert: „Komm wieder!“`
              : `${b.got} von ${b.total} — Klecks zwinkert: „Fast! Komm wieder!“`}
        </Key>
        <div style={{ height: 12 }} />
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
      clockMs={o.clockMs}
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
    // R5-C1: „Wesen befreit" counted the cages that held a sound system, a
    // tablet, a chair and a class photo. They are school things, which is also
    // what the bonus room spells out in letters.
    rows.push({ icon: "cage", labelDe: "Schulsachen befreit", got: bilanz.freed - bilanz.kids, total: bilanz.freedTotal - bilanz.kidsTotal });
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
          {/* R5-W1 · D1: the mark is drawn at 26 px like every other legend in
              the book, and the number is the card's own inline emphasis — the
              only device the overlay uses (cards/emphasis.test.ts holds it) */}
          <span style={{ fontSize: 15, color: "#4a4030", display: "inline-flex", alignItems: "center", gap: 9 }}>
            <PaintedIcon name={r.icon} size={26} art={art} />
            {r.labelDe}
          </span>
          <span className="pb-count pb-key-bit" style={{ fontSize: 19, whiteSpace: "nowrap" }}>
            {countUpAt(r.got, ms, i)} von {r.total}
          </span>
        </div>
      ))}
      {/* R5-C1: „sagt Fibel" named a book-being this chapter never introduces
          (doc 45 C8), and „die Klasse aus dem Lager" called from a place that
          does not exist (C9). The page's own eyebrow already says who is
          speaking — „Das Buch schreibt mit" — so the book speaks. */}
      <p style={{ fontSize: 15, margin: "14px 0 14px", color: "#7a6a4a", fontStyle: "italic", lineHeight: 1.45 }}>
        {alle
          ? "„Die Seite ist wieder voll“, schreibt das Buch. „Du hast alle gefunden.“"
          : "„Fast“, schreibt das Buch. „Ein paar stecken noch fest.“"}
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

function Chip({ icon, label, value, art, onClick, titleDe }: {
  icon: PaintedIconName; label: string; value: string; art?: Record<string, string>;
  onClick?: () => void; titleDe?: string;
}): React.ReactElement {
  if (onClick !== undefined) {
    return (
      <button type="button" className="pb-hud-chip pb-hud-chip-btn" onClick={onClick} title={titleDe} aria-label={`${label} ${value} — ${titleDe ?? ""}`}>
        <PaintedIcon name={icon} size={17} art={art} />
        <span className="pb-hud-chip-label">{label}</span>
        <span className="pb-hud-chip-value">{value}</span>
      </button>
    );
  }
  return (
    <span className="pb-hud-chip" style={{ fontFamily: "var(--font-label, inherit)", fontSize: 13 }}>
      <PaintedIcon name={icon} size={17} art={art} />
      {label}
      <span className="pb-key-bit" style={{ fontSize: 15 }}>{value}</span>
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
