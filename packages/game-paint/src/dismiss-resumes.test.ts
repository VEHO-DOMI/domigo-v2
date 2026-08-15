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
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Sim, type TaskRequest } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import {
  CARD_OWNED_STATES,
  DODGES_PER_WINDOW,
  ENGAGEABLE_ROLES,
  GUARDIAN_SCRIPT,
  WIPE_TICKS,
  guardianKnotSolved,
  spawnEntities,
  stepEntities,
  wipeWaitTicksFor,
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

/**
 * R5-W4 · H2 (Ruling R50) · DAS KIND GEHT HIN — und zwar mit den FÜSSEN.
 *
 * Seit R50 macht eine beantwortete Karte die Tafel nicht mehr sauber: sie setzt
 * sich auf die Bretter, und erst die Berührung nimmt eine Kritzel-Schicht weg.
 * Jeder Bogen, der hier vorher mit `solveTask` endete, braucht deshalb diesen
 * zweiten Schritt.
 *
 * Gedrückt wird eine echte Richtungstaste, nicht eine gesetzte Position: der
 * Weg ist die halbe Mechanik, und ein Helfer, der das Kind neben sie BEAMT,
 * würde genau die Frage überspringen, die dieser Umbau stellt („kommt ein Kind
 * überhaupt rechtzeitig an?"). Gibt zurück, ob eine Schicht wirklich fiel.
 */
const walkAndWipe = (sim: Sim, ticks = 900): boolean => {
  for (let t = 0; t < ticks; t++) {
    const g = guardian(sim);
    if (g.state !== "settle" && g.state !== "wipeable" && g.state !== "wipe") {
      // sie wartet nicht (mehr) — entweder ist die Schicht schon weg oder die
      // Wartezeit ist abgelaufen. Beides ist eine Antwort, kein Hängen.
      if (t > 0) return g.state !== "untie" || g.hp < GUARDIAN_SCRIPT.E.knots;
    }
    const toRight = g.x > sim.player.x;
    for (const ev of sim.step({ ...IDLE_PAD, left: !toRight, right: toRight })) {
      if (ev.type === "guardianDown") return true;
      if (ev.type === "toast" && /Kritzel-Schicht/.test(ev.msg)) return true;
    }
  }
  return false;
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
      sim.solveTask(again!); // … dann doch lösen …
      expect(walkAndWipe(sim), `Knoten ${knot + 1}: hingehen und wischen`).toBe(true); // … und wischen
    }
    expect(sim.guardianDefeated, "drei gewischte Schichten besiegen sie, auch mit »Später« dazwischen").toBe(true);
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
// DER RÜCKWEG ZUM KÄFIG — dieselbe Klasse, das andere Wesen.
//
// Ein Käfig setzt `redeemed`, sobald der DECKEL abgeht — er muss, sonst spielt
// das Aufspringen nicht hinter der Tinten-Blende, die unter einem Halt läuft,
// der nur erlöste Wesen weiterdreht. Und `burst` wird nach CAGE_OPEN_TICKS von
// allein zu `open`, ob jemand geantwortet hat oder nicht. Beide Marken, die
// nach »fertig« aussehen, heißen in Wahrheit »der Deckel ist ab«.
//
// `engageTargetId` überspringt erlöste Wesen. Also ließ »Später« auf der
// Rettungs-Karte den Käfig offen, unbeantwortet und FÜR IMMER unerreichbar —
// sein Insasse schuldete eine Karte, die ↑ nicht mehr stellen konnte. Ein
// Klassenkind-Käfig ist aus Versehen sicher (er übergibt an die Zeremonie, und
// `awakenAsk` ist deren erklärter Rückweg); die vier Ding-Käfige hatten keinen,
// und in einem davon hängt das Klassenfoto, um das es im ganzen Kapitel geht.
// ─────────────────────────────────────────────────────────────────────────────

const CAGE_ROOM: readonly string[] = [
  ...Array.from({ length: 14 }, () => row(".")),
  put(row("."), 20, "S"),
  row("#"),
  row("#"),
];

const cageLevel = (): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99", chapter: "ch99", draft: true, name: "Test",
  goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump"],
  phases: [{
    id: "p1", nameDe: "Test", surface: "normal", plates: {},
    rows: [...CAGE_ROOM],
    entities: [{ id: "cage5", role: "cage", skin: "satchel", c: 20, r: 14, tier: "E", params: { captiveDe: "das Klassenfoto" } }],
    links: [], exit: { to: "done" },
  }],
});

