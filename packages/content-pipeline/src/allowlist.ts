/**
 * Core-allowlist review round:
 *   content review-doc --allowlist     → content/corpus/review/core-allowlist.review.md
 *   content ingest-review --allowlist  → content/overlays/core-allowlist.json
 *
 * The table itself is the artifact: the reviewer may delete rows (token
 * rejected) or add rows (token + category) before approving. Cross-checks per
 * token: taught-in (bank entries with the same headword) and transcript
 * frequency per grade — zero frequency everywhere is suspicious for a word
 * that's supposedly ubiquitous.
 */
import fs from "node:fs";
import path from "node:path";
import { CoreAllowlist } from "@domigo/content-schema";
import { CORE_ALLOWLIST_SEED } from "./data/core-allowlist-seed.ts";
import { readJsonIfExists, sha256OfString, writeJson, writeText } from "./json.ts";
import { parseTables, parseVerdicts, renderTable } from "./mdtable.ts";
import { CONTENT_DIR, OVERLAYS_DIR, TRANSCRIPTS_DIR } from "./paths.ts";
import { tokenizeText } from "./tokenize.ts";
import { crossUnitIndex } from "./review-wordbank.ts";

const REVIEW_PATH = path.join(CONTENT_DIR, "corpus", "review", "core-allowlist.review.md");
const OVERLAY_PATH = path.join(OVERLAYS_DIR, "core-allowlist.json");
const MARKER = /<!-- domigo:review allowlist seed=([0-9a-f]{12}) -->/;

function seedHash(): string {
  return sha256OfString(JSON.stringify(CORE_ALLOWLIST_SEED)).slice(0, 12);
}

function gradeFrequencies(): Map<string, number[]> {
  const freq = new Map<string, number[]>();
  for (let g = 1; g <= 4; g += 1) {
    const counts = new Map<string, number>();
    for (const sub of ["sb", "wb"]) {
      const dir = path.join(TRANSCRIPTS_DIR, `g${g}`, sub);
      if (!fs.existsSync(dir)) continue;
      for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".txt")) continue;
        const { tokens } = tokenizeText(fs.readFileSync(path.join(dir, name), "utf8"));
        for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    for (const { token } of CORE_ALLOWLIST_SEED) {
      const arr = freq.get(token) ?? [0, 0, 0, 0];
      arr[g - 1] = counts.get(token) ?? 0;
      freq.set(token, arr);
    }
  }
  return freq;
}

export function runReviewDocAllowlist(): void {
  const freq = gradeFrequencies();
  const bankIndex = crossUnitIndex();

  const rows = CORE_ALLOWLIST_SEED.map(({ token, category }) => {
    const f = freq.get(token) ?? [0, 0, 0, 0];
    const taughtIn = (bankIndex.get(token) ?? []).map((x) => x.slug).slice(0, 4);
    const issues: string[] = [];
    if (f.every((n) => n === 0)) issues.push("zero-freq");
    if (taughtIn.length > 0) issues.push("also-taught");
    return [token, category, f.join(" / "), taughtIn.join(" "), issues.join(" ")];
  });

  const lines = [
    "# Core allowlist review — closed-class tokens (assumed known at every level)",
    `<!-- domigo:review allowlist seed=${seedHash()} -->`,
    "",
    `**${CORE_ALLOWLIST_SEED.length} tokens.** These never require a gloss; the V5 level gate consumes the approved list verbatim.`,
    "",
    "> Reviewer: delete a row to REJECT the token; add a row (token + category) to extend.",
    "> `zero-freq` = token never occurs in any transcript (suspicious for a 'ubiquitous' word).",
    "> `also-taught` = a unit word bank teaches the same headword (allowlist still fine — it just means the gate would pass it anyway).",
    "",
    renderTable(["token", "category", "freq g1/g2/g3/g4", "taught in", "issues"], rows),
    "",
    "## List verdict",
    "> unit: _        (ok = approve the table above as THE allowlist · changes = re-present)",
    "> note:",
    "",
  ];
  writeText(REVIEW_PATH, lines.join("\n"));
  console.log(`allowlist review doc: ${CORE_ALLOWLIST_SEED.length} tokens → ${path.relative(process.cwd(), REVIEW_PATH)}`);
}

export function runIngestAllowlist(dryRun: boolean): void {
  if (!fs.existsSync(REVIEW_PATH)) throw new Error("allowlist review doc not found — run `content review-doc --allowlist`");
  const md = fs.readFileSync(REVIEW_PATH, "utf8");
  const marker = MARKER.exec(md);
  if (marker === null || marker[1] !== seedHash()) {
    throw new Error("allowlist review doc is stale (seed changed) — regenerate");
  }
  const table = parseTables(md).find((t) => t.headers[0] === "token");
  if (table === undefined) throw new Error("allowlist table not found");
  const verdict = parseVerdicts(md).unit;
  if (verdict === null || verdict.verdict === null) throw new Error("list verdict missing — fill `> unit:`");
  if (verdict.verdict !== "ok") {
    console.log(`allowlist: verdict=${verdict.verdict} — nothing written`);
    return;
  }
  const tokens = table.rows
    .map((r) => ({ token: (r["token"] ?? "").trim().toLowerCase(), category: (r["category"] ?? "").trim() || "uncategorised", note: null }))
    .filter((t) => t.token.length > 0);
  if (tokens.length === 0) throw new Error("allowlist table is empty");
  const dupes = tokens.map((t) => t.token).filter((t, i, a) => a.indexOf(t) !== i);
  if (dupes.length > 0) throw new Error(`duplicate allowlist tokens: ${[...new Set(dupes)].join(", ")}`);

  const out = CoreAllowlist.parse({ schema: "core-allowlist@1", reviewedBy: "fable", tokens });
  console.log(`allowlist: ${tokens.length} token(s) approved${verdict.note.length > 0 ? ` — note: ${verdict.note}` : ""}`);
  if (dryRun) {
    console.log("(dry run — nothing written)");
    return;
  }
  writeJson(OVERLAY_PATH, out);
  console.log(`wrote ${path.relative(process.cwd(), OVERLAY_PATH)}`);
}

/** The approved allowlist tokens, or null before approval (V5 consumes this). */
export function approvedAllowlist(): Set<string> | null {
  const raw = readJsonIfExists<unknown>(OVERLAY_PATH);
  if (raw === null) return null;
  return new Set(CoreAllowlist.parse(raw).tokens.map((t) => t.token));
}
