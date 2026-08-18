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
export const opaqueTileStems = (composition = COMPOSITION) => {
  const out = new Map(); // stem → wo er deklariert ist (fuer die Fehlermeldung)
  for (const [chapter, phases] of Object.entries(composition)) {
    for (const [phaseId, spec] of Object.entries(phases)) {
      const m = spec?.mass;
      if (!m) continue;
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

// ── Die Ausnahmen ───────────────────────────────────────────────────────────
// Die neun heute blutenden Stems stehen hier, jeder mit Grund, Datum UND der gemessenen
// Zahl. Reparatur ist KEIN Merge, sondern eine Neulieferung: A6b (PR #306) hat bewiesen,
// dass die Magenta-Bahnen in Codex' gelieferter QUELLE sitzen (`batch-af2/mass/crust_p4.png`,
// 512 Versaetze geprueft, kein sauberer Schnitt moeglich, Uebermalen verboten) — deshalb
// bindet sich das Ablaufdatum an die Krusten-Neulieferung (Kommission AS5b, D-199/D-265,
// Import-Lane A7), nicht an einen Merge (R106, Hotfix nach dem 4b-Zug). Bis dahin bleibt
// das Tor lesbar rot statt still gruen.
//
// `seen` ist eine RATSCHE, kein Freibrief: waechst die Zahl ueber den Messwert, wird
// das Tor trotz Ausnahme rot. Eine Ausnahme darf einen bekannten Defekt dulden, nie
// einen neuen aufnehmen. Vier Hygiene-Richtungen, wie paint-art-allowlist:43-76:
// fehlender Eintrag · unvollstaendiger · abgelaufener · schaler (Kachel ist repariert).
const MEASURED_ON = "2026-08-16 @ 3daaf47 (unveraendert auf ae0dd42 und auf 4a0d5c4: kein crust_* seither beruehrt)";
// ── VERLAENGERT AUF 2026-11-30 (R5-W6 · A7, 2026-08-18 — Ruling R147) ────────
//
// Diese Ausnahme sollte mit der Krusten-Neulieferung AS5b von selbst fallen. Die
// Lieferung ist da und traegt die Reparatur wirklich: `batch-as5b/crust_p*.png`
// enthaelt NULL Pixel, die `importerWouldDelete` trifft, gegen 6938 in der heute
// verbauten Quelle `batch-af2/mass/crust_p4.png`. Die Bandhoehen treffen den
// Bestand auf den Pixel (211 · 262 · 237 · 246).
//
// Importiert ist sie trotzdem nicht, und der Grund ist nicht die Naht: die
// gelieferten Krusten tragen KEIN MOTIV. Der Lieferschein sagt es selbst — die
// Runde hat die Naht mit »periodic material functions« geschlossen, also die
// Malerei durch eine Texturfunktion ersetzt. Zwei frische, blinde Kritiker haben
// dasselbe Paar in entgegengesetzter Reihenfolge gesehen und beide unabhaengig
// die HEUTIGE Kachel gewaehlt: sie sehen dort Planken und liegende Buecher, in
// der Lieferung »keine benennbaren Objekte«. Ein sauberer Schluessel ist kein
// Grund, eine gemalte Flaeche gegen eine gerechnete zu tauschen.
//
// Also bleibt der Defekt stehen, und die Ausnahme bleibt mit ihm — deklariert,
// datiert, mit Eigentuemer, nie still. Der neue Reparaturpfad ist AS5c
// (SPEC_MASSEN_KIT §10.6, in diesem PR mit Zahlen spezifiziert).
const UNTIL = "2026-11-30";
const AS5B = "D-199: Innen-Naht der Kruste, gemessen am selben Stand. Ursache sitzt in Codex' "
  + "Quelle (A6b, PR #306). AS5b (18.08.) hat den Schluessel repariert (0 Treffer statt 6938), "
  + "aber die Krusten ohne Motiv geliefert (zwei blinde Kritiker, getauschte Reihenfolge, beide "
  + "fuer den Bestand) — nicht importierbar. Verlaengert auf 2026-11-30 durch A7 (R147); "
  + "AS5c-Bestellung spezifiziert in SPEC_MASSEN_KIT §10.6 (A7, 2026-08-18), Kommissionsdatei "
  + "schreibt Fable, Lieferschein-Pruefung ausstehend. Faellt von selbst, sobald die neue Kachel "
  + "liegt (das Tor meldet den Eintrag dann als schal).";
export const SEAM_ALLOW = [
  { stem: "crust_p4_a", seen: 2348, until: UNTIL, reason: AS5B },
  { stem: "crust_p4_b", seen: 2670, until: UNTIL, reason: AS5B },
  { stem: "crust_p2_a", seen: 838, until: UNTIL, reason: AS5B },
  { stem: "crust_p2_b", seen: 782, until: UNTIL, reason: AS5B },
  { stem: "crust_p2_cap_l", seen: 717, until: UNTIL, reason: AS5B },
  { stem: "crust_p9_b", seen: 305, until: UNTIL, reason: AS5B },
  { stem: "crust_p3_a", seen: 162, until: UNTIL, reason: AS5B },
  { stem: "crust_p3_b", seen: 4, until: UNTIL, reason: AS5B },
  { stem: "crust_p4_cap_l", seen: 3, until: UNTIL, reason: AS5B },
];

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

  // 4 · Vakuitaets-Waechter: ein Lauf ohne Kacheln wuerde still gruen sein.
  const scope = opaqueTileStems();
  say(scope.size > 0, `der Bauplan liefert ${scope.size} deckende Kacheln (ein leerer Lauf waere still gruen)`);
  say(!scope.has("mass_ramp_up") && !scope.has("mass_edge_l"),
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
const scope = opaqueTileStems();
if (scope.size === 0) {
  fail("kein Bauplan liefert deckende Kacheln — dieses Tor haette nichts mehr zu pruefen; "
    + "lies es neu, bevor du es loeschst");
}

const allowByStem = new Map(SEAM_ALLOW.map((a) => [a.stem, a]));
const today = new Date().toISOString().slice(0, 10);
const rows = [];
const dirty = new Set();

for (const [stem, where] of [...scope].sort()) {
  const file = fileOf.get(stem);
  if (!file) {
    // »fehlt« ist das Revier der Praesenz-Pruefung in check-paint-art, nicht meins.
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
  console.log(`check-png-seams: OK — ${scope.size} deklarierte deckende Kacheln geprueft, `
    + `${dirty.size} davon bluten und sind namentlich mit Datum geduldet, `
    + `${scope.size - dirty.size} sind sauber.`);
} else {
  console.error(`\ncheck-png-seams: ${failures} failure(s)`);
  process.exit(1);
}
