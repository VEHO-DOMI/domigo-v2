#!/usr/bin/env node --experimental-strip-types
/**
 * L3-M-a · DIE TAUWERK-SONDE FÜR ch03 — die Ring-Kette und die steigende Bilge,
 * gemessen an der echten `Sim`.
 *
 * WARUM SIE EXISTIERT. Das Erreichbarkeits-Modell (`level.ts#REACH_ENVELOPE`)
 * verspricht ABSICHTLICH weniger, als die Engine trägt — die Datei sagt es
 * selbst: „every constant here must be <= what the real engine can do … The
 * PROOF of true reachability is the tape, never this model." Jede Zahl der
 * Ring-Kette (Seillänge, Loslass-Lift, Ring-Abstand, Sperrdauer) muss deshalb
 * aus einem Lauf der echten Simulation kommen, nicht aus einer Rechnung. Das
 * Boot-Blatt nennt `ropePx 48 · releaseLiftPx 4 · regrabLockTicks 20`
 * ausdrücklich als SCHÄTZUNG des Architekten; das Codex-Physik-Labor
 * (2026-09-05) schlägt `48 / 32 / 12` und Ring-Abstand `dx 76 px, dy -32 px`
 * vor. Beides ist Vorschlag. Diese Datei ist die Messung.
 *
 * WAS SIE MISST — UND WARUM ALS DIFFERENZ. Eine Messung AN einem Verb ist nur
 * dann eine Messung DES Verbs, wenn sie gegen den Zustand OHNE das Verb läuft
 * (die Falle, die die ch02-Hangel-Sonde einmal bezahlt hat: sie hätte dem
 * Hangeln vier Zeilen gutgeschrieben, die der Sprung allein schafft). Jede
 * Ketten-Zeile läuft deshalb gegen die EICH-ZEILE mit dem ausgelieferten
 * 96-px-Seil und ohne Sperre — der heutige Motor, gleiche Geometrie.
 *
 * ⚠ SIE IST KEIN CI-TOR. `scripts/check-ci-gates.mjs` liest ausschliesslich
 * `scripts/check-*.mjs` im WURZEL-Ordner (`readdirSync`, nicht rekursiv). Eine
 * Datei unter `scripts/paint-probes/` ist für das Meta-Tor unsichtbar und
 * braucht weder eine `ci.yml`-Zeile noch eine Deklaration. `ci.yml` bleibt
 * unberührt.
 *
 * ⚠ NICHT ZU VERWECHSELN mit `scripts/paint-pilots/ch03.pilots.mjs` — das sind
 * die Piloten-Makros der G1-Bahn für das Beweisband. Piloten fahren das
 * AUSGELIEFERTE Level, Sonden messen den MOTOR an synthetischen Räumen.
 *
 *   node --experimental-strip-types scripts/paint-probes/ch03.probe.mjs
 */
import { Sim } from "../../packages/game-paint/src/sim.ts";
import { IDLE_PAD } from "../../packages/game-paint/src/player.ts";
import { PAINT, SUBS, TILE, BODY_H } from "../../packages/game-paint/src/paint.ts";
import { swingPos } from "../../packages/game-paint/src/swing.ts";

const SWING_BODY_PX = 22; // swing.ts: die Fuesse haengen so weit unter den Haenden

const px = (subs) => subs / SUBS;
const pad = (over) => ({ ...IDLE_PAD, ...over });
const r2 = (n) => Math.round(n * 100) / 100;

// ── Die synthetische Takelage ────────────────────────────────────────────────
// Decke oben, Tintensee unten (ein Fehlgriff ist ein PLATSCH, nicht nur „daneben"),
// eine Startplatte unter dem ersten Ring. Ringe in einer Reihe mit Abstand
// `dCols` Spalten und Höhenversatz `dRows` Zeilen je Glied.
const HOEHE = 26;
const RING_R = 8; // Glyphzeile des ersten Rings
const START_C = 6; // Spalte des ersten Rings

const takelage = ({ ringe, dCols, dRows }) => {
  const breite = START_C + Math.abs(dCols) * (ringe - 1) + 12;
  const rows = [];
  for (let r = 0; r < HOEHE; r++) {
    let z = "";
    for (let c = 0; c < breite; c++) {
      if (r === 0 || r === HOEHE - 1) z += "#";
      else if (r >= HOEHE - 4) z += "w";
      else z += ".";
    }
    rows.push(z);
  }
  const plattR = RING_R + 5;
  const platt = rows[plattR].split("");
  for (let c = START_C - 2; c <= START_C + 2; c++) platt[c] = "#";
  rows[plattR] = platt.join("");
  const st = rows[plattR - 1].split(""); st[START_C] = "S"; rows[plattR - 1] = st.join("");

  const anker = [];
  for (let i = 0; i < ringe; i++) {
    const c = START_C + i * dCols;
    const r = RING_R + i * dRows;
    const z = rows[r].split(""); z[c] = "o"; rows[r] = z.join("");
    anker.push({ i, c, r, x: (c * TILE + TILE / 2) * SUBS, y: (r * TILE + TILE / 2) * SUBS });
  }
  const ex = rows[plattR - 1].split(""); ex[breite - 3] = "X"; rows[plattR - 1] = ex.join("");
  return { rows, anker };
};

