#!/usr/bin/env node
/**
 * shoot-world — eine BILDREIHE aus der laufenden Welt, die ihren eigenen Beweis
 * mitbringt (R5-W3 · W1).
 *
 * `shoot-card-bench.mjs` fotografiert die Kartenbank; das ist gewöhnliches DOM
 * und war nie das Problem. Das Problem ist die WELT: ein WebGL-Canvas, den ein
 * normaler Screenshot schwarz zurückgibt — und dessen Ausweg (`renderer.snapshot`)
 * am 14.08. dreimal denselben Puffer lieferte, ohne dass es jemandem auffiel
 * (P-66). Eine Bildreihe, die still steht, sieht aus wie eine Bildreihe.
 *
 * ── WAS AN P-66 WIRKLICH KAPUTT WAR (gemessen, 14.08.) ─────────────────────
 * Nicht `renderer.snapshot()`. Der VERBORGENE TAB. Dieses Skript startet ein
 * eigenes Chrome und hängt sich an einen frisch erzeugten Tab — der meldet
 * `document.visibilityState === "visible"`, auch headless. Dort liefert
 * dieselbe Snapshot-Kette einwandfrei verschiedene Bilder und besteht den
 * Handschlag. Der Beipackzettel jeder Aufnahme trägt `visibility` und `hidden`
 * mit, damit diese Unterscheidung nie wieder Auslegungssache ist.
 *
 * Welcher Weg trägt, entscheidet nicht die Meinung, sondern der Handschlag:
 * zwei Probeaufnahmen mit einem step() dazwischen, deren Prüfsummen sich
 * unterscheiden müssen. Besteht er ihn nicht, endet der Lauf mit Exit 1 und
 * einer Meldung, die die drei bekannten Ursachen nennt.
 *
 * ── --pure, und warum es für Messreihen Pflicht ist ────────────────────────
 * Der Schuss KOSTET Ticks: `rafStep()` treibt die Uhr mit. Gemessen kostete er
 * hier 5–8 Ticks pro Bild — eine Reihe „alle 6 Ticks" rückte in Wahrheit 25–28
 * Ticks weiter. Bei einem Käfig, dessen Rüttel-Periode 11 Ticks ist, ist das
 * kein Detail, sondern Aliasing: die Reihe zeigt beliebige Phasen und behauptet
 * eine Kadenz. `--pure` deaktiviert die Szene für die beiden Render-Frames —
 * gezeichnet wird, gerechnet nicht. `shotCostTicks` steht im Zettel, gemessen.
 *
 * Benutzung (der Dev-Server muss schon laufen — die Lehrer-Tür ist dev-only):
 *   node scripts/shoot-world.mjs <outDir> --phase p1 --port 3021 \
 *        [--visible] [--sink-port 3921] [--cdp-port 9341] \
 *        [--warp c,r] [--settle 240] [--shots 14] [--every 6] [--pure] \
 *        [--press left|right|jump] [--name uns_kaefig] [--tick 900]
 *        [--standbild] [--toast]
 *
 * ── --tick, und warum ein Vorher/Nachher es braucht (R5-W6b · W5, L1) ──────
 * Bis hierher konnte diese Reihe sagen, WANN sie entstanden ist (`state().tick`
 * steht im Beipackzettel), aber nicht, WANN sie entstehen SOLL. An etwas
 * Bewegtem — einem ruettelnden Kaefig, einer atmenden Figur — heisst das: zwei
 * Laeufe derselben Kameralage zeigen verschiedene Phasen derselben Bewegung,
 * und dieser Unterschied sieht in einem Seite-an-Seite genauso aus wie eine
 * Aenderung am Bild. `--tick n` fixiert den Takt der ERSTEN Aufnahme; die Reihe
 * laeuft danach wie gewohnt in `--every`-Schritten weiter.
 *
 * Gewartet wird auf den ZUSTAND, nicht auf die Uhr: gefahren wird mit
 * `frameSink.drive()`, und danach wird `state().tick` GELESEN. Ein Zeitgeber
 * waere hier besonders falsch — im verborgenen Tab drosselt Chrome ihn, und
 * eine Reihe, die »ungefaehr bei 900« sagt, ist keine Fixierung.
 *
 * Liegt der Takt schon ueber `n`, bricht der Lauf ab. Zurueckspulen kann
 * niemand, und ein Werkzeug, das dann still das naechstbeste Bild nimmt, macht
 * aus einer Fixierung eine Behauptung.
 *
 * ── --standbild, und warum es das GEGENTEIL einer Reihe ist (R5-W8 · W7) ───
 * P7 §7 blieb unfotografiert: die fuenf Torschluss-Meldungen werden auf die
 * SPIELFLAECHE gemalt, ein gewoehnlicher Screenshot bekommt WebGL nicht, und
 * dieses Skript weist eine stillstehende Reihe per Gesetz ab. Es gab kein
 * Instrument im Repo, das einen Augenblick fotografieren kann, in dem die Welt
 * absichtlich steht.
 *
 * `--standbild` nimmt deshalb GENAU EIN Bild und sagt das in seinem Zettel. Was
 * es NICHT tut, ist das Gesetz aufweichen: der normale Modus bleibt Wort fuer
 * Wort, wie er war (`frame-sink.mjs` prueft genau das mit einem Tamper).
 *
 * ★ DER HANDSCHLAG ENTFAELLT NUR, WENN ER MUSS — und dann steht es im Zettel.
 *   Der Auftrag sagte »der Handschlag entfaellt begruendet«. Am Code gemessen
 *   ist die Voraussetzung fuer den Torschluss-Fall aber gar nicht gegeben: die
 *   Meldung haelt die Welt NICHT an (`sim.ts#checkExit` kehrt nur zurueck, die
 *   Blase lebt ~900 ms auf Phasers Uhr). Die Welt laeuft dort also, und der
 *   Handschlag ist zu haben. Ihn pauschal fallen zu lassen, riss ein neues Loch
 *   auf: ein Standbild aus einer TOTEN Kamera (P-66) waere ein schwarzes Bild,
 *   das wie ein Beweis aussieht. Also: laeuft die Welt, wird der Handschlag
 *   gefahren und das Standbild traegt denselben Kamerabeweis wie eine Reihe;
 *   steht sie schon (offene Karte), entfaellt er MIT GRUND im Zettel.
 *
 * ── --toast: gewartet wird auf den ZUSTAND, nicht auf die Uhr ──────────────
 * Ein Standbild »vom Toast« ist nur dann eins, wenn die Blase beim Ausloesen
 * wirklich auf der Buehne stand. `--toast` faehrt deshalb in EINZELSCHRITTEN
 * weiter und liest nach jedem, ob eine Sprechblase mit Text und voller Deckung
 * in der Anzeigeliste steht; erst dann faellt der Schuss, und der GELESENE Text
 * steht im Beipackzettel. Findet er keine, bricht der Lauf ab, statt ein
 * beliebiges Bild »Toast« zu nennen.
 *
 * ⚠ EIGENER PORT, IMMER (P-65): am 14.08. sprach ein Live-Lauf mit einem fremden
 *   Dev-Server auf 3000 und hätte jede „live geprüft"-Aussage zur Lüge gemacht.
 *   Deshalb prüft dieses Skript zuerst, ob die laufende Klasse den NEUEN Code
 *   kennt (`state().tick` muss eine Zahl sein), und bricht sonst ab.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import http from "node:http";
import os, { tmpdir } from "node:os";
import path from "node:path";
import { CLIENT_SRC, createSink, laufBrauchbar } from "./frame-sink.mjs";

import { raeumeVerwaisteProfile, wartenBisChromeWegIst } from "./chrome-hygiene.mjs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Argumente ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(name);

// ── R5-W8 · W7 · `--fight` STEHT AB JETZT AUF S4s TREIBER (R209d/D-558) ─────
//
// Was hier vorher stand, ist dreimal gescheitert, und H5 §5 hat es mit Zahlen
// aufgeschrieben: der Lauf fror bei Takt 251 und 478 ein, sein Kartenlöser
// feuerte nie, und 600 getriebene Takte ließen `knots` unbewegt bei 3. Der
// Grund war keine Kleinigkeit an diesem Skript, sondern eine fehlende Fähigkeit
// im Spiel: die Boss-Karte kommt hinter einem ECHTEN Zeitgeber, und eine
// synchrone Takt-Schleife lässt ihn nie feuern.
//
// S4 hat die Fähigkeit gebaut (PR #351) und EINE Schnittstelle dafür erklärt:
//   window.__domigoPaint.fight = { load(pads) · advance(maxTicks?) · read() · release() }
// `advance()` ist AWAIT-BAR (das ist der ganze Punkt) und hält BEI jedem Wisch
// an — genau der stehende Augenblick, den P7 §12.8 fotografierbar haben wollte.
//
// Dieses Skript erfindet daran nichts. Es reicht das aufgezeichnete Band der
// Phase herein (`ch01.proof.json` → `phases[<phase>].pads`; der Aufrufer reicht
// es, damit Prüf-Inhalt nicht ins Bündel des Kindes wandert), fährt von Halt zu
// Halt und fotografiert jeden. Mit `--every n` wird ZUSÄTZLICH alle n Takte ein
// Bild genommen — dafür, und nur dafür, gilt die Abtast-Regel unten weiter.
//
// ── R5-W5 · W4 · D-259 · DIE ABTASTRATE UND DER BEIPACKZETTEL ───────────────
//
// Zwei Gesetze, die dieser Modus braucht und die OHNE Browser prüfbar sind —
// deshalb stehen sie hier oben, vor allem, was Chrome anfasst, und deshalb kann
// `--selftest` sie in CI fahren.
//
// GESETZ 1 · DIE ABTASTRATE — sie gilt für das ZUSÄTZLICHE Abtasten (--every).
// Von Halt zu Halt braucht es sie nicht: dort bestimmt das Ereignis den
// Auslöser, nicht eine Rate. Der Kampf hat zwei Takte: der Wisch dauert
// WIPE_TICKS, der Knoten-Schlag KNOT_BEAT_TICKS. Wer seltener abtastet als
// halb so oft (Nyquist), fotografiert eine Bewegung, die es nicht gibt — die
// Alias-Falle, die D-171 gemeldet hat. Die Zahlen sind hier KOPIERT, und weil
// eine Kopie driftet, liest der Selbsttest sie aus `entities.ts` nach.
const FIGHT_BEATS = { WIPE_TICKS: 36, KNOT_BEAT_TICKS: 48 };
export const maxEveryForFight = (beats = FIGHT_BEATS) =>
  Math.floor(Math.min(...Object.values(beats)) / 3); // ein Drittel, nicht die Hälfte: Nyquist ist die
                                                     // Grenze, an der ein Signal gerade noch existiert,
                                                     // nicht die, an der man es ansehen kann.

// GESETZ 2 · DER BEIPACKZETTEL. `solveTask()` ist nicht neutral: bei `task` und
// `finale` ruft es `resolveCorrect()`. Das Werkzeug BEANTWORTET die Aufgabe also
// richtig und spielt den Kampf ein Stück weit selbst. Eine Bildreihe ohne diesen
// Hinweis liest sich wie Spiel — und wäre eine Lüge über ihre eigene Herkunft.
// Also: sobald der Lauf EINE Karte gelöst hat, trägt JEDES Bild der Reihe den
// Vermerk, nicht nur das eine, an dem es passierte.
export const BEIPACKZETTEL = "Werkzeug hat die Karte gelöst (solveTask ⇒ resolveCorrect) — "
  + "diese Reihe zeigt den Kampf, NICHT das Spiel eines Kindes";
// R5-W8 · W7: der Treiber des Spiels beantwortet die Karten selbst und meldet
// nur ihre ZAHL zurueck (er kennt ihre Namen nicht mehr, als das Kind sie
// kennt). Der Zettel nimmt deshalb beides — eine Namensliste wie bisher oder
// eine Zahl. Was er NICHT tut, ist schweigen, sobald das Werkzeug mitgespielt
// hat: genau dafuer gibt es ihn.
export const fightSidecar = (geloest) => {
  const anzahl = Array.isArray(geloest) ? geloest.length : Number(geloest ?? 0);
  if (anzahl === 0) return { fight: true, karten: Array.isArray(geloest) ? [] : 0 };
  return { fight: true, karten: geloest, beipackzettel: BEIPACKZETTEL };
};

// ── R5-W7 · W6 · D-443 · DER SERVER LIEFERT DAS ALTE LEVEL ──────────────────
//
// B5 hat es teuer bezahlt: nach einer Level-Änderung zeigten ZWEI Bildreihen
// still die alte Zelle — der Dev-Server lieferte `ch01.level.json` aus seinem
// Zwischenspeicher. Nichts war rot, nichts war auffällig, die Bilder waren
// einfach falsch.
//
// Es gibt keine Adresse zum Curlen: das Level wird SERVERSEITIG gelesen
// (`apps/web/lib/paint-content.ts`) und als Prop in die Seite gereicht. Der
// ehrliche Kanal ist deshalb die AUSGELIEFERTE SEITE selbst. Gemessen (W6, an
// Port 3283): die Zeilen-Landkarte jeder Phase steht dort als JSON-Array,
// escaped — ein exakter Fingerabdruck, der sich bei jeder geänderten Zelle
// ändert.
//
// Rein und exportiert, damit der Selbsttest beide Richtungen sehen kann: eine
// Prüfung, die nie rot wird, ist Dekoration.
export const levelDrift = ({ level, html, phase }) => {
  const ph = (level.phases ?? []).find((x) => x.id === phase)
    ?? (level.arena?.id === phase ? level.arena : null);
  if (ph === null || ph === undefined) return null;      // kein Urteil über eine Phase, die es nicht gibt
  if (!Array.isArray(ph.rows) || ph.rows.length === 0) return null;
  const alsPayload = JSON.stringify(ph.rows).replaceAll('"', '\\"');
  if (html.includes(alsPayload)) return null;
  return `die Zeilen-Landkarte der Phase ${phase} steht NICHT in der ausgelieferten Seite. `
    + "Der Server liefert eine ANDERE (fast immer: eine ältere) Fassung des Levels als die Platte — "
    + "genau D-443, und eine Bildreihe von hier zeigt eine Welt, die es auf der Platte nicht gibt. "
    + "Rezept: Dev-Server beenden und neu starten, dann diesen Lauf wiederholen.";
};

// ── R5-W8 · W7 · DER STANDBILD-PLAN, als reine Funktion ────────────────────
// Drei Entscheidungen haengen an einer Flagge, und alle drei sind ohne Browser
// pruefbar — deshalb stehen sie hier und nicht verstreut im Lauf. Genau hier
// gehen »richtig« und »plausibel-falsch« auseinander (P-82): wer den Modus
// baut, indem er den Handschlag GLOBAL abschaltet, faellt an `abbruchWennWeltSteht`.
export const standbildPlan = ({ standbild, weltLaeuft, shotsWunsch, toast = false }) => ({
  // Ein Standbild ist EIN Bild. Eine Reihe von Standbildern gibt es nicht.
  shots: standbild ? 1 : shotsWunsch,
  // ★ WAS IST DAS MOTIV? Daran haengt, ob eine offene Karte weggeloest wird.
  //   Gemessen am 22.08. an p1: das Kapitel oeffnet die Auftakt-Karte »goal« und
  //   friert die Welt bei Takt 0 ein. Fuer ein Standbild DIESER Karte ist das
  //   der Auftrag — sie wegzuloesen hiesse, das Motiv zu zerstoeren. Fuer ein
  //   Standbild eines TOASTS ist es der Weg: der Torschluss feuert in
  //   `checkExit`, also muss die Welt erst laufen und das Kind erst am Ausgang
  //   stehen. Eine Flagge, die beides gleich behandelt, kann nur eines davon.
  karteIstMotiv: standbild === true && toast !== true,
  // …und AUFGERAEUMT wird in keinem Standbild-Modus. Das Nachraeumen nach dem
  // Stellungbeziehen (offene Karten wegloesen, »laeuft die Welt noch?«) ist fuer
  // eine Reihe richtig und fuer JEDES Standbild falsch: gemessen in p1 oeffnet
  // das Stellungbeziehen die Tuer-Karte EINEN Takt nach dem Torschluss-Toast —
  // wer sie wegloest, loescht den Augenblick, den er fotografieren wollte.
  nachraeumen: standbild !== true,
  // Der Handschlag wird gefahren, wann immer er zu haben ist — auch im
  // Standbild-Modus. Er entfaellt NUR, wenn die Welt schon stand.
  handschlag: standbild ? weltLaeuft === true : true,
  // …und der normale Modus bricht weiter ab, wenn die Welt steht. Das ist der
  // Satz, den der Auftrag als Tamper bestellt hat.
  abbruchWennWeltSteht: standbild !== true,
});

// ── R5-W8 · W7 · WELCHE TASTE BEWEGT, UND WELCHE HANDELT ───────────────────
//
// Die press()-Wand (W5/S2) liest die LAGE des Kindes und meldet »nicht bewegt«,
// wenn sich x, y, vx und vy nicht ruehren. Fuer links/rechts/Sprung ist das die
// richtige Frage. Fuer ↑ ist es die falsche: ↑ ist die HANDLUNGS-Taste (Kaefig
// oeffnen, Wesen ansprechen) — das Kind steht dabei still, und genau das ist der
// Erfolgsfall. Gemessen am 22.08. an p4s Kaefig: `--press up` schloss den
// `cagehint` weg, loeste den Torschluss `cageGated` aus — und der Lauf brach mit
// »hat das Kind NICHT bewegt« ab. Eine Falschmeldung derselben Klasse, gegen die
// diese Pruefung selbst gebaut wurde (sie las erst nur x und meldete jeden
// Sprung als Stillstand).
export const BEWEGUNGSTASTEN = new Set(["left", "right", "down", "jump"]);

/**
 * Hat der Druck gewirkt? Fuer eine Bewegungstaste heisst das: die Lage hat sich
 * geruehrt. Fuer eine Handlungstaste: die WELT hat geantwortet — eine Karte,
 * ein Halt, ein Wesen in einem anderen Zustand. Rein, damit beide Zweige ohne
 * Browser pruefbar sind.
 */
