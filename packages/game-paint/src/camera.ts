// THE PAINTED BOOK — the camera brain (dossier-faithful): an eased look-ahead
// follow. Horizontal: the player rides a third off-center, ahead of his
// facing; scroll eases toward the target by /4 per tick with a minimum
// follow speed. Vertical: a rest line at ~57% of the view height that only
// follows once the player leaves a one-tile band. Pure targets + steps —
// the scene applies the scroll.

import { LOGICAL_H, LOGICAL_W, PAINT, SUBS, TILE } from "./paint.ts";

const AHEAD_PX = PAINT.camAheadTiles * TILE;
const REST_Y_PX = Math.floor((LOGICAL_H * PAINT.camVertBandPct) / 100); // ≈127

/** Where the horizontal scroll wants to be for a player at x, facing dir. */
export const cameraTargetX = (playerXSubs: number, facing: 1 | -1): number =>
  playerXSubs - (Math.floor(LOGICAL_W / 2) - facing * AHEAD_PX) * SUBS;

/** Where the vertical scroll wants to be for feet at y. */
export const cameraTargetY = (feetYSubs: number): number => feetYSubs - REST_Y_PX * SUBS;

/** One eased tick of one axis: /4 toward the target, min speed, no overshoot. */
export const stepCameraAxis = (currentSubs: number, targetSubs: number): number => {
  const diff = targetSubs - currentSubs;
  if (diff === 0) return currentSubs;
  let step = Math.trunc(diff / PAINT.camEaseDiv);
  const sign = diff > 0 ? 1 : -1;
  if (Math.abs(step) < PAINT.camMinSpeed) step = sign * Math.min(PAINT.camMinSpeed, Math.abs(diff));
  if (Math.abs(step) > Math.abs(diff)) step = diff;
  return currentSubs + step;
};

/** Vertical follows only outside the ±1-tile comfort band (D). */
export const stepCameraY = (currentSubs: number, feetYSubs: number): number => {
  const desired = cameraTargetY(feetYSubs);
  if (Math.abs(desired - currentSubs) <= PAINT.camVertThresholdPx * SUBS) return currentSubs;
  return stepCameraAxis(currentSubs, desired);
};

/** Keep a scroll inside the world. */
export const clampScroll = (scrollSubs: number, worldPx: number, viewPx: number): number => {
  const max = Math.max(worldPx - viewPx, 0) * SUBS;
  return Math.min(Math.max(scrollSubs, 0), max);
};

// ── PK-R3a · R3-8 — THE BATTLE FRAMING (doc 42 §1) ──────────────────────────
// Mined from Keen's phase-overlay system: when a card opens the world does not
// merely stop, the book LEANS IN toward whoever is asking — "the single cheapest
// 'this is a BATTLE' signal we own". Timings taken verbatim (1.18× over 160 ms);
// only the reason is ours: in the Painted Book the lean says WHO is talking, so
// the child's eyes are already on the being when the question arrives.
//
// Pure, and therefore testable: the scene only hands the result to Phaser.

/** How far in the view pushes at full focus (doc 42 §1, verbatim). */
export const FOCUS_ZOOM = 1.18;
/** How long it takes to get there, in ms (doc 42 §1, verbatim). */
export const FOCUS_MS = 160;
/** How far the centre travels toward the asker. Not all the way: the child must
 *  stay in frame — the lean is a glance at the speaker, not a cutaway. */
export const FOCUS_PULL = 0.6;

/** Keep a view centre such that the visible rect stays inside the world. */
const clampCentre = (centre: number, viewPx: number, worldPx: number): number =>
  (worldPx <= viewPx
    ? worldPx / 2
    : Math.min(Math.max(centre, viewPx / 2), worldPx - viewPx / 2));

/**
 * Where the camera looks, and how close, at focus progress `t` (0 = the plain
 * follow shot, 1 = fully leaned in on the asker). All arguments in world px.
 * `t = 0` reproduces the un-focused view exactly, so the same call site serves
 * both states and there is no second code path to drift.
 */
