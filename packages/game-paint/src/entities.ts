/**
 * entities — the chapter's living things, as PURE BRAINS (the arcade.ts law:
 * fixed 60 Hz ticks, integer subpixels, Phaser-free, fully unit-testable).
 *
 * Roles per the frozen ch01 sheet §4: chaser · gunner · flyer · bouncer ·
 * crusher · swarm · platform.move/fall/swing · cage · powerup · door.trigger ·
 * guardian. Encounters NEVER kill (doc 31 §1): touching a cross being opens a
 * TASK; solving it redeems the being (dazed-happy, out of play). The fist only
 * shoos and deflects — it never redeems (§3).
 *
 * Source-adopted numbers (audit r3): the G3 ride contract lands scene-side
 * (land tolerance max(|Δvy|+2, 4) px, detach at ≥9 px); G11 arena grammar
 * (camera lock + clock-gated pattern states + exit-on-victory) lives in the
 * guardian machine here.
 */
import { PAINT, SUBS, TILE } from "./paint.ts";
import { glyphAt, groundSurfaceAt, isHazard, isSolid, walkSurfaceAhead } from "./collide.ts";
import { flightUnitAt, knotIndex, pathForKnot } from "./flight.ts";
import type { EntitySpec, LinkSpec } from "./level.ts";

export interface EntityState {
  id: string;
  role: EntitySpec["role"] | "guardian";
  skin: string;
  tier: "E" | "M" | "S";
  /** feet-center position in subs (the player convention). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  /** role FSM: patrol|telegraph|act|recover|dazed — cages: closed|shaking|burst
   *  — guardian (PK-R6 · E, airborne): fly|telegraph|throw|dip|stagger|window|
   *  sink|sad|consoled. */
  state: string;
  timer: number;
  hp: number;
  homeX: number;
  homeY: number;
  redeemed: boolean;
  /** R5-W2 · H1 · cages only: has this cage's RESCUE actually been answered?
   *
   *  It cannot be read off `redeemed` or off the state, and that gap was a
   *  softlock. A cage sets `redeemed` the instant it BURSTS — it has to, or the
   *  throw-open would not animate behind the ink iris, which runs under a hold
   *  that steps redeemed beings only. And `burst` turns into `open` on its own
   *  after CAGE_OPEN_TICKS whether or not anybody answered anything. So both of
   *  the marks that look like „done" really mean „the lid is off".
   *
   *  Meanwhile `engageTargetId` skips redeemed beings, so putting the rescue
   *  card down with „Später" left the cage open, unanswered and unreachable
   *  FOREVER — its captive owed a card that ↑ could no longer raise. A
   *  classmate cage is safe by accident (it hands over to the ceremony, and
   *  `awakenAsk` is that ceremony's declared road back); the four object cages
   *  had none, and one of them holds the class photo the whole first chapter
   *  is about.
   *
   *  Only a plain cage can OWE — see `cageOwesCard`. */
  freed: boolean;
  hidden: boolean; // revealed via links
  /** PK-R6 · C2 · guardians only: chalk thrown at this child that MISSED since
   *  the last counter-window. See DODGES_PER_WINDOW — this is the fist-less
   *  road into the fight. */
  dodges: number;
  /** PK-R6 · E · guardians only: how many pieces of chalk she has thrown this
   *  fight. It is the DETERMINISTIC cursor into the six painted chalk sticks
   *  (CHALK_COLOURS) — a count the replay reproduces exactly, where a random
   *  pick would give the proof tape a different-coloured arena every run. */
  throws: number;
  /** PK-R6 · D · classmates only: how many reawakening rounds she has been
   *  given back, 0 … AWAKEN_ROUNDS (doc 44 §3.3). It is a COUNT rather than a
   *  reuse of `hp`, because it is read by the renderer as well as the sim —
   *  anim.washAlphaFor turns it into how grey she still is, and a number that
   *  means "hits left" in one file and "colour restored" in another is the
   *  drift class the pose thresholds were derived to avoid. */
  awakenStep: number;
  /** PK-R6 · H1 · ticks since this being was FREED — the colour flood's own
   *  clock, and the reason it is not `timer`.
   *
   *  Found by the hold (round-1 critique, finding 5) and older than it: the
   *  flood was read off `timer`, which every state change resets. A freed moth
   *  therefore re-drained and re-flooded when its joy lap ended (150 t), and a
   *  freed classmate did it again at every settle → joy → rest → wave, i.e. she
   *  went grey for half a second every seven seconds for the rest of the
   *  chapter. Invisible while the flood was a 0.12 shimmer, and a lie the moment
   *  the flood became the ceremony's payoff. This counter only ever counts up. */
  freedTick: number;
  /** PK-R6 · E · guardians only: ticks spent ON THE PATH. It advances only while
   *  she is flying — she holds station to telegraph — so the shape is not cut
   *  short and restarted by every throw, which is what `timer` (reset per state)
   *  would have done. It is also what makes „she flew a whole path" a countable
   *  claim rather than a screenshot. */
  flightTick: number;
  /** R5-W1 · F1 · bouncers only: ticks since this body last touched the ground.
   *  It drives the hop's gravity clock (see BOUNCE_GRAVITY_EVERY) and, in the
   *  renderer, the impact squash — and it is its OWN field rather than `timer`
   *  because `timer` carries the idle bob's phase: resetting that on every hop
   *  would freeze the two-cell breath onto one frame forever. */
  bounceTick: number;
  params: Record<string, unknown>;
}

export interface ProjectileState {
  id: number;
  /** PK-R6 · E: `shard` is the piece a landed chalk leaves behind — it does not
   *  fly, it LIES there for SHARD_TICKS as a floor hazard (doc 44 §4 ch01 C4:
   *  „chalk shards linger 1 s as floor hazards"). */
  kind: "chalk" | "blob" | "shard";
  x: number;
  y: number;
  vx: number;
  vy: number;
  deflected: boolean;
  fromId: string;
  dead: boolean;
  /** ticks alive — a deflected piece that hits nothing shatters on this (R3-4). */
  age: number;
  /** PK-R6 · E · which of the six painted sticks this is (`chalk_red` …). Carried
   *  on the piece rather than recomputed by the renderer, so the stick that
   *  shatters is the stick that flew, and its shard inherits the same colour. */
  colour: string;
  /** R5-W2 · H1 (Teil 3) · Zählt dieses Stück auf die Überreiz-Zählung?
   *
   *  Undefiniert heisst JA — jedes Stück, das je geworfen wurde, zählte, und das
   *  soll so bleiben. Nur das FÜHRENDE Stück der Gabel steht auf `false`: sonst
   *  wäre ein Fenster ab Knoten 2 nach anderthalb Würfen offen statt nach drei,
   *  und die Eskalation würde den Kampf VERKÜRZEN statt ihn zu verdichten. */
  scores?: boolean;
}

export type EntityEvent =
  | { type: "encounter"; id: string; role: string; skin: string }
  /** PK-R6 · C1: the child stepped up to a drained object and pressed ↑. The
   *  sim turns this into the being's `restore` card; solving it redeems the
   *  object and the colour floods back (anim.washAlphaFor). */
  | { type: "engaged"; id: string; role: string; skin: string }
  | { type: "cageHit"; id: string; hpLeft: number }
  | { type: "cageBurst"; id: string; skin: string }
  /** R5-W2 · H1: the child stepped up to an already-open cage whose rescue is
   *  still owed and pressed ↑. Same anti-softlock half as `awakenAsk` below,
   *  for the beings that never had one — and deliberately NOT a second
   *  `cageBurst`, because the lid is already off and the ink iris is a beat
   *  that has already played. */
  | { type: "cageAsk"; id: string; skin: string }
  | { type: "cageGated"; id: string }
  /** PK-R6 · D: the child stepped up to a half-woken classmate and pressed ↑.
   *  The ceremony resumes at the round she is on — this is the anti-softlock
   *  half of the reawakening (PB-T1): „Später" on round 3 must not leave a
   *  friend standing grey with no way back into her own rescue. */
  | { type: "awakenAsk"; id: string; skin: string }
  | { type: "doorTouched"; id: string; kind: string }
  | { type: "powerupTaken"; id: string; grants: string }
  /** PK-R3b · R3-16: a static-state collectible was walked into — a Regel-Seite
   *  (which stops the world to show its rule) or a Bonus-Buch (which does not). */
  | { type: "pickupTaken"; id: string; role: "tip" | "book" | "cloth"; skin: string }
  | { type: "guardianStagger"; id: string }
  | { type: "guardianKnot"; id: string; knotsLeft: number }
  | { type: "guardianDown"; id: string }
  | { type: "projectileDeflected"; id: number }
  /** R3-4/R3-6 · a puff of chalk dust in world px — the ONLY way impact becomes
   *  visible without the sim knowing what a particle is. `chalk` = a piece
   *  shattering, `hit` = the fist landing on something solid. */
  | { type: "puff"; x: number; y: number; kind: "chalk" | "hit" }
  | { type: "shooed"; id: string };

export interface WorldInput {
  playerX: number; // subs
  playerY: number;
  playerIframes: number;
  /** R5-P1: Käfige gegated, solange der Phasen-Wächter steht (Arena-Gesetz). */
  cagesGated?: boolean;
  playerOverlayOpen: boolean; // world frozen while a task is up
  fist: { active: boolean; x: number; y: number } | null;
  /** PK-R6 · C1/C2 · THE ENGAGE PRESS. ch01 grants no fist (doc 44 §4: the
   *  ability arc starts bare), so the verb that reaches a bewitched thing can
   *  no longer be a punch. It is ↑ — the same key that already climbs a vine —
   *  pressed while standing at the thing. RISING EDGE only: the sim hands this
   *  in as an edge, never as "up is held", so walking up a vine past a drained
   *  desk cannot fire its card. */
  playerEngage?: boolean;
}

export interface EntityWorld {
  entities: EntityState[];
  projectiles: ProjectileState[];
  links: LinkSpec[];
  nextProjectileId: number;
  guardianKnots: number; // knots remaining on the arena guardian (0 = down)
}

const BODY_HALF_PX = 8;
const AGGRO_X_PX = 72;
/** Patrol speed of a walking enemy. Exported because the RENDERER derives its
 *  run-pose threshold from it (anim.entPoseCell) — one source of truth, so the
 *  pose can never silently drift out of step with the walk it depicts. */
export const ENEMY_WALK = Math.round(0.6 * SUBS);
const ENEMY_LUNGE = Math.round(1.6 * SUBS);
/** A bouncer's upward impulse at ground contact (same reason as ENEMY_WALK:
 *  the squash pose keys off it). */
export const BOUNCE_UP = Math.round(3.2 * SUBS);
/** R5-W1 · F1: the bouncer's gravity clock — one +1 px/t every N ticks since
 *  its last ground contact, the same device the player's arc uses. 2 is what
 *  turns a 3,6-px/6-tick vibration into a ~13,6-px/~15-tick hop. */
export const BOUNCE_GRAVITY_EVERY = 2;
/** Half-width, in px, of a flyer's sine patrol around its home — the bank pose
 *  fires near the extremes, where the flyer rolls into its turn. */
export const FLYER_SWEEP_PX = 40;
const GRAVITY = PAINT.gravity;

/** doc 40 §2 · THE TURN STATE — the study's "biggest missing beat". A creature
 *  that reverses used to flip on tick 1, which reads as a glitch rather than a
 *  decision; it now spends 18 t (300 ms) turning and the flip lands at the
 *  MIDPOINT. Exported because anim.ts derives its pose thresholds from the sim
 *  constants they depict, never from re-typed numbers. */
export const TURN_TICKS = 18;
export const TURN_FLIP_AT = Math.floor(TURN_TICKS / 2);
/** doc 40 §4 · the chalk a guardian throws lives on a leash: a deflected piece
 *  that hits nothing must SHATTER rather than sail on as a lingering orb. */
export const CHALK_LIFE_TICKS = 180;
/** PK-R6 · C2 · how many thrown pieces the child must let fall before the
 *  guardian over-reaches and opens a counter-window. Three is the arcade
 *  read — long enough that the window feels earned, short enough that a
 *  six-year-old who is only dodging still gets into the fight (the guardian
 *  throws every 150 t at tier E, so a window opens roughly every 7.5 s). */
export const DODGES_PER_WINDOW = 3;

/** R5-W2 · H1 · THE STATES A CARD OWNS — the declared exception to the world's
 *  one standing rule about entity state: *a state this tick refuses to advance
 *  must be owned by something else, and that owner must hand it back.*
 *
 *  Every other parked state has its own road home in this file — `stagger`
 *  times out, `burst` retires itself, `caged`/`closed` are reachable with ↑.
 *  `window` has none by design: the card IS the timer, and the hand-back is the
 *  card closing. That was fine right up until the day one exit forgot to hand
 *  back, and the chapter became unwinnable (see `sim.dismissTask`).
 *
 *  So the exception is written down rather than implied, and declaring a state
 *  here buys a stricter duty instead of a pass: `dismiss-resumes.test.ts`
 *  proves every entry here comes back from BOTH card exits — solved and put
 *  down — and reports any entry that is no longer reachable as dead text. A new
 *  parked state fails that law until it is declared, and declaring it fails the
 *  law until both exits are wired. */
export const CARD_OWNED_STATES: ReadonlySet<string> = new Set(["window"]);

// ── R3-5 · REDEMPTION CHANGES STATE, NEVER PRESENCE (doc 40 §3) ──────────────
// Redeeming used to park a being in a terminal `dazed` and stop stepping it:
// the freed moth never flew its Freudenrunde, the book drifted off as if
// nothing had happened, and the eraser wandered out of the level for good.
// doc 31's kindness economy demands the friend STAYS. So redemption now enters
// a state PAIR — `joy` (a lap around its home) → `rest` (settled AT home) —
// and the settle is what brings a wanderer back rather than letting it leave.
/** How long the Freudenrunde runs before the friend settles. */
export const JOY_TICKS = 150;

// ── PK-R6 · D · THE REAWAKENING (doc 44 §3.3) ────────────────────────────────
// „The freed classmate stands ghost-pale and acts out the unit's wrong-actions
// round by round — the pose IS the prompt … Correct → the classmate regains one
// degree of motion/colour; final round → full colour, joy loop, the cage opens."
/** How many rounds one reawakening runs. Six is doc 44 §3.3's own number
 *  („6 rounds, `Runde n/6`"), and it is a LAW rather than a tuning knob: the
 *  content gate (check-game-tasks layer 5) demands exactly this many bound
 *  rescue cards, and the wash divides the ghost-grey into exactly this many
 *  steps. One constant, three readers — a five-round chapter turns red. */
export const AWAKEN_ROUNDS = 6;
/** How long she stands in `settle` — eyes closing, hands coming together —
 *  before the Freudenrunde. Her own painted beat (`merle_settle0/1`): the
 *  moment of coming back to herself, which the joy would otherwise cut off. */
export const SETTLE_TICKS = 54;
/** How long a burst cage throws itself open, in ticks (≈270 ms at the 60 Hz
 *  contract; formerly anim.ts, re-exported there). R5-A8: the burst is a BEAT,
 *  not a resting state — its art shows the captive mid-escape, so after this
 *  window stepRedeemed settles the cage into `open` (the captive-free resting
 *  pair). The sim's post-burst hold (Sim.holdTicks) and the scene's pop
 *  (PaintScene.cagePopT) read the same number, so drawn = played. */
export const CAGE_OPEN_TICKS = 16;
/** Once settled at home a freed classmate WAVES now and then, so a friend who
 *  stays for the rest of the chapter reads as present rather than parked
 *  (doc 44 §1: redemption changes state, never presence). */
export const WAVE_EVERY_TICKS = 420;
export const WAVE_TICKS = 96;
/** Wie lange die Tafel am Boden RUHT, bevor der Trost-Takt sie beantwortet
 *  (R3-5).
 *
 *  R5-W4b · H3 (D-191): hier stand „cries". Die Maschine sagt seit doc 44 §2.2
 *  etwas anderes, und zwar an der Stelle, die diese Konstante benutzt
 *  (`stepGuardianLanding`: „sie RUHT, sie weint nicht"). Zwei Sätze über
 *  denselben Takt, und der falsche stand dort, wo man zuerst hinsieht. Sie ist
 *  nicht traurig, weil sie verloren hat — sie ist müde, weil sie endlich sauber
 *  ist; genau davon hängt ab, ob der Trost-Takt danach als Erlösung liest oder
 *  als Mitleid. */