export const druckWirkte = (taste, vorher, nachher) => {
  const geruehrt = Math.abs(nachher.x - vorher.x) > 0.5 || Math.abs(nachher.y - vorher.y) > 0.5
    || Math.abs(nachher.vx) > 0.01 || Math.abs(nachher.vy) > 0.01;
  if (BEWEGUNGSTASTEN.has(taste)) return { wirkte: geruehrt, woran: "Lage" };
  const geantwortet = vorher.karte !== nachher.karte || vorher.overlay !== nachher.overlay
    || vorher.hold !== nachher.hold || vorher.wesen !== nachher.wesen;
  return { wirkte: geruehrt || geantwortet, woran: geruehrt ? "Lage" : "Weltantwort" };
};

/** Wie viele Einzelschritte `--toast` hoechstens faehrt, bevor er aufgibt.
 *  Gemessen: die Blase geht in ~170 ms Tween-Zeit auf (rund 10 getriebene
 *  Takte) und faengt nach 640 ms an zu verblassen; der Torschluss-Abstand
 *  (`gateToastCooldown`) ist 120 Takte. 300 deckt zwei volle Zyklen ab und
 *  bleibt eine Zahl, keine Geduld. */
export const TOAST_MAX_TAKTE = 300;

/** Voll gedeckt heisst: die Auftakt-Bewegung ist durch. Eine Blase bei alpha
 *  0,3 ist auf dem Bild ein Schleier, kein Satz. */
export const TOAST_MIN_ALPHA = 0.9;

const outDir = argv.find((a) => !a.startsWith("--") && argv[argv.indexOf(a) - 1]?.startsWith("--") !== true);

