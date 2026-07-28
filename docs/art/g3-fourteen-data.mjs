// Data for the G3 "FOURTEEN" image library. Pure data — no I/O, no composition.
// `build-g3-prompts.mjs` composes and gates it; `build-g3-art-json.mjs` places it.
//
// WHAT THIS LIBRARY COVERS (236 stems):
//   14 chapter backdrops   — the banner on every scene that has no beat of its own
//  141 scene beats         — one per scene, the banner for that moment
//   23 character portraits — the 46px speaker bust, in the emotional state that scene needs
//   42 task panels         — the picture beside a task (53 slot keys; the 14 recaps share 3)
//   16 frames              — the cover, the end card, and the 14 episode cards
//
// FOUR RULES EVERY ENTRY OBEYS
//  1. Self-contained. A prompt is pasted into a generator alone, so the style block, the
//     character locks, the world, the colour grade and the negative are all repeated in
//     every single one. Nothing here says "as before".
//  2. No readable text, anywhere. This is a language-learning app: baked-in English in a
//     picture would be un-translatable and un-editable. Screens are drawn with the SCREEN
//     block — abstract ink strokes, no letterforms. It reads perfectly; it says nothing.
//  3. No real brands, platforms, landmarks or people. The story names a famous liner, a
//     famous inventor and London landmarks; the pictures name none of them.
//  4. The costume rules ARE the arc. Ben's vest opens, then zips shut like armour, then
//     hangs open, then zips comfortable. Leah's glasses come off. Leo's hair goes back.
//     A reader who never read a word should be able to feel the story from the busts.

// ── The style block: opens every prompt, verbatim ────────────────────────────
export const STYLE =
  "Semi-realistic young graphic novel illustration. Modern European teen drama aesthetic. " +
  "Clean confident linework with subtle ink wash textures. Natural proportions, expressive faces, " +
  "believable contemporary clothing. Rich but grounded colour palette. Aged 12-13 characters.";

// ── The negative: closes every prompt, verbatim ──────────────────────────────
export const NEG =
  "No readable text, letters, numbers, logos, brand marks or watermarks anywhere in the image. " +
  "No real people, no recognisable public figures, no real place names, no famous landmarks.";

// ── Screens: how a phone or laptop is drawn without a word on it ─────────────
// Proven in Koki's own existing library (the midnight-phone-reading scene): a screen full
// of abstract grey strokes reads unmistakably as comments, and breaks no rule.
export const SCREEN =
  "Any screen content is rendered as abstract grey ink strokes and soft blocks suggesting " +
  "lines of text — no letterforms, no numerals, no glyphs of any kind. Interface chrome is " +
  "generic and unbranded: plain rounded rectangles, a circle avatar, a small triangle, a bare " +
  "heart outline. No platform logo, no wordmark, no recognisable app identity.";

// ── Character visual-locks: embedded wherever a character appears ────────────
export const CH = {
  leah: "LEAH (13, host): dark curly hair in a high messy bun with a neon-green scrunchie; oversized round tortoiseshell glasses with amber frames; cropped medium-wash denim jacket; red worn high-top sneakers; a phone always visible; olive skin, sharp jawline, intense dark brown eyes.",
  leo: "LEO (13, editor): straight jet-black hair falling over his LEFT eye with the right eye visible; thin silver chain necklace; oversized charcoal-black hoodie with sleeves pushed to the elbows; matte-black over-ear headphones (on his head or around his neck); pale skin, angular quiet face.",
  ben: "BEN (13, the heart): messy sandy-blond wavy hair sticking up in all directions; freckles across his nose and cheeks; a small gap between his front teeth when he smiles; a bright orange puffer vest over clashing bright colours; slightly shorter than the others; warm brown eyes, round open face.",
  sara: "SARA (15, the moral compass): long straight dark hair with a single silver-blonde streak on the left from the temple; one small gold hoop in the left ear; a minimalist monochrome black/white/grey outfit; tall and composed; light brown skin, high cheekbones.",
  // The player is a projection: the face is never clearly shown. Side profile with the
  // face turned away is allowed (the image bible's own wording) — it keeps the projection
  // intact while letting a scene show what YOU are looking at.
  you: "YOU (13, the writer): ALWAYS seen from behind, over the shoulder, or in side profile with the face turned away or obscured — a clear frontal face is never shown. A plain grey hoodie, dark hair; a notebook or phone in hand.",
};

// ── Emotional / costume states: the arc, made visible ────────────────────────
// Appended after a character's lock when a scene calls for it. Every one of these is a
// change a reader can SEE at 46 pixels; that is the test each had to pass.
export const STATE = {
  ben: {
    presenting: "He is mid-presentation, arms open, completely unguarded, gap-toothed grin at its widest; vest open.",
    uncertain: "His smile is holding on but his eyes have gone searching, asking a question he has not said out loud; vest open.",
    proud: "He is genuinely, uncomplicatedly proud — chin up, delighted with himself; vest open.",
    hurt: "His orange puffer vest is ZIPPED UP TIGHT, like armour; arms crossed; no gap-toothed smile at all; the freckles read against a pale set face.",
    confront: "His vest hangs UNZIPPED and open like something broken; eyes red-rimmed but dry; jaw set; he is quiet, not shouting.",
    brave: "His vest is zipped comfortably, not defensively; shoulders down, breathing; a small real smile that is nothing like the old performing one.",
  },
  leah: {
    excited: "She is lit up, leaning in, phone raised, absolutely certain this is going to work.",
    scheming: "She is not smiling with her eyes — pen or phone in hand, calculating, already a step ahead of everyone in the room.",
    defensive: "Her jaw is set and her chin is up, arms folded; she is defending a decision she knows is bad.",
    hollow: "The certainty has drained out; she is looking past whoever is in front of her, phone loose in her hand.",
    guilty: "Her oversized round glasses are OFF, held loosely in one hand; her dark eyes are raw and exposed; she has been crying and has stopped.",
    honest: "Glasses back on, hands open, nothing performed left in her at all — she is saying a true thing and letting it cost her.",
  },
  leo: {
    filming: "He is behind a phone on a tripod, one eye on the frame, entirely absorbed in the shot.",
    uneasy: "He has stopped watching the frame and started watching the room; a small frown he is not aware of.",
    exposed: "For the first time his black hair is pushed BACK off his face — both eyes visible, red-rimmed and hollow.",
  },
  sara: {
    serious: "She is direct and unhurried, looking straight at whoever she is speaking to; nothing performed.",
    warm: "Her composure has softened into something genuinely kind; the first real smile she has given anyone.",
  },
  you: {
    desk: "Seen in side profile at a desk, face turned away and lit only by a screen; shoulders forward.",
    shaken: "Seen from behind, hands visibly unsteady, shoulders tight.",
  },
};

