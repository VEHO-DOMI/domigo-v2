#!/usr/bin/env node
/**
 * perf-visible — DIE Perf-Tabelle, aus SICHTBAREM Chrome, mit Kontrollmessung
 * (R5-W5 · E6, Ruling R115).
 *
 * WARUM ES DAS GIBT. `PERF_WAECHTER.md` §1 verlangt die Zahlen für alle fünf
 * Phasen vorher/nachher in jedem PR, der das Spiel anfasst — aber jede Session
 * hat bisher anders gemessen, und zwei Sessions der Welle 4b lieferten leere
 * ms-Spalten. R115 macht Schluss damit: die Tabelle kommt aus EINEM Rezept, und
 * dieses Rezept ist dieses Skript. Wer nach E6 misst, ruft es auf.
 *
 * DIE EINE REGEL, DIE ALLES TRÄGT (P-61, E5 2026-08-14). Vor jeder Zahl über das
 * Spiel wird eine Zahl gemessen, deren richtiger Wert schon feststeht: eine LEERE
 * Seite im selben Browser muss 60 Bilder je Sekunde zeigen. Tut sie das nicht,
 * sind »das Spiel läuft mit 9 fps« und »mein Instrument sieht keine 60« dieselbe
 * Beobachtung — und dann bricht dieser Lauf ab, statt eine Zahl zu drucken, die
 * niemand einordnen kann. `harvest-perf.mjs` hatte dafür nur eine weiche Marke
 * (> 50, sonst »n/b« in einer Spalte); R115 verlangt den ABBRUCH, und genau das
 * ist der Unterschied zwischen den beiden Skripten.
 *
 * WARUM DIE SEITE ÜBERHAUPT SICHTBAR IST. Nicht, weil `--headless=new` fehlt —
 * sondern weil dieser Lauf seinen EIGENEN Chrome mit eigenem Profil startet und
 * sich an ein FRISCH erzeugtes Ziel hängt (`Target.createTarget`). Dort meldet
 * die Seite `document.hidden === false`, und die Bilduhr läuft. Für die
 * eingebauten Browser-Flächen gilt das NICHT (P-56/P-57). Deshalb wird
 * `visibilityState` in jedem Lauf gemessen und in den Beipackzettel geschrieben,
 * nie behauptet.
 *
 * WAS GEMESSEN WIRD, UND WO ES HERKOMMT:
 *   bau      der Szenen-Konstruktor (Sim + Kunst-Umfang) — in Node, weil kein
 *            Browser hineinsehen kann. Ohne diese Spalte ist `aufbau` manipulierbar:
 *            Arbeit eine Funktion früher schieben senkt die Zahl und nichts sonst
 *            (P-77). Berichtet wird deshalb immer `bau+aufbau`.
 *   laden    Wanduhr des Laders — eine Eigenschaft DIESES Laufs, nie des Builds.
 *   aufbau   `create()`, vom mitgelieferten Instrument gelesen — samt der
 *            Aufschlüsselung je Bauschritt (`PaintScene#buildReport()`).
 *   Erstbild GPU · eingeschwungen · fps · Zeichenaufrufe · Texturen.
 *
 * ── R5-W8 · W7 · P7 §12.9 · UND DIE MASCHINE? ──────────────────────────────
 * Seit W6 sagt jeder Lauf, WELCHEN BAU er gemessen hat (`Bau: … · Quelle: …`).
 * Was er bis heute nicht sagte: auf WELCHER MASCHINE. P7 hat zwei Läufe
 * DESSELBEN Baus gemessen, die 32 % auseinanderlagen — das Rezept nagelt den
 * Bau fest, aber nicht den Rechner. W6 hat die drei Zahlen (Mess-Browser,
 * Lastmittel, fremde Server im Band 32xx/33xx) von Hand in seinen Report
 * geschrieben; Hand-Arbeit, die niemand erzwingt, fällt in der ersten Sitzung
 * aus, die es eilig hat.
 *
 * Sie werden jetzt VOR der Kontrollmessung und NACH dem Lauf gelesen und stehen
 * im Beipackzettel. Ein Lauf unter Last trägt seinen Makel selbst.
 *
 * ★ WARUM DER MAKEL NICHT ABBRICHT. Abbrechen darf nur die Kontrollmessung: sie
 *   weiß, ob das INSTRUMENT verzerrt (leere Seite unter 58 fps ⇒ jede Zahl
 *   beschreibt das Werkzeug). Eine belastete Maschine liefert dagegen echte,
 *   nur eben schlechtere Zahlen — die gehören gedruckt und gekennzeichnet, nicht
 *   verworfen. Wer sie verwirft, misst nie wieder, wenn eine Nachbarbahn läuft.
 *
 * LÜCKEN SIND KEINE NULLEN (D-118). Der Erstbild-Rekorder verpasst je Lauf etwa
 * eine von fünf Phasen — ein Wettlauf zwischen Sonde und `create()`. Eine Phase
 * mit fehlenden Zahlen wird deshalb bis zu dreimal neu geladen; bleibt die Lücke,
 * steht in der Zelle »—«, niemals eine Zahl.
 *
 * Benutzung (der Server läuft bereits, PRODUKTIONS-Build, eigener Port — P-65):
 *   node --experimental-strip-types scripts/perf-visible.mjs --port 4056
 *        [--phases p1,p2,p3,p4,p9] [--warm 0] [--runs 1] [--settle 900]
 *        [--json out.json] [--baseline vorher.json] [--floor 58]
 *   node scripts/perf-visible.mjs --selftest      # ohne Browser, ohne Server
 *
 * `?perf=1` ist eine Lehrer-Tür: ohne Lehrer-Sitzung bzw. `DEV_TEACHER_ID` in
 * `apps/web/.env.local` gibt es kein Instrument zu lesen (D-117).
 */
import { spawn } from "node:child_process";
import { raeumeVerwaisteProfile, wartenBisChromeWegIst, maschinenlesung } from "./chrome-hygiene.mjs";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ALL_PHASES = ["p1", "p2", "p3", "p4", "p9"];
const LEVEL_PATH = "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json";
const ART_DIR = "apps/web/public/art/g1/paint";
/** Wie oft eine Phase mit Lücken neu geladen wird, bevor »—« stehen bleibt (D-118). */
const GAP_ATTEMPTS = 3;
/** Die Untergrenze der Kontrollmessung. 58 statt 60: die Bilduhr eines echten
 *  Bildschirms trifft die 60 nie exakt (E5 maß 60,2 — eine Sekunde Fenster hat
 *  Rundungsluft), 58 lässt genau diese Luft und nichts weiter. */
