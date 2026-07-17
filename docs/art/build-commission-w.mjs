// Build CODEX_COMMISSION_W.html + CODEX_MASTER_PROMPT_W.md from commission-w.mjs
// (game v5: the HD-pixel shift). Machine-checks the stem↔manifest bijection
// against keen-manifest-w.json — exits 1 on drift. GATE-ONLY cards (the style
// key + calibration previews) are excluded from the bijection: they are judged
// by eye, never sliced into game stems.
//   node docs/art/build-commission-w.mjs [--refs <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cardsW, futureSectionsW, EGA, STYLE_PIXEL_V3, STYLE_CUTSCENE } from "./commission-w.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const refsDir = process.argv.includes("--refs") ? process.argv[process.argv.indexOf("--refs") + 1] : path.join(HERE, "refs-t");

// ── what each SLICED card yields (grid-cut or chroma-key). Gate-only cards
//    (style key + calibration previews) are NOT here — they are never sliced. ──
export const SLICES_W = {
  terrain3_sheet: ["earth3_a", "earth3_b", "earth3_c", "grass3_top", "grass3_tl", "grass3_tr", "edge3_l", "edge3_r", "slope3_up", "slope3_down", "earth3_inner", "ledge3"],
  hero3_sheet: ["hero3_stand", "hero3_run1", "hero3_run2", "hero3_run3", "hero3_run4", "hero3_jump", "hero3_fall", "hero3_pogo1", "hero3_pogo2", "hero3_climb1", "hero3_climb2", "hero3_hang", "hero3_idle", "hero3_lookup", "hero3_lookdown", "hero3_sit"],
  st_a3_sheet: ["st_pencil3_wild", "st_pencil3_free", "st_pen3_wild", "st_pen3_free", "st_rubber3_wild", "st_rubber3_free", "st_ruler3_wild", "st_ruler3_free", "st_scissors3_wild", "st_scissors3_free", "st_glue_stick3_wild", "st_glue_stick3_free"],
  st_b3_sheet: ["st_pencil_case3_wild", "st_pencil_case3_free", "st_exercise_book3_wild", "st_exercise_book3_free", "st_watercolours3_wild", "st_watercolours3_free", "st_paintbrush3_wild", "st_paintbrush3_free", "st_pencil_sharpener3_wild", "st_pencil_sharpener3_free", "st_book3_wild", "st_book3_free"],
  boss3_sheet: ["boss3_head_idle", "boss3_head_tell", "boss3_card", "boss3_burst"],
  ghost3_sheet: ["gs3_sing", "gs3_stand", "gs3_write", "gs3_window", "gs3_speak", "gs3_books", "gs3_friendly", "gs3_sad"],
  swarm3_sheet: ["digit3_orb", "digit3_glow", "cloud3_a", "cloud3_b", "cloud3_c", "cloud3_d", "swirl3_a", "swirl3_b"],
  classroom3_sheet: ["cr_chair3_grey", "cr_chair3_color", "cr_desk3_grey", "cr_desk3_color", "cr_board3_grey", "cr_board3_color", "cr_door3_grey", "cr_door3_color", "cr_window3_grey", "cr_window3_color", "cr_school_bag3_grey", "cr_school_bag3_color"],
  buildings3_sheet: ["bld3_ch01_sad", "bld3_ch01_alive", "bld3_ch02_sad", "bld3_ch02_alive", "bld3_ch03_sad", "bld3_ch03_alive", "bld3_ch04_sad", "bld3_ch04_alive", "bld3_ch05_sad", "bld3_ch05_alive", "bld3_locked", "bld3_spare"],
  decor3_sheet: ["prop_pole3", "prop_gluehwort3", "prop_seal3", "prop_spikes3", "dec_fence3", "dec_tree3", "dec_bush3", "prop_door3"],
  portraits3_sheet: ["p3_finn", "p3_pixel", "p3_berger", "p3_tintengeist", "p3_jona", "p3_ghost"],
};