export const focusView = (
  scrollX: number, scrollY: number,
  askerX: number, askerY: number,
  t: number,
  worldW: number, worldH: number,
  viewW: number = LOGICAL_W, viewH: number = LOGICAL_H,
): { cx: number; cy: number; zoom: number } => {
  const k = Math.min(1, Math.max(0, t));
  const zoom = 1 + (FOCUS_ZOOM - 1) * k;
  const seenW = viewW / zoom;
  const seenH = viewH / zoom;
  const baseCx = scrollX + viewW / 2;
  const baseCy = scrollY + viewH / 2;
  return {
    cx: clampCentre(baseCx + (askerX - baseCx) * FOCUS_PULL * k, seenW, worldW),
    cy: clampCentre(baseCy + (askerY - baseCy) * FOCUS_PULL * k, seenH, worldH),
    zoom,
  };
};

// ── R5-W9 · F10 · D-621 — WO EINE SPRECHBLASE STEHEN DARF ────────────────────
// Der Torschluss ist die einzige Stelle, an der das Spiel einem feststeckenden
// Kind sagt, was hakt — und genau dort ging der Satz verloren: zwei blinde Leser
// schrieben an drei Toren unabhaengig »Die Tuer wartet auf ihr«, »Die Tafel ist
// noch«, »Erst die Tafel sauber — d« ab (P8 §3, R1).
//
// Die Ursache ist eine Kamera-Frage und keine Text-Frage, und deshalb steht die
// Rechnung HIER: die Blase sitzt mittig ueber dem Kind, das Kind kann bis an den
// Bildrand laufen, WEIL die Kamera dort an ihrem Anschlag steht — die Welt geht
// weiter, die SICHT nicht. Gegen die Weltbreite gepruefte Raender haetten das nie
// gefunden.
//
// Rein, und darum pruefbar: die Szene reicht nur `worldView` herein und legt das
// Ergebnis auf den Container. `tailDx` ist der Betrag, um den der Schwanz
// ZURUECK muss, damit er weiter auf den Sprecher zeigt, waehrend der Koerper im
// Bild bleibt — sonst tauscht die Klemmung einen Lesefehler gegen einen
// Zuordnungsfehler.
/**
 * @param anker    die Stelle, auf die die Blase zeigt (Kind oder Fundort)
 * @param blase    halbe Breite und Ausdehnung ueber/unter dem eigenen Ursprung
 * @param view     die KAMERASICHT in Weltpixeln (`camera.worldView`)
 * @param margin   Luft zwischen Blasenrand und Rand der Sicht
 * @param tailInset wie weit der Schwanz vom Blasenrand wegbleibt (Rundung)
 */
export const bubbleSpot = (
  anker: { x: number; y: number },
  blase: { halfW: number; oben: number; unten: number },
  view: { x: number; y: number; right: number; bottom: number },
  margin: number,
  tailInset: number,
): { x: number; y: number; tailDx: number } => {
  const halb = blase.halfW + margin;
  const links = view.x + halb;
  const rechts = view.right - halb;
  // Passt die Blase ueberhaupt nicht in die Sicht, steht sie mittig: auf beiden
  // Seiten angeschnitten ist lesbarer als auf einer Seite abgeschnitten.
  const x = rechts < links ? (view.x + view.right) / 2 : Math.min(rechts, Math.max(links, anker.x));
  const obenGrenze = view.y + blase.oben + margin;
  const untenGrenze = view.bottom - blase.unten - margin;
  const y = untenGrenze < obenGrenze
    ? (view.y + view.bottom) / 2
    : Math.min(untenGrenze, Math.max(obenGrenze, anker.y));
  const grenze = Math.max(0, blase.halfW - tailInset);
  return { x, y, tailDx: Math.min(grenze, Math.max(-grenze, anker.x - x)) };
};
