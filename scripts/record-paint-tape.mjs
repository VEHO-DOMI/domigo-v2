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
  // p1 „Die Eingangshalle" (R5-P1, Dossier p1.md §10): GESTRANDET-HOCH.
  // Trail SCHOOLBAG 9/9 in drei Läufen: S/C/H im Bank-Lauf (der Bogen über
  // der 2-Spalten-Lücke zahlt C im Flug) · O/O/L in der Brett-Lektion (Δr2-Tap
  // auf die Stufe, dann der deklarierte 48-px-HALTE-Sprung) · B/A/G in der
  // Spind-Leiter. Die Keller-Grube wird per Doppel-Tap gequert (B zahlt die
  // Landung). Läufer-/Hüpfer-Kontakt = Karte + iframes, ehrlich im Band.
  p1: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 4], ["settle"],
      ["jump", { dir: "right", hold: 6 }], ["settle"], // über den Bücherstapel (erster Sprung)
      ["walkTo", 9], ["settle"],
      ["jump", { dir: "right", hold: 6 }], ["settle"], // Bank-Bogen 1 → S, C im Flug
      ["jump", { dir: "right", hold: 6 }], ["settle"], // Bank-Bogen 2 → H
      ["walkTo", 27], ["settle"], // der Läufer-Flur (Band c20–28)
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // AUF die Stufe → O
      ["jump", { dir: "right", hold: 26, steer: 12 }], ["settle"], // HALTE aufs Brett-Podest → O
      ["walkTo", 33], ["settle"], // → L
      ["walkTo", 38], ["settle"], // runter zum Krakel-Checkpoint
      ["walkTo", 39], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // Lücke 1 → Steg
      ["jump", { dir: "right", hold: 6, steer: 12 }], ["settle"], // Lücke 2 → B zahlt die Landung
      ["walkTo", 50], ["settle"], // durchs Hüpfer-Band
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf die Truhe → A
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // über c53 aufs Spind-Top → G
      ["hold", { right: true }, 30], ["settle"], // runter auf den Hallenboden
      ["walkTo", 61], ["settle"], ["wait", 30], // die Tür „Come in!"
      ["walkTo", 62], ["settle"], ["wait", 60],
    ],
  },
  // p2 „Das Klassenzimmer bei Nacht" (R5-P1, Dossier p2.md §10): PROJECTOR
  // 9/9 — P/R/O treppauf (Halte an Stufe 3) · Arch-TAP (Halte bonkt am
  // Sturz!) · J im Loch-Bogen, E/C im Korridor, drei Schwarm-Karten ehrlich ·
  // Kavernen-Tritt → T in der Kaverne · O/R im Terrassen-Abstieg · MERLE
  // (Pult-Anlauf 2×Δ48) — die R6-Zeremonie bleibt auf Band · Sims-Tap → X.
  p2: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 3], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // auf Bank/Hürden-Kamm (c4–7)
      ["walkTo", 11], ["settle"], // hinab in den Pen-Hof
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf Stufe 1 → P
      ["walkTo", 14], ["settle"], // die Ost-Hürde IST Teil der Treppe
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf Stufe 2 → R
      ["jump", { dir: "right", hold: 26, steer: 8 }], ["settle"], // der Bonk-Scheitel zahlt O (deterministisch)
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // AUF Stufe 3 (gemessen: c19.6)
      ["jump", { dir: "right", hold: 6, steer: 10 }], ["settle"], // Tap über den Absatz auf die Schrankwand-Krone (gemessen)
      ["runJump", 31.2, 6], ["settle"], // ANLAUF-Loch-Bogen (Momentum-Belohnung) → J im Flug; Schwarm 1 zahlt unterwegs
      ["walkTo", 53], ["settle"], // E, C im Lauf; Schwarm 2 zahlt
      ["hold", { right: true }, 20], ["settle"], // auf den Kavernen-Tritt (c54)
      ["hold", { right: true }, 20], ["settle"], // in die Kaverne → T; Schwarm 3 zahlt
      ["hold", { right: true }, 24], ["settle"], // Terrasse 2 → O
      ["hold", { right: true }, 24], ["settle"], // Terrasse 3 → R
      ["hold", { right: true }, 24], ["settle"], // auf den Boden
      ["walkTo", 60], ["settle"],
      ["jump", { dir: "right", hold: 26, steer: 8 }], ["settle"], // HALTE auf die Klecks-/Pult-Stufe
      ["jump", { dir: "right", hold: 26, steer: 8 }], ["settle"], // HALTE aufs Pult-Deck
      ["walkTo", 64], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30], // MERLE: ↑ öffnet, sechs Runden laufen
      ["walkTo", 66], ["settle"],
      ["hold", { right: true }, 24], ["settle"], // durch die Gasse c67 auf den Boden
      ["walkTo", 68], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // der Sims-Tap
      ["walkTo", 69], ["settle"], ["wait", 60], // Fenster „Open!" + X
    ],
  },
  // p3 „Der Schulhof-Garten" (R5-P1, Dossier ch01-dossiers-v2/p3.md §10):
  // das terrassierte V. Die Rutsche zahlt G/L/U im Tempo (Magnet), die
  // FAHRT zahlt E/S/T (Deck-Fußlinie 282, Buchstaben r16 → dy 8), der
  // Anstieg zahlt I/C/K im Lauf-Magneten (je dy 14). Tape-Pflicht laut
  // Dossier: 9/9 — Schaukel und Bonus-Buch sind ausdrücklich tape-frei
  // (H2 beweist sie). Der Block wird UNTEN durchquert (Köder-Mut am
  // Stampfer vorbei: Querung 24 t < Reifezeit ~37 t — deshalb dort KEIN
  // settle). Der Pier-Abtritt ist der A4-Fang: WARTEN bis die Fähre am
  // West-Umkehrpunkt steht (A-3, closed loop), dann im GEHEN abtreten —
  // Attach bei Tick ~5 mit vy 2 ≤ Toleranz 4.
  p3: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 9], ["settle"], // to the lip of the chalk slide
      ["hold", { right: true }, 140], ["settle"], // the slide run pays G, L, U; ends in the Senke
      ["walkTo", 26], ["settle"], // the Krakel checkpoint
      ["jump", { dir: "right", hold: 10 }], ["settle"], // measured: this arc lands ON the pier (~c29.8)
      ["walkTo", 29], ["settle"], // hold the pier lip
      ["waitPlatformAt", "p3-ruler", 30.5, 0.5], // ferry at its WEST turnaround (home)
      ["hold", { right: true }, 16], // the Pier-Abtritt: walk off, attach FALLING (A4)
      ["rideUntil", "p3-ruler", 39.3, 0.4], // the ride pays E, S, T
      ["hold", { right: true }, 34], ["settle"], // off the east edge onto T1
      ["walkTo", 49], // I by magnet at c42, then THROUGH the Stampfer zone without stopping
      ["jump", { dir: "right", hold: 18 }], ["settle"], // up to T2
      ["walkTo", 55], ["settle"], // C by magnet at c52
      ["jump", { dir: "right", hold: 18 }], ["settle"], // up to T3
      ["walkTo", 59], ["settle"], // K by magnet at c58
      ["jump", { dir: "right", hold: 8 }], ["settle"], // onto the Tor-Sockel
      ["walkTo", 60], ["settle"], ["wait", 60],
    ],
  },
  // p4 „Die Tafel-Bühne" (R5-P1, arena.md §10): faustlos ausweichen von
  // LINKS der Bühne; die Podeste sind jetzt VOLL-Säulen c5–7/c28–30 (Δr2,
  // je zu überspringen). NEU: Käfig #5 (31,15) — VOR dem Sieg ist ↑ gegated
  // (cagesGated-Toast), NACH dem Sieg zahlt die Rettung; beides läuft hier
  // in Reihenfolge aufs Band.
  p4: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 3], ["settle"],
      ["paceUntilDown", 40],
      ["walkTo", 4], ["settle"],
      ["jump", { dir: "right", hold: 14 }], ["settle"], // über das West-Podest
      ["walkTo", 26], ["settle"],
      ["jump", { dir: "right", hold: 14, steer: 10 }], ["settle"], // über das Ost-Podest, VOR dem Käfig landen
      ["walkTo", 31], ["settle"],
      ["hold", { up: true }, 8], ["wait", 30], // Käfig #5: das Klassenfoto (nach dem Sieg entsperrt)
      ["walkTo", 33], ["settle"], ["wait", 40],
    ],
  },
  // p9 „Die Kleckskammer" (R5-P1, p9.md §10): DIE WELLE — Tape A, der
  // PERFEKT-Lauf: 12/12 (SCHOOLTHINGS) tap-traversierbar vor Uhr-Ablauf,
  // dann ✕. (Tape B/Timeout + Rückkehr-Band: deklarierte Schuld, hängt am
  // offenen D-5-Koki-Tor + Proof-Schema — DEBT_REGISTER.)
  p9: {
    abilities: ["jump", "run"],
    program: [
      ["walkTo", 10], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // auf A → S im Stand
      ["walkTo", 12], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → C → auf B
      ["walkTo", 15], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → H → auf den KAMM
      ["walkTo", 21], ["settle"], // O, O im Kamm-Lauf
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → L, T im Fall → auf E
      ["walkTo", 25], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → H, I im Fall → auf F
      ["walkTo", 30], ["settle"],
      ["jump", { dir: "right", hold: 6, steer: 8 }], ["settle"], // Bogen → N, G im Fall → Boden
      ["walkTo", 37], ["settle"], // → S
      ["walkTo", 42], ["settle"], ["wait", 40], // ✕
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
