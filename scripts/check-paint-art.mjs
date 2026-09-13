#!/usr/bin/env node
// PB-T2 · the RENDERER HONESTY GATE: every stem a shipped paint level needs
// (per packages/game-paint/src/artManifest.ts) must exist as a PNG under
// apps/web/public/art/g1/paint/** — or sit on the EXPLICIT allowlist
// (scripts/paint-art-allowlist.json: [{stem, reason, until}]). Silent
// procedural placeholders shipping to students was the playtest's F13 class.
// Allowlist hygiene is enforced both ways: an entry whose art now exists
// fails (stale), and an entry past its `until` date fails (expired).
// Run: node scripts/check-paint-art.mjs            (exit 1 on any failure)
//      node scripts/check-paint-art.mjs --selftest (proves the red light works)
//
// ── R5-W7 · W6 · D-454: DAS TEUERSTE TOR KANN JETZT ROT ZEIGEN ──────────────
// An diesem Tor haengt die Tot-Kunst-Ratsche, und bis heute konnte es nur
// gruen. Die MENGENLOGIK (jeder benoetigte Stem liegt oder steht mit Grund auf
// der Allowlist · keine schale und keine abgelaufene Ausnahme · die
// Scope-Loecher · die DEAD_ART-Ratsche) ist deshalb eine REINE FUNKTION ueber
// die geladene Welt geworden. Der Selbsttest reicht ihr die ECHTE Welt mit
// genau EINER Verfaelschung herein (P-71) und prueft, dass GENAU der
// eingespeiste Fehler gemeldet wird (E5-Lehre); der letzte Fall ist der
// wichtigste — der ECHTE Stand muss gruen sein.
// EHRLICHE GRENZE: die BILDPUNKT-Gesetze (Farbschluessel-Fransen, Insassen-
// Lesbarkeit) bleiben ausserhalb der reinen Funktion — sie lesen PNGs von der
// Platte und haben ihre eigenen Messungen. Gedeckt ist die Mengenlogik.

import fs from "node:fs";
import path from "node:path";
import { PLACEHOLDER_UNTIL, isPlaceholderStem } from "../packages/game-paint/src/composition.ts";
// R5-W1 · E1: the required set and the LOADED set are derived by ONE module,
// so the gate can no longer demand a stem the loader would never fetch (and
// vice versa) — Audit A below is that assertion.
import { ALWAYS_STEMS, allScopePhases, levelRequiredStems, phaseArtScope, phaseRequiredStems } from "../packages/game-paint/src/artScope.ts";
import { captiveStem, isCaptiveKey } from "../packages/game-paint/src/artManifest.ts";
import { entDisplayH } from "../packages/game-paint/src/anim.ts";
import { keyFringe, readPng } from "./key-fringe.mjs";
import { DEAD_ART_CEILING } from "../packages/game-paint/src/perfBudget.ts";
import { chapterArtFiles, loadedArtClaims } from "./paint-art-claims.mjs";

const R = process.cwd();
const ART_ROOT = path.join(R, "apps/web/public/art/g1/paint");
const ALLOW_PATH = path.join(R, "scripts/paint-art-allowlist.json");
const CONTENT = path.join(R, "content/corpus/stories");

// gather every present stem (any depth under the paint art root)
const present = new Set();
const files = new Map(); // relative PNG path → absolute path; chapter identity is never flattened
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith(".png")) {
      files.set(path.relative(ART_ROOT, path.join(dir, e.name)).split(path.sep).join("/"), path.join(dir, e.name));
      present.add(e.name.replace(/\.png$/, ""));
    }
  }
};
walk(ART_ROOT);

const allow = fs.existsSync(ALLOW_PATH) ? JSON.parse(fs.readFileSync(ALLOW_PATH, "utf8")) : [];
const today = new Date().toISOString().slice(0, 10);

