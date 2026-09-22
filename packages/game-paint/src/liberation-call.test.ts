// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { liberationCallMotion, liberationCallTarget } from "./liberation-call.ts";
import { washAlphaFor, COLOUR_FLOOD_TICKS } from "./anim.ts";
import { spawnEntities } from "./entities.ts";
import { SUBS } from "./paint.ts";

const world = () => spawnEntities([
  { id: "near", role: "drained", skin: "obj_book", c: 4, r: 5, tier: "E", params: { fullDrain: true } },
  { id: "far", role: "drained", skin: "obj_book", c: 6, r: 5, tier: "E", params: { fullDrain: true } },
], []);
describe("B1 shared world/card colour and call", () => {
  it("keeps named objects fully grey and lets colour arrive before peace", () => {
    const e = world().entities[0]!;
    e.liberation = "named";
    expect(washAlphaFor(e)).toBe(1);
    e.liberation = "coloured"; e.colourTick = 0;
    expect(washAlphaFor(e)).toBe(1);
    e.colourTick = COLOUR_FLOOD_TICKS / 2;
    expect(washAlphaFor(e)).toBe(.5);
    expect(washAlphaFor(e, true)).toBe(0);
    e.colourTick = COLOUR_FLOOD_TICKS;
    expect(washAlphaFor(e)).toBe(0);
    e.liberation = "peaceful"; e.redeemed = true; e.freedTick = 0;
    expect(washAlphaFor(e)).toBe(0); // final joy never drains it a second time
  });
  it("leaves other chapters and lock materials alone", () => {
    expect(washAlphaFor({ role: "drained", redeemed: false, timer: 0 })).toBe(.72);
    expect(washAlphaFor({ role: "cage", redeemed: false, timer: 0, params: { fullDrain: true, shellArt: "device_locker" } })).toBe(0);
  });
  it("emphasizes only one nearby unfreed target", () => {
    const w = world(), e = w.entities[0]!;
    expect(liberationCallTarget(w.entities, e.x, e.y)).toBe("near");
    e.redeemed = true;
    expect(liberationCallTarget(w.entities, e.x, e.y)).toBe("far");
    w.entities[1]!.hidden = true;
    expect(liberationCallTarget(w.entities, e.x, e.y)).toBeNull();
    expect(liberationCallTarget(world().entities, e.x + 1000 * SUBS, e.y)).toBeNull();
  });
  it("strengthens the passed book with no movement under reduced motion", () => {
    const quiet = liberationCallMotion(17, false, false), strong = liberationCallMotion(17, true, false);
    expect(Math.abs(strong.dy)).toBeGreaterThan(Math.abs(quiet.dy));
    expect(strong.arrowSize).toBeGreaterThan(quiet.arrowSize);
    expect(liberationCallMotion(17, true, true)).toMatchObject({ dx: 0, dy: 0, rot: 0, arrowSize: 17 });
  });
});
