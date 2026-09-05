// THE PAINTED BOOK — L3-M-a · die Ring-Kette von ch03 (das Tauwerk, SB 23).
//
// Zwei Dinge werden hier an der ECHTEN `Sim` geprüft, nicht am Modell:
// die Regrab-Sperre (der eben verlassene Ring bleibt kurz taub, jeder andere
// nicht) und die Kette selbst (Ring zu Ring, ohne Boden dazwischen).
//
// Die Zahlen stammen aus `scripts/paint-probes/ch03.probe.mjs`; die Sonde ist das
// Messgerät, diese Datei der Wächter. ⚠ Nicht zu verwechseln mit
// `scripts/paint-pilots/ch03.pilots.mjs` — das sind die Makros der G1-Bahn für
// das Beweisband.
import { describe, expect, it } from "vitest";
import { type PaintLevel, ringChainSpan } from "./level.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { Sim } from "./sim.ts";

const HOEHE = 26;
const RING_R = 8;
const START_C = 6;

const pad = (over: Partial<typeof IDLE_PAD> = {}): typeof IDLE_PAD => ({ ...IDLE_PAD, ...over });

/** Decke, Tintensee, eine Startplatte unter Ring 1, dann `ringe` Ringe im
 *  Abstand `dCols`. Derselbe Raum, den die Sonde fährt. */
const takelage = (ringe: number, dCols: number): string[] => {
  const breite = START_C + dCols * (ringe - 1) + 12;
  const rows: string[] = [];
  for (let r = 0; r < HOEHE; r++) {
    let z = "";
    for (let c = 0; c < breite; c++) z += r === 0 || r === HOEHE - 1 ? "#" : r >= HOEHE - 4 ? "w" : ".";
    rows.push(z);
  }
  const plattR = RING_R + 5;
  const platt = rows[plattR]!.split("");
  for (let c = START_C - 2; c <= START_C + 2; c++) platt[c] = "#";
  rows[plattR] = platt.join("");
  const st = rows[plattR - 1]!.split("");
  st[START_C] = "S";
  st[breite - 3] = "X";
  rows[plattR - 1] = st.join("");
  for (let i = 0; i < ringe; i++) {
    const z = rows[RING_R]!.split("");
    z[START_C + i * dCols] = "o";
    rows[RING_R] = z.join("");
  }
  return rows;
};

const level = (rows: string[], swing?: PaintLevel["phases"][number]["swing"]): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ring-test",
  chapter: "ch03",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "swing"],
  phases: [{ id: "p1", nameDe: "T", surface: "normal", plates: {}, rows, entities: [], links: [], exit: { to: "done" }, ...(swing ? { swing } : {}) }],
});

const sim = (rows: string[], swing?: PaintLevel["phases"][number]["swing"]): Sim =>
  new Sim({ level: level(rows, swing), phaseId: "p1", grantedAbilities: () => ["jump", "swing"], freedCageIds: () => [] });

/** Ein Lauf: an Ring 1 greifen, beim Winkel `loslassAb` loslassen, Richtung
 *  halten. Zurück kommt die Folge der gegriffenen Anker. */
const fahren = (rows: string[], swing: PaintLevel["phases"][number]["swing"] | undefined, loslassAb: number): string[] => {
  const s = sim(rows, swing);
  const griffe: string[] = [];
  let prev: string | null = null;
  for (let t = 0; t < 1200; t++) {
    const p = s.player;
    const tasten = p.swing
      ? p.swing.angle >= loslassAb
        ? { jump: true, right: true }
        : {}
      : griffe.length === 0
        ? { jump: true }
        : { right: true };
    s.step(pad(tasten));
    const q = s.player;
    const key = q.swing ? `${q.swing.anchorX},${q.swing.anchorY}` : null;
    if (key !== null && key !== prev) griffe.push(key);
    prev = key;
    if (q.grounded && griffe.length > 0) break;
    if (q.y / SUBS / TILE >= HOEHE - 4 && griffe.length > 0) break;
  }
  return griffe;
};

describe("die Ring-Kette", () => {
  it("sperrt nach dem Loslassen NUR den eben verlassenen Ring", () => {
    // Loslassen nahe der Bogen-Unterkante: bei 32 px Seil steht die Hand dort nur
    // 32·sin(16,9°) ≈ 9 px neben dem Anker, also MITTEN im 14-px-Griffradius.
    // Ohne Sperre fasst das Kind denselben Ring im nächsten Tick wieder — und
    // kommt nie los. An der Sonde gemessen (§4b): 37 Griffe, alle am ERSTEN Ring;
    // mit einer Sperre ab 4 Ticks sind es 3 Griffe an 3 Ringen.
    const rows = takelage(3, 5);
    const ohne = fahren(rows, { ropePx: 32, releaseLiftPx: 4, regrabLockTicks: 0 }, 280);
    const mit = fahren(rows, { ropePx: 32, releaseLiftPx: 4, regrabLockTicks: 12 }, 280);

    const verschieden = (g: string[]): number => new Set(g).size;
    // ohne Sperre: viele Griffe, EIN Ring — die Kette fängt nicht einmal an
    expect(verschieden(ohne)).toBe(1);
    expect(ohne.length).toBeGreaterThan(10);
    // mit Sperre: jeder Griff ein neuer Ring
    expect(verschieden(mit)).toBe(3);
    expect(mit.length).toBe(verschieden(mit));
    // …ein Ring wird also nie zweimal hintereinander gefasst
    for (let i = 1; i < mit.length; i++) expect(mit[i]).not.toBe(mit[i - 1]);
  });

  it("trägt von Ring zu Ring, ohne den Boden zu berühren", () => {
    const griffe = fahren(takelage(5, 5), { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: 20 }, 368);
    expect(new Set(griffe).size).toBe(5);
  });

  it("kann das der ausgelieferte Motor NICHT — die Eich-Zeile", () => {
    // dieselbe Geometrie, aber ohne `swing`-Block: 96 px Seil, Lift 2, keine
    // Sperre. Fünf Ringe im Abstand von fünf Spalten liegen dann UNTER der
    // Kettenspanne (`ringChainSpan(96)` = 6…9) — der Scheitel des Pendels trägt
    // die Hände schon an ihnen vorbei.
    const griffe = fahren(takelage(5, 5), undefined, 368);
    expect(new Set(griffe).size).toBeLessThan(5);
  });

  it("`ringChainSpan` ist die gemessene Spanne und verspricht nie mehr als die Engine trägt", () => {
    // Sonde §7, Spalten bei dy = 0: 32 px → 2…7 · 48 → 3…7 · 64 → 4…8 · 96 → 6…9
    const gemessen: Array<[number, number, number]> = [[32, 2, 7], [48, 3, 7], [64, 4, 8], [96, 6, 9]];
    for (const [rope, minGemessen, maxGemessen] of gemessen) {
      const span = ringChainSpan(rope);
      expect(span.min).toBe(minGemessen); // die Untergrenze ist exakt getroffen
      expect(span.max).toBeLessThanOrEqual(maxGemessen); // die obere unterbietet
      expect(span.max).toBeGreaterThan(span.min);
    }
  });
});