export const SAD_TICKS = 48;
/** Which roles are redeemable creatures. Cages, doors and powerups also carry
 *  `redeemed`, but they are doc 40 §3 STATIC-STATE — no rig, no orbit. */
export const JOY_ROLES = new Set(["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"]);
/** Airborne roles loop wide; ground roles bob in place so joy never reads as
 *  levitation. */
const joyRadiusPx = (role: string): { rx: number; ry: number; lift: number } =>
  role === "flyer" || role === "swarm" ? { rx: 26, ry: 12, lift: 10 } : { rx: 11, ry: 5, lift: 4 };

// ── R5-W4 · F5 · DER KRITZEL-ANFALL (Kokis Replay 15.08.) ────────────────────
// „Der Bleistift könnte crazier animiert sein, nicht nur links-rechts laufen —
// dann macht ‚Listen!' Sinn, statt dass er nur wie die anderen verloren wirkt."
//
// Das ist kein Animationswunsch, es ist das Spine-Gesetz: die Karte behauptet
// „Der Bleistift kritzelt wild über das Papier." und lässt das Kind darauf
// antworten „Listen!". Die Welt zeigt dazu einen Läufer, der brav patrouilliert.
// Der Text behauptet mehr als das Bild — und der Befehl ZUHÖREN ergibt nur
// gegen etwas Sinn, das gerade NICHT zuhört.
//
// Der Anfall ist deshalb ein SIM-Zustand, kein Render-Trick: was das Kind
// beantwortet, muss in der Simulation passiert sein, sonst behauptet die
// nächste Karte wieder etwas, das nur der Zeichner weiss.
//
// Drei Bedingungen, die den Entwurf festlegen:
//  · NETTO NULL. Der Körper kehrt am Ende des Anfalls exakt auf den Punkt
//    zurück, an dem er ihn begonnen hat. Sonst wandert ein Läufer über die
//    Laufzeit aus seinem autorisierten Band (`patrolMinC/MaxC` — das Band, mit
//    dem ein Lehr-Screen seine Null-Gefahr-Zone garantiert), und die
//    Beweisbänder eines Kapitels wären nicht mehr wiederholbar.
//  · GERADE ANZAHL RICHTUNGSWECHSEL, damit auch die Blickrichtung zurückkommt.
//  · KEIN NEUES FELD an EntityState und KEIN neues Level-Datum: der Takt kommt
//    aus dem, was schon da ist (dem eigenen Namen und der eigenen Uhr).
/** Wie lange ein Anfall dauert — Vielfaches von FRENZY_FLIP_TICKS, damit
 *  Ausschlag UND Blickrichtung am Ende wieder auf null stehen. */
export const FRENZY_FLIP_TICKS = 7;
export const FRENZY_TICKS = FRENZY_FLIP_TICKS * 6; // 42 Ticks ≈ 0,7 s
/** Ausfallschritt um den Ankerpunkt, in logischen px. Klein: er kritzelt, er
 *  greift nicht an — der Angriff ist `telegraph`/`act` und bleibt unberührt. */
export const FRENZY_REACH_PX = 3;
/** Wie lange er zwischen zwei Anfällen patrouilliert (Spanne; der eigene Name
 *  wählt daraus, damit zwei Läufer im selben Raum nicht im Gleichtakt zucken). */
export const FRENZY_EVERY_MIN = 150;
export const FRENZY_EVERY_SPAN = 70;

/** Der Abstand zwischen zwei Anfällen für DIESES Wesen. Rein und aus dem Namen
 *  — dieselbe Streuung, die das Käfig-Rütteln benutzt. */
export const frenzyEveryFor = (id: string): number =>
  FRENZY_EVERY_MIN + (id.length * 37 + id.charCodeAt(0) * 7 + id.charCodeAt(id.length - 1)) % FRENZY_EVERY_SPAN;

/** Der Ausschlag des Kritzelns bei Anfall-Tick `t`, in SUBS und ganzzahlig.
 *
 *  Ganzzahlig und über DIFFERENZEN angewandt (siehe unten): so summiert sich
 *  die Bewegung über einen Anfall exakt zu null, statt „ungefähr" zu null —
 *  eine Rundung pro Tick wäre über 42 Ticks ein Drift, und ein Drift wäre
 *  genau der Band-Bruch, den diese Kurve vermeiden soll. */
export const frenzyOffsetSubs = (t: number): number =>
  Math.round(Math.sin((t / FRENZY_FLIP_TICKS) * Math.PI * 2) * FRENZY_REACH_PX * SUBS);

/** Wie oft die Blickrichtung bis Anfall-Tick `t` gekippt ist. Gerade Zahl am
 *  Ende = die Blickrichtung ist wieder die, mit der er hereinkam — deshalb
 *  braucht der Anfall kein gespeichertes „Wie stand er vorher". */
export const frenzyFlipsBy = (t: number): number => Math.floor(t / FRENZY_FLIP_TICKS);

// ── R5-W4 · F5 · MERLE GEHT HERUM (F-26, R49) ────────────────────────────────
// „Merle soll, wenn sie draußen ist, nicht nur dastehen, sondern sich durchs
// Level bewegen — hin und her gehen, hüpfen — ein freigesetzter Charakter."
//
// Der Kanon dazu ist mit R49 geändert: Befreite bleiben in ihrem RAUM, bewegen
// sich aber. Das „in ihrem Raum" ist die ganze Schwierigkeit — ein befreites
// Kind, das in die Tinte läuft oder von der Kante fällt, wäre kein Geschenk,
// sondern ein Bug mit Gesicht.
//
// Die Zone kommt deshalb AUS DEM GITTER und nicht aus einer getippten Zahl:
// links und rechts von ihrer Zelle so weit, wie der Boden AUF IHRER HÖHE weiter
// trägt. Drei Bedingungen, jede mit einem Grund:
//  · GLEICHE HÖHE, exakt. Nicht „höchstens eine Kachel Gefälle" wie beim
//    Läufer: die Sonde ist hier auch die Zusage, dass ihre Füsse die ganze Zeit
//    auf derselben Linie stehen — dann braucht das Gehen keine Bodenprüfung pro
//    Tick und kann nie in einer Rundung versinken.
//  · KEINE GEFAHR im Feld, in dem sie steht, und keine unter ihren Füssen.
//  · GEDECKELT bei ROAM_MAX_CELLS, damit eine lange Halle sie nicht durchs
//    halbe Level schickt — „ihr Raum" ist eine Aussage über Nähe, nicht über
//    Begehbarkeit.
//
// Gemessen im ausgelieferten p2: Merle steht auf c65/r13, ihr Boden ist die
// Vierer-Kachel c63…c66 in Reihe 14, links und rechts Luft mit tiefem Fall.
// Ihre Zone ist also VIER Kacheln breit. Das ist wenig — und es ist die
// Wahrheit des Levels, nicht eine Zahl, die ich mir ausdenke. Die Bitte um ein
// echtes `roamMinC/MaxC`-Feld steht im Report an den Architekten.
/** Wie weit ihr Raum höchstens reicht, in Kacheln je Seite. */
export const ROAM_MAX_CELLS = 6;
/** Ihr Gehtempo — halb so schnell wie ein Läufer: sie flieht nicht, sie geht. */
export const ROAM_SPEED = Math.round(0.3 * SUBS);
/** Wie lange sie steht, bevor sie losgeht, und wie lange ein Gang dauert. */
export const ROAM_REST_TICKS = 240;
export const ROAM_TICKS = 300;
/** Der Hüpfer ist ein BEAT IM GEHEN, kein eigener Zustand: ein eigener Zustand
 *  würde `timer` zurücksetzen und damit die Uhr des Gangs jedes Mal neu starten
 *  — sie käme nie ans Ende und nie zum Winken. */
export const HOP_EVERY_TICKS = 96;
export const HOP_TICKS = 24;
export const HOP_RISE_PX = 6;

/** Steht sie in diesem Tick des Gangs gerade im Sprung? */
export const roamHopT = (timer: number): number => {
  const u = ((timer % HOP_EVERY_TICKS) + HOP_EVERY_TICKS) % HOP_EVERY_TICKS;
  return u < HOP_TICKS ? Math.sin((u / HOP_TICKS) * Math.PI) : 0;
};

/** R5-W5 · B4b · DIE GEMALTEN AUSSENSPALTEN, falls das Level sie nennt.
 *
 *  Liest `roamMinC`/`roamMaxC` aus den `params` einer Entity und wirft alles
 *  weg, was keine ganze Zahl ≥ 0 ist. Der Grund für die Strenge hier UND im
 *  Lade-Schema (`apps/web/lib/paint-content.ts`): `params` ist ein offener
 *  Record, eine „63" als Zeichenkette käme also unbemerkt an und würde in
 *  `homeC - minC` zu `NaN` — und ein `NaN`-Deckel lässt jede Schleife sofort
 *  abbrechen. Sie stünde dann still, und nichts würde rot. */
export const roamBoundsOf = (
  params: Record<string, unknown>,
): { minC?: number; maxC?: number } => {
  const whole = (v: unknown): number | undefined =>
    typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : undefined;
  return { minC: whole(params.roamMinC), maxC: whole(params.roamMaxC) };
};

/** Ihr Raum, in SUBS — das FENSTER kommt aus dem Gitter, nur der DECKEL darf
 *  gemalt sein.
 *
 *  `xSubs`/`ySubs` sind ihre Füsse (die Wesen-Konvention). Zurück kommt immer
 *  ein gültiges Fenster: im schlimmsten Fall ihr eigener Standpunkt, und dann
 *  steht sie eben — besser als ein Schritt ins Nichts.
 *
 *  R5-W5 · B4b · R85: `bounds` ersetzt `ROAM_MAX_CELLS` für diese eine Entity
 *  (F5s Frage an den Architekten: „der Wert kommt aus dem Level, nicht aus
 *  einer Konstante"). Er ersetzt die Sonde NICHT — die drei Bedingungen oben
 *  laufen unverändert davor, und eine gemalte Spalte, die über die tragende
 *  Fläche hinausgeht, gewinnt nicht. Das ist die ganze Ordnung dieser Änderung:
 *  das Level darf ihren Raum ENGER oder in einer tragenden Halle WEITER
 *  erklären, aber die Zusage „sie fällt nicht und sie ertrinkt nicht" bleibt
 *  beim Gitter und hängt nicht davon ab, dass ein Autor richtig rechnet. */
export const roamZone = (
  grid: readonly string[],
  xSubs: number,
  ySubs: number,
  bounds: { minC?: number; maxC?: number } = {},
): { minX: number; maxX: number } => {
  const feetPx = ySubs / SUBS;
  const step = TILE * SUBS;
  // Wie viele Kacheln je Seite überhaupt PROBIERT werden. `Math.max(0, …)`
  // fängt die Grenze, die auf der falschen Seite ihres Standplatzes steht (ein
  // `roamMaxC` westlich von ihr): daraus wird „sie steht", nie ein Schritt
  // durch die Wand.
  const homeC = Math.floor(xSubs / SUBS / TILE);
  const westCap = bounds.minC === undefined ? ROAM_MAX_CELLS : Math.max(0, homeC - bounds.minC);
  const eastCap = bounds.maxC === undefined ? ROAM_MAX_CELLS : Math.max(0, bounds.maxC - homeC);
  const tragfähig = (probeSubs: number): boolean => {
    const s = walkSurfaceAhead(grid, probeSubs / SUBS, feetPx, { maxDropTiles: 0 });
    if (s === null || s.yPx !== feetPx) return false; // exakt dieselbe Standlinie
    if (isHazard(s.glyph)) return false; // keine Tinte unter den Füssen
    const c = Math.floor(probeSubs / SUBS / TILE);
    const r = Math.floor((feetPx - 1) / TILE);
    return !isHazard(glyphAt(grid, c, r)); // und keine im Feld, in dem sie steht
  };
  let minX = xSubs;
  let maxX = xSubs;
  for (let i = 1; i <= westCap; i++) {
    if (!tragfähig(xSubs - i * step)) break;
    minX = xSubs - i * step;
  }
  for (let i = 1; i <= eastCap; i++) {
    if (!tragfähig(xSubs + i * step)) break;
    maxX = xSubs + i * step;
  }
  return { minX, maxX };
};

/** The post-redeem step: a lap of joy, then home to stay.
 *
 *  R5-W4 · F5: …und seit R49 geht sie danach herum, weshalb dieser Schritt das
 *  GITTER braucht. Es ist optional (Vorgabe: leer ⇒ keine Zone ⇒ sie steht wie
 *  bisher), damit kein bestehender Aufrufer und kein Test bricht. */
const stepRedeemed = (e: EntityState, grid: readonly string[] = []): void => {
  // R3-15: the timer runs for EVERY redeemed being, not only the ones that fly a
  // lap — a knotted school bag gets its afterlife exactly like a moth does even
  // though it stays put. Before this the timer froze at redemption and a cage
  // would have been left half-drained forever.
  e.timer += 1;
  // PK-R6 · H1: …and the FLOOD runs on its own clock beside it (see freedTick),
  // because every branch below resets `timer` and a reset used to send the
  // colour back out of a being the child had already got it back into.
  e.freedTick += 1;
  // PK-R6 · D · THE FREED CLASSMATE'S OWN AFTERLIFE. She does not fly a lap
  // (she is a person, not a moth) and she may not be parked either: doc 44 §1
  // makes presence the point of freeing someone. So her states are her painted
  // ones — settle (coming back to herself) → joy (the Freudenrunde, in place) →
  // idle at her spot, waving now and then for the rest of the chapter.
  if (e.role === "classmate") {
    if (e.state === "settle" && e.timer > SETTLE_TICKS) { e.state = "joy"; e.timer = 0; }
    else if (e.state === "joy" && e.timer > JOY_TICKS) { e.state = "rest"; e.timer = 0; }
    // R5-W4 · F5 · R49 · IHR KREIS: stehen → gehen → winken → stehen.
    //
    // Der Gang steht VOR dem Winken und führt IN das Winken hinein, statt beide
    // aus dem Stehen zu ziehen. Der Grund ist mechanisch: aus `rest` heraus
    // gewinnt immer die kleinere Zahl, und ein Gang, der früher fällig ist als
    // das Winken (240 gegen 420), hätte das Winken für immer verschluckt —
    // R49 ändert den Kanon, es streicht ihn nicht. Sie geht ein Stück, dreht
    // sich zum Kind und winkt: das ist ausserdem die bessere Geste.
    else if (e.state === "rest" && e.timer > ROAM_REST_TICKS) { e.state = "roam"; e.timer = 0; }
    else if (e.state === "roam") {
      // Der Anker ist ihr HEIMATPUNKT — der Fleck, an dem sie aus dem Käfig
      // getreten ist — und nicht der, an dem der letzte Gang zufällig endete.
      //
      // Beim Schreiben des 3000-Tick-Tests genau daran gescheitert: mit einem
      // Anker, der sich bei jedem Gang neu setzt, wandert die Zone mit ihr mit,
      // und „sie bleibt in ihrem Raum" gilt pro Gang statt fürs Kapitel. Der
      // Test hat sie 47 Subs ausserhalb erwischt. R49 meint den Raum, nicht den
      // Schritt.
      // R5-W5 · B4b: …und der DECKEL ihres Raums steht jetzt im Level (R85),
      // nicht mehr allein in `ROAM_MAX_CELLS`. Das Fenster bleibt das des
      // Gitters — siehe roamZone.
      const { minX, maxX } = roamZone(grid, e.homeX, e.homeY, roamBoundsOf(e.params));
      e.x = Math.min(maxX, Math.max(minX, e.x + ROAM_SPEED * e.dir));
      if (e.x <= minX && e.dir < 0) e.dir = 1;
      else if (e.x >= maxX && e.dir > 0) e.dir = -1;
      // der Hüpfer ist ein Beat IM Gang (siehe roamHopT): er hebt sie kurz an
      // und setzt sie exakt wieder ab, weil ihre Standlinie `homeY` ist
      e.y = e.homeY - Math.round(roamHopT(e.timer) * HOP_RISE_PX * SUBS);
      if (e.timer > ROAM_TICKS) { e.state = "wave"; e.timer = 0; e.y = e.homeY; }
    } else if (e.state === "rest" && e.timer > WAVE_EVERY_TICKS) { e.state = "wave"; e.timer = 0; }
    else if (e.state === "wave" && e.timer > WAVE_TICKS) { e.state = "rest"; e.timer = 0; }
    return;
  }
  // R5-A8: the burst is a BEAT — once the throw-open played, the cage rests
  // `open` (anim keeps burst for skins without open art, and the remount
  // spawns freed cages as `open` directly, so a bonus trip never replays it).
  if (e.role === "cage" && e.state === "burst" && e.timer > CAGE_OPEN_TICKS) e.state = "open";
  if (!JOY_ROLES.has(e.role)) return; // static-state beings hold their cell
  const { rx, ry, lift } = joyRadiusPx(e.role);
  if (e.state === "joy") {
    const t = e.timer;
    e.x = e.homeX + Math.round(Math.sin(t / 11) * rx * SUBS);
    e.y = e.homeY - Math.round(lift * SUBS) + Math.round(Math.sin(t / 7) * ry * SUBS);
    if (t > JOY_TICKS) { e.state = "rest"; e.timer = 0; }
  } else if (e.state === "rest") {
    // ease home and STAY there — this is what stops the eraser leaving (11.47.39)
    e.x += Math.round((e.homeX - e.x) / 8);
    e.y += Math.round((e.homeY - e.y) / 8);
    if (Math.abs(e.homeX - e.x) < SUBS && Math.abs(e.homeY - e.y) < SUBS) { e.x = e.homeX; e.y = e.homeY; }
  }
};

