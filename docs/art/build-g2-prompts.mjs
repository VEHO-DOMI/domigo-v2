// Generator + gate for the G2 "The Wrong Name" ligne-claire image-prompt library.
// Single source of truth: defines the verbatim STYLE block, the 8 character specs,
// world anchors, and ~120 entries (scene + chars + world + format). compose() builds
// each full, self-contained prompt; the gate asserts (<5000 chars, unique files,
// STYLE + verbatim specs present); then it writes a self-contained HTML deliverable.
//
//   node docs/art/build-g2-prompts.mjs        → runs the gate + writes the HTML
//
// IP-free (no artist/studio names) and text-free (a global no-readable-text negative;
// plot facts shown visually — e.g. the result gap as teal[Lena] tall vs maroon[Dani] short).

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

// ── The STYLE block (verbatim, opens every prompt) ───────────────────────────
const STYLE =
  "Art style: flat \"clear-line\" (ligne claire) European comic-album illustration — the crisp, hand-inked look of classic Franco-Belgian adventure comics printed on a page. " +
  "LINEWORK: every shape — faces, hands, hair, clothing, props and background alike — has clean solid BLACK ink outlines of one uniform weight; no thick-to-thin tapering, no sketchy, doubled or rough strokes, no pencil texture; shapes neatly closed and confident. " +
  "COLOUR: 100% flat, even fills — one solid colour per area with crisp hard edges; absolutely NO gradients, NO airbrushing, NO soft or cel-shaded ramps, NO blended tones, NO glow, NO ambient shadow. At most ONE flat, hard-edged darker tone may sit beside a base colour as a simple shadow, used sparingly. A bright, clean, confidently saturated, slightly warm palette of a few clear colours — never muted, dusty or pastel-washed. " +
  "FACES & PROPORTIONS: friendly and simplified but with natural, grounded human proportions and normal-sized heads. Eyes are notably SMALL and understated — a small oval or dot with a plain black pupil and little or no white catch-light — with thin even eyebrows, a tiny single-line nose and a small simple mouth. NOT big glossy 'anime' eyes, NOT chibi. " +
  "BACKGROUNDS: precise, architecturally correct settings, drawn and flat-coloured in the exact same clean clear-line style as the characters — every object outlined and flat-filled, never painted, never blurred. " +
  "LIGHTING: even, flat and neutral — no dramatic contrast, no rim or cinematic light, no glow. It must read as a flat printed comic page, wholesome and clear. " +
  "REALISM: stage each scene the way a real illustrator would draw an actual place — include only objects that plausibly belong there; do NOT add symbolic or floating motifs (question marks, speech bubbles), clichéd 'detective' decorations (silhouette portraits, conspiracy red string, scattered magnifiers), or extra props placed only to signal the theme. " +
  "MUST NOT LOOK LIKE: anime, manga or Japanese animation; soft cel-shaded TV cartoon; painterly, watercolour or gouache illustration; 3D/CGI; or a photograph. Also avoid: gradient or soft shading, glow, atmospheric haze, depth-of-field or lens blur, paper or brush texture, cross-hatching, halftone, film grain. " +
  "NO readable text, letters, numbers or logos anywhere — keep any incidental signage purely decorative and illegible.";

// ── Character bible (verbatim; embedded wherever the character appears) ───────
const CHARS = {
  mina:
    "MINA — an 11-year-old girl detective. Warm medium-brown skin, a round friendly face, small dark-brown eyes (simple dots, no sparkle) behind big round tortoiseshell glasses, thin eyebrows, a small alert smile. Black hair worn in two neat round space-buns high on her head. Average height, lively upright posture. She wears a buttoned MUSTARD-YELLOW knitted cardigan over a crisp white collared shirt, a pleated NAVY-BLUE skirt, and RED high-top canvas sneakers, and almost always carries a small spiral-bound notebook and a yellow pencil. Bright, curious, confident and quick to point things out. Signature colour: mustard yellow. Keep this exact design in every image.",
  theo:
    "THEO — an 11-year-old boy detective. Light olive skin, an oval face with a light scatter of freckles across the nose and cheeks, small brown eyes, thin eyebrows. Tousled, slightly spiky dark-brown hair. Average height, an eager leaning-forward posture. He wears a zipped FOREST-GREEN bomber jacket over a blue-and-white HORIZONTALLY STRIPED t-shirt, BROWN corduroy trousers and grey trainers, and very often holds a round brass-rimmed magnifying glass. Earnest, excitable, usually first to spot a clue. Signature colour: green. Keep this exact design in every image.",
  lena:
    "LENA — a shy 11-year-old girl inventor. Pale skin, a gentle oval face, small blue-grey eyes, a soft quiet expression. Long straight COPPER-RED (ginger) hair falling past her shoulders, with one thin braid on the left side; slight build. She wears a TEAL hooded sweatshirt with a small brass cog-and-rocket enamel pin on the chest, blue jeans and scuffed white sneakers. Quiet, gentle and thoughtful. She CLEARLY looks related to BEN — exactly the same copper-red hair colour and the same small straight nose. Signature colour: teal. Keep this exact design in every image.",
  ben:
    "BEN — Lena's older brother, a lanky 13-year-old boy, a clear head taller than the younger children. He has exactly the SAME COPPER-RED (ginger) hair as Lena (here short and tousled), the same pale skin and the same small straight nose, with small grey-green eyes. He wears an open SLATE-BLUE denim jacket over a plain charcoal-grey t-shirt, dark jeans and trainers, and often holds a small folded card. Kind but anxious and guilty-earnest, shoulders a little hunched. Signature colour: slate blue. Keep this exact design in every image.",
  dani:
    "DANI — a confident, popular 12-year-old boy. Olive skin, a slightly angular face, small brown eyes, neat dark-brown hair combed and lightly slicked to one side. Average-to-tall with an upright, self-assured posture. Smartly dressed in a MAROON varsity jacket with a white-trimmed collar and cuffs over a clean white t-shirt, dark chinos and fresh white trainers. Outwardly cocky with a half-smile, but secretly uneasy — a likeable, well-dressed kid, NOT a cartoon villain. Signature colour: maroon. Keep this exact design in every image.",
  max:
    "MAX — a loud, stocky 12-year-old boy. Fair skin, a broad face with freckles, small blue eyes often with raised eyebrows. Short spiky blond hair. Solid build, a slightly slouchy stance. He wears a baggy ORANGE hoodie with a simple graphic on the chest, grey joggers and chunky trainers, with large headphones slung around his neck. Brash, defensive and loud, but ultimately harmless. Signature colour: orange. Keep this exact design in every image.",
  okafor:
    "MR OKAFOR — the science-club teacher, a Black man in his forties. Dark brown skin, a kind oval face, short black hair and a neat short beard, slim rectangular glasses. Tall and calm. He wears a BROWN corduroy blazer with leather elbow patches over a checked shirt and a knitted tie, with brown chinos. Calm, thoughtful, fair and kind. Signature colour: warm brown. Keep this exact design in every image.",
  bell:
    "MR BELL — the school caretaker, a friendly white man in his sixties. Ruddy pinkish skin, round cheeks, a bushy grey moustache, and grey hair under a flat tweed cap; small kind eyes with smile-lines. Sturdy and a little stooped. He wears NAVY-BLUE work coveralls over a checked shirt, with a big jingling keyring clipped to his belt. Genial, slow-moving and helpful. Signature colour: navy. Keep this exact design in every image.",
};

