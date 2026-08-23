// PK-R6 · E · THE FLYING TAFEL — the laws of the boss fight, as machine checks.
//
// Two of these are the packet's named guardrails and BOTH are tamper-proven:
//   · the fairness law — no tell shorter than 500 ms, on any tier, at any knot;
//   · the identity law — no state she can be in mid-flight may resolve to the
//     retired grounded easel (`tafel_sad`/`_dazed`/`_stagger`/`_telegraph`).
//
// The identity check does not carry a hand-written list of states: it DRIVES the
// real machine across every tier and every knot and asserts against whatever
// states that machine actually produces. A state added later is covered the day
// it is added, which is the difference between a guard and a comment.

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import {
  CHALK_ARM_TICKS,
  CHALK_COLOURS,
  CHALK_FLIGHT_TICKS,
  CHALK_GRAVITY,
  DIP_STANDOFF_PX,
  FORK_LEAD_PX,
  DODGES_PER_WINDOW,
  FLIGHT_BAND_PX,
  GUARDIAN_HELD_STATES,
  GUARDIAN_WIPE_REACH_PX,
  KNOT_SPAN_PX,
  GUARDIAN_SCRIPT,
  KNOT_PERIOD_TICKS,
  KNOT_RATE,
  SHARD_REACH_Y_PX,
  SHARD_TICKS,
  SKID_SPEED,
  TELEGRAPH_FLOOR_TICKS,
  wipeWaitTicksFor,
  type ProjectileState,
  flightPointAt,
  guardianKnotSolved,
  spawnEntities,
  stepEntities,
  telegraphTicksFor,
  throwEveryFor,
  type EntityWorld,
  type WorldInput,
} from "./entities.ts";
import {
  BOSS_BEAT_SWELL, FLIGHT_BANK_FACE, FLIGHT_PITCH_MAX_RAD, FLIGHT_PITCH_REF_VY, FLIGHT_ROLL_MIN,
  FLIGHT_ROLL_REF_VX, FLIGHT_ROLL_TICKS, GUARDIAN_DISPLAY_H, GUARDIAN_GROUNDED_CELLS,
  GUARDIAN_KEEPIN_MAX,
  GUARDIAN_SLATE, GUARDIAN_LANDED_CELLS, entPoseCell, guardianManoeuvre,
  guardianPitchRad, guardianRollScaleX,
} from "./anim.ts";
import { GUARDIAN_RIG_CELLS } from "./artManifest.ts";
import { BOLT_SHORT, KNOT_PATHS, ZIG_TEETH, flightUnitAt, pathForKnot } from "./flight.ts";
import { LOGICAL_H, PAINT, SUBS, TICK_MS, TILE } from "./paint.ts";
import { cameraTargetY, clampScroll } from "./camera.ts";
import type { EntitySpec, PaintLevel } from "./level.ts";

const TIERS = ["E", "M", "S"] as const;

// a 40×14 room with the floor at row 12 — the entities suite's own fixture
const GRID: string[] = [
  ...Array.from({ length: 8 }, () => "........................................"),
  "....................########............",
  "........................................",
  "........................................",
  "........................................",
  "########################################",
  "########################################",
];

const guardianSpec = (tier: "E" | "M" | "S"): EntitySpec =>
  ({ id: "tafel", role: "guardian", skin: "tafel", c: 17, r: 11, tier, params: {} }) as EntitySpec;

const input = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 17 * TILE * SUBS,
  playerY: 12 * TILE * SUBS,
  playerIframes: 0,
  playerOverlayOpen: false,
  fist: null,
  ...over,
});

/** A child who paces — the chapter's own answer to a thrower. */
const pacing = (t: number): WorldInput =>
  input({ playerX: (16 + (Math.floor(t / 40) % 2 === 0 ? 8 : -8)) * TILE * SUBS });

// ── THE FAIRNESS LAW ────────────────────────────────────────────────────────
describe("the telegraph is never shorter than 500 ms (doc 44 §4 ch01 C4)", () => {
  it("holds on EVERY tier and EVERY knot, through the sim's own function", () => {
    // 30 ticks IS 500 ms on the 60 Hz contract — state the conversion, so a
    // change to the tick rate cannot quietly shorten the law.
    expect(TELEGRAPH_FLOOR_TICKS * TICK_MS).toBeGreaterThanOrEqual(500);
    for (const tier of TIERS) {
      const knots = GUARDIAN_SCRIPT[tier].knots;
      for (let hp = knots; hp >= 1; hp--) {
        const ticks = telegraphTicksFor(tier, hp, knots);
        expect(
          ticks * TICK_MS,
          `tier ${tier}, ${hp} knots left: a ${Math.round(ticks * TICK_MS)} ms tell is unanswerable`,
        ).toBeGreaterThanOrEqual(500);
      }
    }
  });

  it("the escalation really does shorten the clocks — the floor is load-bearing", () => {
    // If the knots did not tighten anything, the floor above would be proving
    // nothing. Tier E has room to shorten and does; tier S is already AT the
    // floor by its last knot, which is exactly what the clamp exists for.
    expect(telegraphTicksFor("E", 2, 3)).toBeLessThan(telegraphTicksFor("E", 3, 3));
    expect(throwEveryFor("E", 1, 3)).toBeLessThan(throwEveryFor("E", 3, 3));
    expect(telegraphTicksFor("S", 1, 5)).toBe(TELEGRAPH_FLOOR_TICKS);
  });

  it("a thrown piece is INERT until it has visibly left her hand", () => {
    // the second half of the same law — see CHALK_ARM_TICKS
    expect(CHALK_ARM_TICKS).toBeGreaterThan(0);
    expect(CHALK_ARM_TICKS).toBeLessThan(CHALK_FLIGHT_TICKS);
  });
});

// ── THE IDENTITY LAW ────────────────────────────────────────────────────────
describe("the flying Tafel never wears the retired grounded easel (PB-F1)", () => {
  /** Drive the real machine and collect every state it produces, tier by tier,
   *  knot by knot, including the terminal beats. */
  const statesReached = (): { flight: Set<string>; terminal: Set<string> } => {
    const flight = new Set<string>();
    const terminal = new Set<string>();
    for (const tier of TIERS) {
      const w: EntityWorld = spawnEntities([guardianSpec(tier)], []);
      const g = w.entities[0]!;
      const knots = GUARDIAN_SCRIPT[tier].knots;
      let solved = 0;
      for (let t = 0; t < 20000 && solved <= knots; t++) {
        // R5-W4 · H2 (R50): eine beantwortete Karte setzt sie nur noch auf die
        // Bretter — die Schicht geht erst weg, wenn das Kind HINGEHT. Also geht
        // dieses Kind hin, sobald sie wartet; täte es das nicht, höbe sie mit
        // der Schicht wieder ab und der Kampf hätte kein Ende.
        const evs = stepEntities(w, GRID, g.state === "wipeable" ? input({ playerX: g.x, playerY: g.y }) : pacing(t));
        flight.add(g.state);
        for (const ev of evs) {
          if (ev.type === "guardianStagger") {
            // the shell's move: the window opens, the card is answered
            g.state = "window";
            flight.add(g.state);
            guardianKnotSolved(w, g.id);
          }
          // gezählt wird jetzt, was WIRKLICH eine Schicht gekostet hat
          if (ev.type === "guardianKnot" || ev.type === "guardianDown") solved++;
        }
        if (g.state === "sink" || g.state === "sad" || g.state === "consoled") terminal.add(g.state);
      }
      expect(solved, `tier ${tier} never reached its last knot`).toBeGreaterThanOrEqual(knots);
    }
    return { flight, terminal };
  };

  const cellFor = (state: string, timer = 0): string =>
    entPoseCell({ role: "guardian", state, timer, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 });

  it("reaches the whole machine — flight, window and the consolation", () => {
    const { flight, terminal } = statesReached();
    // the states the fight is made of are all actually exercised
    for (const s of ["fly", "telegraph", "throw", "dip", "stagger", "window"]) {
      expect(flight, `the run never reached the ${s} state`).toContain(s);
    }
    expect([...terminal].sort()).toEqual(["consoled", "sad", "sink"]);
  });

  it("TAMPER TARGET: no state resolves to a grounded-easel cell", () => {
    const { flight, terminal } = statesReached();
    for (const state of [...flight, ...terminal]) {
      // sweep the timer too — the windup cycles cells on it
      for (const timer of [0, 5, 11, 17, 23, 40, 90]) {
        const cell = cellFor(state, timer);
        expect(
          GUARDIAN_GROUNDED_CELLS.has(cell),
          `state "${state}" (timer ${timer}) resolves to "${cell}" — that is the RETIRED easel, and swapping bodies mid-fight is PB-F1`,
        ).toBe(false);
      }
    }
  });

  it("R5-W4b · H3 (D-190) · jeder erreichbare Zustand ist entweder Flug oder FESTGEHALTEN", () => {
    // Die Über-Reichweite zählt nur, solange sie den Kampf führt. Welche
    // Zustände das NICHT sind, stand zweimal getippt in `entities.ts` und war
    // beide Male unvollständig (`settle`/`wipeable`/`wipe` fehlten seit dem
    // Wischen). Jetzt steht die Liste einmal — und dieses Gesetz sorgt dafür,
    // dass sie vollständig BLEIBT: die Maschine liefert die Zustände selbst,
    // wie beim Staffelei-Gesetz darüber, und jeder muss klassifiziert sein.
    const FLYING = new Set(["fly", "telegraph", "throw", "untie", "turn", "roll", "consoled"]);
    const { flight, terminal } = statesReached();
    for (const state of [...flight, ...terminal]) {
      expect(
        GUARDIAN_HELD_STATES.has(state) || FLYING.has(state),
        `der Zustand "${state}" ist weder Flug noch festgehalten — `
        + `dann zählt ein vorbeifliegendes Stück Kreide dort NACH GEFÜHL, nicht nach Gesetz`,
      ).toBe(true);
    }
    // …und die vier Halte-Zustände des Wischens sind wirklich drin
    for (const s of ["settle", "wipeable", "wipe", "window"]) {
      expect(GUARDIAN_HELD_STATES.has(s), `"${s}" fehlt in GUARDIAN_HELD_STATES`).toBe(true);
    }
  });

  it("grounded is right in exactly ONE place: when she has landed, beaten", () => {
    expect(GUARDIAN_LANDED_CELLS.has(cellFor("sad"))).toBe(true);
    expect(GUARDIAN_LANDED_CELLS.has(cellFor("consoled"))).toBe(true);
    // …and nowhere else — a flying board may not wear a landed cell
    for (const s of ["fly", "telegraph", "throw"]) {
      expect(GUARDIAN_LANDED_CELLS.has(cellFor(s))).toBe(false);
    }
  });
});

