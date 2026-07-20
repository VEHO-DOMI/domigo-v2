import { describe, expect, it } from "vitest";
import { PAINT, SUBS, TILE } from "./paint.ts";
import {
  applyKnockback,
  IDLE_PAD,
  type Pad,
  type PlayerEvent,
  type PlayerState,
  spawnPlayer,
  type StepOpts,
  stepPlayer,
} from "./player.ts";

const pad = (p: Partial<Pad>): Pad => ({ ...IDLE_PAD, ...p });

/** A tall flat room: floor top at y=176 (r11). */
const FLAT = [...Array.from({ length: 11 }, () => "............"), "############"];

interface Sim {
  st: PlayerState;
  events: PlayerEvent[];
  prev: Pad;
}

const sim = (grid: readonly string[], st: PlayerState): Sim => ({ st, events: [], prev: IDLE_PAD });

const tick = (s: Sim, grid: readonly string[], p: Pad, opts: StepOpts = {}): Sim => {
  const out = stepPlayer(s.st, p, s.prev, grid, opts);
  return { st: out.st, events: [...s.events, ...out.events], prev: p };
};

const settle = (grid: readonly string[], xPx: number, feetPx: number): Sim => {
  let s = sim(grid, spawnPlayer(xPx, feetPx));
  for (let t = 0; t < 3; t++) s = tick(s, grid, IDLE_PAD);
  expect(s.st.grounded).toBe(true);
  return { ...s, events: [] };
};

const apexRise = (s: Sim, grid: readonly string[], holdTicks: number, opts: StepOpts = {}): number => {
  const startFeet = s.st.y;
  let minFeet = startFeet;
  for (let t = 0; t < 60; t++) {
    s = tick(s, grid, pad({ jump: t < holdTicks }), opts);
    minFeet = Math.min(minFeet, s.st.y);
    if (t > 5 && s.st.grounded) break;
  }
  return (startFeet - minFeet) / SUBS;
};

describe("the jump (hold-window variable height — D)", () => {
  it("rises exactly 15px on a tap and exactly 70px on a full hold", () => {
    expect(apexRise(settle(FLAT, 32, 176), FLAT, 1)).toBe(15);
    expect(apexRise(settle(FLAT, 32, 176), FLAT, 40)).toBe(70);
  });

  it("emits jumped + landed (with the fall impact) around one arc", () => {
    let s = settle(FLAT, 32, 176);
    for (let t = 0; t < 60; t++) s = tick(s, FLAT, pad({ jump: t < 2 }));
    const kinds = s.events.map((e) => e.type);
    expect(kinds).toContain("jumped");
    expect(kinds).toContain("landed");
    const landed = s.events.find((e) => e.type === "landed");
    expect(landed && landed.type === "landed" && landed.impact).toBeGreaterThan(0);
    expect(s.st.grounded).toBe(true);
    expect(s.st.y).toBe(176 * SUBS); // back on the floor, exactly
  });
});

describe("coyote + buffer (OUR forgiveness — T)", () => {
  const LEDGE = [
    ...Array.from({ length: 8 }, () => "............"),
    "####........",
    ...Array.from({ length: 7 }, () => "............"),
  ];

  it("still jumps within the coyote window after walking off", () => {
    let s = settle(LEDGE, 24, 128);
    while (s.st.grounded) s = tick(s, LEDGE, pad({ right: true }));
    for (let t = 0; t < 3; t++) s = tick(s, LEDGE, IDLE_PAD); // 3 airborne ticks < 6
    s = { ...s, events: [] };
    s = tick(s, LEDGE, pad({ jump: true }));
    expect(s.events.map((e) => e.type)).toContain("jumped");
    expect(s.st.vy).toBe(PAINT.jumpVy);
  });

  it("refuses past the coyote window (and buffers instead)", () => {
    let s = settle(LEDGE, 24, 128);
    while (s.st.grounded) s = tick(s, LEDGE, pad({ right: true }));
    for (let t = 0; t < PAINT.coyoteTicks + 2; t++) s = tick(s, LEDGE, IDLE_PAD);
    s = { ...s, events: [] };
    s = tick(s, LEDGE, pad({ jump: true }));
    expect(s.events.map((e) => e.type)).not.toContain("jumped");
    expect(s.st.buffer).toBeGreaterThan(0);
  });

  it("fires a buffered jump on landing", () => {
    let s = sim(FLAT, spawnPlayer(32, 150)); // lands within the buffer window
    s = tick(s, FLAT, pad({ jump: true })); // pressed early — buffered
    expect(s.st.buffer).toBeGreaterThan(0);
    for (let t = 0; t < 20 && !s.events.some((e) => e.type === "jumped"); t++) {
      s = tick(s, FLAT, IDLE_PAD);
    }
    expect(s.events.map((e) => e.type)).toContain("jumped");
  });
});