if (has("--selftest")) {
  // Was hier läuft, braucht keinen Browser: die Abtast-Regel und der
  // Beipackzettel sind reine Arithmetik über zwei Konstanten und eine Liste.
  const fs = await import("node:fs");
  const url = await import("node:url");
  const hier = path.dirname(url.fileURLToPath(import.meta.url));
  let bad = 0;
  const ok = (name, got, want) => {
    if (got === want) console.log(`  ✓ ${name}`);
    else { bad++; console.error(`  ✗ ${name} — erwartet ${want}, bekommen ${got}`); }
  };

  // 1 · die kopierten Takt-Zahlen müssen die aus dem Spiel sein. Eine Kopie,
  //     die niemand nachliest, driftet — genau die Klasse, die W4 heute in
  //     key-fringe.mjs aufgeräumt hat.
  const ent = fs.readFileSync(path.join(hier, "../packages/game-paint/src/entities.ts"), "utf8");
  for (const [name, wert] of Object.entries(FIGHT_BEATS)) {
    const m = new RegExp(`export const ${name} = (\\d+)`).exec(ent);
    if (m === null) { bad++; console.error(`  ✗ ${name} steht nicht mehr in entities.ts — Takt-Kopie ungültig`); continue; }
    ok(`${name} stimmt mit entities.ts überein`, Number(m[1]), wert);
  }

  // 2 · die Abtastrate liegt unter beiden Takten (D-171, Alias-Falle)
  const maxEvery = maxEveryForFight();
  ok("die Höchst-Abtastrate liegt unter dem Wisch-Takt", maxEvery < FIGHT_BEATS.WIPE_TICKS / 2, true);
  ok("…und unter dem Knoten-Schlag", maxEvery < FIGHT_BEATS.KNOT_BEAT_TICKS / 2, true);
  ok("eine zu grobe Rate wird abgewiesen", maxEvery >= 24, false);

  // 3 · der Beipackzettel erscheint GENAU DANN, wenn eine Karte gelöst wurde —
  //     beide Richtungen, sonst prüft der Fall nur eine.
  ok("ohne gelöste Karte kein Beipackzettel", fightSidecar([]).beipackzettel, undefined);
  ok("…auch dann nicht, wenn die Zahl 0 gemeldet wird", fightSidecar(0).beipackzettel, undefined);
  ok("eine gemeldete ZAHL beantworteter Karten traegt ihn", fightSidecar(3).beipackzettel, BEIPACKZETTEL);
  ok("…und die Zahl steht mit dabei", fightSidecar(3).karten, 3);
  ok("mit gelöster Karte steht er drauf", fightSidecar(["wer"]).beipackzettel, BEIPACKZETTEL);
  ok("…und er nennt den Grund beim Namen", fightSidecar(["wer"]).beipackzettel.includes("resolveCorrect"), true);
  ok("…und die Karten stehen mit dabei", fightSidecar(["wer", "wie"]).karten.join(","), "wer,wie");

  // 4 · D-443 · die Level-Frische, beide Richtungen. Das Level ist das ECHTE
  //     von der Platte (P-71); die »ausgelieferte Seite« wird daraus gebaut —
  //     einmal treu, einmal mit genau EINER geänderten Zelle.
  {
    const lvl = JSON.parse(fs.readFileSync(
      path.join(hier, "../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json"), "utf8"));
    const ph = lvl.phases[0];
    const treu = `…irgendwas davor…${JSON.stringify(ph.rows).replaceAll('"', '\\"')}…irgendwas danach…`;
    ok("eine Seite mit DIESER Zeilen-Landkarte ist frisch", levelDrift({ level: lvl, html: treu, phase: ph.id }), null);

    const alt = JSON.parse(JSON.stringify(lvl));
    const zeile = alt.phases[0].rows.findIndex((r) => /[^.\s]/.test(String(r)));
    const r = String(alt.phases[0].rows[zeile]);
    const spalte = r.split("").findIndex((c) => c !== "." && c !== " ");
    // EINE Zelle, mehr nicht (W5-Falle 4: ein Tamper darf nur eine Größe bewegen)
    alt.phases[0].rows[zeile] = `${r.slice(0, spalte)}.${r.slice(spalte + 1)}`;
    const drift = levelDrift({ level: alt, html: treu, phase: ph.id });
    ok("EINE geänderte Zelle wird gefunden", typeof drift === "string" && drift.includes("D-443"), true);
    ok("…und die Meldung nennt die Phase", typeof drift === "string" && drift.includes(ph.id), true);
    ok("über eine Phase, die es nicht gibt, wird nicht geurteilt",
      levelDrift({ level: lvl, html: treu, phase: "gibt-es-nicht" }), null);
  }

  // 5 · R5-W8 · W7 · DER STANDBILD-PLAN, beide Richtungen und der Tamper.
  {
    const reihe = standbildPlan({ standbild: false, weltLaeuft: true, shotsWunsch: 8 });
    ok("ohne die Flagge bleiben es 8 Aufnahmen", reihe.shots, 8);
    ok("…und der Handschlag ist Pflicht", reihe.handschlag, true);
    ok("…und eine stehende Welt bricht weiter ab", reihe.abbruchWennWeltSteht, true);

    const laeuft = standbildPlan({ standbild: true, weltLaeuft: true, shotsWunsch: 8 });
    ok("mit der Flagge ist es GENAU EIN Bild", laeuft.shots, 1);
    ok("…und weil die Welt noch lief, wird der Handschlag gefahren", laeuft.handschlag, true);

    ok("ohne die Flagge ist eine offene Karte NIE das Motiv",
      standbildPlan({ standbild: false, weltLaeuft: true, shotsWunsch: 8 }).karteIstMotiv, false);
    ok("mit --standbild allein IST die offene Karte das Motiv", laeuft.karteIstMotiv, true);
    ok("mit --standbild --toast ist sie es NICHT (der Torschluss feuert in einer laufenden Welt)",
      standbildPlan({ standbild: true, weltLaeuft: true, shotsWunsch: 8, toast: true }).karteIstMotiv, false);
    ok("…aber NACHGERAEUMT wird auch dann nicht (das Wegloesen loescht den Augenblick)",
      standbildPlan({ standbild: true, weltLaeuft: true, shotsWunsch: 8, toast: true }).nachraeumen, false);
    ok("ohne die Flagge wird weiter nachgeraeumt", reihe.nachraeumen, true);

    const steht = standbildPlan({ standbild: true, weltLaeuft: false, shotsWunsch: 8 });
    ok("stand die Welt schon, entfaellt der Handschlag", steht.handschlag, false);
    ok("…und der Lauf bricht deswegen NICHT ab", steht.abbruchWennWeltSteht, false);
    ok("…und es bleibt bei EINEM Bild", steht.shots, 1);

    // TAMPER, auf dem Fall sitzend: der Modus wird gebaut, indem der Handschlag
    // GLOBAL faellt. Die Zahl der Aufnahmen sieht danach richtig aus — und der
    // normale Modus haette sein rotes Licht verloren.
    const globalAbgeschaltet = () => ({ shots: 1, handschlag: false, abbruchWennWeltSteht: false });
    const gefaelscht = globalAbgeschaltet();
    ok("TAMPER sass: die gefaelschte Fassung sagt etwas anderes",
      gefaelscht.abbruchWennWeltSteht !== reihe.abbruchWennWeltSteht, true);
    ok("TAMPER: ein global abgeschalteter Handschlag wuerde AUCH die Reihe treffen — genau das trennt der Plan",
      standbildPlan({ standbild: false, weltLaeuft: false, shotsWunsch: 8 }).abbruchWennWeltSteht, true);

    // 5b · die press()-Wand: Bewegungstaste gegen Handlungstaste (der Fall vom
    //      22.08. an p4s Kaefig). Die Lagen sind ECHTE Zahlen aus jenem Lauf.
    const stand = { x: 504, y: 288, vx: 0, vy: 0, overlay: false, karte: null, hold: false, wesen: "cage1::" };
    const gelaufen = { ...stand, x: 512 };
    const geantwortet = { ...stand, overlay: true, karte: "cagehint" };
    ok("rechts + das Kind laeuft ⇒ gewirkt", druckWirkte("right", stand, gelaufen).wirkte, true);
    ok("rechts + nichts ruehrt sich ⇒ die Wand (unveraendert)", druckWirkte("right", stand, stand).wirkte, false);
    ok("★ ↑ + das Kind steht, aber die Welt antwortet ⇒ GEWIRKT (der Fehlalarm vom 22.08.)",
      druckWirkte("up", stand, geantwortet).wirkte, true);
    ok("…und die Meldung sagt, WORAN es gelesen wurde", druckWirkte("up", stand, geantwortet).woran, "Weltantwort");
    ok("↑ + weder Lage noch Welt ⇒ weiterhin die Wand", druckWirkte("up", stand, stand).wirkte, false);
    // TAMPER, auf dem Fall sitzend: wer die Wand »repariert«, indem er sie fuer
    // ALLE Tasten aufweicht, verliert das rote Licht fuer links/rechts — genau
    // die Wand, gegen die S2 sie gebaut hat.
    ok("TAMPER: rechts darf sich NICHT auf eine Weltantwort berufen",
      druckWirkte("right", stand, geantwortet).wirkte, false);
    ok("die Toast-Suche hat eine Zahl, keine Geduld", Number.isInteger(TOAST_MAX_TAKTE) && TOAST_MAX_TAKTE > 0, true);
    ok("…und eine halb aufgegangene Blase zaehlt nicht", TOAST_MIN_ALPHA > 0.5, true);
  }

  if (bad > 0) { console.error("shoot-world --selftest: FEHLGESCHLAGEN"); process.exit(1); }
  console.log("shoot-world --selftest: OK — die Takt-Kopien stimmen mit entities.ts überein, "
    + "die Abtastrate liegt unter beiden Kampf-Takten, der Beipackzettel erscheint genau dann, "
    + "wenn das Werkzeug mitgespielt hat, und eine EINZIGE geänderte Zelle im Level wird an der "
    + "ausgelieferten Seite gefunden (D-443). Dazu der Standbild-Plan: mit der Flagge EIN Bild, "
    + "der Handschlag nur wenn die Welt noch lief — und OHNE die Flagge bricht eine stehende Welt "
    + "weiter ab (P-82).");
  process.exit(0);
}

