// Build CODEX_COMMISSION_V.html + CODEX_MASTER_PROMPT_V.md from commission-v.mjs
// (refoundation v3: the two-class batch). Machine-checks the T stem↔manifest
// bijection against keen-manifest-v.json — exits 1 on drift.
//   node docs/art/build-commission-v.mjs [--refs <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cardsV, futureSectionsV, EGA, STYLE_PIXEL_V2, STYLE_CUTSCENE } from "./commission-v.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const refsDir = process.argv.includes("--refs") ? process.argv[process.argv.indexOf("--refs") + 1] : path.join(HERE, "refs-t");

// ── what each sheet card yields after slicing (grid-cut or chroma-key) ──
export const SLICES_V = {
  hero2_sheet: ["hero2_stand", "hero2_run1", "hero2_run2", "hero2_run3", "hero2_run4", "hero2_jump", "hero2_fall", "hero2_pogo1", "hero2_pogo2", "hero2_climb1", "hero2_climb2", "hero2_hang", "hero2_idle", "hero2_lookup", "hero2_lookdown", "hero2_sit"],
  st_a_sheet: ["st_pencil_wild", "st_pencil_free", "st_pen_wild", "st_pen_free", "st_rubber_wild", "st_rubber_free", "st_ruler_wild", "st_ruler_free", "st_scissors_wild", "st_scissors_free", "st_glue_stick_wild", "st_glue_stick_free"],
  st_b_sheet: ["st_pencil_case_wild", "st_pencil_case_free", "st_exercise_book_wild", "st_exercise_book_free", "st_watercolours_wild", "st_watercolours_free", "st_paintbrush_wild", "st_paintbrush_free", "st_pencil_sharpener_wild", "st_pencil_sharpener_free"],
  ghost_student_sheet: ["gs_sing", "gs_stand", "gs_write", "gs_window", "gs_speak", "gs_books", "gs_friendly", "gs_sad"],
  digits_sheet: ["digit_0", "digit_1", "digit_2", "digit_3", "digit_4", "digit_5", "digit_6", "digit_7", "digit_8", "digit_9", "swirl_a", "swirl_b"],
  classroom_room_sheet: ["cr_chair_grey", "cr_chair_color", "cr_desk_grey", "cr_desk_color", "cr_board_grey", "cr_board_color", "cr_door_grey", "cr_door_color", "cr_window_grey", "cr_window_color", "cr_school_bag_grey", "cr_school_bag_color"],
  alphabet_sheet: ["alpha_a", "alpha_b", "alpha_c", "alpha_d", "alpha_e", "alpha_f", "alpha_g", "alpha_h", "alpha_i", "alpha_j", "alpha_k", "alpha_l", "alpha_m", "alpha_n", "alpha_o", "alpha_p", "alpha_q", "alpha_r", "alpha_s", "alpha_t", "alpha_u", "alpha_v", "alpha_w", "alpha_x", "alpha_y", "alpha_z"],
  slopes_sheet: ["slope_up", "slope_down"],
  maphero2_sheet: ["mh_down1", "mh_down2", "mh_up1", "mh_up2", "mh_side1", "mh_side2"],
  mapnpc2_sheet: ["finn_map2", "pixel_map2", "flag2", "note2"],
  buildings_alive_sheet: ["bldx_ch01", "bldx_ch02", "bldx_ch03", "bldx_ch04", "bldx_ch05", "bldx_spare"],
  portraits2_sheet: ["p2_finn", "p2_pixel", "p2_berger", "p2_tintengeist", "p2_jona", "p2_ghost"],
};
const yielded = new Set();
for (const c of cardsV) for (const s of SLICES_V[c.stem] ?? [c.stem]) yielded.add(s);
const manifest = JSON.parse(fs.readFileSync(path.join(HERE, "keen-manifest-v.json"), "utf8"));
const allowed = new Set(manifest.stems.map((s) => s.stem));
const missingCards = [...allowed].filter((s) => !yielded.has(s));
const missingManifest = [...yielded].filter((s) => !allowed.has(s));
if (missingCards.length > 0 || missingManifest.length > 0) {
  console.error("BIJECTION FAIL", { missingCards, missingManifest });
  process.exit(1);
}
console.log(`bijection OK: ${allowed.size} manifest-T stems <-> ${cardsV.length} Batch V cards`);

