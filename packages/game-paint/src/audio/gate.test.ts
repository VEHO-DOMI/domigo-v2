/**
 * R5-W7 · S3 · D-372 — DER TORSCHLUSS, DURCH DEN ECHTEN SIMULATOR GEFAHREN.
 *
 * WARUM ES DIESE DATEI GIBT. Bis Welle 7 hing der Klang des Torschlusses am
 * WORTLAUT der Meldung, die das Tor auslöst. Diese Runde hängt ihn an ein
 * eigenes Ereignis (`SimEvent` → `gate`). Der Umbau hat eine Eigenschaft, die
 * kein Diff und kein Schirmbild zeigt: **er kann still danebengehen.** Ein
 * vergessenes `events.push` an einer der fünf Stellen sieht aus wie eine Zeile
 * weniger und klingt wie nichts.
 *
 * `tape-audio.test.ts` kann das nicht auffangen: die aufgezeichneten Piloten
 * laufen den kürzesten Weg zum Ausgang und stossen an KEIN einziges Tor (auf
 * allen fünf Bändern: null `gate`-Ereignisse). Also fährt diese Datei den
 * Simulator selbst in jede der fünf Sperren und misst, was dabei herauskommt —
 * das Ereignis, seinen Klang, und dass er genau EINMAL je Anlauf kommt.
 *
 * Gemessen wird an `mapEvent`, also an genau der Entscheidung, die diese Runde
 * verdrahtet hat; ein echter Direktor bräuchte eine Tonmaschine und bewiese nur,
 * dass eine Attrappe zurückgibt, was man ihr beigebracht hat (dieselbe
 * Begründung wie in `tape-audio.test.ts`).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Sim, type GateReason, type SimEvent } from "../sim.ts";
import type { PaintLevel } from "../level.ts";
import { IDLE_PAD, type Pad } from "../player.ts";
import { LOGICAL_W, TILE, toSubs } from "../paint.ts";
import { cameraTargetX, clampScroll } from "../camera.ts";
import { mapEvent } from "./director.ts";

const CONTENT = path.resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint");
const level = JSON.parse(fs.readFileSync(path.join(CONTENT, "ch01.level.json"), "utf8")) as PaintLevel;

const mkSim = (phaseId: string, abilities: readonly string[] = ["jump", "run"]): Sim =>
  new Sim({
    level,
    phaseId,
    grantedAbilities: () => [...abilities],
    freedCageIds: () => [],
  });

/**
 * Das Kind an eine Stelle setzen — MIT der Sicht.
 *
 * Ohne die zweite Zeile geht dieser Test scheinbar durch und misst nichts: die
 * Bildschirm-Klammer (`sim.ts:615`) zieht ein Kind, das ausserhalb der aktuellen
 * Sicht steht, im selben Takt an den Bildrand zurück — gemessen beim ersten
 * Anlauf hier: gesetzt auf x = 1000, nach einem Takt bei x = 316, und `checkExit`
 * sah nie einen Ausgang. Die Sicht wird deshalb mitgesetzt, genau wie es der
 * Simulator im Konstruktor selbst tut (`sim.ts:547`).
 */
const placeAt = (sim: Sim, xPx: number, yPx: number): void => {
  sim.player.x = toSubs(xPx);
  sim.player.y = toSubs(yPx);
  sim.player.vx = 0;
  sim.player.vy = 0;
  sim.camX = clampScroll(cameraTargetX(sim.player.x, sim.player.facing), sim.worldWpx, LOGICAL_W);
};

/** …und zwar dorthin, wo `checkExit` misst. */
const standAtExit = (sim: Sim): void =>
  placeAt(sim, sim.exitCell.c * TILE + TILE / 2, (sim.exitCell.r + 1) * TILE);

const pad = (over: Partial<Pad> = {}): Pad => ({ ...IDLE_PAD, ...over });

const gatesIn = (evs: readonly SimEvent[]): Extract<SimEvent, { type: "gate" }>[] =>
  evs.filter((e): e is Extract<SimEvent, { type: "gate" }> => e.type === "gate");

/**
 * Was der Direktor aus diesem Schwung Ereignisse WIRKLICH spielen würde.
 *
 * Geprüft wird hier immer nur der TORSCHLUSS-Beat, nie der ganze Takt: im selben
 * Augenblick dürfen andere Dinge klingen, und sie tun es auch — in p1 hebt die
 * Tür ihre Karte (`card-open`), in p4 läuft die Arena-Anleitung (`arena-brief`).
 * Das ist kein Doppelklang, sondern zwei verschiedene Sachen, die gleichzeitig
 * passieren. Eine Zusicherung auf den ganzen Takt hätte diese Datei an echtem
 * Spielverhalten scheitern lassen und wäre danach aufgeweicht worden.
 */
const soundsOf = (evs: readonly SimEvent[]): string[] =>
  evs
    .map((e) => mapEvent("sim", e.type, e as unknown as Record<string, unknown>).stem)
    .filter((s): s is string => s !== null);

const countOf = (evs: readonly SimEvent[], stem: string): number => soundsOf(evs).filter((s) => s === stem).length;

