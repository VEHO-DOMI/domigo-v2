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
 * Heute werden die tatsächlich geplanten Möbelbindungen geprüft: schwebende
 * platObjects zusätzlich an ihrer deklarierten Laufkante (deck), stehende
 * columnObjects weiter an ihrer Basis. Getrennte Füße brauchen vollständig
 * registrierte Kontaktspannen und den passenden PNG-Hash; kein Winkel wird
 * dadurch großzügiger. Die reine Unterkantenmessung unten bleibt unverändert.
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
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { PNG } from "pngjs";
import { CH01_COMPOSITION } from "../packages/game-paint/src/composition.ts";
import { planMass } from "../packages/game-paint/src/mass.ts";
import { measureDeck, measureContacts } from "./ground-plane-geometry.mjs";
import { GROUND_CONTACTS } from "./ground-plane-contacts.mjs";
import { geometrySelftest } from "./ground-plane-selftest.mjs";

const ART_DIR = path.join(process.cwd(), "apps/web/public/art/g1/paint/ch01");
const OPAQUE = 128;
const REACH_MIN = 0.8;
const TILT_MAX_DEG = 3;

/** Altbestand: gemessen am 01.09. (Fluchtwinkel je Blatt in Klammern). Fällt
 *  mit dem Cutover des genannten Raums — die Zeile stirbt MIT dem Blatt.
 *
 *  ★ N7A2 (2026-09-02): von 26 Zeilen waren beim ersten scharfen Lauf der
 *  Hygiene-Regel **24 schal**. Drei Sterbe-Arten, alle unbemerkt, weil nichts sie
 *  je gefragt hat — die Namen sind AUSGEZÄHLT, nicht erinnert:
 *    · 12 Zeilen nannten PNGs, die es im ganzen Repo nicht gibt: die fünf
 *      p2-Pfeiler (`terrain_pillar_p2_2/5/8`, `terrain_tower_p2`,
 *      `terrain_post_p2`), die zwei Hänger (`terrain_hanging_pillar_p2`,
 *      `…_short`), zwei `terrain_column_p3_*` und drei `terrain_column_p4_*`
 *      — R5b2-Reste, gelöscht oder nie geliefert;
 *    ·  4 Zeilen nannten Blätter, die auf der Platte liegen, aber kein Raum
 *      referenziert (`plat_bookpile_l`, `plat_bookpile_s`, `plat_shelf_2`,
 *      `plat_coatbench` — tote Kunst);
 *    ·  8 Zeilen nannten Blätter, deren Befund die Möbel-Neuwelle von #389
 *      BEHOBEN hat: `plat_bench_2`, `plat_bundle_1`, `plat_plank_2` und die
 *      fünf Nacht-Möbel (`terrain_night_folio_p2`, `…_dictionary_p2`,
 *      `…_bundle_p2`, `…_shelf_p2`, `…_lectern_shelf_p2`) — sie messen heute
 *      82–100 % Reichweite bei 0,0–0,3° Kipp.
 *  Eine 25. Zeile hat diese Bahn selbst beendet (`ledge_windowsill`, 21 → 87 %
 *  Reichweite durch den Neuwurf). Übrig bleibt EINE, die wirklich noch etwas
 *  duldet.
 *  ⚠ Was hier NIE stand: die fünf p1-Möbel (`terrain_reading_bench_p1` &c.) und
 *  `plat_column2_1` — sie halten Gesetz 13 ohne Duldung, und ein Kommentar, der
 *  sie aufzählt, beschreibt Zeilen, die es nicht gab. */