// ── THE READABLE PATHS ──────────────────────────────────────────────────────
describe("the three knot paths (doc 44 §4 ch01 C4)", () => {
  it("escalates spiral → figure-eight → zigzag, gentlest first", () => {
    expect(KNOT_PATHS.slice(0, 3)).toEqual(["spiral", "eight", "zigzag"]);
    expect(pathForKnot(3, 3)).toBe("spiral"); // knot 1: full health
    expect(pathForKnot(2, 3)).toBe("eight");
    expect(pathForKnot(1, 3)).toBe("zigzag"); // knot 3: the last one
    expect(pathForKnot(5, 5)).toBe("spiral");
  });

  // ── R5-W4 · H2 · DIE ESKALATION HÖRT NICHT MEHR BEI DREI AUF (D-83) ───────
  it("jede Stufe fliegt so viele VERSCHIEDENE Bahnen, wie sie Schichten hat", () => {
    // Der Defekt in einem Satz: die Tabellen waren drei lang, `knotIndex`
    // klemmte auf 2, und die vierte und fünfte Schicht der Stufen M und S
    // bekamen die Werte der dritten. Für ch01 (Stufe E) folgenlos — für jedes
    // Kapitel danach eine Eskalation, die in der Mitte stehen bleibt.
    for (const tier of TIERS) {
      const knots = GUARDIAN_SCRIPT[tier].knots;
      const flown = new Set(Array.from({ length: knots }, (_, i) => pathForKnot(knots - i, knots)));
      expect(flown.size, `Stufe ${tier}: ${knots} Schichten, aber nur ${flown.size} Bahnen`).toBe(knots);
    }
    expect(GUARDIAN_SCRIPT.S.knots, "Stufe S ist die längste Reihe, die es gibt").toBe(5);
  });

  it("und die vier Reihen sind GLEICH LANG — sonst klemmt eine still", () => {
    // Die eigentliche Klasse hinter D-83: vier Tabellen, ein Index. Wer eine
    // verlängert und die anderen vergisst, bekommt keinen Fehler, sondern eine
    // Stufe, die halb eskaliert. Dieses Gesetz ist billiger als der Fund.
    expect(KNOT_SPAN_PX.length).toBe(KNOT_PATHS.length);
    expect(KNOT_PERIOD_TICKS.length).toBe(KNOT_PATHS.length);
    expect(KNOT_RATE.length).toBe(KNOT_PATHS.length);
    // …und keine Reihe darf kürzer sein als die längste Stufe
    for (const tier of TIERS) expect(KNOT_PATHS.length).toBeGreaterThanOrEqual(GUARDIAN_SCRIPT[tier].knots);
  });

  it("die Reihen bewegen sich in EINE Richtung — Eskalation, keine Zufallszahlen", () => {
    for (let i = 1; i < KNOT_PATHS.length; i++) {
      expect(KNOT_SPAN_PX[i]!, "die Spannweite wächst").toBeGreaterThan(KNOT_SPAN_PX[i - 1]!);
      expect(KNOT_PERIOD_TICKS[i]!, "die Periode schrumpft").toBeLessThan(KNOT_PERIOD_TICKS[i - 1]!);
      expect(KNOT_RATE[i]!, "die Uhren ziehen an").toBeLessThan(KNOT_RATE[i - 1]!);
    }
    // …und gedämpft: kein Schritt ist grösser als der davor (sonst wäre die
    // fünfte Schicht ein Sprung ins Unlesbare statt eine Steigerung)
    for (let i = 2; i < KNOT_PATHS.length; i++) {
      expect(KNOT_SPAN_PX[i]! - KNOT_SPAN_PX[i - 1]!)
        .toBeLessThanOrEqual(KNOT_SPAN_PX[i - 1]! - KNOT_SPAN_PX[i - 2]!);
      expect(KNOT_PERIOD_TICKS[i - 1]! - KNOT_PERIOD_TICKS[i]!)
        .toBeLessThanOrEqual(KNOT_PERIOD_TICKS[i - 2]! - KNOT_PERIOD_TICKS[i - 1]!);
    }
  });

  it("die zwei neuen Bahnen setzen die Reihe fort, statt sie zu wiederholen", () => {
    // clover: der Achter mit einer dritten Schleife. Gemessen wird, was ein
    // Kind wirklich unterscheidet — wie oft sie die Richtung wechselt, während
    // sie einmal durchfliegt. (Erster Anlauf zählte Abtastpunkte nahe der
    // Mitte: das misst die VERWEILDAUER dort, nicht die Zahl der Durchgänge,
    // und ging prompt in die falsche Richtung, weil der Klee steiler
    // durchfährt. Eine Zahl, die das Gegenteil ihrer Behauptung misst.)
    const reversals = (p: Parameters<typeof flightUnitAt>[0]): number => {
      const N = 4000;
      let turns = 0;
      let prev = flightUnitAt(p, 1 / N).fy - flightUnitAt(p, 0).fy;
      for (let i = 1; i < N; i++) {
        const d = flightUnitAt(p, (i + 1) / N).fy - flightUnitAt(p, i / N).fy;
        if (d !== 0 && prev !== 0 && Math.sign(d) !== Math.sign(prev)) turns++;
        if (d !== 0) prev = d;
      }
      return turns;
    };
    expect(reversals("clover"), "der Klee dreht öfter als der Achter")
      .toBeGreaterThan(reversals("eight"));
    // …und er geht durch die Mitte, wie der Achter auch
    for (const u of [0, 0.5]) {
      expect(flightUnitAt("clover", u).fx).toBeCloseTo(0, 9);
      expect(flightUnitAt("clover", u).fy).toBeCloseTo(0, 9);
    }
    // bolt: der Zickzack mit ungleichen Zähnen — die Höhe wechselt, also lässt
    // sich der nächste Zahn nicht mehr aus dem letzten ablesen.
    const peak = (teeth: number): number[] =>
      Array.from({ length: teeth }, (_, k) => Math.abs(flightUnitAt("bolt", (k + 0.5) / teeth).fy));
    const peaks = peak(ZIG_TEETH);
    expect(new Set(peaks.map((x) => x.toFixed(3))).size, "alle Zähne gleich hoch = derselbe Zickzack").toBeGreaterThan(1);
    expect(Math.min(...peaks)).toBeCloseTo(BOLT_SHORT, 6);
  });

  it("every shape is CLOSED — she can trace it forever with no seam", () => {
    for (const p of KNOT_PATHS) {
      const a = flightUnitAt(p, 0);
      const b = flightUnitAt(p, 1);
      expect(b.fx).toBeCloseTo(a.fx, 9);
      expect(b.fy).toBeCloseTo(a.fy, 9);
    }
  });

  it("every shape stays inside its own amplitudes (the arena decides the size)", () => {
    for (const p of KNOT_PATHS) {
      for (let i = 0; i <= 400; i++) {
        const { fx, fy } = flightUnitAt(p, i / 400);
        expect(Math.abs(fx)).toBeLessThanOrEqual(1.0000001);
        expect(Math.abs(fy)).toBeLessThanOrEqual(1.0000001);
      }
    }
  });

  it("the figure-eight really crosses itself, and the zigzag really has corners", () => {
    // the eight passes through its own centre twice per lap (u = 0 and u = ½)
    expect(flightUnitAt("eight", 0.5).fx).toBeCloseTo(0, 9);
    expect(flightUnitAt("eight", 0.5).fy).toBeCloseTo(0, 9);
    // …and reaches both extremes on the way
    expect(flightUnitAt("eight", 0.25).fx).toBeCloseTo(1, 9);
    expect(flightUnitAt("eight", 0.75).fx).toBeCloseTo(-1, 9);
    // the zigzag sweeps corner to corner, linearly (constant speed, sharp turns)
    expect(flightUnitAt("zigzag", 0).fx).toBeCloseTo(-1, 9);
    expect(flightUnitAt("zigzag", 0.5).fx).toBeCloseTo(1, 9);
    // the spiral pulls IN at the middle of its pass and comes back out
    const r0 = Math.abs(flightUnitAt("spiral", 0).fx);
    const rMid = Math.hypot(flightUnitAt("spiral", 0.5).fx, flightUnitAt("spiral", 0.5).fy);
    expect(rMid).toBeLessThan(r0);
  });
});

