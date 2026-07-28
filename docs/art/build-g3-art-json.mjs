// Regenerates content/corpus/stories/g3.st.fourteen/art.json from the prompt library.
//
//   node docs/art/build-g3-art-json.mjs           → writes art.json
//   node docs/art/build-g3-art-json.mjs --check   → compares, exits 1 if stale
//
// art.json is the RUNTIME contract: it maps chapters, scenes and task slots to image
// STEMS. `apps/web/lib/story-art.ts` resolves a stem only if a file with that name is
// actually on disk, so the manifest can name all 236 pictures long before any of them
// exist — every absent one falls back to the procedural drawing.
//
// The portrait placements are DERIVED from the beats rather than written twice: if a
// scene's picture shows Ben with his vest zipped shut, the little bust beside his line
// is the zipped-shut Ben. Deriving it means the two can never drift apart.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BEATS, BACKDROPS, PANELS, PORTRAITS } from "./g3-fourteen-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const OUT = join(REPO, "content/corpus/stories/g3.st.fourteen/art.json");
const STORY_ID = "g3.st.fourteen";
const CHECK_ONLY = process.argv.includes("--check");

const story = JSON.parse(readFileSync(
  join(REPO, "content/corpus/stories", STORY_ID, "story.json"), "utf8"));

const pad = (n) => String(n).padStart(2, "0");
const known = new Set(PORTRAITS.map((p) => p.stem));

/** The state a beat applies to a given character, if any. */
function stateFor(beatOpts, char) {
  for (const m of (beatOpts ?? "").matchAll(/state:(\w+)=(\w+)/g)) {
    if (m[1] === char) return m[2];
  }
  return null;
}

const chapters = {};
const portraits = {};
const beats = {};
const clues = {};

for (const [n] of BACKDROPS) {
  chapters[`${STORY_ID}.ch${n}`] = { card: `card_ch${n}`, backdrop: `bg_ch${n}` };
}
for (const p of PANELS) for (const k of p.keys) clues[`${STORY_ID}.${k}`] = p.stem;

let overrides = 0;
for (const ch of story.chapters) {
  const n = pad(Number(ch.id.match(/ch(\d\d)$/)[1]));
  for (const s of ch.scenes) {
    const key = `ch${n}.${s.id.split(".").pop()}`;
    if (BEATS[key]) beats[s.id] = `beat_${key.replace(".", "_")}`;
    if (s.speaker === "narrator") continue;
    const st = stateFor(BEATS[key]?.[3], s.speaker);
    const stem = st ? `${s.speaker}_${st}` : null;
    if (stem && known.has(stem)) {
      portraits[s.id] = stem;
      overrides++;
    }
    // No entry → the resolver falls back to `<speaker>_neutral` on its own.
  }
}

const art = {
  schema: "story-art@1",
  storyId: STORY_ID,
  base: "/art/g3",
  cover: "cover_title",
  endCard: "end_episode",
  chapters,
  portraits,
  beats,
  clues,
};
const text = JSON.stringify(art, null, 2) + "\n";

if (CHECK_ONLY) {
  const have = readFileSync(OUT, "utf8");
  if (have !== text) {
    console.error("✗ art.json is stale — run `node docs/art/build-g3-art-json.mjs`");
    process.exit(1);
  }
  console.log("✓ art.json is current");
  process.exit(0);
}

writeFileSync(OUT, text);
console.log(`✓ wrote art.json — ${Object.keys(chapters).length} chapters (card + backdrop) · `
  + `${Object.keys(beats).length} scene beats · ${overrides} portrait overrides `
  + `(the rest fall back to <speaker>_neutral) · ${Object.keys(clues).length} task slots`);
