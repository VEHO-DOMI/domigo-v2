#!/usr/bin/env node
// R5-W3 · E5 · THE BUILD MAY NOT PHONE OUT FOR ITS TYPE (debt D-79).
//
// `next/font/google` downloads the .woff2 files from fonts.gstatic.com WHILE
// BUILDING. That made a green build depend on somebody else's server: PR #273
// ran the same commit three times — twice red, once green — and the same
// failure took a build down in the session that wrote this file, with a wall of
// module-not-found lines out of an `inter_*.module.css`. A gate that can go red
// because a third party blinked is not a gate; it is a coin toss with a log.
//
// So the three families are committed under apps/web/app/fonts and loaded with
// `next/font/local`, and this check keeps the door shut both ways:
//   1. no source file may import `next/font/google` again
//   2. every font file `next/font/local` names must actually be on disk
//      (a missing file is a silent fallback to a system face — the kind of
//      regression nobody sees in review and everybody sees on the page)
//
// Run: node scripts/check-fonts.mjs            (exit 1 on any failure)
//      node scripts/check-fonts.mjs --selftest (proves the red light works)

import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const ROOTS = ["apps/web/app", "apps/web/components", "apps/web/lib", "packages"];
const selftest = process.argv.includes("--selftest");

let failures = 0;
const reported = [];
const fail = (msg) => {
  failures++;
  reported.push(msg);
  console.error(`✗ ${msg}`);
};

/** every .ts/.tsx file under the roots that ship to the browser */
const sources = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === "dist") continue;
      walk(p);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(e.name)) {
      sources.push(p);
    }
  }
};
for (const r of ROOTS) walk(path.join(R, r));

// SELFTEST: pretend a file reached for the network again, and prove we notice.
const SELFTEST_FILE = "apps/web/app/__selftest-layout.tsx";
const readSource = (file) => fs.readFileSync(file, "utf8");
const checked = selftest
  ? [...sources.map((f) => [f, readSource(f)]), [SELFTEST_FILE, `import { Inter } from "next/font/google";`]]
  : sources.map((f) => [f, readSource(f)]);

for (const [file, text] of checked) {
  // the checker names the import itself, so exclude this file and any comment
  // that merely TALKS about the rule (the licence note does, on purpose)
  if (path.resolve(R, file) === path.resolve(R, "scripts/check-fonts.mjs")) continue;
  for (const m of text.matchAll(/^[^\n]*from\s+["']next\/font\/google["']/gm)) {
    fail(
      `${path.relative(R, file)} imports next/font/google — that downloads .woff2 files at BUILD time. ` +
        `Commit the face under apps/web/app/fonts and load it with next/font/local (see that folder's LICENSE.md).\n    ${m[0].trim()}`,
    );
  }
}

// 2 · every locally declared font file must exist
const localSrc = /src:\s*"(\.[^"]+\.(?:woff2?|ttf|otf))"/g;
let declared = 0;
for (const file of sources) {
  const text = readSource(file);
  if (!text.includes("next/font/local")) continue;
  for (const m of text.matchAll(localSrc)) {
    declared++;
    const abs = path.resolve(path.dirname(file), m[1]);
    if (!fs.existsSync(abs)) {
      fail(`${path.relative(R, file)} declares ${m[1]}, which is not on disk — the page would silently fall back to a system face`);
    }
  }
}

if (declared === 0 && !selftest) {
  // a vacuity guard: if nobody declares a local font any more, this check has
  // quietly stopped checking anything and should be re-read, not trusted
  fail("no next/font/local declaration found anywhere — this check has nothing left to police; re-read it before deleting it");
}

// The selftest fed in a file that imports next/font/google on purpose. It
// passes when — and only when — that file was the one named. (House
// convention: a selftest EXITS 0 once it has seen its own red light.)
if (selftest) {
  const sawIt = reported.some((m) => m.includes("__selftest-layout.tsx"));
  if (sawIt) {
    console.log(`check-fonts SELFTEST: OK — the red light works (${failures} failure(s) for an import added on purpose)`);
    process.exit(0);
  }
  console.error("✗ SELFTEST FAILED: a next/font/google import was fed in on purpose and this check stayed green");
  process.exit(1);
}

if (failures > 0) {
  console.error(`check-fonts: ${failures} failure(s)`);
  process.exit(1);
}
console.log(`check-fonts: OK — ${sources.length} source files clean of next/font/google, ${declared} local font file(s) present`);
