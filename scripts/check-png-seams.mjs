#!/usr/bin/env node
// R5-W4b · W3 · D-199 · DER INNEN-NAHT-WAECHTER.
//
// Vier blinde Kritiker nannten unabhaengig dasselbe einen Auslieferungs-Stopper: die
// Plattform-Kacheln der Arena BLUTEN MAGENTA — senkrechte Saeulen im Abstand einer
// Kachelbreite, mitten in der Flaeche. H2 hat es an einer Spielaufnahme nachgemessen
// (2765 px, Spitze M=113 bei RGB 118,5,137). Der bestehende Schluesselsaum-Waechter
// hat es NICHT gesehen, und zwar aus zwei voneinander unabhaengigen Gruenden:
//
//   1. `keyFringe` (key-fringe.mjs:126) verlangt, dass ein Treffer AUF DER HAUT liegt
//      — neben Transparenz oder am Bildrand — »weil eine Schnittmarke nur dort leben
//      kann, wo geschnitten wurde«. Eine Innen-Naht liegt per Definition woanders.
//   2. Seine Schwelle ist das 99,9-Perzentil der eigenen Bild-Innenflaeche + 8
//      (key-fringe.mjs:104/110). Ein Defekt, der innen UND haeufig ist, hebt damit
//      SEINE EIGENE Latte. Ein selbstkalibrierender Massstab kann ihn nicht finden.
//
// Dieses Tor prueft deshalb das Innere, mit einer festen Regel und ohne Selbstkalibrierung.
//
// WARUM DER GELTUNGSBEREICH DIE HALBE ARBEIT IST. Die nackte Farbregel ueber den ganzen
// Bestand trifft ~85 000 px auf 80 von 326 Blaettern (key-fringe.mjs:230-237) — p2s
// Nachtklasse und das Rutschen-Kit sind ECHT violett. `keySpecks` kauft sich davon mit
// einer Groessen-Kappe frei (<= 4 px). Dieses Tor kauft sich mit dem GELTUNGSBEREICH
// frei: nur die deklarierten deckenden Kacheln aus `composition.ts` (Kruste + Kappen +
// Koerper + Tiefe + Verlauf + Sediment), nie alle PNGs. Gemessen auf 3daaf47 traegt
// dort KEINE der 22 `mass_*`-Kacheln auch nur einen Treffer; nur Krusten bluten. Ein
// Waechter, der echte Malerei rot faerbt, waere schlimmer als keiner.
//
// Run: node --experimental-strip-types scripts/check-png-seams.mjs
//      node --experimental-strip-types scripts/check-png-seams.mjs --selftest

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { COMPOSITION } from "../packages/game-paint/src/composition.ts";
import { phaseIsOneBlock } from "../packages/game-paint/src/mass.ts";
import { CUT_ALPHA, importerWouldDelete, magentaness, readPng } from "./key-fringe.mjs";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const selftest = process.argv.includes("--selftest");

let failures = 0;
const reported = [];
const fail = (msg) => { failures += 1; reported.push(msg); console.error(`✗ ${msg}`); };

// ── Die zweite Zahl, und warum sie danebensteht ─────────────────────────────
// Die beiden Definitionen des Defekts sind NICHT ineinander enthalten, und das ist
// gemessen, nicht vermutet: `importerWouldDelete(118, 5, 137)` ist FALSCH (118 <= 120),
// D-199s eigenes Spitzenpixel faellt also durch die Importer-Regel — waehrend dieselbe
// Regel `crust_p4_a`/`crust_p4_b` mit 2348/2670 Pixeln trifft, weil die Naht viele
// hellere Pixel enthaelt. Rot macht die Importer-Regel (der Importer wuerde diese Pixel
// beim naechsten Umlauf still loeschen — das ist ein Datenverlust, kein Geschmack).
// Die M-Zahl steht daneben, weil H2 und die Kunst-Bahn IN IHR rechnen; ohne sie haelt
// ein spaeterer Leser die eine Zahl fuer die andere.
const SEAM_M_MIN = 45;

