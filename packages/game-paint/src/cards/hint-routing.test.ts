import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import { gapLevelFor, gapSlots, renderGapHint } from "./hint.ts";
import { initRoute, nextTask, type RouteState } from "./routing.ts";

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
