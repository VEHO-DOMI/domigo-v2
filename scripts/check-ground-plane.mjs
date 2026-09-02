#!/usr/bin/env node
/**
 * R7 · DAS AUFSTANDS-TOR — steht das Ding gerade auf seiner Grundlinie?
 *
 * Kokis Befund (01.09., wörtlich): „these looks weird tilted to the site,
 * especially at the bottom here where they dont sit straight on the platform."
 * Gemessene Ursache: NICHT Montage (Verzug 0,00–0,06 %), NICHT eine gekippte
 * Mittelachse (0,06–0,26°), sondern die MALEREI — 3/4-Perspektive mit V-förmiger
 * Aufstandskante und je Blatt anderem Fluchtwinkel (11°–49°). Checkliste 13.
 *
 * Zwei Gesetze, am PNG gemessen:
 *   1 · REICHWEITE — die unterste Malerei erreicht über ≥80 % der opaken Breite
 *       die Grundlinie (Toleranzband 2 % der Blatthöhe, min. 4 px). Ein V fällt.
 *   2 · WAAGE — die Kontaktkante (lineare Regression der untersten opaken Zeile
 *       je Spalte, über die berührende Spanne) kippt ≤3°.
 *
 * Geprüft werden die STEH-Blätter: alle platObjects + columnObjects des Kapitels.
 * Der ALTBESTAND fällt absichtlich durch — er IST der Befund. Damit CI nicht auf
 * dem Befund rot steht, trägt jedes alte Blatt eine DATIERTE Zeile in
 * GROUND_PLANE_PENDING (Grund + Raum-Cutover, der es löscht). Ein NEUES Blatt
 * ohne Zeile muss bestehen. Eine Pending-Zeile ohne Blatt ist selbst ein Fehler
 * (sie überlebt ihre Löschung nicht still).
 *
 *   node scripts/check-ground-plane.mjs             # Bestand
 *   node scripts/check-ground-plane.mjs --selftest  # 1 sauber + 3 Tamper
 *   node scripts/check-ground-plane.mjs --sheet <png>   # Wareneingang einer Lieferung
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { CH01_COMPOSITION } from "../packages/game-paint/src/composition.ts";

const ART_DIR = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const OPAQUE = 128;
const REACH_MIN = 0.8;
const TILT_MAX_DEG = 3;

/** Altbestand: gemessen am 01.09. (Fluchtwinkel je Blatt in Klammern). Fällt
 *  mit dem Cutover des genannten Raums — die Zeile stirbt MIT dem Blatt. */
