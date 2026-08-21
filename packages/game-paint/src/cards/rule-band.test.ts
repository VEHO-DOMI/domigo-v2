// R5-W7 · D5 · P6/R196 — DAS BUCH-FENSTER DER REGEL-SEITE, ALS MASCHINEN-GESETZ.
//
// Beide Material-Kritiker der P6-Runde nannten unabhängig voneinander dieselbe
// Stelle: »zwei harte schwarze Streifen mit exakt senkrechten, pixelscharfen
// Kanten« links und rechts im Buch-Fenster (`.pb-rule-band`). Am Bank-Foto
// nachgemessen waren es je acht Bildpunkte mit rgb(2, 6, 8), während die 660
// Spalten dazwischen im Mittel bei 131 lagen — rund zwanzigmal heller.
//
// Die Ursache war NICHT, was sie zu sein schien. »Ein Bild, das sein Fenster
// nicht ausfüllt« hätte durchscheinendes Papier bedeutet; eine Probe mit rot
// eingefärbtem Bandhintergrund zeigte die Streifen unverändert schwarz. Es ist
// der gemalte BUCHDECKEL: das Band zeigt einen waagrechten Streifen aus der
// Mitte eines 4:3-Blattes, und genau in diesem Streifen sind die äußersten
// deckenden Bildpunkte des Blattes die fast schwarze Deckelkante. Bei Breite
// 100 % liegen sie bündig an der Tuschekante und lesen sich als zwei Balken.
//
// WARUM DAS EIN TEST IST UND KEINE ZAHL IM STYLESHEET. Die Reparatur ist eine
// Vergrößerung (das Fenster rahmt die aufgeschlagenen SEITEN statt des
// Deckels), und eine Vergrößerung ist genau die Sorte Literal, die still
// veraltet: ein neues Kapitel-Blatt kann seine dunkle Kante weiter innen
// tragen, und niemand würde es merken, bis wieder ein Kritiker es sieht.
// Hier wird deshalb das GESETZ geprüft und nicht die Zahl — aus dem
// ausgelieferten PNG, für jede plausible Kartenbreite.
//
// Der Decoder unten ist absichtlich klein und gehört dieser Datei — dieselbe
// Begründung wie in `guardian-flight.test.ts`: `pngjs` ist im Wurzel-
// `package.json` deklariert, nicht in diesem Paket, und eine Abhängigkeit in
// ein Paket zu schreiben, an dem acht Bahnen gleichzeitig arbeiten, ist teurer
// als dreißig Zeilen Auspacken.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { PAINT_OVERLAY_CSS } from "./overlay-css.ts";

const ART = path.resolve(__dirname, "../../../../apps/web/public/art/g1/paint/ch01");

/** Das Papier, auf dem die Karte liegt (`--pb-paper`) — was ein durchsichtiger
 *  Bildpunkt im Fenster in Wahrheit zeigt. */
const PAPER: readonly [number, number, number] = [255, 242, 205];

/** RGBA8, nicht interlaced — genau das, was dieses Kapitel ausliefert. */
const decode = (file: string): { w: number; h: number; px: Buffer } => {
  const buf = fs.readFileSync(file);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  expect(buf[24], `${file}: 8 bit je Kanal erwartet`).toBe(8);
  expect(buf[25], `${file}: RGBA erwartet`).toBe(6);
  const chunks: Buffer[] = [];
  for (let off = 8; off + 8 <= buf.length;) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    if (type === "IDAT") chunks.push(buf.subarray(off + 8, off + 8 + len));
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const px = Buffer.alloc(w * h * 4);
  const bpp = 4, stride = w * bpp;
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)]!;
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? px[y * stride + i - bpp]! : 0;
      const b = y > 0 ? px[(y - 1) * stride + i]! : 0;
      const c = i >= bpp && y > 0 ? px[(y - 1) * stride + i - bpp]! : 0;
      let v = line[i]!;
      if (ft === 1) v += a;
      else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[y * stride + i] = v & 0xff;
    }
  }
  return { w, h, px };
};

/** Die Deklarationen einer Regel, aus dem Stylesheet gelesen statt getippt.
 *  Kommentare fliegen vorher raus — dieses Stylesheet erklärt sich ausführlich,
 *  und ein Kommentar zwischen zwei Regeln gehört sonst zum Selektor. */