/**
 * PK-R6 · H1 · THE WORLD KEEPS ITS PROMISE WHILE THE CHILD WATCHES IT (round-1
 * critique, finding 5: „the reawakening the whole sequence is building toward
 * never actually lands on screen").
 *
 * The restore-hold (doc 44 §3.1.7) exists so the card gets out of the way and
 * the child WATCHES their answer change the world. It was holding a world that
 * had stopped: the shell froze the sim for the hold, `stepEntities` returns on
 * the first line when the overlay is open, and the colour flood is driven by
 * the very timer that freeze stops. The harness measured exactly that and it was
 * read as a timing artefact — „hold start: wash 0.72 … hold end: wash 0.72".
 *
 * So a hold now steps the REDEEMED beings and nothing else: the flood floods,
 * the friend settles and takes her joy lap, a burst cage plays its opening —
 * while the child, the enemies and every encounter stay exactly as frozen as
 * the freeze intends. It raises no events by construction (`stepRedeemed`
 * cannot), so a cinematic beat can never open a card behind its own card.
 */
/** R5-W2 · H1 · DIE LANDUNG GEHÖRT ZUM HALTEN.
 *
 *  Die beiden Zustände, in denen die besiegte Tafel noch in Bewegung ist. Sie
 *  ist NIE `redeemed` (nichts im ganzen Paket setzt das an einem Guardian), also
 *  überspringt der Erlösten-Takt sie — und weil `guardianDown` ausserdem gar
 *  keine Haltezeit gesetzt hat, spielte der komplette Sieg-Bogen erst NACH
 *  beiden Karten, in einem Raum, in dem niemand mehr hinsieht. Das Kind las
 *  „…und sie blüht sonnengelb auf", während sie noch in der Luft hing.
 *
 *  Gefiltert wird über die ZUSTÄNDE, nicht über `redeemed = true`: das würde in
 *  `cagesGated`, in den `dazed`-Auffangzweig und in die Band-Behauptung
 *  `redeemedPresent` lecken. Ein schmales Prädikat sagt genau das, was gilt. */
// R5-W4 · H2: `settle` kommt dazu — der kurze Fall aus der Dip-Höhe auf die
// Bretter, den sie nach einer gelösten Karte macht, um gewischt zu werden. Er
// gehört GENAU hierher und nicht in den Flug-Zweig: er muss auch im Halte-Takt
// hinter einer offenen Karte weiterlaufen, sonst bliebe sie in der Luft stehen,
// während das Kind noch etwas liest — dieselbe Falle, die den Sieg-Bogen schon
// einmal in einem leeren Raum spielen liess.
const LANDING_STATES: ReadonlySet<string> = new Set(["sink", "sad", "settle"]);

/**
 * ── R5-W4b · H3 (D-190) · WANN EIN VORBEIGEFLOGENES STÜCK NICHT ZÄHLT ───────
 *
 * Die Über-Reichweite (`dodges`) zählt, wie oft das Kind ihrer Kreide
 * ausgewichen ist — drei davon öffnen ein Fenster. Sie darf NUR zählen, solange
 * sie den Kampf auch führt: eine Tafel, die auf den Brettern sitzt und aufs
 * Wischen wartet, wirft nicht, also kann ihr auch niemand ausweichen.
 *
 * Diese Liste stand zweimal in der Datei, getippt, mit drei Namen — einmal in
 * `tallyOverreach`, einmal im Deflect-Zweig — und beide waren seit dem Wischen
 * unvollständig: `settle`, `wipeable` und `wipe` fehlten. Eine Kreide, die
 * während des Wischens am Kind vorbeiflog, füllte also das NÄCHSTE Fenster
 * mit, obwohl die Tafel gerade stillstand.
 *
 * Jetzt EINE Liste, und sie ist zusammengesetzt statt getippt: die Zustände, in
 * denen sie am Boden ist (`LANDING_STATES`, oben deklariert), plus die vier, in
 * denen sie in der Luft festgehalten wird. `guardian-flight.test.ts` fährt die
 * echte Zustandsmaschine über alle Stufen und verlangt, dass JEDER erreichbare
 * Zustand entweder hier steht oder ein Flug-Zustand ist — die Liste kann also
 * nicht still veralten, wenn jemand einen fünften Halte-Zustand baut.
 */
export const GUARDIAN_HELD_STATES: ReadonlySet<string> = new Set([
  ...LANDING_STATES, // sink · sad · settle — sie ist unten
  "window", //   die Karte gehört ihr gerade nicht (CARD_OWNED_STATES)
  "stagger", //  ein abgelenktes Stück hat sie erwischt
  "dip", //      sie ist auf dem Weg herunter, um sich beschreiben zu lassen
  "wipeable", // sie sitzt auf den Brettern und wartet aufs Kind
  "wipe", //     das Kind wischt gerade
]);

/** Ihre Landung, als eigener Schritt — damit BEIDE Takte sie fahren können: der
 *  volle Welt-Takt und der Halte-Takt hinter einer offenen Karte. Gibt zurück,
 *  ob dieser Schritt das Wesen bereits erledigt hat. */
const stepGuardianLanding = (e: EntityState, grid: readonly string[]): boolean => {
  if (e.role !== "guardian" || !LANDING_STATES.has(e.state)) return false;
  if (e.state === "sink" || e.state === "settle") {
    const floorY = groundAt(grid, e.x, e.y) ?? e.y;
    e.vx = 0;
    e.y = Math.min(e.y + SINK_SPEED, floorY);
    // R5-W4 · H2: derselbe Fall, zwei Ausgänge. `sink` ist das Ende des Kampfes
    // (sie ruht aus), `settle` ist eine Pause darin (sie wartet aufs Wischen).
    // Die Bewegung ist identisch, weil es dieselbe Bewegung IST — nur der Grund
    // unterscheidet sich, und der steht im Zustand.
    if (e.y >= floorY) { e.y = floorY; e.state = e.state === "sink" ? "sad" : "wipeable"; e.timer = 0; }
    return true;
  }
  // `sad` — sie ruht aus, bevor die Konsole antwortet (doc 44 §2.2: sie RUHT,
  // sie weint nicht)
  if (e.timer > SAD_TICKS) { e.state = "consoled"; e.timer = 0; }
  return true;
};

export const stepRedeemedOnly = (w: EntityWorld, grid: readonly string[] = []): void => {
  for (const e of w.entities) {
    if (e.hidden) continue;
    if (e.role === "guardian" && LANDING_STATES.has(e.state)) {
      e.timer += 1;
      stepGuardianLanding(e, grid);
      continue;
    }
    if (!e.redeemed) continue;
    stepRedeemed(e, grid);
  }
};

/** Per-tier guardian script (sheet §6: telegraph/window shrink E→S, knots ≤5). */
// PK-R6 · E (doc 44 §4 ch01 C4): the Tafel FLIES. PK-C3's ground roll between
// two stations retires with the R4 canon — „Doc 41's grounded ‚erwachte
// Schultafel' … retire as mechanics; the board now flies" — and the rollSpeed/
// rollRangeTiles/rollTicks dials retire with it. What survives verbatim is the
// per-tier shape the sheet fixed: knots, and a telegraph and throw clock that
// tighten E→S.
export const GUARDIAN_SCRIPT = {
  E: { knots: 3, telegraphTicks: 60, throwEvery: 150, staggerTicks: 90 },
  M: { knots: 4, telegraphTicks: 45, throwEvery: 120, staggerTicks: 75 },
  S: { knots: 5, telegraphTicks: 32, throwEvery: 96, staggerTicks: 60 },
} as const;

// ── PK-R6 · E · THE FLYING TAFEL (doc 44 §4 ch01 C4 + §3.2 boss primitives) ──
// Every number here is either DERIVED from the arena and the camera (and locked
// by a test that recomputes the derivation), MINED verbatim from the shipped
// build, or marked `TASTE:` — the three kinds a reviewer has to judge
// differently. Nothing in this block is a number somebody once typed.

/** THE FAIRNESS FLOOR. doc 44 §4 ch01 C4 asks for a telegraph of „≥500 ms"
 *  before every throw; 30 ticks at the 60 Hz contract IS 500 ms. It is a floor
 *  rather than a value because the per-knot escalation below SHORTENS the
 *  telegraph, and at tier S the third knot would otherwise reach 23 t (383 ms) —
 *  a tell too short to answer, which is the one thing a no-death boss may never
 *  do. The mined Keen boss holds the same line from the other side (its own
 *  suite asserts `telegraphMs[tier] >= 500` on every tier); ours is the floor
 *  that law becomes once the telegraph is allowed to move. */
export const TELEGRAPH_FLOOR_TICKS = 30;

/** How high she flies, as a half-height around her spawn row, in px. DERIVED:
 *  the arena is 20 rows (320 px) and the view is LOGICAL_H (224 px), so with the
 *  child on the arena floor the vertical scroll clamps to 96 and the visible
 *  band is y 96…320. Her spawn row (r11 → feet at 192) plus this band keeps her
 *  feet in 166…218 and her 52-px body in 114…218: inside the visible band with
 *  margin, above the child's head (226) and clear of the row-14 podium tops
 *  (224). `flight.test.ts` recomputes all of that from camera.ts and the level
 *  file and fails if any knot's path leaves the band — a readable path the child
 *  cannot SEE is not a readable path. */
export const FLIGHT_BAND_PX = 26;
/** How wide each knot's shape is, in px either side of her flight centre.
 *  Escalating: the arena gets bigger as she gets angrier. Bounded by the arena
 *  itself — see FLIGHT_MARGIN_PX. */
// ── R5-W4 · H2 · DIE REIHEN GEHEN BIS FÜNF (D-83) ───────────────────────────
// Alle drei Tabellen hier waren DREI Einträge lang, und `knotIndex` klemmte auf
// 2 — die Stufen M (vier Schichten) und S (fünf) hätten ihre letzten Schichten
// mit den Werten der dritten geflogen. Die Fortsetzung ist EXTRAPOLIERT, nicht
// erfunden, und jede Reihe behält ihre eigene Bewegungsrichtung:
//   Spannweite  78 → 92 → 104 (+14, +12) → 114 (+10) → 122 (+8)  — wächst,
//               aber immer träger, weil FLIGHT_MARGIN_PX und die Bühne die
//               obere Schranke setzen (Prüfung: guardian-flight.test.ts).
//   Periode    300 → 260 → 220 (−40) → 190 (−30) → 165 (−25)     — schrumpft,
//               ebenfalls gedämpft: eine Bahn, die schneller wird als das Kind
//               lesen kann, ist keine Eskalation mehr, sondern ein Würfel.
//   Rate         1 → 0,85 → 0,72 (×0,85 / ×0,847) → 0,61 → 0,52  — dieselbe
//               geometrische Reihe fortgesetzt (×0,85), und TELEGRAPH_FLOOR_TICKS
//               fängt sie unten ab, damit kein Tell unter 500 ms fällt.
export const KNOT_SPAN_PX = [78, 92, 104, 114, 122] as const;
/** How long one full pass of a knot's path takes, in ticks (5.0 s / 4.3 s /
 *  3.7 s at 60 Hz). TASTE: the absolute values are feel; what is NOT taste is
 *  that they shorten — doc 44 asks for „three knots, escalating", and a path
 *  the child has already learned has to arrive faster to stay a fight. */
export const KNOT_PERIOD_TICKS = [300, 260, 220, 190, 165] as const;
/** How much faster her CLOCKS run per knot (throw rate and telegraph alike),
 *  as a multiplier on the tier script. The telegraph is clamped by
 *  TELEGRAPH_FLOOR_TICKS afterwards, so this can never buy speed with fairness.
 *  TASTE: 15 % then 28 % — one step the child feels, one they brace for. */
export const KNOT_RATE = [1, 0.85, 0.72, 0.61, 0.52] as const;
/** How close to the arena's edge her flight centre may drift, in px. Keeps a
 *  full-span path inside the stage instead of half-off it. */
export const FLIGHT_MARGIN_PX = 24;
/** How fast the flight CENTRE tracks the child, as an ease divisor and a cap in
 *  subs/tick. Mined in shape from the legacy `cloud` brain, which drifts toward
 *  the player's column before it fires — the reason is the fairness law again:
 *  a telegraph thrown from off screen cannot be answered, so she has to stay
 *  where the child can see her. Slow on purpose (TASTE: /48, ≤0.6 px/tick) —
 *  the PATH must dominate the drift, or the shape stops being learnable. */
export const CENTRE_EASE_DIV = 48;
export const CENTRE_MAX_STEP = Math.round(0.6 * SUBS);

/** The release beat: how long `tafel_throw` shows after the chalk leaves her
 *  hand. TASTE: 12 t (200 ms) — long enough to read as a throw, short enough
 *  that she is flying again before the chalk lands. */
export const THROW_TICKS = 12;
/** How long the chalk stays in the air, in ticks. The arc is SOLVED for this
 *  time (see the throw below), so it is the child's actual dodge window: 48 t =
 *  800 ms on top of a ≥500 ms telegraph. TASTE within the fairness envelope. */
export const CHALK_FLIGHT_TICKS = 44;
/** THE ARMING DELAY — the second half of the fairness law, found by test.
 *  A telegraph only buys the child time if the thing it announces then has to
 *  TRAVEL. She tracks the child (so her tell is on screen), which means she can
 *  end up nearly on top of them — and a piece of chalk aimed at their feet from
 *  20 px away entered the contact box on its FIRST tick, i.e. an unavoidable hit
 *  behind a perfectly fair 1-second tell. Chalk is therefore inert for its first
 *  10 ticks (167 ms): it always visibly leaves her hand before it can bite.
 *  Costs nothing at normal range — the arc is 44 ticks long. */
export const CHALK_ARM_TICKS = 10;
/** Per-tick fall on a piece of chalk, in subs. Kept VERBATIM from the shipped
 *  duel (`GRAVITY / 4`, R3-4's „long readable arc") — the arc the playtest
 *  already accepted, now aimed rather than lobbed straight ahead. */
