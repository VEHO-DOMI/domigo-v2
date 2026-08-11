// CI gate: every SHIPPED paint level parses and passes the level laws.
// (The zod shape gate lives app-side in paint-content.ts; this test drives the
// same JSON through the pure semantics + laws so a broken level fails CI.)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { checkLevelLaws, type PaintLevel, parsePaintLevel } from "./level.ts";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const STORIES = path.join(REPO, "content", "corpus", "stories");

const shipped: Array<{ file: string; level: PaintLevel }> = [];
for (const story of fs.readdirSync(STORIES)) {
  const dir = path.join(STORIES, story, "paint");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".level.json"))) {
    shipped.push({ file: `${story}/paint/${f}`, level: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as PaintLevel });
  }
}

describe("shipped paint levels", () => {
  it("found the draft ch01 (the corpus scan works)", () => {
    expect(shipped.length).toBeGreaterThanOrEqual(1);
  });

  for (const { file, level } of shipped) {
// R5-W1 · E1: checkLevelLaws needs ~3 s on the shipped chapter — the
// trap-pocket law runs one reachability search per reachable cell (114 in p2
// alone), which is quadratic by design ("honesty beats cleverness", level.ts).
// Vitest's default 5 s timeout sat close enough to that to flip red or green
// with machine load: this suite was FLAKY, not broken. The timeout is raised
// deliberately rather than the law weakened; the quadratic law itself is filed
// as a follow-up, with the measurement, in the E1 report.
    it(`${file} parses and passes the laws`, () => {
      const parsed = parsePaintLevel(level);
      const failures = checkLevelLaws(parsed);
      expect(failures, JSON.stringify(failures, null, 1)).toEqual([]);
    }, 30_000);
  }
});
