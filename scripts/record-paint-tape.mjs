#!/usr/bin/env node --experimental-strip-types
// PB-T2 · the proof-tape RECORDER: drives the real Sim closed-loop with
// high-level pilot macros, records the raw pad stream, verifies the recorded
// stream OPEN-LOOP through replayPhaseTape (the same function CI runs), and
// writes the sidecar chNN.proof.json. Determinism makes record == replay.
//
//   node --experimental-strip-types scripts/record-paint-tape.mjs [phase...]
//
// Pilots live at the bottom — plain macro programs, tuned by running this
// script and reading the printed cell trace. A pilot that cannot reach the
// exit IS the proof that the level fails the playability law.

import fs from "node:fs";
import path from "node:path";
import { Sim } from "../packages/game-paint/src/sim.ts";
import { encodePads, padToMask, replayPhaseTape, PROOF_SCHEMA } from "../packages/game-paint/src/tape.ts";
import { IDLE_PAD } from "../packages/game-paint/src/player.ts";
import { SUBS, TILE } from "../packages/game-paint/src/paint.ts";

// L0 · D10: welches Kapitel aufgenommen wird. `--chapter chNN`, Vorgabe ch01 —
// so bleibt jeder bestehende Aufruf (`record-paint-tape.mjs p1 p2`) gültig.
const chArg = process.argv.indexOf("--chapter");
const CHAPTER = chArg !== -1 ? process.argv[chArg + 1] : "ch01";
if (!/^ch\d{2}$/.test(CHAPTER ?? "")) { console.error(`record-paint-tape: --chapter braucht eine Kapitel-Id (chNN), bekam "${CHAPTER}"`); process.exit(2); }
const LEVEL_PATH = `content/corpus/stories/g1.st.lost-pages/paint/${CHAPTER}.level.json`;
const PROOF_PATH = LEVEL_PATH.replace(".level.json", ".proof.json");
if (!fs.existsSync(path.resolve(LEVEL_PATH))) { console.error(`record-paint-tape: ${LEVEL_PATH} gibt es nicht`); process.exit(2); }
const level = JSON.parse(fs.readFileSync(path.resolve(LEVEL_PATH), "utf8"));
const PILOTS_PATH = path.resolve(import.meta.dirname, "paint-pilots", `${CHAPTER}.pilots.mjs`);
if (!fs.existsSync(PILOTS_PATH)) {
  console.error(`record-paint-tape: ${CHAPTER} hat keine Piloten (scripts/paint-pilots/${CHAPTER}.pilots.mjs) — ohne handgeführte Makros gibt es kein Beweis-Band`);
  process.exit(2);
}
const { PILOTS } = await import(PILOTS_PATH);

const cellOf = (sim) => ({ c: Math.round(sim.player.x / SUBS / TILE * 10) / 10, r: Math.round(sim.player.y / SUBS / TILE * 10) / 10 });

/** Closed-loop pilot runner: executes macros against the live sim, recording
 *  every tick's pad mask + auto-solving tasks exactly like the CI replayer. */
