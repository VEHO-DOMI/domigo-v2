#!/usr/bin/env node
/**
 * Story-battery audit (welle-050) — one chapter of a story bundle, checked the way
 * RULING_TANDEM §3 reads it, BEFORE a blind reader ever sees it.
 *
 *   S1  every English word the child reads in the chapter — scene lines, choices,
 *       flag lines, the scene-embedded carriers (variants) and the .ci. recap —
 *       is in the cumulative register at the chapter's unit (the REAL level gate,
 *       buildAllowedMatcher), except names.json and the line's own glosses.
 *       Words that pass ONLY because a harvested proper noun happens to spell
 *       them ("Project", "Language") are listed as a warning, never silently.
 *   S1  at most 2 glossed words per scene / per carrier.
 *   S3  at most 2 sentences per line, at most 200 words per scene.
 *   S6  every slot resolves exactly like the play page (variant re-framed), and
 *       every keyed full answer grades "correct" through the real engine;
 *       no blank fill of the key is printed in its own carrier.
 *
 * Usage (repo root, off-CI):
 *   node scripts/audit/story-battery.ts --story g4.st.fourteen-live --chapter ch01
 *   ... --tamper                     prove the instrument: inject one untaught word, expect red
 *   ... --export-frames <file>       student-view frames (scene line + task, NO keys) for blind solvers
 *   ... --candidates <file>          grade blind answers [{slot, answer}] through the engine
 * Exit 0 = clean (or tamper caught), 1 = findings, 2 = usage.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ComprehensionItem, GrammarItem, Story, VocabItem } from "@domigo/content-schema";
import { buildEngineInput, frameGrammarItem, frameVocabItem, type Frame } from "../../packages/content-pipeline/src/blind-solve.ts";
import { buildAllowedMatcher, grantsForUnit } from "../../packages/content-pipeline/src/cumulative-bank.ts";
import { applyItemFixes, readUnitItems } from "../../packages/content-pipeline/src/gen-items.ts";
import { gradeGrammar, gradeVocab } from "../../packages/engine/src/index.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const argv = process.argv.slice(2);
const arg = (name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const storyId = arg("--story");
const chShort = arg("--chapter");
if (storyId === undefined || chShort === undefined || !/^ch\d{2}$/.test(chShort)) {
  console.error("usage: story-battery.ts --story <id> --chapter chNN [--tamper] [--export-frames f] [--candidates f]");
  process.exit(2);
}
const tamper = argv.includes("--tamper");
const dir = path.join(ROOT, "content", "corpus", "stories", storyId);
const readJson = <T>(file: string): T | null => (fs.existsSync(path.join(dir, file)) ? (JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as T) : null);
const story = readJson<Story>("story.json")!;
const chapter = story.chapters.find((c) => c.id === `${storyId}.${chShort}`);
if (chapter === undefined) { console.error(`no chapter ${chShort} in ${storyId}`); process.exit(2); }
if (tamper) chapter.scenes[0]!.textEn += " The xylophone was famous.";
const names = (readJson<{ names: { name: string }[] }>("names.json")?.names ?? []).map((n) => n.name);
const comprehension = readJson<{ items: ComprehensionItem[] }>("comprehension.json")?.items ?? [];

const slug = `g${story.grade}-u${String(chapter.unit).padStart(2, "0")}`;
const gate = buildAllowedMatcher(slug);
const bare = buildAllowedMatcher(slug, { nouns: false });
const granted = grantsForUnit(slug).unitWide;
const units = new Map<string, { vocab: VocabItem[]; grammar: GrammarItem[] }>();
const unitItems = (s: string) => {
  if (!units.has(s)) units.set(s, applyItemFixes(s, readUnitItems(s)) as { vocab: VocabItem[]; grammar: GrammarItem[] });
  return units.get(s)!;
};

const findings: string[] = [];
const warnings: string[] = [];
let linesChecked = 0;

function gateLine(where: string, text: string, glosses: string[]): void {
  linesChecked += 1;
  const opts = { extraPhrases: [...names, ...glosses], grantedTokens: granted };
  const unknown = [...new Set(gate.unknownTokens(text, opts))];
  if (unknown.length > 0) findings.push(`S1 ${where}: untaught ${JSON.stringify(unknown)} ← ${text}`);
  const crutch = [...new Set(bare.unknownTokens(text, opts))].filter((t) => !unknown.includes(t));
  if (crutch.length > 0) warnings.push(`S1? ${where}: passes only via harvested proper nouns ${JSON.stringify(crutch)}`);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => /\w/.test(s)).length;
  if (sentences > 2) findings.push(`S3 ${where}: ${sentences} sentences (max 2) ← ${text}`);
}

// ── scenes ──────────────────────────────────────────────────────────────────
interface Slot { scene: string; slot: string; line: string; kind: "vocab" | "grammar"; item: VocabItem | GrammarItem; frame: Frame }
const slots: Slot[] = [];
for (const scene of chapter.scenes) {
  const sid = scene.id.split(".").slice(-1)[0]!;
  const glossWords = scene.glosses.map((g) => g.word);
  if (glossWords.length > 2) findings.push(`S1 ${sid}: ${glossWords.length} glossed words (max 2)`);
  gateLine(sid, scene.textEn, glossWords);
  let words = scene.textEn.split(/\s+/).length;
  if (Array.isArray(scene.next)) for (const c of scene.next) { gateLine(`${sid} choice ${c.id}`, c.textEn, glossWords); words += c.textEn.split(/\s+/).length; }
  for (const l of scene.flagLines ?? []) {
    if (l.glosses.length > 2) findings.push(`S1 ${sid} flagLine ${l.flag}: ${l.glosses.length} glossed words (max 2)`);
    gateLine(`${sid} flagLine ${l.flag}`, l.textEn, l.glosses.map((g) => g.word));
  }
  if (words > 200) findings.push(`S3 ${sid}: ${words} words (max 200)`);

  for (const ts of scene.taskSlots) {
    const where = `${sid} slot ${ts.slot}`;
    const ci = comprehension.find((x) => x.id === ts.itemId);
    if (ci) {
      const item = ci as unknown as GrammarItem;
      const gl = ci.gloss.map((g) => g.word);
      if (gl.length > 2) findings.push(`S1 ${where}: ${gl.length} glossed words (max 2)`);
      for (const t of [ci.prompt.text, ...ci.answers.filter((a) => a.tier === "full").map((a) => a.text), ...ci.distractors]) gateLine(where, t, gl);
      const frame = frameGrammarItem(item);
      if (frame === null) { findings.push(`S6 ${where}: format ${ci.format} cannot be framed`); continue; }
      slots.push({ scene: scene.id, slot: ts.slot, line: scene.textEn, kind: "grammar", item, frame });
      continue;
    }
    const m = /^g(\d)u(\d{2})\./.exec(ts.itemId);
    if (m === null) { findings.push(`S6 ${where}: bad item ref ${ts.itemId}`); continue; }
    const items = unitItems(`g${m[1]}-u${m[2]}`);
    const v = items.vocab.find((x) => x.id === ts.itemId);
    const g = items.grammar.find((x) => x.id === ts.itemId);
    const base = v ?? g;
    if (base === undefined) { findings.push(`S6 ${where}: ${ts.itemId} not in the corpus`); continue; }
    const variant = ts.variantKey ? base.presentation.variants.find((va) => va.key === ts.variantKey) : undefined;
    if (ts.variantKey && variant === undefined) { findings.push(`S6 ${where}: variant ${ts.variantKey} not minted on ${ts.itemId}`); continue; }
    // Resolve exactly like apps/web/app/(game)/play/[grade]/[zone]/page.tsx storyItemsFor().
    let item: VocabItem | GrammarItem;
    let frame: Frame | null;
    if (v) {
      item = variant ? { ...v, s: variant.prompt.text, gloss: variant.glosses } : v;
      frame = frameVocabItem(item as VocabItem);
    } else {
      item = variant ? { ...g!, prompt: { ...g!.prompt, text: variant.prompt.text }, gloss: variant.glosses } : g!;
      frame = frameGrammarItem(item as GrammarItem);
    }
    if (frame === null) { findings.push(`S6 ${where}: format cannot be framed`); continue; }
    const carrier = v ? (item as VocabItem).s : (item as GrammarItem).prompt.text;
    const gl = item.gloss.map((x) => x.word);
    if (gl.length > 2) findings.push(`S1 ${where}: carrier has ${gl.length} glossed words (max 2)`);
    if (variant) gateLine(`${where} carrier`, carrier, gl);
    else warnings.push(`S6 ${where}: no scene carrier (corpus prompt shown as is)`);
    const keys = v
      ? (item as VocabItem).sAnswers.filter((a) => a.tier === "full").map((a) => a.text)
      : (item as GrammarItem).answers.filter((a) => a.tier === "full").map((a) => a.text);
    for (const k of keys) for (const fill of k.split("|").map((x) => x.trim()).filter(Boolean)) {
      if (new RegExp(`\\b${fill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(carrier)) findings.push(`S6 ${where}: key fill "${fill}" is printed in its own carrier`);
    }
    slots.push({ scene: scene.id, slot: ts.slot, line: scene.textEn, kind: v ? "vocab" : "grammar", item, frame });
  }
}

// ── engine self-grade: every full key must grade correct ────────────────────
function grade(s: Slot, answer: string): string {
  const input = buildEngineInput(s.frame, answer);
  return s.kind === "vocab" ? gradeVocab(s.item as VocabItem, answer).tier : gradeGrammar(s.item as GrammarItem, input).tier;
}
let keysGraded = 0;
for (const s of slots) {
  const keys = s.kind === "vocab"
    ? (s.item as VocabItem).sAnswers.filter((a) => a.tier === "full").map((a) => a.text)
    : (s.item as GrammarItem).answers.filter((a) => a.tier === "full").map((a) => a.text);
  for (const k of keys) {
    keysGraded += 1;
    const tier = grade(s, k);
    if (tier !== "correct") findings.push(`S6 ${s.scene.split(".").pop()} slot ${s.slot}: key "${k}" grades ${tier}`);
  }
}

const exportTo = arg("--export-frames");
if (exportTo !== undefined) {
  const frames = slots.map((s, i) => ({
    n: i + 1,
    slot: s.slot,
    sceneLine: s.line,
    format: s.frame.format,
    lines: s.frame.lines,
    input: s.frame.input,
    glosses: s.frame.glosses,
  }));
  fs.writeFileSync(exportTo, JSON.stringify(frames, null, 2) + "\n");
  console.log(`frames → ${exportTo} (${frames.length}, no keys)`);
}
const candidatesFrom = arg("--candidates");
if (candidatesFrom !== undefined) {
  const cands = JSON.parse(fs.readFileSync(candidatesFrom, "utf8")) as { slot: string; answer: string }[];
  for (const c of cands) {
    const s = slots.find((x) => x.slot === c.slot);
    if (s === undefined) { findings.push(`S6 blind: unknown slot ${c.slot}`); continue; }
    const tier = grade(s, c.answer);
    console.log(`  blind ${c.slot.padEnd(12)} ${tier.padEnd(8)} ← ${c.answer}`);
    if (tier !== "correct") findings.push(`S6 blind ${c.slot}: "${c.answer}" grades ${tier} (missing variant or ambiguous carrier?)`);
  }
}

for (const w of warnings) console.log(`  ⚠ ${w}`);
console.log(`story-battery ${storyId} ${chShort} (gate ${slug}): ${chapter.scenes.length} scenes · ${slots.length} slots · ${linesChecked} lines gated · ${keysGraded} keys graded`);
if (tamper) {
  const caught = findings.some((f) => f.includes("xylophone"));
  console.log(caught ? "tamper: caught (instrument works)" : "tamper: NOT caught — the instrument is blind");
  process.exit(caught ? 0 : 1);
}
if (findings.length > 0) {
  for (const f of findings) console.error(`  ✗ ${f}`);
  console.error(`${findings.length} finding(s)`);
  process.exit(1);
}
console.log("clean: S1 · S3 · S6 (engine)");
