// THE PAINTED BOOK — sim.ts: the headless phase runner (PB-T2).
//
// EVERYTHING gameplay is here, pure and Phaser-free: player step, screen
// clamp, fist, entities, the ride contract, checkpoints, letters, doors,
// guardian, bonus clock, exit — and the per-tick camera follow (the screen
// clamp is gameplay, so the camera must tick deterministically with it).
// PaintScene CONSUMES this module and only draws; the proof-tape replayer
// (proof-tapes.test.ts) runs the SAME code in CI. That identity is the whole
// point: a level is provably completable because this exact machine, fed a
// recorded pad stream, reached its exit — no model, no drift.
//
// Events out, mutations in: step() returns SimEvents; the shell (scene or
// replayer) reacts (toasts, task overlay, phase handoff) and calls back into
// solveTask()/dismissTask()/setOverlay() — the same contract React had.

import { glyphAt, isSolid } from "./collide.ts";
import { type AirModel, LOGICAL_H, LOGICAL_W, PAINT, SUBS, TILE } from "./paint.ts";
import { IDLE_PAD, type Pad, type PlayerEvent, type PlayerState, applyKnockback, spawnPlayer, stepPlayer } from "./player.ts";
import { type FistState, stepFist, throwFist } from "./fist.ts";
import {
  AWAKEN_ROUNDS,
  type EntityEvent,
  type EntityState,
  type EntityWorld,
  applyLinks,
  awakenClassmate,
  classmateOfCage,
  guardianKnotSolved,
  redeemEntity,
  restoreFreedClassmate,
  rideAttachCheck,
  spawnEntities,
  stepEntities,
  stepRedeemedOnly,
} from "./entities.ts";
import { CAGE_OPEN_TICKS, COLOUR_FLOOD_TICKS } from "./anim.ts";
import { cameraTargetX, clampScroll, stepCameraAxis, stepCameraY } from "./camera.ts";
import { type Ability, type PaintLevel, type PhaseSpec, allPhases, findGlyph } from "./level.ts";

/** Every world-triggered card carries the SKIN of the being that triggered it
 *  (PB-F1): the router binds the served card to that being, so a card can never
 *  again answer a creature that is not on screen.
 *
 *  PK-R3a · R3-11 — THE SPEAKER LAW (doc 41 §3). A task spawns only from an
 *  asker the child can SEE. The old `hazard` ctx was the hole in that law: a
 *  spike strip and an ink pool have no face, no name and no reason to ask an
 *  English question, and yet they served cards from the unbound pool. It is
 *  GONE from this union — the guard is structural, not a rule in a doc, so no
 *  future call site can quietly re-open it. What is left:
 *   - four world askers (entity · cage · door · guardian), each with an id the
 *     serve guard can look up on screen,
 *   - `console`, the chapter's visible Namens-Konsole: always a seeable asker,
 *     only ever mis-filed as a hazard (doc 41 §3),
 *   - `ceremony`, the shell's own beats (the chapter's goal card, the Fibel
 *     grant, the one-time cage hint, the bonus-room result). A ceremony carries
 *     NO task and never touches a card pool — it is a panel the shell opens
 *     and closes. */
export interface TaskRequest {
  use: "quickfire" | "encounter" | "door" | "rescue" | "boss" | "bonus" | "bonuspay";
  ctx:
    | { type: "entity"; id: string; skin: string }
    | { type: "cage"; id: string; skin: string; classmate?: string }
    /** PK-R6 · D · THE REAWAKENING ROUND (doc 44 §3.3). A fifth world asker,
     *  and the only one that asks the SAME being more than once: the classmate
     *  standing ghost-pale out of her cage, on round `round` of `rounds`. The
     *  index rides in the request because the ceremony is ORDERED — round 3
     *  shows the pose round 3 was authored for — which is the one thing the
     *  shuffling playlist router (cards/routing) must not decide here. */
    | { type: "classmate"; id: string; skin: string; round: number; rounds: number }
    | { type: "door"; id: string; kind: string; skin: string }
    | { type: "guardian"; id: string; skin: string }
    | { type: "console"; id: string; skin: string }
    | { type: "ceremony"; beat: "goal" | "grant" | "cagehint" | "bonus" | "tip" | "score" | "out" };
}

/** The being a request is ABOUT, or null for a shell ceremony (nobody asks). */
export const askerIdOf = (ctx: TaskRequest["ctx"]): string | null =>
  ctx.type === "ceremony" ? null : ctx.id;

/** How far outside the view an asker may sit and still count as seen — half a
 *  tile, so a being whose sprite is half over the edge still qualifies. */
export const SPEAKER_MARGIN_PX = 8;

export type SimEvent =
  | { type: "toast"; msg: string }
  | { type: "task"; req: TaskRequest }
  | { type: "powerup"; grants: string }
  | { type: "cageFreed"; id: string; skin: string; classmate: string | undefined; count: number }
  | { type: "guardianDown"; id: string; skin: string }
  /** PB-F3 · F2-8: the child is standing next to a cage the fist can open */
  | { type: "cageHint" }
  | { type: "letters"; got: number; total: number }
  | { type: "letterTaken"; c: number; r: number }
  /** PK-R3b · R3-16: a Regel-Seite was picked up. It carries its own rule, so
   *  the shell can render the page without looking anything up — and the world
   *  is frozen for it, because a rule you are meant to READ may not scroll past
   *  while a moth is chasing you. */
  | { type: "tip"; id: string; topicDe: string; merksatzDe: string; got: number }
  /** PK-R3b · R3-16: a Bonus-Buch. Score only — no card, no freeze. */
  | { type: "book"; id: string; got: number }
  /** R3-4/R3-6 · impact made visible: chalk dust where something broke or the
   *  fist landed. Coordinates are subs; the scene owns what a particle looks like. */
  | { type: "puff"; x: number; y: number; kind: "chalk" | "hit" }
  | { type: "exit"; to: string };

