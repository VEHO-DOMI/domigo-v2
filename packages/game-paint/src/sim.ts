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
import { IDLE_PAD, type Pad, type PlayerEvent, type PlayerState, applyKnockback, derivePose, spawnPlayer, stepPlayer } from "./player.ts";
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
  GUARDIAN_WIPE_REACH_PX,
  JOY_ROLES,
  redeemEntity,
  restoreFreedClassmate,
  rideAttachCheck,
  SAD_TICKS,
  SINK_SPEED,
  spawnEntities,
  stepEntities,
  stepRedeemedOnly,
} from "./entities.ts";
import { CAGE_OPEN_TICKS, COLOUR_FLOOD_TICKS } from "./anim.ts";
import { groundSurfaceAt } from "./collide.ts";
import { cameraTargetX, clampScroll, stepCameraAxis, stepCameraY } from "./camera.ts";
// R5-W5 · B4b · D-186: die Lebensdauer des Spritzers ist die Haltezeit der
// Kamera. `ink.ts` importiert selbst NICHTS, ein Zyklus ist hier also
// ausgeschlossen — und sim.ts holt sich Takt-Zahlen schon aus `anim.ts` (oben).
import { INK_SPLASH_TICKS } from "./ink.ts";
import { type Ability, type PaintLevel, type PhaseSpec, allPhases, findGlyph } from "./level.ts";

/** R5-W2 · H1 · Wie lange sie NACH dem Ausruhen noch liegt, bevor die Karte
 *  kommt, die den Beat beschreibt. Ein Atemzug, damit »sie ruht« ein Bild ist
 *  und kein Durchgangsframe — dieselbe Rolle wie die Blende am Käfig. */
const LANDING_SETTLE_TICKS = 18;

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
  // R5-W2 · H1: `finale` gehörte immer schon dazu — `cards/serving.ts` erklärt
  // die Tafel seit jeher zur Sprecherin von `["boss", "finale"]`, und der Shell
  // zieht die Klimax-Karte auch aus diesem Pool. Nur der TYP kannte ihn nicht,
  // also musste die Karte auf einer Boss-Anfrage reiten — und bekam dadurch die
  // Boss-Uhr. Der Typ sagt jetzt, was die Welt ohnehin tut.
  // R5-W5 · G4: `pickupset` joins for the same reason `finale` did — the shell
  // really does open this pool (the uniform's naming card at every third find),
  // so the type says what the world does. It is the one use no ENTITY event
  // raises: the piece it is about is already in the child's hands.
  use: "quickfire" | "encounter" | "door" | "rescue" | "boss" | "bonus" | "bonuspay" | "finale" | "pickupset";
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
    // R5-W5 · G4: `cloth` is the naming card the uniform owes at every third
    // find. It is a ceremony beat and not an entity ask because it belongs to no
    // being in the world — the piece it is about has already been picked up.
    | { type: "ceremony"; beat: "goal" | "grant" | "cagehint" | "bonus" | "tip" | "cloth" | "score" | "out" };
}

/** The being a request is ABOUT, or null for a shell ceremony (nobody asks). */
export const askerIdOf = (ctx: TaskRequest["ctx"]): string | null =>
  ctx.type === "ceremony" ? null : ctx.id;

/** How far outside the view an asker may sit and still count as seen — half a
 *  tile, so a being whose sprite is half over the edge still qualifies. */
export const SPEAKER_MARGIN_PX = 8;

/** R5-F2: ab wie viel seitlichem Abstand eine Treffer-Quelle überhaupt eine
 *  Richtung hergibt. Darunter (die Tafel steht senkrecht über dem Kind) stößt
 *  der Rückstoß rückwärts gegen den Blick, statt eine Seite zu würfeln. */
export const KNOCK_DIR_MIN_PX = 6;

/** R5-W2 · I1 · everything a Regel-Seite carries to the card that reads it.
 *
 *  It is ONE named object rather than six positional strings for a reason the
 *  compiler cannot help with otherwise: `(id, topicDe, merksatzDe, schluesselDe,
 *  erklaerungDe, belegDe)` are all `string`, so any two of them swapped type-checks
 *  perfectly and shows a child the wrong line. Named fields make that mis-order
 *  impossible to write. */
export interface TipPayload {
  id: string;
  /** the page's own skin, so the card can open the very page that was found
   *  (`<skin>_a` as it lay in the world, `<skin>_open` once it is read). */
  skin: string;
  /** which of the unit's rules this page is. */
  topicDe: string;
  /** R5-W4 · I2: the NOTION — what happens in this rule, before it is stated as
   *  a rule. The card's first line. */
  erklaerungDe: string;
  /** the rule, kid-worded — the card's lede. */
  merksatzDe: string;
  /** the one phrase of it the card sets in bold; a substring of `merksatzDe`. */
  schluesselDe: string;
  /** R5-W4 · I2: 2–4 English lines that show the rule at work. OURS, not the
   *  book's (Koki's ruling K-1), grounded against the unit lexicon. */
  beispieleEn: readonly string[];
  /** which page of the child's book this rule lives on. Carried so the archive
   *  and the library keep it; NO surface renders it (Koki, 2026-08-15). */
  belegDe: string;
}

/** Warum der Ausgang zu ist — die fünf Tore des Kapitels, in der Reihenfolge,
 *  in der `checkExit` sie prüft, plus der Käfig, der schon am Käfig selbst
 *  hängt (`onEntityEvent#cageGated`). */
export type GateReason = "powerup" | "tuerwort" | "tafel" | "klassenfoto" | "cageGated";

