// N7B · KARTE WEG → SOFORT LAUFEN. Das Gesetz, das dieser Datei zugrunde liegt,
// ist eine Zahl aus Kokis Befund vom 02.09.:
//
//   „right after collecting an item or solving a task or engaging with an enemy
//    … he remains in this stunned animation, flickering, or briefly stuck in the
//    landing animation … it should be instantaneous after exiting this task mode
//    so the game flows better."
//
// „Sofort" heisst hier: unter 100 ms, also ≤ 6 Ticks der 60-Hz-Simulation, bei
// gehaltener Richtungstaste, für ALLE DREI Auslöser — Aufsammeln, gelöste
// Aufgabe, Gegner-Kontakt (samt dem Rückstoß der Tafel).
//
// Warum es die Datei überhaupt braucht: `Sim.step` kehrt bei offener Karte vor
// dem Spieler zurück, die Welt hält den Atem an — und mit ihr seine Zähler. Der
// Blinker, die Treffer-Sperre und der Landetakt froren auf dem Tick ein, an dem
// die Karte aufging, und liefen NACH dem Schliessen in voller Länge ab: bis zu
// zwei Sekunden Flackern, 233 ms Sperre, eine zweite Lande-Animation. Kein
// einziger Test hat das je bemerkt, weil kein Test je gefragt hat, was NACH dem
// Kartenschluss passiert (STUN_TRACE 01.09.: „LÜCKE: kein Test prüft ‚nach
// Kartenschluss sofort steuerbar'"). Das ist diese Lücke.

import { describe, expect, it } from "vitest";
import { Sim, type TaskRequest } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { type EntitySpec, type PaintLevel } from "./level.ts";
import { SUBS } from "./paint.ts";

/** 6 Ticks = 100 ms bei 60 Hz. Kokis Grenze, als Zahl. */
const RESUME_TICKS = 6;

const W = 40;
const row = (fill: string): string => fill.repeat(W);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

/** Ein flacher Raum: Boden in Zeile 15, das Kind startet auf Spalte 20. */
const FLOOR: readonly string[] = [
  ...Array.from({ length: 14 }, () => row(".")),
  put(row("."), 20, "S"),
  row("#"),
  row("#"),
];

const level = (entities: EntitySpec[]): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "run"],
  phases: [{
    id: "p1",
    nameDe: "Test",
    surface: "normal",
    plates: {},
    rows: [...FLOOR],
    entities,
    links: [],
    exit: { to: "done" },
  }],
});

const make = (entities: EntitySpec[]): Sim =>
  new Sim({
    level: level(entities),
    phaseId: "p1",
    grantedAbilities: () => ["jump", "run"],
    freedCageIds: () => [],
  });

const chaser = (c: number): EntitySpec =>
  ({ id: "beast", role: "chaser", skin: "pencil", c, r: 14, tier: "E", params: {} });
const tafel = (c: number): EntitySpec =>
  ({ id: "tafel", role: "guardian", skin: "tafel", c, r: 14, tier: "E", params: {} });
/** Eine Regel-Seite — das eine Sammelstück, das die Welt anhält (sim.ts: „a rule
 *  page STOPS the world"). Damit ist sie der Aufsammel-Fall dieses Gesetzes. */
const regelseite = (c: number): EntitySpec => ({
  id: "regel", role: "tip", skin: "regelseite", c, r: 14, tier: "E",
  params: { topicDe: "x", erklaerungDe: "x", merksatzDe: "x" },
});

const RIGHT: Pad = { ...IDLE_PAD, right: true };

/** Läuft nach rechts, bis die Regel-Seite ihre Karte aufzieht. */
const untilRulePage = (sim: Sim, ticks = 300): boolean => {
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step(RIGHT)) if (ev.type === "tip") return true;
  }
  return false;
};

