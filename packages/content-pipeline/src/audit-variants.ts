/**
 * `content audit-variants` — E-2 (BLUEPRINT_V2 A-1): the deterministic
 * variant-completeness audit. Finds the answer-pool gaps that mark a correct
 * child wrong (the v1 failure mode) and emits a machine worklist for the
 * curation fix waves (handover/17 §4). An AUDIT, not a gate: always exits 0;
 * CI never runs it; its committed report is the input to K-4 calibration and
 * the A-5 waves, and S-4's health dashboard reads the JSON later.
 *
 * Rules (severity: critical = a defensible student answer grades wrong or an
 * authored answer is unreachable; advisory = needs a human look):
 *  R1 article variants — a vocab `enToDe` pool built on a German noun must
 *     accept BOTH the bare form and the der/die/das form at full tier.
 *  R2 contraction symmetry — typed text formats accept short and long forms
 *     alike (n't/'re/'m/'ll/'ve + won't/can't irregulars); ambiguous 's/'d
 *     are advisory-only. Chip/tile formats are deliberately out of scope
 *     (the tactile layer derives its chips from the answer surface).
 *  R3 single-accepted-answer — free-form / question-formation / transformation
 *     with exactly one full answer near-always under-accepts (the E-4
 *     blind-solve cross-check seed).
 *  R4 blank/segment integrity — every answer on every tier must carry exactly
 *     as many pipe segments as its prompt has blanks, else it is unreachable
 *     (exactMatch length-compares parts). Vocab carriers audited too.
 *  R5 direction purity — the V-23 language lens over BOTH tiers of the
 *     translation pools (V-23 hard-fails full-tier at CI; R5 adds the
 *     partial-tier view and the per-grade trend line).
 *
 * Runs over the OVERLAY-APPLIED view (content-loader `loadUnit`) — the audit
 * must see exactly what the runtime grades against.
 */
import fs from "node:fs";
import path from "node:path";
import { countBlanks, type GrammarItem, type TieredAnswer, type VocabItem } from "@domigo/content-schema";
import { corpusStamp } from "./corpus-stamp.ts";
import { ITEM_FIXES_PATH, readUnitItems, type ItemFixes } from "./gen-items.ts";
import { readJsonIfExists } from "./json.ts";
import { langEvidence } from "./validate-items.ts";
import { CONTENT_DIR, UNITS_DIR } from "./paths.ts";

export type Severity = "critical" | "advisory";

export interface Finding {
  itemId: string;
  unitSlug: string;
  rule: "R1" | "R2" | "R3" | "R4" | "R5";
  severity: Severity;
  evidence: string;
  suggestion: string;
}

/** The typed text formats (mirror of the engine's gradeText surface). */
const TYPED_FORMATS = new Set([
  "gap-fill",
  "translation",
  "transformation",
  "error-correction",
  "question-formation",
  "free-form",
]);

const R3_FORMATS = new Set(["free-form", "question-formation", "transformation"]);

// ---------------------------------------------------------------------------
// R2 · contraction table — unambiguous pairs expand deterministically;
// 's (is/has/possessive) and 'd (would/had) only ever ADD an advisory.
// ---------------------------------------------------------------------------

const IRREGULAR: Array<[string, string]> = [
  ["won't", "will not"],
  ["can't", "cannot"],
  ["shan't", "shall not"],
];
const SUFFIX: Array<[string, string]> = [
  ["n't", " not"],
  ["'re", " are"],
  ["'m", " am"],
  ["'ll", " will"],
  ["'ve", " have"],
];
const AMBIGUOUS = ["'s", "'d"];

const canon = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Expand every unambiguous contraction in `text`; identity when none. */
export function expandContractions(text: string): string {
  let out = ` ${text.toLowerCase()} `;
  for (const [short, long] of IRREGULAR) out = out.split(short).join(long);
  for (const [short, long] of SUFFIX) {
    // suffix form: attach to the preceding word (don't → do not, isn't → is not)
    out = out.replace(new RegExp(`(\\p{L}+)${short.replace("'", "'")}`, "gu"), (_m, w: string) =>
      short === "n't" && w.toLowerCase() === "wo" ? "will not" : `${w}${long}`,
    );
  }
  return canon(out);
}

/** True when `text` contains an ambiguous 's/'d contraction. */
export function hasAmbiguousContraction(text: string): boolean {
  return AMBIGUOUS.some((suf) => new RegExp(`\\p{L}${suf.replace("'", "'")}(\\s|$)`, "u").test(text.toLowerCase()));
}

