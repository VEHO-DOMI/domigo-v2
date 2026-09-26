#!/usr/bin/env node
// BRAND-2 · srdp-069 · DIE DACH-SCHICHT KOMMT DARÜBER, NIE STATT.
//
// DomiGo gehört ab diesem Schritt sichtbar zum Dach »Lauter Einser«: eine Kopfzeile mit
// drei Zonen und eine Farbschicht (`--le-*`). Beides kommt aus EINER Quelle, die S2 pflegt
// (CODEX-ABLAGE-MARKE/tokens/), und jede App vendort davon eine Kopie. Genau das ist die
// Stelle, an der so etwas still auseinanderläuft: jemand »verbessert« eine Farbe in der
// Kopie, und die drei Apps tragen drei Dächer. Und genauso still kann die Schicht das
// verdrängen, was sie nur überdachen soll — die vier Stufenfarben, das Grün der
// Kachel-Kunst, das Spiel.
//
// Gestaltungsregel des Dachs §2 + §6 Zusatz 2 verlangt deshalb in jedem Repo ein Tor
// `test:umbrella-tokens` mit denselben zwei sha256. Dieses hier prüft, gespiegelt aus
// srdp-practice (BRAND-1 V2, scripts/test-umbrella-tokens.ts) und an DomiGo angepasst:
//
//   pins      · le-tokens.css und le-werkzeuge.json sind byte-gleich zur Quelle
//   import    · globals.css holt le-tokens.css direkt nach tailwindcss (also ÜBER DomiGos
//               :root) und le-kopf.css gleich danach
//   stufen    · :root und die drei [data-grade]-Blöcke sind byte-gleich zum Stand vor BRAND-2,
//               und die Akzentwerte stehen als lesbarer Text daneben (die Meldung nennt den Wert)
//   gruen     · DOMIGO_GREEN in packages/art-gen/src/theme.ts ist "#16a34a"
//   play      · BrandHeader behält die /play/[1-4]-Weiche und gibt dort die bisherige
//               Kopfzeile zurück — ohne eine einzige Dach-Zone (Kokis Urteil 14.09.)
//   kopf-css  · le-kopf.css spricht nur .le-*-Selektoren, --le-*-Variablen, keine Farbwerte
//   alt       · keine alte Adresse (app.lautereinser / go.lautereinser) in apps/ packages/ scripts/
//   hosts     · keine Werkzeug-Adresse (<sub>.lautereinser.at) außerhalb von le-werkzeuge.json
//
// ── Warum die Apex-Adresse erlaubt ist ──────────────────────────────────────
// `https://lautereinser.at` (ohne Subdomain) ist KEIN Werkzeug, sondern die Weiche — die
// Gestaltungsregel §1 schreibt sie als Link der Zone links fest, und sie steht deshalb in
// keiner Werkzeug-Liste. Verboten ist, was die Liste doppeln würde: jede Subdomain.
//
// ── Warum der Selbsttest die ECHTEN Dateien manipuliert ─────────────────────
// Jeder Fall nimmt eine Kopie der echten Lesestrecke im Speicher, ändert genau eine Sache
// und verlangt, dass GENAU die zuständige Prüfung rot wird — und dass dieselbe Prüfung
// auf dem unveränderten Stand grün war. Ein rotes Licht, das auch ohne Manipulation brennt,
// beweist nichts. (House convention: der Selbsttest endet mit 0, wenn er seine roten
// Lichter gesehen hat.)
//
// Run: node scripts/check-umbrella-tokens.mjs            (exit 1 bei jedem Verstoß)
//      node scripts/check-umbrella-tokens.mjs --selftest (beweist, dass jedes rote Licht geht)

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");
const SELF = "scripts/check-umbrella-tokens.mjs";

// ── Die Pins ────────────────────────────────────────────────────────────────
// Quelle: CODEX-ABLAGE-MARKE/tokens/tokens.json, Fassung 2026-09-18 (S2). Dieselben zwei
// Werte stehen in jeder Lauter-Einser-App (Gestaltungsregel §6 Zusatz 2).
// le-werkzeuge.json: Bereichs-Liste Fassung 6 (26.09., dach-137: pup zeigt »Psychologie und
// Philosophie — LautGedacht«, ohne Stufe; 4138 B). Davor 83194a51… = Fassung 5 (marke-038).
const SHA256_LE_TOKENS = "993eff17957e302356067bab76fa592717c76c69a3673be0f44841ea7d9fdf2a";
const SHA256_LE_WERKZEUGE = "bb96e3828e17c1fdeffc3902b2be2b094c1a9bb85798b58bf70b73a209ca4dc6";