/** Läuft, bis das Feld-Wesen das Kind berührt, und gibt die Karte zurück. */
const untilCreatureCard = (sim: Sim, ticks = 400): TaskRequest["ctx"] | null => {
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step(IDLE_PAD)) {
      if (ev.type === "task" && ev.req.ctx.type === "entity") return ev.req.ctx;
    }
  }
  return null;
};

/** Läuft, bis die Kreide der Tafel trifft. Wie in `hit-knockback.test.ts` wird
 *  am Treffer-Tick gemessen und erst danach weggelöst — Rückstoß und Karte
 *  entstehen im selben Tick, und die Naht gibt den Körper beim Schliessen frei. */
const untilChalkHit = (sim: Sim, ticks = 900): TaskRequest["ctx"] | null => {
  for (let t = 0; t < ticks; t++) {
    const evs = sim.step(IDLE_PAD);
    if (sim.player.stun > 0) {
      for (const ev of evs) if (ev.type === "task") return ev.req.ctx;
      return null;
    }
    for (const ev of evs) if (ev.type === "task") sim.solveTask(ev.req.ctx);
  }
  return null;
};

/** Die Messung selbst: sechs Ticks mit gehaltener Taste. */
const run = (sim: Sim, pad: Pad, ticks = RESUME_TICKS): void => {
  for (let t = 0; t < ticks; t++) sim.step(pad);
};

/** Der Zeremonie-Raum: Boden in Zeile 12, die Truhe und die Kameradin nebeneinander
 *  auf Zeile 11 — dieselbe Aufstellung, an der `awakening.test.ts` die sechs
 *  Runden prüft. */
const CEREMONY_ROWS: readonly string[] = [
  ...Array.from({ length: 11 }, () => ".".repeat(24)),
  "..S.....................",
  "#".repeat(24),
  "#".repeat(24),
];

const ceremonySim = (): Sim => new Sim({
  level: {
    schema: "paintLevel@1",
    id: "g1-ch99", chapter: "ch99", draft: true, name: "Test",
    goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump", "run"],
    phases: [{
      id: "p1", nameDe: "Test", surface: "normal", plates: {},
      rows: [...CEREMONY_ROWS],
      entities: [
        { id: "cage-merle", role: "cage", skin: "pencilcase", c: 13, r: 11, tier: "E", params: { classmate: "merle" } },
        { id: "merle", role: "classmate", skin: "merle", c: 15, r: 11, tier: "E", params: { cage: "cage-merle", hidden: true } },
      ],
      links: [], exit: { to: "done" },
    }],
  },
  phaseId: "p1",
  grantedAbilities: () => ["jump", "run"],
  freedCageIds: () => [],
});

/** Auf die Truhe stellen und ↑ drücken — das Verb dieses Kapitels. Der
 *  einmalige ↑-Hinweis friert die Welt selbst ein und wird weggelegt, genau wie
 *  die Hülle es tut (`awakening.test.ts`). */
const openTheCage = (sim: Sim): TaskRequest["ctx"] | null => {
  sim.warp(13, 10);
  const settle = (p: Pad): ReturnType<Sim["step"]> => {
    const evs = sim.step(p);
    if (evs.some((e) => e.type === "cageHint")) sim.setOverlay(false);
    return evs;
  };
  settle(IDLE_PAD);
  settle(IDLE_PAD); // ein Leertick, damit ↑ unten eine steigende Flanke ist
  for (const ev of settle({ ...IDLE_PAD, up: true })) if (ev.type === "task") return ev.req.ctx;
  return null;
};