const CONTROL_FLOOR_FPS = 58;

// ─────────────────────────────────────────────────────────────────────────────
// REINE FUNKTIONEN — hier liegt alles, was der Selbsttest ohne Browser prüfen kann
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Das Urteil über die Kontrollmessung: darf dieser Lauf Zahlen drucken?
 *
 * Getrennt von der Messung, damit der Selbsttest BEIDE Richtungen sehen kann —
 * eine Schwelle, die nie rot wird, ist Dekoration (P-56).
 */
export const controlVerdict = (controlFps, floor = CONTROL_FLOOR_FPS) => {
  const fps = typeof controlFps === "number" && Number.isFinite(controlFps) ? controlFps : null;
  if (fps === null) {
    return { ok: false, fps: null, floor, message: "die Kontrollseite hat gar keine Bildrate geliefert" };
  }
  if (fps < floor) {
    return {
      ok: false,
      fps,
      floor,
      message:
        `die Kontrollseite (leere Seite, derselbe Chrome) zeigt ${fps.toFixed(1)} fps, verlangt sind ${floor}. `
        + "Damit beschreibt jede Zahl dieses Laufs das WERKZEUG und nicht das Spiel (P-61) — Abbruch.",
    };
  }
  return {
    ok: true,
    fps,
    floor,
    message: `Kontrollseite ${fps.toFixed(1)} fps (Schwelle ${floor}) — Bildraten dieses Laufs sind belastbar.`,
  };
};

/**
 * Welche Zahlen einer Phase fehlen (D-118/D-327: eine Lücke sieht aus wie eine Null).
 *
 * Zwei Quellen, absichtlich beide: die Sonde selbst meldet seit E7 `gaps` MIT
 * GRUND (`perf.ts#firstFrame`), und hier wird zusätzlich nachgesehen, ob eine
 * der vier Spalten leer ist. Meldet die Sonde nichts, weil sie zu alt ist oder
 * gar nicht antwortete, fällt das Tor trotzdem nicht aus.
 */
export const gapsIn = (row) => {
  const wanted = ["loadMs", "createMs", "firstGpuMs", "settledGpuMs"];
  const own = wanted.filter((k) => row?.[k] === null || row?.[k] === undefined);
  const reported = Array.isArray(row?.ffGaps) ? row.ffGaps : [];
  // die Meldung der Sonde gewinnt, wo sie dasselbe Feld nennt — sie kennt den Grund
  const named = new Set(reported.map((g) => String(g).split(":")[0].trim()));
  return [...reported, ...own.filter((k) => !named.has(k))];
};

const num = (v, digits = 1) =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? "—" : String(+Number(v).toFixed(digits));

/**
 * Eine Zeile der Wächter-Tabelle. Mit `after === null` steht nur die eine
 * Messung da; mit beiden Seiten »vorher / nachher«, wie es die PR-Vorlage will.
 */
export const mdRow = (phase, before, after = null) => {
  const pair = (pick) => (after === null ? num(pick(before)) : `${num(pick(before))} / ${num(pick(after))}`);
  const bauAufbau = (r) => {
    if (r === null || r === undefined) return null;
    if (r.createMs === null || r.createMs === undefined) return null;
    return (r.bauMs ?? 0) + r.createMs;
  };
  const label = after === null ? phase : `${phase} vorher / nachher`;
  return `| ${label} | ${pair((r) => r?.loadMs)} | ${pair(bauAufbau)} | ${pair((r) => r?.firstGpuMs)} `
    + `| ${pair((r) => r?.settledGpuMs)} | ${pair((r) => r?.fps)} |`;
};

export const MD_HEAD = [
  "| Phase | laden (ms) | bau+aufbau (ms) | Erstbild GPU (ms) | eingeschwungen (ms) | fps |",
  "|---|---|---|---|---|---|",
];

export const mdTable = (rows, baseline = null) => {
  const byPhase = new Map(rows.map((r) => [r.phase, r]));
  const basePhase = new Map((baseline?.rows ?? []).map((r) => [r.phase, r]));
  const phases = rows.map((r) => r.phase);
  const body = phases.map((p) =>
    baseline === null ? mdRow(p, byPhase.get(p)) : mdRow(p, basePhase.get(p) ?? null, byPhase.get(p)),
  );
  return [...MD_HEAD, ...body].join("\n");
};

/** Die Bauschritt-Tabelle je Phase — die Aufschlüsselung, um die es E6 geht. */
/**
 * R5-W6b · E7 · DIE AUFSCHLÜSSELUNG, UND WAS DARIN EIN KIND IST.
 *
 * Schritte mit `parent` sitzen INNERHALB ihres Elternschritts. Sie werden
 * eingerückt gedruckt und in KEINE Summe genommen — sonst steht unter einer
 * create()-Zahl eine Summe, die größer ist als sie (E6 hat genau diese Tabelle
 * einmal ausgeliefert und reparieren müssen). Die Tabelle steht quer: Zeilen
 * sind Schritte, Spalten sind Phasen — bei zwölf Schritten ist die andere
 * Richtung nicht mehr lesbar.
 */
export const mdBuildSteps = (rows) => {
  // Der Schlüssel ist ELTERN + NAME, nicht der Name allein. `terrain` und
  // `props` haben beide ein Kind namens »· gitter«; beim ersten Lauf dieser
  // Tabelle hat das eine das andere geschluckt und die props-Zeile fehlte
  // stillschweigend. Eine Aufschlüsselung, in der eine Zeile verschwinden kann,
  // ohne dass es auffällt, ist genau die Sorte Werkzeug, die man nicht merkt.
  const key = (s) => `${s.parent ?? ""}\u0000${s.step}`;
  const seen = new Map(); // key -> {step, parent}
  for (const r of rows) for (const s of r.build ?? []) if (!seen.has(key(s))) seen.set(key(s), { step: s.step, parent: s.parent ?? null });
  if (seen.size === 0) return "";
  // Reihenfolge: Eltern in Auftrittsreihenfolge, jedes Kind direkt unter seinem
  const parents = [...seen.values()].filter((v) => v.parent === null).map((v) => v.step);
  const ordered = [];
  for (const par of parents) {
    ordered.push({ step: par, parent: null });
    for (const v of seen.values()) if (v.parent === par) ordered.push(v);
  }
  // Kinder, deren Eltern KEIN gemessener Schritt ist (Quersummen über mehrere
  // Schritte), bekommen eine eigene Überschrift — sonst hängen sie optisch unter
  // dem letzten Schritt der Tabelle und werden als dessen Kinder gelesen.
  const waisen = [...seen.values()].filter((v) => v.parent !== null && !parents.includes(v.parent));
  for (const gruppe of new Set(waisen.map((v) => v.parent))) {
    ordered.push({ step: gruppe, parent: null, ueberschrift: true });
    for (const v of waisen) if (v.parent === gruppe) ordered.push(v);
  }
  const head = `| Bauschritt (ms) | ${rows.map((r) => r.phase).join(" | ")} |`;
  const sep = `|---|${rows.map(() => "---").join("|")}|`;
  const cellOf = (r, v) => num((r.build ?? []).find((s) => s.step === v.step && (s.parent ?? null) === v.parent)?.ms);
  const body = ordered.map((v) => {
    if (v.ueberschrift === true) return `| _${v.step}_ | ${rows.map(() => "").join(" | ")} |`;
    const child = v.parent !== null;
    return `| ${child ? "&nbsp;&nbsp;" : "**"}${v.step}${child ? "" : "**"} | ${rows.map((r) => cellOf(r, v)).join(" | ")} |`;
  });
  const sums = rows.map((r) => num((r.build ?? []).filter((s) => (s.parent ?? null) === null).reduce((a, s) => a + s.ms, 0)));
  return [head, sep, ...body, `| **Summe (nur Eltern)** | ${sums.join(" | ")} |`].join("\n");
};

