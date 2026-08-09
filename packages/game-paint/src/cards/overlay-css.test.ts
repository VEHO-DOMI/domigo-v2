// PK-R3a · R3-8 — THE END-STATES LAW, as a machine check (doc 42 §1).
//
// „Base styles are authored as END STATES, so a motionless battle is complete
// rather than stuck" is a standing rule, and a rule without a check is a wish.
// A new overlay animation added six months from now will be forgotten in the
// reduced-motion kill list by exactly the person who is sure they will remember.
// So: the stylesheet is parsed, and the two halves are proven against each
// other — every animated class is killed, and nothing is killed that is not
// animated (a stale entry is how a kill list quietly stops meaning anything).
import { describe, expect, it } from "vitest";
import {
  CARD_ENTER_DELAY_MS, CARD_ENTER_MS, IRIS_B_DELAY_MS, IRIS_B_MS, IRIS_MS,
  PAINT_OVERLAY_CSS, QUICKFIRE_MS,
} from "./overlay-css.ts";
import { LETTER_FLY_MS } from "./resolution.ts";

/** Every `.pb-…` class whose rule declares an `animation:` shorthand. */
const animatedClasses = (css: string): Set<string> => {
  const out = new Set<string>();
  // strip the reduced-motion block — its job is to REMOVE animation
  const body = css.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*$/, "");
  for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1] ?? "";
    const decls = m[2] ?? "";
    if (!/(^|\s|;)animation:/.test(decls)) continue;
    for (const c of selector.matchAll(/\.(pb-[a-z0-9-]+)/g)) out.add(c[1]!);
  }
  return out;
};

/** Every `.pb-…` class inside the reduced-motion block. */
const killedClasses = (css: string): Set<string> => {
  const block = css.match(/@media\s*\(prefers-reduced-motion[^{]*\{([\s\S]*)\}\s*$/);
  const out = new Set<string>();
  for (const c of (block?.[1] ?? "").matchAll(/\.(pb-[a-z0-9-]+)/g)) out.add(c[1]!);
  return out;
};

/** The declarations of one class's base rule (outside the media block). */
const baseRule = (css: string, cls: string): string => {
  const body = css.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*$/, "");
  for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (new RegExp(`\\.${cls}(\\s|,|\\{|$)`).test(m[1] ?? "")) return m[2] ?? "";
  }
  return "";
};

describe("the end-states law (doc 42 §1)", () => {
  const animated = animatedClasses(PAINT_OVERLAY_CSS);
  const killed = killedClasses(PAINT_OVERLAY_CSS);

  it("finds the overlay's animated classes at all (the parser is not vacuous)", () => {
    expect(animated.size).toBeGreaterThanOrEqual(6);
    expect(animated.has("pb-card")).toBe(true);
  });

  it("EVERY animated class is killed under reduced motion", () => {
    const missed = [...animated].filter((c) => !killed.has(c));
    expect(missed, `not in the reduced-motion kill list: ${missed.join(", ")}`).toEqual([]);
  });

  it("nothing is killed that is not animated (no stale entries)", () => {
    const stale = [...killed].filter((c) => !animated.has(c));
    expect(stale, `killed but never animated: ${stale.join(", ")}`).toEqual([]);
  });

  it("the ink bloom's BASE state is gone, not mid-swell", () => {
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-wipe")).toMatch(/transform:\s*translate\(-50%, -50%\) scale\(0\)/);
  });

  it("the chalk clock's BASE state is a full line, not an empty one", () => {
    // with animations off the chalk simply sits there — a countdown that reads
    // as already expired would tell a child they were out of time on arrival
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-ring")).toMatch(/width:\s*100%/);
  });

  it("the card's entrance delay matches the choreography constant", () => {
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-card")).toContain(`${CARD_ENTER_DELAY_MS}ms`);
  });

  it("the clock's CSS fallback duration agrees with the timer that closes the card", () => {
    // a ring that empties before (or after) the card closes is a countdown to
    // nothing — the exact class of lie the door-price law was written for
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-ring")).toContain(`--pb-ring-s, ${QUICKFIRE_MS / 1000}s`);
  });

  // ── PK-R6 · C · THE MINED TIMINGS, LOCKED (doc 44 §3.1.1, doc 42's law) ────
  // „Timings from the mined builds are used verbatim" is a claim, and a claim
  // with no check is how PK-R3a's iris quietly became 640 ms and its card 240 ms
  // with nobody able to say when. These assert the v0 numbers against the
  // stylesheet that ships, so the next re-tune has to be deliberate.
  it("the ink iris runs the v0 dg-bs-swirl's 700 ms", () => {
    expect(IRIS_MS).toBe(700);
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-wipe")).toMatch(/animation:\s*pb-wipe 700ms cubic-bezier\(0\.6, 0, 0\.4, 1\)/);
  });

  it("the SECOND blob is 60 ms behind it over 640 ms (v0 dg-bs-swirl-blob-b)", () => {
    expect([IRIS_B_DELAY_MS, IRIS_B_MS]).toEqual([60, 640]);
    const b = baseRule(PAINT_OVERLAY_CSS, "pb-wipe-b");
    expect(b).toContain("animation-delay: 60ms");
    expect(b).toContain("animation-duration: 640ms");
    // it must NOT declare its own animation shorthand: it rides .pb-wipe's, and
    // that is what keeps one kill-list entry covering both blobs
    expect(b).not.toMatch(/(^|\s|;)animation:/);
  });

  it("the card lands 260 ms late over 420 ms (v0 dg-bs-card-in)", () => {
    expect([CARD_ENTER_DELAY_MS, CARD_ENTER_MS]).toEqual([260, 420]);
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-card")).toMatch(/animation:\s*pb-card-in 420ms 260ms/);
  });

  it("a letter's flight is the v0 dg-bs-letter-fly's 460 ms", () => {
    expect(LETTER_FLY_MS).toBe(460);
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-letter")).toMatch(/animation:\s*pb-letter-fly 460ms/);
  });

  it("the doff's BASE state is out of the way, so a still world is watchable", () => {
    // the restore-hold's whole job is to let the world's change be SEEN; with
    // animations killed the card must already be gone, not sitting at full
    // opacity over the change it was supposed to reveal
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-doff")).toMatch(/opacity:\s*0/);
  });
});