/** Innen-Naht-Befund eines Blattes: beide Zaehlungen + je die erste Fundstelle. */
export const seamHits = (img) => {
  const { w, h, px } = img;
  let importer = 0;
  let magenta = 0;
  let firstImporter = null;
  let firstMagenta = null;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i + 3] < CUT_ALPHA) continue; // weggeschnitten — nicht deckend
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      if (importerWouldDelete(r, g, b)) {
        importer += 1;
        if (firstImporter === null) firstImporter = { x, y, rgb: [r, g, b] };
      }
      if (magentaness(r, g, b) > SEAM_M_MIN) {
        magenta += 1;
        if (firstMagenta === null) firstMagenta = { x, y, rgb: [r, g, b] };
      }
    }
  }
  return { importer, magenta, firstImporter, firstMagenta };
};

// ── Der Geltungsbereich, aus dem Bauplan hergeleitet ────────────────────────
// FELDWEISE, nicht per Dateinamen-Praefix. `mass_edge_*`, `mass_corner_*`,
// `mass_ramp_*` sind GESCHNITTENE Blaetter (import-batch-as.mjs:104-119: »The edge
// sheet is KEYED«) — auf ihnen ist Schluesselfarbe am Rand normal, nicht defekt.
// Ein Praefix-Filter wuerde sie mit hereinziehen und das Tor unbrauchbar machen.
// `crustOf` ist in composition.ts NICHT exportiert; die Kacheln kommen deshalb aus
// dem fertigen Bauplan-Objekt.
/**
 * ★ N7A2 · DER GELTUNGSBEREICH MUSS DEM CUTOVER FOLGEN.
 *
 * Diese Menge kam aus der DEKLARATION des Kits — und eine Ein-Block-Welt
 * deklariert ihr Kit weiter (`crustOf(phase)` erzeugt die Namen), obwohl sie es
 * nicht mehr laedt und die PNGs geloescht sind. Gemessen am 2026-09-02, nach dem
 * p3-Cutover: **28 der 40 deklarierten Kacheln hatten gar keine Datei mehr** — 24
 * Reste des p1/p2-Cutovers aus #389, vier aus dieser Bahn. Das Tor uebersprang
 * sie still und nannte trotzdem eine Zahl ("40 geprueft", tatsaechlich 12).
 * ⚠ Zwei Lineale, die man nicht mischen darf: der Bauplan enthaelt 48 NENNUNGEN,
 * aber nur 40 verschiedene Stems — diese Menge ist eine Map, sie dedupliziert.
 * Die 28 sind verschiedene Stems, also gehoeren sie zur 40, nie zur 48.
 *
 * Zwei Folgen, beide schlecht: die Schal-Pruefung unten (»Ausnahme steht in
 * keinem Bauplan«) konnte fuer geloeschte Kacheln nie feuern, also ueberlebten
 * ihre Duldungszeilen die Loeschung; und die gemeldete Stueckzahl beschrieb
 * einen Bestand, den es nicht mehr gibt. `oneBlockOf` reicht deshalb die
 * berechnete Cutover-Antwort herein: ein Raum ohne Kit liefert keine Kacheln.
 */
export const opaqueTileStems = (composition = COMPOSITION, oneBlockOf = () => false) => {
  const out = new Map(); // stem → wo er deklariert ist (fuer die Fehlermeldung)
  for (const [chapter, phases] of Object.entries(composition)) {
    for (const [phaseId, spec] of Object.entries(phases)) {
      const m = spec?.mass;
      if (!m) continue;
      if (oneBlockOf(chapter, phaseId, m)) continue; // Ein-Block-Welt: kein Kit, keine Kacheln
      const tiles = [
        ...m.crust,
        m.crustCapL,
        m.crustCapR,
        ...m.body,
        ...(m.bodyDeep ?? []),
        ...m.fade,
        m.sediment,
      ];
      for (const stem of tiles) {
        if (typeof stem !== "string" || stem.length === 0) continue;
        if (!out.has(stem)) out.set(stem, `${chapter}/${phaseId}`);
      }
    }
  }
  return out;
};

/** A zero-tile scope is valid only when every registered mass phase has an
 * actual, nonempty grid and the shipping partition check proves its cutover.
 * Missing inputs must never masquerade as a finished whole-body world. */