/** True when a negative contraction sits in a SUBJECT-AUXILIARY INVERSION — a
 *  question tag ("…, isn't she?") or a negative question ("Isn't she coming?").
 *  There the naïve expansion is ungrammatical ("is not she?"); the correct form
 *  inverts the subject ("is she not?") and is archaic, so no expanded twin exists.
 *  Detect: a "…n't" (incl. won't/can't/shan't) immediately followed by a subject pronoun. */
export function hasInvertedContraction(text: string): boolean {
  return /n't\s+(i|you|he|she|it|we|they)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// R1 · German-noun article variants
// ---------------------------------------------------------------------------

const ARTICLE = /^(der|die|das|ein|eine)\s+(\S+)$/i;
/** A single capitalized German token (the classic noun gloss shape). Must END in a
 *  letter: a trailing hyphen marks a combining PREFIX (Lieblings-, Multimilliarden-),
 *  not a standalone noun — a prefix can't take an article, so it's no R1 candidate. */
const BARE_NOUN = /^[A-ZÄÖÜ][a-zäöüß-]*[a-zäöüß]$/;
/** Proper nouns that match the bare-noun shape but take no citation article
 *  (place names) — a curated R1 exclusion so they aren't flagged as missing one. */
const R1_PROPER_EXCLUDE = new Set(["Zentralasien", "Mittelasien"]);

// ---------------------------------------------------------------------------
// per-item audits (pure — fixture-tested)
// ---------------------------------------------------------------------------

export function auditVocabItem(slug: string, it: VocabItem): Finding[] {
  const out: Finding[] = [];
  const fulls = (it.translation?.enToDe ?? []).filter((a) => a.tier === "full").map((a) => a.text.trim());
  const canonSet = new Set(fulls.map(canon));

  // R1 — eligible when the pool clearly carries a noun (an article form present,
  // or the gloss is a single capitalized token). Multi-word phrase glosses
  // ("der gleichen Meinung sein") stay out of scope — conservative by design.
  const articleForms = fulls.filter((t) => ARTICLE.test(t) && BARE_NOUN.test(t.replace(ARTICLE, "$2")));
  const bareNounForms = fulls.filter((t) => BARE_NOUN.test(t) && !R1_PROPER_EXCLUDE.has(t));
  const gBare = (it.g ?? "").trim();
  const eligible = articleForms.length > 0 || (BARE_NOUN.test(gBare) && !R1_PROPER_EXCLUDE.has(gBare) && fulls.length > 0);
  if (eligible) {
    const missingBare =
      articleForms.length > 0 && !articleForms.some((t) => canonSet.has(canon(t.replace(ARTICLE, "$2"))));
    const missingArticle = articleForms.length === 0 && bareNounForms.length > 0;
    if (missingBare) {
      out.push({
        itemId: it.id, unitSlug: slug, rule: "R1", severity: "critical",
        evidence: `enToDe full pool [${fulls.join(" | ")}] has article form(s) but no bare noun`,
        suggestion: `add ${JSON.stringify(articleForms[0]!.replace(ARTICLE, "$2"))} as a full answer`,
      });
    } else if (missingArticle) {
      out.push({
        itemId: it.id, unitSlug: slug, rule: "R1", severity: "critical",
        evidence: `enToDe full pool [${fulls.join(" | ")}] has bare noun(s) but no der/die/das form`,
        suggestion: `add the article form of ${JSON.stringify(bareNounForms[0])} as a full answer`,
      });
    }
  }

  // R4 — carrier answers must fit the carrier's blank count.
  const blanks = countBlanks(it.s ?? "");
  if (blanks >= 1) {
    for (const a of it.sAnswers ?? []) {
      const segs = a.text.split("|").length;
      if (segs !== blanks) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R4", severity: "critical",
          evidence: `carrier has ${blanks} blank(s) but sAnswers ${JSON.stringify(a.text)} has ${segs} segment(s)`,
          suggestion: "re-author the answer with one pipe segment per blank",
        });
      }
    }
  }

  // R5 — direction purity across BOTH tiers.
  const pools: Array<["deToEn" | "enToDe", "en" | "de", TieredAnswer[]]> = [
    ["deToEn", "en", it.translation?.deToEn ?? []],
    ["enToDe", "de", it.translation?.enToDe ?? []],
  ];
  for (const [label, want, answers] of pools) {
    for (const a of answers) {
      const ev = langEvidence(a.text);
      const right = want === "de" ? ev.de : ev.en;
      const wrong = want === "de" ? ev.en : ev.de;
      if (right === 0 && wrong >= 2) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R5", severity: "advisory",
          evidence: `translation.${label} ${a.tier} answer ${JSON.stringify(a.text.slice(0, 50))} reads like ${want === "de" ? "English" : "German"}`,
          suggestion: "rewrite the answer in the pool's language or drop it",
        });
      }
    }
  }
  return out;
}

