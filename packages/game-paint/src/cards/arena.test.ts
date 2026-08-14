// R5-W2 · H1 (Teil 3) · DIE KNOTEN-ERKLÄRUNG, als Gesetze.
//
// Kokis Replay-Frage war „Why do we have knots? What is the idea again?" — also
// prüft diese Datei nicht nur, DASS eine Karte kommt, sondern dass sie an der
// richtigen Kante kommt, genau einmal, die Welt danach zurückgibt und in einer
// Sprache spricht, die ein Sechsjähriger lesen kann.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ARENA_BEATS, arenaExit, arenaLines, arenaPosition, arenaStep, type ArenaBeat } from "./arena.ts";
import { CALM_DE, URGENCY_DE } from "./timer.ts";
import { Sim } from "../sim.ts";
import { IDLE_PAD } from "../player.ts";
import { SUBS, TILE } from "../paint.ts";
import type { PaintLevel } from "../level.ts";

/** Dieselbe Grenze, die `check-game-tasks` auf jede sichtbare Zeile legt. */
const MAX_LINE_DE = 56;

const shipped = (): PaintLevel =>
  JSON.parse(
    readFileSync(
      resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"),
      "utf8",
    ),
  ) as PaintLevel;

describe("die Kette der Arena-Anleitung", () => {
  it("läuft von beiden Enden und endet an beiden", () => {
    // dasselbe Gesetz wie am Kapitel-Auftakt: »weiter« und »zurück« dürfen sich
    // nie widersprechen, weil beide dasselbe Feld lesen
    const first = ARENA_BEATS[0]!;
    const last = ARENA_BEATS[ARENA_BEATS.length - 1]!;
    expect(arenaStep(first, -1)).toBeNull();
    expect(arenaStep(last, 1)).toBeNull();
    for (const [i, beat] of ARENA_BEATS.entries()) {
      const fwd = arenaStep(beat, 1);
      if (fwd !== null) expect(arenaStep(fwd, -1)).toBe(beat);
      expect(arenaPosition(beat)).toEqual({ at: i + 1, of: ARENA_BEATS.length });
    }
  });

  it("eine fremde Karte kann nicht in die Anleitung hineinlaufen", () => {
    for (const foreign of ["task", "finale", "goal", "console", ""]) {
      expect(arenaStep(foreign, 1)).toBeNull();
      expect(arenaPosition(foreign)).toBeNull();
      expect(arenaExit(foreign)).toEqual({ next: null, unfreeze: false });
    }
  });

  it("GENAU EIN Takt gibt die Welt zurück — und es ist der letzte", () => {
    // Das ist das ganze Gesetz dieses Moduls: ein Kampf, der schon unter dem
    // zweiten Takt läuft, wäre ein Boss, der wirft, während das Kind noch liest,
    // wie man ihm ausweicht.
    const unfreezing = ARENA_BEATS.filter((b) => arenaExit(b).unfreeze);
    expect(unfreezing).toEqual([ARENA_BEATS[ARENA_BEATS.length - 1]]);
  });
});