/**
 * Einen Takt am Ausgang fahren — und eine Karte, die dabei aufgeht, wieder
 * ablegen. Ohne das hält die Welt den Atem an (`sim.step` kehrt bei offener
 * Karte sofort zurück), die Sperre zählt nicht herunter, und ein Test über
 * „einmal je Anlauf" misst eine Uhr, die steht. Denselben Handgriff macht der
 * Abspiel-Shell in `tape.ts` an genau dieser Stelle.
 */
const stepAtExit = (sim: Sim, over: Partial<Pad> = {}): SimEvent[] => {
  standAtExit(sim);
  const evs = sim.step(pad(over));
  if (evs.some((e) => e.type === "task")) sim.setOverlay(false);
  return evs;
};

describe("D-372 · die fünf Tore feuern ihr Ereignis", () => {
  /**
   * Tor 1 · das Pflicht-Powerup. ch01 vergibt keines (`abilities` = jump/run,
   * kein `powerup`-Entity in keiner der fünf Flächen — K6 hat es am Artefakt
   * nachgemessen), also ist dieses Tor im GANZEN Kapitel unerreichbar. Der
   * Code-Pfad ist trotzdem da, weil das Gesetz kapitelübergreifend gilt — und
   * ein Pfad, den kein Test je betritt, ist der, in dem ein Tippfehler wohnt.
   * Deshalb wird das Entity hier gestellt, und der Test sagt beides.
   */
  it("Tor 1 · das vergessene Pflicht-Stück (in ch01 nur gestellt, es gibt keins)", () => {
    const echt = new Set(
      [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])]
        .flatMap((p) => p.entities ?? [])
        .filter((e) => e.role === "powerup" && e.params?.essential === true)
        .map((e) => e.id),
    );
    expect([...echt], "ch01 hat plötzlich ein Pflicht-Powerup — dann gehört dieses Tor ins Band, nicht in eine Attrappe").toEqual([]);

    const sim = mkSim("p1");
    sim.world.entities.push({
      ...sim.world.entities[0]!,
      id: "pruef-pflichtstueck",
      role: "powerup",
      params: { essential: true },
      redeemed: false,
    });
    const evs = stepAtExit(sim);
    expect(gatesIn(evs).map((g) => g.reason)).toEqual(["powerup"]);
    expect(countOf(evs, "gate-waits")).toBe(1);
  });

  /**
   * R5-W8 · S4 · P7 §12.7 — UND ES NENNT SEINE SACHE.
   *
   * Der Befund von End-Urteil III: vier der fünf Torschluss-Sätze sagen, WAS
   * hakt; Tor 1 sagte nur, dass etwas fehlt. Der Name kommt jetzt vom DING
   * (`params.gabeDe`, dasselbe Muster wie `captiveDe` am Käfig).
   *
   * Zwei Fälle, weil es zwei gibt — und der zweite ist der, an dem ein Shell
   * sonst still »undefined« ausliefert.
   */
  it("Tor 1 · nennt die Sache, sobald das Level sie benennt", () => {
    const sim = mkSim("p1");
    sim.world.entities.push({
      ...sim.world.entities[0]!,
      id: "pruef-pflichtstueck",
      role: "powerup",
      params: { essential: true, gabeDe: "die Faust" },
      redeemed: false,
    });
    const toast = stepAtExit(sim).find((e): e is Extract<SimEvent, { type: "toast" }> => e.type === "toast");
    expect(toast?.msg).toBe("Du hast noch etwas Wichtiges vergessen — die Faust liegt noch in diesem Raum!");
  });

  it("Tor 1 · und fällt DEKLARIERT auf den alten Satz zurück, wenn es keinen Namen gibt", () => {
    const sim = mkSim("p1");
    sim.world.entities.push({
      ...sim.world.entities[0]!,
      id: "pruef-pflichtstueck",
      role: "powerup",
      params: { essential: true },
      redeemed: false,
    });
    const toast = stepAtExit(sim).find((e): e is Extract<SimEvent, { type: "toast" }> => e.type === "toast");
    expect(toast?.msg).toBe("Du hast noch etwas Wichtiges vergessen!");
  });

  it("Tor 2 · die Tür wartet auf ihr Wort", () => {
    const sim = mkSim("p1");
    const evs = stepAtExit(sim);
    expect(gatesIn(evs).map((g) => g.reason)).toEqual(["tuerwort"]);
    expect(countOf(evs, "gate-waits")).toBe(1);
  });

  it("Tor 3 · die Tafel ist noch voller Kritzel", () => {
    const sim = mkSim("p4");
    const evs = stepAtExit(sim);
    expect(gatesIn(evs).map((g) => g.reason)).toEqual(["tafel"]);
    expect(countOf(evs, "gate-waits")).toBe(1);
  });

  /**
   * Tor 4 · das Klassenfoto. Es war bis zu dieser Runde das einzige der vier,
   * das GAR NICHT klang: sein Satz wird aus dem Level gebaut („Das Klassenfoto
   * hängt noch im Käfig!") und passte deshalb auf kein Textmuster. Genau
   * deshalb steht hier eine eigene Zusicherung darauf, dass es klingt.
   */
  it("Tor 4 · das Klassenfoto hängt noch im Käfig — und klingt zum ersten Mal", () => {
    const sim = mkSim("p4");
    sim.guardianDefeated = true; // sonst greift Tor 3 zuerst
    const evs = stepAtExit(sim);
    expect(gatesIn(evs).map((g) => g.reason)).toEqual(["klassenfoto"]);
    expect(countOf(evs, "gate-waits")).toBe(1);
  });

  /**
   * Tor 5 · der Käfig selbst. Er kommt nicht aus `checkExit`, sondern aus dem
   * Käfig: solange die Tafel steht, ist der Deckel zu. Er bekommt dasselbe
   * Ereignis (ein Käfig-Tor ist ein Tor) und ist der einzige, der BEWUSST
   * schweigt — dieser Augenblick klingt schon als `cage-locked`.
   */
  it("Tor 5 · der Käfig wartet auf die Tafel — Ereignis ja, zweiter Klang nein", () => {
    const sim = mkSim("p4");
    const cage = sim.world.entities.find((e) => e.role === "cage");
    expect(cage, "p4 hat keinen Käfig mehr — dann ist dieser Test blind").toBeDefined();
    placeAt(sim, cage!.x / 256, cage!.y / 256);
    const evs = sim.step(pad({ up: true }));
    expect(gatesIn(evs).map((g) => g.reason)).toEqual(["cageGated"]);
    expect(countOf(evs, "gate-waits"), "der Käfig-Torschluss klingt zweimal — cage-locked trägt den Beat schon").toBe(0);
    expect(mapEvent("entity", "cageGated", { id: cage!.id }).stem).toBe("cage-locked");
  });
});

