// CI gate: FOURTEEN: LIVE (g4.st.fourteen-live) plays »Fassung A«, and nothing brings the July
// version back.
//
//   node scripts/check-g4-version-a.mjs
//   node scripts/check-g4-version-a.mjs --selftest   (proves the red light works)
//
// Koki's ruling (welle-043, 16.09.2026): the school votes on the end-of-year week — language
// week in Dublin, hiking week in Carinthia (Kärnten), project week in Vienna (Wien). The July
// version sent the class on a paid flight to Dublin / New York / Sydney, and it lived in 28
// scenes, 7 recap questions, the name register, two day stamps, three art prompts and four
// generator scripts (welle-050 measured it; welle-052 swept it). A single leftover line would
// have a chapter contradict the one before it in the live game, and a re-run of an old
// generator would print the Sydney poster again. So the rule is a check, not a memory:
// no »Sydney«, »New York«, flight or plane word in any surface that builds or shows this story.
//
// Declared exceptions (ALLOW) are the book's own content: MORE! 4 Unit 3 tells the Hudson
// emergency landing, and class 4B's project video retells it. Every exception must still be
// NEEDED — one that suppresses nothing goes STALE and turns this gate red.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUNDLE = "content/corpus/stories/g4.st.fourteen-live";

// Whole words only: »planetarium« and »Flugplan« are not flights.
export const BANNED = /\b(Sydney|New York|flights?|fl(?:y|ies|ying|ew|own)|planes?|airports?|passengers?|Flugzeug\w*|Flughafen|geflogen|fliegen|fliegt|Passagier\w*)\b/gi;

export const ALLOW = [
  { file: /story\.json$|g4-live-act1\.py$/, line: /Hudson/, why: "ch03.s002 — 4B's project video retells the book's Hudson landing (MORE! 4 U3)" },
  { file: /story\.json$/, line: /"word": "plane"|"de": "Flugzeug"/, why: "ch03.s002 gloss for that line" },
  { file: /g4-live-act1\.py$/, line: /\("plane", "Flugzeug"\), \("river", "Fluss"\)/, why: "the same gloss in the generator" },
];

export function surfaces(repo = REPO) {
  const files = readdirSync(join(repo, BUNDLE)).filter((f) => f.endsWith(".json")).map((f) => `${BUNDLE}/${f}`);
  files.push("docs/art/build-g4-prompts.mjs", "docs/art/g4-fourteen-live-prompts.html");
  for (const f of readdirSync(join(repo, "scripts/story"))) if (/^g4-live-.*\.py$/.test(f)) files.push(`scripts/story/${f}`);
  const out = files.map((f) => ({ file: f, text: readFileSync(join(repo, f), "utf8") }));
  // trip-copy.ts holds several stories' skins — only the FOURTEEN: LIVE pack is this story's surface
  const tc = readFileSync(join(repo, "packages/game-trip/src/trip-copy.ts"), "utf8");
  const a = tc.indexOf("const FOURTEEN_LIVE"), b = tc.indexOf("const PACKS");
  if (a < 0 || b < a) throw new Error("trip-copy.ts: FOURTEEN_LIVE pack not found — the gate cannot see its surface");
  out.push({ file: "packages/game-trip/src/trip-copy.ts#FOURTEEN_LIVE", text: tc.slice(a, b) });
  return out;
}

// Pure verdict over {file, text}[] — the selftest feeds it the real surfaces with one tamper.
export function verdict(sources, allow = ALLOW) {
  const hits = [];
  const used = new Set();
  for (const { file, text } of sources) {
    text.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(BANNED)) {
        const a = allow.findIndex((x) => x.file.test(file) && x.line.test(line));
        if (a >= 0) { used.add(a); continue; }
        hits.push(`${file}:${i + 1} »${m[0]}« ← ${line.trim().slice(0, 140)}`);
      }
    });
  }
  const stale = allow.map((x, i) => (used.has(i) ? null : `STALE exception (suppresses nothing): ${x.why}`)).filter(Boolean);
  return { hits, stale };
}

if (process.argv.includes("--selftest")) {
  const real = surfaces();
  const tamper = (file, fn) => real.map((s) => (s.file === file ? { ...s, text: fn(s.text) } : s));
  const faelle = [
    { name: "real state is green", src: real, expect: (v) => v.hits.length === 0 && v.stale.length === 0 },
    { name: "»Sydney« back in a scene line is red", src: tamper(`${BUNDLE}/story.json`, (t) => t.replace("All three got Carinthia.", "All three got Sydney.")), expect: (v) => v.hits.length === 1 && /Sydney/.test(v.hits[0]) },
    { name: "a plane in the FOURTEEN day stamps is red", src: tamper("packages/game-trip/src/trip-copy.ts#FOURTEEN_LIVE", (t) => t.replace("Only one week was ever for sale.", "Only one plane was ever for sale.")), expect: (v) => v.hits.length === 1 && /plane/.test(v.hits[0]) },
    { name: "»New York« back in a generator is red", src: tamper("scripts/story/g4-live-act2.py", (t) => t.replace("Vienna: no school package.", "New York: no school package.")), expect: (v) => v.hits.length === 1 && /New York/.test(v.hits[0]) },
    { name: "»planetarium« and »Flugplan« stay green (whole words)", src: [...real, { file: `${BUNDLE}/x.json`, text: "the planetarium · der Flugplan" }], expect: (v) => v.hits.length === 0 },
    { name: "the book line rewritten without a plane: its gloss exception goes STALE", src: tamper(`${BUNDLE}/story.json`, (t) => t.replaceAll('"word": "plane"', '"word": "boat"').replaceAll('"de": "Flugzeug"', '"de": "Boot"').replaceAll("the plane on", "the boat on").replaceAll("das Flugzeug auf", "das Boot auf")), expect: (v) => v.hits.length === 0 && v.stale.length === 1 && /gloss/.test(v.stale[0]) },
    { name: "…and an ALLOW entry matching nothing is red", src: real, allow: [...ALLOW, { file: /story\.json$/, line: /Alice Springs/, why: "never needed" }], expect: (v) => v.stale.length === 1 },
  ];
  let schlecht = 0;
  for (const f of faelle) {
    const v = verdict(f.src, f.allow);
    const ok = f.expect(v);
    if (!ok) { schlecht++; console.error(`  ✗ ${f.name}: hits=${JSON.stringify(v.hits)} stale=${JSON.stringify(v.stale)}`); }
    else console.log(`  ✓ ${f.name}`);
  }
  if (schlecht > 0) { console.error("check-g4-version-a --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log(`check-g4-version-a --selftest: OK — ${faelle.length} Fälle`);
  process.exit(0);
}

const src = surfaces();
const { hits, stale } = verdict(src);
for (const h of hits) console.error(`  ✗ ${h}`);
for (const s of stale) console.error(`  ✗ ${s}`);
if (hits.length + stale.length > 0) {
  console.error(`check-g4-version-a: ${hits.length} Treffer, ${stale.length} veraltete Ausnahme(n) — FOURTEEN: LIVE spielt Fassung A (Dublin · Kärnten · Wien)`);
  process.exit(1);
}
console.log(`check-g4-version-a: OK — ${src.length} Flächen, kein Sydney/New York/Flug; ${ALLOW.length} Buch-Ausnahmen alle gebraucht`);
