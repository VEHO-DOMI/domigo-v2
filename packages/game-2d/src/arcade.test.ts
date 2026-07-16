import { describe, expect, it } from "vitest";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ResolvedItem } from "@domigo/game-core";
import {
  airVx,
  ARCADE,
  cameraTargetX,
  cameraTargetY,
  canJump,
  checkLevelLaws,
  comboPoints,
  flyerOffset,
  flyerPhase,
  gravityFor,
  groundAt,
  hangPx,
  helpersFor,
  ledgeGrabAt,
  parseArcadeLevel,
  placementsFor,
  pogoGravityScale,
  pullUpPx,
  quickfireFor,
  rescuePlan,
  rescueScaffold,
  startJump,
  stepCloud,
  stepFuel,
  thiefTarget,
  TILE_PX,
  walkerShouldTurn,
  type ArcadeHeader,
} from "./arcade.ts";
import { DEFAULT_LEVEL_ID, LEVELS } from "./levels.ts";

const BARE: ArcadeHeader = { id: "t", name: "t", fragment: "t", placements: [], seals: [], helpers: [] };

// ── the THRUST-FUEL jump (bible §2.2 — Keen's jumptime model, NOT impulse-cut)

describe("thrust-fuel jump", () => {
  it("holding feeds constant thrust for the whole fuel window", () => {
    let s: ReturnType<typeof startJump> | null = startJump("jump");
    expect(s.fuelMs).toBe(ARCADE.jumpFuelMs);
    let heldMs = 0;
    while (s !== null) {
      const r = stepFuel(s, true, false, 16.7);
      if (r.vy !== null) {
        expect(r.vy).toBe(ARCADE.jumpThrust);
        heldMs += 16.7;
      }
      s = r.next;
    }
    expect(heldMs).toBeGreaterThan(ARCADE.jumpFuelMs - 17);
    expect(heldMs).toBeLessThan(ARCADE.jumpFuelMs + 17);
  });

  it("releasing the button zeroes the FUEL, never the velocity", () => {
    const r = stepFuel(startJump("jump"), false, false, 16.7);
    expect(r.next).toBeNull();
    expect(r.vy).toBeNull(); // gravity owns the frame; current vy untouched
  });

  it("a ceiling bump ends the fuel", () => {
    expect(stepFuel(startJump("jump"), true, true, 16.7).next).toBeNull();
  });

  it("the pogo carries more fuel and more thrust than the jump", () => {
    const p = startJump("pogo");
    expect(p.fuelMs).toBeGreaterThan(ARCADE.jumpFuelMs);
    expect(Math.abs(p.thrust)).toBeGreaterThan(Math.abs(ARCADE.jumpThrust));
  });

  it("coyote + buffer both open the jump window (documented deviations)", () => {
    expect(canJump(1000, 1000, 1000)).toBe(true);
    expect(canJump(1000, 1000 - ARCADE.coyoteMs, 1000)).toBe(true);
    expect(canJump(1000, 1000 - ARCADE.coyoteMs - 1, 1000)).toBe(false);
    expect(canJump(1000, 1000, 1000 - ARCADE.bufferMs)).toBe(true);
    expect(canJump(1000, 1000, 1000 - ARCADE.bufferMs - 1)).toBe(false);
  });
});

describe("air control + the pogo", () => {
  it("air is analog: velocity ramps, never snaps (that trick is the ground's)", () => {
    const v1 = airVx(0, 1, false, 16.7);
    expect(v1).toBeGreaterThan(0);
    expect(v1).toBeLessThan(ARCADE.runSpeed);
  });

  it("no input bleeds air speed toward zero", () => {
    const v = airVx(200, 0, false, 16.7);
    expect(v).toBeLessThan(200);
    expect(v).toBeGreaterThan(0);
  });

  it("pogo steering is half-authority (Keen's ±1 vs the air's ±2)", () => {
    expect(airVx(0, 1, true, 16.7)).toBeCloseTo(airVx(0, 1, false, 16.7) * ARCADE.pogoSteerScale, 5);
  });

  it("the impossible pogo: hold jump while rising → tiny gravity", () => {
    expect(pogoGravityScale(true, true, true)).toBe(ARCADE.pogoHoldGravityScale);
    expect(pogoGravityScale(true, true, false)).toBe(1);
    expect(pogoGravityScale(true, false, true)).toBe(1);
    expect(pogoGravityScale(false, true, true)).toBe(1);
  });

  it("tier E weakens gravity (Keen's Easy dial); M/S run it straight", () => {
    expect(gravityFor("E")).toBeLessThan(ARCADE.gravity);
    expect(gravityFor("M")).toBe(ARCADE.gravity);
  });
});