describe("the hover (quill-rotor — R5: unlimited while held, +1px/t cap)", () => {
  it("glides all the way to the ground while jump stays held — no fuel", () => {
    let s = settle(FLAT, 32, 176);
    let hoverTicks = 0;
    let sawStart = 0;
    let lastAirborneHovering = false;
    for (let t = 0; t < 400; t++) {
      s = tick(s, FLAT, pad({ jump: true }), { canHover: true });
      if (!s.st.grounded) lastAirborneHovering = s.st.hovering;
      if (s.st.hovering) hoverTicks++;
      sawStart = s.events.filter((e) => e.type === "hoverStart").length;
      if (t > 20 && s.st.grounded) break;
    }
    expect(s.st.grounded).toBe(true);
    expect(hoverTicks).toBeGreaterThan(50); // beyond the old 50-tick fuel
    expect(lastAirborneHovering).toBe(true); // never ran out mid-air
    expect(sawStart).toBe(1);
  });

  it("caps fall at +1px/t while hovering (vs +4 free fall)", () => {
    let s = settle(FLAT, 32, 176);
    let maxHoverVy = 0;
    for (let t = 0; t < 80; t++) {
      s = tick(s, FLAT, pad({ jump: true }), { canHover: true });
      if (s.st.hovering) maxHoverVy = Math.max(maxHoverVy, s.st.vy);
    }
    expect(maxHoverVy).toBe(PAINT.hoverFallCap);
  });

  it("never hovers without the verb", () => {
    let s = settle(FLAT, 32, 176);
    for (let t = 0; t < 60; t++) {
      s = tick(s, FLAT, pad({ jump: true }));
      expect(s.st.hovering).toBe(false);
    }
  });
});

describe("running (momentum + hysteresis)", () => {
  it("reaches runMax and the run pose with the verb; walkMax without", () => {
    let s = settle(FLAT, 24, 176);
    for (let t = 0; t < 40; t++) s = tick(s, FLAT, pad({ right: true }), { canRun: true });
    expect(s.st.vx).toBe(PAINT.runMax);
    expect(s.st.pose).toBe("run");
    let w = settle(FLAT, 24, 176);
    for (let t = 0; t < 40; t++) w = tick(w, FLAT, pad({ right: true }));
    expect(w.st.vx).toBe(PAINT.walkMax);
    expect(w.st.pose).toBe("walk");
  });

  it("decays to a stop with no input (and slower on slippery phases)", () => {
    let s = settle(FLAT, 24, 176);
    for (let t = 0; t < 20; t++) s = tick(s, FLAT, pad({ right: true }));
    let normal = 0;
    let a = s;
    while (a.st.vx > 0) { a = tick(a, FLAT, IDLE_PAD); normal++; }
    let b = s;
    let icy = 0;
    while (b.st.vx > 0) { b = tick(b, FLAT, IDLE_PAD, { slippery: true }); icy++; }
    expect(icy).toBeGreaterThan(normal);
  });
});

