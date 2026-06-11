/**
 * `content review-doc --wordbank` — generate the thorough per-unit word-bank
 * review document (full table + evidence flags), byte-stable.
 *
 * The doc is the unit's audit artifact: the reviewer (Fable, per Koki's
 * 2026-06-11 delegation) fills `> verdict:` lines and may edit de/example/
 * forms cells; `content ingest-review --wordbank` turns that into overlay
 * patches + state transitions. Every input is committed (banks, transcripts,
 * v1 snapshot) — CI can regenerate and diff these docs without iCloud.
 */
import fs from "node:fs";
import path from "node:path";
import type { FlagKind, WordBank as WordBankT, WordBankEntry } from "@domigo/content-schema";
import { WordBank } from "@domigo/content-schema";
import { asciiUmlautSuspect } from "./german.ts";
import { readJsonIfExists, sha256OfString, writeText } from "./json.ts";
import { MULTI_SEP, renderTable } from "./mdtable.ts";
import { TRANSCRIPTS_DIR, UNITS_DIR, V1_SNAPSHOT_DIR } from "./paths.ts";
import { appendTransition, currentState } from "./state.ts";
import { LOOSE_SKIP, tokenizeText, traceForms, tokenMatches, wordTokens, type TokenizedText } from "./tokenize.ts";
import { entriesContentHash } from "./wordbank.ts";

// ---------------------------------------------------------------------------
// shared row model (generator + ingest must agree byte-for-byte)
// ---------------------------------------------------------------------------

export interface ReviewRow {
  ref: string; // id suffix after ".w."
  cells: { en: string; de: string; example: string; kind: string; forms: string };
  hash: string; // sha12 of the cells
}

export function rowsForEntries(entries: WordBankEntry[]): ReviewRow[] {
  return entries.map((e) => {
    const cells = {
      en: e.en,
      de: e.de.join(MULTI_SEP),
      example: e.exampleSb ?? "—",
      kind: e.kind === "wordfile" ? (e.theme !== null ? `wf · ${e.theme}` : "wf") : "ph",
      forms: e.forms.join(MULTI_SEP),
    };
    return {
      ref: e.id.split(".w.")[1] ?? e.id,
      cells,
      hash: sha256OfString(JSON.stringify(cells)).slice(0, 12),
    };
  });
}

export interface ReviewFlag {
  key: string; // durable `${kind}:${entryId|"unit"}`
  kind: FlagKind;
  entryId: string | null;
  title: string;
  body: string[]; // explanation + evidence lines
  allowed: string; // verdict menu shown
}

export interface GeneratedReview {
  slug: string;
  grade: number;
  unit: number;
  round: number;
  bankHash12: string;
  markdown: string;
  openFlags: ReviewFlag[];
  resolvedEarlier: Array<{ key: string; verdict: string }>;
  rows: ReviewRow[];
}

// ---------------------------------------------------------------------------
// inputs
// ---------------------------------------------------------------------------

interface V1Entry {
  w: string;
  g?: string;
  d?: string;
  s?: string;
}

function loadBank(slug: string): WordBankT {
  const raw = readJsonIfExists<unknown>(path.join(UNITS_DIR, slug, "wordbank.json"));
  if (raw === null) throw new Error(`${slug}: wordbank.json missing — run \`content wordbank\` first`);
  return WordBank.parse(raw);
}

export function loadV1Unit(grade: number, unit: number): V1Entry[] | null {
  const p = path.join(V1_SNAPSHOT_DIR, `g${grade}`, `unit-${String(unit).padStart(2, "0")}.json`);
  const raw = readJsonIfExists<{ entries: V1Entry[] }>(p);
  return raw?.entries ?? null;
}

function transcriptTextForUnit(grade: number, unit: number): { text: TokenizedText | null; sb: boolean; wb: boolean } {
  const unitRe = new RegExp(`\\bunit\\s*0*${unit}(?!\\d)`, "i");
  const parts: string[] = [];
  let sb = false;
  let wb = false;
  for (const sub of ["sb", "wb"] as const) {
    const dir = path.join(TRANSCRIPTS_DIR, `g${grade}`, sub);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".txt") || !unitRe.test(name)) continue;
      parts.push(fs.readFileSync(path.join(dir, name), "utf8"));
      if (sub === "sb") sb = true;
      else wb = true;
    }
  }
  return { text: parts.length > 0 ? tokenizeText(parts.join("\n")) : null, sb, wb };
}

// cross-unit duplicate index over ALL banks (lazy, cached per process)
let dupIndex: Map<string, Array<{ slug: string; id: string }>> | null = null;

