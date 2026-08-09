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

const LEVEL_PATH = "content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json";
const PROOF_PATH = LEVEL_PATH.replace(".level.json", ".proof.json");
const level = JSON.parse(fs.readFileSync(path.resolve(LEVEL_PATH), "utf8"));

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

  const handle = (evs) => {
    for (const ev of evs) {
      if (ev.type === "task") handle(sim.solveTask(ev.req.ctx));
      else if (ev.type === "powerup") { if (!abilities.includes(ev.grants)) abilities.push(ev.grants); sim.setOverlay(false); }
      else if (ev.type === "cageFreed") { freed.push(ev.id); sim.setOverlay(false); }
      else if (ev.type === "guardianDown") sim.setOverlay(false);
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
      // ["jump", {dir:"right"|"left"|null, hold: ticks}] — hold-jump + steer
      const dir = args[0]?.dir ?? null;
      const hold = args[0]?.hold ?? 14;
      const steer = dir === "right" ? { right: true } : dir === "left" ? { left: true } : {};
      for (let i = 0; i < hold && tick(pad({ ...steer, jump: true })); i++);
      for (let i = 0; i < 40; i++) { if (sim.player.grounded || !tick(pad(steer))) break; }
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
      const [half, timeout = 6000] = args;
      for (let i = 0; i < timeout; i++) {
        if (sim.guardianDefeated) break;
        const right = Math.floor(i / half) % 2 === 0;
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

// ── the pilots (grids-v2 layouts; tuned against the printed traces) ─────────
const PILOTS = {
  // p1 „Die Eingangshalle": the hall floor runs flat from the spawn to the
  // exit; the one real obstacle is the ink gap at c41-42 (row 18 opens, ink
  // beneath at rows 20-21). Jump it, walk up the little ramp at c44, done.
  p1: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 20], ["settle"],
      ["walkTo", 34], ["settle"],
      ["walkTo", 39], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // over the ink gap c41-42
      ["walkTo", 52], ["settle"],
      ["walkTo", 61], ["settle"], ["wait", 40],
    ],
  },
  // p2 „Das Klassenzimmer bei Nacht": the classroom floor is flat the whole
  // way; the obstacles are the nib spikes at c38-39 and the ink pool at
  // c50-53 (row 20 opens). Both are cleared by jumps from the floor.
  //
  // PB-R1 · R3-3: the pilot now CLIMBS TO FIBEL first. The old floor-level run
  // walked straight past the fist and out of the phase — and p3's tape then
  // declared `punch` at entry, an ability nobody in the proof set had earned.
  // That gap was exactly R3-3's soft-lock, sitting inside the proof data where
  // per-phase replays could never see it. The route up is the ledge staircase
  // on the left: floor → r17 (c10-13) → r14 (c15-18) → r11 (c20-23) → the long
  // r9 shelf (c24-34) where Fibel, cage3 and the seal door live.
  p2: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 7], ["settle"], // BESIDE the first ledge, never under it
      ["jump", { dir: "right", hold: 16 }], ["settle"], // up onto the r17 ledge
      ["walkTo", 12], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // up onto the r14 ledge
      ["walkTo", 17], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // up onto the r11 ledge
      ["walkTo", 22], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // up onto the r9 shelf
      ["walkTo", 31], ["settle"], // FIBEL — the fist (essential grant)
      ["walkTo", 34], ["settle"], // on past the seal door at the shelf's end
      ["walkTo", 36], ["settle"], // step off; fall back to the classroom floor
      ["jump", { dir: "right", hold: 16 }], ["settle"], // over the nib spikes c38-39
      ["walkTo", 48], ["settle"],
      ["jump", { dir: "right", hold: 18 }], ["settle"], // over the ink pool c50-53
      // PK-R6 · D · MERLE'S CAGE (c60). The pilot used to walk straight past
      // the one cage every child must open — `cagesFreed: 0` on every tape in
      // the chapter, which is how a rescue can be rebuilt from one card into a
      // six-round ceremony with the whole proof set staying green and blind to
      // it. It stops here and presses ↑: the cage bursts, Merle steps out
      // ghost-pale, and the replay shell answers her six rounds exactly as it
      // answers any other card. The tape's `tasksSolved` and `cagesFreed` are
      // what then assert the sequence ran.
      ["walkTo", 60], ["settle"],
      ["hold", { up: true }, 8], // one rising edge — the chapter's own verb
      ["wait", 30],
      ["walkTo", 62], ["settle"],
      ["walkTo", 68], ["settle"], ["wait", 40],
    ],
  },
  // p3 „Der Schulhof-Garten": RIDE THE SLIDE (the z run from c10,r15 down to
  // c15,r20 — expect ~6 px/t on the descent, not the 2.25 walk), then the ink
  // pond at c30-40 which is crossed on the ruler platform (p3-ruler sweeps
  // c33→c39 at r17). Boarding is CLOSED LOOP on the ruler's own position
  // (A-3), never a tick count — the platform's phase depends on every tick
  // spent upstream, so a counted wait would be brittle by construction.
  p3: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 9], ["settle"], // to the lip of the chalk slide
      ["hold", { right: true }, 90], ["settle"], // ride it down to c15,r20
      ["walkTo", 29], ["settle"], // along the yard floor to the pond edge
      ["waitPlatformAt", "p3-ruler", 33.0, 0.5], // let the ruler come to us
      ["jump", { dir: "right", hold: 18 }], ["settle"], // board it
      ["rideUntil", "p3-ruler", 38.5, 0.5], // ride across the ink
      ["jump", { dir: "right", hold: 18 }], ["settle"], // off onto the far bank
      ["walkTo", 52], ["settle"],
      ["walkTo", 60], ["settle"], ["wait", 60],
    ],
  },
  // p4 „Die Tafel-Bühne": the guardian fight, FIST-LESS (PK-R6 · C2). The old
  // pilot tapped the fist to deflect chalk back at the Tafel; ch01 grants no
  // fist any more (doc 44 §4), so the pilot does what the chapter now asks of
  // a child — it keeps MOVING. Every piece of chalk that lands on the boards
  // instead of on the hero is a dodge, and three of them over-reach her into
  // the counter-window (entities.DODGES_PER_WINDOW). Three knots, three
  // windows, then the exit sign at (33,15).
  // NOTE the two chalk-crate podiums (row 14, c5-7 and c25-27): they are only
  // one tile high, but the hero is ~2 tiles, so at floor level they block the
  // HEAD — each has to be jumped, not walked past.
  p4: {
    abilities: ["jump", "run"],
    program: [
      // Dodge from the LEFT of the stage, not from under her. Chalk aimed at a
      // hero standing at her feet arrives before it can fall, so it lands on
      // the CHILD (an encounter) instead of on the boards — pacing at c15 next
      // to a Tafel at c17 produced zero dodges and a fight that never opened.
      // Distance is what turns a throw into a dodge, which is the lesson the
      // chapter is teaching with no fist to answer back.
      ["walkTo", 3], ["settle"],
      ["paceUntilDown", 40],
      ["walkTo", 4], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // over the left podium
      ["walkTo", 24], ["settle"],
      ["jump", { dir: "right", hold: 16 }], ["settle"], // over the right podium
      ["walkTo", 33], ["settle"], ["wait", 40],
    ],
  },
  // p9 „Die Kleckskammer": the bonus room — the tape proves the room itself
  // is traversable to its own exit (letters are the timed bonus, not the path)
  p9: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 42], ["settle"], ["wait", 40],
    ],
  },
};

const phases = process.argv.slice(2).length > 0 ? process.argv.slice(2) : Object.keys(PILOTS);
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
    scorePageShown: verdict.world.scorePageShown, // PK-R3b · M-B
    // PK-R6 · E · the flight fight's choreography (doc 44 §4 ch01 C4)
    guardianPathsFlown: verdict.world.guardianPathsFlown,
    guardianTelegraphs: verdict.world.guardianTelegraphs,
    guardianWindows: verdict.world.guardianWindows,
    guardianWroteLow: verdict.world.guardianWroteLow,
    guardianConsoled: verdict.world.guardianConsoled,
  };
  proof.phases[phaseId] = tape;
  console.log(`✓ ${phaseId}: exit → ${verdict.exitTo} in ${verdict.ticksUsed} ticks, ${verdict.tasksSolved} tasks auto-solved, runs=${tape.pads.length}, world=${JSON.stringify(tape.expect)}`);
}

fs.writeFileSync(PROOF_PATH, JSON.stringify(proof, null, 2) + "\n");
console.log(`\n${allGreen ? "ALL GREEN" : "FAILURES ABOVE"} — proof file: ${PROOF_PATH}`);
process.exit(allGreen ? 0 : 1);
