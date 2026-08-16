#!/usr/bin/env node
// R5-W3 · W1 · BEWEGT SICH DAS DING IM BILD SO WEIT, WIE DIE ZAHL SAGT?
//
// Run:  node scripts/measure-motion.mjs <framesDir> [--role cage] [--json]
//       node scripts/measure-motion.mjs --selftest
//
// ── Warum es dieses Werkzeug gibt ──────────────────────────────────────────
// Die F-Bahn hinterließ einen Widerspruch, den niemand auflösen konnte: das
// Instrument meldete für das Käfig-Rütteln **≈16 Bildschirm-Pixel**, ein blinder
// Prüfer sah auf DENSELBEN Bildern **≈1 px** und nannte den Ranzen „furniture".
// Beides konnte nicht stimmen — und beides war nicht nachprüfbar, weil die eine
// Seite eine NACHRECHNUNG war und die andere ein EINDRUCK.
//
// Also misst dieses Werkzeug beide Seiten in derselben Einheit:
//
//   · GEZEICHNET — die Drehung, die der Zeichenort für genau dieses Bild in den
//     Beipackzettel gelegt hat (`entities[].breath.rot`, siehe PaintScene).
//     Daraus der Weg der Oberkante: h · sin(rot) · Kamera-Zoom.
//   · GEMESSEN — die Verschiebung derselben Oberkante IM BILD, über
//     Kreuzkorrelation gegen das erste Bild der Reihe, auf 1/10 px genau.
//
// Und es druckt beide Fragen getrennt, denn genau daran ging die Debatte kaputt:
//   SPANNE      = größter minus kleinster Wert über die ganze Reihe.
//                 Das ist die Zahl, die ein Instrument gern meldet.
//   NACHBARN    = Sprung von einem Bild zum nächsten.
//                 Das ist die Zahl, die ein Mensch sieht, der durchblättert.
// Eine Reihe kann 16 px Spanne haben und trotzdem in jedem Einzelschritt
// stillzustehen scheinen. Dann haben beide recht und die Reihe ist die falsche.
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ZOOM = 3; // Kamera-Zoom der Malbuch-Szene; steht so in PaintScene

/** Graustufe nach derselben Formel wie check-composition/measure-presence. */
const lum = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

/** Fenster, in dem sich über die Reihe überhaupt etwas ändert. */
export const changeBox = (frames, threshold = 12) => {
  const A = frames[0];
  const { width: W, height: H } = A;
  let x0 = W, x1 = -1, y0 = H, y1 = -1;
  for (const B of frames.slice(1)) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const d = Math.max(
          Math.abs(A.data[i] - B.data[i]),
          Math.abs(A.data[i + 1] - B.data[i + 1]),
          Math.abs(A.data[i + 2] - B.data[i + 2]),
        );
        if (d > threshold) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
  }
  return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
};

/**
 * DIE OBERKANTE, als waagrechter Schwerpunkt der dunklen Pixel im Band.
 *
 * Warum nicht Kreuzkorrelation (der erste Versuch, hier begraben): eine Drehung
 * um den Fußpunkt ist eine SCHERUNG, keine Verschiebung — die oberste Zeile
 * wandert weit, die darunter kaum. Eine einzige beste Verschiebung für das ganze
 * Band mittelt das weg und meldete 0,00 px für einen Käfig, in dem 76 % der
 * Pixel verschieden waren. Der Schwerpunkt der Silhouette misst genau das, was
 * `breath.test.ts` analytisch ausrechnet: den WEG der Oberkante.
 *
 * Gewichtet wird, wie dunkel ein Pixel gegen den hellen Grund ist — der Käfig
 * ist Tinte auf Wand, und ein Schwerpunkt ist gegen Inhalts-Änderungen (der
 * Gefangene zappelt) unempfindlicher als jeder Bildvergleich.
 */
