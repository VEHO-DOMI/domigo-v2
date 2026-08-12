// THE PAINTED BOOK — the rig brain: the limbless hero as posed PARTS.
// This is where "alive vs. stale" is decided (Koki's anti-stale check,
// 2026-07-19, banked in the plan): the classic animation principles as pure,
// deterministic tick math — never a linear slide:
//   · squash & stretch — the round body squashes on landing, stretches at
//     the jump apex (scale transforms; the limbless body is built for it)
//   · secondary motion — the hair tuft lags the body on a spring-like phase
//   · arcs — hands travel ellipses in the run cycle, never straight lines
//   · anticipation/overshoot — landing recovery eases elastically, not
//     linearly
// Everything derives from the INPUTS (pose, walkTime, velocities, counters) —
// zero internal state, zero wall-clock, zero RNG: the same inputs give the
// same pose in a harness run and on real RAF. Reduced motion collapses every
// oscillation to its rest value.

import type { PlayerPose } from "./player.ts";
import { PAINT, SUBS } from "./paint.ts";

// T: the rig dial sheet — the motion feel-tune session diffs exactly these.
export const RIG = {
  runCycleTicks: 16, // one full stride at run speed
  // PK-R6 · H2: 4 → 6. Round 2 measured the whole gait as „a slight heel lift".
  footLiftPx: 6,
  // PK-R6 · H1: 5 → 6.5. The critique read every locomotion frame as the same
  // picture; the study dossier's run is „feet split in a LONG stride" (Part C),
  // and a 5-px split at a 35-px hero is not a split anybody sees.
  // PK-R6 · H2: 6.5 → 8.5. Measured against the art rather than guessed: a shoe
  // is 11.3 logical px wide, so at 6.5 the two shoes still OVERLAP through most
  // of the cycle and the stride can only ever read as a shuffle. At 8.5 the
  // widest split clears a full shoe of daylight between the feet.
  footStridePx: 8.5,
  /** PK-R6 · H2 · THE TOE. The legs are not drawn, so the only thing that can
   *  say „this foot is reaching and that one is pushing off" is the angle of the
   *  shoe: the leading shoe tips toe-UP into its heel strike, the trailing shoe
   *  tips toe-DOWN off its push. Rotation survives the 35-px scale where a
   *  couple of px of extra travel does not. */
  footToeRad: 0.34,
  bodyBobPx: 1.6,
  // PK-R6 · H1: 0.16 → 0.26 rad (≈15°). The dossier's run is „body tilts
  // forward" and the reference frame reads as a DIAGONAL at thumbnail size;
  // ours read as upright. This is the single biggest silhouette tell we had and
  // it was turned almost all the way down.
  bodyLeanMaxRad: 0.26,
  handTrailPx: 2, // PB-F3/F2-7: was 3.5 — the trail hand cleared the silhouette by more than half a body width and read as dropped
  // PK-R6 · H1: the pump amplitude, not the pump OFFSET, is what was missing —
  // F2-7 tuned the back hand IN for good reason and this leaves that where it
  // is, swinging it harder instead of hanging it further out.
  // PK-R6 · H2: and harder again — 3.2 → 4.5 across, 2.8 → 3 up. A 3.2-px arc
  // on a 9.4-px mitt is a twitch INSIDE the mitt's own width: nothing a still
  // frame can show. The ceiling is the boy's own face — past about 5 px of rise
  // the lead mitt starts drawing over his mouth at a quarter of the cycle.
  handArcXPx: 4.5,
  handArcYPx: 3,
  /** PK-R6 · H2 · THE TORSO CLEARANCE. The painted torso measures 16.0 logical
   *  px and hangs 9.5 px to the lead side of the rig origin; the closed mitt
   *  measures 9.4 px and draws 2.5 px behind its own anchor. So an anchor at
   *  dx 5 — which is where idle stood — puts the ENTIRE mitt inside the torso,
   *  which is what round 2 read as „a white ball held at chest height in every
   *  frame". Any grounded state now anchors the lead hand at or beyond this, so
   *  at least half the mitt is outside the body it belongs to. */
  handClearPx: 9,
  handLagTicks: 3, // PB-F3/F2-7: the trailing hand FOLLOWS the body — arms lag, they are not placed
  hairLagTicks: 3, // the secondary-motion phase lag
  hairSwayRad: 0.22,
  idleBreathTicks: 52,
  idleBreathPx: 0.8,
  jumpStretch: { sx: 0.94, sy: 1.08 },
  // PK-R6 · H2: 1.14/0.84 → 1.22/0.76. Round 2 could not see a squash at all in
  // the frame named after it; 16 % of a 35-px hero is 5.6 px of compression, and
  // the recovery now takes half again as long so a still has time to catch it.
  landSquash: { sx: 1.22, sy: 0.76 },
  landRecoverTicks: 9, // elastic ease back to 1.0
  hoverSwayRad: 0.07,
  hoverBobPx: 1.2,
  hoverBobTicks: 26,
  chargeOrbitPx: 10,
  chargeOrbitMinTicks: 6, // orbit period at full charge (fast)
  chargeOrbitMaxTicks: 18, // at zero charge (slow)
  hurtWobbleRad: 0.3,
  // ── PK-R6 · H1 · THE LANDING ABSORB (round-1 critique, finding 4) ──────────
  // The rig squashed the BODY on landing and left the pose alone, so the frame
  // the harness named „landing-squash" showed a boy standing exactly as he
  // stands in the corridor: the critique could not tell it from idle. A landing
  // is a whole-body event — the stance opens, the arms fly out for balance —
  // and it is DERIVED from landedAgo, which the rig already receives, so no
  // sim state and no new pose enum are involved.
  // ── PK-R6 · H2 · …AND IT STILL DID NOT READ ────────────────────────────────
  // Round 2, on the frame built by round 1: „the pose on touchdown is nearly
  // identical to the idle/run carry pose — no compressed/widened stance, no
  // dust ring, no impact mark." Three things were wrong and all three are here.
  //
  // 1 · IT WAS TOO SHORT TO SEE. Nine ticks is 150 ms; the arms were already
  //     three-quarters settled by the time anything screenshots. 16 ticks holds
  //     the shape for a quarter of a second, which is a beat, not a blur.
  // 2 · IT WENT THE WRONG WAY. Arms UP is what the LEAP does (both hands above
  //     the shoulder line). Doing it again on contact gave the two ends of the
  //     same jump the same gesture. A landing is weight going DOWN: the hands
  //     drop and brace outward, and the two halves of the arc finally disagree.
  // 3 · NOTHING SANK. The rig squashed the drawing and left the skeleton where
  //     it was, so the centre of mass never moved. The body and the head now
  //     drop into the absorb — the compression is in the POSE, not only in a
  //     scale transform that a painted torso hides.
  landStanceTicks: 16, // the absorb outlasts the scale recovery: the arms settle after the body
  landStancePx: 7, // how far each foot slides out from its standing place
  landArmOutPx: 8, // …and each hand, sideways, to brace
  landArmDownPx: 2.5, // …and DOWN, because the weight is going down (see 2 above)
  landCrouchPx: 3, // how far the body sinks into its own knees (see 3 above)

  // ── R5-F3 · DIE ANHOLUNG (zwei blinde Kritiker, unabhängig, dieselbe Zeile) ─
  // Beide Prüfer der F2-Runde kamen mit demselben Befund und denselben
  // Bildnummern zurück: „ein harter Schnitt von der statischen Ruhepose in den
  // vollen Flug" · „die Anholung fehlt komplett — das eine klassische
  // Animationsprinzip, das diese sonst starke Sequenz auslässt."
  //
  // Sie hatten recht, und man kann es an dieser Datei ablesen: der Sprung-Zweig
  // setzte die Flare-Pose (Hände auf ±12/−16) auf dem ERSTEN Tick nach dem
  // Absprung. Von den Händen der Ruhepose (±9/+4) bis dorthin ist es ein Sprung
  // von zwanzig Pixeln in einem Sechzigstel — der Körper ist oben, bevor er
  // gezeigt hat, dass er sich abstößt.
  //
  // Was hier NICHT passiert: den Absprung verzögern. Das wäre die naheliegende
  // „echte" Anholung und sie wäre falsch — die Steuerung würde träge (das Kind
  // drückt und nichts geschieht), und jedes aufgezeichnete Band würde sich
  // bewegen. Der Absprung bleibt auf demselben Tick wie immer; nur die
  // ZEICHNUNG holt nach. Der Körper fliegt schon, während er noch geduckt
  // gemalt wird — das ist genau die Lüge, die Animation seit jeher erzählt.
  /** Über wie viele Ticks die Flare-Pose einläuft. Vier sind 67 ms: genug für
   *  drei unterscheidbare Zwischenbilder, kurz genug, dass der Sprung nicht
   *  weich wird. */
  launchCoilTicks: 4,
  launchArmInPx: 7, // die Hände kommen von INNEN nach außen…
  launchArmDownPx: 12, // …und von unten nach oben (Ruhepose-Höhe → Flare)
  launchCrouchPx: 3, // der Körper ist auf dem Absprung-Tick noch in den Knien
  launchFootInPx: 4, // …und der Spagat der Beine öffnet sich erst im Flug
  /** …und dasselbe am GANZEN Körper, damit die Anholung auch durch eine gemalte
   *  Ganzkörper-Zelle hindurch zu sehen ist (siehe `launchCoil`). Breit und
   *  flach beim Abdrücken — dieselbe Sprache, die der Radierer im Aufprall
   *  spricht, nur andersherum gelesen. */
  launchBodyWidenT: 0.1,
  launchBodyFlatT: 0.14,
} as const;

