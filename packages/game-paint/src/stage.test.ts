/**
 * L2-M-a · M1 · R249 — DIE TIER-BÜHNE.
 *
 * Die Signatur-Mechanik von ch02. Ein Wesen geht sichtbar um EIN Objekt herum —
 * hinter den Baum, auf das Auto —, hält an, und die Welt fragt „Where is it?".
 * MORE! 1 Unit 2 lehrt die Ortswörter ausschliesslich am bewegten Bild (SB 19
 * sechs Panels, WB 14 der Hamster am Käfig); das Kind SCHAUT ZU, bevor es
 * antwortet. Genau das kann der Motor bisher nicht.
 *
 * Drei Dinge hält diese Datei fest, und jedes davon wäre sonst still falsch:
 * der HALT fällt genau EINMAL (sonst öffnete sich die Karte endlos neu), die
 * BERÜHRUNG tut nichts (sonst wäre der Zoo feindlich), und die Bühne hebt den
 * SCHNELL-SCHIRM statt einer Begegnung — in der Sim wie in der Tabelle, die die
 * Tore lesen.
 */
import { describe, expect, it } from "vitest";
import { ENGAGEABLE_ROLES, STAGE_TICKS_PER_STATION, spawnEntities, stageDepthOf, stagePointAt, stepEntities } from "./entities.ts";
import type { EntityEvent, WorldInput } from "./entities.ts";
import { askerUsesOf } from "./cards/serving.ts";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import type { SimEvent } from "./sim.ts";
import type { EntitySpec, PaintLevel, PhaseSpec } from "./level.ts";

const GRID: string[] = [
  ...Array.from({ length: 12 }, () => "........................"),
  "########################",
  "########################",
];

/** Der Anker steht auf (10,11); die Stationen sind Versätze davon. */
const buehne = (over: Partial<EntitySpec> = {}): EntitySpec => ({
  id: "papagei", role: "scene.stage", skin: "papagei", c: 10, r: 11, tier: "E",
  params: {
    stage: {
      propSkin: "auto",
      stations: [
        { dc: -2, dr: 0, z: "front" },
        { dc: 0, dr: -1, z: "behind" },
        { dc: 2, dr: 0, z: "front" },
      ],
      ticksPerStation: 10,
    },
  },
  ...over,
});

const idle = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 2 * TILE * SUBS, playerY: 12 * TILE * SUBS,
  playerIframes: 0, playerOverlayOpen: false, fist: null, ...over,
});

const laufe = (w: ReturnType<typeof spawnEntities>, inp: WorldInput, ticks: number): EntityEvent[] => {
  const alle: EntityEvent[] = [];
  for (let t = 0; t < ticks; t++) alle.push(...stepEntities(w, GRID, inp));
  return alle;
};

