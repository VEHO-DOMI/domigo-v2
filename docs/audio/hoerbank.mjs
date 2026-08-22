#!/usr/bin/env node
// R5 · S1 · DIE HÖRBANK — Kokis Ohr ist das Tor (R128).
//
// Erzeugt `docs/audio/hoerbank.html`: je Klang alle Takes nebeneinander, meine
// Vorwahl mit ★ und ihrem Grund, die Messwerte daneben, und ein Knopf je Take,
// mit dem Koki seine eigene Wahl setzt. Am Ende sammelt die Seite seine Wahlen
// als fertigen JSON-Block ein, den er zurückschicken kann — damit die Antwort
// nicht „das dritte klingt besser" heisst, sondern etwas ist, das ein Skript
// ausführen kann.
//
// Die Seite ist statisch und lokal: `open docs/audio/hoerbank.html`. Sie spielt
// die GEMUSTERTEN Takes (docs/audio/survey/, gitignored) — also alle Kandidaten
// durch dieselbe Nachbearbeitung, damit Klänge verglichen werden und nicht
// Zufälle der Lautheit.
//
// Aufruf: node docs/audio/hoerbank.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SURVEY = path.join(ROOT, "docs/audio/survey/survey.json");
const PROMPTS = path.join(ROOT, "docs/audio/prompts.ch01.json");
const REASONS = path.join(ROOT, "docs/audio/choices.reasons.json");
const CHOICES = path.join(ROOT, "docs/audio/choices.json");
const MEASURED = path.join(ROOT, "docs/audio/audio.measured.json");
/** Relativ von `docs/audio/` aus — die Seite wird dort geöffnet. */
const PUBLISHED_REL = "../../apps/web/public/audio/g1/paint/ch01";
const OUT = path.join(ROOT, "docs/audio/hoerbank.html");

const survey = JSON.parse(fs.readFileSync(SURVEY, "utf8"));
const prompts = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
const reasons = fs.existsSync(REASONS) ? JSON.parse(fs.readFileSync(REASONS, "utf8")) : {};
const choices = fs.existsSync(CHOICES) ? JSON.parse(fs.readFileSync(CHOICES, "utf8")) : {};
const measured = fs.existsSync(MEASURED) ? (JSON.parse(fs.readFileSync(MEASURED, "utf8")).files ?? {}) : {};

const items = [...(prompts.sfx ?? []), ...(prompts.music ?? [])].filter((i) => i.reserved !== true);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const takesOf = (stem) => Object.entries(survey)
  .filter(([k]) => k.split("#")[0] === stem)
  .map(([, m]) => m)
  .sort((a, b) => a.take - b.take);

const chosenTakes = (stem) => {
  const c = choices[stem];
  return c === undefined ? [] : (Array.isArray(c) ? c : [c]);
};

/** Die Dateinamen, unter denen ein Stem wirklich ausgeliefert wird. */
const filesOf = (stem, variants) =>
  (variants ?? 1) <= 1 ? [stem] : Array.from({ length: variants }, (_, i) => `${stem}-${i + 1}`);

/**
 * R5-W7 · S3 — WAS ÜBRIG BLEIBT, WENN DER AIRLOCK WEG IST.
 *
 * Diese Seite spielte bis heute ausschliesslich die gemusterten Roh-Takes aus
 * `docs/audio/survey/` — gitignored, und mit dem ersten Mac verloren (R204).
 * Damit war die ganze Hörbank tot: 38 Stems ohne einen einzigen Abspielknopf,
 * und man sah es der Seite nicht an, weil ein fehlender Take einfach keine
 * Karte erzeugt hat. Eine Hörbank ohne Ton ist schlimmer als keine — sie sieht
 * aus, als hätte man gehört.
 *
 * Also: gibt es keine Takes mehr, zeigt die Seite den AUSGELIEFERTEN Klang.
 * Der liegt im Repo, er ist genau das, was das Kind hört, und die Messwerte
 * dazu stehen in `audio.measured.json`. Was NICHT wiederkommt, sind die
 * Alternativen — und das sagt die Karte dann auch, statt es zu verschweigen.
 */