const level = (rows, swing) => ({
  schema: "paintLevel@1", id: "g1-probe-ch03", chapter: "ch03", draft: true, name: "Sonde",
  goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x",
  abilities: ["jump", "punch", "swing"],
  phases: [{
    id: "p1", nameDe: "Sonde", surface: "normal", plates: {}, rows,
    entities: [], links: [], exit: { to: "done" }, ...(swing ? { swing } : {}),
  }],
});

const neueSim = (rows, swing) => new Sim({
  level: level(rows, swing), phaseId: "p1",
  grantedAbilities: () => ["jump", "punch", "swing"], freedCageIds: () => [],
});

/**
 * EIN KETTENLAUF — und was er WIRKLICH misst.
 *
 * Der erste Entwurf dieser Sonde fragte „wie viele Ringe fängt das Kind?" und
 * bekam bei 96 px und sechs Spalten Abstand 3 von 3. Die Zahl war richtig und
 * die FRAGE falsch: bei 96 px trägt der Pendelbogen die Hände am Scheitel
 * selbst 94 px weit (96·sin 78,75°), und sechs Spalten SIND 96 px — das Kind
 * greift den nächsten Ring, ohne je geflogen zu sein. Es ist kein Ketten-
 * Schwung, es ist ein Pendel, das zufällig am Nachbarn endet.
 *
 * Gemessen wird deshalb der FLUG: die Strecke zwischen dem Loslassen und dem
 * nächsten Griff. `flug=0` heißt „am Scheitel weitergereicht", und nur eine
 * Zeile mit echtem Flug ist eine Kette. Dazu der SCHNAPPER: `attachSwing`
 * setzt die Figur auf einen FESTEN Eintrittswinkel (210 bzw. 302 von 512), also
 * auf den Bogenpunkt — nicht dorthin, wo sie den Ring berührt hat. Der Versatz
 * wird einen Tick NACH dem Griff sichtbar (der Griff-Tick kehrt zurück, bevor
 * `stepSwing` die Figur bewegt), und genau dort misst die Sonde ihn.
 */
