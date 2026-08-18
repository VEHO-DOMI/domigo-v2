#!/usr/bin/env node
// R5 · S1 · DER SCHLÜSSEL DARF DAS REPO NIE BERÜHREN.
//
// Diese Runde ist die erste, die mit einem bezahlten API-Schlüssel arbeitet
// (ElevenLabs, für Musik und Effekte). Ein Schlüssel, der einmal in einem
// öffentlichen Commit steht, ist verbrannt — auch wenn der nächste Commit ihn
// wieder entfernt, denn die Historie behält ihn. Und der Weg dorthin ist kurz:
// ein Debug-`console.log`, eine Zeile im Generierungs-Protokoll, ein Prompt,
// den jemand mitsamt Header in eine Doku kopiert.
//
// Also wird die Regel eine Maschine. Das Skript liest JEDE getrackte Datei
// (`git ls-files` — was nicht getrackt ist, kann auch nicht gepusht werden) und
// sucht nach vier Formen, die ein echter Schlüssel hat.
//
// ── Warum die Muster einen WERT verlangen und nicht nur einen Namen ──────────
// Der naive Wächter sucht nach „xi-api-key" und wird damit sofort zur Plage:
// die Ton-Doku dieser Runde MUSS den Header-Namen nennen, und der Generator
// MUSS `process.env.ELEVENLABS_API_KEY` schreiben. Ein Tor, das bei richtiger
// Arbeit rot wird, wird abgeschaltet — und dann schützt es gar nichts mehr.
// Deshalb verlangt jedes Muster einen SCHLÜSSELFÖRMIGEN Wert dahinter: eine
// zusammenhängende Folge aus Buchstaben/Ziffern/`_`/`-` ohne Punkt, lang genug,
// dass keine Variablenreferenz und kein Platzhalter sie erfüllt.
//
// ── Warum der Selbsttest auch GRÜN bleiben muss ─────────────────────────────
// Ein Tamper, der durchgeht, beweist, dass die Prüfung blind ist. Ein Tor, das
// bei allem anschlägt, beweist gar nichts. Der Selbsttest prüft deshalb BEIDE
// Seiten an derselben echten Lesestrecke: vier vergiftete Dateien müssen je ihr
// eigenes rotes Licht auslösen, und sechs Beinahe-Treffer (Prosa, Umgebungs-
// variable, Git-sha1, Platzhalter) müssen still bleiben. Erst wenn beides
// stimmt, endet er mit 0.
//
// Run: node scripts/check-secrets.mjs            (exit 1 bei jedem Fund)
//      node scripts/check-secrets.mjs --selftest (beweist rotes UND grünes Licht)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const R = process.cwd();
const selftest = process.argv.includes("--selftest");

/** Ein schlüsselförmiger Wert: kein Punkt (schliesst `process.env.X` aus),
 *  keine Anführungszeichen, keine Leerzeichen — und lang. */
const VALUE = "[A-Za-z0-9_-]{24,}";

/**
 * Die vier Formen. `name` ist das, was der Selbsttest im Befund wiederfinden
 * muss — ein rotes Licht, das man nicht benennen kann, ist keins.
 */
const PATTERNS = [
  {
    name: "elevenlabs-key",
    re: /sk_[0-9a-zA-Z]{20,}/g,
    says: "sieht aus wie ein ElevenLabs-Schlüssel (`sk_…`)",
  },
  {
    name: "openai-style-key",
    re: /sk-[A-Za-z0-9]{20,}/g,
    says: "sieht aus wie ein OpenAI-/Anthropic-Schlüssel (`sk-…`)",
  },
  {
    name: "xi-api-key-header",
    re: new RegExp(`xi-api-key["']?\\s*[:=]\\s*["']?(${VALUE})`, "gi"),
    says: "ein `xi-api-key`-Header mit einem ausgeschriebenen Wert",
  },
  {
    name: "elevenlabs-env-assignment",
    re: new RegExp(`ELEVENLABS_API_KEY\\s*=\\s*["']?(${VALUE})`, "g"),
    says: "`ELEVENLABS_API_KEY=` mit einem ausgeschriebenen Wert",
  },
];

/** Dateien, in denen zu suchen sinnlos ist (Binaries) oder die zu gross sind. */
const SKIP_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg",
  ".mp3", ".ogg", ".wav", ".m4a", ".mp4", ".webm",
  ".woff", ".woff2", ".ttf", ".otf",
  ".pdf", ".docx", ".xlsx", ".pptx", ".zip", ".gz", ".wasm",
]);
const MAX_BYTES = 2 * 1024 * 1024;

const findings = [];

/** Die eine Lesestrecke — real und Selbsttest laufen durch DIESE Funktion. */
const scan = (files) => {
  for (const { abs, rel } of files) {
    if (SKIP_EXT.has(path.extname(abs).toLowerCase())) continue;
    let st;
    try {
      st = fs.statSync(abs);
    } catch {
      continue; // gelöscht zwischen `git ls-files` und jetzt
    }
    if (!st.isFile() || st.size > MAX_BYTES) continue;
    let text;
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    if (text.includes("\0")) continue; // doch binär (ein Nullbyte kommt in Text nicht vor)
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(text)) !== null) {
        const line = text.slice(0, m.index).split("\n").length;
        findings.push({ rel, line, pattern: p.name, says: p.says });
      }
    }
  }
};

