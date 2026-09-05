// THE PAINTED BOOK — L3-M-a · die steigende Bilge von ch03 (unter Deck).
//
// Das Wasser dieses Spiels war bis ch03 reine Geografie: ein `w` liegt, wo es
// liegt. Unter Deck steigt es in Pulsen, ein Faust-Treffer auf einen Pumpengriff
// friert es ein, das Ablassventil senkt es. Die Zahlen dieser Datei stammen aus
// derselben Messung wie der Motor: `scripts/paint-probes/ch03.probe.mjs` Teil C.
//
// Der WICHTIGSTE Test steht ganz unten und handelt von etwas, das NICHT passiert:
// ohne `bilge` ist das Tick-Gitter DIESELBE REFERENZ wie das autorierte. Das ist
// die Paritaets-Garantie der ganzen Bahn — ch01, ch02 und ch03 bekommen
// buchstaeblich dasselbe Array, koennen sich also unmoeglich anders verhalten.
import { describe, expect, it } from "vitest";
import { type EntitySpec, type PaintLevel, type PhaseSpec, floodedRows } from "./level.ts";
import { SUBS, TILE } from "./paint.ts";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";

const BREITE = 28;
const HOEHE = 22;
const GANG_R = 10; // die Zeile, in der das Kind steht; darunter liegt der Laufgang

const pad = (over: Partial<typeof IDLE_PAD> = {}): typeof IDLE_PAD => ({ ...IDLE_PAD, ...over });

const rows = (): string[] => {
  const g: string[] = [];
  for (let r = 0; r < HOEHE; r++) {
    let z = "";
    for (let c = 0; c < BREITE; c++) z += r === 0 || r === HOEHE - 1 ? "#" : ".";
    g.push(z);
  }
  const gang = g[GANG_R + 1]!.split("");
  for (let c = 1; c < BREITE - 1; c++) gang[c] = "#";
  g[GANG_R + 1] = gang.join("");
  const st = g[GANG_R]!.split("");
  st[3] = "S";
  st[BREITE - 4] = "X";
  g[GANG_R] = st.join("");
  return g;
};

const GRIFFE: EntitySpec[] = [
  { id: "pumpe", role: "pump.trigger", skin: "fb-ent-generic", c: 8, r: GANG_R, tier: "E", params: { kind: "pump" } },
  { id: "ventil", role: "pump.trigger", skin: "fb-ent-generic", c: 18, r: GANG_R, tier: "E", params: { kind: "valve" } },
];

const BILGE = {
  band: { c0: 1, c1: BREITE - 2 },
  rStart: HOEHE - 2,
  rTop: 6,
  pulseTicks: 30,
  riseRows: 1,
  freezeTicks: 180,
  pumps: ["pumpe"],
  valve: "ventil",
} as const;

const phase = (mitBilge: boolean): PhaseSpec => ({
  id: "p1",
  nameDe: "Laderaum",
  surface: "normal",
  plates: {},
  rows: rows(),
  entities: mitBilge ? GRIFFE : [],
  links: [],
  exit: { to: "done" },
  ...(mitBilge ? { bilge: { ...BILGE, pumps: [...BILGE.pumps] } } : {}),
});

const level = (mitBilge: boolean): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-bilge-test",
  chapter: "ch03",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "punch"],
  phases: [phase(mitBilge)],
});

const sim = (mitBilge = true): Sim =>
  new Sim({ level: level(mitBilge), phaseId: "p1", grantedAbilities: () => ["jump", "punch"], freedCageIds: () => [] });

