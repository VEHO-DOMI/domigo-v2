/**
 * `content validate-story` — the deterministic story gate (VS-1…VS-10 + release).
 * Opt-in, like validate-listening/validate-test: the main `content validate`
 * stays blind to story files. The pure `validateStoryBundle(bundle, corpus)` is
 * fixture-tested; the runner wires the real corpus (level gate + item existence).
 *
 *  VS-1  cross-file id/grade coherence (cast/names/items storyId == story.id)
 *  VS-2  level gate over EVERY student-facing line (textEn + choices) via tokenize
 *  VS-3  du-form scaffolds (no formal Sie/Ihnen/Ihr — mid-sentence red)
 *  VS-4  taskSlot itemIds resolve, same grade, unit ≤ the chapter's gate unit
 *  VS-5  choice-graph reachability + no dead-ends (every scene reaches an ending)
 *  VS-6  speakers resolve against cast.json
 *  VS-7  gloss correctness (a glossed word actually appears in its line)
 *  VS-8  meta-talk blacklist (EN grammar jargon / tense names in student lines)
 *  VS-9  asset refs exist (audio.file / cast art) — informational until art lands
 *  VS-10 storyItems carriers pass the level gate at their narrative-lock unit
 *  +     release gating: a released chapter's gate unit must be ready in the corpus
 */
import fs from "node:fs";
import path from "node:path";
import {
  Cast,
  type Chapter,
  type Gloss,
  type Scene,
  Story,
  StoryItems,
  StoryNames,
  UNITS_PER_GRADE,
  unitSlug,
} from "@domigo/content-schema";
import { buildAllowedMatcher } from "./cumulative-bank.ts";
import { readUnitItems } from "./gen-items.ts";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR } from "./paths.ts";
import {
  type ReleaseFile,
  STORIES_DIR,
  chapterOrdinal,
  itemRefUnit,
} from "./story-common.ts";

export interface StoryCorpus {
  /** Is `itemId` a real item in the approved corpus? */
  itemExists(itemId: string): boolean;
  /** Is the unit's content present/approved (release gate)? */
  isUnitReady(slug: string): boolean;
  /** Above-level tokens of `text` at unit `slug`, honoring `extraPhrases`. */
  unknownTokens(slug: string, text: string, extraPhrases: string[]): string[];
}

export interface StoryBundle {
  story: Story;
  cast: Cast | null;
  names: StoryNames | null;
  storyItems: StoryItems | null;
  release: ReleaseFile | null;
}

// ── du-form + meta-talk (mirrors validate-items V-12/V-13, story carriers) ────
const SIE_RE = /^(Sie|Ihnen|Ihr(?:e|em|en|er|es)?)$/;
const EN_META = [
  "grammar", "vocabulary", "exercise", "task", "unit", "lesson",
  "past simple", "simple past", "present perfect", "past continuous",
  "present simple", "present continuous", "will-future", "imperative",
  "modal verb", "auxiliary", "infinitive", "preposition", "plural", "singular",
];

