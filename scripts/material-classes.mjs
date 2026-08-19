#!/usr/bin/env node
// R5-W6b · W5 · DAS MATERIAL-VOKABULAR DES KAPITELS, AN EINER STELLE.
//
// Warum es diese Datei gibt, und es ist ein gemeldeter Befund, keine Aufraeumung
// aus Geschmack: C5 hat beim Rest-Zaehler (D-386) drei Fassungen gebaut und alle
// drei verworfen, und in ihrem Report steht die Ursache — »die Materialklassen
// (Stoff / Metall / Papier / Tusche) liegen ohnehin in mehreren Skripten
// dreifach«. Wer eine vierte Kopie anlegt, um eine Schuld zu schliessen, hat die
// Schuld verdoppelt.
//
// Also stehen die Schwellen und die drei Rechnungen, die aus einem Bildpunkt
// eine MATERIALKLASSE machen, ab jetzt hier — einmal. `check-colour-truth.mjs`
// exportiert sie weiterhin unter denselben Namen (jeder bisherige Leser bleibt
// unberuehrt); `measure-residue.mjs` holt sie sich hier ab und muss dafuer NICHT
// das Farb-Tor importieren, das beim Laden sofort neun Blaetter misst
// (Seiteneffekt, von C5 ausdruecklich als Falle benannt).
//
// Diese Datei RECHNET beim Laden nichts. Das ist ihre einzige Bedingung.

// ── the measurement ──────────────────────────────────────────────────────────
export const OPAQUE = 200;   // α below this is the sprite's soft edge
export const INK_V = 0.22;   // below: the drawn contour
export const PAPER_S = 0.38; // below: page white, highlight, eye
export const PARCHMENT = 0.45; // warm chroma below this: the aged-paper base

// ── R5-W5 · W4 · D-220 · DIE ZWEITE UNTERSCHEIDUNG ───────────────────────────
//
// Die Pergament-Regel oben verwirft JEDEN warmen Bildpunkt unter der Chroma-
// Schwelle. An den neun Bestandsblättern ist das richtig. An AQ12s rotem Buch
// ist es falsch: dort IST warm-und-flau der Bucheinband. 58 413 Bildpunkte
// fallen weg, übrig bleiben die Goldecken, und das Blatt liest »warm 38°«
// statt rot. Jedes künftige Blatt in gedeckten Tönen trifft dasselbe (D-220).
//
// GEMESSEN, NICHT GERATEN (2026-08-17, alle zehn Blätter). Die Masse, die heute
// als Pergament wegfällt, liegt auf dem BESTAND bei einem Mittelton von
// 34…42° (die Füllfeder bei 58°) — das ist Creme, also Altpapier. Auf AQ12s
// Buch liegt sie bei 3°. Das ist kein Papier, das ist Rot.
//
// Der Flächenanteil ALLEIN trennt nicht: die Pergament-Masse des Bestands ist
// groß (Schere 36 %, Schultasche 38 %, Füllfeder 22 %) und zusammenhängend, und
// sie als Farbe zu zählen würde die Warm-Mitte über die Drift-Grenze schieben.
// Der Farbton allein würde reichen, wäre aber zerbrechlich: ein einzelner
// dunkelroter Schatten dürfte kein Blatt umkippen.
//
// Also beides, und in dieser Reihenfolge: warm-und-flau bleibt Pergament, ES SEI
// DENN die Bildpunkte gehören zu einem ZUSAMMENHÄNGENDEN FELD, das außerhalb
// des Papier-Tonbands liegt UND groß genug ist, um ein Farbfeld zu sein.
//
// Die Zahlen sind an genau dieser Trennung gewählt. Größtes zusammenhängendes
// Feld außerhalb des Papierbands, in Prozent der deckenden Fläche:
//   Bestand:  0,00 · 0,02 · 0,03 · 0,11 · 0,11 · 0,25 · 0,28 · 0,35 · 0,37 %
//   AQ12-Buch:                                                        59,49 %
// Zwischen 0,37 und 59,49 liegt ein Faktor 160. FIELD_MIN_SHARE = 5 % ist die
// geometrische Mitte dieser Lücke (√(0,37 · 59,5) ≈ 4,7): dreizehnmal über
// allem, was der Bestand hat, und zwölfmal unter dem Fall, den die Regel fangen
// soll. Ein Schwellenwert mitten in einer leeren Lücke ist ein Schwellenwert,
// über den man nicht streiten muss.

