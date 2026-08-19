// R5-W4 · B4 · R44 — DER STILLE ANKER, in beide Richtungen bewiesen.
//
// Koki, 15.08.2026, über die Krakel-Staffeleien: »so wie sie platziert sind,
// machen sie keinen Sinn, gequetscht neben die Gegner. Jetzt komplett raus,
// später besprechen wir, wo sie hingehören.«
//
// »Komplett raus« heißt hier NICHT »ausgebaut«: der `C`-Glyph bleibt, das
// Warp-Ziel bleibt, alle vier `checkpoint-*`-Gesetze bleiben. Nur SEHEN soll man
// nichts. Ein Test, der bloß beweist, dass nichts passiert, wäre wertlos — er
// wäre auch grün, wenn die Checkpoints ganz kaputt wären. Deshalb misst jeder
// Block hier ein A/B: dieselbe Welt, einmal `silent`, einmal `krakel`, und die
// Zahl MUSS sich bewegen. Ein Tamper, der nichts verändert, beweist nichts.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { checkLevelLaws, type PaintLevel, type PhaseSpec, parsePaintLevel } from "./level.ts";
import { SUBS, TILE } from "./paint.ts";
import { INK_SPLASH_TICKS } from "./ink.ts";

const WIDE = 40;
const row = (fill: string): string => fill.repeat(WIDE);
const put = (base: string, at: number, glyph: string): string => base.slice(0, at) + glyph + base.slice(at + 1);

const STAND_R = 17; // the walking row; the floor sits at 18/19
const SPAWN_C = 3;
const ANCHOR_C = 8;
const INK_C = 12;

/** A flat corridor with a checkpoint at c8 and an ink pool at c12–13. */
const corridorRows = (): string[] => {
  let air = row(".");
  air = put(air, SPAWN_C, "S");
  air = put(air, ANCHOR_C, "C");
  air = put(air, INK_C, "w");
  air = put(air, INK_C + 1, "w");
  air = put(air, WIDE - 4, "X");
  return [row("#"), ...Array.from({ length: 16 }, () => row(".")), air, row("#"), row("#")];
};

// R5-W5 · B4b: der Korridor trägt sein `C` bei c8 und die Tinte bei c12–13, das
// Fixture ist also von Anfang an ein „near"-Aufbau — es hätte unter dem alten
// Gesetz (nur „far" erlaubt) nie bestehen können. Deshalb ist `"near"` hier die
// Vorgabe: die bestehenden Prüfungen behalten ihre Absicht und werden dabei
// zusätzlich legal. Die Seite ist Parameter, weil der Block ganz unten sie variiert.
const level = (style: PaintLevel["checkpointStyle"], rows = corridorRows(), side: PhaseSpec["checkpointSide"] = "near"): PaintLevel => ({
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
  ...(style === undefined ? {} : { checkpointStyle: style }),
  phases: [{ id: "p1", nameDe: "Test", surface: "normal", plates: {}, rows, entities: [], links: [], exit: { to: "done" }, ...(side === undefined ? {} : { checkpointSide: side }) }],
});

