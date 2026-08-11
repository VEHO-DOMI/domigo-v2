// PB-T2 · THE PLAYABILITY LAW: no non-draft level ships without a green proof
// tape for EVERY phase — a recorded pad stream that the REAL engine (sim.ts)
// replays to the phase exit, in this suite, on every CI run. The reachability
// model (level.ts) is only the fast authoring guard; THIS is the proof.
// Recorder: node --experimental-strip-types scripts/record-paint-tape.mjs

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { POSE_VIOLATION_CAP, PROOF_SCHEMA, type ProofFile, replayChapterTapes, replayPhaseTape, worldAssertionErrors } from "./tape.ts";
import { allPhases, type PaintLevel } from "./level.ts";
import { Sim } from "./sim.ts";
import { IDLE_PAD, posePairErrors, spawnPlayer } from "./player.ts";

const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");

const levelFiles: string[] = [];
if (fs.existsSync(CONTENT)) {
  for (const story of fs.readdirSync(CONTENT)) {
    const paintDir = path.join(CONTENT, story, "paint");
    if (!fs.existsSync(paintDir)) continue;
    for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
      levelFiles.push(path.join(paintDir, f));
    }
  }
}

describe("proof tapes (the playability law)", () => {
  it("found at least one shipped paint level", () => {
    expect(levelFiles.length).toBeGreaterThan(0);
  });

  for (const lf of levelFiles) {
    const level = JSON.parse(fs.readFileSync(lf, "utf8")) as PaintLevel;
    const name = path.basename(lf);
    if (level.draft === true) continue; // drafts are exempt (level.ts law parity)

    const proofPath = lf.replace(".level.json", ".proof.json");

    it(`${name}: has a proof sidecar with a tape for every phase`, () => {
      expect(fs.existsSync(proofPath), `missing ${path.basename(proofPath)} — record it with scripts/record-paint-tape.mjs`).toBe(true);
      const proof = JSON.parse(fs.readFileSync(proofPath, "utf8")) as ProofFile;
      expect(proof.schema).toBe(PROOF_SCHEMA);
      for (const ph of allPhases(level)) {
        expect(proof.phases[ph.id], `phase ${ph.id} has no tape`).toBeDefined();
      }
    });

    if (!fs.existsSync(proofPath)) continue;
    const proof = JSON.parse(fs.readFileSync(proofPath, "utf8")) as ProofFile;

    for (const ph of allPhases(level)) {
      const tape = proof.phases[ph.id];
      if (!tape) continue;
      it(`${name} · ${ph.id}: the tape reaches the exit AND the world it promises`, () => {
        const res = replayPhaseTape(level, ph.id, tape);
        expect(res.exited, `tape ended after ${res.ticksUsed} ticks without the exit firing — the level changed; re-record`).toBe(true);
        // the exit must lead where the level says it leads (bonus timeout is
        // the sanctioned early return of the Kleckskammer)
        expect([ph.exit.to, "bonus-timeout"]).toContain(res.exitTo);
        // PB-F2 · THE WORLD ASSERTIONS: buttons reaching an exit is not proof
        // that the world did what it should. A tape carries the end-state it
        // must land in; a guardian that stops going down fails here, where the
        // pad stream alone stayed byte-identical and green.
        const drift = worldAssertionErrors(tape.expect, res.world);
        expect(drift, `world assertions failed for ${ph.id}:\n  ${drift.join("\n  ")}`).toEqual([]);
      });

      // R5-W1 · F1 · DAS POSE-EHRLICHKEITS-GESETZ, über jeden ausgelieferten
      // Tick. Kokis Replay fand die Lüge per Auge; ab hier findet sie das
      // Band. Der Andock-Tick war EINE Instanz — dieser Test bewacht die
      // Klasse, auch in den Phasen, an die niemand gedacht hat.
      it(`${name} · ${ph.id}: die gezeichnete Pose widerspricht nie dem Zustand`, () => {
        const res = replayPhaseTape(level, ph.id, tape);
        const lies = res.poseViolations
          .map((v) => `  Tick ${v.tick}: ${v.errors.join(" · ")}`)
          .join("\n");
        expect(
          res.poseViolations,
          `${res.poseViolations.length} unehrliche Ticks in ${ph.id} (max. ${POSE_VIOLATION_CAP} gesammelt):\n${lies}`,
        ).toEqual([]);
      });
    }

    // PB-R1 · R3-1 · THE CHAPTER LAW. Every phase above is replayed with a FRESH
    // shell, which is not how a chapter is played: PaintGame's once-per-chapter
    // cards remember across phase mounts. Replaying the whole chapter through
    // ONE shell is what caught the ch01 freeze — the second cage hint latched
    // the world shut in p3 and the arena while every per-phase tape stayed green.
    it(`${name}: the whole chapter replays through ONE shell`, () => {
      const order = allPhases(level).map((p) => p.id);
      for (const { phaseId, result } of replayChapterTapes(level, proof.phases, order)) {
        expect(
          result.exited,
          `phase ${phaseId} never reached its exit after ${result.ticksUsed} ticks when the chapter's once-per-chapter cards had ALREADY been shown — a card the shell declines must still resume the world (PB-R1 · R3-1)`,
        ).toBe(true);
      }
    });

    // PB-R1 · R3-3 · THE ABILITY LADDER IS EARNED, NOT DECLARED. Each tape names
    // the abilities its phase STARTS with — and nothing checked that anyone had
    // earned them. ch01's set declared `punch` at p3 while p2's pilot walked
    // straight past Fibel and out of the phase: R3-3's soft-lock, written into
    // the proof data itself, invisible because every phase replayed alone.
    it(`${name}: every phase enters with the abilities the chapter actually granted`, () => {
      const granted = new Set(
        allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "powerup").map((e) => String(e.params?.grants ?? ""))),
      );
      const held = new Set<string>(level.abilities.filter((a) => !granted.has(a)));
      // the exit chain only: the bonus room is entered mid-phase, not in sequence
      for (const ph of [...level.phases, ...(level.arena ? [level.arena] : [])]) {
        const tape = proof.phases[ph.id];
        if (!tape) continue;
        expect(
          [...tape.abilities].sort(),
          `${ph.id}'s tape enters holding abilities the chapter has not handed over yet — either the pilot must collect the grant, or the tape is lying about the ladder`,
        ).toEqual([...held].sort());
        for (const g of replayPhaseTape(level, ph.id, tape).grantsPicked) held.add(g);
      }
    });

    // PB-R1 · R3-3 · THE RUNTIME HALF. Proven in BOTH directions in one test, so
    // it can never go vacuously green: standing on the exit with the grant still
    // lying in the level must NOT exit, and the identical walk with the grant
    // taken MUST. Every other gate on the exit (the door's word, the guardian) is
    // cleared first, so only the essential gate can be the difference.
    it(`${name}: an uncollected essential grant locks its phase exit — and only that`, () => {
      for (const ph of allPhases(level)) {
        const essentials = ph.entities.filter((e) => e.role === "powerup" && e.params?.essential === true);
        if (essentials.length === 0) continue;
        if (ph.entities.some((e) => e.role === "guardian")) continue; // that exit is the fight's to open

        const walkOntoExit = (takeGrants: boolean): boolean => {
          const sim = new Sim({ level, phaseId: ph.id, grantedAbilities: () => [...level.abilities], freedCageIds: () => [] });
          for (const d of ph.entities.filter((e) => e.role === "door.trigger" && e.params?.kind === "exit")) {
            sim.solveTask({ type: "door", id: d.id, kind: "exit", skin: d.skin });
          }
          if (takeGrants) for (const e of sim.world.entities) if (e.role === "powerup") e.redeemed = true;
          sim.warp(sim.exitCell.c, sim.exitCell.r);
          for (let t = 0; t < 240; t++) {
            for (const ev of sim.step({ ...IDLE_PAD })) if (ev.type === "exit") return true;
          }
          return false;
        };

        const ids = essentials.map((e) => e.id).join(", ");
        expect(walkOntoExit(false), `${ph.id}: the exit opened with ${ids} still uncollected — that is the soft-lock R3-3 exists to stop`).toBe(false);
        expect(walkOntoExit(true), `${ph.id}: the exit stayed shut even with ${ids} collected — the gate blocks more than it should`).toBe(true);
      }
    });

    it(`${name}: a tampered tape fails (the gate can turn red)`, () => {
      const firstPhase = allPhases(level)[0];
      const tape = firstPhase ? proof.phases[firstPhase.id] : undefined;
      if (!firstPhase || !tape) return;
      const truncated = { ...tape, pads: tape.pads.slice(0, Math.floor(tape.pads.length / 3)) };
      const res = replayPhaseTape(level, firstPhase.id, truncated);
      expect(res.exited).toBe(false);
    });
  }
});