// ── World anchors (embedded only where relevant) ─────────────────────────────
const W = {
  school:
    "WORLD: Birchwood School, a friendly red-brick British school with bright corridors and tall windows.",
  cabinet:
    "The entrance-hall display is a waist-high wood-and-glass trophy cabinet on a stand with a small velvet plinth inside.",
  medal:
    "The 'Young Inventor' medal is a gold five-pointed star with small wings hanging from a teal ribbon; its engraving plate is left blank with no readable text.",
  fair:
    "The 'Sky Challenge' science fair fills the hall with home-made cardboard flying-machines and paper planes, plus bunting and a hand-painted banner (illegible).",
};

// ── Format presets ───────────────────────────────────────────────────────────
const F = {
  bust: "Format: a square 1:1 head-and-shoulders portrait, the character centred and facing the viewer, on a plain solid cream background with no scenery.",
  full: "Format: a portrait 2:3 full-body character reference, three-quarter view, standing on a plain solid cream background with no scenery.",
  land: "Format: a landscape 3:2 illustration, clean and uncluttered.",
  tall: "Format: a portrait 2:3 illustration, clean and uncluttered.",
  prop: "Format: a square 1:1 single-object illustration, the subject centred and large on a plain solid cream background with no scenery.",
  card: "Format: a portrait 2:3 chapter-title card with generous empty space for a title that is left blank (no text).",
  cover: "Format: a portrait 2:3 cover illustration with generous empty space at the top for a title that is left blank (no text).",
};

// ── Entries: { id, section, title, file, scene, chars?, world?, format } ──────
const E = [];
const add = (section, id, title, file, scene, chars, world, format, isNew) =>
  E.push({ id, section, title, file, scene, chars: chars || [], world: world || [], format, isNew: isNew || false });

// ===== A · CHARACTERS — full-body references =================================
const SEC_A = "A · Characters";
add(SEC_A, "mina_ref", "Mina — full-body reference", "mina_ref.png",
  "Scene: a full-body character reference of Mina standing in a relaxed three-quarter pose, friendly and confident, one hand holding her small spiral notebook.", ["mina"], [], F.full);
add(SEC_A, "theo_ref", "Theo — full-body reference", "theo_ref.png",
  "Scene: a full-body character reference of Theo standing in an eager three-quarter pose, holding his magnifying glass loosely at his side.", ["theo"], [], F.full);
add(SEC_A, "lena_ref", "Lena — full-body reference", "lena_ref.png",
  "Scene: a full-body character reference of Lena standing a little shyly in a three-quarter pose, hands gently together, a soft expression.", ["lena"], [], F.full);
add(SEC_A, "ben_ref", "Ben — full-body reference", "ben_ref.png",
  "Scene: a full-body character reference of Ben standing tall but slightly hunched in a three-quarter pose, hands in his denim jacket pockets, an earnest look.", ["ben"], [], F.full);
add(SEC_A, "dani_ref", "Dani — full-body reference", "dani_ref.png",
  "Scene: a full-body character reference of Dani standing confidently in a three-quarter pose, one hand in a pocket, a slightly cocky half-smile.", ["dani"], [], F.full);
add(SEC_A, "max_ref", "Max — full-body reference", "max_ref.png",
  "Scene: a full-body character reference of Max standing with his arms crossed in a three-quarter pose, a brash grin.", ["max"], [], F.full);
add(SEC_A, "okafor_ref", "Mr Okafor — full-body reference", "okafor_ref.png",
  "Scene: a full-body character reference of Mr Okafor standing calmly in a three-quarter pose, hands lightly clasped, a kind expression.", ["okafor"], [], F.full);
add(SEC_A, "bell_ref", "Mr Bell — full-body reference", "bell_ref.png",
  "Scene: a full-body character reference of Mr Bell standing relaxed in a three-quarter pose, one hand resting near the keyring on his belt, a genial smile.", ["bell"], [], F.full);

// ===== A · CHARACTERS — expression busts (speech bubbles) ====================
const bust = (id, title, file, who, expr) =>
  add(SEC_A, id, title, file, `Scene: a head-and-shoulders portrait of ${who[0].toUpperCase() + who.slice(1)}, ${expr}`, [who], [], F.bust);
