#!/usr/bin/env -S node --experimental-strip-types
/**
 * probe-gate — ask the REAL cumulative level gate whether text is in-level for a unit.
 *
 *   node --experimental-strip-types packages/content-pipeline/scripts/probe-gate.ts <slug> <text> [<text> ...]
 *
 * For each text argument it prints the tokens the gate does NOT cover (the exact
 * set V-5 would flag). Empty output for an argument means fully in-level.
 * Pass whole carrier sentences, definitions, distractors, MC options — anything
 * student-facing. Use this BEFORE authoring to avoid level-gate rejects; the gate
 * is far stricter than intuition (bank multiword entries index as first-token
 * phrases, so everyday words can be untaught).
 *
 * Flags:
 *   --gloss "w1,w2"   treat these as the item's own gloss[] (allowed for this call)
 *   --no-nouns        exclude harvested proper nouns from the gate
 */
import { buildAllowedMatcher, grantsForUnit } from "../src/cumulative-bank.ts";

const argv = process.argv.slice(2);
let glossWords: string[] = [];
let nouns = true;
const positional: string[] = [];
for (let i = 0; i < argv.length; i += 1) {
  const a = argv[i]!;
  if (a === "--gloss") {
    glossWords = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  } else if (a === "--no-nouns") {
    nouns = false;
  } else {
    positional.push(a);
  }
}

const slug = positional.shift();
if (slug === undefined || positional.length === 0) {
  console.error('usage: probe-gate <slug> <text> [<text> ...] [--gloss "w1,w2"] [--no-nouns]');
  process.exit(2);
}

const matcher = buildAllowedMatcher(slug, { nouns });
const granted = grantsForUnit(slug).unitWide; // unit-wide audited grants, exactly as the validator applies them
let anyUnknown = false;
for (const text of positional) {
  const unknown = matcher.unknownTokens(text, { extraPhrases: glossWords, grantedTokens: granted });
  if (unknown.length > 0) {
    anyUnknown = true;
    console.log(`UNTAUGHT  ${JSON.stringify(unknown)}  ← ${text}`);
  } else {
    console.log(`ok        ${text}`);
  }
}
process.exit(anyUnknown ? 1 : 0);
