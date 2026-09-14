// ── L0e · der frame-freie Treiber (K-1b.1, Weg c) ────────────────────────────
//
// Drei Zusicherungen:
//   1. DIE KARTE HINTER DEM ZEITGEBER — eine Karte, die erst ein aufgeschobener
//      Aufruf hebt, wird ohne Uhr gelöst (genau das, woran der Gang im
//      versteckten Pane hing).
//   2. DER HALT — am Griff, am Bandende, und ein benannter Stillstand statt
//      eines Hängers.
//   3. DIE GRENZE — kein Zeitgeber, keine Wanduhr, kein Frame im Quelltext,
//      mit Tamper-Beweis an einer KOPIE.

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createFrameFreeDriver, type FrameFreeSurfaces, SETTLE_ROUND_CAP } from "./frame-free-drive.ts";

/** Eine Mini-Hülle: in Takt `karteBei` stößt der Sim eine Aufgabe an, hält die
 *  Welt an und die Hülle legt einen aufgeschobenen Aufruf ab, der die Karte
 *  erst hebt. Genau die Reihenfolge von `PaintGame.tsx` (`later(...)`). */
const huelle = (o: { karteBei?: number; griffe?: number[]; ewigeZeremonie?: boolean } = {}) => {
  let t = 0;
  let overlay = false;
  let karte = false;
  const aufgeschoben: Array<() => void> = [];
  const log: string[] = [];
  const surfaces: FrameFreeSurfaces = {
    press: () => undefined,
    frame: () => {
      t++;
      if (t === o.karteBei) {
        overlay = true;
        // eine Zeremonie, die sich selbst immer wieder aufschiebt und nie eine Karte hebt
        const ewig = (): void => { aufgeschoben.push(ewig); };
        aufgeschoben.push(o.ewigeZeremonie === true ? ewig : () => { karte = true; });
      }
    },
    flushTimers: () => {
      const n = aufgeschoben.length;
      for (const fn of aufgeschoben.splice(0)) fn();
      return n;
    },
    cardOpen: () => karte,
    solveCard: () => { karte = false; overlay = false; log.push(`gelöst@${t}`); return true; },
    read: () => ({ tick: t, overlay, griff: (o.griffe ?? []).includes(t) }),
    settle: async () => undefined,
  };
  return { surfaces, log };
};
const band = (n: number): Array<[number, number]> => [[n, 0]];

describe("L0e · der frame-freie Treiber löst die Karte hinter dem Zeitgeber", () => {
  it("die Karte, die erst ein aufgeschobener Aufruf hebt, wird ohne Uhr gelöst", async () => {
    const h = huelle({ karteBei: 4 });
    const d = createFrameFreeDriver(h.surfaces);
    d.load(band(10));
    const halt = await d.drive();
    expect(halt.reason).toBe("band-ende");
    expect(halt.played).toBe(10);
    expect(halt.cards).toBe(1);
    expect(halt.flushed).toBe(1);
    expect(h.log).toEqual(["gelöst@4"]);
  });

  it("TAMPER · ohne flushTimers bleibt dieselbe Welt stehen — und der Treiber SAGT es", async () => {
    const h = huelle({ karteBei: 4 });
    const d = createFrameFreeDriver({ ...h.surfaces, flushTimers: () => 0 });
    d.load(band(10));
    const halt = await d.drive();
    expect([halt.reason, halt.played, halt.cards]).toEqual(["stillstand", 4, 0]);
  });
});

describe("L0e · die Halte", () => {
  it("hält an jeder Greif-Kante, nicht an jedem Takt am Griff", async () => {
    const d = createFrameFreeDriver(huelle({ griffe: [3, 4, 8] }).surfaces);
    d.load(band(10));
    expect((await d.drive({ haltAmGriff: true })).played).toBe(3);
    expect((await d.drive({ haltAmGriff: true })).played).toBe(8);
    expect((await d.drive({ haltAmGriff: true })).reason).toBe("band-ende");
  });

  it("maxTicks teilt das Band in Abschnitte", async () => {
    const d = createFrameFreeDriver(huelle().surfaces);
    d.load(band(10));
    const a = await d.drive({ maxTicks: 6 });
    expect([a.reason, a.played, a.done]).toEqual(["takte-auf", 6, false]);
    const b = await d.drive({ maxTicks: 6 });
    expect([b.reason, b.played, b.done]).toEqual(["band-ende", 10, true]);
  });

  it("eine Zeremonie, die nie endet, wird nach SETTLE_ROUND_CAP Runden als Stillstand gemeldet", async () => {
    const d = createFrameFreeDriver(huelle({ karteBei: 2, ewigeZeremonie: true }).surfaces);
    d.load(band(5));
    const halt = await d.drive();
    expect(halt.reason).toBe("stillstand");
    expect(halt.flushed).toBeGreaterThanOrEqual(SETTLE_ROUND_CAP - 1);
  });
});

// ── 3 · DIE GRENZE ───────────────────────────────────────────────────────────
/** Verbotene Griffe im Treiber-Quelltext — reine Funktion, damit der Tamper an
 *  einer KOPIE laufen kann. */
export const uhrFunde = (src: string): string[] => {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const verboten: Array<[RegExp, string]> = [
    [/\bsetTimeout\b|\bsetInterval\b/, "benutzt einen Zeitgeber"],
    [/\brequestAnimationFrame\b/, "wartet auf einen Frame"],
    [/\bDate\.now\b|\bperformance\.now\b/, "liest die Wanduhr"],
    [/\.world\b|\.entities\b/, "greift in die Welt"],
  ];
  return verboten.filter(([re]) => re.test(code)).map(([, was]) => was);
};

describe("L0e · der Treiber hat keine Uhr", () => {
  const src = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "frame-free-drive.ts"), "utf8");
  it("kein Zeitgeber, keine Wanduhr, kein Frame, kein Griff in die Welt", () => {
    expect(uhrFunde(src).join(" · ")).toBe("");
  });
  it("…und das rote Licht ist erreichbar (Tamper an einer Kopie)", () => {
    const manipuliert = src.replace("await s.settle();", "await new Promise((r) => setTimeout(r, 0));");
    expect(manipuliert).not.toBe(src);
    expect(uhrFunde(manipuliert)).toContain("benutzt einen Zeitgeber");
  });
});