// R5-W1 · F1 · TAMPER: der Pose-Wächter selbst. Eine Fegung, die auf
// ausgeliefertem Inhalt grün ist, beweist noch nicht, dass sie überhaupt rot
// werden KANN — genau so wäre die Klasse still zurückgekommen. Jede verbotene
// Paarung wird hier von Hand gebaut und muss gemeldet werden, jede erlaubte
// muss schweigen.
describe("R5-F1 · der Pose-Wächter kann rot werden (TAMPER)", () => {
  const st = (over: Partial<ReturnType<typeof spawnPlayer>>): ReturnType<typeof spawnPlayer> =>
    ({ ...spawnPlayer(32, 176), ...over });

  const ILLEGAL = [
    ["Boden + Fall (Kokis Andock-Tick)", st({ grounded: true, pose: "fall" })],
    ["Boden + Sprung", st({ grounded: true, pose: "jump" })],
    ["Boden + Schweben", st({ grounded: true, pose: "hover" })],
    ["Boden + Kante", st({ grounded: true, pose: "hang", hangAt: { c: 1, r: 1 } })],
    ["Boden + Ranke", st({ grounded: true, pose: "vine", climbing: true })],
    ["Luft ohne Fenster + Stand (D-10)", st({ grounded: false, poseGrace: 0, pose: "stand" })],
    ["Luft ohne Fenster + Gehen", st({ grounded: false, poseGrace: 0, pose: "walk" })],
    ["Luft ohne Fenster + Laufen", st({ grounded: false, poseGrace: 0, pose: "run" })],
    ["Luft ohne Fenster + Aufladen", st({ grounded: false, poseGrace: 0, pose: "charge" })],
    ["Kante ohne Kante", st({ grounded: false, pose: "hang", hangAt: null })],
    ["Ring ohne Ring", st({ grounded: false, pose: "swing", swing: null })],
    ["Ranke ohne Ranke", st({ grounded: false, pose: "vine", climbing: false })],
  ] as const;

  const LEGAL = [
    ["Boden + Stand", st({ grounded: true, pose: "stand" })],
    ["Boden + Laufen", st({ grounded: true, pose: "run" })],
    ["Luft + Fall", st({ grounded: false, poseGrace: 0, pose: "fall" })],
    ["Luft IM Fenster + Gehen (das gewollte A1-Gnadenbild)", st({ grounded: false, poseGrace: 4, pose: "walk" })],
    ["Boden + Treffer (zurückgestoßen und schon wieder gelandet)", st({ grounded: true, pose: "hit" })],
    ["Luft + Treffer", st({ grounded: false, poseGrace: 0, pose: "hit" })],
    ["hängend an einer Kante", st({ grounded: false, pose: "hang", hangAt: { c: 2, r: 3 } })],
  ] as const;

  for (const [label, state] of ILLEGAL) {
    it(`meldet: ${label}`, () => {
      expect(posePairErrors(state).length, `${label} muss gemeldet werden`).toBeGreaterThan(0);
    });
  }

  for (const [label, state] of LEGAL) {
    it(`schweigt bei: ${label}`, () => {
      expect(posePairErrors(state), `${label} ist ehrlich und darf nicht gemeldet werden`).toEqual([]);
    });
  }
});
