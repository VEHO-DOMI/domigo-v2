// R5-W6 · L1 — DIE GESETZE DES SAMMELBUCHSTABENS.
//
// Drei Sessions haben unabhaengig dasselbe gemeldet (G4 §AAA, F6 §Panel, und
// davor J1): das Gold der Buchstaben verschwindet vor der gelben Wand von p1.
// Am Schirm gemessen stand p1 bei ΔL −15 und ΔH 3° — gleiche Familie, gleicher
// Hellwert, 0 von 9 Buchstaben trennten.
//
// Diese Datei haelt fest, was daraufhin GESETZ geworden ist, und sie tut es mit
// DEMSELBEN Messgeraet, mit dem am Schirm gemessen wird (`measure-presence`):
// ein Gesetz, das ein anderes Lineal benutzt als die Messung, kann gruen sein,
// waehrend die Messung rot ist — und beide haetten recht.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { hue, hueGap, lum, separates } from "../../../scripts/measure-presence.mjs";
import {
  BACKING_ALPHA_MAX,
  LETTER_CHALK,
  LETTER_GOLD,
  LETTER_INK,
  LETTER_STYLE,
  backedGround,
  letterBackingFor,
  letterGlowGain,
  letterRimFor,
  roomBrightness,
} from "./letters.ts";

const rgb = (c: number): [number, number, number] => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
const lumOf = (c: number): number => lum(...rgb(c));
const hueOf = (c: number): number | null => hue(...rgb(c));
const gap = (a: number, b: number): { dL: number; dH: number } => {
  const ha = hueOf(a);
  const hb = hueOf(b);
  return { dL: lumOf(a) - lumOf(b), dH: ha === null || hb === null ? 0 : hueGap(ha, hb) };
};

/** Die gemessenen Waende, aus denen die Zahlen dieser Runde stammen. */
const WALL_P1 = 0xc7c793; // 199,199,147 — l1_p1_a+_b, aus den Quell-PNGs gemessen
const WALL_P9 = 0x1e1e26; // die Tintenwand von p9

describe("R146 — das Gold hat EINE Quelle", () => {
  it("die CSS-Zeichenkette wird aus der Zahl gerechnet, nicht daneben getippt", () => {
    expect(LETTER_STYLE.fill.toLowerCase()).toBe(`#${LETTER_GOLD.toString(16)}`);
  });

  it("PaintScene ZIEHT PULL_COLOUR/PULL_EDGE, statt sie abzuschreiben", () => {
    // Quelltext-Pin statt Import: PaintScene zieht Phaser mit und laesst sich in
    // einem Unit-Test nicht laden. Ein Pin, der die Zeile liest, faellt trotzdem,
    // sobald jemand die Zahl zurueckschreibt — und darum geht es.
    const src = fs.readFileSync(path.resolve(__dirname, "./PaintScene.ts"), "utf8");
    expect(src, "PULL_COLOUR steht wieder als Zahl in PaintScene").toContain("const PULL_COLOUR = LETTER_GOLD;");
    expect(src, "PULL_EDGE steht wieder als Zahl in PaintScene").toContain("const PULL_EDGE = LETTER_AMBER;");
    expect(src, "eine vierte Kopie des Goldes").not.toContain("const PULL_COLOUR = 0x");
  });
});

describe("Der Buchstabe traegt das Gegenteil seines Raumes", () => {
  it("heller Raum ⇒ Tinte, dunkler Raum ⇒ Kreide", () => {
    expect(letterRimFor(88).colour).toBe(LETTER_INK);
    expect(letterRimFor(86).colour).toBe(LETTER_INK);
    expect(letterRimFor(30).colour).toBe(LETTER_CHALK);
    expect(letterRimFor(14).colour).toBe(LETTER_CHALK);
  });

  it("in JEDEM Raum ist der Rand vom Gold unterscheidbar — sonst ist er kein Rand", () => {
    // Genau dieses Gesetz hat die WARME Kreide (0xfff4cf) gerissen: gegen das
    // Gold stand sie bei ΔL 43 und ΔH 1°, also unter dem Kriterium. Das Tor hat
    // es gefunden, bevor ein Bild geschossen war.
    for (const key of [88, 86, 60, 30, 14]) {
      const rim = letterRimFor(key);
      const g = gap(rim.colour, LETTER_GOLD);
      expect(separates(g.dL, g.dH), `Schluessel ${key}: Rand gegen Gold ΔL ${g.dL.toFixed(1)} / ΔH ${g.dH.toFixed(0)}°`).toBe(true);
    }
  });

  it("in JEDEM Raum traegt der Buchstabe ueberhaupt einen Rand", () => {
    for (const key of [88, 86, 60, 45, 30, 14, 0]) {
      expect(letterRimFor(key).width, `Schluessel ${key} ohne Rand`).toBeGreaterThan(0.5);
    }
  });

  it("der Rand trennt sich von der Wand, gegen die er steht", () => {
    for (const [key, wall] of [[88, WALL_P1], [14, WALL_P9]] as const) {
      const g = gap(letterRimFor(key).colour, wall);
      expect(separates(g.dL, g.dH), `Schluessel ${key}: Rand gegen Wand ΔL ${g.dL.toFixed(1)} / ΔH ${g.dH.toFixed(0)}°`).toBe(true);
    }
  });
});

describe("R37 — der Grund wird zurueckgenommen, nicht das Ding heller", () => {
  it("nur der helle Raum bekommt einen Hof; der dunkle zahlt nichts dafuer", () => {
    expect(letterBackingFor(88).alpha).toBeCloseTo(BACKING_ALPHA_MAX, 5);
    expect(letterBackingFor(14).alpha).toBe(0);
    expect(letterBackingFor(30).alpha).toBe(0);
  });

  it("der Hof holt das Gold aus der Familie SEINER EIGENEN Wand", () => {
    // p1 roh: das Gold steht bei ΔL +1,8 gegen die Wand — es IST die Wand.
    const roh = lumOf(LETTER_GOLD) - lumOf(WALL_P1);
    expect(Math.abs(roh), "die Ausgangslage ist nicht mehr die gemessene").toBeLessThan(12);
    const [r, g, b] = backedGround(rgb(WALL_P1), letterBackingFor(88));
    expect(lumOf(LETTER_GOLD) - lum(r, g, b)).toBeGreaterThan(30);
  });

  it("ohne Hof bleibt eine goldene Wand eine goldene Wand — der Tamper in einer Zeile", () => {
    const ohne = backedGround(rgb(LETTER_GOLD), { colour: LETTER_INK, alpha: 0 });
    expect(Math.abs(lumOf(LETTER_GOLD) - lum(...ohne))).toBeLessThan(1);
  });

  it("das warme Licht faehrt im hellen Raum zurueck und bleibt im dunklen ganz da", () => {
    expect(letterGlowGain(14)).toBe(1);
    expect(letterGlowGain(88)).toBeLessThan(0.35);
    expect(letterGlowGain(88)).toBeGreaterThan(0);
  });

  it("roomBrightness ist gedeckelt und monoton", () => {
    expect(roomBrightness(0)).toBe(0);
    expect(roomBrightness(40)).toBe(0);
    expect(roomBrightness(70)).toBe(1);
    expect(roomBrightness(100)).toBe(1);
    expect(roomBrightness(55)).toBeGreaterThan(roomBrightness(50));
  });
});
