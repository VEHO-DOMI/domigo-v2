// R5-W2 · J1-B — the opening's chain, proven from both ends.
//
// The five laws below are the ones that cannot be seen in a screenshot. The
// freeze law in particular is why this module exists as pure code at all: it
// used to be a comment inside a 480-line switch, and a comment is not a check.
import { describe, expect, it } from "vitest";
import { AUFTAKT, auftaktExit, auftaktPosition, auftaktStep, auftaktTasks } from "./auftakt.ts";

describe("R5-W2 · J1-B · the opening's chain", () => {
  it("is four beats, and beat 1 is still called `goal`", () => {
    // not sentiment: `goal` is the value the boot state writes, the ceremony
    // beat sim.ts already carries, and the address the bench photographs
    expect(AUFTAKT).toEqual(["goal", "schatten", "aufgaben", "los"]);
  });

  it("EVERY beat is reachable from the first, forward, with nothing skipped", () => {
    const walk: string[] = ["goal"];
    for (let c: string | null = "goal", n = 0; c !== null && n < 20; n++) {
      c = auftaktStep(c, 1);
      if (c !== null) walk.push(c);
    }
    expect(walk).toEqual([...AUFTAKT]);
  });

  it("back-navigation TERMINATES — it cannot loop and it cannot leave the chain", () => {
    // the brief's own rule: „an opening must not be faster than reading", so a
    // child may go back. Termination is arithmetic (a strictly decreasing index)
    // rather than a promise, which is why there is no back-POINTER in the state.
    let c: string | null = "los";
    const seen: string[] = [];
    for (let n = 0; c !== null && n < 20; n++) { seen.push(c); c = auftaktStep(c, -1); }
    expect(seen).toEqual([...AUFTAKT].reverse());
    expect(auftaktStep("goal", -1), "beat 1 has nowhere to go back to").toBeNull();
    expect(auftaktStep("los", 1), "beat 4 has nowhere to go forward to").toBeNull();
  });

  it("THE FREEZE HOLDS ACROSS ALL FOUR BEATS — exactly one gives the world back", () => {
    // the law this whole packet turns on. Three hand-overs must NOT un-freeze;
    // one exit must. pickups.test.ts holds the sim's half of the same contract.
    expect(AUFTAKT.filter((c) => auftaktExit(c).unfreeze)).toEqual(["los"]);
    expect(AUFTAKT.filter((c) => auftaktExit(c).boot)).toEqual(["los"]);
    for (const c of AUFTAKT.slice(0, 3)) {
      expect(auftaktExit(c).next, `${c} must hand over, not close`).not.toBeNull();
    }
  });

  it("counts its own position — the foot never types a number", () => {
    expect(auftaktPosition("goal")).toEqual({ at: 1, of: 4 });
    expect(auftaktPosition("los")).toEqual({ at: 4, of: 4 });
    expect(auftaktPosition("task")).toBeNull();
  });

  it("no card OUTSIDE the opening can be walked into it", () => {
    for (const foreign of ["task", "score", "out", "tip", "regel", "merkseite", "ceremony", ""]) {
      expect(auftaktStep(foreign, 1)).toBeNull();
      expect(auftaktStep(foreign, -1)).toBeNull();
      expect(auftaktExit(foreign)).toEqual({ next: null, unfreeze: false, boot: false });
    }
  });
});

describe("R5-W2 · J1-B · beat 3's task lines", () => {
  const base = { letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 };

  it("prints the counts it is given — never a number of its own", () => {
    const t = auftaktTasks(base);
    expect(t.map((x) => x.askDe)).toEqual([
      "Sammle 27 Buchstaben.",
      "Gib 6 entfärbten Schulsachen die Farbe zurück.",
      "Mach 5 Käfige auf.",
      "Finde 3 Regel-Seiten.",
      "Nimm 3 Bonus-Bücher mit.",
    ]);
    // the promise and the world agree, or the promise is the thing that is wrong
    for (const [n, line] of [[27, t[0]!], [6, t[1]!], [5, t[2]!], [3, t[3]!], [3, t[4]!]] as const) {
      expect(line.askDe, `${line.key} must print ${n}`).toContain(String(n));
    }
  });

  it("SPEAKS GERMAN AT ONE — the singular is not the plural with a 1 in front", () => {
    // the defect this function exists for: `Nimm 1 Bonus-Bücher mit` was shipped
    // to the bench and read exactly as wrong as it looks. Latent for any chapter
    // whose counts all happen to exceed one, and wrong the day one does not.
    const one = auftaktTasks({ ...base, letters: 1, drained: 1, cages: 1, kids: 1, tips: 1, books: 1 });
    for (const t of one) {
      // no line may read as »1 <plural>« — the shape that shipped to the bench
      expect(t.askDe, `»${t.askDe}« still reads as »1 «+plural`).not.toMatch(/\b1 \S+(en|er)\b/);
      expect(t.whyDe.length, "every ask keeps its second line").toBeGreaterThan(0);
    }
    expect(one.find((t) => t.key === "books")!.askDe).toBe("Nimm das Bonus-Buch mit.");
    expect(one.find((t) => t.key === "cages")!.askDe).toBe("Mach den Käfig auf.");
    expect(one.find((t) => t.key === "books")!.whyDe).toBe("Es liegt versteckt.");
  });

  it("draws no line for a category the chapter does not have", () => {
    const none = auftaktTasks({ ...base, books: 0, tips: 0 });
    expect(none.map((t) => t.key)).toEqual(["letters", "drained", "cages"]);
    expect(auftaktTasks({ ...base, letters: 0, drained: 0, cages: 0, tips: 0, books: 0 })).toEqual([]);
  });

  it("keeps the classmate as the cage row's subline, never a sixth task", () => {
    // „ein Klassenkind" plus „fünf Käfige" is six things to a six-year-old when
    // the child is one OF the five
    const t = auftaktTasks(base);
    expect(t.map((x) => x.key)).not.toContain("kids");
    expect(t.find((x) => x.key === "cages")!.whyDe).toBe("In einem steckt ein Klassenkind.");
    expect(auftaktTasks({ ...base, kids: 0 }).find((x) => x.key === "cages")!.whyDe).toBe("Sie sind alle zu.");
    expect(auftaktTasks({ ...base, kids: 3 }).find((x) => x.key === "cages")!.whyDe).toBe("In 3 davon stecken Klassenkinder.");
  });
});
