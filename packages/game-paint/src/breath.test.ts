// R5-W1 · F1 · WAS SICH BEWEGT, MUSS MAN SEHEN KÖNNEN.
//
// Zwei von Kokis vier Replay-Befunden sind Bewegungs-Befunde, und beide waren
// bis hierher unprüfbar: die Zahlen standen als Literale mitten in einer
// 4300-Zeilen-Renderdatei, die kein Test je anfasst. Also sind sie jetzt reine
// Funktionen in anim.ts — und „der Käfig wackelt deutlich" ist eine Tabelle
// statt eines Screenshots.
//
// Der Ausschlag wird in PIXELN gemessen, nicht in Radiant: der Käfig mit einem
// Kind darin ist 34 px hoch, der Ranzen 22, und bei festem Winkel wackelt der
// große automatisch 1,5-mal weiter. Was ein Kind sieht, ist der Weg.

import { describe, expect, it } from "vitest";
import {
  CAGE_NEAR_PX,
  CAGE_REST_RAD,
  CAGE_STRUGGLE_TICKS,
  CAGE_SWAY_PX,
  SQUASH_DWELL_TICKS,
  bouncerSquash,
  cageBreath,
  cageNearT,
  entSeed,
} from "./anim.ts";
import { BOUNCE_GRAVITY_EVERY, BOUNCE_UP } from "./entities.ts";
import { PAINT } from "./paint.ts";

/** Der Weg, den die Oberkante eines `h` px hohen Kastens bei diesem Winkel
 *  zurücklegt — der Ursprung sitzt unten mittig, also ist es h·sin(φ). */
const topEdgePx = (rot: number, h: number): number => Math.abs(Math.sin(rot) * h);

/** Der größte Ausschlag über ein volles Stemm-Fenster. */
const peakSwayPx = (seed: number, nearT: number, h: number): number => {
  let peak = 0;
  for (let t = 0; t < CAGE_STRUGGLE_TICKS * 2; t++) {
    peak = Math.max(peak, topEdgePx(cageBreath(t, seed, nearT, h).rot, h));
  }
  return peak;
};