export const CHALK_GRAVITY = Math.round(PAINT.gravity / 4);
/** How long a shattered piece lies on the floor as a hazard, in ticks. doc 44
 *  §4 ch01 C4: „chalk shards linger 1 s" — 60 t IS 1 s at the 60 Hz contract. */
export const SHARD_TICKS = 60;
/** How close the child has to come to a lying shard for it to bite, in px.
 *  DERIVED from the hero's own body rather than guessed: BODY_HALF_PX (8) plus
 *  a splinter's width. Deliberately SMALLER than the flying piece's box — a
 *  hazard you can see lying still has to be avoidable by looking, and a
 *  six-year-old walking a floor should not be caught by something beside them. */
export const SHARD_REACH_X_PX = 9;
export const SHARD_REACH_Y_PX = 12;
/**
 * The painted sticks she actually throws, cycled by throw index so the colour is
 * a function of the tick stream and nothing else.
 *
 * PK-R6 · H2 (round-2 finding 5: „the thrown chalk stick is a pale, thin sliver
 * close in value to the couches behind it"). The cycle led with `white`, so the
 * FIRST piece of the fight — the one the child is taught to read the whole boss
 * by — was the one stick in the set that carries no chroma at all, thrown across
 * a stage of cream upholstery and honey-wood book tiles. White chalk is right on
 * a blackboard and wrong as a projectile: it is the only colour here that cannot
 * separate from the p4 backdrop by hue, so it has nothing left to separate by but
 * value, and the arena's whole midground sits at chalk value.
 *
 * It is dropped from the THROW set (its sheet is untouched and still shipped —
 * see CHALK_PROJECTILE_STEMS) and the cycle now opens on the most saturated
 * stick in the box. Warm first, cool last: the p4 stage is dusk-blue, so the two
 * cool sticks are the ones that need the code-drawn light most and they arrive
 * after the child has already learnt what a thrown piece looks like.
 */
export const CHALK_COLOURS = ["red", "orange", "yellow", "green", "blue"] as const;

/** PK-R6 · H1 · THE PROJECTILE ART, as stems (round-1 critique, finding 5).
 *
 *  The chalk is the one prop in the fight the child MUST see, and every one of
 *  these sheets was delivered over the same magenta colour key as the terrain —
 *  at 6× the flying stick carried a bright pink comma along its lower edge. The
 *  traversal fringe gate already refuses that key on tiled surfaces; this is the
 *  same class on the piece the whole boss contract depends on being readable.
 *
 *  Derived from CHALK_COLOURS rather than written out, so a seventh stick is
 *  covered by the gate the day it is added. */
export const CHALK_PROJECTILE_STEMS: readonly string[] = [
  ...CHALK_COLOURS.map((c) => `chalk_${c}`),
  // named on its own now that it has left the throw cycle (round-2 finding 5):
  // the sheet still ships, the gate still guards its fringe, and the day a
  // chapter with a dark floor wants it back it is already clean.
  "chalk_white",
  "chalk_shard_a",
  "chalk_shard_b",
  "tafel_chalk",
];

/** THE COUNTER-WINDOW DIP (doc 44 §4 ch01 C4: „she writes her lie ON the
 *  board"). She leaves the flight band and comes down to the child — which is
 *  what makes four chalked words readable at 1×, and what guarantees the card's
 *  asker is on screen when it opens (the speaker law, doc 41 §3: a card whose
 *  asker has left the viewport WAITS, and a boss frozen off screen mid-window
 *  would wait forever).
 *
 *  R5-W4b · H3: 236 → 268. Es ist eine ABSOLUTE Welt-Höhe, keine Relation, und
 *  die Bühne ist zwei Reihen tiefer gewandert (Boden 256 → 288, `ch01.level.json`
 *  arena-Block). Die Zahl behält damit genau ihre alte Bedeutung: 20 px über der
 *  Fußlinie — hoch genug, dass sie sichtbar herunterKOMMT, tief genug, dass
 *  `settle`/`sink` den Rest in einem kurzen Fall erledigen. */
export const DIP_Y_PX = 268;
/**
 * How far short of the child she stops, in px — she dips in FRONT of them, not
 * on top of them.
 *
 * PK-R6 · H2 (round-2 finding 2: „Domi's sprite clips into the boss during the
 * sink pose — it reads as a z-order bug, not a choreographed contact pose").
 * 34 px was never a standoff: it is measured centre to centre, and half of HER
 * alone is more than that, so „in FRONT of them" put her drawing straight
 * through his. Now DERIVED rather than tasted, in the units both bodies are
 * drawn in: half the boy (BODY_HALF_PX, 8) + half the board she actually is at
 * the size PaintScene actually draws her + daylight, so the contact pose reads
 * as two beings facing each other rather than one drawing over another.
 *
 * R5-W4b · H3 — die Zeile „Re-derive this the day either body is re-scaled"
 * ist fällig geworden (sie wuchs von 68 auf 89 px), und die alte Herleitung
 * war schon vorher schief: sie rechnete mit „84 px tall" gegen ausgelieferte
 * 68 und verwechselte `wFrac` (der Anteil der Breite, der Schiefertafel IST)
 * mit dem Seitenverhältnis des Blattes. Sauber gerechnet:
 *
 *   halbe Tafel = GUARDIAN_DISPLAY_H (89) × 331/397 (Blatt-Seitenverhältnis
 *                 von `tafel_a`) ÷ 2 = **37,1 px**
 *   halbes Kind = BODY_HALF_PX = 8
 *   Kanten-Kontakt = 37,1 + 8 = 45 px  (= GUARDIAN_WIPE_REACH_PX unten)
 *   + 23 px Tageslicht, die das Kind zu Fuß zurücklegt = **68**
 *
 * Die 23 px sind kein Geschmack, sondern der ERHALT des alten Gefühls: vorher
 * standen 45 px Abstand gegen 22 px Reichweite, das Kind ging also 23 px. Es
 * geht jetzt wieder 23 — derselbe Weg, obwohl beide Zahlen gewachsen sind.
 * `guardian-flight.test.ts` rechnet beide Zeilen aus den PNGs nach; eine Kopie
 * kann nicht driften, wenn ein Test sie neu ausrechnet.
 */
export const DIP_STANDOFF_PX = 68;

/**
 * Wie nah das Kind an ihre MITTE kommen muss, damit die Berührung das Wischen
 * auslöst — ihre eigene Reichweite, weil sie nicht die Größe der anderen Dinge
 * hat.
 *
 * `ENGAGE_REACH_PX` (22) ist die Reichweite für Käfige und Regel-Seiten: Dinge,
 * die schmaler sind als das Kind hoch ist. Auf die Tafel angewandt hieße sie:
 * das Kind muss 22 px an ihre Mitte heran — und ihre Mitte liegt 37 px innerhalb
 * ihrer eigenen Zeichnung. Das Kind müsste also IN sie hineinlaufen, um sie zu
 * berühren; genau der Z-Ordnungs-Fehler, den `DIP_STANDOFF_PX` oben schon einmal
 * behoben hat (PK-R6 · H2, Befund 2).
 *
 * Deshalb misst diese Zahl die KANTE, nicht die Mitte: halbe Tafel (37,1) plus
 * halbes Kind (8) ⇒ 45. Die Berührung passiert, wenn sich die beiden Körper
 * berühren — was das Kind am Schirm auch sieht.
 */
export const GUARDIAN_WIPE_REACH_PX = 45;
/** How long the dip takes. Matched to the evidence beat (PaintScene's
 *  EVIDENCE_BEAT_TICKS, 36 t) so the coming-down and the writing read as one
 *  movement rather than two. */
export const DIP_TICKS = 36;
/** How fast she settles the last stretch onto the ground when she is beaten, in
 *  subs/tick. TASTE: 1.1 px/tick — heavier than she flies, which is the whole
 *  point of the beat. */
export const SINK_SPEED = Math.round(1.1 * SUBS);

/** R5-W2 · H1 (Teil 3) · DIE GABEL — wie weit das führende Stück vorgreift.
 *
 *  ABGELEITET, nicht getippt: so weit, wie ein gehendes Kind fliegt, solange die
 *  Kreide fliegt. Damit liegt der zweite Aufschlag genau dort, wo das Kind
 *  ankommt, wenn es einfach weitergeht — und die Lücke zwischen beiden Punkten
 *  (55 px bei Gehtempo) ist immer breiter als die zwei Kontaktboxen plus Körper,
 *  also gibt es IMMER einen Platz zum Stehen. Eine Gabel ohne Lücke wäre keine
 *  Wahl, sondern eine Strafe. */
export const FORK_LEAD_PX = Math.round((PAINT.walkMax / SUBS) * CHALK_FLIGHT_TICKS);

/** Ab welchem Knoten die Gabel geworfen wird (0-basiert wie `knotIndex`). */
export const FORK_FROM_KNOT = 1;
/** Ab welchem Knoten die gelandeten Scherben über die Bretter rutschen. */
export const SKID_FROM_KNOT = 2;

/** Wie schnell eine gelandete Scherbe rutscht, in subs/Tick.
 *
 *  ── R5-W4 · H2 · DIE SCHERBE HOLT DAS KIND JETZT WIRKLICH EIN (D-86) ───────
 *  Die alte Herleitung — »Mitte der beiden Gangarten, dann halbiert« — stammt
 *  aus einem Zwei-Tempo-Modell, das es nicht mehr gibt. Ausgerechnet ergab sie
 *  **0,875 px/t** gegen ein Kind, das in diesem Kapitel mit **2,25 px/t** läuft:
 *  die Scherbe war zweieinhalbmal langsamer als ihr Ziel und hat es nie erreicht.
 *  Damit tat sie genau das nicht, wofür sie gebaut wurde — »Weggehen ist die
 *  ganze Antwort« zu beenden (K1s Amendment A2 im Arena-Dossier, dort als
 *  offener Befund an Architekt und Koki gemeldet).
 *
 *  Sie rutscht deshalb mit dem TEMPO DES KINDES. Nicht schneller: eine Scherbe,
 *  die einholt, obwohl man wegläuft, wäre eine Strafe fürs Laufen. Genau gleich
 *  schnell heißt: Weglaufen verschafft Abstand, aber keinen Ausweg — der Ausweg
 *  ist der Sprung, und der ist die Fähigkeit, die diese Arena prüft (arena.md
 *  §1: kein run als Pflicht, Springen als Antwort). */
export const SKID_SPEED = PAINT.runMax;

/** R5-W2 · H1 · DER KNOTEN-TAKT — wie lange sie den gelösten Knoten hält.
 *
 *  Vorher gab es diesen Takt nicht: `guardianKnotSolved` setzte `state = "fly"`
 *  und `flightTick = 0` und schrieb KEINE Position — und weil der Flug seine
 *  Lage ZUWEIST statt sie zu integrieren, stand sie im nächsten Tick woanders.
 *  Nachgerechnet mit der echten Ganzzahl-Arithmetik: Knoten 2 springt 42,7 px
 *  senkrecht, Knoten 3 springt 68,1 px senkrecht UND 102 px waagrecht, weil das
 *  Flug-Zentrum seit dem Beginn des Dips (≥37 Ticks) eingefroren war. Der Sprung
 *  landet obendrein als `vx`/`vy` in der Lage-Mechanik, also sättigt die Neigung,
 *  und die goldene Spur zieht eine gerade Linie quer durchs Bild.
 *
 *  Der Takt ist die Reparatur UND der Beat: sie hält den verlorenen Knoten kurz
 *  auf Dip-Höhe (am nächsten, am grössten — dort, wo das Kind sie gerade gelesen
 *  hat), und steigt dann auf die neue Bahn, die sie bei Phase 0 betritt. */
export const UNTIE_RECOIL_TICKS = THROW_TICKS;
/** Das ganze Fenster des Takts. Länger als der Aufstieg (der auf der /6-Rampe
 *  des Dips läuft), kürzer als ein Drittel des engsten Wurfzyklus auf Stufe E —
 *  der Takt darf den Kampf rhythmisieren, nicht anhalten. */
export const KNOT_BEAT_TICKS = 48;

// ── R5-W4 · H2 · DAS WISCHEN (Ruling R50, Koki 15.08.2026) ───────────────────
// „Die Aufgaben werden getriggert, und wenn sie unten ist und man zu ihr geht,
// wird — nach der Aufgabe — gelöscht." Eine gelöste Karte allein macht die
// Tafel also nicht mehr sauber: sie SETZT SICH AUF DIE BRETTER und wartet, das
// Kind geht hin, und erst die Berührung nimmt eine Kritzel-Schicht weg.
//
// Drei Zustände, und jeder hat seinen Rückweg — die Lehre aus dem `window`-
// Softlock, der monatelang live stand (CARD_OWNED_STATES): `settle` endet am
// Boden, `wipe` endet an seiner eigenen Uhr, und `wipeable` endet an BEIDEN
// Enden (Berührung ODER Wartezeit). Keiner von ihnen gehört einer Karte,
// deshalb bleibt CARD_OWNED_STATES unangetastet und das Selbstfahr-Gesetz
// gilt für sie ohne Ausnahme.

/** Wie lange der Wischer über die Fläche fährt, in Ticks.
 *
 *  TASTE: 36 (0,6 s) — lang genug, dass ein Strich als Strich gelesen wird,
 *  kurz genug, dass der Kampf nicht stehen bleibt. Drei Viertel des
 *  Knoten-Takts, damit der Aufstieg danach der längere Atemzug bleibt. */
export const WIPE_TICKS = 36;

/**
 * Wie lange sie auf das Kind wartet, in Ticks — HERGELEITET, nicht getippt.
 *
 * Die Frage, die diese Zahl beantworten muss, ist eine Fairness-Frage: ein Kind,
 * das die Karte gelöst hat und sich SOFORT auf den Weg macht, darf seine Antwort
 * nie verlieren — egal, wo auf der Bühne es gerade steht. Also ist die Zahl die
 * Zeit, die ein Kind braucht, um die ganze Bühne zu durchqueren, plus einen
 * Knoten-Takt als Reaktionszeit.
 *
 * Gerechnet wird mit `walkMax`, nicht mit `runMax`, obwohl dieses Kapitel in
 * Wahrheit mit 2,25 px/t läuft: die Wartezeit darf nie an einer Fähigkeit
 * hängen, die die Arena als Kür lehrt und nie verlangt (arena.md §1, „kein run
 * als Pflicht"). Die langsamere Gangart ist die sichere Seite — sie schenkt
 * Zeit, sie nimmt keine.
 *
 * Für die ausgelieferte Arena (c5–30, also 416 px): 416·SUBS/walkMax = 333 t,
 * plus 48 t = **381 Ticks ≈ 6,4 s**. Ein Kind am fernsten Punkt der Bühne kommt
 * mit 2,25 px/t nach 185 Ticks an — es hat also mehr als die doppelte Zeit.
 */
export const wipeWaitTicksFor = (
  e: Pick<EntityState, "params">,
  grid: readonly string[],
): number => {
  const { minPx, maxPx } = stageBoundsOf(e, grid);
  return Math.ceil(((maxPx - minPx) * SUBS) / PAINT.walkMax) + KNOT_BEAT_TICKS;
};

/** R5-W2 · H1 · DIE BÜHNE, IN PIXELN — eine Herleitung für JEDE ihrer Bewegungen.
 *
 *  `stageMinC`/`stageMaxC` (arena.md §10, P1-Vorleistung 1) binden die Tafel an
 *  die Bretter c5–30, damit die Seitenbühnen heilig bleiben: der Auftritt im
 *  Westen ist eine Ruhe-Zone, der Sieg-Trakt im Osten wird nie überflogen.
 *
 *  Die Klemme kannte bis hierher nur die HALBE Bewegung — sie saß allein am
 *  Flug-ZENTRUM (`homeX`), während der Dip frei `playerX ± DIP_STANDOFF_PX`
 *  ansteuerte. GEMESSEN am ausgelieferten Piloten: der ganze Kampf wird auf den
 *  Spalten 1,25–4,63 ausgetragen und die Tafel bis c4,13 mitgezogen — westlich
 *  ihrer Bühne, in der Kulisse, auf dem Spawn. Dort spielt heute auch der
 *  komplette Sieg-Bogen. Ein Gesetz, das nur für einen von neun Zuständen gilt,
 *  ist kein Gesetz; darum liest es ab jetzt jede Bewegung aus DIESER Funktion. */