const kette = ({ ringe, dCols, dRows, swing, loslassAb = 368, maxTicks = 1500 }) => {
  const { rows, anker } = takelage({ ringe, dCols, dRows });
  const sim = neueSim(rows, swing);
  const rechts = dCols >= 0;

  let prevKey = null;
  let prevX = px(sim.player.x);
  let griffX = null, griffTick = null; // Position/Tick des letzten Griffs
  let losX = null, losY = null, losTick = null; // Position/Tick des letzten Loslassens
  const fluege = []; // px je Flug (Loslassen -> Griff)
  const flugTicks = [];
  const schnapper = [];
  const schnapperAlt = [];
  const schnapperFest = [];
  const griffLaenge = [];
  let weitePx = 0, liftPx = 0, platsch = false;
  const idxs = [];

  for (let t = 0; t < maxTicks; t++) {
    const p = sim.player;
    let tasten;
    if (p.swing) {
      const w = p.swing.angle;
      const reif = rechts ? w >= loslassAb : w <= 512 - loslassAb;
      tasten = reif ? { jump: true, right: rechts, left: !rechts } : {};
    } else if (idxs.length === 0) {
      tasten = { jump: true }; // Anlauf: senkrecht zum ersten Ring
    } else {
      tasten = { right: rechts, left: !rechts }; // Flug: Richtung halten
    }
    sim.step(pad(tasten));
    const q = sim.player;
    const key = q.swing ? `${q.swing.anchorX},${q.swing.anchorY}` : null;

    if (key !== null && key !== prevKey) {
      const idx = anker.findIndex((g) => g.x === q.swing.anchorX && g.y === q.swing.anchorY);
      idxs.push(idx);
      griffX = px(q.x); griffTick = t;
      // DER REINE SPRUNG: wohin der Pendelbogen die Figur setzt, gegen die
      // Stelle, an der sie den Ring gefasst hat — ohne einen einzigen Tick
      // dazwischen. Die erste Fassung dieser Sonde mass stattdessen „Bewegung
      // im Tick NACH dem Griff" und mischte damit die legitime Pendel-
      // Geschwindigkeit hinein (am Bogenboden 5 px/Tick, am Scheitel 1) — sie
      // hat dieselbe Eintritts-Regel dadurch einmal als besser und einmal als
      // schlechter gemeldet.
      const bogen = swingPos(q.swing);
      schnapper.push(Math.hypot(px(bogen.xSubs) - px(q.x), px(bogen.ySubs) - px(q.y)));
      // …und derselbe Sprung unter der ANDEREN Eintritts-Regel (Winkel aus dem
      // tatsaechlichen Fangpunkt statt fest 210/302). Sie wird HIER gerechnet
      // und nicht im Motor gebaut: die Messung sagt, dass sie nichts kauft, und
      // ein Motor-Zweig, den niemand benutzt, waere teurer als diese Zeile.
      // …und derselbe Sprung unter BEIDEN Eintritts-Regeln, aus demselben Lauf
      // gerechnet: `bogen` ist, was der Motor tatsaechlich tut, `bFest` der feste
      // Bogenwinkel 210/302, `bFang` der Winkel aus dem echten Fangpunkt. So
      // bleibt der Vergleich kontrolliert, egal welche Regel der Motor fuehrt.
      const wFest = q.x <= q.swing.anchorX ? 210 : 302;
      const bFest = swingPos({ ...q.swing, angle: wFest });
      schnapperFest.push(Math.hypot(px(bFest.xSubs) - px(q.x), px(bFest.ySubs) - px(q.y)));
      const tF = Math.atan2(q.x - q.swing.anchorX, q.y - SWING_BODY_PX * SUBS - q.swing.anchorY);
      const wF = Math.min(384, Math.max(128, Math.round(256 + (tF / (Math.PI * 2)) * 512)));
      const bFang = swingPos({ ...q.swing, angle: wF });
      schnapperAlt.push(Math.hypot(px(bFang.xSubs) - px(q.x), px(bFang.ySubs) - px(q.y)));
      if (losX !== null) { fluege.push(Math.abs(griffX - losX)); flugTicks.push(t - losTick); }
    }
    if (key === null && prevKey !== null) {
      losX = px(q.x); losY = px(q.y); losTick = t;
      if (griffTick !== null) griffLaenge.push(t - griffTick);
    }
    if (losX !== null && key === null) {
      weitePx = Math.max(weitePx, Math.abs(px(q.x) - losX));
      liftPx = Math.max(liftPx, losY - px(q.y));
    }
    if (q.grounded && idxs.length > 0) break; // die Kette ist gerissen (Boden)
    if (px(q.y) / TILE >= HOEHE - 4 && idxs.length > 0) { platsch = true; break; }
    prevKey = key; prevX = px(q.x);
  }
  const mittel = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  return {
    ringe, dCols, dRows,
    gefangen: new Set(idxs.filter((i) => i >= 0)).size,
    griffe: idxs.length,
    flugPx: mittel(fluege), flugTicks: mittel(flugTicks),
    echteFluege: fluege.filter((f) => f >= 8).length,
    weiteSpalten: r2(weitePx / TILE), liftZeilen: r2(liftPx / TILE),
    ticksJeGriff: mittel(griffLaenge),
    schnapperPx: schnapper.length ? Math.round(Math.max(...schnapper)) : 0,
    schnapperAltPx: schnapperAlt.length ? Math.round(Math.max(...schnapperAlt)) : 0,
    schnapperFestPx: schnapperFest.length ? Math.round(Math.max(...schnapperFest)) : 0,
    platsch, reihenfolge: idxs.join(">"),
  };
};

const zeile = (name, r) =>
  `| ${name.padEnd(28)} | ${String(r.gefangen).padStart(1)}/${r.ringe} | ${String(r.griffe).padStart(2)} | ${String(r.echteFluege).padStart(2)} | ${String(r.flugPx).padStart(4)} | ${String(r.flugTicks).padStart(3)} | ${String(r.liftZeilen).padStart(5)} | ${String(r.ticksJeGriff).padStart(4)} | ${String(r.schnapperPx).padStart(4)} | ${r.platsch ? "ja " : "nein"} | ${r.reihenfolge} |`;

const kopf = () => {
  console.log("| Lauf                         | Fang | Gr | Fl | Flug | t/F |  Lift | t/Gr | Snap | Platsch | Ringfolge |");
  console.log("|------------------------------|------|----|----|------|-----|-------|------|------|---------|-----------|");
};

