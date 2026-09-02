// L0 · D10 · DIE EINE KAPITEL-AUFLÖSUNG, DIE ALLE TORE TEILEN.
//
// WARUM ES DIESE DATEI GIBT. Bis zur Level-Welle trug jedes Tor seinen eigenen
// fest verdrahteten ch01-Pfad: `check-level-design` hatte vier, `check-copy-
// register` zwei, `check-game-tasks` fünf, `record-paint-tape` einen. Acht
// Skripte, acht Meinungen darüber, was ein Kapitel ist — und keines davon
// hätte je bemerkt, dass ein zweites existiert. Das ist dieselbe Klasse, die
// `check-body-silhouette` an p4/p9 bezahlt hat: ein Tor kennt nur die Räume,
// für die es je gelaufen ist. Also gibt es die Auflösung EINMAL, und die Tore
// fragen sie.
//
// ENTWÜRFE. Ein Kapitel mit `draft: true` wird gerade gebaut: es hat Gitter,
// aber vielleicht noch keine Dossiers, keine Karten, kein Lexikon. Die Gesetze,
// deren EINGABEN dastehen, laufen trotzdem — ein Entwurf ist kein Freibrief.
// Was fehlt, wird NAMENTLICH als »übersprungen (draft)« gedruckt, nie still:
// eine stille Auslassung ist von einem defekten Tor nicht zu unterscheiden.
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
const STORIES = path.join(ROOT, "content", "corpus", "stories");
const DESIGN = path.join(ROOT, "docs", "design", "g1", "paint");
const UNITS = path.join(ROOT, "content", "corpus", "units");
const GROUNDING = path.join(ROOT, "docs", "design", "g1", "grounding");

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

/** `1` → `g1-u01`. Die Unit-Nummer steht in `story.json` als ZAHL; der
 *  Korpus-Ordner trägt den Klassen-Präfix und zwei Stellen. */
export const unitSlug = (grade, n) => `g${grade}-u${String(n).padStart(2, "0")}`;

/** Was `story.json` über dieses Kapitel sagt (Unit-Nummer + Titel), oder null.
 *  Die Kapitel-Id der Geschichte ist `<storyId>.chNN`. */
export const storyChapter = (storyId, chapter) => {
  const sp = path.join(STORIES, storyId, "story.json");
  if (!fs.existsSync(sp)) return null;
  const story = readJson(sp);
  return (story.chapters ?? []).find((c) => String(c.id).endsWith(`.${chapter}`)) ?? null;
};

/**
 * Jedes Kapitel, das auf der Platte liegt — die Level-Datei ist der Ausweis.
 * Die Reihenfolge ist alphabetisch und damit stabil, damit zwei Läufe dieselbe
 * Meldungs-Reihenfolge haben.
 *
 * Jeder Eintrag nennt seine Eingaben mit VOLLEM Pfad und mit einem `has*`-Flag
 * daneben, damit ein Tor nie raten muss, ob eine Datei fehlt oder ob es sie
 * nur falsch gesucht hat.
 */
export const paintChapters = () => {
  const out = [];
  if (!fs.existsSync(STORIES)) return out;
  for (const storyId of fs.readdirSync(STORIES).sort()) {
    const dir = path.join(STORIES, storyId, "paint");
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => /^ch\d{2}\.level\.json$/.test(x)).sort()) {
      const chapter = f.slice(0, 4);
      const levelPath = path.join(dir, f);
      const level = readJson(levelPath);
      const grade = Number(String(storyId).match(/^g(\d)\./)?.[1] ?? 1);
      const tasksPath = path.join(dir, `${chapter}.tasks.v2.json`);
      const policyPath = path.join(dir, `${chapter}.policy.json`);
      const proofPath = path.join(dir, `${chapter}.proof.json`);
      const dossiers = path.join(DESIGN, `${chapter}-dossiers-v2`);
      const claimsPath = path.join(dossiers, "claims.json");
      const sheetPath = path.join(DESIGN, `${chapter}.md`);
      const pilotsPath = path.join(ROOT, "scripts", "paint-pilots", `${chapter}.pilots.mjs`);
      // Die Unit: was die Karten sagen, sonst was die Geschichte sagt. Beide
      // werden von check-game-tasks gegeneinander geprüft — hier wird nur
      // aufgelöst, nicht gerichtet.
      const sc = storyChapter(storyId, chapter);
      const storyUnit = typeof sc?.unit === "number" ? unitSlug(grade, sc.unit) : null;
      const tasksUnit = fs.existsSync(tasksPath) ? (readJson(tasksPath).unit ?? null) : null;
      const unit = tasksUnit ?? storyUnit;
      out.push({
        storyId, chapter, grade, dir,
        level, levelPath,
        draft: level.draft === true,
        phases: [...level.phases, ...(level.bonus ? [level.bonus] : []), ...(level.arena ? [level.arena] : [])],
        tasksPath, hasTasks: fs.existsSync(tasksPath),
        policyPath, hasPolicy: fs.existsSync(policyPath),
        proofPath, hasProof: fs.existsSync(proofPath),
        dossiers, hasDossiers: fs.existsSync(dossiers),
        claimsPath, hasClaims: fs.existsSync(claimsPath),
        sheetPath, hasSheet: fs.existsSync(sheetPath),
        pilotsPath, hasPilots: fs.existsSync(pilotsPath),
        unit, tasksUnit, storyUnit,
        titleDe: sc?.titleDe ?? null,
        wordbankPath: unit ? path.join(UNITS, unit, "wordbank.json") : null,
        grammarPath: unit ? path.join(UNITS, unit, "grammar.json") : null,
        lexiconPath: unit ? path.join(GROUNDING, `${unit.replace(/^g\d-/, "")}-lexicon.json`) : null,
      });
    }
  }
  return out;
};

/**
 * Der Sammler für ausgelassene Gesetze. Ein Tor legt einen an, meldet jede
 * Auslassung MIT Grund, und druckt am Ende `notes()` neben seiner OK-Zeile.
 *
 * Die Regel dahinter ist die teuerste Lehre der Tor-Bahnen: ein Gesetz, das
 * eine fehlende Eingabe still überspringt, sieht von aussen genauso aus wie
 * ein Gesetz, das grün ist. `check-body-silhouette` hat p4 und p9 auf genau
 * diese Weise nie gelesen.
 */
export const skipLedger = () => {
  const rows = [];
  return {
    /** @param {string} chapter @param {string} law @param {string} why */
    skip: (chapter, law, why) => { rows.push(`${chapter}/${law}: übersprungen (draft) — ${why}`); },
    rows: () => rows,
    print: () => { for (const r of rows) console.log(`  · ${r}`); },
  };
};