const stageBoundsOf = (
  e: Pick<EntityState, "params">,
  grid: readonly string[],
): { minPx: number; maxPx: number } => ({
  minPx: e.params?.stageMinC !== undefined ? Number(e.params.stageMinC) * TILE : FLIGHT_MARGIN_PX,
  maxPx: e.params?.stageMaxC !== undefined
    ? (Number(e.params.stageMaxC) + 1) * TILE
    : (grid[0]?.length ?? 0) * TILE - FLIGHT_MARGIN_PX,
});

export const spawnEntities = (specs: EntitySpec[], links: LinkSpec[]): EntityWorld => ({
  entities: specs.map((s) => {
    const cellX = (s.c * TILE + TILE / 2) * SUBS;
    const cellY = (s.r + 1) * TILE * SUBS;
    // R5-A4: a kinematic platform spawns ON its path. The swing's path hangs
    // rope-length under the author cell — spawning at the cell popped the bob
    // down 40 px in its first tick (and spiked the ride delta with it).
    const p0 = s.role === "platform.move" || s.role === "platform.swing"
      ? platformPathAt(s.role, cellX, cellY, s.params ?? {}, 0)
      : null;
    return {
    id: s.id,
    role: s.role,
    skin: s.skin,
    tier: s.tier,
    x: p0 === null ? cellX : p0.x,
    y: p0 === null ? cellY : p0.y,
    vx: 0,
    vy: 0,
    dir: -1,
    // PK-R6 · D: a classmate starts `caged` — the painted cell of the person
    // still under the spell (`merle_caged0/1`, eyes down, hands limp). It is
    // what the child sees in the beat between the cage bursting and the first
    // round's pose, and it is what she falls back to if a round is deferred.
    // PK-R6 · E: a guardian is AIRBORNE from her first tick — there is no
    // grounded idle to fall out of, which is what keeps the old easel cells
    // (`tafel_sad`/`_dazed`/`_stagger`) unreachable while she flies.
    state: s.role === "cage" ? "closed" : s.role === "classmate" ? "caged"
      : s.role.startsWith("platform") ? "carry" : s.role === "guardian" ? "fly" : "patrol",
    timer: 0,
    hp: s.role === "cage" ? 2 : s.role === "guardian" ? GUARDIAN_SCRIPT[s.tier].knots : 1,
    homeX: cellX,
    homeY: cellY,
    redeemed: false,
    freed: false,
    hidden: s.params?.hidden === true,
    dodges: 0,
    throws: 0,
    flightTick: 0,
    bounceTick: 0,
    awakenStep: 0,
    freedTick: 0,
    params: s.params ?? {},
    };
  }),
  projectiles: [],
  links,
  nextProjectileId: 1,
  guardianKnots: -1,
});

const overlapsPlayer = (e: EntityState, inp: WorldInput, wPx = 14, hPx = 26): boolean => {
  const dx = Math.abs(e.x - inp.playerX) / SUBS;
  const pTop = inp.playerY / SUBS - 30;
  const eTop = e.y / SUBS - hPx;
  const vOverlap = e.y / SUBS > pTop && inp.playerY / SUBS > eTop;
  return dx < wPx && vOverlap;
};

const fistHits = (e: EntityState, fist: WorldInput["fist"], wPx = 14): boolean => {
  if (!fist || !fist.active) return false;
  return Math.abs(e.x - fist.x) / SUBS < wPx && Math.abs(e.y - SUBS * 14 - fist.y) / SUBS < 18;
};

// ── PK-R6 · C1/C2 · THE ENGAGE REACH (doc 44 §4 ch01) ───────────────────────
// „each stands grey in the world with an ↑ cue". The cue and the reach are ONE
// number: the arrow appears over exactly the thing a press would engage, so a
// child never presses ↑ at something the game silently considers out of range.
// Generous on purpose (the letter-magnet lesson, R3-16): a six-year-old parks
// their mascot roughly next to a desk, not on its centre pixel.
export const ENGAGE_REACH_PX = 22;
export const ENGAGE_REACH_Y_PX = 34;

/** The roles a ↑ press can reach. Cages are here because ch01 grants NO FIST
 *  (doc 44 §4 ability amendment) and a cage that only a punch can open would
 *  make the chapter's one classmate unrescuable — the fist path below stays
 *  exactly as it was for every chapter that does grant it.
 *
 *  PK-R6 · D: and a `classmate` mid-reawakening, which is the anti-softlock
 *  law (PB-T1) applied to a six-round ceremony — putting round 3 down with
 *  „Später" must leave a way back INTO it, and ↑ is the verb this chapter
 *  already teaches for stepping up to a bewitched being. */
export const ENGAGEABLE_ROLES = new Set<string>(["drained", "cage", "classmate"]);

const inEngageReach = (e: EntityState, playerX: number, playerY: number): boolean =>
  Math.abs(e.x - playerX) / SUBS < ENGAGE_REACH_PX
  && Math.abs(e.y - playerY) / SUBS < ENGAGE_REACH_Y_PX;

/** Dasselbe für die gelandete Tafel, mit IHRER Reichweite (`GUARDIAN_WIPE_REACH_PX`
 *  — die Kante, nicht die Mitte). Die Höhen-Bedingung bleibt die gemeinsame:
 *  wischen kann nur ein Kind, das auf derselben Fläche steht wie sie. */
const inWipeReach = (e: EntityState, playerX: number, playerY: number): boolean =>
  Math.abs(e.x - playerX) / SUBS < GUARDIAN_WIPE_REACH_PX
  && Math.abs(e.y - playerY) / SUBS < ENGAGE_REACH_Y_PX;

/**
 * R5-W2 · H1 · Does this cage still owe the child a card?
 *
 * The anti-softlock law (PB-T1) says every card can be put down and the world
 * comes back. For a plain cage that was only half true: the lid came off, the
 * card went down, and ↑ could never raise it again (see `EntityState.freed`).
 *
 * A cage with a CLASSMATE never owes one — it hands its beat to her ceremony
 * the moment it bursts, and `awakenAsk` is that ceremony's own road back. So
 * the road is opened for exactly the cages that lost theirs.
 */
export const cageOwesCard = (w: EntityWorld, e: EntityState): boolean =>
  e.role === "cage" && !e.freed && classmateOfCage(w, e.id) === null;

/**
 * Which being a ↑ press would engage right now, or null. PURE and exported so
 * the RENDERER draws the cue from the same answer the sim acts on — the „the
 * picture and the pickup can never disagree" rule the letter magnet already
 * follows. Nearest wins when two things stand close.
 */
export const engageTargetId = (
  w: EntityWorld,
  playerX: number,
  playerY: number,
): string | null => {
  let best: { id: string; d: number } | null = null;
  for (const e of w.entities) {
    if (e.hidden || !ENGAGEABLE_ROLES.has(e.role)) continue;
    // R5-W2 · H1: redemption normally ends the conversation — except for a cage,
    // which is `redeemed` from the moment its lid comes off, long before its
    // rescue has been answered. One that still owes a card stays askable, or
    // „Später" strands its captive for good.
    if (e.redeemed && !cageOwesCard(w, e)) continue;
    if (!inEngageReach(e, playerX, playerY)) continue;
    const d = Math.abs(e.x - playerX);
    if (best === null || d < best.d) best = { id: e.id, d };
  }
  return best?.id ?? null;
};

/** Ground snap for walking enemies (thin wrapper over the mover's surface probe). */
const groundAt = (grid: readonly string[], xSubs: number, ySubs: number): number | null => {
  const fromRow = Math.max(Math.floor(ySubs / SUBS / TILE) - 1, 0);
  const s = groundSurfaceAt(grid, xSubs / SUBS, fromRow, 4);
  return s === null ? null : s.yPx * SUBS;
};

/** PB-T2 · the kinematic platform path — ONE source of truth for the runtime
 *  step (above), the reachability validator (level.ts BFS sees the platform's
 *  swept cells through this), and any renderer. Pure function of (home, params,
 *  tick): platform.move rides a triangle wave; platform.swing a pendulum. */
export const platformPathAt = (
  role: "platform.move" | "platform.swing",
  homeX: number,
  homeY: number,
  params: Record<string, unknown>,
  tick: number,
): { x: number; y: number; period: number } => {
  if (role === "platform.move") {
    const dxT = Number(params.dxTiles ?? 4);
    const dyT = Number(params.dyTiles ?? 0);
    const period = Number(params.periodTicks ?? 240);
    const ph = (tick % period) / period;
    const wave = ph < 0.5 ? ph * 2 : 2 - ph * 2; // triangle 0→1→0
    return {
      x: homeX + Math.round(dxT * TILE * SUBS * wave),
      y: homeY + Math.round(dyT * TILE * SUBS * wave),
      period,
    };
  }
  const rope = Number(params.ropePx ?? 48);
  const period = Number(params.periodTicks ?? 180);
  const a = Math.sin((tick % period) / period * Math.PI * 2) * 0.9;
  // R5-A4: a pendulum bob RISES toward its turn-points (cos flattens the
  // rope). The old extra minus sign dipped it DOWN there instead — the
  // visible end-of-arc jerk on p3's upper mover.
  return {
    x: homeX + Math.round(Math.sin(a) * rope * SUBS),
    y: homeY + rope * SUBS + Math.round((Math.cos(a) - 1) * rope * SUBS * 0.25),
    period,
  };
};

/** PB-T1 · the walker's AHEAD probe (the entity ground contract): strict about
 *  edges — a drop deeper than one tile, a tall rise, a slope, or a one-way
 *  reads as "no ground" and the walker TURNS, unless the role opts in via
 *  `params.walkSlopes` (v1's forgiving 4-row probe sent pencils strolling
 *  down ramps and off ledges — the playtest's "random walking" class). */
const walkAheadAt = (grid: readonly string[], e: EntityState, xSubs: number): number | null => {
  const opts = e.params?.walkSlopes === true ? { maxDropTiles: 1, acceptSlopes: true, acceptOneWays: true } : { maxDropTiles: 1 };
  const s = walkSurfaceAhead(grid, xSubs / SUBS, e.y / SUBS, opts);
  return s === null ? null : s.yPx * SUBS;
};

// ── PK-R6 · E · the flight, as PURE FUNCTIONS (so the fight is a table) ──────

/** How long this knot's telegraph runs, in ticks — the tier script tightened by
 *  the knot's rate and then held at the fairness floor. THE floor is the point:
 *  every caller goes through here, so there is no path by which a shorter tell
 *  can reach a child. */
export const telegraphTicksFor = (tier: "E" | "M" | "S", hp: number, knots: number): number =>
  Math.max(TELEGRAPH_FLOOR_TICKS, Math.round(GUARDIAN_SCRIPT[tier].telegraphTicks * (KNOT_RATE[knotIndex(hp, knots)] ?? 1)));

/** How long she flies between throws, in ticks (same escalation, no floor — a
 *  faster rhythm is fair as long as each throw is still announced). */
export const throwEveryFor = (tier: "E" | "M" | "S", hp: number, knots: number): number =>
  Math.round(GUARDIAN_SCRIPT[tier].throwEvery * (KNOT_RATE[knotIndex(hp, knots)] ?? 1));

/** Where on her path she is, in SUBS, given her flight centre and her path tick.
 *  Exported because the flight-band test recomputes the whole traversal from
 *  here — the claim „her body never leaves the visible band" is then checked
 *  against the function the sim actually flies, not against a copy of it. */
export const flightPointAt = (
  centreXSubs: number,
  centreYSubs: number,
  hp: number,
  knots: number,
  flightTick: number,
): { x: number; y: number } => {
  const ki = knotIndex(hp, knots);
  const period = KNOT_PERIOD_TICKS[ki] ?? 300;
  const span = KNOT_SPAN_PX[ki] ?? 78;
  const { fx, fy } = flightUnitAt(pathForKnot(hp, knots), flightTick / period);
  return {
    x: centreXSubs + Math.round(fx * span * SUBS),
    y: centreYSubs + Math.round(fy * FLIGHT_BAND_PX * SUBS),
  };
};