// ── references (base64) — the pixel style key + Batch S results anchor cohesion ──
const refs = [];
try {
  for (const f of fs.readdirSync(refsDir).filter((x) => /\.(png|jpg)$/i.test(x)).sort()) {
    const b64 = fs.readFileSync(path.join(refsDir, f)).toString("base64");
    refs.push({ name: f, src: `data:image/${f.endsWith(".jpg") ? "jpeg" : "png"};base64,${b64}` });
  }
} catch { console.warn("no refs dir — building without embedded references"); }

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chip = (hex) => `<span class="sw" style="background:${hex}">${hex}</span>`;
const fmtLabel = (f) => f === "sheet" ? "MAGENTA-SHEET" : f === "gridcut" ? "GRID-CUT SHEET (randlos, kein Magenta)" : f === "transparent" ? "TRANSPARENT PNG" : "FULL-BLEED PNG";

const cardHtml = (c, i) => `
<div class="card ${c.cls === "cutscene" || c.cls === "backdrop" ? "cutscene" : "pixel"}">
  <div class="head"><span class="n">${i + 1}</span><code>${c.file}</code><span class="cls">${c.cls === "cutscene" ? "🖼 CUTSCENE (gemalt)" : c.cls === "backdrop" ? "🏞 BACKDROP (gemalt)" : "👾 GAMEPLAY (pixel)"}</span><span class="meta">${c.size} · ${fmtLabel(c.format)}</span></div>
  <div class="usage">${esc(c.usage)}${SLICES_V[c.stem] ? `<br><b>Wird zerschnitten in:</b> ${SLICES_V[c.stem].join(", ")}` : ""}</div>
  <div class="drop">Speichern als: <code>~/Code/codex-art-lab/batch-v/${c.folder === "root" ? "" : c.folder + "/"}${c.file}</code></div>
  <details open><summary>Prompt (komplett kopieren → Codex)</summary><pre>${esc(c.prompt)}</pre></details>
</div>`;