export const inspectTileScope = (composition, gridOf) => {
  let massPhases = 0;
  let wholePhases = 0;
  const errors = [];
  const scope = opaqueTileStems(composition, (chapter, phaseId, mass) => {
    massPhases += 1;
    const grid = gridOf(chapter, phaseId);
    if (!Array.isArray(grid) || grid.length === 0
      || !grid.every((row) => typeof row === "string" && row.length > 0 && row.length === grid[0].length)) {
      errors.push(`${chapter}/${phaseId}: kein vollstaendiges, nichtleeres Level-Gitter`);
      return false;
    }
    const whole = phaseIsOneBlock(grid, mass);
    if (whole) wholePhases += 1;
    return whole;
  });
  if (massPhases === 0) errors.push("kein Bauplan mit Masse registriert — leerer Pruefauftrag");
  if (scope.size === 0 && wholePhases !== massPhases) {
    errors.push("keine deckenden Kacheln, aber nicht alle Massen durch Koerper belegt");
  }
  return { scope, massPhases, wholePhases, errors };
};

// ── Die Ausnahmen ───────────────────────────────────────────────────────────
// Der vollstaendige p4/p9-Cutover zieht die letzten vier Krusten samt ihren
// D-199-Duldungen zurueck. Farbregel und Ausnahme-Hygiene bleiben fuer jedes
// spaeter wieder tatsaechlich benutzte Kachel-Kit aktiv. Die alte AS5b–AS5F-
// Liefergeschichte und die Messwerte bleiben in der Git-Historie erhalten.
// `seen` ist weiterhin eine Ratsche: neue Treffer sind durch keine Duldung gedeckt.
const MEASURED_ON = "dem im Ausnahmengrund belegten Messstand";
export const SEAM_ALLOW = [];

// ── Blatt → Datei ───────────────────────────────────────────────────────────
const fileOf = new Map();
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) fileOf.set(e.name.replace(/\.png$/, ""), path.join(dir, e.name));
  }
};
walk(ART_ROOT);

