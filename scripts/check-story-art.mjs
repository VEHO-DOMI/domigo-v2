// CI gate for the story-art manifests: the runtime contract and the prompt library
// must agree, in both directions.
//
//   node scripts/check-story-art.mjs
//
// Checks, per story that has a prompt library:
//   1. the library's own gates pass (build-g3-prompts.mjs --check)
//   2. art.json is not stale (build-g3-art-json.mjs --check)
//   3. every stem art.json names exists in the library  → no permanently blank slot
//   4. every stem the library defines is named by art.json, or is a `<char>_neutral`
//      fallback → no prompt for a picture the game can never ask for
//
// Deliberately NOT checked: whether the image files exist on disk. The whole point of
// this pipeline is that the manifest can name all 235 pictures while none of them have
// been drawn yet — each absent one falls back to the procedural drawing. (Contrast
// check-paint-art.mjs, which DOES gate on disk presence, because that art ships today.)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (script) => {
  try {
    execFileSync(process.execPath, [join(REPO, script), "--check"], { stdio: "pipe" });
    return null;
  } catch (e) {
    return `${script} failed:\n${(e.stdout ?? "") + (e.stderr ?? "")}`.trim();
  }
};

const fail = [];
for (const s of ["docs/art/build-g3-prompts.mjs", "docs/art/build-g3-art-json.mjs"]) {
  const err = run(s);
  if (err) fail.push(err);
}

const art = JSON.parse(readFileSync(
  join(REPO, "content/corpus/stories/g3.st.fourteen/art.json"), "utf8"));
const lib = JSON.parse(readFileSync(join(REPO, "docs/art/g3-art-files.json"), "utf8"));
const have = new Set(lib.stems.map((s) => s.stem));

const named = new Set([art.cover, art.endCard]);
for (const c of Object.values(art.chapters)) for (const v of Object.values(c)) named.add(v);
for (const m of [art.portraits, art.beats, art.clues]) for (const v of Object.values(m)) named.add(v);

for (const stem of named) {
  if (stem && !have.has(stem)) {
    fail.push(`art.json names '${stem}', which no prompt in the library produces — that slot `
      + `could never be filled.`);
  }
}
for (const s of lib.stems) {
  if (!named.has(s.stem) && !/_neutral$/.test(s.stem)) {
    fail.push(`the library defines '${s.stem}', which art.json never names — generating it `
      + `would produce an image the game cannot display.`);
  }
}

if (fail.length) {
  console.error(`✗ check-story-art: ${fail.length} problem(s)\n`);
  for (const m of fail) console.error("  - " + m + "\n");
  process.exit(1);
}
console.log(`✓ check-story-art: g3 manifest and prompt library agree `
  + `(${named.size} stems placed, ${lib.stems.length} defined)`);
