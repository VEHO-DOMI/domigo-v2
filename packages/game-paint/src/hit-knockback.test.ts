// R5-W1 · F1 · DER TREFFER-PFAD (Auftrag F1, Item 1: „prüfe auch den
// Treffer-/iframes-Pfad").
//
// Gefunden beim Prüfen: `applyKnockback` ist eine REINE Funktion — sie gibt
// einen neuen Zustand zurück. Der Gefahren-Pfad (Stacheln, Tinte) weist ihn
// korrekt zu; der WESEN-Pfad warf ihn weg und setzte nur `iframes`. Ein
// Kreide-Wesen, das das Kind berührt, hat es also nie zurückgestoßen: kein
// Rückstoß, kein Stolpern, keine „hit"-Pose — entgegen dem Kanon (doc 41/44:
// „a chalk hit = knockback + a boss-window task") und entgegen Schuld D-17,
// die genau danach fragt.
//
// Und darunter, nur sichtbar, sobald der Rückstoß überhaupt ankommt: das
// VORZEICHEN war verkehrt. `fromDir` heißt „in dieser Richtung liegt die
// Gefahr" (player.test.ts pinnt die Konvention), der Ausdruck lieferte das
// Gegenteil — der naive Fix hätte das Kind IN das Wesen hinein gestoßen.
// Deshalb prüft C2 beide Seiten.
//
// ─────────────────────────────────────────────────────────────────────────
// ✔ ENTSCHIEDEN (Architekten-Ruling, 11.08.2026): RÜCKSTOSS NUR BEIM BOSS.
//
// Die Messung unten hat die Entscheidung getragen: p2 löst zwölf Begegnungen
// pro Durchlauf aus, weil die Schwärme dort Durchgangs-Stationen sind. Also
// stößt jetzt die Kreide der Tafel zurück — und sonst nichts. Das ist auch,
// was doc 44 §4 ch01 C4 wörtlich sagt.
//
// Diese Datei prüft ab hier BEIDE Hälften des Rulings, denn eine davon ist ein
// Nicht-Ereignis und wäre sonst nie bewacht: dass ein Feld-Wesen den Körper in
// Ruhe lässt, ist genauso Gesetz wie dass der Boss ihn wirft.
//
// ── Der historische Befund, den das Ruling beantwortet ───────────────────
// ⏸ WAR GEPARKT — WARTET(E) AUF EINE ENTSCHEIDUNG (R5-W1 · F1, 11.08.2026)
//
// Der Fix ist geschrieben, getestet und war grün: C1–C5 liefen mit ihm durch
// und ohne ihn rot. Er liegt NICHT im PR, weil die Messung danach etwas
// zeigte, das vorher niemand wusste:
//
//   Phase p2 löst in einem Durchlauf ZWÖLF Begegnungen aus — die Schwärme auf
//   dem Weg sind als Durchlauf-Stationen gebaut („Schwarm 1 zahlt unterwegs").
//   Solange ein Treffer körperlich folgenlos war, konnte das Kind mitten
//   hindurchgehen. Mit echtem Rückstoß wird es zwölfmal zurückgeworfen; der
//   aufgezeichnete Pilot erreicht den Ausgang nicht mehr (2361 Ticks statt
//   965, Endstand Spalte 68,6). BEWIESEN, nicht vermutet: ohne den Fix nimmt
//   derselbe Recorder p2 sauber auf (✓ exit → p3, 965 Ticks, 12 Aufgaben).
//
// Das ist keine Bug-Frage mehr, sondern eine Spielgefühl-Frage für Koki: soll
// JEDE Wesen-Berührung zurückstoßen (dann wird p2 spürbar härter und die
// Route muss neu gedacht werden), oder nur die Kreide des Bosses — was der
// Kanon-Satz „a chalk hit = knockback + a boss-window task" (doc 44 §4 ch01
// C4) wörtlich genommen auch hergibt? Diese Session redesignt p2 nicht im
// Vorbeigehen.
//
// ─────────────────────────────────────────────────────────────────────────

import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { type EntitySpec, type PaintLevel } from "./level.ts";
import { PAINT, SUBS, TILE } from "./paint.ts";

const W = 40;
const row = (fill: string): string => fill.repeat(W);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

/** Ein flacher Raum: Boden in Zeile 15, der Held startet auf Spalte 20. */
const FLOOR = [
  ...Array.from({ length: 14 }, () => row(".")),
  put(row("."), 20, "S"),
  row("#"),
  row("#"),
];

const level = (entities: EntitySpec[], rows: readonly string[] = FLOOR): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump"],
  phases: [{
    id: "p1",
    nameDe: "Test",
    surface: "normal",
    plates: {},
    rows: [...rows],
    entities,
    links: [],
    exit: { to: "done" },
  }],
});