describe("die steigende Bilge", () => {
  it("steigt in Pulsen — nicht stetig, und nicht über den Höchststand hinaus", () => {
    const s = sim();
    expect(s.bilgeWaterRow).toBe(BILGE.rStart);
    const pulse: Array<{ tick: number; row: number }> = [];
    let letzte = s.bilgeWaterRow;
    for (let t = 0; t < 900; t++) {
      const evs = s.step(pad());
      if (s.bilgeWaterRow !== letzte) {
        // jede Bewegung des Wassers MELDET sich — ein stiller Anstieg wäre ein
        // Beat ohne Klang und ohne Bild
        expect(evs.some((e) => e.type === "bilgePulse")).toBe(true);
        pulse.push({ tick: t, row: s.bilgeWaterRow });
        letzte = s.bilgeWaterRow;
      }
    }
    expect(pulse.length).toBe(BILGE.rStart - BILGE.rTop);
    expect(s.bilgeWaterRow).toBe(BILGE.rTop);
    // Pulse, nicht Fluss: gleiche Abstände, und zwar genau die deklarierten
    for (let i = 1; i < pulse.length; i++) {
      expect(pulse[i]!.tick - pulse[i - 1]!.tick).toBe(BILGE.pulseTicks);
    }
  });

  it("hält an, wenn die Faust den Pumpengriff trifft — und läuft danach weiter", () => {
    const s = sim();
    for (let t = 0; t < 90; t++) s.step(pad());
    const vorher = s.bilgeWaterRow;
    let frozenTick: number | null = null;
    for (let t = 0; t < 400 && frozenTick === null; t++) {
      const cc = s.player.x / SUBS / TILE;
      const nah = Math.abs(cc - 8) < 1.5;
      // ⚠ die Faust fliegt beim LOSLASSEN der Taste (player.ts#punchReleased),
      // nicht beim Drücken — die Sonde hat das einmal falsch gemessen
      const evs = s.step(pad({ right: cc < 7.5, left: cc > 8.5, punch: nah && t % 16 < 6 }));
      if (evs.some((e) => e.type === "pumpFrozen")) frozenTick = t;
    }
    expect(frozenTick, "die Faust hat den Pumpengriff nie getroffen").not.toBeNull();
    const beimTreffer = s.bilgeWaterRow;
    for (let t = 0; t < BILGE.freezeTicks - 20; t++) s.step(pad());
    expect(s.bilgeWaterRow, "das Wasser ist während der Sperre gestiegen").toBe(beimTreffer);
    for (let t = 0; t < 120; t++) s.step(pad());
    expect(s.bilgeWaterRow, "das Wasser ist nach der Sperre nicht weitergestiegen").toBeLessThan(beimTreffer);
    expect(beimTreffer).toBeLessThan(vorher); // es war zwischendurch gestiegen
  });

  it("fällt auf den Anfangsstand zurück, wenn die Faust das Ablassventil trifft", () => {
    const s = sim();
    // 90 Ticks, nicht mehr: das Ventil steht fünfzehn Spalten weit weg, und ein
    // Kind, das erst losläuft, wenn das Wasser schon oben ist, ertrinkt unterwegs
    for (let t = 0; t < 90; t++) s.step(pad());
    expect(s.bilgeWaterRow).toBeLessThan(BILGE.rStart);
    let drained: number | null = null;
    for (let t = 0; t < 600 && drained === null; t++) {
      const cc = s.player.x / SUBS / TILE;
      const nah = Math.abs(cc - 18) < 1.5;
      const evs = s.step(pad({ right: cc < 17.5, left: cc > 18.5, punch: nah && t % 16 < 6 }));
      if (evs.some((e) => e.type === "bilgeDrained")) drained = t;
    }
    expect(drained, "die Faust hat das Ablassventil nie getroffen").not.toBeNull();
    expect(s.bilgeWaterRow).toBe(BILGE.rStart);
  });

  it("ertränkt das Kind, wenn das Wasser seine Zeile erreicht (der w-Warp)", () => {
    const s = sim();
    let platsch: number | null = null;
    for (let t = 0; t < 1200 && platsch === null; t++) {
      const evs = s.step(pad());
      if (evs.some((e) => e.type === "toast" && e.msg.includes("Platsch"))) platsch = t;
    }
    expect(platsch, "das Wasser stieg über das Kind hinweg, ohne es zu berühren").not.toBeNull();
    // …und es geschieht ERST, wenn das Wasser wirklich oben ist: das Kind steht
    // auf GANG_R, die Bilge startet ganz unten
    expect(s.bilgeWaterRow).toBeLessThanOrEqual(GANG_R + 1);
  });

  it("lässt das AUTORIERTE Gitter in Ruhe — der Renderer liest es jeden Frame", () => {
    const s = sim();
    const vorher = s.grid;
    const bytes = s.grid.join("\n");
    for (let t = 0; t < 400; t++) s.step(pad());
    expect(s.grid, "`grid` wurde ersetzt — der Renderer bekäme ein wanderndes Terrain").toBe(vorher);
    expect(s.grid.join("\n")).toBe(bytes);
    // …und das Tick-Gitter ist inzwischen ein anderes
    expect(s.tickGrid).not.toBe(s.grid);
  });

  // ── DIE PARITÄTS-GARANTIE ──────────────────────────────────────────────────
  it("ist ohne `bilge` DIESELBE REFERENZ — ch01/ch02/ch03 rechnen unverändert", () => {
    const s = sim(false);
    expect(s.bilgeWaterRow).toBe(-1);
    expect(s.tickGrid).toBe(s.grid); // Referenz, nicht Inhalt
    for (let t = 0; t < 300; t++) s.step(pad());
    expect(s.tickGrid, "eine Phase ohne Bilge hat ihr Gitter neu gebaut").toBe(s.grid);
  });

  it("flutet nur LEERE Zellen — was gebaut ist, bleibt gebaut", () => {
    const g = rows();
    const geflutet = floodedRows(g, BILGE.band, GANG_R);
    // der Laufgang unter dem Kind ist solide und bleibt es
    expect(geflutet[GANG_R + 1]![10]).toBe("#");
    // die Luft daneben ist Wasser
    expect(geflutet[GANG_R]![10]).toBe("w");
    // über der Wasserlinie ändert sich nichts
    expect(geflutet[GANG_R - 1]).toBe(g[GANG_R - 1]);
    // ein Startpunkt ist keine leere Zelle und wird deshalb NICHT geflutet
    expect(geflutet[GANG_R]![3]).toBe("S");
    // und ausserhalb des Bandes ändert sich nichts
    const schmal = floodedRows(g, { c0: 9, c1: 11 }, GANG_R);
    expect(schmal[GANG_R]![10]).toBe("w");
    expect(schmal[GANG_R]![14]).toBe(".");
  });
});