const GROUND_PLANE_PENDING = {
  // p1/p2-Säulen + Podest (V-Sockel 11°–49°): Absorption in die Körper, p1/p2-Cutover
  "terrain_pillar_p2_8": { until: "2026-10-15", why: "V-Sockel 36,0° — Absorption p2-Ostwand" },
  "terrain_pillar_p2_5": { until: "2026-10-15", why: "V-Sockel 19,6° — Absorption p2-Ostwand" },
  "terrain_pillar_p2_2": { until: "2026-10-15", why: "V-Sockel ~44° — Absorption p2-Ostwand" },
  "terrain_tower_p2": { until: "2026-10-15", why: "48,7°; matcht ohnehin kein Grid mehr — fällt mit p2-Cutover" },
  "terrain_post_p2": { until: "2026-10-15", why: "11,1°; matcht kein Grid mehr — fällt mit p2-Cutover" },
  // Möbel-Altbestand (Seitenflächen 0,4°–45,8°): Neu-Malung je Raum (Kokis Entscheid 01.09.)
  "plat_bookpile_l": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_bookpile_s": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_bench_2": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_shelf_2": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_coatbench": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_desk": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_bundle_1": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "plat_plank_2": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "ledge_windowsill": { until: "2026-10-15", why: "Perspektiv-Altbestand, Möbel-Neuwelle" },
  "terrain_night_folio_p2": { until: "2026-10-15", why: "R4-Bestand, Möbel-Neuwelle p2" },
  "terrain_night_dictionary_p2": { until: "2026-10-15", why: "R4-Bestand, Möbel-Neuwelle p2" },
  "terrain_night_bundle_p2": { until: "2026-10-15", why: "R4-Bestand, Möbel-Neuwelle p2" },
  "terrain_night_shelf_p2": { until: "2026-10-15", why: "R4-Bestand, Möbel-Neuwelle p2" },
  "terrain_night_lectern_shelf_p2": { until: "2026-10-15", why: "R4-Bestand, Möbel-Neuwelle p2" },
  "terrain_column_p3_standing_2x5": { until: "2026-10-15", why: "R5b2-Rest, fällt mit p3-Neubau" },
  "terrain_column_p3_hanging_2x4": { until: "2026-10-15", why: "hängend (Fuß frei), aber Perspektiv-Familie — p3-Neubau" },
  "terrain_column_p4_standing_2x2": { until: "2026-10-15", why: "R5b2-Rest, fällt mit p4-Neubau" },
  "terrain_column_p4_standing_1x2": { until: "2026-10-15", why: "R5b2-Rest, fällt mit p4-Neubau" },
  "terrain_column_p4_hanging_2x3": { until: "2026-10-15", why: "hängend, Perspektiv-Familie — p4-Neubau" },
  // hängende Pfeiler: Fuß hängt frei (Spitze läuft absichtlich aus) — Gesetz 1
  // gilt für sie nicht; sie stehen hier, damit ihr Ersatz sie explizit löscht.
  "terrain_hanging_pillar_p2": { until: "2026-10-15", why: "hängt (kein Aufstand) — fällt mit p2-Deckenkörpern" },
  "terrain_hanging_pillar_p2_short": { until: "2026-10-15", why: "hängt — fällt mit p2-Deckenkörpern" },
};

/** Misst Reichweite + Kipp der Kontaktkante eines Blatts. */
export const measureGroundPlane = (png) => {
  const a = (x, y) => png.data[(y * png.width + x) * 4 + 3] ?? 0;
  const lows = [];
  for (let x = 0; x < png.width; x++) {
    let low = -1;
    for (let y = png.height - 1; y >= 0; y--) {
      if (a(x, y) >= OPAQUE) { low = y; break; }
    }
    lows.push(low);
  }
  const opaqueXs = lows.map((v, x) => [x, v]).filter(([, v]) => v >= 0);
  if (opaqueXs.length === 0) return { reach: 0, tiltDeg: 90, span: 0 };
  const tol = Math.max(4, Math.round(png.height * 0.02));
  const touching = opaqueXs.filter(([, v]) => v >= png.height - 1 - tol);
  const reach = touching.length / opaqueXs.length;
  // Waage: Regression über die BERÜHRENDE Spanne (die Kontaktkante selbst);
  // ohne Berührung über die ganze opake Unterkante — dann urteilt Gesetz 1.
  const fitSet = touching.length >= 8 ? touching : opaqueXs;
  const n = fitSet.length;
  const mx = fitSet.reduce((s, [x]) => s + x, 0) / n;
  const my = fitSet.reduce((s, [, v]) => s + v, 0) / n;
  let num = 0, den = 0;
  for (const [x, v] of fitSet) { num += (x - mx) * (v - my); den += (x - mx) * (x - mx); }
  const slope = den > 0 ? num / den : 0;
  return { reach, tiltDeg: Math.abs(Math.atan(slope) * 180 / Math.PI), span: opaqueXs.length };
};

const judge = (stem, png) => {
  const m = measureGroundPlane(png);
  const errors = [];
  if (m.reach < REACH_MIN) errors.push(`Reichweite ${(100 * m.reach).toFixed(0)} % < 80 % — die Aufstandskante ist ein V, keine Gerade`);
  if (m.tiltDeg > TILT_MAX_DEG) errors.push(`Kontaktkante kippt ${m.tiltDeg.toFixed(1)}° > ${TILT_MAX_DEG}°`);
  return { m, errors };
};

