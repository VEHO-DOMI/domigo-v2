#!/usr/bin/env node
// R5-W6b · W5 · DER REST-ZAEHLER, MATERIALREIN (D-386).
//
// Run: node scripts/measure-residue.mjs <bestand.png> <lieferung.png>
//                                       [--min-field N] [--max-field N] [--json]
//      node scripts/measure-residue.mjs --selftest
//
// ── WER DAS RUFT UND WARUM ──────────────────────────────────────────────────
// Die C-Bahnen (Farb-Import: C4, C5, C6 und ihre Nachfolger) nehmen umgefaerbte
// Blaetter ab. Eine ehrliche Umfaerbung faerbt ihre Flaeche GANZ um; eine
// nachlaessige laesst Flicken der alten Haut stehen. Genau daran ist AQ12f
// erkannt worden — von zwei blinden Blatt-Pruefern, nicht von einem Messgeraet.
//
// C5 hat dann versucht, die Zahl zu bauen, und drei Fassungen ehrlich verworfen
// (D-386, C5-Report §4):
//   1 · »jeder bytegleiche Nachbar der Umfaerbung« meldete Gold, Seitenblock,
//       Besatz und Buecher mit — 6 494 px am Buch, 15 516 px an der Tasche.
//       Ein Tor, das jede ehrliche Lieferung rot macht, ist so wertlos wie eins,
//       das alles durchlaesst.
//   2 · ein Farb-Kasten aus der Umfaerb-Flaeche war fuer das Buch zu eng
//       (0 statt 124) und fuer die Tasche zu weit.
//   3 · eine Farbwolke mit Umschliessungstest traf die Fundorte, zaehlte am Buch
//       aber 953 px, fuer die sich keine Stelle im Bild benennen laesst.
// Die Zahl wurde deshalb OHNE URTEIL ausgeliefert. Das war richtig — und der
// offene Punkt war die DEFINITION.
//
// ── DIE DEFINITION, DIE DEN UNTERSCHIED MACHT: MATERIAL ──────────────────────
// Alle drei Fassungen haben versucht, EINE Zahl zu bilden — und mussten dafuer
// entscheiden, welcher unveraenderte Bildpunkt »Rest« heisst und welcher
// »gehoert so«. Genau diese Entscheidung ist die, die ein Messgeraet nicht
// treffen kann: ob das unveraenderte Gold Absicht ist, weiss die BESTELLUNG,
// nicht das Bild.
//
// Also trifft dieses Werkzeug sie nicht. Es misst, was zu messen ist —
//
//   Umfaerb-Flaeche = jeder deckende Bildpunkt, den die Lieferung anders malt
//   Rest            = jeder deckende Bildpunkt AUSSERHALB davon, der bytegleich
//                     geblieben ist
//
// — und legt das Ergebnis nach MATERIAL getrennt hin, statt es zu einer Summe
// zu verruehren: Tusche, Papier, Pergament und gemalte Farbe je in einer Zeile,
// die Farbe zusaetzlich nach Farbfamilie. Das ist die Materialreinheit, um die
// es geht: 6 494 px waren nie eine Zahl, sie waren Gold PLUS Seitenblock PLUS
// Besatz PLUS Buecher, und das Wort »Rest« hat sie zusammengeklebt. Getrennt
// beantwortet dieselbe Messung die Frage, an der die Abnahme wirklich haengt:
// »ist von der HAUT etwas stehen geblieben, die umgefaerbt werden sollte« —
// und der Blatt-Pruefer sieht in derselben Tabelle, dass das unveraenderte Gold
// Gold ist und nicht sein Problem.
//
// Die Materialklassen kommen aus `material-classes.mjs` — derselben Datei, aus
// der das Farb-Tor seine Schwellen liest, und die Farbfamilie aus derselben
// `hue`-Rechnung, die `check-composition` benutzt (W5, dieselbe Sitzung). C5s
// Befund war, dass diese Klassen in mehreren Skripten dreifach liegen; eine
// vierte Kopie waere die Schuld verdoppelt.
//
// ── FELDER, NICHT STREUPUNKTE ───────────────────────────────────────────────
// Innerhalb einer Materialzeile zaehlt die FORM: ein zusammenhaengendes Feld ab
// `--min-field` Bildpunkten ist ein Flicken (zwei blinde Pruefer haben AQ12f
// genau daran erkannt), verstreute Einzelpunkte entstehen auch bei ehrlicher
// Arbeit — Antialiasing trifft zufaellig denselben Byte-Wert. Jede Zeile nennt
// deshalb ihr groesstes Feld MIT Kasten: der Pruefer weiss danach, wo er
// hinsehen muss, und das ist der eigentliche Zweck dieses Werkzeugs.
//
// ── URTEIL: NUR, WENN JEMAND EINS BESTELLT ──────────────────────────────────
// D-386s eigene Lehre bleibt stehen: eine Zahl, die man nicht erklaeren kann,
// darf kein rotes Licht ausloesen. Dieses Werkzeug DRUCKT und schweigt (Exit 0).
// Wer ein Urteil will, nennt beides — WELCHES Material umgefaerbt werden sollte
// und wie gross ein Flicken sein darf:
//
//   node scripts/measure-residue.mjs bestand.png lieferung.png \
//        --haut pergament/warm --max-field 12
//
// Das Material steht in der Bestellung; das Bild kennt es nicht. Ein Werkzeug,
// das es raet, waere Fassung vier.
//
// Es ersetzt den blinden Blatt-Pruefer NICHT (R91/R133/R152). Es sagt ihm, wo
// er zuerst hinsehen soll.
import fs from "node:fs";
import { PNG } from "pngjs";
import { OPAQUE, familyOf, fields, materialOf } from "./material-classes.mjs";
import { hue as hueOf } from "./measure-presence.mjs";

