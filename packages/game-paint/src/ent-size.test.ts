// R5-W3 · A5 · D-48 · THE SIZE OF A BEING IS ONE NUMBER, IN ONE PLACE.
//
// Two defects live behind this file, and they are the same defect twice.
//
// The first cost a whole visibility proof: `GUARDIAN_DISPLAY_H` was private to
// PaintScene, so `guardian-flight.test.ts` carried its own copy — 52 against a
// shipped 68 — and spent months proving a body 16 px shorter than the drawn one.
// The fix moved the constant to `anim.ts`. It did not move the TABLE, so every
// other role kept the same hazard.
//
// The second is D-48, one role down: the four `satchel` cages drew 22 px, and at
// 22 px a 347×480 painting keeps its outline and loses everything inside it —
// the sound system, the tablet, the chair and the class photo were one picture.
// Three art rounds were commissioned before anyone measured the size.
//
// So the table moved too, and these tests hold it there.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { CAGE_DISPLAY_H, GUARDIAN_DISPLAY_H, entDisplayArea, entDisplayH } from "./anim.ts";
import { CAPTIVE_KEYS, captiveStem, isCaptiveKey } from "./artManifest.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const STORIES = path.join(REPO, "content", "corpus", "stories");

interface Ent { id: string; role: string; skin: string; params?: Record<string, unknown> }
interface Lvl {
  phases: Array<{ id: string; entities: Ent[] }>;
  arena?: { id: string; entities: Ent[] } | null;
  bonus?: { id: string; entities: Ent[] } | null;
  draft?: boolean;
}

// L0c · P7 · DIESE DATEI KANNTE EIN KAPITEL. Bis zur Level-Welle war das
// richtig; ab ch02 hiess es, dass eine neue Rolle in einem neuen Kapitel keine
// Groesse zu haben braucht — die Tabelle waere still unvollstaendig geworden.
// Die Kapitel-Schleife ist die von `content-levels.test.ts`, wortgleich, damit
// beide Dateien dieselbe Vorstellung davon haben, was ausgeliefert ist.
const kapitel: Array<{ name: string; level: Lvl; entities: Ent[]; cages: Ent[] }> = [];
for (const story of fs.readdirSync(STORIES)) {
  const dir = path.join(STORIES, story, "paint");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /^ch\d{2}\.level\.json$/.test(x)).sort()) {
    const lvl = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Lvl;
    const entities = [
      ...lvl.phases.flatMap((p) => p.entities),
      ...(lvl.arena?.entities ?? []),
      ...(lvl.bonus?.entities ?? []),
    ];
    kapitel.push({ name: f.slice(0, 4), level: lvl, entities, cages: entities.filter((e) => e.role === "cage") });
  }
}
// Die Zahl der Kapitel-Dateien auf der Platte, unabhaengig gezaehlt: die Schleife
// oben und diese Zahl koennen nur gemeinsam falsch sein, und genau das ist der
// Punkt — ein ausgelassenes Kapitel faellt auf, statt still zu fehlen.
const levelDateienAufDerPlatte = fs.readdirSync(STORIES)
  .map((story) => path.join(STORIES, story, "paint"))
  .filter((d) => fs.existsSync(d))
  .flatMap((d) => fs.readdirSync(d).filter((x) => /^ch\d{2}\.level\.json$/.test(x)));

// ch01 bleibt der Traeger der KAPITEL-FORM-Gesetze unten (zwei Gerätefächer,
// ein Fotokäfig und ein Personen-Penal): das sind Aussagen ueber DIESES Kapitel, nicht ueber die
// Tabelle. Die Tabellen-Gesetze laufen weiter unten ueber alle Kapitel.
// Der ZWEITE, FREMDE Leser: die geteilte Kapitel-Aufloesung, die auch die Tore
// fragen. Sie ist reines JavaScript ohne Typ-Deklaration, deshalb dynamisch
// geladen und hier EINMAL auf die eine Form gebracht, die dieser Test braucht.
// Der Pfad wird zur LAUFZEIT gebaut: `paint-chapters.mjs` ist reines
// JavaScript ohne Typ-Deklaration, und ein statischer Import daraus waere fuer
// `tsc` ein implizites `any`. Ueber eine URL geladen, ist die Form eine
// ausdrueckliche Zusage dieses Tests — genau die drei Felder, die er braucht.
const GETEILT = pathToFileURL(path.resolve(HERE, "../../../scripts/paint-chapters.mjs")).href;
const geteilt = await import(GETEILT) as { paintChapters: () => Array<{ chapter: string }> };
const geteilteKapitel: string[] = geteilt.paintChapters().map((c) => c.chapter);

const ch01 = kapitel.find((c) => c.name === "ch01");
if (ch01 === undefined) throw new Error("ch01.level.json nicht gefunden — diese Suite misst die ausgelieferte Tabelle");
const everyEntity: Ent[] = ch01.entities;
const cages = ch01.cages;

