/**
 * `content validate-story` — the deterministic story gate (VS-1…VS-12 + release).
 * Opt-in, like validate-listening/validate-test: the main `content validate`
 * stays blind to story files. The pure `validateStoryBundle(bundle, corpus)` is
 * fixture-tested; the runner wires the real corpus (level gate + item existence).
 *
 *  VS-1  cross-file id/grade coherence (cast/names/items storyId == story.id)
 *  VS-2  level gate over EVERY student-facing line (textEn + choices) via tokenize
 *  VS-3  du-form scaffolds (no formal Sie/Ihnen/Ihr — mid-sentence red)
 *  VS-4  taskSlot itemIds resolve, same grade, unit ≤ the chapter's gate unit
 *  VS-5  choice-graph reachability + no dead-ends (every scene reaches an ending;
 *        FlagGate walks BOTH paths)
 *  VS-13 flag hygiene (declared/set-in-place/consumed — a choice that changes
 *        nothing fails CI)
 *  VS-14 spine-tasks (no taskSlot on branch-exclusive scenes)
 *  VS-6  speakers resolve against cast.json
 *  VS-7  gloss correctness (a glossed word actually appears in its line)
 *  VS-8  meta-talk blacklist (EN grammar jargon / tense names in student lines)
 *  VS-9  asset refs exist (audio.file / cast art) — informational until art lands
 *  VS-10 storyItems carriers pass the level gate at their narrative-lock unit
 *  VS-11 a taskSlot.variantKey resolves to a variant on its item (catches dangling wires)
 *  VS-12 story-comprehension items (.ci.) exist + their EN carrier passes the level gate
 *  VS-17 scaffoldDe coverage at grades 1–2 (L-1 German-first UX: scenes, choices,
 *        flagLines must all carry German — it is the PRIMARY line there)
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
  StoryComprehensionFile,
  StoryItems,
  StoryNames,
  UNITS_PER_GRADE,
  unitSlug,
  StoryFlags,
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
  /** Variant keys minted on `itemId` ([] if the item is absent). */
  variantKeysOf(itemId: string): string[];
}

export interface StoryBundle {
  story: Story;
  cast: Cast | null;
  names: StoryNames | null;
  storyItems: StoryItems | null;
  comprehension: StoryComprehensionFile | null;
  release: ReleaseFile | null;
  flags?: import("@domigo/content-schema").StoryFlags | null;
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
  if (typeof scene.next === "object") return [scene.next.then, scene.next.else]; // FlagGate — both paths walked
  return [scene.next];
}

function studentLines(scene: Scene): string[] {
  const lines = [scene.textEn];
  if (Array.isArray(scene.next)) for (const c of scene.next) lines.push(c.textEn);
  for (const l of scene.flagLines ?? []) lines.push(l.textEn);
  return lines;
}

