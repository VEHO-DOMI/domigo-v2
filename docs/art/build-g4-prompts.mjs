// Generator + gate for the G4 "FOURTEEN: LIVE" graphic-novel image-prompt library.
// Same contract as build-g3-prompts.mjs (STYLE prefix, character visual-locks, world
// anchors, format presets, colour-grade arc, compose() + gate, self-contained HTML).
// PURELY GRAPHIC-NOVEL DESIGN (Koki directive 2026-07-11): Season 2 renders on the
// @domigo/game-trip DOM runtime, NOT a tileset — these are key-art cards + portrait
// busts, resolved via the bundle's art.json exactly like G3.
//
//   node docs/art/build-g4-prompts.mjs   → runs the gate + writes g4-fourteen-live-prompts.html
//
// Continuity is the identity: the five G3 visual-locks carry over VERBATIM in outfit
// and features, one year older (13→14; Sara 16). IP-free, text-free (no readable text;
// "live" is only ever a plain red dot). Colour grading tracks the season:
// warm act 1 → cool investigative act 2 → grey ch08 crisis → planetarium deep-blue →
// three DIFFERENT ending grades (live-red / print-sepia / desk-daylight) → honest warmth.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// ── The STYLE block (opens every prompt) ─────────────────────────────────────
const STYLE =
  "Semi-realistic young graphic novel illustration. Modern European teen drama aesthetic. " +
  "Clean confident linework with subtle ink wash textures. Natural proportions, expressive faces, " +
  "believable contemporary clothing. Rich but grounded colour palette. Teen characters aged 13-14 " +
  "unless stated otherwise. No readable text, letters, numbers, logos or watermarks anywhere in the image.";

// ── Character visual-locks (G3 locks carried, one year older; new adults) ────
const CH = {
  leah: "LEAH (14, host): dark curly hair in a high messy bun with a neon-green scrunchie; oversized round tortoiseshell glasses with amber frames; cropped medium-wash denim jacket; red worn high-top sneakers; a phone always visible; olive skin, sharp jawline, intense dark brown eyes.",
  leo: "LEO (14, camera): straight jet-black hair falling over his LEFT eye with the right eye visible; thin silver chain necklace; oversized charcoal-black hoodie with sleeves pushed to the elbows; matte-black over-ear headphones (on his head or around his neck); pale skin, angular quiet face; often holding a phone-on-gimbal or small camera.",
  ben: "BEN (14, the heart): messy sandy-blond wavy hair sticking up in all directions; freckles across his nose and cheeks; a small gap between his front teeth when he smiles; a bright orange puffer vest over clashing bright colours; slightly shorter than the others; warm brown eyes, round open face.",
  sara: "SARA (16, the compass): long straight dark hair with a single silver-blonde streak on the left from the temple; one small gold hoop in the left ear; a minimalist monochrome black/white/grey outfit; tall and composed; light brown skin, high cheekbones.",
  you: "YOU (14, the editor, ALWAYS seen from behind or over-the-shoulder, face never shown): a plain grey hoodie, dark hair; a notebook or phone in hand.",
  amelie: "AMELIE (12, community mod): small and quick, light brown hair in two low pigtails, a mustard-yellow beanie pushed back, an over-long striped scarf, round curious grey eyes; usually holding a phone with both hands.",
  novak: "MIRA NOVAK (late 30s, local-paper journalist): short practical dark hair with grey strands, rectangular black glasses pushed up on her head as often as worn, a rolled-sleeve denim shirt over a plain tee, a pen behind one ear, laugh lines and a level measuring gaze.",
  steiner: "HERR STEINER (mid 40s, sports teacher): broad and fit going soft, short greying hair, a kind weathered face with tired eyes, a dark-blue zip track jacket with two plain chest stripes, a whistle cord (no whistle text), big careful hands.",
  brandt: "HERR BRANDT (40s, sponsor rep): immaculate slate-grey suit with no tie, tanned smooth face, precisely combed dark hair, a broad practised brochure smile that never reaches his eyes, a slim folder always under one arm.",
  huber: "DIREKTORIN HUBER (mid 50s, head of school): silver-streaked dark hair in a firm low knot, a dark-green blazer over a cream blouse, reading glasses on a thin chain, an upright posture and a fair, unhurried, seen-everything expression.",
};

