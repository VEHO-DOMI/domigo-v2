// PK-R6 · D · THE REAWAKENING (doc 44 §3.3), pinned end to end.
//
// „The freed classmate stands ghost-pale and acts out the unit's wrong-actions
// round by round — the pose IS the prompt … Correct → the classmate regains one
// degree of motion/colour; final round → full colour, joy loop, the cage opens."
//
// Four claims live here, because all four are things a screenshot could fake
// and only a run can prove:
//   1. opening the cage does NOT free her — it starts six rounds,
//   2. every round takes an equal, visible bite out of the ghost-wash,
//   3. the sixth round is what makes the cage count as freed, and
//   4. she is still STANDING THERE afterwards (doc 44 §1: redemption changes
//      state, never presence) — waving, at her own spot, for good.
// Plus the two ways the ceremony could strand a child: deferring a round, and
// the Kleckskammer remount that rebuilds the whole Sim underneath her.

import { describe, expect, it } from "vitest";
import { Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import type { PaintLevel, PhaseSpec } from "./level.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { SUBS, TICK_MS, TILE } from "./paint.ts";
import { RESTORE_HOLD_MS } from "./cards/resolution.ts";
import { VERDICT_MS } from "./cards/overlay-css.ts";
import { AWAKEN_ROUNDS, JOY_TICKS, SETTLE_TICKS, WAVE_EVERY_TICKS, roamZone } from "./entities.ts";
import {
  AWAKEN_FLOOD_WASH, AWAKEN_ROOM_MS, AWAKEN_ROOM_PEAK, AWAKEN_ROOM_RISE_MS, AWAKEN_STEP_WASH,
  CAGE_OPEN_TICKS, COLOUR_FLOOD_TICKS, FLOOD_BLOOM_PEAK, FLOOD_BLOOM_PEAK_AT,
  GHOST_WASH, RESTORE_SPARKLE_MS, WASH_ALPHA, awakenRoomBloom, awakenRoomSweep, awakenWash, classmateCell,
  entPoseCell, floodBloomFor, greyLuma, poseStateOf, washAlphaFor,
} from "./anim.ts";

// a flat room: floor at row 12, the cage and the girl side by side on row 11
const ROWS: string[] = [
  ...Array.from({ length: 11 }, () => "........................"),
  "..S..........c.m......X.".replace(/[cm]/g, "."), // the two entities are placed by spec, not glyph
  "########################",
  "########################",
];

const phase = (over: Partial<PhaseSpec> = {}): PhaseSpec => ({
  id: "p1",
  nameDe: "Test",
  surface: "normal",
  plates: {},
  rows: ROWS,
  entities: [
    { id: "cage-merle", role: "cage", skin: "pencilcase", c: 13, r: 11, tier: "E", params: { classmate: "merle" } },
    { id: "merle", role: "classmate", skin: "merle", c: 15, r: 11, tier: "E", params: { cage: "cage-merle", hidden: true } },
  ],
  links: [],
  exit: { to: "done" },
  ...over,
});

const level = (): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "run"],
  phases: [phase()],
});

const newSim = (freed: string[] = []): Sim =>
  new Sim({ level: level(), phaseId: "p1", grantedAbilities: () => ["jump", "run"], freedCageIds: () => freed });

const pad = (over: Partial<Pad> = {}): Pad => ({ ...IDLE_PAD, ...over });
const merleOf = (sim: Sim) => sim.world.entities.find((e) => e.id === "merle")!;

/** Walk the hero onto the cage and press ↑ — the chapter's own verb. Returns
 *  the events that press produced.
 *
 *  The idle tick is not decoration: standing next to a cage fires the
 *  once-per-chapter ↑ hint (PB-F3), which FREEZES the world for its card, so the
 *  shell's dismissal has to be modelled here exactly as PaintGame and the tape
 *  replayer model it — a press into a frozen world does nothing at all. */
const stepAndSettleHint = (sim: Sim, p: Pad): SimEvent[] => {
  const evs = sim.step(p);
  if (evs.some((e) => e.type === "cageHint")) sim.setOverlay(false);
  return evs;
};

const openTheCage = (sim: Sim): SimEvent[] => {
  sim.warp(13, 10);
  stepAndSettleHint(sim, pad()); // the hint fires here, and is put down
  stepAndSettleHint(sim, pad()); // an idle tick, so ↑ below is a RISING edge
  return stepAndSettleHint(sim, pad({ up: true }));
};

