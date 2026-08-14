// THE PAINTED BOOK — deterministic sheet-frame selection (the proven game-2d
// pattern): frames advance on accumulated WALK TIME / entity ticks, never on
// wall-clock, so manual-step harness runs and real RAF agree exactly.

/** Current frame index for a cycling sheet. */
export const sheetFrame = (ticks: number, frameCount: number, ticksPerFrame: number): number =>
  frameCount <= 1 ? 0 : Math.floor(ticks / Math.max(ticksPerFrame, 1)) % frameCount;

/** doc 40 §2 · THE IDLE CYCLE stays 400 ms however many cells the art spends on
 *  it — 2 cells dwell 12 t each, 4 cells dwell 6 t (10 fps). Keeping the CYCLE
 *  constant and dividing it is what lets a richer idle sheet drop in without
 *  re-timing the world. */
export const IDLE_CYCLE_TICKS = 24;

/** The entity idle bob. `frameCount` is the number of painted idle cells the
 *  skin actually has (doc 40 §4's `bobFrame(frameCount)` upgrade). */
export const bobFrame = (ticks: number, frameCount = 2, ticksPerFrame = Math.max(1, Math.round(IDLE_CYCLE_TICKS / frameCount))): number =>
  sheetFrame(ticks, frameCount, ticksPerFrame);

/** Idle cell names in index order — `_a _b _c _d` (doc 40 §3's stem grammar). */
const IDLE_CELLS = ["a", "b", "c", "d"] as const;

// ── W4 · the entity POSE hook (batch AC's motion cells) ────────────────────
// Which sheet cell an entity shows this tick. Pure and Phaser-free so it is
// unit-testable on its own; PaintScene.entStateCell simply delegates here.
//
// The four motion poses are ADDITIVE by construction: when a `_run`/`_squash`/
// `_stomp`/`_bank` stem is absent, entTex's untouched fallback chain
// (pb-<skin>_<state> → pb-<skin>_a → fb-ent-<skin>) lands on the idle cell, so
// a missing stem can never break a render — the only-present law.
//
// Every threshold is DERIVED from the sim constant it depicts (imported, never
// re-typed), so a tuning change to the sim moves the pose with it.

import { AWAKEN_ROUNDS, BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX, JOY_ROLES } from "./entities.ts";
import { hash01 } from "./mass.ts";
import { SUBS } from "./paint.ts";

// ── PK-R3b · R3-15 · THE DESATURATION GRAMMAR (doc 41 §2) ────────────────────
// OSWIN rained the colour out of the beings he bewitched, so a being you have
// not yet befriended renders GREY-WASHED and floods back to full colour the
// moment it is redeemed. That flood is the `restore` card's payoff made
// visible — the child's answer changes the picture, which is the whole reason
// the mechanic is worth a new task kind.
//
// It costs NO new art: the wash is a grey copy of the being's own sheet laid
// over it at this alpha, so every existing and future skin is covered by
// construction. (Phaser's `setTint` multiplies, which darkens rather than
// desaturates — an overlay is what actually drains colour.)
//
// ── PK-R6 · H1 · WHAT „A GREY COPY" HAD TO MEAN (round-1 critique, findings 1
// and 2: „the school bag is already full brown before AND after", „Merle's
// portrait shows zero visible progression"). Both were ONE defect, and the
// paragraph above already named it without noticing: the overlay WAS built by
// calling `setTint` on a copy of the being's own coloured sheet — which is a
// multiply, so the copy kept every hue it was supposed to be draining and only
// darkened it. Measured on the shipped frames: the drained bag carried 0.371
// mean chroma against 0.440 restored (a brown bag either way), and Merle went
// 0.252 → 0.259 across half her ceremony, i.e. nothing.
//
// The wash is now a REAL greyscale copy — the being's own cell with every pixel
// replaced by its luminance and its alpha untouched (`greyLuma` below, baked
// into a texture by the scene). Laid over the original at alpha `a`, that
// composites to exactly `(1-a)·colour + a·luma`, which IS the CSS
// `grayscale(a)` the card's own portrait applies. One transform, two surfaces:
// the face in the card and the being in the world are drained by the same
// arithmetic rather than by two lookalike recipes free to drift.

/** How much grey sits over an un-redeemed being. Enough that „the colour is
 *  gone" reads at 24 px, little enough that its SHAPE still names it — step 1
 *  of a restore card must stay answerable by looking. */
export const WASH_ALPHA = 0.72;

/** PK-R6 · H1 · how long a burst cage throws itself open, in ticks (≈270 ms at
 *  the 60 Hz contract). ONE number, now with three readers: the renderer shapes
 *  the pop from it (PaintScene.cagePopT), the sim keeps the world running for
 *  exactly that long after a burst (Sim.holdTicks), and stepRedeemed retires the
 *  burst into the resting `open` state when the beat has played (R5-A8) — which
 *  is why it now lives in entities.ts, where that transition runs. */
export { CAGE_OPEN_TICKS } from "./entities.ts";

/** THE LUMINANCE a drained pixel keeps, Rec. 709 — the same coefficients the
 *  CSS `grayscale()` filter matrix uses, which is the whole point: the world's
 *  wash and the card portrait's filter must be the same transform, not two
 *  transforms that happen to look alike. Pure and exported so „the world greys
 *  exactly like the card" is a table rather than a screenshot. */
export const greyLuma = (r: number, g: number, b: number): number =>
  Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

/** How long the colour takes to flood back in, in ticks (≈0.6 s at 60 Hz) —
 *  comfortably inside the joy lap (JOY_TICKS), so the flood and the
 *  Freudenrunde are one beat rather than two. */
export const COLOUR_FLOOD_TICKS = 36;

/** Which beings OSWIN's rain reached. The creatures, plus the CAGES: a knotted
 *  school bag is a redeemable being too, and two of ch01's restore cards are
 *  about exactly those bags — a card that says „ganz grau geworden" over a
 *  full-colour satchel would be the same lie R3-12 took off the boss.
 *
 *  PK-R6 · C1: and the DRAINED objects, which is the role the whole grammar
 *  was built for — ch01's field is now the grey classroom spread across the
 *  level, and „grey until you name it" is what makes it read as bewitched
 *  rather than as scenery. Doors, grants and platforms are furniture and were
 *  never drained.
 *
 *  PK-R6 · D: and the CLASSMATE, the one being the wash leaves in STAGES
 *  (awakenWash below) instead of all at once. doc 44 §3.3 asks for exactly
 *  this — „the classmate regains one degree of motion/colour" per round — and
 *  it costs no new grammar, only a step count where a boolean used to be. */
export const WASHED_ROLES = new Set<string>([...JOY_ROLES, "cage", "drained", "classmate"]);