// ── THE PATH IS ON SCREEN (the fairness law's geometric half) ───────────────
describe("her whole body stays in the visible band (readable = seeable)", () => {
  const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");
  const levelPath = path.join(CONTENT, "g1.st.lost-pages", "paint", "ch01.level.json");

  it("every knot's full path stays inside the camera's band over the arena", () => {
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const arena = level.arena;
    expect(arena, "ch01 has no arena phase").toBeTruthy();
    const rows = arena!.rows;
    const worldHpx = rows.length * TILE;
    const g = arena!.entities.find((e) => e.role === "guardian")!;
    expect(g, "the arena has no guardian").toBeTruthy();

    // where the camera sits with the child standing on the arena floor — the
    // worst case for a boss who flies HIGH. Recomputed from camera.ts, so a
    // change to the follow rest-line moves this check with it.
    const floorRow = rows.findIndex((r, i) => i > 0 && r.startsWith("####################"));
    const feetY = floorRow * TILE * SUBS;
    const scrollY = clampScroll(cameraTargetY(feetY), worldHpx, LOGICAL_H) / SUBS;
    const seenTop = scrollY;
    const seenBottom = scrollY + LOGICAL_H;

    // R5-W2 · H1 · THE BODY AS DRAWN, AT ITS BIGGEST — not a number typed here.
    //
    // This line used to read `const GUARDIAN_DISPLAY_H = 52;` with a comment
    // claiming it was `PaintScene.entTargetH for a guardian`. It was 68. The
    // one check that exists to prove her whole body stays on screen was
    // measuring a body 16 px shorter than the drawn one, and a copy cannot
    // drift if there is no copy — so the constants moved to anim.ts and are
    // imported (DEBT A6 / D-21).
    //
    // Height alone is still not what the child sees. Every cell is scaled from
    // the idle by its OWN proportions (`entTargetH / refFrameHOf`), and the
    // release cell swells by BOSS_BEAT_SWELL at the top of a tell. So the worst
    // case is: the tallest cell on her sheet, swollen, at the top of her band.
    // Both factors are read from the shipped art rather than asserted, so a
    // repainted sheet moves this proof with it.
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint/ch01");
    /** PNG height straight out of the IHDR — no decoder, no dependency. */
    const pngH = (stem: string): number =>
      fs.readFileSync(path.join(ART, `${stem}.png`)).readUInt32BE(20);
    const refH = pngH(`${g.skin}_a`); // the cell every other one is scaled from
    const tallest = Math.max(...GUARDIAN_RIG_CELLS.map((c) => pngH(`${g.skin}_${c}`)));
    const drawnH = (GUARDIAN_DISPLAY_H / refH) * tallest * (1 + BOSS_BEAT_SWELL);
    expect(drawnH, "die Rechnung muss die gezeichnete Höhe treffen, nicht die Ruhe-Höhe")
      .toBeGreaterThan(GUARDIAN_DISPLAY_H);

    const centreX = (g.c * TILE + TILE / 2) * SUBS;
    const centreY = (g.r + 1) * TILE * SUBS;

    for (const [i, knots] of [[3, 3], [2, 3], [1, 3]].entries()) {
      const period = KNOT_PERIOD_TICKS[i]!;
      for (let t = 0; t <= period; t++) {
        const p = flightPointAt(centreX, centreY, knots[0]!, knots[1]!, t);
        const feet = p.y / SUBS;
        // the framing clamp may push her back down by at most this much; what
        // it cannot reach is what the child loses off the top of the screen
        const head = feet - drawnH + GUARDIAN_KEEPIN_MAX;
        expect(head, `knot ${i + 1} tick ${t}: her top edge is above the view`).toBeGreaterThanOrEqual(seenTop);
        expect(feet, `knot ${i + 1} tick ${t}: her feet are below the view`).toBeLessThanOrEqual(seenBottom);
        // …and she never flies into the floor she is fighting over
        expect(feet, `knot ${i + 1} tick ${t}: she is inside the boards`).toBeLessThan(floorRow * TILE);
      }
    }
  });

  // ── DER WÄCHTER ÜBER `GUARDIAN_SLATE` — WIEDER SCHARF (R5 · T1, 24.08.) ────
  //
  // Er stand einen Tag lang als deklarierter, datierter Skip (H6, D-653/D-655):
  // sein Sucher war wörtlich grün formuliert, und AQ13B4 hat die Schreibfläche
  // nachtblau gemalt — so BESTELLT (R212d: der Boss trennt sich über den
  // FARBTON vom Raum, nicht über die Helligkeit). An `tafel_a` gemessen fiel die
  // grüne Maske von 25 681 px auf 0.
  //
  // ★ WAS SICH GEÄNDERT HAT — der Sucher liest seinen Kanal AUS DEM BLATT.
  //   Nicht »ist sie grün«, sondern »welcher KÜHLE Farbton (90°…330°) stellt
  //   hier die meisten Pixel«. Der Holzrahmen misst auf jedem Blatt dieses
  //   Kapitels 35–36° und fällt damit heraus, ohne dass irgendwo »Holz« steht.
  //   Auf einem grünen Blatt wählt derselbe Code den grünen Kanal und IST dann
  //   Zeichen für Zeichen die alte Regel — der Fall »zwei Familien« unten fährt
  //   genau das an einem selbst gebauten grünen Blatt nach.
  //
  // ★ UND ER VERWIRFT SPRENKEL. Inseln unter `MIN_INSEL` Maskenpixeln zählen
  //   nicht mit. Die alte Tabelle hatte sie mitgezählt: `bank_r0` bekam sein
  //   linkes Ende von DREI fast schwarzen Pixeln bei (21…23, 301), 51 px von
  //   der Fläche entfernt — die Kritzel-Schicht lag dort 6,8 Welt-px zu breit,
  //   also auf dem Rahmen. Die 12 liegt in der Mitte eines gemessenen Plateaus:
  //   bei 8, 12 und 16 Pixeln kommt in allen zwanzig Zellen derselbe Kasten
  //   heraus, auf altem wie neuem Bestand.
  //
  // ★ WARUM DIE TABELLE MITGEZOGEN IST statt der Toleranz: der Kopf von
  //   `anim.ts#GUARDIAN_SLATE` sagt seit ihrer Geburt »wer die Blätter neu malt,
  //   sieht hier rot«. Genau das ist eingetreten. Eine stehende Tabelle über neu
  //   gemalten Blättern ist die Kopie, die still veraltet — und eine zweite,
  //   gepinnte Tabelle in den Einheiten eines zweiten Lineals wären zwei Listen
  //   derselben Wahrheit. Also EINE Liste, neu abgeleitet, mit dem Tamper unten
  //   als Beweis, dass sie noch beißt.

  /** Inseln unter dieser Größe sind Sprenkel, keine Schreibfläche (Plateau 8…16). */
  const MIN_INSEL = 12;

  /** RGBA8, nicht interlaced — genau das, was dieses Kapitel ausliefert.
   *  Der Decoder gehört absichtlich dieser Datei: `pngjs` ist im Repo-Wurzel-
   *  `package.json` deklariert, nicht in diesem Paket, und eine Abhängigkeit in
   *  ein Paket zu schreiben, an dem mehrere Spuren gleichzeitig arbeiten, ist
   *  teurer als 30 Zeilen Auspacken. */
  const decodePng = (file: string): { w: number; h: number; px: Buffer } => {
    const buf = fs.readFileSync(file);
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    expect(buf[24], `${file}: 8 bit je Kanal erwartet`).toBe(8);
    expect(buf[25], `${file}: RGBA erwartet`).toBe(6);
    const chunks: Buffer[] = [];
    for (let off = 8; off + 8 <= buf.length;) {
      const len = buf.readUInt32BE(off);
      const type = buf.toString("ascii", off + 4, off + 8);
      if (type === "IDAT") chunks.push(buf.subarray(off + 8, off + 8 + len));
      off += 12 + len;
    }
    const raw = zlib.inflateSync(Buffer.concat(chunks));
    const px = Buffer.alloc(w * h * 4);
    const bpp = 4, stride = w * bpp;
    for (let y = 0; y < h; y++) {
      const ft = raw[y * (stride + 1)]!;
      const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? px[y * stride + i - bpp]! : 0;
        const b = y > 0 ? px[(y - 1) * stride + i]! : 0;
        const c = i >= bpp && y > 0 ? px[(y - 1) * stride + i - bpp]! : 0;
        let v = line[i]!;
        if (ft === 1) v += a;
        else if (ft === 2) v += b;
        else if (ft === 3) v += (a + b) >> 1;
        else if (ft === 4) {
          const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        }
        px[y * stride + i] = v & 0xff;
      }
    }
    return { w, h, px };
  };

  /** Stufe A: der stärkste KÜHLE Farbton des Blattes, in Grad. −1 = keiner. */
  const leitFarbton = (px: Buffer, w: number, h: number): number => {
    const bins = new Float64Array(360);
    for (let i = 0; i < w * h * 4; i += 4) {
      const r = px[i]!, g = px[i + 1]!, b = px[i + 2]!, a = px[i + 3]!;
      if (a <= 200) continue;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      if (mx <= 20 || d / mx < 0.25) continue;
      let deg = 0;
      if (mx === r) deg = 60 * (((g - b) / d) % 6);
      else if (mx === g) deg = 60 * ((b - r) / d + 2);
      else deg = 60 * ((r - g) / d + 4);
      if (deg < 0) deg += 360;
      if (deg < 90 || deg >= 330) continue;   // warm (Holz 35–36°) fällt heraus
      bins[Math.round(deg) % 360]! += 1;
    }
    let best = -1, bestN = 0;
    for (let i = 90; i < 330; i++) {
      let s = 0;
      for (let d = -7; d <= 7; d++) s += bins[(i + d + 360) % 360]!;
      if (s > bestN) { bestN = s; best = i; }
    }
    return best;
  };

  /** Stufe B: der Kasten der Schreibfläche — Originalgeometrie mit dem Leitkanal
   *  aus Stufe A, Sprenkel unter `MIN_INSEL` verworfen. */
  const schreibflaeche = (px: Buffer, w: number, h: number): {
    x0: number; y0: number; x1: number; y1: number; n: number; peak: number; leit: 1 | 2;
  } => {
    const peak = leitFarbton(px, w, h);
    const leit: 1 | 2 = peak < 0 || peak < 180 ? 1 : 2;   // 1 = grün, 2 = blau
    const neben = leit === 1 ? 2 : 1;
    const m = new Uint8Array(w * h);
    let n = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, r = px[i]!;
      if (px[i + 3]! <= 200 || r >= 130) continue;
      const c = px[i + leit]!, o = px[i + neben]!;
      if (c > r * 1.10 && c > o * 1.05 && c > 30) { m[y * w + x] = 1; n++; }
    }
    // Inseln zählen, kleine verwerfen, aus dem Rest den Kasten nehmen.
    const seen = new Uint8Array(w * h), stack = new Int32Array(w * h);
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let p0 = 0; p0 < w * h; p0++) {
      if (!m[p0] || seen[p0]) continue;
      let top = 0; stack[top++] = p0; seen[p0] = 1;
      const insel: number[] = [];
      while (top > 0) {
        const q = stack[--top]!; insel.push(q);
        const qx = q % w, qy = (q / w) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = qx + dx, ny = qy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const r2 = ny * w + nx;
          if (m[r2] && !seen[r2]) { seen[r2] = 1; stack[top++] = r2; }
        }
      }
      if (insel.length < MIN_INSEL) continue;
      for (const q of insel) {
        const qx = q % w, qy = (q / w) | 0;
        if (qx < x0) x0 = qx; if (qx > x1) x1 = qx;
        if (qy < y0) y0 = qy; if (qy > y1) y1 = qy;
      }
    }
    return { x0, y0, x1, y1, n, peak, leit };
  };

  it("R5-W4b · H3 · GUARDIAN_SLATE ist aus den Blättern gerechnet, Zelle für Zelle", () => {
    // Die Kritzel-Schichten (AQ13) liegen auf der SCHIEFERTAFEL, und die wandert
    // zwischen ihren Zellen um über 30 % der Blattbreite. `anim.ts#GUARDIAN_SLATE`
    // hält, wo sie in jeder Zelle liegt — eine Tabelle mit 80 Zahlen, also genau
    // die Sorte Kopie, die still veraltet, sobald jemand ein Blatt neu malt.
    // Deshalb wird sie hier neu ausgezählt, aus den ausgelieferten PNGs, mit
    // derselben Regel, die `docs/art/import-batch-aq13.mjs` benutzt.
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint/ch01");
    for (const [cell, s] of Object.entries(GUARDIAN_SLATE)) {
      const { w, h, px } = decodePng(path.join(ART, `tafel_${cell}.png`));
      const b = schreibflaeche(px, w, h);
      expect(b.x1, `tafel_${cell}: keine Schreibfläche gefunden (Leitfarbton ${b.peak}°, ${b.n} Maskenpixel)`)
        .toBeGreaterThan(-1);
      const near = (got: number, want: number, what: string): void => {
        expect(Math.abs(got - want), `tafel_${cell} ${what}: gemessen ${got.toFixed(3)}, Tabelle ${want}`)
          .toBeLessThanOrEqual(0.002);
      };
      near((b.x0 + b.x1 + 1) / 2 / w, s.cx, "cx");
      near((b.y0 + b.y1 + 1) / 2 / h, s.cy, "cy");
      near((b.x1 - b.x0 + 1) / w, s.w, "w");
      near((b.y1 - b.y0 + 1) / h, s.h, "h");
    }
  });

  // ── DER WÄCHTER ÜBER DEM SUCHER SELBST (R5 · T1) ───────────────────────────
  //
  // Der Fall darüber prüft die TABELLE gegen die Blätter. Dieser hier prüft das
  // LINEAL gegen sich selbst — denn der teuerste Fehler dieser Bahn wäre, den
  // Sucher still wieder auf EINE Farbe zu verdrahten. Er würde heute grün
  // bleiben und morgen an der nächsten Bestellung blind werden, genau wie am
  // 23.08. Zwei Behauptungen, beide am Bild:
  //   1 · das heutige `tafel_a` führt BLAU, und eine rein grün formulierte
  //       Regel findet darauf nichts (die Zahl, die den Skip begründet hat).
  //   2 · ein selbst gebautes GRÜNES Blatt führt GRÜN — und der Kasten, den der
  //       Sucher darauf findet, ist derselbe, den die alte grüne Regel gefunden
  //       hätte. Das ist der Beweis, dass hier verallgemeinert und nicht
  //       ersetzt wurde.
  it("R5 · T1 · der Sucher liest seinen Kanal aus dem Blatt — beide Familien, am Bild", () => {
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint/ch01");
    const { w, h, px } = decodePng(path.join(ART, "tafel_a.png"));

    // 1 · heute nachtblau
    const b = schreibflaeche(px, w, h);
    expect(b.peak, "tafel_a führt keinen kühlen Farbton mehr").toBeGreaterThanOrEqual(180);
    expect(b.peak, "tafel_a führt keinen kühlen Farbton mehr").toBeLessThan(330);
    expect(b.leit, "der Sucher hat auf tafel_a den grünen Kanal gewählt").toBe(2);
    let gruenNurRegel = 0;
    for (let i = 0; i < w * h; i++) {
      const o = i * 4;
      const r = px[o]!, g = px[o + 1]!, bb = px[o + 2]!, al = px[o + 3]!;
      if (al > 200 && g > r * 1.10 && g > bb * 1.05 && g > 30 && r < 130) gruenNurRegel++;
    }
    expect(
      gruenNurRegel,
      "Die rein grüne Regel findet auf tafel_a wieder Pixel (vor dem H6-Import: 25 681). "
      + "Wenn die Tafel wieder grün gemalt wurde, gehört GUARDIAN_SLATE neu abgeleitet.",
    ).toBe(0);

    // 2 · ein grünes Blatt führt grün, und zwar auf denselben Kasten
    const gw = 60, gh = 40;
    const gruen = Buffer.alloc(gw * gh * 4);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const i = (y * gw + x) * 4;
      const drin = x >= 10 && x <= 49 && y >= 6 && y <= 29;
      // drinnen: gemalter grüner Schiefer · draußen: Holzrahmen (warm, 35°)
      if (drin) { gruen[i] = 20; gruen[i + 1] = 70 + ((x * 7 + y * 3) % 9); gruen[i + 2] = 30; }
      else { gruen[i] = 190; gruen[i + 1] = 140; gruen[i + 2] = 60; }
      gruen[i + 3] = 255;
    }
    const gb = schreibflaeche(gruen, gw, gh);
    expect(gb.leit, "auf einem grünen Blatt wählt der Sucher nicht mehr Grün — er ist auf Blau verdrahtet").toBe(1);
    expect(gb.peak, "der gefundene Farbton liegt nicht in der grünen Familie").toBeGreaterThanOrEqual(90);
    expect(gb.peak, "der gefundene Farbton liegt nicht in der grünen Familie").toBeLessThan(180);
    expect([gb.x0, gb.y0, gb.x1, gb.y1], "der Kasten auf dem grünen Blatt ist nicht die gemalte Fläche")
      .toEqual([10, 6, 49, 29]);
  });


  it("R5-W4b · H3 · Standoff und Wisch-Reichweite sind aus IHRER Breite gerechnet, nicht getippt", () => {
    // Die Zeile „Re-derive this the day either body is re-scaled" stand seit
    // PK-R6 · H2 als Kommentar über DIP_STANDOFF_PX — und wurde beim ersten
    // Anlass prompt übersehen: die Herleitung dort rechnete mit „84 px tall"
    // gegen ausgelieferte 68. Ein Kommentar, der um Nachrechnen BITTET, ist
    // kein Gesetz. Dieses hier ist eins: es liest das Seitenverhältnis aus dem
    // Blatt und die Höhe aus anim.ts und rechnet beide Zahlen neu aus. Wer die
    // Tafel wieder skaliert, sieht hier rot, bevor das Kind in sie hineinläuft.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const g = level.arena!.entities.find((e) => e.role === "guardian")!;
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint/ch01");
    const idle = fs.readFileSync(path.join(ART, `${g.skin}_a.png`));
    const w = idle.readUInt32BE(16);
    const h = idle.readUInt32BE(20);

    /** halbe Tafel, in denselben Welt-px, in denen die Sim rechnet */
    const halfBoard = (GUARDIAN_DISPLAY_H * (w / h)) / 2;
    /** halbes Kind — dieselbe Konstante, aus der die Sim ihre Körperbox baut */
    const halfChild = 8; // BODY_HALF_PX (entities.ts, modul-privat)

    // 1 · die Berührung passiert an der KANTE: Mitte-zu-Mitte-Reichweite =
    //     halbe Tafel + halbes Kind. Weniger hiesse: das Kind muss in ihre
    //     Zeichnung hineinlaufen, um sie anzufassen.
    expect(GUARDIAN_WIPE_REACH_PX, "Wisch-Reichweite trifft ihre Kante nicht mehr")
      .toBe(Math.round(halfBoard + halfChild));

    // 2 · und sie landet so weit davor, dass ein Weg bleibt: der Standoff ist
    //     die Reichweite plus die 22 px, die das Kind zu Fuss zurücklegt.
    //     (Vorher: 45 Abstand gegen 22 Reichweite = 23 px Weg. Derselbe Weg,
    //     obwohl beide Zahlen gewachsen sind.)
    expect(DIP_STANDOFF_PX - GUARDIAN_WIPE_REACH_PX, "der Weg zum Wischen ist verschwunden")
      .toBeGreaterThanOrEqual(16);
    expect(DIP_STANDOFF_PX - GUARDIAN_WIPE_REACH_PX, "der Weg zum Wischen ist eine Wanderung geworden")
      .toBeLessThanOrEqual(28);

    // 3 · und der Standoff passt in die Buehne: auch am fernsten Punkt findet
    //     der Dip eine Seite, auf der er innerhalb der Klammer landet.
    const stageMinPx = Number(g.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(g.params!.stageMaxC) + 1) * TILE;
    expect(stageMaxPx - stageMinPx, "die Buehne ist schmaler als zwei Standoffs")
      .toBeGreaterThan(2 * DIP_STANDOFF_PX);
  });

  it("R5-P1 · die Buehnen-Klammer haelt jede Bahn horizontal im Sieg-freien Frame (A3-Schluss)", () => {
    // arena.md §10 Vorleistung 3: Tafel-x bleibt unter stageClamp c5–30 —
    // Westkante ≥ x80 (Auftritt-Ruhe), Ostkante ≤ x496 (Sieg-Trakt mit Käfig
    // #5 und ✕ wird nie überflogen). Gespiegelt zur Vertikal-Probe: die
    // EXTREM-Zentren (loC/hiC, entities.ts-Herleitung) fliegen jede Bahn
    // komplett; ein Amplituden-Drift über KNOT_SPAN_PX bricht hier rot.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const g = level.arena!.entities.find((e) => e.role === "guardian")!;
    expect(g.params?.stageMinC, "das Level traegt die Buehnen-Klammer (West)").toBe(5);
    expect(g.params?.stageMaxC, "das Level traegt die Buehnen-Klammer (Ost)").toBe(30);
    const stageMinPx = Number(g.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(g.params!.stageMaxC) + 1) * TILE;
    for (const [ki, knots] of ([[0, 3], [1, 3], [2, 3]] as const).entries()) {
      const span = KNOT_SPAN_PX[ki]!;
      const period = KNOT_PERIOD_TICKS[ki]!;
      for (const centreX of [(stageMinPx + span) * SUBS, (stageMaxPx - span) * SUBS]) {
        for (let t = 0; t <= period; t++) {
          const x = flightPointAt(centreX, 0, 3 - ki, knots[1], t).x / SUBS;
          expect(x, `Bahn ${ki + 1} tick ${t}: westlich der Buehne`).toBeGreaterThanOrEqual(stageMinPx);
          expect(x, `Bahn ${ki + 1} tick ${t}: im Sieg-Trakt`).toBeLessThanOrEqual(stageMaxPx);
        }
      }
    }
  });

  it("R5-W2 · H1 · die Buehnen-Klammer haelt auch den DIP auf der Buehne", () => {
    // GEMESSEN, nicht vermutet: der ausgelieferte p4-Pilot kaempft den ganzen
    // Boss auf Spalte 1,25–4,63 und zieht die Tafel bis c4,13 — westlich der
    // Buehne c5–30, mitten in die Kulisse, auf den Spawn. Dort spielt heute
    // auch der ganze Sieg-Bogen (sink → sad → consoled).
    //
    // Die Ursache ist eine Klammer, die nur die HALBE Bewegung kennt: der Dip
    // steuert `playerX ± DIP_STANDOFF_PX` an, waehrend stageMinC/stageMaxC nur
    // das Flug-ZENTRUM (`homeX`) klemmen. arena.md §3 erklaert die Westkulisse
    // aber zur RUHE-Zone („die Kulisse (x<80) wird NIE ueberflogen") und §6 den
    // Sieg-Trakt zum nie ueberflogenen Ort — beides war unwahr.
    //
    // Deshalb prueft dieses Gesetz JEDEN Zustand, nicht nur den Flug, und es
    // sucht sich die Gegenbeispiele nicht aus: es stellt das Kind der Reihe
    // nach in JEDE begehbare Spalte des ausgelieferten Raums.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const arena = level.arena!;
    const spec = arena.entities.find((e) => e.role === "guardian")!;
    const rows = arena.rows;
    const stageMinPx = Number(spec.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(spec.params!.stageMaxC) + 1) * TILE;
    const floorRow = rows.findIndex((r, i) => i > 0 && r.startsWith("####################"));

    // every column a child can actually stand in, read off the shipped rows
    const standable = [...Array(rows[0]!.length).keys()].filter(
      (c) => rows[floorRow - 1]![c] === "." && rows[floorRow]![c] === "#",
    );
    expect(standable.length, "der Boden des Raums ist leer gelesen").toBeGreaterThan(20);

    const dipped = new Set<number>();
    for (const col of standable) {
      const w: EntityWorld = spawnEntities([spec], []);
      const g = w.entities[0]!;
      // ein Kind, das stehen bleibt, steht genau im Ziel — die i-Frames sind
      // der Grund, warum trotzdem ein Fenster aufgeht (entities.test.ts,
      // ANTI-SOFTLOCK). Ohne sie traefe jedes Stueck und nichts zaehlte.
      let iframes = 0;
      let windows = 0;
      for (let t = 0; t < 4000 && windows < 1; t++) {
        const parked = input({
          playerX: (col * TILE + TILE / 2) * SUBS,
          playerY: floorRow * TILE * SUBS,
          playerIframes: iframes,
        });
        const evs = stepEntities(w, rows, parked);
        if (iframes > 0) iframes--;
        for (const ev of evs) {
          if (ev.type === "encounter") iframes = 120; // PAINT.iframeTicks
          if (ev.type === "guardianStagger") windows++;
        }
        if (g.state === "dip") dipped.add(col);
        const x = g.x / SUBS;
        expect(x, `Kind auf c${col}, Zustand ${g.state}, Tick ${t}: westlich der Buehne`)
          .toBeGreaterThanOrEqual(stageMinPx);
        expect(x, `Kind auf c${col}, Zustand ${g.state}, Tick ${t}: im Sieg-Trakt`)
          .toBeLessThanOrEqual(stageMaxPx);
      }
      expect(windows, `Kind auf c${col}: der Lauf hat nie ein Fenster geoeffnet`).toBe(1);
    }
    // ein Gesetz, das den Dip nie gefahren hat, hat nichts bewiesen
    expect(dipped.size, "nicht jeder Lauf hat den Dip erreicht").toBe(standable.length);
  });

  it("R5-W2 · H1 · SIE SPRINGT NIE — auch nicht am Knotenwechsel", () => {
    // Der Übergang zwischen zwei Knoten war der einzige Ort, an dem sich die
    // Tafel TELEPORTIERT hat: `guardianKnotSolved` setzte `state = "fly"` und
    // `flightTick = 0`, schrieb aber keine Position — und der Flug WEIST seine
    // Lage zu, statt sie zu integrieren. Nachgerechnet: 42,7 px senkrecht am
    // zweiten Knoten, 68,1 px senkrecht plus 102 px waagrecht am dritten.
    //
    // Die Schranke wird hier ABGELEITET, nicht getippt: der grösste ehrliche
    // Schritt, den eine Bahn selbst je macht, gemessen an genau den Bahnen, die
    // ausgeliefert werden. Was die Maschine tut, darf nie grösser sein als das.
    let honestStep = 0;
    for (const [ki, span] of KNOT_SPAN_PX.entries()) {
      const period = KNOT_PERIOD_TICKS[ki]!;
      let prev = flightPointAt(0, 0, 3 - ki, 3, 0);
      for (let t = 1; t <= period; t++) {
        const p = flightPointAt(0, 0, 3 - ki, 3, t);
        honestStep = Math.max(honestStep, Math.hypot(p.x - prev.x, p.y - prev.y) / SUBS);
        prev = p;
      }
      expect(span, "die Spannweiten sind die ausgelieferten").toBeGreaterThan(0);
    }
    // Der Dip ist eine EASE und darf im ersten Schritt gross ausfallen — das ist
    // ein Ausholen, das man sieht, und es wird jeden Tick kleiner. Der Defekt
    // war etwas anderes: eine VERSETZUNG in einem einzigen Tick, ohne Bewegung
    // davor und ohne Bewegung danach. Genau dort wird deshalb gemessen — an dem
    // Tick, an dem der Knoten aufgeht, und an dem, an dem sie die neue Bahn
    // betritt.
    for (const tier of TIERS) {
      const w: EntityWorld = spawnEntities([guardianSpec(tier)], []);
      const g = w.entities[0]!;
      const knots = GUARDIAN_SCRIPT[tier].knots;
      let solved = 0;
      let handoffs = 0;
      let justCameLoose = false;
      let prev = { x: g.x, y: g.y };
      for (let t = 0; t < 20000 && solved < knots; t++) {
        const wasUntie = g.state === "untie";
        const wasLoose = justCameLoose;
        justCameLoose = false;
        // R5-W4 · H2: das Kind geht zur wartenden Tafel — und der Augenblick,
        // den dieses Gesetz misst, ist seither ein anderer: nicht mehr der
        // Tick, an dem die Karte beantwortet wird, sondern der, an dem die
        // Schicht WIRKLICH weggeht und der Knoten-Takt beginnt.
        const inp = g.state === "wipeable" ? input({ playerX: g.x, playerY: g.y }) : pacing(t);
        for (const ev of stepEntities(w, GRID, inp)) {
          if (ev.type === "guardianStagger") {
            g.state = "window"; // die Karte geht auf …
            guardianKnotSolved(w, g.id); // … und wird beantwortet
          }
          if (ev.type === "guardianKnot" || ev.type === "guardianDown") {
            solved++;
            justCameLoose = true;
          }
        }
        const d = Math.hypot(g.x - prev.x, g.y - prev.y) / SUBS;
        // (a) der ERSTE Tick nach dem gelösten Knoten. Genau hier stand der
        // Defekt: die Maschine hatte `fly` und `flightTick = 0` gesetzt, ohne
        // eine Position zu schreiben, und der Flug WEIST zu — also fand das
        // Kind sie im nächsten Bild anderswo. Jetzt hält der Takt sie still.
        if (wasLoose) {
          expect(d, `Stufe ${tier}, Tick ${t}: der gelöste Knoten versetzt sie um ${d.toFixed(1)} px`)
            .toBeLessThanOrEqual(honestStep);
        }
        // (b) der Tick, an dem sie die neue Bahn betritt
        if (wasUntie && g.state === "fly") {
          handoffs++;
          expect(d, `Stufe ${tier}, Tick ${t}: das Aufsetzen auf die neue Bahn versetzt sie um ${d.toFixed(1)} px`)
            .toBeLessThanOrEqual(honestStep);
          expect(g.flightTick, "die neue Form muss bei Phase 0 beginnen").toBe(0);
        }
        prev = { x: g.x, y: g.y };
      }
      expect(handoffs, `Stufe ${tier}: kein einziger Bahnwechsel wurde gefahren`).toBe(knots - 1);
    }
  });

  it("R5-W2 · H1 · und sie verlässt die Bühne auch über die Knotenwechsel nicht", () => {
    // Die Spannweite wächst mit jedem Knoten (78 → 92 → 104), das Zentrum aber
    // wanderte erst wieder, wenn sie schon flog: für rund zwei Dutzend Ticks
    // griff die neue, breitere Bahn über den Bühnenrand hinaus (gemessen bis
    // c4,37 bei einer Bühne ab c5). Der Knoten-Takt lässt das Zentrum mitlaufen,
    // BEVOR die neue Bahn zum ersten Mal abgetastet wird — dieses Gesetz hält
    // ihn daran fest, über den ganzen Kampf.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const arena = level.arena!;
    const spec = arena.entities.find((e) => e.role === "guardian")!;
    const rows = arena.rows;
    const stageMinPx = Number(spec.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(spec.params!.stageMaxC) + 1) * TILE;
    const floorRow = rows.findIndex((r, i) => i > 0 && r.startsWith("####################"));

    const w: EntityWorld = spawnEntities([spec], []);
    const g = w.entities[0]!;
    let solved = 0;
    const seen = new Set<string>();
    for (let t = 0; t < 20000 && g.state !== "consoled"; t++) {
      // ein Kind ganz im Westen — der Fall, der die Tafel am weitesten zieht.
      // R5-W4 · H2: nur zum Wischen kommt es herüber; für jeden geprüften
      // Flug-Tick steht es weiterhin so weit weg, wie die Bühne es zulässt.
      const inp = g.state === "wipeable"
        ? input({ playerX: g.x, playerY: g.y })
        : input({ playerX: (1 * TILE + TILE / 2) * SUBS, playerY: floorRow * TILE * SUBS });
      for (const ev of stepEntities(w, rows, inp)) {
        if (ev.type === "guardianStagger") { g.state = "window"; guardianKnotSolved(w, g.id); }
        if (ev.type === "guardianKnot" || ev.type === "guardianDown") solved++;
      }
      seen.add(g.state);
      const x = g.x / SUBS;
      expect(x, `Zustand ${g.state}, Tick ${t}: westlich der Buehne`).toBeGreaterThanOrEqual(stageMinPx);
      expect(x, `Zustand ${g.state}, Tick ${t}: im Sieg-Trakt`).toBeLessThanOrEqual(stageMaxPx);
    }
    expect(solved, "der Lauf hat nicht alle Knoten gelöst").toBe(GUARDIAN_SCRIPT.E.knots);
    expect(seen, "der Knoten-Takt wurde nie gefahren").toContain("untie");
  });

  it("the band constant is the one the paths are actually flown at", () => {
    const p = flightPointAt(0, 0, 3, 3, 0);
    // spiral at u=0 sits on the +x axis, so dy is 0 there; a quarter later it is
    // at full band height — this pins the constant to the geometry, not a copy
    const q = flightPointAt(0, 0, 3, 3, Math.round(KNOT_PERIOD_TICKS[0]! / 4));
    expect(p.y).toBe(0);
    expect(Math.abs(q.y) / SUBS).toBeGreaterThan(FLIGHT_BAND_PX * 0.4);
  });
});