// All levels claim real loaded files; missing-art obligations remain shipped-only.
const levels = [];
// L0d · R263 · …und JEDES Kapitel, Entwurf eingeschlossen. Die Entwurfs-Ausnahme
// gilt fuer die WELT (graue Kaesten sind gewollt, solange ein Kapitel im Bau
// ist), nie fuer die FIGUR: die steht in jedem Bild auf dem Schirm.
const alleKapitel = [];
for (const story of fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT) : []) {
  const paintDir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(paintDir)) continue;
  for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
    const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8"));
    if (typeof level.chapter === "string") alleKapitel.push({ file: f, chapter: level.chapter, draft: level.draft === true });
    const taskFile = path.join(paintDir, f.replace(/\.level\.json$/, ".tasks.v2.json"));
    const tasks = fs.existsSync(taskFile) ? JSON.parse(fs.readFileSync(taskFile, "utf8")).items : [];
    levels.push({ file: f, level, tasks });
  }
}

// ── L0d · R263 · DIE KARTE JE KAPITEL, NICHT DIE PLATTE ─────────────────────
// `present` oben ist die FLACHE Menge ueber den ganzen Kunst-Baum: fuer sie
// liegt `hero2_run0` da, egal in welchem Ordner. Der ausgelieferte Aufloeser ist
// ordner-genau — `apps/web/lib/paint-art.ts#artDirsFor` gibt jedem Kapitel
// GENAU `["hero", chapter]`. Genau diese Luecke ist der Grund, warum kein Tor
// gesehen hat, dass die 14 hero2-Zellen im Ordner von ch01 lagen und ch02–ch06
// still den alten Teile-Baukasten zeichneten.
// Loaded-file and pixel audits also keep physical paths; hero availability below
// retains its explicit per-chapter report.
const blaetterIn = (dir) => {
  const out = new Set();
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith(".png")) out.add(e.name.replace(/\.png$/, ""));
  }
  return out;
};
/** Mirror von artDirsFor: hero (geteilt) zuerst, dann der Kapitel-Ordner. */
const KAPITEL_ORDNER = ["hero"];
const praesentJeKapitel = new Map();
for (const { chapter } of alleKapitel) {
  if (praesentJeKapitel.has(chapter)) continue;
  const menge = new Set();
  for (const dir of [...KAPITEL_ORDNER, chapter]) for (const s of blaetterIn(path.join(ART_ROOT, dir))) menge.add(s);
  praesentJeKapitel.set(chapter, menge);
}

