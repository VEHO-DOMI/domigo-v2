#!/usr/bin/env node
/**
 * audio-proof — DER BEWEIS, DASS DAS KAPITEL KLINGT (R5-W6 · S2).
 *
 * WARUM ES DAS GIBT. Klang ist die einzige Ausgabe dieses Spiels, die kein
 * Schirmbild zeigt: ein stummes Kapitel und ein klingendes sehen identisch aus,
 * im Diff wie im Bild. Alles, was sich in Node prüfen lässt, steht als Test da
 * (`audio/tape-audio.test.ts` fährt die Bänder durch die echte Spiel-Logik).
 * Was NUR ein Browser beantworten kann, steht hier:
 *
 *   1. **Der Rückkehrer-Pfad.** Ein Kind, das den Auftakt schon gelesen hat,
 *      sieht keinen Knopf. Sein Ton wird von Phasers eigenem Body-Entsperrer
 *      bei der ERSTEN Berührung geweckt. Ob das wirklich passiert, weiss nur
 *      ein Browser mit einem echten Klick.
 *   2. **Dass vor der Geste nichts klingt** — und zwar nicht, weil wir es
 *      unterdrücken, sondern weil der Browser es verbietet. Genau deshalb
 *      startet dieser Lauf seinen Chrome OHNE
 *      `--autoplay-policy=no-user-gesture-required`: mit dem Schalter (den
 *      `perf-visible.mjs` zu Recht setzt, weil er dort nicht stört) wäre der
 *      Kontext von Anfang an offen und dieser Beweis wertlos.
 *   3. **Das Ratenlimit der Schritte.** Es sitzt IM Direktor, hinter dem
 *      Aufruf. Ein Protokoll der Aufrufe zeigt es nie — deshalb meldet der
 *      Direktor über `onPlayed`, was WIRKLICH aus dem Lautsprecher kam
 *      (`?audiolog=1`), und hier wird der Abstand zwischen zwei Schritten
 *      gemessen.
 *
 * WARUM EIN EIGENER CHROME. Die eingebauten Browser-Flächen halten ihren Tab
 * verborgen; dort läuft Phasers Bilduhr nicht, und ohne sie wird
 * `BaseSoundManager.update` nie ausgeführt — die Tonmaschine bliebe für immer
 * gesperrt und dieser Lauf würde einen Fehler beweisen, den es nicht gibt
 * (P-56/P-57, W4 2026-08-17). Dieser Lauf startet deshalb seinen eigenen
 * Browser mit eigenem Profil, genau wie `perf-visible.mjs`.
 *
 * KEIN TOR, SONDERN WERKZEUG. Es braucht einen Browser und einen laufenden
 * Server, läuft also nicht in CI — dieselbe ehrliche Einordnung, die W4 für die
 * anderen Chrome-Werkzeuge getroffen hat (`NOT_A_GATE`). Die Gesetze über den
 * Klang stehen in `scripts/check-audio.mjs` und in `src/audio/*.test.ts`.
 *
 * Benutzung (Server läuft schon, eigener Port — P-65):
 *   node scripts/audio-proof.mjs --port 3279 [--phase p1]
 *   node scripts/audio-proof.mjs --selftest        # ohne Browser, ohne Server
 */

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : dflt;
};

// ── Die Urteile, getrennt von der Messung, damit der Selbsttest sie prüfen kann ──

/** Vor der Geste MUSS es still sein. Ist es das nicht, misst der Lauf nichts. */
export const verdictBeforeGesture = (s) => {
  if (s.context === null) return { ok: false, why: "es gibt gar keinen AudioContext — die Phaser-Konfiguration bekommt ihn nicht" };
  if (s.context.state === "running" && s.played === 0) {
    return { ok: false, why: "der Kontext lief schon vor der Geste — läuft dieser Chrome mit --autoplay-policy=no-user-gesture-required? Dann beweist der Lauf nichts" };
  }
  if (s.played > 0) return { ok: false, why: `${s.played} Klänge VOR der ersten Berührung — das darf nicht sein` };
  return { ok: true, why: `still und gesperrt (Kontext ${s.context.state}, locked=${s.locked})` };
};

/** Nach der Geste MUSS der Kontext offen sein und Musik laufen. */
export const verdictAfterGesture = (s) => {
  if (s.context?.state !== "running") return { ok: false, why: `der Kontext ist nach der Berührung ${s.context?.state ?? "weg"} — der Rückkehrer bliebe stumm` };
  if (s.locked) return { ok: false, why: "Phasers Tonmaschine meldet sich weiter als gesperrt — läuft die Bilduhr? (verborgener Tab?)" };
  if (s.music === null) return { ok: false, why: "keine Musik — `applyMusic` hat nach UNLOCKED nicht gefeuert" };
  return { ok: true, why: `offen, Musik ${s.music}, ${s.played} Klänge` };
};

