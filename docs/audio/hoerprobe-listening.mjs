#!/usr/bin/env node
// K5a · DIE HÖRPROBE — Kokis Ohr ist das Tor (R128, wie bei der Klang-Hörbank).
//
// Erzeugt `apps/web/public/hoerprobe-k5a.html`: die heutige Browser-Roboter-
// stimme und die ElevenLabs-Kandidaten nebeneinander, am GLEICHEN Text, mit
// den Messwerten daneben — und einem Wahl-Knopf, der Kokis Urteil als fertigen
// Block einsammelt. Damit die Antwort nicht „das dritte klingt besser" heisst,
// sondern etwas ist, mit dem der Architekt eine Route münzen kann.
//
// ── Zwei Vorkehrungen gegen zwei bezahlte Fallen ─────────────────────────────
// D-650: eine Rangfolgen-Frage misst die REIHENFOLGE — beide Leser krönten ihr
//   erstes Bild. Deshalb hat die Seite einen Misch-Knopf: die Kandidaten
//   stehen in zufälliger Ordnung, und Koki kann neu mischen.
// T2: mein Brief nannte die Figur und machte das Panel unvergleichbar — hier
//   stehen meine Wetten (welche Stimme warum) EINGEKLAPPT. Erst hören, dann
//   aufklappen.
//
// Die Roboter-Seite spricht mit EXAKT den Einstellungen des echten Abspielers
// (packages/task-ui/src/index.tsx#AudioClip: `en-GB`, rate 0.85) — sonst
// verglichen wir unsere Roboter-Nachstellung und nicht das Produkt.
//
// Aufruf: node docs/audio/hoerprobe-listening.mjs   →   open apps/web/public/hoerprobe-k5a.html

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ORDER = path.join(ROOT, "docs/audio/listening-voices.json");
const MEASURED = path.join(ROOT, "docs/audio/listening-measured.json");
const UNITS = path.join(ROOT, "content/corpus/units");
/**
 * Die Seite liegt in `apps/web/public/` und NICHT in `docs/` — aus einem Grund,
 * der erst am fertigen Zweig sichtbar wurde: der Vercel-Preview steht hinter
 * Vercels eigener Anmeldung, und genau diesen Preview öffnet Koki ohnehin, um
 * die Stimme im ECHTEN Abspieler zu hören. Von dort aus ist die Hörprobe ein
 * Klick entfernt (`<preview>/hoerprobe-k5a.html`) statt einer Repo-Auscheckung.
 * Lokal tut es dieselbe Datei per `open apps/web/public/hoerprobe-k5a.html`.
 * ⚠ Rauchtest-Artefakt: fällt weg, sobald die Route entschieden ist.
 */
const OUT = path.join(ROOT, "apps/web/public/hoerprobe-k5a.html");
/** Relativ von `apps/web/public/` aus — Geschwisterpfad, lokal wie ausgeliefert. */
const PUBLIC_REL = ".";

const order = JSON.parse(fs.readFileSync(ORDER, "utf8"));
const measured = JSON.parse(fs.readFileSync(MEASURED, "utf8"));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const scriptOf = (unit, taskKey) => {
  const j = JSON.parse(fs.readFileSync(path.join(UNITS, unit, "listening.json"), "utf8"));
  const t = j.tasks.find((x) => x.key === taskKey);
  return { script: t.audio.script, titleDe: t.titleDe, live: t.audio.file };
};

const rows = Object.entries(measured.files).map(([rel, m]) => ({ rel, ...m }));

const cards = [];
for (const piece of order.pieces) {
  const { script, titleDe, live } = scriptOf(piece.unit, piece.taskKey);
  const mine = rows.filter((r) => r.unit === piece.unit && r.taskKey === piece.taskKey);
  cards.push({ piece, script, titleDe, live, takes: mine });
}

const takeHtml = (t, order2) => {
  const v = order.voices.find((x) => x.slug === t.voiceSlug) ?? {};
  return `
    <div class="take" data-slug="${esc(t.voiceSlug)}" style="order:${order2}">
      <div class="badge">Kandidat <span class="letter">?</span></div>
      <audio controls preload="none" src="${esc(PUBLIC_REL + t.rel)}"></audio>
      <div class="nums">${t.durationSec}s · ${t.loudnessDb} LUFS · True Peak ${t.truePeakDb} dBFS · Stille ${t.headSilenceMs}/${t.tailSilenceMs} ms</div>
      <button class="pick" data-slug="${esc(t.voiceSlug)}">Diese nehmen</button>
      <details><summary>Wer das ist und warum ich sie bestellt habe</summary>
        <p class="who"><strong>${esc(t.voiceName)}</strong><br>${esc(v.wette ?? "")}</p>
        <p class="dim">Modell ${esc(t.modelId)} · Tempo ${t.voiceSettings?.speed ?? "—"} · Stabilität ${t.voiceSettings?.stability} · Datei <code>${esc(t.rel)}</code></p>
      </details>
    </div>`;
};

