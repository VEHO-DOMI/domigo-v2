#!/usr/bin/env node
/**
 * N7A2 · DER LÖSCH-WÄCHTER — wer darf ein Blatt von der Platte nehmen?
 *
 * Der Ein-Block-Cutover gibt Blätter frei: sobald die Sicht-Körper eines Raums
 * jede solide Zelle besitzen, listet `massStems` sein Kachel-Kit nicht mehr, und
 * `check-paint-art` meldet es als „von nichts geladen". Genau dann werden PNGs
 * gelöscht — und eine falsche Löschung ist teuer: die Version davor lebt zwar in
 * der Historie, aber ein geteiltes Blatt reisst DREI Räume auf einmal auf.
 *
 * N7A1 hat die zwei Bedingungen von Hand gefahren und dabei richtig entschieden
 * (42 Blätter, kein p3/p4/p9-Blatt darunter) — nur ist das Werkzeug nie im Repo
 * gelandet. Das ist wörtlich die Falle, die dieselbe Bahn ins Register geschrieben
 * hat: »Artefakt + Erzeuger + Selbsttest landen zusammen, sonst ist das Artefakt
 * eine Behauptung.« Dies ist der Erzeuger.
 *
 * ZWEI BEDINGUNGEN, beide notwendig:
 *   1 · EIGENTUM — der Stem trägt den Raum im Namen (`_p3`, `_p1` …). Das ist die
 *       Wand vor den GETEILTEN Blättern: `mass_body_a`, `mass_fade`,
 *       `terrain_join_bookbinder` gehören p3 UND p4 UND p9. Sie fallen nie mit
 *       einem Raum.
 *   2 · VERWAIST — kein Raum und keine Karte lädt ihn mehr, gerechnet mit
 *       derselben Funktion, die `check-paint-art` benutzt (`phaseArtScope` +
 *       `domArtStems`), nicht mit einer Handliste.
 *
 *   node --experimental-strip-types scripts/retire-phase-art.mjs --phase p3
 *   node --experimental-strip-types scripts/retire-phase-art.mjs --phase p3 --apply
 *   node --experimental-strip-types scripts/retire-phase-art.mjs --selftest
 */
import fs from "node:fs";
import path from "node:path";
import { allScopePhases, domArtStems, phaseArtScope } from "../packages/game-paint/src/artScope.ts";

const R = process.cwd();
const ART = path.join(R, "apps/web/public/art/g1/paint");
const CONTENT = path.join(R, "content/corpus/stories");

const artFiles = () => {
  const out = new Map();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".png")) out.set(e.name.replace(/\.png$/, ""), p);
    }
  };
  walk(ART);
  return out;
};

const levels = () => {
  const out = [];
  for (const story of fs.readdirSync(CONTENT)) {
    const dir = path.join(CONTENT, story, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".level.json"))) {
      out.push(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
    }
  }
  return out;
};

/** Die Menge aller Stems, die IRGENDEIN Raum oder IRGENDEINE Karte noch lädt. */
export const loadedStems = (lvls, present) => {
  const claimed = new Set();
  for (const level of lvls) {
    for (const ph of allScopePhases(level)) for (const s of phaseArtScope(level, ph.id, present)) claimed.add(s);
    for (const s of domArtStems(level)) claimed.add(s);
  }
  return claimed;
};

/** Das Urteil je Stem — als Funktion, damit der Selbsttest sie ohne Platte fahren kann. */
/**
 * ★ N7A2c · NAMENTLICHE AUSNAHMEN VON BEDINGUNG 1 (Eigentum).
 *
 * Bedingung 1 verlangt den Raum IM NAMEN. Das ist eine ABKUERZUNG, kein Beweis:
 * sie schuetzt zuverlaessig vor geteilten Blaettern (`mass_body_a` gehoert p3 UND
 * p4 UND p9), sagt aber nichts ueber ein Blatt, das GEMESSEN genau einem Raum
 * gehoert und trotzdem keinen Raum im Namen traegt. Genau so ein Fall ist der
 * Vierteile-Rutschen-Bausatz: er hiess nie `slide_p3_*`.
 *
 * Eine Ausnahme steht deshalb NAMENTLICH, mit Datum und mit der Messung im
 * Grund — und sie kann Bedingung 2 (VERWAIST) niemals aufweichen. Sie hebt
 * allein die Namens-Abkuerzung auf; ob noch jemand das Blatt laedt, entscheidet
 * weiterhin die Rechnung, nicht diese Tabelle. Der Selbsttest haelt das fest.
 */
