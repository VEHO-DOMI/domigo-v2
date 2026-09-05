// THE PAINTED BOOK — the ring swing: a true pendulum (dossier-faithful).
// Angle lives on the studied 512-unit circle; 256 = the arc bottom. The
// angular step is fastest at the bottom ((|cos|·4)+1 units/tick ≈ the studied
// (|cos|>>7)+1), the swing dwells 5 ticks at each extreme before reversing,
// and releasing converts the tangential speed into a jump.

import { PAINT, SUBS } from "./paint.ts";

export interface SwingState {
  anchorX: number; // subs — the ring
  anchorY: number;
  angle: number; // 512-circle units, clamped to [128, 384]; 256 = bottom
  dir: 1 | -1; // +1 = angle increasing (toward the right extreme)
  dwell: number; // ticks left holding at an extreme
  /** L3-M-a · E1 · THE ROPE THIS GRIP HANGS ON, in px.
   *
   *  Until ch03 the rope was `PAINT.swingRopePx` read straight out of the
   *  constants — one length for every ring in the game. ch03's signature is a
   *  CHAIN (ring to ring, no floor between the grips), and the chain is
   *  impossible at 96 px: the child hangs six rows under the ring, so the next
   *  ring on the same height is never inside the 14 px grab radius. The length
   *  therefore travels WITH the grip, seeded from the phase (`PhaseSpec.swing`)
   *  and defaulted to the shipped constant, so every ring built before ch03
   *  swings byte-identically. */
  ropePx: number;
}

const SWING_MIN = 128;
const SWING_MAX = 384;
const SWING_BODY_PX = 22; // T: feet hang this far under the gripping hands

const theta = (angle: number): number => ((angle - 256) / 512) * Math.PI * 2;

/** Angular units per tick at this angle — fastest at the arc bottom (D shape). */
export const swingStep = (angle: number): number => Math.floor(Math.abs(Math.cos(theta(angle))) * 4) + 1;

/** Hands + feet position for an angle (subs). */
export const swingPos = (s: SwingState): { handX: number; handY: number; xSubs: number; ySubs: number } => {
  const t = theta(s.angle);
  const handX = s.anchorX + Math.round(s.ropePx * Math.sin(t) * SUBS);
  const handY = s.anchorY + Math.round(s.ropePx * Math.cos(t) * SUBS);
  return { handX, handY, xSubs: handX, ySubs: handY + SWING_BODY_PX * SUBS };
};

/** The studied fixed entry amplitudes, left and right of the arc bottom. */
const ENTRY_LEFT = 210;
const ENTRY_RIGHT = 302;

/** L3-M-a · WO DER BOGEN ANFAENGT, WENN DAS KIND WIRKLICH DORT HAENGT.
 *
 *  Der Winkel aus dem gefangenen Handpunkt, auf den Pendelbogen begrenzt.
 *  `atan2(dx, dy)` und nicht `atan2(dy, dx)`: auf dem 512er-Kreis dieser Datei
 *  ist 256 die BOGEN-UNTERKANTE, der Nullwinkel zeigt also nach UNTEN — genau
 *  die Achsen-Reihenfolge, die `swingPos` vorwaerts benutzt (sin auf x, cos auf
 *  y). Die Rueckrechnung des Handpunkts aus der Fusslinie laeuft ueber dieselbe
 *  Konstante `SWING_BODY_PX`, mit der `swingPos` ihn vorwaerts setzt. */
const entryAngle = (dxSubs: number, dySubs: number): number => {
  const t = Math.atan2(dxSubs, dySubs);
  return Math.min(384, Math.max(128, Math.round(256 + (t / (Math.PI * 2)) * 512)));
};