// ── World anchors ────────────────────────────────────────────────────────────
export const W = {
  studio: "Setting: a teenager's bedroom turned into a tiny filming studio — a ring light on a stand, a phone clamped on a small tripod, fairy lights, plain flat-pack furniture, posters with no readable text.",
  school: "Setting: a realistic Austrian secondary-school interior — lockers, fluorescent lighting, scuffed floors.",
  street: "Setting: a generic European old-town street with anonymous stone buildings and a wide grey river; no brand signage, no recognisable landmark, no readable text.",
  park: "Setting: a quiet park at dusk, a wooden bench, bare trees, cool blue light.",
  home: "Setting: an ordinary family living room — a worn sofa, a cluttered shelf, a hall door standing open behind.",
  desk: "Setting: a dark bedroom at night, lit only by a laptop or phone screen; the rest of the room falling away into shadow.",
};

// ── Format presets by class ──────────────────────────────────────────────────
// The banner and the task panel both render in a 16:9 box, so every wide class states
// the same central-band rule and nothing important sits near an edge.
const BAND = "Keep the key subject in the middle third vertically, with generous room above and below.";
export const F = {
  portrait: `Composition: a 1:1 close-up portrait bust — head and shoulders filling the frame, eyes on the upper third, warm key light from the left, simple soft out-of-focus background. It will be shown as a small circle, so nothing outside the head and shoulders matters.`,
  beat: `Composition: a 16:9 story frame, cinematic and specific to this exact moment. ${BAND}`,
  backdrop: `Composition: a 16:9 establishing frame of the place itself, no characters in focus — it sits behind many different moments, so it must not tell one. ${BAND}`,
  panel: `Composition: a 16:9 frame of an object or a pair of hands, shallow depth of field, no faces. ${BAND}`,
  card: `Composition: a 16:9 establishing key-art frame, cinematic, room to breathe.`,
  hero: `Composition: a 16:9 hero/title key-art frame, the group as an ensemble, a soft glow of light as the focal point (never an actual symbol).`,
};

// ── Colour grade by arc position ─────────────────────────────────────────────
export const GRADE = {
  warm: "Colour grade: warm, bright, optimistic — golden lamp light.",
  cool: "Colour grade: cooler, more muted, slightly tense — desaturated blues creeping in.",
  grey: "Colour grade: grey, stripped, cold — almost colourless, heavy shadows.",
  honest: "Colour grade: warmth returning but softer and real, a single live-red dot the only saturated colour.",
};

/** The chapter's grade — derived, so no entry can hand-set an off-arc colour. */
export function arcOf(chapter) {
  if (chapter <= 5) return GRADE.warm;
  if (chapter <= 10) return GRADE.cool;
  if (chapter <= 13) return GRADE.grey;
  return GRADE.honest;
}

// ── A · Frames: cover, end card, the 14 episode cards ───────────────────────
export const FRAMES = [
  { id: "cover", stem: "cover_title", cls: "hero", chapter: 1, chars: ["leah", "leo", "ben", "you"], world: "studio",
    scene: "The four friends crowded together behind a ring light, mid-laugh, full of energy at the very start — YOU in the foreground from behind, facing them." },
  { id: "endcard", stem: "end_episode", cls: "hero", chapter: 14, chars: ["ben", "leah", "leo"], world: "studio",
    scene: "Ben mid-sentence, relaxed and real, teaching to camera his own way; the others off to the side, genuinely with him, not filming his mistakes; a single small red live-dot glows." },
];

const card = (n, scene, chars, world) =>
  FRAMES.push({ id: `card-ch${n}`, stem: `card_ch${n}`, cls: "card", chapter: Number(n), chars, world, scene });

card("01", "The four friends crowd around a phone on the ring-light desk, thrilled, planning their very first video together.", ["leah", "leo", "ben", "you"], "studio");
card("02", "Ben reads from a script to the camera, animated and happy; Leo films, Leah watches the phone's view count climb.", ["ben", "leo", "leah"], "studio");
card("03", "Leah leans over a script, pen in hand, quietly marking Ben's lines harder; Ben, oblivious, gives a thumbs-up.", ["leah", "ben"], "studio");
card("04", "Ben on camera looking confused mid-line; Leo zooms the phone in on his face; Leah grins and gives a thumbs-up from behind the camera.", ["ben", "leo", "leah"], "studio");
card("05", "The group watches the glowing phone screen full of reactions; Ben's smile is uncertain, the others fixed on the numbers.", ["ben", "leah", "leo"], "studio");
card("06", "A school-trip group photo in front of a tall anonymous old clock tower and a wide grey river, overcast; YOU stand slightly apart, looking at a phone.", ["leah", "leo", "ben", "you"], "street");
card("07", "The group films a cheerful 'friendship' episode, all smiles for the camera — but YOU, from behind, stand stiff and uneasy at the edge.", ["leah", "leo", "ben", "you"], "studio");
card("08", "A laptop screen crowded with comment bubbles, one of them harsher than the rest highlighted; Leah's hand reaches to swipe it away, her jaw set.", ["leah"], "studio");
card("09", "Ben stands up out of the filming chair, finally pushing back; the others freeze, caught; Leah looks away.", ["ben", "leah", "leo"], "studio");
card("10", "YOU and Sara sit at opposite ends of a park bench at dusk, a serious quiet conversation, breath visible in the cold.", ["you", "sara"], "park");
card("11", "A phone in the dark shows a grid of thumbnail faces — a cruel compilation; its glow lights up a single shocked face, hand trembling.", ["you"], "desk");
card("12", "Ben walks away alone down a long empty school corridor; the group stands frozen behind him, no one following.", ["ben", "leah", "leo"], "school");
card("13", "The group sits in a loose circle on a bedroom floor, the ring light switched off in the corner, no scripts, heads down.", ["leah", "leo", "sara", "you"], "studio");
card("14", "The four plus Ben crowd back together for an honest live broadcast, no script, a single small red live-dot glowing; messy, warm, real.", ["leah", "leo", "ben", "you"], "home");