export interface PartPose {
  dx: number; // px, relative to the rig origin (body center), +x = facing dir
  dy: number;
  rot: number; // radians, sign follows facing
  hidden?: boolean;
  frame?: number; // rotor spin frame 0..2
}

export interface RigPose {
  scaleX: number; // whole-rig squash & stretch
  scaleY: number;
  body: PartPose;
  head: PartPose;
  handF: PartPose; // leading (front) hand — the fist hand
  handB: PartPose; // trailing (back) hand
  footF: PartPose;
  footB: PartPose;
  hair: PartPose;
  rotor: PartPose; // the quill — hidden unless hovering
}

export interface RigInput {
  pose: PlayerPose;
  walkTime: number;
  tick: number;
  vxSubs: number;
  vySubs: number;
  charge: number; // −1 when not charging
  landedAgo: number;
  /** R5-F3 · Ticks seit dem Absprung — die Uhr der Anholung, genau wie
   *  `landedAgo` die der Landung ist. Der Spielerzustand führt sie ohnehin
   *  mit; das Rig hat sie bisher nur nie bekommen. Optional (Vorgabe 99 =
   *  „lange her"), damit jeder bestehende Aufrufer und jeder Test unverändert
   *  bleibt — dieselbe Bauart wie `reach`. */
  jumpedAgo?: number;
  swingLean?: number; // −1..1 — horizontal lean toward the swing anchor (scene-fed)
  /** PK-R6 · H1 · 0..1 — how strongly a collectible is being MAGNETED in right
   *  now (scene-fed from the sim's own letter positions; see PaintScene.reachT).
   *  The magnet was invisible in a still frame: the letter simply sat beside the
   *  boy with nothing connecting them (round-1 critique, finding 5). A hand that
   *  reaches for it is the half of that cue the body owes. Optional, so every
   *  existing caller and every test is unchanged at 0. */
  reach?: number;
  reducedMotion?: boolean;
}

