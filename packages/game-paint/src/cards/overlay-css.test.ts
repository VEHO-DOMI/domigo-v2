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
import fs from "node:fs";
import path from "node:path";
import {
  CARD_ENTER_DELAY_MS, CARD_ENTER_MS, IRIS_B_DELAY_MS, IRIS_B_MS, IRIS_MS,
  PAINT_OVERLAY_CSS, QUICKFIRE_MS,
} from "./overlay-css.ts";
import { LETTER_FLY_MS } from "./resolution.ts";
import { cardBtn } from "./CardShell.tsx";

/** Every `.pb-…` class whose rule declares MOTION — an `animation:` shorthand or
 *  a `transition:`.
 *
 *  R5-W2 · I1: it used to mean `animation:` only, and that was a hole rather
 *  than a definition. Three classes (`.pb-card button`, `.pb-help-body`, and the
 *  HUD chip this packet made clickable) move via `transition:` and were
 *  therefore invisible to BOTH halves of this law — never required to be killed,
 *  and unkillable without tripping the symmetry check. A child who asks for
 *  reduced motion is asking for no motion, not for no keyframes. */
const animatedClasses = (css: string): Set<string> => {
  const out = new Set<string>();
  // strip the reduced-motion block — its job is to REMOVE animation
  const body = css.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*$/, "");
  for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1] ?? "";
    const decls = m[2] ?? "";
    if (!/(^|\s|;)(animation|transition):/.test(decls)) continue;
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

/** Every rule outside the media block, as { sel, decls } — R5-W3 · J2. */
const rules = (css: string): { sel: string; decls: string }[] => {
  const body = css.replace(/@media\s*\(prefers-reduced-motion[^{]*\{[\s\S]*$/, "");
  return [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1] ?? "", decls: m[2] ?? "" }));
};

/** The values of a rule's `border-width:`, or []. Splits on TOP-LEVEL spaces
 *  only, because every width in the hand is a `calc(... * 1.25)` and calc
 *  contains spaces of its own. */