// Mina
bust("mina_neutral", "Mina — neutral", "mina_neutral.png", "mina", "a calm, friendly neutral expression, looking at the viewer.");
bust("mina_happy", "Mina — happy", "mina_happy.png", "mina", "a bright, happy smile.");
bust("mina_surprised", "Mina — surprised", "mina_surprised.png", "mina", "a surprised expression, eyes wide and eyebrows raised.");
bust("mina_thinking", "Mina — thinking/suspicious", "mina_thinking.png", "mina", "a thinking, slightly suspicious expression, one hand at her chin and eyes narrowed.");
bust("mina_determined", "Mina — determined", "mina_determined.png", "mina", "a determined, confident expression, a small firm nod.");
bust("mina_talking", "Mina — talking", "mina_talking.png", "mina", "talking mid-sentence with an open friendly mouth, explaining something.");
// Theo
bust("theo_neutral", "Theo — neutral", "theo_neutral.png", "theo", "a calm, friendly neutral expression, looking at the viewer.");
bust("theo_excited", "Theo — excited", "theo_excited.png", "theo", "a big excited grin, eyes shining.");
bust("theo_surprised", "Theo — surprised", "theo_surprised.png", "theo", "a surprised, open-mouthed expression.");
bust("theo_worried", "Theo — worried", "theo_worried.png", "theo", "a worried expression, eyebrows tilted up.");
bust("theo_aha", "Theo — aha!", "theo_aha.png", "theo", "an 'aha!' eureka expression, one finger raised, eyes bright.");
bust("theo_talking", "Theo — talking", "theo_talking.png", "theo", "talking mid-sentence, eager and animated.");
// Lena
bust("lena_neutral", "Lena — neutral/shy", "lena_neutral.png", "lena", "a quiet, slightly shy neutral expression.");
bust("lena_sad", "Lena — sad", "lena_sad.png", "lena", "a quietly sad expression, downcast eyes and a small frown (gentle, not crying).");
bust("lena_hopeful", "Lena — hopeful", "lena_hopeful.png", "lena", "a small, hopeful expression, looking up gently.");
bust("lena_joyful", "Lena — joyful", "lena_joyful.png", "lena", "a bright, joyful, grateful smile, eyes lit up.");
bust("lena_explaining", "Lena — explaining", "lena_explaining.png", "lena", "talking earnestly mid-sentence, explaining something quietly.");
// Ben
bust("ben_neutral", "Ben — neutral", "ben_neutral.png", "ben", "a calm but slightly tense neutral expression.");
bust("ben_anxious", "Ben — anxious", "ben_anxious.png", "ben", "an anxious expression, worried brow, lips pressed.");
bust("ben_guilty", "Ben — guilty", "ben_guilty.png", "ben", "a guilty, ashamed expression, looking down and to the side.");
bust("ben_relieved", "Ben — relieved", "ben_relieved.png", "ben", "a relieved, gentle small smile, shoulders easing.");
bust("ben_talking", "Ben — confessing/talking", "ben_talking.png", "ben", "talking sincerely mid-sentence, an earnest, slightly pained look.");
// Dani
bust("dani_smug", "Dani — confident/smug", "dani_smug.png", "dani", "a confident, slightly smug half-smile.");
bust("dani_uneasy", "Dani — uneasy", "dani_uneasy.png", "dani", "an uneasy, forced smile with eyes glancing away.");
bust("dani_caught", "Dani — caught/nervous", "dani_caught.png", "dani", "a caught-out, nervous expression, startled and stiff.");
bust("dani_sorry", "Dani — ashamed/sorry", "dani_sorry.png", "dani", "an ashamed, genuinely sorry expression, looking down.");
// Max
bust("max_brash", "Max — brash/loud", "max_brash.png", "max", "a loud, brash expression, mouth open mid-shout, a cocky grin.");
bust("max_deny", "Max — denying", "max_deny.png", "max", "a defensive, denying expression, frowning with both hands raised, palms out.");
bust("max_sulky", "Max — sulky", "max_sulky.png", "max", "a sulky expression, arms crossed and a pout.");
bust("max_surprised", "Max — surprised", "max_surprised.png", "max", "a surprised expression, eyebrows up.");
// Okafor
bust("okafor_neutral", "Mr Okafor — kind/neutral", "okafor_neutral.png", "okafor", "a calm, kind neutral expression.");
bust("okafor_thoughtful", "Mr Okafor — thoughtful", "okafor_thoughtful.png", "okafor", "a thoughtful expression, one hand at his beard.");
bust("okafor_concerned", "Mr Okafor — concerned", "okafor_concerned.png", "okafor", "a concerned expression, a slight frown of worry.");
// Bell
bust("bell_friendly", "Mr Bell — friendly", "bell_friendly.png", "bell", "a warm, friendly smile.");
bust("bell_explaining", "Mr Bell — explaining", "bell_explaining.png", "bell", "talking and gesturing, explaining something helpfully.");
bust("bell_surprised", "Mr Bell — surprised", "bell_surprised.png", "bell", "a surprised expression, eyebrows up.");

// ===== B · SETTINGS (empty stages) ==========================================
const SEC_B = "B · Settings";
add(SEC_B, "set_school_exterior", "School exterior", "set_school_exterior.png",
  "Scene: an establishing exterior view of Birchwood School — a friendly red-brick British school building with tall windows, a clock tower, a few trees and an empty paved entrance path; a bright clear day, no people.", [], [], F.land);
add(SEC_B, "set_hall_full", "Entrance hall — medal present", "set_hall_full.png",
  "Scene: the bright entrance hall of Birchwood School; in the centre stands a waist-high wood-and-glass trophy cabinet on a stand, and inside, on a small velvet plinth, sits a gold winged-star medal on a teal ribbon. Polished floor, tall windows, a noticeboard on the wall, no people.", [], ["medal"], F.land);
add(SEC_B, "set_hall_empty", "Entrance hall — empty plinth", "set_hall_empty.png",
  "Scene: the bright entrance hall of Birchwood School; the wood-and-glass trophy cabinet stands open and the small velvet plinth inside is EMPTY, and a small blank hand-written card lies on top of the glass. Tall windows, polished floor, no people.", [], [], F.land);
add(SEC_B, "set_hall_night", "Entrance hall — at night", "set_hall_night.png",
  "Scene: the entrance hall of Birchwood School at night, dim and quiet, cool moonlight falling through the tall windows onto the wood-and-glass trophy cabinet; long soft shadows, no people.", [], [], F.land);
add(SEC_B, "set_fair", "Sky Challenge science fair", "set_fair.png",
  "Scene: a school hall set up for the science fair, with tables of home-made cardboard flying-machines and paper planes, bunting strung overhead and a hand-painted banner (illegible); cheerful and busy-looking but with no people.", [], [], F.land);
add(SEC_B, "set_club_room", "Question Club room", "set_club_room.png",
  "Scene: a cosy classroom corner set up as a children's after-school club — two small desks pushed together, a pinboard on the wall with handwritten notes, drawings and a few photos, a jar of pens, a small bookshelf and a couple of mismatched chairs; warm and inviting, no people.", [], [], F.land);