const yielded = new Set();
for (const c of cardsW) {
  if (c.gateOnly === true) continue; // style key + calibration — never sliced
  for (const s of SLICES_W[c.stem] ?? [c.stem]) yielded.add(s);
}
const manifest = JSON.parse(fs.readFileSync(path.join(HERE, "keen-manifest-w.json"), "utf8"));
const allowed = new Set(manifest.stems.map((s) => s.stem));
const missingCards = [...allowed].filter((s) => !yielded.has(s));
const missingManifest = [...yielded].filter((s) => !allowed.has(s));
if (missingCards.length > 0 || missingManifest.length > 0) {
  console.error("BIJECTION FAIL", { missingCards, missingManifest });
  process.exit(1);
}
console.log(`bijection OK: ${allowed.size} manifest-W stems <-> ${cardsW.filter((c) => c.gateOnly !== true).length} sliced Batch W cards (+ ${cardsW.filter((c) => c.gateOnly === true).length} gate-only)`);

// ── references (base64) ──
const refs = [];
try {
  for (const f of fs.readdirSync(refsDir).filter((x) => /\.(png|jpg)$/i.test(x)).sort()) {
    const b64 = fs.readFileSync(path.join(refsDir, f)).toString("base64");
    refs.push({ name: f, src: `data:image/${f.endsWith(".jpg") ? "jpeg" : "png"};base64,${b64}` });
  }
} catch { console.warn("no refs dir — building without embedded references"); }

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chip = (hex) => `<span class="sw" style="background:${hex}">${hex}</span>`;
const fmtLabel = (f) => f === "sheet" ? "MAGENTA-SHEET" : f === "tilesheet" ? "MAGENTA-KACHELBLATT (48px-Raster)" : f === "gridcut" ? "GRID-CUT SHEET (randlos, kein Magenta)" : f === "transparent" ? "TRANSPARENT PNG" : "FULL-BLEED PNG";

const cardHtml = (c, i) => `
<div class="card ${c.cls === "cutscene" || c.cls === "background" || c.cls === "backdrop" ? "cutscene" : "pixel"}${c.gateOnly ? " gate" : ""}">
  <div class="head"><span class="n">${i + 1}</span><code>${c.file}</code><span class="cls">${c.cls === "cutscene" || c.cls === "background" || c.cls === "backdrop" ? "🖼 GEMALT" : "👾 HD-PIXEL"}</span>${c.gateOnly ? '<span class="gatechip">🚦 TOR ZUERST</span>' : ""}<span class="meta">${c.size} · ${fmtLabel(c.format)}</span></div>
  <div class="usage">${esc(c.usage)}${SLICES_W[c.stem] ? `<br><b>Wird zerschnitten in:</b> ${SLICES_W[c.stem].join(", ")}` : ""}</div>
  <div class="drop">Speichern als: <code>~/Code/codex-art-lab/batch-w/${c.folder === "root" ? "" : c.folder + "/"}${c.file}</code></div>
  <details open><summary>Prompt (komplett kopieren → Codex)</summary><pre>${esc(c.prompt)}</pre></details>
</div>`;

