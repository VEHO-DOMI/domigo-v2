import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import { gapLevelFor, gapSlots, renderGapHint } from "./hint.ts";
import { initRoute, nextTask, orderedTask, type RouteState } from "./routing.ts";

describe("hint ladder (F18)", () => {
  it("level 0 reveals nothing", () => expect(renderGapHint("pen", 0)).toBe(""));
  it("level 1 reveals the first letter only", () => expect(renderGapHint("pen", 1)).toBe("P…"));
  it("level 2 adds exact slots + count", () => expect(renderGapHint("pen", 2)).toBe("P _ _  ·  3 Buchstaben"));
  it("gapSlots keeps punctuation + word spacing, reveals only the first letter", () => {
    expect(gapSlots("Come in!")).toBe("C _ _ _   _ _ !");
  });
  it("singular Buchstabe", () => expect(renderGapHint("a", 2)).toBe("A  ·  1 Buchstabe"));
});

describe("routing v3 (deterministic playlists, bound to the world)", () => {
  // structural fixtures — nextTask only reads id/use/kind/skins/phases
  const mk = (id: string, use: string, kind: string, skins?: string[], phases?: string[]) =>
    ({ id, use, kind, ...(skins ? { skins } : {}), ...(phases ? { phases } : {}) }) as unknown as GameTaskV2;
  const anywhere = { phase: "p1" };
  const pool = [mk("a", "quickfire", "wheel"), mk("b", "quickfire", "spell"), mk("c", "quickfire", "choice")];

  it("serves the pool in file order, cycling", () => {
    let st: RouteState = initRoute();
    const got: string[] = [];
    for (let i = 0; i < 5; i++) { const r = nextTask(pool, "quickfire", anywhere, st); got.push(r.task!.id); st = r.next; }
    expect(got).toEqual(["a", "b", "c", "a", "b"]);
  });

  // ── R5-W2 · G1 · THE FAIRNESS OF THE CURSOR ───────────────────────────────
  // What stood here asserted the rule this session retired: "skips once to avoid
  // the same kind twice in a row". That skip advanced the cursor PAST the card it
  // skipped, so a pool where it fired every other serve could only ever visit one
  // parity class — measured on the shipped chapter, 10 of 62 field cards were
  // unreachable, five of them door cards (repealing law M-E, doc 41 §1).
  // Both halves below are deliberate: the first says what the router must do, the
  // second RE-CREATES the deleted rule and proves it starved. Reintroduce the
  // skip and half of this goes red, instead of the file going quietly vacuous.
  const servesOf = (p: GameTaskV2[], use: string, ctx: { phase: string; skin?: string }, n: number) => {
    let st: RouteState = initRoute();
    const got: string[] = [];
    for (let i = 0; i < n; i++) { const r = nextTask(p, use, ctx, st); got.push(r.task!.id); st = r.next; }
    return got;
  };
  /** R5-W5 · G4 · D-195 · a pool no longer opens at slot one: each one starts at a
   *  fixed offset derived from its own key, so two fights do not greet the child
   *  with the same card. What the old literal lists really asserted — every card
   *  served once, in file order, before any repeat — is a ROTATION of file order,
   *  and that is what these tests now say. Rotation is the stronger claim of the
   *  two: it still fails if the cursor skips, stalls or re-visits. */
  const isRotationOf = (got: readonly string[], file: readonly string[]) => {
    if (got.length !== file.length) return false;
    const at = file.indexOf(got[0]!);
    if (at < 0) return false;
    return got.every((id, k) => id === file[(at + k) % file.length]);
  };

  /** The retired rule, kept verbatim as the tamper witness — nothing imports it. */
  const skipAndConsume = (p: GameTaskV2[], n: number) => {
    const got: string[] = [];
    let cur = 0;
    let lastKind: string | null = null;
    for (let k = 0; k < n; k++) {
      let i = cur % p.length;
      let pick = p[i]!;
      if (p.length > 1 && lastKind !== null && pick.kind === lastKind) { i = (i + 1) % p.length; pick = p[i]!; }
      cur = (i + 1) % p.length;
      lastKind = pick.kind;
      got.push(pick.id);
    }
    return got;
  };
  // three shapes, each mirroring a real pool of the shipped chapter
  const shapes = {
    /** the door series: ten choice cards, monotype BY LAW M-E (doc 41 §1) */
    door: Array.from({ length: 10 }, (_, i) => mk(`d${i + 1}`, "door", "choice", ["door"])),
    /** the p1 chaser as shipped: two choice cards and an oddone */
    pencil: [
      mk("c1", "encounter", "choice", ["pencil"]),
      mk("c2", "encounter", "choice", ["pencil"]),
      mk("q1", "encounter", "oddone", ["pencil"]),
    ],
    /** the p2 moth corridor — B10 wants the number wheels to land in a RUN */
    moths: [
      mk("w1", "quickfire", "wheel", ["moths"]),
      mk("w2", "quickfire", "wheel", ["moths"]),
      mk("c1", "quickfire", "choice", ["moths"]),
      mk("w3", "quickfire", "wheel", ["moths"]),
      mk("w4", "quickfire", "wheel", ["moths"]),
    ],
  };

  it("serves every card a pool holds, in file order, before it repeats one", () => {
    const doors = servesOf(shapes.door, "door", { phase: "p1", skin: "door" }, 10);
    expect(new Set(doors).size).toBe(10); // every card, none twice
    expect(isRotationOf(doors, shapes.door.map((t) => t.id))).toBe(true);
    const pencil = servesOf(shapes.pencil, "encounter", { phase: "p1", skin: "pencil" }, 4);
    expect(isRotationOf(pencil.slice(0, 3), ["c1", "c2", "q1"])).toBe(true);
    expect(pencil[3]).toBe(pencil[0]); // …and the fourth serve wraps to the first
    // B10 (doc 45): the authored run of wheels still arrives as an unbroken run
    const moths = servesOf(shapes.moths, "quickfire", { phase: "p2", skin: "moths" }, 5);
    expect(isRotationOf(moths, ["w1", "w2", "c1", "w3", "w4"])).toBe(true);
  });

  it("tamper: the retired skip starved half a pool — the proof it stays retired", () => {
    expect([...new Set(skipAndConsume(shapes.door, 40))].sort())
      .toEqual(["d1", "d3", "d5", "d7", "d9"]);
    expect(new Set(skipAndConsume(shapes.pencil, 40)).has("c2")).toBe(false);
    expect(skipAndConsume(shapes.moths, 5)).toEqual(["w1", "c1", "w3", "w1", "c1"]); // B10's run, broken
  });

  it("a pool that is the same cards in every phase keeps ONE series (the doors)", () => {
    // door cards declare no `phases`, so p1/p2/p3 resolve to the identical ten.
    // Before G1 each phase had its own cursor at 0 and every exit in the chapter
    // asked slot one of the same series.
    let st: RouteState = initRoute();
    const got: string[] = [];
    for (const phase of ["p1", "p2", "p3"]) {
      const r = nextTask(shapes.door, "door", { phase, skin: "door" }, st);
      got.push(r.task!.id); st = r.next;
    }
    // ONE series: three CONSECUTIVE cards of the same file order, not three
    // restarts of it — which is what a per-phase cursor at zero would give
    const ids = shapes.door.map((t) => t.id);
    expect(isRotationOf([...got, ...ids.filter((i) => !got.includes(i))].slice(0, 3), got)).toBe(true);
    const at = ids.indexOf(got[0]!);
    expect(got).toEqual([0, 1, 2].map((k) => ids[(at + k) % ids.length]));
  });

  it("…and a genuinely phase-scoped pool still keeps its cursors apart", () => {
    // the narrow half of the same rule: `phases` present ⇒ the phase stays in the
    // key, so two different phases may not eat each other's progress.
    const scoped = [
      mk("a1", "encounter", "choice", ["heft"], ["p1"]),
      mk("a2", "encounter", "choice", ["heft"], ["p1"]),
      mk("b1", "encounter", "choice", ["heft"], ["p3"]),
    ];
    let st: RouteState = initRoute();
    let r = nextTask(scoped, "encounter", { phase: "p1", skin: "heft" }, st);
    const firstP1 = r.task!.id;
    expect(["a1", "a2"]).toContain(firstP1); st = r.next;
    r = nextTask(scoped, "encounter", { phase: "p3", skin: "heft" }, st);
    expect(r.task!.id).toBe("b1"); st = r.next; // a one-card pool can only open there
    // p1 picks up where IT left off — p3's serve did not eat its progress
    expect(nextTask(scoped, "encounter", { phase: "p1", skin: "heft" }, st).task!.id)
      .toBe(firstP1 === "a1" ? "a2" : "a1");
  });

  it("returns null for an empty pool", () => {
    expect(nextTask(pool, "boss", anywhere, initRoute()).task).toBeNull();
  });

  // ── PK-R6 · D · THE ORDERED SERVE (doc 44 §3.3) ──────────────────────────
  // A reawakening round must be THE card authored for that round, because its
  // picture is the pose the classmate is striking in the world. The second test
  // is the reason orderedTask exists at all — restated in R5-W2 · G1, because it
  // used to rest on the anti-repeat skip and that rule is gone. The reason that
  // SURVIVES: the round is the world's counter, and „Später" does not advance it
  // (sim.ts:497 / :585, awakening.test.ts:210-218), while a cursor already has.
  describe("orderedTask — a ceremony is not a playlist", () => {
    const rounds = Array.from({ length: 6 }, (_, i) => mk(`r${i + 1}`, "rescue", "choice", ["merle"], ["p2"]));
    const here = { phase: "p2", skin: "merle" };

    it("serves round n as the nth card of the bound pool", () => {
      expect(rounds.map((_, i) => orderedTask(rounds, "rescue", here, i)!.id))
        .toEqual(["r1", "r2", "r3", "r4", "r5", "r6"]);
    });

    it("is what the playlist cannot do: the round is the WORLD's counter, not a cursor", () => {
      // The playlist is fair now, so file order alone would look right here. The
      // test that still bites is the RESUME: „Später" leaves `awakenStep` where it
      // was, so ↑ re-asks the SAME round — while a cursor has already moved on.
      let st: RouteState = initRoute();
      const ids = rounds.map((t) => t.id);
      const r = nextTask(rounds, "rescue", here, st);
      const first = r.task!.id; st = r.next;
      // the playlist MOVED — wherever it opened, its next serve is the next card
      expect(nextTask(rounds, "rescue", here, st).task!.id)
        .toBe(ids[(ids.indexOf(first) + 1) % ids.length]);
      // …and the ceremony did not: round 3 is r3 no matter where the cursor is.
      // This is the half D-195 must not touch — the reawakening is ORDERED, so a
      // rotated playlist may never rotate the rounds Merle acts out.
      expect(orderedTask(rounds, "rescue", here, 2)!.id).toBe("r3");
    });

    it("returns null out of range instead of wrapping — the caller resolves, never softlocks", () => {
      expect(orderedTask(rounds, "rescue", here, 6)).toBeNull();
      expect(orderedTask(rounds, "rescue", here, -1)).toBeNull();
    });

    it("obeys the same binding scope every other card does", () => {
      expect(orderedTask(rounds, "rescue", { phase: "p2", skin: "pencil" }, 0)).toBeNull();
      expect(orderedTask(rounds, "rescue", { phase: "p1", skin: "merle" }, 0)).toBeNull();
    });
  });

  it("keeps independent cursors per use", () => {
    const mixed = [mk("q1", "quickfire", "choice"), mk("d1", "door", "choice"), mk("q2", "quickfire", "spell")];
    let st = initRoute();
    let r = nextTask(mixed, "quickfire", anywhere, st); expect(r.task!.id).toBe("q1"); st = r.next;
    r = nextTask(mixed, "door", anywhere, st); expect(r.task!.id).toBe("d1"); st = r.next;
    r = nextTask(mixed, "quickfire", anywhere, st); expect(r.task!.id).toBe("q2"); st = r.next;
  });

  // ── the F2-1 fix: a card is served for the being that triggered it ────────
  const bound = [
    mk("pencil1", "encounter", "choice", ["pencil"], ["p1"]),
    mk("pencil2", "encounter", "spell", ["pencil"], ["p1"]),
    mk("eraser1", "encounter", "choice", ["eraser"], ["p1", "p3"]),
    mk("free1", "encounter", "oddone"),
  ];

  it("serves only the attacker's own cards, every time (F2-1)", () => {
    let st = initRoute();
    const got: string[] = [];
    for (let i = 0; i < 4; i++) {
      const r = nextTask(bound, "encounter", { phase: "p1", skin: "pencil" }, st);
      got.push(r.task!.id); st = r.next;
    }
    expect(got).toEqual(["pencil1", "pencil2", "pencil1", "pencil2"]);
  });

  it("falls back to the unbound pool for a being with no cards of its own", () => {
    const r = nextTask(bound, "encounter", { phase: "p1", skin: "moths" }, initRoute());
    expect(r.task!.id).toBe("free1");
  });

  // R3-11 · the speaker law: a hazard no longer serves anything at all, so the
  // skin-less serve is now only the shell's own fallback path (a ceremony, or a
  // request whose being carries no skin) — it still resolves to the unbound pool.
  it("a skin-less serve draws from the unbound pool only", () => {
    const r = nextTask(bound, "encounter", { phase: "p1" }, initRoute());
    expect(r.task!.id).toBe("free1");
  });

  it("phase scope keeps one phase's cards out of another (F2-21)", () => {
    // the eraser lives in p1 and p3; the pencil cards are p1-only
    expect(nextTask(bound, "encounter", { phase: "p3", skin: "eraser" }, initRoute()).task!.id).toBe("eraser1");
    // in the arena the pencil cards are out of scope entirely → unbound fallback
    expect(nextTask(bound, "encounter", { phase: "p4", skin: "pencil" }, initRoute()).task!.id).toBe("free1");
  });

  it("one being's progress never eats another's (per-pool cursors)", () => {
    let st = initRoute();
    let r = nextTask(bound, "encounter", { phase: "p1", skin: "pencil" }, st); // pencil1
    expect(r.task!.id).toBe("pencil1"); st = r.next;
    r = nextTask(bound, "encounter", { phase: "p1", skin: "eraser" }, st); // eraser1
    expect(r.task!.id).toBe("eraser1"); st = r.next;
    r = nextTask(bound, "encounter", { phase: "p1", skin: "pencil" }, st); // pencil2, not pencil1
    expect(r.task!.id).toBe("pencil2");
  });

  it("an empty scope resolves to null rather than serving a stranger's card", () => {
    const only = [mk("p3only", "encounter", "choice", ["ranzen"], ["p3"])];
    expect(nextTask(only, "encounter", { phase: "p4", skin: "tafel" }, initRoute()).task).toBeNull();
  });
});

// ── R3-10 · the spelling card's duplicated line ──────────────────────────────
// gapLevelFor is the RULE CardShell calls, imported here rather than restated —
// a test that re-writes the rule proves only that it can copy.
describe("R3-10 · a spell card's ladder never re-draws its own letter row", () => {
  it("a typed card keeps both rungs (it has no slots of its own)", () => {
    expect(renderGapHint("pen", gapLevelFor("typed", 1))).toBe("P…");
    expect(renderGapHint("pen", gapLevelFor("typed", 2))).toBe("P _ _  ·  3 Buchstaben");
  });

  it("a spell card stops at the first letter — its own slots already show the shape", () => {
    expect(renderGapHint("pen", gapLevelFor("spell", 1))).toBe("P…");
    expect(renderGapHint("pen", gapLevelFor("spell", 2))).toBe("P…");
    expect(renderGapHint("pen", gapLevelFor("spell", 5))).toBe("P…");
  });

  it("level 0 is still silent for every kind", () => {
    expect(renderGapHint("pen", gapLevelFor("spell", 0))).toBe("");
    expect(renderGapHint("pen", gapLevelFor("typed", 0))).toBe("");
  });
});