if (!outDir) {
  console.error("usage: node scripts/shoot-world.mjs <outDir> --phase p1 --port 3021 [...]");
  console.error("       node scripts/shoot-world.mjs --selftest");
  process.exit(1);
}
const phase = flag("--phase", "p1");
const port = Number(flag("--port", 3021));
const sinkPort = Number(flag("--sink-port", 3921));
const cdpPort = Number(flag("--cdp-port", 9341));
const fight = has("--fight");
// R5-W8 · W7 · P7 §12.8: EIN Bild aus einem stehenden Augenblick.
const standbild = has("--standbild");
const toastWunsch = has("--toast");
if (standbild && fight === false && argv.includes("--shots")) {
  console.warn("  ⚠ --shots wird im Standbild-Modus nicht gelesen: ein Standbild ist EIN Bild.");
}
const shotsWunsch = Number(flag("--shots", fight ? 24 : 8));
const plan = standbildPlan({ standbild, weltLaeuft: true, shotsWunsch, toast: toastWunsch });
const shots = plan.shots;
// D-171: im Kampf wird die Rate ERZWUNGEN, nicht dem Aufrufer überlassen.
const everyWunsch = Number(flag("--every", fight ? 8 : 6));
const every = fight ? Math.min(everyWunsch, maxEveryForFight()) : everyWunsch;
// Im Kampf wird NUR abgetastet, wenn der Aufrufer es verlangt. Ohne --every
// faehrt der Treiber von Wisch zu Wisch — das Ereignis ist der Ausloeser.
const kampfTastetAb = fight && argv.includes("--every");
/** Wo das aufgezeichnete Band liegt (S4 reicht es herein, es steht nicht im Bündel). */
const bandDatei = flag("--band", "content/corpus/stories/g1.st.lost-pages/paint/ch01.proof.json");
// …und p4 läuft mit 240 Setz-Schritten über sein Ende hinaus (gemessen 17.08.:
// bei 240 steht der Tick hinterher, bei 20 und 60 läuft die Welt).
// …und ein Standbild will nicht 240 Schritte weit weg von dem Augenblick sein,
// den es fotografieren soll: die Torschluss-Blase lebt rund 54 getriebene Takte.
const settle = Number(flag("--settle", fight || standbild ? 20 : 240));
const warp = flag("--warp", null);
const press = flag("--press", null);
const stem = flag("--name", "frame");
// R5-W6b · W5 · L1s Befund: der Tick einer Aufnahme liess sich nicht vorgeben,
// also war ein Vorher/Nachher an bewegten Dingen nur eingeschraenkt
// vergleichbar (zwei Laeufe derselben Kameralage zeigen verschiedene Phasen
// derselben Bewegung, und der Unterschied sieht aus wie eine Aenderung).
const tickWunsch = flag("--tick", null) === null ? null : Number(flag("--tick", null));
// Der Schuss darf den Augenblick nicht selbst wegschieben: `rafStep()` treibt die
// Uhr mit und damit auch die Tweens, an denen die Blase haengt. Im Standbild-Modus
// ist `--pure` deshalb der Standard und nicht eine Bitte (gesagt wird es unten).
// …und im Kampf ist es keine Bitte, sondern Pflicht: `rafStep()` würde die Uhr
// NEBEN dem Band mittreiben, und ein aufgezeichnetes Band setzt genau ein Bild
// je Takt voraus (S4 hat denselben Fehler gemessen: 627 Bandtakte gegen 782
// Szenen-Takte, derselbe Lauf zweimal verschieden).
const pure = has("--pure") || standbild || fight;
const visible = has("--visible");

if (!existsSync(CHROME)) { console.error(`kein Chrome unter ${CHROME}`); process.exit(1); }
mkdirSync(outDir, { recursive: true });

// ── die Senke, im selben Prozess: EIN Verdikt, EIN Exit-Code ────────────────
const sink = createSink(outDir, { standbild });
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (req.method !== "POST") { res.writeHead(200); return res.end("shoot-world sink"); }
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    let meta = null;
    try { meta = JSON.parse(decodeURIComponent(String(req.headers["x-domigo-meta"] ?? ""))); } catch { meta = null; }
    const r = sink.offer(decodeURIComponent((req.url ?? "/f").slice(1)), Buffer.concat(chunks).toString("utf8"), meta);
    if (r.code !== 200) console.error(`\n✗ ${r.body}\n`);
    res.writeHead(r.code);
    res.end(r.body);
  });
});
await new Promise((r) => server.listen(sinkPort, r));

// ── Chrome ──────────────────────────────────────────────────────────────────
// R5-W7 · W6 · W5s Falle 1, bezahlt: ein abgebrochener Vordergrund-Lauf laesst
// seinen eigenen Chrome AM LEBEN (Profil `shoot-world-chrome-…`, Fernsteuer-Port
// 9380), und der FOLGELAUF haengt daran. Verwaiste EIGENE Profile werden
// deshalb beim Start geraeumt — und gemeldet, denn wer nicht erfaehrt, dass ein
// Vorlauf abgestuerzt ist, misst weiter gegen eine Umgebung, die er nicht kennt.
// Fremde Browser bleiben unangetastet (D-339: sie sind Last, kein Muell).
const PROFILE_PREFIX = "shoot-world-chrome-";
raeumeVerwaisteProfile(CHROME, PROFILE_PREFIX);
const profile = mkdtempSync(path.join(tmpdir(), PROFILE_PREFIX));
const chrome = spawn(CHROME, [
  ...(visible ? [] : ["--headless=new"]),
  "--hide-scrollbars",
  "--no-first-run",
  "--force-device-scale-factor=1",
  "--window-size=1200,900",
  "--autoplay-policy=no-user-gesture-required",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${cdpPort}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "ignore"] });

async function endpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { /* noch nicht oben */ }
    await sleep(250);
  }
  throw new Error("Chrome hat seinen Debug-Port nie geöffnet");
}

function client(ws) {
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
}

const ws = new WebSocket(await endpoint());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = client(ws);
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const page = (m, p) => send(m, p, sessionId);
await page("Page.enable");
await page("Runtime.enable");

/** JS in der Seite, Ergebnis als Wert. Wirft, wenn die Seite wirft. */
const evalIn = async (expression, awaitPromise = false) => {
  const r = await page("Runtime.evaluate", { expression, returnByValue: true, awaitPromise });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description ?? JSON.stringify(r.exceptionDetails));
  }
  return r.result.value;
};

const fail = async (msg) => {
  console.error(`\n✗ ${msg}`);
  await bail(1);
};

const bail = async (code) => {
  const v = sink.verdict();
  writeFileSync(path.join(outDir, "_verdict.json"), `${JSON.stringify(v, null, 2)}\n`);
  console.log(`\nshoot-world · Verdikt für ${path.resolve(outDir)}`);
  console.log(`  Modus: ${v.modus === "standbild" ? "STANDBILD (ein Bild, keine Reihe)" : "Reihe"}`);
  console.log(`  Weg: snapshot${pure ? " (pure)" : ""} · Tab: ${visible ? "sichtbar" : "headless"}`);
  console.log(`  Handschlag: ${v.armed ? "bestanden" : v.deadCamera ? "TOTE KAMERA" : "nie gefahren"}`);
  if (v.standbild !== undefined) console.log(`  ${v.standbild.handschlag}`);
  console.log(`  angenommen: ${v.accepted} · abgewiesen: ${v.rejected.length}`);
  for (const r of v.rejected) console.log(`    ✗ ${r.name} — ${r.reason}`);
  // R5-W8 · W7: EINE Quelle fuer beide Zustaende (frame-sink#laufBrauchbar) —
  // vorher stand dieselbe Bedingung hier und im CLI der Senke, zweimal.
  const bad = code !== 0 || !laufBrauchbar(v);
  console.log(bad
    ? `  ⇒ ${v.modus === "standbild" ? "DIESES STANDBILD" : "DIESE REIHE"} IST KEIN BEWEIS.`
    : `  ⇒ ${v.modus === "standbild" ? "Standbild" : "Reihe"} brauchbar.`);
  try { ws.close(); } catch { /* egal */ }
  chrome.kill();
  server.close();
  // R5-W7 · W6 · D-438: `kill()` schickt ein Signal und kehrt zurueck. Wer
  // unmittelbar danach die Last liest, zaehlt seinen eigenen, gerade sterbenden
  // Browser mit. Gewartet wird auf das PROZESS-ENDE.
  const { gewartetMs, restend } = await wartenBisChromeWegIst(chrome, CHROME, profile);
  if (restend > 0) {
    console.warn(`  ⚠ nach ${gewartetMs} ms stehen noch ${restend} eigene Chrome-Prozesse (Profil ${PROFILE_PREFIX}) `
      + "— eine Lastlesung JETZT misst diesen Lauf mit (D-438).");
  } else {
    console.log(`  Eigener Chrome beendet nach ${gewartetMs} ms (D-438).`);
  }
  process.exit(bad ? 1 : 0);
};