// Alte Bereichsnamen (marke-038). ⚠ »Finale« ist in diesem Repo überwiegend ein SPIELWORT — die
// letzte Karte eines Kapitels (isFinale, answerFinale, postponedFinale, »Finale-Karte«).
// Gemessen am 21.09.: 17 Fundstellen außerhalb von docs/, davon EINE der Bereichsname.
// Die Prüfung sieht deshalb nur die Dach-Flächen, nie packages/ und nie apps/web/app/(game)/.
const ALTE_NAMEN = ["Finale", "Denkraum", "Englisch · Matura"];
const DACH_FLAECHEN = ["apps/web/app/le/", "apps/web/app/le-kopf.css", "apps/web/app/BrandHeader.tsx", "apps/web/lib/"];

// :root + die drei [data-grade]-Blöcke, von `:root {` bis zur schließenden Klammer von
// [data-grade="4"], gemessen an main 4de2fc9d (globals.css Z. 11–105 vor BRAND-2).
const SHA256_STUFEN_BLOCK = "f9f5bab134521cf7234ce1661145a21d75c6eb73fc16d5533e19f69c1f56c3fd";

// Die lesbare Hälfte desselben Pins: jede Zeile muss wörtlich im jeweiligen Block stehen.
const STUFEN_ZEILEN = {
  ":root": [
    "  --bg:           #edf4ff;",
    "  --accent:       #2563eb;",
    "  --accent-deep:  #1d4ed8;",
    "  --accent-light: #3b82f6;",
    "  --accent-soft:  rgba(37, 99, 235, 0.12);",
    "  --accent-glow:  rgba(37, 99, 235, 0.15);",
    "  --logo-gradient: linear-gradient(140deg, #3b82f6, #8ba4cc 50%, #d4943a 90%);",
  ],
  '[data-grade="1"]': [
    "  --accent: #16a34a; --accent-deep: #15803d; --accent-light: #22c55e;",
    "  --accent-soft: rgba(22, 163, 74, 0.12); --accent-glow: rgba(22, 163, 74, 0.15);",
    "  --rule: rgba(22, 163, 74, 0.16); --card-border: rgba(22, 163, 74, 0.16);",
    "  --bg: #eefbf2; --bg-sunken: #d8f5e1; --card-hover: #f4fcf6;",
    "  --logo-gradient: linear-gradient(140deg, #16a34a, #22c55e 40%, #15803d 80%);",
  ],
  '[data-grade="2"]': [
    "  --accent: #dc2626; --accent-deep: #b91c1c; --accent-light: #ef4444;",
    "  --accent-soft: rgba(220, 38, 38, 0.12); --accent-glow: rgba(220, 38, 38, 0.15);",
    "  --rule: rgba(220, 38, 38, 0.16); --card-border: rgba(200, 40, 40, 0.14);",
    "  --bg: #fdf0f0; --bg-sunken: #fbe4e4; --card-hover: #fdf5f5;",
    "  --logo-gradient: linear-gradient(140deg, #d43a2a, #e8654a 40%, #b82e1e 80%);",
  ],
  '[data-grade="4"]': [
    "  --accent: #7c3aed; --accent-deep: #6d28d9; --accent-light: #8b5cf6;",
    "  --accent-soft: rgba(124, 58, 237, 0.12); --accent-glow: rgba(124, 58, 237, 0.15);",
    "  --rule: rgba(124, 58, 237, 0.16); --card-border: rgba(124, 58, 237, 0.18);",
    "  --bg: #f6f0ff; --bg-sunken: #ece2fb; --card-hover: #faf6ff;",
    "  --logo-gradient: linear-gradient(140deg, #9b6dff, #c4a8f0 50%, #d4943a 90%);",
  ],
};