export const stepEntities = (
  w: EntityWorld,
  grid: readonly string[],
  inp: WorldInput,
): EntityEvent[] => {
  const events: EntityEvent[] = [];
  if (inp.playerOverlayOpen) return events; // the world holds its breath during a task

  // PK-R6 · C1: resolve the ↑ press ONCE, to ONE being. Asking each entity
  // "am I in reach?" independently would open two cards for one press where a
  // desk and a cage stand together — and the second would be a card about a
  // being the child never chose.
  const engageId = inp.playerEngage === true ? engageTargetId(w, inp.playerX, inp.playerY) : null;

  for (const e of w.entities) {
    if (e.hidden) continue;
    // R3-5: a freed friend keeps LIVING (joy → rest); it is no longer skipped
    if (e.redeemed) {
      stepRedeemed(e, grid);
      // R5-W2 · H1 · THE ROAD BACK, and it has to live here rather than in the
      // `cage` case below, because this short-circuit is exactly what made the
      // softlock: a cage is `redeemed` from the moment its lid comes off, so
      // its own case has not run since. Everything else about an open cage IS
      // finished — only the ↑ ask comes back, and only while it still owes one.
      if (e.id === engageId && cageOwesCard(w, e)) {
        events.push({ type: "cageAsk", id: e.id, skin: e.skin });
      }
      continue;
    }
    e.timer += 1;
    switch (e.role) {
      case "chaser": {
        if (e.state === "patrol") {
          e.vx = ENEMY_WALK * e.dir;
          const aheadX = e.x + e.vx * 8;
          const g = walkAheadAt(grid, e, aheadX);
          // R5-P1 (p1-Dossier-Vorleistung): ein AUTORISIERTES Patrouillen-Band —
          // der Läufer wendet an params.patrolMinC/MaxC wie an einer Kante, so
          // kann ein Lehr-Screen seine Null-Gefahr-Zone GARANTIEREN.
          const bandMin = e.params?.patrolMinC !== undefined ? (Number(e.params.patrolMinC) * TILE + TILE / 2) * SUBS : null;
          const bandMax = e.params?.patrolMaxC !== undefined ? (Number(e.params.patrolMaxC) * TILE + TILE / 2) * SUBS : null;
          const bandTurn = (bandMin !== null && e.dir < 0 && e.x <= bandMin) || (bandMax !== null && e.dir > 0 && e.x >= bandMax);
          // doc 40 §2 · the turn is its OWN beat now (18 t, flip at midpoint) —
          // a walker that reversed in one tick read as a glitch, not a decision
          if (g === null || bandTurn) { e.state = "turn"; e.timer = 0; e.vx = 0; } // edge/ramp/band turn
          else {
            e.x += e.vx;
            const snap = groundAt(grid, e.x, e.y);
            if (snap !== null) e.y = snap;
          }
          const sameBand = Math.abs(e.y - inp.playerY) / SUBS < 24;
          if (sameBand && Math.abs(e.x - inp.playerX) / SUBS < AGGRO_X_PX) { e.state = "telegraph"; e.timer = 0; }
          // R5-W4 · F5 · …und alle paar Sekunden kritzelt er. Die Prüfung steht
          // NACH der Aggro-Prüfung: ein Kind, das gerade herankommt, bekommt den
          // Angriff, nicht den Anfall — der Anfall ist Charakter, kein Hindernis.
          else if (e.timer > frenzyEveryFor(e.id)) { e.state = "frenzy"; e.timer = 0; e.vx = 0; }
        } else if (e.state === "frenzy") {
          // Bewegung über DIFFERENZEN: die Summe über den ganzen Anfall ist
          // exakt null, also steht der Körper am Ende auf dem Anker-Punkt.
          e.x += frenzyOffsetSubs(e.timer) - frenzyOffsetSubs(e.timer - 1);
          if (e.timer % FRENZY_FLIP_TICKS === 0) e.dir = (e.dir * -1) as 1 | -1;
          // …ein Kind, das während des Anfalls herankommt, wird trotzdem gesehen.
          // Beim Abbruch geht der Körper auf den Anker ZURÜCK (der Ausschlag ist
          // absolut gemessen), damit „netto null" nicht nur für den vollständig
          // gelaufenen Anfall gilt, sondern für jeden.
          const nah = Math.abs(e.y - inp.playerY) / SUBS < 24 && Math.abs(e.x - inp.playerX) / SUBS < AGGRO_X_PX;
          if (nah) { e.x -= frenzyOffsetSubs(e.timer); e.state = "telegraph"; e.timer = 0; }
          else if (e.timer >= FRENZY_TICKS) { e.state = "patrol"; e.timer = 0; }
        } else if (e.state === "turn") {
          if (e.timer === TURN_FLIP_AT) e.dir = (e.dir * -1) as 1 | -1;
          if (e.timer > TURN_TICKS) { e.state = "patrol"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          // doc 40 §2: 24 → 30 t (both were under the study's shortest telegraph)
          if (e.timer > 30) { e.state = "act"; e.timer = 0; e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1; }
        } else if (e.state === "act") {
          const g = walkAheadAt(grid, e, e.x + ENEMY_LUNGE * e.dir * 4);
          if (g !== null) { e.x += ENEMY_LUNGE * e.dir; const s2 = groundAt(grid, e.x, e.y); if (s2 !== null) e.y = s2; }
          if (e.timer > 40 || g === null) { e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "gunner": {
        const every = e.tier === "E" ? 210 : e.tier === "M" ? 160 : 120;
        const inRange = Math.abs(e.x - inp.playerX) / SUBS < 140;
        if (e.state === "patrol" && inRange && e.timer > every) { e.state = "telegraph"; e.timer = 0; }
        else if (e.state === "telegraph" && e.timer > 30) {
          e.state = "patrol"; e.timer = 0;
          const dir = inp.playerX >= e.x ? 1 : -1;
          w.projectiles.push({
            id: w.nextProjectileId++, kind: "blob", x: e.x, y: e.y - 10 * SUBS,
            vx: Math.round(1.4 * SUBS) * dir, vy: -Math.round(2.2 * SUBS), deflected: false, fromId: e.id, dead: false, age: 0, colour: "",
          });
        }
        break;
      }
      case "flyer": {
        // sine patrol around home altitude; dive when the player is below
        const t = e.timer;
        if (e.state === "patrol") {
          e.x = e.homeX + Math.round(Math.sin(t / 40) * FLYER_SWEEP_PX * SUBS);
          e.y = e.homeY + Math.round(Math.sin(t / 23) * 6 * SUBS);
          const below = inp.playerY > e.y && Math.abs(e.x - inp.playerX) / SUBS < 24;
          if (below && t > 90) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 30) { e.state = "act"; e.timer = 0; } // doc 40 §2: 20 → 30 t
        } else if (e.state === "act") {
          e.y += Math.round(2.2 * SUBS);
          if (e.y >= inp.playerY || e.timer > 40) { e.state = "recover"; e.timer = 0; }
        } else if (e.state === "recover") {
          e.y -= Math.round(1.2 * SUBS);
          if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; e.timer = 0; }
        }
        break;
      }
      case "bouncer": {
        // R5-A3 · the bouncer contract (doc 45): (1) land only by CROSSING a
        // surface — the same law moveBody holds the player to. The forgiving
        // probe scans from one row ABOVE the feet, so a sideways drift under a
        // higher column used to SNAP him up onto it; along rising terrain that
        // ratchet carried him off the top of the screen. (2) The horizontal
        // step probes the wall ahead EVERY tick, air included — the arc used
        // to be contract-free, so he drifted through columns and was then
        // lifted on top of them.
        const prevY = e.y;
        // R5-W1 · F1 · DER HÜPFER BEKOMMT EINE UHR (Kokis Replay, 07:25:36).
        // Die Schwerkraft lag hier auf JEDEM Tick, während der Held seine seit
        // jeher auf einer Uhr hat (PAINT.gravityEveryTicks — „the float lives
        // here"). Ergebnis war ein Bogen von 3,6 px in 6 Ticks: zehn Hüpfer pro
        // Sekunde, auf 16-px-Kacheln ein Zittern statt eines Rhythmus. Dieselbe
        // Uhr, kontakt-gekoppelt, macht daraus ~13,6 px in ~15 Ticks — ein
        // Hüpfen, das ein Kind mitzählen kann. Kontakt-gekoppelt und nicht
        // global, damit jeder Bogen exakt gleich lang ist: eine globale Uhr
        // liefert abwechselnd 13 und 11 Ticks, und ungleiche Hüpfer lesen sich
        // als Fehler.
        e.bounceTick++;
        if (e.bounceTick % BOUNCE_GRAVITY_EVERY === 0) e.vy += GRAVITY;
        e.y += e.vy;
        const g = groundAt(grid, e.x, e.y);
        if (g !== null && e.vy > 0 && prevY <= g && e.y >= g) {
          e.y = g;
          e.vy = -BOUNCE_UP;
          e.bounceTick = 0;
          const aheadG = walkAheadAt(grid, e, e.x + 20 * SUBS * e.dir);
          if (aheadG === null) e.dir = (e.dir * -1) as 1 | -1;
        }
        const step = Math.round(0.5 * SUBS) * e.dir;
        const edgeC = Math.floor(((e.x + step) / SUBS + 10 * e.dir) / TILE);
        const feetPx = e.y / SUBS;
        const blocked = isSolid(glyphAt(grid, edgeC, Math.floor((feetPx - 4) / TILE))) ||
          isSolid(glyphAt(grid, edgeC, Math.floor((feetPx - 14) / TILE)));
        if (blocked) e.dir = (e.dir * -1) as 1 | -1;
        else e.x += step;
        break;
      }
      case "crusher": {
        // rests high at home; slams when the player passes beneath
        if (e.state === "patrol") {
          const under = Math.abs(e.x - inp.playerX) / SUBS < 16 && inp.playerY > e.y;
          if (under) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          if (e.timer > 28) { e.state = "act"; e.timer = 0; }
        } else if (e.state === "act") {
          e.y += Math.round(4 * SUBS);
          const g = groundAt(grid, e.x, e.y);
          if (g !== null && e.y >= g) {
            e.y = g; e.state = "recover"; e.timer = 0;
            // R3-6: a slam that lands silently reads as scenery. The dust is what
            // says „this thing DROPS" — the stomper's purpose, shown not stated.
            events.push({ type: "puff", x: e.x, y: e.y, kind: "chalk" });
          }
        } else if (e.state === "recover") {
          if (e.timer > 45) { e.y -= SUBS; if (e.y <= e.homeY) { e.y = e.homeY; e.state = "patrol"; } }
        }
        break;
      }
      case "swarm": {
        // the moth cloud drifts around home, leaning gently toward the player
        const t = e.timer;
        const lean = Math.sign(inp.playerX - e.x) * Math.min(Math.abs(inp.playerX - e.x) / 8, 0.4 * SUBS);
        e.x = e.homeX + Math.round(Math.sin(t / 30) * 24 * SUBS) + Math.round(lean * Math.min(t, 240) / 240);
        e.y = e.homeY + Math.round(Math.sin(t / 17) * 10 * SUBS);
        break;
      }
      case "platform.move": {
        const p = platformPathAt("platform.move", e.homeX, e.homeY, e.params, e.timer);
        e.vx = p.x - e.x; e.vy = p.y - e.y; // per-tick delta for the ride contract
        e.x = p.x; e.y = p.y;
        break;
      }
      case "platform.swing": {
        const p = platformPathAt("platform.swing", e.homeX, e.homeY, e.params, e.timer);
        e.vx = p.x - e.x; e.vy = p.y - e.y;
        e.x = p.x; e.y = p.y;
        break;
      }
      case "platform.fall": {
        if (e.state === "armed") {
          if (e.timer > 24) { e.state = "falling"; e.timer = 0; }
        } else if (e.state === "falling") {
          e.vy = Math.min(e.vy + GRAVITY, 3 * SUBS);
          e.y += e.vy;
          if ((e.y - e.homeY) / SUBS > 160) { e.state = "gone"; e.vy = 0; }
        }
        break;
      }
      // PK-R6 · C1 · THE DRAINED CLASSROOM OBJECT (doc 44 §4 ch01 field
      // restage). No brain, no menace, no contact damage: it stands where it
      // fell and waits. The child walks up and presses ↑; the sim turns the
      // event into its two-step `restore` card. Contact alone does NOTHING on
      // purpose — a desk that ambushed you with a vocabulary question every
      // time you brushed past would make the calm tutorial chapter hostile.
      case "drained": {
        if (e.id === engageId) {
          e.state = "shaking";
          e.timer = 0;
          events.push({ type: "engaged", id: e.id, role: e.role, skin: e.skin });
        } else if (e.state === "shaking" && e.timer > 30) e.state = "patrol";
        break;
      }
      // PK-R6 · D · THE BEWITCHED CLASSMATE (doc 44 §3.3). Like a drained
      // object she has no brain and no menace — she stands where she stepped
      // out of the cage, acting out whatever wrong action the open round asks
      // for (the pose is set by the shell from the card's own art binding, so
      // the picture in the card and the figure in the world are one
      // declaration). Contact does nothing; only ↑ resumes a deferred round.
      case "classmate": {
        if (e.id === engageId) events.push({ type: "awakenAsk", id: e.id, skin: e.skin });
        break;
      }
      case "cage": {
        // PK-R6 · C2: ↑ opens a cage in a chapter with no fist. One press frees
        // it — the two-hit rattle below is the FIST's grammar (wind up, feel the
        // weight, hit it again), and it stays exactly that for the chapters that
        // grant one. There is nothing to wind up about a hand on a latch.
        // R5-P1 (Arena-Dossier-Vorleistung): solange der Wächter der Phase
        // steht, ist der Käfig GEGATED (Toast-Klasse wie das ✕) — der
        // Klassenfoto-Beat darf nie mitten im Kampf feuern. Copy = P4-Platzhalter.
        if (inp.cagesGated === true && e.state !== "burst" && e.id === engageId) {
          events.push({ type: "cageGated", id: e.id });
          break;
        }
        // (the road back for an ALREADY-open cage lives in the redeemed
        //  short-circuit at the top of this loop — this case never runs once
        //  the lid is off)
        if (e.state !== "burst" && e.id === engageId) {
          e.state = "burst"; e.redeemed = true; e.timer = 0; e.freedTick = 0;
          events.push({ type: "cageBurst", id: e.id, skin: e.skin });
        } else if (e.state === "closed" && fistHits(e, inp.fist, 16)) {
          e.hp -= 1;
          events.push({ type: "puff", x: inp.fist?.x ?? e.x, y: inp.fist?.y ?? e.y, kind: "hit" }); // R3-6
          if (e.hp <= 0) { e.state = "burst"; e.redeemed = true; e.timer = 0; e.freedTick = 0; events.push({ type: "cageBurst", id: e.id, skin: e.skin }); }
          else { e.state = "shaking"; e.timer = 0; events.push({ type: "cageHit", id: e.id, hpLeft: e.hp }); }
        } else if (e.state === "shaking" && e.timer > 30) e.state = "closed";
        break;
      }
      case "powerup": {
        if (overlapsPlayer(e, inp, 14, 20)) {
          e.redeemed = true;
          events.push({ type: "powerupTaken", id: e.id, grants: String(e.params.grants ?? "punch") });
        }
        break;
      }
      // PK-R3b · R3-16 · the static-state collectibles (doc 41 §5). No brain at
      // all: they sit where they were placed and are TAKEN on contact. The
      // generous 18×24 box is deliberate — a rule page a child brushes past and
      // does not get is the „only a small field gets them" complaint the letter
      // magnet exists to answer, and it applies here twice over.
      case "tip":
      case "book": {
        if (overlapsPlayer(e, inp, 18, 24)) {
          e.redeemed = true;
          e.timer = 0;
          events.push({ type: "pickupTaken", id: e.id, role: e.role, skin: e.skin });
        }
        break;
      }
      // R5-W5 · G4 · a piece of the scattered uniform (UNIFORM_SAMMELN_DESIGN
      // §1). Same no-brain contact take as the two above, and deliberately the
      // same generous 18×24 box: a piece the child brushes past and does not get
      // is worse here than for a rule page, because the naming card only ever
      // asks about pieces that were actually found. The word itself rides in
      // `params.wordEn` and is read where the toast is built — the entity step
      // stays a collision test and nothing else.
      case "cloth": {
        if (overlapsPlayer(e, inp, 18, 24)) {
          e.redeemed = true;
          e.timer = 0;
          events.push({ type: "pickupTaken", id: e.id, role: e.role, skin: e.skin });
        }
        break;
      }
      case "door.trigger": {
        if (overlapsPlayer(e, inp, 12, 26) && e.state !== "cooling") {
          e.state = "cooling"; e.timer = 0;
          events.push({ type: "doorTouched", id: e.id, kind: String(e.params.kind ?? "exit") });
        } else if (e.state === "cooling" && e.timer > 90 && !overlapsPlayer(e, inp, 12, 26)) {
          // R5-A2 (critic finding): a door re-arms only once the child has
          // STEPPED OFF it — returning from the Kleckskammer spawns ON the
          // door, and a timer-only re-arm reopened the pay card every ~1.5 s
          // over an empty purse. Same law as the ↑ rising edge (PK-R6 C1):
          // held contact never re-asks.
          e.state = "patrol";
        }
        break;
      }
      case "guardian": {
        const script = GUARDIAN_SCRIPT[e.tier];
        if (w.guardianKnots < 0) w.guardianKnots = script.knots;
        /** THE FLIGHT CENTRE follows the child — slowly, and clamped inside the
         *  stage. Mined in shape from the legacy `cloud` brain (drift toward the
         *  player's column, THEN telegraph, THEN fire): a tell thrown from off
         *  screen is not a tell.
         *
         *  R5-W2 · H1: it is a function now because the `untie` beat needs it
         *  BEFORE the new path is ever sampled. The centre freezes the moment
         *  she dips, so by the time a knot came loose it was ≥37 ticks stale —
         *  and the next knot's span is WIDER (78 → 92 → 104), so she used to
         *  re-enter the world reaching past her own stage. */
        const trackCentre = (): void => {
          const span = KNOT_SPAN_PX[knotIndex(e.hp, script.knots)] ?? 78;
          const { minPx, maxPx } = stageBoundsOf(e, grid);
          const loC = (minPx + span) * SUBS;
          const hiC = Math.max(loC, (maxPx - span) * SUBS);
          const wantC = Math.min(Math.max(inp.playerX, loC), hiC);
          const dC = wantC - e.homeX;
          e.homeX += Math.max(-CENTRE_MAX_STEP, Math.min(CENTRE_MAX_STEP, Math.trunc(dC / CENTRE_EASE_DIV)));
          // …und der Korridor gilt für das ZENTRUM selbst, nicht nur für sein
          // Ziel. Die Rampe TRUNKIERT (`trunc(dC / 48)`), also bleibt sie die
          // letzten paar Subs vor dem Rand mit Schrittweite 0 stehen — und der
          // Rand wandert bei jedem Knoten nach innen, weil die Spannweite
          // wächst. Gemessen war sie deshalb 0,07 px westlich der Bühne, für
          // immer. Eine Klemme ist hier billiger als eine Rampe ohne Rest.
          e.homeX = Math.min(Math.max(e.homeX, loC), hiC);
        };
        // ── PK-R6 · E · THE FLYING TAFEL (doc 44 §4 ch01 C4) ────────────────
        // „She hovers above the arena tracing readable paths — spirals,
        // figure-eights, zigzags … telegraph: she dips and rears, ≥500 ms …
        // throws colored chalk that arcs down and shatters."
        //
        // The whole machine is airborne: there is no grounded state left to
        // reach until she is BEATEN, which is the mechanical half of the
        // identity law (PB-F1). The grounded cells (`tafel_sad`/`_dazed`/
        // `_stagger`) belong to the retired easel and anim.ts now refuses to
        // resolve to them for any state this machine can be in mid-flight.

        // THE TERMINAL BEATS — she is down, and she comes to rest (doc 44 §4
        // ch01 C4: „she sinks to the ground, exhausted").
        // R3-5 kept: the board reacts BEFORE the victory cell. What changed is
        // the reaction — doc 44 §2.2 flexibilised the signature beat („the Tafel
        // slumps exhausted"), so she rests rather than cries. R5-W2 · H1: the
        // landing lives in its own function, because the HOLD has to be able to
        // play it too (see stepGuardianLanding).
        if (stepGuardianLanding(e, grid)) break;
        // `window` (the counter-task) and `consoled` are scene-driven states.
        if (e.state === "window" || e.state === "consoled") break;

        // ── R5-W4 · H2 · SIE WARTET AUFS WISCHEN (R50) ─────────────────────
        // Hier steht sie auf den Brettern, die Karte ist beantwortet, und die
        // Kritzel-Schicht ist noch da. Zwei Ausgänge, und beide sind gebaut:
        //
        //   Berührung  → `wipe`  → die Schicht geht weg, sie steigt auf
        //   Wartezeit  → `untie` → sie steigt MIT der Schicht auf
        //
        // Der zweite Ausgang ist der Preis, und er ist bewusst mild: die Karte
        // zählt nicht, aber die Welt bleibt heil — kein Zustand ohne Rückweg,
        // kein Kind, das den Kampf nicht zu Ende spielen kann. Die Wartezeit
        // ist so bemessen, dass nur ein Kind sie verliert, das gar nicht
        // hingeht (siehe wipeWaitTicksFor).
        //
        // Der Auslöser ist die BERÜHRUNG, nicht ↑. Kokis Satz sagt „wenn sie
        // unten ist und man zu ihr geht" — und ↑ würde die Tafel in
        // ENGAGEABLE_ROLES ziehen, mitsamt der ↑-Wolke und dem Selbstfahr-
        // Gesetz, das für genau diese Rolle eine Ausnahme macht. Die REICHWEITE
        // ist dieselbe, die dieses Kapitel schon für „das Kind steht an diesem
        // Ding" benutzt: ein Sechsjähriger parkt neben einer Sache, nicht auf
        // ihrem Mittelpixel.
        if (e.state === "wipeable") {
          e.vx = 0;
          e.vy = 0;
          if (inWipeReach(e, inp.playerX, inp.playerY)) {
            e.state = "wipe";
            e.timer = 0;
            break;
          }
          if (e.timer > wipeWaitTicksFor(e, grid)) {
            e.state = "untie";
            e.timer = 0;
            e.dodges = 0;
          }
          break;
        }
        if (e.state === "wipe") {
          e.vx = 0;
          e.vy = 0;
          if (e.timer > WIPE_TICKS) {
            // DAS IST DIE STELLE, an der eine Schicht wirklich verschwindet —
            // nicht mehr die gelöste Karte. `hp` zählt, was noch auf ihr steht.
            e.hp -= 1;
            w.guardianKnots = e.hp;
            e.dodges = 0;
            e.timer = 0;
            if (e.hp <= 0) {
              // sie ist sauber. Sie liegt schon auf den Brettern, also ist der
              // Fall kurz — `sink` rechnet ihn aus ihrer Lage, nicht aus einer
              // getippten Höhe, und läuft deshalb hier einfach durch.
              e.state = "sink";
              events.push({ type: "guardianDown", id: e.id });
            } else {
              e.state = "untie";
              events.push({ type: "guardianKnot", id: e.id, knotsLeft: e.hp });
            }
          }
          break;
        }

        // ── R5-W2 · H1 · DER KNOTEN-TAKT (Auftrag 2: Eskalation, die man spürt)
        // Zwischen zwei Knoten lag bisher NICHTS: die Karte ging zu, und im
        // nächsten Tick stand sie 43 bis 68 px höher und bis zu 102 px weiter
        // links, auf einer neuen Bahn, mitten in deren Verlauf. Ein Kind, das
        // gerade eine Frage beantwortet hat, bekam den wichtigsten Übergang des
        // Kampfes als Bildfehler serviert.
        //
        // Jetzt ist es ein Takt: sie hält den gelösten Knoten kurz auf
        // Dip-Höhe — am nächsten, am grössten, dort wo das Kind sie gerade
        // gelesen hat — und STEIGT dann auf die neue Bahn, die sie sauber bei
        // Phase 0 betritt. Das Zentrum wandert während des ganzen Takts mit,
        // also ist es nicht mehr schal, wenn die (breitere) neue Bahn zum ersten
        // Mal abgetastet wird. Aus dem Sprung wird Bewegung, und aus dem
        // Übergang ein Beat.
        if (e.state === "untie") {
          // Das Zentrum wandert nur in der ersten Hälfte des Takts mit. Danach
          // steht ihr Ziel STILL, damit die /6-Rampe es auch wirklich erreicht:
          // gegen ein Ziel, das sich weiterbewegt, behält eine Ease einen festen
          // Rückstand (0,6 px/Tick ÷ 1/6 = 3,6 px), und der müsste am Ende doch
          // wieder weggeschnappt werden — also genau die Versetzung, die dieser
          // Takt abschaffen soll, nur kleiner. Die letzten zwölf Ticks
          // entscheidet sie sich für ihre neue Bahn.
          if (e.timer <= KNOT_BEAT_TICKS - UNTIE_RECOIL_TICKS) trackCentre();
          if (e.timer <= UNTIE_RECOIL_TICKS) {
            // der Rückstoss: sie hält, wo sie steht. Die Bewegung dieses Takts
            // gehört der Schnur (die Szene lässt den Knoten fallen) und dem
            // Ganzkörper-Ausdruck — ein Glied allein käme durch ein gemaltes
            // Blatt nicht durch (die Lehre aus F3).
            e.vx = 0;
            e.vy = 0;
            break;
          }
          const p = flightPointAt(e.homeX, e.homeY, e.hp, script.knots, 0);
          const sx = Math.round((p.x - e.x) / 6); // dieselbe /6-Rampe wie der Dip
          const sy = Math.round((p.y - e.y) / 6);
          e.vx = sx;
          e.vy = sy;
          e.x += sx;
          e.y += sy;
          if (Math.abs(e.vx) > SUBS / 4) e.dir = (e.vx > 0 ? 1 : -1) as 1 | -1;
          if (e.timer > KNOT_BEAT_TICKS) {
            // exakt auf Phase 0 aufsetzen, damit die neue Form von vorn beginnt
            e.x = p.x;
            e.y = p.y;
            e.flightTick = 0;
            e.state = "fly";
            e.timer = 0;
          }
          break;
        }

        // THE DIP — three dodged throws over-reach her and she comes DOWN to
        // the child to write (doc 44 §4 ch01 C4 + the boss-evidence law, doc 41
        // §4). Coming down is not decoration: four chalked words have to be
        // readable at 1×, and the card's asker has to be ON SCREEN or the
        // speaker law parks the request against a boss who is no longer moving.
        if (e.state === "dip") {
          const side: 1 | -1 = e.x <= inp.playerX ? -1 : 1;
          // sie LEHNT sich zum Kind, aber sie verlässt ihre Bühne nicht: ein
          // Kind in der Kulisse zieht sie sonst mit hinaus (siehe stageBoundsOf)
          const stage = stageBoundsOf(e, grid);
          // ── R5-W4 · H2 · SIE KOMMT AUF DEN BODEN DES KINDES ────────────────
          // GEMESSEN, nicht vermutet: von fünf Fenstern eines echten Laufs
          // gingen zwei verloren, und beide Male stand sie am Ende auf einem
          // KREIDE-KISTEN-PODEST (y 224) und das Kind auf dem Boden (y 256) —
          // 32 px höher, hinter einer Voll-Säule, 42 bis 61 px entfernt. Das
          // Kind lief gegen die Kiste und kam nie in Reichweite; die Karte war
          // beantwortet und verfiel trotzdem.
          //
          // Seit dem Wischen ist die Dip-Lage auch ihre LANDEPLATZ-Wahl, also
          // muss sie die Fläche treffen, auf der das Kind steht: erst die Seite,
          // zu der sie ohnehin lehnt, sonst die andere, sonst die Spalte des
          // Kindes selbst. Alle drei Kandidaten sind deterministisch und in
          // dieser Reihenfolge — kein Zufall, kein Suchen.
          const childGround = groundAt(grid, inp.playerX, inp.playerY);
          const sameFloor = (px: number): boolean => groundAt(grid, px, inp.playerY) === childGround;
          let want = inp.playerX + side * DIP_STANDOFF_PX * SUBS;
          if (!sameFloor(want)) want = inp.playerX - side * DIP_STANDOFF_PX * SUBS;
          if (!sameFloor(want)) want = inp.playerX;
          const tx = Math.min(Math.max(want, stage.minPx * SUBS), stage.maxPx * SUBS);
          const step = Math.round((tx - e.x) / 6);
          e.vx = step;
          e.x += step;
          e.y += Math.round((DIP_Y_PX * SUBS - e.y) / 6);
          e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1;
          if (e.timer > DIP_TICKS) {
            e.state = "stagger";
            e.timer = 0;
            e.vx = 0; // she has ARRIVED — a window that still carries travel
            e.vy = 0; // would drift her out from under her own chalked words
            eventsPushStagger(events, e.id);
          }
          break;
        }
        if (e.state === "stagger") {
          // the FIST path (every chapter that grants one): a deflected piece
          // reels her without the dip. She hangs there until her card opens;
          // the timeout is the no-card fallback that keeps her from freezing.
          e.vx = 0;
          if (e.timer > script.staggerTicks) { e.state = "fly"; e.timer = 0; }
          break;
        }

        // THE COUNTER-WINDOW OPENS — but only out of level flight. Interrupting
        // a windup would drop a telegraph the child has already started reading
        // and leave a throw that never comes; this is the „never mid-crossing"
        // rule of PK-C3 carried over to an aerial boss.
        if (e.dodges >= DODGES_PER_WINDOW && e.state === "fly") {
          e.dodges = 0;
          e.state = "dip";
          e.timer = 0;
          break;
        }

        // R5-P1 (Arena-Dossier-Vorleistung): die Tafel gehört auf die BÜHNE.
        // params.stageMinC/stageMaxC klemmen das Flug-Zentrum auf das Bühnen-
        // Band (Zentrum ∈ [stageMin+Spann, stageMax−Spann]) — die Seitenbühnen
        // (Auftritt West, Sieg-Trakt Ost) sind damit mechanisch heilig; ohne
        // Params bleibt exakt das alte Welt-Verhalten.
        trackCentre();

        if (e.state === "fly") {
          e.flightTick += 1;
          const p = flightPointAt(e.homeX, e.homeY, e.hp, script.knots, e.flightTick);
          e.vx = p.x - e.x; // the per-tick travel: what the bank cells depict
          e.vy = p.y - e.y;
          e.x = p.x;
          e.y = p.y;
          // she faces the way she flies, so a banked cell and its direction of
          // travel can never disagree (R3-4's facing law, moved into the air)
          if (Math.abs(e.vx) > SUBS / 4) e.dir = (e.vx > 0 ? 1 : -1) as 1 | -1;
          if (e.timer > throwEveryFor(e.tier, e.hp, script.knots)) { e.state = "telegraph"; e.timer = 0; }
        } else if (e.state === "telegraph") {
          // THE TELL: she holds station and rears (windup0 → windup1 → windup).
          // Holding is what makes the shape readable — a boss that keeps tracing
          // its path while winding up gives the child two things to read at once.
          e.vx = 0;
          e.vy = 0;
          e.dir = (inp.playerX >= e.x ? 1 : -1) as 1 | -1;
          if (e.timer > telegraphTicksFor(e.tier, e.hp, script.knots)) {
            // THE ARC (doc 44 §3.2: the cloud-bolt brain „generalized to thrown
            // chalk"). The legacy bolt was a straight vertical line; chalk falls.
            // So the throw SOLVES its own arc: with `vy += g` applied before the
            // step, after n ticks y = y0 + n·vy0 + g·n(n+1)/2 — invert that for
            // the child's feet at exactly CHALK_FLIGHT_TICKS and both axes fall
            // out. Aimed at where they STAND, which is why moving is the answer.
            const colour = CHALK_COLOURS[e.throws % CHALK_COLOURS.length] ?? "white";
            const throwNo = e.throws;
            e.throws += 1;
            const x0 = e.x + 10 * SUBS * e.dir;
            const y0 = e.y - 22 * SUBS;
            const T = CHALK_FLIGHT_TICKS;
            // ── R5-W2 · H1 (Teil 3) · DREI VERBEN, NICHT DREI TEMPI ───────────
            // Kokis F3: „Erst EINE Kreide, progressiv mehr, am Ende fast
            // bodendeckend — unausweichlich werdend." Die Eskalation war bisher
            // drei Skalare: dasselbe, schneller. Jetzt bekommt jeder Knoten ein
            // eigenes VERB, auf das das Kind anders antworten muss:
            //   Knoten 1 — die einzelne Kreide: aus dem Fleck gehen.
            //   Knoten 2 — DIE GABEL: ein Stück, wo du stehst, eines eine
            //              Geh-Länge daneben. Die Richtung wird zur Entscheidung.
            //   Knoten 3 — DER SCHWALL: die Gabel bleibt, und was landet, RUTSCHT.
            //              Weggehen hört auf zu genügen; springen oder aufs
            //              Podest (arena.md §3 nennt genau das als dessen
            //              Auszahlung).
            const ki2 = knotIndex(e.hp, script.knots);
            // Die Seite der Gabel wechselt deterministisch — kein Math.random im
            // Gameplay (Repo-Gesetz), und ein Kind, das immer nach rechts läuft,
            // darf nicht immer richtig liegen.
            const forkSign = throwNo % 2 === 0 ? 1 : -1;
            const aims: Array<{ at: number; scores: boolean }> = ki2 >= FORK_FROM_KNOT
              ? [
                { at: inp.playerX, scores: true },
                { at: inp.playerX + forkSign * FORK_LEAD_PX * SUBS, scores: false },
              ]
              : [{ at: inp.playerX, scores: true }];
            for (const aim of aims) {
              w.projectiles.push({
                id: w.nextProjectileId++, kind: "chalk", x: x0, y: y0,
                vx: Math.round((aim.at - x0) / T),
                vy: Math.round((inp.playerY - y0 - (CHALK_GRAVITY * T * (T + 1)) / 2) / T),
                deflected: false, fromId: e.id, dead: false, age: 0, colour,
                scores: aim.scores,
              });
            }
            e.state = "throw";
            e.timer = 0;
          }
        } else if (e.state === "throw") {
          if (e.timer > THROW_TICKS) { e.state = "fly"; e.timer = 0; }
        }
        break;
      }
      default:
        break;
    }

    // ── contact: cross beings open ENCOUNTERS (never damage-kill) ──
    const hostile = ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm"].includes(e.role);
    if (hostile && !e.redeemed && inp.playerIframes === 0 && overlapsPlayer(e, inp)) {
      events.push({ type: "encounter", id: e.id, role: e.role, skin: e.skin });
    }
    // the fist SHOOS hostiles (turn + brief daze), never redeems (§3)
    if (hostile && fistHits(e, inp.fist)) {
      if (e.state !== "shooed") {
        e.state = "shooed"; e.timer = 0; e.dir = (e.dir * -1) as 1 | -1;
        // R3-6: the punch used to pass THROUGH with nothing but a toast to show
        // for it (11.45.43). Contact is now visible where it happens.
        events.push({ type: "puff", x: inp.fist?.x ?? e.x, y: inp.fist?.y ?? e.y, kind: "hit" });
        events.push({ type: "shooed", id: e.id });
      }
    }
    if (e.state === "shooed" && e.timer > 40) e.state = "patrol";
  }

  // ── projectiles ──
  // PK-R6 · E: shards are BORN here (a landed piece leaves one), so they are
  // collected and appended AFTER the sweep — a shard pushed into the array
  // mid-`for…of` would be stepped on the tick it was created and lose a frame
  // of its 1-second life to the throw that made it.
  const born: ProjectileState[] = [];

  // ── R5-W2 · H1 · THE OVER-REACH TALLY, COUNTED FROM BOTH ENDS ──────────────
  // Three spent pieces over-reach her and bring her down (doc 44 §4 ch01 C4:
  // „dodging N throws opens the counter-window").
  //
  // It used to be counted in ONE place — the landing branch — and that was a
  // dead end for the child who needs the most help. A six-year-old who freezes
  // is standing exactly where the chalk is aimed, so every piece hits and none
  // of them ever reached the boards. MEASURED on the real Sim in the shipped
  // arena: 53 throws, 53 hits, ZERO windows in 200 seconds, hp never moves —
  // chapter 1's boss could not be beaten by a child who stands still. The
  // i-frames the old comment relied on are 120 ticks against a throw cycle of
  // 210+, so they lapse between pieces and cannot carry the load.
  //
  // Being hit is still no shortcut: the hit raises a card that unties NOTHING
  // (sim.ts `encounter` says so in as many words), and only the WINDOW unties a
  // knot — which still has to be answered. Dodging stays strictly better, and
  // now costs a knockback and an interrupting card less.
  const tallyOverreach = (p: ProjectileState): void => {
    if (p.kind !== "chalk" || p.scores === false) return;
    const src = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
    if (src && !GUARDIAN_HELD_STATES.has(src.state)) src.dodges += 1;
  };

  for (const p of w.projectiles) {
    if (p.dead) continue;
    // ── PK-R6 · E · THE LINGERING SHARD (doc 44 §4 ch01 C4) ─────────────────
    // „chalk shards linger 1 s as floor hazards". It does not move, it cannot be
    // deflected, and it is NOT a dodge — the dodge was already paid for by the
    // piece that made it. What it is, is a reason not to stand where the last
    // throw landed, which is what turns dodging from a reflex into a place.
    if (p.kind === "shard") {
      p.age++;
      // R5-W2 · H1 (Teil 3): eine rutschende Scherbe fährt, bis die Bretter
      // aufhören. An einer Kistenwand zerbricht sie — sie kann also NIE ein
      // Podest erklimmen, und das ist genau die Zuflucht, die arena.md §3 dem
      // Podest zuschreibt (»Scherben-Zuflucht«).
      if (p.vx !== 0) {
        const ahead = p.x + p.vx;
        const still = groundAt(grid, ahead, p.y - SUBS);
        if (still === null || still !== p.y) {
          p.dead = true;
          events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
          continue;
        }
        p.x = ahead;
      }
      if (p.age > SHARD_TICKS) {
        p.dead = true;
        events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
      } else if (
        inp.playerIframes === 0
        && Math.abs(p.x - inp.playerX) / SUBS < SHARD_REACH_X_PX
        && Math.abs(p.y - inp.playerY) / SUBS < SHARD_REACH_Y_PX
      ) {
        p.dead = true;
        const src = w.entities.find((e) => e.id === p.fromId);
        events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "guardian", skin: src?.skin ?? "tafel" });
      }
      continue;
    }
    p.age++;
    // chalk floats on a long readable arc (the deflect window); blobs drop fast
    p.vy += p.kind === "chalk" ? CHALK_GRAVITY : Math.round(GRAVITY / 2);
    p.x += p.vx;
    p.y += p.vy;
    const g = groundAt(grid, p.x, p.y);
    // R3-4 · A MISS SHATTERS. Chalk that lands is dust, not a resting orb; a
    // deflected piece keeps its floor pass (it must fly home over the ground)
    // but only on a leash — past that it shatters too, so nothing lingers.
    if (g !== null && p.y >= g && !p.deflected) {
      p.dead = true;
      if (p.kind === "chalk") events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
      // ── PK-R6 · C2 · THE DODGE WINDOW (doc 44 §4 ch01: „dodging N throws
      // opens the counter-window") ──────────────────────────────────────────
      // A piece of chalk that reaches the floor is a piece the child got out of
      // the way of. Count it. This is the road into the fight that a chapter
      // with NO FIST has to have: the deflect path below still works and is
      // still the fast one, but it can no longer be the ONLY one, or ch01's
      // arena would be unwinnable the moment the fist moved to ch02.
      if (p.kind === "chalk") {
        // Counting only. WHEN the tally becomes a counter-window is the
        // guardian's own decision, taken in its machine above — by the time a
        // piece of chalk reaches the floor its thrower is already back on her
        // path, so opening the window from here would only ever interrupt a
        // telegraph the child had started reading.
        tallyOverreach(p);
        // …and it leaves its splinter on the boards (doc 44 §4 ch01 C4)
        // ── R5-W2 · H1 (Teil 3) · DER SCHWALL ───────────────────────────
        // Die Scherbe trug seit jeher ein `vx` und hat es nie benutzt. Am
        // letzten Knoten rutscht sie jetzt darauf über die Bretter, in der
        // Richtung, in die ihr Stück ohnehin flog — was landet, bleibt nicht
        // liegen, und Weggehen hört auf, die ganze Antwort zu sein.
        const src0 = w.entities.find((e) => e.id === p.fromId && e.role === "guardian");
        const skids = src0 !== undefined
          && knotIndex(src0.hp, GUARDIAN_SCRIPT[src0.tier].knots) >= SKID_FROM_KNOT;
        born.push({
          id: w.nextProjectileId++, kind: "shard", x: p.x, y: g,
          vx: skids ? Math.sign(p.vx) * SKID_SPEED : 0,
          vy: 0, deflected: false, fromId: p.fromId, dead: false, age: 0, colour: p.colour,
        });
      }
    }
    if (p.deflected && p.kind === "chalk" && p.age > CHALK_LIFE_TICKS) {
      p.dead = true;
      events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" });
    }
    if (Math.abs(p.x) / SUBS > 4096 || p.y / SUBS > 4096) p.dead = true;
    // deflect: the fist bats a chalk piece back (§6 the deflect law)
    if (!p.deflected && inp.fist?.active && Math.abs(p.x - inp.fist.x) / SUBS < 20 && Math.abs(p.y - 8 * SUBS - inp.fist.y) / SUBS < 26) {
      p.deflected = true;
      p.vx = -p.vx * 2;
      p.vy = -SUBS; // a flat, fast return — it must CROSS the thrower's window, not sail over it
      // events for juice
      (p as ProjectileState).deflected = true;
      eventsPushDeflect(events, p.id);
    }
    // a deflected chalk piece staggers its guardian
    if (p.deflected && p.kind === "chalk") {
      const g0 = w.entities.find((e) => e.id === p.fromId && e.role === "guardian" && !e.redeemed);
      if (g0 && Math.abs(p.x - g0.x) / SUBS < 30 && Math.abs(p.y - (g0.y - 20 * SUBS)) / SUBS < 40) {
        p.dead = true;
        events.push({ type: "puff", x: p.x, y: p.y, kind: "chalk" }); // it breaks ON the board
        // PK-R6 · E: `dip` joins the two states a deflect may not interrupt —
        // she is already on her way down to open a window, and a second one
        // opened on top of it would ask two cards for one over-reach.
        // R5-W4b · H3 (D-190): dieselbe Frage wie in `tallyOverreach`, also
        // dieselbe Liste — und die steht jetzt EINMAL da.
        if (!GUARDIAN_HELD_STATES.has(g0.state)) {
          g0.state = "stagger";
          g0.timer = 0;
          eventsPushStagger(events, g0.id);
        }
      }
    }
    // an undeflected projectile touching the player = encounter (no death).
    // PK-R6 · E: …once it is ARMED. See CHALK_ARM_TICKS — a piece that can bite
    // on the tick it is thrown makes its own telegraph a lie.
    if (!p.deflected && inp.playerIframes === 0 && (p.kind !== "chalk" || p.age > CHALK_ARM_TICKS) &&
      Math.abs(p.x - inp.playerX) / SUBS < 10 && Math.abs(p.y - (inp.playerY - 15 * SUBS)) / SUBS < 16) {
      p.dead = true;
      // the piece is SPENT — it broke on the child instead of on the boards, and
      // it counts the same (see tallyOverreach). No splinter: it never reached
      // the floor, so there is nothing lying there to step on afterwards.
      tallyOverreach(p);
      const src = w.entities.find((e) => e.id === p.fromId);
      events.push({ type: "encounter", id: p.fromId, role: src?.role ?? "gunner", skin: src?.skin ?? p.kind });
    }
  }
  w.projectiles = w.projectiles.filter((p) => !p.dead);
  for (const s of born) w.projectiles.push(s);

  return events;
};

