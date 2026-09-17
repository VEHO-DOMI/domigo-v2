import assert from "node:assert/strict";
import { test } from "node:test";
import { Cast, GameMap, Story, StoryFlags, StoryItems } from "@domigo/content-schema";
import { extractArrayLiteral, parseLegacyCampaign } from "../import-story.ts";
import fs from "node:fs";
import { loadStrandInputs, renderStrandTable, strandsDocPath } from "../strand-table.ts";
import { STORIES_DIR } from "../story-common.ts";
import { endingCoverage, strandManifest, validateStoryBundle, type StoryBundle, type StoryCorpus } from "../validate-story.ts";

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

function mkCorpus(opts: { allowed?: string[]; known?: string[]; ready?: string[]; generators?: string[] } = {}): StoryCorpus {
  const base = ["hello", "look", "here", "the", "book", "is", "go", "in", "wait", "for", "open", "and", "a", "we", "can", "it"];
  const allowed = new Set([...base, ...(opts.allowed ?? [])]);
  const known = new Set(opts.known ?? ["g1u01.w.book"]);
  const ready = new Set(opts.ready ?? ["g1-u01"]);
  const generators = new Set(opts.generators ?? ["school-room"]);
  const wordsOf = (s: string): string[] => s.toLowerCase().match(/[a-zäöüß']+/g) ?? [];
  return {
    itemExists: (id) => known.has(id),
    isUnitReady: (slug) => ready.has(slug),
    variantKeysOf: () => [],
    generatorExists: (g) => generators.has(g),
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

// ─────────────────────────────────────────── VS-15 ending coverage ────────

// Minimal flag-story builder for endingCoverage (bypasses the level gate — we
// only exercise the fork/gate graph walk). One fork (w01.a|w01.b, major, set in
// ch01), a FlagGate that reconverges to a single ending s003.
const FS = "g4.st.x";
const fscene = (n: number, next: unknown) => ({
  id: `${FS}.ch01.s${String(n).padStart(3, "0")}`,
  speaker: "narrator", textEn: "x", scaffoldDe: null, glosses: [], audio: null, taskSlots: [], next,
});
function flagStory(extraScenes: unknown[] = []) {
  return Story.parse({
    schema: "story@1", id: FS, grade: 4, title: { en: "X", de: null },
    chapters: [{
      id: `${FS}.ch01`, unit: 1, titleEn: "T", titleDe: null,
      scenes: [
        fscene(1, [
          { id: "a", textEn: "A", scaffoldDe: null, next: `${FS}.ch01.s002`, sets: ["w01.a"] },
          { id: "b", textEn: "B", scaffoldDe: null, next: `${FS}.ch01.s002`, sets: ["w01.b"] },
        ]),
        fscene(2, { kind: "flag", flag: "w01.a", then: `${FS}.ch01.s003`, else: `${FS}.ch01.s003` }),
        fscene(3, null),
        ...extraScenes,
      ],
    }],
  });
}
const flagsDecl = (major: boolean) => StoryFlags.parse({
  schema: "flags@1", storyId: FS,
  flags: [
    { id: "w01.a", label: "A", setIn: `${FS}.ch01`, major },
    { id: "w01.b", label: "B", setIn: `${FS}.ch01`, major },
  ],
});

test("VS-15: a reconverging fork story passes; the matrix reports 3 combos → 1 ending", () => {
  const res = endingCoverage(flagStory(), flagsDecl(true));
  assert.deepEqual(res.errors, []);
  assert.equal(res.infos.length, 1);
  assert.match(res.infos[0]!, /VS-15 — OK \(3 combos → 1 ending/); // neutral + {w01.a} + {w01.b}
});

test("VS-15: an authored ending that no combo routes to fails (orphaned)", () => {
  // s004 is a terminal (next:null) that nothing points to — an ending nobody can reach.
  const res = endingCoverage(flagStory([fscene(4, null)]), flagsDecl(true));
  assert.equal(res.infos.length, 0);
  assert.ok(res.errors.some((e) => /VS-15 — final-chapter ending .*s004 is reached by no flag combination \(orphaned\)/.test(e)), res.errors.join(" | "));
});

test("VS-15: minor-only flags (no major) are a no-op — flagless/minor stories untouched", () => {
  const res = endingCoverage(flagStory(), flagsDecl(false));
  assert.deepEqual(res.errors, []);
  assert.deepEqual(res.infos, []);
});

// ─────────────────────────────────────────────── VS-19 strand manifest ─────

// Three chapters: fork A (w01.a|w01.b) in ch01, read in ch02 (flagLine) and ch03
// (FlagGate); the last fork B (w03.a|w03.b) in ch03, read at its own ending.
const SM = "g4.st.sm";
const smScene = (ch: number, n: number, next: unknown, extra: Record<string, unknown> = {}) => ({
  id: `${SM}.ch0${ch}.s${String(n).padStart(3, "0")}`,
  speaker: "narrator", textEn: "x", scaffoldDe: null, glosses: [], audio: null, taskSlots: [], next, ...extra,
});
const smLine = (flag: string) => ({ flag, textEn: "y", scaffoldDe: null, glosses: [] });
function smStory(opts: { ch03GateOnA?: boolean } = {}) {
  const gate = opts.ch03GateOnA ?? true;
  return Story.parse({
    schema: "story@1", id: SM, grade: 4, title: { en: "X", de: null },
    chapters: [
      { id: `${SM}.ch01`, unit: 1, titleEn: "T", titleDe: null, scenes: [
        smScene(1, 1, [
          { id: "a", textEn: "A", scaffoldDe: null, next: `${SM}.ch01.s002`, sets: ["w01.a"] },
          { id: "b", textEn: "B", scaffoldDe: null, next: `${SM}.ch01.s002`, sets: ["w01.b"] },
        ]),
        smScene(1, 2, null),
      ] },
      { id: `${SM}.ch02`, unit: 2, titleEn: "T", titleDe: null, scenes: [
        smScene(2, 1, null, { flagLines: [smLine("w01.a"), smLine("w01.b")], taskSlots: [{ slot: "recap", itemId: "g4u02.ci.x.mc.001", variantKey: null }] }),
      ] },
      { id: `${SM}.ch03`, unit: 3, titleEn: "T", titleDe: null, scenes: [
        smScene(3, 1, gate ? { kind: "flag", flag: "w01.a", then: `${SM}.ch03.s002`, else: `${SM}.ch03.s002` } : `${SM}.ch03.s002`),
        smScene(3, 2, [
          { id: "a", textEn: "A", scaffoldDe: null, next: `${SM}.ch03.s003`, sets: ["w03.a"] },
          { id: "b", textEn: "B", scaffoldDe: null, next: `${SM}.ch03.s003`, sets: ["w03.b"] },
        ]),
        smScene(3, 3, null, { flagLines: [smLine("w03.a"), smLine("w03.b")] }),
      ] },
    ],
  });
}
type Fork = NonNullable<StoryFlags["forks"]>[number];
function smFlags(forkPatch: (forks: Fork[]) => Fork[] = (f) => f, extraFlags: StoryFlags["flags"] = []) {
  const flag = (id: string, ch: number) => ({ id, label: id, setIn: `${SM}.ch0${ch}`, major: true });
  const forks: Fork[] = [
    { id: "F1", unit: 1, question: "A?", major: true, status: "built", options: [{ flag: "w01.a", label: "w01.a" }, { flag: "w01.b", label: "w01.b" }], visibleIn: [2, 3], recap: [{ unit: 2, itemId: "g4u02.ci.x.mc.001" }], note: null },
    { id: "F2", unit: 3, question: "B?", major: true, status: "built", options: [{ flag: "w03.a", label: "w03.a" }, { flag: "w03.b", label: "w03.b" }], visibleIn: [3], recap: [], note: null },
    { id: "N1", unit: 2, question: "C?", major: false, status: "planned", options: [{ flag: "w02.x", label: "x" }, { flag: "w02.y", label: "y" }], visibleIn: [3], recap: [{ unit: 3, itemId: null }], note: null },
  ];
  return StoryFlags.parse({ schema: "flags@1", storyId: SM, flags: [flag("w01.a", 1), flag("w01.b", 1), flag("w03.a", 3), flag("w03.b", 3), ...extraFlags], forks: forkPatch(forks) });
}
const smComp = { schema: "comprehension@1" as const, storyId: SM, items: [{ id: "g4u02.ci.x.mc.001" }] } as unknown as Parameters<typeof strandManifest>[2];

test("VS-19: a manifest that matches the play passes and reports each fork", () => {
  const res = strandManifest(smStory(), smFlags(), smComp);
  assert.deepEqual(res.errors, []);
  assert.match(res.infos[0]!, /VS-19 — OK \(3 fork\(s\)\): F1 U1 → \[2, 3\] · F2 U3 → \[3\] · N1 U2 \(planned\) → \[3\]/);
});

test("VS-19 tamper: visibleIn that drops a unit the story reads is red", () => {
  const res = strandManifest(smStory(), smFlags((f) => f.map((k) => (k.id === "F1" ? { ...k, visibleIn: [2] } : k))), smComp);
  assert.ok(res.errors.some((e) => /fork F1 — visibleIn \[2\] but the story reads it in units \[2, 3\]/.test(e)), res.errors.join(" | "));
});

test("VS-19: a major fork before the last one that shows in only one later unit is red", () => {
  const res = strandManifest(smStory({ ch03GateOnA: false }), smFlags((f) => f.map((k) => (k.id === "F1" ? { ...k, visibleIn: [2] } : k))), smComp);
  assert.ok(res.errors.some((e) => /fork F1 — a major fork before the last one must show in >= 2 later units \(shows in 1\)/.test(e)), res.errors.join(" | "));
});

test("VS-19: a planned fork whose flag is already declared is red", () => {
  const res = strandManifest(smStory(), smFlags(undefined, [{ id: "w02.x", label: "x", setIn: `${SM}.ch02`, major: false }]), smComp);
  assert.ok(res.errors.some((e) => /fork N1 — planned, but flag "w02.x" is already declared or used/.test(e)), res.errors.join(" | "));
  assert.ok(res.errors.some((e) => /declared flag "w02.x" sits in a planned fork/.test(e)), res.errors.join(" | "));
});

test("VS-19: a declared flag outside every fork, and a recap that is not in comprehension.json, are red", () => {
  const res = strandManifest(smStory(), smFlags((f) => f.filter((k) => k.id !== "F2")), { ...smComp!, items: [] });
  assert.ok(res.errors.some((e) => /declared flag "w03.a" belongs to no fork/.test(e)), res.errors.join(" | "));
  assert.ok(res.errors.some((e) => /recap g4u02.ci.x.mc.001 is not in comprehension.json/.test(e)), res.errors.join(" | "));
});

test("VS-19: no forks declared = no-op (stories without a manifest are untouched)", () => {
  const res = strandManifest(smStory(), StoryFlags.parse({ ...smFlags(), forks: undefined }), smComp);
  assert.deepEqual(res, { errors: [], infos: [] });
});

test("strand table: every committed docs/handover/strands/<id>.md equals its render (no hand drift)", () => {
  let checked = 0;
  for (const id of fs.readdirSync(STORIES_DIR).filter((n) => /^g[1-4]\.st\.[a-z0-9-]+$/.test(n))) {
    const inputs = loadStrandInputs(id);
    if (inputs === null) continue;
    const doc = strandsDocPath(id);
    assert.ok(fs.existsSync(doc), `${id} declares forks but ${doc} is missing — run pnpm content story strands --story ${id} --write`);
    assert.equal(fs.readFileSync(doc, "utf8"), renderStrandTable(inputs.story, inputs.flags), `${doc} drifted — re-render it`);
    checked += 1;
  }
  assert.ok(checked >= 1, "no story with a strand manifest found");
});

// ─────────────────────────────────────────────── VS-18 map@1 integrity (B-2) ──

function mkMap(zones?: Array<Record<string, unknown>>) {
  return GameMap.parse({
    schema: "map@1",
    id: "g1.map.lp",
    grade: 1,
    zones: zones ?? [
      { id: "g1.map.lp.z01", unit: 1, titleEn: "Classroom", titleDe: "Klassenzimmer", width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 101 } },
    ],
  });
}

test("VS-18: a matching map (1:1 units, registered generator) passes", () => {
  const res = validateStoryBundle(bundle({ map: mkMap() }), mkCorpus());
  assert.deepEqual(res.errors, []);
});

test("VS-18: a zone unit with no chapter (and vice versa) fails the bijection", () => {
  const m = mkMap([
    { id: "g1.map.lp.z01", unit: 2, titleEn: "Aula", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 102 } },
  ]);
  const res = validateStoryBundle(bundle({ map: m }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-18") && e.includes("zone unit 2 has no chapter")), res.errors.join(" | "));
  assert.ok(res.errors.some((e) => e.includes("VS-18") && e.includes("chapter unit 1 has no zone")), res.errors.join(" | "));
});

test("VS-18: zone count != chapter count fails", () => {
  const m = mkMap([
    { id: "g1.map.lp.z01", unit: 1, titleEn: "A", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 101 } },
    { id: "g1.map.lp.z02", unit: 2, titleEn: "B", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 102 } },
  ]);
  const res = validateStoryBundle(bundle({ map: m }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-18") && e.includes("2 zone(s) but 1 mappable chapter(s)")), res.errors.join(" | "));
});

test("VS-18: an unregistered render.generator fails; render:null is info-only (art deferred)", () => {
  const bad = mkMap([
    { id: "g1.map.lp.z01", unit: 1, titleEn: "A", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "no-such-theme", seed: 101 } },
  ]);
  const res = validateStoryBundle(bundle({ map: bad }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-18") && e.includes('"no-such-theme"')), res.errors.join(" | "));

  const deferred = mkMap([
    { id: "g1.map.lp.z01", unit: 1, titleEn: "A", titleDe: null, width: 15, height: 11, tileSize: 16, render: null },
  ]);
  const res2 = validateStoryBundle(bundle({ map: deferred }), mkCorpus());
  assert.deepEqual(res2.errors, []);
  assert.ok(res2.infos.some((i) => i.includes("VS-18") && i.includes("render deferred")), res2.infos.join(" | "));
});

test("VS-18: a map whose id/grade disagrees with the story fails", () => {
  const m = GameMap.parse({
    schema: "map@1",
    id: "g1.map.other",
    grade: 1,
    zones: [{ id: "g1.map.other.z01", unit: 1, titleEn: "A", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 101 } }],
  });
  const res = validateStoryBundle(bundle({ map: m }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("VS-18") && e.includes("does not match the story slug")), res.errors.join(" | "));
});

// ────────────────────────────── VS-18 W-1 WORLD-ALIVE floor-plan laws ────────

/** A clean 15×11 layout: door '1' → z02 in the top wall, 2 E, the NPC, one P. */
const GOOD_ROWS = [
  "#######1#######",
  "#.....E.......#",
  "#.............#",
  "#......P......#",
  "#..........E..#",
  "#......F......#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "###############",
];
function zoneWith(layout: Record<string, unknown> | undefined, over: Record<string, unknown> = {}) {
  return { id: "g1.map.lp.z01", unit: 1, titleEn: "A", titleDe: null, width: 15, height: 11, tileSize: 16, render: { generator: "school-room", seed: 101 }, layout, ...over };
}
const Z02 = { id: "g1.map.lp.z02", unit: 2, titleEn: "B", titleDe: null, width: 15, height: 11, tileSize: 16, render: null };
const TWO_CHAPTERS = story([
  { id: "g1.st.lp.ch01", unit: 1, titleEn: "T1", titleDe: null, scenes: [scene()] },
  { id: "g1.st.lp.ch02", unit: 2, titleEn: "T2", titleDe: null, scenes: [scene({ id: "g1.st.lp.ch02.s001" })] },
]);

test("VS-18/W-1: a clean data floor plan passes (door to a legacy zone is exempt from reciprocity)", () => {
  const m = mkMap([zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z02" } }, encounters: 2 }), Z02]);
  const res = validateStoryBundle(bundle({ story: TWO_CHAPTERS, map: m }), mkCorpus());
  assert.deepEqual(res.errors, []);
  assert.ok(res.infos.some((i) => i.includes("data floor plans: z01")));
});

test("VS-18/W-1: ragged rows, sub-viewport size, and dim-field mismatch all fail", () => {
  // (a SHORT row is already rejected by the ZoneLayout schema's .min(15) — the
  // validator law catches the case the schema can't: a row LONGER than the rest)
  const ragged = mkMap([zoneWith({ rows: [...GOOD_ROWS.slice(0, 10), "#" .repeat(16)], legend: {} })]);
  assert.ok(validateStoryBundle(bundle({ map: ragged }), mkCorpus()).errors.some((e) => e.includes("not rectangular")));
  const dims = mkMap([zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z02" } } }, { width: 28, height: 18 })]);
  assert.ok(validateStoryBundle(bundle({ map: dims }), mkCorpus()).errors.some((e) => e.includes("do not match the layout")));
});

test("VS-18/W-1: an unknown glyph fails (every mark on the map means something)", () => {
  const rows = GOOD_ROWS.map((r, i) => (i === 2 ? "#....?........#" : r));
  const m = mkMap([zoneWith({ rows, legend: { "1": { door: "z02" } } })]);
  assert.ok(validateStoryBundle(bundle({ map: m }), mkCorpus()).errors.some((e) => e.includes('glyph "?"')));
});

test("VS-18/W-1: doors must lead somewhere real — unknown zones and door-to-self fail", () => {
  const unknown = mkMap([zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z09" } } })]);
  assert.ok(validateStoryBundle(bundle({ map: unknown }), mkCorpus()).errors.some((e) => e.includes('unknown zone "z09"')));
  const self = mkMap([zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z01" } } })]);
  assert.ok(validateStoryBundle(bundle({ map: self }), mkCorpus()).errors.some((e) => e.includes("leads to itself")));
});

test("VS-18/W-1: a one-way world fails — layout targets need a door back", () => {
  const z02rows = GOOD_ROWS.map((r, i) => (i === 0 ? "###############" : r)); // no door back
  const m = mkMap([
    zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z02" } }, encounters: 2 }),
    { ...Z02, layout: { rows: z02rows, legend: {}, encounters: 2 } },
  ]);
  const res = validateStoryBundle(bundle({ story: TWO_CHAPTERS, map: m }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("no door back")), res.errors.join(" | "));
});

test("VS-18/W-1: declaring more battles than E cells fails; two P starts fail", () => {
  const greedy = mkMap([zoneWith({ rows: GOOD_ROWS, legend: { "1": { door: "z02" } }, encounters: 9 })]);
  assert.ok(validateStoryBundle(bundle({ map: greedy }), mkCorpus()).errors.some((e) => e.includes("only 2 E cell(s)")));
  const rows = GOOD_ROWS.map((r, i) => (i === 6 ? "#....P........#" : r));
  const twoP = mkMap([zoneWith({ rows, legend: { "1": { door: "z02" } } })]);
  assert.ok(validateStoryBundle(bundle({ map: twoP }), mkCorpus()).errors.some((e) => e.includes("exactly one P")));
});

test("VS-18/W-1: a walled-off E is unreachable and fails the BFS law", () => {
  const rows = [
    "#######1#######",
    "#.....E....####",
    "#..........#E##",
    "#......P...####",
    "#.............#",
    "#......F......#",
    "#.............#",
    "#.............#",
    "#.............#",
    "#.............#",
    "###############",
  ];
  const m = mkMap([zoneWith({ rows, legend: { "1": { door: "z02" } }, encounters: 2 })]);
  const res = validateStoryBundle(bundle({ map: m }), mkCorpus());
  assert.ok(res.errors.some((e) => e.includes("unreachable from P")), res.errors.join(" | "));
});
