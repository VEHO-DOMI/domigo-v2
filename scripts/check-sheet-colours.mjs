#!/usr/bin/env node
// R5-W6b · W5 · DIE FARBZAHL JE ZELLE, UND DER HELLIGKEITS-KORRIDOR (D-403 · D-404).
//
// Run: node scripts/check-sheet-colours.mjs            (exit 1 bei jedem Verstoss)
//      node scripts/check-sheet-colours.mjs --selftest (beweist das rote Licht)
//
// ── D-403 · WARUM JE ZELLE UND NICHT JE BLATTDATEI ──────────────────────────
//
// Die Bestellung AQ16b verlangt »≥ 10 000 eindeutige Farben je Blatt« — als
// Schutz gegen das, woran AQ16 gescheitert ist: eine harte Posterisierung, die
// jede Farbzahl der Bestellung trifft und dabei das Papier verliert (zwei
// blinde Pruefer nannten sie unabhaengig FLACHE FUELLUNG).
//
// Gezaehlt wurde aber die gelieferte SAMMELDATEI, und die traegt vier Zellen.
// F7 hat nachgemessen: je Zelle 6 349 · 5 972 · 5 854 · 2 915 — alle vier unter
// 10 000, waehrend die Datei mit 14 484 besteht. Die Vereinigung ueber vier
// Zellen ist immer groesser als jede einzelne; eine flache Zelle neben drei
// bunten verschwindet darin. Ein Tor, das so zaehlt, kann die Klasse, gegen die
// es gebaut ist, in genau der Lieferform nicht sehen, in der sie kommt.
//
// Die IMPORTIERTEN Blaetter sind je eine Zelle. Also zaehlt dieses Tor sie
// einzeln, aus Dateien, die im Repo liegen — kein Browser, kein Labor, ein
// echter CI-Lauf.
//
// ── UND WARUM NICHT 10 000 ──────────────────────────────────────────────────
//
// Weil die Zahl je Zelle nie erreicht war, auch nicht vom BESTAND, und ein Tor,
// das am ersten Tag rot ist, bestraft fremde Arbeit fuer einen Bestellfehler.
// F7 haelt ausserdem fest, dass das eigentliche Anliegen von R114 — die
// Struktur-Energie — erhalten ist; die Farbzahl ist ihr Stellvertreter, nicht
// sie selbst.
//
// Also eine RATSCHE statt einer Wunschzahl: kein Blatt darf unter 80 % seiner
// heute gemessenen Farbzahl fallen. Die 80 % sind nicht gewaehlt, sondern
// geliehen — es ist dieselbe Schwelle, mit der `import-batch-aq12.mjs` die
// Struktur-Quote einer Umfaerbung misst (`STRUCTURE_QUOTE_MIN = 0.80`), und aus
// demselben Grund: unter 80 % ist keine Retusche mehr, sondern ein Verlust.
// Zum Vergleich, was die Klasse tut, gegen die das Tor steht: AQ16 hat
// −95 % gemacht.
//
// Die BESTELLSPRACHE (R163) bleibt Sache des Architekten. Dieses Tor haelt
// fest, was gebaut IST — und macht rot, wenn ein Nachdruck es flacher macht.
//
// ── D-404 · DER HELLIGKEITS-KORRIDOR, MIT EINER DEKLARIERTEN AUSNAHME ───────
//
// Dieselbe Bestellung schreibt einen Korridor: HSL-L 35–60 %. Vier der fuenf
// Blaetter liegen darin. `regelseite_lit` liegt bei 66,8 % — sie ist die
// BELEUCHTETE Fassung, heller IST ihr Zweck, und die Bestellung hat dafuer
// keine Ausnahme geschrieben (F7, D-404). Sie bekommt sie hier: benannt,
// begruendet, DATIERT.
//
// Und sie ist eine Ratsche in beide Richtungen. Faellt der Messwert zurueck in
// den Korridor, wird die Ausnahme rot — »sie duldet eine bekannte Luecke; sie
// darf sie nie ueberleben« (dieselbe Bauform wie `COHERENCE_WAIVERS` in
// check-composition und `SEAM_ALLOW` in check-png-seams).
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { OPAQUE } from "./material-classes.mjs";