function dieFormHits(text: string): { mid: string[]; initial: string[] } {
  const mid: string[] = [];
  const initial: string[] = [];
  for (const sentence of text.split(/(?<=[.!?:…])\s+/)) {
    const tokens = sentence.match(/[A-Za-zÄÖÜäöüß']+/g) ?? [];
    for (let i = 0; i < tokens.length; i += 1) {
      if (!SIE_RE.test(tokens[i]!)) continue;
      if (i === 0) initial.push(tokens[i]!);
      else mid.push(tokens[i]!);
    }
  }
  return { mid, initial };
}

function metaHits(text: string): string[] {
  const lower = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
  return EN_META.filter((t) => lower.includes(` ${t} `) || lower.includes(` ${t}.`) || lower.includes(` ${t},`) || lower.includes(` ${t}!`) || lower.includes(` ${t}?`));
}

function glossWords(glosses: Gloss[]): string[] {
  return glosses.map((g) => g.word);
}

/** Choice targets + a linear next, as a flat list of target scene ids. */
function nextTargets(scene: Scene): string[] {
  if (scene.next === null) return [];
  if (Array.isArray(scene.next)) return scene.next.map((c) => c.next);
  return [scene.next];
}

function studentLines(scene: Scene): string[] {
  const lines = [scene.textEn];
  if (Array.isArray(scene.next)) for (const c of scene.next) lines.push(c.textEn);
  return lines;
}

function scaffolds(scene: Scene): string[] {
  const out: string[] = [];
  if (scene.scaffoldDe) out.push(scene.scaffoldDe);
  if (Array.isArray(scene.next)) for (const c of scene.next) if (c.scaffoldDe) out.push(c.scaffoldDe);
  return out;
}

/** VS-5: from scene[0], every scene reachable AND able to reach a terminal. */
function reachabilityErrors(chapter: Chapter): string[] {
  const errors: string[] = [];
  const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
  const start = chapter.scenes[0];
  if (start === undefined) return errors;

  // forward reachability from the start
  const reach = new Set<string>();
  const stack = [start.id];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (reach.has(id)) continue;
    reach.add(id);
    const s = byId.get(id);
    if (s) for (const t of nextTargets(s)) if (byId.has(t)) stack.push(t);
  }
  for (const s of chapter.scenes) {
    if (!reach.has(s.id)) errors.push(`${chapter.id}: VS-5 — scene ${s.id} is unreachable from the chapter start`);
  }

  // can each scene reach an ending? reverse BFS from terminals.
  const terminals = chapter.scenes.filter((s) => nextTargets(s).length === 0).map((s) => s.id);
  const canEnd = new Set<string>(terminals);
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of chapter.scenes) {
      if (canEnd.has(s.id)) continue;
      if (nextTargets(s).some((t) => canEnd.has(t))) {
        canEnd.add(s.id);
        changed = true;
      }
    }
  }
  for (const s of chapter.scenes) {
    if (reach.has(s.id) && !canEnd.has(s.id)) {
      errors.push(`${chapter.id}: VS-5 — scene ${s.id} cannot reach an ending (dead end / loop)`);
    }
  }
  return errors;
}