const laufen = () => {
  console.log("# L3-M-a · TAUWERK-SONDE — die Ring-Kette an der echten Sim\n");
  console.log(`Konstanten: TILE=${TILE}px · SUBS=${SUBS} · BODY_H=${BODY_H}px · Griffradius 14px waagrecht / 28px senkrecht`);
  console.log(`Ausgeliefert: Seil ${PAINT.swingRopePx}px · Lift 2px/Tick · Dwell ${PAINT.swingDwellTicks} Ticks · keine Sperre`);
  console.log("");
  console.log("VERFAHREN. Jede Zeile ist EIN Lauf der echten `Sim` in einem synthetischen Raum: Decke, Tintensee,");
  console.log("eine Startplatte unter Ring 1, dann `ringe` Ringe im Abstand `d` Spalten. Das Kind springt senkrecht");
  console.log("an Ring 1, lässt bei Pendelwinkel >= 368 (von 512; 256 = Bogen-Unterkante) los und hält die Richtung.");
  console.log("");
  console.log("SPALTEN. `Fang` = verschiedene Ringe / gestellte Ringe · `Gr` = Griffe insgesamt · **`Fl` = ECHTE FLÜGE**");
  console.log("(Griffe nach mindestens 8 px Flugstrecke) · `Flug` = mittlere Flugstrecke in px · `t/F` = Ticks je Flug ·");
  console.log("`Lift` = Höhengewinn nach dem Loslassen in Zeilen · `t/Gr` = Ticks am Ring ·");
  console.log("`Snap` = REINER Sprung beim Griff in px: wohin der Bogen die Figur setzt, gegen die Stelle, an der sie fasste.");
  console.log("");
  console.log("⚠ `Fl` IST DIE ENTSCHEIDENDE SPALTE. Ein Pendel von 96 px trägt die Hände am Scheitel selbst 94 px weit;");
  console.log("stehen die Ringe sechs Spalten (= 96 px) auseinander, greift das Kind den nächsten OHNE zu fliegen.");
  console.log("Das sieht in einer reinen Fang-Zählung wie eine Kette aus und ist keine.\n");

  console.log("## 1 · EICH-ZEILE — der AUSGELIEFERTE Motor (Seil 96px, Lift 2px/t, keine Sperre)\n");
  kopf();
  for (const d of [3, 4, 5, 6, 7, 8, 9, 10]) {
    console.log(zeile(`heute · d=${d} Spalten`, kette({ ringe: 3, dCols: d, dRows: 0, swing: undefined })));
  }
  console.log("");

  console.log("## 2 · RASTER Seil x Ring-Abstand (Lift 4 px/t, Sperre 20 Ticks, 3 Ringe)\n");
  kopf();
  for (const L of [32, 40, 48, 56, 64]) {
    for (const d of [3, 4, 5, 6, 7, 8]) {
      console.log(zeile(`Seil ${L} · d=${d}`,
        kette({ ringe: 3, dCols: d, dRows: 0, swing: { ropePx: L, releaseLiftPx: 4, regrabLockTicks: 20 } })));
    }
  }
  console.log("");

  console.log("## 3 · DER LOSLASS-LIFT — dieselbe Geometrie (Seil 48, Sperre 20), nur der Lift bewegt sich\n");
  kopf();
  for (const lift of [0, 2, 4, 6, 8, 12]) {
    for (const d of [5, 6]) {
      console.log(zeile(`Seil 48 · Lift ${lift} · d=${d}`,
        kette({ ringe: 3, dCols: d, dRows: 0, swing: { ropePx: 48, releaseLiftPx: lift, regrabLockTicks: 20 } })));
    }
  }
  console.log("");

  console.log("## 4 · DIE REGRAB-SPERRE — zweimal gemessen, weil die erste Messung NICHTS sah\n");
  console.log("4a · Loslassen am SCHEITEL (Winkel >= 368). Dort ist die Hand 24-47 px vom Anker entfernt,");
  console.log("also LAENGST ausserhalb des 14-px-Griffradius — die Sperre kann hier gar nichts bewirken,");
  console.log("und dass alle fuenf Zeilen gleich sind, ist der Beweis dafuer und kein Beweis fuer die Sperre.\n");
  kopf();
  for (const lock of [0, 6, 12, 20, 30]) {
    console.log(zeile(`Scheitel · Sperre ${lock}`,
      kette({ ringe: 3, dCols: 5, dRows: 0, swing: { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: lock } })));
  }
  console.log("");
  console.log("4b · Loslassen NAHE DER BOGEN-UNTERKANTE (Winkel >= 280). Dort steht die Hand bei 32 px Seil nur");
  console.log("32·sin(16,9°) = 9 px neben dem Anker, also MITTEN im Griffradius: ohne Sperre greift das Kind");
  console.log("denselben Ring sofort wieder. Genau hier misst die Sperre etwas — `Gr` > `Fang` ist der Doppelgriff.\n");
  kopf();
  for (const lock of [0, 4, 8, 12, 20]) {
    console.log(zeile(`Unterkante · Sperre ${lock}`,
      kette({ ringe: 3, dCols: 5, dRows: 0, loslassAb: 280, swing: { ropePx: 32, releaseLiftPx: 4, regrabLockTicks: lock } })));
  }
  console.log("");
  console.log("## 4c · DER SCHNAPPER — was ein Griff die Figur wirklich versetzt\n");
  console.log("Ein Griff setzt die Figur auf den PENDELBOGEN, nicht dorthin, wo sie den Ring berührt hat.");
  console.log("Das Codex-Physik-Labor (2026-09-05) nannte das einen „unverzichtbaren Fang-Fix\" und schlug vor,");
  console.log("den Eintrittswinkel aus dem tatsächlichen Fangpunkt abzuleiten statt fest 210/302 zu setzen.");
  console.log("");
  console.log("Beide Regeln werden hier aus DEMSELBEN Lauf gerechnet — gleiche Flugbahn, gleicher Fangpunkt,");
  console.log("nur die Bogenposition unterscheidet sich. Deshalb ist der Vergleich kontrolliert, und die Spalte");
  console.log("`Motor` zeigt daneben, welche der beiden Regeln der gebaute Motor in diesem Lauf tatsächlich fuhr.\n");
  console.log("| Lauf                         | Seil | fester Bogen | aus dem Fangpunkt | Differenz | Motor |");
  console.log("|------------------------------|------|--------------|-------------------|-----------|-------|");
  for (const [L, sw] of [[96, undefined], [96, { ropePx: 96, releaseLiftPx: 2, regrabLockTicks: 0 }],
                         [64, { ropePx: 64, releaseLiftPx: 4, regrabLockTicks: 20 }],
                         [48, { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: 20 }],
                         [40, { ropePx: 40, releaseLiftPx: 4, regrabLockTicks: 20 }],
                         [32, { ropePx: 32, releaseLiftPx: 4, regrabLockTicks: 20 }]]) {
    for (const d of [5, 6]) {
      const r = kette({ ringe: 3, dCols: d, dRows: 0, swing: sw });
      console.log(`| ${`Seil ${L} · d=${d}`.padEnd(28)} | ${String(L).padStart(4)} | ${String(r.schnapperFestPx).padStart(12)} | ${String(r.schnapperAltPx).padStart(17)} | ${String(r.schnapperAltPx - r.schnapperFestPx).padStart(9)} | ${String(r.schnapperPx).padStart(5)} |`);
    }
  }
  console.log("");
  console.log("BEFUND, und eine Korrektur an mir selbst. Am ausgelieferten 96-px-Seil kauft die Fangpunkt-Regel");
  console.log("fast nichts (3–8 px von rund achtzig) — an dieser Zeile allein hätte ich sie verworfen. Am");
  console.log("KETTENSEIL, um das es hier geht, nimmt sie ein Drittel weg (60 → 40 px bei 48 px Seil). Ein Teil");
  console.log("des Sprungs bleibt unvermeidbar: das Griff-Fenster ist 14 × 28 px, das Seil bis zu 96 px, der");
  console.log("Körper MUSS also versetzt werden. Gebaut ist die Fangpunkt-Regel deshalb NUR für eine Phase, die");
  console.log("ihr Tauwerk erklärt (`PhaseSpec.swing`); jede Phase davor behält den ausgelieferten festen Bogen.\n");
  console.log("## 5 · FÜNF RINGE, mit Höhenversatz (Seil 48, Lift 4, Sperre 20)\n");
  kopf();
  for (const dr of [0, -1, 1]) {
    for (const d of [4, 5, 6]) {
      console.log(zeile(`5 Ringe · d=${d} · dy=${dr}`,
        kette({ ringe: 5, dCols: d, dRows: dr, swing: { ropePx: 48, releaseLiftPx: 4, regrabLockTicks: 20 } })));
    }
  }
  console.log("");
};