const html = `<!-- GENERATED by build-commission-v.mjs — edit commission-v.mjs, not this file -->
<meta charset="utf-8">
<title>DomiGo · Codex-Kommission — Batch V (Neugründung: Cutscenes + gemalte Hintergründe + Gameplay v2)</title>
<style>
  body{font-family:-apple-system,system-ui,sans-serif;max-width:980px;margin:24px auto;padding:0 18px;background:#faf8f2;color:#1c1a28;line-height:1.5}
  h1{font-size:26px} h2{font-size:20px;border-bottom:2px solid #d8d2c0;padding-bottom:4px;margin-top:36px}
  .card{background:#fff;border:1px solid #ddd6c4;border-radius:12px;padding:14px 16px;margin:14px 0;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .card.cutscene{border-left:5px solid #8b7cf5} .card.pixel{border-left:5px solid #2a9d5c}
  .head{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap} .n{background:#2c2a44;color:#fff;border-radius:99px;padding:1px 9px;font-size:13px;font-weight:700}
  .head code{font-size:15px;font-weight:700} .meta{color:#6b6552;font-size:13px;margin-left:auto} .cls{font-size:12px;font-weight:700}
  .usage{font-size:14px;color:#4a4538;margin:6px 0} .drop{font-size:13px;color:#6b6552;margin-bottom:6px}
  pre{white-space:pre-wrap;background:#f4f1e6;border:1px solid #e4ddc8;border-radius:8px;padding:10px;font-size:12.5px}
  .sw{display:inline-block;padding:2px 6px;border-radius:4px;color:#fff;font-family:monospace;font-size:11px;margin:1px;text-shadow:0 0 3px #000}
  .refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px} .refs figure{margin:0} .refs img{width:100%;border-radius:8px;image-rendering:pixelated} .refs figcaption{font-size:12px;color:#6b6552}
  .step{background:#fff;border-left:4px solid #2c2a44;padding:8px 14px;margin:8px 0;border-radius:0 8px 8px 0}
  .warn{background:#fdf3d7;border:1px solid #eadfa0;border-radius:8px;padding:10px 14px}
</style>
<h1>🖋 DomiGo — Die Codex-Kommission · Batch V (Batch V: die Unit-Magie-Bibliothek)</h1>
<p><b>Für Koki.</b> ${cardsV.length} Generierungen → ${allowed.size} Spiel-Dateien. <b>NEU: zwei Bildklassen.</b> 🖼 <b>CUTSCENE/BACKDROP</b> = hochauflösend GEMALT (Bilderbuch-Qualität, keine Pixel — dein Verdikt: hochskalierte Pixel „sehen kaputt aus"). 👾 <b>GAMEPLAY</b> = echtes Pixel-Art in nativer Auflösung (Batch-S-Vertrag). Reihenfolge ist Gesetz: <b>Karte 1 = der gemalte Style-Key</b>, dein Blick drauf, dann der Rest.</p>

<h2>§0 · So gehst du vor</h2>
<div class="step">1 · Öffne Codex (Agent-Modus). Am einfachsten: den kompletten <code>CODEX_MASTER_PROMPT_V.md</code> einfügen — Codex arbeitet alle ${cardsV.length} Karten selbstständig ab. Alternativ Karte für Karte aus dieser Datei.</div>
<div class="step">2 · Sandbox-Gesetz unverändert: Codex schreibt AUSSCHLIESSLICH nach <code>~/Code/codex-art-lab/batch-v/</code> — nie ins Repo.</div>
<div class="step">2b · <b>VOR dem Start:</b> Referenzen in die Sandbox kopieren, damit Codex sie STUDIEREN kann: <code>cp -R ~/Code/domigo-v2/docs/art/refs-t ~/Code/codex-art-lab/refs-t</code> — die <code>ref_keen_*</code>-Ausschnitte sind die HANDWERKS-LATTE (Dithering-Dichte, 3–4-Ton-Rampen, organische Silhouetten), <code>hero-v1</code> fixiert das Helden-Design.</div>
<div class="step">3 · 🖼 CUTSCENE-Karten: GEMALT, exakt 1920×1080 (Backdrops: ihre eigene Größe), KEINE Pixeligkeit, kein Text, keine Wasserzeichen.</div>
<div class="step">4 · 👾 GAMEPLAY-Karten: der bekannte Pixel-Vertrag — Magenta-Sheets vollflächig <code>#FF00FF</code>, Transparenz = echtes Alpha, Grid-Cut-Sheets randlos gefüllt.</div>
<div class="step">5 · Danach (Fable): QA-Gate + Slicing + Sync gegen <code>keen-manifest-v.json</code>. Fehlende Bilder sind nie ein Problem — prozedurale Grafik bleibt als Fallback.</div>
<div class="warn">⚠ Karte 1 (gemalter Style-Key) zuerst — Koki-Blick — dann Karte 19 (hero_swing_sheet) als Pixel-Pipeline-Beweis gegen den Batch-S-Helden, dann der Rest. Bei Stil-Drift: „match the attached style reference exactly" + Style-Key anhängen.</div>

<h2>§1 · Die zwei Stil-Verträge</h2>
<p><b>Die EGA-Familie (Stimmungs-Anker beider Klassen):</b><br>${EGA.map(chip).join("")}</p>
<h3>🖼 Klasse CUTSCENE/BACKDROP (gemalt)</h3><pre>${esc(STYLE_CUTSCENE)}</pre>
<h3>👾 Klasse GAMEPLAY (pixel — v2: die Keen-4-Handwerks-Latte)</h3><pre>${esc(STYLE_PIXEL_V2)}</pre>
<p><b>Referenzen:</b></p>
<div class="refs">${refs.map((r) => `<figure><img src="${r.src}" alt=""><figcaption>${r.name}</figcaption></figure>`).join("")}</div>

<h2>§2 · Batch V — die Karten</h2>
${cardsV.map(cardHtml).join("")}

<h2>§3 · Spätere Batches</h2>
${futureSectionsV.map((s) => `<div class="card"><div class="head"><code>${s.title}</code></div><div class="usage">${esc(s.note)}</div></div>`).join("")}
`;
fs.writeFileSync(path.join(HERE, "CODEX_COMMISSION_V.html"), html);
console.log(`CODEX_COMMISSION_V.html written (${(html.length / 1024).toFixed(0)} KB, ${refs.length} embedded references)`);