// ── ledge grab (bible §2.5): falling + held-toward + clear-above/solid-below

describe("ledge grab", () => {
  const lvl = parseArcadeLevel(BARE, [
    ".......",
    ".......",
    "....##.",
    "S...##.",
    "#####A#",
    "#######",
  ]);
  const px = 3 * TILE_PX + TILE_PX / 2; // player column 3, wall at column 4
  // hands = sprite top (py − 0.4·TILE); place the top just past the r2 lip
  const py = 2 * TILE_PX + 2 + TILE_PX * 0.4;

  it("grabs a clear-above/solid-below lip while falling toward it", () => {
    expect(ledgeGrabAt(lvl, px, py, 300, 1)).toEqual({ c: 4, r: 2 });
  });

  it("refuses while rising, without input, away from the wall, or mid-wall", () => {
    expect(ledgeGrabAt(lvl, px, py, -100, 1)).toBeNull();
    expect(ledgeGrabAt(lvl, px, py, 300, 0)).toBeNull();
    expect(ledgeGrabAt(lvl, px, py, 300, -1)).toBeNull();
    // one row lower the cell ahead is solid (mid-wall) → no grab
    expect(ledgeGrabAt(lvl, px, py + TILE_PX, 300, 1)).toBeNull();
  });

  it("hang hugs the near side; pull-up ends standing on the held cell", () => {
    const spot = { c: 4, r: 2 };
    const hang = hangPx(spot, 1);
    expect(hang.x).toBeLessThan(4 * TILE_PX);
    const up = pullUpPx(spot);
    expect(up.y).toBeLessThan(hang.y);
    expect(Math.floor(up.x / TILE_PX)).toBe(4);
  });
});

// ── the Keen camera (bible §2.6)

describe("camera", () => {
  const viewW = 15 * TILE_PX;
  it("holds inside the dead-band, tracks outside it", () => {
    const inside = (ARCADE.camBandLeft + 1) * TILE_PX;
    expect(cameraTargetX(0, inside, viewW)).toBe(0);
    const beyond = (ARCADE.camBandRight / 15) * viewW + 50;
    expect(cameraTargetX(0, beyond, viewW)).toBeCloseTo(50, 5);
  });

  it("vertical rest sits the player low; look is ASYMMETRIC (Keen: down reveals more)", () => {
    const viewH = 11 * TILE_PX;
    const rest = cameraTargetY(500, viewH, 0);
    expect(cameraTargetY(500, viewH, -1)).toBe(rest - ARCADE.lookUpTiles * TILE_PX);
    expect(cameraTargetY(500, viewH, 1)).toBe(rest + ARCADE.lookDownTiles * TILE_PX);
    expect(ARCADE.lookDownTiles).toBeGreaterThan(ARCADE.lookUpTiles);
  });
});

// ── level format v2 + the laws

describe("level v2", () => {
  it("rejects ragged rows, unknown glyphs, wrong S/A counts", () => {
    expect(() => parseArcadeLevel(BARE, ["..", "..."])).toThrow(/rectangular/);
    expect(() => parseArcadeLevel(BARE, ["SQ", ".A"])).toThrow(/unknown glyph/);
    expect(() => parseArcadeLevel(BARE, ["S.", ".."])).toThrow(/one exit/);
  });

  it("tier populations are cumulative (E ⊂ M ⊂ S)", () => {
    const header = LEVELS[DEFAULT_LEVEL_ID]!.level.header;
    expect(placementsFor(header, "E").length).toBeLessThan(placementsFor(header, "M").length);
    expect(placementsFor(header, "M").length).toBeLessThan(placementsFor(header, "S").length);
  });

  it("inverse scaffolding: easy never has fewer helpers than hard", () => {
    for (const { level } of Object.values(LEVELS)) {
      expect(helpersFor(level.header, "E").length).toBeGreaterThanOrEqual(helpersFor(level.header, "S").length);
    }
  });

  it("the ramp: level 2 defaults harder than level 1", () => {
    expect(LEVELS["lesesaal"]!.defaultTier).toBe("E");
    expect(LEVELS["schacht"]!.defaultTier).toBe("M");
    expect(LEVELS["schacht"]!.level.header.helpers.length).toBeLessThan(LEVELS["lesesaal"]!.level.header.helpers.length);
  });
});