/** ↑ drücken und die Rettungs-Karte einsammeln, falls eine kommt.
 *
 *  Getippt statt gehalten, und wiederholt: ↑ ist eine steigende Flanke, und
 *  direkt nach dem Aufspringen läuft noch der kurze Öffnungs-Halt, in dem die
 *  Welt keine Eingabe annimmt. Ein einzelner Druck auf Tick 0 fällt genau da
 *  hinein — was beim Schreiben dieses Tests erst wie der Bug aussah und keiner
 *  war (der Halt endet nach CAGE_OPEN_TICKS von selbst). Ein Kind tippt eben
 *  noch einmal. */
const pressUp = (sim: Sim, ticks = 90): TaskRequest["ctx"] | null => {
  let found: TaskRequest["ctx"] | null = null;
  for (let t = 0; t < ticks; t++) {
    for (const ev of sim.step({ ...IDLE_PAD, up: t % 2 === 0 })) {
      if (ev.type === "task" && ev.req.ctx.type === "cage") found = ev.req.ctx;
    }
    if (found) return found;
  }
  return found;
};

describe("R5-W2 · H1 · »Später« am Käfig sperrt den Insassen nicht aus", () => {
  const make5 = (): Sim =>
    new Sim({ level: cageLevel(), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

  it("↑ öffnet den Käfig und stellt seine Karte (die Vorbedingung)", () => {
    const sim = make5();
    expect(pressUp(sim), "der Käfig muss überhaupt fragen").not.toBeNull();
  });

  it("DER RÜCKWEG: weggelegt, und ↑ stellt dieselbe Karte noch einmal", () => {
    const sim = make5();
    const first = pressUp(sim);
    expect(first).not.toBeNull();
    sim.dismissTask(first!);

    const again = pressUp(sim);
    expect(again, "ohne Rückweg hinge das Klassenfoto für immer im offenen Käfig").not.toBeNull();
  });

  it("und danach fragt er NICHT mehr — ein beantworteter Käfig schuldet nichts", () => {
    const sim = make5();
    const first = pressUp(sim);
    sim.solveTask(first!);
    expect(pressUp(sim), "gelöst heißt gelöst").toBeNull();
  });

  it("ein KLASSENKIND-Käfig bekommt keinen zweiten Rückweg — er hat schon einen", () => {
    // Die Ausnahme in `cageOwesCard` ist keine Höflichkeit: ein Käfig mit
    // Klassenkind übergibt beim Aufspringen an ihre Zeremonie und stellt seine
    // eigene Rettungs-Karte NIE. Ohne die Ausnahme bliebe er ewig „schuldig"
    // und ↑ an ihm würde eine Käfig-Karte stellen statt ihrer Runde — zwei
    // Rettungen für ein Wesen. Ein Tamper, der die Ausnahme streicht, muss
    // hier rot werden, sonst ist sie totes Wort.
    const mateLevel: PaintLevel = {
      schema: "paintLevel@1",
      id: "g1-ch99", chapter: "ch99", draft: true, name: "Test",
      goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump"],
      phases: [{
        id: "p1", nameDe: "Test", surface: "normal", plates: {},
        rows: [...CAGE_ROOM],
        entities: [
          { id: "cage-merle", role: "cage", skin: "pencilcase", c: 20, r: 14, tier: "E", params: { classmate: "merle" } },
          { id: "merle", role: "classmate", skin: "merle", c: 22, r: 14, tier: "E", params: { cage: "cage-merle", hidden: true } },
        ],
        links: [], exit: { to: "done" },
      }],
    };
    const sim = new Sim({ level: mateLevel, phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

    // aufspringen lassen und die erste Runde einsammeln
    let asked: TaskRequest["ctx"] | null = null;
    for (let t = 0; t < 90 && asked === null; t++) {
      for (const ev of sim.step({ ...IDLE_PAD, up: t % 2 === 0 })) {
        if (ev.type === "task") asked = ev.req.ctx;
      }
    }
    expect(asked?.type, "der Käfig übergibt an ihre Zeremonie").toBe("classmate");
    sim.dismissTask(asked!);

    // ↑ am KÄFIG darf jetzt keine Käfig-Karte stellen
    let again: TaskRequest["ctx"] | null = null;
    for (let t = 0; t < 90 && again === null; t++) {
      for (const ev of sim.step({ ...IDLE_PAD, up: t % 2 === 0 })) {
        if (ev.type === "task") again = ev.req.ctx;
      }
    }
    expect(again?.type, "der Rückweg des Klassenkinds ist ihre Runde, nicht die Käfig-Karte").not.toBe("cage");
  });

  it("der Rückweg spielt die Blende nicht noch einmal (das Aufspringen war schon)", () => {
    const sim = make5();
    const first = pressUp(sim);
    sim.dismissTask(first!);
    for (let t = 0; t < 40; t++) sim.step(IDLE_PAD); // den Öffnungs-Halt auslaufen lassen
    const before = sim.holdTicks;
    pressUp(sim);
    expect(sim.holdTicks, "kein zweiter Tinten-Iris").toBe(before);
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
      // R5-W4 · H2 (R50): die Antwort setzt sie nur noch auf die Bretter. Das
      // Kind geht hin — sonst fällt keine Schicht, sie steigt wieder auf, und
      // die Endzustände dieser Maschine (`sink`/`sad`/`consoled`) blieben der
      // Sammlung für immer verborgen. Genau die Blindheit, gegen die dieser
      // Sammler geschrieben wurde.
      for (let t = 0; t < 1200; t++) {
        const g = w.entities[0]!;
        if (g.state !== "settle" && g.state !== "wipeable" && g.state !== "wipe") break;
        stepEntities(w, GRID, idleInput({ playerX: g.x, playerY: g.y }));
        note(w);
      }
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
    // …und hin zu ihr, mit echten Tasten (R5-W4 · H2)
    for (let t = 0; t < 1200; t++) {
      const g = guardian(sim);
      if (g.state !== "settle" && g.state !== "wipeable" && g.state !== "wipe") break;
      const toRight = g.x > sim.player.x;
      sim.step({ ...IDLE_PAD, left: !toRight, right: toRight });
      note(sim.world);
    }
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
/** Wie lange die Probe hinschaut — HERGELEITET, nicht getippt (R5-W4 · H2).
 *
 *  240 Ticks reichten, solange der langsamste selbstfahrende Zustand ein
 *  `stagger` von 90 Ticks war. `wipeable` wartet auf das KIND, und die Wartezeit
 *  ist die Zeit, die ein gehendes Kind für die Bühne braucht — in diesem
 *  Prüfraum über 500 Ticks. Mit dem alten Horizont hätte diese Probe einen
 *  Zustand als »gestrandet« gemeldet, der sich sehr wohl selbst weiterdreht:
 *  ein Wächter, der zu kurz hinsieht, erfindet Fehler, und ein Wächter, der
 *  Fehler erfindet, wird übergangen. Die Zahl kommt deshalb aus derselben
 *  Funktion wie die Wartezeit — verlängert jemand das Warten, wächst die Probe
 *  mit. */
const IDLE_PROBE_TICKS = wipeWaitTicksFor({ params: {} }, GRID) + WIPE_TICKS + 2;

const idleFrom = (
  role: EntityRole,
  state: string,
  as: { hp?: number; redeemed?: boolean } = {},
  ticks = IDLE_PROBE_TICKS,
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

// ── R5-W2 · H1 (Teil 2) · DER KAMPF IST OHNE EINE EINZIGE TASTE ZU GEWINNEN ──
//
// Der Fund, den diese Datei erzwungen hat, hatte einen Zwilling im selben
// Fenster, und der stand ebenfalls live:
//
//   Die Überreiz-Zählung („drei geworfene Stücke bringen sie herunter") wurde an
//   EINEM Ende gezählt — wenn ein Stück den Boden erreicht. Ein Kind, das stehen
//   bleibt, steht aber genau im Ziel: JEDES Stück trifft, KEINES erreicht je die
//   Bretter. GEMESSEN am echten Sim im ausgelieferten Raum: 53 Würfe, 53
//   Treffer, NULL Fenster in 200 Sekunden, hp unverändert. Kapitel 1 war für ein
//   Kind, das sich nicht bewegt, nicht zu gewinnen.
//
//   Das Gesetz dagegen gab es längst (entities.test.ts, ANTI-SOFTLOCK) — es lief
//   nur im falschen Raum: sein Testboden liegt auf der Flughöhe der Tafel, wo
//   Kreide auf den Brettern zerbricht, bevor sie ein Kind erreichen kann.
//
// Deshalb steht die Behauptung hier in ihrer stärksten Form: nicht „ein Fenster
// geht auf", sondern „der Kampf ist ZU ENDE zu spielen" — und zwar mit einem
// leeren Gamepad im AUSGELIEFERTEN Raum.
describe("R5-W2 · H1 · ein Kind, das stehen bleibt, kann den Kampf gewinnen", () => {
  const shipped = (): PaintLevel =>
    JSON.parse(
      readFileSync(
        resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
        "utf8",
      ),
    ) as PaintLevel;

  /** Spielt die Arena mit einem Pad, das nie gedrückt wird. Fenster-Karten
   *  werden gelöst, Treffer-Karten weggelegt — genau das, was ein Kind kann,
   *  das die Tastatur nicht anfasst. */
  const playStandingStill = (): { defeated: boolean; ticks: number; windows: number; hits: number } => {
    const level = shipped();
    const sim = new Sim({
      level, phaseId: "p4",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
    let windows = 0;
    let hits = 0;
    let t = 0;
    for (; t < 20000 && !sim.guardianDefeated; t++) {
      for (const ev of sim.step(IDLE_PAD)) {
        if (ev.type !== "task") continue;
        if (ev.req.ctx.type === "guardian") { sim.solveTask(ev.req.ctx); windows++; } else { sim.dismissTask(ev.req.ctx); hits++; }
        sim.setOverlay(false);
      }
    }
    return { defeated: sim.guardianDefeated, ticks: t, windows, hits };
  };

  /** Dasselbe Kind, aber es GEHT — und mehr kann es nicht: keine Sprungtaste,
   *  kein Rennen, nur ←/→, und die nur dann, wenn die Tafel auf den Brettern
   *  auf es wartet. Das ist die Fähigkeit, die dieses Kapitel auf dem allerersten
   *  Bildschirm lehrt. */
  const playWalkingOnly = (): { defeated: boolean; ticks: number; windows: number; wipes: number } => {
    const level = shipped();
    const sim = new Sim({
      level, phaseId: "p4",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
    let windows = 0;
    let wipes = 0;
    let t = 0;
    for (; t < 20000 && !sim.guardianDefeated; t++) {
      const g = sim.world.entities.find((e) => e.role === "guardian")!;
      const waiting = g.state === "wipeable" || g.state === "settle";
      const toRight = g.x > sim.player.x;
      const pad = waiting ? { ...IDLE_PAD, left: !toRight, right: toRight } : IDLE_PAD;
      for (const ev of sim.step(pad)) {
        if (ev.type === "toast" && /Kritzel-Schicht/.test(ev.msg)) wipes++;
        if (ev.type !== "task") continue;
        if (ev.req.ctx.type === "guardian") { sim.solveTask(ev.req.ctx); windows++; } else { sim.dismissTask(ev.req.ctx); }
        sim.setOverlay(false);
      }
    }
    return { defeated: sim.guardianDefeated, ticks: t, windows, wipes };
  };

  it("ein Kind, das GEHT, gewinnt — die Fähigkeit, die der erste Bildschirm lehrt", () => {
    // ── R5-W4 · H2 · WAS SICH AN DIESEM GESETZ GEÄNDERT HAT (Ruling R50) ────
    // H1 hat hier einen gemessenen Defekt geschlossen: ein stehendes Kind konnte
    // Kapitel 1 nicht gewinnen (53 Würfe, 53 Treffer, 0 Fenster). Das Gesetz
    // hiess deshalb „ohne je eine Richtung zu drücken".
    //
    // Koki hat die Mechanik am 15.08. verändert: „wenn sie unten ist und man zu
    // ihr geht, wird gelöscht." Damit ist HINGEHEN Teil der Aufgabe, und ein
    // Kind, das die Tastatur gar nicht anfasst, gewinnt nicht mehr — nicht durch
    // einen Defekt, sondern durch eine Entscheidung.
    //
    // Der Boden, den dieses Gesetz schützt, wandert deshalb mit: er liegt jetzt
    // bei GEHEN. Kein Sprung, kein Rennen, kein Timing — nur ←/→, die erste und
    // einzige Fähigkeit, die die Arena voraussetzt (arena.md §1: „kein run als
    // Pflicht"). Genau danach ist auch die Wartezeit bemessen (wipeWaitTicksFor
    // rechnet mit walkMax, nicht mit runMax).
    const r = playWalkingOnly();
    expect(r.defeated, "die Tafel wird nie besiegt — der Kampf ist eine Sackgasse").toBe(true);
    expect(r.windows, "jede Schicht braucht ihr eigenes beantwortetes Fenster")
      .toBe(GUARDIAN_SCRIPT.E.knots);
    expect(r.wipes, "…und jede beantwortete Karte braucht ihr Wischen")
      .toBe(GUARDIAN_SCRIPT.E.knots - 1); // die letzte meldet sich als Sieg, nicht als Toast
  });

  it("ein Kind, das stehen bleibt, steckt trotzdem NIE fest", () => {
    // Die zweite Hälfte des alten Gesetzes, und sie gilt unverändert: der Preis
    // fürs Nicht-Hingehen ist, dass die Schicht stehen bleibt — nie, dass die
    // Welt stehen bleibt. Sie hebt wieder ab, das nächste Fenster kommt, und das
    // Kind kann sich jederzeit umentscheiden. Ein Zustand ohne Rückweg wäre
    // genau der Softlock, den H1 hier ausgegraben hat.
    const r = playStandingStill();
    expect(r.defeated, "ohne Hingehen fällt keine Schicht").toBe(false);
    expect(r.windows, "aber die Fenster kommen weiter — der Kampf lebt")
      .toBeGreaterThan(GUARDIAN_SCRIPT.E.knots);
  });

  it("und Ausweichen bleibt trotzdem die bessere Antwort", () => {
    // Sonst wäre die Reparatur eine Einladung, stehen zu bleiben. Der Preis des
    // Stehenbleibens sind die Treffer-Karten: jede unterbricht den Kampf und
    // löst KEINEN Knoten (sim.ts `encounter` sagt das wörtlich).
    const r = playStandingStill();
    expect(r.hits, "ohne Preis wäre Stehenbleiben gratis").toBeGreaterThan(0);
  });
});

// ── R5-W2 · H1 (Teil 2) · DER SIEG-BOGEN SPIELTE IN EINEM LEEREN RAUM ────────
//
// Drei Dinge trafen zusammen: `guardianDown` setzte KEINE Haltezeit (anders als
// der berstende Käfig, der seine seit jeher hat); die Karte, die den Beat
// beschreibt, geht sofort auf; und eine offene Karte hält die ganze Welt an.
// Also sank die Tafel erst, NACHDEM Finale- und Konsolen-Karte wieder zu waren.
// Das Kind las „…und sie blüht sonnengelb auf", während sie noch in der Luft
// hing — und die Karte deklariert dabei ihr eigenes Ruhe-Bild (`tafel_rest`).
//
// Dazu kommt Kokis Tor vom 14.08.: der Ausgang wartet aufs Klassenfoto.
describe("R5-W2 · H1 · die Landung wird gesehen, und der Ausgang wartet aufs Foto", () => {
  const shipped = (): PaintLevel =>
    JSON.parse(
      readFileSync(
        resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
        "utf8",
      ),
    ) as PaintLevel;

  const arena = (): Sim => {
    const level = shipped();
    return new Sim({
      level, phaseId: "p4",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
    });
  };

  /** Spielt bis zum Sieg und lässt die Karte danach OFFEN — genau die Lage, in
   *  der der Beat bisher verschluckt wurde.
   *
   *  Die letzte Karte wird NICHT geschlossen, und das ist kein Detail: genau so
   *  verhält sich der echte Shell. Auf `guardianDown` geht sofort die
   *  Finale-Karte auf, der Schleier bleibt also oben — und `setOverlay(false)`
   *  würde die Haltezeit löschen. Ein Test, der hier schliesst, prüft einen
   *  Ablauf, den kein Kind je erlebt. */
  const winAndHold = (): Sim => {
    const sim = arena();
    let won = false;
    for (let t = 0; t < 20000 && !won; t++) {
      // R5-W4 · H2 (R50): der Sieg beginnt nicht mehr am Kartenrand, sondern an
      // der Tafel. Das Kind geht hin, sobald sie wartet — mit echten Tasten,
      // denn der Weg IST seit dieser Welle die halbe Mechanik.
      const g0 = sim.world.entities.find((e) => e.role === "guardian")!;
      const waiting = g0.state === "wipeable" || g0.state === "settle";
      const toRight = g0.x > sim.player.x;
      const pad = waiting ? { ...IDLE_PAD, left: !toRight, right: toRight } : IDLE_PAD;
      for (const ev of sim.step(pad)) {
        if (ev.type === "guardianDown") { won = true; break; } // die Karte BLEIBT offen
        if (ev.type !== "task") continue;
        if (ev.req.ctx.type === "guardian") sim.solveTask(ev.req.ctx); else sim.dismissTask(ev.req.ctx);
        sim.setOverlay(false);
      }
    }
    expect(sim.guardianDefeated, "der Lauf hat die Tafel nie besiegt").toBe(true);
    // …und der Shell hebt SOFORT die Finale-Karte. `solveTask` selbst räumt
    // `overlayOpen` ab, also muss der Schleier hier ausdrücklich wieder hoch —
    // sonst prüfte dieser Test eine offene Welt und wäre hohl. (Er WAR hohl:
    // der Tamper lief glatt durch, bis diese Zeile stand.)
    sim.setOverlay(true);
    return sim;
  };

  it("sie kommt zur Ruhe, WÄHREND die Karte offen ist — nicht erst danach", () => {
    const sim = winAndHold();
    const g = () => sim.world.entities.find((e) => e.role === "guardian")!;
    expect(g().state, "direkt nach dem Sieg sinkt sie").toBe("sink");
    for (let t = 0; t < 600 && g().state !== "consoled"; t++) sim.step(IDLE_PAD);
    expect(g().state, "hinter der offenen Karte ist der ganze Bogen gelaufen").toBe("consoled");
  });

  it("und sie liegt am Ende wirklich AUF etwas — nicht in der Luft", () => {
    // Nicht „tiefer als vorher": sie kann auf einem Kreide-Kisten-Podest zur
    // Ruhe kommen, dessen Oberkante HÖHER liegt als die Tiefe, auf die der Dip
    // sie zieht. Die Behauptung, die den Beat trägt, ist deshalb „ihre Füsse
    // stehen auf der ersten festen Fläche unter ihr", und die wird aus den
    // ausgelieferten Zeilen gelesen.
    const sim = winAndHold();
    const g = () => sim.world.entities.find((e) => e.role === "guardian")!;
    for (let t = 0; t < 600 && g().state !== "consoled"; t++) sim.step(IDLE_PAD);

    const rows = shipped().arena!.rows;
    const col = Math.floor(g().x / SUBS / TILE);
    const feetRow = Math.round(g().y / SUBS / TILE);
    expect(rows[feetRow]?.[col], `sie ruht über Zeile ${feetRow}, und da ist nichts`).toBe("#");
    expect(rows[feetRow - 1]?.[col], "sie steckt in der Masse statt darauf").not.toBe("#");
  });

  it("KOKIS TOR: der Ausgang bleibt zu, solange das Klassenfoto hängt", () => {
    // Beide Richtungen in einem Test, nach dem Muster von proof-tapes.test.ts:
    // ein Tor, das immer zu ist, ist genauso kaputt wie eines, das immer offen
    // ist. (Die Boss-Phase ist von jenem Muster ausgenommen — „that exit is the
    // fight's to open" — also gab es für sie bisher gar keine solche Prüfung.)
    const walkOntoExit = (freeTheCage: boolean): boolean => {
      const sim = arena();
      for (const e of sim.world.entities) if (e.role === "guardian") e.hidden = true;
      (sim as unknown as { guardianDefeated: boolean }).guardianDefeated = true;
      if (freeTheCage) for (const e of sim.world.entities) if (e.role === "cage") { e.freed = true; e.redeemed = true; }
      sim.warp(sim.exitCell.c, sim.exitCell.r);
      for (let t = 0; t < 240; t++) {
        for (const ev of sim.step(IDLE_PAD)) if (ev.type === "exit") return true;
      }
      return false;
    };
    expect(walkOntoExit(false), "der Ausgang ging auf, obwohl das Foto noch im Käfig hängt").toBe(false);
    expect(walkOntoExit(true), "der Ausgang blieb zu, obwohl das Foto frei ist — das Tor sperrt").toBe(true);
  });

  it("…und das Tor gilt NUR in der Boss-Phase (p1–p3 bleiben Lehr-Räume)", () => {
    // Ein Tor über alle Phasen wäre eine viel grössere Entscheidung als die, die
    // getroffen wurde — p1 bis p3 dürfen ihre Käfige liegen lassen.
    const level = shipped();
    for (const ph of level.phases) {
      if (!(ph.entities ?? []).some((e) => e.role === "cage")) continue;
      const sim = new Sim({ level, phaseId: ph.id, grantedAbilities: () => [...level.abilities], freedCageIds: () => [] });
      for (const d of (ph.entities ?? []).filter((e) => e.role === "door.trigger" && e.params?.kind === "exit")) {
        sim.solveTask({ type: "door", id: d.id, kind: String(d.params?.kind ?? "exit"), skin: d.skin });
      }
      for (const e of sim.world.entities) if (e.role === "powerup") e.redeemed = true;
      sim.warp(sim.exitCell.c, sim.exitCell.r);
      let out = false;
      for (let t = 0; t < 240 && !out; t++) {
        for (const ev of sim.step(IDLE_PAD)) if (ev.type === "exit") out = true;
      }
      expect(out, `${ph.id}: der Käfig-Riegel darf hier gar nicht greifen`).toBe(true);
    }
  });
});
