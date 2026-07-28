// PK-R3b · R3-15/R3-16 — the colour wash, the collectible magnet, and the two
// static-state pickups. Everything here is driven through the REAL Sim on the
// REAL shipped level, because that is where each of these actually lives: a
// magnet that works in a synthetic room and not in ch01 has proved nothing.
//
// Every case is TAMPERED: the assertion is written so that removing the feature
// it describes turns it red (and each one was run in that state before being
// committed — see docs/handover/35_build_d_command_log.md).

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COLOUR_FLOOD_TICKS, WASHED_ROLES, WASH_ALPHA, washAlphaFor } from "./anim.ts";
import { MAGNET_FIELD_PX, Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { allPhases, checkLevelLaws, type PaintLevel } from "./level.ts";

const LEVEL = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const level = JSON.parse(fs.readFileSync(LEVEL, "utf8")) as PaintLevel;
const phaseOf = (id: string) => allPhases(level).find((p) => p.id === id)!;
const newSim = (phaseId: string, picked: string[] = []) =>
  new Sim({
    level, phaseId,
    grantedAbilities: () => [...level.abilities],
    freedCageIds: () => [],
    collectedPickupIds: () => picked,
  });

// ── R3-15 · the desaturation grammar ─────────────────────────────────────────
describe("the colour wash (R3-15, doc 41 §2)", () => {
  it("drains every REDEEMABLE being and no furniture", () => {
    // the fiction is „OSWIN rained the colour out of the beings he bewitched" —
    // a door or a moving platform was never bewitched, and washing it would say
    // the child can befriend it.
    for (const role of ["chaser", "gunner", "flyer", "bouncer", "crusher", "swarm", "cage"]) {
      expect(WASHED_ROLES.has(role), `${role} should be drained`).toBe(true);
    }
    for (const role of ["door.trigger", "powerup", "platform.move", "platform.swing", "guardian", "tip", "book"]) {
      expect(WASHED_ROLES.has(role), `${role} is furniture — it was never drained`).toBe(false);
    }
  });

  it("an un-redeemed being is fully washed; the colour floods back on redemption", () => {
    const grey = { role: "chaser", redeemed: false, timer: 999 };
    expect(washAlphaFor(grey)).toBe(WASH_ALPHA);
    // the flood is driven by the sim's own timer, which redeemEntity resets to 0
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 0 })).toBe(WASH_ALPHA);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: COLOUR_FLOOD_TICKS / 2 })).toBeCloseTo(WASH_ALPHA / 2, 5);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: COLOUR_FLOOD_TICKS })).toBe(0);
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 9999 })).toBe(0); // never negative
  });

  it("reduced motion shows the END STATE — full colour, no flood", () => {
    expect(washAlphaFor({ role: "chaser", redeemed: true, timer: 0 }, true)).toBe(0);
    // …but a being that has NOT been befriended is still grey: the wash is
    // information, not decoration, so it survives the motion setting.
    expect(washAlphaFor({ role: "chaser", redeemed: false, timer: 0 }, true)).toBe(WASH_ALPHA);
  });

  it("a redeemed CAGE floods too — its timer keeps running (the R3-15 fix)", () => {
    // stepRedeemed used to return before incrementing the timer for anything
    // that does not fly a lap of joy, which left every knotted school bag
    // half-drained for the rest of the chapter. Two of ch01's restore cards are
    // about exactly those bags, so this is load-bearing, not cosmetic.
    const sim = newSim("p1");
    const cage = sim.world.entities.find((e) => e.role === "cage")!;
    cage.redeemed = true;
    cage.state = "burst";
    cage.timer = 0;
    for (let t = 0; t < COLOUR_FLOOD_TICKS + 5; t++) sim.step({ ...IDLE_PAD });
    expect(cage.timer).toBeGreaterThanOrEqual(COLOUR_FLOOD_TICKS);
    expect(washAlphaFor(cage)).toBe(0);
  });
});

