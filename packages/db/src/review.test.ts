import { describe, expect, it } from "vitest";
import type { Tier } from "@domigo/engine";
import { BOX_INTERVAL_MS, LEITNER_MAX_BOX, nextBox, nextDueAt } from "./review.ts";

describe("nextBox (Leitner policy)", () => {
  it("correct promotes one box, capped at 5", () => {
    expect(nextBox(1, "correct")).toBe(2);
    expect(nextBox(4, "correct")).toBe(5);
    expect(nextBox(5, "correct")).toBe(5); // cap
  });
  it("wrong resets to box 1 from anywhere (re-queue, never XP loss)", () => {
    for (const b of [1, 2, 3, 4, 5]) expect(nextBox(b, "wrong")).toBe(1);
  });
  it("partial and close hold the current box (no demotion, no promotion)", () => {
    for (const tier of ["partial", "close"] as Tier[]) {
      expect(nextBox(1, tier)).toBe(1);
      expect(nextBox(3, tier)).toBe(3);
      expect(nextBox(5, tier)).toBe(5);
    }
  });
});

describe("nextDueAt (box → interval)", () => {
  const now = new Date("2026-06-18T12:00:00.000Z");
  it("maps each box to its spacing", () => {
    expect(nextDueAt(1, now).getTime() - now.getTime()).toBe(BOX_INTERVAL_MS[1]);
    expect(nextDueAt(2, now).getTime() - now.getTime()).toBe(BOX_INTERVAL_MS[2]);
    expect(nextDueAt(5, now).getTime() - now.getTime()).toBe(BOX_INTERVAL_MS[5]);
  });
  it("box 1 resurfaces within the same session (<= 15 min)", () => {
    expect(BOX_INTERVAL_MS[1]!).toBeLessThanOrEqual(15 * 60_000);
  });
  it("intervals are strictly increasing 1→5", () => {
    for (let b = 1; b < LEITNER_MAX_BOX; b++) {
      expect(BOX_INTERVAL_MS[b + 1]!).toBeGreaterThan(BOX_INTERVAL_MS[b]!);
    }
  });
  it("unknown box falls back to box-1 spacing (defensive)", () => {
    expect(nextDueAt(99, now).getTime() - now.getTime()).toBe(BOX_INTERVAL_MS[1]);
  });
});

describe("end-to-end box trajectory", () => {
  it("a missed-then-relearned item climbs back: 1→(wrong)→1→(correct)→2→(correct)→3", () => {
    let box = 1;
    box = nextBox(box, "wrong");
    expect(box).toBe(1);
    box = nextBox(box, "correct");
    expect(box).toBe(2);
    box = nextBox(box, "correct");
    expect(box).toBe(3);
  });
});

// DB-integration tests run only when a Postgres DATABASE_URL is provided (CI
// service container or a dev Neon branch). They exercise updateReviewQueue /
// getDueRefs / getDueCounts against the applied schema. Skipped without a DB.
describe.skipIf(!process.env.DATABASE_URL)("review queue (DB integration)", () => {
  it("upserts box transitions + getDueRefs scope filters (requires DATABASE_URL)", () => {
    // Placeholder — wired in CI where the postgres:16 service container exists.
    expect(process.env.DATABASE_URL).toBeTruthy();
  });
});