add(SEC_B, "set_back_corridor", "Back-door corridor", "set_back_corridor.png",
  "Scene: a quiet school corridor leading to a back door that stands slightly ajar, daylight spilling through the gap; lockers along one wall, a noticeboard, no people.", [], [], F.land);
add(SEC_B, "set_caretaker_room", "Caretaker's room", "set_caretaker_room.png",
  "Scene: a small caretaker's room with a wall-mounted key cupboard full of keys, a workbench with tidy tools, a mop and bucket, and navy coveralls hanging on a hook; cosy and orderly, no people.", [], [], F.land);
add(SEC_B, "set_lab", "Science lab", "set_lab.png",
  "Scene: a friendly school science lab with workbenches, simple gadgets, jars and small models of flying machines on a shelf; bright and tidy, no people.", [], [], F.land);
add(SEC_B, "set_assembly", "Assembly hall", "set_assembly.png",
  "Scene: a school assembly hall with a small wooden stage, rows of chairs, tall windows and bunting strung across; calm and ready for an event, no people.", [], [], F.land);
add(SEC_B, "set_schoolyard", "Schoolyard", "set_schoolyard.png",
  "Scene: the schoolyard outside Birchwood School with entrance steps, a bike rack, a couple of trees and a low brick wall; a bright day, no people.", [], [], F.land);
add(SEC_B, "set_costume_hall", "Costume-night hall", "set_costume_hall.png",
  "Scene: the school hall decorated for a costume night — paper lanterns, streamers and soft warm lighting, with the wood-and-glass trophy cabinet visible at one side; festive but with no people.", [], [], F.land);
add(SEC_B, "set_townmap", "Town map (bird's-eye)", "set_townmap.png",
  "Scene: a flat, stylised bird's-eye town map drawn like a board-game map, with little simple buildings clearly readable as a bank, a church and a cinema, connected by tidy streets and a small park; pictorial icons only, no readable labels or text.", [], [], F.land);
add(SEC_B, "set_noticeboard", "Noticeboard wall", "set_noticeboard.png",
  "Scene: a close view of a school hallway noticeboard wall covered with pinned papers (all blank or illegible) and one empty framed chart panel; tidy and ordinary, no people, no readable text.", [], [], F.land);

// ===== C · STORY BEATS =======================================================
const SEC_C = "C · Story beats";
add(SEC_C, "beat_ch01_empty", "Ch1 — the empty case", "beat_ch01_empty.png",
  "Scene: Mina and Theo lean in toward the wood-and-glass trophy cabinet in the school entrance hall, both shocked: the small velvet plinth inside is EMPTY where a medal should be. Theo's mouth is open; Mina grips her notebook.", ["mina", "theo"], ["school"], F.land);
add(SEC_C, "beat_ch01_card", "Ch1 — the card on the glass", "beat_ch01_card.png",
  "Scene: a close view of Theo's hand lifting a small hand-written card off the top of the glass trophy cabinet; the card carries indistinct, unreadable handwriting.", ["theo"], [], F.land);
add(SEC_C, "beat_ch01_lena_sad", "Ch1 — Lena at the display", "beat_ch01_lena_sad.png",
  "Scene: Lena stands alone before the wood-and-glass trophy cabinet, shoulders drooping, gazing at the empty velvet plinth with a quiet, sad expression.", ["lena"], [], F.land);
add(SEC_C, "beat_ch02_question", "Ch2 — questioning Max", "beat_ch02_question.png",
  "Scene: in a school corridor, Mina and Theo stand questioning Max; Mina holds up her notebook as if asking a question, Theo beside her, while Max looks defensive.", ["mina", "theo", "max"], [], F.land);
add(SEC_C, "beat_ch02_post", "Ch2 — Max's boastful post", "beat_ch02_post.png",
  "Scene: Max leans against a school wall, grinning and holding up his phone to show it off, looking smug and careless after boasting.", ["max"], [], F.land);
add(SEC_C, "beat_ch03_crowd", "Ch3 — costume-night crowd", "beat_ch03_crowd.png",
  "Scene: a small crowd of children in simple party costumes and plain face-masks mill about the decorated school hall near the wood-and-glass trophy cabinet at costume night; warm lantern light, lively but gentle.", [], [], F.land);
add(SEC_C, "beat_ch03_open_door", "Ch3 — the open back door", "beat_ch03_open_door.png",
  "Scene: a school corridor at the end of the party; the back door stands open to the dark night outside, a few streamers on the floor, nobody around — a quiet, telling moment.", [], [], F.land);
add(SEC_C, "beat_ch04_crack", "Ch4 — THE CRACK", "beat_ch04_crack.png",
  "Scene: Mina and Theo crouch by a framed results chart on the entrance-hall wall. The chart shows two simple flat coloured bars side by side — a tall TEAL bar and, next to it, a clearly shorter MAROON bar. Theo points at the tall teal bar in surprise; Mina holds her notebook with wide, dawning realisation. Any marks on the chart are decorative and illegible — no readable text or numbers.", ["mina", "theo"], ["school"], F.land);
add(SEC_C, "beat_ch04_chart", "Ch4 — the chart close-up", "beat_ch04_chart.png",
  "Scene: a close view of a simple framed results chart showing two flat coloured bars — a tall TEAL bar beside a clearly shorter MAROON bar — and nothing else; no numbers, no readable text.", [], [], F.land);
add(SEC_C, "beat_ch05_map", "Ch5 — tracing the route", "beat_ch05_map.png",
  "Scene: Mina and Theo lean over a flat stylised town map spread on a desk, Theo tracing a dotted route with his finger between a little bank and a little church while Mina watches, puzzled; the map uses pictorial icons only, no readable labels.", ["mina", "theo"], [], F.land);
add(SEC_C, "beat_ch05_max_town", "Ch5 — Max in town", "beat_ch05_max_town.png",
  "Scene: Max walks along a tidy little town street past a bank and a church, hands in his hoodie pocket, looking ordinary — a claimed-alibi moment; no readable signs.", ["max"], [], F.land);
add(SEC_C, "beat_ch06_bell_keys", "Ch6 — Mr Bell and his keys", "beat_ch06_bell_keys.png",
  "Scene: Mr Bell stands by the school back door, holding up his big jingling keyring and pointing to the lock, explaining helpfully.", ["bell"], [], F.land);
