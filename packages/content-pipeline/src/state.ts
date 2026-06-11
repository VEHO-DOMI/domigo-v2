/**
 * Per-unit audit state log (state.json) — append-only transitions.
 * The last entry is the current state. Timestamps are real wall-clock, but
 * entries are only appended when content actually changes, so unchanged
 * re-runs stay byte-stable.
 */
import path from "node:path";
import { readJsonIfExists, writeJson } from "./json.ts";

export interface StateTransitionRow {
  state: string;
  at: string;
  by: string;
  contentHash: string | null;
  note: string | null;
}

export interface StateLogFile {
  schema: "unit-state@1";
  slug: string;
  transitions: StateTransitionRow[];
}

export function readStateLog(unitDir: string): StateLogFile | null {
  return readJsonIfExists<StateLogFile>(path.join(unitDir, "state.json"));
}

export function currentState(unitDir: string): StateTransitionRow | null {
  const log = readStateLog(unitDir);
  return log?.transitions[log.transitions.length - 1] ?? null;
}

/** Stage-2 transition: (re)parse produced a wordbank draft. */
export function recordState(unitDir: string, slug: string, contentHash: string): void {
  const statePath = path.join(unitDir, "state.json");
  const existing = readJsonIfExists<StateLogFile>(statePath);
  if (existing === null) {
    writeJson(statePath, {
      schema: "unit-state@1",
      slug,
      transitions: [
        { state: "extracted", at: new Date().toISOString(), by: "pipeline", contentHash: null, note: "master list parsed" },
        { state: "wordbank_draft", at: new Date().toISOString(), by: "pipeline", contentHash, note: null },
      ],
    } satisfies StateLogFile);
    return;
  }
  const last = existing.transitions[existing.transitions.length - 1];
  if (last !== undefined && last.contentHash === contentHash) return; // unchanged → byte-stable
  existing.transitions.push({
    state: "wordbank_draft",
    at: new Date().toISOString(),
    by: "pipeline",
    contentHash,
    note: last?.state === "wordbank_draft" ? "re-parse changed content" : "re-parse after later state — review impact",
  });
  writeJson(statePath, existing);
}

/** Generic transition appender (review/ingest stages). No-op if identical to last. */
export function appendTransition(unitDir: string, slug: string, row: Omit<StateTransitionRow, "at">): void {
  const statePath = path.join(unitDir, "state.json");
  const existing = readJsonIfExists<StateLogFile>(statePath) ?? {
    schema: "unit-state@1" as const,
    slug,
    transitions: [],
  };
  const last = existing.transitions[existing.transitions.length - 1];
  if (last !== undefined && last.state === row.state && last.contentHash === row.contentHash) return;
  existing.transitions.push({ ...row, at: new Date().toISOString() });
  writeJson(statePath, existing);
}
