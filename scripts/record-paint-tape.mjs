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
    } else if (op === "settle") {
      for (let i = 0; i < 240; i++) { if (sim.player.grounded && Math.abs(sim.player.vx) < 8) break; if (!tick(pad({}))) break; }
    }
    if (trace) console.log(`  after ${op}${JSON.stringify(args)}: cell ${JSON.stringify(cellOf(sim))} grounded=${sim.player.grounded} letters=${sim.lettersGot}`);
  }
  // pad out a short tail so late exit triggers (fresh landing on the door) fire
  for (let i = 0; i < 90 && tick(pad({})); i++);
  return { masks, exited, exitTo, sim, abilities };
};

// ── the pilots (tuned against the printed traces) ────────────────────────────
const PILOTS = {
  // p1 „Vor dem Schulhaus": meadow left→right, plateau, pit with the carved
  // staircase, right block, exit door at (61,17)
  p1: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 20], ["settle", 0],
      ["walkTo", 29], ["jump", { dir: "right", hold: 14 }], ["settle"],
      ["walkTo", 36], ["settle"], // up the carved staircase
      ["jump", { dir: "right", hold: 14 }], ["settle"], // hop onto the block
      ["walkTo", 45], ["jump", { dir: "right", hold: 14 }], ["settle"],
      ["walkTo", 52], ["jump", { dir: "right", hold: 14 }], ["settle"],
      ["walkTo", 61], ["settle"], ["wait", 30],
    ],
  },
  // p2 „Das Klassenzimmer bei Nacht": desk staircase up-left to FIBEL (the
  // fist grant), back down, over the nib spikes + the paper platform across
  // the ink pool, desk hop, exit at (70,19)
  p2: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 9], ["jump", { dir: "right", hold: 14 }], ["settle"], // onto desk r17
      ["walkTo", 12], ["jump", { dir: "right", hold: 14 }], ["settle"], // r14 c16-22
      ["walkTo", 19], ["jump", { dir: "right", hold: 14 }], ["settle"], // r11 c24-30
      ["walkTo", 28], ["settle"], ["wait", 20], // FIBEL grant at (28,10)
      ["walkTo", 30], ["hold", { right: true }, 30], ["settle"], // drop off right
      ["walkTo", 24], ["settle"],
      ["walkTo", 25], ["jump", { dir: "right", hold: 14 }], ["settle"], // over the nib row
      ["jump", { dir: "right", hold: 14 }], ["settle"],
      ["walkTo", 37], ["jump", { dir: "right", hold: 14 }], ["settle"], // onto the paper platform r16
      ["walkTo", 44], ["hold", { right: true }, 40], ["settle"], // across + drop past the pool
      ["walkTo", 48], ["jump", { dir: "right", hold: 14 }], ["settle"], // desk c46-47
      ["walkTo", 52], ["jump", { dir: "right", hold: 14 }], ["settle"], // desk c50-56
      ["walkTo", 56], ["hold", { right: true }, 30], ["settle"], // drop off
      ["walkTo", 70], ["settle"], ["wait", 30],
    ],
  },
  // p3 „Der Schulhof-Garten": ice run, down the ramp, the one-way chain over
  // the ink pit (r15 → r13 → r15), onto the right block, drop into the notch
  // to the exit door at (62,21)
  p3: {
    abilities: ["jump", "run", "punch"],
    program: [
      ["walkTo", 8], ["jump", { dir: "right", hold: 14 }], ["settle"], // onto the ice ledge
      ["walkTo", 19], ["settle"], // stop BEFORE the ledge lip
      ["jump", { dir: "right", hold: 16 }], ["settle"], // momentum jump → one-way r15 c24-28
      ["walkTo", 27], ["jump", { dir: "right", hold: 14 }], ["settle"], // → one-way r13 c31-35
      ["walkTo", 34], ["jump", { dir: "right", hold: 10 }], ["settle"], // → one-way r15 c38-42
      ["walkTo", 41], ["jump", { dir: "right", hold: 14 }], ["settle"], // → the right block r17
      ["walkTo", 55], ["settle"],
      ["jump", { dir: "right", hold: 10 }], ["settle"], // up onto the shelf roof
      ["walkTo", 60], ["settle"],
      ["hold", { right: true }, 60], ["settle"], // through the drop-slot into the notch
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
  // p4 „Die Tafel-Bühne": the guardian fight — stand mid-arena, tap the fist
  // on a rhythm to deflect chalk; staggers open the counter-window tasks
  // (auto-solved), three knots untie, the exit sign appears at (33,15)
  p4: {
    abilities: ["jump", "run", "punch"],
    program: [
      ["walkTo", 17], ["settle"],
      ["punchEvery", 12, 2400],
      ["punchEvery", 9, 2400],
      ["walkTo", 33], ["settle"], ["wait", 40],
    ],
  },
  // p9 „Die Kleckskammer": the bonus room — the tape proves the room itself
  // is traversable to its own exit (letters are the timed bonus, not the path)
  p9: {
    abilities: ["jump", "run", "punch"],
    program: [
      ["walkTo", 43], ["settle"], ["wait", 30],
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
  proof.phases[phaseId] = tape;
  console.log(`✓ ${phaseId}: exit → ${verdict.exitTo} in ${verdict.ticksUsed} ticks, ${verdict.tasksSolved} tasks auto-solved, runs=${tape.pads.length}`);
}

fs.writeFileSync(PROOF_PATH, JSON.stringify(proof, null, 2) + "\n");
console.log(`\n${allGreen ? "ALL GREEN" : "FAILURES ABOVE"} — proof file: ${PROOF_PATH}`);
process.exit(allGreen ? 0 : 1);