add(SEC_C, "beat_ch06_sort", "Ch6 — sorting suspects", "beat_ch06_sort.png",
  "Scene: Mina and Theo stand at a table, sorting a row of index cards into two neat groups as they work out who could have reached the cabinet.", ["mina", "theo"], [], F.land);
add(SEC_C, "beat_ch07_lena_secret", "Ch7 — Lena's secret", "beat_ch07_lena_secret.png",
  "Scene: Lena sits alone on a low wall, turning a small brass gadget over in her hands, looking wistful and a little secretive.", ["lena"], [], F.land);
add(SEC_C, "beat_ch07_theorise", "Ch7 — at the evidence board", "beat_ch07_theorise.png",
  "Scene: Mina and Theo stand at a pinboard covered with notes and a few photos, both pointing as they talk through their theory; a thoughtful 'aha' mood.", ["mina", "theo"], [], F.land);
add(SEC_C, "beat_ch08_timeline", "Ch8 — the night timeline", "beat_ch08_timeline.png",
  "Scene: a night-time school hall; Mr Bell pulls the tall doors closed for the evening, and on the wall a round clock with plain tick-marks (and NO numerals) has its hands pointing to eight o'clock. Cool evening light.", ["bell"], [], F.land);
add(SEC_C, "beat_ch08_night_figure", "Ch8 — the figure with a key", "beat_ch08_night_figure.png",
  "Scene: the dim entrance hall at night; a mysterious unidentifiable figure in silhouette stands at the wood-and-glass cabinet, holding up a single key — face and identity hidden in shadow. Suspenseful but gentle.", [], [], F.land);
add(SEC_C, "beat_ch08_key_close", "Ch8 — the key close-up", "beat_ch08_key_close.png",
  "Scene: a close view of a hand holding a single brass key up to the lock of the wood-and-glass trophy cabinet at night.", [], [], F.land);
add(SEC_C, "beat_ch09_two_medals", "Ch9 — two medals compared", "beat_ch09_two_medals.png",
  "Scene: Mina and Theo hold up and compare two gold winged-star medals side by side over a desk — one with a maroon-edged little card, the other with a teal-edged card — realising one has been swapped for the other.", ["mina", "theo"], [], F.land);
add(SEC_C, "beat_ch09_new_card", "Ch9 — the new card", "beat_ch09_new_card.png",
  "Scene: a close view of a small hand-written name-card with a neat TEAL edge lying on a desk; the handwriting on it is indistinct and unreadable.", [], [], F.land);
add(SEC_C, "beat_ch10_lena_invents", "Ch10 — Lena inventing", "beat_ch10_lena_invents.png",
  "Scene: Lena beams happily at a science-lab workbench, building a little cardboard-and-paper flying-machine with a small screwdriver, clearly in her element.", ["lena"], [], F.land);
add(SEC_C, "beat_ch11_match", "Ch11 — handwriting matched", "beat_ch11_match.png",
  "Scene: Ben's hand rests on a desk beside two small cards whose indistinct handwriting clearly matches; Ben looks down at them, caught and uneasy. No readable text.", ["ben"], [], F.land);
add(SEC_C, "beat_ch11_family", "Ch11 — the family resemblance", "beat_ch11_family.png",
  "Scene: Mina and Theo look from Ben to Lena, who stand side by side, suddenly realising the two are related — the same copper-red hair and nose.", ["mina", "theo", "ben", "lena"], [], F.land);
add(SEC_C, "beat_ch12_confession", "Ch12 — Ben's confession", "beat_ch12_confession.png",
  "Scene: Ben holds the gold winged-star medal in both hands and confesses to Mina and Theo, an earnest, guilty look on his face; the detectives listen seriously.", ["ben", "mina", "theo"], ["medal"], F.land);
add(SEC_C, "beat_ch13_confront", "Ch13 — confronting Dani", "beat_ch13_confront.png",
  "Scene: Mina and Theo stand firmly facing Dani, who looks caught and ashamed, glancing away; a tense but calm confrontation in a school corridor.", ["dani", "mina", "theo"], [], F.land);
add(SEC_C, "beat_ch14_correct", "Ch14 — correcting the record", "beat_ch14_correct.png",
  "Scene: Mr Okafor places a corrected teal-edged card beside the framed two-bar results chart on the wall while Lena watches hopefully beside him; a quiet, putting-it-right moment. No readable text.", ["okafor", "lena"], [], F.land);
add(SEC_C, "beat_ch15_medal", "Ch15 — Lena gets her medal", "beat_ch15_medal.png",
  "Scene: on the small assembly-hall stage, Mr Okafor presents the gold winged-star medal on its teal ribbon to a beaming Lena; bunting overhead, a warm, happy moment.", ["okafor", "lena"], ["medal"], F.land);
add(SEC_C, "beat_ch15_apology", "Ch15 — Dani apologises", "beat_ch15_apology.png",
  "Scene: Dani offers a sincere, ashamed apology to Lena, who listens graciously; a genuine, age-appropriate making-amends moment.", ["dani", "lena"], [], F.land);
add(SEC_C, "beat_ch15_caseclosed", "Ch15 — case closed", "beat_ch15_caseclosed.png",
  "Scene: Mina, Theo, Lena and Ben stand together, smiling and relieved, Theo raising his magnifying glass — the case is closed.", ["mina", "theo", "lena", "ben"], [], F.land);
add(SEC_C, "beat_ch15_ben_told", "Ch15 — Ben is gently told", "beat_ch15_ben_told.png",
  "Scene: Mr Okafor kneels to Ben's level, a kind hand on his shoulder, gently explaining that he should have asked a teacher; Ben listens, relieved and a little sheepish.", ["okafor", "ben"], [], F.land);

// ----- NEW backstory beats (told-but-never-shown; flagged isNew) -------------
add(SEC_C, "beat_flashback_lena_wins", "Flashback — Lena wins (last year)", "beat_flashback_lena_wins.png",
  "Scene: a flashback to last year's science fair. Lena's home-made cardboard-and-paper flying machine sails the farthest across the school hall, gliding well past the shorter throws of other children's machines that have dropped to the floor; Lena watches it with quiet, shining hope. A bright, hopeful memory.", ["lena"], [], F.land, true);
