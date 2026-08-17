#!/usr/bin/env node
// R5 · S1 · DER ERZEUGER — rohe Takes aus ElevenLabs in den Airlock.
//
// Eingabe:  docs/audio/prompts.ch01.json  (die Tabellen aus AUDIO_SPINE_CH01.md
//                                          §2b/§3, als Daten)
// Ausgabe:  docs/audio/takes/<stem>/take-<n>.mp3   (GITIGNORED — Airlock)
//           docs/audio/GENERATION_LOG.md            (was erzeugt wurde, was es kostete)
//
// ── Der Schlüssel ────────────────────────────────────────────────────────────
// Er steht AUSSCHLIESSLICH in ~/.config/domigo/elevenlabs.env (R125). Er wird
// nie als Argument übergeben, nie ausgegeben, nie ins Protokoll geschrieben.
// `scripts/check-secrets.mjs` hält die andere Hälfte des Versprechens.
//
// ── Warum plain `fetch` und kein SDK ─────────────────────────────────────────
// Ein SDK wäre eine neue Abhängigkeit im Workspace für zwei POST-Aufrufe, die
// beide aus je fünf Zeilen bestehen. Der Lock-File-Diff wäre größer als dieses
// Skript.
//
// ── Was gemessen wird, während erzeugt wird ─────────────────────────────────
// Jede Antwort trägt einen `character-cost`-Header — das sind die verbrauchten
// Credits. Die Summe ist DIE Zahl des Reports. `GET /v1/user/subscription` vor
// und nach dem Lauf ist die Gegenprobe: weichen beide ab, stehen beide im
// Report (jemand anderes könnte dasselbe Konto benutzen).
// Für MUSIK gilt zusätzlich eine zweite, härtere Schranke, die nicht in
// Credits zählt: der `creator`-Plan erlaubt 62 Minuten Musik-Erzeugung pro
// Monat (AUDIO_SPINE §5). Das Skript summiert deshalb auch die erzeugten
// Musik-Sekunden und bricht ab, bevor es sie überschreitet.
//
// Aufruf:
//   node docs/audio/gen-elevenlabs.mjs --plan                 (nur zeigen, was liefe)
//   node docs/audio/gen-elevenlabs.mjs --only step-paper      (ein Stem)
//   node docs/audio/gen-elevenlabs.mjs --only music-p1 --takes 3
//   node docs/audio/gen-elevenlabs.mjs --all                  (die ganze Serie)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const PROMPTS = path.join(ROOT, "docs/audio/prompts.ch01.json");
const TAKES = path.join(ROOT, "docs/audio/takes");
const LOG = path.join(ROOT, "docs/audio/GENERATION_LOG.md");
const KEYFILE = path.join(os.homedir(), ".config/domigo/elevenlabs.env");

const API = "https://api.elevenlabs.io/v1";
const OUTPUT_FORMAT = "mp3_44100_128"; // gemastert wird danach ohnehin auf mono 96k
const MAX_PARALLEL = 3;
/** Die Monats-Schranke des `creator`-Plans für MUSIK (AUDIO_SPINE §5). Wir
 *  halten uns weit darunter und brechen ab, statt sie zu reissen. */
const MUSIC_BUDGET_SECONDS = 45 * 60; // 45 von 62 Minuten — 17 Minuten Sicherheit

// ── Argumente ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt;
};
const PLAN_ONLY = flag("plan");
const ONLY = value("only", "").split(",").map((s) => s.trim()).filter(Boolean);
const TAKES_OVERRIDE = value("takes", "") === "" ? null : Number(value("takes", ""));
const ALL = flag("all");

if (!PLAN_ONLY && !ALL && ONLY.length === 0) {
  console.error("Nichts zu tun. Nimm --plan, --only <stem>[,<stem>] oder --all.");
  process.exit(2);
}

// ── Der Schlüssel ────────────────────────────────────────────────────────────
const readKey = () => {
  let raw;
  try {
    raw = fs.readFileSync(KEYFILE, "utf8");
  } catch {
    console.error(`✗ ${KEYFILE} ist nicht lesbar. Der Schluessel steht NUR dort (R125).`);
    process.exit(2);
  }
  for (const line of raw.split("\n")) {
    const m = /^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*(.*)$/.exec(line);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  console.error(`✗ ${KEYFILE} enthaelt keine Zeile ELEVENLABS_API_KEY=…`);
  process.exit(2);
};

// ── HTTP ─────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** POST mit Backoff auf 429/5xx. Gibt {buf, credits, ms} zurueck. */
const post = async (key, url, body, label) => {
  let wait = 2000;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const t0 = Date.now();
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "xi-api-key": key, "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      if (attempt === 6) throw new Error(`${label}: Netzwerkfehler nach 6 Versuchen — ${e.message}`);
      await sleep(wait); wait *= 2; continue;
    }
    if (res.status === 429 || res.status >= 500) {
      const text = await res.text().catch(() => "");
      if (attempt === 6) throw new Error(`${label}: HTTP ${res.status} nach 6 Versuchen — ${text.slice(0, 300)}`);
      console.warn(`  … ${label}: HTTP ${res.status}, warte ${wait} ms (Versuch ${attempt}/6)`);
      await sleep(wait); wait *= 2; continue;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${label}: HTTP ${res.status} — ${text.slice(0, 500)}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const credits = Number(res.headers.get("character-cost") ?? res.headers.get("x-character-cost") ?? 0);
    return { buf, credits, ms: Date.now() - t0 };
  }
  throw new Error(`${label}: unerreichbar`);
};