laufen();

// ─────────────────────────────────────────────────────────────────────────────
// TEIL B · DIE ZAHLEN, DIE DAS ERREICHBARKEITS-MODELL BRAUCHT
//
// `level.ts#reachFrom` segnet heute von einem Ring aus alle Zellen in einem
// festen Fenster von RING_DX = 8 Spalten. Diese Zahl gehoert zum 96-px-Seil; ein
// Kettenseil von 48 px traegt nicht so weit, und ein Modell, das trotzdem 8
// verspricht, segnet Zellen, die kein Kind erreicht — genau die Richtung, die die
// Huellkurven-Regel verbietet („every constant here must be <= what the real
// engine can do"). Die beiden Sweeps unten messen die zwei Zahlen, die das
// Gesetz `ring-chain` und `ringDxFor` brauchen.

/** EIN Ring, EINE Landeplattform im Abstand (dx, dy) davon. Kommt das Kind an? */
const landung = ({ ropePx, dx, dy, richtung = 1, maxTicks = 700 }) => {
  const breite = 40, hoehe = 26;
  const ringC = 12, ringR = 8;
  const zielC = ringC + dx * richtung, zielR = ringR + dy;
  if (zielC < 2 || zielC > breite - 3 || zielR < 2 || zielR > hoehe - 5) return null;
  const rows = [];
  for (let r = 0; r < hoehe; r++) {
    let z = "";
    for (let c = 0; c < breite; c++) z += (r === 0 || r === hoehe - 1) ? "#" : (r >= hoehe - 4 ? "w" : ".");
    rows.push(z);
  }
  const plattR = ringR + 5;
  let a = rows[plattR].split(""); for (let c = ringC - 2; c <= ringC + 2; c++) a[c] = "#"; rows[plattR] = a.join("");
  let b = rows[plattR - 1].split(""); b[ringC] = "S"; rows[plattR - 1] = b.join("");
  let o = rows[ringR].split(""); o[ringC] = "o"; rows[ringR] = o.join("");
  // die Ziel-Plattform: drei Kacheln breit, Krone auf zielR
  let z2 = rows[zielR].split("");
  for (let c = Math.max(0, zielC - 1); c <= Math.min(breite - 1, zielC + 1); c++) z2[c] = "#";
  rows[zielR] = z2.join("");
  let x = rows[plattR - 1].split(""); x[breite - 3] = "X"; rows[plattR - 1] = x.join("");

  const sim = neueSim(rows, ropePx === PAINT.swingRopePx ? undefined : { ropePx, releaseLiftPx: 4, regrabLockTicks: 20 });
  let gegriffen = false;
  for (let t = 0; t < maxTicks; t++) {
    const q = sim.player;
    let tasten;
    if (q.swing) {
      gegriffen = true;
      const w = q.swing.angle;
      const reif = richtung === 1 ? w >= 368 : w <= 144;
      tasten = reif ? { jump: true, right: richtung === 1, left: richtung === -1 } : {};
    } else if (!gegriffen) tasten = { jump: true };
    else tasten = { right: richtung === 1, left: richtung === -1 };
    sim.step(pad(tasten));
    const r2p = sim.player;
    if (gegriffen && !r2p.swing && r2p.grounded) {
      const fussR = Math.round(r2p.y / SUBS / TILE) - 1;
      const cc = Math.floor(r2p.x / SUBS / TILE);
      // auf der Zielkrone gelandet? (die Krone ist zielR, die Fuesse stehen darauf)
      return Math.abs(cc - zielC) <= 1 && fussR === zielR - 1;
    }
    if (r2p.y / SUBS / TILE >= hoehe - 4) return false; // Platsch
  }
  return false;
};

