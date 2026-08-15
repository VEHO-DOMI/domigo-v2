// R5-W4 · F5 · WAS DIE KARTEN BEHAUPTEN, TUT DIE WELT JETZT.
//
// Drei von Kokis fünf Replay-Befunden dieser Runde sind derselbe Fehler in drei
// Kleidern: der Text sagt etwas, das Bild zeigt es nicht.
//   · „Der Bleistift kritzelt wild über das Papier." — er patrouillierte brav.
//   · „Die Regel-Seite … etwas, das man haben will" — sie stand still.
//   · „Merle soll sich durchs Level bewegen" — sie stand nach ihrer Rettung.
// Alle drei sind hier reine Funktionen mit einer Tabelle statt eines Screenshots.
//
// Eigene Datei, mit Absicht: in Welle 4 arbeiten zehn Sessions parallel am
// selben Baum, und eine NEUE Datei kann per Konstruktion mit keiner fremden
// Änderung kollidieren (Rahmen §4). Die Wippe und das Käfig-Rütteln stehen
// weiter in `breath.test.ts`, wo die übrigen Bewegungs-Gesetze wohnen.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { entPoseCell, type EntPoseInput } from "./anim.ts";
import {
  CUE_HALO,
  TREASURE_HALO_COLOUR,
  TREASURE_SPIN_MIN,
  TREASURE_SPIN_TICKS,
  TREASURE_WHIRL_EVERY,
  TREASURE_WHIRL_TICKS,
  treasureCue,
  treasureSpinSx,
  treasureTurns,
} from "./cue.ts";
import { classmateCell } from "./anim.ts";
import {
  FRENZY_FLIP_TICKS,
  FRENZY_REACH_PX,
  FRENZY_TICKS,
  type EntityWorld,
  type WorldInput,
  frenzyEveryFor,
  frenzyFlipsBy,
  frenzyOffsetSubs,
  HOP_EVERY_TICKS,
  HOP_RISE_PX,
  HOP_TICKS,
  ROAM_MAX_CELLS,
  restoreFreedClassmate,
  roamHopT,
  roamZone,
  spawnEntities,
  stepEntities,
} from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import type { EntitySpec } from "./level.ts";

const LEVEL = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
interface Phase { id: string; rows: string[]; entities: EntitySpec[] }
/** Die AUSGELIEFERTE Phase, nie ein Stellvertreter: ein Gesetz über das
 *  Patrouillen-Band muss gegen das Band gelten, das das Kind wirklich sieht. */
const phase = (id: string): Phase => {
  const level = JSON.parse(fs.readFileSync(LEVEL, "utf8")) as { phases: Phase[] };
  return level.phases.find((p) => p.id === id)!;
};

const input = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 0,
  playerY: 0,
  playerIframes: 0,
  playerOverlayOpen: false,
  fist: null,
  ...over,
});

const ent = (over: Partial<EntPoseInput>): EntPoseInput => ({
  role: "chaser", state: "patrol", timer: 0, vx: 0, vy: 0, x: 0, homeX: 0, ...over,
} as EntPoseInput);

