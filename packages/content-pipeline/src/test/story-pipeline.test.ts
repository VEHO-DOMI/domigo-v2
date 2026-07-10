import assert from "node:assert/strict";
import { test } from "node:test";
import { Cast, Story, StoryItems } from "@domigo/content-schema";
import { extractArrayLiteral, parseLegacyCampaign } from "../import-story.ts";
import { validateStoryBundle, type StoryBundle, type StoryCorpus } from "../validate-story.ts";

// ─────────────────────────────────────────────────────────── importer ────────

test("extractArrayLiteral is string/comment-aware (brackets inside strings + // comments)", () => {
  const src = `x = [ {a:1, s:"has ] bracket"}, // a ] in a comment\n {arr:[1,2]} ]; tail`;
  const open = src.indexOf("[");
  const lit = extractArrayLiteral(src, open);
  assert.equal(lit, `[ {a:1, s:"has ] bracket"}, // a ] in a comment\n {arr:[1,2]} ]`);
  assert.deepEqual(JSON.parse(JSON.stringify(new Function(`return (${lit})`)())), [{ a: 1, s: "has ] bracket" }, { arr: [1, 2] }]);
});

test("parseLegacyCampaign maps a legacy level → draft chapter (no content copied)", () => {
  const lit = `[
    // ====== L01 ======
    { levelName:"Time for School", topic:"School", grammar:"Plurals",
      cameo:{name:"Frau Berger", emoji:"x"},
      storyA:[{speaker:"finn", text:"Hi {NAME}!", textDe:"Hallo!", emotion:"excited"}],
      storyB:[{speaker:"finn", text:"More words!", textDe:"Mehr!"}],
      completion:[{speaker:"cameo", text:"Welcome!", textDe:"Willkommen!"}],
      tasks:[{name:"Name it", type:"image-matching", context:"do it", contextDe:"mach es", items:[1,2,3]},
             {name:"Read", type:"reading", context:"read", contextDe:null, questions:[1,2]}] }
  ]`;
  const chapters = parseLegacyCampaign(lit, "g1.st.lost-pages");
  assert.equal(chapters.length, 1);
  const c = chapters[0]!;
  assert.equal(c.chapterId, "g1.st.lost-pages.ch01");
  assert.equal(c.unit, 1);
  assert.equal(c.titleEn, "Time for School");
  assert.deepEqual(c.cameo, { name: "Frau Berger", emoji: "x" });
  assert.equal(c.scenes.length, 3); // storyA + storyB + completion
  assert.equal(c.scenes[0]!.textEn, "Hi {NAME}!");
  assert.equal(c.scenes[2]!.speaker, "cameo");
  assert.equal(c.tasks.length, 2);
  assert.equal(c.tasks[0]!.legacyItemCount, 3);
  assert.equal(c.tasks[1]!.legacyItemCount, 2); // questions counted
});

// ─────────────────────────────────────────────────────── VS validators ───────

