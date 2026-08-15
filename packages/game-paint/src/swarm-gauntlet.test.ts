// R5-W4 · B4 · D-85 / R43 — WIE VIELE RAD-KARTEN GARANTIERT DER SPIESSRUTENLAUF?
//
// Kokis Vorgabe (R43): drei. Das Dossier (p2.md §6.3) schrieb bisher „zwei" —
// aus einer Handrechnung. Eine Handrechnung in Prosa ist genau die Sorte Zahl,
// die still falsch wird; also rechnet sie ab jetzt diese Datei, aus dem Level
// und aus `PAINT`, ohne eine einzige getippte Konstante.
//
// DAS MODELL (das des Dossiers, hier nachgerechnet statt zitiert):
//   · Eine Karte endet im schlimmsten Fall am OST-Kontaktrand `home + 38`
//     (Schwank 24 + Kontaktbox 14).
//   · Danach ist das Kind `PAINT.iframeTicks` lang unverwundbar und legt dabei
//     höchstens `runMax` px je Tick zurück — der „Träger".
//   · Der nächste Schwarm fragt also nur, wenn sein WEST-Kontaktrand jenseits
//     davon liegt: `home_j - home_i > 38 + Träger + 38`.
//
// Der Träger ist eine ZEIT, keine Strecke. Deshalb ist die Schranke konservativ:
// das aufgenommene Band bedient tatsächlich alle drei Schwärme, weil ein
// sorgfältiger Lauf langsamer ist als der schnellstmögliche. Garantiert ist,
// was auch der schnellste Lauf nicht umgehen kann — und das sind zwei.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PAINT, SUBS, TILE } from "./paint.ts";
import type { PaintLevel } from "./level.ts";

const LEVEL_PATH = path.resolve(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
const level = JSON.parse(fs.readFileSync(LEVEL_PATH, "utf8")) as PaintLevel;
const p2 = level.phases.find((p) => p.id === "p2")!;
const swarms = p2.entities.filter((e) => e.role === "swarm");

const EDGE_PX = 38; // sway 24 + contact box 14 — the dossier's own contact edge
const carrierPx = PAINT.iframeTicks * (PAINT.runMax / SUBS);
const needPx = EDGE_PX + carrierPx + EDGE_PX;
const homeX = (c: number): number => c * TILE + TILE / 2;

/** How many of these columns can still raise a card, worst case. */
const guaranteed = (cols: readonly number[]): number => {
  let n = 0;
  let coveredTo = -Infinity;
  for (const c of [...cols].sort((a, b) => a - b)) {
    if (homeX(c) <= coveredTo) continue; // the carrier bridged this one
    n++;
    coveredTo = homeX(c) + needPx;
  }
  return n;
};

describe("D-85 · der Träger und was er verschluckt", () => {
  it("die Zahlen kommen aus der Engine, nicht aus dem Fließtext", () => {
    expect(PAINT.iframeTicks).toBe(120);
    expect(PAINT.runMax / SUBS).toBe(2.25);
    expect(carrierPx).toBe(270);
    expect(needPx).toBe(346);
  });

  it("VAKUITÄT: es gibt drei Schwärme, und sie stehen 240 px auseinander", () => {
    expect(swarms.map((e) => e.c)).toEqual([26, 41, 56]);
    const gaps = swarms.slice(1).map((e, i) => homeX(e.c) - homeX(swarms[i]!.c));
    expect(gaps).toEqual([240, 240]);
    expect(Math.min(...gaps)).toBeLessThan(needPx); // …which is under the bar
  });

  it("★ garantiert sind ZWEI Karten, nicht drei (D-85, gemessen)", () => {
    expect(guaranteed(swarms.map((e) => e.c))).toBe(2);
  });

  it("DISKRIMINIERT: derselbe Rechner sagt DREI, sobald der Abstand reicht", () => {
    // Without this the „2" above could be a calculator that can only say 2.
    const wide = [26, 26 + Math.ceil(needPx / TILE), 26 + 2 * Math.ceil(needPx / TILE)];
    expect(guaranteed(wide)).toBe(3);
  });
});

describe("D-85 · warum ein vierter Schwarm es NICHT löst", () => {
  // The passover offered „Abstände vergrößern ODER ein vierter Schwarm". The
  // second half does not survive the arithmetic, and that is worth pinning:
  // the carrier swallows every second station, so more stations at the built
  // pitch buy nothing at all.
  it("ein vierter Schwarm im gebauten Raster bringt weiterhin zwei", () => {
    expect(guaranteed([26, 41, 56, 71])).toBe(2);
    expect(guaranteed([26, 33, 41, 48, 56])).toBe(2);
  });

  it("★ KEINE Bestückung des Laufs schafft drei — der Lauf ist zu kurz", () => {
    // A moth only counts where the dossier's proof shape holds: a lid overhead
    // caps the child's feet (no jumping over), with a floor to walk on. That is
    // the corridor (lid r5 · walk r8 · floor r9) plus the cavern tower at c56.
    const usable: number[] = [];
    for (let c = 0; c < p2.rows[0]!.length; c++) {
      if (p2.rows[5]![c] === "#" && p2.rows[8]![c] === "." && p2.rows[9]![c] === "#") usable.push(c);
    }
    expect(usable[0], "der Lauf beginnt an der Schrankwand").toBe(24);
    expect(usable[usable.length - 1]).toBe(53);
    const span = [...usable, 56]; // 56 = S3, dessen Beweis der Kavernen-Turm ist

    let best = 0;
    for (let n = 3; n <= 6; n++) {
      const rec = (from: number, picked: number[]): void => {
        if (picked.length === n) { best = Math.max(best, guaranteed(picked)); return; }
        for (let k = from; k < span.length; k++) { picked.push(span[k]!); rec(k + 1, picked); picked.pop(); }
      };
      rec(0, []);
    }
    expect(best, "drei bis sechs Schwärme, jede Stellung — das Beste bleibt zwei").toBe(2);

    // …und hier steht, WORAN es liegt, damit ein späterer Umbau es sofort sieht
    const haveCells = span[span.length - 1]! - span[0]!;
    const needCells = (2 * needPx) / TILE;
    expect(haveCells).toBe(32);
    expect(needCells).toBeCloseTo(43.25, 2);
    expect(haveCells).toBeLessThan(needCells); // 11,3 Zellen Deckenlänge fehlen
  });
});
