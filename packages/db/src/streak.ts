/**
 * Daily-streak math — ported from v1 (`lib/vienna-time.ts` + `lib/streaks-math.ts`).
 * Pure + DB-free so it unit-tests without Neon. The streak is advanced inside
 * `recordAttempt` (persist.ts); these helpers compute the next state and drive
 * the "is the streak still alive?" display on the home screen.
 *
 * Streaks anchor to the Vienna calendar day (all DomiGo students + the teacher
 * are in Vienna) via Intl's IANA "Europe/Vienna", so DST (CET ↔ CEST) is handled
 * automatically — no hand-rolled +01:00/+02:00.
 */

const TZ = "Europe/Vienna";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** The Vienna calendar day for `at` as "YYYY-MM-DD" (en-CA → ISO-style date). */
export function viennaDayString(at: Date = new Date()): string {
  return dayFormatter.format(at);
}

/** The Vienna calendar day strictly before `at` ("yesterday in Vienna"). */
export function viennaDayBefore(at: Date = new Date()): string {
  return viennaDayString(new Date(at.getTime() - ONE_DAY_MS));
}

export interface StreakInput {
  lastSessionDate: string | null;
  currentStreak: number;
  today: string; // "YYYY-MM-DD" Vienna day
  yesterday: string; // "YYYY-MM-DD" Vienna day
}

export interface StreakResult {
  newStreak: number;
  newLastSessionDate: string;
  /** true iff the streak counter advanced (today is the first session). */
  isStreakBump: boolean;
  /** true iff the streak reset (broke the chain). */
  isStreakReset: boolean;
}

/**
 * Three branches, mirroring v1 exactly:
 *
 *   today === last           → no change (already practiced today). Returns
 *                              `streak || 1` so the first-ever session on a fresh
 *                              account reads as a streak of 1.
 *   yesterday === last       → streak += 1, bump.
 *   otherwise (gap or first) → streak = 1, reset (flagged only when a prior
 *                              streak existed).
 */
export function computeNextStreak(input: StreakInput): StreakResult {
  const { lastSessionDate, currentStreak, today, yesterday } = input;

  if (lastSessionDate === today) {
    return {
      newStreak: Math.max(currentStreak, 1),
      newLastSessionDate: today,
      isStreakBump: false,
      isStreakReset: false,
    };
  }

  if (lastSessionDate === yesterday) {
    return {
      newStreak: (currentStreak || 0) + 1,
      newLastSessionDate: today,
      isStreakBump: true,
      isStreakReset: false,
    };
  }

  return {
    newStreak: 1,
    newLastSessionDate: today,
    isStreakBump: true,
    isStreakReset: (currentStreak || 0) > 0,
  };
}

/**
 * Is a stored streak still "alive" for display? A streak whose last session was
 * today or yesterday is current; anything older means the chain is already broken
 * (it will reset to 1 on the next attempt), so the UI shouldn't advertise the
 * stale number.
 */
export function isStreakActive(lastSessionDate: string | null, at: Date = new Date()): boolean {
  if (!lastSessionDate) return false;
  return lastSessionDate === viennaDayString(at) || lastSessionDate === viennaDayBefore(at);
}