function tokenKey(s: string): string {
  return wordTokens(s).join(" ");
}

export function crossUnitIndex(): Map<string, Array<{ slug: string; id: string }>> {
  if (dupIndex !== null) return dupIndex;
  dupIndex = new Map();
  const slugs = fs.existsSync(UNITS_DIR)
    ? fs.readdirSync(UNITS_DIR).filter((n) => /^g[1-4]-u\d{2}$/.test(n)).sort()
    : [];
  for (const slug of slugs) {
    const raw = readJsonIfExists<WordBankT>(path.join(UNITS_DIR, slug, "wordbank.json"));
    if (raw === null) continue;
    for (const e of raw.entries) {
      const key = tokenKey(e.en);
      if (key.length === 0) continue;
      const list = dupIndex.get(key) ?? [];
      list.push({ slug, id: e.id });
      dupIndex.set(key, list);
    }
  }
  return dupIndex;
}

// ---------------------------------------------------------------------------
// flag computation
// ---------------------------------------------------------------------------

export function entryMatchesWord(e: WordBankEntry, w: string): boolean {
  // Article/particle-insensitive: "pain in the ankle" (v1) must match the
  // master list's "pain in ankle". Content tokens still compare 1:1.
  const wseq = wordTokens(w).filter((t) => !LOOSE_SKIP.has(t));
  if (wseq.length === 0) return false;
  for (const candidate of [e.en, ...e.forms]) {
    const seq = wordTokens(candidate).filter((t) => !LOOSE_SKIP.has(t));
    if (seq.length !== wseq.length) continue;
    if (seq.every((t, i) => tokenMatches(wseq[i] as string, t))) return true;
  }
  return false;
}

interface FlagComputation {
  flags: ReviewFlag[];
  stats: { v1Present: number; v1Total: number | null; traced: number; sb: boolean; wb: boolean; bankOnly: number };
  crossDupRefs: Map<string, string[]>; // ref → other slugs (informational ◦)
}