// Die bisherige Kopfzeile, wie sie auf /play/[1-4] stehen bleiben muss (main 4de2fc9d,
// BrandHeader.tsx). Wörtlich, Zeile für Zeile, ohne Einrückung verglichen.
const PLAY_REGEX = String.raw`/^\/play\/([1-4])(?:\/|$)/`;
const PLAY_MARKUP = [
  `<header className="dg-app-header" data-grade={grade} style={{ background: "var(--bg)" }}>`,
  `<div className="dg-glow" aria-hidden="true" />`,
  `<a href="/home" className="brand-wordmark" style={{ fontSize: 30, position: "relative", lineHeight: 1 }}>DomiGo</a>`,
  `<div className="dg-tagline">English · Vocabulary &amp; Grammar</div>`,
  `</header>`,
];
const DACH_SPUREN = ["le-", "SternZeichen", "WerkzeugWechsler", "Lauter Einser", "lautereinser"];

const P = {
  tokens: "apps/web/app/le-tokens.css",
  werkzeuge: "apps/web/app/le-werkzeuge.json",
  globals: "apps/web/app/globals.css",
  kopfCss: "apps/web/app/le-kopf.css",
  header: "apps/web/app/BrandHeader.tsx",
  theme: "packages/art-gen/src/theme.ts",
};

const ALTE_ADRESSEN = ["app.lautereinser", "go.lautereinser"];
const HOST_RE = /\b[a-z0-9-]+\.lautereinser\.at\b/gi;
const SCAN_ROOTS = ["apps", "packages", "scripts"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".turbo", "coverage", ".vercel"]);
const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|mts|json|css|md|html|txt|yml|yaml|svg)$/;