/** Zwei Ringe im Abstand d — traegt die Kette? (fuer `ring-chain`) */
const zweiRinge = ({ ropePx, d, dRows = 0 }) => {
  const sw = ropePx === PAINT.swingRopePx ? undefined : { ropePx, releaseLiftPx: 4, regrabLockTicks: 20 };
  return kette({ ringe: 2, dCols: d, dRows, swing: sw }).gefangen === 2;
};

const teilB = () => {
  console.log("# TEIL B · DIE ZAHLEN FUER DAS ERREICHBARKEITS-MODELL\n");

  console.log("## 6 · VON EINEM RING AUS — welche Landeflaeche erreicht das Kind wirklich?\n");
  console.log("Ein Ring, eine drei Kacheln breite Plattform im Abstand (dx, dy). `x` = das Kind steht am Ende");
  console.log("darauf. Die Zeile `max dx` ist die groesste Spalte, in der noch irgendein dy traegt — das ist die");
  console.log("Zahl, die `ringDxFor(ropePx)` verspricht, und sie wird nach unten gerundet, nie nach oben.\n");
  const dys = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  for (const L of [32, 48, 64, 96]) {
    console.log(`### Seil ${L} px`);
    console.log("| dy \\ dx |" + [...Array(13).keys()].slice(1).map((d) => String(d).padStart(3)).join(" |") + " |");
    console.log("|---------|" + [...Array(12)].map(() => "----").join("|") + "|");
    let maxDx = 0;
    for (const dy of dys) {
      const zellen = [];
      for (let dx = 1; dx <= 12; dx++) {
        const ok = landung({ ropePx: L, dx, dy });
        zellen.push(ok === null ? " . " : ok ? " x " : "   ");
        if (ok === true) maxDx = Math.max(maxDx, dx);
      }
      console.log(`| ${String(dy).padStart(7)} |` + zellen.join(" |") + " |");
    }
    console.log(`**max dx (Seil ${L}) = ${maxDx} Spalten**\n`);
  }

  console.log("## 7 · RING ZU RING — wie weit traegt die Kette? (fuer das Gesetz `ring-chain`)\n");
  console.log("Zwei Ringe im Abstand d Spalten und dy Zeilen. `x` = Ring 2 wurde gefangen.\n");
  for (const L of [32, 48, 64, 96]) {
    const zeilen = [];
    for (const dy of [-2, -1, 0, 1, 2]) {
      const zellen = [];
      for (let d = 1; d <= 12; d++) zellen.push(zweiRinge({ ropePx: L, d, dRows: dy }) ? " x " : "   ");
      zeilen.push(`| ${String(dy).padStart(7)} |` + zellen.join(" |") + " |");
    }
    console.log(`### Seil ${L} px`);
    console.log("| dy \\ d  |" + [...Array(13).keys()].slice(1).map((d) => String(d).padStart(3)).join(" |") + " |");
    console.log("|---------|" + [...Array(12)].map(() => "----").join("|") + "|");
    for (const z of zeilen) console.log(z);
    console.log("");
  }
};

