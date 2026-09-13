import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { collectPaintArt, writePaintArtManifest } from "../scripts/paint-art-manifest.ts";
import { checkPaintFunctionTraces } from "../scripts/check-paint-function-traces.mjs";

const app = fileURLToPath(new URL("../", import.meta.url));
const root = path.join(app, "public/art/g1/paint");
const artifact = path.join(app, "lib/paint-art-manifest.json");

test("paint production URLs equal every real legacy directory/hash without runtime PNGs", () => {
  const dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  assert.ok(dirs.includes("hero") && dirs.includes("ch01") && dirs.includes("ch02"));
  const chapters = [...dirs, "ch99-missing"];
  // Independent legacy oracle: read the actual PNG bytes, never the generator.
  const expected = Object.fromEntries(chapters.map((chapter) => {
    const map: Record<string, string> = {};
    for (const dir of ["hero", chapter]) {
      const abs = path.join(root, dir);
      if (!fs.existsSync(abs)) continue;
      for (const file of fs.readdirSync(abs).filter((f) => f.endsWith(".png"))) {
        const hash = crypto.createHash("sha1").update(fs.readFileSync(path.join(abs, file))).digest("hex").slice(0, 8);
        map[file.slice(0, -4)] = `/art/g1/paint/${dir}/${file}?v=${hash}`;
      }
    }
    return [chapter, map];
  }));
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "paint-function-no-png-"));
  try {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `
      import { register } from "node:module";
      register(${JSON.stringify(new URL("./testing/server-only-shim.mjs", import.meta.url).href)});
      register(${JSON.stringify(new URL("./testing/ts-extension-shim.mjs", import.meta.url).href)});
      const { resolvePaintArt } = await import(${JSON.stringify(new URL("./paint-art.ts", import.meta.url).href)});
      console.log(JSON.stringify(Object.fromEntries(${JSON.stringify(chapters)}.map(ch => [ch, resolvePaintArt(ch)]))));
    `], { cwd: empty, env: { ...process.env, NODE_ENV: "production" }, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), expected);
  } finally {
    fs.rmSync(empty, { recursive: true, force: true });
  }
});

test("committed paint manifest is current, including the fingerprint of every PNG", () => {
  assert.deepEqual(JSON.parse(fs.readFileSync(artifact, "utf8")), collectPaintArt(root),
    "Regenerate with next build before committing changed paint assets");
});

test("manifest regeneration detects repaint, addition and deletion, and fails on a missing root", () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "paint-manifest-build-"));
  const paint = path.join(scratch, "public/art/g1/paint");
  const dest = path.join(scratch, "lib/paint-art-manifest.json");
  try {
    fs.mkdirSync(path.join(scratch, "lib"));
    assert.throws(() => writePaintArtManifest(scratch), /ENOENT/);
    fs.mkdirSync(path.join(paint, "hero"), { recursive: true });
    const file = path.join(paint, "hero/hero_stand.png");
    fs.writeFileSync(file, "original bytes");
    writePaintArtManifest(scratch);
    const original = JSON.parse(fs.readFileSync(dest, "utf8"));
    writePaintArtManifest(scratch);
    assert.deepEqual(JSON.parse(fs.readFileSync(dest, "utf8")), original);
    fs.writeFileSync(file, "repainted bytes");
    fs.writeFileSync(path.join(paint, "hero/new.png"), "new bytes");
    writePaintArtManifest(scratch);
    const repaint = JSON.parse(fs.readFileSync(dest, "utf8"));
    assert.notEqual(repaint.hero.hero_stand, original.hero.hero_stand);
    assert.ok(repaint.hero.new);
    fs.unlinkSync(file);
    writePaintArtManifest(scratch);
    assert.equal(JSON.parse(fs.readFileSync(dest, "utf8")).hero.hero_stand, undefined);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});

test("built trace guard rejects missing traces, raw paint and an oversized function", () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "paint-trace-guard-"));
  try {
    const routes = path.join(scratch, ".next/server/app");
    fs.mkdirSync(routes, { recursive: true });
    assert.throws(() => checkPaintFunctionTraces(scratch), /No built/);
    const data = path.join(scratch, "manifest.json");
    fs.writeFileSync(data, "{}");
    const trace = path.join(routes, "page.js.nft.json");
    const writeTrace = (file: string) => fs.writeFileSync(trace, JSON.stringify({ files: [path.relative(routes, file)] }));
    writeTrace(data);
    assert.deepEqual(checkPaintFunctionTraces(scratch), { traces: 1, largestBytes: 2, paintFiles: 0 });
    const art = path.join(scratch, "public/art/g1/paint/hero/a.png");
    fs.mkdirSync(path.dirname(art), { recursive: true });
    fs.writeFileSync(art, "png");
    writeTrace(art);
    assert.throws(() => checkPaintFunctionTraces(scratch), /Paint asset in server function/);
    writeTrace(data);
    fs.truncateSync(data, 250 * 1024 * 1024 + 1);
    assert.throws(() => checkPaintFunctionTraces(scratch), /exceeds 250 MiB/);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});