/**
 * R5-W4b · W3 · D-170 — DER ANTEIL DES BANDES, DER SICH NICHT BEWEGT.
 *
 * F5 meldete für die p1-Buch-Wippe 2,00 px, während dasselbe Ding in denselben
 * Bildern 7,56 px zurücklegt. Die Ursache ist keine Schwelle und kein Rundungsfehler,
 * sie ist Arithmetik — und deshalb ist sie auch KORRIGIERBAR:
 *
 *   Schwerpunkt(t) = (S_bewegt(t) + S_still) / (W_bewegt + W_still)
 *
 * `S_still` und `W_still` stehen in JEDEM Bild an derselben Stelle. Die Differenz
 * zweier Schwerpunkte kürzt sie im Zähler weg, im NENNER bleiben sie stehen:
 *
 *   gemessen = wahr · W_bewegt / (W_bewegt + W_still) = wahr · (1 − stillerAnteil)
 *
 * Ein Band, das zur Hälfte aus unbewegter dunkler Masse besteht, meldet also exakt
 * die halbe Strecke — leise, plausibel und falsch. Genau das ist die Auflösung des
 * Widerspruchs, den die F-Bahn offen übergeben hat (Instrument 16 px gegen Prüfer
 * »≈1 px«): beide hatten recht über verschiedene Dinge.
 *
 * Diese Funktion misst den stillen Anteil, damit die Zahl korrigiert werden kann
 * statt geglaubt zu werden. »Still« heißt: in KEINEM Bild der Reihe ändert sich
 * dieser Bildpunkt. Bei einer starr verschobenen, GLEICHFARBIGEN Fläche zählt das
 * Innere fälschlich als still — bei gemalter Ware (Textur) nicht, und darum geht es
 * hier. Der Selbsttest benutzt deshalb texturierte Kästen, keine flachen.
 */
export const stillDarkShare = (frames, band, threshold = 12) => {
  const A = frames[0];
  const W = A.width;
  const vals = [];
  for (let y = band.y; y < band.y + band.h; y++) {
    for (let x = band.x; x < band.x + band.w; x++) vals.push(lum(A.data, (y * W + x) * 4));
  }
  if (vals.length === 0) return 0;
  const sorted = [...vals].sort((a, b) => a - b);
  const ground = sorted[Math.floor(sorted.length * 0.9)];
  let still = 0;
  let total = 0;
  for (let y = band.y; y < band.y + band.h; y++) {
    for (let x = band.x; x < band.x + band.w; x++) {
      const i = (y * W + x) * 4;
      const w = Math.max(0, ground - lum(A.data, i));
      if (w <= 0) continue;
      total += w;
      let moved = false;
      for (const B of frames.slice(1)) {
        if (Math.abs(lum(A.data, i) - lum(B.data, i)) > threshold) { moved = true; break; }
      }
      if (!moved) still += w;
    }
  }
  return total === 0 ? 0 : still / total;
};

/** Was der Schwerpunkt gemeldet hätte, wenn nur das Bewegte im Band gelegen wäre. */
export const undilute = (measured, share) => (share >= 1 ? null : measured / (1 - share));

export const topCentroid = (png, band) => {
  const W = png.width;
  const vals = [];
  for (let y = band.y; y < band.y + band.h; y++) {
    for (let x = band.x; x < band.x + band.w; x++) vals.push(lum(png.data, (y * W + x) * 4));
  }
  if (vals.length === 0) return null;
  const sorted = [...vals].sort((a, b) => a - b);
  const ground = sorted[Math.floor(sorted.length * 0.9)]; // der helle Grund
  let sw = 0, sx = 0;
  for (let y = band.y; y < band.y + band.h; y++) {
    for (let x = band.x; x < band.x + band.w; x++) {
      const w = Math.max(0, ground - lum(png.data, (y * W + x) * 4));
      sw += w; sx += w * x;
    }
  }
  return sw === 0 ? null : sx / sw;
};