const body = cards.map((c) => `
  <section class="piece">
    <h2>${esc(c.titleDe)} <span class="dim">— ${esc(c.piece.unit)} / ${esc(c.piece.taskKey)}</span></h2>
    <details class="script"><summary>Der gesprochene Text (mitlesen)</summary><p>${esc(c.script)}</p></details>

    <div class="robot">
      <div class="badge red">So klingt es HEUTE im Produkt</div>
      <p class="dim">Die Stimme deines Browsers, mit exakt den Einstellungen des echten Abspielers: Englisch (GB), Tempo 0,85.
         Sie klingt auf jedem Gerät etwas anders — das ist genau das Problem.</p>
      <button id="robot-play">▶ Roboterstimme anhören</button>
      <button id="robot-stop" class="ghost">Stopp</button>
      <span id="robot-note" class="dim"></span>
      <script type="application/json" class="robot-script">${JSON.stringify(c.script)}</script>
    </div>

    <div class="takes">${c.takes.map((t, i) => takeHtml(t, i)).join("")}</div>
    <p><button id="shuffle" class="ghost">↻ Kandidaten neu mischen</button></p>
    <p class="dim">Und so klingt es im echten Produkt, mit der zurzeit eingehängten Datei:
       <a href="/listening/${esc(c.piece.unit)}">/listening/${esc(c.piece.unit)}</a> → auf „Play audio“ drücken.
       Kommt dort eine <em>Stimme</em> statt des Roboters, zieht der Datei-Zweig${c.live ? "" : " — zurzeit ist keine Datei eingehängt"}.</p>
  </section>`).join("");