// ── B · Portraits: 23 busts ─────────────────────────────────────────────────
// `state` names a key in STATE; omitted for the five neutrals.
export const PORTRAITS = [
  { stem: "ben_neutral", char: "ben", chapter: 1, scene: "A wide open gap-toothed grin, completely unguarded." },
  { stem: "ben_presenting", char: "ben", chapter: 2, state: "presenting", scene: "Mid-word to camera, performing happily." },
  { stem: "ben_uncertain", char: "ben", chapter: 5, state: "uncertain", scene: "Asking a question he is afraid of the answer to." },
  { stem: "ben_proud", char: "ben", chapter: 7, state: "proud", scene: "Certain, for once, that he has done well." },
  { stem: "ben_hurt", char: "ben", chapter: 9, state: "hurt", scene: "Finally saying the thing out loud, and braced for it." },
  { stem: "ben_confront", char: "ben", chapter: 12, state: "confront", scene: "Quiet, level, past anger — telling them exactly what happened." },
  { stem: "ben_brave", char: "ben", chapter: 14, state: "brave", scene: "Setting his own terms, calm and unafraid." },

  { stem: "leah_neutral", char: "leah", chapter: 1, scene: "Friendly, confident half-smile, alert and about to speak." },
  { stem: "leah_excited", char: "leah", chapter: 2, state: "excited", scene: "Lit up by a number she has just seen." },
  { stem: "leah_scheming", char: "leah", chapter: 3, state: "scheming", scene: "Deciding something about someone else, quickly and quietly." },
  { stem: "leah_defensive", char: "leah", chapter: 7, state: "defensive", scene: "Refusing, and knowing she is wrong to." },
  // Leah does not speak between ch08 and ch14 — she has no line through the whole
  // reckoning. So `hollow` and `guilty` live only as beat states (in the pictures), and
  // her bust gets the state she actually speaks in again at the end.
  { stem: "leah_honest", char: "leah", chapter: 14, state: "honest", scene: "Saying a true thing and letting it cost her." },

  { stem: "leo_neutral", char: "leo", chapter: 1, scene: "Quiet, watchful, the visible right eye doing the talking." },
  { stem: "leo_filming", char: "leo", chapter: 2, state: "filming", scene: "Absorbed in the shot, one eye on the frame." },
  { stem: "leo_uneasy", char: "leo", chapter: 9, state: "uneasy", scene: "Watching the room instead of the frame." },
  { stem: "leo_exposed", char: "leo", chapter: 13, state: "exposed", scene: "Hair pushed back, both eyes visible, nothing hidden." },

  { stem: "sara_neutral", char: "sara", chapter: 6, scene: "Calm, composed, a steady knowing look." },
  { stem: "sara_serious", char: "sara", chapter: 10, state: "serious", scene: "Asking the question that cannot be dodged." },
  { stem: "sara_warm", char: "sara", chapter: 13, state: "warm", scene: "Kind, and meaning it." },

  { stem: "you_neutral", char: "you", chapter: 1, scene: "From behind: the back of a grey hoodie and dark hair, a phone glow on the shoulder." },
  { stem: "you_desk", char: "you", chapter: 9, state: "desk", scene: "Side profile at a screen late at night, face turned away." },
  { stem: "you_shaken", char: "you", chapter: 11, state: "shaken", scene: "From behind, hands unsteady, shoulders tight." },
];

// ── C · Backdrops: 14, one per chapter ──────────────────────────────────────
// The single highest-leverage class: the banner falls back to the chapter backdrop
// whenever a scene has no beat of its own, so these 14 give all 141 scenes a picture.
export const BACKDROPS = [
  ["01", "studio", "The bedroom studio in the late afternoon, empty and expectant — ring light off, a phone clamped on its tripod, the white sheet backdrop pinned up, everything ready and nobody in it yet."],
  ["02", "studio", "The same bedroom studio at night, ring light glowing into an empty chair, the room warm and lived-in."],
  ["03", "studio", "The studio desk from above: scripts, pens, a cold mug, cables — the working surface of a channel that is starting to take itself seriously."],
  ["04", "studio", "The studio seen past the ring light's ring, the lamp itself in the foreground out of focus, the empty presenting spot beyond it."],
  ["05", "studio", "The studio at dusk with the window blue behind the warm lamp — two light temperatures fighting, nobody in the room."],
  ["06", "street", "A wide grey river under an overcast sky, an anonymous stone bridge and tall old buildings along the far bank; a school-trip city seen from a walkway."],
  ["07", "studio", "The studio dressed for a friendly episode — fairy lights up, cushions arranged, everything a little too staged."],
  ["08", "studio", "The studio corner at night with a laptop open on the floor, its glow the only light, cables trailing away into the dark."],
  ["09", "studio", "The studio with the filming chair pushed back and empty, the ring light still on, the room suddenly too quiet."],
  ["10", "park", "A quiet park at dusk: a wooden bench under bare trees, wet path, cold blue light, nobody on it."],
  ["11", "desk", "A dark bedroom at night, one phone face-up on the covers throwing a hard pale rectangle of light at the ceiling."],
  ["12", "school", "A long empty school corridor, lockers down one side, fluorescent light, scuffed floor, a door at the far end."],
  ["13", "studio", "The studio with the ring light unplugged and lying on its side, the floor cleared, cushions scattered where people have been sitting."],
  ["14", "home", "An ordinary family living room with the hall door open behind it, afternoon light, a worn sofa and a cluttered shelf — nothing staged at all."],
];