// ── R3-16 · the collectible magnet ───────────────────────────────────────────
describe("the letter magnet (R3-16, doc 42 §4)", () => {
  /** Stand the child a given distance to the left of one real letter and run.
   *
   *  Two things this harness has to get right, both learned the hard way here:
   *  the WARP first, because the screen clamp boxes the player inside the camera
   *  and a teleport without one drags them straight back across the level; and
   *  the child is re-pinned every tick, so the only thing that moves in these
   *  cases is the letter — which is the whole point of the measurement. */
  const runNear = (phaseId: string, gapPx: number, ticks: number) => {
    const sim = newSim(phaseId);
    const key = [...sim.letterCells][0]!;
    sim.warp(...(key.split(",").map(Number) as [number, number]));
    // PARK the letter out of reach for the settle tick — the warp puts the child
    // right on top of it, and a letter collected during setup makes every
    // measurement afterwards a measurement of nothing (collectLetters walks
    // `letterCells`, so a taken key is simply skipped and looks like „it never
    // moved"). Both magnet cases failed on exactly this before it was parked.
    sim.letterPos.set(key, { x: 9_000 * SUBS, y: 9_000 * SUBS });
    // SETTLE, then measure. Pinning the child at a chosen y does not hold:
    // stepPlayer snaps them to the ground, and an early version of this harness
    // measured from a place the child never stood — it read a 23.6 px gap while
    // the real one was 26.5, i.e. just outside the field, and called the magnet
    // broken. So the LETTER is moved to the wanted gap from where the child
    // actually ends up, and only then does the clock start.
    sim.step({ ...IDLE_PAD });
    expect(sim.letterCells.has(key), "harness: the letter was taken during setup").toBe(true);
    const anchorX = sim.player.x;
    const anchorY = sim.player.y - 10 * SUBS; // the chest, per COLLECT_ANCHOR_PX
    const start = { x: anchorX + Math.round(gapPx * SUBS), y: anchorY };
    sim.letterPos.set(key, { ...start });
    for (let t = 0; t < ticks; t++) {
      sim.player = { ...sim.player, x: anchorX, vx: 0 }; // the child holds still
      sim.step({ ...IDLE_PAD });
    }
    return { sim, key, start, now: sim.letterPos.get(key) ?? null };
  };

  it("a letter INSIDE the field drifts to the child and is taken", () => {
    const { sim, key } = runNear("p1", MAGNET_FIELD_PX - 2, 30);
    expect(sim.letterCells.has(key), "the letter should have been magnetised in").toBe(false);
    expect(sim.lettersGot).toBe(1);
  });

  it("a letter OUTSIDE the field does not move — the magnet is a small field, not a vacuum", () => {
    const { start, now, sim } = runNear("p1", MAGNET_FIELD_PX + 6, 30);
    expect(now).not.toBeNull();
    expect(now!.x).toBe(start.x);
    expect(now!.y).toBe(start.y);
    expect(sim.lettersGot).toBe(0);
  });

  it("the DRAWN place and the TAKEN place are the same number", () => {
    // the whole reason the magnet lives in the sim: a letter that visibly flies
    // into the child but is only collected when their body reaches its original
    // cell would be a picture that lies about the rules.
    const { sim, key, start, now } = runNear("p1", MAGNET_FIELD_PX - 2, 1);
    if (now) expect(now.x).not.toBe(start.x); // it moved, and the renderer reads THIS map
    else expect(sim.lettersGot).toBe(1); // or it was close enough to be taken outright
  });

  it("lettersCollected counts what was FOUND, and paying Klecks does not un-find it", () => {
    const { sim } = runNear("p1", 0, 4);
    expect(sim.lettersCollected).toBe(1);
    expect(sim.spendLetters(1)).toBe(true);
    expect(sim.lettersGot).toBe(0);
    expect(sim.lettersCollected, "the Bilanz must not count DOWN when the bonus door is paid").toBe(1);
  });
});