// ─────────────────────────────────────────────────────────────────────────────
describe("R5-F5 · der Kritzel-Anfall (F-6)", () => {
  it("ein ganzer Anfall bewegt den Körper NETTO NULL", () => {
    let x = 0;
    for (let t = 1; t <= FRENZY_TICKS; t++) x += frenzyOffsetSubs(t) - frenzyOffsetSubs(t - 1);
    expect(x).toBe(0);
  });

  it("…und unterwegs ist er wirklich unterwegs (sonst wäre »netto null« nur »nichts«)", () => {
    const spur = Array.from({ length: FRENZY_TICKS + 1 }, (_, t) => frenzyOffsetSubs(t));
    const spannePx = (Math.max(...spur) - Math.min(...spur)) / SUBS;
    expect(spannePx).toBeGreaterThan(FRENZY_REACH_PX); // beide Seiten zusammen
    expect(spannePx).toBeLessThanOrEqual(2 * FRENZY_REACH_PX + 1e-9);
  });

  it("die Blickrichtung kippt eine GERADE Anzahl mal — er kommt heraus, wie er hereinkam", () => {
    expect(frenzyFlipsBy(FRENZY_TICKS) % 2).toBe(0);
    expect(frenzyFlipsBy(FRENZY_TICKS)).toBeGreaterThanOrEqual(4); // es soll nach Kritzeln aussehen
  });

  it("zwei Läufer im Kapitel zucken nicht im Gleichtakt", () => {
    expect(frenzyEveryFor("p1-pencil1")).not.toBe(frenzyEveryFor("p2-pen"));
  });

  it("der Anfall trägt die HANDLUNGS-Zelle — genau die, die die Karte zeigt", () => {
    expect(entPoseCell(ent({ state: "frenzy" }))).toBe("act");
    // …und die Karte `enc.pencil.k1` bindet `pencil_act`: Welt und Karte sagen dasselbe
    const tasks = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.tasks.v2.json"), "utf8",
    )) as { items: { id: string; stimulus?: { art?: string } }[] };
    const karte = tasks.items.find((t) => t.id === "g1.paint.ch01.enc.pencil.k1")!;
    expect(karte.stimulus?.art).toBe("pencil_act");
  });

  it("★ das autorisierte Patrouillen-Band hält — über 2000 Ticks, im ausgelieferten p1", () => {
    const p = phase("p1");
    const w: EntityWorld = spawnEntities(p.entities, []);
    const pencil = w.entities.find((e) => e.id === "p1-pencil1")!;
    const min = Number(pencil.params.patrolMinC) * TILE * SUBS;
    const max = (Number(pencil.params.patrolMaxC) + 1) * TILE * SUBS;
    let sahFrenzy = false;
    for (let t = 0; t < 2000; t++) {
      // das Kind steht weit weg: kein Aggro, damit der Anfall wirklich läuft
      stepEntities(w, p.rows, input({ playerX: 60 * TILE * SUBS, playerY: 0 }));
      if (pencil.state === "frenzy") sahFrenzy = true;
      expect(pencil.x).toBeGreaterThanOrEqual(min);
      expect(pencil.x).toBeLessThanOrEqual(max);
    }
    expect(sahFrenzy, "in 2000 Ticks kritzelt er mindestens einmal").toBe(true);
  });

  it("★ das Kind sticht den Anfall: aus dem Kritzeln wird der angekündigte Angriff", () => {
    const p = phase("p1");
    const w: EntityWorld = spawnEntities(p.entities, []);
    const pencil = w.entities.find((e) => e.id === "p1-pencil1")!;
    pencil.state = "frenzy";
    pencil.timer = 3;
    const ankerX = pencil.x - frenzyOffsetSubs(3);
    stepEntities(w, p.rows, input({ playerX: pencil.x + 8 * SUBS, playerY: pencil.y }));
    expect(pencil.state).toBe("telegraph");
    // …und der Abbruch setzt ihn auf den Anker zurück, nicht irgendwohin
    expect(pencil.x).toBe(ankerX);
  });

  it("dieselbe Uhr, dasselbe Kritzeln (die Beweisbänder müssen wiederholbar bleiben)", () => {
    const a = Array.from({ length: 200 }, (_, t) => frenzyOffsetSubs(t));
    const b = Array.from({ length: 200 }, (_, t) => frenzyOffsetSubs(t));
    expect(a).toEqual(b);
    expect(FRENZY_TICKS % FRENZY_FLIP_TICKS).toBe(0); // sonst wäre »netto null« Zufall
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("R5-F5 · die Pirouette der Regel-Seite (F-16, R37)", () => {
  const SEED = 42;

  it("sie dreht sich wirklich — Vorderseite UND Rückseite kommen vor", () => {
    const spur = Array.from({ length: TREASURE_SPIN_TICKS + 1 }, (_, t) => treasureSpinSx(t, SEED, false));
    expect(Math.max(...spur), "irgendwann voll frontal").toBeGreaterThan(0.95);
    expect(Math.min(...spur), "irgendwann die Rückseite").toBeLessThan(-0.95);
  });

  it("…und verschwindet dabei NIE (eine Belohnung, die blinkt, ist keine)", () => {
    for (let t = 0; t < 1200; t++) {
      expect(Math.abs(treasureSpinSx(t, SEED, false))).toBeGreaterThanOrEqual(TREASURE_SPIN_MIN - 1e-9);
    }
  });

  it("★ der Wirbel hat keinen Sprung — auch nicht an seiner eigenen Grenze", () => {
    // Genau das ist die Falle bei einem Beat, der »alle n Ticks« neu anfängt:
    // an der Fenstergrenze springt der Winkel zurück und man sieht einen Ruck.
    let maxSprung = 0;
    for (let t = 1; t < 4 * TREASURE_WHIRL_EVERY; t++) {
      maxSprung = Math.max(maxSprung, Math.abs(treasureTurns(t, SEED) - treasureTurns(t - 1, SEED)));
    }
    // die schnellste Stelle ist die Mitte des Wirbels; ein SPRUNG wäre ein
    // Vielfaches davon (eine ganze Umdrehung = 1,0)
    expect(maxSprung).toBeLessThan(0.25);
  });

  it("der Wirbel ist auch wirklich schneller als der ruhige Umlauf", () => {
    const tempo = (t: number): number => treasureTurns(t + 1, SEED) - treasureTurns(t, SEED);
    const ruhig = tempo(TREASURE_WHIRL_EVERY - 60);
    const imWirbel = tempo(TREASURE_WHIRL_TICKS / 2);
    expect(imWirbel).toBeGreaterThan(ruhig * 3);
  });

  it("zwei Seiten in einem Kapitel stehen nicht auf demselben Winkel", () => {
    const a = treasureSpinSx(0, 111, false);
    const b = treasureSpinSx(0, 222, false);
    expect(a).not.toBeCloseTo(b, 3);
  });

  it("reduzierte Bewegung: die Seite steht frontal und still", () => {
    for (const t of [0, 40, 84, 167, 359]) expect(treasureSpinSx(t, SEED, true)).toBe(1);
  });

  it("★ der Schatten wird mit der Seite schmaler — kein Aufkleber unter einem drehenden Ding", () => {
    const breit = Array.from({ length: TREASURE_SPIN_TICKS }, (_, t) => ({
      sx: Math.abs(treasureSpinSx(t, SEED, false)),
      rx: treasureCue(100, 200, 24, 32, SEED, t, false).shadow.rx,
    }));
    const schmalste = breit.reduce((m, v) => (v.sx < m.sx ? v : m));
    const breiteste = breit.reduce((m, v) => (v.sx > m.sx ? v : m));
    expect(schmalste.rx).toBeLessThan(breiteste.rx * 0.5);
  });

  it("das Licht der Seite ist KÜHL und das Kreide-Gold bleibt dem Pfeil", () => {
    // R37 in einer Zeile: die beiden Familien dürfen nicht dieselbe sein
    const b = (c: number): [number, number, number] => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    const [hr, , hb] = b(TREASURE_HALO_COLOUR);
    const [cr, , cb] = b(CUE_HALO);
    expect(hb, "die Seite: mehr Blau als Rot").toBeGreaterThan(hr);
    expect(cr, "der Pfeil: mehr Rot als Blau").toBeGreaterThan(cb);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("R5-F5 · Merle geht herum (F-26, R49)", () => {
  const feetOf = (r: number): number => (r + 1) * TILE * SUBS;
  const xOf = (c: number): number => (c * TILE + TILE / 2) * SUBS;
  const cellOf = (xSubs: number): number => Math.floor(xSubs / SUBS / TILE);

  it("★ ihre Zone im AUSGELIEFERTEN p2 ist genau ihr Vierer-Sims — c63…c66", () => {
    const p = phase("p2");
    const merle = p.entities.find((e) => e.id === "merle")!;
    const z = roamZone(p.rows, xOf(merle.c), feetOf(merle.r));
    expect(cellOf(z.minX)).toBe(63);
    expect(cellOf(z.maxX)).toBe(66);
  });

  it("ROT ZUERST · über Luft geht sie nicht", () => {
    // ein Sims von drei Kacheln, links und rechts der Abgrund
    const grid = ["............", "............", "...###......", "............", "############"];
    const z = roamZone(grid, xOf(4), feetOf(1));
    expect(cellOf(z.minX)).toBe(3);
    expect(cellOf(z.maxX)).toBe(5);
  });

  it("ROT ZUERST · in die Tinte geht sie auch nicht", () => {
    // derselbe Boden, aber auf der rechten Kachel steht eine Gefahr im Feld
    const rein = ["............", "............", "..#####.....", "............", "############"];
    const mitGefahr = ["............", ".....^......", "..#####.....", "............", "############"];
    expect(cellOf(roamZone(rein, xOf(3), feetOf(1)).maxX)).toBe(6);
    expect(cellOf(roamZone(mitGefahr, xOf(3), feetOf(1)).maxX)).toBe(4); // vor der Tinte ist Schluss
  });

  it("ROT ZUERST · auch eine STUFE HINAUF ist nicht mehr ihr Boden", () => {
    // Der Fall, den `maxDropTiles: 0` allein NICHT fängt: die Sonde des Läufers
    // erlaubt einen Anstieg von einer Kachel (`feetPx - s.yPx <= TILE`). Für
    // einen Läufer stimmt das — für eine Zone, die verspricht, dass ihre Füsse
    // die ganze Zeit auf DERSELBEN Linie stehen, nicht. Ohne die Zeile
    // »exakt dieselbe Standlinie« liefe sie in die erhöhte Kachel hinein.
    //
    // Dieser Fall ist der Grund, dass die Zeile existiert: ein Tamper, der sie
    // entfernte, liess erst alle anderen Prüfungen grün — er bewies nichts.
    const stufe = [
      "............",
      "............",
      "..###.......", // Reihe 2: ihr Sims
      ".....##.....", // Reihe 3 — die Kachel rechts liegt eine Reihe TIEFER…
      "############",
    ];
    // …und hier dieselbe Karte mit einer Stufe HINAUF statt hinunter
    const hinauf = [
      "............",
      ".....##.....", // eine Kachel höher als ihr Sims
      "..###.......",
      "............",
      "############",
    ];
    expect(cellOf(roamZone(stufe, xOf(3), feetOf(1)).maxX), "hinunter: Schluss").toBe(4);
    expect(cellOf(roamZone(hinauf, xOf(3), feetOf(1)).maxX), "hinauf: auch Schluss").toBe(4);
  });

  it("ihr Raum ist gedeckelt — eine lange Halle schickt sie nicht durchs Level", () => {
    const lang = ["".padEnd(60, "."), "".padEnd(60, "."), "".padEnd(60, "#"), "".padEnd(60, "#")];
    const z = roamZone(lang, xOf(30), feetOf(1));
    expect(cellOf(z.maxX) - 30).toBe(ROAM_MAX_CELLS);
    expect(30 - cellOf(z.minX)).toBe(ROAM_MAX_CELLS);
  });

  it("★ 3000 Ticks im ausgelieferten p2: sie verlässt ihren Sims NIE", () => {
    const p = phase("p2");
    const w: EntityWorld = spawnEntities(p.entities, []);
    const merle = w.entities.find((e) => e.id === "merle")!;
    merle.hidden = false;
    restoreFreedClassmate(merle, 999);
    const z = roamZone(p.rows, merle.homeX, merle.homeY);
    const zustände = new Set<string>();
    let ging = false;
    for (let t = 0; t < 3000; t++) {
      stepEntities(w, p.rows, input({ playerX: 0, playerY: 0 }));
      zustände.add(merle.state);
      if (merle.state === "roam" && merle.x !== merle.homeX) ging = true;
      expect(merle.x).toBeGreaterThanOrEqual(z.minX);
      expect(merle.x).toBeLessThanOrEqual(z.maxX);
      // …und sie hebt nie höher ab als der Hüpfer erlaubt
      expect(merle.homeY - merle.y).toBeLessThanOrEqual(HOP_RISE_PX * SUBS);
      expect(merle.homeY - merle.y).toBeGreaterThanOrEqual(0);
    }
    expect(ging, "sie geht wirklich").toBe(true);
    expect(zustände.has("roam")).toBe(true);
    expect(zustände.has("wave"), "R49 streicht das Winken NICHT").toBe(true);
    expect(zustände.has("rest")).toBe(true);
  });

  it("der Kreis ist stehen → gehen → winken → stehen (das Winken überlebt den Gang)", () => {
    const p = phase("p2");
    const w: EntityWorld = spawnEntities(p.entities, []);
    const merle = w.entities.find((e) => e.id === "merle")!;
    merle.hidden = false;
    restoreFreedClassmate(merle, 999);
    const folge: string[] = [];
    for (let t = 0; t < 2000; t++) {
      stepEntities(w, p.rows, input());
      if (folge[folge.length - 1] !== merle.state) folge.push(merle.state);
    }
    const kreis = folge.join(">");
    expect(kreis).toContain("rest>roam>wave>rest");
  });

  it("der Hüpfer setzt sie exakt wieder ab", () => {
    expect(roamHopT(0)).toBe(0);
    expect(roamHopT(HOP_TICKS)).toBe(0);
    expect(roamHopT(HOP_EVERY_TICKS)).toBe(0);
    expect(roamHopT(Math.round(HOP_TICKS / 2))).toBeGreaterThan(0.9);
  });

  it("der Gang trägt ihre DREI Geh-Zellen, der Hüpfer ihre Freuden-Zelle", () => {
    const zellen = new Set(Array.from({ length: HOP_EVERY_TICKS }, (_, t) => classmateCell("roam", t)));
    for (const c of ["walk1", "walk2", "walk3"]) expect(zellen).toContain(c);
    expect(classmateCell("roam", Math.round(HOP_TICKS / 2))).toBe("joy");
  });

  it("nach dem Remount steht sie erst einmal (und geht erst nach ihrer Ruhe los)", () => {
    const p = phase("p2");
    const w: EntityWorld = spawnEntities(p.entities, []);
    const merle = w.entities.find((e) => e.id === "merle")!;
    restoreFreedClassmate(merle, 999);
    expect(merle.state).toBe("rest");
  });
});
