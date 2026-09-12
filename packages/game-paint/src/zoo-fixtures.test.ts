// CODEX DRAFT — NOT CANON
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { readZooSource } from "./test-fixtures/zoo/read-fixture.ts";

describe("Frozen W2-R2 motor inputs", () => {
  it("loads every pinned original source with its exact byte count and SHA-256", () => {
    const manifest = JSON.parse(fs.readFileSync(new URL("./test-fixtures/zoo/manifest.json", import.meta.url), "utf8")) as {
      sourceCommit: string;
      files: Array<{ source: string }>;
    };
    expect(manifest.sourceCommit).toBe("2b2871c83da0c642a117ab0555a6fd6da76c706e");
    expect(manifest.files).toHaveLength(8);
    expect(new Set(manifest.files.map((entry) => entry.source)).size).toBe(8);
    for (const entry of manifest.files) expect(readZooSource(entry.source).length).toBeGreaterThan(0);
  });
});
