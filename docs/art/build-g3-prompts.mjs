// Generator + gate for the G3 "FOURTEEN" graphic-novel image-prompt library.
// Single source of truth: the verbatim STYLE prefix (from the FOURTEEN Image Prompt
// Bible), the 5 character visual-locks, world anchors, and the entries (cast avatars
// + cover + endcard + the 14 episode cards). compose() builds each full, self-contained
// prompt; the gate asserts (STYLE present, unique files, < 5000 chars); then it writes a
// self-contained HTML deliverable. Images are generated externally from these prompts
// and dropped into apps/web/public/art/g3/<file>.png (resolved via art.json; procedural
// fallback until then).
//
//   node docs/art/build-g3-prompts.mjs      → runs the gate + writes the HTML
//
// IP-free (no real brands/landmarks/artist names) and text-free (a global no-readable-text
// negative; the "live" state shown as a plain red dot, never the word). Colour grading
// tracks the moral arc: warm L01–05 → cooler L06–10 → grey/stripped L11–13 → honest warmth L14.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// ── The STYLE block (verbatim from the bible; opens every prompt) ─────────────
const STYLE =
  "Semi-realistic young graphic novel illustration. Modern European teen drama aesthetic. " +
  "Clean confident linework with subtle ink wash textures. Natural proportions, expressive faces, " +
  "believable contemporary clothing. Rich but grounded colour palette. Aged 12-13 characters. " +
  "No readable text, letters, numbers, logos or watermarks anywhere in the image.";

// ── Character visual-locks (embedded wherever a character appears) ────────────
const CH = {
  leah: "LEAH (13, host): dark curly hair in a high messy bun with a neon-green scrunchie; oversized round tortoiseshell glasses with amber frames; cropped medium-wash denim jacket; red worn high-top sneakers; a phone always visible; olive skin, sharp jawline, intense dark brown eyes.",
  leo: "LEO (13, editor): straight jet-black hair falling over his LEFT eye with the right eye visible; thin silver chain necklace; oversized charcoal-black hoodie with sleeves pushed to the elbows; matte-black over-ear headphones (on his head or around his neck); pale skin, angular quiet face.",
  ben: "BEN (13, the heart): messy sandy-blond wavy hair sticking up in all directions; freckles across his nose and cheeks; a small gap between his front teeth when he smiles; a bright orange puffer vest over clashing bright colours; slightly shorter than the others; warm brown eyes, round open face.",
  sara: "SARA (15, the moral compass): long straight dark hair with a single silver-blonde streak on the left from the temple; one small gold hoop in the left ear; a minimalist monochrome black/white/grey outfit; tall and composed; light brown skin, high cheekbones.",
  you: "YOU (13, the writer, ALWAYS seen from behind or over-the-shoulder, face never shown): a plain grey hoodie, dark hair; a notebook or phone in hand.",
};

// ── World anchors (embedded only where relevant) ─────────────────────────────
const W = {
  studio: "Setting: a teenager's bedroom turned into a tiny filming studio — a ring light on a stand, a phone clamped on a small tripod, fairy lights, IKEA-style furniture, posters with no readable text.",
  school: "Setting: a realistic Austrian secondary-school interior — lockers, fluorescent lighting, scuffed floors.",
  street: "Setting: a generic European old-town street, no brand signage, no readable text.",
  park: "Setting: a quiet park at dusk, a wooden bench, bare trees, cool blue light.",
};

// ── Format presets ───────────────────────────────────────────────────────────
const F = {
  card: "Composition: a 16:9 establishing key-art frame, cinematic, room to breathe, no on-screen text.",
  avatar: "Composition: a 1:1 close-up circular portrait bust, warm key light from the left, simple soft background.",
  hero: "Composition: a 16:9 hero/title key-art frame, the group as an ensemble, a soft glowing play-triangle motif suggested by light (never an actual symbol or text).",
};

// ── Colour-grade by arc position ─────────────────────────────────────────────
const grade = {
  warm: "Colour grade: warm, bright, optimistic — golden lamp light.",
  cool: "Colour grade: cooler, more muted, slightly tense — desaturated blues creeping in.",
  grey: "Colour grade: grey, stripped, cold — almost colourless, heavy shadows.",
  honest: "Colour grade: warmth returning but softer and real, a single live-red dot the only saturated colour.",
};

// ── Entries: { section, id, file, scene, chars, world, format } ───────────────
const E = [];
const add = (section, id, file, scene, chars = [], world = "", format = F.card) =>
  E.push({ section, id, file, scene, chars, world, format });

// A · Cast avatars (1:1) — the per-character reference busts
add("A · Cast", "av-leah", "av_leah", "Friendly confident half-smile, alert and about to speak.", ["leah"], "", F.avatar);
add("A · Cast", "av-leo", "av_leo", "Quiet, watchful, the visible right eye doing the talking.", ["leo"], "", F.avatar);
add("A · Cast", "av-ben", "av_ben", "A wide open gap-toothed grin, completely unguarded.", ["ben"], "", F.avatar);
add("A · Cast", "av-sara", "av_sara", "Calm, composed, a steady knowing look.", ["sara"], "", F.avatar);
add("A · Cast", "av-you", "av_you", "From behind: the back of a grey hoodie and dark hair, a phone glow on the shoulder.", ["you"], "", F.avatar);