describe("was die Anleitung sagt", () => {
  const all = ARENA_BEATS.map((b) => arenaLines(b));

  it("passt in eine Zeile — jede", () => {
    for (const l of all) {
      for (const [field, line] of Object.entries(l)) {
        expect(line.length, `${field}: „${line}" ist ${line.length} Zeichen`).toBeLessThanOrEqual(MAX_LINE_DE);
        expect(line.trim().length, `${field} ist leer`).toBeGreaterThan(0);
      }
    }
  });

  it("verrät den Antagonisten nicht (Cloak-Gesetz vor ch15)", () => {
    // Der Verursacher heisst „der Tinten-Schatten" — eine Beschreibung seiner
    // Tinte, kein Eigenname. STORY_SPINE_CH01 §5 ist die Autorität.
    for (const l of all) {
      const text = Object.values(l).join(" ");
      expect(text).not.toMatch(/oswin|schlinger/i);
    }
  });

  it("macht keine Angst (Register-Gesetz)", () => {
    for (const l of all) {
      const text = Object.values(l).join(" ");
      expect(text).not.toMatch(/monster|blut|böse|bösewicht|schrei|sterben|\btot\b|gruselig|gefahr|falle|feind/i);
    }
  });

  it("verspricht keine Ruhe auf einer Phase, die eine Uhr trägt", () => {
    // Seit Teil 2 tragen die Boss-Karten Uhren. Eine Anleitung, die »lass dir
    // Zeit« sagt, wäre dieselbe Lüge wie ein Countdown ohne Uhr, nur andersherum
    // (cards/timer.ts CALM_DE / URGENCY_DE).
    for (const l of all) {
      const text = Object.values(l).join(" ");
      expect(CALM_DE.test(text), `„${text}" verspricht Ruhe`).toBe(false);
      expect(URGENCY_DE.test(text), `„${text}" hetzt`).toBe(false);
    }
  });

  it("nennt keine Zahl — die Knoten kommen aus dem Tier-Skript", () => {
    // doc 41 §7: keine Zahl wird getippt, die die Welt auch zählen kann. Die
    // Knotenzahl hängt an der Stufe, eine getippte Drei wäre auf M und S falsch.
    for (const l of all) {
      const text = Object.values(l).join(" ");
      expect(text).not.toMatch(/\d|\bdrei\b|\bvier\b|\bfünf\b/i);
    }
  });

  it("beantwortet BEIDE Fragen, die Koki gestellt hat", () => {
    // F1 „warum Knoten?" — der erste Takt muss die Knoten benennen.
    // F2 „wie besiegt man ihn?" — der zweite muss die Schleife benennen.
    expect(arenaLines("wer" as ArenaBeat).storyDe.toLowerCase()).toContain("knoten");
    const wie = Object.values(arenaLines("wie" as ArenaBeat)).join(" ").toLowerCase();
    expect(wie, "der zweite Takt muss das Ausweichen nennen").toContain("ausweichen");
    expect(wie, "…und das Antworten").toMatch(/antworte/);
    expect(wie, "…und was es einbringt").toContain("knoten");
  });
});