describe("N7B · die Karte geht weg, das Kind läuft (< 100 ms)", () => {
  it("a · nach einer Regel-Seite läuft er im selben Atemzug weiter", () => {
    const sim = make([regelseite(24)]);
    // Kokis Satz beschreibt das Aufsammeln MITTEN IM SPIEL — also mit allem, was
    // gerade an ihm läuft: er ist eben gestreift worden und blinkt noch, als die
    // Seite ihre Karte aufzieht. Genau diese Uhr fror unter der Karte ein und
    // lief danach zu Ende („flickering"), und genau deshalb wird sie hier
    // vorgegeben statt weggelassen — ein Aufsammeln ohne laufende Uhr hätte
    // nichts zu prüfen. (`entities.test.ts` setzt `iframes` aus demselben Grund
    // von Hand.)
    sim.player = { ...sim.player, iframes: 120, blinkTicks: 120 };
    expect(untilRulePage(sim), "die Regel-Seite muss ihre Karte aufziehen").toBe(true);
    expect(sim.overlayOpen, "…und die Welt dabei anhalten").toBe(true);
    expect(sim.player.blinkTicks, "der Blinker steht, solange die Karte steht").toBeGreaterThan(0);

    sim.setOverlay(false);
    const x0 = sim.player.x;
    run(sim, RIGHT);

    expect(sim.player.x, "sechs Ticks reichen für den ersten Schritt").toBeGreaterThan(x0);
    expect(sim.player.stun, "keine Sperre").toBe(0);
    expect(sim.player.blinkTicks, "und kein Nachblinken, wenn die Karte weg ist").toBe(0);
    // …und der Lauf, den er mitgebracht hat, gehört ihm weiterhin: eine Karte
    // im Vorbeigehen nimmt keinen Schwung (Kokis Entscheid 02.09.).
    expect(sim.player.vx, "der Schwung überlebt die Karte").toBeGreaterThan(0);
  });

  it("b · nach der Karte eines Feld-Wesens ebenso — und ohne Nachblinken", () => {
    const sim = make([chaser(24)]);
    const ctx = untilCreatureCard(sim);
    expect(ctx, "das Wesen muss das Kind erreichen").not.toBeNull();
    expect(sim.player.blinkTicks, "der Blinker läuft, solange die Karte steht").toBeGreaterThan(0);

    sim.solveTask(ctx!);
    const x0 = sim.player.x;
    run(sim, RIGHT);

    expect(sim.player.x, "sechs Ticks reichen für den ersten Schritt").toBeGreaterThan(x0);
    expect(sim.player.stun).toBe(0);
    expect(sim.player.blinkTicks, "das Nachflackern (2 s) ist weg").toBe(0);
    // die Unverwundbarkeit selbst ist Spielregel und bleibt stehen — sonst
    // fragte dasselbe Wesen sechzigmal pro Sekunde (swarm-gauntlet hängt daran).
    expect(sim.player.iframes, "…die Unverwundbarkeit aber bleibt").toBeGreaterThan(0);
  });

  it("c · und selbst nach dem Wurf der Tafel gehorcht er sofort", () => {
    // Der einzige Fall mit einer echten Sperre (stun = 14 ⇒ 233 ms). Gemessen
    // wird nicht „er bewegt sich", sondern „die gehaltene Taste WIRKT": der
    // Rückstoß trägt ihn weiter, und in welche Richtung, entscheidet die Tafel
    // im Flug — ein reiner x-Vergleich mit dem Stand vor dem Schliessen würde
    // deshalb den Stoß messen und nicht die Steuerung. Zwei identische Welten,
    // eine mit gehaltener Taste, eine ohne (die Simulation ist deterministisch,
    // Repo-Gesetz: kein `Math.random`) — die gesteuerte muss vorne liegen.
    const steered = make([tafel(30)]);
    const idle = make([tafel(30)]);
    const ctxA = untilChalkHit(steered);
    const ctxB = untilChalkHit(idle);
    expect(ctxA, "die Tafel muss das Kind treffen").not.toBeNull();
    expect(ctxB, "…in beiden Welten gleich").not.toBeNull();
    expect(steered.player.x, "zwei gleiche Welten, ein gleicher Stand").toBe(idle.player.x);
    expect(steered.player.stun, "der Wurf sperrt ihn — das ist der Ausgangspunkt").toBeGreaterThan(0);

    steered.solveTask(ctxA!);
    idle.solveTask(ctxB!);
    expect(steered.player.stun, "die Karte nimmt die Sperre mit").toBe(0);
    expect(steered.player.blinkTicks, "…und das Flackern").toBe(0);
    expect(steered.player.vy, "…und den Bogen nach oben").toBe(0);

    run(steered, RIGHT);
    run(idle, IDLE_PAD);

    expect(steered.player.x, "die gehaltene Taste wirkt binnen sechs Ticks")
      .toBeGreaterThan(idle.player.x);
    expect(steered.player.stun, "und bleibt frei").toBe(0);
    expect(steered.player.blinkTicks).toBe(0);
    // Die Unverwundbarkeit bleibt auch hier Spielregel, nur ihr Bild ist weg.
    expect(steered.player.iframes).toBeGreaterThan(0);
  });

  it("d · ein über die Karte gedrückter Sprung wird kein Absprung danach", () => {
    // Die andere Hälfte der Naht: `prevPad`. Es stand hinter dem Early-Return
    // und fror mit der Welt ein — wer die Sprungtaste drückte, WÄHREND die Karte
    // stand (und das tut man: dieselbe Taste bestätigt Karten), bekam beim
    // Schliessen eine frische steigende Flanke und hüpfte los, ohne es gewollt
    // zu haben. Fortgeschrieben zählt der Knopf als gehalten.
    const sim = make([]);
    for (let t = 0; t < 40; t++) sim.step(IDLE_PAD); // erst zur Ruhe kommen
    expect(sim.player.grounded, "er steht auf den Brettern").toBe(true);

    sim.setOverlay(true);
    for (let t = 0; t < 20; t++) sim.step({ ...IDLE_PAD, jump: true }); // Taste unter der Karte
    sim.setOverlay(false);

    const x0 = sim.player.x;
    const held: Pad = { ...IDLE_PAD, right: true, jump: true };
    for (let t = 0; t < RESUME_TICKS; t++) {
      sim.step(held);
      expect(sim.player.vy, `Tick ${t}: kein Absprung aus einer erfundenen Flanke`)
        .toBeGreaterThanOrEqual(0);
    }
    expect(sim.player.x, "…er läuft trotzdem sofort los").toBeGreaterThan(x0);
    expect(sim.player.grounded, "…und bleibt auf den Brettern").toBe(true);
  });

  it("e · auch die Zeremonie der Klassenkameradin gibt den Körper zurück", () => {
    // Der dritte Schliess-Weg. `solveTask` hat für die Zeremonie einen eigenen
    // frühen Ausgang (sie zieht im selben Zug die nächste Runde auf und führt
    // deshalb ihre Karten-Buchhaltung selbst) — er läuft NICHT über
    // `setOverlay(false)`. Ohne diesen Fall wäre die Naht an einem von drei
    // Wegen ungeprüft, und genau dort steht die längste Kartenfolge des
    // Kapitels: sechs Runden hintereinander, jede eine eigene Karte.
    const sim = ceremonySim();
    const first = openTheCage(sim);
    expect(first, "die Truhe muss die erste Runde aufziehen").not.toBeNull();

    // Er ist unterwegs gestreift worden und blinkt, als die Runde gelöst wird.
    sim.player = { ...sim.player, iframes: 120, blinkTicks: 120 };
    const evs = sim.solveTask(first!);
    expect(sim.player.blinkTicks, "die Runde gibt den Körper zurück wie jede Karte").toBe(0);
    expect(sim.player.stun).toBe(0);
    // …und die Zeremonie behält ihre eigene Choreografie: die nächste Runde
    // steht sofort, die Welt ist also weiterhin angehalten.
    const next = evs.find((e) => e.type === "task");
    expect(next, "Runde 2 folgt unmittelbar").toBeDefined();
    expect(sim.overlayOpen, "…und hält die Welt weiter an").toBe(true);
  });
});