const P = (dx = 0, dy = 0, rot = 0): PartPose => ({ dx, dy, rot });
const TAU = Math.PI * 2;

/** R5-F3 · Die Anholung als GANZKÖRPER-Bewegung: wie tief der Körper auf dem
 *  Absprung-Tick noch sitzt und wie er dabei gestaucht ist. */
export interface LaunchCoil { sinkPx: number; sx: number; sy: number }
export const NO_COIL: LaunchCoil = { sinkPx: 0, sx: 1, sy: 1 };

/**
 * R5-F3 · DIE ANHOLUNG, DIE AUCH DURCH DIE GEMALTE ZELLE KOMMT.
 *
 * Die per-Glied-Anholung im Sprung-Zweig unten ist richtig gerechnet — und sie
 * war trotzdem unsichtbar. Der Grund, live gemessen: sobald für einen Zustand
 * eine gemalte Ganzkörper-Zelle existiert (`rigSpec.heroFullCell`, und für
 * ch01 liegen dreißig davon), wird sie STATT der komponierten Teile gezeichnet
 * — `handSichtbar: false` durch den ganzen Sprung, `pb-hero2_jump` von Tick 0
 * bis Tick 14 unverändert. Zwei blinde Prüfer haben genau das gesehen und
 * „eine starre Zeichnung, die die Kamera durchs Bild schiebt" genannt.
 *
 * Was eine gemalte Zelle NICHT verhindert, ist eine Bewegung des ganzen
 * Körpers. Der Absprung sinkt darum kurz in sich zusammen und richtet sich
 * auf: das ist dieselbe Anholung, nur eine Ebene höher — und sie gilt für
 * beide Zeichenwege, den komponierten wie den gemalten.
 *
 * Die Landung bleibt ausdrücklich unberührt: ihre Stauchung steckt bereits in
 * der gemalten `hero2_land`-Zelle, und zwei übereinandergelegte Stauchungen
 * wären genau ein Bild zu viel.
 */
export const launchCoil = (jumpedAgo: number, reducedMotion = false): LaunchCoil => {
  if (reducedMotion || jumpedAgo >= RIG.launchCoilTicks) return NO_COIL;
  const k = 1 - jumpedAgo / RIG.launchCoilTicks; // 1 auf dem Absprung-Tick → 0
  return {
    sinkPx: RIG.launchCrouchPx * k,
    sx: 1 + RIG.launchBodyWidenT * k,
    sy: 1 - RIG.launchBodyFlatT * k,
  };
};

/** PK-R6 · H2 · The poses that have the floor under them — which is what makes
 *  `landedAgo` mean anything. Exported because the SKIN has to ask the same
 *  question the POSE does (rigSpec: which torso and which face a touchdown
 *  wears), and two copies of that list would be two rules. */
export const isGrounded = (pose: PlayerPose): boolean =>
  pose === "stand" || pose === "walk" || pose === "run";

/** Elastic-ish ease-out for the landing recovery (overshoot then settle). */
const elasticOut = (t: number): number => {
  if (t >= 1) return 1;
  return 1 - Math.cos(t * Math.PI * 0.5) * (1 - t) * 0.9;
};