const ART = "apps/web/public/art/g1/paint/ch01";

/** Wie viel Farbzahl ein Nachdruck verlieren darf, bevor es kein Nachdruck mehr
 *  ist. Geliehen von `import-batch-aq12.mjs#STRUCTURE_QUOTE_MIN`. */
export const KEEP = 0.80;

/** Der bestellte Helligkeits-Korridor (AQ16b Zeile 4), in HSL-L Prozent. */
export const CORRIDOR = Object.freeze([35, 60]);

/**
 * Die Zellen unter Aufsicht. `farben` und `lum` sind GEMESSEN (2026-08-19, mit
 * dem Rezept unten) — nicht bestellt und nicht abgetippt: F7s Zahlen fuer
 * dieselben vier Zellen (6 349 · 5 972 · 5 854 · 2 915) sind damit
 * nachgerechnet, also misst dieses Tor dieselbe Wirklichkeit.
 */
export const CELLS = {
  "regelseite_a.png": { farben: 6349, lum: 57.1 },
  "regelseite_lit.png": { farben: 5972, lum: 66.8 },
  "regelseite_open.png": { farben: 5854, lum: 54.3 },
  "hud_rule.png": { farben: 2915, lum: 53.1 },
  "plate_ch01_rule.png": { farben: 16773, lum: 46.0 },
};

/** Ausnahmen vom Korridor: benannt, begruendet, datiert — und ueberwacht.
 *  `seit` ist das Datum der Messung, die sie noetig gemacht hat. */
export const CORRIDOR_WAIVERS = {
  "regelseite_lit.png": {
    seit: "2026-08-19",
    gemessen: 66.8,
    warum: "die BELEUCHTETE Fassung der Regel-Seite: heller ist ihr Zweck, nicht ihr Fehler. "
      + "Die Bestellung AQ16b hat den Korridor 35–60 % fuer alle fuenf Zellen geschrieben und "
      + "fuer diese eine keine Ausnahme vorgesehen (F7, D-404) — nachgetragen statt "
      + "importiert-und-verschwiegen",
  },
};

/** Das Rezept, mit dem gemessen wird — beide Zahlen ueber DIE DECKENDEN Punkte,
 *  damit die weiche Silhouettenkante nicht mitzaehlt (sie ist Interpolation,
 *  keine Malerei, und sie erfindet Farben). */
export function messen(png) {
  const set = new Set();
  let lum = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < OPAQUE) continue;
    set.add((png.data[i] << 16) | (png.data[i + 1] << 8) | png.data[i + 2]);
    const r = png.data[i] / 255, g = png.data[i + 1] / 255, b = png.data[i + 2] / 255;
    lum += (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
    n++;
  }
  return { farben: set.size, lum: n === 0 ? 0 : (100 * lum) / n, deckend: n };
}

/** Das ganze Urteil fuer EINE Zelle. Reine Funktion, damit der Selbsttest ihr
 *  ein getampertes Blatt geben kann statt einer erfundenen Konfiguration. */
export function urteil(name, ist, soll, waiver) {
  const schlecht = [];
  const boden = Math.round(KEEP * soll.farben);
  if (ist.farben < boden) {
    schlecht.push(`${name}: ${ist.farben} eindeutige Farben, aber die Zelle stand auf ${soll.farben} — `
      + `unter dem Boden ${boden} (${Math.round(100 * KEEP)} % davon). Das ist kein Nachdruck mehr, `
      + "sondern ein Verlust an Modulation: genau die flache Fuellung, an der AQ16 gescheitert ist");
  }
  const drin = ist.lum >= CORRIDOR[0] && ist.lum <= CORRIDOR[1];
  if (!drin && waiver === undefined) {
    schlecht.push(`${name}: HSL-L ${ist.lum.toFixed(1)} % liegt ausserhalb des bestellten Korridors `
      + `${CORRIDOR[0]}–${CORRIDOR[1]} % — entweder nachziehen oder eine benannte, datierte Ausnahme `
      + "eintragen (D-404: kein stilles Aufweichen)");
  }
  if (drin && waiver !== undefined) {
    schlecht.push(`${name}: traegt eine Korridor-Ausnahme, die es nicht mehr braucht `
      + `(HSL-L ${ist.lum.toFixed(1)} % liegt wieder in ${CORRIDOR[0]}–${CORRIDOR[1]} %) — loeschen. `
      + `Grund von ${waiver.seit}: ${waiver.warum}`);
  }
  return schlecht;
}