// ── THE THROW, THE ARC, THE SHARD ───────────────────────────────────────────
describe("the arced chalk and its shard (doc 44 §3.2 + §4 ch01 C4)", () => {
  const untilThrow = (w: EntityWorld, inp: WorldInput, max = 900) => {
    for (let t = 0; t < max; t++) {
      stepEntities(w, GRID, inp);
      const c = w.projectiles.find((p) => p.kind === "chalk");
      if (c) return c;
    }
    return null;
  };

  it("solves its own arc — the piece arrives at the child's feet on schedule", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    // a child far to the left, standing on the floor: a real lob across the room
    const inp = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    const c = untilThrow(w, inp);
    expect(c).not.toBeNull();
    const targetX = inp.playerX;
    const targetY = inp.playerY;
    // it is ABOVE the target when it starts and falls onto it (an arc, not a dart)
    expect(c!.vy).toBeLessThan(0); // thrown upward first
    let closest = Infinity;
    for (let t = 0; t < CHALK_FLIGHT_TICKS + 4; t++) {
      stepEntities(w, GRID, inp);
      const live = w.projectiles.find((p) => p.id === c!.id && !p.dead);
      if (!live) break;
      closest = Math.min(closest, Math.hypot(live.x - targetX, live.y - targetY) / SUBS);
    }
    // it lands ON the spot it was aimed at — which is why MOVING is the answer
    expect(closest).toBeLessThan(6);
  });

  it("leaves a shard that lingers ~1 s and then blows away as dust", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const inp = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    expect(untilThrow(w, inp)).not.toBeNull();
    let shard = null;
    for (let t = 0; t < 200 && !shard; t++) {
      stepEntities(w, GRID, inp);
      shard = w.projectiles.find((p) => p.kind === "shard") ?? null;
    }
    expect(shard, "a landed piece must leave a splinter").not.toBeNull();
    expect(SHARD_TICKS * TICK_MS).toBeCloseTo(1000, 6); // doc 44's „1 s", stated
    let alive = 0;
    for (let t = 0; t < SHARD_TICKS + 30; t++) {
      stepEntities(w, GRID, inp);
      if (w.projectiles.some((p) => p.id === shard!.id && !p.dead)) alive++;
    }
    expect(alive).toBeGreaterThanOrEqual(SHARD_TICKS - 4);
    expect(alive).toBeLessThanOrEqual(SHARD_TICKS + 1);
  });

  it("a lying shard opens a TASK, and never a death (doc 44 §4 ch01 C4)", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const away = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    expect(untilThrow(w, away)).not.toBeNull();
    let shard = null;
    for (let t = 0; t < 200 && !shard; t++) {
      stepEntities(w, GRID, away);
      shard = w.projectiles.find((p) => p.kind === "shard") ?? null;
    }
    expect(shard).not.toBeNull();
    // now the child steps onto it, out of i-frames
    const onIt = input({ playerX: shard!.x, playerY: shard!.y, playerIframes: 0 });
    const evs = stepEntities(w, GRID, onIt);
    const enc = evs.find((e) => e.type === "encounter");
    expect(enc, "standing on a shard must ask a card").toBeTruthy();
    expect(w.projectiles.some((p) => p.id === shard!.id && !p.dead)).toBe(false);
  });

  it("cycles the painted sticks deterministically — no RNG in the arena", () => {
    const n = CHALK_COLOURS.length;
    const colours = (): string[] => {
      const w = spawnEntities([guardianSpec("E")], []);
      const out: string[] = [];
      const seen = new Set<number>();
      for (let t = 0; t < 4000 && out.length < n + 1; t++) {
        stepEntities(w, GRID, pacing(t));
        for (const p of w.projectiles) {
          if (p.kind === "chalk" && !seen.has(p.id)) { seen.add(p.id); out.push(p.colour); }
        }
      }
      return out;
    };
    const a = colours();
    expect(a.length).toBeGreaterThanOrEqual(n);
    expect(a.slice(0, n)).toEqual([...CHALK_COLOURS]);
    expect(a[n]).toBe(CHALK_COLOURS[0]); // …and wraps
    expect(colours()).toEqual(a); // …identically, every run
  });

  // PK-R6 · H2 (round-2 finding 5): „the thrown chalk stick is a pale, thin
  // sliver close in value to the couches behind it". The stick that carried that
  // charge was `white`, and it opened the cycle — so the first piece of the fight
  // was the one with no hue to separate by. This is the law that keeps it out,
  // rather than a hope that nobody puts it back: a projectile the child must see
  // owes chroma, and the arena's own backdrop is chalk-valued.
  it("throws no white chalk — a projectile owes chroma (round-2 finding 5)", () => {
    expect(CHALK_COLOURS).not.toContain("white");
    expect(CHALK_COLOURS[0]).toBe("red"); // …and opens on the most saturated
  });
});