/** die MB-Summe der toten Blaetter — Platte, deshalb ausserhalb der reinen Funktion */
const bytesOfDead = (dead) => {
  let bytes = 0;
  for (const s of dead) { const f = files.get(s); if (f) bytes += fs.statSync(f).size; }
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * Die MENGENLOGIK als reine Funktion der geladenen Welt. Rein, damit der
 * Selbsttest ihr die echte Welt mit genau EINER Verfaelschung reichen kann
 * (P-71: Tamper gegen den Messwert, nie gegen die Konstante — die Ratsche wird
 * deshalb ueber ein zusaetzliches Blatt in `present` ausgeloest, nicht ueber
 * eine heruntergedrehte Decke).
 *
 * @param {{levels:{file:string,level:object}[], present:Set<string>, files:Map<string,string>,
 *          allow:{stem:string,reason?:string,until?:string}[], today:string,
 *          deadCeiling:number, bytesOfDead?:(dead:string[])=>string,
 *          alleKapitel:{file:string,chapter:string,draft:boolean}[],
 *          praesentJeKapitel:Map<string,Set<string>>}} welt
 */
export const analyse = ({ levels, present, files, allow, today, deadCeiling, bytesOfDead = () => "? MB", alleKapitel = [], praesentJeKapitel = new Map() }) => {
    const shippedLevels = levels.filter(({ level }) => level.draft !== true);
    const loaded = loadedArtClaims(levels, files.keys());
    const allowByStem = new Map(allow.map((a) => [a.stem, a]));
    const failures = [];
    const warnings = [];
    const fail = (msg) => { failures.push(msg); };
    // collect required stems from every non-draft level (derivation: artScope.ts)
    const required = new Map(); // stem → where it's needed
    const requiredLocations = new Map();
    for (const { file, level } of shippedLevels) {
      for (const [stem, where] of levelRequiredStems(level, file)) {
        if (!required.has(stem)) required.set(stem, where);
        requiredLocations.set(`${level.chapter}/${stem}`, { stem, where, chapter: level.chapter });
      }
    }

  const staleReported = new Set();
  for (const { stem, where, chapter } of requiredLocations.values()) {
    const listed = allowByStem.get(stem);
    if (loaded.byChapter.get(chapter)?.has(stem)) {
      if (listed && !staleReported.has(stem)) { fail(`allowlist STALE: ${stem} exists now — remove its entry`); staleReported.add(stem); }
      continue;
    }
    if (!listed) { fail(`missing stem "${stem}" (needed by ${where}) — paint it or allowlist it with a reason+until`); continue; }
    if (!listed.reason || !listed.until) { fail(`allowlist entry for ${stem} needs reason AND until`); continue; }
    if (listed.until < today) fail(`allowlist EXPIRED for ${stem} (until ${listed.until}) — paint it or extend with a new reason`);
  }
  for (const a of allow) {
    if (!required.has(a.stem) && !present.has(a.stem)) fail(`allowlist entry ${a.stem} is needed by nothing — remove it`);
  }

  // ── R5-W1 · E1 · AUDIT A · THE GATE AND THE LOADER MUST AGREE ───────────────
  // Per-phase loading can fail in a way NO existing check can see: PaintScene.tex()
  // answers a missing stem with a procedural blob, so an under-scoped phase ships
  // grey shapes with every gate green. This audit is the structural answer — every
  // stem this gate demands must be a stem the phase's loader would actually fetch.
  // Floor ⊆ ceiling, asserted per phase, by machine.
  for (const { file, level } of shippedLevels) {
    const chapterPresent = new Set(loaded.byChapter.get(level.chapter)?.keys() ?? []);
    for (const ph of allScopePhases(level)) {
      const scope = phaseArtScope(level, ph.id, chapterPresent);
      for (const [stem, where] of phaseRequiredStems(level, ph.id, file)) {
        if (!scope.has(stem)) fail(`SCOPE HOLE: "${stem}" is required (${where}) but phase ${ph.id} would never load it — it would render as a procedural fallback with every gate green`);
      }
    }
  }

  // ── R5-W1 · E1 · AUDIT B · ART NOTHING LOADS ────────────────────────────────
  // A warning, never a failure: the keen-art law lets a batch land before its
  // wiring does. But silence let 45.9 MB accumulate that no phase and no card
  // ever asks for, so the number is now said out loud on every run.
  let dead = [];
  {
    dead = loaded.dead;
    if (dead.length > 0) {
      warnings.push(`⚠ ${dead.length} painted files are loaded by nothing (${bytesOfDead(dead)}): ${dead.slice(0, 8).join(", ")}${dead.length > 8 ? ", …" : ""}`);
      // R5-W3 · E5 · THE RATCHET. The warning above ran on every build for three
      // sessions while the pile went 53 → 57 → 59 → 61 stems, because a warning
      // costs nothing to ignore. (R5-W6b · W5 · D-271 — the story continues past
      // that line and this comment stopped telling it: the merge train of wave 4b
      // wired and deleted enough art to bring the pile back to 53, which is where
      // the ceiling was then set, with no headroom. So the row reads
      // 53 → 57 → 59 → 61 → 53, and 53 is the number as of 2026-08-19. Whoever
      // moves it next writes the next number here, with its date.) The keen-art freedom stays — art may land before
      // its wiring — but the pile may no longer grow in SILENCE: adding sheets
      // means raising the ceiling in the same PR, with a reason a reviewer reads.
      // The full annotated list, by group: docs/design/g1/paint/DEAD_ART_2026-08-14.md
      if (dead.length > deadCeiling) {
        fail(
          `${dead.length} painted files are loaded by nothing — the ceiling is ${deadCeiling} (perfBudget.ts). ` +
            `Wire them, delete them, or raise deadCeiling in this same PR with a reason. New since the ceiling: ` +
            dead.slice(deadCeiling).join(", "),
        );
      }
    }
  }

  // PB-C1 · THE PLACEHOLDER GUARD. The composition kit currently points at
  // generated flat-tone stand-ins so the geometry laws could be proven before
  // Batch AF exists. They are stamped PLACEHOLDER on the piece and they must not
  // outlive the art: past the deadline this HARD-FAILS, so "we'll swap it later"
  // cannot quietly become "we shipped it".
  const placeholders = [...required.keys()].filter(isPlaceholderStem);
  if (placeholders.length > 0) {
    if (today > PLACEHOLDER_UNTIL) {
      fail(`${placeholders.length} PLACEHOLDER stems are still wired (deadline ${PLACEHOLDER_UNTIL} passed) — land Batch AF and re-point the composition manifest`);
    } else {
      warnings.push(`check-paint-art: ⚠ ${placeholders.length} placeholder stems wired (PK-C2 replaces them; hard deadline ${PLACEHOLDER_UNTIL})`);
    }
  }


  // ── L0d · R263 · AUDIT C · DER HELD GEHOERT ALLEN KAPITELN ─────────────────
  // Jedes Kapitel — auch ein Entwurf — muss JEDEN `ALWAYS_STEM` in seiner
  // EIGENEN Kunst-Karte aufloesen. Diese explizite Helden-Ausnahme bleibt
  // auch fuer Entwuerfe verbindlich.
  //
  // Warum es das Gesetz braucht: die Figur ist keine Kapitel-Kunst. Ein Kapitel
  // im Bau darf graue Kaesten haben — es darf nicht den falschen Jungen haben.
  // Und der Rueckfall auf den Teile-Baukasten ist zur Laufzeit kein Fehler,
  // sondern ein anderes Bild (`PaintScene`, Full-Pose-Block): ohne dieses Tor
  // sieht ihn niemand ausser einem Menschen, der genau hinschaut.
  const heldenZeilen = [];
  for (const { file, chapter, draft } of alleKapitel) {
    const karte = praesentJeKapitel.get(chapter) ?? new Set();
    const fehlt = ALWAYS_STEMS.filter((stem) => !karte.has(stem));
    heldenZeilen.push(`${chapter}${draft ? " (Entwurf)" : ""}: ${ALWAYS_STEMS.length - fehlt.length}/${ALWAYS_STEMS.length}`);
    if (fehlt.length === 0) continue;
    fail(
      `HELD FEHLT in ${chapter}${draft ? " (Entwurf — die Ausnahme gilt fuer die Welt, nicht fuer die Figur)" : ""}: `
        + `${fehlt.length} von ${ALWAYS_STEMS.length} Helden-Blaettern loest dieses Kapitel nicht auf `
        + `(${fehlt.slice(0, 6).join(", ")}${fehlt.length > 6 ? ", …" : ""}). `
        + `Der Aufloeser gibt ${chapter} genau die Ordner art/g1/paint/{hero,${chapter}} `
        + `(apps/web/lib/paint-art.ts#artDirsFor) — ein Helden-Blatt gehoert nach hero/, `
        + `sonst zeichnet ${chapter} still den alten Teile-Baukasten (${file}, L0d · R263)`,
    );
  }

  return { failures, warnings, required, requiredLocations, dead, heldenZeilen };
};

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// Vier Verfaelschungen an der ECHTEN Welt, jede an genau einer Groesse
// (W5-Falle 4: ein Tamper, der zwei Groessen bewegt, wird am falschen Gesetz
// rot und beweist ueber das gemeinte nichts). Der fuenfte Fall ist der
// wichtigste: unverfaelscht muss der Stand gruen sein.
if (process.argv.includes("--selftest")) {
  const welt = { levels, present, files, allow, today, deadCeiling: DEAD_ART_CEILING, bytesOfDead, alleKapitel, praesentJeKapitel };
  // ein Stem, den ein Level WIRKLICH verlangt und der WIRKLICH liegt — nicht geraten
  const { requiredLocations: echtGefordert } = analyse(welt);
  const witness = [...echtGefordert.values()].find(({ stem, chapter }) => chapterArtFiles(files.keys(), chapter).has(stem));
  const echterStem = witness?.stem;
  const echteDatei = witness ? chapterArtFiles(files.keys(), witness.chapter).get(witness.stem) : undefined;
  if (echterStem === undefined) throw new Error("kein geforderter Stem liegt — der Selbsttest kann nicht bauen");
  // L0d: das Kapitel und das Blatt fuer den Helden-Fall werden GESUCHT, nicht
  // getippt — ein Selbsttest, der sich seine Fixture aus dem Bestand holt, wird
  // sonst blind, sobald der Bestand sich dreht (N7A2-Falle, 02.09.). Bevorzugt
  // ein Entwurf, weil dort die Blindheit sass; sonst irgendein Kapitel.
  const tamperKapitel = (alleKapitel.find((k) => k.draft) ?? alleKapitel[0])?.chapter ?? null;
  const tamperStem = ALWAYS_STEMS.find((x) => x.startsWith("hero2_")) ?? ALWAYS_STEMS[0];
  if (tamperKapitel !== null && !(praesentJeKapitel.get(tamperKapitel) ?? new Set()).has(tamperStem)) {
    throw new Error(`der Selbsttest kann nichts wegnehmen: ${tamperKapitel} loest ${tamperStem} schon jetzt nicht auf`);
  }

  const faelle = [
    ["ein gefordertes Blatt fehlt auf der Platte", () => {
      const ohne = new Map(files); ohne.delete(echteDatei);
      return analyse({ ...welt, files: ohne });
    }, `missing stem "${echterStem}"`],

    ["eine Ausnahme ist schal: das Blatt liegt inzwischen doch", () =>
      analyse({ ...welt, allow: [...allow, { stem: echterStem, reason: "erfunden, damit dieser Fall rot wird", until: "2099-01-01" }] }),
      `allowlist STALE: ${echterStem}`],

    ["eine Ausnahme wird von niemandem gebraucht", () =>
      analyse({ ...welt, allow: [...allow, { stem: "gibt-es-nicht-und-braucht-niemand", reason: "erfunden, damit dieser Fall rot wird", until: "2099-01-01" }] }),
      "is needed by nothing"],

    ["die Tot-Kunst-Ratsche: ein Blatt mehr, als die Decke traegt", () => {
      // die WELT waechst, nicht die Decke — sonst misst der Fall die Konstante
      const mehr = new Map(files);
      mehr.set("ch01/w6_selftest_totes_blatt_0.png", "unused test path");
      return analyse({ ...welt, files: mehr });
    }, `the ceiling is ${DEAD_ART_CEILING}`],

    // L0d · R263 · der Fall, den es vor dieser Bahn nicht gab. Verfaelscht wird
    // die KAPITEL-KARTE (der Messwert), nicht das Gesetz: einem Kapitel wird
    // genau ein Helden-Blatt weggenommen. Bevorzugt einem ENTWURF, denn genau
    // dort war das Tor blind — es hat Entwurfs-Kapitel gar nicht erst gelesen.
    [`ein Kapitel loest ein Helden-Blatt nicht auf${tamperKapitel === null ? " (kein Kapitel auf der Platte — uebersprungen)" : ""}`, () => {
      if (tamperKapitel === null) return { failures: [] };
      const karten = new Map(praesentJeKapitel);
      const ohne = new Set(karten.get(tamperKapitel));
      ohne.delete(tamperStem);
      karten.set(tamperKapitel, ohne);
      return analyse({ ...welt, praesentJeKapitel: karten });
    }, tamperKapitel === null ? null : `HELD FEHLT in ${tamperKapitel}`],

    ["Ordneraufloeser verwendet auch einen einmaligen Iterator vollstaendig", () => {
      const fixture = ["hero/shared.png", "ch01/shared.png", "ch02/other.png"];
      const chapter = chapterArtFiles(new Set(fixture).keys(), "ch01");
      const second = chapterArtFiles(new Set(fixture).keys(), "ch02");
      const good = chapter.get("shared") === "ch01/shared.png"
        && second.get("shared") === "hero/shared.png"
        && !chapter.has("other")
        && !chapterArtFiles(["ch01/shared.png"], "ch02").has("shared");
      return { failures: good ? [] : ["Kapitel-/Hero-Aufloesung oder Iteratorwiederverwendung falsch"] };
    }, null],

    ["echte geladene Entwurfskunst bleibt beansprucht", () => {
      const source = levels.find(({ level }) => level.draft === true && [...files.keys()].some(f => f.startsWith(level.chapter + "/"))) ?? levels[0];
      const draft = { ...source, level: { ...source.level, draft: true } };
      const result = loadedArtClaims([draft], files.keys());
      const own = [...result.claimed.keys()].filter(f => f.startsWith(draft.level.chapter + "/"));
      return { failures: own.length > 0 && own.every(f => !result.dead.includes(f)) ? [] : ["Geladene Entwurfsdatei wird faelschlich tot genannt"] };
    }, null],

    ["fehlende Weltkunst eines Entwurfs bleibt erlaubt", () => {
      const source = levels.find(({ level }) => level.draft === true && [...files.keys()].some(f => f.startsWith(level.chapter + "/"))) ?? levels[0];
      const draft = { ...source, level: { ...source.level, draft: true } };
      const stem = [...levelRequiredStems(draft.level).keys()].find(s => !ALWAYS_STEMS.includes(s) && chapterArtFiles(files.keys(), draft.level.chapter).has(s));
      if (!stem) throw new Error("Kein echtes Weltblatt fuer den Entwurfs-Gegentest gefunden");
      const fewer = new Map(files); fewer.delete(chapterArtFiles(files.keys(), draft.level.chapter).get(stem));
      const changed = levels.map(row => row === source ? draft : row);
      return analyse({ ...welt, levels: changed, files: fewer });
    }, null],

    ["Aufgabenbilder gehoeren nur zur passenden Kapitelkarte, auch als HTML", () => {
      const source = levels[0];
      const stem = "qa_selftest_card_only", imageStem = "qa_selftest_image_only";
      const chapter = source.level.chapter, wrong = chapter === "ch02" ? "ch03" : "ch02";
      const own = `${chapter}/${stem}.png`, other = `${wrong}/${stem}.png`, hero = `hero/${stem}.png`;
      const image = `${chapter}/${imageStem}.png`;
      const context = { ...source, tasks: [...(source.tasks ?? []),
        { id: "qa-card", stimulus: { type: "entity", art: stem } },
        { id: "qa-image", stimulus: { type: "image", stem: imageStem } }] };
      const result = loadedArtClaims([context], [...files.keys(), own, other, hero, image]);
      const good = result.claimed.get(own)?.has(`${source.file} task qa-card DOM`)
        && result.claimed.get(image)?.has(`${source.file} task qa-image DOM`)
        && !result.claimed.has(other) && !result.claimed.has(hero);
      return { failures: good ? [] : ["HTML-Aufgabenbild wird nicht ordnergenau beansprucht"] };
    }, null],

    ["NICHT-TAMPER: der echte Stand ist gruen", () => analyse(welt), null],
  ];

  let schlecht = 0;
  for (const [name, lauf, muss] of faelle) {
    const { failures } = lauf();
    const rot = failures.length > 0;
    const sollRot = muss !== null;
    if (rot !== sollRot) {
      schlecht++;
      console.error(sollRot
        ? `  ✗ ${name} — KEIN rotes Licht, das Gesetz ist blind`
        : `  ✗ ${name} — der echte Stand ist rot: ${failures.slice(0, 3).join(" | ")}`);
      continue;
    }
    if (sollRot) {
      // E5-Lehre: GENAU der eingespeiste Fehler, und NUR er.
      const treffer = failures.filter((f) => f.includes(muss));
      if (treffer.length !== 1 || failures.length !== 1) {
        schlecht++;
        console.error(`  ✗ ${name} — rot, aber nicht sauber an der eingespeisten Stelle `
          + `(${treffer.length} passende von ${failures.length}); erwartet: ${muss}`
          + `\n      ${failures.slice(0, 3).join("\n      ")}`);
        continue;
      }
      console.log(`  ✓ ${name} — rot, genau eine Meldung, und es ist die eingespeiste`);
    } else {
      console.log(`  ✓ ${name} — gruen`);
    }
  }
  if (schlecht > 0) { console.error("check-paint-art --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-paint-art --selftest: OK — ${faelle.length} Faelle, fuenf rote Lichter an der `
    + `eingespeisten Stelle, der echte Stand gruen (Decke ${DEAD_ART_CEILING}; `
    + `Helden-Fall an ${tamperKapitel ?? "keinem Kapitel"} / ${tamperStem})`);
  process.exit(0);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const { failures: mengenFehler, warnings, required, heldenZeilen } = analyse({
  levels, present, files, allow, today, deadCeiling: DEAD_ART_CEILING, bytesOfDead, alleKapitel, praesentJeKapitel,
});
// L0d: die Helden-Bilanz steht VOR dem Urteil — ein Bericht, den nur ein gruener
// Lauf zeigt, fehlt genau dann, wenn jemand ihn braucht (L0-Falle, 02.09.).
console.log(`check-paint-art: Helden-Blaetter je Kapitel — ${heldenZeilen.join(" · ")}`);
for (const w of warnings) console.warn(w);
let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };
for (const m of mengenFehler) fail(m);

// PK-R6 · H1 · THE TILED-SURFACE FRINGE GATE. Batch AF was delivered over a
// magenta colour key and cut out against it, leaving a one-pixel skin of the key
// on every alpha boundary. On a prop that is invisible; on the TRAVERSAL
// SURFACES it is a defect the child stares at, because those stems TILE — eleven
// stray pixels in the ch01 crust's top row printed a magenta dot every 41 px
// along the walkable band, in every frame of the round-1 capture set.
// Repaired by scripts/strip-key-fringe.mjs; kept repaired here, so a re-import
// that brings the key back fails CI instead of shipping.
//
// PK-R6 · H2 · …AND IT WAS NEVER ONLY THE FLOOR (round-2 finding 2: „visible
// magenta cutout-fringe halos around the foliage/window-post edges in the
// ‚restored' shot"). H1 scoped this gate to the stems that TILE, on the argument
// that a repeated defect is the one a child stares at. The argument was right
// and the scope was wrong: the key was on the whole delivery, so the moment a
// still frame put a leaf or a window mullion in front of a bright wall, the same
// pink skin was there to be seen — and a critic saw it. Measured when this scope
// was widened: 179 of the shipped sheets carried fringe, the hall band alone
// 14 065 px.
//
// The gate is therefore the CLASS, not the instance: every PNG under the paint
// art root, tiling or not, prop or hero cell. There is no stem in this kit whose
// cut edge is allowed to keep the colour it was cut against.
const fringeStems = new Set(files.keys());
let fringeTotal = 0;
for (const stem of [...fringeStems].sort()) {
  const file = files.get(stem);
  if (!file) continue; // "missing" is the presence gate's business, above
  const hits = keyFringe(readPng(file));
  if (hits.length === 0) continue;
  fringeTotal += hits.length;
  const at = hits[0];
  fail(`colour-key fringe on "${stem}": ${hits.length} magenta px on its cut edge (first at ${at.x},${at.y}) — run: node --experimental-strip-types scripts/strip-key-fringe.mjs`);
}

// ── R5-W3 · A5 · D-48 · THE CAPTIVE MUST SURVIVE ITS OWN CAGE ────────────────
//
// The finding this closes: four cages, four different things inside them, and on
// the screen all four were the same picture. Three art rounds were commissioned
// before anybody measured why — `entTargetH` drew the cage 22 px tall, and the
// paint that tells a sound system from a tablet is smaller than that.
//
// So the ruling (34 px) gets a law, and the law is measured the way the finding
// was: take the two captives that look MOST alike, draw both at the height the
// engine actually uses, and count how many pixels on the screen separate them.
// Measured over the shipped sheets:
//
//     drawn height   closest pair differs by
//         18 px            3.2 px
//         22 px            4.7 px      ← what shipped, and what the blind
//         26 px            6.7 px        reviewer could not tell apart
//         30 px            8.7 px
//         34 px           11.3 px      ← the ruling
//         48 px           22.4 px
//
// The floor is 8. It is not a taste: it sits between the height a blind reviewer
// rejected and the height the same reviewer accepted („ab 34 px trennen sich
// Lautsprecher-Kegel und Tablet"), and it is what makes this check DISCRIMINATE —
// put the cage back to 22 and it goes red at 4.7. A law that could not fail
// would have proven nothing.
//
// What it does NOT claim: that a child can name them. No script can measure
// that; the blind critic does, and its verdict is the one that counts.
const CAPTIVE_MIN_SEPARATION_PX = 8;

/** Box-downscale a sheet's ALPHA to the drawn height — a silhouette's identity
 *  is its shape, and the shape is what the cage's size takes away. */
const maskAt = (png, H) => {
  const W = Math.max(1, Math.round((png.width / png.height) * H));
  const a = new Float64Array(W * H);
  for (let y = 0; y < H; y++) {
    const y0 = Math.floor((y * png.height) / H);
    const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * png.height) / H));
    for (let x = 0; x < W; x++) {
      const x0 = Math.floor((x * png.width) / W);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * png.width) / W));
      let s = 0;
      let n = 0;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) { s += png.data[((yy * png.width + xx) << 2) + 3]; n++; }
      a[y * W + x] = n === 0 ? 0 : s / n / 255;
    }
  }
  return { W, H, a };
};