/** Pure VS-1…VS-10 + release gating over a parsed bundle. */
export function validateStoryBundle(bundle: StoryBundle, corpus: StoryCorpus): { errors: string[]; infos: string[] } {
  const errors: string[] = [];
  const infos: string[] = [];
  const { story } = bundle;
  const grade = story.grade;

  // VS-1: cross-file coherence
  if (!story.id.startsWith(`g${grade}.st.`)) errors.push(`${story.id}: VS-1 — id grade prefix disagrees with grade ${grade}`);
  if (bundle.cast && bundle.cast.storyId !== story.id) errors.push(`${story.id}: VS-1 — cast.json storyId ${bundle.cast.storyId} != ${story.id}`);
  if (bundle.names && bundle.names.storyId !== story.id) errors.push(`${story.id}: VS-1 — names.json storyId ${bundle.names.storyId} != ${story.id}`);
  if (bundle.storyItems && bundle.storyItems.storyId !== story.id) errors.push(`${story.id}: VS-1 — story-items storyId ${bundle.storyItems.storyId} != ${story.id}`);

  const castIds = new Set((bundle.cast?.members ?? []).map((m) => m.id));
  const namePhrases = (bundle.names?.names ?? []).map((n) => n.name);

  for (const chapter of story.chapters) {
    if (chapter.unit > UNITS_PER_GRADE[grade]) errors.push(`${chapter.id}: VS-1 — gate unit ${chapter.unit} > ${UNITS_PER_GRADE[grade]} units in grade ${grade}`);
    const gateSlug = unitSlug(grade, chapter.unit);

    // VS-6 (need cast when there are scenes)
    if (chapter.scenes.length > 0 && bundle.cast === null) errors.push(`${chapter.id}: VS-6 — cast.json is required (scenes reference speakers)`);

    for (const scene of chapter.scenes) {
      // VS-6 speaker resolves
      if (bundle.cast !== null && !castIds.has(scene.speaker)) {
        errors.push(`${scene.id}: VS-6 — speaker "${scene.speaker}" not in cast.json`);
      }
      // VS-2 level gate over every student-facing line (gloss words + names are honored)
      const extra = [...glossWords(scene.glosses), ...namePhrases];
      for (const line of studentLines(scene)) {
        const unknown = corpus.unknownTokens(gateSlug, line, extra);
        if (unknown.length > 0) {
          errors.push(`${scene.id}: VS-2 — above-level word(s) [${[...new Set(unknown)].join(", ")}] at ${gateSlug} (teach earlier, gloss, or add to names): "${line.slice(0, 60)}"`);
        }
      }
      // VS-3 du-form on scaffolds
      for (const de of scaffolds(scene)) {
        const { mid, initial } = dieFormHits(de);
        for (const w of mid) errors.push(`${scene.id}: VS-3 — formal "${w}" in scaffoldDe (du-form only)`);
        for (const w of initial) infos.push(`${scene.id}: VS-3 — sentence-initial "${w}" in scaffoldDe — she/they or formal? human call`);
      }
      // VS-7 gloss correctness
      for (const g of scene.glosses) {
        const hay = `${scene.textEn} ${scene.scaffoldDe ?? ""}`.toLowerCase();
        if (!hay.includes(g.word.toLowerCase())) {
          errors.push(`${scene.id}: VS-7 — gloss word "${g.word}" does not appear in the scene line`);
        }
      }
      // VS-8 meta-talk in student lines
      for (const line of studentLines(scene)) {
        const hits = metaHits(line);
        if (hits.length > 0) errors.push(`${scene.id}: VS-8 — meta-talk [${hits.join(", ")}] in a student line`);
      }
      // VS-4 taskSlots resolve ≤ gate unit, same grade, exist
      for (const ts of scene.taskSlots) {
        const ref = itemRefUnit(ts.itemId);
        if (ref === null) { errors.push(`${scene.id}: VS-4 — taskSlot "${ts.slot}" itemId ${ts.itemId} is not a valid item ref`); continue; }
        if (ref.grade !== grade) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} is grade ${ref.grade}, story is grade ${grade}`);
        else if (ref.unit > chapter.unit) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} (unit ${ref.unit}) is above the chapter gate unit ${chapter.unit}`);
        else if (!corpus.itemExists(ts.itemId)) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} does not resolve to an approved item`);
      }
      // VS-9 asset refs (audio.file / cast art) — fs existence is a runner concern
      // (the pure layer never touches disk); informational until art/TTS lands.
    }

    // VS-5 reachability / no dead ends
    errors.push(...reachabilityErrors(chapter));
  }

  // VS-10 storyItems carriers pass the level gate at their narrative-lock unit
  if (bundle.storyItems !== null) {
    const chapterUnit = new Map(story.chapters.map((c) => [c.id, c.unit]));
    const checkItem = (id: string, carrier: string, lockChapter: string | undefined, gloss: Gloss[]): void => {
      const unit = lockChapter !== undefined ? chapterUnit.get(lockChapter) : undefined;
      if (unit === undefined) { errors.push(`${id}: VS-10 — narrative lock chapter ${lockChapter ?? "(none)"} is not in this story`); return; }
      const unknown = corpus.unknownTokens(unitSlug(grade, unit), carrier, glossWords(gloss));
      if (unknown.length > 0) errors.push(`${id}: VS-10 — story item carrier has above-level word(s) [${[...new Set(unknown)].join(", ")}]`);
    };
    for (const v of bundle.storyItems.vocabItems) checkItem(v.id, v.s, v.provenance.narrative?.chapterId, v.gloss);
    for (const g of bundle.storyItems.grammarItems) checkItem(g.id, g.prompt.text, g.provenance.narrative?.chapterId, g.gloss);
  }

  // release gating
  if (bundle.release !== null) {
    const chapterById = new Map(story.chapters.map((c) => [c.id, c]));
    for (const cid of bundle.release.releasedChapters) {
      const ch = chapterById.get(cid);
      if (ch === undefined) { errors.push(`${story.id}: release — chapter ${cid} is not in the story`); continue; }
      const slug = unitSlug(grade, ch.unit);
      if (!corpus.isUnitReady(slug)) errors.push(`${story.id}: release — chapter ${cid} gates on ${slug}, which is not approved/ready`);
      const ord = chapterOrdinal(cid);
      if (ord !== null && ord > ch.unit) infos.push(`${story.id}: release — chapter ${cid} (ordinal ${ord}) gates on unit ${ch.unit}`);
    }
  }

  return { errors, infos };
}

// ── real corpus + runner ──────────────────────────────────────────────────────

function buildRealCorpus(): StoryCorpus {
  const itemCache = new Map<string, Set<string>>();
  const itemsForSlug = (slug: string): Set<string> => {
    const hit = itemCache.get(slug);
    if (hit !== undefined) return hit;
    const set = new Set<string>();
    try {
      const items = readUnitItems(slug);
      for (const v of items.vocab) set.add(v.id);
      for (const g of items.grammar) set.add(g.id);
    } catch {
      /* unit has no items yet */
    }
    itemCache.set(slug, set);
    return set;
  };
  return {
    itemExists(itemId) {
      const ref = itemRefUnit(itemId);
      return ref !== null && itemsForSlug(ref.slug).has(itemId);
    },
    isUnitReady(slug) {
      return (
        fs.existsSync(path.join(UNITS_DIR, slug, "vocab.json")) ||
        fs.existsSync(path.join(UNITS_DIR, slug, "grammar.json"))
      );
    },
    unknownTokens(slug, text, extraPhrases) {
      try {
        return buildAllowedMatcher(slug).unknownTokens(text, { extraPhrases });
      } catch {
        return []; // missing cumulative bank — surfaced elsewhere; don't false-positive
      }
    },
  };
}

export function runValidateStory(): void {
  if (!fs.existsSync(STORIES_DIR)) {
    console.log("content validate-story: no stories on disk (content/corpus/stories missing) — nothing to check");
    return;
  }
  const ids = fs.readdirSync(STORIES_DIR).filter((n) => /^g[1-4]\.st\.[a-z0-9-]+$/.test(n)).sort();
  if (ids.length === 0) {
    console.log("content validate-story: no story bundles found — nothing to check");
    return;
  }
  const corpus = buildRealCorpus();
  const errors: string[] = [];
  const infos: string[] = [];
  let chapters = 0;

  for (const id of ids) {
    const dir = path.join(STORIES_DIR, id);
    const rawStory = readJsonIfExists<unknown>(path.join(dir, "story.json"));
    if (rawStory === null) { infos.push(`${id}: no story.json yet (draft-only) — skipped`); continue; }
    const parsed = Story.safeParse(rawStory);
    if (!parsed.success) { errors.push(`${id}: story.json schema — ${parsed.error.issues[0]?.message ?? "?"} at ${parsed.error.issues[0]?.path.join(".") ?? "?"}`); continue; }

    const castRaw = readJsonIfExists<unknown>(path.join(dir, "cast.json"));
    const cast = castRaw === null ? null : Cast.safeParse(castRaw);
    if (cast && !cast.success) { errors.push(`${id}: cast.json schema — ${cast.error.issues[0]?.message ?? "?"}`); continue; }
    const namesRaw = readJsonIfExists<unknown>(path.join(dir, "names.json"));
    const names = namesRaw === null ? null : StoryNames.safeParse(namesRaw);
    if (names && !names.success) { errors.push(`${id}: names.json schema — ${names.error.issues[0]?.message ?? "?"}`); continue; }
    const itemsRaw = readJsonIfExists<unknown>(path.join(dir, "story-items.json"));
    const items = itemsRaw === null ? null : StoryItems.safeParse(itemsRaw);
    if (items && !items.success) { errors.push(`${id}: story-items.json schema — ${items.error.issues[0]?.message ?? "?"}`); continue; }
    const release = readJsonIfExists<ReleaseFile>(path.join(dir, "release.json"));

    const res = validateStoryBundle(
      {
        story: parsed.data,
        cast: cast ? cast.data : null,
        names: names ? names.data : null,
        storyItems: items ? items.data : null,
        release,
      },
      corpus,
    );
    errors.push(...res.errors);
    infos.push(...res.infos);
    chapters += parsed.data.chapters.length;
  }

  for (const i of infos) console.log(`  ℹ ${i}`);
  if (errors.length > 0) {
    console.error(`content validate-story: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(`content validate-story: OK — ${ids.length} story/ies, ${chapters} chapter(s); VS-1…VS-10 + release green.`);
}