/**
 * Das Ratenlimit: zwei Schritte desselben Untergrunds dürfen nicht enger als
 * 90 ms beieinander liegen (`director.ts`, Familie `foot`). Gemessen an dem,
 * was WIRKLICH gespielt wurde. Eine Toleranz von 5 ms, weil `performance.now()`
 * gerundet protokolliert wird.
 */
export const verdictFootstepGap = (log, minGapMs = 90) => {
  const steps = log.filter((e) => e.arg.startsWith("step-"));
  if (steps.length < 3) return { ok: null, why: `nur ${steps.length} Schritte im Protokoll — zu wenig für ein Urteil`, steps: steps.length };
  let worst = Infinity;
  for (let i = 1; i < steps.length; i++) worst = Math.min(worst, steps[i].t - steps[i - 1].t);
  return {
    ok: worst >= minGapMs - 5,
    why: `${steps.length} Schritte, engster Abstand ${worst} ms (Limit ${minGapMs} ms)`,
    steps: steps.length,
    worst,
  };
};

/** Keine Datei zweimal im selben Millisekunden-Stempel. */
export const verdictNoDoubles = (log) => {
  const seen = new Set();
  const doubles = [];
  for (const e of log) {
    const k = `${e.t}:${e.arg}`;
    if (seen.has(k)) doubles.push(k);
    seen.add(k);
  }
  return { ok: doubles.length === 0, why: doubles.length === 0 ? "keine Doppel-Auslösung" : `doppelt: ${doubles.join(", ")}`, doubles };
};

// ── Selbsttest: die Urteile gegen erfundene Messwerte, ohne Browser ──────────
if (process.argv.includes("--selftest")) {
  const cases = [
    ["still vor der Geste → grün", verdictBeforeGesture({ context: { state: "suspended" }, locked: true, played: 0 }).ok, true],
    ["Kontext schon offen → ROT", verdictBeforeGesture({ context: { state: "running" }, locked: false, played: 0 }).ok, false],
    ["Klang vor der Geste → ROT", verdictBeforeGesture({ context: { state: "suspended" }, locked: true, played: 3 }).ok, false],
    ["kein Kontext → ROT", verdictBeforeGesture({ context: null, locked: true, played: 0 }).ok, false],
    ["offen mit Musik → grün", verdictAfterGesture({ context: { state: "running" }, locked: false, music: "music-p1", played: 2 }).ok, true],
    ["nach der Geste weiter gesperrt → ROT", verdictAfterGesture({ context: { state: "running" }, locked: true, music: "music-p1", played: 2 }).ok, false],
    ["offen, aber keine Musik → ROT", verdictAfterGesture({ context: { state: "running" }, locked: false, music: null, played: 2 }).ok, false],
    ["Schritte weit genug → grün", verdictFootstepGap([
      { t: 0, arg: "step-paper-1" }, { t: 120, arg: "step-paper-2" }, { t: 260, arg: "step-paper-3" },
    ]).ok, true],
    ["Schritte zu eng → ROT", verdictFootstepGap([
      { t: 0, arg: "step-paper-1" }, { t: 20, arg: "step-paper-2" }, { t: 40, arg: "step-paper-3" },
    ]).ok, false],
    ["keine Doppel → grün", verdictNoDoubles([{ t: 1, arg: "a" }, { t: 1, arg: "b" }]).ok, true],
    ["Doppel → ROT", verdictNoDoubles([{ t: 1, arg: "a" }, { t: 1, arg: "a" }]).ok, false],
  ];
  let bad = 0;
  for (const [name, got, want] of cases) {
    const ok = got === want;
    if (!ok) bad++;
    console.log(`${ok ? "  ✓" : "  ✗"} ${name}`);
  }
  console.log(bad === 0
    ? "\naudio-proof SELBSTTEST: OK — jedes Urteil kennt sein rotes UND sein grünes Licht."
    : `\naudio-proof SELBSTTEST: ${bad} Urteil(e) falsch.`);
  process.exit(bad === 0 ? 0 : 1);
}

// ── der Lauf ─────────────────────────────────────────────────────────────────
const PORT = Number(arg("--port", ""));
if (!Number.isInteger(PORT) || PORT <= 0) {
  console.error("audio-proof: --port <n> ist Pflicht (P-65: eigener Port je Session, nie der des Nachbarn).");
  process.exit(2);
}
const PHASE = arg("--phase", "p1");