const simFor = (style: PaintLevel["checkpointStyle"]): Sim =>
  new Sim({ level: level(style), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

/** Walk right for `ticks` and keep every event. */
const walk = (sim: Sim, ticks: number): SimEvent[] => {
  const pad: Pad = { ...IDLE_PAD, right: true };
  const all: SimEvent[] = [];
  for (let i = 0; i < ticks; i++) all.push(...sim.step(pad));
  return all;
};

const krakelToasts = (evs: SimEvent[]): SimEvent[] => evs.filter((e) => e.type === "toast" && /Krakel/.test(e.msg));
const colOf = (sim: Sim): number => Math.floor(sim.player.x / SUBS / TILE);

describe("R44 · der stille Anker sagt nichts …", () => {
  it("TAMPER-PAAR: dieselbe Welt sagt 0-mal »Krakel« still und 1-mal laut", () => {
    // This is the whole proof. If the silent run alone were asserted, the test
    // would also pass on a build where checkpoints never fire at all.
    const silent = krakelToasts(walk(simFor("silent"), 200)).length;
    const loud = krakelToasts(walk(simFor("krakel"), 200)).length;

    expect(silent, "eine stille Kammer feiert nichts").toBe(0);
    expect(loud, "…und dieselbe Welt mit Zeremonie feiert genau einmal").toBe(1);
    expect(loud).toBeGreaterThan(silent); // the number MOVED
  });

  it("ein Kapitel ohne Erklärung behält die Zeremonie, die es immer hatte", () => {
    // ch02–ch04 declare nothing yet and must not go quiet behind Koki's back.
    expect(krakelToasts(walk(simFor(undefined), 200)).length).toBe(1);
  });
});

describe("… und ankert trotzdem", () => {
  it("der Anker wandert auf die Checkpoint-Spalte, ob still oder laut", () => {
    for (const style of ["silent", "krakel"] as const) {
      const sim = simFor(style);
      expect(sim.respawnCell?.c, `${style}: Startanker`).toBe(SPAWN_C);
      walk(sim, 90); // far enough to pass c8, not far enough to reach the ink
      expect(sim.respawnCell?.c, `${style}: der Anker hat gefasst`).toBe(ANCHOR_C);
    }
  });

  it("die Rückkehr aus der Tinte landet am stillen Anker, nicht am Start", () => {
    const sim = simFor("silent");
    const pad: Pad = { ...IDLE_PAD, right: true };
    // Measured ON the splash tick, not at the end of the walk: the warp hands
    // out iframes, so a child that keeps holding right simply wades through the
    // pool the second time and ends up east of it. Reading the column 400 ticks
    // later would have measured that, not the return.
    let splashed = false;
    for (let i = 0; i < 400 && !splashed; i++) {
      splashed = sim.step(pad).some((e) => e.type === "toast" && e.msg === "Platsch!");
    }
    expect(splashed, "die Tinte spricht weiter").toBe(true);
    // R44 changed how the anchor SHOWS itself, not what it catches.
    expect(colOf(sim)).toBe(ANCHOR_C);
    expect(colOf(sim)).not.toBe(SPAWN_C);
  });
});

// ── Das Gesetz: Stille muss ERKLÄRT sein ────────────────────────────────────
describe("R44 · checkpoint-silent", () => {
  const lawsOf = (lvl: PaintLevel): string[] => checkLevelLaws(parsePaintLevel(lvl)).map((f) => f.law);
  const shipped = (style: PaintLevel["checkpointStyle"]): PaintLevel =>
    parsePaintLevel({ ...level(style), draft: false });

  it("ein Kapitel mit `C` und ohne Erklärung fällt durch", () => {
    const f = checkLevelLaws(shipped(undefined)).find((x) => x.law === "checkpoint-silent");
    expect(f, "die offene Frage ist der Verstoß").toBeDefined();
    expect(f!.detail).toMatch(/p1.*declares no checkpointStyle/);
  });

  it("beide Antworten sind gültige Antworten", () => {
    for (const style of ["silent", "krakel"] as const) {
      expect(lawsOf(shipped(style)), style).not.toContain("checkpoint-silent");
    }
  });

  it("ein Kapitel ganz ohne Checkpoint muss nichts erklären", () => {
    const noC = corridorRows().map((r) => r.replace("C", "."));
    expect(lawsOf(parsePaintLevel({ ...level(undefined, noC), draft: false }))).not.toContain("checkpoint-silent");
  });

  it("ein getippter Stil ist ein lauter Fehler, keine stille Zeremonie", () => {
    // The failure mode this guards: `"quiet"` would fall through the enum and the
    // easels would come back, with the level file looking configured.
    expect(() => parsePaintLevel(level("quiet" as PaintLevel["checkpointStyle"]))).toThrow(/checkpointStyle/);
  });

  it("das ausgelieferte ch01 erklärt sich", () => {
    const shippedLevel = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
        "utf8",
      ),
    ) as PaintLevel;
    expect(shippedLevel.checkpointStyle).toBe("silent");
  });
});