describe("scene.stage · die Tier-Bühne", () => {
  it("geht ihre Stationen der Reihe nach ab", () => {
    const w = spawnEntities([buehne()], []);
    const e = w.entities[0]!;
    const start = e.x;
    laufe(w, idle(), 5);           // mitten im ersten Abschnitt
    const mitte = e.x;
    laufe(w, idle(), 25);          // über beide Abschnitte hinaus
    expect(mitte, "sie bewegt sich überhaupt").not.toBe(start);
    // Endstation ist dc +2 vom Anker
    expect(e.x).toBe(e.homeX + 2 * TILE * SUBS);
  });

  it("hält an und fragt GENAU EINMAL", () => {
    const w = spawnEntities([buehne()], []);
    // 3 Stationen à 10 Takte = 20 Takte Gehzeit; danach steht sie.
    const evs = laufe(w, idle(), 200);
    const fragen = evs.filter((v) => v.type === "engaged");
    expect(fragen.length, "der Halt IST die Frage — und er fällt einmal").toBe(1);
    expect(w.entities[0]!.state).toBe("posed");
  });

  it("Berührung tut NICHTS — ein Zoo ist kein Hinterhalt", () => {
    const w = spawnEntities([buehne()], []);
    laufe(w, idle(), 200); // sie steht und hat gefragt
    const e = w.entities[0]!;
    const evs = laufe(w, idle({ playerX: e.x, playerY: e.y }), 120);
    expect(evs.filter((v) => v.type === "engaged")).toEqual([]);
  });

  it("↑ hebt die Frage erneut — der Weg zurück in eine weggeklickte Karte", () => {
    const w = spawnEntities([buehne()], []);
    laufe(w, idle(), 200);
    const e = w.entities[0]!;
    const anIhr = idle({ playerX: e.x, playerY: e.y + TILE * SUBS, playerEngage: true });
    const evs = stepEntities(w, GRID, anIhr);
    expect(evs.filter((v) => v.type === "engaged").map((v) => v.id)).toEqual(["papagei"]);
    expect(ENGAGEABLE_ROLES.has("scene.stage")).toBe(true);
  });

  it("die reine Bahn ist DETERMINISTISCH und kennt hinter/vor", () => {
    const p0 = stagePointAt(0, 0, buehne().params!, 0);
    const p0b = stagePointAt(0, 0, buehne().params!, 0);
    expect(p0).toEqual(p0b);
    expect(p0.z).toBe("front");
    expect(stagePointAt(0, 0, buehne().params!, 10).z, "Station 2 steht HINTER dem Objekt").toBe("behind");
    expect(stagePointAt(0, 0, buehne().params!, 999).angekommen).toBe(true);
    // …und die Tiefe folgt daraus, ohne dass ein Test Phaser laden muss
    expect(stageDepthOf("behind")).toBeLessThan(7);
    expect(stageDepthOf("front")).toBeGreaterThan(7);
  });

  it("die Vorgabe-Gehzeit ist langsam genug zum LESEN", () => {
    // 90 Takte = 1,5 s je Abschnitt. Eine Bühne, die in drei Takten fertig ist,
    // zeigt nichts — die Bewegung IST die Lehre.
    expect(STAGE_TICKS_PER_STATION).toBe(90);
    const ohneAngabe = { stage: { propSkin: "auto", stations: [{ dc: 0, dr: 0 }, { dc: 3, dr: 0 }] } };
    expect(stagePointAt(0, 0, ohneAngabe, 89).angekommen).toBe(false);
    expect(stagePointAt(0, 0, ohneAngabe, 90).angekommen).toBe(true);
  });
});

describe("scene.stage · sie hebt den Schnell-Schirm, und beide Leser sind sich einig", () => {
  const ROWS = [
    "############",
    ...Array.from({ length: 16 }, () => "............"),
    "..S....o...X",
    "############",
    "############",
  ];
  const phase: PhaseSpec = {
    id: "p1", nameDe: "Feld", surface: "normal", plates: {}, rows: ROWS,
    entities: [{ ...buehne(), c: 7, r: 17, params: { stage: { propSkin: "auto", stations: [{ dc: 0, dr: 0 }, { dc: 1, dr: 0 }], ticksPerStation: 2 } } }],
    links: [], exit: { to: "done" },
  };
  const level: PaintLevel = {
    schema: "paintLevel@1", id: "g1-ch99", chapter: "ch99", draft: true, name: "T",
    goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x",
    abilities: ["jump", "run"], phases: [phase],
  };

  it("die Tabelle sagt quickfire", () => {
    expect(askerUsesOf({ role: "scene.stage", params: {} })).toEqual(["quickfire"]);
  });

  it("…und die Sim fragt denselben Pool", () => {
    // ZWEI Leser desselben Vertrags: `cards/serving.ts` bedient die Tore und die
    // Karten-Zustellung, `sim.ts` das laufende Spiel. Liefen sie auseinander,
    // hätte das Kapitel Karten, die nie jemand stellt.
    const sim = new Sim({
      level, phaseId: "p1",
      grantedAbilities: () => ["jump", "run"], freedCageIds: () => [],
    });
    const evs: SimEvent[] = [];
    for (let t = 0; t < 30; t++) evs.push(...sim.step(IDLE_PAD));
    const frage = evs.find((e): e is Extract<SimEvent, { type: "task" }> => e.type === "task");
    expect(frage, "die Bühne muss überhaupt fragen").toBeDefined();
    expect(frage?.req.use).toBe(askerUsesOf({ role: "scene.stage", params: {} })[0]);
  });
});