// ── THE MASTER PROMPT T (autonomous mode) ──
const stripStyles = (p) => p.replace(STYLE_CUTSCENE, "").replace(STYLE_PIXEL_V2, "").replace(/^\s*\n/, "");
const master = `# MISSION: produce the complete image set for "DomiGo — Batch V" (${cardsV.length} images, TWO style classes)

You are a senior illustrator AND pixel artist executing a fixed commission for a
children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, in order, one image per card. Do not skip, reorder, merge, or reinterpret.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS CUTSCENE / BACKDROP (painted)
${STYLE_CUTSCENE}

### CLASS GAMEPLAY (pixel — the Keen 4 craft bar)
${STYLE_PIXEL_V2}

## WORKING RULES
0b. READ THE METHOD FIRST: \`~/Code/codex-art-lab/CODEX_METHOD.md\` is the
   standing working method of this lab (ground truth, calibration, hostile
   self-review, the sandbox law, the pitfall registry CP-1..CP-7). Read it
   fully before card 1. If it is missing, say so and continue.
0a. STUDY THE REFERENCES FIRST: the user has placed reference images at
   \`~/Code/codex-art-lab/refs-t/\` — open and study EVERY one before card 1.
   The \`ref_keen_*\` crops are the CRAFT BAR for all GAMEPLAY cards: match
   their dithering density, 3-4-tone material ramps, organic silhouettes and
   zero-flat-surface texture — an output that looks simpler than these crops
   is a FAIL. \`hero-v1.png\` fixes the hero's canonical DESIGN (costume,
   proportions) — render it at the Keen craft level, not at its simpler v1
   rendering. If the folder is missing, say so, then continue on the written
   contract alone.
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   \`~/Code/codex-art-lab/batch-v/\` — create it (and its subfolders) if missing.
   Save every image there under the exact SAVE TO path its card names.
   NEVER write, modify, move, or delete ANYTHING anywhere else — no git
   repository, no other folder, no existing file. Everywhere else you are
   strictly read-only. A separate pipeline (not you) later QA-checks, slices,
   and imports your images into the game.
1. CARD 1 IS THE PAINTED STYLE KEY — generate it first; every later CUTSCENE/
   BACKDROP image must match it in palette-mood, brushwork and cast design.
   The GAMEPLAY cards must match the established Batch S pixel look instead
   (same hero, same palette, same outline weight).
2. Before each image, print exactly: \`NOW GENERATING: <filename>\` — then
   generate, then SAVE it yourself to the card's SAVE TO path (rule 0) and
   print \`SAVED: <full path>\`.
3. AFTER each image, run the class-matched self-check, print PASS/FAIL per
   line — on any FAIL, regenerate ONCE with the failure named in the prompt:
   CUTSCENE/BACKDROP cards:
   - PAINTED: soft painterly rendering, ZERO chunky pixels, zero dithering
   - RESOLUTION: exactly the card's size, sharp at full-screen
   - CAST: every named character matches the cast descriptions exactly
   - MOOD: warm storybook, nothing scary, no text/watermarks/borders
   - TILING (only where the card demands it): left/right edges join seamlessly
   GAMEPLAY cards:
   - PALETTE: only the 16 contract colors (no off-palette hues, no gradients)
   - PIXELS: crisp squares, zero anti-aliasing
   - CRAFT: no flat single-color areas — dithered texture + 3-4-tone ramps +
     organic silhouettes at the density of the ref_keen_* crops
   - FORMAT: as carded — solid #FF00FF magenta pose-sheet with clean grid /
     TRUE-alpha transparency / grid-cut sheet filled edge-to-edge with NO magenta
   - SUBJECT: every element present and readable at game size
4. SHEETS: equal cells, SAME character/design in every cell (only pose changes);
   grid-cut sheets are filled completely, chroma sheets keep clear magenta gaps.
5. If you hit a session or generation limit, print exactly:
   \`CONTINUE AT CARD <n>\` — you will be restarted with this same document and
   "continue at card <n>", and you resume from there.
6. Never invent extra images, text, watermarks, signatures, or borders.

## THE CARDS
${cardsV.map((c, i) => `---
CARD ${i + 1} · filename: ${c.file} · CLASS: ${c.cls === "pixel" ? "GAMEPLAY (pixel)" : "CUTSCENE/BACKDROP (painted)"}
SAVE TO: ~/Code/codex-art-lab/batch-v/${c.folder === "root" ? "" : c.folder + "/"}${c.file}
SIZE: ${c.size}
FORMAT: ${c.format === "sheet" ? "pose-sheet on SOLID magenta #FF00FF (no transparency)" : c.format === "gridcut" ? "grid-cut sheet — cells filled edge-to-edge, NO magenta, NO gaps" : c.format === "transparent" ? "PNG with TRUE alpha transparency" : "full-bleed PNG"}
USED FOR: ${c.usage}
SUBJECT BRIEF:
${stripStyles(c.prompt)}`).join("\n\n")}

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
`;
fs.writeFileSync(path.join(HERE, "CODEX_MASTER_PROMPT_V.md"), master);
console.log(`CODEX_MASTER_PROMPT_V.md written (${(master.length / 1024).toFixed(0)} KB, ${cardsV.length} cards)`);
