// Generator + gate for the G1 "The Lost Pages" overworld image-prompt library.
// Single source of truth: the verbatim STYLE prefix (a bright children's picture-book
// look for the youngest learners), the character visual-locks (Finn + the 14 zone
// cameos), and the entries (Finn avatar + cover + endcard + the 15 zone cards).
// compose() builds each full, self-contained prompt; the gate asserts (STYLE present,
// unique files, < 5000 chars, known chars); then it writes a self-contained HTML
// deliverable. Images are generated externally from these prompts and dropped into
// apps/web/public/art/g1/<file>.png (resolved via art.json; the Phaser overworld canvas
// stays procedural-but-themed, and the hub cards/cover fall back until the files land).
//
//   node docs/art/build-g1-prompts.mjs      → runs the gate + writes the HTML
//
// IP-free (no real brands/landmarks/artist names) and text-free (a global no-readable-text
// negative). The whole set shares one motif: a fading storybook page coming back to life in
// a soft golden-green glow (the DomiGo brand colour) as Finn and the reader restore it.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// ── The STYLE block (opens every prompt) ──────────────────────────────────────
const STYLE =
  "Bright, warm children's picture-book illustration for young children (age 6-7). " +
  "Soft rounded shapes, thick friendly outlines, cheerful saturated colours, simple uncluttered composition. " +
  "Cosy magical storybook feeling. A gentle glow of golden-green light where a book page comes back to life. " +
  "No readable text, letters, numbers, logos or watermarks anywhere in the image.";

// ── Character visual-locks (embedded wherever a character appears) ────────────
const CH = {
  finn: "FINN (the friendly book guide): a small cheerful sprite who looks like he stepped out of a storybook, made of warm paper and ink, big round friendly eyes, a wide welcoming smile, a soft green-gold glow around him, floating gently.",
  berger: "FRAU BERGER (the kind teacher): a warm, friendly middle-aged woman with round glasses and a soft cardigan, a gentle reassuring smile.",
  pixel: "PIXEL (a little book-cat): a cute round cartoon cat with big curious eyes and a tiny smile.",
  captain: "THE CAPTAIN (a friendly cartoon pirate, not scary): a big feathered hat, a bushy round beard, rosy cheeks and a warm grin.",
  robo: "ROBO (a small friendly robot): boxy with soft rounded edges, a single glowing screen-face that shows its feelings, painted soft blue.",
  anna: "ANNA (a young drummer): a cheerful child holding drumsticks, casual bright clothes, full of energy.",
  mo: "DETECTIVE MO (a friendly cartoon detective): a tan trench coat and cap, a big magnifying glass, a curious clever look.",
  luca: "CHEF LUCA (a jolly cook): a tall white chef's hat and apron, round and warm, big moustache, beaming.",
  mila: "MILA (a stylish young girl): bright colourful mix-and-match clothes, a happy confident expression.",
  tim: "PROFESSOR TIM (a quirky pet professor): a white lab coat and big round glasses, surrounded by tiny friendly creatures.",
  apple: "MRS APPLE (a friendly shopkeeper): a cheerful apron and a warm smile, standing behind a little shop counter.",
  tik: "TIK (a tiny old clockmaker): a small kind old man with a monocle and a waistcoat, surrounded by ticking clocks.",
  rosa: "OMI ROSA (a sweet grandmother): silver hair in a bun, round glasses, a delighted birthday smile.",
  sam: "EMERGENCY SAM (a brave young helper): a bright rescue/firefighter outfit and helmet, a confident reassuring smile.",
  peppi: "DJ PEPPI (a cool DJ): big colourful headphones, bright energetic clothes, mid-dance behind a glowing booth.",
};

// ── Format presets ───────────────────────────────────────────────────────────
const F = {
  card: "Composition: a 16:9 storybook scene card, warm and inviting, room to breathe, no on-screen text.",
  hero: "Composition: a 16:9 hero/title key-art frame, the magical storybook as the centrepiece, golden-green light spilling from its pages.",
  avatar: "Composition: a 1:1 close-up circular portrait bust, soft warm key light, simple soft background.",
};

// ── Entries: { section, id, file, scene, chars, format } ──────────────────────
const E = [];
const add = (section, id, file, scene, chars = [], format = F.card) =>
  E.push({ section, id, file, scene, chars, format });

// A · Guide avatar — the one constant face across every zone
add("A · Cast", "av-finn", "av_finn", "A friendly close-up half-smile, eyes bright, glowing softly, mid-welcome.", ["finn"], F.avatar);

// B · Title + end frames
add("B · Frames", "cover", "cover_title", "A big glowing storybook lies open on a cosy desk; FINN floats just above the page welcoming the reader; tiny glimpses of the worlds inside (a lion, a pirate hat, a drum, a clock) drift up out of the pages on ribbons of golden-green light.", ["finn"], F.hero);
add("B · Frames", "endcard", "end_book", "The storybook closed and glowing, whole and full again, every page restored; FINN gives a happy goodbye wave above it, bathed in warm golden-green light.", ["finn"], F.hero);

