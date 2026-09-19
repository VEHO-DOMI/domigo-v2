import { describe, expect, it } from "vitest";
import { SCHOOL_START, SCHOOL_STATIONS, REQUIRED_STATIONS, MERLE_ROAM, availableStation, schoolComplete, schoolPath, schoolStep, directionBetween, validSchoolPosition } from "./school.ts";
describe("school investigation", () => {
  it("records a continuous input path from the door through every task back to the door", () => {
    let pos = SCHOOL_START;
    const solved: string[] = [];
    const tape: string[] = [];
    for (const station of [...REQUIRED_STATIONS, ...Object.keys(SCHOOL_STATIONS).filter((s) => s.startsWith("frei-"))]) {
      expect(availableStation(station, solved)).toBe(true);
      const path = schoolPath(pos, SCHOOL_STATIONS[station]!);
      expect(path).not.toBeNull();
      for (const cell of path!) {
        const dir = directionBetween(pos, cell);
        tape.push(dir);
        pos = schoolStep(pos, dir);
        expect(pos).toEqual(cell);
      }
      solved.push(station);
    }
    for (const cell of schoolPath(pos, SCHOOL_START)!) pos = schoolStep(pos, directionBetween(pos, cell));
    expect(pos).toEqual(SCHOOL_START);
    expect(schoolComplete(solved)).toBe(true);
    expect(tape.length).toBeGreaterThan(40);
  });
  it("cannot skip suspicion, evidence, alibi or note; optional tasks never gate the exit", () => {
    expect(availableStation("spur-1", [])).toBe(false);
    expect(availableStation("alibi", ["verdacht", "spur-1"])).toBe(false);
    expect(availableStation("zettel", ["verdacht", "alibi"])).toBe(false);
    expect(availableStation("other", REQUIRED_STATIONS)).toBe(false);
    for (const missing of REQUIRED_STATIONS) expect(schoolComplete(REQUIRED_STATIONS.filter((s) => s !== missing))).toBe(false);
    expect(schoolComplete(REQUIRED_STATIONS)).toBe(true);
  });
  it("blocks furniture and walls, sanitizes saves, and keeps Merle's entire roam loop walkable", () => {
    expect(schoolStep({ c: 8, r: 6 }, "down")).toEqual({ c: 8, r: 6 });
    expect(schoolStep({ c: 2, r: 10 }, "left")).toEqual({ c: 2, r: 10 });
    for (const raw of [null, {}, { c: -1, r: 2 }, { c: 3, r: 3 }, { c: 1.5, r: 2 }]) expect(validSchoolPosition(raw)).toEqual(SCHOOL_START);
    MERLE_ROAM.forEach((cell, i) => expect(schoolPath(cell, MERLE_ROAM[(i + 1) % MERLE_ROAM.length]!)).toHaveLength(1));
  });
});

it("keeps immutable asset URLs tied to actual image bytes, with twenty distinct poses", async () => {
  const { readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const { SCHOOL_ART, schoolArt } = await import("./school-art.ts");
  const poses = new Set<string>();
  for (const [name, stamp] of Object.entries(SCHOOL_ART)) {
    const bytes = readFileSync(new URL(`../../../apps/web/public/art/g2/school/${name}`, import.meta.url));
    const actual = createHash("md5").update(bytes).digest("hex");
    expect(actual.slice(0, 12), name).toBe(stamp);
    expect(schoolArt(name as keyof typeof SCHOOL_ART)).toContain(`?v=${stamp}`);
    if (name !== "classroom.png" && name !== "hub.png") poses.add(actual);
  }
  expect(poses.size).toBe(20);
});