/** Wie gross ein zusammenhaengendes Feld sein muss, um ein FLICKEN zu heissen.
 *  Dieselbe Zahl, die `import-batch-aq12.mjs#MIN_PATCH` benutzt — die Probe der
 *  C-Bahn und dieses Werkzeug sollen dasselbe Wort gleich gross messen. */
export const MIN_FIELD = 12;

const rgbSame = (a, b, i) =>
  a.data[i] === b.data[i] && a.data[i + 1] === b.data[i + 1] && a.data[i + 2] === b.data[i + 2];

/** Der Name einer Materialzeile: Klasse und Farbfamilie. Die Familie kommt aus
 *  derselben `hue`-Rechnung, die `check-composition` benutzt — wo sie keinen
 *  Winkel meldet (zu wenig Buntheit), heisst die Zeile `farblos`, und das ist
 *  eine Aussage und keine Luecke. */
export const materialName = (r, g, b, a) => {
  const m = materialOf(r, g, b, a);
  const h = hueOf(r, g, b);
  return `${m.klasse}/${h === null ? "farblos" : familyOf(h)}`;
};

const kasten = (blob, W) => {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (const q of blob) {
    const x = q % W, y = (q - x) / W;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { n: blob.length, x0, x1, y0, y1 };
};

/**
 * Die ganze Messung fuer EIN Paar. Reine Funktion ueber zwei dekodierte PNGs —
 * damit der Selbsttest sie mit gebauten Bildern fahren kann, ohne Dateien.
 */
export function residue(bestand, lieferung, { minField = MIN_FIELD } = {}) {
  if (bestand.width !== lieferung.width || bestand.height !== lieferung.height) {
    throw new Error(
      `Mass weicht ab: Bestand ${bestand.width}x${bestand.height}, `
      + `Lieferung ${lieferung.width}x${lieferung.height} — ohne dieselben Koordinaten `
      + "vergleicht diese Messung zwei verschiedene Bilder Punkt fuer Punkt.",
    );
  }
  const W = bestand.width, H = bestand.height, N = W * H;

  // ── 1 · Umfaerb-Flaeche und Rest-Flaeche, in EINEM Durchgang ──────────────
  const umgefaerbt = new Uint8Array(N);
  const restMaske = new Uint8Array(N);
  let umfaerbFlaeche = 0, restPx = 0, deckend = 0;
  const proMaterial = new Map(); // name -> { px, maske }
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (bestand.data[i + 3] < OPAQUE) continue;
    deckend++;
    if (!rgbSame(bestand, lieferung, i)) { umgefaerbt[p] = 1; umfaerbFlaeche++; continue; }
    restMaske[p] = 1; restPx++;
    const name = materialName(bestand.data[i], bestand.data[i + 1], bestand.data[i + 2], bestand.data[i + 3]);
    let row = proMaterial.get(name);
    if (row === undefined) { row = { px: 0, maske: new Uint8Array(N) }; proMaterial.set(name, row); }
    row.px++; row.maske[p] = 1;
  }

  // ── 2 · was WURDE umgefaerbt — dieselbe Tabelle, andere Seite ─────────────
  // Ohne sie liest sich die Rest-Tabelle falsch herum: erst neben der Frage
  // »welches Material hat die Lieferung angefasst« bekommt eine stehen
  // gebliebene Zeile ihre Bedeutung.
  const umgefaerbtProMaterial = new Map();
  for (let p = 0; p < N; p++) {
    if (umgefaerbt[p] === 0) continue;
    const i = p * 4;
    const name = materialName(bestand.data[i], bestand.data[i + 1], bestand.data[i + 2], bestand.data[i + 3]);
    umgefaerbtProMaterial.set(name, (umgefaerbtProMaterial.get(name) ?? 0) + 1);
  }

  // ── 3 · je Material: Felder, groesstes zuerst ─────────────────────────────
  const zeilen = [];
  for (const [name, row] of proMaterial) {
    const felder = fields(row.maske, W, H).map((blob) => kasten(blob, W));
    const flicken = felder.filter((f) => f.n >= minField);
    zeilen.push({
      material: name,
      restPx: row.px,
      umgefaerbtPx: umgefaerbtProMaterial.get(name) ?? 0,
      felder: felder.length,
      flicken: flicken.length,
      groesstesFeld: felder[0] ?? null,
      ersteFlicken: flicken.slice(0, 3),
    });
  }
  zeilen.sort((a, b) => b.restPx - a.restPx);

  return {
    mass: [W, H], deckend, umfaerbFlaeche, restPx, minField,
    umgefaerbtNach: [...umgefaerbtProMaterial.entries()].sort((a, b) => b[1] - a[1]),
    materialien: zeilen,
  };
}