add(SEC_C, "beat_flashback_dani_swaps", "Flashback — Dani's cheat (last year)", "beat_flashback_dani_swaps.png",
  "Scene: a flashback to last year's fair. At the results table, Dani quietly swaps two small result cards with one hand while glancing back over his shoulder to make sure no one is watching; a furtive, guilty look. The original cheat that started it all.", ["dani"], [], F.land, true);
add(SEC_C, "beat_flashback_wrong_medal", "Flashback — the wrong medal (last year)", "beat_flashback_wrong_medal.png",
  "Scene: a flashback to last year's prize-giving on the assembly stage. Dani is handed the gold winged-star medal and smiles, while down in the crowd Lena looks at the floor, quietly deflated. The injustice.", ["dani", "lena"], ["medal"], F.land, true);
add(SEC_C, "beat_ch12_ben_lena", "Ch12 — Ben and Lena (siblings)", "beat_ch12_ben_lena.png",
  "Scene: present day — Ben stands with a gentle hand on his younger sister Lena's shoulder, both relieved and a little tearful now that the truth is out; a warm sibling moment.", ["ben", "lena"], [], F.land, true);

// ===== D · PROPS / EVIDENCE / UI MOTIFS ======================================
const SEC_D = "D · Props & evidence";
add(SEC_D, "prop_medal", "The medal", "prop_medal.png",
  "Scene: a single 'Young Inventor' medal — a gold five-pointed star with small wings, hanging from a teal ribbon; the centre engraving plate is blank with no readable text.", [], [], F.prop);
add(SEC_D, "prop_card_old", "Name-card — old (maroon)", "prop_card_old.png",
  "Scene: a single small hand-written name-card with a MAROON edge; the handwriting on it is indistinct and unreadable.", [], [], F.prop);
add(SEC_D, "prop_card_new", "Name-card — corrected (teal)", "prop_card_new.png",
  "Scene: a single small hand-written name-card with a TEAL edge; the handwriting on it is indistinct and unreadable.", [], [], F.prop);
add(SEC_D, "prop_card_blank", "Name-card — blank", "prop_card_blank.png",
  "Scene: a single small plain hand-written card, slightly curled, with faint indistinct unreadable marks.", [], [], F.prop);
add(SEC_D, "prop_chart", "Result chart (teal vs maroon)", "prop_chart.png",
  "Scene: a simple framed results chart showing two flat coloured bars — a tall TEAL bar beside a clearly shorter MAROON bar — and nothing else; no numbers, no readable text.", [], [], F.prop);
add(SEC_D, "prop_map", "Town map prop", "prop_map.png",
  "Scene: a flat stylised town map drawn like a board-game map, with little pictorial buildings clearly readable as a bank, a church and a cinema linked by tidy streets; icons only, no readable labels.", [], [], F.prop);
add(SEC_D, "prop_key", "Key on a ring", "prop_key.png",
  "Scene: a single old-fashioned brass key on a small ring.", [], [], F.prop);
add(SEC_D, "prop_mask", "Costume mask", "prop_mask.png",
  "Scene: a single simple costume eye-mask (a domino mask) with a small ribbon tie.", [], [], F.prop);
add(SEC_D, "prop_flyingmachine", "Lena's flying-machine", "prop_flyingmachine.png",
  "Scene: a single charming home-made cardboard-and-paper flying-machine model with little wings and a propeller.", [], [], F.prop);
add(SEC_D, "prop_banner", "Science-fair banner", "prop_banner.png",
  "Scene: a single hand-painted cloth banner with little star and paper-plane motifs and decorative bunting; any lettering is illegible.", [], [], F.prop);
add(SEC_D, "prop_magnifier", "Magnifying glass", "prop_magnifier.png",
  "Scene: a single classic round magnifying glass with a brass rim and a wooden handle.", [], [], F.prop);
add(SEC_D, "prop_notebook", "Notebook & pencil", "prop_notebook.png",
  "Scene: a single small spiral notebook with a yellow pencil, open to a page of faint indistinct unreadable scribbles.", [], [], F.prop);
add(SEC_D, "prop_casefile", "Case-file folder", "prop_casefile.png",
  "Scene: a single closed manila case-file folder with a small star emblem in the corner; no readable text.", [], [], F.prop);
add(SEC_D, "prop_corkboard", "Evidence corkboard", "prop_corkboard.png",
  "Scene: a plain empty cork pinboard in a simple wooden frame with a few coloured pushpins stuck in it, ready for notes to be added; nothing pinned yet, no readable text.", [], [], F.prop);
add(SEC_D, "prop_cabinet", "Empty trophy cabinet", "prop_cabinet.png",
  "Scene: a single waist-high wood-and-glass trophy cabinet on a stand with an empty velvet plinth inside.", [], [], F.prop);
add(SEC_D, "prop_pinnednote", "Pinned blank note", "prop_pinnednote.png",
  "Scene: a single blank cream note pinned to cork with one red pushpin, slightly tilted; no readable text.", [], [], F.prop);
add(SEC_D, "prop_clock", "Clock at eight (timeline)", "prop_clock.png",
  "Scene: a single round wall clock with a plain face, plain tick-marks and NO numerals, its hands pointing to eight o'clock; a simple clue object.", [], [], F.prop, true);

// ===== E · COVER + END + CHAPTER CARDS =======================================
const SEC_E = "E · Cover & cards";
add(SEC_E, "cover_title", "Cover — The Wrong Name", "cover_title.png",
  "Scene: a friendly mystery cover illustration — Mina and Theo stand before the wood-and-glass trophy cabinet in the entrance hall, Theo raising his magnifying glass, both intrigued; inviting and adventurous.", ["mina", "theo"], [], F.cover);
add(SEC_E, "end_caseclosed", "End card — Case Closed", "end_caseclosed.png",
  "Scene: a calm celebratory end-card still life — a closed manila case-file folder with the gold winged-star medal on its teal ribbon resting on top, a magnifying glass beside it, on a tidy desk; no readable text.", [], [], F.cover);
// 15 chapter title-cards (distinct motif each, mostly object/scene, no text)
const cc = (n, title, motif) =>
  add(SEC_E, `card_ch${n}`, `Chapter card ${n} — ${title}`, `card_ch${String(n).padStart(2, "0")}.png`,
    `Scene: a chapter-title card illustration. ${motif}`, [], [], F.card);