const subscription = async (key) => {
  const res = await fetch(`${API}/user/subscription`, { headers: { "xi-api-key": key } });
  if (!res.ok) return null;
  const d = await res.json();
  return { tier: d.tier, status: d.status, used: d.character_count, limit: d.character_limit };
};

// ── Der Prompt wird ZUSAMMENGESETZT ──────────────────────────────────────────
// Der Material-Satz und die Negativliste stehen EINMAL in prompts.ch01.json und
// werden hier vor bzw. hinter jeden `text` gesetzt. Stünden sie 31-mal
// abgeschrieben in der Datei, wäre ein Tippfehler in einer Abschrift genau der
// Riss, durch den ein Klang aus einem anderen Raum ins Kapitel kommt.
const assemble = (spec, item) => [spec.material, item.text, spec.negatives].filter(Boolean).join(" ");

// ── Die zwei Endpunkte ───────────────────────────────────────────────────────
// Die Effekt-API kann minimal 0,5 s: `requestSeconds` ist, was bestellt wird,
// `targetSeconds` das Fenster, auf das master.mjs danach kappt.
const genSfx = (key, spec, item) =>
  post(key, `${API}/sound-generation?output_format=${OUTPUT_FORMAT}`, {
    text: assemble(spec, item),
    duration_seconds: Math.max(0.5, item.requestSeconds ?? item.targetSeconds ?? 0.5),
    prompt_influence: item.promptInfluence ?? 0.6,
    ...(item.loop === true ? { loop: true, model_id: "eleven_text_to_sound_v2" } : {}),
  }, item.stem);

const genMusic = (key, spec, item, take) =>
  post(key, `${API}/music?output_format=${OUTPUT_FORMAT}`, {
    prompt: assemble(spec, item),
    music_length_ms: item.lengthMs,
    model_id: item.modelId ?? "music_v1",
    force_instrumental: true,
    // ⚠ KEIN `seed`. Der Auftrag ging davon aus, er sei „best effort" nutzbar;
    // die API antwortet auf `prompt` + `seed` mit HTTP 422: „`seed` cannot be
    // used with `prompt`" (gemessen 17.08.2026). Seed gibt es nur zusammen mit
    // einem `composition_plan`. Damit sind Musik-Takes NICHT reproduzierbar —
    // was die Hörbank ohnehin voraussetzt: sie stellt drei verschiedene Takes
    // nebeneinander, und die Wahl trifft ein Ohr, kein Seed.
  }, `${item.stem}#${take}`);

// ── Protokoll ────────────────────────────────────────────────────────────────
const logLines = [];
const logRow = (o) => logLines.push(
  `| \`${o.stem}\` | ${o.take} | ${o.kind} | ${o.seconds ?? "—"} | ${o.credits} | ${o.bytes} | \`${o.sha1}\` | ${o.ms} ms | ${o.verdict} |`,
);

const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);