try {
  // ── 1 · die Lehrer-Tür ────────────────────────────────────────────────────
  const url = `http://localhost:${port}/play/1/buch?phase=${phase}`;

  // ── 1a · R5-W7 · W6 · D-443 · liefert der Server ueberhaupt DIESES Level? ──
  // Vor dem ersten Bild, nicht danach: eine Bildreihe gegen eine alte Fassung
  // ist keine kleinere Messung, sondern gar keine. Gelesen wird der SERVER
  // (fetch, no-store) — was Chrome danach im eigenen Cache haelt, ist eine
  // andere Frage und die stellt sich erst, wenn diese hier beantwortet ist.
  {
    const fsMod = await import("node:fs");
    const levelAufDerPlatte = JSON.parse(
      fsMod.readFileSync("content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", "utf8"));
    let html = null;
    try {
      const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(30_000) });
      html = r.ok ? await r.text() : null;
      if (!r.ok) console.warn(`  ⚠ D-443-Probe: der Server antwortete mit ${r.status} — Frische nicht geprueft`);
    } catch (e) {
      console.warn(`  ⚠ D-443-Probe: die Seite war nicht abrufbar (${e.message}) — Frische nicht geprueft`);
    }
    if (html !== null) {
      const drift = levelDrift({ level: levelAufDerPlatte, html, phase });
      if (drift !== null) {
        console.error(`\n✗ ${drift}\n`);
        try { ws.close(); } catch { /* egal */ }
        chrome.kill();
        server.close();
        process.exit(1);
      }
      console.log("  D-443: der Server liefert die Zeilen-Landkarte, die auf der Platte liegt.");
    }
  }

  await page("Page.navigate", { url });

  // ── 2 · warten, bis das SPIEL da ist (der Loader hängt gern bei ~96 %) ────
  let ready = false;
  for (let i = 0; i < 160; i++) {
    await sleep(250);
    await evalIn(`(() => { const g = window.__domigoPaint?.game;
      g?.scene?.scenes?.forEach((s) => s.load?.checkLoadQueue?.()); return true; })()`);
    const st = await evalIn(`(() => { const s = window.__domigoPaint?.state?.(); return s ? {tick: s.tick, overlay: s.overlay, phase: s.phase} : null; })()`);
    if (st !== null) { ready = true; console.log(`  Spiel da nach ${((i + 1) * 250) / 1000}s · Phase ${st.phase} · Tick ${st.tick}`); break; }
  }
  if (!ready) await fail(`kein __domigoPaint auf ${url} — läuft der Dev-Server auf ${port}?`);

  // ── 3 · P-65: kennt die laufende Klasse den NEUEN Code? ──────────────────
  const tickType = await evalIn(`typeof window.__domigoPaint.state().tick`);
  if (tickType !== "number") {
    await fail(`Der Server auf ${port} liefert einen state() OHNE tick — das ist ALTER Code`
      + " (fremder Dev-Server? P-65). Eigener Port, eigener Worktree, dann noch einmal.");
  }

  // ── 4 · der Ceremony-Freeze, und warum ein Blick auf `overlay` zu wenig ist
  //
  // Erster Versuch dieses Skripts fragte einmal „ist eine Karte offen?", bekam
  // NEIN (die Auftakt-Karte war noch nicht montiert), steppte 240-mal ins Leere
  // und schoss dann zwei Proben auf Tick 0. Der Handschlag hat es gefangen —
  // aber die Lehre ist allgemeiner: nicht den Zustand fragen, sondern die WELT
  // laufen sehen. Geprüft wird, dass der Tick sich wirklich bewegt.
  const runs = async () => {
    const before = await evalIn(`window.__domigoPaint.state().tick`);
    await evalIn(`(() => { for (let i = 0; i < 5; i++) window.__domigoPaint.step(); return true; })()`);
    return (await evalIn(`window.__domigoPaint.state().tick`)) > before;
  };
  // R5-W4b · W3: die Meldung darf nicht behaupten, was sie nicht geprüft hat.
  // Vorher endete JEDER Fehlschlag hier mit „obwohl keine Karte offen ist" — auch
  // dann, wenn die Schleife 24-mal an einer Karte hängen blieb und die Lauf-Prüfung
  // nie erreichte. Das ist eine Falschaussage über die eigene Ursache, und sie hat
  // eine Sitzung gekostet. Jetzt wird mitgeschrieben, was wirklich passiert ist, und
  // die Karte wird beim NAMEN genannt (`beat()` kennt ihn, `state().overlay` ist nur
  // ein Ja/Nein).
  const karte = async () => evalIn(`(() => { const b = window.__domigoPaint.beat?.(); `
    + `return b ? (b.overlay ?? "—") : "?"; })()`);
  // …und sie darf nicht zu früh aufgeben. 24 Runden sind rund sieben Sekunden; ein
  // FRISCHER kopfloser Browser hat zu dem Zeitpunkt die Szene zwar gebaut (`state()`
  // antwortet, darum meldet der Wächter oben »Spiel da«), lädt aber noch die Blätter —
  // eine Phase trägt bis 26 MB. Der Takt steht dann, ohne dass irgendetwas kaputt ist.
  // Gemessen in dieser Sitzung: mit 24 Runden schlug p1 zweimal fehl, mit 120 lief es.
  // ── R5-W5 · W4 · WELCHE QUELLE SAGT DIE WAHRHEIT ÜBER EINE OFFENE KARTE ──
  // Bisher stand hier an drei Stellen `state().overlay === true`. Das ist
  // `sim.overlayOpen` — die Sicht der SPIELSCHLEIFE darauf, ob sie angehalten
  // ist. Ob eine Karte auf dem SCHIRM liegt, ist eine andere Frage, und
  // PaintGame beantwortet sie mit `beat().overlay` (dem Namen der Karte oder
  // null). Die beiden laufen absichtlich auseinander: an drei Stellen gibt
  // PaintGame die Welt frei, ohne die Karte zu schließen (Kartenkette
  // find → Regel, der Arena-Takt „wie", der Ausgang) — dort läuft die Schleife,
  // und eine Karte liegt trotzdem oben. C3 hat das gemeldet, auf main war es
  // nicht behoben, und A6bs „der Tick bewegt sich nicht" war dieses Werkzeug.
  //
  // Also fragt dieser Lauf ab jetzt das, was er wissen will: liegt eine Karte
  // auf dem Schirm? `beat().overlay !== null`. Der Kartenname kommt gratis mit,
  // weshalb die Fehlermeldung unten die Karte beim Namen nennen kann statt zu
  // behaupten, es liege keine.
  const karteOffen = async () => evalIn(
    `(() => { const b = window.__domigoPaint.beat?.(); return b ? b.overlay !== null : false; })()`,
  );
  let alive = false;
  let runden = 0;
  let kartenRunden = 0;
  let letzteKarte = null;
  for (let i = 0; i < 120; i++) {
    runden = i + 1;
    if (await karteOffen()) {
      kartenRunden += 1;
      letzteKarte = await karte();
      // R5-W8 · W7: ist die KARTE das Motiv (--standbild ohne --toast), wird sie
      // nicht weggelöst — das hieße, den Augenblick zu zerstören, den dieser Lauf
      // fotografieren soll. Ist der TOAST das Motiv, ist sie der Weg dorthin.
      if (plan.karteIstMotiv) break;
      await evalIn(`window.__domigoPaint.solveTask()`);
      await sleep(180);
      continue;
    }
    if (await runs()) { alive = true; break; }
    await sleep(180);
  }
  // R5-W8 · W7 · DIE STEHENDE WELT: fuer eine Reihe ist sie ein Abbruch, fuer
  // ein Standbild ist sie der Auftrag. Der Grund wird in BEIDEN Faellen in
  // Worten festgehalten — im einen als Fehlermeldung, im anderen als Zettel.
  let weltStehtGrund = null;
  if (!alive) {
    const nochOffen = await karteOffen();
    const wer = letzteKarte ?? await karte();
    weltStehtGrund = nochOffen
      ? `eine KARTE haelt die Welt fest: »${wer}« (${kartenRunden} von ${runden} Runden)`
      : `der Tick bewegt sich in ${runden} Runden nicht, und offen ist KEINE Karte`;
    if (!plan.karteIstMotiv) {
      await fail(nochOffen
        ? `die Welt steht still, weil eine KARTE sie festhält: »${wer}« — `
          + `${kartenRunden} von ${runden} Runden hingen daran, und solveTask() bekam sie nicht zu. `
          + "Das ist D-198: ein Kartenfenster friert die Welt ein, und diese Reihe wäre N-mal dasselbe Bild. "
          + "(Ist genau DAS das Motiv, ist --standbild der Modus dafür.)"
        : `die Welt läuft nicht: der Tick bewegt sich in ${runden} Runden nicht, und offen ist keine Karte `
          + "— jede Reihe wäre N-mal dasselbe Bild (Falle 2)");
    }
    console.log(`  --standbild: die Welt steht bereits — ${weltStehtGrund}. `
      + "Der Handschlag entfällt deshalb BEGRÜNDET, und der Zettel des Bildes sagt es.");
  }

  // ── 5 · reduzierte Bewegung ──────────────────────────────────────────────
  if (await evalIn(`window.matchMedia("(prefers-reduced-motion: reduce)").matches`)) {
    await fail("prefers-reduced-motion ist AN — gemessen würde das Standbild, nicht die Bewegung (Falle 3)");
  }

  // ── 7 · der Aufnahmeweg ──────────────────────────────────────────────────
  await evalIn(CLIENT_SRC.replace("__SINK_URL__", `http://localhost:${sinkPort}`));

  const shoot = async (name, extra) => {
    const opts = JSON.stringify({ pure, extra: { via: "snapshot", ...(extra ?? {}) } });
    return evalIn(`window.__frameSink.shoot(${JSON.stringify(name)}, ${opts})`, true);
  };


  // Was das Werkzeug beim Stellungbeziehen SELBST geschlossen hat — gehoert in
  // den Zettel jedes Bildes, nicht nur in die Konsole (D-259-Regel).
  const pressKarten = [];

  // ── 6 · Stellung beziehen ────────────────────────────────────────────────
  // R5-W8 · W7: als eigener Schritt, weil die REIHENFOLGE modusabhängig ist.
  // Gemessen am 22.08. in p1: das Stellungbeziehen auf die Ausgangszelle ist
  // genau das, was die Welt anhält — der Torschluss feuert, und einen Takt
  // später liegt die Tür-Karte oben. Ein Handschlag DANACH wäre nicht mehr zu
  // haben; einer davor schon. Für eine Reihe bleibt die alte Reihenfolge.
  const stellungBeziehen = async () => {
    if (warp !== null) {
      const [c, r] = warp.split(",").map(Number);
      await evalIn(`window.__domigoPaint.warp(${c}, ${r})`);
    }
    // ── DIE press()-WAND (R5-W6b · W5 · S2-Befund) ──────────────────────────
    // `__domigoPaint.press()` bewegt das Kind NICHT, solange eine Karte oben
    // liegt: S2 hat `vx: 0` gemessen, bei Boden unter den Fuessen, und echte
    // Pfeiltasten erreichen Phaser in einem CDP-Ziel dort auch nicht. Das ist
    // eine WAND, keine Messung — und bis heute war sie still: der Lauf schoss
    // seine Reihe, das Kind stand, und wer sich auf `--press` verliess, mass die
    // Stille seiner eigenen Umgehung.
    // Also wird jetzt nachgesehen. Gelesen wird der ZUSTAND (x und vx), nicht die
    // Absicht — und wenn nichts passiert ist, endet der Lauf mit einer Meldung,
    // die die Karte beim Namen nennt, statt mit einer Bildreihe, die eine
    // Bewegung behauptet.
    // BEIDE Achsen, und das ist kein Detail: `--press jump` bewegt das Kind in y,
    // nicht in x. Eine Wand-Pruefung, die nur x liest, wuerde jeden Sprung als
    // »nicht bewegt« melden — eine Falschmeldung, die genau die Sorte Schaden
    // anrichtet, gegen die diese Pruefung gebaut ist.
    // Gelesen wird mehr als die Lage: fuer eine Handlungstaste ist die Antwort
    // der WELT das Erfolgssignal, nicht die Verschiebung des Kindes.
    const lage = async () => evalIn("(() => { const h = window.__domigoPaint; const s = h.state(); "
      + "const b = h.beat ? h.beat() : null; "
      + "return { x: s.x, y: s.y, vx: s.vx, vy: s.vy, overlay: s.overlay === true, "
      + "karte: b ? b.overlay : null, hold: b ? b.hold : null, "
      + "wesen: (s.entities || []).map((e) => e.id + \":\" + (e.state || \"\") + \":\" + (e.redeemed || \"\")).join(\"|\") }; })()");
    const vorherLage = press === null ? null : await lage();
    const druecken = async () => {
      if (press !== null) await evalIn(`window.__domigoPaint.press({ ${press}: true })`);
      await evalIn(`(() => { for (let i = 0; i < ${settle}; i++) window.__domigoPaint.step(); return true; })()`);
    };
    await druecken();
    if (press !== null) {
      const bewegtSich = async () => {
        const jetzt = await lage();
        const u = druckWirkte(press, vorherLage, jetzt);
        return { jetzt, bewegt: u.wirkte, woran: u.woran };
      };
      let { jetzt, bewegt, woran } = await bewegtSich();
      if (bewegt && woran === "Weltantwort") {
        console.log(`  --press ${press}: das Kind steht (das ist bei einer Handlungstaste der Normalfall) — `
          + "gewirkt hat der Druck trotzdem: die WELT hat geantwortet (Karte, Halt oder ein Wesen in einem "
          + "anderen Zustand). Gelesen, nicht angenommen.");
      }
      // ── R5-W8 · W7 · EIN NACHFASSEN, DEKLARIERT ─────────────────────────
      // Die Meldung unten sagte bis heute »Erst die Karte schliessen, dann
      // pressen« — und liess den Aufrufer damit allein. Gemessen am 22.08.: an
      // p4s Kaefig geht bei der Annaeherung die Karte `cagehint` auf, und danach
      // ist ↑ per Bauart wirkungslos; der Torschluss `cageGated` haengt aber
      // genau an diesem ↑. Das Werkzeug faengt das jetzt EINMAL selbst ab.
      //
      // Was es dabei getan hat, steht im Zettel — dieselbe Ehrlichkeit, die
      // `--fight` seit D-259 traegt: eine Aufnahme, die verschweigt, dass das
      // Werkzeug mitgespielt hat, luegt ueber ihre eigene Herkunft.
      if (!bewegt && (await karteOffen())) {
        pressKarten.push(await karte());
        await evalIn(`window.__domigoPaint.solveTask()`);
        await sleep(180);
        await druecken();
        ({ jetzt, bewegt, woran } = await bewegtSich());
        console.log(`  --press ${press}: die Karte »${pressKarten.at(-1)}« lag oben und ist vom Werkzeug `
          + `geschlossen worden; danach ${bewegt ? "hat das Kind sich bewegt" : "steht das Kind weiter"}. `
          + BEIPACKZETTEL);
      }
      if (!bewegt) {
        const wer = await karte();
        const offen = await karteOffen();
        await fail(`--press ${press} hat das Kind NICHT bewegt: x ${vorherLage.x.toFixed(1)} → ${jetzt.x.toFixed(1)}, `
          + `y ${vorherLage.y.toFixed(1)} → ${jetzt.y.toFixed(1)}, vx ${jetzt.vx.toFixed(2)}, vy ${jetzt.vy.toFixed(2)} `
          + `nach ${settle} Schritten${BEWEGUNGSTASTEN.has(press) ? "" : " (Handlungstaste: auch die WELT hat nicht geantwortet)"}`
          + (pressKarten.length === 0 ? ". " : ` und einem Nachfassen (geschlossen: ${pressKarten.join(", ")}). `)
          + (offen
            ? `Die Karte »${wer}« liegt oben — das ist die bekannte Wand (S2, R5-W6): press() erreicht die `
              + "Spielfigur bei offenem Overlay nicht, und echte Pfeiltasten in einem CDP-Ziel auch nicht."
            : "Keine Karte liegt oben — das Kind steht aus einem anderen Grund (Wand, Kante, kein Boden "
              + "unter den Fuessen nach --warp). Eine Reihe waere hier N-mal dasselbe Bild."));
      }
    }
    // …und noch einmal: das Beziehen der Stellung schlägt gern eine Karte auf
    // (Käfig-Hinweis!), und dann steht die Welt wieder.
    //
    // R5-W8 · W7: dieses Nachräumen gehört der REIHE. Ein Standbild will genau
    // den Augenblick, den es hier wegräumen würde — also läuft der ganze Block
    // dort nicht, und der Grund steht im Zettel statt in einer Fehlermeldung.
    if (plan.nachraeumen) {
      for (let i = 0; i < 8; i++) {
        if (!(await karteOffen())) break;
        await evalIn(`window.__domigoPaint.solveTask()`);
        await sleep(180);
      }
      if (!(await runs())) {
        // W4: „(Karte offen?)" war eine Vermutung in einer Fehlermeldung — dieselbe
        // Klasse, die W3 eine Zeile weiter oben ausgeräumt hat. Jetzt wird gefragt,
        // und zwar vollständig: eine Karte ist nur EINER von zwei Gründen, aus denen
        // die Welt steht. Der andere ist der HALT (`beat().hold`), mit dem die Arena
        // den Kampf-Takt festhält — genau die Stelle, an der D-198/D-259 sitzt. Eine
        // Meldung, die nur nach der Karte fragt, schickt den Leser in die Irre.
        const zettel = await evalIn(`(() => JSON.stringify(window.__domigoPaint.beat?.() ?? null))()`);
        // R5-W8 · W7: die ZWEITE Quelle dazu. `beat().overlay` ist die Karte auf dem
        // SCHIRM, `state().overlay` ist `sim.overlayOpen` — die Sicht der Spielschleife
        // darauf, ob sie angehalten ist. Die beiden laufen auseinander, und zwar in
        // BEIDE Richtungen: H5 §5 hat drei Anläufe an genau dem Fall verloren, in dem
        // `state().overlay === true` bei `beat().overlay === null` steht. Eine Meldung,
        // die dann »es liegt KEINE Karte oben« sagt, schickt den Leser in die Irre.
        const simHaelt = await evalIn(`window.__domigoPaint.state().overlay === true`);
        const wer = await karte();
        await fail(await karteOffen()
          ? `nach dem Stellungsbeziehen hält die Karte »${wer}« die Welt fest, und solveTask() `
            + `bekam sie in acht Runden nicht zu — Reihe abgebrochen (D-198/D-259: der Kampf braucht --fight). `
            + `Takt: ${zettel}`
          : "nach dem Stellungsbeziehen läuft die Welt nicht mehr, und auf dem SCHIRM liegt keine Karte "
            + `(beat().overlay === null). Takt: ${zettel} · state().overlay = ${simHaelt}. `
            + (simHaelt
              ? "⇒ Die SPIELSCHLEIFE hält sich trotzdem für angehalten (sim.overlayOpen === true). Das ist "
                + "der Zeremonien-Halt ohne Karte auf dem Schirm — `Sim.step` kehrt sofort zurück, der Tick "
                + "steht, und keine Karte ist zu schließen. Häufigster Auslöser: das Kind steht in einem "
                + "Auslöser (Tür, Käfig), dessen Zeremonie gerade läuft. Rezept: eine Zelle daneben warpen."
              : "⇒ Auch die Spielschleife hält sich für laufend (sim.overlayOpen === false) — der Tick steht "
                + "aus einem dritten Grund. Steht im Takt `hold: true`, hält die Arena den Kampf fest "
                + "(D-198/D-259, nicht dein Code)."));
      }
    }

  };

  const handschlag = async () => {
    // ── 8 · DER HANDSCHLAG, bevor irgendein Bild geschrieben wird ────────────
    // Zuerst die Uhr übernehmen: ab hier rückt die Welt nur noch, wenn WIR es
    // sagen (siehe `freeze` im Client — sonst läuft Phasers Schleife zwischen den
    // Fernsteuer-Aufrufen weiter und die Kadenz der Reihe ist erfunden).
    await evalIn(`window.__frameSink.freeze()`);
    // R5-W8 · W7: der Handschlag wird gefahren, WANN IMMER er zu haben ist —
    // auch im Standbild-Modus. Er verlangt zwei Aufnahmen mit verschiedenen
    // Prüfsummen; steht die Welt schon, kann eine stehende Welt das per Bauart
    // nicht liefern, und nur DANN entfällt er (mit Grund, siehe oben).
    const handschlagFaehrt = standbildPlan({ standbild, weltLaeuft: weltStehtGrund === null, shotsWunsch }).handschlag;
    if (handschlagFaehrt) {
      await shoot("__probe_a", { probe: "a" });
      await evalIn(`window.__frameSink.drive(1)`);
      try {
        await shoot("__probe_b", { probe: "b" });
      } catch (e) {
        await fail(`Handschlag nicht bestanden (Weg »snapshot«):\n${e.message}`);
      }
      if (!sink.verdict().armed) await fail(`Handschlag nicht bestanden (Weg »snapshot«)`);
      console.log(`  Handschlag bestanden (Weg »snapshot«) — die Kamera lebt.`);
    } else {
      console.log("  Handschlag ENTFÄLLT (deklariert, --standbild): " + weltStehtGrund
        + ". Das Bild trägt den Vermerk und KEINEN Kamerabeweis (P-66) — es ist ungeprüft dasselbe, "
        + "was die Kamera zuletzt gemalt hat.");
    }

  };

  // ── die Reihenfolge, und warum sie sich unterscheidet ────────────────────
  if (standbild) {
    // Erst die Kamera beweisen, SOLANGE die Welt noch läuft; dann Stellung
    // beziehen (das hält sie an); dann die Uhr wieder übernehmen.
    await handschlag();
    await stellungBeziehen();
    await evalIn(`window.__frameSink.freeze()`);
  } else {
    await stellungBeziehen();
    await handschlag();
  }
  // ── 8b · DEN TAKT FIXIEREN (R5-W6b · W5 · L1) ────────────────────────────
  // Ab hier steht die Uhr (`freeze`), und die Welt rueckt nur noch, wenn wir es
  // sagen — genau deshalb ist DIES die Stelle, an der ein gewuenschter Takt
  // erreichbar ist: die zwei Probeaufnahmen haben ihre Ticks schon gekostet,
  // die erste ECHTE Aufnahme kommt gleich.
  if (tickWunsch !== null) {
    let ist = await evalIn(`window.__domigoPaint.state().tick`);
    if (ist > tickWunsch) {
      await fail(`--tick ${tickWunsch} liegt hinter dem Lauf: die Welt steht schon auf Tick ${ist}. `
        + "Zurueckspulen kann niemand — mit kleinerem --settle noch einmal, oder einen Takt weiter vorne waehlen. "
        + "(Still das naechstbeste Bild zu nehmen waere aus der Fixierung eine Behauptung gemacht.)");
    }
    for (let versuch = 0; versuch < 8 && ist < tickWunsch; versuch++) {
      await evalIn(`window.__frameSink.drive(${tickWunsch - ist})`);
      ist = await evalIn(`window.__domigoPaint.state().tick`);
    }
    if (ist !== tickWunsch) {
      await fail(`--tick ${tickWunsch} nicht getroffen: nach acht Anlaeufen steht die Welt auf Tick ${ist}. `
        + "Der Antrieb rueckt nicht so, wie dieser Lauf annimmt — bevor irgendein Bild geschrieben wird, "
        + "ist das ein Werkzeug-Fehler und keine Reihe.");
    }
    console.log(`  Takt fixiert: die erste Aufnahme steht auf Tick ${ist} (gelesen, nicht gewartet).`);
  }

  // ── 8c · R5-W8 · W7 · AUF DEN TOAST WARTEN, INDEM MAN IHN LIEST ─────────
  // Ein Standbild »vom Torschluss« ist nur dann eins, wenn die Sprechblase beim
  // Ausloesen wirklich auf der Buehne stand. Gewartet wird deshalb auf den
  // ZUSTAND, nicht auf die Uhr (dieselbe Regel wie bei --tick): nach jedem
  // Einzelschritt wird die Anzeigeliste GELESEN. Eine Blase ist ein Container
  // mit einem Text darin (PaintScene#toast); halb aufgegangen zaehlt sie nicht,
  // sonst steht auf dem Bild ein Schleier statt eines Satzes.
  let toastGelesen = null;
  if (toastWunsch) {
    const blasen = async () => evalIn(`(() => {
      const g = window.__domigoPaint?.game;
      const sc = g?.scene?.getScene?.("paint") ?? g?.scene?.scenes?.[0] ?? null;
      if (sc === null) return [];
      const out = [];
      const sicht = sc.cameras?.main?.worldView ?? null;
      for (const o of sc.children.list) {
        if (o.type !== "Container") continue;
        for (const k of (o.list ?? [])) {
          if (k.type === "Text" && typeof k.text === "string" && k.text.trim() !== "") {
            // Die Blase ist auf das Kind zentriert; ihre Breite ist die des Textes
            // plus des Randes, den PaintScene#toast zeichnet (13 px). Gemessen
            // statt geschaetzt, damit ein abgeschnittener Satz eine ZAHL hat.
            const halb = (k.width + 13) / 2;
            out.push({
              text: k.text, alpha: o.alpha, depth: o.depth, x: o.x, y: o.y,
              links: o.x - halb, rechts: o.x + halb,
              sicht: sicht === null ? null : { links: sicht.x, rechts: sicht.x + sicht.width },
            });
          }
        }
      }
      return out;
    })()`);
    let getrieben = 0;
    for (let i = 0; i < TOAST_MAX_TAKTE; i++) {
      const gefunden = (await blasen()).filter((b) => b.alpha >= TOAST_MIN_ALPHA);
      if (gefunden.length > 0) { toastGelesen = gefunden; break; }
      await evalIn(`window.__frameSink.drive(1)`);
      getrieben = i + 1;
    }
    if (toastGelesen === null) {
      await fail(`--toast: in ${TOAST_MAX_TAKTE} Einzelschritten stand keine Sprechblase mit voller `
        + `Deckung auf der Bühne (getrieben: ${getrieben} Takte, Takt jetzt `
        + `${await evalIn(`window.__domigoPaint.state().tick`)}). Ein beliebiges Bild »Toast« zu nennen `
        + "wäre die Lüge, gegen die dieser Modus gebaut ist. Rezept: mit --warp auf die Ausgangszelle "
        + "der Phase stellen (der Torschluss feuert in `checkExit`), --settle klein halten.");
    }
    console.log(`  Toast gelesen (${toastGelesen.length}): `
      + toastGelesen.map((t) => `»${t.text}«`).join(" · ")
      + ` — nach ${getrieben} Einzelschritten, Takt ${await evalIn(`window.__domigoPaint.state().tick`)}`);
    // ── R5-W8 · W7 · PASST DER SATZ INS BILD? ────────────────────────────
    // Beim ersten Einsatz dieses Modus (22.08.) stand auf allen drei Bildern
    // ein HALBER Satz: die Blase ist auf das Kind zentriert, und der Torschluss
    // feuert per Bauart dort, wo das Kind am Ausgang steht — also am Rand der
    // Kamerasicht. Ein Instrument, das das nicht mitmisst, liefert Bilder, auf
    // denen ein abgeschnittener Satz wie eine Bildwahl aussieht.
    for (const t of toastGelesen) {
      if (t.sicht === null) continue;
      const ueber = Math.max(0, t.rechts - t.sicht.rechts);
      const unter = Math.max(0, t.sicht.links - t.links);
      if (ueber > 0 || unter > 0) {
        console.log(`  ⚠ die Blase »${t.text}« ragt aus der Kamerasicht: `
          + `${ueber > 0 ? `rechts ${ueber.toFixed(0)} px` : ""}${ueber > 0 && unter > 0 ? " · " : ""}`
          + `${unter > 0 ? `links ${unter.toFixed(0)} px` : ""} `
          + `(Blase ${t.links.toFixed(0)}…${t.rechts.toFixed(0)}, Sicht ${t.sicht.links.toFixed(0)}…${t.sicht.rechts.toFixed(0)}). `
          + "Auf dem Bild steht dann ein halber Satz — und ein Kind sieht denselben.");
      }
    }
  }

  // ── 9 · die Reihe ────────────────────────────────────────────────────────
  const zettelGemeinsam = () => ({
    // R5-W8 · W7: was der Lauf GELESEN hat, nicht was er vermutet.
    ...(standbild ? { standbild: true, weltStand: weltStehtGrund } : {}),
    ...(pressKarten.length === 0
      ? {}
      : { pressKarten: [...new Set(pressKarten)], beipackzettel: BEIPACKZETTEL }),
    ...(toastGelesen === null ? {} : { toast: toastGelesen }),
  });

  if (fight) {
    // ── 9a · DER KAMPF, AUF S4s TREIBER (R209d, zu D-558) ──────────────────
    // Kein eigener Kartenlöser mehr und keine eigene Takt-Schleife: beides ist
    // dreimal gescheitert (H5 §5). Der Treiber gehört dem Spiel, dieses Skript
    // reicht ihm das Band und fotografiert seine Halte.
    const fightDa = await evalIn(`typeof window.__domigoPaint.fight?.advance === "function"`);
    if (!fightDa) {
      await fail("--fight braucht den Kampf-Treiber des Spiels (`__domigoPaint.fight`, S4/R209d, PR #351), "
        + "und dieser Server hat ihn nicht. Er ist DEV-ONLY und liegt bewusst nicht im Produktionsbündel — "
        + "gegen einen Produktionsbau ist --fight also per Bauart nicht zu haben. "
        + "Der alte Weg (eigene Takt-Schleife + eigener Kartenlöser) ist WEG und kommt nicht zurück: "
        + "er ist an der Boss-Karte hinter ihrem echten Zeitgeber dreimal gescheitert (D-558).");
    }

    const fsMod = await import("node:fs");
    let pads = null;
    try {
      const band = JSON.parse(fsMod.readFileSync(bandDatei, "utf8"));
      pads = band?.phases?.[phase]?.pads ?? null;
    } catch (e) {
      await fail(`--fight: das aufgezeichnete Band ${bandDatei} war nicht lesbar (${e.message}).`);
    }
    if (!Array.isArray(pads) || pads.length === 0) {
      await fail(`--fight: ${bandDatei} führt für die Phase »${phase}« kein Band (\`phases.${phase}.pads\`). `
        + "Ein Kampf ohne Band wäre eine erfundene Eingabe — genau das, was S4s Treiber ausschließt.");
    }
    const takte = await evalIn(`window.__domigoPaint.fight.load(${JSON.stringify(pads)})`);
    console.log(`  Kampf-Treiber: Band ${bandDatei} · Phase ${phase} · ${pads.length} Abschnitte = ${takte} Takte`);
    console.log(kampfTastetAb
      ? `  …und zusätzlich abgetastet, höchstens alle ${every} Takte (Wisch ${FIGHT_BEATS.WIPE_TICKS} · `
        + `Knoten-Schlag ${FIGHT_BEATS.KNOT_BEAT_TICKS} — D-171)`
      : "  …von Wisch zu Wisch: der Auslöser ist das Ereignis, nicht eine Rate (--every tastet zusätzlich ab).");

    const halte = [];
    let bild = 0;
    let halt = null;
    /** die Lage AM Stillstand, vor dem Auftauen genommen (D-702). */
    let stillDiag = null;
    // ── DER ANFANGSZUSTAND, bevor die erste Schicht faellt ─────────────────
    // Ohne ihn zeigt die Reihe nur die Halte NACH einem Wisch — und ein
    // Vorher/Nachher ohne Vorher ist keins. Der Lesestand kommt aus `read()`,
    // ohne einen Takt zu fahren.
    {
      const anfang = await evalIn(`window.__domigoPaint.fight.read()`);
      bild = 1;
      await shoot(`${stem}_${String(1).padStart(3, "0")}`, {
        serie: stem, nr: 1, tickBefore: anfang?.tick ?? -1,
        ...zettelGemeinsam(),
        ...fightSidecar(0),
        kampf: {
          grund: "anfang", gespielt: 0, takt: anfang?.tick ?? -1,
          schichten: anfang?.knots ?? null, schichtenGesamt: anfang?.knotsTotal ?? null,
          wische: [], karten: 0, fertig: false,
        },
      });
      console.log(`  Halt 0: anfang · Takt ${anfang?.tick ?? "—"} · Schichten `
        + `${anfang?.knots ?? "—"}/${anfang?.knotsTotal ?? "—"} (der Zustand VOR dem ersten Wisch)`);
    }
    for (let i = 2; i <= shots; i++) {
      // `advance` ist AWAIT-BAR, und das ist der ganze Unterschied zu den drei
      // gescheiterten Anläufen: die Boss-Karte kommt hinter einem echten
      // Zeitgeber, und eine synchrone Schleife lässt ihn nie feuern.
      halt = await evalIn(
        `window.__domigoPaint.fight.advance(${kampfTastetAb ? every : ""})`, true,
      );
      halte.push(halt);
      bild = i;
      await shoot(`${stem}_${String(i).padStart(3, "0")}`, {
        serie: stem, nr: i, tickBefore: halt.tick,
        ...zettelGemeinsam(),
        // Was der TREIBER beantwortet hat, steht in seinem eigenen Halt — nicht
        // in einer Liste, die dieses Skript fuehrt. Es fuehrt keine mehr.
        ...fightSidecar(halte.reduce((a, h) => a + h.cards, 0)),
        // …und der Halt selbst, gelesen: der Grund, die Schichtzahl, die Wische.
        kampf: {
          grund: halt.reason, gespielt: halt.played, takt: halt.tick,
          schichten: halt.knots, schichtenGesamt: halt.knotsTotal,
          wische: halt.wipes, karten: halt.cards, fertig: halt.done,
          // ★ T5 · D-702: die Wanduhr-Zahlen des Treibers. Ein Halt, der von
          //   der Uhr abhaengt, muss seine Uhr mitliefern.
          wartete: halt.waitedMs ?? null, geduld: halt.patienceMs ?? null,
          last: os.loadavg()[0],
        },
      });
      console.log(`  Halt ${i}: ${halt.reason} · Takt ${halt.tick} · Schichten ${halt.knots}/${halt.knotsTotal}`
        + `${halt.wipes.length === 0 ? "" : ` · gewischt auf ${halt.wipes.join(", ")}`}`
        + `${halt.cards === 0 ? "" : ` · ${halt.cards} Karte(n) beantwortet`}`
        + `${!halt.waitedMs ? "" : ` · laengste Wartezeit auf eine Karte ${halt.waitedMs} ms von ${halt.patienceMs} ms`}`);
      if (halt.done) break;
      if (halt.reason === "stillstand") {
        // ★ R5-T5 · D-702: die Diagnose wird HIER genommen, vor `release()` —
        //   danach läuft die Welt wieder an und die Lage ist weg. Dieselben zwei
        //   Quellen wie im Reihen-Modus: `beat()` ist die Karte auf dem SCHIRM,
        //   `state().overlay` ist die Sicht der Spielschleife auf sich selbst.
        //   Sie laufen auseinander, und genau dort sitzt der Zeremonien-Halt.
        stillDiag = {
          zettel: await evalIn(`(() => JSON.stringify(window.__domigoPaint.beat?.() ?? null))()`),
          simHaelt: await evalIn(`window.__domigoPaint.state().overlay === true`),
          karte: await karte(),
        };
        break;
      }
    }
    await evalIn(`window.__domigoPaint.fight.release()`);

    // ── die Bilanz, aus dem GELESENEN, nicht aus der Absicht ───────────────
    const wische = halte.flatMap((h) => h.wipes);
    const karten = halte.reduce((a, h) => a + h.cards, 0);
    console.log(`  ${bild} Aufnahme(n) · ${path.resolve(outDir)}`);
    console.log(wische.length === 0
      ? "  ⚠ KEINE Schicht ist in diesem Lauf gefallen — die Lebensanzeige ist hier NICHT fallen gesehen worden."
      : `  Schichten gefallen auf: ${wische.join(" → ")} (das ist die Lebensanzeige, fallend gesehen)`);
    if (karten > 0) console.log(`  ⚠ BEIPACKZETTEL: ${BEIPACKZETTEL}. Beantwortete Karten: ${karten}`);
    if (halt !== null && halt.reason === "stillstand") {
      // ── R5-T5 · D-702 · EIN STILLSTAND MUSS SAGEN, WORAN ER LIEGT ─────────
      //
      // WAS ES GEKOSTET HAT. T4s zwei Kontrollläufe auf dem unveränderten
      // Basis-Commit bekamen hier NUR den Satz darüber — keine Zahl, keine
      // Unterscheidung. Daraus wurde die Prämisse einer ganzen Bahn: »der
      // Kampf-Treiber kommt auf main nicht mehr durch, der Stand selbst ist
      // kaputt« (D-700). T5 hat denselben Befehl auf demselben Commit gefahren:
      // 2/2 sauber bis 0/3, und auf origin/main noch einmal 4/4.
      //
      // ★ UND DAS BITTERSTE: DIESES SKRIPT KONNTE DIE DIAGNOSE SCHON — nur auf
      //   dem anderen Weg. Der Reihen-Modus liest bei genau derselben Lage
      //   `beat()` und `state().overlay` und nennt den Zeremonien-Halt beim
      //   Namen (siehe `nachraeumen` oben, W4/W7). Der Kampf-Modus tat es nicht.
      //   Ein Werkzeug, das seine eigene Diagnose auf dem einen Pfad kennt und
      //   auf dem anderen schweigt, produziert Befunde über das SPIEL, die in
      //   Wahrheit Befunde über die MESSUNG sind.
      const last = os.loadavg()[0];
      console.log("  ⚠ Der Treiber meldet einen benannten STILLSTAND — er hängt nicht, er sagt es. "
        + "Das ist die Lage aus D-558, diesmal mit Namen statt mit Schweigen.");
      console.log(`  ⚠ Gewartet ${halt.waitedMs} ms von ${halt.patienceMs} ms Geduld (WANDUHR!) · `
        + `Maschinen-Last ${last.toFixed(2)}.`);
      if (stillDiag !== null) {
        console.log(`     Takt: ${stillDiag.zettel} · state().overlay = ${stillDiag.simHaelt} · `
          + `Karte auf dem Schirm: ${stillDiag.karte ?? "keine"}`);
        console.log(stillDiag.simHaelt
          ? "     ⇒ ZEREMONIEN-HALT: die Spielschleife hält sich für angehalten (sim.overlayOpen === true), "
            + "aber es liegt keine Karte auf dem Schirm. `Sim.step` kehrt sofort zurück, der Tick steht, "
            + "und es ist nichts zu schließen. Häufigster Auslöser: das Kind steht in einem Auslöser "
            + "(Tür, Käfig, Arena-Ansage), dessen Zeremonie läuft. Rezept: eine Zelle daneben warpen (--warp)."
          : "     ⇒ Die Spielschleife hält sich für LAUFEND (sim.overlayOpen === false) — dann steht der "
            + "Tick aus einem dritten Grund. Steht im Takt `hold: true`, hält die Arena den Kampf fest "
            + "(D-198/D-259, nicht dein Code).");
      }
      console.log("     ⚠ Was dieser Lauf NICHT entscheiden kann: ob die Welt wirklich eine Karte schuldet, "
        + "die nie kommt (Befund über das SPIEL), oder ob der Schreib-Beat nur langsamer war als die Geduld");
      console.log(`     (belastete Maschine, gedrosselter Zeitgeber im verborgenen Tab) — ein Befund über die MESSUNG.`);
      console.log(`     Zur Einordnung: ein gesunder Lauf dieser Phase wartet 605–639 ms je Karte (T5, gemessen).`);
      console.log("     Ein Bericht, der das eine behauptet, ohne das andere ausgeschlossen zu haben, ist "
        + "eine Behauptung — genau so ist D-700 entstanden.");
    }
  } else {
    for (let i = 1; i <= shots; i++) {
      const tick = await evalIn(`window.__domigoPaint.state().tick`);
      await shoot(`${stem}_${String(i).padStart(3, "0")}`, {
        serie: stem, nr: i, tickBefore: tick,
        ...zettelGemeinsam(),
      });
      if (i < shots) await evalIn(`window.__frameSink.drive(${every})`);
    }
    console.log(`  ${shots} Aufnahmen · alle ${every} Ticks`
      + (tickWunsch === null ? "" : ` · erste Aufnahme auf Tick ${tickWunsch} fixiert`)
      + ` · ${path.resolve(outDir)}`);
  }
  await bail(0);
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  await bail(1);
}