const profile = mkdtempSync(path.join(tmpdir(), "audio-proof-chrome-"));
// KEIN --autoplay-policy: die Geste ist der Gegenstand dieser Messung.
const chrome = spawn(CHROME, [
  "--headless=new",
  "--hide-scrollbars",
  "--no-first-run",
  "--window-size=1200,900",
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--disable-background-timer-throttling",
  `--user-data-dir=${profile}`,
  "--remote-debugging-port=0",
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

let chromeGone = null;
chrome.on("error", (e) => { chromeGone = `konnte nicht starten: ${e.message}`; });
chrome.on("exit", (c, s) => { if (chromeGone === null) chromeGone = `ist ausgestiegen (Code ${c ?? "—"}, Signal ${s ?? "—"})`; });

const endpoint = async () => {
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 80; i++) {
    if (chromeGone !== null) throw new Error(`Chrome ${chromeGone}`);
    if (existsSync(portFile)) {
      const [portLine, wsPath] = readFileSync(portFile, "utf8").split("\n");
      const bound = Number(portLine);
      if (Number.isInteger(bound) && bound > 0 && wsPath?.trim().startsWith("/devtools/")) return `ws://127.0.0.1:${bound}${wsPath.trim()}`;
    }
    await sleep(250);
  }
  throw new Error(`Chrome hat in 20 s keinen DevToolsActivePort geschrieben (Profil ${profile})`);
};

const client = (ws) => {
  let id = 0;
  const waiting = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== undefined && waiting.has(m.id)) {
      const { resolve, reject } = waiting.get(m.id);
      waiting.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  return (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    id += 1;
    waiting.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
};

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
const evalIn = async (expression, awaitPromise = false) => {
  const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval fehlgeschlagen");
  return r.result.value;
};

const READ = `(() => {
  const h = window.__domigoPaint;
  if (!h || !h.audio) return null;
  const r = h.audio.report();
  return { context: h.audio.context(), locked: h.audio.locked(), music: r ? r.music : null,
           enabled: r ? r.enabled : false, decodedMb: r ? r.decodedMb : 0, files: r ? r.filesLoaded : 0,
           played: h.audio.log().length, hidden: document.hidden };
})()`;

let failures = 0;
const say = (v, label) => {
  const mark = v.ok === null ? "•" : v.ok ? "✓" : "✗";
  if (v.ok === false) failures++;
  console.log(`  ${mark} ${label}: ${v.why}`);
};

try {
  await page("Page.enable");
  await page("Runtime.enable");
  await page("Input.enable").catch(() => {});
  const url = `http://localhost:${PORT}/play/1/buch?phase=${PHASE}&audiolog=1`;
  console.log(`\naudio-proof · ${url}\n`);
  await page("Page.navigate", { url });

  let s = null;
  for (let i = 0; i < 200 && s === null; i++) { await sleep(250); s = await evalIn(READ).catch(() => null); }
  if (s === null) { console.error("✗ der Griff `window.__domigoPaint.audio` kam nie — Lehrer-Tür zu, falscher Port, oder ein Produktions-Build (der Griff ist dev-only)."); failures++; }
  else {
    console.log(`Bedingungen: hidden=${s.hidden} · Ton aktiv=${s.enabled} · ${s.files} Dateien · ${s.decodedMb} MB decodiert`);
    if (s.hidden) console.log("  ⚠ der Tab meldet sich als VERBORGEN — Phasers Bilduhr steht dann, und das Entsperren kann nicht stattfinden (P-56/57).");

    console.log("\n1 · vor der ersten Berührung");
    say(verdictBeforeGesture(s), "still und gesperrt");

    // eine ECHTE Geste, wie ein Kind sie macht
    const click = async () => {
      for (const type of ["mousePressed", "mouseReleased"]) {
        await page("Input.dispatchMouseEvent", { type, x: 600, y: 450, button: "left", clickCount: 1 });
      }
    };
    await click();

    // GEDULD, kein fester Schlaf: das Decodieren wartet jetzt auf Phasers
    // DECODED-Meldung, und wie lange das dauert, hängt an der Maschine. Ein
    // fester Schlaf hätte hier »keine Musik« gemeldet, während die Musik zwei
    // Sekunden später anfing — ein Messfehler, der wie ein Fehler im Spiel
    // aussieht. (Genau so ist es beim ersten Lauf passiert.)
    let after = await evalIn(READ);
    for (let i = 0; i < 40 && after.music === null; i++) {
      await sleep(250);
      after = await evalIn(READ);
    }
    console.log("\n2 · nach der ersten Berührung (der Rückkehrer-Pfad)");
    say(verdictAfterGesture(after), "Kontext offen, Musik läuft");

    // Wie füllt sich die Bank? (Diagnose-Zeile: das Decodieren läuft nebenher,
    // und ob es überhaupt vorankommt, sieht man nur über die Zeit.)
    const bankOverTime = [];
    for (let i = 0; i < 12; i++) {
      const r = await evalIn(READ);
      bankOverTime.push(`${i * 2}s:${r.files}`);
      if (r.files > 60) break;
      await sleep(2000);
    }
    console.log(`  Bank füllt sich: ${bankOverTime.join(" ")}`);

    // Der Auftakt friert die Welt ein (drei bis vier Takte). Solange er steht,
    // bewegt sich das Kind nicht und es gibt keine Schritte — wer hier gleich
    // »rechts« drückt, misst die Stille des Auftakts und nennt sie einen Fehler.
    for (let i = 0; i < 6; i++) {
      const overlay = await evalIn(`window.__domigoPaint.beat().overlay`).catch(() => null);
      if (overlay === null) break;
      await evalIn(`window.__domigoPaint.solveTask()`).catch(() => {});
      await sleep(400);
    }
    const overlayLeft = await evalIn(`window.__domigoPaint.beat().overlay`).catch(() => "?");
    console.log(`  (Auftakt weg? Karte oben: ${overlayLeft ?? "keine"})`);

    // ── laufen lassen, damit Schritte entstehen ─────────────────────────────
    // Das Haus-Rezept (`shoot-world.mjs`): Pad setzen, dann von Hand takten.
    // Eine echte Pfeiltaste erreicht Phaser in einem CDP-Ziel nicht — dort hat
    // das Dokument keinen Fokus, und der Lauf davor hat genau das gemessen:
    // `vx: 0` bei offenem Overlay und Boden unter den Füssen.
    //
    // Von Hand getaktet greift das Ratenlimit hart, weil es WANDUHR-Zeit zählt
    // und hier viele Spiel-Takte in wenige Millisekunden fallen. Das ist keine
    // Schwäche der Messung, sondern ihr Zweck: in Echtzeit lägen zwei Schritte
    // ~130 ms auseinander und das Limit käme nie zum Zug.
    await evalIn(`window.__domigoPaint.press({ right: true })`);
    for (let round = 0; round < 12; round++) {
      await evalIn(`(() => { for (let i = 0; i < 40; i++) window.__domigoPaint.rafStep(); return true; })()`);
      await sleep(120);
    }
    // …und zurück, damit der Lauf nicht an einer Wand endet und die Messung
    // dann »das Kind bewegt sich nicht« sagt, wo in Wahrheit eine Kante steht.
    const xNow = async () => (await evalIn(`Math.round(window.__domigoPaint.state().x)`).catch(() => -1));
    const xRight = await xNow();
    await evalIn(`window.__domigoPaint.press({ left: true })`);
    for (let round = 0; round < 8; round++) {
      await evalIn(`(() => { for (let i = 0; i < 40; i++) window.__domigoPaint.rafStep(); return true; })()`);
      await sleep(120);
    }
    const xLeft = await xNow();
    console.log(`  Weg des Kindes: rechts bis x=${xRight}, dann links bis x=${xLeft}`);
    await evalIn(`window.__domigoPaint.press({})`);
    await sleep(400);
    const log = await evalIn(`window.__domigoPaint.audio.log()`);
    const end = await evalIn(READ);
    const moved = await evalIn(`(() => { const st = window.__domigoPaint.state(); return st ? { x: Math.round(st.x), y: Math.round(st.y), vx: Math.round(st.vx ?? 0), grounded: st.grounded, overlay: st.overlay, phase: st.phase } : null; })()`).catch(() => null);
    console.log("\n3 · was wirklich geklungen hat");
    console.log(`  Bank: ${end.files} Dateien decodiert · ${end.decodedMb} MB · Kind: ${moved ? JSON.stringify(moved) : "?"}`);
    const counts = new Map();
    for (const e of log) counts.set(e.arg, (counts.get(e.arg) ?? 0) + 1);
    console.log(`  ${log.length} Klänge: ${[...counts].map(([k, n]) => `${k}×${n}`).join(" · ") || "—"}`);
    say(verdictFootstepGap(log), "Ratenlimit der Schritte");
    say(verdictNoDoubles(log), "keine Doppel-Auslösung");
  }
} finally {
  try { ws.close(); } catch { /* egal */ }
  chrome.kill();
}

console.log(failures === 0 ? "\naudio-proof: OK" : `\naudio-proof: ${failures} Befund(e).`);
process.exit(failures === 0 ? 0 : 1);