/** Grab the ring: start on the side the player came from, swinging inward.
 *  `ropePx` omitted = the shipped 96 px, so ch01 and ch02 are untouched.
 *
 *  L3-M-a · DER SCHNAPPER — und warum er nur fuer erklaertes Tauwerk faellt.
 *
 *  Ein Griff setzt die Figur auf den PENDELBOGEN, nicht dorthin, wo sie den Ring
 *  beruehrt hat. Ein Stueck davon ist unvermeidbar: das Griff-Fenster ist 14 x 28
 *  px, das Seil bis zu 96 px — der Koerper MUSS versetzt werden. Der REST haengt
 *  am Eintrittswinkel, und der war bis hierher fest (210 bzw. 302).
 *
 *  Kontrolliert gemessen (`scripts/paint-probes/ch03.probe.mjs` §4c — beide Regeln
 *  aus DEMSELBEN Lauf, gleiche Flugbahn, gleicher Fangpunkt, nur die Bogenposition
 *  verschieden), groesster Sprung je Lauf in px:
 *
 *      Seil │ fester Bogen │ aus dem Fangpunkt
 *      ─────┼──────────────┼──────────────────
 *        96 │    69 / 81   │    61 / 78     (d=5 / d=6)
 *        64 │    55 / 73   │    50 / 53
 *        48 │    61 / 60   │    40 / 40
 *        32 │    47 / 25   │    29 / 19
 *
 *  Am ausgelieferten 96-px-Seil kauft die Regel fast nichts (3-8 px) — genau
 *  diese Zeile hat mich zuerst zu dem Schluss verleitet, sie sei wertlos. Am
 *  KETTENSEIL, um das es geht, nimmt sie ein Drittel weg (60 → 40 px). Deshalb
 *  bekommt sie nur, wer ein Tauwerk erklaert: `entry` wird ausschliesslich fuer
 *  eine Phase mit `PhaseSpec.swing` gereicht. Jede Phase davor behaelt Bit fuer
 *  Bit den ausgelieferten Bogen — ch01, ch02 und das heutige ch03-Band bewegen
 *  sich nicht. */
export const attachSwing = (
  anchorX: number,
  anchorY: number,
  playerX: number,
  ropePx: number = PAINT.swingRopePx,
  entry?: { x: number; feetY: number },
): SwingState => ({
  anchorX,
  anchorY,
  angle:
    entry === undefined
      ? playerX <= anchorX
        ? ENTRY_LEFT
        : ENTRY_RIGHT
      : entryAngle(entry.x - anchorX, entry.feetY - SWING_BODY_PX * SUBS - anchorY),
  dir: playerX <= anchorX ? 1 : -1,
  dwell: 0,
  ropePx,
});

export const stepSwing = (s: SwingState): { swing: SwingState; xSubs: number; ySubs: number } => {
  const next: SwingState = { ...s };
  if (next.dwell > 0) {
    next.dwell--;
    if (next.dwell === 0) next.dir = next.dir === 1 ? -1 : 1; // the flip, after the dwell
  } else {
    next.angle += next.dir * swingStep(next.angle);
    if (next.angle >= SWING_MAX) {
      next.angle = SWING_MAX;
      next.dwell = PAINT.swingDwellTicks;
    } else if (next.angle <= SWING_MIN) {
      next.angle = SWING_MIN;
      next.dwell = PAINT.swingDwellTicks;
    }
  }
  const pos = swingPos(next);
  return { swing: next, xSubs: pos.xSubs, ySubs: pos.ySubs };
};

/** The studied release lift, in px/tick upward. Kept as a named default so a
 *  phase that omits `releaseLiftPx` cannot drift away from the shipped feel. */
export const SWING_RELEASE_LIFT_PX = 2;

/** Release = a jump: tangential speed becomes vx, plus an upward lift.
 *
 *  L3-M-a · E1: the lift was the hard-coded studied −2 px/t, and that single
 *  number is the second reason a chain could not exist — a release carries the
 *  child at most one row UP, so a ring at the same height as the last one is out
 *  of reach even with a short rope. It is now a parameter; omitting it keeps the
 *  studied value, so every recorded tape stays byte-identical. */
export const releaseSwing = (
  s: SwingState,
  liftPx: number = SWING_RELEASE_LIFT_PX,
): { vxSubs: number; vySubs: number } => {
  const mag = swingStep(s.angle); // 1..5 px/t, biggest at the bottom
  return { vxSubs: s.dir * mag * SUBS, vySubs: -liftPx * SUBS };
};
