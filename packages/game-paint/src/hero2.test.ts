// PK-R6 · H3 · the full-pose override hook — the pure map from frame state to
// authored v2 cell. The tests pin exactly the reads the two critic rounds
// demanded: a run whose frames DIFFER, a landing that squashes, faces that
// change per state, and a teeter that only fires at a real edge.
import { describe, expect, it } from "vitest";
import { HERO2_APEX_VY, HERO2_STEMS, HERO2_STRIDE_TICKS, HERO2_TEETER_TICKS, heroFullCell } from "./rigSpec.ts";

interface CellOpts {
  pose?: Parameters<typeof heroFullCell>[0];
  walkTime?: number;
  vy?: number;
  landedAgo?: number;
  cheering?: boolean;
  atEdge?: boolean;
  tick?: number;
}
const cell = (over: CellOpts = {}): string | null =>
  heroFullCell(
    over.pose ?? "stand",
    over.walkTime ?? 0,
    over.vy ?? 0,
    over.landedAgo ?? 99,
    over.cheering ?? false,
    over.atEdge ?? false,
    over.tick ?? 0,
  );

describe("heroFullCell — the v2 override map", () => {
  it("cycles four DISTINCT run frames as the walk clock advances (the round-1 finding)", () => {
    const frames = [0, 1, 2, 3].map((i) => cell({ pose: "run", walkTime: i * HERO2_STRIDE_TICKS }));
    expect(frames).toEqual(["hero2_run0", "hero2_run1", "hero2_run2", "hero2_run3"]);
    expect(new Set(frames).size).toBe(4);
    expect(cell({ pose: "run", walkTime: 4 * HERO2_STRIDE_TICKS })).toBe("hero2_run0"); // …and wraps
  });

  it("walk shares the run cycle — one painted stride language", () => {
    expect(cell({ pose: "walk", walkTime: HERO2_STRIDE_TICKS })).toBe("hero2_run1");
  });

  it("the jump arc: rise, weightless apex, fall — three different silhouettes", () => {
    expect(cell({ pose: "jump", vy: -(HERO2_APEX_VY + 20) })).toBe("hero2_jump");
    expect(cell({ pose: "jump", vy: -(HERO2_APEX_VY - 1) })).toBe("hero2_apex");
    expect(cell({ pose: "fall", vy: HERO2_APEX_VY - 1 })).toBe("hero2_apex");
    expect(cell({ pose: "fall", vy: HERO2_APEX_VY + 40 })).toBe("hero2_fall");
  });

  it("the touchdown wears the painted squash for the land window, then stands", () => {
    expect(cell({ pose: "stand", landedAgo: 0 })).toBe("hero2_land");
    expect(cell({ pose: "stand", landedAgo: 99 })).toBe("hero2_idle");
  });

  it("events outrank locomotion: cheer over everything, hit over landing", () => {
    expect(cell({ pose: "run", walkTime: 5, cheering: true })).toBe("hero2_cheer");
    expect(cell({ pose: "hit", landedAgo: 0 })).toBe("hero2_hit");
  });

  it("the teeter fires only at a real edge, and alternates its two cells", () => {
    expect(cell({ pose: "stand", atEdge: false })).toBe("hero2_idle");
    expect(cell({ pose: "stand", atEdge: true, tick: 0 })).toBe("hero2_teeter0");
    expect(cell({ pose: "stand", atEdge: true, tick: HERO2_TEETER_TICKS })).toBe("hero2_teeter1");
    expect(cell({ pose: "stand", atEdge: true, tick: HERO2_TEETER_TICKS * 2 })).toBe("hero2_teeter0");
  });

  it("hands the un-painted states back to the composed rig", () => {
    for (const pose of ["hover", "charge", "hang", "vine", "swing"] as const) {
      expect(cell({ pose })).toBeNull();
    }
  });

  it("every cell the map can emit is in the manifest contract", () => {
    const emitted = new Set<string>();
    for (const pose of ["stand", "walk", "run", "jump", "fall", "hit"] as const) {
      for (const vy of [-80, -10, 10, 80]) {
        for (const walkTime of [0, 9, 18, 27, 36]) {
          for (const landedAgo of [0, 99]) {
            for (const atEdge of [false, true]) {
              for (const tick of [0, HERO2_TEETER_TICKS]) {
                const c = heroFullCell(pose, walkTime, vy, landedAgo, false, atEdge, tick);
                if (c !== null) emitted.add(c);
              }
            }
          }
        }
      }
    }
    emitted.add("hero2_cheer");
    for (const c of emitted) expect(HERO2_STEMS).toContain(c);
    expect(emitted.size).toBe(HERO2_STEMS.length); // …and every commissioned cell is reachable
  });
});