// ── D · Beats: one per scene, 141 ───────────────────────────────────────────
// key = "chNN.sNNN" · [subject, chars, world, opts]
//   chars: space-separated character keys · opts: "screen" adds the SCREEN block,
//   "state:char=name" applies a costume/emotional state to that character.
export const BEATS = {
  // ch01 · Sound On — warm. The seed of innocence.
  "ch01.s001": ["Leah holds her phone out to the others, a stranger's channel open on it, her whole body a question: why not us?", "leah you", "studio", "screen"],
  "ch01.s002": ["YOU, from behind, hold up a battered English schoolbook next to the phone, making the case — the book and the camera in the same frame for the first time.", "you leah", "studio", ""],
  "ch01.s003": ["Leo, unconvinced, arms folded, headphones around his neck, looking at the setup rather than the people.", "leo", "studio", "state:leo=uneasy"],
  "ch01.s004": ["Ben raises a hand, in without hesitating, his grin wide and slightly nervous at the same time.", "ben", "studio", ""],
  "ch01.s005": ["Leah bent over a fresh script page on the desk, pen poised, looking up to ask for help.", "leah", "studio", ""],
  "ch01.s006": ["A hand slides the script across the desk toward YOU; two heads over one page.", "you leah", "studio", ""],
  "ch01.s007": ["The ring light snaps on in a dark room and everything inside its circle goes bright — the first take of the channel's life.", "", "studio", ""],
  "ch01.s008": ["Ben framed INSIDE the phone's viewfinder on the tripod, mid-word, lit and happy; the room dark around the little bright rectangle.", "ben leo", "studio", "state:ben=presenting"],
  "ch01.s009": ["Four faces crowded around one phone in the dark, all lit from below by it, delighted at a number none of them can quite believe.", "leah leo ben you", "studio", "screen"],
  "ch01.s010": ["Ben alone after the others have turned away, asking the room a question in a smaller voice than he used on camera.", "ben", "studio", "state:ben=uncertain"],
  "ch01.s011": ["YOU from behind in the doorway, looking back at the lit studio as the others pack up — the last frame of a completely innocent evening.", "you", "studio", ""],

  // ch02 · No Way! — warm. Leah names the mechanism out loud.
  "ch02.s001": ["YOU, from behind, chalk an episode number on a small board propped against the ring light — the channel has a routine now.", "you", "studio", ""],
  "ch02.s002": ["Leah holds open an old cloth-bound book at a page of engraved illustrations of a great ocean liner, delighted by the coincidence she has found.", "leah", "studio", ""],
  "ch02.s003": ["YOU from behind at the desk over a script page, one of Ben's lines circled in front of you and Leah's pen still resting on the circle.", "you leah", "studio", ""],
  "ch02.s004": ["A closer view of the same page: a blank ruled gap where a word should be, pen tip hovering over it.", "you", "studio", ""],
  "ch02.s005": ["The tripod phone in the foreground, sharply focused; Ben beyond it soft and waiting for the nod.", "ben leo", "studio", ""],
  "ch02.s006": ["Ben inside the viewfinder rectangle mid-line, animated and completely unaware, the red record dot bright in the corner.", "ben", "studio", "state:ben=presenting"],
  "ch02.s007": ["Leah's face lit hard by her phone in a dark room at midnight, watching a number she cannot stop refreshing.", "leah", "desk", "screen state:leah=excited"],
  "ch02.s008": ["Leah turns to the others with the phone still in her hand and says the quiet part out loud; Leo's smile has not caught up yet.", "leah leo", "studio", "state:leah=scheming"],
  "ch02.s009": ["Ben holding the phone himself for once, reading his own comments, proud of the wrong thing.", "ben", "studio", "screen state:ben=proud"],
  "ch02.s010": ["YOU from behind at the desk after everyone has gone, one line written in a notebook, pen stopped.", "you", "desk", "state:you=desk"],

  // ch03 · Off the Map — warm, and the decision that poisons everything.
  "ch03.s001": ["YOU from behind pinning a hand-drawn map of nowhere in particular to the white sheet backdrop — the episode's set dressing.", "you", "studio", ""],
  "ch03.s002": ["Leo leans in from behind the camera to ask Ben a question, genuinely interested, still on his side.", "leo ben", "studio", "state:leo=filming"],
  "ch03.s003": ["Two pens over one script page, the two of you working; Leah's hand already reaching in from the edge of the frame.", "you leah", "studio", ""],
  "ch03.s004": ["YOU in side profile over the script page, face turned away, looking at a whole clause struck through and rewritten longer and harder in Leah's different pen.", "you leah", "studio", ""],
  "ch03.s005": ["Ben settles into the filming chair and squares up to the camera, cheerful, cracking his knuckles.", "ben", "studio", ""],
  "ch03.s006": ["Ben mid-line in the viewfinder, tripping over a sentence, laughing at himself; the record dot burning.", "ben", "studio", "state:ben=presenting"],
  "ch03.s007": ["A laptop screen on the studio floor showing a view-count line climbing steeply, the graph drawn as a bare ascending stroke, faces lit by it.", "leah leo", "studio", "screen"],
  "ch03.s008": ["Leah, pen in hand, deliberately rewriting a line on Ben's script to make it harder — the single most important gesture in the whole story.", "leah", "studio", "state:leah=scheming"],
  "ch03.s009": ["The room after the decision: three people not looking at each other, the ring light still humming.", "leah leo you", "studio", ""],
  "ch03.s010": ["YOU from behind at the window, the town outside, saying nothing — the silence that makes you part of it.", "you", "studio", ""],

  // ch04 · Beautiful Danger — warm, and Ben starts to notice.
  "ch04.s001": ["YOU from behind arranging a row of plastic animal figures on the desk as props for the episode.", "you", "studio", ""],
  "ch04.s002": ["Leah hands Ben a script with a small private smile that does not reach her eyes; Ben takes it without reading it.", "leah ben", "studio", "state:leah=scheming"],
  "ch04.s003": ["YOU from behind over a script page dense with long words, your own pen circling one of them.", "you", "studio", ""],
  "ch04.s004": ["A blank gap in the middle of a difficult sentence, pen tip poised over it, the paper slightly creased.", "you", "studio", ""],
  "ch04.s005": ["Ben in the chair reading ahead silently, mouth moving, a first small frown.", "ben", "studio", "state:ben=uncertain"],
  "ch04.s006": ["Ben inside the viewfinder, stopped mid-sentence, genuinely confused; Leo's hand on the phone pushing the zoom closer to his face.", "ben leo", "studio", "state:ben=uncertain"],
  "ch04.s007": ["Leah showing Leo her phone with delight — a stranger's approval, held up like a trophy.", "leah leo", "studio", "screen state:leah=excited"],
  "ch04.s008": ["Ben asks his question in the quiet after filming, script still in his hand, looking at Leah and not at the camera.", "ben leah", "studio", "state:ben=uncertain"],
  "ch04.s009": ["Leah's answer lands: she is smiling and it is kind and it is a lie, and Ben believes it.", "leah ben", "studio", ""],
  "ch04.s010": ["Ben smiling at nothing in particular as he winds a cable; YOU from behind in the foreground, watching him do it.", "ben you", "studio", ""],

  // ch05 · What If? — the last warm chapter; Ben asks directly.
  "ch05.s001": ["YOU from behind hanging a string of paper cut-outs across the backdrop, dressing the set for a lighter episode.", "you", "studio", ""],
  "ch05.s002": ["Leah says the word 'brand' about a person, phone in hand, entirely businesslike.", "leah", "studio", "state:leah=scheming"],
  "ch05.s003": ["The script page half-written, two different handwritings on it, the desk lamp low.", "you leah", "studio", ""],
  "ch05.s004": ["A conditional sentence on the page with its second half missing, the gap ruled and waiting.", "you", "studio", ""],
  "ch05.s005": ["Ben in the chair with the ring light in his eyes, taking a breath before the take.", "ben", "studio", ""],
  "ch05.s006": ["Ben mid-line inside the viewfinder, hitting the sentence wrong, and this time noticing that he has.", "ben", "studio", "state:ben=uncertain"],
  "ch05.s007": ["The whole group's faces lit blue-white by one phone held between them, the reactions scrolling past as abstract strokes; Ben leaning in last.", "leah leo ben", "studio", "screen"],
  "ch05.s008": ["Ben, alone in the frame, asking the question the entire story rests on — do they like ME, or just my mistakes?", "ben", "studio", "state:ben=uncertain"],
  "ch05.s009": ["Leah answers yes; her eyes are already going back down to her phone as she says it.", "leah ben", "studio", ""],
  "ch05.s010": ["YOU from behind, watching Leah's face lit by the screen instead of watching Ben — the moment you saw it and did nothing.", "you leah", "studio", "screen"],

  // ch06 · London Calling — the band turns cool. Sara's warning.
  "ch06.s001": ["The four of them on a bridge walkway over a wide grey river, coats and rucksacks, a school trip in overcast light.", "leah leo ben you", "street", ""],
  "ch06.s002": ["Leo frames a shot of an anonymous tall old clock tower with his phone, excited about the footage for once.", "leo", "street", "state:leo=filming"],
  "ch06.s003": ["A notebook open on a low stone wall, wind lifting the page, two heads bent over it.", "you leah", "street", ""],
  "ch06.s004": ["The same notebook closer: a sentence with a hole in it, a pen held against the wind.", "you", "street", ""],
  "ch06.s005": ["Ben set up against the river with the phone on its tripod, reading from a card, the wind in his hair.", "ben leo", "street", ""],
  "ch06.s006": ["Ben inside the viewfinder against the grey water, mid-fact, cheerful and wrong.", "ben", "street", "state:ben=presenting"],
  "ch06.s007": ["A phone face-up on a hostel bed in the dark, a message notification glowing on it, nobody holding it yet.", "", "desk", "screen"],
  "ch06.s008": ["Sara in a school corridor, direct and unhurried, asking her question of someone off-frame.", "sara", "school", "state:sara=serious"],
  "ch06.s009": ["Sara further down the emptying corridor, saying the harder half of it — the warning, not the question — with nobody else left to overhear.", "sara", "school", "state:sara=serious"],
  "ch06.s010": ["YOU from behind putting the phone face-down on the bed and not moving — the decision to say nothing.", "you", "desk", ""],

  // ch07 · Friends Forever? — the friendship episode, filmed by people betraying a friend.
  "ch07.s001": ["The studio dressed for a friendship episode: fairy lights, cushions, everything warm and everything staged.", "you", "studio", ""],
  "ch07.s002": ["Leah gives a direction from behind the camera; her tone is management, not friendship.", "leah", "studio", "state:leah=scheming"],
  "ch07.s003": ["The script on the desk with a warm friendly topic at the top and a difficult sentence underneath it.", "you", "studio", ""],
  "ch07.s004": ["A gap in a sentence about how long people have known each other, pen waiting over it.", "you", "studio", ""],
  "ch07.s005": ["Ben in the chair with a cushion in his lap, ready to talk about friends, entirely sincere.", "ben", "studio", ""],
  "ch07.s006": ["Ben inside the viewfinder, warm and open, getting the sentence wrong while meaning every word of it.", "ben", "studio", "state:ben=presenting"],
  "ch07.s007": ["YOU, in side profile with the face turned away, asking Leah something quietly in a corridor doorway.", "you leah", "studio", ""],
  "ch07.s008": ["Leah refuses, chin up, arms folded — and underneath the refusal is fear of being nobody again.", "leah", "studio", "state:leah=defensive"],
  "ch07.s009": ["Ben celebrating the episode, arms up, genuinely proud of his English for the first time.", "ben", "studio", "state:ben=proud"],
  "ch07.s010": ["A notebook page on a desk in lamplight with one short line written on it and the pen laid across the page.", "you", "desk", ""],

  // ch08 · Game Changers — the cruel comment arrives.
  "ch08.s001": ["The studio dressed as a small workshop for an inventions episode: a lamp, tools, a coil of wire on the desk.", "you", "studio", ""],
  "ch08.s002": ["Leah scrubbing a timeline on a laptop, dragging a long segment wider — the mistakes reel getting its own runtime.", "leah", "studio", "screen state:leah=scheming"],
  "ch08.s003": ["The script page under the desk lamp, a technical sentence marked up in two colours of pen.", "you leah", "studio", ""],
  "ch08.s004": ["A gap in a sentence about something someone has seen, the paper shadowed by a hand.", "you", "studio", ""],
  "ch08.s005": ["Ben in the chair with a small model in his hands, turning it over, rehearsing under his breath.", "ben", "studio", ""],
  "ch08.s006": ["Ben inside the viewfinder mid-line about an inventor, holding the model up to the lens, delighted.", "ben", "studio", "state:ben=presenting"],
  "ch08.s007": ["A laptop on the studio floor at night, its comment column drawn as rows of abstract strokes — and one row noticeably darker and heavier than the rest.", "", "desk", "screen"],
  "ch08.s008": ["A thumb hovering over that one darker row, not scrolling past it — the first comment that tells the truth.", "you", "desk", "screen"],
  "ch08.s009": ["Leah swipes the screen away, jaw set, already talking about something else.", "leah", "studio", "screen state:leah=defensive"],
  "ch08.s010": ["YOU in side profile at the desk in the dark, saving that one comment to a folder, face turned away from the light.", "you", "desk", "screen state:you=desk"],

  // ch09 · My Rules — the confrontation.
  "ch09.s001": ["The studio set for a school-rules episode, a chalkboard prop leaning against the backdrop.", "you", "studio", ""],
  "ch09.s002": ["Leo looks up from the camera at Ben and asks for a break, the first time he has put a person before the shot.", "leo ben", "studio", "state:leo=uneasy"],
  "ch09.s003": ["The script page with a rule sentence on it, a pen tapping beside a difficult construction.", "you", "studio", ""],
  "ch09.s004": ["A gap in a sentence about what is and is not allowed, the ruled line waiting.", "you", "studio", ""],
  "ch09.s005": ["Ben in the chair looking genuinely tired, rubbing his eyes before the take.", "ben", "studio", ""],
  "ch09.s006": ["Ben inside the viewfinder, flat and going through the motions, the performance gone out of him.", "ben", "studio", "state:ben=uncertain"],
  "ch09.s007": ["Ben out of the chair and standing, vest zipped tight, saying the thing he has been swallowing for nine episodes.", "ben leah leo", "studio", "state:ben=hurt"],
  "ch09.s008": ["The room after it: nobody moving, Leah's eyes on the floor, the ring light still on and pointing at an empty chair.", "leah leo", "studio", "state:leah=hollow"],
  "ch09.s009": ["A dark bedroom, YOU in side profile at a laptop working through every video in the channel's history, face turned away, lit only by the screen.", "you", "desk", "screen state:you=desk"],
  "ch09.s010": ["Hands typing a message on a phone in the dark, the text drawn as abstract strokes, one thumb hesitating over sending it.", "you", "desk", "screen"],

  // ch10 · Speak Up — Sara's mirror.
  "ch10.s001": ["The studio set for an episode about rights, a stack of library books on the desk.", "you", "studio", ""],
  "ch10.s002": ["Leah presenting the topic to the others, briefly and genuinely interested in something outside the numbers.", "leah leo", "studio", ""],
  "ch10.s003": ["The script page with a serious topic at the top, written more carefully than usual.", "you", "studio", ""],
  "ch10.s004": ["A gap in a sentence about permission, the pen resting in the crease of the page.", "you", "studio", ""],
  "ch10.s005": ["Ben in the chair, subdued, reading his card before the take instead of joking.", "ben", "studio", "state:ben=uncertain"],
  "ch10.s006": ["Ben inside the viewfinder saying a sentence about being allowed to do something, and getting it wrong, and nobody in the room laughing this time.", "ben", "studio", "state:ben=uncertain"],
  "ch10.s007": ["Sara waiting alone on a park bench at dusk, coat buttoned, breath visible, having chosen this place deliberately.", "sara", "park", ""],
  "ch10.s008": ["Sara telling YOU what happened to her, unhurried and direct, the two of you at opposite ends of the bench.", "sara you", "park", "state:sara=serious"],
  "ch10.s009": ["Sara asks the question that cannot be dodged, and waits; YOU from behind, not answering.", "sara you", "park", "state:sara=serious"],
  "ch10.s010": ["YOU from behind walking home in the dark past a lit shop window, a phone dark in your hand — a milestone that means nothing.", "you", "street", ""],

  // ch11 · Going Viral — the reckoning.
  "ch11.s001": ["The studio set for an episode about the internet, a wall of printed screenshots pinned up as decoration, none of them readable.", "you", "studio", ""],
  "ch11.s002": ["A dark bedroom ceiling with a hard pale rectangle of phone-light thrown across it — someone awake and thinking for the fourth night running.", "", "desk", ""],
  "ch11.s003": ["The script page barely worked on, the pen down, the writer's attention somewhere else entirely.", "you", "studio", ""],
  "ch11.s004": ["A gap in a sentence about how long something has been going on, the page untouched around it.", "you", "studio", ""],
  "ch11.s005": ["Ben in the chair, obedient, waiting for the nod — the performance is a habit now.", "ben", "studio", ""],
  "ch11.s006": ["Ben inside the viewfinder mid-line, and for the first time the framing itself feels cruel: the rectangle, the record dot, his face too close.", "ben", "studio", ""],
  "ch11.s007": ["A phone screen in the dark showing two thumbnail rows, the crueller row visibly bigger and brighter than the kind one.", "", "desk", "screen"],
  "ch11.s008": ["A hand-written tally on a notebook page, stroke after stroke after stroke — someone has been counting Ben's mistakes for a very long time.", "", "desk", ""],
  "ch11.s009": ["A phone in the dark showing a grid of six small thumbnails, all of them the same boy's face pulled into the same wince — a compilation made from their own clips.", "", "desk", "screen"],
  "ch11.s010": ["YOU from behind holding the phone, hands visibly unsteady, shoulders tight, the grid still glowing.", "you", "desk", "screen state:you=shaken"],

  // ch12 · When It All Falls Apart — Ben's passive-voice reckoning.
  "ch12.s001": ["The studio with the filming chair empty and the ring light unlit, an episode that was going to be recorded and now will not be.", "", "studio", ""],
  "ch12.s002": ["A school report page on a desk, handwritten in even lines, nothing like a script — a different kind of writing entirely.", "you", "school", ""],
  "ch12.s003": ["The same page closer: one sentence left unfinished, the pen laid down beside it.", "you", "school", ""],
  "ch12.s004": ["A phone lying on a made bed in a lit room, the compilation still open on it, its owner nowhere in the frame.", "", "home", "screen"],
  "ch12.s005": ["Ben walking up a school corridor toward the group, unhurried, vest hanging open, everyone else frozen where they stand.", "ben leah leo", "school", "state:ben=confront"],
  "ch12.s006": ["Ben close, quiet, level — saying what was done to him rather than what he feels, which is worse.", "ben", "school", "state:ben=confront"],
  "ch12.s007": ["Over Ben's shoulder in the foreground: Leah and Leo taking it, neither able to look at him, Leo's hair pushed back off his face for the first time.", "ben leah leo", "school", "state:ben=confront state:leah=hollow state:leo=exposed"],
  "ch12.s008": ["Ben finishing: the word 'friend' landing in a corridor where nobody has moved.", "ben", "school", "state:ben=confront"],
  "ch12.s009": ["Ben walking away down the long corridor, small against the far door; three people standing exactly where he left them.", "ben leah leo", "school", "state:ben=confront"],
  "ch12.s010": ["A phone face-down on a table beside an untouched drink; nobody reaching for it.", "", "home", ""],

  // ch13 · What Would You Do? — regret in the subjunctive.
  "ch13.s001": ["The studio floor with the ring light unplugged and lying on its side, cable coiled, three days of dust.", "", "studio", ""],
  "ch13.s002": ["Three people sitting on the floor in a loose circle with nothing in their hands — no scripts, no phones.", "leah leo you", "studio", "state:leah=guilty"],
  "ch13.s003": ["Leo against the wall with his hair pushed back and both eyes visible, saying the thing everyone is thinking.", "leo", "studio", "state:leo=exposed"],
  "ch13.s004": ["YOU in side profile, face turned away, a notebook open and unwritten on your knees.", "you", "studio", ""],
  "ch13.s005": ["Sara arriving and sitting down on the floor with them without being asked, joining the circle rather than judging it.", "sara leah leo", "studio", "state:sara=warm"],
  "ch13.s006": ["Sara saying something true and unconsoling, hands around her knees.", "sara", "studio", "state:sara=warm"],
  "ch13.s007": ["The circle listening — the first moment since the reckoning that anyone is actually talking to anyone.", "sara leah leo you", "studio", ""],
  "ch13.s008": ["Leah with her glasses off in her hand, crying and past crying; Leo looking at the floor beside her.", "leah leo", "studio", "state:leah=guilty state:leo=exposed"],
  "ch13.s009": ["Sara's hand resting flat on the floorboards between them — you cannot undo it, but you can choose what comes next.", "sara", "studio", "state:sara=warm"],
  "ch13.s010": ["YOU from behind picking up a phone — not to check anything, but to make a call.", "you", "studio", ""],

  // ch14 · For Real This Time — honest.
  "ch14.s001": ["Four people standing on an ordinary front doorstep with nothing in their hands, waiting for someone to open the door.", "leah leo you", "home", ""],
  "ch14.s002": ["Leah in a living room saying it plainly, glasses back on, nothing performed about her at all.", "leah", "home", "state:leah=honest"],
  "ch14.s003": ["Ben on the sofa, vest zipped comfortably, listening properly before he answers.", "ben", "home", "state:ben=brave"],
  "ch14.s004": ["Leah with her hands open, offering the decision to Ben and meaning it.", "leah ben", "home", "state:leah=honest"],
  "ch14.s005": ["Ben setting the terms, calm and unafraid, the whole room turned toward him.", "ben leah leo", "home", "state:ben=brave"],
  "ch14.s006": ["A blank page and a pen pushed across a coffee table toward Ben — his line, his words, for the first time.", "you ben", "home", ""],
  "ch14.s007": ["Ben writing his own sentence, everyone else leaning in to help rather than to watch.", "ben leah leo you", "home", "state:ben=brave"],
  "ch14.s008": ["Two hands over one page, one of them Ben's, finishing a line together.", "you ben", "home", ""],
  "ch14.s009": ["The five of them crowded into a living-room shot going live, no ring light, no white sheet, one small red dot glowing — messy and honest.", "ben leah leo you", "home", ""],
  "ch14.s010": ["The living room after, phone still propped up and streaming, everyone talking over each other, nobody watching the numbers.", "ben leah leo you", "home", ""],
};

