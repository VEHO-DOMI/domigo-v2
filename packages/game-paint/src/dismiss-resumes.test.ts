// R5-W2 · H1 · DAS WIEDERAUFNAHME-GESETZ — »Später« gibt die Welt zurück.
//
// Der Fund, der diese Datei erzwungen hat (live auf der Produktion):
//
//   `sim.ts` parkt die Tafel im Zustand `window`, sobald ihre Gegenfenster-Karte
//   aufgeht. `entities.ts` lässt diesen Zustand NICHTS tun — kein Timer, kein
//   Rückfall (anders als `stagger`, das seinen Rückfall seit jeher hat). Und
//   `dismissTask` war eine einzige Zeile: `this.overlayOpen = false;` — es hat
//   das Wesen nie wieder angefasst.
//
//   Zwei Türen führen dorthin, und die zweite braucht KEINE Kinderhand: der
//   »Später ↩«-Knopf, den jede Maschinen-Karte bedingungslos zeichnet
//   (`cards/CardShell.tsx`), und das Ablaufen der Uhr, das denselben Handler
//   von selbst ruft (`cards/CardHost.tsx`). Danach fliegt sie nie wieder,
//   wirft nie wieder, öffnet nie wieder ein Fenster — `guardianDefeated`
//   bleibt falsch, also toasten Ausgang und Käfig ihre Tore FÜR IMMER.
//   Kapitel 1 ist dann nicht mehr gewinnbar.
//
//   Das gebrochene Gesetz steht wörtlich im Code, den es bricht
//   (`PaintGame.tsx`): „the anti-softlock law (PB-T1): every task card can be
//   put down — dismissal resumes the world with no reward and no redeem."
//
// Diese Datei prüft nicht, WIE sie sich erholt, sondern DASS der Weg zum
// Sieg das Weglegen überlebt. Deshalb ist die letzte Behauptung nicht „sie
// fliegt wieder", sondern „ein ZWEITES Fenster geht wirklich auf und der
// Kampf ist danach noch zu gewinnen" — die Eigenschaft, die der Softlock
// nimmt.

import { describe, expect, it } from "vitest";
import { Sim, type TaskRequest } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import {
  CARD_OWNED_STATES,
  DODGES_PER_WINDOW,
  ENGAGEABLE_ROLES,
  GUARDIAN_SCRIPT,
  guardianKnotSolved,
  spawnEntities,
  stepEntities,
  type EntityState,
  type EntityWorld,
  type WorldInput,
} from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import { type EntityRole, type EntitySpec, type PaintLevel } from "./level.ts";

const W = 40;
const row = (fill: string): string => fill.repeat(W);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

/** Ein flacher Raum, Boden in Zeile 15, das Kind startet auf Spalte 20. */
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
  abilities: ["jump"],
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

const tafel = (c = 20, r = 10): EntitySpec => ({
  id: "tafel", role: "guardian", skin: "tafel", c, r, tier: "E", params: { knots: 3 },
});