// ── PK-R6 · D · THE SIX DEGREES (doc 44 §3.3) ────────────────────────────────
/** How grey a classmate is before her first round: COMPLETELY. doc 44 §3.3's
 *  own word for her is „ghost-pale", and with a real greyscale wash (above)
 *  that is a value the picture can actually hold — she stands in the world as
 *  the pencil sketch of herself, which is what makes the six rounds a thing to
 *  watch rather than a counter to read. The general grammar's 0.72 is unchanged
 *  for every other drained being: a desk still has to be nameable by looking,
 *  and a person under a full spell is the one being whose whole ceremony is
 *  about getting her colour back. */
export const GHOST_WASH = 1;
/** How much of the spell the LAST round takes off, all at once. doc 44 §3.3
 *  distinguishes its two payments in one sentence — „the classmate regains one
 *  degree … final round → full colour" — and the shipped ladder paid all six in
 *  identical degrees, so the sixth answer moved her 0.12 and the ceremony card
 *  („Die Farbe strömt zurück") narrated a change nobody could see (round-1
 *  critique, finding 5). This is the flood that sentence promises, and it is
 *  the biggest single change in the ceremony by construction. */
export const AWAKEN_FLOOD_WASH = 0.4;
/** What each of the EARLIER rounds takes — the rest of the spell divided into
 *  equal degrees. Equal, not a curve: the rounds are equal work for the child,
 *  so a curve would pay two identical answers differently and the picture would
 *  stop being a progress bar they can read. */
export const AWAKEN_STEP_WASH = (GHOST_WASH - AWAKEN_FLOOD_WASH) / Math.max(AWAKEN_ROUNDS - 1, 1);

/** How grey a classmate still is after `step` of `rounds` rounds: the ghost
 *  walked down one equal degree per answer to the flood floor, and 0 once every
 *  round is in. Pure and exported so the stepping is unit-testable without a
 *  scene — the claim „she visibly lightens each round, and the last round is a
 *  flood" is then a table, not a screenshot. */
export const awakenWash = (step: number, rounds: number = AWAKEN_ROUNDS): number => {
  const s = Math.min(Math.max(step, 0), rounds);
  if (s >= rounds) return 0; // every round in: she is in full colour
  const stepWash = (GHOST_WASH - AWAKEN_FLOOD_WASH) / Math.max(rounds - 1, 1);
  return GHOST_WASH - stepWash * s;
};

/** How opaque the grey wash over this being is right now, 0 … GHOST_WASH.
 *  Pure: `freedTick` is the sim's own counter, which every redemption path
 *  resets to 0 at the moment of freeing, so the flood starts exactly when the
 *  card is answered. Under reduced motion a redeemed being is simply already in
 *  colour — the end-states law, applied to the world instead of to CSS. */
export const washAlphaFor = (
  e: { role: string; redeemed: boolean; timer: number; awakenStep?: number; freedTick?: number },
  reducedMotion = false,
): number => {
  if (!WASHED_ROLES.has(e.role)) return 0; // furniture was never drained
  // PK-R6 · D: a classmate is drained BY DEGREES. Un-redeemed she stands at the
  // degree her rounds have earned (an instant step per round — the world is
  // frozen for the card, so a fade nobody's clock is running would be a change
  // the child never sees); redeemed, the flood animates the LAST degree away,
  // which is the sixth round's payoff and the same choreography every restored
  // being gets.
  const full = e.role === "classmate" ? awakenWash(Math.max((e.awakenStep ?? 0) - (e.redeemed ? 1 : 0), 0)) : WASH_ALPHA;
  if (!e.redeemed) return full;
  if (reducedMotion) return 0;
  return full * (1 - floodT(e));
};

/** How far through its colour flood a freed being is, 0…1.
 *
 *  PK-R6 · H1 · IT READS `freedTick`, NOT `timer` (entities.freedTick). The
 *  flood used to ride the state timer, which every transition resets — so a
 *  freed moth re-drained when its joy lap ended and a freed classmate went grey
 *  again at every wave, for the rest of the chapter. `timer` remains the
 *  fallback for the plain `{role, redeemed, timer}` shapes the pure tests and
 *  the card layer hand in, so nothing that only knows about a timer breaks. */
const floodT = (e: { timer: number; freedTick?: number }): number =>
  Math.min(Math.max(e.freedTick ?? e.timer, 0), COLOUR_FLOOD_TICKS) / COLOUR_FLOOD_TICKS;

// ── PK-R6 · H1 · THE COLOUR ARRIVING (round-1 critique, finding 8) ───────────
// „The world-change colour shift on the bag (brown to olive) is too subtle to
// register at a glance." Measured against the grammar above, that is fair: the
// change is a 0.72 grey letting go over 36 ticks, which is a real change across
// the beat and a SMALL one in any single frame — and a single frame is all a
// screenshot gets, and roughly all a six-year-old gives it while the card is
// still leaving.
//
// So the flood carries a LIGHT with it: a warm copy of the being's own sheet,
// laid over it additively, brightest exactly as the grey lets go and gone well
// before the flood ends. The colour is still the payoff; the light is what makes
// the payoff impossible to miss in the frame it happens.
//
// Derived from the SAME timer as the wash, so the two can never disagree about
// when the change is happening, and pure so the claim „the light peaks early and
// is gone by the end" is a table rather than a screenshot.

/** How bright the arriving-colour light gets at its peak (0…1 alpha). */
export const FLOOD_BLOOM_PEAK = 0.5;
/** Where in the flood that peak sits — early, so the light announces the change
 *  rather than trailing it. */
export const FLOOD_BLOOM_PEAK_AT = 0.22;

/** The arriving-colour light's alpha right now, 0 when there is no change to
 *  announce. Reduced motion returns 0: that child's being is ALREADY in full
 *  colour (washAlphaFor short-circuits), so a flash would announce a change
 *  that already happened — the end-states law applied to the world. */
export const floodBloomFor = (
  e: { role: string; redeemed: boolean; timer: number; freedTick?: number },
  reducedMotion = false,
): number => {
  if (reducedMotion || !e.redeemed || !WASHED_ROLES.has(e.role)) return 0;
  const t = floodT(e);
  const shape = t <= FLOOD_BLOOM_PEAK_AT
    ? t / FLOOD_BLOOM_PEAK_AT
    : Math.max(0, 1 - (t - FLOOD_BLOOM_PEAK_AT) / (1 - FLOOD_BLOOM_PEAK_AT));
  return FLOOD_BLOOM_PEAK * shape;
};