const captiveCages = [];
for (const { level } of levels.filter(({ level }) => level.draft !== true)) {
  for (const ph of allScopePhases(level)) {
    for (const e of ph.entities) {
      if (e.role === "cage" && isCaptiveKey(e.params?.captive)) captiveCages.push({ phase: ph.id, id: e.id, key: e.params.captive, chapter: level.chapter });
    }
  }
}
if (captiveCages.length > 0) {
  const H = entDisplayH({ role: "cage", skin: "satchel" });
  const masks = new Map();
  for (const { key, chapter } of captiveCages) {
    const maskKey = chapter + "/" + key;
    if (masks.has(maskKey)) continue;
    const relative = chapterArtFiles(files.keys(), chapter).get(captiveStem(key));
    const file = relative ? files.get(relative) : undefined;
    if (!file) { fail(`captive "${key}" is declared by a cage but ${captiveStem(key)}.png is not on disk`); continue; }
    masks.set(maskKey, maskAt(readPng(file).png, H));
  }
  const keys = [...masks.keys()].sort();
  let worst = { d: Infinity, pair: "" };
  let comparedPairs = 0;
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      if (keys[i].split("/")[0] !== keys[j].split("/")[0]) continue;
      comparedPairs++;
      const p = masks.get(keys[i]);
      const q = masks.get(keys[j]);
      let d = 0;
      for (let k = 0; k < p.a.length; k++) d += Math.abs(p.a[k] - q.a[k]);
      if (d < worst.d) worst = { d, pair: `${keys[i]}/${keys[j]}` };
    }
  }
  if (comparedPairs === 0) {
    console.log(`  captive legibility: ${keys.length} chapter-specific captives; no chapter has a pair to compare`);
  } else if (worst.d < CAPTIVE_MIN_SEPARATION_PX) {
    fail(`captive legibility: at the ${H}px the engine draws a cage, "${worst.pair}" differ by only ${worst.d.toFixed(1)} px on screen (law: ${CAPTIVE_MIN_SEPARATION_PX}) — the cage is too small for the paint inside it (D-48)`);
  } else {
    console.log(`  captive legibility: ${captiveCages.length} cages · ${keys.length} captives at ${H}px · closest pair "${worst.pair}" differs by ${worst.d.toFixed(1)} px (law: ${CAPTIVE_MIN_SEPARATION_PX})`);
  }
} else {
  console.log("  captive legibility: no cage declares a captive — nothing measured");
}

if (failures === 0) {
  console.log(`check-paint-art: OK — ${required.size} required stems all present or explicitly allowlisted (${present.size} painted stems on disk); all ${fringeStems.size} painted stems clean of colour-key fringe`);
} else {
  console.error(`check-paint-art: ${failures} failure(s)`);
  process.exit(1);
}