/** Der Tonbereich, in dem altpapierfarbene Grundierung lebt: Creme über Sand
 *  bis Strohgelb. Gemessen an den neun Bestandsblättern (Mitteltöne 34…58°),
 *  mit Luft nach beiden Seiten. */
export const PAPER_HUE = Object.freeze([30, 70]);

/** Wie groß ein zusammenhängendes Feld außerhalb des Papierbands sein muss,
 *  bevor es als gemaltes Farbfeld zählt und nicht als Grundierung. */
export const FIELD_MIN_SHARE = 0.05;

/** RGB → [hue°, saturation, value]. */
export function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d !== 0) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx === 0 ? 0 : d / mx, mx];
}

/** The five families a hue can belong to. Boundaries are the classic ones; the
 *  point of the partition is that BETWEEN families the distance is ≥ 60° and
 *  WITHIN the warm family it is not. */
export function familyOf(h) {
  if (h >= 260 && h < 300) return "violet";
  if (h >= 300 && h < 345) return "pink";
  if (h >= 180 && h < 260) return "blue";
  if (h >= 75 && h < 180) return "green";
  return "warm"; // 345–360 · 0–75: red, orange, yellow, brown
}

/** Which family each of the book's ten colour words belongs to. `neutral` words
 *  carry no hue at all, so they collide with nothing. */
export const WORD_FAMILY = {
  red: "warm", orange: "warm", yellow: "warm", brown: "warm",
  green: "green", blue: "blue", pink: "pink",
  white: "neutral", black: "neutral", grey: "neutral",
};

/** Die zusammenhängenden Felder (8-verbunden) einer Maske, größtes zuerst.
 *  Der Flood läuft über die GANZE Komponente, bevor er über ihre Größe urteilt —
 *  ein früher Abbruch zerlegt eine Fläche in hunderte „Felder" (dieselbe Falle,
 *  die `key-fringe.mjs#keySpecks` in seinem Kommentar beschreibt). */
export const fields = (mask, w, h) => {
  const seen = new Uint8Array(w * h);
  const out = [];
  for (let p = 0; p < w * h; p++) {
    if (seen[p] === 1 || mask[p] === 0) continue;
    const blob = [];
    const stack = [p];
    seen[p] = 1;
    while (stack.length > 0) {
      const q = stack.pop();
      blob.push(q);
      const qx = q % w;
      const qy = (q - qx) / w;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = qx + dx;
          const ny = qy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const n = ny * w + nx;
          if (seen[n] === 1 || mask[n] === 0) continue;
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    out.push(blob);
  }
  return out.sort((a, b) => b.length - a.length);
};


/**
 * DIE MATERIALKLASSE EINES BILDPUNKTS — dieselbe Reihenfolge, in der
 * `check-colour-truth.mjs#measure` sie liest, als benennbare Antwort.
 *
 *   `rand`       durchsichtig oder weiche Kante (α < OPAQUE)
 *   `tusche`     die gezeichnete Kontur (V < INK_V)
 *   `papier`     Seitenweiss, Glanz, Auge (S < PAPER_S)
 *   `pergament`  warme, flaue Altpapier-Grundierung (S·V < PARCHMENT)
 *   `farbe`      ein gemaltes Farbfeld — traegt zusaetzlich seine Familie
 *
 * Die zweite Unterscheidung aus D-220 (ein grosses zusammenhaengendes Feld
 * ausserhalb des Papier-Tonbands ist doch Farbe) steckt NICHT hier drin: sie
 * braucht Nachbarschaft, also das ganze Bild. Wer sie will, ruft `measure`.
 * Diese Funktion beantwortet die Frage »welches Material ist dieser eine
 * Bildpunkt« — und sagt es dem Aufrufer mit `familie: null`, wo sie keine hat.
 */
export const materialOf = (r, g, b, a) => {
  if (a < OPAQUE) return { klasse: "rand", familie: null };
  const [hu, s, v] = hsv(r, g, b);
  if (v < INK_V) return { klasse: "tusche", familie: null };
  if (s < PAPER_S) return { klasse: "papier", familie: null };
  if (familyOf(hu) === "warm" && s * v < PARCHMENT) return { klasse: "pergament", familie: "warm" };
  return { klasse: "farbe", familie: familyOf(hu) };
};