// ── PK-R6 · H2 · THE RESTORE SPARKLE (round-2 finding 5) ────────────────────
// „The ‚shine' cue is two soft-edged flat white ellipses overlapping the
// leather, with no radiating rays or sparkle flecks."
//
// Measured against the code, the ONE light this beat owns is `floodBloomFor`
// above: an ADD-blended copy of the being's own cell, already amber-tinted at
// creation. ADD still walks a bright pixel toward 255 in every channel, so the
// satchel's two brass buckle plates — its brightest paint by a wide margin —
// clip to near-white soft ovals at the bloom's peak while the leather around
// them only warms. That is the pair of ellipses, and it is what „a light" looks
// like when nothing else in the frame says light: no rays, no flecks, nothing
// with a direction.
//
// The bloom is left exactly as it is (it is the reason the colour change reads
// at all — H1's finding 8). What it gains is a COMPANY: a gilded flourish that
// out-lives it, so the frame after the flood still shows sparks travelling
// outward rather than a flat patch sitting still. Its length is here, with the
// flood's own numbers, so the claim „the sparkle is still going when the colour
// has landed" is arithmetic rather than a screenshot.

/** How long the freeing sparkle lasts, in ms. Longer than the flood itself
 *  (COLOUR_FLOOD_TICKS ≈ 600 ms) on purpose: the payoff frame a still capture
 *  lands on is usually the one AFTER the colour arrived. */
export const RESTORE_SPARKLE_MS = 1050;

// ── PK-R6 · H2 · THE ROOM ANSWERS (round-2 finding 3) ────────────────────────
// „06-merle-round4-midwash, 07-merle-final-flood and 08-merle-joy-open-cage
// share the same dim navy-purple room, the same lighting, and no added
// glow/particle/bloom layer — flipping between the labeled ‚midwash' and ‚final
// flood' frames shows no discernible difference in intensity."
//
// Measured against the grammar above the charge is exactly right, and the cause
// is that every light this ceremony owns is drawn ON A BEING. `floodBloomFor` is
// a copy of Merle's own 30-px silhouette: against a whole night classroom that
// is a change roughly 3 % of the frame wide, and the frames before and after it
// are therefore the same picture. The sixth answer is the moment six rounds of
// work pay off — it has to be the moment the ROOM changes, not the moment one
// small figure does.
//
// So the flood carries a light that belongs to the room: a warm bloom centred on
// her that sweeps outward past the frame, over a wash that warms the whole
// palette for as long as it lasts. It fires ONCE per reawakening, on the sixth
// answer only — a beat marks a change, and the five rounds before it are
// progress, not payoff.
//
// Pure and exported so „the payoff frame is brighter than the progress frame"
// is a table rather than a screenshot.

/** How long the room's own light lasts, in ms. Long enough to still be lit when
 *  the restore-hold hands the world back (RESTORE_HOLD_MS ≈ 900) and the joy lap
 *  starts, so the two frames a critic flips between are both inside it. */
export const AWAKEN_ROOM_MS = 1500;
/** How fast it arrives. Fast: light from a spell breaking is a snap, not a fade
 *  in — and a slow rise would put the peak after the frame that names it. */
export const AWAKEN_ROOM_RISE_MS = 110;
/** How strong the room's light gets over the whole frame at its peak (0…1). */
export const AWAKEN_ROOM_PEAK = 0.62;

/** The room light's strength at `ms` after the sixth answer, 0…AWAKEN_ROOM_PEAK.
 *  Snap up, then a long soft fall — the shape a light has when something opens
 *  and the room keeps glowing after. */
export const awakenRoomBloom = (ms: number): number => {
  if (!(ms >= 0) || ms >= AWAKEN_ROOM_MS) return 0;
  if (ms <= AWAKEN_ROOM_RISE_MS) return AWAKEN_ROOM_PEAK * (ms / AWAKEN_ROOM_RISE_MS);
  const u = (ms - AWAKEN_ROOM_RISE_MS) / (AWAKEN_ROOM_MS - AWAKEN_ROOM_RISE_MS);
  return AWAKEN_ROOM_PEAK * (1 - u) ** 1.6;
};

/** How far the bloom's own front has swept from her, as a multiple of its start
 *  radius. The sweep is what makes it a light crossing the room rather than a
 *  lamp switching on — and it keeps travelling after the peak, so the late frame
 *  is a WIDER glow rather than a dimmer copy of the early one. */
export const awakenRoomSweep = (ms: number): number => {
  const t = Math.min(Math.max(ms, 0), AWAKEN_ROOM_MS) / AWAKEN_ROOM_MS;
  return 1 + 2.6 * (1 - (1 - t) ** 2);
};

/** Half the patrol speed: a chaser's vx is ±ENEMY_WALK while walking and 0 at
 *  an edge turn, so this cleanly separates "striding" from "stopped". */
export const RUN_VX = ENEMY_WALK / 2;
// ── R5-W1 · F1 · DER RADIERER HÖRT AUF ZU BLITZEN (Kokis Replay, 07:25:36) ───
// Der alte Schalter war `|vy| >= BOUNCE_UP * 0.8`. Gemessen an der echten
// Simulation traf das GENAU EINEN Tick pro Hüpfer — den Aufprall — und fiel
// danach hart auf den Ruhe-Bob zurück: ein 17-ms-Blitz, zehnmal pro Sekunde.
// Deshalb las es sich als „buggy beim Umschalten"; die Verankerung war richtig,
// die Verweildauer war es nicht.
//
// Zwei Antworten, und die wichtigere ist die zweite:
//  · die Zelle bleibt jetzt SQUASH_DWELL_TICKS lang liegen, gezählt ab dem
//    Kontakt selbst (`bounceTick`), statt an einer Geschwindigkeitsschwelle zu
//    hängen, die der Bogen zweimal streift;
//  · und zwischen den Zellen verformt sich der Körper KONTINUIERLICH — breit
//    und flach im Aufprall, schmal und lang im Flug. Damit gibt es überhaupt
//    keinen harten Schnitt mehr zu sehen, ohne dass eine einzige neue Zelle
//    gemalt werden müsste. Der Rand-Ursprung sitzt unten mittig, also bleiben
//    die Füße beim Quetschen am Boden — die Voraussetzung dafür, dass es wie
//    Gewicht aussieht und nicht wie Zoomen.
/** Wie lange die Aufprall-Zelle/-Verformung nach der Berührung steht. Drei
 *  Ticks (50 ms) auf einen 13-Tick-Hüpfer: kurz genug, dass der Körper den
 *  größten Teil des Bogens neutral fliegt, lang genug, dass ein Auge es sieht —
 *  ein Tick ist ein Blitz, das war der Defekt. */
export const SQUASH_DWELL_TICKS = 3;
/** Wie flach der Aufprall drückt und wie breit er dabei wird. Nicht
 *  volumentreu (0,28 ≠ 0,22) und mit Absicht: ein Radiergummi ist ein
 *  Gummiklotz, kein Ballon. */
export const SQUASH_FLAT = 0.28;
export const SQUASH_WIDE = 0.22;
/** Die Gegenbewegung im Flug — etwa halb so stark: ein Aufprall verformt mehr
 *  als eine Flugbahn. */