describe("the level laws (§4.2)", () => {
  for (const [id, { level }] of Object.entries(LEVELS)) {
    it(`${id}: reachability + gaps + spike recovery + verticality all green`, () => {
      expect(checkLevelLaws(level).errors).toEqual([]);
    });
  }

  it("tamper check: gutting the floor makes the law fail (it can turn red)", () => {
    const base = LEVELS[DEFAULT_LEVEL_ID]!.level;
    const rows = base.rows.map((r, i) => (i >= base.h - 4 ? r.replace(/#/g, ".") : r));
    expect(checkLevelLaws({ ...base, rows }).ok).toBe(false);
  });
});

// ── creatures

describe("creatures", () => {
  it("walker turns at cliffs and walls, keeps going on footing", () => {
    const lvl = parseArcadeLevel(BARE, ["S..A", "##.."]);
    expect(walkerShouldTurn(lvl, 0, 0, 1)).toBe(false);
    expect(walkerShouldTurn(lvl, 1, 0, 1)).toBe(true); // cliff ahead
    const walled = parseArcadeLevel(BARE, ["S#.A", "####"]);
    expect(walkerShouldTurn(walled, 0, 0, 1)).toBe(true); // wall ahead
  });

  it("flyer bobs bounded + rests on a readable cycle (the pogo window)", () => {
    for (const t of [0, 250, 700, 1600]) expect(Math.abs(flyerOffset(t, 3))).toBeLessThanOrEqual(ARCADE.flyerAmp);
    expect(flyerPhase(0, 0)).toBe("fly");
    expect(flyerPhase(ARCADE.flyerRestEveryMs + 10, 0)).toBe("rest");
  });

  it("thief hunts the nearest untaken letter; idles when none remain", () => {
    const letters = [
      { c: 2, r: 2, taken: false },
      { c: 20, r: 2, taken: false },
    ];
    expect(thiefTarget(letters, 3 * TILE_PX, 2 * TILE_PX)).toEqual({ c: 2, r: 2 });
    letters[0]!.taken = true;
    expect(thiefTarget(letters, 3 * TILE_PX, 2 * TILE_PX)).toEqual({ c: 20, r: 2 });
    letters[1]!.taken = true;
    expect(thiefTarget(letters, 0, 0)).toBeNull();
  });

  it("cloud: sleep → drift → telegraph (readable) → bolt → cooldown", () => {
    const self = { x: 500, y: 100 };
    const below = { x: 500, y: 300 };
    const far = { x: 3000, y: 300 };
    expect(stepCloud({ kind: "sleep" }, self, far, 0, 16.7).next.kind).toBe("sleep");
    expect(stepCloud({ kind: "sleep" }, self, below, 0, 16.7).next.kind).toBe("drift");
    const tel = stepCloud({ kind: "drift", vx: 0 }, self, below, 1000, 16.7);
    expect(tel.next.kind).toBe("telegraph");
    expect(stepCloud(tel.next, self, below, 1000 + ARCADE.cloudTelegraphMs - 50, 16.7).spawnBolt).toBe(false);
    const fire = stepCloud(tel.next, self, below, 1000 + ARCADE.cloudTelegraphMs + 1, 16.7);
    expect(fire.spawnBolt).toBe(true);
    expect(fire.next.kind).toBe("cooldown");
  });
});

// ── quickfire + the Rettungsaufgabe: one brain, presentation only here ──────

const vocab = (id: string, en: string, de: string, d = `meaning of ${en}`): ResolvedItem => ({
  kind: "vocab",
  item: {
    id, w: en, g: de, d, s: `The ___ is here.`,
    sAnswers: [{ text: en, tier: "full" }],
    dAnswers: [{ text: en, tier: "full" }],
    translation: { deToEn: [{ text: en, tier: "full" }], enToDe: [{ text: de, tier: "full" }] },
  } as unknown as VocabItem,
});
const mc = (id: string, answer: string, distractors: string[]): ResolvedItem => ({
  kind: "grammar",
  item: { id, format: "multiple-choice", prompt: { text: "She ___ to school." }, answers: [{ text: answer, tier: "full" }], distractors } as unknown as GrammarItem,
});
const ITEMS: ResolvedItem[] = [
  vocab("v.time", "timetable", "der Stundenplan"),
  vocab("v.sub", "subject", "das Fach"),
  vocab("v.break", "break", "die Pause"),
  mc("g.mc", "goes", ["go", "going", "gone"]),
];

describe("quickfire", () => {
  it("vocab: 3 chips, answer present, decoys stay in the answer's language", () => {
    const qf = quickfireFor(ITEMS, 1)!; // idx 1 → enToDe (German answers)
    expect(qf.pool).toBe("enToDe");
    expect(qf.chips).toHaveLength(3);
    expect(qf.chips).toContain("das Fach");
    for (const chip of qf.chips) expect(["das Fach", "der Stundenplan", "die Pause"]).toContain(chip);
  });

  it("grammar chips come from authored distractors; thin pools return null", () => {
    const qf = quickfireFor(ITEMS, 3)!;
    expect(qf.kind).toBe("grammar");
    expect(qf.chips).toContain("goes");
    expect(quickfireFor([vocab("v.solo", "alone", "allein")], 0)).toBeNull();
    expect(quickfireFor([], 0)).toBeNull();
  });

  it("deterministic; pools rotate by contact index", () => {
    expect(quickfireFor(ITEMS, 1)).toEqual(quickfireFor(ITEMS, 1));
    expect(quickfireFor(ITEMS, 0)!.pool).not.toBe(quickfireFor(ITEMS, 1)!.pool);
  });

  it("combo ladder escalates and caps (Keen point ladders)", () => {
    expect(comboPoints(1)).toBe(100);
    expect(comboPoints(3)).toBe(300);
    expect(comboPoints(99)).toBe(800);
  });
});

describe("die Rettungsaufgabe (§5.3)", () => {
  it("plans 2 fuller tasks — typed carrier production first, rotating by death", () => {
    const plan = rescuePlan(ITEMS, 0);
    expect(plan).toHaveLength(2);
    expect(plan[0]!.presentation).toBe("typed");
    expect(plan[0]!.pool).toBe("carrier");
    expect(plan[0]!.prompt).toContain("___"); // a real carrier line
    expect(rescuePlan(ITEMS, 0)).toEqual(plan); // deterministic
    expect(rescuePlan(ITEMS, 1)[0]!.itemId).not.toBe(plan[0]!.itemId); // rotation
  });

  it("grammar rescue tasks arrive as chips with the answer present", () => {
    const g = rescuePlan(ITEMS, 0).find((t) => t.kind === "grammar");
    expect(g).toBeDefined();
    expect(g!.presentation).toBe("chips");
    expect(g!.chips).toContain(g!.answer);
  });

  it("the scaffold only steps DOWN: typed → chips (answer present), never up", () => {
    const typed = rescuePlan(ITEMS, 0)[0]!;
    const chips = rescueScaffold(typed, ITEMS);
    expect(chips.presentation).toBe("chips");
    expect(chips.chips).toContain(typed.answer);
    expect(rescueScaffold(chips, ITEMS)).toEqual(chips);
  });
});

// ── ground helper (kept)

describe("groundAt", () => {
  it("solids and one-ways are ground; air, spikes, letters are not", () => {
    const lvl = parseArcadeLevel(BARE, ["S=A.", "#.^L"]);
    expect(groundAt(lvl, 1, 0)).toBe(true); // '='
    expect(groundAt(lvl, 0, 1)).toBe(true); // '#'
    expect(groundAt(lvl, 2, 1)).toBe(false); // '^'
    expect(groundAt(lvl, 3, 1)).toBe(false); // 'L'
  });
});
