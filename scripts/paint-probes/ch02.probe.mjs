#!/usr/bin/env node --experimental-strip-types
/**
 * L2-M-a · P3a · DIE HANGEL-SONDE FÜR ch02.
 *
 * WARUM SIE EXISTIERT. Das Erreichbarkeits-Modell (`level.ts#REACH_ENVELOPE`)
 * verspricht ABSICHTLICH weniger, als die Engine trägt — die Datei sagt es
 * selbst: „every constant here must be ≤ what the real engine can do … The
 * PROOF of true reachability is the tape, never this model." Die Zahl für die
 * neue hang-Kante darf deshalb nicht aus einer Überschlagsrechnung kommen. Das
 * Boot-Blatt nennt `HANG_ROWS = 2` ausdrücklich als STARTWERT (überschlagen aus
 * `hangJumpVy`, konservativ halbiert) und verlangt eine Messung an der echten
 * `Sim`. Das ist diese Datei.
 *
 * WAS SIE MISST — UND WARUM ALS DIFFERENZ. Der erste Entwurf fragte „welche
 * Mauer schafft das Kind mit `hang`?" und bekam 8 Zeilen. Die Zahl war richtig
 * und die FRAGE falsch: bei den Mauern 4 bis 6 hat das Kind kein einziges Mal
 * gegriffen (Griffe = 0) — es sprang schlicht hinauf. Gemessen werden muss also
 * die DIFFERENZ: dieselbe Mauer einmal mit und einmal ohne die Fähigkeit. Was
 * `hang` wirklich kauft, ist der Abstand zwischen beiden Grenzen.
 *
 * ⚠ SIE IST KEIN CI-TOR. `scripts/check-ci-gates.mjs` liest ausschliesslich
 * `scripts/check-*.mjs` im WURZEL-Ordner (`readdirSync`, nicht rekursiv). Eine
 * Datei unter `scripts/paint-probes/` ist für das Meta-Tor unsichtbar und
 * braucht weder eine `ci.yml`-Zeile noch eine Deklaration. `ci.yml` bleibt
 * unberührt.
 *
 *   node --experimental-strip-types scripts/paint-probes/ch02.probe.mjs
 */
import { Sim } from "../../packages/game-paint/src/sim.ts";
import { IDLE_PAD } from "../../packages/game-paint/src/player.ts";
import { PAINT, SUBS, TILE } from "../../packages/game-paint/src/paint.ts";
import { REACH_ENVELOPE } from "../../packages/game-paint/src/level.ts";

const BREITE = 24;
const BODEN = 20; // Boden-Glyphzeile; die FÜSSE ruhen auf ihr (L5-G1-Falle)

/** Eine Mauer von `hoehe` Zeilen mit begehbarer Krone, Anlauf links. */
const welt = (hoehe) => {
  const rows = [];
  for (let r = 0; r < BODEN + 3; r++) {
    let z = "";
    for (let c = 0; c < BREITE; c++) {
      z += r === 0 || r >= BODEN ? "#" : c >= 12 && r >= BODEN - hoehe ? "#" : ".";
    }
    rows.push(z);
  }
  const s = rows[BODEN - 1].split(""); s[3] = "S"; rows[BODEN - 1] = s.join("");
  const k = rows[BODEN - hoehe - 1].split(""); k[BREITE - 3] = "X"; rows[BODEN - hoehe - 1] = k.join("");
  return rows;
};

const level = (rows, abilities) => ({
  schema: "paintLevel@1", id: "g1-probe", chapter: "ch02", draft: true, name: "Sonde",
  goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities,
  phases: [{ id: "p1", nameDe: "Sonde", surface: "normal", plates: {}, rows, entities: [], links: [], exit: { to: "done" } }],
});

const pad = (over) => ({ ...IDLE_PAD, ...over });

/** Ein Anlauf an die Mauer. `jump` wird am Griff erneut gedrückt (es gibt keinen
 *  Klimmzug — man verlässt die Kante durch einen vollen Sprung). */
const anlauf = (hoehe, abilities) => {
  const rows = welt(hoehe);
  const sim = new Sim({
    level: level(rows, abilities), phaseId: "p1",
    grantedAbilities: () => [...abilities], freedCageIds: () => [],
  });
  const startFuss = sim.player.y / SUBS;
  let hoechsterFuss = startFuss;
  let griffe = 0, warHang = false, griffTicks = 0, griffZeile = null;
  for (let t = 0; t < 240; t++) { if (sim.player.x / SUBS / TILE >= 9) break; sim.step(pad({ right: true })); }
  for (let t = 0; t < PAINT.jumpHoldTicks; t++) sim.step(pad({ right: true, jump: true }));
  for (let t = 0; t < 400; t++) {
    sim.step(pad({ right: true, jump: sim.player.hangAt !== null }));
    hoechsterFuss = Math.min(hoechsterFuss, sim.player.y / SUBS);
    if (sim.player.hangAt) { griffTicks++; if (!warHang) { griffe++; griffZeile = sim.player.hangAt.r; } }
    warHang = sim.player.hangAt !== null;
    if (sim.player.grounded && t > 30) break;
  }
  const kroneY = (BODEN - hoehe) * TILE;
  return {
    stehtOben: sim.player.grounded && sim.player.y / SUBS <= kroneY + 1,
    griffe, griffTicks, griffZeile,
    hubZeilen: (startFuss - hoechsterFuss) / TILE,
  };
};