export const EIGENTUM_AUSNAHMEN = {
  slide_top: { phase: "p3", seit: "2026-09-03", why: "Rutschen-Bausatz, R264/N7A2c. Am Basis-Commit da915d35 gemessen: von GENAU EINER Stelle geladen (ch01/p3) und von 0 Karten; COMPOSITION hat eine einzige Kapitel-Tabelle, und nur ch01/p3 hat je ein slide deklariert. Der Hof malt seine fuenf z-Zellen jetzt selbst" },
  slide_mid: { phase: "p3", seit: "2026-09-03", why: "wie slide_top — und zusaetzlich: p3 hat dieses Blatt GELADEN und NIE gezeichnet (die fuenf z-Zellen zerfallen in vier Laeufe, drei davon einzellig: 4x slideTop + 1x slideFoot + 0x slideMid)" },
  slide_foot: { phase: "p3", seit: "2026-09-03", why: "wie slide_top" },
  slide_under: { phase: "p3", seit: "2026-09-03", why: "wie slide_top — die Strebe unter der Rutschbahn" },
};

export const judgeRetirement = (stem, phase, loaded) => {
  const ausnahme = EIGENTUM_AUSNAHMEN[stem];
  const owns = stem.includes(`_${phase}_`) || stem.endsWith(`_${phase}`)
    || (ausnahme !== undefined && ausnahme.phase === phase);
  if (!owns) return { ok: false, why: `traegt "${phase}" nicht im Namen — ein geteiltes Blatt faellt nie mit EINEM Raum` };
  // Bedingung 2 steht IMMER, auch fuer eine Ausnahme — sie ist die Rechnung.
  if (loaded.has(stem)) return { ok: false, why: "wird noch geladen (ein Raum oder eine Karte fragt danach)" };
  return {
    ok: true,
    why: ausnahme === undefined
      ? `gehoert ${phase} und wird von nichts mehr geladen`
      : `namentliche Ausnahme seit ${ausnahme.seit} und wird von nichts mehr geladen`,
  };
};

