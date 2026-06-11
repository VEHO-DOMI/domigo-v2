/**
 * Deterministic markdown table render/parse + verdict-line lexer.
 * Used by the word-bank review round now; the stage-8 item review reuses it.
 *
 * Robustness contract:
 *  - parsing is whitespace/alignment-insensitive (split on unescaped `|`)
 *  - columns are addressed by header name, never by position math
 *  - ` ; ` is the multi-value separator (de/forms) — never a comma
 *  - `\|` escapes pipes inside cells; newlines render as ` ⏎ `
 */

export const MULTI_SEP = " ; ";

export function escapeCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ⏎ ").trim();
}

export function unescapeCell(s: string): string {
  return s.replace(/\\\|/g, "|").replace(/ ⏎ /g, "\n").trim();
}

export function renderTable(headers: string[], rows: string[][]): string {
  const lines = [
    `| ${headers.map(escapeCell).join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((r) => `| ${r.map(escapeCell).join(" | ")} |`),
  ];
  return lines.join("\n");
}

export interface ParsedTable {
  headers: string[];
  /** row objects keyed by header name */
  rows: Array<Record<string, string>>;
}

function splitRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i] as string;
    if (ch === "\\" && line[i + 1] === "|") {
      cur += "\\|";
      i += 1;
      continue;
    }
    if (ch === "|") {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  // drop the empty leading/trailing segments produced by | … |
  if (cells.length > 0 && cells[0]?.trim() === "") cells.shift();
  if (cells.length > 0 && cells[cells.length - 1]?.trim() === "") cells.pop();
  return cells.map(unescapeCell);
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
}

/** Parse every table in a markdown document. */
export function parseTables(md: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string;
    if (!line.trimStart().startsWith("|")) {
      i += 1;
      continue;
    }
    const block: string[] = [];
    while (i < lines.length && (lines[i] as string).trimStart().startsWith("|")) {
      block.push(lines[i] as string);
      i += 1;
    }
    if (block.length < 2) continue;
    const headers = splitRow(block[0] as string);
    const body = block.slice(1).map(splitRow).filter((cells) => !isSeparatorRow(cells));
    const rows: Array<Record<string, string>> = [];
    for (const cells of body) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = cells[idx] ?? "";
      });
      rows.push(row);
    }
    tables.push({ headers, rows });
  }
  return tables;
}

// ---------------------------------------------------------------------------
// verdict lexer
// ---------------------------------------------------------------------------

export interface FlagBlock {
  /** durable key from the heading: `<kind> · \`<entryId|unit>\`` */
  kind: string;
  ref: string; // entryId or "unit"
  verdict: string | null; // null = unanswered ("_")
  note: string;
  headingLine: number;
}

export interface ParsedVerdicts {
  flags: FlagBlock[];
  unit: { verdict: string | null; note: string; line: number } | null;
}

const FLAG_HEADING = /^###\s+F\d+\s+·\s+([a-z0-9-]+)\s+·\s+`([^`]+)`/;
const VERDICT_LINE = /^>\s*verdict:\s*(.*)$/;
const NOTE_LINE = /^>\s*note:\s*(.*)$/;
const UNIT_LINE = /^>\s*unit:\s*(.*)$/;

function cleanVerdict(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (v === "" || v === "_" || v === "…") return null;
  return (v.split(/[\s—-]+/)[0] ?? null) || null;
}

export function parseVerdicts(md: string): ParsedVerdicts {
  const lines = md.split("\n");
  const flags: FlagBlock[] = [];
  let unit: ParsedVerdicts["unit"] = null;
  let current: FlagBlock | null = null;

  lines.forEach((line, idx) => {
    const heading = FLAG_HEADING.exec(line);
    if (heading !== null) {
      current = { kind: heading[1] as string, ref: heading[2] as string, verdict: null, note: "", headingLine: idx + 1 };
      flags.push(current);
      return;
    }
    const v = VERDICT_LINE.exec(line);
    if (v !== null && current !== null) {
      current.verdict = cleanVerdict(v[1] ?? "");
      return;
    }
    const n = NOTE_LINE.exec(line);
    if (n !== null && current !== null) {
      const text = (n[1] ?? "").trim();
      if (text.length > 0) current.note = current.note.length > 0 ? `${current.note}\n${text}` : text;
      return;
    }
    const u = UNIT_LINE.exec(line);
    if (u !== null) {
      unit = { verdict: cleanVerdict(u[1] ?? ""), note: "", line: idx + 1 };
      current = null;
      return;
    }
    if (unit !== null && current === null) {
      const un = NOTE_LINE.exec(line);
      if (un !== null) {
        const text = (un[1] ?? "").trim();
        if (text.length > 0) unit.note = unit.note.length > 0 ? `${unit.note}\n${text}` : text;
      }
    }
  });

  return { flags, unit };
}