export const rigPose = (input: RigInput): RigPose => {
  const rm = input.reducedMotion === true;
  const speedT = Math.min(Math.abs(input.vxSubs) / PAINT.runMax, 1);

  // rest skeleton (offsets from the body center; the compositor mirrors on facing)
  // PK-R6 · H2 · THE REST ARMS (round-2 findings 2 and 3). The lead mitt used to
  // rest at dx 5 — measured against the painted parts, that is the middle of the
  // torso, so the boy stood, ran, jumped and landed apparently holding a white
  // ball against his chest. It now hangs at `handClearPx` beside the hip, half
  // clear of the body, and the trailing mitt hangs far enough back to be SEEN
  // past the torso it is drawn behind. Two visible hand-ends is what makes the
  // upper body able to say anything at all about which state he is in.
  const pose: RigPose = {
    scaleX: 1,
    scaleY: 1,
    body: P(0, 0),
    head: P(0, -14),
    handF: P(RIG.handClearPx, 4),
    handB: P(-7.5, 4),
    footF: P(4, 12),
    footB: P(-4, 12),
    hair: P(1, -20),
    rotor: { ...P(0, -26), hidden: true },
  };

  // ── landing squash + elastic recovery (applies over any grounded pose) ──
  if (!rm && input.landedAgo < RIG.landRecoverTicks) {
    const t = elasticOut(input.landedAgo / RIG.landRecoverTicks);
    pose.scaleX = RIG.landSquash.sx + (1 - RIG.landSquash.sx) * t;
    pose.scaleY = RIG.landSquash.sy + (1 - RIG.landSquash.sy) * t;
  }

  switch (input.pose) {
    case "walk":
    case "run": {
      const phase = rm ? 0 : (input.walkTime % RIG.runCycleTicks) / RIG.runCycleTicks;
      const a = phase * TAU;
      const stride = RIG.footStridePx * (0.5 + speedT * 0.5);
      // feet: opposite phases on a cycloid — lifted only on the forward half
      // W0-F4: the LIFTED foot must sweep back→front (−cos); the planted
      // foot then travels backward relative to the body — anything else reads
      // as running backwards (the feel-gate verdict).
      pose.footF.dx = 4 - Math.cos(a) * stride;
      pose.footF.dy = 12 - Math.max(Math.sin(a), 0) * RIG.footLiftPx;
      pose.footB.dx = -4 - Math.cos(a + Math.PI) * stride;
      pose.footB.dy = 12 - Math.max(Math.sin(a + Math.PI), 0) * RIG.footLiftPx;
      // PK-R6 · H2 · the toe. There are no legs to extend, so the reach and the
      // push-off have to be told by the SHOES: cos(a) is −1 exactly when a foot
      // is at the front of its travel, so `toe = footToeRad · cos` tips the
      // leading shoe up into its strike and the trailing shoe down off its push.
      // Scaled by speed, so a slow walk keeps its flat-footed shuffle.
      if (!rm) {
        pose.footF.rot = RIG.footToeRad * Math.cos(a) * speedT;
        pose.footB.rot = RIG.footToeRad * Math.cos(a + Math.PI) * speedT;
      }
      // body: double-frequency bob + speed lean
      pose.body.dy = rm ? 0 : -Math.abs(Math.sin(a)) * RIG.bodyBobPx;
      // the lean survives reduced motion: it is not an oscillation, it is the
      // POSE — a run drawn bolt upright is the thing the critique flagged, and
      // a child who asked for less movement did not ask for a worse picture
      pose.body.rot = RIG.bodyLeanMaxRad * speedT;
      pose.head.dy = -14 + pose.body.dy * 0.7;
      // the head LEADS the diagonal. Rotation alone barely reads at 35 px,
      // because each part turns about its OWN centre; shifting the head forward
      // over the feet is what actually draws the lean.
      pose.head.dx = speedT * 3.5;
      pose.body.dx = speedT * 1.5;
      pose.head.rot = RIG.bodyLeanMaxRad * speedT * 0.5;
      // hands (dossier): the sprinter pump — the lead hand rides closed at
      // chest height ahead of and OVERLAPPING the torso; the trail hand swings
      // open behind at hip height; both trace small arcs (never straight lines)
      // PK-R6 · H1: the lead mitt now clears the 12-px torso and rides at
      // SHOULDER height at speed (dossier Part C: „lead hand loosely closed at
      // chest height AHEAD of the torso"). At 5+4 px it sat on the chest, which
      // is the dossier's crouch/brace pose — the one the critique read as
      // „arms-clutched-to-chest" in every single frame.
      //
      // PK-R6 · H2 · TWO CORRECTIONS, both measured off the parts.
      //
      // THE COUNTER-SWING. The lead hand rode `cos(a + π)`, which is the SAME
      // sign the lead foot rides — hand and foot on one side went forward
      // together, the gait of a wind-up toy, and round 2 read the arms as not
      // swinging at all. Humans counter-rotate: the arm opposes the leg on its
      // own side. The lead hand now rides `cos(a)`, so it is at its furthest
      // BACK exactly when the lead foot is at its furthest forward.
      //
      // THE FACE. At dy −6…−9 the 9.4-px mitt covered the boy's mouth at a
      // quarter of the cycle (the head is 16.5 px wide and sits at −14): the
      // pump was drawn over the one part of him that carries expression. It now
      // pumps at chest height and stays under the chin.
      //
      // THE SWING NEVER CARRIES IT BACK IN. The arc's own amplitude is added to
      // the anchor, so the BACK of the pump lands exactly on the clearance line
      // instead of swinging the mitt into the middle of the chest — which is
      // what the frame the critique called „run-midstride" actually showed.
      pose.handF.dx = RIG.handClearPx + RIG.handArcXPx + speedT * 3 + (rm ? 0 : Math.cos(a) * RIG.handArcXPx);
      pose.handF.dy = 2 - speedT * 2 + (rm ? 0 : Math.sin(a) * RIG.handArcYPx);
      // PB-F3 · F2-7: the back hand was an open palm hanging at shoe height,
      // a body-width clear of the torso and moving in exact lockstep with the
      // feet — "one dropped glove plus one held ball" on film. It now swings on
      // a LAGGED phase (secondary motion, like the hair), closer in and higher,
      // so the pair reads as a pump. MEASURED across the cycle at full speed:
      // vertical spread 4.4–11.6 px → 3.6–9.4 px, and the hand clears the
      // 12-px body by at most 4.3 px instead of 7 — twice per cycle it now
      // tucks just inside the silhouette instead of always floating clear.
      // PK-R6 · H1: …and it swings at HIP height, not chest height. The draw
      // order puts this hand BEHIND the torso, and at chest height the torso and
      // the satchel covered it completely — in the whole round-1 capture set the
      // trailing mitt is not visible in a single frame, which is most of why
      // every state looked like the same one-armed boy. Dropped to the hip it
      // clears the satchel and the pump finally has two ends.
      // PK-R6 · H2: the sign flips here too, so the two mitts still oppose each
      // other (they always did) while each now also opposes its own foot.
      const aBack = rm ? 0 : ((input.walkTime - RIG.handLagTicks) % RIG.runCycleTicks) / RIG.runCycleTicks * TAU;
      pose.handB.dx = -8 - RIG.handTrailPx * speedT - (rm ? 0 : Math.cos(aBack) * RIG.handArcXPx);
      pose.handB.dy = 4 - (rm ? 0 : Math.sin(aBack) * RIG.handArcYPx);
      // hair: lags the body's bob by a few ticks — the secondary motion
      if (!rm) {
        const lag = ((input.walkTime - RIG.hairLagTicks) % RIG.runCycleTicks) / RIG.runCycleTicks;
        pose.hair.rot = Math.sin(lag * TAU) * RIG.hairSwayRad * (0.4 + speedT * 0.6);
        pose.hair.dy = -20 - Math.abs(Math.sin(lag * TAU)) * 0.8;
      }
      break;
    }
    case "stand": {
      if (!rm) {
        const b = Math.sin((input.tick % RIG.idleBreathTicks) / RIG.idleBreathTicks * TAU) * RIG.idleBreathPx;
        pose.body.dy = b;
        pose.head.dy = -14 + b * 0.6;
        pose.hair.rot = Math.sin(((input.tick - RIG.hairLagTicks) % RIG.idleBreathTicks) / RIG.idleBreathTicks * TAU) * 0.05;
        // PK-R6 · H2 · the arms hang off the breath rather than being welded to
        // it: the mitts lag the chest and drift a little further out on the
        // out-breath, which is the difference between a boy standing and a
        // cardboard boy standing.
        pose.handF.dy += b * 1.4;
        pose.handB.dy += b * 1.1;
        pose.handF.rot = b * 0.05;
      }
      break;
    }
    case "jump": {
      if (!rm && input.vySubs < -2 * SUBS) {
        pose.scaleX = RIG.jumpStretch.sx;
        pose.scaleY = RIG.jumpStretch.sy;
      }
      // PK-R6 · H1 · THE FLARE. The dossier's forensic pass (level-anatomy.md
      // Part C, „Jump/leap") is explicit and cites two reference frames: „both
      // hands rise above shoulder line, open, fingers spread wide — the
      // silhouette FLARES. Hands lead the arc." Its own summary line one page
      // earlier says „jump rise = hands tuck compact", and that is the line this
      // rig was built on — which is how the jump ended up wearing very nearly
      // the idle silhouette. The forensic reading wins: it is the more specific
      // observation, it names its evidence, and it is what Part C's own law
      // („above = jump") requires of a pose that must read from shape alone.
      //
      // The symmetry is safe here and only here: R2a's „jazz hands" verdict was
      // about the FALL, which now keeps its asymmetric counter-drift below, so
      // the two air states no longer share a picture either.
      pose.handF = P(12, -16, -0.55);
      pose.handB = P(-12, -13, 0.55);
      pose.footF = P(6, 7); // the split feet the dossier gives the leap
      pose.footB = P(-6, 14);
      pose.hair.rot = rm ? 0 : -0.12;
      // R5-F3 · …UND SIE KOMMT AUS DER HOCKE (siehe RIG.launchCoilTicks).
      // `k` ist 1 auf dem Absprung-Tick und 0, sobald die Anholung durch ist:
      // die Hände wandern von innen-unten nach außen-oben, der Körper steigt
      // aus den Knien, die Beine öffnen ihren Spagat, und die Streckung setzt
      // erst ein, wenn der Körper sich wirklich streckt. Vier Ticks später ist
      // die Flare-Pose exakt die, die vorher schon da stand — nichts an ihrem
      // Endzustand ändert sich, sie hat jetzt nur einen Anlauf.
      {
        const ja = input.jumpedAgo ?? 99;
        if (!rm && ja < RIG.launchCoilTicks) {
          const k = 1 - ja / RIG.launchCoilTicks;
          pose.handF.dx -= RIG.launchArmInPx * k;
          pose.handB.dx += RIG.launchArmInPx * k;
          pose.handF.dy += RIG.launchArmDownPx * k;
          pose.handB.dy += RIG.launchArmDownPx * k;
          pose.handF.rot *= 1 - k;
          pose.handB.rot *= 1 - k;
          pose.body.dy += RIG.launchCrouchPx * k;
          pose.head.dy += RIG.launchCrouchPx * k;
          pose.footF.dx -= RIG.launchFootInPx * k;
          pose.footB.dx += RIG.launchFootInPx * k;
          pose.scaleX = 1 + (pose.scaleX - 1) * (1 - k);
          pose.scaleY = 1 + (pose.scaleY - 1) * (1 - k);
        }
      }
      break;
    }
    case "fall": {
      // R2a: a low asymmetric reach — the old symmetric double-spread at
      // shoulder height was Koki's "jazz hands". PK-R6 · H1 opens it further:
      // the drift hand goes higher and the anchor fist lower, so „falling"
      // reads as a diagonal at thumbnail size instead of as a shrug.
      pose.handF = P(12, -12, 0.4); // the loose counter-drift above the drop
      pose.handB = P(-10, 5, -0.25); // the anchor fist stays at the hip — and CLEAR of the torso, or it is not in the picture at all
      pose.body.rot = rm ? 0 : 0.09; // tipped back off the vertical
      const dangle = rm ? 0 : Math.sin((input.tick % 14) / 14 * TAU) * 1.2;
      pose.footF = P(5 + dangle, 14);
      pose.footB = P(-5 - dangle, 12); // legs dangle UNEVENLY (dossier: loose, not paired)
      pose.hair.rot = rm ? 0 : 0.18; // streaming upward while falling
      pose.hair.dy = -21;
      break;
    }
    case "hover": {
      pose.rotor = { dx: 0, dy: -26, rot: 0, hidden: false, frame: rm ? 0 : input.tick % 3 };
      const sway = rm ? 0 : Math.sin((input.tick % RIG.hoverBobTicks) / RIG.hoverBobTicks * TAU);
      pose.body.rot = sway * RIG.hoverSwayRad;
      pose.body.dy = sway * RIG.hoverBobPx;
      pose.head.dy = -14 + sway * RIG.hoverBobPx * 0.6;
      pose.footF = P(3, 9); // tucked
      pose.footB = P(-3, 9);
      // dossier: the glide balances like a tightrope walk — both hands out
      // at the sides, palms down (strong rotation turns the open glove flat)
      pose.handF = P(11, -5, -1.15 + sway * 0.08);
      pose.handB = P(-11, -5, 1.15 - sway * 0.08);
      break;
    }
    case "charge": {
      // the fist hand orbits, accelerating with charge — pure anticipation
      const chargeT = Math.max(input.charge, 0) / PAINT.chargeMax;
      const period = RIG.chargeOrbitMaxTicks - (RIG.chargeOrbitMaxTicks - RIG.chargeOrbitMinTicks) * chargeT;
      const a = rm ? 0 : ((input.tick % Math.max(Math.round(period), 1)) / Math.max(Math.round(period), 1)) * TAU;
      // dossier: the charge winds the fist BEHIND the hip (sparkling), body
      // coiled forward — the tremble tightens as the charge grows
      const tremble = 2 + chargeT * 2;
      pose.handF.dx = -8 + Math.cos(a) * tremble;
      pose.handF.dy = 2 + Math.sin(a) * tremble;
      pose.handB.dx = 6; // the guard hand covers the chest line
      pose.handB.dy = -3;
      pose.body.rot = rm ? 0 : -0.06; // coiled
      pose.footF = P(5, 12);
      pose.footB = P(-6, 12);
      break;
    }
    case "hang": {
      // W0-F6: the mittens grip ON the painted lip (feet hang 26px below the
      // grabbed top, so dy −24/−25 puts the hands right at the edge)
      pose.handF.dx = 9; // both grips sit ON the lip corner (the wall side)
      pose.handF.dy = -24;
      pose.handB.dx = 5;
      pose.handB.dy = -26;
      pose.body.dx = -2; // the body hangs slightly off the grip axis
      pose.body.dy = -12;
      pose.head.dy = -22;
      pose.footF.dx = 3; // feet tuck right under the raised torso — no floating gap
      pose.footF.dy = 0;
      pose.footB.dx = -1;
      pose.footB.dy = 2;
      pose.body.rot = rm ? 0.06 : 0.06 + Math.sin(((input.tick % 48) / 48) * TAU) * 0.03;
      break;
    }
    case "vine": {
      const a = rm ? 0 : ((input.walkTime % 20) / 20) * TAU;
      // dossier: the reaching hand leads above the head; hands alternate on
      // the vine line while the BODY hangs beside it (the vine must never
      // bisect the face)
      pose.handF = P(-3, -26 + Math.sin(a) * 3);
      pose.handB = P(-5, -18 - Math.sin(a) * 3);
      pose.body.dx = 4;
      pose.head.dx = 4;
      pose.hair.dx = 5;
      pose.footF = P(0, 12 - Math.sin(a) * 2);
      pose.footB = P(-2, 13 + Math.sin(a) * 2);
      break;
    }
    case "swing": {
      // the grip pair shifts toward the anchor and the body tilts with the
      // pendulum — the rope, hands and lean read as ONE line (scene feeds lean)
      const lean = input.swingLean ?? 0;
      pose.handF = P(2 + lean * 7, -25, -lean * 0.3);
      pose.handB = P(-2 + lean * 7, -27, -lean * 0.3);
      pose.body.rot = -lean * 0.22;
      pose.head.rot = -lean * 0.12;
      pose.footF = P(5 - lean * 3, 13);
      pose.footB = P(-1 - lean * 3, 15);
      pose.hair.rot = rm ? 0 : 0.14 - lean * 0.2;
      break;
    }
    case "hit": {
      const w = rm ? 0 : Math.sin((input.tick % 8) / 8 * TAU) * RIG.hurtWobbleRad;
      pose.body.rot = w;
      pose.head.rot = -w * 0.6;
      pose.handF = P(10, -10, 0.6);
      pose.handB = P(-10, -6, -0.6);
      pose.footF = P(6, 11);
      pose.footB = P(-7, 12);
      break;
    }
  }

  // ── PK-R6 · H1 · THE LANDING ABSORB (finding 4) ────────────────────────────
  // Laid OVER the grounded pose the switch just built, because a landing is not
  // a state the sim has — it is the first few ticks of standing or running, and
  // `landedAgo` is the clock that says so. Eases out on the same elastic curve
  // the scale recovery uses, so the stance opening and the body decompressing
  // are one movement rather than two.
  const grounded = isGrounded(input.pose);
  if (!rm && grounded && input.landedAgo < RIG.landStanceTicks) {
    const k = 1 - elasticOut(input.landedAgo / RIG.landStanceTicks); // 1 at contact → 0 settled
    pose.footF.dx += RIG.landStancePx * k;
    pose.footB.dx -= RIG.landStancePx * k;
    pose.footF.rot *= 1 - k; // the toe flattens out: both shoes take the floor
    pose.footB.rot *= 1 - k;
    // …and the hands brace DOWN and OUT (H2 · correction 2): the leap threw them
    // up, so the touchdown may not, or the two ends of one jump wear one gesture
    pose.handF.dx += RIG.landArmOutPx * k;
    pose.handF.dy += RIG.landArmDownPx * k;
    pose.handF.rot += 0.45 * k; // palms turn down over the floor coming at him
    pose.handB.dx -= RIG.landArmOutPx * k;
    pose.handB.dy += RIG.landArmDownPx * k;
    pose.handB.rot -= 0.45 * k;
    // …and he SINKS (H2 · correction 3): the whole skeleton drops into the
    // absorb, head a shade further than chest, so the neck compresses too
    pose.body.dy += RIG.landCrouchPx * k;
    pose.head.dy += RIG.landCrouchPx * 1.25 * k;
    pose.hair.dy += RIG.landCrouchPx * 1.25 * k;
    pose.body.rot *= 1 - k; // whatever lean the gait had, the landing straightens
  }

  // ── PK-R6 · H1 · THE MAGNET REACH (finding 5) ──────────────────────────────
  // The lead mitt goes out toward the letter that is being pulled in, at the
  // strength of the pull. Facing is applied by the compositor, and the sim only
  // magnets what is already in front of the pickup box, so reaching along +x is
  // reaching AT it. Suppressed in the grips (hang/vine/swing) — a hand that lets
  // go of the rope to grab a letter is a picture that lies about the physics.
  const reach = Math.min(Math.max(input.reach ?? 0, 0), 1);
  if (reach > 0 && input.pose !== "hang" && input.pose !== "vine" && input.pose !== "swing" && !pose.handF.hidden) {
    pose.handF.dx += 7 * reach;
    pose.handF.dy -= 5 * reach;
    pose.handF.rot -= 0.3 * reach;
    pose.head.dx += 1.2 * reach; // he looks where he reaches
  }

  pose.hair.hidden = true; // W0-F5: heads carry hair; the tuft double-drew
  return pose;
};