// B · Title + end card
add("B · Frames", "cover", "cover_title", "The four friends crowded together behind a ring light, mid-laugh, full of energy at the very start — YOU in the foreground from behind, facing them.", ["leah", "leo", "ben", "you"], W.studio, F.hero);
add("B · Frames", "endcard", "end_episode", "Ben mid-sentence, relaxed and real, teaching to camera his own way; the others off to the side, genuinely with him, not filming his mistakes; a single small red live-dot glows.", ["ben", "leah", "leo"], W.studio, `${F.hero} ${grade.honest}`);

// C · Episode cards (16:9) — one per chapter, tracking the arc
const card = (nn, file, scene, chars, world, g) => add("C · Episodes", `ch${nn}`, file, scene, chars, world, `${F.card} ${g}`);
card("01", "card_ch01", "The four friends crowd around a phone on the ring-light desk, thrilled, planning their very first video together.", ["leah", "leo", "ben", "you"], W.studio, grade.warm);
card("02", "card_ch02", "Ben reads from a script to the camera, animated and happy; Leo films, Leah watches the phone's view count climb.", ["ben", "leo", "leah"], W.studio, grade.warm);
card("03", "card_ch03", "Leah leans over a script, pen in hand, quietly marking Ben's lines harder; Ben, oblivious, gives a thumbs-up.", ["leah", "ben"], W.studio, grade.warm);
card("04", "card_ch04", "Ben on camera looking confused mid-line; Leo zooms the phone in on his face; Leah grins and gives a thumbs-up from behind the camera.", ["ben", "leo", "leah"], W.studio, grade.warm);
card("05", "card_ch05", "The group watches the glowing phone screen full of reactions; Ben's smile is uncertain, the others fixed on the numbers.", ["ben", "leah", "leo"], W.studio, grade.warm);
card("06", "card_ch06", "A school-trip group photo in front of a tall old clock tower and a wide grey river, overcast; YOU stand slightly apart, looking at a phone.", ["leah", "leo", "ben", "you"], W.street, grade.cool);
card("07", "card_ch07", "The group films a cheerful 'friendship' episode, all smiles for the camera — but YOU, from behind, stand stiff and uneasy at the edge.", ["leah", "leo", "ben", "you"], W.studio, grade.cool);
card("08", "card_ch08", "A laptop screen crowded with comment bubbles, one of them harsher than the rest highlighted; Leah's hand reaches to swipe it away, her jaw set.", ["leah"], W.studio, grade.cool);
card("09", "card_ch09", "Ben stands up out of the filming chair, finally pushing back; the others freeze, caught; Leah looks away.", ["ben", "leah", "leo"], W.studio, grade.cool);
card("10", "card_ch10", "YOU and Sara sit at opposite ends of a park bench at dusk, a serious quiet conversation, breath visible in the cold.", ["you", "sara"], W.park, grade.cool);
card("11", "card_ch11", "A phone in the dark shows a grid of thumbnail faces — a cruel compilation; its glow lights up a single shocked face, hand trembling.", ["you"], W.studio, grade.grey);
card("12", "card_ch12", "Ben walks away alone down a long empty school corridor; the group stands frozen behind him, no one following.", ["ben", "leah", "leo"], W.school, grade.grey);
card("13", "card_ch13", "The group sits in a loose circle on a bedroom floor, the ring light switched off in the corner, no scripts, heads down.", ["leah", "leo", "sara", "you"], W.studio, grade.grey);
card("14", "card_ch14", "The four plus Ben crowd back together for an honest live broadcast, no script, a single small red live-dot glowing; messy, warm, real.", ["leah", "leo", "ben", "you"], W.studio, grade.honest);

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
const html = `<!doctype html><meta charset="utf8"><title>FOURTEEN — image prompts</title>
<style>body{font:14px/1.5 system-ui;max-width:920px;margin:24px auto;padding:0 16px;color:#1e293b}h1{font-size:22px}h2{margin-top:28px;border-bottom:2px solid #2563eb;padding-bottom:4px}.card{border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin:10px 0}.hd{display:flex;justify-content:space-between;margin-bottom:6px}code{background:#eef2ff;padding:2px 6px;border-radius:4px;font-size:12px}textarea{width:100%;border:1px solid #e2e8f0;border-radius:6px;padding:8px;font:13px/1.45 ui-monospace,monospace;resize:vertical}</style>
<h1>FOURTEEN — image-prompt library (G3)</h1>
<p>${E.length} prompts. Generate each into <code>apps/web/public/art/g3/&lt;file&gt;.png</code>; they resolve via <code>art.json</code> (procedural fallback until present). Style + character locks are baked into every prompt — paste verbatim.</p>
${body}`;
writeFileSync(join(HERE, "g3-fourteen-prompts.html"), html);
console.log(`build-g3-prompts: OK — ${E.length} prompts, ${files.size} unique files; wrote g3-fourteen-prompts.html`);