const make = (): Sim =>
  new Sim({ level: level([tafel()]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

const guardian = (sim: Sim) => sim.world.entities.find((e) => e.role === "guardian")!;

/**
 * Öffnet ein Gegenfenster und gibt seinen ctx zurück.
 *
 * Die Ausweich-Ökonomie wird hier NICHT nachgespielt — sie ist anderswo
 * geprüft. Gesetzt wird nur der Auslöser, den `entities.ts` selbst deklariert
 * (drei Ausweicher AUS dem Flug); dip → stagger → Karte fährt die echte
 * Maschine danach allein. Genau deshalb ist der Helfer auch für das ZWEITE
 * Fenster ehrlich: er kann nichts auslösen, solange sie in `window` klebt,
 * weil der Auslöser `state === "fly"` verlangt.
 */
const openWindow = (sim: Sim, ticks = 600): TaskRequest["ctx"] | null => {
  const g = guardian(sim);
  if (g.state === "fly") g.dodges = DODGES_PER_WINDOW;
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step(IDLE_PAD)) {
      if (ev.type === "task" && ev.req.ctx.type === "guardian") return ev.req.ctx;
    }
    const g2 = guardian(sim);
    if (g2.state === "fly" && g2.dodges < DODGES_PER_WINDOW) g2.dodges = DODGES_PER_WINDOW;
  }
  return null;
};

describe("R5-W2 · H1 · »Später« auf der Boss-Karte gibt die Welt zurück", () => {
  it("ein Gegenfenster geht überhaupt auf (die Vorbedingung des Gesetzes)", () => {
    const sim = make();
    const ctx = openWindow(sim);
    expect(ctx, "die Maschine muss ein Boss-Fenster stellen").not.toBeNull();
    expect(guardian(sim).state).toBe("window");
  });

  it("SIE ERHOLT SICH: nach dem Weglegen verlässt sie `window` und fliegt wieder", () => {
    const sim = make();
    const ctx = openWindow(sim);
    expect(ctx).not.toBeNull();

    sim.dismissTask(ctx!);
    expect(guardian(sim).state, "das Weglegen selbst muss sie schon lösen").not.toBe("window");

    // ihr eigener erklärter Rückfall ist die Obergrenze — sie darf nicht länger
    // brauchen, als die Maschine für ein Aufrichten ohnehin vorsieht
    const budget = GUARDIAN_SCRIPT.E.staggerTicks + 2;
    let flew = false;
    for (let t = 0; t < budget && !flew; t++) {
      sim.step(IDLE_PAD);
      if (guardian(sim).state === "fly") flew = true;
    }
    expect(flew, `sie muss binnen ${budget} Ticks wieder fliegen`).toBe(true);
  });

  it("DER WEG ZUM SIEG ÜBERLEBT ES: ein zweites Fenster geht wirklich auf", () => {
    const sim = make();
    const first = openWindow(sim);
    expect(first).not.toBeNull();
    sim.dismissTask(first!);

    const second = openWindow(sim);
    expect(second, "nach dem Weglegen muss der Kampf weitergehen können").not.toBeNull();
    expect(guardian(sim).hp, "weggelegt heißt: kein Knoten bezahlt").toBe(GUARDIAN_SCRIPT.E.knots);
  });

  it("und der Kampf ist danach noch zu GEWINNEN — jeder Knoten weggelegt und doch besiegt", () => {
    const sim = make();
    for (let knot = 0; knot < GUARDIAN_SCRIPT.E.knots; knot++) {
      const put = openWindow(sim);
      expect(put, `Knoten ${knot + 1}: Fenster zum Weglegen`).not.toBeNull();
      sim.dismissTask(put!); // erst weglegen …

      const again = openWindow(sim);
      expect(again, `Knoten ${knot + 1}: Fenster nach dem Weglegen`).not.toBeNull();
      sim.solveTask(again!); // … dann doch lösen
    }
    expect(sim.guardianDefeated, "drei gelöste Fenster besiegen sie, auch mit »Später« dazwischen").toBe(true);
  });

  it("das Weglegen sagt dem Kind, was geschieht (ein stiller Boss liest sich als Absturz)", () => {
    const sim = make();
    const ctx = openWindow(sim);
    const events = sim.dismissTask(ctx!);
    const toasts = events.filter((e) => e.type === "toast");
    expect(toasts.length, "genau eine Zeile, keine Salve").toBe(1);
  });

  it("und die andere Tür auch: ein GELÖSTES Fenster gibt sie ebenso frei", () => {
    const sim = make();
    const ctx = openWindow(sim);
    sim.solveTask(ctx!);
    expect(guardian(sim).state, "gelöst heißt: sie fliegt weiter").not.toBe("window");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DAS SELBSTFAHR-GESETZ — die KLASSE, nicht der Einzelfall.
//
// Der Softlock oben war kein Tippfehler, sondern eine Lücke in einer Regel, die
// nirgends stand. Die Welt hat genau eine Regel über Wesen-Zustände:
//
//     Ein Zustand, den der Wesen-Takt nicht weiterdreht, muss jemand anderem
//     gehören — und der muss ihn zurückgeben.
//
// Drei Rollen halten sie sichtbar ein (`stagger` läuft ab, `burst` zieht sich
// selbst zurück, `caged`/`closed` sind mit ↑ erreichbar). `window` hielt sie
// nicht, und niemand konnte es sehen, weil die Regel nur in Kommentaren stand.
// Jetzt prüft sie eine Maschine: jeder Zustand, den das SYSTEM schreibt, fährt
// selbst — oder er steht in `CARD_OWNED_STATES` und schuldet dafür den Beweis,
// dass BEIDE Kartenausgänge ihn zurückgeben.
//
// ⚠ Grenze, ausdrücklich genannt statt verschwiegen: `redeemed` zählt hier als
// „aus dem Spiel". Ein geplatzter Käfig setzt `redeemed` SOFORT, also fällt er
// unter diese Klausel, obwohl seine Rettungs-Karte noch offen sein kann. Das
// ist eine andere Fehlerklasse (eine geschuldete Karte ohne Rückweg) und hat
// ihren eigenen Wächter — dieses Gesetz behauptet nichts darüber.
// ─────────────────────────────────────────────────────────────────────────────

const GRID: readonly string[] = [
  ...Array.from({ length: 14 }, () => row(".")),
  row("."),
  row("#"),
  row("#"),
];

const idleInput = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 20 * TILE * SUBS,
  playerY: 15 * TILE * SUBS,
  playerIframes: 0,
  playerOverlayOpen: false,
  fist: null,
  ...over,
});

/** Every (role, state) pair the SYSTEM writes, each with the `hp`/`redeemed` it
 *  was actually observed with — collected from the machine and from a real Sim,
 *  never from a hand-kept list, so a state added tomorrow is swept the day it is
 *  added.
 *
 *  The observed hp matters: planting a state without the condition the system
 *  writes it under would judge a situation that cannot happen. `consoled` only
 *  ever exists on a guardian at hp 0, and asking whether a *hp-3* guardian
 *  drives herself out of `consoled` is a question about no real boss. */
const observedPairs = (): Map<string, { hp: number; redeemed: boolean }> => {
  const seen = new Map<string, { hp: number; redeemed: boolean }>();
  const note = (w: EntityWorld): void => {
    for (const e of w.entities) seen.set(`${e.role}|${e.state}`, { hp: e.hp, redeemed: e.redeemed });
  };

  // 1 · the guardian machine, every tier through every knot.
  //
  //     The dodge trigger is planted whenever she is in level flight, for two
  //     reasons: a standing test child never dodges anything (the arc is aimed
  //     at where they stand, so every piece HITS and nothing lands), and
  //     `stagger` cannot be sampled from the Sim at all — the Sim turns it into
  //     `window` inside the same step it is written. Without this, both `dip`
  //     and `stagger` are invisible to the law, and a tamper that parks
  //     `stagger` for good sails through. Found exactly that way.
  for (const tier of ["E", "M", "S"] as const) {
    const w = spawnEntities(
      [{ id: "g", role: "guardian", skin: "tafel", c: 20, r: 10, tier, params: {} }],
      [],
    );
    for (let knot = 0; knot < GUARDIAN_SCRIPT[tier].knots; knot++) {
      for (let t = 0; t < 900; t++) {
        const g = w.entities[0]!;
        if (g.state === "fly" && g.dodges < DODGES_PER_WINDOW) g.dodges = DODGES_PER_WINDOW;
        stepEntities(w, GRID, idleInput());
        note(w);
      }
      guardianKnotSolved(w, "g");
      note(w);
    }
    for (let t = 0; t < 400; t++) { stepEntities(w, GRID, idleInput()); note(w); }
  }

  // 2 · a real Sim, noted on EVERY tick, right through a whole won fight.
  //
  //     The Sim is the only writer of the card-owned states, and the beats on
  //     the way there are short: `dip` and `stagger` are passed through in a
  //     handful of ticks each. An earlier version of this collector sampled the
  //     Sim once, at the end — so those two never entered the set, and a tamper
  //     that parked `stagger` for good sailed straight through the law. Sample
  //     every tick, or the sweep quietly stops sweeping.
  const sim = make();
  for (let knot = 0; knot < GUARDIAN_SCRIPT.E.knots; knot++) {
    let ctx: TaskRequest["ctx"] | null = null;
    for (let t = 0; t < 600 && ctx === null; t++) {
      const g = guardian(sim);
      if (g.state === "fly" && g.dodges < DODGES_PER_WINDOW) g.dodges = DODGES_PER_WINDOW;
      for (const ev of sim.step(IDLE_PAD)) {
        if (ev.type === "task" && ev.req.ctx.type === "guardian") ctx = ev.req.ctx;
      }
      note(sim.world);
    }
    expect(ctx, `die Sammlung braucht Knoten ${knot + 1} als echtes Boss-Fenster`).not.toBeNull();
    note(sim.world);
    sim.solveTask(ctx!);
    note(sim.world);
  }
  for (let t = 0; t < 400; t++) { sim.step(IDLE_PAD); note(sim.world); }

  return seen;
};

/** Plant an entity in `state` and let the world idle. Returns what moved.
 *
 *  `timer` is deliberately NOT a sign of life: `stepEntities` raises it for
 *  every entity on every tick, parked or not (entities.ts, top of the loop).
 *  Counting it would have made this whole law vacuous — every state would have
 *  „moved" and nothing could ever have gone red. Caught by the `window` probe
 *  below, which is exactly why that probe exists. */
const idleFrom = (
  role: EntityRole,
  state: string,
  as: { hp?: number; redeemed?: boolean } = {},
  ticks = 240,
): { moved: boolean; changed: boolean; entity: EntityState } => {
  const w = spawnEntities(
    [{ id: "x", role, skin: role === "guardian" ? "tafel" : "pencil", c: 20, r: 10, tier: "E", params: {} }],
    [],
  );
  const e = w.entities[0]!;
  e.state = state;
  e.timer = 0;
  if (as.hp !== undefined) e.hp = as.hp;
  if (as.redeemed !== undefined) e.redeemed = as.redeemed;
  const before = { x: e.x, y: e.y, state };
  for (let t = 0; t < ticks; t++) stepEntities(w, GRID, idleInput());
  return {
    moved: e.x !== before.x || e.y !== before.y,
    changed: e.state !== before.state,
    entity: e,
  };
};

describe("R5-W2 · H1 · DAS SELBSTFAHR-GESETZ (die Klasse hinter dem Softlock)", () => {
  it("jeder Zustand, den das System schreibt, fährt selbst — oder ist als kartengeführt DEKLARIERT", () => {
    const stranded: string[] = [];
    for (const [pair, as] of observedPairs()) {
      const [role, state] = pair.split("|") as [EntityRole, string];
      if (CARD_OWNED_STATES.has(state)) continue;      // deklariert — Pflicht siehe unten
      if (ENGAGEABLE_ROLES.has(role)) continue;         // ↑ ist der Rückweg
      if (as.hp <= 0 || as.redeemed) continue;          // aus dem Spiel
      const { moved, changed } = idleFrom(role, state, as);
      if (moved || changed) continue;                   // fährt selbst
      stranded.push(pair);
    }
    expect(stranded, "diese Zustände drehen sich nie weiter und gehören niemandem").toEqual([]);
  });

  it("`window` IST so ein Zustand — das Gesetz redet nicht über einen Sonderfall, den es nicht gibt", () => {
    // Ohne diese Behauptung wäre die Deklaration oben eine Behauptung über
    // nichts: sie muss beweisen, dass der ausgenommene Zustand die Ausnahme
    // wirklich BRAUCHT (sonst ist sie totes Wort — Gesetz 0k, hier von Hand).
    const { moved, changed } = idleFrom("guardian", "window");
    expect(moved || changed, "`window` müsste sonst gar nicht ausgenommen werden").toBe(false);
  });

  it("jeder deklarierte kartengeführte Zustand ist erreichbar (keine tote Ausnahme)", () => {
    const states = new Set([...observedPairs().keys()].map((p) => p.split("|")[1]!));
    for (const declared of CARD_OWNED_STATES) {
      expect(states.has(declared), `»${declared}« steht in CARD_OWNED_STATES, wird aber nie geschrieben`).toBe(true);
    }
  });
});