/** The throw pose hides the flying hand — the fist IS that hand, out working. */
export const withFistAway = (pose: RigPose): RigPose => ({
  ...pose,
  handF: { ...pose.handF, hidden: true },
});

// ── PK-R6 · H1 · THE BRACE (round-1 critique, finding 7) ─────────────────────
// „The boy is in the same static standing pose despite the boss winding up and
// throwing" — he read as a cutout in his own boss fight. ch01 grants no fist
// (doc 44 §4 ch01: „walk, jump, nothing else"), so his ONLY answer to a windup
// is his body: he drops his weight, tucks his lead arm across himself and turns
// his face up at the thing that is about to throw.
//
// A MODIFIER rather than a new PlayerPose, deliberately, and for the same reason
// `withFistAway` is one: the reaction has to compose with whatever he is already
// doing — a child braces while running, and a brace that replaced the run would
// freeze him mid-stride in the one moment he most needs to be moving.
/** How deep the brace crouches him at full strength, in px. */
const BRACE_DROP_PX = 2.6;
/** How far his lead hand comes across, and his head tips back to look up. */
const BRACE_GUARD_PX = 3.4;
const BRACE_LOOKUP_RAD = 0.16;

// ── PK-R6 · H2 · THE CHEER (round-2 findings 4 and 9) ────────────────────────
// „The correct-answer cheer has no juice: the only difference between the hold
// frame and the cheer frame is a small checkmark badge fading in — the
// character's pose and expression are identical." Measured against the code
// rather than argued: the world's compositor called `faceFor(pose, tick, false)`
// with `celebrating` HARD-CODED FALSE, so in the whole running game the boy
// could never wear the celebrate face at all. Five faces were commissioned; the
// world asked for four of them, and the missing one was the payoff face.
//
// So this is the pose half of that, and it is a MODIFIER for the same reason
// `withBrace` is: a cheer has to compose with whatever he is already doing, and
// the moment it plays he is standing beside a card that has just got out of the
// way. Both hands go up and OPEN — the dossier's one sanctioned symmetric flare,
// the same shape the leap already uses — and he lifts onto his toes rather than
// leaving the ground, because the sim is frozen for the card and a hop that
// moved him would be the picture disagreeing with the world.
/** How far his hands come up at the top of the cheer, in px. Measured against
 *  the parts: the head hangs at −14 and is ~11 px tall, so +11 puts the mitts at
 *  ear height — clear of his face, above the shoulder line. */