export type SimEvent =
  /** `echoes` sagt: dieser Toast trägt nur den TEXT eines Beats, der im selben
   *  Takt sein eigenes Ereignis hat (R5-W7 · S3 · D-372). Wer am Text hängt —
   *  die Anzeige — nimmt ihn wie jeden anderen; wer am BEAT hängt — der Klang —
   *  hört auf das eigene Ereignis und schweigt hier, sonst klänge derselbe
   *  Augenblick zweimal. Heute gibt es genau einen solchen Beat; kommt ein
   *  zweiter dazu, wird aus dem Literal eine Vereinigung. */
  | { type: "toast"; msg: string; echoes?: "gate" }
  | { type: "task"; req: TaskRequest }
  | { type: "powerup"; grants: string }
  | { type: "cageFreed"; id: string; skin: string; classmate: string | undefined; count: number }
  | { type: "guardianDown"; id: string; skin: string }
  /** R5-W4 · H2 (R50): eine Kritzel-Schicht ist gerade weggewischt worden.
   *  `layersLeft` ist der Zählerstand DANACH — 0 heisst sauber. Der Zustand
   *  `wipe` allein trägt den Takt nicht: die Szene braucht den EINEN Augenblick,
   *  in dem die Schicht verschwindet, für ihren Staub und ihre Blüte, und ein
   *  Augenblick ist ein Ereignis, kein Zustand, den man pro Bild abfragt. */
  | { type: "guardianWipe"; id: string; layersLeft: number }
  /** PB-F3 · F2-8: the child is standing next to a cage the fist can open */
  /** R5-C1: the hint card names what it is standing in front of, so the cage's
   *  id rides along — one teaching card that says „jemand" over a sound system
   *  teaches the wrong shape. */
  | { type: "cageHint"; id: string }
  /** R5-W2 · H1 (Teil 3) · DIE KNOTEN-ERKLÄRUNG. Feuert EINMAL, wenn das Kind
   *  die Bühnen-Schwelle übertritt — dort, wo das Dossier den Takt seit R5-P1
   *  deklariert hat (`arena.md` §3, p4-objective) und wo Koki ihn verlangt hat
   *  („Why do we have knots?", doc 45 F1/F2). */
  | { type: "arenaBrief" }
  | { type: "letters"; got: number; total: number }
  | { type: "letterTaken"; c: number; r: number }
  /** R5-W4 · B4 · D-4: a BEING was answered — a moth that asked its number, a
   *  drained object that got its colour back, a pencil that was sent away. Every
   *  other ledgered fact already had an event with an id on it (`cageFreed`,
   *  `tip`, `book`); this one did not, so the shell never learned about it and
   *  `spawnEntities` handed the child the same moth again after every
   *  Kleckskammer trip. Koki, 2026-08-15: „die Sachen bleiben erfasst." */
  | { type: "entityResolved"; id: string; role: string }
  /** PK-R3b · R3-16: a Regel-Seite was picked up. It carries its own rule, so
   *  the shell can render the page without looking anything up — and the world
   *  is frozen for it, because a rule you are meant to READ may not scroll past
   *  while a moth is chasing you. */
  | ({ type: "tip"; got: number } & TipPayload)
  /** PK-R3b · R3-16: a Bonus-Buch. Score only — no card, no freeze. */
  | { type: "book"; id: string; got: number }
  /** R3-4/R3-6 · impact made visible: chalk dust where something broke or the
   *  fist landed. Coordinates are subs; the scene owns what a particle looks like. */
  | { type: "puff"; x: number; y: number; kind: "chalk" | "hit" }
  /** R5-W5 · G4: a piece of the scattered uniform was taken. Like the Bonus-Buch
   *  it does NOT stop the world (design §1: „erst begegnen, dann abfragen" — nine
   *  interruptions would take the run apart). It carries the English word and the
   *  spot it was lying on, because the word is shown AT THE FIND rather than over
   *  the child: a word that appears mid-jump over a moving hero is a word nobody
   *  reads. Coordinates are subs, like every other position in this union. */
  | { type: "cloth"; id: string; wordEn: string; x: number; y: number }
  /** R5-W7 · S3 · D-372 · DER TORSCHLUSS ALS EREIGNIS.
   *
   *  Das Kind steht am Ausgang und darf noch nicht. Bis heute meldete die
   *  Spiel-Logik diesen Augenblick NUR als Toast, und der Klang hing am
   *  Wortlaut der Meldung (`audioManifest.ts#TOAST_MATCHES`): formulierte die
   *  Text-Bahn einen der Sätze um, wäre der Klang still verschwunden. Ein Tor
   *  hielt das zusammen — eine Krücke, die S1 und S2 selbst als solche gemeldet
   *  haben.
   *
   *  `reason` ist der Grund, aus dem das Tor zu ist, und trägt die Entscheidung,
   *  ob dieser Anlauf überhaupt klingt: der Käfig-Torschluss klingt bereits als
   *  EntityEvent `cageGated` (→ `cage-locked`), und zwei Klänge auf einem
   *  Augenblick sind einer zu viel. Der Toast daneben bleibt stehen — er ist
   *  der Text, den das Kind LIEST — und trägt `echoes: "gate"`.
   *
   *  Feuert unter derselben Sperre wie der Toast (`gateToastCooldown`, 120
   *  Takte): einmal je Anlauf, nicht einmal je Bild. */
  | { type: "gate"; reason: GateReason }
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
  /** R5-W2 · H1 (Teil 3): hat der Shell die Arena-Anleitung in DIESEM Kapitel
   *  schon gezeigt? Dieselbe Paarung wie beim Käfig-Hinweis — der Shell wird
   *  GEFRAGT, bevor die Welt eingefroren wird, damit die Welt nie für eine
   *  Karte stehen bleibt, die der Shell dann gar nicht öffnet. */
  arenaBriefShown?: () => boolean;
  /** PK-R3b · R3-16: Regel-Seiten and Bonus-Bücher already taken in EARLIER
   *  mounts of this chapter (ids). A phase is remounted whenever the child comes
   *  back from the Kleckskammer, and a rule page that respawns there is a page
   *  the HUD counts twice. Same contract as freedCageIds. */
  collectedPickupIds?: () => readonly string[];
  /** R5-W4 · B4 · D-4: beings already ANSWERED in an earlier mount of this
   *  chapter (ids) — moths, chasers, bouncers, flyers, crushers, gunners and the
   *  `drained` objects. Cages, Regel-Seiten and Bücher had their ledgers; these
   *  did not, so „die Tür ist ein bezahlter Reset-Knopf" (D-4): a bonus trip
   *  un-answered every encounter in the phase.
   *
   *  ONE list, not two. The passover offered `resolvedEntityIds` and
   *  `restoredEntityIds` side by side, but the measurement says they are the same
   *  bit: `redeemEntity` sets `redeemed` for a moth and for a desk alike, and
   *  what differs is only the RESTING POSE the constructor replays for each role.
   *  Two names for one fact is how two ledgers drift apart.
   *  Same contract as freedCageIds. */
  resolvedEntityIds?: () => readonly string[];
  /**
   * R5-W6 · S2 · DIE EINE ZEILE, DIE DER KLANG IN `sim.ts` BRAUCHT (deklarierte
   * Ausnahme zur Eigentums-Karte der Welle 6 — `sim.ts` hat in dieser Welle
   * keinen anderen Eigentümer, und der Kanon nennt genau diese Stelle).
   *
   * Warum sie hier stehen MUSS: `onEntityEvent` FALTET die 16 EntityEvents in
   * den SimEvent-Strom. `cageBurst` wird zu gar keinem SimEvent (nur zu einer
   * Karte), `cageGated`/`shooed` werden zu einem Toast, `encounter` zu einer
   * Frage — oben sind sie als Klang-Auslöser nicht mehr unterscheidbar. Vier
   * fertige Klänge (Käfig berstet · verschlossener Käfig · Anstossen · Husch)
   * hätten ohne diesen Durchreicher keinen einzigen Auslöser
   * (`docs/design/g1/paint/AUDIO_SPINE_CH01.md` §2, Anschlussstelle `entity`).
   *
   * Der Sim bleibt rein: ein Zuhörer ohne Rückgabewert, der nichts liest und
   * nichts setzt. Er läuft nach der Determinismus-Doktrin ausserhalb des
   * Zustands — ein aufgezeichnetes Band spielt identisch, ob er gesetzt ist
   * oder nicht (`proof-tapes.test.ts` beweist es: sie fahren ohne ihn).
   */
  onEntityAudio?: (ev: EntityEvent) => void;
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
  /** R5-W2 · H1 (Teil 3): die Arena-Anleitung, einmal je Phasen-Aufbau. */
  arenaBriefFired = false;
  /** PK-R6 · C1: was ↑ pressed THIS tick (rising edge)? Recomputed every step. */
  engagePressed = false;
  /** R5-W1 · F1: were the controls locked during the step just taken? The pose
   *  is committed after the entity world has run, and it must judge by the same
   *  value that step used (see stepPlayer). */
  private poseLocked = false;
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
  /** R5-C1: cells taken in THIS mount, "c,r" keys. The bonus room's end card
   *  lays its catches out as the phrase they spell, and that layout is about
   *  the RUN — the shell's own taken-cells ledger is cumulative across visits,
   *  and a second paid visit reading it would show letters this run never
   *  caught. Distinct from `letterCells`' complement for the same reason: the
   *  ledger suppresses respawned cells, so the complement is only accidentally
   *  right and stops being right the moment p9's letters respawn. */
  runTakenCells = new Set<string>();
  /** R3-16 · where each uncollected letter IS right now, in subs — its cell
   *  centre until the magnet starts pulling it. The scene draws from this, so
   *  the picture and the pickup can never disagree. */
  letterPos = new Map<string, { x: number; y: number }>();
  /** R3-16: Regel-Seiten and Bonus-Bücher taken in THIS phase mount. */
  tipsGot = 0;
  booksGot = 0;
  camX = 0;
  camY = 0;
  /** R5-W5 · B4b · D-186 · Ticks, in denen die Kamera NICHT nachzieht.
   *
   *  Es gibt genau einen Grund dafür, und er ist eine Regie-Entscheidung: der
   *  Tinten-Spritzer entsteht dort, wo das Kind hineinfiel, während der Warp es
   *  schon zum Anker gesetzt hat. Wer im selben Tick auch die Sicht mitnimmt,
   *  zeigt den Spritzer nie — er war gebaut, unit-belegt und deterministisch und
   *  trotzdem in keiner Aufnahme zu sehen (A6b, eigener Aufnahmeversuch in p2).
   *  Die Sicht bleibt also kurz stehen, wo der Schlag passiert ist. Siehe warp. */
  camHoldTicks = 0;
  /** R5-W5 · B4b · D-186 · Ist die Sicht noch auf dem Weg zum Kind?
   *
   *  Solange das so ist, schweigt die Bildschirm-Klammer (W0-F7). Die Klammer
   *  hält das Kind im BILD; ist das Bild selbst noch unterwegs, hat sie nichts
   *  zu entscheiden — sonst zieht sie das Kind an den Rand einer Sicht, die es
   *  noch nicht zeigt, und hebt damit genau den Rückweg auf, den sie nicht kennt.
   *  Zwei Zustände und nicht einer, weil der Halt in TICKS zählt (die Lebensdauer
   *  des Spritzers) und das Einholen in STRECKE (die Fahrt zum Anker) — in p2
   *  sind das 26 Ticks und danach noch bis zu 28 Kacheln. */
  camDetached = false;

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
      // R5-W2 · H1 · `freed` too, or a cage the child finished before the
      // Kleckskammer trip would offer its rescue a second time on the way back.
      if (e) { e.redeemed = true; e.freed = true; e.state = "open"; e.freedTick = COLOUR_FLOOD_TICKS; }
      // PK-R6 · D: a freed cage's PERSON is freed too. A phase is remounted
      // whenever the child comes back from the Kleckskammer, and without this
      // Merle would be hidden again behind a cage that is already open —
      // a friend un-freed by a shopping trip, and six rounds of ceremony
      // silently owed a second time.
      const mate = classmateOfCage(this.world, id);
      if (mate) restoreFreedClassmate(mate, COLOUR_FLOOD_TICKS);
    }
    // R3-16: a Regel-Seite taken before the Kleckskammer stays taken after it
    const takenPickups = new Set(cfg.collectedPickupIds?.() ?? []);
    for (const id of takenPickups) {
      const e = this.world.entities.find((x) => x.id === id);
      if (e) e.redeemed = true;
    }
    // R5-W5 · G4: p9 is the NACHLESE — it carries a second copy of every uniform
    // piece and may only offer the ones still MISSING (UNIFORM_SAMMELN_DESIGN
    // §1). A twin names the piece it repeats in `params.repeatOf`, so the same
    // ledger that seeds the originals silences the twins too: no second channel,
    // no word list travelling through the config, and a level law proves that
    // every `repeatOf` points at a uniform piece that really exists.
    for (const e of this.world.entities) {
      const repeats = e.role === "cloth" ? e.params.repeatOf : undefined;
      if (typeof repeats === "string" && takenPickups.has(repeats)) e.redeemed = true;
    }
    // ── R5-W4 · B4 · D-4 · WAS BEANTWORTET WAR, BLEIBT BEANTWORTET ───────────
    // Koki, 15.08.2026: „die Motte oben kann man wieder triggern … die Sachen
    // bleiben erfasst." `spawnEntities` above rebuilds the whole world at its
    // birth values, so every remembered fact has to be re-applied on top of it —
    // this is that loop, for the beings that never had one.
    //
    // The END states, not the beginning ones. `redeemEntity` (entities.ts) sets
    // `freedTick = 0` and `state = "joy"` BECAUSE it wants the colour to flood
    // in and the moth to fly its lap — that is the reward for answering, and it
    // has already been watched. Replaying it on arrival would hand the child a
    // celebration for something they did before they went shopping. So: the
    // flood clock is parked at its end (`COLOUR_FLOOD_TICKS`), and the pose is
    // the one `stepRedeemed` settles into — „rest" for the creatures that fly a
    // lap, „dazed" for the static-state beings that never leave their cell.
    // Exactly the shape `restoreFreedClassmate` uses for a freed cage's person.
    for (const id of cfg.resolvedEntityIds?.() ?? []) {
      const e = this.world.entities.find((x) => x.id === id);
      if (!e) continue;
      e.redeemed = true;
      e.timer = 0;
      e.freedTick = COLOUR_FLOOD_TICKS;
      e.state = JOY_ROLES.has(e.role) ? "rest" : "dazed";
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
        stepRedeemedOnly(this.world, this.grid);
      }
      return events; // the world holds its breath during a task
    }
    if (this.hitPauseTicks > 0) { this.hitPauseTicks--; return events; } // R3-6: impact freeze
    this.tickCount++;
    if (this.gateToastCooldown > 0) this.gateToastCooldown--;
    // R5-C1: …and it stops the moment the room is left. The shell reads the
    // clock one turn AFTER the exit fires (its handoff is a setTimeout), so a
    // still-running clock would hand the PERFEKT card a smaller number than the
    // one the child beat it by. The timeout path is untouched: there the clock
    // is already exactly 0.
    if (this.bonusLeftTicks > 0 && !this.exitFired) {
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
    this.poseLocked = out.locked;
    // W0-F7 (canonical): the player is boxed inside the visible screen
    // (constants shared with level.ts's reachability model — R5-A7)
    //
    // R5-W5 · B4b · D-186 · …AUSSER solange die Sicht noch unterwegs zum Kind
    // ist (`camDetached`), und das ist keine Feinheit: es ist genau die Warnung,
    // die zwei Zeilen im alten `warp` standen (»the screen clamp would otherwise
    // drag the player back toward the stale view«). Die Klammer hält das Kind im
    // BILD; ist das Bild selbst noch auf dem Weg, hat sie nichts zu entscheiden.
    //
    // LIVE GEMESSEN, bevor diese Bedingung existierte (p2, echter Sturz durchs
    // Loch c32): der Warp setzte das Kind korrekt auf x=936 (Anker c58) — und
    // einen Tick später zog die Klammer es auf x=724, exakt `camX 408 + 320 − 4`,
    // den rechten Rand der gehaltenen Sicht. Das liegt mitten über dem Becken,
    // aus dem es gerade gerettet worden war, und von dort fiel es weiter. Die
    // Klammer hob also den Rückweg auf, den sie nicht kennt.
    //
    // Die drei ersten Prüfungen dieses Verhaltens waren dabei GRÜN: auf dem
    // Auslöse-Tick läuft die Klammer VOR `onPlayerEvent`, der Wert stimmt dort
    // auch im kaputten Zustand. Nur der Tick DANACH zeigt es — und nur ein
    // echter Lauf hat es gezeigt.
    if (!this.camDetached) {
      const minX = this.camX + PAINT.screenBoxLeftPx * SUBS;
      const maxX = this.camX + (LOGICAL_W - PAINT.screenBoxRightPx) * SUBS;
      if (this.player.x < minX) this.player = { ...this.player, x: minX, vx: Math.max(this.player.vx, 0) };
      if (this.player.x > maxX) this.player = { ...this.player, x: maxX, vx: Math.min(this.player.vx, 0) };
    }
    this.clampOutOfWipe();
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
    this.atStageThreshold(events);
    this.nearOpenableCage(events);
    this.touchCheckpoints(events);
    this.collectLetters(events);
    this.checkExit(events);

    // per-tick camera follow (gameplay: the screen clamp reads camX next tick)
    // R5-W5 · B4b · D-186: …ausser während eines Kamera-Haltes. Der Halt läuft
    // HIER ab und nicht im Warp, weil er in TICKS zählt und nur dieser Schritt
    // Ticks hat; danach fährt dieselbe eased Fahrt wie immer die Strecke zum
    // Anker, ohne dass ein Sonderweg für die Rückkehr existiert.
    if (this.camHoldTicks > 0) {
      this.camHoldTicks -= 1;
    } else {
      const tx = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
      this.camX = clampScroll(stepCameraAxis(this.camX, tx), this.worldWpx, LOGICAL_W);
      this.camY = clampScroll(stepCameraY(this.camY, this.player.y), this.worldHpx, LOGICAL_H);
      // …und sobald sie angekommen ist, greift die Klammer wieder. `< SUBS` ist
      // »innerhalb eines Pixels«: `stepCameraAxis` läuft mit einer Mindest-
      // geschwindigkeit und trifft das Ziel exakt, ein Restweg von unter einem
      // Pixel ist also das Ende der Fahrt und keine Toleranz auf Verdacht.
      if (this.camDetached && Math.abs(this.camX - tx) < SUBS) this.camDetached = false;
    }
    // R3-11: LAST, on the fresh camera — a waiting asker is served the moment
    // the view actually contains it.
    this.servePending(events);
    // R5-W1 · F1 · LAST WORD ON THE DRAWING. Everything above may still move the
    // player: the ride contract regrounds him, the screen clamp kills his `vx`,
    // a creature's knockback throws him off the boards. stepPlayer derived a
    // pose before any of that, and Koki's replay is what the difference looks
    // like — standing on a plate in the spread-armed fall. The pose is therefore
    // committed HERE, once, on the finished state.
    this.finalizePose();
    return events;
  }

  /** The single commit point for the pose the scene draws. */
  private finalizePose(): void {
    this.player.pose = derivePose(this.player, this.poseLocked);
  }

  /**
   * ── R5-W5 · F6 · DAS KIND LÄUFT NICHT MEHR IN DIE TAFEL (R122, H3s Befund) ──
   *
   * H3 hat es gemessen und fotografiert (Bild 05): solange die besiegte Tafel auf
   * den Brettern sitzt, geht das Kind durch sie hindurch. **36 Ticks gedrückt =
   * 81 px Weg, und sie ist nur 74 px breit** — es steht dann mitten in ihrer
   * Zeichnung, hinter der Fläche, die es gerade wischt.
   *
   * Eine Klammer hat es dafür nie gegeben: `player.ts`, `sim.ts` und `collide.ts`
   * kennen weder `wipe` noch `boss` noch `tafel`. Das Kind wird an genau EINER
   * Stelle in seiner Bewegung begrenzt, nämlich vom Bildschirm-Kasten oben in
   * `step()` (W0-F7). Diese Klammer ist absichtlich dieselbe Bauform: Lage
   * anhalten, die Geschwindigkeit NACH INNEN töten, die nach außen lassen. Ein
   * Kind, das weggehen will, darf das jederzeit.
   *
   * ── Warum die Zahl 44 und nicht 45, und warum die REIHENFOLGE das entscheidet ─
   * `GUARDIAN_WIPE_REACH_PX` (45) ist die Kanten-Berührung: halbe Tafel (37,1 aus
   * dem Blatt-Seitenverhältnis) plus halbes Kind (8). Dort berühren sich die
   * beiden Körper, und dort soll das Kind stehen bleiben. Die Berührung selbst
   * fragt `< 45` (`inWipeReach`), also STRIKT darunter — eine Klammer auf 45 würde
   * das Wischen unerreichbar machen: das Kind stünde für immer einen Pixel zu weit
   * weg und die Tafel liefe in ihre Wartezeit. Die Klammer sitzt deshalb auf dem
   * größten ganzzahligen Abstand, der noch berührt: **44**.
   *
   * ★ Diese Zahl trägt nur, weil die Klammer VOR `stepEntityWorld` läuft, und das
   * hat ein Tamper bewiesen, nicht eine Überlegung: in der ersten Fassung stand
   * sie danach — dann sieht der Wesen-Schritt die UNGEKLAMMERTE Lage dieses Ticks,
   * die Berührung geht ohnehin auf, und 44 gegen 45 macht keinen Unterschied. Der
   * Tamper (44 → 45) blieb grün, der Test hat also nichts unterschieden. Hier
   * oben, direkt nach dem Bildschirm-Kasten, gilt die Zusage wirklich: **der
   * Wesen-Schritt bekommt das Kind niemals innerhalb ihrer Zeichnung zu sehen** —
   * und derselbe Tamper wird rot. Der Preis ist ein Tick Verzug (die Klammer liest
   * ihren Zustand aus dem vorigen Wesen-Schritt), genau wie der Bildschirm-Kasten
   * seine `camX` aus dem vorigen Tick liest.
   *
   * ── Warum BEIDE Bodenzustände ─────────────────────────────────────────────
   * `wipeable` (sie sitzt und wartet) und `wipe` (das Kind wischt) sind die zwei
   * Hälften desselben Vorgangs — R50: „wenn sie unten ist und man zu ihr geht".
   * In beiden steht sie still auf den Brettern, in beiden kann man in sie
   * hineinlaufen, und H3s Bild zeigt genau diesen Augenblick. Ihre übrigen
   * Bodenzustände (`sink`, `sad`, `settle`, `window`, `consoled`) lasse ich
   * ausdrücklich frei — sie gehören dem Sieg-Bogen und der Gegenkarte, nicht dem
   * Wischen; als Befund geht das an die Guardian-Bahn (H4).
   */
  private clampOutOfWipe(): void {
    const board = this.world.entities.find(
      (e) => e.role === "guardian" && !e.hidden && (e.state === "wipeable" || e.state === "wipe"),
    );
    if (board === undefined) return;
    const keepPx = GUARDIAN_WIPE_REACH_PX - 1;
    const dx = this.player.x - board.x;
    if (Math.abs(dx) / SUBS >= keepPx) return;
    const side = dx >= 0 ? 1 : -1; // auf 0 geht er nach rechts heraus, nie hindurch
    this.player.x = board.x + side * keepPx * SUBS;
    // nur die Geschwindigkeit NACH INNEN stirbt (wie im Bildschirm-Kasten)
    if (side > 0) this.player.vx = Math.max(this.player.vx, 0);
    else this.player.vx = Math.min(this.player.vx, 0);
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
        // R5-W4 · B4 · D-4: …and TELL THE SHELL. Up to here this branch changed
        // the world and announced nothing with an id on it, so the fact died
        // with the mount — which is why a paid trip to the Kleckskammer used to
        // hand every moth back unasked. The cage branch below has always emitted
        // `cageFreed`; this is the same courtesy for everyone else.
        if (e) events.push({ type: "entityResolved", id: e.id, role: e.role });
      }
    } else if (ctx.type === "cage") {
      const freed = this.cfg.freedCageIds().length + 1;
      // R5-W2 · H1: THIS is the moment a cage is actually done — not the burst,
      // which only takes the lid off. Marking it here is what closes the ↑ road
      // back again, so an answered cage stops offering a card it no longer owes.
      const cage = this.world.entities.find((x) => x.id === ctx.id);
      if (cage) cage.freed = true;
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
      // R5-W4 · C2 · R48: the toast said „Die Tür freut sich!" and Koki's reply
      // was „Die Tür freut sich? Die geht einfach auf." The payoff is already on
      // screen — `applyLinks(…, "opened")` opens the door in the same tick — so
      // the line was a caption on a thing the child was watching happen, in a
      // voice the chapter does not use. It is dropped rather than reworded: the
      // Spine's own tone rule says a payoff clause belongs only where the world
      // does NOT show it, and here the world does. („Die Tür wartet auf ihr
      // Wort!" stays, at :1095 — that one covers something invisible.)
    } else if (ctx.type === "guardian") {
      // ── R5-W4 · H2 · DIE ANTWORT IST DER HALBE WEG (Ruling R50) ───────────
      // Hier stand der ganze Sieg-Bogen: `hp` fiel, und im selben Zug wurde
      // gerechnet, getoastet und gewonnen. Seit R50 endet eine gelöste Karte
      // damit, dass die Tafel sich auf die Bretter setzt — mehr nicht. Was aus
      // der Schicht wird, entscheidet das Kind mit seinen Füssen, und der Rest
      // dieses Bogens ist deshalb dorthin gewandert, wo das WISCHEN gemeldet
      // wird (`onEntityEvent`, `guardianKnot`/`guardianDown`).
      //
      // Der Nebeneffekt ist ein besserer Bau als vorher: der Sieg hängt jetzt
      // an einem Ereignis der Welt statt an einem Rückgabewert einer
      // Karten-Antwort — dieselbe Zeile fängt ihn, egal wodurch er ausgelöst
      // wurde.
      guardianKnotSolved(this.world, ctx.id);
    }
    // `console` and `ceremony` carry no world change — the beat IS the payoff,
    // and answering it simply gives the world back.
    this.overlayOpen = false;
    return events;
  }

  /** The shell reports the task DISMISSED („Später") — no reward, no redeem.
   *
   *  R5-W2 · H1 · …AND THE WORLD COMES BACK. This used to be the single line
   *  below, and for every asker but one that was enough: a field being keeps
   *  patrolling, a cage keeps standing. The guardian is the exception, because
   *  she is the only being the SIM parks in a state her own tick refuses to
   *  advance — `window` has no timer and no fallback, unlike `stagger`, which
   *  has carried one since it was written („the no-card fallback that keeps her
   *  from freezing", entities.ts). So putting a boss card down left her hanging
   *  for good: no flight, no throw, no second window, `guardianDefeated` false
   *  forever, and therefore both the cage gate and the exit gate toasting until
   *  the child restarts the chapter. The clock reached it without a child's
   *  hand at all.
   *
   *  She returns to `stagger` and not to `fly` on purpose: it is the road the
   *  engine already maintains — its exit ships and is tested, its cell is
   *  painted, and its length is the tier's own `staggerTicks`. No new state, no
   *  new constant, no new cell; the recovery is a beat the child can see rather
   *  than a snap. `dodges` was already zeroed when the dip began, so the next
   *  window costs the same three dodges as any other.
   *
   *  The condition is the STATE, never the role: a chalk hit raises a boss card
   *  while she is mid-flight, and yanking her out of a telegraph the child has
   *  started reading would be the same class of defect pointing the other way. */
  dismissTask(ctx: TaskRequest["ctx"], events: SimEvent[] = []): SimEvent[] {
    this.overlayOpen = false;
    const id = askerIdOf(ctx);
    const asker = id === null ? undefined : this.world.entities.find((e) => e.id === id);
    if (asker?.role === "guardian" && asker.state === "window") {
      asker.state = "stagger";
      asker.timer = 0;
      asker.vx = 0;
      asker.vy = 0;
      events.push({ type: "toast", msg: "Die Tafel richtet sich wieder auf." });
    }
    return events;
  }

  spendLetters(n: number): boolean {
    if (this.lettersGot < n) return false;
    this.lettersGot -= n;
    return true;
  }

  /** Setzt das Kind an eine Zelle. Vorgabe: die Kamera springt mit.
   *
   *  R5-W5 · B4b · D-186 · `holdCameraTicks` ist die AUSNAHME und die einzige,
   *  die es gibt: so viele Ticks lang zieht die Sicht nicht nach, sondern bleibt
   *  stehen, wo sie war. Der Tinten-Rückweg benutzt sie, damit der Spritzer an
   *  der Stelle des Sturzes überhaupt im Bild ist (`onPlayerEvent`).
   *
   *  Warum HALTEN und nicht »sanft nachziehen«: die Pro-Tick-Kamera fährt mit
   *  `/4` je Tick (camera.stepCameraAxis). Bei p1 (Anker zwei Kacheln hinter der
   *  Grube) hätte das gereicht; bei p2 liegen zwischen Becken und Anker bis zu 28
   *  Kacheln, und dort ist der Spritzer nach drei von 26 Ticks aus dem Bild
   *  gefahren. Genau das steht in D-186 als »nur sichtbar, wenn der Checkpoint
   *  nahe am Teich liegt«. Ein Halt ist gegen die Entfernung unempfindlich; eine
   *  Fahrt ist es nicht. */
  warp(c: number, r: number, opts: { holdCameraTicks?: number } = {}): void {
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
      poseGrace: 0, // he is in the air at the new place, whatever he was doing at the old one
    };
    // …and the drawing follows: a warp clears the rope, the ledge and the vine,
    // so a hand left closed around any of them would be gripping nothing.
    this.finalizePose();
    const hold = opts.holdCameraTicks ?? 0;
    if (hold > 0) {
      // kein Sprung: die Sicht steht schon dort, wo der Spritzer entsteht — und
      // sie bleibt losgelöst, bis sie das Kind wieder eingeholt hat
      this.camHoldTicks = hold;
      this.camDetached = true;
    } else {
      this.camX = clampScroll(cameraTargetX(this.player.x, this.player.facing), this.worldWpx, LOGICAL_W);
      this.camY = clampScroll(this.player.y - Math.round(LOGICAL_H * 0.57) * SUBS, this.worldHpx, LOGICAL_H);
      this.camHoldTicks = 0;
      this.camDetached = false;
    }
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
      // R5-W5 · B4b · D-186: der Rückweg zum Anker hält die Sicht so lange am
      // Spritzer, wie der Spritzer lebt (`ink.INK_SPLASH_TICKS` — EINE Zahl für
      // Bild und Regie, damit die Sicht nicht abfährt, während noch Tropfen
      // fliegen, und nicht wartet, wenn die Kunst kürzer wird).
      if (ev.hazard === "w" && this.respawnCell) {
        this.warp(this.respawnCell.c, this.respawnCell.r - 1, { holdCameraTicks: INK_SPLASH_TICKS });
      }
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
    this.cfg.onEntityAudio?.(ev); // R5-W6 · S2: siehe SimCfg#onEntityAudio
    switch (ev.type) {
      case "encounter": {
        const src = this.world.entities.find((e) => e.id === ev.id);
        // R5-F2 · DER RÜCKSTOSS GEHÖRT DEM BOSS (Architekten-Ruling 11.08.).
        //
        // Vorgeschichte, weil die Zeile sonst wieder „aufgeräumt" wird: hier
        // stand ein Aufruf von `applyKnockback`, dessen Rückgabewert verworfen
        // wurde — die Funktion ist REIN, also traf ein Wesen das Kind, ohne es
        // je anzufassen (D-17). Beim Reparieren fiel zweierlei auf: das
        // Vorzeichen war zusätzlich verkehrt (das Kind wäre IN das Wesen
        // gestoßen worden), und — gemessen, nicht vermutet — p2 löst zwölf
        // solcher Berührungen in EINEM Durchlauf aus: die Schwärme dort sind
        // als Durchgangs-Stationen gebaut, nicht als Strafen. Ein Rückstoß auf
        // jede Berührung hat den aufgezeichneten Piloten den Ausgang nicht mehr
        // erreichen lassen (2361 statt 965 Ticks).
        //
        // Deshalb trifft der Rückstoß nur dort, wo ein Treffer WEHTUN SOLL: die
        // Kreide der Tafel. Das ist auch, was doc 44 §4 ch01 C4 wörtlich sagt
        // („a chalk hit = knockback + a boss-window task") — die Kreide, nicht
        // jedes Möbelstück im Flur. Feld-Wesen bleiben, was sie sind: sie
        // fragen etwas und lassen den Körper in Ruhe.
        if (src?.role === "guardian") {
          const dxPx = (src.x - this.player.x) / SUBS;
          // Eine Quelle fast senkrecht über dem Kind gibt keine ehrliche
          // Seitenrichtung her (die Tafel FLIEGT) — dann stößt es rückwärts,
          // genau wie der Gefahren-Zweig es seit jeher tut.
          const fromDir: 1 | -1 = Math.abs(dxPx) >= KNOCK_DIR_MIN_PX
            ? (dxPx > 0 ? 1 : -1)
            : this.player.facing;
          this.player = applyKnockback(this.player, fromDir, false);
        } else {
          this.player.iframes = PAINT.iframeTicks;
        }
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
        // R5-P1 Arena-Gesetz: der Kaefig wartet auf den Sieg. Die Copy war als
        // P4-Platzhalter markiert; R5-W2 · H1 loest sie ein — sie sagt jetzt die
        // REIHENFOLGE, die der Raum erzaehlt (Sieg → Foto → Tor), statt eine
        // Anweisung, die klingt, als koenne man etwas falsch machen.
        // R5-W4 · H2 (R50): dieselbe Reihenfolge, aber sie nennt jetzt die
        // Handlung, die den ersten Schritt abschliesst — Koki wollte die Copy
        // „viel direkter".
        // R5-W7 · S3 · D-372: auch das hier ist ein Torschluss, also feuert das
        // Ereignis. Es KLINGT aber nicht (Manifest: `reason === "cageGated"` ist
        // bewusst still) — dieser Augenblick hat mit `cage-locked` am
        // EntityEvent schon seinen Klang, und bis heute kam der Toast-Klang
        // obendrauf. Ein Beat, ein Klang.
        if (this.gateToastCooldown === 0) { events.push({ type: "gate", reason: "cageGated" }, { type: "toast", msg: "Erst die Tafel sauber — dann der Käfig.", echoes: "gate" }); this.gateToastCooldown = 120; }
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
      // R5-W2 · H1 · the same rescue, raised again at a cage that is already
      // open and still owes it. No hold and no iris: the opening is a beat that
      // has already played, and replaying it would re-stage a moment the child
      // has seen. Only the card comes back.
      case "cageAsk": {
        const e = this.world.entities.find((x) => x.id === ev.id);
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
        // R5-W5 · G4 · the uniform piece. Modelled on the Bonus-Buch branch
        // below (a counter and one event, no `overlayOpen`) and NOT on the
        // Regel-Seite's freeze: the naming card comes later, at every third
        // find, and it waits until the hero is standing. The chapter-wide tally
        // is deliberately NOT kept here — a phase is remounted whenever the
        // child comes back from the Kleckskammer, so a per-sim counter would
        // restart mid-run; the ledger that survives that lives in the shell.
        if (ev.role === "cloth") {
          events.push({
            type: "cloth",
            id: ev.id,
            wordEn: String(e?.params.wordEn ?? ""),
            x: e?.x ?? this.player.x,
            y: e?.y ?? this.player.y,
          });
          events.push({ type: "puff", x: e?.x ?? this.player.x, y: e?.y ?? this.player.y, kind: "chalk" });
          break;
        }
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
          skin: String(e?.skin ?? "regelseite"),
          topicDe: String(e?.params.topicDe ?? ""),
          erklaerungDe: String(e?.params.erklaerungDe ?? ""),
          merksatzDe: String(e?.params.merksatzDe ?? ""),
          schluesselDe: String(e?.params.schluesselDe ?? ""),
          // filtered to strings rather than mapped through String(): a stray
          // number in the array should show up as a MISSING line the gates can
          // see, not as the word „42" set in the accent ink.
          beispieleEn: Array.isArray(e?.params.beispieleEn)
            ? e.params.beispieleEn.filter((x): x is string => typeof x === "string")
            : [],
          belegDe: String(e?.params.belegDe ?? ""),
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
      // ── R5-W4 · H2 · DAS WISCHEN MELDET SICH (Ruling R50) ──────────────────
      // Die beiden Ereignisse kamen bis hierher aus dem Rückgabewert von
      // `solveTask` und wurden dort auch beantwortet. Seit dem Wischen entstehen
      // sie mitten in einem gewöhnlichen Welt-Takt, also müssen sie durch diesen
      // Trichter — und ohne einen Fall hier würde der `default`-Zweig sie
      // schlucken, still, mitsamt dem Sieg.
      case "guardianKnot": {
        // Plural von Hand, weil „Noch 1 Kritzel-Schichten!" ein Kind über
        // dieselbe Zeile stolpern lässt, die es gerade gelesen hat.
        const n = ev.knotsLeft;
        events.push({ type: "toast", msg: `Noch ${n} Kritzel-Schicht${n === 1 ? "" : "en"}!` });
        events.push({ type: "guardianWipe", id: ev.id, layersLeft: n });
        break;
      }
      case "guardianDown": {
        this.guardianDefeated = true;
        const g = this.world.entities.find((x) => x.id === ev.id);
        // ── R5-W2 · H1 · DIE LANDUNG WIRD GESEHEN ──────────────────────────
        // Der Sieg-Bogen spielte bisher in einem leeren Raum. `guardianDown`
        // setzte KEINE Haltezeit (anders als der berstende Käfig, der seine
        // seit jeher hat), und die Karte, die den Beat beschreibt, geht sofort
        // auf — eine offene Karte hält aber die ganze Welt an. Also sank sie
        // erst, NACHDEM Finale- und Konsolen-Karte wieder zu waren: das Kind
        // las „…und sie blüht sonnengelb auf", während sie noch in der Luft
        // hing, und die Karte deklariert dabei `tafel_rest`.
        //
        // Die Haltezeit wird aus IHRER Lage gerechnet, nicht getippt — genau
        // das Muster, das der Käfig schon benutzt. Fällt sie tiefer, dauert es
        // länger; das ist keine Zahl, die veralten kann. Seit R5-W4 steht sie
        // beim letzten Wischen schon auf den Brettern, der Fall ist also fast
        // null und die Haltezeit fast nur noch ihre Ruhe — dieselbe Formel,
        // ohne eine einzige Anpassung, weil sie IHRE LAGE liest.
        if (g) {
          const floorY = groundSurfaceAt(this.grid, g.x / SUBS, Math.max(Math.floor(g.y / SUBS / TILE) - 1, 0), 24);
          const fall = floorY === null ? 0 : Math.max(0, (floorY.yPx * SUBS - g.y) / SINK_SPEED);
          this.holdTicks = Math.ceil(fall) + SAD_TICKS + LANDING_SETTLE_TICKS;
        }
        events.push({ type: "guardianWipe", id: ev.id, layersLeft: 0 });
        events.push({ type: "guardianDown", id: ev.id, skin: g?.skin ?? "" });
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
        events.push({ type: "cageHint", id: e.id });
        return;
      }
    }
  }

  /** R5-W2 · H1 (Teil 3) · DIE ARENA-ANLEITUNG, an der Schwelle.
   *
   *  „Wie besiegt man den Boss? Muss instruiert und gescaffoldet sein" (doc 45
   *  F2). Der Ort ist nicht frei gewählt: `arena.md` §3 verortet den Takt an der
   *  BÜHNEN-SCHWELLE — dem Übertritt von der Kulisse auf die Bretter. Genau dort
   *  wechselt der Raum seine Bedeutung, und genau dort steht das Kind noch
   *  ausserhalb jeder Wurfbahn (die Westkulisse ist seit Teil 2 mechanisch
   *  ruhig, weil die Klammer nun auch den Dip hält).
   *
   *  Die Schwelle wird vom LEVEL gelesen (`stageMinC` der Tafel), nicht getippt:
   *  dieselbe Zahl, die ihre Bahn klemmt, ist die Kante, an der ihre Anleitung
   *  fällig wird. Ein Raum, der die Bühne verschiebt, verschiebt beides.
   *
   *  Die Freeze-Paarung ist die des Käfig-Hinweises, und zwar aus dessen Narbe
   *  heraus: der Shell wird GEFRAGT, bevor `overlayOpen` gesetzt wird — sonst
   *  friert die Welt für eine Karte, die der Shell dann nicht öffnet. */
  private atStageThreshold(events: SimEvent[]): void {
    if (this.arenaBriefFired || this.cfg.arenaBriefShown?.() === true) return;
    const g = this.world.entities.find((e) => e.role === "guardian" && !e.hidden);
    if (!g || g.params?.stageMinC === undefined) return;
    if (fromSubs(this.player.x) < Number(g.params.stageMinC) * TILE) return;
    this.arenaBriefFired = true;
    this.overlayOpen = true; // die Anleitung ist eine Karte: die Welt wartet
    events.push({ type: "arenaBrief" });
  }

  private touchCheckpoints(events: SimEvent[]): void {
    const c = Math.floor(fromSubs(this.player.x) / TILE);
    const r = Math.floor((fromSubs(this.player.y) - 1) / TILE);
    if (glyphAt(this.grid, c, r) === "C" || glyphAt(this.grid, c, r + 1) === "C") {
      if (this.respawnCell?.c !== c) {
        // The anchor itself is unconditional — this line is what an ink splash
        // comes back to, and R44 changed only how the anchor SHOWS itself.
        this.respawnCell = { c, r: Math.max(r, 1) };
        // R5-W4 · B4 · R44: …so a silent chapter takes the anchor and says
        // nothing. Announcing a being the child cannot see would be worse than
        // the clutter Koki asked us to remove.
        if (this.cfg.level.checkpointStyle !== "silent") {
          events.push({ type: "toast", msg: "Krakel skizziert dich!" });
        }
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
        this.runTakenCells.add(key);
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
        if (this.gateToastCooldown === 0) { events.push({ type: "gate", reason: "powerup" }, { type: "toast", msg: "Du hast noch etwas Wichtiges vergessen!", echoes: "gate" }); this.gateToastCooldown = 120; }
        return;
      }
      // exit doors gate the X until their word is said (ch01 imperative law)
      const gate = this.phase.entities.find((e) => e.role === "door.trigger" && e.params?.kind === "exit");
      if (gate && !this.doorSolved.has(gate.id)) {
        if (this.gateToastCooldown === 0) { events.push({ type: "gate", reason: "tuerwort" }, { type: "toast", msg: "Die Tür wartet auf ihr Wort!", echoes: "gate" }); this.gateToastCooldown = 120; }
        return;
      }
      if (this.phase.entities.some((e) => e.role === "guardian") && !this.guardianDefeated) {
        // R5-W4 · H2 (R50): der Grund, warum das Tor zu ist, steht jetzt in der
        // Zeile selbst. „Sie möchte noch reden" war unter der alten Lore wahr
        // und ist unter der neuen eine Ausrede — das Kind sieht die Kritzelei.
        if (this.gateToastCooldown === 0) { events.push({ type: "gate", reason: "tafel" }, { type: "toast", msg: "Die Tafel ist noch voller Kritzel!", echoes: "gate" }); this.gateToastCooldown = 120; }
        return;
      }
      // ── R5-W2 · H1 · DER AUSGANG WARTET AUFS KLASSENFOTO (Koki, 14.08.2026)
      //
      // Die leeren Stühle im Saal sind das LOCH, das dieses Kapitel erzählt, und
      // das Foto im letzten Käfig ist das erste Bild der fehlenden Klasse —
      // der zweitgrösste Gefühls-Beat des Kapitels. Ohne dieses Tor konnte ein
      // Kind zwei Kacheln daran vorbeilaufen und die Seite umblättern.
      //
      // Gefahrlos ist es erst seit Teil 1: ein Käfig galt als erledigt, sobald
      // der Deckel absprang, also sperrte »Später« auf der Rettungs-Karte den
      // Insassen für immer aus — ein Tor darauf wäre eine SPERRE gewesen. Der
      // Rückweg (`cageOwesCard` + `cageAsk`) steht, deshalb steht jetzt das Tor.
      // Gefragt wird nach `freed`, nicht nach `redeemed`: der Deckel ist nicht
      // die Rettung, die beantwortete Karte ist es.
      // NUR in der Boss-Phase: p1–p3 sind Lehr-Räume, deren Käfige man liegen
      // lassen darf (der Bilanz-Bogen zählt sie). Ein Tor über alle Phasen wäre
      // eine andere, viel grössere Entscheidung als die, die getroffen wurde.
      const caged = this.phase.entities.some((e) => e.role === "guardian")
        ? this.world.entities.find((e) => e.role === "cage" && !e.freed)
        : undefined;
      if (caged) {
        if (this.gateToastCooldown === 0) {
          // Die Zeile kommt vom KÄFIG, nicht aus dem Shell: `captiveDe` ist die
          // Wahrheit des Levels („das Klassenfoto"), und ein Shell, der »Die
          // Tafel« für alle fünfzehn Kapitel hineinschreibt, ist genau die
          // Klasse, die dieser Auftrag anderswo als Schuld gemeldet hat.
          const who = String(caged.params.captiveDe ?? "der Insasse");
          const Who = who.charAt(0).toUpperCase() + who.slice(1);
          // R5-W7 · S3 · D-372: dieses Tor war das einzige der vier, das GAR
          // NICHT klang — sein Satz wird aus dem Level gebaut und passte
          // deshalb auf kein Textmuster. Am Ereignis klingt es wie die anderen.
          events.push({ type: "gate", reason: "klassenfoto" }, { type: "toast", msg: `${Who} hängt noch im Käfig!`, echoes: "gate" });
          this.gateToastCooldown = 120;
        }
        return;
      }
      this.exitFired = true;
      events.push({ type: "exit", to: this.phase.exit.to });
    }
  }
}