// ── Selbsttest ───────────────────────────────────────────────────────────────
if (process.argv.includes("--selftest")) {
  const echt = path.join(ART, "regelseite_a.png");
  if (!fs.existsSync(echt)) { console.error(`✗ ${echt} fehlt — der Selbsttest hat kein Material`); process.exit(1); }
  const png = PNG.sync.read(fs.readFileSync(echt));
  const ist = messen(png);
  const soll = CELLS["regelseite_a.png"];

  // TAMPER AM MESSWERT, nicht an der Konfiguration (P-71): dasselbe Blatt,
  // posterisiert. Das ist keine erfundene Eingabe — es ist genau das, was AQ16
  // geliefert hat, und der Fall, an dem »je Blattdatei« und »je Zelle«
  // auseinandergehen wuerden, wenn hier eine Sammeldatei laege.
  const posterisiert = new PNG({ width: png.width, height: png.height });
  png.data.copy(posterisiert.data);
  for (let i = 0; i < posterisiert.data.length; i += 4) {
    for (let k = 0; k < 3; k++) posterisiert.data[i + k] = posterisiert.data[i + k] & 0b11000000;
  }
  const platt = messen(posterisiert);

  // …und ein Blatt, das aufgehellt wurde, bis es aus dem Korridor faellt.
  // Ein REINER Versatz, kein Faktor: multiplizieren staucht alles gegen 255 und
  // laesst dabei die Farbzahl einbrechen — dann wuerde dieser Fall am Gesetz
  // der Farbzahl rot statt am Korridor, und er wuerde nichts ueber den
  // Korridor beweisen. (Der erste Anlauf tat genau das; der Selbsttest hat es
  // gemeldet, nicht ein Review.)
  const hell = new PNG({ width: png.width, height: png.height });
  png.data.copy(hell.data);
  for (let i = 0; i < hell.data.length; i += 4) {
    for (let k = 0; k < 3; k++) hell.data[i + k] = Math.min(255, hell.data[i + k] + 30);
  }
  const aufgehellt = messen(hell);

  const faelle = [
    ["NICHT-TAMPER: das echte Blatt besteht beide Gesetze",
      urteil("regelseite_a.png", ist, soll, undefined), (f) => f.length === 0],
    ["ein posterisiertes Blatt wird an der Farbzahl rot",
      urteil("regelseite_a.png", platt, soll, undefined),
      (f) => f.some((m) => m.includes("eindeutige Farben"))],
    ["…und das Tor nennt dabei die Zelle, nicht die Datei-Summe",
      urteil("regelseite_a.png", platt, soll, undefined),
      (f) => f.some((m) => m.startsWith("regelseite_a.png:"))],
    ["ein aufgehelltes Blatt ohne Ausnahme wird am Korridor rot",
      urteil("regelseite_a.png", aufgehellt, soll, undefined),
      (f) => f.some((m) => m.includes("Korridors"))],
    // Geprueft wird hier die AUSNAHME, also die Korridor-Zeile — und nur sie:
    // dasselbe aufgehellte Blatt verliert nebenbei auch Farbzahl (ein Versatz
    // von +30 staucht die hellen Toene gegen 255, gemessen 6 349 → 4 368), und
    // das ist ein zweiter, WAHRER Befund. Eine Ausnahme fuer den Korridor darf
    // ihn nicht mitverdecken.
    ["NICHT-TAMPER: mit benannter Ausnahme schweigt die KORRIDOR-Zeile",
      urteil("regelseite_a.png", aufgehellt, soll, { seit: "2026-08-19", warum: "Probe" }),
      (f) => !f.some((m) => m.includes("Korridors"))],
    ["…und die Ausnahme verdeckt den anderen Befund NICHT",
      urteil("regelseite_a.png", aufgehellt, soll, { seit: "2026-08-19", warum: "Probe" }),
      (f) => f.some((m) => m.includes("eindeutige Farben"))],
    ["eine Ausnahme, die niemand mehr braucht, wird rot",
      urteil("regelseite_a.png", ist, soll, { seit: "2026-08-19", warum: "Probe" }),
      (f) => f.some((m) => m.includes("nicht mehr braucht"))],
    ["die Messung selbst unterscheidet noch (Vakuitaet)",
      { platt: platt.farben, echt: ist.farben },
      (m) => m.echt > 4 * m.platt && m.platt > 0],
  ];

  let bad = 0;
  for (const [name, got, ok] of faelle) {
    const pass = ok(got);
    if (!pass) bad++;
    console.log(`  ${pass ? "✓" : "✗"} ${name}`);
    if (!pass) console.error(`      bekommen: ${JSON.stringify(got)}`);
  }
  console.log(`  (gemessen: echt ${ist.farben} Farben / L ${ist.lum.toFixed(1)} % · posterisiert ${platt.farben} / L ${platt.lum.toFixed(1)} % · aufgehellt L ${aufgehellt.lum.toFixed(1)} %)`);
  if (bad > 0) { console.error(`check-sheet-colours --selftest: ${bad} Fall/Faelle haben NICHT gebissen`); process.exit(1); }
  console.log(`check-sheet-colours --selftest: OK — ${faelle.length} Faelle: die Posterisierung wird gefunden, der Korridor haelt, und eine Ausnahme ueberlebt ihren Grund nicht`);
  process.exit(0);
}