export const STRETCH_TALL = 0.16;
export const STRETCH_NARROW = 0.12;
/** Ab wann eine (später gemalte) Streck-Zelle gezeigt würde. */
export const STRETCH_CELL_MIN = 0.35;

/** Nicht-uniforme Skalierung eines Hüpfers in diesem Tick; {1,1} für einen
 *  ruhenden Körper. Rein, deterministisch, aus der Kontakt-Uhr und der eigenen
 *  Geschwindigkeit — nie aus der Wanduhr.
 *  (Die alte Schwelle SQUASH_VY ist damit pensioniert: sie beschrieb einen
 *  Bogen, den die Simulation nie gezeichnet hat.) */
export interface Squash { sx: number; sy: number }
export const REST_SQUASH: Squash = { sx: 1, sy: 1 };

/** Wie „gestreckt" der Körper gerade fliegt, 0…1 (0 im Aufprall und im
 *  Scheitel, 1 im schnellsten Teil des Bogens). */
export const bounceStretch = (bounceTick: number, vy: number): number => {
  const impact = Math.max(0, 1 - bounceTick / SQUASH_DWELL_TICKS);
  return Math.min(1, Math.abs(vy) / BOUNCE_UP) * (1 - impact);
};

export const bouncerSquash = (bounceTick: number, vy: number, reducedMotion = false): Squash => {
  if (reducedMotion) return REST_SQUASH;
  const impact = Math.max(0, 1 - bounceTick / SQUASH_DWELL_TICKS);
  const stretch = bounceStretch(bounceTick, vy);
  return {
    sx: 1 + SQUASH_WIDE * impact - STRETCH_NARROW * stretch,
    sy: 1 - SQUASH_FLAT * impact + STRETCH_TALL * stretch,
  };
};

// ── R5-W1 · F1 · DER KÄFIG WACKELT SICHTBAR (Kokis Replay, 07:26:32) ─────────
// „bewegt sich nicht deutlich." Das Wackeln existierte bereits — ±0,07 rad,
// gedreht um den unteren Mittelpunkt eines 22-px-Körpers. Das sind 1,5 logische
// Pixel Ausschlag an der Oberkante. Es war nicht kaputt, es war zu klein.
//
// Drei Entscheidungen dahinter:
//  · Der Ausschlag wird in PIXELN angegeben, nicht in Radiant. Ein Käfig mit
//    einem Kind darin ist 34 px hoch, ein Ranzen 22 — bei festem Winkel wackelt
//    der große automatisch 1,5-mal weiter. Was das Auge liest, ist der Weg.
//  · Kein Metronom-Sinus, sondern eine ABKLINGENDE STOSS-FOLGE: jemand stemmt
//    sich gegen die Wand, dann setzt es sich. Das Auge wird von Veränderung
//    angezogen, nicht von gleichmäßigem Schwingen — und ein sauberer Sinus
//    liest sich als Maschine, nicht als Gefangener.
//  · Die Silhouette verformt sich mit (Bulge) und der Korpus hebt kurz ab. Bei
//    22 px liest eine Silhouetten-Änderung deutlich besser als eine Verschiebung.
/** Ausschlag der Oberkante bei vollem Stemmen, in logischen px (×3 auf dem
 *  Schirm). 3,7 sind ~2,4-mal der alte Wert und bleiben unter der Grenze, ab
 *  der ein unten gelagerter Kasten anfängt, UMZUKIPPEN statt zu wackeln. */
export const CAGE_SWAY_PX = 3.7;
/** Ein Stemmen alle 84 Ticks (1,4 s) — ein Körper, der Anlauf nimmt. */
export const CAGE_STRUGGLE_TICKS = 84;
/** …das über 40 Ticks quadratisch abklingt: Ruck, dann setzen. */
export const CAGE_SETTLE_TICKS = 40;
/** Eine Schwingung pro 11 Ticks — schnell genug für einen Ruck, langsam genug,
 *  dass ein 60-Hz-Bild mitten im Ausschlag landet. */
export const CAGE_ROCK_TICKS = 11;
/** Nah am Kind hört das Rütteln nie ganz auf (Anteil des vollen Ausschlags). */
export const CAGE_NEAR_FLOOR = 0.42;
/** …und aus der Ferne bleibt es sichtbar, wenn man hinsieht. */
export const CAGE_FAR_SCALE = 0.45;
/** Silhouetten-Verformung und Hub auf dem stärksten Ruck. */
export const CAGE_BULGE = 0.09;
export const CAGE_HOP_PX = 1.0;
/** Der Grundton: der Käfig ist nie ein totes Möbelstück. */
export const CAGE_BREATH_RAD = 0.03;
/** Reduzierte Bewegung: eine RUHENDE, angespannte Schräglage. „Hier ist jemand
 *  drin" ist eine Tatsache über den Käfig, kein Bewegungseffekt — ein Kind, das
 *  Animationen abgeschaltet hat, darf die Aussage nicht verlieren. */
export const CAGE_REST_RAD = 0.045;
/** Reichweite des „nah", und über wie viele px es einblendet (statt zu
 *  schnappen — ein hartes Umschalten wäre selbst ein sichtbarer Fehler). */
export const CAGE_NEAR_PX = 42;
export const CAGE_NEAR_FADE_PX = 16;

/** Der Zufalls-Same EINES Wesens, aus seinem eigenen Namen. Er stand dreimal
 *  wörtlich in PaintScene (Cue-Waver, Feind-Rand, jetzt das Käfig-Rütteln) —
 *  drei Kopien einer Formel sind drei Gelegenheiten, sie unterschiedlich zu
 *  ändern. Deterministisch, weil der Name es ist. */
export const entSeed = (id: string): number =>
  id.length * 37 + (id.charCodeAt(0) | 0) * 7 + (id.charCodeAt(id.length - 1) | 0);

export interface CageBreath { rot: number; sx: number; sy: number; dy: number }
export const CAGE_AT_REST: CageBreath = { rot: 0, sx: 1, sy: 1, dy: 0 };

/** 0…1 — wie nah das Kind am Käfig steht, als Rampe statt als Schalter. */
export const cageNearT = (dxPx: number, dyPx: number): number => {
  const d = Math.max(Math.abs(dxPx), Math.abs(dyPx) * (CAGE_NEAR_PX / 40));
  return Math.max(0, Math.min(1, (CAGE_NEAR_PX - d) / CAGE_NEAR_FADE_PX));
};

/**
 * Wie ein Gefangener seinen Behälter in diesem Tick bewegt. Rein, damit „der
 * Käfig wackelt sichtbar" eine Tabelle ist und kein Screenshot.
 *
 * `heightPx` ist die gezeichnete Höhe DIESES Käfigs — daraus wird der Winkel
 * zurückgerechnet, damit der Ausschlag in Pixeln stimmt statt im Winkel.
 */
