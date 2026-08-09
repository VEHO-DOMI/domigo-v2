// PK-R6 · H2 · THE CONTACT BURST, as arithmetic (doc 44 §3.1.1, round-2
// findings 1 and 2).
//
// ── WHAT ROUND 2 PHOTOGRAPHED, and what was actually in the picture ──────────
// The critic filed two findings against this beat and called the first one
// critical: „an unexplained ghost icon fixed in screen space over the hero in
// every frame … a faint circular clock/quill/compass icon at the identical
// screen coordinates in all five frames". Measured in the running build rather
// than guessed: the shapes at that pixel window are `Arc` and `Rectangle` game
// objects at depths 9–9.3, sized 17–33 screen px — i.e. THIS burst's own
// particles, sitting at their spawn radii with none of their tweens advanced.
//
// They are not a leftover asset and they are not pinned to the screen. They are
// the burst, frozen: the old implementation threw 26 tweened objects and let
// Phaser's TWEEN MANAGER own their lives, and the capture harness parks the
// game loop (`game.loop.sleep()`) between shots so a still can be photographed.
// A tween that never ticks never reaches its `onComplete`, so the spawn frame
// survived into all five screenshots of that session. In the live game the same
// probe counts 26 shapes 180 ms after contact and ZERO at 880 ms.
//
// So the finding's mechanism is refuted — and its EYE was right twice over, and
// both of those are fixed here:
//
//  1 THE BEAT OWNED THE WALL CLOCK. That is the same defect H2 already ruled on
//    one commit earlier, for the landing dust: „ein Effekt, der der Wanduhr
//    gehört, ist in einem gegebenen Bild eine Glückssache" — `puff()` went out
//    and `renderImpact` came in, a pure function of `landedAgo`. The contact
//    burst is now the same shape of thing: geometry is a pure function of ONE
//    number, drawn fresh every frame into a cleared Graphics, with no object
//    outliving its own clock. A burst that is drawn rather than spawned cannot
//    be left behind by a stopped clock, because there is nothing to leave.
//
//  2 IT WAS THROWN AT THE WRONG PLACE AND IN THE WRONG VALUES. doc 44 §3.1.1
//    says „contact spark burst AT THE TOUCH POINT"; the code threw it at the
//    being's own centre, which is why it landed on the hero's hips whenever he
//    was standing beside the thing he engaged. And every colour in it
//    (0xfff6d8, 0xffd98f, 0xfff0c4, 0x3a2f1c, 0xf6f2e8) sits inside the warm
//    beige band the classroom is painted in, so the „impact" had nothing to be
//    an impact AGAINST. Both are arithmetic here now, and both are checkable.
//
// The clock is a PRESENTATION clock (milliseconds of real time), not a sim
// tick, and that is deliberate: `Sim.step` stops incrementing `tickCount` the
// instant a card opens (sim.ts — „the world holds its breath during a task"),
// and this burst's whole job is to punctuate the moment a card opens. A
// tick-driven burst would freeze on its second frame. The camera lean already
// runs on exactly this clock for exactly this reason, and like the lean the
// burst touches no sim state: its SHAPE is a pure function of indices, so a
// replayed tape draws an identical burst.

/** How long the whole burst lives, in ms. Long enough that the ink flecks land
 *  and the mark they leave is still readable while the card is arriving; short
 *  enough to be over before the child starts reading the card. */
export const BURST_MS = 620;
/** The bright half — core, spokes and keyline — is over well before the flecks
 *  are, so a frame caught late shows a mark rather than a lamp. */
export const BURST_FLASH_MS = 300;

/** How many flecks the burst throws (doc 44 §3.1.1 — the v0 build's
 *  `this.burst?.explode(22, …)`, verbatim, unchanged by this rebuild). */
export const SPARK_COUNT = 22;

// ── THE THREE BANDS (round-2 finding 2: „the player, the enemy and the spark
// all sit at the same washed-out beige-gray value, so the collision reads as a
// blur, not a hit"). The reference wins the squint test because the hit body,
// the impact and the background are three distinct value bands, so the burst is
// built out of exactly three, every one of them already in this book's palette:
//
//   CORE  #FFFBEA  luminance 250/255 — chalk light, the brightest thing in ch01
//   HOT   #E8A33A  luminance 168/255 — the amber contour, at full saturation
//   INK   #243048  luminance  48/255 — the book's own contour ink, cool + dark
//
// The room they land in measures 150–210 luminance at 0.10–0.22 chroma, so the
// core is a step ABOVE it, the ink a long step BELOW it, and the hot band sits
// inside its luminance but at three times its chroma. `burst.test.ts` re-derives
// those separations from these constants and fails if a re-tune flattens them.
export const BURST_CORE = 0xfffbea;
export const BURST_HOT = 0xe8a33a;
export const BURST_INK = 0x243048;

/** Rec. 709 luminance of a packed RGB, 0…255 — the same coefficients the wash
 *  grammar uses (anim.greyLuma), so „is this band a value step?" is one
 *  arithmetic in the whole package rather than two that agree by luck. */
export const lumaOf = (rgb: number): number =>
  0.2126 * ((rgb >> 16) & 0xff) + 0.7152 * ((rgb >> 8) & 0xff) + 0.0722 * (rgb & 0xff);

/** Chroma (max−min)/255 of a packed RGB, 0…1 — the saturation half of doc 36
 *  §1's pop test. */
export const chromaOf = (rgb: number): number => {
  const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff;
  return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
};

