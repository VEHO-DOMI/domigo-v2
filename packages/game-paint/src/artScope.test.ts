// R5-W1 · E1 · THE SCOPE LAW. Per-phase art loading has one failure mode and
// it is silent: PaintScene.tex() answers a stem it never loaded with a
// procedural blob, so an under-scoped phase renders grey shapes while every
// structural gate stays green. These tests are the machine that cannot be
// fooled by that — they assert the properties the scope must have, per phase,
// against the REAL shipped chapter and the REAL art tree.

import { describe, expect, it } from "vitest";
import { PHASE_ART_MB } from "./perfBudget.ts";
import fs from "node:fs";
import path from "node:path";
import {
  ALWAYS_STEMS,
  allScopePhases,
  domArtStems,
  levelRequiredStems,
  phaseArtScope,
  phaseRequiredStems,
  type ScopeLevel,
} from "./artScope.ts";
import { compositionFor, compositionStems } from "./composition.ts";

const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");
const ART_ROOT = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint");

/** every painted stem on disk → its file, exactly as the loader sees it */
const fileOf = new Map<string, string>();
const walk = (dir: string): void => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".png")) fileOf.set(e.name.replace(/\.png$/, ""), p);
  }
};
walk(ART_ROOT);
const present = new Set(fileOf.keys());

const shipped: Array<{ file: string; level: ScopeLevel }> = [];
if (fs.existsSync(CONTENT)) {
  for (const story of fs.readdirSync(CONTENT)) {
    const paintDir = path.join(CONTENT, story, "paint");
    if (!fs.existsSync(paintDir)) continue;
    for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
      const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8")) as ScopeLevel & { draft?: boolean };
      if (level.draft === true) continue;
      shipped.push({ file: f, level });
    }
  }
}

const bytesOf = (stems: Iterable<string>): number => {
  let b = 0;
  for (const s of stems) {
    const f = fileOf.get(s);
    if (f !== undefined) b += fs.statSync(f).size;
  }
  return b;
};

const MB = 1048576;
/** R5-W3 · E5: the number itself now lives in perfBudget.ts, so the guard
 *  document, this test and the CI checker cannot drift apart. */
const PHASE_BUDGET_MB = PHASE_ART_MB;

describe("art scope", () => {
  it("finds the shipped chapter and its art", () => {
    expect(shipped.length).toBeGreaterThan(0);
    expect(present.size).toBeGreaterThan(100);
  });

  for (const { file, level } of shipped) {
    describe(file, () => {
      // (a) THE LOAD-BEARING ONE: everything the CI gate demands, the loader
      // must actually fetch. This is the same assertion check-paint-art.mjs
      // makes; it lives here too so `pnpm test` alone still enforces it.
      it("every required stem is inside its phase's load scope", () => {
        const holes: string[] = [];
        for (const ph of allScopePhases(level)) {
          const scope = phaseArtScope(level, ph.id, present);
          for (const [stem, where] of phaseRequiredStems(level, ph.id, file)) {
            if (!scope.has(stem)) holes.push(`${stem} (${where})`);
          }
        }
        expect(holes).toEqual([]);
      });

      // (b) the closure that makes run-time-built names safe: the renderer
      // composes `${skin}_${state}`, `_open0`, `_b`… and no manifest lists
      // them, so the scope must take every cell of a present skin.
      it("takes a being's WHOLE cell family, not just its listed cells", () => {
        const missed: string[] = [];
        for (const ph of allScopePhases(level)) {
          const scope = phaseArtScope(level, ph.id, present);
          for (const e of ph.entities) {
            for (const s of present) {
              if ((s === e.skin || s.startsWith(`${e.skin}_`)) && !scope.has(s)) missed.push(`${ph.id}:${s}`);
            }
          }
        }
        expect(missed).toEqual([]);
      });

      // (c) the branch that cost 17 MB of never-drawn plates: the scope must
      // follow the SCENE'S condition, not a guess about it.
      it("follows the renderer's own backdrop branch", () => {
        for (const ph of allScopePhases(level)) {
          const scope = phaseArtScope(level, ph.id, present);
          const composed = compositionFor(level.chapter, ph.id) !== null;
          const plates = Object.values(ph.plates ?? {}).filter((v): v is string => v !== undefined);
          const spec = compositionFor(level.chapter, ph.id);
          const drawn = new Set(spec ? compositionStems(spec) : []);
          for (const plate of plates) {
            // composed phase ⇒ buildBackdrop() returns before it can draw a
            // plate, so loading one would be pure waste; legacy phase ⇒ it is
            // the backdrop and must be there.
            //
            // R5-W2 · H1 · …unless the COMPOSITION names the same stem. The law
            // is „nothing is loaded that the renderer cannot reach", and being
            // listed under `plates` is only one of the two ways to be reached.
            // p4 declares `plates.mid = "band_p4_audience"` — the empty school
            // chairs the arena is about — and now draws it as its far row, so
            // it is in scope for the composition's sake, not the plate's. The
            // check therefore asks the renderer's real question, and still goes
            // red for a plate-only stem on a composed phase (the waste this
            // law exists to catch).
            expect(scope.has(plate)).toBe(!composed || drawn.has(plate));
          }
        }
      });

      it("always carries the hero rig", () => {
        for (const ph of allScopePhases(level)) {
          const scope = phaseArtScope(level, ph.id, present);
          for (const s of ALWAYS_STEMS) expect(scope.has(s)).toBe(true);
        }
      });

      // (d) the chapter plates are DOM <img> tags on cards, never textures.
      it("never loads the card-layer plates as textures", () => {
        const cardOnly = [level.goalPlate, level.scorePlate, level.doorPlate].filter(
          (v): v is string => v !== undefined,
        );
        for (const ph of allScopePhases(level)) {
          const scope = phaseArtScope(level, ph.id, present);
          for (const s of cardOnly) expect(scope.has(s)).toBe(false);
        }
        // …but they must still be reachable through the art map
        for (const s of cardOnly) expect(domArtStems(level).has(s)).toBe(true);
      });

      // (e) the budget, so "112 MB" can never quietly come back
      it(`keeps every phase under ${PHASE_BUDGET_MB} MB of art`, () => {
        const over: string[] = [];
        for (const ph of allScopePhases(level)) {
          const mb = bytesOf(phaseArtScope(level, ph.id, present)) / MB;
          if (mb > PHASE_BUDGET_MB) over.push(`${ph.id}=${mb.toFixed(1)}MB`);
        }
        expect(over).toEqual([]);
      });

      it("still requires something of every phase (the floor is not empty)", () => {
        expect(levelRequiredStems(level, file).size).toBeGreaterThan(0);
        for (const ph of allScopePhases(level)) {
          expect(phaseRequiredStems(level, ph.id, file).size).toBeGreaterThan(0);
        }
      });
    });
  }
});

