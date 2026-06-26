import { describe, expect, it } from "vitest";
import { computeNextStreak, isStreakActive, viennaDayBefore, viennaDayString } from "./streak.ts";

describe("computeNextStreak (daily streak policy)", () => {
  const today = "2026-06-21";
  const yesterday = "2026-06-20";

  it("first-ever session → streak 1, bump, no reset", () => {
    expect(computeNextStreak({ lastSessionDate: null, currentStreak: 0, today, yesterday })).toEqual({
      newStreak: 1,
      newLastSessionDate: today,
      isStreakBump: true,
      isStreakReset: false,
    });
  });

  it("second attempt the same day → no change, no bump", () => {
    expect(computeNextStreak({ lastSessionDate: today, currentStreak: 4, today, yesterday })).toEqual({
      newStreak: 4,
      newLastSessionDate: today,
      isStreakBump: false,
      isStreakReset: false,
    });
  });

  it("same-day on a 0 streak still reads as at least 1", () => {
    expect(computeNextStreak({ lastSessionDate: today, currentStreak: 0, today, yesterday }).newStreak).toBe(1);
  });

  it("consecutive day → streak + 1, bump", () => {
    expect(computeNextStreak({ lastSessionDate: yesterday, currentStreak: 4, today, yesterday })).toEqual({
      newStreak: 5,
      newLastSessionDate: today,
      isStreakBump: true,
      isStreakReset: false,
    });
  });

  it("gap of ≥2 days → reset to 1, flagged as a reset", () => {
    expect(computeNextStreak({ lastSessionDate: "2026-06-10", currentStreak: 9, today, yesterday })).toEqual({
      newStreak: 1,
      newLastSessionDate: today,
      isStreakBump: true,
      isStreakReset: true,
    });
  });
});

describe("vienna day strings", () => {
  it("labels an instant by the Vienna calendar day, not UTC", () => {
    // 2026-06-20T23:30Z = 2026-06-21 01:30 CEST → the Vienna day is the 21st.
    expect(viennaDayString(new Date("2026-06-20T23:30:00.000Z"))).toBe("2026-06-21");
  });
  it("viennaDayBefore is the prior Vienna day", () => {
    expect(viennaDayBefore(new Date("2026-06-21T10:00:00.000Z"))).toBe("2026-06-20");
  });
});

describe("isStreakActive", () => {
  const at = new Date("2026-06-21T10:00:00.000Z"); // Vienna day 2026-06-21

  it("true when the last session was today or yesterday", () => {
    expect(isStreakActive("2026-06-21", at)).toBe(true);
    expect(isStreakActive("2026-06-20", at)).toBe(true);
  });
  it("false when older or never", () => {
    expect(isStreakActive("2026-06-19", at)).toBe(false);
    expect(isStreakActive(null, at)).toBe(false);
  });
});