const publishedCards = (item) => {
  const kind = item.kind ?? "sfx";
  return filesOf(item.stem, item.variants).map((file, i) => {
    const m = measured[file];
    const c = m?.centroidsHz ?? [0, 0, 0];
    const dir = c[2] > c[0] * 1.1 ? "wird heller" : c[2] < c[0] * 0.9 ? "wird dunkler" : "bleibt gleich";
    return `
      <div class="take chosen">
        <div class="take-head">
          <span class="tn">★ ausgeliefert${(item.variants ?? 1) > 1 ? ` (${i + 1} von ${item.variants})` : ""}</span>
        </div>
        <audio controls preload="none" src="${PUBLISHED_REL}/${esc(kind)}/${esc(file)}.mp3"></audio>
        ${m ? `<div class="m">${m.durationSec} s · ${m.loudnessDb} ${m.method === "rms" ? "dB" : "LUFS"} · Spitze ${m.truePeakDb} dB<br>Klangfarbe ${dir}</div>` : ""}
      </div>`;
  }).join("");
};

const GROUPS = [
  { title: "Musik — die fünf Räume, der Auftakt, der Sieg", test: (i) => (i.kind ?? "") === "music" },
  { title: "Bewegung — das Kind selbst", test: (i) => i.family === "foot" || i.family === "body" },
  { title: "Die Welt — was das Kind anfasst", test: (i) => i.family === "world" || i.family === "positive" },
  { title: "Absagen und Fehltritte — hier gilt die Regel :371", test: (i) => i.pedagogy === "neutral" },
  { title: "Hülle und Karten", test: (i) => i.family === "ui" },
];

const seen = new Set();
const sections = GROUPS.map((g) => {
  const mine = items.filter((i) => !seen.has(i.stem) && g.test(i));
  for (const i of mine) seen.add(i.stem);
  return { ...g, items: mine };
}).filter((g) => g.items.length > 0);

const rowFor = (item) => {
  const takes = takesOf(item.stem);
  const chosen = chosenTakes(item.stem);
  const r = reasons[item.stem];
  const kind = item.kind ?? "sfx";
  const published = chosen.length === 1
    ? `${item.stem}.mp3`
    : chosen.map((_, i) => `${item.stem}-${i + 1}.mp3`).join(", ");

  const cards = takes.length === 0 ? publishedCards(item) : takes.map((t) => {
    const rank = chosen.indexOf(t.take);
    const star = rank >= 0;
    const why = star ? (r?.picked?.find((p) => p.take === t.take)?.why ?? "") : "";
    const rejected = r?.rejected?.find(([tk]) => tk === t.take);
    const c = t.centroidsHz;
    const dir = c[2] > c[0] * 1.1 ? "wird heller" : c[2] < c[0] * 0.9 ? "wird dunkler" : "bleibt gleich";
    return `
      <div class="take ${star ? "chosen" : ""} ${rejected ? "out" : ""}">
        <div class="take-head">
          <span class="tn">${star ? `★ ${chosen.length > 1 ? `Stufe ${rank + 1}` : "meine Wahl"}` : `Take ${t.take}`}</span>
          <label class="pick"><input type="checkbox" name="pick-${esc(item.stem)}" value="${t.take}"${star ? " checked" : ""}> nehmen</label>
        </div>
        <audio controls preload="none" src="survey/${esc(item.stem)}/take-${t.take}.mp3"></audio>
        <div class="m">${t.durationSec} s · ${t.loudnessDb} ${t.method === "rms" ? "dB" : "LUFS"} · Spitze ${t.truePeakDb} dB<br>Klangfarbe ${dir}${t.seamRatio !== null && t.seamRatio !== undefined ? ` · Naht ${t.seamRatio}` : ""}</div>
        ${star && why ? `<div class="why">${esc(why)}</div>` : ""}
        ${rejected ? `<div class="rej">zurück: ${esc(rejected[1])}</div>` : ""}
      </div>`;
  }).join("");

  return `
    <article class="stem" id="${esc(item.stem)}">
      <h3><code>${esc(item.stem)}</code> <span class="tag ${esc(item.pedagogy)}">${esc(item.pedagogy)}</span>${
        (item.variants ?? 1) > 1
          ? `<span class="need">${item.variants} Stück gesucht${["letter-take", "solve-ok", "merle-round"].includes(item.stem) ? " — es sind aufsteigende Stufen, die Reihenfolge sortiere ich nach Helligkeit" : " — sie sollen sich unterscheiden"}</span>`
          : ""}</h3>
      <p class="hangs">Klingt bei: <b>${esc(item.tap?.event ?? "—")}</b> <span class="dim">(${esc(item.tap?.union ?? "—")}${item.tap?.note ? ` · ${esc(item.tap.note)}` : ""})</span></p>
      <p class="prompt">${esc(item.text)}</p>
      <div class="takes">${cards}</div>
      ${takes.length === 0 ? `<p class="gone">Die Roh-Takes dieses Klangs lagen im Airlock (<code>docs/audio/takes/</code>, gitignored) und sind mit dem ersten Mac verloren (R204) — zu hören ist deshalb nur der ausgelieferte Klang, nicht mehr seine Alternativen. Die Gründe der damaligen Wahl stehen unten und in <code>choices.reasons.json</code>; wer wirklich neu vergleichen will, muss die Serie neu erzeugen.</p>` : ""}
      <p class="pub">Veröffentlicht als <code>${esc(published)}</code> in <code>public/audio/g1/paint/ch01/${esc(kind)}/</code>${takes.length ? ` · ${takes.length} Takes gehört, ${r?.considered ?? "?"} in der engeren Wahl` : ""}</p>
    </article>`;
};