// ─────────────────────────────────────────────────────────────────────────────
// SELBSTTEST — vor jedem Browser, denn die CI-Maschine hat keinen Chrome
// ─────────────────────────────────────────────────────────────────────────────

if (process.argv.includes("--selftest")) {
  const seen = [];
  const say = (ok, what) => {
    console.log(`${ok ? "✓" : "✗"} ${what}`);
    if (!ok) seen.push(what);
  };

  // 1 · Die Kontrollschwelle muss rot werden können — und zwar GEGEN DEN
  //     MESSWERT gebogen, nie gegen die Konfiguration (P-71): die Schwelle wird
  //     erst NACH der (hier simulierten) Messung über den gemessenen Wert
  //     gehoben, damit der rote Zweig bei JEDEM denkbaren Messwert feuert.
  const measured = 60.2; // was E5 an einer leeren Seite gemessen hat
  const green = controlVerdict(measured, CONTROL_FLOOR_FPS);
  say(green.ok === true, `eine Kontrolle mit ${measured} fps wird angenommen`);
  const bent = controlVerdict(measured, measured + 1);
  say(bent.ok === false, "dieselbe Messung, Schwelle über den Messwert gebogen ⇒ ABBRUCH (der rote Zweig ist erreichbar)");
  say(/werkzeug/i.test(bent.message), "die Abbruch-Meldung nennt den Grund (Werkzeug statt Spiel)");
  say(controlVerdict(null).ok === false, "eine fehlende Kontrollmessung ist kein Freibrief");
  say(controlVerdict(30).ok === false, "eine gedrosselte Kontrolle (30 fps) bricht ab");

  // 2 · Lücken (D-118) müssen als Lücken erkannt werden, nicht als Nullen.
  say(gapsIn({ loadMs: 1, createMs: null, firstGpuMs: 2, settledGpuMs: 3 }).includes("createMs"),
    "eine fehlende create()-Zahl wird als Lücke erkannt");
  say(gapsIn({ loadMs: 1, createMs: 2, firstGpuMs: 3, settledGpuMs: 4 }).length === 0,
    "eine vollständige Messung meldet keine Lücke");
  // D-327: die Sonde meldet die Lücke jetzt MIT GRUND, und der Grund muss
  // durchkommen — eine Lücke ohne Grund zwingt die nächste Sitzung zum Raten.
  const mitGrund = gapsIn({
    loadMs: 1, createMs: null, firstGpuMs: 3, settledGpuMs: 4,
    ffGaps: ["createMs: create() has not run under this probe (D-327)"],
  });
  say(mitGrund.length === 1 && /D-327/.test(mitGrund[0]),
    "die Lückenmeldung der Sonde kommt MIT Grund durch und wird nicht verdoppelt");
  say(gapsIn({ loadMs: 1, createMs: null, firstGpuMs: 3, settledGpuMs: 4, ffGaps: [] }).length === 1,
    "meldet die Sonde nichts, findet die eigene Prüfung die Lücke trotzdem (kein Ausfall des Tors)");
  // TAMPER gegen den MESSWERT: eine vollständige Zeile wird um EINE Zahl
  // beraubt; das rote Licht MUSS danach angehen. Dass der Tamper sass, wird
  // erzwungen — eine Manipulation, die nichts verändert hat, beweist nichts.
  const voll = { loadMs: 1, createMs: 2, firstGpuMs: 3, settledGpuMs: 4 };
  const beraubt = { ...voll, settledGpuMs: null };
  say(voll.settledGpuMs !== beraubt.settledGpuMs, "TAMPER sass: eine Zahl ist wirklich verschwunden");
  say(gapsIn(voll).length === 0 && gapsIn(beraubt).length === 1,
    "TAMPER: dieselbe Zeile minus EINE Zahl ⇒ Lücke erkannt (das rote Licht ist erreichbar)");

  // 3 · Die Tabelle muss das Tor `check-perf-table.mjs` bestehen — und eine
  //     LEERE Tabelle muss es NICHT bestehen (sonst ist die Pflicht zahnlos).
  const full = ALL_PHASES.map((p, i) => ({
    phase: p, loadMs: 100 + i, bauMs: 10, createMs: 200 + i, firstGpuMs: 30, settledGpuMs: 3, fps: 60,
  }));
  const table = mdTable(full);
  const passesGate = (body) => {
    const lines = body.split("\n").filter((l) => l.trim().startsWith("|"));
    return ALL_PHASES.every((p) => {
      const row = lines.find((l) => new RegExp(`\\|\\s*${p}\\b`).test(l));
      return row !== undefined && /\d/.test(row.replace(new RegExp(p, "g"), ""));
    });
  };
  say(passesGate(table), "die erzeugte Tabelle erfüllt check-perf-table (alle fünf Phasen mit Ziffern)");
  const empty = mdTable(ALL_PHASES.map((p) => ({ phase: p })));
  say(!passesGate(empty), "eine Tabelle ganz ohne Messwerte fällt durch dasselbe Tor");
  say(mdRow("p1", full[0]).includes("210"), "bau+aufbau wird addiert, nicht nur aufbau berichtet (P-77)");

  if (seen.length === 0) {
    console.log("\nperf-visible SELBSTTEST: OK — die Kontrollschwelle hat ihr rotes Licht gesehen.");
    process.exit(0);
  }
  console.error(`\n✗ SELBSTTEST FEHLGESCHLAGEN: ${seen.length} Erwartung(en) nicht erfüllt.`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// AB HIER: der echte Lauf
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || args[i + 1] === undefined ? dflt : args[i + 1];
};

// --port ist PFLICHT. `harvest-perf.mjs` trug B4bs Port 3272 als Standard — ein
// Standard-Port ist in einem Haus mit sieben parallelen Sessions ein
// Fehler-Generator (P-65): man misst den Server des Nachbarn und merkt es nicht.
const portArg = arg("port", null);
if (portArg === null || !Number.isInteger(Number(portArg))) {
  console.error("perf-visible: --port <n> ist Pflicht (P-65: eigener Port je Session, nie der des Nachbarn).");
  process.exit(2);
}
const PORT = Number(portArg);
const CDP = Number(arg("cdp-port", "0")); // 0 = das Betriebssystem sucht einen freien (D-207)
const PHASES = String(arg("phases", ALL_PHASES.join(","))).split(",").filter(Boolean);
const WARM_OFF = arg("warm", null) === "0";
const RUNS = Number(arg("runs", "1"));
const SETTLE = Number(arg("settle", "900"));
// Frist je CDP-Anfrage — siehe `client` weiter unten (Exit-13-Befund, S2).
const CDP_TIMEOUT_DEFAULT_MS = 90_000;
const CDP_TIMEOUT = Number(arg("cdp-timeout", String(CDP_TIMEOUT_DEFAULT_MS)));
const SCENE_DUMP = arg("scene-dump", null);
const JSON_OUT = arg("json", null);
const BASELINE = arg("baseline", null);
const FLOOR = Number(arg("floor", String(CONTROL_FLOOR_FPS)));
const LABEL = arg("label", WARM_OFF ? "warm=0" : "warm=1");
// Nur für den Tamper-Beweis im Report: biegt die GEMESSENE Kontrollzahl nach
// unten, nachdem sie gemessen wurde. Das Skript muss danach abbrechen.
const TAMPER_CONTROL = args.includes("--tamper-control");
// ── R5-W7 · W6 · R183 · WELCHEN BAU HAT DIESER LAUF GEMESSEN? ───────────────
// Bis heute schrieb der Beipackzettel `commit: git rev-parse HEAD` — und zwar
// im Verzeichnis DES SKRIPTS. Das ist nicht der Bau, der gemessen wurde: B5s
// und D4s Vorher/Nachher-JSON trugen denselben Hash, obwohl zwischen den beiden
// Messungen gemergt worden war, und niemand konnte es an der Datei sehen.
// Drei Quellen, in dieser Reihenfolge, und jede sagt im Beipackzettel, WELCHE
// sie war:
//   1. der SERVER selbst (`/api/version` → `sha`) — die einzige GEPRÜFTE
//      Quelle: sie kommt aus dem Prozess, der gerade gemessen wird. Dafür wird
//      der Dev-Server mit `VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD)`
//      gestartet (Rezept in docs/PERF_WAECHTER.md).
//   2. `--worktree <pfad>` → `git -C <pfad> rev-parse HEAD` — ERKLÄRT, nicht
//      geprüft: der Aufrufer behauptet, dass dort der gemessene Server läuft.
//   3. `--build-label <text>` — wenn es keinen Commit gibt (fremder Build).
// Gibt es keine davon, bricht der Lauf AB. Der stille Rückfall auf das eigene
// Verzeichnis war der Fehler; ihn zu behalten und nur umzubenennen hieße, ihn
// zu behalten.
const WORKTREE = arg("worktree", null);
const BUILD_LABEL = arg("build-label", null);
/** Nur fuer die Ausgabe — die Zahlen selbst stehen in chrome-hygiene.mjs. */
const MESS_BAND = "3200–3399";

if (!existsSync(CHROME)) {
  console.error(`perf-visible: kein Chrome unter ${CHROME}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// ── bau: der Konstruktor, in Node gemessen (kein Browser sieht hinein, P-77) ──
const { Sim } = await import("../packages/game-paint/src/sim.ts");
const { phaseArtScope } = await import("../packages/game-paint/src/artScope.ts");
const level = JSON.parse(readFileSync(path.resolve(LEVEL_PATH), "utf8"));
const present = readdirSync(path.resolve(ART_DIR), { withFileTypes: true })
  .flatMap((d) => (d.isDirectory()
    ? readdirSync(path.join(path.resolve(ART_DIR), d.name)).filter((f) => f.endsWith(".png"))
    : []))
  .map((f) => f.replace(/\.png$/, ""));

const constructorMs = (phaseId, iterations = 7) => {
  const xs = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    phaseArtScope(level, phaseId, present);
    new Sim({ level, phaseId, grantedAbilities: () => [], freedCageIds: () => [] });
    xs.push(performance.now() - t0);
  }
  return median(xs);
};

// ── der eigene Browser ───────────────────────────────────────────────────────
// Zuerst: verwaiste EIGENE Profile aus abgebrochenen Läufen wegräumen (W5s
// Falle 1). Fremde Browser bleiben unangetastet — sie sind Last und gehören
// gemeldet, nicht getötet (D-339).
const PROFILE_PREFIX = "perf-visible-chrome-";

// ── 0 · DIE MASCHINE, BEVOR DIESER LAUF SELBST EINER WIRD (R5-W8 · W7) ──────
// ⚠ DIE STELLE IST DER PUNKT. Beim ersten Anlauf stand diese Lesung nach dem
// Chrome-Start — und meldete prompt »1 Mess-Browser laeuft, eine andere Sitzung
// misst gerade«: den EIGENEN. Das ist D-438 in neuem Gewand (dort war es der
// eigene, gerade sterbende Browser; hier der eigene, gerade geborene). Die
// Antwort ist dieselbe wie damals: nicht filtern, sondern zum richtigen
// Zeitpunkt lesen — VOR dem eigenen Start und NACH dem eigenen Ende.
const maschineVorher = maschinenlesung(PORT, CHROME);
console.log(`\nMaschine vor dem Lauf: Mess-Browser ${maschineVorher.messBrowser}`
  + ` · Lastmittel ${maschineVorher.last?.roh ?? "—"}`
  + ` · fremde Server im Band ${MESS_BAND}: ${maschineVorher.fremdeServer.length === 0
    ? "keine" : maschineVorher.fremdeServer.map((s) => `${s.port} (${s.befehl})`).join(", ")}`);
for (const z of maschineVorher.zeilen) console.log(z);
console.log(`  ${maschineVorher.urteil.satz}`);

raeumeVerwaisteProfile(CHROME, PROFILE_PREFIX);
const profile = mkdtempSync(path.join(tmpdir(), PROFILE_PREFIX));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  "--window-size=1200,900",
  "--autoplay-policy=no-user-gesture-required",
  // Die Bilduhr wach halten: ein in den Hintergrund gestellter Renderer drosselt
  // genau die Zeitgeber, auf denen diese Messung reitet (aus measure-create.mjs).
  "--disable-renderer-backgrounding",
  "--disable-backgrounding-occluded-windows",
  "--disable-background-timer-throttling",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${CDP}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

let chromeGone = null;
chrome.on("error", (e) => { chromeGone = `konnte nicht starten: ${e.message}`; });
chrome.on("exit", (code, signal) => {
  if (chromeGone === null) chromeGone = `ist ausgestiegen (Code ${code ?? "—"}, Signal ${signal ?? "—"})`;
});

// D-207: die Adresse wird aus `DevToolsActivePort` im EIGENEN Profil GELESEN —
// diese Datei kann nur der Browser geschrieben haben, den dieser Lauf gestartet
// hat. Freiheit (Port 0) und Identität in einem Griff. Das funktioniert hier,
// weil kein `--disable-gpu` übergeben wird — mit dem schreibt Chrome die Datei
// nicht (gemessen in shoot-card-bench.mjs), und für eine GPU-Messung wäre es
// ohnehin das Falsche.
const endpoint = async () => {
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 80; i++) {
    if (chromeGone !== null) throw new Error(`Chrome ${chromeGone}`);
    if (existsSync(portFile)) {
      const [portLine, wsPath] = readFileSync(portFile, "utf8").split("\n");
      const bound = Number(portLine);
      if (Number.isInteger(bound) && bound > 0 && wsPath?.trim().startsWith("/devtools/")) {
        return `ws://127.0.0.1:${bound}${wsPath.trim()}`;
      }
    }
    await sleep(250);
  }
  throw new Error(`Chrome hat in 20 s keinen DevToolsActivePort geschrieben (Profil ${profile})`);
};