const gateCards = cardsW.filter((c) => c.gateOnly === true);
const html = `<!-- GENERATED by build-commission-w.mjs — edit commission-w.mjs, not this file -->
<meta charset="utf-8">
<title>DomiGo · Codex-Kommission — Batch W (v5: der HD-Pixel-Shift)</title>
<style>
  body{font-family:-apple-system,system-ui,sans-serif;max-width:980px;margin:24px auto;padding:0 18px;background:#faf8f2;color:#1c1a28;line-height:1.5}
  h1{font-size:26px} h2{font-size:20px;border-bottom:2px solid #d8d2c0;padding-bottom:4px;margin-top:36px}
  .card{background:#fff;border:1px solid #ddd6c4;border-radius:12px;padding:14px 16px;margin:14px 0;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .card.cutscene{border-left:5px solid #8b7cf5} .card.pixel{border-left:5px solid #2a9d5c} .card.gate{background:#fffaf0;border:2px solid #e0a92a}
  .head{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap} .n{background:#2c2a44;color:#fff;border-radius:99px;padding:1px 9px;font-size:13px;font-weight:700}
  .head code{font-size:15px;font-weight:700} .meta{color:#6b6552;font-size:13px;margin-left:auto} .cls{font-size:12px;font-weight:700}
  .gatechip{background:#e0a92a;color:#fff;border-radius:99px;padding:1px 9px;font-size:12px;font-weight:700}
  .usage{font-size:14px;color:#4a4538;margin:6px 0} .drop{font-size:13px;color:#6b6552;margin-bottom:6px}
  pre{white-space:pre-wrap;background:#f4f1e6;border:1px solid #e4ddc8;border-radius:8px;padding:10px;font-size:12.5px}
  .sw{display:inline-block;padding:2px 6px;border-radius:4px;color:#fff;font-family:monospace;font-size:11px;margin:1px;text-shadow:0 0 3px #000}
  .refs{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px} .refs figure{margin:0} .refs img{width:100%;border-radius:8px;image-rendering:pixelated} .refs figcaption{font-size:12px;color:#6b6552}
  .step{background:#fff;border-left:4px solid #2c2a44;padding:8px 14px;margin:8px 0;border-radius:0 8px 8px 0}
  .warn{background:#fdf3d7;border:1px solid #eadfa0;border-radius:8px;padding:10px 14px}
</style>
<h1>🖋 DomiGo — Die Codex-Kommission · Batch W (v5: der HD-Pixel-Shift)</h1>
<p><b>Für Koki.</b> ${cardsW.length} Generierungen → ${allowed.size} Spiel-Dateien. <b>Dein Verdikt:</b> „weg vom groben 8-Bit — HD-Pixel, schärfer, hübschere Böden, GEMALTE Weltkarte". Neuer Gameplay-Vertrag <b>STYLE_PIXEL_V3</b> (Owlboy/Eastward-Niveau, freigegebene Palette, ★ Anti-Rausch-Gesetz statt Dithering-Körnung). Die Weltkarte wird jetzt <b>gemalt</b>. <b>Reihenfolge ist Gesetz:</b> Codex generiert zuerst die 🚦 TOR-Karten (Style-Key + Kalibrierung), dann STOPP für deinen Blick — erst danach der Rest.</p>

<h2>§0 · So gehst du vor</h2>
<div class="step">1 · Öffne Codex (Agent-Modus). Am einfachsten: den kompletten <code>CODEX_MASTER_PROMPT_W.md</code> einfügen — Codex arbeitet die TOR-Karten ab und HÄLT DANN AN.</div>
<div class="step">2 · Sandbox-Gesetz: Codex schreibt AUSSCHLIESSLICH nach <code>~/Code/codex-art-lab/batch-w/</code> — nie ins Repo.</div>
<div class="step">2b · <b>VOR dem Start:</b> Referenzen kopieren: <code>cp -R ~/Code/domigo-v2/docs/art/refs-t ~/Code/codex-art-lab/refs-t</code>. NEU für v3: die <code>ref_keen_*</code>-Crops zeigen die alte Körnung — dein neuer Vertrag ist SAUBERER/GLATTER als sie (moderne HD-Pixel-Latte, kein Dithering-Feld).</div>
<div class="step">3 · 🚦 <b>TOR-CLUSTER zuerst</b> (Karten 1–5): Style-Key + Terrain + Held + eine Schulsache + gemalte Karte. Danach STOPP → Koki + Fable beurteilen den LOOK → erst dann der Rest.</div>
<div class="step">4 · 🖼 GEMALT-Karten: exakt in ihrer Größe, keine Pixeligkeit, kein Text/Wasserzeichen. 👾 HD-PIXEL-Karten: Magenta-Sheets <code>#FF00FF</code>, saubere Raster.</div>
<div class="step">5 · Danach (Fable): QA-Gate + Slicing + Sync gegen <code>keen-manifest-w.json</code> (Toleranz 40). Fehlende Bilder = kein Problem (prozeduraler Fallback bleibt).</div>
<div class="warn">🚦 Das Tor ist echt: NUR Karten 1–5 rendern, dann anhalten und auf „Look freigegeben" warten. So kostet ein falscher Stil-Key nicht ~90 Bilder, sondern 5.</div>

<h2>§1 · Der Gameplay-Vertrag v3 (HD-Pixel)</h2>
<p><b>Warme Stimmungs-Palette (frei erweiterbar — EGA-16 ist aufgehoben):</b><br>${EGA.map(chip).join("")}</p>
<h3>👾 Klasse GAMEPLAY (HD-Pixel — v3: Owlboy/Eastward-Latte, Anti-Rausch)</h3><pre>${esc(STYLE_PIXEL_V3)}</pre>
<h3>🖼 Klasse CUTSCENE/BACKDROP (gemalt — unverändert)</h3><pre>${esc(STYLE_CUTSCENE)}</pre>
<p><b>Referenzen:</b></p>
<div class="refs">${refs.map((r) => `<figure><img src="${r.src}" alt=""><figcaption>${r.name}</figcaption></figure>`).join("")}</div>

<h2>§2 · Batch W — die Karten (🚦 Tor-Cluster zuerst)</h2>
${cardsW.map(cardHtml).join("")}

<h2>§3 · Spätere Batches</h2>
${futureSectionsW.map((s) => `<div class="card"><div class="head"><code>${s.title}</code></div><div class="usage">${esc(s.note)}</div></div>`).join("")}
`;
fs.writeFileSync(path.join(HERE, "CODEX_COMMISSION_W.html"), html);
console.log(`CODEX_COMMISSION_W.html written (${(html.length / 1024).toFixed(0)} KB, ${refs.length} embedded references)`);