export const cageBreath = (
  tick: number,
  seed: number,
  nearT: number,
  heightPx: number,
  reducedMotion = false,
): CageBreath => {
  if (reducedMotion) return { ...CAGE_AT_REST, rot: CAGE_REST_RAD };
  // jeder Käfig stemmt sich zu seiner eigenen Zeit — zwei im selben Raum im
  // Gleichtakt wären genau die Maschine, die diese Kurve vermeiden soll
  const phase = Math.floor(hash01(seed) * CAGE_STRUGGLE_TICKS);
  const u = (tick + phase) % CAGE_STRUGGLE_TICKS;
  const decay = u < CAGE_SETTLE_TICKS ? (1 - u / CAGE_SETTLE_TICKS) ** 2 : 0;
  const env = Math.max(decay, nearT * CAGE_NEAR_FLOOR);
  const rock = Math.sin((u / CAGE_ROCK_TICKS) * Math.PI * 2) * env;
  const ampPx = CAGE_SWAY_PX * (CAGE_FAR_SCALE + (1 - CAGE_FAR_SCALE) * nearT);
  const h = Math.max(heightPx, 1);
  return {
    rot: Math.asin(Math.max(-1, Math.min(1, (ampPx * rock) / h)))
      + CAGE_BREATH_RAD * Math.sin(tick / 26),
    sx: 1 + CAGE_BULGE * Math.abs(rock),
    sy: 1 - CAGE_BULGE * 0.75 * Math.abs(rock),
    dy: -CAGE_HOP_PX * Math.max(0, rock),
  };
};
/** Near the extremes of the flyer's sweep, where it rolls into the turn — the
 *  art shows the whole body banked over, which is a turn, not a straight run. */
export const BANK_X = FLYER_SWEEP_PX * SUBS * 0.8;

// ── PK-R6 · E · THE FLIGHT RIG vs THE RETIRED EASEL (doc 44 §4 ch01 C4) ──────
// The Tafel was REPAINTED as a flying board (stage G's `tafel_flight` sheet:
// hover ×4, banks, spirals, windups, throw, lands, rest, win). Four stems from
// her older sheet survived on disk and still show the GROUNDED EASEL — a
// different body on legs. Any mid-air state that resolved to one of them would
// swap the boss's body in the middle of her own fight: that is the PB-F1
// identity defect, the one this rig exists to end.
//
// So the retired cells are NAMED here, and `guardian-flight.test.ts` drives the
// real FSM across every tier and every knot, collects every state it can
// actually reach, and fails if any of them lands in this set. The list cannot
// rot, because the machine itself supplies the states.
export const GUARDIAN_GROUNDED_CELLS: ReadonlySet<string> = new Set(["sad", "dazed", "stagger", "telegraph"]);

/** The landed cells of the FLIGHT sheet (`rest0`/`rest1` in the AM contract).
 *  Grounded is CORRECT here and only here: she is beaten and has come down. */
export const GUARDIAN_LANDED_CELLS: ReadonlySet<string> = new Set(["rest", "win"]);

// ── R5-W2 · H1 · HOW BIG SHE IS — one owner, because two owners drifted ──────
//
// These three lived privately inside PaintScene, which meant the visibility
// proof (`guardian-flight.test.ts`) could not import them. It carried its own
// copy of the first — `const GUARDIAN_DISPLAY_H = 52; // PaintScene.entTargetH`
// — against a shipped 68. So the one check that exists to prove her whole body
// stays on screen was proving a body 16 px shorter than the drawn one, and it
// never saw the crop that arithmetic below now measures (DEBT A6 / D-21).
//
// They sit in anim.ts and not in paint.ts because they describe the RIG, next
// to the cell sets and the pitch/roll grammar that read the same sheet; and
// anim.ts is Phaser-free, so the proof can import them.

/** Her drawn height in px, at her idle cell.
 *
 *  68 puts the board at roughly one and a half children while keeping her whole
 *  silhouette inside the room: her flight band tops out at world y 166, the
 *  arena's camera is pinned at y 96 (a 20-row world under a 14-row view), so 70
 *  is the ceiling — and the tallest cell on the sheet spends the rest, because
 *  every cell is scaled from the idle by its own proportions. */
export const GUARDIAN_DISPLAY_H = 68;

/** How far past the top of the view her drawing may be pushed back down, in px.
 *
 *  A framing clamp for the tallest cell at the top of her band, not a second
 *  camera — and 6 was not enough. Measured, not estimated: her tallest cell is
 *  `windup` at 440 px against the 397-px idle it is scaled from (1.108×), and
 *  it swells by `BOSS_BEAT_SWELL` at the top of the tell, so she draws 85.2 px
 *  where 68 was budgeted. At the very top of her band (knot 3, tick 0, feet at
 *  world y 166 — the same 166 the display height was chosen against) her head
 *  lands **15.16 px above** the arena camera's top edge at y 96.
 *
 *  16 is that number, rounded up: the smallest integer that satisfies the
 *  requirement the visibility proof now DERIVES from the PNGs and the shipped
 *  flight paths, rather than trusting anything written here. It is a real
 *  nudge — she is pushed down by up to 16 px when she flies highest — and that
 *  is a trade the frame review can see and overrule; the alternatives are a
 *  shorter body or a shallower band, both of which are bigger changes than a
 *  clamp doing the job its own name claims. */
export const GUARDIAN_KEEPIN_MAX = 16;

/** PK-R6 · H2 (round-2 finding 8: „boss scale-up on key attack beats"). How much
 *  bigger she gets at the top of a tell. Enough to be felt at a glance, small
 *  enough that it reads as her rearing rather than as a zoom. */
export const BOSS_BEAT_SWELL = 0.13;

/** Her banked pairs, left and right. These cells carry their OWN direction, so
 *  the renderer must not also mirror them — see `CELL_IS_DIRECTIONAL`. (`roll`
 *  is the sheet's `bank_l0`; stage G mapped it to the name the turn state was
 *  already resolving to.) */
const BANK_L = ["roll", "bank_l1"] as const;
const BANK_R = ["bank_r0", "bank_r1"] as const;
/** The barrel-roll cells she wears through a turn. */
const SPIRAL_CELLS = ["spiral0", "spiral1", "spiral2", "spiral3"] as const;
/** The sinking wobble: the two `land` cells, alternating. */
const LAND_CELLS = ["land0", "land1"] as const;

/** Cells whose art already faces a direction. `PaintScene` suppresses `flipX`
 *  for these — mirroring a right-bank cell would draw a left bank while the
 *  guardian flies right, which is the same „picture disagrees with the world"
 *  class the facing law (R3-4) was written for. */
export const CELL_IS_DIRECTIONAL = (cell: string): boolean =>
  (BANK_L as readonly string[]).includes(cell) || (BANK_R as readonly string[]).includes(cell);