// ── Selbsttest ──────────────────────────────────────────────────────────────
// Drei Behauptungen, nicht eine — nach dem Muster von check-png-identity.mjs:49-75:
// gefunden · richtig BENANNT · und kein Fehlalarm auf sauberem Material. Beim
// Farbtor ist die dritte die gefaehrlichere Richtung.
if (selftest) {
  let bad = 0;
  const say = (ok, msg) => { if (!ok) bad += 1; console.log(`${ok ? "✓" : "✗"} ${msg}`); };

  const synth = (paint) => {
    const p = new PNG({ width: 16, height: 16 });
    for (let i = 0; i < p.data.length; i += 4) {
      p.data[i] = 120; p.data[i + 1] = 92; p.data[i + 2] = 64; p.data[i + 3] = 255;
    }
    if (paint) paint(p);
    return { w: p.width, h: p.height, px: p.data };
  };

  // 1 · sauberes Blatt bleibt gruen
  say(seamHits(synth(null)).importer === 0, "eine saubere Kachel meldet 0 Treffer (kein Fehlalarm)");

  // 2 · EIN Magenta-Pixel mitten in der Flaeche ⇒ rot, und an der richtigen Stelle.
  //     Per Pixel gesetzt und mit assert erzwungen: ein Tamper, der nichts veraendert
  //     hat, beweist nichts (und eine Text-Ersetzung traefe hier ohnehin danebe n).
  const tampered = synth((p) => {
    const i = (7 * p.width + 5) * 4;
    const before = [p.data[i], p.data[i + 1], p.data[i + 2]];
    p.data[i] = 200; p.data[i + 1] = 10; p.data[i + 2] = 200;
    if (before[0] === 200 && before[1] === 10 && before[2] === 200) {
      throw new Error("Tamper hat nichts veraendert — er beweist nichts");
    }
  });
  const t = seamHits(tampered);
  say(t.importer === 1, `ein eingesetztes Magenta-Pixel wird gefunden (${t.importer} Treffer, erwartet 1)`);
  say(
    t.firstImporter?.x === 5 && t.firstImporter?.y === 7,
    `…und richtig benannt (${t.firstImporter?.x},${t.firstImporter?.y}, erwartet 5,7)`,
  );

  // 3 · Der Fall, an dem die beiden Regeln AUSEINANDERGEHEN — und der Grund, warum
  //     beide Zahlen gedruckt werden. RGB(118,5,137) ist D-199s eigenes Spitzenpixel:
  //     M = min(118,137) − 5 = 113, weit ueber der M-Schwelle — aber die Importer-Regel
  //     verlangt r > 120, und 118 ist es nicht. Ein Fixture, das BEIDE Regeln ausloest,
  //     haette hier nichts bewiesen (erster Versuch dieser Sitzung: RGB(140,60,150) —
  //     der Selbsttest hat ihn selbst als nicht-unterscheidend abgewiesen).
  const violett = synth((p) => {
    for (let i = 0; i < p.data.length; i += 4) { p.data[i] = 118; p.data[i + 1] = 5; p.data[i + 2] = 137; }
  });
  const v = seamHits(violett);
  say(v.importer === 0 && v.magenta > 0,
    `D-199s Spitzenpixel RGB(118,5,137): ${v.importer} Importer-Treffer, aber ${v.magenta} M-Pixel `
    + "— die zwei Regeln sind nicht ineinander enthalten");

  // 4 · A genuine legacy palette stays in scope; a proved cutover may be empty.
  const legacy = Object.values(Object.values(COMPOSITION)[0])[0].mass;
  const whole = { ...legacy, columnObjects: [], bodies: [{
    id: "fixture", stem: "fixture_body", c0: 0, r0: 0, rows: ["##", "##"],
    pxPerCell: 64, overpaint: { l: 0, r: 0, t: 0, b: 0 },
  }] };
  const fixture = (mass) => ({ fixture: { room: { mass } } });
  const grid = ["##", "##"];
  const complete = inspectTileScope(fixture(whole), () => grid);
  say(complete.errors.length === 0 && complete.scope.size === 0
    && complete.massPhases === 1 && complete.wholePhases === 1,
  "ein durch echte Koerper-Partition belegter Raum darf ohne Kachel-Kit bestehen");
  const missing = inspectTileScope(fixture(whole), () => undefined);
  say(missing.errors.length > 0 && missing.wholePhases === 0,
    "fehlendes Level-Gitter wird abgewiesen");
  const emptyGrid = inspectTileScope(fixture(whole), () => []);
  say(emptyGrid.errors.length > 0, "leeres Level-Gitter wird abgewiesen");
  const noComposition = inspectTileScope({}, () => grid);
  say(noComposition.errors.length > 0, "leerer Bauplan wird abgewiesen");
  const broken = { ...whole, bodies: [{ ...whole.bodies[0], rows: ["#.", "##"] }] };
  const uncovered = inspectTileScope(fixture(broken), () => grid);
  say(uncovered.wholePhases === 0 && uncovered.scope.size > 0,
    "ein Loch im Koerper holt das Kachel-Kit zurueck in die Pruefung");
  const noPalette = { ...broken, crust: [], crustCapL: null, crustCapR: null,
    body: [], bodyDeep: [], fade: [], sediment: null };
  say(inspectTileScope(fixture(noPalette), () => grid).errors.length > 0,
    "unbelegte Masse ohne Ersatz-Kacheln wird abgewiesen");
  say(!uncovered.scope.has("mass_ramp_up") && !uncovered.scope.has("mass_edge_l"),
    "geschnittene Blaetter (Rampe, Kante) sind NICHT im Geltungsbereich");

  if (bad > 0) {
    console.error(`✗ check-png-seams SELFTEST FEHLGESCHLAGEN: ${bad} Fall/Faelle`);
    process.exit(1);
  }
  console.log("✓ check-png-seams SELFTEST: OK — das rote Licht ist erreichbar, es benennt die Stelle, "
    + "und echte violette Malerei bleibt gruen.");
  process.exit(0);
}

