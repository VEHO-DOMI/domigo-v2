// R5-W1 · E1 · THE SCOPE LAW. Per-phase art loading has one failure mode and
// it is silent: PaintScene.tex() answers a stem it never loaded with a
// procedural blob, so an under-scoped phase renders grey shapes while every
// structural gate stays green. These tests are the machine that cannot be
// fooled by that — they assert the properties the scope must have, per phase,
// against the REAL shipped chapter and the REAL art tree.

import { describe, expect, it } from "vitest";
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
import { compositionFor } from "./composition.ts";

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
/** No single phase may queue more than this before its first frame. Measured
 *  at landing: the heaviest phase (p2) is 26.6 MB, against 111.1 MB before. */
const PHASE_BUDGET_MB = 35;

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
          for (const plate of plates) {
            // composed phase ⇒ buildBackdrop() returns before it can draw a
            // plate, so loading one would be pure waste; legacy phase ⇒ it is
            // the backdrop and must be there.
            expect(scope.has(plate)).toBe(!composed);
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