describe("the fist charge (throwing is an event — flight lives in fist.ts)", () => {
  it("charges on the ground to the 63 cap and throws on release", () => {
    let s = settle(FLAT, 32, 176);
    s = tick(s, FLAT, pad({ punch: true }), { canPunch: true });
    expect(s.st.charge).toBe(5); // the studied seed
    for (let t = 0; t < 100; t++) s = tick(s, FLAT, pad({ punch: true }), { canPunch: true });
    expect(s.st.charge).toBe(PAINT.chargeMax);
    expect(s.st.pose).toBe("charge");
    s = tick(s, FLAT, IDLE_PAD, { canPunch: true });
    const thrown = s.events.find((e) => e.type === "fistThrown");
    expect(thrown && thrown.type === "fistThrown" && thrown.charge).toBe(PAINT.chargeMax);
    expect(s.st.charge).toBe(-1);
  });

  it("air-throws instantly at the fixed 32 charge", () => {
    let s = settle(FLAT, 32, 176);
    for (let t = 0; t < 3; t++) s = tick(s, FLAT, pad({ jump: true }), { canPunch: true });
    s = { ...s, events: [] };
    s = tick(s, FLAT, pad({ jump: true, punch: true }), { canPunch: true });
    const thrown = s.events.find((e) => e.type === "fistThrown");
    expect(thrown && thrown.type === "fistThrown" && thrown.charge).toBe(PAINT.airCharge);
  });

  it("does nothing without the verb, or while a fist is in flight", () => {
    let s = settle(FLAT, 32, 176);
    s = tick(s, FLAT, pad({ punch: true }));
    expect(s.st.charge).toBe(-1);
    s = tick(s, FLAT, pad({ punch: true }), { canPunch: true, fistBusy: true });
    expect(s.st.charge).toBe(-1);
    expect(s.events.filter((e) => e.type === "fistThrown")).toHaveLength(0);
  });
});

describe("hazards open ENCOUNTERS — never death", () => {
  const SPIKY = [...Array.from({ length: 10 }, () => "............"), "....^^......", "############"];

  it("emits one encounter, sets i-frames, and never repeats inside them", () => {
    let s = settle(SPIKY, 16, 176);
    for (let t = 0; t < 60; t++) s = tick(s, SPIKY, pad({ right: true }));
    const hits = s.events.filter((e) => e.type === "encounter");
    expect(hits).toHaveLength(1);
    expect(hits[0] && hits[0].type === "encounter" && hits[0].hazard).toBe("^");
    expect(s.st.iframes).toBeGreaterThan(0);
    // the state has no lives, no death, no respawn — recovery is a task
    expect(Object.keys(s.st)).not.toContain("lives");
  });

  it("applyKnockback recoils with the D vectors and locks briefly", () => {
    const st = applyKnockback(spawnPlayer(32, 176), 1, false);
    expect(st.vx).toBe(-PAINT.knockVx);
    expect(st.vy).toBe(PAINT.knockVy);
    expect(st.iframes).toBe(PAINT.iframeTicks);
    expect(st.pose).toBe("hit");
    const fast = applyKnockback(spawnPlayer(32, 176), -1, true);
    expect(fast.vx).toBe(PAINT.knockFastVx);
    expect(fast.vy).toBe(PAINT.knockFastVy);
  });
});

describe("springs", () => {
  const SPRUNG = [...Array.from({ length: 10 }, () => "............"), "....s.......", "############"];
  it("launches harder than a jump", () => {
    let s = settle(SPRUNG, 16, 176);
    for (let t = 0; t < 60 && !s.events.some((e) => e.type === "sprung"); t++) {
      s = tick(s, SPRUNG, pad({ right: true }));
    }
    expect(s.events.map((e) => e.type)).toContain("sprung");
    expect(s.st.vy).toBeLessThan(PAINT.jumpVy); // faster upward than a jump
  });
});