// ── Lauf ─────────────────────────────────────────────────────────────────────
const main = async () => {
  if (!fs.existsSync(PROMPTS)) {
    console.error(`✗ ${PROMPTS} fehlt — erst die Tabellen als Daten, dann erzeugen (AUDIO_SPINE §2b/§3).`);
    process.exit(2);
  }
  const spec = JSON.parse(fs.readFileSync(PROMPTS, "utf8"));
  const all = [...(spec.sfx ?? []), ...(spec.music ?? [])];

  const wanted = all.filter((it) => {
    if (it.reserved === true) return false; // kann in ch01 nicht feuern (AUDIO_SPINE §2a)
    if (ONLY.length > 0) return ONLY.includes(it.stem);
    return true;
  });
  if (wanted.length === 0) {
    console.error(`✗ kein passender Stem${ONLY.length > 0 ? ` fuer --only ${ONLY.join(",")}` : ""}.`);
    process.exit(2);
  }

  const jobs = [];
  let musicSeconds = 0;
  for (const it of wanted) {
    const kind = it.kind ?? (it.stem.startsWith("music-") ? "music" : "sfx");
    const takes = TAKES_OVERRIDE ?? it.takes ?? (kind === "music" ? 3 : 6);
    for (let n = 1; n <= takes; n++) {
      const secs = kind === "music" ? (it.lengthMs ?? 45000) / 1000 : Math.max(0.5, it.requestSeconds ?? 0.5);
      if (kind === "music") musicSeconds += secs;
      jobs.push({ item: it, kind, take: n, seconds: secs });
    }
  }

  console.log(`Plan: ${wanted.length} Stems → ${jobs.length} Takes `
    + `(${jobs.filter((j) => j.kind === "music").length} Musik, ${jobs.filter((j) => j.kind === "sfx").length} Effekte)`);
  console.log(`Musik-Sekunden dieses Laufs: ${Math.round(musicSeconds)} s von ${MUSIC_BUDGET_SECONDS} s Sicherheitsbudget `
    + `(Plan-Grenze: 62 min/Monat, AUDIO_SPINE §5)`);
  if (musicSeconds > MUSIC_BUDGET_SECONDS) {
    console.error("✗ dieser Lauf wuerde das Musik-Sicherheitsbudget reissen. Weniger Takes, oder --only.");
    process.exit(2);
  }
  if (PLAN_ONLY) {
    for (const it of wanted) console.log(`  – ${it.stem} (${it.kind ?? "sfx"}) × ${TAKES_OVERRIDE ?? it.takes ?? "?"}`);
    return;
  }

  const key = readKey();
  const before = await subscription(key);
  console.log(`Konto vorher: ${before ? `${before.tier}/${before.status}, ${before.used}/${before.limit} Credits` : "nicht abrufbar"}`);

  let credits = 0;
  let done = 0;
  const failures = [];
  const queue = [...jobs];

  const worker = async () => {
    for (;;) {
      const job = queue.shift();
      if (job === undefined) return;
      const { item, kind, take } = job;
      const dir = path.join(TAKES, item.stem);
      fs.mkdirSync(dir, { recursive: true });
      const out = path.join(dir, `take-${take}.mp3`);
      if (fs.existsSync(out)) {
        console.log(`  = ${item.stem} take-${take} liegt schon da`);
        done++;
        continue;
      }
      try {
        const r = kind === "music" ? await genMusic(key, spec, item, take) : await genSfx(key, spec, item);
        fs.writeFileSync(out, r.buf);
        credits += r.credits;
        done++;
        logRow({
          stem: item.stem, take, kind, seconds: job.seconds, credits: r.credits,
          bytes: r.buf.length, sha1: sha1(r.buf), ms: r.ms, verdict: "erzeugt",
        });
        console.log(`  ✓ ${item.stem} take-${take} — ${(r.buf.length / 1024).toFixed(0)} KB, ${r.credits} Credits, ${r.ms} ms`);
      } catch (e) {
        failures.push(`${item.stem} take-${take}: ${e.message}`);
        logRow({ stem: item.stem, take, kind, seconds: job.seconds, credits: 0, bytes: 0, sha1: "—", ms: 0, verdict: `FEHLER: ${e.message.slice(0, 120)}` });
        console.error(`  ✗ ${item.stem} take-${take}: ${e.message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(MAX_PARALLEL, queue.length) }, worker));

  const after = await subscription(key);
  const delta = before && after ? after.used - before.used : null;

  // ── Protokoll fortschreiben ────────────────────────────────────────────────
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const head = fs.existsSync(LOG) ? "" : `# GENERATION_LOG — jeder Take, sein Preis, sein Fingerabdruck

_Angelegt von \`docs/audio/gen-elevenlabs.mjs\` (R5 · S1). Die Prompts stehen woertlich in
\`docs/audio/prompts.ch01.json\`; hier steht, was daraus wurde. **Der Schluessel kommt in dieser
Datei nie vor** — \`scripts/check-secrets.mjs\` prueft das._

`;
  const block = `
## Lauf ${stamp}${ONLY.length > 0 ? ` — nur ${ONLY.join(", ")}` : ""}

Konto vorher: ${before ? `${before.tier}/${before.status}, ${before.used}/${before.limit}` : "nicht abrufbar"} ·
nachher: ${after ? `${after.used}/${after.limit}` : "nicht abrufbar"} ·
**Kontodifferenz: ${delta === null ? "unbekannt" : delta}** ·
**Summe \`character-cost\`: ${credits}**

> Die beiden Zahlen messen NICHT dasselbe (gemessen 17.08.2026): fuer **Musik** meldet der
> Header \`character-cost\` **0**, waehrend das Konto sich bewegt (45 s ≙ 1198 Credits); fuer
> **Effekte** meldet der Header einen Wert (0,5 s ≙ 5), waehrend das Konto **stehen bleibt**.
> Massgeblich ist deshalb die **Kontodifferenz**; der Header ist ein Signal je Anfrage, keine
> Summe. Weichen beide auf eine dritte Weise ab, koennte jemand anderes dasselbe Konto benutzen —
> dann gehoeren beide Zahlen mit diesem Vermerk in den Report.
Takes: ${done} erzeugt/vorhanden, ${failures.length} Fehler · Musik-Sekunden: ${Math.round(musicSeconds)}

| Stem | Take | Art | Sek. | Credits | Bytes | sha1 | Dauer | Verdikt |
|---|---|---|---|---|---|---|---|---|
${logLines.join("\n")}
`;
  fs.appendFileSync(LOG, head + block);

  console.log(`\nFertig: ${done} Takes, ${credits} Credits (Kontodifferenz ${delta ?? "?"}), ${failures.length} Fehler.`);
  if (delta !== null && delta !== credits) {
    console.warn(`⚠ Summe der Header (${credits}) ≠ Kontodifferenz (${delta}) — beide Zahlen gehoeren in den Report.`);
  }
  if (failures.length > 0) {
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
};

await main();