// ── E · Panels: the picture beside a task, 42 stems over 53 slot keys ───────
// A panel is an OBJECT or a pair of hands, never a face — it sits under the task prompt
// and must not compete with the scene's own beat above it.
export const PANELS = [];
const panel = (stem, keys, scene, chapter, world = "studio") =>
  PANELS.push({ stem, keys, scene, chapter, world, cls: "panel" });

const SCRIPT_MC = {
  "01": "A fresh script page on the studio desk under warm lamp light, the handwriting drawn as illegible ink strokes, one line ringed in pen.",
  "02": "A script page with an old book open beside it, both drawn without readable text, a pen laid across the join.",
  "03": "A script page half-covered by a hand-drawn map of nowhere, the writing abstract strokes, a pen resting on it.",
  "04": "A script page beside a row of small plastic animal figures, the writing abstract, one line ringed hard in a second colour.",
  "05": "A script page with a paper cut-out garland casting shapes across it, writing abstract, pen across the corner.",
  "06": "A notebook on a low stone wall outdoors, wind lifting the page, the writing abstract strokes, a pen held down against it.",
  "07": "A script page on a cushion, fairy-light bokeh behind it, the writing abstract, everything a little too cosy.",
  "08": "A script page on a workbench between a coil of wire and a small model, writing abstract, under a hard work lamp.",
  "09": "A script page propped against a chalkboard prop, the writing abstract strokes, the chalk tray empty.",
  "10": "A script page on top of a stack of library books, written more carefully than usual, the words abstract strokes.",
  "11": "A script page barely worked on, the pen lying off the page, a phone face-down beside it.",
};
const SCRIPT_GAP = {
  "01": "A close view of a ruled script line with a blank gap in the middle of it, a pen tip poised just above the gap.",
  "02": "A ruled line with an empty gap, the paper slightly cockled, the pen resting in the crease of the page.",
  "03": "A ruled line with a gap where a joining word should be, a struck-through clause visible above it.",
  "04": "A ruled line with a gap inside a long difficult sentence, the paper creased from being held too hard.",
  "05": "A conditional sentence on ruled paper with its second half missing, the gap waiting under a low desk lamp.",
  "06": "A notebook line with a gap in it, outdoors, the page held flat by a thumb against the wind.",
  "07": "A ruled line with a gap in a sentence about time passing, the page resting on a cushion.",
  "08": "A ruled line with a gap, shadowed by a hand reaching across the page.",
  "09": "A ruled line with a gap in a sentence about what is allowed, the pen tapping beside it.",
  "10": "A ruled line with a gap in a sentence about permission, the pen resting in the fold of the page.",
  "11": "A ruled line with a gap, the page untouched around it, the writer's attention plainly elsewhere.",
};
const FIX = {
  "01": "A phone clamped on a small tripod, seen from behind so the viewfinder rectangle glows, a boy in an orange puffer vest framed inside it mid-word; a small red record dot in the corner.",
  "02": "The same tripod phone closer, the framed boy soft-focused inside the bright rectangle, the dark room around it; the record dot burning.",
  "03": "The viewfinder rectangle with the boy inside it laughing at himself mid-sentence; a hand at the edge of frame adjusting the zoom.",
  "04": "The viewfinder rectangle pushed in tight on the boy's confused face; a thumb on the screen edge pushing it tighter still.",
  "05": "The viewfinder rectangle with the boy inside it hesitating, the ring light reflected as two rings in his eyes.",
  "06": "A phone on a tripod outdoors against a wide grey river, the boy framed inside the rectangle with wind in his hair.",
  "07": "The viewfinder rectangle, warm and cushioned, the boy inside it talking about friends and meaning it.",
  "08": "The viewfinder rectangle with the boy holding a small model up to the lens, delighted; the work lamp flaring at the edge.",
  "09": "The viewfinder rectangle with the boy inside it flat and tired, the framing suddenly unkind.",
  "10": "The viewfinder rectangle, the boy inside it subdued, nobody's hand on the phone.",
  "11": "The viewfinder rectangle too close on the boy's face, the record dot hard and red — a frame that has stopped being a joke.",
};
for (const n of Object.keys(SCRIPT_MC)) {
  const world = n === "06" ? "street" : "studio";
  panel(`panel_ch${n}_script_mc`, [`ch${n}.script-mc`], SCRIPT_MC[n], Number(n), world);
  panel(`panel_ch${n}_script_gap`, [`ch${n}.script-gap`], SCRIPT_GAP[n], Number(n), world);
  panel(`panel_ch${n}_fix`, [`ch${n}.fix-bens-line`], FIX[n], Number(n), world);
}