// ── Lesen ───────────────────────────────────────────────────────────────────
function readReal() {
  const files = new Map();
  for (const rel of Object.values(P)) {
    const abs = path.join(R, rel);
    files.set(rel, fs.existsSync(abs) ? fs.readFileSync(abs) : null);
  }
  const scan = new Map();
  const walk = (dirRel) => {
    const abs = path.join(R, dirRel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        walk(path.join(dirRel, e.name));
      } else if (TEXT_EXT.test(e.name)) {
        const rel = path.join(dirRel, e.name).split(path.sep).join("/");
        if (rel === SELF) continue; // das Tor nennt die Muster, die es jagt
        scan.set(rel, fs.readFileSync(path.join(abs, e.name), "utf8"));
      }
    }
  };
  for (const r of SCAN_ROOTS) walk(r);
  return { files, scan };
}

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const text = (state, rel) => (state.files.get(rel) ?? Buffer.from("")).toString("utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Ein CSS-Block von `<selector> {` bis zur ersten Zeile, die nur `}` ist. */
function cssBlock(css, selector) {
  const start = css.indexOf(`\n${selector} {\n`);
  if (start < 0) return null;
  const end = css.indexOf("\n}\n", start + 1);
  if (end < 0) return null;
  return css.slice(start + 1, end + 2);
}

// ── Die Prüfungen ───────────────────────────────────────────────────────────
// Jede gibt eine Liste von Befunden zurück; leer = grün.
const CHECKS = {
  pins(state) {
    const out = [];
    for (const [rel, pin] of [[P.tokens, SHA256_LE_TOKENS], [P.werkzeuge, SHA256_LE_WERKZEUGE]]) {
      const buf = state.files.get(rel);
      if (!buf) { out.push(`${rel} fehlt — neu vendorn aus CODEX-ABLAGE-MARKE/tokens/`); continue; }
      const got = sha256(buf);
      if (got !== pin) out.push(`${rel} sha256 ${got} ≠ Pin ${pin} — die Kopie weicht von der Quelle ab; nie in der Kopie ändern, sondern Quelle ändern, neu vendorn, neu pinnen`);
    }
    return out;
  },

  import(state) {
    const lines = stripCssComments(text(state, P.globals)).split("\n").map((l) => l.trim()).filter(Boolean);
    const imports = lines.filter((l) => l.startsWith("@import"));
    const want = ['@import "tailwindcss";', '@import "./le-tokens.css";', '@import "./le-kopf.css";'];
    const got = imports.slice(0, 3);
    if (want.some((w, i) => got[i] !== w)) {
      return [`${P.globals}: die ersten drei @import müssen ${want.join(" · ")} sein (die Dach-Tokens ÜBER DomiGos :root) — gefunden: ${got.join(" · ") || "(keine)"}`];
    }
    const firstRule = lines.findIndex((l) => !l.startsWith("@import"));
    const lastImport = lines.findLastIndex((l) => l.startsWith("@import"));
    if (firstRule >= 0 && lastImport > firstRule) return [`${P.globals}: ein @import steht nach der ersten Regel und wird vom Browser verworfen`];
    return [];
  },

  stufen(state) {
    const out = [];
    const css = text(state, P.globals);
    const start = css.indexOf("\n:root {\n");
    const g4 = cssBlock(css, '[data-grade="4"]');
    if (start < 0 || !g4) return [`${P.globals}: :root oder [data-grade="4"] nicht gefunden`];
    const end = css.indexOf(g4) + g4.length + 1; // samt dem Zeilenende nach der letzten `}`
    const got = sha256(css.slice(start + 1, end));
    if (got !== SHA256_STUFEN_BLOCK) out.push(`${P.globals}: :root + [data-grade]-Blöcke sha256 ${got} ≠ Pin ${SHA256_STUFEN_BLOCK} — die Stufenfarben bleiben byte-gleich (Gestaltungsregel §3)`);
    for (const [sel, zeilen] of Object.entries(STUFEN_ZEILEN)) {
      const block = cssBlock(css, sel);
      if (!block) { out.push(`${P.globals}: Block ${sel} fehlt`); continue; }
      const blockLines = new Set(block.split("\n"));
      for (const z of zeilen) if (!blockLines.has(z)) out.push(`${P.globals}: ${sel} trägt nicht mehr »${z.trim()}«`);
    }
    if (cssBlock(css, '[data-grade="3"]')) out.push(`${P.globals}: ein [data-grade="3"]-Block ist aufgetaucht — Stufe 3 ist das :root-Blau`);
    return out;
  },

  gruen(state) {
    const m = text(state, P.theme).match(/export const DOMIGO_GREEN\s*=\s*"([^"]*)"/);
    if (!m) return [`${P.theme}: export const DOMIGO_GREEN nicht gefunden`];
    return m[1] === "#16a34a" ? [] : [`${P.theme}: DOMIGO_GREEN = "${m[1]}" ≠ "#16a34a" (Kachel-Kunst = Stufe-1-Akzent)`];
  },

  play(state) {
    const src = text(state, P.header);
    const out = [];
    if (!src.includes(PLAY_REGEX)) out.push(`${P.header}: die /play-Weiche ${PLAY_REGEX} fehlt oder ist verändert`);
    const at = src.indexOf("if (grade) {");
    if (at < 0) return [...out, `${P.header}: der frühe Rücksprung »if (grade) { return … }« fehlt`];
    const endAt = src.indexOf("\n  }\n", at);
    const early = endAt < 0 ? src.slice(at) : src.slice(at, endAt);
    const earlyLines = early.split("\n").map((l) => l.trim());
    let from = 0;
    for (const line of PLAY_MARKUP) {
      const i = earlyLines.indexOf(line, from);
      if (i < 0) { out.push(`${P.header}: im /play-Rücksprung fehlt die bisherige Zeile »${line}«`); break; }
      from = i + 1;
    }
    const markupLines = earlyLines.filter((l) => l.startsWith("<"));
    if (markupLines.length !== PLAY_MARKUP.length) out.push(`${P.header}: der /play-Rücksprung trägt ${markupLines.length} Markup-Zeilen statt ${PLAY_MARKUP.length} — dort steht nur die bisherige Kopfzeile`);
    for (const spur of DACH_SPUREN) if (early.includes(spur)) out.push(`${P.header}: im /play-Rücksprung steht »${spur}« — auf /play/[1-4] keine Dach-Zonen (Kokis Urteil 14.09.)`);
    const firstDach = Math.min(...DACH_SPUREN.map((s) => src.indexOf(s, src.indexOf("export default function")) ).filter((i) => i >= 0));
    if (Number.isFinite(firstDach) && firstDach < at) out.push(`${P.header}: Dach-Markup steht VOR dem /play-Rücksprung`);
    return out;
  },

  "kopf-css"(state) {
    const buf = state.files.get(P.kopfCss);
    if (!buf) return [`${P.kopfCss} fehlt`];
    const css = stripCssComments(buf.toString("utf8"));
    const out = [];
    const props = css.match(/--[A-Za-z0-9_-]+(?=\s*:)/g) ?? [];
    const fremd = props.filter((p) => !p.startsWith("--le-"));
    if (fremd.length) out.push(`${P.kopfCss}: fremde Variablen deklariert: ${fremd.join(" ")}`);
    const preludes = css.split("{").slice(0, -1).map((chunk) => chunk.split(/[;}]/).pop().trim());
    for (const prelude of preludes) {
      if (!prelude || prelude.startsWith("@")) continue;
      for (const sel of prelude.split(",").map((s) => s.trim())) {
        if (!sel.includes(".le-")) out.push(`${P.kopfCss}: Selektor ohne .le-: »${sel}«`);
      }
    }
    const vars = [...css.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)].map((m) => m[1]);
    const fremdVars = vars.filter((v) => !v.startsWith("--le-"));
    if (fremdVars.length) out.push(`${P.kopfCss}: liest fremde Variablen: ${fremdVars.join(" ")}`);
    const farben = css.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? [];
    if (farben.length) out.push(`${P.kopfCss}: Farbwerte statt --le-*: ${farben.join(" ")}`);
    return out;
  },

  alt(state) {
    const out = [];
    for (const [rel, src] of state.scan) {
      src.split("\n").forEach((line, i) => {
        for (const alt of ALTE_ADRESSEN) if (line.includes(alt)) out.push(`${rel}:${i + 1} alte Adresse »${alt}«`);
      });
    }
    return out;
  },

  hosts(state) {
    const out = [];
    for (const [rel, src] of state.scan) {
      if (rel === P.werkzeuge) continue; // die EINE Heimat der Werkzeug-Adressen
      src.split("\n").forEach((line, i) => {
        for (const m of line.matchAll(HOST_RE)) out.push(`${rel}:${i + 1} Werkzeug-Adresse »${m[0]}« außerhalb von ${P.werkzeuge}`);
      });
    }
    return out;
  },

  namen(state) {
    const out = [];
    for (const [rel, src] of state.scan) {
      if (rel === P.werkzeuge) continue; // die EINE Heimat der Namen
      if (!DACH_FLAECHEN.some((pfad) => rel === pfad || rel.startsWith(pfad))) continue;
      src.split("\n").forEach((line, i) => {
        for (const alt of ALTE_NAMEN) {
          if (line.includes(alt)) out.push(`${rel}:${i + 1} alter Bereichsname »${alt}« — der Name kommt aus ${P.werkzeuge}`);
        }
      });
    }
    return out;
  },
};

