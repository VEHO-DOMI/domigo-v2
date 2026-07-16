/**
 * The content-authored Keen levels pass the level laws (bible 27 §6.6:
 * every chapter's level file is law-checked in CI — this is that check).
 * New chapters: add their ids to CHAPTERS and the laws run automatically.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkLevelLaws, parseArcadeLevel, type ArcadeHeader } from "./arcade.ts";

const KEEN_DIR = join(__dirname, "../../../content/corpus/stories/g1.st.lost-pages/keen");
const CHAPTERS = ["ch01"];

describe("content keen levels", () => {
  for (const ch of CHAPTERS) {
    it(`${ch}: parses, laws green, boss-door exit, collectibles present`, () => {
      const file = JSON.parse(readFileSync(join(KEEN_DIR, `${ch}.level.json`), "utf8")) as { header: ArcadeHeader; rows: string[] };
      const level = parseArcadeLevel(file.header, file.rows);
      expect(level.bossDoor).not.toBeNull();
      expect(level.gluehwoerter.length).toBeGreaterThanOrEqual(2);
      expect(level.gluehwoerter.length).toBeLessThanOrEqual(4);
      expect(level.header.seals.length).toBeGreaterThanOrEqual(2);
      const report = checkLevelLaws(level);
      expect(report.errors).toEqual([]);
    });
    it(`${ch}: the boss script parses and is playable`, () => {
      const boss = JSON.parse(readFileSync(join(KEEN_DIR, `${ch}.boss.json`), "utf8")) as { knots: number; pattern: number[]; telegraphMs: Record<string, number>; windowSeconds: Record<string, number> };
      expect(boss.knots).toBeGreaterThanOrEqual(3);
      expect(boss.pattern.every((l) => l >= 0 && l < 3)).toBe(true);
      for (const t of ["E", "M", "S"]) {
        expect(boss.telegraphMs[t]!).toBeGreaterThanOrEqual(500); // always readable
        expect(boss.windowSeconds[t]!).toBeGreaterThanOrEqual(10); // production time
      }
    });
  }
});