// ── R5-W6b · E7 · WARUM `--runs 3` MIT EXIT 13 STEHENBLIEB (S2-Befund) ───────
// Jede CDP-Anfrage landete in einer Map und wartete OHNE FRIST; ein Tod der
// Verbindung oder des Ziels weckte niemanden. Kommt eine Antwort nie, wird das
// Versprechen nie eingelöst, Node leert die Ereignisschleife und beendet mit
// **Exit 13** (»unerledigtes top-level await«) — ohne ein Wort. Genau das
// passiert, wenn `--runs 3` fünfzehn statt fünf Seiten öffnet und eine davon
// stirbt. Ein Werkzeug, das schweigend endet, ist schlimmer als eins, das
// abbricht: sein Schweigen sieht aus wie Geduld.
//
// Drei Dinge stehen jetzt dagegen, und jedes nennt beim Abbruch die Methode:
//   1. eine Frist je Anfrage (`--cdp-timeout`, Standard 90 s),
//   2. alle offenen Anfragen werden abgewiesen, wenn die Verbindung schliesst,
//   3. dasselbe, wenn der Browser aussteigt.
const client = (ws, timeoutMs = CDP_TIMEOUT_DEFAULT_MS) => {
  let id = 0;
  const waiting = new Map();
  const failAll = (why) => {
    for (const [, w] of waiting) { clearTimeout(w.timer); w.reject(new Error(why)); }
    waiting.clear();
  };
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id !== undefined && waiting.has(m.id)) {
      const { resolve, reject, timer } = waiting.get(m.id);
      clearTimeout(timer);
      waiting.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  ws.addEventListener("close", () => failAll("die CDP-Verbindung wurde geschlossen, während Anfragen offen waren"));
  ws.addEventListener("error", () => failAll("die CDP-Verbindung meldete einen Fehler, während Anfragen offen waren"));
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    id += 1;
    const mine = id;
    const timer = setTimeout(() => {
      waiting.delete(mine);
      reject(new Error(`CDP-Zeitüberschreitung nach ${timeoutMs} ms: ${method}${sessionId ? ` (Sitzung ${sessionId})` : ""}`));
    }, timeoutMs);
    timer.unref?.(); // eine Frist darf den Prozess nicht am Leben halten
    waiting.set(mine, { resolve, reject, timer });
    ws.send(JSON.stringify({ id: mine, method, params, sessionId }));
  });
  send.failAll = failAll;
  return send;
};