/**
 * Waagrechte Verschiebung von B gegen A im Fensterband, auf Subpixel genau.
 * Bleibt als Gegenprobe: sie beantwortet „wie stark ändert sich das Bild",
 * nicht „wie weit wandert die Oberkante".
 */
export const shiftPx = (A, B, band, span = 24) => {
  const W = A.width;
  const at = (s) => {
    let sad = 0, n = 0;
    for (let y = band.y; y < band.y + band.h; y++) {
      for (let x = band.x; x < band.x + band.w; x++) {
        const xs = x + s;
        if (xs < 0 || xs >= W) continue;
        sad += Math.abs(lum(A.data, (y * W + x) * 4) - lum(B.data, (y * W + xs) * 4));
        n++;
      }
    }
    return n === 0 ? Infinity : sad / n;
  };
  let best = 0, bestV = Infinity;
  for (let s = -span; s <= span; s++) {
    const v = at(s);
    if (v < bestV) { bestV = v; best = s; }
  }
  const l = at(best - 1), r = at(best + 1);
  const denom = l - 2 * bestV + r;
  const sub = Number.isFinite(l) && Number.isFinite(r) && denom !== 0
    ? 0.5 * (l - r) / denom
    : 0;
  return best + Math.max(-1, Math.min(1, sub));
};

const stats = (xs) => {
  const span = Math.max(...xs) - Math.min(...xs);
  let maxAdj = 0, sumAdj = 0;
  for (let i = 1; i < xs.length; i++) {
    const d = Math.abs(xs[i] - xs[i - 1]);
    maxAdj = Math.max(maxAdj, d);
    sumAdj += d;
  }
  return { span, maxAdj, meanAdj: xs.length > 1 ? sumAdj / (xs.length - 1) : 0 };
};