cc(1, "The Empty Glass", "An empty velvet plinth inside the wood-and-glass trophy cabinet, with a single small blank card lying before it; quiet and intriguing.");
cc(2, "Two Questions", "An open spiral notebook and a pencil resting on a school desk ready to take down answers, a quiet corridor visible behind; a calm 'asking questions' mood.");
cc(3, "The Open Door", "A single costume eye-mask hanging on the handle of a school door left ajar to the night.");
cc(4, "The Numbers", "A simple framed chart with a tall TEAL bar beside a short MAROON bar; no numbers, no text.");
cc(5, "The False Trail", "A flat stylised town map with a dotted route winding past a little bank and church; icons only, no labels.");
cc(6, "Who Was Here", "A big jingling ring of keys hanging on a hook beside a closed door.");
cc(7, "A Secret", "A single small brass gadget cradled in a pair of cupped hands, held close to the chest; a quiet, secretive mood.");
cc(8, "The Night", "A round wall clock with plain tick-marks and no numerals reading eight o'clock on a dim corridor wall, a single key hanging on a hook just below it; a quiet night-blue mood.");
cc(9, "A New Medal", "Two identical gold winged-star medals side by side, one with a maroon-edged card and one with a teal-edged card.");
cc(10, "Who Cares", "A little home-made cardboard flying-machine on a workbench under a warm desk lamp.");
cc(11, "Whose Name", "Two small cards with matching indistinct handwriting side by side, a magnifying glass over them; no readable text.");
cc(12, "Ben", "The gold winged-star medal cradled in two cupped hands; a quiet, honest mood.");
cc(13, "Dani", "A maroon varsity jacket left over the back of a wooden chair in a quiet, empty classroom; a lonely mood (no person).");
cc(14, "The True Story", "A corrected teal-edged card being placed beside the simple two-bar chart on a wall; a putting-it-right mood. No text.");
cc(15, "The Right Name", "The gold winged-star medal on its teal ribbon with a teal card, framed by cheerful bunting; a triumphant, warm mood.");

// ── compose() — builds the full self-contained prompt ────────────────────────
function compose(e) {
  const parts = [STYLE, e.scene];
  if (e.chars.length) parts.push(e.chars.map((id) => CHARS[id]).join("\n\n"));
  if (e.world.length) parts.push(e.world.map((k) => W[k]).join(" "));
  parts.push(e.format);
  return parts.join("\n\n");
}

// ── GATE ─────────────────────────────────────────────────────────────────────
const LIMIT = 5000;
const errors = [];
const files = new Set();
let longest = { len: 0, id: null };
const composed = E.map((e) => {
  const prompt = compose(e);
  if (prompt.length >= LIMIT) errors.push(`OVER LIMIT (${prompt.length}): ${e.id}`);
  if (!prompt.includes(STYLE)) errors.push(`missing STYLE block: ${e.id}`);
  for (const c of e.chars) {
    if (!CHARS[c]) errors.push(`unknown character "${c}" in ${e.id}`);
    else if (!prompt.includes(CHARS[c])) errors.push(`missing verbatim spec ${c}: ${e.id}`);
  }
  for (const w of e.world) if (!W[w]) errors.push(`unknown world key "${w}" in ${e.id}`);
  if (files.has(e.file)) errors.push(`duplicate file: ${e.file}`);
  files.add(e.file);
  if (prompt.length > longest.len) longest = { len: prompt.length, id: e.id };
  return { id: e.id, section: e.section, title: e.title, file: e.file, prompt, len: prompt.length, isNew: e.isNew };
});

const bySection = {};
for (const c of composed) bySection[c.section] = (bySection[c.section] || 0) + 1;

console.log("── G2 image-prompt library — gate ──");
console.log(`entries: ${composed.length}`);
for (const [s, n] of Object.entries(bySection)) console.log(`  ${s}: ${n}`);
console.log(`longest prompt: ${longest.len} chars (${longest.id})  [limit ${LIMIT}]`);
console.log(`unique files: ${files.size}/${composed.length}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):`);
  for (const er of errors) console.error("  - " + er);
  process.exit(1);
}
console.log("✓ all prompts < 5000, STYLE + verbatim specs present, files unique.");