/** Echte Bilder über eine Wanduhr-Sekunde zählen. */
const FPS_PROBE = `new Promise((res) => { let n = 0; const t0 = performance.now();
  const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
    else res({ frames: n, ms: performance.now() - t0, hidden: document.hidden, vis: document.visibilityState }); };
  requestAnimationFrame(tick); })`;

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws, CDP_TIMEOUT);
// Stirbt der Browser mitten in einem Lauf, wecken wir die Wartenden selbst —
// sonst wartet der Prozess auf eine Antwort, die niemand mehr geben kann.
chrome.on("exit", () => send.failAll("Chrome ist ausgestiegen, während CDP-Anfragen offen waren"));

const withPage = async (fn) => {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (m, p) => send(m, p, sessionId);
  const evalIn = async (expression, awaitPromise = false) => {
    const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval fehlgeschlagen");
    return r.result.value;
  };
  try {
    await page("Page.enable");
    await page("Runtime.enable");
    return await fn({ page, evalIn });
  } finally {
    await send("Target.closeTarget", { targetId }).catch(() => {});
  }
};

const die = async (code, message) => {
  console.error(message);
  try { ws.close(); } catch { /* egal */ }
  chrome.kill();
  process.exit(code);
};

// ── 1 · DIE KONTROLLE ────────────────────────────────────────────────────────
const control = await withPage(async ({ page, evalIn }) => {
  await page("Page.navigate", { url: "about:blank" });
  await sleep(600);
  return evalIn(FPS_PROBE, true);
});
let controlFps = (control.frames / control.ms) * 1000;
if (TAMPER_CONTROL) {
  // TAMPER gegen den MESSWERT (P-71), angewandt NACH der Messung: die gemessene
  // Zahl wird unter die Schwelle gebogen. Der Abbruch muss danach feuern, ganz
  // gleich, was der Browser gerade wirklich geliefert hat.
  const bent = FLOOR - 1;
  console.log(`--tamper-control: gemessen ${controlFps.toFixed(1)} fps → gebogen auf ${bent.toFixed(1)} (Beweis, dass der Abbruch erreichbar ist)`);
  controlFps = bent;
}
const verdict = controlVerdict(controlFps, FLOOR);
console.log(`\nKontrollmessung: ${verdict.message}`);
console.log(`Bedingungen: hidden=${control.hidden} · visibilityState=${control.vis}`);
if (!verdict.ok) await die(1, "\n✗ perf-visible bricht ab — ohne belastbare Kontrolle wird hier keine Zahl gedruckt (R115/P-61).");