// ── der Selbsttest ──────────────────────────────────────────────────────────
// Drei Fälle mit BEKANNTER Antwort, und sie sind so gewählt, dass ein Messgerät,
// das immer dasselbe zurückgibt, an mindestens einem scheitert: 0 px, +7 px,
// −5 px. Zusätzlich ein Bruchteils-Fall, weil der ganze Streit im
// Subpixel-Bereich stattfindet: ein um 30 % nach rechts gemischter Rand muss
// zwischen 0 und 1 landen, nicht auf 0 einrasten.
const selftest = () => {
  const fails = [];
  const W = 200, H = 120;
  const make = (offset, blend = 0) => {
    const png = new PNG({ width: W, height: H });
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        // strukturierter Grund, damit die Korrelation etwas zu greifen hat
        let v = 40 + ((x * 7 + y * 3) % 23);
        const inBox = x >= 60 + offset && x < 100 + offset && y >= 30 && y < 90;
        if (inBox) v = 200 + ((x * 13) % 31);
        if (blend > 0) {
          const inShift = x - 1 >= 60 + offset && x - 1 < 100 + offset && y >= 30 && y < 90;
          if (inShift !== inBox) v = Math.round(v * (1 - blend) + (inBox ? 40 : 200) * blend);
        }
        png.data[i] = v; png.data[i + 1] = v; png.data[i + 2] = v; png.data[i + 3] = 255;
      }
    }
    return png;
  };
  const band = { x: 55, y: 30, w: 60, h: 20 };
  const base = make(0);
  for (const want of [0, 7, -5]) {
    const got = shiftPx(base, make(want), band);
    if (Math.abs(got - want) > 0.35) fails.push(`Verschiebung ${want} px wurde als ${got.toFixed(2)} gemessen`);
  }
  const frac = shiftPx(base, make(0, 0.3), band);
  if (!(frac > 0.03 && frac < 1)) {
    fails.push(`ein Bruchteils-Versatz wurde als ${frac.toFixed(3)} gemessen — das Gerät rastet auf ganze Pixel ein`);
  }

  // …und dasselbe für den Schwerpunkt, der die eigentliche Antwort liefert.
  // Ein DUNKLER Kasten auf hellem Grund, weil der Käfig Tinte auf Wand ist.
  const dark = (offset) => {
    const png = new PNG({ width: W, height: H });
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const inBox = x >= 60 + offset && x < 100 + offset && y >= 30 && y < 90;
        const v = inBox ? 30 : 220;
        png.data[i] = v; png.data[i + 1] = v; png.data[i + 2] = v; png.data[i + 3] = 255;
      }
    }
    return png;
  };
  const c0 = topCentroid(dark(0), band);
  for (const want of [0, 7, -5]) {
    const got = topCentroid(dark(want), band) - c0;
    if (Math.abs(got - want) > 0.2) fails.push(`Schwerpunkt: ${want} px wurde als ${got.toFixed(2)} gemessen`);
  }
  // …und eine SCHERUNG (oben weit, unten gar nicht) muss als halber Weg
  // herauskommen — genau der Fall, an dem die Kreuzkorrelation gescheitert ist
  {
    const sheared = new PNG({ width: W, height: H });
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const off = y >= 30 && y < 90 ? Math.round(8 * (1 - (y - 30) / 60)) : 0;
        const inBox = x >= 60 + off && x < 100 + off && y >= 30 && y < 90;
        const v = inBox ? 30 : 220;
        sheared.data[i] = v; sheared.data[i + 1] = v; sheared.data[i + 2] = v; sheared.data[i + 3] = 255;
      }
    }
    const got = topCentroid(sheared, band) - c0;
    if (!(got > 4 && got < 8.5)) {
      fails.push(`eine Scherung von 8 px oben auf 0 unten wurde als ${got.toFixed(2)} gemessen — erwartet 4…8,5`);
    }
  }
  // ── D-170 · DER FALL, DEN DIESER SELBSTTEST NICHT HATTE ────────────────────
  // Alle Fälle oben stellen ein EINZIGES bewegtes Ding auf leeren Grund: `dark()`
  // ist zweiwertig, es gibt keine stehende dunkle Masse. Damit war die Verdünnung
  // per Konstruktion unsichtbar, und das Gerät konnte 2,00 px für 7,56 px melden,
  // ohne dass ein Tor etwas sagte. Hier steht jetzt ein zweiter, STEHENDER Kasten im
  // selben Band. Beide sind texturiert — bei einer glatten Fläche zählt das Innere
  // eines starr verschobenen Kastens fälschlich als »still«, und der Fall würde das
  // Falsche prüfen.
  {
    // Die Textur ist an den KASTEN geheftet (x − offset), nicht ans Bild. Erster
    // Versuch dieser Fixture heftete sie an feste Bildkoordinaten — dann ändert sich
    // beim Verschieben kein einziger Bildpunkt im Inneren, und der stille Anteil
    // meldete 85 % statt 20 %. Der Selbsttest hat das selbst gefangen; er stünde sonst
    // grün über einer Messung, die das Gegenteil misst. Ein Verlauf statt eines
    // Musters, damit jeder Punkt sich um mehr als die Schwelle (12) ändert.
    const zwei = (offset, mitStehendem = true) => {
      const png = new PNG({ width: W, height: H });
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          const k = x - offset - 60;
          let v = 220;
          if (k >= 0 && k < 40 && y >= 30 && y < 90) v = 30 + k * 2;
          else if (mitStehendem && x >= 108 && x < 115 && y >= 30 && y < 90) v = 30 + (x - 108) * 2;
          png.data[i] = v; png.data[i + 1] = v; png.data[i + 2] = v; png.data[i + 3] = 255;
        }
      }
      return png;
    };
    const reihe = [zwei(0), zwei(7)];
    const roh = topCentroid(zwei(7), band) - topCentroid(zwei(0), band);
    const anteil = stillDarkShare(reihe, band);
    const korrigiert = undilute(roh, anteil);

    // 1 · der Defekt ist da und wird beziffert: 7 px wahr, roh deutlich weniger
    if (!(roh > 4.5 && roh < 6.5)) {
      fails.push(`der stille Kasten müsste 7 px auf rund 5,6 px verdünnen; gemessen ${roh.toFixed(2)}`);
    }
    // 2 · das Gerät WEISS, wie viel des Bandes steht (vorher: keine Ahnung)
    if (!(anteil > 0.1 && anteil < 0.35)) {
      fails.push(`der stille Anteil des Bandes müsste bei rund 20 % liegen; gemessen ${(anteil * 100).toFixed(0)} %`);
    }
    // 3 · und die korrigierte Zahl trifft die Wahrheit wieder
    if (Math.abs(korrigiert - 7) > 0.5) {
      fails.push(`nach der Korrektur müssten es wieder 7 px sein; gemessen ${korrigiert.toFixed(2)}`);
    }
    // 4 · und die Korrektur darf ein sauberes Band NICHT verbiegen: dieselbe Reihe
    //     OHNE den stehenden Kasten muss ~0 % stille Masse und die vollen 7 px melden
    const sauber = stillDarkShare([zwei(0, false), zwei(7, false)], band);
    if (sauber > 0.05) {
      fails.push(`ein Band ohne stehende Masse müsste 0 % melden; gemessen ${(sauber * 100).toFixed(0)} %`);
    }
    const sauberRoh = topCentroid(zwei(7, false), band) - topCentroid(zwei(0, false), band);
    if (Math.abs(sauberRoh - 7) > 0.3) {
      fails.push(`ohne stehende Masse müsste der rohe Schwerpunkt 7 px melden; gemessen ${sauberRoh.toFixed(2)}`);
    }
  }

  const box = changeBox([base, make(7)]);
  if (box === null || box.w < 5) fails.push("das Änderungs-Fenster findet die bewegte Fläche nicht");
  if (box !== null && (box.y > 30 || box.y + box.h < 90)) {
    fails.push(`das Änderungs-Fenster (${box.y}…${box.y + box.h}) deckt die bewegte Fläche (30…90) nicht`);
  }

  if (fails.length > 0) {
    for (const f of fails) console.error(`✗ ${f}`);
    console.error("\nmeasure-motion --selftest: FEHLGESCHLAGEN — keiner Zahl dieses Werkzeugs ist zu trauen");
    process.exit(1);
  }
  console.log("measure-motion --selftest: OK");
  console.log("  Verschiebung 0 / +7 / −5 px exakt · Bruchteile nicht auf ganze Pixel gerundet");
  console.log("  Schwerpunkt 0 / +7 / −5 px exakt · eine SCHERUNG wird als Weg der Oberkante gelesen");
  console.log("  D-170: ein STEHENDER Kasten im Band verdünnt 7 px auf 5,6 px — das Gerät beziffert den");
  console.log("         stillen Anteil (20 %) und rechnet ihn heraus, statt die kleinere Zahl zu melden");
};

