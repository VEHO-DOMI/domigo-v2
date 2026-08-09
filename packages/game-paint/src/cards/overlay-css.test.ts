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

  // ── PK-R6 · H2 · THE ROUND-2 CRITIQUE, LOCKED ─────────────────────────────
  it("the iris edge is INKED, not a Gaussian — the blot has drips", () => {
    // finding 5: „a perfectly smooth radial blur with no irregular or brushed
    // boundary — a generic digital spotlight rather than part of the painted
    // world". One radial-gradient has exactly one perfectly circular, perfectly
    // even edge; ink does not. Both blobs must carry extra layers at their own
    // centres (the drips and spatters that bite into the opening), and the
    // aperture's own falloff must be STEPPED rather than a two-stop ramp.
    for (const cls of ["pb-wipe", "pb-wipe-b"]) {
      const w = baseRule(PAINT_OVERLAY_CSS, cls);
      const layers = [...w.matchAll(/radial-gradient\(/g)].length;
      expect(layers, `${cls} has only ${layers} ink layer(s)`).toBeGreaterThanOrEqual(5);
      // the drips sit at their OWN centres — a stack of layers all at 50% 47%
      // is one edge drawn several times, which is the smooth edge again
      const centres = new Set([...w.matchAll(/at\s+([\d.]+%\s+[\d.]+%)/g)].map((m) => m[1]));
      expect(centres.size, `${cls} draws every layer at the same centre`).toBeGreaterThanOrEqual(4);
      // …and they are listed BEFORE the field: CSS paints background layers
      // front to back, so a drip after the field is hidden behind it
      const field = w.indexOf("radial-gradient(ellipse 8%") >= 0
        ? w.indexOf("radial-gradient(ellipse 8%")
        : w.indexOf("radial-gradient(ellipse 9%");
      expect(w.indexOf("radial-gradient(")).toBeLessThan(field);
      // the aperture's own falloff: ≥4 stops, so the wash pools instead of ramping
      const aperture = w.slice(field);
      const stops = [...aperture.matchAll(/\d+%\s*[,)]/g)].length;
      expect(stops, `${cls}'s aperture ramps in ${stops} stops`).toBeGreaterThanOrEqual(4);
    }
  });

  it("a flying letter never fully clears the ghost it is landing into", () => {
    // finding 3: „a second, smaller, misaligned »w« floats above the word". The
    // glyph and its ghost are the same character in the same slot, so the moment
    // the flight lifts the glyph clear of its own body the word carries that
    // letter twice. The type is 26 px, so the arc has to stay well inside that.
    const frames = PAINT_OVERLAY_CSS.match(/@keyframes pb-letter-fly\s*\{[^]*?\n\}/)?.[0] ?? "";
    const lift = Math.abs(Number(frames.match(/translateY\((-?[\d.]+)px\)/)?.[1] ?? 99));
    expect(lift, `the letter lifts ${lift}px clear of its ghost`).toBeLessThan(13);
    const scale = Number(frames.match(/scale\((0?\.\d+)\)/)?.[1] ?? 0);
    expect(scale, "the flying glyph is a different SIZE from its ghost").toBeGreaterThan(0.8);
  });

  it("the word lands in ONE ink: the ghost is the letter's own colour, weaker", () => {
    // finding 3's second half: „the settled letters are three different colours
    // (dark brown »br«, olive-green »o«, tan »wn«) instead of reading as one
    // word". The three were settled ink, a mid-flight blend and a WARM-BROWN
    // ghost; the ghost must be the same hue as the ink it precedes.
    const ghost = baseRule(PAINT_OVERLAY_CSS, "pb-slot::before");
    const rgb = ghost.match(/color:\s*rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    expect(rgb, "the chalk ghost lost its colour declaration").not.toBeNull();
    const [r, g, b] = [Number(rgb![1]), Number(rgb![2]), Number(rgb![3])];
    // the settled ink is #33291a — the ghost must be that hue, not another one
    const ink = [0x33, 0x29, 0x1a];
    const hue = (c: number[]): number => (c[0]! - c[2]!) / Math.max(c[0]!, 1);
    expect(Math.abs(hue([r, g, b]) - hue(ink))).toBeLessThan(0.08);
    expect(Number(rgb![4])).toBeLessThan(0.5); // …and weaker, or it is not a ghost
  });

  // ── PK-R6 · H1 · THE CEREMONY SURFACES, LOCKED ────────────────────────────
  // The goal card, the score page and the door out were dressed as web modals
  // over a painting. Each fix below is one line of CSS away from being undone by
  // a tidy-up, and none of them would fail a typecheck.
  it("a ceremony's scrim is DEEP — the world recedes instead of competing", () => {
    // finding 7: „hooks, towels, idle character and props remain sharp and
    // high-contrast behind the modal". doc 44 §3.1.2 asks for „near-black, world
    // faintly visible"; the task card's veil is 0.06 in the middle by design
    // (its light sits on the being), so the ceremony needs its own, deeper wash.
    const deep = PAINT_OVERLAY_CSS.match(/\.pb-veil\.pb-veil-deep\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(deep, "the ceremony veil rule is gone").not.toBe("");
    const alphas = [...deep.matchAll(/rgba\([^)]*,\s*(0?\.\d+)\)/g)].map((m) => Number(m[1]));
    expect(Math.min(...alphas)).toBeGreaterThan(0.3); // even its lightest point
    expect(Math.max(...alphas)).toBeGreaterThan(0.7); // …and its edge is near-black
    expect(deep).toMatch(/backdrop-filter:\s*blur/); // …and the detail goes soft
    // it must still be DEEPER than the card veil it overrides, or it is decoration
    const base = baseRule(PAINT_OVERLAY_CSS, "pb-veil");
    const baseAlphas = [...base.matchAll(/rgba\([^)]*,\s*(0?\.\d+)\)/g)].map((m) => Number(m[1]));
    expect(Math.min(...alphas)).toBeGreaterThan(Math.min(...baseAlphas));
  });

  it("the primary and secondary actions are not the same button", () => {
    // finding 8: „every ceremony button uses identical styling regardless of
    // action weight (start level, dismiss, retry, back)"
    const primary = PAINT_OVERLAY_CSS.match(/\.pb-card button\.pb-btn-primary[^{]*\{([^}]*)\}/)?.[1] ?? "";
    const ghost = PAINT_OVERLAY_CSS.match(/\.pb-card \.pb-btn-ghost\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(primary).toMatch(/background-color:\s*#[0-9a-f]{6}/i);
    expect(ghost).toMatch(/background-color:/);
    expect(primary.match(/background-color:\s*(#[0-9a-f]{6})/i)?.[1])
      .not.toBe(ghost.match(/background-color:\s*(#[0-9a-f]{6})/i)?.[1]);
    // the anchor form matters: the way out of a chapter is a link, not a button
    expect(PAINT_OVERLAY_CSS).toContain(".pb-card a.pb-btn-primary");
    // and both must come AFTER the generic chip rule, or the ghost (which has
    // the same specificity) loses to it and quietly stops being lighter
    expect(PAINT_OVERLAY_CSS.indexOf(".pb-card .pb-btn-ghost"))
      .toBeGreaterThan(PAINT_OVERLAY_CSS.indexOf(".pb-card button, .pb-card .pb-chip"));
  });

  it("the HUD chip is painted paper, not a pill", () => {
    // finding 1: the counters sit on the page ABOVE the canvas, which is why a
    // 999 px radius and a flat fill made them the flattest thing in the frame
    const chip = baseRule(PAINT_OVERLAY_CSS, "pb-hud-chip");
    expect(chip).not.toMatch(/border-radius:\s*999px/);
    expect(chip).toMatch(/border-radius:[^;]*\//); // four corners that disagree
    expect(chip).toMatch(/repeating-linear-gradient/); // the paper's own fibre
  });

  it("the child's hop ENDS standing in his cheer", () => {
    // finding 4's character half: with animations killed the score page must
    // still show a boy mid-celebration, never one frozen half-arrived
    const frames = PAINT_OVERLAY_CSS.match(/@keyframes pb-hero-in\s*\{[^]*?\n\}/)?.[0] ?? "";
    expect(frames).toMatch(/0%\s*\{\s*opacity:\s*0/);
    expect(frames).not.toMatch(/100%|\bto\b/); // no end frame: the base IS the end
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-hero-in")).toMatch(/animation:\s*pb-hero-in/);
  });

  it("the doff's BASE state is out of the way, so a still world is watchable", () => {
    // the restore-hold's whole job is to let the world's change be SEEN; with
    // animations killed the card must already be gone, not sitting at full
    // opacity over the change it was supposed to reveal
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-doff")).toMatch(/opacity:\s*0/);
  });
});