function run(state) {
  const findings = {};
  for (const [name, fn] of Object.entries(CHECKS)) findings[name] = fn(state);
  return findings;
}

// ── Selbsttest ──────────────────────────────────────────────────────────────
function clone(state) {
  return { files: new Map(state.files), scan: new Map(state.scan) };
}
const editText = (state, rel, fn) => {
  const s = clone(state);
  const before = text(s, rel);
  const after = fn(before);
  if (after === before) throw new Error(`Selbsttest-Fall trifft nichts in ${rel} — die Manipulation ist ins Leere gelaufen`);
  s.files.set(rel, Buffer.from(after, "utf8"));
  return s;
};

const FAELLE = [
  { name: "ein Byte in le-tokens.css", check: "pins",
    make: (s) => { const c = clone(s); const b = Buffer.from(c.files.get(P.tokens)); b[b.length - 2] ^= 1; c.files.set(P.tokens, b); return c; } },
  { name: "ein Byte in le-werkzeuge.json", check: "pins",
    make: (s) => { const c = clone(s); const b = Buffer.from(c.files.get(P.werkzeuge)); b[10] ^= 1; c.files.set(P.werkzeuge, b); return c; } },
  { name: "le-tokens.css-Import entfernt", check: "import",
    make: (s) => editText(s, P.globals, (t) => t.replace('@import "./le-tokens.css";\n', "")) },
  { name: "le-tokens.css nach DomiGos :root importiert", check: "import",
    make: (s) => editText(s, P.globals, (t) => t.replace('@import "./le-tokens.css";\n', "").replace("\n:root {\n", '\n@import "./le-tokens.css";\n:root {\n')) },
  { name: "Stufe 1 grün um eins verschoben", check: "stufen",
    make: (s) => editText(s, P.globals, (t) => t.replace("--accent: #16a34a;", "--accent: #16a34b;")) },
  { name: ":root-Akzent geändert", check: "stufen",
    make: (s) => editText(s, P.globals, (t) => t.replace("  --accent:       #2563eb;", "  --accent:       #265e78;")) },
  { name: "DOMIGO_GREEN geändert", check: "gruen",
    make: (s) => editText(s, P.theme, (t) => t.replace('DOMIGO_GREEN = "#16a34a"', 'DOMIGO_GREEN = "#15803d"')) },
  { name: "/play-Weiche auf Stufe 1–3 verengt", check: "play",
    make: (s) => editText(s, P.header, (t) => t.replace("([1-4])", "([1-3])")) },
  { name: "Dach-Zeichen in den /play-Rücksprung geschoben", check: "play",
    make: (s) => editText(s, P.header, (t) => t.replace(`<div className="dg-glow" aria-hidden="true" />`, `<div className="dg-glow" aria-hidden="true" />\n        <SternZeichen />`)) },
  { name: "Tagline im /play-Rücksprung ersetzt", check: "play",
    make: (s) => editText(s, P.header, (t) => t.replace(`<div className="dg-tagline">English · Vocabulary &amp; Grammar</div>`, `<div className="le-affiliation">Teil von Lauter Einser</div>`)) },
  { name: "fremder Selektor mit Farbwert in le-kopf.css", check: "kopf-css",
    make: (s) => editText(s, P.kopfCss, (t) => `${t}\n.dg-card { color: #ffffff; }\n`) },
  { name: "alte Adresse in einer App-Datei", check: "alt",
    make: (s) => { const c = clone(s); c.scan.set("apps/web/app/__selftest-alt.tsx", `const u = "https://app.lautereinser.at/home";`); return c; } },
  { name: "Werkzeug-Adresse außerhalb der JSON", check: "hosts",
    make: (s) => { const c = clone(s); c.scan.set("apps/web/app/__selftest-host.tsx", `<a href="https://veho.lautereinser.at">VEHO</a>`); return c; } },
  { name: "alter Bereichsname in einer Dach-Datei", check: "namen",
    make: (s) => { const c = clone(s); c.scan.set("apps/web/lib/__selftest-namen.ts", `export const T = "Englisch · Oberstufe — Finale";`); return c; } },
  { name: "Spielwort »Finale« in packages/ bleibt unangetastet", check: "namen", erwartet: "gruen",
    make: (s) => { const c = clone(s); c.scan.set("packages/game-paint/src/__selftest-spielwort.ts", `const postponedFinale = null; // Finale-Karte`); return c; } },
];

