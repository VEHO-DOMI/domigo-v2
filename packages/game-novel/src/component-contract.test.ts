import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { runInNewContext } from "node:vm";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";
import * as copy from "./novel-copy.ts";
import * as episode from "./episode-state.ts";
import * as storage from "./save-state.ts";
import { storyItemKey } from "@domigo/game-core";

type Props = Record<string, unknown>;
type Element = { type: unknown; props: Props };
type Component = (props: Props) => unknown;

// Run the ACTUAL TSX functions/callbacks without a browser or a second React
// renderer dependency. Hooks retain state between explicit renders; external
// visual components are markers. This tests wiring/state, not layout or React's
// scheduler. In particular no copy of onScored/TaskTake is tested here.
let active: Host;
class Host {
  cells: unknown[] = [];
  cursor = 0;
  render(component: Component, props: Props) {
    this.cursor = 0; active = this;
    return component(props);
  }
}
function useState(initial: unknown) {
  const host = active, index = host.cursor++;
  if (!(index in host.cells)) host.cells[index] = typeof initial === "function" ? initial() : initial;
  return [host.cells[index], (value: unknown) => { host.cells[index] = typeof value === "function" ? value(host.cells[index]) : value; }];
}
const modules: Record<string, unknown> = {
  react: { useState, useRef: (value: unknown) => useState({ current: value })[0], useMemo: (fn: () => unknown) => fn(), useEffect: () => {} },
  "react/jsx-runtime": { jsx: (type: unknown, props: Props) => ({ type, props }), jsxs: (type: unknown, props: Props) => ({ type, props }) },
  "@domigo/game-feel": { ChoiceContent: "ChoiceContent", DialogueReveal: "DialogueReveal", GlossReveal: "GlossReveal", LangToggle: "LangToggle", primaryLine: (_mode: string, en: string) => en, useLangMode: () => "en" },
  "@domigo/game-core": { storyItemKey },
  "@domigo/task-ui": { GrammarItemView: "GrammarItemView", VocabItemView: "VocabItemView" },
  "./art.tsx": { CastAvatar: "CastAvatar", CommentSection: "CommentSection" },
  "./novel-copy.ts": copy, "./episode-state.ts": episode, "./save-state.ts": storage,
  "./audience.tsx": { Audience: "Audience" }, "./novel.css": {},
};
const source = readFileSync(new URL("./NovelGame.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText;
const exports: Record<string, Component> = {};
runInNewContext(compiled, { exports, crypto: { randomUUID }, require: (id: string) => {
  assert.ok(id in modules, `Unmodelled component import: ${id}`); return modules[id];
} });
const NovelGame = exports.NovelGame!;
function nodes(tree: unknown): Element[] {
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  if (!tree || typeof tree !== "object" || !("props" in tree)) return [];
  const element = tree as Element;
  return [element, ...nodes(element.props.children)];
}
function text(tree: unknown): string {
  if (Array.isArray(tree)) return tree.map(text).join("");
  if (typeof tree === "string" || typeof tree === "number") return String(tree);
  if (tree && typeof tree === "object" && "props" in tree) return text((tree as Element).props.children);
  return "";
}
function find(tree: unknown, predicate: (el: Element) => boolean): Element {
  const node = nodes(tree).find(predicate); assert.ok(node, "component node missing"); return node;
}
function invoke(node: Element, key: string, ...args: unknown[]) {
  const fn = node.props[key]; assert.equal(typeof fn, "function"); (fn as (...args: unknown[]) => void)(...args);
}
const read = (path: string) => JSON.parse(readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8"));
const base = "content/corpus/stories/g3.st.fourteen/";
const story = read(base + "story.json");
const economy = read(base + "economy.json").episodes;
const chapter = story.chapters[1];
const scene = chapter.scenes.find((s: { taskSlots: unknown[] }) => s.taskSlots.length);
const slot = scene.taskSlots[0];
const item = read(base + "comprehension.json").items.find((i: { id: string }) => i.id === slot.itemId);
function fixture(over: Props = {}) {
  const saves: Props[] = [];
  const props: Props = { chapter, economy, episodeTitle: chapter.titleEn, castNames: {}, storyItems: { [slot.itemId]: { kind: "grammar", item } },
    initialSave: { chapterId: chapter.id, sceneId: scene.id, takes: [] },
    onAttempt: async () => ({ ok: true, queued: false, tier: "correct" }), onSave: (save: Props) => saves.push(save), ...over };
  const host = new Host();
  const render = () => host.render(NovelGame, props);
  const open = () => { invoke(find(render(), el => el.type === "button" && text(el).startsWith("Your turn")), "onClick"); return take(); };
  const take = () => find(render(), el => typeof el.type === "function" && el.type.name === "TaskTake");
  return { props, saves, render, open, take };
}

test("actual onScored and Continue count a replayed slot only once", async () => {
  const game = fixture(); const initial = game.open(); const taskHost = new Host();
  const render = () => { const take = game.take(); return taskHost.render(take.type as Component, take.props); };
  assert.equal(typeof initial.type, "function");
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt) invoke(find(render(), el => el.type === "button" && text(el).startsWith("Try this line again")), "onClick");
    invoke(find(render(), el => el.type === "GrammarItemView"), "onResult", "correct", { itemId: item.id, input: { kind: "text", value: "fixture" } });
    await setImmediate();
    assert.deepEqual(Array.from(game.saves.at(-1)!.takes as string[]), [slot.slot], `attempt ${attempt + 1}`);
  }
  invoke(find(render(), el => el.type === "button" && text(el) === copy.COPY.continue), "onClick");
  assert.deepEqual(Array.from(game.saves.at(-1)!.takes as string[]), [slot.slot], "Continue also deduplicates");
});

test("actual task response renders each grammar explanation and vocabulary meaning", () => {
  const take = fixture().open();
  for (const kind of ["grammar", "vocab"]) for (const marker of ["Source wording one", "Different source wording two"]) {
    const props = { ...take.props, item: { kind, item: { ...item, explainDe: kind === "grammar" ? marker : "wrong source", g: kind === "vocab" ? marker : "wrong source" } }, initialResult: { tier: "correct", status: "saved" } };
    const tree = new Host().render(take.type as Component, props);
    const response = find(tree, el => el.props.role === "status");
    assert.ok(nodes(response).some(el => el.type === "p" && text(el) === marker), `${kind}: explanation comes from the item`);
    assert.ok(!text(response).includes("wrong source"));
  }
});

test("actual restored TaskTake never invents a receipt", () => {
  const take = fixture().open();
  for (const preview of [false, true]) for (const status of [undefined, "queued", "saved"]) {
    const tree = new Host().render(take.type as Component, { ...take.props, preview, initialResult: { tier: "correct", status } });
    const receipt = find(tree, el => "data-save-state" in el.props);
    const expected = preview ? "preview" : status === "saved" ? "saved" : "unknown";
    assert.equal(receipt.props["data-save-state"], expected);
    assert.equal(text(receipt), storage.SAVE_COPY[expected]);
  }
});

test("actual submission renders saving and every reply honestly, including preview", async () => {
  const take = fixture().open();
  for (const preview of [false, true]) for (const reply of [
    { ok: true, queued: false }, { ok: false, queued: true }, { ok: false, queued: false },
  ]) {
    let acknowledge!: (reply: { ok: boolean; queued: boolean }) => void;
    const pending = new Promise(resolve => { acknowledge = resolve; });
    const host = new Host();
    const props = { ...take.props, preview, onAttempt: () => pending };
    const render = () => host.render(take.type as Component, props);
    invoke(find(render(), el => el.type === "GrammarItemView"), "onResult", "correct", { itemId: item.id, input: { kind: "text", value: "fixture" } });
    assert.equal(find(render(), el => "data-save-state" in el.props).props["data-save-state"], preview ? "preview" : "saving");
    acknowledge(reply); await setImmediate();
    const expected = preview ? "preview" : reply.ok ? "saved" : reply.queued ? "queued" : "failed";
    const receipt = find(render(), el => "data-save-state" in el.props);
    assert.equal(receipt.props["data-save-state"], expected);
    assert.equal(text(receipt), storage.SAVE_COPY[expected]);
  }
});

test("actual ending Audience receives the same economy rows for every answer quality", () => {
  for (const tier of ["correct", "partial", "wrong"]) {
    const results = { [slot.slot]: { tier, status: "saved", itemKey: slot.itemId } };
    const game = fixture({ initialSave: { chapterId: chapter.id, sceneId: scene.id, takes: [slot.slot], results, stage: "finished" } });
    const audience = find(game.render(), el => el.type === "Audience");
    assert.equal(audience.props.current, economy[1], tier);
    assert.equal(audience.props.previous, economy[0], tier);
    const quote = find(game.render(), el => el.type === "blockquote");
    assert.equal(text(quote), chapter.scenes.at(-1).textEn, "ending uses Koki's final story line");
  }
});