/** How fast she has to be travelling sideways before a bank reads as a bank,
 *  in subs/tick. TASTE, but bounded: below it she is nearly hovering, and a
 *  banked board that is not going anywhere reads as a glitch. */
export const FLIGHT_BANK_VX = Math.round(0.35 * SUBS);

/** The three things she can be doing in the air. ONE classifier, read by the
 *  cell chooser AND by the attitude the renderer draws — so the frame, the tilt
 *  and the roll can never name three different manoeuvres in the same tick. */
export type GuardianManoeuvre = "hover" | "bank" | "spiral";

/**
 * PK-R6 · H2 (round-2 finding 3: „hover, banked turn and spiral loop are
 * visually indistinguishable — the file names do work the poses don't").
 *
 * H1 measured why and fixed half of it. The other half is this line, and it was
 * a `>`:
 *
 *   knot 2 · zigzag  HOVER 0 %   BANK 100 %   SPIRAL 0 %
 *
 * The zigzag's teeth are cut so that |vy| equals |vx| EXACTLY (both amplitudes
 * are traversed over the same period — re-derived this round from
 * `flightPointAt`: peak 1.89 px/t on both axes), and a strict `>` is false on a
 * tie. So the climax knot — the only path in the fight with corners — resolved
 * every single corner to „crossing at speed" and wore a bank cell from the first
 * tick to the last. A 45° saw is not a crossing; it is the roll the `spiral`
 * cells were painted for, and this comment block already said so („the corners
 * of a zigzag"). The tie now goes where the cells were always meant to go.
 */
export const guardianManoeuvre = (vx: number, vy: number): GuardianManoeuvre => {
  const ax = Math.abs(vx);
  const ay = Math.abs(vy);
  if (ay > 0 && ay >= ax) return "spiral";
  return ax >= FLIGHT_BANK_VX ? "bank" : "hover";
};

/**
 * Which cell the flying Tafel wears this tick, from her own per-tick travel.
 * Pure, and derived from VELOCITY rather than from the path's name — so the
 * rule generalises to every path she will ever fly and the picture can never
 * disagree with the motion:
 *
 *   · climbing or diving at least as fast as she is crossing → she is rolling
 *     through a turn: the `spiral` cells (the extremes of the spiral, the
 *     crossings of the figure-eight, the corners of a zigzag).
 *   · crossing at speed → the banked pair for the way she is going.
 *   · neither → she hovers (`_a.._d`).
 */
export const guardianFlightCell = (vx: number, vy: number, flightTick: number): string => {
  const m = guardianManoeuvre(vx, vy);
  if (m === "spiral") return SPIRAL_CELLS[bobFrame(flightTick, 4)] ?? "spiral0";
  if (m === "bank") {
    const pair = vx > 0 ? BANK_R : BANK_L;
    return pair[bobFrame(flightTick, 2)] ?? pair[0];
  }
  return IDLE_CELLS[bobFrame(flightTick, 4)] ?? "a";
};

// ── PK-R6 · H1 · THE FLIGHT ATTITUDE (round-1 critique, finding 2) ───────────
// The critique read the hover, the banked turn and the spiral loop as the same
// picture. Measured against the real machine (one full pass per knot, cells
// tallied from `guardianFlightCell` on the sim's own velocities) the charge is
// half right, and the half that is right is the half that matters:
//
//   knot 0 · spiral  HOVER  3 %   BANK  74 %   SPIRAL 23 %
//   knot 1 · eight   HOVER  0 %   BANK  74 %   SPIRAL 26 %
//   knot 2 · zigzag  HOVER  0 %   BANK 100 %   SPIRAL  0 %
//
// She is wearing a bank cell nearly the whole fight, and the ZIGZAG — the one
// path with actual corners — never rolls at all. The cause is arithmetic, not
// taste: the zigzag's teeth are cut so that |vy| equals |vx| exactly (both
// amplitudes are traversed over the same period), and `|vy| > |vx|` is false on
// a tie. Every corner in the climax knot resolves to „crossing at speed".
//
// The cells cannot fix this alone — there are three painted bank frames and the
// sheet has no cell for „diving" — so the attitude is DRAWN (doc 44 B14). Her
// body pitches with her actual climb: nose down into a dive, nose up out of it.
// The vertical amplitude is only 26 px against a 78–104 px span, so this is what
// makes the small half of her path readable at all, and it is what gives each
// named state its own silhouette — a hover sits level, a banked crossing tilts a
// little, a zigzag tooth saws hard and REVERSES every time it turns.
/** The steepest she ever pitches, in radians (~15°). TASTE, bounded: past ~20°
 *  a board with legs reads as falling rather than flying. */
export const FLIGHT_PITCH_MAX_RAD = 0.26;
/** The vertical speed that pitches her fully over, in subs/tick. MEASURED off
 *  the shipped paths (peak |vy| per knot: 0.54 · 1.26 · 1.89 px/tick), set at
 *  1.2 px/tick so the gentle first knot stays gentle (it reaches ~45 % of full
 *  pitch) and the last two saturate — the escalation the knots already promise,
 *  now visible in her body. `guardian-flight.test.ts` re-derives those peaks
 *  from `flightPointAt` and fails if the spread stops being readable. */
export const FLIGHT_PITCH_REF_VY = Math.round(1.2 * SUBS);

/**
 * How far the flying guardian's body is tipped this tick, in radians.
 *
 * Pure and closed-form, from the same per-tick velocity the cells are chosen
 * from — so the tilt can never disagree with the motion, and a replayed tape
 * draws the identical angle. Screen y grows DOWNWARD, so a positive `vy` is a
 * dive; the sign of travel decides which edge of her leads, which is what makes
 * the pitch read as a heading rather than as a wobble.
 *
 * Returns 0 under reduced motion: it depicts nothing but movement, and the
 * end-states law asks for a finished picture rather than a frozen tilt.
 */
export const guardianPitchRad = (vx: number, vy: number, dir: number, reducedMotion = false): number => {
  if (reducedMotion) return 0;
  const climb = Math.max(-1, Math.min(1, vy / FLIGHT_PITCH_REF_VY));
  const lead = vx !== 0 ? Math.sign(vx) : Math.sign(dir) || 1;
  return climb * lead * FLIGHT_PITCH_MAX_RAD;
};

