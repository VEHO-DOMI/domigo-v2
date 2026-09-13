// CODEX DRAFT — NOT CANON. Present bytes count in every chapter, including drafts.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { allScopePhases, phaseArtScope, type ScopeLevel } from "./artScope.ts";
import { PHASE_ART_MB } from "./perfBudget.ts";

const ROOT = path.resolve(__dirname, "../../..");
const CONTENT = path.join(ROOT, "content/corpus/stories");
const ART = path.join(ROOT, "apps/web/public/art/g1/paint");
const levels: Array<{ file: string; level: ScopeLevel & { draft?: boolean } }> = [];
for (const story of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, story, "paint");
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".level.json"))) {
    levels.push({ file: `${story}/${file}`, level: JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as ScopeLevel & { draft?: boolean } });
  }
}

/** Exact resolvePaintArt ordering: shared hero first, own chapter overrides only its own names. */
const chapterFiles = (chapter: string): Map<string, { file: string; bytes: number }> => {
  const files = new Map<string, { file: string; bytes: number }>();
  for (const dir of ["hero", chapter]) {
    const abs = path.join(ART, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs).filter(n => n.endsWith(".png"))) {
      const file = path.join(abs, name);
      files.set(name.slice(0, -4), { file, bytes: fs.statSync(file).size });
    }
  }
  return files;
};
const phaseBytes = (level: ScopeLevel, phaseId: string, files: ReturnType<typeof chapterFiles>): number =>
  [...phaseArtScope(level, phaseId, files.keys())].reduce((sum, stem) => sum + (files.get(stem)?.bytes ?? 0), 0);
const rows = levels.flatMap(({ file, level }) => {
  const files = chapterFiles(level.chapter);
  return allScopePhases(level).map(phase => ({ file, level, phaseId: phase.id, files, bytes: phaseBytes(level, phase.id, files) }));
});

describe("actual phase PNG budget, shipped and draft chapters", () => {
  it("discovers both shipped and draft chapter data", () => {
    expect(levels.some(r => r.level.draft !== true)).toBe(true);
    expect(levels.some(r => r.level.draft === true)).toBe(true);
  });
  for (const row of rows) it(`${row.file} ${row.phaseId}${row.level.draft ? " draft" : " shipped"}: present loaded PNGs stay within PHASE_ART_MB`, () => {
    expect(row.bytes / 1048576, `${row.level.chapter}/${row.phaseId}: ${(row.bytes / 1048576).toFixed(3)} MiB`).toBeLessThanOrEqual(PHASE_ART_MB);
  });
  it("missing draft images add no fictitious bytes or requirement", () => {
    const row = rows.find(r => r.level.draft === true)!;
    expect(phaseBytes(row.level, row.phaseId, new Map())).toBe(0);
  });
  it("an oversized actually loaded file is detected without changing the budget", () => {
    const row = rows.find(r => r.bytes > 0 && r.bytes / 1048576 <= PHASE_ART_MB)!;
    const stem = [...phaseArtScope(row.level, row.phaseId, row.files.keys())].find(s => row.files.has(s))!;
    const files = new Map(row.files);
    files.set(stem, { ...files.get(stem)!, bytes: (PHASE_ART_MB + 1) * 1048576 });
    expect(phaseBytes(row.level, row.phaseId, files) / 1048576).toBeGreaterThan(PHASE_ART_MB);
  });
});