const widths = (decls: string): string[] => {
  const m = decls.match(/(^|[\s;])border-width:\s*([^;]+)/);
  return m ? m[2]!.trim().split(/\s+(?![^(]*\))/) : [];
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

  it("R5-W6b · D4 · a primary button that brings no inline padding still fits its own text", () => {
    // P5 read „Ins Buch kleben" as „ns Buch kleben", twice in a row. The cause was
    // never the text: `.pb-card button` hands out colour, edge and radius but no
    // padding, no font-size and no font-family, and the three RulePage buttons are
    // the only primaries in the game that set nothing inline. Browser defaults
    // (~6 px horizontal padding, 13 px system font) under a 4 px ink edge with an
    // uneven radius (--pb-chip-r: 18/9/20/11) is what ate the first letter.
    //
    // The law is on the RULE rather than on the three call sites, because the next
    // painted button will be written the same way. And it is measured against
    // CardShell#cardBtn instead of against a literal: two numbers for one look are
    // two numbers waiting to disagree (the argument artManifest.ts makes for stems).
    const primary = PAINT_OVERLAY_CSS.match(/\.pb-card button\.pb-btn-primary[^{]*\{([^}]*)\}/)?.[1] ?? "";
    const px = (decl: string): number => Number(primary.match(new RegExp(`(^|[\\s;])${decl}:\\s*([0-9.]+)px`))?.[2] ?? NaN);

    const padX = Number(primary.match(/(^|[\s;])padding:\s*[0-9.]+px\s+([0-9.]+)px/)?.[2] ?? NaN);
    const inlinePadX = Number(String(cardBtn.padding).split(/\s+/)[1]?.replace("px", ""));
    expect(padX, "die Primär-Regel deklariert kein waagrechtes Polster — der Radius frisst den ersten Buchstaben").toBe(inlinePadX);
    expect(padX).toBeGreaterThanOrEqual(16);

    expect(px("font-size"), "keine Schriftgröße: der Knopf erbt 13 px Systemschrift neben 18 px Fließtext").toBe(cardBtn.fontSize);
    expect(px("min-height"), "keine Mindesthöhe: der Fingerboden aus D1 gilt für JEDEN Knopf").toBe(cardBtn.minHeight);
    // …und dieselbe Hand wie die Antwort-Chips: die Regel-Seite trug bis heute die
    // Systemschrift des Browsers mitten im Buch (P5s zweiter Halbsatz).
    expect(primary).toMatch(/font-family:\s*var\(--font-label/);
    expect(String(cardBtn.fontFamily)).toContain("--font-label");
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

// ── PK-R6 · H2 · THE WORLD BESIDE THE CARD (round-2 finding 6) ──────────────
// „The card sits right-of-center, cutting a floating shelf/platform in half at
// the frame edge behind it" — the exposed strip read as a framing mistake.
describe("PK-R6 · H2 · the world behind the card is out of focus, except its subject", () => {
  const defocus = (): string => baseRule(PAINT_OVERLAY_CSS, "pb-defocus");

  it("pushes the exposed world out of focus", () => {
    expect(defocus(), "the defocus layer is gone").not.toBe("");
    expect(defocus()).toMatch(/(^|[\s;{])backdrop-filter:\s*blur/m);
    expect(defocus()).toMatch(/(^|[\s;{])-webkit-backdrop-filter:\s*blur/m); // …in Safari too
  });

  it("keeps the BEING the card is about sharp — masked on the card's own focus", () => {
    // the restore-hold exists so the child can watch the colour come back to
    // that being; blurring it would undo the payoff the whole beat was built for
    // anchored, because »-webkit-mask-image« CONTAINS »mask-image«: a loose
    // match here passed a tamper that had deleted the standard property
    // outright, which is the whole reason this file tamper-checks itself
    expect(defocus()).toMatch(/(^|[\s;{])mask-image:\s*radial-gradient/m);
    expect(defocus()).toMatch(/(^|[\s;{])-webkit-mask-image:\s*radial-gradient/m);
    expect(defocus()).toContain("var(--pb-focus");
    // …and the mask is TRANSPARENT at its centre (no blur on the subject) and
    // opaque at the frame's edge (full blur where the card cuts the world)
    const stops = [...defocus().matchAll(/rgba\(0,0,0,([01](?:\.\d+)?)\)/g)].map((m) => Number(m[1]));
    expect(stops[0]).toBe(0);
    expect(Math.max(...stops)).toBe(1);
  });

  it("never eats the card with the world", () => {
    // the card is a CHILD of .pb-veil, so this had to be its own layer: a mask
    // on the veil would have made the card itself semi-transparent
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-veil")).not.toMatch(/mask-image/);
    expect(defocus()).toMatch(/pointer-events:\s*none/);
  });
});

/* ── R5-W2 · J1-A · THE NAIVE LOOK, AS KNOBS ─────────────────────────────────
   Koki ruled the look from three pictures (doc 45 §G2, 2026-08-13). It was a
   throwaway stylesheet in a screenshot script; this round builds it once. These
   three cases hold the two properties that make it a BUILD rather than a paste:
   the values are knobs in one place, and the lean is a picture rather than
   motion. */
describe("R5-W2 · J1-A · the naive card is knobs, and its lean survives the landing", () => {
  const card = baseRule(PAINT_OVERLAY_CSS, "pb-card");

  it("declares the look's knobs on the card itself — and READS them", () => {
    // on .pb-card and not on a root: everything that wears this look is a
    // DESCENDANT of the card, so the HUD outside the veil and the platform
    // outside the game cannot inherit it. The scope wall is the cascade, not
    // a promise in a doc (doc 45 §G2 defers the platform to its own round).
    for (const t of ["--pb-paper", "--pb-ink", "--pb-ink-w", "--pb-card-r", "--pb-chip-r", "--pb-card-tilt"]) {
      expect(card, `${t} is not declared on .pb-card`).toContain(`${t}:`);
    }
    expect(card).toMatch(/border-radius:\s*var\(--pb-card-r\)/);
    // R5-W3 · J2 · R21: the card's edge became FOUR widths (the hand), and
    // »border:« carries only one. The law is unchanged — the card must read the
    // knobs it declares — but its proof moved from one spelling to the property
    // itself, plus a guard against the failure the new spelling invites: a later
    // »border:« shorthand in this rule would silently flatten all four sides
    // back to one, and no screenshot at rest would look wrong for it.
    expect(card).toMatch(/border-style:\s*solid/);
    expect(card).toMatch(/border-color:\s*var\(--pb-ink\)/);
    expect(card).toMatch(/border-width:[^;]*var\(--pb-ink-w\)/);
    expect(card, "a border shorthand would silently reset the three longhands").not.toMatch(/(^|\s|;)border:\s/);
    expect(card).toMatch(/transform:\s*rotate\(var\(--pb-card-tilt/);
  });

  it("has no naive knob declared outside the card — the scope wall, as a grep", () => {
    // a second declaration site is how a token quietly becomes global: the HUD
    // chip and the hub would start inheriting a look nobody ruled on for them.
    const outside = PAINT_OVERLAY_CSS.replace(/\.pb-card\s*\{[^}]*\}/, "");
    for (const t of ["--pb-paper:", "--pb-ink:", "--pb-card-tilt:", "--pb-chip-r:"]) {
      expect(outside, `${t} is declared a second time, outside .pb-card`).not.toContain(t);
    }
  });

  it("the lean rides the entrance — the card never snaps crooked in its last frame", () => {
    // the landing keyframes overwrite »transform« wholesale, so a rotation that
    // lived only in the base rule would fly in square and jerk over at the end.
    // A screenshot at rest cannot see this; the parser can.
    const frames = PAINT_OVERLAY_CSS.match(/@keyframes pb-card-in\s*\{[^]*?\n\}/)?.[0] ?? "";
    const steps = [...frames.matchAll(/transform:[^;]*;/g)].map((m) => m[0]);
    expect(steps.length, "the landing lost its keyframes").toBeGreaterThanOrEqual(2);
    for (const s of steps) expect(s).toContain("rotate(var(--pb-card-tilt");
  });

  it("the crooked things are STILL — a static rotate is a picture, not motion", () => {
    // both halves of the end-states law above would fire on a mistake here, and
    // they would be right: listing these would STRAIGHTEN the book for exactly
    // the child who asked for less movement.
    const animated = animatedClasses(PAINT_OVERLAY_CSS);
    const killed = killedClasses(PAINT_OVERLAY_CSS);
    for (const cls of ["pb-plate-wrap", "pb-plate", "pb-stamp", "pb-key"]) {
      expect(animated.has(cls), `${cls} declares motion`).toBe(false);
      expect(killed.has(cls), `${cls} sits in the reduced-motion kill list`).toBe(false);
    }
  });
});

/** R5-W3 · J2 · R21 · THE HAND, AND WHERE IT STOPS.
 *
 *  Koki's D2 ruling (docs/design/g1/paint/CARDUI_R5W_D2/README.md): the ANSWER
 *  chips lie there by hand, no two at the same angle — but »Los geht's!« and
 *  »Weiter« stay square, »weil der eine Schritt nach vorn kein hingeworfener
 *  Zettel ist«. Until this round that canon was held by nothing but selector
 *  scoping and two lines of prose: no test anywhere under packages/ asserted it.
 *
 *  This is the round that would have broken it — the geometry round reaches for
 *  every ruled edge on the card, and the button rule has the most visible edge
 *  of all. So the ruling stops being a habit and becomes a check. */
describe("R5-W3 · J2 · R21 · the hand, and where it stops (Kokis D2-Kanon)", () => {
  const ACTIONS = [".pb-btn-primary", ".pb-btn-ghost", ".pb-help-tab"];
  const all = rules(PAINT_OVERLAY_CSS);

  it("the tilt knob never leaves [data-chips] — that scoping IS the canon", () => {
    // every other button computes rotate(var(--pb-tilt, 0deg)) => 0deg, and it
    // does so because the knob does not exist for it. Move one declaration up to
    // .pb-card and every button on every card leans, the forward step included.
    const sites = all.filter((r) => /--pb-tilt:/.test(r.decls));
    expect(sites.length, "the four chip angles are gone").toBe(4);
    for (const r of sites) expect(r.sel, `--pb-tilt escapes its scope: ${r.sel}`).toContain("[data-chips]");
  });

  it("no action button rotates on its own", () => {
    for (const r of all) {
      if (!ACTIONS.some((a) => r.sel.includes(a))) continue;
      for (const d of r.decls.split(";")) {
        if (!/rotate\(/.test(d)) continue;
        // the exact spelling, not »no rotate at all«: the generic chip's :active
        // legitimately carries rotate(var(--pb-tilt, 0deg)) so a press can ride
        // an angle it does not itself create. A hand-written rotate(0deg) fails
        // here too, correctly — it is the spelling that invites a number.
        expect(d, `${r.sel} rotates on its own`).toContain("rotate(var(--pb-tilt, 0deg))");
      }
    }
  });

  it("the frames wear the hand and the buttons do not", () => {
    // the positive half first: without it this passes on a stylesheet where the
    // round was never built, and a law that green-lights nothing proves nothing
    for (const cls of ["pb-card", "pb-plate"]) {
      expect(widths(baseRule(PAINT_OVERLAY_CSS, cls)).length, `${cls} lost its hand`).toBe(4);
    }
    // …and the negative half
    for (const r of all) {
      const isAction = ACTIONS.some((a) => r.sel.includes(a));
      if (!isAction && !r.sel.includes(".pb-chip")) continue;
      expect(widths(r.decls).length, `${r.sel} wears the frames' hand`).toBeLessThanOrEqual(1);
    }
    // the chip keeps the SHORTHAND, and the shorthand is the statement
    // »one weight, all four sides«
    expect(PAINT_OVERLAY_CSS).toContain("border: var(--pb-ink-w-chip) solid var(--pb-ink)");
  });

  it("the hand redistributes weight and never adds any", () => {
    // opposite pairs sum to 2: the border box grows by zero on both axes. The
    // card already spends 4,3 px of its 14 px side clearance on the lean, and at
    // 375 px there is nothing left to spend.
    for (const cls of ["pb-card", "pb-plate"]) {
      const n = widths(baseRule(PAINT_OVERLAY_CSS, cls)).map((w) => Number(/\*\s*([\d.]+)\s*\)/.exec(w)?.[1]));
      expect(n.every(Number.isFinite), `${cls}'s hand is not multipliers of --pb-ink-w`).toBe(true);
      expect(n[0]! + n[2]!, `${cls} grew taller`).toBeCloseTo(2, 5);
      expect(n[1]! + n[3]!, `${cls} grew wider`).toBeCloseTo(2, 5);
    }
    // the two literal-width surfaces, against their own documented base. An
    // exception that is not declared is not an exception.
    const LITERAL_BASE: Record<string, number> = { "pb-rule-band": 4.0 };
    for (const [cls, base] of Object.entries(LITERAL_BASE)) {
      const four = widths(baseRule(PAINT_OVERLAY_CSS, cls)).map((w) => Number.parseFloat(w));
      expect(four.length, `${cls} lost its hand`).toBe(4);
      expect(four[0]! + four[2]!, `${cls} grew taller`).toBeCloseTo(base, 5);
      expect(four[1]! + four[3]!, `${cls} grew wider`).toBeCloseTo(base, 5);
    }

    // ── R5-W8 · D6 · DIE HAND VON ».pb-card::before« IST UMGEZOGEN ───────────
    // Sie stand bis heute in »border-width: 1.9px 3px 3.1px 2px«. Seit die zwei
    // Karten-Linien EIN eingebetteter Strichzug sind (P7 §3), steht sie in den
    // vier »stroke-width« desselben Elements — dieselben vier Zahlen, dieselbe
    // Eigenschaft: gegenüberliegende Seiten summieren sich zu ihrer Grundzahl,
    // die Hand VERTEILT Gewicht um und fügt keines hinzu. Der Nachzug auf der
    // Außenkante ist die zweite Vierergruppe und hat seine eigene Grundzahl.
    const striche = [...(all.find((r) => r.sel.includes(".pb-card::before"))?.decls ?? "")
      .matchAll(/stroke-width='([0-9.]+)'/g)].map((m) => Number.parseFloat(m[1]!));
    expect(striche.length, "pb-card::before lost its hand").toBe(8);
    for (const [name, vier, base] of [
      ["pb-card::before · Nachzug aussen", striche.slice(0, 4), 3.6],
      ["pb-card::before · Innenlinie", striche.slice(4), 5.0],
    ] as const) {
      expect(vier[0]! + vier[2]!, `${name} grew taller`).toBeCloseTo(base, 5);
      expect(vier[1]! + vier[3]!, `${name} grew wider`).toBeCloseTo(base, 5);
    }
  });

  it("the scrolling sheet never scrolls SIDEWAYS", () => {
    // CSS: if one axis is not »visible«, the other computes to »auto«. So the
    // vertical scroll hands the sheet a HORIZONTAL bar for free, and one
    // sub-pixel of overflow is enough to draw it — measured on the real page as
    // scrollWidth 265 vs clientWidth 264, rendered as a dark bar across the card
    // under the button. A card is read downwards and never sideways.
    const sheet = baseRule(PAINT_OVERLAY_CSS, "pb-card-scroll");
    expect(sheet, "the sheet lost its vertical scroll").toMatch(/overflow-y:\s*auto/);
    expect(sheet, "overflow-y alone also enables a horizontal bar").toMatch(/overflow-x:\s*hidden/);
  });

  // ── R5-W8 · D6 · D-529 + P7 §2.4 · DAS BLATT HAT EINE GRENZE, UND MAN SIEHT SIE ──
  it("the sheet carries its own height limit, not only the card's", () => {
    // D-529: heute schrumpft das Blatt mit, weil es ein Flex-Kind der Karte ist.
    // Das ist wahr und unsichtbar — nimmt eine künftige Karte das Blatt aus der
    // Spalte, fällt die Grenze lautlos weg und der Inhalt wird beschnitten statt
    // geblättert. Die Grenze steht deshalb am Element, das rollt.
    const sheet = baseRule(PAINT_OVERLAY_CSS, "pb-card-scroll");
    expect(sheet, "das Blatt hat keine eigene Höhen-Grenze mehr").toMatch(/max-height:\s*100%/);
  });

  it("the painted scrollbar is not switched off by the standard property", () => {
    // GEMESSEN, nicht vermutet (D6, an der lebenden Karte bei 760 x 700, einem
    // Fenster in dem das Blatt wirklich rollt): mit »scrollbar-width« in der
    // Grundregel belegt die Leiste 0 px und ist auf dem Mac unsichtbar; ohne sie
    // belegt der gemalte Balken 7 px und steht da. Sobald die STANDARD-
    // Eigenschaft gesetzt ist, wirft der Browser den ganzen
    // »::-webkit-scrollbar«-Block weg — die Karte trug also eine getuschte
    // Rollleiste, die nie jemand gesehen hat, und ein Kind bekam bei kleinem
    // Fenster keinen Hinweis, dass unter der Kante noch etwas steht.
    const sheet = baseRule(PAINT_OVERLAY_CSS, "pb-card-scroll");
    expect(sheet, "»scrollbar-width« in der Grundregel schaltet den gemalten Balken ab")
      .not.toMatch(/scrollbar-width/);
    // …und der gemalte Balken existiert überhaupt (sonst wäre das oben vakuum-grün)
    expect(PAINT_OVERLAY_CSS).toMatch(/\.pb-card-scroll::-webkit-scrollbar\s*\{[^}]*width:\s*7px/);
    // …und die Standard-Eigenschaft ist NICHT gestrichen, sondern steht dort, wo
    // es keinen gemalten Balken gibt: sonst bekäme Firefox die Systemleiste
    expect(PAINT_OVERLAY_CSS,
      "die Standard-Eigenschaft fehlt auch dort, wo es keinen gemalten Balken gibt")
      .toMatch(/@supports\s+not\s+selector\(::-webkit-scrollbar\)\s*\{[\s\S]*?scrollbar-width:\s*thin/);
  });

  it("--pb-ink-rgb has not drifted from --pb-ink", () => {
    // the one new knob is the same colour written a second way, for the surfaces
    // that need the family's pen at a strength of their own. A second name is a
    // drift risk; this is the price that makes it defensible.
    const card = baseRule(PAINT_OVERLAY_CSS, "pb-card");
    const hex = /--pb-ink:\s*#([0-9a-f]{6})/i.exec(card)?.[1] ?? "";
    const rgb = /--pb-ink-rgb:\s*(\d+),\s*(\d+),\s*(\d+)/.exec(card)?.slice(1).map(Number) ?? [];
    expect(hex, "--pb-ink is not a 6-digit hex any more").toHaveLength(6);
    expect(rgb, "--pb-ink-rgb has drifted from --pb-ink").toEqual([0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  });

  it("--pb-seal-rgb has not drifted from --pb-seal (R5-W9 · N1)", () => {
    // der zweite Zwilling des Hauses, angelegt für den Pinselwisch unter dem
    // Schlüssel-Englisch. Er bekommt dieselbe Fessel wie der erste am selben
    // Tag, an dem er entsteht — eine dauerhafte Absicht ohne Wächter ist keine.
    const card = baseRule(PAINT_OVERLAY_CSS, "pb-card");
    const hex = /--pb-seal:\s*#([0-9a-f]{6})/i.exec(card)?.[1] ?? "";
    const rgb = /--pb-seal-rgb:\s*(\d+),\s*(\d+),\s*(\d+)/.exec(card)?.slice(1).map(Number) ?? [];
    expect(hex, "--pb-seal is not a 6-digit hex any more").toHaveLength(6);
    expect(rgb, "--pb-seal-rgb has drifted from --pb-seal").toEqual([0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  });

  it("the four open surfaces read the family's ink — no pre-family contour is left inside the veil", () => {
    // R21: the open surfaces join. »#b78d51« was the amber contour of the era
    // before this look; after this round the ONE copy left is .pb-hud-chip, which
    // sits OUTSIDE the veil and cannot resolve a --pb-* token at all. That single
    // remaining hit turns a documented exception into something grep can see.
    // counted over DECLARATIONS, not raw text: a comment that names the old hex
    // (this round's do) is prose, and a law that trips on prose is a law nobody
    // keeps.
    const declsOnly = PAINT_OVERLAY_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    const hits = [...declsOnly.matchAll(/#b78d51/g)].length;
    expect(hits, "a pre-family contour came back inside the card").toBe(1);
    expect(baseRule(PAINT_OVERLAY_CSS, "pb-hud-chip")).toContain("#b78d51");
    // ★ R5-W9 · N1 · DAS GESETZ SAGT JETZT, WAS ES MEINT.
    //
    // Es stand als »jede dieser Klassen MUSS ein var(--pb-…) tragen« da, und das
    // ist eine Stellvertreter-Formulierung: gemeint war »keine trägt eine
    // festgetippte Tinte«. Der Unterschied wurde in dieser Runde bezahlt —
    // .pb-merk-slot hat seinen Zitat-Balken verloren (Kokis »KI-Optik«, Befund
    // D-770 Punkt 4) und trägt seitdem GAR KEINE Tinte mehr. Nach dem
    // Wortlaut war das ein Verstoss, nach dem Sinn die stärkste Erfüllung, die
    // es gibt. Ein Balken, den man nur wieder einbaut, damit ein Prüfer grün
    // wird, wäre der Fehler gewesen.
    //
    // Also: keine festgetippte Tinte, und jede Farb-Deklaration, die es gibt,
    // kommt aus der Familie. Die Liste wächst dabei um die vier Flächen, die N1
    // neu gebaut hat — eine Fläche, die nicht in der Liste steht, ist eine, die
    // niemand prüft.
    const OFFENE_FLAECHEN = [
      "pb-rule-band", "pb-merk-slot", "pb-eyebrow",
      "pb-rule-titel", "pb-en-mark", "pb-rule-zettel", "pb-bsp",
    ];
    // ⚠ KOMMENTARE ZUERST WEG. Der Vorgänger dieser Prüfung zählte ausdrücklich
    // über DEKLARATIONEN und nicht über Rohtext, und zwar weil .pb-rule-band in
    // seinem eigenen Kommentar den abgelösten Hex »#b78d51« NENNT. Ein Wächter,
    // der Prosa mitliest, meldet die Dokumentation des Fixes als den Fehler —
    // dieselbe Klasse hat im Register schon sechs Tage Fehlalarm gekostet.
    const declsOf = (cls: string): string =>
      baseRule(PAINT_OVERLAY_CSS, cls).replace(/\/\*[\s\S]*?\*\//g, "");
    for (const cls of OFFENE_FLAECHEN) {
      const rule = declsOf(cls);
      expect(baseRule(PAINT_OVERLAY_CSS, cls), `${cls} wurde nicht gefunden — die Suche ist blind, nicht grün`).not.toBe("");
      expect(rule, `${cls} trägt eine festgetippte Tinte`).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      // TINTE, nicht Schatten: `color`, Ränder und Gründe sind der Stift des
      // Buchs und gehören der Familie. `box-shadow` ist Schattierung — die
      // weichen Wolken der Karten sind seit jeher freie rgba-Werte, und sie
      // hier einzufangen hiesse, eine Regel zu erfinden, die das Haus nie
      // getroffen hat. Ausgenommen und gesagt, statt still nicht geprüft.
      for (const decl of rule.match(/(?:color|border[a-z-]*|background[a-z-]*|outline[a-z-]*)\s*:[^;]*/g) ?? []) {
        if (/\b(rgb|hsl)a?\(/.test(decl)) {
          expect(decl, `${cls}: eine Farbe ausserhalb der Familie`).toMatch(/var\(--pb-/);
        }
      }
    }
    // and the dead rules stay dead — dressing them would have been theatre.
    // `.pb-merk-topic` joined them in N1: es war der Versalien-Titel, den Koki
    // als unauffälligste Zeile der Karte gelesen hat.
    for (const dead of [".pb-portrait", ".pb-treasure-plate", ".pb-merk-topic"]) {
      expect(PAINT_OVERLAY_CSS, `${dead} came back`).not.toContain(`${dead} {`);
    }
  });
});

// ── R5-W4 · D3 · D-105 · THE STYLESHEET IS WELL-FORMED ──────────────────────
//
// This file shipped a stray `}` after the reduced-motion block. Nothing caught
// it and nothing could: the stylesheet is ONE template literal, so `tsc` sees a
// string, every check in this file matches with regexes that do not care about
// nesting, and a browser silently discards a top-level `}` and carries on. It
// was found by counting braces by hand — which is exactly the kind of check a
// person does once and a machine should do forever.
//
// The count runs on the CSS with comments stripped, because a comment may of
// course contain a brace, and it also walks the depth so an EARLY stray close
// (the dangerous case: it would end a block sooner than the author meant and
// quietly re-scope everything after it) is reported at the line it happens on
// rather than as a total at the end.
describe("R5-W4 · D3 · D-105 · the stylesheet's braces balance", () => {
  // comments out, LINE COUNT kept: a report that names a line the reader cannot
  // find in the file is a report they have to redo by hand
  const withoutComments = (css: string): string =>
    css.replace(/\/\*[\s\S]*?\*\//g, (c) => "\n".repeat((c.match(/\n/g) ?? []).length));

  /** how many lines of TypeScript sit above the template literal, so the number
   *  this test prints is the line the reader opens the FILE at */
  const headerLines = (): number => {
    // NOT indexOf(PAINT_OVERLAY_CSS): the literal interpolates its timing
    // constants, so the runtime string never appears verbatim in the source.
    // The line the literal OPENS on is the stable anchor.
    const src = fs.readFileSync(path.resolve(__dirname, "./overlay-css.ts"), "utf8");
    const lines = src.split("\n");
    // `at` is 0-based, and the literal's first line is the (empty) remainder of
    // the line the backtick opens on — so CSS line 1 IS that file line.
    const at = lines.findIndex((l) => /PAINT_OVERLAY_CSS\s*=\s*`/.test(l));
    return at < 0 ? 0 : at;
  };

  it("never closes a block that was not open, and ends at depth zero", () => {
    const lines = withoutComments(PAINT_OVERLAY_CSS).split("\n");
    const offset = headerLines();
    let depth = 0;
    let firstNegative: number | null = null;
    for (let i = 0; i < lines.length; i++) {
      for (const ch of lines[i]!) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth < 0 && firstNegative === null) firstNegative = i + 1 + offset;
        }
      }
    }
    expect(firstNegative, "a `}` closes a block that was never opened — overlay-css.ts line").toBe(null);
    expect(depth, "the stylesheet ends inside an unclosed block").toBe(0);
  });

  it("the reduced-motion block is the LAST thing in the file, and there is exactly one", () => {
    // P-78: a second block is how a kill list silently splits in two.
    const blocks = [...PAINT_OVERLAY_CSS.matchAll(/@media\s*\(prefers-reduced-motion/g)];
    expect(blocks.length, "more than one reduced-motion block").toBe(1);
    expect(PAINT_OVERLAY_CSS.trimEnd().endsWith("}"), "the file no longer ends on a closing brace").toBe(true);
  });
});

// ── R5-W4 · D3 · the three surfaces this packet changed ─────────────────────
describe("R5-W4 · D3 · the caption, the focus and the edge slot", () => {
  it("the picture's caption is readable type, not small print (Koki, 15 Aug)", () => {
    const cap = baseRule(PAINT_OVERLAY_CSS, "pb-cap");
    expect(cap, "the caption class is gone").not.toBe("");
    const size = Number(/font-size:\s*([\d.]+)px/.exec(cap)?.[1] ?? 0);
    expect(size, "the caption fell back under the readable floor").toBeGreaterThanOrEqual(15);
    // …and the quiet layer did NOT come with it: the hint lines under a dial are
    // quiet by design, and growing them would flatten D1's glance grammar.
    const quiet = Number(/font-size:\s*([\d.]+)px/.exec(baseRule(PAINT_OVERLAY_CSS, "pb-quiet"))?.[1] ?? 0);
    expect(quiet).toBeLessThan(size);
  });

  it("the focus veil is deeper than the plain one, and still lit over its subject", () => {
    const focus = baseRule(PAINT_OVERLAY_CSS, "pb-veil.pb-veil-focus") || (() => {
      const m = /\.pb-veil\.pb-veil-focus\s*\{([^}]*)\}/.exec(PAINT_OVERLAY_CSS);
      return m?.[1] ?? "";
    })();
    expect(focus, "the focus mode is gone").not.toBe("");
    expect(focus, "the focus veil stopped aiming at the being").toContain("var(--pb-focus");
    // every alpha in the focus veil outruns the plain veil's deepest stop (0.56)
    const alphas = [...focus.matchAll(/rgba\([^)]*?,\s*([\d.]+)\)/g)].map((m) => Number(m[1]));
    expect(alphas.length).toBeGreaterThanOrEqual(3);
    expect(Math.min(...alphas), "the focus veil is no darker than the plain one").toBeGreaterThan(0.4);
    expect(Math.max(...alphas), "the world is not taken far enough down").toBeGreaterThanOrEqual(0.9);
    // but never all the way out: the card is always ABOUT something over there
    expect(Math.max(...alphas), "the world is switched off entirely").toBeLessThan(1);
  });

  it("the painted-edge slot carries the MEASURED numbers and stays inert until a sheet is judged good (R63)", () => {
    // R5-W4b · D3b: the sheet (AQ11, variant b) is imported and in the repo, and
    // the slot is still switched off — a blind critic put the built edge beside
    // the ink border and chose the INK: the tiled crayon line read as „ein dicht
    // wiederholtes Rillenmuster mit sichtbarer Nahtstelle". An honest stop.
    //
    // What this law protects is the MEASUREMENT, not the state. Three rounds
    // established that the line runs down the middle of a 96 px slice, that the
    // importer must therefore trim 44 px, and that slice/width/outset are then
    // 52/52/0. Losing those numbers would cost the next attempt the same three
    // rounds, so they are pinned here rather than left in a report.
    const card = baseRule(PAINT_OVERLAY_CSS, "pb-card");
    expect(card).toContain("--pb-edge-image: none");
    expect(PAINT_OVERLAY_CSS).toContain("border-image-source: var(--pb-edge-image)");
    expect(card, "the measured slice was lost").toMatch(/--pb-edge-slice:\s*52\b/);
    const w = /--pb-edge-w:\s*(\d+(?:\.\d+)?)px/.exec(card);
    expect(w, "the explicit edge width was lost — inheriting the ink border squeezes a 52 px strip into 4").not.toBeNull();
    expect(Number(w![1]), "the width no longer matches the trimmed sheet's slice").toBe(52);
    expect(card, "the outset was lost — anything but 0 uncovers the card's own shadow stack").toMatch(/--pb-edge-out:\s*0px/);
    expect(PAINT_OVERLAY_CSS).toContain("border-image-width: var(--pb-edge-w)");
    // inert means inert: the hand-weighted border is what draws, and it is what
    // the critic preferred — its four different widths must survive untouched
    expect(card, "the hand lost its four widths").toMatch(/border-width:\s*calc/);
  });

  it("a child on an expensive connection gets the ink edge instead of the sheet (R63)", () => {
    // The fallback was promised with the slot and is the reason the whole look
    // hangs on ONE token. A rule that sets it back to »none« under
    // prefers-reduced-data is the entire mechanism — and it must sit before the
    // reduced-motion block at the end of the file (P-78).
    const data = /@media \(prefers-reduced-data: reduce\) \{([\s\S]*?)\n\}/.exec(PAINT_OVERLAY_CSS);
    expect(data, "no reduced-data fallback for the painted edge").not.toBeNull();
    expect(data![1]).toContain("--pb-edge-image: none");
    const iData = PAINT_OVERLAY_CSS.indexOf("@media (prefers-reduced-data");
    const iMotion = PAINT_OVERLAY_CSS.indexOf("@media (prefers-reduced-motion");
    expect(iData, "the reduced-data block fell behind the reduced-motion block (P-78)").toBeLessThan(iMotion);
  });

  it("the sheets under the card are countable — two of them, each with its own edge (R62)", () => {
    const card = baseRule(PAINT_OVERLAY_CSS, "pb-card");
    expect(card).toContain("--pb-sheet-face");
    expect(card).toContain("--pb-sheet-edge");
    const shadow = /box-shadow:\s*([^;]*);/.exec(card)?.[1] ?? "";
    expect((shadow.match(/--pb-sheet-face/g) ?? []).length, "not two sheets").toBe(2);
    expect((shadow.match(/--pb-sheet-edge/g) ?? []).length, "the sheets lost their ink lines").toBe(2);
    // the cast must sit OUTSIDE the stack it now belongs to, or the stack reads
    // as a shadow with lines in it rather than as pages
    const castX = Number(/([\d]+)px\s+[\d]+px\s+0\s+-?\d+px\s+var\(--pb-ink-cast\)/.exec(shadow)?.[1] ?? 0);
    const sheetX = [...shadow.matchAll(/([\d]+)px\s+[\d]+px\s+0\s+-?\d+px\s+var\(--pb-sheet-face\)/g)]
      .map((m) => Number(m[1]));
    expect(sheetX.length).toBe(2);
    expect(castX, "the cast fell inside the stack").toBeGreaterThan(Math.max(...sheetX));
  });
});