const chaser = (c: number): EntitySpec => ({
  id: "beast", role: "chaser", skin: "pencil", c, r: 14, tier: "E", params: {},
});

const make = (entities: EntitySpec[]): Sim =>
  new Sim({ level: level(entities), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

/** Läuft, bis das Wesen das Kind berührt (die Begegnungs-Karte aufgeht). */
const untilHit = (sim: Sim, ticks = 400): boolean => {
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step(IDLE_PAD)) {
      if (ev.type === "task" && ev.req.ctx.type === "entity") return true;
    }
  }
  return false;
};

/** Die Tafel — dieselbe Rolle wie in der Arena, hier auf einer Seite des Kindes
 *  platziert, damit die Richtung des Stoßes überhaupt eine Aussage hat. */
const tafel = (c: number): EntitySpec => ({
  id: "tafel", role: "guardian", skin: "tafel", c, r: 14, tier: "E", params: {},
});

/** Läuft, bis das Kind Schaden nimmt (die Tafel greift über ihre eigene
 *  Choreografie an, nicht durch bloße Berührung). */
const untilStun = (sim: Sim, ticks = 900): boolean => {
  for (let t = 0; t < ticks; t++) {
    const evs = sim.step(IDLE_PAD);
    // N7B · ERST MESSEN, DANN WEGLÖSEN. Der Kreide-Treffer setzt den Rückstoß
    // und öffnet seine Boss-Karte im SELBEN Tick (sim.ts `onEntityEvent`:
    // `applyKnockback`, dann `ask`). Seit die Resume-Naht beim Kartenschluss die
    // Treffer-Sperre löscht, wäre `stun` nach einem `solveTask` in derselben
    // Schleife schon wieder 0 — der Helfer hätte den Wurf nie gesehen und die
    // Prüfungen unten hätten eine ungetroffene Welt beschrieben. Gemessen wird
    // deshalb am Treffer-Tick, während die Karte noch steht: genau der Zustand,
    // von dem die drei Fälle unten reden.
    if (sim.player.stun > 0) return true;
    // die Arena stellt unterwegs Fragen; wir lösen sie weg, damit die Welt
    // weiterläuft und die Choreografie überhaupt bis zum Wurf kommt
    for (const ev of evs) if (ev.type === "task") sim.solveTask(ev.req.ctx);
  }
  return false;
};

describe("R5-F2 · DIE HÄLFTE DES RULINGS, DIE EIN NICHT-EREIGNIS IST", () => {
  // Ein Gesetz, das lautet „hier passiert nichts", hat keinen natürlichen
  // Wächter — es sei denn, man baut ihm einen. Genau diese Hälfte würde ein
  // späteres „ich räum das mal auf" still kippen.
  it("ein Feld-Wesen fragt etwas und lässt den Körper in Ruhe", () => {
    const sim = make([chaser(24)]);
    expect(untilHit(sim), "das Wesen muss das Kind erreichen").toBe(true);
    expect(sim.player.stun, "kein Kontrollverlust").toBe(0);
    expect(sim.player.vx, "kein seitlicher Stoß").toBe(0);
    expect(sim.player.grounded, "es steht weiter auf den Brettern").toBe(true);
    expect(sim.player.pose, "…und wird auch so gezeichnet").not.toBe("hit");
    // die Unverwundbarkeit greift trotzdem — sonst fragte dasselbe Wesen
    // sechzigmal pro Sekunde
    expect(sim.player.iframes).toBe(PAINT.iframeTicks);
  });

  it("…auch beim Fahren: die Fahrt reißt nicht ab", () => {
    const sim = new Sim({
      level: level([
        chaser(24),
        { id: "ride1", role: "platform.move", skin: "ruler", c: 20, r: 14, tier: "E", params: { dxTiles: 0, periodTicks: 400 } },
      ]),
      phaseId: "p1",
      grantedAbilities: () => [],
      freedCageIds: () => [],
    });
    expect(untilHit(sim)).toBe(true);
    expect(sim.player.stun).toBe(0);
    expect(sim.player.pose).not.toBe("hit");
  });
});