export const bericht = (r) => {
  const out = [
    `Mass            ${r.mass[0]}x${r.mass[1]}   ${r.deckend} deckende Bildpunkte`,
    `Umfaerbt        ${r.umfaerbFlaeche} px (${((100 * r.umfaerbFlaeche) / Math.max(1, r.deckend)).toFixed(1)} %)`
    + `   davon: ${r.umgefaerbtNach.slice(0, 4).map(([n, v]) => `${n} ${v}`).join(" · ")}`,
    `Bytegleich      ${r.restPx} px (${((100 * r.restPx) / Math.max(1, r.deckend)).toFixed(1)} %) — nach Material getrennt:`,
    "",
    `  ${"Material".padEnd(20)}${"bytegleich".padStart(11)}${"umgefaerbt".padStart(12)}`
    + `${"Felder".padStart(8)}${`ab ${r.minField}px`.padStart(9)}   groesstes Feld`,
  ];
  for (const z of r.materialien) {
    const g = z.groesstesFeld;
    out.push(`  ${z.material.padEnd(20)}${String(z.restPx).padStart(11)}${String(z.umgefaerbtPx).padStart(12)}`
      + `${String(z.felder).padStart(8)}${String(z.flicken).padStart(9)}   `
      + (g === null ? "—" : `${g.n} px  x${g.x0}-${g.x1} y${g.y0}-${g.y1}`));
  }
  return out;
};