const runPilot = (phaseId, entryAbilities, program, { maxTicks = 60 * 120, trace = false } = {}) => {
  const abilities = [...entryAbilities];
  const freed = [];
  const sim = new Sim({ level, phaseId, grantedAbilities: () => abilities, freedCageIds: () => freed });
  const masks = [];
  let exited = false;
  let exitTo = null;
  let awaitLanding = false;

  const handle = (evs) => {
    for (const ev of evs) {
      if (ev.type === "task") handle(sim.solveTask(ev.req.ctx));
      else if (ev.type === "powerup") { if (!abilities.includes(ev.grants)) abilities.push(ev.grants); sim.setOverlay(false); }
      else if (ev.type === "cageFreed") { freed.push(ev.id); sim.setOverlay(false); }
      else if (ev.type === "guardianDown") awaitLanding = true; // R5-W2 · H1: die Karte bleibt über der Landung oben (siehe tape.ts)
      else if (ev.type === "arenaBrief") sim.setOverlay(false); // R5-W2 · H1: die Arena-Anleitung friert ein, also ablegen
      else if (ev.type === "cageHint") sim.setOverlay(false); // PB-F3: the one-time hint
      // PK-R3b · R3-16: a Regel-Seite freezes the world so it can be read, so
      // the pilot must put it down again — the cagehint lesson, applied to the
      // new one-time card before it can strand anyone.
      else if (ev.type === "tip") sim.setOverlay(false);
      else if (ev.type === "exit") { exited = true; exitTo = ev.to; }
    }
  };

  const tick = (pad) => {
    if (masks.length >= maxTicks || exited) return false;
    masks.push(padToMask(pad));
    handle(sim.step(pad));
    // R5-W2 · H1: dieselbe Reihenfolge wie im Abspiel-Shell — sonst nimmt der
    // Rekorder ein Band auf, das die Prüfung anders fährt als er selbst.
    if (awaitLanding && sim.holdTicks === 0) { awaitLanding = false; sim.setOverlay(false); }
    return !exited;
  };

  const pad = (over) => ({ ...IDLE_PAD, ...over });

  for (const step of program) {
    if (exited) break;
    const [op, ...args] = step;
    if (op === "wait") {
      for (let i = 0; i < args[0] && tick(pad({})); i++);
    } else if (op === "hold") {
      // ["hold", {right:true,...}, ticks]
      for (let i = 0; i < args[1] && tick(pad(args[0])); i++);
    } else if (op === "walkTo") {
      // ["walkTo", col, timeoutTicks?] — closed loop on the player column
      const target = args[0];
      const timeout = args[1] ?? 600;
      for (let i = 0; i < timeout; i++) {
        const c = sim.player.x / SUBS / TILE;
        if (Math.abs(c - (target + 0.5)) < 0.3) break;
        if (!tick(pad(c < target + 0.5 ? { right: true } : { left: true }))) break;
      }
    } else if (op === "jump") {
      // ["jump", {dir, hold, steer?}] — hold-jump + steer; `steer` limits the
      // steering to the first N flight ticks (airDecay stops vx after), so a
      // 2-col hop is expressible — full-flight steer overflies 5+ cols (R5-P1
      // measurement) and cannot land on a 2-wide Steg or podium.
      const dir = args[0]?.dir ?? null;
      const hold = args[0]?.hold ?? 14;
      const steerT = args[0]?.steer ?? Infinity;
      const steerPad = dir === "right" ? { right: true } : dir === "left" ? { left: true } : {};
      let ft = 0;
      for (let i = 0; i < hold && tick(pad({ ...(ft < steerT ? steerPad : {}), jump: true })); i++, ft++);
      for (let i = 0; i < 60; i++) { if (sim.player.grounded || !tick(pad(ft < steerT ? steerPad : {}))) break; ft++; }
    } else if (op === "runJump") {
      // ["runJump", takeoffCol, hold?, steer?] — run right (canRun ramps to
      // 2.25 px/t) and jump the tick the takeoff column is crossed: AIR_SNAP
      // carries the run speed into the arc (the dossier's Momentum-Belohnung).
      const [takeC, rjHold = 6, rjSteer = Infinity] = args;
      for (let i = 0; i < 600; i++) {
        const c = sim.player.x / SUBS / TILE;
        if (c >= takeC) break;
        if (!tick(pad({ right: true }))) break;
      }
      let ft2 = 0;
      for (let i = 0; i < rjHold && tick(pad({ ...(ft2 < rjSteer ? { right: true } : {}), jump: true })); i++, ft2++);
      for (let i = 0; i < 60; i++) { if (sim.player.grounded || !tick(pad(ft2 < rjSteer ? { right: true } : {}))) break; ft2++; }
    } else if (op === "climbTo") {
      // ["climbTo", row] — hold up (vine) until at/above the row
      const target = args[0];
      for (let i = 0; i < 600; i++) {
        const r = sim.player.y / SUBS / TILE;
        if (r <= target + 0.2) break;
        if (!tick(pad({ up: true }))) break;
      }
    } else if (op === "punchEvery") {
      // ["punchEvery", interval, totalTicks] — arena rhythm: charge-free taps
      const [interval, total] = args;
      for (let i = 0; i < total; i++) {
        if (!tick(pad(i % interval === 0 ? { punch: true } : {}))) break;
      }
    } else if (op === "paceUntilDown") {
      // ["paceUntilDown", halfPeriod, timeout] — pace until the guardian is
      // actually DOWN, CLOSED LOOP on the sim's own flag (the A-3 principle
      // this file already applies to platforms: never a tick count, because the
      // number of throws it takes depends on every tick spent upstream).
      //
      // R5-W4 · H2 (Ruling R50): seit dem Umbau reicht Pendeln nicht mehr. Eine
      // beantwortete Karte setzt die Tafel auf die Bretter, und erst die
      // BERÜHRUNG nimmt eine Kritzel-Schicht weg — ein Pilot, der nur hin und
      // her läuft, käme nie zum Ausgang und würde damit behaupten, die Arena sei
      // unspielbar. Also geht er hin, und zwar wieder GESCHLOSSEN: auf ihren
      // Zustand, nicht auf eine Tickzahl. (Nur p4 fährt dieses Makro.)
      const [half, timeout = 6000] = args;
      for (let i = 0; i < timeout; i++) {
        if (sim.guardianDefeated) break;
        const g = sim.world.entities.find((e) => e.role === "guardian");
        const waiting = g && (g.state === "wipeable" || g.state === "settle");
        const right = waiting ? g.x > sim.player.x : Math.floor(i / half) % 2 === 0;
        if (!tick(pad(right ? { right: true } : { left: true }))) break;
      }
    } else if (op === "pace") {
      // PK-R6 · C2 · ["pace", halfPeriod, totalTicks] — the FIST-LESS arena
      // rhythm. ch01 grants no fist (doc 44 §4), so the way into the fight is
      // no longer deflecting chalk but getting out of its way: every piece that
      // reaches the floor is a dodge, and DODGES_PER_WINDOW of them open the
      // counter-window. Walking a steady line back and forth is exactly what a
      // child does under a thrower, and it is what the pilot does here.
      const [half, total] = args;
      for (let i = 0; i < total; i++) {
        const right = Math.floor(i / half) % 2 === 0;
        if (!tick(pad(right ? { right: true } : { left: true }))) break;
      }
    } else if (op === "settle") {
      for (let i = 0; i < 240; i++) { if (sim.player.grounded && Math.abs(sim.player.vx) < 8) break; if (!tick(pad({}))) break; }
    } else if (op === "waitPlatformAt") {
      // A-3 · ["waitPlatformAt", entityId, col, tol?, timeout?] — CLOSED LOOP on
      // the sim's own entity position. Boarding a moving platform on a tick
      // count is brittle (the phase depends on every tick spent upstream);
      // waiting on where the platform actually IS is not.
      const [pid, col, tol = 0.6, timeout = 900] = args;
      const colOf = () => {
        const e = sim.world.entities.find((x) => x.id === pid);
        return e ? e.x / SUBS / TILE : null;
      };
      for (let i = 0; i < timeout; i++) {
        const c = colOf();
        if (c === null || Math.abs(c - col) <= tol) break;
        if (!tick(pad({}))) break;
      }
    } else if (op === "rideUntil") {
      // ["rideUntil", entityId, col, tol?, timeout?] — stand still on the
      // platform until IT has carried us to the column (also closed loop).
      const [pid, col, tol = 0.6, timeout = 900] = args;
      for (let i = 0; i < timeout; i++) {
        const e = sim.world.entities.find((x) => x.id === pid);
        if (!e || Math.abs(e.x / SUBS / TILE - col) <= tol) break;
        if (!tick(pad({}))) break;
      }
    }
    if (trace) console.log(`  after ${op}${JSON.stringify(args)}: cell ${JSON.stringify(cellOf(sim))} grounded=${sim.player.grounded} letters=${sim.lettersGot}`);
  }
  // pad out a short tail so late exit triggers (fresh landing on the door) fire
  for (let i = 0; i < 90 && tick(pad({})); i++);
  return { masks, exited, exitTo, sim, abilities };
};