// ── PK-R6 · H2 · THE ROLL AXIS (round-2 finding 3) ───────────────────────────
// „Give each manoeuvre its own readable silhouette — a real roll axis for the
// banked turn, a corkscrew rotation for the spiral loop — so the player can
// identify the incoming move from POSE alone, not the filename."
//
// H1 gave her PITCH (rotation in the picture plane). Rotation alone cannot
// separate the three, because all three rotate: a hover sits level, a bank
// leans, a saw leans harder — one axis, three amounts of the same thing. A roll
// is the axis rotation cannot draw: it turns the board's FACE away from the
// camera, and a flat board seen edge-on is a completely different silhouette
// from the same board seen square. So the second axis is drawn as horizontal
// foreshortening (doc 44 B14 — the sheet has no roll cells and never will; the
// painter delivered banks, not a turntable).
//
//   · hover  — square on. She is not going anywhere, so nothing is turned away.
//   · bank   — her face turns INTO the turn, by how hard she is crossing. A
//              steady lean, held for as long as the crossing lasts.
//   · spiral — a CORKSCREW: she rolls through edge-on and back out, on her own
//              flight tick, so the climax knot's every corner is a barrel roll
//              and reads as one in a still frame.
//
// Pure, closed-form, no clock of its own — the same contract the pitch keeps, so
// a replayed tape draws identical rolls.
/** How narrow she gets at the middle of a barrel roll, as a fraction of her
 *  square-on width. NOT 0: a board that vanishes reads as a dropped frame, and
 *  the painted cell still has to say „blackboard" at its thinnest. */
export const FLIGHT_ROLL_MIN = 0.22;
/** Ticks for one full corkscrew — she passes edge-on twice per turn, so this is
 *  an edge-on every 10 ticks (≈0.17 s) at the 60 Hz contract. DIVISIBLE BY FOUR
 *  on purpose: the sim samples this at whole ticks, and a period of 18 never
 *  lands on the quarter-turn at all — the roll's own extreme (FLIGHT_ROLL_MIN)
 *  would then be a number that never reaches the screen. Measured, not assumed;
 *  `guardian-flight.test.ts` asserts the sampled minimum IS the constant. */
export const FLIGHT_ROLL_TICKS = 20;
/** How far a full-speed bank turns her face away. MEASURED against the shipped
 *  paths (peak |vx| per knot: 1.31 · 2.22 · 1.89 px/tick), so knot 1 reaches the
 *  full lean and the gentle first knot only ever gets most of the way there. */
export const FLIGHT_BANK_FACE = 0.68;
export const FLIGHT_ROLL_REF_VX = Math.round(1.3 * SUBS);

/**
 * How wide the flying guardian is drawn this tick, as a multiple of her square-on
 * width (1 = face to camera). Always POSITIVE: a negative scale would mirror the
 * cell, and mirroring is already spoken for by the facing law (`CELL_IS_DIRECTIONAL`)
 * — two mirrors in one frame is a bank drawn backwards.
 *
 * Returns 1 under reduced motion, for the same reason the pitch returns 0: a
 * board frozen halfway through a barrel roll is not a finished picture.
 */
export const guardianRollScaleX = (
  vx: number, vy: number, flightTick: number, reducedMotion = false,
): number => {
  if (reducedMotion) return 1;
  const m = guardianManoeuvre(vx, vy);
  if (m === "hover") return 1;
  if (m === "bank") {
    const k = Math.min(1, Math.abs(vx) / FLIGHT_ROLL_REF_VX);
    return 1 - (1 - FLIGHT_BANK_FACE) * k;
  }
  const th = (flightTick / FLIGHT_ROLL_TICKS) * Math.PI * 2;
  return FLIGHT_ROLL_MIN + (1 - FLIGHT_ROLL_MIN) * Math.abs(Math.cos(th));
};

/** THE TELL, in three cells (doc 44 §4 ch01 C4: „she dips and rears"). The dwell
 *  is fixed rather than a fraction of the telegraph, so the REAR (`_windup`, the
 *  tallest cell on the sheet) is what holds right up to the release however long
 *  the tier and the knot make the tell — the last thing the child sees before
 *  the chalk leaves is always the same picture. TELEGRAPH_FLOOR_TICKS (30)
 *  guarantees all three get their turn. */
export const WINDUP_DWELL_TICKS = 10;
const windupCell = (timer: number): string =>
  timer < WINDUP_DWELL_TICKS ? "windup0" : timer < WINDUP_DWELL_TICKS * 2 ? "windup1" : "windup";

export interface EntPoseInput {
  role: string;
  state: string;
  timer: number;
  redeemed: boolean;
  vx: number;
  vy: number;
  x: number;
  homeX: number;
  /** PK-R6 · E · guardians only: ticks on the path, for the flight cell cycles.
   *  Defaulted so every existing caller (and every non-guardian) is unchanged. */
  flightTick?: number;
  /** How many painted idle cells this SKIN has on disk (doc 40 §4). The scene
   *  counts them; the hook stays pure. Defaults to the shipped 2, so a skin
   *  that never gains `_c/_d` keeps exactly today's cadence. */
  idleFrames?: number;
  /** PK-R6 · H3 · does this SKIN own an `_open0` cell on disk? The scene
   *  checks the textures (only-present law); the hook stays pure. A settled
   *  freed cage rests OPEN when the painting exists — the burst cell goes
   *  back to being the throw-open BEAT rather than the permanent state. */
  hasOpen?: boolean;
  /** R5-W1 · F1 · bouncers only: ticks since the last ground contact. Drives the
   *  impact cell's DWELL, which is what the old velocity threshold could not do
   *  (it fired on exactly one tick of a six-tick arc). */
  bounceTick?: number;
  /** R5-W1 · F1 · does this SKIN own a `_stretch` cell on disk? Same
   *  only-present contract as `hasOpen`: the scene asks the textures, the hook
   *  stays pure. Until a painter delivers `<skin>_stretch.png` the flight keeps
   *  today's idle pair, and the day it lands the cell appears with NO code
   *  change — the continuous squash below already carries the movement. */
  hasStretch?: boolean;
}

// ── PK-R6 · D · THE CLASSMATE'S CELLS (doc 44 §3.3, doc 40 §3 rig grammar) ───
// Her sheet is PAIRED all the way through — `caged0/1`, `settle0/1`, `wave0/1`,
// one pair per wrong action (`act_sing0/1` …) — except the joy cells, which the
// AL2 contract names `_joy` and `_joy1`. So the pair is looked up by NAME here
// rather than assembled from `${state}${n}`: a generic suffix would ask for
// `joy0`, entTex would fall back to `merle_a`, and the Freudenrunde would play
// as a girl standing still. One table, no arithmetic on cell names.
const CLASSMATE_CELLS: Record<string, readonly [string, string]> = {
  caged: ["caged0", "caged1"],
  settle: ["settle0", "settle1"],
  joy: ["joy", "joy1"],
  wave: ["wave0", "wave1"],
};

/** The pose a card's art binding names, as a STATE — `merle_act_sing1` +
 *  skin `merle` → `act_sing`. This is the whole reason the world and the card
 *  cannot disagree about what she is doing: the round declares its pose ONCE,
 *  in `stimulus.art` (which the portrait law already proves is a real cell of
 *  hers), and the world reads its state off that same string. Returns null for
 *  a stem that is not this being's, so a mis-bound card changes nothing rather
 *  than posing her as somebody else. */
