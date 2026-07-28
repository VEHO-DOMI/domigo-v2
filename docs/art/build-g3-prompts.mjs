// Generator + gate for the G3 "FOURTEEN" graphic-novel image-prompt library.
//
//   node docs/art/build-g3-prompts.mjs            → gates, then writes the deliverables
//   node docs/art/build-g3-prompts.mjs --check    → gates only, writes nothing
//
// Writes:
//   docs/art/g3-fourteen-prompts.html   the work surface the images are generated from
//   docs/art/g3-art-files.json          the stem library (drives sync-art + prep-art)
//
// The data lives in g3-fourteen-data.mjs; this file only composes and checks. The
// checks are the point — two of them exist because the thing they catch already
// happened once in this very library:
//
//   * the five `av_*` cast prompts were UNREACHABLE. The runtime only ever asks for
//     `<speaker>_neutral`, so generating them would have produced five images the game
//     could never display. Gate 10 makes that impossible to ship again.
//   * the studio world anchor said "IKEA-style furniture" — a real brand, in a library
//     whose whole premise is that it names none. Gate 6 catches it.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  STYLE, NEG, SCREEN, CH, STATE, W, F, arcOf,
  FRAMES, PORTRAITS, BACKDROPS, BEATS, PANELS,
} from "./g3-fourteen-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");
const CHECK_ONLY = process.argv.includes("--check");

const story = JSON.parse(readFileSync(
  join(REPO, "content/corpus/stories/g3.st.fourteen/story.json"), "utf8"));

const chNum = (id) => Number(id.match(/ch(\d\d)$/)[1]);      // "…ch07" → 7
const pad = (n) => String(n).padStart(2, "0");
const shortId = (id) => id.split(".").slice(-2).join(".");    // "…ch07.s006" → "ch07.s006"