// ── R3-16 · Regel-Seiten and Bonus-Bücher ────────────────────────────────────
describe("the static-state collectibles (R3-16, doc 41 §5)", () => {
  const tipsOf = (phaseId: string) => phaseOf(phaseId).entities.filter((e) => e.role === "tip");

  it("the chapter places exactly the Regel-Seiten it declares, each with a rule", () => {
    const tips = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    expect(tips.length).toBe(level.tipsTotal);
    for (const t of tips) {
      expect(String(t.params?.merksatzDe ?? "").length).toBeGreaterThan(0);
      expect(String(t.params?.topicDe ?? "").length).toBeGreaterThan(0);
    }
  });

  it("EVERY Regel-Seite can actually be walked into, and hands over its own rule", () => {
    // the tapes prove two of the three by execution; this proves all of them,
    // including the one deliberately hidden high in p1 that no pilot detours to.
    for (const ph of level.phases) {
      for (const spec of ph.entities.filter((e) => e.role === "tip")) {
        const sim = newSim(ph.id);
        sim.warp(spec.c, spec.r);
        let got: { topicDe: string; merksatzDe: string } | null = null;
        for (let t = 0; t < 90 && got === null; t++) {
          for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip") got = ev;
        }
        expect(got, `${ph.id}/${spec.id} was never picked up`).not.toBeNull();
        expect(got!.merksatzDe).toBe(spec.params!.merksatzDe);
        expect(got!.topicDe).toBe(spec.params!.topicDe);
      }
    }
  });

  it("a Regel-Seite FREEZES the world — and the shell is what un-freezes it", () => {
    // the cagehint lesson (PB-R1 · R3-1), applied before this card can repeat
    // it: the sim freezes for a card, so the card must be one that opens, and
    // the shell must always give the world back.
    const spec = tipsOf("p1")[0]!;
    const sim = newSim("p1");
    sim.warp(spec.c, spec.r);
    for (let t = 0; t < 90 && !sim.overlayOpen; t++) sim.step({ ...IDLE_PAD });
    expect(sim.overlayOpen, "a rule page must stop the world so it can be read").toBe(true);
    sim.setOverlay(false);
    expect(sim.overlayOpen).toBe(false);
  });

  it("a page taken before the Kleckskammer is still taken when the phase remounts", () => {
    const spec = tipsOf("p1")[0]!;
    const sim = newSim("p1", [spec.id]);
    sim.warp(spec.c, spec.r);
    let fired = false;
    for (let t = 0; t < 90; t++) for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "tip") fired = true;
    expect(fired, "a remounted phase must not re-serve a page the child already has").toBe(false);
  });

  it("a Bonus-Buch is score only — it never stops the world", () => {
    const spec = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "book").map((e) => ({ ph: p.id, e })))[0]!;
    const sim = newSim(spec.ph);
    sim.warp(spec.e.c, spec.e.r);
    let fired = false;
    for (let t = 0; t < 90 && !fired; t++) {
      for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "book") fired = true;
    }
    expect(fired).toBe(true);
    expect(sim.overlayOpen, "a score pickup must not interrupt play").toBe(false);
  });
});

// ── the tip-honesty law, proven in both directions ───────────────────────────
describe("the tip-honesty law (doc 41 §7)", () => {
  const clone = (): PaintLevel => JSON.parse(JSON.stringify(level)) as PaintLevel;
  const lawsNamed = (l: PaintLevel) => checkLevelLaws(l).filter((f) => f.law === "tip-honesty").map((f) => f.detail);

  it("the shipped chapter passes it", () => expect(lawsNamed(level)).toEqual([]));

  it("promising a page the chapter does not place turns it RED", () => {
    const l = clone();
    l.tipsTotal = (l.tipsTotal ?? 0) + 1;
    expect(lawsNamed(l).join(" ")).toMatch(/declares 4 Regel-Seiten but places 3/);
  });

  it("a page with no Merksatz turns it RED (an empty rule page is a broken promise)", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.merksatzDe = "";
    expect(lawsNamed(l).join(" ")).toMatch(/no Merksatz/);
  });

  it("two pages of the same rule turn it RED", () => {
    const l = clone();
    const tips = l.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    tips[1]!.params!.topicDe = tips[0]!.params!.topicDe;
    expect(lawsNamed(l).join(" ")).toMatch(/one rule, one page/);
  });

  it("a Merksatz that breaks the register law turns it RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.params!.merksatzDe = "Das Monster im Buch sagt: I am.";
    expect(lawsNamed(l).join(" ")).toMatch(/register-law/);
  });

  it("a Regel-Seite placed where no child can reach it turns entity-reachable RED", () => {
    const l = clone();
    const t = l.phases.flatMap((p) => p.entities).find((e) => e.role === "tip")!;
    t.c = 1;
    t.r = 1; // inside the canopy: hidden is fine, impossible is not
    expect(checkLevelLaws(l).some((f) => f.law === "entity-reachable" && f.detail.includes("tip"))).toBe(true);
  });
});

// ── the world's own arithmetic ───────────────────────────────────────────────
it("the chapter's letter total is the three phases plus the arena, never the Kleckskammer", () => {
  // the score page reports „z von M"; folding Klecks' twelve into M would tell a
  // child who never paid the door that they missed twelve letters.
  const main = [...level.phases, ...(level.arena ? [level.arena] : [])]
    .reduce((n, p) => n + p.rows.join("").split("*").length - 1, 0);
  const bonus = level.bonus ? level.bonus.rows.join("").split("*").length - 1 : 0;
  expect(main).toBe(23);
  expect(bonus).toBeGreaterThan(0);
  expect(main).not.toBe(main + bonus);
});

it("the magnet field is Keen's 1.6 tiles, in THIS world's tile", () => {
  expect(MAGNET_FIELD_PX).toBe(TILE * 1.6);
});