const real = readReal();

if (selftest) {
  const basis = run(real);
  let ok = 0;
  const probleme = [];
  for (const fall of FAELLE) {
    if (basis[fall.check].length > 0) {
      probleme.push(`»${fall.name}«: die Prüfung ${fall.check} ist schon OHNE Manipulation rot — erst den echten Lauf grün machen`);
      continue;
    }
    let got;
    try {
      got = run(fall.make(real));
    } catch (e) {
      probleme.push(`»${fall.name}«: ${e.message}`);
      continue;
    }
    // Die meisten Fälle sind Manipulationen, die rot werden MÜSSEN. Ein Fall mit `erwartet: "gruen"`
    // ist das Gegenteil: er beweist die Trennschärfe einer Prüfung — etwas, das sie NICHT fangen darf.
    const rot = got[fall.check].length > 0;
    const sollRot = fall.erwartet !== "gruen";
    if (rot !== sollRot) {
      probleme.push(`»${fall.name}«: die Prüfung ${fall.check} ${rot ? `wurde ROT, sollte aber grün bleiben (${got[fall.check].join("; ")})` : "blieb GRÜN"}`);
    } else ok++;
  }
  if (probleme.length) {
    for (const p of probleme) console.error(`✗ SELBSTTEST: ${p}`);
    process.exit(1);
  }
  console.log(`check-umbrella-tokens SELFTEST: OK — ${ok}/${FAELLE.length} Fälle wie erwartet (rot, wo manipuliert; grün, wo die Trennschärfe es verlangt)`);
  process.exit(0);
}

const findings = run(real);
let failures = 0;
for (const [name, list] of Object.entries(findings)) {
  if (list.length === 0) { console.log(`  ok   ${name}`); continue; }
  failures += list.length;
  for (const f of list) console.error(`✗ ${name}: ${f}`);
}
if (failures > 0) {
  console.error(`check-umbrella-tokens: ${failures} Verstoß/Verstöße`);
  process.exit(1);
}
console.log(`check-umbrella-tokens: OK — ${Object.keys(CHECKS).length} Prüfungen grün, ${real.scan.size} Dateien nach Adressen durchsucht`);