// ── der Lauf ─────────────────────────────────────────────────────────────────
let failures = 0;
let gemessen = 0;
const tabelle = [];
for (const [name, soll] of Object.entries(CELLS)) {
  const datei = path.join(ART, name);
  if (!fs.existsSync(datei)) {
    failures++;
    console.error(`✗ ${name}: steht unter Aufsicht, liegt aber nicht in ${ART} — umbenannt oder geloescht, ohne diese Tabelle mitzunehmen`);
    continue;
  }
  const ist = messen(PNG.sync.read(fs.readFileSync(datei)));
  gemessen++;
  const w = CORRIDOR_WAIVERS[name];
  const schlecht = urteil(name, ist, soll, w);
  for (const m of schlecht) { failures++; console.error(`✗ ${m}`); }
  tabelle.push(`  ${name.padEnd(22)} ${String(ist.farben).padStart(6)} Farben (Boden ${String(Math.round(KEEP * soll.farben)).padStart(6)})`
    + `   HSL-L ${ist.lum.toFixed(1).padStart(5)} %`
    + (w === undefined ? "" : `   AUSNAHME seit ${w.seit}`));
}

// ── VAKUITAET ────────────────────────────────────────────────────────────────
// Eine Tabelle, die leer laeuft, meldet ein sauberes Repo fuer immer.
if (gemessen === 0) { failures++; console.error("✗ VAKUITAET: keine einzige Zelle gemessen — beide Gesetze schlafen"); }
if (Object.keys(CORRIDOR_WAIVERS).some((n) => CELLS[n] === undefined)) {
  failures++;
  console.error("✗ VAKUITAET: eine Korridor-Ausnahme zeigt auf eine Zelle, die gar nicht unter Aufsicht steht — sie kann nie ablaufen");
}

console.log("\ncheck-sheet-colours · die Zellen:");
for (const z of tabelle) console.log(z);
if (failures > 0) {
  console.error(`\ncheck-sheet-colours: ${failures} Verstoss/Verstoesse ueber ${gemessen} Zelle(n)`);
  process.exit(1);
}
console.log(`\ncheck-sheet-colours: OK — ${gemessen} Zelle(n) einzeln gezaehlt (nie als Summe einer Sammeldatei), `
  + `keine faellt unter ${Math.round(100 * KEEP)} % ihrer Farbzahl, und jede Abweichung vom Korridor `
  + `${CORRIDOR[0]}–${CORRIDOR[1]} % traegt eine benannte, datierte Ausnahme`);