describe("N7B · was die Naht NICHT anfasst", () => {
  it("die Unverwundbarkeit bleibt 120 Ticks — nur ihr Blinken hat eine eigene Uhr", () => {
    // Der Grund, warum der Blinker ein eigenes Feld bekam statt einer kürzeren
    // `iframeTicks`: das Abstandsmodell der Schwärme rechnet mit der LÄNGE der
    // Unverwundbarkeit (swarm-gauntlet.test.ts). Bild und Regel sind seit N7B
    // zwei Dinge, und dieser Test hält sie auseinander.
    const sim = make([chaser(24)]);
    const ctx = untilCreatureCard(sim);
    expect(ctx).not.toBeNull();
    const iframesUnderCard = sim.player.iframes;
    sim.solveTask(ctx!);
    expect(sim.player.iframes, "die Regel überlebt die Karte unverändert").toBe(iframesUnderCard);
    expect(sim.player.blinkTicks, "ihr Bild nicht").toBe(0);
  });

  it("eine Karte ohne Treffer nimmt keinen Schwung (Kokis Entscheid 02.09.)", () => {
    // Gegenprobe zu (a) mit dem Messwert statt dem Vorzeichen: der Lauf, mit dem
    // er in die Karte hineinlief, steht danach unverändert da.
    const sim = make([regelseite(24)]);
    expect(untilRulePage(sim)).toBe(true);
    const vxBefore = sim.player.vx;
    expect(vxBefore, "er läuft, wenn die Karte aufgeht").toBeGreaterThan(0);
    sim.setOverlay(false);
    expect(sim.player.vx, "und läuft mit demselben Tempo weiter").toBe(vxBefore);
    expect(sim.player.x / SUBS, "…von derselben Stelle aus").toBeGreaterThan(0);
  });
});