export const poseStateOf = (stem: string, skin: string): string | null => {
  if (!stem.startsWith(`${skin}_`)) return null;
  const cell = stem.slice(skin.length + 1).replace(/\d+$/, "");
  return cell.length > 0 ? cell : null;
};

/** Which cell a classmate shows, given her state and her own tick. A state that
 *  begins `act_` is a WRONG-ACTION POSE the shell set from the open round's art
 *  binding (`merle_act_sing1` → `act_sing`), so its pair is `<state>0/1`. */
export const classmateCell = (state: string, timer: number): string => {
  const named = CLASSMATE_CELLS[state];
  if (named) return named[bobFrame(timer, 2)] ?? named[0];
  if (state.startsWith("act_")) return `${state}${bobFrame(timer, 2)}`;
  return IDLE_CELLS[bobFrame(timer, 4)] ?? "a"; // `rest` and anything unnamed: she idles
};

export const entPoseCell = (e: EntPoseInput): string => {
  // PK-R6 · D: read FIRST, like the guardian's branch and for the same reason —
  // every generic rule below (the `dazed` catch-all, the run threshold) would
  // put a cell on her that her sheet does not have, and entTex would silently
  // fall back to her idle. A person acting out a wrong action is not a dazed
  // enemy, and a freed friend waving is not a dazed one either.
  if (e.role === "classmate") return classmateCell(e.state, e.timer);
  // PK-R6 · D · AN OPENED CAGE IS DRAWN OPEN. Read before the dazed catch-all,
  // which is what a redeemed cage used to fall into: `pencilcase_dazed` does not
  // exist, entTex dropped to `pencilcase_a` — and `_a` is the CLOSED case with
  // the captive still behind its bars. Nobody noticed while the person in the
  // art was the only person there was; the moment Merle steps out of it (§3.3)
  // the frame shows her twice, once free and once still locked up. `_burst` is
  // painted (an open, empty case, the zip flying off) and is what an opened cage
  // has always meant.
  if (e.role === "cage") {
    // PK-R6 · H3: the batch-ap climax painting gives the freed pencilcase a
    // RESTING open state (lid up, bars sprung, calm) — the burst stays the
    // throw-open beat, and a cage without open art keeps burst as before.
    // R5-A8: the rest state is now reachable (stepRedeemed retires the burst
    // after CAGE_OPEN_TICKS) and bobs over the open pair. `hasOpen` guarantees
    // BOTH frames (PaintScene) — entTex falls back to `_a`, the closed cage
    // with the captive, on any missing cell, which is the exact defect class.
    if (e.redeemed && e.state === "open" && e.hasOpen === true) return `open${bobFrame(e.timer, 2)}`;
    if (e.state === "burst" || e.redeemed) return "burst";
    if (e.state === "shaking") return "shake";
  }
  // ── PK-R6 · E · THE FLYING GUARDIAN'S CELLS (doc 44 §4 ch01 C4) ────────────
  // Read before every generic rule below, and answering ONLY out of the flight
  // sheet until she is beaten. The two terminal cells (`rest`, `win`) are the
  // flight sheet's own landed pair — she has come down, which is the one moment
  // grounded is right. Nothing here can reach `sad`/`dazed`/`stagger`/
  // `telegraph`: those are the retired easel (GUARDIAN_GROUNDED_CELLS).
  if (e.role === "guardian") {
    // the console beat's payoff — the blackboard as a friend. Read first: it is
    // TERMINAL (guardianKnotSolved never sets `redeemed`), so the dazed
    // catch-all below would otherwise eat it.
    if (e.state === "consoled") return "win";
    // R3-5 kept, doc 44 §2.2 re-aimed: the beaten board reacts before the
    // victory cell — she RESTS, exhausted, on the boards she just fell onto.
    if (e.state === "sad") return "rest";
    // she is still coming down: the sinking wobble
    if (e.state === "sink" || e.state === "dip") return LAND_CELLS[bobFrame(e.timer, 2)] ?? "land0";
    // PB-F1/F2-25: `window` IS the counter-task moment — the card asks the child
    // to LOOK at her, so she may not swap to a different drawing of herself
    // while it is up, and she may not keep wobbling either: the four chalked
    // words have to sit still to be read. She holds the settled land cell.
    if (e.state === "window") return "land1";
    // the fist path (chapters that grant one) reels her in the air
    if (e.state === "stagger") return LAND_CELLS[bobFrame(e.timer, 2)] ?? "land0";
    if (e.state === "telegraph") return windupCell(e.timer);
    if (e.state === "throw") return "throw";
    if (e.state === "fly") return guardianFlightCell(e.vx, e.vy, e.flightTick ?? e.timer);
    // R3-4's turn state, kept for any chapter whose guardian still walks
    if (e.state === "turn" || e.state === "roll") return "roll";
    // the catch-alls, pointed at the flight sheet rather than the easel
    if (e.redeemed || e.state === "dazed") return "land1";
    return IDLE_CELLS[bobFrame(e.timer, 4)] ?? "a"; // she hovers
  }
  // R3-5 · THE REDEEMED-PRESENCE PAIR (doc 40 §3). Read BEFORE the dazed
  // catch-all: a freed friend is not a dazed enemy, and `moths_rest` — painted,
  // shown by nothing (doc 38 §2) — is exactly the settled cell this asks for.
  if (e.state === "joy") return "joy";
  if (e.state === "rest") return "rest";
  if (e.redeemed || e.state === "dazed" || e.state === "consoled" || e.state === "shooed") return "dazed";
  // doc 40 §2 · the turn state, for every role that patrols
  if (e.state === "turn") return "turn";
  if (e.state === "telegraph") return "telegraph";
  // a crusher's `act` IS its slam — the stomp cell is that moment
  if (e.state === "act") return e.role === "crusher" ? "stomp" : "act";
  if (e.state === "burst") return "burst";
  if (e.state === "shaking") return "shake";
  // R5-W1 · F1: die Aufprall-Zelle steht jetzt eine DAUER, gezählt ab der
  // Berührung — nicht einen Blitz an einer Geschwindigkeitsschwelle.
  if (e.role === "bouncer") {
    if ((e.bounceTick ?? SQUASH_DWELL_TICKS) < SQUASH_DWELL_TICKS) return "squash";
    if (e.hasStretch === true && bounceStretch(e.bounceTick ?? 0, e.vy) >= STRETCH_CELL_MIN) return "stretch";
  }
  if (e.role === "flyer" && Math.abs(e.x - e.homeX) >= BANK_X) return "bank";
  // platforms carry a per-tick ride delta in vx that is not a gait
  if (!e.role.startsWith("platform") && Math.abs(e.vx) >= RUN_VX) return "run";
  const frames = Math.min(Math.max(e.idleFrames ?? 2, 1), IDLE_CELLS.length);
  return IDLE_CELLS[bobFrame(e.timer, frames)] ?? "a";
};