// ── 2 · die fünf Phasen ──────────────────────────────────────────────────────
const measureOnce = async (phase) => withPage(async ({ page, evalIn }) => {
  const url = `http://localhost:${PORT}/play/1/buch?phase=${phase}&perf=1${WARM_OFF ? "&warm=0" : ""}`;
  await page("Page.navigate", { url });

  let ready = false;
  for (let i = 0; i < 240 && !ready; i++) {
    await sleep(250);
    const st = await evalIn(`(() => {
      const p = window.__domigoPaintPerf;
      if (!p) return null;
      p.pump();
      return p.status().find((s) => s.key === "paint") ?? p.status()[0] ?? null;
    })()`).catch(() => null);
    if (st && st.progress >= 1 && st.children > 0) ready = true;
  }
  if (!ready) return { phase, error: "die Szene wurde nie fertig geladen (Lehrer-Tür zu? falscher Port?)" };

  // ein Bild von Hand, damit es überhaupt ein Erstbild zu berichten gibt
  await evalIn(`window.__domigoPaintPerf.drive(2, 1000/60)`, true).catch(() => null);

  const ff = await evalIn(`(async () => {
    const p = window.__domigoPaintPerf;
    const r = await p.firstFrame(1600);
    return {
      loadMs: r.loadMs, createMs: r.createMs, filesQueued: r.filesQueued,
      firstGpuMs: r.firstGpuMs, settledGpuMs: r.settledGpuMs,
      firstCpuMs: r.firstCpuMs, firstDrawCalls: r.firstDrawCalls,
      build: r.build, warmed: r.warmed, gaps: r.gaps ?? null,
    };
  })()`, true);

  // ── R5-W6b · E7 · DER ANZEIGELISTEN-ABZUG (Bild-Identität) ────────────────
  // Ein Bildvergleich hängt an der Animationsuhr; diese Liste nicht. Sie nennt
  // JEDES Objekt, das nach create() auf der Bühne steht, in der Reihenfolge, in
  // der es angelegt wurde — und bei gleicher Tiefe IST diese Reihenfolge, was
  // oben liegt. Sind zwei Abzüge gleich, ist das Bild per Konstruktion gleich.
  const dump = SCENE_DUMP === null ? null : await evalIn(`(() => {
    const g = window.__domigoPaintPerf.game;
    const sc = g.scene.getScene("paint");
    if (!sc) return null;
    const r3 = (v) => (typeof v === "number" ? Math.round(v * 1000) / 1000 : v);
    return JSON.stringify(sc.children.list.map((o, i) => ({
      i, type: o.type,
      x: r3(o.x), y: r3(o.y),
      w: r3(o.displayWidth), h: r3(o.displayHeight),
      ox: r3(o.originX), oy: r3(o.originY),
      depth: r3(o.depth), alpha: r3(o.alpha), rot: r3(o.rotation),
      visible: o.visible, blend: o.blendMode,
      // \`texture.key\` einer TileSprite ist eine je Lauf NEU erfundene UUID (Phaser
      // legt für das Füllmuster eine eigene Leinwand-Textur an) — als Identität
      // also wertlos. \`displayTexture\` ist das Blatt, das wirklich gemeint ist.
      tex: o.displayTexture?.key ?? o.texture?.key ?? null,
      frame: o.displayFrame?.name ?? o.frame?.name ?? null,
      texRaw: o.texture?.key ?? null,
      tint: o.tintTopLeft ?? null,
      tsx: r3(o.tileScaleX), tsy: r3(o.tileScaleY),
      tpx: r3(o.tilePositionX), tpy: r3(o.tilePositionY),
      cmds: o.commandBuffer ? o.commandBuffer.length : null,
      sfx: r3(o.scrollFactorX), sfy: r3(o.scrollFactorY),
    })));
  })()`).catch(() => null);

  await sleep(SETTLE); // das Bildfenster füllen lassen
  const fpsProbe = await evalIn(FPS_PROBE, true);
  const rep = await evalIn(`JSON.stringify(window.__domigoPaintPerf.read())`)
    .then((s) => (s ? JSON.parse(s) : null)).catch(() => null);

  return {
    phase,
    loadMs: ff.loadMs, createMs: ff.createMs, filesQueued: ff.filesQueued,
    firstGpuMs: ff.firstGpuMs, settledGpuMs: ff.settledGpuMs,
    firstCpuMs: ff.firstCpuMs, firstDrawCalls: ff.firstDrawCalls,
    build: Array.isArray(ff.build) ? ff.build : null,
    ffGaps: Array.isArray(ff.gaps) ? ff.gaps : null,
    dump: typeof dump === "string" ? JSON.parse(dump) : null,
    fps: (fpsProbe.frames / fpsProbe.ms) * 1000,
    hidden: fpsProbe.hidden, visibility: fpsProbe.vis,
    cpuP50: rep?.frame?.cpu?.p50 ?? null,
    cpuP95: rep?.frame?.cpu?.p95 ?? null,
    drawCalls: rep?.gpu?.drawCallsPerFrame ?? null,
    glTextures: rep?.gpu?.glTextures ?? null,
    texMb: rep?.gpu?.textureBytesEst != null ? +(rep.gpu.textureBytesEst / 1048576).toFixed(1) : null,
  };
});