// ── CLI ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv.includes("--selftest")) { selftest(); process.exit(0); }

const dir = argv.find((a) => !a.startsWith("--"));
if (!dir) {
  console.error("usage: node scripts/measure-motion.mjs <framesDir> [--role cage] [--json]");
  process.exit(1);
}
const role = argv.indexOf("--role") === -1 ? "cage" : argv[argv.indexOf("--role") + 1];
const asJson = argv.includes("--json");

const stems = fs.readdirSync(dir)
  .filter((n) => n.endsWith(".png") && !n.startsWith("__probe"))
  .map((n) => n.replace(/\.png$/, ""))
  .sort();
if (stems.length < 2) { console.error(`${dir}: weniger als zwei Bilder`); process.exit(1); }

const rows = stems.map((stem) => {
  const sidecar = path.join(dir, `${stem}.meta.json`);
  if (!fs.existsSync(sidecar)) {
    console.error(`✗ ${stem}: kein Beipackzettel — ein Bild ohne seinen Tick ist eine Anekdote`);
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(sidecar, "utf8"));
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, `${stem}.png`)));
  const ent = (meta.entities ?? []).find((e) => e.role === role && e.breath);
  return { stem, meta, png, ent };
});

// ── WO im Bild steht das Ding? ──────────────────────────────────────────────
// Erster Versuch dieses Werkzeugs nahm das Fenster, in dem sich über die Reihe
// IRGENDETWAS ändert. Bei einer laufenden Welt ist das der ganze Bildschirm
// (Tinte, Krümel, das Kind) — und die Korrelation rastete artig auf 0 ein, weil
// unbewegter Hintergrund die Rechnung dominierte. Ein Messgerät, das die Frage
// nicht eingrenzt, misst den Hintergrund.
//
// Also kommt das Fenster aus dem Beipackzettel: Weltlage minus Kamera, mal Zoom.
// Der Ursprung eines Wesens sitzt unten mittig (dort dreht das Rütteln), die
// gezeichnete Höhe steht daneben.
const first = rows[0];
if (!first.ent?.breath?.scr) {
  console.error(`✗ ${first.stem}: der Zettel nennt keine BILDSCHIRM-Lage für »${role}«.`);
  console.error("  Erster Versuch rechnete sie aus Weltlage und Kamera nach — und traf den Jungen");
  console.error("  statt den Ranzen. Ein nachgebautes Fenster misst irgendwann den Hintergrund und");
  console.error("  meldet dann »bewegt sich nicht«. Neu aufnehmen mit scripts/shoot-world.mjs.");
  process.exit(1);
}
// ── Die Kamera muss STILLSTEHEN, sonst vergleicht man zwei Ausschnitte ──────
// Kostete diese Session eine Messreihe: das erste Bild stand noch 4 logische px
// höher (das Kind fiel gerade), und die Korrelation meldete prompt 23 px
// „Bewegung" für ein Ding, das sich nicht bewegt hatte. Ein Bild, dessen Kamera
// woanders steht, gehört nicht in dieselbe Reihe.
const camKey = (m) => `${m.camX}/${m.camY}`;
{
  const counts = new Map();
  for (const r of rows) counts.set(camKey(r.meta), (counts.get(camKey(r.meta)) ?? 0) + 1);
  const [mode] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const strays = rows.filter((r) => camKey(r.meta) !== mode);
  if (strays.length > 0) {
    console.error(`⚠ ${strays.length} Bild(er) mit abweichender Kamera (${strays.map((s) => s.stem).join(", ")})`);
    console.error(`  Reihe steht auf Kamera ${mode}; diese Bilder werden NICHT mitgemessen.`);
    if (strays.length > rows.length / 3) {
      console.error("✗ Mehr als ein Drittel der Reihe — die Kamera war nie ruhig. Neu aufnehmen (mehr --settle).");
      process.exit(1);
    }
    for (const s of strays) rows.splice(rows.indexOf(s), 1);
  }
}