const CSS_OHNE_KOMMENTARE = PAINT_OVERLAY_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
const ruleOf = (sel: string): string => {
  for (const m of CSS_OHNE_KOMMENTARE.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if ((m[1] ?? "").trim() === sel) return m[2] ?? "";
  }
  return "";
};
const numOf = (decls: string, prop: string): number => {
  const m = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([0-9.]+)`).exec(decls);
  expect(m, `${prop} fehlt in der Regel`).not.toBeNull();
  return Number(m![1]);
};

describe("R5-W7 · D5 · das Buch-Fenster der Regel-Seite (P6/R196)", () => {
  const band = ruleOf(".pb-rule-band");
  const bandImg = ruleOf(".pb-rule-band img");

  it("die Schranke ist ausdrücklich aufgehoben — ohne sie wäre jede Vergrößerung wirkungslos", () => {
    // GEMESSEN, nicht vermutet: die App setzt global »img max-width 100 %«.
    // Mit »width 118 %« und ohne diese Zeile rechnete der Browser weiter
    // 384,5 px statt 453,7 px, und das Bank-Foto war vorher/nachher bytegleich.
    // Ein Bild, das absichtlich über sein Fenster hinausragt, muss die
    // Schranke aufheben — sonst ist die Zahl darüber eine Behauptung.
    expect(bandImg).toMatch(/max-width\s*:\s*none/);
  });

  it("das Fenster zeigt nur BILD — kein Papierspalt und kein schwarzer Balken an der Tuschekante", () => {
    const zoom = /--pb-rule-band-zoom\s*:\s*([0-9.]+)%/.exec(band)?.[1];
    expect(zoom, "der Vergrößerungs-Wert des Bandes fehlt").toBeDefined();
    const z = Number(zoom) / 100;
    expect(z).toBeGreaterThanOrEqual(1);

    // Die Geometrie des Bandes, aus dem Stylesheet und nicht aus dem Gedächtnis.
    const H = numOf(band, "height");
    const bw = /border-width\s*:\s*([0-9.]+)px\s+([0-9.]+)px\s+([0-9.]+)px\s+([0-9.]+)px/.exec(band);
    expect(bw, "die vier Rahmenbreiten des Bandes fehlen").not.toBeNull();
    const Hc = H - Number(bw![1]) - Number(bw![3]);          // Inhaltshöhe (border-box)
    const shift = Number(/translate\(-50%,\s*-([0-9.]+)%\)/.exec(bandImg)?.[1] ?? "NaN") / 100;
    expect(Number.isFinite(shift)).toBe(true);

    const { w, h, px } = decode(path.join(ART, "plate_ch01_rule.png"));
    /** Was ein Bildpunkt im Fenster WIRKLICH zeigt: durchsichtig heißt Papier. */
    const shown = (x: number, y: number): number => {
      const i = (y * w + x) * 4;
      const a = px[i + 3]! / 255;
      return ((px[i]! * a + PAPER[0] * (1 - a)) + (px[i + 1]! * a + PAPER[1] * (1 - a))
        + (px[i + 2]! * a + PAPER[2] * (1 - a))) / 3;
    };
    const opaque = (x: number, y: number): boolean => px[(y * w + x) * 4 + 3]! >= 250;

    // Waagrecht hängt das Fenster nur an der Vergrößerung, senkrecht auch an der
    // Kartenbreite — also wird über die ganze plausible Spanne geprüft, vom
    // schmalen Telefon bis zur breiten Bühne.
    const colFrom = Math.ceil((w * (1 - 1 / z)) / 2);
    const colTo = Math.floor((w * (1 + 1 / z)) / 2) - 1;
    /** So breit war der Balken, den die Kritiker sahen: acht Bildpunkte. */
    const RAND = 8;
    /** Ein Balken war 5,6 % des Fenstermittels. Alles ab einem Drittel ist die
     *  eigene Schattierung des Buches, kein Balken. */
    const MIN_ANTEIL = 0.35;

    for (const Wc of [240, 280, 320, 360, 400, 440, 480, 520]) {
      const s = (z * Wc) / w;                                  // Bildpunkte je Quellpunkt
      const mitte = shift * h;                                 // wohin -46 % das Blatt zieht
      const rowFrom = Math.max(0, Math.floor(mitte - Hc / 2 / s));
      const rowTo = Math.min(h - 1, Math.ceil(mitte + Hc / 2 / s));
      const spalte = (x: number): number => {
        let sum = 0;
        for (let y = rowFrom; y <= rowTo; y++) sum += shown(x, y);
        return sum / (rowTo - rowFrom + 1);
      };
      let fenster = 0, n = 0;
      for (let x = colFrom; x <= colTo; x += 9) { fenster += spalte(x); n++; }
      fenster /= n;

      const rand = [
        ...Array.from({ length: RAND }, (_, i) => colFrom + i),
        ...Array.from({ length: RAND }, (_, i) => colTo - i),
      ];
      for (const x of rand) {
        for (let y = rowFrom; y <= rowTo; y++) {
          expect(opaque(x, y), `Kartenbreite ${Wc}: Spalte ${x}, Zeile ${y} ist durchsichtig — das Fenster zeigt Papier statt Bild`).toBe(true);
        }
        const m = spalte(x);
        expect(m / fenster, `Kartenbreite ${Wc}: Spalte ${x} steht bei ${m.toFixed(1)} gegen ein Fenstermittel von ${fenster.toFixed(1)} — das ist der schwarze Balken aus P6`)
          .toBeGreaterThanOrEqual(MIN_ANTEIL);
      }
    }
  });
});