export interface SimCfg {
  level: PaintLevel;
  phaseId: string;
  grantedAbilities: () => readonly string[];
  freedCageIds: () => readonly string[];
  /** PB-R1 · R3-1: chapter state, like the two above — has the fist hint already
   *  been taught in THIS chapter? The sim freezes the world for a card, so it may
   *  only freeze for a card that will actually open; the shell owns the answer
   *  because the shell owns the state that outlives a phase mount. Defaults to
   *  „not yet" so a bare Sim (tests, tools) behaves as before. */
  cageHintShown?: () => boolean;
  /** PK-R3b · R3-16: Regel-Seiten and Bonus-Bücher already taken in EARLIER
   *  mounts of this chapter (ids). A phase is remounted whenever the child comes
   *  back from the Kleckskammer, and a rule page that respawns there is a page
   *  the HUD counts twice. Same contract as freedCageIds. */
  collectedPickupIds?: () => readonly string[];
  /** PB-F2: which jump-feel candidate to run (dev only; ships as `current`). */
  airModel?: AirModel;
  /** R5-A2 · the Kleckskammer round-trip, part 1: spawn HERE instead of at the
   *  S glyph — the door the child left through, so a bonus trip returns to the
   *  entry spot instead of the phase start. */
  spawnCell?: { c: number; r: number };
  /** R5-A2 · part 2: the letter state that survives a remount of THIS phase.
   *  `purse`/`found` seed the wallet and the Bilanz counter.
   *  `takenCells` are the cells already collected in an earlier mount, and they
   *  are read TWO ways: in a FIELD phase they never respawn (they still count
   *  toward lettersTotal, exactly like the live phase they were taken in), while
   *  in the BONUS ROOM they are ignored and every letter is served again —
   *  **D-5 = Option A (Koki, 2026-08-11; DEBT_REGISTER D-5, ch01-dossiers-v2
   *  README §Tor-Antworten)**, because a second purchase costs the full price and
   *  must not buy an already emptied room. The guard is in the constructor.
   *  Same contract as freedCageIds. */
  letterLedger?: () => { takenCells: readonly string[]; purse: number; found: number };
}

// ── PK-R3b · R3-16 · THE COLLECTIBLE MAGNET (doc 42 §4, mined from Keen) ─────
// Koki on the letters: „I'm jumping on them and there's only a small field that
// gets them." Keen's answer, which he liked, was a magnet: a letter inside a
// small field drifts toward the hero every tick and is taken when it arrives.
//
// The numbers come over as Keen wrote them — a field of 1.6 TILES and a lerp of
// 22 % per tick — but expressed in THIS world's tile, not Keen's 48 px one; a
// literal pixel port would have made the field five tiles wide here. The drift
// lives in the SIM rather than the renderer on purpose: a letter that visibly
// flies into the child and is not collected until their body reaches its
// original cell would be exactly the kind of lie this program hunts.
/** How close a letter must be before it starts drifting toward the child. */
export const MAGNET_FIELD_PX = TILE * 1.6;
/** How much of the remaining gap a drifting letter closes each tick. */
export const MAGNET_LERP = 0.22;
/** The child's collect anchor sits at chest height, not at their feet. */
export const COLLECT_ANCHOR_PX = 10;

const fromSubs = (v: number): number => v / SUBS;

/** R3-6 · the impact freeze. Two ticks is the arcade convention: long enough to
 *  read as weight, short enough that control never feels taken away. */
export const HIT_PAUSE_TICKS = 2;

export class Sim {
  readonly phase: PhaseSpec;
  readonly grid: readonly string[];
  readonly worldWpx: number;
  readonly worldHpx: number;
  readonly exitCell: { c: number; r: number };
  readonly rings: Array<{ x: number; y: number }> = [];