// ── Selbsttest ───────────────────────────────────────────────────────────────
//
// Der Fall, an dem RICHTIG und PLAUSIBEL-FALSCH auseinandergehen, ist genau der,
// an dem C5s erste Fassung gescheitert ist: ein Blatt, das NEBEN der umgefaerbten
// Haut ein anderes Material traegt, das selbstverstaendlich unveraendert bleibt.
// Eine Messung ohne Materialbegriff wirft beides in EINE Zahl und macht damit
// jede ehrliche Lieferung rot. Deshalb traegt das gebaute Blatt beides:
//   · eine Goldecke  (anderes Material, unveraendert)  → eigene Zeile, nie
//                                                          in der Haut-Zeile
//   · einen Flicken alter Haut mitten im neuen Rot      → in der Haut-Zeile,
//                                                          als FELD, mit Kasten
// Ein Selbsttest, der nur eine der beiden Richtungen prueft, kann eine Messung,
// die auf alles anschlaegt, nicht von einer funktionierenden unterscheiden.
if (process.argv.includes("--selftest")) {
  const W = 60, H = 60;
  const bild = (mal) => {
    const png = new PNG({ width: W, height: H });
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) << 2;
      const [r, g, b, a] = mal(x, y);
      png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = a;
    }
    return png;
  };
  const BLAU = [40, 90, 200], ROT = [200, 55, 45], GOLD = [230, 170, 30], TUSCHE = [18, 16, 20];
  const istGold = (x, y) => x >= 46 && y >= 46;                        // 14x14 Goldecke
  const istTusche = (x, y) => x < 2 || y < 2;                          // Kontur am Rand
  const istFlicken = (x, y) => x >= 10 && x < 16 && y >= 10 && y < 16; // 6x6 = 36 px
  const bestand = bild((x, y) => istGold(x, y) ? [...GOLD, 255] : istTusche(x, y) ? [...TUSCHE, 255] : [...BLAU, 255]);
  const HAUT = "farbe/blue", METALL = "farbe/warm";
  const zeile = (r, name) => r.materialien.find((z) => z.material === name) ?? null;

  const faelle = [];
  const sag = (name, r, ok, warum) => faelle.push([name, r, ok, warum]);

  // 1 · EHRLICH: alles Blau wird Rot, Gold und Tusche bleiben
  const ehrlich = bild((x, y) => istGold(x, y) ? [...GOLD, 255] : istTusche(x, y) ? [...TUSCHE, 255] : [...ROT, 255]);
  sag("NICHT-TAMPER: eine ehrliche Umfaerbung laesst in der HAUT-Zeile nichts stehen",
    residue(bestand, ehrlich), (r) => zeile(r, HAUT) === null,
    "die Haut-Zeile ist leer, obwohl 196 px Gold und 236 px Tusche bytegleich sind");
  sag("…und das unveraenderte Gold steht in SEINER Zeile, nicht in der der Haut",
    residue(bestand, ehrlich), (r) => zeile(r, METALL)?.restPx === 196,
    "genau hier hat C5s erste Fassung Gold als »Rest« gemeldet");

  // 2 · TAMPER am MESSWERT: ein Flicken alter Haut bleibt stehen
  const flicken = bild((x, y) => istGold(x, y) ? [...GOLD, 255]
    : istTusche(x, y) ? [...TUSCHE, 255]
    : istFlicken(x, y) ? [...BLAU, 255] : [...ROT, 255]);
  sag("ein stehengebliebener Flicken alter Haut wird gefunden, gezaehlt und verortet",
    residue(bestand, flicken),
    (r) => {
      const z = zeile(r, HAUT);
      return z !== null && z.restPx === 36 && z.flicken === 1
        && z.groesstesFeld.n === 36 && z.groesstesFeld.x0 === 10 && z.groesstesFeld.x1 === 15
        && z.groesstesFeld.y0 === 10 && z.groesstesFeld.y1 === 15;
    },
    "36 px in EINEM Feld bei x10-15 y10-15, in der Zeile farbe/blue");
  sag("…und der Flicken faerbt die Gold-Zeile nicht ein",
    residue(bestand, flicken), (r) => zeile(r, METALL)?.flicken === 1 && zeile(r, METALL)?.restPx === 196,
    "Gold bleibt bei seinen 196 px");

  // 3 · Streupunkte sind kein Flicken: dieselbe Klasse, aber verteilt
  const streu = bild((x, y) => istGold(x, y) ? [...GOLD, 255]
    : istTusche(x, y) ? [...TUSCHE, 255]
    : (x % 7 === 3 && y % 7 === 3) ? [...BLAU, 255] : [...ROT, 255]);
  sag("NICHT-TAMPER: verstreute Einzelpunkte werden gezaehlt, sind aber kein Flicken",
    residue(bestand, streu), (r) => zeile(r, HAUT).restPx > 20 && zeile(r, HAUT).flicken === 0,
    "Antialiasing trifft zufaellig denselben Byte-Wert — das ist kein Rueckgabegrund");

  // 4 · und die Messung sagt auch, WAS umgefaerbt wurde
  sag("die Tabelle nennt das umgefaerbte Material beim Namen",
    residue(bestand, ehrlich), (r) => r.umgefaerbtNach[0][0] === HAUT && r.umgefaerbtNach[0][1] > 2000,
    "umgefaerbt wurde ein blaues Farbfeld");

  // 5 · ungleiches Mass ist ein harter Fehler, keine stille Naeherung
  let warf = false;
  try { residue(bestand, new PNG({ width: 10, height: 10 })); } catch { warf = true; }
  sag("zwei verschiedene Masse brechen ab, statt Punkt fuer Punkt Unsinn zu vergleichen",
    { ok: warf }, (r) => r.ok === true, "ein Wurf");

  let bad = 0;
  for (const [name, r, ok, warum] of faelle) {
    const pass = ok(r);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}`);
    if (!pass) console.error(`      erwartet: ${warum}\n      bekommen: ${JSON.stringify(r.materialien ?? r)}`);
  }
  if (bad > 0) {
    console.error(`measure-residue --selftest: ${bad} Fall/Faelle haben NICHT gebissen — dieser Messung ist nicht zu trauen`);
    process.exit(1);
  }
  console.log(`measure-residue --selftest: OK — ${faelle.length} Faelle: Gold und Tusche bleiben in ihren eigenen Zeilen, der Flicken wird gefunden und verortet, Streupunkte bleiben Streupunkte`);
  process.exit(0);
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const wert = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const dateien = argv.filter((a) => !a.startsWith("--") && a.endsWith(".png"));
if (dateien.length !== 2) {
  console.error("usage: node scripts/measure-residue.mjs <bestand.png> <lieferung.png> [--min-field N]");
  console.error("                                        [--haut <klasse/familie> --max-field N] [--json]");
  console.error("       node scripts/measure-residue.mjs --selftest");
  process.exit(2);
}
for (const f of dateien) if (!fs.existsSync(f)) { console.error(`✗ ${f} gibt es nicht`); process.exit(2); }

const r = residue(
  PNG.sync.read(fs.readFileSync(dateien[0])),
  PNG.sync.read(fs.readFileSync(dateien[1])),
  { minField: Number(wert("--min-field", MIN_FIELD)) },
);
if (argv.includes("--json")) console.log(JSON.stringify(r, null, 1));
else {
  console.log(`measure-residue: ${dateien[0]}  gegen  ${dateien[1]}`);
  for (const z of bericht(r)) console.log(z);
}

const haut = wert("--haut", null);
const maxField = wert("--max-field", null);
if (haut === null || maxField === null) {
  console.log("\n  (kein Urteil — bestellt wurde eine Messung. Wer eins will, nennt das Material aus der"
    + "\n   BESTELLUNG und die erlaubte Flickengroesse: --haut <klasse/familie> --max-field N)");
  process.exit(0);
}
const z = r.materialien.find((x) => x.material === haut);
if (z === undefined) {
  console.log(`\n✓ ${haut}: kein einziger bytegleicher Bildpunkt — von diesem Material ist nichts stehen geblieben`);
  process.exit(0);
}
const zuGross = [z.groesstesFeld, ...z.ersteFlicken].filter((f) => f !== null && f.n >= Number(maxField));
if (zuGross.length > 0) {
  console.error(`\n✗ ${haut}: Flicken ab ${maxField} px stehen geblieben — groesster ${zuGross[0].n} px `
    + `bei x${zuGross[0].x0}-${zuGross[0].x1} y${zuGross[0].y0}-${zuGross[0].y1} (${z.restPx} px insgesamt, ${z.flicken} Flicken)`);
  process.exit(1);
}
console.log(`\n✓ ${haut}: ${z.restPx} px bytegleich, aber kein Feld ab ${maxField} px `
  + "(der blinde Blatt-Pruefer entscheidet zusaetzlich, nie diese Messung allein)");