// ── L0 · D6 · DIE AUFTAKT-PLATTEN ZOGEN AUS DEM CODE INS LEVEL ───────────────
//
// `AUFTAKT_STEMS` trug fünf ch01-Blätter (`auftakt_ch01_b/c/d`,
// `schulhaus_ch01_a/b`), weil `PaintGame` sie als JSX-Literale zeichnete. Jedes
// zweite Kapitel hätte damit das Schulhaus aus Kapitel 1 aufgeschlagen. Sie
// stehen jetzt in `ch01.level.json` unter `auftaktPlates`.
//
// Der Preis dieser Bewegung darf NULL sein: dieselbe beanspruchte Menge, sonst
// verschiebt sich die Decke der toten Kunst (`DEAD_ART_CEILING`) und eine
// Ratsche, die niemand angefasst hat, klickt. Der Literal-Schnappschuss unten
// ist am Stand VOR der Bahn gemessen (origin/main 3377649b, 75 Stems) und
// ausgeschrieben, nicht aus dem Code abgeleitet — ein Test, der seine Erwartung
// aus der geprüften Datei holt, beweist Selbstkonsistenz, nicht Richtigkeit.
const DOM_STEMS_CH01_VOR_L0: readonly string[] = [
  "auftakt_ch01_b",
  "auftakt_ch01_c",
  "auftakt_ch01_d",
  "auftakt_mark_cages",
  "auftakt_mark_letters",
  "auftakt_mark_tips",
  "body_crouch",
  "body_idle",
  "body_lean",
  "cloth_hairband_a",
  "cloth_hat_a",
  "cloth_school_tie_a",
  "cloth_shirt_a",
  "cloth_shoe_a",
  "cloth_skirt_a",
  "cloth_socks_a",
  "cloth_sunglasses_a",
  "cloth_sweater_a",
  "hair_still",
  "hair_wind",
  "hand_fist",
  "hand_grip",
  "hand_open",
  "head_blink",
  "head_celebrate",
  "head_determined",
  "head_hurt",
  "head_neutral",
  "hero2_apex",
  "hero2_cheer",
  "hero2_fall",
  "hero2_hit",
  "hero2_idle",
  "hero2_jump",
  "hero2_land",
  "hero2_run0",
  "hero2_run1",
  "hero2_run2",
  "hero2_run3",
  "hud_blot",
  "hud_book",
  "hud_brush",
  "hud_cage",
  "hud_door",
  "hud_inkwell",
  "hud_knot",
  "hud_palette",
  "hud_rosette",
  "hud_rule",
  "hud_slate",
  "hud_spark",
  "hud_uniform",
  "hud_wisp",
  "klassenfoto_a",
  "merkseite_page",
  "merkseite_seal",
  "merkseite_stub",
  "merle_a",
  "obj_chair",
  "obj_picture",
  "obj_soundsystem",
  "obj_tablet",
  "plate_ch01_door",
  "plate_ch01_goal",
  "plate_ch01_rule",
  "plate_ch01_score",
  "regelseite_open",
  "rotor_a",
  "rotor_b",
  "rotor_c",
  "satchel",
  "schulhaus_ch01_a",
  "schulhaus_ch01_b",
  "shoe_neutral",
  "shoe_tucked",
];

describe("L0 · D6 · domArtStems(ch01) ist dieselbe Menge wie vor der Level-Welle", () => {
  const ch01 = shipped.find((s) => s.file.startsWith("ch01"));

  it("findet das ausgelieferte Kapitel", () => {
    expect(ch01).toBeDefined();
  });

  it("beansprucht exakt die Stems von vorher — kein Blatt dazu, keines weg", () => {
    const now = [...domArtStems(ch01!.level)].sort();
    expect(now).toEqual([...DOM_STEMS_CH01_VOR_L0]);
  });

  it("und die fünf ausgezogenen Platten kommen wirklich aus dem LEVEL", () => {
    // die Gegenprobe zum Test darüber: ohne die Deklaration fehlten genau die
    // fünf. Fiele sie still weg (zod strippt unbekannte Schlüssel), bliebe der
    // Test darüber grün, solange irgendetwas anderes sie beansprucht — dieser
    // hier fällt.
    const ohne = { ...ch01!.level, auftaktPlates: undefined };
    const fehlend = [...domArtStems(ch01!.level)].filter((s) => !domArtStems(ohne).has(s)).sort();
    expect(fehlend).toEqual([
      "auftakt_ch01_b", "auftakt_ch01_c", "auftakt_ch01_d",
      "schulhaus_ch01_a", "schulhaus_ch01_b",
    ]);
  });
});
