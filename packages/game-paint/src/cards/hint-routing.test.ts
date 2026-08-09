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

  it("skips once to avoid the same kind twice in a row", () => {
    // two wheels adjacent: a(wheel), a2(wheel), b(spell)
    const p = [mk("w1", "quickfire", "wheel"), mk("w2", "quickfire", "wheel"), mk("s", "quickfire", "spell")];
    let st = initRoute();
    let r = nextTask(p, "quickfire", anywhere, st); // w1 (wheel)
    expect(r.task!.id).toBe("w1"); st = r.next;
    r = nextTask(p, "quickfire", anywhere, st); // next would be w2 (wheel==last) → skip to s
    expect(r.task!.id).toBe("s"); st = r.next;
    expect(st.lastKind).toBe("spell");
  });

  it("returns null for an empty pool", () => {
    expect(nextTask(pool, "boss", anywhere, initRoute()).task).toBeNull();
  });

  // ── PK-R6 · D · THE ORDERED SERVE (doc 44 §3.3) ──────────────────────────
  // A reawakening round must be THE card authored for that round, because its
  // picture is the pose the classmate is striking in the world. The second test
  // is the reason orderedTask exists at all: on a pool of six same-kind cards
  // the playlist's anti-repetition skip serves 1, 3, 5, 1 … — every round after
  // the first would show a picture the world is not showing.
  describe("orderedTask — a ceremony is not a playlist", () => {
    const rounds = Array.from({ length: 6 }, (_, i) => mk(`r${i + 1}`, "rescue", "choice", ["merle"], ["p2"]));
    const here = { phase: "p2", skin: "merle" };

    it("serves round n as the nth card of the bound pool", () => {
      expect(rounds.map((_, i) => orderedTask(rounds, "rescue", here, i)!.id))
        .toEqual(["r1", "r2", "r3", "r4", "r5", "r6"]);
    });

    it("is what the playlist could NOT do: nextTask skips through a same-kind pool", () => {
      let st: RouteState = initRoute();
      const got: string[] = [];
      for (let i = 0; i < 4; i++) { const r = nextTask(rounds, "rescue", here, st); got.push(r.task!.id); st = r.next; }
      expect(got).toEqual(["r1", "r3", "r5", "r1"]); // …which is why the rounds do not use it
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
