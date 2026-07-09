/**
 * M-4 · The teacher results roster — PURE aggregation over per-student results
 * (DB-free, unit-tested). The per-student SCORING is M-3's scoreSubmittedSession
 * (so the roster reconciles with the runner + M-1's Note math by construction);
 * this module only rolls those results into a class view: who's done, the class
 * average, the Note distribution, and which section the class found hardest.
 */
import type { Note } from "./assignments.ts";

export type RosterStatus = "not_started" | "in_progress" | "done";

export interface RosterRow {
  userId: string;
  name: string;
  status: RosterStatus;
  /** submitted attempts (0 unless a sitting was finished) */
  attempts: number;
  /** the roster attempt's exact overall percent — null unless done */
  overallPct: number | null;
  note: Note | null;
  /** per-section percents of the roster attempt — empty unless done */
  perSection: Array<{ position: number; pct: number }>;
}

export interface RosterSummary {
  students: number;
  done: number;
  inProgress: number;
  notStarted: number;
  /** mean overall % over the DONE students (null if none finished) */
  classAvgPct: number | null;
  /** counts of each Note 1..5 among the done students */
  noteHistogram: Record<Note, number>;
  /** per-section class average % over the done students (the "hardest section" signal) */
  sectionAvgPct: Array<{ position: number; avgPct: number }>;
}

/** The roster attempt for a student = their LATEST submitted sitting. */
export function pickRosterSession<T extends { attemptNumber: number; submittedAt: Date | null }>(sessions: T[]): T | null {
  const submitted = sessions.filter((s) => s.submittedAt !== null);
  if (submitted.length === 0) return null;
  return submitted.reduce((best, s) => (s.attemptNumber > best.attemptNumber ? s : best));
}

/** A student's roster status from their sittings (live overrides not-started). */
export function rosterStatus(sessions: Array<{ submittedAt: Date | null }>, hasLive: boolean): RosterStatus {
  if (sessions.some((s) => s.submittedAt !== null)) return "done";
  if (hasLive) return "in_progress";
  return "not_started";
}

/** Roll the per-student rows into a class summary. `sectionPositions` fixes the
 *  section columns so a section every done student skipped still shows (avg 0). */
export function summarizeRoster(rows: RosterRow[], sectionPositions: number[]): RosterSummary {
  const done = rows.filter((r) => r.status === "done");
  const inProgress = rows.filter((r) => r.status === "in_progress").length;

  const noteHistogram: Record<Note, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of done) if (r.note !== null) noteHistogram[r.note] += 1;

  const classAvgPct = done.length > 0 ? done.reduce((s, r) => s + (r.overallPct ?? 0), 0) / done.length : null;

  const sectionAvgPct = sectionPositions.map((position) => {
    const vals = done.map((r) => r.perSection.find((p) => p.position === position)?.pct ?? 0);
    const avgPct = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
    return { position, avgPct };
  });

  return {
    students: rows.length,
    done: done.length,
    inProgress,
    notStarted: rows.filter((r) => r.status === "not_started").length,
    classAvgPct,
    noteHistogram,
    sectionAvgPct,
  };
}
