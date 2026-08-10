// PK-R6 · H2 · THE CONTACT BURST, locked (round-2 findings 1 and 2).
//
// Three claims are made in burst.ts and every one of them is the kind that a
// well-meant re-tune undoes without failing a typecheck:
//   · the burst sits BETWEEN the two bodies (doc 44 §3.1.1's „touch point"),
//     never on either one — the finding that got filed as „a ghost icon over the
//     player's hips" was that arithmetic being wrong;
//   · its three colours are three SEPARATED bands, so the contact frame passes a
//     squint test against the warm classroom it happens in;
//   · it DIES. The whole rebuild exists because the old burst spawned objects
//     that outlived their own clock, so „nothing is drawn after BURST_MS" is the
//     property this file exists to keep.
import { describe, expect, it } from "vitest";
import {
  BURST_CORE, BURST_FLASH_MS, BURST_HOT, BURST_INK, BURST_MS, SHARD_CORNERS, SHARD_LONG,
  SHARD_TIP_MIN, SHARD_TIP_SPAN, SPARK_COUNT, burstShape, chromaOf, contactPoint, fleckOf, lumaOf, shardOutline,
} from "./burst.ts";

describe("the touch point (doc 44 §3.1.1)", () => {
  const hero = { x: 472, y: 288, h: 30 };
  const bag = { x: 488, y: 288, h: 26 };

  it("puts the burst BETWEEN the two bodies, never on one of them", () => {
    const p = contactPoint(hero, bag);
    expect(p.x).toBeGreaterThan(Math.min(hero.x, bag.x));
    expect(p.x).toBeLessThan(Math.max(hero.x, bag.x));
    // the shipped defect, as a number: the burst used to be thrown at the
    // being's own centre, which is 8 px from where it belongs on this pair
    expect(Math.abs(p.x - bag.x)).toBeGreaterThan(4);
  });

  it("meets a short being at the SHORT being's height, not at the hero's chest", () => {
    const p = contactPoint(hero, { x: 488, y: 288, h: 12 });
    // y grows downward: the meeting point is the LOWER of the two mid-heights
    expect(p.y).toBe(288 - 6);
    expect(p.y).toBeGreaterThan(hero.y - hero.h * 0.5);
  });

  it("is symmetric — which side the child approaches from changes nothing", () => {
    const right = contactPoint(hero, bag);
    const left = contactPoint({ ...hero, x: 504 }, bag);
    expect(right.x - bag.x).toBeCloseTo(bag.x - left.x, 6);
  });
});

describe("the three value bands (round-2 finding 2)", () => {
  // the room the burst happens in, measured off the shipped ch01 frames:
  // warm beige/gold, 150–210 luminance at 0.10–0.22 chroma
  const ROOM_LUMA = [150, 210] as const;

  it("the core is BRIGHTER than the room and the ink is DARKER", () => {
    expect(lumaOf(BURST_CORE)).toBeGreaterThan(ROOM_LUMA[1] + 20);
    expect(lumaOf(BURST_INK)).toBeLessThan(ROOM_LUMA[0] - 60);
  });

  it("the three bands are separated from EACH OTHER by a real value step", () => {
    const [core, hot, ink] = [lumaOf(BURST_CORE), lumaOf(BURST_HOT), lumaOf(BURST_INK)];
    // doc 36 §1's pop test is „≥12 % luminance OR ≥25 % saturation"; 12 % of the
    // 0…255 range is ~31, and every neighbouring pair clears it comfortably
    expect(core - hot).toBeGreaterThan(31);
    expect(hot - ink).toBeGreaterThan(31);
  });

  it("the hot band beats the room on SATURATION even though it shares its hue", () => {
    expect(chromaOf(BURST_HOT)).toBeGreaterThan(0.22 + 0.25);
    // …and the other two do their work in value, so they may be near-neutral
    expect(chromaOf(BURST_CORE)).toBeLessThan(0.12);
  });
});

describe("the burst's clock", () => {
  it("is alive at contact and DEAD after its own life (the round-2 ghost)", () => {
    expect(burstShape(0).alive).toBe(true);
    expect(burstShape(BURST_MS - 1).alive).toBe(true);
    expect(burstShape(BURST_MS).alive).toBe(false);
    expect(burstShape(BURST_MS * 4).alive).toBe(false);
    expect(burstShape(-1).alive).toBe(false);
  });

  it("POPS: it opens fast and is mostly open before the flash is half gone", () => {
    expect(burstShape(0).pop).toBeCloseTo(0, 5);
    expect(burstShape(BURST_FLASH_MS / 2).pop).toBeGreaterThan(0.85);
    expect(burstShape(BURST_FLASH_MS).pop).toBeCloseTo(1, 5);
  });

  it("the bright half is over long before the mark is", () => {
    expect(BURST_FLASH_MS).toBeLessThan(BURST_MS / 2);
    expect(burstShape(BURST_FLASH_MS).flash).toBeCloseTo(0, 5);
    expect(burstShape(BURST_FLASH_MS + 1).t).toBeLessThan(0.5);
  });

  it("every radius grows monotonically through the open", () => {
    let prev = burstShape(0);
    for (let ms = 10; ms <= BURST_FLASH_MS; ms += 10) {
      const now = burstShape(ms);
      expect(now.coreR).toBeGreaterThanOrEqual(prev.coreR);
      expect(now.ringR).toBeGreaterThanOrEqual(prev.ringR);
      expect(now.spokeLen).toBeGreaterThanOrEqual(prev.spokeLen);
      prev = now;
    }
  });
});