const html = `<!doctype html>
<html lang="de">
<meta charset="utf-8">
<title>Hörbank — der Klang des Malbuchs, Kapitel 1</title>
<style>
  :root { --ink:#2b2620; --paper:#f6ecd4; --line:#d8cbb0; --dim:#7a6e5c; --ok:#2d6a4f; --out:#9b6a6a; }
  * { box-sizing: border-box; }
  body { margin:0; padding:2rem 1.25rem 6rem; background:var(--paper); color:var(--ink);
         font:16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif; }
  .wrap { max-width: 1180px; margin: 0 auto; }
  h1 { font-size:1.7rem; margin:0 0 .25rem; }
  .lede { color:var(--dim); margin:0 0 1.5rem; }
  .rules { background:#fffaf0; border:1px solid var(--line); border-radius:10px; padding:1rem 1.25rem; margin:0 0 2rem; }
  .rules ol { margin:.5rem 0 0; padding-left:1.2rem; }
  .rules li { margin:.4rem 0; }
  h2 { font-size:1.15rem; margin:2.5rem 0 .75rem; padding-bottom:.35rem; border-bottom:2px solid var(--line); }
  .stem { border:1px solid var(--line); border-radius:10px; background:#fffdf7; padding:1rem 1.1rem; margin:0 0 1.1rem; }
  .stem h3 { margin:0 0 .3rem; font-size:1rem; }
  code { background:#efe6cf; padding:.08em .35em; border-radius:4px; font-size:.92em; }
  .tag { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; padding:.1em .5em;
         border-radius:99px; background:#e6dcc2; color:var(--dim); margin-left:.4rem; }
  .tag.neutral { background:#efdcdc; color:#8a4a4a; }
  .tag.positive { background:#dcecdc; color:var(--ok); }
  .need { font-size:.75rem; color:var(--dim); font-weight:400; margin-left:.5rem; }
  .hangs { margin:.15rem 0 .35rem; font-size:.9rem; }
  .dim { color:var(--dim); }
  .prompt { margin:.35rem 0 .8rem; font-size:.86rem; color:var(--dim); font-style:italic; }
  .takes { display:grid; grid-template-columns:repeat(auto-fill, minmax(232px,1fr)); gap:.7rem; }
  .take { border:1px solid var(--line); border-radius:8px; padding:.55rem .6rem; background:#fff; }
  .take.chosen { border-color:var(--ok); box-shadow:0 0 0 2px rgba(45,106,79,.13); }
  .take.out { opacity:.55; }
  .take-head { display:flex; justify-content:space-between; align-items:center; gap:.4rem; margin-bottom:.35rem; }
  .tn { font-weight:600; font-size:.85rem; }
  .pick { font-size:.78rem; color:var(--dim); white-space:nowrap; }
  audio { width:100%; height:32px; }
  .m { font-size:.74rem; color:var(--dim); margin-top:.35rem; font-variant-numeric:tabular-nums; }
  .why { font-size:.76rem; color:var(--ok); margin-top:.3rem; }
  .gone { font-size:.78rem; color:var(--out); margin:.5rem 0 0; }
  .rej { font-size:.76rem; color:var(--out); margin-top:.3rem; }
  .pub { font-size:.76rem; color:var(--dim); margin:.7rem 0 0; }
  #bar { position:fixed; left:0; right:0; bottom:0; background:#fffaf0; border-top:1px solid var(--line);
         padding:.7rem 1.25rem; display:flex; gap:.8rem; align-items:center; justify-content:center; }
  button { font:inherit; padding:.45rem .9rem; border-radius:8px; border:1px solid var(--line);
           background:#fff; cursor:pointer; }
  #out { position:fixed; inset:8% 8% 12%; background:#fff; border:1px solid var(--line); border-radius:10px;
         padding:1rem; overflow:auto; display:none; z-index:9; }
  #out textarea { width:100%; height:88%; font:13px/1.4 ui-monospace, Menlo, monospace; }
</style>
<div class="wrap">
<h1>Hörbank — der Klang des Malbuchs, Kapitel 1</h1>
<p class="lede">Alle Kandidaten nebeneinander. Meine Vorwahl ist mit ★ markiert; du entscheidest.</p>

<div class="rules">
  <b>Drei Regeln, nach denen dieses Kapitel klingt:</b>
  <ol>
    <li><b>Alles ist aus Kreide, Papier, Holz und Filz.</b> Das Kind ist in einem gemalten Schulbuch — es gibt kein Metall, keinen Synthesizer, kein Kino. Jeder Klang wurde im selben kleinen Klassenzimmer aufgenommen, nah und ohne Hall.</li>
    <li><b>Ein Fehler klingt nie wie ein Urteil.</b> Wenn etwas nicht klappt, kommt ein weicher, gedämpfter Ton, der <i>nicht nach unten fällt</i> — kein Summer, kein trauriges Absacken. Das ist eine Hausregel aus dem Blueprint, und eine Maschine misst sie inzwischen nach.</li>
    <li><b>Die Musik trägt die Stimmung, nicht die Leistung.</b> Jeder Raum hat sein eigenes Stück; es wird nie bedrohlich, weil ein Kind etwas falsch gemacht hat. Die Tafel im Boss-Raum ist <i>grantig, nicht böse</i> — sie wird sauber gemacht, nicht besiegt.</li>
  </ol>
  <p style="margin:.7rem 0 0"><b>So gehst du vor:</b> hör dir je Zeile die Takes an, klick bei dem, der dir am besten gefällt, auf „nehmen". Ganz unten sammelst du deine Wahlen mit einem Klick als Textblock ein und schickst ihn zurück — dann wird genau das veröffentlicht. Wo du nichts änderst, bleibt meine Vorwahl (★).</p>
</div>

${sections.map((g) => `<h2>${esc(g.title)}</h2>\n${g.items.map(rowFor).join("\n")}`).join("\n")}
</div>

<div id="bar">
  <button onclick="collect()">Meine Wahlen einsammeln</button>
  <span class="dim">— ergibt einen Textblock zum Zurückschicken</span>
</div>
<div id="out"><button onclick="document.getElementById('out').style.display='none'">schliessen</button>
  <p class="dim">Diesen Block an Claude zurückschicken:</p><textarea id="ta"></textarea></div>

<script>
function collect() {
  const out = {};
  document.querySelectorAll('.stem').forEach(function (el) {
    const stem = el.id;
    const boxes = el.querySelectorAll('input[type=radio]:checked');
    const vals = Array.from(boxes).map(function (b) { return Number(b.value); });
    if (vals.length) out[stem] = vals.length === 1 ? vals[0] : vals;
  });
  document.getElementById('ta').value = JSON.stringify(out, null, 2);
  document.getElementById('out').style.display = 'block';
}
</script>
</html>
`;

fs.writeFileSync(OUT, html);
console.log(`hoerbank: ${OUT} — ${items.length} Klaenge, ${Object.keys(survey).length} Takes zum Hoeren.`);