// ── Die Render-Hälfte ───────────────────────────────────────────────────────
// A grid law cannot see a GameObject, and this repo has no headless Phaser. So
// the scene's half is policed the way the other untestable surfaces are
// (treasure-render.test.ts, ent-size.test.ts): read the source, and — the part
// that matters — assert the drawing code is still THERE. A silence achieved by
// deleting the art would make every check above vacuous and would throw away
// the one-word road back that R44 explicitly keeps open.
describe("R44 · die Szene fragt den Stil, statt ihn zu erraten", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "PaintScene.ts"), "utf8");

  /** The `C` arm of buildProps' glyph chain, up to the next `else if`/close. */
  const checkpointArm = (): string => {
    const at = src.indexOf('} else if (g === "C"');
    if (at < 0) throw new Error("der C-Zweig ist weg — dieser Test ist blind, nicht grün");
    const end = src.indexOf("\n        }\n      }\n    }", at);
    if (end < 0) throw new Error("der C-Zweig schließt nicht — Test blind");
    return src.slice(at, end);
  };

  it("VAKUITÄT: alle drei Zeichen-Arme stehen noch da", () => {
    const arm = checkpointArm();
    expect(arm).toContain("pb-krakel_a"); // the painted body
    expect(arm).toContain("pb-checkpoint_easel"); // the legacy fallback
    expect(arm).toContain("add.graphics()"); // …and the procedural pole-and-pennant
    expect(arm.length).toBeGreaterThan(600);
  });

  it("der Zeichen-Zweig hängt am Stil", () => {
    expect(src).toContain('} else if (g === "C" && this.checkpointsDrawn) {');
  });

  it("…und das Aktiv-Licht ebenso", () => {
    expect(src).toContain("if (this.checkpointsDrawn && this.checkpointImgs.size > 0");
  });

  it("der Schalter liest das Level und entscheidet nichts selbst", () => {
    expect(src).toContain('return this.cfg.level.checkpointStyle !== "silent";');
    // exactly one place decides it, so a second opinion cannot drift from the first
    expect([...src.matchAll(/checkpointStyle/g)].length).toBe(1);
  });
});