describe("the flecks", () => {
  it("keeps the v0 count doc 44 §3.1.1 quotes verbatim", () => {
    expect(SPARK_COUNT).toBe(22);
  });

  it("covers the whole circle — no fleck-free quadrant", () => {
    const quadrants = new Set<number>();
    for (let i = 0; i < SPARK_COUNT; i++) {
      quadrants.add(Math.floor(((fleckOf(i).ang % (Math.PI * 2)) / (Math.PI / 2)) % 4));
    }
    expect(quadrants.size).toBe(4);
  });

  it("is DETERMINISTIC — the same index throws the same fleck every time", () => {
    for (let i = 0; i < SPARK_COUNT; i++) expect(fleckOf(i)).toEqual(fleckOf(i));
  });

  it("carries the dark band on the majority of its flecks", () => {
    const ink = Array.from({ length: SPARK_COUNT }, (_, i) => fleckOf(i)).filter((f) => f.ink);
    expect(ink.length).toBeGreaterThan(SPARK_COUNT / 2);
  });

  it("shows a PATH: a third of the flecks are streaks, not dots", () => {
    const streaks = Array.from({ length: SPARK_COUNT }, (_, i) => fleckOf(i)).filter((f) => f.streak);
    expect(streaks.length).toBeGreaterThanOrEqual(Math.floor(SPARK_COUNT / 3));
  });
});

// ── PK-R6 · H2 · THE BROKEN PIECE (round-2 finding 6) ───────────────────────
// „'Shards on floor' are smooth round dust puffs, not broken chalk … distinct
// from the round ambient dust particles used for Domi's footsteps elsewhere."
//
// The cause was measurable and so is the fix: `chalk_shard_a/b` are 245×259
// sheets of TEN separate chunks, fitted to a 6-px display height — every chunk
// lands under a pixel and what reaches the screen is a soft blob. The shard is
// drawn now, and this is the law that keeps it from drifting back into a circle.
describe("a shard is a splinter, not a puff (round-2 finding 6)", () => {
  const IDS = [0, 1, 2, 7, 41, 1290, 5001];
  const radii = (id: number): number[] => shardOutline(id, 0, 0, 10).map((p) => Math.hypot(p.x, p.y));
  /** the outline's own longest and shortest widths, i.e. is it a SLIVER? */
  const axes = (id: number): { long: number; short: number } => {
    const pts = shardOutline(id, 0, 0, 10);
    let long = 0;
    let a0 = 0;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i]!.x - pts[j]!.x, pts[i]!.y - pts[j]!.y);
        if (d > long) { long = d; a0 = Math.atan2(pts[j]!.y - pts[i]!.y, pts[j]!.x - pts[i]!.x); }
      }
    }
    // width measured ACROSS that longest axis
    const across = pts.map((p) => -p.x * Math.sin(a0) + p.y * Math.cos(a0));
    return { long, short: Math.max(...across) - Math.min(...across) };
  };

  it("is SPIKY: its points stand well clear of its flats", () => {
    for (const id of IDS) {
      const r = radii(id);
      expect(r.length).toBe(SHARD_CORNERS);
      // a regular polygon — the round-puff class this replaces — scores 1.0
      expect(Math.max(...r) / Math.min(...r)).toBeGreaterThan(1.8);
    }
  });

  it("is LONG: a piece snapped off a stick is a sliver, never a disc", () => {
    // MEASURED regression guard. The first cut of this outline had six near-equal
    // radii and no long axis, and rendered in the arena as three coloured BALLS —
    // the very defect this finding names, reintroduced by its own fix.
    for (const id of IDS) {
      const { long, short } = axes(id);
      expect(long / short).toBeGreaterThan(1.5);
    }
  });

  it("gives every piece its OWN silhouette — neighbours are never twins", () => {
    const a = shardOutline(11, 0, 0, 10);
    const b = shardOutline(12, 0, 0, 10);
    const same = a.every((p, i) => Math.abs(p.x - (b[i]?.x ?? 0)) < 1e-9 && Math.abs(p.y - (b[i]?.y ?? 0)) < 1e-9);
    expect(same).toBe(false);
    // …and they do not all lie the same way up, either
    const angleOf = (id: number): number => Math.atan2(shardOutline(id, 0, 0, 10)[0]!.y, shardOutline(id, 0, 0, 10)[0]!.x);
    expect(new Set(IDS.map((i) => Math.round(angleOf(i) * 10))).size).toBeGreaterThan(3);
  });

  it("is deterministic and bounded — a replayed tape draws the same floor", () => {
    expect(shardOutline(9, 4, 5, 10)).toEqual(shardOutline(9, 4, 5, 10));
    const cap = 10 * (SHARD_TIP_MIN + SHARD_TIP_SPAN) * SHARD_LONG;
    for (const id of IDS) for (const r of radii(id)) expect(r).toBeLessThanOrEqual(cap + 1e-9);
  });
});
