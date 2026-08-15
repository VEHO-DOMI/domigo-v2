// R5-W1 · F1 · WAS SICH BEWEGT, MUSS MAN SEHEN KÖNNEN.
//
// Zwei von Kokis vier Replay-Befunden sind Bewegungs-Befunde, und beide waren
// bis hierher unprüfbar: die Zahlen standen als Literale mitten in einer
// 4300-Zeilen-Renderdatei, die kein Test je anfasst. Also sind sie jetzt reine
// Funktionen in anim.ts — und „der Käfig wackelt deutlich" ist eine Tabelle
// statt eines Screenshots.
//
// Der Ausschlag wird in PIXELN gemessen, nicht in Radiant: was ein Kind sieht,
// ist der Weg, nicht der Winkel.
//
// HISTORISCH (D-87, geschlossen in R5-W4 · F5): der Satz endete hier auf „der
// Käfig ist 34 px hoch, der Ranzen 22, also wackelt der große 1,5-mal weiter".
// Seit D-48 sind alle Käfige 34 px — der Faktor ist 1,0, das Beispiel gibt es
// nicht mehr. Der Test unten prüft die Regel weiter an zwei FIKTIVEN Höhen,
// womit sie an ihrem eigenen Fall hängt statt an einem abgeschafften.

import { describe, expect, it } from "vitest";
import {
  CAGE_NEAR_PX,
  CAGE_REST_RAD,
  CAGE_ROCK_TICKS,
  CAGE_SETTLE_TICKS,
  CAGE_STRUGGLE_TICKS,
  CAGE_SWAY_PX,
  SQUASH_DWELL_TICKS,
  WIGGLE_SHIFT_PX,
  WIGGLE_SWAY_PX,
  WIGGLE_TICKS,
  bouncerSquash,
  cageBreath,
  cageNearT,
  entSeed,
  idleWiggle,
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

// ── R5-W4 · F5 · DIE ZAPPEL-WIPPE ────────────────────────────────────────────
// Kokis dritter Bewegungs-Befund derselben Klasse: „das Buch soll links-rechts
// wackeln … der Pfeil allein reicht nicht." Dieselbe Prüfung wie beim Käfig —
// der Weg in Pixeln, nicht der Winkel, und der Beweis, dass sechs Dinge nicht
// im Gleichtakt ticken.
describe("R5-F5 · die Zappel-Wippe der entfärbten Dinge", () => {
  /** die sechs, die es in ch01 wirklich gibt */
  const DINGE = ["p1-obj-book", "p1-obj-schoolbag", "p2-obj-desk", "p2-obj-scissors", "p3-obj-gluestick", "p3-obj-sharpener"];
  const H = 30; // eine typische gezeichnete Höhe in logischen px

  it("die Oberkante legt den bestellten Weg zurück — in PIXELN, nicht in Grad", () => {
    const wege = Array.from({ length: WIGGLE_TICKS + 1 }, (_, t) =>
      Math.sin(idleWiggle(t, entSeed("p1-obj-book"), H).rot) * H);
    const spanne = Math.max(...wege) - Math.min(...wege);
    // Voller Ausschlag = zweimal WIGGLE_SWAY_PX (einmal nach jeder Seite). Die
    // Ticks sind ganzzahlig und treffen den Scheitel des Sinus im AllgemeinEN
    // NICHT genau — deshalb eine Schranke statt einer Gleichheit: nie MEHR als
    // bestellt, und höchstens ein Prozent weniger.
    expect(spanne).toBeLessThanOrEqual(2 * WIGGLE_SWAY_PX + 1e-9);
    expect(spanne).toBeGreaterThan(2 * WIGGLE_SWAY_PX * 0.99);
  });

  it("…und ein DOPPELT so hohes Ding wippt genauso weit (der Winkel folgt der Höhe)", () => {
    const weg = (h: number): number => {
      const w = Array.from({ length: WIGGLE_TICKS + 1 }, (_, t) => Math.sin(idleWiggle(t, 4711, h).rot) * h);
      return Math.max(...w) - Math.min(...w);
    };
    expect(weg(60)).toBeCloseTo(weg(30), 3);
  });

  // Das Gesetz lautet „nicht im Gleichtakt" — und Gleichtakt kann nur sehen,
  // wer beide Dinge gleichzeitig sieht. Geprüft wird deshalb JE PHASE.
  //
  // ⚠ Beim Schreiben dieses Tests gefunden und gefiled (D-172): `entSeed` ist
  // eine schwache Streuung (Länge·37 + erstes Zeichen·7 + letztes Zeichen), und
  // `p1-obj-book` und `p2-obj-desk` landen beide auf 1298. Heute harmlos — die
  // beiden stehen in verschiedenen Phasen und sind nie zusammen im Bild — aber
  // ein künftiges Level, das zwei solche Namen in EINEN Raum stellt, bekäme
  // zwei Dinge im Gleichtakt, ohne dass ein Tor etwas merkt.
  const PRO_PHASE: Record<string, readonly string[]> = {
    p1: ["p1-obj-book", "p1-obj-schoolbag"],
    p2: ["p2-obj-desk", "p2-obj-scissors"],
    p3: ["p3-obj-gluestick", "p3-obj-sharpener"],
  };

  it("was zusammen im Bild steht, tickt nicht im Gleichtakt", () => {
    for (const [phase, ids] of Object.entries(PRO_PHASE)) {
      const spuren = ids.map((id) =>
        Array.from({ length: WIGGLE_TICKS }, (_, t) => idleWiggle(t, entSeed(id), H).rot.toFixed(5)).join(","));
      expect(new Set(spuren).size, `${phase}: jedes Ding seine eigene Phase`).toBe(ids.length);
    }
    // …und über alle sechs bleiben mindestens fünf Phasen übrig (die eine
    // Dublette ist die gefilede entSeed-Kollision, phasengetrennt)
    const alle = DINGE.map((id) => idleWiggle(0, entSeed(id), H).rot.toFixed(6));
    expect(new Set(alle).size).toBeGreaterThanOrEqual(DINGE.length - 1);
  });

  it("Drehung und Seitweg sind gegenphasig — Lehnen und Gehen, nicht Kippen und Rutschen", () => {
    // im Umkehrpunkt der Drehung ist der Seitweg am größten und umgekehrt
    const amKipp = idleWiggle(0, 0, H); // Phase 0 bei Seed 0 ist beliebig, aber fest
    const spurRot = Array.from({ length: WIGGLE_TICKS }, (_, t) => idleWiggle(t, 0, H).rot);
    const spurDx = Array.from({ length: WIGGLE_TICKS }, (_, t) => idleWiggle(t, 0, H).dx);
    const iRotMax = spurRot.indexOf(Math.max(...spurRot));
    const iDxMax = spurDx.indexOf(Math.max(...spurDx));
    const versatz = Math.abs(iRotMax - iDxMax) % WIGGLE_TICKS;
    expect(Math.min(versatz, WIGGLE_TICKS - versatz)).toBeCloseTo(WIGGLE_TICKS / 4, -0.5);
    expect(Math.abs(amKipp.dx)).toBeLessThanOrEqual(WIGGLE_SHIFT_PX + 1e-9);
  });

  it("reduzierte Bewegung hält das Ding still — und zwar GERADE", () => {
    // anders als der Käfig: dort ist die Schräglage eine Tatsache über einen
    // Gefangenen, hier wäre ein schiefes Buch nur umgefallen
    for (const t of [0, 17, 36, 71]) {
      const w = idleWiggle(t, entSeed("p1-obj-book"), H, true);
      expect(w.rot).toBe(0);
      expect(w.dx).toBe(0);
    }
  });

  it("dieselbe Eingabe, dasselbe Bild (das Band darf sich nicht neu würfeln)", () => {
    const a = Array.from({ length: 40 }, (_, t) => idleWiggle(t, entSeed("p2-obj-desk"), H));
    const b = Array.from({ length: 40 }, (_, t) => idleWiggle(t, entSeed("p2-obj-desk"), H));
    expect(a).toEqual(b);
  });

  it("die Wippe bleibt kleiner als das Käfig-Rütteln — ein Buch wehrt sich nicht", () => {
    expect(WIGGLE_SWAY_PX).toBeLessThan(CAGE_SWAY_PX);
  });
});

// ── R5-W4 · F5 · SICHTBAR STATT NAH (D-64, R38) ──────────────────────────────
// Kokis Befund „der Käfig wackelt nicht deutlich" war eine Aussage über den
// BLICKABSTAND, nicht über die Kurve: die Bahn hing allein an `nearT`, und
// `cageNearT` deckelt bei 42 px. Aus vier Kacheln Entfernung — der Abstand, aus
// dem man einen Käfig fast immer sieht — blieben 7,1 gezeichnete Schirm-px.
// R38 dreht das um: wer gezeichnet wird, stemmt sich ganz.
describe("R5-F5 · der Käfig wackelt auch aus der Ferne (D-64, R38)", () => {
  const H = 34;
  const ZOOM = 3; // Kamera-Zoom der Malbuch-Szene
  /** Die gezeichnete Bahn der Oberkante über ein volles Rüttel-Fenster. */
  const bahnPx = (nearT: number, seenT: number): number => {
    const w = Array.from({ length: CAGE_STRUGGLE_TICKS }, (_, t) =>
      Math.sin(cageBreath(t, entSeed("p1-cage1"), nearT, H, false, seenT).rot) * H * ZOOM);
    return Math.max(...w) - Math.min(...w);
  };

  it("★ aus sechs Kacheln Entfernung zeichnet ein sichtbarer Käfig ≥ 12 Schirm-px", () => {
    const fern = cageNearT(6 * 16, 0);
    expect(fern, "so weit weg ist der Nahwert wirklich null").toBe(0);
    expect(bahnPx(fern, 1)).toBeGreaterThanOrEqual(12);
  });

  it("…und ohne Sichtbarkeit wäre genau das der alte, zu kleine Wert", () => {
    expect(bahnPx(cageNearT(6 * 16, 0), 0)).toBeLessThan(8);
  });

  it("die Nähe bleibt der ZUSATZ: dicht am Kind hört das Rütteln nie ganz auf", () => {
    // zwischen zwei Stemmern (nach CAGE_SETTLE_TICKS) ist der Abklinger null —
    // was dann noch schwingt, kommt allein aus dem Nahe-Boden
    const zwischen = CAGE_SETTLE_TICKS + 5;
    const seed = entSeed("p1-cage1");
    const phase = Math.floor(Math.abs(Math.sin(seed)) * 0); // nur zur Lesbarkeit: siehe cageBreath
    void phase;
    const nah = Array.from({ length: CAGE_ROCK_TICKS }, (_, i) => cageBreath(zwischen + i, seed, 1, H, false, 1).rot);
    const fern = Array.from({ length: CAGE_ROCK_TICKS }, (_, i) => cageBreath(zwischen + i, seed, 0, H, false, 1).rot);
    const weite = (r: number[]): number => Math.max(...r) - Math.min(...r);
    expect(weite(nah)).toBeGreaterThan(weite(fern));
  });

  it("ein Käfig ausserhalb des Bildes rechnet wie bisher (nichts wird verschenkt)", () => {
    for (const t of [0, 13, 41, 83]) {
      expect(cageBreath(t, entSeed("p1-cage1"), 0.5, H, false, 0))
        .toEqual(cageBreath(t, entSeed("p1-cage1"), 0.5, H));
    }
  });
});
