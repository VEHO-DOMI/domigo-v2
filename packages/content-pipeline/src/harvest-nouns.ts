/**
 * `content harvest-nouns` — deterministic proper-noun harvest from committed
 * transcripts + bank example sentences, per unit, into
 * content/build/proper-nouns.json (consumed by the V-5 level gate).
 *
 * A candidate is a capitalized token that occurs NOT sentence-initially at
 * least twice in the unit's material, is not already taught (cumulative bank
 * + allowlist), and is not on the audited rejects overlay
 * (content/overlays/proper-noun-rejects.json). False positives make the gate
 * permissive, never red — lens 1 and the review still see those words.
 * CI recomputes the harvest and fails on drift (V-22).
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade, WordBank } from "@domigo/content-schema";
import { GRADES, UNITS_PER_GRADE, unitSlug } from "@domigo/content-schema";
import { buildAllowedMatcher, PROPER_NOUNS_PATH, type ProperNounsFile } from "./cumulative-bank.ts";
import { readJsonIfExists, writeJson } from "./json.ts";
import { OVERLAYS_DIR, TRANSCRIPTS_DIR, UNITS_DIR } from "./paths.ts";

export interface ProperNounRejects {
  schema: "proper-noun-rejects@1";
  rejects: Array<{ token: string; reason: string; by: string }>;
}

/**
 * Count non-sentence-initial occurrences of capitalized tokens.
 * Sentence-initial = first token of a line or directly after [.!?:…"»;]+ —
 * transcripts are line-broken, so line starts count as sentence starts.
 */
export function countCapitalizedNonInitial(texts: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const text of texts) {
    for (const line of text.split("\n")) {
      // split into sentence-ish fragments; the first token of each is "initial"
      const fragments = line.split(/[.!?:…;]+[\s"»“”‘’']*/);
      for (const fragment of fragments) {
        const tokens = fragment.match(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß']*/g) ?? [];
        for (let i = 1; i < tokens.length; i += 1) {
          const raw = tokens[i]!;
          const m = /^([A-Z][a-z]+)(?:'s)?$/.exec(raw);
          if (m === null) continue;
          const token = m[1]!;
          counts.set(token, (counts.get(token) ?? 0) + 1);
        }
      }
    }
  }
  return counts;
}

function unitTexts(grade: Grade, unit: number): string[] {
  const unitRe = new RegExp(`\\bunit\\s*0*${unit}(?!\\d)`, "i");
  const parts: string[] = [];
  for (const sub of ["sb", "wb"] as const) {
    const dir = path.join(TRANSCRIPTS_DIR, `g${grade}`, sub);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".txt") || !unitRe.test(name)) continue;
      parts.push(fs.readFileSync(path.join(dir, name), "utf8"));
    }
  }
  const bank = readJsonIfExists<WordBank>(
    path.join(UNITS_DIR, unitSlug(grade, unit), "wordbank.json"),
  );
  for (const e of bank?.entries ?? []) {
    if (e.exampleSb !== null) parts.push(e.exampleSb);
  }
  return parts;
}

/** Pure-ish builder (reads committed artifacts only) — also used by V-22 drift check. */
export function buildHarvest(): ProperNounsFile {
  const rejects = readJsonIfExists<ProperNounRejects>(
    path.join(OVERLAYS_DIR, "proper-noun-rejects.json"),
  );
  const rejected = new Set((rejects?.rejects ?? []).map((r) => r.token.toLowerCase()));

  const units: ProperNounsFile["units"] = {};
  for (const grade of GRADES) {
    for (let unit = 1; unit <= UNITS_PER_GRADE[grade]; unit += 1) {
      const slug = unitSlug(grade, unit);
      const counts = countCapitalizedNonInitial(unitTexts(grade, unit));
      // membership check WITHOUT nouns (the harvest feeds the noun list)
      const matcher = buildAllowedMatcher(slug, { nouns: false });
      const list: Array<{ token: string; count: number }> = [];
      for (const [token, count] of counts.entries()) {
        if (count < 2) continue;
        const lower = token.toLowerCase();
        if (rejected.has(lower)) continue;
        if (matcher.has(lower)) continue;
        list.push({ token, count });
      }
      list.sort((a, b) => a.token.localeCompare(b.token));
      if (list.length > 0) units[slug] = list;
    }
  }
  return { schema: "proper-nouns@1", units };
}

export function runHarvestNouns(): void {
  const harvest = buildHarvest();
  const changed = writeJson(PROPER_NOUNS_PATH, harvest);
  const total = Object.values(harvest.units).reduce((n, l) => n + l.length, 0);
  console.log(
    `harvest-nouns: ${total} proper noun(s) across ${Object.keys(harvest.units).length} unit(s) — ${changed ? "written" : "unchanged"}\n  → ${PROPER_NOUNS_PATH}`,
  );
}