// ── EMIT self-contained HTML ─────────────────────────────────────────────────
const DATA_JSON = JSON.stringify(composed);
const BIBLE_JSON = JSON.stringify(CHARS);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>The Wrong Name — G2 image-prompt library</title>
<style>
  :root { --bg:#0f172a; --panel:#1e293b; --card:#fff; --ink:#0f172a; --muted:#64748b; --accent:#2563eb; --ok:#16a34a; --bad:#dc2626; --line:#e2e8f0; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:#f1f5f9; color:var(--ink); }
  header { position:sticky; top:0; z-index:5; background:var(--bg); color:#e2e8f0; padding:14px 18px; box-shadow:0 2px 8px rgba(0,0,0,.2); }
  header h1 { margin:0 0 4px; font-size:18px; }
  header .meta { font-size:12px; color:#94a3b8; }
  header .controls { margin-top:10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
  #q { flex:1; min-width:200px; padding:8px 10px; border-radius:8px; border:1px solid #334155; background:#0b1220; color:#e2e8f0; font-size:14px; }
  .pill { font-size:12px; background:#334155; color:#e2e8f0; border-radius:999px; padding:3px 9px; }
  .pill.bad { background:var(--bad); }
  details.ref { margin:0 18px; background:var(--panel); color:#cbd5e1; border-radius:0 0 10px 10px; padding:10px 14px; font-size:12.5px; }
  details.ref summary { cursor:pointer; color:#e2e8f0; font-weight:600; }
  details.ref pre { white-space:pre-wrap; word-break:break-word; background:#0b1220; padding:10px; border-radius:8px; line-height:1.45; }
  main { padding:18px; max-width:1100px; margin:0 auto; }
  h2.section { font-size:15px; color:#334155; border-bottom:2px solid var(--line); padding-bottom:6px; margin:26px 0 12px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:14px; }
  .entry { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:12px; box-shadow:0 1px 3px rgba(0,0,0,.05); display:flex; flex-direction:column; }
  .entry h3 { margin:0; font-size:14px; }
  .entry .file { font-size:11.5px; color:var(--muted); font-family:ui-monospace,Menlo,monospace; }
  .entry .row { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; }
  .count { font-size:11px; font-weight:700; color:var(--ok); white-space:nowrap; }
  .count.bad { color:var(--bad); }
  textarea { width:100%; height:150px; resize:vertical; font:12px/1.5 ui-monospace,Menlo,monospace; padding:9px; border:1px solid var(--line); border-radius:8px; background:#f8fafc; color:#0f172a; }
  .copy { margin-top:8px; align-self:flex-start; background:var(--accent); color:#fff; border:0; border-radius:8px; padding:7px 14px; font-size:13px; cursor:pointer; }
  .copy.done { background:var(--ok); }
  .entry.new { border-color:var(--ok); box-shadow:0 0 0 2px rgba(22,163,74,.25); }
  .badge-new { font-size:10px; font-weight:800; color:#fff; background:var(--ok); border-radius:6px; padding:2px 6px; margin-left:6px; letter-spacing:.04em; vertical-align:1px; }
  .hidden { display:none; }
  footer { text-align:center; color:var(--muted); font-size:12px; padding:24px; }
</style>
</head>
<body>
<header>
  <h1>The Wrong Name — image-prompt library <span class="pill" id="total"></span> <span class="pill" id="over"></span> <span class="pill" id="newcount"></span></h1>
  <div class="meta">Style: clean-line / ligne claire · Tool: ChatGPT / GPT-image · Every prompt is self-contained &amp; under 5000 chars. Paste each one as-is.</div>
  <div class="controls">
    <input id="q" placeholder="Filter by title, section, filename or words…" />
    <label class="pill" style="cursor:pointer"><input type="checkbox" id="onlynew" style="vertical-align:-1px; margin-right:5px" />show only NEW</label>
    <span class="pill" id="shown"></span>
  </div>
</header>
<details class="ref">
  <summary>How to use · style block · character bible</summary>
  <p><b>How to use:</b> click <b>Copy</b> and paste the whole prompt into ChatGPT / GPT-image as-is — the style and the relevant character descriptions are already baked into every prompt. For the strongest consistency, generate a character's <i>full-body reference</i> (Section A) first, then in ChatGPT attach that image alongside a scene prompt; keep to one main character per image where you can. All prompts are deliberately <b>text-free</b> (facts are shown visually — e.g. the result gap is a tall teal bar vs a short maroon bar).</p>
  <p><b>Style block (in every prompt):</b></p>
  <pre id="styleref"></pre>
  <p><b>Character bible (embedded verbatim where each appears):</b></p>
  <pre id="bibleref"></pre>
</details>
<main id="root"></main>
<footer>Generated from docs/art/build-g2-prompts.mjs · re-run to regenerate.</footer>
<script>
const DATA = ${DATA_JSON};
const STYLE = ${JSON.stringify(STYLE)};
const BIBLE = ${BIBLE_JSON};
document.getElementById("styleref").textContent = STYLE;
document.getElementById("bibleref").textContent = Object.values(BIBLE).join("\\n\\n");
const root = document.getElementById("root");
const overCount = DATA.filter(d => d.len >= 5000).length;
document.getElementById("total").textContent = DATA.length + " prompts";
const overPill = document.getElementById("over");
overPill.textContent = overCount === 0 ? "all under 5000 ✓" : overCount + " over 5000 ✗";
if (overCount) overPill.classList.add("bad");
document.getElementById("newcount").textContent = DATA.filter(d => d.isNew).length + " NEW";

const sections = [...new Set(DATA.map(d => d.section))];
const qEl = document.getElementById("q");
const onlyNewEl = document.getElementById("onlynew");
function render() {
  const f = (qEl.value || "").trim().toLowerCase();
  const onlyNew = onlyNewEl.checked;
  root.innerHTML = "";
  let shown = 0;
  for (const sec of sections) {
    const items = DATA.filter(d => d.section === sec
      && (!onlyNew || d.isNew)
      && (!f || (d.title + " " + d.section + " " + d.file + " " + d.prompt).toLowerCase().includes(f)));
    if (!items.length) continue;
    const h = document.createElement("h2");
    h.className = "section";
    h.textContent = sec + "  (" + items.length + ")";
    root.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "grid";
    for (const d of items) {
      shown++;
      const el = document.createElement("div");
      el.className = "entry" + (d.isNew ? " new" : "");
      const bad = d.len >= 5000 ? " bad" : "";
      el.innerHTML =
        '<div class="row"><div><h3>' + d.title + (d.isNew ? ' <span class="badge-new">NEW</span>' : '') + '</h3><div class="file">' + d.file + '</div></div>' +
        '<div class="count' + bad + '">' + d.len + ' / 5000</div></div>' +
        '<textarea readonly></textarea>' +
        '<button class="copy">Copy prompt</button>';
      el.querySelector("textarea").value = d.prompt;
      const btn = el.querySelector(".copy");
      btn.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(d.prompt); }
        catch { const t = el.querySelector("textarea"); t.select(); document.execCommand("copy"); }
        btn.textContent = "Copied!"; btn.classList.add("done");
        setTimeout(() => { btn.textContent = "Copy prompt"; btn.classList.remove("done"); }, 1200);
      });
      grid.appendChild(el);
    }
    root.appendChild(grid);
  }
  document.getElementById("shown").textContent = shown + " shown";
}
qEl.addEventListener("input", render);
onlyNewEl.addEventListener("change", render);
render();
</script>
</body>
</html>
`;

const OUT = join(HERE, "g2-wrong-name-prompts.html");
writeFileSync(OUT, html, "utf8");
console.log(`\n✓ wrote ${OUT} (${(html.length / 1024).toFixed(0)} KB)`);

// Stem manifest (consumed by the art-sync script + the art.json filename check).
const FILES = join(HERE, "g2-art-files.json");
const stems = composed.map((c) => ({ stem: c.file.replace(/\.png$/, ""), file: c.file, section: c.section, isNew: c.isNew }));
writeFileSync(FILES, JSON.stringify({ schema: "g2-art-files@1", count: stems.length, stems }, null, 2), "utf8");
console.log(`✓ wrote ${FILES} (${stems.length} stems)`);