function computeFlags(bank: WordBankT): FlagComputation {
  const flags: ReviewFlag[] = [];
  const entries = bank.entries;

  // duplicate headwords within the unit
  const byKey = new Map<string, WordBankEntry[]>();
  for (const e of entries) {
    const k = tokenKey(e.en);
    byKey.set(k, [...(byKey.get(k) ?? []), e]);
  }
  for (const [, group] of [...byKey.entries()].sort()) {
    if (group.length < 2) continue;
    for (const e of group.slice(1)) {
      flags.push({
        key: `duplicate-headword:${e.id}`,
        kind: "duplicate-headword",
        entryId: e.id,
        title: `duplicate headword \`${e.en}\``,
        body: [
          `Same headword appears ${group.length}× in this unit: ${group.map((g) => `\`${g.id}\` (${g.kind})`).join(", ")}.`,
          `Master lists sometimes teach a word in the Word File AND as a phrase — keeping both is often right.`,
        ],
        allowed: "ok (keep both) · drop (remove THIS entry) · fix (+ note)",
      });
    }
  }

  // de-split suspects + umlaut suspects + forms suspects
  for (const e of entries) {
    const unbalanced = e.de.some((d) => (d.match(/\(/g)?.length ?? 0) !== (d.match(/\)/g)?.length ?? 0));
    const tiny = e.de.some((d) => d.replace(/[^A-Za-zÄÖÜäöüß]/g, "").length <= 1);
    if (unbalanced || tiny || e.de.length >= 4) {
      flags.push({
        key: `de-split-suspect:${e.id}`,
        kind: "de-split-suspect",
        entryId: e.id,
        title: `German split looks suspicious for \`${e.en}\``,
        body: [`deRaw: \`${e.deRaw}\` → de: ${e.de.map((d) => `\`${d}\``).join(" · ")}`, unbalanced ? "An element has unbalanced parentheses." : e.de.length >= 4 ? "4+ alternatives — verify the split." : "An element is a single character."],
        allowed: "ok · fix (edit the de cell directly, then verdict ok)",
      });
    }

    if (asciiUmlautSuspect(e.deRaw)) {
      flags.push({
        key: `ascii-umlaut-suspect:${e.id}`,
        kind: "ascii-umlaut-suspect",
        entryId: e.id,
        title: `possible ASCII umlaut in German for \`${e.en}\``,
        body: [`deRaw: \`${e.deRaw}\` — contains "ae/oe/ue" in a consonant context (e.g. "muede" for "müde").`],
        allowed: "ok (legitimate spelling) · fix (edit the de cell, then verdict ok)",
      });
    }

    const badForm = e.forms.find((f) => /^[a-zäöüß]{1,2}$/.test(f) && tokenKey(f) !== tokenKey(e.en));
    if (badForm !== undefined || e.forms.length > 6) {
      flags.push({
        key: `forms-suspect:${e.id}`,
        kind: "forms-suspect",
        entryId: e.id,
        title: `forms list needs a look for \`${e.en}\``,
        body: [`forms: ${e.forms.map((f) => `\`${f}\``).join(" · ")}`, badForm !== undefined ? `\`${badForm}\` is a 1–2 letter standalone form — it would count as a taught word for the level gate.` : "More than 6 forms."],
        allowed: "ok · fix (edit the forms cell directly, then verdict ok)",
      });
    }
  }

  // transcript tracing
  const { text, sb, wb } = transcriptTextForUnit(bank.grade, bank.unit);
  let traced = 0;
  if (text === null) {
    flags.push({
      key: `no-transcript:unit`,
      kind: "no-transcript",
      entryId: null,
      title: "no SB/WB transcript maps to this unit",
      body: ["Tracing skipped. Check the transcript filenames / extract output for this unit."],
      allowed: "ok (accept untraced) · fix (+ note)",
    });
  } else {
    for (const e of entries) {
      const result = traceForms(text, [e.en, ...e.forms]);
      if (result === "miss") {
        flags.push({
          key: `not-in-transcript:${e.id}`,
          kind: "not-in-transcript",
          entryId: e.id,
          title: `\`${e.en}\` not found in the unit's SB/WB transcript`,
          body: [
            `No form (${e.forms.map((f) => `\`${f}\``).join(", ")}) occurs in the unit transcript text, even loosely.`,
            "Master-list-only vocabulary happens (the list is canonical) — but verify it's not a parse artifact or an edition mismatch.",
          ],
          allowed: "ok (list-only vocab, keep) · drop · fix (+ note)",
        });
      } else {
        traced += 1;
      }
    }
  }

  // v1 parity
  const v1 = loadV1Unit(bank.grade, bank.unit);
  let v1Present = 0;
  const v1Missing: V1Entry[] = [];
  const v1Elsewhere: Array<{ w: string; slug: string }> = [];
  if (v1 !== null) {
    const gradeSlugs = fs
      .readdirSync(UNITS_DIR)
      .filter((n) => n.startsWith(`g${bank.grade}-`) && n !== bank.slug)
      .sort();
    for (const ve of v1) {
      if (bank.entries.some((e) => entryMatchesWord(e, ve.w))) {
        v1Present += 1;
        continue;
      }
      let elsewhere: string | null = null;
      for (const other of gradeSlugs) {
        const otherBank = readJsonIfExists<WordBankT>(path.join(UNITS_DIR, other, "wordbank.json"));
        if (otherBank !== null && otherBank.entries.some((e) => entryMatchesWord(e, ve.w))) {
          elsewhere = other;
          break;
        }
      }
      if (elsewhere !== null) v1Elsewhere.push({ w: ve.w, slug: elsewhere });
      else v1Missing.push(ve);
    }
    for (const ve of v1Missing) {
      flags.push({
        key: `v1-missing:${tokenKey(ve.w)}`,
        kind: "v1-missing",
        entryId: null,
        title: `v1 word \`${ve.w}\` is not in this bank`,
        body: [
          `v1 had: w=\`${ve.w}\`${ve.g !== undefined ? ` · g=\`${ve.g}\`` : ""}${ve.d !== undefined ? ` · d=\`${ve.d}\`` : ""}`,
          "The master list is canonical — a v1-only word is usually a v1 invention or unit misplacement.",
          "`add` recovers it into this bank (origin: v1-recovery) with the v1 German.",
        ],
        allowed: "ok (v1 artifact, leave out) · add (recover into bank) · fix (+ note)",
      });
    }
    if (v1Elsewhere.length > 0) {
      flags.push({
        key: `v1-unit-mismatch:unit`,
        kind: "v1-unit-mismatch",
        entryId: null,
        title: `${v1Elsewhere.length} v1 word(s) of this unit live in other units' banks`,
        body: [
          v1Elsewhere.map((x) => `\`${x.w}\` → ${x.slug}`).slice(0, 12).join(" · ") + (v1Elsewhere.length > 12 ? ` · … (${v1Elsewhere.length - 12} more)` : ""),
          "Unit numbering differs between v1 and the master list here (known case: v1 g4 u08/u09 are swapped). The master list wins.",
        ],
        allowed: "ok (master list wins) · fix (+ note)",
      });
    }
  }

  // bank-only (new vs v1) — informational, drives the stats line
  const bankOnly =
    v1 === null ? 0 : entries.filter((e) => !v1.some((ve) => entryMatchesWord(e, ve.w))).length;

  // cross-unit duplicates (informational ◦)
  const crossDupRefs = new Map<string, string[]>();
  const index = crossUnitIndex();
  for (const e of entries) {
    const list = index.get(tokenKey(e.en)) ?? [];
    const others = list.filter((x) => x.slug !== bank.slug).map((x) => x.slug);
    if (others.length > 0) crossDupRefs.set(e.id.split(".w.")[1] ?? e.id, others);
  }

  return {
    flags,
    stats: { v1Present, v1Total: v1?.length ?? null, traced, sb, wb, bankOnly },
    crossDupRefs,
  };
}