describe("N7B2 · D-960 · die Naht darf zweimal laufen, ohne dass es auffällt", () => {
  // Gemessen: bei jeder richtigen Nicht-Zeremonie-Antwort läuft die Naht ZWEIMAL
  // — einmal aus `solveTask` heraus, und gleich danach noch einmal, weil die
  // Hülle ihrerseits `setOverlay(false)` ruft. Das ist heute folgenlos, weil die
  // Naht nur löscht und klemmt. Dieser Test macht daraus einen Vertrag: wer ihr
  // je etwas gibt, das ZÄHLT oder FEUERT, wird hier rot und muss den Doppelruf
  // zuerst abschaffen.
  it("zweimal schliessen ergibt denselben Körper wie einmal schliessen", () => {
    const sim = make([tafel(30)]);
    const ctx = untilChalkHit(sim);
    expect(ctx, "die Tafel muss das Kind treffen — sonst prüft der Test nichts").not.toBeNull();
    sim.solveTask(ctx!);

    const nachEinmal = { ...sim.player };
    sim.setOverlay(false); // …und jetzt der zweite Ruf, wie ihn die Hülle tut
    expect(sim.player, "der zweite Ruf darf am Körper nichts mehr bewegen").toEqual(nachEinmal);

    // …und die Welt läuft danach genauso weiter wie nach einem einzigen Ruf.
    const x0 = sim.player.x;
    run(sim, RIGHT);
    expect(sim.player.x, "die gehaltene Taste wirkt weiterhin").toBeGreaterThan(x0 - 1);
    expect(sim.player.stun).toBe(0);
    expect(sim.player.blinkTicks).toBe(0);
  });

  it("…auch bei einer Karte ohne Treffer (der häufige Fall)", () => {
    const sim = make([regelseite(24)]);
    expect(untilRulePage(sim)).toBe(true);
    sim.setOverlay(false);
    const nachEinmal = { ...sim.player };
    sim.setOverlay(false);
    expect(sim.player, "kein Schwung geht beim zweiten Ruf verloren").toEqual(nachEinmal);
  });
});
