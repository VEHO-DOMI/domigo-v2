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
import { InkWipe, type CardAlign, alignedWrap } from "./cards/CardShell.tsx";
import { PAINT_OVERLAY_CSS } from "./cards/overlay-css.ts";
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
}

/** PK-R3b · M-B · THE CHAPTER'S BILANZ (doc 41 §5, beat 2). Every number the
 *  score page writes, gathered in one place — and every one of them COUNTED
 *  from the level or the run, never authored. The score page is the last thing
 *  a child reads about their own play, so a wrong number there is the most
 *  expensive wrong number in the chapter. */
interface Bilanz {
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
  const bonusReturnRef = useRef<string | null>(null);
  /** PB-F3: the cage hint is a once-per-chapter teacher, not a nag. */
  const cageHintShownRef = useRef(false);
  const [freedCount, setFreedCount] = useState(0);
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
    sceneRef.current?.clearEvidence(); // R3-12: the board wipes itself
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
        cageHintShown: () => cageHintShownRef.current,
        collectedPickupIds: () => [...tipsTakenRef.current, ...booksTakenRef.current],
        airModel,
        callbacks: {
          onExit: (next) => handoff(next),
          onLetters: (got, total) => {
            setLetters({ got, total });
            // the Bilanz counts what was FOUND, so it reads the monotone counter
            // rather than this purse (paying Klecks must not un-find letters)
            phaseLettersRef.current = sceneRef.current?.getState()?.lettersCollected ?? 0;
          },
          onTip: (id, topicDe, merksatzDe) => {
            if (!tipsTakenRef.current.includes(id)) tipsTakenRef.current = [...tipsTakenRef.current, id];
            setTipsCount(tipsTakenRef.current.length);
            setOverlay({
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
              setOverlay({ req, item: null, card: "bonuspay", attempts: 0, typed: "", align, price: priceOfDoor(level, idOfCtx(req.ctx)) });
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
            const beatMs = item.evidence && askerId !== null
              ? (sceneRef.current?.writeEvidence(askerId, item.evidence) ?? 0)
              : 0;
            if (beatMs > 0) {
              window.setTimeout(() => setOverlay({ req, item, card: "task", attempts: 0, typed: "", align }), beatMs);
              return;
            }
            setOverlay({ req, item, card: "task", attempts: 0, typed: "", align });
          },
          onPowerup: (grants) => {
            if (!abilitiesRef.current.includes(grants)) abilitiesRef.current = [...abilitiesRef.current, grants];
            setOverlay({ req: { use: "quickfire", ctx: { type: "ceremony", beat: "grant" } }, item: null, card: "grant", attempts: 0, typed: "", align: "center" });
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
            setOverlay({ req: { use: "quickfire", ctx: { type: "ceremony", beat: "cagehint" } }, item: null, card: "cagehint", attempts: 0, typed: "", align: "center" });
          },
          onCageFreed: (id, skin, classmate, count) => {
            freedRef.current = [...freedRef.current, id];
            setFreedCount(count);
            setOverlay({ req: { use: "rescue", ctx: { type: "cage", id, skin, classmate } }, item: null, card: "ceremony", attempts: 0, typed: "", align: "center", ceremony: { skin, classmate, first: count === 1 } });
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
            if (!item) { setOverlay({ req: consoleReq, item: null, card: "console", attempts: 0, typed: "", align }); return; }
            setOverlay({ req: consoleReq, item, card: "finale", attempts: 0, typed: "", align });
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
      window.setTimeout(() => {
        let target = next;
        // PK-R3b · M-B: bank the phase we are LEAVING before its Sim is thrown
        // away. The Kleckskammer is excluded on purpose (chapterLetterTotal),
        // so a bonus run neither adds to the Bilanz nor is missed from it.
        if (level.bonus === undefined || sceneRef.current?.getState()?.phase !== level.bonus.id) {
          bankedLettersRef.current += phaseLettersRef.current;
        }
        phaseLettersRef.current = 0;
        if (next === "boss") target = level.arena?.id ?? "done";
        if (next === "bonus-timeout" || (level.bonus && next === level.bonus.exit.to && sceneRef.current?.getState()?.phase === level.bonus.id)) {
          // leaving the Kleckskammer (timeout or its exit): show the end card, return
          const bs = sceneRef.current?.bonusState();
          setOverlay({
            req: { use: "bonus", ctx: { type: "ceremony", beat: "bonus" } }, item: null, card: "bonusend",
            attempts: 0, typed: "", align: "center", bonusend: { got: bs?.got ?? 0, total: bs?.total ?? 12, timeout: next === "bonus-timeout" },
          });
          target = bonusReturnRef.current ?? level.phases[0]!.id;
          bonusReturnRef.current = null;
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
          setOverlay({
            req: { use: "quickfire", ctx: { type: "ceremony", beat: "score" } },
            item: null, card: "score", attempts: 0, typed: "", align: "center",
          });
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

  const payBonus = (price: number): void => {
    const scene = sceneRef.current;
    const game = gameRef.current;
    if (!scene || !game || !level.bonus) return;
    if (!scene.spendLetters(price)) return;
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
  // R3-16/17 · every denominator on screen is COUNTED from the level, never
  // typed into the copy. The HUD said „/6" while the chapter actually holds
  // seven cages (the arena's is the seventh), which is precisely the class of
  // drift the letter-honesty law exists to stop — so the number now comes from
  // the world it describes and cannot go stale again.
  const cageTotal = chapterRoleCount(level, "cage");
  const tipTotal = level.tipsTotal ?? chapterRoleCount(level, "tip");
  const bilanz: Bilanz = {
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
        <strong style={{ fontSize: 15, fontFamily: "var(--font-display, inherit)" }}>🖌 {phaseName}</strong>
        {/* R3-17 · THE PAINTED CHIPS (doc 41 §5, presentation mined per doc 42
            §5). The bar used to be a run of plain text on the page background;
            each counter is now a chip in the book's own materials — gouache
            cream, an amber contour, the label face — so the HUD belongs to the
            game rather than to the web page around it.
            F2-33 stands unchanged: every chip says what it counts, and a chip
            with nothing to count is not drawn (the arena collects no letters,
            and the Regel-Seiten chip waits until the chapter hides some). */}
        <span style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
          {freedCount > 0 && <Chip icon="🔓" label="Befreit" value={`${freedCount}/${cageTotal}`} />}
          {tipTotal > 0 && <Chip icon="📜" label="Regel-Seiten" value={`${tipsCount}/${tipTotal}`} />}
          {booksCount > 0 && <Chip icon="📕" label="Bonus-Bücher" value={`${booksCount}`} />}
          {knots > 0 && <Chip icon="🪢" label="Knoten" value={`${knots}`} />}
          {inBonus && bonusLeft >= 0 && <Chip icon="⏱" label="Tinte" value={`${Math.ceil(bonusLeft / 60)}s`} />}
          {letters.total > 0 && <Chip icon="✨" label={level.collectNounDe} value={`${letters.got}/${letters.total}`} />}
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
            o={overlay} level={level} onResolve={resolveCorrect} onDismiss={dismissCard} onPay={payBonus}
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
  o, level, onResolve, onDismiss, onPay, letters, bonusTotal, bilanz, hubHref, onRestart,
}: {
  o: OverlayState;
  level: PaintLevel;
  onResolve: (o: OverlayState) => void;
  onDismiss: (o: OverlayState) => void;
  onPay: (price: number) => void;
  letters: number;
  bonusTotal: number;
  bilanz: Bilanz;
  hubHref: string;
  onRestart: () => void;
}): React.ReactElement {
  const wrap: React.CSSProperties = { ...alignedWrap(o.align), background: "rgba(30, 24, 12, 0.35)" };
  const card: React.CSSProperties = {
    background: "#fdf7e6", border: "2px solid #c9a36a", borderRadius: 14, padding: "18px 22px",
    maxWidth: 440, width: o.align === "center" ? "88%" : "46%", minWidth: 300,
    boxShadow: "0 6px 30px rgba(30,20,10,0.35)", textAlign: "center",
    fontFamily: "var(--font-body, system-ui, sans-serif)",
  };
  /** R3-8: every panel wears the same painted staging as a task card — the veil
   *  washes in, the ink bloom wipes, the panel lands a beat later. */
  const staged = (children: React.ReactNode, extraClass = ""): React.ReactElement => (
    <div className="pb-veil" style={wrap}>
      <InkWipe />
      <div className={`pb-card ${extraClass}`.trim()} style={card}>{children}</div>
    </div>
  );

  if (o.card === "goal") {
    // THE GOAL CARD (doc 42 §3, re-skinned as a page of the book): „Dein
    // Auftrag" → the chapter's name → the *Warum* line → what there is to
    // collect → „Los geht's!". Every line is READ from the level, so this page
    // can never promise a chapter the data does not describe.
    return staged(
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 2px", fontFamily: "var(--font-label, inherit)" }}>
          Dein Auftrag
        </p>
        <h2 style={{ fontSize: 21, lineHeight: 1.15, margin: "0 0 8px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
          {level.name}
        </h2>
        <p style={{ fontSize: 15, margin: "0 0 8px", color: "#4a4030" }}>{level.goalDe}</p>
        <p style={{ fontSize: 14, margin: "0 0 12px", color: "#7a6a4a", fontStyle: "italic" }}>{level.whyDe}</p>
        <p style={{ fontSize: 14, margin: "0 0 14px", color: "#4a4030" }}>
          ✨ <strong>{level.collectNounDe}</strong> sammeln · 🔓 <strong>Klassenkinder</strong> befreien
        </p>
        <button style={{ ...btn, fontSize: 16 }} onClick={() => onDismiss(o)}>Los geht's!</button>
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
        <h2 style={{ fontSize: 19, lineHeight: 1.15, margin: "0 0 10px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
          📜 {o.tip?.topicDe}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.45, margin: "0 0 14px", color: "#4a4030" }}>{o.tip?.merksatzDe}</p>
        <button style={btn} onClick={() => onDismiss(o)}>Ins Buch kleben</button>
      </div>,
      "pb-page",
    );
  }
  if (o.card === "score") {
    // M-B · beat 2 — THE SCORE PAGE (doc 41 §5). The book turns a page and
    // writes the chapter's Bilanz itself: no HUD panel, no stars, no grade. Every
    // number is counted from the level and the run (see Bilanz), and the warm
    // line is the freed friends' — the chapter is closed by the people in it.
    const row = (icon: string, labelDe: string, got: number, total: number | null): React.ReactElement => (
      <div key={labelDe} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: "1px dashed #e0d3ae" }}>
        <span style={{ fontSize: 15, color: "#4a4030" }}>{icon} {labelDe}</span>
        <strong style={{ fontSize: 17, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
          {total === null ? got : `${got} von ${total}`}
        </strong>
      </div>
    );
    const alle = bilanz.freed >= bilanz.freedTotal;
    return staged(
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8926a", margin: "0 0 2px", fontFamily: "var(--font-label, inherit)" }}>
          Das Buch schreibt mit
        </p>
        <h2 style={{ fontSize: 21, lineHeight: 1.15, margin: "0 0 10px", color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>
          {level.name}
        </h2>
        {row("🔓", "Klassenkinder befreit", bilanz.freed, bilanz.freedTotal)}
        {bilanz.tipsTotal > 0 && row("📜", "Regel-Seiten gefunden", bilanz.tips, bilanz.tipsTotal)}
        {row("✨", level.collectNounDe + " gesammelt", bilanz.letters, bilanz.lettersTotal)}
        {bilanz.booksTotal > 0 && row("📕", "Bonus-Bücher", bilanz.books, bilanz.booksTotal)}
        <p style={{ fontSize: 15, margin: "14px 0 14px", color: "#7a6a4a", fontStyle: "italic", lineHeight: 1.45 }}>
          {alle
            ? "»Du hast uns alle gefunden!«, sagt Fibel. »Die Seite ist wieder voll.«"
            : "»Danke!«, ruft die Klasse aus dem Lager. »Ein paar von uns warten noch.«"}
        </p>
        <button style={{ ...btn, fontSize: 16 }} onClick={() => onDismiss(o)}>Seite umblättern</button>
      </div>,
      "pb-page",
    );
  }
  if (o.card === "out") {
    // M-B · beat 3 — THE DOOR OUT. Inside the canvas, like the two beats before
    // it: the chapter's last frame is never below the fold (the PK-R1 rider).
    return staged(
      <>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>🚪✨</p>
        <p style={{ fontSize: 17, margin: "0 0 10px" }}>
          Die Buchstaben fliegen zurück auf die Tafel — und die Tür zum nächsten Kapitel geht auf.
        </p>
        <button onClick={onRestart} style={btn}>↻ Noch einmal</button>
        <a href={hubHref} style={{ ...btn, marginLeft: 10, textDecoration: "none", display: "inline-block" }}>← Zurück</a>
      </>,
    );
  }
  if (o.card === "grant") {
    return (
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>📖✨</p>
        <p style={{ fontSize: 17, margin: "0 0 4px" }}><strong>Fibel</strong> schenkt dir die <strong>FAUST</strong>!</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Halte <strong>X</strong> zum Laden — wirf sie auf Knoten und Kreide!</p>
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }
  if (o.card === "cagehint") {
    return (
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>🎒✊</p>
        <p style={{ fontSize: 17, margin: "0 0 4px" }}>Da steckt jemand fest!</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Wirf die <strong>Faust</strong> (X) auf den Knoten — dann geht die Tasche auf.</p>
        <button style={btn} onClick={() => onDismiss(o)}>Alles klar!</button>
      </div></div>
    );
  }
  if (o.card === "bonuspay") {
    // PB-R1 · R3-2: every number here is READ — the door's own price and the
    // bonus room's own letter count. A card may never state a number the data
    // does not: „10" against a phase carrying 8 is how Klecks became unpayable.
    const price = o.price ?? 0;
    const can = letters >= price;
    return (
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>🖤</p>
        <p style={{ fontSize: 16, margin: "0 0 4px" }}><strong>Klecks</strong> grinst: „{price} Buchstaben, und die Tür ist deine. Drinnen warten {bonusTotal} — schaffst du alle, bevor die Tinte trocknet?"</p>
        <p style={{ fontSize: 14, color: "#6b6250", margin: "0 0 10px" }}>Du hast {letters} ✨ — {can ? "bezahlen?" : `sammle erst ${price}!`}</p>
        {can && <button style={btn} onClick={() => onPay(price)}>{price} zahlen & rein</button>}
        <button style={{ ...btn, marginLeft: can ? 10 : 0 }} onClick={() => onDismiss(o)}>Später</button>
      </div></div>
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
    return (
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
        <p style={{ fontSize: 26, margin: "0 0 6px" }}>{merle ? "🎒" : "🔤"}</p>
        {merle ? (
          <>
            <p style={{ fontSize: 17, margin: "0 0 2px" }}><strong>Merle</strong> hüpft aus der Federtasche!</p>
            <p style={{ fontSize: 16, margin: "0 0 2px" }}>„Hello! I'm Merle. Thanks!“</p>
            <p style={{ fontSize: 13, color: "#6b6250", margin: "0 0 10px" }}>(Hallo! Ich bin Merle. Danke!) — Sie kennt den Weg und läuft schon zum Lager.</p>
          </>
        ) : (
          <p style={{ fontSize: 16, margin: "0 0 10px" }}>Ein Buchstaben-Wesen flattert frei und dreht eine Freudenrunde! ✨</p>
        )}
        {o.ceremony?.first === true && (
          <p style={{ fontSize: 14, color: "#7a6a4a", fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.45 }}>
            Das Buch flüstert: „Bring alle, die du befreist, zum <strong>Lager am Rand der Seite</strong> — dort wartet die Klasse.“
          </p>
        )}
        <button style={btn} onClick={() => onDismiss(o)}>Weiter</button>
      </div></div>
    );
  }
  if (o.card === "console") {
    return (
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
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
      <div className="pb-veil" style={wrap}><InkWipe /><div className="pb-card" style={card}>
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

/** PK-R3b · R3-17 · ONE HUD CHIP (doc 41 §5, presentation per doc 42 §5). A
 *  counter painted in the book's own materials rather than typed onto the page:
 *  gouache cream, an amber contour, the label face. The label is spelled out —
 *  F2-33's law that every number says what it counts survives the re-skin. */
function Chip({ icon, label, value }: { icon: string; label: string; value: string }): React.ReactElement {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "baseline", gap: 5,
        background: "#fdf7e6", border: "1.5px solid #c9a36a", borderRadius: 999,
        padding: "3px 11px", boxShadow: "0 1px 3px rgba(30,20,10,0.18)",
        fontFamily: "var(--font-label, inherit)", fontSize: 13, color: "#6b6250",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden>{icon}</span>
      {label}
      <strong style={{ fontSize: 15, color: "#3a2f1c", fontFamily: "var(--font-display, inherit)" }}>{value}</strong>
    </span>
  );
}

const btn: React.CSSProperties = {
  fontSize: 15,
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #c9a36a",
  background: "#fff",
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