// ── World anchors ────────────────────────────────────────────────────────────
const W = {
  studio: "Setting: the FOURTEEN studio one year on — the teenager's-bedroom setup grown up a little: ring light, phone on tripod, a proper USB microphone now, fairy lights, and one wall covered by a big paper investigation timeline (blank cards and red string, no readable words).",
  school: "Setting: a realistic Austrian secondary-school interior — lockers, fluorescent lighting, scuffed floors.",
  aula: "Setting: a school assembly hall with a small stage, heavy curtains and rows of folding chairs.",
  yard: "Setting: a schoolyard with a bright food stand under a small awning, benches, a brick school facade behind.",
  newsroom: "Setting: a small local-newspaper office — cluttered desks, stacked paper, an old proof printer, warm lamplight, blinds.",
  gym: "Setting: a school sports hall with pale wall padding, climbing bars, a large blank sponsor banner hanging high (no readable text).",
  planetarium: "Setting: a planetarium interior under a full dome of projected stars, rows of reclined seats, faces lit only by starlight.",
  archive: "Setting: a library basement archive — metal shelves, cardboard boxes of old magazines, a single hanging bulb, dust in the light beam.",
  street: "Setting: a generic European old-town street, no brand signage, no readable text.",
};

// ── Format presets ───────────────────────────────────────────────────────────
const F = {
  card: "Composition: a 16:9 establishing key-art frame, cinematic, room to breathe, no on-screen text.",
  avatar: "Composition: a 1:1 close-up circular portrait bust, warm key light from the left, simple soft background.",
  hero: "Composition: a 16:9 hero/title key-art frame, the group as an ensemble, a soft glowing play-triangle motif suggested by light (never an actual symbol or text).",
};

// ── Colour-grade by arc position ─────────────────────────────────────────────
const grade = {
  warm: "Colour grade: warm, bright, curious — the fun of a story beginning, golden daylight.",
  cool: "Colour grade: cooler, investigative, slightly tense — evening blues, lamplight islands.",
  grey: "Colour grade: grey, stripped, 3-a.m. cold — almost colourless, one harsh phone-screen glow.",
  dome: "Colour grade: deep planetarium blue-black, faces lit softly by projected starlight.",
  live: "Colour grade: broadcast-warm with one saturated live-red dot and screen-glow on faces.",
  print: "Colour grade: warm ink-and-paper sepia, soft morning light on fresh newsprint.",
  desk: "Colour grade: calm institutional daylight — clear, even, quietly hopeful.",
  honest: "Colour grade: warmth returning but softer and real, a single live-red dot the only saturated colour.",
};

// ── Entries ──────────────────────────────────────────────────────────────────
const E = [];
const add = (section, id, file, scene, chars = [], world = "", format = F.card) =>
  E.push({ section, id, file, scene, chars, world, format });

// A · Cast avatars (1:1) — crew carried over + the Season-2 adults
add("A · Cast", "av-leah", "av_leah", "One year older: the same fearless half-smile, a shade more guarded — a host who has learned that some stories wait.", ["leah"], "", F.avatar);
add("A · Cast", "av-leo", "av_leo", "Quiet and watchful, the visible right eye steady; a small camera held to his chest like other people hold coffee.", ["leo"], "", F.avatar);
add("A · Cast", "av-ben", "av_ben", "The wide gap-toothed grin, completely unguarded — and underneath it, if you look twice, someone used to going without.", ["ben"], "", F.avatar);
add("A · Cast", "av-sara", "av_sara", "Calm, composed, a steady knowing look — the person who writes the rules down because she has seen what happens without them.", ["sara"], "", F.avatar);
add("A · Cast", "av-you", "av_you", "From behind: the back of a grey hoodie and dark hair, a notebook under one arm, the investigation wall out of focus beyond.", ["you"], "", F.avatar);
add("A · Cast", "av-amelie", "av_amelie", "Chin up, phone held in both hands like a clipboard, the face of someone about to ask the question everyone avoided.", ["amelie"], "", F.avatar);
add("A · Cast", "av-novak", "av_novak", "Glasses pushed up, arms folded, the amused level gaze of a professional deciding these kids might be the real thing.", ["novak"], "", F.avatar);
add("A · Cast", "av-steiner", "av_steiner", "A kind tired face trying to look ordinary; the eyes of a man carrying a good reason for a bad decision.", ["steiner"], "", F.avatar);
add("A · Cast", "av-brandt", "av_brandt", "The full brochure smile, perfectly lit, perfectly deniable; the folder tucked under one arm.", ["brandt"], "", F.avatar);
add("A · Cast", "av-huber", "av_huber", "Reading glasses lowered, one eyebrow slightly raised — fair, busy, and not to be underestimated.", ["huber"], "", F.avatar);

// B · Title + end card
add("B · Frames", "cover", "cover_title", "The crew mid-broadcast in the grown-up studio, confident and real — and reflected faintly in the dark window behind them, a poster-shaped rectangle of light they haven't noticed yet. YOU in the foreground from behind.", ["leah", "leo", "ben", "sara", "you"], W.studio, `${F.hero} ${grade.warm}`);
add("B · Frames", "endcard", "end_season", "The re-vote result moment: the whole school hall on its feet mid-laugh, ballots and raised hands; the crew off to the side filming it, tired and glowing; one small red live-dot.", ["leah", "leo", "ben", "sara", "amelie"], W.aula, `${F.hero} ${grade.honest}`);

