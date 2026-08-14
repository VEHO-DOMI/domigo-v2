// R5-W2 · J1-B — the opening's chain, proven from both ends.
//
// The five laws below are the ones that cannot be seen in a screenshot. The
// freeze law in particular is why this module exists as pure code at all: it
// used to be a comment inside a 480-line switch, and a comment is not a check.
import { describe, expect, it } from "vitest";
import { AUFTAKT, auftaktChain, auftaktExit, auftaktPosition, auftaktStep, auftaktTasks } from "./auftakt.ts";

describe("R5-W2 · J1-B · the opening's chain", () => {
  it("is FIVE beats, and beat 1 is still called `goal`", () => {
    // not sentiment: `goal` is the value the boot state writes, the ceremony
    // beat sim.ts already carries, and the address the bench photographs.
    // R5-W3 · J2 · R29: four became five when the task beat split into
    // do-this / gather-this. Two blind didactics critics, blind to each other,
    // converged on »one card with five task lines is too much for a
    // six-year-old«; the standing ruling was split-on-convergence.
    expect(AUFTAKT).toEqual(["goal", "schatten", "aufgaben", "sammeln", "los"]);
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
    expect(auftaktPosition("goal")).toEqual({ at: 1, of: 5 });
    expect(auftaktPosition("los")).toEqual({ at: 5, of: 5 });
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

describe("R5-W2 · J1-B · the mechanic is named where the child acts", () => {
  it("says AUF ENGLISCH on the task line, not only in beat 1", () => {
    // the didactic critic's finding (80 %, high): the whole premise of the game
    // lived on beat 1 and was absent from beat 3, which is the page a child
    // reads to know what to DO. One mention, two taps before it matters.
    const t = auftaktTasks({ letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 });
    expect(t.find((x) => x.key === "drained")!.whyDe).toContain("auf Englisch");
    expect(auftaktTasks({ letters: 1, collectNounDe: "Buchstaben", drained: 1, cages: 1, kids: 1, tips: 1, books: 1 })
      .find((x) => x.key === "drained")!.whyDe).toContain("auf Englisch");
  });
});

/** R5-W3 · J2 · R29 — THE SPLIT ITSELF.
 *
 *  Beat 3 became two beats. These are the laws that split needs and the old
 *  four-beat chain never had to answer: which line belongs to which beat, and
 *  what a chapter does when it has one kind of task and not the other. */
describe("R5-W3 · J2 · R29 · the task beat, split in two", () => {
  const base = { letters: 27, collectNounDe: "Buchstaben", drained: 6, cages: 5, kids: 1, tips: 3, books: 3 };

  it("puts the DOING on one beat and the GATHERING on the other, and loses no line", () => {
    const doing = auftaktTasks(base, "aufgaben").map((t) => t.key);
    const gathering = auftaktTasks(base, "sammeln").map((t) => t.key);
    expect(doing).toEqual(["drained", "cages"]);
    expect(gathering).toEqual(["letters", "tips", "books"]);
    // the split is a PARTITION: every line lands on exactly one beat, and the
    // union is still the whole contract. A split that quietly drops a task
    // would be the worst possible outcome of a readability fix.
    expect([...doing, ...gathering].sort()).toEqual(auftaktTasks(base).map((t) => t.key).sort());
  });

  it("names the mechanic on the FIRST of the two — it no longer shares a weight with the bonus book", () => {
    // both critics' second finding: with five identical rows, nothing said which
    // job was the chapter's. »drained« is the line that carries »sag auf
    // Englisch«, so it leads the beat a child acts on.
    expect(auftaktTasks(base, "aufgaben")[0]?.key).toBe("drained");
    expect(auftaktTasks(base, "aufgaben")[0]?.whyDe).toContain("auf Englisch");
  });

  it("neither beat carries more than three lines, at the shipped chapter's counts", () => {
    // the whole point of the round: five on one page was the finding
    expect(auftaktTasks(base, "aufgaben").length).toBeLessThanOrEqual(3);
    expect(auftaktTasks(base, "sammeln").length).toBeLessThanOrEqual(3);
  });

  it("a chapter with no gathering shows FOUR beats, not five with a blank one", () => {
    // ch02–15 inherit this grammar and will not all have both kinds
    const noGather = { ...base, letters: 0, tips: 0, books: 0 };
    expect(auftaktChain(noGather)).toEqual(["goal", "schatten", "aufgaben", "los"]);
    expect(auftaktPosition("los", auftaktChain(noGather))).toEqual({ at: 4, of: 4 });
    // and the skipped beat cannot be stepped into from either side
    expect(auftaktStep("aufgaben", 1, auftaktChain(noGather))).toBe("los");
    expect(auftaktStep("los", -1, auftaktChain(noGather))).toBe("aufgaben");
    expect(auftaktStep("sammeln", 1, auftaktChain(noGather))).toBeNull();
  });

  it("a chapter with no doing shows four beats the other way round", () => {
    const noDo = { ...base, drained: 0, cages: 0 };
    expect(auftaktChain(noDo)).toEqual(["goal", "schatten", "sammeln", "los"]);
    expect(auftaktStep("schatten", 1, auftaktChain(noDo))).toBe("sammeln");
  });

  it("a chapter with no tasks at all still opens and still closes", () => {
    const none = { ...base, letters: 0, drained: 0, cages: 0, tips: 0, books: 0 };
    expect(auftaktChain(none)).toEqual(["goal", "schatten", "los"]);
    // and the freeze law survives the shortening: exactly one beat gives the
    // world back, and it is still the last one
    expect(auftaktChain(none).filter((c) => auftaktExit(c, auftaktChain(none)).unfreeze)).toEqual(["los"]);
  });

  it("the freeze law holds on EVERY chain a chapter can produce", () => {
    // the split multiplied the number of possible chains; the law that exactly
    // one beat un-freezes must hold on all of them, or a chapter shape nobody
    // tested starts the world under a card a child is still reading
    for (const doing of [true, false]) for (const gathering of [true, false]) {
      const c = { ...base, drained: doing ? 6 : 0, cages: doing ? 5 : 0,
                  letters: gathering ? 27 : 0, tips: gathering ? 3 : 0, books: gathering ? 3 : 0 };
      const chain = auftaktChain(c);
      expect(chain.filter((b) => auftaktExit(b, chain).unfreeze), `chain ${chain.join("→")}`).toEqual(["los"]);
      expect(chain.filter((b) => auftaktExit(b, chain).boot), `chain ${chain.join("→")}`).toEqual(["los"]);
      expect(chain[0]).toBe("goal");
      expect(chain[chain.length - 1]).toBe("los");
    }
  });
});