// ---------------------------------------------------------------------------
// document assembly
// ---------------------------------------------------------------------------

interface PrevFlags {
  round: number;
  flags: Array<{ key: string; verdict: string; note: string }>;
}
interface PrevReviewed {
  round: number;
  rows: Record<string, string>;
}

export function buildWordbankReview(slug: string): GeneratedReview {
  const bank = loadBank(slug);
  const bankHash12 = entriesContentHash(bank.entries).slice(0, 12);
  const reviewDir = path.join(UNITS_DIR, slug, "review");
  const prevFlags = readJsonIfExists<PrevFlags>(path.join(reviewDir, "wordbank.flags.json"));
  const prevReviewed = readJsonIfExists<PrevReviewed>(path.join(reviewDir, "wordbank.reviewed.json"));
  const round = (prevFlags?.round ?? 0) + 1;

  const { flags, stats, crossDupRefs } = computeFlags(bank);
  const rows = rowsForEntries(bank.entries);

  // changed-since-review flags (round ≥ 2)
  if (prevReviewed !== null) {
    for (const row of rows) {
      const prev = prevReviewed.rows[row.ref];
      if (prev !== undefined && prev !== row.hash) {
        const entry = bank.entries.find((e) => (e.id.split(".w.")[1] ?? e.id) === row.ref);
        flags.push({
          key: `changed-since-review:${entry?.id ?? row.ref}`,
          kind: "changed-since-review",
          entryId: entry?.id ?? null,
          title: `\`${entry?.en ?? row.ref}\` changed since the last review`,
          body: ["The row content differs from what was reviewed. Re-confirm it."],
          allowed: "ok · drop · fix (+ note)",
        });
      }
    }
  }

  // partition: open vs previously resolved (non-fix verdicts stick)
  const resolved = new Map<string, string>();
  for (const f of prevFlags?.flags ?? []) {
    if (f.verdict !== "fix") resolved.set(f.key, f.verdict);
  }
  const openFlags = flags.filter((f) => !resolved.has(f.key));
  const resolvedEarlier = flags
    .filter((f) => resolved.has(f.key))
    .map((f) => ({ key: f.key, verdict: resolved.get(f.key) as string }));

  // round ≥ 2: collapse reviewed-and-unchanged rows without open flags
  const openFlagEntryRefs = new Set(
    openFlags.filter((f) => f.entryId !== null).map((f) => (f.entryId as string).split(".w.")[1] ?? ""),
  );
  const showAll = prevReviewed === null;
  const shownRows = rows.filter(
    (r) => showAll || prevReviewed?.rows[r.ref] !== r.hash || openFlagEntryRefs.has(r.ref),
  );
  const collapsed = rows.length - shownRows.length;

  // stats
  const wf = bank.entries.filter((e) => e.kind === "wordfile").length;
  const themes = [...new Set(bank.entries.map((e) => e.theme).filter((t): t is string => t !== null))];

  const lines: string[] = [];
  lines.push(`# Word bank review — ${slug} (MORE! ${bank.grade}, Unit ${bank.unit})`);
  lines.push(`<!-- domigo:review wordbank ${slug} round=${round} bank=${bankHash12} -->`);
  lines.push("");
  lines.push(`**${bank.entries.length} entries** — ${wf} Word File + ${bank.entries.length - wf} Words & Phrases${themes.length > 0 ? ` · themes: ${themes.join(", ")}` : ""}`);
  lines.push(
    stats.v1Total !== null
      ? `**v1 parity:** ${stats.v1Present}/${stats.v1Total} v1 words present · ${stats.bankOnly} bank-only (new)`
      : `**v1 parity:** no v1 snapshot for this unit — run \`content v1-snapshot\``,
  );
  lines.push(`**transcripts:** SB ${stats.sb ? "✓" : "—"} · WB ${stats.wb ? "✓" : "—"} — ${stats.traced}/${bank.entries.length} traced`);
  lines.push(`**open flags:** ${openFlags.length}${resolvedEarlier.length > 0 ? ` · resolved earlier: ${resolvedEarlier.length}` : ""}${collapsed > 0 ? ` · ${collapsed} reviewed rows unchanged (collapsed)` : ""}`);
  lines.push("");
  lines.push("> Reviewer: answer every flag's `> verdict:` (menu shown per flag), then the unit verdict at the bottom.");
  lines.push("> Wrong value? Edit the **de / example / forms** cell directly — ingest converts the diff into an overlay patch.");
  lines.push("> `ref` and `en` are immutable (use drop + add instead). Multi-values separate with ` ; `.");
  lines.push("");
  lines.push(
    renderTable(
      ["ref", "en", "de", "example", "kind", "forms", "⚑"],
      shownRows.map((r) => {
        const fRefs = openFlags
          .map((f, i) => ({ f, n: i + 1 }))
          .filter(({ f }) => f.entryId !== null && ((f.entryId as string).split(".w.")[1] ?? "") === r.ref)
          .map(({ n }) => `F${n}`);
        const dup = crossDupRefs.has(r.ref) ? ["◦"] : [];
        return [r.ref, r.cells.en, r.cells.de, r.cells.example, r.cells.kind, r.cells.forms, [...fRefs, ...dup].join(" ")];
      }),
    ),
  );
  lines.push("");

  if (openFlags.length > 0) {
    lines.push("## Flags");
    openFlags.forEach((f, i) => {
      lines.push("");
      // heading carries the durable key ref (entry id, token key, or "unit") —
      // ingest reconstructs the flag key as `${kind}:${ref}`
      lines.push(`### F${i + 1} · ${f.kind} · \`${f.key.slice(f.kind.length + 1)}\``);
      lines.push(f.title);
      for (const b of f.body) lines.push(`- ${b}`);
      lines.push(`Allowed: ${f.allowed}`);
      lines.push("> verdict: _");
      lines.push("> note:");
    });
    lines.push("");
  }
  if (resolvedEarlier.length > 0) {
    lines.push(`_Previously resolved (sticky): ${resolvedEarlier.map((r) => `${r.key} → ${r.verdict}`).join(" · ")}_`);
    lines.push("");
  }

  lines.push("## Unit verdict");
  lines.push("> unit: _        (ok = approve this bank · changes = fixes needed, re-present)");
  lines.push("> note:");

  if (crossDupRefs.size > 0) {
    lines.push("");
    lines.push("### Appendix — cross-unit duplicates (informational, first occurrence wins the level gate)");
    for (const [ref, others] of [...crossDupRefs.entries()].sort()) {
      lines.push(`- \`${ref}\` also in: ${others.join(", ")}`);
    }
  }
  lines.push("");

  return { slug, grade: bank.grade, unit: bank.unit, round, bankHash12, markdown: lines.join("\n"), openFlags, resolvedEarlier, rows };
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

export function runReviewDocWordbank(filter: { grade?: number; unit?: string }): void {
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .filter((n) => (filter.unit !== undefined ? n === filter.unit : true))
    .filter((n) => (filter.grade !== undefined ? n.startsWith(`g${filter.grade}-`) : true))
    .sort();
  if (slugs.length === 0) throw new Error("no units match the filter");

  let written = 0;
  let skipped = 0;
  for (const slug of slugs) {
    // An approved unit with an unchanged bank needs no new review round —
    // regenerating would regress its state. (V-A drift forces re-review.)
    const last = currentState(path.join(UNITS_DIR, slug));
    if (last?.state === "wordbank_approved") {
      const bank = loadBank(slug);
      if (last.contentHash === entriesContentHash(bank.entries)) {
        skipped += 1;
        continue;
      }
    }
    const review = buildWordbankReview(slug);
    const outPath = path.join(UNITS_DIR, slug, "review", "wordbank.review.md");
    if (writeText(outPath, review.markdown)) written += 1;
    appendTransition(path.join(UNITS_DIR, slug), slug, {
      state: "wordbank_review",
      by: "pipeline",
      contentHash: review.bankHash12,
      note: `round ${review.round} doc: ${review.openFlags.length} open flag(s)`,
    });
    console.log(`${slug}: round ${review.round}, ${review.openFlags.length} open flag(s), ${review.rows.length} rows`);
  }
  console.log(`review-doc: ${slugs.length} unit(s), ${written} doc(s) updated${skipped > 0 ? `, ${skipped} approved unit(s) skipped` : ""}.`);
}