const synth = (mutate) => {
  const png = new PNG({ width: 200, height: 100 });
  for (let y = 20; y < 100; y++) for (let x = 10; x < 190; x++) {
    const i = (y * 200 + x) * 4; png.data[i] = 120; png.data[i + 3] = 255;
  }
  mutate?.(png);
  return png;
};

const selftest = () => {
  const clean = judge("st", synth());
  if (clean.errors.length !== 0) { console.error("Selbsttest: sauberes Blatt fällt:", clean.errors); return 1; }
  const tampers = [
    ["V-Sockel", (p) => { for (let x = 10; x < 190; x++) { const cut = Math.abs(x - 100) * 0.4; for (let y = 100 - Math.round(cut); y < 100; y++) p.data[(y * 200 + x) * 4 + 3] = 0; } }],
    ["Flucht-Kante 8°", (p) => { for (let x = 10; x < 190; x++) { const cut = Math.round((x - 10) * Math.tan(8 * Math.PI / 180)); for (let y = 100 - cut; y < 100; y++) if (y >= 0) p.data[(y * 200 + x) * 4 + 3] = 0; } }],
    ["schwebender Fuß", (p) => { for (let x = 0; x < 200; x++) for (let y = 88; y < 100; y++) p.data[(y * 200 + x) * 4 + 3] = 0; }],
  ];
  for (const [name, mutate] of tampers) {
    if (judge("st", synth(mutate)).errors.length === 0) { console.error(`Selbsttest-TAMPER "${name}" blieb GRÜN`); return 1; }
  }
  console.log("check-ground-plane: Selbsttest OK — 1 sauber + 3 Tamper rot");
  return 0;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  if (args.includes("--sheet")) {
    const file = args[args.indexOf("--sheet") + 1];
    const { m, errors } = judge(file, PNG.sync.read(fs.readFileSync(file)));
    if (errors.length === 0) { console.log(`✓ ${file}: Reichweite ${(100 * m.reach).toFixed(0)} % · Kipp ${m.tiltDeg.toFixed(1)}°`); return 0; }
    console.error(`✗ ${file}:`); for (const e of errors) console.error(`    ${e}`);
    return 1;
  }
  const stems = new Set();
  for (const spec of Object.values(CH01_COMPOSITION)) {
    const m = spec?.mass;
    if (!m) continue;
    for (const o of m.platObjects ?? []) stems.add(o.stem);
    for (const o of m.columnObjects ?? []) stems.add(o.stem);
  }
  // Pending-Zeilen ohne lebendes Blatt sind selbst ein Befund — außer das PNG
  // ist schon gelöscht (dann ist die Zeile nur noch Doku und darf mitfallen).
  let failed = 0;
  for (const stem of [...stems].sort()) {
    const file = path.join(ART_DIR, `${stem}.png`);
    if (!fs.existsSync(file)) { console.error(`✗ ${stem}: PNG fehlt`); failed++; continue; }
    const pending = GROUND_PLANE_PENDING[stem];
    const { m, errors } = judge(stem, PNG.sync.read(fs.readFileSync(file)));
    if (errors.length === 0) {
      console.log(`✓ ${stem}: Reichweite ${(100 * m.reach).toFixed(0)} % · Kipp ${m.tiltDeg.toFixed(1)}°`);
    } else if (pending !== undefined) {
      console.log(`⚠ ${stem}: BEFUND GEDULDET bis ${pending.until} (${pending.why}) — ${errors.join(" · ")}`);
    } else {
      failed++;
      console.error(`✗ ${stem}:`);
      for (const e of errors) console.error(`    ${e}`);
    }
  }
  if (failed === 0) console.log(`check-ground-plane: OK — ${stems.size} Steh-Blätter gemessen`);
  return failed === 0 ? 0 : 1;
};

process.exit(main());
