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
    // R5-W4b · W3 · D-197 (family D-116). This test carried its own `, 30_000`, and a
    // per-test timeout OVERRIDES `testTimeout` from vitest.config.ts — so the 120 s
    // that config chose from measurement, naming this very test, never applied here.
    // pickups.test.ts:260 removed the same override for the same reason; this file was
    // the one left. It is not a latent risk: on an UNTOUCHED tree this session it went
    // RED — "Test timed out in 30000ms" — because `checkLevelLaws` runs one
    // reachability search per reachable cell (quadratic by design, level.ts) and vitest
    // runs 30 files in parallel workers. Measured twice after removing the override:
    // 21.5 s / 21.9 s of test time, comfortably inside the config's 120 s and just as
    // comfortably outside 30 s. The number now lives in exactly one place:
    // vitest.config.ts, whose own comment carries the measurement it was chosen from.
    it(`${file} parses and passes the laws`, () => {
      const parsed = parsePaintLevel(level);
      const failures = checkLevelLaws(parsed);
      expect(failures, JSON.stringify(failures, null, 1)).toEqual([]);
    });
  }
});