// ch12–14: the "fix Ben's line" framing is deliberately retired. These panels carry no
// channel iconography at all — no viewfinder, no record dot, no phone.
panel("panel_ch12_truth_mc", ["ch12.truth-mc"],
  "A school report page on a desk, ruled and handwritten in even lines drawn as abstract ink strokes, a pen laid neatly alongside. No camera, no phone, nothing of the channel anywhere in the frame.", 12, "school");
panel("panel_ch12_truth_gap", ["ch12.truth-gap"],
  "The same report page closer: one sentence stopping halfway, a clean gap, the pen down and still. No camera, no phone.", 12, "school");
panel("panel_ch13_regret_gap", ["ch13.regret-gap"],
  "A ring light unplugged and lying on its side on a bare floor, its cable coiled beside it, dust visible in the flat grey light.", 13, "studio");
panel("panel_ch13_regret_mc", ["ch13.regret-mc"],
  "An empty orange puffer vest hanging over the back of a chair in a room where nobody is sitting.", 13, "studio");
panel("panel_ch14_promise_mc", ["ch14.promise-mc"],
  "A blank page and a pen pushed across a coffee table, waiting for someone to write their own words on it for the first time.", 14, "home");
panel("panel_ch14_promise_gap", ["ch14.promise-gap"],
  "Two pairs of hands over one notebook page on a living-room table, one of them holding the pen, the writing drawn as abstract strokes.", 14, "home");

// The recap check is a comprehension question, not a story moment — three shared
// pictures by emotional band is the right amount of picture for it.
const recapKeys = (from, to) => {
  const out = [];
  for (let i = from; i <= to; i++) out.push(`ch${String(i).padStart(2, "0")}.recap`);
  return out;
};
panel("panel_recap_warm", recapKeys(1, 5),
  "A closed notebook and a warm mug on a desk beside a switched-off ring light, evening lamp light across them — the quiet after a good take.", 3, "studio");
panel("panel_recap_tense", recapKeys(6, 11),
  "A closed notebook on a desk in a cold room, a phone face-down beside it, the light flat and blue.", 8, "studio");
panel("panel_recap_honest", recapKeys(12, 14),
  "An open notebook on a living-room table with a pen resting in the fold, afternoon light across the page, nothing staged.", 14, "home");