describe("the ledge grab + pull-up (the hang verb)", () => {
  // a wall c5 from r4 down; open air left of it; floor far below
  const WALLED = [
    "............",
    "............",
    "............",
    "............",
    ".....#......",
    ".....#......",
    ".....#......",
    ".....#......",
    "############",
  ];

  const fallIntoGrab = (): Sim => {
    let s = sim(WALLED, spawnPlayer(75, 70)); // beside the wall, above the ledge
    for (let t = 0; t < 20 && !s.st.hangAt; t++) {
      s = tick(s, WALLED, pad({ right: true }), { canHang: true });
    }
    return s;
  };

  it("grabs the ledge while falling toward it", () => {
    const s = fallIntoGrab();
    expect(s.st.hangAt).toEqual({ c: 5, r: 4 });
    expect(s.st.pose).toBe("hang");
    expect(s.st.y / SUBS).toBe(4 * TILE + 26); // feet at ledge top + hang drop
    expect(s.events.map((e) => e.type)).toContain("grabbedLedge");
  });

  it("UP does nothing at the hang (canonical: the grip is static, W0-F1)", () => {
    let s = fallIntoGrab();
    s = tick(s, WALLED, pad({ up: true }), { canHang: true });
    expect(s.st.hangAt).not.toBeNull();
    expect(s.st.pose).toBe("hang");
  });

  it("clears the ledge by JUMPING up-and-over (full strength + hold)", () => {
    let s = fallIntoGrab();
    s = tick(s, WALLED, pad({ jump: true }), { canHang: true });
    expect(s.st.hangAt).toBeNull();
    expect(s.st.vy).toBe(PAINT.hangJumpVy); // −5: a REAL jump, not a hop
    for (let t = 0; t < 45 && !(s.st.grounded && s.st.y === 4 * TILE * SUBS); t++) {
      s = tick(s, WALLED, pad({ jump: t < 12, right: true }), { canHang: true });
    }
    expect(s.st.grounded).toBe(true);
    expect(s.st.y / SUBS).toBe(4 * TILE); // standing ON the ledge — "I can get up"
    expect(s.st.x / SUBS).toBeGreaterThan(80); // …on top of the wall column
  });

  it("never grabs without the verb", () => {
    let s = sim(WALLED, spawnPlayer(75, 70));
    for (let t = 0; t < 20; t++) s = tick(s, WALLED, pad({ right: true }));
    expect(s.st.hangAt).toBeNull();
  });
});

describe("the vine", () => {
  const VINEY = [
    "............",
    "..V.........",
    "..V.........",
    "..V.........",
    "..V.........",
    "............",
    "############",
  ];

  it("latches airborne with UP, snaps to the column, climbs, and jumps off", () => {
    let s = sim(VINEY, spawnPlayer(38, 60));
    for (let t = 0; t < 10 && !s.st.climbing; t++) s = tick(s, VINEY, pad({ up: true }));
    expect(s.st.climbing).toBe(true);
    expect(s.st.x / SUBS).toBe(2 * TILE + TILE / 2); // snapped to the vine column
    const before = s.st.y;
    for (let t = 0; t < 6; t++) s = tick(s, VINEY, pad({ up: true }));
    expect(s.st.y).toBeLessThan(before);
    expect(s.st.pose).toBe("vine");
    s = tick(s, VINEY, pad({ jump: true }));
    expect(s.st.climbing).toBe(false);
    expect(s.st.vy).toBe(PAINT.jumpVy);
  });
});

describe("the ring swing (via the player)", () => {
  it("grabs a near ring while airborne, swings, and releases as a jump", () => {
    const ring = { x: 40 * SUBS, y: 40 * SUBS };
    let s = sim(FLAT, spawnPlayer(38, 80));
    // fall close under the ring's grab window
    for (let t = 0; t < 30 && !s.st.swing; t++) {
      s = tick(s, FLAT, IDLE_PAD, { ringAt: ring });
    }
    expect(s.st.swing).not.toBeNull();
    expect(s.st.pose).toBe("swing");
    expect(s.events.map((e) => e.type)).toContain("swingStart");
    for (let t = 0; t < 30; t++) s = tick(s, FLAT, IDLE_PAD, { ringAt: ring });
    s = { ...s, events: [] };
    s = tick(s, FLAT, pad({ jump: true }), { ringAt: null });
    expect(s.st.swing).toBeNull();
    expect(s.st.vy).toBeLessThan(0); // released upward-ish
    expect(s.events.map((e) => e.type)).toContain("jumped");
  });
});