// ── THE ECONOMY ─────────────────────────────────────────────────────────────
describe("the counter-window economy (doc 44 §4 ch01 C4)", () => {
  it("she comes DOWN to the child to write — the window is low and near", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    let flightY = 0;
    for (let t = 0; t < 6000; t++) {
      stepEntities(w, GRID, pacing(t));
      if (g.state === "fly") flightY = g.y;
      if (g.state === "stagger") break;
    }
    expect(g.state).toBe("stagger");
    // she is lower than she flew, and within arm's reach of the child
    expect(g.y).toBeGreaterThan(flightY);
    expect(Math.abs(g.x - pacing(0).playerX) / SUBS).toBeLessThan(200);
  });

  it("REDEMPTION CHANGES STATE, NEVER PRESENCE — she is still there afterwards", () => {
    // doc 44 §1 / R3-5, the law stage D proved for Merle, proved here for the
    // guardian she was fighting: the consoled Tafel is not parked, not removed
    // and not left mid-fall. She lands, rests, brightens — and STAYS, on the
    // ground, in her `win` cell, for as long as the child is in the arena.
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    // R5-W4 · H2 (R50): dreimal lösen reicht nicht mehr — dreimal lösen UND
    // dreimal hingehen. Der Weg dorthin ist der Beweis, dass der neue Bogen
    // wirklich am selben Ende ankommt wie der alte.
    for (let k = 0; k < GUARDIAN_SCRIPT.E.knots; k++) {
      guardianKnotSolved(w, g.id);
      for (let t = 0; t < 2000 && g.state !== "untie" && g.state !== "sink"; t++) {
        stepEntities(w, GRID, input({ playerX: g.x, playerY: g.y }));
      }
    }
    expect(g.state).toBe("sink");
    for (let t = 0; t < 2000; t++) stepEntities(w, GRID, pacing(t));
    expect(g.state).toBe("consoled");
    expect(w.entities.some((e) => e.id === g.id)).toBe(true); // never removed
    expect(entPoseCell({ ...g, flightTick: g.flightTick })).toBe("win");
    const restedAt = { x: g.x, y: g.y };
    // …and she does not drift for the rest of the chapter
    for (let t = 0; t < 3000; t++) stepEntities(w, GRID, pacing(t));
    expect(g.state).toBe("consoled");
    expect({ x: g.x, y: g.y }).toEqual(restedAt);
  });

  // ── R5-W4 · H2 · DAS WISCHEN (Ruling R50) ─────────────────────────────────
  // „Clean the board!" ist seit Kokis Befund vom 15.08. die Aufgabe UND die
  // Mechanik. Diese vier Gesetze halten die drei Eigenschaften fest, an denen
  // der Umbau scheitern könnte: die Karte allein zahlt nicht, das Warten hat
  // ein Ende, das Ende hat einen Rückweg, und die Wartezeit ist lang genug für
  // ein Kind, das nur GEHEN kann.
  //
  // Der Prüfraum ist ausdrücklich die AUSGELIEFERTE Arena, nicht das Zimmer
  // oben in dieser Datei: P-67 — ein Wächter, dessen Boden auf der Flughöhe der
  // Tafel liegt, lief hier schon einmal über einen live stehenden Softlock
  // hinweg.
  describe("R5-W4 · H2 · die Kritzel-Schicht geht erst weg, wenn das Kind wischt", () => {
    const shipped = (): PaintLevel =>
      JSON.parse(fs.readFileSync(
        path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
        "utf8",
      )) as PaintLevel;
    const arenaWorld = (): { w: EntityWorld; g: typeof w.entities[0]; rows: readonly string[] } => {
      const arena = shipped().arena!;
      const spec = arena.entities.find((e) => e.role === "guardian")!;
      const w = spawnEntities([spec], []);
      return { w, g: w.entities[0]!, rows: arena.rows };
    };
    /** Bis sie auf den Brettern wartet — das Kind rührt sich dabei nicht. */
    const settleHer = (w: EntityWorld, g: EntityWorld["entities"][0], rows: readonly string[]): void => {
      guardianKnotSolved(w, g.id);
      for (let t = 0; t < 600 && g.state !== "wipeable"; t++) {
        stepEntities(w, rows, input({ playerX: 0, playerY: 0 }));
      }
      expect(g.state, "sie muss sich auf die Bretter setzen").toBe("wipeable");
    };

    it("eine beantwortete Karte allein nimmt KEINE Schicht — sie setzt sich nur", () => {
      const { w, g, rows } = arenaWorld();
      const before = g.hp;
      settleHer(w, g, rows);
      expect(g.hp, "die Antwort ist der halbe Weg, nicht der ganze").toBe(before);
      expect(w.guardianKnots, "…und der Zähler im HUD lügt auch nicht").not.toBe(before - 1);
    });

    it("das Kind geht hin — und GENAU EINE Schicht geht weg", () => {
      const { w, g, rows } = arenaWorld();
      const before = g.hp;
      settleHer(w, g, rows);
      let wipes = 0;
      for (let t = 0; t < 600 && g.state !== "untie"; t++) {
        for (const ev of stepEntities(w, rows, input({ playerX: g.x, playerY: g.y }))) {
          if (ev.type === "guardianKnot" || ev.type === "guardianDown") wipes++;
        }
      }
      expect(wipes, "genau eine Meldung, nicht null und nicht zwei").toBe(1);
      expect(g.hp).toBe(before - 1);
      expect(w.guardianKnots).toBe(before - 1);
    });

    it("KEIN ZUSTAND OHNE RÜCKWEG: wer nicht hingeht, verliert die Karte — nicht das Spiel", () => {
      // Der teuerste Fehler dieses Umbaus wäre eine Tafel, die für immer auf
      // ein Kind wartet, das nicht kommt. Sie hebt wieder ab, mit der Schicht.
      const { w, g, rows } = arenaWorld();
      const before = g.hp;
      settleHer(w, g, rows);
      const wait = wipeWaitTicksFor(g, rows);
      let lifted = false;
      for (let t = 0; t < wait + 120 && !lifted; t++) {
        stepEntities(w, rows, input({ playerX: 0, playerY: 0 })); // das Kind bleibt weg
        if (g.state !== "wipeable") lifted = true;
      }
      expect(lifted, `sie muss binnen ${wait} Ticks wieder aufsteigen`).toBe(true);
      expect(g.hp, "die Schicht bleibt — die Karte hat nicht gezählt").toBe(before);
      // …und sie fliegt danach wirklich weiter, statt in `untie` zu kleben
      for (let t = 0; t < 400 && g.state !== "fly"; t++) stepEntities(w, rows, input({ playerX: 0, playerY: 0 }));
      expect(g.state, "der Kampf geht weiter").toBe("fly");
    });

    it("die Wartezeit reicht für ein Kind, das nur GEHEN kann — hergeleitet, nicht geraten", () => {
      // arena.md §1: „kein run als Pflicht". Die Wartezeit wird deshalb gegen
      // walkMax gerechnet, obwohl dieses Kapitel in Wahrheit mit runMax läuft —
      // die langsamere Gangart ist die sichere Seite. Hier steht die Rechnung
      // selbst, gegen die ausgelieferte Bühne.
      const { g, rows } = arenaWorld();
      const stageWidthPx = (Number(g.params.stageMaxC) + 1 - Number(g.params.stageMinC)) * TILE;
      const walkTicks = Math.ceil((stageWidthPx * SUBS) / PAINT.walkMax);
      expect(wipeWaitTicksFor(g, rows)).toBeGreaterThanOrEqual(walkTicks);
      // und mit dem echten Tempo dieses Kapitels hat das Kind mehr als das Doppelte
      const runTicks = Math.ceil((stageWidthPx * SUBS) / PAINT.runMax);
      expect(wipeWaitTicksFor(g, rows)).toBeGreaterThan(runTicks * 2);
    });
  });

  it("being HIT never unties a knot — knots are earned in the window only", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    const hp0 = g.hp;
    // stand on the aim point with no i-frames: every piece connects
    for (let t = 0; t < 2000; t++) stepEntities(w, GRID, input({ playerIframes: 0 }));
    expect(g.hp).toBe(hp0);
    expect(DODGES_PER_WINDOW).toBe(3); // stage B's economy, unchanged
  });
});