const rows = [];
for (const phase of PHASES) {
  const bauMs = constructorMs(phase);
  const takes = [];
  let attempts = 0;
  // D-118: eine Lücke wird NEU GELADEN, nicht gedruckt.
  while (takes.length < RUNS && attempts < RUNS + GAP_ATTEMPTS) {
    attempts += 1;
    const r = await measureOnce(phase);
    if (r.error) { console.error(`  ${phase}: ${r.error}`); break; }
    const gaps = gapsIn(r);
    if (gaps.length > 0 && attempts < RUNS + GAP_ATTEMPTS) {
      console.error(`  ${phase}: Lücke in ${gaps.join(", ")} (D-118) — Versuch ${attempts}, neu laden`);
      continue;
    }
    takes.push(r);
  }
  if (takes.length === 0) { rows.push({ phase, bauMs, error: "keine vollständige Messung" }); continue; }
  const pick = (k) => {
    const xs = takes.map((t) => t[k]).filter((v) => typeof v === "number" && Number.isFinite(v));
    return xs.length ? median(xs) : null;
  };
  // Die Bauschritte werden GENAUSO gemittelt wie `createMs` darüber. Sonst steht
  // in der Zeile ein Median über drei Läufe und in der Tabelle darunter der
  // ERSTE, kalte Lauf — und die Summe der Schritte ist größer als die Zahl, die
  // sie aufschlüsseln soll. (Beim ersten Lauf dieses Skripts war p1 genau so:
  // 425 ms Median über 749 ms Schritt-Summe.) Eine Aufschlüsselung, die eine
  // andere Messung aufschlüsselt als die daneben, ist keine.
  const stepKeys = new Map();
  for (const t of takes) for (const s of t.build ?? []) {
    const k = `${s.parent ?? ""}\u0000${s.step}`;
    if (!stepKeys.has(k)) stepKeys.set(k, { step: s.step, parent: s.parent ?? null });
  }
  const build = [...stepKeys.values()].map(({ step, parent }) => {
    const xs = takes
      .map((t) => (t.build ?? []).find((s) => s.step === step && (s.parent ?? null) === parent)?.ms)
      .filter((v) => typeof v === "number" && Number.isFinite(v));
    return { step, parent, ms: xs.length ? median(xs) : null };
  });
  const row = {
    phase, bauMs, runs: takes.length, attempts,
    loadMs: pick("loadMs"), createMs: pick("createMs"), firstGpuMs: pick("firstGpuMs"),
    settledGpuMs: pick("settledGpuMs"), firstCpuMs: pick("firstCpuMs"),
    firstDrawCalls: takes[0].firstDrawCalls, filesQueued: takes[0].filesQueued,
    fps: pick("fps"), cpuP50: pick("cpuP50"), cpuP95: pick("cpuP95"),
    drawCalls: pick("drawCalls"), glTextures: pick("glTextures"), texMb: pick("texMb"),
    build: build.length > 0 ? build : null,
    buildFirstRun: takes[0].build,
    hidden: takes[0].hidden, visibility: takes[0].visibility,
    ffGaps: takes[0].ffGaps,
    gaps: gapsIn(takes[0]),
  };
  if (SCENE_DUMP !== null && takes[0].dump !== null && takes[0].dump !== undefined) {
    const out = SCENE_DUMP.replace(/(\.json)?$/, `.${phase}.json`);
    writeFileSync(out, JSON.stringify(takes[0].dump, null, 1));
    console.log(`  ${phase}: Anzeigeliste → ${out} (${takes[0].dump.length} Objekte)`);
  }
  rows.push(row);
  console.log(`  ${phase}: bau ${num(row.bauMs)} + aufbau ${num(row.createMs)} ms · laden ${num(row.loadMs)} ms · ${num(row.fps)} fps${row.gaps.length ? `  ⚠ Lücken: ${row.gaps.join(", ")}` : ""}`);
}

// ── 3 · Ausgabe ──────────────────────────────────────────────────────────────
const baseline = BASELINE && existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
console.log(`\n## PERF-WÄCHTER (${LABEL})\n`);
console.log(mdTable(rows, baseline));
const steps = mdBuildSteps(rows);
if (steps) {
  console.log(`\nBauschritte je Phase (ms, Median über ${RUNS} Lauf/Läufe — dieselbe Mittelung wie »aufbau« oben):\n\n${steps}`);
}
console.log(`\nGemessen mit: scripts/perf-visible.mjs · eigener Chrome --headless=new · `
  + `sichtbarer Tab (visibilityState=${control.vis}, hidden=${control.hidden}) · Kontrollseite ${verdict.fps.toFixed(1)} fps · Port ${PORT}`);
console.log(`Maschine beim Start: Mess-Browser ${maschineVorher.messBrowser} · Lastmittel `
  + `${maschineVorher.last?.m1 ?? "—"} · fremde Server ${maschineVorher.fremdeServer.length}`);
for (const r of rows) {
  if (r.gaps?.length) console.log(`⚠ ${r.phase}: blieb auch nach ${GAP_ATTEMPTS} Anläufen unvollständig (D-118/D-327) — »—« ist die ehrliche Zelle:\n    · ${r.gaps.join("\n    · ")}`);
  if (r.error) console.log(`⚠ ${r.phase}: ${r.error}`);
}

// ── R5-W7 · W6 · R183 · DIE PROVENIENZ ───────────────────────────────────────
const { execFileSync } = await import("node:child_process");
const revParse = (cwd) => {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd }).trim();
  } catch { return null; }
};
/** Was HEAD im Verzeichnis DIESES SKRIPTS ist. Steht im Beipackzettel unter
 *  seinem richtigen Namen, damit es nie wieder als »der gemessene Bau« gelesen
 *  wird. */
const scriptCommit = revParse(undefined);

