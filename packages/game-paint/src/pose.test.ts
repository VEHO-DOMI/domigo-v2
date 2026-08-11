// W4 · the entity POSE hook — batch AC gave four motion cells (pencil_run,
// eraser_squash, ranzen_stomp, heft_bank) that entStateCell could never select.
// These tests pin the signal each pose keys off, and TAMPER each one (invert
// the signal, or push it just under the threshold) so a green light here has
// been seen to turn red.

import { describe, expect, it } from "vitest";
import { BANK_X, RUN_VX, SQUASH_DWELL_TICKS, type EntPoseInput, bouncerSquash, entPoseCell } from "./anim.ts";
import { BOUNCE_GRAVITY_EVERY, BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX } from "./entities.ts";
import { PAINT, SUBS } from "./paint.ts";

/** Dieselbe Schwerkraft, die der Hüpfer in entities.ts anwendet. */
const GRAVITY_SUBS = PAINT.gravity;

const ent = (over: Partial<EntPoseInput>): EntPoseInput => ({
  role: "chaser",
  state: "patrol",
  timer: 0,
  redeemed: false,
  vx: 0,
  vy: 0,
  x: 0,
  homeX: 0,
  ...over,
});

describe("entPoseCell — the four motion poses", () => {
  it("a walker at patrol speed runs; stopped at an edge turn it idles (TAMPER)", () => {
    expect(entPoseCell(ent({ vx: ENEMY_WALK }))).toBe("run");
    expect(entPoseCell(ent({ vx: -ENEMY_WALK }))).toBe("run"); // direction-blind
    // the sim zeroes vx at an edge/ramp turn — that must NOT read as running
    expect(entPoseCell(ent({ vx: 0 }))).toBe("a");
    // just under the threshold falls back to the idle cycle
    expect(entPoseCell(ent({ vx: RUN_VX - 1 }))).toBe("a");
    expect(entPoseCell(ent({ vx: RUN_VX }))).toBe("run");
  });

  // R5-W1 · F1 · DER RADIERER, ÜBER EINEN ECHTEN HÜPFER GEMESSEN.
  //
  // Der alte Test pinnte Geschwindigkeiten von Hand — und pinnte damit einen
  // Zustand, den die Simulation nie zeichnet: `vy: BOUNCE_UP` (fallend mit
  // voller Wucht) existiert nur auf dem Tick, an dem der Aufprall vy im selben
  // Schritt wieder auf −BOUNCE_UP setzt. Er behauptete „squash auf dem schnellen
  // Teil des Bogens" und beschrieb damit einen Bogen, den es nicht gab.
  //
  // Deshalb wird der Bogen jetzt AUS DEN SIM-KONSTANTEN ERZEUGT statt getippt:
  // was hier steht, kann nicht mehr von dem abweichen, was der Radierer tut.
  const arc = (ticks = 13): { bounceTick: number; vy: number }[] => {
    const out: { bounceTick: number; vy: number }[] = [];
    let vy = -BOUNCE_UP;
    for (let t = 0; t < ticks; t++) {
      out.push({ bounceTick: t, vy });
      if ((t + 1) % BOUNCE_GRAVITY_EVERY === 0) vy += GRAVITY_SUBS;
    }
    return out;
  };

  it("der Aufprall steht eine DAUER, kein Einzelbild (TAMPER)", () => {
    const cells = arc().map((s) => entPoseCell(ent({ role: "bouncer", ...s })));
    expect(cells.filter((c) => c === "squash").length).toBe(SQUASH_DWELL_TICKS);
    // …und zwar am Anfang des Bogens, wo der Körper den Boden berührt hat
    expect(cells.slice(0, SQUASH_DWELL_TICKS).every((c) => c === "squash")).toBe(true);
    expect(cells.slice(SQUASH_DWELL_TICKS).some((c) => c === "squash")).toBe(false);
  });

  it("ohne gemalte Streck-Zelle bleibt der Flug beim Ruhe-Paar", () => {
    const cells = arc().map((s) => entPoseCell(ent({ role: "bouncer", ...s })));
    expect(cells.slice(SQUASH_DWELL_TICKS).every((c) => c === "a" || c === "b")).toBe(true);
  });

  it("liegt die Streck-Zelle auf der Platte, wird sie im Flug gezeigt (Nachrüst-Haken)", () => {
    const cells = arc().map((s) => entPoseCell(ent({ role: "bouncer", hasStretch: true, ...s })));
    expect(cells.filter((c) => c === "stretch").length).toBeGreaterThan(0);
    // der Aufprall gehört weiterhin dem Aufprall
    expect(cells.slice(0, SQUASH_DWELL_TICKS).every((c) => c === "squash")).toBe(true);
  });

  it("die Verformung ist stetig — der einzige harte Schnitt ist der Aufprall", () => {
    const scales = arc().map((s) => bouncerSquash(s.bounceTick, s.vy));
    let maxStep = 0;
    for (let i = 1; i < scales.length; i++) {
      maxStep = Math.max(
        maxStep,
        Math.abs(scales[i]!.sx - scales[i - 1]!.sx),
        Math.abs(scales[i]!.sy - scales[i - 1]!.sy),
      );
    }
    expect(maxStep, "im Bogen springt nichts").toBeLessThan(0.16);
    // …und der Sprung ZURÜCK in den nächsten Aufprall ist größer als alles im
    // Bogen: genau dort GEHÖRT ein Bruch hin, und nur dort
    const wrap = Math.abs(scales[0]!.sy - scales[scales.length - 1]!.sy);
    expect(wrap).toBeGreaterThan(maxStep);
  });

  it("reduzierte Bewegung lässt den Körper in Ruhe", () => {
    for (const s of arc()) expect(bouncerSquash(s.bounceTick, s.vy, true)).toEqual({ sx: 1, sy: 1 });
  });

  it("dieselbe Geschwindigkeit auf einem NICHT-Hüpfer ist keine Quetschung", () => {
    expect(entPoseCell(ent({ role: "chaser", vy: -BOUNCE_UP }))).toBe("a");
  });

  it("a crusher's slam shows the stomp cell; other roles keep plain `act` (TAMPER)", () => {
    expect(entPoseCell(ent({ role: "crusher", state: "act" }))).toBe("stomp");
    expect(entPoseCell(ent({ role: "chaser", state: "act" }))).toBe("act");
    expect(entPoseCell(ent({ role: "crusher", state: "patrol" }))).toBe("a"); // resting high
  });

  it("a flyer banks near the extremes of its sweep, not at the middle (TAMPER)", () => {
    const amp = FLYER_SWEEP_PX * SUBS;
    expect(entPoseCell(ent({ role: "flyer", x: amp, homeX: 0 }))).toBe("bank");
    expect(entPoseCell(ent({ role: "flyer", x: -amp, homeX: 0 }))).toBe("bank"); // both extremes
    expect(entPoseCell(ent({ role: "flyer", x: 0, homeX: 0 }))).toBe("a"); // mid-sweep, level
    expect(entPoseCell(ent({ role: "flyer", x: BANK_X - 1, homeX: 0 }))).toBe("a");
    // the bank is measured from HOME, not from the origin
    expect(entPoseCell(ent({ role: "flyer", x: 5000 + amp, homeX: 5000 }))).toBe("bank");
  });
});