// ── Der Lauf ────────────────────────────────────────────────────────────────
/** Die Gitter des Kapitels — nur dafuer da, dem Geltungsbereich den Cutover zu sagen. */
const gridsByChapter = new Map();
{
  const CONTENT = path.join(process.cwd(), "content/corpus/stories");
  for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
    const dir = path.join(CONTENT, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".level.json"))) {
      const level = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      const byPhase = new Map();
      for (const ph of [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])]) byPhase.set(ph.id, ph.rows);
      gridsByChapter.set(level.chapter, byPhase);
    }
  }
}
const inspected = inspectTileScope(COMPOSITION,
  (chapter, phaseId) => gridsByChapter.get(chapter)?.get(phaseId));
const { scope, massPhases, wholePhases } = inspected;
for (const error of inspected.errors) fail(error);

const allowByStem = new Map(SEAM_ALLOW.map((a) => [a.stem, a]));
const today = new Date().toISOString().slice(0, 10);
const rows = [];
const dirty = new Set();

for (const [stem, where] of [...scope].sort()) {
  const file = fileOf.get(stem);
  if (!file) {
    fail(`deckende Kachel ${stem} (${where}) fehlt — der berechnete Geltungsbereich darf nicht still schrumpfen`);
    continue;
  }
  const hit = seamHits(readPng(file));
  if (hit.importer > 0) dirty.add(stem);
  const listed = allowByStem.get(stem);
  const at = hit.firstImporter;
  const wo = at ? `erste Fundstelle ${at.x},${at.y} RGB(${at.rgb.join(",")})` : "—";

  if (hit.importer === 0) {
    if (listed) {
      fail(`Ausnahme SCHAL: ${stem} ist sauber (0 Treffer) — Eintrag aus SEAM_ALLOW entfernen`);
    }
    continue;
  }
  if (!listed) {
    fail(`Innen-Naht in »${stem}« (${where}): ${hit.importer} Pixel, die der Importer still `
      + `loeschen wuerde, ${wo}; ${hit.magenta} Pixel mit M>${SEAM_M_MIN}. `
      + `Kachel neu schneiden — oder mit Grund UND Datum in SEAM_ALLOW aufnehmen.`);
    continue;
  }
  if (!listed.reason || !listed.until) {
    fail(`Ausnahme fuer ${stem} braucht reason UND until`);
    continue;
  }
  if (listed.until < today) {
    fail(`Ausnahme ABGELAUFEN fuer ${stem} (until ${listed.until}, heute ${today}): `
      + `${hit.importer} Pixel, ${wo} — reparieren oder mit neuem Grund verlaengern`);
    continue;
  }
  if (hit.importer > listed.seen) {
    fail(`Ausnahme GESPRENGT fuer ${stem}: geduldet waren ${listed.seen} Pixel (${MEASURED_ON}), `
      + `gemessen sind ${hit.importer}. Eine Ausnahme darf einen bekannten Defekt dulden, `
      + `nie einen neuen aufnehmen.`);
    continue;
  }
  rows.push(`  ⚠ ${stem.padEnd(18)} ${String(hit.importer).padStart(5)} Importer-Pixel · `
    + `${String(hit.magenta).padStart(5)} M>${SEAM_M_MIN} · ${wo} · geduldet bis ${listed.until}`);
}

for (const a of SEAM_ALLOW) {
  if (!scope.has(a.stem)) {
    fail(`Ausnahme ${a.stem} steht in keinem Bauplan als deckende Kachel — Eintrag entfernen`);
  }
}

if (rows.length > 0) {
  console.log(`Geduldete Innen-Naehte (D-199, Reparatur = Krusten-Neulieferung AS5b/A7) — ${rows.length} Kachel(n):`);
  for (const r of rows) console.log(r);
}

if (failures === 0) {
  console.log(`check-png-seams: OK — ${wholePhases}/${massPhases} Massen durch Level-Gitter als Ein-Block-Welt belegt; `
    + `${scope.size} tatsaechlich benutzte deckende Kacheln geprueft, `
    + `${dirty.size} davon bluten und sind namentlich mit Datum geduldet, `
    + `${scope.size - dirty.size} sind sauber.`);
} else {
  console.error(`\ncheck-png-seams: ${failures} failure(s)`);
  process.exit(1);
}
