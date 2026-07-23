import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import { gapSlots, renderGapHint } from "./hint.ts";
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

describe("routing v2 (deterministic playlists)", () => {
  // structural fixtures — nextTask only reads id/use/kind
  const mk = (id: string, use: string, kind: string) => ({ id, use, kind }) as unknown as GameTaskV2;
  const pool = [mk("a", "quickfire", "wheel"), mk("b", "quickfire", "spell"), mk("c", "quickfire", "choice")];

  it("serves the pool in file order, cycling", () => {
    let st: RouteState = initRoute();
    const got: string[] = [];
    for (let i = 0; i < 5; i++) { const r = nextTask(pool, "quickfire", st); got.push(r.task!.id); st = r.next; }
    expect(got).toEqual(["a", "b", "c", "a", "b"]);
  });

  it("skips once to avoid the same kind twice in a row", () => {
    // two wheels adjacent: a(wheel), a2(wheel), b(spell)
    const p = [mk("w1", "quickfire", "wheel"), mk("w2", "quickfire", "wheel"), mk("s", "quickfire", "spell")];
    let st = initRoute();
    let r = nextTask(p, "quickfire", st); // w1 (wheel)
    expect(r.task!.id).toBe("w1"); st = r.next;
    r = nextTask(p, "quickfire", st); // next would be w2 (wheel==last) → skip to s
    expect(r.task!.id).toBe("s"); st = r.next;
    expect(st.lastKind).toBe("spell");
  });

  it("returns null for an empty pool", () => {
    expect(nextTask(pool, "boss", initRoute()).task).toBeNull();
  });

  it("keeps independent cursors per use", () => {
    const mixed = [mk("q1", "quickfire", "choice"), mk("d1", "door", "choice"), mk("q2", "quickfire", "spell")];
    let st = initRoute();
    let r = nextTask(mixed, "quickfire", st); expect(r.task!.id).toBe("q1"); st = r.next;
    r = nextTask(mixed, "door", st); expect(r.task!.id).toBe("d1"); st = r.next;
    r = nextTask(mixed, "quickfire", st); expect(r.task!.id).toBe("q2"); st = r.next;
  });
});