export function auditGrammarItem(slug: string, it: GrammarItem): Finding[] {
  const out: Finding[] = [];
  const answers = it.answers ?? [];
  const fulls = answers.filter((a) => a.tier === "full");
  const fullCanon = new Set(fulls.map((a) => canon(a.text)));
  const typed = TYPED_FORMATS.has(it.format);
  // A contraction DRILL — the prompt asks to convert TO a specific form ("Kurzform"/
  // "Langform"/short/long form), or the item lives in a .contractions. teaching unit —
  // deliberately accepts only ONE form; the missing twin is intended, not a defect.
  // Flag those advisory so they don't inflate the critical count (parallel to R1's
  // non-noun exclusion). The fix wave adds the twin ONLY to non-drill (incidental) items.
  const promptText = typeof it.prompt === "string" ? it.prompt : (it.prompt?.text ?? "");
  const r2Drill =
    /kurzform|langform|short form|long form|contracted form|full form|schreib.*(kurz|lang)|write.*(short|long|contract|full) form/i.test(promptText) ||
    it.id.includes(".contractions.");
  const r2Sev: "critical" | "advisory" = r2Drill ? "advisory" : "critical";

  // R2 — contraction symmetry on typed formats.
  if (typed) {
    for (const a of fulls) {
      const expanded = expandContractions(a.text);
      // An inverted negative (tag / negative question) has no grammatical expanded
      // twin — "isn't she?" → "is she not?" (archaic), never "is not she?". Skip it.
      if (expanded !== canon(a.text) && !fullCanon.has(expanded) && !hasInvertedContraction(a.text)) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R2", severity: r2Sev,
          evidence: `full answer ${JSON.stringify(a.text)} has no expanded twin${r2Drill ? " (form-drill: asymmetry intended)" : ""}`,
          suggestion: r2Drill ? "form-drill — leave asymmetric (the exercise wants this one form)" : `add ${JSON.stringify(expanded)} as a full answer`,
        });
      }
      if (hasAmbiguousContraction(a.text)) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R2", severity: "advisory",
          evidence: `full answer ${JSON.stringify(a.text)} carries an ambiguous 's/'d — expansion needs a human`,
          suggestion: "decide is/has (or would/had) and add the expanded twin if the register allows it",
        });
      }
    }
    // reverse direction: a contractable long form with no short twin.
    for (const a of fulls) {
      const t = ` ${canon(a.text)} `;
      // NB: "have" is deliberately absent from the reverse direction — main-verb
      // have ("you have to read", "have a good day") must NOT suggest "you've";
      // the forward direction still catches authored 've answers.
      // Affirmative aux ('re/'m/'ll) can't contract when clause-final/stranded
      // ("Yes, I am." never → "Yes, I'm.") → require a following word. Negations
      // (isn't/don't/aren't) contract fine even clause-final, so they stay unguarded.
      const contractible =
        / (do|does|did|is|are|was|were|has|have|had|would|should|could|can|will|must) not /.test(t) ||
        / (we|you|they) are \p{L}/u.test(t) || / i am \p{L}/u.test(t) || /\b(i|we|you|they|he|she|it) will \p{L}/u.test(t);
      if (!contractible) continue;
      // Compare FULLY-EXPANDED forms — the two answers may share another contraction
      // ("don't"), which expandContractions expands on both sides; comparing to
      // canon(a.text) would falsely miss an existing contracted twin ("we'll").
      const hasShortTwin = fulls.some((b) => b !== a && expandContractions(b.text) === expandContractions(a.text));
      if (!hasShortTwin) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R2", severity: r2Sev,
          evidence: `full answer ${JSON.stringify(a.text)} has no contracted twin${r2Drill ? " (form-drill: asymmetry intended)" : ""}`,
          suggestion: r2Drill ? "form-drill — leave asymmetric (the exercise wants this one form)" : "add the natural contraction (don't/isn't/we're/I'll/…) as a full answer",
        });
      }
    }
  }

  // R3 — deliberate-or-incomplete single-answer PRODUCTIONS (≥3 words; a
  // single-word transformation like "writes" has no defensible variant).
  if (R3_FORMATS.has(it.format) && fulls.length === 1 && it.strict !== true && fulls[0]!.text.trim().split(/\s+/).length >= 3) {
    out.push({
      itemId: it.id, unitSlug: slug, rule: "R3", severity: "advisory",
      evidence: `${it.format} accepts exactly one full answer: ${JSON.stringify(fulls[0]!.text.slice(0, 60))}`,
      suggestion: "enumerate defensible variants (or mark strict with an authoring note) — blind-solve will cross-check",
    });
  }

  // R4 — every tier, every typed answer must match the prompt's blank count.
  const blanks = countBlanks(it.prompt?.text ?? "");
  if (typed && blanks >= 1) {
    for (const a of answers) {
      const segs = a.text.split("|").length;
      if (segs !== blanks) {
        out.push({
          itemId: it.id, unitSlug: slug, rule: "R4", severity: "critical",
          evidence: `prompt has ${blanks} blank(s) but ${a.tier} answer ${JSON.stringify(a.text.slice(0, 50))} has ${segs} segment(s)`,
          suggestion: "re-author with one pipe segment per blank (the answer is unreachable as written)",
        });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// the runner
// ---------------------------------------------------------------------------

const AUDIT_DIR = path.join(CONTENT_DIR, "build", "audit");

/** Apply the runtime overlay exactly as content-loader does (drop + shallow
 *  whole-field patch) — the audit must see what the engine grades against. */
function applyFixes<T extends { id: string }>(list: T[], fix: ItemFixes[string] | undefined): T[] {
  if (fix === undefined) return list;
  const drop = new Set(fix.drop ?? []);
  const patch = fix.patch ?? {};
  return list.filter((it) => !drop.has(it.id)).map((it) => {
    const p = patch[it.id];
    return p !== undefined ? ({ ...it, ...p } as T) : it;
  });
}

export function runAuditVariants(): void {
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .sort();

  const fixes = readJsonIfExists<ItemFixes>(ITEM_FIXES_PATH) ?? {};
  const findings: Finding[] = [];
  let scanned = 0;
  for (const slug of slugs) {
    const raw = readUnitItems(slug);
    const vocab = applyFixes(raw.vocab as unknown as VocabItem[], fixes[slug]);
    const grammar = applyFixes(raw.grammar as unknown as GrammarItem[], fixes[slug]);
    for (const v of vocab) {
      scanned++;
      findings.push(...auditVocabItem(slug, v));
    }
    for (const g of grammar) {
      scanned++;
      findings.push(...auditGrammarItem(slug, g));
    }
  }
  findings.sort((a, b) => a.itemId.localeCompare(b.itemId) || a.rule.localeCompare(b.rule) || a.evidence.localeCompare(b.evidence));

  const byRule: Record<string, number> = {};
  const byGrade: Record<string, { critical: number; advisory: number }> = {};
  let critical = 0;
  let advisory = 0;
  for (const f of findings) {
    byRule[f.rule] = (byRule[f.rule] ?? 0) + 1;
    const grade = f.unitSlug.slice(0, 2);
    byGrade[grade] ??= { critical: 0, advisory: 0 };
    if (f.severity === "critical") {
      critical++;
      byGrade[grade]!.critical++;
    } else {
      advisory++;
      byGrade[grade]!.advisory++;
    }
  }

  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  // Freshness stamp (V-2b): binds this committed report to the exact corpus state.
  const stamp = { generatedAt: new Date().toISOString(), corpusHash: corpusStamp() };
  fs.writeFileSync(
    path.join(AUDIT_DIR, "variant-audit.json"),
    `${JSON.stringify({ schema: "variant-audit@2", ...stamp, totals: { scanned, critical, advisory, byRule, byGrade }, items: findings }, null, 2)}\n`,
  );

  for (const grade of ["g1", "g2", "g3", "g4"]) {
    const mine = findings.filter((f) => f.unitSlug.startsWith(grade));
    const lines = [
      `# Variant-audit worklist — ${grade}`,
      "",
      `_Generated by \`pnpm content audit-variants\` (E-2). Fix via the overlay ONLY — full replacement arrays, never deltas (handover/17 §4). ≤25 items per wave PR._`,
      "",
      `Totals: ${mine.filter((f) => f.severity === "critical").length} critical · ${mine.filter((f) => f.severity === "advisory").length} advisory`,
      "",
    ];
    const byUnit = new Map<string, Finding[]>();
    for (const f of mine) {
      byUnit.set(f.unitSlug, [...(byUnit.get(f.unitSlug) ?? []), f]);
    }
    for (const [slug, fs_] of [...byUnit.entries()].sort()) {
      lines.push(`## ${slug}`);
      for (const f of fs_) lines.push(`- [ ] **${f.rule}/${f.severity}** \`${f.itemId}\` — ${f.evidence} → _${f.suggestion}_`);
      lines.push("");
    }
    fs.writeFileSync(path.join(AUDIT_DIR, `worklist-${grade}.md`), `${lines.join("\n")}\n`);
  }

  const gradeLine = Object.entries(byGrade)
    .map(([g, c]) => `${g}: ${c.critical}c/${c.advisory}a`)
    .join(" · ");
  console.log(
    `audit-variants: scanned ${scanned} items · critical: ${critical} · advisory: ${advisory} · ${gradeLine}\n` +
      `  report: content/build/audit/variant-audit.json + worklist-g1..4.md`,
  );
}