// C · Segment cards (16:9) — one per chapter, tracking the season arc
const card = (nn, file, scene, chars, world, g) => add("C · Segments", `ch${nn}`, file, scene, chars, world, `${F.card} ${g}`);
card("01", "card_ch01", "An assembly in full cheer — three travel posters on easels (pure imagery: green hills, a skyline, a red-earth coast); in the foreground Leo's camera screen frames a fourth poster in an office window, and his thumb pauses on the record button.", ["leo", "huber"], W.aula, grade.warm);
card("02", "card_ch02", "The crew around the studio table, a detective paperback open face-down; Sara pins three blank cards to the timeline wall while the others watch — homework becoming a checklist.", ["sara", "leah", "ben", "you"], W.studio, grade.warm);
card("03", "card_ch03", "Leo alone in a corridor after the pitch assembly, notebook open, drawing lines between class doors — the pattern only he has seen yet.", ["leo"], W.school, grade.warm);
card("04", "card_ch04", "The newsroom: Novak mid-gesture explaining, Sara writing fast, YOU from behind at the desk edge; warm lamplight, the craft being handed over.", ["novak", "sara", "you"], W.newsroom, grade.warm);
card("05", "card_ch05", "The schoolyard pizza stand in full swing; Ben mid-review holds a slice like a microphone, delighted; behind him Brandt shakes an adult's hand, and a small sun-and-plane logo shape sits on the stand's corner (abstract mark, no text).", ["ben", "brandt"], W.yard, grade.warm);
card("06", "card_ch06", "The fork of the season: the crew in a tight circle in the studio, Amelie small in the doorway having just asked her question; on the wall the timeline waits; two invisible roads — loud or quiet — in the air between them.", ["leah", "leo", "ben", "sara", "amelie", "you"], W.studio, grade.cool);
card("07", "card_ch07", "The Sydney file: catalogue pages spread across the studio desk, Leo's finger on the one page that exists; blue evening light, the wall timeline growing behind.", ["leo", "sara"], W.studio, grade.cool);
card("08", "card_ch08", "3 a.m. — Leah alone, lit only by her phone, outside a dark office window; her reflection in the glass looks back at her like a stranger. The season's coldest frame.", ["leah"], W.school, grade.grey);
card("09", "card_ch09", "Before the interview: question cards laid in a neat row on the studio table; Leah's hands hover over them, not quite steady; Ben breathes with his eyes closed; Sara counts four on her fingers.", ["leah", "ben", "sara"], W.studio, grade.cool);
card("10", "card_ch10", "The reveal: the archive receipt and the handwritten list on the table; Ben stands very straight, saying the hard thing; Leo silently slides the last pizza slice toward him; nobody makes it weird.", ["ben", "leo", "sara", "leah"], W.studio, grade.cool);
card("11", "card_ch11", "The basement archive: dust in a single bulb's beam, open boxes of old school magazines; Sara holds a bound issue open at a gap where a page should be; Leo photographs it, twice.", ["sara", "leo"], W.archive, grade.cool);
card("12", "card_ch12", "Under the planetarium dome: rows of faces lit by projected stars; in one aisle Steiner and the crew stand in quiet conversation while Brandt watches from three rows away, smile fixed.", ["steiner", "brandt", "leah", "you"], W.planetarium, grade.dome);
card("13", "card_ch13", "The choice: the finished file in the centre of the studio table; around it three objects — a live-red dot lamp, a fresh stack of blank newsprint, and a plain office folder; four hands hovering, one decision.", ["leah", "leo", "ben", "sara", "you"], W.studio, grade.cool);

// D · Ending cards (16:9) — one per Fork-3 cluster (B-3 may surface by flag)
add("D · Endings", "end-live", "end_live", "THE LIVE SPECIAL: the gym packed, every face lit by one broadcast glow; on the small stage the crew at a table, Steiner sitting WITH them, mid-sentence, honest; a single red dot burning in the dark.", ["leah", "ben", "sara", "steiner"], W.gym, grade.live);
add("D · Endings", "end-print", "end_print", "ISSUE #1: early morning, fresh school magazines stacked high; students reading in twos and threes down a corridor, actually reading; Ben on a bench holds one open at the page that waited eight years.", ["ben", "amelie"], W.school, grade.print);
add("D · Endings", "end-desk", "end_desk", "THE DESK: Huber's office in calm daylight, the file open on her desk, all four crew standing; she has one hand flat on the pages and is looking up at them with respect neither side names.", ["huber", "leah", "leo", "sara"], W.school, grade.desk);