const selftest = () => {
  const geladen = new Set(["body_p3_westterrasse_rutsche", "mass_body_a", "crust_p4_a", "slide_under"]);
  const faelle = [
    ["crust_p3_a", "p3", true, "verwaistes Blatt des eigenen Raums"],
    ["crust_p3_cap_l", "p3", true, "dito, mit Zusatz im Namen"],
    ["mass_body_a", "p3", false, "GETEILT mit p4/p9 — traegt den Raum nicht im Namen"],
    ["mass_sediment", "p3", false, "GETEILT, und ausserdem geladen"],
    ["body_p3_westterrasse_rutsche", "p3", false, "gehoert p3, wird aber LEBEND geladen"],
    ["crust_p4_a", "p3", false, "fremder Raum"],
    ["terrain_join_bookbinder", "p3", false, "geteiltes Verbindungsstueck"],
    // ★ N7A2c · die namentliche Ausnahme, in beide Richtungen geprueft.
    ["slide_top", "p3", true, "Ausnahme: gemessen genau EINEM Raum gehoerig, ohne Raum im Namen"],
    ["slide_top", "p9", false, "die Ausnahme gilt nur fuer ihren eigenen Raum"],
    ["slide_under", "p3", false, "Ausnahme — aber noch GELADEN: Bedingung 2 schlaegt sie"],
  ];
  for (const [stem, phase, erwartet, wieso] of faelle) {
    const u = judgeRetirement(stem, phase, geladen);
    if (u.ok !== erwartet) {
      console.error(`✗ Selbsttest: ${stem} (${wieso}) — erwartet ${erwartet ? "FREIGABE" : "VERWEIGERUNG"}, bekam "${u.why}"`);
      return 1;
    }
  }
  // Tamper: faellt Bedingung 1 weg, gibt der Waechter ein geteiltes Blatt frei.
  const ohneEigentum = (stem, _phase, loaded) => ({ ok: !loaded.has(stem) });
  if (ohneEigentum("mass_body_b", "p3", geladen).ok !== true) {
    console.error("✗ Selbsttest-TAMPER: ohne die Eigentums-Bedingung muesste ein geteiltes Blatt durchfallen — tut es nicht");
    return 1;
  }
  // ★ Tamper 2: eine Ausnahme darf Bedingung 2 nicht aufweichen. Waere sie
  // VORGESCHALTET statt nachgeordnet, fiele ein LEBENDES Blatt von der Platte.
  const ausnahmeVorschaltung = (stem, phase, loaded) =>
    EIGENTUM_AUSNAHMEN[stem]?.phase === phase ? { ok: true } : { ok: !loaded.has(stem) };
  if (ausnahmeVorschaltung("slide_under", "p3", geladen).ok !== true) {
    console.error("✗ Selbsttest-TAMPER 2: eine vorgeschaltete Ausnahme muesste ein geladenes Blatt freigeben — tut sie nicht");
    return 1;
  }
  const freigaben = faelle.filter(([, , e]) => e).length;
  console.log(`retire-phase-art: Selbsttest OK — ${faelle.length} Urteile (${freigaben} Freigaben, ${faelle.length - freigaben} Verweigerungen) + 2 Tamper`);
  return 0;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) return selftest();
  const phase = args[args.indexOf("--phase") + 1];
  if (args.indexOf("--phase") < 0 || phase === undefined) { console.error("--phase <id> fehlt"); return 2; }
  const apply = args.includes("--apply");
  // `--nur` grenzt den UMFANG ein, nicht das Urteil: der Waechter prueft jedes
  // genannte Blatt genauso streng und verweigert es notfalls. Der Grund fuer die
  // Trennung ist gemessen — in p3 gibt der Waechter sechs Blaetter frei, aber
  // zwei davon (`band_p3_playground`, `plate_p3_yardwall`) waren schon VOR dem
  // Cutover tot. Was eine Bahn zurueckzieht, loescht sie; Altbestand gehoert
  // einer eigenen Aufraeumung (dieselbe Entscheidung traf N7A1 fuer die drei
  // toten `_p1`/`_p2`-Blaetter). Eine Bahn, die beim Aufraeumen mehr mitnimmt
  // als sie verursacht hat, macht ihren eigenen Vorher/Nachher-Beweis unlesbar.
  const nurIdx = args.indexOf("--nur");
  const nur = nurIdx >= 0 ? new Set((args[nurIdx + 1] ?? "").split(",").filter(Boolean)) : null;
  const files = artFiles();
  const present = new Set(files.keys());
  const loaded = loadedStems(levels(), present);
  const frei = [];
  for (const stem of [...present].sort()) {
    if (nur !== null && !nur.has(stem)) continue;
    const u = judgeRetirement(stem, phase, loaded);
    if (u.ok) frei.push(stem);
    else if (nur !== null) { console.error(`✗ ${stem}: VERWEIGERT — ${u.why}`); return 1; }
  }
  if (nur !== null) {
    const fehlt = [...nur].filter((s) => !present.has(s));
    if (fehlt.length > 0) { console.error(`✗ nicht auf der Platte: ${fehlt.join(", ")}`); return 1; }
  }
  if (frei.length === 0) { console.log(`retire-phase-art: kein Blatt von ${phase} ist zur Loeschung frei`); return 0; }
  let bytes = 0;
  for (const stem of frei) {
    const f = files.get(stem);
    const size = fs.statSync(f).size;
    bytes += size;
    console.log(`${apply ? "geloescht" : "FREI"}  ${stem}  (${(size / 1024).toFixed(0)} KB)`);
    if (apply) fs.unlinkSync(f);
  }
  console.log(`retire-phase-art: ${frei.length} Blaetter von ${phase}, ${(bytes / (1024 * 1024)).toFixed(2)} MB${apply ? " GELOESCHT" : " (Probelauf — --apply loescht)"}`);
  return 0;
};

process.exit(main());