describe("entPoseCell — the arena guardian's motion cells (A-4)", () => {
  // the pose hook is skin-blind by design — it returns the STATE cell and
  // entTex resolves it against whatever skin the entity wears (here: tafel)
  const tafel = (state: string): string => entPoseCell(ent({ role: "guardian", state }));

  it("maps the guardian's own states onto the FLIGHT sheet (PK-R6 · E)", () => {
    // the tell is three cells: dip, gather, REAR — and the rear is what holds
    // right up to the release, however long the tier and knot make the telegraph
    expect(tafel("telegraph")).toBe("windup0");
    expect(entPoseCell(ent({ role: "guardian", state: "telegraph", timer: 12 }))).toBe("windup1");
    expect(entPoseCell(ent({ role: "guardian", state: "telegraph", timer: 29 }))).toBe("windup");
    expect(tafel("throw")).toBe("throw");
    // the counter-window: she has come down and holds STILL, because the card
    // asks the child to read four chalked words off her
    expect(tafel("window")).toBe("land1");
    expect(tafel("consoled")).toBe("win"); // the friend, after the console beat
    expect(tafel("sad")).toBe("rest"); // beaten, resting on the boards
    expect(tafel("fly")).toBe("a"); // hovering: no travel, no bank
  });

  it("reads `consoled` BEFORE the dazed catch-all, or the win pose is unreachable", () => {
    // guardianKnotSolved sets state="consoled" on the last knot and leaves
    // redeemed false — the win cell is the payoff of doc 31 §3's console beat
    expect(tafel("consoled")).not.toBe("dazed");
    // a defeated NON-guardian still dazes …
    expect(entPoseCell(ent({ role: "chaser", state: "consoled" }))).toBe("dazed");
    // … but a GUARDIAN never may: `dazed` is a retired grounded-easel cell, and
    // the flight rig answers with its landed cell instead (PK-R6 · E ruling).
    expect(entPoseCell(ent({ role: "guardian", state: "dazed" }))).toBe("land1");
    expect(entPoseCell(ent({ role: "guardian", state: "idle", redeemed: true }))).toBe("land1");
  });

  it("leaves every non-guardian role's telegraph alone (TAMPER)", () => {
    expect(entPoseCell(ent({ role: "chaser", state: "telegraph" }))).toBe("telegraph");
    expect(entPoseCell(ent({ role: "gunner", state: "telegraph" }))).toBe("telegraph");
    expect(entPoseCell(ent({ role: "crusher", state: "telegraph" }))).toBe("telegraph");
  });
});

describe("entPoseCell — the old behaviour it must not disturb", () => {
  it("keeps the FSM cells ahead of any motion pose", () => {
    expect(entPoseCell(ent({ state: "telegraph", vx: ENEMY_WALK }))).toBe("telegraph");
    expect(entPoseCell(ent({ state: "burst" }))).toBe("burst");
    expect(entPoseCell(ent({ state: "shaking" }))).toBe("shake");
    for (const state of ["dazed", "consoled", "shooed"]) {
      expect(entPoseCell(ent({ state, vx: ENEMY_WALK }))).toBe("dazed");
    }
    expect(entPoseCell(ent({ redeemed: true, vx: ENEMY_WALK }))).toBe("dazed");
  });

  it("still alternates a/b every 12 ticks when nothing else fires", () => {
    expect(entPoseCell(ent({ timer: 0 }))).toBe("a");
    expect(entPoseCell(ent({ timer: 11 }))).toBe("a");
    expect(entPoseCell(ent({ timer: 12 }))).toBe("b");
    expect(entPoseCell(ent({ timer: 24 }))).toBe("a");
  });

  it("does not read a moving platform's ride delta as a gait", () => {
    // platform.move/.swing write a per-tick position delta into vx; that is the
    // ride contract, not a walk — a platform must never ask for a `_run` cell
    expect(entPoseCell(ent({ role: "platform.move", vx: ENEMY_WALK * 4 }))).toBe("a");
    expect(entPoseCell(ent({ role: "platform.swing", vx: -ENEMY_WALK * 4 }))).toBe("a");
  });
});