// ── compose + gate ───────────────────────────────────────────────────────────
function compose(e) {
  const chars = e.chars.map((c) => CH[c]).join(" ");
  return [STYLE, e.scene, chars, e.world, e.format].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

const files = new Set();
for (const e of E) {
  const p = compose(e);
  if (!p.startsWith(STYLE)) throw new Error(`${e.id}: STYLE missing`);
  if (p.length > 5000) throw new Error(`${e.id}: prompt too long (${p.length})`);
  if (files.has(e.file)) throw new Error(`${e.id}: duplicate file ${e.file}`);
  files.add(e.file);
  for (const c of e.chars) if (!CH[c]) throw new Error(`${e.id}: unknown char ${c}`);
}

// ── HTML deliverable ─────────────────────────────────────────────────────────
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sections = [...new Set(E.map((e) => e.section))];
const body = sections
  .map((sec) => {
    const items = E.filter((e) => e.section === sec)
      .map((e) => {
        const p = compose(e);
        return `<div class="card"><div class="hd"><b>${esc(e.id)}</b><code>${esc(e.file)}.png</code></div><textarea readonly rows="6">${esc(p)}</textarea></div>`;
      })
      .join("\n");
    return `<h2>${esc(sec)}</h2>\n${items}`;
  })
  .join("\n");
const html = `<!doctype html><meta charset="utf8"><title>FOURTEEN: LIVE — image prompts</title>
<style>body{font:14px/1.5 system-ui;max-width:920px;margin:24px auto;padding:0 16px;color:#1e293b}h1{font-size:22px}h2{margin-top:28px;border-bottom:2px solid #b91c1c;padding-bottom:4px}.card{border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin:10px 0}.hd{display:flex;justify-content:space-between;margin-bottom:6px}code{background:#fef2f2;padding:2px 6px;border-radius:4px;font-size:12px}textarea{width:100%;border:1px solid #e2e8f0;border-radius:6px;padding:8px;font:13px/1.45 ui-monospace,monospace;resize:vertical}.note{background:#fffbeb;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:0 8px 8px 0;margin:12px 0}</style>
<h1>FOURTEEN: LIVE — image-prompt library (G4 · Season 2)</h1>
<p>${E.length} prompts, purely <b>graphic-novel key art</b> (Season 2 runs on the story-file runtime, not a tileset). Generate each into <code>apps/web/public/art/g4/&lt;file&gt;.png</code>; they resolve via the bundle's <code>art.json</code> — the same pipeline as Season 1 (G3).</p>
<div class="note"><b>Read first:</b> the five crew locks are the G3 locks one year older — <b>do not redesign them</b>; continuity IS the identity. Generate the G3 set first if you haven't, and feed a G3 crew image as reference. The three <b>Ending cards</b> (section D) match the player's Fork-3 choice — generate all three. "Live" is only ever a plain red dot; never readable text anywhere.</div>
${body}`;
writeFileSync(join(HERE, "g4-fourteen-live-prompts.html"), html);

// ── art.json — the decoupled placement manifest (story-art@1), SAME source of
//    truth as the prompts above, so the two can never drift. Mirror of G3's
//    shape: cover + neutral endCard + one card per chapter (the three Fork-3
//    ending cards are generated assets B-3 wires per-flag — schema has one endCard).
const STORY_ID = "g4.st.fourteen-live";
const cardOf = (nn) => {
  const e = E.find((x) => x.id === `ch${nn}`);
  if (!e) throw new Error(`art.json: no prompt for chapter card ch${nn}`);
  return e.file;
};
const art = { schema: "story-art@1", storyId: STORY_ID, base: "/art/g4", cover: "cover_title", endCard: "end_season", chapters: {}, portraits: {}, beats: {}, clues: {} };
for (let n = 1; n <= 13; n++) art.chapters[`${STORY_ID}.ch${String(n).padStart(2, "0")}`] = { card: cardOf(String(n).padStart(2, "0")) };
// guard: every stem the manifest references must have a prompt in this library
for (const stem of [art.cover, art.endCard, ...Object.values(art.chapters).map((c) => c.card)]) {
  if (!files.has(stem)) throw new Error(`art.json references stem "${stem}" with no prompt card`);
}
const OUT = join(HERE, "..", "..", "content", "corpus", "stories", STORY_ID, "art.json");
writeFileSync(OUT, JSON.stringify(art, null, 2) + "\n", "utf8");
console.log(`build-g4-prompts: OK — ${E.length} prompts, ${files.size} unique files; wrote g4-fourteen-live-prompts.html + art.json (${Object.keys(art.chapters).length} chapter cards)`);
