// PK-R6 · C · THE TIMER POLICY, asserted (doc 44 §2.9, Koki's Decision ④).
//
// The policy is a MAP now precisely so it can be stated and checked in one
// place — but a map with no test is still a rule with one reader. These lock
// the four sentences the decision actually contains, so a future „just add a
// clock here" has to argue with a red test rather than with a comment.
import { describe, expect, it } from "vitest";
import { CALM_DE, CALM_KINDS, TIMED_USES, URGENCY_DE, clockMsFor, timerClassFor } from "./timer.ts";

const RING = 45_000;

describe("the timer policy (doc 44 §2.9)", () => {
  it("times the two pools where urgency IS the fiction, and nothing else", () => {
    expect([...TIMED_USES].sort()).toEqual(["boss", "quickfire"]);
    expect(timerClassFor("quickfire", "choice")).toBe("timed");
    expect(timerClassFor("boss", "mistake")).toBe("timed");
    for (const calm of ["encounter", "door", "rescue", "finale", "bonus", "bonuspay"]) {
      expect(timerClassFor(calm, "choice"), `${calm} must be calm`).toBe("calm");
    }
  });

  it("a calm KIND stays calm in a timed pool (restore is the named one)", () => {
    // §2.9's calm classes: restore · rescue · door · ceremony · story. Three of
    // those are pools; `restore` is the one that is a card kind, so it is the
    // one the map has to carry explicitly — a swarm being asking a two-step
    // colour card must not put a 45-second clock on it.
    expect([...CALM_KINDS]).toEqual(["restore"]);
    expect(timerClassFor("quickfire", "restore")).toBe("calm");
    expect(clockMsFor("quickfire", "restore", false, RING)).toBe(0);
  });

  it("reduced motion removes the clock everywhere — an invisible countdown is unfair", () => {
    expect(clockMsFor("quickfire", "choice", false, RING)).toBe(RING);
    expect(clockMsFor("quickfire", "choice", true, RING)).toBe(0);
    expect(clockMsFor("boss", "order", true, RING)).toBe(0);
  });

  it("reads the SERVED pool, which is what makes the fallback safe", () => {
    // the unbound quickfire cards are the shell's universal fallback: a cage
    // rescue answered out of that pool is still a rescue, and a chalk clock
    // over a cage ceremony is exactly the mismatch this argument prevents
    expect(timerClassFor("rescue", "choice")).toBe("calm");
    expect(timerClassFor("quickfire", "choice")).toBe("timed");
  });

  it("the copy patterns catch a hurry that has nothing to hurry against", () => {
    expect(URGENCY_DE.test("Schnell, sag es ihm!")).toBe(true);
    expect(URGENCY_DE.test("Beeil dich!")).toBe(true);
    expect(URGENCY_DE.test("Sag, was er ist — dann macht er Platz!")).toBe(false);
    expect(CALM_DE.test("Lass dir Zeit.")).toBe(true);
    expect(CALM_DE.test("Dreh das Rad auf seine Zahl!")).toBe(false);
  });
});