describe("wann die Anleitung kommt", () => {
  const arenaSim = (over: Record<string, unknown> = {}): Sim => {
    const level = shipped();
    return new Sim({
      level, phaseId: "p4",
      grantedAbilities: () => [...level.abilities],
      freedCageIds: () => [],
      ...over,
    });
  };

  /** Läuft nach Osten, bis das Ereignis kommt — und meldet, wo das Kind stand.
   *
   *  Es muss dabei SPRINGEN, und das ist keine Test-Marotte: die Schwelle c5 ist
   *  die Kante des West-Podests, also ist der Übertritt auf die Bühne wörtlich
   *  ein Aufstieg (32 px, Tap-Sprung 45–50 — die Arena verlangt nichts
   *  Ungelehrtes). Ein Kind, das nur läuft, bleibt bei c4,6 an der Kiste
   *  stehen. */
  const runUntilBrief = (sim: Sim): { fired: boolean; atCol: number } => {
    for (let t = 0; t < 3000; t++) {
      const pad = { ...IDLE_PAD, right: true, jump: t % 34 < 8 };
      for (const ev of sim.step(pad)) {
        if (ev.type === "arenaBrief") return { fired: true, atCol: sim.player.x / SUBS / TILE };
      }
    }
    return { fired: false, atCol: -1 };
  };

  it("feuert an der BÜHNEN-SCHWELLE, die das Level selbst deklariert", () => {
    // Der Ort ist nicht frei gewählt: `arena.md` §3 verortet den Takt am
    // Übertritt von der Kulisse auf die Bretter, und die Kante ist DIESELBE
    // Zahl, die auch die Bahn der Tafel klemmt.
    const level = shipped();
    const g = level.arena!.entities.find((e) => e.role === "guardian")!;
    const threshold = Number(g.params!.stageMinC);
    const sim = arenaSim();
    expect(sim.player.x / SUBS / TILE, "das Kind startet westlich der Bühne").toBeLessThan(threshold);
    const r = runUntilBrief(sim);
    expect(r.fired, "die Anleitung kam nie").toBe(true);
    expect(r.atCol, "sie kam vor der Schwelle").toBeGreaterThanOrEqual(threshold);
    expect(r.atCol, "sie kam erst tief auf der Bühne").toBeLessThan(threshold + 2);
  });

  it("friert die Welt ein, solange sie oben ist", () => {
    const sim = arenaSim();
    expect(runUntilBrief(sim).fired).toBe(true);
    const before = sim.player.x;
    for (let t = 0; t < 120; t++) sim.step({ ...IDLE_PAD, right: true, jump: t % 34 < 8 });
    expect(sim.player.x, "die Welt lief unter der Anleitung weiter").toBe(before);
  });

  it("und gibt sie zurück, sobald der Shell sie weglegt", () => {
    const sim = arenaSim();
    expect(runUntilBrief(sim).fired).toBe(true);
    sim.setOverlay(false);
    const before = sim.player.x;
    for (let t = 0; t < 60; t++) sim.step({ ...IDLE_PAD, right: true, jump: t % 34 < 8 });
    expect(sim.player.x, "die Welt blieb nach dem Weglegen stehen").toBeGreaterThan(before);
  });

  it("kommt GENAU EINMAL — eine Anleitung, die nachfasst, ist eine Ermahnung", () => {
    const sim = arenaSim();
    expect(runUntilBrief(sim).fired).toBe(true);
    sim.setOverlay(false);
    let again = 0;
    for (let t = 0; t < 2000; t++) {
      const pad = { ...IDLE_PAD, right: Math.floor(t / 60) % 2 === 0, left: Math.floor(t / 60) % 2 === 1 };
      for (const ev of sim.step(pad)) if (ev.type === "arenaBrief") again++;
    }
    expect(again, "sie kam ein zweites Mal").toBe(0);
  });

  it("und gar nicht, wenn der Shell sie in diesem Kapitel schon gezeigt hat", () => {
    // Die Freeze-Paarung (die Narbe des Käfig-Hinweises): der Sim FRAGT, bevor
    // er einfriert — sonst bleibt die Welt für eine Karte stehen, die der Shell
    // dann gar nicht öffnet, und die Phase ist tot.
    const level = shipped();
    const threshold = Number(level.arena!.entities.find((e) => e.role === "guardian")!.params!.stageMinC);
    const sim = arenaSim({ arenaBriefShown: () => true });
    // Bis zum Übertritt laufen und GENAU DORT hinsehen — später steht ohnehin
    // irgendwann eine Boss-Karte offen, und die würde die Messung verwischen.
    let fired = false;
    let frozenAtCrossing: boolean | null = null;
    for (let t = 0; t < 900 && frozenAtCrossing === null; t++) {
      for (const ev of sim.step({ ...IDLE_PAD, right: true, jump: t % 34 < 8 })) {
        if (ev.type === "arenaBrief") fired = true;
      }
      if (sim.player.x / SUBS / TILE >= threshold) frozenAtCrossing = sim.overlayOpen;
    }
    expect(fired, "sie kam, obwohl der Shell abgewinkt hat").toBe(false);
    // …und die Welt darf dabei NICHT eingefroren sein. Das ist die eigentliche
    // Narbe: als die beiden Merker sich einmal widersprachen, fror der Sim für
    // eine Karte ein, die der Shell dann ablehnte — und nichts hat je wieder
    // aufgetaut (`sim.ts` nearOpenableCage, die Freeze-Paarung).
    expect(frozenAtCrossing, "das Kind kam nie über die Schwelle").not.toBeNull();
    expect(frozenAtCrossing, "die Welt ist eingefroren, obwohl keine Karte kommt").toBe(false);
  });

  it("in Räumen ohne Boss gibt es sie nicht", () => {
    const level = shipped();
    for (const ph of level.phases) {
      const sim = new Sim({ level, phaseId: ph.id, grantedAbilities: () => [...level.abilities], freedCageIds: () => [] });
      let fired = false;
      for (let t = 0; t < 900 && !fired; t++) {
        const pad = { ...IDLE_PAD, right: Math.floor(t / 60) % 2 === 0, left: Math.floor(t / 60) % 2 === 1 };
        for (const ev of sim.step(pad)) if (ev.type === "arenaBrief") fired = true;
      }
      expect(fired, `${ph.id} hat keinen Boss und bekam trotzdem eine Boss-Anleitung`).toBe(false);
    }
  });
});