const objBox = (() => {
  const s = first.ent.breath.scr;
  const W = first.png.width, H = first.png.height;
  const pad = Math.round(s.h * 0.35); // Rand, damit ein Ausschlag nicht aus dem Fenster läuft
  const x = Math.max(0, Math.round(s.x - pad));
  const y = Math.max(0, Math.round(s.y - pad));
  return {
    x, y,
    w: Math.min(W - x, Math.round(s.w + 2 * pad)),
    h: Math.min(H - y, Math.round(s.h + 2 * pad)),
  };
})();
const box = changeBox(rows.map((r) => r.png)) ?? objBox;
// die Oberkante: das obere Drittel des Wesens — dort zeigt eine Drehung um den
// Fußpunkt den längsten Weg. Und ohne das KIND darin: steht es im selben
// Fenster, misst man seine Leerlauf-Animation und nennt sie Käfig-Rütteln.
//
// ⚠ Und es ist das Fenster des WESENS, nicht das gepolsterte Kästchen drumherum.
// Kostete diese Session eine zweite Messreihe: das Band war doppelt so breit wie
// der Ranzen, die Hälfte davon unbewegte Wand — und unbewegte Wand nagelt jede
// Korrelation auf null. Die Reihe meldete »0,00 px« für einen Käfig, der sich
// nachweislich drehte.
const band = (() => {
  const s = first.ent.breath.scr;
  const heroX = (first.meta.hero.x - first.meta.camX) * ZOOM;
  const heroY = (first.meta.hero.y - first.meta.camY) * ZOOM; // Fußpunkt: Ursprung ist unten mittig
  const heroHalf = 42; // Bildschirm-px, großzügig um den gemalten Körper
  const heroTop = heroY - 84;
  let x = Math.max(0, Math.round(s.x) - 2);
  let w = Math.round(s.w) + 4;
  const bandTop = Math.max(0, Math.round(s.y));
  const bandBot = bandTop + Math.max(8, Math.round(s.h / 3));
  // …und das Kind wird nur ausgeschnitten, wenn es das Band WIRKLICH berührt.
  // Ohne die Höhenprüfung schnitt diese Zeile das Band auf 8 px zusammen, sobald
  // das Kind 80 px tiefer stand — und ein 8-px-Streifen Wand meldet treu 0,00.
  const heroTouches = heroTop < bandBot && heroY > bandTop;
  if (heroTouches && heroX + heroHalf > x && heroX < x + w) {
    if (heroX < x + w / 2) { const cut = Math.round(heroX + heroHalf - x); x += cut; w -= cut; }
    else { w = Math.round(heroX - heroHalf - x); }
  }
  return {
    x, y: Math.max(0, Math.round(s.y)),
    w: Math.max(8, w),
    h: Math.max(8, Math.round(s.h / 3)),
  };
})();
{
  let moves = 0;
  const A = first.png, W = A.width;
  for (const r of rows.slice(1)) {
    for (let y = objBox.y; y < objBox.y + objBox.h; y++) {
      for (let x = objBox.x; x < objBox.x + objBox.w; x++) {
        const i = (y * W + x) * 4;
        if (Math.max(
          Math.abs(A.data[i] - r.png.data[i]),
          Math.abs(A.data[i + 1] - r.png.data[i + 1]),
          Math.abs(A.data[i + 2] - r.png.data[i + 2]),
        ) > 12) { moves++; }
      }
    }
  }
  if (moves === 0) {
    console.error(`✗ Im Fenster des »${role}« ändert sich über die ganze Reihe KEIN Pixel — Standbild, kein Beweis.`);
    process.exit(1);
  }
}