describe("R5-F1 · das Käfig-Rütteln ist zu sehen", () => {
  it("stemmt sich sichtbar — und in PIXELN, nicht im Winkel", () => {
    const small = peakSwayPx(entSeed("p1-cage1"), 1, 22);
    const tall = peakSwayPx(entSeed("p2-cage-merle"), 1, 34);
    expect(small).toBeGreaterThanOrEqual(CAGE_SWAY_PX * 0.85);
    expect(tall).toBeGreaterThanOrEqual(CAGE_SWAY_PX * 0.85);
    // …und der große Käfig wackelt nicht automatisch weiter, nur weil er
    // größer ist: das war der Fehler an einem festen Winkel
    expect(Math.abs(small - tall)).toBeLessThan(CAGE_SWAY_PX * 0.35);
  });

  it("TAMPER · der alte Wert war der Defekt: ±0,07 rad auf 22 px sind ~1,5 px", () => {
    // Genau die Zeile, die Koki „bewegt sich nicht deutlich" nannte. Sie steht
    // hier als Messwert, damit niemand versehentlich dorthin zurücktunt.
    const alt = topEdgePx(0.07, 22);
    expect(alt).toBeLessThan(1.6);
    expect(peakSwayPx(entSeed("p1-cage1"), 1, 22)).toBeGreaterThan(alt * 2);
  });

  it("nah rüttelt stärker als fern — und schaltet nicht um, sondern blendet", () => {
    const near = peakSwayPx(entSeed("p1-cage1"), 1, 22);
    const far = peakSwayPx(entSeed("p1-cage1"), 0, 22);
    expect(near).toBeGreaterThan(far);
    expect(far, "auch fern bleibt es sichtbar, wenn man hinsieht").toBeGreaterThan(1.0);
    // die Rampe ist stetig: ein Schritt von einem px darf nie springen
    let maxStep = 0;
    for (let d = 0; d <= CAGE_NEAR_PX + 8; d++) {
      maxStep = Math.max(maxStep, Math.abs(cageNearT(d, 0) - cageNearT(d + 1, 0)));
    }
    expect(maxStep).toBeLessThan(0.1);
  });

  it("nah hört es nie ganz auf (jemand ist da drin)", () => {
    let longestStill = 0;
    let run = 0;
    for (let t = 0; t < CAGE_STRUGGLE_TICKS * 2; t++) {
      const sway = topEdgePx(cageBreath(t, entSeed("p1-cage1"), 1, 22).rot, 22);
      run = sway < 0.4 ? run + 1 : 0;
      longestStill = Math.max(longestStill, run);
    }
    expect(longestStill, "keine lange Totenstille direkt vor dem Kind").toBeLessThan(14);
  });

  it("zwei Käfige stemmen sich nicht im Gleichtakt", () => {
    const a = entSeed("p1-cage1");
    const b = entSeed("p2-cage-merle");
    const peakTick = (seed: number): number => {
      let best = -1, bestV = -1;
      for (let t = 0; t < CAGE_STRUGGLE_TICKS; t++) {
        const v = Math.abs(cageBreath(t, seed, 1, 22).rot);
        if (v > bestV) { bestV = v; best = t; }
      }
      return best;
    };
    expect(peakTick(a)).not.toBe(peakTick(b));
  });

  it("reduzierte Bewegung zeigt eine ruhende, angespannte Schräglage — nicht nichts", () => {
    const r = cageBreath(37, entSeed("p1-cage1"), 1, 22, true);
    expect(r.rot).toBe(CAGE_REST_RAD);
    expect(r.sx).toBe(1);
    expect(r.sy).toBe(1);
    expect(r.dy).toBe(0);
    // …und sie steht wirklich still: derselbe Wert zu jedem Tick
    expect(cageBreath(999, entSeed("p1-cage1"), 1, 22, true)).toEqual(r);
  });

  it("die Verformung läuft nicht davon", () => {
    for (let t = 0; t < CAGE_STRUGGLE_TICKS * 2; t++) {
      const b = cageBreath(t, entSeed("p1-cage1"), 1, 22);
      expect(b.sx * b.sy).toBeGreaterThan(0.88);
      expect(b.sx * b.sy).toBeLessThan(1.12);
      expect(Math.abs(b.dy)).toBeLessThanOrEqual(1);
    }
  });

  it("deterministisch: gleicher Tick, gleicher Same, gleiches Bild", () => {
    const a = cageBreath(51, entSeed("p1-cage1"), 0.5, 22);
    const b = cageBreath(51, entSeed("p1-cage1"), 0.5, 22);
    expect(a).toEqual(b);
  });
});

describe("R5-F1 · die Quetschung des Hüpfers (die Zahlen hinter dem Bild)", () => {
  const arc = (ticks = 13): { bounceTick: number; vy: number }[] => {
    const out: { bounceTick: number; vy: number }[] = [];
    let vy = -BOUNCE_UP;
    for (let t = 0; t < ticks; t++) {
      out.push({ bounceTick: t, vy });
      if ((t + 1) % BOUNCE_GRAVITY_EVERY === 0) vy += PAINT.gravity;
    }
    return out;
  };

  it("der Aufprall drückt breit und flach, der Flug zieht schmal und lang", () => {
    const hit = bouncerSquash(0, -BOUNCE_UP);
    expect(hit.sx, "breiter").toBeGreaterThan(1);
    expect(hit.sy, "flacher").toBeLessThan(1);
    const flight = arc().slice(SQUASH_DWELL_TICKS).map((s) => bouncerSquash(s.bounceTick, s.vy));
    expect(flight.some((f) => f.sy > 1 && f.sx < 1), "irgendwann im Flug gestreckt").toBe(true);
  });

  it("ein ruhender Körper wird nicht verformt", () => {
    // der Scheitel: die Kontakt-Uhr ist alt, die Geschwindigkeit fast null
    const apex = bouncerSquash(6, 0);
    expect(apex.sx).toBeCloseTo(1, 5);
    expect(apex.sy).toBeCloseTo(1, 5);
  });
});