// ── PK-R6 · H1 · THE FLIGHT ATTITUDE (round-1 critique, finding 2) ───────────
// The critique read the hover, the banked turn and the spiral loop as one
// picture. The painted cells alone cannot fix that — measured over a full pass
// per knot she wears a BANK cell 74 %, 74 % and 100 % of the time, and the
// zigzag (the only path with corners) never rolls at all, because its teeth are
// cut so |vy| equals |vx| exactly and `|vy| > |vx|` is false on a tie.
//
// So the attitude is drawn (anim.guardianPitchRad). These are its laws, and the
// first of them is the one the critique actually bought: each named state must
// look different from the others.
describe("she flies it — the drawn attitude (finding 2)", () => {
  const SUBS_PX = SUBS;
  /** One full pass of a knot's path, as per-tick velocities in subs. */
  const passOf = (hp: number, knots = 3): Array<{ vx: number; vy: number }> => {
    const ki = knots - hp;
    const period = KNOT_PERIOD_TICKS[ki]!;
    const c = { x: 400 * SUBS_PX, y: 200 * SUBS_PX };
    const out: Array<{ vx: number; vy: number }> = [];
    let prev = flightPointAt(c.x, c.y, hp, knots, 0);
    for (let t = 1; t <= period; t++) {
      const p = flightPointAt(c.x, c.y, hp, knots, t);
      out.push({ vx: p.x - prev.x, vy: p.y - prev.y });
      prev = p;
    }
    return out;
  };
  const pitches = (hp: number): number[] =>
    passOf(hp).map((v) => guardianPitchRad(v.vx, v.vy, v.vx >= 0 ? 1 : -1));

  it("THE ZIGZAG'S CORNERS READ: its pitch reverses, once per tooth (TAMPER)", () => {
    // This is the defect the measurement found. The climax knot spends 100 % of
    // its pass in a bank cell — every corner in the fight resolved to „crossing
    // at speed". The body now says what the cells cannot: it saws.
    // Counted against the last NON-ZERO sign: a tooth turns through a level
    // sample (vy = 0 exactly at the apex), and a counter that compared only
    // neighbours would score six of the eight reversals as „no change" — the
    // measurement lying about the fix it exists to prove.
    const reversals = (xs: readonly number[]): number => {
      let last = 0;
      let n = 0;
      for (const x of xs) {
        const s = Math.sign(x);
        if (s === 0) continue;
        if (last !== 0 && s !== last) n++;
        last = s;
      }
      return n;
    };
    // SIX, and the six are derived rather than wished for: ZIG_TEETH = 4 gives
    // eight vertical reversals per pass, the sweep's own turn at u = ½ flips the
    // leading edge once more, and where a tooth boundary lands ON that turn the
    // two flips cancel — twice, symmetrically. Measured: 6.
    expect(reversals(pitches(1))).toBeGreaterThanOrEqual(6);
    // …and the zigzag is the SAWING one: it reverses oftener than the gentle
    // first knot does, which is what „the corners read" means comparatively.
    expect(reversals(pitches(1))).toBeGreaterThan(reversals(pitches(3)));
    // TAMPER: the state before this fix — no drawn attitude at all — reverses
    // never, however many corners the path has.
    expect(reversals(passOf(1).map(() => 0))).toBe(0);
  });

  it("the three knots pitch by visibly different amounts — the escalation is in her body", () => {
    const peak = (hp: number): number => Math.max(...pitches(hp).map(Math.abs));
    const [k0, k1, k2] = [peak(3), peak(2), peak(1)];
    // the gentle first knot stays gentle, and the later two commit
    expect(k0).toBeLessThan(k1);
    expect(k1).toBeLessThanOrEqual(k2);
    // …and the spread is big enough to SEE: the first knot tilts less than half
    // as far as the last (measured peaks |vy| = 0.54 / 1.26 / 1.89 px per tick)
    expect(k0).toBeLessThan(k2 * 0.6);
    expect(k2).toBeCloseTo(FLIGHT_PITCH_MAX_RAD, 5); // the climax saturates
  });

  it("REF_VY is the real spread, not a guess — re-derived from the shipped paths", () => {
    // The constant claims 1.2 px/tick sits between the gentle knot's peak and
    // the angry ones'. If a path is ever retuned and that stops being true, the
    // escalation silently flattens — so the claim is checked against the paths
    // themselves rather than trusted.
    const peakVy = (hp: number): number => Math.max(...passOf(hp).map((v) => Math.abs(v.vy)));
    expect(peakVy(3)).toBeLessThan(FLIGHT_PITCH_REF_VY); // knot 0 never saturates
    expect(peakVy(2)).toBeGreaterThan(FLIGHT_PITCH_REF_VY); // knots 1 and 2 do
    expect(peakVy(1)).toBeGreaterThan(FLIGHT_PITCH_REF_VY);
  });

  it("a dive tips her nose toward where she is going, both ways round", () => {
    const fast = FLIGHT_PITCH_REF_VY;
    // flying right and descending (screen y grows downward) → she tips forward
    expect(guardianPitchRad(fast, fast, 1)).toBeGreaterThan(0);
    // flying LEFT and descending → the other edge leads, so the sign flips
    expect(guardianPitchRad(-fast, fast, -1)).toBeLessThan(0);
    // climbing is the mirror of diving
    expect(guardianPitchRad(fast, -fast, 1)).toBeCloseTo(-guardianPitchRad(fast, fast, 1), 9);
    // level flight is level, however fast she is crossing
    expect(guardianPitchRad(fast * 4, 0, 1)).toBe(0);
  });

  it("reduced motion draws no tilt, and the tilt is bounded and deterministic", () => {
    expect(guardianPitchRad(500, 900, 1, true)).toBe(0);
    // bounded however hard the sim ever throws her
    for (const vy of [-99999, -500, 0, 500, 99999]) {
      expect(Math.abs(guardianPitchRad(300, vy, 1))).toBeLessThanOrEqual(FLIGHT_PITCH_MAX_RAD + 1e-9);
    }
    // pure: same input, same angle, every time (a replayed tape must match)
    expect(guardianPitchRad(120, 200, 1)).toBe(guardianPitchRad(120, 200, 1));
  });

  // ── PK-R6 · H2 · THE SECOND AXIS (round-2 finding 3) ──────────────────────
  // Round 2 still read the three manoeuvres as one picture, and it was right to:
  // pitch is a rotation, and all three rotate — one axis, three amounts of the
  // same thing. The roll is the axis rotation cannot draw (anim.guardianRollScaleX).
  it("THE TIE GOES TO THE ROLL: the zigzag's corners are corkscrews (TAMPER)", () => {
    const kinds = passOf(1).map((v) => guardianManoeuvre(v.vx, v.vy));
    const spirals = kinds.filter((k) => k === "spiral").length;
    // MEASURED, not wished for: 216 of the climax knot's 220 ticks are a 45° saw
    // and roll. The other four are the apex of each tooth, where the tooth turns
    // through vy = 0 exactly and she really IS crossing level for one tick — the
    // classifier telling the truth, not an escape hatch.
    expect(spirals / kinds.length).toBeGreaterThan(0.95);
    expect(kinds.filter((k) => k === "hover").length).toBe(0);
    // TAMPER: the rule this replaces (a strict `>`), on the same velocities,
    // classifies the identical pass as 100 % bank — the measured defect, exactly
    // as anim.ts's own tally recorded it in H1.
    const strict = passOf(1).map((v) => (Math.abs(v.vy) > Math.abs(v.vx) ? "spiral" : "bank"));
    expect(new Set(strict)).toEqual(new Set(["bank"]));
  });

  it("each manoeuvre owns a WIDTH, and the three do not overlap", () => {
    // hover: square on. Nothing is turned away from a board going nowhere.
    expect(guardianRollScaleX(0, 0, 0)).toBe(1);
    // bank: a steady lean, deepening with the crossing, and never past its floor
    const slow = guardianRollScaleX(FLIGHT_ROLL_REF_VX * 0.4, 0, 0);
    const fast = guardianRollScaleX(FLIGHT_ROLL_REF_VX, 0, 0);
    expect(slow).toBeLessThan(1);
    expect(fast).toBeLessThan(slow);
    expect(fast).toBeCloseTo(FLIGHT_BANK_FACE, 9);
    // spiral: it passes right through edge-on, which is narrower than any bank
    const rolls: number[] = [];
    for (let t = 0; t < FLIGHT_ROLL_TICKS; t++) rolls.push(guardianRollScaleX(10, 400, t));
    expect(Math.min(...rolls)).toBeCloseTo(FLIGHT_ROLL_MIN, 6);
    expect(Math.max(...rolls)).toBeCloseTo(1, 6);
    // …so the roll ALONE separates a corkscrew from the deepest bank there is
    expect(Math.min(...rolls)).toBeLessThan(FLIGHT_BANK_FACE);
  });

  it("the width never mirrors her, never vanishes, and rests under reduced motion", () => {
    for (const [vx, vy, t] of [[0, 0, 0], [9999, 0, 3], [0, 9999, 7], [-500, 500, 11], [3, -80, 41]] as const) {
      const k = guardianRollScaleX(vx, vy, t);
      // a negative scale would MIRROR the cell, and mirroring is already spoken
      // for by the facing law — two mirrors in one frame is a bank drawn backwards
      expect(k).toBeGreaterThan(0);
      expect(k).toBeLessThanOrEqual(1 + 1e-9);
      expect(k).toBeGreaterThanOrEqual(FLIGHT_ROLL_MIN - 1e-9);
    }
    expect(guardianRollScaleX(500, 900, 5, true)).toBe(1);
    expect(guardianRollScaleX(120, 200, 9)).toBe(guardianRollScaleX(120, 200, 9));
  });

  it("the three PATHS now differ in width too, not only in tilt", () => {
    // How much of a pass she spends rolling rather than leaning. NOT the range
    // of widths — every path contains some roll, so the range saturates at the
    // same number for all three and would prove nothing (found by this test,
    // first draft). What separates them is how OFTEN.
    const rollShare = (hp: number): number => {
      const w = passOf(hp).map((v, i) => guardianRollScaleX(v.vx, v.vy, i));
      return w.filter((k) => k < FLIGHT_BANK_FACE).length / w.length;
    };
    // MEASURED over one full pass each — 0.130 · 0.115 · 0.491. The first two
    // paths lean their way round and dip into a roll at their turns; the CLIMAX
    // is a corkscrew from end to end, and spends nearly four times as much of
    // its pass past the deepest bank there is. That is the escalation this
    // finding asked to be visible in the pose, and it is not a claim about knots
    // 0 and 1 relative to each other — they fly comparable amounts of roll, and
    // what separates THEM is the pitch (see the tests above).
    expect(rollShare(1)).toBeGreaterThan(3 * rollShare(3));
    expect(rollShare(1)).toBeGreaterThan(3 * rollShare(2));
    // …and a leaning path still LEANS: its average width sits between edge-on
    // and square-on rather than pinned at either
    for (const hp of [3, 2, 1]) {
      const w = passOf(hp).map((v, i) => guardianRollScaleX(v.vx, v.vy, i));
      const mean = w.reduce((a, b) => a + b, 0) / w.length;
      expect(mean).toBeGreaterThan(FLIGHT_ROLL_MIN);
      expect(mean).toBeLessThan(1);
    }
  });
});