describe("D-372 · was am Torschluss NICHT passieren darf", () => {
  it("der Toast daneben schweigt — sonst klänge derselbe Augenblick zweimal", () => {
    const sim = mkSim("p1");
    const evs = stepAtExit(sim);
    const toasts = evs.filter((e) => e.type === "toast");
    expect(toasts.length, "das Tor sagt nichts mehr — das Kind sähe nur eine geschlossene Tür").toBe(1);
    expect(mapEvent("sim", "toast", toasts[0] as unknown as Record<string, unknown>).stem).toBeNull();
    // …und das Ereignis darauf ist genau EIN Klang, nicht zwei.
    expect(countOf(evs, "gate-waits")).toBe(1);
    expect(countOf(evs, "toast"), "der leise Toast-Tick klingt zusätzlich zum Torschluss").toBe(0);
  });

  it("einmal je Anlauf: der zweite Versuch innerhalb der Sperre ist still", () => {
    const sim = mkSim("p1");
    expect(gatesIn(stepAtExit(sim))).toHaveLength(1);

    // 100 Takte weiter am Ausgang stehen bleiben — die Sperre läuft 120.
    let weitere = 0;
    for (let i = 0; i < 100; i++) weitere += gatesIn(stepAtExit(sim)).length;
    expect(weitere, "der Torschluss klingt pro Bild statt pro Anlauf").toBe(0);

    // …und nach Ablauf der Sperre wieder genau einmal: ein Kind, das eine
    // Minute später noch einmal anläuft, soll die Antwort wieder hören.
    for (let i = 0; i < 30; i++) weitere += gatesIn(stepAtExit(sim)).length;
    expect(weitere, "nach der Sperre schweigt das Tor für immer").toBe(1);
  });

  it("Ereignis und Toast kommen als Paar — keins ohne das andere", () => {
    for (const [phase, vorher] of [["p1", () => {}], ["p4", () => {}]] as const) {
      const sim = mkSim(phase);
      vorher();
      const evs = stepAtExit(sim);
      expect(gatesIn(evs), `${phase}: kein Torschluss`).toHaveLength(1);
      const echo = evs.filter((e) => e.type === "toast" && e.echoes === "gate");
      expect(echo, `${phase}: der Toast trägt sein Echo-Feld nicht — er klänge zusätzlich`).toHaveLength(1);
    }
  });

  it("jeder Grund der Union ist an einer echten Stelle verdrahtet", () => {
    // Die Union ist die Behauptung, `sim.ts` ist der Beleg: jeder Grund muss
    // dort wirklich gefeuert werden. Ein Grund ohne Auslöser wäre eine Zeile,
    // die aussieht wie ein Klang und keiner ist.
    const src = fs.readFileSync(path.resolve(__dirname, "../sim.ts"), "utf8");
    const REASONS: readonly GateReason[] = ["powerup", "tuerwort", "tafel", "klassenfoto", "cageGated"];
    for (const r of REASONS) {
      expect(
        src.includes(`{ type: "gate", reason: "${r}" }`),
        `der Grund »${r}« steht in der Union, wird aber nirgends gefeuert`,
      ).toBe(true);
    }
    expect([...src.matchAll(/\{ type: "gate", reason: "/g)], "es sind nicht mehr fünf Auslöser").toHaveLength(REASONS.length);
  });
});