const taskOf = (evs: SimEvent[]): TaskRequest | null => {
  const ev = evs.find((e) => e.type === "task");
  return ev && ev.type === "task" ? ev.req : null;
};

describe("PK-R6 · D · the reawakening sequence", () => {
  it("the cage opens onto a PERSON, not a rescue: round 1 of 6, and nothing is freed yet", () => {
    const sim = newSim();
    expect(merleOf(sim).hidden).toBe(true); // she is in the case until the latch
    const evs = openTheCage(sim);

    expect(evs.some((e) => e.type === "cageFreed")).toBe(false); // ← the whole point
    const req = taskOf(evs);
    expect(req?.ctx).toMatchObject({ type: "classmate", id: "merle", skin: "merle", round: 1, rounds: 6 });
    expect(req?.use).toBe("rescue");

    const merle = merleOf(sim);
    expect(merle.hidden).toBe(false);
    expect(merle.redeemed).toBe(false);
    expect(merle.state).toBe("caged"); // the painted still-bewitched cell
    expect(AWAKEN_ROUNDS).toBe(6); // doc 44 §3.3's own number
  });

  it("runs six rounds in order, each one lightening her by an equal degree", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    const rounds: number[] = [];
    const washes: number[] = [washAlphaFor(merleOf(sim))];
    let freed: SimEvent | undefined;

    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      expect(req.ctx.type).toBe("classmate");
      rounds.push(req.ctx.type === "classmate" ? req.ctx.round : -1);
      const evs = sim.solveTask(req.ctx);
      washes.push(washAlphaFor(merleOf(sim)));
      freed = evs.find((e) => e.type === "cageFreed") ?? freed;
      const next = taskOf(evs);
      if (next) req = next;
      else expect(i).toBe(AWAKEN_ROUNDS - 1); // only the LAST round raises no successor
    }

    expect(rounds).toEqual([1, 2, 3, 4, 5, 6]);
    // THE SIX DEGREES, read off the world after every answer. Rounds 1–5 each
    // take an equal bite out of the ghost-wash INSTANTLY — the world is frozen
    // for the card, so a fade with no clock running would be a change no child
    // ever sees. Round 6 does not step: it hands what is LEFT to the colour
    // FLOOD, whose starting value is what stands here at timer 0 and whose end
    // (0 — full colour) the next test walks the clock to.
    expect(washes).toEqual([awakenWash(0), awakenWash(1), awakenWash(2), awakenWash(3), awakenWash(4), awakenWash(5), awakenWash(5)]);
    expect(washes[0]).toBe(GHOST_WASH); // full ghost-wash before round 1
    expect(washes.slice(0, 6).every((w, i) => i === 0 || w < washes[i - 1]!)).toBe(true); // strictly lighter, rounds 1–5
    expect(merleOf(sim).redeemed).toBe(true); // and round 6 is the one that redeems her
  });

  it("the sixth answer floods the colour, settles her, and frees the cage", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    let freedEv: Extract<SimEvent, { type: "cageFreed" }> | undefined;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      for (const e of evs) if (e.type === "cageFreed") freedEv = e;
      const next = taskOf(evs);
      if (next) req = next;
    }

    // the cage — not the girl — is what the HUD chip and the score page count
    expect(freedEv).toMatchObject({ type: "cageFreed", id: "cage-merle", skin: "pencilcase", classmate: "merle", count: 1 });

    const merle = merleOf(sim);
    expect(merle.redeemed).toBe(true);
    expect(merle.state).toBe("settle");
    // the flood is the existing choreography, running off her own timer
    expect(washAlphaFor(merle)).toBeCloseTo(awakenWash(AWAKEN_ROUNDS - 1), 6);
    // PK-R6 · H1: the flood rides `freedTick`, not the state timer — see
    // entities.freedTick for the re-draining defect that moved it
    merle.freedTick = COLOUR_FLOOD_TICKS;
    expect(washAlphaFor(merle)).toBe(0); // full colour
    expect(washAlphaFor(merle, true)).toBe(0); // reduced motion: already finished
  });

  // R5-W4 · F5 · R49 · DAS GESETZ HAT SICH GEÄNDERT, DER TEST ZIEHT MIT.
  // Bis hierher stand hier „und verlässt nie ihren Fleck" (`m.x === homeX`).
  // Das Ruling R49 (Spine Beat 9, doc 44 §1) ersetzt das: Befreite bleiben in
  // ihrem RAUM, bewegen sich aber. Der Fleck wird also zur ZONE — abgeleitet aus
  // dem Gitter, nicht getippt (entities.roamZone). Was der Test schützt, ist
  // unverändert: sie verschwindet nicht, sie wandert nicht aus dem Level, und
  // ihre Zellen sind ihre eigenen. Was ein neues Gesetz erlaubt, muss der alte
  // Test erlauben — sonst schiebt der nächste Leser das Gesetz zurück.
  it("afterwards she STAYS — settle → joy → ihr Raum, waving now and then", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      const next = taskOf(evs);
      if (next) req = next;
    }
    sim.setOverlay(false); // the ceremony card is put down; the world runs again

    const seen = new Set<string>();
    const merle0 = merleOf(sim);
    const zone = roamZone(sim.grid, merle0.homeX, merle0.homeY);
    for (let t = 0; t < SETTLE_TICKS + JOY_TICKS + WAVE_EVERY_TICKS + 200; t++) {
      sim.step(pad());
      const m = merleOf(sim);
      seen.add(m.state);
      expect(m.hidden).toBe(false); // never leaves the page
      // R49: nicht mehr der Fleck, sondern der RAUM — und der ist aus dem
      // Gitter abgeleitet, also kann dieser Test nicht mit einer getippten
      // Zahl auseinanderlaufen.
      expect(m.x).toBeGreaterThanOrEqual(zone.minX);
      expect(m.x).toBeLessThanOrEqual(zone.maxX);
    }
    expect([...seen].sort()).toEqual(["joy", "rest", "roam", "settle", "wave"]);
    // …and the cells she shows are her own painted ones, not a fallback
    expect(classmateCell("settle", 0)).toBe("settle0");
    expect(classmateCell("joy", 0)).toBe("joy");
    expect(classmateCell("joy", 12)).toBe("joy1"); // the AL2 pair is named, not numbered
    expect(classmateCell("wave", 12)).toBe("wave1");
    expect(classmateCell("rest", 0)).toBe("a");
  });

  // NB the quotes: »…« inside a TS string literal, never „…" — the German
  // closing quote is the ASCII " and ends the string (the standing pitfall).
  it("»Später« cannot strand her: ↑ resumes the ceremony at the SAME round", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    req = taskOf(sim.solveTask(req.ctx))!; // round 2
    req = taskOf(sim.solveTask(req.ctx))!; // round 3
    expect(req.ctx.type === "classmate" && req.ctx.round).toBe(3);

    sim.dismissTask(req.ctx); // the child puts round 3 down
    expect(sim.overlayOpen).toBe(false);

    sim.warp(15, 10);
    stepAndSettleHint(sim, pad());
    const again = taskOf(stepAndSettleHint(sim, pad({ up: true })));
    expect(again?.ctx).toMatchObject({ type: "classmate", round: 3 }); // not 4, not 1
  });

  it("a phase remount (the Kleckskammer round trip) does not un-free her", () => {
    const sim = newSim(["cage-merle"]);
    const merle = merleOf(sim);
    expect(merle.hidden).toBe(false);
    expect(merle.redeemed).toBe(true);
    expect(merle.awakenStep).toBe(AWAKEN_ROUNDS);
    // and nothing re-asks her rounds when the child walks past
    sim.warp(15, 10);
    stepAndSettleHint(sim, pad());
    expect(taskOf(stepAndSettleHint(sim, pad({ up: true })))).toBeNull();
  });

  it("R5-A8 · a remounted freed cage rests `open` — the burst beat never replays", () => {
    const sim = newSim(["cage-merle"]);
    const cage = sim.world.entities.find((e) => e.id === "cage-merle")!;
    expect(cage.redeemed).toBe(true);
    expect(cage.state).toBe("open");
    for (let t = 0; t < 40; t++) sim.step(pad());
    expect(cage.state).toBe("open"); // and stays at rest
  });

  it("R5-A8 · the burst is a BEAT: it plays in full, then the cage settles open", () => {
    const sim = newSim();
    const req = taskOf(openTheCage(sim))!; // burst + the round-1 card
    const cage = sim.world.entities.find((e) => e.id === "cage-merle")!;
    expect(cage.state).toBe("burst");
    // under the card, the hold runs the beat exactly to its end — drawn = played
    for (let t = 0; t < CAGE_OPEN_TICKS * 2; t++) sim.step(pad());
    expect(cage.state).toBe("burst");
    // the first free-running ticks after the child puts the card down retire it
    sim.dismissTask(req.ctx);
    for (let t = 0; t < 3; t++) sim.step(pad());
    expect(cage.state).toBe("open");
  });

  it("the cage she stepped out of is drawn OPEN, never with her still in it", () => {
    // found in the running game: a redeemed cage fell through to the `dazed`
    // catch-all, which has no cell, which fell back to `pencilcase_a` — the
    // CLOSED case with a girl behind its bars, standing right next to the girl
    // who had just been freed from it.
    expect(entPoseCell({ role: "cage", state: "burst", timer: 0, redeemed: true, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("burst");
    expect(entPoseCell({ role: "cage", state: "closed", timer: 0, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("a");
    expect(entPoseCell({ role: "cage", state: "shaking", timer: 0, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("shake");
    // R5-A8: the resting `open` state bobs over the captive-free pair…
    const restCells = new Set(Array.from({ length: 120 }, (_, t) =>
      entPoseCell({ role: "cage", state: "open", timer: t, redeemed: true, hasOpen: true, vx: 0, vy: 0, x: 0, homeX: 0 })));
    expect(restCells).toEqual(new Set(["open0", "open1"]));
    // …and a skin without the pair falls back to burst — never to the closed `_a`
    expect(entPoseCell({ role: "cage", state: "open", timer: 0, redeemed: true, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("burst");
  });

  it("the pose the card declares is the state the world puts her in", () => {
    // one declaration (`stimulus.art`), two readers — the card's portrait and
    // the being standing next to the child (PaintScene.setActingPose)
    expect(poseStateOf("merle_act_sing1", "merle")).toBe("act_sing");
    expect(poseStateOf("merle_act_scribble0", "merle")).toBe("act_scribble");
    expect(poseStateOf("merle_caged1", "merle")).toBe("caged");
    expect(classmateCell("act_sing", 0)).toBe("act_sing0");
    expect(classmateCell("act_sing", 12)).toBe("act_sing1");
    // a stem that is not hers poses nobody (TAMPER: the mis-bound card)
    expect(poseStateOf("pencil_a", "merle")).toBeNull();
    expect(poseStateOf("merle_", "merle")).toBeNull();
  });

  it("her wash is a pure function of the step — the claim is a table, not a screenshot", () => {
    const at = (step: number): number => washAlphaFor({ role: "classmate", redeemed: false, timer: 0, awakenStep: step });
    const want = [0, 1, 2, 3, 4, 5].map((n) => GHOST_WASH - AWAKEN_STEP_WASH * n);
    for (const [step, w] of want.entries()) expect(at(step)).toBeCloseTo(w, 9);
    expect(at(AWAKEN_ROUNDS)).toBe(0); // every round in ⇒ full colour
    // the steps are EQUAL: identical work by the child, identical payment
    const gaps = [1, 2, 3, 4, 5].map((n) => at(n - 1) - at(n));
    expect(gaps.every((g) => Math.abs(g - gaps[0]!) < 1e-9)).toBe(true);
    // and out-of-range steps clamp rather than invert the picture
    expect(at(-3)).toBe(GHOST_WASH);
    expect(at(99)).toBe(0);
  });

  // ── PK-R6 · H1 · THE LADDER IS SHAPED SO THE LAST BEAT IS A FLOOD ──────────
  // Round-1 critique, finding 5: „the climactic beats are narrated in a text box
  // rather than staged … the reawakening never actually lands on screen". Part
  // of that was the ladder itself: six identical degrees meant the sixth answer
  // moved her 0.12 while a card announced „Die Farbe strömt zurück". doc 44 §3.3
  // pays its two beats differently in one sentence — „regains one degree …
  // final round → full colour" — and this is that sentence as arithmetic.
  it("the final round is the BIGGEST single change of the whole ceremony", () => {
    const at = (step: number): number => washAlphaFor({ role: "classmate", redeemed: false, timer: 0, awakenStep: step });
    const flood = at(AWAKEN_ROUNDS - 1); // what the sixth answer hands to the flood
    expect(flood).toBeCloseTo(AWAKEN_FLOOD_WASH, 9);
    expect(flood).toBeGreaterThan(AWAKEN_STEP_WASH * 2); // …and not merely bigger by a hair
    // she begins as a GHOST: doc 44 §3.3's own word, and now a value the picture
    // can hold (the wash is a real greyscale copy — see anim.greyLuma)
    expect(at(0)).toBe(1);
    // the earlier rounds still pay, visibly and equally
    expect(AWAKEN_STEP_WASH).toBeGreaterThan(0.08);
  });

  // ── PK-R6 · H1 · THE GREY IS ACTUALLY GREY (findings 1 + 2) ────────────────
  // The wash used to be a `setTint` copy of the coloured sheet, i.e. a MULTIPLY,
  // which keeps every hue it exists to remove. `greyLuma` is what the scene now
  // bakes into the wash texture, and it is the same Rec. 709 matrix the CSS
  // `grayscale()` on the card's portrait uses — so world and card are one
  // transform rather than two recipes that were only meant to match.
  it("greyLuma removes chroma completely and matches the CSS grayscale matrix", () => {
    // a colour is drained to ONE value: no channel keeps a hue
    for (const [r, g, b] of [[160, 112, 60], [40, 200, 90], [12, 12, 200]] as const) {
      const l = greyLuma(r, g, b);
      expect(l).toBe(Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b));
      expect(l).toBeGreaterThanOrEqual(0);
      expect(l).toBeLessThanOrEqual(255);
    }
    // a grey stays itself (the transform is idempotent on the drained)
    for (const v of [0, 37, 128, 255]) expect(greyLuma(v, v, v)).toBe(v);
    // …and the composite the scene draws IS grayscale(a): (1-a)·colour + a·luma.
    // Measured against the defect this replaced: the shipped multiply-tint left
    // the bag at 0.371 mean chroma while „drained" (0.440 restored). At the
    // general WASH_ALPHA the same brown now keeps a fraction of its chroma.
    const [r, g, b] = [160, 112, 60];
    const l = greyLuma(r, g, b);
    const mix = (c: number): number => (1 - WASH_ALPHA) * c + WASH_ALPHA * l;
    const chromaBefore = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const chromaAfter = (Math.max(mix(r), mix(g), mix(b)) - Math.min(mix(r), mix(g), mix(b))) / 255;
    expect(chromaAfter).toBeCloseTo(chromaBefore * (1 - WASH_ALPHA), 9);
    expect(chromaAfter).toBeLessThan(chromaBefore / 3);
  });

  // ── PK-R6 · H1 · THE RESTORE-HOLD RUNS THE WORLD IT HOLDS ─────────────────
  // Round-1 critique, finding 5. The hold (doc 44 §3.1.7) doffs the card so the
  // child WATCHES their answer change the world — and the shell froze the sim
  // for it, which stops the very timers the change is made of. The harness had
  // the proof and it was read as a timing artefact: „hold start: wash 0.72 …
  // hold end: wash 0.72". These two tests are that log turned into a gate.
  it("the world was FROZEN through the beat that exists to be watched (the defect)", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      const next = taskOf(evs);
      if (next) req = next;
    }
    // the burst's own short cinematic (holdTicks) is a DIFFERENT beat and would
    // mask this one; handing the world back once clears it through the real API
    sim.setOverlay(false);
    sim.setOverlay(true); // …exactly what applyWorldChange does for the hold
    const before = washAlphaFor(merleOf(sim));
    for (let t = 0; t < COLOUR_FLOOD_TICKS; t++) sim.step(pad());
    expect(washAlphaFor(merleOf(sim))).toBe(before); // nothing moves without the hold
    expect(before).toBeCloseTo(AWAKEN_FLOOD_WASH, 9);
  });

  it("…and the hold now plays the flood, the settle and the joy lap while it holds", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      const next = taskOf(evs);
      if (next) req = next;
    }
    sim.setOverlay(false);
    sim.setOverlay(true);
    sim.setHold(true);
    const homeX = merleOf(sim).homeX;
    const tickAtHold = sim.tickCount;
    const seen = new Set<string>([merleOf(sim).state]);
    const washes: number[] = [washAlphaFor(merleOf(sim))];
    for (let t = 0; t < SETTLE_TICKS + 20; t++) {
      const evs = sim.step(pad({ right: true, jump: true })); // …and the CHILD stays put
      expect(evs).toEqual([]); // a cinematic beat may never raise a card behind its own card
      seen.add(merleOf(sim).state);
      washes.push(washAlphaFor(merleOf(sim)));
    }
    // the colour arrives, all the way, inside the beat
    expect(washes[0]).toBeCloseTo(AWAKEN_FLOOD_WASH, 9);
    expect(washes[COLOUR_FLOOD_TICKS]).toBe(0);
    expect(washes.every((w, i) => i === 0 || w <= washes[i - 1]!)).toBe(true); // never backwards
    // …and she comes back to herself and cheers, which is the pose the payoff
    // is supposed to be looked at in
    expect([...seen].sort()).toEqual(["joy", "settle"]);
    expect(merleOf(sim).x).toBe(homeX);
    // the child is frozen: the hold is a cinematic, not a resumed world
    expect(sim.player.vx).toBe(0);
    expect(sim.tickCount).toBe(tickAtHold);
  });

  // ── PK-R6 · H1 · THE POSE THE PAYOFF IS LOOKED AT IN ──────────────────────
  // Round-1 critique, finding 5 asked for „a distinct celebratory pose … at the
  // payoff moment". She has one (`merle_joy`, arms up, painted) and it arrives
  // after her settle — so whether the child SEES it at the payoff is a race
  // between two clocks that nobody was holding: her settle, and the card beats
  // that decide when the ceremony panel lands over her. This is that race,
  // decided by arithmetic instead of by luck.
  it("she is CHEERING, not still settling, by the time the ceremony card lands", () => {
    const settleMs = SETTLE_TICKS * TICK_MS;
    const cardLandsMs = RESTORE_HOLD_MS + VERDICT_MS; // doff → hold → cheer → card
    expect(settleMs).toBeLessThan(cardLandsMs);
    // …and she is still IN the joy lap then, not already back at rest
    expect(settleMs + JOY_TICKS * TICK_MS).toBeGreaterThan(cardLandsMs);
  });

  // ── PK-R6 · H1 · THE CAGE IS SEEN OPENING (finding 4) ─────────────────────
  // The burst raises the round-1 card on the same tick, and a card freezes the
  // world — so the opening had nowhere to play and the cage stood frozen at the
  // first frame of its own pop. `holdTicks` is that beat, and it ends by itself.
  it("a burst cage gets a bounded cinematic of its own, and it closes itself", () => {
    const sim = newSim();
    openTheCage(sim);
    const cage = sim.world.entities.find((e) => e.id === "cage-merle")!;
    expect(cage.state).toBe("burst");
    expect(sim.overlayOpen).toBe(true); // round 1 is already up
    expect(sim.holdTicks).toBe(CAGE_OPEN_TICKS);
    const before = cage.freedTick;
    for (let t = 0; t < CAGE_OPEN_TICKS * 3; t++) sim.step(pad());
    // it ran for exactly the beat, then stopped — a frozen world stays frozen
    expect(cage.freedTick - before).toBe(CAGE_OPEN_TICKS);
    expect(sim.holdTicks).toBe(0);
    // …and it never let the CHILD move while the card was up
    expect(sim.tickCount).toBe(3);
  });

  // …and the defect the flood clock was moved off `timer` for (entities.freedTick)
  it("a freed friend never goes grey again when her state changes", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      const next = taskOf(evs);
      if (next) req = next;
    }
    sim.setOverlay(false); // the ceremony card is put down; the world runs on
    let worst = 0;
    // long enough to cross settle → joy → rest → wave → rest, i.e. every reset
    for (let t = 0; t < SETTLE_TICKS + JOY_TICKS + WAVE_EVERY_TICKS + 200; t++) {
      sim.step(pad());
      if (t > COLOUR_FLOOD_TICKS) worst = Math.max(worst, washAlphaFor(merleOf(sim)));
    }
    expect(worst).toBe(0); // she is in colour, and stays in colour
  });

  it("a remount does NOT re-play a flood the child already watched", () => {
    // the Kleckskammer round trip rebuilds the Sim: she must come back already
    // in colour, not fade in again as if she were being freed a second time
    const sim = newSim(["cage-merle"]);
    const merle = merleOf(sim);
    expect(merle.redeemed).toBe(true);
    expect(washAlphaFor(merle)).toBe(0);
    expect(floodBloomFor(merle)).toBe(0); // …and no light announcing it either
  });

  it("a plain cage (no classmate) keeps its one-beat rescue — the change is scoped", () => {
    const lvl = level();
    lvl.phases[0]!.entities = [
      { id: "bag", role: "cage", skin: "satchel", c: 13, r: 11, tier: "E" },
    ];
    const sim = new Sim({ level: lvl, phaseId: "p1", grantedAbilities: () => ["jump", "run"], freedCageIds: () => [] });
    sim.warp(13, 10);
    stepAndSettleHint(sim, pad());
    stepAndSettleHint(sim, pad());
    const req = taskOf(stepAndSettleHint(sim, pad({ up: true })));
    expect(req?.ctx).toMatchObject({ type: "cage", id: "bag", skin: "satchel" });
    expect(sim.solveTask(req!.ctx).some((e) => e.type === "cageFreed")).toBe(true); // still one beat
  });
});

// the placement above must actually put the two beings within ↑ reach of the
// hero's warp cell — a test that silently missed them would prove nothing
describe("the fixture itself", () => {
  it("stands the cage and the girl on the floor, in reach", () => {
    const sim = newSim();
    const cage = sim.world.entities.find((e) => e.id === "cage-merle")!;
    expect(cage.y / SUBS / TILE).toBe(12); // feet on the floor row
    expect(merleOf(sim).y / SUBS / TILE).toBe(12);
  });
});

// ── PK-R6 · H1 · THE ARRIVING-COLOUR LIGHT (round-1 critique, finding 8) ──────
// „The world-change colour shift on the bag (brown to olive) is too subtle to
// register at a glance." The fix is a warm light riding the flood — and the
// whole point of that light is WHEN it is bright, so the timing is pinned here
// rather than eyeballed in a screenshot. Three claims, one table each:
//   1. it is brightest EARLY (it announces the change, it does not trail it),
//   2. it is completely gone by the time the flood ends (a light still burning
//      over a finished change would be the world lying about being busy), and
//   3. a reduced-motion child never sees it — their being is already in full
//      colour, so a flash would announce a change that already happened.
describe("the arriving-colour light (doc 44 · PK-R6 · H1)", () => {
  const bag = (timer: number, redeemed = true) => ({ role: "cage", redeemed, timer });

  it("peaks where the constant says, and nowhere else", () => {
    // walked tick by tick rather than sampled at the constant: the flood is
    // counted in whole ticks, so „the peak is at 22 %" is only true if the
    // brightest TICK is there — which is the thing a child actually sees
    const curve = Array.from({ length: COLOUR_FLOOD_TICKS + 1 }, (_, t) => floodBloomFor(bag(t)));
    const top = Math.max(...curve);
    expect(top).toBeCloseTo(FLOOD_BLOOM_PEAK, 2);
    expect(curve.indexOf(top) / COLOUR_FLOOD_TICKS).toBeCloseTo(FLOOD_BLOOM_PEAK_AT, 1);
    // and it is a single rise and fall, never a flicker
    const brightest = curve.indexOf(top);
    for (let t = 1; t <= brightest; t++) expect(curve[t]!).toBeGreaterThan(curve[t - 1]!);
    for (let t = brightest + 1; t <= COLOUR_FLOOD_TICKS; t++) expect(curve[t]!).toBeLessThan(curve[t - 1]!);
  });

  it("is up before the flood is a third done — it announces, never trails", () => {
    // the peak must land inside the first third, or the light arrives after the
    // colour it was built to point at
    expect(FLOOD_BLOOM_PEAK_AT).toBeLessThan(1 / 3);
    expect(floodBloomFor(bag(0))).toBe(0); // …and starts from nothing
  });

  it("is gone by the end of the flood, and stays gone", () => {
    expect(floodBloomFor(bag(COLOUR_FLOOD_TICKS))).toBe(0);
    expect(floodBloomFor(bag(COLOUR_FLOOD_TICKS * 4))).toBe(0);
  });

  it("never lights a being that has not been freed, or furniture that was never drained", () => {
    expect(floodBloomFor(bag(8, false))).toBe(0);
    expect(floodBloomFor({ role: "door", redeemed: true, timer: 8 })).toBe(0);
  });

  it("is off entirely under reduced motion (the end-states law, in the world)", () => {
    const at = Math.round(COLOUR_FLOOD_TICKS * FLOOD_BLOOM_PEAK_AT);
    expect(floodBloomFor(bag(at), true)).toBe(0);
    expect(washAlphaFor({ role: "cage", redeemed: true, timer: at }, true)).toBe(0); // …because this already is
  });
});

// ── PK-R6 · H2 · THE ROOM ANSWERS (round-2 finding 3) ────────────────────────
// „06-merle-round4-midwash, 07-merle-final-flood and 08-merle-joy-open-cage
// share the same dim navy-purple room, the same lighting, and no added
// glow/particle/bloom layer — flipping between the labeled ‚midwash' and ‚final
// flood' frames shows no discernible difference in intensity."
//
// The escalation is now arithmetic, so it can be checked without a screenshot:
// a progress round has NO room light by construction (the beat fires on the
// sixth answer only), the payoff frame has one at nearly full strength, and the
// joy frame after it is still lit — and lit WIDER, because the light travels.
describe("PK-R6 · H2 · the room's own light on the sixth answer", () => {
  it("is nothing before the beat and nothing after it", () => {
    expect(awakenRoomBloom(-1)).toBe(0);
    expect(awakenRoomBloom(AWAKEN_ROOM_MS)).toBe(0);
    expect(awakenRoomBloom(AWAKEN_ROOM_MS * 3)).toBe(0);
    expect(awakenRoomBloom(Number.POSITIVE_INFINITY)).toBe(0); // the „no ceremony yet" clock
  });

  it("makes the payoff frame unmistakably brighter than the progress frame", () => {
    // a progress round (rounds 1…5) never starts this clock — its room light is
    // the Infinity case above, i.e. exactly zero. The payoff frame is the peak.
    const progress = awakenRoomBloom(Number.POSITIVE_INFINITY);
    const payoff = awakenRoomBloom(AWAKEN_ROOM_RISE_MS);
    expect(payoff).toBeCloseTo(AWAKEN_ROOM_PEAK, 5);
    // …and against an ABSOLUTE floor, not only against its own constant: a peak
    // tuned down to nothing would satisfy „payoff === PEAK" and re-ship exactly
    // the defect this beat exists to answer
    expect(payoff).toBeGreaterThan(0.35);
    expect(payoff - progress).toBeGreaterThan(0.35);
  });

  it("snaps up and falls slowly — a spell breaking, not a lamp fading in", () => {
    expect(awakenRoomBloom(AWAKEN_ROOM_RISE_MS / 2)).toBeCloseTo(AWAKEN_ROOM_PEAK / 2, 5);
    // …and it is still lighting the room while the child is being handed it back
    expect(awakenRoomBloom(RESTORE_HOLD_MS)).toBeGreaterThan(AWAKEN_ROOM_PEAK * 0.2);
    // …and it only ever falls after the peak (one rise, one fall, no flicker)
    let prev = AWAKEN_ROOM_PEAK;
    for (let ms = AWAKEN_ROOM_RISE_MS; ms < AWAKEN_ROOM_MS; ms += 25) {
      const now = awakenRoomBloom(ms);
      expect(now).toBeLessThanOrEqual(prev + 1e-9);
      prev = now;
    }
  });

  it("keeps travelling after its peak, so the late frame is WIDER, not just dimmer", () => {
    // this is what makes it a light crossing a room instead of a tint over one —
    // and it is why the joy frame does not read as a weaker copy of the flood
    for (let ms = 0; ms < AWAKEN_ROOM_MS; ms += 50) {
      expect(awakenRoomSweep(ms + 50)).toBeGreaterThan(awakenRoomSweep(ms));
    }
    expect(awakenRoomSweep(0)).toBeCloseTo(1, 5);
    expect(awakenRoomSweep(AWAKEN_ROOM_MS)).toBeGreaterThan(3);
  });
});

// ── PK-R6 · H2 · THE RESTORE SPARKLE (round-2 finding 5) ────────────────────
// „The ‚shine' cue is two soft-edged flat white ellipses overlapping the
// leather, with no radiating rays or sparkle flecks."
describe("PK-R6 · H2 · the freeing sparkle out-lives the colour flood", () => {
  it("is still going when the colour has already landed", () => {
    // the frame a still capture calls „restored" is the frame AFTER the flood,
    // and until now every light this beat owned was over by then — leaving the
    // ADD bloom's blown-out highlights as the only „shine" in the picture
    expect(RESTORE_SPARKLE_MS).toBeGreaterThan(COLOUR_FLOOD_TICKS * TICK_MS);
    // …and it is over before the next thing can happen, so it never stacks
    expect(RESTORE_SPARKLE_MS).toBeLessThan(JOY_TICKS * TICK_MS);
  });
});