// ── R5-W2 · H1 (Teil 3) · DREI VERBEN, NICHT DREI TEMPI ─────────────────────
//
// Kokis F3, wörtlich: „Erst EINE Kreide, progressiv mehr, am Ende fast
// bodendeckend — unausweichlich werdend." Die Eskalation war bisher drei
// Skalare — dasselbe, schneller. Jetzt hat jeder Knoten sein eigenes Verb, und
// jedes Gesetz hier prüft, dass das Verb FAIR ist: eine Gabel ohne Lücke wäre
// keine Wahl, sondern eine Strafe.
describe("die Eskalation der Wurfbilder (Auftrag 2b)", () => {
  const throwsAtKnot = (ki: 0 | 1 | 2): ProjectileState[] => {
    const w: EntityWorld = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    g.hp = 3 - ki; // knotIndex(hp, 3) === ki
    const seen: ProjectileState[] = [];
    for (let t = 0; t < 900 && seen.length === 0; t++) {
      const before = new Set(w.projectiles.map((p) => p.id));
      stepEntities(w, GRID, input());
      const born = w.projectiles.filter((p) => p.kind === "chalk" && !before.has(p.id));
      if (born.length > 0) seen.push(...born);
      g.hp = 3 - ki; // sie soll auf DIESEM Knoten bleiben
    }
    return seen;
  };

  it("wirft 1 · 2 · 2 Stücke — die Zahl der Bilder wächst und hört dann auf", () => {
    expect(throwsAtKnot(0).length, "Knoten 1 ist die einzelne Kreide").toBe(1);
    expect(throwsAtKnot(1).length, "Knoten 2 ist die Gabel").toBe(2);
    expect(throwsAtKnot(2).length, "Knoten 3 bleibt die Gabel — es rutscht, statt mehr zu werden").toBe(2);
  });

  it("die Gabel lässt IMMER einen Platz zum Stehen", () => {
    // ABGELEITET: die Lücke ist so breit, wie ein gehendes Kind fliegt, solange
    // die Kreide fliegt. Sie muss beide Kontaktboxen PLUS den Körper überbieten,
    // sonst ist die Gabel keine Wahl.
    const both = throwsAtKnot(1);
    const gapPx = Math.abs(both[0]!.vx - both[1]!.vx) * CHALK_FLIGHT_TICKS / SUBS;
    expect(gapPx, "die beiden Aufschläge liegen aufeinander").toBeGreaterThan(0);
    // die Kontaktbox der fliegenden Kreide ist ±10 px, der Körper 12 px breit
    expect(gapPx, `Lücke ${gapPx.toFixed(1)} px trägt kein Kind`).toBeGreaterThan(10 + 10 + 12);
    expect(gapPx, "die Lücke ist so weit, dass sie niemand als Gabel liest").toBeLessThan(TILE * 6);
  });

  it("die Gabel VERKÜRZT den Kampf nicht — ein Fenster kostet weiter drei Würfe", () => {
    // Ohne das wäre die Eskalation eine Abkürzung: zwei Stücke, zwei Zähler,
    // Fenster nach anderthalb Würfen. Das führende Stück zählt deshalb nicht.
    for (const ki of [0, 1, 2] as const) {
      const scoring = throwsAtKnot(ki).filter((p) => p.scores !== false).length;
      expect(scoring, `Knoten ${ki + 1} zählt ${scoring} Stücke je Wurf`).toBe(1);
    }
    expect(DODGES_PER_WINDOW, "die Ökonomie selbst bleibt unberührt").toBe(3);
  });

  it("und sie wechselt die Seite, damit »immer nach rechts« nie die Antwort ist", () => {
    const w: EntityWorld = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    g.hp = 2; // Knoten 2
    const signs = new Set<number>();
    for (let t = 0; t < 3000; t++) {
      const before = new Set(w.projectiles.map((p) => p.id));
      stepEntities(w, GRID, input());
      const born = w.projectiles.filter((p) => p.kind === "chalk" && !before.has(p.id));
      if (born.length === 2) {
        const lead = born.find((p) => p.scores === false)!;
        const aimed = born.find((p) => p.scores !== false)!;
        signs.add(Math.sign(lead.vx - aimed.vx));
      }
      g.hp = 2;
    }
    expect([...signs].sort(), "die Gabel zeigt immer zur selben Seite").toEqual([-1, 1]);
  });
});