const eventsPushDeflect = (events: EntityEvent[], id: number): void => { events.push({ type: "projectileDeflected", id }); };
const eventsPushStagger = (events: EntityEvent[], id: string): void => { events.push({ type: "guardianStagger", id }); };

/**
 * The scene calls this when the counter-window task is SOLVED.
 *
 * ── R5-W4 · H2 · WAS SICH GEÄNDERT HAT (Ruling R50) ─────────────────────────
 * Bis hierher WAR die gelöste Karte der Sieg über eine Stufe: `hp` fiel in
 * derselben Zeile, und die Tafel stieg sofort wieder auf. Koki hat daraus zwei
 * Handlungen gemacht — „die Aufgaben werden getriggert, und wenn sie unten ist
 * und man zu ihr geht, wird gelöscht" — und deshalb tut diese Funktion jetzt
 * genau eine Sache: sie setzt die Tafel auf die Bretter.
 *
 * `hp` bleibt UNBERÜHRT. Es fällt an genau einer Stelle im ganzen Paket, und
 * das ist das Ende des Wischens (`stepEntities`, Zustand `wipe`). Das ist kein
 * Umzug aus Geschmack: solange zwei Stellen `hp` senken könnten, wäre „die
 * Karte zählt nur mit dem Wischen" eine Behauptung über Reihenfolgen statt
 * eine Eigenschaft der Maschine — und die Wartezeit, die eine Karte verfallen
 * lässt, hätte einen zweiten, stillen Weg an sich vorbei.
 *
 * Sie gibt deshalb auch KEIN Ereignis mehr zurück: es gibt an dieser Stelle
 * nichts zu vermelden. Der Toast und der Sieg gehören dem Wischen.
 */