// W36: the requested larger device windows and Merle/photo frames have distinct
// measured registrations. Pin exact authored identities, not just a smaller count.
const CH01_CAGE_HEIGHTS: Readonly<Record<string, number>> = {
  "p1-cage1": 48,
  "p2-cage-tablet": 48,
  "p2-cage-merle": 54,
  "p4-cage5": 54,
};

describe("D-48 · every cage uses its centrally registered size", () => {
  it("the chapter contains exactly the two device lockers, Merle's case and photo frame", () => {
    expect(cages.map((e) => ({
      id: e.id, skin: e.skin, shell: e.params?.shellArt,
      captive: e.params?.captive, classmate: e.params?.classmate,
    }))).toEqual([
      { id: "p1-cage1", skin: "satchel", shell: "device_locker", captive: "soundsystem", classmate: undefined },
      { id: "p2-cage-tablet", skin: "satchel", shell: "device_locker", captive: "tablet", classmate: undefined },
      { id: "p2-cage-merle", skin: "pencilcase", shell: undefined, captive: undefined, classmate: "merle" },
      { id: "p4-cage5", skin: "satchel", shell: "photo_frame_cage", captive: "picture", classmate: undefined },
    ]);
    expect(Object.keys(CH01_CAGE_HEIGHTS).sort()).toEqual(cages.map((e) => e.id).sort());
  });

  it("the shipped frames draw their measured height, while the ordinary cage stays 34", () => {
    expect(CAGE_DISPLAY_H).toBe(34);
    expect(entDisplayH({ role: "cage", skin: "satchel" })).toBe(34);
    for (const e of cages) expect(entDisplayH(e), `${e.id} (${e.skin})`).toBe(CH01_CAGE_HEIGHTS[e.id]);
  });

  it("a cage is never drawn smaller than the child it could hold", () => {
    // Merle lives in the actual 54px pencilcase, not an ordinary object cage.
    const personCase = cages.find(e => e.params?.classmate === "merle")!;
    expect(personCase.id).toBe("p2-cage-merle");
    expect(entDisplayH(personCase)).toBeGreaterThanOrEqual(entDisplayH({ role: "classmate", skin: "merle" }));
  });

  it("the size table still answers for every role the chapter ships", () => {
    for (const e of everyEntity) expect(entDisplayH(e), `${e.id} (${e.role})`).toBeGreaterThan(0);
  });

  it("area is height × the sheet's own aspect, so a wide being outweighs a tall one", () => {
    const wide = entDisplayArea({ role: "cage", skin: "satchel" }, { w: 480, h: 240 });
    const tall = entDisplayArea({ role: "cage", skin: "satchel" }, { w: 240, h: 480 });
    expect(wide).toBeGreaterThan(tall);
    expect(wide / tall).toBeCloseTo(4, 5);
  });

  it("the guardian's height is still the one anim.ts owns", () => {
    expect(entDisplayH({ role: "guardian", skin: "tafel" })).toBe(GUARDIAN_DISPLAY_H);
  });
});

