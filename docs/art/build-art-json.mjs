// Generates content/corpus/stories/g2.st.wrong-name/art.json — the decoupled,
// ungated art-placement manifest (story-art@1) for the G2 detective runtime.
// Encodes the 5B/5C/5G placement map (stems only; the runtime resolves stem →
// actual file via the synced public/art/g2 dir). Validates every stem against the
// library manifest (docs/art/g2-art-files.json) and every scene/slot against the
// full 15-chapter story (read from git ref feat/g2-ch11-15; falls back to the
// working tree with a warning).
//
//   node docs/art/build-art-json.mjs

import { writeFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const STORY_ID = "g2.st.wrong-name";
const pad2 = (n) => String(n).padStart(2, "0");
const pad3 = (n) => String(n).padStart(3, "0");
const chId = (n) => `${STORY_ID}.ch${pad2(n)}`;
const scId = (n, s) => `${chId(n)}.s${pad3(s)}`;

// ── Placement (from plan Part 5: 5B reuse · 5C per-chapter · 5G new) ──────────
const BACKDROP = { 1:"set_hall_empty",2:"set_back_corridor",3:"set_costume_hall",4:"set_hall_full",5:"set_townmap",6:"set_back_corridor",7:"set_club_room",8:"set_hall_night",9:"set_hall_full",10:"set_lab",11:"set_club_room",12:"set_club_room",13:"set_club_room",14:"set_hall_full",15:"set_assembly" };

// "chapter.scene" → bust stem (portrait OVERRIDES; default = `${speaker}_neutral`)
const PORTRAIT = {
  "1.1":"mina_surprised","1.2":"theo_worried","1.3":"mina_thinking","1.4":"theo_surprised","1.5":"mina_thinking","1.6":"theo_worried","1.9":"theo_excited","1.10":"theo_excited",
  "2.2":"max_deny","2.3":"mina_thinking","2.4":"max_sulky","2.5":"mina_determined","2.6":"theo_aha","2.7":"mina_thinking","2.8":"theo_worried",
  "3.4":"mina_talking","3.5":"bell_explaining","3.6":"mina_determined","3.7":"theo_worried",
  "4.3":"theo_surprised","4.4":"mina_thinking","4.5":"theo_aha","4.6":"mina_determined","4.7":"theo_worried",
  "5.1":"max_brash","5.3":"mina_thinking","5.4":"mina_determined","5.6":"mina_thinking",
  "6.1":"mina_thinking","6.2":"theo_talking","6.3":"bell_explaining","6.6":"mina_determined",
  "7.1":"mina_talking","7.3":"mina_thinking",
  "8.1":"theo_talking","8.2":"mina_thinking","8.5":"theo_surprised","8.6":"mina_thinking","8.7":"theo_aha",
  "9.1":"mina_surprised","9.2":"theo_surprised","9.3":"mina_thinking","9.6":"theo_surprised","9.7":"mina_thinking",
  "10.2":"mina_happy","10.6":"mina_determined",
  "11.1":"mina_thinking","11.3":"mina_thinking","11.4":"theo_surprised","11.7":"mina_determined",
  "12.1":"ben_guilty","12.2":"ben_talking","12.4":"ben_anxious","12.7":"ben_relieved",
  "13.1":"mina_determined","13.3":"mina_thinking","13.4":"dani_sorry",
  "14.4":"mina_happy","14.6":"mina_happy",
  "15.1":"mina_happy","15.2":"lena_joyful","15.3":"theo_excited","15.4":"ben_relieved","15.5":"dani_sorry","15.6":"mina_happy","15.7":"theo_excited",
};

// "chapter.scene" → beat illustration stem
const BEAT = {
  "1.1":"beat_ch01_empty","1.3":"beat_ch01_card","1.6":"beat_ch01_lena_sad",
  "2.1":"beat_ch02_question","2.2":"beat_ch02_post",
  "3.1":"beat_ch03_crowd","3.5":"beat_ch03_open_door",
  "4.1":"beat_flashback_lena_wins","4.2":"beat_ch04_chart","4.3":"beat_ch04_crack",
  "5.1":"beat_ch05_max_town","5.2":"beat_ch05_map",
  "6.3":"beat_ch06_bell_keys","6.6":"beat_ch06_sort",
  "7.1":"beat_ch07_theorise","7.3":"beat_ch07_lena_secret",
  "8.2":"beat_ch08_timeline","8.5":"beat_ch08_night_figure","8.6":"beat_ch08_key_close",
  "9.1":"beat_ch09_two_medals","9.5":"beat_ch09_new_card",
  "10.2":"beat_ch10_lena_invents",
  "11.3":"beat_ch11_match","11.4":"beat_ch11_family",
  "12.1":"beat_ch12_confession","12.7":"beat_ch12_ben_lena",
  "13.1":"beat_ch13_confront","13.3":"beat_flashback_dani_swaps",
  "14.1":"beat_flashback_wrong_medal","14.3":"beat_ch14_correct",
  "15.1":"beat_ch15_medal","15.4":"beat_ch15_ben_told","15.5":"beat_ch15_apology","15.7":"beat_ch15_caseclosed",
};

// "chapter.slot" → prop stem (evidence-board thumbnail)
const CLUE = {
  "1.what-happened":"prop_card_blank","1.first-statement":"prop_casefile",
  "2.interrogate":"prop_notebook","2.catch-the-lie":"prop_magnifier",
  "3.the-rule":"prop_key","3.sort-suspects":"prop_mask",
  "4.compare":"prop_chart","4.the-record-lies":"prop_card_old",
  "5.trace-route":"prop_map","5.broken-alibi":"prop_map",
  "6.who-must":"prop_key","6.access-groups":"prop_corkboard",
  "7.what-is-true":"prop_magnifier","7.their-plan":"prop_notebook",
  "8.timeline":"prop_clock","8.order-the-night":"prop_corkboard",
  "9.which-one":"prop_medal","9.any-name":"prop_card_new",
  "10.her-passion":"prop_flyingmachine","10.moral-line":"prop_corkboard",
  "11.whose-card":"prop_card_new","11.his-or-hers":"prop_medal",
  "12.what-has-happened":"prop_medal","12.verify-confession":"prop_card_old",
  "13.the-method":"prop_chart","13.the-plan":"prop_casefile",
  "14.history-sealed":"prop_chart","14.ever-never":"prop_casefile",
  "15.we-agree":"prop_medal","15.all-agree":"prop_casefile",
};

// ── Build the manifest (stems) ───────────────────────────────────────────────
const art = { schema: "story-art@1", storyId: STORY_ID, base: "/art/g2", cover: "cover_title", endCard: "end_caseclosed", chapters: {}, portraits: {}, beats: {}, clues: {} };
for (let n = 1; n <= 15; n++) art.chapters[chId(n)] = { card: `card_ch${pad2(n)}`, backdrop: BACKDROP[n] };
for (const [k, v] of Object.entries(PORTRAIT)) { const [n, s] = k.split("."); art.portraits[scId(+n, +s)] = v; }
for (const [k, v] of Object.entries(BEAT)) { const [n, s] = k.split("."); art.beats[scId(+n, +s)] = v; }
for (const [k, v] of Object.entries(CLUE)) { const [n, slot] = [k.slice(0, k.indexOf(".")), k.slice(k.indexOf(".") + 1)]; art.clues[`${chId(+n)}.${slot}`] = v; }

// ── Validate: every stem ∈ library ───────────────────────────────────────────
const lib = JSON.parse(readFileSync(join(HERE, "g2-art-files.json"), "utf8"));
const validStems = new Set(lib.stems.map((s) => s.stem));
const refStems = [art.cover, art.endCard,
  ...Object.values(art.chapters).flatMap((c) => [c.card, c.backdrop]),
  ...Object.values(art.portraits), ...Object.values(art.beats), ...Object.values(art.clues)];
const badStems = [...new Set(refStems)].filter((s) => !validStems.has(s));

// ── Validate: scene ids + clue slots resolve against the 15-chapter story ─────
let story;
try { story = JSON.parse(execSync(`git show feat/g2-ch11-15:content/corpus/stories/${STORY_ID}/story.json`, { cwd: REPO, encoding: "utf8" })); }
catch { try { story = JSON.parse(readFileSync(join(REPO, `content/corpus/stories/${STORY_ID}/story.json`), "utf8")); console.warn("⚠ using working-tree story (may be < 15 chapters) for validation"); } catch { story = null; } }
const sceneIds = new Set();
const slotKeys = new Set();
if (story) for (const c of story.chapters) for (const s of c.scenes) { sceneIds.add(s.id); for (const t of s.taskSlots) slotKeys.add(`${c.id}.${t.slot}`); }
const badScenes = story ? [...Object.keys(art.portraits), ...Object.keys(art.beats)].filter((id) => !sceneIds.has(id)) : [];
const badSlots = story ? Object.keys(art.clues).filter((k) => !slotKeys.has(k)) : [];

const problems = [];
if (badStems.length) problems.push(`unknown stems (not in library): ${badStems.join(", ")}`);
if (badScenes.length) problems.push(`portrait/beat scene ids not in story: ${badScenes.join(", ")}`);
if (badSlots.length) problems.push(`clue slot keys not in story: ${badSlots.join(", ")}`);

console.log("── art.json build ──");
console.log(`chapters ${Object.keys(art.chapters).length} · portraits ${Object.keys(art.portraits).length} · beats ${Object.keys(art.beats).length} · clues ${Object.keys(art.clues).length}`);
console.log(`distinct stems referenced: ${new Set(refStems).size} (all ∈ library: ${badStems.length === 0})`);
if (problems.length) { console.error("\n✗ " + problems.length + " problem(s):"); for (const p of problems) console.error("  - " + p); process.exit(1); }

const OUT = join(REPO, `content/corpus/stories/${STORY_ID}/art.json`);
writeFileSync(OUT, JSON.stringify(art, null, 2) + "\n", "utf8");
console.log(`✓ wrote ${OUT}`);
