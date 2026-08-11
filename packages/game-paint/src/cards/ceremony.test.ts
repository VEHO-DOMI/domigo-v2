// PK-R6 · H1 · THE PAYOFF, LOCKED (round-1 critique, ceremonies finding 4).
//
// The score page's celebration is the easiest thing in this repo to quietly
// undo: a „simplification" that drops the count-up, a re-tune that lets a line
// overshoot its own total, a refactor that reaches for Math.random because a
// burst „should look random". Each of those looks like tidying and reads like
// the defect the critic named. So the beat's arithmetic is pure and every
// promise it makes is asserted here.
import { describe, expect, it } from "vitest";
import {
  BURST_MAX, BURST_MIN, COUNT_UP_MS, COUNT_UP_STAGGER_MS, bonusPhrase, phraseText,
  burstMotes, countUpAt, countUpTotalMs, heroParts, runCompletion,
} from "./ceremony.ts";
import { RIG_PART_ORDER } from "../rigSpec.ts";
import { letterGlyphs } from "../letters.ts";

describe("the count-up (the chapter's numbers, arriving)", () => {
  it("starts at nothing and ends EXACTLY on the target", () => {
    expect(countUpAt(32, 0)).toBe(0);
    expect(countUpAt(32, COUNT_UP_MS)).toBe(32);
    expect(countUpAt(32, 99_999)).toBe(32);
  });

  it("never overshoots — not for a single frame", () => {
    // a line that reads „33 von 32" on the way up is the letter-honesty law
    // broken in the one place a child is being told how they did
    for (let ms = -200; ms <= 3000; ms += 7) {
      for (const target of [1, 3, 12, 32]) {
        const v = countUpAt(target, ms, 2);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(target);
      }
    }
  });

  it("is monotone: a tally never counts backwards", () => {
    let prev = 0;
    for (let ms = 0; ms <= 2000; ms += 11) {
      const v = countUpAt(32, ms, 1);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it("staggers: a lower line has not started while the one above it runs", () => {
    const mid = COUNT_UP_MS / 2;
    expect(countUpAt(32, mid, 0)).toBeGreaterThan(0);
    expect(countUpAt(32, mid, 4)).toBe(0); // four rows down, still untouched
    expect(countUpTotalMs(5)).toBe(5 * COUNT_UP_STAGGER_MS + COUNT_UP_MS);
  });

  it("a zero line simply stays zero (nothing to count up to)", () => {
    for (let ms = 0; ms <= 1200; ms += 60) expect(countUpAt(0, ms)).toBe(0);
  });
});

describe("the flourish (how big the party is allowed to be)", () => {
  it("measures the run, and ignores lines the chapter never hid", () => {
    expect(runCompletion([{ got: 1, total: 1 }, { got: 32, total: 32 }])).toBe(1);
    expect(runCompletion([{ got: 0, total: 1 }, { got: 0, total: 32 }])).toBe(0);
    expect(runCompletion([{ got: 1, total: 1 }, { got: 0, total: 0 }])).toBe(1);
    expect(runCompletion([])).toBe(1);
    expect(runCompletion([{ got: 5, total: 2 }])).toBe(1); // clamped, never >1
  });

  it("always throws SOMETHING — finishing the chapter is the win", () => {
    // the floor is the fix for exactly what the critic saw: a completion moment
    // with no visible celebration at all
    expect(burstMotes(0)).toHaveLength(BURST_MIN);
    expect(burstMotes(1)).toHaveLength(BURST_MAX);
    expect(burstMotes(0.5).length).toBeGreaterThan(BURST_MIN);
  });

  it("is DETERMINISTIC — a replayed tape shows the child's own party", () => {
    expect(burstMotes(0.75)).toEqual(burstMotes(0.75));
    for (const m of burstMotes(1)) {
      expect(Number.isFinite(m.dx) && Number.isFinite(m.dy)).toBe(true);
      expect(m.size).toBeGreaterThan(0);
      expect(m.delayMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("throws in every direction rather than along one line", () => {
    const m = burstMotes(1);
    expect(m.some((x) => x.dx > 20)).toBe(true);
    expect(m.some((x) => x.dx < -20)).toBe(true);
    expect(m.some((x) => x.dy < -20)).toBe(true);
    expect(m.some((x) => x.dy > 20)).toBe(true);
  });
});

describe("the child, mid-cheer (findings 4 + 6)", () => {
  const parts = heroParts(140);

  it("is the SHIPPED rig, in draw order, minus the parts it hides itself", () => {
    // the quill only exists while hovering, and the hair tuft is hidden by the
    // rig on purpose (W0-F5: the head cells carry hair, so the tuft double-drew)
    const order = parts.map((p) => p.part);
    expect(order).toEqual(RIG_PART_ORDER.filter((n) => n !== "rotor" && n !== "hair"));
  });

  it("wears the celebrate face — the one cell that had never been shown", () => {
    expect(parts.find((p) => p.part === "head")?.stem).toBe("head_celebrate");
  });

  it("FLARES: both hands are up above the body, open", () => {
    // the leap silhouette is the whole reason this pose was picked — a cheer a
    // child cannot read from the shape alone is the old idle in a party hat
    const body = parts.find((p) => p.part === "body")!;
    for (const h of ["handF", "handB"] as const) {
      const hand = parts.find((p) => p.part === h)!;
      expect(hand.y).toBeLessThan(body.y - 8);
      expect(hand.stem).toBe("hand_open");
    }
  });

  it("stands the right way up and scales with the height it is asked for", () => {
    const body = parts.find((p) => p.part === "body")!;
    const foot = parts.find((p) => p.part === "footF")!;
    const head = parts.find((p) => p.part === "head")!;
    expect(foot.y).toBeGreaterThan(body.y);
    expect(head.y).toBeLessThan(body.y);
    const bigger = heroParts(280).find((p) => p.part === "body")!;
    expect(bigger.size).toBeCloseTo(body.size * 2, 5);
  });

  it("mirrors and shades the far hand exactly as the scene does", () => {
    const back = parts.find((p) => p.part === "handB")!;
    const front = parts.find((p) => p.part === "handF")!;
    expect([back.flip, back.dim]).toEqual([true, true]);
    expect([front.flip, front.dim]).toEqual([false, false]);
    expect(back.size).toBeLessThan(parts.find((p) => p.part === "body")!.size);
  });
});

// ── R5-C1 · THE KLECKSKAMMER'S PHRASE ────────────────────────────────────────
//
// The end card used to say „PERFEKT! Alle 12 Buchstaben" — a count, over a room
// whose whole point is that its twelve letters SPELL something (p9.md §5: the
// catches are laid out as SCHOOL THINGS, with gaps for what was missed, so a
// partial run reads as a partial word instead of a fraction).
//
// Two things have to be true of that layout and neither is obvious:
//  · it describes THIS visit. The room can be paid for twice, and the shell's
//    own taken-cells ledger is cumulative across visits — read that and a
//    second run shows letters the child did not catch this time.
//  · the gaps and the number agree. A card that prints „7 von 12" beside nine
//    filled slots is a new lie in the place of the old one.
describe("R5-C1 · the bonus room's phrase, laid out (p9.md §5/§10)", () => {
  // a miniature room: 12 collectible cells, ordered left to right
  const rows = [
    "############",
    "*..........*",
    ".*........*.",
    "..*......*..",
    "...*....*...",
    "....*..*....",
    ".....**.....",
  ];
  const all = new Set(letterGlyphs(rows, ["school", "things"]).map((g) => `${g.c},${g.r}`));
  const key = (i: number): string => {
    const g = letterGlyphs(rows, ["school", "things"])[i]!;
    return `${g.c},${g.r}`;
  };

  it("spells the phrase in the order the child walks it", () => {
    expect(phraseText(bonusPhrase(rows, ["school", "things"], all))).toBe("SCHOOL THINGS");
  });

  it("puts the gap exactly where the letter was missed", () => {
    const missedSixth = new Set([...all].filter((k) => k !== key(5)));
    expect(phraseText(bonusPhrase(rows, ["school", "things"], missedSixth))).toBe("SCHOO_ THINGS");
  });

  it("nothing caught ⇒ every slot is a gap, and the words still stand apart", () => {
    expect(phraseText(bonusPhrase(rows, ["school", "things"], new Set()))).toBe("______ ______");
  });

  it("the filled slots ALWAYS equal the run's count — for every subset", () => {
    const cells = [...all];
    for (let n = 0; n <= cells.length; n++) {
      const taken = new Set(cells.slice(0, n));
      const slots = bonusPhrase(rows, ["school", "things"], taken).flat();
      expect(slots.filter((s) => s.taken)).toHaveLength(n);
      expect(slots.filter((s) => !s.taken)).toHaveLength(cells.length - n);
    }
  });

  it("falls back to the A→Z trail when a phase declares no words — and never renders „?“", () => {
    const slots = bonusPhrase(rows, undefined, all).flat();
    expect(slots.map((s) => s.char).join("")).toBe("ABCDEFGHIJKL");
    expect(slots.some((s) => s.char === "?")).toBe(false);
  });

  it("splits into the declared words, not into one run", () => {
    expect(bonusPhrase(rows, ["school", "things"], all).map((w) => w.length)).toEqual([6, 6]);
  });
});