function mkCorpus(opts: { allowed?: string[]; known?: string[]; ready?: string[] } = {}): StoryCorpus {
  const base = ["hello", "look", "here", "the", "book", "is", "go", "in", "wait", "for", "open", "and", "a", "we", "can", "it"];
  const allowed = new Set([...base, ...(opts.allowed ?? [])]);
  const known = new Set(opts.known ?? ["g1u01.w.book"]);
  const ready = new Set(opts.ready ?? ["g1-u01"]);
  const wordsOf = (s: string): string[] => s.toLowerCase().match(/[a-zäöüß']+/g) ?? [];
  return {
    itemExists: (id) => known.has(id),
    isUnitReady: (slug) => ready.has(slug),
    variantKeysOf: () => [],
    unknownTokens: (_slug, text, extra) => {
      const ok = new Set(allowed);
      for (const p of extra) for (const w of wordsOf(p)) ok.add(w);
      return wordsOf(text).filter((w) => !ok.has(w) && !/^\d+$/.test(w));
    },
  };
}

function scene(over: Record<string, unknown> = {}) {
  return {
    id: "g1.st.lp.ch01.s001",
    speaker: "finn",
    textEn: "Look! The book is here.",
    scaffoldDe: "Schau! Das Buch ist hier.",
    glosses: [],
    audio: null,
    taskSlots: [{ slot: "t1", itemId: "g1u01.w.book", variantKey: null }],
    next: null,
    ...over,
  };
}
function story(chapters?: unknown[]) {
  return Story.parse({
    schema: "story@1",
    id: "g1.st.lp",
    grade: 1,
    title: { en: "Lost Pages", de: null },
    chapters: chapters ?? [{ id: "g1.st.lp.ch01", unit: 1, titleEn: "Time for School", titleDe: null, scenes: [scene()] }],
  });
}
const cast = () => Cast.parse({ schema: "cast@1", storyId: "g1.st.lp", members: [{ id: "finn", nameEn: "Finn", descriptionDe: null, voice: null, art: null }] });

function bundle(over: Partial<StoryBundle> = {}): StoryBundle {
  return { story: story(), cast: cast(), names: null, storyItems: null, comprehension: null, release: null, ...over };
}

test("a clean story bundle passes VS-1…VS-10", () => {
  const res = validateStoryBundle(bundle(), mkCorpus());
  assert.deepEqual(res.errors, []);
});

test("VS-1: cross-file storyId mismatch", () => {
  const badCast = Cast.parse({ schema: "cast@1", storyId: "g1.st.other", members: [{ id: "finn", nameEn: "Finn", descriptionDe: null, voice: null, art: null }] });
  const res = validateStoryBundle(bundle({ cast: badCast }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-1")));
});

test("VS-2: above-level word in a student line (not glossed/named)", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ textEn: "Look! The elephant is here." })] }]);
  const res = validateStoryBundle(bundle({ story: s }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-2") && e.includes("elephant")));
  // glossing the word clears it
  const s2 = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ textEn: "Look! The elephant is here.", glosses: [{ word: "elephant", de: "Elefant", scope: null }] })] }]);
  assert.deepEqual(validateStoryBundle(bundle({ story: s2 }), mkCorpus()).errors, []);
});

test("VS-17: a grade-1 scene without scaffoldDe fails (German-first UX); grade 3+ is free", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ scaffoldDe: null })] }]);
  const res = validateStoryBundle(bundle({ story: s }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-17") && e.includes("scaffoldDe required")));
  // a choice without scaffoldDe fails too at grade ≤2
  const withChoice = scene({
    taskSlots: [],
    next: [
      { id: "a", textEn: "Wait here.", scaffoldDe: "Warte hier.", next: "g1.st.lp.ch01.s002" },
      { id: "b", textEn: "Open the book.", scaffoldDe: null, next: "g1.st.lp.ch01.s002" },
    ],
  });
  const closer = scene({ id: "g1.st.lp.ch01.s002", taskSlots: [], next: null });
  const s2 = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [withChoice, closer] }]);
  const res2 = validateStoryBundle(bundle({ story: s2 }), mkCorpus());
  assert.ok(res2.errors.some((e) => e.includes("VS-17") && e.includes('choice "b"')));
  // grade 3 has no scaffold requirement (English-first doctrine unchanged there)
  const s3 = Story.parse({
    schema: "story@1",
    id: "g3.st.x",
    grade: 3,
    title: { en: "X", de: null },
    chapters: [{ id: "g3.st.x.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ id: "g3.st.x.ch01.s001", scaffoldDe: null, taskSlots: [] })] }],
  });
  const cast3 = Cast.parse({ schema: "cast@1", storyId: "g3.st.x", members: [{ id: "finn", nameEn: "Finn", descriptionDe: null, voice: null, art: null }] });
  const res3 = validateStoryBundle(bundle({ story: s3, cast: cast3 }), mkCorpus({ ready: ["g3-u01"] }));
  assert.ok(!res3.errors.some((e) => e.includes("VS-17")));
});

test("VS-3: formal Sie in a scaffold is an error", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ scaffoldDe: "Schau! Können Sie das Buch sehen?" })] }]);
  const res = validateStoryBundle(bundle({ story: s }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-3")));
});

