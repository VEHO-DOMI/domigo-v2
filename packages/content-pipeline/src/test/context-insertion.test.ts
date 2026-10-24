import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { REPO_ROOT } from "../paths.ts";

const guard = path.join(REPO_ROOT, "scripts/check-context-insertion.mjs");

test("context insertion: current effective corpus and structural controls pass", () => {
  const run = spawnSync(process.execPath, [guard, "--selftest"], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /added-marker tamper rejected/);
  assert.match(run.stdout, /"findings": \[\]/);
});

test("context insertion: a full or partial duplicate fails; overlay and drop follow loader precedence", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "domigo-insertion-"));
  try {
    const unit = path.join(root, "content/corpus/units/g1-u01");
    const overlays = path.join(root, "content/overlays");
    fs.mkdirSync(unit, { recursive: true });
    fs.mkdirSync(overlays, { recursive: true });
    const corpus = path.join(unit, "vocab.json");
    const fixes = path.join(overlays, "item-fixes.json");
    const write = (file: string, value: unknown) => fs.writeFileSync(file, JSON.stringify(value));
    const scan = () => {
      const before = [fs.readFileSync(corpus), fs.readFileSync(fixes)];
      const run = spawnSync(process.execPath, ["--input-type=module", "--eval",
        `import {scanContextPools} from ${JSON.stringify(pathToFileURL(guard).href)};
         const result = scanContextPools(${JSON.stringify(root)});
         console.log(JSON.stringify(result));
         process.exitCode = result.findings.length ? 1 : 0;`,
      ], { encoding: "utf8" });
      assert.equal(run.signal, null, run.stderr);
      assert.deepEqual(fs.readFileSync(corpus), before[0], "guard must not write source");
      assert.deepEqual(fs.readFileSync(fixes), before[1], "guard must not write overlays");
      return { status: run.status, data: JSON.parse(run.stdout) };
    };
    write(corpus, { items: [{ id: "g1u01.w.read", s: "I want to ___.", sAnswers: [
      { text: "to read", tier: "full" }, { text: "to study", tier: "partial" },
    ] }] });
    write(fixes, {});
    const broken = scan();
    assert.equal(broken.status, 1, "deliberate duplicate must turn the guard red");
    assert.equal(broken.data.contexts, 1);
    assert.equal(broken.data.answers, 2);
    assert.deepEqual(broken.data.findings.map((f: { tier: string }) => f.tier), ["full", "partial"]);
    write(fixes, { "g1-u01": { patch: { "g1u01.w.read": {
      sAnswers: [{ text: "read", tier: "full" }, { text: "study", tier: "partial" }],
    } } } });
    const repaired = scan();
    assert.equal(repaired.status, 0);
    assert.equal(repaired.data.answers, 2);
    assert.deepEqual(repaired.data.findings, []);
    write(fixes, { "g1-u01": { drop: ["g1u01.w.read"] } });
    const dropped = scan();
    assert.equal(dropped.status, 0);
    assert.equal(dropped.data.contexts, 0);
    assert.equal(dropped.data.answers, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