// ── THE MASTER PROMPT W (autonomous mode, gate-first) ──
const stripStyles = (p) => p.replace(STYLE_CUTSCENE, "").replace(STYLE_PIXEL_V3, "").replace(/^\s*\n/, "");
const gateCount = gateCards.length;
const master = `# MISSION: produce the image set for "DomiGo — Batch W" (v5, the HD-pixel shift)

You are a senior HD pixel artist AND illustrator executing a fixed commission for
a children's English-learning game. Work AUTONOMOUSLY through the numbered cards
below, IN ORDER, one image per card. Do not skip, reorder, merge, or reinterpret.

## ★ THE GATE (read before anything): this batch is CALIBRATE-FIRST.
Generate ONLY cards 1–${gateCount + 2} (the 🚦 GATE cluster: the style key, the
terrain, the hero preview, one school-thing, and the painted map), then STOP and
print exactly: \`GATE CLUSTER DONE — awaiting look approval before cards ${gateCount + 3}+\`.
Do NOT generate the rest until you are restarted with "look approved, continue".
A wrong style key caught at 5 images costs 5, not ~90.

## THE TWO STYLE CONTRACTS (each card names its class — re-read the right one before EVERY image)

### CLASS GAMEPLAY (HD pixel — v3, the Owlboy/Eastward bar, ANTI-NOISE)
${STYLE_PIXEL_V3}

### CLASS CUTSCENE / BACKDROP (painted)
${STYLE_CUTSCENE}

## WORKING RULES
0b. READ THE METHOD FIRST: \`~/Code/codex-art-lab/CODEX_METHOD.md\` is the
   standing working method of this lab (ground truth, calibration, hostile
   self-review, the sandbox law, the CP-registry). Read it fully before card 1.
   If missing, say so and continue.
0a. STUDY THE REFERENCES: \`~/Code/codex-art-lab/refs-t/\`. NOTE for v3: the
   \`ref_keen_*\` crops show the OLD grainy bar — your new contract is SMOOTHER
   and sharper than them (modern HD pixel, the anti-noise law). Use them only
   for silhouette/craft discipline, NOT for dithering density. \`hero-v1.png\`
   fixes the hero's canonical DESIGN. If the folder is missing, say so, continue.
0. YOUR ONE AND ONLY WRITE LOCATION IS THE SANDBOX FOLDER:
   \`~/Code/codex-art-lab/batch-w/\` — create it (and subfolders) if missing.
   Save every image there under the exact SAVE TO path its card names. NEVER
   write, modify, move, or delete ANYTHING anywhere else. A separate pipeline
   (not you) later QA-checks, slices, and imports your images.
1. CARD 1 IS THE HD-PIXEL STYLE KEY — generate it first; every later GAMEPLAY
   image must match it (palette, smoothness, anti-noise). CUTSCENE/BACKDROP
   cards match the painted contract and the painted map's mood.
2. Before each image print exactly: \`NOW GENERATING: <filename>\` — then
   generate, SAVE it yourself to the card's SAVE TO path, print \`SAVED: <path>\`.
3. AFTER each image run the class-matched self-check, print PASS/FAIL per line —
   on any FAIL regenerate ONCE with the failure named:
   GAMEPLAY (HD pixel) cards:
   - SMOOTHNESS: clean tonal bands, NO speckle/scatter noise, NO checkerboard fill
   - PALETTE: a curated harmonious palette (not photographic), 5-7 tones/material
   - PIXELS: one consistent pixel grid, crisp silhouette; selective interior AA OK
   - VARIETY: no single flat repeated texture — 2-3 gentle variants where carded
   - FORMAT: solid #FF00FF magenta sheet with a clean grid / true-alpha as carded
   - SUBJECT: every element present and readable at game size, top-left light
   CUTSCENE/BACKDROP cards:
   - PAINTED: soft painterly rendering, ZERO chunky pixels
   - RESOLUTION: exactly the card's size, sharp at full-screen
   - CAST/MOOD: characters match the descriptions; warm, never scary; no text
4. SHEETS: equal cells, SAME design in every cell (only pose/state changes);
   tile-sheets keep 48px cells edge-tileable where noted.
5. If you hit a session or generation limit, print exactly:
   \`CONTINUE AT CARD <n>\` — you will be restarted and resume there.
6. Never invent extra images, text, watermarks, signatures, or borders.

## THE CARDS
${cardsW.map((c, i) => `---
CARD ${i + 1} · filename: ${c.file} · CLASS: ${c.cls === "pixel" ? "GAMEPLAY (HD pixel)" : "CUTSCENE/BACKDROP (painted)"}${c.gateOnly ? " · 🚦 GATE CLUSTER" : ""}
SAVE TO: ~/Code/codex-art-lab/batch-w/${c.folder === "root" ? "" : c.folder + "/"}${c.file}
SIZE: ${c.size}
FORMAT: ${c.format === "sheet" ? "pose-sheet on SOLID magenta #FF00FF (no transparency)" : c.format === "tilesheet" ? "tile-sheet on SOLID magenta #FF00FF, 48px grid, 4px gutter, tiles edge-tileable where noted" : c.format === "gridcut" ? "grid-cut sheet — cells filled edge-to-edge, NO magenta" : c.format === "transparent" ? "PNG with TRUE alpha transparency" : "full-bleed PNG"}
USED FOR: ${c.usage}
SUBJECT BRIEF:
${stripStyles(c.prompt)}`).join("\n\n")}

---
END OF COMMISSION. After the final card, print a manifest of every filename you
produced, in order, marked DONE or REGENERATED.
`;
fs.writeFileSync(path.join(HERE, "CODEX_MASTER_PROMPT_W.md"), master);
console.log(`CODEX_MASTER_PROMPT_W.md written (${(master.length / 1024).toFixed(0)} KB, ${cardsW.length} cards)`);
