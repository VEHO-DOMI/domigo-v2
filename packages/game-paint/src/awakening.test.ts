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
import { SUBS, TILE } from "./paint.ts";
import { AWAKEN_ROUNDS, JOY_TICKS, SETTLE_TICKS, WAVE_EVERY_TICKS } from "./entities.ts";
import {
  COLOUR_FLOOD_TICKS, FLOOD_BLOOM_PEAK, FLOOD_BLOOM_PEAK_AT, WASH_ALPHA, awakenWash, classmateCell,
  entPoseCell, floodBloomFor, poseStateOf, washAlphaFor,
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
    // ever sees. Round 6 does not step: it hands the last degree to the colour
    // FLOOD, whose starting value is what stands here at timer 0 and whose end
    // (0 — full colour) the next test walks the clock to.
    expect(washes).toEqual([awakenWash(0), awakenWash(1), awakenWash(2), awakenWash(3), awakenWash(4), awakenWash(5), awakenWash(5)]);
    expect(washes[0]).toBe(WASH_ALPHA); // full ghost-wash before round 1
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
    merle.timer = COLOUR_FLOOD_TICKS;
    expect(washAlphaFor(merle)).toBe(0); // full colour
    expect(washAlphaFor(merle, true)).toBe(0); // reduced motion: already finished
  });

  it("afterwards she STAYS — settle → joy → her spot, waving now and then", () => {
    const sim = newSim();
    let req = taskOf(openTheCage(sim))!;
    for (let i = 0; i < AWAKEN_ROUNDS; i++) {
      const evs = sim.solveTask(req.ctx);
      const next = taskOf(evs);
      if (next) req = next;
    }
    sim.setOverlay(false); // the ceremony card is put down; the world runs again

    const seen = new Set<string>();
    const homeX = merleOf(sim).homeX;
    for (let t = 0; t < SETTLE_TICKS + JOY_TICKS + WAVE_EVERY_TICKS + 200; t++) {
      sim.step(pad());
      const m = merleOf(sim);
      seen.add(m.state);
      expect(m.hidden).toBe(false); // never leaves the page
      expect(m.x).toBe(homeX); // and never leaves her spot
    }
    expect([...seen].sort()).toEqual(["joy", "rest", "settle", "wave"]);
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

  it("the cage she stepped out of is drawn OPEN, never with her still in it", () => {
    // found in the running game: a redeemed cage fell through to the `dazed`
    // catch-all, which has no cell, which fell back to `pencilcase_a` — the
    // CLOSED case with a girl behind its bars, standing right next to the girl
    // who had just been freed from it.
    expect(entPoseCell({ role: "cage", state: "burst", timer: 0, redeemed: true, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("burst");
    expect(entPoseCell({ role: "cage", state: "closed", timer: 0, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("a");
    expect(entPoseCell({ role: "cage", state: "shaking", timer: 0, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 })).toBe("shake");
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
    const want = [6, 5, 4, 3, 2, 1, 0].map((n) => WASH_ALPHA * n / 6);
    for (const [step, w] of want.entries()) expect(at(step)).toBeCloseTo(w, 9);
    // the steps are EQUAL: identical work by the child, identical payment
    const gaps = [1, 2, 3, 4, 5].map((n) => at(n - 1) - at(n));
    expect(gaps.every((g) => Math.abs(g - gaps[0]!) < 1e-9)).toBe(true);
    // and out-of-range steps clamp rather than invert the picture
    expect(at(-3)).toBe(WASH_ALPHA);
    expect(at(99)).toBe(0);
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
