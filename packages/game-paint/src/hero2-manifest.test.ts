// L0d · R263 · DER DRIFT-WAECHTER ZWISCHEN DEN ZWEI GLEICHNAMIGEN LISTEN.
//
// `HERO2_STEMS` gibt es zweimal, und beide Male bedeutet der Name etwas anderes:
//
//   rigSpec.HERO2_STEMS      = was GEZEICHNET wird (heroFullCell gibt genau
//                              diese Namen zurueck)
//   artManifest.HERO2_STEMS  = was GELADEN und von CI GEFORDERT wird
//                              (artScope.ALWAYS_STEMS + phaseRequiredStems)
//
// Sie standen zwei Zellen auseinander: `hero2_crouch` (R5-F4, die Hocke vor dem
// Absprung) und `hero2_jump2` (die zweite Aufstiegsstufe) wurden gezeichnet und
// von der Manifest-Liste nicht gefuehrt. Folge: kein Tor forderte sie, und jedes
// Audit ueber diese Liste war ueber sie blind. Eine gezeichnete Zelle, die
// niemand laedt, faellt zur Laufzeit still auf den alten Teile-Baukasten zurueck
// — genau die Klasse, die diese Bahn schliesst.
//
// Dazu die zweite Haelfte des Gesetzes: die Zellen der Figur gehoeren in den
// GETEILTEN Helden-Ordner. Lagen sie in einem Kapitel-Ordner, bekam sie nur
// dieses eine Kapitel (paint-art.ts#artDirsFor gibt jedem Kapitel genau
// ["hero", chapter]) — der Befund, mit dem L0d anfing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { HERO2_STEMS as MANIFEST_STEMS } from "./artManifest.ts";
import { HERO2_STEMS as GEZEICHNETE_STEMS, heroFullCell } from "./rigSpec.ts";

const HIER = path.dirname(fileURLToPath(import.meta.url));
const KUNST = path.resolve(HIER, "../../../apps/web/public/art/g1/paint");
const HELDEN_ORDNER = path.join(KUNST, "hero");

/** Jeder Ordner unter der Kunst-Wurzel, der KEIN Helden-Ordner ist. */
const kapitelOrdner = (): string[] =>
  fs.readdirSync(KUNST, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "hero")
    .map((e) => e.name);

describe("L0d · die zwei HERO2_STEMS-Listen und der Ort ihrer Blaetter", () => {
  it("gezeichnet und geladen sind DIESELBE Menge", () => {
    expect([...MANIFEST_STEMS].sort()).toEqual([...GEZEICHNETE_STEMS].sort());
  });

  it("keine Liste doppelt einen Stem", () => {
    expect(new Set(MANIFEST_STEMS).size).toBe(MANIFEST_STEMS.length);
    expect(new Set(GEZEICHNETE_STEMS).size).toBe(GEZEICHNETE_STEMS.length);
  });

  it("jede gefuehrte Zelle liegt im GETEILTEN Helden-Ordner, nicht in einem Kapitel", () => {
    for (const stem of MANIFEST_STEMS) {
      expect(fs.existsSync(path.join(HELDEN_ORDNER, `${stem}.png`)), `${stem}.png fehlt in art/g1/paint/hero/`).toBe(true);
      for (const ordner of kapitelOrdner()) {
        expect(
          fs.existsSync(path.join(KUNST, ordner, `${stem}.png`)),
          `${stem}.png liegt in art/g1/paint/${ordner}/ — dort sieht es nur ${ordner}`,
        ).toBe(false);
      }
    }
  });

  // Der erklaerte tote Ersatz-Stem. Er ist der Grund, warum dieses Gesetz
  // NICHT lauten kann: alles, was auf der Platte liegt, muss in der Liste
  // stehen. Ein bewusst ungenutztes Blatt ist erlaubt — verschwiegen zu werden
  // ist es nicht.
  it("hero2_det liegt, wird von keinem Pfad gezeichnet und steht in keiner Liste", () => {
    expect(fs.existsSync(path.join(HELDEN_ORDNER, "hero2_det.png"))).toBe(true);
    expect(MANIFEST_STEMS as readonly string[]).not.toContain("hero2_det");
    expect(GEZEICHNETE_STEMS as readonly string[]).not.toContain("hero2_det");
    const posen = ["stand", "walk", "run", "jump", "fall", "hit", "hover", "charge", "hang"] as const;
    for (const pose of posen) {
      for (const vy of [-1280, -80, 0, 80, 1280]) {
        for (const walkTime of [0, 9, 18, 27, 36]) {
          for (const landedAgo of [0, 3, 99]) {
            for (const jumpedAgo of [0, 1, 99]) {
              for (const cheering of [false, true]) {
                expect(heroFullCell(pose, walkTime, vy, landedAgo, cheering, jumpedAgo)).not.toBe("hero2_det");
              }
            }
          }
        }
      }
    }
  });
});