// C · Zone cards (16:9) — one per zone: the cameo + the world coming back to life as Finn restores its page
const card = (nn, file, scene, chars) => add("C · Zones", `z${nn}`, file, scene, chars, F.card);
card("01", "card_z01", "A bright cheerful classroom flickering back to life — desks, pencils and books reappearing in golden-green light; FRAU BERGER welcomes warmly while FINN floats with a glowing restored page.", ["finn", "berger"]);
card("02", "card_z02", "A colourful zoo blooming back into colour; PIXEL the little cat gazes up happily at a big friendly lion as FINN restores the glowing page.", ["finn", "pixel"]);
card("03", "card_z03", "A friendly pirate ship on gentle waves; THE CAPTAIN beams beside an open treasure chest of glittering gold, FINN floating nearby with a glowing map page.", ["finn", "captain"]);
card("04", "card_z04", "A cosy little room; ROBO the small robot's screen-face shifts from a sad face to a big happy smile in golden-green light, FINN cheering beside it.", ["finn", "robo"]);
card("05", "card_z05", "A small music stage lighting up; ANNA the young drummer plays a drum kit beside a bright guitar, cheerful musical notes drifting up as FINN restores the page.", ["finn", "anna"]);
card("06", "card_z06", "A snug detective's study; DETECTIVE MO holds up a magnifying glass over glowing clues reappearing on the desk, FINN floating with a restored page.", ["finn", "mo"]);
card("07", "card_z07", "A warm cosy kitchen; CHEF LUCA happily stirs a steaming bowl of noodles, fresh bread and cheese reappearing on the counter, FINN nearby with a glowing page.", ["finn", "luca"]);
card("08", "card_z08", "A bright dressing room; MILA happily tries on a colourful cap and belt as clothes pop back onto the racks in golden-green light, FINN restoring the page.", ["finn", "mila"]);
card("09", "card_z09", "A cheerful pet room full of little cages and a big box; PROFESSOR TIM laughs as funny friendly creatures reappear, FINN floating with a glowing page.", ["finn", "tim"]);
card("10", "card_z10", "A friendly little shop; MRS APPLE smiles behind a counter as sweets, a toy phone and bright goods reappear on the shelves, FINN restoring the glowing page.", ["finn", "apple"]);
card("11", "card_z11", "A cosy bedroom full of clocks all starting to tick again; TIK the tiny clockmaker beams as the hands move, FINN floating with a glowing restored page.", ["finn", "tik"]);
card("12", "card_z12", "A cheerful birthday party; OMI ROSA the grandmother claps beside a big birthday cake with a glowing candle, balloons reappearing, FINN restoring the page.", ["finn", "rosa"]);
card("13", "card_z13", "A brave rescue scene with warm reassuring light; EMERGENCY SAM stands proudly by a ladder, everyone safe, FINN floating with a glowing restored page.", ["finn", "sam"]);
card("14", "card_z14", "A colourful little disco lighting up; DJ PEPPI spins behind a glowing booth as music notes and dancing lights return, FINN restoring the page.", ["finn", "peppi"]);
card("15", "card_z15", "A warm golden library with a glowing doorway of light leading to a school; FINN gently steps out of the storybook giving a happy wave goodbye while FRAU BERGER welcomes him on the other side — the cosy, heartfelt finale.", ["finn", "berger"]);

// ── compose + gate ───────────────────────────────────────────────────────────
function compose(e) {
  const chars = e.chars.map((c) => CH[c]).join(" ");
  return [STYLE, e.scene, chars, e.format].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
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
const html = `<!doctype html><meta charset="utf8"><title>The Lost Pages — image prompts</title>
<style>body{font:14px/1.5 system-ui;max-width:920px;margin:24px auto;padding:0 16px;color:#1e293b}h1{font-size:22px}h2{margin-top:28px;border-bottom:2px solid #16a34a;padding-bottom:4px}.card{border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin:10px 0}.hd{display:flex;justify-content:space-between;margin-bottom:6px}code{background:#dcfce7;padding:2px 6px;border-radius:4px;font-size:12px}textarea{width:100%;border:1px solid #e2e8f0;border-radius:6px;padding:8px;font:13px/1.45 ui-monospace,monospace;resize:vertical}</style>
<h1>The Lost Pages — image-prompt library (G1)</h1>
<p>${E.length} prompts. Generate each into <code>apps/web/public/art/g1/&lt;file&gt;.png</code>; they resolve via <code>art.json</code> (the hub cover + zone cards fall back to the procedural look until present; the Phaser overworld canvas stays procedural-but-themed). Style + character locks are baked into every prompt — paste verbatim.</p>
${body}`;
writeFileSync(join(HERE, "g1-lost-pages-prompts.html"), html);
console.log(`build-g1-prompts: OK — ${E.length} prompts, ${files.size} unique files; wrote g1-lost-pages-prompts.html`);
