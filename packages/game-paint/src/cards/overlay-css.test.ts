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

  // ── PK-R6 · H1 · THE ROUND-1 CRITIQUE, LOCKED ──────────────────────────────
  // A blind critic judging screenshots of the running build named five defects
  // in this stylesheet, and every one of them was a beat with no PICTURE at the
  // frame the harness caught. Fixing that is easy to undo by accident — a
  // re-tune that flattens the iris back into a dim, or a „simplification" that
  // drops the chalk ghosts, looks like tidying and reads like the old defect.
  // So each fix leaves a check behind.
  it("the ink iris has an APERTURE — a mid-wipe frame is a hole, not a dim", () => {
    // finding 2: „shows no iris shape at all — just a uniform darken/fade".
    // The blob must be transparent at its own centre and inked at the rim; an
    // opaque-from-edge-to-edge blob is a screen-dim wearing a rotation.
    const w = baseRule(PAINT_OVERLAY_CSS, "pb-wipe");
    expect(w).toMatch(/background:\s*radial-gradient\(ellipse/);
    expect(w).toMatch(/rgba\(23,\s*16,\s*9,\s*0\)\s+0\s+\d/); // clear, from the centre out
    expect(w).toContain("#17100a"); // …and the inked rim that makes it read as an edge
  });

  it("both iris blobs and the veil's light aim at the being, not at the screen", () => {
    // finding 9: the panel is composed off to one side with no link to what it
    // interrupts. It may not move (PB-F1/F2-20), so the world's light comes to
    // it — one custom property, read by all three surfaces.
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-veil")).toContain("var(--pb-focus");
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-wipe")).toContain("var(--pb-focus");
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-wipe-b")).toContain("var(--pb-focus");
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-tether")).not.toBe("");
  });

  it("the veil holds the world legible long enough for the contact burst", () => {
    // finding 1: the burst was thrown into the world in the same frame the veil
    // went up, so the impact happened underneath the ink. The ramp must have a
    // low-opacity waypoint — a single from-0-to-full fade buries it again.
    const veilFrames = PAINT_OVERLAY_CSS.match(/@keyframes pb-veil-in\s*\{[^]*?\n\}/)?.[0] ?? "";
    expect(veilFrames).toMatch(/\d+%\s*\{\s*opacity:\s*0\.[0-3]/);
  });

  it("the card LANDS: it overshoots past its size and blooms a contact shadow", () => {
    // finding 10: „no squash/settle, no contact shadow bloom — a simple appear cut"
    const frames = PAINT_OVERLAY_CSS.match(/@keyframes pb-card-in\s*\{[^]*?\n\}/)?.[0] ?? "";
    expect(frames).toMatch(/scale\(1\.0[1-9]/); // past 1, then back to the base
    expect(frames.match(/box-shadow/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it("every flying letter has a chalk ghost to land into", () => {
    // finding 4: „almost entirely washed out and illegible". The word must be
    // readable at EVERY frame of the stagger, which means the slot carries the
    // character before the letter arrives in it.
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-slot::before")).toContain("content: attr(data-ch)");
    // …and the ink must be up early, or mid-flight glyphs are half-there again
    const frames = PAINT_OVERLAY_CSS.match(/@keyframes pb-letter-fly\s*\{[^]*?\n\}/)?.[0] ?? "";
    const at = Number(frames.match(/(\d+)%\s*\{\s*opacity:\s*1/)?.[1] ?? 100);
    expect(at).toBeLessThanOrEqual(45);
  });

  it("the doff's BASE state is out of the way, so a still world is watchable", () => {
    // the restore-hold's whole job is to let the world's change be SEEN; with
    // animations killed the card must already be gone, not sitting at full
    // opacity over the change it was supposed to reveal
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-doff")).toMatch(/opacity:\s*0/);
  });
});