export const guardianKnotSolved = (w: EntityWorld, id: string): EntityEvent[] => {
  const g = w.entities.find((e) => e.id === id && e.role === "guardian");
  if (!g || g.redeemed) return [];
  // PK-R6 · E · doc 44 §4 ch01 C4 („she sinks to the ground"), jetzt zweimal
  // gebraucht: einmal als Pause im Kampf, einmal als sein Ende. Sie hat für das
  // Fenster ohnehin schon tief gedippt, das ist also ein kurzer Fall.
  g.state = "settle";
  g.timer = 0;
  g.dodges = 0;
  return [];
};

// ── PK-R6 · D · THE REAWAKENING MACHINE (doc 44 §3.3) ────────────────────────
// Deliberately NOT a new card machine. A reawakening is six ORDINARY cards in a
// row — the boss's knot battery is already exactly that shape (one world event
// per window, the world counting the rounds, `guardianKnotSolved` advancing it)
// and it is the shape that keeps the ceremony inside the shipped card kit
// instead of forking it. So this is the classmate's `guardianKnotSolved`: the
// world's counter, and nothing else.
//
// The one thing it does that no other redemption does is END IN STAGES. Every
// other being is drained or restored; she comes back by degrees, which is why
// the step is a number the renderer can read (anim.awakenWash) rather than a
// boolean the renderer can only wait for.

/** Which classmate stepped out of THIS cage, or null. The pointer runs from
 *  the person to the cage (EntityParams.cage), so a burst cage can find her —
 *  the `classmate-pair` level law proves the pointer exists before ship. */
export const classmateOfCage = (w: EntityWorld, cageId: string): EntityState | null =>
  w.entities.find((e) => e.role === "classmate" && e.params?.cage === cageId) ?? null;

/** One round of the reawakening is answered: she regains a degree. Returns
 *  `true` when THAT WAS THE LAST ONE — the caller (sim.solveTask) then plays the
 *  colour flood, the settle, the joy lap and counts the cage freed. */
export const awakenClassmate = (w: EntityWorld, id: string): boolean => {
  const e = w.entities.find((x) => x.id === id && x.role === "classmate");
  if (!e || e.redeemed) return false;
  e.awakenStep = Math.min(e.awakenStep + 1, AWAKEN_ROUNDS);
  e.timer = 0;
  if (e.awakenStep < AWAKEN_ROUNDS) {
    // between rounds she drops back to the caged cell: the spell has loosened
    // by one degree (the wash says so) but she is not acting anything out until
    // the next round's pose is set — a figure frozen in the LAST wrong action
    // while the world runs would read as the answer not having landed.
    e.state = "caged";
    return false;
  }
  e.redeemed = true;
  e.state = "settle";
  e.freedTick = 0; // the flood starts HERE, on its own clock (see freedTick)
  return true;
};

/** Bring a classmate all the way home without playing the rounds — the phase
 *  REMOUNT path (a chapter's Kleckskammer round trip rebuilds the Sim). Her
 *  cage is remembered in `freedCageIds`; she has to be remembered with it, or a
 *  child who buys Klecks' door after freeing her comes back to a friend sitting
 *  grey in a cage they already opened. */
export const restoreFreedClassmate = (e: EntityState, floodTicks = 0): void => {
  e.hidden = false;
  e.redeemed = true;
  e.awakenStep = AWAKEN_ROUNDS;
  e.state = "rest";
  e.timer = 0;
  // PK-R6 · H1: her flood clock starts PAST the flood, not at 0. A remounted
  // phase used to re-play the last degree of the spell letting go — a friend the
  // child freed ten minutes ago fading back in as if it were happening now.
  // Harmless while that degree was 0.12, and a lie the moment the flood became
  // the ceremony's payoff (0.40). Same rule as the once-per-freeing flourish: a
  // beat marks a CHANGE, and nothing changed here.
  //
  // The length is PASSED rather than imported: the flood belongs to the
  // renderer's wash grammar (anim.COLOUR_FLOOD_TICKS) and this file is what
  // that grammar reads FROM, so importing it back would close a module cycle
  // whose evaluation order the top-level constants here would then depend on.
  // The sim hands it in; `awakening.test.ts` pins that it hands in the real one.
  e.freedTick = Math.max(floodTicks, 0);
};

/** Redeem after a solved encounter task. R3-5: cross → JOY → settled at home,
 *  never "out of play" — the friend you made stays on the page. */
export const redeemEntity = (w: EntityWorld, id: string): void => {
  const e = w.entities.find((x) => x.id === id);
  if (!e) return;
  e.redeemed = true;
  e.timer = 0;
  e.freedTick = 0;
  e.state = JOY_ROLES.has(e.role) ? "joy" : "dazed";
};

/** Fire link actions when a trigger event lands (spawn/open/reveal → unhide). */
export const applyLinks = (w: EntityWorld, on: LinkSpec["on"], triggerId: string): string[] => {
  const revealed: string[] = [];
  for (const l of w.links) {
    if (l.trigger !== triggerId || l.on !== on) continue;
    for (const t of l.targets) {
      const e = w.entities.find((x) => x.id === t);
      if (e && e.hidden) { e.hidden = false; revealed.push(t); }
    }
  }
  return revealed;
};

/** G3 ride contract, scene-side helper: should the player attach to this platform? */
export const rideAttachCheck = (
  e: EntityState,
  playerFeetSubs: number,
  playerXSubs: number,
  playerVySubs: number,
): boolean => {
  if (!e.role.startsWith("platform")) return false;
  if (e.state === "gone") return false;
  const tolPx = Math.max(Math.abs(playerVySubs) / SUBS + 2, 4); // G3 verbatim
  const topPx = (e.y - 6 * SUBS) / SUBS;
  const dx = Math.abs(e.x - playerXSubs) / SUBS;
  return dx <= 20 && playerVySubs >= 0 && Math.abs(playerFeetSubs / SUBS - topPx) <= tolPx;
};