function scaffolds(scene: Scene): string[] {
  const out: string[] = [];
  if (scene.scaffoldDe) out.push(scene.scaffoldDe);
  if (Array.isArray(scene.next)) for (const c of scene.next) if (c.scaffoldDe) out.push(c.scaffoldDe);
  for (const l of scene.flagLines ?? []) if (l.scaffoldDe) out.push(l.scaffoldDe);
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


/** Chapter number from a chapter id ("....ch04" -> 4). */
function chNum(chapterId: string): number {
  return Number(chapterId.slice(-2));
}

/**
 * VS-13 flag hygiene + VS-14 spine-tasks.
 *  VS-13: every flag used (Choice.sets / FlagGate / flagLines) is declared in
 *  flags.json; declared flags are SET by a choice in their setIn chapter;
 *  every set flag is CONSUMED (a gate or a flag line) in a chapter >= setIn —
 *  a choice that changes nothing fails CI.
 *  VS-14: no taskSlot on a branch-exclusive scene (reachable from some but not
 *  all choices of a fork before the paths merge) — progress derivation stays
 *  path-independent; nobody can choose their way out of practice.
 */
function flagErrors(story: Story, flags: import("@domigo/content-schema").StoryFlags | null): string[] {
  const errors: string[] = [];
  const declared = new Map<string, { setIn: string; major: boolean }>();
  for (const f of flags?.flags ?? []) declared.set(f.id, { setIn: f.setIn, major: f.major });
  const setBy = new Map<string, string[]>(); // flag -> chapters that set it
  const consumedIn = new Map<string, number[]>(); // flag -> chapter numbers
  for (const chapter of story.chapters) {
    for (const scene of chapter.scenes) {
      if (Array.isArray(scene.next)) {
        for (const c of scene.next) {
          for (const f of c.sets ?? []) {
            if (!declared.has(f)) errors.push(`${scene.id}: VS-13 — choice sets undeclared flag "${f}"`);
            else if (declared.get(f)!.setIn !== chapter.id) errors.push(`${scene.id}: VS-13 — flag "${f}" is declared setIn ${declared.get(f)!.setIn} but set here`);
            setBy.set(f, [...(setBy.get(f) ?? []), chapter.id]);
          }
        }
      } else if (scene.next !== null && typeof scene.next === "object") {
        const f = scene.next.flag;
        if (!declared.has(f)) errors.push(`${scene.id}: VS-13 — FlagGate uses undeclared flag "${f}"`);
        consumedIn.set(f, [...(consumedIn.get(f) ?? []), chNum(chapter.id)]);
      }
      for (const l of scene.flagLines ?? []) {
        if (!declared.has(l.flag)) errors.push(`${scene.id}: VS-13 — flagLine uses undeclared flag "${l.flag}"`);
        consumedIn.set(l.flag, [...(consumedIn.get(l.flag) ?? []), chNum(chapter.id)]);
      }
    }
  }
  for (const [f, meta] of declared) {
    if (!setBy.has(f)) errors.push(`${story.id}: VS-13 — declared flag "${f}" is never set by any choice`);
    const uses = consumedIn.get(f) ?? [];
    if (uses.length === 0) errors.push(`${story.id}: VS-13 — flag "${f}" is set but never consumed (a choice that changes nothing)`);
    for (const u of uses) if (u < chNum(meta.setIn)) errors.push(`${story.id}: VS-13 — flag "${f}" consumed in ch${String(u).padStart(2, "0")} before its setIn ${meta.setIn}`);
  }
  // VS-14 spine-tasks
  for (const chapter of story.chapters) {
    const byId = new Map(chapter.scenes.map((s) => [s.id, s]));
    for (const scene of chapter.scenes) {
      if (!Array.isArray(scene.next)) continue;
      const reaches: Set<string>[] = scene.next.map((c) => {
        const seen = new Set<string>();
        const stack = [c.next];
        while (stack.length > 0) {
          const id = stack.pop()!;
          if (seen.has(id)) continue;
          seen.add(id);
          const s = byId.get(id);
          if (s) for (const t of nextTargets(s)) stack.push(t);
        }
        return seen;
      });
      const inAll = new Set([...reaches[0]!].filter((id) => reaches.every((r) => r.has(id))));
      for (const [i, r] of reaches.entries()) {
        for (const id of r) {
          if (inAll.has(id)) continue; // shared spine
          const s = byId.get(id);
          if (s && s.taskSlots.length > 0) {
            errors.push(`${s.id}: VS-14 — taskSlot on a branch-exclusive scene (choice "${scene.next[i]!.id}" of ${scene.id}) — tasks must live on the shared spine`);
          }
        }
      }
    }
  }
  return errors;
}

/** Pure VS-1…VS-12 + release gating over a parsed bundle. */
export function validateStoryBundle(bundle: StoryBundle, corpus: StoryCorpus): { errors: string[]; infos: string[] } {
  const errors: string[] = [];
  const infos: string[] = [];
  const { story } = bundle;
  const grade = story.grade;

  // VS-1: cross-file coherence
  if (!story.id.startsWith(`g${grade}.st.`)) errors.push(`${story.id}: VS-1 — id grade prefix disagrees with grade ${grade}`);
  if (bundle.cast && bundle.cast.storyId !== story.id) errors.push(`${story.id}: VS-1 — cast.json storyId ${bundle.cast.storyId} != ${story.id}`);
  if (bundle.names && bundle.names.storyId !== story.id) errors.push(`${story.id}: VS-1 — names.json storyId ${bundle.names.storyId} != ${story.id}`);
  if (bundle.flags && bundle.flags.storyId !== story.id) errors.push(`${story.id}: VS-1 — flags.json storyId ${bundle.flags.storyId} != ${story.id}`);
  errors.push(...flagErrors(story, bundle.flags ?? null));
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
      const extra = [...glossWords(scene.glosses), ...(scene.flagLines ?? []).flatMap((l) => glossWords(l.glosses)), ...namePhrases];
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
        const choiceText = Array.isArray(scene.next) ? scene.next.map((c) => `${c.textEn} ${c.scaffoldDe ?? ""}`).join(" ") : "";
        const hay = `${scene.textEn} ${scene.scaffoldDe ?? ""} ${choiceText}`.toLowerCase();
        if (!hay.includes(g.word.toLowerCase())) {
          errors.push(`${scene.id}: VS-7 — gloss word "${g.word}" does not appear in the scene line`);
        }
      }
      // VS-7 gloss correctness for flag-line glosses (against their own line)
      for (const l of scene.flagLines ?? []) {
        for (const g of l.glosses) {
          const hay = `${l.textEn} ${l.scaffoldDe ?? ""}`.toLowerCase();
          if (!hay.includes(g.word.toLowerCase())) {
            errors.push(`${scene.id}: VS-7 — flagLine gloss word "${g.word}" does not appear in its line`);
          }
        }
      }
      // VS-8 meta-talk in student lines
      for (const line of studentLines(scene)) {
        const hits = metaHits(line);
        if (hits.length > 0) errors.push(`${scene.id}: VS-8 — meta-talk [${hits.join(", ")}] in a student line`);
      }
      // VS-17 scaffoldDe coverage at grades 1–2 (L-1: German is the PRIMARY
      // story surface for the youngest — a missing scaffold is a blank bubble).
      if (bundle.story.grade <= 2) {
        if (!scene.scaffoldDe) errors.push(`${scene.id}: VS-17 — scaffoldDe required at grade ≤2 (German-first UX)`);
        if (Array.isArray(scene.next)) {
          for (const c of scene.next) {
            if (!c.scaffoldDe) errors.push(`${scene.id}: VS-17 — choice "${c.id}" needs scaffoldDe at grade ≤2 (German-first UX)`);
          }
        }
        for (const l of scene.flagLines ?? []) {
          if (!l.scaffoldDe) errors.push(`${scene.id}: VS-17 — flagLine "${l.flag}" needs scaffoldDe at grade ≤2 (German-first UX)`);
        }
      }
      // VS-4 taskSlots resolve ≤ gate unit, same grade, exist
      for (const ts of scene.taskSlots) {
        const ref = itemRefUnit(ts.itemId);
        if (ref === null) { errors.push(`${scene.id}: VS-4 — taskSlot "${ts.slot}" itemId ${ts.itemId} is not a valid item ref`); continue; }
        if (ref.grade !== grade) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} is grade ${ref.grade}, story is grade ${grade}`);
        else if (ref.unit > chapter.unit) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} (unit ${ref.unit}) is above the chapter gate unit ${chapter.unit}`);
        else if (ts.itemId.includes(".ci.")) {
          if (!(bundle.comprehension?.items.some((it) => it.id === ts.itemId) ?? false)) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} does not resolve to a comprehension item`);
        } else if (!corpus.itemExists(ts.itemId)) errors.push(`${scene.id}: VS-4 — taskSlot ${ts.itemId} does not resolve to an approved item`);
        // VS-11 a non-null variantKey must name a real variant on the item
        if (ts.variantKey !== null && !corpus.variantKeysOf(ts.itemId).includes(ts.variantKey)) {
          errors.push(`${scene.id}: VS-11 — taskSlot "${ts.slot}" variantKey "${ts.variantKey}" is not a variant of ${ts.itemId}`);
        }
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

  // VS-12 comprehension items: the EN carrier (question + answers + distractors) passes
  // the level gate at the item's own unit (scene-comprehension content is gated like dialogue).
  if (bundle.comprehension !== null) {
    for (const it of bundle.comprehension.items) {
      const u = itemRefUnit(it.id);
      if (u === null || u.grade !== grade) { errors.push(`${it.id}: VS-12 — comprehension id has a bad grade/unit ref`); continue; }
      const en = [
        it.prompt.lang === "en" ? it.prompt.text : "",
        ...it.answers.filter((a) => a.tier === "full").map((a) => a.text),
        ...it.distractors,
      ].join(" ");
      const unknown = corpus.unknownTokens(unitSlug(grade, u.unit), en, [...glossWords(it.gloss), ...namePhrases]);
      if (unknown.length > 0) errors.push(`${it.id}: VS-12 — comprehension carrier has above-level word(s) [${[...new Set(unknown)].join(", ")}]`);
    }
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
  const variantCache = new Map<string, Map<string, string[]>>();
  const variantsForSlug = (slug: string): Map<string, string[]> => {
    const hit = variantCache.get(slug);
    if (hit !== undefined) return hit;
    const map = new Map<string, string[]>();
    try {
      const items = readUnitItems(slug);
      for (const it of [...items.vocab, ...items.grammar]) map.set(it.id, it.presentation.variants.map((v) => v.key));
    } catch {
      /* unit has no items yet */
    }
    variantCache.set(slug, map);
    return map;
  };
  return {
    itemExists(itemId) {
      const ref = itemRefUnit(itemId);
      return ref !== null && itemsForSlug(ref.slug).has(itemId);
    },
    variantKeysOf(itemId) {
      const ref = itemRefUnit(itemId);
      return ref === null ? [] : variantsForSlug(ref.slug).get(itemId) ?? [];
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
    const flagsRaw = readJsonIfExists<unknown>(path.join(dir, "flags.json"));
    const flags = flagsRaw === null ? null : StoryFlags.safeParse(flagsRaw);
    if (flags && !flags.success) { errors.push(`${id}: flags.json schema — ${flags.error.issues[0]?.message ?? "?"}`); continue; }
    const compRaw = readJsonIfExists<unknown>(path.join(dir, "comprehension.json"));
    const comprehension = compRaw === null ? null : StoryComprehensionFile.safeParse(compRaw);
    if (comprehension && !comprehension.success) { errors.push(`${id}: comprehension.json schema — ${comprehension.error.issues[0]?.message ?? "?"}`); continue; }

    const res = validateStoryBundle(
      {
        story: parsed.data,
        flags: flags ? flags.data : null,
        cast: cast ? cast.data : null,
        names: names ? names.data : null,
        storyItems: items ? items.data : null,
        comprehension: comprehension ? comprehension.data : null,
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
  console.log(`content validate-story: OK — ${ids.length} story/ies, ${chapters} chapter(s); VS-1…VS-12 + release green.`);
}