/** Quelle 1: der gemessene Server sagt es selbst. */
const serverSha = await (async () => {
  try {
    const r = await fetch(`http://localhost:${PORT}/api/version`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return null;
    const j = await r.json();
    return /^[0-9a-f]{40}$/i.test(String(j?.sha ?? "")) ? String(j.sha) : null;
  } catch { return null; }
})();

let buildCommit = null;
let buildCommitSource = null;
if (serverSha !== null) {
  buildCommit = serverSha;
  buildCommitSource = "/api/version — der gemessene Server hat es selbst gesagt (GEPRÜFT)";
} else if (WORKTREE !== null) {
  buildCommit = revParse(path.resolve(WORKTREE));
  if (buildCommit === null) await die(1, `\n✗ perf-visible: --worktree ${WORKTREE} ist kein git-Verzeichnis.`);
  buildCommitSource = `--worktree ${WORKTREE} (ERKLÄRT, nicht geprüft — dass dort der gemessene Server läuft, ist die Behauptung des Aufrufers)`;
} else if (BUILD_LABEL !== null) {
  buildCommitSource = `--build-label (ERKLÄRT, kein Commit): ${BUILD_LABEL}`;
} else {
  await die(1, "\n✗ perf-visible: dieser Lauf kann nicht sagen, WELCHEN Bau er gemessen hat (R183).\n"
    + `   Drei Wege, der erste ist der beste:\n`
    + `   1. den Dev-Server mit VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD) starten — dann sagt /api/version es selbst\n`
    + "   2. --worktree <pfad zum worktree, aus dem der Server läuft>\n"
    + "   3. --build-label \"<was gemessen wurde>\" (wenn es keinen Commit gibt)\n"
    + "   Der frühere stille Rückfall auf HEAD des Skript-Verzeichnisses hat zwei Sitzungen\n"
    + "   identische Vorher/Nachher-Hashes geschrieben (R183) — er ist deshalb weg, nicht umbenannt.");
}
console.log(`Gemessener Bau: ${buildCommit ?? BUILD_LABEL} · Quelle: ${buildCommitSource}`);

const sidecar = {
  script: "scripts/perf-visible.mjs",
  label: LABEL,
  port: PORT,
  url: `http://localhost:${PORT}/play/1/buch?phase=<phase>&perf=1${WARM_OFF ? "&warm=0" : ""}`,
  buildCommit,
  buildCommitSource,
  buildLabel: BUILD_LABEL,
  scriptCommit,
  controlFps: verdict.fps,
  controlFloor: FLOOR,
  visibilityState: control.vis,
  hidden: control.hidden,
  warm: WARM_OFF ? "0" : "1",
  runsPerPhase: RUNS,
  // R5-W8 · W7: der Lauf traegt seinen Maschinen-Makel selbst (P7 §12.9). Die
  // NACHHER-Lesung gibt es erst, wenn der eigene Chrome wirklich weg ist —
  // deshalb wird `maschine` unten nachgetragen, kurz bevor die Datei entsteht.
  maschine: null,
  rows,
};


ws.close();
chrome.kill();
/** Wie viele EIGENE Chrome-Prozesse nach dem Warten noch stehen. Steht einer,
 *  misst die Nachher-Lesung diesen Lauf mit — dann wird sie als unbelastbar
 *  gekennzeichnet statt still als Maschinen-Aussage verkauft (D-438). */
let eigenerChromeRest = 0;
// ── R5-W7 · W6 · D-438 · AUF DAS ENDE WARTEN, NICHT AUF EINE UHR ────────────
// `kill()` schickt ein Signal und kehrt zurück. Wer unmittelbar danach die Last
// liest, zählt seinen eigenen, gerade sterbenden Browser mit (E7 maß erst 2,
// dann 0). Gewartet wird auf das PROZESS-ENDE — erst das exit-Ereignis des
// eigenen Kindes, dann die Prozesstabelle, bis kein Prozess mit unserem Profil
// mehr steht.
{
  const { gewartetMs, restend } = await wartenBisChromeWegIst(chrome, CHROME, profile);
  if (restend > 0) {
    console.warn(`⚠ nach ${gewartetMs} ms stehen noch ${restend} eigene Chrome-Prozesse `
      + `(Profil ${PROFILE_PREFIX}). Eine Lastlesung JETZT misst diesen Lauf mit (D-438).`);
  } else {
    console.log(`Eigener Chrome beendet nach ${gewartetMs} ms — eine Lastlesung ab hier misst die Maschine, nicht diesen Lauf (D-438).`);
  }
  eigenerChromeRest = restend;
}

// ── R5-W8 · W7 · und NACH dem Lauf, wenn der eigene Chrome wirklich weg ist ──
// Zwei Lesungen, nicht eine: eine Nachbarbahn, die MITTEN in diesem Lauf
// angefangen hat, waere in einer Vorher-Lesung unsichtbar — und genau so
// entstehen zwei Zahlen desselben Baus, die 32 % auseinanderliegen.
const maschineNachher = maschinenlesung(PORT, CHROME);
const nachherBelastbar = eigenerChromeRest === 0;
const maschine = {
  vorher: maschineVorher,
  nachher: maschineNachher,
  nachherBelastbar,
  eigenerChromeRest,
  makel: maschineVorher.urteil.makel || (nachherBelastbar && maschineNachher.urteil.makel),
  gruende: [
    ...maschineVorher.urteil.gruende.map((g) => `vorher: ${g}`),
    ...(nachherBelastbar
      ? maschineNachher.urteil.gruende.map((g) => `nachher: ${g}`)
      : [`nachher: NICHT BELASTBAR — ${eigenerChromeRest} eigene(r) Chrome-Prozess(e) standen noch (D-438)`]),
  ],
};
console.log(`\nMaschine nach dem Lauf: Mess-Browser ${maschineNachher.messBrowser}`
  + ` · Lastmittel ${maschineNachher.last?.roh ?? "—"}`
  + ` · fremde Server im Band ${MESS_BAND}: ${maschineNachher.fremdeServer.length === 0
    ? "keine" : maschineNachher.fremdeServer.map((s) => `${s.port} (${s.befehl})`).join(", ")}`);
console.log(maschine.makel
  ? `⚠ MAKEL DIESES LAUFS — ${maschine.gruende.join(" · ")}.\n`
    + "   Die Zahlen oben stehen, aber sie beschreiben zum Teil die MASCHINE und nicht den Code\n"
    + "   (R115/D-339/A7; P7 §12.9 mass 32 % Streuung an DEMSELBEN Bau). Wer sie vergleicht,\n"
    + "   vergleicht mit: dieser Zeile."
  : "Kein Makel: die Maschine war vor und nach dem Lauf frei — diese Zahlen beschreiben den Code.");

if (JSON_OUT) {
  sidecar.maschine = maschine;
  writeFileSync(JSON_OUT, JSON.stringify(sidecar, null, 1));
  console.log(`\n→ Beipackzettel (mit Maschinen-Lesung): ${JSON_OUT}`);
}

// ── R5-W6b · E7 · D-327 · EINE LÜCKE IST EIN ROTES LICHT, KEINE FUSSNOTE ─────
// Bis hierher endete dieses Skript mit 0, solange nur keine Phase ganz gefehlt
// hat — eine Tabelle mit drei »—« sah für jeden Aufrufer aus wie ein Erfolg.
// Der Auftraggeber dieser Tabelle ist aber ein Budget-Vergleich: eine fehlende
// Zahl ist dort kein kleineres Ergebnis, sondern gar keins.
const unvollstaendig = rows.filter((r) => r.gaps?.length);
if (unvollstaendig.length > 0) {
  console.error(`\n✗ ${unvollstaendig.length} von ${rows.length} Phasen sind unvollständig `
    + `(${unvollstaendig.map((r) => r.phase).join(", ")}). Die Tabelle oben steht, aber sie ist `
    + `KEINE erfüllte Perf-Pflicht: Gründe je Phase stehen darüber.`);
}
process.exit(rows.some((r) => r.error) || unvollstaendig.length > 0 ? 1 : 0);