const CHEER_RAISE_PX = 11;
/** How far apart they throw, in px — past the torso's own 9.5 px half-width, so
 *  both mitts are outside the body and the flare reads at 35 px. */
const CHEER_SPREAD_PX = 4;
/** The lift onto his toes. Small: he is delighted, not launching. */
const CHEER_LIFT_PX = 1.8;

/**
 * Fold a cheer into an already-built pose. `t` is 0 (not cheering) … 1 (full
 * flare), so the same ramp that fades the beat in fades the pose in with it.
 */
export const withCheer = (pose: RigPose, t: number): RigPose => {
  const k = Math.max(0, Math.min(1, t));
  if (k === 0) return pose;
  return {
    ...pose,
    scaleY: pose.scaleY * (1 + 0.05 * k), // up on the toes: he stretches
    body: { ...pose.body, dy: pose.body.dy - CHEER_LIFT_PX * k },
    head: { ...pose.head, dy: pose.head.dy - CHEER_LIFT_PX * k * 1.4, rot: pose.head.rot - 0.1 * k },
    // BOTH hands, up and out — the one place the rig is allowed to be symmetric
    handF: {
      ...pose.handF,
      dx: pose.handF.dx + CHEER_SPREAD_PX * k,
      dy: pose.handF.dy - CHEER_RAISE_PX * k,
      rot: pose.handF.rot + 0.5 * k,
    },
    handB: {
      ...pose.handB,
      dx: pose.handB.dx - CHEER_SPREAD_PX * k,
      dy: pose.handB.dy - CHEER_RAISE_PX * k,
      rot: pose.handB.rot - 0.5 * k,
    },
  };
};