  player: PlayerState;
  prevPad: Pad = { ...IDLE_PAD };
  fist: FistState | null = null;
  world: EntityWorld;
  overlayOpen = false;
  /** PK-R6 · H1 · THE RESTORE-HOLD IS A CINEMATIC, NOT A PAUSE (round-1
   *  critique, finding 5). While this is true the world is still frozen for the
   *  CHILD — no input, no walking, no encounter can fire — but the beings the
   *  child just freed keep living, so the colour flood, the settle, the joy lap
   *  and a cage's opening play in the window the hold opened for exactly them.
   *  See `stepRedeemedOnly`. */
  holdOpen = false;
  /** PK-R6 · H1 · a SELF-TERMINATING hold, in ticks: the world runs its freed
   *  beings for this many more ticks even under a card, then stops on its own.
   *  The burst cage uses it (anim.CAGE_OPEN_TICKS) — its opening has to be seen,
   *  and the round-1 card lands on the same tick as the burst, behind an ink
   *  iris that is still wiping. Bounded rather than a flag, because the thing it
   *  runs the world for is one short beat and „who turns it off again" is the
   *  question that froze this chapter once already (PB-R1 · R3-1). */
  holdTicks = 0;
  doorSolved = new Set<string>();
  guardianDefeated = false;
  ridingId: string | null = null;
  respawnCell: { c: number; r: number } | null = null;
  /** R3-11: a request whose asker was off screen when it was raised. The world
   *  KEEPS RUNNING while it waits (the freeze happens at delivery, never at
   *  request), so a waiting card can never deadlock the chapter the way the
   *  cage hint once did. */
  pendingAsk: TaskRequest | null = null;
  bonusLeftTicks = -1; // ≥0 only in the Kleckskammer
  gateToastCooldown = 0;
  /** R3-6: ticks the world holds still after an impact (see HIT_PAUSE_TICKS). */
  hitPauseTicks = 0;
  /** R3-6: was the fist already touching solid last tick? (edge-detect the puff) */
  fistOnSolid = false;
  /** PB-F3: the cage hint is once per phase mount, never a nag. */
  cageHintFired = false;
  /** PK-R6 · C1: was ↑ pressed THIS tick (rising edge)? Recomputed every step. */
  engagePressed = false;
  tickCount = 0;
  exitFired = false;
  lettersTotal = 0;
  lettersGot = 0;
  /** PK-R3b · M-B: how many letters were ever PICKED UP in this phase. Distinct
   *  from `lettersGot`, which is a purse and goes down when Klecks is paid. The
   *  chapter's Bilanz reports what the child FOUND, so a child who spent their
   *  letters on the bonus room is not told at the end that they collected
   *  fewer. Never decremented — that is the whole point of it existing. */
  lettersCollected = 0;
  /** letter cells still uncollected, "c,r" keys (render mirrors this) */
  letterCells = new Set<string>();
  /** R3-16 · where each uncollected letter IS right now, in subs — its cell
   *  centre until the magnet starts pulling it. The scene draws from this, so
   *  the picture and the pickup can never disagree. */
  letterPos = new Map<string, { x: number; y: number }>();
  /** R3-16: Regel-Seiten and Bonus-Bücher taken in THIS phase mount. */
  tipsGot = 0;
  booksGot = 0;
  camX = 0;
  camY = 0;

  private cfg: SimCfg;