const tracked = () =>
  execFileSync("git", ["ls-files", "-z"], { cwd: R, maxBuffer: 64 * 1024 * 1024 })
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((rel) => ({ abs: path.join(R, rel), rel }));

// ── SELBSTTEST ───────────────────────────────────────────────────────────────
// Die Köder werden ZUSAMMENGESETZT, nie als Literal geschrieben: stünde ein
// echtes Schlüsselmuster in dieser Datei, würde der reale Lauf sie selbst
// anzeigen und das Tor wäre für immer rot.
if (selftest) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "domigo-secrets-"));
  const hex = "0123456789abcdef".repeat(2); // 32 Zeichen
  const b64 = "AbCdEfGhIjKlMnOpQrStUvWx0123456789"; // 34 Zeichen, punktfrei

  /** Vier Köder — je einer je Muster, jeder in seiner natürlichen Umgebung. */
  const bait = [
    ["bait-1.ts", `const key = "sk_${hex}";\n`, "elevenlabs-key"],
    ["bait-2.md", `Beispiel: sk-${b64.slice(0, 24)} steht hier im Klartext.\n`, "openai-style-key"],
    ["bait-3.mjs", `headers: { "xi-api-key": "${b64}" },\n`, "xi-api-key-header"],
    ["bait-4.env.txt", `ELEVENLABS_API_KEY=sk_${hex}\n`, "elevenlabs-env-assignment"],
  ];

  /** Sechs Beinahe-Treffer, die STILL bleiben müssen — das ist die andere
   *  Hälfte des Beweises: genau diese Zeilen entstehen bei richtiger Arbeit. */
  const innocent = [
    ["ok-1.mjs", `headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },\n`],
    ["ok-2.md", "Der Header heisst `xi-api-key`; der Wert steht nur in `~/.config/domigo/elevenlabs.env`.\n"],
    ["ok-3.md", "Die Datei enthaelt eine Zeile `ELEVENLABS_API_KEY=…` — mehr steht hier nicht.\n"],
    ["ok-4.md", "Stand ae0dd42, Hotfix 918d189, Register ee23ce3 — lauter Git-Kuerzel.\n"],
    ["ok-5.ts", `const key = process.env.ELEVENLABS_API_KEY ?? "";\n`],
    ["ok-6.json", `{ "sha1": "${hex}", "note": "Inhalts-Fingerabdruck einer MP3, kein Schluessel" }\n`],
  ];

  const files = [];
  for (const [name, body] of [...bait.map(([n, b]) => [n, b]), ...innocent]) {
    const abs = path.join(dir, name);
    fs.writeFileSync(abs, body);
    files.push({ abs, rel: `__selftest__/${name}` });
  }

  // Dieselbe Lesestrecke wie im Ernstfall — inklusive der echten getrackten
  // Dateien, damit der Selbsttest auch beweist, dass das Repo GERADE sauber ist.
  scan([...tracked(), ...files]);
  fs.rmSync(dir, { recursive: true, force: true });

  let ok = true;
  for (const [name, , want] of bait) {
    const hit = findings.find((f) => f.rel.endsWith(name) && f.pattern === want);
    if (hit === undefined) {
      console.error(`✗ SELBSTTEST: der Koeder ${name} traegt einen Schluessel der Form „${want}" und dieses Tor hat geschwiegen`);
      ok = false;
    }
  }
  for (const [name] of innocent) {
    const noise = findings.filter((f) => f.rel.endsWith(name));
    if (noise.length > 0) {
      console.error(`✗ SELBSTTEST: ${name} enthaelt KEINEN Schluessel, wurde aber als „${noise[0].pattern}" gemeldet — `
        + "ein Tor, das bei richtiger Arbeit rot wird, wird abgeschaltet");
      ok = false;
    }
  }
  const real = findings.filter((f) => !f.rel.startsWith("__selftest__"));
  if (real.length > 0) {
    for (const f of real) console.error(`✗ ${f.rel}:${f.line} — ${f.says} [${f.pattern}]`);
    console.error("✗ SELBSTTEST: im echten Repo steht ein Schluessel — das ist kein Selbsttest-Fehler, das ist der Ernstfall");
    ok = false;
  }
  if (ok) {
    console.log(`check-secrets SELBSTTEST: OK — vier rote Lichter brennen (${bait.map((b) => b[2]).join(", ")}), `
      + `sechs Beinahe-Treffer bleiben still, und die ${tracked().length} getrackten Dateien sind sauber.`);
    process.exit(0);
  }
  process.exit(1);
}

// ── ECHTER LAUF ──────────────────────────────────────────────────────────────
const files = tracked();
scan(files);

if (findings.length > 0) {
  for (const f of findings) console.error(`✗ ${f.rel}:${f.line} — ${f.says} [${f.pattern}]`);
  console.error(
    `\ncheck-secrets: ${findings.length} moeglicher Schluessel im Repo.\n`
      + "Ein Schluessel, der einmal committet war, ist verbrannt — die Historie behaelt ihn. "
      + "Entferne ihn, rotiere ihn bei ElevenLabs, und lies ihn nur aus ~/.config/domigo/elevenlabs.env.",
  );
  process.exit(1);
}
console.log(`check-secrets: OK — ${files.length} getrackte Dateien, kein Schluessel in Sicht.`);