describe("der Schwall — was landet, bleibt nicht liegen (Auftrag 2b)", () => {
  /** Bretter, so weit das Auge reicht — die freie Fläche der Bühne. */
  const OPEN: string[] = [
    ...Array.from({ length: 13 }, () => "........................................"),
    "........................................",
    "########################################",
  ];
  /** Dieselben Bretter MIT einer Kreide-Kiste ab Spalte 11, wie die Bühne sie
   *  an ihren beiden Rändern hat (Podest = Voll-Säule ab r14). */
  const CRATE: string[] = [
    ...Array.from({ length: 12 }, () => "........................................"),
    "...........###..........................",
    "...........###..........................",
    "########################################",
  ];

  const shardAfter = (ki: 0 | 1 | 2, ticks: number, grid = OPEN): ProjectileState | undefined => {
    const w: EntityWorld = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    g.hp = 3 - ki;
    g.x = 9 * TILE * SUBS;
    w.projectiles.push({
      id: 1, kind: "chalk", x: 9 * TILE * SUBS, y: 13 * TILE * SUBS,
      vx: SUBS, vy: SUBS, deflected: false, fromId: g.id, dead: false, age: 20, colour: "red",
    });
    for (let t = 0; t < ticks; t++) { stepEntities(w, grid, input({ playerX: 0, playerY: 0 })); g.hp = 3 - ki; }
    return w.projectiles.find((p) => p.kind === "shard");
  };
  /** Wie lange die Scherbe überlebt — die Zahl, an der beide Zweige sich trennen. */
  const shardLife = (grid: string[]): number => {
    let alive = 0;
    for (let t = 2; t <= SHARD_TICKS + 4; t += 2) if (shardAfter(2, t, grid) !== undefined) alive = t;
    return alive;
  };

  it("bis Knoten 2 liegt die Scherbe still — der Schwall ist der DRITTE Knoten", () => {
    for (const ki of [0, 1] as const) {
      const s = shardAfter(ki, 30);
      expect(s, `Knoten ${ki + 1}: keine Scherbe entstanden`).toBeDefined();
      expect(s!.vx, `Knoten ${ki + 1}: sie rutscht zu früh`).toBe(0);
    }
  });

  it("am dritten Knoten rutscht sie — und HOLT das Kind ein (D-86)", () => {
    // ── R5-W4 · H2 · WAS HIER FALSCH WAR ──────────────────────────────────
    // Die alte Herleitung („Mitte der beiden Gangarten, dann halbiert") ergab
    // 0,875 px/t gegen ein Kind, das in diesem Kapitel 2,25 px/t läuft. Die
    // Scherbe war zweieinhalbmal langsamer als ihr Ziel — sie hat es nie
    // erreicht, und damit tat sie genau das nicht, wofür sie gebaut wurde:
    // „Weggehen ist die ganze Antwort" zu beenden. Das Gesetz prüfte damals
    // nur `> walkMax/4`, also eine Schranke, die auch eine wirkungslose
    // Scherbe nimmt. Jetzt prüft es die EIGENSCHAFT statt einer Zahl.
    const s = shardAfter(2, 30);
    expect(s, "keine Scherbe entstanden").toBeDefined();
    expect(Math.abs(s!.vx), "sie rutscht nicht").toBeGreaterThan(0);
    expect(Math.abs(s!.vx), "eine Scherbe, die langsamer ist als das Kind, jagt niemanden")
      .toBeGreaterThanOrEqual(PAINT.runMax);
    expect(Math.abs(s!.vx), "…aber schneller als das Kind wäre eine Strafe fürs Laufen")
      .toBeLessThanOrEqual(PAINT.runMax);
    expect(Math.abs(s!.vx)).toBe(SKID_SPEED);
  });

  it("sie zerbricht an der Kistenwand — ein Splitter erklimmt NIE ein Podest", () => {
    // Das ist die Auszahlung, die arena.md §3 dem Podest zuschreibt
    // (»Scherben-Zuflucht«), hier als Mechanik statt als Absicht — und BEIDE
    // Zweige stehen im selben Test, sonst könnte er auch grün sein, weil die
    // Scherbe schlicht nie gerutscht ist.
    const open = shardLife(OPEN);
    const crate = shardLife(CRATE);
    expect(open, "auf freien Brettern lebt sie ihre volle Sekunde").toBeGreaterThanOrEqual(SHARD_TICKS);
    expect(crate, "sie ist über die Kistenwand gerutscht").toBeLessThan(open);
    expect(crate, "sie ist gar nicht erst losgefahren").toBeGreaterThan(4);
  });

  it("ein Kind auf dem Podest ist vor Boden-Splittern sicher — ohne eine Zeile Code", () => {
    // 32 px Podesthöhe gegen eine 12-px-Bissbox: die Zahlen selbst sagen es.
    // Der Test hält sie fest, damit ein späteres »das Podest ein bisschen
    // niedriger« diese Zuflucht nicht still abschafft.
    expect(TILE * 2, "die Podesthöhe der Bühne").toBeGreaterThan(SHARD_REACH_Y_PX);
  });
});

// ── R5-W2 · H1 (Teil 3) · DIE BILD-TAKTE DES KAMPFES (Auftrag 1) ────────────
//
// Auftrag 1 verlangt Lesbarkeit als BILD: Licht auf der Tafel im Ausholen,
// Aufschlagmarken für die Kreide, eine Fanfare am Fenster.
//
// R5-W6b · H4 · D-370: seit S1/S2 klingt der Kampf auch — `boss-window` am
// Fenster, `wipe` je Schicht, `puff-chalk` am Aufschlag, `music-p4` als Raum.
// Die Fanfare ist damit Licht UND Ton. Für diese Datei ändert das nichts; es
// steht hier, weil ein Kommentar, der eine Abwesenheit behauptet, als Erlaubnis
// gelesen wird, keine zu suchen.
//
// Was diese Datei prüfen kann, ist weder Bild noch Ton, sondern die Arithmetik,
// aus der beides gerechnet wird: der Takt der Ansage und der gelöste
// Aufschlagpunkt. Beides sind reine Zahlen, und beide waren vorher gar nicht
// vorhanden.
describe("die Ansage ist ein Takt, kein Dauerzustand (Auftrag 1)", () => {
  /** Dieselbe Kurve, die die Szene dem Halo füttert (PaintScene.bossTellT) —
   *  hier als reine Nachrechnung, weil PaintScene Phaser importiert und in
   *  diesem kopflosen Paket nicht geladen werden kann. */
  const tellT = (state: string, timer: number, hp = 3): number => {
    if (state === "throw") return 0;
    if (state === "stagger" || state === "window") return Math.max(0, 1 - timer / 26);
    if (state !== "telegraph") return 0;
    return Math.max(0, Math.min(1, timer / Math.max(telegraphTicksFor("E", hp, 3), 1)));
  };

  it("sie steigt durch das Ausholen — sonst sagt das Licht nichts", () => {
    const need = telegraphTicksFor("E", 3, 3);
    const samples = [0, 0.25, 0.5, 0.75, 1].map((f) => tellT("telegraph", Math.round(need * f)));
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]!, `Schritt ${i} fällt statt zu steigen`).toBeGreaterThan(samples[i - 1]!);
    }
    expect(samples[samples.length - 1]).toBeCloseTo(1, 5);
  });

  it("und SCHNAPPT beim Wurf zurück — Anspannung, dann Entladung", () => {
    // Der eigentliche Fund: `bossBeatT` steht im Wurf auf 1 und liefe als Licht
    // weiter, obwohl das Stück längst fliegt. Ein Kind läse „die Ansage läuft
    // noch", während sie schon vorbei ist.
    expect(tellT("telegraph", telegraphTicksFor("E", 3, 3))).toBeCloseTo(1, 5);
    expect(tellT("throw", 0), "das Licht hängt im Wurf nach").toBe(0);
    expect(tellT("throw", 6)).toBe(0);
  });

  it("das Fenster bekommt seine eigene Fanfare, und sie klingt ab", () => {
    expect(tellT("stagger", 0), "der Augenblick des Fensters leuchtet nicht").toBeGreaterThan(0.9);
    expect(tellT("window", 13)).toBeLessThan(tellT("window", 0));
    expect(tellT("window", 40), "die Fanfare leuchtet ewig weiter").toBe(0);
  });

  it("im ruhigen Flug leuchtet gar nichts extra", () => {
    for (const st of ["fly", "untie", "dip", "sink", "sad", "consoled"]) {
      expect(tellT(st, 30), `${st} leuchtet, obwohl nichts angesagt wird`).toBe(0);
    }
  });
});

describe("die Aufschlagmarke steht da, wo das Stück landet (Auftrag 1)", () => {
  it("der gelöste Bogen sagt den Aufschlag voraus — auf wenige Pixel genau", () => {
    // Der Bogen wird beim Wurf GELÖST (entities.ts), also ist der Aufschlag in
    // geschlossener Form bekannt, sobald das Stück die Hand verlässt. Genau das
    // zeichnet die Marke. Hier wird die Vorhersage gegen den echten Flug
    // gefahren: driftet die eine, ist die Marke eine Lüge.
    // Das Kind steht WEIT weg und ist unverwundbar: sonst zerbricht das Stück an
    // ihm, statt seinen Bogen zu Ende zu fliegen (bei nahem Kind beisst es
    // direkt nach der Zündverzögerung — genau der Fall, für den CHALK_ARM_TICKS
    // existiert). Geprüft werden soll die BAHN, nicht der Treffer.
    const far = (): WorldInput => input({ playerX: 8 * TILE * SUBS, playerIframes: 999 });
    const w: EntityWorld = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    let born: ProjectileState | undefined;
    for (let t = 0; t < 900 && born === undefined; t++) {
      const before = new Set(w.projectiles.map((p) => p.id));
      stepEntities(w, GRID, far());
      born = w.projectiles.find((p) => p.kind === "chalk" && !before.has(p.id));
    }
    expect(born, "kein Wurf zustande gekommen").toBeDefined();
    const p0 = born!;
    // die Vorhersage, wie die Szene sie rechnet
    const left = CHALK_FLIGHT_TICKS - p0.age;
    const predX = (p0.x + p0.vx * left) / SUBS;
    const predY = (p0.y + p0.vy * left + (CHALK_GRAVITY * left * (left + 1)) / 2) / SUBS;
    // …und der echte Flug
    let real = { x: 0, y: 0 };
    for (let t = 0; t < left; t++) {
      stepEntities(w, GRID, far());
      const live = w.projectiles.find((p) => p.id === p0.id);
      if (live) real = { x: live.x / SUBS, y: live.y / SUBS };
    }
    expect(Math.abs(real.x - predX), `Marke ${predX.toFixed(1)} gegen Flug ${real.x.toFixed(1)}`).toBeLessThan(4);
    expect(Math.abs(real.y - predY)).toBeLessThan(4);
    expect(g.throws, "der Wurf hat gar nicht stattgefunden").toBeGreaterThan(0);
  });

  it("die Gabel bekommt ZWEI Marken, und sie liegen auseinander", () => {
    // Das ist die Zeichnung, die die Gabel überhaupt lesbar macht: ohne sie sind
    // es zwei Stücke aus einer Wolke, die irgendwo einschlagen.
    const w: EntityWorld = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    g.hp = 2; // Knoten 2 — die Gabel
    let pair: ProjectileState[] = [];
    for (let t = 0; t < 900 && pair.length === 0; t++) {
      const before = new Set(w.projectiles.map((p) => p.id));
      stepEntities(w, GRID, input());
      pair = w.projectiles.filter((p) => p.kind === "chalk" && !before.has(p.id));
      g.hp = 2;
    }
    expect(pair.length).toBe(2);
    const markX = (p: ProjectileState): number => (p.x + p.vx * (CHALK_FLIGHT_TICKS - p.age)) / SUBS;
    expect(Math.abs(markX(pair[0]!) - markX(pair[1]!)), "die beiden Marken liegen übereinander")
      .toBeGreaterThan(FORK_LEAD_PX * 0.7);
  });
});