describe("R5-F2 · die Kreide der Tafel stößt zurück (Ruling)", () => {
  it("ein Boss-Treffer wirkt am Körper, nicht nur an der Unverwundbarkeit", () => {
    const sim = new Sim({ level: level([tafel(30)]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    expect(untilStun(sim), "die Tafel muss das Kind treffen").toBe(true);
    expect(sim.player.pose, "der getroffene Körper trägt die Treffer-Pose").toBe("hit");
    expect(sim.player.stun, "…und ist kurz nicht steuerbar").toBeGreaterThan(0);
    expect(sim.player.grounded, "…und ist von den Brettern gehoben").toBe(false);
    expect(sim.player.vy).toBe(PAINT.knockVy);
    expect(Math.abs(sim.player.vx)).toBe(PAINT.knockVx);
    expect(sim.player.iframes).toBe(PAINT.iframeTicks);
  });

  it("der Stoß geht WEG von der Tafel — auf beiden Seiten", () => {
    // Beide Polaritäten in EINEM Test, weil genau hier der zweite, versteckte
    // Fehler saß: das Vorzeichen war verkehrt, und ein einseitiger Test wäre
    // dabei fröhlich grün geblieben.
    for (const [seite, spalte] of [["rechts", 30], ["links", 10]] as const) {
      const sim = new Sim({ level: level([tafel(spalte)]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
      expect(untilStun(sim), `Treffer von ${seite}`).toBe(true);
      const src = sim.world.entities.find((e) => e.id === "tafel")!;
      const dxPx = (src.x - sim.player.x) / SUBS;
      if (Math.abs(dxPx) < 6) continue; // senkrecht darüber: Blick entscheidet
      if (dxPx > 0) expect(sim.player.vx, "Tafel rechts ⇒ Flug nach links").toBeLessThan(0);
      else expect(sim.player.vx, "Tafel links ⇒ Flug nach rechts").toBeGreaterThan(0);
    }
  });

  it("die eingefrorene Karte zeigt den Treffer — und beim Schließen ist er frei", () => {
    const sim = new Sim({ level: level([tafel(30)]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    expect(untilStun(sim)).toBe(true);
    sim.setOverlay(true);
    for (let t = 0; t < 30; t++) sim.step(IDLE_PAD);
    expect(sim.player.pose, "solange die Karte steht, steht auch das Bild").toBe("hit");
    // N7B · DIE ZWEITE HÄLFTE DESSELBEN GESETZES. Das Bild gehört der Karte,
    // die Sperre nicht: was hier stillstand, hat der Treffer erzählt — und in
    // dem Moment, in dem die Karte weggeht, gehört der Körper wieder dem Kind.
    // Vorher lief genau hier die volle Restsperre ab (14 Ticks) plus zwei
    // Sekunden Blinken; das war Kokis „he remains in this stunned animation".
    sim.setOverlay(false);
    expect(sim.player.stun, "die Sperre endet mit der Karte").toBe(0);
    expect(sim.player.blinkTicks, "…und der Blinker auch").toBe(0);
    expect(sim.player.pose, "…und das Bild ist kein Treffer mehr").not.toBe("hit");
    expect(sim.player.iframes, "die Unverwundbarkeit selbst bleibt (sie ist Spielregel)").toBeGreaterThan(0);
  });
});

// LEBEND: der Zaun um den Zweig, der immer richtig war. Er ist der Beweis,
// dass die beiden Treffer-Pfade sich wirklich unterscheiden — und die Wache
// dafür, dass eine spätere Reparatur des Wesen-Zweigs den Gefahren-Zweig
// nicht mitnimmt.
describe("R5-F1 · der Gefahren-Pfad stößt zurück (und tat es immer)", () => {
  it("C3 · Stacheln: Rückstoß gegen den Blick, Treffer-Pose, volle i-frames", () => {
    // Stacheln direkt rechts neben dem Startfeld: derselbe Rückstoß, aber vom
    // BLICK abgeleitet (sim.ts onPlayerEvent) — dieser Zweig war immer richtig
    // und darf sich durch einen späteren Fix nicht bewegen.
    const spiked = [
      ...Array.from({ length: 14 }, () => row(".")),
      put(row("."), 20, "S"),
      put(row("#"), 22, "^"),
      row("#"),
    ];
    const sim = new Sim({ level: level([], spiked), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    let hit = false;
    for (let t = 0; t < 200 && !hit; t++) {
      sim.step({ ...IDLE_PAD, right: true });
      if (sim.player.stun > 0) hit = true;
    }
    expect(hit, "die Stacheln müssen greifen").toBe(true);
    expect(sim.player.pose).toBe("hit");
    expect(sim.player.iframes).toBe(PAINT.iframeTicks);
    // nach rechts gelaufen ⇒ Blick nach rechts ⇒ Rückstoß nach links
    expect(sim.player.vx).toBe(-PAINT.knockVx);
  });
});

// Die Zahlen, auf die sich C1–C3 stützen, kommen aus paint.ts — hier einmal
// festgehalten, damit ein Tippfehler dort nicht still durch diese Datei geht.
describe("R5-F1 · die Rückstoß-Vektoren sind die aus dem Kanon", () => {
  it("knockVx/knockVy sind gesetzt und zeigen nach oben", () => {
    expect(PAINT.knockVx).toBe(2 * SUBS);
    expect(PAINT.knockVy).toBe(-3 * SUBS);
    expect(TILE).toBe(16);
  });
});