test("VS-4: taskSlot above the chapter gate unit / unknown item", () => {
  const above = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ taskSlots: [{ slot: "t", itemId: "g1u05.w.book", variantKey: null }] })] }]);
  assert.ok(validateStoryBundle(bundle({ story: above }), mkCorpus()).errors.some((e) => e.includes("VS-4") && e.includes("above")));
  const missing = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ taskSlots: [{ slot: "t", itemId: "g1u01.w.gone", variantKey: null }] })] }]);
  assert.ok(validateStoryBundle(bundle({ story: missing }), mkCorpus()).errors.some((e) => e.includes("VS-4")));
});

test("VS-5: unreachable scene and dead-end loop", () => {
  const orphan = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ next: null }), scene({ id: "g1.st.lp.ch01.s002", next: null })] }]);
  assert.ok(validateStoryBundle(bundle({ story: orphan }), mkCorpus()).errors.some((e) => e.includes("VS-5") && e.includes("unreachable")));
  const loop = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ id: "g1.st.lp.ch01.s001", next: "g1.st.lp.ch01.s002" }), scene({ id: "g1.st.lp.ch01.s002", next: "g1.st.lp.ch01.s001" })] }]);
  assert.ok(validateStoryBundle(bundle({ story: loop }), mkCorpus()).errors.some((e) => e.includes("VS-5") && e.includes("ending")));
});

test("VS-6: speaker not in cast", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ speaker: "ghost" })] }]);
  assert.ok(validateStoryBundle(bundle({ story: s }), mkCorpus()).errors.some((e) => e.includes("VS-6")));
});

test("VS-7: gloss word absent from the line", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ glosses: [{ word: "dragon", de: "Drache", scope: null }] })] }]);
  assert.ok(validateStoryBundle(bundle({ story: s }), mkCorpus()).errors.some((e) => e.includes("VS-7")));
});

test("VS-8: meta-talk in a student line", () => {
  const s = story([{ id: "g1.st.lp.ch01", unit: 1, titleEn: "T", titleDe: null, scenes: [scene({ textEn: "Look! The plural is here.", glosses: [{ word: "plural", de: "Mehrzahl", scope: null }] })] }]);
  // "plural" is glossed so VS-2 is clear, but VS-8 still bans the meta term in a student line
  assert.ok(validateStoryBundle(bundle({ story: s }), mkCorpus()).errors.some((e) => e.includes("VS-8")));
});

test("release gating: a released chapter whose gate unit is not ready", () => {
  const res = validateStoryBundle(
    bundle({ release: { schema: "story-release@1", storyId: "g1.st.lp", releasedChapters: ["g1.st.lp.ch01"] } }),
    mkCorpus({ ready: [] }), // unit not ready
  );
  assert.ok(res.errors.some((e) => e.includes("release") && e.includes("not approved")));
});

test("VS-10: story item carrier above level at its lock unit", () => {
  const items = StoryItems.parse({
    schema: "story-items@1",
    storyId: "g1.st.lp",
    vocabItems: [
      {
        id: "g1u01.w.dragon", rev: 1, difficulty: 1, w: "dragon", g: "Drache",
        d: "a big animal in old stories", s: "The ___ is here.", sSource: "invented",
        sAnswers: [{ text: "dragon", tier: "full" }],
        dAnswers: [{ text: "dragon", tier: "full" }],
        translation: { deToEn: [{ text: "dragon", tier: "full" }], enToDe: [{ text: "Drache", tier: "full" }] },
        gloss: [], mc: ["book", "pen", "desk"], hintDe: "ein Tier",
        provenance: { by: "fable", sbRef: null, seedV1: null, narrative: { storyId: "g1.st.lp", chapterId: "g1.st.lp.ch01" }, note: null },
        presentation: { variants: [], gameMeta: null, audio: null },
      },
    ],
    grammarItems: [],
  });
  // The clean carrier "The ___ is here." has no above-level word. Flip it by
  // putting an above-level word in the carrier itself (keeping the one blank):
  const itemsBad = StoryItems.parse({
    ...items,
    vocabItems: [{ ...items.vocabItems[0]!, s: "The ___ dragon is here." }],
  });
  assert.ok(validateStoryBundle(bundle({ storyItems: itemsBad }), mkCorpus()).errors.some((e) => e.includes("VS-10")));
});