teilB();

// ─────────────────────────────────────────────────────────────────────────────
// TEIL C · DIE STEIGENDE BILGE
//
// Dieselbe Regel wie oben: keine Zahl aus einer Rechnung. Die Sonde baut einen
// Laderaum, laesst das Wasser laufen und druckt, was die echte `Sim` tut.

/** Ein Laderaum mit einem LAUFGANG: das Kind steht darauf und kann die Griffe
 *  erreichen, waehrend das Wasser von unten steigt. Ohne den Laufgang stuende
 *  das Kind im Anfangsstand der Bilge und waere nach dem ersten Puls ertrunken —
 *  der erste Entwurf dieser Sonde hat genau das gemessen und nichts gelernt. */
const laderaum = ({ pumpeC = 8, ventilC = 18, gangR = 10 } = {}) => {
  const breite = 28, hoehe = 22;
  const rows = [];
  for (let r = 0; r < hoehe; r++) {
    let z = "";
    for (let c = 0; c < breite; c++) z += (r === 0 || r === hoehe - 1) ? "#" : ".";
    rows.push(z);
  }
  let gang = rows[gangR + 1].split("");
  for (let c = 1; c < breite - 1; c++) gang[c] = "#";
  rows[gangR + 1] = gang.join("");
  let st = rows[gangR].split(""); st[3] = "S"; st[breite - 4] = "X"; rows[gangR] = st.join("");
  return {
    rows,
    entities: [
      { id: "pumpe", role: "pump.trigger", skin: "fb-ent-generic", c: pumpeC, r: gangR, tier: "E", params: { kind: "pump" } },
      { id: "ventil", role: "pump.trigger", skin: "fb-ent-generic", c: ventilC, r: gangR, tier: "E", params: { kind: "valve" } },
    ],
    bilge: { band: { c0: 1, c1: breite - 2 }, rStart: hoehe - 2, rTop: 6, pulseTicks: 30, riseRows: 1, freezeTicks: 180, pumps: ["pumpe"], valve: "ventil" },
    bodenR: gangR,
  };
};

const bilgeSim = (raum) => new Sim({
  level: {
    schema: "paintLevel@1", id: "g1-probe-ch03b", chapter: "ch03", draft: true, name: "Sonde",
    goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump", "punch"],
    phases: [{ id: "p1", nameDe: "Laderaum", surface: "normal", plates: {}, rows: raum.rows,
      entities: raum.entities, links: [], exit: { to: "done" }, bilge: raum.bilge }],
  },
  phaseId: "p1", grantedAbilities: () => ["jump", "punch"], freedCageIds: () => [],
});