/** A body in the world, in world px: where it stands and how tall it is. */
export interface BurstBody {
  /** feet, world px */ x: number;
  /** feet, world px */ y: number;
  /** drawn height, world px */ h: number;
}

/**
 * WHERE THE BURST GOES (doc 44 §3.1.1 „at the touch point").
 *
 * Between the two of them, at the height where the two bodies actually meet —
 * never at either one's centre. The old code passed the being's own `(x, y)`,
 * which put a 30-px starburst on top of whichever of the two was standing on
 * that spot; with the hero beside a school bag that is the hero's hips, which
 * is precisely the „ghost icon over the player" the critic cropped.
 *
 * The height is the SHALLOWER of the two mid-heights (i.e. the lower one on
 * screen, since y grows downward): a boy meeting a satchel meets it at satchel
 * height, and a burst at the boy's chest would float above the thing he touched.
 * Pure, so „the burst is between them" is a table rather than a screenshot.
 */
export const contactPoint = (hero: BurstBody, being: BurstBody): { x: number; y: number } => ({
  x: (hero.x + being.x) / 2,
  y: Math.max(hero.y - hero.h * 0.5, being.y - being.h * 0.5),
});

/**
 * The burst's shape at `ms` of age — every radius and alpha the renderer needs,
 * as one pure function of one number.
 *
 * `flash` runs 1 → 0 over BURST_FLASH_MS and drives everything bright; `t` runs
 * 0 → 1 over the whole life and drives the flecks and the mark. `pop` is the
 * scale curve: it overshoots hard in the first fifth and eases out, which is
 * what makes a still caught anywhere in the flash window show a burst that is
 * clearly OPENING rather than a circle that is merely present.
 */
export const burstShape = (ms: number): {
  alive: boolean;
  t: number;
  flash: number;
  pop: number;
  coreR: number;
  ringR: number;
  spokeLen: number;
  keyR: number;
} => {
  const t = Math.min(Math.max(ms / BURST_MS, 0), 1);
  const f = Math.min(Math.max(ms / BURST_FLASH_MS, 0), 1);
  const flash = 1 - f;
  // a fast open, then a long settle — cubic ease-out on the flash window
  const pop = 1 - (1 - f) ** 3;
  // Every radius below is in WORLD px against a 30-px-tall hero and a 16-px
  // tile, and they are that small on purpose: the first render of this rebuild
  // put a 42-px core and an 84-px keyline on a 30-px boy, which is a burst that
  // has eaten the collision it was supposed to punctuate. Measured in the
  // running game, the whole flash now spans about half his height — big enough
  // to be the loudest thing in the frame, small enough that both bodies are
  // still readable underneath it, which is the entire point of finding 2.
  return {
    alive: ms >= 0 && ms < BURST_MS,
    t,
    flash,
    pop,
    coreR: 1.1 + 2.4 * pop,
    ringR: 2 + 4.6 * pop,
    spokeLen: 3.2 + 7.2 * pop,
    keyR: 3 + 4.6 * pop,
  };
};

/**
 * THE IMPACT STAR, as a point list (round-2 finding 2: „radiating lines or
 * stars … no saturated burst, flash or star shape").
 *
 * The first rebuild drew the burst as two concentric circles and a core, and
 * rendered in the running game that reads as a LENS parked over the collision —
 * which is the same „unexplained circular icon" read the critic filed in the
 * first place. A hit is not a circle. So the burst's silhouette is a spiked
 * star, drawn three times at three radii in the three bands, and the spikes are
 * IRREGULAR — every second one is short, and each one is nudged by a hash of its
 * own index — because a mathematically even star is a UI asterisk and a painted
 * book does not own one.
 *
 * Pure and index-derived (repo law: no `Math.random`), so a replayed tape draws
 * the identical star, and unit-testable, so „it is spiky and it is not a circle"
 * is a table rather than a screenshot.
 */
export const starPoints = (
  cx: number, cy: number, spikes: number, rOuter: number, rInner: number, phase = 0,
): Array<{ x: number; y: number }> => {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < spikes * 2; i++) {
    const tip = i % 2 === 0;
    const k = i >> 1;
    // hash the index for the wobble — the same trick the floor grain uses
    const h = ((Math.imul(k + 3, 2654435761) >>> 0) & 0xff) / 255;
    const r = tip
      ? rOuter * (k % 2 === 0 ? 1 : 0.66) * (0.86 + 0.28 * h)
      : rInner * (0.82 + 0.3 * h);
    const a = ((i / (spikes * 2)) * Math.PI * 2) + phase + (tip ? (h - 0.5) * 0.16 : 0);
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
};

/** How many spikes the star throws. Odd, so no spike has an opposite twin and
 *  the silhouette never resolves into a cross. */
export const BURST_SPIKES = 9;

/** One fleck's heading, reach and kind, from its own index. Deterministic by
 *  construction (repo law: no `Math.random` anywhere in the game) — a replayed
 *  tape throws the identical 22 flecks. Every third fleck is a STREAK, which is
 *  how a single still frame shows a path at all. */
export const fleckOf = (i: number, n = SPARK_COUNT): {
  ang: number;
  reach: number;
  size: number;
  streak: boolean;
  ink: boolean;
} => ({
  ang: (i / n) * Math.PI * 2 + (i % 3) * 0.21,
  reach: 7 + (i % 5) * 3.4,
  size: 0.8 + (i % 3) * 0.42,
  streak: i % 3 === 0,
  // two thirds ink, one third chalk: the dark band has to be the one that
  // carries, because the room this lands in is bright almost everywhere
  ink: i % 3 !== 1,
});