// ── R5-W5 · B4b · D-186 — DER SPRITZER BLEIBT IM BILD ───────────────────────
//
// A6b hat den Beweis für den Tinten-Spritzer nicht führen können, und der Grund
// war nicht der Spritzer: der Warp nahm im AUSLÖSE-TICK auch die Sicht mit zum
// Anker, während der Spritzer dort entsteht, wo das Kind hineinfiel. Er war
// gebaut, unit-belegt, deterministisch — und in keiner Aufnahme zu sehen.
//
// Der Fehler ist ENTFERNUNGSABHÄNGIG (so steht er in D-186: »nur sichtbar, wenn
// der Checkpoint nahe am Teich liegt«), und genau deshalb liegt die Tinte in
// diesem Korridor WEIT östlich des Ankers. Ein Fixture mit vier Kacheln Abstand
// wäre auch mit der sanften Kamerafahrt grün geworden und hätte nichts geprüft.
describe("R5-W5 · B4b · D-186 · die Kamera hält am Spritzer", () => {
  const FERN_INK_C = 30; // 22 Kacheln östlich des Ankers c8

  const weitRows = (): string[] => {
    let air = row(".");
    air = put(air, SPAWN_C, "S");
    air = put(air, ANCHOR_C, "C");
    air = put(air, FERN_INK_C, "w");
    air = put(air, FERN_INK_C + 1, "w");
    air = put(air, WIDE - 4, "X");
    return [row("#"), ...Array.from({ length: 16 }, () => row(".")), air, row("#"), row("#")];
  };
  const weitSim = (): Sim =>
    new Sim({ level: level("silent", weitRows()), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });

  /** Nach rechts laufen, bis die Tinte spricht. Zurück kommt die Kamera, wie sie
   *  im Tick VOR dem Spritzer stand — der Wert, der sich nicht bewegen darf. */
  const bisPlatsch = (sim: Sim): number => {
    const pad: Pad = { ...IDLE_PAD, right: true };
    let camVorher = sim.camX;
    for (let i = 0; i < 900; i++) {
      camVorher = sim.camX;
      if (sim.step(pad).some((e) => e.type === "toast" && e.msg === "Platsch!")) return camVorher;
    }
    throw new Error("die Tinte hat in 900 Ticks nicht gesprochen — Fixture kaputt");
  };

  it("★ A/B AUF DEM AUSLÖSE-TICK: der Halt lässt die Sicht stehen, der Vorgabe-Warp nimmt sie mit", () => {
    // Die Beweislast dieses Blocks. Nur (a) zu prüfen wäre auch auf einem Build
    // grün, dessen Kamera überhaupt nicht mehr folgt — deshalb steht (b) daneben
    // und die Zahl MUSS sich bewegen (dieselbe Disziplin wie im R44-Paar oben).
    const sim = weitSim();
    const camVorher = bisPlatsch(sim);
    expect(colOf(sim), "das Kind ist am Anker").toBe(ANCHOR_C);
    // (a) die Sicht ist NICHT mitgesprungen
    expect(sim.camX, "die Kamera steht, wo der Spritzer entsteht").toBe(camVorher);
    // (b) …und derselbe Warp ohne Halt nimmt sie sehr wohl mit
    sim.warp(ANCHOR_C, STAND_R);
    expect(Math.abs(sim.camX - camVorher), "der Vorgabe-Warp springt").toBeGreaterThan(10 * TILE * SUBS);
  });

  it("die Haltezeit IST die Lebensdauer des Spritzers — eine Zahl, nicht zwei", () => {
    // Wird die Spritzer-Kunst je kürzer oder länger, darf die Regie nicht
    // auseinanderlaufen: eine getippte 8 hier wäre eine Kamera, die abfährt,
    // während noch Tropfen fliegen.
    const sim = weitSim();
    bisPlatsch(sim);
    expect(sim.camHoldTicks).toBeGreaterThanOrEqual(INK_SPLASH_TICKS - 1);
    expect(sim.camHoldTicks).toBeLessThanOrEqual(INK_SPLASH_TICKS);
  });

  it("es ist ein HALT, kein Standbild: danach zieht die Sicht zum Kind nach", () => {
    const sim = weitSim();
    const camVorher = bisPlatsch(sim);
    // stillstehen, damit das Kamera-Ziel stabil ist (nach dem Warp hat das Kind
    // iframes und würde weiterlaufend durch die Tinte waten)
    for (let i = 0; i < INK_SPLASH_TICKS - 1; i++) sim.step(IDLE_PAD);
    expect(sim.camX, "während der Spritzer lebt: unverändert").toBe(camVorher);
    for (let i = 0; i < 3; i++) sim.step(IDLE_PAD);
    expect(sim.camX, "danach fährt sie nach").not.toBe(camVorher);
    expect(sim.camHoldTicks, "der Halt ist abgelaufen").toBe(0);
  });

  it("★ DER HALT HEBT DEN RÜCKWEG NICHT AUF — die Bildschirm-Klammer schweigt so lange", () => {
    // Der Fehler, den erst der LIVE-Lauf gefunden hat, und der Grund, dass die
    // Klammer in `step` jetzt eine Bedingung trägt. Die drei Prüfungen oben
    // waren alle grün, während das Kind einen Tick nach dem Platsch an den
    // rechten Rand der GEHALTENEN Sicht gezogen wurde — über das Becken, aus dem
    // es gerade gerettet worden war — und von dort fiel. Gemessen in p2: Warp
    // auf x=936, einen Tick später x=724 (= camX 408 + 320 − 4), dann freier Fall.
    //
    // Ein Tick reicht als Prüfung NICHT: auf dem Auslöse-Tick läuft die Klammer
    // VOR dem Warp (step: Klammer, dann onPlayerEvent), der Wert stimmt dort also
    // auch im kaputten Zustand. Der Fehler zeigt sich ab dem Tick DANACH.
    const sim = weitSim();
    bisPlatsch(sim);
    expect(colOf(sim), "auf dem Auslöse-Tick am Anker").toBe(ANCHOR_C);
    for (let i = 0; i < INK_SPLASH_TICKS + 6; i++) sim.step(IDLE_PAD);
    expect(colOf(sim), "…und auch nach dem ganzen Halt noch dort").toBe(ANCHOR_C);
    expect(sim.player.grounded, "auf festem Boden, nicht im Fall").toBe(true);
  });

  it("der Vorgabe-Warp schnappt weiter — die Aufnahme-Tür bleibt, wie sie war", () => {
    // `window.__domigoPaint.warp(c, r)` (shoot-world --warp) und jeder andere
    // Aufrufer sollen nichts merken: der Halt ist die benannte Ausnahme.
    const sim = weitSim();
    const vorher = sim.camX;
    sim.warp(WIDE - 8, STAND_R);
    expect(sim.camX, "die Sicht ist mitgekommen").not.toBe(vorher);
    expect(sim.camHoldTicks, "und kein Halt wurde gesetzt").toBe(0);
  });
});

