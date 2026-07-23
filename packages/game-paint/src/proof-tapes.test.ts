// PB-T2 · THE PLAYABILITY LAW: no non-draft level ships without a green proof
// tape for EVERY phase — a recorded pad stream that the REAL engine (sim.ts)
// replays to the phase exit, in this suite, on every CI run. The reachability
// model (level.ts) is only the fast authoring guard; THIS is the proof.
// Recorder: node --experimental-strip-types scripts/record-paint-tape.mjs

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PROOF_SCHEMA, type ProofFile, replayPhaseTape } from "./tape.ts";
import { allPhases, type PaintLevel } from "./level.ts";

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
      it(`${name} · ${ph.id}: the tape reaches the exit through the real engine`, () => {
        const res = replayPhaseTape(level, ph.id, tape);
        expect(res.exited, `tape ended after ${res.ticksUsed} ticks without the exit firing — the level changed; re-record`).toBe(true);
        // the exit must lead where the level says it leads (bonus timeout is
        // the sanctioned early return of the Kleckskammer)
        expect([ph.exit.to, "bonus-timeout"]).toContain(res.exitTo);
      });
    }

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