// ── Compose ─────────────────────────────────────────────────────────────────
/** One entry → one complete, self-contained prompt. The order is fixed and gated. */
function compose(e) {
  const states = e.states ?? {};
  const chars = (e.chars ?? []).map((c) => {
    const st = states[c];
    return st ? `${CH[c]} ${STATE[c][st]}` : CH[c];
  });
  return [
    STYLE,
    F[e.cls],
    e.scene,
    ...chars,
    e.world ? W[e.world] : "",
    e.screen ? SCREEN : "",
    arcOf(e.chapter),
    NEG,
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

// ── Flatten the data module into one entry list ─────────────────────────────
const entries = [];

for (const f of FRAMES) {
  entries.push({ ...f, section: "A · Frames", label: f.id, chars: f.chars ?? [] });
}
for (const p of PORTRAITS) {
  entries.push({
    stem: p.stem, cls: "portrait", chapter: p.chapter, scene: p.scene,
    chars: [p.char], states: p.state ? { [p.char]: p.state } : {},
    world: "", section: "B · Portraits", label: p.stem,
  });
}
for (const [n, world, scene] of BACKDROPS) {
  entries.push({
    stem: `bg_ch${n}`, cls: "backdrop", chapter: Number(n), scene, chars: [], world,
    section: "C · Backdrops", label: `ch${n} — the place itself`,
  });
}
for (const [key, [scene, charStr, world, opts]] of Object.entries(BEATS)) {
  const [ch, sc] = key.split(".");
  const states = {};
  for (const m of (opts ?? "").matchAll(/state:(\w+)=(\w+)/g)) states[m[1]] = m[2];
  entries.push({
    stem: `beat_${ch}_${sc}`, cls: "beat", chapter: Number(ch.slice(2)), scene,
    chars: charStr ? charStr.split(/\s+/) : [], states, world,
    screen: (opts ?? "").includes("screen"),
    section: `D · ${ch}`, label: key, sceneKey: key,
  });
}
for (const p of PANELS) {
  entries.push({
    stem: p.stem, cls: "panel", chapter: p.chapter, scene: p.scene, chars: [],
    world: p.world, section: "E · Task panels", label: p.stem, keys: p.keys,
  });
}

// ── Gates ───────────────────────────────────────────────────────────────────
const fail = [];
const bad = (m) => fail.push(m);

// Real brands, platforms, landmarks and people the STORY names but the PICTURES must not.
const BANNED = /\b(youtube|tiktok|instagram|whatsapp|snapchat|twitter|facebook|iphone|android|ikea|nike|adidas|converse|netflix|spotify|titanic|tesla|big ben|thames|globe theatre|tower bridge|london)\b/i;

const seen = new Map();
for (const e of entries) {
  e.prompt = compose(e);
  const p = e.prompt;

  if (!p.startsWith(STYLE)) bad(`${e.label}: the style block is not first`);                    // 1
  if (p.length > 5000) bad(`${e.label}: prompt too long (${p.length} chars)`);                  // 2
  if (p.length < 400) bad(`${e.label}: prompt suspiciously short (${p.length}) — a block was probably lost`);
  if (seen.has(e.stem)) bad(`${e.label}: duplicate stem ${e.stem} (also ${seen.get(e.stem)})`); // 3
  seen.set(e.stem, e.label);
  if (!F[e.cls]) bad(`${e.label}: unknown class ${e.cls}`);
  for (const c of e.chars) if (!CH[c]) bad(`${e.label}: unknown character '${c}'`);              // 4
  for (const [c, st] of Object.entries(e.states ?? {})) {                                       // 5
    if (!CH[c]) bad(`${e.label}: state applied to unknown character '${c}'`);
    else if (!STATE[c]?.[st]) bad(`${e.label}: '${c}' has no state '${st}'`);
  }
  const hit = p.match(BANNED);                                                                  // 6
  if (hit) bad(`${e.label}: names a real brand, place or person — "${hit[0]}"`);
  if (!p.includes(NEG)) bad(`${e.label}: the no-readable-text rule is missing`);                 // 7
  if (!(e.chapter >= 1 && e.chapter <= 14)) bad(`${e.label}: chapter ${e.chapter} out of range`);
  if (!p.includes(arcOf(e.chapter))) bad(`${e.label}: colour grade does not match its chapter's place in the arc`); // 8
  if (e.world && !W[e.world]) bad(`${e.label}: unknown world '${e.world}'`);
  if (e.screen && !p.includes(SCREEN)) bad(`${e.label}: marked as showing a screen but carries no screen rule`);
}

// 9 · coverage · 10 · portrait reachability · 11 · speaker agreement — against the story.
const portraitStems = new Set(PORTRAITS.map((p) => p.stem));
const beatKeys = new Set(Object.keys(BEATS));
const panelKeys = new Set(PANELS.flatMap((p) => p.keys));
const bgChapters = new Set(BACKDROPS.map(([n]) => Number(n)));
const storySlotKeys = new Set();
let scenes = 0;

for (const ch of story.chapters) {
  const n = chNum(ch.id);
  if (!bgChapters.has(n)) bad(`ch${pad(n)}: no backdrop — scenes without their own beat would show nothing`);
  for (const s of ch.scenes) {
    scenes++;
    const key = shortId(s.id);
    if (!beatKeys.has(key)) bad(`${key}: no beat`);                                             // 9
    if (s.speaker !== "narrator" && !portraitStems.has(`${s.speaker}_neutral`)) {               // 10
      bad(`${key}: speaker '${s.speaker}' has no neutral portrait to fall back on`);
    }
    const beat = BEATS[key];
    if (beat && s.speaker !== "narrator") {                                                     // 11
      const who = (beat[1] ?? "").split(/\s+/).filter(Boolean);
      if (who.length && !who.includes(s.speaker)) {
        bad(`${key}: this is ${s.speaker}'s line, but its picture shows ${who.join(" + ")}`);
      }
    }
    for (const t of s.taskSlots) {
      const k = `ch${pad(n)}.${t.slot}`;
      storySlotKeys.add(k);
      if (!panelKeys.has(k)) bad(`${k}: no task panel`);
    }
  }
}
for (const k of panelKeys) {                                                                    // 12
  if (!storySlotKeys.has(k)) bad(`panel key ${k} points at a task slot that does not exist in the story`);
}

// 13 · NO DEAD STEMS. This is the gate the old `av_leah`…`av_you` prompts needed: five
// perfectly good prompts for images the runtime had no way to ask for. A portrait stem is
// reachable only if it is a `<char>_neutral` (the resolver's own fallback) or some scene's
// SPEAKER carries that state in that scene's beat.
const reachable = new Set(Object.keys(CH).map((c) => `${c}_neutral`));
for (const ch of story.chapters) {
  const n = pad(chNum(ch.id));
  for (const s of ch.scenes) {
    if (s.speaker === "narrator") continue;
    const opts = BEATS[`ch${n}.${s.id.split(".").pop()}`]?.[3] ?? "";
    for (const m of opts.matchAll(/state:(\w+)=(\w+)/g)) {
      if (m[1] === s.speaker) reachable.add(`${m[1]}_${m[2]}`);
    }
  }
}
for (const p of PORTRAITS) {
  if (!reachable.has(p.stem)) {
    bad(`portrait '${p.stem}' can never be requested by the game — no scene's speaker is `
      + `in that state. Either give a scene that state, or drop the prompt.`);
  }
}

if (fail.length) {
  console.error(`✗ build-g3-prompts: ${fail.length} problem(s)\n`);
  for (const m of fail) console.error("  - " + m);
  process.exit(1);
}

const byClass = entries.reduce((a, e) => ((a[e.cls] = (a[e.cls] ?? 0) + 1), a), {});
console.log(`✓ gates clean — ${entries.length} prompts covering all ${scenes} scenes and all ${storySlotKeys.size} task slots`);
console.log(`  ${Object.entries(byClass).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
if (CHECK_ONLY) process.exit(0);

// ── The stem library (drives sync-art.mjs and prep-art.mjs) ─────────────────
const MAXPX = { portrait: 512, panel: 1024, beat: 1280, backdrop: 1280, card: 1280, hero: 1600 };
let legacyMap = {};
try {
  legacyMap = JSON.parse(readFileSync(join(HERE, "g3-legacy-map.json"), "utf8")).map;
} catch {
  console.warn("  (no g3-legacy-map.json yet — nothing will be marked as already generated)");
}

writeFileSync(join(HERE, "g3-art-files.json"), JSON.stringify({
  schema: "art-files@1",
  grade: 3,
  storyId: "g3.st.fourteen",
  count: entries.length,
  stems: entries.map((e) => ({
    stem: e.stem,
    file: `${e.stem}.png`,
    section: e.section,
    class: e.cls,
    maxPx: MAXPX[e.cls],
    ...(legacyMap[e.stem] ? { legacy: legacyMap[e.stem] } : {}),
  })),
}, null, 2) + "\n");

// ── The work surface ────────────────────────────────────────────────────────
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sections = [...new Set(entries.map((e) => e.section))];
const salvaged = entries.filter((e) => legacyMap[e.stem]).length;

const cards = sections.map((sec) => {
  const items = entries.filter((e) => e.section === sec).map((e) => {
    const had = Boolean(legacyMap[e.stem]);
    return `<article class="card${had ? " salvaged" : ""}" data-stem="${e.stem}">
  <header>
    <label class="tick"><input type="checkbox" data-stem="${e.stem}"${had ? " checked" : ""}> <b>${esc(e.stem)}</b></label>
    <span class="meta">${e.cls} · ${e.cls === "portrait" ? "1:1" : "16:9"} · ${MAXPX[e.cls]}px wide · ${e.prompt.length}/5000</span>
  </header>
  <p class="what">${esc(e.label)}${had ? ' <span class="badge">you already generated this one</span>' : ""}</p>
  <textarea readonly rows="5">${esc(e.prompt)}</textarea>
  <footer><button class="copy">Copy prompt</button>
    <span class="save">save as <code>${e.stem}.png</code> in <code>docs/art/drop-g3/</code></span></footer>
</article>`;
  }).join("\n");
  return `<section id="s${sec.replace(/[^\w]/g, "")}"><h2>${esc(sec)}</h2>\n${items}</section>`;
}).join("\n");

const nav = sections
  .map((s) => `<a href="#s${s.replace(/[^\w]/g, "")}">${esc(s.replace(/^[A-E] · /, ""))}</a>`)
  .join("");

const html = `<!doctype html><meta charset="utf8"><title>FOURTEEN — image prompts (G3)</title>
<style>
:root{--ink:#1e293b;--line:#cbd5e1;--accent:#2563eb;--ok:#15803d}
body{font:14px/1.5 system-ui,sans-serif;max-width:940px;margin:0 auto;padding:0 16px 64px;color:var(--ink)}
h1{font-size:22px;margin:22px 0 4px}
h2{margin:30px 0 10px;border-bottom:2px solid var(--accent);padding-bottom:4px;font-size:17px}
.bar{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:8px 0;z-index:9}
.bar nav a{display:inline-block;font-size:12px;padding:2px 7px;margin:1px;border:1px solid var(--line);border-radius:5px;text-decoration:none;color:var(--ink)}
.count{font-weight:700;font-size:15px}.count b{color:var(--ok)}
.filters{margin:5px 0}
.filters button{font-size:12px;margin-right:4px;padding:3px 9px;border:1px solid var(--line);background:#fff;border-radius:5px;cursor:pointer}
.filters button[aria-pressed=true]{background:var(--accent);color:#fff;border-color:var(--accent)}
.card{border:1px solid var(--line);border-radius:10px;padding:11px 13px;margin:10px 0}
.card.done{opacity:.45}.card.salvaged{border-left:4px solid var(--ok)}
header{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.tick{cursor:pointer}.meta{font-size:11px;color:#64748b;font-variant-numeric:tabular-nums}
.what{margin:5px 0 7px;font-size:13px;color:#475569}
.badge{background:#dcfce7;color:var(--ok);border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700}
textarea{width:100%;border:1px solid #e2e8f0;border-radius:6px;padding:8px;font:12.5px/1.45 ui-monospace,monospace;resize:vertical;background:#f8fafc}
footer{display:flex;align-items:center;gap:10px;margin-top:7px;flex-wrap:wrap}
button.copy{background:var(--accent);color:#fff;border:0;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:13px}
.save{font-size:11.5px;color:#64748b}code{background:#eef2ff;padding:1px 5px;border-radius:4px}
.note{background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:11px 14px;margin:14px 0;font-size:13px}
</style>
<h1>FOURTEEN — the picture library</h1>
<div class="note"><b>How to use this page.</b> Work down it at your own pace — it remembers what
you have ticked, so you can close it and come back tomorrow. For each card: press
<b>Copy prompt</b>, paste it into the image generator whole (each prompt is complete on its
own — do not add anything to it), then save the result under the exact filename shown, into
<code>docs/art/drop-g3/</code>. When a batch is done, these two commands put the pictures
into the game:
<br><code>node docs/art/prep-art.mjs "docs/art/drop-g3" --lib g3-art-files.json</code>
<br><code>node docs/art/sync-art.mjs "docs/art/drop-g3" --lib g3-art-files.json --dest g3</code>
<br><br><b>Where to start:</b> the <b>backdrops</b>. There are only 14 of them and they give
every one of the 141 scenes a picture at once — the game falls back to a chapter's backdrop
wherever that scene has no picture of its own. Everything after that is an upgrade, not a
requirement. <b>Green-edged cards</b> are ones you already generated for the old app; they are
ticked for you and get imported separately. Nothing here must be done in order, and a missing
picture never breaks anything — the game just draws its own until yours arrives.</div>
<div class="bar">
  <div class="count"><b id="ndone">0</b> / ${entries.length} done · <span id="nleft"></span> to go</div>
  <div class="filters">
    <button data-f="all" aria-pressed="true">All</button>
    <button data-f="todo" aria-pressed="false">Not done</button>
    <button data-f="done" aria-pressed="false">Done</button>
    <input id="q" placeholder="search…" style="font-size:12px;padding:3px 7px;border:1px solid var(--line);border-radius:5px">
  </div>
  <nav>${nav}</nav>
</div>
${cards}
<script>
const KEY="domigo:g3-art:done";
const done=new Set(JSON.parse(localStorage.getItem(KEY)||"[]"));
document.querySelectorAll('input[type=checkbox]').forEach(cb=>{
  if(cb.checked)done.add(cb.dataset.stem); else cb.checked=done.has(cb.dataset.stem);
  cb.addEventListener('change',()=>{cb.checked?done.add(cb.dataset.stem):done.delete(cb.dataset.stem);save();});
});
function save(){localStorage.setItem(KEY,JSON.stringify([...done]));paint();}
let filter="all",q="";
function paint(){
  document.getElementById('ndone').textContent=done.size;
  document.getElementById('nleft').textContent=${entries.length}-done.size;
  document.querySelectorAll('.card').forEach(c=>{
    const d=done.has(c.dataset.stem);
    c.classList.toggle('done',d);
    const okF=filter==="all"||(filter==="done")===d;
    const okQ=!q||c.textContent.toLowerCase().includes(q);
    c.style.display=okF&&okQ?"":"none";
  });
}
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
  filter=b.dataset.f;
  document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  paint();
}));
document.getElementById('q').addEventListener('input',e=>{q=e.target.value.toLowerCase();paint();});
document.querySelectorAll('button.copy').forEach(b=>b.addEventListener('click',()=>{
  const t=b.closest('.card').querySelector('textarea');
  // A file:// page cannot rely on the async clipboard API — select-and-copy always works.
  t.select();t.setSelectionRange(0,999999);
  try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand('copy')}
  const o=b.textContent;b.textContent="Copied ✓";setTimeout(()=>b.textContent=o,1200);
}));
save();
</script>`;
writeFileSync(join(HERE, "g3-fourteen-prompts.html"), html);
console.log(`✓ wrote g3-fourteen-prompts.html (${entries.length} cards, ${salvaged} pre-ticked from the old library)`);
console.log(`✓ wrote g3-art-files.json (${entries.length} stems)`);