// D-170: erst messen, wie viel des Bandes überhaupt in Bewegung ist — sonst ist jede
// Zahl darunter eine Aussage über den Hintergrund.
const stillShare = stillDarkShare(rows.map((r) => r.png), band);
if (stillShare > 0.6) {
  console.error(`✗ ${(stillShare * 100).toFixed(0)} % der dunklen Masse im Oberkanten-Band bewegt sich in `
    + "KEINEM Bild der Reihe. Der Schwerpunkt meldet dann rund "
    + `${((1 - stillShare) * 100).toFixed(0)} % des wahren Weges — die Korrektur wäre ein Faktor `
    + `${(1 / (1 - stillShare)).toFixed(1)}× und damit zu wacklig, um darauf ein Urteil zu bauen.\n`
    + "  Das Band enger fassen (das Fenster des WESENS, nicht das gepolsterte Kästchen) "
    + "oder eine Reihe schießen, in der das Ding wirklich läuft.");
  process.exit(1);
}

const baseCentroid = topCentroid(rows[0].png, band) ?? 0;
const out = rows.map((r) => {
  const rot = r.ent?.breath?.rot ?? null;
  const hPx = r.ent?.breath?.hPx ?? null;
  const drawn = rot === null ? null : Math.sin(rot) * hPx * ZOOM;
  const hero = r.meta.hero ?? {};
  const dx = r.ent ? r.ent.x - hero.x : null;
  const dy = r.ent ? r.ent.y - hero.y : null;
  const dd = dx === null ? null : Math.max(Math.abs(dx), Math.abs(dy) * (42 / 40));
  const nearT = dd === null ? null : Math.max(0, Math.min(1, (42 - dd) / 16));
  return {
    frame: r.stem,
    tick: r.meta.tick,
    shotCostTicks: r.meta.shotCostTicks ?? null,
    nearT,
    rot,
    drawnPx: drawn,
    measuredPx: (topCentroid(r.png, band) ?? 0) - baseCentroid,
    korrigiertPx: undilute((topCentroid(r.png, band) ?? 0) - baseCentroid, stillShare),
    korrelationPx: shiftPx(rows[0].png, r.png, band),
  };
});