// L0 · D10 · DIE PILOTEN LEBEN JETZT JE KAPITEL IN scripts/paint-pilots/.
// Der Aufruf nimmt `--chapter chNN` (Vorgabe ch01) und danach optional die
// Phasen-Ids. Ohne Piloten-Datei bricht der Lauf mit einer benannten Meldung ab
// — ein Kapitel ohne Piloten kann keine Beweis-Bänder haben, und das still zu
// überspringen wäre genau die Lüge, die ein Beweis-Band verhindern soll.

// die Phasen-Argumente sind alles, was KEINE Flagge ist
const rest = process.argv.slice(2).filter((a, i, all) => a !== "--chapter" && all[i - 1] !== "--chapter");
const phases = rest.length > 0 ? rest : Object.keys(PILOTS);
const proof = fs.existsSync(PROOF_PATH)
  ? JSON.parse(fs.readFileSync(PROOF_PATH, "utf8"))
  : { schema: PROOF_SCHEMA, level: level.id, phases: {} };

let allGreen = true;
for (const phaseId of phases) {
  const pilot = PILOTS[phaseId];
  if (!pilot) { console.error(`no pilot for ${phaseId}`); allGreen = false; continue; }
  console.log(`\n── recording ${phaseId} ──`);
  const rec = runPilot(phaseId, pilot.abilities, pilot.program, { trace: true });
  if (!rec.exited) {
    console.error(`✗ ${phaseId}: pilot did NOT reach the exit (${rec.masks.length} ticks) — final cell ${JSON.stringify(cellOf(rec.sim))}`);
    allGreen = false;
    continue;
  }
  const tape = { abilities: pilot.abilities, pads: encodePads(rec.masks) };
  // the honest half: verify OPEN-LOOP through the CI replayer before saving
  const verdict = replayPhaseTape(level, phaseId, tape);
  if (!verdict.exited) {
    console.error(`✗ ${phaseId}: closed-loop reached the exit but the OPEN-LOOP replay did not — nondeterminism, do not save`);
    allGreen = false;
    continue;
  }
  // PB-F2: a tape carries the WORLD it produced, not just the buttons. Stamped
  // from the open-loop replay, so what CI asserts is what the recorder saw.
  tape.expect = {
    lettersGot: verdict.world.lettersGot,
    lettersTotal: verdict.world.lettersTotal,
    exitTo: verdict.world.exitTo,
    cagesFreed: verdict.world.cagesFreed,
    guardianDown: verdict.world.guardianDown,
    tasksSolved: verdict.world.tasksSolved,
    redeemedPresent: verdict.world.redeemedPresent, // PK-R2 · R3-5
    classmatesAwake: verdict.world.classmatesAwake, // PK-R6 · D
    tipsGot: verdict.world.tipsGot, // PK-R3b · R3-16
    booksGot: verdict.world.booksGot,
    // R5-W5 · G4: how many uniform pieces the pilot really walked into. The
    // reachability MODEL already blesses each piece (`entity-reachable`), but a
    // model blesses a cell — this counts the ones a recorded run actually
    // touched, which is the difference between „a child could get there" and
    // „this input did". If a later lane moves a platform out from under a piece,
    // the number here is what turns red.
    clothGot: verdict.world.clothGot,
    scorePageShown: verdict.world.scorePageShown, // PK-R3b · M-B
    // PK-R6 · E · the flight fight's choreography (doc 44 §4 ch01 C4)
    guardianPathsFlown: verdict.world.guardianPathsFlown,
    guardianTelegraphs: verdict.world.guardianTelegraphs,
    guardianWindows: verdict.world.guardianWindows,
    guardianWroteLow: verdict.world.guardianWroteLow,
    guardianConsoled: verdict.world.guardianConsoled,
    guardianLanded: verdict.world.guardianLanded,
  };
  proof.phases[phaseId] = tape;
  console.log(`✓ ${phaseId}: exit → ${verdict.exitTo} in ${verdict.ticksUsed} ticks, ${verdict.tasksSolved} tasks auto-solved, runs=${tape.pads.length}, world=${JSON.stringify(tape.expect)}`);
}

fs.writeFileSync(PROOF_PATH, JSON.stringify(proof, null, 2) + "\n");
console.log(`\n${allGreen ? "ALL GREEN" : "FAILURES ABOVE"} — proof file: ${PROOF_PATH}`);
process.exit(allGreen ? 0 : 1);