describe("D-48 · every cage says who is inside it", () => {
  // A cage holds a PERSON or a THING, never both, and the two are told apart by
  // which pointer the level declares: `classmate` for Merle, `captive` for the
  // three non-person finds. Merle needs no silhouette — she is a being of her own, and the
  // cage she is in is the only one whose occupant walks out.
  const objectCages = cages.filter((e) => typeof e.params?.classmate !== "string");

  it("the chapter has both kinds, so neither branch is untested", () => {
    expect(objectCages.map((e) => e.params?.captive)).toEqual(["soundsystem", "tablet", "picture"]);
    expect(cages.length - objectCages.length).toBe(1);
  });

  it("a cage holding a THING declares the machine key beside the German name", () => {
    for (const e of objectCages) {
      const de = e.params?.captiveDe;
      expect(typeof de, `${e.id} has no captiveDe`).toBe("string");
      expect(isCaptiveKey(e.params?.captive), `${e.id} names „${String(de)}" but declares captive=${String(e.params?.captive)}`).toBe(true);
    }
  });

  it("a cage holding a PERSON declares no captive key — she is not a silhouette", () => {
    for (const e of cages.filter((c) => typeof c.params?.classmate === "string")) {
      expect(e.params?.captive, `${e.id} holds ${String(e.params?.classmate)} and also declares a captive key`).toBeUndefined();
    }
  });

  it("no two cages in one chapter hold the same thing", () => {
    const keys = cages.map((e) => e.params?.captive).filter(isCaptiveKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("every declared captive has a stem, and every stem a key", () => {
    for (const k of CAPTIVE_KEYS) expect(captiveStem(k)).toBe(`captive_${k}`);
    // the prefix is load-bearing: `satchel_*` would be swept into every phase
    // holding a satchel cage by artScope's skin closure
    for (const k of CAPTIVE_KEYS) expect(captiveStem(k).startsWith("satchel")).toBe(false);
  });
});

describe("D-48 · the scene keeps no second copy of the table", () => {
  const src = fs.readFileSync(path.join(HERE, "PaintScene.ts"), "utf8");
  const body = src.slice(src.indexOf("private entTargetH"), src.indexOf("private entTargetH") + 400);

  it("entTargetH delegates instead of deciding", () => {
    expect(body).toContain("entDisplayH");
    expect(/return\s+\d+/.test(body), "entTargetH still returns a literal height").toBe(false);
  });

  it("the drained-height table lives in anim.ts, not in the scene", () => {
    expect(src.includes("const DRAINED_H"), "a second height table is back in PaintScene").toBe(false);
  });
});

// ── L0c · P7 · DIE TABELLEN-GESETZE, UEBER JEDES AUSGELIEFERTE KAPITEL ───────
// Eine GLOBALE Tabelle, je Kapitel gemessen: das ist die Klasse, die L0 zweimal
// an einem Nachmittag bezahlt hat. Deshalb steht hier ausdruecklich, worueber
// jedes Gesetz etwas sagt — ueber die TABELLE (laeuft ueber alle Kapitel), nicht
// ueber die Form eines einzelnen Kapitels (die bleibt oben bei ch01).
describe("L0c · P7 · die Groessen-Tabelle antwortet fuer JEDES Kapitel", () => {
  it("die Schleife hat jedes ausgelieferte Kapitel gelesen — gemessen an der GETEILTEN Aufloesung", () => {
    // Ein Zaehl-Gesetz, das seine eigene Schleife noch einmal ausfuehrt, kann
    // nicht rot werden: laesst die Schleife ein Kapitel aus, laesst die
    // Gegenprobe es genauso aus. Der zweite Leser muss deshalb ein FREMDER
    // sein — `paintChapters()` ist die Aufloesung, die auch die Tore fragen.
    expect(kapitel.map((c) => c.name).sort()).toEqual([...geteilteKapitel].sort());
    // …und die Datei-Liste daneben, damit auch eine kaputte GETEILTE Aufloesung
    // auffaellt statt beide Seiten gemeinsam blind zu machen
    expect(kapitel.map((c) => c.name).sort()).toEqual([...levelDateienAufDerPlatte].map((f) => f.slice(0, 4)).sort());
    expect(kapitel.length, "diese Suite kann nicht leer bestehen").toBeGreaterThan(1);
  });

  for (const c of kapitel) {
    const entwurf = c.level.draft === true ? " [Entwurf]" : "";

    it(`${c.name}${entwurf}: jede Rolle, die das Kapitel ausliefert, hat eine Groesse`, () => {
      expect(c.entities.length, `${c.name} hat gar keine Wesen — die Datei ist leer oder anders geformt`).toBeGreaterThan(0);
      for (const e of c.entities) expect(entDisplayH(e), `${c.name} · ${e.id} (${e.role})`).toBeGreaterThan(0);
    });

    it(`${c.name}${entwurf}: jeder Kaefig behält seine ausdrücklich registrierte Höhe`, () => {
      for (const e of c.cages) {
        // Only this chapter changed. Foreign chapter expectations stay at their
        // existing baseline instead of inferring the answer from new params.
        const expected = c.name === "ch01" ? CH01_CAGE_HEIGHTS[e.id] : CAGE_DISPLAY_H;
        expect(expected, `${c.name} · ${e.id} fehlt im Größenvertrag`).toBeDefined();
        expect(entDisplayH(e), `${c.name} · ${e.id} (${e.skin})`).toBe(expected);
      }
    });

    it(`${c.name}${entwurf}: ein Ding-Kaefig nennt seinen Maschinen-Schluessel, ein Personen-Kaefig nicht`, () => {
      for (const e of c.cages) {
        if (typeof e.params?.classmate === "string") {
          expect(e.params?.captive, `${c.name} · ${e.id} haelt ${String(e.params?.classmate)} UND nennt einen captive-Schluessel`).toBeUndefined();
        } else {
          expect(typeof e.params?.captiveDe, `${c.name} · ${e.id} hat kein captiveDe`).toBe("string");
          expect(isCaptiveKey(e.params?.captive), `${c.name} · ${e.id} nennt captive=${String(e.params?.captive)}`).toBe(true);
        }
      }
    });

    it(`${c.name}${entwurf}: keine zwei Kaefige halten dasselbe Ding`, () => {
      const keys = c.cages.map((e) => e.params?.captive).filter(isCaptiveKey);
      expect(new Set(keys).size, `${c.name}: ${keys.join(", ")}`).toBe(keys.length);
    });
  }
});