if (asJson) {
  console.log(JSON.stringify({ box, band, zoom: ZOOM, rows: out }, null, 2));
} else {
  console.log(`Fenster des »${role}« aus dem Zettel: x ${objBox.x}…${objBox.x + objBox.w} · y ${objBox.y}…${objBox.y + objBox.h}`);
  console.log(`Oberkanten-Band: y ${band.y}…${band.y + band.h} · Zoom ${ZOOM}× · (alles Bewegte im Bild: ${box.w}×${box.h} px)\n`);
  console.log(`Stiller Anteil des Bandes: ${(stillShare * 100).toFixed(0)} % der dunklen Masse bewegt sich nie `
    + `⇒ der rohe Schwerpunkt meldet ${((1 - stillShare) * 100).toFixed(0)} % des Weges (Korrektur ×`
    + `${(1 / (1 - stillShare)).toFixed(2)}).\n`);
  console.log("Bild                  Tick  Kosten  nearT      rot   gezeichnet   Oberkante   korrigiert");
  for (const r of out) {
    console.log(
      `${r.frame.padEnd(20)} ${String(r.tick).padStart(5)} ${String(r.shotCostTicks ?? "?").padStart(7)} `
      + `${(r.nearT ?? 0).toFixed(2).padStart(6)} ${(r.rot ?? 0).toFixed(4).padStart(8)} `
      + `${(r.drawnPx ?? 0).toFixed(2).padStart(12)} ${r.measuredPx.toFixed(2).padStart(11)} `
      + `${(r.korrigiertPx ?? 0).toFixed(2).padStart(12)}`,
    );
  }
  const d = stats(out.map((r) => r.drawnPx ?? 0));
  const m = stats(out.map((r) => r.measuredPx));
  const k = stats(out.map((r) => r.korrigiertPx ?? 0));
  console.log("\n                     SPANNE (Instrument)   NACHBARN max   NACHBARN Mittel");
  console.log(`  gezeichnet        ${d.span.toFixed(2).padStart(15)} px ${d.maxAdj.toFixed(2).padStart(13)} ${d.meanAdj.toFixed(2).padStart(17)}`);
  console.log(`  roh gemessen      ${m.span.toFixed(2).padStart(15)} px ${m.maxAdj.toFixed(2).padStart(13)} ${m.meanAdj.toFixed(2).padStart(17)}`);
  console.log(`  KORRIGIERT        ${k.span.toFixed(2).padStart(15)} px ${k.maxAdj.toFixed(2).padStart(13)} ${k.meanAdj.toFixed(2).padStart(17)}`);
  console.log("\n(SPANNE ist, was ein Instrument meldet. NACHBARN ist, was ein Mensch beim Durchblättern sieht.)");
}