// ── R5-W5 · B4b · WELCHE SEITE DER SCHWELLE? (Kokis Entscheid 2026-08-17) ────
//
// Bis zu dieser Welle stand im Gesetz eine Himmelsrichtung: der Anker gehört auf
// das FERNE Ufer, „never before it". Koki hat das am 17.08. an gemessenen Zahlen
// zurückgedreht — aber nicht umgedreht, sondern zur DEKLARATION gemacht, weil die
// richtige Antwort an der Breite der Querung hängt (p1 zwei Spalten, p2 einunddreissig).
//
// Was diese Prüfungen schützen, ist deshalb nicht eine Seite, sondern dass BEIDE
// Seiten je nur an ihrer eigenen Bank gelten. Der tragende Fall ist der zweite:
// derselbe Korridor, dieselbe Anker-Zelle, nur die Deklaration getauscht — einmal
// grün, einmal rot. Ohne ihn wäre „near ist erlaubt" auch auf einem Gesetz grün,
// das gar nichts mehr prüft.
describe("R5-W5 · B4b · checkpoint-placement kennt zwei Seiten", () => {
  const lawsOf = (lvl: PaintLevel): string[] => checkLevelLaws(parsePaintLevel(lvl)).map((f) => f.law);
  const detailOf = (lvl: PaintLevel): string | undefined =>
    checkLevelLaws(parsePaintLevel(lvl)).find((f) => f.law === "checkpoint-placement")?.detail;
  /** derselbe Korridor, aber das `C` steht wo man will */
  const rowsWithC = (at: number): string[] => corridorRows().map((r) => {
    if (!r.includes("C")) return r;
    const ohne = put(r, ANCHOR_C, ".");
    return put(ohne, at, "C");
  });
  const mit = (at: number, side: PhaseSpec["checkpointSide"]): PaintLevel =>
    ({ ...level("silent", rowsWithC(at), side), draft: false });

  it("VAKUITÄT: das Fixture ist ein near-Aufbau — Anker c8, Tinte c12–13", () => {
    expect(ANCHOR_C).toBe(8);
    expect(INK_C).toBe(12);
    expect(ANCHOR_C).toBeLessThan(INK_C);
  });

  it("★ DIESELBE ZELLE, ZWEI DEKLARATIONEN: near grün, far rot", () => {
    // Der ganze Beweis in einem Paar. Die Welt ist identisch; nur das Wort im
    // Level wechselt, und das Urteil MUSS mitwechseln.
    expect(lawsOf(mit(8, "near")), "near: der Anker steht am Absprung").not.toContain("checkpoint-placement");
    expect(lawsOf(mit(8, "far")), "far: derselbe Anker liegt jetzt auf der falschen Seite").toContain("checkpoint-placement");
    expect(detailOf(mit(8, "far"))).toMatch(/declares checkpointSide "far"/);
  });

  it("★ und spiegelbildlich am fernen Ufer: far grün, near rot", () => {
    expect(lawsOf(mit(15, "far")), "far: hinter der Tinte c12–13").not.toContain("checkpoint-placement");
    expect(lawsOf(mit(15, "near")), "near: 15 liegt nicht am Absprung").toContain("checkpoint-placement");
    expect(detailOf(mit(15, "near"))).toMatch(/declares checkpointSide "near"/);
  });

  it("die Entfernung gilt auf BEIDEN Seiten — ein Anker im Nebenzimmer zählt nicht", () => {
    // CHECKPOINT_AFTER_MAX ist 4, und gezählt wird von der BANK, nicht von der
    // Tinte: Absprung-Ufer ist c12 (die erste Tinten-Spalte), near reicht also
    // von c8 bis c11. Landendes Ufer ist c13, far reicht von c14 bis c17.
    expect(lawsOf(mit(8, "near")), "c8: die äusserste erlaubte Spalte").not.toContain("checkpoint-placement");
    expect(lawsOf(mit(7, "near")), "c7: eine Spalte zu weit").toContain("checkpoint-placement");
    expect(lawsOf(mit(17, "far")), "c17: die äusserste erlaubte Spalte").not.toContain("checkpoint-placement");
    expect(lawsOf(mit(18, "far")), "c18: zu weit hinter dem Ufer").toContain("checkpoint-placement");
  });

  it("KEINE Deklaration ist ein lauter Fehler, keine stille Vorgabe", () => {
    // Dieselbe Lehre wie bei `checkpointStyle` (R44): ein späterer Leser muss
    // Absicht von Verrutschen unterscheiden können. Eine stille Vorgabe „far"
    // hätte p1 und p3 nach diesem Entscheid heimlich wieder falsch gestellt.
    //
    // Das Feld wird hier GELÖSCHT und nicht als `undefined` übergeben: ein
    // Vorgabewert im Parameter (`side = "near"`) fängt ein übergebenes
    // `undefined` ab, und dieser Test hat genau daran zuerst falsch grün gezeigt.
    const roh = { ...level("silent", rowsWithC(8)), draft: false };
    const ohneFeld: PaintLevel = {
      ...roh,
      phases: roh.phases.map((p) => {
        const kopie: Record<string, unknown> = { ...p };
        delete kopie.checkpointSide;
        return kopie as unknown as PhaseSpec;
      }),
    };
    expect(ohneFeld.phases[0]!.checkpointSide, "das Feld ist wirklich weg").toBeUndefined();
    expect(lawsOf(ohneFeld)).toContain("checkpoint-placement");
    expect(checkLevelLaws(parsePaintLevel(ohneFeld)).find((f) => f.law === "checkpoint-placement")!.detail)
      .toMatch(/declares no checkpointSide/);
  });

  // R5-W6b · B5 (Kokis Entscheid 2026-08-19): p2 wechselt von „far" auf „near".
  // WAS DIE ZAHL GEDREHT HAT — P5s Durchlauf vom 18.08. und eine Nachmessung im
  // Sim: mit dem fernen Anker bankt ein Kind, das NIE hinübergekommen ist, gar
  // nichts, also greift immer der Phasenanfang. Gemessen an derselben Stelle
  // (Sturz c37,8): **35,3 Spalten Rückweg vorher, 14,3 nachher**. Die alte
  // Begründung hier („ein West-Anker würde den Motten-Lauf wiederholen") verglich
  // gegen einen Zustand, den es nicht gibt: der ferne Anker ist beim Fehlversuch
  // noch nicht gebankt, also wiederholt HEUTE jeder Fehltritt den ganzen Raum.
  it("★ das AUSGELIEFERTE ch01: p1 near · p2 near · p3 near, und kein Verstoß", () => {
    const shipped = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
      "utf8",
    )) as PaintLevel;
    const sideOf = (id: string): string | undefined => shipped.phases.find((p) => p.id === id)?.checkpointSide;
    expect(sideOf("p1"), "Grube 2 Spalten: der Sprung wird am Sprung wiederholt").toBe("near");
    expect(sideOf("p2"), "Becken 31 Spalten: der Rückweg fällt von 35,3 auf 14,3 Spalten").toBe("near");
    expect(sideOf("p3"), "Tal 10 Spalten").toBe("near");
    expect(checkLevelLaws(parsePaintLevel(shipped)).map((f) => f.law)).not.toContain("checkpoint-placement");
  });
});
