/**
 * K9b · The CLIENT half of the roster parser — the twin of
 * packages/db/src/roster-service.ts (`firstCell`, `cleanCell`, `parseRoster`).
 *
 * Why a twin at all: `@domigo/db` is server-only (its index opens a Neon client), so
 * it must never enter the browser bundle — but the review list the teacher confirms,
 * and the count on the import button, have to be EXACTLY what the server will insert.
 * The rule therefore exists twice, byte-for-byte, and both copies are pinned by the
 * SAME fixture list: `roster-parse.test.ts` here and `roster-service.test.ts` there.
 * Change one side and the other's test goes red.
 *
 * No React, no "use client" — a plain module so `node --test` can run it.
 *
 * ── the rule ────────────────────────────────────────────────────────────────
 * FIRST CELL WINS. A real export carries more than the name — `Anna;5B`,
 * `Anna\tAnna.Mueller@…`, `"Mueller, Anna";5B`. Each line is reduced to its first
 * cell so the rest of the pipeline sees what it always saw: one name per line.
 *
 * Deliberately narrow, because the ONE thing it must not break is a name containing
 * a comma:
 *   • a leading double-quote OPENS a protected cell — everything up to the closing
 *     quote is the name, internal comma and all, and whatever follows is dropped;
 *   • otherwise a `;` or a TAB (never a bare comma) ends the first cell;
 *   • a line with neither stays WHOLE — `Mueller, Anna` is one name, not two cells.
 * That last case is the declared boundary: an unquoted comma cannot be told apart
 * from a European surname-first spelling, so the forgiving reading wins.
 */

/** Reduce one raw line to its first cell (see the rule above). */
export function firstCell(raw: string): string {
  const s = raw.trim();
  if (s.startsWith('"')) {
    const close = s.indexOf('"', 1);
    if (close > 0) return s.slice(0, close + 1); // keep the pair; cleanCell strips it
  }
  const sep = s.search(/[;\t]/);
  return sep === -1 ? s : s.slice(0, sep);
}

/**
 * Normalize one line into a clean name: first cell, then strip a one-column-CSV
 * trailing comma, then strip a surrounding pair of double quotes (a spreadsheet
 * paste often yields `"Anna",`). Returns "" for a blank line so the caller drops it.
 */
export function cleanCell(raw: string): string {
  let s = firstCell(raw);
  if (s.endsWith(",")) s = s.slice(0, -1).trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
  return s;
}

/**
 * Parse a pasted or uploaded roster — one student per LINE. Drops blanks and dedupes
 * case-insensitively, PRESERVING the first casing seen ("Anna" then "anna" ⇒ "Anna").
 */
export function previewRoster(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const name = cleanCell(raw);
    if (name === "") continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}
