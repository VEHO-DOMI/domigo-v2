// CODEX DRAFT — NOT CANON
// Test-only source reader. It is never imported by a runtime module.
import fs from "node:fs";
import { createHash } from "node:crypto";

interface FixtureSource {
  source: string;
  file: string;
  sha256: string;
  bytes: number;
}

const manifest = JSON.parse(fs.readFileSync(new URL("./manifest.json", import.meta.url), "utf8")) as {
  sourceCommit: string;
  files: FixtureSource[];
};

if (manifest.sourceCommit !== "2b2871c83da0c642a117ab0555a6fd6da76c706e") {
  throw new Error("Zoo fixture source commit changed without a reviewed refresh.");
}

export function readZooSource(sourcePath: string): string {
  const record = manifest.files.find((entry) => entry.source === sourcePath || entry.file === sourcePath);
  if (!record || record.file.includes("/") || record.file.includes("..")) {
    throw new Error(`Unknown zoo fixture source: ${sourcePath}`);
  }
  const bytes = fs.readFileSync(new URL(`./snapshot/${record.file}`, import.meta.url));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== record.bytes || hash !== record.sha256) {
    throw new Error(`Zoo fixture bytes changed: ${record.source}`);
  }
  return bytes.toString("utf8");
}

export function readZooJson(sourcePath: string) {
  return JSON.parse(readZooSource(sourcePath));
}