const html = `<!doctype html>
<html lang="de">
<meta charset="utf-8">
<title>Hörprobe — echte Stimmen fürs Hörverstehen (K5a)</title>
<style>
  :root { --ink:#2b2620; --paper:#f6ecd4; --line:#d8cbb0; --dim:#7a6e5c; --ok:#2d6a4f; --warn:#9b6a6a; }
  * { box-sizing: border-box; }
  body { margin:0; padding:2rem 1.25rem 6rem; background:var(--paper); color:var(--ink);
         font:16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif; }
  .wrap { max-width: 940px; margin: 0 auto; }
  h1 { font-size:1.7rem; margin:0 0 .25rem; }
  .lede { color:var(--dim); margin:0 0 1.5rem; }
  .rules { background:#fffaf0; border:1px solid var(--line); border-radius:10px; padding:1rem 1.25rem; margin:0 0 2rem; }
  .rules ol { margin:.5rem 0 0; padding-left:1.2rem; } .rules li { margin:.4rem 0; }
  h2 { font-size:1.15rem; margin:2.5rem 0 .75rem; padding-bottom:.35rem; border-bottom:2px solid var(--line); }
  .dim { color:var(--dim); font-size:.88rem; }
  .robot { border:1px dashed var(--warn); border-radius:10px; padding:.9rem 1.1rem; margin:0 0 1.25rem; background:#fdf4f4; }
  .badge { font-size:.72rem; text-transform:uppercase; letter-spacing:.06em; padding:.12em .55em;
           border-radius:99px; background:#e6dcc2; color:var(--dim); display:inline-block; margin-bottom:.45rem; }
  .badge.red { background:#efdcdc; color:#8a4a4a; }
  .takes { display:flex; flex-wrap:wrap; gap:.9rem; }
  .take { flex:1 1 270px; border:1px solid var(--line); border-radius:10px; padding:.8rem .9rem; background:#fffdf7; }
  .take.chosen { border-color:var(--ok); box-shadow:0 0 0 2px rgba(45,106,79,.15); }
  .take audio { width:100%; margin:.2rem 0 .45rem; }
  .nums { font-size:.78rem; color:var(--dim); margin-bottom:.5rem; }
  .letter { font-weight:700; }
  button { font:inherit; padding:.35rem .8rem; border-radius:7px; border:1px solid var(--line);
           background:#fff; cursor:pointer; }
  button.ghost { background:transparent; color:var(--dim); }
  .pick { border-color:var(--ok); color:var(--ok); font-weight:600; }
  details { margin:.4rem 0; } summary { cursor:pointer; font-size:.88rem; color:var(--dim); }
  details.script p { background:#fffdf7; border:1px solid var(--line); border-radius:8px; padding:.7rem .9rem; font-size:.92rem; }
  code { background:#efe6cf; padding:.08em .35em; border-radius:4px; font-size:.9em; }
  /* NICHT sticky: am eigenen Bau gesehen — ein am Fensterboden klebender Kasten
     verdeckt auf einem flachen Fenster genau die Kandidaten, die er einsammeln
     soll. Er steht am Ende, wo man nach dem Hören ohnehin ankommt. */
  #verdict { margin-top:2.5rem; background:#fffaf0; border:1px solid var(--line);
             border-radius:10px; padding:1rem 1.15rem; }
  textarea { width:100%; min-height:5.5rem; font:14px/1.45 ui-monospace, Menlo, monospace;
             border:1px solid var(--line); border-radius:8px; padding:.6rem; background:#fff; }
  .out { white-space:pre-wrap; font:13px/1.5 ui-monospace, Menlo, monospace; background:#fff;
         border:1px solid var(--line); border-radius:8px; padding:.7rem; margin-top:.6rem; }
</style>
<div class="wrap">
<h1>Hörprobe: echte Stimmen fürs Hörverstehen</h1>
<p class="lede">Ein Rauchtest an der Kalibrier-Einheit g2-u02. Dein Ohr entscheidet, ob die ganze Hör-Welle diese Route bekommt.</p>

<div class="rules">
  <strong>So urteilst du</strong>
  <ol>
    <li>Zuerst die <em>Roboterstimme</em> — das ist der Stand, den die Kinder heute hören.</li>
    <li>Dann die Kandidaten. Sie stehen in <strong>zufälliger Reihenfolge</strong> und heissen absichtlich nur „Kandidat A/B/C“ — wer sie sind und warum ich sie bestellt habe, steht eingeklappt darunter. Erst hören, dann aufklappen.</li>
    <li>Frage 1 (das eigentliche Tor): <strong>Ist irgendeine davon gut genug für den Unterricht?</strong> Wenn nein, reicht ein Nein — die Route ist tot und der Architekt bekommt den Befund.</li>
    <li>Frage 2 (nur bei Ja): <strong>Welche?</strong> Sie wird die Stimme der ganzen Welle.</li>
    <li>Alle drei sind auf dieselbe Lautstärke gebracht (−16 LUFS) und laufen mit demselben Tempo. Was du hörst, ist der Unterschied der <em>Stimme</em>, nicht der Aufnahme.</li>
  </ol>
</div>

${body}

<div id="verdict">
  <strong>Dein Urteil</strong>
  <p class="dim" id="state">Noch nichts gewählt.</p>
  <textarea id="note" placeholder="Ein Satz, warum — oder was fehlt. (z. B. „zu langsam“, „klingt erwachsen“, „ja, aber Tempo runter“)"></textarea>
  <p>
    <button id="yes">Ja — diese Route nehmen</button>
    <button id="no" class="ghost">Nein — Route zurück an den Architekten</button>
  </p>
  <div class="out" id="out">Wähle oben einen Kandidaten oder drücke „Nein“.</div>
</div>
</div>

<script>
(() => {
  const LETTERS = "ABC";
  const takes = [...document.querySelectorAll(".take")];
  let picked = null;

  const shuffle = () => {
    const idx = takes.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    takes.forEach((el, i) => { el.style.order = idx[i]; el.querySelector(".letter").textContent = LETTERS[idx[i]] ?? String(idx[i] + 1); });
  };
  shuffle();
  document.getElementById("shuffle")?.addEventListener("click", shuffle);

  takes.forEach((el) => el.querySelector(".pick").addEventListener("click", () => {
    takes.forEach((x) => x.classList.remove("chosen"));
    el.classList.add("chosen");
    picked = { slug: el.dataset.slug, letter: el.querySelector(".letter").textContent };
    document.getElementById("state").textContent = "Gewählt: Kandidat " + picked.letter + " (" + picked.slug + ")";
  }));

  // Die Roboterstimme — exakt die Einstellungen des echten Abspielers.
  const scriptEl = document.querySelector(".robot-script");
  const text = scriptEl ? JSON.parse(scriptEl.textContent) : "";
  const note = document.getElementById("robot-note");
  document.getElementById("robot-play")?.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) { note.textContent = "Dieser Browser kann gar nicht vorlesen."; return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.85;
    const v = window.speechSynthesis.getVoices().find((x) => x.lang === "en-GB");
    note.textContent = v ? "Browserstimme: " + v.name : "Keine en-GB-Stimme installiert — der Browser nimmt eine andere.";
    window.speechSynthesis.speak(u);
  });
  document.getElementById("robot-stop")?.addEventListener("click", () => window.speechSynthesis.cancel());

  const emit = (verdict) => {
    const payload = {
      rauchtest: "K5a", einheit: "g2-u02", aufgabe: "museum",
      urteil: verdict,
      stimme: verdict === "ja" ? (picked ? picked.slug : null) : null,
      bemerkung: document.getElementById("note").value.trim() || null,
    };
    document.getElementById("out").textContent =
      (verdict === "ja" && !picked)
        ? "Bitte oben erst einen Kandidaten wählen — sonst weiss der Architekt nicht, WELCHE Stimme die Welle bekommt."
        : "Diesen Block zurückschicken:\\n\\n" + JSON.stringify(payload, null, 2);
  };
  document.getElementById("yes").addEventListener("click", () => emit("ja"));
  document.getElementById("no").addEventListener("click", () => emit("nein"));
})();
</script>
`;

fs.writeFileSync(OUT, html);
console.log(`✓ ${path.relative(ROOT, OUT)} — ${rows.length} Kandidat(en), ${cards.length} Stück`);