/**
 * Fold a brace into an already-built pose. `t` is how far into it he is (0 = not
 * bracing, 1 = fully set), so the flinch can RAMP with the boss's own telegraph
 * instead of snapping on — the tell and the reaction share one clock, which is
 * what makes him look like he is reading her rather than reacting to a trigger.
 */
export const withBrace = (pose: RigPose, t: number): RigPose => {
  const k = Math.max(0, Math.min(1, t));
  if (k === 0) return pose;
  return {
    ...pose,
    scaleY: pose.scaleY * (1 - 0.06 * k), // weight down
    body: { ...pose.body, dy: pose.body.dy + BRACE_DROP_PX * k },
    head: {
      ...pose.head,
      dy: pose.head.dy + BRACE_DROP_PX * k,
      rot: pose.head.rot - BRACE_LOOKUP_RAD * k, // chin up at the board
    },
    // the lead hand comes UP and ACROSS — the universal „something is coming"
    handF: {
      ...pose.handF,
      dx: pose.handF.dx - BRACE_GUARD_PX * k,
      dy: pose.handF.dy - BRACE_GUARD_PX * k,
      rot: pose.handF.rot - 0.4 * k,
    },
    // …and the trailing hand drops back for balance, so the two ends disagree
    handB: {
      ...pose.handB,
      dx: pose.handB.dx - 1.6 * k,
      dy: pose.handB.dy + 1.4 * k,
    },
  };
};
