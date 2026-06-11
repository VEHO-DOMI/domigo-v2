/**
 * Typed reader for the COMMITTED v1 grammar snapshot
 * (content/build/v1/grammar/m{1-4}.json — run `content v1-snapshot`).
 *
 * v1 module files use SHORT field names (verified 2026-06-11):
 * structures {id, u, n, nd, cat, desc, rules[{id,t,td,ex[{en,de}]}],
 * kf{category→examples[]}, errs[{d,w,c}]}; items {id, sid, u, t, d:1-5,
 * p, c, a[], ds[], h, hd, e, ed} — matching/verb-table pack JSON in `c`.
 * The long-name fields live only in grammar-index.json.
 *
 * v1 is an UNTRUSTED seed + parity floor — never copied unverified.
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade } from "@domigo/content-schema";
import { V1_GRAMMAR_SNAPSHOT_DIR } from "./paths.ts";

export interface V1GrammarStructure {
  id: string;
  u: number;
  n: string;
  nd: string;
  cat: string;
  desc: string;
  rules?: Array<{
    id: string;
    t: string;
    td: string;
    ex?: Array<{ en: string; de: string }>;
  }>;
  kf?: Record<string, string[]>;
  errs?: Array<{ d: string; w: string; c: string }>;
}

export interface V1GrammarItem {
  id: string;
  sid: string;
  u: number;
  t: string;
  d: number;
  p: string;
  c: string;
  a?: string[];
  ds?: string[];
  h?: string;
  hd?: string;
  e?: string;
  ed?: string;
}

export interface V1GrammarModule {
  module: string;
  grade: number;
  structures: V1GrammarStructure[];
  items: V1GrammarItem[];
}

export function loadV1GrammarModule(grade: Grade): {
  module: V1GrammarModule;
  raw: string;
} {
  const file = path.join(V1_GRAMMAR_SNAPSHOT_DIR, `m${grade}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`no v1 grammar snapshot at ${file} — run \`content v1-snapshot\``);
  }
  const raw = fs.readFileSync(file, "utf8");
  return { module: JSON.parse(raw) as V1GrammarModule, raw };
}

/** Items grouped by structure id (stage-4 stats, stage-5 seeds, V-19 floors). */
export function v1ItemsByStructure(
  module: V1GrammarModule,
): Map<string, V1GrammarItem[]> {
  const by = new Map<string, V1GrammarItem[]>();
  for (const item of module.items) {
    const list = by.get(item.sid);
    if (list === undefined) by.set(item.sid, [item]);
    else list.push(item);
  }
  return by;
}