const GROUND_PLANE_PENDING = {
  // Der alte Tisch samt V-Sockel-Duldung ist durch ganze Bonusbücher ersetzt.
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

export const judge = (stem, png) => {
  const m = measureGroundPlane(png);
  const errors = [];
  if (m.reach < REACH_MIN) errors.push(`Reichweite ${(100 * m.reach).toFixed(0)} % < 80 % — die Aufstandskante ist ein V, keine Gerade`);
  if (m.tiltDeg > TILT_MAX_DEG) errors.push(`Kontaktkante kippt ${m.tiltDeg.toFixed(1)}° > ${TILT_MAX_DEG}°`);
  return { m, errors };
};

export const judgeBinding = (stem, png, binding, sha256, contacts = GROUND_CONTACTS) => {
  const contact = binding.role === "deck" ? contacts[stem] : undefined;
  // Hanging pieces do not stand on their tip. No live ch01 binding uses this;
  // leave it explicitly red until its ceiling-contact contract is implemented.
  if (binding.hanging) return { errors: ["hängende Säule: Deckenanschluss noch nicht prüfbar"], m: {} };
  const ground = contact ? measureContacts(png, contact, sha256) : judge(stem, png);
  const deck = binding.role === "deck" ? measureDeck(png, binding.deck ?? 0) : null;
  return { m: { ground: ground.m ?? ground, deck }, contactRegistered: Boolean(contact), groundErrors: ground.errors, deckErrors: deck?.errors ?? [], errors: [...ground.errors, ...(deck?.errors ?? [])] };
};

// The historical waiver covers the old footer only, never a new deck error,
// hash mismatch or a replacement image. Hygiene still counts actual use.
export const applyGroundPending = (result, pending, sha256) => {
  const used = !result.contactRegistered && pending !== undefined && pending.sha256 === sha256 && (result.groundErrors?.length ?? 0) > 0;
  return { used, errors: used ? result.deckErrors : result.errors };
};

export const activeGroundBindings = (phases, composition, sourceSize) => {
  const out = [];
  for (const ph of phases) {
    const kit = composition[ph.id]?.mass;
    if (!kit) continue;
    const planned = new Set(planMass(ph.rows, kit, sourceSize).filter((p) => p.kind === "platform").map((p) => p.stem));
    for (const obj of kit.platObjects ?? []) if (planned.has(obj.stem)) out.push({ ...obj, phase: ph.id, role: "deck" });
    for (const obj of kit.columnObjects ?? []) if (planned.has(obj.stem)) out.push({ ...obj, phase: ph.id, role: "ground" });
  }
  return out;
};

const synth = (mutate) => {
  const png = new PNG({ width: 200, height: 100 });
  for (let y = 20; y < 100; y++) for (let x = 10; x < 190; x++) {
    const i = (y * 200 + x) * 4; png.data[i] = 120; png.data[i + 3] = 255;
  }
  mutate?.(png);
  return png;
};

/**
 * ★ DULDUNGS-HYGIENE — eine Duldung, die nichts mehr duldet, ist eine Behauptung.
 *
 * Der Kopf dieser Datei verspricht das Gesetz seit R7 („Eine Pending-Zeile ohne
 * Blatt ist selbst ein Fehler, sie überlebt ihre Löschung nicht still") — der Code
 * hat es NIE gefahren: es gab keine einzige Schleife über GROUND_PLANE_PENDING.
 * Gemessen am 2026-09-02: **24 der 26 Zeilen waren schal** — zwölf nannten PNGs,
 * die es im ganzen Repo nicht gibt; vier nannten Blätter, die zwar auf der Platte
 * liegen, aber von keinem Raum referenziert werden; acht nannten Blätter, deren
 * Befund die Möbel-Neuwelle von #389 längst behoben hatte. Die Aufteilung steht
 * namentlich am Kopf von `GROUND_PLANE_PENDING`. Keine davon hat je einen Befund
 * geduldet, und keine wäre je aufgefallen.
 * (Eine frühere Fassung dieses Absatzes nannte „16 der 26" — das war die Zahl,
 * bevor die dritte Sterbe-Art gemessen war, und sie hat den Kopf dieser Datei
 * widersprochen. Zwei Zahlen für eine Messung sind eine zu viel.)
 *
 * Die Regel ist deshalb dieselbe, die `SCALE_WAIVERS` in `check-composition.mjs`
 * schon trägt, und sie ist bewusst als EINE Frage formuliert: **wurde diese Zeile
 * in diesem Lauf gebraucht?** Das deckt alle drei Sterbe-Arten mit einer Prüfung ab
 *   · das PNG ist gelöscht        → nie konsultiert
 *   · kein Raum referenziert es   → nie konsultiert
 *   · das Blatt ist REPARIERT     → nie konsultiert (und genau so soll eine
 *                                    Neu-Malung ihre eigene Duldung beenden)
 * Dazu die zweite Hälfte: ein `until`, das niemand liest, ist ein Datum ohne
 * Wirkung — eine abgelaufene Zeile wird rot, statt lautlos weiterzugelten.
 */
export const waiverHygiene = (pending, seen, today = new Date()) => {
  const errors = [];
  for (const [stem, w] of Object.entries(pending)) {
    if (!seen.has(stem)) {
      errors.push(`GROUND_PLANE_PENDING trägt "${stem}", aber dieser Lauf hat die Zeile nicht gebraucht (Blatt gelöscht, von keinem Raum referenziert, oder der Befund ist behoben) — die Zeile löschen (${w.why})`);
      continue;
    }
    if (Date.parse(`${w.until}T23:59:59Z`) < today.getTime()) {
      errors.push(`GROUND_PLANE_PENDING "${stem}" ist am ${w.until} abgelaufen — nachmessen und neu begründen oder die Ausnahme fallen lassen (${w.why})`);
    }
  }
  return errors;
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
  // ── Duldungs-Hygiene: 1 sauber + 2 Tamper ────────────────────────────────
  const heute = new Date("2026-09-02T12:00:00Z");
  const reg = { a: { until: "2026-10-15", why: "Grund A" }, b: { until: "2026-10-15", why: "Grund B" } };
  if (waiverHygiene(reg, new Set(["a", "b"]), heute).length !== 0) {
    console.error("Selbsttest: zwei gebrauchte, unverfallene Duldungen fallen"); return 1;
  }
  if (waiverHygiene(reg, new Set(["a"]), heute).length !== 1) {
    console.error('Selbsttest-TAMPER "schale Zeile" blieb GRÜN'); return 1;
  }
  if (waiverHygiene({ a: { until: "2026-08-01", why: "Grund A" } }, new Set(["a"]), heute).length !== 1) {
    console.error('Selbsttest-TAMPER "abgelaufene Zeile" blieb GRÜN'); return 1;
  }
  geometrySelftest({ judgeBinding, activeGroundBindings, applyGroundPending });
  console.log("check-ground-plane: Selbsttest OK — 1 sauber + 3 Tamper rot · Duldungs-Hygiene 1 sauber + 2 Tamper rot");
  return 0;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  if (args.includes("--sheet")) {
    const file = args[args.indexOf("--sheet") + 1];
    const bytes = fs.readFileSync(file), png = PNG.sync.read(bytes);
    const sha = crypto.createHash("sha256").update(bytes).digest("hex");
    const stem = path.basename(file, ".png");
    const result = args.includes("--deck")
      ? judgeBinding(stem, png, { role: "deck", deck: Number(args[args.indexOf("--deck") + 1]) }, sha)
      : judge(stem, png);
    const { errors } = result;
    console.log(JSON.stringify({ file, sha256: sha, ...result }));
    if (errors.length === 0) { console.log(`✓ ${file}: Vertrag erfüllt`); return 0; }
    console.error(`✗ ${file}:`); for (const e of errors) console.error(`    ${e}`);
    return 1;
  }
  const level = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"), "utf8"));
  const phases = [...level.phases, ...[level.arena, level.bonus].filter(Boolean)];
  const sourceSize = (stem) => {
    const file = path.join(ART_DIR, `${stem}.png`);
    if (!fs.existsSync(file)) return null;
    const data = fs.readFileSync(file);
    return { w: data.readUInt32BE(16), h: data.readUInt32BE(20) };
  };
  const bindings = activeGroundBindings(phases, CH01_COMPOSITION, sourceSize);
  const stems = new Set(bindings.map((b) => b.stem));
  // Pending-Zeilen ohne lebendes Blatt sind selbst ein Befund — außer das PNG
  // ist schon gelöscht (dann ist die Zeile nur noch Doku und darf mitfallen).
  let failed = 0;
  const waiverSeen = new Set();
  for (const binding of bindings) {
    const stem = binding.stem;
    const file = path.join(ART_DIR, `${stem}.png`);
    if (!fs.existsSync(file)) { console.error(`✗ ${stem}: PNG fehlt`); failed++; continue; }
    const pending = GROUND_PLANE_PENDING[stem];
    const bytes = fs.readFileSync(file);
    const sha = crypto.createHash("sha256").update(bytes).digest("hex");
    const result = judgeBinding(stem, PNG.sync.read(bytes), binding, sha);
    const { m } = result;
    const { used, errors } = applyGroundPending(result, pending, sha);
    if (used) {
      waiverSeen.add(stem);
      console.log(`⚠ ${stem}: nur historischer Fußbefund GEDULDET bis ${pending.until} (${pending.why}) — ${result.groundErrors.join(" · ")}`);
    }
    console.log(JSON.stringify({ phase: binding.phase, stem, role: binding.role, sha256: sha, ...m }));
    if (errors.length === 0) {
      console.log(`✓ ${binding.phase}/${stem}: Lauf-/Kontaktvertrag erfüllt`);
    } else {
      failed++;
      console.error(`✗ ${stem}:`);
      for (const e of errors) console.error(`    ${e}`);
    }
  }
  for (const e of waiverHygiene(GROUND_PLANE_PENDING, waiverSeen)) { console.error(`✗ ${e}`); failed++; }
  if (failed === 0) console.log(`check-ground-plane: OK — ${stems.size} Steh-Blätter gemessen, ${waiverSeen.size} Duldung(en) gebraucht und keine schal`);
  return failed === 0 ? 0 : 1;
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exit(main());
