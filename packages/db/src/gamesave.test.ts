import { describe, expect, it } from "vitest";
import { gameSaveStateBytes, resolveGameSave, type GameSaveRow } from "./gamesave.ts";

const base: GameSaveRow = { gameMode: "game:g1", schemaVersion: 1, clientRev: 5, state: { zoneId: "g1.map.lost-pages.z01", pos: [3, 4] } };

describe("resolveGameSave (clientRev last-write-wins)", () => {
  it("no existing row → take incoming", () => {
    const inc = { gameMode: "game:g1", schemaVersion: 1, clientRev: 0, state: { a: 1 } };
    expect(resolveGameSave(null, inc)).toEqual(inc);
  });
  it("newer clientRev wins", () => {
    const inc = { gameMode: "game:g1", schemaVersion: 1, clientRev: 6, state: { pos: [9, 9] } };
    expect(resolveGameSave(base, inc)).toEqual(inc);
  });
  it("equal clientRev favors incoming (idempotent re-PUT)", () => {
    const inc = { gameMode: "game:g1", schemaVersion: 1, clientRev: 5, state: { pos: [1, 1] } };
    expect(resolveGameSave(base, inc)).toEqual(inc);
  });
  it("stale clientRev keeps the stored row (no clobber)", () => {
    const inc = { gameMode: "game:g1", schemaVersion: 1, clientRev: 4, state: { pos: [0, 0] } };
    expect(resolveGameSave(base, inc)).toBe(base);
  });
});

describe("gameSaveStateBytes", () => {
  it("measures the serialized UTF-8 size", () => {
    expect(gameSaveStateBytes({})).toBe(2); // "{}"
    expect(gameSaveStateBytes({ a: "x" })).toBe(JSON.stringify({ a: "x" }).length);
  });
});