const teilC = () => {
  console.log("# TEIL C · DIE STEIGENDE BILGE\n");

  console.log("## 8 · DIE ANSTIEGSKURVE — steigt sie wirklich in Pulsen?\n");
  const raum = laderaum();
  const sim = bilgeSim(raum);
  console.log(`Deklariert: Start Zeile ${raum.bilge.rStart} · Höchststand ${raum.bilge.rTop} · alle ${raum.bilge.pulseTicks} Ticks um ${raum.bilge.riseRows} Zeile(n)`);
  const pulse = [];
  let letzte = sim.bilgeWaterRow;
  for (let t = 0; t < 900; t++) {
    const evs = sim.step(pad({}));
    if (sim.bilgeWaterRow !== letzte) { pulse.push([t, sim.bilgeWaterRow, evs.some((e) => e.type === "bilgePulse")]); letzte = sim.bilgeWaterRow; }
  }
  console.log("| Tick | Zeile | Ereignis `bilgePulse`? | Abstand zum vorigen Puls |");
  console.log("|------|-------|------------------------|--------------------------|");
  let vorher = null;
  for (const [t, r, ev] of pulse) {
    console.log(`| ${String(t).padStart(4)} | ${String(r).padStart(5)} | ${ev ? "ja" : "NEIN"}${" ".repeat(20)} | ${vorher === null ? "—" : String(t - vorher).padStart(3)} |`);
    vorher = t;
  }
  console.log(`\nGemessen: ${pulse.length} Pulse, Endstand Zeile ${sim.bilgeWaterRow}. Erwartet ${raum.bilge.rStart - raum.bilge.rTop} Pulse bis Zeile ${raum.bilge.rTop}.\n`);

  console.log("## 9 · DAS GITTER, DAS DER TICK SIEHT — und das, das im Level steht\n");
  const s2 = bilgeSim(laderaum());
  const vor = s2.grid.join("\n");
  for (let t = 0; t < 200; t++) s2.step(pad({}));
  console.log(`Autoriertes \`grid\` nach 200 Ticks unverändert: ${s2.grid.join("\n") === vor ? "JA" : "NEIN — der Renderer bekäme ein wanderndes Terrain"}`);
  console.log(`Wasserstand nach 200 Ticks: Zeile ${s2.bilgeWaterRow} (Start ${laderaum().bilge.rStart})`);
  const ohne = new Sim({
    level: { schema: "paintLevel@1", id: "x", chapter: "ch03", draft: true, name: "s", goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump"],
      phases: [{ id: "p1", nameDe: "s", surface: "normal", plates: {}, rows: laderaum().rows, entities: [], links: [], exit: { to: "done" } }] },
    phaseId: "p1", grantedAbilities: () => ["jump"], freedCageIds: () => [],
  });
  console.log(`Phase OHNE bilge: Wasserzeile = ${ohne.bilgeWaterRow} (−1 heißt: keine Bilge, liveGrid bleibt dieselbe Referenz)\n`);

  console.log("## 10 · DIE FAUST — friert der Pumpengriff das Wasser ein, lässt das Ventil es ab?\n");
  console.log("Verfahren: das Kind läuft über den Laufgang zum Griff und wirft die Faust. ⚠ Die Faust fliegt beim");
  console.log("LOSLASSEN der Taste (`player.ts#punchReleased`), nicht beim Drücken — der erste Entwurf dieser");
  console.log("Sonde hielt die Taste gedrückt und meldete „nie getroffen\" über einem Motor, der einwandfrei lief.");
  console.log("Gedruckt wird der Stand vor dem Treffer und 200 Ticks danach, dazu die VERGLEICHSZEILE ohne Treffer.\n");

  // die Eich-Zeile: derselbe Raum, dieselben 200 Ticks, keine Faust
  const rEich = laderaum();
  const sEich = bilgeSim(rEich);
  for (let t = 0; t < 90; t++) sEich.step(pad({}));
  const eichVor = sEich.bilgeWaterRow;
  for (let t = 0; t < 200; t++) sEich.step(pad({}));
  console.log(`**Ohne Faust** (Eich-Zeile): Zeile ${eichVor} → ${sEich.bilgeWaterRow} in 200 Ticks.`);

  for (const [was, zielC] of [["Pumpengriff", 8], ["Ablassventil", 18]]) {
    const r3 = laderaum();
    const s3 = bilgeSim(r3);
    for (let t = 0; t < 90; t++) s3.step(pad({}));
    const vorherRow = s3.bilgeWaterRow;
    let getroffen = null, ereignis = "—";
    for (let t = 0; t < 900; t++) {
      const cc = s3.player.x / SUBS / TILE;
      const nah = Math.abs(cc - zielC) < 1.5;
      // 6 Ticks halten, dann loslassen — die Faust fliegt beim Loslassen
      const punch = nah && t % 16 < 6;
      const evs = s3.step(pad({ right: cc < zielC - 0.5, left: cc > zielC + 0.5, punch }));
      const e = evs.find((x) => x.type === "pumpFrozen" || x.type === "bilgeDrained");
      if (e && getroffen === null) { getroffen = t; ereignis = e.type; }
      if (getroffen !== null && t >= getroffen + 200) break;
    }
    const nachher = s3.bilgeWaterRow;
    const urteil = ereignis === "bilgeDrained" ? `abgelassen auf den Anfangsstand ${r3.bilge.rStart}`
      : ereignis === "pumpFrozen" ? `eingefroren — ohne Treffer stünde es bei ${sEich.bilgeWaterRow}`
      : "NICHTS PASSIERT — das wäre ein Befund";
    console.log(`**${was}** (Spalte ${zielC}): Stand vor dem Treffer Zeile ${vorherRow} · Ereignis \`${ereignis}\` bei Tick ${getroffen ?? "NIE GETROFFEN"} · 200 Ticks später Zeile ${nachher} → ${urteil}`);
  }
  console.log("");

  console.log("## 11 · ERTRINKT DAS KIND, WENN DAS WASSER ES ERREICHT?\n");
  const r4 = laderaum();
  const s4 = bilgeSim(r4);
  let platsch = null;
  for (let t = 0; t < 1200 && platsch === null; t++) {
    const evs = s4.step(pad({}));
    if (evs.some((e) => e.type === "toast" && e.msg.includes("Platsch"))) platsch = t;
  }
  console.log(`Das Kind steht still auf Zeile ${r4.bodenR - 1}. Die Bilge erreicht es bei Tick ${platsch ?? "NIE — DAS WÄRE EIN BEFUND"} (Wasserzeile ${s4.bilgeWaterRow}).`);
  console.log("Das ist die eigentliche Probe der ganzen Trennung: der Hazard-Treffer kommt aus `stepPlayer`,");
  console.log("und `stepPlayer` liest `liveGrid` — läse es weiter `grid`, stiege das Wasser sichtbar und täte nichts.\n");
};

teilC();