/** Der reine Halte-Sprung im Freien — die Eich-Groesse der Sonde. */
const reinerSprung = () => {
  const sim = new Sim({
    level: level(welt(0), ["jump", "run"]), phaseId: "p1",
    grantedAbilities: () => ["jump", "run"], freedCageIds: () => [],
  });
  const start = sim.player.y / SUBS;
  let hoch = start;
  for (let t = 0; t < PAINT.jumpHoldTicks; t++) { sim.step(pad({ jump: true })); hoch = Math.min(hoch, sim.player.y / SUBS); }
  for (let t = 0; t < 90; t++) { sim.step(pad({})); hoch = Math.min(hoch, sim.player.y / SUBS); if (sim.player.grounded && t > 4) break; }
  return (start - hoch) / TILE;
};

/** Wie lange haelt der Griff, wenn NICHT abgesprungen wird — und wie weit traegt
 *  der Absprung nach rechts? Zwei Zahlen, die das Blatt eigens bestellt. */
const griffUndTragweite = (hoehe) => {
  const rows = welt(hoehe);
  const sim = new Sim({
    level: level(rows, MIT), phaseId: "p1",
    grantedAbilities: () => [...MIT], freedCageIds: () => [],
  });
  for (let t = 0; t < 240; t++) { if (sim.player.x / SUBS / TILE >= 9) break; sim.step(pad({ right: true })); }
  for (let t = 0; t < PAINT.jumpHoldTicks; t++) sim.step(pad({ right: true, jump: true }));
  // haengen lassen, ohne zu springen
  let haltTicks = 0, gegriffen = false;
  for (let t = 0; t < 600; t++) {
    sim.step(pad({ right: true }));
    if (sim.player.hangAt) { gegriffen = true; haltTicks++; }
    else if (gegriffen) break;
  }
  if (!gegriffen) return { haltTicks: null, tragWeite: null };
  // jetzt abspringen und die waagrechte Strecke messen
  const xVorher = sim.player.x / SUBS;
  let xWeitest = xVorher;
  for (let t = 0; t < 120; t++) {
    sim.step(pad({ right: true, jump: t < PAINT.jumpHoldTicks }));
    xWeitest = Math.max(xWeitest, sim.player.x / SUBS);
    if (sim.player.grounded && t > 4) break;
  }
  return { haltTicks, tragWeite: (xWeitest - xVorher) / TILE };
};

const OHNE = ["jump", "run"];
const MIT = ["jump", "run", "hang"];

console.log("── ch02-Sonde · was das Hangeln an der ECHTEN Sim kauft ──");
console.log(`Engine: hangJumpVy ${PAINT.hangJumpVy / SUBS} px/Takt · jumpHoldTicks ${PAINT.jumpHoldTicks} · ledgeMagnetPx ${PAINT.ledgeMagnetPx} · HAND/HANG s. player.ts`);
console.log(`Eichung · reiner Halte-Sprung im Freien: ${reinerSprung().toFixed(2)} Zeilen Fuss-Hub`);
console.log("");
console.log("| Mauer | ohne hang | mit hang | Griffe (mit) | Griff-Takte | Kante |");
console.log("|---|---|---|---|---|---|");
let maxOhne = 0, maxMit = 0;
for (let h = 4; h <= 10; h++) {
  const o = anlauf(h, OHNE);
  const m = anlauf(h, MIT);
  if (o.stehtOben) maxOhne = h;
  if (m.stehtOben) maxMit = h;
  console.log(`| ${h} | ${o.stehtOben ? "oben" : "—"} | ${m.stehtOben ? "oben" : "—"} | ${m.griffe} | ${m.griffTicks} | ${m.griffZeile ?? "—"} |`);
}
const gt = griffUndTragweite(8);
console.log("");
console.log(`GRIFF · haelt ohne Absprung ${gt.haltTicks} Takte (${(gt.haltTicks / 60).toFixed(1)} s) — der Griff ist statisch, es gibt keinen Klimmzug.`);
console.log(`TRAG-WEITE · der Absprung von der Kante traegt ${gt.tragWeite?.toFixed(2)} Spalten nach rechts.`);

const delta = maxMit - maxOhne;
console.log("");
console.log(`GEMESSEN · ohne hang traegt die Engine ${maxOhne} Zeilen, mit hang ${maxMit} — das Hangeln kauft ${delta} Zeilen.`);
console.log(`Das Modell verspricht JUMP_UP = ${REACH_ENVELOPE.JUMP_UP} (die Engine kann ${reinerSprung().toFixed(2)}); es unterverspricht um Absicht.`);
console.log(`EMPFEHLUNG · HANG_ROWS = ${delta} ⇒ das Modell segnet ${REACH_ENVELOPE.JUMP_UP + delta} Zeilen gegen ${maxMit} gemessene.`);
console.log(`Sicherheitsabstand ${maxMit - (REACH_ENVELOPE.JUMP_UP + delta)} Zeilen — dieselbe Richtung wie bei JUMP_UP: das Modell darf`);
console.log(`eine erreichbare Stelle uebersehen, aber nie eine unerreichbare segnen (level.ts, THE ENVELOPE LAW).`);