  constructor(cfg: SimCfg) {
    this.cfg = cfg;
    const phase = allPhases(cfg.level).find((p) => p.id === cfg.phaseId);
    if (!phase) throw new Error(`Sim: unknown phase ${cfg.phaseId}`);
    this.phase = phase;
    this.grid = phase.rows;
    this.worldWpx = (phase.rows[0]?.length ?? 0) * TILE;
    this.worldHpx = phase.rows.length * TILE;
    const exit = findGlyph(phase.rows, "X") ?? findGlyph(phase.rows, "B");
    this.exitCell = exit ?? { c: 0, r: 0 };

    // R5-A2: letters already taken in an earlier mount of this phase exist in
    // the TALLY but not in the world — a Kleckskammer trip must not respawn a
    // FIELD phase's letters into double-collectability.
    //
    // D-5 = OPTION A (Koki, 2026-08-11 — DEBT_REGISTER D-5, ch01-dossiers-v2
    // README §Tor-Antworten): the bonus room is the one exception. A field phase
    // is walked back into for free, so a cell taken there stays taken; the
    // Kleckskammer is BOUGHT, and the second purchase costs the full price — so
    // it may never sell a room the first visit already emptied. (The price
    // question itself stays PK-R7 economics; this line only makes the goods
    // match the bill.)
    //
    // THE KEY IS THE LEVEL'S OWN BONUS PHASE, NOT THE LITERAL id „p9" the bonus
    // clock below still keys off. „Is this the room the chapter sells" is what
    // the rule is actually about, and it stays true when ch02 names its
    // Kleckskammer something else; the literal id would silently stop applying
    // there. Compared by identity rather than by id so that a level which reused
    // the id on a field phase could not smuggle it through this door.
    const ledger = cfg.letterLedger?.();
    const isBonusRoom = phase === cfg.level.bonus;
    const takenCells = new Set(isBonusRoom ? [] : (ledger?.takenCells ?? []));
    for (const [r, row] of phase.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "o") this.rings.push({ x: (c * TILE + TILE / 2) * SUBS, y: (r * TILE + TILE / 2) * SUBS });
        if (row[c] === "*") {
          this.lettersTotal++;
          if (takenCells.has(`${c},${r}`)) continue;
          this.letterCells.add(`${c},${r}`);
          this.letterPos.set(`${c},${r}`, { x: (c * TILE + TILE / 2) * SUBS, y: (r * TILE + TILE / 2) * SUBS });
        }
      }
    }
    if (ledger) {
      this.lettersGot = ledger.purse;
      this.lettersCollected = ledger.found;
    }

    const start = cfg.spawnCell ?? findGlyph(this.grid, "S") ?? { c: 2, r: 2 };
    this.player = spawnPlayer(start.c * TILE + TILE / 2, (start.r + 1) * TILE);
    this.respawnCell = start;

    this.world = spawnEntities(this.phase.entities, this.phase.links);
    for (const id of cfg.freedCageIds()) {
      const e = this.world.entities.find((x) => x.id === id);
      // R5-A8: a remounted freed cage rests `open` — the burst is a beat that
      // already played; replaying it after a Kleckskammer trip re-staged the
      // captive art (the burst sheet still shows her mid-escape). freedTick
      // seeds PAST the flood for the same reason the classmate's does below:
      // the pop and the grey→colour flood are freedTick-driven and must not
      // replay either (critic finding, R5 verify wave).
      if (e) { e.redeemed = true; e.state = "open"; e.freedTick = COLOUR_FLOOD_TICKS; }
      // PK-R6 · D: a freed cage's PERSON is freed too. A phase is remounted
      // whenever the child comes back from the Kleckskammer, and without this
      // Merle would be hidden again behind a cage that is already open —
      // a friend un-freed by a shopping trip, and six rounds of ceremony
      // silently owed a second time.
      const mate = classmateOfCage(this.world, id);
      if (mate) restoreFreedClassmate(mate, COLOUR_FLOOD_TICKS);
    }
    // R3-16: a Regel-Seite taken before the Kleckskammer stays taken after it
    for (const id of cfg.collectedPickupIds?.() ?? []) {
      const e = this.world.entities.find((x) => x.id === id);
      if (e) e.redeemed = true;
    }
    // R5-A2: spawning ON the door one just returned through must not re-fire
    // it (the Klecks card would reopen in the arrival tick) — seed its
    // cooldown, mirroring entities.overlapsPlayer's door box (12, 26).
    if (cfg.spawnCell) {
      for (const e of this.world.entities) {
        if (e.role !== "door.trigger") continue;
        const dx = Math.abs(e.x - this.player.x) / SUBS;
        const vOverlap = e.y / SUBS > this.player.y / SUBS - 30 && this.player.y / SUBS > e.y / SUBS - 26;
        if (dx < 12 && vOverlap) { e.state = "cooling"; e.timer = 0; }
      }
    }
    if (cfg.phaseId === "p9") this.bonusLeftTicks = 35 * 60 + 120; // G1: budget + 2s grace

    this.camX = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(this.player.y - Math.round(LOGICAL_H * 0.57) * SUBS, this.worldHpx, LOGICAL_H);
  }

  /** Advance ONE 60Hz tick. Returns the events the shell must react to. */
  step(pad: Pad): SimEvent[] {
    const events: SimEvent[] = [];
    if (this.overlayOpen) {
      // …except during a restore-hold, where the whole point is that the change
      // the child just made is ON SCREEN and being watched (doc 44 §3.1.7). The
      // freed beings step; nothing else does, and nothing here can raise an
      // event — see entities.stepRedeemedOnly.
      if (this.holdOpen || this.holdTicks > 0) {
        if (this.holdTicks > 0) this.holdTicks--;
        stepRedeemedOnly(this.world);
      }
      return events; // the world holds its breath during a task
    }
    if (this.hitPauseTicks > 0) { this.hitPauseTicks--; return events; } // R3-6: impact freeze
    this.tickCount++;
    if (this.gateToastCooldown > 0) this.gateToastCooldown--;
    if (this.bonusLeftTicks > 0) {
      this.bonusLeftTicks--;
      if (this.bonusLeftTicks === 0) { events.push({ type: "exit", to: "bonus-timeout" }); return events; }
    }

    // PK-R6 · C1: the engage edge, read BEFORE prevPad is overwritten below.
    this.engagePressed = pad.up && !this.prevPad.up;

    const near = this.nearestRing();
    const abilities = this.cfg.grantedAbilities();
    const out = stepPlayer(this.player, pad, this.prevPad, this.grid, {
      slippery: this.phase.surface === "slippery",
      canRun: abilities.includes("run"),
      canHover: abilities.includes("hover"),
      canPunch: abilities.includes("punch"),
      canHang: abilities.includes("hang"),
      fistBusy: this.fist !== null,
      airModel: this.cfg.airModel,
      ringAt: abilities.includes("swing") ? near : null,
    });
    this.player = out.st;
    // W0-F7 (canonical): the player is boxed inside the visible screen
    // (constants shared with level.ts's reachability model — R5-A7)
    const minX = this.camX + PAINT.screenBoxLeftPx * SUBS;
    const maxX = this.camX + (LOGICAL_W - PAINT.screenBoxRightPx) * SUBS;
    if (this.player.x < minX) this.player = { ...this.player, x: minX, vx: Math.max(this.player.vx, 0) };
    if (this.player.x > maxX) this.player = { ...this.player, x: maxX, vx: Math.min(this.player.vx, 0) };
    this.prevPad = { ...pad };
    for (const ev of out.events) this.onPlayerEvent(ev, events);

    if (this.fist) {
      const tipC = Math.floor(fromSubs(this.fist.x + this.fist.dir * 8 * SUBS) / TILE);
      const tipR = Math.floor(fromSubs(this.fist.y) / TILE);
      const bounced = isSolid(glyphAt(this.grid, tipC, tipR));
      // R3-6: ANY solid contact answers back. Rising edge only — a fist held
      // against a wall must puff once, not every tick it spends there.
      if (bounced && !this.fistOnSolid) {
        events.push({ type: "puff", x: this.fist.x, y: this.fist.y, kind: "hit" });
        this.hitPauseTicks = HIT_PAUSE_TICKS;
      }
      this.fistOnSolid = bounced;
      const res = stepFist(this.fist, this.player.x, this.player.y, bounced);
      this.fist = res.caught || !res.fist.active ? null : res.fist;
      if (this.fist === null) this.fistOnSolid = false;
    }

    this.stepEntityWorld(events);
    this.nearOpenableCage(events);
    this.touchCheckpoints(events);
    this.collectLetters(events);
    this.checkExit(events);

    // per-tick camera follow (gameplay: the screen clamp reads camX next tick)
    const tx = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camX = clampScroll(stepCameraAxis(this.camX, tx), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(stepCameraY(this.camY, this.player.y), this.worldHpx, LOGICAL_H);
    // R3-11: LAST, on the fresh camera — a waiting asker is served the moment
    // the view actually contains it.
    this.servePending(events);
    return events;
  }

  // ── R3-11 · the speaker law (doc 41 §3) ────────────────────────────────────

  /** Is this being inside the view right now? The screen clamp already boxes
   *  the player on screen, so anything in CONTACT with them is visible by
   *  construction — this guard exists so a future asker class (a distant
   *  console, a scripted call-out) cannot regress the law silently. */
  onScreen(id: string): boolean {
    const e = this.world.entities.find((x) => x.id === id);
    if (!e || e.hidden) return false;
    const x = fromSubs(e.x) - fromSubs(this.camX);
    const y = fromSubs(e.y) - fromSubs(this.camY);
    return (
      x >= -SPEAKER_MARGIN_PX && x <= LOGICAL_W + SPEAKER_MARGIN_PX
      && y >= -SPEAKER_MARGIN_PX && y <= LOGICAL_H + SPEAKER_MARGIN_PX
    );
  }

  /** May this request be served RIGHT NOW? A shell ceremony always may (nobody
   *  asks it); a world card only while its asker is in view. */
  canServe(ctx: TaskRequest["ctx"]): boolean {
    const id = askerIdOf(ctx);
    return id === null || this.onScreen(id);
  }

  /** Raise a card FOR an asker: served now if the child can see them, parked
   *  until they can otherwise. Only a served request freezes the world. */
  private ask(req: TaskRequest, events: SimEvent[]): void {
    if (!this.canServe(req.ctx)) { this.pendingAsk = req; return; }
    this.overlayOpen = true;
    events.push({ type: "task", req });
  }

  /** Deliver a parked request once its asker is on screen — and drop it if
   *  that asker has left the phase, because a card with no speaker is a card
   *  nobody asks. */
  private servePending(events: SimEvent[]): void {
    const req = this.pendingAsk;
    if (!req) return;
    const id = askerIdOf(req.ctx);
    if (id !== null && !this.world.entities.some((e) => e.id === id)) { this.pendingAsk = null; return; }
    if (id !== null && !this.onScreen(id)) return;
    this.pendingAsk = null;
    this.overlayOpen = true;
    events.push({ type: "task", req });
  }

  /** PK-R6 · D: raise the round this classmate is standing on. One place, three
   *  callers (the cage bursting, a deferred round re-engaged, and the round
   *  before this one being answered), so „which round am I on" is read from her
   *  own counter every time and can never be tracked twice. */
  private askRound(mate: EntityState, events: SimEvent[]): void {
    this.ask(
      { use: "rescue", ctx: { type: "classmate", id: mate.id, skin: mate.skin, round: mate.awakenStep + 1, rounds: AWAKEN_ROUNDS } },
      events,
    );
  }

  setOverlay(open: boolean): void {
    this.overlayOpen = open;
    // a world handed back is never mid-cinematic: closing the overlay closes
    // BOTH holds with it, so neither can survive the beat that set it (the
    // freeze-pairing law, PB-R1 · R3-1, applied to the holds' own flags).
    if (!open) { this.holdOpen = false; this.holdTicks = 0; }
  }

  /** PK-R6 · H1: enter/leave the restore-hold — the world stays frozen for the
   *  child and keeps running for the beings they just freed. */
  setHold(open: boolean): void {
    this.holdOpen = open;
  }

  /** The shell reports the task for `ctx` SOLVED. */
  solveTask(ctx: TaskRequest["ctx"], events: SimEvent[] = []): SimEvent[] {
    if (ctx.type === "entity") {
      const e = this.world.entities.find((x) => x.id === ctx.id);
      if (e?.role === "guardian") {
        events.push({ type: "toast", msg: "Weiter!" });
      } else {
        redeemEntity(this.world, ctx.id);
        applyLinks(this.world, "redeemed", ctx.id);
        events.push({ type: "toast", msg: "Danke!" });
      }
    } else if (ctx.type === "cage") {
      const freed = this.cfg.freedCageIds().length + 1;
      events.push({ type: "cageFreed", id: ctx.id, skin: ctx.skin, classmate: ctx.classmate, count: freed });
      applyLinks(this.world, "opened", ctx.id);
    } else if (ctx.type === "classmate") {
      // ── PK-R6 · D · ONE ROUND OF THE REAWAKENING (doc 44 §3.3) ────────────
      // The world is handed back FIRST and then, if rounds remain, taken again
      // by the next one: `ask` sets the freeze itself, so releasing afterwards
      // (as the shared tail below does) would drop the ceremony's own card on
      // the floor and resume a world with an open round in it. Hence the early
      // return — the one branch that owns its own overlay bookkeeping.
      this.overlayOpen = false;
      const mate = this.world.entities.find((x) => x.id === ctx.id);
      const done = awakenClassmate(this.world, ctx.id);
      if (!done) {
        if (mate) this.askRound(mate, events);
        return events;
      }
      // the sixth answer: she is in colour, and only NOW does the cage count as
      // freed — the HUD chip, the classmate line on the score page and the
      // ceremony card all hang off this one event, exactly as they did when a
      // cage freed in one beat (doc 44 §2.3's „every HUD denominator counted
      // from the world" is untouched; what moved is WHEN the numerator ticks).
      const cageId = String(mate?.params.cage ?? "");
      const cage = this.world.entities.find((x) => x.id === cageId);
      const freed = this.cfg.freedCageIds().length + 1;
      events.push({
        type: "cageFreed",
        id: cageId,
        skin: cage?.skin ?? ctx.skin,
        classmate: cage?.params.classmate as string | undefined,
        count: freed,
      });
      applyLinks(this.world, "opened", cageId);
      return events;
    } else if (ctx.type === "door") {
      this.doorSolved.add(ctx.id);
      applyLinks(this.world, "opened", ctx.id);
      events.push({ type: "toast", msg: "Die Tür freut sich!" });
    } else if (ctx.type === "guardian") {
      const out = guardianKnotSolved(this.world, ctx.id);
      for (const ev of out) {
        if (ev.type === "guardianDown") {
          this.guardianDefeated = true;
          const g = this.world.entities.find((x) => x.id === ev.id);
          events.push({ type: "guardianDown", id: ev.id, skin: g?.skin ?? "" });
        } else if (ev.type === "guardianKnot") {
          events.push({ type: "toast", msg: `Noch ${ev.knotsLeft} Knoten!` });
        }
      }
    }
    // `console` and `ceremony` carry no world change — the beat IS the payoff,
    // and answering it simply gives the world back.
    this.overlayOpen = false;
    return events;
  }

  /** The shell reports the task DISMISSED („Später") — no reward, no redeem. */
  dismissTask(_ctx: TaskRequest["ctx"]): void {
    this.overlayOpen = false;
  }

  spendLetters(n: number): boolean {
    if (this.lettersGot < n) return false;
    this.lettersGot -= n;
    return true;
  }

  warp(c: number, r: number): void {
    // a warp always detaches and SNAPS the camera (the screen clamp would
    // otherwise drag the player back toward the stale view)
    this.player = {
      ...this.player,
      x: (c * TILE + TILE / 2) * SUBS,
      y: (r + 1) * TILE * SUBS,
      vx: 0,
      vy: 0,
      grounded: false,
      swing: null,
      hangAt: null,
      climbing: false,
      hovering: false,
    };
    this.camX = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
    this.camY = clampScroll(this.player.y - Math.round(LOGICAL_H * 0.57) * SUBS, this.worldHpx, LOGICAL_H);
  }

  private onPlayerEvent(ev: PlayerEvent, events: SimEvent[]): void {
    if (ev.type === "fistThrown") {
      this.fist = throwFist(this.player.x, this.player.y, this.player.facing, ev.charge, ev.speedSubs);
    } else if (ev.type === "encounter") {
      // R3-11 · THE SPEAKER LAW (doc 41 §3): ENVIRONMENTAL HAZARDS NEVER ASK.
      // Spikes and ink have no face and no name, and a floating „Jemand fragt
      // dich…" from nobody is exactly the un-grounded card Koki's replay found.
      // Contact is now what doc 41 says it is: knockback (the no-death setback)
      // and, for ink, the checkpoint return — applied HERE, on contact, instead
      // of waiting on a card that no longer exists. R3-18 (PK-R4) gives this
      // beat its visual grammar; the mechanic lands with the law.
      events.push({ type: "toast", msg: ev.hazard === "^" ? "Autsch!" : "Platsch!" });
      this.player = applyKnockback(this.player, this.player.facing, false);
      if (ev.hazard === "w" && this.respawnCell) this.warp(this.respawnCell.c, this.respawnCell.r - 1);
    }
  }

  private stepEntityWorld(events: SimEvent[]): void {
    const evs = stepEntities(this.world, this.grid, {
      playerX: this.player.x,
      playerY: this.player.y,
      playerIframes: this.player.iframes,
      playerOverlayOpen: this.overlayOpen,
      fist: this.fist ? { active: true, x: this.fist.x, y: this.fist.y } : null,
      // PK-R6 · C1: the RISING EDGE of ↑. Held-up climbs vines (player.ts owns
      // that); only the press engages, so riding a vine past a drained object
      // cannot fire its card, and holding ↑ at one cannot fire it twice.
      playerEngage: this.engagePressed,
      // R5-P1 (Arena): solange der Wächter steht, sind Käfige gegated —
      // dieselbe Ehrlichkeits-Klasse wie das ✕-Gate unten.
      cagesGated: this.world.entities.some((e) => e.role === "guardian" && !e.redeemed) && !this.guardianDefeated,
    });
    for (const ev of evs) this.onEntityEvent(ev, events);

    // ── the G3 ride contract: stand on a moving platform, inherit its motion ──
    if (this.ridingId !== null) {
      const e = this.world.entities.find((x) => x.id === this.ridingId);
      const gone = !e || e.state === "gone" || Math.abs((e?.x ?? 0) - this.player.x) / SUBS > 24 || this.player.vy < 0;
      if (gone) this.ridingId = null;
      else if (e) {
        this.player.x += e.vx;
        this.player.y = e.y - 6 * SUBS;
        this.player.vy = 0;
        this.player.grounded = true;
      }
    }
    if (this.ridingId === null && !this.player.grounded) {
      for (const e of this.world.entities) {
        if (e.hidden || e.redeemed || !rideAttachCheck(e, this.player.y, this.player.x, this.player.vy)) continue;
        this.ridingId = e.id;
        if (e.role === "platform.fall" && e.state === "carry") { e.state = "armed"; e.timer = 0; }
        this.player.y = e.y - 6 * SUBS;
        this.player.vy = 0;
        this.player.grounded = true;
        // R5-A1: attaching IS a landing. A jump-attach otherwise keeps
        // jumpTicks >= 0 forever (the grid landing never fires on a mover),
        // which starves the coyote refresh the ride pose depends on.
        this.player.jumpTicks = -1;
        this.player.airTicks = 0;
        this.player.holdLeft = 0;
        this.player.hovering = false;
        break;
      }
    }
  }

  private onEntityEvent(ev: EntityEvent, events: SimEvent[]): void {
    switch (ev.type) {
      case "encounter": {
        const src = this.world.entities.find((e) => e.id === ev.id);
        applyKnockback(this.player, this.player.x < (src?.x ?? this.player.x) ? -1 : 1, false);
        this.player.iframes = PAINT.iframeTicks;
        // PK-R6 · E · HIT = TASK, NEVER DEATH (doc 44 §4 ch01 C4: „a chalk hit =
        // knockback + a boss-window task"). Chalk that catches the child — in
        // the air or lying on the boards as a shard — asks out of the BOSS
        // battery, not the field's encounter pool: the fiction on screen is the
        // fight, and the timer policy (doc 44 §2.9) gives a boss window its
        // clock. It stays an `entity` ctx on purpose — solving it says „Weiter!"
        // and unties NOTHING. Knots are earned in the counter-window, so being
        // hit can never be a shortcut through the fight.
        const use = src?.role === "guardian" ? "boss" : ev.role === "swarm" ? "quickfire" : "encounter";
        this.ask({ use, ctx: { type: "entity", id: ev.id, skin: ev.skin } }, events);
        break;
      }
      // PK-R6 · C1: a drained object was engaged with ↑. It raises the SAME
      // `encounter` pool a creature does — it is a being on screen being asked
      // about, which is exactly what the speaker law (R3-11) wants — and ch01's
      // field palette (check-game-tasks §9) is what keeps that pool to
      // restore/choice/wheel/oddone in the tutorial chapter.
      case "engaged": {
        this.ask({ use: "encounter", ctx: { type: "entity", id: ev.id, skin: ev.skin } }, events);
        break;
      }
      case "cageGated": {
        // R5-P1 Arena-Gesetz: Kaefig wartet auf den Sieg (Copy = P4-Platzhalter)
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Erst die Tafel beruhigen!" }); this.gateToastCooldown = 120; }
        break;
      }
      case "cageBurst": {
        const e = this.world.entities.find((x) => x.id === ev.id);
        // PK-R6 · H1 (round-1 critique, finding 4): the chapter's core shape has
        // to be seen OPENING. Whatever card this burst raises lands behind a
        // 700 ms ink iris, so these ticks cost the child nothing and buy the one
        // moment the mechanic is legible in.
        this.holdTicks = CAGE_OPEN_TICKS;
        // PK-R6 · D · THE PERSON-CAGE OPENS ONTO A PERSON (doc 44 §3.3). The
        // latch is not the rescue: the child opens it, Merle steps out
        // ghost-pale, and the SIX ROUNDS are what free her. So a cage that has
        // a classmate reveals her here and hands over to her ceremony; a plain
        // cage keeps exactly the one-card rescue it has always had.
        const mate = classmateOfCage(this.world, ev.id);
        if (mate) {
          mate.hidden = false;
          mate.state = "caged";
          mate.timer = 0;
          this.askRound(mate, events);
          break;
        }
        this.ask({ use: "rescue", ctx: { type: "cage", id: ev.id, skin: ev.skin, classmate: e?.params.classmate as string | undefined } }, events);
        break;
      }
      // PK-R6 · D: ↑ at a half-woken classmate resumes her ceremony where it
      // stopped (the „Später" road back — see ENGAGEABLE_ROLES).
      case "awakenAsk": {
        const mate = this.world.entities.find((x) => x.id === ev.id);
        if (mate && !mate.redeemed) this.askRound(mate, events);
        break;
      }
      case "cageHit":
        events.push({ type: "toast", msg: "Er wackelt!" });
        break;
      case "doorTouched": {
        const e = this.world.entities.find((x) => x.id === ev.id);
        if (this.doorSolved.has(ev.id)) break;
        const doorSkin = e?.skin ?? "door";
        if (ev.kind === "bonus") this.ask({ use: "bonuspay", ctx: { type: "door", id: ev.id, kind: ev.kind, skin: doorSkin } }, events);
        else this.ask({ use: "door", ctx: { type: "door", id: ev.id, kind: String(e?.params.kind ?? "exit"), skin: doorSkin } }, events);
        break;
      }
      case "powerupTaken":
        this.overlayOpen = true;
        events.push({ type: "powerup", grants: ev.grants });
        break;
      case "pickupTaken": {
        const e = this.world.entities.find((x) => x.id === ev.id);
        if (ev.role === "book") {
          this.booksGot++;
          events.push({ type: "book", id: ev.id, got: this.booksGot });
          events.push({ type: "puff", x: e?.x ?? this.player.x, y: e?.y ?? this.player.y, kind: "chalk" });
          break;
        }
        this.tipsGot++;
        // a rule page STOPS the world — it is the one collectible whose payload
        // has to be read, and reading is not something you do mid-chase
        this.overlayOpen = true;
        events.push({
          type: "tip",
          id: ev.id,
          topicDe: String(e?.params.topicDe ?? ""),
          merksatzDe: String(e?.params.merksatzDe ?? ""),
          got: this.tipsGot,
        });
        break;
      }
      case "guardianStagger": {
        const g = this.world.entities.find((x) => x.id === ev.id);
        if (g) g.state = "window";
        this.ask({ use: "boss", ctx: { type: "guardian", id: ev.id, skin: g?.skin ?? "" } }, events);
        break;
      }
      case "shooed":
        events.push({ type: "toast", msg: "Husch!" });
        break;
      case "puff":
        events.push({ type: "puff", x: ev.x, y: ev.y, kind: ev.kind });
        // R3-6 · THE HIT-PAUSE: two ticks of held breath on contact. Koki's
        // 11.45.43 shows the fist going through a school bag with nothing to
        // feel; weight is what makes a punch land, and weight is a pause.
        if (ev.kind === "hit") this.hitPauseTicks = HIT_PAUSE_TICKS;
        break;
      default:
        break;
    }
  }

  private nearestRing(): { x: number; y: number } | null {
    for (const g of this.rings) {
      if (Math.abs(g.x - this.player.x) <= 14 * SUBS && Math.abs(g.y - (this.player.y - 30 * SUBS)) <= 28 * SUBS) return g;
    }
    return null;
  }

  /** PB-F3 · F2-8: fire ONCE per phase when the player comes within reach of a
   *  cage the fist could open — the shell turns the first one into a hint card.
   *  Reach is the fist's own travel, not a guess.
   *
   *  PB-R1 · R3-1 — THE FREEZE PAIRING LAW. `cageHintFired` is per phase; the
   *  shell's „already taught" flag is per CHAPTER. When they disagreed, this
   *  method froze the world (`overlayOpen = true`) for a card the shell then
   *  declined to open — and nothing ever un-froze it: from p3 on, ch01 stopped
   *  dead on a stuck frame with no card on screen. The scopes no longer
   *  disagree: the shell is asked BEFORE the world is frozen, so the sim can
   *  only ever freeze for a card that will open. */
  private nearOpenableCage(events: SimEvent[]): void {
    if (this.cageHintFired || this.cfg.cageHintShown?.() === true) return;
    // PK-R6 · C2: the hint used to be gated on the FIST, because the fist was
    // the only thing that opened a cage. ch01 grants no fist any more (doc 44
    // §4) and ↑ opens it instead — so the gate is now „can this child open it
    // AT ALL", which is true in every chapter and was true in none where the
    // grant had not landed yet. Without this the one teaching moment for the
    // chapter's one cage would simply never fire.
    for (const e of this.world.entities) {
      if (e.role !== "cage" || e.redeemed || e.hidden) continue;
      const dx = Math.abs(fromSubs(e.x) - fromSubs(this.player.x));
      const dy = Math.abs(fromSubs(e.y) - fromSubs(this.player.y));
      if (dx <= 48 && dy <= 40) {
        this.cageHintFired = true;
        this.overlayOpen = true; // the hint is a card: the world waits for it
        events.push({ type: "cageHint" });
        return;
      }
    }
  }

  private touchCheckpoints(events: SimEvent[]): void {
    const c = Math.floor(fromSubs(this.player.x) / TILE);
    const r = Math.floor((fromSubs(this.player.y) - 1) / TILE);
    if (glyphAt(this.grid, c, r) === "C" || glyphAt(this.grid, c, r + 1) === "C") {
      if (this.respawnCell?.c !== c) {
        this.respawnCell = { c, r: Math.max(r, 1) };
        events.push({ type: "toast", msg: "Krakel skizziert dich!" });
      }
    }
  }

  /** R3-16 · the magnet + the pickup, in that order. A letter inside the field
   *  closes 22 % of the gap this tick and is then tested for pickup AT ITS NEW
   *  PLACE — so the letter that visibly leaps into the child's hands is the same
   *  letter the counter goes up for, on the same tick. The pickup box itself is
   *  unchanged (11 × 16 px around the chest anchor); the magnet is what makes it
   *  easy to hit, exactly as Koki asked. */
  private collectLetters(events: SimEvent[]): void {
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y) - COLLECT_ANCHOR_PX;
    for (const key of this.letterCells) {
      const p = this.letterPos.get(key);
      if (!p) continue;
      const dx = px - fromSubs(p.x);
      const dy = py - fromSubs(p.y);
      if (Math.hypot(dx, dy) < MAGNET_FIELD_PX) {
        // integer subs (the arcade law) — a rounded lerp settles instead of
        // chasing a fractional tail forever
        p.x += Math.round(dx * SUBS * MAGNET_LERP);
        p.y += Math.round(dy * SUBS * MAGNET_LERP);
      }
      if (Math.abs(px - fromSubs(p.x)) < 11 && Math.abs(py - fromSubs(p.y)) < 16) {
        const [c, r] = key.split(",").map(Number) as [number, number];
        this.letterCells.delete(key);
        this.letterPos.delete(key);
        this.lettersGot++;
        this.lettersCollected++;
        events.push({ type: "letterTaken", c, r });
        events.push({ type: "letters", got: this.lettersGot, total: this.lettersTotal });
      }
    }
  }

  private checkExit(events: SimEvent[]): void {
    if (this.exitFired) return;
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y);
    const cx = this.exitCell.c * TILE + TILE / 2;
    const cy = (this.exitCell.r + 1) * TILE;
    // 18px: the screen-space clamp (right−36) can hold the body ~12px short
    // of a border-adjacent exit cell — the trigger must reach past the clamp
    if (Math.abs(px - cx) < 18 && Math.abs(py - cy) < 22) {
      // PB-R1 · R3-3 · THE ESSENTIAL-PICKUP GATE. A grant the chapter later
      // REQUIRES locks this phase's exit until it has been taken. There is no
      // way back once a phase is left, so walking past Fibel's fist used to end
      // the run in the arena: the guardian can only be staggered by a deflected
      // chalk piece, and deflecting needs the fist. Checked FIRST — it is the
      // one blocker whose answer lies back in the level rather than underfoot.
      const missing = this.world.entities.find((e) => e.role === "powerup" && e.params.essential === true && !e.redeemed);
      if (missing) {
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Du hast noch etwas Wichtiges vergessen!" }); this.gateToastCooldown = 120; }
        return;
      }
      // exit doors gate the X until their word is said (ch01 imperative law)
      const gate = this.phase.entities.find((e) => e.role === "door.trigger" && e.params?.kind === "exit");
      if (gate && !this.doorSolved.has(gate.id)) {
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Die Tür wartet auf ihr Wort!" }); this.gateToastCooldown = 120; }
        return;
      }
      if (this.phase.entities.some((e) => e.role === "guardian") && !this.guardianDefeated) {
        if (this.gateToastCooldown === 0) { events.push({ type: "toast", msg: "Die Tafel möchte noch reden!" }); this.gateToastCooldown = 120; }
        return;
      }
      this.exitFired = true;
      events.push({ type: "exit", to: this.phase.exit.to });
    }
  }
}
